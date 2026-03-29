import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { routeParamString } from "./route-params";
import { createRateLimiter, abuseEscalationMiddleware, botDetectionMiddleware } from "./abuse-protection";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface TopicGroup {
  topicSlug: string;
  topic: string;
  bodySystem: string;
  questionCount: number;
  difficulties: number[];
}

const NURSING_TIERS = ["rpn", "rn", "np"];

const TIER_LABELS: Record<string, string> = {
  rpn: "RPN / LVN",
  rn: "RN / NCLEX-RN",
  np: "Nurse Practitioner",
};

const TIER_EXAM_LABELS: Record<string, string> = {
  rpn: "NCLEX-PN / REx-PN",
  rn: "NCLEX-RN",
  np: "NP Certification (AANP/ANCC)",
};

export function registerNursingQuestionsRoutes(app: Express) {
  const contentBrowseLimiter = createRateLimiter("content_browse");

  app.use("/api/nursing/question-topics", abuseEscalationMiddleware, botDetectionMiddleware, contentBrowseLimiter);

  app.get("/api/nursing/question-topics/:tier", async (req: Request, res: Response) => {
    try {
      const tier = routeParamString(req.params.tier);
      if (!NURSING_TIERS.includes(tier)) {
        return res.status(400).json({ error: "Invalid tier. Must be rpn, rn, or np." });
      }

      const result = await pool.query(
        `SELECT topic, body_system, difficulty
         FROM exam_questions
         WHERE tier = $1 AND status = 'published' AND topic IS NOT NULL AND topic != ''`,
        [tier]
      );

      const topicMap = new Map<string, TopicGroup>();

      for (const row of result.rows) {
        const slug = slugify(row.topic);
        if (!slug) continue;
        if (!topicMap.has(slug)) {
          topicMap.set(slug, {
            topicSlug: slug,
            topic: row.topic,
            bodySystem: row.body_system || "General",
            questionCount: 0,
            difficulties: [],
          });
        }
        const group = topicMap.get(slug)!;
        group.questionCount++;
        if (row.difficulty && !group.difficulties.includes(row.difficulty)) {
          group.difficulties.push(row.difficulty);
        }
      }

      const topics = Array.from(topicMap.values())
        .filter(t => t.questionCount >= 2)
        .sort((a, b) => b.questionCount - a.questionCount || a.topic.localeCompare(b.topic));

      const bodySystems = new Map<string, { bodySystem: string; bodySystemSlug: string; topicCount: number; questionCount: number }>();
      for (const t of topics) {
        const bsSlug = slugify(t.bodySystem);
        if (!bodySystems.has(bsSlug)) {
          bodySystems.set(bsSlug, { bodySystem: t.bodySystem, bodySystemSlug: bsSlug, topicCount: 0, questionCount: 0 });
        }
        const bs = bodySystems.get(bsSlug)!;
        bs.topicCount++;
        bs.questionCount += t.questionCount;
      }

      res.json({
        tier,
        tierLabel: TIER_LABELS[tier],
        examLabel: TIER_EXAM_LABELS[tier],
        topics,
        bodySystems: Array.from(bodySystems.values()).sort((a, b) => b.questionCount - a.questionCount),
        totalQuestions: topics.reduce((sum, t) => sum + t.questionCount, 0),
        totalTopics: topics.length,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/nursing/question-topics/:tier/:topicSlug", async (req: Request, res: Response) => {
    try {
      const tier = routeParamString(req.params.tier);
      const topicSlug = routeParamString(req.params.topicSlug);
      if (!NURSING_TIERS.includes(tier)) {
        return res.status(400).json({ error: "Invalid tier." });
      }

      const topicResult = await pool.query(
        `SELECT id, stem, options, correct_answer, rationale, body_system, topic, difficulty, region_scope, question_type
         FROM exam_questions
         WHERE tier = $1 AND status = 'published' AND topic IS NOT NULL
         AND TRIM(BOTH '-' FROM LOWER(REGEXP_REPLACE(topic, '[^a-zA-Z0-9]+', '-', 'g'))) = $2
         LIMIT 50`,
        [tier, topicSlug]
      );

      const topicQuestions = topicResult.rows;
      if (topicQuestions.length === 0) {
        return res.status(404).json({ error: "Topic not found" });
      }

      const topic = topicQuestions[0].topic;
      const bodySystem = topicQuestions[0].body_system || "General";

      const totalCountResult = await pool.query(
        `SELECT COUNT(*) as count FROM exam_questions
         WHERE tier = $1 AND status = 'published' AND topic = $2`,
        [tier, topic]
      );
      const totalQuestions = parseInt(totalCountResult.rows[0]?.count || "0", 10);

      const sampleQuestions = topicQuestions.slice(0, 10).map(q => {
        let options = q.options;
        if (typeof options === "string") {
          try { options = JSON.parse(options); } catch { options = []; }
        }
        let correctIndex = 0;
        if (typeof q.correct_answer === "number") {
          correctIndex = q.correct_answer;
        } else if (typeof q.correct_answer === "string") {
          const letterMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, E: 4 };
          correctIndex = letterMap[q.correct_answer.toUpperCase()] ?? 0;
        }
        return {
          id: q.id,
          stem: q.stem,
          options: Array.isArray(options) ? options : [],
          correctIndex,
          rationale: q.rationale || "",
          difficulty: q.difficulty || 3,
          questionType: q.question_type || "multiple_choice",
        };
      });

      const relatedResult = await pool.query(
        `SELECT topic, COUNT(*) as count FROM exam_questions
         WHERE tier = $1 AND status = 'published' AND body_system = $2 AND topic IS NOT NULL AND topic != $3
         GROUP BY topic HAVING COUNT(*) >= 2
         ORDER BY COUNT(*) DESC LIMIT 8`,
        [tier, bodySystem, topic]
      );

      const relatedTopics = relatedResult.rows.map(r => ({
        topicSlug: slugify(r.topic),
        topic: r.topic,
        questionCount: parseInt(r.count, 10),
      })).filter(t => t.topicSlug);

      res.json({
        topicSlug,
        topic,
        bodySystem,
        bodySystemSlug: slugify(bodySystem),
        tier,
        tierLabel: TIER_LABELS[tier],
        examLabel: TIER_EXAM_LABELS[tier],
        totalQuestions,
        sampleQuestions,
        relatedTopics,
        difficulties: Array.from(new Set(topicQuestions.map(q => q.difficulty).filter(Boolean))).sort(),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
