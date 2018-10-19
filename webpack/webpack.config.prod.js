'use strict';
const webpack = require('webpack');
const path = require('path');
const env = process.env.NODE_ENV;
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const paths = require('./paths');
/*
 * so process.cwd() is used instead to determine the correct base directory
 * Read more: https://nodejs.org/api/process.html#process_process_cwd
 */
const publicPath = paths.servedPath;
const CURRENT_WORKING_DIR = process.cwd();
const shouldUseRelativeAssetPaths = publicPath === './';
const cssFilename = 'css/[name].css';
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const extractTextPluginOptions = shouldUseRelativeAssetPaths ? // Making sure that the publicPath goes back to to build folder.
  {
    publicPath: Array(cssFilename.split('/').length).join('../')
  } :
  {};

var config = {
  context: path.resolve(CURRENT_WORKING_DIR, 'client'),
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  entry: {
    app: [
      'whatwg-fetch',
      'babel-polyfill',
      './user/user.js' // the entry point of app
    ],
    admin: [
      'whatwg-fetch',
      'babel-polyfill',
      './admin/admin.js' // the entry point of app
    ]
  },
  mode: 'production',
  output: {
    path: path.resolve(CURRENT_WORKING_DIR, 'assets'), //  destination
    filename: '[name].client.bundle.js',
    chunkFilename: 'js/[chunkhash].chunk.js',
    publicPath: '/assets/',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: cssFilename,
      chunkFilename: 'css/[name].[id].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, //check for all js files
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: ['env', 'stage-0', 'react', 'es2017'],
        },
      },
      {
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
              minimize: true,
              sourceMap: false,
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
        // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|jpg|jpge)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
module.exports = config;
