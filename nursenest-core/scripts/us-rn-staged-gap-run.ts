import "../src/lib/db/env-bootstrap";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { ContentStatus } from "@prisma/client";
import { prisma } from "../src/lib/db";
import { runLessonCompletionBatch } from "../src/lib/lessons/lesson-batch-completion";

type Completion = "COMPLETE" | "PARTIAL" | "EMPTY";
type Domain =
  | "cardiovascular"
  | "respiratory"
  | "neuro"
  | "endocrine"
  | "renal"
  | "GI"
  | "hematology"
  | "pharmacology"
  | "maternity"
  | "pediatrics"
  | "mental health"
  | "prioritization"
  | "safety";

type LessonIndexRow = {
  slug: string;
  title: string;
  category: Domain;
  subcategory: string;
  completeness: Completion;
  hasQuestions: boolean;
};

const DOMAINS: Domain[] = [
  "cardiovascular",
  "respiratory",
  "neuro",
  "endocrine",
  "renal",
  "GI",
  "hematology",
  "pharmacology",
  "maternity",
  "pediatrics",
  "mental health",
  "prioritization",
  "safety",
];

const REQUIRED_SECTIONS = [
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

const HIGH_YIELD_CHECKS: Array<{ topic: string; domain: Domain; keys: string[] }> = [
  { topic: "SIADH vs DI", domain: "endocrine", keys: ["siadh", "diabetes insipidus", "vs di"] },
  { topic: "DKA vs HHS", domain: "endocrine", keys: ["dka", "hhs"] },
  { topic: "Early vs late shock", domain: "cardiovascular", keys: ["early shock", "late shock", "shock stages"] },
  { topic: "Digoxin toxicity", domain: "pharmacology", keys: ["digoxin", "dig toxicity"] },
  { topic: "Heparin vs warfarin", domain: "hematology", keys: ["heparin", "warfarin"] },
  { topic: "Insulin types/timing", domain: "pharmacology", keys: ["insulin types", "insulin timing", "onset peak"] },
  { topic: "ABG interpretation", domain: "respiratory", keys: ["abg", "arterial blood gas"] },
  { topic: "Electrolyte imbalances", domain: "renal", keys: ["electrolyte", "hyperkalemia", "hyponatremia"] },
  { topic: "Delegation rules", domain: "prioritization", keys: ["delegation", "five rights"] },
  { topic: "Prioritization frameworks", domain: "prioritization", keys: ["prioritization framework", "abc", "maslow"] },
];

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function words(s: string): number {
  const t = s.trim();
  return t ? t.split(/\s+/).length : 0;
}

function paragraphs(s: string): number {
  return s
    .split(/\n{2,}/)
    .map((x) => x.trim())
    .filter(Boolean).length;
}

function domainsForLesson(text: string): Domain[] {
  const t = normalize(text);
  const out: Domain[] = [];
  if (/\b(cardio|heart|arrhythm|angina|myocard|shock|valv)\b/.test(t)) out.push("cardiovascular");
  if (/\b(respir|copd|asthma|pneumonia|ards|abg|oxygen|ventilat|lung)\b/.test(t)) out.push("respiratory");
  if (/\b(neuro|stroke|seizure|meningitis|icp|dementia|delirium)\b/.test(t)) out.push("neuro");
  if (/\b(endocr|diabetes|dka|hhs|thyroid|adrenal|siadh|insipidus)\b/.test(t)) out.push("endocrine");
  if (/\b(renal|kidney|aki|ckd|dialysis|electrolyte|oliguria|anuria)\b/.test(t)) out.push("renal");
  if (/\b(gi|gastro|liver|hepatic|pancreatitis|bowel|ibd|crohn|ulcerative colitis|gi bleed)\b/.test(t)) out.push("GI");
  if (/\b(hemat|anemia|coagul|thromb|platelet|transfusion|hemolytic|warfarin|heparin)\b/.test(t)) out.push("hematology");
  if (/\b(pharmac|medication|drug class|side effect|black box|antibiotic|insulin|opioid)\b/.test(t)) out.push("pharmacology");
  if (/\b(maternity|obstetric|labor|postpartum|fetal monitoring|preeclamps|eclamps)\b/.test(t)) out.push("maternity");
  if (/\b(pediatric|paediatric|infant|toddler|adolescent|developmental)\b/.test(t)) out.push("pediatrics");
  if (/\b(mental health|psych|depression|anxiety|schizophrenia|psychosis|crisis intervention)\b/.test(t)) out.push("mental health");
  if (/\b(priorit|delegation|triage|clinical judgment|decision-making|abc|maslow)\b/.test(t)) out.push("prioritization");
  if (/\b(safety|deterioration|rapid response|escalation|high alert)\b/.test(t)) out.push("safety");
  if (out.length === 0) out.push("safety");
  return [...new Set(out)];
}

function primaryDomain(text: string): Domain {
  const d = domainsForLesson(text);
  return d[0]!;
}

function completionFromSections(args: { sections: unknown; questionPresence: boolean; clinical: boolean }): Completion {
  const sections = Array.isArray(args.sections) ? (args.sections as Array<Record<string, unknown>>) : [];
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
  const missing = REQUIRED_SECTIONS.some((k) => !byKind.get(k)?.trim());
  const patho = byKind.get("pathophysiology_overview") ?? "";
  const badPatho = args.clinical && paragraphs(patho) < 3;
  if (missing || badPatho || !args.questionPresence) return "PARTIAL";
  return "COMPLETE";
}

async function loadAuditSnapshot() {
  const lessons = await prisma.pathwayLesson.findMany({
    where: { pathwayId: "us-rn-nclex-rn", locale: "en", status: ContentStatus.PUBLISHED },
    select: {
      id: true,
      slug: true,
      title: true,
      topic: true,
      bodySystem: true,
      sections: true,
    },
    orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
  });

  const qRows = await prisma.examQuestion.findMany({
    where: {
      status: "published",
      exam: { in: ["NCLEX-RN", "RN-CAT", "NCLEX"] },
      tier: { in: ["RN", "rn"] },
    },
    select: { topic: true, subtopic: true, bodySystem: true },
    take: 50000,
  });

  const qTopicSet = new Set<string>();
  const qBodySet = new Set<string>();
  for (const q of qRows) {
    if (q.topic) qTopicSet.add(normalize(q.topic));
    if (q.subtopic) qTopicSet.add(normalize(q.subtopic));
    if (q.bodySystem) qBodySet.add(normalize(q.bodySystem));
  }

  const index: LessonIndexRow[] = [];
  const domainStats: Record<Domain, { total: number; complete: number; partial: number; empty: number }> = Object.fromEntries(
    DOMAINS.map((d) => [d, { total: 0, complete: 0, partial: 0, empty: 0 }]),
  ) as Record<Domain, { total: number; complete: number; partial: number; empty: number }>;

  for (const row of lessons) {
    const text = `${row.title} ${row.topic} ${row.bodySystem} ${row.slug}`;
    const dom = primaryDomain(text);
    const topicNorm = normalize(row.topic);
    const slugPhrase = normalize(row.slug.replace(/-/g, " "));
    const bodyNorm = normalize(row.bodySystem);
    const hasQuestions = qTopicSet.has(topicNorm) || qTopicSet.has(slugPhrase) || qBodySet.has(bodyNorm);
    const clinical = !/\b(priorit|delegat|safety|framework|communication)\b/i.test(text);
    const completeness = completionFromSections({ sections: row.sections, questionPresence: hasQuestions, clinical });
    const subcategory = row.topic.includes("|") ? row.topic.split("|")[1]!.trim() : row.topic;
    index.push({
      slug: row.slug,
      title: row.title,
      category: dom,
      subcategory: subcategory || row.bodySystem,
      completeness,
      hasQuestions,
    });

    domainStats[dom].total += 1;
    if (completeness === "COMPLETE") domainStats[dom].complete += 1;
    if (completeness === "PARTIAL") domainStats[dom].partial += 1;
    if (completeness === "EMPTY") domainStats[dom].empty += 1;
  }

  return { lessons, index, domainStats };
}

function percentage(n: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((n / total) * 1000) / 10;
}

async function main() {
  const pre = await loadAuditSnapshot();

  const domainCoverage = DOMAINS.map((d) => {
    const s = pre.domainStats[d];
    return {
      domain: d,
      totalLessons: s.total,
      completePct: percentage(s.complete, s.total),
      partialPct: percentage(s.partial, s.total),
      emptyPct: percentage(s.empty, s.total),
    };
  });

  const corpus = pre.lessons.map((l) => normalize(`${l.title} ${l.topic} ${l.bodySystem} ${l.slug}`)).join("\n");
  const highYield = HIGH_YIELD_CHECKS.map((c) => ({
    topic: c.topic,
    domain: c.domain,
    exists: c.keys.some((k) => corpus.includes(normalize(k))),
  }));

  const missingCoreTopics = highYield.filter((h) => !h.exists).map((h) => ({ domain: h.domain, topic: h.topic }));
  const weakLessons = pre.index
    .filter((l) => l.completeness !== "COMPLETE")
    .sort((a, b) => (a.completeness === b.completeness ? a.slug.localeCompare(b.slug) : a.completeness === "EMPTY" ? -1 : 1));

  const underrepresentedDomains = domainCoverage.filter((d) => d.totalLessons < 15 || d.completePct < 60).map((d) => d.domain);

  const prioritizedGapList = [
    ...missingCoreTopics.map((m) => ({ domain: m.domain, type: "missing_topic", item: m.topic, priority: 1 })),
    ...weakLessons.slice(0, 100).map((l) => ({ domain: l.category, type: "weak_lesson", item: l.slug, priority: l.completeness === "EMPTY" ? 2 : 3 })),
  ]
    .sort((a, b) => a.priority - b.priority || a.domain.localeCompare(b.domain))
    .slice(0, 100);

  const top20Missing = missingCoreTopics.slice(0, 20);
  const createdTopics: string[] = [];

  // Phase 4 controlled upgrades (20 partial/empty max)
  const upgradedBatch = await runLessonCompletionBatch({
    pathwayId: "us-rn-nclex-rn",
    batchSize: 20,
    write: true,
    mode: "complete",
    onlyNotComplete: true,
  });

  const post = await loadAuditSnapshot();
  const remainingGapCount = post.index.filter((l) => l.completeness !== "COMPLETE").length;

  const flashcardsAvailable = await prisma.flashcard.count({
    where: {
      status: ContentStatus.PUBLISHED,
      deck: { is: { pathwayId: "us-rn-nclex-rn", status: ContentStatus.PUBLISHED } },
    },
  });

  const postCoverage = DOMAINS.map((d) => {
    const s = post.domainStats[d];
    return {
      domain: d,
      totalLessons: s.total,
      completePct: percentage(s.complete, s.total),
      partialPct: percentage(s.partial, s.total),
      emptyPct: percentage(s.empty, s.total),
    };
  });

  const completeLessons = post.index.filter((i) => i.completeness === "COMPLETE").length;
  const totalLessons = post.index.length;
  const completePct = percentage(completeLessons, totalLessons);
  const hasAllDomains = DOMAINS.every((d) => (post.domainStats[d]?.total ?? 0) > 0);
  const missingHighYieldAfter = HIGH_YIELD_CHECKS.filter((c) => !post.lessons.some((l) => c.keys.some((k) => normalize(`${l.title} ${l.topic} ${l.bodySystem} ${l.slug}`).includes(normalize(k)))));
  const completeReady =
    totalLessons >= 300 &&
    hasAllDomains &&
    missingHighYieldAfter.length === 0 &&
    completePct >= 70 &&
    flashcardsAvailable > 0 &&
    remainingGapCount <= 80;

  const reportDir = path.join(process.cwd(), "reports");
  await mkdir(reportDir, { recursive: true });
  const indexPath = path.join(reportDir, "us-rn-lesson-index.json");
  await writeFile(indexPath, JSON.stringify(post.index, null, 2), "utf8");

  const result = {
    phase1Audit: {
      indexFile: indexPath,
      lessonCount: pre.index.length,
      domainCoverage,
    },
    phase2GapIdentification: {
      missingCoreTopics,
      underrepresentedDomains,
      highYieldChecks: highYield,
      prioritizedGapListTop100: prioritizedGapList,
    },
    phase3ControlledCreation: {
      queuedTop20MissingTopics: top20Missing,
      topicsCreatedThisRun: createdTopics,
    },
    phase4ControlledUpgrades: {
      lessonsUpgraded: upgradedBatch.items.map((i) => i.slug),
      upgradedCount: upgradedBatch.lessonsUpdated,
    },
    phase5DomainBalancing: {
      postBatchCoverage: postCoverage,
    },
    phase6ValidationLoop: {
      lightweightRecheckRemainingGaps: remainingGapCount,
      highYieldMissingAfterRun: missingHighYieldAfter.map((x) => x.topic),
    },
    phase7CompletionProgress: {
      criteria: {
        lessonsAtLeast300: totalLessons >= 300,
        allMajorDomainsCovered: hasAllDomains,
        noMissingHighYieldTopics: missingHighYieldAfter.length === 0,
        mostLessonsComplete: completePct >= 70,
        questionsAndFlashcardsAvailable: flashcardsAvailable > 0,
        noMajorWeakAreas: remainingGapCount <= 80,
      },
      progressTowardComplete: completeReady ? "US RN can be marked COMPLETE." : "US RN not complete yet.",
    },
    outputPerRun: {
      auditSummary: {
        totalLessons,
        completeLessons,
        completePct,
      },
      topicsCreated: createdTopics,
      lessonsUpgraded: upgradedBatch.items.map((i) => i.slug),
      remainingGapCount,
      nextRecommendedBatch:
        missingCoreTopics.length > 0
          ? "Phase 3: create top 20 missing topics."
          : "Phase 4: upgrade next 20 PARTIAL lessons from prioritizedGapList.",
      confirmationOfProgressTowardComplete: completeReady,
    },
  };

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
