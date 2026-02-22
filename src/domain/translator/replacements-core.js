(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const domain = gizoogle.domain || (gizoogle.domain = {});
  const translator = domain.translator || (domain.translator = {});

  const constants = translator.constants;
  const lexicon = translator.snoopLexicon;
  const helpers = translator.helpers;
  const shared = translator.replacementsShared;

  if (!constants) {
    throw new Error(
      "src/domain/translator/constants.js must be loaded before replacements-core.js",
    );
  }

  if (!lexicon) {
    throw new Error(
      "src/domain/translator/snoop-lexicon.js must be loaded before replacements-core.js",
    );
  }

  if (!helpers) {
    throw new Error(
      "src/domain/translator/helpers.js must be loaded before replacements-core.js",
    );
  }

  if (!shared) {
    throw new Error(
      "src/domain/translator/replacements-shared.js must be loaded before replacements-core.js",
    );
  }

  function applyCountryReplacements(input) {
    return shared.applyReplacementRules(input, lexicon.countryReplacements);
  }

  function applyPhonologicalRules(input, level) {
    let output = input;

    for (const rule of lexicon.phonologicalRules) {
      if (level < rule.minLevel) {
        continue;
      }

      output = output.replace(rule.pattern, (match, ...argumentsAfterMatch) => {
        const groups = argumentsAfterMatch.slice(0, -2);

        if (shared.matchesAnyPattern(match.toLowerCase(), rule.exceptions)) {
          return match;
        }

        if (rule.name === "drop_er" && /^[A-Z][a-z]+$/.test(match)) {
          return match;
        }

        const replacementText = shared.resolveBackReferences(
          rule.replacement,
          groups,
        );
        return helpers.preserveCase(match, replacementText);
      });
    }

    return output;
  }

  function applyCoreSubstitutions(input) {
    return shared.applyReplacementRules(
      input,
      lexicon.lexicalSubstitutions.level1,
    );
  }

  function toIzzleWord(word) {
    const normalized = word.toLowerCase();

    if (normalized.includes("izzle")) {
      return normalized;
    }

    const compactWord = normalized.replace(/[^a-z']/g, "");
    const source = compactWord.endsWith("e")
      ? compactWord.slice(0, -1)
      : compactWord;
    const firstVowelIndex = source.search(/[aeiouy]/);

    if (firstVowelIndex <= 0) {
      return `${source.slice(0, 2)}izzle`;
    }

    return `${source.slice(0, firstVowelIndex)}izzle`;
  }

  function applyDynamicIzzleSentence(sentence, level) {
    const transformCap = level >= 3 ? 2 : 1;
    let transformCount = 0;

    return sentence.replace(lexicon.izzleQualifyingPatterns, (match) => {
      const normalizedMatch = match.toLowerCase();

      if (transformCount >= transformCap || normalizedMatch.includes("izzle")) {
        return match;
      }

      transformCount += 1;
      return helpers.preserveCase(match, toIzzleWord(match));
    });
  }

  function applyIzzleMorphology(input, level) {
    if (level < 2) {
      return input;
    }

    let output = shared.applyReplacementRules(
      input,
      lexicon.izzleFixedFormsLevel2,
    );

    if (level >= 3) {
      output = shared.applyReplacementRules(
        output,
        lexicon.izzleFixedFormsLevel3,
      );
      output = shared
        .splitIntoSentences(output)
        .map((sentence) => applyDynamicIzzleSentence(sentence, level))
        .join("");
    }

    return output;
  }

  function applyLevelSubstitutions(input, level) {
    if (level < 2) {
      return input;
    }

    let output = shared.applyReplacementRules(
      input,
      lexicon.lexicalSubstitutions.level2,
    );

    if (level >= 3) {
      output = shared.applyReplacementRules(
        output,
        lexicon.lexicalSubstitutions.level3,
      );
    }

    return output;
  }

  const replacementsCore = Object.freeze({
    applyCountryReplacements,
    applyPhonologicalRules,
    applyCoreSubstitutions,
    applyIzzleMorphology,
    applyLevelSubstitutions,
  });

  translator.replacementsCore = replacementsCore;

  if (typeof module === "object" && module.exports) {
    module.exports = replacementsCore;
  }
})();
