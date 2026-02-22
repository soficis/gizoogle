(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const domain = gizoogle.domain || (gizoogle.domain = {});
  const translator = domain.translator || (domain.translator = {});

  const lexicon = translator.snoopLexicon;
  const helpers = translator.helpers;
  const shared = translator.replacementsShared;

  if (!lexicon)
    throw new Error(
      "src/domain/translator/snoop-lexicon.js must be loaded before replacements-aave.js",
    );
  if (!helpers)
    throw new Error(
      "src/domain/translator/helpers.js must be loaded before replacements-aave.js",
    );
  if (!shared)
    throw new Error(
      "src/domain/translator/replacements-shared.js must be loaded before replacements-aave.js",
    );

  const MODAL_PATTERN = /\b(will|would|could|should|might|can|shall|may)\b/i;
  const PRESERVED_TOKEN_PATTERN = /\u0000GZ\d+\u0000/;
  const QUOTED_TEXT_PATTERN = /["“”]/;

  function applyZeroCopula(sentence) {
    let output = sentence;

    for (const rule of lexicon.aaveRules.zeroCopula) {
      output = output.replace(
        rule.pattern,
        (_match, ...argumentsAfterMatch) => {
          const groups = argumentsAfterMatch.slice(0, -2);
          return shared.resolveBackReferences(rule.replacement, groups);
        },
      );
    }

    return output;
  }

  function buildThirdPersonPattern(verbMap) {
    const verbAlternation = Object.keys(verbMap)
      .map((verb) => shared.escapeRegex(verb))
      .join("|");

    return new RegExp(`\\b(he|she|it)\\s+(${verbAlternation})\\b`, "gi");
  }

  function applyThirdPersonOmission(sentence) {
    const verbMap = lexicon.aaveRules.thirdPersonSingular.verbMap;
    const thirdPersonPattern = buildThirdPersonPattern(verbMap);

    return sentence.replace(
      thirdPersonPattern,
      (_match, subject, inflectedVerb) => {
        const baseVerb = verbMap[inflectedVerb.toLowerCase()] || inflectedVerb;
        return `${subject} ${helpers.preserveCase(inflectedVerb, baseVerb)}`;
      },
    );
  }

  function shouldSkipSentence(sentence) {
    if (!sentence || !sentence.trim()) {
      return true;
    }

    return (
      MODAL_PATTERN.test(sentence) ||
      PRESERVED_TOKEN_PATTERN.test(sentence) ||
      QUOTED_TEXT_PATTERN.test(sentence)
    );
  }

  function applyAAVERestructuring(input, level) {
    if (level < 3) {
      return input;
    }

    return shared
      .splitIntoSentences(input)
      .map((sentence) => {
        const match = sentence.match(/^([\s\S]*?)(\s*)$/);
        const textPart = match ? match[1] : sentence;
        const trailingSpace = match ? match[2] : "";

        if (
          shouldSkipSentence(textPart) ||
          helpers.simpleHash(textPart, 67) % 2 !== 0
        ) {
          return sentence;
        }

        const withoutCopula = applyZeroCopula(textPart);
        const withoutThirdPersonS = applyThirdPersonOmission(withoutCopula);

        return `${withoutThirdPersonS}${trailingSpace}`;
      })
      .join("");
  }

  const replacementsAave = Object.freeze({
    applyAAVERestructuring,
  });

  translator.replacementsAave = replacementsAave;

  if (typeof module === "object" && module.exports) {
    module.exports = replacementsAave;
  }
})();
