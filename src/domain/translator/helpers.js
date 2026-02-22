(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const domain = gizoogle.domain || (gizoogle.domain = {});
  const translator = domain.translator || (domain.translator = {});

  function startsWithUppercase(value) {
    const firstCharacter = value.charAt(0);

    if (!firstCharacter) {
      return false;
    }

    return (
      firstCharacter.toUpperCase() === firstCharacter &&
      firstCharacter.toLowerCase() !== firstCharacter
    );
  }

  function isAllUppercase(value) {
    return /[A-Z]/.test(value) && value.toUpperCase() === value;
  }

  function preserveCase(original, replacement) {
    if (!replacement) {
      return replacement;
    }

    if (isAllUppercase(original)) {
      return replacement.toUpperCase();
    }

    if (startsWithUppercase(original)) {
      return replacement.charAt(0).toUpperCase() + replacement.slice(1);
    }

    return replacement;
  }

  function replaceWithCase(input, pattern, replacement) {
    return input.replace(pattern, (match, ...argumentsAfterMatch) => {
      const computedReplacement =
        typeof replacement === "function"
          ? replacement(match, ...argumentsAfterMatch)
          : replacement;

      return preserveCase(match, computedReplacement);
    });
  }

  function hasTerminalPunctuation(value) {
    return /[.!?]\s*$/.test(value);
  }

  function ensureTerminalPeriod(value) {
    if (hasTerminalPunctuation(value)) {
      return value;
    }

    return `${value}.`;
  }

  function simpleHash(input, seed = 0) {
    const text = String(input || "");
    let hash = (seed + 5381) >>> 0;

    for (let index = 0; index < text.length; index += 1) {
      hash = ((hash << 5) + hash + text.charCodeAt(index)) >>> 0;
    }

    return hash >>> 0;
  }

  function elongateEmphasis(word) {
    return word.replace(/([aeiouy]+)([^aeiouy]*)$/i, (match, vowelCluster, tail) => {
      const extension = vowelCluster.charAt(vowelCluster.length - 1).repeat(2);
      return `${vowelCluster}${extension}${tail}`;
    });
  }

  function isSignificantText(text) {
    if (!text || typeof text !== "string") {
      return false;
    }

    const trimmed = text.trim();
    if (trimmed.length < 15) {
      return false;
    }

    const words = trimmed.match(/[A-Za-z]+/g);
    if (!words || words.length < 3) {
      return false;
    }

    if (!startsWithUppercase(trimmed)) {
      return false;
    }

    return true;
  }

  const helpers = Object.freeze({
    preserveCase,
    replaceWithCase,
    hasTerminalPunctuation,
    ensureTerminalPeriod,
    simpleHash,
    elongateEmphasis,
    isSignificantText
  });

  translator.helpers = helpers;

  if (typeof module === "object" && module.exports) {
    module.exports = helpers;
  }
})();
