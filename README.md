# sdmx-rest4js

[![current version](https://img.shields.io/npm/v/sdmx-rest.svg)](https://www.npmjs.com/package/sdmx-rest)
[![Mentioned in Awesome Official Statistics ](https://awesome.re/mentioned-badge.svg)](http://www.awesomeofficialstatistics.org)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This library allows to create and execute [SDMX REST queries](https://github.com/sdmx-twg/sdmx-rest) using JavaScript.

In a nutshell, you can:

- Create [data](/docs/data%20queries.md), [metadata](/docs/metadata%20queries.md), [availability](/docs/README.md) and [schema](/docs/README.md) queries;
- Access various [SDMX web services](/docs/services.md), with the `getService` function;
- [Execute a query](/docs/running%20queries.md) against a web service, with the `request` function;
- Translate queries into [URLs](/docs/url's.md), with the `getUrl` function. This is handy, in case you want to execute the query using, say, jQuery;

The example below shows how to execute a query against the ECB service, with the `request` function.

```JavaScript
var sdmxrest = require('sdmx-rest');

var query = {flow: 'EXR', key: 'A.CHF.EUR.SP00.A'};

sdmxrest.request(query, 'ECB') // ECB is one of the predefined services

  .then(function(data) {console.log(data)})
  .catch(function(error){console.log("something went wrong: " + error)});
```

This library is compliant with both SDMX 2.1 and SDMX 3.0.

For more information and examples, check the [Wiki](/docs/README.md).
