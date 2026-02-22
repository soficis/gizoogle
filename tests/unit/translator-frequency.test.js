const assert = require("node:assert/strict");
const test = require("node:test");

const { loadBrowserModules } = require("../support/load-browser-modules");
const { translatorModules } = require("../support/module-paths");

const CLOSER_PATTERN = /(ya dig\?|you feel me\?|fo' shizzle\.|na'mean\?|ya heard\?|chuuch\.|bow wow\.)/i;
const ADDRESS_PATTERN = /,\s*(baby|nephew|cuz|player|dogg|loc|homie)\b/i;

function measureFrequencies(level, count = 200) {
  const api = loadBrowserModules(translatorModules).GizoogleTranslator;
  let withCloser = 0;
  let withAddress = 0;

  for (let index = 0; index < count; index += 1) {
    const input = `Regular sentence number ${index} about smooth plans.`;
    const output = api.translateText(input, { level });

    if (CLOSER_PATTERN.test(output)) {
      withCloser += 1;
    }

    if (ADDRESS_PATTERN.test(output)) {
      withAddress += 1;
    }
  }

  return {
    closerRatio: withCloser / count,
    addressRatio: withAddress / count
  };
}

test("signature closers stay near configured level-two and level-three rates", () => {
  const levelTwo = measureFrequencies(2);
  const levelThree = measureFrequencies(3);

  assert.equal(levelTwo.closerRatio >= 0.05 && levelTwo.closerRatio <= 0.15, true);
  assert.equal(levelThree.closerRatio >= 0.25 && levelThree.closerRatio <= 0.35, true);
});

test("level-three cadence adds direct address to a minority of sentences", () => {
  const levelThree = measureFrequencies(3);

  assert.equal(levelThree.addressRatio >= 0.05 && levelThree.addressRatio <= 0.15, true);
});
