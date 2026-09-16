// The constraints to take into account when generating the schema
const contexts = Object.freeze({
  DATA_STRUCTURE: 'datastructure',
  METADATA_STRUCTURE: 'metadatastructure',
  DATAFLOW: 'dataflow',
  METADATA_FLOW: 'metadataflow',
  PROVISION_AGREEMENT: 'provisionagreement',
  METADATA_PROVISION_AGREEMENT: 'metadataprovisionagreement',
} as const);

export const SchemaContext = contexts;
export type SchemaContextValue = (typeof contexts)[keyof typeof contexts];
