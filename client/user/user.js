import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { Router, Route, Switch } from 'react-router';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { createBrowserHistory } from 'history';
import Loadable from 'react-loadable';
import '@coreui/coreui';
import '@coreui/coreui/dist/css/coreui.min.css';
import '@coreui/icons/css/coreui-icons.css';
import 'simple-line-icons/css/simple-line-icons.css';
import rootReducer from '../reducers';
import saga from '../sagas';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, devToolsEnhancer(), applyMiddleware(sagaMiddleware));
sagaMiddleware.run(saga);

const Loading = () => (
  <div>
    Loading...
  </div>
);

const history = createBrowserHistory();

const App = Loadable({
  loader: () => import('./containers/App/App'),
  loading: Loading,
});

ReactDOM.render((
  <Provider store={store}>
    <Router history={history} basename="/">
      <Switch>
        <Route path="/" name="App" component={App} />
      </Switch>
    </Router>
  </Provider>
), document.getElementById('root'));
