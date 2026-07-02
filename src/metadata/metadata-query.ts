import { MetadataDetail } from './metadata-detail';
import { MetadataReferences } from './metadata-references';
import { MetadataType, isItemScheme } from './metadata-type';
import {
  AgenciesRefType,
  MultipleIDType,
  MultipleVersionsType,
  MultipleNestedIDType,
} from '../utils/sdmx-patterns';
import {
  isValidEnum,
  isValidMultipleEnum,
  isValidPattern,
  createErrorMessage,
} from '../utils/validators';

const defaults = {
  agency: 'all',
  id: 'all',
  version: 'latest',
  detail: MetadataDetail.FULL,
  references: MetadataReferences.NONE,
  item: 'all',
};

const canHaveItem = (query: any, errors: string[]): boolean => {
  const allowed = query.item === 'all' || isItemScheme(query.resource);
  if (!allowed) {
    errors.push(
      `${query.resource} is not an item scheme and therefore it is ` +
      'not possible to query by item'
    );
  }
  return allowed;
};

const ValidQuery: { [key: string]: (q: any, i: any, e: string[]) => any } = {
  resource: (q, i, e) => isValidMultipleEnum(i, MetadataType, 'resources', e),
  agency: (q, i, e) => isValidPattern(i, AgenciesRefType, 'agencies', e),
  id: (q, i, e) => isValidPattern(i, MultipleIDType, 'resource ids', e),
  version: (q, i, e) => isValidPattern(i, MultipleVersionsType,
    'versions', e),
  detail: (q, i, e) => isValidEnum(i, MetadataDetail, 'details', e),
  references: (q, i, e) => isValidEnum(i, MetadataReferences,
    'references', e),
  item: (q, i, e) => isValidPattern(i, MultipleNestedIDType, 'items', e) &&
    canHaveItem(q, e),
};

const isValidQuery = (query: any): { isValid: any; errors: string[] } => {
  const errors: string[] = [];
  let isValid: any = false;
  for (const k of Object.keys(query)) {
    isValid = ValidQuery[k](query, query[k], errors);
    if (!isValid) break;
  }
  return { isValid, errors };
};

const toQueryParam = (p: any[]): string => p.join('+');

// A query for structural metadata, as defined by the SDMX RESTful API.
class MetadataQuery {

  static from(opts: any): any {
    let a = opts?.agency ?? defaults.agency;
    if (Array.isArray(a)) a = toQueryParam(a);
    let id = opts?.id ?? defaults.id;
    if (Array.isArray(id)) id = toQueryParam(id);
    let vs = opts?.version ?? defaults.version;
    if (Array.isArray(vs)) vs = toQueryParam(vs);
    let rs = opts?.resource;
    if (Array.isArray(rs)) rs = toQueryParam(rs);
    let item = opts?.item ?? defaults.item;
    if (Array.isArray(item)) item = toQueryParam(item);
    const query = {
      resource: rs,
      agency: a,
      id,
      version: vs,
      detail: opts?.detail ?? defaults.detail,
      references: opts?.references ?? defaults.references,
      item,
    };
    const input = isValidQuery(query);
    if (!input.isValid) {
      throw Error(createErrorMessage(input.errors, 'metadata query'));
    }
    return query;
  }
}

export { MetadataQuery };
