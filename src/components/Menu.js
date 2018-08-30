import React from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <Link
          to="/UserInterfaces"
          activeClassName="active"
          className="nav-link"
        >
          User Interfaces
        </Link>
      </li>
    </ul>
  );
};

export default Menu;
