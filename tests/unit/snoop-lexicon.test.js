const assert = require("node:assert/strict");
const test = require("node:test");

const { loadBrowserModules } = require("../support/load-browser-modules");
const { translatorModules } = require("../support/module-paths");

function loadLexicon() {
  const context = loadBrowserModules(translatorModules);
  return context.Gizoogle.domain.translator.snoopLexicon;
}

function isRegExp(value) {
  return Object.prototype.toString.call(value) === "[object RegExp]";
}

function assertNoDuplicatePatterns(rules) {
  const seenPatterns = new Set();

  for (const rule of rules) {
    const key = rule.pattern.toString();
    assert.equal(
      seenPatterns.has(key),
      false,
      `Duplicate pattern found: ${key}`,
    );
    seenPatterns.add(key);
  }
}

test("snoop lexicon loads and has non-empty categories", () => {
  const lexicon = loadLexicon();

  assert.ok(lexicon);
  assert.ok(lexicon.phonologicalRules.length > 0);
  assert.ok(lexicon.lexicalSubstitutions.level1.length > 0);
  assert.ok(lexicon.lexicalSubstitutions.level2.length > 0);
  assert.ok(lexicon.lexicalSubstitutions.level3.length > 0);
  assert.ok(lexicon.izzleFixedFormsLevel2.length > 0);
  assert.ok(lexicon.izzleFixedFormsLevel3.length > 0);
  assert.ok(lexicon.aaveRules.zeroCopula.length > 0);
  assert.ok(
    Object.keys(lexicon.aaveRules.thirdPersonSingular.verbMap).length > 0,
  );
  assert.ok(lexicon.geographicInjection.references.length > 0);
  assert.ok(Object.keys(lexicon.quoteBank).length > 0);
  assert.ok(lexicon.discourseMarkers.openers.warning.length > 0);
  assert.ok(lexicon.discourseMarkers.closers.length > 0);
  assert.ok(lexicon.addressTerms.length > 0);
});

test("all lexicon rule patterns are valid regular expressions", () => {
  const lexicon = loadLexicon();
  const rules = [
    ...lexicon.phonologicalRules,
    ...lexicon.lexicalSubstitutions.level1,
    ...lexicon.lexicalSubstitutions.level2,
    ...lexicon.lexicalSubstitutions.level3,
    ...lexicon.izzleFixedFormsLevel2,
    ...lexicon.izzleFixedFormsLevel3,
    ...lexicon.aaveRules.zeroCopula,
    ...lexicon.discourseMarkers.fillers,
    ...lexicon.countryReplacements,
  ];

  for (const rule of rules) {
    assert.equal(
      isRegExp(rule.pattern),
      true,
      `Rule is missing RegExp: ${rule.replacement}`,
    );
  }

  assert.equal(isRegExp(lexicon.izzleQualifyingPatterns), true);
  assert.equal(isRegExp(lexicon.geographicInjection.triggerKeywords), true);

  for (const category of Object.values(lexicon.quoteBank)) {
    assert.equal(isRegExp(category.keywords), true);
  }
});

test("no duplicate regex patterns exist inside each lexicon category", () => {
  const lexicon = loadLexicon();

  assertNoDuplicatePatterns(lexicon.phonologicalRules);
  assertNoDuplicatePatterns(lexicon.lexicalSubstitutions.level1);
  assertNoDuplicatePatterns(lexicon.lexicalSubstitutions.level2);
  assertNoDuplicatePatterns(lexicon.lexicalSubstitutions.level3);
  assertNoDuplicatePatterns(lexicon.izzleFixedFormsLevel2);
  assertNoDuplicatePatterns(lexicon.izzleFixedFormsLevel3);
  assertNoDuplicatePatterns(lexicon.aaveRules.zeroCopula);
  assertNoDuplicatePatterns(lexicon.discourseMarkers.fillers);
  assertNoDuplicatePatterns(lexicon.countryReplacements);
});
