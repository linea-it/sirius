import React from 'react';
import { Link } from 'react-router-dom';

const MenuUser = () => {
  return (
    <ul className="navbar-nav float-right">
      <li className="nav-item">
        <Link to="/" className="nav-link">
          User Name
        </Link>
      </li>
    </ul>
  );
};

export default MenuUser;
