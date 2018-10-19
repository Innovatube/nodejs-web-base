import React from 'react';
import { Switch } from 'react-router-dom';
import { PropsRoute } from 'react-router-with-props';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Login from '../Login/index';
import Register from '../Register/index';
import ForgotPassword from '../ForgotPassword/Loadable';
import ImportFile from '../ImportFile/Loadble';
import ResetPassword from '../ResetPassword/Loadable';
import DisplayRoute from '../DisplayRoute/Loadable';
import redirect from './redirect';
import './app.css';
import UserSetting from '../UserSetting/Loadable';
import '../../../i18n';

class App extends React.Component {
  render() {
    const token = localStorage.getItem('token');
    const requireAuthen = comp => (token == null ? redirect('/login') : comp);
    const requireUnauthen = comp => (token != null ? redirect('/import-file') : comp);

    return (
      <div style={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
      }}
      >
        <MuiThemeProvider>
          <Switch>
            <PropsRoute exact path="/login" name="Login" component={requireUnauthen(Login)} />
            <PropsRoute exact path="/register-now" name="Login" component={requireUnauthen(Register)} />
            <PropsRoute exact path="/forgot-password" name="Forgot Password" component={requireUnauthen(ForgotPassword)} />
            <PropsRoute exact path="/import-file/:id?" name="Import File" component={requireAuthen(ImportFile)} />
            <PropsRoute exact path="/re-route/:id" reRoute name="Re Route" component={requireAuthen(ImportFile)} />
            <PropsRoute exact path="/display-route/:id" name="Display Route" component={requireAuthen(DisplayRoute)} />
            <PropsRoute exact path="/reset-password/:token" name="Reset Passowrd" component={requireUnauthen(ResetPassword)} />
            <PropsRoute exact path="/user-setting" name="User Setting" component={requireAuthen(UserSetting)} />
            <PropsRoute exact path="/" name="Import File" component={requireAuthen(ImportFile)} />
          </Switch>
        </MuiThemeProvider>
      </div>
    );
  }
}


export default App;
