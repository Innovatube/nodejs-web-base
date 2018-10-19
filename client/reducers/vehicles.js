const defaultState = {
  data: [],
  selectedStopId: false,
};

const vehicles = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_VEHICLES':
      return {
        ...state,
        data: action.vehicles,
      };

    case 'SELECT_VEHICLES':
      return {
        ...state,
        selectedStopId: action.vehicleId,
      };

    default:
      return state;
  }
};

export default vehicles;
