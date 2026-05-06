/**
 * Reusable builder: map a 15-point clinical outline into the **legacy five pathway sections**
 * (`clinical_meaning`, `exam_relevance`, `core_concept`, `clinical_scenario`, `takeaways`).
 *
 * Use from expansion generators (Node .mjs) — not imported by Next.js routes.
 *
 * The 15 headings are embedded as H2 markdown inside the five bodies so teaching stays
 * topic-specific while matching existing catalog schema.
 */

/** @typedef {{ heading: string, bullets: string[] }} OutlineBlock */

/**
 * @param {object} p
 * @param {string} p.title
 * @param {string} [p.topicLine] — e.g. "Fluids, Electrolytes & Acid-Base"
 * @param {OutlineBlock} p.overview — 1. Overview + 2. Pathophysiology (merge OK)
 * @param {OutlineBlock} p.riskFactors — 3. Risk Factors
 * @param {OutlineBlock} p.signsSymptoms — 4. Signs & Symptoms
 * @param {OutlineBlock} p.assessment — 5. Assessment Priorities
 * @param {OutlineBlock} p.diagnosticsLabs — 6–7. Diagnostics + Labs
 * @param {OutlineBlock} p.treatment — 8. Treatment / Medical Management
 * @param {OutlineBlock} p.nursing — 9. Nursing Interventions
 * @param {OutlineBlock} p.complications — 10. Complications
 * @param {OutlineBlock} p.education — 11. Client Education
 * @param {OutlineBlock} p.pearls — 12. Clinical Pearls
 * @param {OutlineBlock} p.examReasoning — 13. NCLEX / Exam Reasoning (short, topic-specific)
 * @param {OutlineBlock} p.safety — 14. Safety Alerts / Red Flags
 * @param {OutlineBlock} p.summary — 15. High-Yield Summary
 */
export function clinicalLegacyFiveSectionsFromOutline(p) {
  const topic = p.topicLine?.trim() || "Clinical topic";

  const md = (blocks) =>
    blocks
      .map((b) => {
        const lines = (b.bullets ?? []).map((x) => `- ${x}`).join("\n");
        return `## ${b.heading}\n\n${lines}`;
      })
      .join("\n\n");

  const clinical_meaning = `**${p.title}** (${topic})\n\n${md([p.overview, p.riskFactors])}`;
  const exam_relevance = md([p.signsSymptoms, p.assessment]);
  const core_concept = md([p.diagnosticsLabs, p.treatment, p.nursing, p.complications]);
  const clinical_scenario = md([p.education, p.pearls, p.examReasoning, p.safety]);
  const takeaways = md([p.summary]);

  return [
    { id: "clinical_meaning", heading: "Clinical meaning", kind: "clinical_meaning", body: clinical_meaning },
    { id: "exam_relevance", heading: "Exam relevance", kind: "exam_relevance", body: exam_relevance },
    { id: "core_concept", heading: "Core concept", kind: "core_concept", body: core_concept },
    { id: "clinical_scenario", heading: "Clinical scenario", kind: "clinical_scenario", body: clinical_scenario },
    { id: "takeaways", heading: "Takeaways", kind: "takeaways", body: takeaways },
  ];
}

/** Shared patterns for audits / generators (topic-agnostic boilerplate). Keep in sync with `src/lib/content-pipeline/clinical-lesson-fifteen-spine.ts` GENERIC_EXAM_ONLY_PHRASES. */
export const GENERIC_EXAM_ONLY_PATTERNS = [
  /\bread the stem as a safety problem\b/i,
  /\bpicture one client whose data forces a fork\b/i,
  /\banchor pathophysiology to assessment findings\b/i,
];
