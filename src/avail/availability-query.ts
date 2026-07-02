{AvailabilityMode} = require './availability-mode'
{AvailabilityReferences} = require './availability-references'
{FlowRefType, SeriesKeyType, MultipleProviderRefType, NestedNCNameIDType} =
  require '../utils/sdmx-patterns'
{isValidEnum, isValidPattern, isValidPeriod, isValidDate, createErrorMessage} =
  require '../utils/validators'

defaults =
  key: 'all'
  provider: 'all'
  component: 'all'
  mode: AvailabilityMode.EXACT
  references: AvailabilityReferences.NONE

ValidQuery =
  flow: (i, e) -> isValidPattern(i, FlowRefType, 'flows', e)
  key: (i, e) -> isValidPattern(i, SeriesKeyType, 'series key', e)
  provider: (i, e) -> isValidPattern(i, MultipleProviderRefType, 'provider', e)
  component: (i, e) -> isValidPattern(i, NestedNCNameIDType, 'component', e)
  start: (i, e) -> not i or isValidPeriod(i, 'start period', e)
  end: (i, e) -> not i or isValidPeriod(i, 'end period', e)
  updatedAfter: (i, e) -> not i or isValidDate(i, 'updatedAfter', e)
  mode: (i, e) -> isValidEnum(i, AvailabilityMode, 'mode', e)
  references: (i, e) -> isValidEnum(i, AvailabilityReferences, 'references', e)

isValidQuery = (q) ->
  errors = []
  isValid = false
  for own k, v of q
    isValid = ValidQuery[k](v, errors)
    break unless isValid
  {isValid: isValid, errors: errors}

toKeyString = (dims) ->
  ((if Array.isArray d then d.join('+') else d ? '') for d in dims).join('.')

toProviderString = (p) -> p.join('+')

# A query for data availability, as defined by the SDMX RESTful API.
query = class AvailabilityQuery

  @from: (opts) ->
    key = opts?.key ? defaults.key
    key = toKeyString key if Array.isArray key
    pro = opts?.provider ? defaults.provider
    pro = toProviderString pro if Array.isArray pro
    query =
      flow: opts?.flow
      key: key
      provider: pro
      component: opts?.component ? defaults.component
      start: opts?.start
      end: opts?.end
      updatedAfter: opts?.updatedAfter
      mode: opts?.mode ? defaults.mode
      references: opts?.references ? defaults.references
    input = isValidQuery query
    throw Error createErrorMessage(input.errors, 'availability query') \
      unless input.isValid
    query

exports.AvailabilityQuery = query
