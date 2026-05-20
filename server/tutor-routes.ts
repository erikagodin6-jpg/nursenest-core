import type { Express, Request, Response } from "express";
import { resolveAuthUser } from "./admin-auth";
import { getOpenAIClient, isOpenAIConfigured } from "./openai-client";
import { pool, storage } from "./storage";
import { routeParamString } from "./route-params";

const FREE_TIER_DAILY_LIMIT = 5;
const TUTOR_FEATURE_KEY = "ai_tutor";

const getToday = () => new Date().toISOString().split("T")[0];

/* =========================
   PROMPT BUILDERS
========================= */

const buildSystemPrompt = (contextType: string, contextData: any, language: string) => {
  const base = `
You are an AI Tutor for NurseNest.

STRICT RULES:
- You are for exam prep only
- Never give real clinical advice
- Always frame answers as "for exam purposes"
- No real-world treatment guidance

Your job:
- Explain concepts clearly
- Walk through questions step-by-step
- Give rationales
- Provide test-taking strategies
`;

  let context = "";

  if (contextType === "practice_question") {
    context = `
Question: ${contextData?.question || ""}
Options:
${(contextData?.options || [])
  .map((o: string, i: number) => `${String.fromCharCode(65 + i)}. ${o}`)
  .join("\n")}
`;
  }

  if (contextType === "flashcard") {
    context = `
Flashcard:
${contextData?.question || ""}
Answer: ${contextData?.answer || ""}
`;
  }

  const lang =
    language === "fr"
      ? "Respond in French."
      : language === "es"
      ? "Respond in Spanish."
      : "";

  return base + context + "\n" + lang;
};

/* =========================
   ROUTES
========================= */

export function registerTutorRoutes(app: Express): void {
  /* CREATE CONVERSATION */
  app.post("/api/tutor/conversations", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });

      const { contextType, contextId, language, title } = req.body;

      const result = await pool.query(
        `INSERT INTO tutor_conversations (user_id, context_type, context_id, language, title)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          user.id,
          contextType || "general",
          contextId || null,
          language || "en",
          title || "AI Tutor",
        ]
      );

      res.json(result.rows[0]);
    } catch (err) {
      console.error("Create conversation error:", err);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });

  /* GET MESSAGES */
  app.get("/api/tutor/conversations/:id/messages", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });

      const id = Number(routeParamString(req.params.id));
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "Invalid conversation id" });
      }

      const conv = await pool.query(
        "SELECT id FROM tutor_conversations WHERE id=$1 AND user_id=$2",
        [id, user.id]
      );

      if (!conv.rows.length) {
        return res.status(404).json({ error: "Not found" });
      }

      const messages = await pool.query(
        "SELECT role, content FROM tutor_messages WHERE conversation_id=$1 ORDER BY created_at ASC LIMIT 50",
        [id]
      );

      res.json(messages.rows);
    } catch (err) {
      console.error("Fetch messages error:", err);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  /* USAGE */
  app.get("/api/tutor/usage", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });

      const isPremium = user.tier !== "free";
      const usage = await storage.getFeatureUsage(
        user.id,
        TUTOR_FEATURE_KEY,
        getToday()
      );

      const used = usage?.count || 0;

      res.json({
        usedToday: used,
        remaining: isPremium ? null : Math.max(0, FREE_TIER_DAILY_LIMIT - used),
        isPremium,
      });
    } catch (err) {
      console.error("Usage error:", err);
      res.status(500).json({ error: "Failed to fetch usage" });
    }
  });

  /* SEND MESSAGE */
  app.post("/api/tutor/conversations/:id/messages", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });

      const isPremium = user.tier !== "free";
      const today = getToday();

      /* RATE LIMIT */
      if (!isPremium) {
        const result = await pool.query(
          `INSERT INTO feature_usage (user_id, feature, usage_date, count)
           VALUES ($1,$2,$3,1)
           ON CONFLICT (user_id, feature, usage_date)
           DO UPDATE SET count = feature_usage.count + 1
           RETURNING count`,
          [user.id, TUTOR_FEATURE_KEY, today]
        );

        const count = result.rows[0].count;

        if (count > FREE_TIER_DAILY_LIMIT) {
          return res.status(429).json({ error: "Limit reached" });
        }
      }

      const id = Number(routeParamString(req.params.id));
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "Invalid conversation id" });
      }

      const { content, contextType, contextData, language } = req.body;

      if (!content?.trim()) {
        return res.status(400).json({ error: "Content required" });
      }

      if (!isOpenAIConfigured()) {
        return res.status(503).json({
          error: "AI tutor is not configured (missing OpenAI API key).",
        });
      }

      /* SAVE USER MESSAGE */
      await pool.query(
        "INSERT INTO tutor_messages (conversation_id, role, content) VALUES ($1,$2,$3)",
        [id, "user", content.trim()]
      );

      /* LOAD HISTORY (LIMITED FOR MEMORY SAFETY) */
      const history = await pool.query(
        "SELECT role, content FROM tutor_messages WHERE conversation_id=$1 ORDER BY created_at DESC LIMIT 10",
        [id]
      );

      const messages = [
        {
          role: "system",
          content: buildSystemPrompt(contextType, contextData, language),
        },
        ...history.rows.reverse(),
      ];

      /* STREAM RESPONSE */
      res.setHeader("Content-Type", "text/event-stream");

      const openai = getOpenAIClient();
      const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        stream: true,
        temperature: 0.6,
      });

      let full = "";

      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content;
        if (!text) continue;

        full += text;
        res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
      }

      /* SAVE AI RESPONSE */
      await pool.query(
        "INSERT INTO tutor_messages (conversation_id, role, content) VALUES ($1,$2,$3)",
        [id, "assistant", full]
      );

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (err) {
      console.error("Tutor error:", err);
      if (res.headersSent) {
        try {
          res.end();
        } catch {
          /* ignore */
        }
        return;
      }
      res.status(500).json({ error: "Failed to process request" });
    }
  });
}