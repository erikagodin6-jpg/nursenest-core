#!/usr/bin/env tsx
/**
 * Permanent guard: fail when the connected Postgres has no usable published `exam_questions`
 * for core pathways (same gates as flashcard audit + pathway exam/tier scope).
 *
 * - Loads `.env` / `.env.local` from `nursenest-core/` (same cwd expectation as other Prisma scripts).
 * - Prints redacted DATABASE_URL facts (no password) + fingerprint for drift checks.
 * - Skips with exit 0 when DATABASE_URL is unset (CI without DB).
 * - Exit 1 when URL is set but counts are zero / pathway pools empty.
 *
 * Usage:
 *   cd nursenest-core && npx tsx scripts/audit-exam-question-bank.ts
 *   NN_EXAM_BANK_AUDIT_SOFT=1 npx tsx scripts/audit-exam-question-bank.ts   # warn only, exit 0
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import type { CountryCode } from "@prisma/client";
import { buildGlobalExamContext } from "../src/lib/exam-context/exam-registry";
import { examQuestionPoolWhereForContext } from "../src/lib/exam-context/query-scope";
import { databaseUrlDriftAuditPublic } from "../src/lib/db/database-url-drift-audit";
import {
  EXAM_QUESTION_CAT_PIPELINE_ROW_SQL,
  EXAM_QUESTION_CORRECT_ANSWER_PRESENT_SQL,
  EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL,
  EXAM_QUESTION_STATUS_PUBLISHED_SQL,
  EXAM_QUESTION_TOPIC_OR_BODY_SQL,
} from "../src/lib/questions/exam-question-bank-sql";

function loadDotenvFromPackageRoot(): void {
  const root = process.cwd();
  for (const name of [".env", ".env.local", ".env.production"]) {
    const p = resolve(root, name);
    if (!existsSync(p)) continue;
    const parsed = parseDotenv(readFileSync(p, "utf8"));
    for (const [k, v] of Object.entries(parsed)) {
      if (process.env[k] === undefined) process.env[k] = v;
    }
  }
}

const CORE_PATHWAYS = [
  { pathwayId: "ca-rn-nclex-rn", label: "CA RN NCLEX-RN" },
  { pathwayId: "us-rn-nclex-rn", label: "US RN NCLEX-RN" },
  { pathwayId: "ca-rpn-rex-pn", label: "CA RPN REx-PN" },
  { pathwayId: "us-lpn-nclex-pn", label: "US LPN NCLEX-PN" },
  { pathwayId: "us-np-fnp", label: "US NP FNP" },
  { pathwayId: "ca-np-cnple", label: "CA NP CNPLE" },
] as const;

function regionSql(country: CountryCode): Prisma.Sql {
  return country === "CA"
    ? Prisma.sql`(region_scope = 'BOTH' OR region_scope = 'CA_ONLY')`
    : Prisma.sql`(region_scope = 'BOTH' OR region_scope = 'US_ONLY')`;
}

async function hasStudyLinkColumn(prisma: PrismaClient): Promise<boolean> {
  const rows = await prisma.$queryRaw<{ exists: boolean }[]>`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'exam_questions'
        AND column_name = 'study_link_pathway_id'
    ) AS exists
  `;
  return Boolean(rows[0]?.exists);
}

async function main(): Promise<void> {
  loadDotenvFromPackageRoot();
  const soft = process.env.NN_EXAM_BANK_AUDIT_SOFT === "1";

  const rawUrl = process.env.DATABASE_URL?.trim() ?? "";
  console.log("\n╔══════════════════════════════════════════════════════════════════════╗");
  console.log("║  Exam question bank audit (production guard)                        ║");
  console.log("╚══════════════════════════════════════════════════════════════════════╝\n");

  if (!rawUrl) {
    console.log("DATABASE_URL is unset — skipping bank audit (no database target).");
    console.log("Set DATABASE_URL to the same value the Next.js app uses, then re-run.\n");
    process.exit(0);
  }

  const audit = databaseUrlDriftAuditPublic(rawUrl);
  if (!audit) {
    console.error("DATABASE_URL is set but could not be parsed.");
    process.exit(1);
  }
  console.log("Connected database (redacted):");
  console.log(`  host         : ${audit.host}`);
  console.log(`  port         : ${audit.port}`);
  console.log(`  database     : ${audit.database}`);
  console.log(`  user         : ${audit.username}`);
  console.log(`  ssl require  : ${audit.sslmodeRequire}`);
  console.log(`  mode guess   : ${audit.connectionMode}`);
  console.log(`  url fp(10)   : ${audit.fingerprintPrefix10}`);
  console.log(
    "\nConfirm this matches the app / production target (compare host + database + fingerprint with platform env).",
  );

  const prisma = new PrismaClient();
  let exitCode = 0;
  const failures: string[] = [];

  try {
    const [totalRow] = await prisma.$queryRaw<[{ n: bigint }]>`
      SELECT COUNT(*)::bigint AS n FROM exam_questions
    `;
    const [pubNorm] = await prisma.$queryRaw<[{ n: bigint }]>`
      SELECT COUNT(*)::bigint AS n FROM exam_questions WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
    `;
    const [draftRow] = await prisma.$queryRaw<[{ n: bigint }]>`
      SELECT COUNT(*)::bigint AS n FROM exam_questions WHERE lower(trim(coalesce(status, ''))) = 'draft'
    `;
    const [quarRow] = await prisma.$queryRaw<[{ n: bigint }]>`
      SELECT COUNT(*)::bigint AS n FROM exam_questions WHERE lower(trim(coalesce(status, ''))) = 'quarantined'
    `;
    const [unpubRow] = await prisma.$queryRaw<[{ n: bigint }]>`
      SELECT COUNT(*)::bigint AS n FROM exam_questions
      WHERE NOT (${EXAM_QUESTION_STATUS_PUBLISHED_SQL})
    `;

    const total = Number(totalRow.n);
    const publishedNorm = Number(pubNorm.n);
    const drafts = Number(draftRow.n);
    const quarantined = Number(quarRow.n);
    const unpublished = Number(unpubRow.n);

    console.log("\n=== exam_questions counts ===");
    console.log(`  total rows              : ${total.toLocaleString()}`);
    console.log(`  published (norm status) : ${publishedNorm.toLocaleString()}`);
    console.log(`  unpublished (non-pub.)  : ${unpublished.toLocaleString()}`);
    console.log(`  draft                   : ${drafts.toLocaleString()}`);
    console.log(`  quarantined             : ${quarantined.toLocaleString()}`);

    const statusDist = await prisma.$queryRaw<{ st: string; c: bigint }[]>`
      SELECT lower(trim(coalesce(status, ''))) AS st, COUNT(*)::bigint AS c
      FROM exam_questions
      GROUP BY 1
      ORDER BY c DESC
      LIMIT 15
    `;
    console.log("\n=== Rows by status (top 15) ===");
    for (const r of statusDist) {
      console.log(`  ${String(r.st || "(empty)").padEnd(20)} ${Number(r.c).toLocaleString()}`);
    }

    const seedPath = resolve(process.cwd(), "prisma/seed.ts");
    const minimalBankPath = resolve(process.cwd(), "src/lib/exams/seed-minimal-question-bank.ts");
    const hasRepoSeed = existsSync(seedPath) || existsSync(minimalBankPath);

    if (total === 0 && hasRepoSeed) {
      failures.push(
        "exam_questions is empty but repo seed sources exist — run: cd nursenest-core && npx prisma db seed && npm run content:ensure:exam-bank",
      );
      exitCode = 1;
    }

    if (total > 0 && publishedNorm === 0) {
      failures.push(
        "No normalized published rows — run npm run content:ensure:exam-bank (publish + pathway minimums) or npx tsx scripts/publish-valid-draft-exam-questions.ts; check exam/status casing.",
      );
      exitCode = 1;
    }

    const examTier = await prisma.$queryRaw<{ exam: string; tier: string; c: bigint }[]>`
      SELECT exam, tier, COUNT(*)::bigint AS c
      FROM exam_questions
      WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
      GROUP BY exam, tier
      ORDER BY c DESC
      LIMIT 30
    `;
    console.log("\n=== Published by exam / tier (top 30) ===");
    for (const r of examTier) {
      console.log(`  ${String(r.exam).padEnd(22)} ${String(r.tier).padEnd(12)} ${Number(r.c).toLocaleString()}`);
    }

    if (await hasStudyLinkColumn(prisma)) {
      const byLink = await prisma.$queryRaw<{ pid: string | null; c: bigint }[]>`
        SELECT study_link_pathway_id AS pid, COUNT(*)::bigint AS c
        FROM exam_questions
        WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
        GROUP BY study_link_pathway_id
        ORDER BY c DESC NULLS LAST
        LIMIT 20
      `;
      console.log("\n=== Published by study_link_pathway_id (top 20) ===");
      for (const r of byLink) {
        console.log(`  ${(r.pid ?? "(null)").padEnd(28)} ${Number(r.c).toLocaleString()}`);
      }
    } else {
      console.log("\n(study_link_pathway_id column absent — skip pathwayId breakdown.)");
    }

    console.log(
      "\n=== Core pathway pools — practice / flashcard (published + region + format + stem≥10 + answer JSON + topic/body + exam/tier) ===",
    );
    for (const { pathwayId, label } of CORE_PATHWAYS) {
      const ctx = buildGlobalExamContext(pathwayId, "en");
      if (!ctx) {
        failures.push(`Unknown pathwayId ${pathwayId}`);
        exitCode = 1;
        continue;
      }
      const { examIn, tierMatches } = examQuestionPoolWhereForContext(ctx);
      const examLower = examIn.map((k) => k.toLowerCase());
      const tierLower = tierMatches.map((t) => t.toLowerCase());
      const reg = regionSql(ctx.country);

      const [row] = await prisma.$queryRaw<[{ n: bigint }]>`
        SELECT COUNT(*)::bigint AS n
        FROM exam_questions
        WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
          AND ${reg}
          AND ${EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL}
          AND length(trim(coalesce(stem, ''))) >= 10
          AND ${EXAM_QUESTION_CORRECT_ANSWER_PRESENT_SQL}
          AND ${EXAM_QUESTION_TOPIC_OR_BODY_SQL}
          AND lower(coalesce(exam, '')) IN (${Prisma.join(examLower)})
          AND lower(coalesce(tier, '')) IN (${Prisma.join(tierLower)})
      `;
      const n = Number(row.n);
      const ok = n > 0;
      console.log(`  ${pathwayId.padEnd(22)} ${label.padEnd(22)} ${n.toLocaleString().padStart(8)} ${ok ? "OK" : "EMPTY"}`);
      if (!ok) {
        failures.push(`Pathway ${pathwayId} practice/flashcard published pool is 0`);
        exitCode = 1;
      }

      const [catRow] = await prisma.$queryRaw<[{ n: bigint }]>`
        SELECT COUNT(*)::bigint AS n
        FROM exam_questions
        WHERE ${EXAM_QUESTION_CAT_PIPELINE_ROW_SQL}
          AND ${reg}
          AND lower(coalesce(exam, '')) IN (${Prisma.join(examLower)})
          AND lower(coalesce(tier, '')) IN (${Prisma.join(tierLower)})
      `;
      const catN = Number(catRow.n);
      const catOk = catN > 0;
      console.log(
        `      └ CAT-complete pool   ${catN.toLocaleString().padStart(8)} ${catOk ? "OK" : "EMPTY"}  (stem + ≥2 options + answer + rationale + non-ECG)`,
      );
      if (!catOk) {
        failures.push(`Pathway ${pathwayId} CAT-complete published pool is 0 (needs stem, ≥2 options, answer, rationale, non-ECG)`);
        exitCode = 1;
      }
    }

    const [usableAll] = await prisma.$queryRaw<[{ n: bigint }]>`
      SELECT COUNT(*)::bigint AS n
      FROM exam_questions
      WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
        AND ${EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL}
        AND length(trim(coalesce(stem, ''))) >= 10
        AND ${EXAM_QUESTION_CORRECT_ANSWER_PRESENT_SQL}
        AND ${EXAM_QUESTION_TOPIC_OR_BODY_SQL}
    `;
    console.log(
      `\nGlobal practice/flashcard-style published (all regions/exams, topic/body required): ${Number(usableAll.n).toLocaleString()}`,
    );

    console.log("\n=== Canonical import / seed commands (when DB is empty) ===");
    console.log("  cd nursenest-core && npx prisma db seed");
    console.log("  cd nursenest-core && npx tsx scripts/publish-valid-draft-exam-questions.ts");
    console.log("  npm --prefix nursenest-core run import:replit-data:apply   # bundled Replit exports → Prisma");
    console.log("  npm --prefix nursenest-core run nursing:preview:db         # nursing JSON import dry-run vs DB");
    console.log("  See prisma/seed.ts (minimal sample rows) and package.json import:* scripts.");

    if (failures.length > 0) {
      console.log("\n=== Failures ===");
      for (const f of failures) console.log(`  - ${f}`);
    }

    if (exitCode !== 0 && soft) {
      console.log("\nNN_EXAM_BANK_AUDIT_SOFT=1 — treating failures as warnings (exit 0).");
      process.exit(0);
    }
    process.exit(exitCode);
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
