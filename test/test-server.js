import assert from "assert";
import helper from "./lib/helper";
import request from "request";
import Server from "../src/server";
import { w3cwebsocket as WebSocket } from "websocket";

const TestPort = 1234;

describe("Server", () => {
  let server;

  beforeEach(() => {
    helper.makeDirectory("server-root");
    helper.createFile("server-root/test1.txt", "hello");
    helper.createFile("server-root/test2.txt", "world");
    helper.createFile("server-root/test.md", "# hello");
    helper.createFile("server-root/test2.md", "# hello");
    helper.createFile("server-root/test3.MD", "# hello");
    helper.createFile("server-root/test4.markdown", "# hello");
  });

  afterEach(() => {
    server.close();
    helper.clean();
  });

  it("creates a file server on a given path", done => {
    server = new Server(helper.path("server-root"));
    server.listen(TestPort);

    let url = `http://localhost:${TestPort}/test1.txt`;
    request.get(url, (err, res, body) => {
      if (err) {
        done(err);
        return;
      }

      assert.equal(res.statusCode, 200);
      assert.equal(body, "hello");

      let url = `http://localhost:${TestPort}/test2.txt`;
      request.get(url, (err, res, body) => {
        if (err) {
          done(err);
          return;
        }

        assert.equal(res.statusCode, 200);
        assert.equal(body, "world");
        done();
      });
    });
  });

  it("fails when there is no file", done => {
    server = new Server(helper.path("server-root"));
    server.listen(TestPort);

    let url = `http://localhost:${TestPort}/test3.txt`;
    request.get(url, (err, res, body) => {
      if (err) {
        done(err);
        return;
      }

      assert.equal(res.statusCode, 404);
      assert.equal(body, "Not found");
      done();
    });
  });

  it("shows a list of Markdown files for directories", done => {
    server = new Server(helper.path("server-root"));
    server.listen(TestPort);

    let url = `http://localhost:${TestPort}/`;
    request.get(url, (err, res, body) => {
      if (err) {
        done(err);
        return;
      }

      assert.equal(res.statusCode, 200);
      assert.equal(
        body,
        "<a href='test.md'>test.md</a> <a href='test2.md'>test2.md</a> <a href='test3.MD'>test3.MD</a> <a href='test4.markdown'>test4.markdown</a>"
      );
      done();
    });
  });

  function previewTest(filename) {
    return new Promise((resolve, reject) => {
      request.get(
        `http://localhost:${TestPort}/${filename}`,
        (err, res, body) => {
          if (err) {
            reject(err);
            return;
          }

          assert.equal(res.statusCode, 200);
          assert.equal(res.headers["content-type"], "text/html");
          assert.ok(/<style.+>/.test(body));
          assert.ok(/<script.+>/.test(body));
          resolve();
        }
      );
    });
  }

  it("shows a preview page for Markdown files", async () => {
    server = new Server(helper.path("server-root"));
    server.listen(TestPort);

    await previewTest("test.md");
    await previewTest("test2.md");
    await previewTest("test3.MD");
    await previewTest("test4.markdown");
  });

  it("receives a websocket connection", done => {
    server = new Server(helper.path("server-root"));
    server.listen(TestPort);

    let url = `ws://localhost:${TestPort}/test.md`;
    let ws = new WebSocket(url);
    ws.onmessage = message => {
      assert.equal(message.data, '<h1 id="hello">hello</h1>\n');
      done();
    };
  });
});
