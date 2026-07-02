import chai from 'chai';

import { Service } from '../../src/service/service';
import { ApiVersion } from '../../src/utils/api-version';
import { MetadataQuery } from '../../src/metadata/metadata-query';
import { UrlGenerator } from '../../src/utils/url-generator';

const should = chai.should();

describe('URL Generator for metadata queries', () => {

  it('generates a URL for a metadata query', () => {
    const expected = 'http://sdw-wsrest.ecb.europa.eu/service/codelist/ECB/CL_FREQ/' +
      'latest?detail=full&references=none';
    const query =
      MetadataQuery.from({ resource: 'codelist', id: 'CL_FREQ', agency: 'ECB' });
    const service = Service.ECB;
    const url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });

  it('generates a URL for a metadata ItemScheme query', () => {
    const expected = 'http://test.com/service/codelist/all/all/' +
      'latest/all?detail=full&references=none';
    const query = MetadataQuery.from({ resource: 'codelist' });
    const service = Service.from(
      { url: 'http://test.com/service/', api: ApiVersion.v1_5_0 });
    const url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });

  it('generates a URL for a metadata non-ItemScheme query', () => {
    const expected = 'http://test.com/service/dataflow/all/all/' +
      'latest?detail=full&references=none';
    const query = MetadataQuery.from({ resource: 'dataflow' });
    const service = Service.from(
      { url: 'http://test.com/service/', api: ApiVersion.v1_5_0 });
    const url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });

  it('supports item queries for API version 1.1.0 and above', () => {
    const expected = 'http://test.com/codelist/ECB/CL_FREQ/latest/A' +
      '?detail=full&references=none';
    const query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ',
      agency: 'ECB',
      item: 'A',
    });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_5_0 });
    const url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });

  it('does not support item queries before API version 1.1.0', () => {
    const expected = 'http://test.com/codelist/ECB/CL_FREQ/latest' +
      '?detail=full&references=none';
    const query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ',
      agency: 'ECB',
      item: 'A',
    });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_0_2 });
    const url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });

  it('treats hierarchical codelists as item schemes for API version 1.2.0', () => {
    const expected = 'http://test.com/hierarchicalcodelist/BIS/HCL/latest/HIERARCHY' +
      '?detail=full&references=none';
    const query = MetadataQuery.from({
      resource: 'hierarchicalcodelist',
      id: 'HCL',
      agency: 'BIS',
      item: 'HIERARCHY',
    });
    let service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_2_0 });
    let url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_3_0 });
    url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_4_0 });
    url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_5_0 });
    url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    const test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'hierarchicalcodelist not allowed in v2.0.0');
  });

  it('does not support hiearchy queries before API version 1.2.0', () => {
    const expected = 'http://test.com/hierarchicalcodelist/BIS/HCL/latest' +
      '?detail=full&references=none';
    const query = MetadataQuery.from({
      resource: 'hierarchicalcodelist',
      id: 'HCL',
      agency: 'BIS',
      item: 'HIERARCHY',
    });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_1_0 });
    const url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });

  it('Does not support multiple artefact types before API version 2.0.0', () => {
    const query = MetadataQuery.from({ resource: 'codelist+dataflow' });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_5_0 });
    const test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'codelist+dataflow not allowed in v1.5.0');
  });

  it('Supports multiple artefact types since API 2.0.0', () => {
    let expected = 'http://test.com/structure/codelist,dataflow/*/*/~' +
      '?detail=full&references=none';
    let query = MetadataQuery.from({ resource: 'codelist,dataflow' });
    let service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    let url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    expected = 'http://test.com/structure/codelist,dataflow';
    query = MetadataQuery.from({ resource: 'codelist,dataflow' });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('Rewrites + for multiple artefact types in API 2.0.0', () => {
    let expected = 'http://test.com/structure/codelist,dataflow/*/*/~' +
      '?detail=full&references=none';
    let query = MetadataQuery.from({ resource: 'codelist+dataflow' });
    let service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    let url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    expected = 'http://test.com/structure/codelist,dataflow';
    query = MetadataQuery.from({ resource: 'codelist+dataflow' });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('Supports all for artefact types via * since API 2.0.0', () => {
    let expected = 'http://test.com/structure/*/*/*/~' +
      '?detail=full&references=none';
    let query = MetadataQuery.from({ resource: '*' });
    let service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    let url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    expected = 'http://test.com/structure/*';
    query = MetadataQuery.from({ resource: '*' });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('supports multiple agencies for API version 1.3.0 and above', () => {
    let expected = 'http://test.com/codelist/ECB+BIS/CL_FREQ/latest/all' +
      '?detail=full&references=none';
    let query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ',
      agency: 'ECB+BIS',
    });
    let service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_5_0 });
    let url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    expected = 'http://test.com/structure/codelist/ECB,BIS/CL_FREQ/~/*' +
      '?detail=full&references=none';
    query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ',
      agency: 'ECB,BIS',
    });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });


  it('does not support multiple agencies before API version 1.3.0', () => {
    const query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ',
      agency: 'ECB+BIS',
    });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_2_0 });
    const test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'Multiple agencies not allowed in v1.2.0');
  });

  it('Rewrites , for multiple agencies before API version 2.0.0', () => {
    const expected = 'http://test.com/codelist/ECB+BIS/CL_FREQ/latest/all' +
      '?detail=full&references=none';
    const query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ',
      agency: 'ECB,BIS',
    });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_5_0 });
    const url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });

  it('Rewrites + for multiple agencies since API 2.0.0', () => {
    let expected = 'http://test.com/structure/codelist/ECB,BIS/CL_FREQ/~/*' +
      '?detail=full&references=none';
    let query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ',
      agency: 'ECB+BIS',
    });
    let service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    let url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    expected = 'http://test.com/structure/codelist/ECB,BIS/CL_FREQ';
    query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ',
      agency: 'ECB+BIS',
    });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('Rewrites * for agencies before API version 2.0.0', () => {
    let expected = 'http://test.com/codelist/all/CL_FREQ/latest/all' +
      '?detail=full&references=none';
    let query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ',
      agency: '*',
    });
    let service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_5_0 });
    let url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    expected = 'http://test.com/codelist/all/CL_FREQ';
    query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ',
      agency: '*',
    });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_5_0 });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('Rewrites all for agencies since API 2.0.0', () => {
    let expected = 'http://test.com/structure/codelist/*/CL_FREQ/~/*' +
      '?detail=full&references=none';
    let query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ',
      agency: 'all',
    });
    let service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    let url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    expected = 'http://test.com/structure/codelist/*/CL_FREQ';
    query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ',
      agency: 'all',
    });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('supports multiple IDs for API version 1.3.0 and above', () => {
    const expected = 'http://test.com/codelist/ECB/CL_FREQ+CL_DECIMALS/latest/all' +
      '?detail=full&references=none';
    const query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ+CL_DECIMALS',
      agency: 'ECB',
    });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_3_0 });
    const url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });

  it('does not support multiple IDs before API version 1.3.0', () => {
    const query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ+CL_DECIMALS',
      agency: 'ECB',
    });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_2_0 });
    const test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'Multiple IDs not allowed in v1.2.0');
  });

  it('Rewrites , for multiple resource IDs before API version 2.0.0', () => {
    let expected = 'http://test.com/codelist/BIS/CL_FREQ+CL_DECIMALS/latest/all' +
      '?detail=full&references=none';
    let query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ,CL_DECIMALS',
      agency: 'BIS',
    });
    let service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_5_0 });
    let url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    expected = 'http://test.com/codelist/BIS/CL_FREQ+CL_DECIMALS';
    query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ,CL_DECIMALS',
      agency: 'BIS',
    });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_5_0 });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('Rewrites + for multiple resource IDs since API 2.0.0', () => {
    let expected = 'http://test.com/structure/codelist/BIS/CL_FREQ,CL_UNIT/~/*' +
      '?detail=full&references=none';
    let query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ+CL_UNIT',
      agency: 'BIS',
    });
    let service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    let url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    expected = 'http://test.com/structure/codelist/BIS/CL_FREQ,CL_UNIT';
    query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ+CL_UNIT',
      agency: 'BIS',
    });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('Rewrites * for resource IDs before API version 2.0.0', () => {
    let expected = 'http://test.com/codelist/BIS/all/latest/all' +
      '?detail=full&references=none';
    let query = MetadataQuery.from({
      resource: 'codelist',
      id: '*',
      agency: 'BIS',
    });
    let service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_5_0 });
    let url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    expected = 'http://test.com/codelist/BIS/all/1.0';
    query = MetadataQuery.from({
      resource: 'codelist',
      id: '*',
      agency: 'BIS',
      version: '1.0',
    });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_5_0 });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('Rewrites all for resources IDs since API 2.0.0', () => {
    let expected = 'http://test.com/structure/codelist/BIS/*/~/*' +
      '?detail=full&references=none';
    let query = MetadataQuery.from({
      resource: 'codelist',
      id: 'all',
      agency: 'BIS',
    });
    let service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    let url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    expected = 'http://test.com/structure/codelist/BIS/*/1.0';
    query = MetadataQuery.from({
      resource: 'codelist',
      id: 'all',
      agency: 'BIS',
      version: '1.0',
    });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('supports multiple versions for API version 1.3.0 and above', () => {
    let expected = 'http://test.com/codelist/ECB/CL_FREQ/1.0+1.1/all' +
      '?detail=full&references=none';
    let query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ',
      agency: 'ECB',
      version: '1.0+1.1',
    });
    let service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_3_0 });
    let url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    expected = 'http://test.com/structure/codelist/ECB/CL_FREQ/1.0.0,1.1.0/*' +
      '?detail=full&references=none';
    query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ',
      agency: 'ECB',
      version: '1.0.0,1.1.0',
    });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });

  it('does not support multiple versions before API version 1.3.0', () => {
    const query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ',
      agency: 'ECB',
      version: '1.0+1.1',
    });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_1_0 });
    const test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'Multiple versions not allowed in v1.1.0');
  });

  it('supports multiple items for API version 1.3.0 and above', () => {
    const expected = 'http://test.com/codelist/ECB/CL_FREQ/1.0/A+M' +
      '?detail=full&references=none';
    const query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ',
      agency: 'ECB',
      version: '1.0',
      item: 'A+M',
    });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_3_0 });
    const url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);
  });

  it('does not support multiple items before API version 1.3.0', () => {
    const query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ',
      agency: 'ECB',
      version: '1.0',
      item: 'A+M',
    });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_2_0 });
    const test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'Multiple items not allowed in v1.2.0');
  });

  it('Rewrites + for multiple items since API 2.0.0', () => {
    let expected = 'http://test.com/structure/codelist/BIS/CL_FREQ/~/A,M' +
      '?detail=full&references=none';
    let query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ',
      agency: 'BIS',
      item: 'A+M',
    });
    let service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    let url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    expected = 'http://test.com/structure/codelist/BIS/CL_FREQ/~/A,M';
    query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ',
      agency: 'BIS',
      item: 'A+M',
    });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('Rewrites * for items before API version 2.0.0', () => {
    let expected = 'http://test.com/codelist/BIS/CL_FREQ/1.0/all' +
      '?detail=full&references=none';
    let query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ',
      agency: 'BIS',
      version: '1.0',
      item: '*',
    });
    let service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_5_0 });
    let url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    expected = 'http://test.com/codelist/BIS/CL_FREQ/1.0';
    query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ',
      agency: 'BIS',
      version: '1.0',
      item: '*',
    });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_5_0 });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('Rewrites all for items since API 2.0.0', () => {
    let expected = 'http://test.com/structure/codelist/BIS/CL_FREQ/1.0/*' +
      '?detail=full&references=none';
    let query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ',
      agency: 'BIS',
      version: '1.0',
      item: 'all',
    });
    let service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    let url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    expected = 'http://test.com/structure/codelist/BIS/CL_FREQ/1.0';
    query = MetadataQuery.from({
      resource: 'codelist',
      id: 'CL_FREQ',
      agency: 'BIS',
      version: '1.0',
      item: 'all',
    });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip default values for metadata', () => {
    const expected = 'http://test.com/codelist';
    const query = MetadataQuery.from({ resource: 'codelist' });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_0_0 });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds them when needed (id)', () => {
    const expected = 'http://test.com/codelist/all/CL_FREQ';
    const query = MetadataQuery.from({ resource: 'codelist', id: 'CL_FREQ' });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_0_0 });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds them when needed (version)', () => {
    const expected = 'http://test.com/codelist/all/all/42';
    const query = MetadataQuery.from({ resource: 'codelist', version: '42' });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_0_0 });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds them when needed (item)', () => {
    const expected = 'http://test.com/codelist/all/all/latest/1';
    const query = MetadataQuery.from({ resource: 'codelist', item: '1' });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_1_0 });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds them when needed (item, old API)', () => {
    const expected = 'http://test.com/codelist';
    const query = MetadataQuery.from({ resource: 'codelist', item: '1' });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_0_2 });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds params when needed (detail)', () => {
    const expected = 'http://test.com/codelist?detail=allstubs';
    const query = MetadataQuery.from({ resource: 'codelist', detail: 'allstubs' });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_0_0 });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds params when needed (references)', () => {
    const expected = 'http://test.com/codelist?references=datastructure';
    const query = MetadataQuery.from({
      resource: 'codelist',
      references: 'datastructure',
    });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_0_0 });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('offers to skip defaults but adds params when needed (detail & refs)', () => {
    const expected = 'http://test.com/codelist?detail=allstubs&references=datastructure';
    const query = MetadataQuery.from({
      resource: 'codelist',
      detail: 'allstubs',
      references: 'datastructure',
    });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_0_0 });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('supports referencepartial since v1.3.0', () => {
    const expected = 'http://test.com/codelist?detail=referencepartial';
    const query = MetadataQuery.from({
      resource: 'codelist',
      detail: 'referencepartial',
    });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_3_0 });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('supports allcompletestubs since v1.3.0', () => {
    const expected = 'http://test.com/codelist?detail=allcompletestubs';
    const query = MetadataQuery.from({
      resource: 'codelist',
      detail: 'allcompletestubs',
    });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_3_0 });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('supports referencecompletestubs since v1.3.0', () => {
    const expected = 'http://test.com/codelist?detail=referencecompletestubs';
    const query = MetadataQuery.from({
      resource: 'codelist',
      detail: 'referencecompletestubs',
    });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_3_0 });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('supports raw since 2.0.0', () => {
    let expected = 'http://test.com/structure/codelist/*/*/~/*?' +
      'detail=raw&references=none';
    let query = MetadataQuery.from({
      resource: 'codelist',
      detail: 'raw',
    });
    let service = Service.from({ url: 'http://test.com' });
    let url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    expected = 'http://test.com/structure/codelist?detail=raw';
    query = MetadataQuery.from({
      resource: 'codelist',
      detail: 'raw',
    });
    service = Service.from({ url: 'http://test.com' });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('does not support referencepartial before v1.3.0', () => {
    const query = MetadataQuery.from({
      resource: 'codelist',
      detail: 'referencepartial',
    });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_1_0 });
    const test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'referencepartial not allowed in v1.1.0');
  });

  it('does not support allcompletestubs before v1.3.0', () => {
    const query = MetadataQuery.from({
      resource: 'codelist',
      detail: 'allcompletestubs',
    });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_2_0 });
    const test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'allcompletestubs not allowed in v1.2.0');
  });

  it('does not support referencecompletestubs before v1.3.0', () => {
    const query = MetadataQuery.from({
      resource: 'codelist',
      detail: 'referencecompletestubs',
    });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_0_2 });
    const test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'referencecompletestubs not allowed in v1.0.2');
  });

  it('does not support raw before v2.0.0', () => {
    const query = MetadataQuery.from({
      resource: 'codelist',
      detail: 'raw',
    });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_5_0 });
    const test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'raw not allowed in v1.5.0');
  });

  it('supports actualconstraint since v1.3.0 and until v2.0.0', () => {
    const expected = 'http://test.com/actualconstraint';
    const query = MetadataQuery.from({ resource: 'actualconstraint' });
    let service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_3_0 });
    let url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);

    service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_4_0 });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);

    service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_5_0 });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('supports allowedconstraint since v1.3.0 and until v2.0.0', () => {
    const expected = 'http://test.com/allowedconstraint';
    const query = MetadataQuery.from({ resource: 'allowedconstraint' });

    let service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_3_0 });
    let url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);

    service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_4_0 });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);

    service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_5_0 });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);

    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    const test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'allowedconstraint not allowed in v2.0.0');
  });

  it('does not support actualconstraint before v1.3.0', () => {
    const query = MetadataQuery.from({ resource: 'actualconstraint' });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_2_0 });
    const test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'actualconstraint not allowed in v1.2.0');
  });

  it('does not support allowedconstraint before v1.3.0', () => {
    const query = MetadataQuery.from({ resource: 'allowedconstraint' });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_0_2 });
    const test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'allowedconstraint not allowed in v1.0.2');
  });

  it('supports actualconstraint since v1.3.0 and until v2.0.0', () => {
    const expected = 'http://test.com/actualconstraint';
    const query = MetadataQuery.from({ resource: 'actualconstraint' });

    let service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_3_0 });
    let url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);

    service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_4_0 });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);

    service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_5_0 });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);

    service = Service.from({ url: 'http://test.com', api: ApiVersion.v2_0_0 });
    const test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'actualconstraint not allowed in v2.0.0');
  });

  it('supports VTL artefacts since v1.5.0 (type)', () => {
    const expected = 'http://test.com/transformationscheme';
    const query = MetadataQuery.from({ resource: 'transformationscheme' });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_5_0 });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('does not support VTL artefacts before v1.5.0 (type)', () => {
    const query = MetadataQuery.from({ resource: 'transformationscheme' });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_2_0 });
    const test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'transformationscheme not allowed in v1.2.0');
  });

  it('supports VTL artefacts since v1.5.0 (references)', () => {
    const expected = 'http://test.com/codelist?references=transformationscheme';
    const query = MetadataQuery.from({ resource: 'codelist', references: 'transformationscheme' });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_5_0 });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('does not support VTL artefacts before v1.5.0 (references)', () => {
    const query = MetadataQuery.from({ resource: 'codelist', references: 'transformationscheme' });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_2_0 });
    const test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'transformationscheme not allowed as reference in v1.2.0');
  });

  it('supports ancestors since v2.0.0 (references)', () => {
    const expected = 'http://test.com/structure/codelist?references=ancestors';
    const query = MetadataQuery.from({ resource: 'codelist', references: 'ancestors' });
    const service = Service.from({ url: 'http://test.com' });
    const url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('does not support ancestors before v2.0.0 (references)', () => {
    const query = MetadataQuery.from({ resource: 'codelist', references: 'ancestors' });
    const service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_5_0 });
    const test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'ancestors not allowed as reference in v1.5.0');
  });

  it('supports semver since v2.0.0 (version)', () => {
    let expected = 'http://test.com/structure/codelist/BIS/CL_FREQ/1.2+.0/*?' +
      'detail=full&references=none';
    let query = MetadataQuery.from(
      { resource: 'codelist', agency: 'BIS', id: 'CL_FREQ', version: '1.2+.0' });
    let service = Service.from({ url: 'http://test.com' });
    let url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    expected = 'http://test.com/structure/codelist/BIS/CL_FREQ/1.2+.0';
    query = MetadataQuery.from(
      { resource: 'codelist', agency: 'BIS', id: 'CL_FREQ', version: '1.2+.0' });
    service = Service.from({ url: 'http://test.com' });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });

  it('does not support semver before v2.0.0', () => {
    let query = MetadataQuery.from(
      { resource: 'dataflow', id: 'EXR', agency: 'ECB', version: '~' });
    let service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_5_0 });
    let test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'Semantic versioning not allowed in v1.5.0');

    query = MetadataQuery.from(
      { resource: 'dataflow', id: 'EXR', agency: 'ECB', version: '1.2+.42' });
    service = Service.from({ url: 'http://test.com', api: ApiVersion.v1_5_0 });
    test = () => new UrlGenerator().getUrl(query, service);
    should.Throw(test, Error, 'Semantic versioning not allowed in v1.5.0');
  });

  it('rewrites version keywords since v2.0.0', () => {
    let expected = 'http://test.com/structure/dataflow/BIS/EXR/~' +
      '?detail=full&references=none';
    let query = MetadataQuery.from(
      { resource: 'dataflow', agency: 'BIS', id: 'EXR', version: 'latest' });
    let service = Service.from({ url: 'http://test.com' });
    let url = new UrlGenerator().getUrl(query, service);
    url.should.equal(expected);

    expected = 'http://test.com/structure/dataflow/BIS/EXR';
    query = MetadataQuery.from(
      { resource: 'dataflow', agency: 'BIS', id: 'EXR', version: 'latest' });
    service = Service.from({ url: 'http://test.com' });
    url = new UrlGenerator().getUrl(query, service, true);
    url.should.equal(expected);
  });
});
