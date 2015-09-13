'use strict';

const marked = require('marked');
const Watcher = require('./watcher');

class MarkdownWatcher extends Watcher {
  onData(callback) {
    this._dataCallback = data => {
      callback(marked(data.toString()));
    };
    return this;
  }
}

module.exports = MarkdownWatcher;
