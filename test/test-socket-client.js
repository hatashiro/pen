'use strict';

const assert = require('assert');
const fs = require('fs');
const helper = require('./lib/helper');
const http = require('http');
const MarkdownSocket = require('../src/markdown-socket');
const SocketClient = require('../src/template/script/socket-client');

describe('SocketClient', () => {
  let server;
  let mdSocket;

  beforeEach(done => {
    helper.makeDirectory('md-root');
    helper.createFile('md-root/test.md', '# hello');
    server = http.createServer((req, res) => res.end('hello'));
    mdSocket = new MarkdownSocket(helper.path('md-root'));
    mdSocket.listenTo(server);
    server.listen(1234, done);
  });

  afterEach(done => {
    helper.clean();
    mdSocket.close();
    server.close(done);
  });

  it('receives HTML data sent from a Markdown socket server', (done) => {
    let client = new SocketClient({
      host: 'localhost:1234',
      pathname: '/test.md'
    });
    client.onData(html => {
      assert.equal(html, '<h1 id="hello">hello</h1>\n');
      done();
    });
  });

  it('receives the data whenever the file is updated', (done) => {
    const callback = err => { if (err) { done(err); } };

    let called = 0;
    let client = new SocketClient({
      host: 'localhost:1234',
      pathname: '/test.md'
    });
    client.onData(html => {
      switch (called) {
      case 0:
        assert.equal(html, '<h1 id="hello">hello</h1>\n');
        fs.writeFile(helper.path('md-root/test.md'), '```js\nvar a=10;\n```', callback);
        break;
      case 1:
        assert.equal(html, '<pre><code class="language-js">var a=10;\n</code></pre>\n');
        fs.writeFile(helper.path('md-root/test.md'), '* nested\n  * nnested\n    * nnnested', callback);
        break;
      case 2:
        assert.equal(html, '<ul>\n<li>nested\n<ul>\n<li>nnested\n<ul>\n<li>nnnested</li>\n</ul>\n</li>\n</ul>\n</li>\n</ul>\n');
        done();
        break;
      }
      called += 1;
    });
  });
});
