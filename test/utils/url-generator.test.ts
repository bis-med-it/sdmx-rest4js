import chai from 'chai';
import { Service } from '../../src/service/service';
import { ApiVersion } from '../../src/utils/api-version';
import { DataQuery } from '../../src/data/data-query';
import { MetadataQuery } from '../../src/metadata/metadata-query';
import { AvailabilityQuery } from '../../src/avail/availability-query';
import { SchemaQuery } from '../../src/schema/schema-query';
import { UrlGenerator } from '../../src/utils/url-generator';

const should = chai.should();

describe('URL Generator (generic)', () => {
  it('throws an exception if no query is supplied', () => {
    const test = () => (new UrlGenerator() as any).getUrl();
    should.Throw(test, Error, 'A valid query must be supplied');
  });

  it('throws an exception if the input is not a data or a metadata query', () => {
    const service = Service.from({
      url: 'http://test.com',
      api: ApiVersion.v2_0_0,
    });
    const test = () => new UrlGenerator().getUrl({ test: 'Test' }, service);
    should.Throw(test, TypeError, 'not a valid query');
  });

  it('throws an exception if no service is supplied', () => {
    const query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ',
      agency: 'ECB',
      item: 'A',
    });
    const test = () => (new UrlGenerator() as any).getUrl(query);
    should.Throw(test, Error, 'not a valid service');
  });

  it('throws an exception if a service without a URL is supplied', () => {
    const query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ',
      agency: 'ECB',
      item: 'A',
    });
    const test = () => new UrlGenerator().getUrl(query, { id: 'test' });
    should.Throw(test, ReferenceError, 'not a valid service');
  });
});
