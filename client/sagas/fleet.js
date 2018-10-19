import { call, put } from 'redux-saga/effects';
import APIFleet from '../api/api-fleet';


function* fetchFleet(action) {
  try {
    const fleet = yield call(APIFleet.getFleet, {
      jobId: action.jobId,
    });
    if (fleet.error) {
      yield put({
        type: 'FETCH_FLEET_FAILED',
        message: fleet.message,
      });
    } else {
      const fleetData = fleet.data.fleet;
      fleetData.plans = fleetData.plans.filter(plan => plan.legs && plan.legs.length > 0);
      if (fleetData && fleetData.plans) {
        fleetData.plans.sort((current, next) => {
          let v1 = Number(current.client_vehicle_id);
          let v2 = Number(next.client_vehicle_id);
          if (isNaN(v1)) {
            v1 = Number(current.client_vehicle_id.slice(1));
          }
          if (isNaN(v2)) {
            v2 = Number(next.client_vehicle_id.slice(1));
          }

          return v1 - v2;
        });
      }

      yield put({
        type: 'SET_FLEET',
        fleet: fleetData,
      });
    }
  } catch (e) {
    yield put({
      type: 'FETCH_FLEET_FAILED',
      message: e.message,
    });
  }
}

export {
  fetchFleet, //eslint-disable-line
};
