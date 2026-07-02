import chai from 'chai';
import { MetadataType } from '../../src/metadata/metadata-type';
import { isItemScheme } from '../../src/metadata/metadata-type';

chai.should();

describe('Metadata types', () => {

  const expectedTypes = [
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
    'transformationscheme',
    'rulesetscheme',
    'userdefinedoperatorscheme',
    'customtypescheme',
    'namepersonalisationscheme',
    'namealiasscheme',
    'dataconstraint',
    'metadataconstraint',
    'hierarchy',
    'hierarchyassociation',
    'vtlmappingscheme',
    'valuelist',
    'structuremap',
    'representationmap',
    'conceptschememap',
    'categoryschememap',
    'organisationschememap',
    'reportingtaxonomymap',
    'metadataproviderscheme',
    'metadataprovisionagreement',
    '*',
  ];

  it('contains all the expected types of metadata and only those', () => {
    let count = 0;
    for (const [, value] of Object.entries(MetadataType)) {
      expectedTypes.should.contain(value);
      count++;
    }
    count.should.equal(expectedTypes.length);
  });

  it('is immutable', () => {
    MetadataType.should.be.frozen;
  });

  it('considers hierarchicalcodelist as item scheme', () => {
    isItemScheme('hierarchicalcodelist').should.be.true;
  });

  it('considers reportingtaxonomy as item scheme', () => {
    isItemScheme('reportingtaxonomy').should.be.true;
  });

  it('considers transformationscheme as item scheme', () => {
    isItemScheme('transformationscheme').should.be.true;
  });

  it('considers rulesetscheme as item scheme', () => {
    isItemScheme('rulesetscheme').should.be.true;
  });

  it('considers userdefinedoperatorscheme as item scheme', () => {
    isItemScheme('userdefinedoperatorscheme').should.be.true;
  });

  it('considers customtypescheme as item scheme', () => {
    isItemScheme('customtypescheme').should.be.true;
  });

  it('considers namepersonalisationscheme as item scheme', () => {
    isItemScheme('namepersonalisationscheme').should.be.true;
  });

  it('considers namealiasscheme as item scheme', () => {
    isItemScheme('namealiasscheme').should.be.true;
  });
});
