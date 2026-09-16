# Utils

## `utils.ApiVersion`

The various versions of the [SDMX API](https://github.com/sdmx-twg/sdmx-rest/releases).

```javascript
var ApiVersion = require("sdmx-rest").utils.ApiVersion;
var service = sdmxrest.getService({
  url: "http://ws-entry-point/",
  api: ApiVersion.v1_0_1,
});
```

If you prefer, you can pass the desired version directly:

```javascript
var ApiVersion = require("sdmx-rest").utils.ApiVersion;
var service = sdmxrest.getService({
  url: "http://ws-entry-point/",
  api: "v1.0.1",
});
```

## `utils.ApiResources`

The lists of valid resources for each version of the [SDMX API](https://github.com/sdmx-twg/sdmx-rest/releases).

```javascript
var ApiResources = require("sdmx-rest").utils.ApiResources;
var resources = ApiResources.v1_0_1;
```

## `utils.SdmxPatterns`

Various regular expressions defined in the [SDMX API](https://github.com/sdmx-twg/sdmx-rest/). They can be useful in case you need to validate some SDMX resources.

```javascript
var SdmxPatterns = require("sdmx-rest").utils.SdmxPatterns;
var id = "CL_FREQ";
console.log(SdmxPatterns.NCNameIDType.exec(id));
```
