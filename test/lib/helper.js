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
  makeDirectory(p) {
    fs.mkdirSync(filePath(p));
  },
  path(p) {
    return path.join(root, p);
  },
  clean() {
    rimraf.sync(path.join(root, '*'));
  },
  previewRegExp(pathname) {
    let basename = path.basename(pathname);
    let regexStr = `^<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${basename}<\/title><style>(.|\n)*<\/style><\/head><body><div id="app"><\/div><script>(.|\n)*<\/script><\/body><\/html>$`;
    return new RegExp(regexStr);
  }
};
