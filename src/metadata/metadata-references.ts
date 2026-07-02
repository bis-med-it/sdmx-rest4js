{MetadataType} = require './metadata-type'

# Specifies the references to be returned.
#
# References can be artefacts referenced by the artefact to be returned
# (for example, the code lists and concepts used by the data structure
# definition matching the query), or artefacts that use the matching artefact
# (for example, the dataflows that use the data structure definition matching
# the query)
special =

  # No references will be returned
  NONE: 'none'

  # The artefacts that use the artefact matching the query will be returned.
  PARENTS: 'parents'

  # The artefacts that use the artefact matching the query, as well as the
  # artefacts referenced by these artefacts will be returned.
  PARENTSANDSIBLINGS: 'parentsandsiblings'

  # The artefacts that use the artefact matching the query, up to any level.
  ANCESTORS: 'ancestors'

  # The artefacts referenced by the matching artefact will be returned.
  CHILDREN: 'children'

  # References of references, up to any level, will also be returned.
  DESCENDANTS: 'descendants'

  # The combination of parentsandsiblings and descendants.
  ALL: 'all'

excluded = [
  'structure'
  'actualconstraint'
  'allowedconstraint'
  '*'
]

# All the predefined SDMX types are valid references, except for the 'catch all'
# `structure`
all = {}
for own k1, v1 of MetadataType when v1 not in excluded
  all[k1] = v1

for own k2, v2 of special
  all[k2] = v2

exports.MetadataReferences = Object.freeze all
exports.MetadataReferencesExcluded = Object.freeze excluded
exports.MetadataReferencesSpecial = Object.freeze special
