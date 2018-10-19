export const setStops = stops => ({
  type: 'SET_STOPS',
  stops,
});

export const selectStop = stopId => ({
  type: 'SELECT_STOP',
  stopId,
});
