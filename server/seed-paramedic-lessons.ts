import pg from "pg";
import { getProdPool } from "./db";

const SYSTEM_USER_ID = "system-nursenest";

interface LessonTopic {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  relatedSlugs: string[];
}

interface ContentBlock {
  type: string;
  text?: string;
  items?: string[] | { slug: string; title: string }[];
  questionCount?: number;
  category?: string;
}

interface LessonGenerationResult {
  seoTitle?: string;
  seoDescription?: string;
  summary?: string;
  content?: ContentBlock[];
}

interface FlashcardGenerationResult {
  cards?: { front: string; back: string; rationale?: string }[];
}

interface DbRow {
  id: string;
  slug?: string;
  category?: string;
  tags?: string[];
  content?: ContentBlock[] | string;
  topic?: string;
}

type LessonOutcome = "created" | "existing" | "error";

interface LessonResult {
  outcome: LessonOutcome;
  id: string | null;
}

const LESSON_TOPICS: LessonTopic[] = [
  { slug: "basic-airway-maneuvers-paramedic", title: "Basic Airway Maneuvers", category: "Airway Management", tags: ["airway", "head-tilt", "jaw-thrust", "oropharyngeal", "nasopharyngeal"], relatedSlugs: ["supraglottic-airways-paramedic", "endotracheal-intubation-paramedic", "airway-emergencies-paramedic"] },
  { slug: "supraglottic-airways-paramedic", title: "Supraglottic Airway Devices", category: "Airway Management", tags: ["supraglottic", "king-lt", "i-gel", "airway"], relatedSlugs: ["basic-airway-maneuvers-paramedic", "endotracheal-intubation-paramedic", "failed-airway-management-paramedic"] },
  { slug: "endotracheal-intubation-paramedic", title: "Endotracheal Intubation", category: "Airway Management", tags: ["intubation", "ETT", "laryngoscopy", "airway"], relatedSlugs: ["rapid-sequence-intubation-paramedic", "failed-airway-management-paramedic", "waveform-capnography-paramedic"] },
  { slug: "rapid-sequence-intubation-paramedic", title: "Rapid Sequence Intubation (RSI)", category: "Airway Management", tags: ["RSI", "sedation", "paralytic", "intubation"], relatedSlugs: ["endotracheal-intubation-paramedic", "sedation-pharmacology-paramedic", "failed-airway-management-paramedic"] },
  { slug: "failed-airway-management-paramedic", title: "Failed Airway Management", category: "Airway Management", tags: ["failed-airway", "cricothyrotomy", "rescue-airway"], relatedSlugs: ["endotracheal-intubation-paramedic", "supraglottic-airways-paramedic", "rapid-sequence-intubation-paramedic"] },
  { slug: "waveform-capnography-paramedic", title: "Waveform Capnography", category: "Airway Management", tags: ["capnography", "ETCO2", "monitoring", "airway-confirmation"], relatedSlugs: ["endotracheal-intubation-paramedic", "cardiac-arrest-management-paramedic", "cpap-ventilation-paramedic"] },

  { slug: "hemorrhage-control-paramedic", title: "Hemorrhage Control and Tourniquet Application", category: "Trauma", tags: ["hemorrhage", "tourniquet", "hemostatic", "bleeding-control"], relatedSlugs: ["trauma-algorithm-paramedic", "chest-trauma-paramedic", "abdominal-pelvic-trauma-paramedic"] },
  { slug: "chest-trauma-paramedic", title: "Chest Trauma Management", category: "Trauma", tags: ["chest-trauma", "pneumothorax", "hemothorax", "flail-chest"], relatedSlugs: ["pneumothorax-management-paramedic", "trauma-algorithm-paramedic", "hemorrhage-control-paramedic"] },
  { slug: "abdominal-pelvic-trauma-paramedic", title: "Abdominal and Pelvic Trauma", category: "Trauma", tags: ["abdominal-trauma", "pelvic-fracture", "splenic-injury"], relatedSlugs: ["hemorrhage-control-paramedic", "trauma-algorithm-paramedic", "head-injury-management-paramedic"] },
  { slug: "head-injury-management-paramedic", title: "Head Injury and TBI Management", category: "Trauma", tags: ["TBI", "head-injury", "concussion", "herniation"], relatedSlugs: ["traumatic-brain-injury-paramedic", "spinal-motion-restriction-paramedic", "trauma-algorithm-paramedic"] },
  { slug: "spinal-motion-restriction-paramedic", title: "Spinal Motion Restriction", category: "Trauma", tags: ["spinal", "c-spine", "immobilization", "backboard"], relatedSlugs: ["head-injury-management-paramedic", "spinal-cord-injury-paramedic", "trauma-algorithm-paramedic"] },
  { slug: "burn-management-paramedic", title: "Burn Assessment and Management", category: "Trauma", tags: ["burns", "thermal", "chemical", "rule-of-nines"], relatedSlugs: ["trauma-algorithm-paramedic", "hemorrhage-control-paramedic", "hypothermia-hyperthermia-paramedic"] },

  { slug: "ecg-rhythm-interpretation-paramedic", title: "ECG Rhythm Interpretation", category: "Cardiology", tags: ["ECG", "rhythm", "arrhythmia", "cardiac-monitoring"], relatedSlugs: ["stemi-recognition-paramedic", "bradycardia-management-paramedic", "tachycardia-management-paramedic"] },
  { slug: "stemi-recognition-paramedic", title: "STEMI Recognition and Management", category: "Cardiology", tags: ["STEMI", "myocardial-infarction", "12-lead", "reperfusion"], relatedSlugs: ["ecg-rhythm-interpretation-paramedic", "cardiac-medications-paramedic", "cardiogenic-shock-paramedic"] },
  { slug: "bradycardia-management-paramedic", title: "Bradycardia Assessment and Management", category: "Cardiology", tags: ["bradycardia", "heart-block", "pacing", "atropine"], relatedSlugs: ["ecg-rhythm-interpretation-paramedic", "acls-pharmacology-paramedic", "cardiac-medications-paramedic"] },
  { slug: "tachycardia-management-paramedic", title: "Tachycardia Assessment and Management", category: "Cardiology", tags: ["tachycardia", "SVT", "VT", "cardioversion"], relatedSlugs: ["ecg-rhythm-interpretation-paramedic", "acls-pharmacology-paramedic", "cardiac-medications-paramedic"] },
  { slug: "post-rosc-care-paramedic", title: "Post-ROSC and Targeted Temperature Management", category: "Cardiology", tags: ["ROSC", "TTM", "post-arrest", "neuroprotection"], relatedSlugs: ["cardiac-arrest-management-paramedic", "acls-pharmacology-paramedic", "cardiogenic-shock-paramedic"] },
  { slug: "cardiogenic-shock-paramedic", title: "Cardiogenic Shock", category: "Cardiology", tags: ["cardiogenic-shock", "heart-failure", "pulmonary-edema", "vasopressors"], relatedSlugs: ["stemi-recognition-paramedic", "post-rosc-care-paramedic", "pulmonary-edema-management-paramedic"] },

  { slug: "analgesic-pharmacology-paramedic", title: "Analgesic Pharmacology", category: "Pharmacology", tags: ["analgesia", "fentanyl", "ketamine", "morphine", "pain-management"], relatedSlugs: ["sedation-pharmacology-paramedic", "pharmacology-field-drugs-paramedic", "trauma-algorithm-paramedic"] },
  { slug: "sedation-pharmacology-paramedic", title: "Sedation and Paralytic Agents", category: "Pharmacology", tags: ["sedation", "midazolam", "succinylcholine", "rocuronium"], relatedSlugs: ["rapid-sequence-intubation-paramedic", "analgesic-pharmacology-paramedic", "pharmacology-field-drugs-paramedic"] },
  { slug: "cardiac-medications-paramedic", title: "Cardiac Emergency Medications", category: "Pharmacology", tags: ["cardiac-drugs", "epinephrine", "amiodarone", "adenosine"], relatedSlugs: ["acls-pharmacology-paramedic", "bradycardia-management-paramedic", "tachycardia-management-paramedic"] },
  { slug: "respiratory-medications-paramedic", title: "Respiratory Emergency Medications", category: "Pharmacology", tags: ["albuterol", "ipratropium", "epinephrine", "bronchodilator"], relatedSlugs: ["asthma-copd-management-paramedic", "anaphylaxis-management-paramedic", "pharmacology-field-drugs-paramedic"] },
  { slug: "toxicology-antidotes-paramedic", title: "Toxicology Antidotes", category: "Pharmacology", tags: ["antidotes", "naloxone", "flumazenil", "atropine", "pralidoxime"], relatedSlugs: ["toxicological-emergencies-paramedic", "pharmacology-field-drugs-paramedic", "altered-mental-status-paramedic"] },

  { slug: "asthma-copd-management-paramedic", title: "Asthma and COPD Exacerbation", category: "Respiratory", tags: ["asthma", "COPD", "bronchospasm", "status-asthmaticus"], relatedSlugs: ["respiratory-medications-paramedic", "cpap-ventilation-paramedic", "oxygen-therapy-devices-paramedic"] },
  { slug: "pulmonary-edema-management-paramedic", title: "Acute Pulmonary Edema", category: "Respiratory", tags: ["pulmonary-edema", "CHF", "CPAP", "respiratory-distress"], relatedSlugs: ["cpap-ventilation-paramedic", "cardiogenic-shock-paramedic", "oxygen-therapy-devices-paramedic"] },
  { slug: "pneumothorax-management-paramedic", title: "Pneumothorax Recognition and Treatment", category: "Respiratory", tags: ["pneumothorax", "tension", "needle-decompression", "chest-seal"], relatedSlugs: ["chest-trauma-paramedic", "trauma-algorithm-paramedic", "waveform-capnography-paramedic"] },
  { slug: "oxygen-therapy-devices-paramedic", title: "Oxygen Therapy and Delivery Devices", category: "Respiratory", tags: ["oxygen", "nasal-cannula", "non-rebreather", "BVM"], relatedSlugs: ["basic-airway-maneuvers-paramedic", "asthma-copd-management-paramedic", "cpap-ventilation-paramedic"] },
  { slug: "cpap-ventilation-paramedic", title: "CPAP and Non-Invasive Ventilation", category: "Respiratory", tags: ["CPAP", "BiPAP", "non-invasive", "ventilation"], relatedSlugs: ["pulmonary-edema-management-paramedic", "asthma-copd-management-paramedic", "oxygen-therapy-devices-paramedic"] },

  { slug: "diabetic-emergencies-paramedic", title: "Diabetic Emergencies: Hypoglycemia, DKA, and HHS", category: "Medical Emergencies", tags: ["diabetes", "hypoglycemia", "DKA", "HHS", "dextrose"], relatedSlugs: ["altered-mental-status-paramedic", "pharmacology-field-drugs-paramedic", "seizure-management-paramedic"] },
  { slug: "anaphylaxis-management-paramedic", title: "Anaphylaxis Recognition and Management", category: "Medical Emergencies", tags: ["anaphylaxis", "epinephrine", "allergic-reaction", "airway-compromise"], relatedSlugs: ["respiratory-medications-paramedic", "basic-airway-maneuvers-paramedic", "pharmacology-field-drugs-paramedic"] },
  { slug: "seizure-management-paramedic", title: "Seizure and Status Epilepticus Management", category: "Medical Emergencies", tags: ["seizure", "status-epilepticus", "benzodiazepine", "anticonvulsant"], relatedSlugs: ["altered-mental-status-paramedic", "sedation-pharmacology-paramedic", "diabetic-emergencies-paramedic"] },
  { slug: "hypothermia-hyperthermia-paramedic", title: "Hypothermia and Hyperthermia Emergencies", category: "Medical Emergencies", tags: ["hypothermia", "hyperthermia", "heat-stroke", "environmental"], relatedSlugs: ["cardiac-arrest-management-paramedic", "altered-mental-status-paramedic", "burn-management-paramedic"] },
  { slug: "drowning-management-paramedic", title: "Drowning and Submersion Injury", category: "Medical Emergencies", tags: ["drowning", "submersion", "hypothermia", "rescue"], relatedSlugs: ["hypothermia-hyperthermia-paramedic", "basic-airway-maneuvers-paramedic", "cardiac-arrest-management-paramedic"] },
  { slug: "toxicological-emergencies-paramedic", title: "Toxicological Emergencies", category: "Medical Emergencies", tags: ["toxicology", "overdose", "poisoning", "decontamination"], relatedSlugs: ["toxicology-antidotes-paramedic", "altered-mental-status-paramedic", "seizure-management-paramedic"] },

  { slug: "altered-mental-status-paramedic", title: "Altered Mental Status Assessment", category: "Neurology", tags: ["AMS", "AEIOU-TIPS", "GCS", "neurological"], relatedSlugs: ["stroke-recognition-paramedic", "diabetic-emergencies-paramedic", "seizure-management-paramedic"] },
  { slug: "traumatic-brain-injury-paramedic", title: "Traumatic Brain Injury (TBI)", category: "Neurology", tags: ["TBI", "concussion", "herniation", "ICP"], relatedSlugs: ["head-injury-management-paramedic", "spinal-cord-injury-paramedic", "trauma-algorithm-paramedic"] },
  { slug: "spinal-cord-injury-paramedic", title: "Spinal Cord Injury Assessment", category: "Neurology", tags: ["spinal-cord", "neurogenic-shock", "dermatomes", "paralysis"], relatedSlugs: ["spinal-motion-restriction-paramedic", "traumatic-brain-injury-paramedic", "trauma-algorithm-paramedic"] },
  { slug: "meningitis-recognition-paramedic", title: "Meningitis Recognition", category: "Neurology", tags: ["meningitis", "sepsis", "nuchal-rigidity", "infection"], relatedSlugs: ["sepsis-recognition-paramedic", "altered-mental-status-paramedic", "seizure-management-paramedic"] },

  { slug: "pediatric-assessment-triangle-paramedic", title: "Pediatric Assessment Triangle", category: "Pediatrics", tags: ["PAT", "pediatric-assessment", "appearance", "work-of-breathing", "circulation"], relatedSlugs: ["pediatric-respiratory-distress-paramedic", "pediatric-emergencies-paramedic", "pediatric-cardiac-arrest-paramedic"] },
  { slug: "pediatric-respiratory-distress-paramedic", title: "Pediatric Respiratory Emergencies", category: "Pediatrics", tags: ["croup", "epiglottitis", "bronchiolitis", "pediatric-airway"], relatedSlugs: ["pediatric-assessment-triangle-paramedic", "basic-airway-maneuvers-paramedic", "oxygen-therapy-devices-paramedic"] },
  { slug: "pediatric-cardiac-arrest-paramedic", title: "Pediatric Cardiac Arrest Management", category: "Pediatrics", tags: ["pediatric-arrest", "PALS", "defibrillation", "epinephrine"], relatedSlugs: ["cardiac-arrest-management-paramedic", "pediatric-assessment-triangle-paramedic", "pediatric-emergencies-paramedic"] },
  { slug: "pediatric-trauma-paramedic", title: "Pediatric Trauma Considerations", category: "Pediatrics", tags: ["pediatric-trauma", "non-accidental", "sizing", "immobilization"], relatedSlugs: ["trauma-algorithm-paramedic", "pediatric-emergencies-paramedic", "head-injury-management-paramedic"] },
  { slug: "neonatal-resuscitation-paramedic", title: "Neonatal Resuscitation", category: "Pediatrics", tags: ["neonatal", "NRP", "newborn", "apgar", "resuscitation"], relatedSlugs: ["ob-emergencies-paramedic", "normal-delivery-paramedic", "pediatric-cardiac-arrest-paramedic"] },

  { slug: "normal-delivery-paramedic", title: "Normal Field Delivery", category: "Obstetrics", tags: ["delivery", "labor", "childbirth", "stages-of-labor"], relatedSlugs: ["ob-emergencies-paramedic", "neonatal-resuscitation-paramedic", "obstetric-complications-paramedic"] },
  { slug: "obstetric-complications-paramedic", title: "Obstetric Complications: Breech, Cord Prolapse, Shoulder Dystocia", category: "Obstetrics", tags: ["breech", "cord-prolapse", "shoulder-dystocia", "obstetric-emergency"], relatedSlugs: ["normal-delivery-paramedic", "ob-emergencies-paramedic", "postpartum-hemorrhage-paramedic"] },
  { slug: "eclampsia-management-paramedic", title: "Pre-eclampsia and Eclampsia Management", category: "Obstetrics", tags: ["eclampsia", "pre-eclampsia", "magnesium-sulfate", "hypertension"], relatedSlugs: ["ob-emergencies-paramedic", "seizure-management-paramedic", "obstetric-complications-paramedic"] },
  { slug: "postpartum-hemorrhage-paramedic", title: "Postpartum Hemorrhage", category: "Obstetrics", tags: ["postpartum", "hemorrhage", "uterine-atony", "fundal-massage"], relatedSlugs: ["hemorrhage-control-paramedic", "normal-delivery-paramedic", "obstetric-complications-paramedic"] },

  { slug: "incident-command-system-paramedic", title: "Incident Command System (ICS) for EMS", category: "EMS Operations", tags: ["ICS", "incident-command", "NIMS", "MCI"], relatedSlugs: ["field-triage-paramedic", "hazmat-response-paramedic", "ems-communications-paramedic"] },
  { slug: "hazmat-response-paramedic", title: "Hazmat Awareness and Response", category: "EMS Operations", tags: ["hazmat", "decontamination", "CHEMPACK", "PPE"], relatedSlugs: ["incident-command-system-paramedic", "toxicological-emergencies-paramedic", "burn-management-paramedic"] },
  { slug: "ems-communications-paramedic", title: "EMS Communications and Documentation", category: "EMS Operations", tags: ["communications", "radio", "SBAR", "documentation"], relatedSlugs: ["incident-command-system-paramedic", "documentation-reporting-paramedic", "field-triage-paramedic"] },
  { slug: "ambulance-operations-paramedic", title: "Ambulance Operations and Safety", category: "EMS Operations", tags: ["ambulance", "driving", "safety", "equipment-check"], relatedSlugs: ["ems-communications-paramedic", "incident-command-system-paramedic", "documentation-reporting-paramedic"] },
  { slug: "documentation-reporting-paramedic", title: "Patient Care Documentation and Reporting", category: "EMS Operations", tags: ["PCR", "documentation", "legal", "handoff"], relatedSlugs: ["ems-communications-paramedic", "ambulance-operations-paramedic", "field-triage-paramedic"] },
];

async function callOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const OpenAI = (await import("openai")).default;
  const openai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });

  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 4096,
    response_format: { type: "json_object" },
  });

  return resp.choices[0]?.message?.content || "{}";
}

function buildLessonPrompt(topic: LessonTopic): { system: string; user: string } {
  const system = `You are a paramedic education content expert creating structured lesson content for a paramedic exam preparation platform (NurseNest). Write at a professional EMS education level consistent with paramedic training programs.

Return JSON with this exact structure:
{
  "seoTitle": "SEO-optimized page title (50-60 chars)",
  "seoDescription": "Meta description for SEO (150-160 chars)",
  "summary": "2-3 sentence lesson overview",
  "content": [
    {"type": "heading", "text": "Overview"},
    {"type": "paragraph", "text": "Detailed overview paragraph..."},
    {"type": "heading", "text": "Pathophysiology / Mechanism"},
    {"type": "paragraph", "text": "Pathophysiology content..."},
    {"type": "heading", "text": "Signs and Symptoms"},
    {"type": "list", "items": ["Sign 1 with clinical detail", "Sign 2..."]},
    {"type": "heading", "text": "Assessment"},
    {"type": "paragraph", "text": "Primary and secondary survey details..."},
    {"type": "list", "items": ["Assessment step 1", "Assessment step 2"]},
    {"type": "heading", "text": "Prehospital Management"},
    {"type": "paragraph", "text": "Treatment approach..."},
    {"type": "list", "items": ["Intervention 1 with dose/route", "Intervention 2"]},
    {"type": "heading", "text": "Complications"},
    {"type": "list", "items": ["Complication 1", "Complication 2"]},
    {"type": "heading", "text": "Clinical Pearls"},
    {"type": "callout", "text": "High-yield clinical pearl for exam prep"},
    {"type": "list", "items": ["Pearl 1", "Pearl 2", "Pearl 3"]},
    {"type": "heading", "text": "Common Exam Pitfalls"},
    {"type": "list", "items": ["Pitfall 1", "Pitfall 2", "Pitfall 3"]}
  ]
}

Rules:
- Content must be clinically accurate and exam-relevant for PCP, ACP, and NREMT exams
- Include specific values: vital sign ranges, drug dosages with routes, lab values where relevant
- Minimum 15 content blocks, maximum 30
- Use H2-level headings for main sections (Overview, Pathophysiology, Signs and Symptoms, Assessment, Prehospital Management, Complications, Clinical Pearls, Common Exam Pitfalls)
- Include at least 2 callout blocks with high-yield exam tips
- No emoji characters anywhere. Plain text only.
- Use professional EMS terminology
- Include Canadian (PCP/ACP) and US (NREMT) exam perspectives where relevant`;

  const user = `Generate a comprehensive paramedic lesson for: "${topic.title}" (Category: ${topic.category}).
Tags: ${topic.tags.join(", ")}.
Return JSON only.`;

  return { system, user };
}

function buildFlashcardPrompt(topic: LessonTopic): { system: string; user: string } {
  const system = `You are a paramedic education expert creating flashcards for exam preparation.

Return JSON with this exact structure:
{
  "cards": [
    {"front": "Question text", "back": "Answer text", "rationale": "Brief explanation of why this answer is correct"}
  ]
}

Rules:
- Generate exactly 8 flashcards per lesson
- Questions should test key concepts, drug dosages, assessment findings, and clinical decision-making
- Answers should be concise but complete (1-3 sentences)
- Include rationale for each card
- Focus on high-yield exam content for NREMT and Canadian paramedic exams
- No emoji characters. Plain text only.`;

  const user = `Generate 8 flashcards for the paramedic lesson: "${topic.title}" (Category: ${topic.category}). Return JSON only.`;

  return { system, user };
}

async function ensureSystemUser(pool: pg.Pool): Promise<string> {
  const userCheck = await pool.query(`SELECT id FROM users WHERE id = $1`, [SYSTEM_USER_ID]);
  if (userCheck.rows.length > 0) return SYSTEM_USER_ID;

  const fallback = await pool.query(`SELECT id FROM users WHERE username = 'NurseNest-System' LIMIT 1`);
  if (fallback.rows.length > 0) return (fallback.rows[0] as DbRow).id;

  await pool.query(
    `INSERT INTO users (id, username, password, tier, subscription_status)
     VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`,
    [SYSTEM_USER_ID, "NurseNest-System", "system-no-login", "admin", "active"]
  );
  return SYSTEM_USER_ID;
}

async function generateAndInsertLesson(pool: pg.Pool, topic: LessonTopic, ownerId: string): Promise<LessonResult> {
  const existing = await pool.query(`SELECT id FROM content_items WHERE slug = $1`, [topic.slug]);
  if (existing.rows.length > 0) {
    console.log(`  [SKIP] Lesson already exists: ${topic.slug}`);
    return { outcome: "existing", id: (existing.rows[0] as DbRow).id };
  }

  console.log(`  [GEN] Generating content for: ${topic.title}...`);
  const { system, user } = buildLessonPrompt(topic);

  let contentData: LessonGenerationResult;
  try {
    const raw = await callOpenAI(system, user);
    contentData = JSON.parse(raw) as LessonGenerationResult;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`  [ERROR] Failed to generate lesson ${topic.slug}: ${message}`);
    return { outcome: "error", id: null };
  }

  const contentBlocks = contentData.content || [];
  if (contentBlocks.length === 0) {
    console.error(`  [ERROR] No content blocks generated for ${topic.slug}`);
    return { outcome: "error", id: null };
  }

  const validation = validateLessonContent(contentBlocks);
  if (!validation.valid) {
    console.warn(`  [WARN] Content validation issues for ${topic.slug}: ${validation.issues.join("; ")}`);
  }

  const result = await pool.query(
    `INSERT INTO content_items (id, title, slug, type, category, tier, status, tags, summary, content, seo_title, seo_description, seo_keywords, primary_keyword, secondary_keywords, published_at, author_id, author_name, region_scope, updated_by_ai, created_at, updated_at)
     VALUES (gen_random_uuid(), $1, $2, 'lesson', $3, 'free', 'published', $4::text[], $5, $6::jsonb, $7, $8, $9::text[], $10, $11::text[], NOW(), $12, 'NurseNest System', 'BOTH', true, NOW(), NOW())
     RETURNING id`,
    [
      topic.title,
      topic.slug,
      topic.category,
      topic.tags,
      contentData.summary || `Comprehensive paramedic lesson on ${topic.title}`,
      JSON.stringify(contentBlocks),
      contentData.seoTitle || `${topic.title} | Paramedic Study Guide`,
      contentData.seoDescription || `Master ${topic.title.toLowerCase()} for paramedic certification exam preparation.`,
      topic.tags,
      topic.tags[0] || topic.title.toLowerCase(),
      topic.tags.slice(1),
      ownerId,
    ]
  );

  const contentId = (result.rows[0] as DbRow).id;
  console.log(`  [OK] Inserted lesson: ${topic.slug} (id: ${contentId})`);
  return { outcome: "created", id: contentId };
}

async function generateAndInsertFlashcards(pool: pg.Pool, topic: LessonTopic, ownerId: string): Promise<number> {
  const existingDeck = await pool.query(
    `SELECT id FROM flashcard_decks WHERE slug = $1 AND owner_id = $2`,
    [topic.slug, ownerId]
  );
  if (existingDeck.rows.length > 0) {
    console.log(`  [SKIP] Flashcard deck already exists: ${topic.slug}`);
    return 0;
  }

  console.log(`  [GEN] Generating flashcards for: ${topic.title}...`);
  const { system, user } = buildFlashcardPrompt(topic);

  let cardData: FlashcardGenerationResult;
  try {
    const raw = await callOpenAI(system, user);
    cardData = JSON.parse(raw) as FlashcardGenerationResult;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`  [ERROR] Failed to generate flashcards for ${topic.slug}: ${message}`);
    return 0;
  }

  const cards = cardData.cards || [];
  if (cards.length === 0) {
    console.error(`  [ERROR] No flashcards generated for ${topic.slug}`);
    return 0;
  }

  const deckResult = await pool.query(
    `INSERT INTO flashcard_decks (title, slug, description, owner_id, visibility, tags, career_type, is_upgraded, upgraded_limit, created_at, updated_at)
     VALUES ($1, $2, $3, $4, 'public', $5::jsonb, 'paramedic', true, 500, NOW(), NOW())
     RETURNING id`,
    [
      `${topic.title} Flashcards`,
      topic.slug,
      `Key concepts and exam-ready flashcards for ${topic.title}`,
      ownerId,
      JSON.stringify(topic.tags),
    ]
  );
  const deckId = (deckResult.rows[0] as DbRow).id;

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    await pool.query(
      `INSERT INTO deck_flashcards (deck_id, front, back, rationale, sort_order, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [deckId, card.front, card.back, card.rationale || null, i]
    );
  }

  await pool.query(
    `UPDATE flashcard_decks SET card_count = $1 WHERE id = $2`,
    [cards.length, deckId]
  );

  console.log(`  [OK] Inserted ${cards.length} flashcards for: ${topic.slug}`);
  return cards.length;
}

async function buildCrossLinks(pool: pg.Pool): Promise<void> {
  console.log("\n[Cross-Link] Building lesson cross-links...");

  const allLessons = await pool.query(
    `SELECT id, slug, category, tags FROM content_items WHERE slug LIKE '%-paramedic' AND status = 'published'`
  );

  const slugToId = new Map<string, string>();
  for (const row of allLessons.rows as DbRow[]) {
    slugToId.set(row.slug!, row.id);
  }

  let linkCount = 0;
  for (const topic of LESSON_TOPICS) {
    const lessonId = slugToId.get(topic.slug);
    if (!lessonId) continue;

    const relatedIds: string[] = [];
    for (const relSlug of topic.relatedSlugs) {
      const relId = slugToId.get(relSlug);
      if (relId) relatedIds.push(relId);
    }

    if (relatedIds.length > 0) {
      const existingContent = await pool.query(
        `SELECT content FROM content_items WHERE id = $1`, [lessonId]
      );
      const rawContent = (existingContent.rows[0] as DbRow)?.content;
      let blocks: ContentBlock[] = typeof rawContent === 'string' ? JSON.parse(rawContent) : (rawContent || []) as ContentBlock[];

      const hasRelated = blocks.some((b: ContentBlock) => b.type === 'related_lessons');
      if (!hasRelated) {
        const relatedLessonData: { slug: string; title: string }[] = [];
        for (const relSlug of topic.relatedSlugs) {
          const matchingTopic = LESSON_TOPICS.find(t => t.slug === relSlug);
          const existingLesson = (allLessons.rows as DbRow[]).find(r => r.slug === relSlug);
          if (matchingTopic || existingLesson) {
            relatedLessonData.push({
              slug: relSlug,
              title: matchingTopic?.title || existingLesson?.slug || relSlug,
            });
          }
        }

        blocks.push({
          type: "related_lessons",
          items: relatedLessonData,
        });

        await pool.query(
          `UPDATE content_items SET content = $1::jsonb, updated_at = NOW() WHERE id = $2`,
          [JSON.stringify(blocks), lessonId]
        );
        linkCount++;
      }
    }
  }

  console.log(`[Cross-Link] Added cross-links to ${linkCount} lessons.`);
}

async function linkToQuestionBank(pool: pg.Pool): Promise<void> {
  console.log("\n[Q-Bank Link] Linking lessons to question bank...");

  const tableCheck = await pool.query(
    `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'question_bank_items') AS exists`
  );
  if (!(tableCheck.rows[0] as { exists: boolean })?.exists) {
    console.log("[Q-Bank Link] question_bank_items table not found. Attempting allied_questions fallback...");

    const altCheck = await pool.query(
      `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'allied_questions') AS exists`
    );
    if (!(altCheck.rows[0] as { exists: boolean })?.exists) {
      console.log("[Q-Bank Link] No question bank tables found. Question bank linking skipped.");
      return;
    }

    const questions = await pool.query(
      `SELECT id, blueprint_category as category, subtopic as topic FROM allied_questions WHERE career_type = 'paramedic' AND status IN ('approved', 'pending') LIMIT 500`
    );

    if (questions.rows.length === 0) {
      console.log("[Q-Bank Link] No paramedic questions found in allied_questions.");
      return;
    }

    await linkQuestionsToLessons(pool, questions.rows as DbRow[]);
    return;
  }

  const questions = await pool.query(
    `SELECT id, category, topic FROM question_bank_items WHERE exam_type ILIKE '%paramedic%' OR exam_type ILIKE '%NREMT%' LIMIT 500`
  );

  if (questions.rows.length === 0) {
    console.log("[Q-Bank Link] No paramedic questions found in question bank.");
    return;
  }

  await linkQuestionsToLessons(pool, questions.rows as DbRow[]);
}

async function linkQuestionsToLessons(pool: pg.Pool, questions: DbRow[]): Promise<void> {
  let linkedCount = 0;
  for (const topic of LESSON_TOPICS) {
    const matchingQuestions = questions.filter((q: DbRow) => {
      const qCat = (q.category || "").toLowerCase();
      const qTopic = (q.topic || "").toLowerCase();
      return topic.tags.some(tag =>
        qCat.includes(tag.toLowerCase()) || qTopic.includes(tag.toLowerCase())
      ) || qCat.includes(topic.category.toLowerCase());
    });

    if (matchingQuestions.length > 0) {
      const contentResult = await pool.query(
        `SELECT id, content FROM content_items WHERE slug = $1`, [topic.slug]
      );
      if (contentResult.rows.length > 0) {
        const row = contentResult.rows[0] as DbRow;
        let blocks: ContentBlock[] = typeof row.content === 'string' ? JSON.parse(row.content) : (row.content || []) as ContentBlock[];

        const hasQbank = blocks.some((b: ContentBlock) => b.type === 'question_bank_link');
        if (!hasQbank) {
          blocks.push({
            type: "question_bank_link",
            questionCount: matchingQuestions.length,
            category: topic.category,
          });

          await pool.query(
            `UPDATE content_items SET content = $1::jsonb, updated_at = NOW() WHERE id = $2`,
            [JSON.stringify(blocks), row.id]
          );
          linkedCount++;
        }
      }
    }
  }

  console.log(`[Q-Bank Link] Linked ${linkedCount} lessons to question bank entries.`);
}

function validateLessonContent(blocks: ContentBlock[]): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const headings = blocks.filter(b => b.type === "heading").map(b => (b.text || "").toLowerCase());
  const requiredSections = ["overview", "prehospital management", "clinical pearls"];
  for (const section of requiredSections) {
    if (!headings.some(h => h.includes(section))) {
      issues.push(`Missing required section: ${section}`);
    }
  }
  if (blocks.length < 10) {
    issues.push(`Too few content blocks: ${blocks.length} (minimum 10)`);
  }
  const callouts = blocks.filter(b => b.type === "callout");
  if (callouts.length < 1) {
    issues.push("No callout blocks found (at least 1 required)");
  }
  return { valid: issues.length === 0, issues };
}

async function runFullPipeline() {
  const allowFallback = process.argv.includes("--allow-database-url-fallback");
  const hasProdUrl = !!process.env.PROD_DATABASE_URL;

  if (!hasProdUrl && !allowFallback) {
    console.warn("[WARNING] PROD_DATABASE_URL is not set. Using DATABASE_URL as fallback.");
    console.warn("[WARNING] To suppress this warning, pass --allow-database-url-fallback");
  }

  console.log("=".repeat(70));
  console.log("PARAMEDIC LESSON GENERATION PIPELINE");
  console.log(`Total topics: ${LESSON_TOPICS.length}`);
  console.log(`Database target: ${hasProdUrl ? "PRODUCTION (PROD_DATABASE_URL)" : "DEFAULT (DATABASE_URL)"}`);
  console.log("=".repeat(70));

  const pool = getProdPool();
  const ownerId = await ensureSystemUser(pool);
  console.log(`System user ID: ${ownerId}`);

  const BATCH_SIZE = 10;
  let totalCreated = 0;
  let totalExisting = 0;
  let totalFlashcards = 0;
  let totalErrors = 0;

  for (let batchStart = 0; batchStart < LESSON_TOPICS.length; batchStart += BATCH_SIZE) {
    const batchEnd = Math.min(batchStart + BATCH_SIZE, LESSON_TOPICS.length);
    const batch = LESSON_TOPICS.slice(batchStart, batchEnd);
    const batchNum = Math.floor(batchStart / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(LESSON_TOPICS.length / BATCH_SIZE);

    console.log(`\n${"=".repeat(50)}`);
    console.log(`BATCH ${batchNum}/${totalBatches} (lessons ${batchStart + 1}-${batchEnd})`);
    console.log(`${"=".repeat(50)}`);

    for (const topic of batch) {
      try {
        const lessonResult = await generateAndInsertLesson(pool, topic, ownerId);

        switch (lessonResult.outcome) {
          case "created":
            totalCreated++;
            break;
          case "existing":
            totalExisting++;
            break;
          case "error":
            totalErrors++;
            break;
        }

        if (lessonResult.outcome !== "error") {
          const cardCount = await generateAndInsertFlashcards(pool, topic, ownerId);
          totalFlashcards += cardCount;
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`  [ERROR] Exception for ${topic.slug}: ${message}`);
        totalErrors++;
      }
    }

    console.log(`\n[Batch ${batchNum} Summary]`);
    console.log(`  Lessons created so far: ${totalCreated}`);
    console.log(`  Lessons existing (skipped): ${totalExisting}`);
    console.log(`  Flashcards created so far: ${totalFlashcards}`);
    console.log(`  Errors: ${totalErrors}`);
  }

  await buildCrossLinks(pool);
  await linkToQuestionBank(pool);

  console.log(`\n${"=".repeat(70)}`);
  console.log("PIPELINE COMPLETE");
  console.log(`  Total lessons created: ${totalCreated}`);
  console.log(`  Total lessons existing (skipped): ${totalExisting}`);
  console.log(`  Total flashcards created: ${totalFlashcards}`);
  console.log(`  Errors: ${totalErrors}`);
  console.log(`${"=".repeat(70)}`);
}

runFullPipeline()
  .then(() => {
    console.log("\nDone. Exiting.");
    process.exit(0);
  })
  .catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Pipeline failed:", message);
    process.exit(1);
  });
