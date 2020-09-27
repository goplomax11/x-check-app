import { Button } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { request } from 'https';
import React, { useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addReviewRequest } from '../../actions/actions';
import { Auth, ReviewRequest, Task } from '../../models/data-models';
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
  const [showSelfCheck, setShowSelfCheck] = useState(false);
  const [selectedTask, setSelectedTask] = useState({} as Task);
  const [currentRequest, setCurrentRequest] = useState({} as ReviewRequest);

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
    setShowSelfCheck(false);
  };

  const onSubmitReviewRequest = (values: Record<string, any>): void => {
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
    setCurrentRequest(request);
    setSelectedTask(tasks[values.task]);
    setShowSelfCheck(true);
  };

  const onSubmitSelfCheck = (values: any): void => {
    setShowSelfCheck(false);
    const requestToAdd = {
      ...currentRequest,
      state: 'PUBLISHED',
      selfGrade: {
        task: currentRequest.task,
        items: values,
      },
    };
    dispatch(addReviewRequest(requestToAdd as ReviewRequest));
    console.log(values);
  };

  return (
    <>
      <Button
        className="create-btn"
        type="primary"
        onClick={onSubmitRequestBtnClick}
      >
        Submit request
      </Button>
      <Modal visible={showSubmit} footer={null} onCancel={onCancel}>
        <RequestReview
          tasks={tasks}
          onHide={onCancel}
          onSubmitClick={onSubmitReviewRequest}
        />
      </Modal>
      {showSelfCheck ? (
        <TaskCheckForm
          singleTask={selectedTask}
          open={showSelfCheck}
          onSubmit={onSubmitSelfCheck}
          onCancel={onCancel}
        />
      ) : null}
      <ReviewRequestsTable reviewRequests={reviewRequests} tasks={tasks} />
    </>
  );
};

export default ReviewRequests;
