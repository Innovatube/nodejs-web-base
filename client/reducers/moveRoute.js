const defaultState = {
  status: 'ROUTE_DETAIL',
  selectedStop: false,
  fromPlan: false,
  toPlan: false,
  error: false,
  sidePanelOpen: true,
};

function moveStopToPlan(params) {
  const {
    stopId,
    fromPlan,
    toPlan,
    seq,
  } = params;

  const movedLeg = fromPlan.stops.find(leg => leg === stopId);
  fromPlan.stops = fromPlan.stops.filter(leg => leg !== stopId);
  toPlan.stops.splice(seq, 0, movedLeg);

  return {
    adjustedFromPlan: Object.assign({}, fromPlan),
    adjustedToPlan: Object.assign({}, toPlan),
  };
}

function getMostDuplicate(key, vehicles) {
  const arr = vehicles.map(vehicle => vehicle[key]);

  return arr.sort((a, b) => arr.filter(v => v === a).length - arr.filter(v => v === b).length).pop();
}

function newVehicleId(vehicles) {
  for (let i = 1; true; i++) {
    const vehicleNewId = `NewRoute${i}`;
    if (vehicles.every(vehicle => vehicle.client_vehicle_id !== vehicleNewId)) {
      return vehicleNewId;
    }
  }
}

const moveRoute = (state = defaultState, action) => {
  switch (action.type) {
    case 'START_MOVE_ROUTE': {
      if (action.fromPlan) {
        return {
          ...state,
          status: 'MOVE_TO',
          selectedStop: action.stop,
          sidePanelOpen: true,
          fromPlan: {
            id: action.fromPlan.id,
            clientVehicleId: action.fromPlan.client_vehicle_id,
            stops: action.fromPlan.legs
              .map(leg => leg.stop_id)
              .filter(stopId => state.stops.some(stop => stop.client_stop_id === stopId)),
          },
        };
      }

      return {
        ...state,
        status: 'MOVE_TO',
        selectedStop: action.stop,
        sidePanelOpen: true,
        fromPlan: {
          id: -1,
          stops: action.unservedStops || [],
        },
      };
    }

    case 'ADD_NEW_PLAN':
      return {
        ...state,
        status: 'NEW_PLAN',
        sidePanelOpen: true,
        toPlan: {
          id: -2,
          stops: [],
          clientVehicleId: newVehicleId(action.vehicles),
          lat_start: getMostDuplicate('lat_start', action.vehicles),
          lng_start: getMostDuplicate('lng_start', action.vehicles),
          lat_end: getMostDuplicate('lat_end', action.vehicles),
          lng_end: getMostDuplicate('lng_end', action.vehicles),
          time_start: getMostDuplicate('time_start', action.vehicles),
          time_end: getMostDuplicate('time_end', action.vehicles),
          speed_limit: getMostDuplicate('speed_limit', action.vehicles),
          break_time_start: getMostDuplicate('break_time_start', action.vehicles),
          break_time_end: getMostDuplicate('break_time_end', action.vehicles),
          volume: getMostDuplicate('volume', action.vehicles),
          weight: getMostDuplicate('weight', action.vehicles),
          type: getMostDuplicate('type', action.vehicles),
          priority: getMostDuplicate('priority', action.vehicles),
          time_to_leave: getMostDuplicate('time_to_leave', action.vehicles),
          reverse_delivery: getMostDuplicate('reverse_delivery', action.vehicles),
        },
      };

    case 'UPDATE_NEW_ROUTE_INFO':
      return {
        ...state,
        sidePanelOpen: true,
        toPlan: {
          ...state.toPlan,
          [action.key]: action.value,
        },
      };

    case 'SELECT_TO_PLAN':
      return {
        ...state,
        status: 'ARRANGE',
        sidePanelOpen: true,
        toPlan: {
          ...state.toPlan,
          id: action.toPlan.id,
          clientVehicleId: action.toPlan.client_vehicle_id || state.toPlan.clientVehicleId,
          stops: action.toPlan.legs
            .map(leg => leg.stop_id)
            .filter(stopId => state.stops.some(stop => stop.client_stop_id === stopId)),
        },
      };

    case 'MOVE_STOP_TO_PLAN': {
      const {
        stopId,
        seq,
        fromPlanId,
        toPlanId,
      } = action;
      const { fromPlan, toPlan } = state;

      if (fromPlanId === toPlanId) {
        if (parseInt(fromPlanId, 10) === fromPlan.id) {
          const adjustedResult = moveStopToPlan({
            stopId,
            seq,
            fromPlan: parseInt(fromPlanId, 10) === fromPlan.id ? fromPlan : toPlan,
            toPlan: parseInt(toPlanId, 10) === fromPlan.id ? fromPlan : toPlan,
          });

          return {
            ...state,
            fromPlan: adjustedResult.adjustedToPlan,
          };
        }
        const adjustedResult = moveStopToPlan({
          stopId,
          seq,
          fromPlan: parseInt(fromPlanId, 10) === fromPlan.id ? fromPlan : toPlan,
          toPlan: parseInt(toPlanId, 10) === fromPlan.id ? fromPlan : toPlan,
        });

        return {
          ...state,
          toPlan: adjustedResult.adjustedToPlan,
        };
      }

      const adjustedResult = moveStopToPlan({
        stopId,
        seq,
        fromPlan: parseInt(fromPlanId, 10) === fromPlan.id ? fromPlan : toPlan,
        toPlan: parseInt(toPlanId, 10) === fromPlan.id ? fromPlan : toPlan,
      });

      return {
        ...state,
        sidePanelOpen: true,
        fromPlan: parseInt(fromPlanId, 10) === fromPlan.id ? adjustedResult.adjustedFromPlan : adjustedResult.adjustedToPlan,
        toPlan: parseInt(toPlanId, 10) === fromPlan.id ? adjustedResult.adjustedFromPlan : adjustedResult.adjustedToPlan,
      };
    }

    case 'OPEN_RE_SEQUENCE':
      return {
        ...state,
        sidePanelOpen: true,
        status: 'RE_SEQUENCE',
      };

    case 'CLOSE_MOVE_ROUTE':
      return {
        ...state,
        ...defaultState,
      };

    case 'OPEN_PANEL':
      return {
        ...state,
        sidePanelOpen: true,
      };

    case 'CLOSE_PANEL':
      return {
        ...state,
        sidePanelOpen: false,
      };

    case 'ERROR_MOVE_ROUTE':
      return {
        ...state,
        error: action.error,
        loading: state.loading - 1,
      };

    case 'SET_STOPS':
      return {
        ...state,
        stops: action.stops,
      };

    case 'SELECT_STOP':
      return {
        ...state,
        selectedStop: action.selectedStop,
      };

    case 'SHOW_LOADING':
      return {
        ...state,
        loading: (state.loading || 0) + 1,
      };

    case 'HIDE_LOADING':
      return {
        ...state,
        loading: Math.max(state.loading - 1, 0),
      };

    default:
      return state;
  }
};

export default moveRoute;
