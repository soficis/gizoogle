/* global GizoogleTranslator */

/**
 * Gizoogle Content Script
 * 
 * Translates visible text on web pages using the Snoop Dogg voice translator.
 * Handles DOM observation, text node processing, and state synchronization.
 */
(() => {
  // ============================================================================
  // Constants
  // ============================================================================

  const EXCLUDED_TAGS = new Set([
    "SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT",
    "SELECT", "OPTION", "PRE", "CODE", "KBD", "SAMP", "SVG", "MATH"
  ]);

  const STORAGE_KEY = "gizoogleEnabled";
  const LEVEL_KEY = "gizoogleLevel";
  const PROCESSING_BUDGET_MS = 12;
  const IDLE_TIMEOUT_MS = 500;

  const DEFAULT_ENABLED = true;
  const DEFAULT_LEVEL = 2;
  const MIN_LEVEL = 1;
  const MAX_LEVEL = 3;

  // ============================================================================
  // State
  // ============================================================================

  const state = {
    enabled: DEFAULT_ENABLED,
    level: DEFAULT_LEVEL,
    isScanning: false,
    pendingScan: null,
    scanGeneration: 0,
    observer: null
  };

  // ============================================================================
  // Storage Utilities
  // ============================================================================

  function getFromStorage(defaults) {
    return new Promise((resolve) => {
      try {
        chrome.storage.local.get(defaults, (result) => {
          if (chrome.runtime.lastError) {
            resolve(defaults);
          } else {
            resolve(result);
          }
        });
      } catch {
        resolve(defaults);
      }
    });
  }

  // ============================================================================
  // Text Node Eligibility
  // ============================================================================

  function isTextNode(node) {
    return node && node.nodeType === Node.TEXT_NODE;
  }

  function hasVisibleContent(node) {
    const value = node.nodeValue;
    return value && value.trim().length > 0;
  }

  function hasValidParent(node) {
    const parent = node.parentElement;
    if (!parent) return false;
    if (EXCLUDED_TAGS.has(parent.tagName)) return false;
    if (parent.closest && parent.closest("[data-gizoogle-skip]")) return false;
    if (parent.isContentEditable) return false;
    return true;
  }

  function isEligibleTextNode(node) {
    return isTextNode(node) && hasVisibleContent(node) && hasValidParent(node);
  }

  // ============================================================================
  // Translation Cache Management
  // ============================================================================

  function getOriginalText(node) {
    return node.__gizoogleOriginal;
  }

  function setOriginalText(node, text) {
    node.__gizoogleOriginal = text;
  }

  function getTranslatedText(node) {
    return node.__gizoogleTranslated;
  }

  function setTranslatedText(node, text) {
    node.__gizoogleTranslated = text;
  }

  function getTranslatedLevel(node) {
    return node.__gizoogleLevel;
  }

  function setTranslatedLevel(node, level) {
    node.__gizoogleLevel = level;
  }

  function clearTranslationCache(node) {
    delete node.__gizoogleTranslated;
    delete node.__gizoogleLevel;
  }

  function isAlreadyTranslatedAtLevel(node, currentLevel) {
    const original = getOriginalText(node);
    const translated = getTranslatedText(node);
    const translatedLevel = getTranslatedLevel(node);

    return (
      typeof original === "string" &&
      node.nodeValue === translated &&
      translatedLevel === currentLevel
    );
  }

  function hasExternallyModifiedContent(node) {
    const original = getOriginalText(node);
    const translated = getTranslatedText(node);
    const currentValue = node.nodeValue;

    return currentValue !== translated && currentValue !== original;
  }

  // ============================================================================
  // Text Node Translation
  // ============================================================================

  function captureOriginalIfNeeded(node) {
    const original = getOriginalText(node);
    const isFirstTime = typeof original !== "string";
    const hasBeenModified = hasExternallyModifiedContent(node);

    if (isFirstTime || hasBeenModified) {
      setOriginalText(node, node.nodeValue);
    }
  }

  function translateTextNode(node, currentLevel) {
    if (!isEligibleTextNode(node)) return;
    if (isAlreadyTranslatedAtLevel(node, currentLevel)) return;

    captureOriginalIfNeeded(node);

    const original = getOriginalText(node);
    const translated = GizoogleTranslator.translateText(original, { level: currentLevel });

    setTranslatedText(node, translated);
    setTranslatedLevel(node, currentLevel);
    node.nodeValue = translated;
  }

  function restoreTextNode(node) {
    if (!isTextNode(node)) return;

    const original = getOriginalText(node);
    if (typeof original !== "string") return;

    node.nodeValue = original;
    clearTranslationCache(node);
  }

  // ============================================================================
  // DOM Tree Walking
  // ============================================================================

  function collectAllTextNodes(root) {
    const textNodes = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);

    let node = walker.nextNode();
    while (node) {
      textNodes.push(node);
      node = walker.nextNode();
    }

    return textNodes;
  }

  function walkEligibleTextNodes(root, callback) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) =>
        isEligibleTextNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    });

    let node = walker.nextNode();
    while (node) {
      callback(node);
      node = walker.nextNode();
    }
  }

  // ============================================================================
  // Idle Scheduling
  // ============================================================================

  function scheduleIdleWork(workFunction) {
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(workFunction, { timeout: IDLE_TIMEOUT_MS });
    } else {
      setTimeout(() => workFunction({ timeRemaining: () => 0 }), 0);
    }
  }

  function hasExceededBudget(deadline, startTime) {
    const hasIdleTimeRemaining =
      deadline &&
      typeof deadline.timeRemaining === "function" &&
      deadline.timeRemaining() > 0;

    const elapsedTime = performance.now() - startTime;
    const hasExceededElapsedBudget = elapsedTime > PROCESSING_BUDGET_MS;

    return !hasIdleTimeRemaining || hasExceededElapsedBudget;
  }

  // ============================================================================
  // Full Page Scanning
  // ============================================================================

  function processTextNodes(textNodes, currentEnabled, currentLevel, generation) {
    let index = 0;

    function processChunk(deadline) {
      if (generation !== state.scanGeneration) return;

      const startTime = performance.now();

      while (index < textNodes.length) {
        const node = textNodes[index];
        index++;

        if (currentEnabled) {
          translateTextNode(node, currentLevel);
        } else {
          restoreTextNode(node);
        }

        if (hasExceededBudget(deadline, startTime) && index < textNodes.length) {
          scheduleIdleWork(processChunk);
          return;
        }
      }

      onScanComplete();
    }

    scheduleIdleWork(processChunk);
  }

  function onScanComplete() {
    state.isScanning = false;

    if (state.pendingScan) {
      const { enabled, level } = state.pendingScan;
      state.pendingScan = null;
      scheduleFullScan(enabled, level);
    }
  }

  function startFullScan(scanEnabled, scanLevel, generation) {
    if (!document.body) {
      state.isScanning = false;
      return;
    }

    const textNodes = collectAllTextNodes(document.body);
    processTextNodes(textNodes, scanEnabled, scanLevel, generation);
  }

  function scheduleFullScan(scanEnabled = state.enabled, scanLevel = state.level) {
    if (state.isScanning) {
      state.pendingScan = { enabled: scanEnabled, level: scanLevel };
      return;
    }

    state.isScanning = true;
    state.scanGeneration++;
    startFullScan(scanEnabled, scanLevel, state.scanGeneration);
  }

  // ============================================================================
  // Subtree Processing
  // ============================================================================

  function processSubtree(rootNode) {
    if (!rootNode) return;

    if (isTextNode(rootNode)) {
      if (state.enabled) {
        translateTextNode(rootNode, state.level);
      } else {
        restoreTextNode(rootNode);
      }
      return;
    }

    const isElementOrFragment =
      rootNode.nodeType === Node.ELEMENT_NODE ||
      rootNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE;

    if (!isElementOrFragment) return;

    walkEligibleTextNodes(rootNode, (textNode) => {
      if (state.enabled) {
        translateTextNode(textNode, state.level);
      } else {
        restoreTextNode(textNode);
      }
    });
  }

  // ============================================================================
  // DOM Mutation Observer
  // ============================================================================

  function isInternalChange(node) {
    return getTranslatedText(node) === node.nodeValue;
  }

  function handleCharacterDataMutation(mutation) {
    const node = mutation.target;
    if (!isInternalChange(node)) {
      processSubtree(node);
    }
  }

  function handleChildListMutation(mutation) {
    for (const addedNode of mutation.addedNodes) {
      processSubtree(addedNode);
    }
  }

  function handleMutations(mutations) {
    if (state.isScanning) return;

    for (const mutation of mutations) {
      if (mutation.type === "characterData") {
        handleCharacterDataMutation(mutation);
      } else if (mutation.type === "childList") {
        handleChildListMutation(mutation);
      }
    }
  }

  function startObserver() {
    if (state.observer) return;

    state.observer = new MutationObserver(handleMutations);

    const observerConfig = {
      childList: true,
      subtree: true,
      characterData: true
    };

    const observeTarget = document.documentElement || document;
    state.observer.observe(observeTarget, observerConfig);
  }

  // ============================================================================
  // State Management
  // ============================================================================

  function clampLevel(level) {
    return Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, Math.round(level)));
  }

  function setEnabled(newEnabled) {
    const wasEnabled = state.enabled;
    state.enabled = !!newEnabled;

    if (wasEnabled !== state.enabled) {
      scheduleFullScan();
    }
  }

  function setLevel(newLevel) {
    const numericLevel = Number(newLevel);
    if (!Number.isFinite(numericLevel)) return;

    const clampedLevel = clampLevel(numericLevel);
    const oldLevel = state.level;
    state.level = clampedLevel;

    try {
      GizoogleTranslator.setLevel(clampedLevel);
    } catch {
      // Translator may not be loaded yet
    }

    const levelChanged = oldLevel !== clampedLevel;
    if (levelChanged && state.enabled) {
      scheduleFullScan();
    }
  }

  // ============================================================================
  // Message Handling
  // ============================================================================

  function handleSetEnabledMessage(message, sendResponse) {
    setEnabled(message.enabled);
    sendResponse({ ok: true, enabled: state.enabled });
  }

  function handleGetStateMessage(sendResponse) {
    sendResponse({ ok: true, enabled: state.enabled, level: state.level });
  }

  function handleSetLevelMessage(message, sendResponse) {
    setLevel(message.level);
    sendResponse({ ok: true, level: state.level });
  }

  function handleMessage(message, _sender, sendResponse) {
    if (!message || typeof message !== "object") return;

    switch (message.type) {
      case "GIZOOGLE_SET_ENABLED":
        handleSetEnabledMessage(message, sendResponse);
        return true;

      case "GIZOOGLE_GET_STATE":
        handleGetStateMessage(sendResponse);
        return true;

      case "GIZOOGLE_SET_LEVEL":
        handleSetLevelMessage(message, sendResponse);
        return true;
    }
  }

  // ============================================================================
  // Initialization
  // ============================================================================

  async function loadInitialState() {
    const defaults = {
      [STORAGE_KEY]: DEFAULT_ENABLED,
      [LEVEL_KEY]: DEFAULT_LEVEL
    };

    const result = await getFromStorage(defaults);

    state.enabled = !!result[STORAGE_KEY];
    state.level = clampLevel(Number(result[LEVEL_KEY] ?? DEFAULT_LEVEL));

    try {
      GizoogleTranslator.setLevel(state.level);
    } catch {
      // Translator may not be loaded yet
    }
  }

  async function initialize() {
    await loadInitialState();
    startObserver();
    scheduleFullScan();
  }

  // ============================================================================
  // Entry Point
  // ============================================================================

  initialize();
  chrome.runtime.onMessage.addListener(handleMessage);
})();
