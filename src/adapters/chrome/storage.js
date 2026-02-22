(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const adapters = gizoogle.adapters || (gizoogle.adapters = {});
  const chromeAdapters = adapters.chrome || (adapters.chrome = {});

  const contracts = gizoogle.shared && gizoogle.shared.contracts;
  const validation = gizoogle.shared && gizoogle.shared.validation;

  if (!contracts) {
    throw new Error("src/shared/contracts.js must be loaded before src/adapters/chrome/storage.js");
  }

  if (!validation) {
    throw new Error("src/shared/validation.js must be loaded before src/adapters/chrome/storage.js");
  }

  function normalizeErrorMessage(error) {
    if (!error) {
      return "unknown error";
    }

    if (typeof error.message === "string" && error.message.trim()) {
      return error.message;
    }

    return String(error);
  }

  function createStorageAdapter(chromeApi) {
    if (!chromeApi || !chromeApi.storage || !chromeApi.storage.local) {
      throw new Error("createStorageAdapter requires chrome.storage.local");
    }

    function get(defaults) {
      return new Promise((resolve) => {
        try {
          chromeApi.storage.local.get(defaults, (result) => {
            if (chromeApi.runtime && chromeApi.runtime.lastError) {
              resolve(
                validation.createFailure(
                  contracts.ADAPTER_ERROR_CODES.STORAGE_READ_FAILED,
                  chromeApi.runtime.lastError.message || "Failed to read storage"
                )
              );
              return;
            }

            resolve(
              validation.createSuccess({
                data: result
              })
            );
          });
        } catch (error) {
          resolve(
            validation.createFailure(
              contracts.ADAPTER_ERROR_CODES.STORAGE_READ_FAILED,
              normalizeErrorMessage(error)
            )
          );
        }
      });
    }

    function set(items) {
      return new Promise((resolve) => {
        try {
          chromeApi.storage.local.set(items, () => {
            if (chromeApi.runtime && chromeApi.runtime.lastError) {
              resolve(
                validation.createFailure(
                  contracts.ADAPTER_ERROR_CODES.STORAGE_WRITE_FAILED,
                  chromeApi.runtime.lastError.message || "Failed to write storage"
                )
              );
              return;
            }

            resolve(validation.createSuccess());
          });
        } catch (error) {
          resolve(
            validation.createFailure(
              contracts.ADAPTER_ERROR_CODES.STORAGE_WRITE_FAILED,
              normalizeErrorMessage(error)
            )
          );
        }
      });
    }

    return Object.freeze({
      get,
      set
    });
  }

  chromeAdapters.storage = Object.freeze({
    createStorageAdapter
  });

  if (typeof module === "object" && module.exports) {
    module.exports = chromeAdapters.storage;
  }
})();
