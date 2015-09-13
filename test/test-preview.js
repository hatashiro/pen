'use strict';

const assert = require('assert');
const helper = require('./lib/helper');
const preview = require('../src/preview');

describe('preview', () => {
  it('returns a preview page for a given Markdown path', () => {
    let path = '/test-dir/test-file.md';
    let html = preview(path);
    let expectedRegex = helper.previewRegExp(path);
    assert.ok(expectedRegex.exec(html));
  });
});
