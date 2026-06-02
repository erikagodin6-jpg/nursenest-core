import type { Express, Request, Response } from "express";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { importClientDataAbsolute } from "./client-data-import";
import { pool } from "./storage";

const __dirnameParamedicApi =
  typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

let questionsCache: any[] | null = null;
let questionsCacheCreatedAt: number = 0;
const PARAMEDIC_CACHE_TTL_MS = 30 * 60 * 1000;
const MAX_PARAMEDIC_CACHED_QUESTIONS = 5000;

export function clearParamedicQuestionsCache(): void {
  questionsCache = null;
  questionsCacheCreatedAt = 0;
}

export function pruneParamedicCacheUnderPressure(): void {
  questionsCache = null;
  questionsCacheCreatedAt = 0;
}

async function loadQuestions(): Promise<any[]> {
  if (questionsCache) {
    if (Date.now() - questionsCacheCreatedAt > PARAMEDIC_CACHE_TTL_MS) {
      questionsCache = null;
      questionsCacheCreatedAt = 0;
    } else {
      return questionsCache;
    }
  }
  let allQuestions: any[] = [];

  // Preferred file-based runtime path when pre-exported JSON exists.
  const jsonPath = path.resolve(process.cwd(), "data/career-questions/paramedic-questions.json");
  if (existsSync(jsonPath)) {
    try {
      const raw = await readFile(jsonPath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        allQuestions = parsed;
      }
    } catch {
      // Fall through to DB/file fallbacks.
    }
  }

  try {
    if (allQuestions.length === 0) {
      const result = await pool.query(
        `SELECT
           blueprint_id AS id,
           stem,
           options,
           correct_answer AS "correctIndex",
           rationale_long AS rationale,
           difficulty,
           blueprint_category AS category,
           subtopic AS topic
         FROM allied_questions
         WHERE career_type = 'paramedic'
         ORDER BY id`,
      );
      if (result.rows.length > 0) {
        allQuestions = result.rows.map((r) => ({
          ...r,
          options: Array.isArray(r.options) ? r.options : JSON.parse(r.options || "[]"),
        }));
      }
    }
  } catch {
    // Fallback to file-based source for local/dev environments without populated DB.
  }

  if (allQuestions.length === 0) {
    const { paramedicQuestions } = await importClientDataAbsolute(
      path.resolve(__dirnameParamedicApi, "../client/src/data/career-questions/paramedic-questions"),
    );
    allQuestions = paramedicQuestions as any[];
  }

  questionsCache = allQuestions.length > MAX_PARAMEDIC_CACHED_QUESTIONS
    ? allQuestions.slice(0, MAX_PARAMEDIC_CACHED_QUESTIONS)
    : allQuestions;
  questionsCacheCreatedAt = Date.now();
  return questionsCache;
}

interface TopicGroup {
  topicSlug: string;
  topic: string;
  category: string;
  questionCount: number;
  difficulties: number[];
  sampleQuestion?: any;
}

export function registerParamedicQuestionsRoutes(app: Express) {
  app.get("/api/paramedic/question-topics", async (_req: Request, res: Response) => {
    try {
      const questions = await loadQuestions();
      const topicMap = new Map<string, TopicGroup>();

      for (const q of questions) {
        const slug = slugify(q.topic);
        if (!topicMap.has(slug)) {
          topicMap.set(slug, {
            topicSlug: slug,
            topic: q.topic,
            category: q.category,
            questionCount: 0,
            difficulties: [],
          });
        }
        const group = topicMap.get(slug)!;
        group.questionCount++;
        if (!group.difficulties.includes(q.difficulty)) {
          group.difficulties.push(q.difficulty);
        }
      }

      const topics = Array.from(topicMap.values())
        .sort((a, b) => b.questionCount - a.questionCount || a.topic.localeCompare(b.topic));

      const categories = new Map<string, { category: string; categorySlug: string; topicCount: number; questionCount: number }>();
      for (const t of topics) {
        const catSlug = slugify(t.category);
        if (!categories.has(catSlug)) {
          categories.set(catSlug, { category: t.category, categorySlug: catSlug, topicCount: 0, questionCount: 0 });
        }
        const cat = categories.get(catSlug)!;
        cat.topicCount++;
        cat.questionCount += t.questionCount;
      }

      res.json({
        topics,
        categories: Array.from(categories.values()).sort((a, b) => b.questionCount - a.questionCount),
        totalQuestions: questions.length,
        totalTopics: topics.length,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/paramedic/question-topics/:topicSlug", async (req: Request, res: Response) => {
    try {
      const { topicSlug } = req.params;
      const questions = await loadQuestions();

      const topicQuestions = questions.filter(q => slugify(q.topic) === topicSlug);
      if (topicQuestions.length === 0) {
        return res.status(404).json({ error: "Topic not found" });
      }

      const topic = topicQuestions[0].topic;
      const category = topicQuestions[0].category;

      const sampleQuestions = topicQuestions.slice(0, 10).map(q => ({
        id: q.id,
        stem: q.stem,
        options: q.options,
        correctIndex: q.correctIndex,
        rationale: q.rationale,
        difficulty: q.difficulty,
        regionScope: (q as any).regionScope || "BOTH",
      }));

      const relatedTopics = questions
        .filter(q => q.category === category && slugify(q.topic) !== topicSlug)
        .reduce((acc: Map<string, { topicSlug: string; topic: string; questionCount: number }>, q) => {
          const slug = slugify(q.topic);
          if (!acc.has(slug)) {
            acc.set(slug, { topicSlug: slug, topic: q.topic, questionCount: 0 });
          }
          acc.get(slug)!.questionCount++;
          return acc;
        }, new Map());

      res.json({
        topicSlug,
        topic,
        category,
        categorySlug: slugify(category),
        totalQuestions: topicQuestions.length,
        sampleQuestions,
        relatedTopics: Array.from(relatedTopics.values()).slice(0, 8),
        difficulties: Array.from(new Set(topicQuestions.map(q => q.difficulty))).sort(),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
