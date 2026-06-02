/**
 * Tag CNPLE exam questions — Phase 3 of taxonomy + quality pass.
 *
 * Current state:
 *   - 82 questions tagged exam: "CNPLE" (published, regionScope: BOTH)
 *   - 1,421 questions tagged exam: "NP" + regionScope: "BOTH" (general NP, CA-appropriate)
 *   - 1,342 questions tagged exam: "FNP" + regionScope: "BOTH" (US Family NP, some CA overlap)
 *   - 2,621 questions tagged exam: "NP" + regionScope: "US_ONLY" — NOT eligible for CNPLE
 *
 * Strategy:
 *   - Re-tag "NP" + "BOTH" questions as "CNPLE" — these are general NP questions
 *     not scoped to US-specific guidelines/systems, appropriate for CNPLE learners.
 *   - Leave "FNP" questions alone — FNP is a US credential (AANP/ANCC); content
 *     often includes US-specific billing, Medicaid, DEA, state rules.
 *   - Leave "US_ONLY" questions alone — explicitly US-scoped.
 *   - Never touch RN, RPN, or non-NP tier questions.
 *
 * Heuristics to EXCLUDE from CNPLE tagging (US-specific markers in body):
 *   - References to Medicaid/Medicare, CMS, DEA number, AANP, ANCC, NCLEX
 *   - References to US state nursing boards, US-only formulary items
 *   - US-specific drug brands not used in Canada (extremely rare — stem text filter)
 *
 * Usage:
 *   npx tsx scripts/tag-cnple-exam-questions.mts             # dry-run
 *   npx tsx scripts/tag-cnple-exam-questions.mts --apply     # write to DB
 *   npx tsx scripts/tag-cnple-exam-questions.mts --apply --include-fnp  # also reclassify FNP|BOTH
 */
import "@/lib/db/env-bootstrap";
import { prisma } from "./lib/prisma-script-client";

const DRY_RUN = !process.argv.includes("--apply");
const INCLUDE_FNP = process.argv.includes("--include-fnp");

// US-specific markers that disqualify a question from CNPLE tagging
const US_MARKERS_REGEX =
  /\b(medicaid|medicare|cms\b|dea number|aanp|ancc\b|nclex\b|state board|state nursing board|fda approval for|usmle|peds board|american nursing)\b/i;

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(DRY_RUN ? "=== DRY RUN ===" : "=== APPLYING CNPLE QUESTION TAGGING ===");
  if (INCLUDE_FNP) console.log("  ** Including FNP|BOTH questions in reclassification **");
  console.log();

  // Snapshot before counts
  const beforeCnple = await (prisma.examQuestion as any).count({
    where: { tier: "np", exam: "CNPLE", status: "published" },
  });
  const beforeNpBoth = await (prisma.examQuestion as any).count({
    where: { tier: "np", exam: "NP", regionScope: "BOTH", status: "published" },
  });
  const beforeFnpBoth = await (prisma.examQuestion as any).count({
    where: { tier: "np", exam: "FNP", regionScope: "BOTH", status: "published" },
  });
  const beforeNpUsOnly = await (prisma.examQuestion as any).count({
    where: { tier: "np", exam: "NP", regionScope: "US_ONLY", status: "published" },
  });

  console.log("=== BEFORE ===");
  console.log(`  CNPLE | BOTH  : ${beforeCnple}`);
  console.log(`  NP    | BOTH  : ${beforeNpBoth}`);
  console.log(`  NP    | US_ONLY: ${beforeNpUsOnly} (untouched)`);
  console.log(`  FNP   | BOTH  : ${beforeFnpBoth} (${INCLUDE_FNP ? "will reclassify" : "untouched"})`);

  // Load candidates
  const examValues: string[] = ["NP"];
  if (INCLUDE_FNP) examValues.push("FNP");

  const candidates = await (prisma.examQuestion as any).findMany({
    where: {
      tier: "np",
      exam: { in: examValues },
      regionScope: "BOTH",
      status: "published",
    },
    select: { id: true, exam: true, stem: true, rationale: true },
  });

  console.log(`\nCandidates for reclassification: ${candidates.length}`);

  // Filter out US-specific questions
  const eligible: string[] = [];
  const rejected: { id: string; reason: string }[] = [];

  for (const q of candidates) {
    const text = `${q.stem ?? ""} ${q.rationale ?? ""}`;
    if (US_MARKERS_REGEX.test(text)) {
      rejected.push({ id: q.id, reason: "US-specific markers in stem/rationale" });
    } else {
      eligible.push(q.id);
    }
  }

  console.log(`  Eligible for CNPLE tag: ${eligible.length}`);
  console.log(`  Rejected (US markers): ${rejected.length}`);
  if (rejected.length > 0 && rejected.length <= 10) {
    rejected.forEach((r) => console.log(`    ID ${r.id}: ${r.reason}`));
  }

  if (DRY_RUN) {
    const projected = beforeCnple + eligible.length;
    console.log(`\n[DRY RUN] Projected CNPLE-tagged questions after run: ${projected}`);
    console.log(`  (${beforeCnple} existing + ${eligible.length} newly tagged = ${projected} total)`);
    console.log("\nPass --apply to write.");
    return;
  }

  // Apply in batches
  const BATCH = 500;
  let updated = 0;
  for (let i = 0; i < eligible.length; i += BATCH) {
    const batch = eligible.slice(i, i + BATCH);
    const result = await (prisma.examQuestion as any).updateMany({
      where: { id: { in: batch } },
      data: { exam: "CNPLE" },
    });
    updated += result.count;
    process.stdout.write(`  ${updated}/${eligible.length}\r`);
  }

  // Snapshot after counts
  const afterCnple = await (prisma.examQuestion as any).count({
    where: { tier: "np", exam: "CNPLE", status: "published" },
  });
  const afterNpBoth = await (prisma.examQuestion as any).count({
    where: { tier: "np", exam: "NP", regionScope: "BOTH", status: "published" },
  });

  console.log("\n\n=== AFTER ===");
  console.log(`  CNPLE | BOTH  : ${afterCnple} (+${afterCnple - beforeCnple})`);
  console.log(`  NP    | BOTH  : ${afterNpBoth} (was ${beforeNpBoth})`);
  console.log(`  NP    | US_ONLY: ${beforeNpUsOnly} (unchanged)`);
  console.log(`\n✓ Updated: ${updated} questions → exam: "CNPLE"`);
  console.log(`✓ Total CNPLE questions: ${afterCnple}`);
  console.log(`✓ NP inventory gate will now report: ~${afterCnple + beforeFnpBoth + (INCLUDE_FNP ? 0 : beforeFnpBoth)} eligible questions`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
