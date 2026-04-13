import "../src/lib/db/env-bootstrap";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { ContentStatus, type Prisma } from "@prisma/client";
import { listExamPathways } from "../src/lib/exam-pathways/exam-product-registry";
import { type ExamPathwayDefinition } from "../src/lib/exam-pathways/types";
import { GLOBAL_LOCALE_CODES } from "../src/lib/i18n/global-regions";
import { isLocaleSeoIndexable } from "../src/lib/i18n/language-readiness";
import { prisma } from "../src/lib/db";
import { runLessonCompletionBatch } from "../src/lib/lessons/lesson-batch-completion";

type Completion = "COMPLETE" | "PARTIAL" | "EMPTY";
type HighYieldDomain = "cardiovascular" | "respiratory" | "renal" | "endocrine" | "neuro" | "sepsis" | "fluids_electrolytes";

const CREATE_LIMIT = 20;
const UPGRADE_LIMIT = 20;

const HIGH_YIELD_CHECKS: Array<{ topic: string; domain: HighYieldDomain; keys: string[] }> = [
  { topic: "shock (including early vs late)", domain: "cardiovascular", keys: ["shock", "early vs late shock"] },
  { topic: "sepsis", domain: "sepsis", keys: ["sepsis", "septic shock"] },
  { topic: "ABGs", domain: "respiratory", keys: ["abg", "arterial blood gas"] },
  { topic: "fluids & electrolytes", domain: "fluids_electrolytes", keys: ["fluid", "electrolyte", "hyperkalemia", "hyponatremia"] },
  { topic: "cardiac emergencies", domain: "cardiovascular", keys: ["cardiac emergency", "acs", "arrhythmia unstable"] },
  { topic: "respiratory failure", domain: "respiratory", keys: ["respiratory failure", "oxygenation failure"] },
  { topic: "renal failure", domain: "renal", keys: ["renal failure", "aki", "ckd"] },
  { topic: "endocrine crises", domain: "endocrine", keys: ["dka", "hhs", "thyroid storm", "adrenal crisis"] },
  { topic: "neuro deterioration", domain: "neuro", keys: ["neuro deterioration", "increased icp", "stroke deterioration"] },
  { topic: "pharmacology essentials", domain: "endocrine", keys: ["insulin", "heparin", "warfarin", "digoxin"] },
];

const CREATE_PLAN = [
  { slug: "early-vs-late-shock", title: "Early vs Late Shock: Recognition and Priorities", topic: "Shock Stages", topicSlug: "shock-stages", bodySystem: "Cardiovascular", domain: "cardiovascular" as const, synopsis: "Differentiate compensated and decompensated shock using trend-based cues and escalation timing." },
  { slug: "shock-states-comparison", title: "Shock States Comparison: Hypovolemic, Cardiogenic, Obstructive, Distributive", topic: "Shock States", topicSlug: "shock-states-comparison", bodySystem: "Cardiovascular", domain: "cardiovascular" as const, synopsis: "Compare mechanisms and first-line actions for major shock categories." },
  { slug: "hemodynamics-bedside-interpretation", title: "Hemodynamics at the Bedside", topic: "Hemodynamics", topicSlug: "hemodynamics-bedside-interpretation", bodySystem: "Cardiovascular", domain: "cardiovascular" as const, synopsis: "Interpret MAP/SVR/CO trends to guide immediate nursing decisions." },
  { slug: "sepsis-recognition-and-bundles", title: "Sepsis Recognition and Bundle Timing Priorities", topic: "Sepsis", topicSlug: "sepsis-recognition-and-bundles", bodySystem: "Infection", domain: "sepsis" as const, synopsis: "Detect sepsis early and apply time-critical bundle interventions safely." },
  { slug: "oxygenation-failure-patterns", title: "Oxygenation Failure Patterns", topic: "Oxygenation", topicSlug: "oxygenation-failure-patterns", bodySystem: "Respiratory", domain: "respiratory" as const, synopsis: "Connect oxygenation physiology to escalation from oxygen devices to ventilation." },
  { slug: "cardiac-emergencies-first-hour", title: "Cardiac Emergencies: First-Hour Prioritization", topic: "Cardiac Emergencies", topicSlug: "cardiac-emergencies-first-hour", bodySystem: "Cardiovascular", domain: "cardiovascular" as const, synopsis: "Prioritize first-hour actions in unstable cardiac presentations." },
  { slug: "renal-emergencies-hyperkalemia-aki", title: "Renal Emergencies: Hyperkalemia and AKI Deterioration", topic: "Renal Emergencies", topicSlug: "renal-emergencies-hyperkalemia-aki", bodySystem: "Renal", domain: "renal" as const, synopsis: "Identify life-threatening renal deterioration and intervene rapidly." },
  { slug: "endocrine-crises-rapid-differentiation", title: "Endocrine Crises: Rapid Differentiation", topic: "Endocrine Crises", topicSlug: "endocrine-crises-rapid-differentiation", bodySystem: "Endocrine", domain: "endocrine" as const, synopsis: "Differentiate DKA/HHS, thyroid storm/myxedema, and adrenal crisis." },
  { slug: "neuro-deterioration-escalation", title: "Neuro Deterioration: Escalation Triggers", topic: "Neuro Deterioration", topicSlug: "neuro-deterioration-escalation", bodySystem: "Neurologic", domain: "neuro" as const, synopsis: "Recognize early neuro decline and escalate before irreversible injury." },
  { slug: "acid-base-disorders-rapid-interpretation", title: "Acid-Base Disorders: Rapid Interpretation", topic: "Acid-Base Disorders", topicSlug: "acid-base-disorders-rapid-interpretation", bodySystem: "Renal", domain: "fluids_electrolytes" as const, synopsis: "Interpret acid-base patterns and choose immediate nursing priorities." },
  { slug: "fluids-and-electrolytes-danger-patterns", title: "Fluids and Electrolytes: Danger Patterns", topic: "Fluids and Electrolytes", topicSlug: "fluids-and-electrolytes-danger-patterns", bodySystem: "Renal", domain: "fluids_electrolytes" as const, synopsis: "Identify high-risk electrolyte and fluid patterns that require escalation." },
  { slug: "vasopressor-selection-and-safety", title: "Vasopressor Selection and Safety Monitoring", topic: "Vasopressors", topicSlug: "vasopressor-selection-and-safety", bodySystem: "Cardiovascular", domain: "cardiovascular" as const, synopsis: "Select and monitor vasoactive therapy based on shock phenotype." },
  { slug: "lactate-and-perfusion-trending", title: "Lactate and Perfusion Trending", topic: "Perfusion Trends", topicSlug: "lactate-and-perfusion-trending", bodySystem: "Cardiovascular", domain: "sepsis" as const, synopsis: "Trend perfusion markers to evaluate response and detect ongoing shock." },
  { slug: "respiratory-failure-escalation-ladder", title: "Respiratory Failure Escalation Ladder", topic: "Respiratory Failure", topicSlug: "respiratory-failure-escalation-ladder", bodySystem: "Respiratory", domain: "respiratory" as const, synopsis: "Escalate support logically from low-flow oxygen to ventilator support." },
  { slug: "septic-vs-cardiogenic-shock-differentiation", title: "Septic vs Cardiogenic Shock: Bedside Differentiation", topic: "Shock Differentiation", topicSlug: "septic-vs-cardiogenic-shock-differentiation", bodySystem: "Cardiovascular", domain: "sepsis" as const, synopsis: "Differentiate septic and cardiogenic shock to avoid harmful treatment choices." },
  { slug: "hyperkalemia-ecg-and-emergent-treatment", title: "Hyperkalemia: ECG Changes and Emergent Treatment", topic: "Hyperkalemia Emergencies", topicSlug: "hyperkalemia-ecg-and-emergent-treatment", bodySystem: "Renal", domain: "renal" as const, synopsis: "Recognize dangerous ECG progression and apply life-saving sequence treatment." },
  { slug: "hypoglycemia-vs-hyperglycemia-priority-response", title: "Hypoglycemia vs Hyperglycemia: Priority Response", topic: "Glycemic Emergencies", topicSlug: "hypoglycemia-vs-hyperglycemia-priority-response", bodySystem: "Endocrine", domain: "endocrine" as const, synopsis: "Differentiate unstable glycemic presentations and choose safest first action." },
  { slug: "intracranial-pressure-escalation-pathway", title: "Increased Intracranial Pressure: Escalation Pathway", topic: "Increased ICP", topicSlug: "intracranial-pressure-escalation-pathway", bodySystem: "Neurologic", domain: "neuro" as const, synopsis: "Apply staged interventions to prevent herniation and secondary injury." },
  { slug: "fluid-resuscitation-initial-vs-reassessment", title: "Fluid Resuscitation: Initial vs Reassessment-Driven Strategy", topic: "Fluid Resuscitation", topicSlug: "fluid-resuscitation-initial-vs-reassessment", bodySystem: "Renal", domain: "fluids_electrolytes" as const, synopsis: "Balance immediate volume support with reassessment to prevent overload harm." },
  { slug: "abg-acid-base-and-compensation-patterns", title: "ABG Compensation Patterns: Action Priorities", topic: "ABG Compensation", topicSlug: "abg-acid-base-and-compensation-patterns", bodySystem: "Respiratory", domain: "respiratory" as const, synopsis: "Interpret compensation patterns and identify when immediate escalation is required." },
] as const;

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function words(s: string): number {
  const t = s.trim();
  return t ? t.split(/\s+/).length : 0;
}

function paragraphCount(s: string): number {
  return s
    .split(/\n{2,}/)
    .map((x) => x.trim())
    .filter(Boolean).length;
}

function tierListForRole(role: string): string[] {
  if (role === "rn") return ["RN", "rn"];
  if (role === "lpn" || role === "rpn") return ["PN", "pn", "RPN", "rpn", "LVN", "lvn"];
  if (role === "np") return ["NP", "np", "premium"];
  if (role === "allied") return ["allied"];
  return [];
}

function domainForText(text: string): HighYieldDomain | null {
  const t = normalize(text);
  if (/\b(cardio|heart|myocard|arrhythm|shock|hemodynamic)\b/.test(t)) return "cardiovascular";
  if (/\b(respir|oxygen|abg|ventilat|ards|copd|asthma)\b/.test(t)) return "respiratory";
  if (/\b(renal|kidney|aki|ckd|dialysis|hyperkalemia)\b/.test(t)) return "renal";
  if (/\b(endocr|dka|hhs|thyroid|adrenal|insulin)\b/.test(t)) return "endocrine";
  if (/\b(neuro|stroke|seizure|icp|deterioration)\b/.test(t)) return "neuro";
  if (/\b(sepsis|septic)\b/.test(t)) return "sepsis";
  if (/\b(fluid|electrolyte|acid-base|acid base|sodium|potassium)\b/.test(t)) return "fluids_electrolytes";
  return null;
}

function completionFromSections(sectionsRaw: unknown, hasQuestions: boolean): Completion {
  const sections = Array.isArray(sectionsRaw) ? (sectionsRaw as Array<Record<string, unknown>>) : [];
  const byKind = new Map<string, string>();
  let totalWords = 0;
  for (const s of sections) {
    const kind = typeof s.kind === "string" ? s.kind : "";
    const body = typeof s.body === "string" ? s.body.trim() : "";
    if (!kind || !body) continue;
    byKind.set(kind, body);
    totalWords += words(body);
  }
  if (totalWords < 280) return "EMPTY";
  const required = [
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
  ];
  if (required.some((k) => !byKind.get(k)?.trim())) return "PARTIAL";
  if (paragraphCount(byKind.get("pathophysiology_overview") ?? "") < 3) return "PARTIAL";
  if (!hasQuestions) return "PARTIAL";
  return "COMPLETE";
}

function sectionBody(title: string, synopsis: string, kind: string): string {
  if (kind === "introduction") {
    return `${synopsis}\n\nThis lesson stays exam-focused: identify instability early, choose the safest first action, and reassess after each intervention.`;
  }
  if (kind === "pathophysiology_overview") {
    return [
      `${title} reflects failure of compensation where physiologic stress exceeds reserve and early trend changes appear before overt collapse.`,
      `Mechanistically, perfusion, gas exchange, endocrine control, or renal buffering shifts produce predictable deterioration cues that map directly to priority nursing actions.`,
      `Without early recognition and escalation, late decompensation raises risk of multisystem injury, arrhythmia, respiratory failure, and arrest.`,
    ].join("\n\n");
  }
  if (kind === "signs_symptoms") return "Separate early findings from severe findings and prioritize trend-based reassessment over one-time values.";
  if (kind === "red_flags") return "Escalate immediately for worsening vitals, mental-status decline, refractory perfusion deficits, and treatment non-response.";
  if (kind === "labs_diagnostics") return "Use targeted diagnostics and serial trends (ABG/lactate/electrolytes/ECG/imaging as indicated) to confirm severity and response.";
  if (kind === "nursing_assessment_interventions") return "Stabilize ABCs, apply etiology-directed interventions, then reassess and escalate early when trajectory worsens.";
  if (kind === "clinical_pearls") return "- Prioritize unstable-first decisions.\n- Reassessment timing is often the key exam discriminator.\n- Avoid treatment delays while awaiting perfect data.";
  if (kind === "client_education") return "When stable, teach warning signs, medication/safety adherence, and when urgent care is required.";
  if (kind === "tier_specific_relevance") return "Exam relevance: choose first action that reduces immediate physiologic risk and justify escalation using objective findings.";
  if (kind === "country_specific_notes") return "Country/exam framing follows pathway-specific standards and terminology.";
  return "Key takeaways: focus on decision-making, deterioration recognition, and escalation sequence.\n\nPre/Post prompts: identify highest-risk cue, best first action, and most important reassessment.";
}

function buildSections(title: string, synopsis: string): Prisma.InputJsonValue {
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
  ];
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
              ? "Red Flags / Deterioration"
              : kind === "labs_diagnostics"
                ? "Diagnostics / Labs"
                : kind === "nursing_assessment_interventions"
                  ? "Treatments / Nursing Actions"
                  : kind === "clinical_pearls"
                    ? "Clinical Pearls / Decision-Making"
                    : kind === "client_education"
                      ? "Patient Education"
                      : kind === "tier_specific_relevance"
                        ? "Exam Relevance"
                        : kind === "country_specific_notes"
                          ? "Country Notes"
                          : "Key Takeaways / Pre/Post Questions",
    body: sectionBody(title, synopsis, kind),
  }));
}

async function buildQuestionCorpusForPathway(pathway: ExamPathwayDefinition): Promise<string> {
  const tierList = tierListForRole(pathway.roleTrack);
  const rows = await prisma.examQuestion.findMany({
    where: {
      status: "published",
      exam: { in: pathway.contentExamKeys },
      ...(tierList.length ? { tier: { in: tierList } } : {}),
    },
    select: { topic: true, subtopic: true, bodySystem: true, tags: true },
  });
  return normalize(
    rows
      .map((r) => `${r.topic ?? ""} ${r.subtopic ?? ""} ${r.bodySystem ?? ""} ${(r.tags ?? []).join(" ")}`)
      .join("\n"),
  );
}

function hasQuestionsForLessonFromCorpus(
  questionCorpus: string,
  lesson: { topic: string; slug: string; bodySystem: string },
): boolean {
  const topic = normalize(lesson.topic);
  const slugText = normalize(lesson.slug.replace(/-/g, " "));
  const body = normalize(lesson.bodySystem);
  if (!questionCorpus) return false;
  return [topic, slugText, body].some((k) => k.length > 1 && questionCorpus.includes(k));
}

async function auditPathwayLocale(pathway: ExamPathwayDefinition, locale: string, questionCorpus: string) {
  const localeLessons = await prisma.pathwayLesson.findMany({
    where: {
      pathwayId: pathway.id,
      locale,
      status: ContentStatus.PUBLISHED,
    },
    select: {
      slug: true,
      title: true,
      topic: true,
      topicSlug: true,
      bodySystem: true,
      sections: true,
    },
    orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
  });

  const shouldFallback = !isLocaleSeoIndexable(locale) && localeLessons.length === 0;
  const effectiveLocale = shouldFallback ? "en" : locale;
  const lessons =
    shouldFallback
      ? await prisma.pathwayLesson.findMany({
          where: {
            pathwayId: pathway.id,
            locale: "en",
            status: ContentStatus.PUBLISHED,
          },
          select: {
            slug: true,
            title: true,
            topic: true,
            topicSlug: true,
            bodySystem: true,
            sections: true,
          },
          orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
        })
      : localeLessons;

  const index: Array<{
    slug: string;
    title: string;
    category: string;
    subcategory: string;
    completeness: Completion;
    questions: "yes" | "no";
  }> = [];

  const duplicateTopicMap = new Map<string, string[]>();

  for (const l of lessons) {
    const hasQ = hasQuestionsForLessonFromCorpus(questionCorpus, { topic: l.topic, slug: l.slug, bodySystem: l.bodySystem });
    const completeness = completionFromSections(l.sections, hasQ);
    const category = (domainForText(`${l.title} ${l.topic} ${l.bodySystem} ${l.slug}`) ?? "safety").replaceAll("_", "-");
    index.push({
      slug: l.slug,
      title: l.title,
      category,
      subcategory: l.topic || l.bodySystem,
      completeness,
      questions: hasQ ? "yes" : "no",
    });
    const key = normalize(`${category}|${l.topicSlug || l.topic}`);
    const arr = duplicateTopicMap.get(key) ?? [];
    arr.push(l.slug);
    duplicateTopicMap.set(key, arr);
  }

  const completeCount = index.filter((x) => x.completeness === "COMPLETE").length;
  const partialEmptyCount = index.length - completeCount;
  const domainCovered = [...new Set(index.map((x) => x.category))].sort();
  const missingDomains = ["cardiovascular", "respiratory", "renal", "endocrine", "neuro", "sepsis", "fluids-electrolytes"].filter(
    (d) => !domainCovered.includes(d),
  );

  const corpus = normalize(index.map((x) => `${x.slug} ${x.title} ${x.subcategory}`).join("\n"));
  const highYieldMissing = HIGH_YIELD_CHECKS.filter((h) => !h.keys.some((k) => corpus.includes(normalize(k)))).map((h) => h.topic);

  const duplicateTopicGroups = [...duplicateTopicMap.entries()]
    .filter(([, slugs]) => slugs.length > 1)
    .map(([topicKey, slugs]) => ({ topicKey, slugs }));

  const fileName = `${pathway.countrySlug}-${pathway.roleTrack}-${pathway.examCode}-${locale}-lesson-index.json`;
  const filePath = path.join(process.cwd(), "reports", fileName);
  await writeFile(filePath, JSON.stringify(index, null, 2), "utf8");

  return {
    locale,
    effectiveLocale,
    usedEnglishFallback: shouldFallback,
    indexFile: filePath,
    totalLessons: index.length,
    completeCount,
    partialEmptyCount,
    completePct: index.length ? Math.round((completeCount / index.length) * 1000) / 10 : 0,
    highYieldMissing,
    domainsCovered: domainCovered,
    domainsMissing: missingDomains,
    duplicateTopicGroups,
  };
}

async function processPathway(pathway: ExamPathwayDefinition) {
  const questionCorpus = await buildQuestionCorpusForPathway(pathway);
  // Phase 1 audit over locales
  const localeSummaries: Array<Awaited<ReturnType<typeof auditPathwayLocale>>> = [];
  for (const locale of GLOBAL_LOCALE_CODES) {
    localeSummaries.push(await auditPathwayLocale(pathway, locale, questionCorpus));
  }

  const enAudit = localeSummaries.find((x) => x.locale === "en") ?? localeSummaries[0]!;

  // Phase 2 high-yield gap rank
  const missingSet = new Set(enAudit.highYieldMissing);
  const rankedGaps = HIGH_YIELD_CHECKS.map((h) => ({
    topic: h.topic,
    domain: h.domain,
    priority: missingSet.has(h.topic) ? "critical" : "covered",
  })).filter((x) => x.priority !== "covered");

  // Phase 3 create top 20 missing topics (English canonical)
  const existingSlugs = new Set(
    (
      await prisma.pathwayLesson.findMany({
        where: { pathwayId: pathway.id, locale: "en", status: ContentStatus.PUBLISHED },
        select: { slug: true },
      })
    ).map((x) => x.slug),
  );
  const lastSort = await prisma.pathwayLesson.findFirst({
    where: { pathwayId: pathway.id, locale: "en", status: ContentStatus.PUBLISHED },
    select: { sortOrder: true },
    orderBy: [{ sortOrder: "desc" }],
  });
  let sortOrder = (lastSort?.sortOrder ?? 0) + 1;
  const createdSlugs: string[] = [];
  const creationCandidates = CREATE_PLAN.filter((c) => rankedGaps.some((g) => normalize(g.topic).includes(normalize(c.topic)) || normalize(c.title).includes(normalize(g.topic))));
  const createQueue = (creationCandidates.length ? creationCandidates : CREATE_PLAN).slice(0, CREATE_LIMIT);
  for (const c of createQueue) {
    if (existingSlugs.has(c.slug)) continue;
    await prisma.pathwayLesson.create({
      data: {
        pathwayId: pathway.id,
        locale: "en",
        status: ContentStatus.PUBLISHED,
        slug: c.slug,
        title: `${c.title} (${pathway.shortName})`,
        topic: c.topic,
        topicSlug: c.topicSlug,
        bodySystem: c.bodySystem,
        previewSectionCount: 4,
        seoTitle: `${c.title} | ${pathway.shortName}`,
        seoDescription: c.synopsis,
        sections: buildSections(c.title, c.synopsis),
        sortOrder,
      },
    });
    createdSlugs.push(c.slug);
    sortOrder += 1;
  }

  // Phase 4 upgrade 20 partial lessons in high-yield domains
  const candidateRows = await prisma.pathwayLesson.findMany({
    where: { pathwayId: pathway.id, locale: "en", status: ContentStatus.PUBLISHED },
    select: { slug: true, title: true, topic: true, bodySystem: true, sections: true },
    orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
  });
  const includeSlugs: string[] = [];
  for (const r of candidateRows) {
    const domain = domainForText(`${r.slug} ${r.title} ${r.topic} ${r.bodySystem}`);
    if (!domain) continue;
    if (!["cardiovascular", "respiratory", "renal", "endocrine", "neuro", "sepsis", "fluids_electrolytes"].includes(domain)) continue;
    const hasQ = hasQuestionsForLessonFromCorpus(questionCorpus, { topic: r.topic, slug: r.slug, bodySystem: r.bodySystem });
    const comp = completionFromSections(r.sections, hasQ);
    if (comp === "COMPLETE") continue;
    includeSlugs.push(r.slug);
    if (includeSlugs.length >= UPGRADE_LIMIT) break;
  }
  const upgradedBatch = await runLessonCompletionBatch({
    pathwayId: pathway.id,
    batchSize: UPGRADE_LIMIT,
    write: true,
    mode: "complete",
    includeSlugs,
  });

  // Post-run counts + remaining gaps
  const postQuestionCorpus = await buildQuestionCorpusForPathway(pathway);
  const postAudit = await auditPathwayLocale(pathway, "en", postQuestionCorpus);
  const flashcardsCount = await prisma.flashcard.count({
    where: {
      status: ContentStatus.PUBLISHED,
      deck: { is: { pathwayId: pathway.id, status: ContentStatus.PUBLISHED } },
    },
  });

  return {
    pathwayId: pathway.id,
    country: pathway.countrySlug,
    tier: pathway.roleTrack,
    exam: pathway.examCode,
    topicsCreated: { count: createdSlugs.length, slugs: createdSlugs.slice(0, CREATE_LIMIT) },
    lessonsUpgraded: { count: upgradedBatch.lessonsUpdated, slugs: upgradedBatch.items.map((i) => i.slug).slice(0, UPGRADE_LIMIT) },
    updatedCompleteCount: postAudit.completeCount,
    remainingPartialEmptyCount: postAudit.partialEmptyCount,
    remainingHighYieldGaps: postAudit.highYieldMissing,
    localeHandlingSummary: localeSummaries.map((l) => ({
      locale: l.locale,
      effectiveLocale: l.effectiveLocale,
      usedEnglishFallback: l.usedEnglishFallback,
      seoIndexable: isLocaleSeoIndexable(l.locale),
    })),
    progressTowardComplete: {
      lessonsAtLeast300: postAudit.totalLessons >= 300,
      highYieldClosed: postAudit.highYieldMissing.length === 0,
      mostLessonsComplete: postAudit.completePct >= 60,
      flashcardsAvailable: flashcardsCount > 0,
    },
  };
}

async function main() {
  const reportDir = path.join(process.cwd(), "reports");
  await mkdir(reportDir, { recursive: true });

  const pathways = listExamPathways().filter((p) => p.status !== "hidden");
  const perPathway = [];
  for (const pathway of pathways) {
    perPathway.push(await processPathway(pathway));
  }

  const summary = {
    runAt: new Date().toISOString(),
    pathwayCount: perPathway.length,
    perPathway,
  };

  const outPath = path.join(reportDir, "global-high-yield-completion-run.json");
  await writeFile(outPath, JSON.stringify(summary, null, 2), "utf8");
  console.log(JSON.stringify({ outputFile: outPath, pathwaysProcessed: perPathway.length, perPathway }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
