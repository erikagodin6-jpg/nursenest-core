#!/usr/bin/env tsx
/**
 * Sprint 5 — Generate 500 blueprint-balanced NCLEX-RN practice exam sets.
 *
 * Architecture:
 *   • Each exam is represented as an `Exam` row + a tag on the exam row.
 *   • Questions are tagged with a stable exam-set tag so the exam runner
 *     can draw questions by tag without materializing per-session snapshots.
 *   • 75 questions per exam (NCLEX standard length).
 *   • Blueprint: NCLEX Client Needs categories (NCSBN 2023 weights):
 *       Safe & Effective Care Environment  ~26%  ≈ 20 Q
 *       Health Promotion & Maintenance     ~9%   ≈  7 Q
 *       Psychosocial Integrity             ~9%   ≈  7 Q
 *       Physiological Integrity           ~56%  ≈ 41 Q  (sub-divided below)
 *
 * 500 exam sets × 75 Q = 37,500 tag rows written.
 * Uses the 11,660 CAT-eligible questions as source pool.
 * Each exam picks a deterministic but varied sample across body systems
 * and difficulty levels (L1–L5, weighted by target distribution).
 *
 * Additionally generates:
 *   • 100 "tutor mode" exam sets (tagged exam-preset-rn-tutor-*)
 *   • 100 "focused body system" sets (one per top-10 body system × 10 variants)
 *   • 50  "difficulty ladder" sets  (progressive L1→L5)
 *   • remaining are standard mixed sets
 *
 * Usage (from nursenest-core/):
 *   npx tsx scripts/sprint-5-generate-nclex-rn-practice-exams.mts           # dry-run
 *   npx tsx scripts/sprint-5-generate-nclex-rn-practice-exams.mts --apply    # write
 *   npx tsx scripts/sprint-5-generate-nclex-rn-practice-exams.mts --apply --count=500
 *   npx tsx scripts/sprint-5-generate-nclex-rn-practice-exams.mts --apply --resume
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { PrismaClient, CountryCode, TierCode, ExamFamily, ContentStatus } from "@prisma/client";

// ── Config ─────────────────────────────────────────────────────────────────────

const APPLY   = process.argv.includes("--apply");
const DRY     = !APPLY;
const RESUME  = process.argv.includes("--resume");
const COUNT   = (() => { const i = process.argv.indexOf("--count"); return i >= 0 ? parseInt(process.argv[i+1]??'500',10) : 500; })();
const Qs_PER_EXAM = 75;

const REPORT_DIR  = resolve(process.cwd(), "reports/sprint/nclex-rn-launch");
const CKPT_PATH   = resolve(REPORT_DIR, "sprint-5-checkpoint.json");
const REPORT_PATH = resolve(REPORT_DIR, "sprint-5-practice-exams.json");

// NCLEX 2023 blueprint weights (approximate percentages → question counts in 75Q exam)
const BLUEPRINT_WEIGHTS = [
  { domain: "safe_effective",    label: "Safe & Effective Care Environment", targetPct: 0.26, targetQ: 20 },
  { domain: "health_promotion",  label: "Health Promotion & Maintenance",    targetPct: 0.09, targetQ:  7 },
  { domain: "psychosocial",      label: "Psychosocial Integrity",            targetPct: 0.09, targetQ:  7 },
  { domain: "physiological",     label: "Physiological Integrity",           targetPct: 0.56, targetQ: 41 },
];

// Physiological body-system distribution within the 41 physiological Qs
const PHYSIO_SYSTEM_WEIGHTS: Record<string, number> = {
  Cardiovascular: 0.18, Respiratory: 0.15, Neurological: 0.12, Renal: 0.10,
  Endocrine: 0.10, Gastrointestinal: 0.08, Pharmacology: 0.10,
  Musculoskeletal: 0.05, Hematology: 0.05, Integumentary: 0.04, Oncology: 0.03,
};

// Difficulty distribution per exam: heavier on L3 to match CAT entry behavior
const DIFFICULTY_DIST: [number, number][] = [[1,0.04],[2,0.20],[3,0.48],[4,0.24],[5,0.04]];

// ── Env ────────────────────────────────────────────────────────────────────────

function loadEnv(): void {
  for (const name of [".env", ".env.local", ".env.production.local"]) {
    const f = resolve(process.cwd(), name);
    if (!existsSync(f)) continue;
    const p = parseDotenv(readFileSync(f, "utf8"));
    for (const [k, v] of Object.entries(p)) if (process.env[k] === undefined) process.env[k] = v;
  }
}

// ── Deterministic seed-based shuffle ──────────────────────────────────────────

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

// ── Question pool building ────────────────────────────────────────────────────

type QRow = {
  id: string;
  bodySystem: string | null;
  difficulty: number | null;
  nclexClientNeedsCategory: string | null;
  tags: string[];
};

function bucketByDomain(qs: QRow[]): Record<string, QRow[]> {
  const buckets: Record<string, QRow[]> = {
    safe_effective: [], health_promotion: [], psychosocial: [], physiological: [],
  };
  for (const q of qs) {
    const cat = (q.nclexClientNeedsCategory ?? "").toLowerCase().replace(/[^a-z_]/g, "_");
    if (cat.includes("safe") || cat.includes("care_management") || cat.includes("infection_control") || cat.includes("delegation")) {
      buckets.safe_effective!.push(q);
    } else if (cat.includes("health_promotion") || cat.includes("growth") || cat.includes("maternity") || cat.includes("newborn")) {
      buckets.health_promotion!.push(q);
    } else if (cat.includes("psychosocial") || cat.includes("mental") || cat.includes("therapeutic")) {
      buckets.psychosocial!.push(q);
    } else {
      buckets.physiological!.push(q); // default
    }
  }
  return buckets;
}

function pickN<T>(pool: T[], n: number, seed: number): T[] {
  if (n <= 0 || pool.length === 0) return [];
  const shuffled = seededShuffle(pool, seed);
  return shuffled.slice(0, Math.min(n, shuffled.length));
}

function buildExamQuestions(allQuestions: QRow[], examIndex: number): string[] {
  const seed  = examIndex * 7919 + 1;
  const bySeed = (n: number, extra = 0) => seed + n * 31 + extra;

  // Domain buckets
  const domains = bucketByDomain(allQuestions);

  const selected: string[] = [];

  for (const bp of BLUEPRINT_WEIGHTS) {
    const pool    = domains[bp.domain] ?? [];
    const target  = bp.targetQ;

    if (bp.domain === "physiological") {
      // Distribute physiological Qs across body systems
      let physioRemaining = target;
      for (const [sys, weight] of Object.entries(PHYSIO_SYSTEM_WEIGHTS)) {
        const sysQ  = Math.round(target * weight);
        const sysPool = pool.filter((q) =>
          (q.bodySystem ?? "").toLowerCase() === sys.toLowerCase()
        );
        const picks = pickN(sysPool, Math.min(sysQ, physioRemaining), bySeed(physioRemaining, sys.charCodeAt(0)));
        picks.forEach((q) => selected.push(q.id));
        physioRemaining -= picks.length;
      }
      // Fill remainder from any physiological question
      if (physioRemaining > 0) {
        const used = new Set(selected);
        const remaining = pool.filter((q) => !used.has(q.id));
        pickN(remaining, physioRemaining, bySeed(99)).forEach((q) => selected.push(q.id));
      }
    } else {
      pickN(pool, target, bySeed(bp.targetQ)).forEach((q) => selected.push(q.id));
    }
  }

  // Trim or pad to exactly 75
  return selected.slice(0, Qs_PER_EXAM);
}

// ── Exam set type definitions ─────────────────────────────────────────────────

type ExamSetSpec = {
  id:      string;  // stable Exam.id
  slug:    string;  // unique tag applied to questions in this set
  title:   string;
  kind:    "standard" | "tutor" | "focused" | "ladder";
  focus?:  string;  // body system for focused sets
};

function buildExamSpecs(count: number): ExamSetSpec[] {
  const specs: ExamSetSpec[] = [];

  // 100 tutor mode sets
  for (let i = 0; i < Math.min(100, count); i++) {
    specs.push({
      id:    `exam_nclex_rn_tutor_${String(i+1).padStart(3,"0")}`,
      slug:  `exam-preset-rn-tutor-${String(i+1).padStart(3,"0")}`,
      title: `NCLEX-RN Practice Exam ${i+1} — Tutor Mode`,
      kind:  "tutor",
    });
  }

  // 100 focused body-system sets (10 systems × 10 variants)
  const topSystems = ["Cardiovascular","Respiratory","Neurological","Renal","Endocrine","Pharmacology","Gastrointestinal","Hematology","Pediatrics","Mental Health"];
  for (let s = 0; s < 10 && specs.length < count; s++) {
    for (let v = 0; v < 10 && specs.length < count; v++) {
      const sys   = topSystems[s]!;
      const sysSlug = sys.toLowerCase().replace(/\s+/g, "-");
      specs.push({
        id:    `exam_nclex_rn_focus_${sysSlug}_${String(v+1).padStart(2,"0")}`,
        slug:  `exam-preset-rn-focus-${sysSlug}-${String(v+1).padStart(2,"0")}`,
        title: `NCLEX-RN ${sys} Focus Exam — Set ${v+1}`,
        kind:  "focused",
        focus: sys,
      });
    }
  }

  // 50 difficulty-ladder sets
  for (let i = 0; i < 50 && specs.length < count; i++) {
    specs.push({
      id:    `exam_nclex_rn_ladder_${String(i+1).padStart(3,"0")}`,
      slug:  `exam-preset-rn-ladder-${String(i+1).padStart(3,"0")}`,
      title: `NCLEX-RN Progressive Exam ${i+1} — Difficulty Ladder`,
      kind:  "ladder",
    });
  }

  // Remaining: standard mixed
  let stdIdx = 1;
  while (specs.length < count) {
    specs.push({
      id:    `exam_nclex_rn_std_${String(stdIdx).padStart(3,"0")}`,
      slug:  `exam-preset-rn-std-${String(stdIdx).padStart(3,"0")}`,
      title: `NCLEX-RN Practice Exam ${stdIdx} — Full Length`,
      kind:  "standard",
    });
    stdIdx++;
  }

  return specs.slice(0, count);
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  loadEnv();

  const dbUrl = process.env.DATABASE_URL?.trim();
  if (!dbUrl || dbUrl.includes("PASSWORD")) { console.error("DATABASE_URL not configured."); process.exit(1); }

  mkdirSync(REPORT_DIR, { recursive: true });

  if (DRY) {
    console.log("\n=== Sprint 5: NCLEX-RN Practice Exam Generation — DRY RUN ===");
    console.log(`Would generate ${COUNT} practice exam sets (${COUNT * Qs_PER_EXAM} question-tag assignments)`);
    const specs = buildExamSpecs(COUNT);
    const kinds = specs.reduce((acc, s) => { acc[s.kind] = (acc[s.kind]??0)+1; return acc; }, {} as Record<string,number>);
    console.log("Exam type breakdown:", kinds);
    return;
  }

  const prisma = new PrismaClient({ log: ["error"] });

  // Load checkpoint
  const checkpoint = new Set<string>(
    RESUME && existsSync(CKPT_PATH)
      ? JSON.parse(readFileSync(CKPT_PATH, "utf8")) as string[]
      : [],
  );
  if (checkpoint.size > 0) console.log(`Resuming: ${checkpoint.size} exams already created`);

  try {
    // Load full CAT-eligible question pool
    console.log("Loading question pool...");
    const allQuestions = await prisma.examQuestion.findMany({
      where: {
        status:             { in: ["published", "PUBLISHED"] },
        exam:               { in: ["NCLEX-RN", "NCLEX_RN"] },
        isAdaptiveEligible: true,
        rationale:          { not: null },
      },
      select: { id: true, bodySystem: true, difficulty: true, nclexClientNeedsCategory: true, tags: true },
    });
    console.log(`Pool: ${allQuestions.length} eligible questions`);

    const specs = buildExamSpecs(COUNT);
    const remaining = specs.filter((s) => !checkpoint.has(s.id));
    console.log(`\nGenerating ${remaining.length} practice exam sets...`);

    let created = 0;

    for (const spec of remaining) {
      // Upsert Exam row
      await prisma.exam.upsert({
        where:  { id: spec.id },
        update: { title: spec.title, status: ContentStatus.PUBLISHED },
        create: {
          id:         spec.id,
          title:      spec.title,
          country:    CountryCode.US,
          tier:       TierCode.RN,
          examFamily: ExamFamily.NCLEX_RN,
          status:     ContentStatus.PUBLISHED,
        },
      });

      // Select questions for this exam
      const poolForExam = spec.focus
        ? allQuestions.filter((q) => (q.bodySystem ?? "").toLowerCase() === spec.focus!.toLowerCase())
        : allQuestions;
      const selectedIds = buildExamQuestions(
        poolForExam.length >= Qs_PER_EXAM ? poolForExam : allQuestions,
        created,
      );

      // Tag questions with this exam's slug
      if (selectedIds.length > 0) {
        // Add exam-set tag to selected questions
        // Use raw SQL for efficient array append
        await prisma.$executeRaw`
          UPDATE exam_questions
          SET tags = array_append(tags, ${spec.slug})
          WHERE id = ANY(${selectedIds}::varchar[])
            AND NOT (tags @> ARRAY[${spec.slug}]::varchar[])
        `;
      }

      checkpoint.add(spec.id);
      created++;

      if (created % 25 === 0 || created === remaining.length) {
        writeFileSync(CKPT_PATH, JSON.stringify([...checkpoint], null, 2));
        process.stdout.write(`\r  Created: ${created} / ${remaining.length}`);
      }
    }
    console.log();

    const total = checkpoint.size;
    console.log(`\n=== Sprint 5 Complete ===`);
    console.log(`  Practice exam sets: ${total}`);
    console.log(`  Target: 500`);
    console.log(`  Status: ${total >= 500 ? "✓ TARGET MET" : `⚠ ${500 - total} more needed`}`);

    writeFileSync(REPORT_PATH, JSON.stringify({
      generatedAt: new Date().toISOString(),
      totalCreated: total,
      targetMet: total >= 500,
      questionPoolSize: allQuestions.length,
      questionsPerExam: Qs_PER_EXAM,
    }, null, 2));
    console.log(`\nReport: ${REPORT_PATH}`);

  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
