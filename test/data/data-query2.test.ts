import chai from 'chai';

import { DataQuery2 } from '../../src/data/data-query2';

const should = chai.should();

describe('SDMX 3.0 data queries', () => {
  it('has the expected properties', () => {
    const q = DataQuery2.from({});
    q.should.be.an('object');
    q.should.have.property('context');
    q.should.have.property('key');
    q.should.have.property('updatedAfter');
    q.should.have.property('firstNObs');
    q.should.have.property('lastNObs');
    q.should.have.property('obsDimension');
    q.should.have.property('history');
    q.should.have.property('attributes');
    q.should.have.property('measures');
    q.should.have.property('filters');
  });

  it('has the expected defaults', () => {
    const q = DataQuery2.from({});
    q.should.have.property('context').that.equals('*=*:*(*)');
    q.should.have.property('key').that.equals('*');
    q.should.have.property('updatedAfter').that.is.undefined;
    q.should.have.property('firstNObs').that.is.undefined;
    q.should.have.property('lastNObs').that.is.undefined;
    q.should.have.property('obsDimension').that.is.undefined;
    q.should.have.property('history').that.is.false;
    q.should.have.property('attributes').that.equals('dsd');
    q.should.have.property('measures').that.equals('all');
    q.should.have.property('filters').that.is.instanceOf(Array);
    q.should.have.property('filters').that.has.lengthOf(0);
  });

  it('has the expected defaults, even when nothing gets passed', () => {
    const q = DataQuery2.from(null);
    q.should.have.property('context').that.equals('*=*:*(*)');
    q.should.have.property('key').that.equals('*');
    q.should.have.property('updatedAfter').that.is.undefined;
    q.should.have.property('firstNObs').that.is.undefined;
    q.should.have.property('lastNObs').that.is.undefined;
    q.should.have.property('obsDimension').that.is.undefined;
    q.should.have.property('history').that.is.false;
    q.should.have.property('attributes').that.equals('dsd');
    q.should.have.property('measures').that.equals('all');
    q.should.have.property('filters').that.has.lengthOf(0);
  });

  it('throws an exception if the input is not as expected', () => {
    const test = () => DataQuery2.from({ test: 'test' });
    should.Throw(test, Error, 'Not a valid data query');
  });

  describe('when setting the context', () => {
    it('throws an exception when the context is invalid', () => {
      const test = () => DataQuery2.from({ context: '1%' });
      should.Throw(test, Error, 'Not a valid data query');
    });

    it('accepts the usual context types', () => {
      const c1 = 'datastructure=BIS:BIS_CBS(1.0)';
      const q1 = DataQuery2.from({ context: c1 });
      q1.should.have.property('context').that.equals(c1);

      const c2 = 'dataflow=BIS:CBS(1.0)';
      const q2 = DataQuery2.from({ context: c2 });
      q2.should.have.property('context').that.equals(c2);

      const c3 = 'provisionagreement=BIS:CBS_5B0(1.0)';
      const q3 = DataQuery2.from({ context: c3 });
      q3.should.have.property('context').that.equals(c3);
    });

    it('accepts the new wildcard types', () => {
      const c = 'dataflow=BIS:*(~)';
      const q = DataQuery2.from({ context: c });
      q.should.have.property('context').that.equals(c);
    });

    it('accepts multiple values', () => {
      const c = 'dataflow=BIS:BIS_CBS,BIS_LBS(*)';
      const q = DataQuery2.from({ context: c });
      q.should.have.property('context').that.equals(c);
    });
  });

  describe('when setting the key', () => {
    it('a string representing the key can be used', () => {
      const key = 'M.CHF.EUR.SP00.A';
      const q = DataQuery2.from({ context: 'dataflow=BIS:CBS(1.0)', key: key });
      q.should.have.property('key').that.equals(key);
    });

    it('a string with wildcarded values can be used', () => {
      const key = 'M.*.EUR.SP00.*';
      const q = DataQuery2.from({ context: 'dataflow=BIS:CBS(1.0)', key: key });
      q.should.have.property('key').that.equals(key);
    });

    it('a string with multiple keys can be used', () => {
      const key = 'M.CHF.EUR.SP00.A,D.CHF.EUR.SP00.A';
      const q = DataQuery2.from({ context: 'dataflow=BIS:CBS(1.0)', key: key });
      q.should.have.property('key').that.equals(key);
    });

    it('throws an exception if the value for the key is invalid', () => {
      const test = () =>
        DataQuery2.from({
          context: 'dataflow=BIS:CBS(1.0)',
          key: 'M.CHF+NOK.EUR..',
        });
      should.Throw(test, Error, 'Not a valid data query');
    });

    it('throws an exception if one of the values for the key is invalid', () => {
      const test = () =>
        DataQuery2.from({
          context: 'dataflow=BIS:CBS(1.0)',
          key: 'M.CHF.EUR,M.USD+GBP.EUR',
        });
      should.Throw(test, Error, 'Not a valid data query');
    });
  });

  describe('when setting the updatedAfter timestamp', () => {
    it('a string representing a timestamp can be passed', () => {
      const last = '2016-03-04T09:57:00Z';
      const q = DataQuery2.from({
        context: 'dataflow=BIS:CBS(1.0)',
        updatedAfter: last,
      });
      q.should.have.property('updatedAfter').that.equals(last);
    });

    it('throws an exception if the value for updatedAfter is invalid', () => {
      let test = () =>
        DataQuery2.from({
          context: 'dataflow=BIS:CBS(1.0)',
          updatedAfter: 'now',
        });
      should.Throw(test, Error, 'Not a valid data query');

      test = () =>
        DataQuery2.from({
          context: 'dataflow=BIS:CBS(1.0)',
          updatedAfter: '2000-Q1',
        });
      should.Throw(test, Error, 'Not a valid data query');
    });
  });

  describe('when setting the first and last number of observations', () => {
    it('integers representing the desired number of obs can be passed', () => {
      const firstN = 1;
      const lastN = 3;
      const q = DataQuery2.from({
        context: 'dataflow=BIS:CBS(1.0)',
        firstNObs: firstN,
        lastNObs: lastN,
      });
      q.should.have.property('firstNObs').that.equals(firstN);
      q.should.have.property('lastNObs').that.equals(lastN);
    });

    it('throws an exception if the value for firstObs is invalid', () => {
      let test = () =>
        DataQuery2.from({ context: 'dataflow=BIS:CBS(1.0)', firstNObs: -2 });
      should.Throw(test, Error, 'Not a valid data query');

      test = () =>
        DataQuery2.from({
          context: 'dataflow=BIS:CBS(1.0)',
          firstNObs: 'test',
        });
      should.Throw(test, Error, 'Not a valid data query');
    });

    it('throws an exception if the value for lastNObs is invalid', () => {
      let test = () =>
        DataQuery2.from({ context: 'dataflow=BIS:CBS(1.0)', lastNObs: -2 });
      should.Throw(test, Error, 'Not a valid data query');

      test = () =>
        DataQuery2.from({ context: 'dataflow=BIS:CBS(1.0)', lastNObs: 'test' });
      should.Throw(test, Error, 'Not a valid data query');
    });
  });

  describe('when setting the dimension at observation level', () => {
    it('a string representing the dimension at the obs level can be passed', () => {
      const dim = 'CURRENCY';
      const q = DataQuery2.from({
        context: 'dataflow=BIS:CBS(1.0)',
        obsDimension: dim,
      });
      q.should.have.property('obsDimension').that.equals(dim);
    });

    it('throws an exception if value for obs dimension is invalid', () => {
      const test = () =>
        DataQuery2.from({
          context: 'dataflow=BIS:CBS(1.0)',
          obsDimension: '*&^%$#@!)',
        });
      should.Throw(test, Error, 'Not a valid data query');
    });
  });

  describe('when setting whether historical data should be returned', () => {
    it('a boolean can be passed', () => {
      const q = DataQuery2.from({
        context: 'dataflow=BIS:CBS(1.0)',
        history: true,
      });
      q.should.have.property('history').that.is.true;
    });

    it('throws an exception if the value for history is not a boolean', () => {
      const test = () =>
        DataQuery2.from({ context: 'dataflow=BIS:CBS(1.0)', history: 'test' });
      should.Throw(test, Error, 'Not a valid data query');
    });
  });

  describe('when setting the attributes to be returned', () => {
    it('a string representing one set of attributes can be passed', () => {
      const attrs = 'msd';
      const q = DataQuery2.from({
        context: 'dataflow=BIS:CBS(1.0)',
        attributes: attrs,
      });
      q.should.have.property('attributes').that.equals(attrs);
    });

    it('a string representing multiple sets of attributes can be passed', () => {
      const attrs = 'msd,dataset,UNIT';
      const q = DataQuery2.from({
        context: 'dataflow=BIS:CBS(1.0)',
        attributes: attrs,
      });
      q.should.have.property('attributes').that.equals(attrs);
    });

    it('throws an exception if value for attributes is invalid', () => {
      const test = () =>
        DataQuery2.from({ context: 'dataflow=BIS:CBS(1.0)', attributes: '&1' });
      should.Throw(test, Error, 'Not a valid data query');
    });

    it('throws an exception if one of the values for attributes is invalid', () => {
      const test = () =>
        DataQuery2.from({
          context: 'dataflow=BIS:CBS(1.0)',
          attributes: 'UNIT,&1',
        });
      should.Throw(test, Error, 'Not a valid data query');
    });
  });

  describe('when setting the measures to be returned', () => {
    it('a string representing one predefined set of measures can be passed', () => {
      const m = 'all';
      const q = DataQuery2.from({
        context: 'dataflow=BIS:CBS(1.0)',
        measures: m,
      });
      q.should.have.property('measures').that.equals(m);
    });

    it('a string representing multiple measures can be passed', () => {
      const m = 'TURNOVER,OPEN_INTEREST';
      const q = DataQuery2.from({
        context: 'dataflow=BIS:CBS(1.0)',
        measures: m,
      });
      q.should.have.property('measures').that.equals(m);
    });

    it('throws an exception if value for measures is invalid', () => {
      const test = () =>
        DataQuery2.from({ context: 'dataflow=BIS:CBS(1.0)', measures: '&1' });
      should.Throw(test, Error, 'Not a valid data query');
    });

    it('throws an exception if one of the values for measures is invalid', () => {
      const test = () =>
        DataQuery2.from({
          context: 'dataflow=BIS:CBS(1.0)',
          measures: 'TURNOVER,&1',
        });
      should.Throw(test, Error, 'Not a valid data query');
    });
  });

  describe('when setting the filters to be applied', () => {
    it('a string representing one filter can be passed', () => {
      const f = 'FREQ=A';
      const q = DataQuery2.from({
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
      const q = DataQuery2.from({
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
        DataQuery2.from({
          context: 'dataflow=BIS:CBS(1.0)',
          filters: 'FREQ=badop:UNIT',
        });
      should.Throw(test, Error, 'Not a valid data query');
    });

    it('throws an exception if one of the filters is invalid', () => {
      const test = () =>
        DataQuery2.from({
          context: 'dataflow=BIS:CBS(1.0)',
          filters: ['FREQ=A', '$1'],
        });
      should.Throw(test, Error, 'Not a valid data query');
    });
  });
});
