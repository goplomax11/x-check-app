/// User
export type UserRole = 'author' | 'student' | 'supervisor' | 'coursemanager';

export interface User {
  id?: number;
  githubId: string;
  roles: UserRole[];
}

// Auth
export interface Auth extends User {
  isLoading: boolean;
  isShowRoleSelector: boolean;
}

/// Task
export type TaskState = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type TaskItemCategory = 'Basic Scope' | 'Extra Scope' | 'Fines';

export interface TaskItem {
  id: string;
  minScore: number;
  maxScore: number;
  category: TaskItemCategory;
  title: string;
  description: string;
  isForMentor?: boolean
}

export interface Task {
  id: string;
  title: string;
  author: string;
  state: TaskState;
  categoriesOrder: TaskItemCategory[];
  items: TaskItem[];
}

export interface TaskScore {
  task: string;
  items: {
    [dynamic: string]: {
      score: number;
      comment?: string;
    };
  };
}

/// XCheck Session
export type CrossCheckSessionState =
  | 'DRAFT'
  | 'REQUESTS_GATHERING'
  | 'CROSS_CHECK'
  | 'COMPLETED';

interface CrossCheckSessionAttendee {
  githubId: string;
  reviewerOf: string[];
}

export interface CrossCheckSession {
  id: string;
  state: CrossCheckSessionState;
  taskId: string;
  coefficient: number;
  startDate: string;
  endDate: string;
  discardMinScore: boolean;
  discardMaxScore: boolean;
  minReiewsAmount: number;
  desiredReviewersAmount: number;
  attendees: CrossCheckSessionAttendee[];
}

/// ReviewRequest
export type ReviewRequestState = 'DRAFT' | 'PUBLISHED' | 'COMPLETED';

export interface ReviewRequest {
  id: string;
  crossCheckSessionId: string | null;
  author: string;
  task: string;
  prUrl: string;
  demoUrl: string;
  state: ReviewRequestState;
  selfGrade: TaskScore | null;
}

/// Review
export type ReviewState =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'DISPUTED'
  | 'ACCEPTED'
  | 'REJECTED';

export interface Review {
  id: string;
  requestId: string;
  author: string;
  reviewer: string;
  state: ReviewState;
  task: string;
  grade: TaskScore;
  authorFeedback?: string[];
}

/// Dispute
export type DisputeState = 'ONGOING' | 'ACCEPTED' | 'REJECTED';

export interface Dispute {
  id: string;
  reviewId: string;
  state: DisputeState;
  items: DisputeItem[];
  reviewerComments: DisputeComment[];
}

interface DisputeComment {
  githubId: string;
  comment: string;
}

export interface DisputeItem {
  taskItem: string;
  comment: string;
  suggestedScore: number;
}
