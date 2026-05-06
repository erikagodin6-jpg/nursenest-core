#!/usr/bin/env npx tsx
/**
 * Read-only audit: per pathway + topicSlug, compare lesson vs flashcard vs question difficulty signals.
 *
 * Usage:
 *   npx tsx scripts/audit-study-difficulty-alignment.ts --pathwayId=us-rn-nclex-rn
 */
import "dotenv/config";
import { ContentStatus, Prisma } from "@prisma/client";
import { prisma } from "./lib/prisma-script-client";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { normalizeTopicSlugInput } from "@/lib/study/topic-slug-normalize";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

const P = "[DIFFICULTY_ALIGNMENT_AUDIT]";

function parseArgs() {
  const argv = process.argv.slice(2);
  let pathwayId = "";
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--pathwayId" && argv[i + 1]) {
      pathwayId = argv[i + 1]!.trim();
      i++;
    }
  }
  return { pathwayId };
}

function cognitiveLooksApplication(level: string | null | undefined): boolean {
  const s = (level ?? "").toLowerCase();
  return s.includes("apply") || s.includes("analysis") || s.includes("eval");
}

function rationaleHeavy(
  rationale: string | null | undefined,
  clinicalReasoning: string | null | undefined,
  distractorRationales: Prisma.JsonValue | null | undefined,
): boolean {
  const r = (rationale ?? "").trim().length;
  const c = (clinicalReasoning ?? "").trim().length;
  let d = 0;
  if (distractorRationales != null && Array.isArray(distractorRationales)) {
    d = distractorRationales.filter((x) => typeof x === "object" && x != null).length;
  }
  return r >= 220 || c >= 120 || d >= 2;
}

async function main() {
  const { pathwayId } = parseArgs();
  if (!pathwayId) {
    console.error(`${P} --pathwayId required`);
    process.exit(1);
  }
  if (!isDatabaseUrlConfigured()) {
    console.log(`${P} DATABASE_URL not configured`);
    process.exit(0);
  }
  const pathway = getExamPathwayById(pathwayId);
  if (!pathway) {
    console.error(`${P} unknown pathway`);
    process.exit(1);
  }
  const examKeys = [...new Set(pathway.contentExamKeys)];

  const lessons = await prisma.pathwayLesson.findMany({
    where: { pathwayId, status: ContentStatus.PUBLISHED, locale: "en" },
    select: { topicSlug: true, slug: true, priority: true },
    take: 5000,
  });
  const topicSet = new Map<string, { lessonSlugs: string[]; priorities: string[] }>();
  for (const l of lessons) {
    const ts = normalizeTopicSlugInput(l.topicSlug);
    if (!ts) continue;
    const cur = topicSet.get(ts) ?? { lessonSlugs: [], priorities: [] };
    cur.lessonSlugs.push(l.slug);
    cur.priorities.push(l.priority);
    topicSet.set(ts, cur);
  }

  const qRows = await prisma.examQuestion.findMany({
    where: { exam: { in: examKeys }, status: "published" },
    select: {
      topic: true,
      difficulty: true,
      cognitiveLevel: true,
      rationale: true,
      clinicalReasoning: true,
      distractorRationales: true,
    },
    take: 12000,
  });

  type Agg = {
    q: number;
    easy: number;
    app: number;
    rat: number;
  };
  const byTopic = new Map<string, Agg>();
  for (const q of qRows) {
    const ts = normalizeTopicSlugInput(q.topic ?? "");
    if (!ts) continue;
    const a = byTopic.get(ts) ?? { q: 0, easy: 0, app: 0, rat: 0 };
    a.q++;
    const diff = q.difficulty ?? 3;
    if (diff <= 2) a.easy++;
    if (cognitiveLooksApplication(q.cognitiveLevel)) a.app++;
    if (rationaleHeavy(q.rationale, q.clinicalReasoning, q.distractorRationales)) a.rat++;
    byTopic.set(ts, a);
  }

  const fcCounts = await prisma.flashcard.groupBy({
    by: ["categoryId"],
    where: {
      status: ContentStatus.PUBLISHED,
      deck: { pathwayId },
    },
    _count: { _all: true },
  });
  const catIds = fcCounts.map((c) => c.categoryId);
  const cats = await prisma.category.findMany({
    where: { id: { in: catIds } },
    select: { id: true, slug: true, topicCode: true },
  });
  const catTopic = new Map(cats.map((c) => [c.id, normalizeTopicSlugInput(c.topicCode?.trim() || c.slug)]));
  const flashByTopic = new Map<string, number>();
  for (const row of fcCounts) {
    const ts = catTopic.get(row.categoryId);
    if (!ts) continue;
    flashByTopic.set(ts, (flashByTopic.get(ts) ?? 0) + row._count._all);
  }

  for (const [topic, meta] of topicSet) {
    const q = byTopic.get(topic);
    const fc = flashByTopic.get(topic) ?? 0;
    const flags: string[] = [];
    if (!q || q.q === 0) flags.push("lessons_no_questions");
    if (q && q.q > 0 && q.easy === q.q) flags.push("only_easy_questions");
    if (q && q.q > 0 && q.app === 0) flags.push("no_application_level_questions");
    if (q && q.q > 0 && q.rat === 0) flags.push("no_rationale_heavy_questions");
    if (fc === 0) flags.push("no_flashcards");
    if (q && q.q > 0 && meta.lessonSlugs.length === 0) flags.push("questions_no_lesson");
    if (flags.length === 0) continue;
    console.log(
      `${P} pathway=${pathwayId} topicSlug=${topic} lessons=${meta.lessonSlugs.length} questions=${q?.q ?? 0} flashcards=${fc} flags=${flags.join("|")}`,
    );
  }

  for (const [topic, q] of byTopic) {
    if (topicSet.has(topic)) continue;
    if (q.q < 3) continue;
    console.log(`${P} pathway=${pathwayId} topicSlug=${topic} questions=${q.q} flags=questions_without_catalog_lesson_topic`);
  }

  console.log(`${P} done topics_with_lessons=${topicSet.size}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
