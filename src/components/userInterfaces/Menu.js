import React from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <ul className="nav flex-column">
      <li className="nav-item">
        <Link to="/Pipelines" activeclassname="active" className="nav-link">
          Pipelines
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/Components" activeclassname="active" className="nav-link">
          Components
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/Classes" activeclassname="active" className="nav-link">
          Classes
        </Link>
      </li>
      <li className="nav-item">
        <Link
          to="/Packages"
          activeclassname="active"
          className="nav-link disabled"
        >
          Packages
        </Link>
      </li>
    </ul>
  );
};

export default Menu;
