(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const adapters = gizoogle.adapters || (gizoogle.adapters = {});
  const chromeAdapters = adapters.chrome || (adapters.chrome = {});

  const contracts = gizoogle.shared && gizoogle.shared.contracts;
  const validation = gizoogle.shared && gizoogle.shared.validation;

  if (!contracts) {
    throw new Error("src/shared/contracts.js must be loaded before src/adapters/chrome/messaging.js");
  }

  if (!validation) {
    throw new Error("src/shared/validation.js must be loaded before src/adapters/chrome/messaging.js");
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

  function createMessagingAdapter(chromeApi) {
    if (!chromeApi || !chromeApi.tabs) {
      throw new Error("createMessagingAdapter requires chrome.tabs");
    }

    function getActiveTabId() {
      return new Promise((resolve) => {
        try {
          chromeApi.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (chromeApi.runtime && chromeApi.runtime.lastError) {
              resolve(
                validation.createFailure(
                  contracts.ADAPTER_ERROR_CODES.ACTIVE_TAB_NOT_FOUND,
                  chromeApi.runtime.lastError.message || "Unable to read active tab"
                )
              );
              return;
            }

            const activeTab = tabs && tabs[0];

            if (!activeTab || typeof activeTab.id !== "number") {
              resolve(
                validation.createFailure(
                  contracts.ADAPTER_ERROR_CODES.ACTIVE_TAB_NOT_FOUND,
                  "No active tab available"
                )
              );
              return;
            }

            resolve(
              validation.createSuccess({
                tabId: activeTab.id
              })
            );
          });
        } catch (error) {
          resolve(
            validation.createFailure(
              contracts.ADAPTER_ERROR_CODES.ACTIVE_TAB_NOT_FOUND,
              normalizeErrorMessage(error)
            )
          );
        }
      });
    }

    async function sendToActiveTab(message) {
      const activeTabResult = await getActiveTabId();

      if (!activeTabResult.ok) {
        return activeTabResult;
      }

      return new Promise((resolve) => {
        try {
          chromeApi.tabs.sendMessage(activeTabResult.tabId, message, (response) => {
            if (chromeApi.runtime && chromeApi.runtime.lastError) {
              resolve(
                validation.createFailure(
                  contracts.ADAPTER_ERROR_CODES.CONTENT_SCRIPT_UNREACHABLE,
                  chromeApi.runtime.lastError.message || "Content script did not respond"
                )
              );
              return;
            }

            resolve(
              validation.createSuccess({
                response
              })
            );
          });
        } catch (error) {
          resolve(
            validation.createFailure(
              contracts.ADAPTER_ERROR_CODES.CONTENT_SCRIPT_UNREACHABLE,
              normalizeErrorMessage(error)
            )
          );
        }
      });
    }

    return Object.freeze({
      getActiveTabId,
      sendToActiveTab
    });
  }

  chromeAdapters.messaging = Object.freeze({
    createMessagingAdapter
  });

  if (typeof module === "object" && module.exports) {
    module.exports = chromeAdapters.messaging;
  }
})();
