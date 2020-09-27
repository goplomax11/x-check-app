import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { AppReduxState, TasksState } from '../../models/redux-models';
import { Dispute, DisputeItem, Review, Task, TaskItem } from '../../models/data-models';
import { addDispute, getSignleReview, getTasks } from '../../actions/actions';
import DisputeForm from '../DisputeForm/DisputeForm';
import './CreateDispute.scss';

const CreateDispute = (): JSX.Element => {
  const { reviewId } = useParams<{ reviewId: string }>();
  type State = Review[];
  type AppDispatch = ThunkDispatch<State, void, AnyAction>;

  const review = useSelector<AppReduxState, Review>(
    (state) => state.reviews[reviewId]
  );
  const tasks = useSelector<AppReduxState, TasksState>((state) => state.tasks);

  const [task, setTask] = useState<Task | null>(null);
  const [disputeItems, setDisputeItems] = useState<DisputeItem[]>([]);

  const history = useHistory();
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

  const handleSubmit = (): void => {
    if (disputeItems.length > 0) {
      const newDispute: Dispute = {
        id: uuidv4(),
        reviewId,
        state: 'ONGOING',
        items: disputeItems,
        reviewerComments: [],
      };
      dispatch(addDispute(newDispute, { ...review, state: 'DISPUTED' }));
    }
    history.push('/reviews');
  };

  const handleCancel = (): void => {
    setDisputeItems([]);
    history.push('/reviews');
  };

  const addItemDispute = (
    score: number,
    message: string,
    taskItemId: string
  ): void => {
    setDisputeItems([
      ...disputeItems,
      {
        taskItem: taskItemId,
        comment: message,
        suggestedScore: score,
      } as DisputeItem,
    ]);
  };

  return (
    <>
      <div className="create-dispute">
        Task items, where you didn&apos;t get max score:
        <ol>
          {task?.items.map((taskItem: TaskItem) => {
            if (
              review.grade.items[taskItem.id] &&
              taskItem.maxScore > review.grade.items[taskItem.id].score
            ) {
              return (
                <li key={taskItem.id}>
                  <strong>{taskItem.title}.</strong> Max possible score:{' '}
                  {taskItem.maxScore}
                  <DisputeForm taskItem={taskItem} onSubmit={addItemDispute} />
                </li>
              );
            }
            return null;
          })}
        </ol>
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleSubmit}
          className="submit-btn"
        >
          Submit
        </Button>
        <Button type="default" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
      {disputeItems.length > 0 && (
        <div className="submitted-items">
          <h3>Submitted dispute items</h3>
          <ol>
            {disputeItems.map((item) => {
              return (
                <li key={item.taskItem}>
                  <strong>{item.comment}.</strong> Suggested score:{' '}
                  {item.suggestedScore}
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </>
  );
};

export default CreateDispute;
