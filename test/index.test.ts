import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import nock from 'nock';
import sdmxrest from '../src/index';
import { ApiVersion } from '../src/utils/api-version';

chai.use(chaiAsPromised);
const should = chai.should();

describe('API', () => {

  it('offers the expected functions and objects', () => {
    sdmxrest.should.have.property('getService');
    sdmxrest.should.have.property('services').that.is.an('array');
    sdmxrest.should.have.property('getDataQuery');
    sdmxrest.should.have.property('getDataQuery2');
    sdmxrest.should.have.property('getMetadataQuery');
    sdmxrest.should.have.property('getAvailabilityQuery');
    sdmxrest.should.have.property('getAvailabilityQuery2');
    sdmxrest.should.have.property('getSchemaQuery');
    sdmxrest.should.have.property('getUrl');
    sdmxrest.should.have.property('request');
    sdmxrest.should.have.property('checkStatus');
    sdmxrest.should.have.property('checkMediaType');
    sdmxrest.should.have.property('data').that.is.an('object');
    sdmxrest.should.have.property('metadata').that.is.an('object');
    sdmxrest.should.have.property('availability').that.is.an('object');
    sdmxrest.should.have.property('schema').that.is.an('object');
    sdmxrest.should.have.property('utils').that.is.an('object');
    sdmxrest.should.have.property('data').that.is.an('object');
    sdmxrest.data.should.have.property('DataFormat').that.is.not.undefined;
    sdmxrest.data.should.have.property('DataDetail').that.is.not.undefined;
    sdmxrest.metadata.should.have.property('MetadataDetail')
      .that.is.not.undefined;
    sdmxrest.metadata.should.have.property('MetadataFormat')
      .that.is.not.undefined;
    sdmxrest.metadata.should.have.property('MetadataReferences')
      .that.is.not.undefined;
    sdmxrest.availability.should.have.property('AvailabilityMode')
      .that.is.not.undefined;
    sdmxrest.availability.should.have.property('AvailabilityReferences')
      .that.is.not.undefined;
    sdmxrest.metadata.should.have.property('MetadataType').that.is.not.undefined;
    sdmxrest.schema.should.have.property('SchemaContext').that.is.not.undefined;
    sdmxrest.schema.should.have.property('SchemaFormat').that.is.not.undefined;
    sdmxrest.utils.should.have.property('ApiVersion').that.is.not.undefined;
    sdmxrest.utils.should.have.property('ApiResources').that.is.not.undefined;
    sdmxrest.utils.should.have.property('SdmxPatterns').that.is.not.undefined;
    sdmxrest.utils.SdmxPatterns.should.have.property('IDType')
      .that.is.a('regexp');
  });

  describe('when using getService()', () => {

    it('offers to use existing services', () => {
      const service = sdmxrest.getService('ECB');
      service.should.be.an('object');
      service.should.have.property('id').that.equals('ECB');
      service.should.have.property('name').that.equals('European Central Bank');
      service.should.have.property('url').that.contains('sdw-wsrest');
      service.should.have.property('api').that.is.not.undefined;
    });

    it('offers to create services from properties', () => {
      const input = {
        id: 'TEST',
        url: 'http://test.com',
      };
      const service = sdmxrest.getService(input);
      service.should.be.an('object');
      service.should.have.property('id').that.equals(input.id);
      service.should.have.property('name').that.is.undefined;
      service.should.have.property('url').that.equals(input.url);
      service.should.have.property('api').that.equals(ApiVersion.LATEST);
    });

    it('fails if the requested service is unknown', () => {
      const test = () => sdmxrest.getService('UNKNOWN');
      should.Throw(test, ReferenceError,
        'is not in the list of predefined services');
    });

    it('fails if the input is not of the expected type', () => {
      let test = () => sdmxrest.getService(2 as any);
      should.Throw(test, TypeError, 'Invalid type of ');

      test = () => sdmxrest.getService(undefined as any);
      should.Throw(test, TypeError, 'Invalid type of ');

      test = () => sdmxrest.getService([] as any);
      should.Throw(test, TypeError, 'Invalid type of ');
    });
  });

  describe('when using services', () => {

    it('list some services', () => {
      sdmxrest.services.should.be.an('array');
      sdmxrest.services.should.have.property('length').that.is.gte(5);
    });

    it('should contain known services', () => {
      sdmxrest.services.should.include.members([sdmxrest.getService('ECB_S')]);
    });
  });

  describe('when using getDataQuery()', () => {

    it('offers to create a data query from properties', () => {
      const input = {
        flow: 'EXR',
        key: 'A..EUR.SP00.A',
      };
      const query = sdmxrest.getDataQuery(input);
      query.should.be.an('object');
      query.should.have.property('flow').that.equals(input.flow);
      query.should.have.property('key').that.equals(input.key);
      query.should.have.property('provider').that.equals('all');
      query.should.have.property('start').that.is.undefined;
      query.should.have.property('end').that.is.undefined;
      query.should.have.property('updatedAfter').that.is.undefined;
      query.should.have.property('firstNObs').that.is.undefined;
      query.should.have.property('lastNObs').that.is.undefined;
      query.should.have.property('obsDimension').that.is.undefined;
      query.should.have.property('detail').that.equals('full');
      query.should.have.property('history').that.is.false;
    });

    it('fails if the input is not of the expected type', () => {
      let test = () => sdmxrest.getDataQuery(undefined as any);
      should.Throw(test, Error, 'Not a valid data query');

      test = () => sdmxrest.getDataQuery({ test: 'TEST' } as any);
      should.Throw(test, Error, 'Not a valid data query');
    });
  });

  describe('when using getDataQuery2()', () => {

    it('offers to create a data query from properties', () => {
      const input = {
        context: 'dataflow=ECB:EXR(*)',
        key: 'A..EUR.SP00.A',
      };
      const query = sdmxrest.getDataQuery2(input);
      query.should.be.an('object');
      query.should.have.property('context').that.equals(input.context);
      query.should.have.property('key').that.equals(input.key);
      query.should.have.property('updatedAfter').that.is.undefined;
      query.should.have.property('firstNObs').that.is.undefined;
      query.should.have.property('lastNObs').that.is.undefined;
      query.should.have.property('obsDimension').that.is.undefined;
      query.should.have.property('history').that.is.false;
      query.should.have.property('attributes').that.equals('dsd');
      query.should.have.property('measures').that.equals('all');
      query.should.have.property('filters').that.is.instanceOf(Array);
      query.should.have.property('filters').that.has.lengthOf(0);
    });

    it('fails if the input is not of the expected type', () => {
      const t: { [key: string]: string } = {};
      t['test'] = 'test2';
      const test = () => sdmxrest.getDataQuery2(t as any);
      should.Throw(test, Error, 'Not a valid data query');
    });
  });

  describe('when using getMetadataQuery()', () => {

    it('offers to create a metadata query from properties', () => {
      const input = {
        resource: 'codelist',
        id: 'CL_FREQ',
      };
      const query = sdmxrest.getMetadataQuery(input);
      query.should.be.an('object');
      query.should.have.property('resource').that.equals(input.resource);
      query.should.have.property('id').that.equals(input.id);
      query.should.have.property('agency').that.equals('all');
      query.should.have.property('version').that.equals('latest');
      query.should.have.property('item').that.equals('all');
      query.should.have.property('detail').that.equals('full');
      query.should.have.property('references').that.equals('none');
    });

    it('fails if the input is not of the expected type', () => {
      let test = () => sdmxrest.getMetadataQuery(undefined as any);
      should.Throw(test, Error, 'Not a valid metadata query');

      test = () => sdmxrest.getMetadataQuery({ test: 'TEST' } as any);
      should.Throw(test, Error, 'Not a valid metadata query');
    });
  });

  describe('when using getAvailabilityQuery()', () => {

    it('offers to create an availability query from properties', () => {
      const input = {
        flow: 'EXR',
        key: 'A..EUR.SP00.A',
      };
      const query = sdmxrest.getAvailabilityQuery(input);
      query.should.be.an('object');
      query.should.have.property('flow').that.equals(input.flow);
      query.should.have.property('key').that.equals(input.key);
      query.should.have.property('provider').that.equals('all');
      query.should.have.property('component').that.equals('all');
      query.should.have.property('start').that.is.undefined;
      query.should.have.property('end').that.is.undefined;
      query.should.have.property('updatedAfter').that.is.undefined;
      query.should.have.property('mode').that.equals('exact');
      query.should.have.property('references').that.equals('none');
    });

    it('fails if the input is not of the expected type', () => {
      let test = () => sdmxrest.getAvailabilityQuery(undefined as any);
      should.Throw(test, Error, 'Not a valid availability query');

      test = () => sdmxrest.getAvailabilityQuery({ test: 'TEST' } as any);
      should.Throw(test, Error, 'Not a valid availability query');
    });
  });

  describe('when using getAvailabilityQuery2()', () => {

    it('offers to create an availability query from properties', () => {
      const input = {
        context: 'dataflow=ECB:EXR(*)',
        key: 'A..EUR.SP00.A',
      };
      const query = sdmxrest.getAvailabilityQuery2(input);
      query.should.be.an('object');
      query.should.have.property('context').that.equals(input.context);
      query.should.have.property('key').that.equals(input.key);
      query.should.have.property('component').that.equals('*');
      query.should.have.property('updatedAfter').that.is.undefined;
      query.should.have.property('filters').that.is.instanceOf(Array);
      query.should.have.property('filters').that.has.lengthOf(0);
      query.should.have.property('mode').that.equals('exact');
      query.should.have.property('references').that.equals('none');
    });

    it('fails if the input is not of the expected type', () => {
      const test = () => sdmxrest.getAvailabilityQuery2({ test: 'TEST' } as any);
      should.Throw(test, Error, 'Not a valid availability query');
    });
  });

  describe('when using getSchemaQuery()', () => {

    it('offers to create a schema query from properties', () => {
      const input = {
        context: 'datastructure',
        agency: 'BIS',
        id: 'BIS_CBS',
      };
      const query = sdmxrest.getSchemaQuery(input);
      query.should.be.an('object');
      query.should.have.property('context').that.equals(input.context);
      query.should.have.property('id').that.equals(input.id);
      query.should.have.property('agency').that.equals(input.agency);
      query.should.have.property('version').that.equals('latest');
      query.should.have.property('explicit').that.is.false;
      query.should.have.property('obsDimension').that.is.undefined;
    });

    it('fails if the input is not of the expected type', () => {
      let test = () => sdmxrest.getSchemaQuery(undefined as any);
      should.Throw(test, Error, 'Not a valid schema query');

      test = () => sdmxrest.getSchemaQuery({ test: 'TEST' } as any);
      should.Throw(test, Error, 'Not a valid schema query');
    });
  });

  describe('when using getUrl()', () => {

    it('creates a URL from a data query and a service objects', () => {
      const query = sdmxrest.getDataQuery({ flow: 'EXR', key: 'A.CHF.NOK.SP00.A' });
      const service = sdmxrest.getService('ECB');
      const url = sdmxrest.getUrl(query, service);
      url.should.be.a('string');
      url.should.contain(service.url);
      url.should.contain(query.flow);
      url.should.contain(query.key);
    });

    it('creates a URL from a metadata query and a service objects', () => {
      const url = sdmxrest.getUrl({ resource: 'codelist', id: 'CL_FREQ' }, 'ECB');
      url.should.be.a('string');
      url.should.contain('sdw-wsrest.ecb.europa.eu');
      url.should.contain('codelist');
      url.should.contain('CL_FREQ');
    });

    it('creates a URL from a schema query and a service objects', () => {
      const q = { context: 'dataflow', agency: 'BIS', id: 'CBS' };
      const url = sdmxrest.getUrl(q, 'ECB');
      url.should.be.a('string');
      url.should.contain('sdw-wsrest.ecb.europa.eu');
      url.should.contain('schema');
      url.should.contain('dataflow/BIS/CBS');
    });

    it('creates a URL from an availability query and a service objects', () => {
      const input = {
        flow: 'EXR',
        key: 'A..EUR.SP00.A',
      };
      const q = sdmxrest.getAvailabilityQuery(input);
      const s = sdmxrest.getService({ url: 'http://ws-entry-point' });
      const url = sdmxrest.getUrl(q, s);
      url.should.be.a('string');
      url.should.contain('http://ws-entry-point');
      url.should.contain('availability');
      url.should.contain('EXR');
      url.should.contain('A..EUR.SP00.A');
    });

    it('creates a URL from an availability and service objects (mode)', () => {
      const q = {
        flow: 'EXR',
        key: 'A..EUR.SP00.A',
        mode: 'exact',
      };
      const s = sdmxrest.getService({ url: 'http://ws-entry-point' });
      const url = sdmxrest.getUrl(q, s);
      url.should.be.a('string');
      url.should.contain('http://ws-entry-point');
      url.should.contain('availability');
      url.should.contain('EXR');
      url.should.contain('A..EUR.SP00.A');
      url.should.contain('mode=exact');
    });

    it('creates a URL from an availability and a service objects (component)', () => {
      const q = {
        flow: 'EXR',
        key: 'A..EUR.SP00.A',
        component: 'FREQ',
      };
      const s = sdmxrest.getService({ url: 'http://ws-entry-point' });
      const url = sdmxrest.getUrl(q, s);
      url.should.be.a('string');
      url.should.contain('http://ws-entry-point');
      url.should.contain('availability');
      url.should.contain('EXR');
      url.should.contain('A..EUR.SP00.A');
      url.should.contain('FREQ');
    });

    it('creates a URL from an availability and a service objects (references)', () => {
      const q = {
        flow: 'EXR',
        key: 'A..EUR.SP00.A',
        references: 'all',
      };
      const s = sdmxrest.getService({ url: 'http://ws-entry-point' });
      const url = sdmxrest.getUrl(q, s);
      url.should.be.a('string');
      url.should.contain('http://ws-entry-point');
      url.should.contain('availability');
      url.should.contain('EXR');
      url.should.contain('A..EUR.SP00.A');
      url.should.contain('references=all');
    });

    it('creates a URL from an availability2 and service objects (mode)', () => {
      const q = { mode: 'exact' };
      const s = sdmxrest.getService({ url: 'http://ws-entry-point' });
      const url = sdmxrest.getUrl(q, s);
      url.should.be.a('string');
      url.should.contain('http://ws-entry-point');
      url.should.contain('availability/');
      url.should.contain('mode=exact');
    });

    it('creates a URL from an availability2 and a service objects (component)', () => {
      const q = { component: 'FREQ' };
      const s = sdmxrest.getService({ url: 'http://ws-entry-point' });
      const url = sdmxrest.getUrl(q, s);
      url.should.be.a('string');
      url.should.contain('http://ws-entry-point');
      url.should.contain('availability/');
      url.should.contain('FREQ');
    });

    it('creates a URL from an availability2 and a service objects (references)', () => {
      const q = { references: 'all' };
      const s = sdmxrest.getService({ url: 'http://ws-entry-point' });
      const url = sdmxrest.getUrl(q, s);
      url.should.be.a('string');
      url.should.contain('http://ws-entry-point');
      url.should.contain('availability/');
      url.should.contain('references=all');
    });

    it('creates a URL from a data2 query and a service objects (context)', () => {
      const q = { context: 'dataflow=BIS:CBS(1.0)' };
      const s = sdmxrest.getService({ url: 'http://ws-entry-point' });
      const url = sdmxrest.getUrl(q, s);
      url.should.be.a('string');
      url.should.contain('http://ws-entry-point');
      url.should.contain('data/dataflow/BIS/CBS/1.0');
    });

    it('creates a URL from a data2 query and a service objects (key)', () => {
      const q = { key: 'A.CHF.EUR' };
      const s = sdmxrest.getService({ url: 'http://ws-entry-point' });
      const url = sdmxrest.getUrl(q, s);
      url.should.be.a('string');
      url.should.contain('http://ws-entry-point');
      url.should.contain('data/*/*/*/*/A.CHF.EUR');
    });

    it('creates a URL from a data2 query and a service objects (filters)', () => {
      const q = { filters: 'REF_AREA=CH' };
      const s = sdmxrest.getService({ url: 'http://ws-entry-point' });
      const url = sdmxrest.getUrl(q, s);
      url.should.be.a('string');
      url.should.contain('http://ws-entry-point');
      url.should.contain('data/*/*/*/*');
      url.should.contain('c[REF_AREA]=CH');
    });

    it('creates a URL from a data2 query and a service objects (firstNObs)', () => {
      const q = { firstNObs: 1 };
      const s = sdmxrest.getService({ url: 'http://ws-entry-point' });
      const url = sdmxrest.getUrl(q, s);
      url.should.be.a('string');
      url.should.contain('http://ws-entry-point');
      url.should.contain('data/*/*/*/*');
      url.should.contain('firstNObservations=1');
    });

    it('creates a URL from a data2 query and a service objects (lastnObs)', () => {
      const q = { lastNObs: 1 };
      const s = sdmxrest.getService({ url: 'http://ws-entry-point' });
      const url = sdmxrest.getUrl(q, s);
      url.should.be.a('string');
      url.should.contain('http://ws-entry-point');
      url.should.contain('data/*/*/*/*');
      url.should.contain('lastNObservations=1');
    });

    it('creates a URL from a data2 query and a service objects (obsDimension)', () => {
      const q = { obsDimension: 'CUR' };
      const s = sdmxrest.getService({ url: 'http://ws-entry-point' });
      const url = sdmxrest.getUrl(q, s);
      url.should.be.a('string');
      url.should.contain('http://ws-entry-point');
      url.should.contain('data/*/*/*/*');
      url.should.contain('dimensionAtObservation=CUR');
    });

    it('creates a URL from a data2 query and a service objects (history)', () => {
      const q = { history: true };
      const s = sdmxrest.getService({ url: 'http://ws-entry-point' });
      const url = sdmxrest.getUrl(q, s);
      url.should.be.a('string');
      url.should.contain('http://ws-entry-point');
      url.should.contain('data/*/*/*/*');
      url.should.contain('includeHistory=true');
    });

    it('creates a URL from a data2 query and a service objects (attributes)', () => {
      const q = { attributes: 'msd' };
      const s = sdmxrest.getService({ url: 'http://ws-entry-point' });
      const url = sdmxrest.getUrl(q, s);
      url.should.be.a('string');
      url.should.contain('http://ws-entry-point');
      url.should.contain('data/*/*/*/*');
      url.should.contain('attributes=msd');
    });

    it('creates a URL from a data2 query and a service objects (measures)', () => {
      const q = { measures: 'none' };
      const s = sdmxrest.getService({ url: 'http://ws-entry-point' });
      const url = sdmxrest.getUrl(q, s);
      url.should.be.a('string');
      url.should.contain('http://ws-entry-point');
      url.should.contain('data/*/*/*/*');
      url.should.contain('measures=none');
    });

    it('creates a URL from a data2 query and a service objects (updatedAfter)', () => {
      const q = { updatedAfter: '2016-03-04T09:57:00Z' };
      const s = sdmxrest.getService({ url: 'http://ws-entry-point' });
      const url = sdmxrest.getUrl(q, s);
      url.should.be.a('string');
      url.should.contain('http://ws-entry-point');
      url.should.contain('data/*/*/*/*');
      url.should.contain('updatedAfter=2016-03-04T09:57:00Z');
    });

    it('fails if the input is not of the expected type', () => {
      let test = () => sdmxrest.getUrl(undefined, sdmxrest.getService('ECB'));
      should.Throw(test, Error, 'Not a valid query');

      test = () => sdmxrest.getUrl({}, sdmxrest.getService('ECB'));
      should.Throw(test, Error, 'Not a valid query');

      const query = sdmxrest.getDataQuery({ flow: 'EXR', key: 'A.CHF.NOK.SP00.A' });
      test = () => sdmxrest.getUrl(query, sdmxrest.getService('TEST'));
      should.Throw(test, Error, 'not in the list of predefined services');

      test = () => (sdmxrest.getUrl as any)(query);
      should.Throw(test, Error, 'Not a valid service');
    });
  });

  describe('when using request()', () => {

    it('offers to execute a request from a query and service objects', () => {
      nock('http://sdw-wsrest.ecb.europa.eu')
        .get((uri: string) => uri.indexOf('EXR') > -1)
        .reply(200, 'OK');
      const response =
        sdmxrest.request({ flow: 'EXR', key: 'A.CHF.NOK.SP00.A' }, 'ECB');
      return response.should.eventually.equal('OK');
    });

    it('offers to execute a request from an SDMX RESTful query string (known service)', () => {
      nock('http://sdw-wsrest.ecb.europa.eu')
        .get((uri: string) => uri.indexOf('EXR') > -1)
        .reply(200, 'OK');
      const response = sdmxrest.request('http://sdw-wsrest.ecb.europa.eu/service/data/EXR');
      return response.should.eventually.equal('OK');
    });

    it('offers to execute a request from an SDMX RESTful query string (unknown service)', () => {
      nock('http://test.org')
        .get((uri: string) => uri.indexOf('EXR') > -1)
        .reply(200, 'OK');
      const response = sdmxrest.request('http://test.org/data/EXR');
      return response.should.eventually.equal('OK');
    });

    it('throws an exception in case of issues with a request', () => {
      nock('http://sdw-wsrest.ecb.europa.eu')
        .get((uri: string) => uri.indexOf('TEST') > -1)
        .reply(404);
      const response = sdmxrest.request({ flow: 'TEST' }, 'ECB');
      return response.should.be.rejectedWith(RangeError);
    });

    it('does not throw an exception for a 404 with updatedAfter', () => {
      nock('http://sdw-wsrest.ecb.europa.eu')
        .get((uri: string) => uri.indexOf('ICP') > -1)
        .reply(404);
      const response = sdmxrest.request(
        { flow: 'ICP', updatedAfter: '2016-01-01T14:54:27Z' }, 'ECB');
      response.should.be.fulfilled;
      return response.should.not.be.rejected;
    });

    it('throws an exception when the Service URL is invalid', () => {
      const response = sdmxrest.request({ flow: 'ICP' }, { url: 'ws.test' });
      response.should.not.be.fulfilled;
      return response.should.be.rejected;
    });

    it('adds an accept header to data queries if the service has a default format', () => {
      nock('http://sdw-wsrest.ecb.europa.eu')
        .matchHeader('accept', (h: any) =>
          h[0].indexOf('application/vnd.sdmx.data+json') > -1)
        .get((uri: string) => uri.indexOf('EXR') > -1)
        .reply(200, 'OK');
      const response =
        sdmxrest.request({ flow: 'EXR', key: 'A.CHF.NOK.SP00.A' }, 'ECB');
      return response.should.eventually.equal('OK');
    });

    it('adds an accept header to structure queries if the service has a default format', () => {
      nock('http://sdw-wsrest.ecb.europa.eu')
        .matchHeader('accept', (h: any) =>
          h[0].indexOf('application/vnd.sdmx.structure+xml') > -1)
        .get((uri: string) => uri.indexOf('codelist') > -1)
        .reply(200, 'OK');
      const response =
        sdmxrest.request({ resource: 'codelist', id: 'CL_FREQ' }, 'ECB');
      return response.should.eventually.equal('OK');
    });

    it('adds an accept header to schema queries if the service has a default format', () => {
      nock('http://sdw-wsrest.ecb.europa.eu')
        .matchHeader('accept', (h: any) =>
          h[0].indexOf('application/xml') > -1)
        .get((uri: string) => uri.indexOf('schema') > -1)
        .reply(200, 'OK');
      const response =
        sdmxrest.request({ context: 'dataflow', agency: 'ECB', id: 'EXR' }, 'ECB');
      return response.should.eventually.equal('OK');
    });

    it('adds an accept header to data URLs if the service has a default format', () => {
      nock('http://sdw-wsrest.ecb.europa.eu')
        .matchHeader('accept', (h: any) =>
          h[0].indexOf('application/vnd.sdmx.data+json') > -1)
        .get((uri: string) => uri.indexOf('EXR') > -1)
        .reply(200, 'OK');
      const url = 'http://sdw-wsrest.ecb.europa.eu/service/data/EXR/A..EUR.SP00.A';
      const response = sdmxrest.request(url);
      return response.should.eventually.equal('OK');
    });

    it('does not overwrite the accept header passed by the client (data)', () => {
      nock('http://sdw-wsrest.ecb.europa.eu')
        .matchHeader('accept', (h: any) =>
          h[0].indexOf('application/xml') > -1)
        .get((uri: string) => uri.indexOf('EXR') > -1)
        .reply(200, 'OK');
      const opts = {
        headers: {
          accept: 'application/xml',
        },
      };
      const response =
        sdmxrest.request({ flow: 'EXR', key: 'A.CHF.NOK.SP00.A' }, 'ECB', opts);
      return response.should.eventually.equal('OK');
    });

    it('does not overwrite the accept header passed by the client (structure)', () => {
      nock('http://sdw-wsrest.ecb.europa.eu')
        .matchHeader('accept', (h: any) =>
          h[0].indexOf('application/vnd.sdmx.structure+json;version=1.0.0') > -1)
        .get((uri: string) => uri.indexOf('codelist') > -1)
        .reply(200, 'OK');
      const opts = {
        headers: {
          accept: 'application/vnd.sdmx.structure+json;version=1.0.0',
        },
      };
      const response =
        sdmxrest.request({ resource: 'codelist', id: 'CL_FREQ' }, 'ECB', opts);
      return response.should.eventually.equal('OK');
    });

    it('does not overwrite the accept header passed by the client (schema)', () => {
      nock('http://sdw-wsrest.ecb.europa.eu')
        .matchHeader('accept', (h: any) =>
          h[0].indexOf('application/vnd.sdmx.structure+xml;version=2.1') > -1)
        .get((uri: string) => uri.indexOf('schema') > -1)
        .reply(200, 'OK');
      const opts = {
        headers: {
          accept: 'application/vnd.sdmx.structure+xml;version=2.1',
        },
      };
      const response =
        sdmxrest.request({ context: 'dataflow', agency: 'ECB', id: 'EXR' }, 'ECB', opts);
      return response.should.eventually.equal('OK');
    });

    it('does not add an accept header to data queries if the service does not have a default format', () => {
      nock('http://stats.oecd.org')
        .matchHeader('accept', (h: any) => h[0] === '*/*')
        .get((uri: string) => uri.indexOf('EO') > -1)
        .reply(200, 'OK');
      const response =
        sdmxrest.request({ flow: 'EO' }, 'OECD');
      return response.should.eventually.equal('OK');
    });

    it('does not add an accept header to structure queries if the service does not have a default format', () => {
      nock('http://stats.oecd.org')
        .matchHeader('accept', (h: any) => h[0] === '*/*')
        .get((uri: string) => uri.indexOf('codelist') > -1)
        .reply(200, 'OK');
      const response =
        sdmxrest.request({ resource: 'codelist', id: 'CL_FREQ' }, 'OECD');
      return response.should.eventually.equal('OK');
    });

    it('does not add an accept header to schema queries if the service does not have a default format', () => {
      nock('http://stats.oecd.org')
        .matchHeader('accept', (h: any) => h[0] === '*/*')
        .get((uri: string) => uri.indexOf('schema') > -1)
        .reply(200, 'OK');
      const response =
        sdmxrest.request({ context: 'dataflow', agency: 'ECB', id: 'EXR' }, 'OECD');
      return response.should.eventually.equal('OK');
    });

    it('adds a default user agent to queries', () => {
      nock('http://sdw-wsrest.ecb.europa.eu')
        .matchHeader('user-agent', (h: any) =>
          h[0] === 'sdmx-rest4js (https://github.com/sosna/sdmx-rest4js)')
        .get((uri: string) => uri.indexOf('EXR') > -1)
        .reply(200, 'OK');
      const response =
        sdmxrest.request({ flow: 'EXR', key: 'A.CHF.NOK.SP00.A' }, 'ECB');
      return response.should.eventually.equal('OK');
    });

    it('does not overwrite the user agent passed by the client', () => {
      nock('http://sdw-wsrest.ecb.europa.eu')
        .matchHeader('user-agent', (h: any) => h[0] === 'test')
        .get((uri: string) => uri.indexOf('EXR') > -1)
        .reply(200, 'OK');
      const opts = {
        headers: {
          'user-agent': 'test',
        },
      };
      const response =
        sdmxrest.request({ flow: 'EXR', key: 'A.CHF.NOK.SP00.A' }, 'ECB', opts);
      return response.should.eventually.equal('OK');
    });

    it('adds a default accept-encoding header to queries', () => {
      nock('http://sdw-wsrest.ecb.europa.eu')
        .matchHeader('accept-encoding', (h: any) => h[0] === 'gzip,deflate')
        .get((uri: string) => uri.indexOf('EXR') > -1)
        .reply(200, 'OK');
      const response =
        sdmxrest.request({ flow: 'EXR', key: 'A.CHF.NOK.SP00.A' }, 'ECB');
      return response.should.eventually.equal('OK');
    });

    it('allows disabling content compression', () => {
      nock('http://sdw-wsrest.ecb.europa.eu')
        .matchHeader('accept-encoding', (h: any) => h === undefined)
        .get((uri: string) => uri.indexOf('EXR') > -1)
        .reply(200, 'OK');
      const opts = {
        compress: false,
      };
      const response =
        sdmxrest.request({ flow: 'EXR', key: 'A.CHF.NOK.SP00.A' }, 'ECB', opts);
      return response.should.eventually.equal('OK');
    });
  });

  describe('when using request2()', () => {
    it('offers a way to retrieve response headers', () => {
      nock('http://sdw-wsrest.ecb.europa.eu')
        .get((uri: string) => uri.indexOf('EXR') > -1)
        .reply(200, 'OK', { 'X-My-Headers': 'My Header value' });

      const request = sdmxrest.getDataQuery({ flow: 'EXR', key: 'A.CHF.EUR.SP00.A' });
      return sdmxrest.request2(request, 'ECB').then((response: any) => {
        response.should.have.property('status').that.equals(200);
        response.should.have.property('headers');
        return response.should.respondTo('text');
      });
    });
  });

  describe('when using checkStatus()', () => {
    it('throws an errir in case there is no response', () => {
    });

    it('throws an error in case there is an issue with the response', () => {
      const request = sdmxrest.getDataQuery({ flow: 'TEST' });
      const test = () => sdmxrest.checkStatus(request, undefined);
      should.Throw(test, ReferenceError, 'Not a valid response');
    });

    it('accept codes in the 300 range', () => {
      nock('http://sdw-wsrest.ecb.europa.eu')
        .get((uri: string) => uri.indexOf('TEST') > -1)
        .reply(306, 'Redirected');
      const request = sdmxrest.getDataQuery({ flow: 'TEST' });
      return sdmxrest.request2(request, 'ECB').then((response: any) => {
        const test = () => sdmxrest.checkStatus(request, response);
        return should.not.throw(test, RangeError, 'Request failed with error code 306');
      });
    });

    it('accept code 100', () => {
      nock('http://sdw-wsrest.ecb.europa.eu')
        .get((uri: string) => uri.indexOf('TEST') > -1)
        .reply(100, 'Continue');
      const request = sdmxrest.getDataQuery({ flow: 'TEST' });
      return sdmxrest.request2(request, 'ECB').then((response: any) => {
        const test = () => sdmxrest.checkStatus(request, response);
        return should.not.throw(test, RangeError, 'Request failed with error code 100');
      });
    });
  });

  describe('when using checkMediaType()', () => {
    it('accepts SDMX data formats', () => {
      const fmt = 'application/vnd.sdmx.data+json;version=1.0.0';
      nock('http://sdw-wsrest.ecb.europa.eu')
        .get((uri: string) => uri.indexOf('EXR') > -1)
        .reply(200, 'OK', { 'Content-Type': fmt });
      return sdmxrest.request2({ flow: 'EXR', key: 'A.CHF.EUR.SP00.A' }, 'ECB').then((response: any) => {
        const test = () => sdmxrest.checkMediaType(fmt, response);
        return should.not.throw(test, RangeError, 'Not an SDMX format');
      });
    });

    it('accepts SDMX metadata formats', () => {
      const fmt = 'application/vnd.sdmx.structure+xml;version=2.1';
      nock('http://sdw-wsrest.ecb.europa.eu')
        .get((uri: string) => uri.indexOf('codelist') > -1)
        .reply(200, 'OK', { 'Content-Type': fmt });
      return sdmxrest.request2({ resource: 'codelist' }, 'ECB').then((response: any) => {
        const test = () => sdmxrest.checkMediaType(fmt, response);
        return should.not.throw(test, RangeError, 'Not an SDMX format');
      });
    });

    it('accepts generic formats', () => {
      const fmt = 'application/xml';
      nock('http://sdw-wsrest.ecb.europa.eu')
        .get((uri: string) => uri.indexOf('codelist') > -1)
        .reply(200, 'OK', { 'Content-Type': fmt });
      return sdmxrest.request2({ resource: 'codelist' }, 'ECB').then((response: any) => {
        const test = () => sdmxrest.checkMediaType(fmt, response);
        return should.not.throw(test, RangeError, 'Not an SDMX format');
      });
    });

    it('throws an error in case the format is not an SDMX one', () => {
      const fmt = 'application/vnd.test.data+json';
      nock('http://sdw-wsrest.ecb.europa.eu')
        .get((uri: string) => uri.indexOf('EXR') > -1)
        .reply(200, 'OK', { 'Content-Type': fmt });
      return sdmxrest.request2({ flow: 'EXR' }, 'ECB').then((response: any) => {
        const test = () => sdmxrest.checkMediaType(fmt, response);
        return should.Throw(test, RangeError, 'Not an SDMX format: ' + fmt);
      });
    });

    it('throws an error in case no format is specified', () => {
      const fmt = 'application/xml';
      nock('http://sdw-wsrest.ecb.europa.eu')
        .get((uri: string) => uri.indexOf('EXR') > -1)
        .reply(200, 'OK');
      return sdmxrest.request2({ flow: 'EXR' }, 'ECB').then((response: any) => {
        const test = () => sdmxrest.checkMediaType(fmt, response);
        return should.Throw(test, RangeError, 'Not an SDMX format: null');
      });
    });

    it('throws an error in case the format is not the requested one', () => {
      const fmt = 'application/vnd.sdmx.data+json;version=1.0.0';
      nock('http://sdw-wsrest.ecb.europa.eu')
        .get((uri: string) => uri.indexOf('EXR') > -1)
        .reply(200, 'OK', { 'Content-Type': 'application/xml' });
      const opts = {
        headers: {
          accept: fmt,
        },
      };
      return sdmxrest.request2({ flow: 'EXR' }, 'ECB', opts).then((response: any) => {
        const test = () => sdmxrest.checkMediaType(fmt, response);
        return should.Throw(test, RangeError, 'Wrong format: requested ' + fmt + ' but got application/xml');
      });
    });

    it('Does not throw an error in case the received format is the requested one', () => {
      const fmt = 'application/vnd.sdmx.data+json;version=1.0.0';
      nock('http://sdw-wsrest.ecb.europa.eu')
        .get((uri: string) => uri.indexOf('EXR') > -1)
        .reply(200, 'OK', { 'Content-Type': fmt });
      const opts = {
        headers: {
          accept: fmt,
        },
      };
      return sdmxrest.request2({ flow: 'EXR' }, 'ECB', opts).then((response: any) => {
        const test = () => sdmxrest.checkMediaType(fmt, response);
        return should.not.Throw(test);
      });
    });

    it('Does not throw an error in case the only difference is the space character', () => {
      const fmt1 = 'application/vnd.sdmx.genericdata+xml;version=2.1';
      const fmt2 = 'application/vnd.sdmx.genericdata+xml; version=2.1';
      nock('http://sdw-wsrest.ecb.europa.eu')
        .get((uri: string) => uri.indexOf('EXR') > -1)
        .reply(200, 'OK', { 'Content-Type': fmt2 });
      const opts = {
        headers: {
          accept: fmt1,
        },
      };
      return sdmxrest.request2({ flow: 'EXR' }, 'ECB', opts).then((response: any) => {
        const test = () => sdmxrest.checkMediaType(fmt1, response);
        return should.not.Throw(test);
      });
    });

    it('Does not throw an error in case the received format is one of the requested ones', () => {
      const fmt = 'application/vnd.sdmx.data+json;version=1.0.0, application/json;q=0.9, text/csv;q=0.5, */*;q=0.4';
      nock('http://sdw-wsrest.ecb.europa.eu')
        .get((uri: string) => uri.indexOf('EXR') > -1)
        .reply(200, 'OK', { 'Content-Type': 'text/csv' });
      const opts = {
        headers: {
          accept: fmt,
        },
      };
      return sdmxrest.request2({ flow: 'EXR' }, 'ECB', opts).then((response: any) => {
        const test = () => sdmxrest.checkMediaType(fmt, response);
        return should.not.Throw(test);
      });
    });

    it('Throws an error in case the received format is not one of the requested ones', () => {
      const fmt = 'application/vnd.sdmx.data+json;version=1.0.0, application/json;q=0.9, text/csv;q=0.5, */*;q=0.4';
      nock('http://sdw-wsrest.ecb.europa.eu')
        .get((uri: string) => uri.indexOf('EXR') > -1)
        .reply(200, 'OK', { 'Content-Type': 'application/xml' });
      const opts = {
        headers: {
          accept: fmt,
        },
      };
      return sdmxrest.request2({ flow: 'EXR' }, 'ECB', opts).then((response: any) => {
        const test = () => sdmxrest.checkMediaType(fmt, response);
        return should.Throw(test, RangeError);
      });
    });
  });
});
