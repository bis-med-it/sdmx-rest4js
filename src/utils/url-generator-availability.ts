{ApiNumber, ApiVersion, getKeyFromVersion} = require '../utils/api-version'
{createEntryPoint, validateDataForV2, parseFlow} =
  require '../utils/url-generator-common'

handleAvailabilityPathParams = (q) ->
  path = []
  path.push q.component unless q.component is 'all'
  path.push q.provider if q.provider isnt 'all' or path.length
  path.push q.key if q.key isnt 'all' or path.length
  if path.length then '/' + path.reverse().join('/') else ''

handleAvailabilityQueryParams = (q) ->
  p = []
  p.push "updatedAfter=#{q.updatedAfter}" if q.updatedAfter
  p.push "endPeriod=#{q.end}" if q.end
  p.push "startPeriod=#{q.start}" if q.start
  p.push "mode=#{q.mode}" unless q.mode is 'exact'
  p.push "references=#{q.references}" unless q.references is 'none'
  if p.length > 0 then '?' + p.reduceRight (x, y) -> x + '&' + y else ''

handleAvailabilityV2PathParams = (q) ->
  path = []
  path.push q.component unless q.component is 'all'
  k = if q.key is 'all' then '*' else q.key
  path.push k if k isnt '*' or path.length
  if path.length then '/' + path.reverse().join('/') else ''

handleAvailabilityV2QueryParams = (q) ->
  p = []
  p.push "updatedAfter=#{q.updatedAfter}" if q.updatedAfter
  p.push "mode=#{q.mode}" unless q.mode is 'exact'
  p.push "references=#{q.references}" unless q.references is 'none'
  if p.length > 0 then '?' + p.reduceRight (x, y) -> x + '&' + y else ''

createShortV1AvailUrl = (q, s) ->
  u = createEntryPoint s
  u += "availableconstraint/#{q.flow}"
  u += handleAvailabilityPathParams(q)
  u += handleAvailabilityQueryParams(q)
  u

createShortV2AvailUrl = (q, s) ->
  validateDataForV2 q, s
  u = createEntryPoint s
  u += "availability/dataflow/"
  fc = parseFlow q.flow
  u += "#{fc[0]}/#{fc[1]}"
  pp = handleAvailabilityV2PathParams(q)
  if fc[2] isnt "*" or pp isnt ""
    u += "/#{fc[2]}"
  u += pp
  u += handleAvailabilityV2QueryParams(q)
  u

createV1AvailUrl = (q, s) ->
  url = createEntryPoint s
  url += 'availableconstraint'
  url += "/#{q.flow}/#{q.key}/#{q.provider}/#{q.component}"
  url += "?mode=#{q.mode}&references=#{q.references}"
  url += "&startPeriod=#{q.start}" if q.start
  url += "&endPeriod=#{q.end}" if q.end
  url += "&updatedAfter=#{q.updatedAfter}" if q.updatedAfter
  url

createV2AvailUrl = (q, s) ->
  validateDataForV2 q, s
  url = createEntryPoint s
  url += 'availability'
  fc = parseFlow q.flow
  url += "/dataflow/#{fc[0]}/#{fc[1]}/#{fc[2]}/"
  url += if q.key == "all" then "*/" else "#{q.key}/"
  url += if q.component == "all" then "*" else "#{q.component}"
  url += "?mode=#{q.mode}&references=#{q.references}"
  url += "&updatedAfter=#{q.updatedAfter}" if q.updatedAfter
  url

createShortAvailabilityQuery = (q, s, api_number) ->
  if api_number < ApiNumber.v2_0_0
    createShortV1AvailUrl q, s
  else
    createShortV2AvailUrl q, s

createAvailabilityQuery = (q, s, api_number) ->
  if api_number < ApiNumber.v2_0_0
    createV1AvailUrl q, s
  else
    createV2AvailUrl q, s

handler = class Handler

  handle: (q, s, skip) ->
    api_number = ApiNumber[getKeyFromVersion(s.api)]
    if api_number < ApiNumber.v1_3_0
      throw Error "Availability query not supported in #{s.api}"
    else if skip
      createShortAvailabilityQuery(q, s, api_number)
    else
      createAvailabilityQuery(q, s, api_number)

exports.AvailabilityQueryHandler = handler
