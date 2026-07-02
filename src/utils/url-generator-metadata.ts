import {
  ApiResources,
  ApiVersion,
  ApiNumber,
  getKeyFromVersion,
} from '../utils/api-version';
import {
  createEntryPoint,
  checkMultipleItems,
} from '../utils/url-generator-common';
import {
  MetadataReferences,
  MetadataReferencesExcluded,
  MetadataReferencesSpecial,
} from '../metadata/metadata-references';
import { MetadataDetail } from '../metadata/metadata-detail';
import { VersionNumber } from '../utils/sdmx-patterns';
import { isItemScheme } from '../metadata/metadata-type';

const itemAllowed = (r: string, a: number): boolean =>
  a > ApiNumber.v1_0_2 &&
  ((r !== 'hierarchicalcodelist' && isItemScheme(r)) ||
  (a > ApiNumber.v1_1_0 && r === 'hierarchicalcodelist'));

const toApiKeywords = (
  q: any,
  s: any,
  value: string,
  isVersion = false
): string => {
  let v = value;
  if (s.api === ApiVersion.v2_0_0 && v === 'all') {
    v = '*';
  } else if (s.api !== ApiVersion.v2_0_0 && v === '*') {
    v = 'all';
  } else if (s.api === ApiVersion.v2_0_0 && v === 'latest') {
    v = '~';
  } else if (s.api === ApiVersion.v2_0_0 && !isVersion &&
  v.indexOf('+') > -1) {
    v = v.replace(/\+/, ',');
  } else if (s.api !== ApiVersion.v2_0_0 && v.indexOf(',') > -1) {
    v = v.replace(/,/, '+');
  }
  return v;
};

const createMetadataQuery = (q: any, s: any, a: number): string => {
  let url = createEntryPoint(s);
  if (!(a < ApiNumber.v2_0_0)) {
    url += 'structure/';
  }
  const res = toApiKeywords(q, s, q.resource);
  const agency = toApiKeywords(q, s, q.agency);
  const id = toApiKeywords(q, s, q.id);
  const item = toApiKeywords(q, s, q.item);
  const v = s.api === ApiVersion.v2_0_0 && q.version === 'latest'
    ? '~' : q.version;
  url += `${res}/${agency}/${id}/${v}`;
  if (itemAllowed(q.resource, a)) {
    url += `/${item}`;
  }
  url += `?detail=${q.detail}&references=${q.references}`;
  return url;
};

const handleMetaPathParams = (q: any, s: any, u: string, a: number): string => {
  const path = [];
  if (q.item !== 'all' && q.item !== '*' && itemAllowed(q.resource, a)) {
    path.push(toApiKeywords(q, s, q.item));
  }
  if ((q.version !== 'latest' && q.version !== '~') || path.length) {
    path.push(toApiKeywords(q, s, q.version, true));
  }
  if ((q.id !== 'all' && q.id !== '*') || path.length) {
    path.push(toApiKeywords(q, s, q.id));
  }
  if ((q.agency !== 'all' && q.agency !== '*') || path.length) {
    path.push(toApiKeywords(q, s, q.agency));
  }
  if (path.length) {
    u = u + '/' + path.reverse().join('/');
  }
  return u;
};

const handleMetaQueryParams = (
  q: any,
  u: string,
  hd: boolean,
  hr: boolean
): string => {
  if (hd || hr) u += '?';
  if (hd) u += `detail=${q.detail}`;
  if (hd && hr) u += '&';
  if (hr) u += `references=${q.references}`;
  return u;
};

const createShortMetadataQuery = (q: any, s: any, a: number): string => {
  let u = createEntryPoint(s);
  if (!(a < ApiNumber.v2_0_0)) {
    u += 'structure/';
  }
  const r = toApiKeywords(q, s, q.resource);
  u += `${r}`;
  u = handleMetaPathParams(q, s, u, a);
  u = handleMetaQueryParams(
    q, u, q.detail !== MetadataDetail.FULL,
    q.references !== MetadataReferences.NONE
  );
  return u;
};

const checkVersionWithAll = (q: any, s: any, v: string, a: number): void => {
  if (a < ApiNumber.v2_0_0) {
    if (!(v === 'latest' || v === 'all' || v.match(VersionNumber))) {
      throw Error(`Semantic versioning not allowed in ${s.api}`);
    }
  }
};

const checkMultipleVersions = (q: any, s: any, a: number): void => {
  const v = q.version;
  if (v.indexOf('+') > -1) {
    for (const i of v.split('+')) {
      checkVersionWithAll(q, s, i, a);
    }
  } else if (v.indexOf(',') > -1) {
    for (const i of v.split(',')) {
      checkVersionWithAll(q, s, i, a);
    }
  } else {
    checkVersionWithAll(q, s, v, a);
  }
};

const checkApiVersion = (q: any, s: any, a: number): void => {
  checkMultipleItems(q.agency, s, 'agencies', a);
  checkMultipleItems(q.id, s, 'IDs', a);
  checkMultipleItems(q.version, s, 'versions', a);
  checkMultipleItems(q.item, s, 'items', a);
  checkMultipleVersions(q, s, a);
};

const checkDetail = (q: any, s: any, a: number): void => {
  if (a < ApiNumber.v1_3_0 && (q.detail === 'referencepartial' ||
  q.detail === 'allcompletestubs' || q.detail === 'referencecompletestubs')) {
    throw Error(`${q.detail} not allowed in ${s.api}`);
  }

  if (a < ApiNumber.v2_0_0 && q.detail === 'raw') {
    throw Error(`raw not allowed in ${s.api}`);
  }
};

const checkResource = (q: any, s: any, r: string): void => {
  const api = s.api.replace(/\./g, '_');
  if (!(ApiResources[api].indexOf(r) > -1 ||
  (s.api === ApiVersion.v2_0_0 && r === '*'))) {
    throw Error(`${r} not allowed in ${s.api}`);
  }
};

const checkResources = (q: any, s: any, a: number): void => {
  const r = q.resource;
  if (a < ApiNumber.v2_0_0) {
    checkResource(q, s, r);
  } else if (r.indexOf('+') > -1) {
    for (const i of r.split('+')) {
      checkResource(q, s, i);
    }
  } else if (r.indexOf(',') > -1) {
    for (const i of r.split(',')) {
      checkResource(q, s, i);
    }
  } else {
    checkResource(q, s, r);
  }
};

const checkReferences = (q: any, s: any, a: number): void => {
  const api = s.api.replace(/\./g, '_');
  if (!((ApiResources[api].indexOf(q.references) > -1 ||
  Object.values(MetadataReferencesSpecial).indexOf(q.references) > -1) &&
  MetadataReferencesExcluded.indexOf(q.references) === -1)) {
    throw Error(`${q.references} not allowed as reference in ${s.api}`);
  }

  if (a < ApiNumber.v2_0_0 && q.references === 'ancestors') {
    throw Error(`ancestors not allowed as reference in ${s.api}`);
  }
};

class Handler {

  handle(q: any, s: any, skip?: boolean): string {
    const a = ApiNumber[getKeyFromVersion(s.api)];
    checkApiVersion(q, s, a);
    checkDetail(q, s, a);
    checkResources(q, s, a);
    if (q.references) {
      checkReferences(q, s, a);
    }
    if (skip) {
      return createShortMetadataQuery(q, s, a);
    } else {
      return createMetadataQuery(q, s, a);
    }
  }
}

export { Handler as MetadataQueryHandler };
