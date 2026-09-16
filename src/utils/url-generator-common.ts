import { ApiVersion, ApiNumber } from '../utils/api-version';
import { VersionNumber } from '../utils/sdmx-patterns';
import type { ServiceInfo } from '../service/service';

interface DataV2CompatibleQuery {
  provider?: string;
  start?: string;
  end?: string;
  key: string;
}

interface VersionedQuery {
  version: string;
}

const createEntryPoint = (s: ServiceInfo): string => {
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

const parseContext = (
  f: string,
): [contextType: string, agency: string, id: string, version: string] => {
  const match = f.match(contextPattern);
  if (!match) {
    throw Error(`Invalid context: ${f}`);
  }
  return [match[1], match[2], match[3], match[4]];
};

const filterPattern = /(.*)=(.*)/;

const parseFilter = (f: string): [component: string, value: string] => {
  const match = f.match(filterPattern);
  if (!match) {
    throw Error(`Invalid filter: ${f}`);
  }
  return [match[1], match[2]];
};

const validateDataForV2 = (q: DataV2CompatibleQuery, s: ServiceInfo): void => {
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

const checkVersion = (q: VersionedQuery, s: ServiceInfo): void => {
  const v = q.version;
  if (s.api !== ApiVersion.v2_0_0) {
    if (!(v === 'latest' || v.match(VersionNumber))) {
      throw Error(`Semantic versioning not allowed in ${s.api}`);
    }
  }
};

const checkMultipleItems = (
  i: string,
  s: ServiceInfo,
  r: string,
  a: number,
): void => {
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
