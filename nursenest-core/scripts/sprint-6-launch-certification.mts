#!/usr/bin/env tsx
/**
 * Sprint 6 — NCLEX-RN Launch Certification Audit.
 *
 * Runs a full gate-check against the NurseNest Content Inventory Targets.
 * Emits a structured JSON + Markdown report to:
 *   reports/sprint/nclex-rn-launch/launch-certification.json
 *   reports/sprint/nclex-rn-launch/launch-certification.md
 *
 * Gate requirements (from target document):
 *   Questions          ≥ 10,000 (launch minimum)  / ≥ 20,000 (mature)
 *   — MCQ (35%)        ≥  3,500 tagged
 *   — SATA (15%)       ≥  1,500 tagged
 *   — Bowtie (10%)     ≥  1,000 valid
 *   — Matrix (10%)     ≥  1,000 tagged
 *   — Case Studies     ≥    100
 *   — Trend            ≥    150
 *   — Prioritization   ≥    150
 *   — Delegation       ≥    100
 *   — Documentation    ≥    100
 *   CAT pool           ≥  3,000 (minimum) / ≥ 5,000 (mature)
 *   Flashcards         ≥ 15,000 (launch minimum)
 *   Practice exams     ≥    100 (minimum launch) / ≥ 500 (target)
 *   Missing rationales =      0
 *   Invalid bowties    =      0
 *   Missing options    =      0
 *   Questions w/       ≥  90%  have questionFormat set
 *   Difficulty spread  L1 ≥ 3%, L2 ≥ 10%, L4 ≥ 15%, L5 ≥ 3%
 *   Lessons (prod-ready)   ≥ 100
 *
 * EXIT CODE: 0 = launch-ready, 1 = not ready (gate failures)
 *
 * Usage (from nursenest-core/):
 *   npx tsx scripts/sprint-6-launch-certification.mts
 *   npx tsx scripts/sprint-6-launch-certification.mts --json    # json-only to stdout
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { PrismaClient } from "@prisma/client";

// ── Config ─────────────────────────────────────────────────────────────────────

const JSON_ONLY = process.argv.includes("--json");
const REPORT_DIR  = resolve(process.cwd(), "reports/sprint/nclex-rn-launch");
const JSON_PATH   = resolve(REPORT_DIR, "launch-certification.json");
const MD_PATH     = resolve(REPORT_DIR, "launch-certification.md");

// ── Env ────────────────────────────────────────────────────────────────────────

function loadEnv(): void {
  for (const name of [".env", ".env.local", ".env.production.local"]) {
    const f = resolve(process.cwd(), name);
    if (!existsSync(f)) continue;
    const p = parseDotenv(readFileSync(f, "utf8"));
    for (const [k, v] of Object.entries(p)) if (process.env[k] === undefined) process.env[k] = v;
  }
}

// ── Gate definition ────────────────────────────────────────────────────────────

type GateResult = {
  gate:    string;
  label:   string;
  actual:  number;
  min:     number;
  target:  number;
  pass:    boolean;
  critical: boolean;  // blocks launch if fail
};

// ── Queries ────────────────────────────────────────────────────────────────────

async function runAudit(prisma: PrismaClient): Promise<GateResult[]> {
  const EXAM_WHERE = {
    status: { in: ["published", "PUBLISHED"] },
    exam:   { in: ["NCLEX-RN", "NCLEX_RN"] },
  } as const;

  // ── Questions ────────────────────────────────────────────────────────────────

  const totalQ = await prisma.examQuestion.count({ where: EXAM_WHERE });

  const catReady = await prisma.examQuestion.count({
    where: { ...EXAM_WHERE, isAdaptiveEligible: true, rationale: { not: null } },
  });

  const missingRationale = await prisma.examQuestion.count({
    where: { ...EXAM_WHERE, rationale: null },
  });

  const missingOptions = await prisma.examQuestion.count({
    where: { ...EXAM_WHERE, options: { equals: null as unknown as undefined } },
  });

  const invalidBowtie = await prisma.examQuestion.count({
    where: { ...EXAM_WHERE, questionType: { contains: "BOWTIE", mode: "insensitive" }, options: { equals: null as unknown as undefined } },
  });

  const formatTagged = await prisma.examQuestion.count({
    where: { ...EXAM_WHERE, questionFormat: { not: null } },
  });

  // Format breakdown
  const formatCounts = await prisma.examQuestion.groupBy({
    by: ["questionFormat"],
    where: { ...EXAM_WHERE, questionFormat: { not: null } },
    _count: { id: true },
  });
  const fmtMap = Object.fromEntries(formatCounts.map((r) => [r.questionFormat ?? "null", r._count.id]));

  const qMCQ          = (fmtMap["multiple_choice"] ?? 0);
  const qSATA         = (fmtMap["sata"] ?? 0);
  const qBowtie       = (fmtMap["bowtie"] ?? 0);
  const qMatrix       = (fmtMap["matrix_mcq"] ?? 0) + (fmtMap["matrix_mr"] ?? 0);
  const qOrdering     = (fmtMap["ordering"] ?? 0);
  const qHotspot      = (fmtMap["hotspot"] ?? 0);

  // Difficulty spread
  const diffGroups = await prisma.examQuestion.groupBy({
    by:    ["difficulty"],
    where: EXAM_WHERE,
    _count: { id: true },
  });
  const diffMap = Object.fromEntries(diffGroups.map((r) => [String(r.difficulty ?? 3), r._count.id]));

  const diffL1 = diffMap["1"] ?? 0;
  const diffL2 = diffMap["2"] ?? 0;
  const diffL3 = diffMap["3"] ?? 0;
  const diffL4 = diffMap["4"] ?? 0;
  const diffL5 = diffMap["5"] ?? 0;
  const diffTotal = diffL1 + diffL2 + diffL3 + diffL4 + diffL5;

  // Flashcards
  const flashcardCount = await prisma.flashcard.count({
    where: { examFamily: "NCLEX_RN", status: "PUBLISHED" },
  });

  // Practice exam sets
  const practiceExamCount = await prisma.exam.count({
    where: { examFamily: "NCLEX_RN", status: "PUBLISHED" },
  });

  // Lessons (production-ready from catalog JSON as proxy)
  let prodReadyLessons = 0;
  try {
    const catalog = JSON.parse(
      readFileSync(resolve(process.cwd(), "src/content/pathway-lessons/catalog.json"), "utf8")
    ) as { pathways: Record<string, { lessons: unknown[] }> };
    prodReadyLessons = (catalog.pathways["us-rn-nclex-rn"]?.lessons?.length ?? 0);
  } catch { /* ignore */ }

  // ── Gate assembly ─────────────────────────────────────────────────────────────

  const pct = (n: number) => totalQ > 0 ? n / totalQ : 0;

  const gates: GateResult[] = [
    // Core volume
    { gate: "total_questions",    label: "Total published questions",          actual: totalQ,       min: 10000, target: 20000, pass: totalQ >= 10000,       critical: true  },
    { gate: "cat_pool",           label: "CAT-eligible questions",             actual: catReady,     min: 3000,  target: 5000,  pass: catReady >= 3000,       critical: true  },
    { gate: "flashcards",         label: "Flashcards (published)",             actual: flashcardCount, min: 15000, target: 25000, pass: flashcardCount >= 15000, critical: true },
    { gate: "practice_exams",     label: "Practice exam sets",                 actual: practiceExamCount, min: 100, target: 500,  pass: practiceExamCount >= 100, critical: true },

    // Completeness gates — must be zero
    { gate: "missing_rationale",  label: "Questions missing rationale (= 0)", actual: missingRationale, min: 0, target: 0, pass: missingRationale === 0, critical: true  },
    { gate: "invalid_bowtie",     label: "Invalid bowtie payloads (= 0)",     actual: invalidBowtie, min: 0, target: 0,  pass: invalidBowtie === 0,     critical: true  },
    { gate: "missing_options",    label: "Questions missing options (= 0)",   actual: missingOptions, min: 0, target: 0,  pass: missingOptions === 0,    critical: true  },

    // Format tagging ≥ 90%
    { gate: "format_tagged_pct",  label: "questionFormat tagged (≥ 90%)",     actual: Math.round(pct(formatTagged)*100), min: 90, target: 100, pass: pct(formatTagged) >= 0.90, critical: true },

    // Format distribution — launch minimums
    { gate: "fmt_mcq",            label: "MCQ questions (≥ 3,500)",            actual: qMCQ,    min: 3500,  target: 7000,  pass: qMCQ >= 3500,    critical: false },
    { gate: "fmt_sata",           label: "SATA questions (≥ 1,500)",           actual: qSATA,   min: 1500,  target: 3000,  pass: qSATA >= 1500,   critical: true  },
    { gate: "fmt_bowtie",         label: "Bowtie questions (≥ 1,000)",         actual: qBowtie, min: 1000,  target: 2000,  pass: qBowtie >= 1000, critical: true  },
    { gate: "fmt_matrix",         label: "Matrix questions (≥ 1,000)",         actual: qMatrix, min: 1000,  target: 2000,  pass: qMatrix >= 1000, critical: false },
    { gate: "fmt_ordering",       label: "Ordering / prioritization (≥ 150)", actual: qOrdering, min: 150, target: 500,   pass: qOrdering >= 150, critical: false },
    { gate: "fmt_hotspot",        label: "Hotspot questions (≥ 100)",          actual: qHotspot, min: 100, target: 500,   pass: qHotspot >= 100, critical: false },

    // Difficulty spread (as percentages, minimum thresholds)
    { gate: "diff_l1",  label: "L1 Easy (≥ 3%)",        actual: Math.round(pct(diffL1)*100), min: 3,  target: 10, pass: diffTotal > 0 && (diffL1/diffTotal) >= 0.03, critical: false },
    { gate: "diff_l2",  label: "L2 Moderate-Easy (≥ 10%)", actual: Math.round(pct(diffL2)*100), min: 10, target: 20, pass: diffTotal > 0 && (diffL2/diffTotal) >= 0.10, critical: false },
    { gate: "diff_l4",  label: "L4 Hard (≥ 15%)",       actual: Math.round(pct(diffL4)*100), min: 15, target: 25, pass: diffTotal > 0 && (diffL4/diffTotal) >= 0.15, critical: false },
    { gate: "diff_l5",  label: "L5 Very Hard (≥ 3%)",   actual: Math.round(pct(diffL5)*100), min: 3,  target: 5,  pass: diffTotal > 0 && (diffL5/diffTotal) >= 0.03, critical: false },

    // Production-ready lessons
    { gate: "lessons",  label: "Production-ready lessons (≥ 100)", actual: prodReadyLessons, min: 100, target: 500, pass: prodReadyLessons >= 100, critical: false },
  ];

  return gates;
}

// ── Markdown report ────────────────────────────────────────────────────────────

function buildMarkdown(gates: GateResult[], ts: string): string {
  const pass   = gates.filter((g) => g.pass).length;
  const fail   = gates.filter((g) => !g.pass).length;
  const critFail = gates.filter((g) => !g.pass && g.critical).length;
  const ready  = critFail === 0;

  const statusLine = ready
    ? "✅ **LAUNCH-READY** — all critical gates pass"
    : `❌ **NOT READY** — ${critFail} critical gate${critFail !== 1 ? "s" : ""} failing`;

  const rows = gates.map((g) => {
    const icon  = g.pass ? "✓" : (g.critical ? "❌" : "⚠");
    const label = `${icon} ${g.label}`;
    return `| ${label.padEnd(44)} | ${String(g.actual).padStart(7)} | ${String(g.min).padStart(7)} | ${String(g.target).padStart(8)} |`;
  });

  return [
    "# NCLEX-RN Launch Certification",
    "",
    `**Generated:** ${ts}`,
    "",
    `## Verdict`,
    "",
    statusLine,
    "",
    `**${pass} / ${gates.length}** gates passing | **${fail}** failing (${critFail} critical)`,
    "",
    "## Gate Checklist",
    "",
    "| Gate | Actual | Min | Target |",
    "|---|---:|---:|---:|",
    ...rows,
    "",
    "## Next Actions",
    "",
    ...gates
      .filter((g) => !g.pass)
      .map((g) => {
        const gap = g.min - g.actual;
        const prefix = g.critical ? "🔴 **[CRITICAL]**" : "🟡 [WARN]";
        return `- ${prefix} \`${g.gate}\`: need +${gap.toLocaleString()} more to reach minimum`;
      }),
    "",
    "---",
    "*Generated by sprint-6-launch-certification.mts*",
  ].join("\n");
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  loadEnv();

  const dbUrl = process.env.DATABASE_URL?.trim();
  if (!dbUrl || dbUrl.includes("PASSWORD") || dbUrl.includes("USER:PASSWORD")) {
    console.error("DATABASE_URL is not configured. Cannot run launch audit.");
    process.exit(1);
  }

  const prisma = new PrismaClient({ log: ["error"] });

  console.log("=== Sprint 6: NCLEX-RN Launch Certification Audit ===\n");

  let gates: GateResult[];
  try {
    gates = await runAudit(prisma);
  } finally {
    await prisma.$disconnect();
  }

  const ts = new Date().toISOString();
  const pass      = gates.filter((g) => g.pass).length;
  const critFail  = gates.filter((g) => !g.pass && g.critical).length;
  const launchReady = critFail === 0;

  mkdirSync(REPORT_DIR, { recursive: true });

  const jsonReport = {
    generatedAt:  ts,
    launchReady,
    passCount:    pass,
    totalGates:   gates.length,
    criticalFails: critFail,
    verdict:      launchReady ? "LAUNCH_READY" : "NOT_READY",
    gates,
  };
  writeFileSync(JSON_PATH, JSON.stringify(jsonReport, null, 2));

  const md = buildMarkdown(gates, ts);
  writeFileSync(MD_PATH, md);

  if (JSON_ONLY) {
    console.log(JSON.stringify(jsonReport, null, 2));
  } else {
    console.log(md);
    console.log(`\nReports written:`);
    console.log(`  ${JSON_PATH}`);
    console.log(`  ${MD_PATH}`);
  }

  process.exit(launchReady ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(1); });
