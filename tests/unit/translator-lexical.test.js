const assert = require("node:assert/strict");
const test = require("node:test");

const { loadBrowserModules } = require("../support/load-browser-modules");
const { translatorModules } = require("../support/module-paths");

function createTranslator() {
  return loadBrowserModules(translatorModules).GizoogleTranslator;
}

test("level-one lexical substitutions cover baseline words", () => {
  const api = createTranslator();

  assert.equal(
    api.translateText("friend money car house", { level: 1 }),
    "homie paper ride crib",
  );
});

test("level-two lexical substitutions cover people, possessions, actions, and culture", () => {
  const api = createTranslator();

  const input = "friend money car house neighborhood smoke drink";
  const output = api.translateText(input, { level: 2 });

  assert.equal(output, "homie paper ride crib hood blaze sip");
  assert.equal(api.translateText("friends cars", { level: 2 }), "homies rides");
});

test("level-three lexical substitutions add deeper slang", () => {
  const api = createTranslator();

  const input = "For sure my friend in the house.";
  assert.equal(
    api.translateText(input, { level: 2 }),
    "Fo shizzle, my nizzle in da hizzle.",
  );
  assert.equal(
    api.translateText(input, { level: 3 }),
    "Fo shizzle, my nizzle in da hizzle.",
  );
});

test("level-three car culture vocabulary maps rides to low-low and vehicles to Lex", () => {
  const api = createTranslator();

  assert.equal(
    api.translateText("my car and vehicles.", { level: 3 }),
    "my low-low an' Lexes.",
  );
  assert.equal(
    api.translateText("my car and vehicles.", { level: 2 }),
    "my ride an' Lexes.",
  );
});

test("country replacement rules still apply before lexical stages", () => {
  const api = createTranslator();

  const output = api.translateText("North Korea and South Korea", { level: 2 });
  assert.equal(output, "Uptown Korea an' Downtown Korea");
});
