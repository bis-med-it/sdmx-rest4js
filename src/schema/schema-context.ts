# The constraints to take into account when generating the schema
contexts =

  DATA_STRUCTURE: 'datastructure'
  METADATA_STRUCTURE: 'metadatastructure'
  DATAFLOW: 'dataflow'
  METADATA_FLOW: 'metadataflow'
  PROVISION_AGREEMENT: 'provisionagreement'
  METADATA_PROVISION_AGREEMENT: 'metadataprovisionagreement'

exports.SchemaContext = Object.freeze contexts
