(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const domain = gizoogle.domain || (gizoogle.domain = {});
  const translator = domain.translator || (domain.translator = {});

  const helpers = translator.helpers;

  if (!helpers) {
    throw new Error("src/domain/translator/helpers.js must be loaded before replacements-shared.js");
  }

  function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function normalizePhrase(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function splitIntoSentences(input) {
    const matches = String(input || "").match(/[^.!?]+[.!?]?\s*/g);
    return matches || [input];
  }

  function matchesAnyPattern(value, patterns) {
    for (const pattern of patterns || []) {
      pattern.lastIndex = 0;

      if (pattern.test(value)) {
        return true;
      }
    }

    return false;
  }

  function applyReplacementRules(input, replacementRules) {
    let output = input;

    for (const replacementRule of replacementRules) {
      output = helpers.replaceWithCase(output, replacementRule.pattern, replacementRule.replacement);
    }

    return output;
  }

  function resolveBackReferences(template, groups) {
    return template.replace(/\$(\d+)/g, (_match, groupIndex) => groups[Number(groupIndex) - 1] || "");
  }

  function endsWithCloser(sentence, closers) {
    for (const closer of closers) {
      if (new RegExp(`${escapeRegex(closer)}\\s*$`, "i").test(sentence.trim())) {
        return true;
      }
    }

    return false;
  }

  function containsCloser(text, closers) {
    const normalizedText = normalizePhrase(text);

    for (const closer of closers) {
      if (normalizedText.includes(normalizePhrase(closer))) {
        return true;
      }
    }

    return false;
  }

  const replacementsShared = Object.freeze({
    escapeRegex,
    normalizePhrase,
    splitIntoSentences,
    matchesAnyPattern,
    applyReplacementRules,
    resolveBackReferences,
    endsWithCloser,
    containsCloser
  });

  translator.replacementsShared = replacementsShared;

  if (typeof module === "object" && module.exports) {
    module.exports = replacementsShared;
  }
})();
