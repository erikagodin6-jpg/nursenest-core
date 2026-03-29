import { pool } from "../server/storage";
import crypto from "crypto";

interface ClientExamQuestion {
  q: string;
  o: string[];
  a: number;
  ca?: number[];
  co?: number[];
  cv?: string;
  hc?: string;
  ht?: string;
  r: string;
  t?: string;
  s: string;
  dr?: string[];
}

interface ClientBowtieQuestion {
  id: string;
  scenario: string;
  centerOptions: string[];
  centerCorrect: number;
  leftFindings: string[];
  leftCorrect: number[];
  leftSelectCount: number;
  rightActions: string[];
  rightCorrect: number[];
  rightSelectCount: number;
  rationale: { condition: string; findings: string; actions: string };
  bodySystem: string;
  tier: string;
}

function hashStem(stem: string): string {
  return crypto.createHash("sha256").update(stem.trim().toLowerCase()).digest("hex").substring(0, 32);
}

async function insertBatch(questions: ClientExamQuestion[], tier: string, sourceFile: string, exam: string) {
  let inserted = 0;
  let skipped = 0;

  for (const q of questions) {
    const contentHash = hashStem(q.q);
    const existing = await pool.query("SELECT id FROM exam_questions WHERE stem_hash = $1", [contentHash]);
    if (existing.rows.length > 0) {
      skipped++;
      continue;
    }

    await pool.query(
      `INSERT INTO exam_questions (tier, exam, question_type, status, stem, options, correct_answer, rationale, body_system, stem_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        tier,
        exam,
        q.t || "multiple_choice",
        "published",
        q.q,
        JSON.stringify(q.o),
        JSON.stringify(q.ca ? q.ca : [q.a]),
        q.r,
        q.s,
        contentHash,
      ]
    );
    inserted++;
  }

  return { inserted, skipped };
}

async function insertBowtieBatch(questions: ClientBowtieQuestion[], tier: string, sourceFile: string, exam: string) {
  let inserted = 0;
  let skipped = 0;

  for (const q of questions) {
    const contentHash = hashStem(q.scenario);
    const existing = await pool.query("SELECT id FROM exam_questions WHERE stem_hash = $1", [contentHash]);
    if (existing.rows.length > 0) {
      skipped++;
      continue;
    }

    const options = JSON.stringify({
      centerOptions: q.centerOptions,
      leftFindings: q.leftFindings,
      rightActions: q.rightActions,
    });

    const correctAnswer = JSON.stringify({
      centerCorrect: q.centerCorrect,
      leftCorrect: q.leftCorrect,
      leftSelectCount: q.leftSelectCount,
      rightCorrect: q.rightCorrect,
      rightSelectCount: q.rightSelectCount,
    });

    const rationale = `Condition: ${q.rationale.condition}\nFindings: ${q.rationale.findings}\nActions: ${q.rationale.actions}`;

    await pool.query(
      `INSERT INTO exam_questions (tier, exam, question_type, status, stem, options, correct_answer, rationale, body_system, stem_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        tier,
        exam,
        "bowtie",
        "published",
        q.scenario,
        options,
        correctAnswer,
        rationale,
        q.bodySystem,
        contentHash,
      ]
    );
    inserted++;
  }

  return { inserted, skipped };
}

const BOWTIE_FILES: { file: string; tier: string; exam: string; exportName: string }[] = [
  { file: "rpn-bowtie-batch-02", tier: "rpn", exam: "REX-PN", exportName: "rpnBowtieBatch02Questions" },
  { file: "pn-us-bowtie-01", tier: "rpn", exam: "NCLEX-PN", exportName: "pnUsBowtieBatch01Questions" },
];

const QUESTION_FILES: { file: string; tier: string; exam: string; exportName: string }[] = [
  { file: "rpn-cardiovascular", tier: "rpn", exam: "REX-PN", exportName: "rpnCardiovascularQuestions" },
  { file: "rpn-respiratory", tier: "rpn", exam: "REX-PN", exportName: "rpnRespiratoryQuestions" },
  { file: "rpn-neuro-gi-endo", tier: "rpn", exam: "REX-PN", exportName: "rpnNeuroGiEndoQuestions" },
  { file: "rpn-peds-heme-pharm", tier: "rpn", exam: "REX-PN", exportName: "rpnPedsHemePharmQuestions" },
  { file: "rpn-expansion-a", tier: "rpn", exam: "REX-PN", exportName: "rpnExpansionAQuestions" },
  { file: "rpn-expansion-b", tier: "rpn", exam: "REX-PN", exportName: "rpnExpansionBQuestions" },
  { file: "rpn-expansion-c", tier: "rpn", exam: "REX-PN", exportName: "rpnExpansionCQuestions" },
  { file: "rn-medsurg", tier: "rn", exam: "NCLEX-RN", exportName: "rnMedsurgQuestions" },
  { file: "rn-pharmacology", tier: "rn", exam: "NCLEX-RN", exportName: "rnPharmacologyQuestions" },
  { file: "rn-expansion-a", tier: "rn", exam: "NCLEX-RN", exportName: "rnExpansionAQuestions" },
  { file: "rn-expansion-b", tier: "rn", exam: "NCLEX-RN", exportName: "rnExpansionBQuestions" },
  { file: "np-pharmacology", tier: "np", exam: "AANP", exportName: "npPharmacologyQuestions" },
  { file: "np-clinical-management", tier: "np", exam: "AANP", exportName: "npClinicalManagementQuestions" },
  { file: "np-expansion-a", tier: "np", exam: "AANP", exportName: "npExpansionAQuestions" },
  { file: "rpn-expansion-d", tier: "rpn", exam: "REX-PN", exportName: "rpnExpansionDQuestions" },
  { file: "rpn-expansion-e", tier: "rpn", exam: "REX-PN", exportName: "rpnExpansionEQuestions" },
  { file: "rn-expansion-c", tier: "rn", exam: "NCLEX-RN", exportName: "rnExpansionCQuestions" },
  { file: "rn-expansion-d", tier: "rn", exam: "NCLEX-RN", exportName: "rnExpansionDQuestions" },
  { file: "np-expansion-b", tier: "np", exam: "AANP", exportName: "npExpansionBQuestions" },
];

QUESTION_FILES.push({
  file: "rn-expanded-batch",
  tier: "rn",
  exam: "NCLEX-RN",
  exportName: "rnExpandedBatchQuestions",
});

QUESTION_FILES.push({ file: "rpn-expansion-f", tier: "rpn", exam: "REX-PN", exportName: "rpnExpansionFQuestions" });
QUESTION_FILES.push({ file: "rn-expansion-e", tier: "rn", exam: "NCLEX-RN", exportName: "rnExpansionEQuestions" });
QUESTION_FILES.push({ file: "np-expansion-c", tier: "np", exam: "AANP", exportName: "npExpansionCQuestions" });
QUESTION_FILES.push({ file: "pn-us-batch-01", tier: "rpn", exam: "NCLEX-PN", exportName: "pnUsBatch01Questions" });
QUESTION_FILES.push({ file: "rn-us-batch-01", tier: "rn", exam: "NCLEX-RN", exportName: "rnUsBatch01Questions" });
QUESTION_FILES.push({ file: "np-us-batch-01", tier: "np", exam: "AANP", exportName: "npUsBatch01Questions" });

QUESTION_FILES.push({ file: "rpn-cases-01", tier: "rpn", exam: "REX-PN", exportName: "rpnCases01Questions" });
QUESTION_FILES.push({ file: "rn-cases-01", tier: "rn", exam: "NCLEX-RN", exportName: "rnCases01Questions" });
QUESTION_FILES.push({ file: "np-cases-01", tier: "np", exam: "AANP", exportName: "npCases01Questions" });
QUESTION_FILES.push({ file: "cnple-batch-01", tier: "np", exam: "CNPLE", exportName: "cnpleBatch01Questions" });
QUESTION_FILES.push({ file: "cnple-batch-02", tier: "np", exam: "CNPLE", exportName: "cnpleBatch02Questions" });
QUESTION_FILES.push({ file: "cnple-batch-03", tier: "np", exam: "CNPLE", exportName: "cnpleBatch03Questions" });
QUESTION_FILES.push({ file: "us-cases-01", tier: "rn", exam: "NCLEX-RN", exportName: "usCases01Questions" });
QUESTION_FILES.push({ file: "rn-expansion-f", tier: "rn", exam: "NCLEX-RN", exportName: "rnExpansionFQuestions" });
QUESTION_FILES.push({ file: "rn-expansion-g", tier: "rn", exam: "NCLEX-RN", exportName: "rnExpansionGQuestions" });
QUESTION_FILES.push({ file: "rn-expansion-h", tier: "rn", exam: "NCLEX-RN", exportName: "rnExpansionHQuestions" });
QUESTION_FILES.push({ file: "rpn-expansion-g", tier: "rpn", exam: "REX-PN", exportName: "rpnExpansionGQuestions" });
QUESTION_FILES.push({ file: "np-expansion-d", tier: "np", exam: "AANP", exportName: "npExpansionDQuestions" });
QUESTION_FILES.push({ file: "rn-expansion-i", tier: "rn", exam: "NCLEX-RN", exportName: "rnExpansionIQuestions" });
QUESTION_FILES.push({ file: "rpn-expansion-h", tier: "rpn", exam: "REX-PN", exportName: "rpnExpansionHQuestions" });
QUESTION_FILES.push({ file: "np-expansion-e", tier: "np", exam: "AANP", exportName: "npExpansionEQuestions" });
QUESTION_FILES.push({ file: "rpn-expansion-i", tier: "rpn", exam: "REX-PN", exportName: "rpnExpansionIQuestions" });
QUESTION_FILES.push({ file: "pn-us-batch-02", tier: "rpn", exam: "NCLEX-PN", exportName: "pnUsBatch02Questions" });
QUESTION_FILES.push({ file: "rn-infectious-disease-testbank", tier: "rn", exam: "NCLEX-RN", exportName: "rnInfectiousDiseaseTestbankQuestions" });
QUESTION_FILES.push({ file: "rn-infectious-disease-cat", tier: "rn", exam: "NCLEX-RN", exportName: "rnInfectiousDiseaseCatQuestions" });
QUESTION_FILES.push({ file: "rn-patho-cardio-neuro", tier: "rn", exam: "NCLEX-RN", exportName: "rnPathoCardioNeuroQuestions" });
QUESTION_FILES.push({ file: "rn-patho-cardio-neuro-cat", tier: "rn", exam: "NCLEX-RN", exportName: "rnPathoCardioNeuroCatQuestions" });
QUESTION_FILES.push({ file: "np-cat-expansion-2", tier: "np", exam: "AANP", exportName: "npCatExpansion2Questions" });
QUESTION_FILES.push({ file: "rn-shock-critical-testbank", tier: "rn", exam: "NCLEX-RN", exportName: "rnShockCriticalTestbankQuestions" });
QUESTION_FILES.push({ file: "rn-shock-critical-cat", tier: "rn", exam: "NCLEX-RN", exportName: "rnShockCriticalCatQuestions" });
QUESTION_FILES.push({ file: "rn-arrhythmias-chd-anticoag-testbank", tier: "rn", exam: "NCLEX-RN", exportName: "rnArrhythmiasChdAnticoagTestbankQuestions" });
QUESTION_FILES.push({ file: "rn-arrhythmias-chd-anticoag-cat", tier: "rn", exam: "NCLEX-RN", exportName: "rnArrhythmiasChdAnticoagCatQuestions" });

QUESTION_FILES.push({ file: "rn-resp-renal-bank", tier: "rn", exam: "NCLEX-RN", exportName: "rnRespRenalBankQuestions" });
QUESTION_FILES.push({ file: "rn-resp-renal-cat", tier: "rn", exam: "NCLEX-RN", exportName: "rnRespRenalCatQuestions" });
QUESTION_FILES.push({ file: "rn-resp-renal-bank-batch2", tier: "rn", exam: "NCLEX-RN", exportName: "rnRespRenalBankBatch2" });
QUESTION_FILES.push({ file: "rn-resp-renal-cat-batch2", tier: "rn", exam: "NCLEX-RN", exportName: "rnRespRenalCatBatch2" });

for (let i = 1; i <= 81; i++) {
  const pad = String(i).padStart(2, "0");
  QUESTION_FILES.push({
    file: `np-exam-batch-${pad}`,
    tier: "np",
    exam: "AANP",
    exportName: `npExamBatch${pad}Questions`,
  });
}

QUESTION_FILES.push({ file: "np-cat-adaptive-01", tier: "np", exam: "AANP", exportName: "npCatAdaptiveBatch01Questions" });

async function main() {
  console.log("Starting question migration...");

  await pool.query(`
    ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS stem_hash TEXT;
    CREATE INDEX IF NOT EXISTS idx_exam_questions_stem_hash ON exam_questions(stem_hash);
    CREATE INDEX IF NOT EXISTS idx_exam_questions_tier ON exam_questions(tier);
  `);

  const existingCount = await pool.query("SELECT COUNT(*) FROM exam_questions");
  console.log(`Existing questions in DB: ${existingCount.rows[0].count}`);

  let totalInserted = 0;
  let totalSkipped = 0;

  for (const entry of QUESTION_FILES) {
    try {
      const mod = await import(`../client/src/data/exam-questions/${entry.file}.ts`);
      const questions: ClientExamQuestion[] = mod[entry.exportName];
      if (!questions || !Array.isArray(questions)) {
        console.log(`SKIP ${entry.file}: export ${entry.exportName} not found`);
        continue;
      }
      const { inserted, skipped } = await insertBatch(questions, entry.tier, entry.file, entry.exam);
      totalInserted += inserted;
      totalSkipped += skipped;
      console.log(`${entry.file}: ${inserted} inserted, ${skipped} skipped (${questions.length} total)`);
    } catch (e: any) {
      console.error(`ERROR ${entry.file}: ${e.message}`);
    }
  }

  for (const entry of BOWTIE_FILES) {
    try {
      const mod = await import(`../client/src/data/exam-questions/${entry.file}.ts`);
      const questions: ClientBowtieQuestion[] = mod[entry.exportName];
      if (!questions || !Array.isArray(questions)) {
        console.log(`SKIP ${entry.file}: export ${entry.exportName} not found`);
        continue;
      }
      const { inserted, skipped } = await insertBowtieBatch(questions, entry.tier, entry.file, entry.exam);
      totalInserted += inserted;
      totalSkipped += skipped;
      console.log(`${entry.file}: ${inserted} inserted, ${skipped} skipped (${questions.length} total)`);
    } catch (e: any) {
      console.error(`ERROR ${entry.file}: ${e.message}`);
    }
  }

  const finalCount = await pool.query("SELECT tier, COUNT(*) as cnt FROM exam_questions GROUP BY tier ORDER BY tier");
  console.log("\nFinal counts by tier:");
  for (const row of finalCount.rows) {
    console.log(`  ${row.tier}: ${row.cnt}`);
  }
  console.log(`\nMigration complete: ${totalInserted} inserted, ${totalSkipped} skipped`);

  await pool.end();
}

main().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
