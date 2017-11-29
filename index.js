'use strict';

const open = require('opn');
const Server = require('./src/server');
const argv = require('./src/argv');

let server = new Server(process.cwd());
server.listen(argv.port, () => {
  console.log(`listening ${argv.port} ...`);

  argv._.forEach(file => {
    open(`http://localhost:${argv.port}/${file}`);
  });
});
