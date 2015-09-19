'use strict';

const assert = require('assert');
const fs = require('fs');
const helper = require('./lib/helper');
const HTMLRenderer = require('../src/template/script/html-renderer');
const http = require('http');
const jsdom = require('jsdom');
const MarkdownSocket = require('../src/markdown-socket');

describe('HTMLRenderer', () => {
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

  it('renders HTML parsed from Markdown with using Virtual DOM', (done) => {
    jsdom.env(
      "<div id='app'></div>",
      [],
      (err, win) => {
        let renderer = new HTMLRenderer({
          host: 'localhost:1234',
          pathname: '/test.md'
        });
        let app = win.document.getElementById('app');
        renderer.renderTo(app);
        renderer.onUpdate(() => {
          assert.equal(app.innerHTML, '<h1 id="hello">hello</h1>\n');
          done();
        });
      }
    );
  });

  it('re-renders whenever the file is updated', (done) => {
    jsdom.env(
      "<div id='app'></div>",
      [],
      (err, win) => {
        let called = 0;
        let renderer = new HTMLRenderer({
          host: 'localhost:1234',
          pathname: '/test.md'
        });
        let app = win.document.getElementById('app');
        renderer.renderTo(app);
        renderer.onUpdate(() => {
          let html = app.innerHTML;
          switch (called) {
          case 0:
            assert.equal(html, '<h1 id="hello">hello</h1>\n');
            fs.writeFile(helper.path('md-root/test.md'), '```js\nvar a=10;\n```');
            break;
          case 1:
            assert.equal(html, '<pre><code class="language-js">var a=10;\n</code></pre>\n');
            fs.writeFile(helper.path('md-root/test.md'), '* nested\n  * nnested\n    * nnnested');
            break;
          case 2:
            assert.equal(html, '<ul>\n<li>nested\n<ul>\n<li>nnested\n<ul>\n<li>nnnested</li>\n</ul>\n</li>\n</ul>\n</li>\n</ul>\n');
            done();
            break;
          }
          called += 1;
        });
      }
    );
  });
});
