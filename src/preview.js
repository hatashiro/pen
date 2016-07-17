'use strict';

const pug = require('pug');
const path = require('path');

const previewTemplate = path.join(__dirname, 'template/preview.pug');

function preview(pathname) {
  return pug.renderFile(previewTemplate, {
    basename: path.basename(pathname),
    pathname: pathname
  });
}

module.exports = preview;
