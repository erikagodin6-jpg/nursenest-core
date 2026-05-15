import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const advancedEcgPagePath = path.join(
  process.cwd(),
  "src/app/(marketing)/(default)/advanced-ecg-nursing/page.tsx",
);

test("Advanced ECG public marketing page does not link to hidden /modules/ecg learner routes", () => {
  const src = fs.readFileSync(advancedEcgPagePath, "utf8");
  assert.doesNotMatch(src, /["']\/modules\/ecg(?!-advanced)/, "public ECG page must link to indexed ECG marketing pages instead of hidden module routes");
  assert.match(src, /["']\/ecg-interpretation["']/, "public ECG page should expose the basic ECG marketing pillar");
  assert.match(src, /["']\/ecg\/ecg-practice-questions["']/, "public ECG page should expose the ECG practice cluster");
});
