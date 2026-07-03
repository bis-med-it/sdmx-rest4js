import chai from 'chai';

import { DataFormat } from '../../src/data/data-format';

chai.should();

describe('Data formats', () => {

  const expected = [
    'application/vnd.sdmx.genericdata+xml;version=2.1',
    'application/vnd.sdmx.structurespecificdata+xml;version=2.1',
    'application/vnd.sdmx.generictimeseriesdata+xml;version=2.1',
    'application/vnd.sdmx.structurespecifictimeseriesdata+xml;version=2.1',
    'application/vnd.sdmx.data+xml;version=3.0.0',
    'application/vnd.sdmx.data+json;version=1.0.0-wd',
    'application/vnd.sdmx.data+json;version=1.0.0-cts',
    'application/vnd.sdmx.data+json;version=1.0.0',
    'application/vnd.sdmx.data+json;version=2.0.0',
    'application/vnd.sdmx.data+csv;version=1.0.0',
    'application/vnd.sdmx.data+csv;version=2.0.0',
    'application/vnd.sdmx.data+csv;version=1.0.0;labels=both',
    'application/vnd.sdmx.data+csv;version=1.0.0;timeFormat=normalized',
    'application/vnd.sdmx.data+csv;version=1.0.0;labels=both;timeFormat=normalized',
  ];

  it('contains all the expected formats and only those', () => {
    let count = 0;
    for (const [, value] of Object.entries(DataFormat)) {
      expected.should.contain(value);
      count++;
    }
    count.should.equal(expected.length + 4); // 4 shortcuts to latest versions
  });

  it('is immutable', () => {
    DataFormat.should.be.frozen;
  });
});
