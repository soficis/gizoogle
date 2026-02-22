const assert = require("node:assert/strict");
const test = require("node:test");

const { loadBrowserModules } = require("../support/load-browser-modules");
const { translatorModules } = require("../support/module-paths");

function loadTranslatorContext() {
  return loadBrowserModules(translatorModules);
}

test("translator clamps levels at boundaries", () => {
  const context = loadTranslatorContext();
  const api = context.GizoogleTranslator;

  assert.equal(api.setLevel(99), 3);
  assert.equal(api.getLevel(), 3);
  assert.equal(api.setLevel(-1), 1);
  assert.equal(api.getLevel(), 1);
});

test("translator end-to-end warning phrase across all levels", () => {
  const context = loadTranslatorContext();
  const api = context.GizoogleTranslator;
  const input = "Hello, this is a warning about your loading issue";

  assert.equal(
    api.translateText(input, { level: 1 }),
    "Yo, dis is a warnin' 'bout your loadin' issue",
  );
  assert.equal(
    api.translateText(input, { level: 2 }),
    "Whoa whoa whoa, Yo, dis is a warnin' 'bout your loadin' issue",
  );
  assert.equal(
    api.translateText(input, { level: 3 }),
    "Aye, check it, Yo, dis is a warnin' 'bout yo loadin' issue",
  );
});

test("translator preserves URLs and emails", () => {
  const context = loadTranslatorContext();
  const api = context.GizoogleTranslator;

  const input = "Please wait at https://example.com and email test@example.com";

  assert.equal(
    api.translateText(input, { level: 3 }),
    "Please hold tiiight at https://example.com an' email test@example.com",
  );
});

test("translator applies expanded izzle fixed forms with level gating", () => {
  const context = loadTranslatorContext();
  const api = context.GizoogleTranslator;

  assert.equal(api.translateText("in the house", { level: 2 }), "in da hizzle");
  assert.equal(api.translateText("this place", { level: 3 }), "dis bizzle");
  assert.equal(api.translateText("this place", { level: 2 }), "dis place");
});

test("translator is idempotent for already translated level-three text", () => {
  const context = loadTranslatorContext();
  const api = context.GizoogleTranslator;

  const once = api.translateText(
    "Hello, this is a warning about your loading issue",
    { level: 3 },
  );
  const twice = api.translateText(once, { level: 3 });

  assert.equal(twice, once);
});

test("translator keeps empty and whitespace-only text unchanged", () => {
  const context = loadTranslatorContext();
  const api = context.GizoogleTranslator;

  assert.equal(api.translateText("", { level: 3 }), "");
  assert.equal(api.translateText("   ", { level: 3 }), "   ");
});

test("translator keeps level hierarchy monotonic by flavor", () => {
  const context = loadTranslatorContext();
  const api = context.GizoogleTranslator;
  const input = "Loading and clicking with your friend";

  const levelOne = api.translateText(input, { level: 1 });
  const levelTwo = api.translateText(input, { level: 2 });
  const levelThree = api.translateText(input, { level: 3 });

  assert.equal(levelOne, "Loadin' an' clickin' with your homie");
  assert.equal(levelTwo, "Loadin' an' clickin' with your homie");
  assert.equal(levelThree, "Loadin' an' clickin' with yo homie");
});
