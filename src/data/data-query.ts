import { DataDetail } from './data-detail';
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

const defaults = {
  key: 'all',
  provider: 'all',
  detail: DataDetail.FULL,
  history: false,
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

const ValidQuery: { [key: string]: (i: any, e: string[]) => any } = {
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

const isValidQuery = (q: any): { isValid: any; errors: string[] } => {
  const errors: string[] = [];
  let isValid: any = false;
  for (const k of Object.keys(q)) {
    isValid = ValidQuery[k](q[k], errors);
    if (!isValid) break;
  }
  return { isValid, errors };
};

const toKeyString = (dims: any[]): string =>
  dims.map((d) => (Array.isArray(d) ? d.join('+') : (d ?? ''))).join('.');

const toProviderString = (p: any[]): string => p.join('+');

// A query for data, as defined by the SDMX RESTful API.
class DataQuery {
  static from(opts: any): any {
    let key = opts?.key ?? defaults.key;
    if (Array.isArray(key)) key = toKeyString(key);
    let pro = opts?.provider ?? defaults.provider;
    if (Array.isArray(pro)) pro = toProviderString(pro);
    const query = {
      flow: opts?.flow,
      key,
      provider: pro,
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

export { DataQuery };
