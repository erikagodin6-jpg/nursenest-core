#!/usr/bin/env npx tsx
/**
 * Upserts NP clinical layer (`exam_questions` tier np, NP flashcards, NP exam preset row).
 *
 *   npx tsx scripts/apply-np-clinical-layer.ts
 */
import "../src/lib/db/env-bootstrap";

import fs from "node:fs";
import path from "node:path";
import { ContentStatus, CountryCode, ExamFamily, PrismaClient, TierCode } from "@prisma/client";
import { EXAM_NP_CLINICAL_PRACTICE_2026_ID } from "@/lib/exams/practice-exam-presets";

const prisma = new PrismaClient();
const DIR = path.join(process.cwd(), "data/materialized/np-clinical-layer-2026");

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
    where: { id: EXAM_NP_CLINICAL_PRACTICE_2026_ID },
    create: {
      id: EXAM_NP_CLINICAL_PRACTICE_2026_ID,
      title: "NP clinical practice — tagged NP tier pool (25 items)",
      country: CountryCode.US,
      tier: TierCode.NP,
      status: ContentStatus.PUBLISHED,
      examFamily: ExamFamily.NP,
    },
    update: {
      title: "NP clinical practice — tagged NP tier pool (25 items)",
      status: ContentStatus.PUBLISHED,
      country: CountryCode.US,
      tier: TierCode.NP,
      examFamily: ExamFamily.NP,
    },
  });

  const qPath = path.join(DIR, "questions.json");
  const fPath = path.join(DIR, "flashcards.json");
  if (!fs.existsSync(qPath)) {
    console.error(`Missing ${qPath} — run scripts/generate-np-clinical-layer.ts`);
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
      const tier = f.tier === "NP" ? TierCode.NP : TierCode.RN;
      const examFamily = tier === TierCode.NP ? ExamFamily.NP : ExamFamily.NCLEX_RN;
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

  console.log(JSON.stringify({ examId: EXAM_NP_CLINICAL_PRACTICE_2026_ID, examQuestionsUpserted: qOk, flashcardsUpserted: fOk }, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
