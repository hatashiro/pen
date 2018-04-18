"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");
const urllib = require("url");
const MarkdownSocket = require("./markdown-socket");

function isMarkdown(path) {
  const lowerCasedPath = path.toLowerCase();
  return lowerCasedPath.endsWith(".md") || lowerCasedPath.endsWith(".markdown");
}

class Server {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this._server = http.createServer(this.handler.bind(this));

    this._ws = new MarkdownSocket(this.rootPath);
    this._ws.listenTo(this._server);
  }

  listen(port, cb) {
    this._server.listen(port, cb);
  }

  close(cb) {
    this._ws.close();
    this._server.close(cb);
  }

  handler(req, res) {
    const url = urllib.parse(req.url);

    if (isMarkdown(url.pathname)) {
      this.handleAsMarkdown(res);
    } else {
      this.handleAsStatic(url.pathname, res);
    }
  }

  handleAsMarkdown(res) {
    res.setHeader("Content-Type", "text/html");
    const indexHTMLPath = path.join(__dirname, "../dist/index.html");
    fs.createReadStream(indexHTMLPath).pipe(res);
  }

  handleAsStatic(pathname, res) {
    const fullPath = path.join(this.rootPath, pathname);

    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        if (!pathname.endsWith("/")) {
          res.writeHead(302, { Location: pathname + "/" });
          res.end();
          return;
        }

        const fileList = fs.readdirSync(fullPath).filter(isMarkdown);
        res.setHeader("Content-Type", "text/html");
        res.end(fileList.map(f => `<a href='${f}'>${f}</a>`).join(" "));
      } else {
        fs.createReadStream(fullPath).pipe(res);
      }
    } catch (err) {
      if (err.code === "ENOENT") {
        res.statusCode = 404;
        res.end("Not found");
      } else {
        throw err;
      }
    }
  }
}

module.exports = Server;
