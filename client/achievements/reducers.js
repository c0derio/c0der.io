import { fromJS } from 'immutable';

import * as constants from '../app/constants';
import createReducer from '../app/utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  records: []
};

export default createReducer(fromJS(initialState), {
  [constants.FETCH_ACHIEVEMENTS_PENDING]: state =>
    state.merge({
      ...initialState,
      loading: true,
      error: null
    }),
  [constants.FETCH_ACHIEVEMENTS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while loading the achievements: ${action.errorMessage}`
    }),
  [constants.FETCH_ACHIEVEMENTS_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      error: null,
      records: fromJS(action.payload.data)
    })
});
