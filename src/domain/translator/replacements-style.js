(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const domain = gizoogle.domain || (gizoogle.domain = {});
  const translator = domain.translator || (domain.translator = {});
  const constants = translator.constants;
  const lexicon = translator.snoopLexicon;
  const helpers = translator.helpers;
  const shared = translator.replacementsShared;

  if (!constants)
    throw new Error(
      "src/domain/translator/constants.js must be loaded before replacements-style.js",
    );
  if (!lexicon)
    throw new Error(
      "src/domain/translator/snoop-lexicon.js must be loaded before replacements-style.js",
    );
  if (!helpers)
    throw new Error(
      "src/domain/translator/helpers.js must be loaded before replacements-style.js",
    );
  if (!shared)
    throw new Error(
      "src/domain/translator/replacements-shared.js must be loaded before replacements-style.js",
    );

  function applyDiscourseMarkers(input, _mode, level) {
    if (level < 2 || !helpers.isSignificantText(input)) return input;
    let output = shared.applyReplacementRules(
      input,
      lexicon.discourseMarkers.fillers,
    );
    if (
      level < 3 ||
      !/\bI\b/.test(output) ||
      helpers.simpleHash(output, 71) % 4 !== 0
    )
      return output;
    const title =
      lexicon.thirdPersonTitles[
        helpers.simpleHash(output, 89) % lexicon.thirdPersonTitles.length
      ];
    return output.replace(/\bI\b/, title);
  }

  function getAllowedModeOpeners(mode, level) {
    if (level < 2) return [];
    if (
      level === 2 &&
      mode !== constants.MODES.WARNING &&
      mode !== constants.MODES.SUCCESS
    )
      return [];
    return lexicon.discourseMarkers.openers[mode] || [];
  }

  function hasExistingOpener(input, openers) {
    const normalizedInput = shared.normalizePhrase(input);
    return openers.some((opener) =>
      normalizedInput.startsWith(shared.normalizePhrase(opener)),
    );
  }

  function applyModePrefix(input, mode, level) {
    if (!helpers.isSignificantText(input)) return input;
    const openers = getAllowedModeOpeners(mode, level);
    if (openers.length === 0) return input;

    const match = input.match(/^(\s*)([\s\S]*?)(\s*)$/);
    const leadingSpace = match ? match[1] : "";
    const coreText = match ? match[2] : input;
    const trailingSpace = match ? match[3] : "";

    if (!coreText || hasExistingOpener(coreText, openers)) return input;
    if (
      mode === constants.MODES.NEUTRAL &&
      helpers.simpleHash(coreText, 51) % 10 >= 2
    )
      return input;

    const opener = openers[helpers.simpleHash(coreText, 131) % openers.length];
    return `${leadingSpace}${opener} ${coreText}${trailingSpace}`;
  }

  function hasExistingMelodicChant(input) {
    const normalizedInput = shared.normalizePhrase(input);
    return lexicon.melodicChant.phrases.some((phrase) =>
      normalizedInput.startsWith(shared.normalizePhrase(phrase)),
    );
  }

  function applyMelodicChant(input, level) {
    if (
      level < 3 ||
      !lexicon.melodicChant.triggerKeywords.test(input) ||
      hasExistingMelodicChant(input) ||
      helpers.simpleHash(input, 173) % 6 !== 0
    ) {
      return input;
    }

    const match = input.match(/^(\s*)([\s\S]*?)(\s*)$/);
    const leadingSpace = match ? match[1] : "";
    const coreText = match ? match[2] : input;
    const trailingSpace = match ? match[3] : "";
    const phrase =
      lexicon.melodicChant.phrases[
        helpers.simpleHash(coreText, 181) % lexicon.melodicChant.phrases.length
      ];

    return `${leadingSpace}${phrase} ${coreText}${trailingSpace}`;
  }

  function ensureDiscourseComma(input) {
    let output = input;

    for (const marker of lexicon.cadence.commaLeadIns) {
      const pattern = new RegExp(
        `^(\\s*${shared.escapeRegex(marker)})(?!\\s*[,!?:-])\\b`,
        "i",
      );
      if (!pattern.test(output)) continue;
      output = output.replace(pattern, "$1,");
      break;
    }

    return output;
  }

  function applyEmDashFragmentation(input, level) {
    if (level < 3 || input.length < 40) return input;
    const conjunctionPattern = /\b(and|but|so|or)\b|an'/gi;
    const conjunctions = input.match(conjunctionPattern);
    if (
      !conjunctions ||
      conjunctions.length < 2 ||
      helpers.simpleHash(input, 113) % 3 !== 0
    )
      return input;
    let conjunctionCount = 0;
    return input.replace(conjunctionPattern, (match) => {
      conjunctionCount += 1;
      return conjunctionCount === 2 ? "—" : match;
    });
  }

  function applyEmphasisElongation(sentence) {
    const terms = lexicon.cadence.emphasisWords
      .map(shared.escapeRegex)
      .join("|");
    const emphasisPattern = new RegExp(`\\b(${terms})\\b`, "i");
    let elongated = false;

    return sentence.replace(emphasisPattern, (match) => {
      if (elongated || match.includes("ooo")) return match;
      elongated = true;
      return helpers.preserveCase(
        match,
        helpers.elongateEmphasis(match.toLowerCase()),
      );
    });
  }

  function appendAddress(sentence, sentenceIndex) {
    const hash = helpers.simpleHash(`${sentenceIndex}:${sentence}`, 193);
    if (hash % 10 !== 0) return sentence;
    const selectedAddress =
      lexicon.addressTerms[hash % lexicon.addressTerms.length];
    const trimmedSentence = sentence.trimEnd();
    if (
      shared.endsWithCloser(trimmedSentence, lexicon.discourseMarkers.closers)
    )
      return sentence;
    if (!helpers.hasTerminalPunctuation(trimmedSentence)) return sentence;
    if (
      new RegExp(`\\b${shared.escapeRegex(selectedAddress)}[.!?]?$`, "i").test(
        trimmedSentence,
      )
    )
      return sentence;
    if (/[.!?]$/.test(trimmedSentence))
      return trimmedSentence.replace(/([.!?])$/, `, ${selectedAddress}$1`);
    return `${trimmedSentence}, ${selectedAddress}`;
  }

  function applyCadenceTransforms(input, level) {
    if (level < 2 || !helpers.isSignificantText(input)) return input;
    const withComma = ensureDiscourseComma(input);

    if (level < 3) {
      return withComma;
    }

    return shared
      .splitIntoSentences(withComma)
      .map((sentence, index) => {
        const match = sentence.match(/^([\s\S]*?)(\s*)$/);
        const textPart = match ? match[1] : sentence;
        const trailingSpace = match ? match[2] : "";
        const fragmented = applyEmDashFragmentation(textPart, level);
        return (
          appendAddress(applyEmphasisElongation(fragmented), index) +
          trailingSpace
        );
      })
      .join("");
  }

  const replacementsStyle = Object.freeze({
    applyDiscourseMarkers,
    applyModePrefix,
    applyMelodicChant,
    applyCadenceTransforms,
    applyEmDashFragmentation,
  });

  translator.replacementsStyle = replacementsStyle;
  if (typeof module === "object" && module.exports)
    module.exports = replacementsStyle;
})();
