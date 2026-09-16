# Schema queries

## `getSchemaQuery(parameters)`

### Overview

This function creates an SDMX schema query.

It takes an `Object` as parameter. The expected properties are:

- `context` - the constraints to take into account when generating the schema
- `agency` - the maintenance agency
- `id` - the artefact id
- `version` (optional) - the artefact version (default: `latest`)
- `obsDimension` (optional) - the ID of the dimension attached at the observation level.
- _explicit_ (optional) - indicates whether observations are strongly typed (default: false). This is useful for cross-sectional data validation only.

For more information about these parameters, check the [SDMX specification](https://github.com/sdmx-twg/sdmx-rest/).

### Examples

Create a query to get the XML schema for the CBS dataflow maintained by the BIS:

```javascript
sdmxrest.getSchemaQuery({ context: "dataflow", agency: "BIS", id: "CBS" });
```

### Error handling

The function throws an error when:

- the mandatory properties are missing or
- one or more of the supplied values are not in line with the SDMX specification

### Supported SDMX versions

The function generates queries that are compatible with both the SDMX 2.1 and the SDMX 3.0 specifications.

## schema.SchemaContext

The allowed values for the context property.

```javascript
var context = require("sdmx-rest").schema.SchemaContext;
sdmxrest.getSchemaQuery({
  context: context.DATAFLOW,
  agency: "BIS",
  id: "CBS",
});
```

You can pass the value directly instead.

```javascript
var context = require("sdmx-rest").schema.SchemaContext;
sdmxrest.getSchemaQuery({
  context: "dataflow",
  agency: "BIS",
  id: "CBS",
});
```
