'use strict';

const assert = require('assert');
const fs = require('fs');
const helper = require('./lib/helper');
const HTMLRenderer = require('../src/template/script/html-renderer');
const http = require('http');
const MarkdownSocket = require('../src/markdown-socket');
const ReactTestUtils = require('react-addons-test-utils');

function getRenderedHTML(rendered) {
  let div = ReactTestUtils.findRenderedDOMComponentWithTag(rendered, 'div');
  return div.innerHTML.replace(/ data-react[-\w]+="[^"]+"/g, '');
}

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
    let rendered;
    let renderer = HTMLRenderer({
      location: {
        host: 'localhost:1234',
        pathname: '/test.md'
      },
      onUpdate() {
        assert.equal(getRenderedHTML(rendered), '<h1 id="hello"><span>hello</span></h1><span>\n</span>');
        done();
      }
    });
    rendered = ReactTestUtils.renderIntoDocument(renderer);
  });

  it('re-renders whenever the file is updated', (done) => {
    let called = 0;
    let rendered;
    let renderer = HTMLRenderer({
      location: {
        host: 'localhost:1234',
        pathname: '/test.md'
      },
      onUpdate() {
        let html = getRenderedHTML(rendered);
        switch (called) {
        case 0:
          assert.equal(html, '<h1 id="hello"><span>hello</span></h1><span>\n</span>');
          fs.writeFile(helper.path('md-root/test.md'), '```js\nvar a=10;\n```');
          break;
        case 1:
          assert.equal(html, '<pre><code class="language-js"><span>var a=10;\n</span></code></pre><span>\n</span>');
          fs.writeFile(helper.path('md-root/test.md'), '* nested\n  * nnested\n    * nnnested');
          break;
        case 2:
          assert.equal(html, '<ul><span>\n</span><li><span>nested\n</span><ul><span>\n</span><li><span>nnested\n</span><ul><span>\n</span><li><span>nnnested</span></li><span>\n</span></ul><span>\n</span></li><span>\n</span></ul><span>\n</span></li><span>\n</span></ul><span>\n</span>');
          done();
          break;
        }
        called += 1;
      }
    });
    rendered = ReactTestUtils.renderIntoDocument(renderer);
  });
});
