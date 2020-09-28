import { combineReducers, AnyAction } from 'redux';
import keyBy from 'lodash.keyby';
import {
  Auth,
  CrossCheckSession,
  Dispute,
  Review,
  Task,
} from '../models/data-models';
import * as ACTIONS from '../constants/actions';

import {
  DisputesState,
  ErrorState,
  ReviewRequestsAppState,
  ReviewsState,
  TasksState,
  UsersState,
  SessionsState,
} from '../models/redux-models';

const userAuthReducer = (
  state = {
    githubId: '',
    roles: [],
    isLoading: false,
    isShowRoleSelector: false,
  },
  action: AnyAction
): Auth => {
  switch (action.type) {
    case ACTIONS.LOGIN_STARTED:
      return { ...state, isLoading: true };
    case ACTIONS.LOGIN_CHOSE_ROLE:
      return {
        ...state,
        githubId: action.payload.githubId,
        isShowRoleSelector: true,
        isLoading: false,
      };
    case ACTIONS.LOGIN:
      return {
        ...state,
        isShowRoleSelector: false,
        isLoading: false,
        githubId: action.payload.githubId,
        roles: action.payload.roles,
      };
    case ACTIONS.LOGOUT:
      return { ...state, githubId: '', roles: [], isLoading: false };
    default:
      return state;
  }
};

const addOneTaskToStore = (task: Task, state: TasksState): TasksState => {
  return keyBy(
    {
      ...state,
      [task.id]: task,
    },
    'id'
  ) as TasksState;
};

const tasksReducer = (state = {}, action: AnyAction): TasksState => {
  switch (action.type) {
    case ACTIONS.GET_TASKS:
      if (action.payload) {
        return keyBy(action.payload.res, 'id') as TasksState;
      }
      return state;
    case ACTIONS.CREATE_TASK:
      if (action.payload && action.payload.res.id) {
        return addOneTaskToStore(action.payload.res, state);
      }
      return state;
    case ACTIONS.GET_SINGLE_TASK:
      if (action.payload && action.payload.res.id) {
        return addOneTaskToStore(action.payload.res, state);
      }
      return state;
    case ACTIONS.UPDATE_TASK:
      if (action.payload && action.payload.res.id) {
        return addOneTaskToStore(action.payload.res, state);
      }
      return state;
    case ACTIONS.DELETE_TASK:
      if (action.payload) {
        const taskId: string = action.payload;
        const rest = { ...state } as TasksState;
        delete rest[taskId];
        return keyBy(rest, 'id');
      }
      return state;
    default:
      return state;
  }
};

const usersReducer = (state = {}, action: AnyAction): UsersState => {
  switch (action.type) {
    case ACTIONS.GET_USERS:
      if (action.payload) {
        return keyBy(action.payload.res, 'githubId') as UsersState;
      }
      return state;
    default:
      return state;
  }
};

const addOneReviewToStore = (
  review: Review,
  state: ReviewsState
): ReviewsState => {
  return keyBy(
    {
      ...state,
      [review.id]: review,
    },
    'id'
  ) as ReviewsState;
};

const reviewsReducer = (state = {}, action: AnyAction): ReviewsState => {
  switch (action.type) {
    case ACTIONS.GET_REVIEWS:
      if (action.payload) {
        return keyBy(action.payload.res, 'id') as ReviewsState;
      }
      return state;
    case ACTIONS.GET_SINGLE_REVIEW:
      if (action.payload) {
        return addOneReviewToStore(action.payload.res, state);
      }
      return state;
    case ACTIONS.CHANGE_REVIEW:
      if (action.payload) {
        return addOneReviewToStore(action.payload.res, state);
      }
      return state;
    case ACTIONS.ADD_SINGLE_REVIEW:
      if (action.payload) {
        return addOneReviewToStore(action.payload.res, state);
      }
      return state;
    default:
      return state;
  }
};

const requestsReducer = (
  state = {},
  action: AnyAction
): ReviewRequestsAppState => {
  switch (action.type) {
    case ACTIONS.GET_REVIEW_REQUESTS:
      if (action.payload) {
        return keyBy(action.payload.res, 'id') as ReviewRequestsAppState;
      }
      return state;
    case ACTIONS.ADD_REVIEW_REQUEST:
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    default:
      return state;
  }
};

const errorReducer = (state = null, action: AnyAction): ErrorState => {
  if (action.type === ACTIONS.ADD_ERROR) {
    return action.error.message;
  }
  if (action.type === ACTIONS.HIDE_ERROR) {
    return null;
  }
  return state;
};

const addOneDisputeToStore = (
  dispute: Dispute,
  state: DisputesState
): DisputesState => {
  return keyBy(
    {
      ...state,
      [dispute.reviewId]: dispute,
    },
    'reviewId'
  ) as DisputesState;
};

const disputesReducer = (state = {}, action: AnyAction): DisputesState => {
  switch (action.type) {
    case ACTIONS.GET_DISPUTES:
      if (action.payload) {
        return keyBy(action.payload.res, 'reviewId') as DisputesState;
      }
      return state;
    case ACTIONS.ADD_DISPUTE:
      if (action.payload) {
        return addOneDisputeToStore(action.payload.res, state);
      }
      return state;
    case ACTIONS.GET_SINGLE_DISPUTE:
      if (action.payload) {
        return addOneDisputeToStore(action.payload.res, state);
      }
      return state;
    case ACTIONS.ACCEPT_DISPUTE:
      if (action.payload) {
        return addOneDisputeToStore(action.payload.res, state);
      }
      return state;
    case ACTIONS.REJECT_DISPUTE:
      if (action.payload) {
        return addOneDisputeToStore(action.payload.res, state);
      }
      return state;
    case ACTIONS.DELETE_DISPUTE:
      if (action.payload) {
        const reviewId: string = action.payload;
        const rest = { ...state } as DisputesState;
        delete rest[reviewId];
        return keyBy(rest, 'reviewId');
      }
      return state;
    default:
      return state;
  }
};

const sessionsReducer = (state = {}, action: AnyAction): SessionsState => {
  switch (action.type) {
    case ACTIONS.GET_SESSIONS:
      if (action.payload) {
        return keyBy(action.payload.res, 'id') as AnyAction;
      }
      return state;

    case ACTIONS.CREATE_SESSION:
      if (action.payload) {
        return keyBy(
          {
            ...state,
            [action.payload.res.id]: action.payload.res as CrossCheckSession,
          },
          'id'
        ) as SessionsState;
      }
      return state;
    default:
      return state;
  }
};

export default combineReducers({
  tasks: tasksReducer,
  users: usersReducer,
  auth: userAuthReducer,
  reviews: reviewsReducer,
  reviewRequests: requestsReducer,
  disputes: disputesReducer,
  error: errorReducer,
  sessions: sessionsReducer,
});
