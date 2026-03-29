import pg from "pg";
import { traumaQuestions } from "../server/data/emergency-nursing-questions/trauma";
import { traumaBatch2Questions } from "../server/data/emergency-nursing-questions/trauma-batch2";
import { traumaBatch3Questions } from "../server/data/emergency-nursing-questions/trauma-batch3";
import { traumaBatch4Questions } from "../server/data/emergency-nursing-questions/trauma-batch4";
import { traumaBatch5Questions } from "../server/data/emergency-nursing-questions/trauma-batch5";
import { traumaBatch6Questions } from "../server/data/emergency-nursing-questions/trauma-batch6";
import { traumaBatch7Questions } from "../server/data/emergency-nursing-questions/trauma-batch7";
import { traumaBatch8Questions } from "../server/data/emergency-nursing-questions/trauma-batch8";
import { shockQuestions } from "../server/data/emergency-nursing-questions/shock";
import { shockBatch2Questions } from "../server/data/emergency-nursing-questions/shock-batch2";
import { shockBatch3Questions } from "../server/data/emergency-nursing-questions/shock-batch3";
import { shockBatch4Questions } from "../server/data/emergency-nursing-questions/shock-batch4";
import { shockBatch5Questions } from "../server/data/emergency-nursing-questions/shock-batch5";
import type { EmergencyNursingQuestion } from "../server/data/emergency-nursing-questions/types";

const allQuestions: EmergencyNursingQuestion[] = [
  ...traumaQuestions,
  ...traumaBatch2Questions,
  ...traumaBatch3Questions,
  ...traumaBatch4Questions,
  ...traumaBatch5Questions,
  ...traumaBatch6Questions,
  ...traumaBatch7Questions,
  ...traumaBatch8Questions,
  ...shockQuestions,
  ...shockBatch2Questions,
  ...shockBatch3Questions,
  ...shockBatch4Questions,
  ...shockBatch5Questions,
];

function generateFlashcardsFromQuestion(q: EmergencyNursingQuestion): Array<{
  cardType: string;
  front: string;
  back: string;
  rationale: string;
  clinicalPearl: string | null;
}> {
  const cards: Array<{
    cardType: string;
    front: string;
    back: string;
    rationale: string;
    clinicalPearl: string | null;
  }> = [];

  cards.push({
    cardType: "definition",
    front: q.learningObjective,
    back: q.options[q.correctAnswer],
    rationale: (q.rationaleLong || "").substring(0, 500),
    clinicalPearl: null,
  });

  if (q.clinicalPearls && q.clinicalPearls.length > 0) {
    cards.push({
      cardType: "clinical_decision",
      front: `Clinical decision: ${q.subtopic} - What is the key clinical pearl?`,
      back: q.clinicalPearls[0],
      rationale: q.clinicalPearls.slice(1).join(" | "),
      clinicalPearl: q.clinicalPearls[0],
    });
  }

  if (q.safetyNote) {
    cards.push({
      cardType: "red_flag",
      front: `Red Flag: ${q.subtopic} - What safety concern must you remember?`,
      back: q.safetyNote,
      rationale: `From: ${q.blueprintCategory}`,
      clinicalPearl: null,
    });
  }

  return cards;
}

async function seed() {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const traumaCount = traumaQuestions.length + traumaBatch2Questions.length + traumaBatch3Questions.length +
    traumaBatch4Questions.length + traumaBatch5Questions.length + traumaBatch6Questions.length +
    traumaBatch7Questions.length + traumaBatch8Questions.length;
  const shockCount = shockQuestions.length + shockBatch2Questions.length + shockBatch3Questions.length +
    shockBatch4Questions.length + shockBatch5Questions.length;

  console.log(`Trauma questions: ${traumaCount}`);
  console.log(`Shock questions: ${shockCount}`);
  console.log(`Total questions to seed: ${allQuestions.length}`);

  if (allQuestions.length !== 375) {
    console.error(`ERROR: Expected 375 questions, got ${allQuestions.length}. Aborting.`);
    process.exit(1);
  }

  const existing = await pool.query(
    "SELECT COUNT(*) as total FROM allied_questions WHERE career_type = 'emergencyNursing' AND status = 'active'"
  );
  console.log(`Existing emergencyNursing active questions in DB: ${existing.rows[0].total}`);

  const batchId = `emergency-nursing-seed-${Date.now()}`;
  let questionsInserted = 0;
  let flashcardsInserted = 0;
  let errors = 0;

  for (const q of allQuestions) {
    try {
      const options = JSON.stringify(q.options.map((text: string, i: number) => ({ id: i, text })));
      const distractorRationales = q.distractorRationales
        ? JSON.stringify(
            q.distractorRationales.reduce((acc: Record<string, string>, r: string, i: number) => {
              acc[String(i)] = r;
              return acc;
            }, {})
          )
        : null;
      const clinicalPearls = q.clinicalPearls ? JSON.stringify(q.clinicalPearls) : null;

      const result = await pool.query(
        `INSERT INTO allied_questions (
          career_type, batch_id, stem, options, correct_answer, rationale_long,
          learning_objective, blueprint_category, subtopic, difficulty,
          cognitive_level, question_type, exam_trap, clinical_pearls,
          safety_note, distractor_rationales, is_free, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING id`,
        [
          "emergencyNursing",
          batchId,
          q.stem,
          options,
          q.correctAnswer,
          q.rationaleLong,
          q.learningObjective,
          q.blueprintCategory,
          q.subtopic,
          q.difficulty,
          q.cognitiveLevel,
          q.questionType === "MCQ_SINGLE" ? "multiple_choice" : q.questionType,
          q.examTrap,
          clinicalPearls,
          q.safetyNote,
          distractorRationales,
          false,
          "active",
        ]
      );
      questionsInserted++;

      const questionId = result.rows[0].id;
      const cards = generateFlashcardsFromQuestion(q);
      for (const card of cards) {
        await pool.query(
          `INSERT INTO allied_flashcards (
            career_type, question_id, card_type, front, back, rationale,
            clinical_pearl, blueprint_category, subtopic
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            "emergencyNursing",
            questionId,
            card.cardType,
            card.front,
            card.back,
            card.rationale,
            card.clinicalPearl,
            q.blueprintCategory,
            q.subtopic,
          ]
        );
        flashcardsInserted++;
      }
    } catch (e: any) {
      errors++;
      if (errors <= 5)
        console.error("Insert error:", e.message, "for question:", q.stem?.substring(0, 80));
    }
  }

  console.log(`\nQuestions inserted: ${questionsInserted}`);
  console.log(`Flashcards inserted: ${flashcardsInserted}`);
  console.log(`Errors: ${errors}`);

  const finalCount = await pool.query(
    "SELECT COUNT(*) as total FROM allied_questions WHERE career_type = 'emergencyNursing' AND status = 'active'"
  );
  console.log(`\nTotal emergencyNursing active questions in DB: ${finalCount.rows[0].total}`);

  const catCount = await pool.query(
    "SELECT blueprint_category, COUNT(*) as cnt FROM allied_questions WHERE career_type = 'emergencyNursing' AND batch_id = $1 GROUP BY blueprint_category ORDER BY cnt DESC",
    [batchId]
  );
  console.log("\nBy category (this batch):");
  catCount.rows.forEach((r: any) => console.log(`  ${r.blueprint_category}: ${r.cnt}`));

  const fcCount = await pool.query(
    "SELECT card_type, COUNT(*) as cnt FROM allied_flashcards WHERE career_type = 'emergencyNursing' GROUP BY card_type ORDER BY cnt DESC"
  );
  console.log("\nFlashcards by type:");
  fcCount.rows.forEach((r: any) => console.log(`  ${r.card_type}: ${r.cnt}`));

  await pool.end();
  console.log("\nDone!");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
