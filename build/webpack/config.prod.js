'use strict';

const webpack = require('webpack');
const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const project = require('../../package.json');
const logger = require('winston');
logger.info('Running production configuration...');

const config = require('./config.base.js');
config.profile = false;

// Build output, which includes the hash.
config.output.filename = 'c0derio.ui.[name].' + project.version + '.js';

// Development modules.
config.module.loaders.push({
  test: /\.css$/,
  loader: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: 'css-loader!postcss-loader'
  })
});

// Webpack plugins.
config.plugins = config.plugins.concat([
  // Extract CSS to a different file, will require additional configuration.
  new ExtractTextPlugin({
    filename: 'c0derio.ui.' + project.version + '.css',
    allChunks: true
  }),

  // Separate the vendor in a different file.
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendors',
    filename: 'c0derio.ui.vendors.' + project.version + '.js'
  }),

  // Compress and uglify the output.
  new webpack.optimize.UglifyJsPlugin({
    mangle: true,
    output: {
      comments: false
    },
    compress: {
      sequences: true,
      dead_code: true,
      conditionals: true,
      booleans: true,
      unused: true,
      if_return: true,
      join_vars: true,
      drop_console: true,
      warnings: false
    }
  }),

  // Alternative to StatsWriterPlugin.
  new StatsWriterPlugin({
    filename: 'manifest.json',
    transform: function transformData(data) {
      console.log("transform chunks, assets: ", JSON.stringify(data));
      const chunks = {
        app: data.assetsByChunkName.app[0],
        style: data.assetsByChunkName.app[1],
        vendors: data.assetsByChunkName.vendors,
        bootstrap: data.assetsByChunkName.bootstrap
      };
      return JSON.stringify(chunks);
    }
  })
]);

module.exports = config;
