import assert from "assert";
import path from "path";
import fs from "fs";

describe("built HTML", () => {
  const indexHTMLPath = path.join(__dirname, "../dist/index.html");

  it("exists", () => {
    assert.ok(fs.readFileSync(indexHTMLPath));
  });

  it("contains a style tag", () => {
    const html = fs.readFileSync(indexHTMLPath);
    assert.ok(/<style.+>/.test(html));
  });

  it("contains a script tag", () => {
    const html = fs.readFileSync(indexHTMLPath);
    assert.ok(/<script.+>/.test(html));
  });
});
