import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

test("/modules/ecg-advanced uses the dedicated Advanced ECG access loader", () => {
  const page = fs.readFileSync(path.join(process.cwd(), "src/app/modules/ecg-advanced/page.tsx"), "utf8");
  assert.match(page, /loadAdvancedEcgAccess/);
  assert.match(page, /AdvancedEcgLearnerPage/);
  assert.doesNotMatch(page, /requireEcgModuleAccess/);
});
