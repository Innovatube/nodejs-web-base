import { call, put } from 'redux-saga/effects';
import APIStop from '../api/api-stop';

function* fetchStop(action) {
  try {
    const fleet = yield call(APIStop.getStops, {
      jobId: action.jobId,
    });
    yield put({
      type: 'SET_STOPS',
      stops: fleet.data.stops,
    });
  } catch (e) {
    yield put({
      type: 'FETCH_STOPS_FAILED',
      message: e.message,
    });
  }
}

export {
  fetchStop, //eslint-disable-line
};
