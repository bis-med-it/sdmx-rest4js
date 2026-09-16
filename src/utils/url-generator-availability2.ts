import { ApiNumber, getKeyFromVersion } from '../utils/api-version';
import type { AvailabilityQuery2Value } from '../avail/availability-query2';
import type { ServiceInfo } from '../service/service';
import {
  createEntryPoint,
  validateDataForV2,
  parseContext,
  parseFilter,
} from '../utils/url-generator-common';

const handlePathParams = (q: AvailabilityQuery2Value): string => {
  const p: string[] = [];
  const c = parseContext(q.context);
  if (q.component !== '*') p.push(q.component);
  if (q.key !== '*' || p.length) p.push(q.key);
  if (c[3] !== '*' || p.length) p.push(c[3]);
  if (c[2] !== '*' || p.length) p.push(c[2]);
  if (c[1] !== '*' || p.length) p.push(c[1]);
  if (c[0] !== '*' || p.length) p.push(c[0]);
  return p.length ? '/' + p.reverse().join('/') : '';
};

const handleQueryParams = (q: AvailabilityQuery2Value): string => {
  const p: string[] = [];
  if (q.filters) {
    for (const filter of q.filters) {
      const f = parseFilter(filter);
      p.push(`c[${f[0]}]=${f[1]}`);
    }
  }
  if (q.updatedAfter) p.push(`updatedAfter=${q.updatedAfter}`);
  if (q.mode !== 'exact') p.push(`mode=${q.mode}`);
  if (q.references !== 'none') p.push(`references=${q.references}`);
  return p.length > 0 ? '?' + p.reduceRight((x, y) => x + '&' + y) : '';
};

const createShortAvailabilityQuery = (
  q: AvailabilityQuery2Value,
  s: ServiceInfo,
): string => {
  validateDataForV2(q, s);
  let u = createEntryPoint(s);
  u += 'availability';
  u += handlePathParams(q);
  u += handleQueryParams(q);
  return u;
};

const createAvailabilityQuery = (
  q: AvailabilityQuery2Value,
  s: ServiceInfo,
): string => {
  validateDataForV2(q, s);
  let url = createEntryPoint(s);
  const fc = parseContext(q.context);
  url += `availability/${fc[0]}/${fc[1]}/${fc[2]}/${fc[3]}/`;
  url += `${q.key}/`;
  url += `${q.component}?`;
  if (q.filters) {
    for (const filter of q.filters) {
      const f = parseFilter(filter);
      url += `c[${f[0]}]=${f[1]}&`;
    }
  }
  url += `mode=${q.mode}&references=${q.references}`;
  if (q.updatedAfter) url += `&updatedAfter=${q.updatedAfter}`;
  return url;
};

class Handler {
  handle(q: AvailabilityQuery2Value, s: ServiceInfo, skip?: boolean): string {
    const api = ApiNumber[getKeyFromVersion(s.api)];
    if (api < ApiNumber.v2_0_0) {
      throw Error(`SDMX 3.0 queries not allowed in ${s.api}`);
    } else if (skip) {
      return createShortAvailabilityQuery(q, s);
    } else {
      return createAvailabilityQuery(q, s);
    }
  }
}

export { Handler as AvailabilityQuery2Handler };
