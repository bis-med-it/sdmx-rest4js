import chai from 'chai';
import { AvailabilityReferences } from '../../src/avail/availability-references';

chai.should();

describe('Availability references', () => {
  const expectedReferences = [
    'datastructure',
    'conceptscheme',
    'codelist',
    'dataproviderscheme',
    'dataflow',
    'none',
    'all',
  ];

  it('contains all the expected references and only those', () => {
    let count = 0;
    for (const [, value] of Object.entries(AvailabilityReferences)) {
      expectedReferences.should.contain(value);
      count++;
    }
    count.should.equal(expectedReferences.length);
  });

  it('is immutable', () => {
    AvailabilityReferences.should.be.frozen;
  });
});
