'use strict';

const webpack = require('webpack');
const logger = require('../../server/lib/logger');
logger.info('Running development configuration...');

const WEBPACK_HOST = 'c0der.local';
const WEBPACK_PORT = 3001;

// Override base configuration.
let config = require('./config.base.js');
config.devtool = 'source-map';
//config.debug = true;
config.entry = {
  app: [
    'webpack-dev-server/client?http://' + WEBPACK_HOST + ':' + WEBPACK_PORT,
    'webpack/hot/only-dev-server',
    config.entry.app
  ],
  bootstrap: config.entry.bootstrap
};

config.output.publicPath = `http://c0der.local:3001/${config.output.publicPath}`;

// Stats configuration.
config.stats = {
  colors: true,
  reasons: true
};

// Development modules.
config.module.loaders.push({
  test: /\.css$/,
  loader: 'style-loader!css-loader!postcss-loader'
});

// Webpack plugins.
config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin()
]);

module.exports = config;
