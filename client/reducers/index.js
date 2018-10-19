import { combineReducers } from 'redux';
import fleet from './fleet';
import stops from './stops';
import moveRoute from './moveRoute';
import vehicles from './vehicles';

export default combineReducers({
  fleet,
  stops,
  moveRoute,
  vehicles,
});
