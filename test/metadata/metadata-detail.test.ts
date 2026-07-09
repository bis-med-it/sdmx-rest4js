import chai from 'chai';

import { MetadataDetail } from '../../src/metadata/metadata-detail';

chai.should();

describe('Metadata detail', () => {
  const expectedDetails = [
    'full',
    'referencestubs',
    'allstubs',
    'referencepartial',
    'allcompletestubs',
    'referencecompletestubs',
    'raw',
  ];

  it('contains all the expected details and only those', () => {
    let count = 0;
    for (const [, value] of Object.entries(MetadataDetail)) {
      expectedDetails.should.contain(value);
      count++;
    }
    count.should.equal(expectedDetails.length);
  });

  it('is immutable', () => {
    MetadataDetail.should.be.frozen;
  });
});
