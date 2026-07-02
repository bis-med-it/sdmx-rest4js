{ApiNumber, ApiVersion, getKeyFromVersion} = require '../utils/api-version'
{createEntryPoint, validateDataForV2, parseContext, parseFilter} =
  require '../utils/url-generator-common'

handlePathParams = (q) ->
  p = []
  c = parseContext q.context
  p.push q.component unless q.component is '*'
  p.push q.key if q.key isnt '*' or p.length
  p.push c[3] if c[3] isnt '*' or p.length
  p.push c[2] if c[2] isnt '*' or p.length
  p.push c[1] if c[1] isnt '*' or p.length
  p.push c[0] if c[0] isnt '*' or p.length
  if p.length then '/' + p.reverse().join('/') else ''

handleQueryParams = (q) ->
  p = []
  if q.filters
    for filter in q.filters
      f = parseFilter filter
      p.push "c[#{f[0]}]=#{f[1]}"
  p.push "updatedAfter=#{q.updatedAfter}" if q.updatedAfter
  p.push "mode=#{q.mode}" unless q.mode is 'exact'
  p.push "references=#{q.references}" unless q.references is 'none'
  if p.length > 0 then '?' + p.reduceRight (x, y) -> x + '&' + y else ''
  
createShortAvailabilityQuery = (q, s, api_number) ->
  validateDataForV2 q, s
  u = createEntryPoint s
  u += "availability"
  p = handlePathParams(q)
  u += p
  u += handleQueryParams(q)
  u

createAvailabilityQuery = (q, s, api_number) ->
  validateDataForV2 q, s
  url = createEntryPoint s
  fc = parseContext q.context
  url += "availability/#{fc[0]}/#{fc[1]}/#{fc[2]}/#{fc[3]}/"
  url += "#{q.key}/"
  url += "#{q.component}?"
  if q.filters
    for filter in q.filters
      f = parseFilter filter
      url += "c[#{f[0]}]=#{f[1]}&"
  url += "mode=#{q.mode}&references=#{q.references}"
  url += "&updatedAfter=#{q.updatedAfter}" if q.updatedAfter
  url

handler = class Handler

  handle: (q, s, skip) ->
    api = ApiNumber[getKeyFromVersion(s.api)]
    if api < ApiNumber.v2_0_0
      throw Error "SDMX 3.0 queries not allowed in #{s.api}"
    else if skip
      createShortAvailabilityQuery(q, s, api)
    else
      createAvailabilityQuery(q, s, api)

exports.AvailabilityQuery2Handler = handler
