(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const domain = gizoogle.domain || (gizoogle.domain = {});
  const translator = domain.translator || (domain.translator = {});

  const constants = translator.constants;

  if (!constants) {
    throw new Error("src/domain/translator/constants.js must be loaded before mode-detection.js");
  }

  function isQuestion(text) {
    const trimmedText = String(text || "").trim().toLowerCase();

    if (!trimmedText) {
      return false;
    }

    if (/\?\s*$/.test(trimmedText)) {
      return true;
    }

    return /^(?:how|what|when|where|why|who|which|can|could|should|do|does|did|is|are|will|would)\b/.test(
      trimmedText
    );
  }

  function detectMode(text) {
    const normalizedText = String(text || "").toLowerCase();

    if (
      /\b(warning|error|failed|failure|problem|issue|cannot|timed out|timeout|lost|blocked)\b/.test(
        normalizedText
      )
    ) {
      return constants.MODES.WARNING;
    }

    if (
      /\b(success|successful|complete|completed|done|saved|approved|confirmed|passed)\b/.test(
        normalizedText
      )
    ) {
      return constants.MODES.SUCCESS;
    }

    if (isQuestion(normalizedText)) {
      return constants.MODES.QUESTION;
    }

    return constants.MODES.NEUTRAL;
  }

  const modeDetection = Object.freeze({
    detectMode,
    isQuestion
  });

  translator.modeDetection = modeDetection;

  if (typeof module === "object" && module.exports) {
    module.exports = modeDetection;
  }
})();
