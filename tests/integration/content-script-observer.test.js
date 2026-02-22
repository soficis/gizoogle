const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");

const { loadBrowserModules } = require("../support/load-browser-modules");

const CONTENT_ENTRY = path.resolve(
  __dirname,
  "../../src/content-script/entry.js",
);

test("content script pauses mutation observation during full scans to avoid mutation storms", async () => {
  const listeners = [];
  const observerCalls = {
    starts: 0,
    stops: 0,
  };
  const responsePayloads = [];

  const context = loadBrowserModules([CONTENT_ENTRY], {
    document: {
      body: { nodeType: 1 },
      documentElement: { nodeType: 1 },
    },
    chrome: {
      runtime: {
        onMessage: {
          addListener(listener) {
            listeners.push(listener);
          },
        },
      },
    },
    Gizoogle: {
      shared: {
        contracts: {
          DEFAULT_STATE: {
            ENABLED: true,
            LEVEL: 2,
          },
          MESSAGE_TYPES: {
            SET_ENABLED: "GIZOOGLE_SET_ENABLED",
            GET_STATE: "GIZOOGLE_GET_STATE",
            SET_LEVEL: "GIZOOGLE_SET_LEVEL",
          },
          MESSAGE_ERROR_CODES: {
            INVALID_MESSAGE: "INVALID_MESSAGE",
            UNSUPPORTED_MESSAGE: "UNSUPPORTED_MESSAGE",
          },
        },
        validation: {
          clampLevel(value) {
            const numeric = Number(value);
            if (!Number.isFinite(numeric)) return 2;
            return Math.max(1, Math.min(3, Math.round(numeric)));
          },
          parseEnabled(value) {
            return value === true;
          },
          createSuccess(payload = {}) {
            return {
              ok: true,
              ...payload,
            };
          },
          createFailure(code, message) {
            return {
              ok: false,
              code,
              message,
            };
          },
        },
      },
      domain: {
        translator: {
          api: {
            setLevel() {},
            translateText(input) {
              return input;
            },
          },
        },
      },
      app: {
        settingsService: {
          createSettingsService() {
            return {
              async load() {
                return {
                  ok: true,
                  settings: {
                    enabled: true,
                    level: 2,
                  },
                };
              },
            };
          },
        },
        translatePageUseCase: {
          createTranslatePageUseCase() {
            return {
              processRoot() {},
              processNode() {},
            };
          },
        },
        errorReporter: {
          reportError() {},
        },
      },
      adapters: {
        chrome: {
          storage: {
            createStorageAdapter() {
              return {};
            },
          },
        },
        dom: {
          textNodeCache: {
            createTextNodeCache() {
              return {
                getTranslated() {
                  return undefined;
                },
              };
            },
          },
          eligibility: {
            isTextNode(node) {
              return node && node.nodeType === 3;
            },
            isEligibleTextNode(node) {
              return Boolean(node && node.nodeType === 3);
            },
          },
          walker: {
            collectTextNodes() {
              return [
                { nodeType: 3, nodeValue: "alpha" },
                { nodeType: 3, nodeValue: "beta" },
              ];
            },
            isElementOrDocumentFragment(node) {
              return Boolean(node && node.nodeType === 1);
            },
          },
          scanScheduler: {
            createScanScheduler() {
              return {
                metrics: {},
                runNodes(nodes, processNode, onComplete) {
                  for (const node of nodes) {
                    processNode(node);
                  }

                  onComplete();
                },
              };
            },
          },
          mutationObserver: {
            createMutationObserver() {
              return {
                start() {
                  observerCalls.starts += 1;
                },
                stop() {
                  observerCalls.stops += 1;
                },
              };
            },
          },
        },
      },
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 0));

  assert.equal(listeners.length, 1);
  assert.deepEqual(observerCalls, { starts: 2, stops: 1 });

  const onMessage = listeners[0];

  onMessage(
    {
      type: context.Gizoogle.shared.contracts.MESSAGE_TYPES.SET_ENABLED,
      enabled: false,
    },
    {},
    (payload) => responsePayloads.push(payload),
  );

  assert.deepEqual(observerCalls, { starts: 3, stops: 2 });
  assert.deepEqual(responsePayloads, [{ ok: true, enabled: false }]);
});
