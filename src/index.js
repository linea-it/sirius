import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';

import App from './containers/App';
import UserInterfaces from './containers/UserInterfaces';

import Pipelines from './views/UserInterfaces/Pipelines';
import Components from './views/UserInterfaces/Components';
import Classes from './views/UserInterfaces/Classes';
import Packages from './views/UserInterfaces/Packages';

import 'primereact/resources/themes/omega/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import registerServiceWorker from './registerServiceWorker';
require('dotenv').config();
ReactDOM.render(
  <BrowserRouter basename={process.env.REACT_APP_PUBLIC_URL}>
    <App>
      <UserInterfaces>
        <Route path={`/Pipelines`} component={Pipelines} />
        <Route path={`/Components`} component={Components} />
        <Route path={`/Classes`} component={Classes} />
        <Route path={`/Packages`} component={Packages} />
      </UserInterfaces>
    </App>
  </BrowserRouter>,
  document.getElementById('root')
);
registerServiceWorker();
