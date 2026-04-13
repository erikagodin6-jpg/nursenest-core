import assert from "node:assert/strict";
import test from "node:test";
import { buildPathwayLessonCoachExcerpt } from "@/lib/coach/build-pathway-lesson-coach-excerpt";
import type { PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";

function section(partial: Partial<PathwayLessonSection> & Pick<PathwayLessonSection, "id" | "body">): PathwayLessonSection {
  return {
    heading: "H",
    kind: "core",
    ...partial,
  };
}

test("buildPathwayLessonCoachExcerpt returns empty for no sections", () => {
  assert.equal(buildPathwayLessonCoachExcerpt([]), "");
});

test("buildPathwayLessonCoachExcerpt caps total length", () => {
  const huge = "x".repeat(5000);
  const sections: PathwayLessonSection[] = [
    section({ id: "1", heading: "A", body: huge }),
    section({ id: "2", heading: "B", body: huge }),
    section({ id: "3", heading: "C", body: huge }),
    section({ id: "4", heading: "D", body: "should not appear" }),
  ];
  const out = buildPathwayLessonCoachExcerpt(sections);
  assert.ok(out.length <= 6000 + 80, `length ${out.length}`);
  assert.ok(!out.includes("should not appear"));
});

test("buildPathwayLessonCoachExcerpt includes headings and truncates long bodies", () => {
  const body = "p".repeat(2500);
  const out = buildPathwayLessonCoachExcerpt([
    section({ id: "1", heading: "Intro", body }),
  ]);
  assert.match(out, /## Intro/);
  assert.match(out, /\[truncated\]/);
  assert.ok(out.length < body.length + 50);
});
