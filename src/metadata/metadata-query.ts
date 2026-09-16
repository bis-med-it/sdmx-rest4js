import { MetadataDetail } from './metadata-detail';
import {
  MetadataReferences,
  MetadataReferencesSpecial,
} from './metadata-references';
import { MetadataType, isItemScheme } from './metadata-type';
import type { MetadataDetailValue } from './metadata-detail';
import type { MetadataReferencesValue } from './metadata-references';
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

export interface MetadataQueryInput {
  resource?: string | readonly string[];
  agency?: string | readonly string[];
  id?: string | readonly string[];
  version?: string | readonly string[];
  detail?: MetadataDetailValue;
  references?: MetadataReferencesValue;
  item?: string | readonly string[];
}

export interface MetadataQueryValue {
  resource: string;
  agency: string;
  id: string;
  version: string;
  detail: MetadataDetailValue;
  references: MetadataReferencesValue;
  item: string;
}

const defaults: Pick<
  MetadataQueryValue,
  'agency' | 'id' | 'version' | 'detail' | 'references' | 'item'
> = {
  agency: 'all',
  id: 'all',
  version: 'latest',
  detail: MetadataDetail.FULL,
  references: MetadataReferencesSpecial.NONE,
  item: 'all',
};

const canHaveItem = (query: MetadataQueryValue, errors: string[]): boolean => {
  const allowed = query.item === 'all' || isItemScheme(query.resource);
  if (!allowed) {
    errors.push(
      `${query.resource} is not an item scheme and therefore it is ` +
        'not possible to query by item',
    );
  }
  return allowed;
};

type MetadataQueryField = keyof MetadataQueryValue;
type QueryValidators = {
  [K in MetadataQueryField]: (
    query: MetadataQueryValue,
    input: MetadataQueryValue[K],
    errors: string[],
  ) => boolean;
};

const ValidQuery: QueryValidators = {
  resource: (q, i, e) => isValidMultipleEnum(i, MetadataType, 'resources', e),
  agency: (q, i, e) => isValidPattern(i, AgenciesRefType, 'agencies', e),
  id: (q, i, e) => isValidPattern(i, MultipleIDType, 'resource ids', e),
  version: (q, i, e) => isValidPattern(i, MultipleVersionsType, 'versions', e),
  detail: (q, i, e) => isValidEnum(i, MetadataDetail, 'details', e),
  references: (q, i, e) => isValidEnum(i, MetadataReferences, 'references', e),
  item: (q, i, e) =>
    isValidPattern(i, MultipleNestedIDType, 'items', e) && canHaveItem(q, e),
};

const isValidQuery = (
  query: MetadataQueryValue,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const checks = [
    () => ValidQuery.resource(query, query.resource, errors),
    () => ValidQuery.agency(query, query.agency, errors),
    () => ValidQuery.id(query, query.id, errors),
    () => ValidQuery.version(query, query.version, errors),
    () => ValidQuery.detail(query, query.detail, errors),
    () => ValidQuery.references(query, query.references, errors),
    () => ValidQuery.item(query, query.item, errors),
  ];

  for (const check of checks) {
    const isValid = check();
    if (!isValid) {
      return { isValid: false, errors };
    }
  }

  return { isValid: true, errors };
};

const toQueryParam = (p: readonly string[]): string => p.join('+');

// A query for structural metadata, as defined by the SDMX RESTful API.
class MetadataQueryBuilder {
  static from(opts?: MetadataQueryInput | null): MetadataQueryValue {
    const agencyInput = opts?.agency ?? defaults.agency;
    const agency =
      typeof agencyInput === 'string' ? agencyInput : toQueryParam(agencyInput);
    const idInput = opts?.id ?? defaults.id;
    const id = typeof idInput === 'string' ? idInput : toQueryParam(idInput);
    const versionInput = opts?.version ?? defaults.version;
    const version =
      typeof versionInput === 'string'
        ? versionInput
        : toQueryParam(versionInput);
    const resourceInput = opts?.resource ?? '';
    const resource =
      typeof resourceInput === 'string'
        ? resourceInput
        : toQueryParam(resourceInput);
    const itemInput = opts?.item ?? defaults.item;
    const item =
      typeof itemInput === 'string' ? itemInput : toQueryParam(itemInput);
    const query: MetadataQueryValue = {
      resource,
      agency,
      id,
      version,
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

export { MetadataQueryBuilder as MetadataQuery };
