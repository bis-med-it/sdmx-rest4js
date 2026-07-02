{ApiResources, ApiVersion} = require '../utils/api-version'
{createEntryPoint, checkVersion} = require '../utils/url-generator-common'

createSchemaQuery = (q, s) ->
  u = createEntryPoint s
  v = if s.api is ApiVersion.v2_0_0 and q.version is "latest" then "~"\
  else q.version
  u += "schema/#{q.context}/#{q.agency}/#{q.id}/#{v}"
  if s.api is ApiVersion.v2_0_0
    u += "?dimensionAtObservation=#{q.obsDimension}" if q.obsDimension
  else
    u += "?explicitMeasure=#{q.explicit}"
    u += "&dimensionAtObservation=#{q.obsDimension}" if q.obsDimension
  u

handleSchemaQueryParams = (q) ->
  p = []
  p.push "dimensionAtObservation=#{q.obsDimension}" if q.obsDimension
  p.push "explicitMeasure=#{q.explicit}" if q.explicit
  if p.length > 0 then '?' + p.reduceRight (x, y) -> x + '&' + y else ''

createShortSchemaQuery = (q, s) ->
  u = createEntryPoint s
  u += "schema/#{q.context}/#{q.agency}/#{q.id}"
  u += "/#{q.version}" unless q.version is 'latest' or q.version is '~'
  u += handleSchemaQueryParams(q)
  u

checkContext = (q, s) ->
  api = s.api.replace /\./g, '_'
  throw Error "#{q.context} not allowed in #{s.api}" \
    unless q.context in ApiResources[api]

checkExplicit = (q, s) ->
  if q.explicit and s and s.api and s.api is ApiVersion.v2_0_0
    throw Error "explicit parameter not allowed in #{s.api}"

handler = class Handler

  handle: (q, s, skip) ->
    checkContext(q, s)
    checkExplicit(q, s)
    checkVersion(q, s)
    if skip
      createShortSchemaQuery(q, s)
    else
      createSchemaQuery(q, s)

exports.SchemaQueryHandler = handler
