import {
  ContextRefType,
  Sdmx3SeriesKeyType,
  NCNameIDType,
  FiltersType,
} from '../utils/sdmx-patterns';
import {
  isValidPattern,
  isValidDate,
  createErrorMessage,
} from '../utils/validators';

export interface DataQuery2Input {
  context?: string;
  key?: string;
  updatedAfter?: string;
  firstNObs?: number;
  lastNObs?: number;
  obsDimension?: string;
  history?: boolean;
  attributes?: string;
  measures?: string;
  filters?: string | readonly string[];
}

export interface DataQuery2Value {
  context: string;
  key: string;
  updatedAfter?: string;
  firstNObs?: number;
  lastNObs?: number;
  obsDimension?: string;
  history: boolean;
  attributes: string;
  measures: string;
  filters: string[];
}

const defaults: Pick<
  DataQuery2Value,
  'context' | 'key' | 'history' | 'attributes' | 'measures' | 'filters'
> = {
  context: '*=*:*(*)',
  key: '*',
  history: false,
  attributes: 'dsd',
  measures: 'all',
  filters: [],
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

const isValidComp = (
  input: string,
  name: string,
  errors: string[],
): boolean => {
  const values = input.indexOf(',') > -1 ? input.split(',') : [input];
  return values
    .map((value) => isValidPattern(value, NCNameIDType, name, errors))
    .every(Boolean);
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

type DataQuery2Field = keyof DataQuery2Value;
type QueryValidators = {
  [K in DataQuery2Field]: (
    input: DataQuery2Value[K],
    errors: string[],
  ) => boolean;
};

const ValidQuery: QueryValidators = {
  context: (i, e) => isValidPattern(i, ContextRefType, 'context', e),
  key: (i, e) => isValidKey(i, 'series key', e),
  updatedAfter: (i, e) => !i || isValidDate(i, 'updatedAfter', e),
  firstNObs: (i, e) => !i || isValidNObs(i, 'firstNObs', e),
  lastNObs: (i, e) => !i || isValidNObs(i, 'lastNObs', e),
  obsDimension: (i, e) =>
    !i || isValidPattern(i, NCNameIDType, 'obs dimension', e),
  history: (i, e) => isValidHistory(i, e),
  attributes: (i, e) => isValidComp(i, 'attributes', e),
  measures: (i, e) => isValidComp(i, 'measures', e),
  filters: (i, e) => isValidFilters(i, 'filters', e),
};

const isValidQuery = (
  q: DataQuery2Value,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const checks = [
    () => ValidQuery.context(q.context, errors),
    () => ValidQuery.key(q.key, errors),
    () => ValidQuery.updatedAfter(q.updatedAfter, errors),
    () => ValidQuery.firstNObs(q.firstNObs, errors),
    () => ValidQuery.lastNObs(q.lastNObs, errors),
    () => ValidQuery.obsDimension(q.obsDimension, errors),
    () => ValidQuery.history(q.history, errors),
    () => ValidQuery.attributes(q.attributes, errors),
    () => ValidQuery.measures(q.measures, errors),
    () => ValidQuery.filters(q.filters, errors),
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
  'updatedAfter',
  'firstNObs',
  'lastNObs',
  'obsDimension',
  'history',
  'attributes',
  'measures',
  'filters',
] as const;

// A query for data, as defined by the SDMX RESTful API.
class DataQuery2Builder {
  static from(opts?: DataQuery2Input | null): DataQuery2Value {
    if (opts) {
      for (const k of Object.keys(opts)) {
        if (!expected.includes(k as (typeof expected)[number])) {
          throw Error(createErrorMessage([], 'data query'));
        }
      }
    }
    const context = opts?.context ?? defaults.context;
    const key = opts?.key ?? defaults.key;
    const attrs = opts?.attributes ?? defaults.attributes;
    const measures = opts?.measures ?? defaults.measures;
    const filtersInput = opts?.filters ?? defaults.filters;
    const filters = Array.isArray(filtersInput)
      ? [...filtersInput]
      : [filtersInput];
    const query: DataQuery2Value = {
      context,
      key,
      updatedAfter: opts?.updatedAfter,
      firstNObs: opts?.firstNObs,
      lastNObs: opts?.lastNObs,
      obsDimension: opts?.obsDimension,
      history: opts?.history ?? defaults.history,
      attributes: attrs,
      measures,
      filters,
    };
    const input = isValidQuery(query);
    if (!input.isValid) {
      throw Error(createErrorMessage(input.errors, 'data query'));
    }
    return query;
  }
}

export { DataQuery2Builder as DataQuery2 };
