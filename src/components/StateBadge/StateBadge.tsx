import React from 'react';
import { Badge } from 'antd';
import { TaskState } from '../../models/data-models';

const StateBadge = ({ state }: { state: TaskState }): JSX.Element => {
  switch (state) {
    case 'DRAFT':
      return <Badge status="warning" text="Draft" />;
    case 'PUBLISHED':
      return <Badge status="success" text="Published" />;
    case 'ARCHIVED':
      return <Badge status="default" text="Archived" />;
    default:
      return <Badge status="warning" text="Draft" />;
  }
};

export default StateBadge;
