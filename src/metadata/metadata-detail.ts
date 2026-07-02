# Specifies the amount of information to be returned for metadata queries.
details =

  # All available information for all artefacts is returned.
  FULL: 'full'

  # All artefacts are returned as stubs.
  ALL_STUBS: 'allstubs'

  # Referenced artefacts are returned as stubs.
  REFERENCE_STUBS: 'referencestubs'

  # Referenced schemes only include items used by the artefact to be returned.
  REFERENCE_PARTIAL: 'referencepartial'

  # All artefacts are returned as complete stubs.
  ALL_COMPLETE_STUBS: 'allcompletestubs'

  # Referenced artefacts are returned as complete stubs.
  REFERENCE_COMPLETE_STUBS: 'referencecompletestubs'

  # Same as full, except that returned extended codelists are not resolved.
  RAW: 'raw'

exports.MetadataDetail = Object.freeze details
