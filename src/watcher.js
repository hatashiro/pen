'use strict';

const fs = require('fs');

const WatchInterval = 200; // milliseconds

class Watcher {
  constructor(p) {
    this.path = p;
    this._watchLoop = null;
    this._dataCallback = null;
    this._errorCallback = null;
    this._previousData = null;

    this.start();
  }

  start() {
    if (this._watchLoop) {
      clearInterval(this._watchLoop);
    }

    setTimeout(() => this.watch(), 0); // for the first execution
    this._watchLoop = setInterval(() => this.watch(), WatchInterval);
  }

  stop() {
    clearInterval(this._watchLoop);
    this._watchLoop = null;
  }

  watch() {
    fs.readFile(this.path, (error, data) => {
      if (error) {
        this.triggerOnError(error);
        this.stop();
      } else {
        if (!this._previousData || data.compare(this._previousData) !== 0) {
          this.triggerOnData(data);
          this._previousData = data;
        }
      }
    });
  }

  onData(callback) {
    this._dataCallback = callback;
    return this;
  }

  onError(callback) {
    this._errorCallback = callback;
    return this;
  }

  triggerOnData(data) {
    if (this._dataCallback) {
      this._dataCallback(data);
    }
  }

  triggerOnError(error) {
    if (this._errorCallback) {
      this._errorCallback(error);
    } else {
      throw error;
    }
  }
}

module.exports = Watcher;
