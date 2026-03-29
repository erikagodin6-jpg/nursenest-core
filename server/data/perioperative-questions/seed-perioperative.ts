import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { alliedQuestions, alliedFlashcards } from "../../../shared/schema.js";
import { allPerioperativeQuestions } from "./index.js";
import { eq, and, sql } from "drizzle-orm";

function generateFlashcardsFromQuestion(question: typeof allPerioperativeQuestions[0], questionId: string) {
  const cards: {
    careerType: string;
    questionId: string;
    cardType: string;
    front: string;
    back: string;
    rationale: string;
    clinicalPearl: string;
    blueprintCategory: string;
    subtopic: string;
  }[] = [];

  cards.push({
    careerType: "perioperative",
    questionId,
    cardType: "concept",
    front: question.learningObjective,
    back: question.rationaleLong.substring(0, 500),
    rationale: question.examTrap,
    clinicalPearl: question.clinicalPearls[0] || "",
    blueprintCategory: question.blueprintCategory,
    subtopic: question.subtopic,
  });

  if (question.clinicalPearls.length > 1) {
    cards.push({
      careerType: "perioperative",
      questionId,
      cardType: "clinical_pearl",
      front: `Clinical Pearl: ${question.subtopic}`,
      back: question.clinicalPearls.join("\n\n"),
      rationale: question.safetyNote,
      clinicalPearl: question.clinicalPearls[1],
      blueprintCategory: question.blueprintCategory,
      subtopic: question.subtopic,
    });
  }

  if (question.safetyNote) {
    cards.push({
      careerType: "perioperative",
      questionId,
      cardType: "safety",
      front: `Safety Note: ${question.blueprintCategory} - ${question.subtopic}`,
      back: question.safetyNote,
      rationale: question.examTrap,
      clinicalPearl: question.clinicalPearls[0] || "",
      blueprintCategory: question.blueprintCategory,
      subtopic: question.subtopic,
    });
  }

  return cards;
}

export async function seedPerioperativeQuestions(dbInstance?: ReturnType<typeof drizzle>) {
  const pool = dbInstance ? null : new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const db = dbInstance || drizzle(pool!);

  try {
    console.log(`Starting perioperative question seed...`);
    console.log(`Total questions to insert: ${allPerioperativeQuestions.length}`);

    const existingCount = await db
      .select({ id: alliedQuestions.id })
      .from(alliedQuestions)
      .where(
        and(
          eq(alliedQuestions.careerType, "perioperative"),
          eq(alliedQuestions.status, "active")
        )
      );

    if (existingCount.length >= allPerioperativeQuestions.length) {
      console.log(`Already have ${existingCount.length} active perioperative questions. Skipping seed.`);
      return { questionsInserted: 0, flashcardsInserted: 0 };
    }

    if (existingCount.length > 0) {
      console.log(`Removing ${existingCount.length} existing perioperative questions...`);
      const existingIds = existingCount.map(q => q.id);
      for (const id of existingIds) {
        await db.delete(alliedFlashcards).where(eq(alliedFlashcards.questionId, id));
      }
      await db.delete(alliedQuestions).where(
        and(
          eq(alliedQuestions.careerType, "perioperative"),
          eq(alliedQuestions.status, "active")
        )
      );
    }

    let questionsInserted = 0;
    let flashcardsInserted = 0;
    const batchSize = 20;

    for (let i = 0; i < allPerioperativeQuestions.length; i += batchSize) {
      const batch = allPerioperativeQuestions.slice(i, i + batchSize);

      for (const question of batch) {
        const [inserted] = await db
          .insert(alliedQuestions)
          .values({
            careerType: "perioperative",
            stem: question.stem,
            options: question.options,
            correctAnswer: question.correctAnswer,
            rationaleLong: question.rationaleLong,
            learningObjective: question.learningObjective,
            blueprintCategory: question.blueprintCategory,
            subtopic: question.subtopic,
            difficulty: question.difficulty,
            cognitiveLevel: question.cognitiveLevel,
            questionType: question.questionType,
            examTrap: question.examTrap,
            clinicalPearls: question.clinicalPearls,
            safetyNote: question.safetyNote,
            distractorRationales: question.distractorRationales,
            status: "active",
            isFree: questionsInserted < 10,
          })
          .returning({ id: alliedQuestions.id });

        questionsInserted++;

        const flashcards = generateFlashcardsFromQuestion(question, inserted.id);
        if (flashcards.length > 0) {
          await db.insert(alliedFlashcards).values(flashcards);
          flashcardsInserted += flashcards.length;
        }
      }

      console.log(`Inserted ${Math.min(i + batchSize, allPerioperativeQuestions.length)}/${allPerioperativeQuestions.length} questions...`);
    }

    console.log(`Seed complete: ${questionsInserted} questions, ${flashcardsInserted} flashcards inserted.`);
    return { questionsInserted, flashcardsInserted };
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

const isDirectExecution = process.argv[1]?.includes("seed-perioperative");
if (isDirectExecution) {
  seedPerioperativeQuestions()
    .then((result) => {
      console.log("Seed result:", result);
      process.exit(0);
    })
    .catch((err) => {
      console.error("Seed failed:", err);
      process.exit(1);
    });
}
