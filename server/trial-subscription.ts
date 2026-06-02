import type { Express, Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import crypto from "crypto";
import { pool } from "./storage";
import { resolveAuthUser } from "./admin-auth";
import { getUncachableStripeClient } from "./stripeClient";
import type Stripe from "stripe";

const TRIAL_DURATION_HOURS = () => parseInt(process.env.TRIAL_DURATION_HOURS || "24", 10);
const TRIAL_MAX_QUESTIONS = () => parseInt(process.env.TRIAL_MAX_QUESTIONS || "50", 10);
const TRIAL_MAX_FLASHCARDS = () => parseInt(process.env.TRIAL_MAX_FLASHCARDS || "30", 10);
const TRIAL_MAX_LESSONS = () => parseInt(process.env.TRIAL_MAX_LESSONS || "5", 10);
const TRIAL_MAX_MOCK_EXAMS = () => parseInt(process.env.TRIAL_MAX_MOCK_EXAMS || "2", 10);
const TRIAL_DEVICE_MAX_ATTEMPTS = () => parseInt(process.env.TRIAL_DEVICE_MAX_ATTEMPTS || "3", 10);
const TRIAL_IP_MAX_ATTEMPTS = () => parseInt(process.env.TRIAL_IP_MAX_ATTEMPTS || "5", 10);
const TRIAL_IP_WINDOW_HOURS = () => parseInt(process.env.TRIAL_IP_WINDOW_HOURS || "24", 10);

function getClientIp(req: any): string {
  return String(req.headers["x-forwarded-for"] || req.ip || "unknown").split(",")[0].trim();
}

async function logTrialAudit(
  req: any,
  actor: any,
  entityId: string | null,
  action: string,
  beforeJson?: any,
  afterJson?: any
) {
  try {
    await pool.query(
      `INSERT INTO audit_logs (id, actor_id, actor_username, entity_type, entity_id, action, before_json, after_json, ip_address, user_agent, created_at)
       VALUES (gen_random_uuid(), $1, $2, 'trial_entitlement', $3, $4, $5, $6, $7, $8, NOW())`,
      [
        actor?.id || null,
        actor?.username || null,
        entityId,
        action,
        beforeJson ? JSON.stringify(beforeJson) : null,
        afterJson ? JSON.stringify(afterJson) : null,
        req?.ip || req?.headers?.["x-forwarded-for"] || null,
        req?.headers?.["user-agent"] || null,
      ]
    );
  } catch (e) {
    console.error("[TrialAudit] Error:", e);
  }
}

interface FraudCheckResult {
  blocked: boolean;
  reason: string | null;
  flags: string[];
}

async function runFraudChecks(
  userId: string,
  email: string,
  paymentFingerprint: string | null,
  deviceFingerprintHash: string | null,
  ip: string
): Promise<FraudCheckResult> {
  const flags: string[] = [];

  const emailCheck = await pool.query(
    `SELECT id FROM trial_entitlements
     WHERE EXISTS (SELECT 1 FROM users WHERE users.id = trial_entitlements.user_id AND LOWER(users.email) = LOWER($1))
     AND trial_status NOT IN ('blocked')
     LIMIT 1`,
    [email]
  );
  if (emailCheck.rows.length > 0) {
    flags.push("duplicate_email");
    return { blocked: true, reason: "A trial has already been used with this email address.", flags };
  }

  if (paymentFingerprint) {
    const fpCheck = await pool.query(
      `SELECT id FROM trial_entitlements WHERE payment_fingerprint = $1 AND trial_status NOT IN ('blocked') LIMIT 1`,
      [paymentFingerprint]
    );
    if (fpCheck.rows.length > 0) {
      flags.push("duplicate_payment_fingerprint");
      return { blocked: true, reason: "A trial has already been used with this payment method.", flags };
    }
  }

  if (deviceFingerprintHash) {
    const deviceCheck = await pool.query(
      `SELECT COUNT(*)::int AS cnt FROM trial_entitlements WHERE device_fingerprint_hash = $1 AND trial_status NOT IN ('blocked')`,
      [deviceFingerprintHash]
    );
    const deviceCount = deviceCheck.rows[0]?.cnt || 0;
    if (deviceCount >= TRIAL_DEVICE_MAX_ATTEMPTS()) {
      flags.push("device_fingerprint_exceeded");
      return { blocked: true, reason: "Too many trial attempts from this device.", flags };
    }
    if (deviceCount > 0) {
      flags.push("device_fingerprint_seen");
    }
  }

  const ipCheck = await pool.query(
    `SELECT COUNT(*)::int AS cnt FROM trial_entitlements
     WHERE signup_ip = $1
     AND created_at > NOW() - INTERVAL '1 hour' * $2
     AND trial_status NOT IN ('blocked')`,
    [ip, TRIAL_IP_WINDOW_HOURS()]
  );
  const ipCount = ipCheck.rows[0]?.cnt || 0;
  if (ipCount >= TRIAL_IP_MAX_ATTEMPTS()) {
    flags.push("ip_volume_exceeded");
    return { blocked: true, reason: "Too many trial activations from this network.", flags };
  }
  if (ipCount > 0) {
    flags.push("ip_seen_recently");
  }

  return { blocked: false, reason: null, flags };
}

async function requireAuth(req: any, res: any): Promise<any | null> {
  const user = await resolveAuthUser(req);
  if (!user) {
    res.status(401).json({ error: "Authentication required" });
    return null;
  }
  return user;
}

export async function getActiveTrialEntitlement(userId: string): Promise<any | null> {
  const result = await pool.query(
    `SELECT * FROM trial_entitlements
     WHERE user_id = $1
     AND trial_status = 'active'
     AND trial_ends_at > NOW()
     LIMIT 1`,
    [userId]
  );
  return result.rows[0] || null;
}

export function requireTrialOrPaid() {
  return async (req: any, res: any, next: NextFunction) => {
    const user = await resolveAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    req.authUser = user;
    const userTier = user.tier || "free";
    const paidTiers = new Set(["rpn", "rn", "np", "admin"]);

    if (paidTiers.has(userTier)) {
      const subStatus = user.subscription_status || user.subscriptionStatus || "inactive";
      if (subStatus === "active" || userTier === "admin") {
        return next();
      }
    }

    const testerAccess = user.tester_access || user.testerAccess;
    const testerExpiry = user.tester_expiry || user.testerExpiry;
    if (testerAccess && (!testerExpiry || new Date(testerExpiry) > new Date())) {
      return next();
    }

    const trial = await getActiveTrialEntitlement(user.id);
    if (trial) {
      const counters = typeof trial.consumption_counters === "string"
        ? JSON.parse(trial.consumption_counters)
        : (trial.consumption_counters || { questions: 0, flashcards: 0, lessons: 0, mockExams: 0 });

      req.trialEntitlement = trial;
      req.trialCounters = counters;
      req.trialTier = trial.selected_tier;
      return next();
    }

    return res.status(403).json({
      error: "Premium feature - upgrade required",
      reason: "no_active_subscription_or_trial",
      upgradeRequired: true,
    });
  };
}

export async function incrementTrialConsumption(
  trialId: string,
  contentType: "questions" | "flashcards" | "lessons" | "mockExams"
): Promise<{ allowed: boolean; current: number; max: number }> {
  const result = await pool.query(
    `SELECT consumption_counters FROM trial_entitlements WHERE id = $1`,
    [trialId]
  );
  if (!result.rows[0]) {
    return { allowed: false, current: 0, max: 0 };
  }

  const counters = typeof result.rows[0].consumption_counters === "string"
    ? JSON.parse(result.rows[0].consumption_counters)
    : (result.rows[0].consumption_counters || { questions: 0, flashcards: 0, lessons: 0, mockExams: 0 });

  const maxMap: Record<string, () => number> = {
    questions: TRIAL_MAX_QUESTIONS,
    flashcards: TRIAL_MAX_FLASHCARDS,
    lessons: TRIAL_MAX_LESSONS,
    mockExams: TRIAL_MAX_MOCK_EXAMS,
  };

  const current = counters[contentType] || 0;
  const max = maxMap[contentType]();

  if (current >= max) {
    return { allowed: false, current, max };
  }

  counters[contentType] = current + 1;

  await pool.query(
    `UPDATE trial_entitlements SET consumption_counters = $1 WHERE id = $2`,
    [JSON.stringify(counters), trialId]
  );

  return { allowed: true, current: current + 1, max };
}

export function requireTrialConsumption(contentType: "questions" | "flashcards" | "lessons" | "mockExams") {
  return async (req: any, res: any, next: NextFunction) => {
    if (!req.trialEntitlement) {
      return next();
    }

    const result = await incrementTrialConsumption(req.trialEntitlement.id, contentType);
    if (!result.allowed) {
      await logTrialAudit(req, req.authUser, req.trialEntitlement.id, "consumption_limit_hit", null, {
        contentType,
        current: result.current,
        max: result.max,
      });
      return res.status(403).json({
        error: "Trial content limit reached",
        reason: "consumption_limit_exceeded",
        contentType,
        current: result.current,
        max: result.max,
        upgradeRequired: true,
      });
    }

    req.trialConsumption = result;
    next();
  };
}

export function setupTrialSubscriptionRoutes(app: Express): void {
  const trialActivationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: "Too many trial activation attempts. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: true, trustProxy: true },
  });

  const contentFetchLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    message: { error: "Too many requests. Please slow down." },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: true, trustProxy: true },
  });

  const verifyEmailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: "Too many verification attempts. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: true, trustProxy: true },
  });

  app.post("/api/auth/send-verification", verifyEmailLimiter, async (req, res) => {
    try {
      const user = await requireAuth(req, res);
      if (!user) return;

      if (!user.email) {
        return res.status(400).json({ error: "No email address on account. Please update your profile with an email first." });
      }

      if (user.email_verified_at || user.emailVerifiedAt) {
        return res.status(400).json({ error: "Email is already verified." });
      }

      const code = crypto.randomInt(100000, 999999).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      await pool.query(
        `DELETE FROM email_verification_codes WHERE user_id = $1`,
        [user.id]
      );

      await pool.query(
        `INSERT INTO email_verification_codes (user_id, email, code, expires_at)
         VALUES ($1, $2, $3, $4)`,
        [user.id, user.email, code, expiresAt]
      );

      await logTrialAudit(req, user, user.id, "verification_code_sent", null, { email: user.email });

      res.json({ success: true, message: "Verification code sent to your email." });
    } catch (err: any) {
      console.error("[EmailVerify] Send error:", err.message);
      res.status(500).json({ error: "Failed to send verification code" });
    }
  });

  app.post("/api/auth/verify-email", verifyEmailLimiter, async (req, res) => {
    try {
      const user = await requireAuth(req, res);
      if (!user) return;

      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ error: "Verification code is required." });
      }

      const result = await pool.query(
        `SELECT * FROM email_verification_codes
         WHERE user_id = $1 AND code = $2 AND used_at IS NULL AND expires_at > NOW()
         ORDER BY created_at DESC LIMIT 1`,
        [user.id, String(code)]
      );

      if (!result.rows[0]) {
        return res.status(400).json({ error: "Invalid or expired verification code." });
      }

      const verificationRow = result.rows[0];

      await pool.query(
        `UPDATE email_verification_codes SET used_at = NOW() WHERE id = $1`,
        [verificationRow.id]
      );

      await pool.query(
        `UPDATE users SET email_verified_at = NOW() WHERE id = $1`,
        [user.id]
      );

      await logTrialAudit(req, user, user.id, "email_verified", null, { email: verificationRow.email });

      res.json({ success: true, message: "Email verified successfully." });
    } catch (err: any) {
      console.error("[EmailVerify] Verify error:", err.message);
      res.status(500).json({ error: "Failed to verify email" });
    }
  });

  app.post("/api/trial-sub/activate", trialActivationLimiter, async (req, res) => {
    try {
      const user = await requireAuth(req, res);
      if (!user) return;

      const { selectedTier, deviceFingerprint } = req.body;

      if (!selectedTier || !["rpn", "rn", "np"].includes(selectedTier)) {
        return res.status(400).json({ error: "Invalid tier selection. Choose rpn, rn, or np." });
      }

      if (!user.email) {
        return res.status(400).json({ error: "An email address is required to activate a trial. Please update your profile." });
      }

      const emailVerified = user.email_verified_at || user.emailVerifiedAt;
      if (!emailVerified) {
        return res.status(400).json({ error: "Email must be verified before activating a trial." });
      }

      const existingTrial = await pool.query(
        `SELECT id, trial_status FROM trial_entitlements WHERE user_id = $1 LIMIT 1`,
        [user.id]
      );
      if (existingTrial.rows.length > 0) {
        return res.status(409).json({
          error: "You have already used your free trial.",
          trialStatus: existingTrial.rows[0].trial_status,
        });
      }

      const ip = getClientIp(req);
      const deviceHash = deviceFingerprint
        ? crypto.createHash("sha256").update(String(deviceFingerprint)).digest("hex")
        : null;

      const fraudResult = await runFraudChecks(user.id, user.email, null, deviceHash, ip);

      if (fraudResult.blocked) {
        await logTrialAudit(req, user, null, "fraud_blocked", null, {
          reason: fraudResult.reason,
          flags: fraudResult.flags,
          ip,
          deviceHash,
        });
        return res.status(403).json({
          error: fraudResult.reason,
          reason: "fraud_detected",
        });
      }

      let stripeCustomerId = user.stripe_customer_id || user.stripeCustomerId;
      const stripe = await getUncachableStripeClient();

      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: { userId: user.id, username: user.username },
        });
        stripeCustomerId = customer.id;
        await pool.query(
          `UPDATE users SET stripe_customer_id = $1 WHERE id = $2`,
          [stripeCustomerId, user.id]
        );
      }

      const setupIntent = await stripe.setupIntents.create({
        customer: stripeCustomerId,
        usage: "off_session",
        metadata: {
          userId: user.id,
          trialTier: selectedTier,
          purpose: "trial_activation",
        },
      });

      const durationHours = TRIAL_DURATION_HOURS();
      const trialEndsAt = new Date(Date.now() + durationHours * 60 * 60 * 1000);

      const insertResult = await pool.query(
        `INSERT INTO trial_entitlements
         (user_id, selected_tier, trial_ends_at, trial_status, verified_email_at,
          stripe_customer_id, device_fingerprint_hash, signup_ip, last_seen_ip, abuse_flags)
         VALUES ($1, $2, $3, 'pending_payment', $4, $5, $6, $7, $7, $8)
         RETURNING id`,
        [
          user.id,
          selectedTier,
          trialEndsAt,
          emailVerified,
          stripeCustomerId,
          deviceHash,
          ip,
          JSON.stringify(fraudResult.flags),
        ]
      );

      const trialId = insertResult.rows[0].id;

      await logTrialAudit(req, user, trialId, "trial_initiated", null, {
        selectedTier,
        trialEndsAt,
        fraudFlags: fraudResult.flags,
        ip,
      });

      res.json({
        trialId,
        setupIntentClientSecret: setupIntent.client_secret,
        stripeCustomerId,
        selectedTier,
        trialEndsAt,
        trialDurationHours: durationHours,
      });
    } catch (err: any) {
      console.error("[TrialActivation] Error:", err.message);
      res.status(500).json({ error: "Failed to initiate trial activation" });
    }
  });

  app.post("/api/trial-sub/confirm", async (req, res) => {
    try {
      const user = await requireAuth(req, res);
      if (!user) return;

      const { trialId, setupIntentId } = req.body;
      if (!trialId || !setupIntentId) {
        return res.status(400).json({ error: "trialId and setupIntentId are required." });
      }

      const trialResult = await pool.query(
        `SELECT * FROM trial_entitlements WHERE id = $1 AND user_id = $2`,
        [trialId, user.id]
      );
      if (!trialResult.rows[0]) {
        return res.status(404).json({ error: "Trial not found." });
      }

      const trial = trialResult.rows[0];
      if (trial.trial_status !== "pending_payment") {
        return res.status(400).json({ error: "Trial is not in pending_payment state." });
      }

      const stripe = await getUncachableStripeClient();
      const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);

      if (setupIntent.status !== "succeeded") {
        return res.status(400).json({ error: "Payment method setup has not been completed." });
      }

      if (setupIntent.customer !== trial.stripe_customer_id) {
        return res.status(403).json({ error: "Setup intent does not match trial customer." });
      }

      if (setupIntent.metadata?.userId !== user.id || setupIntent.metadata?.trialTier !== trial.selected_tier) {
        return res.status(403).json({ error: "Setup intent metadata mismatch." });
      }

      const paymentMethodId = typeof setupIntent.payment_method === "string"
        ? setupIntent.payment_method
        : setupIntent.payment_method?.id;

      if (!paymentMethodId) {
        return res.status(400).json({ error: "No payment method found on setup intent." });
      }

      let paymentFingerprint: string | null = null;
      try {
        const pm = await stripe.paymentMethods.retrieve(paymentMethodId);
        if (pm.card) {
          paymentFingerprint = pm.card.fingerprint || null;
        }
      } catch (e) {
        console.warn("[TrialConfirm] Could not retrieve payment method details:", e);
      }

      if (paymentFingerprint) {
        const fpCheck = await pool.query(
          `SELECT id FROM trial_entitlements WHERE payment_fingerprint = $1 AND trial_status NOT IN ('blocked') AND id != $2 LIMIT 1`,
          [paymentFingerprint, trialId]
        );
        if (fpCheck.rows.length > 0) {
          await pool.query(
            `UPDATE trial_entitlements SET trial_status = 'blocked', abuse_flags = abuse_flags || $1::jsonb WHERE id = $2`,
            [JSON.stringify(["duplicate_payment_fingerprint"]), trialId]
          );
          await logTrialAudit(req, user, trialId, "fraud_blocked_payment", null, {
            paymentFingerprint,
          });
          return res.status(403).json({ error: "A trial has already been used with this payment method." });
        }
      }

      await stripe.paymentMethods.attach(paymentMethodId, { customer: trial.stripe_customer_id });
      await stripe.customers.update(trial.stripe_customer_id, {
        invoice_settings: { default_payment_method: paymentMethodId },
      });

      const tierPriceMap: Record<string, number> = {
        rpn: 2999,
        rn: 3999,
        np: 4999,
      };
      const unitAmount = tierPriceMap[trial.selected_tier] || 2999;

      // Stripe SDK `Item.PriceData` types require `product` id; API still accepts inline `product_data` for subscription items.
      const subscriptionParams = {
        customer: trial.stripe_customer_id,
        items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `NurseNest ${trial.selected_tier.toUpperCase()} - 24hr Trial`,
                metadata: { tier: trial.selected_tier, trialId: String(trialId) },
              },
              recurring: { interval: "month" as const },
              unit_amount: unitAmount,
            },
          },
        ],
        trial_period_days: Math.max(1, Math.ceil(TRIAL_DURATION_HOURS() / 24)),
        payment_settings: {
          save_default_payment_method: "on_subscription",
        },
        metadata: {
          userId: user.id,
          trialId,
          trialTier: trial.selected_tier,
          isTrial: "true",
        },
      } as unknown as Stripe.SubscriptionCreateParams;
      const subscription = await stripe.subscriptions.create(subscriptionParams);

      const durationHours = TRIAL_DURATION_HOURS();
      const trialEndsAt = new Date(Date.now() + durationHours * 60 * 60 * 1000);

      await pool.query(
        `UPDATE trial_entitlements
         SET trial_status = 'active',
             trial_started_at = NOW(),
             trial_ends_at = $1,
             stripe_trial_subscription_id = $2,
             payment_fingerprint = $3,
             consumption_counters = '{"questions":0,"flashcards":0,"lessons":0,"mockExams":0}'::jsonb
         WHERE id = $4`,
        [trialEndsAt, subscription.id, paymentFingerprint, trialId]
      );

      await logTrialAudit(req, user, trialId, "trial_activated", null, {
        selectedTier: trial.selected_tier,
        stripeSubscriptionId: subscription.id,
        trialEndsAt,
        paymentFingerprint: paymentFingerprint ? "present" : "none",
      });

      res.json({
        success: true,
        trialId,
        selectedTier: trial.selected_tier,
        trialEndsAt,
        stripeSubscriptionId: subscription.id,
        trialDurationHours: durationHours,
        consumptionLimits: {
          questions: TRIAL_MAX_QUESTIONS(),
          flashcards: TRIAL_MAX_FLASHCARDS(),
          lessons: TRIAL_MAX_LESSONS(),
          mockExams: TRIAL_MAX_MOCK_EXAMS(),
        },
      });
    } catch (err: any) {
      console.error("[TrialConfirm] Error:", err.message);
      res.status(500).json({ error: "Failed to confirm trial" });
    }
  });

  app.get("/api/trial-sub/status", async (req, res) => {
    try {
      const user = await requireAuth(req, res);
      if (!user) return;

      const result = await pool.query(
        `SELECT * FROM trial_entitlements WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [user.id]
      );

      if (!result.rows[0]) {
        return res.json({
          hasTrial: false,
          eligible: true,
        });
      }

      const trial = result.rows[0];
      const counters = typeof trial.consumption_counters === "string"
        ? JSON.parse(trial.consumption_counters)
        : (trial.consumption_counters || { questions: 0, flashcards: 0, lessons: 0, mockExams: 0 });

      const now = new Date();
      const isActive = trial.trial_status === "active" && new Date(trial.trial_ends_at) > now;

      if (trial.trial_status === "active" && new Date(trial.trial_ends_at) <= now) {
        await pool.query(
          `UPDATE trial_entitlements SET trial_status = 'expired' WHERE id = $1`,
          [trial.id]
        );
        trial.trial_status = "expired";
      }

      res.json({
        hasTrial: true,
        eligible: false,
        trialId: trial.id,
        selectedTier: trial.selected_tier,
        trialStatus: trial.trial_status,
        trialStartedAt: trial.trial_started_at,
        trialEndsAt: trial.trial_ends_at,
        isActive,
        consumptionCounters: counters,
        consumptionLimits: {
          questions: TRIAL_MAX_QUESTIONS(),
          flashcards: TRIAL_MAX_FLASHCARDS(),
          lessons: TRIAL_MAX_LESSONS(),
          mockExams: TRIAL_MAX_MOCK_EXAMS(),
        },
      });
    } catch (err: any) {
      console.error("[TrialStatus] Error:", err.message);
      res.status(500).json({ error: "Failed to get trial status" });
    }
  });

  app.post("/api/trial-sub/cancel", async (req, res) => {
    try {
      const user = await requireAuth(req, res);
      if (!user) return;

      const result = await pool.query(
        `SELECT * FROM trial_entitlements WHERE user_id = $1 AND trial_status = 'active' LIMIT 1`,
        [user.id]
      );

      if (!result.rows[0]) {
        return res.status(404).json({ error: "No active trial found." });
      }

      const trial = result.rows[0];

      if (trial.stripe_trial_subscription_id) {
        try {
          const stripe = await getUncachableStripeClient();
          await stripe.subscriptions.cancel(trial.stripe_trial_subscription_id);
        } catch (stripeErr: any) {
          console.warn("[TrialCancel] Stripe cancellation warning:", stripeErr.message);
        }
      }

      await pool.query(
        `UPDATE trial_entitlements SET trial_status = 'canceled' WHERE id = $1`,
        [trial.id]
      );

      await logTrialAudit(req, user, trial.id, "trial_canceled", null, {
        selectedTier: trial.selected_tier,
      });

      res.json({ success: true, message: "Trial canceled successfully." });
    } catch (err: any) {
      console.error("[TrialCancel] Error:", err.message);
      res.status(500).json({ error: "Failed to cancel trial" });
    }
  });

  app.get("/api/admin/trial-entitlements", async (req, res) => {
    try {
      const authUser = await resolveAuthUser(req);
      if (!authUser || (authUser.tier !== "admin")) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { status, limit: limitStr, offset: offsetStr } = req.query as any;
      const limit = parseInt(limitStr || "50", 10);
      const offset = parseInt(offsetStr || "0", 10);

      let query = `
        SELECT te.*, u.username, u.email
        FROM trial_entitlements te
        LEFT JOIN users u ON te.user_id = u.id
      `;
      const params: any[] = [];

      if (status) {
        params.push(status);
        query += ` WHERE te.trial_status = $${params.length}`;
      }

      query += ` ORDER BY te.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);

      const result = await pool.query(query, params);

      const countQuery = status
        ? `SELECT COUNT(*)::int AS total FROM trial_entitlements WHERE trial_status = $1`
        : `SELECT COUNT(*)::int AS total FROM trial_entitlements`;
      const countResult = await pool.query(countQuery, status ? [status] : []);

      res.json({
        entitlements: result.rows,
        total: countResult.rows[0]?.total || 0,
        limit,
        offset,
      });
    } catch (err: any) {
      console.error("[AdminTrialEntitlements] Error:", err.message);
      res.status(500).json({ error: "Failed to get trial entitlements" });
    }
  });

  app.get("/api/admin/trial-entitlements/analytics", async (req, res) => {
    try {
      const authUser = await resolveAuthUser(req);
      if (!authUser || (authUser.tier !== "admin")) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const stats = await pool.query(`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE trial_status = 'active')::int AS active,
          COUNT(*) FILTER (WHERE trial_status = 'expired')::int AS expired,
          COUNT(*) FILTER (WHERE trial_status = 'canceled')::int AS canceled,
          COUNT(*) FILTER (WHERE trial_status = 'blocked')::int AS blocked,
          COUNT(*) FILTER (WHERE trial_status = 'pending_payment')::int AS pending
        FROM trial_entitlements
      `);

      const tierBreakdown = await pool.query(`
        SELECT selected_tier, COUNT(*)::int AS count
        FROM trial_entitlements
        GROUP BY selected_tier
        ORDER BY count DESC
      `);

      const recentFraud = await pool.query(`
        SELECT id, user_id, abuse_flags, signup_ip, device_fingerprint_hash, created_at
        FROM trial_entitlements
        WHERE trial_status = 'blocked' OR jsonb_array_length(COALESCE(abuse_flags, '[]'::jsonb)) > 0
        ORDER BY created_at DESC
        LIMIT 20
      `);

      res.json({
        stats: stats.rows[0] || {},
        tierBreakdown: tierBreakdown.rows,
        recentFraudFlags: recentFraud.rows,
      });
    } catch (err: any) {
      console.error("[AdminTrialAnalytics] Error:", err.message);
      res.status(500).json({ error: "Failed to get trial analytics" });
    }
  });

  app.get("/api/trial-sub/consumption", async (req, res) => {
    try {
      const user = await requireAuth(req, res);
      if (!user) return;

      const trial = await getActiveTrialEntitlement(user.id);
      if (!trial) {
        return res.status(404).json({ error: "No active trial found." });
      }

      const counters = typeof trial.consumption_counters === "string"
        ? JSON.parse(trial.consumption_counters)
        : (trial.consumption_counters || { questions: 0, flashcards: 0, lessons: 0, mockExams: 0 });

      res.json({
        counters,
        limits: {
          questions: TRIAL_MAX_QUESTIONS(),
          flashcards: TRIAL_MAX_FLASHCARDS(),
          lessons: TRIAL_MAX_LESSONS(),
          mockExams: TRIAL_MAX_MOCK_EXAMS(),
        },
        remaining: {
          questions: Math.max(0, TRIAL_MAX_QUESTIONS() - (counters.questions || 0)),
          flashcards: Math.max(0, TRIAL_MAX_FLASHCARDS() - (counters.flashcards || 0)),
          lessons: Math.max(0, TRIAL_MAX_LESSONS() - (counters.lessons || 0)),
          mockExams: Math.max(0, TRIAL_MAX_MOCK_EXAMS() - (counters.mockExams || 0)),
        },
      });
    } catch (err: any) {
      console.error("[TrialConsumption] Error:", err.message);
      res.status(500).json({ error: "Failed to get trial consumption" });
    }
  });

  console.log("[TrialSubscription] Routes registered");
}

export async function handleTrialSubscriptionWebhook(event: any): Promise<void> {
  try {
    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object;
      const isTrial = subscription.metadata?.isTrial === "true";
      if (!isTrial) return;

      const trialId = subscription.metadata?.trialId;
      if (!trialId) return;

      if (subscription.status === "active" && !subscription.trial_end) {
        await pool.query(
          `UPDATE trial_entitlements SET trial_status = 'converted' WHERE id = $1 AND trial_status = 'active'`,
          [trialId]
        );

        const userId = subscription.metadata?.userId;
        const tier = subscription.metadata?.trialTier;
        if (userId && tier) {
          await pool.query(
            `UPDATE users SET tier = $1, subscription_status = 'active', stripe_subscription_id = $2 WHERE id = $3`,
            [tier, subscription.id, userId]
          );
        }

        await logTrialAudit(null, { id: subscription.metadata?.userId }, trialId, "trial_converted", null, {
          stripeSubscriptionId: subscription.id,
          tier: subscription.metadata?.trialTier,
        });
      }

      if (subscription.status === "canceled" || subscription.status === "incomplete_expired") {
        await pool.query(
          `UPDATE trial_entitlements SET trial_status = 'canceled' WHERE id = $1 AND trial_status IN ('active', 'pending_payment')`,
          [trialId]
        );

        await logTrialAudit(null, { id: subscription.metadata?.userId }, trialId, "trial_subscription_canceled", null, {
          stripeSubscriptionId: subscription.id,
          stripeStatus: subscription.status,
        });
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const trialId = subscription.metadata?.trialId;
      if (!trialId) return;

      await pool.query(
        `UPDATE trial_entitlements SET trial_status = 'canceled' WHERE id = $1 AND trial_status IN ('active', 'expired')`,
        [trialId]
      );

      await logTrialAudit(null, { id: subscription.metadata?.userId }, trialId, "trial_subscription_deleted", null, {
        stripeSubscriptionId: subscription.id,
      });
    }
  } catch (err: any) {
    console.error("[TrialWebhook] Error handling event:", err.message);
  }
}
