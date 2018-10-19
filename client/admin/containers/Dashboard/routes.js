import Users from '../Users/Loadable';
import Content from './Content/content';
import EditUser from '../Users/EditUser/Loadable';

const routes = [
  {
    path: '/admin/users', exact: true, name: 'Users', component: Users,
  },
  {
    path: '/admin/users/:id', exact: true, name: 'EditUser', component: EditUser,
  },
  {
    path: '/admin/dashboard', exact: true, name: 'Dashboard', component: Content,
  },
];

export default routes;
