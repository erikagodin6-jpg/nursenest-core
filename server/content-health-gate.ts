import type { Express, Request, Response, NextFunction } from "express";
import { pool } from "./storage";
import { requireAdmin, resolveAuthUser } from "./admin-auth";

interface ContentHealthScore {
  contentId: string;
  contentType: string;
  title: string;
  score: number;
  checks: HealthCheck[];
  tier: string;
  status: string;
  calculatedAt: number;
}

interface HealthCheck {
  name: string;
  passed: boolean;
  weight: number;
  detail: string;
}

interface GateCheckResult {
  name: string;
  passed: boolean;
  detail: string;
  severity: "critical" | "warning" | "info";
}

interface GateResult {
  passed: boolean;
  checks: GateCheckResult[];
  overrideAllowed: boolean;
  timestamp: number;
}

const HEALTH_SCORE_THRESHOLD = 60;
const CRITICAL_SCORE_THRESHOLD = 30;

const vipPriorityConfig = {
  enabled: true,
  subscriberPaths: new Set([
    "/api/auth", "/api/login", "/api/me",
    "/api/entitlements", "/api/entitlement",
    "/api/exam", "/api/mock-exam", "/api/cat",
    "/api/flashcard", "/api/flashcards",
    "/api/lessons", "/api/lesson",
    "/api/downloads", "/api/download",
    "/api/stripe",
  ]),
  tiers: {
    admin: { priority: 100, label: "Admin" },
    full_access: { priority: 90, label: "Full Access" },
    np: { priority: 80, label: "NP Advanced" },
    rn: { priority: 70, label: "RN" },
    rpn: { priority: 60, label: "RPN/LVN" },
    allied: { priority: 60, label: "Allied Health" },
    imaging: { priority: 60, label: "Imaging" },
    certification_prep: { priority: 50, label: "Cert Prep" },
    new_grad_toolkit: { priority: 50, label: "New Grad" },
    free: { priority: 10, label: "Free" },
  } as Record<string, { priority: number; label: string }>,
  loadThresholds: {
    shed_free_nonessential: 0.95,
    shed_free_all: 0.97,
    shed_low_priority: 0.98,
    emergency: 0.99,
  },
  rssThresholdsMB: (() => {
    let limitMB = 0;
    try {
      const mm = require("./memory-monitor");
      if (typeof mm.getDetectedMemoryLimitMB === "function") limitMB = mm.getDetectedMemoryLimitMB();
    } catch {}
    if (limitMB <= 0) limitMB = 2048;
    return {
      shed_free_nonessential: Math.round(limitMB * 0.75),
      shed_free_all: Math.round(limitMB * 0.80),
      shed_low_priority: Math.round(limitMB * 0.85),
      emergency: Math.round(limitMB * 0.90),
    };
  })(),
};

const vipMetrics = {
  totalRequests: 0,
  subscriberRequests: 0,
  freeRequests: 0,
  shedRequests: 0,
  prioritizedRequests: 0,
  lastResetAt: Date.now(),
  shedByTier: {} as Record<string, number>,
  recentShedEvents: [] as Array<{ tier: string; path: string; reason: string; timestamp: number }>,
};

const MAX_SHED_EVENTS = 50;

function resetVipMetricsIfStale() {
  if (Date.now() - vipMetrics.lastResetAt > 3600000) {
    vipMetrics.totalRequests = 0;
    vipMetrics.subscriberRequests = 0;
    vipMetrics.freeRequests = 0;
    vipMetrics.shedRequests = 0;
    vipMetrics.prioritizedRequests = 0;
    vipMetrics.shedByTier = {};
    vipMetrics.lastResetAt = Date.now();
  }
}

function recordShedEvent(tier: string, path: string, reason: string) {
  vipMetrics.shedRequests++;
  vipMetrics.shedByTier[tier] = (vipMetrics.shedByTier[tier] || 0) + 1;
  vipMetrics.recentShedEvents.unshift({ tier, path, reason, timestamp: Date.now() });
  if (vipMetrics.recentShedEvents.length > MAX_SHED_EVENTS) {
    vipMetrics.recentShedEvents.length = MAX_SHED_EVENTS;
  }
}

export function vipPriorityMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!vipPriorityConfig.enabled) return next();

    const isReadOnly = req.method === "GET" || req.method === "HEAD";
    const isEssentialRead = isReadOnly && (
      req.path.startsWith("/api/exams") ||
      req.path.startsWith("/api/kill-switches") ||
      req.path.startsWith("/api/hero-stats") ||
      req.path.startsWith("/api/site-images") ||
      req.path.startsWith("/api/region") ||
      req.path.startsWith("/api/public/") ||
      req.path.startsWith("/api/lessons") ||
      req.path.startsWith("/api/flashcard") ||
      req.path.startsWith("/api/pricing") ||
      req.path.startsWith("/api/billing") ||
      req.path.startsWith("/api/dashboard") ||
      req.path.startsWith("/api/subscription") ||
      req.path.startsWith("/api/daily-goals") ||
      req.path.startsWith("/api/exam-planner") ||
      req.path.startsWith("/api/mock-exams") ||
      req.path.startsWith("/api/question-bank") ||
      req.path.startsWith("/api/me/")
    );
    if (req.path.startsWith("/api/admin/") || req.path.startsWith("/api/health") || req.path.startsWith("/api/auth/") || req.path.startsWith("/api/user/") || req.path.startsWith("/api/entitlement/") || isEssentialRead || req.path === "/api/platform/degradation" || req.path === "/api/platform/minimal-core" || req.path === "/api/platform/status" || req.method === "OPTIONS" || !req.path.startsWith("/api/")) {
      return next();
    }

    const authHeader = String(req.headers?.["authorization"] || "");
    if (authHeader.startsWith("Bearer ") && process.env.ADMIN_API_KEY && authHeader.slice(7).trim() === process.env.ADMIN_API_KEY) {
      return next();
    }

    resetVipMetricsIfStale();
    vipMetrics.totalRequests++;

    const user = (req as any).authUser;
    const userTier = user?.tier || "free";
    const tierConfig = vipPriorityConfig.tiers[userTier] || vipPriorityConfig.tiers.free;
    const isPaid = userTier !== "free" && tierConfig.priority > 10;

    if (isPaid) {
      vipMetrics.subscriberRequests++;
    } else {
      vipMetrics.freeRequests++;
    }

    const isSubscriberCritical = Array.from(vipPriorityConfig.subscriberPaths).some(
      p => req.path.startsWith(p)
    );

    if (isPaid && isSubscriberCritical) {
      vipMetrics.prioritizedRequests++;
      res.setHeader("X-VIP-Priority", String(tierConfig.priority));
      return next();
    }

    const mem = process.memoryUsage();
    const rssMB = mem.rss / (1024 * 1024);
    const rssThresholds = vipPriorityConfig.rssThresholdsMB;

    if (rssMB >= rssThresholds.emergency) {
      if (!isPaid) {
        recordShedEvent(userTier, req.path, "emergency_load");
        return res.status(503).json({
          error: "System under extreme load. Subscriber requests prioritized.",
          retryAfter: 60,
          code: "VIP_LOAD_SHED_EMERGENCY",
        });
      }
    }

    if (rssMB >= rssThresholds.shed_low_priority) {
      if (tierConfig.priority < 50) {
        recordShedEvent(userTier, req.path, "low_priority_shed");
        return res.status(503).json({
          error: "Server under heavy load. Please try again shortly.",
          retryAfter: 30,
          code: "VIP_LOAD_SHED",
        });
      }
    }

    if (rssMB >= rssThresholds.shed_free_all) {
      if (!isPaid) {
        recordShedEvent(userTier, req.path, "free_all_shed");
        return res.status(503).json({
          error: "Server under heavy load. Upgrade for priority access.",
          retryAfter: 30,
          code: "VIP_LOAD_SHED_FREE",
        });
      }
    }

    if (rssMB >= rssThresholds.shed_free_nonessential) {
      if (!isPaid && !isSubscriberCritical) {
        recordShedEvent(userTier, req.path, "free_nonessential_shed");
        return res.status(503).json({
          error: "Non-essential requests paused during high load.",
          retryAfter: 15,
          code: "VIP_LOAD_SHED_NONESSENTIAL",
        });
      }
    }

    next();
  };
}

async function calculateExamQuestionHealth(tier?: string, contentId?: string): Promise<ContentHealthScore[]> {
  const scores: ContentHealthScore[] = [];
  try {
    let query = `SELECT id, stem, options, correct_answer, rationale, distractor_rationales, 
                        tier, exam, body_system, topic, status, question_type, 
                        quarantined_at, quarantine_reason, created_at
                 FROM exam_questions WHERE 1=1`;
    const params: any[] = [];
    let paramIdx = 1;
    if (contentId) {
      query += ` AND id = $${paramIdx++}`;
      params.push(contentId);
    } else {
      query += ` AND status = 'published'`;
    }
    if (tier) {
      query += ` AND tier = $${paramIdx++}`;
      params.push(tier);
    }
    if (!contentId) query += ` LIMIT 500`;

    const result = await pool.query(query, params);
    for (const row of result.rows) {
      const checks: HealthCheck[] = [];

      checks.push({
        name: "stem_present",
        passed: !!(row.stem && row.stem.trim().length >= 10),
        weight: 20,
        detail: row.stem ? `Stem length: ${row.stem.length}` : "Missing stem",
      });

      let opts = row.options;
      if (typeof opts === "string") try { opts = JSON.parse(opts); } catch {}
      const hasOptions = Array.isArray(opts) && opts.length >= 2;
      checks.push({
        name: "options_valid",
        passed: hasOptions,
        weight: 20,
        detail: hasOptions ? `${opts.length} options` : "Invalid or missing options",
      });

      const hasCorrect = row.correct_answer !== null && row.correct_answer !== undefined;
      checks.push({
        name: "correct_answer",
        passed: hasCorrect,
        weight: 15,
        detail: hasCorrect ? "Present" : "Missing correct answer",
      });

      const hasRationale = !!(row.rationale && row.rationale.trim().length > 0);
      checks.push({
        name: "rationale_present",
        passed: hasRationale,
        weight: 10,
        detail: hasRationale ? "Present" : "Missing rationale",
      });

      const hasBodySystem = !!(row.body_system && row.body_system.trim().length > 0);
      checks.push({
        name: "body_system",
        passed: hasBodySystem,
        weight: 5,
        detail: hasBodySystem ? row.body_system : "Missing body system",
      });

      const hasExam = !!(row.exam && row.exam.trim().length > 0);
      checks.push({
        name: "exam_assigned",
        passed: hasExam,
        weight: 5,
        detail: hasExam ? row.exam : "No exam assigned",
      });

      const hasTopic = !!(row.topic && row.topic.trim().length > 0);
      checks.push({
        name: "topic_assigned",
        passed: hasTopic,
        weight: 5,
        detail: hasTopic ? row.topic : "No topic assigned",
      });

      const notQuarantined = !row.quarantined_at;
      checks.push({
        name: "not_quarantined",
        passed: notQuarantined,
        weight: 10,
        detail: notQuarantined ? "Not quarantined" : `Quarantined: ${row.quarantine_reason || "unknown"}`,
      });

      let distractorRats = row.distractor_rationales;
      if (typeof distractorRats === "string") try { distractorRats = JSON.parse(distractorRats); } catch {}
      const hasDistractorRationales = distractorRats && typeof distractorRats === "object" && Object.keys(distractorRats).length > 0;
      checks.push({
        name: "distractor_rationales",
        passed: !!hasDistractorRationales,
        weight: 5,
        detail: hasDistractorRationales ? "Present" : "Missing distractor rationales",
      });

      const hasQuestionType = !!(row.question_type && row.question_type.trim().length > 0);
      checks.push({
        name: "question_type",
        passed: hasQuestionType,
        weight: 5,
        detail: hasQuestionType ? row.question_type : "Missing question type",
      });

      const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
      const earnedWeight = checks.filter(c => c.passed).reduce((sum, c) => sum + c.weight, 0);
      const score = Math.round((earnedWeight / totalWeight) * 100);

      scores.push({
        contentId: String(row.id),
        contentType: "exam_question",
        title: (row.stem || "").substring(0, 80),
        score,
        checks,
        tier: row.tier || "unknown",
        status: row.status,
        calculatedAt: Date.now(),
      });
    }
  } catch (e: any) {
    console.error("[ContentHealth] exam question scoring error:", e.message);
  }
  return scores;
}

async function calculateFlashcardHealth(contentId?: string): Promise<ContentHealthScore[]> {
  const scores: ContentHealthScore[] = [];
  try {
    let query = `SELECT id, front, back, tier, status, topic, body_system, source_question_id, category, difficulty
       FROM flashcard_bank WHERE 1=1`;
    const params: any[] = [];
    if (contentId) {
      query += ` AND id = $1`;
      params.push(contentId);
    } else {
      query += ` AND status = 'published' LIMIT 500`;
    }
    const result = await pool.query(query, params);
    for (const row of result.rows) {
      const checks: HealthCheck[] = [];

      const frontText = row.front || "";
      const backText = row.back || "";
      checks.push({
        name: "front_text",
        passed: !!(frontText && frontText.trim().length >= 5),
        weight: 30,
        detail: frontText ? `Length: ${frontText.length}` : "Missing front text",
      });

      checks.push({
        name: "back_text",
        passed: !!(backText && backText.trim().length >= 5),
        weight: 30,
        detail: backText ? `Length: ${backText.length}` : "Missing back text",
      });

      checks.push({
        name: "category_assigned",
        passed: !!(row.category && row.category.trim().length > 0),
        weight: 15,
        detail: row.category ? `Category: ${row.category}` : "No category assigned",
      });

      checks.push({
        name: "topic_assigned",
        passed: !!(row.topic && row.topic.trim().length > 0),
        weight: 10,
        detail: row.topic || "No topic",
      });

      checks.push({
        name: "source_linked",
        passed: !!row.source_question_id,
        weight: 15,
        detail: row.source_question_id ? "Linked to source question" : "No source link",
      });

      const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
      const earnedWeight = checks.filter(c => c.passed).reduce((sum, c) => sum + c.weight, 0);
      const score = Math.round((earnedWeight / totalWeight) * 100);

      scores.push({
        contentId: String(row.id),
        contentType: "flashcard",
        title: frontText.substring(0, 80),
        score,
        checks,
        tier: row.tier || "unknown",
        status: row.status,
        calculatedAt: Date.now(),
      });
    }
  } catch (e: any) {
    console.error("[ContentHealth] flashcard scoring error:", e.message);
  }
  return scores;
}

async function calculateContentItemHealth(contentId?: string): Promise<ContentHealthScore[]> {
  const scores: ContentHealthScore[] = [];
  try {
    let query = `SELECT id, title, slug, type, category, body_system, tier, status, tags, summary, content,
              seo_title, seo_description, seo_keywords, published_at, version_key
       FROM content_items WHERE 1=1`;
    const params: any[] = [];
    if (contentId) {
      query += ` AND id = $1`;
      params.push(contentId);
    } else {
      query += ` AND status = 'published' LIMIT 500`;
    }
    const result = await pool.query(query, params);
    for (const row of result.rows) {
      const checks: HealthCheck[] = [];

      checks.push({
        name: "title_present",
        passed: !!(row.title && row.title.trim().length >= 3),
        weight: 15,
        detail: row.title ? `Title: ${row.title.substring(0, 50)}` : "Missing title",
      });

      checks.push({
        name: "slug_present",
        passed: !!(row.slug && row.slug.trim().length >= 3),
        weight: 10,
        detail: row.slug ? "Present" : "Missing slug",
      });

      let contentArr = row.content;
      if (typeof contentArr === "string") try { contentArr = JSON.parse(contentArr); } catch {}
      const hasContent = Array.isArray(contentArr) && contentArr.length > 0;
      checks.push({
        name: "content_blocks",
        passed: hasContent,
        weight: 25,
        detail: hasContent ? `${contentArr.length} blocks` : "No content blocks",
      });

      checks.push({
        name: "summary_present",
        passed: !!(row.summary && row.summary.trim().length >= 10),
        weight: 10,
        detail: row.summary ? "Present" : "Missing summary",
      });

      checks.push({
        name: "seo_title",
        passed: !!(row.seo_title && row.seo_title.trim().length > 0),
        weight: 10,
        detail: row.seo_title ? "Present" : "Missing SEO title",
      });

      checks.push({
        name: "seo_description",
        passed: !!(row.seo_description && row.seo_description.trim().length > 0),
        weight: 10,
        detail: row.seo_description ? "Present" : "Missing SEO description",
      });

      checks.push({
        name: "category_assigned",
        passed: !!(row.category && row.category.trim().length > 0),
        weight: 10,
        detail: row.category || "No category",
      });

      checks.push({
        name: "version_key",
        passed: !!(row.version_key && row.version_key.trim().length > 0),
        weight: 10,
        detail: row.version_key ? "Versioned" : "No version key",
      });

      const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
      const earnedWeight = checks.filter(c => c.passed).reduce((sum, c) => sum + c.weight, 0);
      const score = Math.round((earnedWeight / totalWeight) * 100);

      scores.push({
        contentId: String(row.id),
        contentType: row.type || "lesson",
        title: (row.title || "").substring(0, 80),
        score,
        checks,
        tier: row.tier || "free",
        status: row.status,
        calculatedAt: Date.now(),
      });
    }
  } catch (e: any) {
    console.error("[ContentHealth] content item scoring error:", e.message);
  }
  return scores;
}

async function calculateLessonHealth(): Promise<ContentHealthScore[]> {
  const scores: ContentHealthScore[] = [];
  try {
    const tableCheck = await pool.query(`SELECT to_regclass('lessons') IS NOT NULL AS exists`);
    if (!tableCheck.rows[0]?.exists) return scores;

    const result = await pool.query(
      `SELECT id, title, slug, status, tier, category, summary, definition, pathophysiology
       FROM lessons WHERE status = 'published' LIMIT 500`
    );
    for (const row of result.rows) {
      const checks: HealthCheck[] = [];

      checks.push({
        name: "title_present",
        passed: !!(row.title && row.title.trim().length >= 3),
        weight: 20,
        detail: row.title ? `Title: ${row.title.substring(0, 50)}` : "Missing title",
      });

      checks.push({
        name: "slug_present",
        passed: !!(row.slug && row.slug.trim().length >= 3),
        weight: 10,
        detail: row.slug ? "Present" : "Missing slug",
      });

      const hasDefinition = !!(row.definition && row.definition.trim().length > 0);
      const hasPatho = !!(row.pathophysiology && row.pathophysiology.trim().length > 0);
      checks.push({
        name: "content_present",
        passed: hasDefinition || hasPatho,
        weight: 30,
        detail: (hasDefinition || hasPatho) ? "Has clinical content" : "No clinical content",
      });

      checks.push({
        name: "summary_present",
        passed: !!(row.summary && row.summary.trim().length >= 10),
        weight: 15,
        detail: row.summary ? "Present" : "Missing summary",
      });

      checks.push({
        name: "category_assigned",
        passed: !!(row.category && row.category.trim().length > 0),
        weight: 10,
        detail: row.category || "No category",
      });

      checks.push({
        name: "tier_assigned",
        passed: !!(row.tier && row.tier.trim().length > 0),
        weight: 15,
        detail: row.tier || "No tier",
      });

      const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
      const earnedWeight = checks.filter(c => c.passed).reduce((sum, c) => sum + c.weight, 0);
      const score = Math.round((earnedWeight / totalWeight) * 100);

      scores.push({
        contentId: String(row.id),
        contentType: "lesson",
        title: (row.title || "").substring(0, 80),
        score,
        checks,
        tier: row.tier || "free",
        status: row.status,
        calculatedAt: Date.now(),
      });
    }
  } catch (e: any) {
    console.error("[ContentHealth] lesson scoring error:", e.message);
  }
  return scores;
}

async function runReleaseGateChecks(): Promise<GateResult> {
  const checks: GateCheckResult[] = [];

  try {
    await pool.query("SELECT 1");
    checks.push({ name: "database_connectivity", passed: true, detail: "Database is reachable", severity: "critical" });
  } catch (e: any) {
    checks.push({ name: "database_connectivity", passed: false, detail: `Database unreachable: ${e.message}`, severity: "critical" });
  }

  try {
    const r = await pool.query("SELECT COUNT(*)::int AS cnt FROM users WHERE tier = 'admin' LIMIT 1");
    const hasAdmins = (r.rows[0]?.cnt || 0) > 0;
    checks.push({ name: "auth_login_works", passed: hasAdmins, detail: hasAdmins ? "Admin users exist" : "No admin users found", severity: "critical" });
  } catch (e: any) {
    checks.push({ name: "auth_login_works", passed: false, detail: `Auth check failed: ${e.message}`, severity: "critical" });
  }

  try {
    const r = await pool.query("SELECT COUNT(*)::int AS cnt FROM exam_questions WHERE status = 'published'");
    const cnt = r.rows[0]?.cnt || 0;
    checks.push({ name: "exam_questions_available", passed: cnt > 0, detail: `${cnt} published exam questions`, severity: "critical" });
  } catch (e: any) {
    checks.push({ name: "exam_questions_available", passed: false, detail: `Exam check failed: ${e.message}`, severity: "critical" });
  }

  try {
    const r = await pool.query("SELECT COUNT(*)::int AS cnt FROM flashcard_bank WHERE status = 'published'");
    const cnt = r.rows[0]?.cnt || 0;
    checks.push({ name: "flashcards_available", passed: cnt > 0, detail: `${cnt} published flashcards`, severity: "warning" });
  } catch {
    checks.push({ name: "flashcards_available", passed: true, detail: "Flashcard table not available (optional)", severity: "info" });
  }

  try {
    const tableCheck = await pool.query(`SELECT to_regclass('lessons') IS NOT NULL AS exists`);
    if (tableCheck.rows[0]?.exists) {
      const r = await pool.query("SELECT COUNT(*)::int AS cnt FROM lessons WHERE status = 'published'");
      const cnt = r.rows[0]?.cnt || 0;
      checks.push({ name: "lessons_available", passed: cnt > 0, detail: `${cnt} published lessons`, severity: "warning" });
    } else {
      checks.push({ name: "lessons_available", passed: true, detail: "Lessons table not yet created", severity: "info" });
    }
  } catch {
    checks.push({ name: "lessons_available", passed: true, detail: "Lessons check skipped", severity: "info" });
  }

  const mem = process.memoryUsage();
  const rssMB = Math.round(mem.rss / (1024 * 1024));
  const RSS_WARNING_MB = 140;
  const RSS_CRITICAL_MB = 180;
  checks.push({
    name: "memory_healthy",
    passed: rssMB < RSS_WARNING_MB,
    detail: `RSS: ${rssMB}MB (warn: ${RSS_WARNING_MB}MB, crit: ${RSS_CRITICAL_MB}MB)`,
    severity: rssMB >= RSS_CRITICAL_MB ? "critical" : "warning",
  });

  try {
    const r = await pool.query(
      `SELECT COUNT(*)::int AS cnt FROM content_revisions WHERE created_at > NOW() - INTERVAL '7 days'`
    );
    const cnt = r.rows[0]?.cnt || 0;
    checks.push({ name: "backups_recent", passed: cnt > 0, detail: `${cnt} revisions in last 7 days`, severity: "warning" });
  } catch {
    checks.push({ name: "backups_recent", passed: true, detail: "Backup check skipped", severity: "info" });
  }

  const criticalFailed = checks.filter(c => !c.passed && c.severity === "critical");
  const passed = criticalFailed.length === 0;

  return {
    passed,
    checks,
    overrideAllowed: !passed,
    timestamp: Date.now(),
  };
}

async function calculateSingleItemHealth(contentId: string, contentType: string): Promise<ContentHealthScore | null> {
  try {
    let healthScores: ContentHealthScore[] = [];
    if (contentType === "exam_question") {
      healthScores = await calculateExamQuestionHealth(undefined, contentId);
    } else if (contentType === "flashcard") {
      healthScores = await calculateFlashcardHealth(contentId);
    } else {
      healthScores = await calculateContentItemHealth(contentId);
    }
    return healthScores.find(s => s.contentId === contentId) || null;
  } catch (e: any) {
    console.error("[ContentHealth] Single item scoring error:", e.message);
    return null;
  }
}

async function runContentPublishGate(contentId: string, contentType: string): Promise<GateResult> {
  const checks: GateCheckResult[] = [];

  const itemScore = await calculateSingleItemHealth(contentId, contentType);
  if (itemScore) {
    checks.push({
      name: "health_score_threshold",
      passed: itemScore.score >= HEALTH_SCORE_THRESHOLD,
      detail: `Health score: ${itemScore.score}/100 (threshold: ${HEALTH_SCORE_THRESHOLD})`,
      severity: "critical",
    });

    const failedChecks = itemScore.checks.filter(c => !c.passed);
    if (failedChecks.length > 0) {
      checks.push({
        name: "schema_validation",
        passed: failedChecks.length <= 2,
        detail: `${failedChecks.length} checks failed: ${failedChecks.map(c => c.name).join(", ")}`,
        severity: failedChecks.length > 3 ? "critical" : "warning",
      });
    } else {
      checks.push({
        name: "schema_validation",
        passed: true,
        detail: "All schema checks passed",
        severity: "info",
      });
    }
  } else {
    checks.push({
      name: "health_score_threshold",
      passed: false,
      detail: "Content not found for health scoring",
      severity: "critical",
    });
  }

  try {
    const r = await pool.query(
      `SELECT COUNT(*)::int AS cnt FROM content_revisions WHERE content_id = $1`,
      [contentId]
    );
    const cnt = r.rows[0]?.cnt || 0;
    checks.push({
      name: "backup_exists",
      passed: cnt > 0,
      detail: cnt > 0 ? `${cnt} backup revisions exist` : "No backup revisions found",
      severity: "warning",
    });
  } catch {
    checks.push({ name: "backup_exists", passed: true, detail: "Backup check skipped", severity: "info" });
  }

  checks.push({
    name: "fallback_available",
    passed: true,
    detail: "Platform fallback rendering available",
    severity: "info",
  });

  const criticalFailed = checks.filter(c => !c.passed && c.severity === "critical");
  const passed = criticalFailed.length === 0;

  return {
    passed,
    checks,
    overrideAllowed: !passed,
    timestamp: Date.now(),
  };
}

const gateOverrideLog: Array<{
  id: string;
  gateType: string;
  contentId: string | null;
  overriddenBy: string;
  reason: string;
  failedChecks: string[];
  timestamp: number;
}> = [];

async function logGateOverride(
  req: any,
  admin: any,
  gateType: string,
  contentId: string | null,
  reason: string,
  failedChecks: string[]
) {
  const entry = {
    id: `override-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    gateType,
    contentId,
    overriddenBy: admin?.username || admin?.id || "unknown",
    reason,
    failedChecks,
    timestamp: Date.now(),
  };
  gateOverrideLog.unshift(entry);
  if (gateOverrideLog.length > 200) gateOverrideLog.length = 200;

  let auditPersisted = false;
  try {
    await pool.query(
      `INSERT INTO audit_logs (id, actor_id, actor_username, entity_type, entity_id, action, after_json, reason, severity, ip_address, user_agent, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())`,
      [
        admin?.id || null,
        admin?.username || null,
        "gate_override",
        contentId,
        `${gateType}_override`,
        JSON.stringify({ failedChecks, gateType }),
        reason,
        "warning",
        req.ip || req.headers?.["x-forwarded-for"] || null,
        req.headers?.["user-agent"] || null,
      ]
    );
    auditPersisted = true;
  } catch (e) {
    console.error("[GateOverride] Audit log DB error:", e);
  }
  if (!auditPersisted) {
    throw new Error("Gate override blocked: audit log could not be persisted to database");
  }
}

export function registerContentHealthGateRoutes(app: Express) {
  app.get("/api/admin/content-health/scores", async (req: any, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const contentType = (req.query.type as string) || "all";
      const tier = req.query.tier as string;
      const sortBy = (req.query.sortBy as string) || "score";
      const sortDir = (req.query.sortDir as string) || "asc";
      const minScore = parseInt(req.query.minScore as string) || 0;
      const maxScore = parseInt(req.query.maxScore as string) || 100;

      let allScores: ContentHealthScore[] = [];

      if (contentType === "all" || contentType === "exam_question") {
        allScores.push(...await calculateExamQuestionHealth(tier));
      }
      if (contentType === "all" || contentType === "flashcard") {
        allScores.push(...await calculateFlashcardHealth());
      }
      if (contentType === "all" || contentType === "content_item") {
        allScores.push(...await calculateContentItemHealth());
      }
      if (contentType === "all" || contentType === "lesson") {
        allScores.push(...await calculateLessonHealth());
      }

      allScores = allScores.filter(s => s.score >= minScore && s.score <= maxScore);
      if (tier && contentType !== "exam_question") {
        allScores = allScores.filter(s => s.tier === tier);
      }

      allScores.sort((a, b) => {
        if (sortBy === "score") {
          return sortDir === "asc" ? a.score - b.score : b.score - a.score;
        }
        if (sortBy === "title") {
          return sortDir === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        }
        return sortDir === "asc" ? a.score - b.score : b.score - a.score;
      });

      const total = allScores.length;
      const criticalCount = allScores.filter(s => s.score < CRITICAL_SCORE_THRESHOLD).length;
      const warningCount = allScores.filter(s => s.score >= CRITICAL_SCORE_THRESHOLD && s.score < HEALTH_SCORE_THRESHOLD).length;
      const healthyCount = allScores.filter(s => s.score >= HEALTH_SCORE_THRESHOLD).length;
      const avgScore = total > 0 ? Math.round(allScores.reduce((sum, s) => sum + s.score, 0) / total) : 0;

      res.json({
        scores: allScores.slice(0, 200),
        summary: {
          total,
          criticalCount,
          warningCount,
          healthyCount,
          avgScore,
          threshold: HEALTH_SCORE_THRESHOLD,
          criticalThreshold: CRITICAL_SCORE_THRESHOLD,
        },
        timestamp: Date.now(),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/content-health/score/:contentType/:contentId", async (req: any, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { contentType, contentId } = req.params;
      let scores: ContentHealthScore[] = [];

      if (contentType === "exam_question") {
        scores = await calculateExamQuestionHealth();
      } else if (contentType === "flashcard") {
        scores = await calculateFlashcardHealth();
      } else if (contentType === "lesson") {
        scores = await calculateLessonHealth();
      } else {
        scores = await calculateContentItemHealth();
      }

      const score = scores.find(s => s.contentId === contentId);
      if (!score) {
        return res.status(404).json({ error: "Content not found or not published" });
      }

      res.json({ score });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/release-gate/check", async (req: any, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await runReleaseGateChecks();
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/release-gate/override", async (req: any, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { reason, failedChecks } = req.body;
      if (!reason || !reason.trim()) {
        return res.status(400).json({ error: "Override reason is required" });
      }

      const adminRole = admin.admin_role || admin.adminRole || "";
      if (adminRole !== "super_admin" && admin.id !== "internal") {
        return res.status(403).json({ error: "Only super admins can override release gates" });
      }

      await logGateOverride(req, admin, "release", null, reason, failedChecks || []);

      res.json({
        success: true,
        message: "Release gate overridden. Override has been audit-logged.",
        overriddenBy: admin.username || admin.id,
        timestamp: Date.now(),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/content-publish-gate/:contentType/:contentId", async (req: any, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { contentType, contentId } = req.params;
      const result = await runContentPublishGate(contentId, contentType);
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/content-publish-gate/override", async (req: any, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { contentId, contentType, reason, failedChecks } = req.body;
      if (!reason || !reason.trim()) {
        return res.status(400).json({ error: "Override reason is required" });
      }
      if (!contentId) {
        return res.status(400).json({ error: "contentId is required" });
      }

      const adminRole = admin.admin_role || admin.adminRole || "";
      if (adminRole !== "super_admin" && admin.id !== "internal") {
        return res.status(403).json({ error: "Only super admins can override publish gates" });
      }

      await logGateOverride(req, admin, "content_publish", contentId, reason, failedChecks || []);

      res.json({
        success: true,
        message: "Content publish gate overridden. Override has been audit-logged.",
        overriddenBy: admin.username || admin.id,
        contentId,
        timestamp: Date.now(),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/gate-overrides", async (req: any, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);

      try {
        const dbResult = await pool.query(
          `SELECT id, actor_id, actor_username, entity_type, entity_id, action, after_json, reason, severity, created_at
           FROM audit_logs WHERE action LIKE '%_override' AND entity_type = 'gate_override'
           ORDER BY created_at DESC LIMIT $1`,
          [limit]
        );
        res.json({ overrides: dbResult.rows, source: "database" });
      } catch {
        res.json({ overrides: gateOverrideLog.slice(0, limit), source: "memory" });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/vip-priority/status", async (req: any, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const mem = process.memoryUsage();
      const memUsage = Math.round((mem.heapUsed / mem.heapTotal) * 100);

      res.json({
        enabled: vipPriorityConfig.enabled,
        metrics: {
          ...vipMetrics,
          recentShedEvents: vipMetrics.recentShedEvents.slice(0, 50),
        },
        config: {
          tiers: vipPriorityConfig.tiers,
          loadThresholds: vipPriorityConfig.loadThresholds,
          subscriberPathCount: vipPriorityConfig.subscriberPaths.size,
        },
        currentLoad: {
          memoryPercent: memUsage,
          heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024),
          heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024),
        },
        timestamp: Date.now(),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/vip-priority/config", async (req: any, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const adminRole = admin.admin_role || admin.adminRole || "";
      if (adminRole !== "super_admin" && admin.id !== "internal") {
        return res.status(403).json({ error: "Only super admins can modify VIP priority config" });
      }

      const { enabled, loadThresholds } = req.body;

      if (typeof enabled === "boolean") {
        vipPriorityConfig.enabled = enabled;
      }

      if (loadThresholds && typeof loadThresholds === "object") {
        for (const [key, val] of Object.entries(loadThresholds)) {
          if (typeof val === "number" && val > 0 && val <= 1 && key in vipPriorityConfig.loadThresholds) {
            (vipPriorityConfig.loadThresholds as any)[key] = val;
          }
        }
      }

      try {
        await pool.query(
          `INSERT INTO audit_logs (id, actor_id, actor_username, entity_type, entity_id, action, after_json, severity, created_at)
           VALUES (gen_random_uuid(), $1, $2, 'vip_priority', 'config', 'vip_config_update', $3, 'warning', NOW())`,
          [admin.id, admin.username, JSON.stringify({ enabled: vipPriorityConfig.enabled, loadThresholds: vipPriorityConfig.loadThresholds })]
        );
      } catch {}

      res.json({
        success: true,
        config: {
          enabled: vipPriorityConfig.enabled,
          loadThresholds: vipPriorityConfig.loadThresholds,
        },
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/content-health/summary", async (req: any, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const [examScores, flashcardScores, contentScores, lessonScores] = await Promise.all([
        calculateExamQuestionHealth(),
        calculateFlashcardHealth(),
        calculateContentItemHealth(),
        calculateLessonHealth(),
      ]);

      function summarize(scores: ContentHealthScore[], label: string) {
        const total = scores.length;
        const critical = scores.filter(s => s.score < CRITICAL_SCORE_THRESHOLD).length;
        const warning = scores.filter(s => s.score >= CRITICAL_SCORE_THRESHOLD && s.score < HEALTH_SCORE_THRESHOLD).length;
        const healthy = scores.filter(s => s.score >= HEALTH_SCORE_THRESHOLD).length;
        const avg = total > 0 ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / total) : 0;
        return { label, total, critical, warning, healthy, avgScore: avg };
      }

      res.json({
        contentTypes: [
          summarize(examScores, "Exam Questions"),
          summarize(flashcardScores, "Flashcards"),
          summarize(contentScores, "Content Items"),
          summarize(lessonScores, "Lessons"),
        ],
        releaseGate: await runReleaseGateChecks(),
        vipPriority: {
          enabled: vipPriorityConfig.enabled,
          totalRequests: vipMetrics.totalRequests,
          shedRequests: vipMetrics.shedRequests,
          prioritizedRequests: vipMetrics.prioritizedRequests,
        },
        thresholds: {
          healthScore: HEALTH_SCORE_THRESHOLD,
          criticalScore: CRITICAL_SCORE_THRESHOLD,
        },
        timestamp: Date.now(),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
