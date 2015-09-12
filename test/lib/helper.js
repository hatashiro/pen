'use strict';

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const root = path.join(__dirname, '../temp');

function filePath(p) {
  return path.join(root, p);
}

try {
  fs.mkdirSync(root);
} catch (e) {
  // do nothing
}

module.exports = {
  createFile(p, initialContent) {
    fs.writeFileSync(filePath(p), initialContent);
  },
  path(p) {
    return path.join(root, p);
  },
  clean() {
    rimraf.sync(path.join(root, '*'));
  }
};
