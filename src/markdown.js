'use strict';

const argv = require('./argv');
const mdit = require('markdown-it');
const pandoc = require('simple-pandoc');

const singleton = (creator) => {
  let obj;
  return () => obj || (obj = creator());
};

const md = singleton(() =>
  mdit({html: true, linkify: true})
    .use(require('markdown-it-highlightjs'))
    .use(require('markdown-it-emoji'))
    .use(require('markdown-it-checkbox'))
    .use(require('markdown-it-anchor'))
);

const pd = singleton(() =>
  pandoc(argv.pandoc, 'html')
);

module.exports = markdown =>
  argv.pandoc ? pd()(markdown) : Promise.resolve(md().render(markdown));
