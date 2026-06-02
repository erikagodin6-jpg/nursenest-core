import test from "node:test";
import assert from "node:assert/strict";
import type { PathwayLessonSectionKind } from "@/lib/lessons/pathway-lesson-types";
import { lessonBodyPresentationClass } from "@/lib/ui/lesson-body-presentation";
import { getLessonSectionTheme } from "@/lib/ui/lesson-section-theme";

/** Spot-check across premium, legacy, and extended clinical kinds (extend when the union grows). */
const PRESENTATION_THEME_SPOT_KINDS = [
  "introduction",
  "labs_diagnostics",
  "clinical_manifestations",
  "treatment_management",
  "exam_focus",
  "core",
] as const satisfies readonly PathwayLessonSectionKind[];

test("lesson section presentation + theme: spot kinds stay wired", () => {
  for (const k of PRESENTATION_THEME_SPOT_KINDS) {
    const cls = lessonBodyPresentationClass(k);
    assert.match(cls, /^nn-lesson-body--/, `body class for ${k}`);
    const theme = getLessonSectionTheme(k);
    assert.ok(theme.lessonToken.startsWith("--lesson-"), `lesson token for ${k}`);
    assert.match(theme.accent, /^var\(--lesson-[a-z-]+-accent\)$/, `theme accent token for ${k}`);
    assert.doesNotMatch(theme.accent, /#[0-9a-f]{3,8}/i, `no raw accent color for ${k}`);
    assert.equal(theme.dataRole, theme.role);
  }
});

test("getLessonSectionTheme: diagnostic + danger roles for labs and complications", () => {
  assert.equal(getLessonSectionTheme("labs_diagnostics").role, "diagnostic");
  assert.equal(getLessonSectionTheme("complications").role, "danger");
  assert.equal(getLessonSectionTheme("clinical_pearls").chipLabel, "Clinical Pearls");
});
