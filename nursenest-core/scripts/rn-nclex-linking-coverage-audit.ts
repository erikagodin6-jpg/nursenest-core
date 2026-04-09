#!/usr/bin/env npx tsx
/**
 * RN NCLEX prioritized lessons: related-question pool coverage + rationale registry presence.
 *
 * Uses the same `where` predicate as {@link loadRelatedExamQuestionStemsForPathwayLesson} (bounded OR fan-in).
 * Per-lesson work: one `examQuestion.count` (no full scans, no loading stems).
 *
 * Run (from nursenest-core):
 *   npx tsx scripts/rn-nclex-linking-coverage-audit.ts
 *   npx tsx scripts/rn-nclex-linking-coverage-audit.ts --json
 *   npx tsx scripts/rn-nclex-linking-coverage-audit.ts --pathway=ca-rn-nclex-rn --json-out=./tmp/rn-nclex-link-audit.json
 */
import "../src/lib/db/env-bootstrap";
import fs from "node:fs";
import path from "node:path";
import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { RN_NCLEX_CATALOG_RATIONALE_ENTRIES } from "@/lib/learner/lesson-question-rationale/rn-nclex-catalog-rationale-registry";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { buildRelatedExamQuestionWhereForPathwayLesson } from "@/lib/lessons/lesson-question-cross-links";
import { RN_NCLEX_PRIORITIZED_LESSON_SLUGS } from "@/lib/lessons/rn-nclex-lesson-question-bridge";

const REGISTRY_SLUGS = new Set(RN_NCLEX_CATALOG_RATIONALE_ENTRIES.map((e) => e.lessonSlug));

type RnNclexLinkAuditRow = {
  lessonSlug: string;
  relatedQuestionCount: number;
  linkStatus: "OK" | "LOW" | "NONE";
  rationaleRegistry: "HAS_MAPPING" | "NO_MAPPING";
};

function linkStatusForCount(n: number): "OK" | "LOW" | "NONE" {
  if (n === 0) return "NONE";
  if (n >= 6) return "OK";
  return "LOW";
}

function fallbackLessonFields(slug: string): {
  lessonTitle: string;
  lessonTopic: string;
  lessonTopicSlug: string;
  bodySystem: string | null;
} {
  const topicSlug = slug.replace(/-nclex-rn$/i, "");
  const label = topicSlug.replace(/-/g, " ").trim() || slug;
  return {
    lessonTitle: label,
    lessonTopic: label,
    lessonTopicSlug: topicSlug,
    bodySystem: null,
  };
}

function parseArgs(argv: string[]) {
  let pathwayId = "us-rn-nclex-rn";
  let json = false;
  let jsonOut: string | null = null;
  for (const a of argv) {
    if (a === "--json") json = true;
    if (a.startsWith("--pathway=")) pathwayId = a.slice("--pathway=".length).trim() || pathwayId;
    if (a.startsWith("--json-out=")) jsonOut = a.slice("--json-out=".length).trim() || null;
  }
  return { pathwayId, json, jsonOut };
}

async function main() {
  const { pathwayId, json, jsonOut } = parseArgs(process.argv.slice(2));
  const pathway = getExamPathwayById(pathwayId);
  if (!pathway) {
    console.error(`Unknown pathway: ${pathwayId}`);
    process.exit(1);
  }

  const slugs = [...RN_NCLEX_PRIORITIZED_LESSON_SLUGS];

  const lessonRows = await prisma.pathwayLesson.findMany({
    where: {
      pathwayId: pathway.id,
      status: ContentStatus.PUBLISHED,
      locale: "en",
      slug: { in: slugs },
    },
    select: { slug: true, title: true, topic: true, topicSlug: true, bodySystem: true },
  });
  const bySlug = new Map(lessonRows.map((r) => [r.slug, r]));

  const results: RnNclexLinkAuditRow[] = [];

  for (const lessonSlug of slugs) {
    const row = bySlug.get(lessonSlug);
    const meta = row
      ? {
          lessonTitle: row.title,
          lessonTopic: row.topic,
          lessonTopicSlug: row.topicSlug,
          bodySystem: row.bodySystem,
        }
      : fallbackLessonFields(lessonSlug);

    const where = buildRelatedExamQuestionWhereForPathwayLesson({
      pathway,
      lessonSlug,
      ...meta,
    });

    let relatedQuestionCount = 0;
    if (where) {
      relatedQuestionCount = await prisma.examQuestion.count({ where });
    }

    results.push({
      lessonSlug,
      relatedQuestionCount,
      linkStatus: linkStatusForCount(relatedQuestionCount),
      rationaleRegistry: REGISTRY_SLUGS.has(lessonSlug) ? "HAS_MAPPING" : "NO_MAPPING",
    });
  }

  console.log(`Pathway: ${pathway.id} (${pathway.displayName})`);
  console.log(`Prioritized lessons: ${slugs.length}; DB rows matched: ${lessonRows.length}`);
  console.log("");

  console.table(
    results.map((r) => ({
      lessonSlug: r.lessonSlug,
      count: r.relatedQuestionCount,
      linkStatus: r.linkStatus,
      rationaleRegistry: r.rationaleRegistry,
    })),
  );

  const noneQ = results.filter((r) => r.linkStatus === "NONE");
  const lowQ = results.filter((r) => r.linkStatus === "LOW");
  const noMap = results.filter((r) => r.rationaleRegistry === "NO_MAPPING");

  console.log("\n--- Summary ---");
  console.log(`Related questions NONE (0): ${noneQ.length}`, noneQ.map((r) => r.lessonSlug).join(", ") || "(none)");
  console.log(`Related questions LOW (1–5): ${lowQ.length}`, lowQ.map((r) => r.lessonSlug).join(", ") || "(none)");
  console.log(`Rationale registry NO_MAPPING: ${noMap.length}`, noMap.map((r) => r.lessonSlug).join(", ") || "(none)");

  const payload = { pathwayId: pathway.id, generatedAt: new Date().toISOString(), rows: results };
  if (json) {
    console.log("\n--- JSON ---");
    console.log(JSON.stringify(payload, null, 2));
  }
  if (jsonOut) {
    const abs = path.resolve(process.cwd(), jsonOut);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    console.log(`\nWrote ${abs}`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  void prisma.$disconnect();
  process.exit(1);
});
