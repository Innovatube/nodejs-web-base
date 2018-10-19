import Loadable from 'react-loadable';
import Loading from '../../components/Loading';

const DashboardPage = Loadable({
  loader: () => import('./index'),
  loading: Loading,
});

export default DashboardPage;
