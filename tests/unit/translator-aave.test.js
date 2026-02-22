const assert = require("node:assert/strict");
const test = require("node:test");

const { loadBrowserModules } = require("../support/load-browser-modules");
const { translatorModules } = require("../support/module-paths");

function createTranslator() {
  return loadBrowserModules(translatorModules).GizoogleTranslator;
}

test("aave zero-copula drops present-tense copula in eligible level-three sentences", () => {
  const api = createTranslator();

  assert.equal(
    api.translateText("he is running fast.", { level: 3 }),
    "he runnin' fast.",
  );
  assert.equal(api.translateText("he is ready.", { level: 3 }), "he ready.");
});

test("aave third-person singular omission maps common verbs at level three", () => {
  const api = createTranslator();

  assert.equal(
    api.translateText("he goes home now.", { level: 3 }),
    "he go hizzle now.",
  );
});

test("aave restructuring skips modal constructions", () => {
  const api = createTranslator();

  assert.equal(
    api.translateText("he will goes home.", { level: 3 }),
    "he will goes hizzle.",
  );
});

test("aave restructuring is level-gated and deterministic", () => {
  const api = createTranslator();
  const input = "he is running fast.";

  assert.equal(api.translateText(input, { level: 2 }), "he is runnin' fast.");
  assert.equal(
    api.translateText(input, { level: 3 }),
    api.translateText(input, { level: 3 }),
  );
});
