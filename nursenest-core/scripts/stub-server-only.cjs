/**
 * Allow tsx/node:test to load modules that `import "server-only"` (Next.js guard).
 * Use: NODE_OPTIONS='--require ./scripts/stub-server-only.cjs' npx tsx --test …
 */
const Module = require("module");
const orig = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === "server-only") {
    return {};
  }
  return orig.apply(this, arguments);
};
