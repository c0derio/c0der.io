import * as constants from '../constants';

export default function fetchAchievements(userId) {
  // const baseUrl = window.config.BASE_API_URL;

  return {
    type: constants.FETCH_ACHIEVEMENTS,
    payload: {
      // promise: axios.get(`${baseUrl}/api/users/${userId}`, {
      //   responseType: 'json'
      // })
      promise: new Promise(resolve => resolve({ data: [ { userId, name: 'achievement1' }, { userId, name: 'achievement2' } ] }))
    }
  };
}
