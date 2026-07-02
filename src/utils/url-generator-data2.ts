{ApiNumber, ApiVersion, getKeyFromVersion} = require '../utils/api-version'
{createEntryPoint, validateDataForV2, parseContext, parseFilter} =
  require '../utils/url-generator-common'

createDataQuery = (q, s) ->
  validateDataForV2 q, s
  url = createEntryPoint s
  fc = parseContext q.context
  url += "data/#{fc[0]}/#{fc[1]}/#{fc[2]}/#{fc[3]}/"
  url += "#{q.key}?"
  if q.filters
    for filter in q.filters
      f = parseFilter filter
      url += "c[#{f[0]}]=#{f[1]}&"
  if q.obsDimension
    url += "dimensionAtObservation=#{q.obsDimension}&"
  url += "attributes=#{q.attributes}"
  url += "&measures=#{q.measures}"
  url += "&includeHistory=#{q.history}"
  url += "&updatedAfter=#{q.updatedAfter}" if q.updatedAfter
  url += "&firstNObservations=#{q.firstNObs}" if q.firstNObs
  url += "&lastNObservations=#{q.lastNObs}" if q.lastNObs
  url

handleDataPathParams = (q) ->
  p = []
  c = parseContext q.context
  p.push q.key if q.key isnt '*' or p.length
  p.push c[3] if c[3] isnt '*' or p.length
  p.push c[2] if c[2] isnt '*' or p.length
  p.push c[1] if c[1] isnt '*' or p.length
  p.push c[0] if c[0] isnt '*' or p.length
  if p.length then '/' + p.reverse().join('/') else ''

handleDataQueryParams = (q) ->
  p = []
  if q.filters
    for filter in q.filters
      f = parseFilter filter
      p.push "c[#{f[0]}]=#{f[1]}"
  p.push "dimensionAtObservation=#{q.obsDimension}" if q.obsDimension
  p.push "includeHistory=#{q.history}" if q.history
  p.push "attributes=#{q.attributes}" if q.attributes isnt 'dsd'
  p.push "measures=#{q.measures}" if q.measures isnt 'all'
  p.push "updatedAfter=#{q.updatedAfter}" if q.updatedAfter
  p.push "firstNObservations=#{q.firstNObs}" if q.firstNObs
  p.push "lastNObservations=#{q.lastNObs}" if q.lastNObs
  if p.length > 0 then '?' + p.reduceRight (x, y) -> x + '&' + y else ''

createShortDataQuery = (q, s) ->
  validateDataForV2 q, s
  u = createEntryPoint s
  u += 'data'
  p = handleDataPathParams(q)
  u += p
  u += handleDataQueryParams(q)
  u

handler = class Handler

  handle: (q, s, skip) ->
    api = ApiNumber[getKeyFromVersion(s.api)]
    if api < ApiNumber.v2_0_0
      throw Error "SDMX 3.0 queries not allowed in #{s.api}"
    else if skip
      createShortDataQuery(q, s)
    else
      createDataQuery(q, s)

exports.DataQuery2Handler = handler
