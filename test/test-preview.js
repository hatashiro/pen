import assert from 'assert';
import helper from './lib/helper';
import preview from '../src/preview';

describe('preview', () => {
  it('returns a preview page for a given Markdown path', () => {
    let path = '/test-dir/test-file.md';
    let html = preview(path);
    let expectedRegex = helper.previewRegExp(path);
    assert.ok(expectedRegex.exec(html));
  });
});
