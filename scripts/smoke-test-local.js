#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

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

function run() {
  const fixturePath = path.resolve(__dirname, "fixtures", "smoke-fixture.json");
  const fixtures = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

  const context = loadBrowserModules(translatorModulePaths);
  const translatorApi = context.GizoogleTranslator;

  let failures = 0;

  for (const fixture of fixtures) {
    const output = translatorApi.translateText(fixture.input, {
      level: fixture.level,
    });
    const passed = output === fixture.expected;

    if (!passed) {
      failures += 1;
    }

    console.log(`${passed ? "PASS" : "FAIL"} :: ${fixture.name}`);

    if (!passed) {
      console.log(`  input:    ${fixture.input}`);
      console.log(`  expected: ${fixture.expected}`);
      console.log(`  actual:   ${output}`);
    }
  }

  if (failures > 0) {
    process.exitCode = 1;
  }
}

run();
