'use strict';

const MarkdownIt = require('markdown-it');
const Watcher = require('./watcher');

const md = MarkdownIt({html: true, linkify: true})
  .use(require('markdown-it-highlightjs'))
  .use(require('markdown-it-emoji'))
  .use(require('markdown-it-checkbox'))
  .use(require('markdown-it-anchor'));

class MarkdownWatcher extends Watcher {
  onData(callback) {
    this._dataCallback = data => {
      callback(md.render(data.toString()));
    };
    return this;
  }
}

module.exports = MarkdownWatcher;
