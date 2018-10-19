import Loadable from 'react-loadable';
import Loading from '../../components/Loading';

const Users = Loadable({
  loader: () => import('./index'),
  loading: Loading,
});

export default Users;
