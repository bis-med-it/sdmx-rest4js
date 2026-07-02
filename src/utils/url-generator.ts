import { AvailabilityQueryHandler } from '../utils/url-generator-availability';
import { AvailabilityQuery2Handler } from
  '../utils/url-generator-availability2';
import { SchemaQueryHandler } from '../utils/url-generator-schema';
import { DataQueryHandler } from '../utils/url-generator-data';
import { DataQuery2Handler } from '../utils/url-generator-data2';
import { MetadataQueryHandler } from '../utils/url-generator-metadata';

class Generator {

  query: any;
  service: any;

  getUrl(query: any, service: any, skipDefaults?: boolean): string {
    this.query = query;
    this.service = service;
    if (!this.query) {
      throw ReferenceError('A valid query must be supplied');
    }
    if (!(this.service && this.service.url)) {
      throw ReferenceError(`${this.service} is not a valid service`);
    }
    if (this.query.context != null && this.query.attributes != null) {
      return new DataQuery2Handler()
        .handle(this.query, this.service, skipDefaults);
    } else if (this.query.context != null && this.query.mode != null) {
      return new AvailabilityQuery2Handler()
        .handle(this.query, this.service, skipDefaults);
    } else if (this.query.mode != null) {
      return new AvailabilityQueryHandler()
        .handle(this.query, this.service, skipDefaults);
    } else if (this.query.flow != null) {
      return new DataQueryHandler()
        .handle(this.query, this.service, skipDefaults);
    } else if (this.query.resource != null) {
      return new MetadataQueryHandler()
        .handle(this.query, this.service, skipDefaults);
    } else if (this.query.context != null) {
      return new SchemaQueryHandler()
        .handle(this.query, this.service, skipDefaults);
    } else {
      throw TypeError(`${this.query} is not a valid query`);
    }
  }
}

export { Generator as UrlGenerator };
