import { AvailabilityMode } from './availability-mode';
import { AvailabilityReferences } from './availability-references';
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

const defaults = {
  key: 'all',
  provider: 'all',
  component: 'all',
  mode: AvailabilityMode.EXACT,
  references: AvailabilityReferences.NONE,
};

const ValidQuery: { [key: string]: (i: any, e: string[]) => any } = {
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

// A query for data availability, as defined by the SDMX RESTful API.
class AvailabilityQuery {
  static from(opts: any): any {
    let key = opts?.key ?? defaults.key;
    if (Array.isArray(key)) key = toKeyString(key);
    let pro = opts?.provider ?? defaults.provider;
    if (Array.isArray(pro)) pro = toProviderString(pro);
    const query = {
      flow: opts?.flow,
      key,
      provider: pro,
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

export { AvailabilityQuery };
