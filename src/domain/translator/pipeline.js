(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const domain = gizoogle.domain || (gizoogle.domain = {});
  const translator = domain.translator || (domain.translator = {});

  const modeDetection = translator.modeDetection;
  const preserve = translator.preserve;
  const replacements = translator.replacements;

  if (!modeDetection) {
    throw new Error(
      "src/domain/translator/mode-detection.js must be loaded before pipeline.js",
    );
  }

  if (!preserve) {
    throw new Error(
      "src/domain/translator/preserve.js must be loaded before pipeline.js",
    );
  }

  if (!replacements) {
    throw new Error(
      "src/domain/translator/replacements.js must be loaded before pipeline.js",
    );
  }

  function splitByNewlineTokens(input) {
    return input.split(/(\r?\n+)/);
  }

  function processChunk(chunk, level) {
    if (
      !chunk ||
      chunk.startsWith("\n") ||
      chunk.startsWith("\r") ||
      !chunk.trim()
    ) {
      return chunk;
    }

    const mode = modeDetection.detectMode(chunk);

    let output = chunk;
    output = replacements.applyPhonologicalRules(output, level);
    output = replacements.applyAAVERestructuring(output, level);
    output = replacements.applyCoreSubstitutions(output);
    output = replacements.applyIzzleMorphology(output, level);
    output = replacements.applyLevelSubstitutions(output, level);
    output = replacements.applyCarCultureVocabulary(output, level);
    output = replacements.applyTerminalSOrthography(output, level);
    output = replacements.applyGeographicFlavor(output, level);
    output = replacements.applyDiscourseMarkers(output, mode, level);
    output = replacements.applyModePrefix(output, mode, level);
    output = replacements.applyMelodicChant(output, level);
    output = replacements.applyCadenceTransforms(output, level);
    output = replacements.applySignatureTag(output, level);
    output = replacements.applyQuoteInjection(output, level);

    return output;
  }

  function translateText(input, level) {
    if (!input || !input.trim()) {
      return input;
    }

    let output = String(input);
    output = replacements.applyCountryReplacements(output);

    const masked = preserve.maskPreservedContent(output);
    const chunks = splitByNewlineTokens(masked.maskedText);
    const processedChunks = chunks.map((chunk) => processChunk(chunk, level));
    const joinedOutput = processedChunks.join("");

    return preserve.unmaskPreservedContent(
      joinedOutput,
      masked.preservedValues,
    );
  }

  const pipeline = Object.freeze({
    translateText,
  });

  translator.pipeline = pipeline;

  if (typeof module === "object" && module.exports) {
    module.exports = pipeline;
  }
})();
