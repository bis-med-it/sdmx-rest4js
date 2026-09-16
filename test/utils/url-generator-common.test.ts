import chai from 'chai';

import {
  parseContext,
  parseFilter,
} from '../../src/utils/url-generator-common';

const should = chai.should();

describe('URL Generator common helpers', () => {
  describe('parseContext()', () => {
    it('parses valid context values', () => {
      const context = parseContext('dataflow=ECB:EXR(*)');
      context.should.deep.equal(['dataflow', 'ECB', 'EXR', '*']);
    });

    it('throws an error for invalid context values', () => {
      const test = () => parseContext('invalid-context');
      should.Throw(test, Error, 'Invalid context');
    });
  });

  describe('parseFilter()', () => {
    it('parses valid filter values', () => {
      const filter = parseFilter('REF_AREA=CH');
      filter.should.deep.equal(['REF_AREA', 'CH']);
    });

    it('throws an error for invalid filter values', () => {
      const test = () => parseFilter('invalid-filter');
      should.Throw(test, Error, 'Invalid filter');
    });
  });
});
