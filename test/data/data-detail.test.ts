import chai from 'chai';

import { DataDetail } from '../../src/data/data-detail';

chai.should();

describe('Data detail', () => {

  const expectedDetails = [
    'full',
    'dataonly',
    'serieskeysonly',
    'nodata',
  ];

  it('contains all the expected details and only those', () => {
    let count = 0;
    for (const [, value] of Object.entries(DataDetail)) {
      expectedDetails.should.contain(value);
      count++;
    }
    count.should.equal(expectedDetails.length);
  });

  it('is immutable', () => {
    DataDetail.should.be.frozen;
  });
});
