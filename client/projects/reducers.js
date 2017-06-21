import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  records: []
};

export default createReducer(fromJS(initialState), {
  [constants.FETCH_PROJECTS_PENDING]: state =>
    state.merge({
      ...initialState,
      loading: true,
      error: null
    }),
  [constants.FETCH_PROJECTS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while loading the projects: ${action.errorMessage}`
    }),
  [constants.FETCH_PROJECTS_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      error: null,
      records: fromJS(action.payload.data)
    })
});
