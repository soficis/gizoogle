(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const shared = gizoogle.shared || (gizoogle.shared = {});

  const contracts = shared.contracts;

  if (!contracts) {
    throw new Error("src/shared/contracts.js must be loaded before src/shared/validation.js");
  }

  function clampLevel(value) {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return contracts.LEVEL_RANGE.DEFAULT;
    }

    const roundedValue = Math.round(numericValue);

    if (roundedValue < contracts.LEVEL_RANGE.MIN) {
      return contracts.LEVEL_RANGE.MIN;
    }

    if (roundedValue > contracts.LEVEL_RANGE.MAX) {
      return contracts.LEVEL_RANGE.MAX;
    }

    return roundedValue;
  }

  function parseEnabled(value) {
    return value === true;
  }

  function createFailure(code, message, details = {}) {
    return {
      ok: false,
      code,
      message,
      details
    };
  }

  function createSuccess(value = {}) {
    return {
      ok: true,
      ...value
    };
  }

  const validation = Object.freeze({
    clampLevel,
    parseEnabled,
    createFailure,
    createSuccess
  });

  shared.validation = validation;

  if (typeof module === "object" && module.exports) {
    module.exports = validation;
  }
})();
