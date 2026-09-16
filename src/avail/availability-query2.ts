import { AvailabilityMode } from './availability-mode';
import { AvailabilityReferences } from './availability-references';
import type { AvailabilityModeValue } from './availability-mode';
import type { AvailabilityReferencesValue } from './availability-references';
import {
  ContextRefType,
  Sdmx3SeriesKeyType,
  NestedNCNameIDType,
  FiltersType,
} from '../utils/sdmx-patterns';
import {
  isValidEnum,
  isValidPattern,
  isValidDate,
  createErrorMessage,
} from '../utils/validators';

export interface AvailabilityQuery2Input {
  context?: string;
  key?: string;
  component?: string;
  updatedAfter?: string;
  filters?: string | readonly string[];
  mode?: AvailabilityModeValue;
  references?: AvailabilityReferencesValue;
}

export interface AvailabilityQuery2Value {
  context: string;
  key: string;
  component: string;
  updatedAfter?: string;
  filters: string[];
  mode: AvailabilityModeValue;
  references: AvailabilityReferencesValue;
}

const defaults: Pick<
  AvailabilityQuery2Value,
  'context' | 'key' | 'component' | 'filters' | 'mode' | 'references'
> = {
  context: '*=*:*(*)',
  key: '*',
  component: '*',
  filters: [],
  mode: AvailabilityMode.EXACT,
  references: AvailabilityReferences.NONE,
};

const isValidKey = (input: string, name: string, errors: string[]): boolean => {
  const values = input.indexOf(',') > -1 ? input.split(',') : [input];
  return values
    .map((value) => isValidPattern(value, Sdmx3SeriesKeyType, name, errors))
    .every(Boolean);
};

const isValidFilters = (
  input: string[],
  name: string,
  errors: string[],
): boolean => {
  return input
    .map((filter) => isValidPattern(filter, FiltersType, name, errors))
    .every(Boolean);
};

const isValidComp = (
  input: string,
  name: string,
  errors: string[],
): boolean => {
  if (input !== '*') {
    const values = input.indexOf(',') > -1 ? input.split(',') : [input];
    return values
      .map((value) => isValidPattern(value, NestedNCNameIDType, name, errors))
      .every(Boolean);
  }
  return true;
};

type AvailabilityQuery2Field = keyof AvailabilityQuery2Value;
type QueryValidators = {
  [K in AvailabilityQuery2Field]: (
    input: AvailabilityQuery2Value[K],
    errors: string[],
  ) => boolean;
};

const ValidQuery: QueryValidators = {
  context: (i, e) => isValidPattern(i, ContextRefType, 'context', e),
  key: (i, e) => isValidKey(i, 'series key', e),
  component: (i, e) => isValidComp(i, 'component', e),
  updatedAfter: (i, e) => !i || isValidDate(i, 'updatedAfter', e),
  filters: (i, e) => isValidFilters(i, 'filters', e),
  mode: (i, e) => isValidEnum(i, AvailabilityMode, 'mode', e),
  references: (i, e) => isValidEnum(i, AvailabilityReferences, 'references', e),
};

const isValidQuery = (
  q: AvailabilityQuery2Value,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const checks = [
    () => ValidQuery.context(q.context, errors),
    () => ValidQuery.key(q.key, errors),
    () => ValidQuery.component(q.component, errors),
    () => ValidQuery.updatedAfter(q.updatedAfter, errors),
    () => ValidQuery.filters(q.filters, errors),
    () => ValidQuery.mode(q.mode, errors),
    () => ValidQuery.references(q.references, errors),
  ];

  for (const check of checks) {
    const isValid = check();
    if (!isValid) {
      return { isValid: false, errors };
    }
  }

  return { isValid: true, errors };
};

const expected = [
  'context',
  'key',
  'component',
  'updatedAfter',
  'filters',
  'mode',
  'references',
] as const;

class AvailabilityQuery2Builder {
  static from(opts?: AvailabilityQuery2Input | null): AvailabilityQuery2Value {
    if (opts) {
      for (const k of Object.keys(opts)) {
        if (!expected.includes(k as (typeof expected)[number])) {
          throw Error(createErrorMessage([], 'availability query'));
        }
      }
    }
    const context = opts?.context ?? defaults.context;
    const key = opts?.key ?? defaults.key;
    const filtersInput = opts?.filters ?? defaults.filters;
    const filters = Array.isArray(filtersInput)
      ? [...filtersInput]
      : [filtersInput];
    const query: AvailabilityQuery2Value = {
      context,
      key,
      component: opts?.component ?? defaults.component,
      updatedAfter: opts?.updatedAfter,
      filters,
      mode: opts?.mode ?? defaults.mode,
      references: opts?.references ?? defaults.references,
    };
    const input = isValidQuery(query);
    if (!input.isValid) {
      throw Error(createErrorMessage(input.errors, 'availability query'));
    }
    return query;
  }
}

export { AvailabilityQuery2Builder as AvailabilityQuery2 };
