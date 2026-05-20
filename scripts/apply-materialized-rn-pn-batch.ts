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
import {
  EXAM_PN_MIXED_PRACTICE_2026_ID,
  EXAM_RN_MIXED_PRACTICE_2026_ID,
  EXAM_US_PN_FULL_2026_ID,
  EXAM_US_RN_FULL_2026_ID,
  FULL_EXAM_2026_QUESTION_TARGET,
  MIXED_PRACTICE_2026_EXAM_ID,
} from "@/lib/exams/practice-exam-presets";

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
  countryCode?: string | null;
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

  await prisma.exam.upsert({
    where: { id: EXAM_RN_MIXED_PRACTICE_2026_ID },
    create: {
      id: EXAM_RN_MIXED_PRACTICE_2026_ID,
      title: "RN mixed practice — tagged RN pool (20 items)",
      country: CountryCode.US,
      tier: TierCode.RN,
      status: ContentStatus.PUBLISHED,
      examFamily: ExamFamily.NCLEX_RN,
    },
    update: {
      title: "RN mixed practice — tagged RN pool (20 items)",
      status: ContentStatus.PUBLISHED,
      country: CountryCode.US,
      tier: TierCode.RN,
      examFamily: ExamFamily.NCLEX_RN,
    },
  });

  await prisma.exam.upsert({
    where: { id: EXAM_PN_MIXED_PRACTICE_2026_ID },
    create: {
      id: EXAM_PN_MIXED_PRACTICE_2026_ID,
      title: "PN mixed practice — tagged PN pool (20 items)",
      country: CountryCode.US,
      tier: TierCode.RPN,
      status: ContentStatus.PUBLISHED,
      examFamily: ExamFamily.NCLEX_PN,
    },
    update: {
      title: "PN mixed practice — tagged PN pool (20 items)",
      status: ContentStatus.PUBLISHED,
      country: CountryCode.US,
      tier: TierCode.RPN,
      examFamily: ExamFamily.NCLEX_PN,
    },
  });

  await prisma.exam.upsert({
    where: { id: EXAM_US_RN_FULL_2026_ID },
    create: {
      id: EXAM_US_RN_FULL_2026_ID,
      title: `NCLEX-RN full practice (${FULL_EXAM_2026_QUESTION_TARGET} items)`,
      country: CountryCode.US,
      tier: TierCode.RN,
      status: ContentStatus.PUBLISHED,
      examFamily: ExamFamily.NCLEX_RN,
    },
    update: {
      title: `NCLEX-RN full practice (${FULL_EXAM_2026_QUESTION_TARGET} items)`,
      status: ContentStatus.PUBLISHED,
      country: CountryCode.US,
      tier: TierCode.RN,
      examFamily: ExamFamily.NCLEX_RN,
    },
  });

  await prisma.exam.upsert({
    where: { id: EXAM_US_PN_FULL_2026_ID },
    create: {
      id: EXAM_US_PN_FULL_2026_ID,
      title: `NCLEX-PN full practice (${FULL_EXAM_2026_QUESTION_TARGET} items)`,
      country: CountryCode.US,
      tier: TierCode.RPN,
      status: ContentStatus.PUBLISHED,
      examFamily: ExamFamily.NCLEX_PN,
    },
    update: {
      title: `NCLEX-PN full practice (${FULL_EXAM_2026_QUESTION_TARGET} items)`,
      status: ContentStatus.PUBLISHED,
      country: CountryCode.US,
      tier: TierCode.RPN,
      examFamily: ExamFamily.NCLEX_PN,
    },
  });

  const qPath = path.join(DIR, "questions.json");
  const fPath = path.join(DIR, "flashcards.json");
  if (!fs.existsSync(qPath)) {
    console.error(`Missing ${qPath} — run scripts/generate-rn-pn-sprint2-batch.ts`);
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
        countryCode: q.countryCode ?? null,
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
        countryCode: q.countryCode ?? null,
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
      const country = f.country === "CA" ? CountryCode.CA : CountryCode.US;
      const tier: TierCode =
        f.tier === "RN" ? TierCode.RN : f.tier === "RPN" ? TierCode.RPN : TierCode.LVN_LPN;
      const examFamily =
        tier === TierCode.RN
          ? ExamFamily.NCLEX_RN
          : tier === TierCode.RPN && country === CountryCode.CA
            ? ExamFamily.REX_PN
            : ExamFamily.NCLEX_PN;
      await prisma.flashcard.upsert({
        where: { id: f.id },
        create: {
          id: f.id,
          front: f.front,
          back: f.back,
          country,
          tier,
          status: ContentStatus.PUBLISHED,
          examFamily,
          categoryId: fund.id,
        },
        update: {
          front: f.front,
          back: f.back,
          country,
          tier,
          status: ContentStatus.PUBLISHED,
          examFamily,
          categoryId: fund.id,
        },
      });
      fOk += 1;
    }
  }

  console.log(
    JSON.stringify(
      {
        examIds: [
          MIXED_PRACTICE_2026_EXAM_ID,
          EXAM_RN_MIXED_PRACTICE_2026_ID,
          EXAM_PN_MIXED_PRACTICE_2026_ID,
          EXAM_US_RN_FULL_2026_ID,
          EXAM_US_PN_FULL_2026_ID,
        ],
        examQuestionsUpserted: qOk,
        flashcardsUpserted: fOk,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
