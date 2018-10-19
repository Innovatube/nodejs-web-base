export const setVehicles = vehicles => ({
  type: 'SET_VEHICLES',
  vehicles,
});

export const selectVehicle = stopId => ({
  type: 'SELECT_VEHICLES',
  stopId,
});
