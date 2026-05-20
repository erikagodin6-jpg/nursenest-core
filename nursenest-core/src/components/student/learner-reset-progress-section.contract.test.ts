/**
 * Run: `node --import tsx --test src/components/student/learner-reset-progress-section.contract.test.ts`
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const WARN_KEYS = [
  "learner.studySettings.resetProgress.warnPermanent",
  "learner.studySettings.resetProgress.warnCannotUndo",
] as const;

describe("LearnerResetProgressSection i18n contract", () => {
  it("includes irreversible warning copy in marketing-en", () => {
    const p = path.join(process.cwd(), "../tools/i18n/marketing/marketing-en.json");
    const raw = readFileSync(p, "utf8");
    const messages = JSON.parse(raw) as Record<string, string>;
    for (const k of WARN_KEYS) {
      const v = messages[k];
      assert.ok(typeof v === "string" && v.length > 10, k);
      assert.match(v, /permanent|cannot|undo|irreversible/i, `${k} should warn permanence`);
    }
    const hint = messages["learner.studySettings.resetProgress.phraseHint"];
    assert.ok(typeof hint === "string" && hint.includes("RESET"), "phraseHint mentions RESET");
  });
});
