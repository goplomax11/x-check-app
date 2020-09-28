import React from 'react';
import { List } from 'antd';
import { Link } from 'react-router-dom';

const data = [
  { text: 'Users', path: '/users' },
  { text: 'Tasks', path: '/tasks' },
  { text: 'Review Requests', path: '/review-requests' },
  { text: 'Reviews', path: '/reviews' },
  { text: 'Cross-Check Sessions', path: '/sessions' },
];

const Home = (): JSX.Element => {
  return (
    <List
      bordered
      dataSource={data}
      renderItem={(item: { text: string; path: string }): JSX.Element => (
        <List.Item>
          <Link to={item.path}>{item.text}</Link>
        </List.Item>
      )}
    />
  );
};

export default Home;
