#!/usr/bin/env npx tsx
/**
 * Step 1 — Lesson audit manifest (catalog + scoped-gold, normalized).
 * Writes: data/audit/lesson-audit-<timestamp>.json
 *
 * Does not query Prisma (offline-safe). DB-published lessons are out of scope for this manifest;
 * re-run or extend with DB merge if needed.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ExamFamily } from "@prisma/client";
import { EXAM_PATHWAYS } from "../src/lib/exam-pathways/exam-product-registry";
import {
  getCatalogPathwayLessonsSync,
  listCatalogPathwayIdsWithLessonsSync,
} from "../src/lib/lessons/pathway-lesson-catalog-sync";
import catalogJson from "../src/content/pathway-lessons/catalog.json";
import { countWords, stripToPlainText } from "../src/lib/content-quality/plain-text";
import type { PathwayLessonRecord } from "../src/lib/lessons/pathway-lesson-types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const AUDIT_DIR = path.join(ROOT, "data", "audit");

type TierBucket = "PN" | "RN" | "NP" | "Allied" | "Other";

type LessonAuditEntry = {
  slug: string;
  title: string;
  status: "complete" | "incomplete" | "missing-content" | "duplicate";
  missingSections: string[];
  wordCount: number;
  hasPreQuestions: boolean;
  hasPostQuestions: boolean;
  structureMode: "premium" | "legacy" | undefined;
  publicComplete: boolean;
};

type PathwayAudit = {
  pathwayId: string;
  tier: TierBucket;
  label: string;
  totalLessons: number;
  completedLessons: number;
  incompleteLessons: number;
  missingLessons: number;
  duplicateLessons: number;
  lessons: LessonAuditEntry[];
};

function tierForPathway(pathwayId: string, examFamily?: ExamFamily): TierBucket {
  if (pathwayId.includes("allied")) return "Allied";
  if (examFamily === ExamFamily.NP || pathwayId.includes("-np-")) return "NP";
  if (pathwayId.includes("lpn") || pathwayId.includes("rpn")) return "PN";
  if (pathwayId.includes("rn")) return "RN";
  return "Other";
}

function pathwayLabel(id: string): string {
  const p = EXAM_PATHWAYS.find((x) => x.id === id);
  return p ? `${p.shortName} (${p.displayName})` : id;
}

function lessonWordCount(lesson: PathwayLessonRecord): number {
  const parts = [
    lesson.title ?? "",
    lesson.seoTitle ?? "",
    lesson.seoDescription ?? "",
    ...(lesson.sections ?? []).map((s) => (typeof s.body === "string" ? s.body : "")),
  ];
  return countWords(stripToPlainText(parts.join("\n\n")));
}

function rawSlugDupCounts(pathwayId: string): Map<string, number> {
  const bucket = (catalogJson as { pathways?: Record<string, { lessons?: { slug?: string }[] }> }).pathways?.[
    pathwayId
  ];
  const lessons = bucket?.lessons ?? [];
  const counts = new Map<string, number>();
  for (const row of lessons) {
    const s = typeof row.slug === "string" ? row.slug.trim() : "";
    if (!s) continue;
    counts.set(s, (counts.get(s) ?? 0) + 1);
  }
  return counts;
}

function classifyLesson(
  lesson: PathwayLessonRecord,
  slugDupCount: number,
): LessonAuditEntry {
  const wc = lessonWordCount(lesson);
  const preN = lesson.preTest?.length ?? 0;
  const postN = lesson.postTest?.length ?? 0;
  const hasPreQuestions = preN >= 2;
  const hasPostQuestions = postN >= 3;
  const gate = lesson.structuralQuality;
  const publicComplete = gate?.publicComplete === true;
  const structureMode = gate?.structureMode;
  const issues = [...(gate?.issues ?? [])];

  let status: LessonAuditEntry["status"];
  if (slugDupCount > 1) {
    status = "duplicate";
  } else if ((lesson.sections?.length ?? 0) === 0 || wc < 50) {
    status = "missing-content";
  } else if (publicComplete && hasPreQuestions && hasPostQuestions) {
    status = "complete";
  } else if (wc < 120 && !publicComplete) {
    status = "missing-content";
  } else {
    status = "incomplete";
  }

  return {
    slug: lesson.slug,
    title: lesson.title,
    status,
    missingSections: issues,
    wordCount: wc,
    hasPreQuestions,
    hasPostQuestions,
    structureMode,
    publicComplete,
  };
}

function main() {
  const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const outPath = path.join(AUDIT_DIR, `lesson-audit-${ts}.json`);

  const catalogPathwayIds = listCatalogPathwayIdsWithLessonsSync();
  const registryIds = new Set(EXAM_PATHWAYS.map((p) => p.id));
  const allPathwayIds = [...new Set([...registryIds, ...catalogPathwayIds])].sort();

  const pathways: PathwayAudit[] = [];

  for (const pathwayId of allPathwayIds) {
    const def = EXAM_PATHWAYS.find((p) => p.id === pathwayId);
    const tier = tierForPathway(pathwayId, def?.examFamily);
    const dupMap = rawSlugDupCounts(pathwayId);
    let normalized: PathwayLessonRecord[];
    try {
      normalized = getCatalogPathwayLessonsSync(pathwayId);
    } catch (e) {
      console.warn(`Skip pathway ${pathwayId}:`, e instanceof Error ? e.message : e);
      continue;
    }

    const lessons: LessonAuditEntry[] = normalized.map((lesson) =>
      classifyLesson(lesson, dupMap.get(lesson.slug) ?? 0),
    );

    const completedLessons = lessons.filter((l) => l.status === "complete").length;
    const duplicateLessons = lessons.filter((l) => l.status === "duplicate").length;
    const missingLessons = lessons.filter((l) => l.status === "missing-content").length;
    const incompleteLessons = lessons.filter((l) => l.status === "incomplete").length;

    pathways.push({
      pathwayId,
      tier,
      label: pathwayLabel(pathwayId),
      totalLessons: lessons.length,
      completedLessons,
      incompleteLessons,
      missingLessons,
      duplicateLessons,
      lessons,
    });
  }

  const report = {
    generatedAt: new Date().toISOString(),
    source: "catalog.json + scoped-gold prepend, normalized (pathway-lesson-catalog-sync)",
    note:
      "Subscriber/DB pathway_lessons rows are not merged in this pass. " +
      "Legacy monolith content (client/src/data/lessons contentMap) is a separate source of truth; " +
      "run `npm run audit:legacy-vs-catalog` for overlap and tier heuristics before merging recovered lessons.",
    pathways,
    tierSummary: (() => {
      const byTier: Record<TierBucket, { lessons: number; complete: number; pathways: number }> = {
        PN: { lessons: 0, complete: 0, pathways: 0 },
        RN: { lessons: 0, complete: 0, pathways: 0 },
        NP: { lessons: 0, complete: 0, pathways: 0 },
        Allied: { lessons: 0, complete: 0, pathways: 0 },
        Other: { lessons: 0, complete: 0, pathways: 0 },
      };
      for (const p of pathways) {
        const t = p.tier;
        byTier[t].pathways += 1;
        byTier[t].lessons += p.totalLessons;
        byTier[t].complete += p.completedLessons;
      }
      return byTier;
    })(),
  };

  fs.mkdirSync(AUDIT_DIR, { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");

  console.log("\n=== Lesson audit manifest ===\n");
  console.log(`Written: ${path.relative(ROOT, outPath)}\n`);

  const { tierSummary } = report;
  console.log("| Tier   | Pathways | Lessons | Complete | % complete | Incomplete* |");
  console.log("|--------|----------|---------|----------|------------|-------------|");
  for (const tier of ["PN", "RN", "NP", "Allied", "Other"] as TierBucket[]) {
    const row = tierSummary[tier];
    const pct = row.lessons === 0 ? "n/a" : `${((row.complete / row.lessons) * 100).toFixed(1)}%`;
    const incompleteCount = row.lessons - row.complete;
    console.log(
      `| ${tier.padEnd(6)} | ${String(row.pathways).padStart(8)} | ${String(row.lessons).padStart(7)} | ${String(row.complete).padStart(8)} | ${pct.padStart(10)} | ${String(incompleteCount).padStart(11)} |`,
    );
  }
  console.log(
    "\n*Incomplete column = lessons not classified \"complete\" (includes incomplete, missing-content, duplicate rows).",
  );
  console.log("\nDone.\n");
}

main();
