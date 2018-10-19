import React from 'react';
import {
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
import { Container } from 'reactstrap';
import { Switch, Redirect } from 'react-router-dom';
import { PropsRoute } from 'react-router-with-props';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Header from './Header/header';
import UserRepository from '../../../repositories/UserRepository';
import './dashboard.css';
import routes from './routes';
import Auth from '../../../middlewares/Auth';
import redirect from '../App/redirect';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.userService = new UserRepository();
  }

  render() {
    const requireAuthen = comp => (!Auth.isAdmin() ? redirect('/login') : comp);
    const { t } = this.props;

    return (
      <div className="app">
        <Header history={this.props.history} />
        <div className="app-body" style={{ backgroundColor: '#062A30' }}>
          <AppSidebar fixed={false} display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <AppSidebarNav
              navConfig={{
                items: [
                  {
                    name: t('dashboard'),
                    url: '/admin/dashboard',
                    icon: 'icon-speedometer',
                  },
                  {
                    name: t('user_management'),
                    url: '/admin/users',
                    icon: 'icon-user',
                  },
                ],
              }}
              {...this.props}
            />
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <Container fluid>
              <Switch>
                {routes.map((route, index) => (
                  <PropsRoute
                    exact
                    path={route.path}
                    name={route.name}
                    component={requireAuthen(route.component)}
                    key={index}
                  />
                ))}
                <Redirect from="/admin" to="/admin/dashboard" />
              </Switch>
            </Container>
          </main>
        </div>
      </div>
    );
  }
}
export default translate('dashboardSidebar')(Dashboard);

Dashboard.propTypes = {
  history: PropTypes.object,
  t: PropTypes.func,
};
