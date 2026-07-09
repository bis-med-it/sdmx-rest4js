// Indicates the possible processing modes
const modes = {
  // Instructs the service to return a Cube Region containing values which will
  // be returned by executing the query.
  EXACT: 'exact',

  // Instructs the service to return a Cube Region showing what values remain
  // valid selections that could be added to the data query.
  AVAILABLE: 'available',
};

export const AvailabilityMode = Object.freeze(modes);
