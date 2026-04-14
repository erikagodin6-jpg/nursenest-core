#!/usr/bin/env npx tsx
/**
 * System-wide pathway lesson inventory (catalog + optional DB), aligned with marketing lesson detail
 * gates (`structuralQuality.publicComplete`) and hub filtering.
 *
 * Outputs:
 *   reports/lesson-system-inventory.json
 *   reports/lesson-system-inventory-summary.md
 *
 * Run: npx tsx scripts/lesson-system-wide-inventory.mts
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { ContentStatus } from "@prisma/client";
import { ALLIED_PROFESSIONS } from "../src/lib/allied/allied-professions-registry";
import { alliedLessonMatchesProfessionFilter } from "../src/lib/allied/allied-lesson-access";
import { buildExamPathwayPath, EXAM_PATHWAYS, getExamPathwayById } from "../src/lib/exam-pathways/exam-product-registry";
import { isDatabaseUrlConfigured } from "../src/lib/db/safe-database";
import { prisma } from "../src/lib/db";
import {
  getEffectiveCatalogLessonsForPathwaySync,
  normalizeLesson,
  pathwayLessonRowToInput,
} from "../src/lib/lessons/pathway-lesson-loader";
import { prependScopedGoldCatalogLessons } from "../src/lib/lessons/scoped-lessons/scoped-gold-registry";
import { alliedHealthLessonDetailPath } from "../src/lib/lessons/lesson-routes";
import type { PathwayLessonRecord, PathwayLessonSectionKind } from "../src/lib/lessons/pathway-lesson-types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REPORTS = path.join(ROOT, "reports");
const JSON_OUT = path.join(REPORTS, "lesson-system-inventory.json");
const MD_OUT = path.join(REPORTS, "lesson-system-inventory-summary.md");
const CATALOG_PATH = path.join(ROOT, "src/content/pathway-lessons/catalog.json");

const THIN_BODY_CHARS = 200;

type CatalogJson = { pathways?: Record<string, { lessons?: unknown[] }> };

type LessonAuditRow = {
  slug: string;
  title: string;
  topicSlug: string;
  pathwayId: string;
  marketingUrlPattern: string;
  sources: ("catalog" | "database")[];
  /** Same gate as `PathwayLessonDetailPage`: !publicComplete → notFound() */
  marketingWouldRender: boolean;
  structureMode: "premium" | "legacy";
  structuralIssues: string[];
  totalBodyChars: number;
  relatedLessonRefs: string[];
  brokenRelatedRefs: string[];
  hasTakeawaysSection: boolean;
  /** Current schema: common traps live on `exam_focus` as a string, not string[] */
  examFocusCommonTrapsStringLen: number;
  memoryAnchorPresent: boolean;
};

function pathwayLabel(id: string): string {
  const p = getExamPathwayById(id);
  if (p) return `${p.displayName} (${p.id})`;
  if (id.includes("allied")) return `Allied (${id})`;
  if (id.includes("np")) return `NP (${id})`;
  return id;
}

function marketingLessonsUrlForPathwayId(pathwayId: string): string {
  const p = getExamPathwayById(pathwayId);
  if (!p) return `/{country}/{role}/{exam}/lessons/{slug} (unknown pathway id)`;
  return `${buildExamPathwayPath(p, "lessons")}/{slug}`;
}

function totalBodyChars(lesson: PathwayLessonRecord): number {
  let n = 0;
  for (const s of lesson.sections) {
    if (typeof s.body === "string") n += s.body.trim().length;
    const ef = s.kind === "exam_focus" ? s.examFocus : undefined;
    if (ef?.commonTraps) n += ef.commonTraps.length;
    if (ef?.howTested) n += ef.howTested.length;
    if (ef?.prioritizationCues) n += ef.prioritizationCues.length;
  }
  return n;
}

function examFocusTrapsLen(lesson: PathwayLessonRecord): number {
  const ex = lesson.sections.find((s) => s.kind === "exam_focus");
  const t = ex?.examFocus?.commonTraps;
  return typeof t === "string" ? t.trim().length : 0;
}

function hasMemoryAnchor(lesson: PathwayLessonRecord): boolean {
  const raw = lesson as PathwayLessonRecord & { memoryAnchor?: unknown };
  return typeof raw.memoryAnchor === "string" && raw.memoryAnchor.trim().length > 0;
}

function collectDuplicateSlugs(rawLessons: { slug: string }[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const l of rawLessons) {
    const s = l.slug;
    m.set(s, (m.get(s) ?? 0) + 1);
  }
  return m;
}

function tierGroupForPathway(pathwayId: string): string {
  if (pathwayId === "us-rn-nclex-rn") return "US RN";
  if (pathwayId === "ca-rn-nclex-rn") return "Canada RN";
  if (pathwayId === "us-lpn-nclex-pn") return "US PN (NCLEX-PN)";
  if (pathwayId === "ca-rpn-rex-pn") return "Canada PN / REx-PN";
  if (pathwayId.startsWith("us-np-") || pathwayId === "ca-np-cnple") return "NP";
  if (pathwayId === "us-allied-core" || pathwayId === "ca-allied-core") return "Allied (exam hub)";
  return "Other / mixed";
}

async function loadDbLessonsByPathway(): Promise<Map<string, PathwayLessonRecord[]>> {
  const map = new Map<string, PathwayLessonRecord[]>();
  if (!isDatabaseUrlConfigured()) return map;
  try {
    const rows = await prisma.pathwayLesson.findMany({
      where: { status: ContentStatus.PUBLISHED, locale: "en" },
      take: 20000,
      orderBy: [{ pathwayId: "asc" }, { slug: "asc" }],
    });
    for (const row of rows) {
      const lesson = normalizeLesson(pathwayLessonRowToInput(row), row.pathwayId);
      const arr = map.get(row.pathwayId) ?? [];
      arr.push(lesson);
      map.set(row.pathwayId, arr);
    }
  } catch (e) {
    console.error("DB inventory skipped:", e);
  }
  return map;
}

function mergeSources(
  pathwayId: string,
  catalogLessons: PathwayLessonRecord[],
  dbLessons: PathwayLessonRecord[] | undefined,
): Map<string, { lesson: PathwayLessonRecord; sources: ("catalog" | "database")[] }> {
  const merged = new Map<string, { lesson: PathwayLessonRecord; sources: ("catalog" | "database")[] }>();
  for (const l of catalogLessons) {
    merged.set(l.slug, { lesson: l, sources: ["catalog"] });
  }
  if (dbLessons) {
    for (const l of dbLessons) {
      const hit = merged.get(l.slug);
      if (hit) {
        hit.lesson = l;
        hit.sources = ["catalog", "database"];
      } else {
        merged.set(l.slug, { lesson: l, sources: ["database"] });
      }
    }
  }
  return merged;
}

function auditLessonRow(
  pathwayId: string,
  slug: string,
  lesson: PathwayLessonRecord,
  sources: ("catalog" | "database")[],
  slugSet: Set<string>,
): LessonAuditRow {
  const gate = lesson.structuralQuality;
  const broken: string[] = [];
  for (const ref of lesson.relatedLessonRefs ?? []) {
    if (!ref.slug?.trim()) continue;
    if (!slugSet.has(ref.slug)) broken.push(ref.slug);
  }
  const kinds = new Set(lesson.sections.map((s) => s.kind as PathwayLessonSectionKind));
  return {
    slug,
    title: lesson.title,
    topicSlug: lesson.topicSlug,
    pathwayId,
    marketingUrlPattern: marketingLessonsUrlForPathwayId(pathwayId),
    sources,
    marketingWouldRender: Boolean(gate?.publicComplete),
    structureMode: gate?.structureMode ?? "legacy",
    structuralIssues: gate?.issues ?? [],
    totalBodyChars: totalBodyChars(lesson),
    relatedLessonRefs: (lesson.relatedLessonRefs ?? []).map((r) => r.slug).filter(Boolean),
    brokenRelatedRefs: broken,
    hasTakeawaysSection: kinds.has("takeaways"),
    examFocusCommonTrapsStringLen: examFocusTrapsLen(lesson),
    memoryAnchorPresent: hasMemoryAnchor(lesson),
  };
}

async function main() {
  const dbByPathway = await loadDbLessonsByPathway();
  const rawCatalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8")) as CatalogJson;
  const catalogIds = Object.keys(rawCatalog.pathways ?? {}).filter((id) => {
    const lessons = rawCatalog.pathways?.[id]?.lessons;
    return Array.isArray(lessons) && lessons.length > 0;
  });
  const registryIds = EXAM_PATHWAYS.filter((p) => p.status !== "hidden").map((p) => p.id);
  const pathwayIds = [...new Set([...catalogIds, ...registryIds, ...dbByPathway.keys()])].sort();

  const byPathway: Record<string, unknown> = {};
  const globalSummary = {
    generatedAt: new Date().toISOString(),
    databaseUrlConfigured: isDatabaseUrlConfigured(),
    catalogPathwayCount: catalogIds.length,
    pathwayIdsInventory: pathwayIds.length,
    notes: [
      "Marketing lesson pages call notFound() when structuralQuality.publicComplete is false — counted as non-resolving for public learners.",
      "When the hub uses published DB rows, catalog-only rows may not appear in the hub even if present in catalog.json; this report merges DB + effective catalog where possible.",
      "takeaways/commonTraps as string[] are not in PathwayLessonRecord yet; exam_focus.commonTraps is a single string in the current schema.",
    ],
  };

  const tierAggregates: Record<
    string,
    {
      lessons: number;
      marketingWouldRender: number;
      structuralGateFailed: number;
      thinContent: number;
      brokenRelatedRefs: number;
      duplicateSlugInRawCatalog: number;
    }
  > = {};

  for (const pathwayId of pathwayIds) {
    const tier = tierGroupForPathway(pathwayId);
    if (!tierAggregates[tier]) {
      tierAggregates[tier] = {
        lessons: 0,
        marketingWouldRender: 0,
        structuralGateFailed: 0,
        thinContent: 0,
        brokenRelatedRefs: 0,
        duplicateSlugInRawCatalog: 0,
      };
    }

    const fromJson = rawCatalog.pathways?.[pathwayId]?.lessons;
    const rawMerged =
      Array.isArray(fromJson) && fromJson.length > 0
        ? prependScopedGoldCatalogLessons(pathwayId, fromJson as Parameters<typeof prependScopedGoldCatalogLessons>[1])
        : prependScopedGoldCatalogLessons(pathwayId, []);
    const dupMap = collectDuplicateSlugs(rawMerged as { slug: string }[]);
    const dupSlugs = [...dupMap.entries()].filter(([, c]) => c > 1).length;
    tierAggregates[tier].duplicateSlugInRawCatalog += dupSlugs;

    const catalogEffective = getEffectiveCatalogLessonsForPathwaySync(pathwayId);
    const dbLessons = dbByPathway.get(pathwayId);
    const merged = mergeSources(pathwayId, catalogEffective, dbLessons);

    const slugSet = new Set<string>();
    for (const k of merged.keys()) slugSet.add(k);

    const rows: LessonAuditRow[] = [];
    for (const [slug, { lesson, sources }] of merged) {
      tierAggregates[tier].lessons += 1;
      const row = auditLessonRow(pathwayId, slug, lesson, sources, slugSet);
      rows.push(row);
      if (row.marketingWouldRender) tierAggregates[tier].marketingWouldRender += 1;
      else tierAggregates[tier].structuralGateFailed += 1;
      if (row.totalBodyChars < THIN_BODY_CHARS && row.marketingWouldRender) tierAggregates[tier].thinContent += 1;
      if (row.brokenRelatedRefs.length > 0) tierAggregates[tier].brokenRelatedRefs += 1;
    }

    byPathway[pathwayId] = {
      label: pathwayLabel(pathwayId),
      tierGroup: tier,
      marketingUrlPattern: marketingLessonsUrlForPathwayId(pathwayId),
      duplicateSlugBucketsInRawMergedCatalog: dupSlugs,
      catalogEffectiveCount: catalogEffective.length,
      dbPublishedEnCount: dbLessons?.length ?? 0,
      mergedUniqueSlugCount: merged.size,
      lessons: rows.sort((a, b) => a.slug.localeCompare(b.slug)),
    };
  }

  const alliedProfessions = ALLIED_PROFESSIONS.map((prof) => {
    const pathwayId = prof.pathwayId;
    const catalogEffective = getEffectiveCatalogLessonsForPathwaySync(pathwayId);
    const filtered = catalogEffective.filter((l) => alliedLessonMatchesProfessionFilter(l, prof.topicSlugsIn));
    const urlBase = alliedHealthLessonDetailPath(prof.professionKey, "{slug}");
    const wouldRender = filtered.filter((l) => l.structuralQuality?.publicComplete).length;
    return {
      professionKey: prof.professionKey,
      pathwayId,
      lessonsIndex: `/allied-health/${prof.professionKey}/lessons`,
      lessonDetailPattern: urlBase,
      catalogEffectiveCount: filtered.length,
      marketingWouldRenderCount: wouldRender,
      structuralGateFailedCount: filtered.length - wouldRender,
    };
  });

  const payload = {
    ...globalSummary,
    byTier: tierAggregates,
    byPathway,
    alliedProfessions,
  };

  if (!fs.existsSync(REPORTS)) fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(JSON_OUT, JSON.stringify(payload, null, 2), "utf8");

  const md: string[] = [];
  md.push(`# Lesson system inventory`);
  md.push("");
  md.push(`Generated: ${globalSummary.generatedAt}`);
  md.push(`Database URL configured: ${globalSummary.databaseUrlConfigured}`);
  md.push("");
  md.push(`## Summary by tier group`);
  md.push("");
  md.push("| Tier | Lessons (merged) | Marketing render | Gate failed | Thin body (<200 chars, render) | Broken related refs | Dup slug buckets (raw catalog) |");
  md.push("| --- | ---: | ---: | ---: | ---: | ---: | ---: |");
  for (const [tier, c] of Object.entries(tierAggregates).sort(([a], [b]) => a.localeCompare(b))) {
    md.push(
      `| ${tier} | ${c.lessons} | ${c.marketingWouldRender} | ${c.structuralGateFailed} | ${c.thinContent} | ${c.brokenRelatedRefs} | ${c.duplicateSlugInRawCatalog} |`,
    );
  }
  md.push("");
  md.push(`## Allied profession slices (catalog + topic filter)`);
  md.push("");
  md.push("| Profession | Pathway | Effective | Would render | Gate failed |");
  md.push("| --- | --- | ---: | ---: | ---: |");
  for (const a of alliedProfessions) {
    md.push(
      `| ${a.professionKey} | ${a.pathwayId} | ${a.catalogEffectiveCount} | ${a.marketingWouldRenderCount} | ${a.structuralGateFailedCount} |`,
    );
  }
  md.push("");
  md.push(`## Machine-readable output`);
  md.push("");
  md.push(`- \`${path.relative(ROOT, JSON_OUT)}\``);
  md.push("");
  md.push(`### Verification scope`);
  md.push("");
  md.push(
    "- This run is **static**: catalog JSON + Prisma (if configured). It does **not** start Next.js or open a browser.",
  );
  md.push("");

  fs.writeFileSync(MD_OUT, md.join("\n"), "utf8");
  console.log(`Wrote ${JSON_OUT}`);
  console.log(`Wrote ${MD_OUT}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    try {
      await prisma.$disconnect();
    } catch {
      /* ignore */
    }
  });
