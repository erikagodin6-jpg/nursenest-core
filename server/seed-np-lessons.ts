import crypto from "crypto";
import OpenAI from "openai";
import type { Pool, QueryResult } from "pg";

interface NpLessonDef {
  title: string;
  slug: string;
  domain: string;
  keywords: string[];
}

interface LessonSection {
  type: string;
  content?: string;
  items?: string[];
}

interface LessonFlashcard {
  front: string;
  back: string;
}

interface AILessonResult {
  sections: LessonSection[];
  flashcards: LessonFlashcard[];
  relatedTopicKeywords: string[];
}

interface SeedResult {
  generated: number;
  flashcardsCreated: number;
  questionsLinked: number;
  validationRejections: number;
  errors: number;
}

function getOpenAI(): OpenAI {
  return new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function contentHash(text: string, lessonSlug: string): string {
  return crypto
    .createHash("md5")
    .update(`${lessonSlug}:${text.trim().toLowerCase()}`)
    .digest("hex");
}

const MIN_SECTION_COUNT = 10;
const MIN_PARAGRAPH_LENGTH = 120;
const MIN_LIST_ITEMS = 3;
const MIN_FLASHCARDS_PER_LESSON = 3;
const MAX_AI_RETRIES = 2;
const REQUIRED_SECTIONS = [
  "Overview",
  "Advanced Pathophysiology",
  "Clinical Presentation",
  "Diagnostic Workup",
  "Differential Diagnosis",
  "Management Plan",
  "Prescribing Considerations",
  "Clinical Pearls",
  "Common Exam Pitfalls",
  "Evidence-Based Guidelines",
];

interface ContentValidationResult {
  valid: boolean;
  errors: string[];
}

function validateLessonContent(sections: LessonSection[]): ContentValidationResult {
  const errors: string[] = [];

  const headings = sections
    .filter((s) => s.type === "heading")
    .map((s) => s.content || "");
  for (const required of REQUIRED_SECTIONS) {
    if (!headings.some((h) => h.toLowerCase().includes(required.toLowerCase()))) {
      errors.push(`Missing required section: ${required}`);
    }
  }

  if (sections.length < MIN_SECTION_COUNT) {
    errors.push(
      `Insufficient sections: ${sections.length} < ${MIN_SECTION_COUNT}`
    );
  }

  const paragraphs = sections.filter((s) => s.type === "paragraph");
  for (const p of paragraphs) {
    if (!p.content || p.content.length < MIN_PARAGRAPH_LENGTH) {
      errors.push(
        `Paragraph too short (${p.content?.length || 0} chars, min ${MIN_PARAGRAPH_LENGTH})`
      );
    }
  }

  const lists = sections.filter((s) => s.type === "list");
  for (const l of lists) {
    if (!l.items || l.items.length < MIN_LIST_ITEMS) {
      errors.push(
        `List too short (${l.items?.length || 0} items, min ${MIN_LIST_ITEMS})`
      );
    }
  }

  return { valid: errors.length === 0, errors };
}

function validateFlashcards(flashcards: LessonFlashcard[]): ContentValidationResult {
  const errors: string[] = [];
  if (flashcards.length < MIN_FLASHCARDS_PER_LESSON) {
    errors.push(
      `Insufficient flashcards: ${flashcards.length} < ${MIN_FLASHCARDS_PER_LESSON}`
    );
  }
  for (let i = 0; i < flashcards.length; i++) {
    if (!flashcards[i].front || flashcards[i].front.length < 10) {
      errors.push(`Flashcard ${i + 1} front is too short`);
    }
    if (!flashcards[i].back || flashcards[i].back.length < 10) {
      errors.push(`Flashcard ${i + 1} back is too short`);
    }
  }
  return { valid: errors.length === 0, errors };
}

const NP_DOMAINS: Record<string, string[]> = {
  "Advanced Health Assessment": [
    "Comprehensive Health History Taking",
    "Head-to-Toe Physical Examination",
    "Cardiovascular Assessment Techniques",
    "Respiratory Assessment and Auscultation",
    "Neurological Examination Methods",
    "Abdominal Assessment and Palpation",
    "Musculoskeletal Examination Techniques",
    "Dermatological Assessment and Lesion Identification",
    "Eye and Ear Examination",
    "Mental Status Examination",
    "Pediatric Growth and Development Assessment",
    "Geriatric Functional Assessment",
    "Prenatal and Postpartum Assessment",
    "Health Screening and Risk Assessment",
    "Documentation and Clinical Reasoning in Assessment",
    "Cranial Nerve Assessment",
    "Peripheral Vascular Assessment",
    "Breast and Axillary Examination",
    "Male Genitourinary Examination",
    "Female Pelvic Examination",
    "Thyroid and Lymph Node Assessment",
    "Neonatal Assessment and APGAR Scoring",
    "Sports Physical Examination",
    "Occupational Health Assessment",
    "Nutritional Status Assessment",
    "Pain Assessment Tools and Techniques",
    "Substance Use Screening Tools",
    "Telehealth Assessment Adaptations",
  ],
  "Advanced Pharmacology": [
    "Pharmacokinetics and Pharmacodynamics for NPs",
    "Prescribing Antihypertensives",
    "Prescribing Oral Hypoglycemics and Insulin",
    "Antibiotic Selection and Stewardship",
    "Prescribing Psychotropic Medications",
    "Opioid Prescribing and Pain Management",
    "Anticoagulant Therapy Management",
    "Prescribing Thyroid Medications",
    "Corticosteroid Prescribing and Tapering",
    "Prescribing Respiratory Medications",
    "Drug Interactions and Polypharmacy",
    "Prescribing in Pregnancy and Lactation",
    "Pediatric Dosing and Pharmacology",
    "Geriatric Pharmacology and Beers Criteria",
    "Controlled Substance Prescribing Regulations",
    "Prescribing Lipid-Lowering Agents",
    "Prescribing Anticonvulsants",
    "Prescribing Migraine Medications",
    "Prescribing Dermatologic Agents",
    "Immunosuppressant Therapy",
    "Prescribing GI Medications",
    "Prescribing Urologic Medications",
    "Prescribing Osteoporosis Medications",
    "Prescribing Hormonal Contraceptives",
    "Herbal and Supplement Interactions",
    "Prescribing Antivirals",
    "Prescribing for Smoking Cessation",
    "Pharmacogenomics in Clinical Practice",
  ],
  "Advanced Pathophysiology": [
    "Cellular Injury and Adaptation",
    "Inflammatory Response and Healing",
    "Immune System Dysfunction and Autoimmunity",
    "Cardiovascular Pathophysiology",
    "Pulmonary Pathophysiology",
    "Renal Pathophysiology and Electrolyte Disorders",
    "Hepatic Pathophysiology",
    "Endocrine Pathophysiology",
    "Neurological Pathophysiology",
    "Hematologic Disorders Pathophysiology",
    "GI Pathophysiology",
    "Musculoskeletal Pathophysiology",
    "Reproductive System Pathophysiology",
    "Dermatologic Pathophysiology",
    "Oncologic Pathophysiology",
    "Genetic and Congenital Disorders",
    "Infectious Disease Pathophysiology",
    "Acid-Base Balance Disorders",
    "Shock and Multiorgan Dysfunction",
    "Fluid and Electrolyte Imbalances",
    "Nutritional Deficiency Disorders",
    "Metabolic Syndrome Pathophysiology",
    "Pain Pathophysiology and Neurotransmission",
    "Aging and Degenerative Changes",
    "Stress Response and Allostatic Load",
    "Pediatric Pathophysiology Differences",
    "Obesity and Metabolic Dysfunction",
    "Epigenetics and Disease Susceptibility",
  ],
  "Primary Care - Adult/Family": [
    "Hypertension Management in Primary Care",
    "Type 2 Diabetes Management",
    "Dyslipidemia Screening and Treatment",
    "Obesity and Weight Management",
    "Chronic Kidney Disease in Primary Care",
    "COPD Management",
    "Asthma Management in Adults",
    "Heart Failure in Primary Care",
    "Atrial Fibrillation Management",
    "Hypothyroidism Management",
    "Hyperthyroidism and Graves Disease",
    "Osteoarthritis Management",
    "Low Back Pain Evaluation and Treatment",
    "Headache and Migraine Management",
    "Depression Screening and Treatment in Primary Care",
    "Anxiety Disorders in Primary Care",
    "Upper Respiratory Infections",
    "Urinary Tract Infections in Adults",
    "Sexually Transmitted Infections",
    "Skin Cancer Screening and Prevention",
    "Preventive Health and Immunization Schedules",
    "Chronic Pain Management Strategies",
    "Irritable Bowel Syndrome Management",
    "GERD and Peptic Ulcer Disease",
    "Anemia Workup in Primary Care",
    "Benign Prostatic Hyperplasia",
    "Peripheral Arterial Disease",
    "Chronic Obstructive Sleep Apnea",
    "Gout and Hyperuricemia Management",
  ],
  "Primary Care - Pediatrics": [
    "Well-Child Visits and Developmental Milestones",
    "Childhood Immunization Schedules",
    "Pediatric Asthma Management",
    "Pediatric Otitis Media",
    "Pediatric Pharyngitis and Strep Throat",
    "Pediatric Fever Management",
    "Childhood Obesity Prevention",
    "ADHD Diagnosis and Management",
    "Pediatric Eczema and Atopic Dermatitis",
    "Pediatric Urinary Tract Infections",
    "Common Childhood Rashes",
    "Failure to Thrive Evaluation",
    "Pediatric Constipation Management",
    "Newborn Screening and Common Conditions",
    "Adolescent Health and Anticipatory Guidance",
    "Pediatric Iron Deficiency Anemia",
    "Childhood Allergies and Anaphylaxis",
    "Pediatric Fractures and Musculoskeletal Injuries",
    "Autism Spectrum Disorder Screening",
    "Pediatric Type 1 Diabetes Management",
    "Pediatric Gastroenteritis Management",
    "Childhood Lead Poisoning Prevention",
    "Pediatric Vision and Hearing Screening",
    "Pediatric Sleep Disorders",
    "Pediatric Behavioral Health Issues",
    "Sports Injuries in Adolescents",
    "Pediatric Respiratory Syncytial Virus",
  ],
  "Primary Care - Geriatrics": [
    "Geriatric Comprehensive Assessment",
    "Falls Prevention in Older Adults",
    "Dementia Diagnosis and Management",
    "Delirium Assessment and Management",
    "Polypharmacy in Geriatric Patients",
    "Osteoporosis Screening and Treatment",
    "Geriatric Depression Management",
    "Urinary Incontinence in Older Adults",
    "Geriatric Pain Management",
    "End-of-Life Care and Advance Directives",
    "Elder Abuse Screening",
    "Geriatric Nutrition and Malnutrition",
    "Parkinson Disease Management",
    "Geriatric Skin Integrity and Wound Care",
    "Management of Chronic Illness in Elderly",
    "Sensory Changes in Aging",
    "Geriatric Cardiovascular Risk Management",
    "Cognitive Screening Tools for Elderly",
    "Managing Diabetes in Older Adults",
    "Geriatric Insomnia Management",
    "Sarcopenia and Frailty Assessment",
    "Geriatric Pharmacokinetic Changes",
    "Driving Safety Assessment in Elderly",
    "Caregiver Support and Burnout",
    "Palliative Care Principles",
    "Geriatric Urologic Conditions",
    "Geriatric Immunization Recommendations",
  ],
  "Acute Care NP": [
    "Acute Coronary Syndrome Management",
    "Acute Respiratory Failure",
    "Sepsis Recognition and Management",
    "Acute Kidney Injury Management",
    "Acute Stroke Assessment and Treatment",
    "Trauma Primary and Secondary Survey",
    "Mechanical Ventilation Basics",
    "Hemodynamic Monitoring",
    "Acute Abdomen Evaluation",
    "Status Epilepticus Management",
    "Diabetic Ketoacidosis Management",
    "Acute Heart Failure Exacerbation",
    "Pulmonary Embolism Diagnosis and Treatment",
    "Acute Pancreatitis Management",
    "GI Bleeding Assessment and Management",
    "Pneumonia in Hospitalized Patients",
    "Post-Operative Care Management",
    "Burns Assessment and Initial Management",
    "Electrolyte Emergencies",
    "Overdose and Toxicology Management",
    "Acute Pain Management in Hospital Setting",
    "Decompensated Liver Disease",
    "Acute Exacerbation of COPD",
    "ICU Sedation and Analgesia",
    "Blood Product Administration",
    "Chest Tube Management",
    "Central Line Placement and Care",
  ],
  "Women's Health NP": [
    "Prenatal Care and Routine Screening",
    "Management of High-Risk Pregnancy",
    "Contraceptive Counseling and Methods",
    "Menopause Management and HRT",
    "Abnormal Uterine Bleeding Workup",
    "Cervical Cancer Screening and HPV",
    "Breast Cancer Screening Guidelines",
    "Polycystic Ovary Syndrome Management",
    "Endometriosis Diagnosis and Treatment",
    "Infertility Evaluation",
    "Gestational Diabetes Management",
    "Preeclampsia and Hypertensive Disorders",
    "Postpartum Depression Screening",
    "Pelvic Inflammatory Disease",
    "Vulvovaginal Infections",
    "Uterine Fibroids Management",
    "Ovarian Cyst Evaluation",
    "Sexual Health and Dysfunction",
    "Osteoporosis in Women",
    "Perimenopause Symptom Management",
    "Breast Mass Evaluation",
    "Ectopic Pregnancy Recognition",
    "Preconception Counseling",
    "Maternal Nutrition and Supplementation",
    "Labor Induction Indications",
    "Postpartum Hemorrhage Recognition",
    "Breastfeeding Support and Common Issues",
  ],
  "Psychiatric-Mental Health NP": [
    "Major Depressive Disorder Management",
    "Generalized Anxiety Disorder Treatment",
    "Bipolar Disorder Pharmacotherapy",
    "Schizophrenia and Antipsychotic Management",
    "PTSD Assessment and Treatment",
    "Substance Use Disorder Management",
    "Eating Disorders Assessment",
    "Panic Disorder and Phobias",
    "OCD Diagnosis and Treatment",
    "Personality Disorders Overview",
    "Suicidal Ideation Assessment and Safety Planning",
    "Psychopharmacology Principles",
    "Therapeutic Communication Techniques",
    "Child and Adolescent Mental Health",
    "Geriatric Psychiatric Conditions",
    "Sleep Disorders and Insomnia Treatment",
    "ADHD Management Across Lifespan",
    "Trauma-Informed Care",
    "Motivational Interviewing Techniques",
    "Crisis Intervention Strategies",
    "Antidepressant Selection and Monitoring",
    "Benzodiazepine Use and Withdrawal",
    "Mood Stabilizer Management",
    "Electroconvulsive Therapy Indications",
    "Telepsychiatry and Digital Mental Health",
    "Psychiatric Emergency Management",
    "Neurodevelopmental Disorders in Adults",
  ],
  "Clinical Decision-Making & Differential Diagnosis": [
    "Chest Pain Differential Diagnosis",
    "Shortness of Breath Differential",
    "Abdominal Pain Differential Diagnosis",
    "Headache Differential Diagnosis",
    "Joint Pain Differential Diagnosis",
    "Fatigue Differential Diagnosis",
    "Syncope Evaluation",
    "Edema Differential Diagnosis",
    "Weight Loss Differential Diagnosis",
    "Lymphadenopathy Differential",
    "Cough Differential Diagnosis",
    "Dizziness and Vertigo Differential",
    "Hematuria Differential Diagnosis",
    "Palpitations Evaluation",
    "Rash Differential Diagnosis",
    "Back Pain Red Flags and Differential",
    "Altered Mental Status Differential",
    "Fever of Unknown Origin",
    "Jaundice Differential Diagnosis",
    "Anemia Differential Diagnosis",
    "Proteinuria Evaluation",
    "Thyroid Nodule Evaluation",
    "Elevated Liver Enzymes Workup",
    "Abnormal CBC Interpretation",
    "Ordering and Interpreting Diagnostic Tests",
    "Clinical Reasoning Frameworks",
    "Evidence-Based Clinical Guidelines Application",
  ],
  "Evidence-Based Practice & Professional Issues": [
    "Evidence-Based Practice Principles for NPs",
    "Critical Appraisal of Research Literature",
    "NP Scope of Practice and Autonomy",
    "Collaborative Practice Agreements",
    "Ethical Decision Making in Advanced Practice",
    "Informed Consent and Shared Decision Making",
    "Quality Improvement in Clinical Practice",
    "Patient Safety and Error Prevention",
    "Cultural Competence in Advanced Practice",
    "Health Policy and Advocacy for NPs",
    "Interprofessional Collaboration",
    "Telehealth and Virtual Care Practice",
    "Documentation and Coding for NPs",
    "Malpractice and Legal Considerations",
    "NP Certification Exam Preparation Strategies",
    "Health Literacy and Patient Education",
    "Population Health Management",
    "Social Determinants of Health",
    "Health Disparities and Equity",
    "Transition to Practice for New NPs",
    "Leadership in Advanced Practice Nursing",
    "Clinical Practice Guidelines Development",
    "Research Utilization in Practice",
    "Professional Development and Continuing Education",
    "Reimbursement and Billing for NP Services",
    "Credentialing and Privileging",
    "NP Role in Emergency Preparedness",
  ],
};

function buildLessonPlan(): NpLessonDef[] {
  const lessons: NpLessonDef[] = [];
  for (const [domain, topics] of Object.entries(NP_DOMAINS)) {
    for (const topic of topics) {
      const words = topic
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 3);
      lessons.push({
        title: topic,
        slug: `np-${slugify(topic)}`,
        domain,
        keywords: [domain.toLowerCase(), topic.toLowerCase(), ...words.slice(0, 4)],
      });
    }
  }
  return lessons;
}

function buildSearchKeywords(lesson: NpLessonDef): string[] {
  const stopWords = [
    "management",
    "assessment",
    "evaluation",
    "treatment",
    "diagnosis",
    "screening",
    "prescribing",
    "practice",
  ];
  const titleWords = lesson.title
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopWords.includes(w));

  const domainWords = lesson.domain
    .toLowerCase()
    .split(/[\s\-&]+/)
    .filter((w) => w.length > 3);

  return [...new Set([...titleWords, ...domainWords])];
}

async function generateAILessonContent(
  openai: OpenAI,
  lesson: NpLessonDef,
  retryCount = 0
): Promise<AILessonResult | null> {
  const prompt = `You are a Nurse Practitioner educator creating advanced-level lesson content for NP students preparing for AANP and ANCC certification exams.

Generate a comprehensive lesson on: "${lesson.title}"
Domain: ${lesson.domain}

Return valid JSON with this exact structure:
{
  "sections": [
    {"type": "heading", "content": "Overview"},
    {"type": "paragraph", "content": "...comprehensive overview (150+ words) covering clinical significance, epidemiology, and relevance to NP practice..."},
    {"type": "heading", "content": "Advanced Pathophysiology"},
    {"type": "paragraph", "content": "...detailed pathophysiology at NP level (200+ words) with cellular/molecular mechanisms..."},
    {"type": "heading", "content": "Clinical Presentation"},
    {"type": "list", "items": ["6-8 specific signs/symptoms with clinical detail", "..."]},
    {"type": "heading", "content": "Diagnostic Workup"},
    {"type": "list", "items": ["6-8 specific tests with normal values and interpretation", "..."]},
    {"type": "heading", "content": "Differential Diagnosis"},
    {"type": "list", "items": ["5-6 differentials with key distinguishing features", "..."]},
    {"type": "heading", "content": "Management Plan"},
    {"type": "paragraph", "content": "...comprehensive management (200+ words) including first-line and second-line treatments, non-pharmacologic interventions..."},
    {"type": "heading", "content": "Prescribing Considerations"},
    {"type": "list", "items": ["5-6 specific medications with drug name, dose, route, frequency, monitoring", "..."]},
    {"type": "heading", "content": "Clinical Pearls"},
    {"type": "list", "items": ["6-8 high-yield exam pearls specific to this topic", "..."]},
    {"type": "heading", "content": "Common Exam Pitfalls"},
    {"type": "list", "items": ["5-6 specific mistakes students make", "..."]},
    {"type": "heading", "content": "Evidence-Based Guidelines"},
    {"type": "list", "items": ["4-5 specific guideline references with organization name and recommendations", "..."]}
  ],
  "flashcards": [
    {"front": "Specific clinical question about key concept", "back": "Concise, accurate answer with specifics (doses, values, criteria)"},
    {"front": "Q2", "back": "A2"},
    {"front": "Q3", "back": "A3"},
    {"front": "Q4", "back": "A4"},
    {"front": "Q5", "back": "A5"}
  ],
  "relatedTopicKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}

Requirements:
- Content at advanced practice level with specific drug names, doses, lab values, and guideline citations
- Include actual medication dosages (e.g., "metoprolol 25-100mg PO BID") and lab reference ranges
- Reference specific guidelines (USPSTF, AHA/ACC, ADA, CDC, JNC, etc.)
- Exactly 5 flashcards covering high-yield testable concepts with specific, detailed answers
- 5 related topic keywords for matching to related exam questions
- All content must be clinically accurate and evidence-based`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 3500,
    });

    const raw = JSON.parse(response.choices[0]?.message?.content || "{}");
    const result: AILessonResult = {
      sections: raw.sections || [],
      flashcards: raw.flashcards || [],
      relatedTopicKeywords: raw.relatedTopicKeywords || lesson.keywords,
    };

    const sectionValidation = validateLessonContent(result.sections);
    const flashcardValidation = validateFlashcards(result.flashcards);

    if (!sectionValidation.valid || !flashcardValidation.valid) {
      const allErrors = [...sectionValidation.errors, ...flashcardValidation.errors];
      if (retryCount < MAX_AI_RETRIES) {
        console.warn(
          `[NP Seed] Validation failed for "${lesson.title}" (attempt ${retryCount + 1}/${MAX_AI_RETRIES + 1}): ${allErrors.join("; ")}. Retrying...`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000 * (retryCount + 1)));
        return generateAILessonContent(openai, lesson, retryCount + 1);
      }
      console.error(
        `[NP Seed] ✗ Validation failed after ${MAX_AI_RETRIES + 1} attempts for "${lesson.title}": ${allErrors.join("; ")}`
      );
      return null;
    }

    return result;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (retryCount < MAX_AI_RETRIES) {
      console.warn(
        `[NP Seed] AI error for "${lesson.title}" (attempt ${retryCount + 1}): ${message}. Retrying...`
      );
      await new Promise((resolve) => setTimeout(resolve, 2000 * (retryCount + 1)));
      return generateAILessonContent(openai, lesson, retryCount + 1);
    }
    console.error(`[NP Seed] AI error for "${lesson.title}" after retries:`, message);
    return null;
  }
}

async function linkLessonToQuestions(
  pool: Pool,
  lessonId: string,
  lesson: NpLessonDef,
  aiKeywords?: string[]
): Promise<number> {
  try {
    const searchTerms = buildSearchKeywords(lesson);
    if (aiKeywords && aiKeywords.length > 0) {
      for (const kw of aiKeywords) {
        if (kw.length > 3) searchTerms.push(kw.toLowerCase());
      }
    }
    const uniqueTerms = [...new Set(searchTerms)].slice(0, 8);

    if (uniqueTerms.length === 0) return 0;

    const conditions = uniqueTerms.map(
      (_, i) =>
        `(LOWER(topic) LIKE $${i + 2} OR LOWER(body_system) LIKE $${i + 2} OR LOWER(stem) LIKE $${i + 2})`
    );
    const params: (string | number)[] = [
      "np",
      ...uniqueTerms.map((t) => `%${t}%`),
    ];

    const relatedQ: QueryResult = await pool.query(
      `SELECT id FROM exam_questions WHERE tier = $1 AND (${conditions.join(" OR ")}) LIMIT 15`,
      params
    );

    if (relatedQ.rows.length > 0) {
      const eqTags = relatedQ.rows.slice(0, 8).map((r: { id: string }) => `eq:${r.id}`);
      await pool.query(
        `UPDATE content_items SET tags = array_cat(tags, $1::text[]) WHERE id = $2`,
        [eqTags, lessonId]
      );
      return relatedQ.rows.length;
    }
    return 0;
  } catch (linkErr: unknown) {
    const message = linkErr instanceof Error ? linkErr.message : String(linkErr);
    console.error(
      `[NP Seed] Question linking error for "${lesson.title}":`,
      message
    );
    return 0;
  }
}

export async function seedNpLessons(
  pool: Pool,
  options?: {
    batchSize?: number;
    startFrom?: number;
    dryRun?: boolean;
    concurrency?: number;
  }
): Promise<SeedResult> {
  const batchSize = options?.batchSize || 25;
  const startFrom = options?.startFrom || 0;
  const dryRun = options?.dryRun || false;
  const concurrency = options?.concurrency || 3;
  const openai = getOpenAI();

  const allLessons = buildLessonPlan();
  console.log(
    `[NP Seed] Total lesson plan: ${allLessons.length} lessons across ${Object.keys(NP_DOMAINS).length} domains`
  );

  const existingResult: QueryResult = await pool.query(
    `SELECT slug FROM content_items WHERE tier = 'np' AND type = 'lesson'`
  );
  const existingSlugs = new Set(existingResult.rows.map((r: { slug: string }) => r.slug));
  console.log(`[NP Seed] Found ${existingSlugs.size} existing NP lessons`);

  const toGenerate = allLessons
    .filter((l) => !existingSlugs.has(l.slug))
    .slice(startFrom);
  console.log(
    `[NP Seed] Generating ${toGenerate.length} new lessons (starting from index ${startFrom})`
  );

  if (dryRun) {
    console.log(
      "[NP Seed] DRY RUN - would generate:",
      toGenerate.length,
      "lessons"
    );
    return {
      generated: 0,
      flashcardsCreated: 0,
      questionsLinked: 0,
      validationRejections: 0,
      errors: 0,
    };
  }

  let generated = 0;
  let flashcardsCreated = 0;
  let questionsLinked = 0;
  let validationRejections = 0;
  let errors = 0;

  async function processLesson(lesson: NpLessonDef): Promise<boolean> {
    try {
      const dupCheck: QueryResult = await pool.query(
        `SELECT id, title FROM content_items WHERE slug = $1`,
        [lesson.slug]
      );
      if (dupCheck.rows.length > 0) {
        console.warn(`[NP-Lessons] Duplicate slug detected: "${lesson.slug}" already exists as "${dupCheck.rows[0].title}" (id: ${dupCheck.rows[0].id}). Skipping.`);
        return false;
      }

      const aiContent = await generateAILessonContent(openai, lesson);
      if (!aiContent) {
        console.warn(`[NP-Lessons] Validation rejected: "${lesson.title}" - AI content generation failed or empty`);
        validationRejections++;
        return false;
      }

      if (!aiContent.sections || aiContent.sections.length === 0) {
        console.warn(`[NP-Lessons] Skipping lesson "${lesson.title}" - empty content sections`);
        validationRejections++;
        return false;
      }

      console.log(`[NP-Lessons] Publishing: title="${lesson.title}", slug="${lesson.slug}", domain="${lesson.domain}", tier=np`);


      const summary =
        aiContent.sections
          .find((s) => s.type === "paragraph")
          ?.content?.substring(0, 300) || "";

      const insertResult: QueryResult = await pool.query(
        `INSERT INTO content_items (id, title, slug, type, category, body_system, tier, status, tags, summary, content, seo_title, seo_description, seo_keywords, primary_keyword, auto_publish, author_name, region_scope, updated_by_ai, created_at, updated_at, published_at)
         VALUES (gen_random_uuid(), $1, $2, 'lesson', $3, $4, 'np', 'published', $5::text[], $6, $7::jsonb, $8, $9, $10::text[], $11, true, 'NurseNest AI', 'BOTH', true, NOW(), NOW(), NOW())
         RETURNING id`,
        [
          lesson.title,
          lesson.slug,
          lesson.domain,
          lesson.domain,
          lesson.keywords,
          summary,
          JSON.stringify(aiContent.sections),
          `${lesson.title} | NP Exam Prep`,
          `Master ${lesson.title} for AANP & ANCC certification exams. Advanced pathophysiology, clinical decision-making, and prescribing guidelines.`,
          [lesson.domain.toLowerCase(), lesson.title.toLowerCase()],
          lesson.title.toLowerCase(),
        ]
      );

      const lessonId: string = insertResult.rows[0].id;
      generated++;

      for (const fc of aiContent.flashcards) {
        const hash = contentHash(fc.front, lesson.slug);
        try {
          const fcResult: QueryResult = await pool.query(
            `INSERT INTO flashcard_bank (id, tier, topic_tag, front, back, status, content_hash, source_type, body_system, topic, region_scope, lesson_links, created_at)
             VALUES (gen_random_uuid(), 'np', $1, $2, $3, 'published', $4, 'ai_generated', $5, $6, 'BOTH', $7, NOW())
             ON CONFLICT (content_hash) DO NOTHING
             RETURNING id`,
            [
              lesson.domain,
              fc.front,
              fc.back,
              hash,
              lesson.domain,
              lesson.title,
              JSON.stringify([
                {
                  lessonTitle: lesson.title,
                  lessonUrl: `/lessons/${lesson.slug}`,
                },
              ]),
            ]
          );
          if (fcResult.rowCount && fcResult.rowCount > 0) {
            flashcardsCreated++;
          }
        } catch (fcErr: unknown) {
          const code = (fcErr as { code?: string }).code;
          if (code !== "23505") {
            const msg = fcErr instanceof Error ? fcErr.message : String(fcErr);
            console.error(`[NP Seed] Flashcard insert error:`, msg);
          }
        }
      }

      const linked = await linkLessonToQuestions(
        pool,
        lessonId,
        lesson,
        aiContent.relatedTopicKeywords
      );
      questionsLinked += linked;

      return true;
    } catch (err: unknown) {
      errors++;
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[NP Seed] ✗ Error: "${lesson.title}":`, message);
      return false;
    }
  }

  for (let i = 0; i < toGenerate.length; i += batchSize) {
    const batch = toGenerate.slice(i, i + batchSize);
    console.log(
      `[NP Seed] Processing batch ${Math.floor(i / batchSize) + 1}: lessons ${i + 1}-${i + batch.length}`
    );

    for (let j = 0; j < batch.length; j += concurrency) {
      const chunk = batch.slice(j, j + concurrency);
      const results = await Promise.all(chunk.map(processLesson));
      const successCount = results.filter(Boolean).length;
      console.log(
        `[NP Seed] ✓ Chunk: ${successCount}/${chunk.length} succeeded (total: ${generated})`
      );
    }
  }

  const finalCount: QueryResult = await pool.query(
    `SELECT COUNT(*) as cnt FROM content_items WHERE tier = 'np' AND type = 'lesson' AND status = 'published'`
  );
  const totalLessons = parseInt(finalCount.rows[0].cnt, 10);

  console.log(`\n[NP Seed] === COMPLETE ===`);
  console.log(`[NP Seed] Generated this run: ${generated} lessons`);
  console.log(`[NP Seed] Total NP lessons in DB: ${totalLessons}`);
  console.log(`[NP Seed] Flashcards created: ${flashcardsCreated}`);
  console.log(`[NP Seed] Questions linked: ${questionsLinked}`);
  console.log(`[NP Seed] Validation rejections: ${validationRejections}`);
  console.log(`[NP Seed] Errors: ${errors}`);

  if (totalLessons < 300) {
    console.warn(
      `[NP Seed] ⚠ WARNING: Total NP lessons (${totalLessons}) is below target of 300. Re-run to fill gaps.`
    );
  }

  return { generated, flashcardsCreated, questionsLinked, validationRejections, errors };
}

export function getNpLessonPlan(): NpLessonDef[] {
  return buildLessonPlan();
}
