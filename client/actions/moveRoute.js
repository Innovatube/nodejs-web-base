export const startMoveRoute = (stop, unservedStops, fromPlan) => ({
  type: 'START_MOVE_ROUTE',
  stop,
  unservedStops,
  fromPlan,
});

export const addNewPlan = vehicles => ({
  type: 'ADD_NEW_PLAN',
  vehicles,
});

export const selectToPlan = toPlan => ({
  type: 'SELECT_TO_PLAN',
  toPlan,
});

export const showLoading = () => ({
  type: 'SHOW_LOADING',
});

export const hideLoading = () => ({
  type: 'HIDE_LOADING',
});

export const errorMoveRoute = error => ({
  type: 'ERROR_MOVE_ROUTE',
  error,
});

export const updateNewRouteInfo = (key, value) => ({
  type: 'UPDATE_NEW_ROUTE_INFO',
  key,
  value,
});

export const openReSequence = () => ({
  type: 'OPEN_RE_SEQUENCE',
});

export const openPanel = () => ({
  type: 'OPEN_PANEL',
});

export const closePanel = () => ({
  type: 'CLOSE_PANEL',
});

export const selectStop = selectedStop => ({
  type: 'SELECT_STOP',
  selectedStop,
});

export const moveStopToPlan = (
  stopId,
  seq,
  fromPlanId,
  toPlanId,
) => ({
  type: 'MOVE_STOP_TO_PLAN',
  stopId,
  seq,
  fromPlanId,
  toPlanId,
});

export const closeMoveRoute = () => ({
  type: 'CLOSE_MOVE_ROUTE',
});
