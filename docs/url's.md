# URLs

## `getUrl(Query, Service)`

### Overview

This function translates a query against the selected service into a URL. This is useful in case you want to execute the query using a library like, say, jQuery.

It takes 3 parameters:

- `query` - the SDMX query
- `service` - the targeted [service](/docs/services.md)
- `skipDefaults` - whether to skip default values. This function creates URLs with default values for unset query parameters, unless skipDefaults is set to `true`.

### Examples

Get the URL representing the query to be executed against the selected service:

```javascript
sdmxrest.getUrl({ flow: "EXR", key: "A.CHF.EUR.SP00.A" }, "ECB");
```

### Error handling

The function throws an error when the query and/or the service are invalid.
