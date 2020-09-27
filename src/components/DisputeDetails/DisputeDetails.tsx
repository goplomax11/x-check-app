import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { Button, Comment } from 'antd';
import {
  acceptDispute,
  getSingleDispute,
  rejectDispute,
} from '../../actions/actions';
import {
  Auth,
  Dispute,
  Review,
  Task,
  TaskItem,
} from '../../models/data-models';
import { AppReduxState } from '../../models/redux-models';
import StateTag from '../StateTag/StateTag';
import './DisputeDetails.scss';

interface DisputeDetailsProps {
  review: Review;
  task: Task | null;
}

const DisputeDetails = ({ review, task }: DisputeDetailsProps): JSX.Element => {
  type State = Dispute;
  type AppDispatch = ThunkDispatch<State, void, AnyAction>;

  const dispute = useSelector<AppReduxState, Dispute>(
    (state) => state.disputes[review.id]
  );

  const auth = useSelector<AppReduxState, Auth>((state) => state.auth);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(getSingleDispute(review.id));
  }, [dispatch, review.id]);

  const handleAccept = (): void => {
    dispatch(acceptDispute(dispute, { ...review, state: 'ACCEPTED' }));
  };

  const handleReject = (): void => {
    dispatch(rejectDispute(dispute, { ...review, state: 'REJECTED' }));
  };

  return (
    <div className="dispute-deatils">
      <h2>
        Review state: <StateTag state={review.state} />
      </h2>
      {dispute && (
        <ol>
          {task &&
            dispute.items.map((item) => {
              const thisTaskItem: TaskItem | undefined = task.items.find(
                (taskItem) => item.taskItem === taskItem.id
              );
              return (
                <li key={item.taskItem}>
                  <div>Task item: {thisTaskItem?.title}</div>
                  <div>Comment: {item.comment}</div>
                  <div>Suggested score: {item.suggestedScore}</div>
                </li>
              );
            })}
        </ol>
      )}
      {dispute && dispute.reviewerComments.length > 0 && (
        <div>
          <h3>Reviwer comments</h3>
          {dispute.reviewerComments.map((comment) => {
            return (
              <Comment
                key={comment.comment}
                author={comment.githubId}
                avatar={`https://github.com/${comment.githubId}.png?size=40`}
                content={
                  <>
                    <p>{comment.comment}</p>
                  </>
                }
              />
            );
          })}
        </div>
      )}
      {dispute &&
        dispute.state === 'ONGOING' &&
        (auth.githubId.toLowerCase() === review.reviewer.toLowerCase() ||
          auth.roles.includes('supervisor') ||
          auth.roles.includes('coursemanager')) && (
          <div className="dispute-buttons">
            <Button type="primary" size="small" onClick={handleAccept}>
              Accept
            </Button>
            <Button type="primary" size="small" danger onClick={handleReject}>
              Reject
            </Button>
          </div>
        )}
    </div>
  );
};

export default DisputeDetails;
