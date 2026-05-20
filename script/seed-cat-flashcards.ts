import pg from "pg";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new pg.Pool({ connectionString: process.env.PROD_DATABASE_URL || process.env.DATABASE_URL });

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 80);
}

function uuid(): string {
  return crypto.randomUUID();
}

const IMAGE_TOPIC_MAP: Record<string, string[]> = {
  abo: ["ABO Blood Type", "Blood Type", "Transfusion"],
  acromegaly: ["Acromegaly", "Growth Hormone"],
  acutedystonicreaction: ["Dystonic Reaction", "Antipsychotic"],
  acutehemolyticreaction: ["Hemolytic Reaction", "Transfusion Reaction"],
  acutepaintransfusionreaction: ["Pain Transfusion", "Transfusion Reaction"],
  adrenalgland: ["Adrenal", "Addison", "Cushing", "Endocrine"],
  airembolism: ["Air Embolism", "IV Complication"],
  allergictransfusionreaction: ["Allergic Transfusion", "Transfusion Reaction"],
  alopecia: ["Alopecia", "Hair Loss", "Chemotherapy"],
  alzheimers: ["Alzheimer", "Dementia"],
  analfissure: ["Anal Fissure"],
  anaphylactictransfusion: ["Anaphylactic", "Transfusion Reaction"],
  anthrax: ["Anthrax", "Bioterrorism"],
  "aorticaneurysm_": ["Aortic Aneurysm", "AAA"],
  aplasticanemia: ["Aplastic Anemia"],
  appendicitis: ["Appendicitis"],
  atopicdermatitis: ["Atopic Dermatitis", "Eczema"],
  barrettesophagus: ["Barrett", "Esophagus", "GERD"],
  beckstriad: ["Beck's Triad", "Cardiac Tamponade"],
  bellspalsy: ["Bell's Palsy", "Facial Nerve"],
  biliaryatresia: ["Biliary Atresia"],
  bowelobstruction: ["Bowel Obstruction", "Ileus"],
  bph: ["BPH", "Benign Prostatic", "Prostate"],
  bppv: ["BPPV", "Vertigo", "Vestibular"],
  brainabscess: ["Brain Abscess"],
  buergersdisease: ["Buerger", "Thromboangiitis"],
  bullouspemphigoid: ["Bullous Pemphigoid"],
  cardiacauscultation: ["Cardiac Auscultation", "Heart Sound"],
  cardiaccycle: ["Cardiac Cycle"],
  cardiactamponade: ["Cardiac Tamponade", "Beck's Triad"],
  "cardiomyopathy_": ["Cardiomyopathy"],
  carpaltunnelsyndrome: ["Carpal Tunnel"],
  castcareandtraction: ["Cast Care", "Traction", "Fracture"],
  cbi: ["Continuous Bladder Irrigation", "CBI"],
  cdiff: ["C. diff", "Clostridium", "Clostridioides"],
  cellulitis: ["Cellulitis"],
  cerebraledema: ["Cerebral Edema", "ICP"],
  cholecystectomy: ["Cholecystectomy", "Gallbladder"],
  chronichepatitis: ["Chronic Hepatitis", "Hepatitis"],
  cirrhosis: ["Cirrhosis", "Liver"],
  clubfoot: ["Clubfoot", "Talipes"],
  compartmentsyndrome: ["Compartment Syndrome"],
  concussion: ["Concussion", "TBI"],
  conductionsystemoftheheart: ["Conduction System", "ECG", "Cardiac"],
  conjunctivitis: ["Conjunctivitis", "Pink Eye"],
  contracture: ["Contracture"],
  cranialnervepathology: ["Cranial Nerve"],
  cranialnerves: ["Cranial Nerve"],
  crohns: ["Crohn", "IBD"],
  cushings: ["Cushing", "Cortisol"],
  delayedhemolyticreaction: ["Delayed Hemolytic", "Transfusion Reaction"],
  deliriumvsdementia: ["Delirium", "Dementia"],
  developmentalhipdysplasia: ["Hip Dysplasia", "Developmental"],
  diabetes: ["Diabetes", "Glucose", "Insulin"],
  diabetesinsipidus: ["Diabetes Insipidus", "ADH"],
  diabeticnephropathy: ["Diabetic Nephropathy"],
  dic: ["DIC", "Disseminated Intravascular"],
  disuseatrophy: ["Disuse Atrophy", "Immobility"],
  diverticulitis: ["Diverticulitis", "Diverticular"],
  duchenne: ["Duchenne", "Muscular Dystrophy"],
  dysphagia: ["Dysphagia", "Swallowing"],
  dysrhythmias: ["Dysrhythmia", "Arrhythmia", "ECG"],
  electrolyteimbalances: ["Electrolyte", "Potassium", "Sodium", "Calcium"],
  endocarditis: ["Endocarditis"],
  eosinophilicesophagitis: ["Eosinophilic Esophagitis"],
  epiglottitis: ["Epiglottitis"],
  epistaxis: ["Epistaxis", "Nosebleed"],
  eriksons: ["Erikson", "Development"],
  erysipelas: ["Erysipelas"],
  erythemamarginatumrash: ["Erythema Marginatum", "Rheumatic Fever"],
  erythemamultiforme: ["Erythema Multiforme", "Stevens-Johnson"],
  fallprevention: ["Fall Prevention", "Safety"],
  fatembolismsyndrome: ["Fat Embolism", "Fracture"],
  febrileneutropenia: ["Febrile Neutropenia", "Neutropenia"],
  febrilenonhemolytic: ["Febrile Nonhemolytic", "Transfusion Reaction"],
  febrileseizures: ["Febrile Seizure", "Pediatric Seizure"],
  fetus: ["Fetus", "Fetal Development"],
  fibromyalgia: ["Fibromyalgia"],
  foreignbodyaspiration: ["Foreign Body Aspiration", "Choking"],
  fracturetypes: ["Fracture", "Orthopedic"],
  fungalinfections: ["Fungal Infection"],
  galactosemia: ["Galactosemia"],
  gerd: ["GERD", "Reflux", "Esophageal"],
  gibleed: ["GI Bleed", "Gastrointestinal Bleeding"],
  glaucoma: ["Glaucoma", "Intraocular Pressure"],
  glomerulonephritis: ["Glomerulonephritis", "Nephritic"],
  gout: ["Gout", "Uric Acid"],
  graftvshose: ["Graft vs Host", "GVHD", "Transplant"],
  graves: ["Graves", "Hyperthyroidism"],
  guillainbarre: ["Guillain-Barré", "GBS", "Ascending Paralysis"],
  hashimotothyroiditis: ["Hashimoto", "Hypothyroidism"],
  headlice: ["Head Lice", "Pediculosis"],
  hemolyticuremicsyndrome: ["Hemolytic Uremic", "HUS"],
  hemophilia: ["Hemophilia", "Clotting Factor"],
  hemorrhoids: ["Hemorrhoids"],
  hepatitis: ["Hepatitis"],
  herpessimplez: ["Herpes Simplex", "HSV"],
  hf: ["Heart Failure", "CHF"],
  hiatalhernia: ["Hiatal Hernia"],
  hidradenitis: ["Hidradenitis Suppurativa"],
  homeostasis: ["Homeostasis"],
  homeostasis2: ["Homeostasis", "Feedback"],
  hpa: ["HPA Axis", "Hypothalamic-Pituitary"],
  hydrocephalus: ["Hydrocephalus"],
  hydrostaticpressure: ["Hydrostatic Pressure", "Fluid Balance"],
  hyperparathyroidism: ["Hyperparathyroidism", "Calcium"],
  hypertension: ["Hypertension", "Blood Pressure"],
  hyperthyroidism: ["Hyperthyroidism", "Thyroid"],
  hypotensivetransfusionreaction: ["Hypotensive Transfusion", "Transfusion Reaction"],
  hypothyroidism: ["Hypothyroidism", "Thyroid"],
  hypoventilationsyndrome: ["Hypoventilation", "Obesity"],
  ibs: ["IBS", "Irritable Bowel"],
  icp: ["ICP", "Intracranial Pressure"],
  ida: ["Iron Deficiency Anemia", "IDA"],
  incentivespirometry: ["Incentive Spirometry", "Respiratory"],
  infectiveendocarditis: ["Infective Endocarditis"],
  inhaledspacers: ["Inhaler", "Spacer", "Asthma"],
  ironoverload: ["Iron Overload", "Hemochromatosis"],
  ischemiccolitis: ["Ischemic Colitis"],
  "isotonic:fluids": ["Isotonic", "IV Fluid"],
  kawasaki: ["Kawasaki", "Pediatric"],
  kidneystones: ["Kidney Stone", "Renal Calculi", "Nephrolithiasis"],
  korsakoff: ["Korsakoff", "Wernicke", "Thiamine"],
  labyrinthitis: ["Labyrinthitis", "Vestibular"],
  leftheartfailure: ["Left Heart Failure", "Pulmonary Edema"],
  lymphoma: ["Lymphoma"],
  maculardegeneration: ["Macular Degeneration"],
  malabsorption: ["Malabsorption", "Celiac"],
  malignanthyperthermia: ["Malignant Hyperthermia", "Anesthesia"],
  menieres: ["Ménière", "Meniere", "Vertigo"],
  merckeldiverticulum: ["Meckel", "Diverticulum"],
  metabolicsyndrome: ["Metabolic Syndrome"],
  mi: ["Myocardial Infarction", "MI", "Heart Attack"],
  microscopiccolitis: ["Microscopic Colitis"],
  multiplesclerosis: ["Multiple Sclerosis", "MS"],
  myastheniagravis: ["Myasthenia Gravis"],
  narcolepsy: ["Narcolepsy", "Sleep"],
  negativefeedbackloops: ["Negative Feedback", "Endocrine"],
  neurogenicbladder: ["Neurogenic Bladder"],
  nonimmunehemolysis: ["Nonimmune Hemolysis", "Transfusion"],
  obstructiveuropathy: ["Obstructive Uropathy"],
  osteoporosis: ["Osteoporosis", "Bone Density"],
  otitisexterna: ["Otitis Externa", "Swimmer's Ear"],
  oxygentherapyanddelivery: ["Oxygen Therapy", "O2 Delivery"],
  pain: ["Pain Management", "Pain Assessment"],
  pain2: ["Pain", "Analgesic"],
  pancreaticfunctioning: ["Pancreatic", "Pancreas"],
  pancreatitis: ["Pancreatitis"],
  papilledema: ["Papilledema", "ICP"],
  parkinsons: ["Parkinson", "Dopamine"],
  peakflowmonitoring: ["Peak Flow", "Asthma"],
  pediatricseizures: ["Pediatric Seizure", "Seizure"],
  pemphigus: ["Pemphigus"],
  pepticulcer: ["Peptic Ulcer", "PUD"],
  pericarditis: ["Pericarditis"],
  peripheralartertdisease2: ["Peripheral Arterial", "PAD"],
  peripheralarterydisease: ["Peripheral Arterial", "PAD"],
  peripheralarterydisease1: ["Peripheral Arterial", "PAD"],
  peripheralneuropathy: ["Peripheral Neuropathy", "Neuropathy"],
  peritonealdialysis: ["Peritoneal Dialysis"],
  pharyngitis: ["Pharyngitis", "Sore Throat"],
  pituitaryglands: ["Pituitary", "Endocrine"],
  pleurisy: ["Pleurisy", "Pleuritis"],
  pneumonia: ["Pneumonia"],
  pneumothorax: ["Pneumothorax"],
  polycystickidney: ["Polycystic Kidney", "PKD"],
  polycythemia: ["Polycythemia"],
  polydactyly: ["Polydactyly", "Congenital"],
  posttransfusionpurpura: ["Post-transfusion Purpura", "Transfusion"],
  pressureinjuries: ["Pressure Injury", "Pressure Ulcer", "Wound"],
  pressureinjurystages: ["Pressure Injury Stage", "Wound Stage"],
  pseudohypoparathyroidism: ["Pseudohypoparathyroidism"],
  pulmonaryembolism: ["Pulmonary Embolism", "PE"],
  pulmonaryfibrosis: ["Pulmonary Fibrosis"],
  ramsayhunt: ["Ramsay Hunt", "Shingles"],
  "ramsay-hunt": ["Ramsay Hunt"],
  raynauds2: ["Raynaud", "Vasospasm"],
  rectalmed: ["Rectal Medication"],
  renalarterystenosis: ["Renal Artery Stenosis"],
  renalcalculi: ["Renal Calculi", "Kidney Stone"],
  restlesslegsyndrome: ["Restless Leg", "RLS"],
  retinaldetachment: ["Retinal Detachment"],
  rheumatoidarthritis: ["Rheumatoid Arthritis", "RA"],
  rhinosinusitis: ["Rhinosinusitis", "Sinusitis"],
  ribfractures: ["Rib Fracture", "Chest Trauma"],
  rickets: ["Rickets", "Vitamin D"],
  rsv: ["RSV", "Respiratory Syncytial"],
  scabies: ["Scabies"],
  scoliosis: ["Scoliosis"],
  seizuretypes: ["Seizure", "Epilepsy"],
  septictransfusionreaction: ["Septic Transfusion", "Transfusion Reaction"],
  shingles: ["Shingles", "Herpes Zoster", "Varicella"],
  shocks: ["Shock", "Hypovolemic", "Cardiogenic", "Septic"],
  shocktypes: ["Shock Type", "Distributive"],
  shortbowel: ["Short Bowel", "Malabsorption"],
  smallpox: ["Smallpox", "Variola"],
  smallpox2: ["Smallpox"],
  spinalstenosis: ["Spinal Stenosis"],
  stomacare: ["Stoma Care", "Ostomy", "Colostomy"],
  strokefasttime: ["Stroke", "FAST", "CVA"],
  syringomyelia: ["Syringomyelia"],
  tardivedyskinesia: ["Tardive Dyskinesia", "Antipsychotic"],
  thrombocytopenia: ["Thrombocytopenia", "Platelet"],
  thyroidstorm: ["Thyroid Storm", "Thyrotoxicosis"],
  tinnitis: ["Tinnitus"],
  trali: ["TRALI", "Transfusion-Related Acute Lung"],
  transfusionassociatedhyperkalemia: ["Transfusion Hyperkalemia"],
  transfusionassociatedhypothermia: ["Transfusion Hypothermia"],
  trigeminalneuralgia: ["Trigeminal Neuralgia"],
  tuberculosis: ["Tuberculosis", "TB"],
  tularemia: ["Tularemia"],
  ulcerativecolitis: ["Ulcerative Colitis", "UC", "IBD"],
  urethralstricture: ["Urethral Stricture"],
  urinarycatheterization: ["Urinary Catheter", "Foley"],
  varicoseveins: ["Varicose Vein"],
  vestibularneuritis: ["Vestibular Neuritis"],
  viralmyocarditis: ["Viral Myocarditis", "Myocarditis"],
  vitiligo: ["Vitiligo"],
  vonwillebrand: ["Von Willebrand", "vWD"],
  wernickeencephalopathy: ["Wernicke", "Thiamine"],
  abdominalassessment: ["Abdominal Assessment"],
  abreference: ["ABG", "Arterial Blood Gas"],
  achalasia: ["Achalasia"],
  acidbase: ["Acid-Base", "pH"],
  "acid-basedisorders": ["Acid-Base Disorder"],
  als: ["ALS", "Amyotrophic Lateral Sclerosis"],
};

function findImageForTopic(topic: string, bodySystem: string, stem: string): string | null {
  const searchText = `${topic} ${bodySystem} ${stem}`.toLowerCase();

  const imageFiles = JSON.parse(fs.readFileSync("/tmp/image_map.json", "utf-8"));
  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const [imgKey, imgFile] of Object.entries(imageFiles)) {
    const keywords = IMAGE_TOPIC_MAP[imgKey] || [imgKey.replace(/[_-]/g, " ")];
    let score = 0;
    for (const kw of keywords) {
      if (searchText.includes(kw.toLowerCase())) {
        score += kw.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = imgFile as string;
    }
  }

  return bestScore >= 3 ? bestMatch : null;
}

function findLessonLink(topic: string, bodySystem: string, tier: string): { slug: string; title: string } | null {
  const lessonSlugs: { slug: string; title: string }[] = JSON.parse(
    fs.readFileSync("/tmp/lesson_slugs.json", "utf-8")
  );

  const searchTerms = `${topic} ${bodySystem}`.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  const words = searchTerms.split(/\s+/).filter((w) => w.length > 2);

  const tierSuffix = tier === "rpn" ? "-rpn" : tier === "rn" ? "-rn" : "-np";

  let bestMatch: { slug: string; title: string } | null = null;
  let bestScore = 0;

  for (const lesson of lessonSlugs) {
    const slugWords = lesson.slug.split("-");
    const titleLower = lesson.title.toLowerCase();
    let score = 0;

    for (const word of words) {
      if (slugWords.includes(word)) score += 2;
      else if (titleLower.includes(word)) score += 1;
    }

    if (lesson.slug.endsWith(tierSuffix)) score += 3;
    if (lesson.slug.includes(tier)) score += 1;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = lesson;
    }
  }

  return bestScore >= 4 ? bestMatch : null;
}

async function main() {
  console.log("Starting CAT Exam Flashcard Seed...\n");

  const catQuestions = await pool.query(`
    SELECT id, tier, exam, stem, options, correct_answer, rationale,
           body_system, topic, subtopic, difficulty, question_type
    FROM exam_questions
    WHERE exam LIKE '%CAT%' AND status = 'published'
    ORDER BY tier, body_system, topic
  `);

  console.log(`Found ${catQuestions.rows.length} CAT exam questions\n`);

  const grouped: Record<string, Record<string, any[]>> = {};
  for (const q of catQuestions.rows) {
    const tier = q.tier;
    const system = q.body_system || "General";
    if (!grouped[tier]) grouped[tier] = {};
    if (!grouped[tier][system]) grouped[tier][system] = [];
    grouped[tier][system].push(q);
  }

  const tierLabels: Record<string, string> = {
    rpn: "RPN/LVN",
    rn: "RN",
    np: "NP",
  };

  let totalDecks = 0;
  let totalCards = 0;
  let totalImages = 0;
  let totalLinks = 0;

  for (const tier of Object.keys(grouped).sort()) {
    const systems = grouped[tier];
    console.log(`\n--- Tier: ${tierLabels[tier] || tier} ---`);

    for (const system of Object.keys(systems).sort()) {
      const questions = systems[system];
      if (questions.length < 2) continue;

      const deckTitle = `${tierLabels[tier] || tier.toUpperCase()} CAT: ${system}`;
      const deckSlug = slugify(`${tier}-cat-${system}`);

      const existing = await pool.query(
        "SELECT id FROM flashcard_decks WHERE slug = $1",
        [deckSlug]
      );
      if (existing.rows.length > 0) {
        console.log(`  SKIP ${deckTitle} (already exists)`);
        continue;
      }

      const deckId = uuid();
      const deckDescription = `${questions.length} CAT exam practice flashcards covering ${system} topics for ${tierLabels[tier] || tier.toUpperCase()} nursing students. Each card includes clinical rationale, relevant images, and links to study lessons.`;

      await pool.query(
        `INSERT INTO flashcard_decks (id, owner_id, title, description, slug, tier, visibility, card_count, career_type, created_at, updated_at)
         VALUES ($1, 'system', $2, $3, $4, $5, 'public', $6, 'nursing', NOW(), NOW())`,
        [deckId, deckTitle, deckDescription, deckSlug, tier, questions.length]
      );

      let cardsInserted = 0;
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const cardId = uuid();

        let options: string[];
        try {
          options =
            typeof q.options === "string" ? JSON.parse(q.options) : q.options;
        } catch {
          options = [];
        }

        let correctAnswer: number[];
        try {
          correctAnswer =
            typeof q.correct_answer === "string"
              ? JSON.parse(q.correct_answer)
              : q.correct_answer;
        } catch {
          correctAnswer = [0];
        }
        if (!Array.isArray(correctAnswer)) correctAnswer = [correctAnswer];

        const front = q.stem;

        let back = "";
        if (Array.isArray(options) && options.length > 0 && correctAnswer.length > 0) {
          const correctTexts = correctAnswer
            .map((idx: number) => options[idx])
            .filter(Boolean);
          back = correctTexts.join("; ") || options[0] || "See rationale";
        } else {
          back = "See rationale";
        }

        let rationale = q.rationale || "";

        const image = findImageForTopic(
          q.topic || "",
          q.body_system || "",
          q.stem || ""
        );
        if (image) {
          rationale += `\n\n📷 Reference Image: ![${q.topic || system}](/attached_assets/${image})`;
          totalImages++;
        }

        const lesson = findLessonLink(
          q.topic || "",
          q.body_system || "",
          tier
        );
        if (lesson) {
          rationale += `\n\n📚 Study More: [${lesson.title}](/lessons/${lesson.slug})`;
          totalLinks++;
        }

        const difficulty =
          q.difficulty <= 2 ? "easy" : q.difficulty >= 4 ? "hard" : "medium";

        const tags = [system, q.topic, q.exam].filter(Boolean);

        await pool.query(
          `INSERT INTO deck_flashcards (id, deck_id, front, back, rationale, difficulty, tags, sort_order, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
          [
            cardId,
            deckId,
            front,
            back,
            rationale,
            difficulty,
            JSON.stringify(tags),
            i + 1,
          ]
        );
        cardsInserted++;
      }

      console.log(
        `  Created: ${deckTitle} (${cardsInserted} cards)`
      );
      totalDecks++;
      totalCards += cardsInserted;
    }
  }

  console.log("\n=== SUMMARY ===");
  console.log(`Decks created: ${totalDecks}`);
  console.log(`Cards created: ${totalCards}`);
  console.log(`Image references added: ${totalImages}`);
  console.log(`Lesson links added: ${totalLinks}`);

  const verify = await pool.query(
    "SELECT tier, COUNT(*) as cnt FROM flashcard_decks WHERE slug LIKE '%-cat-%' GROUP BY tier ORDER BY tier"
  );
  console.log("\nVerification - CAT flashcard decks by tier:");
  for (const row of verify.rows) {
    console.log(`  ${row.tier}: ${row.cnt} decks`);
  }

  await pool.end();
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
