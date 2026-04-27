/**
 * RN NCLEX-RN lesson inventory (static + optional Prisma).
 * Invoked by debug-rn-lesson-inventory.mjs — do not import from app runtime.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { dedupePathwayLessonsForLibrary } from "@/lib/lessons/pathway-lesson-dedupe";
import {
  getCatalogPathwayLessonsSync,
  getEffectiveCatalogLessonsForPathwaySync,
  pathwayLessonMatchesMarketingPathwayContext,
} from "@/lib/lessons/pathway-lesson-catalog-sync";
import { pathwayLessonEligibleForPublicMarketingSurface } from "@/lib/lessons/pathway-lesson-route-access";
import { sortPathwayLessonsForPublicPreview } from "@/lib/lessons/pathway-lesson-public-preview-priority";
import { pathwayLessonHasRenderableHubSlug } from "@/lib/lessons/pathway-lesson-types";
import { ContentStatus } from "@prisma/client";

const RN_PATHWAYS = ["us-rn-nclex-rn", "ca-rn-nclex-rn"] as const;

type JsonLesson = { slug: string; title: string; topic: string; topicSlug: string; bodySystem: string };

type CatalogFileShape = {
  pathways?: Record<string, { lessons?: JsonLesson[] }>;
};

function readJson<T>(p: string): T {
  return JSON.parse(readFileSync(p, "utf8")) as T;
}

function slugSetFromPathwayFile(
  data: CatalogFileShape,
  pathwayId: string,
  fileLabel: string,
): Map<string, string> {
  const m = new Map<string, string>();
  const rows = data.pathways?.[pathwayId]?.lessons ?? [];
  for (const r of rows) {
    if (r.slug) m.set(r.slug, fileLabel);
  }
  return m;
}

function resolveSourceSlug(
  slug: string,
  pathwayId: string,
  primary: Map<string, string>,
  allied: Map<string, string>,
  newGrad: Map<string, string>,
): string {
  if (primary.has(slug)) return primary.get(slug)!;
  if (allied.has(slug)) return allied.get(slug)!;
  if (newGrad.has(slug)) return newGrad.get(slug)!;
  return "scoped-gold-registry|prependScopedGoldCatalogLessons";
}

function tsvCell(s: string): string {
  const t = String(s ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " ");
  return t;
}

function simulatedHubList(pathwayId: string, lessons: ReturnType<typeof getCatalogPathwayLessonsSync>) {
  const afterSafe = lessons.filter((l) => pathwayLessonHasRenderableHubSlug(l));
  const afterCtx = sortPathwayLessonsForPublicPreview(
    pathwayId,
    afterSafe.filter((l) => pathwayLessonMatchesMarketingPathwayContext(pathwayId, l)),
  );
  const deduped = dedupePathwayLessonsForLibrary(afterCtx, {
    pathwayIdHint: pathwayId,
    source: `inventory:${pathwayId}`,
    devLog: false,
  });
  return new Set(deduped.items.map((l) => l.slug));
}

async function loadDbRows(): Promise<
  Array<{
    id: string;
    pathwayId: string;
    slug: string;
    title: string;
    topic: string;
    topicSlug: string;
    bodySystem: string;
    locale: string;
  }>
> {
  if (!process.env.DATABASE_URL?.trim()) return [];
  try {
    const { prisma } = await import("@/lib/db");
    const rows = await prisma.pathwayLesson.findMany({
      where: {
        pathwayId: { in: [...RN_PATHWAYS] },
        status: ContentStatus.PUBLISHED,
      },
      select: {
        id: true,
        pathwayId: true,
        slug: true,
        title: true,
        topic: true,
        topicSlug: true,
        bodySystem: true,
        locale: true,
      },
    });
    return rows;
  } catch {
    return [];
  }
}

async function main() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const coreRoot = path.resolve(__dirname, "..");

  const catalogPath = path.join(coreRoot, "src/content/pathway-lessons/catalog.json");
  const alliedPath = path.join(coreRoot, "src/content/pathway-lessons/allied-bundled-catalog.json");
  const newGradPath = path.join(coreRoot, "src/content/pathway-lessons/new-grad-transition-catalog.json");

  const catalogJson = readJson<CatalogFileShape>(catalogPath);
  const alliedJson = readJson<CatalogFileShape>(alliedPath);
  const newGradRaw = readJson<{ pathways?: Record<string, { lessons?: JsonLesson[] }> }>(newGradPath);

  const primaryByPathway = new Map<string, Map<string, string>>();
  for (const pid of RN_PATHWAYS) {
    const m = new Map<string, string>();
    for (const [slug] of slugSetFromPathwayFile(catalogJson, pid, `catalog.json:${pid}`)) {
      m.set(slug, `catalog.json:${pid}`);
    }
    primaryByPathway.set(pid, m);
  }

  const alliedMaps = new Map<string, Map<string, string>>();
  const newGradMaps = new Map<string, Map<string, string>>();
  for (const pid of RN_PATHWAYS) {
    alliedMaps.set(pid, slugSetFromPathwayFile(alliedJson, pid, `allied-bundled-catalog.json:${pid}`));
    const ng = new Map<string, string>();
    const rows = newGradRaw.pathways?.[pid]?.lessons ?? [];
    for (const r of rows) {
      if (r.slug) ng.set(r.slug, `new-grad-transition-catalog.json:${pid}`);
    }
    newGradMaps.set(pid, ng);
  }

  const headers = [
    "source_file",
    "pathway",
    "lesson_id",
    "lesson_slug",
    "title",
    "topic",
    "topic_slug",
    "body_system",
    "public_complete_marketing_surface",
    "matches_pathway_context",
    "in_simulated_catalog_hub_list",
    "in_effective_catalog_marketing_list",
  ];
  console.log(headers.join("\t"));

  const allSlugsGlobal = new Set<string>();
  const byPathwaySlug = new Map<string, Set<string>>();
  for (const pid of RN_PATHWAYS) byPathwaySlug.set(pid, new Set());

  for (const pathwayId of RN_PATHWAYS) {
    const lessons = getCatalogPathwayLessonsSync(pathwayId);
    const hubSim = simulatedHubList(pathwayId, lessons);
    const effectiveSet = new Set(
      getEffectiveCatalogLessonsForPathwaySync(pathwayId).map((l) => l.slug),
    );
    const primary = primaryByPathway.get(pathwayId)!;
    const allied = alliedMaps.get(pathwayId)!;
    const newGrad = newGradMaps.get(pathwayId)!;

    for (const l of lessons) {
      const source = resolveSourceSlug(l.slug, pathwayId, primary, allied, newGrad);
      const lessonId = `catalog-sync:${pathwayId}:${l.slug}`;
      const pub = pathwayLessonEligibleForPublicMarketingSurface(l);
      const ctx = pathwayLessonMatchesMarketingPathwayContext(pathwayId, l);
      const row = [
        source,
        pathwayId,
        lessonId,
        l.slug,
        l.title,
        l.topic,
        l.topicSlug,
        l.bodySystem,
        pub ? "1" : "0",
        ctx ? "1" : "0",
        hubSim.has(l.slug) ? "1" : "0",
        effectiveSet.has(l.slug) ? "1" : "0",
      ].map(tsvCell);
      console.log(row.join("\t"));
      allSlugsGlobal.add(`${pathwayId}::${l.slug}`);
      byPathwaySlug.get(pathwayId)!.add(l.slug);
    }
  }

  const slugToPathways = new Map<string, Set<string>>();
  const titleIndex = new Map<string, Map<string, string[]>>(); // pathway -> normTitle -> slugs[]

  function normTitle(t: string) {
    return t
      .toLowerCase()
      .replace(/\s*\(nclex-rn,\s*(us|canada)\)\s*$/i, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  for (const pathwayId of RN_PATHWAYS) {
    const lessons = getCatalogPathwayLessonsSync(pathwayId);
    const byTitle = new Map<string, string[]>();
    for (const l of lessons) {
      const nt = normTitle(l.title);
      if (!byTitle.has(nt)) byTitle.set(nt, []);
      byTitle.get(nt)!.push(l.slug);
      let s = slugToPathways.get(l.slug);
      if (!s) {
        s = new Set();
        slugToPathways.set(l.slug, s);
      }
      s.add(pathwayId);
    }
    titleIndex.set(pathwayId, byTitle);
  }

  const duplicateTitlesByPathway: Record<string, Array<{ titleNorm: string; slugs: string[] }>> = {};
  for (const pathwayId of RN_PATHWAYS) {
    const byTitle = titleIndex.get(pathwayId)!;
    const dups: Array<{ titleNorm: string; slugs: string[] }> = [];
    for (const [titleNorm, slugs] of byTitle) {
      const uniq = [...new Set(slugs)];
      if (uniq.length > 1) dups.push({ titleNorm, slugs: uniq });
    }
    duplicateTitlesByPathway[pathwayId] = dups.sort((a, b) => b.slugs.length - a.slugs.length).slice(0, 40);
  }

  const sharedSlugsAcrossPathways = [...slugToPathways.entries()]
    .filter(([, p]) => p.size > 1)
    .map(([slug, p]) => ({ slug, pathways: [...p] }))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const dbRows = await loadDbRows();
  for (const r of dbRows) {
    const row = [
      "prisma.pathway_lesson",
      r.pathwayId,
      r.id,
      r.slug,
      r.title,
      r.topic,
      r.topicSlug,
      r.bodySystem,
      "n/a_use_loader",
      "n/a_use_loader",
      "n/a_use_loader",
      "n/a_use_loader",
    ].map(tsvCell);
    console.log(row.join("\t"));
    allSlugsGlobal.add(`db:${r.pathwayId}::${r.slug}`);
  }

  // --- stderr summary ---
  const summary: Record<string, unknown> = {
    rnPathways: RN_PATHWAYS,
    filesRead: [catalogPath, alliedPath, newGradPath],
    countsByPathwayCatalogSync: {} as Record<string, number>,
    countsByPathwayRawJsonCatalog: {} as Record<string, number>,
    countsSimulatedHubList: {} as Record<string, number>,
    countsEffectiveMarketingCatalog: {} as Record<string, number>,
    /** Rows from {@link getCatalogPathwayLessonsSync} (catalog.json bucket + scoped-gold prepend + allied + new-grad merge). */
    totalCatalogSyncRows: [...RN_PATHWAYS].reduce(
      (n, pid) => n + getCatalogPathwayLessonsSync(pid).length,
      0,
    ),
    uniquePathwaySlugPairs: allSlugsGlobal.size,
    sharedSlugAcrossUsAndCa: sharedSlugsAcrossPathways,
    duplicateNormalizedTitlesSample: duplicateTitlesByPathway,
    prismaPublishedRows: dbRows.length,
  };

  for (const pathwayId of RN_PATHWAYS) {
    const lessons = getCatalogPathwayLessonsSync(pathwayId);
    summary.countsByPathwayCatalogSync[pathwayId] = lessons.length;
    summary.countsSimulatedHubList[pathwayId] = simulatedHubList(pathwayId, lessons).size;
    summary.countsEffectiveMarketingCatalog[pathwayId] =
      getEffectiveCatalogLessonsForPathwaySync(pathwayId).length;
    summary.countsByPathwayRawJsonCatalog[pathwayId] =
      catalogJson.pathways?.[pathwayId]?.lessons?.length ?? 0;
  }

  if (process.argv.includes("--json-summary")) {
    console.error(JSON.stringify(summary, null, 2));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
