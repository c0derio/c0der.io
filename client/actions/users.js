import axios from 'axios';
import * as constants from '../constants';


export function fetchProfile(userId) {
  const baseUrl = window.config.BASE_API_URL;

  return {
    type: constants.FETCH_PROFILE,
    payload: {
      // promise: axios.get(`${baseUrl}/api/users/${userId}`, {
      //   responseType: 'json'
      // })
      promise: new Promise((resolve) => resolve({ data: {username: 'some username'}}))
    }
  };
}
