import Loadable from 'react-loadable';
import Loading from '../../components/Loading/index';

const UserSetting = Loadable({
  loader: () => import('./index'),
  loading: Loading,
});

export default UserSetting;
