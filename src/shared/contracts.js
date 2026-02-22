(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const shared = gizoogle.shared || (gizoogle.shared = {});

  const LEVEL_RANGE = Object.freeze({
    MIN: 1,
    MAX: 3,
    DEFAULT: 2
  });

  const DEFAULT_STATE = Object.freeze({
    ENABLED: true,
    LEVEL: LEVEL_RANGE.DEFAULT
  });

  const STORAGE_KEYS = Object.freeze({
    ENABLED: "gizoogleEnabled",
    LEVEL: "gizoogleLevel"
  });

  const MESSAGE_TYPES = Object.freeze({
    SET_ENABLED: "GIZOOGLE_SET_ENABLED",
    GET_STATE: "GIZOOGLE_GET_STATE",
    SET_LEVEL: "GIZOOGLE_SET_LEVEL"
  });

  const MESSAGE_ERROR_CODES = Object.freeze({
    INVALID_MESSAGE: "INVALID_MESSAGE",
    UNSUPPORTED_MESSAGE: "UNSUPPORTED_MESSAGE"
  });

  const ADAPTER_ERROR_CODES = Object.freeze({
    STORAGE_READ_FAILED: "STORAGE_READ_FAILED",
    STORAGE_WRITE_FAILED: "STORAGE_WRITE_FAILED",
    ACTIVE_TAB_NOT_FOUND: "ACTIVE_TAB_NOT_FOUND",
    CONTENT_SCRIPT_UNREACHABLE: "CONTENT_SCRIPT_UNREACHABLE"
  });

  const EXCLUDED_TAGS = Object.freeze([
    "SCRIPT",
    "STYLE",
    "NOSCRIPT",
    "TEXTAREA",
    "INPUT",
    "SELECT",
    "OPTION",
    "PRE",
    "CODE",
    "KBD",
    "SAMP",
    "SVG",
    "MATH"
  ]);

  const contracts = Object.freeze({
    LEVEL_RANGE,
    DEFAULT_STATE,
    STORAGE_KEYS,
    MESSAGE_TYPES,
    MESSAGE_ERROR_CODES,
    ADAPTER_ERROR_CODES,
    EXCLUDED_TAGS
  });

  shared.contracts = contracts;

  if (typeof module === "object" && module.exports) {
    module.exports = contracts;
  }
})();
