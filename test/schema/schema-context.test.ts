import chai from 'chai';
import { SchemaContext } from '../../src/schema/schema-context';

chai.should();

describe('Schema context', () => {
  const expectedContexts = [
    'datastructure',
    'metadatastructure',
    'dataflow',
    'metadataflow',
    'provisionagreement',
    'metadataprovisionagreement',
  ];

  it('contains all the expected contexts and only those', () => {
    let count = 0;
    for (const [, value] of Object.entries(SchemaContext)) {
      expectedContexts.should.contain(value);
      count++;
    }
    count.should.equal(expectedContexts.length);
  });

  it('is immutable', () => {
    SchemaContext.should.be.frozen;
  });
});
