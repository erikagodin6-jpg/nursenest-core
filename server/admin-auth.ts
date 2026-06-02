/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AUTHENTICATION & ADMIN AUTH MODULE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * This module handles JWT signing/verification and user resolution from
 * request headers. It is the authentication layer only.
 *
 * For ENTITLEMENT / PREMIUM ACCESS decisions, use server/entitlements.ts:
 *   - requireEntitlement("feature")  — middleware that checks feature access
 *   - requireAnyPremium()            — middleware that requires any paid tier
 *   - checkEntitlement(user, feature) — boolean check
 *
 * DO NOT add new inline tier checks or paywall logic here. This module
 * should only answer "who is this user?" — not "what can they access?".
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { pool } from "./storage";

/**
 * Caches `SELECT * FROM users WHERE id = $1` for resolveAuthUser (Bearer / x-user-token / x-user-id).
 * Set USER_AUTH_CACHE_TTL_MS=0 to disable. Default 30000. Also caches short-lived "not found" rows.
 */
const AUTH_USER_CACHE_TTL_MS = (() => {
  const v = Number(process.env.USER_AUTH_CACHE_TTL_MS);
  if (!Number.isFinite(v) || v < 0) return 30_000;
  return Math.floor(v);
})();

const authUserRowCache = new Map<string, { user: unknown; ts: number }>();

async function getUserRowByIdCached(id: string): Promise<any | null> {
  if (AUTH_USER_CACHE_TTL_MS === 0) {
    const r = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return r.rows[0] || null;
  }
  const now = Date.now();
  const hit = authUserRowCache.get(id);
  if (hit && now - hit.ts < AUTH_USER_CACHE_TTL_MS) {
    return hit.user ?? null;
  }
  const r = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  const user = r.rows[0] || null;
  if (authUserRowCache.size > 10_000) {
    authUserRowCache.clear();
  }
  authUserRowCache.set(id, { user, ts: now });
  return user;
}

function getJwtSecret(): string {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error("ADMIN_JWT_SECRET environment variable is required. Server cannot start without it.");
  }
  return secret;
}

const SERVER_API_KEY = () => process.env.ADMIN_API_KEY || "";
const TOKEN_EXPIRY_SECONDS = 1800;
const BCRYPT_ROUNDS = 12;

export type AdminRole = "super_admin" | "content_admin" | "support_admin" | "ops_viewer" | "analytics_viewer";

export interface AdminTokenPayload {
  sub: string;
  username: string;
  role: "admin";
  adminRole?: AdminRole;
  iat: number;
  exp: number;
}

export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, BCRYPT_ROUNDS);
}

export async function verifyPassword(plaintext: string, hash: string): Promise<boolean> {
  if (hash.startsWith("$2a$") || hash.startsWith("$2b$") || hash.startsWith("$2y$")) {
    return bcrypt.compare(plaintext, hash);
  }
  if (plaintext === hash) {
    return true;
  }
  return false;
}

export async function migratePasswordIfNeeded(userId: string, plaintext: string, storedPassword: string): Promise<void> {
  if (!storedPassword.startsWith("$2a$") && !storedPassword.startsWith("$2b$") && !storedPassword.startsWith("$2y$")) {
    const hashed = await hashPassword(plaintext);
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashed, userId]);
    console.log(`[Security] Migrated plaintext password to bcrypt for user ${userId}`);
  }
}

export function signAdminToken(adminId: string, username: string, adminRole?: AdminRole): { accessToken: string; expiresInSeconds: number } {
  const payload: any = { sub: adminId, username, role: "admin" as const };
  if (adminRole) payload.adminRole = adminRole;
  const accessToken = jwt.sign(payload, getJwtSecret(), { expiresIn: TOKEN_EXPIRY_SECONDS });
  return { accessToken, expiresInSeconds: TOKEN_EXPIRY_SECONDS };
}

const USER_TOKEN_EXPIRY = 86400 * 7;

export function signUserToken(userId: string, username: string): { userToken: string; expiresInSeconds: number } {
  const payload = { sub: userId, username, role: "user" as const };
  const userToken = jwt.sign(payload, getJwtSecret(), { expiresIn: USER_TOKEN_EXPIRY });
  return { userToken, expiresInSeconds: USER_TOKEN_EXPIRY };
}

export function verifyUserToken(token: string): { sub: string; username: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as any;
    if (!decoded.sub) return null;
    return decoded;
  } catch {
    return null;
  }
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as AdminTokenPayload;
    if (decoded.role !== "admin") return null;
    return decoded;
  } catch {
    return null;
  }
}

const failedLoginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const SUSPICIOUS_THRESHOLD = 10;
const SUSPICIOUS_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_LOGIN_ENTRIES = 1000;

export function recordFailedLogin(identifier: string): void {
  const now = Date.now();
  if (failedLoginAttempts.size >= MAX_FAILED_LOGIN_ENTRIES) {
    for (const [key, entry] of failedLoginAttempts) {
      if (now - entry.lastAttempt > SUSPICIOUS_WINDOW_MS) {
        failedLoginAttempts.delete(key);
      }
    }
    if (failedLoginAttempts.size >= MAX_FAILED_LOGIN_ENTRIES) {
      const firstKey = failedLoginAttempts.keys().next().value;
      if (firstKey) failedLoginAttempts.delete(firstKey);
    }
  }
  const existing = failedLoginAttempts.get(identifier);
  if (existing && (now - existing.lastAttempt) < SUSPICIOUS_WINDOW_MS) {
    existing.count++;
    existing.lastAttempt = now;
    if (existing.count >= SUSPICIOUS_THRESHOLD) {
      console.warn(`[Security] Suspicious login activity detected: ${existing.count} failed attempts for "${identifier}" in ${SUSPICIOUS_WINDOW_MS / 60000} minutes`);
    }
  } else {
    failedLoginAttempts.set(identifier, { count: 1, lastAttempt: now });
  }
}

export function logSecurityAudit(action: string, details: Record<string, any>): void {
  console.log(`[SecurityAudit] ${JSON.stringify({
    timestamp: new Date().toISOString(),
    action,
    ...details,
  })}`);
}


export async function requireAdmin(req: any, res: any): Promise<any> {
  const authHeader = String(req.headers?.["authorization"] || "");
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();

    const decoded = verifyAdminToken(token);
    if (decoded) {
      const r = await pool.query("SELECT * FROM users WHERE id = $1 AND tier = 'admin'", [decoded.sub]);
      if (r.rows[0]) return r.rows[0];
    }

    const serverKey = SERVER_API_KEY();
    if (serverKey && token === serverKey) {
      return { id: "internal", username: "system", tier: "admin", admin_role: "super_admin" };
    }
  }

  res.status(401).json({ error: "Unauthorized", code: "ADMIN_UNAUTHORIZED" });
  return null;
}

export function requireAdminRole(...allowedRoles: AdminRole[]) {
  return async (req: any, res: any, next: any) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const userRole: AdminRole = admin.admin_role || admin.adminRole || "super_admin";

    if (userRole === "super_admin") {
      req.adminUser = admin;
      return next();
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: "Insufficient admin permissions",
        required: allowedRoles,
        current: userRole,
      });
    }

    req.adminUser = admin;
    next();
  };
}

export async function resolveAuthUser(req: any): Promise<any | null> {
  const authHeader = String(req.headers?.["authorization"] || "");
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    const decoded = verifyAdminToken(token);
    if (decoded) {
      const row = await getUserRowByIdCached(decoded.sub);
      if (row) return row;
    }
    const userDecoded = verifyUserToken(token);
    if (userDecoded) {
      const row = await getUserRowByIdCached(userDecoded.sub);
      if (row) return row;
    }
  }

  const userToken = String(req.headers?.["x-user-token"] || "");
  if (userToken) {
    const decoded = verifyUserToken(userToken);
    if (decoded) {
      const row = await getUserRowByIdCached(decoded.sub);
      if (row) return row;
    }
  }

  const xUsername = String(req.headers?.["x-username"] || "");
  const xPassword = String(req.headers?.["x-password"] || "");
  if (xUsername && xPassword) {
    try {
      const r = await pool.query("SELECT * FROM users WHERE username = $1", [xUsername]);
      if (r.rows[0] && r.rows[0].password) {
        const match = await verifyPassword(xPassword, r.rows[0].password);
        if (match) {
          await migratePasswordIfNeeded(r.rows[0].id, xPassword, r.rows[0].password);
          return r.rows[0];
        }
      }
    } catch {}
  }

  const xUserId = String(req.headers?.["x-user-id"] || "");
  if (xUserId) {
    const row = await getUserRowByIdCached(xUserId);
    if (row) return row;
  }

  return null;
}

function isActiveTester(user: any): boolean {
  if (!user.tester_access && !user.testerAccess) return false;
  const expiry = user.tester_expiry || user.testerExpiry;
  if (expiry && new Date(expiry) < new Date()) return false;
  return true;
}

export function requireExactTier(requiredTier: string) {
  return async (req: any, res: any, next: any) => {
    const user = await resolveAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userTier = user.tier || "free";

    if (userTier === "admin") {
      req.authUser = user;
      return next();
    }

    if (isActiveTester(user)) {
      req.authUser = user;
      return next();
    }

    if (userTier !== requiredTier) {
      return res.status(403).json({
        error: "Tier access denied",
        required: requiredTier,
        userTier,
      });
    }

    req.authUser = user;
    next();
  };
}

export function requireAnyPaidTier() {
  return async (req: any, res: any, next: any) => {
    const user = await resolveAuthUser(req);
    if (!user) {
      logPaywallAudit({
        userId: "anonymous",
        role: "anonymous",
        tier: "none",
        subscriptionStatus: "none",
        resourcePath: req.originalUrl || req.url,
        contentTier: null,
        granted: false,
      });
      return res.status(401).json({ error: "Not authenticated", code: "AUTH_REQUIRED" });
    }

    const userTier = user.tier || "free";
    const paidTiers = new Set(["rpn", "rn", "np", "allied", "imaging", "new_grad_toolkit", "certification_prep", "full_access", "admin"]);

    if (!paidTiers.has(userTier) && !isActiveTester(user)) {
      logPaywallAudit({
        userId: String(user.id),
        role: user.tier || "free",
        tier: userTier,
        subscriptionStatus: user.subscription_status || "none",
        resourcePath: req.originalUrl || req.url,
        contentTier: null,
        granted: false,
      });
      return res.status(403).json({
        error: "Premium feature - upgrade required",
        code: "PAYWALL_PREMIUM_REQUIRED",
        upgradeRequired: true,
      });
    }

    logPaywallAudit({
      userId: String(user.id),
      role: user.tier || "user",
      tier: userTier,
      subscriptionStatus: user.subscription_status || "active",
      resourcePath: req.originalUrl || req.url,
      contentTier: null,
      granted: true,
    });

    req.authUser = user;
    next();
  };
}

export interface PaywallAuditEntry {
  userId: string;
  role: string;
  tier: string;
  subscriptionStatus: string;
  resourcePath: string;
  contentTier: string | null;
  granted: boolean;
}

export function logPaywallAudit(entry: PaywallAuditEntry): void {
  let safePath = entry.resourcePath;
  try {
    const qIdx = safePath.indexOf("?");
    if (qIdx >= 0) safePath = safePath.substring(0, qIdx);
  } catch {}
  console.log(`[PaywallAudit] ${JSON.stringify({
    timestamp: new Date().toISOString(),
    userId: entry.userId,
    role: entry.role,
    subscriptionTier: entry.tier,
    subscriptionStatus: entry.subscriptionStatus,
    resourcePath: safePath,
    contentTier: entry.contentTier,
    accessGranted: entry.granted,
  })}`);
}

export async function requireInternal(req: any, res: any): Promise<boolean> {
  const authHeader = String(req.headers?.["authorization"] || "");
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    const serverKey = SERVER_API_KEY();
    if (serverKey && token === serverKey) return true;
  }
  res.status(401).json({ error: "Unauthorized" });
  return false;
}

export async function requireInternalOrAdmin(req: any, res: any): Promise<any> {
  const authHeader = String(req.headers?.["authorization"] || "");
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();

    const serverKey = SERVER_API_KEY();
    if (serverKey && token === serverKey) {
      return { id: "internal", username: "system", tier: "admin", admin_role: "super_admin" };
    }

    const decoded = verifyAdminToken(token);
    if (decoded) {
      const r = await pool.query("SELECT * FROM users WHERE id = $1 AND tier = 'admin'", [decoded.sub]);
      if (r.rows[0]) return r.rows[0];
    }
  }

  res.status(401).json({ error: "Unauthorized" });
  return null;
}

const reauthTokens = new Map<string, { adminId: string; expiresAt: number }>();
const MAX_REAUTH_TOKENS = 200;

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of reauthTokens) {
    if (now > entry.expiresAt) reauthTokens.delete(key);
  }
  for (const [key, entry] of confirmationTokens) {
    if (now > entry.expiresAt) confirmationTokens.delete(key);
  }
}, 60000);

export function signReAuthToken(adminId: string): string {
  if (reauthTokens.size >= MAX_REAUTH_TOKENS) {
    const firstKey = reauthTokens.keys().next().value;
    if (firstKey) reauthTokens.delete(firstKey);
  }
  const token = crypto.randomBytes(32).toString("hex");
  reauthTokens.set(token, { adminId, expiresAt: Date.now() + 5 * 60 * 1000 });
  return token;
}

export function verifyReAuthToken(token: string, adminId: string): boolean {
  const entry = reauthTokens.get(token);
  if (!entry) return false;
  if (entry.adminId !== adminId) return false;
  if (Date.now() > entry.expiresAt) {
    reauthTokens.delete(token);
    return false;
  }
  reauthTokens.delete(token);
  return true;
}

export function requireReAuth() {
  return async (req: any, res: any, next: any) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const reauthToken = String(req.headers?.["x-reauth-token"] || req.body?.reauthToken || "");
    if (!reauthToken || !verifyReAuthToken(reauthToken, admin.id)) {
      return res.status(403).json({
        error: "Re-authentication required for this action",
        requireReAuth: true,
      });
    }

    req.adminUser = admin;
    next();
  };
}

const confirmationTokens = new Map<string, { adminId: string; action: string; expiresAt: number; metadata?: any }>();
const MAX_CONFIRMATION_TOKENS = 200;

export function issueConfirmationToken(adminId: string, action: string, metadata?: any): string {
  if (confirmationTokens.size >= MAX_CONFIRMATION_TOKENS) {
    const firstKey = confirmationTokens.keys().next().value;
    if (firstKey) confirmationTokens.delete(firstKey);
  }
  const token = crypto.randomBytes(32).toString("hex");
  confirmationTokens.set(token, {
    adminId,
    action,
    expiresAt: Date.now() + 5 * 60 * 1000,
    metadata,
  });
  return token;
}

export function validateConfirmationToken(token: string, adminId: string, action: string): { valid: boolean; metadata?: any } {
  const entry = confirmationTokens.get(token);
  if (!entry) return { valid: false };
  if (entry.adminId !== adminId || entry.action !== action) return { valid: false };
  if (Date.now() > entry.expiresAt) {
    confirmationTokens.delete(token);
    return { valid: false };
  }
  confirmationTokens.delete(token);
  return { valid: true, metadata: entry.metadata };
}

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function csrfProtection() {
  return (req: any, res: any, next: any) => {
    if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
      return next();
    }

    const authHeader = String(req.headers?.["authorization"] || "");
    if (authHeader.startsWith("Bearer ")) {
      return next();
    }

    const cookieToken = req.cookies?.csrf_token || "";
    const headerToken = req.headers?.["x-csrf-token"] || "";

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      return res.status(403).json({ error: "CSRF token mismatch" });
    }

    next();
  };
}

const adminRateLimitStore = new Map<string, { count: number; windowStart: number }>();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of adminRateLimitStore) {
    if (now - entry.windowStart > 120000) {
      adminRateLimitStore.delete(key);
    }
  }
}, 60000);

export function adminLoginRateLimit() {
  return (req: any, res: any, next: any) => {
    const ip = req.ip || req.headers?.["x-forwarded-for"] || "unknown";
    const key = `admin_login:${ip}`;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;
    const maxAttempts = 5;

    let entry = adminRateLimitStore.get(key);
    if (!entry || now - entry.windowStart > windowMs) {
      entry = { count: 0, windowStart: now };
      adminRateLimitStore.set(key, entry);
    }

    entry.count++;

    if (entry.count > maxAttempts) {
      const retryAfter = Math.ceil((entry.windowStart + windowMs - now) / 1000);
      res.setHeader("Retry-After", String(retryAfter));
      return res.status(429).json({
        error: "Too many admin login attempts. Try again later.",
        retryAfter,
      });
    }

    next();
  };
}

export function adminApiRateLimit() {
  return (req: any, res: any, next: any) => {
    const adminUser = req.adminUser || req.authUser;
    const identifier = adminUser?.id || req.ip || "unknown";
    const key = `admin_api:${identifier}`;
    const now = Date.now();
    const windowMs = 60 * 1000;
    const maxRequests = 100;

    let entry = adminRateLimitStore.get(key);
    if (!entry || now - entry.windowStart > windowMs) {
      entry = { count: 0, windowStart: now };
      adminRateLimitStore.set(key, entry);
    }

    entry.count++;

    if (entry.count > maxRequests) {
      const retryAfter = Math.ceil((entry.windowStart + windowMs - now) / 1000);
      res.setHeader("Retry-After", String(retryAfter));
      return res.status(429).json({
        error: "Too many requests",
        retryAfter,
      });
    }

    res.setHeader("X-RateLimit-Limit", String(maxRequests));
    res.setHeader("X-RateLimit-Remaining", String(Math.max(0, maxRequests - entry.count)));
    next();
  };
}

export async function logAdminAudit(req: any, actor: any, action: string, entityType: string, entityId: string | null, beforeState?: any, afterState?: any, reason?: string, severity?: string) {
  try {
    await pool.query(
      `INSERT INTO audit_logs (id, actor_id, actor_username, entity_type, entity_id, action, before_json, after_json, reason, severity, ip_address, user_agent, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())`,
      [
        actor?.id || null,
        actor?.username || null,
        entityType,
        entityId,
        action,
        beforeState ? JSON.stringify(beforeState) : null,
        afterState ? JSON.stringify(afterState) : null,
        reason || null,
        severity || "info",
        req.ip || req.headers?.["x-forwarded-for"] || null,
        req.headers?.["user-agent"] || null,
      ]
    );
  } catch (e) {
    console.error("[AdminAudit] Failed to log:", e);
  }
}

export async function logAuditAction(opts: {
  req?: any;
  actor: { id: string; username: string } | null;
  action: string;
  entityType: string;
  entityId: string | null;
  reason?: string;
  metadata?: Record<string, any>;
  before?: any;
  after?: any;
}): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO audit_logs (id, actor_id, actor_username, entity_type, entity_id, action, before_json, after_json, reason, metadata, ip_address, user_agent, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())`,
      [
        opts.actor?.id || null,
        opts.actor?.username || null,
        opts.entityType,
        opts.entityId,
        opts.action,
        opts.before ? JSON.stringify(opts.before) : null,
        opts.after ? JSON.stringify(opts.after) : null,
        opts.reason || null,
        opts.metadata ? JSON.stringify(opts.metadata) : null,
        opts.req?.ip || opts.req?.headers?.["x-forwarded-for"] || null,
        opts.req?.headers?.["user-agent"] || null,
      ]
    );
  } catch (e) {
    console.error("[AuditAction] Failed to log:", e);
  }
}

export interface OperatorActionParams {
  req: any;
  actor: any;
  action: string;
  actionCategory: string;
  entityType: string;
  entityId?: string | null;
  targetType?: string | null;
  targetId?: string | null;
  reason?: string | null;
  confirmationRequired?: boolean;
  beforeState?: any;
  afterState?: any;
}

export async function logOperatorAction(params: OperatorActionParams): Promise<void> {
  const {
    req, actor, action, actionCategory, entityType,
    entityId = null, targetType = null, targetId = null,
    reason = null, confirmationRequired = false,
    beforeState, afterState,
  } = params;
  try {
    await pool.query(
      `INSERT INTO audit_logs (
        id, actor_id, actor_username, actor_role,
        entity_type, entity_id, action, action_category,
        target_type, target_id, reason, confirmation_required,
        before_json, after_json, ip_address, user_agent, created_at
      ) VALUES (
        gen_random_uuid(), $1, $2, $3,
        $4, $5, $6, $7,
        $8, $9, $10, $11,
        $12, $13, $14, $15, NOW()
      )`,
      [
        actor?.id || null,
        actor?.username || null,
        actor?.admin_role || actor?.adminRole || "super_admin",
        entityType,
        entityId,
        action,
        actionCategory,
        targetType,
        targetId,
        reason,
        confirmationRequired,
        beforeState ? JSON.stringify(beforeState) : null,
        afterState ? JSON.stringify(afterState) : null,
        req.ip || req.headers?.["x-forwarded-for"] || null,
        req.headers?.["user-agent"] || null,
      ]
    );
  } catch (e) {
    console.error("[OperatorAudit] Failed to log:", e);
  }
}

const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: ["*"],
  support_admin: [
    "subscriber_management",
    "rescue_link",
    "communication",
    "billing",
    "backup_access",
    "read_dashboards",
    "read_audit_logs",
  ],
  content_admin: [
    "content_management",
    "version_control",
    "feature_flag",
    "read_dashboards",
    "read_audit_logs",
  ],
  ops_viewer: [
    "read_dashboards",
    "read_audit_logs",
  ],
  analytics_viewer: [
    "read_dashboards",
    "read_audit_logs",
  ],
};

export function hasPermission(role: AdminRole | string, actionCategory: string): boolean {
  if (role === "super_admin") return true;
  const perms: string[] = ROLE_PERMISSIONS[role] || [];
  if (perms.includes("*")) return true;
  return perms.includes(actionCategory);
}

export function requirePermission(actionCategory: string) {
  return async (req: any, res: any, next: any) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const userRole: AdminRole = admin.admin_role || admin.adminRole || "super_admin";

    if (!hasPermission(userRole, actionCategory)) {
      return res.status(403).json({
        error: "Insufficient permissions for this action",
        requiredPermission: actionCategory,
        currentRole: userRole,
      });
    }

    req.adminUser = admin;
    next();
  };
}

export function requireDestructiveAction(actionCategory: string) {
  return async (req: any, res: any, next: any) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const userRole: AdminRole = admin.admin_role || admin.adminRole || "super_admin";

    if (!hasPermission(userRole, actionCategory)) {
      return res.status(403).json({
        error: "Insufficient permissions for this action",
        requiredPermission: actionCategory,
        currentRole: userRole,
      });
    }

    const confirmToken = String(req.headers?.["x-confirmation-token"] || req.body?.confirmationToken || "");
    if (!confirmToken) {
      const token = issueConfirmationToken(admin.id, actionCategory);
      return res.status(428).json({
        error: "Destructive action requires confirmation",
        confirmationToken: token,
        action: actionCategory,
        message: "Re-submit with the provided confirmationToken to proceed",
      });
    }

    const validation = validateConfirmationToken(confirmToken, admin.id, actionCategory);
    if (!validation.valid) {
      return res.status(403).json({
        error: "Invalid or expired confirmation token",
      });
    }

    req.adminUser = admin;
    req.confirmationValidated = true;
    next();
  };
}
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of reauthTokens) {
    if (now > entry.expiresAt) reauthTokens.delete(key);
  }
  for (const [key, entry] of confirmationTokens) {
    if (now > entry.expiresAt) confirmationTokens.delete(key);
  }
}, 60000);
