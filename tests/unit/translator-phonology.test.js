const assert = require("node:assert/strict");
const test = require("node:test");

const { loadBrowserModules } = require("../support/load-browser-modules");
const { translatorModules } = require("../support/module-paths");

function createTranslator() {
  return loadBrowserModules(translatorModules).GizoogleTranslator;
}

test("phonological rules apply ing/er drops and demonstrative shifts", () => {
  const api = createTranslator();

  assert.equal(api.translateText("Runner and singer", { level: 1 }), "Runner an' singa");
  assert.equal(
    api.translateText("This and that and them and those are there", { level: 1 }),
    "Dis an' dat an' dem an' doze are dere"
  );
});

test("phonological rules keep exclusion words intact", () => {
  const api = createTranslator();

  assert.equal(api.translateText("king ring thing", { level: 1 }), "king ring thing");
});

test("phonological rules preserve case for transformed words", () => {
  const api = createTranslator();

  assert.equal(api.translateText("This is THE warning", { level: 1 }), "Dis is DA warnin'");
});

test("level-three west coast orthography turns ks and cks into cc", () => {
  const api = createTranslator();

  assert.equal(api.translateText("I am writing some blocks and checks 92.", { level: 3 }), "I am writin' some blocc an' checc 92.");
});

test("terminal s shifts to z for voiced-consonant endings at level two and above", () => {
  const api = createTranslator();

  assert.equal(
    api.translateText("dogs and plans move fast.", { level: 2 }),
    "dogz an' planz move fast.",
  );
  assert.equal(
    api.translateText("this is classic.", { level: 2 }),
    "dis is classic.",
  );
});
