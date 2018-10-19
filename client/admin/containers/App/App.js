import React from 'react';
import { Switch } from 'react-router-dom';
import { PropsRoute } from 'react-router-with-props';
import Login from '../Login/index';
import Dashboard from '../Dashboard/index';
import ForgotPassword from '../ForgotPassword/index';
import redirect from './redirect';
import Auth from '../../../middlewares/Auth';
import './app.css';
import '../../../i18n';

class App extends React.Component {
  render() {
    const requireAuthen = comp => (!Auth.isAdmin() ? redirect('/login') : comp);
    const requireUnauthen = comp => (Auth.isAdmin() ? redirect('/') : comp);

    return (

      <Switch>
        <PropsRoute path="/admin/dashboard" name="Dashboard" component={requireAuthen(Dashboard)} />
        <PropsRoute exact path="/admin/login" name="Login" component={requireUnauthen(Login)} />
        <PropsRoute exact path="/admin/forgot-password" name="Forgot Password" component={requireUnauthen(ForgotPassword)} />
        <PropsRoute path="/admin/" name="Dashboard" component={Dashboard} />
      </Switch>
    );
  }
}

export default App;
