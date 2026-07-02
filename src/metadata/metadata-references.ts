import { MetadataType } from './metadata-type';

// Specifies the references to be returned.
//
// References can be artefacts referenced by the artefact to be returned
// (for example, the code lists and concepts used by the data structure
// definition matching the query), or artefacts that use the matching artefact
// (for example, the dataflows that use the data structure definition matching
// the query)
const special = {

  // No references will be returned
  NONE: 'none',

  // The artefacts that use the artefact matching the query will be returned.
  PARENTS: 'parents',

  // The artefacts that use the artefact matching the query, as well as the
  // artefacts referenced by these artefacts will be returned.
  PARENTSANDSIBLINGS: 'parentsandsiblings',

  // The artefacts that use the artefact matching the query, up to any level.
  ANCESTORS: 'ancestors',

  // The artefacts referenced by the matching artefact will be returned.
  CHILDREN: 'children',

  // References of references, up to any level, will also be returned.
  DESCENDANTS: 'descendants',

  // The combination of parentsandsiblings and descendants.
  ALL: 'all',
};

const excluded = [
  'structure',
  'actualconstraint',
  'allowedconstraint',
  '*',
];

// All the predefined SDMX types are valid references, except for the 'catch
// all' `structure`
const all: { [key: string]: string } = {};
for (const [k1, v1] of Object.entries(MetadataType)) {
  if (excluded.indexOf(v1) === -1) {
    all[k1] = v1;
  }
}

for (const [k2, v2] of Object.entries(special)) {
  all[k2] = v2;
}

export const MetadataReferences = Object.freeze(all);
export const MetadataReferencesExcluded = Object.freeze(excluded);
export const MetadataReferencesSpecial = Object.freeze(special);
