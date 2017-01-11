'use strict';

const MarkdownWatcher = require('./markdown-watcher');
const path = require('path');
const WebSocketServer = require('websocket').server;

class MarkdownSocket {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this._server = null;
    this.pathname = null;
  }

  listenTo(httpServer) {
    this._server = new WebSocketServer();
    this._server.mount({httpServer: httpServer});
    this._server.on('request', this.onRequest.bind(this));
    this._server.on('connect', this.onConnect.bind(this));
  }

  onRequest(request) {
    const extname = path.extname(request.resource);

    if (extname !== '.md' && extname !== '.markdown') {
      request.reject();
      return;
    }

    this.pathname = request.resource;
    request.accept(null, request.origin);
  }

  onConnect(connection) {
    const watcher = new MarkdownWatcher(path.join(this.rootPath, this.pathname));
    watcher.onData(data => connection.send(data));
    watcher.onError(err => {
      if (err.code === 'ENOENT') {
        // if there is no file, ignore and send 'no file'
        connection.send('Not found');
        return;
      }
      throw err;
    });

    connection.on('close', () => {
      watcher.stop();
    });
  }

  close() {
    this._server.closeAllConnections();
  }
}

module.exports = MarkdownSocket;
