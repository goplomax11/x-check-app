import React, { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppReduxState } from '../../../models/redux-models';
import { Form, Select, InputNumber, Divider, Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { TaskItem, Auth } from '../../../models/data-models';
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
  checkedTasks: boolean[];
  setCheckedTasks: Function;
}

const CheckTask = ({
  taskItem,
  setCheckedTaskItems,
  setTotalScore,
  checkedTaskItems,
  itemId,
  taskScores,
  setTaskScores,
  checkedTasks,
  setCheckedTasks,
}: CheckTaskProps): JSX.Element => {
  const [otherScore, setOtherScore] = useState<number>(0);
  const [baseScores, setBaseScores] = useState<number[]>([
    0,
    taskItem.maxScore / 2,
    taskItem.maxScore,
  ]);

  const [scoreCategory, setScoreCategory] = useState<string[]>([
    'Not completed',
    'Partially completed',
    'Fully completed',
  ]);

  const auth = useSelector<AppReduxState, Auth>((state) => state.auth);

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
    if (!checkedTasks[itemId]) {
      const copy = checkedTasks;
      copy[itemId] = true;
      setCheckedTasks(copy);
      setCheckedTaskItems(checkedTaskItems + 1);
    }
    checkScore(value);
  };

  const onClear = (): void => {
    const copy = checkedTasks;
    copy[itemId] = false;
    setCheckedTasks(copy);
    setCheckedTaskItems(checkedTaskItems - 1);
    checkScore(0);
  };

  const addItem = (): void => {
    const score = otherScore.toString();
    if (scoreCategory.length >= 4) {
      scoreCategory.pop();
      baseScores.pop();
    }
    setScoreCategory([...scoreCategory, score]);
    setBaseScores([...baseScores, otherScore]);
    setOtherScore(0);
  };

  const onOtherScoreChange = (value: number | string | undefined): void => {
    if (value === undefined) {
      return;
    }
    const score = +value;
    setOtherScore(score);
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
          <p>
            Max <br />
            score
          </p>
          <p>
            {taskItem.category === 'Fines'
              ? taskItem.minScore
              : taskItem.maxScore}
          </p>
        </div>
        <div className="task-description">
          <p className="task-title">{taskItem.description}</p>
          <Form.Item name={[taskItem.id, 'comment']}>
            <Input.TextArea allowClear/>
          </Form.Item>
        </div>
        <Form.Item
          className='select'
          name={[taskItem.id, 'score']}
          label={taskItem.category}
          rules={[
            { required: true, message: `'${taskItem.category}' is required` },
          ]}
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
              dropdownRender={(menu): ReactElement => (
                <div>
                  {menu}
                  <Divider style={{ margin: '4px 0' }} />
                  <div
                    style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}
                  >
                    <InputNumber
                      min={taskItem.minScore}
                      max={taskItem.maxScore}
                      style={{ flex: 'auto' }}
                      onChange={onOtherScoreChange}
                    />
                    <Button type="link" onClick={addItem}>
                      <PlusOutlined /> Other
                    </Button>
                  </div>
                </div>
              )}
            >
              {scoreCategory.map((elem, i) => {
                return (
                  <Option value={baseScores[i]} key={elem}>
                    {elem}
                  </Option>
                );
              })}
            </Select>
          )}
        </Form.Item>
      </div>
    </div>
  );
};

export default CheckTask;
