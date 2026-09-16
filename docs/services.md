# Services

## `getService(parameters)`

### Overview

This function creates a pointer to an SDMX REST service.

It takes either a `String` or an `Object` as parameter.

If it is a String, it must be the identifier of a predefined service (see the list [below](/docs/services.md#predefined-services)).

If it is an Object, the expected properties are:

- `url` - the entry point of the SDMX service
- `id` (optional) - an identifier for the service
- `name` (optional) - a label for the service
- `api` (optional) - the version of the SDMX API offered by the service (default: `latest`)

### Examples

Get a predefined service:

```javascript
sdmxrest.getService("ECB");
```

In case the desired service is not already predefined, an object describing that service can be used instead:

```javascript
sdmxrest.getService({ url: "http://ws-entry-point" });
```

### Error handling

The function throws an error when:

- The supplied string is not the ID of a predefined service
- Or the supplied object does not contain a valid url property.

## Predefined services

The library offers shortcuts to the following services:

| ID         | Provider                                                                                                   | Comment                                                                       |
| ---------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `BIS`      | [Bank for International Settlements](https://stats.bis.org/api-doc/)                                       |                                                                               |
| `ECB_S`    | [European Central Bank](https://sdw-wsrest.ecb.europa.eu/help/)                                            | Use `ECB` in case you don't need access over **https** (not recommended!)     |
| `EUROSTAT` | [European Statistical Office (Eurostat)](http://ec.europa.eu/eurostat/web/sdmx-web-services/rest-sdmx-2.1) | This channel does _not_ support https.                                        |
| `OECD_S`   | [Organisation for Economic Co-operation and Development](https://data.oecd.org/api/)                       | Use `OECD` in case you don't need access over **https** (not recommended!).   |
| `SDMXGR_S` | [SDMX Global Registry](https://registry.sdmx.org/)                                                         | Use `SDMXGR` in case you don't need access over **https** (not recommended!). |
| `UNICEF`   | [UNICEF](https://sdmx.data.unicef.org/webservice/data.html)                                                |                                                                               |
| `WB`       | [World Bank](https://wits.worldbank.org/)                                                                  |                                                                               |

You can get the list of supported services via the `services` array:

```javascript
sdmxrest.services;
```
