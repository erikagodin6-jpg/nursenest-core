import "../src/lib/db/env-bootstrap";

import { ContentStatus, type Prisma } from "@prisma/client";
import { prisma } from "../src/lib/db";
import { runLessonCompletionBatch } from "../src/lib/lessons/lesson-batch-completion";

type Domain = "cardiovascular" | "respiratory" | "renal" | "endocrine" | "neuro" | "sepsis" | "fluids_electrolytes";

type HighYieldTopic = {
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  domain: Domain;
  synopsis: string;
};

const PATHWAY_ID = "us-rn-nclex-rn";
const PATHWAY_LOCALE = "en";
const CREATE_MAX = 20;
const UPGRADE_MAX = 20;

const HIGH_YIELD_CREATE_PLAN: HighYieldTopic[] = [
  {
    slug: "early-vs-late-shock",
    title: "Early vs Late Shock: Recognition and Priorities (NCLEX-RN, US)",
    topic: "Shock Stages",
    topicSlug: "shock-stages",
    bodySystem: "Cardiovascular",
    domain: "cardiovascular",
    synopsis: "Compare compensated vs decompensated shock with bedside cues, lactate trends, perfusion findings, and escalation priorities.",
  },
  {
    slug: "shock-states-comparison",
    title: "Shock States Comparison: Hypovolemic, Cardiogenic, Obstructive, Distributive",
    topic: "Shock States",
    topicSlug: "shock-states-comparison",
    bodySystem: "Cardiovascular",
    domain: "cardiovascular",
    synopsis: "Differentiate shock etiologies using preload/afterload/contractility patterns and first-line stabilization actions.",
  },
  {
    slug: "hemodynamics-bedside-interpretation",
    title: "Hemodynamics at the Bedside: MAP, SVR, CO, and Perfusion",
    topic: "Hemodynamics",
    topicSlug: "hemodynamics-bedside-interpretation",
    bodySystem: "Cardiovascular",
    domain: "cardiovascular",
    synopsis: "Interpret bedside hemodynamic markers to decide fluid, vasopressor, and inotrope priorities.",
  },
  {
    slug: "sepsis-recognition-and-bundles",
    title: "Sepsis Recognition and Bundle Timing Priorities",
    topic: "Sepsis",
    topicSlug: "sepsis-recognition-and-bundles",
    bodySystem: "Infection",
    domain: "sepsis",
    synopsis: "Recognize evolving sepsis/septic shock and execute timed bundle actions with safety-focused reassessment.",
  },
  {
    slug: "oxygenation-failure-patterns",
    title: "Oxygenation Failure Patterns: V/Q Mismatch, Shunt, and Diffusion",
    topic: "Oxygenation",
    topicSlug: "oxygenation-failure-patterns",
    bodySystem: "Respiratory",
    domain: "respiratory",
    synopsis: "Connect oxygenation physiology to SpO2 trends, ABG changes, and escalation from oxygen devices to ventilatory support.",
  },
  {
    slug: "cardiac-emergencies-first-hour",
    title: "Cardiac Emergencies: First-Hour Prioritization",
    topic: "Cardiac Emergencies",
    topicSlug: "cardiac-emergencies-first-hour",
    bodySystem: "Cardiovascular",
    domain: "cardiovascular",
    synopsis: "Prioritize immediate actions for unstable arrhythmias, ACS deterioration, and cardiogenic compromise.",
  },
  {
    slug: "renal-emergencies-hyperkalemia-aki",
    title: "Renal Emergencies: Hyperkalemia, AKI Deterioration, and Uremic Risk",
    topic: "Renal Emergencies",
    topicSlug: "renal-emergencies-hyperkalemia-aki",
    bodySystem: "Renal",
    domain: "renal",
    synopsis: "Identify emergent renal deterioration patterns and perform time-sensitive interventions to prevent arrest and irreversible injury.",
  },
  {
    slug: "endocrine-crises-rapid-differentiation",
    title: "Endocrine Crises: Rapid Differentiation and Stabilization",
    topic: "Endocrine Crises",
    topicSlug: "endocrine-crises-rapid-differentiation",
    bodySystem: "Endocrine",
    domain: "endocrine",
    synopsis: "Distinguish DKA/HHS, thyroid storm/myxedema, and adrenal crisis using hallmark findings and treatment sequence.",
  },
  {
    slug: "neuro-deterioration-escalation",
    title: "Neuro Deterioration: Escalation Triggers and Time-Critical Actions",
    topic: "Neuro Deterioration",
    topicSlug: "neuro-deterioration-escalation",
    bodySystem: "Neurologic",
    domain: "neuro",
    synopsis: "Use neuro trend data to detect deterioration early and escalate before herniation, status epilepticus, or airway failure.",
  },
  {
    slug: "acid-base-disorders-rapid-interpretation",
    title: "Acid-Base Disorders: Rapid Interpretation and Priority Response",
    topic: "Acid-Base Disorders",
    topicSlug: "acid-base-disorders-rapid-interpretation",
    bodySystem: "Renal",
    domain: "fluids_electrolytes",
    synopsis: "Interpret pH, PaCO2, and HCO3 patterns quickly and link each disturbance to immediate nursing decisions.",
  },
  {
    slug: "fluids-and-electrolytes-danger-patterns",
    title: "Fluids and Electrolytes: Danger Patterns and Escalation Cues",
    topic: "Fluids and Electrolytes",
    topicSlug: "fluids-and-electrolytes-danger-patterns",
    bodySystem: "Renal",
    domain: "fluids_electrolytes",
    synopsis: "Identify high-risk electrolyte and fluid shifts and prioritize interventions that prevent neurologic and cardiac collapse.",
  },
  {
    slug: "vasopressor-selection-and-safety",
    title: "Vasopressor Selection and Safety Monitoring",
    topic: "Vasopressors",
    topicSlug: "vasopressor-selection-and-safety",
    bodySystem: "Cardiovascular",
    domain: "cardiovascular",
    synopsis: "Choose and monitor vasopressors based on shock pattern while preventing ischemia, arrhythmia, and extravasation harm.",
  },
  {
    slug: "lactate-and-perfusion-trending",
    title: "Lactate and Perfusion Trending in Unstable Patients",
    topic: "Perfusion Trends",
    topicSlug: "lactate-and-perfusion-trending",
    bodySystem: "Cardiovascular",
    domain: "sepsis",
    synopsis: "Use serial perfusion markers to evaluate response to resuscitation and detect ongoing occult shock.",
  },
  {
    slug: "respiratory-failure-escalation-ladder",
    title: "Respiratory Failure Escalation Ladder: Oxygen Device to Ventilator",
    topic: "Respiratory Failure",
    topicSlug: "respiratory-failure-escalation-ladder",
    bodySystem: "Respiratory",
    domain: "respiratory",
    synopsis: "Escalate support logically from low-flow oxygen to invasive ventilation using work-of-breathing and gas-exchange cues.",
  },
  {
    slug: "septic-vs-cardiogenic-shock-differentiation",
    title: "Septic vs Cardiogenic Shock: Bedside Differentiation",
    topic: "Shock Differentiation",
    topicSlug: "septic-vs-cardiogenic-shock-differentiation",
    bodySystem: "Cardiovascular",
    domain: "sepsis",
    synopsis: "Differentiate septic and cardiogenic shock in unstable patients to avoid harmful fluid or vasoactive missteps.",
  },
  {
    slug: "hyperkalemia-ecg-and-emergent-treatment",
    title: "Hyperkalemia: ECG Changes and Emergent Treatment Sequence",
    topic: "Hyperkalemia Emergencies",
    topicSlug: "hyperkalemia-ecg-and-emergent-treatment",
    bodySystem: "Renal",
    domain: "renal",
    synopsis: "Recognize hyperkalemic ECG progression and execute membrane stabilization, intracellular shift, and elimination strategies.",
  },
  {
    slug: "hypoglycemia-vs-hyperglycemia-priority-response",
    title: "Hypoglycemia vs Hyperglycemia: Priority Response Framework",
    topic: "Glycemic Emergencies",
    topicSlug: "hypoglycemia-vs-hyperglycemia-priority-response",
    bodySystem: "Endocrine",
    domain: "endocrine",
    synopsis: "Differentiate dangerous glycemic states and prioritize interventions that restore perfusion and neurologic safety.",
  },
  {
    slug: "intracranial-pressure-escalation-pathway",
    title: "Increased Intracranial Pressure: Escalation Pathway",
    topic: "Increased ICP",
    topicSlug: "intracranial-pressure-escalation-pathway",
    bodySystem: "Neurologic",
    domain: "neuro",
    synopsis: "Track rising ICP patterns and apply staged interventions to reduce secondary brain injury and herniation risk.",
  },
  {
    slug: "fluid-resuscitation-initial-vs-reassessment",
    title: "Fluid Resuscitation: Initial Bolus vs Reassessment-Driven Strategy",
    topic: "Fluid Resuscitation",
    topicSlug: "fluid-resuscitation-initial-vs-reassessment",
    bodySystem: "Renal",
    domain: "fluids_electrolytes",
    synopsis: "Balance initial resuscitation with dynamic reassessment to avoid under-resuscitation and fluid overload harms.",
  },
  {
    slug: "abg-acid-base-and-compensation-patterns",
    title: "ABG Compensation Patterns: What to Act on First",
    topic: "ABG Compensation",
    topicSlug: "abg-acid-base-and-compensation-patterns",
    bodySystem: "Respiratory",
    domain: "respiratory",
    synopsis: "Interpret compensation patterns and identify when physiology is failing despite apparent ABG normalization.",
  },
];

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function paragraphs(...parts: string[]): string {
  return parts.map((x) => x.trim()).filter(Boolean).join("\n\n");
}

function sectionBody(topic: HighYieldTopic, kind: string): string {
  if (kind === "introduction") {
    return paragraphs(
      `${topic.synopsis}`,
      `This lesson is exam-focused: identify unstable cues fast, choose the safest first action, and justify escalation with clinical data rather than memorized labels.`,
    );
  }
  if (kind === "pathophysiology_overview") {
    return paragraphs(
      `Core mechanism: ${topic.topic} develops when compensatory physiology can no longer maintain tissue oxygen delivery or organ-level homeostasis. Perfusion failure, gas-exchange mismatch, inflammatory signaling, or endocrine/renal dysregulation drive the earliest measurable changes.`,
      `Progression pattern: early stages often show subtle trend shifts (mental-status change, rising respiratory effort, pulse-pressure changes, worsening urine output, or evolving lactate/acid-base values). Late stages show overt decompensation with multi-system failure risk.`,
      `Complication link: delayed recognition increases risk of refractory shock, respiratory failure, dysrhythmia, kidney injury, neurologic deterioration, and arrest. Exam stems reward early detection and prevention of secondary injury through timely escalation.`,
    );
  }
  if (kind === "signs_symptoms") {
    return `Differentiate early warning findings from severe decompensation cues. Track trend-based changes in mentation, respiratory pattern, perfusion, urine output, and hemodynamics rather than relying on one isolated value.`;
  }
  if (kind === "red_flags") {
    return `Red flags include rapidly worsening vitals, refractory hypoxemia or hypotension, severe mental-status decline, arrhythmia risk markers, and persistent perfusion deficits despite initial treatment. Escalate immediately when trajectories worsen.`;
  }
  if (kind === "labs_diagnostics") {
    return `Use focused diagnostics to confirm pattern and urgency: CBC/CMP, lactate, ABG/VBG, ECG, bedside imaging as indicated, and serial reassessment metrics. Interpret abnormal trends in context of perfusion and organ function.`;
  }
  if (kind === "nursing_assessment_interventions") {
    return `Prioritize airway, breathing, circulation stabilization, then perform targeted interventions by etiology. Reassess response after each intervention, prevent iatrogenic harm, and escalate early when trajectory does not improve.`;
  }
  if (kind === "clinical_pearls") {
    return `- Exam priority is trajectory, not static numbers.\n- Choose the intervention that reduces immediate physiologic risk first.\n- Reassessment and escalation timing often determine the correct answer more than diagnosis labels.`;
  }
  if (kind === "client_education") {
    return `When stable, teach warning signs that require urgent follow-up, medication/monitoring adherence, trigger avoidance, and when to seek emergency care. Use concise language and confirm understanding with teach-back.`;
  }
  if (kind === "tier_specific_relevance") {
    return `RN exam relevance: prioritize unstable-first actions, identify deterioration early, and select interventions with the strongest immediate safety benefit.`;
  }
  if (kind === "country_specific_notes") {
    return `US NCLEX-RN framing is used: escalation thresholds, medication naming, and acute-care prioritization follow US standard nursing practice language.`;
  }
  if (kind === "related_next_steps") {
    return [
      `Pre-lesson check (3): What finding suggests early deterioration? Which action has highest immediate priority? What reassessment determines if treatment worked?`,
      `Post-lesson checks (5): Differentiate early vs late cues, select first action, choose diagnostics, prevent common intervention errors, and justify escalation timing.`,
      `[Topic drill](/app/questions?preset=topic_drill&topic=${encodeURIComponent(topic.topic)}&pathwayId=${PATHWAY_ID})`,
      `[Pathway lessons](/app/lessons?pathwayId=${PATHWAY_ID}&topicSlug=${encodeURIComponent(topic.topicSlug)})`,
    ].join("\n\n");
  }
  return "";
}

function buildSections(topic: HighYieldTopic): Prisma.InputJsonValue {
  const kinds = [
    "introduction",
    "pathophysiology_overview",
    "signs_symptoms",
    "red_flags",
    "labs_diagnostics",
    "nursing_assessment_interventions",
    "clinical_pearls",
    "client_education",
    "tier_specific_relevance",
    "country_specific_notes",
    "related_next_steps",
  ] as const;
  return kinds.map((kind) => ({
    id: kind,
    kind,
    heading:
      kind === "introduction"
        ? "Overview"
        : kind === "pathophysiology_overview"
          ? "Pathophysiology"
          : kind === "signs_symptoms"
            ? "Signs & Symptoms"
            : kind === "red_flags"
              ? "Red Flags / Deterioration Cues"
              : kind === "labs_diagnostics"
                ? "Diagnostics / Labs"
                : kind === "nursing_assessment_interventions"
                  ? "Treatments / Nursing Actions"
                  : kind === "clinical_pearls"
                    ? "Clinical Pearls / Decision-Making"
                    : kind === "client_education"
                      ? "Patient Education"
                      : kind === "tier_specific_relevance"
                        ? "RN Exam Relevance"
                        : kind === "country_specific_notes"
                          ? "US-Specific Notes"
                          : "Key Takeaways + Pre/Post Questions",
    body: sectionBody(topic, kind),
  }));
}

function domainForHighYieldUpgrade(text: string): Domain | null {
  const t = normalize(text);
  if (/\b(cardio|heart|myocard|arrhythm|shock|hemodynamic)\b/.test(t)) return "cardiovascular";
  if (/\b(respir|oxygen|abg|ventilat)\b/.test(t)) return "respiratory";
  if (/\b(renal|kidney|aki|ckd|dialysis|electrolyte)\b/.test(t)) return "renal";
  if (/\b(endocr|dka|hhs|thyroid|adrenal|insulin)\b/.test(t)) return "endocrine";
  if (/\b(neuro|stroke|seizure|icp|deterioration)\b/.test(t)) return "neuro";
  if (/\b(sepsis|septic)\b/.test(t)) return "sepsis";
  if (/\b(fluid|electrolyte|acid-base|acid base)\b/.test(t)) return "fluids_electrolytes";
  return null;
}

async function main() {
  const existing = await prisma.pathwayLesson.findMany({
    where: { pathwayId: PATHWAY_ID, locale: PATHWAY_LOCALE, status: ContentStatus.PUBLISHED },
    select: { slug: true, sortOrder: true, title: true, topic: true, bodySystem: true, sections: true },
    orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
  });

  const existingSlugSet = new Set(existing.map((r) => r.slug));
  let nextSort = (existing.at(-1)?.sortOrder ?? 0) + 1;

  const createdTopics: string[] = [];
  for (const topic of HIGH_YIELD_CREATE_PLAN.slice(0, CREATE_MAX)) {
    if (existingSlugSet.has(topic.slug)) continue;
    await prisma.pathwayLesson.create({
      data: {
        pathwayId: PATHWAY_ID,
        locale: PATHWAY_LOCALE,
        status: ContentStatus.PUBLISHED,
        slug: topic.slug,
        title: topic.title,
        topic: topic.topic,
        topicSlug: topic.topicSlug,
        bodySystem: topic.bodySystem,
        previewSectionCount: 4,
        seoTitle: topic.title,
        seoDescription: topic.synopsis,
        sections: buildSections(topic),
        sortOrder: nextSort,
      },
    });
    createdTopics.push(topic.slug);
    nextSort += 1;
  }

  // Select next deterministic 20 PARTIAL/EMPTY lessons from high-yield domains.
  const refreshed = await prisma.pathwayLesson.findMany({
    where: { pathwayId: PATHWAY_ID, locale: PATHWAY_LOCALE, status: ContentStatus.PUBLISHED },
    select: { slug: true, title: true, topic: true, bodySystem: true, sections: true },
    orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
  });

  const highYieldPartialSlugs: string[] = [];
  for (const row of refreshed) {
    const domain = domainForHighYieldUpgrade(`${row.title} ${row.topic} ${row.bodySystem} ${row.slug}`);
    if (!domain) continue;
    const sections = Array.isArray(row.sections) ? (row.sections as Array<Record<string, unknown>>) : [];
    const hasAll = sections.filter((s) => typeof s.kind === "string" && typeof s.body === "string" && String(s.body).trim().length > 0).length >= 11;
    if (hasAll) continue;
    highYieldPartialSlugs.push(row.slug);
    if (highYieldPartialSlugs.length >= UPGRADE_MAX) break;
  }

  const upgradedBatch = await runLessonCompletionBatch({
    pathwayId: PATHWAY_ID,
    batchSize: UPGRADE_MAX,
    write: true,
    mode: "complete",
    includeSlugs: highYieldPartialSlugs,
  });

  const finalRows = await prisma.pathwayLesson.findMany({
    where: { pathwayId: PATHWAY_ID, locale: PATHWAY_LOCALE, status: ContentStatus.PUBLISHED },
    select: { slug: true, title: true, topic: true, bodySystem: true, sections: true },
  });

  const highYieldTopicStrings = [
    "siadh vs di",
    "dka vs hhs",
    "early vs late shock",
    "digoxin toxicity",
    "heparin vs warfarin",
    "insulin types timing",
    "abg interpretation",
    "electrolyte imbalances",
    "delegation rules",
    "prioritization frameworks",
  ];
  const corpus = finalRows.map((r) => normalize(`${r.slug} ${r.title} ${r.topic} ${r.bodySystem}`)).join("\n");
  const remainingHighYieldGaps = highYieldTopicStrings.filter((t) => !corpus.includes(normalize(t)));

  const completeCount = finalRows.filter((r) => {
    const sections = Array.isArray(r.sections) ? (r.sections as Array<Record<string, unknown>>) : [];
    const byKind = new Map<string, string>();
    for (const s of sections) {
      if (typeof s.kind === "string" && typeof s.body === "string") byKind.set(s.kind, s.body.trim());
    }
    return byKind.size >= 11 && (byKind.get("pathophysiology_overview")?.split(/\n{2,}/).filter((p) => p.trim()).length ?? 0) >= 3;
  }).length;
  const partialOrEmptyCount = finalRows.length - completeCount;

  const output = {
    topicsCreated: createdTopics.slice(0, CREATE_MAX),
    lessonsUpgraded: upgradedBatch.items.map((i) => i.slug).slice(0, UPGRADE_MAX),
    updatedCompleteCount: completeCount,
    remainingPartialOrEmptyCount: partialOrEmptyCount,
    remainingHighYieldGaps,
  };

  console.log(JSON.stringify(output, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
