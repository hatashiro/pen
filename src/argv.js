'use strict';

const DefaultPort = 6060;

module.exports = require('yargs')
  .usage('Usage: $0 [options] [file]')
  .default('p', DefaultPort)
  .alias('p', 'port')
  .describe('p', 'Set a custom port')
  .help('h')
  .alias('h', 'help')
  .argv;
