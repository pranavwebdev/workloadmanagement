import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import workload from './workload';

export default combineReducers({
  alert,
  auth,
  profile,
  workload
});
