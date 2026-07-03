import chai from 'chai';

import { MetadataFormat } from '../../src/metadata/metadata-format';

chai.should();

describe('Metadata formats', () => {

  const expectedFormats = [
    'application/vnd.sdmx.structure+xml;version=2.1',
    'application/vnd.sdmx.structure+json;version=1.0.0',
    'application/vnd.sdmx.structure+xml;version=3.0.0',
    'application/vnd.sdmx.structure+json;version=2.0.0',
  ];

  it('contains all the expected formats and only those', () => {
    let count = 0;
    for (const [, value] of Object.entries(MetadataFormat)) {
      expectedFormats.should.contain(value);
      count++;
    }
    count.should.equal(expectedFormats.length + 1); // Shortcut for latest JSON
  });

  it('is immutable', () => {
    MetadataFormat.should.be.frozen;
  });
});
