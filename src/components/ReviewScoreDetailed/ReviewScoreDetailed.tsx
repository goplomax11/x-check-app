import { List, Comment } from 'antd';
import React from 'react';
import { Review, TaskItem } from '../../models/data-models';

interface ReviewScoreDetailedProps {
  taskItems: TaskItem[];
  review: Review;
}

const ReviewScoreDetailed = ({
  taskItems,
  review,
}: ReviewScoreDetailedProps): JSX.Element => {
  return (
    <List itemLayout="horizontal">
      {taskItems.map((item: TaskItem) => {
        if (review.grade.items[item.id]) {
          return (
            <List.Item className="single-review-item" key={item.id}>
              <List.Item.Meta
                title={item.title}
                description={item.description}
              />
              <div>{review.grade.items[item.id].score}</div>
              {review.grade.items[item.id].comment && (
                <Comment
                  author={review.reviewer}
                  avatar={`https://github.com/${review.reviewer}.png?size=40`}
                  content={
                    <>
                      <p>{review.grade.items[item.id].comment}</p>
                    </>
                  }
                />
              )}
            </List.Item>
          );
        }
        return null;
      })}
    </List>
  );
};

export default ReviewScoreDetailed;
