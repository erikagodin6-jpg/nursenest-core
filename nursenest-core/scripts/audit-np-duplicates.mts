#!/usr/bin/env npx tsx
import "../src/lib/db/script-env-bootstrap";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PATHWAYS = [
  { id: "us-np-fnp",    tag: "pathway:us-np-fnp",    exam: "FNP" },
  { id: "us-np-agpcnp", tag: "pathway:us-np-agpcnp", exam: "AGPCNP" },
  { id: "us-np-pmhnp",  tag: "pathway:us-np-pmhnp",  exam: "PMHNP" },
  { id: "us-np-whnp",   tag: "pathway:us-np-whnp",   exam: "WHNP" },
  { id: "us-np-pnp-pc", tag: "pathway:us-np-pnp-pc", exam: "PNP-PC" },
];

type Row = { id: string; stemHash: string | null; stem: string; topic: string | null; bodySystem: string | null; subtopic: string | null; nclexClientNeedsCategory: string | null };

const results: Record<string, {
  total: number;
  exactDupHashes: number;
  exactDupRows: number;
  sameConceptPairs: number;
  topRepeatedConcepts: { key: string; count: number }[];
  stemLengthMin: number;
  stemLengthMax: number;
  stemLengthP50: number;
  stemPrefixDups: number;
}> = {};

for (const pw of PATHWAYS) {
  const rows: Row[] = await prisma.examQuestion.findMany({
    where: { tags: { has: pw.tag }, status: "published" },
    select: { id: true, stemHash: true, stem: true, topic: true, bodySystem: true, subtopic: true, nclexClientNeedsCategory: true },
  });

  // 1. Exact duplicate stemHashes
  const hashCounts = new Map<string, number>();
  for (const r of rows) {
    if (r.stemHash) hashCounts.set(r.stemHash, (hashCounts.get(r.stemHash) ?? 0) + 1);
  }
  const dupHashes = [...hashCounts.entries()].filter(([, c]) => c > 1);
  const exactDupRows = dupHashes.reduce((s, [, c]) => s + c, 0);

  // 2. Same-prefix near-duplicates (first 80 chars of stem, normalized)
  const prefixCounts = new Map<string, number>();
  for (const r of rows) {
    const prefix = r.stem.trim().toLowerCase().replace(/\s+/g, " ").slice(0, 80);
    prefixCounts.set(prefix, (prefixCounts.get(prefix) ?? 0) + 1);
  }
  const stemPrefixDups = [...prefixCounts.values()].filter(c => c > 1).reduce((s, c) => s + c, 0);

  // 3. Concept repetition: topic+bodySystem key
  const conceptCounts = new Map<string, number>();
  for (const r of rows) {
    const key = `${r.topic ?? "?"} | ${r.bodySystem ?? "?"}`;
    conceptCounts.set(key, (conceptCounts.get(key) ?? 0) + 1);
  }
  const sameConceptPairs = [...conceptCounts.values()].filter(c => c > 5).reduce((s, c) => s + (c - 1), 0);
  const topRepeatedConcepts = [...conceptCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([key, count]) => ({ key, count }));

  // 4. Stem lengths
  const lengths = rows.map(r => r.stem.length).sort((a, b) => a - b);
  const p50 = lengths[Math.floor(lengths.length / 2)] ?? 0;

  results[pw.id] = {
    total: rows.length,
    exactDupHashes: dupHashes.length,
    exactDupRows,
    sameConceptPairs,
    topRepeatedConcepts,
    stemLengthMin: lengths[0] ?? 0,
    stemLengthMax: lengths[lengths.length - 1] ?? 0,
    stemLengthP50: p50,
    stemPrefixDups,
  };
}

// Cross-pathway duplicate check (stems that appear in 2+ pathways)
console.log("=== NP DUPLICATE QUESTION AUDIT ===\n");
for (const [pid, r] of Object.entries(results)) {
  const dupPct = ((r.exactDupRows / r.total) * 100).toFixed(1);
  const prefixPct = ((r.stemPrefixDups / r.total) * 100).toFixed(1);
  console.log(`${pid}:`);
  console.log(`  Total questions: ${r.total}`);
  console.log(`  Exact duplicate stemHashes: ${r.exactDupHashes} hash groups, ${r.exactDupRows} rows (${dupPct}%)`);
  console.log(`  Near-duplicate stems (same 80-char prefix): ${r.stemPrefixDups} rows (${prefixPct}%)`);
  console.log(`  Concept over-represented (>5 Qs same topic+system, excess pairs): ${r.sameConceptPairs}`);
  console.log(`  Stem length: min=${r.stemLengthMin} p50=${r.stemLengthP50} max=${r.stemLengthMax}`);
  console.log(`  Top 5 repeated concepts:`);
  for (const c of r.topRepeatedConcepts.slice(0, 5)) {
    console.log(`    "${c.key}": ${c.count}x`);
  }
  console.log();
}

// Cross-pathway: same stemHash appearing in multiple pathways
const allHashes = new Map<string, string[]>();
for (const pw of PATHWAYS) {
  const rows = await prisma.examQuestion.findMany({
    where: { tags: { has: pw.tag }, status: "published", stemHash: { not: null } },
    select: { stemHash: true },
  });
  for (const r of rows) {
    if (!r.stemHash) continue;
    const existing = allHashes.get(r.stemHash) ?? [];
    if (!existing.includes(pw.id)) existing.push(pw.id);
    allHashes.set(r.stemHash, existing);
  }
}
const crossPathway = [...allHashes.entries()].filter(([, pathways]) => pathways.length > 1);
console.log(`Cross-pathway exact duplicates (same stemHash in 2+ pathways): ${crossPathway.length}`);
if (crossPathway.length > 0) {
  for (const [h, pws] of crossPathway.slice(0, 5)) {
    console.log(`  hash=${h.slice(0, 12)}... in: ${pws.join(", ")}`);
  }
}

await prisma.$disconnect();
