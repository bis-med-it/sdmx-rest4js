import chai from 'chai';
import { SchemaFormat } from '../../src/schema/schema-format';

chai.should();

describe('Schema formats', () => {

  const expectedFormats = [
    'application/vnd.sdmx.schema+json;version=2.0.0',
    'application/vnd.sdmx.schema+xml;version=3.0.0',
    'application/vnd.sdmx.structure+xml;version=3.0.0',
    'application/vnd.sdmx.structure+json;version=2.0.0',
    'application/vnd.sdmx.schema+xml;version=2.1',
    'application/vnd.sdmx.structure+xml;version=2.1',
    'application/vnd.sdmx.structure+json;version=1.0.0',
    'application/xml',
  ];

  it('contains all the expected formats and only those', () => {
    let count = 0;
    for (const [, value] of Object.entries(SchemaFormat)) {
      expectedFormats.should.contain(value);
      count++;
    }
    count.should.equal(expectedFormats.length + 2); // Shortcut for latests
  });

  it('is immutable', () => {
    SchemaFormat.should.be.frozen;
  });
});
