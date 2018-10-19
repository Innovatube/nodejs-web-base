import { call, put } from 'redux-saga/effects';
import APIChangeRoute from '../api/api-change-route';

function* moveStop(action) {
  try {
    yield put({ type: 'SHOW_LOADING' });
    const result = yield call(APIChangeRoute.moveStop, [
      action.jobId,
      action.fromPlan.clientVehicleId,
      action.fromPlan.stops,
      action.toPlan.clientVehicleId,
      action.toPlan.stops,
    ]);
    const taskId = result.data.task_id;

    yield put({
      type: 'SET_FLEET',
      fleet: fleet.data.fleet,
    });
  } catch (e) {
    yield put({
      type: 'ERROR_MOVE_ROUTE',
      message: e.message,
    });
  } finally {
    yield put({ type: 'HIDE_LOADING' });
  }
}

export {
  moveStop, //eslint-disable-line
};
