const assert = require("node:assert/strict");
const test = require("node:test");

const { loadBrowserModules } = require("../support/load-browser-modules");
const { translatorModules } = require("../support/module-paths");

function createTranslator() {
  return loadBrowserModules(translatorModules).GizoogleTranslator;
}

test("quote injection maps motivation intent to deterministic wisdom tags", () => {
  const api = createTranslator();
  const output = api.translateText("my hustle and grind goal 2.", { level: 3 });

  assert.equal(
    output,
    "my hustle an' grind gizzle 2. The game is to be sold, not to be told.",
  );
});

test("quote injection maps chill intent at level three", () => {
  const api = createTranslator();
  const output = api.translateText("i want to relax this weekend 6.", {
    level: 3,
  });

  assert.equal(
    output,
    "i want ta chill dis weekend 6. Just chill, 'til the next episode.",
  );
});

test("quote injection is level-gated and deterministic", () => {
  const api = createTranslator();
  const input = "my hustle and grind goal 2.";

  assert.equal(
    api.translateText(input, { level: 2 }),
    "my hustle an' grind goal 2.",
  );
  assert.equal(
    api.translateText(input, { level: 3 }),
    api.translateText(input, { level: 3 }),
  );
});

test("quote injection skips when the selected quote already exists", () => {
  const api = createTranslator();
  const once = api.translateText("keep it real and honest truth 6.", {
    level: 3,
  });
  const twice = api.translateText(once, { level: 3 });

  assert.equal(
    once,
    "keep it real an' honest truth 6. Real recognize real, fake recognize fake.",
  );
  assert.equal(twice, once);
});
