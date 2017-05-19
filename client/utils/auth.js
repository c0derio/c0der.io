import auth0Js from 'auth0-js';
import Promise from 'bluebird';
import crypto from 'crypto';
import base64url from 'base64url';

const NONCE_SESSION_NAME = 'AUTH0_LAST_NONCE';

/** Sync */
const getNonce = () => {
  const nonce = base64url(crypto.randomBytes(64));
  sessionStorage.setItem(NONCE_SESSION_NAME, nonce);
  return nonce;
};

const checkNonce = (nonce) => {
  const storedNonce = sessionStorage.getItem(NONCE_SESSION_NAME);
  const success = nonce === storedNonce;
  sessionStorage.setItem(NONCE_SESSION_NAME, '');
  return success;
};

let auth0Instance = null;

const getAuth0 = () => {
  if (window.config.AUTH0_CLIENT_ID && !auth0Instance) {
    auth0Instance = new auth0Js.WebAuth({
      domain: window.config.AUTH0_DOMAIN,
      clientID: window.config.AUTH0_CLIENT_ID
    });
  }

  return auth0Instance;
};

export const getBaseUrl = (location) => {
  const fullUrl = window.location.href;
  const index = fullUrl.indexOf(location.pathname);
  return fullUrl.substr(0,index);
};

export const parseHash = (hash) => {
  // initialize auth0
  const webAuth = getAuth0();

  const getUserInfo = Promise.promisify(webAuth.client.userInfo, { context: webAuth.client });
  const parseHashPromise = Promise.promisify(webAuth.parseHash, { context: webAuth });
  return parseHashPromise(hash)
    .then((authResult) => {
      localStorage.setItem('apiToken', authResult.accessToken);
      /* Validate state */
      const state = JSON.parse(atob(authResult.state));
      if (!checkNonce(state.nonce)) throw new Error("Bad State");

      /* TODO: Validate ID token */
      /* TODO: Validate that returnTo is local */
      return { accessToken: authResult.accessToken, idToken: authResult.idToken, returnTo: state.returnTo };
    })
    .then(tokens => getUserInfo(tokens.accessToken)
      .then((user) => {
        // Now you have the user's information
        localStorage.setItem('profile', user);
        return tokens;
      })
    );
};

export const a0Logout = (location) => {
  const webAuth = getAuth0();
  webAuth.logout({ returnTo: getBaseUrl(location) });
};

export const redirect = (location, state, prompt) => {
  const webAuth = getAuth0();
  if (!webAuth) {
    throw new Error('Unable to create webAuth.');
  }

  const nonce = getNonce();

  // TODO, should we be validating the state nonce here?
  const stateDecoded = state && JSON.parse(atob(state));
  const targetState = { returnTo: (stateDecoded && stateDecoded.returnTo) || (location.query && location.query.returnUrl), nonce: nonce };

  /* Get base URL */

  const options = {
    redirect_uri: getBaseUrl(location) + "/login",
    responseType: 'token id_token',
    audience: window.config.C0DERIO_AUDIENCE,
    state: btoa(JSON.stringify(targetState)),
    scope: 'openid profile email read:users read:achievements read:projects',
    nonce: nonce
  };

  if (prompt) options.prompt = prompt;

  console.log("Carlos, options: ", options, ", prompt=", prompt);

  webAuth.authorize(options);
};
