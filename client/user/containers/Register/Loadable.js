import Loadable from 'react-loadable';
import Loading from '../../components/Loading';

const Register = Loadable({
  loader: () => import('./index'),
  loading: Loading,
});

export default Register;
