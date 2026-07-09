import chai from 'chai';

import { AvailabilityMode } from '../../src/avail/availability-mode';
import { AvailabilityReferences } from '../../src/avail/availability-references';
import { AvailabilityQuery } from '../../src/avail/availability-query';

const should = chai.should();

describe('Availability queries', () => {
  it('has the expected properties', () => {
    const q = AvailabilityQuery.from({ flow: 'ICP' });
    q.should.be.an('object');
    q.should.have.property('flow');
    q.should.have.property('key');
    q.should.have.property('provider');
    q.should.have.property('component');
    q.should.have.property('start');
    q.should.have.property('end');
    q.should.have.property('updatedAfter');
    q.should.have.property('mode');
    q.should.have.property('references');
  });

  it('has the expected defaults', () => {
    const flow = 'EXR';
    const q = AvailabilityQuery.from({ flow: flow });
    q.should.have.property('flow').that.equals(flow);
    q.should.have.property('key').that.equals('all');
    q.should.have.property('provider').that.equals('all');
    q.should.have.property('component').that.equals('all');
    q.should.have.property('start').that.is.undefined;
    q.should.have.property('end').that.is.undefined;
    q.should.have.property('updatedAfter').that.is.undefined;
    q.should.have.property('mode').that.equals('exact');
    q.should.have.property('references').that.equals('none');
  });

  it('throws an exception when using an unknown property', () => {
    const test = () => AvailabilityQuery.from({ flow: 'EXR', type: 'blah' });
  });

  describe('when setting the flow', () => {
    it('throws an exception when the flow is not set', () => {
      let test = () => AvailabilityQuery.from({ flow: ' ' });
      should.Throw(test, Error, 'Not a valid availability query');

      test = () => AvailabilityQuery.from({ flow: undefined });
      should.Throw(test, Error, 'Not a valid availability query');
    });

    it('throws an exception when the flow is invalid', () => {
      const test = () => AvailabilityQuery.from({ flow: '1%' });
      should.Throw(test, Error, 'Not a valid availability query');
    });
  });

  describe('when setting the key', () => {
    it('a string representing the key can be used', () => {
      const flow = 'EXR';
      const key = '.CHF+NOK.EUR..2';
      const q = AvailabilityQuery.from({ flow: flow, key: key });
      q.should.have.property('flow').that.equals(flow);
      q.should.have.property('key').that.equals(key);
    });

    it('an array of arrays can be used to build the key', () => {
      const values = [['D'], ['NOK', 'RUB', 'CHF'], ['EUR'], [], ['A']];
      const query = AvailabilityQuery.from({ flow: 'EXR', key: values });
      query.should.have.property('flow').that.equals('EXR');
      query.should.have.property('key').that.equals('D.NOK+RUB+CHF.EUR..A');
    });

    it('a mixed array can be used to build the key', () => {
      const values = ['D', ['NOK', 'RUB', 'CHF'], '', 'SP00', undefined];
      const query = AvailabilityQuery.from({ flow: 'EXR', key: values });
      query.should.have.property('flow').that.equals('EXR');
      query.should.have.property('key').that.equals('D.NOK+RUB+CHF..SP00.');
    });

    it('an exotic array can be used to build the key', () => {
      const values = ['', ['NOK', 'RUB', 'CHF'], ['EUR'], undefined, null];
      const query = AvailabilityQuery.from({ flow: 'EXR', key: values });
      query.should.have.property('flow').that.equals('EXR');
      query.should.have.property('key').that.equals('.NOK+RUB+CHF.EUR..');
    });

    it('throws an exception if the value for the key is invalid', () => {
      const test = () => AvailabilityQuery.from({ flow: 'EXR', key: '1%' });
      should.Throw(test, Error, 'Not a valid availability query');
    });
  });

  describe('when setting the provider', () => {
    it('a string representing the provider can be used', () => {
      const flow = 'EXR';
      let provider = 'ECB';
      let q = AvailabilityQuery.from({ flow: flow, provider: provider });
      q.should.have.property('flow').that.equals(flow);
      q.should.have.property('provider').that.equals(provider);

      provider = 'SDMX,ECB';
      q = AvailabilityQuery.from({ flow: flow, provider: provider });
      q.should.have.property('flow').that.equals(flow);
      q.should.have.property('provider').that.equals(provider);
    });

    it('throws an exception if the value for provider is invalid', () => {
      const test = () =>
        AvailabilityQuery.from({ flow: 'EXR', provider: 'SDMX,ECB,2.0' });
      should.Throw(test, Error, 'Not a valid availability query');
    });

    it('a string representing multiple providers can be used', () => {
      const flow = 'EXR';
      const provider = 'ECB+BIS';
      const q = AvailabilityQuery.from({ flow: flow, provider: provider });
      q.should.have.property('flow').that.equals(flow);
      q.should.have.property('provider').that.equals(provider);
    });

    it('an array representing multiple providers can be used', () => {
      const flow = 'EXR';
      const providers = ['SDMX,ECB', 'BIS'];
      const q = AvailabilityQuery.from({ flow: flow, provider: providers });
      q.should.have.property('flow').that.equals(flow);
      q.should.have.property('provider').that.equals('SDMX,ECB+BIS');
    });
  });

  describe('when setting the start and end periods', () => {
    it('a string representing years can be passed', () => {
      const flow = 'EXR';
      const start = '2000';
      const end = '2004';
      const q = AvailabilityQuery.from({ flow: flow, start: start, end: end });
      q.should.have.property('flow').that.equals(flow);
      q.should.have.property('start').that.equals(start);
      q.should.have.property('end').that.equals(end);
    });

    it('a string representing months can be passed', () => {
      const flow = 'EXR';
      const start = '2000-01';
      const end = '2004-12';
      const q = AvailabilityQuery.from({ flow: flow, start: start, end: end });
      q.should.have.property('flow').that.equals(flow);
      q.should.have.property('start').that.equals(start);
      q.should.have.property('end').that.equals(end);
    });

    it('a string representing days can be passed', () => {
      const flow = 'EXR';
      const start = '2000-01-01';
      const end = '2004-12-31';
      const q = AvailabilityQuery.from({ flow: flow, start: start, end: end });
      q.should.have.property('flow').that.equals(flow);
      q.should.have.property('start').that.equals(start);
      q.should.have.property('end').that.equals(end);
    });

    it('a string representing quarters can be passed', () => {
      const flow = 'EXR';
      const start = '2000-Q1';
      const end = '2004-Q4';
      const q = AvailabilityQuery.from({ flow: flow, start: start, end: end });
      q.should.have.property('flow').that.equals(flow);
      q.should.have.property('start').that.equals(start);
      q.should.have.property('end').that.equals(end);
    });

    it('a string representing semesters can be passed', () => {
      const flow = 'EXR';
      const start = '2000-S1';
      const end = '2004-S4';
      const q = AvailabilityQuery.from({ flow: flow, start: start, end: end });
      q.should.have.property('flow').that.equals(flow);
      q.should.have.property('start').that.equals(start);
      q.should.have.property('end').that.equals(end);
    });

    it('a string representing weeks can be passed', () => {
      const flow = 'EXR';
      const start = '2000-W01';
      const end = '2004-W53';
      const q = AvailabilityQuery.from({ flow: flow, start: start, end: end });
      q.should.have.property('flow').that.equals(flow);
      q.should.have.property('start').that.equals(start);
      q.should.have.property('end').that.equals(end);
    });

    it('throws an exception if the value for start period is invalid', () => {
      const test = () =>
        AvailabilityQuery.from({ flow: 'EXR', start: 'SDMX,ECB,2.0' });
      should.Throw(test, Error, 'Not a valid availability query');
    });

    it('throws an exception if the value for end period is invalid', () => {
      const test = () =>
        AvailabilityQuery.from({ flow: 'EXR', end: 'SDMX,ECB,2.0' });
      should.Throw(test, Error, 'Not a valid availability query');
    });
  });

  describe('when setting the updatedAfter timestamp', () => {
    it('a string representing a timestamp can be passed', () => {
      const flow = 'EXR';
      const last = '2016-03-04T09:57:00Z';
      const q = AvailabilityQuery.from({ flow: flow, updatedAfter: last });
      q.should.have.property('flow').that.equals(flow);
      q.should.have.property('updatedAfter').that.equals(last);
    });

    it('throws an exception if the value for updatedAfter is invalid', () => {
      let test = () =>
        AvailabilityQuery.from({ flow: 'EXR', updatedAfter: 'now' });
      should.Throw(test, Error, 'Not a valid availability query');

      test = () =>
        AvailabilityQuery.from({ flow: 'EXR', updatedAfter: '2000-Q1' });
      should.Throw(test, Error, 'Not a valid availability query');
    });
  });

  describe('when setting the component ID', () => {
    it('a string representing the component id can be passed', () => {
      const cp = 'A';
      const query = AvailabilityQuery.from({ flow: 'EXR', component: cp });
      query.should.have.property('component').that.equals(cp);
    });

    it('throws an exception if the component id is invalid', () => {
      let test = () => AvailabilityQuery.from({ flow: 'EXR', component: ' ' });
      should.Throw(test, Error, 'Not a valid availability query');

      test = () => AvailabilityQuery.from({ flow: 'EXR', component: 'A*' });
      should.Throw(test, Error, 'Not a valid availability query');
    });
  });

  describe('when setting the processing mode', () => {
    it('a string representing the amount of details can be passed', () => {
      const mode = AvailabilityMode.AVAILABLE;
      const query = AvailabilityQuery.from({ flow: 'EXR', mode: mode });
      query.should.have.property('mode').that.equals(mode);
    });

    it('throws an exception if the value for mode is unknown', () => {
      const test = () => AvailabilityQuery.from({ flow: 'EXR', mode: 'test' });
      should.Throw(test, Error, 'Not a valid availability query');
    });
  });

  describe('when setting the references', () => {
    it('a string representing the references to be resolved can be passed', () => {
      const refs = AvailabilityReferences.CONCEPT_SCHEME;
      const query = AvailabilityQuery.from({ flow: 'EXR', references: refs });
      query.should.have.property('references').that.equals(refs);
    });

    it('throws an exception if the value for references is unknown', () => {
      const test = () =>
        AvailabilityQuery.from({ flow: 'dataflow', references: 'ref' });
      should.Throw(test, Error, 'Not a valid availability query');
    });
  });
});
