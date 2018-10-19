import Loadable from 'react-loadable';
import Loading from '../../components/Loading';

const ForgotPassword = Loadable({
  loader: () => import('./index'),
  loading: Loading,
});

export default ForgotPassword;
