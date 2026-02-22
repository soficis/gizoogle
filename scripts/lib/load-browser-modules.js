const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function loadBrowserModules(modulePaths, overrides = {}) {
  const context = {
    console,
    setTimeout,
    clearTimeout,
    performance: {
      now() {
        return Date.now();
      }
    },
    ...overrides
  };

  context.globalThis = context;
  context.self = context;

  vm.createContext(context);

  for (const modulePath of modulePaths) {
    const absolutePath = path.resolve(modulePath);
    const source = fs.readFileSync(absolutePath, "utf8");
    vm.runInContext(source, context, { filename: absolutePath });
  }

  return context;
}

module.exports = {
  loadBrowserModules
};
