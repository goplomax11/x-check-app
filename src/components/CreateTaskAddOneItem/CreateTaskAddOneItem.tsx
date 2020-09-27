import React, { useState } from 'react';
import { Button, Form, Input, Select, Checkbox } from 'antd';
import { TaskItem, TaskItemCategory } from '../../models/data-models';

const { TextArea } = Input;
const { Option } = Select;

interface CreateTaskAddOneItemProps {
  scopes: TaskItemCategory[];
  items: TaskItem[];
  onChangeItems: (newItems: TaskItem[]) => void;
}

const CreateTaskAddOneItem = ({
  scopes,
  items,
  onChangeItems,
}: CreateTaskAddOneItemProps): JSX.Element => {
  const [titleItem, setTitleItem] = useState('');
  const [descriptionItem, setDescriptionItem] = useState('');
  const [categoryItem, setCategoryItem] = useState<TaskItemCategory>(
    'Basic Scope'
  );
  const [minItem, setMinItem] = useState('');
  const [maxItem, setMaxItem] = useState('');
  const [isForMentor, setIsForMentor] = useState(false);

  const resetItemInfo = (): void => {
    setTitleItem('');
    setDescriptionItem('');
    setMinItem('');
    setMaxItem('');
    setIsForMentor(false);
  };

  const handleAddItem = (): void => {
    const minNum = parseInt(minItem, 10);
    const maxNum = parseInt(maxItem, 10);
    const item = {
      minScore: !Number.isNaN(minNum) ? minNum : 0,
      maxScore: !Number.isNaN(maxNum) ? maxNum : 0,
      category: categoryItem,
      title: titleItem,
      description: descriptionItem,
      isForMentor: isForMentor
    } as TaskItem;
    const newArray = [...items, item];
    onChangeItems(
      newArray.sort((prev, cur) => {
        return scopes.indexOf(prev.category) - scopes.indexOf(cur.category);
      })
    );
    resetItemInfo();
  };

  return (
    <>
      <Form.Item label="Item Title" required>
        <Input
          placeholder="Item Title"
          value={titleItem}
          onChange={(e): void => setTitleItem(e.target.value)}
        />
      </Form.Item>
      <Form.Item label="Item Description">
        <TextArea
          rows={4}
          placeholder="Item Description"
          value={descriptionItem}
          onChange={(e): void => setDescriptionItem(e.target.value)}
        />
      </Form.Item>
      <Form.Item label="Item Category">
        <Select
          defaultValue={categoryItem}
          onChange={(e): void => setCategoryItem(e)}
        >
          {scopes.map((scope) => {
            return (
              <Option key={scope} value={scope}>
                {scope}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item>
            <Checkbox checked={isForMentor} onChange={(e): void => setIsForMentor(e.target.checked)}>Only For Mentor</Checkbox>
      </Form.Item>
      <Form.Item label="Score Range">
        <Input
          style={{ width: 100, textAlign: 'center' }}
          placeholder="Min Score"
          value={minItem}
          onChange={(e): void => setMinItem(e.target.value)}
        />
        <Input
          className="site-input-split"
          style={{
            width: 30,
            borderLeft: 0,
            borderRight: 0,
            pointerEvents: 'none',
          }}
          placeholder="~"
          disabled
        />
        <Input
          className="site-input-right"
          style={{
            width: 100,
            textAlign: 'center',
          }}
          placeholder="Max Score"
          value={maxItem}
          onChange={(e): void => setMaxItem(e.target.value)}
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          onClick={handleAddItem}
          disabled={titleItem.length < 1}
        >
          Add Item
        </Button>
      </Form.Item>
    </>
  );
};

export default CreateTaskAddOneItem;
