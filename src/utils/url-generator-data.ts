import { ApiNumber, getKeyFromVersion } from '../utils/api-version';
import {
  createEntryPoint,
  validateDataForV2,
  parseFlow,
  checkMultipleItems,
} from '../utils/url-generator-common';
import { DataDetail } from '../data/data-detail';

const translateDetail = (detail: string): string => {
  if (detail === DataDetail.NO_DATA) {
    return 'attributes=dataset,series&measures=none';
  } else if (detail === DataDetail.DATA_ONLY) {
    return 'attributes=none&measures=all';
  } else if (detail === DataDetail.SERIES_KEYS_ONLY) {
    return 'attributes=none&measures=none';
  } else {
    return 'attributes=dsd&measures=all';
  }
};

const createV1DataUrl = (q: any, s: any, a: number): string => {
  let url = createEntryPoint(s);
  url += `data/${q.flow}/${q.key}/${q.provider}?`;
  if (q.obsDimension) {
    url += `dimensionAtObservation=${q.obsDimension}&`;
  }
  url += `detail=${q.detail}`;
  if (a >= ApiNumber.v1_1_0) {
    url += `&includeHistory=${q.history}`;
  }
  if (q.start) url += `&startPeriod=${q.start}`;
  if (q.end) url += `&endPeriod=${q.end}`;
  if (q.updatedAfter) url += `&updatedAfter=${q.updatedAfter}`;
  if (q.firstNObs) url += `&firstNObservations=${q.firstNObs}`;
  if (q.lastNObs) url += `&lastNObservations=${q.lastNObs}`;
  return url;
};

const createV2DataUrl = (q: any, s: any): string => {
  validateDataForV2(q, s);
  let url = createEntryPoint(s);
  const fc = parseFlow(q.flow);
  url += `data/dataflow/${fc[0]}/${fc[1]}/${fc[2]}/`;
  url += q.key === 'all' ? '*?' : `${q.key}?`;
  if (q.obsDimension) {
    url += `dimensionAtObservation=${q.obsDimension}&`;
  }
  url += translateDetail(q.detail);
  url += `&includeHistory=${q.history}`;
  if (q.updatedAfter) url += `&updatedAfter=${q.updatedAfter}`;
  if (q.firstNObs) url += `&firstNObservations=${q.firstNObs}`;
  if (q.lastNObs) url += `&lastNObservations=${q.lastNObs}`;
  return url;
};

const createDataQuery = (q: any, s: any, a: number): string => {
  if (a < ApiNumber.v2_0_0) {
    return createV1DataUrl(q, s, a);
  } else {
    return createV2DataUrl(q, s);
  }
};

const handleDataPathParams = (q: any): string => {
  const path = [];
  if (q.provider !== 'all') path.push(q.provider);
  if (q.key !== 'all' || path.length) path.push(q.key);
  return path.length ? '/' + path.reverse().join('/') : '';
};

const handleData2PathParams = (q: any): string => {
  const path = [];
  if (q.key !== 'all' || path.length) path.push(q.key);
  return path.length ? '/' + path.reverse().join('/') : '';
};

const hasHistory = (q: any, s: any, a: number): boolean =>
  a >= ApiNumber.v1_1_0 && q.history ? true : false;

const handleDataQueryParams = (q: any, s: any, a: number): string => {
  const p = [];
  if (q.obsDimension) p.push(`dimensionAtObservation=${q.obsDimension}`);
  if (q.detail !== 'full') p.push(`detail=${q.detail}`);
  if (hasHistory(q, s, a)) p.push(`includeHistory=${q.history}`);
  if (q.start) p.push(`startPeriod=${q.start}`);
  if (q.end) p.push(`endPeriod=${q.end}`);
  if (q.updatedAfter) p.push(`updatedAfter=${q.updatedAfter}`);
  if (q.firstNObs) p.push(`firstNObservations=${q.firstNObs}`);
  if (q.lastNObs) p.push(`lastNObservations=${q.lastNObs}`);
  return p.length > 0 ? '?' + p.reduceRight((x, y) => x + '&' + y) : '';
};

const handleData2QueryParams = (q: any, s: any, a: number): string => {
  const p = [];
  if (q.obsDimension) p.push(`dimensionAtObservation=${q.obsDimension}`);
  if (q.detail !== 'full') p.push(`${translateDetail(q.detail)}`);
  if (hasHistory(q, s, a)) p.push(`includeHistory=${q.history}`);
  if (q.updatedAfter) p.push(`updatedAfter=${q.updatedAfter}`);
  if (q.firstNObs) p.push(`firstNObservations=${q.firstNObs}`);
  if (q.lastNObs) p.push(`lastNObservations=${q.lastNObs}`);
  return p.length > 0 ? '?' + p.reduceRight((x, y) => x + '&' + y) : '';
};

const createShortV1Url = (q: any, s: any, a: number): string => {
  let u = createEntryPoint(s);
  u += `data/${q.flow}`;
  u += handleDataPathParams(q);
  u += handleDataQueryParams(q, s, a);
  return u;
};

const createShortV2Url = (q: any, s: any, a: number): string => {
  validateDataForV2(q, s);
  let u = createEntryPoint(s);
  const fc = parseFlow(q.flow);
  u += `data/dataflow/${fc[0]}/${fc[1]}`;
  const pp = handleData2PathParams(q);
  if (fc[2] !== '*' || pp !== '') {
    u += `/${fc[2]}`;
  }
  u += pp;
  u += handleData2QueryParams(q, s, a);
  return u;
};

const createShortDataQuery = (q: any, s: any, a: number): string => {
  if (a < ApiNumber.v2_0_0) {
    return createShortV1Url(q, s, a);
  } else {
    return createShortV2Url(q, s, a);
  }
};

class Handler {

  handle(q: any, s: any, skip?: boolean): string {
    const api = ApiNumber[getKeyFromVersion(s.api)];
    checkMultipleItems(q.provider, s, 'providers', api);
    if (skip) {
      return createShortDataQuery(q, s, api);
    } else {
      return createDataQuery(q, s, api);
    }
  }
}

export { Handler as DataQueryHandler };
