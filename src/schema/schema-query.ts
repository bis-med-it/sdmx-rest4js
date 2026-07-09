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

const defaults = {
  version: 'latest',
  explicit: false,
};

const isValidExplicit = (input: any, errors: string[]): boolean => {
  const valid = typeof input === 'boolean';
  if (!valid) {
    errors.push(
      `${input} is not a valid value for explicit. Must be true or false`,
    );
  }
  return valid;
};

const ValidQuery: { [key: string]: (q: any, i: any, e: string[]) => any } = {
  context: (q, i, e) => isValidEnum(i, SchemaContext, 'context', e),
  agency: (q, i, e) => isValidPattern(i, NestedNCNameIDType, 'agency', e),
  id: (q, i, e) => isValidPattern(i, IDType, 'resource ids', e),
  version: (q, i, e) => isValidPattern(i, SingleVersionType, 'versions', e),
  explicit: (q, i, e) => isValidExplicit(i, e),
  obsDimension: (q, i, e) =>
    !i || isValidPattern(i, NCNameIDType, 'obs dimension', e),
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

// A query for XML schemas, as defined by the SDMX RESTful API.
class SchemaQuery {
  static from(opts: any): any {
    const query = {
      context: opts?.context,
      agency: opts?.agency,
      id: opts?.id,
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

export { SchemaQuery };
