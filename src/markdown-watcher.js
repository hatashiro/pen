"use strict";

const convert = require("./markdown");
const Watcher = require("./watcher");

class MarkdownWatcher extends Watcher {
  onData(callback) {
    this._dataCallback = data => convert(data.toString()).then(callback);
    return this;
  }
}

module.exports = MarkdownWatcher;
