import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";

export interface HealthDimension {
  dimension: string;
  score: number;
  maxScore: number;
  feedback: string;
}

export interface ContentHealthScore {
  contentType: string;
  contentId: string;
  title: string;
  overallScore: number;
  dimensions: HealthDimension[];
  tier: string | null;
  status: string | null;
  computedAt: string;
}

function scoreDimension(name: string, score: number, maxScore: number, feedback: string): HealthDimension {
  return { dimension: name, score: Math.max(0, Math.min(score, maxScore)), maxScore, feedback };
}

function computeOverallScore(dimensions: HealthDimension[]): number {
  const totalScore = dimensions.reduce((sum, d) => sum + d.score, 0);
  const totalMax = dimensions.reduce((sum, d) => sum + d.maxScore, 0);
  return totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
}

export function scoreExamQuestion(q: any): ContentHealthScore {
  const dims: HealthDimension[] = [];

  const stem = q.stem || "";
  dims.push(scoreDimension("Schema Validity",
    stem.length >= 10 && Array.isArray(q.options) && q.options.length >= 4 && q.correct_answer != null ? 20 : stem.length >= 10 ? 10 : 0,
    20,
    stem.length < 10 ? "Missing or too-short stem" : Array.isArray(q.options) && q.options.length < 4 ? `Only ${q.options?.length || 0} options` : "Schema valid"
  ));

  const requiredFields = ["stem", "options", "correct_answer", "tier", "body_system", "topic", "rationale"];
  const filled = requiredFields.filter(f => {
    const v = q[f];
    return v != null && v !== "" && !(Array.isArray(v) && v.length === 0);
  }).length;
  dims.push(scoreDimension("Field Completeness",
    Math.round((filled / requiredFields.length) * 20),
    20,
    `${filled}/${requiredFields.length} required fields filled`
  ));

  const rationaleLen = (q.rationale || "").length;
  dims.push(scoreDimension("Content Adequacy",
    rationaleLen >= 100 ? 20 : rationaleLen >= 50 ? 15 : rationaleLen >= 20 ? 10 : rationaleLen > 0 ? 5 : 0,
    20,
    rationaleLen >= 100 ? "Good rationale length" : rationaleLen > 0 ? "Rationale could be longer" : "Missing rationale"
  ));

  dims.push(scoreDimension("Version Verification",
    q.status === "published" ? 15 : q.status === "approved" ? 10 : 5,
    15,
    `Status: ${q.status || "unknown"}`
  ));

  const hasTags = Array.isArray(q.tags) && q.tags.length > 0;
  const hasDifficulty = q.difficulty != null;
  const hasCognitive = !!q.cognitive_level;
  const metaScore = (hasTags ? 5 : 0) + (hasDifficulty ? 5 : 0) + (hasCognitive ? 5 : 0);
  dims.push(scoreDimension("Metadata Quality",
    metaScore, 15,
    [!hasTags && "missing tags", !hasDifficulty && "missing difficulty", !hasCognitive && "missing cognitive level"].filter(Boolean).join(", ") || "Metadata complete"
  ));

  dims.push(scoreDimension("Runtime Stability",
    q.quarantined_at ? 0 : 10,
    10,
    q.quarantined_at ? `Quarantined: ${q.quarantine_reason || "unknown"}` : "No quarantine issues"
  ));

  return {
    contentType: "exam_question",
    contentId: String(q.id),
    title: (q.stem || "").substring(0, 80),
    overallScore: computeOverallScore(dims),
    dimensions: dims,
    tier: q.tier || null,
    status: q.status || null,
    computedAt: new Date().toISOString(),
  };
}

export function scoreFlashcardDeck(deck: any, cardCount: number): ContentHealthScore {
  const dims: HealthDimension[] = [];

  dims.push(scoreDimension("Schema Validity",
    deck.title && deck.slug ? 20 : deck.title ? 10 : 0,
    20,
    !deck.title ? "Missing title" : !deck.slug ? "Missing slug" : "Schema valid"
  ));

  const requiredFields = ["title", "slug", "tier", "category", "visibility"];
  const filled = requiredFields.filter(f => deck[f] != null && deck[f] !== "").length;
  dims.push(scoreDimension("Field Completeness",
    Math.round((filled / requiredFields.length) * 20),
    20,
    `${filled}/${requiredFields.length} fields filled`
  ));

  dims.push(scoreDimension("Content Adequacy",
    cardCount >= 20 ? 25 : cardCount >= 10 ? 20 : cardCount >= 5 ? 15 : cardCount > 0 ? 8 : 0,
    25,
    cardCount === 0 ? "Empty deck" : `${cardCount} cards`
  ));

  dims.push(scoreDimension("Media Validity",
    deck.visibility === "public" ? 15 : 8,
    15,
    `Visibility: ${deck.visibility || "unknown"}`
  ));

  dims.push(scoreDimension("Version Verification",
    20, 20,
    "Deck present"
  ));

  return {
    contentType: "flashcard_deck",
    contentId: String(deck.id),
    title: deck.title || "Untitled Deck",
    overallScore: computeOverallScore(dims),
    dimensions: dims,
    tier: deck.tier || null,
    status: deck.visibility || null,
    computedAt: new Date().toISOString(),
  };
}

export function scoreLesson(lesson: any): ContentHealthScore {
  const dims: HealthDimension[] = [];

  dims.push(scoreDimension("Schema Validity",
    lesson.title && lesson.slug ? 20 : lesson.title ? 10 : 0,
    20,
    !lesson.title ? "Missing title" : !lesson.slug ? "Missing slug" : "Schema valid"
  ));

  const requiredFields = ["title", "slug", "category", "tier", "summary", "definition", "seo_title", "seo_description"];
  const filled = requiredFields.filter(f => lesson[f] != null && lesson[f] !== "").length;
  dims.push(scoreDimension("Field Completeness",
    Math.round((filled / requiredFields.length) * 15),
    15,
    `${filled}/${requiredFields.length} fields filled`
  ));

  const contentSections = ["definition", "pathophysiology", "signs_symptoms", "diagnostics", "treatment", "nursing_interventions", "complications", "clinical_pearls"];
  const filledSections = contentSections.filter(f => {
    const v = lesson[f];
    return v != null && v !== "" && !(Array.isArray(v) && v.length === 0) && v !== "{}";
  }).length;
  dims.push(scoreDimension("Content Adequacy",
    Math.round((filledSections / contentSections.length) * 20),
    20,
    `${filledSections}/${contentSections.length} content sections filled`
  ));

  const hasSeoTitle = !!lesson.seo_title;
  const hasSeoDesc = !!lesson.seo_description;
  const hasSeoKeywords = Array.isArray(lesson.seo_keywords) && lesson.seo_keywords.length > 0;
  const seoScore = (hasSeoTitle ? 5 : 0) + (hasSeoDesc ? 5 : 0) + (hasSeoKeywords ? 5 : 0);
  dims.push(scoreDimension("SEO Quality",
    seoScore, 15,
    [!hasSeoTitle && "missing SEO title", !hasSeoDesc && "missing SEO description", !hasSeoKeywords && "missing keywords"].filter(Boolean).join(", ") || "SEO complete"
  ));

  const hasRelated = Array.isArray(lesson.related_lesson_slugs) && lesson.related_lesson_slugs.length > 0;
  const hasFlashcards = !!lesson.linked_flashcard_set_id;
  dims.push(scoreDimension("Internal Linking",
    (hasRelated ? 8 : 0) + (hasFlashcards ? 7 : 0),
    15,
    [!hasRelated && "no related lessons", !hasFlashcards && "no linked flashcards"].filter(Boolean).join(", ") || "Good internal linking"
  ));

  dims.push(scoreDimension("Version Verification",
    lesson.status === "published" ? 15 : lesson.status === "draft" ? 8 : 5,
    15,
    `Status: ${lesson.status || "unknown"}`
  ));

  return {
    contentType: "lesson",
    contentId: String(lesson.id),
    title: lesson.title || lesson.slug || "Untitled",
    overallScore: computeOverallScore(dims),
    dimensions: dims,
    tier: lesson.tier || null,
    status: lesson.status || null,
    computedAt: new Date().toISOString(),
  };
}

export function scoreContentItem(item: any): ContentHealthScore {
  const dims: HealthDimension[] = [];

  dims.push(scoreDimension("Schema Validity",
    item.title && item.slug && item.type ? 20 : item.title ? 10 : 0,
    20,
    !item.title ? "Missing title" : !item.slug ? "Missing slug" : "Schema valid"
  ));

  const contentStr = JSON.stringify(item.content || "");
  const wordCount = contentStr.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().split(/\s+/).filter(Boolean).length;
  dims.push(scoreDimension("Content Adequacy",
    wordCount >= 500 ? 25 : wordCount >= 200 ? 18 : wordCount >= 50 ? 10 : wordCount > 0 ? 5 : 0,
    25,
    `${wordCount} words`
  ));

  const hasMeta = !!item.meta_title && !!item.meta_description;
  dims.push(scoreDimension("Metadata Quality",
    hasMeta ? 20 : item.meta_title || item.meta_description ? 10 : 0,
    20,
    hasMeta ? "Metadata complete" : "Missing meta title/description"
  ));

  dims.push(scoreDimension("Field Completeness",
    item.status === "published" ? 20 : 10,
    20,
    `Status: ${item.status || "unknown"}`
  ));

  dims.push(scoreDimension("Version Verification",
    15, 15,
    "Content item present"
  ));

  return {
    contentType: item.type || "content",
    contentId: String(item.id),
    title: item.title || "Untitled",
    overallScore: computeOverallScore(dims),
    dimensions: dims,
    tier: item.tier || null,
    status: item.status || null,
    computedAt: new Date().toISOString(),
  };
}

export function registerContentHealthScoreRoutes(app: Express): void {
  app.get("/api/admin/content-health-scores", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const contentType = (req.query.type as string) || "all";
      const sortBy = (req.query.sort as string) || "score_asc";
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 500);
      const minScore = parseInt(req.query.minScore as string) || 0;
      const maxScore = parseInt(req.query.maxScore as string) || 100;

      const scores: ContentHealthScore[] = [];

      if (contentType === "all" || contentType === "exam_question") {
        const r = await pool.query(
          `SELECT id, stem, options, correct_answer, tier, body_system, topic, rationale, status, tags, difficulty, cognitive_level, quarantined_at, quarantine_reason
           FROM exam_questions WHERE status IN ('published', 'approved') ORDER BY id LIMIT $1`,
          [limit]
        );
        for (const q of r.rows) {
          const score = scoreExamQuestion(q);
          if (score.overallScore >= minScore && score.overallScore <= maxScore) {
            scores.push(score);
          }
        }
      }

      if (contentType === "all" || contentType === "flashcard_deck") {
        const r = await pool.query(
          `SELECT fd.*, COUNT(df.id)::int as card_count
           FROM flashcard_decks fd LEFT JOIN deck_flashcards df ON df.deck_id = fd.id
           GROUP BY fd.id ORDER BY fd.id LIMIT $1`,
          [limit]
        );
        for (const deck of r.rows) {
          const score = scoreFlashcardDeck(deck, deck.card_count);
          if (score.overallScore >= minScore && score.overallScore <= maxScore) {
            scores.push(score);
          }
        }
      }

      if (contentType === "all" || contentType === "lesson") {
        const r = await pool.query(
          `SELECT * FROM lessons ORDER BY id LIMIT $1`,
          [limit]
        );
        for (const lesson of r.rows) {
          const score = scoreLesson(lesson);
          if (score.overallScore >= minScore && score.overallScore <= maxScore) {
            scores.push(score);
          }
        }
      }

      if (contentType === "all" || contentType === "content_item") {
        const r = await pool.query(
          `SELECT * FROM content_items ORDER BY id LIMIT $1`,
          [limit]
        );
        for (const item of r.rows) {
          const score = scoreContentItem(item);
          if (score.overallScore >= minScore && score.overallScore <= maxScore) {
            scores.push(score);
          }
        }
      }

      if (sortBy === "score_asc") {
        scores.sort((a, b) => a.overallScore - b.overallScore);
      } else if (sortBy === "score_desc") {
        scores.sort((a, b) => b.overallScore - a.overallScore);
      }

      const summary = {
        total: scores.length,
        critical: scores.filter(s => s.overallScore < 30).length,
        low: scores.filter(s => s.overallScore >= 30 && s.overallScore < 50).length,
        moderate: scores.filter(s => s.overallScore >= 50 && s.overallScore < 70).length,
        healthy: scores.filter(s => s.overallScore >= 70).length,
        averageScore: scores.length > 0 ? Math.round(scores.reduce((s, item) => s + item.overallScore, 0) / scores.length) : 0,
      };

      res.json({
        scores: scores.slice(0, limit),
        summary,
        filters: { contentType, sortBy, minScore, maxScore, limit },
        computedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error("[ContentHealthScore] Error:", err.message);
      res.status(500).json({ error: "Failed to compute health scores", detail: err.message });
    }
  });

  app.get("/api/admin/content-health-scores/:type/:id", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { type, id } = req.params;
      let score: ContentHealthScore | null = null;

      if (type === "exam_question") {
        const r = await pool.query("SELECT * FROM exam_questions WHERE id = $1", [id]);
        if (r.rows[0]) score = scoreExamQuestion(r.rows[0]);
      } else if (type === "flashcard_deck") {
        const r = await pool.query(
          `SELECT fd.*, COUNT(df.id)::int as card_count FROM flashcard_decks fd LEFT JOIN deck_flashcards df ON df.deck_id = fd.id WHERE fd.id = $1 GROUP BY fd.id`,
          [id]
        );
        if (r.rows[0]) score = scoreFlashcardDeck(r.rows[0], r.rows[0].card_count);
      } else if (type === "lesson") {
        const r = await pool.query("SELECT * FROM lessons WHERE id = $1", [id]);
        if (r.rows[0]) score = scoreLesson(r.rows[0]);
      } else if (type === "content_item") {
        const r = await pool.query("SELECT * FROM content_items WHERE id = $1", [id]);
        if (r.rows[0]) score = scoreContentItem(r.rows[0]);
      }

      if (!score) {
        return res.status(404).json({ error: "Content not found" });
      }

      res.json(score);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
