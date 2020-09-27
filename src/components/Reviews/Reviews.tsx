import React, { useEffect } from 'react';
import { AnyAction } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Link } from 'react-router-dom';
import { Table } from 'antd';
import { ColumnFilterItem } from 'antd/lib/table/interface';
import { getReviews, getTasks } from '../../actions/actions';
import { Review, TaskScore, ReviewState } from '../../models/data-models';
import {
  AppReduxState,
  ReviewsState,
  TasksState,
} from '../../models/redux-models';
import calcTotalScore from '../../utils/calcTotalScore';
import StateTag from '../StateTag/StateTag';
import { compareStrings } from '../../utils/helpers';
import './Reviews.scss';

type AppDispatch = ThunkDispatch<ReviewsState, void, AnyAction>;

const Reviews = (): JSX.Element => {
  const reviewsArr = useSelector<AppReduxState, Review[]>((state): Review[] => {
    if (
      state.auth.roles.includes('supervisor') ||
      state.auth.roles.includes('coursemanager')
    ) {
      return Object.values(state.reviews);
    }
    const reviewsArray = Object.values(state.reviews).filter(
      (review: Review) => {
        return (
          review.author.toLowerCase() === state.auth.githubId.toLowerCase() ||
          review.reviewer.toLowerCase() === state.auth.githubId.toLowerCase()
        );
      }
    );
    return reviewsArray;
  });
  const tasks = useSelector<AppReduxState, TasksState>((state) => state.tasks);

  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(getReviews());
    dispatch(getTasks());
  }, [dispatch]);

  // const [reviewsArr, setReviewsArr] = useState<Review[]>([]);

  // useEffect(() => {
  //   setReviewsArr(Object.values(reviews));
  // }, [reviews]);

  const getTaskTitle = (taskId: string): string | undefined => {
    const task = tasks[taskId];
    return task ? task.title : undefined;
  };

  const createNameFilters = (
    role: 'author' | 'reviewer'
  ): ColumnFilterItem[] => {
    const names: string[] = [];
    reviewsArr.forEach((review) => {
      if (!names.includes(review[role])) {
        names.push(review[role]);
      }
    });
    return names.map((name: string) => {
      return { text: name, value: name } as ColumnFilterItem;
    });
  };

  /// functions for table - sort, render, filter, and filter names
  const sorting = {
    names: (a: Review, b: Review): number => {
      const A = a.author.toUpperCase();
      const B = b.author.toUpperCase();
      return compareStrings(A, B);
    },
    titles: (a: Review, b: Review): number => {
      const A = tasks[a.task];
      const B = tasks[b.task];
      if (A && B) {
        return compareStrings(A.title, B.title);
      }
      return 1;
    },
    scores: (a: Review, b: Review): number => {
      return calcTotalScore(a.grade) - calcTotalScore(b.grade);
    },
  };

  const rendering = {
    tag: (state: string): JSX.Element => {
      return <StateTag state={state} />;
    },
    taskTitle: (taskId: string, review: Review): JSX.Element | null => {
      const currentTask = tasks[taskId];
      if (currentTask) {
        return <Link to={`/reviews/${review.id}`}>{currentTask.title}</Link>;
      }
      return null;
    },
    score: (grade: TaskScore): number => {
      return calcTotalScore(grade);
    },
  };

  const filters = {
    createTaskFilters: (): ColumnFilterItem[] => {
      const reviewedTasks: string[] = [];
      reviewsArr.forEach((review) => {
        if (!reviewedTasks.includes(review.task)) {
          reviewedTasks.push(review.task);
        }
      });
      const taskTitles = reviewedTasks.map((taskId) => {
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
    createAuthorFilters: (): ColumnFilterItem[] => createNameFilters('author'),
    createReviewerFilters: (): ColumnFilterItem[] =>
      createNameFilters('reviewer'),
    createStateFilters: (): ColumnFilterItem[] => {
      const states: ReviewState[] = [
        'PUBLISHED',
        'DISPUTED',
        'ACCEPTED',
        'REJECTED',
        'DRAFT',
      ];
      return states.map((state: ReviewState) => {
        return {
          text: state,
          value: state,
        } as ColumnFilterItem;
      });
    },
  };

  const filtering = {
    tasks: (value: string | number | boolean, review: Review): boolean => {
      const taskTitle = getTaskTitle(review.task);
      if (taskTitle) {
        return taskTitle.indexOf(value.toString()) !== -1;
      }
      return false;
    },
    authors: (value: string | number | boolean, review: Review): boolean => {
      return review.author.indexOf(value.toString()) !== -1;
    },
    reviewers: (value: string | number | boolean, review: Review): boolean => {
      return review.reviewer.indexOf(value.toString()) !== -1;
    },
    states: (value: string | number | boolean, review: Review): boolean => {
      return review.state.indexOf(value.toString()) !== -1;
    },
  };

  return (
    <div className="reviews">
      <Table dataSource={reviewsArr} rowKey={(review): string => review.id}>
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
          sorter={sorting.names}
          onFilter={filtering.authors}
          filters={filters.createAuthorFilters()}
        />
        <Table.Column
          key="reviewer"
          title="Reviewer"
          dataIndex="reviewer"
          sorter={sorting.names}
          onFilter={filtering.reviewers}
          filters={filters.createReviewerFilters()}
        />
        <Table.Column
          key="state"
          title="State"
          dataIndex="state"
          render={rendering.tag}
          onFilter={filtering.states}
          filters={filters.createStateFilters()}
        />
        <Table.Column
          key="grade"
          title="Score"
          dataIndex="grade"
          render={rendering.score}
          sorter={sorting.scores}
        />
      </Table>
    </div>
  );
};

export default Reviews;
