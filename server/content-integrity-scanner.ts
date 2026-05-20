import { pool } from "./storage";

export interface ScanIssue {
  contentType: string;
  contentId: string;
  contentTitle: string;
  tier: string | null;
  issueType: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  description: string;
  field: string | null;
  currentValue: string | null;
  autoFixable: boolean;
  repairAction: string | null;
}

export interface ScanResult {
  issues: ScanIssue[];
  totalRecords: number;
  scannedRecords: number;
  issuesBySeverity: Record<string, number>;
  issuesByType: Record<string, number>;
  autoFixable: number;
  perTierScores: Record<string, { total: number; healthy: number; score: number }>;
  perTypeScores: Record<string, { total: number; healthy: number; score: number }>;
}

export type ScanMode = "lightweight" | "deep";

const BATCH_SIZE = 500;

function countWords(text: string | null | undefined): number {
  if (!text) return 0;
  return text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().split(/\s+/).filter(Boolean).length;
}

function isEmptyJsonb(val: any): boolean {
  if (!val) return true;
  if (typeof val === "string") return val === "" || val === "[]" || val === "{}";
  if (Array.isArray(val)) return val.length === 0;
  if (typeof val === "object") return Object.keys(val).length === 0;
  return false;
}

export async function runContentScan(mode: ScanMode, contentTypes?: string[], tiers?: string[]): Promise<ScanResult> {
  const issues: ScanIssue[] = [];
  const perTierScores: Record<string, { total: number; healthy: number; score: number }> = {};
  const perTypeScores: Record<string, { total: number; healthy: number; score: number }> = {};
  let totalRecords = 0;
  let scannedRecords = 0;

  const typesToScan = contentTypes || ["questions", "flashcards", "lessons", "blogs", "media"];

  if (typesToScan.includes("questions")) {
    const result = await scanQuestions(mode, tiers);
    issues.push(...result.issues);
    totalRecords += result.totalRecords;
    scannedRecords += result.scannedRecords;
    mergeTierScores(perTierScores, result.tierScores);
    perTypeScores["questions"] = { total: result.totalRecords, healthy: result.totalRecords - result.unhealthyCount, score: result.totalRecords > 0 ? Math.round(((result.totalRecords - result.unhealthyCount) / result.totalRecords) * 100) : 100 };
  }

  if (typesToScan.includes("flashcards")) {
    const result = await scanFlashcards(mode, tiers);
    issues.push(...result.issues);
    totalRecords += result.totalRecords;
    scannedRecords += result.scannedRecords;
    perTypeScores["flashcards"] = { total: result.totalRecords, healthy: result.totalRecords - result.unhealthyCount, score: result.totalRecords > 0 ? Math.round(((result.totalRecords - result.unhealthyCount) / result.totalRecords) * 100) : 100 };
  }

  if (typesToScan.includes("lessons")) {
    const result = await scanLessons(mode);
    issues.push(...result.issues);
    totalRecords += result.totalRecords;
    scannedRecords += result.scannedRecords;
    mergeTierScores(perTierScores, result.tierScores);
    perTypeScores["lessons"] = { total: result.totalRecords, healthy: result.totalRecords - result.unhealthyCount, score: result.totalRecords > 0 ? Math.round(((result.totalRecords - result.unhealthyCount) / result.totalRecords) * 100) : 100 };
  }

  if (typesToScan.includes("blogs")) {
    const result = await scanBlogs(mode);
    issues.push(...result.issues);
    totalRecords += result.totalRecords;
    scannedRecords += result.scannedRecords;
    perTypeScores["blogs"] = { total: result.totalRecords, healthy: result.totalRecords - result.unhealthyCount, score: result.totalRecords > 0 ? Math.round(((result.totalRecords - result.unhealthyCount) / result.totalRecords) * 100) : 100 };
  }

  if (typesToScan.includes("media") && mode === "deep") {
    const result = await scanMedia();
    issues.push(...result.issues);
    totalRecords += result.totalRecords;
    scannedRecords += result.scannedRecords;
    perTypeScores["media"] = { total: result.totalRecords, healthy: result.totalRecords - result.unhealthyCount, score: result.totalRecords > 0 ? Math.round(((result.totalRecords - result.unhealthyCount) / result.totalRecords) * 100) : 100 };
  }

  const issuesBySeverity: Record<string, number> = {};
  const issuesByType: Record<string, number> = {};
  let autoFixable = 0;

  for (const issue of issues) {
    issuesBySeverity[issue.severity] = (issuesBySeverity[issue.severity] || 0) + 1;
    issuesByType[issue.issueType] = (issuesByType[issue.issueType] || 0) + 1;
    if (issue.autoFixable) autoFixable++;
  }

  return { issues, totalRecords, scannedRecords, issuesBySeverity, issuesByType, autoFixable, perTierScores, perTypeScores };
}

function mergeTierScores(target: Record<string, any>, source: Record<string, any>) {
  for (const [tier, data] of Object.entries(source)) {
    if (!target[tier]) target[tier] = { total: 0, healthy: 0, score: 0 };
    target[tier].total += data.total;
    target[tier].healthy += data.healthy;
    target[tier].score = target[tier].total > 0 ? Math.round((target[tier].healthy / target[tier].total) * 100) : 100;
  }
}

interface TypeScanResult {
  issues: ScanIssue[];
  totalRecords: number;
  scannedRecords: number;
  unhealthyCount: number;
  tierScores: Record<string, { total: number; healthy: number; score: number }>;
}

async function scanQuestions(mode: ScanMode, tiers?: string[]): Promise<TypeScanResult> {
  const issues: ScanIssue[] = [];
  const tierScores: Record<string, { total: number; healthy: number; score: number }> = {};
  let totalRecords = 0;
  let scannedRecords = 0;
  const unhealthyIds = new Set<string>();

  try {
    let query = `SELECT id, tier, exam, question_type, status, stem, options, correct_answer, rationale,
                        difficulty, tags, body_system, topic, subtopic, scenario, distractor_rationales,
                        quality_score, cognitive_level, is_adaptive_eligible,
                        correct_answer_explanation, clinical_pearl
                 FROM exam_questions`;
    const params: any[] = [];
    const conditions: string[] = [];

    if (tiers && tiers.length > 0) {
      conditions.push(`tier = ANY($${params.length + 1})`);
      params.push(tiers);
    }

    if (conditions.length > 0) query += ` WHERE ${conditions.join(" AND ")}`;
    query += ` ORDER BY id LIMIT ${mode === "lightweight" ? 2000 : 10000}`;

    const result = await pool.query(query, params);
    totalRecords = result.rows.length;
    scannedRecords = totalRecords;

    const stemsSeen = new Map<string, string>();

    for (const q of result.rows) {
      const tier = q.tier || "unknown";
      if (!tierScores[tier]) tierScores[tier] = { total: 0, healthy: 0, score: 0 };
      tierScores[tier].total++;

      let hasIssue = false;

      if (!q.stem || q.stem.trim().length < 10) {
        issues.push(makeIssue("questions", q.id, q.stem?.substring(0, 80) || "Untitled", tier, "missing_stem", "critical", "Question has no stem or stem is too short", "stem", q.stem, false, null));
        hasIssue = true;
      }

      if (!q.rationale || q.rationale.trim().length < 20) {
        issues.push(makeIssue("questions", q.id, q.stem?.substring(0, 80) || "Untitled", tier, "missing_rationale", "high", "Question is missing a rationale or rationale is too short", "rationale", q.rationale?.substring(0, 50) || null, true, "ai_generate_rationale"));
        hasIssue = true;
      }

      const options = Array.isArray(q.options) ? q.options : [];
      if (options.length < 4) {
        issues.push(makeIssue("questions", q.id, q.stem?.substring(0, 80) || "Untitled", tier, "incomplete_options", "critical", `Question has only ${options.length} options (need 4)`, "options", String(options.length), false, null));
        hasIssue = true;
      }

      if (isEmptyJsonb(q.correct_answer)) {
        issues.push(makeIssue("questions", q.id, q.stem?.substring(0, 80) || "Untitled", tier, "missing_correct_answer", "critical", "Question has no correct answer set", "correct_answer", null, false, null));
        hasIssue = true;
      }

      if (!q.body_system) {
        issues.push(makeIssue("questions", q.id, q.stem?.substring(0, 80) || "Untitled", tier, "missing_metadata", "medium", "Question is missing body system", "body_system", null, true, "ai_infer_metadata"));
        hasIssue = true;
      }

      if (!q.topic) {
        issues.push(makeIssue("questions", q.id, q.stem?.substring(0, 80) || "Untitled", tier, "missing_metadata", "medium", "Question is missing topic", "topic", null, true, "ai_infer_metadata"));
        hasIssue = true;
      }

      if (isEmptyJsonb(q.tags) || (Array.isArray(q.tags) && q.tags.length === 0)) {
        issues.push(makeIssue("questions", q.id, q.stem?.substring(0, 80) || "Untitled", tier, "missing_tags", "low", "Question has no tags", "tags", null, true, "ai_infer_metadata"));
        hasIssue = true;
      }

      if (!q.difficulty && q.difficulty !== 0) {
        issues.push(makeIssue("questions", q.id, q.stem?.substring(0, 80) || "Untitled", tier, "missing_metadata", "low", "Question is missing difficulty rating", "difficulty", null, true, "ai_infer_metadata"));
        hasIssue = true;
      }

      const isCAT = q.is_adaptive_eligible === true;

      if (isEmptyJsonb(q.distractor_rationales) && !isCAT) {
        issues.push(makeIssue("questions", q.id, q.stem?.substring(0, 80) || "Untitled", tier, "missing_distractor_rationales", "medium", "Question has no distractor explanations", "distractor_rationales", null, true, "ai_generate_rationale"));
        hasIssue = true;
      }

      if (!isCAT && (!q.correct_answer_explanation || q.correct_answer_explanation.trim().length === 0)) {
        issues.push(makeIssue("questions", q.id, q.stem?.substring(0, 80) || "Untitled", tier, "missing_correct_answer_explanation", "medium", "Question has no correct answer explanation", "correct_answer_explanation", null, true, "ai_generate_rationale"));
        hasIssue = true;
      }

      if (!isCAT && (!q.clinical_pearl || q.clinical_pearl.trim().length === 0)) {
        issues.push(makeIssue("questions", q.id, q.stem?.substring(0, 80) || "Untitled", tier, "missing_clinical_pearl", "low", "Question has no clinical pearl", "clinical_pearl", null, true, "ai_generate_rationale"));
        hasIssue = true;
      }

      if (!q.cognitive_level) {
        issues.push(makeIssue("questions", q.id, q.stem?.substring(0, 80) || "Untitled", tier, "missing_metadata", "info", "Question is missing cognitive level", "cognitive_level", null, true, "ai_infer_metadata"));
        hasIssue = true;
      }

      if (mode === "deep" && q.stem) {
        const normalized = q.stem.toLowerCase().trim().replace(/[^\w\s]/g, "").replace(/\s+/g, " ");
        if (stemsSeen.has(normalized)) {
          issues.push(makeIssue("questions", q.id, q.stem?.substring(0, 80) || "Untitled", tier, "duplicate_question", "high", `Duplicate of question ${stemsSeen.get(normalized)}`, "stem", null, false, null));
          hasIssue = true;
        } else {
          stemsSeen.set(normalized, q.id);
        }
      }

      if (hasIssue) unhealthyIds.add(q.id);
      else tierScores[tier].healthy++;
    }

    for (const [tier, data] of Object.entries(tierScores)) {
      data.score = data.total > 0 ? Math.round((data.healthy / data.total) * 100) : 100;
    }
  } catch (err: any) {
    console.error("[IntegrityScanner] Question scan error:", err.message);
  }

  return { issues, totalRecords, scannedRecords, unhealthyCount: unhealthyIds.size, tierScores };
}

async function scanFlashcards(mode: ScanMode, tiers?: string[]): Promise<TypeScanResult> {
  const issues: ScanIssue[] = [];
  let totalRecords = 0;
  let scannedRecords = 0;
  let unhealthyCount = 0;

  try {
    let query = `SELECT df.id, df.deck_id, df.front, df.back, df.tags,
                        fd.title as deck_title, fd.tier, fd.slug as deck_slug
                 FROM deck_flashcards df
                 LEFT JOIN flashcard_decks fd ON fd.id = df.deck_id`;
    const params: any[] = [];
    const conditions: string[] = [];

    if (tiers && tiers.length > 0) {
      conditions.push(`fd.tier = ANY($${params.length + 1})`);
      params.push(tiers);
    }

    if (conditions.length > 0) query += ` WHERE ${conditions.join(" AND ")}`;
    query += ` ORDER BY df.id LIMIT ${mode === "lightweight" ? 2000 : 10000}`;

    const result = await pool.query(query, params);
    totalRecords = result.rows.length;
    scannedRecords = totalRecords;

    for (const fc of result.rows) {
      let hasIssue = false;

      if (!fc.front || fc.front.trim().length < 3) {
        issues.push(makeIssue("flashcards", fc.id, fc.deck_title || "Unknown deck", fc.tier, "missing_front", "critical", "Flashcard has no front content", "front", fc.front, false, null));
        hasIssue = true;
      }

      if (!fc.back || fc.back.trim().length < 3) {
        issues.push(makeIssue("flashcards", fc.id, fc.deck_title || "Unknown deck", fc.tier, "missing_back", "critical", "Flashcard has no back content", "back", fc.back, false, null));
        hasIssue = true;
      }

      if (isEmptyJsonb(fc.tags)) {
        issues.push(makeIssue("flashcards", fc.id, fc.deck_title || "Unknown deck", fc.tier, "missing_tags", "low", "Flashcard has no tags", "tags", null, true, "ai_infer_metadata"));
        hasIssue = true;
      }

      if (!fc.deck_id) {
        issues.push(makeIssue("flashcards", fc.id, "Orphan", null, "orphan_flashcard", "high", "Flashcard is not assigned to any deck", "deck_id", null, false, null));
        hasIssue = true;
      }

      if (hasIssue) unhealthyCount++;
    }

    const orphanDecksResult = await pool.query(
      `SELECT fd.id, fd.title, fd.slug, fd.tier, COUNT(df.id) as card_count
       FROM flashcard_decks fd
       LEFT JOIN deck_flashcards df ON df.deck_id = fd.id
       WHERE fd.visibility = 'public'
       GROUP BY fd.id HAVING COUNT(df.id) = 0
       LIMIT 100`
    );
    for (const deck of orphanDecksResult.rows) {
      issues.push(makeIssue("flashcard_decks", deck.id, deck.title, deck.tier, "empty_deck", "medium", `Public deck "${deck.title}" has 0 flashcards`, null, null, false, null));
    }
  } catch (err: any) {
    console.error("[IntegrityScanner] Flashcard scan error:", err.message);
  }

  return { issues, totalRecords, scannedRecords, unhealthyCount, tierScores: {} };
}

async function scanLessons(mode: ScanMode): Promise<TypeScanResult> {
  const issues: ScanIssue[] = [];
  const tierScores: Record<string, { total: number; healthy: number; score: number }> = {};
  let totalRecords = 0;
  let scannedRecords = 0;
  let unhealthyCount = 0;

  try {
    const result = await pool.query(
      `SELECT id, slug, title, category, tier, status, summary, definition,
              pathophysiology, signs_symptoms, diagnostics, treatment,
              nursing_interventions, complications, clinical_pearls,
              seo_title, seo_description, seo_keywords, image_url, image_alt,
              related_lesson_slugs, linked_flashcard_set_id
       FROM lessons
       ORDER BY id LIMIT ${mode === "lightweight" ? 1000 : 5000}`
    );
    totalRecords = result.rows.length;
    scannedRecords = totalRecords;

    for (const lesson of result.rows) {
      const tier = lesson.tier || "free";
      if (!tierScores[tier]) tierScores[tier] = { total: 0, healthy: 0, score: 0 };
      tierScores[tier].total++;

      let hasIssue = false;

      if (!lesson.title || lesson.title.trim().length < 3) {
        issues.push(makeIssue("lessons", lesson.id, lesson.slug || "unknown", tier, "missing_title", "critical", "Lesson has no title", "title", lesson.title, false, null));
        hasIssue = true;
      }

      if (!lesson.slug) {
        issues.push(makeIssue("lessons", lesson.id, lesson.title || "unknown", tier, "missing_slug", "critical", "Lesson has no slug", "slug", null, false, null));
        hasIssue = true;
      }

      if (!lesson.summary || lesson.summary.trim().length < 20) {
        issues.push(makeIssue("lessons", lesson.id, lesson.title || lesson.slug, tier, "missing_summary", "medium", "Lesson has no summary or summary is too short", "summary", lesson.summary?.substring(0, 50) || null, true, "ai_generate_seo"));
        hasIssue = true;
      }

      if (!lesson.seo_title) {
        issues.push(makeIssue("lessons", lesson.id, lesson.title || lesson.slug, tier, "missing_seo", "medium", "Lesson is missing SEO title", "seo_title", null, true, "ai_generate_seo"));
        hasIssue = true;
      }

      if (!lesson.seo_description) {
        issues.push(makeIssue("lessons", lesson.id, lesson.title || lesson.slug, tier, "missing_seo", "medium", "Lesson is missing SEO description", "seo_description", null, true, "ai_generate_seo"));
        hasIssue = true;
      }

      if (isEmptyJsonb(lesson.seo_keywords)) {
        issues.push(makeIssue("lessons", lesson.id, lesson.title || lesson.slug, tier, "missing_seo", "low", "Lesson has no SEO keywords", "seo_keywords", null, true, "ai_generate_seo"));
        hasIssue = true;
      }

      if (isEmptyJsonb(lesson.related_lesson_slugs)) {
        issues.push(makeIssue("lessons", lesson.id, lesson.title || lesson.slug, tier, "missing_internal_links", "low", "Lesson has no related lesson links", "related_lesson_slugs", null, true, "ai_generate_seo"));
        hasIssue = true;
      }

      if (!lesson.linked_flashcard_set_id) {
        issues.push(makeIssue("lessons", lesson.id, lesson.title || lesson.slug, tier, "no_linked_flashcards", "medium", "Lesson has no linked flashcard set", "linked_flashcard_set_id", null, true, "ai_generate_flashcards"));
        hasIssue = true;
      }

      const contentSections = [lesson.definition, lesson.pathophysiology].filter(Boolean);
      const jsonSections = [lesson.signs_symptoms, lesson.diagnostics, lesson.treatment, lesson.nursing_interventions, lesson.complications, lesson.clinical_pearls].filter(s => !isEmptyJsonb(s));
      if (contentSections.length === 0 && jsonSections.length === 0) {
        issues.push(makeIssue("lessons", lesson.id, lesson.title || lesson.slug, tier, "thin_content", "high", "Lesson has no substantive content in any section", null, null, false, null));
        hasIssue = true;
      }

      if (lesson.status === "draft" && lesson.title && !lesson.title.match(/placeholder|coming soon|untitled|test/i)) {
        issues.push(makeIssue("lessons", lesson.id, lesson.title || lesson.slug, tier, "unpublished_ready", "info", "Lesson appears complete but is still in draft status", "status", "draft", false, null));
        hasIssue = true;
      }

      if (hasIssue) unhealthyCount++;
      else tierScores[tier].healthy++;
    }

    for (const [tier, data] of Object.entries(tierScores)) {
      data.score = data.total > 0 ? Math.round((data.healthy / data.total) * 100) : 100;
    }
  } catch (err: any) {
    console.error("[IntegrityScanner] Lesson scan error:", err.message);
  }

  return { issues, totalRecords, scannedRecords, unhealthyCount, tierScores };
}

async function scanBlogs(mode: ScanMode): Promise<TypeScanResult> {
  const issues: ScanIssue[] = [];
  let totalRecords = 0;
  let scannedRecords = 0;
  let unhealthyCount = 0;

  try {
    const result = await pool.query(
      `SELECT id, slug, title, type, status, content, meta_title, meta_description,
              primary_keyword, seo_score
       FROM content_items
       WHERE type IN ('blog', 'blog-post', 'article', 'lesson')
       ORDER BY id LIMIT ${mode === "lightweight" ? 500 : 5000}`
    );
    totalRecords = result.rows.length;
    scannedRecords = totalRecords;

    for (const post of result.rows) {
      let hasIssue = false;
      const contentStr = JSON.stringify(post.content || "");
      const wordCount = countWords(contentStr);

      if (!post.title || post.title.trim().length < 5) {
        issues.push(makeIssue("blogs", post.id, post.slug || "unknown", null, "missing_title", "critical", "Blog post has no title", "title", post.title, false, null));
        hasIssue = true;
      }

      if (!post.slug) {
        issues.push(makeIssue("blogs", post.id, post.title || "unknown", null, "missing_slug", "critical", "Blog post has no slug", "slug", null, false, null));
        hasIssue = true;
      }

      if (wordCount < 300 && post.status === "published") {
        issues.push(makeIssue("blogs", post.id, post.title || post.slug, null, "thin_content", "high", `Blog post has only ${wordCount} words (minimum 300)`, "content", String(wordCount), false, null));
        hasIssue = true;
      }

      if (!post.meta_title) {
        issues.push(makeIssue("blogs", post.id, post.title || post.slug, null, "missing_seo", "medium", "Blog post is missing meta title", "meta_title", null, true, "ai_generate_seo"));
        hasIssue = true;
      }

      if (!post.meta_description) {
        issues.push(makeIssue("blogs", post.id, post.title || post.slug, null, "missing_seo", "medium", "Blog post is missing meta description", "meta_description", null, true, "ai_generate_seo"));
        hasIssue = true;
      }

      if (hasIssue) unhealthyCount++;
    }
  } catch (err: any) {
    console.error("[IntegrityScanner] Blog scan error:", err.message);
  }

  return { issues, totalRecords, scannedRecords, unhealthyCount, tierScores: {} };
}

async function scanMedia(): Promise<TypeScanResult> {
  const issues: ScanIssue[] = [];
  let totalRecords = 0;
  let scannedRecords = 0;
  let unhealthyCount = 0;

  try {
    const result = await pool.query(
      `SELECT id, title, url, alt_text, asset_type, modality, approval_status
       FROM image_assets
       ORDER BY id LIMIT 5000`
    );
    totalRecords = result.rows.length;
    scannedRecords = totalRecords;

    for (const asset of result.rows) {
      let hasIssue = false;

      if (!asset.alt_text || asset.alt_text.trim().length < 3) {
        issues.push(makeIssue("media", asset.id, asset.title || asset.url, null, "missing_alt_text", "medium", "Image asset is missing alt text", "alt_text", asset.alt_text, true, "ai_generate_seo"));
        hasIssue = true;
      }

      if (!asset.url) {
        issues.push(makeIssue("media", asset.id, asset.title || "unknown", null, "broken_reference", "critical", "Image asset has no URL", "url", null, false, null));
        hasIssue = true;
      }

      if (hasIssue) unhealthyCount++;
    }
  } catch (err: any) {
    console.error("[IntegrityScanner] Media scan error:", err.message);
  }

  return { issues, totalRecords, scannedRecords, unhealthyCount, tierScores: {} };
}

function makeIssue(
  contentType: string, contentId: string, contentTitle: string, tier: string | null,
  issueType: string, severity: ScanIssue["severity"], description: string,
  field: string | null, currentValue: string | null, autoFixable: boolean, repairAction: string | null
): ScanIssue {
  return { contentType, contentId, contentTitle, tier, issueType, severity, description, field, currentValue, autoFixable, repairAction };
}

export async function getQuestionsMissingRationales(limit: number = 100): Promise<{ id: string; stem: string; tier: string; options: any; correctAnswer: any }[]> {
  try {
    const result = await pool.query(
      `SELECT id, stem, tier, options, correct_answer
       FROM exam_questions
       WHERE (rationale IS NULL OR TRIM(rationale) = '' OR LENGTH(rationale) < 20)
       AND status = 'published'
       AND (is_adaptive_eligible = false OR is_adaptive_eligible IS NULL)
       ORDER BY id LIMIT $1`,
      [limit]
    );
    return result.rows.map((r: any) => ({ id: r.id, stem: r.stem, tier: r.tier, options: r.options, correctAnswer: r.correct_answer }));
  } catch { return []; }
}

export interface RationaleAuditQuestion {
  id: string;
  stem: string;
  tier: string;
  topic: string;
  options: any;
  correctAnswer: any;
  rationale: string | null;
  distractorRationales: any;
  correctAnswerExplanation: string | null;
  clinicalPearl: string | null;
}

export async function getNonCATQuestionsNeedingRationaleUpgrade(limit: number = 100): Promise<RationaleAuditQuestion[]> {
  try {
    const result = await pool.query(
      `SELECT id, stem, tier, topic, options, correct_answer, rationale,
              distractor_rationales, correct_answer_explanation, clinical_pearl
       FROM exam_questions
       WHERE (is_adaptive_eligible = false OR is_adaptive_eligible IS NULL)
       AND status = 'published'
       AND NOT (
         LENGTH(COALESCE(rationale, '')) >= 300
         AND distractor_rationales IS NOT NULL AND distractor_rationales::text NOT IN ('{}', '[]', 'null', '')
         AND correct_answer_explanation IS NOT NULL AND TRIM(COALESCE(correct_answer_explanation, '')) != ''
         AND clinical_pearl IS NOT NULL AND TRIM(COALESCE(clinical_pearl, '')) != ''
       )
       ORDER BY id LIMIT $1`,
      [limit]
    );
    return result.rows.map((r: any) => ({
      id: r.id,
      stem: r.stem,
      tier: r.tier,
      topic: r.topic || "",
      options: r.options,
      correctAnswer: r.correct_answer,
      rationale: r.rationale,
      distractorRationales: r.distractor_rationales,
      correctAnswerExplanation: r.correct_answer_explanation,
      clinicalPearl: r.clinical_pearl,
    }));
  } catch { return []; }
}

export async function countNonCATRationaleAudit(): Promise<{
  total: number;
  missingRationale: number;
  weakRationale: number;
  missingDistractorRationales: number;
  missingCorrectAnswerExplanation: number;
  missingClinicalPearl: number;
  highQualitySkipped: number;
  byTier: Record<string, { total: number; issues: number }>;
}> {
  try {
    const result = await pool.query(
      `SELECT tier,
              COUNT(*) as total,
              COUNT(*) FILTER (WHERE rationale IS NULL OR TRIM(rationale) = '') as missing_rationale,
              COUNT(*) FILTER (WHERE rationale IS NOT NULL AND LENGTH(rationale) > 0 AND LENGTH(rationale) < 50) as weak_rationale,
              COUNT(*) FILTER (WHERE distractor_rationales IS NULL OR distractor_rationales::text IN ('{}', '[]', 'null', '')) as missing_distractor,
              COUNT(*) FILTER (WHERE correct_answer_explanation IS NULL OR TRIM(correct_answer_explanation) = '') as missing_correct_exp,
              COUNT(*) FILTER (WHERE clinical_pearl IS NULL OR TRIM(clinical_pearl) = '') as missing_pearl,
              COUNT(*) FILTER (WHERE LENGTH(rationale) >= 300 AND distractor_rationales IS NOT NULL AND distractor_rationales::text NOT IN ('{}', '[]', 'null', '') AND correct_answer_explanation IS NOT NULL AND TRIM(COALESCE(correct_answer_explanation, '')) != '' AND clinical_pearl IS NOT NULL AND TRIM(COALESCE(clinical_pearl, '')) != '') as high_quality
       FROM exam_questions
       WHERE (is_adaptive_eligible = false OR is_adaptive_eligible IS NULL)
       AND status = 'published'
       GROUP BY tier`
    );

    let total = 0, missingRationale = 0, weakRationale = 0, missingDistractorRationales = 0;
    let missingCorrectAnswerExplanation = 0, missingClinicalPearl = 0, highQualitySkipped = 0;
    const byTier: Record<string, { total: number; issues: number }> = {};

    for (const row of result.rows) {
      const t = parseInt(row.total);
      const mr = parseInt(row.missing_rationale);
      const wr = parseInt(row.weak_rationale);
      const md = parseInt(row.missing_distractor);
      const mc = parseInt(row.missing_correct_exp);
      const mp = parseInt(row.missing_pearl);
      const hq = parseInt(row.high_quality);

      total += t;
      missingRationale += mr;
      weakRationale += wr;
      missingDistractorRationales += md;
      missingCorrectAnswerExplanation += mc;
      missingClinicalPearl += mp;
      highQualitySkipped += hq;

      const uniqueAffected = t - hq;
      byTier[row.tier || "unknown"] = { total: t, issues: uniqueAffected };
    }

    return { total, missingRationale, weakRationale, missingDistractorRationales, missingCorrectAnswerExplanation, missingClinicalPearl, highQualitySkipped, byTier };
  } catch {
    return { total: 0, missingRationale: 0, weakRationale: 0, missingDistractorRationales: 0, missingCorrectAnswerExplanation: 0, missingClinicalPearl: 0, highQualitySkipped: 0, byTier: {} };
  }
}

export async function getQuestionsMissingMetadata(limit: number = 100): Promise<{ id: string; stem: string; tier: string }[]> {
  try {
    const result = await pool.query(
      `SELECT id, stem, tier
       FROM exam_questions
       WHERE (body_system IS NULL OR topic IS NULL OR tags IS NULL OR tags = '{}' OR difficulty IS NULL)
       AND status = 'published'
       ORDER BY id LIMIT $1`,
      [limit]
    );
    return result.rows.map((r: any) => ({ id: r.id, stem: r.stem, tier: r.tier }));
  } catch { return []; }
}

export async function getQuestionsWithoutFlashcards(limit: number = 100): Promise<{ id: string; stem: string; tier: string; topic: string; rationale: string }[]> {
  try {
    const result = await pool.query(
      `SELECT eq.id, eq.stem, eq.tier, eq.topic, eq.rationale
       FROM exam_questions eq
       WHERE eq.status = 'published'
       AND eq.rationale IS NOT NULL AND LENGTH(eq.rationale) > 20
       AND NOT EXISTS (
         SELECT 1 FROM deck_flashcards df
         WHERE df.front ILIKE '%' || LEFT(eq.stem, 40) || '%'
         AND df.deck_id IN (
           SELECT fd.id FROM flashcard_decks fd WHERE fd.slug LIKE 'auto-%'
         )
       )
       ORDER BY eq.id LIMIT $1`,
      [limit]
    );
    return result.rows.map((r: any) => ({ id: r.id, stem: r.stem, tier: r.tier, topic: r.topic || "", rationale: r.rationale || "" }));
  } catch { return []; }
}

export async function getLessonsMissingSeo(limit: number = 100): Promise<{ id: string; title: string; slug: string; summary: string; category: string }[]> {
  try {
    const result = await pool.query(
      `SELECT id, title, slug, summary, category
       FROM lessons
       WHERE (seo_title IS NULL OR seo_description IS NULL)
       AND status = 'published'
       ORDER BY id LIMIT $1`,
      [limit]
    );
    return result.rows.map((r: any) => ({ id: r.id, title: r.title, slug: r.slug, summary: r.summary || "", category: r.category || "" }));
  } catch { return []; }
}
