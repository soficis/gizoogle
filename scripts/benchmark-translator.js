#!/usr/bin/env node

const path = require("node:path");
const { performance } = require("node:perf_hooks");

const { loadBrowserModules } = require("./lib/load-browser-modules");

const translatorModulePaths = [
  "src/shared/contracts.js",
  "src/shared/validation.js",
  "src/domain/translator/constants.js",
  "src/domain/translator/snoop-lexicon-level1.js",
  "src/domain/translator/snoop-lexicon-level2.js",
  "src/domain/translator/snoop-lexicon-level3.js",
  "src/domain/translator/snoop-lexicon-izzle-aave.js",
  "src/domain/translator/snoop-lexicon-style-data.js",
  "src/domain/translator/snoop-lexicon-data.js",
  "src/domain/translator/snoop-lexicon.js",
  "src/domain/translator/helpers.js",
  "src/domain/translator/mode-detection.js",
  "src/domain/translator/preserve.js",
  "src/domain/translator/replacements-shared.js",
  "src/domain/translator/replacements-core.js",
  "src/domain/translator/replacements-aave.js",
  "src/domain/translator/replacements-style.js",
  "src/domain/translator/replacements-flavor.js",
  "src/domain/translator/replacements.js",
  "src/domain/translator/pipeline.js",
  "src/domain/translator/index.js",
].map((relativePath) => path.resolve(__dirname, "..", relativePath));

const fixtureText = [
  "North Korea and South Korea",
  "Error while loading data",
  "Please click the button and submit your form",
  "This is a normal paragraph with no warning or success state.",
].join("\n");

function benchmark(iterations, level) {
  const context = loadBrowserModules(translatorModulePaths, { performance });
  const translatorApi = context.GizoogleTranslator;

  const startedAt = performance.now();

  for (let index = 0; index < iterations; index += 1) {
    translatorApi.translateText(fixtureText, { level });
  }

  const durationMs = performance.now() - startedAt;
  const charsProcessed = fixtureText.length * iterations;
  const charsPerSecond = Math.round((charsProcessed / durationMs) * 1000);

  return {
    iterations,
    level,
    durationMs: Number(durationMs.toFixed(2)),
    charsPerSecond,
  };
}

const levelTwo = benchmark(3000, 2);
const levelThree = benchmark(3000, 3);

console.log("Translator benchmark");
console.log(levelTwo);
console.log(levelThree);
