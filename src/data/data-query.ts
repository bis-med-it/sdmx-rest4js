import { DataDetail } from './data-detail';
import type { DataDetailValue } from './data-detail';
import {
  FlowRefType,
  SeriesKeyType,
  MultipleProviderRefType,
  NCNameIDType,
} from '../utils/sdmx-patterns';
import {
  isValidEnum,
  isValidPattern,
  isValidPeriod,
  isValidDate,
  createErrorMessage,
} from '../utils/validators';

type KeyDimensionValue = string | readonly string[] | null | undefined;

export interface DataQueryInput {
  flow?: string;
  key?: string | readonly KeyDimensionValue[];
  provider?: string | readonly string[];
  start?: string;
  end?: string;
  updatedAfter?: string;
  firstNObs?: number;
  lastNObs?: number;
  obsDimension?: string;
  detail?: DataDetailValue;
  history?: boolean;
}

export interface DataQueryValue {
  flow: string;
  key: string;
  provider: string;
  start?: string;
  end?: string;
  updatedAfter?: string;
  firstNObs?: number;
  lastNObs?: number;
  obsDimension?: string;
  detail: DataDetailValue;
  history: boolean;
}

const defaults: Pick<
  DataQueryValue,
  'key' | 'provider' | 'detail' | 'history'
> = {
  key: 'all',
  provider: 'all',
  detail: DataDetail.FULL,
  history: false,
};

const isValidHistory = (input: boolean, errors: string[]): boolean => {
  const valid = typeof input === 'boolean';
  if (!valid) {
    errors.push(
      `${input} is not a valid value for history. Must be true or false`,
    );
  }
  return valid;
};

const isValidNObs = (
  input: number,
  name: string,
  errors: string[],
): boolean => {
  const valid = typeof input === 'number' && input > 0;
  if (!valid) {
    errors.push(
      `${input} is not a valid value for ${name}. Must be a positive integer`,
    );
  }
  return valid;
};

type DataQueryField = keyof DataQueryValue;
type QueryValidators = {
  [K in DataQueryField]: (
    input: DataQueryValue[K],
    errors: string[],
  ) => boolean;
};

const ValidQuery: QueryValidators = {
  flow: (i, e) => isValidPattern(i, FlowRefType, 'flows', e),
  key: (i, e) => isValidPattern(i, SeriesKeyType, 'series key', e),
  provider: (i, e) => isValidPattern(i, MultipleProviderRefType, 'provider', e),
  start: (i, e) => !i || isValidPeriod(i, 'start period', e),
  end: (i, e) => !i || isValidPeriod(i, 'end period', e),
  updatedAfter: (i, e) => !i || isValidDate(i, 'updatedAfter', e),
  firstNObs: (i, e) => !i || isValidNObs(i, 'firstNObs', e),
  lastNObs: (i, e) => !i || isValidNObs(i, 'lastNObs', e),
  obsDimension: (i, e) =>
    !i || isValidPattern(i, NCNameIDType, 'obs dimension', e),
  detail: (i, e) => isValidEnum(i, DataDetail, 'details', e),
  history: (i, e) => isValidHistory(i, e),
};

const isValidQuery = (
  q: DataQueryValue,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const checks = [
    () => ValidQuery.flow(q.flow, errors),
    () => ValidQuery.key(q.key, errors),
    () => ValidQuery.provider(q.provider, errors),
    () => ValidQuery.start(q.start, errors),
    () => ValidQuery.end(q.end, errors),
    () => ValidQuery.updatedAfter(q.updatedAfter, errors),
    () => ValidQuery.firstNObs(q.firstNObs, errors),
    () => ValidQuery.lastNObs(q.lastNObs, errors),
    () => ValidQuery.obsDimension(q.obsDimension, errors),
    () => ValidQuery.detail(q.detail, errors),
    () => ValidQuery.history(q.history, errors),
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

// A query for data, as defined by the SDMX RESTful API.
class DataQueryBuilder {
  static from(opts?: DataQueryInput | null): DataQueryValue {
    const flow = opts?.flow ?? '';
    const keyInput = opts?.key ?? defaults.key;
    const key = typeof keyInput === 'string' ? keyInput : toKeyString(keyInput);
    const providerInput = opts?.provider ?? defaults.provider;
    const provider =
      typeof providerInput === 'string'
        ? providerInput
        : toProviderString(providerInput);
    const query: DataQueryValue = {
      flow,
      key,
      provider,
      start: opts?.start,
      end: opts?.end,
      updatedAfter: opts?.updatedAfter,
      firstNObs: opts?.firstNObs,
      lastNObs: opts?.lastNObs,
      obsDimension: opts?.obsDimension,
      detail: opts?.detail ?? defaults.detail,
      history: opts?.history ?? defaults.history,
    };
    const input = isValidQuery(query);
    if (!input.isValid) {
      throw Error(createErrorMessage(input.errors, 'data query'));
    }
    return query;
  }
}

export { DataQueryBuilder as DataQuery };
