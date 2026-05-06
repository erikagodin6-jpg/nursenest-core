#!/usr/bin/env npx tsx
/**
 * Offline audit: topic slug hygiene across pathway lessons, flashcard categories, exam questions, clinical scenarios.
 *
 * Usage (from nursenest-core/):
 *   npx tsx scripts/audit-study-topic-slugs.ts
 *   npx tsx scripts/audit-study-topic-slugs.ts --pathwayId=us-rn-nclex-rn
 */
import "dotenv/config";
import { prisma } from "./lib/prisma-script-client";
import { auditTopicSlugValue } from "@/lib/study/topic-slug-normalize";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

const PREFIX = "[TOPIC_SLUG_AUDIT]";

function parseArgs() {
  const argv = process.argv.slice(2);
  let pathwayId: string | null = null;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a === "--pathwayId" && argv[i + 1]) {
      pathwayId = argv[i + 1]!.trim();
      i++;
    }
  }
  return { pathwayId };
}

async function main() {
  const { pathwayId } = parseArgs();
  if (!isDatabaseUrlConfigured()) {
    console.log(`${PREFIX} DATABASE_URL not configured — nothing to scan.`);
    process.exit(0);
  }

  console.log(`${PREFIX} start pathwayFilter=${pathwayId ?? "ALL"}`);

  const pathwayWhere = pathwayId ? { pathwayId } : {};

  let plCursor: string | undefined;
  let plTotal = 0;
  for (;;) {
    const batch = await prisma.pathwayLesson.findMany({
      where: pathwayWhere,
      orderBy: { id: "asc" },
      take: 400,
      ...(plCursor ? { cursor: { id: plCursor }, skip: 1 } : {}),
      select: {
        id: true,
        pathwayId: true,
        slug: true,
        title: true,
        topic: true,
        topicSlug: true,
        locale: true,
        status: true,
      },
    });
    if (batch.length === 0) break;
    plCursor = batch[batch.length - 1]!.id;
    for (const r of batch) {
      plTotal++;
      const issues = auditTopicSlugValue(r.topicSlug);
      if (issues.length === 0) continue;
      console.log(
        `${PREFIX} PathwayLesson id=${r.id} pathwayId=${r.pathwayId} lessonSlug=${r.slug} title=${JSON.stringify(r.title.slice(0, 80))} topicSlug=${JSON.stringify(r.topicSlug)} issues=${issues.join("|")}`,
      );
    }
  }
  console.log(`${PREFIX} PathwayLesson rows_scanned=${plTotal}`);

  let fcCursor: string | undefined;
  let fcTotal = 0;
  for (;;) {
    const batch = await prisma.flashcard.findMany({
      orderBy: { id: "asc" },
      take: 400,
      ...(fcCursor ? { cursor: { id: fcCursor }, skip: 1 } : {}),
      select: {
        id: true,
        front: true,
        deck: { select: { pathwayId: true } },
        category: { select: { slug: true, topicCode: true, name: true } },
      },
    });
    if (batch.length === 0) break;
    fcCursor = batch[batch.length - 1]!.id;
    for (const r of batch) {
      fcTotal++;
      if (pathwayId && r.deck?.pathwayId !== pathwayId) continue;
      const slug = r.category.topicCode?.trim() || r.category.slug;
      const issues = auditTopicSlugValue(slug);
      if (issues.length === 0) continue;
      console.log(
        `${PREFIX} Flashcard id=${r.id} deckPathwayId=${r.deck?.pathwayId ?? "null"} categorySlug=${JSON.stringify(r.category.slug)} topicCode=${JSON.stringify(r.category.topicCode)} topicAsSlug=${JSON.stringify(slug)} issues=${issues.join("|")} front=${JSON.stringify(r.front.slice(0, 60))}`,
      );
    }
  }
  console.log(`${PREFIX} Flashcard rows_scanned=${fcTotal}`);

  let qCursor: string | undefined;
  let qTotal = 0;
  for (;;) {
    const batch = await prisma.examQuestion.findMany({
      orderBy: { id: "asc" },
      take: 400,
      ...(qCursor ? { cursor: { id: qCursor }, skip: 1 } : {}),
      select: { id: true, exam: true, stem: true, topic: true },
    });
    if (batch.length === 0) break;
    qCursor = batch[batch.length - 1]!.id;
    for (const r of batch) {
      qTotal++;
      const issues = auditTopicSlugValue(r.topic);
      if (issues.length === 0) continue;
      console.log(
        `${PREFIX} ExamQuestion id=${r.id} exam=${r.exam} topic=${JSON.stringify(r.topic)} issues=${issues.join("|")} stem=${JSON.stringify((r.stem ?? "").slice(0, 60))}`,
      );
    }
  }
  console.log(`${PREFIX} ExamQuestion rows_scanned=${qTotal}`);

  let scCursor: string | undefined;
  let scTotal = 0;
  for (;;) {
    const batch = await prisma.clinicalNursingScenario.findMany({
      where: pathwayWhere,
      orderBy: { id: "asc" },
      take: 200,
      ...(scCursor ? { cursor: { id: scCursor }, skip: 1 } : {}),
      select: {
        id: true,
        pathwayId: true,
        title: true,
        canonicalCategoryId: true,
      },
    });
    if (batch.length === 0) break;
    scCursor = batch[batch.length - 1]!.id;
    const catIds = [...new Set(batch.map((b) => b.canonicalCategoryId))];
    const cats = await prisma.category.findMany({
      where: { id: { in: catIds } },
      select: { id: true, slug: true, topicCode: true },
    });
    const catMap = new Map(cats.map((c) => [c.id, c]));
    for (const r of batch) {
      scTotal++;
      const c = catMap.get(r.canonicalCategoryId);
      const proxy = c?.topicCode?.trim() || c?.slug || "";
      const issues = auditTopicSlugValue(proxy || null);
      if (issues.length === 0 && proxy) continue;
      if (!proxy) {
        console.log(`${PREFIX} ClinicalNursingScenario id=${r.id} pathwayId=${r.pathwayId} title=${JSON.stringify(r.title)} categoryProxy=MISSING`);
        continue;
      }
      if (issues.length > 0) {
        console.log(
          `${PREFIX} ClinicalNursingScenario id=${r.id} pathwayId=${r.pathwayId} title=${JSON.stringify(r.title)} categoryTopicProxy=${JSON.stringify(proxy)} issues=${issues.join("|")}`,
        );
      }
    }
  }
  console.log(`${PREFIX} ClinicalNursingScenario rows_scanned=${scTotal}`);
  console.log(`${PREFIX} done`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
