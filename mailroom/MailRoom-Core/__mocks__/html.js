// Mock the html import that webpack usually handles
const htmlLoader = require('html-loader');

module.exports = {
  process(src, filename, config, options) {
    return htmlLoader(src);
  }
};