import { DataQuery } from './data/data-query';
import { DataQuery2 } from './data/data-query2';
import { DataFormat } from './data/data-format';
import { DataDetail } from './data/data-detail';
import { MetadataQuery } from './metadata/metadata-query';
import { MetadataFormat } from './metadata/metadata-format';
import { MetadataDetail } from './metadata/metadata-detail';
import { MetadataReferences } from './metadata/metadata-references';
import { MetadataType } from './metadata/metadata-type';
import { AvailabilityQuery } from './avail/availability-query';
import { AvailabilityQuery2 } from './avail/availability-query2';
import { AvailabilityMode } from './avail/availability-mode';
import { AvailabilityReferences } from './avail/availability-references';
import { SchemaQuery } from './schema/schema-query';
import { SchemaContext } from './schema/schema-context';
import { SchemaFormat } from './schema/schema-format';
import { Service, services } from './service/service';
import { UrlGenerator } from './utils/url-generator';
import { ApiVersion, ApiResources } from './utils/api-version';
import * as SdmxPatterns from './utils/sdmx-patterns';
import { polyfill } from 'es6-promise';
import 'isomorphic-fetch';

polyfill();

const userAgent = 'sdmx-rest4js (https://github.com/sosna/sdmx-rest4js)';

const checkStatus = (query: any, response: any): void => {
  if (!response) {
    throw ReferenceError('Not a valid response');
  }
  const code = response.status;
  if (!((100 <= code && code < 400) || (code === 404 && query.updatedAfter))) {
    throw RangeError(`Request failed with error code ${code}`);
  }
};

const isFormat = (input: any, expected: { [key: string]: string }): boolean => {
  let out = false;
  for (const v of Object.values(expected)) {
    if (v === input) {
      out = true;
    }
  }
  return out;
};

const isDataFormat = (format: any): boolean => isFormat(format, DataFormat);

const isMetadataFormat = (format: any): boolean =>
  isFormat(format, MetadataFormat);

const isSchemaFormat = (format: any): boolean => isFormat(format, SchemaFormat);

const isGenericFormat = (format: any): boolean => {
  const formats = [
    'application/xml',
    'application/json',
    'text/csv',
    'text/xml',
  ];
  return formats.indexOf(format) > -1;
};

const isRequestedFormat = (requested: string, received: string): boolean =>
  requested.indexOf(received) > -1;

const checkMediaType = (requested: string, response: any): void => {
  let fmt = response.headers.get('content-type');
  fmt = fmt ? fmt.replace(/; version=/, ';version=') : fmt;
  if (!(
    isDataFormat(fmt) ||
    isMetadataFormat(fmt) ||
    isGenericFormat(fmt) ||
    isSchemaFormat(fmt)
  )) {
    throw RangeError(`Not an SDMX format: ${fmt}`);
  }
  if (!isRequestedFormat(requested, fmt)) {
    throw RangeError(`Wrong format: requested ${requested} but got ${fmt}`);
  }
};

const addHeaders = (opts: any, s: any, type: string): any => {
  if (opts == null) {
    opts = {};
  }
  const headers: { [key: string]: string } = {};
  for (const key of Object.keys(opts.headers ?? {})) {
    headers[key.toLowerCase()] = opts.headers[key];
  }
  if (!headers.accept) {
    switch (type) {
      case 'data':
        headers.accept = s.format;
        break;
      case 'structure':
        headers.accept = s.structureFormat;
        break;
      case 'schema':
        headers.accept = s.schemaFormat;
        break;
    }
  }
  if (!headers.accept) {
    headers.accept = '*/*';
  }
  if (!headers['user-agent']) {
    headers['user-agent'] = userAgent;
  }
  opts.headers = headers;
  return opts;
};

const guessService = (u: string): any => {
  const s = [];
  for (const k of Object.keys(Service)) {
    if (u.indexOf((Service as any)[k].url) > -1) {
      s.push((Service as any)[k]);
    }
  }
  return s[0] ?? {};
};

//
// Get an SDMX 2.1 RESTful web service against which queries can be executed.
//
// This library offers a few predefined services, which you can access using
// the service identifier.
//
// @example Get a predefined service
//   sdmxrest.getService('ECB')
//
// In case the service to be accessed is not yet predefined, an object with the
// information necessary to create the service can be passed as parameter.
//
// @example Create a service
//   sdmxrest.getService({url: 'http://ws-entry-point'})
//
// The expected properties for the object are:
// - *url* - the entry point of the SDMX 2.1 RESTful web service
// - *api* (optional) - the version of the SDMX 2.1 RESTful API supported by
//   the service. If not supplied, it will default to the most recent version
//   of the SDMX RESTful API
// - *id* (optional) - an identifier for the web service
// - *name* (optional) - a label for the web service
//
// @param [Object|String] input the ID of a predefined service or an object
//   with the information about the service to be instantiated
//
// @throw an error in case a) a string is supplied and it is not the ID of a
// predefined service or b) an object is supplied and it does not contain a
// valid *url* property.
//
const getService = (input: any): any => {
  if (typeof input === 'string') {
    if (!(Service as any)[input]) {
      throw ReferenceError(
        `${input} is not in the list of predefined services`,
      );
    }
    return (Service as any)[input];
  } else if (
    input instanceof Object &&
    Object.prototype.toString.call(input) === '[object Object]'
  ) {
    return Service.from(input);
  } else {
    throw TypeError(`Invalid type of ${input}. Expected an object or a string`);
  }
};

//
// Get an SDMX 2.1 RESTful data query.
//
// The expected properties (and their default values) are:
// - *flow*: **Mandatory** - the id of the dataflow of the data to be returned
// - *key* (optional) - the key of the data to be returned (default: all)
// - *provider* (optional) - the provider of the data (default: all)
// - *start* (optional) - the start period for which data should be returned
// - *end* (optional) - the end period for which data should be returned
// - *updatedAfter* (optional) - instructs the service to return what has
//   changed since the supplied time stamp.
// - *firstNObs* (optional) - the number of observations to be returned,
//   starting from the first observation
// - *lastNObs* (optional) - the number of observations to be returned,
//   starting from the last observation
// - *obsDimension* (optional) - the ID of the dimension to be attached at the
//   observation level (default TIME_PERIOD).
// - *detail* (optional) - the desired amount of information to be returned
//   (default: full).
// - *history* (optional) - Whether previous versions of the data should be
//   returned (default: false).
//
// @example Create a query for all data belonging to the EXR dataflow
//   sdmxrest.getDataQuery({flow: 'EXR'})
//
// @example Create a query for EXR data, matching values A and Q for the 1st
// dimension, any value for the 2nd dimension, EUR, SP00 and A for the 3rd, 4th
// and 5th dimensions respectively
//   sdmxrest.getDataQuery({flow: 'EXR', key: 'A+Q..EUR.SP00.A'})
//
// @example Create a query for the last observation of the EXR data matching
//  the supplied key
//   sdmxrest.getDataQuery({flow: 'EXR', key: 'A.CHF.EUR.SP00.A', lastNObs: 1})
//
// @example Create a query to get what has changed for the matching data since
//   the supplied point in time
//   sdmxrest.getDataQuery({flow: 'EXR', key: 'A.NOK.EUR.SP00.A',
//     updatedAfter: '2016-03-17T14:38:00Z'})
//
// @param [Object] input an object with the desired filters for the query
//
// @throw an error in case a) the mandatory flow is not supplied or b) a value
// not compliant with the SDMX 2.1 RESTful specification is supplied for one of
// the properties.
//
const getDataQuery = (input: any): any => DataQuery.from(input);

//
// Get an SDMX 3.0 RESTful data query.
//
// The expected properties (and their default values) are:
// - *context* (optional) - the reference to the context (default: *=*:*(*)).
// - *key* (optional) - the key of the data to be returned (default: all).
// - *updatedAfter* (optional) - instructs the service to return what has
//   changed since the supplied time stamp.
// - *firstNObs* (optional) - the number of observations to be returned,
//   starting from the first observation.
// - *lastNObs* (optional) - the number of observations to be returned,
//   starting from the last observation.
// - *obsDimension* (optional) - the ID of the dimension to be attached at the
//   observation level (default TIME_PERIOD).
// - *history* (optional) - Whether previous versions of the data should be
//   returned (default: false).
// - *attributes* (optional) - The attributes to be returned (default: dsd).
// - *measures* (optional) - The measures to be returned (default: all).
// - *filters* (optional) - The component filters to be applied.
//
// @example Create a query for all data belonging to the CBS dataflow,
// maintained by the BIS
//   sdmxrest.getDataQuery({context: 'dataflow=BIS:EXR(*)'})
//
// @example Create a query for EXR data, matching values A for the 1st
// dimension, any value for the 2nd dimension, EUR, SP00 and A for the 3rd, 4th
// and 5th dimensions respectively
//   sdmxrest.getDataQuery({context: 'dataflow=*:EXR(*)', key: 'A..EUR.SP00.A'})
//
// @example Create a query for the last observation of the EXR data matching
//  the supplied key
//   sdmxrest.getDataQuery({context: 'dataflow=*:EXR(*)', key: 'A.*.EUR.SP00.A',
//     lastNObs: 1})
//
// @example Create a query to get what has changed for the EXR data since
//   the supplied point in time
//   sdmxrest.getDataQuery({context: 'dataflow=*:EXR(*)',
//     updatedAfter: '2016-03-17T14:38:00Z'})
//
// @param [Object] input an object with the desired filters for the query
//
// @throw an error in case a) the mandatory flow is not supplied or b) a value
// not compliant with the SDMX 2.1 RESTful specification is supplied for one of
// the properties.
//
const getDataQuery2 = (input: any): any => DataQuery2.from(input);

//
// Get an SDMX 2.1 RESTful metadata query.
//
// The expected properties (and their default values) are:
// - *resource*: **Mandatory** - the type of structural metadata to be returned
// - *agency* (optional) - the agency maintaining the metadata to be returned
//   (default: all)
// - *id* (optional) - the id of the metadata to be returned (default: all)
// - *version* (optional) - the version of the metadata to be returned
//   (default: latest)
// - *item* (optional) - for item schemes query, the id of the item to be
//   returned (default: all)
// - *detail* (optional) - the desired amount of information to be returned
//  (default: full)
// - *references* (optional) - whether to return the artefacts referenced by,
//   or that use, the metadata to be returned (default: none)
//
// @example Create a query for all codelists maintained by the ECB
//   sdmxrest.getMetadataQuery({resource: 'codelist', agency: 'ECB'})
//
// @example Create a query for the BOP data structure maintained by the IMF,
//   along with all the codelists and concepts used in the data structure
//   sdmxrest.getMetadataQuery({resource: 'datastructure', agency: 'IMF',
//     id: 'BOP', references: 'descendants'})
//
// @param [Object] input an object with the desired filters for the query
//
// @throw an error in case a) the mandatory resource is not supplied or
// b) a value not compliant with the SDMX 2.1 RESTful specification is supplied
// for one of the properties.
//
const getMetadataQuery = (input: any): any => MetadataQuery.from(input);

//
// Get an SDMX 2.1 RESTful availability query.
//
// The expected properties (and their default values) are:
// - *flow*: **Mandatory** - the id of the dataflow of the data to be returned
// - *key* (optional) - the key of the data to be returned (default: all)
// - *provider* (optional) - the provider of the data (default: all)
// - *component* (optional) - the id of the dimension for which to obtain
//   availability information (default: all)
// - *start* (optional) - the start period for which data should be returned
// - *end* (optional) - the end period for which data should be returned
// - *updatedAfter* (optional) - instructs the service to return what has
//   changed since the supplied time stamp.
// - *mode* (optional) - the possible processing modes (default: exact)
// - *references* (optional) - the references to be returned (default: none)
//
// @example Create an availability query for the EXR dataflow
//   sdmxrest.getAvailabilityQuery({flow: 'EXR'})
//
// @param [Object] input an object with the desired characteristics of the
//   query
//
// @throw an error in case a) the mandatory flow is not supplied or b) a value
// not compliant with the SDMX 2.1 RESTful specification is supplied for one of
// the properties.
//
const getAvailabilityQuery = (input: any): any => AvailabilityQuery.from(input);

//
// Get an SDMX 3.0 RESTful availability query.
//
// The expected properties (and their default values) are:
// - *context* (optional) - the reference to the context (default: *=*:*(*)).
// - *key* (optional) - the key of the data to be returned (default: all)
// - *component* (optional) - the id of the dimension for which to obtain
//   availability information (default: all)
// - *updatedAfter* (optional) - instructs the service to return what has
//   changed since the supplied time stamp.
// - *mode* (optional) - the possible processing modes (default: exact)
// - *references* (optional) - the references to be returned (default: none)
// - *filters* (optional) - The component filters to be applied.
//
// @example Create an availability query for the ECB EXR dataflow
//   sdmxrest.getAvailabilityQuery({context: 'dataflow=ECB:EXR(*)'})
//
// @param [Object] input an object with the desired characteristics of the
//   query
//
// @throw an error in case a) the mandatory flow is not supplied or b) a value
// not compliant with the SDMX 2.1 RESTful specification is supplied for one of
// the properties.
//
const getAvailabilityQuery2 = (input: any): any =>
  AvailabilityQuery2.from(input);

//
// Get an SDMX 2.1 RESTful schema query.
//
// The expected properties (and their default values) are:
// - *context*: **Mandatory** - the constraints that need to be taken into
//   account, when generating the schema
// - *agency*: **Mandatory** - the maintenance agency
// - *id*: **Mandatory** - the artefact id
// - *version* (optional) - the artefact version (default: latest)
// - *obsDimension* (optional) - the ID of the dimension to be attached at the
//   observation level.
// - *explicit* (optional) - For cross-sectional data validation, indicates
//   whether observations are strongly typed (default: false)
//
// @example Create a schema query for the CBS schema
//   sdmxrest.getSchemaQuery({context: 'dataflow', 'id': 'CBS', 'agency':
//     'BIS'})
//
// @param [Object] input an object with the desired characteristics of the
//   query
//
// @throw an error in case a) the mandatory properties are not supplied or
// b) a value not compliant with the SDMX 2.1 RESTful specification is supplied
// for one of the properties.
//
const getSchemaQuery = (input: any): any => SchemaQuery.from(input);

//
// Get the SDMX 2.1 RESTful URL representing the query to be executed against
// the supplied service.
//
// @example Get the URL representing the query to be executed against the
//   supplied service
//   sdmxrest.getUrl({flow: 'EXR', key: 'A.CHF.EUR.SP00.A'}, 'ECB')
//
// @param [Object] query the query to be executed
// @param [Object|String] service the service against which the query should be
//   executed
//
// @throw an error in case the query and/or the service are not valid.
//
// @see #getDataQuery
// @see #getMetadataQuery
// @see #getService
//
const getUrl = (query: any, service: any): string => {
  if (!service) {
    throw ReferenceError('Not a valid service');
  }
  if (!query) {
    throw ReferenceError('Not a valid query');
  }
  const s = getService(service);
  let q;
  if (query.resource != null) {
    q = getMetadataQuery(query);
  } else if (query.context != null && query.agency != null) {
    q = getSchemaQuery(query);
  } else if (
    query.flow != null &&
    (query.references != null || query.component != null || query.mode != null)
  ) {
    q = getAvailabilityQuery(query);
  } else if (
    query.references != null ||
    query.component != null ||
    query.mode != null
  ) {
    q = getAvailabilityQuery2(query);
  } else if (query.flow != null) {
    q = getDataQuery(query);
  } else if (
    query.context != null ||
    query.key != null ||
    query.filters != null ||
    query.firstNObs != null ||
    query.lastNObs != null ||
    query.obsDimension != null ||
    query.history != null ||
    query.attributes != null ||
    query.measures != null ||
    query.updatedAfter != null
  ) {
    q = getDataQuery2(query);
  }
  if (!q) {
    throw Error('Not a valid query');
  }
  return new UrlGenerator().getUrl(q, s);
};

//
// Executes the supplied query against the supplied service and returns a
// Promise.
//
// At the difference with the request() function, request2() will
// include the response headers and additional information such as the status.
//
// @see #request for additional information about the required parameters.
//
const request2 = (...params: any[]): Promise<any> => {
  const q = params[0];
  const s = typeof q === 'string' ? guessService(q) : getService(params[1]);
  const u = typeof q === 'string' ? q : getUrl(q, s);
  const o = typeof q === 'string' ? params[1] : params[2];
  const t =
    u.indexOf('/data/') > -1
      ? 'data'
      : u.indexOf('/schema/') > -1
        ? 'schema'
        : 'structure';

  const requestOptions = addHeaders(o, s, t);
  return fetch(u, requestOptions).then((response: any) => response);
};

//
// Executes the supplied query against the supplied service and returns a
// Promise.
//
// The returned Promise should be handled using the *then* and *catch* methods
// offered by a Promise.
//
// @example Executes the supplied query against the supplied service
//   sdmxrest.request({flow: 'EXR', key: 'A.CHF.EUR.SP00.A'}, 'ECB')
//     .then(function(data) {console.log(data);})
//     .catch(function(error) {console.log(error);});
//
// @example Executes the supplied query against the supplied service, asking
//   the service to return a compressed SDMX-JSON message.
//   sdmxrest.request({flow: 'EXR', key: 'A.CHF.EUR.SP00.A'}, 'ECB',
//     {headers: {accept: DataFormat.SDMX_JSON, accept-encoding: "gzip"}})
//     .then(function(data) {console.log(data);})
//     .catch(function(error) {console.log(error);});
//
// In case you already have an SDMX 2.1 RESTful query string, you can also use
// it with execute().
//
// @example Fetches the supplied URL
//   sdmxrest.request('http://sdw-wsrest.ecb.europa.eu/service/data/EXR')
//     .then(function(data) {console.log(data);})
//     .catch(function(error) {console.log(error);});
//
// @example Fetches the supplied URL, asking the service to return a compressed
// SDMX-JSON message
//   sdmxrest.request('http://sdw-wsrest.ecb.europa.eu/service/data/EXR',
//     {headers: {accept: DataFormat.SDMX_JSON, accept-encoding: "gzip"}})
//     .then(function(data) {console.log(data);})
//     .catch(function(error) {console.log(error);});
//
// @param [Object|String] query the query to be executed
// @param [Object|String] service the service against which the query should be
//   executed. This should not be set in case an SDMX 2.1 query string is
//   passed as 1st parameter
// @param [Object] opts additional options for the request. See the whatwg
//   fetch specification for additional information.
//
// @throw an error in case the query and/or the service are not valid.
//
// @see #getDataQuery
// @see #getMetadataQuery
// @see #getService
//
const request = (...params: any[]): Promise<any> =>
  request2(...params).then((response: any) => {
    checkStatus(params[0], response);
    return response.text();
  });

const sdmxrest = {
  getService,
  services,
  getDataQuery,
  getDataQuery2,
  getMetadataQuery,
  getAvailabilityQuery,
  getAvailabilityQuery2,
  getSchemaQuery,
  getUrl,
  request,
  request2,
  checkStatus,
  checkMediaType,
  data: {
    DataFormat,
    DataDetail,
  },
  metadata: {
    MetadataFormat,
    MetadataDetail,
    MetadataReferences,
    MetadataType,
  },
  availability: {
    AvailabilityMode,
    AvailabilityReferences,
  },
  utils: {
    ApiVersion,
    ApiResources,
    SdmxPatterns,
  },
  schema: {
    SchemaContext,
    SchemaFormat,
  },
};

export = sdmxrest;
