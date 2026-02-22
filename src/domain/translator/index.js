(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const domain = gizoogle.domain || (gizoogle.domain = {});
  const translatorNamespace = domain.translator || (domain.translator = {});

  const contracts = gizoogle.shared && gizoogle.shared.contracts;
  const validation = gizoogle.shared && gizoogle.shared.validation;
  const pipeline = translatorNamespace.pipeline;

  if (!contracts) {
    throw new Error("src/shared/contracts.js must be loaded before src/domain/translator/index.js");
  }

  if (!validation) {
    throw new Error("src/shared/validation.js must be loaded before src/domain/translator/index.js");
  }

  if (!pipeline) {
    throw new Error("src/domain/translator/pipeline.js must be loaded before src/domain/translator/index.js");
  }

  let currentLevel = contracts.LEVEL_RANGE.DEFAULT;

  function setLevel(level) {
    currentLevel = validation.clampLevel(level);
    return currentLevel;
  }

  function translateText(input, options = {}) {
    const hasProvidedLevel = options && Object.prototype.hasOwnProperty.call(options, "level");
    const level = hasProvidedLevel ? validation.clampLevel(options.level) : currentLevel;

    return pipeline.translateText(input, level);
  }

  function getLevel() {
    return currentLevel;
  }

  const api = Object.freeze({
    setLevel,
    getLevel,
    translateText
  });

  translatorNamespace.api = api;
  root.GizoogleTranslator = api;

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
})();
