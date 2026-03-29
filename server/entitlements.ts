import { resolveAuthUser, requireAdmin } from "./admin-auth";
import { pool } from "./storage";
import type { Request, Response, NextFunction } from "express";
import type { AccessSource, EntitlementDecisionObject } from "@shared/schema";

/**
 * ------------------------------
 * CONSTANTS
 * ------------------------------
 */

const PROVISIONAL_GRACE_WINDOW_MS = 15 * 60 * 1000;

export type Tier =
  | "free"
  | "rpn"
  | "rn"
  | "np"
  | "new_grad_toolkit"
  | "certification_prep"
  | "full_access"
  | "admin";

const TIER_LEVEL: Record<string, number> = {
  free: 0,
  rpn: 1,
  rn: 2,
  np: 3,
  admin: 99,
};

const PAID_TIERS = new Set([
  "rpn",
  "rn",
  "np",
  "allied",
  "imaging",
  "new_grad_toolkit",
  "certification_prep",
  "full_access",
  "admin",
]);

/**
 * ------------------------------
 * FEATURE MAP
 * ------------------------------
 */

export type Feature = string; // keep flexible

export const FEATURE_TIERS: Record<string, Tier> = {
  lessons_free: "free",
  lessons_rpn: "rpn",
  lessons_rn: "rn",
  lessons_np: "np",
  flashcards: "rpn",
  qbank: "rpn",
  cat_exams: "rpn",
  reports: "rpn",
  admin_dashboard: "admin",
  ai_tutor: "free",
};

/**
 * ------------------------------
 * BASIC HELPERS
 * ------------------------------
 */

function nowISO() {
  return new Date().toISOString();
}

function isExpired(date: any): boolean {
  if (!date) return false;
  return new Date(date).getTime() < Date.now();
}

export function isActiveTester(user: any): boolean {
  const ta = user?.testerAccess ?? user?.tester_access;
  const exp = user?.testerExpiry ?? user?.tester_expiry;
  if (ta !== true) return false;
  if (!exp) return true;
  return new Date(exp).getTime() > Date.now();
}

/**
 * ------------------------------
 * ACCESS SOURCE RESOLUTION
 * ------------------------------
 */

function determineAccessSource(user: any): {
  source: AccessSource;
  reason: string;
  expiresAt: string | null;
} {
  const tier = user?.tier || "free";

  if (tier === "admin") return { source: "admin_override", reason: "admin", expiresAt: null };

  if (isActiveTester(user)) {
    return {
      source: "tester",
      reason: "active_tester",
      expiresAt: user.tester_expiry || user.testerExpiry || null,
    };
  }

  if (user?.trial_active && !isExpired(user.trial_end)) {
    return { source: "trial", reason: "active_trial", expiresAt: user.trial_end };
  }

  if (user?.is_lifetime) {
    return { source: "one_time_purchase", reason: "lifetime", expiresAt: null };
  }

  if (PAID_TIERS.has(tier)) {
    return {
      source: "subscription",
      reason: `tier_${tier}`,
      expiresAt: user.plan_expires_at || null,
    };
  }

  return { source: "free", reason: "free_tier", expiresAt: null };
}

/**
 * ------------------------------
 * DEFAULT DECISION
 * ------------------------------
 */

function baseDecision(productType: string, productId: string | null): EntitlementDecisionObject {
  return {
    hasAccess: false,
    accessSource: "none",
    planId: null,
    productType,
    productId,
    region: null,
    locale: null,
    fallbackEligible: false,
    backupModesAvailable: [],
    lastVerifiedContentVersion: null,
    substituteEligible: false,
    expiresAt: null,
    accessDecisionReason: "no_access",
    provisional: false,
  };
}

/**
 * ------------------------------
 * CORE LOGIC (SYNC)
 * ------------------------------
 */

export function resolveEntitlementSync(
  user: any,
  productType: string,
  productId: string | null
): EntitlementDecisionObject {

  const decision = baseDecision(productType, productId);

  if (!user) {
    decision.accessDecisionReason = "not_authenticated";
    return decision;
  }

  const { source, reason, expiresAt } = determineAccessSource(user);

  decision.accessSource = source;
  decision.expiresAt = expiresAt;
  decision.planId = user.stripe_subscription_id || null;

  const tier = user.tier || "free";

  /**
   * FEATURE CHECK
   */
  if (productType === "feature" && productId) {
    const requiredTier = FEATURE_TIERS[productId] || "free";

    if (requiredTier === "free") {
      decision.hasAccess = true;
      decision.accessDecisionReason = "free_feature";
      return decision;
    }

    if (tier === "admin") {
      decision.hasAccess = true;
      decision.accessDecisionReason = "admin_override";
      return decision;
    }

    if (isActiveTester(user)) {
      decision.hasAccess = true;
      decision.accessSource = "tester";
      decision.accessDecisionReason = "tester_access";
      decision.expiresAt = user.tester_expiry || user.testerExpiry || null;
      return decision;
    }

    if (TIER_LEVEL[tier] >= TIER_LEVEL[requiredTier]) {
      decision.hasAccess = true;
      decision.accessDecisionReason = `tier_${tier}`;
      return decision;
    }

    decision.hasAccess = false;
    decision.accessDecisionReason = `requires_${requiredTier}`;
    decision.fallbackEligible = true;

    return decision;
  }

  /**
   * ANY PREMIUM
   */
  if (productType === "any_premium") {
    decision.hasAccess = PAID_TIERS.has(tier);
    decision.accessDecisionReason = decision.hasAccess ? reason : "requires_paid";
    return decision;
  }

  return decision;
}

/**
 * ------------------------------
 * DB WRAPPER
 * ------------------------------
 */

export async function resolveEntitlement(
  userId: string,
  productType: string,
  productId: string | null,
  requestPath?: string
): Promise<EntitlementDecisionObject> {

  let user;

  try {
    const r = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    user = r.rows[0];
  } catch {
    const decision = baseDecision(productType, productId);
    decision.accessDecisionReason = "db_failure";
    return decision;
  }

  if (!user) return baseDecision(productType, productId);

  const decision = resolveEntitlementSync(user, productType, productId);

  logDecision(userId, decision, requestPath);

  return decision;
}

/**
 * ------------------------------
 * LOGGING
 * ------------------------------
 */

function logDecision(userId: string, d: EntitlementDecisionObject, path?: string) {
  console.log(
    `[ENTITLEMENT] ${JSON.stringify({
      t: nowISO(),
      userId,
      feature: d.productId,
      access: d.hasAccess,
      source: d.accessSource,
      reason: d.accessDecisionReason,
      path,
    })}`
  );
}

/**
 * ------------------------------
 * EXPRESS MIDDLEWARE
 * ------------------------------
 */

export function requireEntitlement(feature: string) {
  return async (req: Request, res: Response, next: NextFunction) => {

    const user = await resolveAuthUser(req as any);

    if (!user) {
      return res.status(401).json({ error: "Authentication required", code: "AUTH_REQUIRED" });
    }

    const decision = await resolveEntitlement(user.id, "feature", feature, req.path);

    (req as any).authUser = user;
    (req as any).entitlement = decision;

    if (!decision.hasAccess) {
      return res.status(403).json({
        error: "Upgrade required",
        code: "ENTITLEMENT_DENIED",
        feature,
        requiredTier: FEATURE_TIERS[feature],
        currentTier: user.tier || "free",
      });
    }

    next();
  };
}

export function requireAnyPremium() {
  return async (req: Request, res: Response, next: NextFunction) => {

    const user = await resolveAuthUser(req as any);

    if (!user) {
      return res.status(401).json({ error: "Authentication required", code: "AUTH_REQUIRED" });
    }

    const decision = await resolveEntitlement(user.id, "any_premium", null, req.path);

    if (!decision.hasAccess) {
      return res.status(403).json({ error: "Premium required", code: "PREMIUM_REQUIRED" });
    }

    (req as any).authUser = user;

    next();
  };
}

/**
 * ------------------------------
 * UTILITIES
 * ------------------------------
 */

export function checkEntitlement(user: any, feature: string): boolean {
  return resolveEntitlementSync(user, "feature", feature).hasAccess;
}

export function getUserEntitlements(user: any) {
  const map: Record<string, boolean> = {};

  for (const f of Object.keys(FEATURE_TIERS)) {
    map[f] = checkEntitlement(user, f);
  }

  return map;
}

export function requireAuthenticated() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = await resolveAuthUser(req as any);
    if (!user) {
      return res.status(401).json({ error: "Authentication required", code: "AUTH_REQUIRED" });
    }
    (req as any).authUser = user;
    next();
  };
}

export async function handleEntitlementResolve(req: Request, res: Response) {
  const user = await resolveAuthUser(req as any);
  const productType = String(req.query.productType || "feature");
  const rawPid = req.query.productId;
  const productId = rawPid != null && rawPid !== "" ? String(rawPid) : null;

  if (!user) {
    const decision = resolveEntitlementSync(null as any, productType, productId);
    return res.json(decision);
  }

  const decision = await resolveEntitlement(user.id, productType, productId, req.path);
  res.json(decision);
}

export async function handleEntitlementDebug(req: Request, res: Response) {
  const admin = await requireAdmin(req as any, res as any);
  if (!admin) return;

  const targetId = String(req.query.userId || admin.id);
  const r = await pool.query(`SELECT * FROM users WHERE id = $1`, [targetId]);
  const user = r.rows[0];
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      tier: user.tier,
    },
    testerAccess: user.tester_access ?? user.testerAccess,
    testerExpiry: user.tester_expiry ?? user.testerExpiry,
    entitlements: getUserEntitlements(user),
    featureDecisions: Object.fromEntries(
      Object.keys(FEATURE_TIERS).map((f) => [
        f,
        resolveEntitlementSync(user, "feature", f),
      ]),
    ),
  });
}