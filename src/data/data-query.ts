{DataDetail} = require './data-detail'
{FlowRefType, SeriesKeyType, MultipleProviderRefType, NCNameIDType} =
  require '../utils/sdmx-patterns'
{isValidEnum, isValidPattern, isValidPeriod, isValidDate, createErrorMessage} =
  require '../utils/validators'

defaults =
  key: 'all'
  provider: 'all'
  detail: DataDetail.FULL
  history: false

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

ValidQuery =
  flow: (i, e) -> isValidPattern(i, FlowRefType, 'flows', e)
  key: (i, e) -> isValidPattern(i, SeriesKeyType, 'series key', e)
  provider: (i, e) -> isValidPattern(i, MultipleProviderRefType, 'provider', e)
  start: (i, e) -> not i or isValidPeriod(i, 'start period', e)
  end: (i, e) -> not i or isValidPeriod(i, 'end period', e)
  updatedAfter: (i, e) -> not i or isValidDate(i, 'updatedAfter', e)
  firstNObs: (i, e) -> not i or isValidNObs(i, 'firstNObs', e)
  lastNObs: (i, e) -> not i or isValidNObs(i, 'lastNObs', e)
  obsDimension: (i, e) ->
    not i or isValidPattern(i, NCNameIDType, 'obs dimension', e)
  detail: (i, e) -> isValidEnum(i, DataDetail, 'details', e)
  history: (i, e) -> isValidHistory(i, e)

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

# A query for data, as defined by the SDMX RESTful API.
query = class DataQuery

  @from: (opts) ->
    key = opts?.key ? defaults.key
    key = toKeyString key if Array.isArray key
    pro = opts?.provider ? defaults.provider
    pro = toProviderString pro if Array.isArray pro
    query =
      flow: opts?.flow
      key: key
      provider: pro
      start: opts?.start
      end: opts?.end
      updatedAfter: opts?.updatedAfter
      firstNObs: opts?.firstNObs
      lastNObs: opts?.lastNObs
      obsDimension: opts?.obsDimension
      detail: opts?.detail ? defaults.detail
      history: opts?.history ? defaults.history
    input = isValidQuery query
    throw Error createErrorMessage(input.errors, 'data query') \
      unless input.isValid
    query

exports.DataQuery = query
