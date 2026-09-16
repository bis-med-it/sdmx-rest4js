import { SchemaContext } from './schema-context';
import {
  NestedNCNameIDType,
  IDType,
  SingleVersionType,
  NCNameIDType,
} from '../utils/sdmx-patterns';
import {
  isValidEnum,
  isValidPattern,
  createErrorMessage,
} from '../utils/validators';

export interface SchemaQueryInput {
  context?: string;
  agency?: string;
  id?: string;
  version?: string;
  explicit?: boolean;
  obsDimension?: string;
}

export interface SchemaQueryValue {
  context: string;
  agency: string;
  id: string;
  version: string;
  explicit: boolean;
  obsDimension?: string;
}

const defaults: Pick<SchemaQueryValue, 'version' | 'explicit'> = {
  version: 'latest',
  explicit: false,
};

const isValidExplicit = (input: boolean, errors: string[]): boolean => {
  const valid = typeof input === 'boolean';
  if (!valid) {
    errors.push(
      `${input} is not a valid value for explicit. Must be true or false`,
    );
  }
  return valid;
};

type SchemaQueryField = keyof SchemaQueryValue;
type QueryValidators = {
  [K in SchemaQueryField]: (
    input: SchemaQueryValue[K],
    errors: string[],
  ) => boolean;
};

const ValidQuery: QueryValidators = {
  context: (i, e) => isValidEnum(i, SchemaContext, 'context', e),
  agency: (i, e) => isValidPattern(i, NestedNCNameIDType, 'agency', e),
  id: (i, e) => isValidPattern(i, IDType, 'resource ids', e),
  version: (i, e) => isValidPattern(i, SingleVersionType, 'versions', e),
  explicit: (i, e) => isValidExplicit(i, e),
  obsDimension: (i, e) =>
    !i || isValidPattern(i, NCNameIDType, 'obs dimension', e),
};

const isValidQuery = (
  query: SchemaQueryValue,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const checks = [
    () => ValidQuery.context(query.context, errors),
    () => ValidQuery.agency(query.agency, errors),
    () => ValidQuery.id(query.id, errors),
    () => ValidQuery.version(query.version, errors),
    () => ValidQuery.explicit(query.explicit, errors),
    () => ValidQuery.obsDimension(query.obsDimension, errors),
  ];

  for (const check of checks) {
    const isValid = check();
    if (!isValid) {
      return { isValid: false, errors };
    }
  }

  return { isValid: true, errors };
};

// A query for XML schemas, as defined by the SDMX RESTful API.
class SchemaQueryBuilder {
  static from(opts?: SchemaQueryInput | null): SchemaQueryValue {
    const query: SchemaQueryValue = {
      context: opts?.context ?? '',
      agency: opts?.agency ?? '',
      id: opts?.id ?? '',
      version: opts?.version ?? defaults.version,
      explicit: opts?.explicit ?? defaults.explicit,
      obsDimension: opts?.obsDimension,
    };
    const input = isValidQuery(query);
    if (!input.isValid) {
      throw Error(createErrorMessage(input.errors, 'schema query'));
    }
    return query;
  }
}

export { SchemaQueryBuilder as SchemaQuery };
