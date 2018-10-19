import { takeEvery } from 'redux-saga/effects';
import { fetchFleet } from './fleet';
import { fetchVehicle } from './vehicle';
import { fetchStop } from './stop';

function* mySaga() {
  yield takeEvery('FETCH_DATA', fetchFleet);
  yield takeEvery('FETCH_DATA', fetchVehicle);
  yield takeEvery('FETCH_DATA', fetchStop);
}

export default mySaga;
