#!/usr/bin/env npx tsx
/**
 * Launch QA — lesson hubs, detail routes, catalog + rationale wiring, and pathway thresholds.
 *
 * Usage (from `nursenest-core/`):
 *   npx tsx scripts/launch-qa-lesson-system.ts
 *   npx tsx scripts/launch-qa-lesson-system.ts --enforce   # exit 1 on any FAIL
 *   npx tsx scripts/launch-qa-lesson-system.ts --min=120     # override default min effective lessons (active pathways)
 *   npx tsx scripts/launch-qa-lesson-system.ts --json        # machine-readable summary last line
 *
 * Does **not** require a database: uses catalog.json + scoped-gold merge (same as hub inventory).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ExamFamily } from "@prisma/client";
import {
  buildExamPathwayPath,
  getExamPathwayById,
  resolveExamPathwayFromMarketingHubSegment,
} from "../src/lib/exam-pathways/exam-product-registry";
import { LESSON_RATIONALE_MAPPING_ENTRIES } from "../src/lib/learner/lesson-question-rationale/registry";
import { getLaunchBundleSpec } from "../src/lib/lessons/pathway-launch-bundle";
import {
  prependScopedGoldCatalogLessons,
  SCOPED_GOLD_PROVIDERS,
} from "../src/lib/lessons/scoped-lessons/scoped-gold-registry";
import { EXAM_COMPLETE_MED_SAFETY_SLUGS } from "../src/lib/lessons/scoped-lessons/exam-complete-med-safety-specs";
import { CASE_STUDY_CASEBOOK_SLUGS } from "../src/lib/lessons/scoped-lessons/case-study-casebook-specs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const LESSONS_HUB_PAGE = path.join(
  ROOT,
  "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx",
);
const LESSON_DETAIL_PAGE = path.join(
  ROOT,
  "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/page.tsx",
);
const CATALOG = path.join(ROOT, "src/content/pathway-lessons/catalog.json");

/** Same six core licensure tracks as inventory / launch bundle. */
const REQUIRED_PATHWAY_IDS = [
  "us-rn-nclex-rn",
  "ca-rn-nclex-rn",
  "us-lpn-nclex-pn",
  "ca-rpn-rex-pn",
  "us-np-fnp",
  "ca-np-cnple",
] as const;

const DEFAULT_MIN_ACTIVE = 150;
const DEFAULT_MIN_UPCOMING = 8;

type Severity = "PASS" | "WARN" | "FAIL";

type Finding = { severity: Severity; code: string; detail: string };

const findings: Finding[] = [];

function flag(severity: Severity, code: string, detail: string) {
  findings.push({ severity, code, detail });
}

function parseArgs() {
  const enforce = process.argv.includes("--enforce");
  const json = process.argv.includes("--json");
  let minActive = DEFAULT_MIN_ACTIVE;
  let minUpcoming = DEFAULT_MIN_UPCOMING;
  for (const a of process.argv) {
    if (a.startsWith("--min=")) {
      const n = Number(a.slice(6));
      if (Number.isFinite(n) && n >= 0) minActive = Math.floor(n);
    }
    if (a.startsWith("--min-upcoming=")) {
      const n = Number(a.slice(15));
      if (Number.isFinite(n) && n >= 0) minUpcoming = Math.floor(n);
    }
  }
  return { enforce, json, minActive, minUpcoming };
}

type CatalogJson = { pathways?: Record<string, { lessons?: Array<{ slug?: string }> }> };

function effectiveSlugsForPathway(pathwayId: string, raw: CatalogJson): Set<string> {
  const lessons = raw.pathways?.[pathwayId]?.lessons ?? [];
  const merged = prependScopedGoldCatalogLessons(
    pathwayId,
    lessons as Parameters<typeof prependScopedGoldCatalogLessons>[1],
  );
  return new Set(merged.map((l) => l.slug).filter(Boolean));
}

/** Slugs delivered via scoped-gold / casebook / exam-complete injectables (may omit US RN catalog row). */
function globalInjectableSlugs(): Set<string> {
  const s = new Set<string>();
  for (const p of SCOPED_GOLD_PROVIDERS) s.add(p.slug);
  for (const x of EXAM_COMPLETE_MED_SAFETY_SLUGS) s.add(x);
  for (const x of CASE_STUDY_CASEBOOK_SLUGS) s.add(x);
  return s;
}

function main() {
  const { enforce, json, minActive, minUpcoming } = parseArgs();

  console.log("=== Lesson system launch QA ===\n");

  // --- Static route files ---
  if (!fs.existsSync(LESSONS_HUB_PAGE)) {
    flag("FAIL", "missing.hub.page", `Lessons hub page missing: ${LESSONS_HUB_PAGE}`);
  } else {
    flag("PASS", "hub.page", "Marketing lessons hub route file exists");
  }
  if (!fs.existsSync(LESSON_DETAIL_PAGE)) {
    flag("FAIL", "missing.detail.page", `Lesson detail page missing: ${LESSON_DETAIL_PAGE}`);
  } else {
    flag("PASS", "detail.page", "Marketing lesson detail route file exists");
  }

  if (!fs.existsSync(CATALOG)) {
    flag("FAIL", "missing.catalog", `catalog.json missing: ${CATALOG}`);
    console.log("\nCannot continue without catalog.");
    process.exit(2);
  }

  const catalogRaw = JSON.parse(fs.readFileSync(CATALOG, "utf8")) as CatalogJson;

  // --- Registry reconcile + route helpers ---
  for (const id of REQUIRED_PATHWAY_IDS) {
    const p = getExamPathwayById(id);
    if (!p) {
      flag("FAIL", "pathway.missing", `getExamPathwayById("${id}") is undefined`);
      continue;
    }

    const resolved = resolveExamPathwayFromMarketingHubSegment(p.countrySlug, p.roleTrack, p.examCode);
    if (!resolved || resolved.id !== p.id) {
      flag(
        "FAIL",
        "route.resolve",
        `resolveExamPathwayFromMarketingHubSegment(${p.countrySlug}, ${p.roleTrack}, ${p.examCode}) → expected ${id}, got ${resolved?.id ?? "null"}`,
      );
    } else {
      flag("PASS", "route.resolve", `${id}: marketing segment resolves to pathway id`);
    }

    const hub = buildExamPathwayPath(p, "lessons");
    const detail = buildExamPathwayPath(p, "lessons/example-slug");
    if (!hub.startsWith("/") || hub.includes("//") || !detail.startsWith("/")) {
      flag("FAIL", "route.helper", `${id}: buildExamPathwayPath produced invalid paths: hub=${hub} detail=${detail}`);
    } else {
      flag("PASS", "route.helper", `${id}: hub=${hub}`);
    }

    // Exam label sanity (lightweight)
    if (!p.shortName?.trim()) {
      flag("FAIL", "exam.label", `${id}: empty shortName`);
    }
    if (p.examFamily === ExamFamily.NCLEX_RN && p.roleTrack === "rn") {
      const sn = p.shortName.toLowerCase();
      if (/\b(lpn|lvn|pn|practical)\b/i.test(sn) && !/nclex-rn/i.test(p.displayName)) {
        flag("WARN", "exam.label.cross", `${id}: RN pathway shortName may read as PN/LPN: ${p.shortName}`);
      }
    }
    if (p.examFamily === ExamFamily.NP && p.roleTrack === "np" && p.status === "active" && !p.boardLabel?.trim()) {
      flag("WARN", "exam.label.np", `${id}: active NP pathway missing boardLabel (FNP vs PMHNP clarity)`);
    }

    const effective = effectiveSlugsForPathway(id, catalogRaw);
    const n = effective.size;
    const min = p.status === "upcoming" ? minUpcoming : minActive;
    if (n < min) {
      flag(
        p.status === "upcoming" ? "WARN" : "FAIL",
        "threshold.count",
        `${id}: effective lesson count ${n} < min ${min} (catalog + scoped-gold injectables)`,
      );
    } else {
      flag("PASS", "threshold.count", `${id}: effective ${n} (min ${min})`);
    }

    // Launch bundle slugs (required families for launch UX)
    const bundle = getLaunchBundleSpec(id);
    if (bundle) {
      const missing = bundle.entries.map((e) => e.slug).filter((slug) => !effective.has(slug));
      if (missing.length > 0) {
        const sev = p.status === "upcoming" ? "WARN" : "FAIL";
        flag(
          sev,
          "launch.bundle",
          `${id}: launch bundle slugs not in effective catalog for pathway: ${missing.slice(0, 12).join(", ")}${missing.length > 12 ? "…" : ""}`,
        );
      } else {
        flag("PASS", "launch.bundle", `${id}: all ${bundle.entries.length} launch bundle slugs present`);
      }
    }
  }

  // --- Rationale registry: every mapped slug must appear in US RN effective set OR scoped-gold / casebook injectables ---
  const usRn = effectiveSlugsForPathway("us-rn-nclex-rn", catalogRaw);
  const injectable = globalInjectableSlugs();
  const rationaleSlugs = [...new Set(LESSON_RATIONALE_MAPPING_ENTRIES.map((e) => e.lessonSlug))];
  let rationaleOk = true;
  for (const slug of rationaleSlugs) {
    if (usRn.has(slug) || injectable.has(slug)) continue;
    rationaleOk = false;
    flag(
      "FAIL",
      "rationale.slug",
      `Rationale mapping lessonSlug not in US RN effective catalog and not in injectable registry: ${slug}`,
    );
  }
  if (rationaleOk) {
    flag("PASS", "rationale.registry", `All ${rationaleSlugs.length} rationale mapping lesson slugs resolve`);
  }

  // --- Report ---
  const broken = findings.filter((f) => f.severity === "FAIL");
  const warns = findings.filter((f) => f.severity === "WARN");
  const passed = findings.filter((f) => f.severity === "PASS").length;

  console.log("--- Summary ---");
  console.log(`PASS lines: ${passed}`);
  console.log(`WARN:       ${warns.length}`);
  console.log(`FAIL:       ${broken.length}\n`);

  if (warns.length) {
    console.log("Warnings:");
    for (const w of warns) console.log(`  [${w.code}] ${w.detail}`);
    console.log("");
  }
  if (broken.length) {
    console.log("Failures:");
    for (const b of broken) console.log(`  [${b.code}] ${b.detail}`);
    console.log("");
  }

  const overall: "PASS" | "FAIL" = broken.length > 0 ? "FAIL" : "PASS";
  console.log(`Overall: ${overall}${warns.length > 0 && overall === "PASS" ? " (with warnings)" : ""}\n`);

  if (json) {
    const summary = {
      overall,
      failCount: broken.length,
      warnCount: warns.length,
      passCount: passed,
      failures: broken.map((f) => ({ code: f.code, detail: f.detail })),
      warnings: warns.map((f) => ({ code: f.code, detail: f.detail })),
    };
    console.log(JSON.stringify(summary));
  }

  if (enforce && broken.length > 0) {
    process.exit(1);
  }
  process.exit(broken.length > 0 ? 1 : 0);
}

main();
