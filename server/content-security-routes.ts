import type { Express, Request, Response, NextFunction } from "express";
import { pool } from "./storage";
import { requireAdmin, resolveAuthUser } from "./admin-auth";
import { CONTENT_SECURITY_CONFIG } from "./content-security-config";
import { getAbuseStats, manualUnblockIp, manualUnblockUser, manualBlockIp } from "./abuse-protection";
import crypto from "crypto";

function getClientIp(req: Request): string {
  return String(req.headers["x-forwarded-for"] || req.ip || "unknown").split(",")[0].trim();
}

function maskEmail(email: string | null | undefined): string {
  if (!email) return "user***";
  const [local, domain] = email.split("@");
  if (!domain) return email.slice(0, 2) + "***";
  const maskedLocal = local.slice(0, 2) + "***";
  return `${maskedLocal}@${domain}`;
}

function getUserIdSuffix(userId: string): string {
  return userId.slice(-6);
}

async function logSecurityEvent(
  userId: string | null,
  ip: string,
  endpoint: string,
  eventType: string,
  requestCount: number = 1,
  metadata: Record<string, any> = {}
): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO security_audit_logs (id, user_id, ip_address, endpoint, event_type, request_count, metadata, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW())`,
      [userId, ip, endpoint, eventType, requestCount, JSON.stringify(metadata)]
    );
  } catch (e: any) {
    console.error("[ContentSecurity] Audit log error:", e.message);
  }
}

const userRequestTrackers = new Map<string, { timestamps: number[]; blocked: boolean; blockedUntil: number }>();
const MAX_REQUEST_TRACKERS = 500;

function cleanupTrackers(): void {
  const now = Date.now();
  for (const [key, tracker] of userRequestTrackers.entries()) {
    if (tracker.blocked && tracker.blockedUntil < now) {
      tracker.blocked = false;
    }
    tracker.timestamps = tracker.timestamps.filter(
      (t) => now - t < CONTENT_SECURITY_CONFIG.rateLimits.premiumContentWindowMs
    );
    if (tracker.timestamps.length === 0 && !tracker.blocked) {
      userRequestTrackers.delete(key);
    }
  }
  if (userRequestTrackers.size > MAX_REQUEST_TRACKERS) {
    let toDelete = userRequestTrackers.size - MAX_REQUEST_TRACKERS;
    for (const key of userRequestTrackers.keys()) {
      if (toDelete <= 0) break;
      userRequestTrackers.delete(key);
      toDelete--;
    }
  }
}

setInterval(cleanupTrackers, 60000);

export function premiumContentRateLimiter(req: Request, res: Response, next: NextFunction): void {
  if (!CONTENT_SECURITY_CONFIG.featureEnabled) {
    next();
    return;
  }

  const userId = (req as any).authUser?.id;
  const ip = getClientIp(req);
  const key = userId || ip;
  const now = Date.now();

  let tracker = userRequestTrackers.get(key);
  if (!tracker) {
    tracker = { timestamps: [], blocked: false, blockedUntil: 0 };
    userRequestTrackers.set(key, tracker);
  }

  if (tracker.blocked && tracker.blockedUntil > now) {
    logSecurityEvent(userId, ip, req.path, "rate_limit_blocked", 0, { reason: "still_blocked" });
    res.status(429).json({ error: "Too many requests. Please try again later.", retryAfter: Math.ceil((tracker.blockedUntil - now) / 1000) });
    return;
  }

  if (tracker.blocked && tracker.blockedUntil <= now) {
    tracker.blocked = false;
  }

  tracker.timestamps.push(now);
  tracker.timestamps = tracker.timestamps.filter(
    (t) => now - t < CONTENT_SECURITY_CONFIG.rateLimits.premiumContentWindowMs
  );

  if (tracker.timestamps.length > CONTENT_SECURITY_CONFIG.rateLimits.premiumContentMaxRequests) {
    tracker.blocked = true;
    tracker.blockedUntil = now + CONTENT_SECURITY_CONFIG.rateLimits.blockDurationMs;
    logSecurityEvent(userId, ip, req.path, "rate_limit_exceeded", tracker.timestamps.length, {
      threshold: CONTENT_SECURITY_CONFIG.rateLimits.premiumContentMaxRequests,
    });
    res.status(429).json({ error: "Rate limit exceeded. You have been temporarily blocked.", retryAfter: Math.ceil(CONTENT_SECURITY_CONFIG.rateLimits.blockDurationMs / 1000) });
    return;
  }

  const rapidWindow = CONTENT_SECURITY_CONFIG.rateLimits.rapidRequestWindowMs;
  const rapidThreshold = CONTENT_SECURITY_CONFIG.rateLimits.rapidRequestThreshold;
  const recentRequests = tracker.timestamps.filter((t) => now - t < rapidWindow);
  if (recentRequests.length >= rapidThreshold) {
    logSecurityEvent(userId, ip, req.path, "rapid_request_detected", recentRequests.length, {
      windowMs: rapidWindow,
      threshold: rapidThreshold,
    });
    tracker.blocked = true;
    tracker.blockedUntil = now + CONTENT_SECURITY_CONFIG.rateLimits.blockDurationMs;
    res.status(429).json({ error: "Suspicious activity detected. Access temporarily restricted." });
    return;
  }

  next();
}

async function checkAndIncrementDailyUsage(
  userId: string,
  userTier: string,
  contentType: string
): Promise<{ allowed: boolean; current: number; limit: number }> {
  const today = new Date().toISOString().slice(0, 10);

  const tierKey = userTier === "free" ? "free" : "trial";
  const limits = CONTENT_SECURITY_CONFIG.dailyLimits[tierKey as keyof typeof CONTENT_SECURITY_CONFIG.dailyLimits];
  if (!limits) return { allowed: true, current: 0, limit: 999 };

  const limitMap: Record<string, number> = {
    questions: limits.questionsViewed,
    flashcards: limits.flashcardsOpened,
    lessons: limits.lessonsAccessed,
  };

  const dailyLimit = limitMap[contentType];
  if (!dailyLimit) return { allowed: true, current: 0, limit: 999 };

  const result = await pool.query(
    `INSERT INTO content_access_counters (id, user_id, content_type, access_date, count)
     VALUES (gen_random_uuid(), $1, $2, $3, 1)
     ON CONFLICT (user_id, content_type, access_date) DO UPDATE SET count = content_access_counters.count + 1
     RETURNING count`,
    [userId, contentType, today]
  );

  const currentCount = result.rows[0]?.count || 1;
  if (currentCount > dailyLimit) {
    return { allowed: false, current: currentCount, limit: dailyLimit };
  }
  return { allowed: true, current: currentCount, limit: dailyLimit };
}

export function registerContentSecurityRoutes(app: Express): void {
  app.use("/api/qbank", premiumContentRateLimiter);
  app.use("/api/lessons", premiumContentRateLimiter);

  app.get("/api/content-security/watermark", async (req, res) => {
    try {
      const user = await resolveAuthUser(req);
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      if (!CONTENT_SECURITY_CONFIG.featureEnabled) {
        return res.json({ enabled: false });
      }

      const ip = getClientIp(req);
      const maskedMail = maskEmail(user.email);
      const idSuffix = getUserIdSuffix(user.id);
      const sessionTimestamp = new Date().toISOString().slice(0, 16).replace("T", " ");
      const watermarkText = `${maskedMail} | ${idSuffix} | ${sessionTimestamp}`;

      const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

      await pool.query(
        `INSERT INTO watermark_sessions (id, user_id, masked_email, user_id_suffix, ip_address, user_agent, created_at, expires_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), $6)`,
        [user.id, maskedMail, idSuffix, ip, req.headers["user-agent"] || "", expiresAt]
      );

      const payload = {
        enabled: true,
        text: watermarkText,
        opacity: CONTENT_SECURITY_CONFIG.watermark.opacity,
        rotation: CONTENT_SECURITY_CONFIG.watermark.rotationDeg,
        fontSize: CONTENT_SECURITY_CONFIG.watermark.fontSize,
        spacing: CONTENT_SECURITY_CONFIG.watermark.spacing,
        hash: crypto.createHash("sha256").update(watermarkText + user.id).digest("hex").slice(0, 12),
      };

      res.json(payload);
    } catch (e: any) {
      console.error("[ContentSecurity] Watermark error:", e.message);
      res.status(500).json({ error: "Failed to generate watermark" });
    }
  });

  app.get("/api/content-security/config", async (req, res) => {
    res.json({
      featureEnabled: CONTENT_SECURITY_CONFIG.featureEnabled,
      watermarkOpacity: CONTENT_SECURITY_CONFIG.watermark.opacity,
    });
  });

  app.get("/api/content-security/usage", async (req, res) => {
    try {
      const user = await resolveAuthUser(req);
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const today = new Date().toISOString().slice(0, 10);
      const result = await pool.query(
        `SELECT content_type, count FROM content_access_counters
         WHERE user_id = $1 AND access_date = $2`,
        [user.id, today]
      );

      const userTier = user.tier || "free";
      const paidTiers = new Set(["rpn", "rn", "np", "admin"]);
      const isPaid = paidTiers.has(userTier);

      const tierKey = userTier === "free" ? "free" : "trial";
      const limits = isPaid ? null : CONTENT_SECURITY_CONFIG.dailyLimits[tierKey as keyof typeof CONTENT_SECURITY_CONFIG.dailyLimits];

      const usage: Record<string, { current: number; limit: number | null }> = {};
      for (const row of result.rows) {
        const limitMap: Record<string, number> = limits
          ? { questions: limits.questionsViewed, flashcards: limits.flashcardsOpened, lessons: limits.lessonsAccessed }
          : {};
        usage[row.content_type] = {
          current: row.count,
          limit: isPaid ? null : (limitMap[row.content_type] ?? null),
        };
      }

      res.json({ usage, isPaid, tier: userTier });
    } catch (e: any) {
      res.status(500).json({ error: "Failed to get usage" });
    }
  });

  app.post("/api/content-security/check-access", async (req, res) => {
    try {
      const user = await resolveAuthUser(req);
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { contentType } = req.body;
      if (!contentType || !["questions", "flashcards", "lessons"].includes(contentType)) {
        return res.status(400).json({ error: "Invalid contentType" });
      }

      const userTier = user.tier || "free";
      const paidTiers = new Set(["rpn", "rn", "np", "admin"]);
      if (paidTiers.has(userTier)) {
        return res.json({ allowed: true, isPaid: true });
      }

      const ip = getClientIp(req);
      const result = await checkAndIncrementDailyUsage(user.id, userTier, contentType);

      if (!result.allowed) {
        await logSecurityEvent(user.id, ip, req.path, "daily_limit_reached", result.current, {
          contentType,
          limit: result.limit,
          tier: userTier,
        });
      }

      res.json({
        allowed: result.allowed,
        current: result.current,
        limit: result.limit,
        isPaid: false,
        upgradeRequired: !result.allowed,
      });
    } catch (e: any) {
      res.status(500).json({ error: "Failed to check access" });
    }
  });

  app.get("/api/admin/content-security/dashboard", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const watermarkStats = await pool.query(`
        SELECT COUNT(*)::int AS total_sessions,
          COUNT(DISTINCT user_id)::int AS unique_users,
          COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours')::int AS last_24h
        FROM watermark_sessions
      `);

      const scrapingAttempts = await pool.query(`
        SELECT COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours')::int AS last_24h,
          COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')::int AS last_7d
        FROM security_audit_logs
        WHERE event_type IN ('rate_limit_exceeded', 'rapid_request_detected')
      `);

      const blockedIps = await pool.query(`
        SELECT ip_address, COUNT(*)::int AS incident_count,
          MAX(created_at) AS last_seen
        FROM security_audit_logs
        WHERE event_type IN ('rate_limit_exceeded', 'rapid_request_detected', 'rate_limit_blocked')
        GROUP BY ip_address
        ORDER BY incident_count DESC
        LIMIT 20
      `);

      const suspiciousSessions = await pool.query(`
        SELECT user_id, ip_address, endpoint, event_type, request_count, metadata, created_at
        FROM security_audit_logs
        WHERE event_type IN ('rate_limit_exceeded', 'rapid_request_detected', 'daily_limit_reached')
        ORDER BY created_at DESC
        LIMIT 50
      `);

      const trialAbuse = await pool.query(`
        SELECT sal.user_id, sal.ip_address, sal.metadata, sal.created_at,
          u.username, u.email, u.tier
        FROM security_audit_logs sal
        LEFT JOIN users u ON u.id = sal.user_id
        WHERE sal.event_type = 'daily_limit_reached'
        ORDER BY sal.created_at DESC
        LIMIT 30
      `);

      const recentWatermarks = await pool.query(`
        SELECT ws.id, ws.user_id, ws.masked_email, ws.user_id_suffix,
          ws.ip_address, ws.created_at, u.username, u.tier
        FROM watermark_sessions ws
        LEFT JOIN users u ON u.id = ws.user_id
        ORDER BY ws.created_at DESC
        LIMIT 30
      `);

      res.json({
        watermarkSessions: {
          ...watermarkStats.rows[0],
          recent: recentWatermarks.rows,
        },
        scrapingAttempts: scrapingAttempts.rows[0],
        blockedIps: blockedIps.rows,
        suspiciousSessions: suspiciousSessions.rows,
        trialAbuse: trialAbuse.rows,
      });
    } catch (e: any) {
      console.error("[ContentSecurity] Dashboard error:", e.message);
      res.status(500).json({ error: "Failed to load dashboard" });
    }
  });

  app.post("/api/admin/content-security/flag-user", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { userId, action } = req.body;
      if (!userId || !["flag", "suspend", "unflag"].includes(action)) {
        return res.status(400).json({ error: "userId and valid action required" });
      }

      const ip = getClientIp(req);

      if (action === "suspend") {
        await pool.query(
          `UPDATE users SET tier = 'free', subscription_status = 'suspended' WHERE id = $1`,
          [userId]
        );
      }

      await logSecurityEvent(admin.id, ip, "/api/admin/content-security/flag-user", `admin_${action}_user`, 1, {
        targetUserId: userId,
        adminUsername: admin.username,
      });

      res.json({ ok: true, action, userId });
    } catch (e: any) {
      res.status(500).json({ error: "Failed to flag user" });
    }
  });

  app.get("/api/admin/content-security/abuse-overview", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const rateLimitHitsByCategory = await pool.query(`
        SELECT
          CASE
            WHEN endpoint LIKE '/api/ai/%' THEN 'AI Generation'
            WHEN endpoint LIKE '/api/paramedic/%' OR endpoint LIKE '/api/imaging/%' OR endpoint LIKE '/api/mlt/%' OR endpoint LIKE '/api/pharmtech/%' THEN 'Exam Sessions'
            WHEN endpoint LIKE '/api/practice-sessions%' OR endpoint LIKE '/api/adaptive%' THEN 'Practice Sessions'
            WHEN endpoint LIKE '/api/newgrad/%' OR endpoint LIKE '/api/new-grad/%' THEN 'New Grad'
            WHEN endpoint LIKE '/api/lessons/%' THEN 'Lessons'
            WHEN endpoint LIKE '/api/encyclopedia%' THEN 'Encyclopedia'
            WHEN endpoint LIKE '/api/auth/%' THEN 'Authentication'
            WHEN endpoint LIKE '/api/qbank%' THEN 'Question Bank'
            ELSE 'Other'
          END AS category,
          COUNT(*)::int AS hit_count,
          COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours')::int AS last_24h,
          COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')::int AS last_7d
        FROM security_audit_logs
        WHERE event_type IN ('abuse_warning', 'abuse_temp_block', 'abuse_extended_block', 'rate_limit_exceeded', 'rapid_request_detected', 'bot_heuristic_flag', 'bot_auto_blocked')
        GROUP BY category
        ORDER BY hit_count DESC
      `);

      const topOffendingIps24h = await pool.query(`
        SELECT ip_address, COUNT(*)::int AS incident_count,
          MAX(created_at) AS last_seen,
          array_agg(DISTINCT event_type) AS event_types
        FROM security_audit_logs
        WHERE event_type IN ('abuse_warning', 'abuse_temp_block', 'abuse_extended_block', 'rate_limit_exceeded', 'rapid_request_detected', 'bot_heuristic_flag', 'bot_auto_blocked')
          AND created_at > NOW() - INTERVAL '24 hours'
        GROUP BY ip_address
        ORDER BY incident_count DESC
        LIMIT 20
      `);

      const topOffendingIps7d = await pool.query(`
        SELECT ip_address, COUNT(*)::int AS incident_count,
          MAX(created_at) AS last_seen,
          array_agg(DISTINCT event_type) AS event_types
        FROM security_audit_logs
        WHERE event_type IN ('abuse_warning', 'abuse_temp_block', 'abuse_extended_block', 'rate_limit_exceeded', 'rapid_request_detected', 'bot_heuristic_flag', 'bot_auto_blocked')
          AND created_at > NOW() - INTERVAL '7 days'
        GROUP BY ip_address
        ORDER BY incident_count DESC
        LIMIT 20
      `);

      const topOffendingUsers24h = await pool.query(`
        SELECT sal.user_id, COUNT(*)::int AS incident_count,
          MAX(sal.created_at) AS last_seen,
          array_agg(DISTINCT sal.event_type) AS event_types,
          u.username, u.email, u.tier
        FROM security_audit_logs sal
        LEFT JOIN users u ON u.id = sal.user_id
        WHERE sal.event_type IN ('abuse_warning', 'abuse_temp_block', 'abuse_extended_block', 'rate_limit_exceeded', 'rapid_request_detected')
          AND sal.created_at > NOW() - INTERVAL '24 hours'
          AND sal.user_id IS NOT NULL
        GROUP BY sal.user_id, u.username, u.email, u.tier
        ORDER BY incident_count DESC
        LIMIT 20
      `);

      const recentEscalations = await pool.query(`
        SELECT user_id, ip_address, endpoint, event_type, request_count, metadata, created_at
        FROM security_audit_logs
        WHERE event_type IN ('abuse_warning', 'abuse_temp_block', 'abuse_extended_block', 'bot_auto_blocked')
        ORDER BY created_at DESC
        LIMIT 50
      `);

      const inMemoryStats = getAbuseStats();

      res.json({
        rateLimitHitsByCategory: rateLimitHitsByCategory.rows,
        topOffendingIps: {
          last24h: topOffendingIps24h.rows,
          last7d: topOffendingIps7d.rows,
        },
        topOffendingUsers: topOffendingUsers24h.rows,
        recentEscalations: recentEscalations.rows,
        activeBlocks: inMemoryStats.activeBlocks,
        manualBlocks: inMemoryStats.manualBlocks,
      });
    } catch (e: any) {
      console.error("[ContentSecurity] Abuse overview error:", e.message);
      res.status(500).json({ error: "Failed to load abuse overview" });
    }
  });

  app.post("/api/admin/content-security/unblock", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { target, type } = req.body;
      if (!target || !["ip", "user"].includes(type)) {
        return res.status(400).json({ error: "target and type (ip or user) required" });
      }

      let unblocked = false;
      if (type === "ip") {
        unblocked = manualUnblockIp(target);
      } else {
        unblocked = manualUnblockUser(target);
      }

      const ip = getClientIp(req);
      await logSecurityEvent(admin.id, ip, "/api/admin/content-security/unblock", "admin_unblock", 1, {
        target,
        type,
        adminUsername: admin.username,
      });

      res.json({ ok: true, unblocked, target, type });
    } catch (e: any) {
      res.status(500).json({ error: "Failed to unblock" });
    }
  });

  app.post("/api/admin/content-security/block-ip", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { ip: targetIp, durationMinutes = 60, reason = "admin_manual_block" } = req.body;
      if (!targetIp) {
        return res.status(400).json({ error: "ip is required" });
      }

      manualBlockIp(targetIp, durationMinutes * 60 * 1000, reason);

      const adminIp = getClientIp(req);
      await logSecurityEvent(admin.id, adminIp, "/api/admin/content-security/block-ip", "admin_block_ip", 1, {
        targetIp,
        durationMinutes,
        reason,
        adminUsername: admin.username,
      });

      res.json({ ok: true, ip: targetIp, durationMinutes, reason });
    } catch (e: any) {
      res.status(500).json({ error: "Failed to block IP" });
    }
  });
}

export { checkAndIncrementDailyUsage, logSecurityEvent };
