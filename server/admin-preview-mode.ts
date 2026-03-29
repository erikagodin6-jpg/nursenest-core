import type { Request, Response, Express } from "express";
import crypto from "crypto";
import { BoundedMap } from "./bounded-map";

interface PreviewSession {
  id: string;
  adminUserId: string;
  adminUsername: string;
  role: "free" | "certification_prep" | "full_access" | "new_grad_toolkit" | "admin";
  language: string;
  fallbackMode: boolean;
  networkThrottle: "none" | "slow-3g" | "fast-3g" | "offline";
  mobileView: boolean;
  mobileDevice: string;
  degradationLevel: number;
  createdAt: number;
  expiresAt: number;
  active: boolean;
}

const previewSessions = new BoundedMap<string, PreviewSession>(50, 60 * 60 * 1000);

const MOBILE_DEVICES: Record<string, { width: number; height: number; userAgent: string }> = {
  "iphone-14": { width: 390, height: 844, userAgent: "iPhone 14" },
  "iphone-se": { width: 375, height: 667, userAgent: "iPhone SE" },
  "pixel-7": { width: 412, height: 915, userAgent: "Pixel 7" },
  "ipad-air": { width: 820, height: 1180, userAgent: "iPad Air" },
  "galaxy-s23": { width: 360, height: 780, userAgent: "Galaxy S23" },
};

const AVAILABLE_ROLES = [
  { value: "free", label: "Free User", description: "No subscription, limited access" },
  { value: "certification_prep", label: "Certification Prep", description: "Mid-tier subscription" },
  { value: "full_access", label: "Full Access", description: "Premium subscription, all content" },
  { value: "new_grad_toolkit", label: "New Grad Toolkit", description: "New graduate package" },
  { value: "admin", label: "Admin", description: "Full admin access" },
];

const AVAILABLE_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "fil", name: "Filipino" },
  { code: "hi", name: "Hindi" },
  { code: "zh", name: "Chinese (Simplified)" },
  { code: "ar", name: "Arabic" },
  { code: "ko", name: "Korean" },
  { code: "pt", name: "Portuguese" },
  { code: "ja", name: "Japanese" },
];

function genId(): string {
  return crypto.randomBytes(16).toString("hex");
}

function cleanExpiredSessions(): void {
  const now = Date.now();
  for (const [id, session] of previewSessions) {
    if (now > session.expiresAt) {
      previewSessions.delete(id);
    }
  }
}

async function resolveAdmin(req: Request, res: Response): Promise<any | null> {
  try {
    const { resolveAuthUser } = await import("./admin-auth");
    const user = await resolveAuthUser(req as any);
    if (!user || user.tier !== "admin") {
      res.status(403).json({ error: "Admin access required" });
      return null;
    }
    return user;
  } catch {
    res.status(403).json({ error: "Authentication failed" });
    return null;
  }
}

export function getActivePreviewSession(sessionId: string): PreviewSession | null {
  cleanExpiredSessions();
  const session = previewSessions.get(sessionId);
  if (!session || !session.active || Date.now() > session.expiresAt) return null;
  return session;
}

export function registerPreviewModeRoutes(app: Express): void {
  app.get("/api/admin/preview-mode/config", async (req: Request, res: Response) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;

    cleanExpiredSessions();
    const activeSessions = Array.from(previewSessions.values())
      .filter(s => s.adminUserId === (admin.id || admin.username) && s.active);

    res.json({
      roles: AVAILABLE_ROLES,
      languages: AVAILABLE_LANGUAGES,
      mobileDevices: MOBILE_DEVICES,
      networkOptions: [
        { value: "none", label: "Normal", description: "No throttling" },
        { value: "slow-3g", label: "Slow 3G", description: "~400kbps, 2000ms latency" },
        { value: "fast-3g", label: "Fast 3G", description: "~1.5Mbps, 500ms latency" },
        { value: "offline", label: "Offline Simulation", description: "All network requests fail" },
      ],
      degradationLevels: [
        { level: 0, name: "Normal", description: "Full functionality" },
        { level: 1, name: "Disable Animations", description: "Animations disabled" },
        { level: 2, name: "Simplify UI", description: "Simplified components" },
        { level: 3, name: "Safe Renderer", description: "Minimal rendering" },
        { level: 4, name: "Static Backup", description: "Pre-built static content" },
        { level: 5, name: "Substitute Content", description: "Fallback content only" },
      ],
      activeSessions,
      timestamp: Date.now(),
    });
  });

  app.post("/api/admin/preview-mode/start", async (req: Request, res: Response) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;

    const {
      role = "free",
      language = "en",
      fallbackMode = false,
      networkThrottle = "none",
      mobileView = false,
      mobileDevice = "iphone-14",
      degradationLevel = 0,
    } = req.body;

    const validRoles = AVAILABLE_ROLES.map(r => r.value);
    const validLanguages = AVAILABLE_LANGUAGES.map(l => l.code);
    const validThrottles = ["none", "slow-3g", "fast-3g", "offline"];
    const validDevices = Object.keys(MOBILE_DEVICES);

    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }
    if (!validLanguages.includes(language)) {
      return res.status(400).json({ error: "Invalid language" });
    }
    if (!validThrottles.includes(networkThrottle)) {
      return res.status(400).json({ error: "Invalid networkThrottle" });
    }
    if (!validDevices.includes(mobileDevice)) {
      return res.status(400).json({ error: "Invalid mobileDevice" });
    }
    if (typeof degradationLevel !== "number" || degradationLevel < 0 || degradationLevel > 5) {
      return res.status(400).json({ error: "Invalid degradationLevel (must be 0-5)" });
    }

    const sessionId = genId();
    const session: PreviewSession = {
      id: sessionId,
      adminUserId: admin.id || admin.username,
      adminUsername: admin.username,
      role,
      language,
      fallbackMode,
      networkThrottle,
      mobileView,
      mobileDevice,
      degradationLevel,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 60 * 1000,
      active: true,
    };

    previewSessions.set(sessionId, session);

    res.json({ session, timestamp: Date.now() });
  });

  app.post("/api/admin/preview-mode/update", async (req: Request, res: Response) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;

    const { sessionId, ...updates } = req.body;
    if (!sessionId) return res.status(400).json({ error: "sessionId required" });

    const session = previewSessions.get(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });

    const adminId = admin.id || admin.username;
    if (session.adminUserId !== adminId) {
      return res.status(403).json({ error: "Cannot modify another admin's session" });
    }

    const validRoles = AVAILABLE_ROLES.map(r => r.value);
    const validLanguages = AVAILABLE_LANGUAGES.map(l => l.code);
    const validThrottles = ["none", "slow-3g", "fast-3g", "offline"];
    const validDevices = Object.keys(MOBILE_DEVICES);

    if (updates.role !== undefined) {
      if (!validRoles.includes(updates.role)) return res.status(400).json({ error: "Invalid role" });
      session.role = updates.role;
    }
    if (updates.language !== undefined) {
      if (!validLanguages.includes(updates.language)) return res.status(400).json({ error: "Invalid language" });
      session.language = updates.language;
    }
    if (updates.fallbackMode !== undefined) {
      if (typeof updates.fallbackMode !== "boolean") return res.status(400).json({ error: "Invalid fallbackMode" });
      session.fallbackMode = updates.fallbackMode;
    }
    if (updates.networkThrottle !== undefined) {
      if (!validThrottles.includes(updates.networkThrottle)) return res.status(400).json({ error: "Invalid networkThrottle" });
      session.networkThrottle = updates.networkThrottle;
    }
    if (updates.mobileView !== undefined) {
      if (typeof updates.mobileView !== "boolean") return res.status(400).json({ error: "Invalid mobileView" });
      session.mobileView = updates.mobileView;
    }
    if (updates.mobileDevice !== undefined) {
      if (!validDevices.includes(updates.mobileDevice)) return res.status(400).json({ error: "Invalid mobileDevice" });
      session.mobileDevice = updates.mobileDevice;
    }
    if (updates.degradationLevel !== undefined) {
      if (typeof updates.degradationLevel !== "number" || updates.degradationLevel < 0 || updates.degradationLevel > 5) {
        return res.status(400).json({ error: "Invalid degradationLevel" });
      }
      session.degradationLevel = updates.degradationLevel;
    }

    res.json({ session, timestamp: Date.now() });
  });

  app.post("/api/admin/preview-mode/stop", async (req: Request, res: Response) => {
    const admin = await resolveAdmin(req, res);
    if (!admin) return;

    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: "sessionId required" });

    const session = previewSessions.get(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });

    const adminId = admin.id || admin.username;
    if (session.adminUserId !== adminId) {
      return res.status(403).json({ error: "Cannot stop another admin's session" });
    }

    session.active = false;
    previewSessions.delete(sessionId);

    res.json({ success: true, timestamp: Date.now() });
  });

  app.get("/api/admin/preview-mode/resolve", async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string || req.headers["x-preview-session"] as string;
    if (!sessionId) return res.json({ preview: null });

    const session = getActivePreviewSession(sessionId);
    if (!session) return res.json({ preview: null });

    res.json({
      preview: {
        role: session.role,
        language: session.language,
        fallbackMode: session.fallbackMode,
        networkThrottle: session.networkThrottle,
        mobileView: session.mobileView,
        mobileDevice: session.mobileDevice,
        degradationLevel: session.degradationLevel,
        viewport: session.mobileView ? MOBILE_DEVICES[session.mobileDevice] : null,
      },
      timestamp: Date.now(),
    });
  });
}
