# Running queries

## `request(Query, Service, Options)` and `request2(Query, Service, Options)`

### Overview

These functions execute the supplied query against the selected service. They return a Promise. When using `request`, the promise returns the response body. `request2` returns the full HTTP response (i.e. with status, headers and the body) instead.

The methods accept a query, a service and HTTP options as parameters:

- `query` - the query to be executed
- `service` - the targeted [service](/docs/services.md)
- `options` (optional) - extra options for the request (cf. the [whatwg fetch specification](https://fetch.spec.whatwg.org/))

### Examples

Execute the supplied query against the selected service:

```javascript
sdmxrest
  .request({ flow: "EXR", key: "A.CHF.EUR.SP00.A" }, "ECB")
  .then(function (data) {
    console.log(data);
  })
  .catch(function (error) {
    console.log(error);
  });
```

When using request2, it is safer to check the response status first. The [fetch specification](https://github.com/JakeChampion/fetch#response-metadata) describes how to process responses. It offers properties (such as `status` and `headers`) and methods (such as `json()` or `text()`) to process the response.

```javascript
sdmxrest
  .request2({ flow: "EXR", key: "A.CHF.EUR.SP00.A" }, "ECB")
  .then(function (response) {
    return response.json();
  })
  .then(function (body) {
    console.log(body);
  })
  .catch(function (ex) {
    console.log("parsing failed", ex);
  });
```

Execute the supplied query against the selected service, with some extra HTTP headers:

```javascript
var DataFormat = require("sdmx-rest").data.DataFormat;
sdmxrest
  .request({ flow: "EXR", key: "A.CHF.EUR.SP00.A" }, "ECB", {
    headers: { accept: DataFormat.SDMX_JSON, "accept-encoding": "gzip" },
  })
  .then(function (data) {
    console.log(data);
  })
  .catch(function (error) {
    console.log(error);
  });
```

### Error handling

`request` throws an error when:

- the query and/or the service are invalid
- the supplied service returned an error

When using `request2`, it is up to the caller to check whether the request was successful.

## `request(Url, Options)` and `request2(Url, Options)`

### Overview

These functions execute the supplied URL and return a Promise. When using `request`, the promise returns the response body. `request2` returns the full HTTP response (i.e. with status, headers and the body) instead.

The methods accept a string representing a URL and HTTP options as parameters:

- `url` - a string representing a URL
- `options` (optional) - extra options for the request (cf. the [whatwg fetch specification](https://fetch.spec.whatwg.org/))

### Examples

Fetch the supplied URL:

```javascript
sdmxrest
  .request("http://sdw-wsrest.ecb.europa.eu/service/data/EXR/A.CHF.EUR.SP00.A")
  .then(function (data) {
    console.log(data);
  })
  .catch(function (error) {
    console.log(error);
  });
```

Fetch the supplied URL, asking the service to return a compressed SDMX-JSON message:

```javascript
var DataFormat = require("sdmx-rest").data.DataFormat;
sdmxrest.request("http://sdw-wsrest.ecb.europa.eu/service/data/EXR/A.CHF.EUR.SP00.A",
     {headers: {accept: DataFormat.SDMX_JSON, accept-encoding: "gzip"}})
     .then(function(data) {console.log(data);})
     .catch(function(error) {console.log(error);});
```

### Error handling

`request` throws when the service returned an error.

When using `request2`, it is up to the caller to check the response status.

## Should I use `request` or `request2`?

Still **undecided between `request` and `request2`**?

Use `request` if all you care about is the SDMX content of the message. The function extracts the content from the response and handles any error for you.

Use `request2` if you want to know more about the communication with the service (e.g. HTTP response headers, status, etc.).

## Can I check the status of a request when using `request2`?

With `request2`, it is up to the caller to check whether a request was successful. The function `checkStatus` performs (part of) these validity checks. The function may throw an exception and so it's good to finish the call with a `catch` block.

```javascript
var sdmxrest = require("sdmx-rest");
var query = sdmxrest.getDataQuery({ flow: "EXR", key: "A.CHF.EUR.SP00.A" });
sdmxrest
  .request2(query, "ECB")
  .then(function (response) {
    sdmxrest.checkStatus(query, response);
    return response.json();
  })
  .then(function (body) {
    console.log(body);
  })
  .catch(function (ex) {
    console.log("parsing failed", ex);
  });
```

## Can I check the returned format when using `request2`?

`checkMediaType` verifies that the response format is:

- One of the supported SDMX formats;
- In line with what was requested (via the HTTP Accept header).

```javascript
var sdmxrest = require("sdmx-rest");
var query = sdmxrest.getDataQuery({ flow: "EXR", key: "A.CHF.EUR.SP00.A" });
var fmt = "application/vnd.sdmx.genericdata+xml;version=2.1";
sdmxrest
  .request2(query, "ECB", { headers: { accept: fmt } })
  .then(function (response) {
    sdmxrest.checkMediaType(fmt, response);
    return response.text();
  })
  .then(function (body) {
    console.log(body);
  })
  .catch(function (ex) {
    console.log("parsing failed", ex);
  });
```
