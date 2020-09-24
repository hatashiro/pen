"use strict";

const DEFAULT_BROWSER = "firefox";
const DEFAULT_PORT = 6060;

module.exports = require("yargs")
  .usage("Usage: $0 [options] [file]")
  .option("b", {
    alias: "browser",
    default: DEFAULT_BROWSER,
    describe: "Set browser to use"
  })
  .option("p", {
    alias: "port",
    default: DEFAULT_PORT,
    describe: "Set a custom port"
  })
  .option("pandoc", {
    type: "string",
    describe:
      "Use local pandoc as markdown converter. Provide target format as the value."
  })
  .help("h")
  .alias("h", "help").argv;
