# Data queries

## `getDataQuery(parameters)`

### Overview

This function allows to build an SDMX 2.1 data query.

It takes an `Object` as parameter and the expected properties are:

- `flow` - the id of the dataflow for which data should be returned
- `key` (optional) - the "slices" of the cube to be returned, expressed as key (default: `all`)
- `provider` (optional) - the provider of the data (default: `all`)
- `start` (optional) - the oldest period for which data should be returned
- `end` (optional) - the most recent period for which data should be returned
- `updatedAfter` (optional) - returns only what has changed since the supplied timestamp
- `firstNObs` (optional) - the number of observations to be returned, starting from the first observation
- `lastNObs` (optional) - the number of observations to be returned, starting from the last observation
- `obsDimension` (optional) - the dimension attached to the observations
- `detail` (optional) - the desired amount of information in the response (default: `full`)
- `history` (optional) - Include previous versions of the data (default: `false`)

For more information about these parameters, check the [SDMX specification](https://github.com/sdmx-twg/sdmx-rest/).

### Examples

Create a query for all data belonging to the EXR dataflow:

```javascript
sdmxrest.getDataQuery({ flow: 'EXR' });
```

Create a query for EXR data, matching values A and Q for the 1st dimension, any value for the 2nd dimension, EUR, SP00 and A for the 3rd, 4th and 5th dimensions respectively:

```javascript
sdmxrest.getDataQuery({ flow: 'EXR', key: 'A+Q..EUR.SP00.A' });
```

It's also possible to create the same query using arrays for the key. This is useful in case you want to pass the values from an HTML Select element for example:

```javascript
sdmxrest.getDataQuery({
  flow: 'EXR',
  key: [['A', 'Q'], '', 'EUR', 'SP00', 'A'],
});
```

Create a query for the last observation of the EXR data matching the supplied key:

```javascript
sdmxrest.getDataQuery({ flow: 'EXR', key: 'A.CHF.EUR.SP00.A', lastNObs: 1 });
```

Create a query to get what has changed for the matching data since the supplied time:

```javascript
sdmxrest.getDataQuery({
  flow: 'EXR',
  key: 'A.NOK.EUR.SP00.A',
  updatedAfter: '2016-03-17T14:38:00Z',
});
```

### Error handling

The function throws an error if:

- the mandatory flow is missing or
- a value not compliant with the SDMX specification is supplied for any of the properties

### Supported SDMX versions

The function generates queries that are compatible with both the SDMX 2.1 and the SDMX 3.0 specifications. However, if you want to use the new features added in SDMX 3.0, you should use `getDataQuery2` instead.

## `getDataQuery2(parameters)`

### Overview

This function allows to build an SDMX 3.0 data query.

It takes an `Object` as parameter. The expected properties (all optional) are:

- `context` - An SDMX URN-like identifier for the context (default: `*=*:*(*)`)
- `key` - the "slices" of the cube to be returned, expressed as key (default: `*`)
- `filters` - filters on component values
- `updatedAfter` - returns only what has changed since the supplied timestamp
- `firstNObs` - the number of observations to be returned, starting from the first observation
- `lastNObs` - the number of observations to be returned, starting from the last observation
- `obsDimension` - the dimension attached to the observations
- `attributes` - the attributes to be returned (default: `dsd`)
- `measures` - the measures to be returned (default: `all`)
- `history` - Include previous versions of the data (default: `false`)

For more information about these parameters, check the [SDMX specification](https://github.com/sdmx-twg/sdmx-rest/).

### Examples

Create a data query for any version of the CBS dataflow maintained by the BIS:

```javascript
sdmxrest.getDataQuery2({ context: 'dataflow=BIS:CBS(*)' });
```

Create a data query for version 1.0 of the CBS dataflow maintained by the BIS. The data must be for Switzerland (CH), for any period greater or equal to 2022-01.

```javascript
sdmxrest.getDataQuery2({
  context: 'dataflow=BIS:CBS(1.0)',
  filters: ['L_REP_CTY=CH', 'TIME_PERIOD=ge:2022-01'],
});
```

Create a query for EXR data, matching value A for the 1st dimension, any value for the 2nd dimension, EUR, SP00 and A for the 3rd, 4th and 5th dimensions respectively:

```javascript
sdmxrest.getDataQuery({
  context: 'dataflow=ECB:EXR(*)',
  key: 'A.*.EUR.SP00.A',
});
```

### Error handling

The function throws an error when a value not compliant with the SDMX specification is supplied for any of the properties.

### Supported SDMX versions

The function generates queries that are compatible with the SDMX 3.0 specification only. As such, it should not be used against a service that only supports earlier versions of the SDMX specification.

## data.DataDetail

The list of allowed values for the data detail property.

```javascript
var DataDetail = require('sdmx-rest').data.DataDetail;
sdmxrest.getDataQuery({ flow: 'EXR', detail: DataDetail.DATA_ONLY });
```

If you prefer, you can pass the desired value directly:

```javascript
sdmxrest.getDataQuery({ flow: 'EXR', detail: 'dataonly' });
```

## data.DataFormat

The list of media types of the various SDMX data formats.

```javascript
var DataFormat = require('sdmx-rest').data.DataFormat;
var requestOptions = { headers: { accept: DataFormat.SDMX_JSON } };
```

If you prefer, you can pass the desired media type directly:

```javascript
var requestOptions = {
  headers: { accept: 'application/vnd.sdmx.data+json;version=1.0.0-cts' },
};
```

Check the [SDMX specification](https://github.com/sdmx-twg/sdmx-rest/), for more information about the various SDMX media types.
