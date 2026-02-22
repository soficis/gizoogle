(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const app = gizoogle.app || (gizoogle.app = {});

  const contracts = gizoogle.shared && gizoogle.shared.contracts;
  const validation = gizoogle.shared && gizoogle.shared.validation;

  if (!contracts) {
    throw new Error("src/shared/contracts.js must be loaded before src/app/settings-service.js");
  }

  if (!validation) {
    throw new Error("src/shared/validation.js must be loaded before src/app/settings-service.js");
  }

  function normalizeSettings(rawSettings = {}) {
    const enabledValue = Object.prototype.hasOwnProperty.call(rawSettings, contracts.STORAGE_KEYS.ENABLED)
      ? rawSettings[contracts.STORAGE_KEYS.ENABLED]
      : contracts.DEFAULT_STATE.ENABLED;

    const levelValue = Object.prototype.hasOwnProperty.call(rawSettings, contracts.STORAGE_KEYS.LEVEL)
      ? rawSettings[contracts.STORAGE_KEYS.LEVEL]
      : contracts.DEFAULT_STATE.LEVEL;

    return {
      enabled: validation.parseEnabled(enabledValue),
      level: validation.clampLevel(levelValue)
    };
  }

  function createSettingsService(storageAdapter) {
    if (!storageAdapter) {
      throw new Error("createSettingsService requires a storage adapter");
    }

    async function load() {
      const result = await storageAdapter.get({
        [contracts.STORAGE_KEYS.ENABLED]: contracts.DEFAULT_STATE.ENABLED,
        [contracts.STORAGE_KEYS.LEVEL]: contracts.DEFAULT_STATE.LEVEL
      });

      if (!result.ok) {
        return result;
      }

      return validation.createSuccess({
        settings: normalizeSettings(result.data)
      });
    }

    async function saveEnabled(enabled) {
      return storageAdapter.set({
        [contracts.STORAGE_KEYS.ENABLED]: validation.parseEnabled(enabled)
      });
    }

    async function saveLevel(level) {
      return storageAdapter.set({
        [contracts.STORAGE_KEYS.LEVEL]: validation.clampLevel(level)
      });
    }

    return Object.freeze({
      load,
      saveEnabled,
      saveLevel
    });
  }

  app.settingsService = Object.freeze({
    createSettingsService,
    normalizeSettings
  });

  if (typeof module === "object" && module.exports) {
    module.exports = app.settingsService;
  }
})();
