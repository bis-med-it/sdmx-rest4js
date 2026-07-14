import chai from 'chai';

import { Service } from '../../src/service/service';
import { ApiVersion } from '../../src/utils/api-version';
import { DataQuery2 } from '../../src/data/data-query2';
import { UrlGenerator } from '../../src/utils/url-generator';

const should = chai.should();

describe('URL Generator for SDMX 3.0 data queries', () => {
  it('generates a URL for a full data query', () => {
    const expected =
      'http://test.com/data/dataflow/*/EXR/*/A..EUR.SP00.A' +
      '?c[OBS_CONF]=F&dimensionAtObservation=CURRENCY' +
      '&attributes=dataset,series&measures=none' +
      '&includeHistory=true' +
      '&updatedAfter=2016-03-01T00:00:00Z' +
      '&firstNObservations=1&lastNObservations=2';
    const query = DataQuery2.from({
      context: 'dataflow=*:EXR(*)',
      key: 'A..EUR.SP00.A',
      filters: 'OBS_CONF=F',
      updatedAfter: '2016-03-01T00:00:00Z',
      firstNObs: 1,
      lastNObs: 2,
      obsDimension: 'CURRENCY',
      attributes: 'dataset,series',
      measures: 'none',
      history: true,
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
      'http://test.com/data/dataflow/*/EXR/*/*?' +
      'attributes=dsd&measures=all&includeHistory=false';
    const query = DataQuery2.from({ context: 'dataflow=*:EXR(*)' });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });

  it('offers to skip all default values', () => {
    const expected = 'http://test.com/data';
    const query = DataQuery2.from(null);
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip default values (context)', () => {
    const expected = 'http://test.com/data/dataflow';
    const query = DataQuery2.from({ context: 'dataflow=*:*(*)' });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip default values (agency)', () => {
    const expected = 'http://test.com/data/*/BIS';
    const query = DataQuery2.from({ context: '*=BIS:*(*)' });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip default values (artefact)', () => {
    const expected = 'http://test.com/data/*/*/EXR';
    const query = DataQuery2.from({ context: '*=*:EXR(*)' });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip default values (version)', () => {
    const expected = 'http://test.com/data/*/*/*/~';
    const query = DataQuery2.from({ context: '*=*:*(~)' });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip default values (key)', () => {
    const expected = 'http://test.com/data/*/*/*/*/A.CHF';
    const query = DataQuery2.from({ key: 'A.CHF' });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip default values (filters)', () => {
    const expected = 'http://test.com/data?c[REF_AREA]=UY,AR';
    const query = DataQuery2.from({ filters: 'REF_AREA=UY,AR' });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip default values (updatedAfter)', () => {
    const expected =
      'http://test.com/data/dataflow/*/EXR?updatedAfter=2016-03-01T00:00:00Z';
    const query = DataQuery2.from({
      context: 'dataflow=*:EXR(*)',
      updatedAfter: '2016-03-01T00:00:00Z',
    });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip default values (firstNObs)', () => {
    const expected = 'http://test.com/data/dataflow/*/EXR?firstNObservations=1';
    const query = DataQuery2.from({
      context: 'dataflow=*:EXR(*)',
      firstNObs: 1,
    });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip default values (lastNObs)', () => {
    const expected = 'http://test.com/data/dataflow/*/EXR?lastNObservations=2';
    const query = DataQuery2.from({
      context: 'dataflow=*:EXR(*)',
      lastNObs: 2,
    });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip default values (obsDim)', () => {
    const expected =
      'http://test.com/data/dataflow/*/EXR?dimensionAtObservation=CURR';
    const query = DataQuery2.from({
      context: 'dataflow=*:EXR(*)',
      obsDimension: 'CURR',
    });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip default values (attributes)', () => {
    const expected = 'http://test.com/data/dataflow/*/EXR?attributes=msd';
    const query = DataQuery2.from({
      context: 'dataflow=*:EXR(*)',
      attributes: 'msd',
    });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip default values (measures)', () => {
    const expected = 'http://test.com/data/dataflow/*/EXR?measures=none';
    const query = DataQuery2.from({
      context: 'dataflow=*:EXR(*)',
      measures: 'none',
    });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip default values (history)', () => {
    const expected = 'http://test.com/data/dataflow/*/EXR?includeHistory=true';
    const query = DataQuery2.from({
      context: 'dataflow=*:EXR(*)',
      history: true,
    });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip default values (various)', () => {
    const expected =
      'http://test.com/data/dataflow/*/EXR/*/A..EUR.SP00.A?' +
      'updatedAfter=2016-03-01T00:00:00Z' +
      '&attributes=msd&dimensionAtObservation=CURRENCY';
    const query = DataQuery2.from({
      context: 'dataflow=*:EXR(*)',
      key: 'A..EUR.SP00.A',
      attributes: 'msd',
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

  it('throws an error when used against pre-SDMX 3.0 services', () => {
    const query = DataQuery2.from({ context: 'dataflow=*:EXR(*)' });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v1_5_0,
    });
    const test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'SDMX 3.0 queries not allowed in v1.5.0');
  });
});
