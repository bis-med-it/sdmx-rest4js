{ApiNumber, ApiVersion, getKeyFromVersion} = require '../utils/api-version'
{createEntryPoint, validateDataForV2, parseFlow, checkMultipleItems} =
  require '../utils/url-generator-common'
{DataDetail} = require '../data/data-detail'

translateDetail = (detail) ->
  if detail == DataDetail.NO_DATA
    "attributes=dataset,series&measures=none"
  else if detail == DataDetail.DATA_ONLY
    "attributes=none&measures=all"
  else if detail == DataDetail.SERIES_KEYS_ONLY
    "attributes=none&measures=none"
  else
    "attributes=dsd&measures=all"

createV1DataUrl = (q, s, a) ->
  url = createEntryPoint s
  url += "data/#{q.flow}/#{q.key}/#{q.provider}?"
  if q.obsDimension
    url += "dimensionAtObservation=#{q.obsDimension}&"
  url += "detail=#{q.detail}"
  if a >= ApiNumber.v1_1_0
    url += "&includeHistory=#{q.history}"
  url += "&startPeriod=#{q.start}" if q.start
  url += "&endPeriod=#{q.end}" if q.end
  url += "&updatedAfter=#{q.updatedAfter}" if q.updatedAfter
  url += "&firstNObservations=#{q.firstNObs}" if q.firstNObs
  url += "&lastNObservations=#{q.lastNObs}" if q.lastNObs
  url

createV2DataUrl = (q, s) ->
  validateDataForV2 q, s
  url = createEntryPoint s
  fc = parseFlow q.flow
  url += "data/dataflow/#{fc[0]}/#{fc[1]}/#{fc[2]}/"
  url += if q.key == "all" then "*?" else "#{q.key}?"
  if q.obsDimension
    url += "dimensionAtObservation=#{q.obsDimension}&"
  url += translateDetail q.detail
  url += "&includeHistory=#{q.history}"
  url += "&updatedAfter=#{q.updatedAfter}" if q.updatedAfter
  url += "&firstNObservations=#{q.firstNObs}" if q.firstNObs
  url += "&lastNObservations=#{q.lastNObs}" if q.lastNObs
  url

createDataQuery = (q, s, a) ->
  if a < ApiNumber.v2_0_0
    createV1DataUrl q, s, a
  else
    createV2DataUrl q, s

handleDataPathParams = (q) ->
  path = []
  path.push q.provider unless q.provider is 'all'
  path.push q.key if q.key isnt 'all' or path.length
  if path.length then '/' + path.reverse().join('/') else ''

handleData2PathParams = (q) ->
  path = []
  path.push q.key if q.key isnt 'all' or path.length
  if path.length then '/' + path.reverse().join('/') else ''

hasHistory = (q, s, a) ->
  if (a >= ApiNumber.v1_1_0 and q.history) then true else false

handleDataQueryParams = (q, s, a) ->
  p = []
  p.push "dimensionAtObservation=#{q.obsDimension}" if q.obsDimension
  p.push "detail=#{q.detail}" unless q.detail is 'full'
  p.push "includeHistory=#{q.history}" if hasHistory(q, s, a)
  p.push "startPeriod=#{q.start}" if q.start
  p.push "endPeriod=#{q.end}" if q.end
  p.push "updatedAfter=#{q.updatedAfter}" if q.updatedAfter
  p.push "firstNObservations=#{q.firstNObs}" if q.firstNObs
  p.push "lastNObservations=#{q.lastNObs}" if q.lastNObs
  if p.length > 0 then '?' + p.reduceRight (x, y) -> x + '&' + y else ''

handleData2QueryParams = (q, s, a) ->
  p = []
  p.push "dimensionAtObservation=#{q.obsDimension}" if q.obsDimension
  p.push "#{translateDetail q.detail}" unless q.detail is 'full'
  p.push "includeHistory=#{q.history}" if hasHistory(q, s, a)
  p.push "updatedAfter=#{q.updatedAfter}" if q.updatedAfter
  p.push "firstNObservations=#{q.firstNObs}" if q.firstNObs
  p.push "lastNObservations=#{q.lastNObs}" if q.lastNObs
  if p.length > 0 then '?' + p.reduceRight (x, y) -> x + '&' + y else ''

createShortV1Url = (q, s, a) ->
  u = createEntryPoint s
  u += "data/#{q.flow}"
  u += handleDataPathParams(q)
  u += handleDataQueryParams(q, s, a)
  u

createShortV2Url = (q, s, a) ->
  validateDataForV2 q, s
  u = createEntryPoint s
  fc = parseFlow q.flow
  u += "data/dataflow/#{fc[0]}/#{fc[1]}"
  pp = handleData2PathParams(q)
  if fc[2] isnt "*" or pp isnt ''
    u += "/#{fc[2]}"
  u += pp
  u += handleData2QueryParams(q, s, a)
  u
 
createShortDataQuery = (q, s, a) ->
  if a < ApiNumber.v2_0_0
    createShortV1Url q, s, a
  else
    createShortV2Url q, s, a

handler = class Handler

  handle: (q, s, skip) ->
    api = ApiNumber[getKeyFromVersion(s.api)]
    checkMultipleItems(q.provider, s, 'providers', api)
    if skip
      createShortDataQuery(q, s, api)
    else
      createDataQuery(q, s, api)

exports.DataQueryHandler = handler
