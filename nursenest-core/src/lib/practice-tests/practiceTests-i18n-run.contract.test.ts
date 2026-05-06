import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  applyPracticeTestRunI18nParams,
  isUntranslatedPracticeTestRunResolved,
  resolvePracticeTestRunCopy,
} from "@/lib/practice-tests/practice-test-run-i18n-fallbacks";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RUNNER = path.join(__dirname, "..", "..", "components", "student", "practice-test-runner-client.tsx");
const EN_LEARNER = path.join(__dirname, "..", "..", "..", "public", "i18n", "en", "learner.json");

function uniquePracticeTestRunKeysFromRunner(): string[] {
  const src = fs.readFileSync(RUNNER, "utf8");
  const re = /learner\.practiceTests\.run\.[a-zA-Z0-9]+/g;
  const set = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) set.add(m[0]);
  return [...set].sort();
}

describe("practiceTests run surface i18n", () => {
  it("resolvePracticeTestRunCopy uses fallback when marketing echoes the key", () => {
    const key = "learner.practiceTests.run.submit";
    assert.equal(
      resolvePracticeTestRunCopy(key, key, "Submit answer"),
      "Submit answer",
    );
    assert.equal(resolvePracticeTestRunCopy("Submit answer", key, "Submit answer"), "Submit answer");
  });

  it("interpolates {{n}} on fallback path", () => {
    assert.equal(
      resolvePracticeTestRunCopy("learner.practiceTests.run.navigatorItem", "learner.practiceTests.run.navigatorItem", "Item {{n}}", {
        n: "3",
      }),
      "Item 3",
    );
  });

  it("applyPracticeTestRunI18nParams replaces placeholders", () => {
    assert.equal(applyPracticeTestRunI18nParams("{{a}} of {{b}}", { a: "1", b: "5" }), "1 of 5");
  });

  it("isUntranslatedPracticeTestRunResolved detects empty and dot-path echoes", () => {
    assert.equal(isUntranslatedPracticeTestRunResolved("", "k"), true);
    assert.equal(isUntranslatedPracticeTestRunResolved("learner.practiceTests.run.foo", "k"), true);
    assert.equal(isUntranslatedPracticeTestRunResolved("[missing:x]", "k"), true);
    assert.equal(isUntranslatedPracticeTestRunResolved("Real copy", "k"), false);
  });

  it("English learner shard defines every practiceTests.run key used by the runner (non-empty, not raw key)", () => {
    const en: Record<string, string> = JSON.parse(fs.readFileSync(EN_LEARNER, "utf8"));
    const keys = uniquePracticeTestRunKeysFromRunner();
    assert.ok(keys.length >= 80, `expected many keys, got ${keys.length}`);
    const leaks: string[] = [];
    for (const key of keys) {
      const v = en[key];
      if (typeof v !== "string" || !v.trim()) {
        leaks.push(`${key}: missing`);
        continue;
      }
      if (v === key || v.includes("learner.practiceTests.run.")) {
        leaks.push(`${key}: invalid`);
      }
    }
    assert.deepEqual(leaks, []);
  });
});
