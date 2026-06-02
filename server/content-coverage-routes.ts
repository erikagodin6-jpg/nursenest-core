import type { Express } from "express";
import { requireAdmin } from "./admin-auth";
import { pool } from "./storage";
import { loadLessonData, classifyLessonStatus, deriveTier } from "./lesson-content-api";
import { routeAIRequest, getKillSwitch } from "./ai-provider-router";
import { normalizeBodySystem, normalizeTier, getExamForTier, normalizeQuestionType, normalizeDifficulty, normalizeTopic } from "./taxonomy-normalizer";

interface CoverageTarget {
  category: string;
  key: string;
  target: number;
  current: number;
  percentage: number;
  status: "green" | "yellow" | "red";
  gap: number;
}

interface CoverageReport {
  nursing: {
    byTier: CoverageTarget[];
    byBodySystem: CoverageTarget[];
    bySpecialty: CoverageTarget[];
  };
  alliedHealth: {
    byProfession: CoverageTarget[];
  };
  flashcards: {
    byTopic: CoverageTarget[];
  };
  lessons: {
    total: number;
    complete: number;
    weak: number;
    placeholder: number;
    broken: number;
    missing: { title: string; slug: string; referencedFrom: string }[];
  };
  generationHistory: any[];
  timestamp: string;
}

const NURSING_TIERS = ["rpn", "rn", "np"];
const BODY_SYSTEMS = [
  "Cardiovascular", "Respiratory", "Neurological", "Gastrointestinal",
  "Renal", "Endocrine", "Musculoskeletal", "Integumentary",
  "Hematology", "Immunological", "Reproductive", "Mental Health",
  "Pediatrics", "Maternal/Newborn"
];

const ALLIED_PROFESSIONS = [
  { key: "mlt", label: "Medical Lab Tech" },
  { key: "pharmacyTech", label: "Pharmacy Technician" },
  { key: "paramedic", label: "Paramedic" },
  { key: "rrt", label: "Respiratory Therapist" },
  { key: "imaging", label: "Medical Imaging" },
  { key: "ot", label: "Occupational Therapy" },
  { key: "pt", label: "Physical Therapy" },
  { key: "socialWorker", label: "Social Worker" },
  { key: "psychotherapist", label: "Psychotherapist" },
  { key: "addictionsWorker", label: "Addictions Worker" },
];

const DEFAULT_TARGETS = {
  questionsPerTier: 300,
  questionsPerBodySystem: 300,
  questionsPerSpecialty: 500,
  questionsPerProfession: 300,
  flashcardsPerTopic: 25,
};

function computeStatus(current: number, target: number): "green" | "yellow" | "red" {
  if (target <= 0) return "green";
  const pct = (current / target) * 100;
  if (pct >= 80) return "green";
  if (pct >= 40) return "yellow";
  return "red";
}

async function getConfigurableTargets(): Promise<typeof DEFAULT_TARGETS> {
  try {
    const res = await pool.query(
      `SELECT config_value FROM app_config WHERE config_key = 'content_coverage_targets' LIMIT 1`
    );
    if (res.rows[0]?.config_value) {
      return { ...DEFAULT_TARGETS, ...JSON.parse(res.rows[0].config_value) };
    }
  } catch {}
  return DEFAULT_TARGETS;
}

async function analyzeCoverage(): Promise<CoverageReport> {
  const targets = await getConfigurableTargets();

  const tierCounts = await pool.query(
    `SELECT tier, COUNT(*)::int as count FROM exam_questions 
     WHERE career_type = 'nursing' AND status IN ('draft','approved','published','needs_review')
     GROUP BY tier`
  );
  const tierMap: Record<string, number> = {};
  for (const row of tierCounts.rows) {
    tierMap[row.tier] = row.count;
  }
  const byTier: CoverageTarget[] = NURSING_TIERS.map(tier => {
    const current = tierMap[tier] || 0;
    return {
      category: "Nursing Tier",
      key: tier.toUpperCase(),
      target: targets.questionsPerTier,
      current,
      percentage: Math.round((current / targets.questionsPerTier) * 100),
      status: computeStatus(current, targets.questionsPerTier),
      gap: Math.max(0, targets.questionsPerTier - current),
    };
  });

  const systemCounts = await pool.query(
    `SELECT body_system, COUNT(*)::int as count FROM exam_questions 
     WHERE career_type = 'nursing' AND body_system IS NOT NULL 
     AND status IN ('draft','approved','published','needs_review')
     GROUP BY body_system`
  );
  const systemMap: Record<string, number> = {};
  for (const row of systemCounts.rows) {
    const canonical = normalizeBodySystem(row.body_system);
    systemMap[canonical] = (systemMap[canonical] || 0) + row.count;
  }
  const byBodySystem: CoverageTarget[] = BODY_SYSTEMS.map(sys => {
    const current = systemMap[sys] || 0;
    return {
      category: "Body System",
      key: sys,
      target: targets.questionsPerBodySystem,
      current,
      percentage: Math.round((current / targets.questionsPerBodySystem) * 100),
      status: computeStatus(current, targets.questionsPerBodySystem),
      gap: Math.max(0, targets.questionsPerBodySystem - current),
    };
  });

  const specialtyCounts = await pool.query(
    `SELECT topic, COUNT(*)::int as count FROM exam_questions 
     WHERE career_type = 'nursing' AND topic IS NOT NULL
     AND status IN ('draft','approved','published','needs_review')
     GROUP BY topic ORDER BY count DESC LIMIT 50`
  );
  const bySpecialty: CoverageTarget[] = specialtyCounts.rows.map((row: any) => ({
    category: "Specialty",
    key: row.topic,
    target: targets.questionsPerSpecialty,
    current: row.count,
    percentage: Math.round((row.count / targets.questionsPerSpecialty) * 100),
    status: computeStatus(row.count, targets.questionsPerSpecialty),
    gap: Math.max(0, targets.questionsPerSpecialty - row.count),
  }));

  const alliedCounts = await pool.query(
    `SELECT career_type, COUNT(*)::int as count FROM allied_questions 
     WHERE status IN ('pending','approved','published')
     GROUP BY career_type`
  );
  const alliedMap: Record<string, number> = {};
  for (const row of alliedCounts.rows) {
    alliedMap[row.career_type] = row.count;
  }
  const byProfession: CoverageTarget[] = ALLIED_PROFESSIONS.map(prof => {
    const current = alliedMap[prof.key] || 0;
    return {
      category: "Allied Health",
      key: prof.label,
      target: targets.questionsPerProfession,
      current,
      percentage: Math.round((current / targets.questionsPerProfession) * 100),
      status: computeStatus(current, targets.questionsPerProfession),
      gap: Math.max(0, targets.questionsPerProfession - current),
    };
  });

  const flashcardCounts = await pool.query(
    `SELECT topic_tag, COUNT(*)::int as count FROM flashcard_bank 
     WHERE status IN ('draft','approved','published','needs_review')
     AND topic_tag IS NOT NULL
     GROUP BY topic_tag ORDER BY count DESC LIMIT 50`
  );
  const byTopic: CoverageTarget[] = flashcardCounts.rows.map((row: any) => ({
    category: "Flashcard Topic",
    key: row.topic_tag,
    target: targets.flashcardsPerTopic,
    current: row.count,
    percentage: Math.round((row.count / targets.flashcardsPerTopic) * 100),
    status: computeStatus(row.count, targets.flashcardsPerTopic),
    gap: Math.max(0, targets.flashcardsPerTopic - row.count),
  }));

  let lessonReport = { total: 0, complete: 0, weak: 0, placeholder: 0, broken: 0, missing: [] as any[] };
  try {
    const data = await loadLessonData();
    const entries = Object.entries(data);
    lessonReport.total = entries.length;
    for (const [id, lesson] of entries) {
      const status = classifyLessonStatus(lesson);
      if (status === "complete") lessonReport.complete++;
      else if (status === "weak") lessonReport.weak++;
      else if (status === "placeholder") lessonReport.placeholder++;
      else lessonReport.broken++;
    }

    const navLinks = extractNavLessonLinks(data);
    for (const link of navLinks) {
      if (!data[link.slug]) {
        lessonReport.missing.push(link);
      }
    }
  } catch (err: any) {
    console.error("[Coverage] Lesson scan error:", err.message);
  }

  let generationHistory: any[] = [];
  try {
    const histRes = await pool.query(
      `SELECT id, template_key, variant_key, status, generated_count, accepted_count, 
              rejected_count, triggered_by, created_at, completed_at
       FROM qbank_generation_runs 
       ORDER BY created_at DESC LIMIT 20`
    );
    generationHistory = histRes.rows.map((r: any) => ({
      id: r.id,
      templateKey: r.template_key,
      variantKey: r.variant_key,
      status: r.status,
      generated: r.generated_count,
      accepted: r.accepted_count,
      rejected: r.rejected_count,
      triggeredBy: r.triggered_by,
      createdAt: r.created_at,
      completedAt: r.completed_at,
    }));
  } catch {}

  return {
    nursing: { byTier, byBodySystem, bySpecialty },
    alliedHealth: { byProfession },
    flashcards: { byTopic },
    lessons: lessonReport,
    generationHistory,
    timestamp: new Date().toISOString(),
  };
}

function extractNavLessonLinks(data: Record<string, any>): { title: string; slug: string; referencedFrom: string }[] {
  const links: { title: string; slug: string; referencedFrom: string }[] = [];
  const knownSlugs = new Set(Object.keys(data));

  for (const [id, lesson] of Object.entries(data)) {
    const content = JSON.stringify(lesson).toLowerCase();
    const linkMatches = content.match(/\/lessons\/([a-z0-9-]+)/g) || [];
    for (const match of linkMatches) {
      const slug = match.replace("/lessons/", "");
      if (!knownSlugs.has(slug) && slug.length > 2) {
        const exists = links.find(l => l.slug === slug);
        if (!exists) {
          links.push({
            title: slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
            slug,
            referencedFrom: id,
          });
        }
      }
    }
  }

  return links;
}

interface GenerationResult {
  requested: number;
  generated: number;
  validated: number;
  inserted: number;
  rejected: number;
  errors: string[];
  failureStage?: string;
  rejectionReasons?: string[];
}

const DEFAULT_BATCH_SIZE = 5;
const MAX_BATCH_SIZE = 10;

function parseAIJsonArray(content: string): any[] {
  const cleaned = content.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();

  const arrMatch = cleaned.match(/\[[\s\S]*\]/);
  if (arrMatch) return JSON.parse(arrMatch[0]);

  const objMatch = cleaned.match(/\{[\s\S]*\}/);
  if (objMatch) {
    const obj = JSON.parse(objMatch[0]);
    return obj.questions || obj.items || obj.flashcards || obj.cards || [obj];
  }

  return JSON.parse(cleaned);
}

function validateQuestion(q: any, bodySystem?: string, topic?: string): { valid: boolean; reason?: string } {
  if (!q || typeof q !== "object") return { valid: false, reason: "not an object" };
  if (!q.stem || typeof q.stem !== "string") return { valid: false, reason: "missing stem" };
  if (q.stem.length < 40) return { valid: false, reason: `stem too short (${q.stem.length} chars, need 40+)` };
  const opts = q.options || [];
  if (!Array.isArray(opts) || opts.length < 4) return { valid: false, reason: `need 4+ options, got ${opts.length}` };
  for (let i = 0; i < opts.length; i++) {
    const o = opts[i];
    if (!o || typeof o !== "object" || !o.text) return { valid: false, reason: `option ${i} missing text` };
  }
  if (!q.correctAnswer) return { valid: false, reason: "missing correctAnswer" };
  if (!q.rationale || typeof q.rationale !== "string") return { valid: false, reason: "missing rationale" };
  const qType = (q.questionType || "MCQ").toUpperCase();
  const supported = ["MCQ", "SATA", "ORDERED", "HOTSPOT", "FILL_IN_BLANK", "MULTIPLE_CHOICE"];
  if (!supported.includes(qType)) return { valid: false, reason: `unsupported questionType "${q.questionType}"` };
  return { valid: true };
}

async function generateQuestionsForGap(params: {
  tier: string;
  bodySystem?: string;
  topic?: string;
  count: number;
  difficulty?: string;
}): Promise<GenerationResult> {
  const startTime = Date.now();
  const result: GenerationResult = { requested: 0, generated: 0, validated: 0, inserted: 0, rejected: 0, errors: [], rejectionReasons: [] };

  if (getKillSwitch()) {
    result.errors.push("AI generation kill switch is active");
    result.failureStage = "preflight";
    console.log(`[ContentGen] ${JSON.stringify({ stage: "preflight", status: "blocked", reason: "kill_switch", timestamp: new Date().toISOString() })}`);
    return result;
  }

  const normalizedTier = normalizeTier(params.tier);
  const examValue = getExamForTier(normalizedTier);
  const normalizedBodySystem = normalizeBodySystem(params.bodySystem);
  const normalizedTopicName = await normalizeTopic(params.topic);
  const { difficulty } = params;
  const batchSize = Math.max(1, Math.min(params.count || DEFAULT_BATCH_SIZE, MAX_BATCH_SIZE));
  result.requested = batchSize;

  const scopeNote = normalizedTier === "rpn" ? "Practical nursing scope (LPN/RPN)" : normalizedTier === "rn" ? "Registered Nurse scope" : "Nurse Practitioner scope";
  const diffDist = difficulty || "30% easy (difficulty 1-2), 50% moderate (difficulty 3), 20% difficult (difficulty 4-5)";

  console.log(`[ContentGen] ${JSON.stringify({ stage: "start", tier: normalizedTier, exam: examValue, bodySystem: normalizedBodySystem, topic: normalizedTopicName, batchSize, timestamp: new Date().toISOString() })}`);

  const systemPrompt = `You are a senior nursing exam psychometrician generating NCLEX-style questions.
Scope: ${scopeNote}
Target difficulty distribution: ${diffDist}

IMPORTANT: Return ONLY a valid JSON object with an "items" array. No markdown fences, no commentary.
Generate exactly ${batchSize} question objects. Each object must have this exact schema:
{
  "stem": "clinical vignette with patient demographics, vitals, assessment findings (min 80 chars)",
  "options": [{"label":"A","text":"..."}, {"label":"B","text":"..."}, {"label":"C","text":"..."}, {"label":"D","text":"..."}],
  "correctAnswer": "A",
  "rationale": "detailed explanation (min 150 words) - why correct, why each wrong",
  "clinicalPearl": "exam-relevant insight",
  "difficulty": 3,
  "bodySystem": "${normalizedBodySystem}",
  "topic": "${normalizedTopicName || 'appropriate topic'}",
  "subtopic": "specific subtopic",
  "questionType": "MCQ",
  "tags": ["tag1","tag2"]
}

Return JSON: {"items": [...]}`;

  const userPrompt = `Generate exactly ${batchSize} unique clinical exam questions for ${normalizedTier.toUpperCase()} nursing students.
${normalizedBodySystem !== "Multi-system" ? `Body System: ${normalizedBodySystem}` : ""}
${normalizedTopicName ? `Topic: ${normalizedTopicName}` : ""}
Each question must have a distinct clinical scenario. Return a JSON object with an "items" array of ${batchSize} objects.`;

  try {
    const aiResult = await routeAIRequest(systemPrompt, userPrompt, {
      model: "gpt-4o-mini",
      maxTokens: Math.min(batchSize * 1200, 16000),
      temperature: 0.7,
      responseFormat: { type: "json_object" },
      taskType: "qbank",
      feature: "coverage-gap-generator",
    });
    console.log(`[ContentGen] ${JSON.stringify({ stage: "provider_response", contentLength: aiResult.content.length, tokens: aiResult.tokensUsed, provider: aiResult.providerName, latencyMs: aiResult.latencyMs })}`);

    let questions: any[] = [];
    try {
      questions = parseAIJsonArray(aiResult.content);
    } catch (parseErr: any) {
      console.error(`[ContentGen] ${JSON.stringify({ stage: "parse", status: "error", error: parseErr.message })}`);
      result.errors.push(`Parse failed: ${parseErr.message}`);
      result.failureStage = "parse";
      return result;
    }
    result.generated = questions.length;
    console.log(`[ContentGen] ${JSON.stringify({ stage: "parse_result", parsed: questions.length })}`);

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const validation = validateQuestion(q, normalizedBodySystem, normalizedTopicName || undefined);
      if (!validation.valid) {
        result.rejected++;
        result.rejectionReasons!.push(validation.reason || "unknown");
        console.log(`[ContentGen] ${JSON.stringify({ stage: "validation_reject", index: i, reason: validation.reason })}`);
        continue;
      }
      result.validated++;

      const qType = normalizeQuestionType(q.questionType);
      const qDifficulty = normalizeDifficulty(q.difficulty);
      const qBodySystem = normalizeBodySystem(q.bodySystem || params.bodySystem);
      const qTopic = await normalizeTopic(q.topic || params.topic);

      try {
        const insertResult = await pool.query(
          `INSERT INTO exam_questions (tier, exam, question_type, status, stem, options, correct_answer, rationale, difficulty, tags, body_system, topic, subtopic, region_scope, career_type, clinical_pearl, language_code)
           VALUES ($1, $2, $3, 'draft', $4, $5, $6, $7, $8, $9, $10, $11, $12, 'BOTH', 'nursing', $13, 'en')`,
          [
            normalizedTier, examValue, qType,
            q.stem, JSON.stringify(q.options), JSON.stringify(q.correctAnswer || "A"),
            q.rationale || "", qDifficulty, q.tags || [],
            qBodySystem, qTopic,
            q.subtopic || null, q.clinicalPearl || null,
          ]
        );
        if (insertResult.rowCount && insertResult.rowCount > 0) {
          result.inserted++;
          console.log(`[ContentGen] ${JSON.stringify({ stage: "db_insert", status: "ok", index: i, tier: normalizedTier, topic: qTopic, bodySystem: qBodySystem })}`);
        }
      } catch (err: any) {
        result.rejected++;
        result.rejectionReasons!.push(`db_insert: ${err.message}`);
        if (err.code !== "23505") result.errors.push(`DB: ${err.message}`);
        console.error(`[ContentGen] ${JSON.stringify({ stage: "db_insert", status: "error", index: i, error: err.message, code: err.code })}`);
      }
    }

    if (result.failureStage === undefined && result.inserted === 0 && result.validated === 0) {
      result.failureStage = "validation";
    } else if (result.failureStage === undefined && result.inserted === 0 && result.validated > 0) {
      result.failureStage = "db_insert";
    }

    const elapsed = Date.now() - startTime;
    console.log(`[ContentGen] ${JSON.stringify({ stage: "complete", tier: normalizedTier, topic: normalizedTopicName, bodySystem: normalizedBodySystem, requested: result.requested, generated: result.generated, validated: result.validated, inserted: result.inserted, rejected: result.rejected, failureStage: result.failureStage || null, errors: result.errors.length > 0 ? result.errors : undefined, elapsedMs: elapsed, timestamp: new Date().toISOString() })}`);
    return result;
  } catch (err: any) {
    const elapsed = Date.now() - startTime;
    console.error(`[ContentGen] ${JSON.stringify({ stage: "provider_request", status: "error", error: err.message, tier: normalizedTier, topic: normalizedTopicName, elapsedMs: elapsed, timestamp: new Date().toISOString() })}`);
    result.errors.push(err.message);
    result.failureStage = "provider_request";
    return result;
  }
}

async function generateFlashcardsForGap(params: {
  tier: string;
  topicTag: string;
  count: number;
}): Promise<GenerationResult> {
  const result: GenerationResult = { requested: 0, generated: 0, validated: 0, inserted: 0, rejected: 0, errors: [], rejectionReasons: [] };

  if (getKillSwitch()) {
    result.errors.push("AI generation kill switch is active");
    result.failureStage = "preflight";
    return result;
  }

  const { tier, topicTag } = params;
  const batchSize = Math.max(1, Math.min(params.count || DEFAULT_BATCH_SIZE, MAX_BATCH_SIZE));
  result.requested = batchSize;

  const systemPrompt = `You are a nursing educator creating flashcards for ${tier.toUpperCase()} students.
Create three types of flashcards:
1. Concept Definition - clear front question, concise accurate back
2. Clinical Scenario - mini clinical scenario on front, correct action/assessment on back
3. Exam Recall - high-yield exam fact on front, explanation on back

IMPORTANT: Return ONLY a valid JSON array. No markdown fences, no commentary.
Generate exactly ${batchSize} flashcard objects. Each object:
{
  "front": "question or prompt (concise)",
  "back": "answer with key details (concise but complete)",
  "cardType": "concept_definition",
  "topicTag": "${topicTag}",
  "difficulty": 3,
  "tags": ["tag1"]
}`;

  const userPrompt = `Generate exactly ${batchSize} unique flashcards about "${topicTag}" for ${tier.toUpperCase()} nursing students.
Mix all three card types. Return ONLY a JSON array of ${batchSize} objects.`;

  console.log(`[generator:start] flashcards topic=${topicTag} batchSize=${batchSize}`);

  try {
    const aiResult = await routeAIRequest(systemPrompt, userPrompt, {
      model: "gpt-4o-mini",
      maxTokens: Math.min(batchSize * 500, 8000),
      temperature: 0.7,
      taskType: "content",
      feature: "coverage-flashcard-generator",
    });

    let cards: any[] = [];
    try {
      cards = parseAIJsonArray(aiResult.content);
    } catch (parseErr: any) {
      result.errors.push(`Parse failed: ${parseErr.message}`);
      result.failureStage = "parse";
      return result;
    }
    result.generated = cards.length;

    const crypto = await import("crypto");

    for (const c of cards) {
      if (!c || typeof c !== "object" || !c.front || !c.back) {
        result.rejected++;
        result.rejectionReasons!.push("missing front or back");
        continue;
      }
      result.validated++;

      const hash = crypto.createHash("sha256").update(c.front.toLowerCase().trim()).digest("hex");
      try {
        const insertResult = await pool.query(
          `INSERT INTO flashcard_bank (tier, topic_tag, front, back, status, content_hash, source_type, difficulty, category)
           VALUES ($1, $2, $3, $4, 'draft', $5, 'auto_coverage', $6, $7)
           ON CONFLICT (content_hash) DO NOTHING`,
          [tier, c.topicTag || topicTag, c.front, c.back, hash, c.difficulty || 3, c.cardType || "concept_definition"]
        );
        if (insertResult.rowCount && insertResult.rowCount > 0) {
          result.inserted++;
        } else {
          result.rejected++;
          result.rejectionReasons!.push("duplicate (content_hash)");
        }
      } catch (err: any) {
        result.rejected++;
        result.rejectionReasons!.push(`db_insert: ${err.message}`);
        if (err.code !== "23505") result.errors.push(`DB: ${err.message}`);
      }
    }

    console.log(`[generator:final_result] flashcards requested=${result.requested} generated=${result.generated} validated=${result.validated} inserted=${result.inserted} rejected=${result.rejected}`);
    return result;
  } catch (err: any) {
    result.errors.push(err.message);
    result.failureStage = "provider_request";
    return result;
  }
}

async function generateMissingLesson(params: {
  title: string;
  slug: string;
}): Promise<{ success: boolean; error?: string }> {
  if (getKillSwitch()) {
    return { success: false, error: "AI generation kill switch is active" };
  }

  const { title, slug } = params;

  const systemPrompt = `You are a senior nursing educator creating comprehensive lesson content for NurseNest.
Generate a complete lesson with clinically accurate, exam-focused content.

Output valid JSON with these fields:
{
  "title": "${title}",
  "definition": "1-2 sentence clinical definition",
  "summary": "3-4 sentence overview",
  "objectives": ["learning objective 1", "objective 2", "objective 3"],
  "pathophysiology": "detailed pathophysiology explanation (min 200 words)",
  "riskFactors": ["specific risk factor 1", "risk factor 2", ...],
  "assessmentFindings": ["finding 1", "finding 2", ...],
  "signs": {
    "left": ["Sign/symptom category 1", "category 2"],
    "right": ["Associated detail 1", "detail 2"]
  },
  "diagnostics": ["diagnostic test 1 with normal values", "test 2", ...],
  "management": ["intervention 1", "intervention 2", ...],
  "nursingActions": ["specific nursing action 1", "action 2", ...],
  "medications": [
    {"name": "Drug Name", "class": "Drug Class", "action": "mechanism", "sideEffects": "key side effects", "nursing": "nursing considerations"}
  ],
  "pearls": ["exam pearl 1", "pearl 2", ...],
  "quiz": [
    {"question": "stem", "options": ["A. ...", "B. ...", "C. ...", "D. ..."], "correctAnswer": 0, "rationale": "explanation"}
  ],
  "seo": {
    "title": "SEO title (60 chars)",
    "description": "Meta description (155 chars)"
  }
}`;

  const userPrompt = `Create a complete nursing lesson on: "${title}"
Include pathophysiology, signs & symptoms, diagnostics, nursing interventions, pharmacology, and clinical pearls.
Generate at least 5 quiz questions with rationales. Make content specific and clinically accurate.`;

  try {
    const result = await routeAIRequest(systemPrompt, userPrompt, {
      model: "gpt-4o",
      maxTokens: 8000,
      temperature: 0.7,
      responseFormat: { type: "json_object" },
      taskType: "content",
      feature: "coverage-lesson-generator",
    });

    const parsed = JSON.parse(result.content);

    await pool.query(
      `INSERT INTO publishing_queue (engine_key, content_type, title, content, status, metadata, created_by)
       VALUES ('lesson_engine', 'lesson', $1, $2, 'pending_review', $3, 'coverage_analyzer')
       ON CONFLICT DO NOTHING`,
      [
        parsed.title || title,
        JSON.stringify(parsed),
        JSON.stringify({ slug, generatedAt: new Date().toISOString(), source: "content_coverage_analyzer" }),
      ]
    );

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export function registerContentCoverageRoutes(app: Express): void {
  app.get("/api/admin/content-coverage", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const report = await analyzeCoverage();
      res.json(report);
    } catch (err: any) {
      console.error("[Coverage] Analysis error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-coverage/targets", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const targets = await getConfigurableTargets();
      res.json(targets);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/content-coverage/targets", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const newTargets = { ...DEFAULT_TARGETS, ...req.body };
      try {
        await pool.query(
          `CREATE TABLE IF NOT EXISTS app_config (
             config_key TEXT PRIMARY KEY,
             config_value TEXT,
             updated_at TIMESTAMP DEFAULT NOW()
           )`
        );
        await pool.query(
          `INSERT INTO app_config (config_key, config_value) VALUES ('content_coverage_targets', $1)
           ON CONFLICT (config_key) DO UPDATE SET config_value = $1, updated_at = NOW()`,
          [JSON.stringify(newTargets)]
        );
      } catch (dbErr: any) {
        console.warn("[Coverage] Could not persist targets:", dbErr.message);
      }
      res.json(newTargets);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-coverage/generate-questions", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { tier = "rpn", bodySystem, topic, count = DEFAULT_BATCH_SIZE } = req.body;
      const validTiers = ["rpn", "rn", "np"];
      if (!validTiers.includes(tier)) {
        return res.status(400).json({ error: `tier must be one of: ${validTiers.join(", ")}` });
      }
      const parsed = Math.floor(Number(count));
      const numCount = Math.max(1, Math.min(isNaN(parsed) || parsed < 1 ? DEFAULT_BATCH_SIZE : parsed, MAX_BATCH_SIZE));
      const result = await generateQuestionsForGap({ tier, bodySystem, topic, count: numCount });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-coverage/generate-flashcards", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { tier = "rpn", topicTag, count = DEFAULT_BATCH_SIZE } = req.body;
      if (!topicTag || typeof topicTag !== "string") {
        return res.status(400).json({ error: "topicTag is required" });
      }
      const fcParsed = Math.floor(Number(count));
      const numCount = Math.max(1, Math.min(isNaN(fcParsed) || fcParsed < 1 ? DEFAULT_BATCH_SIZE : fcParsed, MAX_BATCH_SIZE));
      const result = await generateFlashcardsForGap({ tier, topicTag, count: numCount });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-coverage/generate-lesson", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { title, slug } = req.body;
      if (!title || !slug) {
        return res.status(400).json({ error: "title and slug are required" });
      }
      const result = await generateMissingLesson({ title, slug });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-coverage/auto-fill", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { types = ["questions", "flashcards"], maxPerCategory = DEFAULT_BATCH_SIZE } = req.body;
      const batchSize = Math.min(maxPerCategory, MAX_BATCH_SIZE);
      const report = await analyzeCoverage();
      const results: any = { questions: [], flashcards: [], lessons: [], errors: [] };

      if (types.includes("questions")) {
        const gaps = report.nursing.byTier.filter((t: any) => t.status === "red");
        for (const gap of gaps.slice(0, 3)) {
          try {
            const tier = gap.key.toLowerCase();
            const r = await generateQuestionsForGap({ tier, count: batchSize });
            results.questions.push({ tier, key: gap.key, ...r });
          } catch (err: any) {
            results.errors.push(`questions/${gap.key}: ${err.message}`);
          }
        }

        const systemGaps = report.nursing.byBodySystem.filter((t: any) => t.status === "red");
        for (const gap of systemGaps.slice(0, 3)) {
          try {
            const r = await generateQuestionsForGap({ tier: "rn", bodySystem: gap.key, count: batchSize });
            results.questions.push({ bodySystem: gap.key, key: gap.key, ...r });
          } catch (err: any) {
            results.errors.push(`questions/${gap.key}: ${err.message}`);
          }
        }
      }

      if (types.includes("flashcards")) {
        const fcGaps = report.flashcards.byTopic.filter((t: any) => t.status === "red");
        for (const gap of fcGaps.slice(0, 3)) {
          try {
            const r = await generateFlashcardsForGap({ tier: "rpn", topicTag: gap.key, count: batchSize });
            results.flashcards.push({ topic: gap.key, key: gap.key, ...r });
          } catch (err: any) {
            results.errors.push(`flashcards/${gap.key}: ${err.message}`);
          }
        }
      }

      if (types.includes("lessons")) {
        for (const missing of report.lessons.missing.slice(0, 3)) {
          try {
            const r = await generateMissingLesson(missing);
            results.lessons.push({ slug: missing.slug, ...r });
          } catch (err: any) {
            results.errors.push(`lesson/${missing.slug}: ${err.message}`);
          }
        }
      }

      const allBatches = [...results.questions, ...results.flashcards];
      const totalInserted = allBatches.reduce((s: number, b: any) => s + (b.inserted || 0), 0);
      const totalRequested = allBatches.reduce((s: number, b: any) => s + (b.requested || 0), 0);
      const totalRejected = allBatches.reduce((s: number, b: any) => s + (b.rejected || 0), 0);
      const errorCount = results.errors.length + allBatches.filter((b: any) => b.failureStage).length;
      const failureReason = errorCount > 0
        ? results.errors[0] || allBatches.find((b: any) => b.failureStage)?.failureStage || "unknown"
        : undefined;

      res.json({
        ...results,
        requested: totalRequested,
        generated: allBatches.reduce((s: number, b: any) => s + (b.generated || 0), 0),
        validated: allBatches.reduce((s: number, b: any) => s + (b.validated || 0), 0),
        inserted: totalInserted,
        rejected: totalRejected,
        errorCount,
        failureReason,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-coverage/lesson-scan", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const data = await loadLessonData();
      const entries = Object.entries(data);
      const lessonStatuses: any[] = [];

      for (const [id, lesson] of entries) {
        const status = classifyLessonStatus(lesson);
        const tier = deriveTier(id);
        lessonStatuses.push({
          id,
          title: typeof (lesson as any).title === "object" ? ((lesson as any).title.en || (lesson as any).title) : ((lesson as any).title || id),
          tier,
          status,
          hasQuiz: Array.isArray((lesson as any).quiz) && (lesson as any).quiz.length > 0,
          quizCount: Array.isArray((lesson as any).quiz) ? (lesson as any).quiz.length : 0,
          hasMedications: Array.isArray((lesson as any).medications) && (lesson as any).medications.length > 0,
          medCount: Array.isArray((lesson as any).medications) ? (lesson as any).medications.length : 0,
        });
      }

      const navLinks = extractNavLessonLinks(data);
      const missing = navLinks.filter(l => !data[l.slug]);

      res.json({
        total: entries.length,
        statuses: lessonStatuses,
        missing,
        summary: {
          complete: lessonStatuses.filter(l => l.status === "complete").length,
          weak: lessonStatuses.filter(l => l.status === "weak").length,
          placeholder: lessonStatuses.filter(l => l.status === "placeholder").length,
          broken: lessonStatuses.filter(l => l.status === "broken").length,
          missingCount: missing.length,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
