import { AvailabilityMode } from './availability-mode';
import { AvailabilityReferences } from './availability-references';
import type { AvailabilityModeValue } from './availability-mode';
import type { AvailabilityReferencesValue } from './availability-references';
import {
  FlowRefType,
  SeriesKeyType,
  MultipleProviderRefType,
  NestedNCNameIDType,
} from '../utils/sdmx-patterns';
import {
  isValidEnum,
  isValidPattern,
  isValidPeriod,
  isValidDate,
  createErrorMessage,
} from '../utils/validators';

type KeyDimensionValue = string | readonly string[] | null | undefined;

export interface AvailabilityQueryInput {
  flow?: string;
  key?: string | readonly KeyDimensionValue[];
  provider?: string | readonly string[];
  component?: string;
  start?: string;
  end?: string;
  updatedAfter?: string;
  mode?: AvailabilityModeValue;
  references?: AvailabilityReferencesValue;
}

export interface AvailabilityQueryValue {
  flow: string;
  key: string;
  provider: string;
  component: string;
  start?: string;
  end?: string;
  updatedAfter?: string;
  mode: AvailabilityModeValue;
  references: AvailabilityReferencesValue;
}

const defaults: Pick<
  AvailabilityQueryValue,
  'key' | 'provider' | 'component' | 'mode' | 'references'
> = {
  key: 'all',
  provider: 'all',
  component: 'all',
  mode: AvailabilityMode.EXACT,
  references: AvailabilityReferences.NONE,
};

type AvailabilityQueryField = keyof AvailabilityQueryValue;
type QueryValidators = {
  [K in AvailabilityQueryField]: (
    input: AvailabilityQueryValue[K],
    errors: string[],
  ) => boolean;
};

const ValidQuery: QueryValidators = {
  flow: (i, e) => isValidPattern(i, FlowRefType, 'flows', e),
  key: (i, e) => isValidPattern(i, SeriesKeyType, 'series key', e),
  provider: (i, e) => isValidPattern(i, MultipleProviderRefType, 'provider', e),
  component: (i, e) => isValidPattern(i, NestedNCNameIDType, 'component', e),
  start: (i, e) => !i || isValidPeriod(i, 'start period', e),
  end: (i, e) => !i || isValidPeriod(i, 'end period', e),
  updatedAfter: (i, e) => !i || isValidDate(i, 'updatedAfter', e),
  mode: (i, e) => isValidEnum(i, AvailabilityMode, 'mode', e),
  references: (i, e) => isValidEnum(i, AvailabilityReferences, 'references', e),
};

const isValidQuery = (
  q: AvailabilityQueryValue,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const checks = [
    () => ValidQuery.flow(q.flow, errors),
    () => ValidQuery.key(q.key, errors),
    () => ValidQuery.provider(q.provider, errors),
    () => ValidQuery.component(q.component, errors),
    () => ValidQuery.start(q.start, errors),
    () => ValidQuery.end(q.end, errors),
    () => ValidQuery.updatedAfter(q.updatedAfter, errors),
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

const toKeyString = (dims: readonly KeyDimensionValue[]): string =>
  dims.map((d) => (Array.isArray(d) ? d.join('+') : (d ?? ''))).join('.');

const toProviderString = (p: readonly string[]): string => p.join('+');

// A query for data availability, as defined by the SDMX RESTful API.
class AvailabilityQueryBuilder {
  static from(opts?: AvailabilityQueryInput | null): AvailabilityQueryValue {
    const flow = opts?.flow ?? '';
    const keyInput = opts?.key ?? defaults.key;
    let key: string;
    if (typeof keyInput === 'string') {
      key = keyInput;
    } else {
      key = toKeyString(keyInput);
    }
    const providerInput = opts?.provider ?? defaults.provider;
    let provider: string;
    if (typeof providerInput === 'string') {
      provider = providerInput;
    } else {
      provider = toProviderString(providerInput);
    }
    const query: AvailabilityQueryValue = {
      flow,
      key,
      provider,
      component: opts?.component ?? defaults.component,
      start: opts?.start,
      end: opts?.end,
      updatedAfter: opts?.updatedAfter,
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

export { AvailabilityQueryBuilder as AvailabilityQuery };
