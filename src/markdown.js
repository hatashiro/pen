'use strict';

const mdit = require('markdown-it');

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

module.exports = markdown => md().render(markdown);
