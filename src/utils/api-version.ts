# Lists the various versions of the SDMX RESTful API.
versions =

# The initial version of the SDMX RESTFul API, released in April 2011.
  v1_0_0: 'v1.0.0'

# The version of the SDMX RESTFul API, released in May 2012.
  v1_0_1: 'v1.0.1'

# The initial version of the SDMX RESTFul API, released in April 2013.
  v1_0_2: 'v1.0.2'

# The version of the SDMX RESTFul API released in September 2015. It adds
# the includeHistory query string parameter as well as the possibility to
# query for items within item schemes.
  v1_1_0: 'v1.1.0'

# The version of the SDMX RESTFul API released in May 2017. It adds supports
# for retrieving specific hierarchies in a hierarchical codelist.
  v1_2_0: 'v1.2.0'

# The version of the SDMX RESTFul API released in October 2018. It introduces
# the new valididty API, adds new resources, generalizes the use of the +
# operator, etc.
  v1_3_0: 'v1.3.0'

# The version of the SDMX RESTFul API released in June 2019. The release is
# a minor one, merely adding a dedicated media type for SDMX-JSON structure
# messages.
  v1_4_0: 'v1.4.0'

# The version of the SDMX RESTFul API released in September 2020. The release
# adds support for VTL artefacts and extends the list of supported media
# types for schema queries.
  v1_5_0: 'v1.5.0'

# The version of the SDMX RESTFul API released in October 2021. The release
# adds support for SDMX 3.0.
  v2_0_0: 'v2.0.0'

# A shortcut to the most recent version of the SDMX RESTful API
  LATEST: 'v2.0.0'

resourcesV1 = [
  'datastructure'
  'metadatastructure'
  'categoryscheme'
  'conceptscheme'
  'codelist'
  'hierarchicalcodelist'
  'organisationscheme'
  'agencyscheme'
  'dataproviderscheme'
  'dataconsumerscheme'
  'organisationunitscheme'
  'dataflow'
  'metadataflow'
  'reportingtaxonomy'
  'provisionagreement'
  'structureset'
  'process'
  'categorisation'
  'contentconstraint'
  'attachmentconstraint'
  'structure'
  'data'
  'metadata'
  'schema'
].sort()

resourcesV3 = ([
  'actualconstraint'
  'allowedconstraint'
  'availableconstraint'
].concat resourcesV1).sort()

resourcesV5 = ([
  'transformationscheme'
  'rulesetscheme'
  'userdefinedoperatorscheme'
  'customtypescheme'
  'namepersonalisationscheme'
  'namealiasscheme'
].concat resourcesV3).sort()

resourcesV6 = [
  'datastructure'
  'metadatastructure'
  'categoryscheme'
  'conceptscheme'
  'codelist'
  'hierarchy'
  'hierarchyassociation'
  'valuelist'
  'agencyscheme'
  'dataproviderscheme'
  'metadataproviderscheme'
  'dataconsumerscheme'
  'organisationunitscheme'
  'dataflow'
  'metadataflow'
  'reportingtaxonomy'
  'provisionagreement'
  'metadataprovisionagreement'
  'structuremap'
  'representationmap'
  'conceptschememap'
  'categoryschememap'
  'organisationschememap'
  'reportingtaxonomymap'
  'process'
  'categorisation'
  'dataconstraint'
  'metadataconstraint'
  'structure'
  'transformationscheme'
  'rulesetscheme'
  'userdefinedoperatorscheme'
  'customtypescheme'
  'namepersonalisationscheme'
  'vtlmappingscheme'
  'data'
  'schema'
  'metadata'
  'availability'
].sort()

resources =

# The set of valid resources for v1.0.0.
  v1_0_0: resourcesV1

# The set of valid resources for v1.0.1.
  v1_0_1: resourcesV1

# The set of valid resources for v1.0.2.
  v1_0_2: resourcesV1

# The set of valid resources for v1.1.0.
  v1_1_0: resourcesV1

# The set of valid resources for v1.2.0.
  v1_2_0: resourcesV1

# The set of valid resources for v1.3.0.
  v1_3_0: resourcesV3

# The set of valid resources for v1.4.0.
  v1_4_0: resourcesV3

# The set of valid resources for v1.5.0.
  v1_5_0: resourcesV5

# The set of valid resources for v2.0.0.
  v2_0_0: resourcesV6

# The set of valid resources for the latest API version.
  LATEST: resourcesV6

numbers =
  v1_0_0: 0
  v1_0_1: 1
  v1_0_2: 2
  v1_1_0: 3
  v1_2_0: 4
  v1_3_0: 5
  v1_4_0: 6
  v1_5_0: 7
  v2_0_0: 8

getKeyFromVersion = (v) ->
  v.replace /\./g, "_"

exports.ApiVersion = Object.freeze versions
exports.ApiResources = Object.freeze resources
exports.ApiNumber = Object.freeze numbers
exports.getKeyFromVersion = getKeyFromVersion
