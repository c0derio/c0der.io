import { fromJS } from 'immutable';

import * as constants from '../app/constants';
import createReducer from '../app/utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  record: {}
};

export default createReducer(fromJS(initialState), {
  [constants.FETCH_PROFILE_PENDING]: state =>
    state.merge({
      ...initialState,
      loading: true,
      error: null
    }),
  [constants.FETCH_PROFILE_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while loading the profile: ${action.errorMessage}`
    }),
  [constants.FETCH_PROFILE_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      error: null,
      record: fromJS(action.payload.data)
    })
});
