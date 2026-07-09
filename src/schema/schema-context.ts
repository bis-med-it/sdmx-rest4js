// The constraints to take into account when generating the schema
const contexts = {
  DATA_STRUCTURE: 'datastructure',
  METADATA_STRUCTURE: 'metadatastructure',
  DATAFLOW: 'dataflow',
  METADATA_FLOW: 'metadataflow',
  PROVISION_AGREEMENT: 'provisionagreement',
  METADATA_PROVISION_AGREEMENT: 'metadataprovisionagreement',
};

export const SchemaContext = Object.freeze(contexts);
