import chai from 'chai';

import { Service } from '../../src/service/service';
import { ApiVersion } from '../../src/utils/api-version';
import { AvailabilityQuery2 } from '../../src/avail/availability-query2';
import { UrlGenerator } from '../../src/utils/url-generator';

const should = chai.should();

describe('URL Generator for SDMX 3.0 availability queries', () => {

  it('generates a URL for a full availability query', () => {
    const expected = 'http://test.com/availability/dataflow/*/EXR/*/A..EUR.SP00.A/FREQ?'
      + 'c[FREQ]=A&mode=available&references=none'
      + '&updatedAfter=2016-03-01T00:00:00Z';
    const query = AvailabilityQuery2.from({
      context: 'dataflow=*:EXR(*)',
      key: 'A..EUR.SP00.A',
      component: 'FREQ',
      updatedAfter: '2016-03-01T00:00:00Z',
      mode: 'available',
      references: 'none',
      filters: 'FREQ=A',
    });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    const url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });

  it('generates a URL for a partial availability query', () => {
    const expected = 'http://test.com/availability/dataflow/*/EXR/*/*/*?'
      + 'mode=exact&references=none';
    const query = AvailabilityQuery2.from({ context: 'dataflow=*:EXR(*)' });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    const url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });

  it('generates a URL with all default values', () => {
    const expected = 'http://test.com/availability/*/*/*/*/*/*?'
      + 'mode=exact&references=none';
    const query = AvailabilityQuery2.from(null);
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    const url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });

  it('offers to skip all default values', () => {
    const expected = 'http://test.com/availability';
    const query = AvailabilityQuery2.from(null);
    const service = Service.from({ url: 'http://test.com', api: 'v2.0.0' });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip default values (context)', () => {
    const expected = 'http://test.com/availability/dataflow';
    const query = AvailabilityQuery2.from({ context: 'dataflow=*:*(*)' });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip default values (agency)', () => {
    const expected = 'http://test.com/availability/*/BIS';
    const query = AvailabilityQuery2.from({ context: '*=BIS:*(*)' });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip default values (artefact)', () => {
    const expected = 'http://test.com/availability/*/*/EXR';
    const query = AvailabilityQuery2.from({ context: '*=*:EXR(*)' });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip default values (version)', () => {
    const expected = 'http://test.com/availability/*/*/*/~';
    const query = AvailabilityQuery2.from({ context: '*=*:*(~)' });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip default values (key)', () => {
    const expected = 'http://test.com/availability/dataflow/*/EXR/*/A.CH';
    const query = AvailabilityQuery2.from({ context: 'dataflow=*:EXR(*)', key: 'A.CH' });
    const service = Service.from({ url: 'http://test.com', api: 'v2.0.0' });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip default values (component)', () => {
    const expected = 'http://test.com/availability/dataflow/*/EXR/*/*/FREQ';
    const query = AvailabilityQuery2.from({ context: 'dataflow=*:EXR(*)', component: 'FREQ' });
    const service = Service.from({ url: 'http://test.com', api: 'v2.0.0' });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip default values (mode)', () => {
    const expected = 'http://test.com/availability/dataflow/*/EXR'
      + '?mode=available';
    const query = AvailabilityQuery2.from({ context: 'dataflow=*:EXR(*)', mode: 'available' });
    const service = Service.from({ url: 'http://test.com', api: 'v2.0.0' });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip default values (referencess)', () => {
    const expected = 'http://test.com/availability/dataflow/*/EXR'
      + '?references=codelist';
    const query = AvailabilityQuery2.from({ context: 'dataflow=*:EXR(*)', references: 'codelist' });
    const service = Service.from({ url: 'http://test.com', api: 'v2.0.0' });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip default values (updatedAfter)', () => {
    const expected = 'http://test.com/availability/dataflow/*/EXR?'
      + 'updatedAfter=2016-03-01T00:00:00Z';
    const query = AvailabilityQuery2.from({
      context: 'dataflow=*:EXR(*)',
      updatedAfter: '2016-03-01T00:00:00Z',
    });
    const service = Service.from({ url: 'http://test.com', api: 'v2.0.0' });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip default values (filters)', () => {
    const expected = 'http://test.com/availability?c[REF_AREA]=UY,AR';
    const query = AvailabilityQuery2.from({ filters: 'REF_AREA=UY,AR' });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip default values (multi)', () => {
    const expected = 'http://test.com/availability/dataflow/*/EXR?'
      + 'mode=available&updatedAfter=2016-03-01T00:00:00Z';
    const query = AvailabilityQuery2.from({
      context: 'dataflow=*:EXR(*)',
      updatedAfter: '2016-03-01T00:00:00Z',
      mode: 'available',
    });
    const service = Service.from({ url: 'http://test.com', api: 'v2.0.0' });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('throws an error when used against pre-SDMX 3.0 services', () => {
    const query = AvailabilityQuery2.from({ context: 'dataflow=*:EXR(*)' });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_5_0 });
    const test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'SDMX 3.0 queries not allowed in v1.5.0');
  });
});
