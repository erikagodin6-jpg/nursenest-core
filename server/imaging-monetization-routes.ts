import type { Express } from "express";
import { pool } from "./storage";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";
import { resolveAuthUser, requireAdmin } from "./admin-auth";

function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (obj === null || typeof obj !== "object") return obj;
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = snakeToCamel(value);
  }
  return result;
}

export function registerImagingMonetizationRoutes(app: Express) {

  app.get("/api/imaging/products", async (req, res) => {
    try {
      const country = (req.query.country as string) || null;
      let query = `SELECT * FROM imaging_products WHERE is_active = true`;
      const params: any[] = [];
      if (country) {
        query += ` AND (country = $1 OR country IS NULL)`;
        params.push(country.toLowerCase());
      }
      query += ` ORDER BY sort_order ASC, created_at ASC`;
      const result = await pool.query(query, params);
      res.json(result.rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/imaging/products/:slug", async (req, res) => {
    try {
      const result = await pool.query(`SELECT * FROM imaging_products WHERE slug = $1`, [req.params.slug]);
      if (result.rows.length === 0) return res.status(404).json({ error: "Product not found" });
      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/imaging/products", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { title, slug, productType, description, features, priceCAD, priceUSD, compareAtPriceCAD, compareAtPriceUSD, billingInterval, contentScope, questionCount, flashcardCount, examCount, country, popular, sortOrder } = req.body;
      const result = await pool.query(
        `INSERT INTO imaging_products (id, title, slug, product_type, description, features, price_cad, price_usd, compare_at_price_cad, compare_at_price_usd, billing_interval, content_scope, question_count, flashcard_count, exam_count, country, popular, sort_order, is_active, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, true, NOW(), NOW()) RETURNING *`,
        [title, slug, productType, description || null, features || [], priceCAD, priceUSD, compareAtPriceCAD || null, compareAtPriceUSD || null, billingInterval || null, JSON.stringify(contentScope || {}), questionCount || 0, flashcardCount || 0, examCount || 0, country || null, popular || false, sortOrder || 0]
      );
      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/admin/imaging/products/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { title, slug, productType, description, features, priceCAD, priceUSD, compareAtPriceCAD, compareAtPriceUSD, billingInterval, contentScope, questionCount, flashcardCount, examCount, country, popular, sortOrder, isActive } = req.body;
      const result = await pool.query(
        `UPDATE imaging_products SET title=$1, slug=$2, product_type=$3, description=$4, features=$5, price_cad=$6, price_usd=$7, compare_at_price_cad=$8, compare_at_price_usd=$9, billing_interval=$10, content_scope=$11, question_count=$12, flashcard_count=$13, exam_count=$14, country=$15, popular=$16, sort_order=$17, is_active=$18, updated_at=NOW() WHERE id=$19 RETURNING *`,
        [title, slug, productType, description || null, features || [], priceCAD, priceUSD, compareAtPriceCAD || null, compareAtPriceUSD || null, billingInterval || null, JSON.stringify(contentScope || {}), questionCount || 0, flashcardCount || 0, examCount || 0, country || null, popular || false, sortOrder || 0, isActive !== false, req.params.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: "Product not found" });
      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/admin/imaging/products/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      await pool.query(`DELETE FROM imaging_products WHERE id = $1`, [req.params.id]);
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/imaging/entitlements", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.json({ entitlements: [], hasFullAccess: false });
      const result = await pool.query(
        `SELECT e.*, p.title as product_title, p.product_type, p.content_scope
         FROM imaging_entitlements e
         LEFT JOIN imaging_products p ON e.product_id = p.id
         WHERE e.user_id = $1 AND e.status = 'active'
         AND (e.expires_at IS NULL OR e.expires_at > NOW())`,
        [user.id]
      );
      const entitlements = result.rows.map(snakeToCamel);
      const hasFullAccess = entitlements.some((e: any) => e.entitlementType === "full_access");
      res.json({ entitlements, hasFullAccess });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/imaging/preview-config", async (_req, res) => {
    try {
      const result = await pool.query(`SELECT * FROM imaging_preview_config`);
      const configs: Record<string, any> = {};
      for (const row of result.rows) {
        configs[row.content_type] = {
          freeLimit: row.free_limit,
          previewMessage: row.preview_message,
        };
      }
      if (!configs.questions) configs.questions = { freeLimit: 5, previewMessage: "Unlock all practice questions with a premium plan" };
      if (!configs.flashcards) configs.flashcards = { freeLimit: 10, previewMessage: "Access the full flashcard deck with a premium plan" };
      if (!configs.exams) configs.exams = { freeLimit: 1, previewMessage: "Take unlimited practice exams with a premium plan" };
      if (!configs.positioning) configs.positioning = { freeLimit: 5, previewMessage: "Access all positioning guides with a premium plan" };
      if (!configs.physics) configs.physics = { freeLimit: 3, previewMessage: "Unlock all physics topics with a premium plan" };
      res.json(configs);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/admin/imaging/preview-config", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { contentType, freeLimit, previewMessage } = req.body;
      await pool.query(
        `INSERT INTO imaging_preview_config (id, content_type, free_limit, preview_message, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, NOW())
         ON CONFLICT (content_type) DO UPDATE SET free_limit = $2, preview_message = $3, updated_at = NOW()`,
        [contentType, freeLimit, previewMessage || null]
      );
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/imaging/checkout", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Login required" });
      const { productId, currency } = req.body;
      const curr = (currency || "USD").toUpperCase();

      const productResult = await pool.query(`SELECT * FROM imaging_products WHERE id = $1 AND is_active = true`, [productId]);
      if (productResult.rows.length === 0) return res.status(404).json({ error: "Product not found" });
      const product = productResult.rows[0];

      const stripe = await getUncachableStripeClient();
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email || undefined,
          metadata: { userId: user.id, username: user.username },
        });
        customerId = customer.id;
        await pool.query(`UPDATE users SET stripe_customer_id = $1 WHERE id = $2`, [customerId, user.id]);
      }

      const amount = curr === "CAD" ? product.price_cad : product.price_usd;
      const isSubscription = product.billing_interval && product.billing_interval !== "one_time";
      const baseUrl = `${req.protocol}://${req.get("host")}`;

      if (isSubscription) {
        const priceId = curr === "CAD" ? product.stripe_price_id_cad : product.stripe_price_id_usd;
        if (!priceId) {
          return res.status(400).json({ error: "Stripe price not configured for this product" });
        }
        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          payment_method_types: ["card"],
          line_items: [{ price: priceId, quantity: 1 }],
          mode: "subscription",
          success_url: `${baseUrl}/medical-imaging/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${baseUrl}/medical-imaging/store`,
          metadata: { userId: user.id, productId: product.id, productType: product.product_type },
        });
        return res.json({ url: session.url, sessionId: session.id });
      }

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: curr.toLowerCase(),
            product_data: {
              name: product.title,
              description: product.description || `Medical Imaging Study Pack`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        }],
        mode: "payment",
        success_url: `${baseUrl}/medical-imaging/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/medical-imaging/store`,
        metadata: { userId: user.id, productId: product.id, productType: product.product_type },
      });
      res.json({ url: session.url, sessionId: session.id });
    } catch (e: any) {
      console.error("Imaging checkout error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/imaging/verify-purchase", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Login required" });
      const { sessionId } = req.body;
      if (!sessionId) return res.status(400).json({ error: "Session ID required" });

      const stripe = await getUncachableStripeClient();
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status !== "paid") {
        return res.status(400).json({ error: "Payment not completed" });
      }

      if (session.metadata?.userId && session.metadata.userId !== user.id) {
        return res.status(403).json({ error: "Session does not belong to this user" });
      }

      const productId = session.metadata?.productId;
      if (!productId) return res.status(400).json({ error: "Product metadata missing" });

      const existingPurchase = await pool.query(
        `SELECT id FROM imaging_purchases WHERE stripe_session_id = $1`,
        [sessionId]
      );
      if (existingPurchase.rows.length > 0) {
        return res.json({ ok: true, alreadyProcessed: true });
      }

      await pool.query(
        `INSERT INTO imaging_purchases (id, user_id, product_id, stripe_session_id, stripe_payment_intent_id, amount, currency, status, purchased_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'completed', NOW())`,
        [user.id, productId, sessionId, session.payment_intent as string || null, session.amount_total || 0, (session.currency || "usd").toUpperCase()]
      );

      const product = await pool.query(`SELECT * FROM imaging_products WHERE id = $1`, [productId]);
      const entitlementType = product.rows[0]?.product_type === "subscription" ? "full_access" : "study_pack";

      await pool.query(
        `INSERT INTO imaging_entitlements (id, user_id, product_id, entitlement_type, scope, status, expires_at, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, 'active', $5, NOW())`,
        [
          user.id,
          productId,
          entitlementType,
          JSON.stringify(product.rows[0]?.content_scope || {}),
          product.rows[0]?.billing_interval === "monthly" ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) :
          product.rows[0]?.billing_interval === "yearly" ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : null,
        ]
      );

      res.json({ ok: true });
    } catch (e: any) {
      console.error("Imaging verify purchase error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/imaging/purchases", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Login required" });
      const result = await pool.query(
        `SELECT p.*, pr.title as product_title, pr.product_type, pr.description as product_description
         FROM imaging_purchases p
         LEFT JOIN imaging_products pr ON p.product_id = pr.id
         WHERE p.user_id = $1
         ORDER BY p.purchased_at DESC`,
        [user.id]
      );
      res.json(result.rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/imaging/usage/:contentType", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      const contentType = req.params.contentType;
      const today = new Date().toISOString().split("T")[0];

      if (!user) {
        const configResult = await pool.query(`SELECT free_limit FROM imaging_preview_config WHERE content_type = $1`, [contentType]);
        const freeLimit = configResult.rows[0]?.free_limit || 5;
        return res.json({ used: 0, limit: freeLimit, remaining: freeLimit, hasAccess: false });
      }

      const entResult = await pool.query(
        `SELECT * FROM imaging_entitlements WHERE user_id = $1 AND status = 'active' AND (expires_at IS NULL OR expires_at > NOW())`,
        [user.id]
      );
      if (entResult.rows.length > 0) {
        const hasFullAccess = entResult.rows.some((e: any) => e.entitlement_type === "full_access");
        if (hasFullAccess) return res.json({ used: 0, limit: -1, remaining: -1, hasAccess: true });

        const hasContentAccess = entResult.rows.some((e: any) => {
          const scope = e.scope || {};
          return scope.contentTypes?.includes(contentType);
        });
        if (hasContentAccess) return res.json({ used: 0, limit: -1, remaining: -1, hasAccess: true });
      }

      const usageResult = await pool.query(
        `SELECT count FROM feature_usage WHERE user_id = $1 AND feature = $2 AND usage_date = $3`,
        [user.id, `imaging_${contentType}`, today]
      );
      const used = usageResult.rows[0]?.count || 0;

      const configResult = await pool.query(`SELECT free_limit FROM imaging_preview_config WHERE content_type = $1`, [contentType]);
      const freeLimit = configResult.rows[0]?.free_limit || 5;

      res.json({ used, limit: freeLimit, remaining: Math.max(0, freeLimit - used), hasAccess: false });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/imaging/usage/:contentType/increment", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.json({ ok: true });
      const contentType = req.params.contentType;
      const today = new Date().toISOString().split("T")[0];
      const feature = `imaging_${contentType}`;

      const existing = await pool.query(
        `SELECT id FROM feature_usage WHERE user_id = $1 AND feature = $2 AND usage_date = $3 LIMIT 1`,
        [user.id, feature, today]
      );
      if (existing.rows.length > 0) {
        await pool.query(
          `UPDATE feature_usage SET count = count + 1 WHERE id = $1`,
          [existing.rows[0].id]
        );
      } else {
        await pool.query(
          `INSERT INTO feature_usage (id, user_id, feature, usage_date, count)
           VALUES (gen_random_uuid(), $1, $2, $3, 1)`,
          [user.id, feature, today]
        );
      }
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/imaging/stripe-key", async (_req, res) => {
    try {
      const key = await getStripePublishableKey();
      res.json({ publishableKey: key });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/imaging/products", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const result = await pool.query(`SELECT * FROM imaging_products ORDER BY sort_order ASC, created_at ASC`);
      res.json(result.rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/imaging/purchases", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const result = await pool.query(
        `SELECT p.*, pr.title as product_title, u.username, u.email
         FROM imaging_purchases p
         LEFT JOIN imaging_products pr ON p.product_id = pr.id
         LEFT JOIN users u ON p.user_id = u.id
         ORDER BY p.purchased_at DESC LIMIT 100`
      );
      res.json(result.rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/imaging/preview-configs", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const result = await pool.query(`SELECT * FROM imaging_preview_config ORDER BY content_type`);
      res.json(result.rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
