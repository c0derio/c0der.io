const postCssVars = require('postcss-simple-vars');
const postCssFocus = require('postcss-focus');
const postCssReporter = require('postcss-reporter');
const autoprefixer = require('autoprefixer');


module.exports = [
  postCssVars(),
  postCssFocus(),
  autoprefixer({
    browsers: [ 'last 2 versions', 'IE > 8' ]
  }),
  postCssReporter({
    clearMessages: true
  })
];
