import chai from 'chai';

import { MetadataDetail } from '../../src/metadata/metadata-detail';
import { MetadataReferences } from '../../src/metadata/metadata-references';
import { MetadataQuery } from '../../src/metadata/metadata-query';
import { MetadataType } from '../../src/metadata/metadata-type';

const should = chai.should();

describe('Metadata query', () => {
  it('has the expected properties', () => {
    const query = MetadataQuery.from({ resource: MetadataType.CODELIST });
    query.should.be.an('object');
    query.should.have.property('resource');
    query.should.have.property('agency');
    query.should.have.property('id');
    query.should.have.property('version');
    query.should.have.property('detail');
    query.should.have.property('references');
    query.should.have.property('item');
  });

  it('has the expected defaults', () => {
    const resource = MetadataType.CODELIST;
    const query = MetadataQuery.from({ resource: resource });
    query.should.have.property('resource').that.equals(resource);
    query.should.have.property('agency').that.equals('all');
    query.should.have.property('id').that.equals('all');
    query.should.have.property('version').that.equals('latest');
    query.should.have.property('item').that.equals('all');
    query.should.have.property('detail').that.equals(MetadataDetail.FULL);
    query.should.be
      .an('object')
      .with.property('references')
      .that.equals(MetadataReferences.NONE);
  });

  describe('when setting a resource type', () => {
    it('a string representing the resource type can be passed', () => {
      let resource = 'codelist';
      let query = MetadataQuery.from({ resource: resource });
      query.should.have.property('resource').that.equals(resource);

      resource = MetadataType.DATAFLOW;
      query = MetadataQuery.from({ resource: resource });
      query.should.have.property('resource').that.equals(resource);
    });

    it('a string representing multiple resource types can be used', () => {
      let type = 'codelist+dataflow';
      let query = MetadataQuery.from({ resource: type });
      query.should.have.property('resource').that.equals(type);

      type = 'codelist,dataflow';
      query = MetadataQuery.from({ resource: type });
      query.should.have.property('resource').that.equals(type);
    });

    it('an array representing multiple resource types can be used', () => {
      const types = ['codelist', 'dataflow'];
      const query = MetadataQuery.from({ resource: types });
      query.should.have.property('resource').that.equals('codelist+dataflow');
    });

    it('the character representing all resource types can be used', () => {
      const type = '*';
      const query = MetadataQuery.from({ resource: type });
      query.should.have.property('resource').that.equals(type);
    });

    it('throws an exception if the resource type is not set', () => {
      const test = () => MetadataQuery.from({});
      should.Throw(test, Error, 'Not a valid metadata query');
    });

    it('throws an exception if the resource type is unknown', () => {
      const test = () => MetadataQuery.from({ resource: 'test' });
      should.Throw(test, Error, 'Not a valid metadata query');
    });
  });

  describe('when setting an agency', () => {
    it('a string representing the agency id can be passed', () => {
      let agency = 'ECB';
      let query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        agency: agency,
      });
      query.should.have.property('agency').that.equals(agency);

      agency = 'ECB.DISS';
      query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        agency: agency,
      });
      query.should.have.property('agency').that.equals(agency);

      agency = 'ECB.DISS1';
      query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        agency: agency,
      });
      query.should.have.property('agency').that.equals(agency);

      agency = 'ECB_DISS1';
      query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        agency: agency,
      });
      query.should.have.property('agency').that.equals(agency);

      agency = 'ECB-DISS1';
      query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        agency: agency,
      });
      query.should.have.property('agency').that.equals(agency);
    });

    it('a string representing multiple agencies can be used', () => {
      let agency = 'ECB+BIS';
      let query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        agency: agency,
      });
      query.should.have.property('agency').that.equals(agency);

      agency = 'ECB,BIS';
      query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        agency: agency,
      });
      query.should.have.property('agency').that.equals(agency);
    });

    it('an array representing multiple agencies can be used', () => {
      const agencies = ['ECB.DISS', 'BIS'];
      const query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        agency: agencies,
      });
      query.should.have.property('agency').that.equals('ECB.DISS+BIS');
    });

    it('a string representing all agencies can be used', () => {
      let agency = 'all';
      let query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        agency: agency,
      });
      query.should.have.property('agency').that.equals(agency);

      agency = '*';
      query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        agency: agency,
      });
      query.should.have.property('agency').that.equals(agency);
    });

    it('throws an exception when the agency id is invalid', () => {
      let test = () =>
        MetadataQuery.from({ resource: 'codelist', agency: '1A' });
      should.Throw(test, Error, 'Not a valid metadata query');

      test = () => MetadataQuery.from({ resource: 'codelist', agency: ' ' });
      should.Throw(test, Error, 'Not a valid metadata query');

      test = () => MetadataQuery.from({ resource: 'codelist', agency: '$1' });
      should.Throw(test, Error, 'Not a valid metadata query');

      test = () => MetadataQuery.from({ resource: 'codelist', agency: '_A' });
      should.Throw(test, Error, 'Not a valid metadata query');

      test = () => MetadataQuery.from({ resource: 'codelist', agency: '-A' });
      should.Throw(test, Error, 'Not a valid metadata query');
    });
  });

  describe('when setting a resource id', () => {
    it('a string representing the resource id can be passed', () => {
      let id = 'CL_FREQ';
      let query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        id: id,
      });
      query.should.have.property('id').that.equals(id);

      id = 'CL-FREQ1';
      query = MetadataQuery.from({ resource: MetadataType.CODELIST, id: id });
      query.should.have.property('id').that.equals(id);
    });

    it('a string representing multiple resource ids can be used', () => {
      let id = 'CL_FREQ+CL_DECIMALS';
      let query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        id: id,
      });
      query.should.have.property('id').that.equals(id);

      id = 'CL_FREQ,CL_DECIMALS';
      query = MetadataQuery.from({ resource: MetadataType.CODELIST, id: id });
      query.should.have.property('id').that.equals(id);
    });

    it('an array representing multiple resource ids can be used', () => {
      const ids = ['CL_FREQ', 'CL_DECIMALS'];
      const query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        id: ids,
      });
      query.should.have.property('id').that.equals('CL_FREQ+CL_DECIMALS');
    });

    it('a string representing all resource ids can be used', () => {
      let id = 'all';
      let query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        id: id,
      });
      query.should.have.property('id').that.equals(id);

      id = '*';
      query = MetadataQuery.from({ resource: MetadataType.CODELIST, id: id });
      query.should.have.property('id').that.equals(id);
    });

    it('throws an exception if the resource id is invalid', () => {
      let test = () => MetadataQuery.from({ resource: 'codelist', id: ' ' });
      should.Throw(test, Error, 'Not a valid metadata query');

      test = () => MetadataQuery.from({ resource: 'codelist', id: 'A.B' });
      should.Throw(test, Error, 'Not a valid metadata query');
    });
  });

  describe('when setting a version', () => {
    it('a string representing the version can be passed', () => {
      let version = '1.0';
      let query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        version: version,
      });
      query.should.have.property('version').that.equals(version);

      version = 'all';
      query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        version: version,
      });
      query.should.have.property('version').that.equals(version);

      version = 'latest';
      query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        version: version,
      });
      query.should.have.property('version').that.equals(version);

      version = '1.0.0';
      query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        version: version,
      });
      query.should.have.property('version').that.equals(version);
    });

    it('a string representing multiple versions can be used', () => {
      const version = '1.0+2.1.1';
      const query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        version: version,
      });
      query.should.have.property('version').that.equals(version);
    });

    it('an array representing multiple versions can be used', () => {
      const versions = ['1.0', '2.1.1'];
      const query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        version: versions,
      });
      query.should.have.property('version').that.equals('1.0+2.1.1');
    });

    it('a semver string can be used', () => {
      let version = '1.0+.1';
      let query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        version: version,
      });
      query.should.have.property('version').that.equals(version);

      version = '~';
      query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        version: version,
      });
      query.should.have.property('version').that.equals(version);
    });

    it('throws an exception if the version is invalid', () => {
      let test = () =>
        MetadataQuery.from({ resource: 'codelist', version: 'semver' });
      should.Throw(test, Error, 'Not a valid metadata query');

      test = () =>
        MetadataQuery.from({ resource: 'codelist', version: '1_2_3' });
      should.Throw(test, Error, 'Not a valid metadata query');
    });
  });

  describe('when setting an item id', () => {
    it('a string representing the item id can be passed', () => {
      const item = 'A';
      const query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        item: item,
      });
      query.should.have.property('item').that.equals(item);
    });

    it('throws an exception if the item id is invalid', () => {
      let test = () => MetadataQuery.from({ resource: 'codelist', item: ' ' });
      should.Throw(test, Error, 'Not a valid metadata query');

      test = () => MetadataQuery.from({ resource: 'codelist', item: 'A*' });
      should.Throw(test, Error, 'Not a valid metadata query');
    });

    it('throws an exception when setting an item of a non item scheme query', () => {
      const test = () =>
        MetadataQuery.from({ resource: 'dataflow', item: 'A' });
      should.Throw(test, Error, 'Not a valid metadata query');
    });

    it('handles hierarchical codelists as item schemes', () => {
      const item = 'hierarchy';
      const query = MetadataQuery.from({
        resource: MetadataType.HIERARCHICAL_CODELIST,
        item: item,
      });
      query.should.have.property('item').that.equals(item);
    });

    it('a string representing multiple items can be used', () => {
      const items = 'A+B';
      const query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        item: items,
      });
      query.should.have.property('item').that.equals(items);
    });

    it('an array representing multiple items can be used', () => {
      const items = ['A', 'B'];
      const query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        item: items,
      });
      query.should.have.property('item').that.equals('A+B');
    });

    it('strings representing all items can be used', () => {
      let items = 'all';
      let query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        item: items,
      });
      query.should.have.property('item').that.equals('all');

      items = '*';
      query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        item: items,
      });
      query.should.have.property('item').that.equals('*');
    });
  });

  describe('when setting the amount of details', () => {
    it('a string representing the amount of details can be passed', () => {
      const detail = MetadataDetail.ALL_STUBS;
      const query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        detail: detail,
      });
      query.should.have.property('detail').that.equals(detail);
    });

    it('throws an exception of the value for detail is unknown', () => {
      const test = () =>
        MetadataQuery.from({ resource: 'dataflow', detail: 'test' });
      should.Throw(test, Error, 'Not a valid metadata query');
    });
  });

  describe('when setting the references to be resolved', () => {
    it('a string representing the references to be resolved can be passed', () => {
      const refs = MetadataReferences.PARENTS;
      const query = MetadataQuery.from({
        resource: MetadataType.CODELIST,
        references: refs,
      });
      query.should.have.property('references').that.equals(refs);
    });

    it('throws an exception if the value for references is unknown', () => {
      const test = () =>
        MetadataQuery.from({ resource: 'dataflow', references: 'ref' });
      should.Throw(test, Error, 'Not a valid metadata query');
    });
  });
});
