import type { Express } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";
import { getProdPool } from "./db";

const CAD_USD_RATE = 0.74;
const VALID_CATEGORIES = ["replit", "domain", "software", "ads", "contractor", "ai_generation", "other"];
const VALID_CURRENCIES = ["CAD", "USD"];

function toCAD(amount: number, currency: string): number {
  if (currency === "CAD") return amount;
  if (currency === "USD") return amount / CAD_USD_RATE;
  return amount;
}

function toUSD(cadAmount: number): number {
  return cadAmount * CAD_USD_RATE;
}

function validateExpense(body: any): { valid: boolean; error?: string; data?: any } {
  const { category, vendor, description, amount, currency, date, recurring } = body;
  if (!category || typeof category !== "string") return { valid: false, error: "category is required" };
  if (!VALID_CATEGORIES.includes(category)) return { valid: false, error: `category must be one of: ${VALID_CATEGORIES.join(", ")}` };
  if (!vendor || typeof vendor !== "string" || vendor.trim().length === 0) return { valid: false, error: "vendor is required" };
  const parsedAmount = parseFloat(String(amount));
  if (isNaN(parsedAmount) || parsedAmount < 0) return { valid: false, error: "amount must be a non-negative number" };
  const cur = currency || "CAD";
  if (!VALID_CURRENCIES.includes(cur)) return { valid: false, error: `currency must be one of: ${VALID_CURRENCIES.join(", ")}` };
  if (!date || typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return { valid: false, error: "date must be in YYYY-MM-DD format" };
  return {
    valid: true,
    data: {
      category,
      vendor: vendor.trim(),
      description: description ? String(description).trim() : null,
      amount: parsedAmount,
      currency: cur,
      date,
      recurring: Boolean(recurring),
    },
  };
}

async function ensureTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS business_expenses (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      category TEXT NOT NULL,
      vendor TEXT NOT NULL,
      description TEXT,
      amount DOUBLE PRECISION NOT NULL,
      currency TEXT NOT NULL DEFAULT 'CAD',
      date TEXT NOT NULL,
      recurring BOOLEAN DEFAULT false,
      created_by TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

let tableEnsured = false;
async function ensureTableOnce(): Promise<void> {
  if (tableEnsured) return;
  await ensureTable();
  tableEnsured = true;
}

export function registerBusinessHealthRoutes(app: Express): void {
  app.get("/api/admin/business-health/expenses", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      await ensureTableOnce();
      const result = await pool.query("SELECT * FROM business_expenses ORDER BY date DESC, created_at DESC");
      res.json(result.rows);
    } catch (e: any) {
      console.error("[BusinessHealth] Error listing expenses:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/business-health/expenses", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const validation = validateExpense(req.body);
      if (!validation.valid) return res.status(400).json({ error: validation.error });
      const d = validation.data!;
      await ensureTableOnce();
      const result = await pool.query(
        `INSERT INTO business_expenses (id, category, vendor, description, amount, currency, date, recurring, created_by, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) RETURNING *`,
        [d.category, d.vendor, d.description, d.amount, d.currency, d.date, d.recurring, admin.username || null]
      );
      res.json(result.rows[0]);
    } catch (e: any) {
      console.error("[BusinessHealth] Error creating expense:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/admin/business-health/expenses/:id", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const validation = validateExpense(req.body);
      if (!validation.valid) return res.status(400).json({ error: validation.error });
      const d = validation.data!;
      await ensureTableOnce();
      const result = await pool.query(
        `UPDATE business_expenses SET category=$1, vendor=$2, description=$3, amount=$4, currency=$5, date=$6, recurring=$7, updated_at=NOW()
         WHERE id=$8 RETURNING *`,
        [d.category, d.vendor, d.description, d.amount, d.currency, d.date, d.recurring, req.params.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: "Expense not found" });
      res.json(result.rows[0]);
    } catch (e: any) {
      console.error("[BusinessHealth] Error updating expense:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/admin/business-health/expenses/:id", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      await ensureTableOnce();
      await pool.query("DELETE FROM business_expenses WHERE id = $1", [req.params.id]);
      res.json({ ok: true });
    } catch (e: any) {
      console.error("[BusinessHealth] Error deleting expense:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/business-health/summary", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      await ensureTableOnce();
      const now = new Date();
      const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

      const expenseResult = await pool.query("SELECT * FROM business_expenses ORDER BY date DESC");
      const expenses = expenseResult.rows;

      let totalManualExpenseCAD = 0;
      let expensesThisMonthCAD = 0;
      const categoryTotals: Record<string, number> = {};
      for (const exp of expenses) {
        const cadAmt = toCAD(exp.amount, exp.currency);
        totalManualExpenseCAD += cadAmt;
        if (exp.date >= monthStart) expensesThisMonthCAD += cadAmt;
        const cat = exp.category || "other";
        categoryTotals[cat] = (categoryTotals[cat] || 0) + cadAmt;
      }

      let aiSpendTotalUSD = 0;
      try {
        const aiResult = await pool.query("SELECT COALESCE(SUM(actual_cost), 0) as total FROM ai_jobs");
        aiSpendTotalUSD = parseFloat(aiResult.rows[0]?.total || "0");
      } catch (e: any) {
        console.error("[BusinessHealth] AI spend query error:", e.message);
      }
      const aiSpendCAD = toCAD(aiSpendTotalUSD, "USD");

      let aiSpendThisMonthUSD = 0;
      try {
        const aiMonthResult = await pool.query(
          "SELECT COALESCE(SUM(actual_cost), 0) as total FROM ai_jobs WHERE created_at >= $1",
          [monthStart]
        );
        aiSpendThisMonthUSD = parseFloat(aiMonthResult.rows[0]?.total || "0");
      } catch (e: any) {
        console.error("[BusinessHealth] AI monthly spend query error:", e.message);
      }

      let replitSpendCAD = 0;
      const replitExpenses = expenses.filter((e: any) => e.category === "replit");
      replitSpendCAD = replitExpenses.reduce((sum: number, e: any) => sum + toCAD(e.amount, e.currency), 0);

      let subscriptionRevenue = 0;
      let oneTimeRevenue = 0;
      let revenueThisMonth = 0;
      let totalRevenue = 0;

      try {
        const { getUncachableStripeClient } = await import("./stripeClient");
        const stripe = await getUncachableStripeClient();

        let allCharges: any[] = [];
        let hasMore = true;
        let startingAfter: string | undefined;
        while (hasMore) {
          const params: any = { limit: 100 };
          if (startingAfter) params.starting_after = startingAfter;
          const batch = await stripe.charges.list(params);
          const successful = batch.data.filter((c: any) => c.status === "succeeded");
          allCharges.push(...successful);
          hasMore = batch.has_more;
          if (batch.data.length > 0) startingAfter = batch.data[batch.data.length - 1].id;
          if (allCharges.length >= 1000) break;
        }

        totalRevenue = allCharges.reduce((sum: number, c: any) => sum + (c.amount / 100), 0);
        const monthTimestamp = Math.floor(new Date(monthStart).getTime() / 1000);
        revenueThisMonth = allCharges
          .filter((c: any) => c.created >= monthTimestamp)
          .reduce((sum: number, c: any) => sum + (c.amount / 100), 0);

        for (const charge of allCharges) {
          if (charge.invoice) {
            subscriptionRevenue += charge.amount / 100;
          } else {
            oneTimeRevenue += charge.amount / 100;
          }
        }
      } catch (stripeErr: any) {
        console.error("[BusinessHealth] Stripe error:", stripeErr.message);
      }

      const totalRevenueCAD = toCAD(totalRevenue, "USD");
      const totalInvestedCAD = totalManualExpenseCAD + aiSpendCAD;
      const breakEvenRemainingCAD = Math.max(0, totalInvestedCAD - totalRevenueCAD);
      const grossProfitLossCAD = totalRevenueCAD - totalInvestedCAD;
      const spendThisMonthCAD = expensesThisMonthCAD + toCAD(aiSpendThisMonthUSD, "USD");

      res.json({
        financials: {
          totalInvestedCAD,
          totalInvestedUSD: toUSD(totalInvestedCAD),
          totalRevenueCAD,
          totalRevenueUSD: toUSD(totalRevenueCAD),
          breakEvenRemainingCAD,
          breakEvenRemainingUSD: toUSD(breakEvenRemainingCAD),
          grossProfitLossCAD,
          grossProfitLossUSD: toUSD(grossProfitLossCAD),
          subscriptionRevenueUSD: subscriptionRevenue,
          subscriptionRevenueCAD: toCAD(subscriptionRevenue, "USD"),
          oneTimeRevenueUSD: oneTimeRevenue,
          oneTimeRevenueCAD: toCAD(oneTimeRevenue, "USD"),
          revenueThisMonthUSD: revenueThisMonth,
          revenueThisMonthCAD: toCAD(revenueThisMonth, "USD"),
        },
        spend: {
          replitSpendCAD,
          aiGenerationSpendUSD: aiSpendTotalUSD,
          aiGenerationSpendCAD: aiSpendCAD,
          manualExpensesCAD: totalManualExpenseCAD,
          spendThisMonthCAD,
          categoryTotals,
        },
        cadUsdRate: CAD_USD_RATE,
      });
    } catch (e: any) {
      console.error("[BusinessHealth] Summary error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/business-health/subscribers", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const prodPool = getProdPool();

      const userStats = await prodPool.query(`
        SELECT
          COUNT(*) as total_users,
          COUNT(*) FILTER (WHERE subscription_status = 'active') as active_subscribers,
          COUNT(*) FILTER (WHERE subscription_status = 'canceled' OR subscription_status = 'cancelled') as cancelled_subscribers,
          COUNT(*) FILTER (WHERE tier = 'free' OR tier IS NULL) as free_users,
          COUNT(*) FILTER (WHERE tier IN ('rpn', 'rn', 'np')) as paid_users,
          COUNT(*) FILTER (WHERE tier = 'rpn') as rpn_users,
          COUNT(*) FILTER (WHERE tier = 'rn') as rn_users,
          COUNT(*) FILTER (WHERE tier = 'np') as np_users,
          COUNT(*) FILTER (WHERE tier = 'admin') as admin_users,
          COUNT(*) FILTER (WHERE subscription_status = 'past_due') as past_due_subscribers,
          COUNT(*) FILTER (WHERE subscription_status = 'inactive' OR subscription_status IS NULL) as inactive_users
        FROM users
      `);

      const stats = userStats.rows[0] || {};
      const totalUsers = parseInt(stats.total_users || "0");
      const paidUsers = parseInt(stats.paid_users || "0");
      const freeUsers = parseInt(stats.free_users || "0");
      const conversionRate = totalUsers > 0 ? ((paidUsers / totalUsers) * 100).toFixed(1) : "0.0";

      let purchaseStats: any = { totalPurchases: 0, totalSales: 0, byProduct: [], byTier: [] };
      try {
        const purchaseResult = await prodPool.query(`
          SELECT
            COUNT(*) as total_purchases,
            COALESCE(SUM(dp.price), 0) as total_sales_cents
          FROM product_purchases pp
          LEFT JOIN digital_products dp ON pp.product_id = dp.id
        `);
        purchaseStats.totalPurchases = parseInt(purchaseResult.rows[0]?.total_purchases || "0");
        purchaseStats.totalSales = parseInt(purchaseResult.rows[0]?.total_sales_cents || "0") / 100;

        const byProductResult = await prodPool.query(`
          SELECT dp.title, dp.tier_target, COUNT(pp.id) as purchase_count, COALESCE(SUM(dp.price), 0) as revenue_cents
          FROM product_purchases pp
          LEFT JOIN digital_products dp ON pp.product_id = dp.id
          GROUP BY dp.title, dp.tier_target
          ORDER BY purchase_count DESC
        `);
        purchaseStats.byProduct = byProductResult.rows.map((r: any) => ({
          title: r.title || "Unknown",
          tierTarget: r.tier_target || "all",
          purchaseCount: parseInt(r.purchase_count || "0"),
          revenue: parseInt(r.revenue_cents || "0") / 100,
        }));

        const byTierResult = await prodPool.query(`
          SELECT dp.tier_target, COUNT(pp.id) as purchase_count, COALESCE(SUM(dp.price), 0) as revenue_cents
          FROM product_purchases pp
          LEFT JOIN digital_products dp ON pp.product_id = dp.id
          GROUP BY dp.tier_target
          ORDER BY purchase_count DESC
        `);
        purchaseStats.byTier = byTierResult.rows.map((r: any) => ({
          tier: r.tier_target || "all",
          purchaseCount: parseInt(r.purchase_count || "0"),
          revenue: parseInt(r.revenue_cents || "0") / 100,
        }));
      } catch (e: any) {
        console.error("[BusinessHealth] Purchase metrics error:", e.message);
      }

      let salesByDateRange: any[] = [];
      try {
        const salesResult = await prodPool.query(`
          SELECT
            TO_CHAR(pp.purchase_date, 'YYYY-MM') as month,
            COUNT(*) as purchase_count,
            COALESCE(SUM(dp.price), 0) as revenue_cents
          FROM product_purchases pp
          LEFT JOIN digital_products dp ON pp.product_id = dp.id
          GROUP BY TO_CHAR(pp.purchase_date, 'YYYY-MM')
          ORDER BY month DESC
          LIMIT 12
        `);
        salesByDateRange = salesResult.rows.map((r: any) => ({
          month: r.month,
          purchaseCount: parseInt(r.purchase_count || "0"),
          revenue: parseInt(r.revenue_cents || "0") / 100,
        }));
      } catch (e: any) {
        console.error("[BusinessHealth] Sales by date error:", e.message);
      }

      res.json({
        subscribers: {
          totalUsers,
          activeSubscribers: parseInt(stats.active_subscribers || "0"),
          cancelledSubscribers: parseInt(stats.cancelled_subscribers || "0"),
          pastDueSubscribers: parseInt(stats.past_due_subscribers || "0"),
          inactiveUsers: parseInt(stats.inactive_users || "0"),
          freeUsers,
          paidUsers,
          conversionRate,
          byTier: {
            rpn: parseInt(stats.rpn_users || "0"),
            rn: parseInt(stats.rn_users || "0"),
            np: parseInt(stats.np_users || "0"),
            admin: parseInt(stats.admin_users || "0"),
          },
        },
        purchases: purchaseStats,
        salesByDateRange,
      });
    } catch (e: any) {
      console.error("[BusinessHealth] Subscribers error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });
}
