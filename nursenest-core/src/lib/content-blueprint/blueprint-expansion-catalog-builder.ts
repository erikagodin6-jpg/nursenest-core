/**
 * Builds catalog.json lesson rows for blueprint expansion — legacy five-section spine with an
 * embedded fifteen-point outline (## headings) so lessons align with the platform clinical spine.
 * Copy is pathway- and slot-scoped; editorial or AI passes should still deepen disease-specific facts.
 */
import type { BlueprintExpansionSlot } from "@/lib/content-blueprint/blueprint-expansion-wave-2026";
import { PATHWAY_EXPANSION_LABEL } from "@/lib/content-blueprint/blueprint-expansion-wave-2026";

type CatalogLessonJson = {
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  previewSectionCount: number;
  seoTitle: string;
  seoDescription: string;
  sections: Array<{
    id: string;
    heading: string;
    kind: string;
    body: string;
  }>;
};

function h2(title: string, body: string): string {
  return `## ${title}\n\n${body.trim()}\n\n`;
}

function clinicalMeaningBody(slot: BlueprintExpansionSlot, examLabel: string, domainLabel: string): string {
  return (
    h2(
      "1. Overview",
      `**${slot.titleStem}** frames **${slot.topic}** inside **${domainLabel}** for **${examLabel}**. The nursing focus is how **${slot.blueprintRole}** changes what you monitor, report, and prepare for when data drift from baseline.`,
    ) +
    h2(
      "2. Pathophysiology",
      `Relate **${slot.topic}** to mechanisms that show up in **${slot.bodySystem}** care: perfusion, inflammation, workload, neurohumoral stress, infection, or metabolic demand—use mechanisms that apply to this topic family and name what worsens versus stabilizes.`,
    ) +
    h2(
      "3. Risk factors",
      `Client and care-delivery risks that travel with **${slot.topic}** items: extremes of age, cardiopulmonary comorbidity, infection, polypharmacy, access barriers, acute-on-chronic illness, handoff gaps, delayed diagnostics, and scope confusion. Tie each risk to what you recheck after interventions.`,
    )
  ).trim();
}

function examRelevanceBody(slot: BlueprintExpansionSlot, examLabel: string): string {
  return (
    h2(
      "4. Signs & symptoms (early, late, red flags)",
      `Early cues are subtle trends in vitals, cognition, perfusion, work of breathing, pain, or output that match **${slot.topic}**. Late or hard-stop findings should trigger reassessment, notification, or escalation—describe them as concrete data patterns, not vague instability.`,
    ) +
    h2(
      "5. Assessment priorities",
      `Layer **${slot.bodySystem}**-specific assessment on top of ABC stability: focused exam clusters, vitals cadence, intake/output, neuro checks, wound or skin surveillance, glucose trends, infection screens, and safety risks. State what you compare to baseline and what you document before calling.`,
    )
  ).trim();
}

function coreConceptBody(slot: BlueprintExpansionSlot, examLabel: string): string {
  return (
    h2(
      "6. Diagnostics",
      `First-line diagnostics commonly paired with **${slot.topic}** in this domain (labs, ECG, imaging, scores, cultures). Keep scope nursing-appropriate: preparation, timing, specimen integrity, pre-procedure teaching, and how results change surveillance.`,
    ) +
    h2(
      "7. Labs & monitoring",
      `Labs and POC checks that usually move management: electrolytes, renal/hepatic panels, troponin/BNP, lactate, ABG/VBG, coags, CBC, cultures, and drug levels when relevant. Include trending rules when instability is implied.`,
    ) +
    h2(
      "8. Treatment / medical management",
      `Provider-directed therapies learners must recognize for **${examLabel}** stems: airway support classes, fluid strategies, anti-infectives, vasoactive families, antidotes, procedures, consult triggers—emphasize indications, contraindications nurses surface, and pre-administration checks without inventing doses.`,
    ) +
    h2(
      "9. Nursing interventions",
      `Independent and interdependent actions: monitoring cadence, positioning, airway adjunct readiness, dysrhythmia surveillance, sepsis bundle elements within scope, medication safety, isolation PPE, wound care, glycemic protocols, falls and infection prevention, therapeutic communication.`,
    ) +
    h2(
      "10. Complications",
      `Complications that extend stay, cause readmission, or create sentinel events for **${slot.topic}**: missed deterioration, bleeding, electrolyte catastrophe, respiratory failure, AKI, delirium, thrombosis, pressure injury, iatrogenic harm. Pair each with early detection and first-line nursing response.`,
    )
  ).trim();
}

function clinicalScenarioBody(slot: BlueprintExpansionSlot, examLabel: string, domainLabel: string): string {
  return (
    h2(
      "11. Client education",
      `Teach-back after discharge or during chronic management: warning signs to report, medication adherence cues, activity and wound care, follow-up testing, when to call emergency services versus clinic, neutral language for low health literacy.`,
    ) +
    h2(
      "12. Clinical pearls",
      `High-signal differentiators for **${slot.topic}** in **${domainLabel}**: look-alike findings that fork management, distractors that violate scope or delay monitoring, three-item anchors tied to this body system.`,
    ) +
    h2(
      "13. NCLEX / exam reasoning",
      `For **${examLabel}**, expect stems that fuse **${slot.blueprintRole}** with communication, infection control, medication safety, or delegation. Choose answers that use objective data, respect orders in the stem, and escalate when thresholds are crossed—name topic-specific forks (labs, vitals, timing) instead of abstract test hacks.`,
    ) +
    h2(
      "14. Safety alerts / red flags",
      `Hard stops for this blueprint: airway compromise patterns, ischemic equivalents, sepsis suspicion clusters, suicide or self-harm escalation, domestic safety, transfusion or high-alert medication hazards, and **${slot.topic}**-specific do-not-miss cues.`,
    )
  ).trim();
}

function takeawaysBody(slot: BlueprintExpansionSlot, domainLabel: string): string {
  return h2(
    "15. High-yield summary",
    `- **Topic:** ${slot.topic} · **Domain:** ${domainLabel} · **Lens:** ${slot.blueprintRole}\n- **Study loop:** read this spine, run a timed block filtered to **${slot.topicSlug}**, rewrite misses into a three-bullet escalation checklist.\n- **Next:** browse adjacent lessons in **${slot.bodySystem}** to reinforce differential clusters for ${slot.expansionCategory}.`,
  ).trim();
}

export function buildExpansionCatalogLesson(
  pathwayKey: "uslpn" | "carpn" | "usnp",
  slot: BlueprintExpansionSlot,
): CatalogLessonJson {
  const pathwayId =
    pathwayKey === "uslpn" ? "us-lpn-nclex-pn" : pathwayKey === "carpn" ? "ca-rpn-rex-pn" : "us-np-fnp";
  const examLabel = PATHWAY_EXPANSION_LABEL[pathwayId] ?? pathwayId;
  const slug = `bp26-${pathwayKey}-${slot.slugKey}`.replace(/-{2,}/g, "-").slice(0, 120);
  const domainLabel = slot.blueprintDomain.replace(/_/g, " ");

  const title = `${slot.titleStem} — ${examLabel}`;
  const seoTitle = `${slot.titleStem} | NurseNest`;
  const seoDescription = `Clinical spine for ${slot.topic}: ${slot.blueprintRole}. Pathway-scoped ${examLabel} lesson with assessment, diagnostics, interventions, and safety cues—deepen with question bank drills.`;

  return {
    slug,
    title,
    topic: slot.topic,
    topicSlug: slot.topicSlug,
    bodySystem: slot.bodySystem,
    previewSectionCount: 2,
    seoTitle,
    seoDescription,
    sections: [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: clinicalMeaningBody(slot, examLabel, domainLabel),
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: examRelevanceBody(slot, examLabel),
      },
      { id: "core_concept", heading: "Core concept", kind: "core_concept", body: coreConceptBody(slot, examLabel) },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: clinicalScenarioBody(slot, examLabel, domainLabel),
      },
      { id: "takeaways", heading: "Takeaways", kind: "takeaways", body: takeawaysBody(slot, domainLabel) },
    ],
  };
}
