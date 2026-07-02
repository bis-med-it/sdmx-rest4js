import { ApiVersion, ApiNumber } from '../utils/api-version';
import { VersionNumber } from '../utils/sdmx-patterns';

const createEntryPoint = (s: any): string => {
  let url = s.url;
  if (!s.url.endsWith('/')) {
    url = s.url + '/';
  }
  return url;
};

const parseFlow = (f: string): string[] => {
  const parts = f.split(',');
  if (parts.length === 1) {
    return ['*', f, '*'];
  } else if (parts.length === 2) {
    return parts.concat(['*']);
  } else {
    return parts;
  }
};

const contextPattern = /(.*)=(.*):(.*)\((.*)\)/;

const parseContext = (f: string): string[] =>
  (f.match(contextPattern) as RegExpMatchArray).slice(1, 5);

const filterPattern = /(.*)=(.*)/;

const parseFilter = (f: string): string[] =>
  (f.match(filterPattern) as RegExpMatchArray).slice(1, 3);

const validateDataForV2 = (q: any, s: any): void => {
  if (q.provider != null && q.provider !== 'all') {
    throw Error(`provider not allowed in ${s.api}`);
  }
  if (q.start) {
    throw Error(`start not allowed in ${s.api}`);
  }
  if (q.end) {
    throw Error(`end not allowed in ${s.api}`);
  }
  if (q.key.indexOf('+') > -1) {
    throw Error(`+ not allowed in key in ${s.api}`);
  }
};

const checkVersion = (q: any, s: any): void => {
  const v = q.version;
  if (s.api !== ApiVersion.v2_0_0) {
    if (!(v === 'latest' || v.match(VersionNumber))) {
      throw Error(`Semantic versioning not allowed in ${s.api}`);
    }
  }
};

const checkMultipleItems = (i: any, s: any, r: string, a: number): void => {
  if (a < ApiNumber.v1_3_0 && /\+/.test(i)) {
    throw Error(`Multiple ${r} not allowed in ${s.api}`);
  }
};

export {
  createEntryPoint,
  parseFlow,
  validateDataForV2,
  checkVersion,
  checkMultipleItems,
  parseContext,
  parseFilter,
};
