import { ApiNumber, getKeyFromVersion } from '../utils/api-version';
import {
  createEntryPoint,
  validateDataForV2,
  parseContext,
  parseFilter,
} from '../utils/url-generator-common';

const createDataQuery = (q: any, s: any): string => {
  validateDataForV2(q, s);
  let url = createEntryPoint(s);
  const fc = parseContext(q.context);
  url += `data/${fc[0]}/${fc[1]}/${fc[2]}/${fc[3]}/`;
  url += `${q.key}?`;
  if (q.filters) {
    for (const filter of q.filters) {
      const f = parseFilter(filter);
      url += `c[${f[0]}]=${f[1]}&`;
    }
  }
  if (q.obsDimension) {
    url += `dimensionAtObservation=${q.obsDimension}&`;
  }
  url += `attributes=${q.attributes}`;
  url += `&measures=${q.measures}`;
  url += `&includeHistory=${q.history}`;
  if (q.updatedAfter) url += `&updatedAfter=${q.updatedAfter}`;
  if (q.firstNObs) url += `&firstNObservations=${q.firstNObs}`;
  if (q.lastNObs) url += `&lastNObservations=${q.lastNObs}`;
  return url;
};

const handleDataPathParams = (q: any): string => {
  const p = [];
  const c = parseContext(q.context);
  if (q.key !== '*' || p.length) p.push(q.key);
  if (c[3] !== '*' || p.length) p.push(c[3]);
  if (c[2] !== '*' || p.length) p.push(c[2]);
  if (c[1] !== '*' || p.length) p.push(c[1]);
  if (c[0] !== '*' || p.length) p.push(c[0]);
  return p.length ? '/' + p.reverse().join('/') : '';
};

const handleDataQueryParams = (q: any): string => {
  const p = [];
  if (q.filters) {
    for (const filter of q.filters) {
      const f = parseFilter(filter);
      p.push(`c[${f[0]}]=${f[1]}`);
    }
  }
  if (q.obsDimension) p.push(`dimensionAtObservation=${q.obsDimension}`);
  if (q.history) p.push(`includeHistory=${q.history}`);
  if (q.attributes !== 'dsd') p.push(`attributes=${q.attributes}`);
  if (q.measures !== 'all') p.push(`measures=${q.measures}`);
  if (q.updatedAfter) p.push(`updatedAfter=${q.updatedAfter}`);
  if (q.firstNObs) p.push(`firstNObservations=${q.firstNObs}`);
  if (q.lastNObs) p.push(`lastNObservations=${q.lastNObs}`);
  return p.length > 0 ? '?' + p.reduceRight((x, y) => x + '&' + y) : '';
};

const createShortDataQuery = (q: any, s: any): string => {
  validateDataForV2(q, s);
  let u = createEntryPoint(s);
  u += 'data';
  u += handleDataPathParams(q);
  u += handleDataQueryParams(q);
  return u;
};

class Handler {

  handle(q: any, s: any, skip?: boolean): string {
    const api = ApiNumber[getKeyFromVersion(s.api)];
    if (api < ApiNumber.v2_0_0) {
      throw Error(`SDMX 3.0 queries not allowed in ${s.api}`);
    } else if (skip) {
      return createShortDataQuery(q, s);
    } else {
      return createDataQuery(q, s);
    }
  }
}

export { Handler as DataQuery2Handler };
