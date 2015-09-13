'use strict';

const assert = require('assert');
const helper = require('./lib/helper');
const request = require('request');
const Server = require('../src/server');

describe('Server', () => {
  let server;

  beforeEach(() => {
    helper.makeDirectory('server-root');
    helper.createFile('server-root/test1.txt', 'hello');
    helper.createFile('server-root/test2.txt', 'world');
    helper.createFile('server-root/test.md', '# hello');
  });

  afterEach(() => {
    server.close();
    helper.clean();
  });

  it('creates a file server on a given path', (done) => {
    server = new Server(helper.path('server-root'));
    server.listen();

    let url = `http://localhost:${Server.DefaultPort}/test1.txt`;
    request.get(url, (err, res, body) => {
      if (err) {
        done(err);
        return;
      }

      assert.equal(res.statusCode, 200);
      assert.equal(body, 'hello');

      let url = `http://localhost:${Server.DefaultPort}/test2.txt`;
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

  it('creates a server with a custom port', (done) => {
    server = new Server(helper.path('server-root'));
    server.listen(1234);

    let url = `http://localhost:1234/test1.txt`;
    request.get(url, (err, res, body) => {
      if (err) {
        done(err);
        return;
      }

      assert.equal(res.statusCode, 200);
      assert.equal(body, 'hello');
      done();
    });
  });

  it('fails when there is no file', (done) => {
    server = new Server(helper.path('server-root'));
    server.listen();

    let url = `http://localhost:${Server.DefaultPort}/test3.txt`;
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

  it('shows a preview page for Markdown files', (done) => {
    server = new Server(helper.path('server-root'));
    server.listen();

    let url = `http://localhost:${Server.DefaultPort}/test.md`;
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
});
