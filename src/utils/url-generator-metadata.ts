{ApiResources, ApiVersion, ApiNumber, getKeyFromVersion} =
  require '../utils/api-version'
{createEntryPoint, checkMultipleItems} =
  require '../utils/url-generator-common'
{MetadataReferences, MetadataReferencesExcluded, MetadataReferencesSpecial} =
  require '../metadata/metadata-references'
{MetadataDetail} = require '../metadata/metadata-detail'
{VersionNumber} = require '../utils/sdmx-patterns'
{isItemScheme} = require '../metadata/metadata-type'

itemAllowed = (r, a) ->
  a > ApiNumber.v1_0_2 and
  ((r isnt 'hierarchicalcodelist' and isItemScheme(r)) or
  (a > ApiNumber.v1_1_0 and r is 'hierarchicalcodelist'))

toApiKeywords = (q, s, value, isVersion = false) ->
  v = value
  if s.api is ApiVersion.v2_0_0 and v is "all"
    v = "*"
  else if s.api isnt ApiVersion.v2_0_0 and v is "*"
    v = "all"
  else if s.api is ApiVersion.v2_0_0 and v is "latest"
    v = "~"
  else if s.api is ApiVersion.v2_0_0 and not isVersion and v.indexOf("\+") > -1
    v = v.replace /\+/, ","
  else if s.api isnt ApiVersion.v2_0_0 and v.indexOf(",") > -1
    v = v.replace /,/, "+"
  v

createMetadataQuery = (q, s, a) ->
  url = createEntryPoint s
  url += "structure/" unless a < ApiNumber.v2_0_0
  res = toApiKeywords q, s, q.resource
  agency = toApiKeywords q, s, q.agency
  id = toApiKeywords q, s, q.id
  item = toApiKeywords q, s, q.item
  v = if s.api is ApiVersion.v2_0_0 and q.version is "latest"\
  then "~" else q.version
  url += "#{res}/#{agency}/#{id}/#{v}"
  url += "/#{item}" if itemAllowed(q.resource, a)
  url += "?detail=#{q.detail}&references=#{q.references}"
  url

handleMetaPathParams = (q, s, u, a) ->
  path = []
  if q.item isnt 'all' and q.item isnt '*' and itemAllowed(q.resource, a)\
  then path.push toApiKeywords q, s, q.item
  if (q.version isnt 'latest' and q.version isnt '~') or path.length\
  then path.push toApiKeywords q, s, q.version, true
  if (q.id isnt 'all' and q.id isnt '*') or path.length
  then path.push toApiKeywords q, s, q.id
  if (q.agency isnt 'all' and q.agency isnt '*') or path.length
  then path.push toApiKeywords q, s, q.agency
  if path.length then u = u + '/' + path.reverse().join('/')
  u

handleMetaQueryParams = (q, u, hd, hr) ->
  if hd or hr then u += '?'
  if hd then u += "detail=#{q.detail}"
  if hd and hr then u += '&'
  if hr then u += "references=#{q.references}"
  u

createShortMetadataQuery = (q, s, a) ->
  u = createEntryPoint s
  u += "structure/" unless a < ApiNumber.v2_0_0
  r = toApiKeywords q, s, q.resource
  u += "#{r}"
  u = handleMetaPathParams(q, s, u, a)
  u = handleMetaQueryParams(
    q, u, q.detail isnt MetadataDetail.FULL,
    q.references isnt MetadataReferences.NONE
  )
  u

checkVersionWithAll = (q, s, v, a) ->
  if a < ApiNumber.v2_0_0
    throw Error "Semantic versioning not allowed in #{s.api}" \
      unless v is 'latest' or v is 'all' or v.match VersionNumber

checkMultipleVersions = (q, s, a) ->
  v = q.version
  if v.indexOf("\+") > -1
    for i in v.split "+"
      checkVersionWithAll q, s, i, a
  else if v.indexOf(",") > -1
    for i in v.split ","
      checkVersionWithAll q, s, i, a
  else
    checkVersionWithAll q, s, v, a

checkApiVersion = (q, s, a) ->
  checkMultipleItems q.agency, s, 'agencies', a
  checkMultipleItems q.id, s, 'IDs', a
  checkMultipleItems q.version, s, 'versions', a
  checkMultipleItems q.item, s, 'items', a
  checkMultipleVersions q, s, a

checkDetail = (q, s, a) ->
  if (a < ApiNumber.v1_3_0 and (q.detail is 'referencepartial' or
  q.detail is 'allcompletestubs' or q.detail is 'referencecompletestubs'))
    throw Error "#{q.detail} not allowed in #{s.api}"

  if (a < ApiNumber.v2_0_0 and q.detail is 'raw')
    throw Error "raw not allowed in #{s.api}"

checkResource = (q, s, r) ->
  api = s.api.replace /\./g, '_'
  throw Error "#{r} not allowed in #{s.api}" unless r in ApiResources[api] \
  or (s.api is ApiVersion.v2_0_0  and r is "*")

checkResources = (q, s, a) ->
  r = q.resource
  if a < ApiNumber.v2_0_0
    checkResource q, s, r
  else if r.indexOf("\+") > -1
    for i in r.split "+"
      checkResource q, s, i
  else if r.indexOf(",") > -1
    for i in r.split ","
      checkResource q, s, i
  else
    checkResource q, s, r

checkReferences = (q, s, a) ->
  api = s.api.replace /\./g, '_'
  throw Error "#{q.references} not allowed as reference in #{s.api}" \
    unless (q.references in ApiResources[api] or \
            q.references in Object.values MetadataReferencesSpecial) and \
            q.references not in MetadataReferencesExcluded
  
  if (a < ApiNumber.v2_0_0 and q.references is 'ancestors')
    throw Error "ancestors not allowed as reference in #{s.api}"

handler = class Handler

  handle: (q, s, skip) ->
    a = ApiNumber[getKeyFromVersion(s.api)]
    checkApiVersion(q, s, a)
    checkDetail(q, s, a)
    checkResources(q, s, a)
    checkReferences(q, s, a) if q.references
    if skip
      createShortMetadataQuery(q, s, a)
    else
      createMetadataQuery(q, s, a)

exports.MetadataQueryHandler = handler
