import React, { useState } from 'react';
import { Form, Select, Input } from 'antd';
import { TaskItem } from '../../../models/data-models';
import './CheckTask.scss';

const { Option } = Select;
interface CheckTaskProps {
  taskItem: TaskItem;
  checkedTaskItems: number;
  setCheckedTaskItems: Function;
  setTotalScore: Function;
  itemId: number;
  taskScores: number[];
  setTaskScores: Function;
}

const CheckTask = ({
  taskItem,
  setCheckedTaskItems,
  setTotalScore,
  checkedTaskItems,
  itemId,
  taskScores,
  setTaskScores,
}: CheckTaskProps): JSX.Element => {
  const [selected, setSelected] = useState<boolean>(false);

  const checkScore = (value: number): void => {
    const copy = taskScores;
    copy[itemId] = value;
    setTaskScores(copy);
    const score = copy.reduce((a, b) => {
      return a + b;
    }, 0);
    if (score < 0) {
      setTotalScore(0);
    } else {
      setTotalScore(score);
    }
  };

  const selectHandler = (value: number): void => {
    if (!selected) {
      setSelected(true);
      setCheckedTaskItems(checkedTaskItems + 1);
    }
    checkScore(value);
  };

  const onClear = (): void => {
    setSelected(false);
    setCheckedTaskItems(checkedTaskItems - 1);
    checkScore(0);
  };

  return (
    <div className="task-item">
      <h3 className="title">
        {taskItem.title}
        {taskItem.category === 'Fines' ? null : `: +${taskItem.maxScore}`}
      </h3>
      <hr />
      <div className="task-container">
        <div className="task-max-score">
          <p>Max score</p>
          <p>
            {taskItem.category === 'Fines'
              ? taskItem.minScore
              : taskItem.maxScore}
          </p>
        </div>
        <div className="task-description">
          <p className="task-title">{taskItem.description}</p>
          <Form.Item
            className="check-task__comment"
            name={`comment-${taskItem.id}`}
            label="Comment"
          >
            <Input.TextArea rows={4}/>
          </Form.Item>
        </div>
        <Form.Item
          name={`score-${taskItem.id}`}
          label={taskItem.category}
          rules={[{ required: true }]}
        >
          {taskItem.category === 'Fines' ? (
            <Select
              placeholder="Select a option"
              allowClear
              onSelect={(value: number): void => selectHandler(value)}
              onClear={(): void => onClear()}
            >
              <Option value={taskItem.minScore}>Yes</Option>
              <Option value={taskItem.maxScore}>No</Option>
            </Select>
          ) : (
            <Select
              placeholder="Select a option"
              allowClear
              onSelect={(value: number): void => selectHandler(value)}
              onClear={(): void => onClear()}
            >
              <Option value={0}>Not completed</Option>
              <Option value={taskItem.maxScore / 2}>Partially completed</Option>
              <Option value={taskItem.maxScore}>Fully completed</Option>
            </Select>
          )}
        </Form.Item>
      </div>
    </div>
  );
};

export default CheckTask;
