import pg from "pg";
import { preoperativeAssessmentLessons } from "./perioperative-data/preoperative-assessment";
import { intraoperativeCare } from "./perioperative-data/intraoperative-care";
import { postoperativeCare } from "./perioperative-data/postoperative-care";
import { sterilizationDisinfection } from "./perioperative-data/sterilization-disinfection";
import { equipmentSupplies } from "./perioperative-data/equipment-supplies";
import { emergencySituations } from "./perioperative-data/emergency-situations";
import { infectionPrevention } from "./perioperative-data/infection-prevention";
import { patientSafety } from "./perioperative-data/patient-safety";
import { professionalAccountability } from "./perioperative-data/professional-accountability";
import { managementPersonnel } from "./perioperative-data/management-personnel";
import type { PerioperativeLesson } from "./perioperative-data/types";

const { Pool } = pg;

const DOMAIN_MODULE_MAP: Record<string, string> = {
  "Preoperative Patient Assessment": "perioperative-preoperative-patient-assessment",
  "Intraoperative Care": "perioperative-intraoperative-care",
  "Postoperative Patient Care": "perioperative-postoperative-care",
  "Postoperative Care": "perioperative-postoperative-care",
  "Sterilization and Disinfection": "perioperative-sterilization-disinfection",
  "Equipment and Supplies Management": "perioperative-equipment-supplies",
  "Equipment and Supplies": "perioperative-equipment-supplies",
  "Emergency Situations": "perioperative-emergency-situations",
  "Infection Prevention and Control": "perioperative-infection-prevention",
  "Infection Prevention": "perioperative-infection-prevention",
  "Patient and Staff Safety": "perioperative-patient-safety",
  "Patient and Worker Safety": "perioperative-patient-safety",
  "Professional Accountability": "perioperative-professional-accountability",
  "Management of Personnel, Services, and Resources": "perioperative-management-personnel",
  "Management of Personnel, Services, and Materials": "perioperative-management-personnel",
};

const allLessons: PerioperativeLesson[] = [
  ...preoperativeAssessmentLessons,
  ...intraoperativeCare,
  ...postoperativeCare,
  ...sterilizationDisinfection,
  ...equipmentSupplies,
  ...emergencySituations,
  ...infectionPrevention,
  ...patientSafety,
  ...professionalAccountability,
  ...managementPersonnel,
];

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const dbCheck = await pool.query("SELECT current_database() as db, NOW() as ts");
    console.log(`Connected to database: ${dbCheck.rows[0].db}`);
  } catch (err: any) {
    console.error(`Database connection failed: ${err.message}`);
    process.exit(1);
  }

  const tableCheck = await pool.query(`
    SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'allied_lessons') AS has_lessons
  `);
  if (!tableCheck.rows[0].has_lessons) {
    console.error("Required table 'allied_lessons' not found");
    process.exit(1);
  }

  const existingCount = await pool.query(
    "SELECT COUNT(*)::int as cnt FROM allied_lessons WHERE career_type = 'perioperative'"
  );
  console.log(`Existing perioperative lessons: ${existingCount.rows[0].cnt}`);

  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < allLessons.length; i++) {
    const lesson = allLessons[i];
    const moduleId = DOMAIN_MODULE_MAP[lesson.domain] || "perioperative-general";

    try {
      const existing = await pool.query(
        "SELECT id FROM allied_lessons WHERE slug = $1 AND career_type = 'perioperative'",
        [lesson.slug]
      );

      if (existing.rows.length > 0) {
        skipped++;
        continue;
      }

      await pool.query(
        `INSERT INTO allied_lessons (module_id, career_type, slug, title, content, order_index, clinical_reasoning, common_mistakes, exam_trap_warning, checkpoint_questions, status)
         VALUES ($1, 'perioperative', $2, $3, $4, $5, $6, $7, $8, $9, 'published')`,
        [
          moduleId,
          lesson.slug,
          lesson.title,
          lesson.content,
          i + 1,
          lesson.clinicalReasoning || null,
          lesson.commonMistakes ? JSON.stringify(lesson.commonMistakes) : null,
          lesson.examTrapWarning || null,
          lesson.checkpointQuestions ? JSON.stringify(lesson.checkpointQuestions) : null,
        ]
      );
      inserted++;

      if (inserted % 10 === 0) {
        console.log(`Progress: ${inserted} inserted, ${skipped} skipped (${i + 1}/${allLessons.length})`);
      }
    } catch (err: any) {
      console.error(`Error inserting lesson "${lesson.title}": ${err.message}`);
      errors++;
    }
  }

  const finalCount = await pool.query(
    "SELECT COUNT(*)::int as cnt FROM allied_lessons WHERE career_type = 'perioperative' AND status = 'published'"
  );

  console.log(`\n=== Seed Complete ===`);
  console.log(`Total lessons in data files: ${allLessons.length}`);
  console.log(`Inserted: ${inserted}`);
  console.log(`Skipped (already existed): ${skipped}`);
  console.log(`Errors: ${errors}`);
  console.log(`Total perioperative lessons in DB: ${finalCount.rows[0].cnt}`);

  await pool.end();
}

main().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});
