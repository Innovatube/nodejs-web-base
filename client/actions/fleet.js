export const fetchFleet = jobId => ({
  type: 'FETCH_FLEET',
  jobId,
});

export const fetchData = jobId => ({
  type: 'FETCH_DATA',
  jobId,
});

export const setFleet = fleet => ({
  type: 'SET_FLEET',
  fleet,
});

export const selectPlan = planId => ({
  type: 'SELECT_PLAN',
  planId,
});

export const showPlan = planId => ({
  type: 'SHOW_PLAN',
  planId,
});

export const hidePlan = planId => ({
  type: 'HIDE_PLAN',
  planId,
});

export const showAllPlan = () => ({
  type: 'SHOW_ALL_PLAN',
});

export const hideAllPlan = () => ({
  type: 'HIDE_ALL_PLAN',
});

export const fetchError = message => ({
  type: 'FETCH_FLEET_FAILED',
  message,
});
