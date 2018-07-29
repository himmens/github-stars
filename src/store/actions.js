import service from '../services/github';

/**
 * Action types
 */
export const DOWNLOADS_REQUESTED = 'DOWNLOADS_REQUESTED';
export const DOWNLOADS_RECEIVED = 'DOWNLOADS_RECEIVED';

export const downloadsRangesRequested = repo => ({
  type: DOWNLOADS_REQUESTED,
  repo,
});

export const downloadsRangesReceived = (repo, data) => ({
  type: DOWNLOADS_RECEIVED,
  repo,
  data,
});

/**
 * Async get downloads ranges by package.
 */
export const getDownloadsRanges = (repo) => async (dispatch, getState) => {
  const state = getState();
  if (!state.isFetching) {
    // dispatch fetching is started
    dispatch(downloadsRangesRequested(repo));
    // fetch data from service
    const data = await service.getStarsHistory();
    // dispatch fetching action is complete
    dispatch(downloadsRangesReceived(repo, data));
    return data;
  }
  return Promise.resolve();
};
