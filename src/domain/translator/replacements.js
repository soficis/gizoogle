(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const domain = gizoogle.domain || (gizoogle.domain = {});
  const translator = domain.translator || (domain.translator = {});

  const replacementsCore = translator.replacementsCore;
  const replacementsAave = translator.replacementsAave;
  const replacementsStyle = translator.replacementsStyle;
  const replacementsFlavor = translator.replacementsFlavor;

  if (!replacementsCore) {
    throw new Error(
      "src/domain/translator/replacements-core.js must be loaded before replacements.js",
    );
  }

  if (!replacementsAave) {
    throw new Error(
      "src/domain/translator/replacements-aave.js must be loaded before replacements.js",
    );
  }

  if (!replacementsStyle) {
    throw new Error(
      "src/domain/translator/replacements-style.js must be loaded before replacements.js",
    );
  }

  if (!replacementsFlavor) {
    throw new Error(
      "src/domain/translator/replacements-flavor.js must be loaded before replacements.js",
    );
  }

  const replacements = Object.freeze({
    ...replacementsCore,
    ...replacementsAave,
    ...replacementsStyle,
    ...replacementsFlavor,
  });

  translator.replacements = replacements;

  if (typeof module === "object" && module.exports) {
    module.exports = replacements;
  }
})();
