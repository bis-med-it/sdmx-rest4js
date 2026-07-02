# Specifies the amount of information to be returned for data queries.
details =

  # All data and documentation, including annotations.
  FULL: 'full'

  # Attributes and groups (if any) will be excluded from the message.
  DATA_ONLY: 'dataonly'

  # The series and their dimensions.
  SERIES_KEYS_ONLY: 'serieskeysonly'

  # The series and groups, including attributes and annotations, but no
  # observations
  NO_DATA: 'nodata'

exports.DataDetail = Object.freeze details
