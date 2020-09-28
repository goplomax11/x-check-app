import { Button } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addReviewRequest, addSingleReview } from '../../actions/actions';
import {
  Auth,
  ReviewRequest,
  ReviewRequestState,
  ReviewState,
  Task,
  TaskScore,
} from '../../models/data-models';
import {
  AppReduxState,
  ReviewRequestsAppState,
  TasksState,
} from '../../models/redux-models';
import RequestReview from '../RequestReview/RequestReview';
import ReviewRequestsTable from '../ReviewRequestsTable/ReviewRequestsTable';
import TaskCheckForm from '../TaskCheckForm/TaskCheckForm';
import './ReviewRequest.scss';

const ReviewRequests = (): JSX.Element => {
  const [showSubmit, setShowSubmit] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [selectedTask, setSelectedTask] = useState({} as Task);
  const [checkedRequest, setCheckedRequest] = useState<ReviewRequest | null>(
    null
  );

  const auth = useSelector<AppReduxState, Auth>(
    (state) => state.auth,
    shallowEqual
  );

  const tasks = useSelector<AppReduxState, TasksState>(
    (state) => state.tasks,
    shallowEqual
  );

  const reviewRequests = useSelector<AppReduxState, ReviewRequestsAppState>(
    (state) => state.reviewRequests,
    shallowEqual
  );

  const dispatch = useDispatch();

  const onSubmitRequestBtnClick = (): void => {
    setShowSubmit(true);
  };

  const onCancel = (): void => {
    setShowSubmit(false);
    setShowCheck(false);
  };

  const onSubmitReviewRequest = (values: Record<string, string>): void => {
    const request: ReviewRequest = {
      id: '',
      crossCheckSessionId: null,
      author: auth.githubId,
      task: values.task,
      prUrl: values['pr-url'],
      demoUrl: values['demo-url'],
      state: 'DRAFT',
      selfGrade: null,
    };

    dispatch(addReviewRequest(request));
    setCheckedRequest(request);
    setSelectedTask(tasks[values.task]);
    setShowCheck(true);
  };

  const onSubmitCheck = (values: TaskScore['items'], state: string): void => {
    setShowCheck(false);
    const request = checkedRequest as ReviewRequest;
    const isSelfCheck = request.author === auth.githubId;
    if (isSelfCheck) {
      dispatch(
        addReviewRequest({
          ...request,
          state: state as ReviewRequestState,
          selfGrade: {
            task: request.task || '',
            items: values,
          },
        })
      );
    } else {
      dispatch(
        addSingleReview({
          id: '',
          requestId: request.id,
          author: request.author,
          reviewer: auth.githubId,
          state: state as ReviewState,
          task: request.task,
          grade: {
            task: request.task || '',
            items: values,
          },
        })
      );
    }
  };

  const onReviewRequestClick = (record: ReviewRequest): void => {
    setCheckedRequest(record);
    setSelectedTask(tasks[record.task]);
    setShowCheck(true);
  };

  return (
    <>
      {auth.roles.includes('student') ? (
        <Button
          className="create-btn"
          type="primary"
          onClick={onSubmitRequestBtnClick}
        >
          Submit request
        </Button>
      ) : null}
      <Modal visible={showSubmit} footer={null} onCancel={onCancel}>
        <RequestReview
          tasks={tasks}
          onHide={onCancel}
          onSubmitClick={onSubmitReviewRequest}
        />
      </Modal>
      {showCheck ? (
        <TaskCheckForm
          singleTask={selectedTask}
          open={showCheck}
          onSubmit={onSubmitCheck}
          onCancel={onCancel}
          checkedRequest={checkedRequest}
        />
      ) : null}
      <ReviewRequestsTable
        reviewRequests={reviewRequests}
        tasks={tasks}
        onReviewRequestClick={onReviewRequestClick}
      />
    </>
  );
};

export default ReviewRequests;
