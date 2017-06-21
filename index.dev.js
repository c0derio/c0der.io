const path = require('path');
const nconf = require('nconf');
const babelRegister = require('babel-core/register');

const server = require('./server');
const logger = require('./server/lib/logger');

// Initialize babel.
babelRegister({
  ignore: /node_modules/,
  sourceMaps: !(process.env.NODE_ENV === 'production')
});

require('babel-polyfill');

// Handle uncaught.
process.on('uncaughtException', (err) => {
  logger.error(err);
});

// Initialize configuration.
nconf
  .argv()
  .env()
  .file(path.join(__dirname, './server/config.json'))
  .defaults({
    DATA_CACHE_MAX_AGE: 1000 * 10,
    NODE_ENV: 'development',
    HOSTING_ENV: 'default',
    PORT: 3000,
    MANIFEST_FILE: 'junk.json',
    STATIC_DIR: path.join(__dirname, './dist'),
    TITLE: 'c0der.io connect with your coding peers'
  });

// Start the server.
const app = server(key => nconf.get(key), null);
const port = nconf.get('PORT');
app.listen(port, '0.0.0.0', (error) => {
  if (error) {
    logger.error(error);
  } else {
    logger.info(`Express listening on http://c0der.local:${port}`);
  }
});
