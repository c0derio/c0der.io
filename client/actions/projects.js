import axios from 'axios';
import * as constants from '../constants';


export default function fetchProjects(userId) {
  const baseUrl = window.config.BASE_API_URL;

  return {
    type: constants.FETCH_PROJECTS,
    payload: {
      // promise: axios.get(`${baseUrl}/api/users/${userId}`, {
      //   responseType: 'json'
      // })
      promise: new Promise((resolve) => resolve({ data: [ { name: 'project1' }, { name: 'project2' } ] }))
    }
  };
}
