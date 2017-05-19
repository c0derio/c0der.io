import url from 'url';
import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  isAuthenticated: false,
  isAuthenticating: false,
  issuer: null,
  token: null,
  decodedToken: null,
  user: null,
  returnTo: null
};

export default createReducer(fromJS(initialState), {
  [constants.LOGIN_PENDING]: state =>
    state.merge({
      ...initialState,
      isAuthenticating: true
    }),
  [constants.LOGIN_FAILED]: (state, action) =>
    state.merge({
      isAuthenticating: false,
      error: action.payload.error || 'Unknown Error'
    }),
  [constants.LOGIN_SUCCESS]: (state, action) =>
    state.merge({
      isAuthenticated: true,
      isAuthenticating: false,
      user: action.payload.user,
      token: action.payload.token,
      decodedToken: action.payload.decodedToken,
      issuer: url.parse(action.payload.decodedToken.iss).hostname,
      returnTo: action.payload.returnTo
    }),
  [constants.LOGOUT_PENDING]: (state, action) =>
    state.merge({
      ...initialState,
      isAuthenticating: true,
      returnTo: '/'
    }),
  [constants.LOGOUT_REJECTED]: (state, action) =>
    state.merge({
      isAuthenticating: false,
      error: action.payload.error || 'Unknown Error'
    }),
  [constants.LOGOUT_SUCCESS]: (state, action) =>
    state.merge({
      isAuthenticating: false
    })
});
