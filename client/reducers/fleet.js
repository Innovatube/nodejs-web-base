import Helper from '../helpers';

const defaultState = {
  data: {},
  selectedPlanId: false,
  hiddenPlans: [],
  time: {
    max: false,
    min: false,
    start: false,
  },
  error: null,
};

const fleet = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_FLEET':
      return {
        ...state,
        data: action.fleet,
        time: {
          max: Helper.time.maxTime(action.fleet.plans),
          min: Helper.time.minTime(action.fleet.plans),
          start: Helper.time.startTime(action.fleet.plans),
        },
        error: null,
      };

    case 'SELECT_PLAN':
      return {
        ...state,
        selectedPlanId: action.planId,
      };

    case 'SHOW_PLAN': {
      const hiddenPlans = state.hiddenPlans.slice().filter(planId => planId !== action.planId);

      return {
        ...state,
        hiddenPlans,
      };
    }

    case 'HIDE_PLAN': {
      const hiddenPlans = state.hiddenPlans.slice();
      if (hiddenPlans.every(planId => planId !== action.planId)) {
        hiddenPlans.push(action.planId);
      }

      return {
        ...state,
        hiddenPlans,
      };
    }

    case 'SHOW_ALL_PLAN': {
      return {
        ...state,
        hiddenPlans: [],
      };
    }

    case 'HIDE_ALL_PLAN': {
      return {
        ...state,
        hiddenPlans: state.data.plans ? state.data.plans.map(plan => plan.id) : [],
      };
    }

    case 'FETCH_FLEET_FAILED': {
      return {
        ...state,
        error: action.message,
      };
    }

    default:
      return state;
  }
};

export default fleet;
