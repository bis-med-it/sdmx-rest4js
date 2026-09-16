// Specifies the amount of information to be returned for data queries.
const details = Object.freeze({
  // All data and documentation, including annotations.
  FULL: 'full',

  // Attributes and groups (if any) will be excluded from the message.
  DATA_ONLY: 'dataonly',

  // The series and their dimensions.
  SERIES_KEYS_ONLY: 'serieskeysonly',

  // The series and groups, including attributes and annotations, but no
  // observations
  NO_DATA: 'nodata',
} as const);

export const DataDetail = details;
export type DataDetailValue = (typeof details)[keyof typeof details];
