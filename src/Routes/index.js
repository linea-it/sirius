import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainUserInterface from '../components/MainUserInterface';
import MainDataSet from '../components/MainDataSet';
// import Home from '../pages/Home';
// import AboutUs from '../pages/AboutUs';

function Router() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path="/user-interface" component={MainUserInterface} />
        <Route path="/datasets" component={MainDataSet} />
        <Route component={MainDataSet} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}

export default Router;
