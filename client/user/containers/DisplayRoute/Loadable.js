import Loadable from 'react-loadable';
import Loading from '../../components/Loading/index';

const DisplayRoute = Loadable({
  loader: () => import('./index'),
  loading: Loading,
});

export default DisplayRoute;
