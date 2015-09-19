'use strict';

const open = require('open');
const Server = require('./src/server');

const DefaultPort = 6060;

const argv = require('yargs')
  .usage('Usage: $0 [options] [file]')
  .default('p', DefaultPort)
  .alias('p', 'port')
  .describe('p', 'Set a custom port')
  .help('h')
  .alias('h', 'help')
  .argv;

let server = new Server(process.cwd());
server.listen(argv.port, () => {
  console.log(`listening ${argv.port} ...`);

  argv._.forEach(file => {
    open(`http://localhost:${argv.port}/${file}`);
  });
});
