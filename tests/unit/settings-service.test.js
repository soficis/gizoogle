const assert = require("node:assert/strict");
const test = require("node:test");

const { loadBrowserModules } = require("../support/load-browser-modules");
const { sharedModules } = require("../support/module-paths");
const path = require("node:path");

function loadSettingsContext() {
  return loadBrowserModules([
    ...sharedModules,
    path.resolve(__dirname, "../../src/app/settings-service.js")
  ]);
}

test("settings service normalizes loaded values", async () => {
  const context = loadSettingsContext();
  const settingsServiceFactory = context.Gizoogle.app.settingsService;

  const storageAdapter = {
    async get() {
      return {
        ok: true,
        data: {
          gizoogleEnabled: "yes",
          gizoogleLevel: "9"
        }
      };
    },
    async set() {
      return { ok: true };
    }
  };

  const settingsService = settingsServiceFactory.createSettingsService(storageAdapter);
  const result = await settingsService.load();

  assert.equal(result.ok, true);
  const normalizedSettings = JSON.parse(JSON.stringify(result.settings));
  assert.deepEqual(normalizedSettings, {
    enabled: false,
    level: 3
  });
});
