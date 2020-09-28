import React from 'react';
import { CrossCheckSession } from '../../models/data-models';
import { TasksState } from '../../models/redux-models';
import SessionActions from '../SessionActions/SessionActions';

interface SingleSessionProps {
  session: CrossCheckSession;
  key: string;
  tasks: TasksState;
}

const SingleSession = ({ session, tasks }: SingleSessionProps): JSX.Element => {
  const { attendees } = session;
  const students = attendees.map((user) => {
    return <div key={user.githubId}>{user.githubId}</div>;
  });

  return (
    <>
      <div>Start date: {session.startDate}</div>
      <div>Deadline: {session.endDate}</div>
      <div>Coefficient: {session.coefficient}</div>
      <div>
        Students:{' '}
        {students.length > 0 ? students : 'No student submissions yet.'}
      </div>
      <SessionActions session={session} tasks={tasks} />
    </>
  );
};

export default SingleSession;
