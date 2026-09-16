# Metadata queries

## `getMetadataQuery(parameters)`

### Overview

This function allows to build an SDMX query for structural metadata.

It takes an `Object` as parameter. The expected properties are:

- `resource` - the type of structural metadata
- `agency` (optional) - the agency maintaining the metadata (default: `all`)
- `id` (optional) - the id of the metadata (default: `all`)
- `version` (optional) - the version of the metadata (default: `latest`)
- `item` (optional) - for item schemes query, the id of the item (default: `all`)
- `detail` (optional) - the desired amount of information (default: `full`)
- `references` (optional) - whether to return the artefacts referenced by, or that use, the selected metadata (default: `none`)

For more information about these parameters, check the [SDMX specification](https://github.com/sdmx-twg/sdmx-rest/).

### Examples

Create a query for all codelists maintained by the ECB:

```javascript
sdmxrest.getMetadataQuery({ resource: 'codelist', agency: 'ECB' });
```

Create a query for the BOP data structure maintained by the IMF. The codelists and concepts used in the data structure should also be returned:

```javascript
sdmxrest.getMetadataQuery({
  resource: 'datastructure',
  agency: 'IMF',
  id: 'BOP',
  references: 'descendants',
});
```

### Error handling

The function throws an error when:

- `resource` is missing
- one or more of the supplied values are not in line with the SDMX specification

### Supported SDMX versions

The function generates queries that are compatible with both the SDMX 2.1 and the SDMX 3.0 specifications.

## metadata.MetadataDetail

The allowed values for the `detail` property.

```javascript
var MetadataDetail = require('sdmx-rest').metadata.MetadataDetail;
sdmxrest.getMetadataQuery({
  resource: 'datastructure',
  agency: 'IMF',
  detail: MetadataDetail.ALL_STUBS,
});
```

You can also pass the desired value directly:

```javascript
sdmxrest.getMetadataQuery({
  resource: 'datastructure',
  agency: 'IMF',
  detail: 'allstubs',
});
```

## metadata.MetadataFormat

The list of media types for the SDMX structure formats.

```javascript
var MetadataFormat = require('sdmx-rest').metadata.MetadataFormat;
var requestOptions = {
  headers: { accept: MetadataFormat.SDMX_ML_2_1_STRUCTURE },
};
```

You can also pass the desired media type directly:

```javascript
var requestOptions = {
  headers: { accept: 'application/vnd.sdmx.structure+xml;version=2.1' },
};
```

## metadata.MetadataReferences

The allowed values for the `references` parameter.

```javascript
var MetadataReferences = require('sdmx-rest').metadata.MetadataReferences;
sdmxrest.getMetadataQuery({
  resource: 'codelist',
  id: 'CL_FREQ',
  references: MetadataReferences.PARENTS,
});
```

You can also pass the desired value directly:

```javascript
sdmxrest.getMetadataQuery({
  resource: 'codelist',
  id: 'CL_FREQ',
  references: 'parents',
});
```

## metadata.MetadataType

The allowed values for the `resource` parameter.

```javascript
var MetadataType = require('sdmx-rest').metadata.MetadataType;
sdmxrest.getMetadataQuery({ resource: MetadataType.CODELIST, id: 'CL_FREQ' });
```

You can also pass the desired resource directly:

```javascript
sdmxrest.getMetadataQuery({ resource: 'codelist', id: 'CL_FREQ' });
```
