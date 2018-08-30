import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';

import createHistory from 'history/createBrowserHistory';

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

const history = createHistory();

ReactDOM.render(
  <Router history={history}>
    <UserInterfaces>
      <App>
        <Route path="/Pipelines" component={Pipelines} />
        <Route path="/Components" component={Components} />
        <Route path="/Classes" component={Classes} />
        <Route path="/Packages" component={Packages} />
      </App>
    </UserInterfaces>
  </Router>,
  document.getElementById('root')
);
registerServiceWorker();
