(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const domain = gizoogle.domain || (gizoogle.domain = {});
  const translator = domain.translator || (domain.translator = {});

  const lexiconData = translator.snoopLexiconData;

  if (!lexiconData) {
    throw new Error(
      "src/domain/translator/snoop-lexicon-data.js must be loaded before src/domain/translator/snoop-lexicon.js"
    );
  }

  const snoopLexicon = Object.freeze({
    ...lexiconData
  });

  translator.snoopLexicon = snoopLexicon;

  if (typeof module === "object" && module.exports) {
    module.exports = snoopLexicon;
  }
})();
