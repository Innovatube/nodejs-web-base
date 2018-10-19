const fromVehicle = (state) => {
  const vehicles = state.vehicles.data;
  const { fromPlan } = state.moveRoute;

  if (vehicles.length) {
    return vehicles.find(v => v.client_vehicle_id === fromPlan.clientVehicleId) || fromPlan;
  }

  return false;
};

const toVehicle = (state) => {
  const vehicles = state.vehicles.data;
  const { toPlan } = state.moveRoute;

  if (vehicles.length) {
    return vehicles.find(v => v.client_vehicle_id === toPlan.clientVehicleId) || toPlan;
  }

  return false;
};

const fromStops = (state) => {
  const stops = state.stops.data;
  const { fromPlan } = state.moveRoute;

  if (stops.length && fromPlan.stops && fromPlan.stops.length) {
    return stops.filter(s => fromPlan.stops.some(stopId => stopId === s.client_stop_id));
  }

  return [];
};

const toStops = (state) => {
  const stops = state.stops.data;
  const { toPlan } = state.moveRoute;

  if (stops.length && toPlan.stops && toPlan.stops.length) {
    return stops.filter(s => toPlan.stops.some(stopId => stopId === s.client_stop_id));
  }

  return [];
};

const fromSumWeight = (state) => {
  if (fromStops(state)) {
    return fromStops(state).map(s => s.weight).reduce((a, b) => a + b, 0);
  }

  return 0;
};

const toSumWeight = (state) => {
  if (toStops(state)) {
    return toStops(state).map(s => s.weight).reduce((a, b) => a + b, 0);
  }

  return 0;
};

const fromSumVolume = (state) => {
  if (fromStops(state)) {
    return fromStops(state).map(s => s.volume).reduce((a, b) => a + b, 0);
  }

  return 0;
};

const toSumVolume = (state) => {
  if (toStops(state)) {
    return toStops(state).map(s => s.volume).reduce((a, b) => a + b, 0);
  }

  return 0;
};

const toPlanChanged = (state) => {
  const toPlanId = state.moveRoute.toPlan.id;

  return toStops(state).some(stop => stop.plan_id !== toPlanId);
};

const fromPlanChanged = (state) => {
  const fromPlanId = state.moveRoute.fromPlan.id;

  return fromStops(state).some(stop => stop.plan_id !== fromPlanId);
};

const planChanged = state => toPlanChanged(state) || fromPlanChanged(state);

const errorOverLoad = (state) => {
  const _fromVehicle = fromVehicle(state);
  const _toVehicle = toVehicle(state);

  const fromOverload = _fromVehicle && (_fromVehicle.weight < fromSumWeight(state) || _fromVehicle.volume < fromSumVolume(state));
  const toOverload = _toVehicle && (_toVehicle.weight < toSumWeight(state) || _toVehicle.volume < toSumVolume(state));

  return fromOverload || toOverload;
};

const errorAllMoveOut = (state) => {
  const _fromVehicle = fromVehicle(state);
  if (_fromVehicle && _fromVehicle.id !== -1 && fromStops(state).length === 0) {
    return true;
  }

  const _toVehicle = toVehicle(state);
  if (_toVehicle && _toVehicle.id !== -2 && toStops(state).length === 0) {
    return true;
  }

  return false;
};

const errorMoveUnserved = (state) => {
  const { moveRoute: { fromPlan, toPlan } } = state;
  const unservedStops = state.fleet.data.unserved ? state.fleet.data.unserved.split(',') : [];
  if (fromPlan.id === -1 && toPlan.id !== -2) {
    if (fromPlan.stops.some(stop => unservedStops.every(stopId => stopId !== stop))) {
      return true;
    }
  }

  return false;
};

const MoveRouteHelper = (state) => {
  if (state) {
    return {
      fromVehicle: fromVehicle(state),
      toVehicle: toVehicle(state),

      fromStops: fromStops(state),
      toStops: toStops(state),

      fromSumWeight: fromSumWeight(state),
      toSumWeight: toSumWeight(state),

      fromSumVolume: fromSumVolume(state),
      toSumVolume: toSumVolume(state),

      errorOverLoad: errorOverLoad(state),
      errorAllMoveOut: errorAllMoveOut(state),
      errorMoveUnserved: errorMoveUnserved(state),

      planChanged: planChanged(state),
    };
  }

  return {};
};

export default MoveRouteHelper;
