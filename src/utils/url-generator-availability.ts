import { ApiNumber, getKeyFromVersion } from '../utils/api-version';
import type { AvailabilityQueryValue } from '../avail/availability-query';
import type { ServiceInfo } from '../service/service';
import {
  createEntryPoint,
  validateDataForV2,
  parseFlow,
} from '../utils/url-generator-common';

const handleAvailabilityPathParams = (q: AvailabilityQueryValue): string => {
  const path: string[] = [];
  if (q.component !== 'all') path.push(q.component);
  if (q.provider !== 'all' || path.length) path.push(q.provider);
  if (q.key !== 'all' || path.length) path.push(q.key);
  return path.length ? '/' + path.reverse().join('/') : '';
};

const handleAvailabilityQueryParams = (q: AvailabilityQueryValue): string => {
  const p: string[] = [];
  if (q.updatedAfter) p.push(`updatedAfter=${q.updatedAfter}`);
  if (q.end) p.push(`endPeriod=${q.end}`);
  if (q.start) p.push(`startPeriod=${q.start}`);
  if (q.mode !== 'exact') p.push(`mode=${q.mode}`);
  if (q.references !== 'none') p.push(`references=${q.references}`);
  return p.length > 0 ? '?' + p.reduceRight((x, y) => x + '&' + y) : '';
};

const handleAvailabilityV2PathParams = (q: AvailabilityQueryValue): string => {
  const path: string[] = [];
  if (q.component !== 'all') path.push(q.component);
  const k = q.key === 'all' ? '*' : q.key;
  if (k !== '*' || path.length) path.push(k);
  return path.length ? '/' + path.reverse().join('/') : '';
};

const handleAvailabilityV2QueryParams = (q: AvailabilityQueryValue): string => {
  const p: string[] = [];
  if (q.updatedAfter) p.push(`updatedAfter=${q.updatedAfter}`);
  if (q.mode !== 'exact') p.push(`mode=${q.mode}`);
  if (q.references !== 'none') p.push(`references=${q.references}`);
  return p.length > 0 ? '?' + p.reduceRight((x, y) => x + '&' + y) : '';
};

const createShortV1AvailUrl = (
  q: AvailabilityQueryValue,
  s: ServiceInfo,
): string => {
  let u = createEntryPoint(s);
  u += `availableconstraint/${q.flow}`;
  u += handleAvailabilityPathParams(q);
  u += handleAvailabilityQueryParams(q);
  return u;
};

const createShortV2AvailUrl = (
  q: AvailabilityQueryValue,
  s: ServiceInfo,
): string => {
  validateDataForV2(q, s);
  let u = createEntryPoint(s);
  u += 'availability/dataflow/';
  const fc = parseFlow(q.flow);
  u += `${fc[0]}/${fc[1]}`;
  const pp = handleAvailabilityV2PathParams(q);
  if (fc[2] !== '*' || pp !== '') {
    u += `/${fc[2]}`;
  }
  u += pp;
  u += handleAvailabilityV2QueryParams(q);
  return u;
};

const createV1AvailUrl = (
  q: AvailabilityQueryValue,
  s: ServiceInfo,
): string => {
  let url = createEntryPoint(s);
  url += 'availableconstraint';
  url += `/${q.flow}/${q.key}/${q.provider}/${q.component}`;
  url += `?mode=${q.mode}&references=${q.references}`;
  if (q.start) url += `&startPeriod=${q.start}`;
  if (q.end) url += `&endPeriod=${q.end}`;
  if (q.updatedAfter) url += `&updatedAfter=${q.updatedAfter}`;
  return url;
};

const createV2AvailUrl = (
  q: AvailabilityQueryValue,
  s: ServiceInfo,
): string => {
  validateDataForV2(q, s);
  let url = createEntryPoint(s);
  url += 'availability';
  const fc = parseFlow(q.flow);
  url += `/dataflow/${fc[0]}/${fc[1]}/${fc[2]}/`;
  url += q.key === 'all' ? '*/' : `${q.key}/`;
  url += q.component === 'all' ? '*' : `${q.component}`;
  url += `?mode=${q.mode}&references=${q.references}`;
  if (q.updatedAfter) url += `&updatedAfter=${q.updatedAfter}`;
  return url;
};

const createShortAvailabilityQuery = (
  q: AvailabilityQueryValue,
  s: ServiceInfo,
  api_number: number,
): string => {
  if (api_number < ApiNumber.v2_0_0) {
    return createShortV1AvailUrl(q, s);
  } else {
    return createShortV2AvailUrl(q, s);
  }
};

const createAvailabilityQuery = (
  q: AvailabilityQueryValue,
  s: ServiceInfo,
  api_number: number,
): string => {
  if (api_number < ApiNumber.v2_0_0) {
    return createV1AvailUrl(q, s);
  } else {
    return createV2AvailUrl(q, s);
  }
};

class Handler {
  handle(q: AvailabilityQueryValue, s: ServiceInfo, skip?: boolean): string {
    const api_number = ApiNumber[getKeyFromVersion(s.api)];
    if (api_number < ApiNumber.v1_3_0) {
      throw Error(`Availability query not supported in ${s.api}`);
    } else if (skip) {
      return createShortAvailabilityQuery(q, s, api_number);
    } else {
      return createAvailabilityQuery(q, s, api_number);
    }
  }
}

export { Handler as AvailabilityQueryHandler };
