import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";

// ── Cookie ───────────────────────────────────────────────────────────────────
export const VIEW_AS_COOKIE = "nn_admin_view_as_user";
const COOKIE_MAX_AGE_SEC = 2 * 60 * 60; // 2 hours

function hmacSecret(): string {
  const secret = process.env.ADMIN_IMPERSONATION_SECRET ?? process.env.NEXTAUTH_SECRET ?? "";
  if (!secret) throw new Error("No HMAC secret available for view-as cookie");
  return secret;
}

type ViewAsPayload = {
  /** Admin user ID who initiated the view-as session. */
  adminId: string;
  /** Target user ID being viewed. */
  targetId: string;
  /** Unix timestamp (seconds) when this expires. */
  exp: number;
  /** Random nonce to prevent replay across sessions. */
  nonce: string;
};

function signPayload(payload: ViewAsPayload): string {
  const body = JSON.stringify(payload);
  const sig = createHmac("sha256", hmacSecret()).update(body).digest("base64url");
  return `${Buffer.from(body).toString("base64url")}.${sig}`;
}

function verifyPayload(token: string): ViewAsPayload | null {
  try {
    const [bodyB64, sig] = token.split(".");
    if (!bodyB64 || !sig) return null;
    const body = Buffer.from(bodyB64, "base64url").toString("utf8");
    const expected = createHmac("sha256", hmacSecret()).update(body).digest("base64url");
    const sigBuf = Buffer.from(sig, "base64url");
    const expBuf = Buffer.from(expected, "base64url");
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null;
    const payload = JSON.parse(body) as ViewAsPayload;
    if (Date.now() / 1000 > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Sets the view-as cookie. Call from a server action or API route after admin auth check. */
export async function startViewAsSession(adminId: string, targetId: string): Promise<void> {
  const payload: ViewAsPayload = {
    adminId,
    targetId,
    exp: Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE_SEC,
    nonce: randomBytes(12).toString("hex"),
  };

  const cookieStore = await cookies();
  cookieStore.set(VIEW_AS_COOKIE, signPayload(payload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE_SEC,
    path: "/",
  });

  await auditImpersonation(adminId, targetId, "start");
}

export async function clearViewAsSession(adminId?: string, targetId?: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(VIEW_AS_COOKIE);
  if (adminId && targetId) {
    await auditImpersonation(adminId, targetId, "end");
  }
}

/** Returns the active view-as target ID if a valid cookie exists, else null. */
export async function getActiveViewAsTargetId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(VIEW_AS_COOKIE)?.value;
    if (!raw) return null;
    const payload = verifyPayload(raw);
    if (!payload) return null;
    return payload.targetId;
  } catch {
    return null;
  }
}

/** Full context of an active view-as session (admin + target). */
export async function getActiveViewAsContext(): Promise<{
  adminId: string;
  targetId: string;
  expiresAt: Date;
} | null> {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(VIEW_AS_COOKIE)?.value;
    if (!raw) return null;
    const payload = verifyPayload(raw);
    if (!payload) return null;
    return {
      adminId: payload.adminId,
      targetId: payload.targetId,
      expiresAt: new Date(payload.exp * 1000),
    };
  } catch {
    return null;
  }
}

// ── Audit ─────────────────────────────────────────────────────────────────────
async function auditImpersonation(
  adminId: string,
  targetId: string,
  event: "start" | "end",
): Promise<void> {
  safeServerLog("admin_impersonation", event, {
    adminId: adminId.slice(0, 12),
    targetId: targetId.slice(0, 12),
    event,
  });

  if (!isDatabaseUrlConfigured()) return;

  // Write to admin_audit_log if the model exists; fail silently if not.
  try {
    await (prisma as unknown as {
      adminAuditLog?: {
        create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
      };
    }).adminAuditLog?.create({
      data: {
        adminId,
        action: event === "start" ? "impersonation_start" : "impersonation_end",
        targetId,
        createdAt: new Date(),
        meta: { event },
      },
    });
  } catch {
    // model may not exist yet — log already captured above
  }
}

// ── Load target user context for "view as" portal ────────────────────────────
export async function loadViewAsUserContext(targetId: string) {
  if (!isDatabaseUrlConfigured()) return null;
  const user = await prisma.user.findUnique({
    where: { id: targetId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      tier: true,
      country: true,
      learnerPath: true,
      targetExamPathwayId: true,
      alliedProfessionKey: true,
      examDate: true,
      createdAt: true,
      subscriptions: {
        select: { status: true, planTier: true, planCode: true, currentPeriodEnd: true, cancelAtPeriodEnd: true },
        orderBy: { updatedAt: "desc" },
        take: 1,
      },
    },
  });
  return user;
}
