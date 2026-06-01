#!/usr/bin/env tsx
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { ContentStatus, PrismaClient, UserRole } from "@prisma/client";

import { publicHomeStaticPlatformInventoryCounts } from "../src/lib/marketing/public-home-stats-payload";

for (const name of [".env", ".env.local", ".env.production"]) {
  const file = resolve(process.cwd(), name);
  if (!existsSync(file)) continue;
  const parsed = parseDotenv(readFileSync(file, "utf8"));
  for (const [key, value] of Object.entries(parsed)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

const snapshotPath = resolve(
  process.cwd(),
  process.env.PUBLIC_HOME_STATS_SNAPSHOT_PATH ?? "data/snapshots/public_home_stats_snapshot.json",
);

const prisma = new PrismaClient();
const staticCounts = publicHomeStaticPlatformInventoryCounts();
const [
  contentItemsLessonCount,
  pathwayLessonsPublished,
  totalFlashcards,
  totalDecks,
  registeredLearners,
  questionCount,
  questionsByTierRows,
  scenarioCount,
  topicGroups,
] = await Promise.all([
  prisma.contentItem.count({ where: { type: "lesson", hidden: false } }).catch(() => 0),
  prisma.pathwayLesson.count({ where: { status: ContentStatus.PUBLISHED, locale: "en" } }).catch(() => 0),
  prisma.flashcard.count({ where: { status: ContentStatus.PUBLISHED } }).catch(() => 0),
  prisma.flashcardDeck.count({ where: { status: ContentStatus.PUBLISHED } }).catch(() => 0),
  prisma.user.count({ where: { role: UserRole.LEARNER } }).catch(() => 0),
  prisma.examQuestion.count({ where: { status: "published" } }).catch(() => 0),
  prisma.examQuestion
    .groupBy({ by: ["tier"], where: { status: "published" }, _count: { _all: true } })
    .catch(() => []),
  prisma.examQuestion.count({ where: { status: "published", isScenario: true } }).catch(() => 0),
  prisma.examQuestion
    .groupBy({
      by: ["topic"],
      where: { status: "published", topic: { not: null }, NOT: { topic: "" } },
      _count: { _all: true },
    })
    .catch(() => []),
]);
await prisma.$disconnect();

const questionsByTier: Record<string, number> = {};
for (const row of questionsByTierRows) {
  const key = String(row.tier).trim().toLowerCase();
  if (key) questionsByTier[key] = (questionsByTier[key] ?? 0) + row._count._all;
}

const payload = {
  totalLessons: pathwayLessonsPublished > 0 ? pathwayLessonsPublished : contentItemsLessonCount,
  pathwayLessonsPublished,
  contentItemsLessonCount,
  questionCount,
  totalFlashcards,
  totalDecks,
  storeProductCount: 0,
  registeredLearners,
  clinicalSkillCount: staticCounts.clinicalSkillCount,
  medicationMathProblemCount: staticCounts.medicationMathProblemCount,
  ecgCaseCount: staticCounts.ecgCaseCount,
  labCaseCount: staticCounts.labCaseCount,
  questionsByTier,
  scenarioCount,
  topicCategoryCount: topicGroups.length,
};
mkdirSync(dirname(snapshotPath), { recursive: true });
writeFileSync(
  snapshotPath,
  `${JSON.stringify({ schema: "public_home_stats_snapshot.v1", generatedAt: new Date().toISOString(), payload }, null, 2)}\n`,
  "utf8",
);
console.log(
  JSON.stringify(
    {
      refreshed: true,
      questionCount: payload.questionCount,
      totalLessons: payload.totalLessons,
      totalFlashcards: payload.totalFlashcards,
      registeredLearners: payload.registeredLearners,
    },
    null,
    2,
  ),
);
