(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const domain = gizoogle.domain || (gizoogle.domain = {});
  const translator = domain.translator || (domain.translator = {});

  const constants = Object.freeze({
    PRESERVE_PATTERNS: Object.freeze([
      /\bhttps?:\/\/[^\s<>"')\]]+/gi,
      /\bwww\.[^\s<>"')\]]+/gi,
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g
    ]),
    LEVEL_RANGE: Object.freeze({
      MIN: 1,
      MAX: 3,
      DEFAULT: 2
    }),
    MODES: Object.freeze({
      WARNING: "warning",
      SUCCESS: "success",
      QUESTION: "question",
      NEUTRAL: "neutral"
    })
  });

  translator.constants = constants;

  if (typeof module === "object" && module.exports) {
    module.exports = constants;
  }
})();
