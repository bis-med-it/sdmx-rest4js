{ApiVersion} = require '../utils/api-version'
{AvailabilityQueryHandler} = require '../utils/url-generator-availability'
{AvailabilityQuery2Handler} = require '../utils/url-generator-availability2'
{SchemaQueryHandler} = require '../utils/url-generator-schema'
{DataQueryHandler} = require '../utils/url-generator-data'
{DataQuery2Handler} = require '../utils/url-generator-data2'
{MetadataQueryHandler} = require '../utils/url-generator-metadata'

generator = class Generator

  getUrl: (@query, @service, skipDefaults) ->
    throw ReferenceError "A valid query must be supplied" unless @query
    throw ReferenceError "#{@service} is not a valid service"\
      unless @service and @service.url
    if @query.context? and @query.attributes?
      new DataQuery2Handler().handle(@query, @service, skipDefaults)
    else if @query.context? and @query.mode?
      new AvailabilityQuery2Handler().handle(@query, @service, skipDefaults)
    else if @query.mode?
      new AvailabilityQueryHandler().handle(@query, @service, skipDefaults)
    else if @query.flow?
      new DataQueryHandler().handle(@query, @service, skipDefaults)
    else if @query.resource?
      new MetadataQueryHandler().handle(@query, @service, skipDefaults)
    else if @query.context?
      new SchemaQueryHandler().handle(@query, @service, skipDefaults)
    else
      throw TypeError "#{@query} is not a valid query"

exports.UrlGenerator = generator
