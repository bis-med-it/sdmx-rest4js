# sdmx-rest4js

sdmx-rest4js allows to create and execute [SDMX REST queries](https://github.com/sdmx-twg/sdmx-rest) using JavaScript.

In a nutshell, you can:

- Create [data](data%20queries.md), [metadata](metadata%20queries.md), [availability](availability%20queries.md) and schema queries;
- Access various [SDMX web services](services.md), with the `getService` function;
- [Execute a query](running%20queries.md) against a web service, with the `request` function;
- Translate queries into [URLs](url's.md), with the `getUrl` function. This is handy, in case you want to execute the query using, say, jQuery;

This library is compliant with both SDMX 2.1 and SDMX 3.0.

For additional information, please check the other pages here.
