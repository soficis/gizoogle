(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const app = gizoogle.app || (gizoogle.app = {});

  const validation = gizoogle.shared && gizoogle.shared.validation;

  if (!validation) {
    throw new Error("src/shared/validation.js must be loaded before src/app/translate-page-usecase.js");
  }

  function createTranslatePageUseCase(dependencies) {
    const {
      translatorApi,
      cache,
      eligibility,
      walker
    } = dependencies || {};

    if (!translatorApi || !cache || !eligibility || !walker) {
      throw new Error("createTranslatePageUseCase requires translatorApi, cache, eligibility, and walker");
    }

    function hasOriginal(node) {
      return typeof cache.getOriginal(node) === "string";
    }

    function captureOriginal(node) {
      if (!hasOriginal(node)) {
        cache.setOriginal(node, node.nodeValue);
        return;
      }

      const originalValue = cache.getOriginal(node);
      const translatedValue = cache.getTranslated(node);
      const currentValue = node.nodeValue;

      const externalMutation =
        typeof translatedValue === "string" &&
        currentValue !== translatedValue &&
        currentValue !== originalValue;

      if (externalMutation) {
        cache.setOriginal(node, currentValue);
      }
    }

    function shouldSkipTranslation(node, level) {
      const translatedValue = cache.getTranslated(node);
      const translatedLevel = cache.getLevel(node);

      return (
        typeof translatedValue === "string" &&
        node.nodeValue === translatedValue &&
        translatedLevel === level
      );
    }

    function translateNode(node, settings) {
      const level = validation.clampLevel(settings.level);

      if (!eligibility.isEligibleTextNode(node)) {
        return;
      }

      if (shouldSkipTranslation(node, level)) {
        return;
      }

      captureOriginal(node);

      const originalText = cache.getOriginal(node);
      const translatedText = translatorApi.translateText(originalText, { level });

      cache.setTranslated(node, translatedText);
      cache.setLevel(node, level);
      node.nodeValue = translatedText;
    }

    function restoreNode(node) {
      if (!eligibility.isTextNode(node)) {
        return;
      }

      const originalText = cache.getOriginal(node);

      if (typeof originalText !== "string") {
        return;
      }

      node.nodeValue = originalText;
      cache.clear(node);
    }

    function processNode(node, settings) {
      if (settings.enabled) {
        translateNode(node, settings);
      } else {
        restoreNode(node);
      }
    }

    function processRoot(rootNode, settings) {
      if (!rootNode) {
        return;
      }

      if (eligibility.isTextNode(rootNode)) {
        processNode(rootNode, settings);
        return;
      }

      if (!walker.isElementOrDocumentFragment(rootNode)) {
        return;
      }

      const textNodes = walker.collectTextNodes(rootNode);

      for (const node of textNodes) {
        processNode(node, settings);
      }
    }

    return Object.freeze({
      processRoot,
      processNode,
      translateNode,
      restoreNode
    });
  }

  app.translatePageUseCase = Object.freeze({
    createTranslatePageUseCase
  });

  if (typeof module === "object" && module.exports) {
    module.exports = app.translatePageUseCase;
  }
})();
