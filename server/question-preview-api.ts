import type { Express, Request, Response } from "express";
import { pool } from "./storage";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseCorrectIndex(ca: any, optionsLength: number): number {
  let correctIndex = 0;
  const letterMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, E: 4 };
  if (Array.isArray(ca)) {
    const first = ca[0];
    if (typeof first === "number") {
      correctIndex = first;
    } else if (typeof first === "string") {
      correctIndex = letterMap[first.toUpperCase()] ?? (parseInt(first, 10) || 0);
    }
  } else if (typeof ca === "number") {
    correctIndex = ca;
  } else if (typeof ca === "string") {
    correctIndex = letterMap[ca.toUpperCase()] ?? (parseInt(ca, 10) || 0);
  }
  if (correctIndex < 0 || correctIndex >= optionsLength) {
    correctIndex = 0;
  }
  return correctIndex;
}

function parseOptions(raw: any): string[] {
  let options = raw;
  if (typeof options === "string") {
    try { options = JSON.parse(options); } catch { options = []; }
  }
  if (!Array.isArray(options)) options = [];
  return options.slice(0, 4).map((opt: any) => {
    if (typeof opt === "string") return opt;
    if (opt && typeof opt === "object" && "text" in opt) return opt.text;
    return String(opt);
  });
}

export function registerQuestionPreviewRoutes(app: Express) {
  app.get("/api/questions/preview/slugs", async (_req: Request, res: Response) => {
    try {
      const result = await pool.query(
        `SELECT DISTINCT topic FROM exam_questions
         WHERE status = 'published' AND career_type = 'nursing'
           AND topic IS NOT NULL AND topic != ''
         ORDER BY topic`
      );

      const slugs: string[] = [];
      const seen = new Set<string>();
      for (const row of result.rows) {
        const slug = slugify(row.topic);
        if (slug && !seen.has(slug)) {
          seen.add(slug);
          slugs.push(slug);
        }
      }

      res.json({ slugs, total: slugs.length });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/questions/preview-multi/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;

      const questionResult = await pool.query(
        `SELECT id, stem, options, correct_answer, rationale, difficulty,
                body_system, topic, subtopic, question_type, tier
         FROM exam_questions
         WHERE status = 'published' AND career_type = 'nursing'
           AND topic IS NOT NULL
           AND question_type = 'multiple_choice'
           AND TRIM(BOTH '-' FROM LOWER(REGEXP_REPLACE(topic, '[^a-zA-Z0-9]+', '-', 'g'))) = $1
         ORDER BY difficulty ASC, created_at DESC
         LIMIT 50`,
        [slug]
      );

      if (questionResult.rows.length === 0) {
        return res.status(404).json({ error: "Question topic not found" });
      }

      const validQuestions = questionResult.rows.filter((row: any) => {
        const opts = parseOptions(row.options);
        return opts.length >= 4 && row.stem && row.stem.trim().length > 0;
      });

      if (validQuestions.length === 0) {
        return res.status(404).json({ error: "No valid questions found for topic" });
      }

      const previewQuestions = validQuestions.slice(0, 10).map((q: any, i: number) => {
        const options = parseOptions(q.options);
        const correctIndex = parseCorrectIndex(q.correct_answer, options.length);
        const rationale = q.rationale || "";
        const paragraphs = rationale.split(/\n\n|\n/).filter((p: string) => p.trim().length > 0);
        const truncatedRationale = paragraphs[0] || "";

        return {
          id: q.id,
          stem: q.stem,
          options,
          correctIndex,
          truncatedRationale,
          hasMoreRationale: paragraphs.length > 1,
          difficulty: q.difficulty || 3,
          category: q.subtopic || q.body_system || "General",
        };
      });

      const firstQ = validQuestions[0];
      const topic = firstQ.topic;
      const bodySystem = firstQ.body_system || "General";

      const totalCountResult = await pool.query(
        `SELECT COUNT(*) as count FROM exam_questions
         WHERE status = 'published' AND career_type = 'nursing' AND topic = $1`,
        [topic]
      );
      const totalAvailable = parseInt(totalCountResult.rows[0]?.count || "0", 10);

      const relatedTopicsResult = await pool.query(
        `SELECT topic, COUNT(*) as count FROM exam_questions
         WHERE status = 'published' AND career_type = 'nursing'
           AND body_system = $1 AND topic IS NOT NULL AND topic != $2
         GROUP BY topic HAVING COUNT(*) >= 2
         ORDER BY COUNT(*) DESC LIMIT 6`,
        [bodySystem, topic]
      );

      const relatedTopics = relatedTopicsResult.rows.map((r: any) => ({
        topicSlug: slugify(r.topic),
        topic: r.topic,
        questionCount: parseInt(r.count, 10),
      })).filter((t: any) => t.topicSlug);

      const relatedLessons: { id: string; title: string }[] = [];
      try {
        const lessonResult = await pool.query(
          `SELECT id, title FROM lessons
           WHERE status = 'published'
             AND (LOWER(title) LIKE $1 OR LOWER(title) LIKE $2)
           ORDER BY title
           LIMIT 3`,
          [`%${topic.toLowerCase()}%`, `%${bodySystem.toLowerCase()}%`]
        );
        for (const row of lessonResult.rows) {
          relatedLessons.push({ id: row.id, title: row.title });
        }
      } catch {}

      const relatedFlashcards: { slug: string; title: string }[] = [];
      try {
        const flashcardResult = await pool.query(
          `SELECT slug, title FROM flashcard_decks
           WHERE is_active = true
             AND (LOWER(title) LIKE $1 OR LOWER(title) LIKE $2)
           ORDER BY title
           LIMIT 3`,
          [`%${topic.toLowerCase()}%`, `%${bodySystem.toLowerCase()}%`]
        );
        for (const row of flashcardResult.rows) {
          relatedFlashcards.push({ slug: row.slug, title: row.title });
        }
      } catch {}

      res.json({
        topicSlug: slug,
        topic,
        bodySystem,
        totalAvailable,
        questions: previewQuestions,
        relatedTopics,
        relatedLessons,
        relatedFlashcards,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/questions/preview/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;

      const questionResult = await pool.query(
        `SELECT id, stem, options, correct_answer, rationale, difficulty,
                body_system, topic, subtopic, question_type, tier
         FROM exam_questions
         WHERE status = 'published' AND career_type = 'nursing'
           AND topic IS NOT NULL
           AND question_type = 'multiple_choice'
           AND TRIM(BOTH '-' FROM LOWER(REGEXP_REPLACE(topic, '[^a-zA-Z0-9]+', '-', 'g'))) = $1
         ORDER BY difficulty ASC, created_at DESC
         LIMIT 10`,
        [slug]
      );

      if (questionResult.rows.length === 0) {
        return res.status(404).json({ error: "Question topic not found" });
      }

      let q = questionResult.rows[0];
      for (const row of questionResult.rows) {
        let opts = row.options;
        if (typeof opts === "string") {
          try { opts = JSON.parse(opts); } catch { opts = []; }
        }
        if (Array.isArray(opts) && opts.length >= 4) {
          q = row;
          break;
        }
      }
      const topic = q.topic;
      const bodySystem = q.body_system || "General";

      let options = q.options;
      if (typeof options === "string") {
        try { options = JSON.parse(options); } catch { options = []; }
      }
      if (!Array.isArray(options)) options = [];

      const correctIndex = parseCorrectIndex(q.correct_answer, options.length);

      const rationale = q.rationale || "";
      const paragraphs = rationale.split(/\n\n|\n/).filter((p: string) => p.trim().length > 0);
      const firstParagraph = paragraphs[0] || "";
      const remainingParagraphs = paragraphs.slice(1).join("\n\n");

      const totalCountResult = await pool.query(
        `SELECT COUNT(*) as count FROM exam_questions
         WHERE status = 'published' AND career_type = 'nursing' AND topic = $1`,
        [topic]
      );
      const totalQuestions = parseInt(totalCountResult.rows[0]?.count || "0", 10);

      const relatedTopicsResult = await pool.query(
        `SELECT topic, COUNT(*) as count FROM exam_questions
         WHERE status = 'published' AND career_type = 'nursing'
           AND body_system = $1 AND topic IS NOT NULL AND topic != $2
         GROUP BY topic HAVING COUNT(*) >= 2
         ORDER BY COUNT(*) DESC LIMIT 6`,
        [bodySystem, topic]
      );

      const relatedTopics = relatedTopicsResult.rows.map((r: any) => ({
        topicSlug: slugify(r.topic),
        topic: r.topic,
        questionCount: parseInt(r.count, 10),
      })).filter((t: any) => t.topicSlug);

      const relatedLessons: { id: string; title: string }[] = [];
      try {
        const lessonResult = await pool.query(
          `SELECT id, title FROM lessons
           WHERE status = 'published'
             AND (LOWER(title) LIKE $1 OR LOWER(title) LIKE $2)
           ORDER BY title
           LIMIT 3`,
          [`%${topic.toLowerCase()}%`, `%${bodySystem.toLowerCase()}%`]
        );
        for (const row of lessonResult.rows) {
          relatedLessons.push({ id: row.id, title: row.title });
        }
      } catch {}

      const relatedFlashcards: { slug: string; title: string }[] = [];
      try {
        const flashcardResult = await pool.query(
          `SELECT slug, title FROM flashcard_decks
           WHERE is_active = true
             AND (LOWER(title) LIKE $1 OR LOWER(title) LIKE $2)
           ORDER BY title
           LIMIT 3`,
          [`%${topic.toLowerCase()}%`, `%${bodySystem.toLowerCase()}%`]
        );
        for (const row of flashcardResult.rows) {
          relatedFlashcards.push({ slug: row.slug, title: row.title });
        }
      } catch {}

      res.json({
        topicSlug: slug,
        topic,
        bodySystem,
        difficulty: q.difficulty || 3,
        questionType: q.question_type || "multiple_choice",
        stem: q.stem,
        options: options.slice(0, 4),
        correctIndex,
        firstParagraph,
        hasMoreRationale: remainingParagraphs.length > 0,
        totalQuestions,
        relatedTopics,
        relatedLessons,
        relatedFlashcards,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
