#!/usr/bin/env npx tsx
import "../src/lib/db/env-bootstrap";

import fs from "node:fs";
import path from "node:path";
import { ContentStatus, PrismaClient } from "@prisma/client";
import { PRE_NURSING_COURSES } from "@/lib/pre-nursing/pre-nursing-courses";
import {
  generatePreNursingDetailStaticParams,
  getPreNursingLessonBySlug,
  listPreNursingCourseCounts,
} from "@/lib/pre-nursing/pre-nursing-lesson-loader";
import { collectCoreUrls, resolveSitemapOrigin } from "@/lib/seo/sitemap-static-xml";

type LessonRow = {
  id: string;
  pathwayId: string;
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  seoTitle: string;
  status: ContentStatus;
  locale: string;
  sections: unknown;
  createdAt: Date;
  updatedAt: Date;
};

type SourceKind = "generated" | "imported-existing" | "unknown";
type QualityTag = "imported-rich" | "imported-fragmentary" | "generated" | "needs-enrichment";

function flag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 3);
}

function jaccard(a: string, b: string): number {
  const sa = new Set(tokens(a));
  const sb = new Set(tokens(b));
  if (sa.size === 0 || sb.size === 0) return 0;
  let inter = 0;
  for (const x of sa) if (sb.has(x)) inter += 1;
  const union = new Set([...sa, ...sb]).size;
  return union === 0 ? 0 : inter / union;
}

function sectionBodies(sections: unknown): string[] {
  if (!Array.isArray(sections)) return [];
  return sections
    .map((s) => {
      if (!s || typeof s !== "object") return "";
      const body = (s as { body?: unknown }).body;
      return typeof body === "string" ? body : "";
    })
    .filter(Boolean);
}

function sectionHeading0(sections: unknown): string {
  if (!Array.isArray(sections) || sections.length === 0) return "";
  const first = sections[0] as { heading?: unknown } | undefined;
  return typeof first?.heading === "string" ? first.heading : "";
}

function classifySource(row: LessonRow): SourceKind {
  const h0 = sectionHeading0(row.sections);
  if (h0 === "What this means for pre-nursing learners") return "generated";
  if (h0 === "Foundational concept") return "imported-existing";
  return "unknown";
}

function totalBodyChars(row: LessonRow): number {
  return sectionBodies(row.sections).reduce((acc, cur) => acc + cur.length, 0);
}

function classifyQuality(row: LessonRow): QualityTag {
  const source = classifySource(row);
  if (source === "generated") return "generated";
  if (source === "imported-existing") {
    const bodies = sectionBodies(row.sections);
    const firstBody = bodies[0] ?? "";
    const firstBodyTitleEcho = jaccard(firstBody, row.title) >= 0.8 && firstBody.length <= 100;
    if (firstBodyTitleEcho) return "imported-fragmentary";
    return totalBodyChars(row) >= 420 ? "imported-rich" : "imported-fragmentary";
  }
  return "needs-enrichment";
}

function byCourseFromPathway(pathwayId: string): string {
  const hit = PRE_NURSING_COURSES.find((c) => c.pathwayId === pathwayId);
  return hit?.slug ?? pathwayId.replace(/^pre-nursing-/, "");
}

function safeReadJson(p: string): Record<string, unknown> | null {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8")) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function main() {
  const apply = flag("apply");
  const prisma = new PrismaClient();
  const outDir = path.join(process.cwd(), "data/reports/pre-nursing");
  fs.mkdirSync(outDir, { recursive: true });

  const rows = await prisma.pathwayLesson.findMany({
    where: { pathwayId: { startsWith: "pre-nursing-" }, locale: "en" },
    select: {
      id: true,
      pathwayId: true,
      slug: true,
      title: true,
      topic: true,
      topicSlug: true,
      seoTitle: true,
      status: true,
      locale: true,
      sections: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: [{ pathwayId: "asc" }, { slug: "asc" }],
  });

  const published = rows.filter((r) => r.status === ContentStatus.PUBLISHED);
  const byCourseCounts = new Map<string, number>();
  for (const r of published) {
    const c = byCourseFromPathway(r.pathwayId);
    byCourseCounts.set(c, (byCourseCounts.get(c) ?? 0) + 1);
  }

  const sourceCounts = { generated: 0, importedExisting: 0, unknown: 0 };
  const qualityCounts = { importedRich: 0, importedFragmentary: 0, generated: 0, needsEnrichment: 0 };
  for (const r of published) {
    const src = classifySource(r);
    if (src === "generated") sourceCounts.generated += 1;
    else if (src === "imported-existing") sourceCounts.importedExisting += 1;
    else sourceCounts.unknown += 1;

    const q = classifyQuality(r);
    if (q === "generated") qualityCounts.generated += 1;
    else if (q === "imported-rich") qualityCounts.importedRich += 1;
    else if (q === "imported-fragmentary") qualityCounts.importedFragmentary += 1;
    else qualityCounts.needsEnrichment += 1;
  }

  // Canonical 70-course seed rows from PRE_NURSING_COURSES.
  const canonicalPairs = new Set(PRE_NURSING_COURSES.flatMap((c) => c.lessons.map((l) => `${c.pathwayId}::${l.slug}`)));
  const canonicalPublished = published.filter((r) => canonicalPairs.has(`${r.pathwayId}::${r.slug}`)).length;
  const canonicalAnyStatus = rows.filter((r) => canonicalPairs.has(`${r.pathwayId}::${r.slug}`)).length;

  // Duplicate/collision audit.
  const slugKey = new Map<string, LessonRow[]>();
  for (const r of published) {
    const key = `${r.pathwayId}::${r.slug}`;
    const list = slugKey.get(key) ?? [];
    list.push(r);
    slugKey.set(key, list);
  }
  const duplicateSlugWithinPathway = [...slugKey.entries()].filter(([, list]) => list.length > 1);

  // Concept overlap (generated vs imported-existing) in same pathway.
  const byPathway = new Map<string, LessonRow[]>();
  for (const r of published) {
    const list = byPathway.get(r.pathwayId) ?? [];
    list.push(r);
    byPathway.set(r.pathwayId, list);
  }
  const overlapPairs: Array<{
    pathwayId: string;
    keepId: string;
    keepSlug: string;
    keepTitle: string;
    dropId: string;
    dropSlug: string;
    dropTitle: string;
    score: number;
    reason: string;
  }> = [];

  for (const [pathwayId, list] of byPathway) {
    const generated = list.filter((r) => classifySource(r) === "generated");
    const imported = list.filter((r) => classifySource(r) === "imported-existing");
    for (const g of generated) {
      let best: LessonRow | null = null;
      let bestScore = 0;
      for (const i of imported) {
        const s = jaccard(g.title, i.title);
        if (s > bestScore) {
          bestScore = s;
          best = i;
        }
      }
      if (!best || bestScore < 0.62) continue;
      const gLen = totalBodyChars(g);
      const iLen = totalBodyChars(best);
      const keepImported = iLen >= gLen;
      overlapPairs.push({
        pathwayId,
        keepId: keepImported ? best.id : g.id,
        keepSlug: keepImported ? best.slug : g.slug,
        keepTitle: keepImported ? best.title : g.title,
        dropId: keepImported ? g.id : best.id,
        dropSlug: keepImported ? g.slug : best.slug,
        dropTitle: keepImported ? g.title : best.title,
        score: Number(bestScore.toFixed(3)),
        reason: keepImported
          ? "High title similarity and imported row has equal/greater content length"
          : "High title similarity but generated row is richer; keep generated",
      });
    }
  }

  // Apply only safe demotions: generated loser where imported winner is richer.
  const toDemote = overlapPairs.filter((p) => p.reason.includes("imported row has")).map((p) => p.dropId);
  let demoted = 0;
  if (apply && toDemote.length > 0) {
    const result = await prisma.pathwayLesson.updateMany({
      where: { id: { in: toDemote }, status: ContentStatus.PUBLISHED },
      data: { status: ContentStatus.DRAFT },
    });
    demoted = result.count;
  }

  // Route and sitemap checks.
  const hubCounts = await listPreNursingCourseCounts();
  const detailParams = await generatePreNursingDetailStaticParams();
  const failedDetails: Array<{ slug: string; lessonSlug: string }> = [];
  for (const p of detailParams) {
    const row = await getPreNursingLessonBySlug(p.slug, p.lessonSlug);
    if (!row) failedDetails.push(p);
  }
  const origin = resolveSitemapOrigin();
  const coreUrls = await collectCoreUrls(origin);
  const hubUrls = PRE_NURSING_COURSES.map((c) => `${origin}/pre-nursing/${c.slug}`);
  const detailUrls = detailParams.map((p) => `${origin}/pre-nursing/${p.slug}/${p.lessonSlug}`);
  const missingHubUrls = hubUrls.filter((u) => !coreUrls.includes(u));
  const missingDetailUrls = detailUrls.filter((u) => !coreUrls.includes(u));

  const createdByDate: Record<string, number> = {};
  const updatedByDate: Record<string, number> = {};
  for (const r of rows) {
    const c = r.createdAt.toISOString().slice(0, 10);
    const u = r.updatedAt.toISOString().slice(0, 10);
    createdByDate[c] = (createdByDate[c] ?? 0) + 1;
    updatedByDate[u] = (updatedByDate[u] ?? 0) + 1;
  }
  const seedSummary = safeReadJson(path.join(outDir, "seed-summary.json"));
  const existingSummary = safeReadJson(path.join(outDir, "existing-import-summary.json"));

  const finalCourseCounts = Object.fromEntries([...byCourseCounts.entries()].sort(([a], [b]) => a.localeCompare(b)));
  const duplicateAudit = {
    generatedAt: new Date().toISOString(),
    apply,
    duplicateSlugWithinPathwayCount: duplicateSlugWithinPathway.length,
    conceptOverlapPairsCount: overlapPairs.length,
    safeDemotionCandidates: toDemote.length,
    demotedToDraft: demoted,
    overlaps: overlapPairs.slice(0, 200),
  };
  const inventoryReport = {
    generatedAt: new Date().toISOString(),
    authoritativePublishedDbTotal: published.length - demoted,
    pathwayLessonsTableTotalEn: rows.length,
    countsByCourse: finalCourseCounts,
    countsBySource: sourceCounts,
    countsByQuality: qualityCounts,
    canonicalSeedRowsStillPresent: {
      published: canonicalPublished,
      anyStatus: canonicalAnyStatus,
      expectedCanonical: canonicalPairs.size,
    },
    historicalRunContext: {
      seedSummary,
      existingImportSummary: existingSummary,
      interpretation:
        "The original 70 canonical rows still exist; the later import added/updated additional existing-source rows, producing a larger consolidated DB total.",
    },
    timestamps: {
      createdByDate,
      updatedByDate,
    },
    routeValidation: {
      hubRouteCount: hubCounts.length,
      detailRouteCount: detailParams.length,
      failedDetailRoutes: failedDetails.length,
      sampleUrlsByCourse: PRE_NURSING_COURSES.map((c) => ({
        course: c.slug,
        hub: `/pre-nursing/${c.slug}`,
        sampleDetail: detailParams.find((p) => p.slug === c.slug)
          ? `/pre-nursing/${c.slug}/${detailParams.find((p) => p.slug === c.slug)!.lessonSlug}`
          : null,
      })),
    },
    sitemapValidation: {
      missingHubUrls: missingHubUrls.length,
      missingDetailUrls: missingDetailUrls.length,
      missingHubUrlSamples: missingHubUrls.slice(0, 20),
      missingDetailUrlSamples: missingDetailUrls.slice(0, 20),
    },
  };
  const qualityAudit = {
    generatedAt: new Date().toISOString(),
    totalPublished: published.length - demoted,
    rows: published.map((r) => ({
      pathwayId: r.pathwayId,
      course: byCourseFromPathway(r.pathwayId),
      slug: r.slug,
      title: r.title,
      source: classifySource(r),
      quality: classifyQuality(r),
      bodyChars: totalBodyChars(r),
      needsEnrichment: classifyQuality(r) === "imported-fragmentary" || classifyQuality(r) === "needs-enrichment",
    })),
  };

  fs.writeFileSync(path.join(outDir, "final-course-counts.json"), JSON.stringify(finalCourseCounts, null, 2));
  fs.writeFileSync(path.join(outDir, "final-duplicate-audit.json"), JSON.stringify(duplicateAudit, null, 2));
  fs.writeFileSync(path.join(outDir, "final-inventory-report.json"), JSON.stringify(inventoryReport, null, 2));
  fs.writeFileSync(path.join(outDir, "content-quality-audit.json"), JSON.stringify(qualityAudit, null, 2));

  console.log(
    JSON.stringify(
      {
        phase: "final",
        apply,
        authoritativePublishedDbTotal: inventoryReport.authoritativePublishedDbTotal,
        countsByCourse: finalCourseCounts,
        countsBySource: sourceCounts,
        canonicalSeedRowsStillPresent: inventoryReport.canonicalSeedRowsStillPresent,
        detailRouteCount: detailParams.length,
        failedDetailRoutes: failedDetails.length,
        sitemapMissingHubUrls: missingHubUrls.length,
        sitemapMissingDetailUrls: missingDetailUrls.length,
        demotedToDraft: demoted,
      },
      null,
      2,
    ),
  );

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

