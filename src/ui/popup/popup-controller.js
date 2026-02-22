(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});

  const contracts = gizoogle.shared && gizoogle.shared.contracts;
  const validation = gizoogle.shared && gizoogle.shared.validation;

  const settingsServiceFactory = gizoogle.app && gizoogle.app.settingsService;
  const errorReporter = gizoogle.app && gizoogle.app.errorReporter;

  const storageAdapterFactory =
    gizoogle.adapters && gizoogle.adapters.chrome && gizoogle.adapters.chrome.storage;
  const messagingAdapterFactory =
    gizoogle.adapters && gizoogle.adapters.chrome && gizoogle.adapters.chrome.messaging;

  const popupViewFactory =
    gizoogle.ui && gizoogle.ui.popup && gizoogle.ui.popup.view && gizoogle.ui.popup.view.createPopupView;
  const popupStateFactory =
    gizoogle.ui && gizoogle.ui.popup && gizoogle.ui.popup.state && gizoogle.ui.popup.state.createPopupState;

  if (
    !contracts ||
    !validation ||
    !settingsServiceFactory ||
    !storageAdapterFactory ||
    !messagingAdapterFactory ||
    !popupViewFactory ||
    !popupStateFactory
  ) {
    throw new Error("Popup dependencies are not fully loaded");
  }

  function report(scope, result) {
    if (errorReporter && typeof errorReporter.reportError === "function") {
      errorReporter.reportError(scope, result);
    }
  }

  function userFacingError(result) {
    if (!result) {
      return "Unexpected popup error.";
    }

    if (result.code === contracts.ADAPTER_ERROR_CODES.CONTENT_SCRIPT_UNREACHABLE) {
      return "This page does not allow extension scripting.";
    }

    if (result.code === contracts.ADAPTER_ERROR_CODES.ACTIVE_TAB_NOT_FOUND) {
      return "Could not find an active tab.";
    }

    return result.message || "Unexpected popup error.";
  }

  async function initialize() {
    const view = popupViewFactory(root.document);
    const storageAdapter = storageAdapterFactory.createStorageAdapter(root.chrome);
    const messagingAdapter = messagingAdapterFactory.createMessagingAdapter(root.chrome);
    const settingsService = settingsServiceFactory.createSettingsService(storageAdapter);
    const popupState = popupStateFactory(settingsService, messagingAdapter);

    async function syncInitialState() {
      const loadResult = await popupState.load();

      if (!loadResult.ok) {
        report("popup-load", loadResult);
        view.setEnabled(contracts.DEFAULT_STATE.ENABLED);
        view.setLevel(contracts.DEFAULT_STATE.LEVEL);
        view.showError(userFacingError(loadResult));
        return;
      }

      view.setEnabled(loadResult.settings.enabled);
      view.setLevel(loadResult.settings.level);
      view.showError("");
    }

    async function handleEnabledChange(event) {
      const enabled = view.getEnabledFromEvent(event);
      const result = await popupState.setEnabled(enabled);

      if (!result.ok) {
        report("popup-set-enabled", result);
        view.setEnabled(!enabled);
        view.showError(userFacingError(result));
        return;
      }

      view.showError("");
    }

    async function handleLevelInput(event) {
      const level = validation.clampLevel(view.getLevelFromEvent(event));
      view.setLevel(level);

      const result = await popupState.setLevel(level);

      if (!result.ok) {
        report("popup-set-level", result);
        view.showError(userFacingError(result));
        return;
      }

      view.showError("");
    }

    view.onEnabledChange(handleEnabledChange);
    view.onLevelInput(handleLevelInput);

    await syncInitialState();
  }

  root.document.addEventListener("DOMContentLoaded", () => {
    initialize().catch((error) => {
      report("popup-init", {
        code: "INIT_FAILED",
        message: error && error.message ? error.message : String(error)
      });
    });
  });
})();
