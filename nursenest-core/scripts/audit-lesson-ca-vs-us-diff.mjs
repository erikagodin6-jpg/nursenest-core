#!/usr/bin/env node
/**
 * CA vs US RN Lesson Structured Diff Analysis (Priority 4)
 *
 * For each lesson that appears in both ca-rn-nclex-rn and us-rn-nclex-rn,
 * computes a structured diff to determine whether:
 *   A) Content is byte-identical → safe to consolidate (countries: ["CA","US"])
 *   B) Content differs only in exam framing → share foundation, keep overlay
 *   C) Content is genuinely country-specific → keep separate forever
 *
 * Country-specific markers detected:
 *   CA: CNA, CNO, CRNBC, CPSO, "Canadian", REx-PN, NCLEX-RN Canada
 *   US: NCSBN, ANA, "American", NCLEX-RN US, NPI, CMS, FDA
 *
 * Exit code 0 = analysis complete (findings written to audit file).
 * This script does NOT modify any files.
 *
 * Usage:
 *   node scripts/audit-lesson-ca-vs-us-diff.mjs [--limit N] [--slug pattern]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_DIR = path.join(__dirname, "../src/content/pathway-lessons");

const LIMIT = (() => {
  const i = process.argv.indexOf("--limit");
  return i >= 0 ? parseInt(process.argv[i + 1], 10) : Infinity;
})();
const SLUG_FILTER = (() => {
  const i = process.argv.indexOf("--slug");
  return i >= 0 ? process.argv[i + 1] : null;
})();

// ── Country-specific content markers ─────────────────────────────────────

const CA_MARKERS = [
  /\bCNA\b/, /\bCNO\b/, /\bCRNBC\b/, /\bCPSO\b/, /\bCPSBC\b/,
  /\bCanadian\b/i, /\bREx-PN\b/, /\bNCLEX-RN Canada\b/i,
  /\bprovincial\b/i, /\bOntario\b/, /\bBritish Columbia\b/,
  /\bAlberta\b/, /\bQuebec\b/, /\bManitoba\b/,
  /\bHarbour\b/, /\bcolour\b/, /\bfavour\b/, // Canadian spelling
];

const US_MARKERS = [
  /\bNCSBN\b/, /\bANA\b/, /\bNPI\b/, /\bCMS\b/, /\bFDA\b/,
  /\bMedicare\b/, /\bMedicaid\b/,
  /\bAmerican\b/i, /\bNCLEX-RN US\b/i,
  /\bstate board\b/i, /\bstate nursing board\b/i,
];

function detectCountryMarkers(body) {
  const ca = CA_MARKERS.filter((p) => p.test(body)).map((p) => p.source);
  const us = US_MARKERS.filter((p) => p.test(body)).map((p) => p.source);
  return { ca, us };
}

// ── Text similarity ────────────────────────────────────────────────────────

function wordSet(text) {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3)
  );
}

function jaccard(a, b) {
  const sa = wordSet(a), sb = wordSet(b);
  const inter = [...sa].filter((w) => sb.has(w)).length;
  const union = new Set([...sa, ...sb]).size;
  return union === 0 ? 1 : inter / union;
}

// ── Load catalogs ──────────────────────────────────────────────────────────

function loadAllLessonsForPathway(pathwayId) {
  const files = fs
    .readdirSync(CATALOG_DIR)
    .filter(
      (f) =>
        f.endsWith(".json") &&
        !f.includes("master-map") &&
        !f.includes("import-state") &&
        !f.includes("aliases") &&
        !f.includes("checklist")
    );

  const lessons = new Map(); // slug → lesson
  for (const file of files) {
    let raw;
    try {
      raw = JSON.parse(fs.readFileSync(path.join(CATALOG_DIR, file), "utf8"));
    } catch {
      continue;
    }
    const pw = raw.pathways?.[pathwayId];
    if (!pw) continue;
    const arr = Array.isArray(pw) ? pw : pw.lessons ?? [];
    for (const l of arr) {
      if (!l.slug || !l.title) continue;
      if (!lessons.has(l.slug)) lessons.set(l.slug, l);
    }
  }
  return lessons;
}

// ── Diff a pair ────────────────────────────────────────────────────────────

function diffLessonPair(ca, us) {
  const caBody = (ca.sections ?? []).map((s) => s.body).join("\n");
  const usBody = (us.sections ?? []).map((s) => s.body).join("\n");

  const titleMatch = ca.title === us.title;
  const sectionCountMatch = (ca.sections?.length ?? 0) === (us.sections?.length ?? 0);

  // Section-level diffs
  const caSections = ca.sections ?? [];
  const usSections = us.sections ?? [];
  const sectionDiffs = [];
  const maxLen = Math.max(caSections.length, usSections.length);

  for (let i = 0; i < maxLen; i++) {
    const cs = caSections[i];
    const us_ = usSections[i];
    if (!cs || !us_) {
      sectionDiffs.push({ index: i, kind: cs?.kind ?? us_?.kind, sim: 0, extra: true });
      continue;
    }
    const sim = jaccard(cs.body ?? "", us_.body ?? "");
    const caMarkers = detectCountryMarkers(cs.body ?? "");
    const usMarkers = detectCountryMarkers(us_.body ?? "");
    sectionDiffs.push({
      index: i,
      kind: cs.kind,
      sim: Math.round(sim * 100),
      caMarkersFound: caMarkers.ca,
      usMarkersFound: usMarkers.us,
      bothMarkersFound: [...caMarkers.ca, ...usMarkers.us].length > 0,
    });
  }

  const overallSim = jaccard(caBody, usBody);
  const caMarkersTotal = detectCountryMarkers(caBody);
  const usMarkersTotal = detectCountryMarkers(usBody);

  const hasCountrySpecificContent =
    caMarkersTotal.ca.length > 0 || usMarkersTotal.us.length > 0;

  // Classification
  let classification;
  let recommendation;
  if (overallSim >= 0.98 && !hasCountrySpecificContent) {
    classification = "IDENTICAL";
    recommendation = "consolidate_to_single_row";
  } else if (overallSim >= 0.85 && !hasCountrySpecificContent) {
    classification = "NEAR_IDENTICAL";
    recommendation = "share_foundation_minor_diff_ok";
  } else if (overallSim >= 0.7 && hasCountrySpecificContent) {
    classification = "COUNTRY_SPECIFIC";
    recommendation = "keep_separate";
  } else if (overallSim >= 0.7) {
    classification = "DIVERGENT";
    recommendation = "manual_review";
  } else {
    classification = "DIFFERENT";
    recommendation = "keep_separate";
  }

  return {
    caSlug: ca.slug,
    usSlug: us.slug,
    caTitle: ca.title,
    usTitle: us.title,
    titleMatch,
    sectionCountMatch,
    caSectionCount: caSections.length,
    usSectionCount: usSections.length,
    overallSimilarity: Math.round(overallSim * 100),
    hasCountrySpecificContent,
    caMarkersFound: caMarkersTotal.ca,
    usMarkersFound: usMarkersTotal.us,
    classification,
    recommendation,
    sectionDiffs,
  };
}

// ── Main ───────────────────────────────────────────────────────────────────

function main() {
  console.log("Loading CA-RN and US-RN lesson catalogs...");
  const caLessons = loadAllLessonsForPathway("ca-rn-nclex-rn");
  const usLessons = loadAllLessonsForPathway("us-rn-nclex-rn");
  console.log(`CA-RN: ${caLessons.size} lessons`);
  console.log(`US-RN: ${usLessons.size} lessons`);

  // Find pairs by shared slug
  const sharedSlugs = [...caLessons.keys()].filter((s) => usLessons.has(s));
  console.log(`\nShared slugs (exact match): ${sharedSlugs.length}`);

  // Also match by title for pathway-prefixed slugs
  const caByTitle = new Map([...caLessons.values()].map((l) => [l.title.toLowerCase(), l]));
  const usWithoutSharedSlug = [...usLessons.values()].filter((l) => !sharedSlugs.includes(l.slug));
  const titleMatchedPairs = [];
  for (const usLesson of usWithoutSharedSlug) {
    const caMatch = caByTitle.get(usLesson.title.toLowerCase());
    if (caMatch && !sharedSlugs.includes(caMatch.slug)) {
      titleMatchedPairs.push({ ca: caMatch, us: usLesson });
    }
  }
  console.log(`Title-matched pairs (different slugs): ${titleMatchedPairs.length}`);
  console.log(`Total pairs to diff: ${sharedSlugs.length + titleMatchedPairs.length}`);

  const results = [];
  let analyzed = 0;

  // Diff shared-slug pairs
  for (const slug of sharedSlugs) {
    if (SLUG_FILTER && !slug.includes(SLUG_FILTER)) continue;
    if (analyzed >= LIMIT) break;
    const ca = caLessons.get(slug);
    const us = usLessons.get(slug);
    results.push(diffLessonPair(ca, us));
    analyzed++;
  }

  // Diff title-matched pairs
  for (const { ca, us } of titleMatchedPairs) {
    if (SLUG_FILTER && !ca.slug.includes(SLUG_FILTER) && !us.slug.includes(SLUG_FILTER)) continue;
    if (analyzed >= LIMIT) break;
    results.push(diffLessonPair(ca, us));
    analyzed++;
  }

  // ── Summary statistics ─────────────────────────────────────────────────
  const byClass = {};
  const byRec = {};
  for (const r of results) {
    byClass[r.classification] = (byClass[r.classification] || 0) + 1;
    byRec[r.recommendation] = (byRec[r.recommendation] || 0) + 1;
  }

  console.log("\n" + "=".repeat(72));
  console.log("CA vs US LESSON DIFF ANALYSIS");
  console.log("=".repeat(72));
  console.log(`Pairs analyzed: ${results.length}`);
  console.log("\nClassification breakdown:");
  for (const [cls, n] of Object.entries(byClass).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cls.padEnd(20)} ${n}`);
  }
  console.log("\nRecommendation breakdown:");
  for (const [rec, n] of Object.entries(byRec).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${rec.padEnd(40)} ${n}`);
  }

  // Show country-specific lessons
  const countrySpecific = results.filter((r) => r.hasCountrySpecificContent);
  console.log(`\nLessons with country-specific content markers: ${countrySpecific.length}`);
  if (countrySpecific.length > 0) {
    console.log("(These must NOT be merged — keep separate pathways)\n");
    for (const r of countrySpecific.slice(0, 20)) {
      console.log(`  ${r.caTitle}`);
      if (r.caMarkersFound.length) console.log(`    CA markers: ${r.caMarkersFound.join(", ")}`);
      if (r.usMarkersFound.length) console.log(`    US markers: ${r.usMarkersFound.join(", ")}`);
    }
  }

  // Show safe-to-consolidate lessons
  const identical = results.filter((r) => r.classification === "IDENTICAL");
  console.log(`\nIdentical lessons (safe to consolidate): ${identical.length}`);
  if (identical.length > 0) {
    console.log("Sample:");
    for (const r of identical.slice(0, 10)) {
      console.log(`  ${r.caTitle} (${r.overallSimilarity}% similar)`);
    }
  }

  // ── Write full JSON report ─────────────────────────────────────────────
  const outDir = path.join(__dirname, "../.claude/audits");
  fs.mkdirSync(outDir, { recursive: true });

  const report = {
    generatedAt: new Date().toISOString(),
    totalPairsAnalyzed: results.length,
    classificationBreakdown: byClass,
    recommendationBreakdown: byRec,
    countrySpecificCount: countrySpecific.length,
    identicalCount: identical.length,
    results,
  };

  const outPath = path.join(outDir, "lesson-ca-vs-us-diff.json");
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(`\nFull diff report → ${outPath}`);
  console.log("\nNext step: review country-specific lessons before any CA/US consolidation.");
}

main();
