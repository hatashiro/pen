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
        assert.equal(getRenderedHTML(rendered), '<h1 id="hello"><!-- react-text: 3 -->hello<!-- /react-text --></h1><!-- react-text: 4 -->\n<!-- /react-text -->');
        done();
      }
    });
    rendered = ReactTestUtils.renderIntoDocument(renderer);
  });

  it('re-renders whenever the file is updated', (done) => {
    const callback = err => { if (err) { done(err); } };

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
          assert.equal(html, '<h1 id="hello"><!-- react-text: 3 -->hello<!-- /react-text --></h1><!-- react-text: 4 -->\n<!-- /react-text -->');
          fs.writeFile(helper.path('md-root/test.md'), '```js\nvar a=10;\n```', callback);
          break;
        case 1:
          assert.equal(html, '<pre><code class="language-js"><!-- react-text: 7 -->var a=10;\n<!-- /react-text --></code></pre><!-- react-text: 4 -->\n<!-- /react-text -->');
          fs.writeFile(helper.path('md-root/test.md'), '* nested\n  * nnested\n    * nnnested', callback);
          break;
        case 2:
          assert.equal(html, '<ul><!-- react-text: 9 -->\n<!-- /react-text --><li><!-- react-text: 11 -->nested\n<!-- /react-text --><ul><!-- react-text: 13 -->\n<!-- /react-text --><li><!-- react-text: 15 -->nnested\n<!-- /react-text --><ul><!-- react-text: 17 -->\n<!-- /react-text --><li><!-- react-text: 19 -->nnnested<!-- /react-text --></li><!-- react-text: 20 -->\n<!-- /react-text --></ul><!-- react-text: 21 -->\n<!-- /react-text --></li><!-- react-text: 22 -->\n<!-- /react-text --></ul><!-- react-text: 23 -->\n<!-- /react-text --></li><!-- react-text: 24 -->\n<!-- /react-text --></ul><!-- react-text: 4 -->\n<!-- /react-text -->');
          done();
          break;
        }
        called += 1;
      }
    });
    rendered = ReactTestUtils.renderIntoDocument(renderer);
  });
});
