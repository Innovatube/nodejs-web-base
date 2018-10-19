const defaultState = {
  data: [],
  selectedStopId: false,
};

const stops = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_STOPS':
      return {
        ...state,
        data: action.stops,
      };

    case 'SELECT_STOP':
      return {
        ...state,
        selectedStopId: action.stopId,
      };

    default:
      return state;
  }
};

export default stops;
