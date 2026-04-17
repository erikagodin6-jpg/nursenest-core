const assert = require("node:assert/strict");
const test = require("node:test");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const preloadPath = path.join(__dirname, "standalone-startup-watchdog-preload.cjs");

test("preload emits proof logs when loaded via --require", () => {
  const result = spawnSync(
    process.execPath,
    ["--require", preloadPath, "-e", "process.exit(0)"],
    {
      cwd: __dirname,
      encoding: "utf8",
    },
  );

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const combined = `${result.stdout}\n${result.stderr}`;
  assert.match(combined, /startup_watchdog preload_file_entered/);
  assert.match(combined, /startup_watchdog preload_installed/);
  assert.match(combined, /startup_watchdog preload_patch_http_begin/);
  assert.match(combined, /startup_watchdog preload_patch_http_done/);
  assert.match(combined, /startup_watchdog preload_patch_https_begin/);
  assert.match(combined, /startup_watchdog preload_patch_https_done/);
  assert.match(combined, /startup_watchdog preload_patch_next_begin/);
  assert.match(combined, /startup_watchdog preload_(patch_next_done|patch_next_failed)/);
});
