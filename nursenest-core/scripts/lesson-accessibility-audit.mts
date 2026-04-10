#!/usr/bin/env npx tsx
/**
 * Lesson accessibility audit: ContentItem + PathwayLesson reachability (read-only).
 *
 *   npx tsx scripts/lesson-accessibility-audit.mts
 *   npx tsx scripts/lesson-accessibility-audit.mts --out ./custom.json
 *
 * Output: data/reports/pathway-lessons/lesson-accessibility-audit.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { LESSON_RATIONALE_MAPPING_ENTRIES } from "@/lib/learner/lesson-question-rationale/registry";
import {
  activeRegistryPathwayIds,
  classifyContentItemLesson,
  classifyPathwayLessonReachability,
  type ContentItemLessonRow,
  type PathwayLessonAuditRow,
} from "@/lib/pathway-lessons/lesson-accessibility-audit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DEFAULT_OUT = path.join(ROOT, "data/reports/pathway-lessons/lesson-accessibility-audit.json");
const NP_ALIGN_REPORT = path.join(ROOT, "data/reports/pathway-lessons/np-db-alignment-report.json");

function parseOutPath(): string {
  const i = process.argv.indexOf("--out");
  if (i >= 0 && process.argv[i + 1]) return path.resolve(process.argv[i + 1]!);
  return DEFAULT_OUT;
}

async function topicClusterSlugSetsByPathway(): Promise<Map<string, Set<string>>> {
  const map = new Map<string, Set<string>>();
  const ids = activeRegistryPathwayIds();
  for (const pathwayId of ids) {
    const groups = await prisma.pathwayLesson.groupBy({
      by: ["topicSlug"],
      where: { pathwayId, status: ContentStatus.PUBLISHED, locale: "en" },
      _count: { _all: true },
    });
    map.set(pathwayId, new Set(groups.map((g) => g.topicSlug)));
  }
  return map;
}

function loadNpAlignmentSummary():
  | {
      weakLessons: number;
      duplicateTopics: number;
      missingTopics: number;
      source: string;
    }
  | undefined {
  if (!fs.existsSync(NP_ALIGN_REPORT)) return undefined;
  try {
    const j = JSON.parse(fs.readFileSync(NP_ALIGN_REPORT, "utf8")) as {
      rows?: { classification: string }[];
    };
    const rows = j.rows ?? [];
    let weakLessons = 0;
    let duplicateTopics = 0;
    let missingTopics = 0;
    for (const r of rows) {
      if (r.classification === "EXISTS_WEAK") weakLessons += 1;
      if (r.classification === "DUPLICATE_CLUSTER") duplicateTopics += 1;
      if (r.classification === "MISSING") missingTopics += 1;
    }
    return {
      weakLessons,
      duplicateTopics,
      missingTopics,
      source: path.relative(ROOT, NP_ALIGN_REPORT),
    };
  } catch {
    return undefined;
  }
}

async function main() {
  const outPath = parseOutPath();

  const rationaleSlugSet = new Set(LESSON_RATIONALE_MAPPING_ENTRIES.map((e) => e.lessonSlug));

  const [contentRows, pathwayRows] = await Promise.all([
    prisma.contentItem.findMany({
      where: { type: "lesson" },
      select: { id: true, slug: true, title: true, type: true, status: true, tier: true, regionScope: true },
    }),
    prisma.pathwayLesson.findMany({
      where: { locale: "en" },
      select: { id: true, pathwayId: true, slug: true, title: true, topicSlug: true, status: true, locale: true },
    }),
  ]);

  const clusterSets = await topicClusterSlugSetsByPathway();

  const contentReport = contentRows.map((r) => {
    const row = r as ContentItemLessonRow;
    const c = classifyContentItemLesson(row);
    return {
      id: r.id,
      slug: r.slug,
      title: r.title,
      status: r.status,
      tier: r.tier,
      regionScope: r.regionScope,
      classification: c.classification,
      matchedProbes: c.matchedProbes,
      primaryNursingSurface: c.primaryNursingSurface,
      inRationaleSlugRegistry: rationaleSlugSet.has(r.slug),
    };
  });

  const pathwayPublished = pathwayRows.filter((r) => r.status === ContentStatus.PUBLISHED);
  const pathwayReport = pathwayPublished.map((r) => {
    const row = r as PathwayLessonAuditRow;
    const clusters = clusterSets.get(row.pathwayId) ?? new Set<string>();
    const reach = classifyPathwayLessonReachability(row, clusters);
    return {
      id: r.id,
      pathwayId: r.pathwayId,
      slug: r.slug,
      title: r.title,
      topicSlug: r.topicSlug,
      classification: reach.classification,
      channels: reach.channels,
      notes: reach.notes,
      inRationaleSlugRegistry: rationaleSlugSet.has(r.slug),
    };
  });

  const summarize = <T extends string>(items: { classification: T }[]) => {
    const o = {} as Record<string, number>;
    for (const x of items) {
      o[x.classification] = (o[x.classification] ?? 0) + 1;
    }
    return o;
  };

  const report = {
    generatedAt: new Date().toISOString(),
    schemaVersion: 1,
    dataSources: ["content_items", "pathway_lessons", "exam_pathway_registry", "lesson_rationale_registry"],
    policyNotes: [
      "ContentItem ORPHANED = published lesson row not visible to any probe in lessonBankProbeMatrix (tier ladder + region). Fix tier/regionScope or status.",
      "PathwayLesson ORPHANED = pathwayId not in EXAM_PATHWAYS. WEAKLY_ACCESSIBLE = missing/generic topicSlug (hub lists, but clusters and topic deep links suffer).",
      "Rationale links use resolveRationaleLessonLinksForQuestion + score floors; findLessonsForExamContext shares the same ranking thresholds.",
      "This audit does not crawl sitemap or search index; WEAKLY_ACCESSIBLE may still be discoverable via search.",
      "Server-side paywall: pathway lessons SSR preview + canViewFullPathwayLesson; ContentItem /api/lessons uses lessonAccessWhere — keep APIs aligned when adding surfaces.",
    ],
    summary: {
      contentItem: summarize(contentReport),
      pathwayLesson: summarize(pathwayReport),
      counts: {
        contentItemLessonsTotal: contentRows.length,
        pathwayLessonPublished: pathwayPublished.length,
        rationaleRegistryEntries: LESSON_RATIONALE_MAPPING_ENTRIES.length,
      },
    },
    npAlignmentReportSummary: loadNpAlignmentSummary(),
    contentItems: contentReport,
    pathwayLessons: pathwayReport,
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");
  console.log(`Wrote ${path.relative(ROOT, outPath)}`);
  console.log("ContentItem summary:", report.summary.contentItem);
  console.log("PathwayLesson summary:", report.summary.pathwayLesson);
  if (report.summary.contentItem.ORPHANED) {
    console.warn(`\n⚠ ${report.summary.contentItem.ORPHANED} ContentItem lessons are ORPHANED (no subscriber probe match).`);
  }
  if (report.summary.pathwayLesson.ORPHANED) {
    console.warn(`\n⚠ ${report.summary.pathwayLesson.ORPHANED} PathwayLesson rows are ORPHANED (unknown pathway).`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  void prisma.$disconnect();
  process.exit(1);
});
