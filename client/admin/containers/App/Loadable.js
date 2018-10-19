import Loadable from 'react-loadable';
import LoadingFull from '../../components/Loading/LoadingFull';

const App = Loadable({
  loader: () => import('./App'),
  loading: LoadingFull,
});

export default App;
