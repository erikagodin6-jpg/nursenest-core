/**
 * Blueprint-driven catalog merge: brings core pathways to ≥150 merged lessons (catalog + scoped injects).
 *
 * Run: npx tsx scripts/run-blueprint-lesson-expansion.ts
 *
 * Idempotent: skips slugs already present in the pathway catalog slice.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { allBlueprintExpansionSlots2026 } from "@/lib/content-blueprint/blueprint-expansion-wave-2026";
import { buildExpansionCatalogLesson } from "@/lib/content-blueprint/blueprint-expansion-catalog-builder";
import { prependScopedGoldCatalogLessons } from "@/lib/lessons/scoped-lessons/scoped-gold-registry";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CATALOG_PATH = path.join(ROOT, "src/content/pathway-lessons/catalog.json");
const REPORT_DIR = path.join(ROOT, "data/reports");

type CatalogShape = {
  version: number;
  pathways: Record<string, { lessons: unknown[] }>;
};

const PATHWAYS: Array<{
  pathwayId: string;
  pathwayKey: "uslpn" | "carpn" | "usnp";
  label: string;
  /** Number of new catalog rows to append from the ordered slot pool. */
  addCount: number;
  /** Inclusive slice [start, end) into ordered slot array. */
  slotRange: [number, number];
}> = [
  { pathwayId: "us-lpn-nclex-pn", pathwayKey: "uslpn", label: "US LPN (NCLEX-PN)", addCount: 38, slotRange: [0, 38] },
  { pathwayId: "ca-rpn-rex-pn", pathwayKey: "carpn", label: "Canada RPN (REx-PN)", addCount: 38, slotRange: [38, 76] },
  { pathwayId: "us-np-fnp", pathwayKey: "usnp", label: "US NP (FNP)", addCount: 84, slotRange: [76, 160] },
];

function countMerged(pathwayId: string, catalog: CatalogShape): number {
  const fromJson = catalog.pathways[pathwayId]?.lessons ?? [];
  return prependScopedGoldCatalogLessons(pathwayId, fromJson as Parameters<typeof prependScopedGoldCatalogLessons>[1]).length;
}

function main(): void {
  const raw = fs.readFileSync(CATALOG_PATH, "utf8");
  const catalog = JSON.parse(raw) as CatalogShape;

  const before: Record<string, number> = {};
  for (const p of PATHWAYS) {
    before[p.pathwayId] = countMerged(p.pathwayId, catalog);
  }

  const slots = allBlueprintExpansionSlots2026();
  if (slots.length < 160) {
    throw new Error(`Slot pool size ${slots.length} < 160`);
  }

  const report: {
    before: Record<string, number>;
    after: Record<string, number>;
    addedByPathway: Record<string, number>;
    addedByDomain: Record<string, Record<string, number>>;
    skippedDuplicates: Array<{ pathwayId: string; slug: string }>;
  } = {
    before: { ...before },
    after: {},
    addedByPathway: {},
    addedByDomain: {},
    skippedDuplicates: [],
  };

  for (const p of PATHWAYS) {
    const [a, b] = p.slotRange;
    const slice = slots.slice(a, b);
    if (slice.length !== p.addCount) {
      throw new Error(`Slot slice length mismatch for ${p.pathwayId}: ${slice.length} vs ${p.addCount}`);
    }

    const bucket = catalog.pathways[p.pathwayId];
    if (!bucket?.lessons) {
      throw new Error(`Missing catalog bucket for ${p.pathwayId}`);
    }

    const existing = new Set(
      (bucket.lessons as { slug?: string }[]).map((l) => (typeof l.slug === "string" ? l.slug : "")).filter(Boolean),
    );

    const domainCounts: Record<string, number> = {};
    let added = 0;
    for (const slot of slice) {
      const row = buildExpansionCatalogLesson(p.pathwayKey, slot);
      if (existing.has(row.slug)) {
        report.skippedDuplicates.push({ pathwayId: p.pathwayId, slug: row.slug });
        continue;
      }
      bucket.lessons.push(row);
      existing.add(row.slug);
      added += 1;
      const dk = slot.blueprintDomain;
      domainCounts[dk] = (domainCounts[dk] ?? 0) + 1;
    }
    report.addedByPathway[p.pathwayId] = added;
    report.addedByDomain[p.pathwayId] = domainCounts;
  }

  for (const p of PATHWAYS) {
    report.after[p.pathwayId] = countMerged(p.pathwayId, catalog);
  }

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(path.join(REPORT_DIR, "blueprint-lesson-expansion-report.json"), JSON.stringify(report, null, 2), "utf8");
  fs.writeFileSync(CATALOG_PATH, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");

  console.log("=== Blueprint lesson expansion complete ===\n");
  console.log("Before (merged catalog + scoped injects):", JSON.stringify(before, null, 2));
  console.log("\nAdded rows by pathway:", report.addedByPathway);
  console.log("\nAfter:", JSON.stringify(report.after, null, 2));
  console.log("\nDomain mix (per pathway):", JSON.stringify(report.addedByDomain, null, 2));
  if (report.skippedDuplicates.length) {
    console.log("\nSkipped (slug already existed):", report.skippedDuplicates.length);
  }
  console.log(`\nReport: data/reports/blueprint-lesson-expansion-report.json`);
}

main();
