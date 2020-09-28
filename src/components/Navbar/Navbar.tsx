import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import Logout from '../Logout/Logout';
import './Navbar.scss';
import logo from '../../images/logo.png';

const Navbar = (): JSX.Element => {
  return (
    <>
      <Link to="/" className="logo">
        <img src={logo} alt="XCheck" />
      </Link>
      <Menu mode="horizontal" theme="dark">
        <Menu.Item>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/users">Users</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/tasks">Tasks</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/review-requests">Review Requests</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/reviews">Reviews</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/sessions">Cross-Check Sessions</Link>
        </Menu.Item>
        <Menu.Item className="logout-btn">
          <Logout />
        </Menu.Item>
      </Menu>
    </>
  );
};

export default Navbar;
