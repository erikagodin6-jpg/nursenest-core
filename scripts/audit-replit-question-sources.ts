#!/usr/bin/env npx tsx
/**
 * Inventory of question-bearing Replit exports + materialized batch metrics.
 *
 *   npx tsx scripts/audit-replit-question-sources.ts
 *
 * Writes: data/materialized/rn-pn-replit-batch-2026/audit-report.json (when batch dir exists)
 */
import fs from "node:fs";
import path from "node:path";
import { stemHash } from "@/lib/content/stem-hash";

const ROOT = process.cwd();
const REPLIT_EXAM = path.join(ROOT, "data/replit-exports/exam_questions.json");
const BATCH_DIR = path.join(ROOT, "data/materialized/rn-pn-replit-batch-2026");
const OUT_REPORT = path.join(BATCH_DIR, "audit-report.json");

function loadJsonArray(p: string): unknown[] {
  if (!fs.existsSync(p)) return [];
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  return Array.isArray(j) ? j : [];
}

function optArray(o: unknown): string[] | null {
  if (!o) return null;
  if (Array.isArray(o)) {
    const s = o.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
    return s.length >= 2 ? s : null;
  }
  if (typeof o === "object") {
    const vals = Object.values(o as Record<string, unknown>).filter((x): x is string => typeof x === "string");
    return vals.length >= 2 ? vals : null;
  }
  return null;
}

function correctTextsValid(row: Record<string, unknown>, options: string[]): boolean {
  const ca = row.correct_answer ?? row.correctAnswer;
  if (typeof ca === "number" && Number.isInteger(ca) && ca >= 0 && ca < options.length) return true;
  if (Array.isArray(ca) && ca.length && typeof (ca as number[])[0] === "number") {
    for (const x of ca as number[]) {
      if (typeof x !== "number" || x < 0 || x >= options.length) return false;
    }
    return true;
  }
  return false;
}

function auditExamQuestions(rows: Record<string, unknown>[]) {
  const tierBreak = new Map<string, number>();
  const examBreak = new Map<string, number>();
  const statusBreak = new Map<string, number>();
  let published = 0;
  const stemHashes = new Map<string, number>();
  let duplicateStemRows = 0;

  const nursingTier = (t: string) => {
    const x = t.toLowerCase();
    return x === "rn" || x === "rpn" || x === "lvn" || x === "lpn";
  };

  for (const r of rows) {
    const st = String(r.status ?? "");
    statusBreak.set(st, (statusBreak.get(st) ?? 0) + 1);
    if (st === "published") published++;

    const tier = String(r.tier ?? "");
    tierBreak.set(tier || "(empty)", (tierBreak.get(tier || "(empty)") ?? 0) + 1);

    const ex = String(r.exam ?? "(empty)");
    examBreak.set(ex, (examBreak.get(ex) ?? 0) + 1);

    if (typeof r.stem === "string") {
      const h = stemHash(r.stem);
      const c = (stemHashes.get(h) ?? 0) + 1;
      stemHashes.set(h, c);
    }
  }

  for (const [, c] of stemHashes) {
    if (c > 1) duplicateStemRows += c - 1;
  }

  const uniqueStems = stemHashes.size;
  let nursingPublishedValidAfterStemDedupe = 0;
  const seen = new Set<string>();
  const sorted = [...rows].sort((a, b) => String(a.id).localeCompare(String(b.id)));
  for (const r of sorted) {
    if (r.status !== "published") continue;
    const opts = optArray(r.options);
    if (!opts || !correctTextsValid(r, opts)) continue;
    if (!nursingTier(String(r.tier))) continue;
    const h = stemHash(String(r.stem));
    if (seen.has(h)) continue;
    seen.add(h);
    nursingPublishedValidAfterStemDedupe++;
  }

  return {
    rawRows: rows.length,
    published,
    validMcqPublished: (() => {
      let n = 0;
      for (const r of rows) {
        if (r.status !== "published") continue;
        const o = optArray(r.options);
        if (o && correctTextsValid(r, o)) n++;
      }
      return n;
    })(),
    nursingTierValidMcqPublished: (() => {
      let n = 0;
      for (const r of rows) {
        if (r.status !== "published") continue;
        const o = optArray(r.options);
        if (!o || !correctTextsValid(r, o)) continue;
        if (!nursingTier(String(r.tier))) continue;
        n++;
      }
      return n;
    })(),
    nursingTierAfterGlobalStemDedupe: nursingPublishedValidAfterStemDedupe,
    duplicateStemRowsBeyondFirst: duplicateStemRows,
    uniqueStemHashesAllRows: uniqueStems,
    tierBreakdown: Object.fromEntries([...tierBreak.entries()].sort((a, b) => b[1] - a[1])),
    examBreakdownTop: Object.fromEntries([...examBreak.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20)),
    statusBreakdown: Object.fromEntries([...statusBreak.entries()].sort((a, b) => b[1] - a[1])),
  };
}

function main() {
  const examRows = loadJsonArray(REPLIT_EXAM) as Record<string, unknown>[];
  const examAudit = auditExamQuestions(examRows);

  const allied = loadJsonArray(path.join(ROOT, "data/replit-exports/allied_questions.json"));
  const imaging = loadJsonArray(path.join(ROOT, "data/replit-exports/imaging_questions.json"));
  const generated = loadJsonArray(path.join(ROOT, "data/replit-exports/generated_questions.json"));

  let materializedQuestions = 0;
  let generationStats: unknown = null;
  if (fs.existsSync(path.join(BATCH_DIR, "questions.json"))) {
    const mq = loadJsonArray(path.join(BATCH_DIR, "questions.json"));
    materializedQuestions = mq.length;
  }
  if (fs.existsSync(path.join(BATCH_DIR, "generation-stats.json"))) {
    generationStats = JSON.parse(fs.readFileSync(path.join(BATCH_DIR, "generation-stats.json"), "utf8"));
  }

  const report = {
    generatedAt: new Date().toISOString(),
    bottleneckNote:
      "Legacy `generate-materialized-rn-pn-batch.ts` caps at 10 topics × (7 RN + 5 PN) = 120. Sprint2 previously capped per-topic (15) and extra fill at 350. Use `generate-rn-pn-sprint2-batch.ts` (full-bank pass) for nursing-tier recovery.",
    sources: {
      "data/replit-exports/exam_questions.json": {
        ...examAudit,
        description: "Primary NCLEX/RN/PN/NP/imaging/RRT mixed bank",
      },
      "data/replit-exports/allied_questions.json": { rawRows: allied.length },
      "data/replit-exports/imaging_questions.json": { rawRows: imaging.length },
      "data/replit-exports/generated_questions.json": { rawRows: generated.length },
    },
    materializedBatch: {
      dir: "data/materialized/rn-pn-replit-batch-2026",
      questionsJsonCount: materializedQuestions,
      generationStats,
    },
  };

  console.log(JSON.stringify(report, null, 2));

  if (fs.existsSync(BATCH_DIR)) {
    fs.writeFileSync(OUT_REPORT, JSON.stringify(report, null, 2) + "\n", "utf8");
  }
}

main();
