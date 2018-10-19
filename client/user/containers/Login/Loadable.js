import Loadable from 'react-loadable';
import Loading from '../../components/Loading/index';

const Login = Loadable({
  loader: () => import('./index'),
  loading: Loading,
});

export default Login;
