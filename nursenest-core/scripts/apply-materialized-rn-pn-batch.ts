#!/usr/bin/env npx tsx
/**
 * Upserts materialized RN/PN batch into Prisma (`exam_questions`, `flashcards`).
 * Requires `fundamentals` category (see prisma/seed).
 *
 *   npx tsx scripts/apply-materialized-rn-pn-batch.ts
 */
import "../src/lib/db/env-bootstrap";

import fs from "node:fs";
import path from "node:path";
import { ContentStatus, CountryCode, ExamFamily, PrismaClient, TierCode } from "@prisma/client";
import { MIXED_PRACTICE_2026_EXAM_ID } from "@/lib/exams/practice-exam-presets";

const prisma = new PrismaClient();
const DIR = path.join(process.cwd(), "data/materialized/rn-pn-replit-batch-2026");

type QRow = {
  id: string;
  stem: string;
  options: string[];
  correctAnswer: string[];
  questionType: string;
  tier: string;
  exam: string;
  status: string;
  regionScope: string;
  countryCode: string;
  careerType: string;
  rationale: string;
  topic: string;
  bodySystem: string;
  tags: string[];
  difficulty: number;
  stemHash: string;
};

type FRow = {
  id: string;
  front: string;
  back: string;
  country: string;
  tier: string;
  categorySlug: string;
};

async function main() {
  const fund = await prisma.category.findUnique({ where: { slug: "fundamentals" } });
  if (!fund) {
    console.error("Missing category slug=fundamentals — run prisma seed first.");
    process.exit(1);
  }

  await prisma.exam.upsert({
    where: { id: MIXED_PRACTICE_2026_EXAM_ID },
    create: {
      id: MIXED_PRACTICE_2026_EXAM_ID,
      title: "Mixed clinical practice — RN/PN core batch (20 items)",
      country: CountryCode.US,
      tier: TierCode.RPN,
      status: ContentStatus.PUBLISHED,
      examFamily: ExamFamily.NCLEX_PN,
    },
    update: {
      title: "Mixed clinical practice — RN/PN core batch (20 items)",
      status: ContentStatus.PUBLISHED,
      country: CountryCode.US,
      tier: TierCode.RPN,
      examFamily: ExamFamily.NCLEX_PN,
    },
  });

  const qPath = path.join(DIR, "questions.json");
  const fPath = path.join(DIR, "flashcards.json");
  if (!fs.existsSync(qPath)) {
    console.error(`Missing ${qPath} — run scripts/generate-materialized-rn-pn-batch.ts`);
    process.exit(1);
  }

  const questions = JSON.parse(fs.readFileSync(qPath, "utf8")) as QRow[];
  let qOk = 0;
  for (const q of questions) {
    await prisma.examQuestion.upsert({
      where: { id: q.id },
      create: {
        id: q.id,
        stem: q.stem,
        options: q.options,
        correctAnswer: q.correctAnswer,
        questionType: q.questionType,
        tier: q.tier,
        exam: q.exam,
        status: q.status,
        regionScope: q.regionScope,
        countryCode: q.countryCode,
        careerType: q.careerType,
        rationale: q.rationale,
        topic: q.topic,
        bodySystem: q.bodySystem,
        tags: q.tags,
        difficulty: q.difficulty,
        stemHash: q.stemHash,
      },
      update: {
        stem: q.stem,
        options: q.options,
        correctAnswer: q.correctAnswer,
        questionType: q.questionType,
        tier: q.tier,
        exam: q.exam,
        status: q.status,
        regionScope: q.regionScope,
        countryCode: q.countryCode,
        careerType: q.careerType,
        rationale: q.rationale,
        topic: q.topic,
        bodySystem: q.bodySystem,
        tags: q.tags,
        difficulty: q.difficulty,
        stemHash: q.stemHash,
      },
    });
    qOk += 1;
  }

  let fOk = 0;
  if (fs.existsSync(fPath)) {
    const flashcards = JSON.parse(fs.readFileSync(fPath, "utf8")) as FRow[];
    for (const f of flashcards) {
      const tier = f.tier === "RN" ? TierCode.RN : TierCode.LVN_LPN;
      const examFamily = tier === TierCode.RN ? ExamFamily.NCLEX_RN : ExamFamily.NCLEX_PN;
      await prisma.flashcard.upsert({
        where: { id: f.id },
        create: {
          id: f.id,
          front: f.front,
          back: f.back,
          country: CountryCode.US,
          tier,
          status: ContentStatus.PUBLISHED,
          examFamily,
          categoryId: fund.id,
        },
        update: {
          front: f.front,
          back: f.back,
          country: CountryCode.US,
          tier,
          status: ContentStatus.PUBLISHED,
          examFamily,
          categoryId: fund.id,
        },
      });
      fOk += 1;
    }
  }

  console.log(JSON.stringify({ examId: MIXED_PRACTICE_2026_EXAM_ID, examQuestionsUpserted: qOk, flashcardsUpserted: fOk }, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
