import OpenAI from "openai";
import { pool } from "./storage";

function getOpenAI(): OpenAI {
  return new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
}

function ensureModel(model: string): string {
  return model.startsWith("openai/") ? model : `openai/${model}`;
}

const SONO_EXAM_TARGETS = ["ardms", "sonography_canada"] as const;
type SonoExamTarget = typeof SONO_EXAM_TARGETS[number];

function getSonoExamTarget(index: number): { exam: SonoExamTarget; country: string } {
  return index % 2 === 0
    ? { exam: "ardms", country: "usa" }
    : { exam: "sonography_canada", country: "canada" };
}

const ARDMS_DOMAINS: Record<string, string[]> = {
  "SPI — Ultrasound Physics": [
    "Sound wave properties and propagation",
    "Acoustic impedance and reflection",
    "Attenuation and absorption",
    "Transducer construction and types",
    "Beam characteristics and focusing",
    "Spatial resolution (axial, lateral, elevational)",
    "Pulse-echo principle",
    "Frame rate and temporal resolution",
    "Piezoelectric effect",
    "Frequency selection and bandwidth",
  ],
  "SPI — Ultrasound Instrumentation": [
    "B-mode imaging principles",
    "M-mode applications",
    "Harmonic imaging",
    "Time gain compensation (TGC)",
    "Dynamic range and compression",
    "Preprocessing and postprocessing",
    "Image storage and DICOM",
    "3D/4D ultrasound technology",
    "Contrast-enhanced ultrasound agents",
    "Elastography principles",
  ],
  "SPI — Doppler Principles": [
    "Doppler effect and Doppler equation",
    "Continuous-wave Doppler",
    "Pulsed-wave Doppler",
    "Color flow Doppler mapping",
    "Power Doppler imaging",
    "Spectral analysis and waveform interpretation",
    "Aliasing and Nyquist limit",
    "Angle correction and cos theta",
    "Doppler sample volume placement",
    "Hemodynamic calculations (RI, PI, S/D ratio)",
  ],
  "SPI — Artifacts": [
    "Reverberation artifact",
    "Mirror artifact",
    "Shadowing (clean and dirty)",
    "Enhancement (posterior acoustic)",
    "Side lobe and grating lobe artifacts",
    "Ring-down artifact",
    "Comet tail artifact",
    "Refraction artifact",
    "Speed propagation artifact",
    "Slice thickness artifact",
  ],
  "Abdomen (AB) — Liver & Biliary": [
    "Hepatic anatomy and segmental anatomy (Couinaud)",
    "Liver parenchymal disease (fatty liver, cirrhosis)",
    "Hepatic masses (hemangioma, HCC, metastases)",
    "Gallbladder anatomy and wall thickening",
    "Cholelithiasis and cholecystitis",
    "Bile duct anatomy and dilation",
    "Choledocholithiasis",
    "Hepatic vascular anatomy (portal vein, hepatic veins)",
    "Budd-Chiari syndrome",
    "Liver transplant evaluation",
  ],
  "Abdomen (AB) — Pancreas, Spleen & Kidneys": [
    "Pancreatic anatomy and landmarks",
    "Acute and chronic pancreatitis",
    "Pancreatic masses and cysts",
    "Splenic anatomy and splenomegaly",
    "Splenic pathology (infarct, cysts, masses)",
    "Renal anatomy and cortical echogenicity",
    "Renal cysts (simple, complex, Bosniak)",
    "Renal masses (RCC, AML, oncocytoma)",
    "Hydronephrosis grading",
    "Renal artery stenosis and Doppler criteria",
  ],
  "OB/GYN — Obstetric Sonography": [
    "First trimester dating (CRL, gestational sac)",
    "BPD, HC, AC, FL measurements",
    "Fetal anatomy survey (second trimester)",
    "Placental grading and location",
    "Amniotic fluid assessment (AFI, MVP)",
    "Biophysical profile scoring",
    "Multiple gestation evaluation",
    "Fetal growth restriction (IUGR/FGR)",
    "Ectopic pregnancy evaluation",
    "Nuchal translucency screening",
  ],
  "OB/GYN — Gynecologic Sonography": [
    "Uterine anatomy (transabdominal and transvaginal)",
    "Endometrial assessment and thickness",
    "Uterine leiomyomas (fibroids) classification",
    "Adenomyosis sonographic features",
    "Ovarian anatomy and follicular monitoring",
    "Ovarian cysts (functional, dermoid, endometrioma)",
    "Ovarian torsion evaluation",
    "Polycystic ovarian morphology",
    "Pelvic inflammatory disease",
    "Postmenopausal bleeding evaluation",
  ],
  "Vascular Technology (VT) — Cerebrovascular": [
    "Carotid artery anatomy (CCA, ICA, ECA)",
    "Carotid stenosis grading criteria",
    "Carotid plaque characterization",
    "Vertebral artery assessment",
    "Subclavian steal syndrome",
    "Transcranial Doppler basics",
    "ICA/ECA differentiation techniques",
    "Carotid body tumors",
    "Post-endarterectomy evaluation",
    "Temporal tap maneuver",
  ],
  "Vascular Technology (VT) — Peripheral Vascular": [
    "Lower extremity arterial anatomy",
    "Ankle-brachial index (ABI) measurement",
    "Arterial waveform patterns (triphasic, biphasic, monophasic)",
    "Deep vein thrombosis (DVT) evaluation",
    "Venous compression technique",
    "Venous insufficiency and reflux testing",
    "Upper extremity venous assessment",
    "Pseudoaneurysm evaluation",
    "Arteriovenous fistula assessment",
    "Mesenteric artery Doppler",
  ],
};

const SONOGRAPHY_CANADA_DOMAINS: Record<string, string[]> = {
  "General Sonography — Abdominal": [
    "Hepatic anatomy and segmental anatomy",
    "Gallbladder pathology and biliary assessment",
    "Pancreatic anatomy and pathology",
    "Renal anatomy, cysts, and masses",
    "Splenic assessment and pathology",
    "Aortic assessment and AAA screening",
    "Retroperitoneal anatomy and lymphadenopathy",
    "Adrenal gland assessment",
    "Bowel sonography basics",
    "Peritoneal fluid assessment (ascites)",
  ],
  "General Sonography — Obstetrics": [
    "First trimester assessment and dating",
    "Second trimester anatomy survey",
    "Fetal biometric measurements",
    "Placental assessment and cord insertion",
    "Amniotic fluid evaluation",
    "Cervical length measurement",
    "Multiple pregnancy assessment",
    "Fetal well-being assessment (BPP)",
    "Maternal complications (preeclampsia screening)",
    "Congenital anomaly detection",
  ],
  "General Sonography — Gynecology": [
    "Uterine anatomy and variants",
    "Endometrial pathology assessment",
    "Myometrial pathology (fibroids, adenomyosis)",
    "Ovarian pathology and cyst characterization",
    "Pelvic mass evaluation",
    "Infertility assessment and follicular tracking",
    "Early pregnancy complications",
    "IUD localization",
    "Pelvic floor assessment",
    "Postmenopausal uterine assessment",
  ],
  "Vascular Sonography — Cerebrovascular": [
    "Carotid duplex examination technique",
    "Stenosis grading (NASCET criteria)",
    "Vertebral artery evaluation",
    "Plaque morphology and characterization",
    "Post-surgical carotid assessment",
    "Internal vs external carotid differentiation",
    "Carotid intima-media thickness",
    "Common carotid waveform analysis",
    "Carotid dissection recognition",
    "Subclavian steal identification",
  ],
  "Vascular Sonography — Peripheral": [
    "Lower extremity DVT protocol",
    "Upper extremity DVT assessment",
    "Venous insufficiency mapping",
    "Arterial duplex examination",
    "ABI interpretation in Canadian guidelines",
    "Dialysis access assessment",
    "Pseudoaneurysm identification and management",
    "Superficial thrombophlebitis",
    "Chronic venous disease classification",
    "Arterial bypass graft surveillance",
  ],
  "Ultrasound Physics & Instrumentation": [
    "Sound propagation in soft tissue",
    "Transducer selection and frequency considerations",
    "Resolution principles (axial, lateral, temporal)",
    "Doppler physics and hemodynamics",
    "Artifact recognition and correction",
    "Image optimization techniques",
    "Harmonic imaging applications",
    "Quality assurance in ultrasound",
    "Biological effects and safety indices (TI, MI)",
    "ALARA principle in ultrasound",
  ],
  "Patient Care & Safety": [
    "Patient preparation for sonographic exams",
    "Infection control in ultrasound",
    "Ergonomics for sonographers",
    "Patient communication and consent",
    "Transducer disinfection protocols",
    "Emergency situations during scanning",
    "Sonographer work-related musculoskeletal disorders",
    "Documentation and reporting standards",
    "Ethical considerations in sonography",
    "Privacy legislation (PIPEDA) in imaging",
  ],
  "Small Parts & Musculoskeletal": [
    "Thyroid anatomy and nodule assessment",
    "Thyroid TIRADS classification",
    "Breast ultrasound and BIRADS",
    "Scrotal anatomy and pathology",
    "Testicular torsion evaluation",
    "Neonatal hip assessment (Graf method)",
    "Musculoskeletal tendon evaluation",
    "Superficial lymph node assessment",
    "Salivary gland evaluation",
    "Soft tissue mass characterization",
  ],
  "Cardiac Basics & Point-of-Care": [
    "Basic echocardiographic views",
    "Chamber size assessment",
    "Left ventricular function estimation",
    "Pericardial effusion detection",
    "Valvular assessment basics",
    "Point-of-care ultrasound (POCUS) applications",
    "Focused cardiac ultrasound (FOCUS)",
    "IVC assessment for fluid status",
    "Lung ultrasound basics",
    "FAST exam protocol",
  ],
};

const QUESTION_TYPES = [
  "multiple_choice",
  "image_interpretation",
  "physics_calculation",
  "clinical_scenario",
] as const;
type QuestionType = typeof QUESTION_TYPES[number];

function getQuestionTypeForIndex(index: number): QuestionType {
  const distribution = [
    "clinical_scenario", "clinical_scenario", "clinical_scenario", "clinical_scenario",
    "multiple_choice", "multiple_choice", "multiple_choice",
    "image_interpretation", "image_interpretation",
    "physics_calculation",
  ];
  return distribution[index % distribution.length] as QuestionType;
}

const SONO_CONTENT_DOMAINS: string[] = [
  "Ultrasound Physics",
  "Ultrasound Instrumentation",
  "Abdominal Sonography",
  "Obstetric Sonography",
  "Gynecologic Sonography",
  "Vascular Sonography",
  "Cardiac Basics",
  "Image Optimization",
  "Doppler Principles",
  "Patient Safety",
];

const SONO_DOMAIN_TO_ARDMS: Record<string, string> = {
  "Ultrasound Physics": "SPI — Ultrasound Physics",
  "Ultrasound Instrumentation": "SPI — Ultrasound Instrumentation",
  "Abdominal Sonography": "Abdomen (AB) — Liver & Biliary",
  "Obstetric Sonography": "OB/GYN — Obstetric Sonography",
  "Gynecologic Sonography": "OB/GYN — Gynecologic Sonography",
  "Vascular Sonography": "Vascular Technology (VT) — Cerebrovascular",
  "Cardiac Basics": "SPI — Ultrasound Instrumentation",
  "Image Optimization": "SPI — Artifacts",
  "Doppler Principles": "SPI — Doppler Principles",
  "Patient Safety": "SPI — Ultrasound Physics",
};

const SONO_DOMAIN_TO_CANADA: Record<string, string> = {
  "Ultrasound Physics": "Ultrasound Physics & Instrumentation",
  "Ultrasound Instrumentation": "Ultrasound Physics & Instrumentation",
  "Abdominal Sonography": "General Sonography — Abdominal",
  "Obstetric Sonography": "General Sonography — Obstetrics",
  "Gynecologic Sonography": "General Sonography — Gynecology",
  "Vascular Sonography": "Vascular Sonography — Cerebrovascular",
  "Cardiac Basics": "Cardiac Basics & Point-of-Care",
  "Image Optimization": "Ultrasound Physics & Instrumentation",
  "Doppler Principles": "Vascular Sonography — Peripheral",
  "Patient Safety": "Patient Care & Safety",
};

const SONO_STUDY_TOPIC_MAP: Record<string, string> = {
  "Ultrasound Physics": "ultrasound-physics-spi",
  "Ultrasound Instrumentation": "ultrasound-physics-spi",
  "Abdominal Sonography": "abdominal-sonography",
  "Obstetric Sonography": "obstetric-sonography",
  "Gynecologic Sonography": "gynecologic-sonography",
  "Vascular Sonography": "vascular-sonography",
  "Cardiac Basics": "doppler-hemodynamics",
  "Image Optimization": "ultrasound-physics-spi",
  "Doppler Principles": "doppler-hemodynamics",
  "Patient Safety": "ultrasound-physics-spi",
};

interface GeneratedSonoQuestion {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  rationale: string;
  clinical_pearl: string;
  imaging_practice_notes: string;
  topic: string;
  difficulty: number;
  question_type: string;
}

export interface SonoGenerationProgress {
  totalGenerated: number;
  totalFlashcards: number;
  totalDuplicatesSkipped: number;
  domainCounts: Record<string, number>;
  difficultyCounts: Record<number, number>;
  countryCounts: Record<string, number>;
  questionTypeCounts: Record<string, number>;
  batchResults: Array<{
    batchNumber: number;
    domain: string;
    country: string;
    questionsGenerated: number;
    flashcardsCreated: number;
    duplicatesSkipped: number;
  }>;
  errors: string[];
}

function getMasteryCategory(difficulty: number): string {
  if (difficulty <= 2) return "low";
  if (difficulty <= 3) return "moderate";
  return "high";
}

function shuffleAnswerPositions(
  options: { A: string; B: string; C: string; D: string },
  correctLetter: string
): { options: { A: string; B: string; C: string; D: string }; correctLetter: string } {
  const entries = [
    { text: options.A, isCorrect: correctLetter === "A" },
    { text: options.B, isCorrect: correctLetter === "B" },
    { text: options.C, isCorrect: correctLetter === "C" },
    { text: options.D, isCorrect: correctLetter === "D" },
  ];
  for (let i = entries.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [entries[i], entries[j]] = [entries[j], entries[i]];
  }
  const shuffled = { A: entries[0].text, B: entries[1].text, C: entries[2].text, D: entries[3].text };
  const newCorrect = ["A", "B", "C", "D"][entries.findIndex(e => e.isCorrect)] || "A";
  return { options: shuffled, correctLetter: newCorrect };
}

function computeDifficultyDistribution(
  batchSize: number,
  globalCounts: Record<number, number>,
  globalTarget: number,
): { counts: Record<number, number> } {
  const totalSoFar = Object.values(globalCounts).reduce((a, b) => a + b, 0);
  const remaining = Math.max(globalTarget - totalSoFar, batchSize);
  const targetPcts: Record<number, number> = { 1: 0.15, 2: 0.25, 3: 0.30, 4: 0.20, 5: 0.10 };
  const counts: Record<number, number> = {};
  let assigned = 0;
  for (const [d, pct] of Object.entries(targetPcts)) {
    const diff = Number(d);
    const ideal = Math.round(remaining * pct);
    const needed = Math.max(0, ideal - (globalCounts[diff] || 0));
    counts[diff] = needed;
    assigned += needed;
  }
  if (assigned === 0) {
    counts[1] = Math.round(batchSize * 0.15);
    counts[2] = Math.round(batchSize * 0.25);
    counts[3] = Math.round(batchSize * 0.30);
    counts[4] = Math.round(batchSize * 0.20);
    counts[5] = batchSize - counts[1] - counts[2] - counts[3] - counts[4];
  } else {
    const scale = batchSize / assigned;
    let sum = 0;
    for (const d of [1, 2, 3, 4, 5]) {
      counts[d] = Math.max(1, Math.round(counts[d] * scale));
      sum += counts[d];
    }
    counts[3] += batchSize - sum;
  }
  return { counts };
}

function getQuestionTypePrompt(qType: QuestionType): string {
  switch (qType) {
    case "image_interpretation":
      return `The question must describe a sonographic image finding in text (e.g., "A sonographic image of the right upper quadrant demonstrates a well-defined anechoic structure with posterior acoustic enhancement measuring 3.2 cm..."). The question should ask the student to identify the pathology, interpret the finding, or determine the next step. Do NOT reference actual image files.`;
    case "physics_calculation":
      return `The question must involve an ultrasound physics calculation or quantitative concept (e.g., Doppler equation, wavelength calculation, PRF determination, depth calculation, Nyquist limit). Provide the necessary numerical values in the stem and expect a calculated answer.`;
    case "clinical_scenario":
      return `The question must present a detailed clinical scenario including patient demographics (age, sex), chief complaint, relevant history, and sonographic findings. Ask the student to identify pathology, determine next steps, or select the most appropriate diagnosis.`;
    default:
      return `Standard multiple-choice question testing recall or application of sonographic knowledge.`;
  }
}

async function generateSonoBatch(
  domain: string,
  topics: string[],
  batchSize: number,
  globalDifficultyCounts: Record<number, number>,
  globalTarget: number,
  country: string,
  examStructure: string,
  questionType: QuestionType,
): Promise<GeneratedSonoQuestion[]> {
  const openai = getOpenAI();
  const topicsList = topics.slice(0, 8).join(", ");
  const { counts } = computeDifficultyDistribution(batchSize, globalDifficultyCounts, globalTarget);

  const diffInstructions = Object.entries(counts)
    .map(([d, c]) => `- ${c} questions at difficulty ${d}`)
    .join("\n");

  const typePrompt = getQuestionTypePrompt(questionType);

  const regionContext = country === "usa"
    ? `These questions are for ARDMS (American Registry for Diagnostic Medical Sonography) certification preparation. Use ARDMS exam domain: ${examStructure}. Reference US clinical standards, AIUM guidelines, and ACR appropriateness criteria where relevant.`
    : `These questions are for Sonography Canada certification preparation. Use Sonography Canada domain: ${examStructure}. Reference Canadian clinical standards, provincial health guidelines, and Sonography Canada competency profiles where relevant.`;

  const systemPrompt = `You are a senior diagnostic medical sonography educator and board exam item writer specializing in ${country === "usa" ? "ARDMS" : "Sonography Canada"} certification preparation.

CRITICAL RULES:
1. Return ONLY valid JSON. No markdown, no code fences, no prose.
2. ${typePrompt}
3. Four answer choices per question (A/B/C/D), one correct, three plausible distractors.
4. Distractors must reflect common sonographic misconceptions, measurement errors, or interpretation mistakes.
5. Include detailed rationale explaining why the correct answer is right and why each distractor is wrong.
6. Include a clinical pearl specific to sonography practice.
7. Include imaging practice notes about scanning technique, transducer selection, or patient positioning.
8. Do NOT use emoji characters anywhere. Plain text only.
9. Each question must be unique with a distinct clinical context.
10. ${regionContext}`;

  const userPrompt = `Generate exactly ${batchSize} diagnostic medical sonography exam questions for the domain "${domain}".

Topics to cover: ${topicsList}

Question type: ${questionType.replace(/_/g, " ")}

IMPORTANT - Difficulty distribution (difficulty 1-5 scale, MUST follow):
${diffInstructions}

Each question MUST have its own "difficulty" field set to the appropriate level (1=easy recall, 2=basic application, 3=moderate analysis, 4=advanced synthesis, 5=expert critical thinking).

Return JSON with this exact structure:
{
  "questions": [
    {
      "question_text": "A detailed sonography question stem. Minimum 80 characters.",
      "option_a": "First answer choice text",
      "option_b": "Second answer choice text",
      "option_c": "Third answer choice text",
      "option_d": "Fourth answer choice text",
      "correct_answer": "A or B or C or D",
      "rationale": "Detailed explanation: why the correct answer is right, why each distractor is wrong.",
      "clinical_pearl": "A concise, memorable sonography clinical pearl (1-2 sentences).",
      "imaging_practice_notes": "Practical sonographic technique, transducer selection, or patient positioning note (1-2 sentences).",
      "topic": "Specific topic within the domain",
      "difficulty": 1-5,
      "question_type": "${questionType}"
    }
  ]
}

Generate exactly ${batchSize} unique questions. JSON only.`;

  const maxRetries = 2;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: ensureModel("gpt-4o-mini"),
        temperature: 0.85,
        max_tokens: 16384,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error("No content returned from AI");

      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(content) as Record<string, unknown>;
      } catch {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
        } else {
          throw new Error("No valid JSON found in response");
        }
      }

      const rawQuestions = (parsed.questions || parsed.items || []) as Record<string, unknown>[];
      if (!Array.isArray(rawQuestions) || rawQuestions.length === 0) {
        throw new Error(`No questions array found (attempt ${attempt + 1})`);
      }

      const validated: GeneratedSonoQuestion[] = rawQuestions
        .filter((q): q is Record<string, unknown> =>
          typeof q === "object" && q !== null &&
          typeof q.question_text === "string" && (q.question_text as string).length >= 30 &&
          typeof q.option_a === "string" && typeof q.option_b === "string" &&
          typeof q.option_c === "string" && typeof q.option_d === "string" &&
          typeof q.correct_answer === "string" &&
          ["A", "B", "C", "D"].includes((q.correct_answer as string).toUpperCase()) &&
          typeof q.rationale === "string"
        )
        .map((q) => ({
          question_text: q.question_text as string,
          option_a: q.option_a as string,
          option_b: q.option_b as string,
          option_c: q.option_c as string,
          option_d: q.option_d as string,
          correct_answer: (q.correct_answer as string).toUpperCase(),
          rationale: q.rationale as string,
          clinical_pearl: (q.clinical_pearl as string) || "",
          imaging_practice_notes: (q.imaging_practice_notes as string) || "",
          topic: (q.topic as string) || topics[0] || domain,
          difficulty: [1, 2, 3, 4, 5].includes(Number(q.difficulty)) ? Number(q.difficulty) : 3,
          question_type: (q.question_type as string) || questionType,
        }));

      if (validated.length > 0) {
        return validated;
      }

      console.log(`[SonoGen] Attempt ${attempt + 1}: ${rawQuestions.length} items but 0 valid, retrying...`);
    } catch (err: unknown) {
      console.error(`[SonoGen] Attempt ${attempt + 1} error:`, (err as Error).message);
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }

  return [];
}

async function checkSonoDuplicates(questionTexts: string[]): Promise<Set<string>> {
  const duplicates = new Set<string>();
  if (questionTexts.length === 0) return duplicates;

  for (const text of questionTexts) {
    const shortText = text.substring(0, 100);
    try {
      const result = await pool.query(
        `SELECT id FROM imaging_questions WHERE question LIKE $1 AND modality = 'ultrasound' LIMIT 1`,
        [`${shortText}%`]
      );
      if (result.rows.length > 0) {
        duplicates.add(text);
      }
    } catch (err: unknown) {
      console.error(`[SonoGen] Duplicate check error:`, (err as Error).message);
    }
  }

  return duplicates;
}

interface SonoPreparedInsert {
  question: GeneratedSonoQuestion;
  options: { A: string; B: string; C: string; D: string };
  correctLetter: string;
  fullRationale: string;
  mastery: string;
  exam: SonoExamTarget;
  country: string;
  domain: string;
  examDomain: string;
  studyTopicSlug: string;
}

function prepareSonoInsert(
  q: GeneratedSonoQuestion,
  domain: string,
  exam: SonoExamTarget,
  country: string,
  examDomain: string,
): SonoPreparedInsert {
  const { options, correctLetter } = shuffleAnswerPositions(
    { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d },
    q.correct_answer
  );

  const studyTopicSlug = SONO_STUDY_TOPIC_MAP[domain] || "ultrasound-physics-spi";
  const lessonLink = `To review this concept, see the NurseNest lesson: ${domain} -> /allied-health/diagnostic-sonography/study/${studyTopicSlug}`;
  const fullRationale = `${q.rationale}\n\nClinical Pearl: ${q.clinical_pearl}\n\nSonography Practice Note: ${q.imaging_practice_notes}\n\n${lessonLink}`;
  const mastery = getMasteryCategory(q.difficulty);

  return { question: q, options, correctLetter, fullRationale, mastery, exam, country, domain, examDomain, studyTopicSlug };
}

async function bulkInsertSonoBatch(
  inserts: SonoPreparedInsert[],
): Promise<{ questionsInserted: number; flashcardsCreated: number }> {
  if (inserts.length === 0) return { questionsInserted: 0, flashcardsCreated: 0 };

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    let questionsInserted = 0;
    let flashcardsCreated = 0;

    for (const ins of inserts) {
      await client.query(
        `INSERT INTO imaging_questions 
          (id, question, option_a, option_b, option_c, option_d, correct_answer, rationale, 
           modality, category, difficulty, country, topic, status, exam_domain, mastery_category, 
           clinical_pearls, imaging_practice_notes, exam, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW(), NOW())`,
        [
          ins.question.question_text,
          ins.options.A, ins.options.B, ins.options.C, ins.options.D,
          ins.correctLetter,
          ins.fullRationale,
          "ultrasound",
          ins.domain,
          ins.question.difficulty,
          ins.country,
          ins.question.topic || ins.domain,
          "published",
          ins.examDomain,
          ins.mastery,
          ins.question.clinical_pearl || null,
          ins.question.imaging_practice_notes || null,
          ins.exam,
        ]
      );
      questionsInserted++;

      const flashcardFront = `Sonography: ${ins.question.topic || ins.domain} — ${ins.question.question_type === "physics_calculation" ? "Calculate or explain" : "What is the key finding or principle?"}`;
      const rationaleSummary = ins.question.rationale.length > 200
        ? ins.question.rationale.substring(0, 200).trim() + "..."
        : ins.question.rationale;
      const flashcardBack = `Summary: ${rationaleSummary}\n\nClinical Pearl: ${ins.question.clinical_pearl || "Key sonography concept."}\n\nSonography Technique: ${ins.question.imaging_practice_notes || "Standard scanning technique applies."}`;

      await client.query(
        `INSERT INTO imaging_flashcards 
          (id, front, back, category, difficulty, country, exam_type, topic, status, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
        [
          flashcardFront,
          flashcardBack,
          ins.domain,
          ins.question.difficulty,
          ins.country,
          ins.exam,
          ins.question.topic || ins.domain,
          "published",
        ]
      );
      flashcardsCreated++;
    }

    await client.query("COMMIT");
    return { questionsInserted, flashcardsCreated };
  } catch (err: unknown) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function runSonographyQuestionGeneration(
  targetCount: number = 1500,
  batchSize: number = 100,
  onProgress?: (progress: SonoGenerationProgress) => void
): Promise<SonoGenerationProgress> {
  const result = await pool.query("SELECT current_database() as db, NOW() as ts");
  console.log(`[SonoGen] Connected to database: ${result.rows[0]?.db} at ${result.rows[0]?.ts}`);

  const tableCheck = await pool.query(
    `SELECT COUNT(*)::int as c FROM information_schema.tables 
     WHERE table_schema = 'public' AND table_name IN ('imaging_questions', 'imaging_flashcards')`
  );
  if (tableCheck.rows[0]?.c < 2) {
    throw new Error("Required tables imaging_questions and/or imaging_flashcards not found");
  }

  const progress: SonoGenerationProgress = {
    totalGenerated: 0,
    totalFlashcards: 0,
    totalDuplicatesSkipped: 0,
    domainCounts: {},
    difficultyCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    countryCounts: { usa: 0, canada: 0 },
    questionTypeCounts: {},
    batchResults: [],
    errors: [],
  };

  const MAX_CONSECUTIVE_FAILURES = 5;
  const MAX_TOTAL_BATCHES = Math.ceil(targetCount * 1.5 / batchSize);
  let batchNum = 0;
  let consecutiveFailures = 0;

  console.log(`[SonoGen] Starting sonography generation: target=${targetCount}, batchSize=${batchSize}, maxBatches=${MAX_TOTAL_BATCHES}`);

  while (progress.totalGenerated < targetCount && batchNum < MAX_TOTAL_BATCHES) {
    batchNum++;

    const domainIndex = (batchNum - 1) % SONO_CONTENT_DOMAINS.length;
    const domain = SONO_CONTENT_DOMAINS[domainIndex];
    const { exam, country } = getSonoExamTarget(batchNum);

    const examDomainMap = country === "usa" ? SONO_DOMAIN_TO_ARDMS : SONO_DOMAIN_TO_CANADA;
    const examDomainKey = examDomainMap[domain] || domain;
    const topicsSource = country === "usa" ? ARDMS_DOMAINS : SONOGRAPHY_CANADA_DOMAINS;
    const topics = topicsSource[examDomainKey] || [domain];

    const questionType = getQuestionTypeForIndex(batchNum);
    const remaining = targetCount - progress.totalGenerated;
    const thisBatchSize = Math.min(batchSize, remaining);

    console.log(`[SonoGen] Batch ${batchNum}: domain="${domain}", country=${country}, type=${questionType}, size=${thisBatchSize}, progress=${progress.totalGenerated}/${targetCount}`);

    try {
      const questions = await generateSonoBatch(
        domain, topics, thisBatchSize,
        progress.difficultyCounts, targetCount,
        country, examDomainKey, questionType
      );

      if (questions.length === 0) {
        consecutiveFailures++;
        console.log(`[SonoGen] Batch ${batchNum}: no valid questions (${consecutiveFailures}/${MAX_CONSECUTIVE_FAILURES})`);
        progress.batchResults.push({
          batchNumber: batchNum, domain, country,
          questionsGenerated: 0, flashcardsCreated: 0, duplicatesSkipped: 0,
        });

        if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
          progress.errors.push(`Stopping: ${MAX_CONSECUTIVE_FAILURES} consecutive batch failures`);
          break;
        }
        await new Promise(r => setTimeout(r, 3000));
        continue;
      }

      consecutiveFailures = 0;

      const questionTexts = questions.map(q => q.question_text);
      const duplicates = await checkSonoDuplicates(questionTexts);

      const inserts: SonoPreparedInsert[] = [];
      let duplicatesSkipped = 0;

      for (const q of questions) {
        if (progress.totalGenerated + inserts.length >= targetCount) break;

        if (duplicates.has(q.question_text)) {
          duplicatesSkipped++;
          continue;
        }

        inserts.push(prepareSonoInsert(q, domain, exam, country, examDomainKey));
      }

      let questionsInserted = 0;
      let flashcardsCreated = 0;

      if (inserts.length > 0) {
        try {
          const result = await bulkInsertSonoBatch(inserts);
          questionsInserted = result.questionsInserted;
          flashcardsCreated = result.flashcardsCreated;

          progress.totalGenerated += questionsInserted;
          progress.totalFlashcards += flashcardsCreated;

          for (const ins of inserts) {
            progress.difficultyCounts[ins.question.difficulty] = (progress.difficultyCounts[ins.question.difficulty] || 0) + 1;
            progress.domainCounts[domain] = (progress.domainCounts[domain] || 0) + 1;
            progress.countryCounts[country] = (progress.countryCounts[country] || 0) + 1;
            const qt = ins.question.question_type || "multiple_choice";
            progress.questionTypeCounts[qt] = (progress.questionTypeCounts[qt] || 0) + 1;
          }
        } catch (err: unknown) {
          const errMsg = (err as Error).message;
          console.error(`[SonoGen] Bulk insert error for batch ${batchNum} (${domain}):`, errMsg);
          progress.errors.push(`Bulk insert error (${domain}): ${errMsg}`);
        }
      }

      progress.totalDuplicatesSkipped += duplicatesSkipped;

      progress.batchResults.push({
        batchNumber: batchNum, domain, country,
        questionsGenerated: questionsInserted,
        flashcardsCreated,
        duplicatesSkipped,
      });

      console.log(
        `[SonoGen] Batch ${batchNum} complete: ${questionsInserted} questions, ${flashcardsCreated} flashcards, ${duplicatesSkipped} dupes. Total: ${progress.totalGenerated}/${targetCount}`
      );

      if (onProgress) onProgress(progress);
      await new Promise(r => setTimeout(r, 1500));
    } catch (err: unknown) {
      const errMsg = (err as Error).message;
      consecutiveFailures++;
      console.error(`[SonoGen] Batch ${batchNum} error:`, errMsg);
      progress.errors.push(`Batch ${batchNum} (${domain}): ${errMsg}`);
      progress.batchResults.push({
        batchNumber: batchNum, domain, country,
        questionsGenerated: 0, flashcardsCreated: 0, duplicatesSkipped: 0,
      });

      if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        progress.errors.push(`Stopping: ${MAX_CONSECUTIVE_FAILURES} consecutive failures`);
        break;
      }
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  console.log(`[SonoGen] === SONOGRAPHY GENERATION COMPLETE ===`);
  console.log(`[SonoGen] Total questions: ${progress.totalGenerated}`);
  console.log(`[SonoGen] Total flashcards: ${progress.totalFlashcards}`);
  console.log(`[SonoGen] Total duplicates skipped: ${progress.totalDuplicatesSkipped}`);
  console.log(`[SonoGen] Difficulty distribution:`, JSON.stringify(progress.difficultyCounts));
  console.log(`[SonoGen] Country distribution:`, JSON.stringify(progress.countryCounts));
  console.log(`[SonoGen] Question type distribution:`, JSON.stringify(progress.questionTypeCounts));
  console.log(`[SonoGen] Domain distribution:`, JSON.stringify(progress.domainCounts));
  if (progress.errors.length > 0) {
    console.log(`[SonoGen] Errors (${progress.errors.length}):`, progress.errors.slice(0, 10));
  }

  return progress;
}

export async function ensureSonographyColumns(): Promise<void> {
  const columns = [
    { name: "modality", type: "VARCHAR(100)" },
    { name: "exam_domain", type: "VARCHAR(100)" },
    { name: "mastery_category", type: "VARCHAR(20)" },
    { name: "clinical_pearls", type: "TEXT" },
    { name: "imaging_practice_notes", type: "TEXT" },
  ];

  for (const col of columns) {
    try {
      await pool.query(
        `ALTER TABLE imaging_questions ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}`
      );
    } catch (err: unknown) {
      console.log(`[SonoGen] Column ${col.name} may already exist:`, (err as Error).message);
    }
  }
}
