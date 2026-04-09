/**
 * Builds catalog.json lesson rows for blueprint expansion — legacy 5-section spine, pathway-accurate titles.
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

const LINK_TRIO = [
  "[Prioritization gold review](LESSON:clinical-judgment-prioritization-gold)",
  "[Sepsis recognition spine](LESSON:sepsis-early-recognition-gold)",
  "[High-alert medications](LESSON:high-alert-medications-gold)",
];

function wordy(...parts: string[]): string {
  return parts.join("\n\n");
}

function clinicalMeaning(slot: BlueprintExpansionSlot, examLabel: string): string {
  return wordy(
    `**${slot.titleStem}** anchors this lesson to the planning domain **${slot.blueprintDomain.replace(/_/g, " ")}** with teaching focus: *${slot.blueprintRole}*.`,
    `For **${examLabel}**, practice translating assessment data into the **safest next nursing action** when the stem mixes routine tasks with abnormal findings. Exams reward recognizing **trend**, **scope**, and **escalation timing**—not the longest teaching paragraph.`,
    `Connect **${slot.topic}** concepts to monitoring, reporting, and ordered interventions appropriate to your license level. When the vignette names a policy, protocol, or provider order, choose answers that **respect that frame** while protecting the client.`,
    `Use this page as a **structured rehearsal**: read once for meaning, then run a **pathway-scoped question block** filtered to related topics so rationales reinforce the same judgment pattern.`,
  );
}

function examRelevance(slot: BlueprintExpansionSlot, examLabel: string): string {
  return wordy(
    `Expect items that pair **${slot.topic}** content with **prioritization**, **infection control**, **medication safety**, or **communication**—often in the same stem.`,
    `**${examLabel}** may use country-specific units, titles, or care settings; the judgment rule is still: **stabilize first**, **verify scope**, **escalate when thresholds are crossed**.`,
    `Eliminate options that **delay assessment**, **skip monitoring**, or **expand nursing scope** beyond what the item describes.`,
  );
}

function coreConcept(slot: BlueprintExpansionSlot): string {
  return wordy(
    `**Core idea:** ${slot.blueprintRole} — keep the clinical mechanism tied to **nursing assessment and surveillance**, not independent medical diagnosis.`,
    `Translate symptoms and labs into **what changes first**, **what you report**, and **what you prepare for** (oxygen, access, frequency of vitals, isolation, safer medication administration).`,
    `When teaching appears, ensure it matches **readiness** and **cognition**; when delegation appears, match **task** to **authorized role** in the stem.`,
  );
}

function clinicalScenario(slot: BlueprintExpansionSlot, examLabel: string): string {
  return wordy(
    `You receive report on a client whose data suggest **${slot.topic}** risk is rising. Competing tasks include routine hygiene, scheduled meds, and a stable roommate—choose the action that **reduces imminent harm** for the deteriorating client.`,
    `If the stem adds **two clients**, prioritize by **instability** and **reversibility**, not task length. **${examLabel}** items often hide the urgent client behind polite requests or “routine” wording.`,
    `Document and communicate using **objective data**; avoid choosing answers that **assume** orders you do not have or **minimize** abnormal trends.`,
  );
}

function takeaways(slot: BlueprintExpansionSlot): string {
  return wordy(
    `- **Study plan:** ${slot.expansionCategory} · ${slot.blueprintDomain.replace(/_/g, " ")} · ${slot.blueprintRole}`,
    `- **Study loop:** pair this lesson with timed questions tagged around **${slot.topicSlug}**, then review rationales for **wrong-option traps** (scope, delay, teaching too early).`,
    `- **Related lessons:** ${LINK_TRIO.join(" · ")}`,
    `- **Bank drill:** filter your pathway question bank to the same topic cluster and complete a short block before revisiting this page.`,
  );
}

export function buildExpansionCatalogLesson(
  pathwayKey: "uslpn" | "carpn" | "usnp",
  slot: BlueprintExpansionSlot,
): CatalogLessonJson {
  const pathwayId =
    pathwayKey === "uslpn" ? "us-lpn-nclex-pn" : pathwayKey === "carpn" ? "ca-rpn-rex-pn" : "us-np-fnp";
  const examLabel = PATHWAY_EXPANSION_LABEL[pathwayId] ?? pathwayId;
  const slug = `bp26-${pathwayKey}-${slot.slugKey}`.replace(/-{2,}/g, "-").slice(0, 120);

  const title = `${slot.titleStem} — ${examLabel}`;
  const seoTitle = `${slot.titleStem} | NurseNest`;
  const seoDescription = `Clinical focus: ${slot.blueprintRole}. Pathway-scoped practice for ${examLabel}—exam-style prioritization, monitoring, and scope-safe actions you can rehearse with timed questions in the bank.`;

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
      { id: "clinical_meaning", heading: "Clinical meaning", kind: "clinical_meaning", body: clinicalMeaning(slot, examLabel) },
      { id: "exam_relevance", heading: "Exam relevance", kind: "exam_relevance", body: examRelevance(slot, examLabel) },
      { id: "core_concept", heading: "Core concept", kind: "core_concept", body: coreConcept(slot) },
      { id: "clinical_scenario", heading: "Clinical scenario", kind: "clinical_scenario", body: clinicalScenario(slot, examLabel) },
      { id: "takeaways", heading: "Takeaways", kind: "takeaways", body: takeaways(slot) },
    ],
  };
}
