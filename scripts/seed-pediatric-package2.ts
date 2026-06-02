#!/usr/bin/env npx tsx
/**
 * Package 2 Pediatric Nursing Sprint — seed script
 *
 * Reads all peds-s*-catalog.json files, merges lessons, generates 6 pathway
 * variants, distributes to catalog files, updates snapshot, and prints a
 * completion report.
 *
 * Usage:
 *   npx tsx scripts/seed-pediatric-package2.ts [--dry-run]
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "nursenest-core");
const CONTENT_DIR = path.join(ROOT, "src/content/pathway-lessons");
const SNAPSHOT_PATH = path.join(ROOT, "src/config/pathway-readiness-snapshot.json");
const DRY_RUN = process.argv.includes("--dry-run");

// ─── Types ────────────────────────────────────────────────────────────────────

type Lesson = Record<string, unknown> & { slug: string; exams?: string[]; countries?: string[]; audienceTiers?: string[] };

type SectionCatalog = {
  version: number;
  generatedAt: string;
  source: string;
  section: string;
  pathways: { "ca-rpn-rex-pn": Lesson[] };
};

type MainCatalog = {
  version: number;
  pathways: Record<string, { lessons: Lesson[] }>;
};

type FlatCatalog = {
  version: number;
  generatedAt?: string;
  source?: string;
  lessons: Lesson[];
  [k: string]: unknown;
};

type ExpansionCatalog = {
  version: number;
  generatedAt?: string;
  source?: string;
  pathways: Record<string, Lesson[]>;
};

type Snapshot = {
  _meta: Record<string, string>;
  [pathwayId: string]: { lessons: number; questions: number; updatedAt: string } | Record<string, string>;
};

// ─── Pathway adaptation config ────────────────────────────────────────────────

const PATHWAY_ADAPTATIONS: Array<{
  pathwayId: string;
  slugSuffix: string;
  titleSuffix: string;
  seoLabel: string;
  exams: string[];
  countries: string[];
  audienceTiers: string[];
  examMetaExam: string;
  catalogFile: string;
  catalogType: "main" | "flat" | "expansion";
  pathwayKey?: string;
}> = [
  // ca-rpn-rex-pn already IS the base — added via rpn parity catalog
  {
    pathwayId: "ca-rpn-rex-pn",
    slugSuffix: "",
    titleSuffix: "",
    seoLabel: "REx-PN",
    exams: ["REX_PN"],
    countries: ["CA"],
    audienceTiers: ["RPN"],
    examMetaExam: "REX_PN",
    catalogFile: "rpn-rex-pn-parity-expansion-catalog.json",
    catalogType: "expansion",
    pathwayKey: "ca-rpn-rex-pn",
  },
  {
    pathwayId: "us-lpn-nclex-pn",
    slugSuffix: "-nclex-pn",
    titleSuffix: "(NCLEX-PN)",
    seoLabel: "NCLEX-PN",
    exams: ["NCLEX_PN"],
    countries: ["US"],
    audienceTiers: ["LVN_LPN"],
    examMetaExam: "NCLEX_PN",
    catalogFile: "catalog.json",
    catalogType: "main",
    pathwayKey: "us-lpn-nclex-pn",
  },
  {
    pathwayId: "us-rn-nclex-rn",
    slugSuffix: "-nclex-rn-us",
    titleSuffix: "(NCLEX-RN, US)",
    seoLabel: "NCLEX-RN US",
    exams: ["NCLEX_RN"],
    countries: ["US"],
    audienceTiers: ["RN"],
    examMetaExam: "NCLEX_RN",
    catalogFile: "catalog.json",
    catalogType: "main",
    pathwayKey: "us-rn-nclex-rn",
  },
  {
    pathwayId: "ca-rn-nclex-rn",
    slugSuffix: "-nclex-rn-ca",
    titleSuffix: "(NCLEX-RN, Canada)",
    seoLabel: "NCLEX-RN Canada",
    exams: ["NCLEX_RN"],
    countries: ["CA"],
    audienceTiers: ["RN"],
    examMetaExam: "NCLEX_RN",
    catalogFile: "catalog.json",
    catalogType: "main",
    pathwayKey: "ca-rn-nclex-rn",
  },
  {
    pathwayId: "ca-np-cnple",
    slugSuffix: "-cnple",
    titleSuffix: "(CNPLE / NP)",
    seoLabel: "CNPLE",
    exams: ["NP"],
    countries: ["CA"],
    audienceTiers: ["NP"],
    examMetaExam: "NP",
    catalogFile: "np-ca-np-cnple-catalog.json",
    catalogType: "flat",
  },
  {
    pathwayId: "us-np-pnp-pc",
    slugSuffix: "-pnp",
    titleSuffix: "(Pediatric NP)",
    seoLabel: "Pediatric NP",
    exams: ["NP"],
    countries: ["US"],
    audienceTiers: ["NP"],
    examMetaExam: "NP",
    catalogFile: "np-us-np-fnp-catalog.json",
    catalogType: "flat",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readJson<T>(p: string): T {
  return JSON.parse(fs.readFileSync(p, "utf8")) as T;
}

function writeJson(p: string, data: unknown): void {
  if (DRY_RUN) {
    console.log(`  [DRY-RUN] Would write → ${path.relative(process.cwd(), p)}`);
    return;
  }
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`  ✓ ${path.relative(process.cwd(), p)}`);
}

function dedupe(existing: Lesson[], incoming: Lesson[]): { added: Lesson[]; skipped: number } {
  const seen = new Set(existing.map((l) => l.slug));
  const added = incoming.filter((l) => !seen.has(l.slug));
  return { added, skipped: incoming.length - added.length };
}

function adaptLesson(base: Lesson, opts: (typeof PATHWAY_ADAPTATIONS)[number]): Lesson {
  if (!opts.slugSuffix) return base; // base pathway — no adaptation needed
  const adapted: Lesson = {
    ...base,
    slug: `${base.slug}${opts.slugSuffix}`,
    title: typeof base.title === "string"
      ? base.title.replace(/\s*\([^)]+\)\s*$/, "") + ` ${opts.titleSuffix}`
      : base.title,
    seoTitle: typeof base.seoTitle === "string"
      ? (base.seoTitle as string).replace(/\|[^|]+\|/, `| ${opts.seoLabel} |`)
      : base.seoTitle,
    seoDescription: typeof base.seoDescription === "string"
      ? (base.seoDescription as string).replace(/^REx-PN lesson:/, `${opts.seoLabel} lesson:`)
      : base.seoDescription,
    exams: opts.exams,
    countries: opts.countries,
    audienceTiers: opts.audienceTiers,
    examMeta: [
      {
        exam: opts.examMetaExam,
        domain: "Child and Family Health",
        competency:
          Array.isArray(base.examMeta) && base.examMeta[0]
            ? (base.examMeta[0] as Record<string, string>).competency ?? ""
            : "",
      },
    ],
  };
  return adapted;
}

// ─── Discover source files ────────────────────────────────────────────────────

function discoverSourceFiles(): string[] {
  // Auto-discover any file matching peds-s*.json in the content directory
  const entries = fs.readdirSync(CONTENT_DIR);
  return entries
    .filter((f) => /^peds-s\d/.test(f) && f.endsWith(".json"))
    .sort()
    .map((f) => path.join(CONTENT_DIR, f));
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🧒  Pediatric Sprint Package 2 — Seed ${DRY_RUN ? "(DRY-RUN)" : "(LIVE)"}\n`);

  // 1. Collect all base lessons
  const sourceFiles = discoverSourceFiles();
  if (sourceFiles.length === 0) {
    console.error("No source catalog files found. Run agents first or write catalogs manually.");
    process.exit(1);
  }

  const allBaseLessons: Lesson[] = [];
  const sectionCounts: Record<string, number> = {};

  for (const f of sourceFiles) {
    try {
      const data = readJson<SectionCatalog>(f);
      const lessons = data.pathways?.["ca-rpn-rex-pn"] ?? [];
      if (!Array.isArray(lessons) || lessons.length === 0) {
        console.log(`  ⚠ ${path.basename(f)}: no lessons found`);
        continue;
      }
      allBaseLessons.push(...lessons);
      sectionCounts[path.basename(f)] = lessons.length;
      console.log(`  ✓ Loaded ${lessons.length} lessons from ${path.basename(f)}`);
    } catch (err) {
      console.error(`  ✗ Failed to parse ${path.basename(f)}: ${(err as Error).message}`);
    }
  }

  if (allBaseLessons.length === 0) {
    console.error("No valid lessons loaded. Aborting.");
    process.exit(1);
  }

  console.log(`\n  Total base lessons: ${allBaseLessons.length}`);

  // 2. Distribute to each pathway
  const report: Record<string, { added: number; skipped: number }> = {};

  // Load main catalog once
  const mainCatalogPath = path.join(CONTENT_DIR, "catalog.json");
  const mainCatalog = readJson<MainCatalog>(mainCatalogPath);

  // Load expansion catalog once
  const rpnParityPath = path.join(CONTENT_DIR, "rpn-rex-pn-parity-expansion-catalog.json");
  const rpnParity = readJson<{ version: number; pathways: Record<string, Lesson[]> }>(rpnParityPath);

  // Load flat NP catalogs
  const cnplePath = path.join(CONTENT_DIR, "np-ca-np-cnple-catalog.json");
  const cnpleCatalog = readJson<FlatCatalog>(cnplePath);
  const pnpPath = path.join(CONTENT_DIR, "np-us-np-fnp-catalog.json");
  const pnpCatalog = readJson<FlatCatalog>(pnpPath);

  console.log("\n── Distributing lessons ──────────────────────────────────────────────");

  for (const adaptation of PATHWAY_ADAPTATIONS) {
    const lessons = allBaseLessons.map((l) => adaptLesson(l, adaptation));

    if (adaptation.catalogType === "expansion") {
      const key = adaptation.pathwayKey ?? adaptation.pathwayId;
      if (!Array.isArray(rpnParity.pathways[key])) rpnParity.pathways[key] = [];
      const { added, skipped } = dedupe(rpnParity.pathways[key] as Lesson[], lessons);
      (rpnParity.pathways[key] as Lesson[]).push(...added);
      report[adaptation.pathwayId] = { added: added.length, skipped };
      console.log(`  ${adaptation.pathwayId}: +${added.length} added, ${skipped} already present`);

    } else if (adaptation.catalogType === "main") {
      const key = adaptation.pathwayKey ?? adaptation.pathwayId;
      if (!mainCatalog.pathways[key]) mainCatalog.pathways[key] = { lessons: [] };
      const { added, skipped } = dedupe(mainCatalog.pathways[key].lessons, lessons);
      mainCatalog.pathways[key].lessons.push(...added);
      report[adaptation.pathwayId] = { added: added.length, skipped };
      console.log(`  ${adaptation.pathwayId}: +${added.length} added, ${skipped} already present`);

    } else if (adaptation.catalogType === "flat") {
      const catalog = adaptation.pathwayId === "ca-np-cnple" ? cnpleCatalog : pnpCatalog;
      if (!Array.isArray(catalog.lessons)) catalog.lessons = [];
      const { added, skipped } = dedupe(catalog.lessons, lessons);
      catalog.lessons.push(...added);
      report[adaptation.pathwayId] = { added: added.length, skipped };
      console.log(`  ${adaptation.pathwayId}: +${added.length} added, ${skipped} already present`);
    }
  }

  // 3. Write updated catalog files
  console.log("\n── Writing catalog files ─────────────────────────────────────────────");
  writeJson(mainCatalogPath, mainCatalog);
  writeJson(rpnParityPath, rpnParity);
  writeJson(cnplePath, cnpleCatalog);
  writeJson(pnpPath, pnpCatalog);

  // 4. Update readiness snapshot
  if (!DRY_RUN) {
    console.log("\n── Updating readiness snapshot ───────────────────────────────────────");
    const snapshot = readJson<Snapshot>(SNAPSHOT_PATH);
    const now = new Date().toISOString();
    for (const [pathwayId, counts] of Object.entries(report)) {
      if (counts.added === 0) continue;
      const current = snapshot[pathwayId] as { lessons: number; questions: number; updatedAt: string } | undefined;
      if (current && typeof current.lessons === "number") {
        (snapshot[pathwayId] as { lessons: number; questions: number; updatedAt: string }).lessons += counts.added;
        (snapshot[pathwayId] as { lessons: number; questions: number; updatedAt: string }).updatedAt = now;
        console.log(`  ${pathwayId}: lessons ${current.lessons} → ${current.lessons + counts.added}`);
      }
    }
    writeJson(SNAPSHOT_PATH, snapshot);
  }

  // 5. Completion report
  const totalAdded = Object.values(report).reduce((s, r) => s + r.added, 0);
  const totalBase = allBaseLessons.length;
  const pathwayVariants = Object.values(PATHWAY_ADAPTATIONS).length;

  console.log(`
═══════════════════════════════════════════════════════════════════════
  ✅  PEDIATRIC PACKAGE 2 SEED — COMPLETION REPORT
═══════════════════════════════════════════════════════════════════════

  Source files loaded:     ${sourceFiles.length}
  Base lessons:            ${totalBase}

  Source breakdown:
${Object.entries(sectionCounts).map(([f, n]) => `    ${f}: ${n} lessons`).join("\n")}

  Pathway variants generated: ${pathwayVariants}
  Total lesson slots created: ${totalAdded}

  Per pathway:
${Object.entries(report).map(([id, r]) => `    ${id}: +${r.added} lessons (${r.skipped} already present)`).join("\n")}

  Catalogs updated:
    • catalog.json (us-lpn-nclex-pn, us-rn-nclex-rn, ca-rn-nclex-rn)
    • rpn-rex-pn-parity-expansion-catalog.json (ca-rpn-rex-pn)
    • np-ca-np-cnple-catalog.json (ca-np-cnple)
    • np-us-np-fnp-catalog.json (us-np-pnp-pc)

${DRY_RUN ? "  (DRY-RUN — no files modified)" : "  Readiness snapshot updated."}
═══════════════════════════════════════════════════════════════════════
`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
