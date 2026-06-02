/**
 * Static guards for marketing pathway lesson hub UX — duplicate rails and compact bottom nav.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

const MARKETING_HUB_SOURCES = [
  "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx",
  "src/components/pathway-lessons/marketing-lessons-hub-category-first-index.tsx",
  "src/components/pathway-lessons/marketing-lessons-hub-category-lessons-surface.tsx",
];

test("marketing lessons hub sources omit duplicate StudyModeCards / Other ways rail", () => {
  for (const rel of MARKETING_HUB_SOURCES) {
    const src = readFileSync(join(repoRoot, rel), "utf8");
    assert.ok(!src.includes("StudyModeCards"), `${rel} must not reference StudyModeCards`);
    assert.ok(!src.includes("Other ways to study"), `${rel} must not show duplicate study heading`);
  }
});

test("primary lessons route passes compact StudyBottomNav", () => {
  const mainPage = readFileSync(
    join(repoRoot, "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx"),
    "utf8",
  );
  assert.ok(mainPage.includes("<StudyBottomNav"));
  assert.ok(/<StudyBottomNav[\s\S]*?compact/.test(mainPage), "StudyBottomNav should use compact spacing");
});

test("LessonsPageShell keeps marketing hub wrapper hook", () => {
  const shell = readFileSync(join(repoRoot, "src/components/pathway-lessons/lessons-page-shell.tsx"), "utf8");
  assert.ok(shell.includes('data-nn-lessons-marketing-hub="1"'));
});
