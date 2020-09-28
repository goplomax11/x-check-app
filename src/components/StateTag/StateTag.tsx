import React from 'react';
import { Tag } from 'antd';

interface StateTagProps {
  state: string;
}

const StateTag = ({ state }: StateTagProps): JSX.Element => {
  const tagColor = (): string => {
    switch (state) {
      case 'DRAFT':
        return 'default';
      case 'ARCHIVED':
        return 'purple';
      case 'REQUESTS_GATHERING':
        return 'orange';
      case 'CROSS_CHECK':
        return 'geekblue';
      case 'COMPLETED':
        return 'cyan';
      case 'ONGOING':
        return 'volcano';
      case 'PUBLISHED':
        return 'blue';
      case 'DISPUTED':
        return 'orange';
      case 'ACCEPTED':
        return 'green';
      case 'REJECTED':
        return 'red';
      default:
        return 'default';
    }
  };
  return (
    <Tag color={tagColor()} key={state}>
      {state}
    </Tag>
  );
};

export default StateTag;
