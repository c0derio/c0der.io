import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routeReducer } from 'redux-simple-router';

import auth from './auth/reducers';
import profile from '../profile/reducers';
import projects from '../projects/reducers';
import achievements from '../achievements/reducers';

function lastAction(state = null, action) {
  return action;
}

export default combineReducers({
  routing: routeReducer,
  auth,
  profile,
  projects,
  achievements,
  lastAction,
  form: formReducer
});
