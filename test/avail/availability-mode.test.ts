import chai from 'chai';
import { AvailabilityMode } from '../../src/avail/availability-mode';

chai.should();

describe('Availability modes', () => {

  const expectedTypes = [
    'exact',
    'available',
  ];

  it('contains all the expected modes and only those', () => {
    let count = 0;
    for (const [, value] of Object.entries(AvailabilityMode)) {
      expectedTypes.should.contain(value);
      count++;
    }
    count.should.equal(expectedTypes.length);
  });

  it('is immutable', () => {
    AvailabilityMode.should.be.frozen;
  });
});
