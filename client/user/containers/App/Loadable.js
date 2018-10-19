import Loadable from 'react-loadable';
import Loading from '../../components/Loading/index';

const App = Loadable({
  loader: () => import('./App'),
  loading: Loading,
});

export default App;
