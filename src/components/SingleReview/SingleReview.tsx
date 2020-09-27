import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { AnyAction } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Button, Descriptions } from 'antd';
import './SingleReview.scss';
import { AppReduxState, TasksState } from '../../models/redux-models';
import { Auth, Review, Task } from '../../models/data-models';
import { getSignleReview, getTasks } from '../../actions/actions';
import calcTotalScore from '../../utils/calcTotalScore';
import StateTag from '../StateTag/StateTag';
import ReviewScoreDetailed from '../ReviewScoreDetailed/ReviewScoreDetailed';
import DisputeDetails from '../DisputeDetails/DisputeDetails';
import FeedbackToReviewer from '../FeedbackToReviewer/FeedbackToReviewer';

const SingleReview = (): JSX.Element => {
  const { reviewId } = useParams<{ reviewId: string }>();

  type State = Review[];
  type AppDispatch = ThunkDispatch<State, void, AnyAction>;

  const auth = useSelector<AppReduxState, Auth>((state) => state.auth);

  const review = useSelector<AppReduxState, Review>(
    (state) => state.reviews[reviewId]
  );
  const tasks = useSelector<AppReduxState, TasksState>((state) => state.tasks);

  const [task, setTask] = useState<Task | null>(null);

  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(getSignleReview(reviewId));
    dispatch(getTasks());
  }, [dispatch, reviewId]);

  useEffect(() => {
    if (review && tasks) {
      const thisTask = tasks[review.task];
      setTask(thisTask || null);
    }
  }, [review, tasks]);

  const history = useHistory();
  const handleAddDispute = (): void => {
    history.push(`/create-dispute/${reviewId}`);
  };

  return (
    <Descriptions title="Review Info" layout="vertical" bordered>
      {task && (
        <Descriptions.Item label="Task" span={2}>
          {task.title}
        </Descriptions.Item>
      )}
      {review && (
        <>
          <Descriptions.Item label="State" span={1}>
            <StateTag state={review.state} />
            {review.author.toLowerCase() === auth.githubId.toLowerCase() &&
              review.state === 'PUBLISHED' && (
                <Button
                  type="primary"
                  size="small"
                  className="dispute-btn"
                  onClick={handleAddDispute}
                >
                  Dispute
                </Button>
              )}
          </Descriptions.Item>
          <Descriptions.Item label="Author" span={1}>
            {review.author}
          </Descriptions.Item>
          <Descriptions.Item label="Reviewer" span={1}>
            {review.reviewer}
          </Descriptions.Item>
          <Descriptions.Item label="Total Score" span={1}>
            {calcTotalScore(review.grade)}
          </Descriptions.Item>
        </>
      )}
      {task && review && (
        <Descriptions.Item label="Detailed Score" span={3}>
          <ReviewScoreDetailed taskItems={task.items} review={review} />
        </Descriptions.Item>
      )}
      {review && review.state !== 'DRAFT' && review.state !== 'PUBLISHED' && (
        <Descriptions.Item label="Dispute Details" span={2}>
          <DisputeDetails review={review} task={task} />
        </Descriptions.Item>
      )}
      {review && (
        <Descriptions.Item label="Feedback to Reviewer">
          <FeedbackToReviewer review={review} />
        </Descriptions.Item>
      )}
    </Descriptions>
  );
};

export default SingleReview;
