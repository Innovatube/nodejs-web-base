import { call, put } from 'redux-saga/effects';
import APIVehicle from '../api/api-vehicle';

function* fetchVehicle(action) {
  try {
    const fleet = yield call(APIVehicle.getVehicle, {
      jobId: action.jobId,
    });
    yield put({
      type: 'SET_VEHICLES',
      vehicles: fleet.data.vehicles,
    });
  } catch (e) {
    yield put({
      type: 'FETCH_VEHICLES_FAILED',
      message: e.message,
    });
  }
}

export {
  fetchVehicle, //eslint-disable-line
};
