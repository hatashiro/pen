import assert from "assert";
import helper from "./lib/helper";
import path from "path";
import request from "request";
import { spawn } from "child_process";

describe("index", () => {
  let proc = null;
  const cwd = process.cwd();
  const indexScriptPath = path.join(cwd, "index.js");

  beforeEach(() => {
    helper.makeDirectory("server-root");
    helper.createFile("server-root/test1.txt", "hello");
    process.chdir(helper.path("server-root"));
  });

  afterEach(done => {
    if (proc !== null) {
      proc.on("close", done);
      proc.kill();
    } else {
      setTimeout(done);
    }

    proc = null;

    helper.clean();
    process.chdir(cwd);
  });

  it("runs a server listening to a port", done => {
    proc = spawn("node", [indexScriptPath]);
    proc.stdout.on("data", data => {
      assert.equal(data.toString(), "listening 6060 ...\n");
      request.get("http://localhost:6060/test1.txt", (err, res, body) => {
        if (err) {
          done(err);
          return;
        }

        assert.equal(res.statusCode, 200);
        assert.equal(body, "hello");
        done();
      });
    });
  });

  it("runs a server listening to a custom port", done => {
    proc = spawn("node", [indexScriptPath, "-p", "1234"]);
    proc.stdout.on("data", data => {
      assert.equal(data.toString(), "listening 1234 ...\n");
      request.get("http://localhost:1234/test1.txt", (err, res, body) => {
        if (err) {
          done(err);
          return;
        }

        assert.equal(res.statusCode, 200);
        assert.equal(body, "hello");
        done();
      });
    });
  });

  it("runs mult server with default port", done => {
    let procs = [];

    // cs -> create server
    let cs = () => {
      return new Promise(resolve => {
        let proc = spawn("node", [indexScriptPath]);
        procs.push(proc);
        proc.stdout.on("data", data => {
          let port = data.toString().match(/listening (\d+)/);

          if (port === null) {
            resolve("get listening port fail ...");
            return;
          }

          port = port[1];

          request.get(`http://localhost:${port}/test1.txt`, err => {
            if (err) {
              resolve(err);
              return;
            }

            resolve("success");
          });
        });
      });
    };

    // cp -> close process
    let cp = proc => {
      return new Promise(resolve => {
        proc.on("close", resolve);
        proc.kill();
      });
    };

    Promise.all([cs(), cs(), cs(), cs()]).then(results => {
      results.forEach(result => {
        assert.equal(result, "success");
      });

      Promise.all(procs.map(cp)).then(() => {
        done();
      });
    });
  });
});
