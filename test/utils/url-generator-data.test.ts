import chai from 'chai';
import { Service } from '../../src/service/service';
import { ApiVersion } from '../../src/utils/api-version';
import { DataQuery } from '../../src/data/data-query';
import { UrlGenerator } from '../../src/utils/url-generator';

const should = chai.should();

describe('URL Generator for data queries', () => {
  it('generates a URL for a full data query', () => {
    const expected =
      'http://test.com/data/EXR/A..EUR.SP00.A/ECB?' +
      'dimensionAtObservation=CURRENCY&detail=nodata&includeHistory=true' +
      '&startPeriod=2010&endPeriod=2015&updatedAfter=2016-03-01T00:00:00Z' +
      '&firstNObservations=1&lastNObservations=1';
    const query = DataQuery.from({
      flow: 'EXR',
      key: 'A..EUR.SP00.A',
      provider: 'ECB',
      obsDimension: 'CURRENCY',
      detail: 'nodata',
      history: true,
      start: '2010',
      end: '2015',
      updatedAfter: '2016-03-01T00:00:00Z',
      firstNObs: 1,
      lastNObs: 1,
    });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v1_1_0,
    });
    const url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });

  it('generates a URL for a full data query (2.0.0)', () => {
    const expected =
      'http://test.com/data/dataflow/*/EXR/*/A..EUR.SP00.A' +
      '?dimensionAtObservation=CURRENCY' +
      '&attributes=dataset,series&measures=none' +
      '&includeHistory=true' +
      '&updatedAfter=2016-03-01T00:00:00Z' +
      '&firstNObservations=1&lastNObservations=1';
    const query = DataQuery.from({
      flow: 'EXR',
      key: 'A..EUR.SP00.A',
      obsDimension: 'CURRENCY',
      detail: 'nodata',
      history: true,
      updatedAfter: '2016-03-01T00:00:00Z',
      firstNObs: 1,
      lastNObs: 1,
    });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });

  it('generates a URL for a partial data query', () => {
    const expected =
      'http://test.com/data/EXR/A..EUR.SP00.A/all?' +
      'detail=full&includeHistory=false';
    const query = DataQuery.from({ flow: 'EXR', key: 'A..EUR.SP00.A' });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v1_1_0,
    });
    const url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });

  it('generates a URL for a partial data query (2.0.0)', () => {
    const expected =
      'http://test.com/data/dataflow/*/EXR/*/A..EUR.SP00.A?' +
      'attributes=dsd&measures=all&includeHistory=false';
    const query = DataQuery.from({ flow: 'EXR', key: 'A..EUR.SP00.A' });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });

  it('supports history but only for API version 1.1.0 and above', () => {
    const expected =
      'http://test.com/data/EXR/A..EUR.SP00.A/ECB?' +
      'dimensionAtObservation=CURRENCY&detail=nodata' +
      '&startPeriod=2010&endPeriod=2015&updatedAfter=2016-03-01T00:00:00Z' +
      '&firstNObservations=1&lastNObservations=1';
    const query = DataQuery.from({
      flow: 'EXR',
      key: 'A..EUR.SP00.A',
      provider: 'ECB',
      obsDimension: 'CURRENCY',
      detail: 'nodata',
      history: true,
      start: '2010',
      end: '2015',
      updatedAfter: '2016-03-01T00:00:00Z',
      firstNObs: 1,
      lastNObs: 1,
    });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v1_0_2,
    });
    const url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });

  it('defaults to latest API', () => {
    const expected =
      'http://test.com/data/dataflow/*/EXR/*/A..EUR.SP00.A?' +
      'dimensionAtObservation=CURRENCY&attributes=dataset,series&measures=none' +
      '&includeHistory=true&updatedAfter=2016-03-01T00:00:00Z' +
      '&firstNObservations=1&lastNObservations=1';
    const query = DataQuery.from({
      flow: 'EXR',
      key: 'A..EUR.SP00.A',
      obsDimension: 'CURRENCY',
      detail: 'nodata',
      history: true,
      updatedAfter: '2016-03-01T00:00:00Z',
      firstNObs: 1,
      lastNObs: 1,
    });
    const service = Service.from({ url: 'http://test.com' });
    const url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });

  it('offers to skip default values for data', () => {
    const expected = 'http://test.com/data/EXR';
    const query = DataQuery.from({ flow: 'EXR' });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v1_5_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip default values for data (v2.0.0)', () => {
    const expected = 'http://test.com/data/dataflow/*/EXR';
    const query = DataQuery.from({ flow: 'EXR' });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds them when needed (provider)', () => {
    const expected = 'http://test.com/data/EXR/all/ECB';
    const query = DataQuery.from({ flow: 'EXR', provider: 'ECB' });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v1_5_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds params when needed (start)', () => {
    const expected = 'http://test.com/data/EXR?startPeriod=2010';
    const query = DataQuery.from({ flow: 'EXR', start: '2010' });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v1_5_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds params when needed (end)', () => {
    const expected = 'http://test.com/data/EXR?endPeriod=2010';
    const query = DataQuery.from({ flow: 'EXR', end: '2010' });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v1_5_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds params when needed (updatedAfter)', () => {
    const expected =
      'http://test.com/data/EXR?updatedAfter=2016-03-01T00:00:00Z';
    const query = DataQuery.from({
      flow: 'EXR',
      updatedAfter: '2016-03-01T00:00:00Z',
    });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v1_5_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds params when needed (updatedAfter, 2.0.0)', () => {
    const expected =
      'http://test.com/data/dataflow/*/EXR?updatedAfter=2016-03-01T00:00:00Z';
    const query = DataQuery.from({
      flow: 'EXR',
      updatedAfter: '2016-03-01T00:00:00Z',
    });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds params when needed (firstNObs)', () => {
    const expected = 'http://test.com/data/EXR?firstNObservations=1';
    const query = DataQuery.from({ flow: 'EXR', firstNObs: 1 });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v1_5_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds params when needed (firstNObs, 2.0.0)', () => {
    const expected = 'http://test.com/data/dataflow/*/EXR?firstNObservations=1';
    const query = DataQuery.from({ flow: 'EXR', firstNObs: 1 });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds params when needed (lastNObs)', () => {
    const expected = 'http://test.com/data/EXR?lastNObservations=2';
    const query = DataQuery.from({ flow: 'EXR', lastNObs: 2 });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v1_5_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds params when needed (lastNObs, 2.0.0)', () => {
    const expected = 'http://test.com/data/dataflow/*/EXR?lastNObservations=2';
    const query = DataQuery.from({ flow: 'EXR', lastNObs: 2 });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds params when needed (detail)', () => {
    const expected = 'http://test.com/data/EXR?detail=dataonly';
    const query = DataQuery.from({ flow: 'EXR', detail: 'dataonly' });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v1_5_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds params when needed (detail, 2.0.0)', () => {
    const expected =
      'http://test.com/data/dataflow/*/EXR?attributes=none&measures=all';
    const query = DataQuery.from({ flow: 'EXR', detail: 'dataonly' });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds params when needed (history)', () => {
    const expected = 'http://test.com/data/EXR?includeHistory=true';
    const query = DataQuery.from({ flow: 'EXR', history: true });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v1_5_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds params when needed (history, 2.0.0)', () => {
    const expected = 'http://test.com/data/dataflow/*/EXR?includeHistory=true';
    const query = DataQuery.from({ flow: 'EXR', history: true });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds params when needed (obsDim)', () => {
    const expected = 'http://test.com/data/EXR?dimensionAtObservation=CURR';
    const query = DataQuery.from({ flow: 'EXR', obsDimension: 'CURR' });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v1_5_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds params when needed (obsDim, 2.0.0)', () => {
    const expected =
      'http://test.com/data/dataflow/*/EXR?dimensionAtObservation=CURR';
    const query = DataQuery.from({ flow: 'EXR', obsDimension: 'CURR' });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds params when needed (various)', () => {
    const expected =
      'http://test.com/data/EXR/A..EUR.SP00.A?' +
      'updatedAfter=2016-03-01T00:00:00Z' +
      '&startPeriod=2010&dimensionAtObservation=CURRENCY';
    const query = DataQuery.from({
      flow: 'EXR',
      key: 'A..EUR.SP00.A',
      obsDimension: 'CURRENCY',
      start: '2010',
      updatedAfter: '2016-03-01T00:00:00Z',
    });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v1_5_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds params when needed (various, 2.0.0)', () => {
    const expected =
      'http://test.com/data/dataflow/*/EXR/*/A..EUR.SP00.A?' +
      'updatedAfter=2016-03-01T00:00:00Z' +
      '&dimensionAtObservation=CURRENCY';
    const query = DataQuery.from({
      flow: 'EXR',
      key: 'A..EUR.SP00.A',
      obsDimension: 'CURRENCY',
      updatedAfter: '2016-03-01T00:00:00Z',
    });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('supports multiple providers for API version 1.3.0 and until 2.0.0', () => {
    const expected =
      'http://test.com/data/EXR/A..EUR.SP00.A/SDMX,ECB+BIS?' +
      'updatedAfter=2016-03-01T00:00:00Z' +
      '&startPeriod=2010&dimensionAtObservation=CURRENCY';
    const query = DataQuery.from({
      flow: 'EXR',
      key: 'A..EUR.SP00.A',
      obsDimension: 'CURRENCY',
      start: '2010',
      updatedAfter: '2016-03-01T00:00:00Z',
      provider: ['SDMX,ECB', 'BIS'],
    });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v1_3_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('does not support providers before API version 1.3.0', () => {
    const query = DataQuery.from({ flow: 'EXR', provider: 'SDMX,ECB+BIS' });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v1_2_0,
    });
    const test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'Multiple providers not allowed in v1.2.0');
  });

  it('throws an error when using provider with 2.0.0', () => {
    let query = DataQuery.from({ flow: 'EXR', provider: 'ECB' });
    let service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    let test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'provider not allowed in v2.0.0');

    query = DataQuery.from({ flow: 'EXR', provider: 'ECB' });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    test = () => new UrlGenerator().getUrl(query, service, true);
    should.Throw(test, Error, 'provider not allowed in v2.0.0');
  });

  it('throws an error when using start with 2.0.0', () => {
    let query = DataQuery.from({ flow: 'EXR', start: '2007' });
    let service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    let test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'start not allowed in v2.0.0');

    query = DataQuery.from({ flow: 'EXR', start: '2007' });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    test = () => new UrlGenerator().getUrl(query, service, true);
    should.Throw(test, Error, 'start not allowed in v2.0.0');
  });

  it('throws an error when using end with 2.0.0', () => {
    let query = DataQuery.from({ flow: 'EXR', end: '2007' });
    let service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    let test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'end not allowed in v2.0.0');

    query = DataQuery.from({ flow: 'EXR', end: '2007' });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    test = () => new UrlGenerator().getUrl(query, service, true);
    should.Throw(test, Error, 'end not allowed in v2.0.0');
  });

  it('translates details=full with 2.0.0', () => {
    let expected =
      'http://test.com/data/dataflow/*/EXR/*/*?' +
      'attributes=dsd&measures=all&includeHistory=false';
    let query = DataQuery.from({
      flow: 'EXR',
      detail: 'full',
    });
    let service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    let url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    expected = 'http://test.com/data/dataflow/*/EXR';
    query = DataQuery.from({
      flow: 'EXR',
      detail: 'full',
    });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('translates details=dataonly with 2.0.0', () => {
    let expected =
      'http://test.com/data/dataflow/*/EXR/*/*?' +
      'attributes=none&measures=all&includeHistory=false';
    let query = DataQuery.from({
      flow: 'EXR',
      detail: 'dataonly',
    });
    let service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    let url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    expected =
      'http://test.com/data/dataflow/*/EXR?' + 'attributes=none&measures=all';
    query = DataQuery.from({
      flow: 'EXR',
      detail: 'dataonly',
    });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('translates details=serieskeysonly with 2.0.0', () => {
    let expected =
      'http://test.com/data/dataflow/*/EXR/*/*?' +
      'attributes=none&measures=none&includeHistory=false';
    let query = DataQuery.from({
      flow: 'EXR',
      detail: 'serieskeysonly',
    });
    let service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    let url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    expected =
      'http://test.com/data/dataflow/*/EXR?' + 'attributes=none&measures=none';
    query = DataQuery.from({
      flow: 'EXR',
      detail: 'serieskeysonly',
    });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('translates details=nodata with 2.0.0', () => {
    let expected =
      'http://test.com/data/dataflow/*/EXR/*/*?' +
      'attributes=dataset,series&measures=none&includeHistory=false';
    let query = DataQuery.from({
      flow: 'EXR',
      detail: 'nodata',
    });
    let service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    let url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    expected =
      'http://test.com/data/dataflow/*/EXR?' +
      'attributes=dataset,series&measures=none';
    query = DataQuery.from({
      flow: 'EXR',
      detail: 'nodata',
    });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('translates 1-part dataflow in the correct 2.0.0 context', () => {
    let expected =
      'http://test.com/data/dataflow/*/EXR/*/*?' +
      'attributes=dsd&measures=all&includeHistory=false';
    let query = DataQuery.from({
      flow: 'EXR',
    });
    let service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    let url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    expected = 'http://test.com/data/dataflow/*/EXR';
    query = DataQuery.from({
      flow: 'EXR',
    });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('translates 2-parts dataflow in the correct 2.0.0 context', () => {
    let expected =
      'http://test.com/data/dataflow/ECB/EXR/*/*?' +
      'attributes=dsd&measures=all&includeHistory=false';
    let query = DataQuery.from({
      flow: 'ECB,EXR',
    });
    let service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    let url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    expected = 'http://test.com/data/dataflow/ECB/EXR';
    query = DataQuery.from({
      flow: 'ECB,EXR',
    });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('translates 3-parts dataflow in the correct 2.0.0 context', () => {
    let expected =
      'http://test.com/data/dataflow/ECB/EXR/1.42/*?' +
      'attributes=dsd&measures=all&includeHistory=false';
    let query = DataQuery.from({
      flow: 'ECB,EXR,1.42',
    });
    let service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    let url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    expected = 'http://test.com/data/dataflow/ECB/EXR/1.42';
    query = DataQuery.from({
      flow: 'ECB,EXR,1.42',
    });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('rejects keys containing dimensions separated with + (2.0.0)', () => {
    let query = DataQuery.from({
      flow: 'ECB,EXR,1.42',
      key: 'A+M.CHF',
    });
    let service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    let test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, '+ not allowed in key in v2.0.0');

    query = DataQuery.from({
      flow: 'ECB,EXR,1.42',
      key: 'A+M.CHF',
    });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    test = () => new UrlGenerator().getUrl(query, service, true);
    should.Throw(test, Error, '+ not allowed in key in v2.0.0');
  });
});
