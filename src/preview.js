'use strict';

const jade = require('jade');
const path = require('path');

const previewTemplate = path.join(__dirname, 'template/preview.jade');

function preview(pathname) {
  return jade.renderFile(previewTemplate, {
    basename: path.basename(pathname),
    pathname: pathname
  });
}

module.exports = preview;
