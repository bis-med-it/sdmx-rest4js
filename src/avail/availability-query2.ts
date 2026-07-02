{AvailabilityMode} = require './availability-mode'
{AvailabilityReferences} = require './availability-references'
{ContextRefType, Sdmx3SeriesKeyType, NestedNCNameIDType, FiltersType} =
  require '../utils/sdmx-patterns'
{isValidEnum, isValidPattern, isValidDate, createErrorMessage} =
  require '../utils/validators'

defaults =
  context: '*=*:*(*)'
  key: '*'
  component: '*'
  filters: []
  mode: AvailabilityMode.EXACT
  references: AvailabilityReferences.NONE

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

isValidComp = (input, name, errors) ->
  valid = true
  if input isnt '*'
    if input.indexOf(",") > -1
      for i in input.split ","
        r = isValidPattern(i, NestedNCNameIDType, name, errors)
        valid = false unless r
    else
      r = isValidPattern(input, NestedNCNameIDType, name, errors)
      valid = false unless r
  valid

ValidQuery =
  context: (i, e) -> isValidPattern(i, ContextRefType, 'context', e)
  key: (i, e) -> isValidKey(i, 'series key', e)
  component: (i, e) -> isValidComp(i, 'component', e)
  updatedAfter: (i, e) -> not i or isValidDate(i, 'updatedAfter', e)
  filters: (i, e) -> isValidFilters(i, 'filters', e)
  mode: (i, e) -> isValidEnum(i, AvailabilityMode, 'mode', e)
  references: (i, e) -> isValidEnum(i, AvailabilityReferences, 'references', e)

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
  "component"
  "updatedAfter"
  "filters"
  "mode"
  "references"
]

query = class AvailabilityQuery

  @from: (opts) ->
    if opts
      for own k, v of opts
        throw Error createErrorMessage([], 'availability query') \
        unless k in expected
    context = opts?.context ? defaults.context
    key = opts?.key ? defaults.key
    filters = opts?.filters ? defaults.filters
    filters = [filters] if not Array.isArray filters
    query =
      context: context
      key: key
      component: opts?.component ? defaults.component
      updatedAfter: opts?.updatedAfter
      filters: filters
      mode: opts?.mode ? defaults.mode
      references: opts?.references ? defaults.references
    input = isValidQuery query
    throw Error createErrorMessage(input.errors, 'availability query') \
      unless input.isValid
    query

exports.AvailabilityQuery2 = query
