const assert = require("node:assert/strict");
const test = require("node:test");

const { loadBrowserModules } = require("../support/load-browser-modules");
const { translatorModules } = require("../support/module-paths");

function loadContext() {
  return loadBrowserModules([
    ...translatorModules,
    require("node:path").resolve(__dirname, "../../src/app/translate-page-usecase.js"),
    require("node:path").resolve(__dirname, "../../src/adapters/dom/text-node-cache.js")
  ]);
}

function createTextNode(value) {
  return {
    nodeType: 3,
    nodeValue: value,
    parentElement: {
      tagName: "DIV",
      isContentEditable: false,
      closest() {
        return null;
      }
    }
  };
}

test("translate page use case translates and restores with new translator pipeline", () => {
  const context = loadContext();
  const useCaseFactory = context.Gizoogle.app.translatePageUseCase;
  const cacheFactory = context.Gizoogle.adapters.dom.textNodeCache;
  const translatorApi = context.GizoogleTranslator;

  const cache = cacheFactory.createTextNodeCache();
  const textNode = createTextNode("I am definitively stating that this is the way.");

  const eligibility = {
    isTextNode(node) {
      return node && node.nodeType === 3;
    },
    isEligibleTextNode(node) {
      return this.isTextNode(node) && typeof node.nodeValue === "string" && node.nodeValue.trim().length > 0;
    }
  };

  const walker = {
    isElementOrDocumentFragment(node) {
      return node && node.nodeType === 1;
    },
    collectTextNodes() {
      return [textNode];
    }
  };

  const useCase = useCaseFactory.createTranslatePageUseCase({
    translatorApi,
    cache,
    eligibility,
    walker
  });

  useCase.processRoot({ nodeType: 1 }, { enabled: true, level: 3 });
  assert.equal(textNode.nodeValue, "I am definitively statin' dat dis is da way. fo' shizzle.");

  useCase.processRoot({ nodeType: 1 }, { enabled: false, level: 3 });
  assert.equal(textNode.nodeValue, "I am definitively stating that this is the way.");
  assert.equal(cache.getTranslated(textNode), undefined);
});
