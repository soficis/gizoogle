(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const ui = gizoogle.ui || (gizoogle.ui = {});
  const popup = ui.popup || (ui.popup = {});

  const contracts = gizoogle.shared && gizoogle.shared.contracts;
  const validation = gizoogle.shared && gizoogle.shared.validation;

  if (!contracts || !validation) {
    throw new Error("Popup state requires shared contracts and validation modules");
  }

  function createPopupState(settingsService, messagingAdapter) {
    if (!settingsService || !messagingAdapter) {
      throw new Error("createPopupState requires settingsService and messagingAdapter");
    }

    async function load() {
      return settingsService.load();
    }

    async function setEnabled(enabled) {
      const normalizedEnabled = validation.parseEnabled(enabled);

      const saveResult = await settingsService.saveEnabled(normalizedEnabled);

      if (!saveResult.ok) {
        return saveResult;
      }

      const messageResult = await messagingAdapter.sendToActiveTab({
        type: contracts.MESSAGE_TYPES.SET_ENABLED,
        enabled: normalizedEnabled
      });

      if (!messageResult.ok) {
        return messageResult;
      }

      return validation.createSuccess({
        enabled: normalizedEnabled
      });
    }

    async function setLevel(level) {
      const normalizedLevel = validation.clampLevel(level);

      const saveResult = await settingsService.saveLevel(normalizedLevel);

      if (!saveResult.ok) {
        return saveResult;
      }

      const messageResult = await messagingAdapter.sendToActiveTab({
        type: contracts.MESSAGE_TYPES.SET_LEVEL,
        level: normalizedLevel
      });

      if (!messageResult.ok) {
        return messageResult;
      }

      return validation.createSuccess({
        level: normalizedLevel
      });
    }

    return Object.freeze({
      load,
      setEnabled,
      setLevel
    });
  }

  popup.state = Object.freeze({
    createPopupState
  });

  if (typeof module === "object" && module.exports) {
    module.exports = popup.state;
  }
})();
