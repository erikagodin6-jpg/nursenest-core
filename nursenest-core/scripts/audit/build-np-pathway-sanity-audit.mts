/**
 * NP pathway sanity: country/exam alignment, duplicate slugs, RN/PN contamination hints.
 * Run: cd nursenest-core && npx tsx scripts/audit/build-np-pathway-sanity-audit.mts
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { ExamFamily } from "@prisma/client";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..", "..");
const AUDIT = join(ROOT, "data/audit/lesson-completeness-audit.json");
const CATALOG = join(__dirname, "../../src/content/pathway-lessons/catalog.json");
const OUT = join(ROOT, "data/audit/np-pathway-sanity-audit.json");

type AuditLesson = {
  lessonId: string;
  pathwayId: string;
  slug: string;
  title: string;
  country: string;
  exam: string;
};
type CatalogJson = {
  pathways: Record<string, { lessons: Array<{ slug: string; title: string }> }>;
};

function main() {
  const audit = JSON.parse(readFileSync(AUDIT, "utf8")) as { lessons: AuditLesson[]; generatedAt: string };
  const catalog = JSON.parse(readFileSync(CATALOG, "utf8")) as CatalogJson;
  const npDefs = EXAM_PATHWAYS.filter((p: ExamPathwayDefinition) => p.examFamily === ExamFamily.NP);
  const npIds = new Set(npDefs.map((p) => p.id));

  const slugToPathways = new Map<string, Set<string>>();
  for (const l of audit.lessons) {
    if (!npIds.has(l.pathwayId)) continue;
    if (!slugToPathways.has(l.slug)) slugToPathways.set(l.slug, new Set());
    slugToPathways.get(l.slug)!.add(l.pathwayId);
  }

  const duplicateAcrossNp = [...slugToPathways.entries()]
    .filter(([, s]) => s.size > 1)
    .map(([slug, pathways]) => ({ slug, pathways: [...pathways].sort() }));

  const mismatches: Array<{ lessonId: string; issue: string }> = [];
  const defById = new Map(npDefs.map((p) => [p.id, p] as const));

  for (const l of audit.lessons) {
    if (!npIds.has(l.pathwayId)) continue;
    const def = defById.get(l.pathwayId);
    if (!def) continue;
    if (l.country !== def.countrySlug) {
      mismatches.push({
        lessonId: l.lessonId,
        issue: `Audit country "${l.country}" differs from registry countrySlug "${def.countrySlug}" for ${l.pathwayId}`,
      });
    }
    if (l.exam !== def.examCode) {
      mismatches.push({
        lessonId: l.lessonId,
        issue: `Audit exam "${l.exam}" differs from registry examCode "${def.examCode}" for ${l.pathwayId}`,
      });
    }
  }

  /** Slug appears in NP audit but title strongly suggests another tier (heuristic). */
  const tierHints: Array<{ lessonId: string; note: string }> = [];
  for (const l of audit.lessons) {
    if (!npIds.has(l.pathwayId)) continue;
    const t = (l.title ?? "").toLowerCase();
    if (/\bnclex-rn\b|\brn-only\b|\bregistered nurse\b(?!\s*to\s*np)/i.test(t)) {
      tierHints.push({ lessonId: l.lessonId, note: "Title may reference RN context; verify NP scoping in body." });
    }
  }

  const catalogOrphans: string[] = [];
  for (const p of npDefs) {
    const lessons = catalog.pathways[p.id]?.lessons ?? [];
    for (const row of lessons) {
      const hit = audit.lessons.find((a) => a.pathwayId === p.id && a.slug === row.slug);
      if (!hit) catalogOrphans.push(`${p.id}:${row.slug}`);
    }
  }

  const json = {
    generatedAt: new Date().toISOString(),
    sourceAuditGeneratedAt: audit.generatedAt,
    npPathwayIds: [...npIds],
    duplicateSlugAcrossNpPathways: duplicateAcrossNp,
    countryOrExamMismatchesVsRegistry: mismatches,
    titleTierReviewHints: tierHints.slice(0, 200),
    catalogRowsMissingFromAudit: catalogOrphans.slice(0, 200),
    notes: [
      "Canada NP (ca-np-cnple) may be upcoming in registry while lessons are absent from bundled catalog.",
      "US NP tracks are intentionally separate products—duplicate slugs across NP pathways should be rare; investigate if present.",
    ],
  };

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, `${JSON.stringify(json, null, 2)}\n`, "utf8");
  console.log("Wrote", OUT, "dupes", duplicateAcrossNp.length, "mismatches", mismatches.length);
}

main();
