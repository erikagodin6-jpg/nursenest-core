#!/usr/bin/env npx tsx
import "../src/lib/db/script-env-bootstrap";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PATHWAYS = [
  { id: "us-np-fnp",    tag: "pathway:us-np-fnp",    label: "FNP" },
  { id: "us-np-agpcnp", tag: "pathway:us-np-agpcnp", label: "AGPCNP" },
  { id: "us-np-pmhnp",  tag: "pathway:us-np-pmhnp",  label: "PMHNP" },
  { id: "us-np-whnp",   tag: "pathway:us-np-whnp",   label: "WHNP" },
  { id: "us-np-pnp-pc", tag: "pathway:us-np-pnp-pc", label: "PNP-PC" },
];

// CAT engine minimums
const CAT_MIN_TOTAL = 75;
const CAT_MIN_PER_DIFFICULTY = 5;
const CAT_MIN_PER_BLUEPRINT = 3;

console.log("=== NP CAT COVERAGE AUDIT ===\n");

for (const pw of PATHWAYS) {
  const rows = await prisma.examQuestion.findMany({
    where: { tags: { has: pw.tag }, status: "published" },
    select: {
      id: true,
      difficulty: true,
      nclexClientNeedsCategory: true,
      bodySystem: true,
      questionFormat: true,
      isAdaptiveEligible: true,
      isMockExamEligible: true,
      qualityScore: true,
    },
  });

  const catRows = rows.filter(r => r.isAdaptiveEligible);
  const n = rows.length;
  const catN = catRows.length;

  // Difficulty distribution
  const diffCounts = new Map<number, number>();
  for (const r of catRows) {
    const d = r.difficulty ?? 3;
    diffCounts.set(d, (diffCounts.get(d) ?? 0) + 1);
  }

  // Blueprint category coverage
  const blueprintCounts = new Map<string, number>();
  for (const r of catRows) {
    const b = r.nclexClientNeedsCategory ?? "(none)";
    blueprintCounts.set(b, (blueprintCounts.get(b) ?? 0) + 1);
  }

  // Body system coverage
  const systemCounts = new Map<string, number>();
  for (const r of catRows) {
    const s = r.bodySystem ?? "(none)";
    systemCounts.set(s, (systemCounts.get(s) ?? 0) + 1);
  }

  // Question format distribution
  const formatCounts = new Map<string, number>();
  for (const r of rows) {
    const f = r.questionFormat ?? "mcq";
    formatCounts.set(f, (formatCounts.get(f) ?? 0) + 1);
  }

  // Quality score distribution
  const qualScores = rows.map(r => r.qualityScore ?? 0).sort((a,b) => a - b);
  const qualP50 = qualScores[Math.floor(qualScores.length / 2)] ?? 0;
  const qualP10 = qualScores[Math.floor(qualScores.length * 0.1)] ?? 0;

  // Flags
  const belowCatMin = catN < CAT_MIN_TOTAL;
  const missingDifficulties = [1,2,3,4,5].filter(d => (diffCounts.get(d) ?? 0) < CAT_MIN_PER_DIFFICULTY);
  const blueprintsBelow = [...blueprintCounts.entries()].filter(([,c]) => c < CAT_MIN_PER_BLUEPRINT).map(([b]) => b);
  const blueprintCount = blueprintCounts.size;

  console.log(`${pw.label} (${pw.id}):`);
  console.log(`  Total questions: ${n}  |  CAT-eligible: ${catN}  |  CAT gate: ${belowCatMin ? "❌ BELOW MINIMUM" : "✅ PASS"}`);
  console.log(`  Mock-exam eligible: ${rows.filter(r => r.isMockExamEligible).length}`);
  console.log(`  Difficulty spread (CAT rows):`);
  for (const d of [1,2,3,4,5]) {
    const count = diffCounts.get(d) ?? 0;
    const flag = count < CAT_MIN_PER_DIFFICULTY ? " ⚠️ LOW" : "";
    console.log(`    D${d}: ${count}${flag}`);
  }
  if (missingDifficulties.length > 0) console.log(`  ⚠️ Difficulty levels below CAT minimum (${CAT_MIN_PER_DIFFICULTY}): ${missingDifficulties.join(", ")}`);

  console.log(`  Question format distribution (all rows):`);
  for (const [fmt, cnt] of [...formatCounts.entries()].sort((a,b) => b[1]-a[1])) {
    console.log(`    ${fmt}: ${cnt} (${pct(cnt,n)}%)`);
  }

  console.log(`  Blueprint categories: ${blueprintCount} distinct`);
  const topBlueprints = [...blueprintCounts.entries()].sort((a,b) => b[1]-a[1]).slice(0,5);
  for (const [b, c] of topBlueprints) {
    console.log(`    "${b}": ${c}`);
  }
  if (blueprintsBelow.length > 0) console.log(`  ⚠️ Blueprints below minimum: ${blueprintsBelow.slice(0,3).join(", ")}${blueprintsBelow.length > 3 ? "..." : ""}`);

  console.log(`  Body systems covered: ${systemCounts.size}`);
  const topSystems = [...systemCounts.entries()].sort((a,b) => b[1]-a[1]).slice(0,8);
  for (const [s, c] of topSystems) {
    console.log(`    ${s}: ${c}`);
  }

  console.log(`  Quality scores: p10=${qualP10} p50=${qualP50}`);
  console.log();
}

function pct(n: number, total: number): string {
  return total > 0 ? ((n / total) * 100).toFixed(1) : "0.0";
}

await prisma.$disconnect();
