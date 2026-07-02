# Specifies the mime types of the various SDMX formats for data.
formats =

  # The SDMX-ML 2.1 Generic data format.
  SDMX_ML_2_1_GENERIC: 'application/vnd.sdmx.genericdata+xml;version=2.1'

  # The SDMX-ML 2.1 Structure Specific data format.
  SDMX_ML_2_1_STRUCTURE_SPECIFIC:
    'application/vnd.sdmx.structurespecificdata+xml;version=2.1'

  # The SDMX-ML 2.1 Generic time series data format.
  SDMX_ML_2_1_GENERIC_TS:
    'application/vnd.sdmx.generictimeseriesdata+xml;version=2.1'

  # The SDMX-ML 2.1 Structure Specific data format.
  SDMX_ML_2_1_STRUCTURE_SPECIFIC_TS:
    'application/vnd.sdmx.structurespecifictimeseriesdata+xml;version=2.1'

  # The SDMX-ML 3.0.0 data format.
  SDMX_ML_3_0_0: 'application/vnd.sdmx.data+xml;version=3.0.0'

  # The SDMX-JSON 1.0.0 data format (Working draft).
  SDMX_JSON_1_0_0_WD: 'application/vnd.sdmx.data+json;version=1.0.0-wd'

  # The SDMX-JSON 1.0.0 data format (Candidate technical specification).
  SDMX_JSON_1_0_0_CTS: 'application/vnd.sdmx.data+json;version=1.0.0-cts'

  # The SDMX-JSON 1.0.0 data format.
  SDMX_JSON_1_0_0: 'application/vnd.sdmx.data+json;version=1.0.0'

  # The SDMX-JSON 2.0.0 data format.
  SDMX_JSON_2_0_0: 'application/vnd.sdmx.data+json;version=2.0.0'

  # The SDMX-CSV 1.0.0 data format, with default labels and
  # non-normalized periods
  SDMX_CSV_1_0_0: 'application/vnd.sdmx.data+csv;version=1.0.0'

  # The SDMX-CSV 2.0.0 data format, with default labels,
  # non-normalized periods and no keys
  SDMX_CSV_2_0_0: 'application/vnd.sdmx.data+csv;version=2.0.0'

  # Shortcut for the latest version of SDMX-JSON
  SDMX_JSON: 'application/vnd.sdmx.data+json;version=2.0.0'

  # Shortcut for the latest version of SDMX-CSV
  SDMX_CSV: 'application/vnd.sdmx.data+csv;version=2.0.0'

  # The SDMX-CSV 1.0.0 data format, with ID and name as labels
  SDMX_CSV_WITH_BOTH_LABELS:
    'application/vnd.sdmx.data+csv;version=1.0.0;labels=both'

  # The SDMX-CSV 1.0.0 data format, with normalized periods
  SDMX_CSV_WITH_NORMALIZED_PERIODS:
    'application/vnd.sdmx.data+csv;version=1.0.0;timeFormat=normalized'

  # The SDMX-CSV 1.0.0 data format, with default ID and name as labels,
  # as well as normalized periods
  SDMX_CSV_WITH_BOTH_LABELS_AND_NORMALIZED_PERIODS:
    'application/vnd.sdmx.data+csv;version=1.0.0;\
    labels=both;timeFormat=normalized'

  # Shortcut for the latest version of SDMX-ML Generic
  SDMX_ML_GENERIC: 'application/vnd.sdmx.genericdata+xml;version=2.1'

  # Shortcut for the latest version of SDMX-ML Structure Specific
  SDMX_ML_STRUCTURE_SPECIFIC:
    'application/vnd.sdmx.data+xml;version=3.0.0'

exports.DataFormat = Object.freeze formats
