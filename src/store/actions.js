import service from '../services/github';

/**
 * Action types
 */
export const STARS_REQUESTED = 'STARS_REQUESTED';
export const STARS_RECEIVED = 'STARS_RECEIVED';

/**
 * Async get stars history.
 */
export const getStarsHistory = repos => async (dispatch, getState) => {
  const state = getState();
  if (!state.isFetching) {
    dispatch({type: STARS_REQUESTED, repos}); // dispatch fetching is started
    const data = await service.getStarsHistory(repos); // fetch data from service
    dispatch({type: STARS_RECEIVED, repos, data}); // dispatch fetching action is complete
    return data;
  }
  return Promise.resolve();
};
