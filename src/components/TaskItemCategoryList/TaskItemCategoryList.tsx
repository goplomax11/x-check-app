import React from 'react';
import { List } from 'antd';
import { TaskItem } from '../../models/data-models';
import './TaskItemCategoryList.scss';

const TaskItemCategoryList = ({
  items,
}: {
  items: TaskItem[];
}): JSX.Element => {
  return (
    <div>
      <h3>{items[0].category}</h3>
      <List
        itemLayout="horizontal"
        dataSource={items}
        renderItem={(item, i): JSX.Element => (
          <List.Item>
            <List.Item.Meta
              title={`${i + 1}. ${item.title}`}
              description={item.description}
            />
            {item.category !== 'Fines' ? (
              <div>Max Score: {item.maxScore}</div>
            ) : (
              <div>Min Score: {item.minScore}</div>
            )}
          </List.Item>
        )}
      />
    </div>
  );
};

export default TaskItemCategoryList;
