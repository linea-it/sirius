import React, { Component } from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Proptypes from 'prop-types';

import '../assets/css/App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <main role="main" className="container-fluid">
          {this.props.children}
        </main>
        <Footer />
      </div>
    );
  }
}

App.propTypes = {
  children: Proptypes.string.isRequired,
};

export default App;
