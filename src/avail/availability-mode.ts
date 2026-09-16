// Indicates the possible processing modes
const modes = Object.freeze({
  // Instructs the service to return a Cube Region containing values which will
  // be returned by executing the query.
  EXACT: 'exact',

  // Instructs the service to return a Cube Region showing what values remain
  // valid selections that could be added to the data query.
  AVAILABLE: 'available',
} as const);

export const AvailabilityMode = modes;
export type AvailabilityModeValue = (typeof modes)[keyof typeof modes];
