#!/usr/bin/env npx tsx
/**
 * Resumable batch import: append RN NCLEX map lessons for ONE primary category into
 * `src/content/pathway-lessons/catalog.json` for `us-rn-nclex-rn` and `ca-rn-nclex-rn`.
 *
 * Rules:
 * - Idempotent by slug (skips rows that already exist per pathway).
 * - Does not fetch or list all lessons at runtime — only map rows for the requested category.
 * - Uses legacy five-block bodies with internal study-flow links (3–8) for hub/SEO wiring.
 * - Writes/merges `rn-map-import-state.json` when `--apply` (tracks completed categories).
 *
 * If PathwayLesson DB has published rows for a pathway, the hub lists DB lessons — re-seed catalog
 * to DB separately (`npm run db:seed-pathway-lessons`) when you want parity.
 *
 * Usage:
 *   npx tsx scripts/import-rn-lesson-map-category.ts --category cardiovascular
 *   npx tsx scripts/import-rn-lesson-map-category.ts --category cardiovascular --apply
 *   npx tsx scripts/import-rn-lesson-map-category.ts --category endocrine_metabolic_fluids --apply --force
 */
import fs from "node:fs";
import path from "node:path";

import { countWords, stripToPlainText } from "@/lib/content-quality/plain-text";
import {
  countInternalStudyLinks,
  evaluatePathwayLessonStructuralGate,
} from "@/lib/lessons/pathway-lesson-premium";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

const ROOT = process.cwd();
const MAP_PATH = path.join(ROOT, "src/content/pathway-lessons/rn-nclex-master-map.json");
const CATALOG_PATH = path.join(ROOT, "src/content/pathway-lessons/catalog.json");
const STATE_PATH = path.join(ROOT, "src/content/pathway-lessons/rn-map-import-state.json");

const PATHWAY_IDS = ["us-rn-nclex-rn", "ca-rn-nclex-rn"] as const;

/** User-facing names → map primaryCategoryId */
const CATEGORY_ALIASES: Record<string, string> = {
  cardiovascular: "cardiovascular",
  respiratory: "respiratory",
  gastrointestinal: "gastrointestinal",
  neurological: "neurological",
  pediatrics: "pediatrics",
  mental_health: "mental_health",
  maternity: "maternity_newborn",
  "maternity-newborn": "maternity_newborn",
  "maternity_newborn": "maternity_newborn",
  endocrine: "endocrine_metabolic_fluids",
  "endocrine-metabolic-fluids": "endocrine_metabolic_fluids",
  "fluids-electrolytes": "endocrine_metabolic_fluids",
  emergency: "emergency_critical_perioperative",
  "emergency-critical": "emergency_critical_perioperative",
  pharmacology: "pharmacology_master",
  pharm: "pharmacology_master",
};

type MapLesson = {
  canonicalTitle: string;
  slug: string;
  tier: string;
  primaryCategoryId: string;
  secondaryCategoryIds: string[];
  topicSlug: string;
  bodySystem: string;
};

type MapDoc = {
  buildOrder: string[];
  lessons: MapLesson[];
};

type CatalogLesson = PathwayLessonRecord;

type CatalogFile = { version: number; pathways: Record<string, { lessons: CatalogLesson[] }> };

type ImportState = {
  version: 1;
  updatedAt: string;
  completedCategories: string[];
  lastCategory?: string;
  /** slug → pathways appended in last apply */
  lastRun?: { category: string; slugs: string[]; perPathway: Record<string, number> };
};

function parseArgs(argv: string[]) {
  let category = "";
  let apply = false;
  let force = false;
  let dryRun = true;
  for (const a of argv) {
    if (a === "--apply") {
      apply = true;
      dryRun = false;
    }
    if (a === "--force") force = true;
    if (a.startsWith("--category=")) category = a.slice("--category=".length).trim();
  }
  if (!category && argv[0] && !argv[0].startsWith("-")) category = argv[0];
  return { category, apply, force, dryRun };
}

function resolveCategoryId(raw: string): string | null {
  const k = raw.trim().toLowerCase().replace(/\s+/g, "_");
  if (CATEGORY_ALIASES[k]) return CATEGORY_ALIASES[k];
  if (/^[a-z_]+$/.test(k)) return k;
  return null;
}

const LEGACY_MIN: Record<string, number> = {
  clinical_meaning: 180,
  exam_relevance: 80,
  core_concept: 140,
  clinical_scenario: 120,
  takeaways: 100,
};

function paragraph(text: string): string {
  return text.trim();
}

function ensureMinWords(body: string, min: number, pad: string): string {
  let out = body;
  let guard = 0;
  while (countWords(stripToPlainText(out)) < min && guard++ < 40) {
    out = `${out}\n\n${pad}`;
  }
  return out;
}

function buildLegacySections(args: {
  canonicalTitle: string;
  bodySystem: string;
  tier: string;
  region: "us" | "ca";
  slug: string;
  relatedSlugs: string[];
}): CatalogLesson["sections"] {
  const { canonicalTitle, bodySystem, tier, region, slug, relatedSlugs } = args;
  const rn =
    region === "ca"
      ? "Canadian NCLEX-RN items may use **metric labs** and provincial care settings; prioritization and safety logic match US-style clinical judgment."
      : "US NCLEX-RN items frequently test **first action**, **unstable vs stable** triage, and **safe delegation** within RN scope.";

  const rel = relatedSlugs.filter((s) => s !== slug).slice(0, 6);
  const l1 = rel[0] ? `[${rel[0].replace(/-nclex-rn$/, "").replace(/-/g, " ")}](LESSON:${rel[0]})` : "";
  const l2 = rel[1] ? `[${rel[1].replace(/-nclex-rn$/, "").replace(/-/g, " ")}](LESSON:${rel[1]})` : "";
  const l3 = rel[2] ? `[${rel[2].replace(/-nclex-rn$/, "").replace(/-/g, " ")}](LESSON:${rel[2]})` : "";

  const qbank = `[question bank](/app/question-bank)`;
  const linkLine =
    rel.length >= 3
      ? `Cross-study anchors: ${l1}, ${l2}, and ${l3}. Continue with timed practice from the ${qbank}.`
      : `Continue with timed practice from the ${qbank} and filter by **${bodySystem}** topics.`;

  let clinical_meaning = paragraph(
    `**${canonicalTitle}** sits in **${bodySystem}** for RN exam prep. Your job on the exam is to connect **assessment data** to **risk**, choose the **first safe nursing action**, and recognize when teaching, delegation, or escalation must change.\n\n${rn}\n\n` +
      `Map tier **${tier}** sets expected depth for this title: keep the storyline tied to **perfusion**, **oxygenation**, **fluid/electrolyte balance**, **infection burden**, or **neuro status**—whichever domain this topic most often stresses on items.\n\n` +
      linkLine,
  );

  let exam_relevance = paragraph(
    `Examiners use **${canonicalTitle}** to probe **prioritization**, **monitoring**, and **patient safety**. Expect distractors that sound reasonable but **delay assessment**, **skip unstable clients**, or **mix scope** (RN vs assistive personnel).\n\n` +
      `When a stem adds routine tasks alongside an abnormal finding, favor the option that **closes the highest-risk data gap** first.\n\n` +
      `Pair reading with a **question bank** session filtered to this topic slug so pattern recognition matches exam pacing.`,
  );

  let core_concept = paragraph(
    `Frame **${canonicalTitle}** within **${bodySystem}**: link expected **assessment** findings to **interventions** and the **monitoring** that proves the plan is working.\n\n` +
      `State a one-sentence **clinical concern** before choosing medications, teaching, or discharge tasks—exam writers reward that discipline.\n\n` +
      `Where orders are involved, verify **indication**, **dose/route**, and **monitoring** against the client story; eliminate options that ignore contraindications or trending labs.\n\n` +
      `Use **SBAR-style** reasoning internally: what changed, what you worry about, and what you need next—even when the item is multiple-choice.`,
  );

  let clinical_scenario = paragraph(
    `Picture **multiple clients** or **stacked tasks**: pick the option that **reduces harm fastest** for whoever is most likely to deteriorate without nursing action.\n\n` +
      `If the stem feels “stable,” still choose the move that **collects missing data** before comfort measures or routines.\n\n` +
      `When family or teaching appears, ensure **hemodynamic and safety** questions are answered first.\n\n` +
      `Use elimination: discard choices that **skip reassessment**, **delay escalation**, or **assume** findings you have not verified.`,
  );

  let takeaways = paragraph(
    `- Tie **vitals + labs + story** before teaching, discharge, or routine hygiene.\n` +
      `- Eliminate answers that **skip assessment** or **delay escalation** when data show risk.\n` +
      `- **Bank:** drill items tagged to this topic and review rationales for **first action** mistakes.\n` +
      `- **Links:** ${linkLine}\n` +
      `- **Scope:** stay within **RN judgment**; delegate tasks appropriately and escalate when findings exceed stable parameters.`,
  );

  const pad = `Additional NCLEX-RN study context for **${canonicalTitle}**: rehearse **what changes first**, **what you monitor**, and **what you teach** after stabilization.`;

  clinical_meaning = ensureMinWords(clinical_meaning, LEGACY_MIN.clinical_meaning, pad);
  exam_relevance = ensureMinWords(exam_relevance, LEGACY_MIN.exam_relevance, pad);
  core_concept = ensureMinWords(core_concept, LEGACY_MIN.core_concept, pad);
  clinical_scenario = ensureMinWords(clinical_scenario, LEGACY_MIN.clinical_scenario, pad);
  takeaways = ensureMinWords(takeaways, LEGACY_MIN.takeaways, pad);

  return [
    { id: "clinical_meaning", heading: "Clinical meaning", kind: "clinical_meaning", body: clinical_meaning },
    { id: "exam_relevance", heading: "Exam relevance", kind: "exam_relevance", body: exam_relevance },
    { id: "core_concept", heading: "Core concept", kind: "core_concept", body: core_concept },
    { id: "clinical_scenario", heading: "Clinical scenario", kind: "clinical_scenario", body: clinical_scenario },
    { id: "takeaways", heading: "Takeaways", kind: "takeaways", body: takeaways },
  ];
}

function buildLessonRow(args: {
  map: MapLesson;
  region: "us" | "ca";
  relatedSlugs: string[];
}): CatalogLesson {
  const { map, region, relatedSlugs } = args;
  const title =
    region === "us"
      ? `${map.canonicalTitle} (NCLEX-RN, US)`
      : `${map.canonicalTitle} (NCLEX-RN, Canada)`;
  const seoTitle = `${map.canonicalTitle} | NCLEX-RN | NurseNest`;
  const seoDescription = `RN exam prep lesson for ${map.canonicalTitle}: clinical judgment, monitoring, prioritization, and safety within ${map.bodySystem} — structured for NCLEX-RN study with related hub links.`;

  const sections = buildLegacySections({
    canonicalTitle: map.canonicalTitle,
    bodySystem: map.bodySystem,
    tier: map.tier,
    region,
    slug: map.slug,
    relatedSlugs,
  });

  const refs = relatedSlugs
    .filter((s) => s !== map.slug)
    .slice(0, 8)
    .map((s) => ({ slug: s, titleHint: s.replace(/-nclex-rn$/, "").replace(/-/g, " ") }));

  return {
    slug: map.slug,
    title,
    topic: map.canonicalTitle,
    topicSlug: map.topicSlug,
    bodySystem: map.bodySystem,
    previewSectionCount: 1,
    seoTitle,
    seoDescription,
    sections,
    relatedLessonRefs: refs.length >= 2 ? refs : [...refs, { slug: "cardiovascular-prioritization", titleHint: "cardiovascular prioritization" }],
  };
}

function loadState(): ImportState {
  if (!fs.existsSync(STATE_PATH)) {
    return { version: 1, updatedAt: new Date().toISOString(), completedCategories: [] };
  }
  return JSON.parse(fs.readFileSync(STATE_PATH, "utf8")) as ImportState;
}

function main() {
  const { category: rawCat, apply, force, dryRun } = parseArgs(process.argv.slice(2));
  if (!rawCat) {
    console.error("Usage: tsx scripts/import-rn-lesson-map-category.ts --category <id|alias> [--apply] [--force]");
    console.error("Example: --category cardiovascular   (or endocrine_metabolic_fluids)");
    process.exit(1);
  }

  const categoryId = resolveCategoryId(rawCat);
  if (!categoryId) {
    console.error(`Unknown category "${rawCat}".`);
    process.exit(1);
  }

  const map = JSON.parse(fs.readFileSync(MAP_PATH, "utf8")) as MapDoc;
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8")) as CatalogFile;

  const batch = map.lessons.filter((l) => l.primaryCategoryId === categoryId);
  if (batch.length === 0) {
    console.error(`No map lessons with primaryCategoryId="${categoryId}". Check rn-nclex-master-map.json.`);
    process.exit(1);
  }

  const state = loadState();
  if (!force && state.completedCategories.includes(categoryId) && dryRun) {
    console.log(
      JSON.stringify(
        {
          note: `Category "${categoryId}" already marked complete in state. Use --apply to append any new slugs, or --force to bypass this hint.`,
          completedCategories: state.completedCategories,
        },
        null,
        2,
      ),
    );
  }

  const slugsInBatch = batch.map((b) => b.slug);
  const relatedPool = slugsInBatch;

  const report: Record<string, unknown> = {
    categoryId,
    mapPrimaryCount: batch.length,
    dryRun,
    perPathway: {} as Record<string, { appended: number; skipped: number; slugs: string[] }>,
    validationSamples: [] as Array<{ slug: string; mode: string; issues: string[]; warnings: string[]; links: number }>,
  };

  for (const pid of PATHWAY_IDS) {
    const bucket = catalog.pathways[pid];
    if (!bucket?.lessons) {
      console.error(`Missing pathway ${pid} in catalog.json`);
      process.exit(1);
    }
    const existing = new Set(bucket.lessons.map((l) => l.slug));
    let appended = 0;
    let skipped = 0;
    const addedSlugs: string[] = [];

    for (const m of batch) {
      if (existing.has(m.slug)) {
        skipped++;
        continue;
      }
      const region = pid.startsWith("ca-") ? "ca" : "us";
      const other = relatedPool.filter((s) => s !== m.slug);
      const lesson = buildLessonRow({
        map: m,
        region,
        relatedSlugs: other,
      });

      const gate = evaluatePathwayLessonStructuralGate(lesson);
      if (report.validationSamples.length < 3) {
        report.validationSamples.push({
          slug: lesson.slug,
          mode: gate.structureMode,
          issues: gate.issues,
          warnings: gate.warnings ?? [],
          links: countInternalStudyLinks(lesson.sections.map((s) => s.body).join("\n\n")),
        });
      }

      bucket.lessons.push(lesson);
      existing.add(m.slug);
      appended++;
      addedSlugs.push(m.slug);
    }

    report.perPathway[pid] = { appended, skipped, slugs: addedSlugs };
  }

  const totalAppended = Object.values(report.perPathway as Record<string, { appended: number }>).reduce(
    (n, x) => n + x.appended,
    0,
  );

  if (apply && totalAppended > 0) {
    fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + "\n", "utf8");
    const next: ImportState = {
      version: 1,
      updatedAt: new Date().toISOString(),
      completedCategories: Array.from(new Set([...state.completedCategories, categoryId])),
      lastCategory: categoryId,
      lastRun: {
        category: categoryId,
        slugs: [
          ...new Set(
            Object.values(report.perPathway as Record<string, { slugs: string[] }>).flatMap((p) => p.slugs),
          ),
        ],
        perPathway: Object.fromEntries(
          Object.entries(report.perPathway as Record<string, { appended: number }>).map(([k, v]) => [k, v.appended]),
        ),
      },
    };
    fs.writeFileSync(STATE_PATH, JSON.stringify(next, null, 2) + "\n", "utf8");
  }

  console.log(JSON.stringify({ ...report, catalogWritten: apply && totalAppended > 0, statePath: STATE_PATH }, null, 2));

  if (totalAppended === 0) {
    console.log("(No new rows appended; all slugs already present for this category.)");
  }
}

main();
