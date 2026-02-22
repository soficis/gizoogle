const assert = require("node:assert/strict");
const test = require("node:test");

const { loadBrowserModules } = require("../support/load-browser-modules");
const { translatorModules } = require("../support/module-paths");

function createTranslator() {
  return loadBrowserModules(translatorModules).GizoogleTranslator;
}

test("mode detection drives deterministic discourse openers", () => {
  const api = createTranslator();

  assert.equal(
    api.translateText("Error while loading data.", { level: 2 }),
    "Pump ya brakes! Error while loadin' data. ya dig?",
  );
  assert.equal(
    api.translateText("Success! the team completed the work.", { level: 2 }),
    "That's what's up! Success! da crew completed da grind.",
  );
  assert.equal(
    api.translateText("How do you fix this issue?", { level: 3 }),
    "Whoa whoa whoa, How do ya fix dis issue?",
  );
});

test("cadence transforms include elongation and optional address insertion", () => {
  const api = createTranslator();

  assert.equal(
    api.translateText("The smooth player made a big move in the house.", {
      level: 3,
    }),
    "Da smizzle playa made a biiig move in da hizzle. you feel me?",
  );
  assert.equal(
    api.translateText("I am writing some blocks and checks 92.", { level: 3 }),
    "I am writin' some blocc an' checc 92.",
  );
});

test("level-three cadence can fragment long compounds with one em dash", () => {
  const api = createTranslator();

  assert.equal(
    api.translateText(
      "I went to the store and bought food and came home with snacks for the team 1.",
      { level: 3 },
    ),
    "I went ta da store an' bought munchies — came hizzle with snacc for da crew 1.",
  );
  assert.equal(
    api.translateText("I went and came home.", { level: 3 }),
    "I went an' came hizzle.",
  );
  assert.equal(
    api.translateText(
      "I went to the store and bought food for dinner tonight.",
      { level: 3 },
    ),
    "I went ta da store an' bought munchies for dinna tonight.",
  );
  assert.equal(
    api.translateText(
      "I went to the store and bought food and came home with snacks for the team 1.",
      { level: 2 },
    ),
    "I went to da store an' bought munchies an' came crib with snacks for da crew 1. na'mean?",
  );
});

test("signature tag frequency threshold is deterministic", () => {
  const api = createTranslator();

  const withTag = api.translateText(
    "This is testing string number 8524 in the house.",
    { level: 3 },
  );
  const withoutTag = api.translateText("Error while loading data.", {
    level: 3,
  });

  assert.match(withTag, /ya heard\?$/i);
  assert.equal(withoutTag, "Pump ya brakes! Error while loadin' data, nephew.");
});

test("level-three melodic chant vocalizations inject at phrase onset for music contexts", () => {
  const api = createTranslator();

  assert.equal(
    api.translateText("I like music and coding 10.", { level: 3 }),
    "Da-da-da-da-dah, Yo, I like mizzle an' codin' 10.",
  );
  assert.equal(
    api.translateText("I like music and coding 10.", { level: 2 }),
    "I like beats an' codin' 10.",
  );
});
