import Loadable from 'react-loadable';
import Loading from '../../components/Loading/index';

const ImportFile = Loadable({
  loader: () => import('./index'),
  loading: Loading,
});

export default ImportFile;
