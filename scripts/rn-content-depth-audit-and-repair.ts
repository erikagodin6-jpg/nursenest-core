import fs from "fs/promises";
import path from "path";
import OpenAI from "openai";
import { createLazyPrimaryPoolProxy } from "../server/db";
import { RN_DOMAINS, buildAllTopics } from "../server/rn-lesson-generator";

const pool = createLazyPrimaryPoolProxy();

type ContentBlock =
  | { type: "subheading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

type CoverageRow = {
  category: string;
  lessonCount: number;
  deepLessonCount: number;
  questionCount: number;
  ngnQuestionCount: number;
  sataQuestionCount: number;
  avgDifficulty: number;
  gaps: string[];
};

const REQUIRED_LESSON_SECTIONS = [
  "Overview",
  "Pathophysiology",
  "Risk Factors",
  "Signs & Symptoms",
  "Diagnostics & Labs",
  "Management & Treatments",
  "Clinical Decision-Making & Nursing Priorities",
  "Complications",
  "Clinical Pearls",
  "Patient & Client Education",
  "Case-Based Application",
];

const DEEP_RN_QUESTION_REQUIREMENTS = [
  "scenario",
  "rationale",
  "correctAnswerExplanation",
  "incorrectAnswerRationale",
  "clinicalReasoning",
  "clinicalPearl",
  "keyTakeaway",
];

const NCLEX_RN_BLUEPRINT_CATEGORIES = [
  "Management of Care",
  "Safety and Infection Control",
  "Health Promotion and Maintenance",
  "Psychosocial Integrity",
  "Basic Care and Comfort",
  "Pharmacological and Parenteral Therapies",
  "Reduction of Risk Potential",
  "Physiological Adaptation",
];

function getOpenAI(): OpenAI | null {
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({
    apiKey,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
}

function resolveModel(): string {
  return (
    process.env.RN_CONTENT_REPAIR_MODEL?.trim() ||
    process.env.LESSON_OPENAI_MODEL?.trim() ||
    process.env.AI_INTEGRATIONS_OPENAI_MODEL?.trim() ||
    "gpt-4.1-mini"
  );
}

function normalizeBlocks(raw: unknown): ContentBlock[] {
  if (Array.isArray(raw)) return raw as ContentBlock[];
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function lessonMetrics(content: unknown) {
  const blocks = normalizeBlocks(content);
  const headings = blocks
    .filter((block): block is { type: "subheading"; text: string } => block.type === "subheading")
    .map((block) => block.text.trim().toLowerCase());
  const text = blocks
    .map((block) => block.type === "paragraph" ? block.text : block.type === "list" ? block.items.join(" ") : block.text)
    .join(" ");
  const presentSections = REQUIRED_LESSON_SECTIONS.filter((section) => headings.includes(section.toLowerCase()));
  const clinicalSignals = [
    /pathophysiolog/i,
    /priority|priorit/i,
    /rationale|because|why/i,
    /red flag|immediate|rapid response|notify/i,
    /lab|diagnostic|normal|abnormal/i,
    /teach-back|discharge|education/i,
    /case|scenario|patient/i,
    /ABCs|Maslow|ADPIE|clinical judgment|NGN/i,
  ].filter((rx) => rx.test(text)).length;

  return {
    blocks,
    headings,
    words: wordCount(text),
    presentSections,
    clinicalSignals,
    isDeep: wordCount(text) >= 1200 && presentSections.length === REQUIRED_LESSON_SECTIONS.length && clinicalSignals >= 7,
  };
}

function questionIsDeep(row: Record<string, any>): boolean {
  const requiredFieldsPresent = DEEP_RN_QUESTION_REQUIREMENTS.every((field) => {
    const value = row[field] ?? row[field.toLowerCase()];
    if (value == null) return false;
    if (typeof value === "string") return value.trim().length >= 80;
    if (typeof value === "object") return Object.keys(value).length >= 2;
    return true;
  });
  const rationaleText = [row.rationale, row.correctAnswerExplanation, row.clinicalReasoning, row.keyTakeaway]
    .filter(Boolean)
    .join(" ");
  return requiredFieldsPresent && wordCount(rationaleText) >= 90;
}

function buildFallbackDeepLesson(title: string, category: string, bodySystem: string, tags: string[]): ContentBlock[] {
  const tagText = tags.length ? tags.join(", ") : category;
  return [
    { type: "subheading", text: "Overview" },
    { type: "paragraph", text: `${title} is a core NCLEX-RN concept in ${category} nursing because it connects assessment findings, pathophysiology, nursing priorities, medication safety, patient teaching, and early recognition of deterioration. A registered nurse must be able to explain what is happening in the body, identify which cues matter first, communicate risk using SBAR, and choose interventions that reduce harm. This topic commonly appears in medical-surgical, emergency, community, long-term care, maternal-child, and mental health settings depending on the patient presentation. The safest RN approach is to connect the patient story to objective data: vital signs, focused assessment, relevant laboratory values, medications, comorbidities, baseline function, and changes over time. For NCLEX-RN, the key is not memorizing isolated facts; it is applying clinical judgment to decide what is urgent, what can wait, and what must be escalated.` },
    { type: "subheading", text: "Pathophysiology" },
    { type: "paragraph", text: `The pathophysiology behind ${title.toLowerCase()} begins with disruption of normal ${bodySystem.toLowerCase()} function. Cellular stress, impaired perfusion, inflammation, infection, trauma, medication effects, or endocrine imbalance can alter oxygen delivery, membrane transport, fluid distribution, immune response, and organ reserve. At the organ level, this produces measurable changes such as abnormal breath sounds, altered heart rhythm, reduced urine output, neurological changes, pain, fever, edema, bleeding risk, or metabolic instability. As compensation begins, the sympathetic nervous system may increase heart rate and respiratory rate, the kidneys may conserve sodium and water, and inflammatory mediators may increase vascular permeability. These mechanisms can initially maintain perfusion but eventually worsen workload and oxygen demand if the cause is not corrected.` },
    { type: "paragraph", text: `A deep RN-level understanding requires linking each clinical cue to a mechanism. Tachycardia often reflects compensation for hypovolemia, hypoxia, fever, pain, or anxiety. Confusion can reflect decreased cerebral perfusion, hypoxemia, infection, glucose abnormality, medication toxicity, or rising carbon dioxide. Oliguria suggests reduced renal perfusion, obstruction, dehydration, or acute kidney injury. Dyspnea can reflect airway obstruction, alveolar fluid, infection, pulmonary embolism, anxiety, acidosis, or neuromuscular weakness. The nurse must trend findings rather than treat one number in isolation, because deterioration often appears as a pattern before it becomes a crisis.` },
    { type: "subheading", text: "Risk Factors" },
    { type: "list", items: [
      `Modifiable: tobacco or vaping exposure, alcohol/substance use, sedentary lifestyle, uncontrolled hypertension, diabetes, obesity, poor nutrition, missed medications, and delayed follow-up.`,
      `Non-modifiable: age extremes, pregnancy/postpartum physiology, genetic predisposition, congenital disease, prior major illness, and reduced organ reserve in older adults.`,
      `Clinical risk: polypharmacy, anticoagulant or insulin use, immunosuppression, invasive lines, indwelling catheters, recent surgery, immobility, and prior hospitalization.`,
      `Social risk: limited access to care, cost barriers, low health literacy, language barriers, unsafe housing, caregiver strain, and transportation limits.`,
      `Population-specific risk: pediatric patients compensate then crash quickly; older adults may present atypically with falls, confusion, weakness, or reduced appetite instead of classic symptoms.`,
    ] },
    { type: "subheading", text: "Signs & Symptoms" },
    { type: "paragraph", text: `Early findings in ${title.toLowerCase()} may be subtle. Restlessness, mild tachycardia, new pain, reduced activity tolerance, low-grade fever, appetite change, or a small oxygen saturation drop can be the first sign that compensation has started. These symptoms matter because they often reflect tissue stress before overt organ failure occurs. Late findings include hypotension, severe dyspnea, cyanosis, altered mental status, chest pain, syncope, uncontrolled bleeding, anuria or oliguria, seizures, or sustained dysrhythmias. Red flags that require immediate action include airway compromise, SpO2 less than 90% despite oxygen, systolic blood pressure below baseline with symptoms, new unilateral weakness, severe headache with neurological change, signs of shock, or any sudden deterioration from baseline.` },
    { type: "subheading", text: "Diagnostics & Labs" },
    { type: "list", items: [
      `Vital signs and trends: temperature, heart rate, respiratory rate, blood pressure, pain, oxygen saturation, mental status, and urine output. Trend direction is often more important than one isolated value.`,
      `CBC: WBC elevation can suggest infection or inflammation; low WBC can suggest immunosuppression; hemoglobin and hematocrit trends help detect bleeding, anemia, or hemodilution.`,
      `BMP/CMP: sodium, potassium, bicarbonate, BUN, creatinine, glucose, calcium, liver enzymes, and albumin identify fluid, renal, metabolic, nutritional, and medication-safety concerns.`,
      `ABG/VBG and lactate when unstable: pH, carbon dioxide, bicarbonate, oxygenation, and lactate help identify respiratory failure, metabolic derangement, and tissue hypoperfusion.`,
      `Diagnostics should match the concern: ECG/troponin for ischemia, chest imaging for respiratory symptoms, urinalysis/culture for urinary infection, ultrasound/CT when clot, obstruction, bleeding, or trauma is suspected.`,
    ] },
    { type: "subheading", text: "Management & Treatments" },
    { type: "paragraph", text: `Management of ${title.toLowerCase()} starts with stabilizing the patient and treating the cause. RN priorities include airway protection, positioning, oxygen titration, IV access, accurate medication administration, focused reassessment, and timely escalation. Medical treatment may include fluids, antibiotics, bronchodilators, antihypertensives, anticoagulants, insulin, analgesics, electrolyte replacement, antipyretics, vasopressors, or disease-specific therapies depending on assessment and orders. The nurse must understand why each treatment is used: fluids restore circulating volume, oxygen improves tissue delivery, antibiotics treat infection, insulin shifts glucose into cells, bronchodilators reduce airway resistance, and anticoagulants reduce clot propagation. Nursing care must include safety checks, allergies, contraindications, renal dosing concerns, medication interactions, and response evaluation.` },
    { type: "paragraph", text: `Do not use vague monitoring. Define what is being monitored and why: lung sounds and work of breathing for ventilation; mental status for perfusion and oxygenation; urine output for renal perfusion; ECG for dysrhythmia; capillary refill and skin temperature for circulation; pain characteristics for ischemia, obstruction, or injury; and labs for treatment response. Escalate persistent hypotension, new neurological deficit, worsening respiratory distress, uncontrolled pain, bleeding, critical lab values, or failure to respond to initial interventions.` },
    { type: "subheading", text: "Clinical Decision-Making & Nursing Priorities" },
    { type: "paragraph", text: `Use ABCs first, then Maslow, then safety, then nursing process. If airway, breathing, or circulation is unstable, intervene and call for help before lower-priority teaching or documentation. For stable patients, assess before acting. For unstable patients, act while assessing: position, oxygen, call rapid response, obtain vital signs, verify IV access, prepare ordered emergency medications, and communicate SBAR. Prioritize the patient with acute change over chronic stable problems, unexpected findings over expected findings, and actual life threat over potential future risk. Delegation should preserve RN judgment: assessment, teaching, evaluation, IV push medications, and unstable patients stay with the RN; routine vitals, hygiene, ambulation of stable patients, and specimen collection may be delegated when appropriate.` },
    { type: "subheading", text: "Complications" },
    { type: "list", items: [
      `Respiratory compromise: hypoxemia, aspiration, atelectasis, pneumonia, or respiratory failure; intervene with positioning, oxygen, pulmonary hygiene, suctioning if indicated, and rapid escalation.`,
      `Circulatory compromise: shock, dysrhythmia, bleeding, clot propagation, or poor perfusion; trend blood pressure, heart rhythm, capillary refill, mental status, and urine output.`,
      `Renal/metabolic compromise: acute kidney injury, glucose instability, electrolyte imbalance, and acid-base disorder; monitor labs, I&O, nephrotoxic medications, and clinical response.`,
      `Infection/sepsis: fever or hypothermia, tachycardia, tachypnea, hypotension, altered mental status, and rising lactate; obtain cultures as ordered and support timely antibiotics.`,
      `Safety complications: falls, pressure injury, delirium, medication error, aspiration, and line/tube dislodgement; use prevention bundles and reassess risk every shift and after condition changes.`,
    ] },
    { type: "subheading", text: "Clinical Pearls" },
    { type: "paragraph", text: `NCLEX-RN traps for ${title.toLowerCase()} usually test priority, delegation, or safety. Do not choose patient teaching when the patient is unstable. Do not choose documentation before assessing or intervening in a safety threat. Do not delegate assessment, clinical judgment, teaching, or evaluation. Do not ignore a patient who says a medication looks different; stop and verify. Do not silence alarms without identifying the cause. A helpful memory anchor is: recognize cues, analyze cues, prioritize hypotheses, generate solutions, take action, evaluate outcomes. This mirrors NGN clinical judgment and prevents guessing based on keywords alone.` },
    { type: "subheading", text: "Patient & Client Education" },
    { type: "paragraph", text: `Patient teaching should include what the condition means, which symptoms require urgent care, how medications work, what side effects to report, how to self-monitor, and when follow-up is needed. Use teach-back: “I want to make sure I explained this clearly. Tell me what you will do if your symptoms get worse at home.” Include caregivers when appropriate, provide written instructions, verify access to medications and equipment, and address barriers such as cost, transportation, language, and health literacy. Education is not complete until the patient can demonstrate or explain the plan safely.` },
    { type: "subheading", text: "Case-Based Application" },
    { type: "paragraph", text: `Case: Jordan, a 67-year-old patient with hypertension, diabetes, and chronic kidney disease, is admitted from the emergency department with worsening symptoms related to ${title.toLowerCase()}. Current findings include HR 112, RR 24, BP 96/58, SpO2 91% on room air, new confusion, reduced urine output, and abnormal labs relevant to ${bodySystem.toLowerCase()}. The priority question is not simply “what is the diagnosis?” but “which cue shows the patient is becoming unstable?” The most urgent cues are hypotension, tachypnea, low oxygen saturation, confusion, and oliguria because they suggest impaired oxygen delivery and perfusion. First actions: call for help, position for breathing, apply oxygen per protocol, verify IV access, obtain focused assessment and repeat vitals, review critical labs, anticipate provider orders, and reassess response. The second question is what education matters before discharge. Jordan must explain medication purpose, warning signs, follow-up labs, hydration or diet instructions as applicable, and when to call 911 versus the provider.` },
  ];
}

function buildDeepQuestionPrompt(row: Record<string, any>): string {
  return `Rewrite this NCLEX-RN question so it is deep, clinically realistic, and aligned with NGN clinical judgment. Keep the same topic, body system, tier, and correct answer concept, but improve the stem, options, rationale, incorrect rationales, clinical reasoning, clinical pearl, and key takeaway. Include priority/delegation/safety where clinically appropriate. Return ONLY JSON with keys: stem, options, correctAnswer, rationale, scenario, clinicalPearl, correctAnswerExplanation, incorrectAnswerRationale, clinicalReasoning, keyTakeaway, difficulty, questionType.\n\nExisting question:\n${JSON.stringify(row, null, 2)}`;
}

async function repairLessonWithAi(openai: OpenAI | null, lesson: Record<string, any>): Promise<ContentBlock[]> {
  const current = normalizeBlocks(lesson.content);
  if (!openai) {
    return buildFallbackDeepLesson(lesson.title, lesson.category || "RN", lesson.body_system || lesson.bodySystem || "Integrated Nursing", lesson.tags || []);
  }

  const prompt = `Repair this RN lesson into a deep NCLEX-RN lesson. Cover every required section exactly once and make the content clinically specific, not generic. Include beginner/intermediate/advanced progression within the explanations, pathophysiology, labs, nursing priorities, delegation/safety, patient teaching, and a realistic case. Return ONLY a JSON array of content blocks. Required sections: ${REQUIRED_LESSON_SECTIONS.join(", ")}. Target 1500-1800 words.\n\nLesson metadata: ${JSON.stringify({ title: lesson.title, category: lesson.category, bodySystem: lesson.body_system, tags: lesson.tags }, null, 2)}\n\nCurrent content: ${JSON.stringify(current).slice(0, 12000)}`;

  try {
    const response = await openai.chat.completions.create({
      model: resolveModel(),
      temperature: 0.25,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are a senior RN educator and NCLEX-RN item/content reviewer. Produce clinically accurate, detailed, bedside-relevant content." },
        { role: "user", content: `Return an object: {\"content\": ContentBlock[]}. ${prompt}` },
      ],
    });
    const raw = response.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw);
    const content = normalizeBlocks(parsed.content);
    return lessonMetrics(content).isDeep ? content : buildFallbackDeepLesson(lesson.title, lesson.category || "RN", lesson.body_system || "Integrated Nursing", lesson.tags || []);
  } catch {
    return buildFallbackDeepLesson(lesson.title, lesson.category || "RN", lesson.body_system || "Integrated Nursing", lesson.tags || []);
  }
}

async function repairQuestionWithAi(openai: OpenAI | null, row: Record<string, any>): Promise<Record<string, any>> | null {
  if (!openai) return null;
  try {
    const response = await openai.chat.completions.create({
      model: resolveModel(),
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are an NCLEX-RN item writer. Preserve clinical correctness. Avoid trick wording. Make rationales rich and specific." },
        { role: "user", content: buildDeepQuestionPrompt(row) },
      ],
    });
    return JSON.parse(response.choices[0]?.message?.content || "{}");
  } catch {
    return null;
  }
}

async function auditCoverage(): Promise<CoverageRow[]> {
  const rows = await pool.query(`
    SELECT
      COALESCE(category, body_system, 'Uncategorized') AS category,
      COUNT(*) FILTER (WHERE type = 'lesson' AND tier = 'rn')::int AS lesson_count
    FROM content_items
    WHERE tier = 'rn'
    GROUP BY COALESCE(category, body_system, 'Uncategorized')
  `);

  const questionRows = await pool.query(`
    SELECT
      COALESCE(body_system, category, 'Uncategorized') AS category,
      COUNT(*)::int AS question_count,
      COUNT(*) FILTER (WHERE question_type ILIKE '%case%' OR question_type ILIKE '%ngn%' OR scenario IS NOT NULL)::int AS ngn_question_count,
      COUNT(*) FILTER (WHERE question_type ILIKE '%select%' OR question_type ILIKE '%sata%')::int AS sata_question_count,
      COALESCE(AVG(difficulty), 0)::float AS avg_difficulty
    FROM exam_questions
    WHERE tier = 'rn'
    GROUP BY COALESCE(body_system, category, 'Uncategorized')
  `);

  const byCategory = new Map<string, CoverageRow>();
  for (const domain of RN_DOMAINS) {
    byCategory.set(domain, { category: domain, lessonCount: 0, deepLessonCount: 0, questionCount: 0, ngnQuestionCount: 0, sataQuestionCount: 0, avgDifficulty: 0, gaps: [] });
  }
  for (const row of rows.rows) {
    const category = row.category;
    if (!byCategory.has(category)) byCategory.set(category, { category, lessonCount: 0, deepLessonCount: 0, questionCount: 0, ngnQuestionCount: 0, sataQuestionCount: 0, avgDifficulty: 0, gaps: [] });
    byCategory.get(category)!.lessonCount = Number(row.lesson_count || 0);
  }
  for (const row of questionRows.rows) {
    const category = row.category;
    if (!byCategory.has(category)) byCategory.set(category, { category, lessonCount: 0, deepLessonCount: 0, questionCount: 0, ngnQuestionCount: 0, sataQuestionCount: 0, avgDifficulty: 0, gaps: [] });
    Object.assign(byCategory.get(category)!, {
      questionCount: Number(row.question_count || 0),
      ngnQuestionCount: Number(row.ngn_question_count || 0),
      sataQuestionCount: Number(row.sata_question_count || 0),
      avgDifficulty: Number(row.avg_difficulty || 0),
    });
  }

  const lessons = await pool.query(`SELECT category, body_system, content FROM content_items WHERE tier = 'rn' AND type = 'lesson'`);
  for (const lesson of lessons.rows) {
    const category = lesson.category || lesson.body_system || "Uncategorized";
    if (!byCategory.has(category)) continue;
    if (lessonMetrics(lesson.content).isDeep) byCategory.get(category)!.deepLessonCount += 1;
  }

  for (const row of byCategory.values()) {
    if (row.lessonCount === 0) row.gaps.push("missing RN lessons");
    if (row.deepLessonCount < row.lessonCount) row.gaps.push("some lessons below deep-content threshold");
    if (row.questionCount < 25) row.gaps.push("question volume below minimum target of 25 per category");
    if (row.ngnQuestionCount < 5) row.gaps.push("NGN/case-style question coverage low");
    if (row.sataQuestionCount < 5) row.gaps.push("SATA/select-all coverage low");
    if (row.avgDifficulty < 2.8) row.gaps.push("difficulty mix too easy");
  }

  return [...byCategory.values()].sort((a, b) => a.category.localeCompare(b.category));
}

async function writeProgressReport(report: Record<string, any>) {
  const reportDir = path.join(process.cwd(), "reports", "rn-content-quality");
  await fs.mkdir(reportDir, { recursive: true });
  const jsonPath = path.join(reportDir, "latest-rn-content-progress.json");
  const mdPath = path.join(reportDir, "latest-rn-content-progress.md");
  await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
  await fs.writeFile(mdPath, `# RN Content Quality Progress Report\n\nGenerated: ${report.generatedAt}\n\n## Summary\n\n- Lessons audited: ${report.summary.lessonsAudited}\n- Lessons repaired: ${report.summary.lessonsRepaired}\n- Questions audited: ${report.summary.questionsAudited}\n- Questions repaired: ${report.summary.questionsRepaired}\n- Categories reviewed: ${report.coverage.length}\n- NCLEX blueprint categories enforced: ${NCLEX_RN_BLUEPRINT_CATEGORIES.join(", ")}\n\n## Coverage by category\n\n| Category | Lessons | Deep lessons | Questions | NGN/case | SATA | Avg difficulty | Gaps |\n|---|---:|---:|---:|---:|---:|---:|---|\n${report.coverage.map((row: CoverageRow) => `| ${row.category} | ${row.lessonCount} | ${row.deepLessonCount} | ${row.questionCount} | ${row.ngnQuestionCount} | ${row.sataQuestionCount} | ${row.avgDifficulty.toFixed(2)} | ${row.gaps.join("; ") || "None"} |`).join("\n")}\n`);
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const repair = process.argv.includes("--repair");
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.split("=")[1]) : 50;
  const openai = getOpenAI();

  const lessons = await pool.query(`
    SELECT id, title, slug, category, body_system, tags, content
    FROM content_items
    WHERE tier = 'rn' AND type = 'lesson'
    ORDER BY updated_at ASC NULLS FIRST
    LIMIT $1
  `, [limit]);

  let lessonsRepaired = 0;
  for (const lesson of lessons.rows) {
    const metrics = lessonMetrics(lesson.content);
    if (!metrics.isDeep && repair && !dryRun) {
      const repaired = await repairLessonWithAi(openai, lesson);
      await pool.query(
        `UPDATE content_items SET content = $1, updated_at = NOW(), summary = COALESCE(summary, $2) WHERE id = $3`,
        [JSON.stringify(repaired), `Deep NCLEX-RN lesson covering ${lesson.title} with pathophysiology, priorities, labs, safety, education, and case application.`, lesson.id]
      );
      lessonsRepaired += 1;
    }
  }

  const questions = await pool.query(`
    SELECT *
    FROM exam_questions
    WHERE tier = 'rn'
    ORDER BY updated_at ASC NULLS FIRST, created_at ASC NULLS FIRST
    LIMIT $1
  `, [limit]);

  let questionsRepaired = 0;
  for (const question of questions.rows) {
    if (!questionIsDeep(question) && repair && !dryRun) {
      const repaired = await repairQuestionWithAi(openai, question);
      if (repaired) {
        await pool.query(
          `UPDATE exam_questions
           SET stem = COALESCE($1, stem), options = COALESCE($2, options), correct_answer = COALESCE($3, correct_answer), rationale = COALESCE($4, rationale), scenario = COALESCE($5, scenario), clinical_pearl = COALESCE($6, clinical_pearl), correct_answer_explanation = COALESCE($7, correct_answer_explanation), incorrect_answer_rationale = COALESCE($8, incorrect_answer_rationale), clinical_reasoning = COALESCE($9, clinical_reasoning), key_takeaway = COALESCE($10, key_takeaway), difficulty = COALESCE($11, difficulty), question_type = COALESCE($12, question_type), updated_at = NOW()
           WHERE id = $13`,
          [
            repaired.stem,
            repaired.options ? JSON.stringify(repaired.options) : null,
            repaired.correctAnswer ? JSON.stringify(repaired.correctAnswer) : null,
            repaired.rationale,
            repaired.scenario,
            repaired.clinicalPearl,
            repaired.correctAnswerExplanation,
            repaired.incorrectAnswerRationale ? JSON.stringify(repaired.incorrectAnswerRationale) : null,
            repaired.clinicalReasoning,
            repaired.keyTakeaway,
            repaired.difficulty,
            repaired.questionType,
            question.id,
          ]
        );
        questionsRepaired += 1;
      }
    }
  }

  const coverage = await auditCoverage();
  const report = {
    generatedAt: new Date().toISOString(),
    mode: dryRun ? "dry-run" : repair ? "repair" : "audit-only",
    summary: {
      lessonsAudited: lessons.rowCount,
      lessonsRepaired,
      questionsAudited: questions.rowCount,
      questionsRepaired,
      expectedTopicCount: buildAllTopics().length,
      blueprintCategories: NCLEX_RN_BLUEPRINT_CATEGORIES,
    },
    coverage,
  };

  await writeProgressReport(report);
  console.log(JSON.stringify(report.summary, null, 2));
  console.log("Progress report written to reports/rn-content-quality/latest-rn-content-progress.{json,md}");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
