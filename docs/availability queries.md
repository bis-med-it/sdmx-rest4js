# Availability queries

## `getAvailabilityQuery(parameters)`

### Overview

This function allows to build an SDMX 2.1 availability query.

It takes an `Object` as parameter. The expected properties are:

- `flow` - the id of the dataflow for which data should be returned
- `key` (optional) - the "slices" of the cube to be returned, expressed as key (default: `all`)
- `provider` (optional) - the provider of the data (default: `all`)
- `component` (optional) - the id of the dimension for which to obtain availability information (default: `all`)
- `start` (optional) - the oldest period for which data should be returned
- `end` (optional) - the most recent period for which data should be returned
- `updatedAfter` (optional) - returns only what has changed since the supplied timestamp
- `mode` (optional) - the desired processing mode (default: `exact`)
- `references` (optional) - the references to be returned (default: `none`)

For more information about these parameters, check the [SDMX RESTful specification](https://github.com/sdmx-twg/sdmx-rest/).

### Examples

Create an availability query for the EXR dataflow:

```javascript
sdmxrest.getAvailabilityQuery({ flow: 'EXR' });
```

### Error handling

The function throws an error when:

- `flow` is missing
- a value not compliant with the SDMX specification is supplied for any of the properties

### Supported SDMX versions

The function generates queries that are compatible with both the SDMX 2.1 and the SDMX 3.0 specifications. However, if you want to use the new features added in SDMX 3.0, you should use `getAvailabilityQuery2` instead.

## `getAvailabilityQuery2(parameters)`

### Overview

This function allows to build an SDMX 3.0 availability query.

It takes an `Object` as parameter. The expected properties (all optional) are:

- `context` - An SDMX URN-like identifier for the context (default: `*=*:*(*)`)
- `key` - the "slices" of the cube to be returned, expressed as key (default: `*`)
- `component` - the id of the dimension for which to obtain availability information (default: `*`)
- `filters` - filters on component values
- `updatedAfter` - returns only what has changed since the supplied timestamp
- `mode` - the desired processing mode (default: `exact`)
- `references` - the references to be returned (default: `none`)

For more information about these parameters, check the [SDMX RESTful specification](https://github.com/sdmx-twg/sdmx-rest/).

### Examples

Create an availability query for any version of the CBS dataflow maintained by the BIS:

```javascript
sdmxrest.getAvailabilityQuery2({ context: 'dataflow=BIS:CBS(*)' });
```

Create an availability query for version 1.0 of the CBS dataflow maintained by the BIS. The data must be for Switzerland (CH), for any period greater or equal to 2022-01.

```javascript
sdmxrest.getAvailabilityQuery2({
  context: 'dataflow=BIS:CBS(1.0)',
  filters: ['L_REP_CTY=CH', 'TIME_PERIOD=ge:2022-01'],
});
```

### Error handling

The function throws an error when a value not compliant with the SDMX specification is supplied for any of the properties.

### Supported SDMX versions

The function generates queries that are compatible with the SDMX 3.0 specification only. As such, it should not be used against a service that only supports earlier versions of the SDMX specification.

## availability.AvailabilityMode

The allowed values for the `mode` property.

```javascript
var mode = require('sdmx-rest').availability.AvailabilityMode;
sdmxrest.getAvailabilityQuery({ flow: 'EXR', mode: AvailabilityMode.EXACT });
```

You can also pass the desired value directly:

```javascript
var mode = require('sdmx-rest').availability.AvailabilityMode;
sdmxrest.getAvailabilityQuery({ flow: 'EXR', mode: 'exact' });
```

## availability.AvailabilityReferences

The allowed values for the `references` property.

```javascript
var mode = require('sdmx-rest').availability.AvailabilityReferences;
sdmxrest.getAvailabilityQuery({
  flow: 'EXR',
  references: AvailabilityReferences.CODELIST,
});
```

You can also pass the desired value directly:

```javascript
var mode = require('sdmx-rest').availability.AvailabilityReferences;
sdmxrest.getAvailabilityQuery({
  flow: 'EXR',
  references: 'codelist',
});
```
