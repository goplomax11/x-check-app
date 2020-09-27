import { Button } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { request } from 'http';
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
    
    dispatch(addReviewRequest(request));
    setCheckedRequest(request);
    setSelectedTask(tasks[values.task]);
    setShowCheck(true);
  };

  const onSubmitCheck = (values: any): void => {
    setShowCheck(false);
    const request = checkedRequest as ReviewRequest;
    dispatch(
      addReviewRequest({
        ...request,
        selfGrade: {
          task: request.task || '',
          items: values,
        }
      })
    );
  };

  const onReviewRequestClick = (record: ReviewRequest) => {
    setCheckedRequest(record);
    setSelectedTask(tasks[record.task]);
    setShowCheck(true);
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
