import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { routeActions } from 'redux-simple-router';

import * as constants from '../constants';
import { redirect, parseHash, a0Logout } from '../utils/auth';

export function login(location, prompt) {
  redirect(location, null, prompt);

  return {
    type: constants.REDIRECT_LOGIN
  };
}

function isExpired(decodedToken) {
  if (typeof decodedToken.exp === 'undefined') {
    return true;
  }

  const d = new Date(0);
  d.setUTCSeconds(decodedToken.exp);

  return !(d.valueOf() > (new Date().valueOf() + (1000)));
}

export function logout(location) {
  return (dispatch) => {
    localStorage.removeItem('apiToken');
    sessionStorage.removeItem('apiToken');

    dispatch({
      type: constants.LOGOUT,
      payload: {
        promise: a0Logout(location)
      }
    });
  };
}

export function loadCredentials(location) {
  return (dispatch) => {
    if (window.location.hash) {
      dispatch({
        type: constants.LOGIN_PENDING
      });
      parseHash(window.location.hash)
        .then((tokens) => {
          if (!tokens) {
            /* Must be a bad authorization */
            dispatch({
              type: constants.LOGIN_FAILED,
              payload: {
                error: 'Unauthorized'
              }
            });
            return dispatch(routeActions.push('/login'));
          }

          const idToken = tokens.idToken;
          const accessToken = tokens.accessToken;
          const decodedToken = jwtDecode(idToken);
          if (isExpired(decodedToken)) {
            dispatch({
              type: constants.LOGIN_FAILED,
              payload: {
                error: 'Expired Token'
              }
            });
            return dispatch(routeActions.push('/login'));
          }

          const decodedAccessToken = jwtDecode(accessToken);
          if (isExpired(decodedAccessToken)) {
            dispatch({
              type: constants.LOGIN_FAILED,
              payload: {
                error: 'Expired Token'
              }
            });
            return dispatch(routeActions.push('/login'));
          }

          axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

          // dispatch({
          //   type: constants.LOADED_TOKEN,
          //   payload: {
          //     token: idToken
          //   }
          // });

          dispatch({
            type: constants.LOGIN_SUCCESS,
            payload: {
              token: idToken,
              decodedToken,
              user: decodedToken,
              returnTo: tokens.returnTo
            }
          });

          return dispatch(routeActions.push(tokens.returnTo));
        }).catch((err) => {
          if (err.error) {
            /* Check for login_required, otherwise just fail */
            if (err.error === 'login_required') {
              redirect(location, err.state); // do NOT pass 'none' for prompt
            } else {
              return dispatch({
                type: constants.LOGIN_FAILED,
                payload: {
                  error: `${err.error}: ${err.error_description}`
                }
              });
            }
          }
      });
    }
  };
}

export function getAccessLevel(onSuccess) {
  return {
    type: constants.FETCH_ACCESS_LEVEL,
    meta: {
      onSuccess
    },
    payload: {
      promise: axios.get('/api/me', {
        responseType: 'json'
      })
    }
  };
}

export function getAppSettings(onSuccess) {
  return {
    type: constants.FETCH_SETTINGS,
    meta: {
      onSuccess
    },
    payload: {
      promise: axios.get('/api/settings', {
        responseType: 'json'
      })
    }
  };
}
