import {
  User,
  Task,
  Auth,
  Review,
  ReviewRequest,
  Dispute,
  CrossCheckSession as Session,
} from './data-models';

export type actions =
  | 'GET_TASKS'
  | 'GET_USERS'
  | 'GET_REVIEWS'
  | 'GET_SESSIONS';

export type ReviewsState = {
  [dynamic: string]: Review;
};

export type TasksState = {
  [dynamic: string]: Task;
};

export type UsersState = {
  [dynamic: string]: User;
};

export type SessionsState = {
  [dinamic: string]: Session;
};
export type ReviewRequestsAppState = {
  [dynamic: string]: ReviewRequest;
};

export type DisputesState = {
  [dynamic: string]: Dispute;
};

export type ErrorState = null | string;

export interface AppReduxState {
  tasks: TasksState;
  users: UsersState;
  reviews: ReviewsState;
  disputes: DisputesState;
  auth: Auth;
  reviewRequests: ReviewRequestsAppState;
  error: ErrorState;
  sessions: SessionsState;
}
