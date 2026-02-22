(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const adapters = gizoogle.adapters || (gizoogle.adapters = {});
  const domAdapters = adapters.dom || (adapters.dom = {});

  function createMutationObserver(onMutations) {
    if (typeof root.MutationObserver !== "function") {
      throw new Error("MutationObserver is unavailable in this environment");
    }

    const observer = new root.MutationObserver(onMutations);

    function start(targetNode) {
      observer.observe(targetNode, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }

    function stop() {
      observer.disconnect();
    }

    return Object.freeze({
      start,
      stop
    });
  }

  domAdapters.mutationObserver = Object.freeze({
    createMutationObserver
  });

  if (typeof module === "object" && module.exports) {
    module.exports = domAdapters.mutationObserver;
  }
})();
