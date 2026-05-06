const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

test("build script resolves app package.json from app root", () => {
  const source = fs.readFileSync(path.join(process.cwd(), "script", "build.ts"), "utf8");

  assert.match(source, /const appRoot = APP_ROOT;/);
  assert.match(source, /const pkgPath = path\.join\(appRoot, "package\.json"\);/);
  assert.match(source, /console\.log\("\[build-paths\] appRoot=", appRoot, "pkgPath=", pkgPath\);/);
  assert.doesNotMatch(source, /readFile\("package\.json"/);
});
