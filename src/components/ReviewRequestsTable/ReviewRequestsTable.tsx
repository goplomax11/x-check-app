import React from 'react';
import { Button, Table } from 'antd';
import { ColumnFilterItem } from 'antd/lib/table/interface';
import { useSelector, shallowEqual } from 'react-redux';
import {
  AppReduxState,
  ReviewRequestsAppState,
  TasksState,
} from '../../models/redux-models';
import StateTag from '../StateTag/StateTag';
import compareStrings from '../../utils/helpers';
import {
  Auth,
  ReviewRequest,
  ReviewRequestState,
} from '../../models/data-models';

export interface ReviewRequestsTableProps
  extends React.HTMLAttributes<HTMLDivElement> {
  reviewRequests: ReviewRequestsAppState;
  tasks: TasksState;
  onReviewRequestClick: (record: ReviewRequest) => void;
}

const ReviewRequestsTable = (props: ReviewRequestsTableProps): JSX.Element => {
  const { reviewRequests, tasks, onReviewRequestClick } = props;
  const reviewRequestsArr = Object.values(reviewRequests);

  const auth = useSelector<AppReduxState, Auth>(
    (state) => state.auth,
    shallowEqual
  );

  const getTaskTitle = (taskId: string): string | undefined => {
    const task = tasks[taskId];
    return task ? task.title : undefined;
  };

  const filters = {
    createTaskFilters: (): ColumnFilterItem[] => {
      const tasksInTable: string[] = [];

      reviewRequestsArr.forEach((reviewRequest) => {
        if (!tasksInTable.includes(reviewRequest.task)) {
          tasksInTable.push(reviewRequest.task);
        }
      });

      const taskTitles = tasksInTable.map((taskId) => {
        const thisTaskTitle = getTaskTitle(taskId);
        if (thisTaskTitle) {
          return {
            text: thisTaskTitle,
            value: thisTaskTitle,
          } as ColumnFilterItem;
        }
        return {
          text: taskId,
          value: taskId,
        } as ColumnFilterItem;
      });
      return taskTitles;
    },
    createAuthorFilter: (): ColumnFilterItem[] => {
      const names: string[] = [];
      reviewRequestsArr.forEach((reviewRequest) => {
        if (!names.includes(reviewRequest.author)) {
          names.push(reviewRequest.author);
        }
      });
      return names.map((name: string) => {
        return { text: name, value: name } as ColumnFilterItem;
      });
    },
    createStateFilters: (): ColumnFilterItem[] => {
      const states: ReviewRequestState[] = [];
      reviewRequestsArr.forEach((reviewRequest) => {
        if (!states.includes(reviewRequest.state)) {
          states.push(reviewRequest.state);
        }
      });
      return states.map((state: ReviewRequestState) => {
        return {
          text: state,
          value: state,
        } as ColumnFilterItem;
      });
    },
  };

  const filtering = {
    tasks: (
      value: string | number | boolean,
      reviewRequest: ReviewRequest
    ): boolean => {
      const taskTitle = getTaskTitle(reviewRequest.task);
      if (taskTitle) {
        return taskTitle.indexOf(value.toString()) !== -1;
      }
      return false;
    },
    authors: (
      value: string | number | boolean,
      reviewRequest: ReviewRequest
    ): boolean => {
      return reviewRequest.author.indexOf(value.toString()) !== -1;
    },
    states: (
      value: string | number | boolean,
      reviewRequest: ReviewRequest
    ): boolean => {
      return reviewRequest.state.indexOf(value.toString()) !== -1;
    },
  };

  const sorting = {
    strings: (a: ReviewRequest, b: ReviewRequest): number => {
      const A = a.author.toUpperCase();
      const B = b.author.toUpperCase();
      return compareStrings(A, B);
    },
    titles: (a: ReviewRequest, b: ReviewRequest): number => {
      const A = tasks[a.task];
      const B = tasks[b.task];
      if (A && B) {
        return compareStrings(A.title, B.title);
      }
      return 1;
    },
  };

  const rendering = {
    tag: (state: string): JSX.Element => {
      return <StateTag state={state} />;
    },
    taskTitle: (task: string, record: ReviewRequest): JSX.Element => {
      return (
        <Button
          type="link"
          disabled={
            !(
              auth.roles.includes('student') ||
              auth.roles.includes('coursemanager')
            )
          }
          onClick={(): void => {
            onReviewRequestClick(record);
          }}
        >
          {getTaskTitle(task)}
        </Button>
      );
    },
    author: (author: string): string => {
      return author;
    },
    url: (url: string): JSX.Element => {
      return (
        <a href={`${url}`} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      );
    },
  };

  return (
    <Table
      dataSource={reviewRequestsArr}
      rowKey={(review): string => review.id}
    >
      <Table.Column
        key="task"
        title="Task"
        dataIndex="task"
        render={rendering.taskTitle}
        sorter={sorting.titles}
        onFilter={filtering.tasks}
        filters={filters.createTaskFilters()}
      />
      <Table.Column
        key="author"
        title="Author"
        dataIndex="author"
        render={rendering.author}
        sorter={sorting.strings}
        onFilter={filtering.authors}
        filters={filters.createAuthorFilter()}
      />
      <Table.Column
        key="state"
        title="State"
        dataIndex="state"
        render={rendering.tag}
        sorter={sorting.strings}
        onFilter={filtering.states}
        filters={filters.createStateFilters()}
      />
      <Table.Column
        key="prUrl"
        title="Pull Request"
        dataIndex="prUrl"
        render={rendering.url}
        // sorter={sorting.names}
        // onFilter={filtering.reviewers}
        // filters={filters.createReviewerFilters()}
      />
      <Table.Column
        key="demoUrl"
        title="Demo"
        dataIndex="demoUrl"
        render={rendering.url}
        // sorter={sorting.names}
        // onFilter={filtering.reviewers}
        // filters={filters.createReviewerFilters()}
      />
    </Table>
  );
};

export default ReviewRequestsTable;
