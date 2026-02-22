(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});

  const contracts = gizoogle.shared && gizoogle.shared.contracts;
  const validation = gizoogle.shared && gizoogle.shared.validation;
  const translatorApi = gizoogle.domain && gizoogle.domain.translator && gizoogle.domain.translator.api;

  const settingsServiceFactory = gizoogle.app && gizoogle.app.settingsService;
  const translatePageUseCaseFactory = gizoogle.app && gizoogle.app.translatePageUseCase;
  const errorReporter = gizoogle.app && gizoogle.app.errorReporter;

  const chromeStorageAdapterFactory =
    gizoogle.adapters && gizoogle.adapters.chrome && gizoogle.adapters.chrome.storage;

  const textNodeCacheFactory = gizoogle.adapters && gizoogle.adapters.dom && gizoogle.adapters.dom.textNodeCache;
  const eligibility = gizoogle.adapters && gizoogle.adapters.dom && gizoogle.adapters.dom.eligibility;
  const walker = gizoogle.adapters && gizoogle.adapters.dom && gizoogle.adapters.dom.walker;
  const scanSchedulerFactory =
    gizoogle.adapters && gizoogle.adapters.dom && gizoogle.adapters.dom.scanScheduler;
  const mutationObserverFactory =
    gizoogle.adapters && gizoogle.adapters.dom && gizoogle.adapters.dom.mutationObserver;

  if (!contracts || !validation || !translatorApi) {
    throw new Error("Content script dependencies are not fully loaded");
  }

  if (
    !settingsServiceFactory ||
    !translatePageUseCaseFactory ||
    !chromeStorageAdapterFactory ||
    !textNodeCacheFactory ||
    !eligibility ||
    !walker ||
    !scanSchedulerFactory ||
    !mutationObserverFactory
  ) {
    throw new Error("Content script adapters/app modules are not fully loaded");
  }

  const state = {
    enabled: contracts.DEFAULT_STATE.ENABLED,
    level: contracts.DEFAULT_STATE.LEVEL,
    scanState: "idle",
    pendingSettings: null,
    scanGeneration: 0,
    observer: null,
    observerTarget: null
  };

  const storageAdapter = chromeStorageAdapterFactory.createStorageAdapter(root.chrome);
  const settingsService = settingsServiceFactory.createSettingsService(storageAdapter);
  const textNodeCache = textNodeCacheFactory.createTextNodeCache();
  const scanScheduler = scanSchedulerFactory.createScanScheduler();
  const translatePageUseCase = translatePageUseCaseFactory.createTranslatePageUseCase({
    translatorApi,
    cache: textNodeCache,
    eligibility,
    walker
  });

  function report(scope, result) {
    if (errorReporter && typeof errorReporter.reportError === "function") {
      errorReporter.reportError(scope, result);
    }
  }

  function getCurrentSettings() {
    return {
      enabled: state.enabled,
      level: state.level
    };
  }

  function setEnabled(value) {
    const normalizedEnabled = validation.parseEnabled(value);
    const hasChanged = state.enabled !== normalizedEnabled;

    state.enabled = normalizedEnabled;

    if (hasChanged) {
      scheduleFullScan();
    }
  }

  function setLevel(value) {
    const normalizedLevel = validation.clampLevel(value);
    const hasChanged = state.level !== normalizedLevel;

    state.level = normalizedLevel;
    translatorApi.setLevel(normalizedLevel);

    if (hasChanged && state.enabled) {
      scheduleFullScan();
    }
  }

  function onScanComplete() {
    if (state.pendingSettings) {
      const pendingSettings = state.pendingSettings;
      state.pendingSettings = null;
      state.scanState = "idle";
      scheduleFullScan(pendingSettings);
      return;
    }

    state.scanState = "idle";

    if (state.observer && state.observerTarget) {
      state.observer.start(state.observerTarget);
    }
  }

  function processMutationTarget(targetNode) {
    translatePageUseCase.processRoot(targetNode, getCurrentSettings());
  }

  function handleMutations(mutations) {
    if (state.scanState !== "idle") {
      return;
    }

    for (const mutation of mutations) {
      if (mutation.type === "characterData") {
        const targetNode = mutation.target;
        const translatedValue = textNodeCache.getTranslated(targetNode);

        if (translatedValue === targetNode.nodeValue) {
          continue;
        }

        processMutationTarget(targetNode);
        continue;
      }

      if (mutation.type === "childList") {
        for (const addedNode of mutation.addedNodes) {
          processMutationTarget(addedNode);
        }
      }
    }
  }

  function scheduleFullScan(requestedSettings = getCurrentSettings()) {
    if (state.scanState === "scanning") {
      state.pendingSettings = {
        enabled: validation.parseEnabled(requestedSettings.enabled),
        level: validation.clampLevel(requestedSettings.level)
      };
      return;
    }

    if (!root.document || !root.document.body) {
      return;
    }

    state.scanGeneration += 1;
    const currentGeneration = state.scanGeneration;
    state.scanState = "scanning";

    if (state.observer) {
      state.observer.stop();
    }

    const normalizedSettings = {
      enabled: validation.parseEnabled(requestedSettings.enabled),
      level: validation.clampLevel(requestedSettings.level)
    };

    const nodes = walker.collectTextNodes(root.document.body);

    scanScheduler.runNodes(
      nodes,
      (node) => {
        if (state.scanGeneration !== currentGeneration) {
          return;
        }

        translatePageUseCase.processNode(node, normalizedSettings);
      },
      onScanComplete
    );
  }

  function createMessageResponse(payload) {
    return validation.createSuccess(payload);
  }

  function createMessageError(code, message) {
    return validation.createFailure(code, message);
  }

  function handleMessage(message, _sender, sendResponse) {
    if (!message || typeof message !== "object") {
      sendResponse(
        createMessageError(
          contracts.MESSAGE_ERROR_CODES.INVALID_MESSAGE,
          "Message payload must be an object"
        )
      );
      return false;
    }

    if (message.type === contracts.MESSAGE_TYPES.SET_ENABLED) {
      setEnabled(message.enabled);
      sendResponse(createMessageResponse({ enabled: state.enabled }));
      return true;
    }

    if (message.type === contracts.MESSAGE_TYPES.SET_LEVEL) {
      setLevel(message.level);
      sendResponse(createMessageResponse({ level: state.level }));
      return true;
    }

    if (message.type === contracts.MESSAGE_TYPES.GET_STATE) {
      sendResponse(createMessageResponse(getCurrentSettings()));
      return true;
    }

    sendResponse(
      createMessageError(
        contracts.MESSAGE_ERROR_CODES.UNSUPPORTED_MESSAGE,
        `Unsupported message type: ${String(message.type)}`
      )
    );

    return false;
  }

  async function initializeStateFromStorage() {
    const result = await settingsService.load();

    if (!result.ok) {
      report("content-storage-load", result);
      return;
    }

    state.enabled = result.settings.enabled;
    state.level = result.settings.level;
    translatorApi.setLevel(state.level);
  }

  async function initialize() {
    await initializeStateFromStorage();

    const observer = mutationObserverFactory.createMutationObserver(handleMutations);
    const targetNode = root.document.documentElement || root.document;
    state.observer = observer;
    state.observerTarget = targetNode;
    observer.start(targetNode);

    scheduleFullScan();

    root.chrome.runtime.onMessage.addListener(handleMessage);

    if (root.console && typeof root.console.debug === "function") {
      root.console.debug("[gizoogle:content] initialized", {
        level: state.level,
        enabled: state.enabled,
        metrics: scanScheduler.metrics
      });
    }
  }

  initialize().catch((error) => {
    report("content-init", {
      code: "INIT_FAILED",
      message: error && error.message ? error.message : String(error)
    });
  });
})();
