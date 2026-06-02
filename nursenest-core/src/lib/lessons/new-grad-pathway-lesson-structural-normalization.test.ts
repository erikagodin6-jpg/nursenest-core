import assert from "node:assert/strict";
import { test } from "node:test";
import { applyNewGradStructuralCompletion } from "@/lib/lessons/new-grad-pathway-lesson-structural-normalization";
import type { PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";

function section(kind: PathwayLessonSection["kind"], heading: string, body: string): PathwayLessonSection {
  return {
    id: kind,
    kind,
    heading,
    body,
  };
}

test("new grad structural completion synthesizes red flags from authored sections", () => {
  const sections: PathwayLessonSection[] = [
    section(
      "signs_symptoms",
      "Signs & Symptoms",
      "Early deterioration shows up as subtle restlessness, tachycardia, rising oxygen needs, new diaphoresis, or a patient who simply looks worse than report suggested. Those cues matter because new grads are often seeing the patient for the first time and cannot assume the prior shift already ruled them out.",
    ),
    section(
      "clinical_decision_making",
      "Clinical priorities",
      "Reassess at the bedside, compare to the last reliable baseline, apply ABCs, bring in the charge nurse early, and escalate when the story and the monitor do not line up. A quiet patient can still be the unstable patient, so escalation beats waiting for a cleaner trend.",
    ),
    section(
      "complications",
      "Complications",
      "If missed, the patient may progress to hypotension, respiratory failure, delayed sepsis treatment, or a preventable rapid response. The bedside cost of delay is almost always greater than the social cost of asking for help too soon.",
    ),
    section(
      "tier_specific_relevance",
      "Exam focus",
      "NCLEX-style items reward recognizing instability early, protecting airway and breathing, and escalating with clear priorities instead of finishing lower-value tasks first.",
    ),
    section(
      "related_next_steps",
      "Next steps",
      "Review matching flashcards, practice questions, and linked bedside follow-up lessons after this topic.",
    ),
  ];

  const completed = applyNewGradStructuralCompletion({
    lessonSlug: "ngn-test",
    title: "Knowing when to escalate",
    pathwayId: "us-rn-new-grad-transition",
    sections,
  });

  const redFlags = completed.sections.find((candidate) => candidate.kind === "red_flags");
  assert.ok(redFlags);
  assert.match(redFlags.body, /ABCs|airway|breathing|escalation/i);
  assert.ok(redFlags.body.trim().split(/\s+/).length >= 80);
});
