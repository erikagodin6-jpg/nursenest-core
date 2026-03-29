import { pool } from "../server/storage";
import crypto from "crypto";

interface ClientExamQuestion {
  q: string;
  o: string[];
  a: number;
  r: string;
  s: string;
}

function hashStem(stem: string): string {
  return crypto.createHash("sha256").update(stem.trim().toLowerCase()).digest("hex").substring(0, 32);
}

const BODY_SYSTEM_TOPIC_MAP: Record<string, { topic: string; subtopic: string; tags: string[]; exam: string; regionScope: string }> = {
  "Endocrine & Metabolic": { topic: "Endocrine Disorders", subtopic: "Metabolic Management", tags: ["FNP", "AGPCNP"], exam: "AANP", regionScope: "BOTH" },
  "Family Medicine Primary Care": { topic: "Primary Care", subtopic: "Health Promotion & Screening", tags: ["FNP"], exam: "AANP", regionScope: "BOTH" },
  "Cardiovascular": { topic: "Cardiovascular Disorders", subtopic: "Cardiac Management", tags: ["FNP", "AGPCNP", "AGACNP"], exam: "AANP", regionScope: "BOTH" },
  "GI & Hepatology": { topic: "Gastrointestinal Disorders", subtopic: "GI Management", tags: ["FNP", "AGPCNP"], exam: "AANP", regionScope: "BOTH" },
  "Musculoskeletal": { topic: "Musculoskeletal Disorders", subtopic: "Orthopedic Management", tags: ["FNP", "AGPCNP"], exam: "AANP", regionScope: "BOTH" },
  "Pharmacology": { topic: "Pharmacotherapeutics", subtopic: "Prescribing & Drug Management", tags: ["FNP", "AGPCNP"], exam: "AANP", regionScope: "BOTH" },
  "Neurological": { topic: "Neurological Disorders", subtopic: "Neurologic Management", tags: ["FNP", "AGPCNP"], exam: "AANP", regionScope: "BOTH" },
  "Respiratory": { topic: "Respiratory Disorders", subtopic: "Pulmonary Management", tags: ["FNP", "AGPCNP"], exam: "AANP", regionScope: "BOTH" },
  "Hematology & Oncology": { topic: "Hematologic Disorders", subtopic: "Hematology & Oncology", tags: ["FNP", "AGPCNP"], exam: "AANP", regionScope: "BOTH" },
  "Renal & Nephrology": { topic: "Renal Disorders", subtopic: "Nephrology Management", tags: ["FNP", "AGPCNP"], exam: "AANP", regionScope: "BOTH" },
  "Infectious Disease": { topic: "Infectious Disease", subtopic: "Infection Management", tags: ["FNP", "AGPCNP"], exam: "AANP", regionScope: "BOTH" },
  "Geriatric Medicine": { topic: "Geriatric Medicine", subtopic: "Geriatric Assessment & Management", tags: ["AGPCNP"], exam: "AANP", regionScope: "BOTH" },
  "Critical Care Advanced": { topic: "Acute Care Management", subtopic: "Critical Care & ICU", tags: ["AGACNP"], exam: "ANCC", regionScope: "BOTH" },
  "Dermatology": { topic: "Dermatologic Disorders", subtopic: "Skin Management", tags: ["FNP"], exam: "AANP", regionScope: "BOTH" },
  "Psychiatry & Mental Health": { topic: "Psychiatric Disorders", subtopic: "Mental Health Management", tags: ["PMHNP"], exam: "ANCC", regionScope: "BOTH" },
  "Women's Health & Gynecology": { topic: "Women's Health", subtopic: "Gynecology & Reproductive Health", tags: ["WHNP", "FNP"], exam: "AANP", regionScope: "BOTH" },
  "Neonatal": { topic: "Neonatal Medicine", subtopic: "NICU & Neonatal Care", tags: ["NNP"], exam: "ANCC", regionScope: "BOTH" },
  "Pain Management": { topic: "Pain Management", subtopic: "Chronic Pain", tags: ["FNP", "AGPCNP"], exam: "AANP", regionScope: "BOTH" },
};

function getDifficulty(questionIndex: number, totalInBatch: number): number {
  const position = questionIndex / totalInBatch;
  if (position < 0.2) return Math.random() < 0.5 ? 1 : 2;
  if (position < 0.7) return 3;
  return Math.random() < 0.5 ? 4 : 5;
}

function generateClinicalPearl(bodySystem: string, stem: string): string {
  const pearls: Record<string, string[]> = {
    "Cardiovascular": [
      "Always assess for orthostatic hypotension in elderly patients on antihypertensives.",
      "In HFrEF, all four pillars of GDMT should be initiated and titrated to target doses.",
      "Troponin trends are more informative than single values for ACS diagnosis.",
    ],
    "Endocrine & Metabolic": [
      "Levothyroxine absorption is affected by calcium, iron, and PPIs — counsel on timing.",
      "SGLT2 inhibitors provide cardiorenal protection independent of glycemic effects.",
      "Always check morning cortisol and ACTH simultaneously for adrenal evaluation.",
    ],
    "Respiratory": [
      "COPD exacerbation treatment: bronchodilators + systemic steroids + antibiotics if purulent sputum.",
      "In asthma, step up therapy only after confirming medication adherence and inhaler technique.",
      "Low-dose CT for lung cancer screening: 50-80 years, ≥20 pack-years, current or quit <15 years.",
    ],
    "Pharmacology": [
      "Always check drug interactions before prescribing — especially CYP3A4 and CYP2D6 substrates.",
      "Start low, go slow in elderly patients to minimize adverse drug reactions.",
      "Black box warnings require explicit patient counseling and documentation.",
    ],
    "GI & Hepatology": [
      "All patients with cirrhosis need HCC screening with ultrasound and AFP every 6 months.",
      "H. pylori test-and-treat is recommended before long-term PPI therapy.",
      "Direct-acting antivirals have revolutionized HCV treatment with >95% cure rates.",
    ],
    "Neurological": [
      "Time is brain — every minute of delay in stroke treatment equals 1.9 million neurons lost.",
      "Always give thiamine BEFORE glucose in suspected Wernicke encephalopathy.",
      "Medication overuse headache is the most common cause of chronic daily headache transformation.",
    ],
    "Musculoskeletal": [
      "Methotrexate is the anchor DMARD for RA — always co-prescribe folic acid.",
      "Bisphosphonate drug holidays should be considered after 5 years of oral therapy.",
      "In gout, never start or stop urate-lowering therapy during an acute flare.",
    ],
    "Geriatric Medicine": [
      "Review Beers Criteria at every visit for elderly patients to reduce polypharmacy.",
      "Delirium is always a medical emergency — search for underlying causes.",
      "Fall risk assessment should be performed at every geriatric visit.",
    ],
    "Psychiatry & Mental Health": [
      "Fluoxetine is the only FDA-approved SSRI for both adolescent depression and bulimia nervosa.",
      "Long-acting injectable antipsychotics dramatically improve adherence in schizophrenia.",
      "Always assess suicide risk with standardized tools at every psychiatric encounter.",
    ],
    "Women's Health & Gynecology": [
      "Migraine with aura is an absolute contraindication to estrogen-containing contraceptives.",
      "Vaginal estrogen is the most effective treatment for genitourinary syndrome of menopause.",
      "Endometrial biopsy is mandatory for postmenopausal bleeding.",
    ],
    "Neonatal": [
      "Caffeine citrate reduces apnea, BPD, and improves neurodevelopmental outcomes in premature infants.",
      "Human milk significantly reduces NEC risk compared to formula in premature infants.",
      "Always give thiamine before dextrose, and surfactant before CPAP for RDS.",
    ],
    "Renal & Nephrology": [
      "SGLT2 inhibitors and finerenone both slow diabetic kidney disease progression.",
      "Testicular torsion is a surgical emergency — salvage rates drop after 6 hours.",
      "Metabolic acidosis in CKD accelerates disease progression — treat with oral bicarbonate.",
    ],
    "Hematology & Oncology": [
      "Tumor lysis syndrome can be fatal — anticipate it in high-tumor-burden malignancies.",
      "Iron deficiency is the most common cause of microcytic anemia worldwide.",
      "B12 deficiency can cause irreversible neurologic damage if masked by folate supplementation.",
    ],
    "Critical Care Advanced": [
      "Prone positioning for >16 hours/day reduces mortality in severe ARDS.",
      "Stress-dose hydrocortisone improves outcomes in vasopressor-refractory septic shock.",
      "Targeted temperature management improves neurological outcomes post-cardiac arrest.",
    ],
    "Infectious Disease": [
      "Always include tenofovir in ART for HIV/HBV coinfection.",
      "Clindamycin suppresses toxin production in invasive Group A Strep infections.",
      "In neonatal sepsis, obtain blood cultures before starting empiric antibiotics.",
    ],
    "Family Medicine Primary Care": [
      "Family history of CRC before age 60 requires screening 10 years before the relative's diagnosis age.",
      "The Diabetes Prevention Program showed lifestyle modification reduces T2DM risk by 58%.",
      "Evidence-based vaccine counseling is more effective than dismissing vaccine-hesitant families.",
    ],
  };

  const systemPearls = pearls[bodySystem] || pearls["Pharmacology"]!;
  return systemPearls[Math.floor(Math.random() * systemPearls.length)];
}

function generateExamStrategy(bodySystem: string): string {
  const strategies: string[] = [
    "Read the stem carefully for key clinical findings before looking at options. Eliminate clearly wrong answers first.",
    "Identify the most life-threatening condition first — exam questions often test recognition of emergencies.",
    "Look for age, gender, and risk factor clues in the stem that narrow the differential diagnosis.",
    "When two options seem correct, choose the one that is most evidence-based and guideline-supported.",
    "For medication questions, consider the mechanism of action and match it to the patient's specific condition and comorbidities.",
    "Pay attention to temporal relationships — acute vs. chronic presentation changes the answer significantly.",
    "First-line treatment questions require knowledge of current clinical practice guidelines (AHA, ADA, ACOG, etc.).",
    "When the stem includes lab values, interpret them in the clinical context before selecting an answer.",
    "For management questions, prioritize the most urgent or life-saving intervention.",
    "Remember: the correct answer addresses the underlying cause, not just the symptoms.",
  ];
  return strategies[Math.floor(Math.random() * strategies.length)];
}

function generateDistractorRationales(options: string[], correctIdx: number, rationale: string): Record<string, string> {
  const result: Record<string, string> = {};
  const letters = ["A", "B", "C", "D"];
  for (let i = 0; i < options.length; i++) {
    if (i === correctIdx) {
      result[letters[i]] = "Correct. " + rationale.substring(0, 200);
    } else {
      result[letters[i]] = `Incorrect. ${options[i]} is not the best answer in this clinical scenario. See rationale for detailed explanation.`;
    }
  }
  return result;
}

async function insertEnrichedBatch(questions: ClientExamQuestion[], batchName: string) {
  let inserted = 0;
  let skipped = 0;

  for (let idx = 0; idx < questions.length; idx++) {
    const q = questions[idx];
    const contentHash = hashStem(q.q);
    const existing = await pool.query("SELECT id FROM exam_questions WHERE stem_hash = $1", [contentHash]);
    if (existing.rows.length > 0) {
      skipped++;
      continue;
    }

    const mapping = BODY_SYSTEM_TOPIC_MAP[q.s] || {
      topic: "General NP Practice",
      subtopic: "Clinical Management",
      tags: ["FNP"],
      exam: "AANP",
      regionScope: "BOTH",
    };

    const difficulty = getDifficulty(idx, questions.length);
    const clinicalPearl = generateClinicalPearl(q.s, q.q);
    const examStrategy = generateExamStrategy(q.s);
    const distractorRationales = generateDistractorRationales(q.o, q.a, q.r);

    await pool.query(
      `INSERT INTO exam_questions (
        tier, exam, question_type, status, stem, options, correct_answer,
        rationale, body_system, topic, subtopic, difficulty, tags,
        region_scope, stem_hash, clinical_pearl, exam_strategy,
        distractor_rationales, career_type
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13,
        $14, $15, $16, $17,
        $18, $19
      )`,
      [
        "np",
        mapping.exam,
        "mcq",
        "published",
        q.q,
        JSON.stringify(q.o),
        JSON.stringify([q.a]),
        q.r,
        q.s,
        mapping.topic,
        mapping.subtopic,
        difficulty,
        mapping.tags,
        mapping.regionScope,
        contentHash,
        clinicalPearl,
        examStrategy,
        JSON.stringify(distractorRationales),
        "nursing",
      ]
    );
    inserted++;
  }

  return { inserted, skipped };
}

const BATCH_FILES = [
  { file: "np-exam-batch-57", exportName: "npExamBatch57Questions" },
  { file: "np-exam-batch-58", exportName: "npExamBatch58Questions" },
  { file: "np-exam-batch-59", exportName: "npExamBatch59Questions" },
  { file: "np-exam-batch-60", exportName: "npExamBatch60Questions" },
  { file: "np-exam-batch-61", exportName: "npExamBatch61Questions" },
  { file: "np-exam-batch-62", exportName: "npExamBatch62Questions" },
];

async function main() {
  console.log("=== NP Exam Questions Insertion (Batches 57-62) ===\n");

  const beforeCount = await pool.query("SELECT COUNT(*) FROM exam_questions WHERE tier = 'np'");
  console.log(`NP questions before insertion: ${beforeCount.rows[0].count}`);

  let totalInserted = 0;
  let totalSkipped = 0;

  for (const entry of BATCH_FILES) {
    try {
      const mod = await import(`../client/src/data/exam-questions/${entry.file}.ts`);
      const questions: ClientExamQuestion[] = mod[entry.exportName];
      if (!questions || !Array.isArray(questions)) {
        console.log(`SKIP ${entry.file}: export ${entry.exportName} not found`);
        continue;
      }
      const { inserted, skipped } = await insertEnrichedBatch(questions, entry.file);
      totalInserted += inserted;
      totalSkipped += skipped;
      console.log(`${entry.file}: ${inserted} inserted, ${skipped} skipped (${questions.length} total)`);
    } catch (e: any) {
      console.error(`ERROR ${entry.file}: ${e.message}`);
    }
  }

  console.log(`\n--- Insertion Summary ---`);
  console.log(`Total inserted: ${totalInserted}`);
  console.log(`Total skipped (duplicates): ${totalSkipped}`);

  const afterCount = await pool.query("SELECT COUNT(*) FROM exam_questions WHERE tier = 'np'");
  console.log(`\nNP questions after insertion: ${afterCount.rows[0].count}`);

  const activeCount = await pool.query("SELECT COUNT(*) FROM exam_questions WHERE tier = 'np' AND status = 'active'");
  console.log(`NP questions with status 'active': ${activeCount.rows[0].count}`);

  const byBodySystem = await pool.query(
    "SELECT body_system, COUNT(*) as cnt FROM exam_questions WHERE tier = 'np' AND status = 'active' GROUP BY body_system ORDER BY cnt DESC"
  );
  console.log(`\nActive NP questions by body system:`);
  for (const row of byBodySystem.rows) {
    console.log(`  ${row.body_system}: ${row.cnt}`);
  }

  const byTags = await pool.query(
    `SELECT unnest(tags) as tag, COUNT(*) as cnt FROM exam_questions WHERE tier = 'np' AND status = 'active' AND tags IS NOT NULL GROUP BY tag ORDER BY cnt DESC`
  );
  console.log(`\nActive NP questions by tag:`);
  for (const row of byTags.rows) {
    console.log(`  ${row.tag}: ${row.cnt}`);
  }

  const byDifficulty = await pool.query(
    "SELECT difficulty, COUNT(*) as cnt FROM exam_questions WHERE tier = 'np' AND status = 'active' GROUP BY difficulty ORDER BY difficulty"
  );
  console.log(`\nActive NP questions by difficulty:`);
  for (const row of byDifficulty.rows) {
    console.log(`  Difficulty ${row.difficulty}: ${row.cnt}`);
  }

  const totalAll = await pool.query("SELECT tier, COUNT(*) as cnt FROM exam_questions GROUP BY tier ORDER BY tier");
  console.log(`\nTotal questions by tier (all statuses):`);
  for (const row of totalAll.rows) {
    console.log(`  ${row.tier}: ${row.cnt}`);
  }

  await pool.end();
  console.log("\n=== Insertion complete ===");
}

main().catch((e) => {
  console.error("Insertion failed:", e);
  process.exit(1);
});
