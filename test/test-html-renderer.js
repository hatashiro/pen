import assert from 'assert';
import fs from 'fs';
import helper from './lib/helper';
import HTMLRenderer from '../src/frontend/html-renderer';
import http from 'http';
import MarkdownSocket from '../src/markdown-socket';
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';

function getRenderedHTML(rendered) {
  const div = ReactTestUtils.findRenderedDOMComponentWithTag(rendered, 'div');
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
    let renderer = React.createElement(HTMLRenderer, {
      location: {
        host: 'localhost:1234',
        pathname: '/test.md'
      },
      onUpdate() {
        assert.equal(getRenderedHTML(rendered), '<h1 id="hello">hello</h1>\n');
        done();
      }
    });
    rendered = ReactTestUtils.renderIntoDocument(renderer);
  });

  it('re-renders whenever the file is updated', (done) => {
    const callback = err => { if (err) { done(err); } };

    let called = 0;
    let rendered;
    let renderer = React.createElement(HTMLRenderer, {
      location: {
        host: 'localhost:1234',
        pathname: '/test.md'
      },
      onUpdate() {
        let html = getRenderedHTML(rendered);
        switch (called) {
        case 0:
          assert.equal(html, '<h1 id="hello">hello</h1>\n');
          fs.writeFile(helper.path('md-root/test.md'), '```js\nvar a=10;\n```', callback);
          break;
        case 1:
          assert.equal(html, '<pre><code class="hljs language-js"><span class="hljs-keyword">var</span> a=<span class="hljs-number">10</span>;\n</code></pre>\n');
          fs.writeFile(helper.path('md-root/test.md'), '* nested\n  * nnested\n    * nnnested', callback);
          break;
        case 2:
          assert.equal(html, '<ul>\n<li>nested\n<ul>\n<li>nnested\n<ul>\n<li>nnnested</li>\n</ul>\n</li>\n</ul>\n</li>\n</ul>\n');
          done();
          break;
        }
        called += 1;
      }
    });
    rendered = ReactTestUtils.renderIntoDocument(renderer);
  });
});
