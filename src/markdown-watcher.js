'use strict';

const convert = require('./markdown');
const Watcher = require('./watcher');

class MarkdownWatcher extends Watcher {
  onData(callback) {
    this._dataCallback = data => {
      callback(convert(data.toString()));
    };
    return this;
  }
}

module.exports = MarkdownWatcher;
