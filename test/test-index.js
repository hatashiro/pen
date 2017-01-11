import assert from 'assert';
import helper from './lib/helper';
import path from 'path';
import request from 'request';
import { spawn } from 'child_process';

describe('index', () => {
  let proc;
  const cwd = process.cwd();
  const indexScriptPath = path.join(cwd, 'index.js');

  beforeEach(() => {
    helper.makeDirectory('server-root');
    helper.createFile('server-root/test1.txt', 'hello');
    process.chdir(helper.path('server-root'));
  });

  afterEach(done => {
    proc.on('close', done);
    proc.kill();
    helper.clean();
    process.chdir(cwd);
  });

  it('runs a server listening to a port', done => {
    proc = spawn('node', [indexScriptPath]);
    proc.stdout.on('data', data => {
      assert.equal(data.toString(), 'listening 6060 ...\n');
      request.get('http://localhost:6060/test1.txt', (err, res, body) => {
        if (err) {
          done(err);
          return;
        }

        assert.equal(res.statusCode, 200);
        assert.equal(body, 'hello');
        done();
      });
    });
  });

  it('runs a server listening to a custom port', done => {
    proc = spawn('node', [indexScriptPath, '-p', '1234']);
    proc.stdout.on('data', data => {
      assert.equal(data.toString(), 'listening 1234 ...\n');
      request.get('http://localhost:1234/test1.txt', (err, res, body) => {
        if (err) {
          done(err);
          return;
        }

        assert.equal(res.statusCode, 200);
        assert.equal(body, 'hello');
        done();
      });
    });
  });
});
