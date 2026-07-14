import chai from 'chai';
import { MetadataReferences } from '../../src/metadata/metadata-references';
import { MetadataReferencesExcluded } from '../../src/metadata/metadata-references';
import { MetadataReferencesSpecial } from '../../src/metadata/metadata-references';

chai.should();

describe('Metadata references', () => {
  const expectedReferences = [
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
    'none',
    'parents',
    'parentsandsiblings',
    'ancestors',
    'children',
    'descendants',
    'all',
  ];

  const excluded = ['structure', 'actualconstraint', 'allowedconstraint', '*'];

  const special = [
    'none',
    'parents',
    'parentsandsiblings',
    'ancestors',
    'children',
    'descendants',
    'all',
  ];

  it('contains all the expected references and only those', () => {
    let count = 0;
    for (const [, value] of Object.entries(MetadataReferences)) {
      expectedReferences.should.contain(value);
      count++;
    }
    count.should.equal(expectedReferences.length);
  });

  it('is immutable', () => {
    MetadataReferences.should.be.frozen;
  });

  it('indicates which references are excluded', () => {
    MetadataReferencesExcluded.should.eql(excluded);
    MetadataReferencesExcluded.should.be.frozen;
  });

  it('indicates which references are the special ones', () => {
    MetadataReferencesSpecial.should.be.frozen;
    let count = 0;
    for (const [, value] of Object.entries(MetadataReferencesSpecial)) {
      special.should.contain(value);
      count++;
    }
    count.should.equal(special.length);
  });
});
