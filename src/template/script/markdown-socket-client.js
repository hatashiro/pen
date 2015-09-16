'use strict';

const WebSocket = require('ws');

class MarkdownSocketClient {
  constructor(location) {
    this.host = location.host;
    this.pathname = location.pathname;

    let url = `ws://${this.host}${this.pathname}`;

    this._socket = new WebSocket(url);
    this._socket.onmessage = event => {
      this.triggerOnData(event.data);
    };

    this._dataCallback = null;
  }

  onData(callback) {
    this._dataCallback = callback;
    return this;
  }

  triggerOnData(data) {
    if (this._dataCallback) {
      this._dataCallback(data);
    }
  }
}

module.exports = MarkdownSocketClient;
