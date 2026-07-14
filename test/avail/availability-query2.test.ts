import chai from 'chai';

import { AvailabilityMode } from '../../src/avail/availability-mode';
import { AvailabilityReferences } from '../../src/avail/availability-references';
import { AvailabilityQuery2 } from '../../src/avail/availability-query2';

const should = chai.should();

describe('SDMX 3.0 availability queries', () => {
  it('has the expected properties', () => {
    const q = AvailabilityQuery2.from({});
    q.should.be.an('object');
    q.should.have.property('context');
    q.should.have.property('key');
    q.should.have.property('component');
    q.should.have.property('updatedAfter');
    q.should.have.property('filters');
    q.should.have.property('mode');
    q.should.have.property('references');
  });

  it('has the expected defaults', () => {
    const q = AvailabilityQuery2.from({});
    q.should.have.property('context').that.equals('*=*:*(*)');
    q.should.have.property('key').that.equals('*');
    q.should.have.property('component').that.equals('*');
    q.should.have.property('updatedAfter').that.is.undefined;
    q.should.have.property('filters').that.is.instanceOf(Array);
    q.should.have.property('filters').that.has.lengthOf(0);
    q.should.have.property('mode').that.equals('exact');
    q.should.have.property('references').that.equals('none');
  });

  it('has the expected defaults, even when nothing gets passed', () => {
    const q = AvailabilityQuery2.from(null);
    q.should.have.property('context').that.equals('*=*:*(*)');
    q.should.have.property('key').that.equals('*');
    q.should.have.property('component').that.equals('*');
    q.should.have.property('updatedAfter').that.is.undefined;
    q.should.have.property('filters').that.has.lengthOf(0);
    q.should.have.property('mode').that.equals('exact');
    q.should.have.property('references').that.equals('none');
  });

  it('throws an exception if the input is not as expected', () => {
    const test = () => AvailabilityQuery2.from({ test: 'test' });
    should.Throw(test, Error, 'Not a valid availability query');
  });

  describe('when setting the context', () => {
    it('throws an exception when the context is invalid', () => {
      const test = () => AvailabilityQuery2.from({ context: '1%' });
      should.Throw(test, Error, 'Not a valid availability query');
    });

    it('accepts the usual context types', () => {
      const c1 = 'datastructure=BIS:BIS_CBS(1.0)';
      const q1 = AvailabilityQuery2.from({ context: c1 });
      q1.should.have.property('context').that.equals(c1);

      const c2 = 'dataflow=BIS:CBS(1.0)';
      const q2 = AvailabilityQuery2.from({ context: c2 });
      q2.should.have.property('context').that.equals(c2);

      const c3 = 'provisionagreement=BIS:CBS_5B0(1.0)';
      const q3 = AvailabilityQuery2.from({ context: c3 });
      q3.should.have.property('context').that.equals(c3);
    });

    it('accepts the new wildcard types', () => {
      const c = 'dataflow=BIS:*(~)';
      const q = AvailabilityQuery2.from({ context: c });
      q.should.have.property('context').that.equals(c);
    });

    it('accepts multiple values', () => {
      const c = 'dataflow=BIS:BIS_CBS,BIS_LBS(*)';
      const q = AvailabilityQuery2.from({ context: c });
      q.should.have.property('context').that.equals(c);
    });
  });

  describe('when setting the key', () => {
    it('a string representing the key can be used', () => {
      const key = 'M.CHF.EUR.SP00.A';
      const q = AvailabilityQuery2.from({
        context: 'dataflow=BIS:CBS(1.0)',
        key: key,
      });
      q.should.have.property('key').that.equals(key);
    });

    it('a string with wildcarded values can be used', () => {
      const key = 'M.*.EUR.SP00.*';
      const q = AvailabilityQuery2.from({
        context: 'dataflow=BIS:CBS(1.0)',
        key: key,
      });
      q.should.have.property('key').that.equals(key);
    });

    it('a string with multiple keys can be used', () => {
      const key = 'M.CHF.EUR.SP00.A,D.CHF.EUR.SP00.A';
      const q = AvailabilityQuery2.from({
        context: 'dataflow=BIS:CBS(1.0)',
        key: key,
      });
      q.should.have.property('key').that.equals(key);
    });

    it('throws an exception if the value for the key is invalid', () => {
      const test = () =>
        AvailabilityQuery2.from({
          context: 'dataflow=BIS:CBS(1.0)',
          key: 'M.CHF+NOK.EUR..',
        });
      should.Throw(test, Error, 'Not a valid availability query');
    });

    it('throws an exception if one of the values for the key is invalid', () => {
      const test = () =>
        AvailabilityQuery2.from({
          context: 'dataflow=BIS:CBS(1.0)',
          key: 'M.CHF.EUR,M.USD+GBP.EUR',
        });
      should.Throw(test, Error, 'Not a valid availability query');
    });
  });

  describe('when setting the component ID', () => {
    it('a string representing the component id can be passed', () => {
      const cp = 'A';
      const query = AvailabilityQuery2.from({
        context: 'dataflow=BIS:CBS(1.0)',
        component: cp,
      });
      query.should.have.property('component').that.equals(cp);
    });

    it('a string representing multilpe component ids can be passed', () => {
      const cp = 'A,B';
      const query = AvailabilityQuery2.from({
        context: 'dataflow=BIS:CBS(1.0)',
        component: cp,
      });
      query.should.have.property('component').that.equals(cp);
    });

    it('throws an exception if the component id is invalid', () => {
      let test = () =>
        AvailabilityQuery2.from({
          context: 'dataflow=BIS:CBS(1.0)',
          component: ' ',
        });
      should.Throw(test, Error, 'Not a valid availability query');

      test = () =>
        AvailabilityQuery2.from({
          context: 'dataflow=BIS:CBS(1.0)',
          component: 'A*',
        });
      should.Throw(test, Error, 'Not a valid availability query');
    });

    it('throws an exception one of the component ids is invalid', () => {
      const test = () =>
        AvailabilityQuery2.from({
          context: 'dataflow=BIS:CBS(1.0)',
          component: 'A,Q*',
        });
      should.Throw(test, Error, 'Not a valid availability query');
    });
  });

  describe('when setting the updatedAfter timestamp', () => {
    it('a string representing a timestamp can be passed', () => {
      const last = '2016-03-04T09:57:00Z';
      const q = AvailabilityQuery2.from({
        context: 'dataflow=BIS:CBS(1.0)',
        updatedAfter: last,
      });
      q.should.have.property('updatedAfter').that.equals(last);
    });

    it('throws an exception if the value for updatedAfter is invalid', () => {
      let test = () =>
        AvailabilityQuery2.from({
          context: 'dataflow=BIS:CBS(1.0)',
          updatedAfter: 'now',
        });
      should.Throw(test, Error, 'Not a valid availability query');

      test = () =>
        AvailabilityQuery2.from({
          context: 'dataflow=BIS:CBS(1.0)',
          updatedAfter: '2000-Q1',
        });
      should.Throw(test, Error, 'Not a valid availability query');
    });
  });

  describe('when setting the filters to be applied', () => {
    it('a string representing one filter can be passed', () => {
      const f = 'FREQ=A';
      const q = AvailabilityQuery2.from({
        context: 'dataflow=BIS:CBS(1.0)',
        filters: f,
      });
      q.should.have.property('filters').that.has.lengthOf(1);
      const r = q.filters[0];
      r.should.equal(f);
    });

    it('an array representing multiple filters can be passed', () => {
      const f1 = 'FREQ=A';
      const f2 = 'TIME_PERIOD=ge:2020-01+le:2020-12,2022-08';
      const q = AvailabilityQuery2.from({
        context: 'dataflow=BIS:CBS(1.0)',
        filters: [f1, f2],
      });
      q.should.have.property('filters').that.has.lengthOf(2);
      const r1 = q.filters[0];
      r1.should.equal(f1);
      const r2 = q.filters[1];
      r2.should.equal(f2);
    });

    it('throws an exception if the filter is invalid', () => {
      const test = () =>
        AvailabilityQuery2.from({
          context: 'dataflow=BIS:CBS(1.0)',
          filters: 'FREQ=badop:UNIT',
        });
      should.Throw(test, Error, 'Not a valid availability query');
    });

    it('throws an exception if one of the filters is invalid', () => {
      const test = () =>
        AvailabilityQuery2.from({
          context: 'dataflow=BIS:CBS(1.0)',
          filters: ['FREQ=A', '$1'],
        });
      should.Throw(test, Error, 'Not a valid availability query');
    });
  });

  describe('when setting the processing mode', () => {
    it('a string representing the amount of details can be passed', () => {
      const mode = AvailabilityMode.AVAILABLE;
      const query = AvailabilityQuery2.from({
        context: 'dataflow=BIS:CBS(1.0)',
        mode: mode,
      });
      query.should.have.property('mode').that.equals(mode);
    });

    it('throws an exception if the value for mode is unknown', () => {
      const test = () =>
        AvailabilityQuery2.from({
          context: 'dataflow=BIS:CBS(1.0)',
          mode: 'test',
        });
      should.Throw(test, Error, 'Not a valid availability query');
    });
  });

  describe('when setting the references', () => {
    it('a string representing the references to be resolved can be passed', () => {
      const refs = AvailabilityReferences.CONCEPT_SCHEME;
      const query = AvailabilityQuery2.from({
        context: 'dataflow=BIS:CBS(1.0)',
        references: refs,
      });
      query.should.have.property('references').that.equals(refs);
    });

    it('throws an exception if the value for references is unknown', () => {
      const test = () =>
        AvailabilityQuery2.from({
          context: 'dataflow=BIS:CBS(1.0)',
          references: 'ref',
        });
      should.Throw(test, Error, 'Not a valid availability query');
    });
  });
});
