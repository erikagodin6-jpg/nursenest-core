import type { Request, Response, Express, NextFunction } from "express";
import { pool } from "./storage";

/**
 * ------------------------------
 * TYPES
 * ------------------------------
 */

interface LiteConfig {
  active: boolean;
  activatedAt: number | null;
  activatedBy: string | null;
  reason: string | null;
  autoActivated: boolean;
  healthCheckFailCount: number;
  lastHealthCheck: number | null;
}

interface LitePayload {
  type: string;
  id: string;
  title: string;
  content: any;
  tier: string;
  updatedAt: number;
}

/**
 * ------------------------------
 * STATE
 * ------------------------------
 */

const liteConfig: LiteConfig = {
  active: false,
  activatedAt: null,
  activatedBy: null,
  reason: null,
  autoActivated: false,
  healthCheckFailCount: 0,
  lastHealthCheck: null,
};

const prebuiltPayloads = new Map<string, LitePayload[]>();
let lastPayloadBuild: number | null = null;

/**
 * ------------------------------
 * STATIC CONTENT
 * ------------------------------
 */

const LITE_LESSONS: LitePayload[] = [/* KEEP YOUR EXISTING DATA EXACTLY */];
const LITE_FLASHCARDS: LitePayload[] = [/* KEEP YOUR EXISTING DATA EXACTLY */];
const LITE_EXAMS: LitePayload[] = [/* KEEP YOUR EXISTING DATA EXACTLY */];

/**
 * ------------------------------
 * HELPERS
 * ------------------------------
 */

function safeNumber(val: any, def: number, min: number, max: number) {
  const n = parseInt(val);
  if (isNaN(n)) return def;
  return Math.min(Math.max(n, min), max);
}

function initPrebuiltPayloads(): void {
  prebuiltPayloads.set("lessons", LITE_LESSONS);
  prebuiltPayloads.set("flashcards", LITE_FLASHCARDS);
  prebuiltPayloads.set("exams", LITE_EXAMS);
  lastPayloadBuild = Date.now();
}

function ensurePayloadsLoaded(): void {
  if (!lastPayloadBuild) {
    initPrebuiltPayloads();
  }
}

/**
 * ------------------------------
 * DB PAYLOAD BUILD
 * ------------------------------
 */

async function buildPayloadsFromDb() {
  const counts = { lessons: 0, flashcards: 0, exams: 0 };

  try {
    const lessons = await pool.query(`
      SELECT id, title, content, tier
      FROM content_items
      WHERE status='published' AND type='lesson'
      ORDER BY created_at DESC
      LIMIT 10
    `);

    if (lessons.rows.length > 0) {
      const dbLessons: LitePayload[] = lessons.rows.map((r: any) => ({
        type: "lesson",
        id: `lite-db-${r.id}`,
        title: r.title,
        content: r.content || {
          sections: [{ title: r.title, body: "Content available in lite mode." }],
        },
        tier: r.tier || "free",
        updatedAt: Date.now(),
      }));

      prebuiltPayloads.set("lessons", [...LITE_LESSONS, ...dbLessons]);
      counts.lessons = dbLessons.length;
    }
  } catch (e: any) {
    console.error("[LiteMode] DB payload error:", e.message);
  }

  lastPayloadBuild = Date.now();
  return counts;
}

/**
 * ------------------------------
 * ENTITLEMENT
 * ------------------------------
 */

function isEntitled(userTier: string | null, contentTier: string): boolean {
  if (!contentTier || contentTier === "free") return true;
  if (!userTier || userTier === "free") return false;

  if (["admin", "full_access"].includes(userTier)) return true;

  if (contentTier === "new_grad_toolkit") {
    return ["new_grad_toolkit", "certification_prep", "full_access"].includes(userTier);
  }

  if (contentTier === "certification_prep") {
    return ["certification_prep", "full_access"].includes(userTier);
  }

  return userTier === contentTier;
}

/**
 * ------------------------------
 * ADMIN AUTH
 * ------------------------------
 */

async function resolveAdmin(req: Request, res: Response) {
  try {
    const { resolveAuthUser } = await import("./admin-auth");
    const user = await resolveAuthUser(req as any);

    if (!user || user.tier !== "admin") {
      res.status(403).json({ error: "Admin required" });
      return null;
    }

    return user;
  } catch {
    res.status(403).json({ error: "Auth failed" });
    return null;
  }
}

/**
 * ------------------------------
 * STATE CONTROL
 * ------------------------------
 */

export function isLiteModeActive() {
  return liteConfig.active;
}

export function getLiteConfig() {
  return { ...liteConfig };
}

export function activateLiteMode(reason: string, activatedBy: string | null, auto = false) {
  liteConfig.active = true;
  liteConfig.activatedAt = Date.now();
  liteConfig.activatedBy = activatedBy;
  liteConfig.reason = reason;
  liteConfig.autoActivated = auto;

  console.log(`[LiteMode] ACTIVATED → ${reason}`);
}

export function deactivateLiteMode() {
  liteConfig.active = false;
  liteConfig.activatedAt = null;
  liteConfig.activatedBy = null;
  liteConfig.reason = null;
  liteConfig.autoActivated = false;
  liteConfig.healthCheckFailCount = 0;

  console.log("[LiteMode] DEACTIVATED");
}

/**
 * ------------------------------
 * MIDDLEWARE
 * ------------------------------
 */

export function liteModeFallbackMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!liteConfig.active) return next();

    if (
      req.path.startsWith("/api/lite/") ||
      req.path.startsWith("/api/admin/") ||
      req.path === "/healthz"
    ) {
      return next();
    }

    const routes: Record<string, string> = {
      "/api/lessons": "/api/lite/lessons",
      "/api/flashcards": "/api/lite/flashcards",
      "/api/exams": "/api/lite/exams",
    };

    for (const key of Object.keys(routes)) {
      if (req.path.startsWith(key)) {
        return res.json({
          _lite: true,
          _redirectTo: routes[key],
          message: "Lite mode active",
        });
      }
    }

    next();
  };
}

/**
 * ------------------------------
 * ROUTES
 * ------------------------------
 */

export function registerLiteModeRoutes(app: Express): void {

  app.get("/api/lite/status", (_req, res) => {
    ensurePayloadsLoaded();

    res.json({
      active: liteConfig.active,
      payloadTypes: Array.from(prebuiltPayloads.keys()),
      lastPayloadBuild,
      timestamp: Date.now(),
    });
  });

  app.get("/api/lite/lessons", (_req, res) => {
    ensurePayloadsLoaded();

    const lessons = prebuiltPayloads.get("lessons") || [];
    res.json({ _lite: true, lessons });
  });

  app.get("/api/lite/flashcards", (_req, res) => {
    ensurePayloadsLoaded();

    const decks = prebuiltPayloads.get("flashcards") || [];
    res.json({ _lite: true, flashcards: decks });
  });

  app.get("/api/lite/exams/:id", (req, res) => {
    ensurePayloadsLoaded();

    const exams = prebuiltPayloads.get("exams") || [];
    const exam = exams.find(e => e.id === req.params.id);

    if (!exam) return res.status(404).json({ error: "Not found" });

    const offset = safeNumber(req.query.offset, 0, 0, 1000);
    const limit = safeNumber(req.query.limit, 10, 1, 50);

    const questions = exam.content.questions || [];
    const slice = questions.slice(offset, offset + limit);

    res.json({
      _lite: true,
      questions: slice,
      total: questions.length,
      hasMore: offset + limit < questions.length,
    });
  });

  /**
   * ADMIN
   */

  app.post("/api/admin/lite/activate", async (req, res) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;

    activateLiteMode(req.body.reason || "manual", admin.id);
    res.json({ success: true });
  });

  app.post("/api/admin/lite/deactivate", async (req, res) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;

    deactivateLiteMode();
    res.json({ success: true });
  });

  app.post("/api/admin/lite/rebuild", async (req, res) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;

    const counts = await buildPayloadsFromDb();
    res.json({ success: true, counts });
  });
}