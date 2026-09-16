// Specifies the references to be returned.
const references = Object.freeze({
  NONE: 'none',
  ALL: 'all',
  DATA_STRUCTURE: 'datastructure',
  CONCEPT_SCHEME: 'conceptscheme',
  CODELIST: 'codelist',
  DATA_PROVIDER_SCHEME: 'dataproviderscheme',
  DATAFLOW: 'dataflow',
} as const);

export const AvailabilityReferences = references;
export type AvailabilityReferencesValue =
  (typeof references)[keyof typeof references];
