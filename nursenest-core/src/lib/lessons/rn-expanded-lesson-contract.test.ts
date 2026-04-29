import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  RN_EXPAND_FLASHCARD_PROMPT_MIN,
  RN_EXPAND_SECTION_WORD_MIN,
  RN_EXPAND_TOTAL_WORD_MIN,
  sectionKindsNeedingRegeneration,
  validateExpandedLesson,
} from "@/lib/lessons/rn-expanded-lesson-contract";
import type { PathwayLessonRecord, PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";

const filler = (n: number) => "word ".repeat(n).trim();

function sec(kind: string, words: number, bodyExtra = ""): PathwayLessonSection {
  const body = `${bodyExtra} ${filler(words)}`.trim();
  return {
    id: kind,
    kind: kind as PathwayLessonSection["kind"],
    heading: kind,
    body,
  };
}

/** Minimal bodies that satisfy clinical regexes for all 12 kinds (very dense stubs). */
function clinicalStubs(): Record<string, string> {
  return {
    introduction: `why it matters for nurses. ${filler(160)}`,
    pathophysiology_overview: `cellular injury drives dysfunction. receptor signaling and inflammatory mediators amplify tissue damage. ${filler(
      200,
    )}`,
    signs_symptoms: `early fatigue appears first. late red flag hypotension develops because perfusion fails. ${filler(200)}`,
    labs_diagnostics: `troponin >0.04 ng/mL is abnormal and critical when rising. diagnostic imaging confirms. ${filler(200)}`,
    treatments: `oxygen therapy and fluid boluses are medical procedures with rationale because perfusion is the goal. ${filler(200)}`,
    pharmacology: `beta-blocker metformin class: mechanism inhibits adrenergic drive; monitor for adverse effects and contraindications to diuretics. ${filler(
      200,
    )}`,
    nursing_assessment_interventions: `monitor vitals hourly because instability prevents harm; escalate and notify provider; call rapid response if needed. ${filler(
      200,
    )}`,
    clinical_decision_making: `priority first: ABC airway breathing circulation; notify team via SBAR; rapid response if unstable. ${filler(200)}`,
    complications: `acute kidney injury may occur; chronic heart failure develops; monitor labs and escalate if worsening; report changes. ${filler(200)}`,
    clinical_pearls: `common trap: confused with anxiety; never delay care; mnemonic memory pearl for exams. ${filler(200)}`,
    client_education: `teach-back confirms understanding. call 911 for crushing chest pain. call provider clinic for fever; seek help if worse. ${filler(200)}`,
    case_study: `BP 88/52 HR 118 SpO2 92 temperature 38.2C. first priority airway support. rationale for each step. ${filler(200)}`,
  };
}

function basePassingLesson(): Pick<PathwayLessonRecord, "slug" | "title" | "sections" | "linked_flashcard_prompts"> {
  const stubs = clinicalStubs();
  const sections: PathwayLessonSection[] = [
    ...Object.entries(stubs).map(([k, b]) => sec(k, RN_EXPAND_SECTION_WORD_MIN + 20, b)),
    sec("linked_flashcard_prompts", 50, ""),
  ];
  const prompts = Array.from(
    { length: RN_EXPAND_FLASHCARD_PROMPT_MIN + 1 },
    (_, i) => `Recall nursing priority number ${i + 1} for this topic with clinical detail`,
  );
  return {
    slug: "test-lesson",
    title: "Sepsis recognition",
    sections,
    linked_flashcard_prompts: prompts,
  };
}

describe("validateExpandedLesson", () => {
  it("passes a fully valid lesson", () => {
    const v = validateExpandedLesson(basePassingLesson());
    assert.equal(v.pass, true);
    assert.ok(v.totalWords >= RN_EXPAND_TOTAL_WORD_MIN);
    assert.equal(v.missingSections.length, 0);
    assert.equal(v.thinSections.length, 0);
    assert.equal(v.missingClinicalRequirements.length, 0);
    assert.ok(v.flashcardPromptCount >= RN_EXPAND_FLASHCARD_PROMPT_MIN);
    assert.equal(v.flashcardPromptErrors.length, 0);
  });

  it("fails when a required section is missing", () => {
    const good = basePassingLesson();
    const sections = (good.sections ?? []).filter((s) => s.kind !== "introduction");
    const v = validateExpandedLesson({ ...good, sections });
    assert.equal(v.pass, false);
    assert.ok(v.missingSections.includes("introduction"));
  });

  it("fails when a section is thin", () => {
    const good = basePassingLesson();
    const stubs = clinicalStubs();
    const sections = (good.sections ?? []).map((s) =>
      s.kind === "introduction"
        ? { ...s, body: `${stubs.introduction} ${filler(20)}` }
        : s,
    );
    const v = validateExpandedLesson({ ...good, sections });
    assert.equal(v.pass, false);
    assert.ok(v.thinSections.some((t) => t.kind === "introduction"));
  });

  it("fails when clinical requirement missing", () => {
    const good = basePassingLesson();
    const sections = (good.sections ?? []).map((s) =>
      s.kind === "pathophysiology_overview" ? { ...s, body: filler(RN_EXPAND_SECTION_WORD_MIN + 30) } : s,
    );
    const v = validateExpandedLesson({ ...good, sections });
    assert.equal(v.pass, false);
    assert.ok(v.missingClinicalRequirements.some((m) => m.kind === "pathophysiology_overview"));
  });

  it("fails when fewer than 8 valid flashcard prompts", () => {
    const good = basePassingLesson();
    const v = validateExpandedLesson({
      ...good,
      linked_flashcard_prompts: ["short", "x"],
    });
    assert.equal(v.pass, false);
    assert.ok(v.flashcardPromptErrors.length > 0);
  });

  it("passes with exactly 8 valid flashcard strings", () => {
    const good = basePassingLesson();
    const prompts = Array.from({ length: 8 }, (_, i) => `Detailed recall prompt ${i} for sepsis care planning`);
    const v = validateExpandedLesson({ ...good, linked_flashcard_prompts: prompts });
    assert.equal(v.pass, true);
    assert.equal(v.flashcardPromptCount, 8);
  });

  it("sectionKindsNeedingRegeneration includes missing kinds and excludes passing introduction", () => {
    const v = validateExpandedLesson({
      slug: "x",
      title: "t",
      sections: [sec("introduction", 200, "why it matters here.")],
      linked_flashcard_prompts: [],
    });
    const kinds = sectionKindsNeedingRegeneration(v);
    assert.ok(kinds.includes("pathophysiology_overview"));
    assert.equal(kinds.includes("introduction"), false);
  });
});
