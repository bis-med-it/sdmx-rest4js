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

const defaults = {
  context: '*=*:*(*)',
  key: '*',
  history: false,
  attributes: 'dsd',
  measures: 'all',
  filters: [],
};

const isValidHistory = (input: any, errors: string[]): boolean => {
  const valid = typeof input === 'boolean';
  if (!valid) {
    errors.push(
      `${input} is not a valid value for history. Must be true or false`,
    );
  }
  return valid;
};

const isValidNObs = (input: any, name: string, errors: string[]): boolean => {
  const valid = typeof input === 'number' && input > 0;
  if (!valid) {
    errors.push(
      `${input} is not a valid value for ${name}. Must be a positive integer`,
    );
  }
  return valid;
};

const isValidComp = (input: any, name: string, errors: string[]): boolean => {
  let valid = true;
  if (input.indexOf(',') > -1) {
    for (const i of input.split(',')) {
      const r = isValidPattern(i, NCNameIDType, name, errors);
      if (!r) valid = false;
    }
  } else {
    const r = isValidPattern(input, NCNameIDType, name, errors);
    if (!r) valid = false;
  }
  return valid;
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
  errors: string[],
): boolean => {
  let valid = true;
  for (const filter of input) {
    const r = isValidPattern(filter, FiltersType, name, errors);
    if (!r) valid = false;
  }
  return valid;
};

const ValidQuery: { [key: string]: (i: any, e: string[]) => any } = {
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
  'updatedAfter',
  'firstNObs',
  'lastNObs',
  'obsDimension',
  'history',
  'attributes',
  'measures',
  'filters',
];

// A query for data, as defined by the SDMX RESTful API.
class DataQuery {
  static from(opts: any): any {
    if (opts) {
      for (const k of Object.keys(opts)) {
        if (expected.indexOf(k) === -1) {
          throw Error(createErrorMessage([], 'data query'));
        }
      }
    }
    const context = opts?.context ?? defaults.context;
    const key = opts?.key ?? defaults.key;
    const attrs = opts?.attributes ?? defaults.attributes;
    const measures = opts?.measures ?? defaults.measures;
    let filters = opts?.filters ?? defaults.filters;
    if (!Array.isArray(filters)) filters = [filters];
    const query = {
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

export { DataQuery as DataQuery2 };
