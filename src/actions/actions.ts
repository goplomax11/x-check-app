import { AnyAction } from 'redux';
import * as ACTIONS from '../constants/actions';
import DataService from '../services/data-service';
import { v4 as uuidv4 } from 'uuid';
import {
  Dispute,
  Review,
  ReviewRequest,
  Task,
  TaskScore,
  User,
} from '../models/data-models';

const dataService = new DataService();

export const loginUser = (userObj: User) => async (
  dispatch: (action: AnyAction) => void
): Promise<void> => {
  const { githubId, roles } = userObj;
  try {
    const user: User = await dataService.getSingleUser(githubId);
    if (!user) {
      await dataService.addUser({
        githubId,
        roles,
      });
    } else {
      await dataService.putUser(userObj);
    }
    dispatch({
      type: ACTIONS.LOGIN,
      payload: { ...userObj },
    });
  } catch {
    dispatch({
      type: ACTIONS.ADD_ERROR,
      error: {
        message: 'There was an error while login.',
      },
    });
  }
};

export const logoutUser = (): AnyAction => {
  localStorage.removeItem('githubId');
  return {
    type: ACTIONS.LOGOUT,
  };
};

export const authChooseUserRole = (userObj: User): AnyAction => {
  return {
    type: ACTIONS.LOGIN_CHOSE_ROLE,
    payload: { ...userObj },
  };
};

export const githubUserFetch = (code: string) => async (
  dispatch: (action: AnyAction) => void
): Promise<void> => {
  try {
    dispatch({ type: ACTIONS.LOGIN_STARTED });
    const githubId: string = await dataService.getGitHubLogin(code);

    localStorage.setItem('githubId', githubId);
    dispatch(authChooseUserRole({ githubId, roles: ['student'] }));
  } catch {
    dispatch({
      type: ACTIONS.ADD_ERROR,
      error: {
        message: 'There was an error while login.',
      },
    });
  }
};

export const postUserFetch = () => async (
  dispatch: (action: AnyAction) => void
): Promise<void> => {
  try {
    const githubId = localStorage.getItem('githubId') || '';
    if (githubId) {
      const user: User = await dataService.getSingleUser(githubId);
      if (user) {
        dispatch({
          type: ACTIONS.LOGIN,
          payload: { githubId, roles: user.roles },
        });
      }
    }
  } catch {
    dispatch({
      type: ACTIONS.ADD_ERROR,
      error: {
        message: 'There was an error while loading user.',
      },
    });
  }
};

export const getTasks = () => async (
  dispatch: (action: AnyAction) => void
): Promise<void> => {
  return dataService
    .getAllTasks()
    .then((body) => {
      dispatch({
        type: ACTIONS.GET_TASKS,
        payload: {
          res: body,
        },
      });
    })
    .catch(() => {
      dispatch({
        type: ACTIONS.ADD_ERROR,
        error: {
          message: 'There was an error while loading tasks.',
        },
      });
    });
};

export const getSignleTask = (taskId: string) => async (
  dispatch: (action: AnyAction) => void
): Promise<void> => {
  return dataService
    .getSingleTask(taskId)
    .then((body) => {
      dispatch({
        type: ACTIONS.GET_SINGLE_TASK,
        payload: {
          res: body,
        },
      });
    })
    .catch(() => {
      dispatch({
        type: ACTIONS.ADD_ERROR,
        error: {
          message: 'There was an error while loading task.',
        },
      });
    });
};

export const createTask = (task: Task) => async (
  dispatch: (action: AnyAction) => void
): Promise<void> => {
  const taskItemsWithIds = task.items.map((item) => {
    return { ...item, id: item.id || uuidv4() };
  });
  return dataService
    .addTask({ ...task, items: taskItemsWithIds, id: task.id || uuidv4() })
    .then((body) => {
      dispatch({
        type: ACTIONS.CREATE_TASK,
        payload: {
          res: body,
        },
      });
    })
    .catch(() => {
      dispatch({
        type: ACTIONS.ADD_ERROR,
        error: {
          message: 'There was an error while adding task.',
        },
      });
    });
};

export const updateTask = (task: Task) => async (
  dispatch: (action: AnyAction) => void
): Promise<void> => {
  const taskItemsWithIds = task.items.map((item) => {
    return { ...item, id: item.id || uuidv4() };
  });
  return dataService
    .updateTask({ ...task, items: taskItemsWithIds, id: task.id || uuidv4() })
    .then((body) => {
      dispatch({
        type: ACTIONS.UPDATE_TASK,
        payload: {
          res: body,
        },
      });
    })
    .catch(() => {
      dispatch({
        type: ACTIONS.ADD_ERROR,
        error: {
          message: 'There was an error while editing task.',
        },
      });
    });
};

export const deleteTask = (taskId: string) => async (
  dispatch: (action: AnyAction) => void
): Promise<void> => {
  try {
    await dataService.deleteTask(taskId);
    return dispatch({
      type: ACTIONS.DELETE_TASK,
      payload: taskId,
    });
  } catch {
    dispatch({
      type: ACTIONS.ADD_ERROR,
      error: {
        message: 'There was an error while deleting task.',
      },
    });
  }
};

export const getUsers = () => async (
  dispatch: (action: AnyAction) => void
): Promise<void> => {
  return dataService
    .getAllUsers()
    .then((body) => {
      dispatch({
        type: ACTIONS.GET_USERS,
        payload: {
          res: body,
        },
      });
    })
    .catch(() => {
      dispatch({
        type: ACTIONS.ADD_ERROR,
        error: {
          message: 'There was an error while loading users.',
        },
      });
    });
};

export const getReviews = () => async (
  dispatch: (action: AnyAction) => void
): Promise<void> => {
  return dataService
    .getAllReviews()
    .then((body) => {
      dispatch({
        type: ACTIONS.GET_REVIEWS,
        payload: {
          res: body,
        },
      });
    })
    .catch(() => {
      dispatch({
        type: ACTIONS.ADD_ERROR,
        error: {
          message: 'There was an error while loading reviews.',
        },
      });
    });
};

export const getSignleReview = (reviewId: string) => async (
  dispatch: (action: AnyAction) => void
): Promise<void> => {
  return dataService
    .getSingleReview(reviewId)
    .then((body) => {
      dispatch({
        type: ACTIONS.GET_SINGLE_REVIEW,
        payload: {
          res: body,
        },
      });
    })
    .catch(() => {
      dispatch({
        type: ACTIONS.ADD_ERROR,
        error: {
          message: 'There was an error while loading review.',
        },
      });
    });
};

export const getDisputes = () => async (
  dispatch: (action: AnyAction) => void
): Promise<void> => {
  return dataService
    .getAllDisputes()
    .then((body) => {
      dispatch({
        type: ACTIONS.GET_DISPUTES,
        payload: {
          res: body,
        },
      });
    })
    .catch(() => {
      dispatch({
        type: ACTIONS.ADD_ERROR,
        error: {
          message: 'There was an error while loading disputes.',
        },
      });
    });
};

export const getSingleDispute = (reviewId: string) => async (
  dispatch: (action: AnyAction) => void
): Promise<void> => {
  return dataService
    .getSingleDispute(reviewId)
    .then((body) => {
      dispatch({
        type: ACTIONS.GET_SINGLE_DISPUTE,
        payload: {
          res: body,
        },
      });
    })
    .catch(() => {
      dispatch({
        type: ACTIONS.ADD_ERROR,
        error: {
          message: 'There was an error while loading dispute.',
        },
      });
    });
};

export const addDispute = (dispute: Dispute, review: Review) => async (
  dispatch: (action: AnyAction) => void
): Promise<void> => {
  try {
    const receivedDispute = await dataService.addDispute(dispute);
    const receivedReview = await dataService.updateReview(review);
    dispatch({
      type: ACTIONS.ADD_DISPUTE,
      payload: {
        res: receivedDispute,
      },
    });
    dispatch({
      type: ACTIONS.CHANGE_REVIEW,
      payload: {
        res: receivedReview,
      },
    });
  } catch (error) {
    dispatch({
      type: ACTIONS.ADD_ERROR,
      error: {
        message: 'There was an error while adding dispute.',
      },
    });
  }
};

export const acceptDispute = (dispute: Dispute, review: Review) => async (
  dispatch: (action: AnyAction) => void
): Promise<void> => {
  const newDispute = { ...dispute, state: 'ACCEPTED' } as Dispute;
  try {
    const receivedDispute = await dataService.updateDispute(newDispute);
    dispatch({
      type: ACTIONS.ACCEPT_DISPUTE,
      payload: {
        res: receivedDispute,
      },
    });
    const newScore: TaskScore = { ...review.grade };
    dispute.items.forEach((disputeItem) => {
      newScore.items[disputeItem.taskItem].score = disputeItem.suggestedScore;
    });
    const newReview = { ...review, grade: newScore } as Review;
    const receivedReview = await dataService.updateReview(newReview);
    dispatch({
      type: ACTIONS.CHANGE_REVIEW,
      payload: {
        res: receivedReview,
      },
    });
  } catch {
    dispatch({
      type: ACTIONS.ADD_ERROR,
      error: {
        message: 'There was an error while editing dispute.',
      },
    });
  }
};

export const rejectDispute = (dispute: Dispute, review: Review) => async (
  dispatch: (action: AnyAction) => void
): Promise<void> => {
  const newDispute = { ...dispute, state: 'REJECTED' } as Dispute;
  try {
    const receivedDispute = await dataService.updateDispute(newDispute);
    dispatch({
      type: ACTIONS.REJECT_DISPUTE,
      payload: {
        res: receivedDispute,
      },
    });
    dispatch({
      type: ACTIONS.CHANGE_REVIEW,
      payload: {
        res: review,
      },
    });
  } catch {
    dispatch({
      type: ACTIONS.ADD_ERROR,
      error: {
        message: 'There was an error while editing dispute.',
      },
    });
  }
};

export const deleteDispute = (dispute: Dispute) => async (
  dispatch: (action: AnyAction) => void
): Promise<void> => {
  try {
    const deleted = await dataService.deleteDispute(dispute.id);
    dispatch({
      type: ACTIONS.DELETE_DISPUTE,
      payload: dispute.reviewId,
    });
    return;
  } catch {
    dispatch({
      type: ACTIONS.ADD_ERROR,
      error: {
        message: 'There was an error while deleting dispute.',
      },
    });
  }
};

export const addFeedbackToReview = (message: string, review: Review) => async (
  dispatch: (action: AnyAction) => void
): Promise<void> => {
  const newAuthorFeedback = review.authorFeedback
    ? [...review.authorFeedback, message]
    : [message];
  const newReview = { ...review, authorFeedback: newAuthorFeedback };
  try {
    const receivedReview = await dataService.updateReview(newReview);
    dispatch({
      type: ACTIONS.CHANGE_REVIEW,
      payload: {
        res: receivedReview,
      },
    });
  } catch {
    dispatch({
      type: ACTIONS.ADD_ERROR,
      error: {
        message: 'There was an error while adding feedback.',
      },
    });
  }
};

export const getReviewRequests = () => async (
  dispatch: (action: AnyAction) => void
): Promise<void> => {
  return dataService.getAllReviewRequests().then((body) => {
    dispatch({
      type: ACTIONS.GET_REVIEW_REQUESTS,
      payload: {
        res: body,
      },
    });
  });
};

export const addReviewRequest = (reviewRequest: ReviewRequest) => async (
  dispatch: (action: AnyAction) => void
): Promise<void> => {
  let request = await dataService.getReviewRequestByUserTask(
    reviewRequest.author,
    reviewRequest.task
  );

  if (!request) {
    request = await dataService.addSingleReviewRequest(reviewRequest);
  } else {
    request = await dataService.putReviewRequest({
      ...reviewRequest,
      id: request.id,
    });
  }

  dispatch({
    type: ACTIONS.ADD_REVIEW_REQUEST,
    payload: { ...request },
  });
};

export const deleteReviewRequest = (reviewRequest: ReviewRequest) => async (
  dispatch: (action: AnyAction) => void
): Promise<void> => {
  try {
    const deleted = await dataService.deleteReviewRequest(reviewRequest.id);
    dispatch({
      type: ACTIONS.DELETE_REVIEW_REQUEST,
      payload: reviewRequest.id,
    });
    return;
  } catch {
    dispatch({
      type: ACTIONS.ADD_ERROR,
      error: {
        message: 'There was an error while deleting review request.',
      },
    });
  }
};

export const createSession = (session: any) => async (
  dispatch: (action: AnyAction) => void
): Promise<void> => {
  dataService
    .addSession(session)
    .then((body) => {
      dispatch({
        type: ACTIONS.CREATE_SESSION,
        payload: {
          res: body,
        },
      });
    })
    .catch(() => {
      dispatch({
        type: ACTIONS.ADD_ERROR,
        error: {
          message: 'There was an error while adding session.',
        },
      });
    });
};


export const getSession = () => async (
  dispatch: (action: AnyAction) => void
): Promise<void> => {
  dataService
    .getAllCrossCheckSessions()
    .then((body) => {
      dispatch({
        type: ACTIONS.GET_SESSIONS,
        payload: {
          res: body,
        },
      });
    })
    .catch(() => {
      dispatch({
        type: ACTIONS.ADD_ERROR,
        error: {
          message: 'There was an error while loading sessions.',
        },
      });
    });
};