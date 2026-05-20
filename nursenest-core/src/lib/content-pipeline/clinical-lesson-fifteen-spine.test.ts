import test from "node:test";
import assert from "node:assert/strict";
import {
  CLINICAL_FIFTEEN_HEADINGS,
  assertPipelineLessonSpineHeadings,
  FIFTEEN_TO_PIPELINE_FIVE,
} from "./clinical-lesson-fifteen-spine";

test("fifteen headings partition across five pipeline kinds without overlap", () => {
  assert.equal(CLINICAL_FIFTEEN_HEADINGS.length, 15);
  const seen = new Set<string>();
  for (const kind of ["overview", "pathophysiology", "assessment", "interventions", "exam_tips"] as const) {
    for (const h of FIFTEEN_TO_PIPELINE_FIVE[kind]) {
      assert.ok(!seen.has(h), `duplicate heading ${h}`);
      seen.add(h);
    }
  }
  assert.equal(seen.size, 15);
});

test("assertPipelineLessonSpineHeadings passes for valid stub sections", () => {
  const mk = (kind: string, hs: readonly string[]) => ({
    kind,
    body: hs.map((h) => `<h2>${h}</h2><p>Topic-specific teaching.</p>`).join(""),
  });
  assert.doesNotThrow(() =>
    assertPipelineLessonSpineHeadings([
      mk("overview", FIFTEEN_TO_PIPELINE_FIVE.overview),
      mk("pathophysiology", FIFTEEN_TO_PIPELINE_FIVE.pathophysiology),
      mk("assessment", FIFTEEN_TO_PIPELINE_FIVE.assessment),
      mk("interventions", FIFTEEN_TO_PIPELINE_FIVE.interventions),
      mk("exam_tips", FIFTEEN_TO_PIPELINE_FIVE.exam_tips),
    ]),
  );
});

test("assertPipelineLessonSpineHeadings rejects banned generic phrasing", () => {
  assert.throws(() =>
    assertPipelineLessonSpineHeadings([
      {
        kind: "overview",
        body: `<h2>${FIFTEEN_TO_PIPELINE_FIVE.overview[0]}</h2><p>Read the stem as a safety problem.</p>`,
      },
      { kind: "pathophysiology", body: FIFTEEN_TO_PIPELINE_FIVE.pathophysiology.map((h) => `<h2>${h}</h2><p>x</p>`).join("") },
      { kind: "assessment", body: FIFTEEN_TO_PIPELINE_FIVE.assessment.map((h) => `<h2>${h}</h2><p>x</p>`).join("") },
      { kind: "interventions", body: FIFTEEN_TO_PIPELINE_FIVE.interventions.map((h) => `<h2>${h}</h2><p>x</p>`).join("") },
      { kind: "exam_tips", body: FIFTEEN_TO_PIPELINE_FIVE.exam_tips.map((h) => `<h2>${h}</h2><p>x</p>`).join("") },
    ]),
  );
});
