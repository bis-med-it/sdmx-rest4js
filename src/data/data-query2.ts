{ContextRefType, Sdmx3SeriesKeyType, NCNameIDType, FiltersType} =
  require '../utils/sdmx-patterns'
{isValidPattern, isValidDate, createErrorMessage} =
  require '../utils/validators'

defaults =
  context: '*=*:*(*)'
  key: '*'
  history: false
  attributes: 'dsd'
  measures: 'all'
  filters: []

isValidHistory = (input, errors) ->
  valid = typeof input is 'boolean'
  errors.push "#{input} is not a valid value for history. Must be true or \
  false" unless valid
  valid

isValidNObs = (input, name, errors) ->
  valid = typeof input is 'number' and input > 0
  errors.push "#{input} is not a valid value for #{name}. Must be a positive \
  integer" unless valid
  valid

isValidComp = (input, name, errors) ->
  valid = true
  if input.indexOf(",") > -1
    for i in input.split ","
      r = isValidPattern(i, NCNameIDType, name, errors)
      valid = false unless r
  else
    r = isValidPattern(input, NCNameIDType, name, errors)
    valid = false unless r
  valid

isValidKey = (input, name, errors) ->
  valid = true
  if input.indexOf(",") > -1
    for i in input.split ","
      r = isValidPattern(i, Sdmx3SeriesKeyType, name, errors)
      valid = false unless r
  else
    r = isValidPattern(input, Sdmx3SeriesKeyType, name, errors)
    valid = false unless r
  valid

isValidFilters = (input, name, errors) ->
  valid = true
  for filter in input
    r = isValidPattern(filter, FiltersType, name, errors)
    valid = false unless r
  valid


ValidQuery =
  context: (i, e) -> isValidPattern(i, ContextRefType, 'context', e)
  key: (i, e) -> isValidKey(i, 'series key', e)
  updatedAfter: (i, e) -> not i or isValidDate(i, 'updatedAfter', e)
  firstNObs: (i, e) -> not i or isValidNObs(i, 'firstNObs', e)
  lastNObs: (i, e) -> not i or isValidNObs(i, 'lastNObs', e)
  obsDimension: (i, e) ->
    not i or isValidPattern(i, NCNameIDType, 'obs dimension', e)
  history: (i, e) -> isValidHistory(i, e)
  attributes: (i, e) -> isValidComp(i, 'attributes', e)
  measures: (i, e) -> isValidComp(i, 'measures', e)
  filters: (i, e) -> isValidFilters(i, 'filters', e)

isValidQuery = (q) ->
  errors = []
  isValid = false
  for own k, v of q
    isValid = ValidQuery[k](v, errors)
    break unless isValid
  {isValid: isValid, errors: errors}

expected = [
  "context"
  "key"
  "updatedAfter"
  "firstNObs"
  "lastNObs"
  "obsDimension"
  "history"
  "attributes"
  "measures"
  "filters"
]

# A query for data, as defined by the SDMX RESTful API.
query = class DataQuery

  @from: (opts) ->
    if opts
      for own k, v of opts
        throw Error createErrorMessage([], 'data query') \
        unless k in expected
    context = opts?.context ? defaults.context
    key = opts?.key ? defaults.key
    attrs = opts?.attributes ? defaults.attributes
    measures = opts?.measures ? defaults.measures
    filters = opts?.filters ? defaults.filters
    filters = [filters] if not Array.isArray filters
    query =
      context: context
      key: key
      updatedAfter: opts?.updatedAfter
      firstNObs: opts?.firstNObs
      lastNObs: opts?.lastNObs
      obsDimension: opts?.obsDimension
      history: opts?.history ? defaults.history
      attributes: attrs
      measures: measures
      filters: filters
    input = isValidQuery query
    throw Error createErrorMessage(input.errors, 'data query') \
      unless input.isValid
    query

exports.DataQuery2 = query
