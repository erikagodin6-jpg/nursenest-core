import { db, pool } from "./storage";
import { examQuestions, flashcardBank, generationJobs, verificationReports, aiCache, contentTranslations } from "@shared/schema";
import { eq, and, sql, inArray, desc } from "drizzle-orm";
import { fisherYatesShuffle } from "../shared/shuffle";
import OpenAI from "openai";
import crypto from "crypto";
import {
  buildLanguageScopedCacheKey,
  buildLanguageEnforcementPrompt,
  validateContentLanguage,
  buildValidationReport,
  checkTerminologyConsistency,
} from "./language-enforcement";

interface TierTarget {
  min: number;
  target: number;
  highRate: number;
  lowRate: number;
}

const TIER_TARGETS: Record<string, TierTarget> = {
  rpn: { min: 8000, target: 12000, highRate: 500, lowRate: 50 },
  rn: { min: 12000, target: 18000, highRate: 750, lowRate: 75 },
  np: { min: 1500, target: 2500, highRate: 100, lowRate: 25 },
};

const ALLIED_TIER_TARGETS: Record<string, TierTarget> = {
  pharmacyTech: { min: 300, target: 600, highRate: 40, lowRate: 10 },
  paramedic: { min: 300, target: 600, highRate: 40, lowRate: 10 },
  mlt: { min: 300, target: 600, highRate: 40, lowRate: 10 },
  imaging: { min: 300, target: 600, highRate: 40, lowRate: 10 },
};

const DIFFICULTY_DISTRIBUTION = { easy: 0.30, moderate: 0.45, hard: 0.25 };

const BATCH_SIZE = 20;
const TIERS = ["rpn", "rn", "np"] as const;
const ALLIED_TIERS = ["pharmacyTech", "paramedic", "mlt", "imaging"] as const;
const CONTENT_TYPES = ["exam_questions", "flashcards"] as const;

const BODY_SYSTEMS = [
  "Cardiovascular", "Respiratory", "Neurological", "Gastrointestinal",
  "Renal/Urinary", "Endocrine", "Musculoskeletal", "Integumentary",
  "Hematological", "Immunological", "Reproductive", "Mental Health",
  "Pediatrics", "Maternal/Newborn"
];

const MAX_TOPIC_WEIGHT = 0.15;

const SUPPORTED_TRANSLATION_LANGS = ["fr", "es"];

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
    timeout: 30_000,
  });
}

function hashContent(text: string): string {
  return crypto.createHash("sha256").update(text.toLowerCase().trim()).digest("hex");
}

function todayString(): string {
  return new Date().toISOString().split("T")[0];
}

export async function computeTargets() {
  const targets: Array<{
    tier: string;
    contentType: string;
    currentCount: number;
    rate: number;
    mode: string;
    tierMin: number;
    tierTarget: number;
    isAllied: boolean;
  }> = [];

  for (const tier of TIERS) {
    const tierConfig = TIER_TARGETS[tier];
    const [qCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(examQuestions)
      .where(and(eq(examQuestions.tier, tier), inArray(examQuestions.status, ["approved", "published"])));

    const [fCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(flashcardBank)
      .where(and(eq(flashcardBank.tier, tier), inArray(flashcardBank.status, ["approved", "published"])));

    const qCurrent = qCount?.count ?? 0;
    const fCurrent = fCount?.count ?? 0;

    targets.push({
      tier,
      contentType: "exam_questions",
      currentCount: qCurrent,
      rate: qCurrent < tierConfig.min ? tierConfig.highRate : (qCurrent < tierConfig.target ? Math.round((tierConfig.highRate + tierConfig.lowRate) / 2) : tierConfig.lowRate),
      mode: qCurrent < tierConfig.min ? "high_rate" : (qCurrent < tierConfig.target ? "medium_rate" : "low_rate"),
      tierMin: tierConfig.min,
      tierTarget: tierConfig.target,
      isAllied: false,
    });

    targets.push({
      tier,
      contentType: "flashcards",
      currentCount: fCurrent,
      rate: fCurrent < tierConfig.min ? tierConfig.highRate : tierConfig.lowRate,
      mode: fCurrent < tierConfig.min ? "high_rate" : "low_rate",
      tierMin: tierConfig.min,
      tierTarget: tierConfig.target,
      isAllied: false,
    });
  }

  for (const alliedTier of ALLIED_TIERS) {
    const tierConfig = ALLIED_TIER_TARGETS[alliedTier];
    let alliedCount = 0;
    try {
      const result = await pool.query(
        `SELECT COUNT(*)::int as count FROM allied_questions WHERE career_type = $1 AND status IN ('approved', 'published', 'pending')`,
        [alliedTier]
      );
      alliedCount = result.rows[0]?.count ?? 0;
    } catch { }

    targets.push({
      tier: alliedTier,
      contentType: "exam_questions",
      currentCount: alliedCount,
      rate: alliedCount < tierConfig.min ? tierConfig.highRate : tierConfig.lowRate,
      mode: alliedCount < tierConfig.min ? "high_rate" : "low_rate",
      tierMin: tierConfig.min,
      tierTarget: tierConfig.target,
      isAllied: true,
    });
  }

  return targets;
}

function distributeTopics(count: number): Array<{ system: string; count: number }> {
  const maxPerTopic = Math.ceil(count * MAX_TOPIC_WEIGHT);
  const base = Math.floor(count / BODY_SYSTEMS.length);
  let remainder = count - base * BODY_SYSTEMS.length;

  const shuffled = fisherYatesShuffle([...BODY_SYSTEMS]);
  return shuffled.map((system) => {
    let allocated = base;
    if (remainder > 0) {
      allocated++;
      remainder--;
    }
    return { system, count: Math.min(allocated, maxPerTopic) };
  });
}

export async function getDifficultyDistribution(tier: string): Promise<{ easy: number; moderate: number; hard: number }> {
  try {
    const result = await pool.query(
      `SELECT 
        COUNT(*) FILTER (WHERE difficulty <= 2) as easy,
        COUNT(*) FILTER (WHERE difficulty = 3) as moderate,
        COUNT(*) FILTER (WHERE difficulty >= 4) as hard
      FROM exam_questions 
      WHERE tier = $1 AND status IN ('approved', 'published')`,
      [tier]
    );
    const row = result.rows[0] || {};
    return {
      easy: Number(row.easy) || 0,
      moderate: Number(row.moderate) || 0,
      hard: Number(row.hard) || 0,
    };
  } catch {
    return { easy: 0, moderate: 0, hard: 0 };
  }
}

function computeDifficultyBias(dist: { easy: number; moderate: number; hard: number }): string {
  const total = dist.easy + dist.moderate + dist.hard;
  if (total === 0) return "Generate a mix: 30% easy (difficulty 1-2), 45% moderate (difficulty 3), 25% hard (difficulty 4-5).";

  const easyPct = dist.easy / total;
  const modPct = dist.moderate / total;
  const hardPct = dist.hard / total;

  const needs: string[] = [];
  if (easyPct < DIFFICULTY_DISTRIBUTION.easy - 0.05) needs.push(`more easy questions (current: ${Math.round(easyPct * 100)}%, target: 30%)`);
  if (modPct < DIFFICULTY_DISTRIBUTION.moderate - 0.05) needs.push(`more moderate questions (current: ${Math.round(modPct * 100)}%, target: 45%)`);
  if (hardPct < DIFFICULTY_DISTRIBUTION.hard - 0.05) needs.push(`more hard questions (current: ${Math.round(hardPct * 100)}%, target: 25%)`);

  if (needs.length === 0) return "Maintain balanced difficulty: 30% easy (1-2), 45% moderate (3), 25% hard (4-5).";
  return `PRIORITY: Generate ${needs.join(", ")}. Target distribution: 30% easy (difficulty 1-2), 45% moderate (difficulty 3), 25% hard (difficulty 4-5).`;
}

export async function createDailyJobs(date?: string) {
  const runDate = date || todayString();
  const created: string[] = [];

  const allTiers = [...TIERS, ...ALLIED_TIERS];

  for (const tier of allTiers) {
    for (const contentType of CONTENT_TYPES) {
      if (ALLIED_TIERS.includes(tier as any) && contentType === "flashcards") continue;

      const existing = await db
        .select()
        .from(generationJobs)
        .where(
          and(
            eq(generationJobs.runDate, runDate),
            eq(generationJobs.tier, tier),
            eq(generationJobs.contentType, contentType)
          )
        );

      if (existing.length > 0) continue;

      const targets = await computeTargets();
      const target = targets.find((t) => t.tier === tier && t.contentType === contentType);
      if (!target) continue;

      if (target.currentCount >= target.tierTarget && target.mode === "low_rate") {
        continue;
      }

      const topicPlan = distributeTopics(target.rate);

      const [job] = await db
        .insert(generationJobs)
        .values({
          runDate,
          contentType,
          tier,
          targetCount: target.rate,
          generatedCount: 0,
          mode: target.mode,
          topicPlanJson: topicPlan,
          status: "queued",
        })
        .returning();

      created.push(job.id);
    }
  }

  return created;
}

async function generateExamQuestionsBatch(
  tier: string,
  system: string,
  count: number,
  difficultyBias?: string,
  targetLanguage: string = "en"
): Promise<
  Array<{
    stem: string;
    options: any;
    correctAnswer: any;
    rationale: string;
    difficulty: number;
    topic: string;
    bodySystem: string;
    distractorRationales?: unknown;
  }>
> {
  const openai = getOpenAI();
  const tierLabel = tier.toUpperCase();
  const scopeNote = tier === "rpn" ? "Practical nursing scope (LPN/RPN)" : tier === "rn" ? "Registered Nurse scope" : "Nurse Practitioner scope with advanced pharmacology and diagnostics";

  const difficultyInstruction = difficultyBias || "Generate a mix: 30% easy (difficulty 1-2), 45% moderate (difficulty 3), 25% hard (difficulty 4-5).";

  const prompt = `Generate ${count} unique NCLEX-style multiple-choice exam questions for ${tierLabel} nursing students about the ${system} body system.

Scope: ${scopeNote}

Difficulty distribution: ${difficultyInstruction}

For each question provide:
- stem: The question text (clinical scenario with patient details)
- options: Array of exactly 4 answer choices labeled A-D
- correctAnswer: The correct option letter
- rationale: Detailed clinical rationale explaining why the correct answer is right and why others are wrong
- difficulty: 1-5 scale (1=easy recall, 3=application, 5=complex analysis)
- topic: Specific topic within ${system}

Return JSON array. Each question must be clinically accurate, unique, and test critical thinking.`;

  try {
    const baseCacheKey = hashContent(`eq_${tier}_${system}_${count}_${todayString()}_${difficultyBias || "default"}`);
    const cacheKey = buildLanguageScopedCacheKey(baseCacheKey, targetLanguage);
    const cached = await db.select().from(aiCache).where(eq(aiCache.cacheKey, cacheKey)).limit(1);
    if (cached.length > 0) {
      return cached[0].outputJson as any;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content || "{}";
    let parsed;
    try {
      const raw = JSON.parse(content);
      parsed = Array.isArray(raw) ? raw : raw.questions || raw.items || [raw];
    } catch {
      console.error("[Pipeline] Failed to parse AI response for exam questions");
      return [];
    }

    const results = parsed.map((q: any) => ({
      stem: q.stem || q.question || "",
      options: q.options || [],
      correctAnswer: q.correctAnswer || q.correct_answer || "A",
      rationale: q.rationale || "",
      difficulty: q.difficulty || 3,
      topic: q.topic || system,
      bodySystem: system,
      distractorRationales: q.distractorRationales ?? q.distractor_rationales,
    }));

    await db.insert(aiCache).values({ cacheKey, outputJson: results }).onConflictDoNothing();

    return results;
  } catch (error) {
    console.error(`[Pipeline] Error generating exam questions for ${tier}/${system}:`, error);
    return [];
  }
}

async function generateFlashcardsBatch(
  tier: string,
  system: string,
  count: number,
  targetLanguage: string = "en"
): Promise<Array<{ front: string; back: string; topicTag: string }>> {
  const openai = getOpenAI();
  const tierLabel = tier.toUpperCase();

  const prompt = `Generate ${count} nursing study flashcards for ${tierLabel} students about the ${system} body system.

For each flashcard provide:
- front: A focused study question or term
- back: A concise, accurate answer with key clinical details
- topicTag: Specific topic within ${system}

Return JSON array. Each card must be clinically accurate and appropriate for ${tierLabel} scope.`;

  try {
    const cacheKey = buildLanguageScopedCacheKey(hashContent(`fc_${tier}_${system}_${count}_${todayString()}`), targetLanguage);
    const cached = await db.select().from(aiCache).where(eq(aiCache.cacheKey, cacheKey));
    if (cached.length > 0) {
      return cached[0].outputJson as any;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content || "{}";
    let parsed;
    try {
      const raw = JSON.parse(content);
      parsed = Array.isArray(raw) ? raw : raw.flashcards || raw.cards || raw.items || [raw];
    } catch {
      console.error("[Pipeline] Failed to parse AI response for flashcards");
      return [];
    }

    const results = parsed.map((f: any) => ({
      front: f.front || f.question || "",
      back: f.back || f.answer || "",
      topicTag: f.topicTag || f.topic_tag || f.topic || system,
    }));

    await db.insert(aiCache).values({ cacheKey, outputJson: results }).onConflictDoNothing();

    return results;
  } catch (error) {
    console.error(`[Pipeline] Error generating flashcards for ${tier}/${system}:`, error);
    return [];
  }
}

export async function verifyItem(
  entityType: "exam_question" | "flashcard",
  entityId: string,
  content: string
): Promise<{ verdict: string; confidence: number; issues: string[] }> {
  const openai = getOpenAI();

  const prompt = `You are a clinical nursing content reviewer. Evaluate this ${entityType} for accuracy and safety.

Content:
${content}

Check for:
1. Unsafe medication dosing errors
2. Incorrect lab value ranges
3. Scope of practice violations
4. Clinical hallucinations or inaccurate pathophysiology
5. Ambiguous or misleading answer options

Return JSON with:
- verdict: "pass" | "pass_with_edits" | "fail" | "needs_human_review"
- confidence: 0.0 to 1.0
- issues: array of specific issues found (empty if none)`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.1,
      max_tokens: 1000,
    });

    const raw = JSON.parse(response.choices[0]?.message?.content || "{}");

    const result = {
      verdict: raw.verdict || "needs_human_review",
      confidence: raw.confidence || 0.5,
      issues: raw.issues || [],
    };

    await db.insert(verificationReports).values({
      entityType,
      entityId,
      verdict: result.verdict,
      confidenceScore: result.confidence,
      issuesJson: result.issues,
      modelVersion: "gpt-4o-mini",
    });

    return result;
  } catch (error) {
    console.error(`[Pipeline] Verification error for ${entityType}/${entityId}:`, error);
    return { verdict: "needs_human_review", confidence: 0, issues: ["Verification API error"] };
  }
}

export async function linkQuestionToLesson(questionId: string, topic: string | null, bodySystem: string | null): Promise<string | null> {
  if (!topic && !bodySystem) return null;

  try {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIdx = 1;

    if (topic) {
      conditions.push(`(title ILIKE $${paramIdx} OR slug ILIKE $${paramIdx + 1})`);
      params.push(`%${topic}%`, `%${topic.toLowerCase().replace(/\s+/g, "-")}%`);
      paramIdx += 2;
    }
    if (bodySystem) {
      conditions.push(`(title ILIKE $${paramIdx} OR slug ILIKE $${paramIdx + 1})`);
      params.push(`%${bodySystem}%`, `%${bodySystem.toLowerCase().replace(/[\s/]+/g, "-")}%`);
      paramIdx += 2;
    }

    const whereClause = conditions.join(" OR ");
    const result = await pool.query(
      `SELECT id, title FROM content_items WHERE status = 'published' AND (${whereClause}) ORDER BY created_at DESC LIMIT 3`,
      params
    );

    if (result.rows.length > 0) {
      const lessonIds = result.rows.map((r: any) => r.id);
      await pool.query(
        `UPDATE exam_questions SET related_lesson_ids = $1 WHERE id = $2`,
        [lessonIds, questionId]
      );
      console.log(`[Pipeline] Linked question ${questionId} to ${lessonIds.length} lesson(s): ${result.rows.map((r: any) => r.title).join(", ")}`);
      return lessonIds[0];
    }

    await pool.query(
      `UPDATE exam_questions SET related_lesson_ids = '{}'::text[] WHERE id = $1 AND (related_lesson_ids IS NULL OR related_lesson_ids = '{}'::text[])`,
      [questionId]
    );
    console.log(`[Pipeline] Question ${questionId} has no matching lesson (topic=${topic}, bodySystem=${bodySystem})`);
    return null;
  } catch (err: any) {
    console.error(`[Pipeline] Lesson linking error for ${questionId}:`, err.message);
    return null;
  }
}

export async function translateQuestionFields(questionId: string, stem: string, options: any, rationale: string, distractorRationales: any): Promise<void> {
  const openai = getOpenAI();

  for (const lang of SUPPORTED_TRANSLATION_LANGS) {
    try {
      const langLabel = lang === "fr" ? "French" : "Spanish";

      const translationPrompt = `Translate the following nursing exam question fields into ${langLabel}. Maintain clinical accuracy and medical terminology conventions for ${langLabel}-speaking healthcare contexts.

Stem: ${stem}

Options: ${JSON.stringify(options)}

Rationale: ${rationale}

${distractorRationales ? `Distractor Rationales: ${JSON.stringify(distractorRationales)}` : ""}

Return JSON with:
- stem: translated stem
- options: translated options array (same structure)
- rationale: translated rationale
${distractorRationales ? '- distractorRationales: translated distractor rationales' : ''}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: translationPrompt }],
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_tokens: 3000,
      });

      const translated = JSON.parse(response.choices[0]?.message?.content || "{}");

      const sourceHash = hashContent(stem);

      const fields: Array<{ fieldName: string; text: string }> = [
        { fieldName: "stem", text: translated.stem || "" },
        { fieldName: "options", text: JSON.stringify(translated.options || options) },
        { fieldName: "rationale", text: translated.rationale || "" },
      ];

      if (translated.distractorRationales) {
        fields.push({ fieldName: "distractorRationales", text: JSON.stringify(translated.distractorRationales) });
      }

      for (const field of fields) {
        if (!field.text) continue;
        await db.insert(contentTranslations).values({
          contentType: "exam_question",
          contentId: questionId,
          languageCode: lang,
          fieldName: field.fieldName,
          translatedText: field.text,
          translationStatus: "auto",
          sourceHash,
        }).onConflictDoNothing();
      }

      console.log(`[Pipeline] Translated question ${questionId} to ${langLabel}`);
    } catch (err: any) {
      console.error(`[Pipeline] Translation error for ${questionId} → ${lang}:`, err.message);
    }
  }
}

export async function runGenerationJob(jobId: string) {
  const [job] = await db.select().from(generationJobs).where(eq(generationJobs.id, jobId)).limit(1);
  if (!job) throw new Error(`Job ${jobId} not found`);
  if (job.status !== "queued") return { skipped: true, reason: `Job status is ${job.status}` };

  console.log(`[Pipeline] Job ${jobId}: starting generation → targeting DEVELOPMENT database`);
  await db.update(generationJobs).set({ status: "running" }).where(eq(generationJobs.id, jobId));

  const topicPlan = (job.topicPlanJson as Array<{ system: string; count: number }>) || [];
  let totalGenerated = 0;
  let totalFailed = 0;

  const diffDist = await getDifficultyDistribution(job.tier);
  const difficultyBias = computeDifficultyBias(diffDist);

  try {
    for (const { system, count } of topicPlan) {
      if (count <= 0) continue;

      const batches = Math.ceil(count / BATCH_SIZE);
      for (let b = 0; b < batches; b++) {
        const batchCount = Math.min(BATCH_SIZE, count - b * BATCH_SIZE);

        if (job.contentType === "exam_questions") {
          const questions = await generateExamQuestionsBatch(job.tier, system, batchCount, difficultyBias);

          for (const q of questions) {
            const contentHash = hashContent(q.stem);
            try {
              const hasMinQuality = q.stem?.length >= 40 && q.rationale?.length >= 50 && Array.isArray(q.options) && q.options.length >= 4;
              const initialStatus = hasMinQuality ? "published" : "needs_review";

              const [inserted] = await db
                .insert(examQuestions)
                .values({
                  tier: job.tier,
                  exam: `${job.tier.toUpperCase()}-CAT`,
                  questionType: "multiple_choice",
                  status: initialStatus,
                  stem: q.stem,
                  options: q.options,
                  correctAnswer: q.correctAnswer,
                  rationale: q.rationale,
                  difficulty: q.difficulty,
                  bodySystem: q.bodySystem,
                  topic: q.topic,
                  stemHash: contentHash,
                  regionScope: "BOTH",
                  publishedAt: hasMinQuality ? new Date() : null,
                })
                .onConflictDoNothing()
                .returning();

              if (inserted) {
                totalGenerated++;
                const verifyResult = await verifyItem("exam_question", inserted.id, `${q.stem}\n${JSON.stringify(q.options)}\nAnswer: ${q.correctAnswer}\n${q.rationale}`);

                if (verifyResult.verdict === "fail") {
                  await db.update(examQuestions).set({ status: "needs_review", publishedAt: null }).where(eq(examQuestions.id, inserted.id));
                }

                await linkQuestionToLesson(inserted.id, q.topic, q.bodySystem);

                if (verifyResult.verdict === "pass" || verifyResult.verdict === "pass_with_edits") {
                  try {
                    await translateQuestionFields(inserted.id, q.stem, q.options, q.rationale, q.distractorRationales || null);
                  } catch (translationErr: any) {
                    console.error(`[Pipeline] Translation error for ${inserted.id}:`, translationErr.message);
                  }
                }
              }
            } catch (err: any) {
              if (err.code === "23505") continue;
              totalFailed++;
              console.error(`[Pipeline] Insert error:`, err.message);
            }
          }
        } else {
          const flashcards = await generateFlashcardsBatch(job.tier, system, batchCount);

          for (const f of flashcards) {
            const contentHash = hashContent(f.front);
            try {
              const hasMinQuality = f.front?.length >= 10 && f.back?.length >= 20;
              const fcStatus = hasMinQuality ? "published" : "needs_review";

              const [inserted] = await db
                .insert(flashcardBank)
                .values({
                  tier: job.tier,
                  topicTag: f.topicTag,
                  front: f.front,
                  back: f.back,
                  status: fcStatus,
                  contentHash,
                })
                .onConflictDoNothing()
                .returning();

              if (inserted) {
                totalGenerated++;
                const verifyResult = await verifyItem("flashcard", inserted.id, `Front: ${f.front}\nBack: ${f.back}`);
                if (verifyResult.verdict === "fail") {
                  await db.update(flashcardBank).set({ status: "needs_review" }).where(eq(flashcardBank.id, inserted.id));
                }
              }
            } catch (err: any) {
              if (err.code === "23505") continue;
              totalFailed++;
              console.error(`[Pipeline] Insert error:`, err.message);
            }
          }
        }
      }
    }

    await db.update(generationJobs).set({
      status: totalFailed > totalGenerated ? "partial" : "done",
      generatedCount: totalGenerated,
      completedAt: new Date(),
    }).where(eq(generationJobs.id, jobId));

    console.log(`[Pipeline] Job ${jobId} complete: ${totalGenerated} generated, ${totalFailed} failed`);
    return { generated: totalGenerated, failed: totalFailed };
  } catch (error) {
    await db.update(generationJobs).set({ status: "failed", completedAt: new Date() }).where(eq(generationJobs.id, jobId));
    console.error(`[Pipeline] Job ${jobId} failed:`, error);
    throw error;
  }
}

export async function runManualGeneration(tier: string, contentType: string, count: number) {
  const topicPlan = distributeTopics(count);
  const targets = await computeTargets();
  const target = targets.find((t) => t.tier === tier && t.contentType === contentType);

  const [job] = await db
    .insert(generationJobs)
    .values({
      runDate: todayString(),
      contentType,
      tier,
      targetCount: count,
      generatedCount: 0,
      mode: target?.mode || "low_rate",
      topicPlanJson: topicPlan,
      status: "queued",
    })
    .returning();

  return runGenerationJob(job.id);
}

export async function getPipelineStatus() {
  const targets = await computeTargets();

  const [recentJobs] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(generationJobs)
    .where(eq(generationJobs.runDate, todayString()));

  return {
    tierTargets: TIER_TARGETS,
    alliedTierTargets: ALLIED_TIER_TARGETS,
    difficultyDistribution: DIFFICULTY_DISTRIBUTION,
    banks: targets,
    todayJobCount: recentJobs?.count ?? 0,
    nextScheduledRun: "02:00 America/Toronto",
  };
}

export async function runContinuousImprovementJob(): Promise<{
  weakQuestions: Array<{ questionId: string; accuracy: number; attempts: number }>;
  weakTopics: Array<{ topic: string; avgAccuracy: number }>;
  flaggedQuestions: Array<{ questionId: string }>;
  generationJobsQueued: number;
}> {
  console.log("[Pipeline] Starting continuous improvement analysis...");

  const result = {
    weakQuestions: [] as Array<{ questionId: string; accuracy: number; attempts: number }>,
    weakTopics: [] as Array<{ topic: string; avgAccuracy: number }>,
    flaggedQuestions: [] as Array<{ questionId: string }>,
    generationJobsQueued: 0,
  };

  try {
    const weakQuestionsResult = await pool.query(`
      WITH answer_data AS (
        SELECT 
          (elem->>'questionId')::text as question_id,
          CASE WHEN (elem->>'isCorrect')::text = 'true' THEN 1 ELSE 0 END as is_correct
        FROM question_bank_results qbr,
        LATERAL jsonb_array_elements(COALESCE(qbr.answers, '[]'::jsonb)) as elem
        WHERE elem->>'questionId' IS NOT NULL
      ),
      question_accuracy AS (
        SELECT 
          ad.question_id,
          q.topic,
          q.body_system,
          q.tier,
          COUNT(*) as total_attempts,
          SUM(ad.is_correct) as correct_count
        FROM answer_data ad
        JOIN exam_questions q ON q.id = ad.question_id
        WHERE q.status = 'published'
        GROUP BY ad.question_id, q.topic, q.body_system, q.tier
        HAVING COUNT(*) >= 50
      )
      SELECT question_id, topic, body_system, tier,
             total_attempts, correct_count,
             ROUND((correct_count::decimal / total_attempts) * 100, 1) as accuracy
      FROM question_accuracy
      WHERE (correct_count::decimal / total_attempts) < 0.40
      ORDER BY accuracy ASC
      LIMIT 100
    `);

    for (const row of weakQuestionsResult.rows) {
      result.weakQuestions.push({
        questionId: row.question_id,
        accuracy: Number(row.accuracy),
        attempts: Number(row.total_attempts),
      });

      await pool.query(
        `UPDATE exam_questions SET quality_feedback = jsonb_set(
          COALESCE(quality_feedback, '{}'::jsonb), 
          '{lowAccuracyFlag}', 
          $1::jsonb
        ) WHERE id = $2`,
        [JSON.stringify({ accuracy: Number(row.accuracy), attempts: Number(row.total_attempts), flaggedAt: new Date().toISOString() }), row.question_id]
      );
    }

    console.log(`[Pipeline] Found ${result.weakQuestions.length} weak questions (<40% accuracy, 50+ attempts)`);
  } catch (err: any) {
    console.error("[Pipeline] Weak question analysis error:", err.message);
  }

  try {
    const weakTopicsResult = await pool.query(`
      WITH answer_data AS (
        SELECT 
          (elem->>'questionId')::text as question_id,
          CASE WHEN (elem->>'isCorrect')::text = 'true' THEN 1 ELSE 0 END as is_correct
        FROM question_bank_results qbr,
        LATERAL jsonb_array_elements(COALESCE(qbr.answers, '[]'::jsonb)) as elem
        WHERE elem->>'questionId' IS NOT NULL
      ),
      topic_accuracy AS (
        SELECT 
          q.topic,
          q.tier,
          COUNT(DISTINCT q.id) as question_count,
          COUNT(*) as total_attempts,
          SUM(ad.is_correct) as correct_count
        FROM answer_data ad
        JOIN exam_questions q ON q.id = ad.question_id
        WHERE q.status = 'published' AND q.topic IS NOT NULL
        GROUP BY q.topic, q.tier
        HAVING COUNT(*) >= 20
      )
      SELECT topic, tier, question_count, total_attempts, correct_count,
             ROUND((correct_count::decimal / NULLIF(total_attempts, 0)) * 100, 1) as avg_accuracy
      FROM topic_accuracy
      WHERE (correct_count::decimal / NULLIF(total_attempts, 1)) < 0.50
      ORDER BY avg_accuracy ASC
      LIMIT 50
    `);

    const weakTopicEntries: Array<{ topic: string; tier: string; avgAccuracy: number }> = [];
    for (const row of weakTopicsResult.rows) {
      weakTopicEntries.push({
        topic: row.topic,
        tier: row.tier,
        avgAccuracy: Number(row.avg_accuracy),
      });
      result.weakTopics.push({
        topic: row.topic,
        avgAccuracy: Number(row.avg_accuracy),
      });
    }

    console.log(`[Pipeline] Found ${result.weakTopics.length} weak topics (<50% avg accuracy)`);

    let jobsQueued = 0;
    for (const entry of weakTopicEntries.slice(0, 5)) {
      try {
        const existing = await pool.query(
          `SELECT id FROM generation_jobs WHERE tier = $1 AND run_date = $2 AND status = 'queued'`,
          [entry.tier, todayString()]
        );

        if (existing.rows.length < 3) {
          const topicPlan = [{ system: entry.topic, count: 10 }];
          await db.insert(generationJobs).values({
            runDate: todayString(),
            contentType: "exam_questions",
            tier: entry.tier,
            targetCount: 10,
            generatedCount: 0,
            mode: "improvement",
            topicPlanJson: topicPlan,
            status: "queued",
          });
          jobsQueued++;
        }
      } catch (err: any) {
        console.error(`[Pipeline] Failed to queue improvement job for topic ${entry.topic}:`, err.message);
      }
    }
    result.generationJobsQueued = jobsQueued;
    console.log(`[Pipeline] Queued ${jobsQueued} targeted generation jobs for weak topics`);
  } catch (err: any) {
    console.error("[Pipeline] Weak topic analysis error:", err.message);
  }

  try {
    const flaggedResult = await pool.query(`
      SELECT id FROM exam_questions 
      WHERE quality_feedback IS NOT NULL 
      AND quality_feedback::text LIKE '%"flagged"%'
      AND status = 'published'
      LIMIT 50
    `);

    for (const row of flaggedResult.rows) {
      result.flaggedQuestions.push({ questionId: row.id });
    }
    console.log(`[Pipeline] Found ${result.flaggedQuestions.length} user-flagged questions`);
  } catch (err: any) {
    console.error("[Pipeline] Flagged question scan error:", err.message);
  }

  console.log("[Pipeline] Continuous improvement analysis complete");
  return result;
}
