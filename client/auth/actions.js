import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { routeActions } from 'redux-simple-router';

import * as constants from './constants';
import { redirect, parseHash, a0Logout } from './utils';

function isExpired(decodedToken) {
  if (typeof decodedToken.exp === 'undefined') {
    return true;
  }

  const d = new Date(0);
  d.setUTCSeconds(decodedToken.exp);

  return !(d.valueOf() > (new Date().valueOf() + (1000)));
}

const handleTokens = (dispatch, getTokensPromise, location, refreshing) =>
  getTokensPromise
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
          type: constants.LOGIN_FAILED
        });
        return dispatch(routeActions.push('/login'));
      }

      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      axios.interceptors.response.use(response => response, (error) => {
        const value = error.response;

        if (value.status === 401 && value.data.message === 'TokenExpired') {
          console.log('Token JWT expired, renew...');

          dispatch({
            type: constants.REFRESH_PENDING
          });

          // renewToken performs authentication using username/password saved in sessionStorage/localStorage
          return handleTokens(dispatch, redirect(location, null, prompt), location, true /* refreshing only */)
            .then(() => {
              console.log('Re-sending the request...', error.config);
              error.config.headers.Authorization = axios.defaults.headers.common.Authorization;
              return axios.request(error.config);
            });
        }

        return Promise.reject(error);
      });

      // const expiresIn = tokens.expiresIn || 10;
      // let timeout = (expiresIn * 1000) - 60000;
      // if (timeout < 10000) timeout = 10000; /* refresh only every 10 seconds at the most */
      // console.log('Carlos, timeout: ', timeout, ', tokens: ', tokens);
      // setTimeout(() => {
      //   dispatch({
      //     type: constants.REFRESH_PENDING
      //   });
      //   return handleTokens(dispatch, redirect(location, null, prompt), location, true /* refreshing only */);
      // }, timeout);

      if (refreshing) {
        return dispatch({
          type: constants.LOGIN_SUCCESS,
          payload: {
            idToken,
            accessToken,
            decodedToken,
            user: decodedToken,
            returnTo: tokens.returnTo
          }
        });
      }

      dispatch({
        type: constants.LOGIN_SUCCESS,
        payload: {
          idToken,
          accessToken,
          decodedToken,
          user: decodedToken,
          returnTo: tokens.returnTo
        }
      });

      return dispatch(routeActions.push(tokens.returnTo));
    })
    .catch((err) => {
      console.error('Error Loading Credentials: ', err);
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

      return dispatch({
        type: constants.LOGIN_FAILED,
        payload: {
          error: err.message
        }
      });
    });

export function login(location, prompt) {
  return (dispatch) => {
    dispatch({
      type: constants.LOGIN_PENDING
    });
    return handleTokens(dispatch, redirect(location, null, prompt), location);
  };
}

export function logout(location) {
  return (dispatch) => {
    localStorage.removeItem('apiToken');
    sessionStorage.removeItem('apiToken');

    return dispatch({
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
      return handleTokens(dispatch, parseHash(window.location.hash), location);
    }

    return Promise.resolve();
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
