import React, { Dispatch, ReactElement, SetStateAction, useState } from 'react';
import {
  Form,
  Select,
  InputNumber,
  Divider,
  Button,
  Input,
  Typography,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { TaskItem } from '../../../models/data-models';
import './CheckTask.scss';

const { Option } = Select;
interface CheckTaskProps {
  taskItem: TaskItem;
  checkedTaskItems: number;
  setCheckedTaskItems: Dispatch<SetStateAction<number>>;
  setTotalScore: Dispatch<SetStateAction<number>>;
  itemId: number;
  taskScores: number[];
  setTaskScores: Dispatch<SetStateAction<number[]>>;
  checkedTasks: boolean[];
  setCheckedTasks: Dispatch<SetStateAction<boolean[]>>;
  selfGradeItem?: { score: number | ''; comment?: string | undefined };
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
  selfGradeItem,
}: CheckTaskProps): JSX.Element => {
  const [otherScore, setOtherScore] = useState<number>(0);
  const [baseScores, setBaseScores] = useState<number[]>([
    0,
    taskItem.maxScore / 2,
    taskItem.maxScore,
  ]);

  // eslint-disable-next-line no-param-reassign
  selfGradeItem = selfGradeItem || { score: '', comment: '' };

  const [commentRequired, setCommentRequired] = useState<boolean>(false);
  const [scoreCategory, setScoreCategory] = useState<string[]>([
    'Not completed',
    'Partially completed',
    'Fully completed',
  ]);

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
      setCommentRequired(Number(selfGradeItem.score) !== value);
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
          <Form.Item
            name={[taskItem.id, 'comment']}
            rules={[
              {
                required: commentRequired,
                message:
                  "Your and the author's self-assessment do not match. Leave a comment",
              },
            ]}
          >
            <Input.TextArea allowClear />
          </Form.Item>
          <Typography.Text>
            Self Grade: {`${selfGradeItem.score} ${selfGradeItem.comment}`}
          </Typography.Text>
        </div>
        <Form.Item
          className="select"
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
