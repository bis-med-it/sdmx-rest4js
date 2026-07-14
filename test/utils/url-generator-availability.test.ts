import chai from 'chai';

import { Service } from '../../src/service/service';
import { ApiVersion } from '../../src/utils/api-version';
import { AvailabilityQuery } from '../../src/avail/availability-query';
import { UrlGenerator } from '../../src/utils/url-generator';

const should = chai.should();

describe('URL Generator for availability queries', () => {
  it('generates a URL for a full availability query', () => {
    const expected =
      'http://test.com/availableconstraint/EXR/A..EUR.SP00.A/ECB/FREQ?' +
      'mode=available&references=none' +
      '&startPeriod=2010&endPeriod=2015&updatedAfter=2016-03-01T00:00:00Z';
    const query = AvailabilityQuery.from({
      flow: 'EXR',
      key: 'A..EUR.SP00.A',
      provider: 'ECB',
      component: 'FREQ',
      start: '2010',
      end: '2015',
      updatedAfter: '2016-03-01T00:00:00Z',
      mode: 'available',
      references: 'none',
    });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v1_5_0,
    });
    const url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });

  it('generates a URL for a full availability query (2.0.0)', () => {
    const expected =
      'http://test.com/availability/dataflow/*/EXR/*/A..EUR.SP00.A/FREQ?' +
      'mode=available&references=none' +
      '&updatedAfter=2016-03-01T00:00:00Z';
    const query = AvailabilityQuery.from({
      flow: 'EXR',
      key: 'A..EUR.SP00.A',
      component: 'FREQ',
      updatedAfter: '2016-03-01T00:00:00Z',
      mode: 'available',
      references: 'none',
    });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });

  it('generates a URL for a partial availability query', () => {
    const expected =
      'http://test.com/availableconstraint/EXR/A..EUR.SP00.A/all/all?' +
      'mode=exact&references=none';
    const query = AvailabilityQuery.from({ flow: 'EXR', key: 'A..EUR.SP00.A' });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v1_5_0,
    });
    const url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });

  it('generates a URL for a partial availability query (2.0.0)', () => {
    const expected =
      'http://test.com/availability/dataflow/*/EXR/*/*/*?' +
      'mode=exact&references=none';
    const query = AvailabilityQuery.from({ flow: 'EXR' });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });

  it('supports minimal query if proper query class is used', () => {
    const expected =
      'http://test.com/availableconstraint/EXR/all/all/all?' +
      'mode=exact&references=none';
    const query = AvailabilityQuery.from({ flow: 'EXR' });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v1_5_0,
    });
    const url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });

  it('does not support availability queries before v1.3.0', () => {
    const query = AvailabilityQuery.from({ flow: 'EXR', key: 'A..EUR.SP00.A' });
    const service = Service.from({ url: 'http://test.com', api: 'v1.2.0' });
    const test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'Availability query not supported in v1.2.0');
  });

  it('offers to skip default values for availability', () => {
    const expected = 'http://test.com/availableconstraint/EXR';
    const query = AvailabilityQuery.from({
      flow: 'EXR',
      mode: 'exact',
      references: 'none',
    });
    const service = Service.from({ url: 'http://test.com', api: 'v1.5.0' });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip default values for availability (2.0.0)', () => {
    const expected = 'http://test.com/availability/dataflow/*/EXR';
    const query = AvailabilityQuery.from({
      flow: 'EXR',
      mode: 'exact',
      references: 'none',
    });
    const service = Service.from({ url: 'http://test.com', api: 'v2.0.0' });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds them when needed (key, 2.0.0)', () => {
    const expected = 'http://test.com/availability/dataflow/*/EXR/*/A.CH';
    const query = AvailabilityQuery.from({ flow: 'EXR', key: 'A.CH' });
    const service = Service.from({ url: 'http://test.com', api: 'v2.0.0' });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds them when needed (provider)', () => {
    const expected = 'http://test.com/availableconstraint/EXR/all/ECB';
    const query = AvailabilityQuery.from({ flow: 'EXR', provider: 'ECB' });
    const service = Service.from({ url: 'http://test.com', api: 'v1.5.0' });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds them when needed (component)', () => {
    const expected = 'http://test.com/availableconstraint/EXR/all/all/FREQ';
    const query = AvailabilityQuery.from({ flow: 'EXR', component: 'FREQ' });
    const service = Service.from({ url: 'http://test.com', api: 'v1.5.0' });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds them when needed (component, 2.0.0)', () => {
    const expected = 'http://test.com/availability/dataflow/*/EXR/*/*/FREQ';
    const query = AvailabilityQuery.from({ flow: 'EXR', component: 'FREQ' });
    const service = Service.from({ url: 'http://test.com', api: 'v2.0.0' });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds them when needed (mode)', () => {
    const expected = 'http://test.com/availableconstraint/EXR?mode=available';
    const query = AvailabilityQuery.from({ flow: 'EXR', mode: 'available' });
    const service = Service.from({ url: 'http://test.com', api: 'v1.5.0' });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds them when needed (mode, 2.0.0)', () => {
    const expected =
      'http://test.com/availability/dataflow/*/EXR' + '?mode=available';
    const query = AvailabilityQuery.from({ flow: 'EXR', mode: 'available' });
    const service = Service.from({ url: 'http://test.com', api: 'v2.0.0' });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds them when needed (refs)', () => {
    const expected =
      'http://test.com/availableconstraint/EXR?references=codelist';
    const query = AvailabilityQuery.from({
      flow: 'EXR',
      references: 'codelist',
    });
    const service = Service.from({ url: 'http://test.com', api: 'v1.5.0' });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds them when needed (refs, 2.0.0)', () => {
    const expected =
      'http://test.com/availability/dataflow/*/EXR' + '?references=codelist';
    const query = AvailabilityQuery.from({
      flow: 'EXR',
      references: 'codelist',
    });
    const service = Service.from({ url: 'http://test.com', api: 'v2.0.0' });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds them when needed (start)', () => {
    const expected = 'http://test.com/availableconstraint/EXR?startPeriod=2007';
    const query = AvailabilityQuery.from({ flow: 'EXR', start: '2007' });
    const service = Service.from({ url: 'http://test.com', api: 'v1.5.0' });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds them when needed (end)', () => {
    const expected = 'http://test.com/availableconstraint/EXR?endPeriod=2073';
    const query = AvailabilityQuery.from({ flow: 'EXR', end: '2073' });
    const service = Service.from({ url: 'http://test.com', api: 'v1.5.0' });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds them when needed (start & end)', () => {
    const expected =
      'http://test.com/availableconstraint/EXR?startPeriod=2007&' +
      'endPeriod=2073';
    const query = AvailabilityQuery.from({
      flow: 'EXR',
      start: '2007',
      end: '2073',
    });
    const service = Service.from({ url: 'http://test.com', api: 'v1.5.0' });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds them when needed (upd)', () => {
    const expected =
      'http://test.com/availableconstraint/EXR?' +
      'updatedAfter=2016-03-01T00:00:00Z';
    const query = AvailabilityQuery.from({
      flow: 'EXR',
      updatedAfter: '2016-03-01T00:00:00Z',
    });
    const service = Service.from({ url: 'http://test.com', api: 'v1.5.0' });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds them when needed (upd, 2.0.0)', () => {
    const expected =
      'http://test.com/availability/dataflow/*/EXR?' +
      'updatedAfter=2016-03-01T00:00:00Z';
    const query = AvailabilityQuery.from({
      flow: 'EXR',
      updatedAfter: '2016-03-01T00:00:00Z',
    });
    const service = Service.from({ url: 'http://test.com', api: 'v2.0.0' });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds them when needed (multi, 2.0.0)', () => {
    const expected =
      'http://test.com/availability/dataflow/*/EXR?' +
      'mode=available&updatedAfter=2016-03-01T00:00:00Z';
    const query = AvailabilityQuery.from({
      flow: 'EXR',
      updatedAfter: '2016-03-01T00:00:00Z',
      mode: 'available',
    });
    const service = Service.from({ url: 'http://test.com', api: 'v2.0.0' });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('throws an error when using provider with 2.0.0', () => {
    let query = AvailabilityQuery.from({ flow: 'EXR', provider: 'ECB' });
    let service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    let test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'provider not allowed in v2.0.0');

    query = AvailabilityQuery.from({ flow: 'EXR', provider: 'ECB' });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    test = () => new UrlGenerator().getUrl(query, service, true);
    should.Throw(test, Error, 'provider not allowed in v2.0.0');
  });

  it('throws an error when using start with 2.0.0', () => {
    let query = AvailabilityQuery.from({ flow: 'EXR', start: '2007' });
    let service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    let test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'start not allowed in v2.0.0');

    query = AvailabilityQuery.from({ flow: 'EXR', start: '2007' });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    test = () => new UrlGenerator().getUrl(query, service, true);
    should.Throw(test, Error, 'start not allowed in v2.0.0');
  });

  it('throws an error when using end with 2.0.0', () => {
    let query = AvailabilityQuery.from({ flow: 'EXR', end: '2007' });
    let service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    let test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'end not allowed in v2.0.0');

    query = AvailabilityQuery.from({ flow: 'EXR', end: '2007' });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    test = () => new UrlGenerator().getUrl(query, service, true);
    should.Throw(test, Error, 'end not allowed in v2.0.0');
  });

  it('rejects keys containing dimensions separated with + (2.0.0)', () => {
    let query = AvailabilityQuery.from({
      flow: 'ECB,EXR,1.42',
      key: 'A+M.CHF',
    });
    let service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    let test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, '+ not allowed in key in v2.0.0');

    query = AvailabilityQuery.from({
      flow: 'ECB,EXR,1.42',
      key: 'A+M.CHF',
    });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    test = () => new UrlGenerator().getUrl(query, service, true);
    should.Throw(test, Error, '+ not allowed in key in v2.0.0');
  });
});
