import { pool } from "../storage";
import { nmcCbtQuestions, ahpraQuestions, gulfQuestions } from "./international-questions-data";

interface ExamConfig {
  examKey: string;
  tier: string;
  exam: string;
  countryCode: string;
  licensingBody: string;
  labUnitVariant: string;
  medicationNamingVariant: string;
  regionScope: string;
}

const EXAM_CONFIGS: Record<string, ExamConfig> = {
  NMC_CBT: {
    examKey: "NMC_CBT",
    tier: "rn",
    exam: "NMC-CBT",
    countryCode: "GB",
    licensingBody: "NMC",
    labUnitVariant: "SI",
    medicationNamingVariant: "BNF",
    regionScope: "BOTH",
  },
  AHPRA_RN: {
    examKey: "AHPRA_RN",
    tier: "rn",
    exam: "AHPRA-RN",
    countryCode: "AU",
    licensingBody: "AHPRA",
    labUnitVariant: "SI",
    medicationNamingVariant: "Australian_Approved_Names",
    regionScope: "BOTH",
  },
  GULF_NURSING: {
    examKey: "GULF_NURSING",
    tier: "rn",
    exam: "GULF-NURSING",
    countryCode: "AE",
    licensingBody: "DHA/HAAD/MOH/SCFHS",
    labUnitVariant: "conventional",
    medicationNamingVariant: "generic_international",
    regionScope: "BOTH",
  },
};

async function seedInternationalQuestions() {
  console.log("\n=== International Nursing Exam Question Seeder ===\n");

  const examSets = [
    { name: "UK NMC CBT", config: EXAM_CONFIGS.NMC_CBT, questions: nmcCbtQuestions },
    { name: "Australia AHPRA RN", config: EXAM_CONFIGS.AHPRA_RN, questions: ahpraQuestions },
    { name: "Gulf Region (DHA/HAAD/MOH)", config: EXAM_CONFIGS.GULF_NURSING, questions: gulfQuestions },
  ];

  for (const examSet of examSets) {
    console.log(`\n--- ${examSet.name} ---`);
    console.log(`Total questions: ${examSet.questions.length}`);

    const domainCounts: Record<string, number> = {};
    const difficultyCounts: Record<number, number> = {};
    let mockEligible = 0;

    for (const q of examSet.questions) {
      domainCounts[q.domain] = (domainCounts[q.domain] || 0) + 1;
      difficultyCounts[q.difficulty] = (difficultyCounts[q.difficulty] || 0) + 1;
      if (q.isMockExamEligible) mockEligible++;
    }

    console.log("\nDomain distribution:");
    for (const [d, c] of Object.entries(domainCounts).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${d}: ${c} (${((c / examSet.questions.length) * 100).toFixed(1)}%)`);
    }

    console.log("\nDifficulty distribution:");
    for (const [d, c] of Object.entries(difficultyCounts).sort((a, b) => Number(a[0]) - Number(b[0]))) {
      console.log(`  Level ${d}: ${c}`);
    }

    console.log(`\nMock exam eligible: ${mockEligible}`);

    const existingResult = await pool.query(
      `SELECT COUNT(*) FROM exam_questions WHERE exam = $1 AND country_code = $2`,
      [examSet.config.exam, examSet.config.countryCode]
    );
    const existingCount = parseInt(existingResult.rows[0].count);

    if (existingCount > 0) {
      console.log(`\n${existingCount} existing questions found for ${examSet.name}. Archiving...`);
      await pool.query(
        `UPDATE exam_questions SET status = 'archived' WHERE exam = $1 AND country_code = $2 AND status != 'archived'`,
        [examSet.config.exam, examSet.config.countryCode]
      );
    }

    console.log(`\nInserting ${examSet.questions.length} questions...`);
    let inserted = 0;
    let errors = 0;

    for (let i = 0; i < examSet.questions.length; i++) {
      const q = examSet.questions[i];
      try {
        await pool.query(
          `INSERT INTO exam_questions (
            id, tier, exam, question_type, status, stem, options, correct_answer,
            rationale, difficulty, body_system, topic, country_code, licensing_body,
            language_code, cognitive_level, question_format, lab_unit_variant,
            medication_naming_variant, region_scope, is_mock_exam_eligible,
            is_adaptive_eligible, career_type, domain, tags, created_at, updated_at
          ) VALUES (
            gen_random_uuid(), $1, $2, $3, 'published', $4, $5, $6,
            $7, $8, $9, $10, $11, $12,
            'en', $13, 'MCQ', $14,
            $15, $16, $17,
            true, 'nursing', $18, $19, NOW(), NOW()
          )`,
          [
            examSet.config.tier,
            examSet.config.exam,
            q.questionType,
            q.stem,
            JSON.stringify(q.options),
            JSON.stringify([q.correctAnswer]),
            q.rationale,
            q.difficulty,
            q.bodySystem,
            q.topic,
            examSet.config.countryCode,
            examSet.config.licensingBody,
            q.cognitiveLevel,
            examSet.config.labUnitVariant,
            examSet.config.medicationNamingVariant,
            examSet.config.regionScope,
            q.isMockExamEligible,
            q.domain,
            [q.domain, q.bodySystem, q.topic],
          ]
        );
        inserted++;
      } catch (err: any) {
        errors++;
        if (errors <= 5) {
          console.error(`  Error inserting question ${i + 1}: ${err.message}`);
        }
      }

      if ((i + 1) % 100 === 0) {
        console.log(`  Progress: ${i + 1}/${examSet.questions.length}`);
      }
    }

    console.log(`\n${examSet.name} Results:`);
    console.log(`  Inserted: ${inserted}`);
    console.log(`  Errors: ${errors}`);
  }

  console.log("\n\n=== Verification ===");
  const verifyResult = await pool.query(`
    SELECT exam, country_code, licensing_body, COUNT(*) as count,
           SUM(CASE WHEN is_mock_exam_eligible = true THEN 1 ELSE 0 END) as mock_eligible
    FROM exam_questions
    WHERE exam IN ('NMC-CBT', 'AHPRA-RN', 'GULF-NURSING')
      AND status = 'published'
    GROUP BY exam, country_code, licensing_body
    ORDER BY exam
  `);

  console.log("\nPublished question counts:");
  for (const row of verifyResult.rows) {
    console.log(`  ${row.exam} (${row.country_code}, ${row.licensing_body}): ${row.count} questions, ${row.mock_eligible} mock-eligible`);
  }

  console.log("\n=== International Seeding Complete ===\n");
}

seedInternationalQuestions()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
