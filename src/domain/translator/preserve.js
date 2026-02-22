(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const domain = gizoogle.domain || (gizoogle.domain = {});
  const translator = domain.translator || (domain.translator = {});

  const constants = translator.constants;

  if (!constants) {
    throw new Error("src/domain/translator/constants.js must be loaded before preserve.js");
  }

  function maskPreservedContent(input) {
    const preservedValues = [];
    let maskedText = input;

    for (const pattern of constants.PRESERVE_PATTERNS) {
      maskedText = maskedText.replace(pattern, (match) => {
        const tokenIndex = preservedValues.length;
        preservedValues.push(match);
        return `\u0000GZ${tokenIndex}\u0000`;
      });
    }

    return {
      maskedText,
      preservedValues
    };
  }

  function unmaskPreservedContent(input, preservedValues) {
    if (!preservedValues || preservedValues.length === 0) {
      return input;
    }

    return input.replace(/\u0000GZ(\d+)\u0000/g, (_match, tokenIndex) => {
      const index = Number(tokenIndex);
      const replacement = preservedValues[index];
      return replacement === undefined ? "" : replacement;
    });
  }

  const preserve = Object.freeze({
    maskPreservedContent,
    unmaskPreservedContent
  });

  translator.preserve = preserve;

  if (typeof module === "object" && module.exports) {
    module.exports = preserve;
  }
})();
