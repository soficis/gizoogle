const path = require("node:path");

function repoPath(relativePath) {
  return path.resolve(__dirname, "..", "..", relativePath);
}

const sharedModules = [
  repoPath("src/shared/contracts.js"),
  repoPath("src/shared/validation.js"),
];

const translatorModules = [
  ...sharedModules,
  repoPath("src/domain/translator/constants.js"),
  repoPath("src/domain/translator/snoop-lexicon-level1.js"),
  repoPath("src/domain/translator/snoop-lexicon-level2.js"),
  repoPath("src/domain/translator/snoop-lexicon-level3.js"),
  repoPath("src/domain/translator/snoop-lexicon-izzle-aave.js"),
  repoPath("src/domain/translator/snoop-lexicon-style-data.js"),
  repoPath("src/domain/translator/snoop-lexicon-data.js"),
  repoPath("src/domain/translator/snoop-lexicon.js"),
  repoPath("src/domain/translator/helpers.js"),
  repoPath("src/domain/translator/mode-detection.js"),
  repoPath("src/domain/translator/preserve.js"),
  repoPath("src/domain/translator/replacements-shared.js"),
  repoPath("src/domain/translator/replacements-core.js"),
  repoPath("src/domain/translator/replacements-aave.js"),
  repoPath("src/domain/translator/replacements-style.js"),
  repoPath("src/domain/translator/replacements-flavor.js"),
  repoPath("src/domain/translator/replacements.js"),
  repoPath("src/domain/translator/pipeline.js"),
  repoPath("src/domain/translator/index.js"),
];

const contentModules = [
  ...translatorModules,
  repoPath("src/app/settings-service.js"),
  repoPath("src/app/translate-page-usecase.js"),
  repoPath("src/app/error-reporter.js"),
  repoPath("src/adapters/chrome/storage.js"),
  repoPath("src/adapters/dom/text-node-cache.js"),
  repoPath("src/adapters/dom/text-node-eligibility.js"),
  repoPath("src/adapters/dom/text-node-walker.js"),
  repoPath("src/adapters/dom/scan-scheduler.js"),
  repoPath("src/adapters/dom/mutation-observer.js"),
];

const popupModules = [
  ...sharedModules,
  repoPath("src/app/settings-service.js"),
  repoPath("src/app/error-reporter.js"),
  repoPath("src/adapters/chrome/storage.js"),
  repoPath("src/adapters/chrome/messaging.js"),
  repoPath("src/ui/popup/popup-view.js"),
  repoPath("src/ui/popup/popup-state.js"),
];

module.exports = {
  sharedModules,
  translatorModules,
  contentModules,
  popupModules,
};
