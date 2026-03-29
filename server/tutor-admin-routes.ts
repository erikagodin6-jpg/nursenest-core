import type { Express } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";

async function ensureTutorTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tutor_admin_config (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      system_prompt TEXT NOT NULL DEFAULT 'You are a helpful AI tutoring assistant for healthcare students. Provide clear, accurate explanations. Never provide direct answers to exam questions — guide students to understand the concepts.',
      blocked_topics JSONB DEFAULT '["explicit_content","violence","political_opinions","medical_diagnosis","prescription_advice"]'::jsonb,
      daily_free_limit INTEGER DEFAULT 10,
      updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tutor_conversations (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR NOT NULL,
      username TEXT,
      user_tier TEXT DEFAULT 'free',
      topic TEXT,
      explanation_type TEXT,
      messages JSONB DEFAULT '[]'::jsonb,
      flagged BOOLEAN DEFAULT FALSE,
      flag_reason TEXT,
      admin_reviewed BOOLEAN DEFAULT FALSE,
      admin_notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    )
  `);

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_tutor_conv_flagged ON tutor_conversations(flagged)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_tutor_conv_created ON tutor_conversations(created_at DESC)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_tutor_conv_topic ON tutor_conversations(topic)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_tutor_conv_tier ON tutor_conversations(user_tier)`);

  const configCount = await pool.query(`SELECT COUNT(*) as cnt FROM tutor_admin_config`);
  if (parseInt(configCount.rows[0].cnt) === 0) {
    await pool.query(`INSERT INTO tutor_admin_config (id) VALUES ('tutor-config-singleton')`);
  }
}

export function registerTutorAdminRoutes(app: Express) {
  let tablesReady = false;

  async function ensureReady() {
    if (!tablesReady) {
      await ensureTutorTables();
      tablesReady = true;
    }
  }

  app.get("/api/admin/tutor/config", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      await ensureReady();
      const result = await pool.query(`SELECT * FROM tutor_admin_config ORDER BY updated_at DESC LIMIT 1`);
      if (result.rows.length === 0) {
        return res.json({ systemPrompt: "", blockedTopics: [], dailyFreeLimit: 10 });
      }
      const row = result.rows[0];
      res.json({
        systemPrompt: row.system_prompt,
        blockedTopics: row.blocked_topics || [],
        dailyFreeLimit: row.daily_free_limit,
      });
    } catch (err: any) {
      console.error("Tutor config fetch error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/tutor/config", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      await ensureReady();
      const { systemPrompt, blockedTopics, dailyFreeLimit } = req.body;

      if (dailyFreeLimit != null && (typeof dailyFreeLimit !== "number" || dailyFreeLimit < 1 || dailyFreeLimit > 1000)) {
        return res.status(400).json({ error: "dailyFreeLimit must be a number between 1 and 1000" });
      }
      if (blockedTopics != null && !Array.isArray(blockedTopics)) {
        return res.status(400).json({ error: "blockedTopics must be an array of strings" });
      }
      if (systemPrompt != null && typeof systemPrompt !== "string") {
        return res.status(400).json({ error: "systemPrompt must be a string" });
      }

      const configRow = await pool.query(`SELECT id FROM tutor_admin_config ORDER BY updated_at DESC LIMIT 1`);
      const configId = configRow.rows[0]?.id;
      if (!configId) {
        return res.status(404).json({ error: "Config not found" });
      }

      await pool.query(
        `UPDATE tutor_admin_config SET
          system_prompt = COALESCE($1, system_prompt),
          blocked_topics = COALESCE($2, blocked_topics),
          daily_free_limit = COALESCE($3, daily_free_limit),
          updated_at = NOW()
         WHERE id = $4`,
        [
          systemPrompt || null,
          blockedTopics ? JSON.stringify(blockedTopics) : null,
          dailyFreeLimit != null ? dailyFreeLimit : null,
          configId,
        ]
      );
      res.json({ success: true });
    } catch (err: any) {
      console.error("Tutor config update error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/tutor/analytics", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      await ensureReady();
      const rawDays = Number(req.query.days || 30);
      const days = Number.isFinite(rawDays) ? Math.max(1, Math.min(365, Math.floor(rawDays))) : 30;

      const [
        totalQuestions,
        dailyQuestions,
        weeklyQuestions,
        monthlyQuestions,
        topTopics,
        explanationTypes,
        tierUsage,
        flaggedCount,
        recentTrend,
      ] = await Promise.all([
        pool.query(`SELECT COUNT(*)::int as total FROM tutor_conversations WHERE created_at > NOW() - INTERVAL '${days} days'`),
        pool.query(`SELECT COUNT(*)::int as total FROM tutor_conversations WHERE created_at > NOW() - INTERVAL '1 day'`),
        pool.query(`SELECT COUNT(*)::int as total FROM tutor_conversations WHERE created_at > NOW() - INTERVAL '7 days'`),
        pool.query(`SELECT COUNT(*)::int as total FROM tutor_conversations WHERE created_at > NOW() - INTERVAL '30 days'`),
        pool.query(`
          SELECT topic, COUNT(*)::int as count
          FROM tutor_conversations
          WHERE created_at > NOW() - INTERVAL '${days} days' AND topic IS NOT NULL
          GROUP BY topic ORDER BY count DESC LIMIT 20
        `),
        pool.query(`
          SELECT explanation_type, COUNT(*)::int as count
          FROM tutor_conversations
          WHERE created_at > NOW() - INTERVAL '${days} days' AND explanation_type IS NOT NULL
          GROUP BY explanation_type ORDER BY count DESC LIMIT 10
        `),
        pool.query(`
          SELECT user_tier, COUNT(*)::int as count
          FROM tutor_conversations
          WHERE created_at > NOW() - INTERVAL '${days} days'
          GROUP BY user_tier ORDER BY count DESC
        `),
        pool.query(`SELECT COUNT(*)::int as total FROM tutor_conversations WHERE flagged = true AND admin_reviewed = false`),
        pool.query(`
          SELECT DATE(created_at) as day, COUNT(*)::int as count
          FROM tutor_conversations
          WHERE created_at > NOW() - INTERVAL '${days} days'
          GROUP BY DATE(created_at) ORDER BY day DESC LIMIT 60
        `),
      ]);

      res.json({
        period: { days },
        totalQuestions: totalQuestions.rows[0]?.total || 0,
        dailyQuestions: dailyQuestions.rows[0]?.total || 0,
        weeklyQuestions: weeklyQuestions.rows[0]?.total || 0,
        monthlyQuestions: monthlyQuestions.rows[0]?.total || 0,
        topTopics: topTopics.rows,
        explanationTypes: explanationTypes.rows,
        tierUsage: tierUsage.rows,
        pendingReviews: flaggedCount.rows[0]?.total || 0,
        dailyTrend: recentTrend.rows,
      });
    } catch (err: any) {
      console.error("Tutor analytics error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/tutor/conversations", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      await ensureReady();
      const filter = req.query.filter || "all";
      const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
      const offset = Math.max(0, Number(req.query.offset) || 0);

      let whereClause = "";
      if (filter === "flagged") {
        whereClause = "WHERE flagged = true";
      } else if (filter === "unreviewed") {
        whereClause = "WHERE flagged = true AND admin_reviewed = false";
      }

      const result = await pool.query(
        `SELECT id, user_id, username, user_tier, topic, explanation_type, messages,
                flagged, flag_reason, admin_reviewed, admin_notes, created_at, updated_at,
                COUNT(*) OVER()::int AS _total
         FROM tutor_conversations ${whereClause}
         ORDER BY created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      const total = result.rows[0]?._total ?? 0;

      res.json({
        conversations: result.rows.map((r: any) => ({
          id: r.id,
          userId: r.user_id,
          username: r.username,
          userTier: r.user_tier,
          topic: r.topic,
          explanationType: r.explanation_type,
          messages: r.messages || [],
          flagged: r.flagged,
          flagReason: r.flag_reason,
          adminReviewed: r.admin_reviewed,
          adminNotes: r.admin_notes,
          createdAt: r.created_at,
          updatedAt: r.updated_at,
        })),
        total,
      });
    } catch (err: any) {
      console.error("Tutor conversations error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/tutor/conversations/:id/flag", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      await ensureReady();
      const { id } = req.params;
      const { flagged, flagReason, adminNotes, markReviewed } = req.body;

      if (adminNotes != null && typeof adminNotes !== "string") {
        return res.status(400).json({ error: "adminNotes must be a string" });
      }
      if (flagReason != null && typeof flagReason !== "string") {
        return res.status(400).json({ error: "flagReason must be a string" });
      }

      await pool.query(
        `UPDATE tutor_conversations SET
          flagged = COALESCE($1, flagged),
          flag_reason = COALESCE($2, flag_reason),
          admin_notes = COALESCE($3, admin_notes),
          admin_reviewed = COALESCE($4, admin_reviewed),
          updated_at = NOW()
         WHERE id = $5`,
        [
          flagged ?? null,
          flagReason || null,
          adminNotes || null,
          markReviewed === true ? true : null,
          id,
        ]
      );

      res.json({ success: true });
    } catch (err: any) {
      console.error("Tutor flag error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/tutor/roadmap", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    res.json({ roadmap: TUTOR_ROADMAP });
  });
}

export const TUTOR_ROADMAP = [
  {
    rank: 1,
    title: "Competitive Study Leaderboards",
    description: "Gamified leaderboard system where students compete on accuracy, streaks, and study time across topics.",
    engagementImpact: 9,
    conversionPotential: 7,
    learningEffectiveness: 6,
    status: "planned" as const,
  },
  {
    rank: 2,
    title: "Group Study Rooms",
    description: "Virtual collaborative study spaces where students can quiz each other, share notes, and discuss topics in real time.",
    engagementImpact: 8,
    conversionPotential: 8,
    learningEffectiveness: 8,
    status: "planned" as const,
  },
  {
    rank: 3,
    title: "Daily Study Streaks",
    description: "Streak-based motivation system with daily study goals, badges, and rewards for consistency.",
    engagementImpact: 9,
    conversionPotential: 6,
    learningEffectiveness: 7,
    status: "planned" as const,
  },
  {
    rank: 4,
    title: "Exam Countdown Tracker",
    description: "Personalized countdown to exam day with adaptive study plan adjustments and readiness assessments.",
    engagementImpact: 7,
    conversionPotential: 8,
    learningEffectiveness: 9,
    status: "planned" as const,
  },
];
