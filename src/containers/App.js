import React, { Component } from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';

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

export default App;
