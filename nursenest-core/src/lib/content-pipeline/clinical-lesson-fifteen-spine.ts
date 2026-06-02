/**
 * Fifteen-point clinical teaching spine — shared by AI prompts and offline builders.
 * Catalog JSON often stores legacy five or short-form four; pipeline output uses five AI kinds.
 * Bodies must still embed these headings (as <h2> titles) so teaching stays scannable and auditable.
 */

export const GENERIC_EXAM_ONLY_PHRASES = [
  "read the stem as a safety problem",
  "picture one client whose data forces a fork",
  "anchor pathophysiology to assessment findings",
] as const;

/** Markdown-style labels used inside HTML `<h2>` blocks in generated bodies. */
export const CLINICAL_FIFTEEN_HEADINGS = [
  "1. Overview",
  "2. Pathophysiology",
  "3. Risk factors",
  "4. Signs & symptoms (early, late, red flags)",
  "5. Assessment priorities",
  "6. Diagnostics",
  "7. Labs & monitoring",
  "8. Treatment / medical management",
  "9. Nursing interventions",
  "10. Complications",
  "11. Client education",
  "12. Clinical pearls",
  "13. NCLEX / exam reasoning",
  "14. Safety alerts / red flags",
  "15. High-yield summary",
] as const;

/**
 * How the fifteen headings partition into the five pipeline section kinds (AI / import path).
 * Each pipeline section body must contain exactly these <h2> titles in order (no duplicates across sections).
 */
export const FIFTEEN_TO_PIPELINE_FIVE: Record<
  "overview" | "pathophysiology" | "assessment" | "interventions" | "exam_tips",
  readonly (typeof CLINICAL_FIFTEEN_HEADINGS)[number][]
> = {
  overview: ["1. Overview"],
  pathophysiology: ["2. Pathophysiology", "3. Risk factors"],
  assessment: [
    "4. Signs & symptoms (early, late, red flags)",
    "5. Assessment priorities",
    "6. Diagnostics",
    "7. Labs & monitoring",
  ],
  interventions: [
    "8. Treatment / medical management",
    "9. Nursing interventions",
    "10. Complications",
    "11. Client education",
  ],
  exam_tips: ["12. Clinical pearls", "13. NCLEX / exam reasoning", "14. Safety alerts / red flags", "15. High-yield summary"],
};

export function pipelineFiveSpineInstructionBlock(): string {
  const lines = (
    [
      "overview",
      "pathophysiology",
      "assessment",
      "interventions",
      "exam_tips",
    ] as const
  ).map((kind) => {
    const hs = FIFTEEN_TO_PIPELINE_FIVE[kind].join("; ");
    return `- kind "${kind}": include <h2> sections exactly titled: ${hs} (use those strings as element text).`;
  });
  return [
    "Clinical spine (mandatory): each section body is HTML using <p>, <ul>, <li>, <strong>, <em>, and <h2> only for the numbered headings below.",
    "Under every <h2>, write topic-specific teaching (mechanisms, expected findings, concrete interventions) — not generic test-taking filler in clinical blocks (1–11).",
    ...lines,
    `In "exam_tips" (12–15), keep strategy concise; 12–14 must still name topic-specific traps, labs, and escalation cues.`,
    `Never use these phrases anywhere: ${GENERIC_EXAM_ONLY_PHRASES.map((p) => JSON.stringify(p)).join(", ")}.`,
  ].join("\n");
}

const PIPELINE_KIND_ORDER = [
  "overview",
  "pathophysiology",
  "assessment",
  "interventions",
  "exam_tips",
] as const;

export type PipelineFiveSectionKind = (typeof PIPELINE_KIND_ORDER)[number];

export function assertPipelineLessonSpineHeadings(sections: Array<{ kind: string; body: string }>): void {
  for (const kind of PIPELINE_KIND_ORDER) {
    const sec = sections.find((s) => s.kind === kind);
    if (!sec) throw new Error(`Missing pipeline section kind "${kind}"`);
    const required = FIFTEEN_TO_PIPELINE_FIVE[kind];
    for (const h of required) {
      if (!sec.body.includes(h)) {
        throw new Error(
          `Lesson section "${kind}" must include an <h2> whose text is exactly "${h}" (substring match failed).`,
        );
      }
    }
  }
  const banned = GENERIC_EXAM_ONLY_PHRASES.filter((p) =>
    sections.some((s) => s.body.toLowerCase().includes(p)),
  );
  if (banned.length > 0) {
    throw new Error(`Banned generic-only phrasing present: ${banned.join(", ")}`);
  }
}
