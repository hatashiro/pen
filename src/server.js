'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const urllib = require('url');

const DefaultPort = 6060;

class Server {
  static get DefaultPort() {
    return DefaultPort;
  }

  constructor(rootPath) {
    this.rootPath = rootPath;
    this._server = http.createServer(this.handler.bind(this));
  }

  listen(customPort, cb) {
    let port = customPort ? customPort : DefaultPort;
    this._server.listen(port, cb);
  }

  close(cb) {
    this._server.close(cb);
  }

  handler(req, res) {
    let url = urllib.parse(req.url);
    let extname = path.extname(url.pathname);
    let fullPath = path.join(this.rootPath, url.pathname);

    if (extname === '.md' || extname === '.markdown') {
      this.handleAsMarkdown(fullPath, res);
    } else {
      this.handleAsStatic(fullPath, res);
    }
  }

  handleAsMarkdown(pathname, res) {
    // TODO
    this.handleAsStatic(pathname, res);
  }

  handleAsStatic(pathname, res) {
    fs.createReadStream(pathname)
      .on('error', err => {
        if (err.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('Not found');
        } else {
          throw err;
        }
      })
      .pipe(res);
  }
}

module.exports = Server;
