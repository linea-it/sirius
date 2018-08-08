import React from 'react';
import { Link } from 'react-router';

const Menu = () => {
    return ( 
        <ul className="nav flex-column">
            <li className="nav-item">
                <Link to='/Pipelines' activeClassName="active" className="nav-link">Pipelines</Link>
            </li>
            <li className="nav-item">
                <Link to='/Components' activeClassName="active" className="nav-link">Components</Link>
            </li>
            <li className="nav-item">
                <Link to='/Classes' activeClassName="active" className="nav-link">Classes</Link>
            </li>
            <li className="nav-item">
                <Link to='/Packages' activeClassName="active" className="nav-link disabled">Packages</Link>
            </li>
        </ul>
    );
};

export default Menu;