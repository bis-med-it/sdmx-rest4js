{SchemaContext} = require './schema-context'
{NestedNCNameIDType, IDType, SingleVersionType, NCNameIDType} =
  require '../utils/sdmx-patterns'
{isValidEnum, isValidPattern, createErrorMessage} =
  require '../utils/validators'

defaults =
  version: 'latest'
  explicit: false

isValidExplicit = (input, errors) ->
  valid = typeof input is 'boolean'
  errors.push "#{input} is not a valid value for explicit. Must be true or \
  false" unless valid
  valid

ValidQuery =
  context: (q, i, e) -> isValidEnum(i, SchemaContext, 'context', e)
  agency: (q, i, e) -> isValidPattern(i, NestedNCNameIDType, 'agency', e)
  id: (q, i, e) -> isValidPattern(i, IDType, 'resource ids', e)
  version: (q, i, e) -> isValidPattern(i, SingleVersionType, 'versions', e)
  explicit: (q, i, e) -> isValidExplicit(i, e)
  obsDimension: (q, i, e) ->
    not i or isValidPattern(i, NCNameIDType, 'obs dimension', e)

isValidQuery = (query) ->
  errors = []
  isValid = false
  for own k, v of query
    isValid = ValidQuery[k](query, v, errors)
    break unless isValid
  {isValid: isValid, errors: errors}

# A query for XML schemas, as defined by the SDMX RESTful API.
query = class SchemaQuery

  @from: (opts) ->
    query =
      context: opts?.context
      agency: opts?.agency
      id: opts?.id
      version: opts?.version ? defaults.version
      explicit: opts?.explicit ? defaults.explicit
      obsDimension: opts?.obsDimension
    input = isValidQuery query
    throw Error createErrorMessage(input.errors, 'schema query') \
      unless input.isValid
    query

exports.SchemaQuery = query
