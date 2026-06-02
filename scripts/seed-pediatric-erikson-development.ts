#!/usr/bin/env npx tsx
/**
 * Appends Erikson Psychosocial Development Theory lessons (Package 1 of the
 * Pediatric Nursing Sprint) into the shared pathway catalog files.
 *
 * Source data:
 *   nursenest-core/src/content/pathway-lessons/pediatric-erikson-development-catalog.json
 *
 * Targets:
 *   nursenest-core/src/content/pathway-lessons/catalog.json        (ca-rpn-rex-pn, us-lpn-nclex-pn, us-rn-nclex-rn, ca-rn-nclex-rn)
 *   nursenest-core/src/content/pathway-lessons/np-ca-np-cnple-catalog.json  (ca-np-cnple)
 *   nursenest-core/src/content/pathway-lessons/rpn-rex-pn-parity-expansion-catalog.json (ca-rpn-rex-pn extended)
 *
 * Usage:
 *   npx tsx scripts/seed-pediatric-erikson-development.ts [--dry-run]
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "nursenest-core");
const CONTENT_DIR = path.join(ROOT, "src/content/pathway-lessons");
const DRY_RUN = process.argv.includes("--dry-run");

// ─── Types ────────────────────────────────────────────────────────────────────

type Section = { id: string; kind: string; heading: string; body: string };
type TestQuestion = { question: string; options: string[]; correct: number; rationale: string };

type EriksonLesson = {
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  previewSectionCount: number;
  seoTitle: string;
  seoDescription: string;
  exams: string[];
  countries: string[];
  priority: string;
  audienceTiers: string[];
  studyTakeaways: string[];
  studyCommonTraps: string[];
  memoryAnchor: string;
  sections: Section[];
  preTest: TestQuestion[];
  postTest: TestQuestion[];
  linked_flashcard_prompts: string[];
  examMeta: { exam: string; domain: string; competency: string }[];
  relatedLessonRefs: string[];
  premiumOmittedSections: unknown[];
};

type SourceCatalog = {
  pathways: Record<string, EriksonLesson[]>;
};

type CatalogFile = {
  version: number;
  pathways: Record<string, { lessons: EriksonLesson[] }>;
};

type ExpansionCatalog = {
  version: number;
  generatedAt: string;
  source: string;
  pathways: Record<string, EriksonLesson[]>;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeJson(filePath: string, data: unknown): void {
  if (DRY_RUN) {
    console.log(`  [DRY-RUN] Would write → ${path.relative(process.cwd(), filePath)}`);
    return;
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`  ✓ Wrote → ${path.relative(process.cwd(), filePath)}`);
}

function dedupeBySlug(existing: EriksonLesson[], incoming: EriksonLesson[]): { added: EriksonLesson[]; skipped: string[] } {
  const existingSlugs = new Set(existing.map((l) => l.slug));
  const added: EriksonLesson[] = [];
  const skipped: string[] = [];
  for (const lesson of incoming) {
    if (existingSlugs.has(lesson.slug)) {
      skipped.push(lesson.slug);
    } else {
      added.push(lesson);
    }
  }
  return { added, skipped };
}

// ─── Lesson adaptation helpers ────────────────────────────────────────────────

function adaptForPathway(lesson: EriksonLesson, opts: {
  pathwayId: string;
  slugSuffix: string;
  titleSuffix: string;
  seoPathwayLabel: string;
  exams: string[];
  countries: string[];
  audienceTiers: string[];
  examMetaExam: string;
  examNote?: string;
}): EriksonLesson {
  const baseSlug = lesson.slug.replace(/-rpn$/, "");
  const baseTitle = lesson.title.replace(/\s*\(REx-PN\)\s*$/, "");
  const baseSeoTitle = lesson.seoTitle.replace(/\|[^|]+\|/, `| ${opts.seoPathwayLabel} |`);
  const baseSeoDesc = lesson.seoDescription.replace(/REx-PN lesson:/, `${opts.seoPathwayLabel} lesson:`);

  const adaptedSections = lesson.sections.map((s) => ({
    ...s,
    body: s.body
      .replace(/REx-PN/g, opts.seoPathwayLabel)
      .replace(/\bRPN\b/g, opts.audienceTiers[0])
      .replace(/RPN scope/g, `${opts.audienceTiers[0]} scope`),
  }));

  const examMetaNote = opts.examNote
    ? [{ exam: opts.examMetaExam, domain: "Child and Family Health", competency: opts.examNote }]
    : [{ exam: opts.examMetaExam, domain: "Child and Family Health", competency: "Applies knowledge of growth and development to nursing care" }];

  return {
    ...lesson,
    slug: `${baseSlug}${opts.slugSuffix}`,
    title: `${baseTitle} ${opts.titleSuffix}`,
    seoTitle: baseSeoTitle,
    seoDescription: baseSeoDesc,
    exams: opts.exams,
    countries: opts.countries,
    audienceTiers: opts.audienceTiers,
    sections: adaptedSections,
    examMeta: examMetaNote,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🧒 Pediatric Sprint — Erikson Development Lessons ${DRY_RUN ? "(DRY-RUN)" : "(LIVE)"}\n`);

  // Load source catalog
  const sourcePath = path.join(CONTENT_DIR, "pediatric-erikson-development-catalog.json");
  const source = readJson<SourceCatalog>(sourcePath);
  const rpnLessons = source.pathways["ca-rpn-rex-pn"];
  console.log(`Loaded ${rpnLessons.length} source lessons from pediatric-erikson-development-catalog.json`);

  // Generate lessons for other pathways by adapting the RPN base
  const pnUsLessons = rpnLessons.map((l) =>
    adaptForPathway(l, {
      pathwayId: "us-lpn-nclex-pn",
      slugSuffix: "-nclex-pn",
      titleSuffix: "(NCLEX-PN)",
      seoPathwayLabel: "NCLEX-PN",
      exams: ["NCLEX_PN"],
      countries: ["US"],
      audienceTiers: ["LVN_LPN"],
      examMetaExam: "NCLEX_PN",
    })
  );

  const rnUsLessons = rpnLessons.map((l) =>
    adaptForPathway(l, {
      pathwayId: "us-rn-nclex-rn",
      slugSuffix: "-nclex-rn-us",
      titleSuffix: "(NCLEX-RN, US)",
      seoPathwayLabel: "NCLEX-RN US",
      exams: ["NCLEX_RN"],
      countries: ["US"],
      audienceTiers: ["RN"],
      examMetaExam: "NCLEX_RN",
      examNote: "Applies developmental theory to nursing care across the lifespan; applies to pediatric clinical judgment questions",
    })
  );

  const rnCaLessons = rpnLessons.map((l) =>
    adaptForPathway(l, {
      pathwayId: "ca-rn-nclex-rn",
      slugSuffix: "-nclex-rn-ca",
      titleSuffix: "(NCLEX-RN, Canada)",
      seoPathwayLabel: "NCLEX-RN Canada",
      exams: ["NCLEX_RN"],
      countries: ["CA"],
      audienceTiers: ["RN"],
      examMetaExam: "NCLEX_RN",
      examNote: "Applies developmental theory to nursing care across the lifespan; applies to pediatric clinical judgment questions",
    })
  );

  const cnpleLessons = rpnLessons.map((l) =>
    adaptForPathway(l, {
      pathwayId: "ca-np-cnple",
      slugSuffix: "-cnple",
      titleSuffix: "(CNPLE / NP)",
      seoPathwayLabel: "CNPLE",
      exams: ["NP"],
      countries: ["CA"],
      audienceTiers: ["NP"],
      examMetaExam: "NP",
      examNote: "Applies psychosocial development theory to advanced nursing practice in pediatric and family health contexts",
    })
  );

  const pnpLessons = rpnLessons.map((l) =>
    adaptForPathway(l, {
      pathwayId: "us-np-pnp-pc",
      slugSuffix: "-pnp",
      titleSuffix: "(Pediatric NP)",
      seoPathwayLabel: "Pediatric NP",
      exams: ["NP"],
      countries: ["US"],
      audienceTiers: ["NP"],
      examMetaExam: "NP",
      examNote: "High-yield developmental theory for pediatric primary care NP practice; anticipatory guidance and family-centred care",
    })
  );

  console.log("\n── Updating catalog.json ──────────────────────────────────────────────");
  const catalogPath = path.join(CONTENT_DIR, "catalog.json");
  const catalog = readJson<CatalogFile>(catalogPath);

  const pathwayUpdates: Array<{ id: string; lessons: EriksonLesson[] }> = [
    { id: "ca-rpn-rex-pn", lessons: rpnLessons },
    { id: "us-lpn-nclex-pn", lessons: pnUsLessons },
    { id: "us-rn-nclex-rn", lessons: rnUsLessons },
    { id: "ca-rn-nclex-rn", lessons: rnCaLessons },
  ];

  let catalogTotalAdded = 0;
  for (const { id, lessons } of pathwayUpdates) {
    if (!catalog.pathways[id]) {
      catalog.pathways[id] = { lessons: [] };
    }
    const existing = catalog.pathways[id].lessons;
    const { added, skipped } = dedupeBySlug(existing, lessons);
    catalog.pathways[id].lessons.push(...added);
    console.log(`  ${id}: +${added.length} added, ${skipped.length} already present`);
    catalogTotalAdded += added.length;
  }

  if (catalogTotalAdded > 0 || DRY_RUN) {
    writeJson(catalogPath, catalog);
  }

  console.log("\n── Updating rpn-rex-pn-parity-expansion-catalog.json ─────────────────");
  const rpnParityPath = path.join(CONTENT_DIR, "rpn-rex-pn-parity-expansion-catalog.json");
  const rpnParity = readJson<ExpansionCatalog>(rpnParityPath);
  if (!Array.isArray(rpnParity.pathways["ca-rpn-rex-pn"])) {
    rpnParity.pathways["ca-rpn-rex-pn"] = [];
  }
  const rpnParityExisting = rpnParity.pathways["ca-rpn-rex-pn"] as EriksonLesson[];
  const { added: rpnParityAdded, skipped: rpnParitySkipped } = dedupeBySlug(rpnParityExisting, rpnLessons);
  rpnParity.pathways["ca-rpn-rex-pn"] = [...rpnParityExisting, ...rpnParityAdded];
  console.log(`  ca-rpn-rex-pn: +${rpnParityAdded.length} added, ${rpnParitySkipped.length} already present`);
  if (rpnParityAdded.length > 0 || DRY_RUN) {
    writeJson(rpnParityPath, rpnParity);
  }

  // NP catalogs use a flat `lessons` array, not a pathways object
  console.log("\n── Updating np-ca-np-cnple-catalog.json ──────────────────────────────");
  const cnpleCatalogPath = path.join(CONTENT_DIR, "np-ca-np-cnple-catalog.json");
  if (fs.existsSync(cnpleCatalogPath)) {
    const cnpleCatalog = readJson<{ version: number; generatedAt: string; source: string; lessons: EriksonLesson[]; [k: string]: unknown }>(cnpleCatalogPath);
    if (!Array.isArray(cnpleCatalog.lessons)) cnpleCatalog.lessons = [];
    const { added: cnpleAdded, skipped: cnpleSkipped } = dedupeBySlug(cnpleCatalog.lessons, cnpleLessons);
    cnpleCatalog.lessons.push(...cnpleAdded);
    console.log(`  ca-np-cnple: +${cnpleAdded.length} added, ${cnpleSkipped.length} already present`);
    if (cnpleAdded.length > 0 || DRY_RUN) {
      writeJson(cnpleCatalogPath, cnpleCatalog);
    }
  } else {
    console.log(`  np-ca-np-cnple-catalog.json not found — skipping`);
  }

  console.log("\n── Updating np-us-np-fnp-catalog.json (pnp-pc pathway) ──────────────");
  const pnpCatalogPath = path.join(CONTENT_DIR, "np-us-np-fnp-catalog.json");
  if (fs.existsSync(pnpCatalogPath)) {
    const pnpCatalog = readJson<{ version: number; generatedAt: string; source: string; lessons: EriksonLesson[]; [k: string]: unknown }>(pnpCatalogPath);
    if (!Array.isArray(pnpCatalog.lessons)) pnpCatalog.lessons = [];
    const { added: pnpAdded, skipped: pnpSkipped } = dedupeBySlug(pnpCatalog.lessons, pnpLessons);
    pnpCatalog.lessons.push(...pnpAdded);
    console.log(`  us-np-pnp-pc: +${pnpAdded.length} added, ${pnpSkipped.length} already present`);
    if (pnpAdded.length > 0 || DRY_RUN) {
      writeJson(pnpCatalogPath, pnpCatalog);
    }
  } else {
    console.log(`  np-us-np-fnp-catalog.json not found — skipping pnp-pc pathway`);
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log("\n─────────────────────────────────────────────────────────────────────");
  console.log(`✅  Erikson development seed complete`);
  console.log(`    Source lessons: ${rpnLessons.length} (REx-PN base)`);
  console.log(`    Pathway variants generated: 5 (REx-PN, NCLEX-PN, NCLEX-RN US, NCLEX-RN CA, CNPLE)`);
  console.log(`    Total lesson slots: ${rpnLessons.length * 5}`);
  console.log(`    Stages covered: Trust vs Mistrust · Autonomy vs Shame · Initiative vs Guilt · Industry vs Inferiority · Identity vs Role Confusion`);
  console.log(DRY_RUN ? "\n    (DRY-RUN — no files were modified)" : "\n    Run the lesson server or import pipeline to reflect changes in the UI.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
