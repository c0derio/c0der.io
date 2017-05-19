import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routeReducer } from 'redux-simple-router';

import auth from './auth';
import profile from './profile';
import projects from './projects';
import achievements from './achievements';

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