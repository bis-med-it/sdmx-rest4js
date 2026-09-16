import { ApiResources, ApiVersion } from '../utils/api-version';
import type { SchemaQueryValue } from '../schema/schema-query';
import type { ServiceInfo } from '../service/service';
import { createEntryPoint, checkVersion } from '../utils/url-generator-common';

const createSchemaQuery = (q: SchemaQueryValue, s: ServiceInfo): string => {
  let u = createEntryPoint(s);
  const v =
    s.api === ApiVersion.v2_0_0 && q.version === 'latest' ? '~' : q.version;
  u += `schema/${q.context}/${q.agency}/${q.id}/${v}`;
  if (s.api === ApiVersion.v2_0_0) {
    if (q.obsDimension) u += `?dimensionAtObservation=${q.obsDimension}`;
  } else {
    u += `?explicitMeasure=${q.explicit}`;
    if (q.obsDimension) u += `&dimensionAtObservation=${q.obsDimension}`;
  }
  return u;
};

const handleSchemaQueryParams = (q: SchemaQueryValue): string => {
  const p: string[] = [];
  if (q.obsDimension) p.push(`dimensionAtObservation=${q.obsDimension}`);
  if (q.explicit) p.push(`explicitMeasure=${q.explicit}`);
  return p.length > 0 ? '?' + p.reduceRight((x, y) => x + '&' + y) : '';
};

const createShortSchemaQuery = (
  q: SchemaQueryValue,
  s: ServiceInfo,
): string => {
  let u = createEntryPoint(s);
  u += `schema/${q.context}/${q.agency}/${q.id}`;
  if (!(q.version === 'latest' || q.version === '~')) {
    u += `/${q.version}`;
  }
  u += handleSchemaQueryParams(q);
  return u;
};

const checkContext = (q: SchemaQueryValue, s: ServiceInfo): void => {
  const api = s.api.replace(/\./g, '_');
  if (ApiResources[api].indexOf(q.context) === -1) {
    throw Error(`${q.context} not allowed in ${s.api}`);
  }
};

const checkExplicit = (q: SchemaQueryValue, s: ServiceInfo): void => {
  if (q.explicit && s && s.api && s.api === ApiVersion.v2_0_0) {
    throw Error(`explicit parameter not allowed in ${s.api}`);
  }
};

class Handler {
  handle(q: SchemaQueryValue, s: ServiceInfo, skip?: boolean): string {
    checkContext(q, s);
    checkExplicit(q, s);
    checkVersion(q, s);
    if (skip) {
      return createShortSchemaQuery(q, s);
    } else {
      return createSchemaQuery(q, s);
    }
  }
}

export { Handler as SchemaQueryHandler };
