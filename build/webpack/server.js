const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

console.log("hello");

const config = require('./config.dev.js');
const logger = require('../../server/lib/logger');

const options = {
  publicPath: 'http://c0der.local:3001/app/',
  hot: true,
  inline: true,
  historyApiFallback: true,
  proxy: {
    '*': 'http://c0der.local:3000'
  },

  quiet: false,
  noInfo: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },

  stats: { colors: true },
  headers: { 'Access-Control-Allow-Origin': '*' }
};

new WebpackDevServer(webpack(config), options)
  .listen(3001, 'c0der.local',
    (err) => {
      if (err) {
        logger.error(err);
      } else {
        logger.info('Webpack proxy listening on: http://c0der.local:3001');

        // Start the actual webserver.
        require('../../index.dev');
      }
    });
