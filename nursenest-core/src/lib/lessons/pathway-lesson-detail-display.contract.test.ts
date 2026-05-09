import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";
import {
  pathwayLessonSectionHasRenderableTeachingContent,
  sortPathwayLessonSectionsForClinicalDisplay,
} from "@/lib/lessons/pathway-lesson-detail-display";

function section(id: string, kind: PathwayLessonSection["kind"], body = ""): PathwayLessonSection {
  return {
    id,
    heading: "H",
    kind,
    body,
  };
}

describe("pathway lesson detail display (Phase 6)", () => {
  it("sortPathwayLessonSectionsForClinicalDisplay orders spine blocks before related_next_steps", () => {
    const sorted = sortPathwayLessonSectionsForClinicalDisplay([
      section("a", "related_next_steps", "next"),
      section("b", "signs_symptoms", "signs"),
      section("c", "labs_diagnostics", "labs"),
    ]);
    assert.deepEqual(
      sorted.map((s) => s.kind),
      ["signs_symptoms", "labs_diagnostics", "related_next_steps"],
    );
  });

  it("sortPathwayLessonSectionsForClinicalDisplay is stable when weights tie", () => {
    const input = [section("1", "intro", "a"), section("2", "intro", "b")];
    const sorted = sortPathwayLessonSectionsForClinicalDisplay(input);
    assert.deepEqual(
      sorted.map((s) => s.id),
      ["1", "2"],
    );
  });

  it("pathwayLessonSectionHasRenderableTeachingContent rejects empty prose-only sections", () => {
    assert.equal(
      pathwayLessonSectionHasRenderableTeachingContent({
        section: section("z", "signs_symptoms", "   \n\n  "),
        resolvedBodyText: "   \n\n  ",
        viewerTier: null,
        measurementSystem: null,
      }),
      false,
    );
  });

  it("pathwayLessonSectionHasRenderableTeachingContent accepts examFocus-only sections", () => {
    assert.equal(
      pathwayLessonSectionHasRenderableTeachingContent({
        section: {
          ...section("z", "exam_focus", ""),
          examFocus: { howTested: "labs love this" },
        },
        resolvedBodyText: "",
        viewerTier: null,
        measurementSystem: null,
      }),
      true,
    );
  });

  it("pathwayLessonSectionHasRenderableTeachingContent treats learner linked-next-steps as always teaching when card rail is on", () => {
    assert.equal(
      pathwayLessonSectionHasRenderableTeachingContent({
        section: section("n", "related_next_steps", ""),
        resolvedBodyText: "",
        viewerTier: null,
        measurementSystem: null,
        linkedNextStepsUsesCardRail: true,
      }),
      true,
    );
  });
});
