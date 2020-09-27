import React from 'react';
import { Comment } from 'antd';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Auth, Review } from '../../models/data-models';
import FeedbackForm from '../FeedbackForm/FeedbackForm';
import { addFeedbackToReview } from '../../actions/actions';
import { AppReduxState } from '../../models/redux-models';

const FeedbackToReviewer = ({ review }: { review: Review }): JSX.Element => {
  type State = Review[];
  type AppDispatch = ThunkDispatch<State, void, AnyAction>;
  const dispatch: AppDispatch = useDispatch();

  const handleAddFeedback = (message: string): void => {
    dispatch(addFeedbackToReview(message, review));
  };

  const auth = useSelector<AppReduxState, Auth>((state) => state.auth);

  return (
    <>
      {review.authorFeedback &&
        review.authorFeedback.map((text) => {
          return (
            <Comment
              key={text}
              author={review.author}
              avatar={`https://github.com/${review.author}.png?size=40`}
              content={<p>{text}</p>}
            />
          );
        })}
      {!review.authorFeedback ||
        (review.authorFeedback.length === 0 && <p>No feedback yet.</p>)}
      {review.author.toLowerCase() === auth.githubId.toLowerCase() && (
        <FeedbackForm onSubmit={handleAddFeedback} />
      )}
    </>
  );
};

export default FeedbackToReviewer;
