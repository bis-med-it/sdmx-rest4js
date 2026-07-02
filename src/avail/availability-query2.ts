import { AvailabilityMode } from './availability-mode';
import { AvailabilityReferences } from './availability-references';
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

const defaults = {
  context: '*=*:*(*)',
  key: '*',
  component: '*',
  filters: [],
  mode: AvailabilityMode.EXACT,
  references: AvailabilityReferences.NONE,
};

const isValidKey = (input: any, name: string, errors: string[]): boolean => {
  let valid = true;
  if (input.indexOf(',') > -1) {
    for (const i of input.split(',')) {
      const r = isValidPattern(i, Sdmx3SeriesKeyType, name, errors);
      if (!r) valid = false;
    }
  } else {
    const r = isValidPattern(input, Sdmx3SeriesKeyType, name, errors);
    if (!r) valid = false;
  }
  return valid;
};

const isValidFilters = (
  input: any,
  name: string,
  errors: string[]
): boolean => {
  let valid = true;
  for (const filter of input) {
    const r = isValidPattern(filter, FiltersType, name, errors);
    if (!r) valid = false;
  }
  return valid;
};

const isValidComp = (input: any, name: string, errors: string[]): boolean => {
  let valid = true;
  if (input !== '*') {
    if (input.indexOf(',') > -1) {
      for (const i of input.split(',')) {
        const r = isValidPattern(i, NestedNCNameIDType, name, errors);
        if (!r) valid = false;
      }
    } else {
      const r = isValidPattern(input, NestedNCNameIDType, name, errors);
      if (!r) valid = false;
    }
  }
  return valid;
};

const ValidQuery: { [key: string]: (i: any, e: string[]) => any } = {
  context: (i, e) => isValidPattern(i, ContextRefType, 'context', e),
  key: (i, e) => isValidKey(i, 'series key', e),
  component: (i, e) => isValidComp(i, 'component', e),
  updatedAfter: (i, e) => !i || isValidDate(i, 'updatedAfter', e),
  filters: (i, e) => isValidFilters(i, 'filters', e),
  mode: (i, e) => isValidEnum(i, AvailabilityMode, 'mode', e),
  references: (i, e) => isValidEnum(i, AvailabilityReferences,
    'references', e),
};

const isValidQuery = (q: any): { isValid: any; errors: string[] } => {
  const errors: string[] = [];
  let isValid: any = false;
  for (const k of Object.keys(q)) {
    isValid = ValidQuery[k](q[k], errors);
    if (!isValid) break;
  }
  return { isValid, errors };
};

const expected = [
  'context',
  'key',
  'component',
  'updatedAfter',
  'filters',
  'mode',
  'references',
];

class AvailabilityQuery {

  static from(opts: any): any {
    if (opts) {
      for (const k of Object.keys(opts)) {
        if (expected.indexOf(k) === -1) {
          throw Error(createErrorMessage([], 'availability query'));
        }
      }
    }
    const context = opts?.context ?? defaults.context;
    const key = opts?.key ?? defaults.key;
    let filters = opts?.filters ?? defaults.filters;
    if (!Array.isArray(filters)) filters = [filters];
    const query = {
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

export { AvailabilityQuery as AvailabilityQuery2 };
