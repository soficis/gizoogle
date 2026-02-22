(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const adapters = gizoogle.adapters || (gizoogle.adapters = {});
  const domAdapters = adapters.dom || (adapters.dom = {});

  function createTextNodeCache() {
    const stateByNode = new WeakMap();

    function getNodeState(node) {
      if (!stateByNode.has(node)) {
        stateByNode.set(node, {});
      }

      return stateByNode.get(node);
    }

    function getOriginal(node) {
      const state = stateByNode.get(node);
      return state ? state.original : undefined;
    }

    function setOriginal(node, originalValue) {
      const state = getNodeState(node);
      state.original = originalValue;
    }

    function getTranslated(node) {
      const state = stateByNode.get(node);
      return state ? state.translated : undefined;
    }

    function setTranslated(node, translatedValue) {
      const state = getNodeState(node);
      state.translated = translatedValue;
    }

    function getLevel(node) {
      const state = stateByNode.get(node);
      return state ? state.level : undefined;
    }

    function setLevel(node, levelValue) {
      const state = getNodeState(node);
      state.level = levelValue;
    }

    function clear(node) {
      const state = stateByNode.get(node);

      if (!state) {
        return;
      }

      delete state.translated;
      delete state.level;
    }

    return Object.freeze({
      getOriginal,
      setOriginal,
      getTranslated,
      setTranslated,
      getLevel,
      setLevel,
      clear
    });
  }

  domAdapters.textNodeCache = Object.freeze({
    createTextNodeCache
  });

  if (typeof module === "object" && module.exports) {
    module.exports = domAdapters.textNodeCache;
  }
})();
