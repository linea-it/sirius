import React from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <ul className="nav flex-column">
      <li className="nav-item">
        <Link to="/Pipelines" className="nav-link">
          Pipelines
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/Components" className="nav-link">
          Components
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/Classes" className="nav-link">
          Classes
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/Packages" className="nav-link disabled">
          Packages
        </Link>
      </li>
    </ul>
  );
};

export default Menu;
