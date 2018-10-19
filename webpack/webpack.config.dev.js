'use strict';
const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
/*
 * so process.cwd() is used instead to determine the correct base directory
 * Read more: https://nodejs.org/api/process.html#process_process_cwd
 */
const CURRENT_WORKING_DIR = process.cwd();

const config = {
  context: path.resolve(CURRENT_WORKING_DIR, 'client'),
  entry: {
    app: [
      'whatwg-fetch',
      'babel-polyfill',
      'webpack-hot-middleware/client', // bundle the client for hot reloading
      './user/user.js' // the entry point of app
    ],
    admin: [
      'whatwg-fetch',
      'babel-polyfill',
      'webpack-hot-middleware/client', // bundle the client for hot reloading
      './admin/admin.js' // the entry point of app
    ]
  },
  mode: 'development',
  output: {
    path: path.resolve(CURRENT_WORKING_DIR, 'dist'), //  destination
    filename: '[name].client.bundle.js',
    chunkFilename: 'js/[chunkhash].chunk.js',
    publicPath: '/dist/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // enable HMR globally
    new webpack.NoEmitOnErrorsPlugin(), // do not emit compiled assets that include errors
  ],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        include: /client/,
        loader: 'eslint-loader',
        options: {
          presets: ['react', 'env']
        }
      },
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.(js|jsx)$/, //check for all js files
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: ['env', 'stage-0', 'react'],
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,
              plugins: ['react-hot-loader/babel'],
            },
          },// "postcss" loader applies autoprefixer to our CSS.
          // "css" loader resolves paths in CSS and adds assets as dependencies.
          // "style" loader turns CSS into JS modules that inject <style> tags.
          // In production, we use a plugin to extract that CSS to a file, but
          // in development "style" loader enables hot editing of CSS.
          {
            test: /\.css$/,
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                },
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  // Necessary for external CSS imports to work
                  // https://github.com/facebookincubator/create-react-app/issues/2677
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({
                      browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9', // React doesn't support IE8 anyway
                      ],
                      flexbox: 'no-2009',
                    }),
                  ],
                },
              },
            ],
          }, {
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ]
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    compress: true,
    hot: true,
    open: true,
    overlay: true
  },
  devtool: "inline-source-map"
};

module.exports = config;