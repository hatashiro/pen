'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const preview = require('./preview');
const urllib = require('url');

class Server {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this._server = http.createServer(this.handler.bind(this));
  }

  listen(port, cb) {
    this._server.listen(port, cb);
  }

  close(cb) {
    this._server.close(cb);
  }

  handler(req, res) {
    let url = urllib.parse(req.url);
    let extname = path.extname(url.pathname);

    if (extname === '.md' || extname === '.markdown') {
      this.handleAsMarkdown(url.pathname, res);
    } else {
      this.handleAsStatic(url.pathname, res);
    }
  }

  handleAsMarkdown(pathname, res) {
    res.setHeader("Content-Type", "text/html");
    res.end(preview(pathname));
  }

  handleAsStatic(pathname, res) {
    let fullPath = path.join(this.rootPath, pathname);
    fs.createReadStream(fullPath)
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
