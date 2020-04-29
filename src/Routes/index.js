import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainUserInterface from '../components/MainUserInterface';
import MainDataSet from '../components/MainDataSet';

function Router() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path="/" component={MainUserInterface} />
        <Route exact path="/datasets" component={MainDataSet} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}

export default Router;
