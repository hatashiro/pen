'use strict';

const assert = require('assert');
const fs = require('fs');
const helper = require('./lib/helper');
const http = require('http');
const MarkdownSocket = require('../src/markdown-socket');
const WebSocket = require('ws');

describe('MarkdownSocket', () => {
  let server;
  let mdSocket;

  beforeEach(done => {
    helper.makeDirectory('md-root');
    helper.createFile('md-root/test.md', '# hello');
    server = http.createServer((req, res) => {
      res.end('hello');
    });
    mdSocket = new MarkdownSocket(helper.path('md-root'));
    mdSocket.listenTo(server);
    server.listen(1234, done);
  });

  afterEach(done => {
    helper.clean();
    mdSocket.close();
    server.close(done);
  });

  it('handles a websocket connection', (done) => {
    let client = new WebSocket('ws://localhost:1234');

    client.on('open', () => {
      assert.equal(mdSocket._server.clients.length, 1);
      done();
    });
  });

  it('opens a Markdown file and sends the parsed HTML', (done) => {
    let client = new WebSocket('ws://localhost:1234/test.md');

    client.on('message', data => {
      assert.equal(data, '<h1 id="hello">hello</h1>\n');
      done();
    });
  });

  it('sends parsed HTML data again when the file is updated', (done) => {
    let called = 0;
    let client = new WebSocket('ws://localhost:1234/test.md');
    client.on('message', data => {
      switch (called) {
      case 0:
        assert.equal(data, '<h1 id="hello">hello</h1>\n');
        fs.writeFile(helper.path('md-root/test.md'), '```js\nvar a=10;\n```');
        break;
      case 1:
        assert.equal(data, '<pre><code class="language-js">var a=10;\n</code></pre>\n');
        fs.writeFile(helper.path('md-root/test.md'), '* nested\n  * nnested\n    * nnnested');
        break;
      case 2:
        assert.equal(data, '<ul>\n<li>nested\n<ul>\n<li>nnested\n<ul>\n<li>nnnested</li>\n</ul>\n</li>\n</ul>\n</li>\n</ul>\n');
        done();
        break;
      }
      called += 1;
    });
  });
});
