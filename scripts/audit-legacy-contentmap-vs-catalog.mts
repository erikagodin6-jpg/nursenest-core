#!/usr/bin/env npx tsx
/**
 * Offline audit: legacy monolith `client/src/data/lessons` contentMap vs pathway `catalog.json`.
 *
 * - Loads the full legacy contentMap (same source as historical recovery scripts).
 * - Loads catalog slugs per pathway from `src/content/pathway-lessons/catalog.json`.
 * - Classifies legacy lesson IDs by coarse tier heuristics (PN / RN / NP / Allied / unclassified).
 * - Reports overlap: legacy IDs that match a catalog slug in any pathway (same slug string).
 * - Does NOT mutate catalog, DB, or routing.
 *
 * Output: data/audit/legacy-vs-catalog-<timestamp>.json
 *
 * Run: npx tsx scripts/audit-legacy-contentmap-vs-catalog.mts
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";
import catalogJson from "../src/content/pathway-lessons/catalog.json";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const AUDIT_DIR = path.join(ROOT, "data", "audit");

type CatalogShape = { pathways?: Record<string, { lessons?: { slug?: string }[] }> };

function tierHeuristic(lessonId: string): "PN" | "RN" | "NP" | "Allied" | "unclassified" {
  const id = lessonId.toLowerCase();
  const alliedHints =
    /(^|-)(rrt|paramedic|mlt|imaging|surgical-tech|sonography|dms-|ota|pta|echo|allied|social-worker|psychotherapist|addictions|occupational-therapy|pharmacy-tech|surgical)/.test(
      id,
    ) || id.includes("mlt-") || id.includes("rrt-");
  if (alliedHints) return "Allied";
  if (/(^|-)(rpn|lpn|rex|practical-nurse)/.test(id) || id.startsWith("rpn") || id.startsWith("lpn"))
    return "PN";
  if (/(^|-)np-/.test(id) || id.includes("-np-") || /\bnp[A-Z]/.test(lessonId)) return "NP";
  if (
    id.includes("rn-") ||
    id.startsWith("rn") ||
    /cardiovascular|respiratory|renal|maternity|pediatric|fundamentals/.test(id) ||
    id.includes("generated-batch") ||
    id.includes("clinical-conditions-batch") ||
    id.includes("missing-batch") ||
    id.includes("lesson-repair") ||
    /(^|-)(icu|picu|emergency|critical-care|trauma|burn|sepsis)-/.test(id)
  )
    return "RN";
  return "unclassified";
}

async function loadLegacyContentMap(): Promise<{
  lessonCount: number;
  contentMap: Record<string, unknown>;
}> {
  const clientIndex = path.resolve(ROOT, "../client/src/data/lessons/index.ts");
  const mod = (await import(pathToFileURL(clientIndex).href)) as {
    contentMap?: Record<string, unknown>;
    lessonCount?: number;
  };
  if (!mod.contentMap) {
    throw new Error(`Legacy index missing contentMap: ${clientIndex}`);
  }
  return {
    lessonCount: mod.lessonCount ?? Object.keys(mod.contentMap).length,
    contentMap: mod.contentMap,
  };
}

function collectCatalogSlugsByPathway(): Map<string, Set<string>> {
  const pathways = (catalogJson as CatalogShape).pathways ?? {};
  const m = new Map<string, Set<string>>();
  for (const [pid, bucket] of Object.entries(pathways)) {
    const set = new Set<string>();
    for (const row of bucket.lessons ?? []) {
      const s = typeof row.slug === "string" ? row.slug.trim() : "";
      if (s) set.add(s);
    }
    m.set(pid, set);
  }
  return m;
}

function main() {
  void (async () => {
    const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const outPath = path.join(AUDIT_DIR, `legacy-vs-catalog-${ts}.json`);

    const [{ lessonCount, contentMap }, byPathway] = await Promise.all([
      loadLegacyContentMap(),
      Promise.resolve(collectCatalogSlugsByPathway()),
    ]);

    const legacyIds = Object.keys(contentMap);
    const allCatalogSlugs = new Set<string>();
    for (const s of byPathway.values()) {
      for (const slug of s) allCatalogSlugs.add(slug);
    }

    const tierCounts: Record<string, number> = { PN: 0, RN: 0, NP: 0, Allied: 0, unclassified: 0 };
    const legacyInCatalog = new Set<string>();
    const legacyNotInCatalog: string[] = [];

    for (const id of legacyIds) {
      const t = tierHeuristic(id);
      tierCounts[t] = (tierCounts[t] ?? 0) + 1;
      if (allCatalogSlugs.has(id)) {
        legacyInCatalog.add(id);
      } else {
        legacyNotInCatalog.push(id);
      }
    }

    const perPathwayOverlap: Record<string, { catalogSlugs: number; alsoInLegacy: number }> = {};
    for (const [pid, slugs] of byPathway) {
      let alsoInLegacy = 0;
      for (const slug of slugs) {
        if (contentMap[slug] != null) alsoInLegacy += 1;
      }
      perPathwayOverlap[pid] = { catalogSlugs: slugs.size, alsoInLegacy };
    }

    const report = {
      generatedAt: new Date().toISOString(),
      sources: {
        legacyContentMap: path.relative(ROOT, path.resolve(ROOT, "../client/src/data/lessons/index.ts")),
        pathwayCatalog: "src/content/pathway-lessons/catalog.json",
      },
      summary: {
        legacyLessonIds: legacyIds.length,
        legacyLessonCountExport: lessonCount,
        catalogPathwayIds: [...byPathway.keys()].sort(),
        uniqueCatalogSlugsAcrossPathways: allCatalogSlugs.size,
        legacyIdsMatchingAnyCatalogSlug: legacyInCatalog.size,
        legacyIdsNotInAnyCatalogSlug: legacyNotInCatalog.length,
        tierHeuristicCounts: tierCounts,
      },
      perPathwayLegacySlugOverlap: perPathwayOverlap,
      notes: [
        "Tier labels on legacy IDs are heuristic only (filename/id patterns), not editorial truth.",
        "Pathway catalog currently has no us-allied-core / ca-allied-core keys — Allied hub lessons must be added to catalog.json in a separate merge pass (use convert-legacy-lesson-to-enrichment or NP/RN recovery patterns).",
        "Slug equality is the only overlap signal here; aliases need rn-nclex-master-map / recovery scripts.",
      ],
      legacyIdsNotInCatalogSample: legacyNotInCatalog.slice(0, 200),
    };

    fs.mkdirSync(AUDIT_DIR, { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");

    console.log(`\nWritten: ${path.relative(ROOT, outPath)}\n`);
    console.log(JSON.stringify(report.summary, null, 2));
    console.log("\nPer-pathway overlap (catalog slug present in legacy contentMap by same id):");
    console.log(JSON.stringify(perPathwayOverlap, null, 2));
  })().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

main();
