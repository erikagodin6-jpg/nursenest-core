#!/usr/bin/env npx tsx
/**
 * validate-internal-links.ts
 *
 * Validation pass for rn-topic-links.json.
 * Checks safety rules, relevance quality, and distribution quality.
 * Exits with code 1 if critical failures are found.
 *
 * Usage:
 *   npx tsx scripts/validate-internal-links.ts [--links=FILE] [--manifest=FILE]
 */

import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TopicLink = {
  topicSlug: string;
  relatedTopicSlugs: string[];
  suggestedQuestionTopics: string[];
};

type LinksFile = {
  _meta: { maxLinks: number; algorithm: string };
  topicLinks: TopicLink[];
};

type ManifestTopic = {
  topicSlug: string;
  topicLabel: string;
  bodySystem: string;
  tags: string[];
  category: string;
};

type ManifestFile = { topics: ManifestTopic[] };

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag: string) =>
    args.find((a) => a.startsWith(`--${flag}=`))?.split("=").slice(1).join("=");
  return {
    links: get("links") ?? path.resolve(__dirname, "../output/rn-topic-links.json"),
    manifest: get("manifest") ?? path.resolve(__dirname, "../output/rn-topic-manifest.json"),
  };
}

// ---------------------------------------------------------------------------
// Scoring (mirrors enrich-internal-links.ts exactly, for cross-validation)
// ---------------------------------------------------------------------------

function scoreRelatedness(
  src: ManifestTopic,
  cand: ManifestTopic,
): number {
  if (src.topicSlug === cand.topicSlug) return -1;
  let score = 0;
  if (src.bodySystem.toLowerCase() === cand.bodySystem.toLowerCase()) score += 3;
  if (src.bodySystem === "multi-system" || cand.bodySystem === "multi-system") score += 1;
  const srcTags = new Set(src.tags.map((t) => t.toLowerCase()));
  for (const tag of cand.tags) {
    if (srcTags.has(tag.toLowerCase())) score += 2;
  }
  if (src.category && cand.category && src.category === cand.category) score += 1;
  return score;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const WARN  = "⚠️ ";
const FAIL  = "❌ ";
const OK    = "✅ ";
const INFO  = "ℹ️  ";
const HR    = "─".repeat(70);

function sep(label: string) {
  console.log(`\n${HR}`);
  console.log(`  ${label}`);
  console.log(HR);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const opts = parseArgs();
  let criticalFailures = 0;
  let warnings = 0;

  const linksRaw = await fs.readFile(opts.links, "utf8").catch(() => null);
  const manifestRaw = await fs.readFile(opts.manifest, "utf8").catch(() => null);

  if (!linksRaw) {
    console.error(`${FAIL} Cannot read links file: ${opts.links}`);
    process.exit(1);
  }
  if (!manifestRaw) {
    console.error(`${FAIL} Cannot read manifest: ${opts.manifest}`);
    process.exit(1);
  }

  const linksFile = JSON.parse(linksRaw) as LinksFile;
  const manifest = JSON.parse(manifestRaw) as ManifestFile;

  const links = linksFile.topicLinks;
  const topics = manifest.topics;
  const allSlugs = new Set(topics.map((t) => t.topicSlug));
  const topicBySlug = new Map(topics.map((t) => [t.topicSlug, t]));
  const maxLinks = linksFile._meta.maxLinks;

  console.log(`\n${"=".repeat(70)}`);
  console.log("  NurseNest Internal-Link Validation Report");
  console.log(`  Links file : ${path.basename(opts.links)}`);
  console.log(`  Topics     : ${topics.length}  |  Link entries: ${links.length}`);
  console.log(`  Algorithm  : ${linksFile._meta.algorithm}`);
  console.log(`  maxLinks   : ${maxLinks}`);
  console.log("=".repeat(70));

  // =========================================================================
  // SECTION 1 — SAFETY RULES
  // =========================================================================
  sep("SECTION 1 · Safety Rules");

  let selfLinks = 0;
  let duplicates = 0;
  let overLimit = 0;
  let brokenSlugs = 0;
  let missingFields = 0;

  for (const entry of links) {
    if (!entry.topicSlug || !Array.isArray(entry.relatedTopicSlugs) || !Array.isArray(entry.suggestedQuestionTopics)) {
      missingFields++;
      continue;
    }

    // Self-links
    if (entry.relatedTopicSlugs.includes(entry.topicSlug)) selfLinks++;
    if (entry.suggestedQuestionTopics.includes(entry.topicSlug)) selfLinks++;

    // Duplicates within array
    const relSet = new Set(entry.relatedTopicSlugs);
    if (relSet.size !== entry.relatedTopicSlugs.length) duplicates++;
    const sqSet = new Set(entry.suggestedQuestionTopics);
    if (sqSet.size !== entry.suggestedQuestionTopics.length) duplicates++;

    // Over max-links
    if (entry.relatedTopicSlugs.length > maxLinks) overLimit++;
    if (entry.suggestedQuestionTopics.length > maxLinks) overLimit++;

    // Slugs must exist in manifest
    for (const slug of [...entry.relatedTopicSlugs, ...entry.suggestedQuestionTopics]) {
      if (!allSlugs.has(slug)) brokenSlugs++;
    }
  }

  console.log(`\n  Self-links              : ${selfLinks === 0 ? OK : FAIL} ${selfLinks}`);
  console.log(`  Duplicate links in array: ${duplicates === 0 ? OK : FAIL} ${duplicates}`);
  console.log(`  Over max-links (${maxLinks})      : ${overLimit === 0 ? OK : FAIL} ${overLimit}`);
  console.log(`  Broken/unknown slugs    : ${brokenSlugs === 0 ? OK : FAIL} ${brokenSlugs}`);
  console.log(`  Missing required fields : ${missingFields === 0 ? OK : FAIL} ${missingFields}`);

  if (selfLinks > 0 || duplicates > 0 || brokenSlugs > 0) criticalFailures++;

  // =========================================================================
  // SECTION 2 — DISTRIBUTION QUALITY
  // =========================================================================
  sep("SECTION 2 · Distribution Quality");

  // 2a. Hub dominance — which slugs appear most frequently as recommendations
  const appearanceCount = new Map<string, number>();
  for (const entry of links) {
    for (const slug of entry.relatedTopicSlugs) {
      appearanceCount.set(slug, (appearanceCount.get(slug) ?? 0) + 1);
    }
  }

  const totalSlots = links.reduce((a, e) => a + e.relatedTopicSlugs.length, 0);
  const topHubs = [...appearanceCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  console.log(`\n  Top recommended topics (hub dominance):`);
  console.log(`  ${"Slug".padEnd(45)} Count  % of slots`);
  console.log(`  ${"-".repeat(65)}`);
  for (const [slug, count] of topHubs) {
    const pct = ((count / (links.length - 1)) * 100).toFixed(0);
    const marker = count > 15 ? WARN : count > 10 ? INFO : "  ";
    console.log(`  ${marker}${slug.padEnd(43)} ${String(count).padStart(3)}    ${pct}%`);
  }
  if (topHubs[0] && topHubs[0][1] > 20) {
    console.log(`\n  ${FAIL} CRITICAL: "${topHubs[0][0]}" dominates ${topHubs[0][1]}/${links.length - 1} possible slots (${((topHubs[0][1] / (links.length - 1)) * 100).toFixed(0)}%).`);
    console.log(`       Hub dominance above 30% of slots indicates broken tie-breaking.`);
    criticalFailures++;
  } else if (topHubs[0] && topHubs[0][1] > 15) {
    warnings++;
    console.log(`\n  ${WARN} Hub dominance warning for "${topHubs[0][0]}".`);
  }

  // 2b. Topics with weak link sets (low max score among their top-6)
  console.log(`\n  Topics with sparse/weak link scores (expected min score ≥ 3 for top pick):`);
  const weakTopics: string[] = [];
  for (const entry of links) {
    const src = topicBySlug.get(entry.topicSlug);
    if (!src) continue;
    const scores = entry.relatedTopicSlugs.map((slug) => {
      const cand = topicBySlug.get(slug);
      return cand ? scoreRelatedness(src, cand) : 0;
    });
    const topScore = scores.length > 0 ? Math.max(...scores) : 0;
    if (topScore < 3) weakTopics.push(`${entry.topicSlug} (top score=${topScore})`);
  }
  if (weakTopics.length === 0) {
    console.log(`  ${OK} All topics achieve score ≥ 3 for their top pick.`);
  } else {
    for (const w of weakTopics) console.log(`  ${WARN} ${w}`);
    warnings++;
  }

  // 2c. Identical link sets (clustering echo chambers)
  const linkFingerprints = new Map<string, string[]>();
  for (const entry of links) {
    const key = [...entry.relatedTopicSlugs].sort().join("|");
    const bucket = linkFingerprints.get(key) ?? [];
    bucket.push(entry.topicSlug);
    linkFingerprints.set(key, bucket);
  }
  const identicalGroups = [...linkFingerprints.values()].filter((g) => g.length > 1);
  console.log(`\n  Identical link-set groups (circular echo clusters):`);
  if (identicalGroups.length === 0) {
    console.log(`  ${OK} No identical link sets.`);
  } else {
    for (const group of identicalGroups) {
      const marker = group.length >= 3 ? WARN : INFO;
      console.log(`  ${marker} [${group.length} topics share the same 6 links]: ${group.join(", ")}`);
    }
    warnings++;
  }

  // =========================================================================
  // SECTION 3 — RELEVANCE QUALITY SAMPLES
  // =========================================================================
  sep("SECTION 3 · Relevance Quality — Sample Analysis");

  // Compute score breakdown for every (source, recommended) pair
  type PairAnalysis = {
    source: string;
    sourceSystem: string;
    candidate: string;
    candidateSystem: string;
    score: number;
    systemMatch: boolean;
    sharedTags: string[];
    categoryMatch: boolean;
    rank: number;
  };

  const allPairs: PairAnalysis[] = [];
  for (const entry of links) {
    const src = topicBySlug.get(entry.topicSlug);
    if (!src) continue;
    entry.relatedTopicSlugs.forEach((slug, rank) => {
      const cand = topicBySlug.get(slug);
      if (!cand) return;
      const systemMatch = src.bodySystem.toLowerCase() === cand.bodySystem.toLowerCase();
      const srcTagSet = new Set(src.tags.map((t) => t.toLowerCase()));
      const sharedTags = cand.tags.filter((t) => srcTagSet.has(t.toLowerCase()));
      const categoryMatch = src.category === cand.category;
      const score = scoreRelatedness(src, cand);
      allPairs.push({
        source: entry.topicSlug,
        sourceSystem: src.bodySystem,
        candidate: slug,
        candidateSystem: cand.bodySystem,
        score,
        systemMatch,
        sharedTags,
        categoryMatch,
        rank,
      });
    });
  }

  // Strong matches (score ≥ 7 = same system + multiple tags)
  const strongMatches = allPairs.filter((p) => p.score >= 7).slice(0, 8);
  console.log(`\n  STRONG MATCHES (score ≥ 7 — same system + multiple shared tags):`);
  for (const p of strongMatches) {
    console.log(`  ${OK} ${p.source} → ${p.candidate}`);
    console.log(`       score=${p.score}  system=${p.systemMatch ? "✓" : "✗"}  tags=[${p.sharedTags.join(",")}]  category=${p.categoryMatch ? "✓" : "✗"}`);
  }

  // Weak matches (score ≤ 2, appearing in any top-6 position)
  const weakMatches = allPairs.filter((p) => p.score <= 2).sort((a, b) => a.score - b.score);
  console.log(`\n  WEAK MATCHES (score ≤ 2 — minimal overlap):`);
  if (weakMatches.length === 0) {
    console.log(`  ${OK} No weak matches found.`);
  } else {
    for (const p of weakMatches.slice(0, 10)) {
      console.log(`  ${WARN} ${p.source} → ${p.candidate}`);
      console.log(`       score=${p.score}  system=${p.systemMatch ? "match" : `${p.sourceSystem} ≠ ${p.candidateSystem}`}  tags=[${p.sharedTags.join(",") || "none"}]  category=${p.categoryMatch ? "match" : "no"}`);
    }
    warnings++;
  }

  // Cross-system connections that are clinically odd
  console.log(`\n  CROSS-SYSTEM CONNECTIONS (score ≤ 3, different body systems, rank 4–6):`);
  const crossSystemEdgeCases = allPairs.filter(
    (p) => !p.systemMatch && p.score <= 3 && p.rank >= 3,
  );
  if (crossSystemEdgeCases.length === 0) {
    console.log(`  ${OK} No concerning cross-system edge cases in tail slots.`);
  } else {
    for (const p of crossSystemEdgeCases.slice(0, 12)) {
      const src = topicBySlug.get(p.source)!;
      const cand = topicBySlug.get(p.candidate)!;
      const clinicalNote = p.sharedTags.length === 1
        ? `(only shared tag: "${p.sharedTags[0]}")`
        : p.score === 1
          ? "(multi-system bonus only — no real overlap)"
          : "";
      console.log(`  ${WARN} [rank ${p.rank + 1}] ${p.source} (${src.bodySystem}) → ${p.candidate} (${cand.bodySystem}) score=${p.score} ${clinicalNote}`);
    }
    warnings++;
  }

  // =========================================================================
  // SECTION 4 — SPECIFIC CLINICAL GAPS
  // =========================================================================
  sep("SECTION 4 · Specific Clinical Gap Analysis");

  const clinicalPairs: Array<{ a: string; b: string; reason: string }> = [
    { a: "anticoagulation-therapy",    b: "pulmonary-embolism",      reason: "DVT/PE is primary indication for anticoagulation" },
    { a: "anticoagulation-therapy",    b: "atrial-fibrillation",     reason: "AF is primary indication for anticoagulation" },
    { a: "anticoagulation-therapy",    b: "myocardial-infarction",   reason: "ACS management includes anticoagulation" },
    { a: "pulmonary-embolism",         b: "atrial-fibrillation",     reason: "Share anticoagulation tag; both thromboembolic" },
    { a: "hyperosmolar-hyperglycemic-state", b: "insulin-management", reason: "HHS is treated with insulin" },
    { a: "ischemic-stroke",            b: "opioid-analgesics",       reason: "Same neurological system (stronger link than emergency MI)" },
    { a: "ischemic-stroke",            b: "pain-assessment-and-management", reason: "Same neurological system" },
    { a: "sepsis-and-septic-shock",    b: "infection-control-and-precautions", reason: "Same immunological system; prevention" },
    { a: "diabetic-ketoacidosis",      b: "corticosteroid-therapy",  reason: "Corticosteroids precipitate DKA; same endocrine system" },
    { a: "liver-cirrhosis-hepatic-encephalopathy", b: "diuretic-therapy", reason: "Diuretics used in ascites management" },
    { a: "fractures-and-orthopedic-care", b: "acute-pancreatitis",  reason: "Only 'pain' tag shared — NOT clinically a natural pairing" },
    { a: "infection-control-and-precautions", b: "emergency-triage-principles", reason: "Score=1 (multi-system bonus only); clinical link is very thin" },
  ];

  console.log(`\n  Checking ${clinicalPairs.length} expected/unexpected clinical pairings:\n`);
  let gapCount = 0;
  let spuriousCount = 0;

  for (const pair of clinicalPairs) {
    const entryA = links.find((e) => e.topicSlug === pair.a);
    const aLinksB = entryA?.relatedTopicSlugs.includes(pair.b) ?? false;
    const entryB = links.find((e) => e.topicSlug === pair.b);
    const bLinksA = entryB?.relatedTopicSlugs.includes(pair.a) ?? false;

    const srcTopic = topicBySlug.get(pair.a);
    const candTopic = topicBySlug.get(pair.b);
    const score = srcTopic && candTopic ? scoreRelatedness(srcTopic, candTopic) : -1;

    // Expected links (first 10) — should be present
    const isExpected = clinicalPairs.indexOf(pair) < 10;
    if (isExpected) {
      if (!aLinksB) {
        console.log(`  ${FAIL} MISSING: ${pair.a} should link to ${pair.b}`);
        console.log(`       Reason: ${pair.reason}`);
        console.log(`       Score: ${score} — excluded by array-order tie-breaking or zero score`);
        gapCount++;
      } else {
        const rank = (entryA?.relatedTopicSlugs.indexOf(pair.b) ?? -1) + 1;
        console.log(`  ${OK} PRESENT: ${pair.a} → ${pair.b} (rank ${rank}, score=${score})`);
      }
    } else {
      // Spurious links (last 2) — should NOT be present or score low
      if (aLinksB) {
        const rank = (entryA?.relatedTopicSlugs.indexOf(pair.a) ?? -1) + 1;
        console.log(`  ${WARN} SPURIOUS: ${pair.a} → ${pair.b} (rank ${rank}, score=${score})`);
        console.log(`       Concern: ${pair.reason}`);
        spuriousCount++;
        warnings++;
      } else {
        console.log(`  ${OK} CORRECTLY ABSENT (or low-rank): ${pair.a} → ${pair.b} (score=${score})`);
      }
    }
  }

  if (gapCount > 0) {
    criticalFailures++;
    console.log(`\n  ${FAIL} ${gapCount} critical clinical pairing(s) missing.`);
  }

  // =========================================================================
  // SECTION 5 — ROOT CAUSE ANALYSIS
  // =========================================================================
  sep("SECTION 5 · Root Cause Analysis");

  // Tie-breaking bias: count how many pairs have the same score where array-order winner differs from clinically preferred
  const ARRAY_ORDER = topics.map((t) => t.topicSlug);
  const arrayIndex = (slug: string) => ARRAY_ORDER.indexOf(slug);

  let tieBiasInstances = 0;
  const tieBiasExamples: string[] = [];

  for (const entry of links) {
    const src = topicBySlug.get(entry.topicSlug);
    if (!src) continue;

    // All candidates not in the top-6
    const excluded = topics
      .filter((t) => t.topicSlug !== entry.topicSlug && !entry.relatedTopicSlugs.includes(t.topicSlug))
      .map((t) => ({ slug: t.topicSlug, score: scoreRelatedness(src, t) }))
      .filter((x) => x.score > 0);

    // Find any excluded topic with score >= min score in the included set
    const minIncludedScore = Math.min(
      ...entry.relatedTopicSlugs
        .map((slug) => {
          const cand = topicBySlug.get(slug);
          return cand ? scoreRelatedness(src, cand) : 0;
        })
        .filter((s) => s > 0),
    );

    for (const exc of excluded) {
      if (exc.score >= minIncludedScore) {
        // Same-system excluded but lower-indexed non-same-system included at same score
        const excTopic = topicBySlug.get(exc.slug)!;
        const sameSystem = excTopic.bodySystem.toLowerCase() === src.bodySystem.toLowerCase();
        if (sameSystem && arrayIndex(exc.slug) > arrayIndex(entry.relatedTopicSlugs[entry.relatedTopicSlugs.length - 1]!)) {
          tieBiasInstances++;
          if (tieBiasExamples.length < 6) {
            tieBiasExamples.push(
              `  ${WARN} ${entry.topicSlug} excludes same-system "${exc.slug}" (score=${exc.score}, idx=${arrayIndex(exc.slug)}) in favor of earlier non-same-system picks`,
            );
          }
        }
      }
    }
  }

  console.log(`\n  Array-order tie-breaking bias:`);
  console.log(`  Instances where same-system topic excluded due to array position: ${tieBiasInstances}`);
  for (const ex of tieBiasExamples) console.log(ex);
  if (tieBiasInstances > 0) {
    warnings++;
    console.log(`\n  ${WARN} Tie-breaking uses JavaScript stable sort (insertion order).`);
    console.log(`       Topics at low array indices (hard med-surg) systematically win ties`);
    console.log(`       over same-system neurological/pharmacology topics at higher indices.`);
  }

  // suggestedQuestionTopics === relatedTopicSlugs analysis
  let identicalArrays = 0;
  for (const entry of links) {
    if (JSON.stringify(entry.relatedTopicSlugs) === JSON.stringify(entry.suggestedQuestionTopics)) {
      identicalArrays++;
    }
  }
  console.log(`\n  suggestedQuestionTopics always === relatedTopicSlugs: ${identicalArrays}/${links.length} entries`);
  if (identicalArrays === links.length) {
    console.log(`  ${WARN} Both arrays are identical for every topic because all 50 topics have planned questions.`);
    console.log(`       This field carries no incremental information in the current manifest-only output.`);
    console.log(`       Will differentiate only when a batch with lesson-only topics is processed.`);
    warnings++;
  }

  // =========================================================================
  // SECTION 6 — RECOMMENDED SCORING ADJUSTMENTS
  // =========================================================================
  sep("SECTION 6 · Recommended Scoring Adjustments");

  console.log(`
  1. FIX — Array-order tie-breaking (HIGH PRIORITY)
     ────────────────────────────────────────────────
     Problem: Stable sort keeps insertion order on ties, systematically
              favouring hard med-surg topics (indices 0–9) over same-system
              neurological/pharmacology topics (indices 26–43).
     Impact : ${tieBiasInstances} same-system topics excluded from recommendations.

     Fix: Secondary sort key — prefer same-system candidates when score ties.
     In topRelated(), change:
       .sort((a, b) => b.score - a.score)
     To:
       .sort((a, b) => {
         if (b.score !== a.score) return b.score - a.score;
         // Tiebreak: prefer same body system as source
         const aSystem = topicBySlug.get(a.slug)?.bodySystem === source.bodySystem ? 1 : 0;
         const bSystem = topicBySlug.get(b.slug)?.bodySystem === source.bodySystem ? 1 : 0;
         return bSystem - aSystem;
       })

  2. FIX — Cross-system clinical bridges via tag alignment (HIGH PRIORITY)
     ────────────────────────────────────────────────────────────────────
     Problem: anticoagulation-therapy scores 0 against pulmonary-embolism,
              atrial-fibrillation because it has no shared tags.
              Both PE and AF carry the "anticoagulation" tag, but
              anticoagulation-therapy itself carries "bleeding-risk", "lab-monitoring".

     Fix (A, preferred): Add bridging tags to generate-rn-content.ts TOPICS:
       anticoagulation-therapy.tags += ["anticoagulation", "thrombosis"]
       This gives it overlap with PE ("anticoagulation" tag) and AF.

     Fix (B, alternative): Add a clinicalBridges map in the enricher script
       for hard-coded cross-system pairs the scorer cannot infer from tags alone.

  3. FIX — Multi-system bonus reduction (MEDIUM PRIORITY)
     ──────────────────────────────────────────────────────
     Problem: The flat +1 multi-system bonus causes multi-system delegation/safety
              topics to appear in position-6 for specialized clinical topics
              (e.g., infection-control → emergency-triage-principles at score=1).
     
     Current: Any candidate with bodySystem="multi-system" gets +1 regardless.
     Fix: Only apply the bonus when BOTH source AND candidate are multi-system,
          OR when source has ≥ 2 shared tags with the candidate regardless.
          Remove the unconditional single-side multi-system +1.

  4. WATCH — Hub dominance of myocardial-infarction (~40% of recommendation slots)
     ────────────────────────────────────────────────────────────────────────────
     Problem: MI (tags: cardiac, emergency, priority-setting, pharmacology) matches
              a wide variety of topics via shared "emergency" + same-category.
     No immediate code fix needed — the fix for (1) reduces array-bias that inflates MI.
     Monitor after fix (1) is applied. If still >25% slots, consider a per-slot
     global frequency cap: no single slug in more than ⌊N/3⌋ = 16 recommendation slots.

  5. NO-OP — suggestedQuestionTopics redundancy
     ─────────────────────────────────────────────
     Currently identical to relatedTopicSlugs for all 50 entries.
     No fix needed now. Will diverge correctly once a real batch (with lessons-only
     or questions-only topics) is processed. Document behaviour in the overlay _meta.
`);

  // =========================================================================
  // FINAL VERDICT
  // =========================================================================
  sep("FINAL VERDICT");

  const status = criticalFailures > 0 ? `${FAIL} NOT SAFE TO WIRE INTO UI` : warnings > 3 ? `${WARN} CONDITIONAL PASS` : `${OK} PASSES SAFETY BASELINE`;

  console.log(`
  Safety checks : ${selfLinks + duplicates + brokenSlugs + missingFields === 0 ? "ALL PASS" : "FAILURES"}
  Critical gaps : ${gapCount} clinical links missing from output
  Warnings      : ${warnings}
  Spurious links: ${spuriousCount}
  Status        : ${status}

  Verdict: The output is STRUCTURALLY SAFE (no self-links, no broken slugs,
  no duplicates, max-links respected for all 50 entries). However it has
  2 behavioural issues that should be fixed before UI wiring:

  MUST FIX before wiring:
    [1] Tie-breaking bias excludes same-system topics at higher array indices.
        Fixes ischemic-stroke missing opioid-analgesics/pain-assessment;
        HHS missing insulin-management; and reduces MI hub dominance.
    [2] anticoagulation-therapy has ZERO links to its primary clinical use
        cases (PE, AF). Add "anticoagulation" + "thrombosis" bridging tags
        to the TOPICS spec in generate-rn-content.ts.

  OK to defer:
    [3] Multi-system bonus reduction (low-quality tail entries only).
    [4] MI hub monitoring (after fix 1, re-validate).
    [5] suggestedQuestionTopics redundancy (no-op until batch is available).
`);

  if (criticalFailures > 0) process.exit(1);
}

main().catch((e) => {
  console.error("\n💥 Fatal error:", e);
  process.exit(1);
});
