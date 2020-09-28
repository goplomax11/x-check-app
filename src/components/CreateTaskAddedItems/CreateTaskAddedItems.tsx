import React from 'react';
import { Button } from 'antd';
import { TaskItem } from '../../models/data-models';

interface CreateTaskAddedItemsProps {
  items: TaskItem[];
  onChangeItems: (newItems: TaskItem[]) => void;
}
const CreateTaskAddedItems = ({
  items,
  onChangeItems,
}: CreateTaskAddedItemsProps): JSX.Element => {
  const handleDeleteItem = (index: number): void => {
    const newItems = items.filter((item, i) => {
      return index !== i;
    });
    onChangeItems(newItems);
  };
  return (
    <div>
      <h3>Added Items</h3>
      <ul className="added-items">
        {items.length > 0 &&
          items.map((item, index) => {
            const addCategory =
              index === 0 ||
              (index > 0 && item.category !== items[index - 1].category);
            return (
              <React.Fragment key={item.id || item.title}>
                {addCategory && (
                  <li key={item.category}>
                    <strong>{item.category}</strong>
                  </li>
                )}
                <li key={item.isForMentor ? 'for mentor' : 'for all'}>
                  <em>{item.isForMentor && 'Only for mentor'}</em>
                </li>
                <li key={item.id}>
                  {index + 1}. {item.title}.{' '}
                  <em>
                    Score: {item.minScore}-{item.maxScore}
                  </em>
                  <div className="create-task-item-desc">
                    {item.description}
                  </div>
                  <Button
                    type="link"
                    onClick={(): void => handleDeleteItem(index)}
                  >
                    delete
                  </Button>
                </li>
              </React.Fragment>
            );
          })}
      </ul>
    </div>
  );
};

export default CreateTaskAddedItems;
