(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const adapters = gizoogle.adapters || (gizoogle.adapters = {});
  const domAdapters = adapters.dom || (adapters.dom = {});

  const contracts = gizoogle.shared && gizoogle.shared.contracts;

  if (!contracts) {
    throw new Error("src/shared/contracts.js must be loaded before src/adapters/dom/text-node-eligibility.js");
  }

  const excludedTagSet = new Set(contracts.EXCLUDED_TAGS);

  function textNodeType() {
    return root.Node && typeof root.Node.TEXT_NODE === "number" ? root.Node.TEXT_NODE : 3;
  }

  function elementNodeType() {
    return root.Node && typeof root.Node.ELEMENT_NODE === "number" ? root.Node.ELEMENT_NODE : 1;
  }

  function documentFragmentNodeType() {
    return root.Node && typeof root.Node.DOCUMENT_FRAGMENT_NODE === "number"
      ? root.Node.DOCUMENT_FRAGMENT_NODE
      : 11;
  }

  function isTextNode(node) {
    return Boolean(node) && node.nodeType === textNodeType();
  }

  function hasVisibleText(node) {
    return typeof node.nodeValue === "string" && node.nodeValue.trim().length > 0;
  }

  function hasValidParent(node) {
    const parentElement = node.parentElement;

    if (!parentElement) {
      return false;
    }

    if (excludedTagSet.has(parentElement.tagName)) {
      return false;
    }

    if (typeof parentElement.closest === "function" && parentElement.closest("[data-gizoogle-skip]")) {
      return false;
    }

    if (parentElement.isContentEditable) {
      return false;
    }

    return true;
  }

  function isEligibleTextNode(node) {
    return isTextNode(node) && hasVisibleText(node) && hasValidParent(node);
  }

  function isElementOrDocumentFragment(node) {
    if (!node) {
      return false;
    }

    return node.nodeType === elementNodeType() || node.nodeType === documentFragmentNodeType();
  }

  const eligibility = Object.freeze({
    isTextNode,
    isEligibleTextNode,
    isElementOrDocumentFragment
  });

  domAdapters.eligibility = eligibility;

  if (typeof module === "object" && module.exports) {
    module.exports = eligibility;
  }
})();
