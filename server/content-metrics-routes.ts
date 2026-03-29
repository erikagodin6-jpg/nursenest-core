import type { Express } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";

export function registerContentMetricsRoutes(app: Express) {
  app.get("/api/admin/content-metrics", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const safeQuery = async (query: string, fallback: any = { rows: [] }) => {
        try { return await pool.query(query); } catch (e: any) {
          console.warn("[ContentMetrics] Query failed:", e.message);
          return fallback;
        }
      };

      const [questionsByTier, flashcardStats, generationJobs, financeEntries, subscriberStats] = await Promise.all([
        safeQuery(`
          SELECT tier, COUNT(*) as count
          FROM exam_questions
          WHERE status = 'published'
          GROUP BY tier
          ORDER BY tier
        `),
        safeQuery(`
          SELECT
            COUNT(*) FILTER (WHERE status = 'published') as published,
            COUNT(*) FILTER (WHERE status IN ('draft', 'needs_review')) as pending_review,
            0 as total_decks
          FROM flashcard_bank
        `),
        safeQuery(`
          SELECT id, run_date, content_type, tier, target_count, generated_count, mode, status, created_at
          FROM generation_jobs
          WHERE status IN ('queued', 'running', 'partial')
          ORDER BY created_at DESC
          LIMIT 50
        `),
        safeQuery(`
          SELECT id, category, label, amount, currency, notes, created_at, updated_at
          FROM admin_finance
          ORDER BY created_at DESC
        `),
        safeQuery(`
          SELECT
            COUNT(*) FILTER (WHERE subscription_status = 'active') as active_subscribers,
            COUNT(*) as total_users
          FROM users
          WHERE tier != 'admin'
        `),
      ]);

      let deckCount = 0;
      try {
        const deckResult = await pool.query(`SELECT COUNT(*) as count FROM flashcard_decks`);
        deckCount = Number(deckResult.rows[0]?.count || 0);
      } catch {}

      let totalPurchases = 0;
      let totalRevenue = 0;
      try {
        const purchaseResult = await pool.query(`
          SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total
          FROM study_pack_purchases
        `);
        totalPurchases = Number(purchaseResult.rows[0]?.count || 0);
        totalRevenue = Number(purchaseResult.rows[0]?.total || 0);
      } catch {}

      const tierCounts = questionsByTier.rows.map((r: any) => ({
        tier: r.tier,
        count: Number(r.count),
      }));

      const totalPublished = tierCounts.reduce((sum: number, t: any) => sum + t.count, 0);

      const fc = flashcardStats.rows[0] || {};
      const flashcards = {
        published: Number(fc.published || 0),
        pendingReview: Number(fc.pending_review || 0),
        totalDecks: deckCount,
      };

      const activeJobs = generationJobs.rows.map((j: any) => ({
        id: j.id,
        runDate: j.run_date,
        contentType: j.content_type,
        tier: j.tier,
        targetCount: Number(j.target_count),
        generatedCount: Number(j.generated_count),
        mode: j.mode,
        status: j.status,
      }));

      const inProgressCount = activeJobs.reduce(
        (sum: number, j: any) => sum + Math.max(0, j.targetCount - j.generatedCount),
        0
      );

      const sub = subscriberStats.rows[0] || {};
      const finance = financeEntries.rows.map((f: any) => ({
        id: f.id,
        category: f.category,
        label: f.label,
        amount: Number(f.amount),
        currency: f.currency,
        notes: f.notes,
        createdAt: f.created_at,
        updatedAt: f.updated_at,
      }));

      const totalCosts = finance.reduce((sum: number, f: any) => sum + f.amount, 0);

      res.json({
        questionsByTier: tierCounts,
        totalPublished,
        flashcards,
        activeJobs,
        projected: {
          currentTotal: totalPublished,
          inProgress: inProgressCount,
          projectedTotal: totalPublished + inProgressCount,
        },
        financial: {
          totalSubscribers: Number(sub.active_subscribers || 0),
          totalUsers: Number(sub.total_users || 0),
          totalPurchases,
          totalRevenue,
          totalCosts,
          netProfitLoss: totalRevenue - totalCosts,
          breakEvenPoint: totalCosts > 0 && totalRevenue > 0
            ? Math.ceil(totalCosts / (totalRevenue / Math.max(totalPurchases, 1)))
            : null,
          costEntries: finance,
        },
      });
    } catch (e: any) {
      console.error("[ContentMetrics] Error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  function validateFinanceInput(body: any, requireAll: boolean) {
    const { category, label, amount, currency, notes } = body;
    if (requireAll && (!category || !label || amount == null)) {
      return { error: "category, label, and amount are required" };
    }
    if (category != null && (typeof category !== "string" || category.length === 0 || category.length > 100)) {
      return { error: "category must be a non-empty string (max 100 chars)" };
    }
    if (label != null && (typeof label !== "string" || label.length === 0 || label.length > 200)) {
      return { error: "label must be a non-empty string (max 200 chars)" };
    }
    if (amount != null) {
      const num = Number(amount);
      if (!Number.isFinite(num) || num < 0 || num > 1_000_000_000) {
        return { error: "amount must be a finite non-negative number" };
      }
    }
    if (currency != null && (typeof currency !== "string" || !/^[A-Z]{3}$/.test(currency))) {
      return { error: "currency must be a 3-letter uppercase code (e.g. USD)" };
    }
    if (notes != null && typeof notes !== "string") {
      return { error: "notes must be a string" };
    }
    return null;
  }

  app.post("/api/admin/finance", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const validationError = validateFinanceInput(req.body, true);
      if (validationError) return res.status(400).json(validationError);

      const { category, label, amount, currency, notes } = req.body;
      const result = await pool.query(
        `INSERT INTO admin_finance (id, category, label, amount, currency, notes, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW())
         RETURNING *`,
        [category, label, Number(amount), currency || "USD", notes || null]
      );
      res.json(result.rows[0]);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/admin/finance/:id", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const validationError = validateFinanceInput(req.body, false);
      if (validationError) return res.status(400).json(validationError);

      const { category, label, amount, currency, notes } = req.body;
      const result = await pool.query(
        `UPDATE admin_finance SET category = COALESCE($1, category), label = COALESCE($2, label),
         amount = COALESCE($3, amount), currency = COALESCE($4, currency), notes = COALESCE($5, notes), updated_at = NOW()
         WHERE id = $6 RETURNING *`,
        [category, label, amount != null ? Number(amount) : null, currency, notes !== undefined ? notes : null, req.params.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
      res.json(result.rows[0]);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/admin/finance/:id", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const result = await pool.query(`DELETE FROM admin_finance WHERE id = $1 RETURNING id`, [req.params.id]);
      if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
