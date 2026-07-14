import chai from 'chai';

import { Service } from '../../src/service/service';
import { ApiVersion } from '../../src/utils/api-version';
import { DataQuery } from '../../src/data/data-query';
import { MetadataQuery } from '../../src/metadata/metadata-query';
import { AvailabilityQuery } from '../../src/avail/availability-query';
import { SchemaQuery } from '../../src/schema/schema-query';
import { UrlGenerator } from '../../src/utils/url-generator';

const should = chai.should();

describe('URL Generator for schema queries', () => {
  it('generates a URL for a schema query', () => {
    const expected =
      'http://sdw-wsrest.ecb.europa.eu/service/schema/dataflow' +
      '/ECB/EXR/1.0?explicitMeasure=false';
    const query = SchemaQuery.from({
      context: 'dataflow',
      id: 'EXR',
      agency: 'ECB',
      version: '1.0',
    });
    const service = Service.ECB;
    const url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });

  it('generates a URL for a schema query (with dimensionAtObservation)', () => {
    const expected =
      'http://sdw-wsrest.ecb.europa.eu/service/schema/dataflow' +
      '/ECB/EXR/latest?explicitMeasure=false&dimensionAtObservation=TEST';
    const query = SchemaQuery.from({
      context: 'dataflow',
      id: 'EXR',
      agency: 'ECB',
      obsDimension: 'TEST',
    });
    const service = Service.ECB;
    const url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });

  it('offers to skip default values for schema', () => {
    const expected = 'http://test.com/schema/dataflow/ECB/EXR';
    const query = SchemaQuery.from({
      context: 'dataflow',
      id: 'EXR',
      agency: 'ECB',
    });
    const service = Service.from({ url: 'http://test.com' });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds them when needed (version)', () => {
    const expected = 'http://test.com/schema/dataflow/ECB/EXR/1.1';
    const query = SchemaQuery.from({
      context: 'dataflow',
      id: 'EXR',
      agency: 'ECB',
      version: '1.1',
    });
    const service = Service.from({ url: 'http://test.com' });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds them when needed (explicit)', () => {
    const expected =
      'http://test.com/schema/dataflow/ECB/EXR?explicitMeasure=true';
    const query = SchemaQuery.from({
      context: 'dataflow',
      id: 'EXR',
      agency: 'ECB',
      explicit: true,
    });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v1_5_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds them when needed (obsDimension)', () => {
    const expected =
      'http://test.com/schema/dataflow/ECB/EXR?dimensionAtObservation=TEST';
    const query = SchemaQuery.from({
      context: 'dataflow',
      id: 'EXR',
      agency: 'ECB',
      obsDimension: 'TEST',
    });
    const service = Service.from({ url: 'http://test.com' });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds them when needed (query params)', () => {
    const expected =
      'http://test.com/schema/dataflow/ECB/EXR?explicitMeasure=true' +
      '&dimensionAtObservation=TEST';
    const query = SchemaQuery.from({
      context: 'dataflow',
      id: 'EXR',
      agency: 'ECB',
      explicit: true,
      obsDimension: 'TEST',
    });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v1_5_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('supports metadataprovisionagreement since v2.0.0', () => {
    const expected =
      'http://test.com/schema/metadataprovisionagreement/ECB/EXR?' +
      'dimensionAtObservation=TEST';
    const query = SchemaQuery.from({
      context: 'metadataprovisionagreement',
      id: 'EXR',
      agency: 'ECB',
      obsDimension: 'TEST',
    });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('does not support metadataprovisionagreement before v2.0.0', () => {
    const query = SchemaQuery.from({
      context: 'metadataprovisionagreement',
      id: 'EXR',
      agency: 'ECB',
      obsDimension: 'TEST',
    });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v1_5_0,
    });
    const test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(
      test,
      Error,
      'metadataprovisionagreement not allowed in v1.5.0',
    );
  });

  it('does not support explicitMeasure starting with v2.0.0', () => {
    const query = SchemaQuery.from({
      context: 'provisionagreement',
      id: 'EXR',
      agency: 'ECB',
      obsDimension: 'TEST',
      explicit: true,
    });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'explicit parameter not allowed in v2.0.0');
  });

  it('does no longer use default explicitMeasure starting with v2.0.0', () => {
    const expected = 'http://test.com/schema/dataflow/ECB/EXR/1.0.0';
    const query = SchemaQuery.from({
      context: 'dataflow',
      id: 'EXR',
      agency: 'ECB',
      version: '1.0.0',
    });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });

  it('does not support semver before v2.0.0', () => {
    let query = SchemaQuery.from({
      context: 'dataflow',
      id: 'EXR',
      agency: 'ECB',
      version: '~',
    });
    let service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v1_5_0,
    });
    let test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'Semantic versioning not allowed in v1.5.0');

    query = SchemaQuery.from({
      context: 'dataflow',
      id: 'EXR',
      agency: 'ECB',
      version: '1.2+.42',
    });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_5_0 });
    test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'Semantic versioning not allowed in v1.5.0');
  });

  it('rewrites version keywords since v2.0.0', () => {
    const expected =
      'http://test.com/schema/dataflow/ECB/EXR/~?' +
      'dimensionAtObservation=TEST';
    const query = SchemaQuery.from({
      context: 'dataflow',
      id: 'EXR',
      agency: 'ECB',
      version: 'latest',
      obsDimension: 'TEST',
    });
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });
});
