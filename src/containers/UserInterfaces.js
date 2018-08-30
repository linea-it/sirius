import React, { Component } from 'react';

import Menu from '../components/userInterfaces/Menu';
import Proptypes from 'prop-types';

import '../assets/css/userInterfaces.css';

class UserInterfaces extends Component {
  render() {
    return (
      <div className="row">
        <aside className="col-md-2 d-md-block bg-light sidebar">
          <h1 className="titUserIntefaces">User Interfaces</h1>
          <div className="sidebar-sticky">
            <Menu />
          </div>
        </aside>

        <section className="col-md-10 ml-sm-auto col-lg-10 px-1">
          {this.props.children}
        </section>
      </div>
    );
  }
}

UserInterfaces.propTypes = {
  children: Proptypes.string.isRequired,
};

export default UserInterfaces;
