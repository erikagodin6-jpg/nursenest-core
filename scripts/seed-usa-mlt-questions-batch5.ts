import pg from "pg";
const { Pool } = pg;

interface MltQuestion {
  stem: string;
  options: string[];
  correctAnswer: number;
  rationaleLong: string;
  blueprintCategory: string;
  subtopic: string;
  difficulty: number;
  cognitiveLevel: string;
  learningObjective: string;
}

const questions: MltQuestion[] = [
  { stem: "A patient's results show total bilirubin 8.0 mg/dL, direct bilirubin 0.5 mg/dL. The elevated indirect bilirubin is most consistent with:", options: ["Biliary obstruction", "Hemolytic anemia or Gilbert syndrome", "Hepatocellular carcinoma", "Cholestasis"], correctAnswer: 1, rationaleLong: "Indirect (unconjugated) bilirubin is elevated when production exceeds the liver's conjugation capacity (hemolytic anemia, ineffective erythropoiesis) or when conjugation is impaired (Gilbert syndrome, Crigler-Najjar). Direct bilirubin is elevated in obstructive and hepatocellular disease. In this case, indirect bilirubin is 7.5 mg/dL (8.0 - 0.5).", blueprintCategory: "Clinical Chemistry", subtopic: "Liver Function", difficulty: 3, cognitiveLevel: "analysis", learningObjective: "Differentiate conjugated vs unconjugated hyperbilirubinemia" },
  { stem: "Hereditary spherocytosis is diagnosed using which laboratory test?", options: ["Hemoglobin electrophoresis", "Osmotic fragility test (or EMA binding test)", "Iron studies", "Coombs test"], correctAnswer: 1, rationaleLong: "Hereditary spherocytosis (HS) is an autosomal dominant RBC membrane defect (spectrin, ankyrin, band 3). The osmotic fragility test shows increased fragility (spherocytes lyse at higher NaCl concentrations than normal cells). The EMA (eosin-5-maleimide) binding test by flow cytometry has largely replaced osmotic fragility due to better sensitivity and specificity.", blueprintCategory: "Hematology", subtopic: "Anemias (Iron-deficiency, Megaloblastic, Hemolytic)", difficulty: 3, cognitiveLevel: "recall", learningObjective: "Know HS diagnostic test" },
  { stem: "The reagent used for gram-negative decolorization in the Gram stain is:", options: ["Crystal violet", "Safranin", "Acetone-alcohol (decolorizer)", "Iodine (mordant)"], correctAnswer: 2, rationaleLong: "The Gram stain procedure: 1) Crystal violet (primary stain), 2) Iodine (mordant, forms CV-I complex), 3) Acetone-alcohol (decolorizer — removes CV-I from gram-negative thin peptidoglycan), 4) Safranin (counterstain — stains decolorized gram-negative cells pink/red). Gram-positive cells retain the crystal violet-iodine complex.", blueprintCategory: "Microbiology", subtopic: "Staining Techniques (Gram, AFB, India Ink)", difficulty: 1, cognitiveLevel: "recall", learningObjective: "Know Gram stain reagent functions" },
  { stem: "EDTA (lavender top tube) prevents coagulation by:", options: ["Inhibiting thrombin", "Chelating calcium ions", "Activating antithrombin", "Inhibiting platelet activation"], correctAnswer: 1, rationaleLong: "EDTA (ethylenediaminetetraacetic acid) prevents coagulation by chelating (binding) calcium ions (Factor IV), which are essential for multiple steps in the coagulation cascade. EDTA is the anticoagulant of choice for CBC because it preserves cell morphology and prevents platelet clumping. K2EDTA and K3EDTA are the two forms used.", blueprintCategory: "Hemostasis / Coagulation", subtopic: "Coagulation Cascade (Intrinsic, Extrinsic, Common)", difficulty: 1, cognitiveLevel: "recall", learningObjective: "Know EDTA mechanism of action" },
  { stem: "The Kleihauer-Betke test detects:", options: ["ABO incompatibility", "Fetal RBCs in maternal circulation", "Antibody titer", "Platelet antibodies"], correctAnswer: 1, rationaleLong: "The Kleihauer-Betke (KB) acid elution test detects fetal RBCs in maternal blood. Adult hemoglobin (HbA) is eluted by acid, leaving RBC ghosts, while fetal hemoglobin (HbF) resists acid elution and remains pink. The percentage of fetal cells is used to calculate the fetomaternal hemorrhage volume and determine the number of RhIG vials needed.", blueprintCategory: "Immunohematology / Blood Banking", subtopic: "Hemolytic Disease of the Fetus & Newborn (HDFN)", difficulty: 3, cognitiveLevel: "recall", learningObjective: "Know Kleihauer-Betke test purpose" },
  { stem: "Waxy casts in urine indicate:", options: ["Acute infection", "Chronic kidney disease / advanced renal failure", "Normal finding", "Lower urinary tract infection"], correctAnswer: 1, rationaleLong: "Waxy casts represent the final stage of cast degeneration and indicate chronic kidney disease with prolonged urinary stasis. They have a smooth, homogeneous, waxy appearance with sharp edges and cracks. They form from degenerated granular casts that remain in the tubules for extended periods, indicating severely reduced nephron function.", blueprintCategory: "Urinalysis & Body Fluids", subtopic: "Microscopic Sediment Analysis", difficulty: 3, cognitiveLevel: "recall", learningObjective: "Know waxy cast significance" },
  { stem: "Proficiency testing (PT) is required by CLIA for which purpose?", options: ["To train new employees", "To assess laboratory accuracy by testing unknown samples from an external program", "To evaluate patient satisfaction", "To determine staffing levels"], correctAnswer: 1, rationaleLong: "Proficiency testing requires laboratories to analyze unknown samples sent by an approved PT provider and report results. The results are compared to peer group values to assess analytical accuracy. Unsatisfactory PT performance (failure to achieve 80% on 2 of 3 consecutive events) can result in sanctions including loss of CLIA certification.", blueprintCategory: "Laboratory Operations & Quality Management", subtopic: "CLIA / CAP / Accreditation Canada Standards", difficulty: 2, cognitiveLevel: "recall", learningObjective: "Know proficiency testing purpose" },
  { stem: "ANA (antinuclear antibody) testing by indirect immunofluorescence on HEp-2 cells shows a homogeneous pattern. This is associated with:", options: ["Anti-centromere antibodies (limited scleroderma)", "Anti-dsDNA and anti-histone antibodies (SLE)", "Anti-nucleolar antibodies (scleroderma)", "Anti-SSA/SSB (Sjögren syndrome)"], correctAnswer: 1, rationaleLong: "A homogeneous (diffuse) ANA pattern on HEp-2 cells is associated with antibodies against dsDNA and histones, commonly seen in SLE and drug-induced lupus. The speckled pattern is associated with anti-Sm, anti-RNP, anti-SSA, anti-SSB. The centromere pattern is seen in limited scleroderma (CREST syndrome).", blueprintCategory: "Immunology / Serology", subtopic: "Autoimmune Markers (ANA, RF, Anti-dsDNA)", difficulty: 3, cognitiveLevel: "application", learningObjective: "Correlate ANA patterns with antibodies" },
  { stem: "A urine specimen turns black upon standing. This is most likely due to:", options: ["High glucose", "Alkaptonuria (homogentisic acid)", "High protein", "Normal finding"], correctAnswer: 1, rationaleLong: "Urine that turns black upon standing suggests the presence of homogentisic acid (alkaptonuria, a metabolic disorder) or melanin (melanoma). Homogentisic acid oxidizes to a black pigment when exposed to air. Alkaptonuria is caused by deficiency of homogentisic acid oxidase in the tyrosine degradation pathway.", blueprintCategory: "Urinalysis & Body Fluids", subtopic: "Physical Examination of Urine", difficulty: 4, cognitiveLevel: "application", learningObjective: "Know causes of abnormal urine color" },
  { stem: "Which of the following organisms is catalase-negative?", options: ["Staphylococcus aureus", "Streptococcus pyogenes", "Pseudomonas aeruginosa", "E. coli"], correctAnswer: 1, rationaleLong: "Streptococcus species are catalase-negative, which differentiates them from Staphylococcus species (catalase-positive). The catalase test uses 3% hydrogen peroxide; catalase-positive organisms produce bubbles (O2 gas) from H2O2 decomposition. This is one of the first tests used to differentiate gram-positive cocci.", blueprintCategory: "Microbiology", subtopic: "Biochemical Identification", difficulty: 1, cognitiveLevel: "recall", learningObjective: "Know catalase test results" },
  { stem: "Light's criteria classify a pleural effusion as an exudate if any of the following are met EXCEPT:", options: ["Fluid protein/serum protein ratio >0.5", "Fluid LDH/serum LDH ratio >0.6", "Fluid LDH >2/3 the upper limit of normal serum LDH", "Fluid glucose >100 mg/dL"], correctAnswer: 3, rationaleLong: "Light's criteria for exudate: 1) Fluid protein/serum protein >0.5, 2) Fluid LDH/serum LDH >0.6, 3) Fluid LDH > 2/3 the upper normal limit for serum. Meeting ANY ONE criterion classifies the effusion as an exudate. Fluid glucose level is not part of Light's criteria, though low glucose in a fluid suggests infection or malignancy.", blueprintCategory: "Urinalysis & Body Fluids", subtopic: "Serous Fluids (Pleural, Peritoneal, Pericardial)", difficulty: 4, cognitiveLevel: "analysis", learningObjective: "Know Light's criteria" },
  { stem: "Which of the following is a preanalytical variable that affects laboratory results?", options: ["Reagent lot change", "Algorithm error", "Patient fasting status", "Instrument calibration"], correctAnswer: 2, rationaleLong: "Preanalytical variables occur before the specimen is analyzed and include: patient fasting status, specimen collection technique, tube type, tourniquet time, patient position (supine vs. upright), medication effects, specimen transport and storage conditions, and patient identification. Preanalytical errors account for 60-70% of all laboratory errors.", blueprintCategory: "Laboratory Operations & Quality Management", subtopic: "Quality Assurance Programs", difficulty: 2, cognitiveLevel: "recall", learningObjective: "Identify preanalytical variables" },
];

async function seed() {
  const databaseUrl = process.env.PROD_DATABASE_URL || process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: databaseUrl });

  console.log(`Batch 5 — Total questions to insert: ${questions.length}`);

  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    try {
      await pool.query(
        `INSERT INTO allied_questions (
          id, career_type, stem, options, correct_answer, rationale_long,
          learning_objective, blueprint_category, subtopic, difficulty,
          cognitive_level, question_type, status, created_at
        ) VALUES (
          gen_random_uuid(), 'mlt', $1, $2, $3, $4,
          $5, $6, $7, $8,
          $9, 'mcq', 'active', NOW()
        )`,
        [
          q.stem,
          JSON.stringify(q.options),
          q.correctAnswer,
          q.rationaleLong,
          q.learningObjective,
          q.blueprintCategory,
          q.subtopic,
          q.difficulty,
          q.cognitiveLevel,
        ]
      );
      inserted++;
    } catch (e: any) {
      console.error(`Error inserting question ${i + 1}: ${e.message}`);
      errors++;
    }
  }

  console.log(`\nBatch 5 Inserted: ${inserted}, Errors: ${errors}`);

  const totalResult = await pool.query("SELECT COUNT(*) as cnt FROM allied_questions WHERE career_type ILIKE '%mlt%' AND status = 'active'");
  console.log(`\n=== FINAL Total active MLT questions in database: ${totalResult.rows[0].cnt} ===`);

  const byCat = await pool.query("SELECT blueprint_category, COUNT(*) as cnt FROM allied_questions WHERE career_type ILIKE '%mlt%' AND status = 'active' GROUP BY blueprint_category ORDER BY cnt DESC");
  console.log('\nFinal distribution by discipline:');
  byCat.rows.forEach((r: any) => console.log(`  ${r.blueprint_category}: ${r.cnt}`));

  const byDiff = await pool.query("SELECT difficulty, COUNT(*) as cnt FROM allied_questions WHERE career_type ILIKE '%mlt%' AND status = 'active' GROUP BY difficulty ORDER BY difficulty");
  console.log('\nFinal distribution by difficulty:');
  byDiff.rows.forEach((r: any) => console.log(`  Difficulty ${r.difficulty}: ${r.cnt}`));

  const byCog = await pool.query("SELECT cognitive_level, COUNT(*) as cnt FROM allied_questions WHERE career_type ILIKE '%mlt%' AND status = 'active' GROUP BY cognitive_level ORDER BY cnt DESC");
  console.log('\nFinal distribution by cognitive level:');
  byCog.rows.forEach((r: any) => console.log(`  ${r.cognitive_level}: ${r.cnt}`));

  await pool.end();
}

seed().catch(console.error);
