(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const app = gizoogle.app || (gizoogle.app = {});

  function sanitizeMessage(message) {
    if (!message) {
      return "unknown error";
    }

    return String(message).replace(/(token|password|secret|api[_-]?key)\s*[:=]\s*\S+/gi, "$1=[redacted]");
  }

  function reportError(scope, errorResult) {
    const code = errorResult && errorResult.code ? errorResult.code : "UNKNOWN_ERROR";
    const message = sanitizeMessage(errorResult && errorResult.message);

    if (root.console && typeof root.console.warn === "function") {
      root.console.warn(`[gizoogle:${scope}] ${code}: ${message}`);
    }
  }

  const errorReporter = Object.freeze({
    reportError
  });

  app.errorReporter = errorReporter;

  if (typeof module === "object" && module.exports) {
    module.exports = errorReporter;
  }
})();
