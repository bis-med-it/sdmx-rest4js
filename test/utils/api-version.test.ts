import chai from 'chai';
import { ApiVersion } from '../../src/utils/api-version';
import { ApiResources } from '../../src/utils/api-version';
import { getKeyFromVersion } from '../../src/utils/api-version';

chai.should();

describe('API versions', () => {
  const expectedAPIs = [
    'v1.0.0',
    'v1.0.1',
    'v1.0.2',
    'v1.1.0',
    'v1.2.0',
    'v1.3.0',
    'v1.4.0',
    'v1.5.0',
    'v2.0.0',
    'latest',
  ];

  it('contains all the expected versions and only those', () => {
    let count = 0;
    for (const [, value] of Object.entries(ApiVersion)) {
      expectedAPIs.should.contain(value);
      count++;
    }
    count.should.equal(expectedAPIs.length);
  });

  it('is immutable', () => {
    ApiVersion.should.be.frozen;
  });

  it('considers v2.0.0 as the latest version', () => {
    ApiVersion.LATEST.should.equal('v2.0.0');
  });
});

describe('API resources', () => {
  const expectedResourcesV1 = [
    'datastructure',
    'metadatastructure',
    'categoryscheme',
    'conceptscheme',
    'codelist',
    'hierarchicalcodelist',
    'organisationscheme',
    'agencyscheme',
    'dataproviderscheme',
    'dataconsumerscheme',
    'organisationunitscheme',
    'dataflow',
    'metadataflow',
    'reportingtaxonomy',
    'provisionagreement',
    'structureset',
    'process',
    'categorisation',
    'contentconstraint',
    'attachmentconstraint',
    'structure',
    'data',
    'metadata',
    'schema',
  ].sort();

  const expectedResourcesV3 = [
    'datastructure',
    'metadatastructure',
    'categoryscheme',
    'conceptscheme',
    'codelist',
    'hierarchicalcodelist',
    'organisationscheme',
    'agencyscheme',
    'dataproviderscheme',
    'dataconsumerscheme',
    'organisationunitscheme',
    'dataflow',
    'metadataflow',
    'reportingtaxonomy',
    'provisionagreement',
    'structureset',
    'process',
    'categorisation',
    'contentconstraint',
    'attachmentconstraint',
    'actualconstraint',
    'allowedconstraint',
    'structure',
    'data',
    'metadata',
    'schema',
    'availableconstraint',
  ].sort();

  const expectedResourcesV5 = [
    'datastructure',
    'metadatastructure',
    'categoryscheme',
    'conceptscheme',
    'codelist',
    'hierarchicalcodelist',
    'organisationscheme',
    'agencyscheme',
    'dataproviderscheme',
    'dataconsumerscheme',
    'organisationunitscheme',
    'dataflow',
    'metadataflow',
    'reportingtaxonomy',
    'provisionagreement',
    'structureset',
    'process',
    'categorisation',
    'contentconstraint',
    'attachmentconstraint',
    'actualconstraint',
    'allowedconstraint',
    'structure',
    'data',
    'metadata',
    'schema',
    'availableconstraint',
    'transformationscheme',
    'rulesetscheme',
    'userdefinedoperatorscheme',
    'customtypescheme',
    'namepersonalisationscheme',
    'namealiasscheme',
  ].sort();

  const expectedResourcesV6 = [
    'datastructure',
    'metadatastructure',
    'categoryscheme',
    'conceptscheme',
    'codelist',
    'hierarchy',
    'hierarchyassociation',
    'valuelist',
    'agencyscheme',
    'dataproviderscheme',
    'metadataproviderscheme',
    'dataconsumerscheme',
    'organisationunitscheme',
    'dataflow',
    'metadataflow',
    'reportingtaxonomy',
    'provisionagreement',
    'metadataprovisionagreement',
    'structuremap',
    'representationmap',
    'conceptschememap',
    'categoryschememap',
    'organisationschememap',
    'reportingtaxonomymap',
    'process',
    'categorisation',
    'dataconstraint',
    'metadataconstraint',
    'structure',
    'transformationscheme',
    'rulesetscheme',
    'userdefinedoperatorscheme',
    'customtypescheme',
    'namepersonalisationscheme',
    'vtlmappingscheme',
    'availability',
    'data',
    'schema',
    'metadata',
  ].sort();

  it('contains all the expected resources for version 1.0.0 and only those', () => {
    ApiResources.v1_0_0.should.eql(expectedResourcesV1);
  });

  it('contains all the expected resources for version 1.0.1 and only those', () => {
    ApiResources.v1_0_1.should.eql(expectedResourcesV1);
  });

  it('contains all the expected resources for version 1.0.2 and only those', () => {
    ApiResources.v1_0_2.should.eql(expectedResourcesV1);
  });

  it('contains all the expected resources for version 1.1.0 and only those', () => {
    ApiResources.v1_1_0.should.eql(expectedResourcesV1);
  });

  it('contains all the expected resources for version 1.2.0 and only those', () => {
    ApiResources.v1_2_0.should.eql(expectedResourcesV1);
  });

  it('contains all the expected resources for version 1.3.0 and only those', () => {
    ApiResources.v1_3_0.should.eql(expectedResourcesV3);
  });

  it('contains all the expected resources for version 1.4.0 and only those', () => {
    ApiResources.v1_4_0.should.eql(expectedResourcesV3);
  });

  it('contains all the expected resources for version 1.5.0 and only those', () => {
    ApiResources.v1_5_0.should.eql(expectedResourcesV5);
  });

  it('contains all the expected resources for version 2.0.0 and only those', () => {
    ApiResources.v2_0_0.should.eql(expectedResourcesV6);
  });

  it('contains all the expected resources for the latest version and only those', () => {
    ApiResources.LATEST.should.eql(expectedResourcesV6);
  });
});

describe('Translator', () => {
  it('translates version numbers into keys', () => {
    const api = ApiVersion.v2_0_0;
    const k = getKeyFromVersion(api);
    const a = ApiVersion[k];
    console.log(k);
    api.should.equal(a);
  });
});
