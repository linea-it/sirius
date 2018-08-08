import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, Redirect } from 'react-router';

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

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path='/' component={App} >
            <Route component={UserInterfaces}>
                <Redirect from="/UserInterfaces" to="/Pipelines" /> 
                <Route path='/Pipelines' component={Pipelines}/>
                <Route path='/Components' component={Components} />
                <Route path='/Classes' component={Classes} />
                <Route path='/Packages' component={Packages} />
            </Route>                      
        </Route>
    </Router>,
    document.getElementById('root')
);
registerServiceWorker();
