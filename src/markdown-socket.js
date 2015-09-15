'use strict';

const MarkdownWatcher = require('./markdown-watcher');
const path = require('path');
const urllib = require('url');
const WebSocketServer = require('ws').Server;

class MarkdownSocket {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this._server = null;
  }

  listenTo(httpServer) {
    this._server = new WebSocketServer({server: httpServer});
    this._server.on('connection', this.onConnection.bind(this));
  }

  onConnection(wsClient) {
    let pathname = urllib.parse(wsClient.upgradeReq.url).pathname;
    let extname = path.extname(pathname);

    if (extname !== '.md' && extname !== '.markdown') {
      return;
    }

    let watcher = new MarkdownWatcher(path.join(this.rootPath, pathname));
    watcher.onData(data => wsClient.send(data));

    wsClient.on('close', () => {
      watcher.stop();
    });
  }

  close() {
    this._server.close();
  }
}

module.exports = MarkdownSocket;
