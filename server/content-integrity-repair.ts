import OpenAI from "openai";
import { pool } from "./storage";
import {
  getQuestionsMissingRationales,
  getQuestionsMissingMetadata,
  getQuestionsWithoutFlashcards,
  getLessonsMissingSeo,
  getNonCATQuestionsNeedingRationaleUpgrade,
  countNonCATRationaleAudit,
  type RationaleAuditQuestion,
} from "./content-integrity-scanner";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export interface RepairResult {
  repaired: number;
  failed: number;
  skipped: number;
  details: { contentId: string; field: string; status: string; error?: string }[];
}

async function logRepair(
  scanRunId: string | null, contentType: string, contentId: string,
  repairType: string, field: string, beforeValue: string | null,
  afterValue: string | null, repairMethod: string, status: string,
  healthRecordId?: string | null
) {
  try {
    await pool.query(
      `INSERT INTO content_repair_log (id, health_record_id, scan_run_id, content_type, content_id, repair_type, field, before_value, after_value, repair_method, status, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())`,
      [healthRecordId || null, scanRunId, contentType, contentId, repairType, field, beforeValue?.substring(0, 5000), afterValue?.substring(0, 5000), repairMethod, status]
    );
  } catch (err: any) {
    console.error("[RepairLog] Error logging repair:", err.message);
  }
}

export async function repairMissingRationales(scanRunId: string | null, batchSize: number = 50): Promise<RepairResult> {
  const result: RepairResult = { repaired: 0, failed: 0, skipped: 0, details: [] };
  const questions = await getQuestionsMissingRationales(batchSize);

  for (const q of questions) {
    try {
      const optionsText = Array.isArray(q.options)
        ? q.options.map((o: any, i: number) => `${String.fromCharCode(65 + i)}. ${typeof o === "string" ? o : o.text || JSON.stringify(o)}`).join("\n")
        : "";
      const correctIdx = Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer;

      const prompt = `You are a clinical nursing education expert writing for ${q.tier?.toUpperCase() || "nursing"} exam preparation.

Generate a comprehensive rationale for this exam question. The rationale must:
- Be clinically accurate and evidence-based
- Explain WHY the correct answer is correct
- Briefly explain why each incorrect answer is wrong
- Be appropriate for the ${q.tier?.toUpperCase() || "nursing"} exam level
- Be 150-300 words
- Focus on exam-relevant clinical reasoning

Question: ${q.stem}
Options:
${optionsText}
Correct Answer: ${correctIdx}

Write the rationale directly without any preamble:`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.3,
      });

      const rationale = response.choices[0]?.message?.content?.trim();
      if (!rationale || rationale.length < 30) {
        result.failed++;
        result.details.push({ contentId: q.id, field: "rationale", status: "failed", error: "AI generated empty or too-short rationale" });
        continue;
      }

      await pool.query(`UPDATE exam_questions SET rationale = $1 WHERE id = $2`, [rationale, q.id]);
      await logRepair(scanRunId, "questions", q.id, "ai_generate_rationale", "rationale", null, rationale.substring(0, 200), "openai_gpt4o_mini", "applied");
      result.repaired++;
      result.details.push({ contentId: q.id, field: "rationale", status: "repaired" });
    } catch (err: any) {
      result.failed++;
      result.details.push({ contentId: q.id, field: "rationale", status: "failed", error: err.message });
    }
  }

  return result;
}

export async function repairMissingMetadata(scanRunId: string | null, batchSize: number = 50): Promise<RepairResult> {
  const result: RepairResult = { repaired: 0, failed: 0, skipped: 0, details: [] };
  const questions = await getQuestionsMissingMetadata(batchSize);

  for (const q of questions) {
    try {
      const prompt = `You are a clinical nursing education expert. Analyze this exam question and infer the missing metadata.

Question (${q.tier?.toUpperCase() || "nursing"} level): ${q.stem}

Return a JSON object with these fields:
- body_system: the primary body system (e.g., "Cardiovascular", "Respiratory", "Neurological", "Gastrointestinal", "Musculoskeletal", "Endocrine", "Renal/Urinary", "Integumentary", "Immune/Hematologic", "Reproductive", "Mental Health")
- topic: the clinical topic (e.g., "Heart Failure", "Pneumonia", "Diabetes Management")
- tags: array of 3-5 relevant tags
- difficulty: integer 1-5 (1=easy, 5=very hard)
- cognitive_level: one of "recall", "application", "analysis"

Return ONLY valid JSON, no other text:`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.2,
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (!content) {
        result.failed++;
        result.details.push({ contentId: q.id, field: "metadata", status: "failed", error: "Empty AI response" });
        continue;
      }

      let parsed: any;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
      } catch {
        result.failed++;
        result.details.push({ contentId: q.id, field: "metadata", status: "failed", error: "Failed to parse AI JSON" });
        continue;
      }

      const updates: string[] = [];
      const params: any[] = [];
      let paramIdx = 1;

      if (parsed.body_system && typeof parsed.body_system === "string") {
        updates.push(`body_system = $${paramIdx++}`);
        params.push(parsed.body_system);
      }
      if (parsed.topic && typeof parsed.topic === "string") {
        updates.push(`topic = $${paramIdx++}`);
        params.push(parsed.topic);
      }
      if (Array.isArray(parsed.tags) && parsed.tags.length > 0) {
        updates.push(`tags = $${paramIdx++}`);
        params.push(parsed.tags);
      }
      if (typeof parsed.difficulty === "number" && parsed.difficulty >= 1 && parsed.difficulty <= 5) {
        updates.push(`difficulty = $${paramIdx++}`);
        params.push(parsed.difficulty);
      }
      if (parsed.cognitive_level && typeof parsed.cognitive_level === "string") {
        updates.push(`cognitive_level = $${paramIdx++}`);
        params.push(parsed.cognitive_level);
      }

      if (updates.length === 0) {
        result.skipped++;
        result.details.push({ contentId: q.id, field: "metadata", status: "skipped", error: "No valid metadata inferred" });
        continue;
      }

      params.push(q.id);
      await pool.query(`UPDATE exam_questions SET ${updates.join(", ")} WHERE id = $${paramIdx}`, params);
      await logRepair(scanRunId, "questions", q.id, "ai_infer_metadata", "metadata", null, JSON.stringify(parsed).substring(0, 500), "openai_gpt4o_mini", "applied");
      result.repaired++;
      result.details.push({ contentId: q.id, field: "metadata", status: "repaired" });
    } catch (err: any) {
      result.failed++;
      result.details.push({ contentId: q.id, field: "metadata", status: "failed", error: err.message });
    }
  }

  return result;
}

export async function repairMissingFlashcards(scanRunId: string | null, batchSize: number = 50): Promise<RepairResult> {
  const result: RepairResult = { repaired: 0, failed: 0, skipped: 0, details: [] };
  const questions = await getQuestionsWithoutFlashcards(batchSize);

  for (const q of questions) {
    try {
      const prompt = `You are a nursing exam preparation expert. Create a flashcard for this nursing exam question.

Question: ${q.stem}
Topic: ${q.topic || "General Nursing"}
Tier: ${q.tier?.toUpperCase() || "Nursing"}

Create a flashcard with:
- front: A concise question or prompt (not the exact exam question, but testing the same concept)
- back: A clear, concise answer with the key clinical fact

Return ONLY valid JSON: {"front": "...", "back": "..."}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.3,
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (!content) {
        result.failed++;
        result.details.push({ contentId: q.id, field: "flashcard", status: "failed", error: "Empty AI response" });
        continue;
      }

      let parsed: any;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
      } catch {
        result.failed++;
        result.details.push({ contentId: q.id, field: "flashcard", status: "failed", error: "Failed to parse AI JSON" });
        continue;
      }

      if (!parsed.front || !parsed.back) {
        result.failed++;
        result.details.push({ contentId: q.id, field: "flashcard", status: "failed", error: "Missing front or back" });
        continue;
      }

      let deckId: string | null = null;
      const topicSlug = (q.topic || "general").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const deckResult = await pool.query(
        `SELECT id FROM flashcard_decks WHERE slug = $1 LIMIT 1`,
        [`auto-${q.tier || "nursing"}-${topicSlug}`]
      );

      if (deckResult.rows.length > 0) {
        deckId = deckResult.rows[0].id;
      } else {
        const newDeck = await pool.query(
          `INSERT INTO flashcard_decks (id, owner_id, title, slug, tier, visibility, created_at, updated_at)
           VALUES (gen_random_uuid(), 'system', $1, $2, $3, 'public', NOW(), NOW())
           RETURNING id`,
          [`${q.topic || "General"} - ${(q.tier || "nursing").toUpperCase()}`, `auto-${q.tier || "nursing"}-${topicSlug}`, q.tier || "free"]
        );
        deckId = newDeck.rows[0].id;
      }

      await pool.query(
        `INSERT INTO deck_flashcards (id, deck_id, front, back, tags, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())`,
        [deckId, parsed.front, parsed.back, JSON.stringify([q.topic || "general", q.tier || "nursing"])]
      );

      await pool.query(
        `UPDATE flashcard_decks SET card_count = card_count + 1, updated_at = NOW() WHERE id = $1`,
        [deckId]
      );

      await logRepair(scanRunId, "questions", q.id, "ai_generate_flashcards", "linked_flashcard", null, `${parsed.front.substring(0, 100)} | ${parsed.back.substring(0, 100)}`, "openai_gpt4o_mini", "applied");
      result.repaired++;
      result.details.push({ contentId: q.id, field: "flashcard", status: "repaired" });
    } catch (err: any) {
      result.failed++;
      result.details.push({ contentId: q.id, field: "flashcard", status: "failed", error: err.message });
    }
  }

  return result;
}

export interface DeepRationaleUpgradeResult extends RepairResult {
  flashcardsGenerated: number;
  summary: {
    totalScanned: number;
    rationalesUpgraded: number;
    flashcardsGenerated: number;
    skippedHighQuality: number;
    flaggedForReview: number;
    failed: number;
  };
}

function isHighQualityRationale(q: RationaleAuditQuestion): boolean {
  if (!q.rationale || q.rationale.length < 300) return false;
  if (!q.distractorRationales) return false;
  const dr = typeof q.distractorRationales === "string" ? q.distractorRationales : JSON.stringify(q.distractorRationales);
  if (dr === "{}" || dr === "[]" || dr === "null" || dr === "") return false;
  if (!q.correctAnswerExplanation || q.correctAnswerExplanation.trim().length === 0) return false;
  if (!q.clinicalPearl || q.clinicalPearl.trim().length === 0) return false;
  return true;
}

export async function repairDeepRationales(scanRunId: string | null, batchSize: number = 50): Promise<DeepRationaleUpgradeResult> {
  const result: DeepRationaleUpgradeResult = {
    repaired: 0, failed: 0, skipped: 0, details: [],
    flashcardsGenerated: 0,
    summary: { totalScanned: 0, rationalesUpgraded: 0, flashcardsGenerated: 0, skippedHighQuality: 0, flaggedForReview: 0, failed: 0 },
  };

  const questions = await getNonCATQuestionsNeedingRationaleUpgrade(batchSize);
  result.summary.totalScanned = questions.length;

  for (const q of questions) {
    try {
      if (isHighQualityRationale(q)) {
        result.skipped++;
        result.summary.skippedHighQuality++;
        result.details.push({ contentId: q.id, field: "rationale", status: "skipped", error: "Already high quality (300+ words with distractor coverage)" });
        continue;
      }

      const optionsText = Array.isArray(q.options)
        ? q.options.map((o: any, i: number) => `${String.fromCharCode(65 + i)}. ${typeof o === "string" ? o : o.text || JSON.stringify(o)}`).join("\n")
        : "";
      const correctIdx = Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer;

      const prompt = `You are a clinical nursing education expert writing for ${q.tier?.toUpperCase() || "nursing"} exam preparation (NCLEX/REx-PN level).

Generate a comprehensive, structured rationale for this exam question. Return ONLY valid JSON with these exact fields:

{
  "rationale": "Full rationale paragraph (150-300 words). Explain the clinical reasoning, pathophysiology, and evidence behind the correct answer. Include why the correct answer is definitively right.",
  "correct_answer_explanation": "Focused explanation (2-4 sentences) of why the correct answer is right, including the specific clinical reasoning and any relevant pathophysiology.",
  "distractor_rationales": {
    "A": "Why option A is correct or incorrect - explain the misconception or reasoning",
    "B": "Why option B is correct or incorrect - explain the misconception or reasoning",
    "C": "Why option C is correct or incorrect - explain the misconception or reasoning",
    "D": "Why option D is correct or incorrect - explain the misconception or reasoning"
  },
  "clinical_pearl": "A single high-yield exam insight or memory anchor (1-2 sentences) that helps students remember the key concept. Include a mnemonic, clinical tip, or safety note if applicable."
}

Question: ${q.stem}
Options:
${optionsText}
Correct Answer Index: ${correctIdx}
Topic: ${q.topic || "General Nursing"}

Requirements:
- Be clinically accurate and evidence-based
- Each distractor rationale must explain the specific misconception students might have
- The clinical pearl should be a memorable, exam-relevant takeaway
- Include lab values, medication notes, or safety considerations where relevant
- Return ONLY valid JSON, no other text`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1200,
        temperature: 0.3,
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (!content) {
        result.failed++;
        result.summary.failed++;
        result.details.push({ contentId: q.id, field: "rationale", status: "failed", error: "Empty AI response" });
        continue;
      }

      let parsed: any;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
      } catch {
        result.failed++;
        result.summary.failed++;
        result.details.push({ contentId: q.id, field: "rationale", status: "failed", error: "Failed to parse AI JSON response" });
        continue;
      }

      const rationale = parsed.rationale;
      const correctAnswerExplanation = parsed.correct_answer_explanation;
      const distractorRationales = parsed.distractor_rationales;
      const clinicalPearl = parsed.clinical_pearl;

      if (!rationale || rationale.length < 30) {
        result.failed++;
        result.summary.failed++;
        result.details.push({ contentId: q.id, field: "rationale", status: "failed", error: "AI generated empty or too-short rationale" });
        continue;
      }

      if (!distractorRationales || typeof distractorRationales !== "object" || Object.keys(distractorRationales).length === 0) {
        result.failed++;
        result.summary.failed++;
        result.details.push({ contentId: q.id, field: "distractor_rationales", status: "failed", error: "AI generated empty distractor rationales" });
        continue;
      }

      await pool.query(
        `UPDATE exam_questions SET
          rationale = $1,
          correct_answer_explanation = $2,
          distractor_rationales = $3,
          clinical_pearl = $4
        WHERE id = $5`,
        [rationale, correctAnswerExplanation || "", JSON.stringify(distractorRationales), clinicalPearl || "", q.id]
      );

      await logRepair(scanRunId, "questions", q.id, "rationale_upgraded", "rationale", q.rationale?.substring(0, 200) || null, rationale.substring(0, 200), "openai_gpt4o_mini", "applied");

      if (correctAnswerExplanation) {
        await logRepair(scanRunId, "questions", q.id, "rationale_upgraded", "correct_answer_explanation", q.correctAnswerExplanation?.substring(0, 200) || null, correctAnswerExplanation.substring(0, 200), "openai_gpt4o_mini", "applied");
      }
      if (clinicalPearl) {
        await logRepair(scanRunId, "questions", q.id, "rationale_upgraded", "clinical_pearl", q.clinicalPearl?.substring(0, 200) || null, clinicalPearl.substring(0, 200), "openai_gpt4o_mini", "applied");
      }

      result.repaired++;
      result.summary.rationalesUpgraded++;
      result.details.push({ contentId: q.id, field: "rationale", status: "repaired" });

      const flashcardResult = await syncFlashcardForQuestion(scanRunId, q, rationale, clinicalPearl);
      if (flashcardResult === "created") {
        result.flashcardsGenerated++;
        result.summary.flashcardsGenerated++;
      }
    } catch (err: any) {
      result.failed++;
      result.summary.failed++;
      result.details.push({ contentId: q.id, field: "rationale", status: "failed", error: err.message });
    }
  }

  return result;
}

async function syncFlashcardForQuestion(
  scanRunId: string | null,
  q: RationaleAuditQuestion,
  rationale: string,
  clinicalPearl: string | null
): Promise<"created" | "exists" | "failed"> {
  try {
    const topicSlug = (q.topic || "general").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const deckSlug = `auto-${q.tier || "nursing"}-${topicSlug}`;

    const existingCheck = await pool.query(
      `SELECT df.id FROM deck_flashcards df
       JOIN flashcard_decks fd ON fd.id = df.deck_id
       WHERE fd.slug = $1
       AND (df.front ILIKE '%' || LEFT($2, 40) || '%' OR df.tags::text ILIKE '%' || $3 || '%')
       LIMIT 1`,
      [deckSlug, q.stem, q.id]
    );

    if (existingCheck.rows.length > 0) {
      return "exists";
    }

    const prompt = `You are a nursing exam preparation expert. Create a flashcard based on this question's key concept.

Question topic: ${q.topic || "General Nursing"}
Tier: ${q.tier?.toUpperCase() || "Nursing"}
Clinical Pearl: ${clinicalPearl || "N/A"}
Key concept from rationale: ${rationale.substring(0, 300)}

Create a flashcard with:
- front: A concise question or prompt testing the key concept (not the exact exam question)
- back: A clear, concise answer with the key clinical fact AND a memory aid

Return ONLY valid JSON: {"front": "...", "back": "..."}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) return "failed";

    let parsed: any;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch {
      return "failed";
    }

    if (!parsed.front || !parsed.back) return "failed";

    let deckId: string | null = null;
    const deckResult = await pool.query(
      `SELECT id FROM flashcard_decks WHERE slug = $1 LIMIT 1`,
      [deckSlug]
    );

    if (deckResult.rows.length > 0) {
      deckId = deckResult.rows[0].id;
    } else {
      const newDeck = await pool.query(
        `INSERT INTO flashcard_decks (id, owner_id, title, slug, tier, visibility, created_at, updated_at)
         VALUES (gen_random_uuid(), 'system', $1, $2, $3, 'public', NOW(), NOW())
         RETURNING id`,
        [`${q.topic || "General"} - ${(q.tier || "nursing").toUpperCase()}`, deckSlug, q.tier || "free"]
      );
      deckId = newDeck.rows[0].id;
    }

    await pool.query(
      `INSERT INTO deck_flashcards (id, deck_id, front, back, tags, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())`,
      [deckId, parsed.front, parsed.back, JSON.stringify([q.topic || "general", q.tier || "nursing", `qid:${q.id}`])]
    );

    await pool.query(
      `UPDATE flashcard_decks SET card_count = card_count + 1, updated_at = NOW() WHERE id = $1`,
      [deckId]
    );

    await logRepair(scanRunId, "questions", q.id, "flashcard_generated", "linked_flashcard", null, `${parsed.front.substring(0, 100)} | ${parsed.back.substring(0, 100)}`, "openai_gpt4o_mini", "applied");

    return "created";
  } catch {
    return "failed";
  }
}

export async function runDeepRationaleUpgrade(batchSize: number = 50): Promise<{
  scanRunId: string;
  auditSummary: any;
  upgradeResult: DeepRationaleUpgradeResult;
  validationResult: any;
}> {
  const auditSummary = await countNonCATRationaleAudit();

  let scanRunId = "";
  try {
    const scanResult = await pool.query(
      `INSERT INTO integrity_scan_runs (id, scan_type, status, content_types, tiers, started_at, created_at)
       VALUES (gen_random_uuid(), 'deep_rationale_upgrade', 'processing', $1, '{}', NOW(), NOW()) RETURNING id`,
      [["questions"]]
    );
    scanRunId = scanResult.rows[0].id;
  } catch { scanRunId = ""; }

  const upgradeResult = await repairDeepRationales(scanRunId, batchSize);

  const validationResult = await countNonCATRationaleAudit();

  if (scanRunId) {
    try {
      const uniqueAffected = auditSummary.total - auditSummary.highQualitySkipped;
      await pool.query(
        `UPDATE integrity_scan_runs SET
          status = 'completed',
          total_records = $1, scanned_records = $2, issues_found = $3,
          repairs_attempted = $4, repairs_succeeded = $5,
          completed_at = NOW()
        WHERE id = $6`,
        [
          auditSummary.total, upgradeResult.summary.totalScanned,
          uniqueAffected,
          upgradeResult.repaired + upgradeResult.failed,
          upgradeResult.repaired,
          scanRunId
        ]
      );
    } catch {}
  }

  return { scanRunId, auditSummary, upgradeResult, validationResult };
}

export async function repairMissingSeo(scanRunId: string | null, batchSize: number = 50): Promise<RepairResult> {
  const result: RepairResult = { repaired: 0, failed: 0, skipped: 0, details: [] };
  const lessons = await getLessonsMissingSeo(batchSize);

  for (const lesson of lessons) {
    try {
      const prompt = `You are an SEO expert for a nursing education platform called NurseNest.

Generate SEO metadata for this lesson:
Title: ${lesson.title}
Category: ${lesson.category || "General Nursing"}
Summary: ${lesson.summary || "N/A"}

Return ONLY valid JSON:
{
  "seo_title": "SEO-optimized title (max 60 chars, include 'Nursing' keyword)",
  "seo_description": "Meta description (120-155 chars, compelling, includes key terms)",
  "seo_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.3,
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (!content) {
        result.failed++;
        result.details.push({ contentId: lesson.id, field: "seo", status: "failed", error: "Empty AI response" });
        continue;
      }

      let parsed: any;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
      } catch {
        result.failed++;
        result.details.push({ contentId: lesson.id, field: "seo", status: "failed", error: "Failed to parse AI JSON" });
        continue;
      }

      const updates: string[] = [];
      const params: any[] = [];
      let paramIdx = 1;

      if (parsed.seo_title && typeof parsed.seo_title === "string") {
        updates.push(`seo_title = $${paramIdx++}`);
        params.push(parsed.seo_title.substring(0, 70));
      }
      if (parsed.seo_description && typeof parsed.seo_description === "string") {
        updates.push(`seo_description = $${paramIdx++}`);
        params.push(parsed.seo_description.substring(0, 160));
      }
      if (Array.isArray(parsed.seo_keywords) && parsed.seo_keywords.length > 0) {
        updates.push(`seo_keywords = $${paramIdx++}`);
        params.push(parsed.seo_keywords.slice(0, 10));
      }

      if (updates.length === 0) {
        result.skipped++;
        result.details.push({ contentId: lesson.id, field: "seo", status: "skipped" });
        continue;
      }

      updates.push(`updated_at = NOW()`);
      params.push(lesson.id);
      await pool.query(`UPDATE lessons SET ${updates.join(", ")} WHERE id = $${paramIdx}`, params);
      await logRepair(scanRunId, "lessons", lesson.id, "ai_generate_seo", "seo_metadata", null, JSON.stringify(parsed).substring(0, 500), "openai_gpt4o_mini", "applied");
      result.repaired++;
      result.details.push({ contentId: lesson.id, field: "seo", status: "repaired" });
    } catch (err: any) {
      result.failed++;
      result.details.push({ contentId: lesson.id, field: "seo", status: "failed", error: err.message });
    }
  }

  return result;
}

export async function runBatchRepair(scanRunId: string | null, repairTypes?: string[], batchSize: number = 50): Promise<Record<string, RepairResult>> {
  const results: Record<string, RepairResult> = {};
  const types = repairTypes || ["rationales", "metadata", "flashcards", "seo"];

  if (types.includes("rationales")) {
    results.rationales = await repairMissingRationales(scanRunId, batchSize);
  }
  if (types.includes("deep_rationales")) {
    results.deep_rationales = await repairDeepRationales(scanRunId, batchSize);
  }
  if (types.includes("metadata")) {
    results.metadata = await repairMissingMetadata(scanRunId, batchSize);
  }
  if (types.includes("flashcards")) {
    results.flashcards = await repairMissingFlashcards(scanRunId, batchSize);
  }
  if (types.includes("seo")) {
    results.seo = await repairMissingSeo(scanRunId, batchSize);
  }

  return results;
}
