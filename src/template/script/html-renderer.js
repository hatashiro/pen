'use strict';

const SocketClient = require('./socket-client');

class HTMLRenderer {
  constructor(location) {
    this._client = new SocketClient(location);
    this._client.onData(this.handleData.bind(this));

    this._updateCallback = null;
  }

  handleData(data) {
    if (this.rootElement) {
      this.rootElement.innerHTML = data;
    }
    this.triggerOnUpdate();
  }

  renderTo(rootElement) {
    this.rootElement = rootElement;
  }

  onUpdate(cb) {
    this._updateCallback = cb;
  }

  triggerOnUpdate() {
    if (this._updateCallback) {
      this._updateCallback();
    }
  }
}

module.exports = HTMLRenderer;
