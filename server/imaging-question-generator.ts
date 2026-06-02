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

const EXAM_TARGETS = ["camrt", "arrt", "general"] as const;
type ExamTarget = typeof EXAM_TARGETS[number];

function getExamTarget(index: number): { exam: ExamTarget; country: string } {
  const mod = index % 3;
  if (mod === 0) return { exam: "camrt", country: "canada" };
  if (mod === 1) return { exam: "arrt", country: "usa" };
  return { exam: "general", country: "both" };
}

const CONTENT_DOMAINS: string[] = [
  "Radiographic Positioning",
  "Anatomy for Imaging",
  "Image Production",
  "Radiation Physics",
  "Radiation Protection",
  "Patient Care in Imaging",
  "Contrast Media Basics",
  "Trauma Imaging",
  "Quality Assurance",
  "Image Evaluation",
  "Cross-Sectional Imaging Foundations",
  "Fluoroscopy/Mobile Imaging Basics",
];

const DOMAIN_MODULE_MAP: Record<string, string> = {
  "Radiographic Positioning": "positioning",
  "Anatomy for Imaging": "positioning",
  "Image Production": "image_production",
  "Radiation Physics": "physics",
  "Radiation Protection": "radiation_safety",
  "Patient Care in Imaging": "patient_care",
  "Contrast Media Basics": "patient_care",
  "Trauma Imaging": "positioning",
  "Quality Assurance": "equipment",
  "Image Evaluation": "image_production",
  "Cross-Sectional Imaging Foundations": "equipment",
  "Fluoroscopy/Mobile Imaging Basics": "equipment",
};

const DOMAIN_TOPICS: Record<string, string[]> = {
  "Radiographic Positioning": [
    "AP/PA chest positioning", "Lateral chest view", "Shoulder positioning (AP, axillary, Y-view)",
    "Knee positioning (AP, lateral, tunnel view)", "Ankle positioning (AP, lateral, mortise)",
    "Cervical spine views", "Lumbar spine views", "Hand/wrist positioning",
    "Hip positioning (AP, frog-leg lateral)", "Skull positioning (Caldwell, Waters, Towne)",
    "Elbow positioning", "Foot positioning", "Pelvis AP positioning",
  ],
  "Anatomy for Imaging": [
    "Thoracic anatomy landmarks", "Abdominal quadrant anatomy", "Skeletal anatomy of upper extremity",
    "Skeletal anatomy of lower extremity", "Vertebral column anatomy", "Cranial anatomy for imaging",
    "Pelvic anatomy landmarks", "Surface anatomy landmarks", "Joint anatomy and classification",
    "Respiratory system anatomy", "Cardiovascular anatomy for imaging", "GI tract anatomy",
  ],
  "Image Production": [
    "mAs and density relationship", "kVp and contrast relationship", "Focal spot size and resolution",
    "SID and image quality", "OID effects on magnification", "Grid ratio and scatter cleanup",
    "Automatic exposure control (AEC)", "Digital detector dose indicators", "Image receptor types",
    "Collimation and scatter reduction", "Exposure index interpretation", "Anode heel effect",
  ],
  "Radiation Physics": [
    "X-ray production process", "Compton scattering", "Photoelectric absorption",
    "Bremsstrahlung radiation", "Characteristic radiation", "Beam filtration",
    "Half-value layer", "Inverse square law", "X-ray tube components",
    "Electromagnetic spectrum properties", "Photon interactions with matter", "Tube current and tube voltage",
  ],
  "Radiation Protection": [
    "ALARA principle", "Cardinal principles of radiation protection", "Lead shielding requirements",
    "Dose limits for occupational workers", "Dose limits for public", "Personnel dosimetry",
    "Pregnancy and radiation exposure", "Pediatric dose reduction strategies",
    "Collimation for dose reduction", "Scatter radiation management", "Radiation units (rem, Sv, mGy)",
    "Biological effects of radiation",
  ],
  "Patient Care in Imaging": [
    "Patient identification and verification", "Informed consent for procedures", "Infection control in imaging",
    "Contrast media reactions management", "Patient transfer and immobilization", "Vital signs monitoring",
    "Oxygen administration during procedures", "Venipuncture technique for contrast injection",
    "Fall prevention in radiology", "Patient communication and education", "Medical emergency response",
    "Pediatric patient care considerations",
  ],
  "Contrast Media Basics": [
    "Iodinated contrast media types", "Barium sulfate preparations", "Contrast reaction classifications",
    "Metformin and contrast protocols", "Contrast nephropathy prevention", "GFR/eGFR assessment",
    "Oral vs IV contrast indications", "Gadolinium contrast for MRI", "Contrast injection rates",
    "Allergic-like contrast reactions", "Contrast extravasation management", "NPO guidelines for contrast",
  ],
  "Trauma Imaging": [
    "Cross-table lateral cervical spine", "Trauma chest radiograph", "AP pelvis in trauma",
    "Swimmer's view technique", "Trauma extremity imaging", "Portable/mobile imaging techniques",
    "Trauma abdomen imaging", "Spinal immobilization during imaging", "Trauma skull imaging",
    "Dorsal decubitus positioning", "Grid use in trauma imaging", "Pediatric trauma imaging",
  ],
  "Quality Assurance": [
    "Processor quality control", "Phantom image testing", "Reject analysis",
    "Sensitometry and densitometry", "Digital detector calibration", "Lead apron inspection",
    "Collimator accuracy testing", "Beam alignment verification", "Repeat/reject rate analysis",
    "Display monitor quality control", "Equipment warm-up procedures", "Exposure reproducibility testing",
  ],
  "Image Evaluation": [
    "Density/brightness evaluation", "Contrast assessment", "Spatial resolution factors",
    "Motion artifact identification", "Positioning error identification", "Scatter artifact recognition",
    "Digital image processing (windowing/leveling)", "Image noise evaluation",
    "Quantum mottle identification", "Grid artifact recognition", "Exposure indicator assessment",
    "Anatomical marker evaluation",
  ],
  "Cross-Sectional Imaging Foundations": [
    "CT scan principles", "CT window settings", "Hounsfield units",
    "MRI basic physics (T1, T2)", "CT contrast timing phases", "Axial vs sagittal vs coronal planes",
    "CT artifact types", "MRI safety screening", "CT dose index (CTDI)",
    "Slice thickness and resolution", "CT reconstruction algorithms", "MRI contraindications",
  ],
  "Fluoroscopy/Mobile Imaging Basics": [
    "Fluoroscopy radiation dose management", "C-arm operation basics", "Image intensifier components",
    "Fluoroscopy time limits", "Portable/mobile X-ray setup", "Fluoroscopic spot filming",
    "Barium swallow procedure basics", "Upper GI series technique", "Barium enema basics",
    "Fluoroscopy patient dose reduction", "Mobile imaging infection control", "Fluoroscopy magnification modes",
  ],
};

interface GeneratedQuestion {
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
}

interface LessonMatch {
  title: string;
  slug: string;
  path: string;
}

export interface GenerationProgress {
  totalGenerated: number;
  totalFlashcards: number;
  totalDuplicatesSkipped: number;
  domainCounts: Record<string, number>;
  difficultyCounts: Record<number, number>;
  batchResults: Array<{
    batchNumber: number;
    domain: string;
    questionsGenerated: number;
    flashcardsCreated: number;
    duplicatesSkipped: number;
    lessonLinksAdded: number;
  }>;
  errors: string[];
}

function getMasteryCategory(difficulty: number): string {
  if (difficulty === 1) return "low";
  if (difficulty === 2) return "moderate";
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

  const shuffled = {
    A: entries[0].text,
    B: entries[1].text,
    C: entries[2].text,
    D: entries[3].text,
  };

  const newCorrect = ["A", "B", "C", "D"][entries.findIndex(e => e.isCorrect)] || "A";
  return { options: shuffled, correctLetter: newCorrect };
}

const MODULE_PATH_MAP: Record<string, string> = {
  positioning: "/medical-imaging/canada/lessons/positioning",
  image_production: "/medical-imaging/canada/lessons/image-production",
  physics: "/medical-imaging/canada/lessons/physics",
  radiation_safety: "/medical-imaging/canada/lessons/radiation-safety",
  patient_care: "/medical-imaging/canada/lessons/patient-care",
  equipment: "/medical-imaging/canada/lessons/equipment",
};

const STATIC_LESSON_ENTRIES: Record<string, LessonMatch[]> = {
  radiation_safety: [
    { title: "ALARA Principle", slug: "alara-principle", path: `${MODULE_PATH_MAP.radiation_safety}/alara-principle` },
    { title: "Cardinal Principles of Radiation Protection", slug: "cardinal-principles", path: `${MODULE_PATH_MAP.radiation_safety}/cardinal-principles` },
    { title: "Lead Shielding Requirements", slug: "lead-shielding", path: `${MODULE_PATH_MAP.radiation_safety}/lead-shielding` },
    { title: "Dose Limits", slug: "dose-limits", path: `${MODULE_PATH_MAP.radiation_safety}/dose-limits` },
    { title: "Personnel Dosimetry", slug: "personnel-dosimetry", path: `${MODULE_PATH_MAP.radiation_safety}/personnel-dosimetry` },
    { title: "Biological Effects of Radiation", slug: "biological-effects", path: `${MODULE_PATH_MAP.radiation_safety}/biological-effects` },
  ],
  patient_care: [
    { title: "Patient Identification and Verification", slug: "patient-identification", path: `${MODULE_PATH_MAP.patient_care}/patient-identification` },
    { title: "Informed Consent", slug: "informed-consent", path: `${MODULE_PATH_MAP.patient_care}/informed-consent` },
    { title: "Infection Control in Imaging", slug: "infection-control", path: `${MODULE_PATH_MAP.patient_care}/infection-control` },
    { title: "Contrast Media Reactions", slug: "contrast-reactions", path: `${MODULE_PATH_MAP.patient_care}/contrast-reactions` },
    { title: "Venipuncture Technique", slug: "venipuncture", path: `${MODULE_PATH_MAP.patient_care}/venipuncture` },
    { title: "Medical Emergency Response", slug: "emergency-response", path: `${MODULE_PATH_MAP.patient_care}/emergency-response` },
    { title: "Contrast Nephropathy Prevention", slug: "contrast-nephropathy", path: `${MODULE_PATH_MAP.patient_care}/contrast-nephropathy` },
    { title: "NPO Guidelines for Contrast", slug: "npo-guidelines", path: `${MODULE_PATH_MAP.patient_care}/npo-guidelines` },
  ],
  equipment: [
    { title: "Quality Control Testing", slug: "quality-control", path: `${MODULE_PATH_MAP.equipment}/quality-control` },
    { title: "Digital Detector Calibration", slug: "detector-calibration", path: `${MODULE_PATH_MAP.equipment}/detector-calibration` },
    { title: "Display Monitor QC", slug: "monitor-qc", path: `${MODULE_PATH_MAP.equipment}/monitor-qc` },
    { title: "C-arm Operation", slug: "c-arm-operation", path: `${MODULE_PATH_MAP.equipment}/c-arm-operation` },
    { title: "Fluoroscopy Dose Management", slug: "fluoro-dose", path: `${MODULE_PATH_MAP.equipment}/fluoro-dose` },
    { title: "CT Scan Principles", slug: "ct-principles", path: `${MODULE_PATH_MAP.equipment}/ct-principles` },
    { title: "MRI Safety Screening", slug: "mri-safety", path: `${MODULE_PATH_MAP.equipment}/mri-safety` },
    { title: "Image Intensifier Components", slug: "image-intensifier", path: `${MODULE_PATH_MAP.equipment}/image-intensifier` },
  ],
  image_production: [
    { title: "mAs and Density Relationship", slug: "mas-density", path: `${MODULE_PATH_MAP.image_production}/mas-density` },
    { title: "kVp and Contrast Relationship", slug: "kvp-contrast", path: `${MODULE_PATH_MAP.image_production}/kvp-contrast` },
    { title: "Automatic Exposure Control", slug: "aec", path: `${MODULE_PATH_MAP.image_production}/aec` },
    { title: "Grid Ratio and Scatter Cleanup", slug: "grid-ratio", path: `${MODULE_PATH_MAP.image_production}/grid-ratio` },
    { title: "Digital Image Processing", slug: "digital-processing", path: `${MODULE_PATH_MAP.image_production}/digital-processing` },
    { title: "Exposure Index Interpretation", slug: "exposure-index", path: `${MODULE_PATH_MAP.image_production}/exposure-index` },
    { title: "Spatial Resolution Factors", slug: "spatial-resolution", path: `${MODULE_PATH_MAP.image_production}/spatial-resolution` },
    { title: "Image Noise and Quantum Mottle", slug: "image-noise", path: `${MODULE_PATH_MAP.image_production}/image-noise` },
  ],
};

async function loadLessonIndex(): Promise<Map<string, LessonMatch[]>> {
  const lessonMap = new Map<string, LessonMatch[]>();

  for (const [module, entries] of Object.entries(STATIC_LESSON_ENTRIES)) {
    lessonMap.set(module, [...entries]);
  }

  try {
    const positioningResult = await pool.query(
      `SELECT projection_name, body_region, slug FROM imaging_positioning_entries WHERE status = 'published'`
    );
    const posEntries = lessonMap.get("positioning") || [];
    for (const row of positioningResult.rows) {
      posEntries.push({
        title: row.projection_name || row.body_region,
        slug: row.slug,
        path: `${MODULE_PATH_MAP.positioning}/${row.slug}`,
      });
    }
    lessonMap.set("positioning", posEntries);
  } catch (err: unknown) {
    console.log(`[ImagingGen] Could not load positioning entries:`, (err as Error).message);
  }

  try {
    const physicsResult = await pool.query(
      `SELECT title, category, slug FROM imaging_physics_topics WHERE status = 'published'`
    );
    for (const row of physicsResult.rows) {
      const categoryToModule: Record<string, string> = {
        "Radiation Physics": "physics",
        "Image Production": "image_production",
        "Radiation Safety": "radiation_safety",
      };
      const moduleKey = categoryToModule[row.category] || "physics";
      const existing = lessonMap.get(moduleKey) || [];
      const slugPath = row.slug || row.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      existing.push({
        title: row.title,
        slug: slugPath,
        path: `${MODULE_PATH_MAP[moduleKey] || MODULE_PATH_MAP.physics}/${slugPath}`,
      });
      lessonMap.set(moduleKey, existing);
    }
  } catch (err: unknown) {
    console.log(`[ImagingGen] Could not load physics topics:`, (err as Error).message);
  }

  return lessonMap;
}

function findBestLessonMatch(
  domain: string,
  topic: string,
  lessonIndex: Map<string, LessonMatch[]>
): string {
  const moduleKey = DOMAIN_MODULE_MAP[domain] || "general";

  const candidates = lessonIndex.get(moduleKey) || [];

  if (candidates.length > 0) {
    const topicLower = topic.toLowerCase();
    const exactMatch = candidates.find(
      c => topicLower.includes(c.title.toLowerCase()) || c.title.toLowerCase().includes(topicLower)
    );
    if (exactMatch) {
      return `To review this concept, see the NurseNest lesson: ${exactMatch.title} → ${exactMatch.path}`;
    }

    const partialMatch = candidates.find(c => {
      const words = topicLower.split(/\s+/);
      return words.some(w => w.length > 3 && c.title.toLowerCase().includes(w));
    });
    if (partialMatch) {
      return `To review this concept, see the NurseNest lesson: ${partialMatch.title} → ${partialMatch.path}`;
    }

    const fallback = candidates[Math.floor(Math.random() * candidates.length)];
    return `To review this concept, see the NurseNest lesson: ${fallback.title} → ${fallback.path}`;
  }

  for (const [, lessons] of lessonIndex.entries()) {
    if (lessons.length > 0) {
      const topicLower = topic.toLowerCase();
      const match = lessons.find(
        l => topicLower.includes(l.title.toLowerCase()) || l.title.toLowerCase().includes(topicLower)
      );
      if (match) {
        return `To review this concept, see the NurseNest lesson: ${match.title} → ${match.path}`;
      }
    }
  }

  return `To review this concept, see the NurseNest lesson: ${topic} → /medical-imaging/canada/lessons`;
}

function computeDifficultyDistribution(
  batchSize: number,
  globalCounts: Record<number, number>,
  globalTarget: number,
): { easy: number; moderate: number; hard: number } {
  const totalSoFar = globalCounts[1] + globalCounts[2] + globalCounts[3];
  const remaining = Math.max(globalTarget - totalSoFar, batchSize);

  const idealEasy = Math.round(remaining * 0.35);
  const idealMod = Math.round(remaining * 0.45);
  const idealHard = remaining - idealEasy - idealMod;

  const neededEasy = Math.max(0, idealEasy - (globalCounts[1] || 0));
  const neededMod = Math.max(0, idealMod - (globalCounts[2] || 0));
  const neededHard = Math.max(0, idealHard - (globalCounts[3] || 0));

  const totalNeeded = neededEasy + neededMod + neededHard;
  if (totalNeeded === 0) {
    return {
      easy: Math.round(batchSize * 0.35),
      moderate: Math.round(batchSize * 0.45),
      hard: batchSize - Math.round(batchSize * 0.35) - Math.round(batchSize * 0.45),
    };
  }

  const scale = batchSize / totalNeeded;
  const easy = Math.max(1, Math.round(neededEasy * scale));
  const moderate = Math.max(1, Math.round(neededMod * scale));
  const hard = Math.max(1, batchSize - easy - moderate);

  return { easy, moderate, hard };
}

async function generateBatch(
  domain: string,
  topics: string[],
  batchSize: number,
  globalDifficultyCounts: Record<number, number>,
  globalTarget: number,
): Promise<GeneratedQuestion[]> {
  const openai = getOpenAI();
  const topicsList = topics.slice(0, 6).join(", ");

  const dist = computeDifficultyDistribution(batchSize, globalDifficultyCounts, globalTarget);
  const easyCount = dist.easy;
  const modCount = dist.moderate;
  const hardCount = dist.hard;

  const systemPrompt = `You are a senior diagnostic imaging educator and ARRT/CAMRT exam item writer. You create clinical vignette-style questions for radiography board exam preparation.

CRITICAL RULES:
1. Return ONLY valid JSON. No markdown, no code fences, no prose.
2. Every question must be a realistic clinical imaging vignette with patient demographics (age, sex), chief complaint, and imaging context.
3. Four answer choices per question (A/B/C/D), one correct, three plausible distractors.
4. Distractors must reflect common positioning errors, safety misconceptions, or interpretation mistakes.
5. Include detailed rationale with: correct answer explanation, why each distractor is wrong, a clinical pearl, and imaging practice notes.
6. Do NOT use emoji characters anywhere. Plain text only.
7. Each question must be unique with a distinct clinical scenario.`;

  const userPrompt = `Generate exactly ${batchSize} diagnostic imaging exam questions for the domain "${domain}".

Topics to cover: ${topicsList}

IMPORTANT - Difficulty distribution (MUST follow):
- ${easyCount} questions at difficulty 1 (easy/foundational recall)
- ${modCount} questions at difficulty 2 (moderate/application-level)
- ${hardCount} questions at difficulty 3 (hard/analysis and critical thinking)

Each question MUST have its own "difficulty" field set to 1, 2, or 3 matching the above distribution.

Return JSON with this exact structure:
{
  "questions": [
    {
      "question_text": "A clinical vignette question stem (include patient age, sex, complaint, imaging context). Minimum 60 characters.",
      "option_a": "First answer choice text",
      "option_b": "Second answer choice text",
      "option_c": "Third answer choice text",
      "option_d": "Fourth answer choice text",
      "correct_answer": "A or B or C or D",
      "rationale": "Detailed explanation: why the correct answer is right, why each distractor is wrong.",
      "clinical_pearl": "A concise, memorable clinical or imaging pearl (1-2 sentences).",
      "imaging_practice_notes": "Practical positioning, safety, or technical consideration for this scenario (1-2 sentences).",
      "topic": "Specific topic within the domain",
      "difficulty": 1 or 2 or 3
    }
  ]
}

Generate exactly ${batchSize} unique questions. Each must have a distinct patient scenario. JSON only.`;

  const maxRetries = 2;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: ensureModel("gpt-4o-mini"),
        temperature: 0.8,
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
        throw new Error(`No questions array found in response (attempt ${attempt + 1})`);
      }

      const validated: GeneratedQuestion[] = rawQuestions
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
          difficulty: [1, 2, 3].includes(Number(q.difficulty)) ? Number(q.difficulty) : 2,
        }));

      if (validated.length > 0) {
        const diffs = validated.map(q => q.difficulty);
        const allSame = diffs.every(d => d === diffs[0]);
        if (allSame && validated.length > 3) {
          const et = Math.round(validated.length * 0.35);
          const mt = Math.round(validated.length * 0.45);
          for (let i = 0; i < validated.length; i++) {
            if (i < et) validated[i].difficulty = 1;
            else if (i < et + mt) validated[i].difficulty = 2;
            else validated[i].difficulty = 3;
          }
        }
        return validated;
      }

      console.log(`[ImagingGen] Attempt ${attempt + 1}: ${rawQuestions.length} items but 0 valid, retrying...`);
    } catch (err: unknown) {
      console.error(`[ImagingGen] Attempt ${attempt + 1} error:`, (err as Error).message);
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }

  return [];
}

async function checkDuplicates(questionTexts: string[]): Promise<Set<string>> {
  const duplicates = new Set<string>();
  if (questionTexts.length === 0) return duplicates;

  for (const text of questionTexts) {
    const shortText = text.substring(0, 100);
    try {
      const result = await pool.query(
        `SELECT id FROM imaging_questions WHERE question LIKE $1 LIMIT 1`,
        [`${shortText}%`]
      );
      if (result.rows.length > 0) {
        duplicates.add(text);
      }
    } catch (err: unknown) {
      console.error(`[ImagingGen] Duplicate check error:`, (err as Error).message);
    }
  }

  return duplicates;
}

interface PreparedInsert {
  question: GeneratedQuestion;
  options: { A: string; B: string; C: string; D: string };
  correctLetter: string;
  fullRationale: string;
  mastery: string;
  flashcardFront: string;
  flashcardBack: string;
  lessonLink: string;
  exam: ExamTarget;
  country: string;
  domain: string;
}

function prepareInsert(
  q: GeneratedQuestion,
  domain: string,
  lessonLink: string,
  batchIndex: number,
): PreparedInsert {
  const { options, correctLetter } = shuffleAnswerPositions(
    { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d },
    q.correct_answer
  );

  const fullRationale = `${q.rationale}\n\nClinical Pearl: ${q.clinical_pearl}\n\nImaging Practice Note: ${q.imaging_practice_notes}\n\n${lessonLink}`;
  const mastery = getMasteryCategory(q.difficulty);
  const { exam, country } = getExamTarget(batchIndex);

  const flashcardFront = `${domain}: ${q.topic || domain} — What should the radiologic technologist consider?`;
  const rationaleSummary = q.rationale.length > 200 ? q.rationale.substring(0, 200).trim() + "..." : q.rationale;
  const flashcardBack = `Summary: ${rationaleSummary}\n\nClinical Pearl: ${q.clinical_pearl || "Key concept from this domain."}\n\nPositioning/Safety Note: ${q.imaging_practice_notes || "Standard technique applies."}\n\n${lessonLink}`;

  return { question: q, options, correctLetter, fullRationale, mastery, flashcardFront, flashcardBack, lessonLink, exam, country, domain };
}

async function bulkInsertBatch(
  inserts: PreparedInsert[],
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
           category, difficulty, country, topic, status, exam_domain, mastery_category, 
           clinical_pearls, imaging_practice_notes, exam, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW(), NOW())`,
        [
          ins.question.question_text,
          ins.options.A, ins.options.B, ins.options.C, ins.options.D,
          ins.correctLetter,
          ins.fullRationale,
          ins.domain,
          ins.question.difficulty,
          ins.country,
          ins.question.topic || ins.domain,
          "published",
          ins.domain,
          ins.mastery,
          ins.question.clinical_pearl || null,
          ins.question.imaging_practice_notes || null,
          ins.exam,
        ]
      );
      questionsInserted++;

      await client.query(
        `INSERT INTO imaging_flashcards 
          (id, front, back, category, difficulty, country, exam_type, topic, status, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
        [
          ins.flashcardFront,
          ins.flashcardBack,
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

async function verifyDatabaseConnection(): Promise<void> {
  const result = await pool.query("SELECT current_database() as db, NOW() as ts");
  const dbName = result.rows[0]?.db;
  console.log(`[ImagingGen] Connected to database: ${dbName} at ${result.rows[0]?.ts}`);

  const tableCheck = await pool.query(
    `SELECT COUNT(*)::int as c FROM information_schema.tables 
     WHERE table_schema = 'public' AND table_name IN ('imaging_questions', 'imaging_flashcards')`
  );
  if (tableCheck.rows[0]?.c < 2) {
    throw new Error("Required tables imaging_questions and/or imaging_flashcards not found in database");
  }
}

export async function runImagingQuestionGeneration(
  targetCount: number = 1400,
  batchSize: number = 50,
  onProgress?: (progress: GenerationProgress) => void
): Promise<GenerationProgress> {
  await verifyDatabaseConnection();

  const progress: GenerationProgress = {
    totalGenerated: 0,
    totalFlashcards: 0,
    totalDuplicatesSkipped: 0,
    domainCounts: {},
    difficultyCounts: { 1: 0, 2: 0, 3: 0 },
    batchResults: [],
    errors: [],
  };

  const lessonIndex = await loadLessonIndex();
  console.log(`[ImagingGen] Loaded lesson index with ${lessonIndex.size} module categories`);

  const MAX_CONSECUTIVE_FAILURES = 5;
  const MAX_TOTAL_BATCHES = Math.ceil(targetCount * 1.5 / batchSize);
  let batchNum = 0;
  let consecutiveFailures = 0;

  console.log(`[ImagingGen] Starting generation: target=${targetCount}, batchSize=${batchSize}, maxBatches=${MAX_TOTAL_BATCHES}`);

  while (progress.totalGenerated < targetCount && batchNum < MAX_TOTAL_BATCHES) {
    batchNum++;
    const domainIndex = (batchNum - 1) % CONTENT_DOMAINS.length;
    const domain = CONTENT_DOMAINS[domainIndex];
    const topics = DOMAIN_TOPICS[domain] || [domain];

    const remaining = targetCount - progress.totalGenerated;
    const thisBatchSize = Math.min(batchSize, remaining);

    console.log(`[ImagingGen] Batch ${batchNum}: domain="${domain}", size=${thisBatchSize}, progress=${progress.totalGenerated}/${targetCount}`);

    try {
      const questions = await generateBatch(
        domain, topics, thisBatchSize,
        progress.difficultyCounts, targetCount
      );

      if (questions.length === 0) {
        consecutiveFailures++;
        console.log(`[ImagingGen] Batch ${batchNum}: no valid questions (${consecutiveFailures}/${MAX_CONSECUTIVE_FAILURES} consecutive failures)`);
        progress.batchResults.push({
          batchNumber: batchNum, domain,
          questionsGenerated: 0, flashcardsCreated: 0,
          duplicatesSkipped: 0, lessonLinksAdded: 0,
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
      const duplicates = await checkDuplicates(questionTexts);

      const inserts: PreparedInsert[] = [];
      let duplicatesSkipped = 0;
      let lessonLinksAdded = 0;

      for (const q of questions) {
        if (progress.totalGenerated + inserts.length >= targetCount) break;

        if (duplicates.has(q.question_text)) {
          duplicatesSkipped++;
          continue;
        }

        const lessonLink = findBestLessonMatch(domain, q.topic || domain, lessonIndex);
        lessonLinksAdded++;

        inserts.push(prepareInsert(q, domain, lessonLink, batchNum));
      }

      let questionsInserted = 0;
      let flashcardsCreated = 0;

      if (inserts.length > 0) {
        try {
          const result = await bulkInsertBatch(inserts);
          questionsInserted = result.questionsInserted;
          flashcardsCreated = result.flashcardsCreated;

          progress.totalGenerated += questionsInserted;
          progress.totalFlashcards += flashcardsCreated;

          for (const ins of inserts) {
            progress.difficultyCounts[ins.question.difficulty] = (progress.difficultyCounts[ins.question.difficulty] || 0) + 1;
            progress.domainCounts[domain] = (progress.domainCounts[domain] || 0) + 1;
          }
        } catch (err: unknown) {
          const errMsg = (err as Error).message;
          console.error(`[ImagingGen] Bulk insert error for batch ${batchNum} (${domain}):`, errMsg);
          progress.errors.push(`Bulk insert error (${domain}): ${errMsg}`);
        }
      }

      progress.totalDuplicatesSkipped += duplicatesSkipped;

      progress.batchResults.push({
        batchNumber: batchNum, domain,
        questionsGenerated: questionsInserted,
        flashcardsCreated,
        duplicatesSkipped,
        lessonLinksAdded,
      });

      console.log(
        `[ImagingGen] Batch ${batchNum} complete: ${questionsInserted} questions, ${flashcardsCreated} flashcards, ${duplicatesSkipped} dupes. Total: ${progress.totalGenerated}/${targetCount}`
      );

      if (onProgress) onProgress(progress);
      await new Promise(r => setTimeout(r, 1500));
    } catch (err: unknown) {
      const errMsg = (err as Error).message;
      consecutiveFailures++;
      console.error(`[ImagingGen] Batch ${batchNum} error:`, errMsg);
      progress.errors.push(`Batch ${batchNum} (${domain}): ${errMsg}`);
      progress.batchResults.push({
        batchNumber: batchNum, domain,
        questionsGenerated: 0, flashcardsCreated: 0,
        duplicatesSkipped: 0, lessonLinksAdded: 0,
      });

      if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        progress.errors.push(`Stopping: ${MAX_CONSECUTIVE_FAILURES} consecutive failures`);
        break;
      }
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  console.log(`[ImagingGen] === GENERATION COMPLETE ===`);
  console.log(`[ImagingGen] Total questions: ${progress.totalGenerated}`);
  console.log(`[ImagingGen] Total flashcards: ${progress.totalFlashcards}`);
  console.log(`[ImagingGen] Total duplicates skipped: ${progress.totalDuplicatesSkipped}`);
  console.log(`[ImagingGen] Difficulty distribution: Easy=${progress.difficultyCounts[1]}, Moderate=${progress.difficultyCounts[2]}, Hard=${progress.difficultyCounts[3]}`);
  console.log(`[ImagingGen] Domain distribution:`, JSON.stringify(progress.domainCounts));
  if (progress.errors.length > 0) {
    console.log(`[ImagingGen] Errors (${progress.errors.length}):`, progress.errors.slice(0, 10));
  }

  return progress;
}

export async function ensureImagingQuestionColumns(): Promise<void> {
  const columns = [
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
      console.log(`[ImagingGen] Column ${col.name} may already exist:`, (err as Error).message);
    }
  }
}
