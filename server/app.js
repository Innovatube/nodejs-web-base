import 'babel-polyfill';
import app from './config/express';
import routes from './routes/index.route';
import errorHandler from './middlewares/errorHandler';

// enable webpack hot module replacement in development mode
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack/webpack.config.dev';
import constant from './config/directory';

if (process.env.NODE_ENV === 'local') {
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: webpackConfig.output.publicPath}));
  app.use(webpackHotMiddleware(compiler, {overlay: true}));
}
console.log('App type:', process.env.NODE_ENV);
app.use(function (req, res, next) {
  req.baseUrlLive = req.protocol + '://' + req.headers.host + '/';
  next();
});
// Router
app.use('/api', routes);

const assets = process.env.NODE_ENV === 'local' ? '/dist' : constant.distDirString;
const appVer = (process.env.NODE_ENV !== 'local' && process.env.APP_VER) ? process.env.APP_VER : new Date().getTime();
// Landing page
app.get('/admin*', (req, res) => {
  res.render('admin.ejs', {
    title: 'Demo home page',
    baseUrl: req.protocol + '://' + req.headers.host + '/',
    assets: assets,
    env: process.env.NODE_ENV,
    appVer: appVer
  })
});
app.get('*', (req, res) => {
  res.render('home.ejs', {
    title: 'Demo home page',
    baseUrl: req.protocol + '://' + req.headers.host + '/',
    assets: assets,
    env: process.env.NODE_ENV,
    appVer: appVer
  })
});

// Error Handler, Must be put at the end of the middleware chain
app.use(errorHandler);

const server = app.listen(app.get('port'), app.get('host'), () => {
  console.log(`Server running at http://${app.get('host')}:${app.get('port')}`);
});
function stop() {
  server.close();
}

module.exports = app;
module.exports.stop = stop;
