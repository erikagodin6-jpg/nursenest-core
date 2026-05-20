import type { Express, Request, Response, NextFunction } from "express";
import { pool } from "./storage";
import { resolveAuthUser } from "./admin-auth";

export async function ensureResilienceTables(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS critical_route_errors (
        id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        route text NOT NULL,
        method text NOT NULL DEFAULT 'GET',
        user_id varchar,
        content_id varchar,
        exam_id varchar,
        product_id varchar,
        locale text,
        entitlement_result text,
        error_message text NOT NULL,
        stack_trace text,
        fallback_mode_triggered boolean DEFAULT false,
        request_params jsonb DEFAULT '{}'::jsonb,
        created_at timestamptz DEFAULT NOW() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_critical_route_errors_route ON critical_route_errors(route);
      CREATE INDEX IF NOT EXISTS idx_critical_route_errors_created ON critical_route_errors(created_at);
      CREATE INDEX IF NOT EXISTS idx_critical_route_errors_user ON critical_route_errors(user_id);

      CREATE TABLE IF NOT EXISTS content_versions (
        id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        content_type text NOT NULL,
        content_id varchar NOT NULL,
        version_number integer NOT NULL DEFAULT 1,
        snapshot jsonb NOT NULL,
        verified_good boolean DEFAULT false,
        verified_by varchar,
        verified_at timestamptz,
        created_at timestamptz DEFAULT NOW() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_content_versions_lookup ON content_versions(content_type, content_id);
      CREATE INDEX IF NOT EXISTS idx_content_versions_verified ON content_versions(content_type, content_id, verified_good);

      CREATE TABLE IF NOT EXISTS provisional_access_log (
        id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id varchar NOT NULL,
        reason text NOT NULL,
        stripe_evidence jsonb DEFAULT '{}'::jsonb,
        granted_at timestamptz DEFAULT NOW() NOT NULL,
        expires_at timestamptz NOT NULL,
        revoked_at timestamptz
      );
      CREATE INDEX IF NOT EXISTS idx_provisional_access_user ON provisional_access_log(user_id);
      CREATE INDEX IF NOT EXISTS idx_provisional_access_active ON provisional_access_log(user_id, expires_at);

      CREATE TABLE IF NOT EXISTS kill_switches (
        id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        feature_key text NOT NULL UNIQUE,
        enabled boolean DEFAULT false,
        scope text NOT NULL DEFAULT 'global',
        affected_ids text[] DEFAULT '{}'::text[],
        affected_locales text[] DEFAULT '{}'::text[],
        reason text,
        activated_by varchar,
        activated_by_username text,
        activated_at timestamptz,
        deactivated_at timestamptz,
        created_at timestamptz DEFAULT NOW() NOT NULL,
        updated_at timestamptz DEFAULT NOW() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_kill_switches_key ON kill_switches(feature_key);
      CREATE INDEX IF NOT EXISTS idx_kill_switches_enabled ON kill_switches(enabled);

      CREATE TABLE IF NOT EXISTS quarantine_log (
        id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        content_type text NOT NULL,
        content_id varchar NOT NULL,
        reason text NOT NULL,
        quarantined_by varchar,
        quarantined_by_username text,
        fallback_version_id varchar,
        quarantined_at timestamptz DEFAULT NOW() NOT NULL,
        released_at timestamptz,
        released_by varchar
      );
      CREATE INDEX IF NOT EXISTS idx_quarantine_log_content ON quarantine_log(content_type, content_id);
      CREATE INDEX IF NOT EXISTS idx_quarantine_log_active ON quarantine_log(content_type, content_id, released_at);
    `);
  } catch (e: any) {
    console.error("[BackendResilience] Table creation error:", e.message);
  }

  const defaultSwitches = [
    { key: "exam_player", scope: "global" },
    { key: "cat_engine", scope: "global" },
    { key: "exam_by_id", scope: "exam" },
    { key: "locale_block", scope: "locale" },
    { key: "flashcards", scope: "global" },
    { key: "mock_exams", scope: "global" },
    { key: "ai_tutor", scope: "global" },
    { key: "lesson_rendering", scope: "global" },
  ];
  for (const sw of defaultSwitches) {
    try {
      await pool.query(
        `INSERT INTO kill_switches (feature_key, enabled, scope) VALUES ($1, false, $2) ON CONFLICT (feature_key) DO NOTHING`,
        [sw.key, sw.scope]
      );
    } catch {}
  }
}

export async function logCriticalError(params: {
  route: string;
  method?: string;
  userId?: string | null;
  contentId?: string | null;
  examId?: string | null;
  productId?: string | null;
  locale?: string | null;
  entitlementResult?: string | null;
  errorMessage: string;
  stackTrace?: string | null;
  fallbackModeTriggered?: boolean;
  requestParams?: Record<string, any>;
}): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO critical_route_errors
        (route, method, user_id, content_id, exam_id, product_id, locale, entitlement_result, error_message, stack_trace, fallback_mode_triggered, request_params)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        params.route,
        params.method || "GET",
        params.userId || null,
        params.contentId || null,
        params.examId || null,
        params.productId || null,
        params.locale || null,
        params.entitlementResult || null,
        params.errorMessage,
        params.stackTrace || null,
        params.fallbackModeTriggered || false,
        JSON.stringify(params.requestParams || {}),
      ]
    );
  } catch (e: any) {
    console.error("[CriticalError] Failed to log:", e.message, "Original:", params.errorMessage);
  }
}

export function validateExamQuestion(q: any): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  if (!q.stem || typeof q.stem !== "string" || q.stem.trim().length < 5) {
    issues.push("missing_or_short_stem");
  }
  let opts = q.options;
  if (typeof opts === "string") {
    try { opts = JSON.parse(opts); } catch { issues.push("unparseable_options"); }
  }
  if (!Array.isArray(opts) || opts.length < 2) {
    issues.push("insufficient_options");
  }
  if (q.correct_answer === null || q.correct_answer === undefined) {
    issues.push("missing_correct_answer");
  }
  return { valid: issues.length === 0, issues };
}

export function validateFlashcard(card: any): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  if (!card.front && !card.question) issues.push("missing_front");
  if (!card.back && !card.answer) issues.push("missing_back");
  return { valid: issues.length === 0, issues };
}

export function validateLessonContent(lesson: any): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  if (!lesson.title || typeof lesson.title !== "string") issues.push("missing_title");
  if (!lesson.slug || typeof lesson.slug !== "string") issues.push("missing_slug");
  return { valid: issues.length === 0, issues };
}

export function filterValidItems<T>(
  items: T[],
  validator: (item: T) => { valid: boolean; issues: string[] }
): { validItems: T[]; skippedCount: number; skippedDetails: Array<{ index: number; issues: string[] }> } {
  const validItems: T[] = [];
  const skippedDetails: Array<{ index: number; issues: string[] }> = [];
  for (let i = 0; i < items.length; i++) {
    const result = validator(items[i]);
    if (result.valid) {
      validItems.push(items[i]);
    } else {
      skippedDetails.push({ index: i, issues: result.issues });
    }
  }
  return { validItems, skippedCount: skippedDetails.length, skippedDetails };
}

export function contentValidationMiddleware(contentType: "exam" | "flashcard" | "lesson") {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);
    res.json = function (body: any) {
      if (body && !body.error) {
        try {
          if (contentType === "exam" && body.questions && Array.isArray(body.questions)) {
            const { validItems, skippedCount, skippedDetails } = filterValidItems(body.questions, validateExamQuestion);
            body.questions = validItems;
            body.skippedCount = skippedCount;
            if (skippedCount > 0) {
              console.warn(`[ContentValidation] Filtered ${skippedCount} invalid exam questions`);
            }
          }
          if (contentType === "flashcard" && body.cards && Array.isArray(body.cards)) {
            const { validItems, skippedCount } = filterValidItems(body.cards, validateFlashcard);
            body.cards = validItems;
            body.skippedCount = skippedCount;
          }
          if (contentType === "flashcard" && body.flashcards && Array.isArray(body.flashcards)) {
            const { validItems, skippedCount } = filterValidItems(body.flashcards, validateFlashcard);
            body.flashcards = validItems;
            body.skippedCount = skippedCount;
          }
        } catch (e: any) {
          console.error("[ContentValidation] Validation error:", e.message);
        }
      }
      return originalJson(body);
    } as any;
    next();
  };
}

export async function saveContentVersion(contentType: string, contentId: string, snapshot: any): Promise<void> {
  try {
    const countResult = await pool.query(
      `SELECT COALESCE(MAX(version_number), 0) as max_ver FROM content_versions WHERE content_type = $1 AND content_id = $2`,
      [contentType, contentId]
    );
    const nextVersion = (parseInt(countResult.rows[0]?.max_ver || "0")) + 1;
    await pool.query(
      `INSERT INTO content_versions (content_type, content_id, version_number, snapshot)
       VALUES ($1, $2, $3, $4)`,
      [contentType, contentId, nextVersion, JSON.stringify(snapshot)]
    );
    const oldVersions = await pool.query(
      `SELECT id FROM content_versions WHERE content_type = $1 AND content_id = $2 AND verified_good = false ORDER BY version_number DESC OFFSET 10`,
      [contentType, contentId]
    );
    if (oldVersions.rows.length > 0) {
      const ids = oldVersions.rows.map((r: any) => r.id);
      await pool.query(`DELETE FROM content_versions WHERE id = ANY($1)`, [ids]);
    }
  } catch (e: any) {
    console.error("[ContentVersions] Save error:", e.message);
  }
}

export async function getLastKnownGoodVersion(contentType: string, contentId: string): Promise<any | null> {
  try {
    const result = await pool.query(
      `SELECT snapshot FROM content_versions
       WHERE content_type = $1 AND content_id = $2 AND verified_good = true
       ORDER BY version_number DESC LIMIT 1`,
      [contentType, contentId]
    );
    if (result.rows.length > 0) {
      return typeof result.rows[0].snapshot === "string"
        ? JSON.parse(result.rows[0].snapshot)
        : result.rows[0].snapshot;
    }
    const latestResult = await pool.query(
      `SELECT snapshot FROM content_versions
       WHERE content_type = $1 AND content_id = $2
       ORDER BY version_number DESC LIMIT 1`,
      [contentType, contentId]
    );
    if (latestResult.rows.length > 0) {
      return typeof latestResult.rows[0].snapshot === "string"
        ? JSON.parse(latestResult.rows[0].snapshot)
        : latestResult.rows[0].snapshot;
    }
    return null;
  } catch (e: any) {
    console.error("[ContentVersions] Fetch last known good error:", e.message);
    return null;
  }
}

export async function markVersionAsVerifiedGood(contentType: string, contentId: string, versionId: string, verifiedBy: string): Promise<boolean> {
  try {
    const result = await pool.query(
      `UPDATE content_versions SET verified_good = true, verified_by = $3, verified_at = NOW()
       WHERE id = $1 AND content_type = $2 AND content_id = $4 RETURNING id`,
      [versionId, contentType, verifiedBy, contentId]
    );
    return (result.rowCount ?? 0) > 0;
  } catch (e: any) {
    console.error("[ContentVersions] Mark verified error:", e.message);
    return false;
  }
}

export async function checkRecentPaymentEvidence(userId: string): Promise<{ hasEvidence: boolean; evidence: any }> {
  try {
    const userResult = await pool.query(
      `SELECT stripe_customer_id, stripe_subscription_id, subscription_status, tier FROM users WHERE id = $1`,
      [userId]
    );
    if (!userResult.rows[0]) return { hasEvidence: false, evidence: null };
    const user = userResult.rows[0];

    if (!user.stripe_customer_id) return { hasEvidence: false, evidence: null };

    const subResult = await pool.query(
      `SELECT id, status, created_at FROM subscriptions
       WHERE user_id = $1 AND created_at > NOW() - INTERVAL '72 hours'
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    ).catch(() => ({ rows: [] }));

    if (subResult.rows.length > 0) {
      return {
        hasEvidence: true,
        evidence: {
          type: "recent_subscription_event",
          subscriptionId: subResult.rows[0].id,
          status: subResult.rows[0].status,
          createdAt: subResult.rows[0].created_at,
        },
      };
    }

    if (user.subscription_status === "active" || user.subscription_status === "trialing") {
      return {
        hasEvidence: true,
        evidence: {
          type: "active_subscription_status",
          status: user.subscription_status,
          customerId: user.stripe_customer_id,
        },
      };
    }

    const paymentResult = await pool.query(
      `SELECT id, status, created_at FROM payment_intents
       WHERE user_id = $1 AND status = 'succeeded' AND created_at > NOW() - INTERVAL '72 hours'
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    ).catch(() => ({ rows: [] }));

    if (paymentResult.rows.length > 0) {
      return {
        hasEvidence: true,
        evidence: {
          type: "recent_payment_intent",
          paymentIntentId: paymentResult.rows[0].id,
          createdAt: paymentResult.rows[0].created_at,
        },
      };
    }

    return { hasEvidence: false, evidence: null };
  } catch (e: any) {
    console.error("[ProvisionalAccess] Payment evidence check error:", e.message);
    return { hasEvidence: false, evidence: null };
  }
}

export async function grantProvisionalAccessWithLog(userId: string, reason: string, evidence: any): Promise<void> {
  try {
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);
    await pool.query(
      `INSERT INTO provisional_access_log (user_id, reason, stripe_evidence, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [userId, reason, JSON.stringify(evidence), expiresAt]
    );
    const { grantProvisionalAccess } = await import("./platform-resilience");
    grantProvisionalAccess(userId, reason);
  } catch (e: any) {
    console.error("[ProvisionalAccess] Grant error:", e.message);
  }
}

export async function checkAndGrantProvisionalAccess(userId: string): Promise<{ granted: boolean; provisionalAccess: boolean; evidence: any }> {
  try {
    const existingGrant = await pool.query(
      `SELECT id FROM provisional_access_log WHERE user_id = $1 AND expires_at > NOW() LIMIT 1`,
      [userId]
    );
    if (existingGrant.rows.length > 0) {
      return { granted: true, provisionalAccess: true, evidence: { type: "existing_grant" } };
    }
  } catch {}

  const { hasEvidence, evidence } = await checkRecentPaymentEvidence(userId);
  if (hasEvidence) {
    await grantProvisionalAccessWithLog(userId, `billing_sync_issue_${evidence.type}`, evidence);
    return { granted: true, provisionalAccess: true, evidence };
  }
  return { granted: false, provisionalAccess: false, evidence: null };
}

export async function getKillSwitch(featureKey: string): Promise<any | null> {
  try {
    const result = await pool.query(
      `SELECT * FROM kill_switches WHERE feature_key = $1`,
      [featureKey]
    );
    return result.rows[0] || null;
  } catch {
    return null;
  }
}

export async function getAllKillSwitches(): Promise<any[]> {
  try {
    const result = await pool.query(
      `SELECT * FROM kill_switches ORDER BY feature_key`
    );
    return result.rows;
  } catch {
    return [];
  }
}

export async function getActiveKillSwitches(): Promise<any[]> {
  try {
    const result = await pool.query(
      `SELECT feature_key, enabled, scope, affected_ids, affected_locales, reason, activated_at
       FROM kill_switches WHERE enabled = true ORDER BY feature_key`
    );
    return result.rows;
  } catch {
    return [];
  }
}

export function killSwitchGuard(featureKey: string) {
  return async (_req: Request, res: Response, next: NextFunction) => {
    try {
      if (await isKillSwitchEnabled(featureKey)) {
        return res.status(503).json({
          error: "This feature is temporarily disabled for maintenance.",
          code: "FEATURE_DISABLED",
          feature: featureKey,
        });
      }
    } catch {}
    next();
  };
}

export async function upsertKillSwitch(params: {
  featureKey: string;
  enabled: boolean;
  scope?: string;
  affectedIds?: string[];
  affectedLocales?: string[];
  reason?: string;
  adminId?: string;
  adminUsername?: string;
}): Promise<any> {
  try {
    const result = await pool.query(
      `INSERT INTO kill_switches (feature_key, enabled, scope, affected_ids, affected_locales, reason, activated_by, activated_by_username, activated_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CASE WHEN $2 THEN NOW() ELSE NULL END, NOW())
       ON CONFLICT (feature_key)
       DO UPDATE SET
         enabled = $2,
         scope = COALESCE($3, kill_switches.scope),
         affected_ids = COALESCE($4, kill_switches.affected_ids),
         affected_locales = COALESCE($5, kill_switches.affected_locales),
         reason = $6,
         activated_by = CASE WHEN $2 THEN $7 ELSE kill_switches.activated_by END,
         activated_by_username = CASE WHEN $2 THEN $8 ELSE kill_switches.activated_by_username END,
         activated_at = CASE WHEN $2 THEN NOW() ELSE kill_switches.activated_at END,
         deactivated_at = CASE WHEN NOT $2 THEN NOW() ELSE NULL END,
         updated_at = NOW()
       RETURNING *`,
      [
        params.featureKey,
        params.enabled,
        params.scope || "global",
        params.affectedIds || [],
        params.affectedLocales || [],
        params.reason || null,
        params.adminId || null,
        params.adminUsername || null,
      ]
    );
    return result.rows[0];
  } catch (e: any) {
    console.error("[KillSwitch] Upsert error:", e.message);
    return null;
  }
}

export async function isKillSwitchEnabled(featureKey: string, examId?: string, locale?: string): Promise<boolean> {
  try {
    const result = await pool.query(
      `SELECT enabled, scope, affected_ids, affected_locales FROM kill_switches WHERE feature_key = $1`,
      [featureKey]
    );
    if (!result.rows[0] || !result.rows[0].enabled) return false;
    const ks = result.rows[0];
    if (ks.scope === "global") return true;
    if (ks.scope === "exam" && examId && ks.affected_ids?.includes(examId)) return true;
    if (ks.scope === "locale" && locale && ks.affected_locales?.includes(locale)) return true;
    if (ks.scope === "exam_ids" && examId && ks.affected_ids?.includes(examId)) return true;
    if (ks.scope === "locales" && locale && ks.affected_locales?.includes(locale)) return true;
    return ks.scope === "global";
  } catch {
    return false;
  }
}

export async function quarantineContent(params: {
  contentType: string;
  contentId: string;
  reason: string;
  quarantinedBy?: string;
  quarantinedByUsername?: string;
}): Promise<any> {
  try {
    const existingActive = await pool.query(
      `SELECT id FROM quarantine_log WHERE content_type = $1 AND content_id = $2 AND released_at IS NULL`,
      [params.contentType, params.contentId]
    );
    if (existingActive.rows.length > 0) {
      return { alreadyQuarantined: true };
    }

    let fallbackVersionId: string | null = null;
    const versionResult = await pool.query(
      `SELECT id FROM content_versions
       WHERE content_type = $1 AND content_id = $2 AND verified_good = true
       ORDER BY version_number DESC LIMIT 1`,
      [params.contentType, params.contentId]
    );
    if (versionResult.rows[0]) {
      fallbackVersionId = versionResult.rows[0].id;
    }

    const result = await pool.query(
      `INSERT INTO quarantine_log (content_type, content_id, reason, quarantined_by, quarantined_by_username, fallback_version_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        params.contentType,
        params.contentId,
        params.reason,
        params.quarantinedBy || null,
        params.quarantinedByUsername || null,
        fallbackVersionId,
      ]
    );

    if (params.contentType === "exam_question") {
      await pool.query(
        `UPDATE exam_questions SET quarantined_at = NOW(), quarantine_reason = $2 WHERE id = $1`,
        [params.contentId, params.reason]
      ).catch(() => {});
    }

    return result.rows[0];
  } catch (e: any) {
    console.error("[Quarantine] Error:", e.message);
    return null;
  }
}

export async function releaseFromQuarantine(params: {
  contentType: string;
  contentId: string;
  releasedBy: string;
}): Promise<boolean> {
  try {
    await pool.query(
      `UPDATE quarantine_log SET released_at = NOW(), released_by = $3
       WHERE content_type = $1 AND content_id = $2 AND released_at IS NULL`,
      [params.contentType, params.contentId, params.releasedBy]
    );

    if (params.contentType === "exam_question") {
      await pool.query(
        `UPDATE exam_questions SET quarantined_at = NULL, quarantine_reason = NULL WHERE id = $1`,
        [params.contentId]
      ).catch(() => {});
    }

    return true;
  } catch (e: any) {
    console.error("[Quarantine] Release error:", e.message);
    return false;
  }
}

export async function isContentQuarantined(contentType: string, contentId: string): Promise<boolean> {
  try {
    const result = await pool.query(
      `SELECT id FROM quarantine_log WHERE content_type = $1 AND content_id = $2 AND released_at IS NULL LIMIT 1`,
      [contentType, contentId]
    );
    return result.rows.length > 0;
  } catch {
    return false;
  }
}

export async function getQuarantinedItems(contentType?: string): Promise<any[]> {
  try {
    let query = `SELECT * FROM quarantine_log WHERE released_at IS NULL`;
    const params: any[] = [];
    if (contentType) {
      query += ` AND content_type = $1`;
      params.push(contentType);
    }
    query += ` ORDER BY quarantined_at DESC LIMIT 200`;
    const result = await pool.query(query, params);
    return result.rows;
  } catch {
    return [];
  }
}

async function resolveAdmin(req: Request, res: Response): Promise<any | null> {
  try {
    const user = await resolveAuthUser(req as any);
    if (!user || user.tier !== "admin") {
      res.status(403).json({ error: "Admin access required" });
      return null;
    }
    return user;
  } catch {
    res.status(403).json({ error: "Admin access required" });
    return null;
  }
}

export function registerBackendResilienceRoutes(app: Express): void {

  app.get("/api/kill-switches", async (_req: Request, res: Response) => {
    try {
      const switches = await getActiveKillSwitches();
      const formatted = switches.map((s: any) => ({
        featureKey: s.feature_key,
        enabled: s.enabled,
        scope: s.scope,
        affectedIds: s.affected_ids || [],
        affectedLocales: s.affected_locales || [],
        reason: s.reason,
        activatedAt: s.activated_at,
      }));
      res.json({ killSwitches: formatted, timestamp: new Date().toISOString() });
    } catch (e: any) {
      res.status(500).json({ error: "Failed to fetch kill switches" });
    }
  });

  app.get("/api/admin/kill-switches", async (req: Request, res: Response) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;
    try {
      const switches = await getAllKillSwitches();
      res.json({
        killSwitches: switches.map((s: any) => ({
          id: s.id,
          featureKey: s.feature_key,
          enabled: s.enabled,
          scope: s.scope,
          affectedIds: s.affected_ids || [],
          affectedLocales: s.affected_locales || [],
          reason: s.reason,
          activatedBy: s.activated_by_username,
          activatedAt: s.activated_at,
          deactivatedAt: s.deactivated_at,
          updatedAt: s.updated_at,
        })),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/admin/kill-switches", async (req: Request, res: Response) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;
    try {
      const { featureKey, enabled, scope, affectedIds, affectedLocales, reason } = req.body;
      if (!featureKey || typeof enabled !== "boolean") {
        return res.status(400).json({ error: "featureKey and enabled (boolean) are required" });
      }
      const result = await upsertKillSwitch({
        featureKey,
        enabled,
        scope,
        affectedIds,
        affectedLocales,
        reason,
        adminId: admin.id,
        adminUsername: admin.username,
      });
      res.json({ success: true, killSwitch: result });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/critical-errors", async (req: Request, res: Response) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 500);
      const route = req.query.route as string;
      let query = `SELECT * FROM critical_route_errors`;
      const params: any[] = [];
      if (route) {
        query += ` WHERE route ILIKE $1`;
        params.push(`%${route}%`);
      }
      query += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
      params.push(limit);
      const result = await pool.query(query, params);
      res.json({ errors: result.rows, total: result.rows.length });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/content-versions", async (req: Request, res: Response) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;
    try {
      const contentType = req.query.contentType as string;
      const contentId = req.query.contentId as string;
      if (!contentType || !contentId) {
        return res.status(400).json({ error: "contentType and contentId are required" });
      }
      const result = await pool.query(
        `SELECT * FROM content_versions WHERE content_type = $1 AND content_id = $2 ORDER BY version_number DESC LIMIT 20`,
        [contentType, contentId]
      );
      res.json({ versions: result.rows });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/content-versions/verify", async (req: Request, res: Response) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;
    try {
      const { contentType, contentId, versionId } = req.body;
      if (!contentType || !contentId || !versionId) {
        return res.status(400).json({ error: "contentType, contentId, and versionId are required" });
      }
      const success = await markVersionAsVerifiedGood(contentType, contentId, versionId, admin.id);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Version not found" });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/provisional-access", async (req: Request, res: Response) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;
    try {
      const result = await pool.query(
        `SELECT * FROM provisional_access_log ORDER BY granted_at DESC LIMIT 100`
      );
      res.json({ grants: result.rows });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/quarantine", async (req: Request, res: Response) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;
    try {
      const { contentType, contentId, reason } = req.body;
      if (!contentType || !contentId || !reason) {
        return res.status(400).json({ error: "contentType, contentId, and reason are required" });
      }
      const result = await quarantineContent({
        contentType,
        contentId,
        reason,
        quarantinedBy: admin.id,
        quarantinedByUsername: admin.username,
      });
      if (result?.alreadyQuarantined) {
        return res.status(409).json({ error: "Content is already quarantined" });
      }
      res.json({ success: true, quarantineEntry: result });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/quarantine/release", async (req: Request, res: Response) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;
    try {
      const { contentType, contentId } = req.body;
      if (!contentType || !contentId) {
        return res.status(400).json({ error: "contentType and contentId are required" });
      }
      const success = await releaseFromQuarantine({
        contentType,
        contentId,
        releasedBy: admin.id,
      });
      res.json({ success });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/quarantine", async (req: Request, res: Response) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;
    try {
      const contentType = req.query.contentType as string;
      const items = await getQuarantinedItems(contentType);
      res.json({ quarantined: items });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
