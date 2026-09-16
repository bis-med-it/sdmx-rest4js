import { AvailabilityQueryHandler } from '../utils/url-generator-availability';
import { AvailabilityQuery2Handler } from '../utils/url-generator-availability2';
import { SchemaQueryHandler } from '../utils/url-generator-schema';
import { DataQueryHandler } from '../utils/url-generator-data';
import { DataQuery2Handler } from '../utils/url-generator-data2';
import { MetadataQueryHandler } from '../utils/url-generator-metadata';
import type { ServiceInfo } from '../service/service';
import type { DataQueryValue } from '../data/data-query';
import type { DataQuery2Value } from '../data/data-query2';
import type { MetadataQueryValue } from '../metadata/metadata-query';
import type { AvailabilityQueryValue } from '../avail/availability-query';
import type { AvailabilityQuery2Value } from '../avail/availability-query2';
import type { SchemaQueryValue } from '../schema/schema-query';

type SupportedQuery =
  | DataQueryValue
  | DataQuery2Value
  | MetadataQueryValue
  | AvailabilityQueryValue
  | AvailabilityQuery2Value
  | SchemaQueryValue;

const hasProp = <K extends PropertyKey>(
  value: unknown,
  key: K,
): value is Record<K, unknown> =>
  typeof value === 'object' && value != null && key in value;

const isServiceInfo = (input: unknown): input is ServiceInfo =>
  hasProp(input, 'url') &&
  typeof input.url === 'string' &&
  hasProp(input, 'api') &&
  typeof input.api === 'string';

const isDataQuery2 = (query: SupportedQuery): query is DataQuery2Value =>
  hasProp(query, 'context') && hasProp(query, 'attributes');

const isAvailabilityQuery2 = (
  query: SupportedQuery,
): query is AvailabilityQuery2Value =>
  hasProp(query, 'context') && hasProp(query, 'mode');

const isAvailabilityQuery = (
  query: SupportedQuery,
): query is AvailabilityQueryValue => hasProp(query, 'mode');

const isDataQuery = (query: SupportedQuery): query is DataQueryValue =>
  hasProp(query, 'flow');

const isMetadataQuery = (query: SupportedQuery): query is MetadataQueryValue =>
  hasProp(query, 'resource');

const isSchemaQuery = (query: SupportedQuery): query is SchemaQueryValue =>
  hasProp(query, 'context');

class Generator {
  private readonly dataHandler = new DataQueryHandler();

  private readonly data2Handler = new DataQuery2Handler();

  private readonly metadataHandler = new MetadataQueryHandler();

  private readonly availabilityHandler = new AvailabilityQueryHandler();

  private readonly availability2Handler = new AvailabilityQuery2Handler();

  private readonly schemaHandler = new SchemaQueryHandler();

  getUrl(query: unknown, service: unknown, skipDefaults?: boolean): string {
    if (!query) {
      throw ReferenceError('A valid query must be supplied');
    }
    if (!isServiceInfo(service)) {
      throw ReferenceError(`${service} is not a valid service`);
    }
    const q = query as SupportedQuery;

    if (isDataQuery2(q)) {
      return this.data2Handler.handle(q, service, skipDefaults);
    } else if (isAvailabilityQuery2(q)) {
      return this.availability2Handler.handle(q, service, skipDefaults);
    } else if (isAvailabilityQuery(q)) {
      return this.availabilityHandler.handle(q, service, skipDefaults);
    } else if (isDataQuery(q)) {
      return this.dataHandler.handle(q, service, skipDefaults);
    } else if (isMetadataQuery(q)) {
      return this.metadataHandler.handle(q, service, skipDefaults);
    } else if (isSchemaQuery(q)) {
      return this.schemaHandler.handle(q, service, skipDefaults);
    } else {
      throw TypeError(`${query} is not a valid query`);
    }
  }
}

export { Generator as UrlGenerator };
