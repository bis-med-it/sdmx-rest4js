# sdmx-rest4js

[![current version](https://img.shields.io/npm/v/sdmx-rest.svg)](https://www.npmjs.com/package/sdmx-rest)
[![Mentioned in Awesome Official Statistics ](https://awesome.re/mentioned-badge.svg)](http://www.awesomeofficialstatistics.org)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This library allows to create and execute [SDMX REST queries](https://github.com/sdmx-twg/sdmx-rest) using JavaScript.

In a nutshell, you can:

- Create [data](https://github.com/sosna/sdmx-rest4js/wiki/Data-queries), [metadata](https://github.com/sosna/sdmx-rest4js/wiki/Metadata-queries), [availability](https://github.com/sosna/sdmx-rest4js/wiki/Other-queries) and [schema](https://github.com/sosna/sdmx-rest4js.wiki.git) queries;
- Access various [SDMX web services](https://github.com/sosna/sdmx-rest4js/wiki/Services), with the `getService` function;
- [Execute a query](https://github.com/sosna/sdmx-rest4js/wiki/Running-queries) against a web service, with the `request` function;
- Translate queries into [URLs](https://github.com/sosna/sdmx-rest4js/wiki/URLs), with the `getUrl` function. This is handy, in case you want to execute the query using, say, jQuery;

The example below shows how to execute a query against the ECB service, with the `request` function.

```JavaScript
var sdmxrest = require('sdmx-rest');

var query = {flow: 'EXR', key: 'A.CHF.EUR.SP00.A'};

sdmxrest.request(query, 'ECB') // ECB is one of the predefined services

  .then(function(data) {console.log(data)})
  .catch(function(error){console.log("something went wrong: " + error)});
```

This library is compliant with both SDMX 2.1 and SDMX 3.0.

For more information and examples, check the [Wiki](https://github.com/sosna/sdmx-rest4js/wiki).
