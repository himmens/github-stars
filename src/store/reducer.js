import Immutable from 'seamless-immutable';
import { STARS_RECEIVED, STARS_REQUESTED } from './actions';

/**
 * Initial data state
 */
const initialState = Immutable({
  isFetching: false,
  history: {},
});

export default function reduce(state = initialState, action = {}) {
  const {repos, data} = action;

  switch (action.type) {
    case STARS_REQUESTED:
      return state.merge({
        isFetching: true,
      });

    case STARS_RECEIVED:
      return state.merge({
        isFetching: false,
        history: data,
      });

    default:
      return state;
  }
}

//----- Selectors ------

export function getAllHistory(state) {
  return state.history;
  // const currentFilter = state.posts.currentFilter;
  // const postsById = state.posts.postsById;
  // const postsIdArray = currentFilter === 'all' ?
  //   _.keys(postsById) :
  //   _.filter(_.keys(postsById), (postId) => postsById[postId].topicUrl === currentFilter);
  // return [postsById, postsIdArray];
}