const assert = require("node:assert/strict");
const test = require("node:test");

const { loadBrowserModules } = require("../support/load-browser-modules");
const { popupModules } = require("../support/module-paths");

function loadPopupContext() {
  return loadBrowserModules(popupModules);
}

test("popup state saves and notifies content script", async () => {
  const context = loadPopupContext();
  const popupStateFactory = context.Gizoogle.ui.popup.state;

  const calls = [];

  const settingsService = {
    async load() {
      return { ok: true, settings: { enabled: true, level: 2 } };
    },
    async saveEnabled(value) {
      calls.push(["saveEnabled", value]);
      return { ok: true };
    },
    async saveLevel(value) {
      calls.push(["saveLevel", value]);
      return { ok: true };
    }
  };

  const messagingAdapter = {
    async sendToActiveTab(message) {
      calls.push(["send", message]);
      return { ok: true, response: { ok: true } };
    }
  };

  const popupState = popupStateFactory.createPopupState(settingsService, messagingAdapter);

  const enabledResult = await popupState.setEnabled(true);
  assert.equal(enabledResult.ok, true);

  const levelResult = await popupState.setLevel(10);
  assert.equal(levelResult.ok, true);

  const normalizedCalls = JSON.parse(JSON.stringify(calls));
  assert.deepEqual(normalizedCalls, [
    ["saveEnabled", true],
    ["send", { type: "GIZOOGLE_SET_ENABLED", enabled: true }],
    ["saveLevel", 3],
    ["send", { type: "GIZOOGLE_SET_LEVEL", level: 3 }]
  ]);
});

test("popup state returns adapter failures", async () => {
  const context = loadPopupContext();
  const popupStateFactory = context.Gizoogle.ui.popup.state;

  const settingsService = {
    async load() {
      return { ok: true, settings: { enabled: true, level: 2 } };
    },
    async saveEnabled() {
      return { ok: true };
    },
    async saveLevel() {
      return { ok: true };
    }
  };

  const messagingAdapter = {
    async sendToActiveTab() {
      return {
        ok: false,
        code: "CONTENT_SCRIPT_UNREACHABLE",
        message: "No receiver"
      };
    }
  };

  const popupState = popupStateFactory.createPopupState(settingsService, messagingAdapter);
  const result = await popupState.setEnabled(true);

  assert.equal(result.ok, false);
  assert.equal(result.code, "CONTENT_SCRIPT_UNREACHABLE");
});
