import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router';
import { createBrowserHistory } from 'history';
import AdminApp from './containers/App/Loadable';
import '@coreui/icons/css/coreui-icons.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';

const history = createBrowserHistory();

ReactDOM.render((
  <Router history={history} basename="/">
    <Switch>
      <Route path="/admin/" name="AdminApp" component={AdminApp} />
    </Switch>
  </Router>
), document.getElementById('root'));
