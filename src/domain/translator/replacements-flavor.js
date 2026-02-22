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
      "src/domain/translator/snoop-lexicon.js must be loaded before replacements-flavor.js",
    );
  if (!helpers)
    throw new Error(
      "src/domain/translator/helpers.js must be loaded before replacements-flavor.js",
    );
  if (!shared)
    throw new Error(
      "src/domain/translator/replacements-shared.js must be loaded before replacements-flavor.js",
    );

  function shouldApplySignature(sentence, level, sentenceIndex) {
    const threshold = level >= 3 ? 3 : 1;
    return (
      helpers.simpleHash(`${sentenceIndex}:${sentence}`, 257) % 10 < threshold
    );
  }

  function applySignatureTag(input, level) {
    if (
      level < 2 ||
      !helpers.isSignificantText(input) ||
      shared.containsCloser(input, lexicon.discourseMarkers.closers)
    ) {
      return input;
    }

    return shared
      .splitIntoSentences(input)
      .map((sentence, sentenceIndex) => {
        const match = sentence.match(/^([\s\S]*?)(\s*)$/);
        const textPart = match ? match[1] : sentence;
        const trailingSpace = match ? match[2] : "";
        const trimmedSentence = textPart.trim();

        if (!trimmedSentence || /\?\s*$/.test(trimmedSentence)) return sentence;
        if (
          shared.endsWithCloser(
            trimmedSentence,
            lexicon.discourseMarkers.closers,
          )
        )
          return sentence;
        if (!helpers.hasTerminalPunctuation(trimmedSentence)) return sentence;
        if (!shouldApplySignature(trimmedSentence, level, sentenceIndex))
          return sentence;

        const closerIndex =
          helpers.simpleHash(trimmedSentence, 283) %
          lexicon.discourseMarkers.closers.length;
        return `${helpers.ensureTerminalPeriod(textPart)} ${lexicon.discourseMarkers.closers[closerIndex]}${trailingSpace}`;
      })
      .join("");
  }

  function includesGeoReference(input) {
    return lexicon.geographicInjection.references.some((reference) => {
      const pattern = new RegExp(`\\b${shared.escapeRegex(reference)}\\b`, "i");
      return pattern.test(input);
    });
  }

  function injectGeoTemplate(template, reference) {
    return template.replace(/\{\{reference\}\}/g, reference);
  }

  function applyCarCultureVocabulary(input, level) {
    if (level < 2) {
      return input;
    }

    let output = shared.applyReplacementRules(input, lexicon.carCulture.level2);

    if (level >= 3) {
      output = shared.applyReplacementRules(output, lexicon.carCulture.level3);
    }

    return output;
  }

  function applyTerminalSOrthography(input, level) {
    if (level < 2) {
      return input;
    }

    return input.replace(/\b([a-z]{2,}[bdgjlmnrvz])s\b/gi, (match, stem) =>
      helpers.preserveCase(match, `${stem}z`),
    );
  }

  function applyGeographicFlavor(input, level) {
    if (
      level < 2 ||
      !lexicon.geographicInjection.triggerKeywords.test(input) ||
      includesGeoReference(input)
    ) {
      return input;
    }

    const hash = helpers.simpleHash(input, 97);
    const divisor = level >= 3 ? 3 : 5;
    if (hash % divisor !== 0) return input;

    const reference =
      lexicon.geographicInjection.references[
        hash % lexicon.geographicInjection.references.length
      ];
    if (hash % 2 !== 0) {
      const prefix = injectGeoTemplate(
        lexicon.geographicInjection.prefixTemplates[
          hash % lexicon.geographicInjection.prefixTemplates.length
        ],
        reference,
      );
      return `${prefix} ${input}`;
    }

    const suffix = injectGeoTemplate(
      lexicon.geographicInjection.suffixTemplates[
        hash % lexicon.geographicInjection.suffixTemplates.length
      ],
      reference,
    );
    const match = input.match(/^([\s\S]*?)(\s*)$/);
    const textPart = match ? match[1] : input;
    const trailingSpace = match ? match[2] : "";
    return `${textPart}${suffix}${trailingSpace}`;
  }

  function findQuoteCategory(input) {
    for (const category of Object.values(lexicon.quoteBank)) {
      if (category.keywords.test(input)) {
        return category;
      }
    }

    return null;
  }

  function applyQuoteInjection(input, level) {
    if (
      level < 3 ||
      helpers.simpleHash(input, 41) % 7 !== 0 ||
      shared.containsCloser(input, lexicon.discourseMarkers.closers)
    ) {
      return input;
    }

    const category = findQuoteCategory(input);
    if (!category) {
      return input;
    }

    const quote =
      category.quotes[helpers.simpleHash(input, 149) % category.quotes.length];
    if (input.includes(quote)) {
      return input;
    }

    const match = input.match(/^([\s\S]*?)(\s*)$/);
    const textPart = match ? match[1] : input;
    const trailingSpace = match ? match[2] : "";
    const normalizedText = textPart.trimEnd();
    const withTerminal = helpers.hasTerminalPunctuation(normalizedText)
      ? normalizedText
      : helpers.ensureTerminalPeriod(normalizedText);

    return `${withTerminal} ${quote}${trailingSpace}`;
  }

  const replacementsFlavor = Object.freeze({
    applyCarCultureVocabulary,
    applyTerminalSOrthography,
    applyGeographicFlavor,
    applySignatureTag,
    applyQuoteInjection,
  });

  translator.replacementsFlavor = replacementsFlavor;

  if (typeof module === "object" && module.exports) {
    module.exports = replacementsFlavor;
  }
})();
