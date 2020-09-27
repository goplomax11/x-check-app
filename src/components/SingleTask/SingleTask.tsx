import React from 'react';
import { Task, TaskItem } from '../../models/data-models';
import TaskItemCategoryList from '../TaskItemCategoryList/TaskItemCategoryList';
import TaskActions from '../TaskActions/TaskActions';

interface SingleTaskProps {
  singleTask: Task;
}

const SingleTask = ({ singleTask }: SingleTaskProps): JSX.Element => {
  const [basic, extra, fines]: Array<TaskItem[]> = [[], [], []];
  singleTask.items.forEach((item) => {
    switch (item.category) {
      case 'Basic Scope':
        basic.push(item);
        break;
      case 'Extra Scope':
        extra.push(item);
        break;
      case 'Fines':
        fines.push(item);
        break;
      default:
        basic.push(item);
    }
  });

  return (
    <>
      <p>
        <strong>Author: {singleTask.author}</strong>
      </p>
      {basic.length > 0 && <TaskItemCategoryList items={basic} />}
      {extra.length > 0 && <TaskItemCategoryList items={extra} />}
      {fines.length > 0 && <TaskItemCategoryList items={fines} />}
      <TaskActions task={singleTask} />
    </>
  );
};

export default SingleTask;
