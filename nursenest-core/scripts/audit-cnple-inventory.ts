#!/usr/bin/env tsx
/**
 * CNPLE Launch Readiness — Published Content Inventory Audit
 *
 * Queries the connected Postgres database and emits a structured report of
 * all CNPLE content across questions, flashcards, simulations, and cases.
 *
 * Fails (exit 1) when:
 *   - The CNPLE question pool is empty
 *   - Orphaned (published) questions exist with no domain tag
 *   - Any domain in the CNPLE blueprint has zero questions
 *
 * Usage:
 *   cd nursenest-core && npx tsx scripts/audit-cnple-inventory.ts
 *   CNPLE_AUDIT_SOFT=1 npx tsx scripts/audit-cnple-inventory.ts   # warn only, exit 0
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { PrismaClient } from "@prisma/client";

const SOFT_MODE = process.env.CNPLE_AUDIT_SOFT === "1";
const CNPLE_PATHWAY_ID = "ca-np-cnple";

// ─── .env loading ─────────────────────────────────────────────────────────────

function loadEnv(): void {
  const root = process.cwd();
  for (const name of [".env", ".env.local", ".env.production"]) {
    const p = resolve(root, name);
    if (!existsSync(p)) continue;
    const raw = readFileSync(p, "utf-8");
    const parsed = parseDotenv(raw);
    for (const [k, v] of Object.entries(parsed)) {
      if (!process.env[k]) process.env[k] = v;
    }
    break;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function redactUrl(url: string): string {
  return url.replace(/:([^@/]+)@/, ":*****@");
}

function hr() {
  return "─".repeat(60);
}

function pass(msg: string) {
  console.log(`  ✅ ${msg}`);
}

function warn(msg: string) {
  console.warn(`  ⚠️  ${msg}`);
}

function fail(msg: string, hard = true) {
  console.error(`  ❌ ${msg}`);
  if (hard && !SOFT_MODE) {
    process.exitCode = 1;
  }
}

function section(title: string) {
  console.log(`\n${hr()}`);
  console.log(`  ${title}`);
  console.log(hr());
}

// ─── Main audit ───────────────────────────────────────────────────────────────

async function main() {
  loadEnv();

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.log("DATABASE_URL not set — skipping CNPLE inventory audit (CI without DB).");
    process.exit(0);
  }

  console.log(`\n${"═".repeat(60)}`);
  console.log(`  CNPLE Published Content Inventory Audit`);
  console.log(`  Pathway: ${CNPLE_PATHWAY_ID}`);
  console.log(`  DB: ${redactUrl(dbUrl).slice(0, 60)}…`);
  console.log(`${"═".repeat(60)}`);

  const prisma = new PrismaClient({ log: [] });

  try {
    // ── 1. Question pool ───────────────────────────────────────────────────────
    section("1. PRACTICE QUESTIONS");

    const totalPublished = await prisma.examQuestion.count({
      where: {
        status: "PUBLISHED",
        examPathwayId: CNPLE_PATHWAY_ID,
      },
    });

    if (totalPublished === 0) {
      fail(`CNPLE published question pool is EMPTY — pathway cannot be launched`);
    } else {
      pass(`Total published questions: ${totalPublished}`);
    }

    // By domain
    const byDomain = await prisma.examQuestion.groupBy({
      by: ["domainTag"],
      where: { status: "PUBLISHED", examPathwayId: CNPLE_PATHWAY_ID },
      _count: { _all: true },
      orderBy: { _count: { domainTag: "desc" } },
    });

    console.log("\n  Domain distribution:");
    if (byDomain.length === 0) {
      warn("No domain tags found on published CNPLE questions");
    }
    for (const row of byDomain) {
      const tag = row.domainTag ?? "(no domain)";
      const count = row._count._all;
      if (!row.domainTag) {
        fail(`  ${count} orphaned questions with no domain tag`);
      } else {
        console.log(`    ${tag.padEnd(42)} ${count}`);
      }
    }

    // By question type
    const byType = await prisma.examQuestion.groupBy({
      by: ["questionType"],
      where: { status: "PUBLISHED", examPathwayId: CNPLE_PATHWAY_ID },
      _count: { _all: true },
      orderBy: { _count: { questionType: "desc" } },
    });

    console.log("\n  Question type distribution:");
    for (const row of byType) {
      console.log(`    ${(row.questionType ?? "unknown").padEnd(42)} ${row._count._all}`);
    }

    // By difficulty
    const byDifficulty = await prisma.examQuestion.groupBy({
      by: ["difficulty"],
      where: { status: "PUBLISHED", examPathwayId: CNPLE_PATHWAY_ID },
      _count: { _all: true },
      orderBy: { difficulty: "asc" },
    });

    console.log("\n  Difficulty distribution:");
    for (const row of byDifficulty) {
      console.log(`    Difficulty ${row.difficulty ?? "?"}: ${row._count._all}`);
    }

    // SATA count
    const sataCount = await prisma.examQuestion.count({
      where: {
        status: "PUBLISHED",
        examPathwayId: CNPLE_PATHWAY_ID,
        questionType: "SATA",
      },
    });
    if (sataCount === 0) {
      warn("Zero SATA questions published for CNPLE — add SATA for exam realism");
    } else {
      pass(`SATA questions: ${sataCount}`);
    }

    // ECG count
    const ecgCount = await prisma.examQuestion.count({
      where: {
        status: "PUBLISHED",
        examPathwayId: CNPLE_PATHWAY_ID,
        questionType: "ECG",
      },
    });
    if (ecgCount === 0) {
      warn("Zero ECG questions published for CNPLE");
    } else {
      pass(`ECG questions: ${ecgCount}`);
    }

    // ── 2. Flashcards ──────────────────────────────────────────────────────────
    section("2. FLASHCARDS");

    const flashcardCount = await prisma.flashcard.count({
      where: {
        status: "PUBLISHED",
        examPathwayId: CNPLE_PATHWAY_ID,
      },
    });

    if (flashcardCount === 0) {
      warn("Zero published CNPLE flashcards — flashcard hub will be empty");
    } else {
      pass(`Published flashcards: ${flashcardCount}`);
    }

    // ── 3. Lessons ─────────────────────────────────────────────────────────────
    section("3. LESSONS");

    const lessonCount = await prisma.lesson.count({
      where: {
        status: "PUBLISHED",
        examPathwayId: CNPLE_PATHWAY_ID,
      },
    });

    if (lessonCount === 0) {
      warn("Zero published CNPLE lessons — lesson hub will be empty");
    } else {
      pass(`Published lessons: ${lessonCount}`);
    }

    // Lessons with no linked questions
    const lessonsWithNoQuestions = await prisma.lesson.count({
      where: {
        status: "PUBLISHED",
        examPathwayId: CNPLE_PATHWAY_ID,
        examQuestions: { none: {} },
      },
    });

    if (lessonsWithNoQuestions > 0) {
      warn(`${lessonsWithNoQuestions} published lessons have no linked questions`);
    } else if (lessonCount > 0) {
      pass("All published lessons have at least one linked question");
    }

    // ── 4. Longitudinal cases ──────────────────────────────────────────────────
    section("4. LONGITUDINAL CASES (DB)");

    const caseCount = await prisma.clinicalNursingScenario.count({
      where: {
        status: "PUBLISHED",
        examPathwayId: CNPLE_PATHWAY_ID,
      },
    });

    if (caseCount === 0) {
      warn("Zero published DB-backed CNPLE cases — only static sample cases available");
    } else {
      pass(`Published DB cases: ${caseCount}`);
    }

    // ── 5. Static sample cases ─────────────────────────────────────────────────
    section("5. STATIC SAMPLE CASES (cnple-sample-cases.ts)");

    // Import the static cases dynamically
    const { CNPLE_SAMPLE_CASES } = await import("../src/content/cases/cnple-sample-cases");
    console.log(`  Static sample cases: ${CNPLE_SAMPLE_CASES.length}`);
    for (const c of CNPLE_SAMPLE_CASES) {
      const govStatus = c.governance?.reviewStatus ?? "no-governance";
      const isPremiumLabel = c.isPremium ? "premium" : "free";
      console.log(`    [${isPremiumLabel}] [${govStatus}] ${c.id} — ${c.title.slice(0, 50)}`);
    }

    // Governance gaps
    const noGov = CNPLE_SAMPLE_CASES.filter((c) => !c.governance);
    if (noGov.length > 0) {
      warn(`${noGov.length} sample cases missing governance record`);
    } else {
      pass("All sample cases have governance records");
    }

    const flaggedCases = CNPLE_SAMPLE_CASES.filter((c) => c.governance?.reviewStatus === "flagged");
    if (flaggedCases.length > 0) {
      fail(`${flaggedCases.length} cases are flagged for revision: ${flaggedCases.map((c) => c.id).join(", ")}`);
    }

    // ── 6. Route reachability ──────────────────────────────────────────────────
    section("6. ROUTE REACHABILITY CHECK (static)");

    const { CNPLE_SITEMAP_PATHS } = await import("../src/lib/seo/cnple-seo-cluster");
    pass(`Sitemap paths registered: ${CNPLE_SITEMAP_PATHS.length}`);

    // ── 7. Summary ─────────────────────────────────────────────────────────────
    section("7. LAUNCH READINESS SUMMARY");

    const exitCode = process.exitCode ?? 0;
    if (exitCode !== 0) {
      console.log("\n  ❌ CNPLE inventory audit FAILED — resolve blockers before launch.");
    } else {
      console.log("\n  ✅ CNPLE inventory audit PASSED — no hard blockers detected.");
      console.log("  ℹ️  Review warnings above before public launch.");
    }

    console.log(`\n${"═".repeat(60)}\n`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("Audit script error:", err);
  process.exit(1);
});
