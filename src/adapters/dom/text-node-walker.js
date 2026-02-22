(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const adapters = gizoogle.adapters || (gizoogle.adapters = {});
  const domAdapters = adapters.dom || (adapters.dom = {});

  const eligibility = domAdapters.eligibility;

  if (!eligibility) {
    throw new Error(
      "src/adapters/dom/text-node-eligibility.js must be loaded before src/adapters/dom/text-node-walker.js"
    );
  }

  const nodeFilter = root.NodeFilter || {
    SHOW_TEXT: 4,
    FILTER_ACCEPT: 1,
    FILTER_REJECT: 2
  };

  function collectTextNodes(rootNode) {
    if (!root.document || typeof root.document.createTreeWalker !== "function") {
      return [];
    }

    const textNodes = [];
    const treeWalker = root.document.createTreeWalker(rootNode, nodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return eligibility.isEligibleTextNode(node)
          ? nodeFilter.FILTER_ACCEPT
          : nodeFilter.FILTER_REJECT;
      }
    });

    let currentNode = treeWalker.nextNode();

    while (currentNode) {
      textNodes.push(currentNode);
      currentNode = treeWalker.nextNode();
    }

    return textNodes;
  }

  const walker = Object.freeze({
    collectTextNodes,
    isElementOrDocumentFragment: eligibility.isElementOrDocumentFragment
  });

  domAdapters.walker = walker;

  if (typeof module === "object" && module.exports) {
    module.exports = walker;
  }
})();
