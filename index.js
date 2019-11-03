"use strict";

const open = require("opn");
const Server = require("./src/server");
const argv = require("./src/argv");

let server = new Server(process.cwd());

server.listen(argv.port, () => {
  let port = server.getPort();

  console.log(`listening ${port} ...`);

  argv._.forEach(file =>
    open(`http://localhost:${port}/${file}`).catch(() => {})
  );
});

process.on("uncaughtException", err => {
  if (err.errno === "EADDRINUSE") {
    server.listen(0);
    return;
  }

  console.log(err);

  process.exit(1);
});
