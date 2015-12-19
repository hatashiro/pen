'use strict';

const assert = require('assert');
const helper = require('./lib/helper');
const request = require('request');
const Server = require('../src/server');
const WebSocket = require('ws');

const TestPort = 1234;

describe('Server', () => {
  let server;

  beforeEach(() => {
    helper.makeDirectory('server-root');
    helper.createFile('server-root/test1.txt', 'hello');
    helper.createFile('server-root/test2.txt', 'world');
    helper.createFile('server-root/test.md', '# hello');
    helper.createFile('server-root/test2.md', '# hello');
  });

  afterEach(() => {
    server.close();
    helper.clean();
  });

  it('creates a file server on a given path', (done) => {
    server = new Server(helper.path('server-root'));
    server.listen(TestPort);

    let url = `http://localhost:${TestPort}/test1.txt`;
    request.get(url, (err, res, body) => {
      if (err) {
        done(err);
        return;
      }

      assert.equal(res.statusCode, 200);
      assert.equal(body, 'hello');

      let url = `http://localhost:${TestPort}/test2.txt`;
      request.get(url, (err, res, body) => {
        if (err) {
          done(err);
          return;
        }

        assert.equal(res.statusCode, 200);
        assert.equal(body, 'world');
        done();
      });
    });
  });

  it('fails when there is no file', (done) => {
    server = new Server(helper.path('server-root'));
    server.listen(TestPort);

    let url = `http://localhost:${TestPort}/test3.txt`;
    request.get(url, (err, res, body) => {
      if (err) {
        done(err);
        return;
      }

      assert.equal(res.statusCode, 404);
      assert.equal(body, 'Not found');
      done();
    });
  });

  it('shows a list of Markdown files for directories', (done) => {
    server = new Server(helper.path('server-root'));
    server.listen(TestPort);

    let url = `http://localhost:${TestPort}/`;
    request.get(url, (err, res, body) => {
      if (err) {
        done(err);
        return;
      }

      assert.equal(res.statusCode, 200);
      assert.equal(body, "<a href='test.md'>test.md</a> <a href='test2.md'>test2.md</a>");
      done();
    });
  });

  it('shows a preview page for Markdown files', (done) => {
    server = new Server(helper.path('server-root'));
    server.listen(TestPort);

    let url = `http://localhost:${TestPort}/test.md`;
    request.get(url, (err, res, body) => {
      if (err) {
        done(err);
        return;
      }

      assert.equal(res.statusCode, 200);
      assert.equal(res.headers['content-type'], 'text/html');
      assert.ok(helper.previewRegExp('/test.md').exec(body));
      done();
    });
  });

  it('receives a websocket connection', (done) => {
    server = new Server(helper.path('server-root'));
    server.listen(TestPort);

    let url = `ws://localhost:${TestPort}/test.md`;
    let ws = new WebSocket(url);
    ws.on('message', data => {
      assert.equal(data, '<h1 id="hello">hello</h1>\n');
      done();
    });
  });
});
