const assert = require("node:assert/strict");
const test = require("node:test");

const { loadBrowserModules } = require("../support/load-browser-modules");
const { translatorModules } = require("../support/module-paths");

const GEO_REFERENCE_PATTERN =
  /(LBC|Long Beach|West Coast|the 213|the coast|the block|Eastside|the 562)/i;

function createTranslator() {
  return loadBrowserModules(translatorModules).GizoogleTranslator;
}

test("geographic flavor injects west-coast identity for location text at level three", () => {
  const api = createTranslator();
  const output = api.translateText("i travel to the city number 100.", {
    level: 3,
  });

  assert.match(output, GEO_REFERENCE_PATTERN);
  assert.equal(
    output,
    "Straight outta Long Beach, i travel ta da town numba 100.",
  );
});

test("geographic flavor skips non-location text", () => {
  const api = createTranslator();
  const output = api.translateText("i like music and coding.", { level: 3 });

  assert.equal(output, "i like mizzle an' codin'.");
  assert.equal(GEO_REFERENCE_PATTERN.test(output), false);
});

test("geographic flavor does not double-inject when reference already exists", () => {
  const api = createTranslator();
  const output = api.translateText("i travel to the city from LBC.", {
    level: 3,
  });

  assert.equal(output, "i travel ta da town from LBC.");
  assert.equal((output.match(/LBC/g) || []).length, 1);
});

test("geographic flavor is disabled for level one", () => {
  const api = createTranslator();
  const output = api.translateText("i travel to the city number 100.", {
    level: 1,
  });

  assert.equal(output, "i travel to da city numba 100.");
  assert.equal(GEO_REFERENCE_PATTERN.test(output), false);
});
