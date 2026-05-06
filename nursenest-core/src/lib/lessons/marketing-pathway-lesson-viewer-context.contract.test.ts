/**
 * Ensures marketing pathway lesson detail resolves the signed-in viewer (not a hardcoded anonymous id).
 *
 * Run: `node --import tsx --test src/lib/lessons/marketing-pathway-lesson-viewer-context.contract.test.ts`
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BODY = path.join(
  HERE,
  "..",
  "..",
  "app",
  "(marketing)",
  "(default)",
  "[locale]",
  "[slug]",
  "[examCode]",
  "lessons",
  "[lessonSlug]",
  "pathway-lesson-detail-page-body.tsx",
);
const LEARNER_LESSON = path.join(
  HERE,
  "..",
  "..",
  "app",
  "(student)",
  "app",
  "(learner)",
  "lessons",
  "[id]",
  "page.tsx",
);

describe("marketing pathway lesson viewer context", () => {
  it("loads viewer context from the shared server helper instead of forcing anonymous entitlements", () => {
    const src = fs.readFileSync(BODY, "utf8");
    assert.match(src, /loadMarketingPathwayLessonViewerContext/);
    assert.ok(!src.includes('const userId = ""'), "must not hardcode anonymous userId");
  });

  it("keeps learner /app/lessons/[id] on resolveEntitlementForPage with real user id", () => {
    const src = fs.readFileSync(LEARNER_LESSON, "utf8");
    assert.match(src, /resolveEntitlementForPage\(\s*userId\s*\)/);
  });
});
