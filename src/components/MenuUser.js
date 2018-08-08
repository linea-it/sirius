import React from 'react';
import { Link } from 'react-router';

const MenuUser = () => {
    return (
        <ul className="navbar-nav float-right">
            <li className="nav-item">
                <Link to='/' activeClassName="active" className="nav-link">User Name</Link>
            </li>
        </ul>
    );
};

export default MenuUser;