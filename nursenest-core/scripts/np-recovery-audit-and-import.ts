#!/usr/bin/env npx tsx
import "../src/lib/db/env-bootstrap";

import fs from "node:fs";
import path from "node:path";
import { prisma } from "@/lib/db";
import { buildQuestionBankCoverageAnalysis } from "@/lib/questions/build-question-bank-coverage-analysis";
import { extractQuestionLikeRecords } from "@/lib/replit-import/replit-json-extract";
import { normalizeRawQuestionRecord, toPrismaCreateInput } from "@/lib/replit-import/replit-question-normalize";

type SourcePlan = {
  id: string;
  path: string;
  mode: "importable_now" | "audit_only";
  notes: string;
};

const SOURCES: SourcePlan[] = [
  {
    id: "replit_exam_questions",
    path: "data/replit-exports/exam_questions.json",
    mode: "importable_now",
    notes: "Primary NP recovery source (mixed bank, NP rows filtered at normalize-time).",
  },
  {
    id: "replit_ai_cache",
    path: "data/replit-exports/ai_cache.json",
    mode: "audit_only",
    notes: "Secondary source; requires separate parse strategy and manual QA pass before import.",
  },
  {
    id: "career_questions_dir",
    path: "../data/career-questions",
    mode: "audit_only",
    notes: "Allied-focused source; included in plan for gap tracking only.",
  },
];

function arg(name: string): string | undefined {
  const pref = `--${name}=`;
  const hit = process.argv.find((x) => x.startsWith(pref));
  return hit ? hit.slice(pref.length) : undefined;
}

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

async function countDbDuplicates(stemHashes: string[]): Promise<number> {
  if (stemHashes.length === 0) return 0;
  const chunk = 400;
  let dup = 0;
  for (let i = 0; i < stemHashes.length; i += chunk) {
    const rows = await prisma.examQuestion.findMany({
      where: { stemHash: { in: stemHashes.slice(i, i + chunk) } },
      select: { id: true },
    });
    dup += rows.length;
  }
  return dup;
}

async function main() {
  const apply = hasFlag("apply");
  const statusDb = arg("status") === "published" ? "published" : "draft";
  const sourceRoot = arg("source-root") ?? process.cwd();

  const baseline = await buildQuestionBankCoverageAnalysis();
  const baselineNp = baseline.aggregates.find((a) => a.id === "np");

  const sourceAudit = SOURCES.map((s) => {
    const abs = path.resolve(sourceRoot, s.path);
    const exists = fs.existsSync(abs);
    const stat = exists ? fs.statSync(abs) : null;
    return {
      ...s,
      absolutePath: abs,
      exists,
      sizeBytes: stat?.size ?? 0,
    };
  });

  const activeSource = sourceAudit.find((s) => s.id === "replit_exam_questions");
  if (!activeSource?.exists) {
    console.log(
      JSON.stringify(
        {
          ok: false,
          error: "Primary NP source missing",
          sourceAudit,
        },
        null,
        2,
      ),
    );
    process.exit(2);
  }

  const raw = JSON.parse(fs.readFileSync(activeSource.absolutePath, "utf8")) as unknown;
  const records = extractQuestionLikeRecords(raw, activeSource.absolutePath);

  const normalized: ReturnType<typeof normalizeRawQuestionRecord>[] = records.map((r) =>
    normalizeRawQuestionRecord(r, {
      defaultCountry: "CA",
      defaultTrack: "NP",
      statusPublished: statusDb === "published",
    }),
  );

  const validNp = normalized
    .filter((n): n is { ok: true; row: NonNullable<(typeof normalized)[number] extends infer U ? U : never>["row"] } => n.ok)
    .map((n) => n.row)
    .filter((r) => r.tier === "NP");

  const uniqueByHash = new Map<string, (typeof validNp)[number]>();
  for (const r of validNp) {
    if (!uniqueByHash.has(r.stemHash)) uniqueByHash.set(r.stemHash, r);
  }
  const uniqueRows = [...uniqueByHash.values()];
  const hashes = uniqueRows.map((r) => r.stemHash);
  const dbDupCount = await countDbDuplicates(hashes);

  let inserted = 0;
  if (apply) {
    const existingHashes = new Set<string>();
    const chunk = 400;
    for (let i = 0; i < hashes.length; i += chunk) {
      const rows = await prisma.examQuestion.findMany({
        where: { stemHash: { in: hashes.slice(i, i + chunk) } },
        select: { stemHash: true },
      });
      for (const r of rows) if (r.stemHash) existingHashes.add(r.stemHash);
    }
    for (const r of uniqueRows) {
      if (existingHashes.has(r.stemHash)) continue;
      await prisma.examQuestion.create({ data: toPrismaCreateInput(r, statusDb) });
      existingHashes.add(r.stemHash);
      inserted += 1;
    }
  }

  const after = await buildQuestionBankCoverageAnalysis();
  const afterNp = after.aggregates.find((a) => a.id === "np");

  const report = {
    ok: true,
    mode: apply ? "apply" : "dry_run",
    statusDb,
    sourceAudit,
    npRecovery: {
      rawRecordsSeen: records.length,
      normalizedNpRows: validNp.length,
      uniqueNpRows: uniqueRows.length,
      skippedDuplicatesInDb: dbDupCount,
      inserted,
    },
    coverage: {
      baselineNpPublished: baselineNp?.publishedTotal ?? 0,
      afterNpPublished: afterNp?.publishedTotal ?? 0,
      deltaNpPublished: (afterNp?.publishedTotal ?? 0) - (baselineNp?.publishedTotal ?? 0),
      baselineNpWeakCanonicalTopics: baselineNp?.weakCanonicalTopics ?? [],
      afterNpWeakCanonicalTopics: afterNp?.weakCanonicalTopics ?? [],
    },
  };

  console.log(JSON.stringify(report, null, 2));
}

void main().catch((e) => {
  console.error(e);
  process.exit(1);
});

