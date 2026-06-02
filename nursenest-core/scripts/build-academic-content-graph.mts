#!/usr/bin/env tsx

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";

import { loadRuntimeEnv } from "./lib/load-runtime-env.mjs";

type CanonicalTopicRow = {
  id: string;
  topicKey: string;
  displayName: string;
  bodySystem: string | null;
  clinicalCategory: string | null;
  flashcardTopicKey: string | null;
  practiceTopicKey: string | null;
  catPoolKey: string | null;
  remediationTagKey: string | null;
  blogTopicKey: string | null;
};

type AssetCandidate = {
  assetType: string;
  assetId: string;
  label: string;
  haystack: string[];
  directCanonicalTopicId?: string | null;
  evidence: Record<string, unknown>;
};

type MappedAsset = AssetCandidate & {
  canonicalTopicId: string;
  canonicalTopicKey: string;
  confidence: number;
  matchReason: string;
};

type UnmappedAsset = AssetCandidate & { reason: string };
type TaxonomyConflict = AssetCandidate & { candidateTopicKeys: string[] };

type TopicCompleteness = {
  topicKey: string;
  displayName: string;
  lessonCoverage: number;
  questionCoverage: number;
  flashcardCoverage: number;
  simulationCoverage: number;
  clinicalSkillsCoverage: number;
  pharmacologyCoverage: number;
  assessmentCoverage: number;
  overallMasteryCoverage: number;
  counts: Record<string, number>;
  gaps: string[];
};

type Report = {
  generatedAt: string;
  mode: "dry-run" | "applied";
  database: { status: "Connected" | "Database Unreachable"; explanation?: string };
  sourceOfTruth: "CanonicalTopic";
  summary: {
    topicsLoaded: number;
    assetsInspected: number;
    mappedContent: number;
    unmappedContent: number;
    duplicateTopics: number;
    orphanedContent: number;
    taxonomyConflicts: number;
    appliedLinks: number;
  };
  topicCompleteness: TopicCompleteness[];
  mappedContent: MappedAsset[];
  unmappedContent: UnmappedAsset[];
  duplicateTopics: Array<{ displayName: string; topicKeys: string[] }>;
  orphanedContent: UnmappedAsset[];
  taxonomyConflicts: TaxonomyConflict[];
  coverageGapReport: Array<{ topicKey: string; displayName: string; gap: string; severity: "Critical" | "High" | "Medium" }>;
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const REPORTS_DIR = join(ROOT, "reports");
const JSON_PATH = join(REPORTS_DIR, "academic-content-graph-migration-report.json");
const MD_PATH = join(REPORTS_DIR, "academic-content-graph-migration-report.md");
const APPLY = process.argv.includes("--apply");

const COVERAGE_TARGETS = {
  lesson: 1,
  question: 20,
  flashcard: 30,
  simulation: 1,
  clinicalSkill: 1,
  pharmacology: 5,
  assessment: 10,
};

function slugify(value: string | null | undefined): string {
  return (value ?? "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function text(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.join(" ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function coverage(count: number, target: number): number {
  if (target <= 0) return 100;
  return Math.min(100, Number(((count / target) * 100).toFixed(1)));
}

function topicSearchKeys(topic: CanonicalTopicRow): string[] {
  return [
    topic.topicKey,
    topic.displayName,
    topic.bodySystem,
    topic.clinicalCategory,
    topic.flashcardTopicKey,
    topic.practiceTopicKey,
    topic.catPoolKey,
    topic.remediationTagKey,
    topic.blogTopicKey,
  ]
    .filter((value): value is string => Boolean(value))
    .flatMap((value) => [value.toLowerCase(), slugify(value)])
    .filter(Boolean);
}

function resolveTopic(
  asset: AssetCandidate,
  topics: CanonicalTopicRow[],
  topicById: Map<string, CanonicalTopicRow>,
): { mapped?: MappedAsset; conflict?: TaxonomyConflict; unmapped?: UnmappedAsset } {
  if (asset.directCanonicalTopicId) {
    const direct = topicById.get(asset.directCanonicalTopicId);
    if (direct) {
      return {
        mapped: {
          ...asset,
          canonicalTopicId: direct.id,
          canonicalTopicKey: direct.topicKey,
          confidence: 1,
          matchReason: "existing canonicalTopicId",
        },
      };
    }
  }

  const haystack = asset.haystack.map(text).join(" ").toLowerCase();
  const haystackSlug = slugify(haystack);
  const scored = topics
    .map((topic) => {
      const keys = topicSearchKeys(topic);
      const exact = keys.some((key) => key && (haystack.split(/\s+/).includes(key) || haystackSlug === key));
      const contained = keys.some((key) => key && key.length >= 4 && (haystack.includes(key) || haystackSlug.includes(key)));
      return { topic, score: exact ? 0.95 : contained ? 0.78 : 0 };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) return { unmapped: { ...asset, reason: "No canonical topic key matched asset metadata." } };

  const topScore = scored[0]?.score ?? 0;
  const top = scored.filter((item) => item.score === topScore);
  if (top.length > 1) {
    return {
      conflict: {
        ...asset,
        candidateTopicKeys: top.map((item) => item.topic.topicKey),
      },
    };
  }

  const match = scored[0]!;
  return {
    mapped: {
      ...asset,
      canonicalTopicId: match.topic.id,
      canonicalTopicKey: match.topic.topicKey,
      confidence: match.score,
      matchReason: "metadata/topic key match",
    },
  };
}

async function loadAssets(prisma: PrismaClient): Promise<AssetCandidate[]> {
  const [
    lessons,
    questions,
    flashcards,
    scenarios,
    ecgQuestions,
    ecgWorksheets,
    contentItems,
    legacyLessons,
    legacyQuestions,
  ] = await Promise.all([
    prisma.pathwayLesson.findMany({
      select: { id: true, title: true, pathwayId: true, topic: true, topicSlug: true, bodySystem: true, canonicalTopicId: true },
      where: { status: "PUBLISHED", deprecatedAt: null },
    }),
    prisma.examQuestion.findMany({
      select: { id: true, stem: true, tier: true, exam: true, topic: true, subtopic: true, bodySystem: true, tags: true, questionType: true, isAdaptiveEligible: true },
      where: { status: { equals: "published", mode: "insensitive" } },
    }),
    prisma.flashcard.findMany({
      select: {
        id: true,
        front: true,
        back: true,
        tier: true,
        examFamily: true,
        sourceKey: true,
        category: { select: { name: true, slug: true, topicCode: true } },
      },
      where: { status: "PUBLISHED" },
    }),
    prisma.clinicalNursingScenario.findMany({
      select: { id: true, title: true, pathwayId: true, canonicalCategoryId: true, tierFocus: true, presentingConcern: true, assessmentFindings: true },
      where: { publishStatus: "APPROVED" },
    }),
    prisma.ecgVideoQuestion.findMany({
      select: { id: true, questionText: true, rhythmTag: true, clinicalPriority: true, level: true, mode: true, topicTags: true },
    }),
    prisma.ecgWorksheet.findMany({
      select: { id: true, title: true, description: true, level: true, tags: true },
    }),
    prisma.contentItem.findMany({
      select: { id: true, title: true, slug: true, type: true, category: true, bodySystem: true, tier: true, tags: true, primaryKeyword: true },
      where: { status: { equals: "published", mode: "insensitive" } },
    }),
    prisma.lesson.findMany({
      select: { id: true, title: true, slug: true, topicTag: true, systemTag: true, tags: true, tier: true, examFamily: true },
      where: { status: "PUBLISHED" },
    }),
    prisma.question.findMany({
      select: { id: true, stem: true, topicTag: true, systemTag: true, tags: true, tier: true, examFamily: true, questionType: true },
      where: { status: "PUBLISHED" },
    }),
  ]);

  return [
    ...lessons.map((row): AssetCandidate => ({
      assetType: "lesson",
      assetId: row.id,
      label: row.title,
      directCanonicalTopicId: row.canonicalTopicId,
      haystack: [row.title, row.pathwayId, row.topic, row.topicSlug, row.bodySystem],
      evidence: { source: "pathway_lessons", pathwayId: row.pathwayId, topicSlug: row.topicSlug },
    })),
    ...questions.map((row): AssetCandidate => ({
      assetType: row.isAdaptiveEligible ? "cat_question" : "question",
      assetId: row.id,
      label: row.stem.slice(0, 120),
      haystack: [row.stem, row.tier, row.exam, row.topic, row.subtopic, row.bodySystem, row.tags],
      evidence: { source: "exam_questions", exam: row.exam, tier: row.tier, questionType: row.questionType },
    })),
    ...flashcards.map((row): AssetCandidate => ({
      assetType: "flashcard",
      assetId: row.id,
      label: row.front.slice(0, 120),
      haystack: [row.front, row.back, row.tier, row.examFamily, row.sourceKey, row.category.name, row.category.slug, row.category.topicCode],
      evidence: { source: "flashcards", category: row.category.slug, tier: row.tier },
    })),
    ...scenarios.map((row): AssetCandidate => ({
      assetType: "simulation",
      assetId: row.id,
      label: row.title,
      haystack: [row.title, row.pathwayId, row.canonicalCategoryId, row.tierFocus, row.presentingConcern, row.assessmentFindings],
      evidence: { source: "clinical_nursing_scenarios", pathwayId: row.pathwayId, tierFocus: row.tierFocus },
    })),
    ...ecgQuestions.map((row): AssetCandidate => ({
      assetType: "ecg",
      assetId: row.id,
      label: row.questionText.slice(0, 120),
      haystack: [row.questionText, row.rhythmTag, row.clinicalPriority, row.level, row.mode, row.topicTags, "ecg"],
      evidence: { source: "ecg_video_questions", rhythmTag: row.rhythmTag, level: row.level },
    })),
    ...ecgWorksheets.map((row): AssetCandidate => ({
      assetType: "ecg",
      assetId: row.id,
      label: row.title,
      haystack: [row.title, row.description, row.level, row.tags, "ecg"],
      evidence: { source: "ecg_worksheets", level: row.level },
    })),
    ...contentItems.map((row): AssetCandidate => ({
      assetType: row.type,
      assetId: row.id,
      label: row.title,
      haystack: [row.title, row.slug, row.type, row.category, row.bodySystem, row.tier, row.tags, row.primaryKeyword],
      evidence: { source: "content_items", type: row.type, slug: row.slug },
    })),
    ...legacyLessons.map((row): AssetCandidate => ({
      assetType: "lesson",
      assetId: row.id,
      label: row.title,
      haystack: [row.title, row.slug, row.topicTag, row.systemTag, row.tags, row.tier, row.examFamily],
      evidence: { source: "lessons", slug: row.slug, tier: row.tier },
    })),
    ...legacyQuestions.map((row): AssetCandidate => ({
      assetType: "question",
      assetId: row.id,
      label: row.stem.slice(0, 120),
      haystack: [row.stem, row.topicTag, row.systemTag, row.tags, row.tier, row.examFamily, row.questionType],
      evidence: { source: "questions", tier: row.tier, questionType: row.questionType },
    })),
  ];
}

async function applyLinks(prisma: PrismaClient, mapped: MappedAsset[]): Promise<number> {
  let applied = 0;
  for (const item of mapped) {
    await prisma.$executeRaw`
      INSERT INTO academic_content_asset_links (
        id,
        canonical_topic_id,
        asset_type,
        asset_id,
        relationship,
        source,
        confidence,
        evidence
      )
      VALUES (
        ${randomUUID()},
        ${item.canonicalTopicId},
        ${item.assetType},
        ${item.assetId},
        'primary',
        'academic-content-graph-migration',
        ${item.confidence},
        ${JSON.stringify({ ...item.evidence, matchReason: item.matchReason })}
      )
      ON CONFLICT (asset_type, asset_id, relationship)
      DO UPDATE SET
        canonical_topic_id = EXCLUDED.canonical_topic_id,
        source = EXCLUDED.source,
        confidence = EXCLUDED.confidence,
        evidence = EXCLUDED.evidence,
        updated_at = CURRENT_TIMESTAMP
    `;
    applied++;
  }
  return applied;
}

function duplicateTopicReport(topics: CanonicalTopicRow[]) {
  const byName = new Map<string, CanonicalTopicRow[]>();
  for (const topic of topics) {
    const key = slugify(topic.displayName);
    byName.set(key, [...(byName.get(key) ?? []), topic]);
  }
  return [...byName.values()]
    .filter((rows) => rows.length > 1)
    .map((rows) => ({ displayName: rows[0]?.displayName ?? "Unknown", topicKeys: rows.map((row) => row.topicKey) }));
}

function buildCompleteness(topics: CanonicalTopicRow[], mapped: MappedAsset[]): TopicCompleteness[] {
  const rows: TopicCompleteness[] = [];
  for (const topic of topics) {
    const assets = mapped.filter((item) => item.canonicalTopicId === topic.id);
    const counts = {
      lesson: assets.filter((item) => item.assetType === "lesson").length,
      question: assets.filter((item) => item.assetType === "question" || item.assetType === "cat_question").length,
      flashcard: assets.filter((item) => item.assetType === "flashcard").length,
      simulation: assets.filter((item) => item.assetType === "simulation").length,
      clinicalSkill: assets.filter((item) => item.assetType.includes("skill")).length,
      pharmacology: assets.filter((item) => item.assetType.includes("pharm") || item.haystack.some((h) => slugify(text(h)).includes("pharmacology") || slugify(text(h)).includes("medication"))).length,
      assessment: assets.filter((item) => ["question", "cat_question", "simulation", "ecg"].includes(item.assetType)).length,
    };
    const metrics = {
      lessonCoverage: coverage(counts.lesson, COVERAGE_TARGETS.lesson),
      questionCoverage: coverage(counts.question, COVERAGE_TARGETS.question),
      flashcardCoverage: coverage(counts.flashcard, COVERAGE_TARGETS.flashcard),
      simulationCoverage: coverage(counts.simulation, COVERAGE_TARGETS.simulation),
      clinicalSkillsCoverage: coverage(counts.clinicalSkill, COVERAGE_TARGETS.clinicalSkill),
      pharmacologyCoverage: coverage(counts.pharmacology, COVERAGE_TARGETS.pharmacology),
      assessmentCoverage: coverage(counts.assessment, COVERAGE_TARGETS.assessment),
    };
    const gaps = Object.entries(metrics)
      .filter(([, value]) => value === 0)
      .map(([key]) => key.replace(/Coverage$/, ""));
    rows.push({
      topicKey: topic.topicKey,
      displayName: topic.displayName,
      ...metrics,
      overallMasteryCoverage: Number((Object.values(metrics).reduce((sum, value) => sum + value, 0) / Object.values(metrics).length).toFixed(1)),
      counts,
      gaps,
    });
  }
  return rows.sort((a, b) => a.overallMasteryCoverage - b.overallMasteryCoverage || a.topicKey.localeCompare(b.topicKey));
}

function buildUnavailableReport(explanation: string): Report {
  return {
    generatedAt: new Date().toISOString(),
    mode: APPLY ? "applied" : "dry-run",
    database: { status: "Database Unreachable", explanation },
    sourceOfTruth: "CanonicalTopic",
    summary: {
      topicsLoaded: 0,
      assetsInspected: 0,
      mappedContent: 0,
      unmappedContent: 0,
      duplicateTopics: 0,
      orphanedContent: 0,
      taxonomyConflicts: 0,
      appliedLinks: 0,
    },
    topicCompleteness: [],
    mappedContent: [],
    unmappedContent: [],
    duplicateTopics: [],
    orphanedContent: [],
    taxonomyConflicts: [],
    coverageGapReport: [],
  };
}

function assembleReport(args: {
  topics: CanonicalTopicRow[];
  assets: AssetCandidate[];
  mapped: MappedAsset[];
  unmapped: UnmappedAsset[];
  conflicts: TaxonomyConflict[];
  appliedLinks: number;
}): Report {
  const duplicates = duplicateTopicReport(args.topics);
  const topicCompleteness = buildCompleteness(args.topics, args.mapped);
  const coverageGapReport = topicCompleteness.flatMap((topic) =>
    topic.gaps.map((gap) => ({
      topicKey: topic.topicKey,
      displayName: topic.displayName,
      gap,
      severity: gap === "lesson" || gap === "question" || gap === "assessment" ? ("Critical" as const) : ("High" as const),
    })),
  );
  return {
    generatedAt: new Date().toISOString(),
    mode: APPLY ? "applied" : "dry-run",
    database: { status: "Connected" },
    sourceOfTruth: "CanonicalTopic",
    summary: {
      topicsLoaded: args.topics.length,
      assetsInspected: args.assets.length,
      mappedContent: args.mapped.length,
      unmappedContent: args.unmapped.length,
      duplicateTopics: duplicates.length,
      orphanedContent: args.unmapped.length,
      taxonomyConflicts: args.conflicts.length,
      appliedLinks: args.appliedLinks,
    },
    topicCompleteness,
    mappedContent: args.mapped.slice(0, 500),
    unmappedContent: args.unmapped.slice(0, 500),
    duplicateTopics: duplicates,
    orphanedContent: args.unmapped.slice(0, 500),
    taxonomyConflicts: args.conflicts.slice(0, 500),
    coverageGapReport,
  };
}

function renderReport(report: Report): string {
  const lines = [
    "# Academic Content Graph Migration Report",
    "",
    `Generated: ${report.generatedAt}`,
    `Mode: ${report.mode}`,
    `Source of truth: ${report.sourceOfTruth}`,
    "",
    "## Database",
    "",
    `Status: **${report.database.status}**`,
    report.database.explanation ?? "",
    "",
    "## Summary",
    "",
    `- Topics loaded: **${report.summary.topicsLoaded}**`,
    `- Assets inspected: **${report.summary.assetsInspected}**`,
    `- Mapped content: **${report.summary.mappedContent}**`,
    `- Unmapped content: **${report.summary.unmappedContent}**`,
    `- Duplicate topics: **${report.summary.duplicateTopics}**`,
    `- Orphaned content: **${report.summary.orphanedContent}**`,
    `- Taxonomy conflicts: **${report.summary.taxonomyConflicts}**`,
    `- Applied links: **${report.summary.appliedLinks}**`,
    "",
    "## Topic Completeness",
    "",
    "| Topic | Lessons | Questions | Flashcards | Simulations | Clinical Skills | Pharmacology | Assessment | Overall | Gaps |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |",
    ...report.topicCompleteness
      .slice(0, 200)
      .map(
        (topic) =>
          `| ${topic.displayName} | ${topic.lessonCoverage}% | ${topic.questionCoverage}% | ${topic.flashcardCoverage}% | ${topic.simulationCoverage}% | ${topic.clinicalSkillsCoverage}% | ${topic.pharmacologyCoverage}% | ${topic.assessmentCoverage}% | ${topic.overallMasteryCoverage}% | ${topic.gaps.join(", ") || "None"} |`,
      ),
    "",
    "## Coverage Gap Detection",
    "",
    ...report.coverageGapReport
      .slice(0, 100)
      .map((gap) => `- **${gap.severity}** ${gap.displayName}: no ${gap.gap} coverage mapped to the master topic graph.`),
    "",
    "## Duplicate Topics",
    "",
    ...(report.duplicateTopics.length
      ? report.duplicateTopics.map((item) => `- ${item.displayName}: ${item.topicKeys.join(", ")}`)
      : ["- None detected"]),
    "",
    "## Taxonomy Conflicts",
    "",
    ...(report.taxonomyConflicts.length
      ? report.taxonomyConflicts.slice(0, 50).map((item) => `- ${item.assetType}:${item.assetId} matched ${item.candidateTopicKeys.join(", ")}`)
      : ["- None detected"]),
    "",
    "## Unmapped Content",
    "",
    ...(report.unmappedContent.length
      ? report.unmappedContent.slice(0, 100).map((item) => `- ${item.assetType}:${item.assetId} — ${item.label} (${item.reason})`)
      : ["- None detected"]),
    "",
  ];
  return lines.join("\n");
}

function writeReport(report: Report) {
  mkdirSync(REPORTS_DIR, { recursive: true });
  writeFileSync(JSON_PATH, `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(MD_PATH, renderReport(report));
}

async function main() {
  try {
    loadRuntimeEnv({ envRoot: ROOT, quiet: true, validate: true, purpose: "academic-content-graph" });
  } catch (error) {
    const report = buildUnavailableReport(`Runtime environment could not be loaded: ${error instanceof Error ? error.message : String(error)}`);
    writeReport(report);
    console.log(`Academic content graph report generated with database status: ${report.database.status}`);
    return;
  }

  const prisma = new PrismaClient();
  try {
    await prisma.$queryRaw`SELECT 1`;
    const topics = await prisma.canonicalTopic.findMany({
      select: {
        id: true,
        topicKey: true,
        displayName: true,
        bodySystem: true,
        clinicalCategory: true,
        flashcardTopicKey: true,
        practiceTopicKey: true,
        catPoolKey: true,
        remediationTagKey: true,
        blogTopicKey: true,
      },
    });
    const topicById = new Map(topics.map((topic) => [topic.id, topic]));
    const assets = await loadAssets(prisma);

    const mapped: MappedAsset[] = [];
    const unmapped: UnmappedAsset[] = [];
    const conflicts: TaxonomyConflict[] = [];

    for (const asset of assets) {
      const result = resolveTopic(asset, topics, topicById);
      if (result.mapped) mapped.push(result.mapped);
      if (result.unmapped) unmapped.push(result.unmapped);
      if (result.conflict) conflicts.push(result.conflict);
    }

    let appliedLinks = 0;
    if (APPLY) {
      appliedLinks = await applyLinks(prisma, mapped);
    }

    const report = assembleReport({ topics, assets, mapped, unmapped, conflicts, appliedLinks });
    writeReport(report);
    console.log(`Academic content graph report generated: ${JSON_PATH}`);
    console.log(`Markdown report generated: ${MD_PATH}`);
  } catch (error) {
    const report = buildUnavailableReport(`Database Unreachable: ${error instanceof Error ? error.message : String(error)}`);
    writeReport(report);
    console.log(`Academic content graph report generated with database status: ${report.database.status}`);
  } finally {
    await prisma.$disconnect().catch(() => undefined);
  }
}

void main();
