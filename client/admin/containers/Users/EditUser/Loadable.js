import Loadable from 'react-loadable';
import Loading from '../../../components/Loading';

const EditUser = Loadable({
  loader: () => import('./index'),
  loading: Loading,
});

export default EditUser;
