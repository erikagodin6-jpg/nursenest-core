/**
 * POST /api/admin/view-as/real-user
 *
 * Start a view-as session for a real user. Loads the target user's actual
 * subscription state from DB, maps it to QA simulation parameters, and sets
 * the ADMIN_LEARNER_QA_COOKIE so the admin experiences the learner app with
 * the target user's entitlement profile.
 *
 * Security:
 *  - Requires DB-backed staff session (requireAdmin)
 *  - Cannot impersonate other admins/staff
 *  - Target user email stored in cookie for banner display ONLY
 *  - No study data (flashcard progress, exam results) is accessed or exposed
 *  - Every start event is logged with admin ID, target user ID, and timestamp
 *
 * DELETE /api/admin/view-as/real-user
 *  - Clears the ADMIN_LEARNER_QA_COOKIE (returns to admin's own view)
 */
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  ADMIN_LEARNER_QA_COOKIE,
  ADMIN_LEARNER_QA_MAX_AGE_SEC,
  signAdminLearnerQaCookieValue,
  publicQaStateFromPayload,
  lifecycleFromSubscriptionStatus,
  pathwayIdForQaTrack,
  type AdminLearnerQaPayloadV1,
  type AdminLearnerQaTrack,
} from "@/lib/admin/admin-learner-qa-simulation";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";

const NON_LEARNER_ROLES = ["ADMIN", "SUPER_ADMIN", "CONTENT_ADMIN", "SUPPORT_ADMIN"] as const;

const startSchema = z.object({
  targetUserId: z.string().min(1).max(100),
});

function tierToTrack(tier: string | null): AdminLearnerQaTrack {
  if (!tier) return "RN";
  switch (tier.toUpperCase()) {
    case "RN":        return "RN";
    case "RPN":       return "RPN";
    case "LVN_LPN":   return "LVN_LPN";
    case "NP":        return "NP";
    case "ALLIED":    return "ALLIED";
    case "NEW_GRAD":  return "NEW_GRAD";
    case "PRE_NURSING": return "PRE_NURSING";
    default:          return "RN";
  }
}

export async function POST(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  if (!isDatabaseUrlConfigured()) {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = startSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "targetUserId is required" }, { status: 400 });
  }

  const { targetUserId } = parsed.data;

  // Load target user with subscription data
  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: {
      id: true,
      email: true,
      role: true,
      tier: true,
      country: true,
      trialStatus: true,
      subscriptions: {
        orderBy: { updatedAt: "desc" },
        take: 1,
        select: {
          status: true,
          planTier: true,
          planDuration: true,
          planCode: true,
          cancelAtPeriodEnd: true,
        },
      },
    },
  });

  if (!targetUser) {
    return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
  }

  // Safety: never impersonate admin/staff accounts
  if (NON_LEARNER_ROLES.includes(targetUser.role as typeof NON_LEARNER_ROLES[number])) {
    return NextResponse.json(
      { ok: false, error: "Cannot impersonate admin or staff accounts" },
      { status: 403 },
    );
  }

  // Map real subscription state to QA params
  const sub = targetUser.subscriptions[0] ?? null;
  const rawStatus = (sub?.status ?? "none") as "none" | "active" | "canceled" | "grace" | "past_due";
  const trialStatus = (targetUser.trialStatus ?? "NONE") as "NONE" | "ACTIVE" | "EXPIRED" | "CONVERTED";
  const lifecycle = lifecycleFromSubscriptionStatus(rawStatus, sub?.planDuration ?? null, trialStatus);

  const track = tierToTrack(sub?.planTier ?? targetUser.tier ?? null);
  const country: "US" | "CA" =
    targetUser.country === "CA" ? "CA" : "US";

  const payload: AdminLearnerQaPayloadV1 = {
    v: 1,
    sub: gate.admin.userId,
    exp: Math.floor(Date.now() / 1000) + ADMIN_LEARNER_QA_MAX_AGE_SEC,
    track,
    lifecycle,
    country,
    targetUserId,
    targetEmail: targetUser.email ?? undefined,
  };

  const cookieValue = signAdminLearnerQaCookieValue(payload);
  if (!cookieValue) {
    return NextResponse.json(
      { ok: false, error: "QA simulation signing not configured", code: "admin_learner_qa_misconfigured" },
      { status: 503 },
    );
  }

  const jar = await cookies();
  jar.set(ADMIN_LEARNER_QA_COOKIE, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ADMIN_LEARNER_QA_MAX_AGE_SEC,
    path: "/",
  });

  safeServerLog("admin_view_as", "real_user_session_started", {
    adminIdPrefix: gate.admin.userId.slice(0, 8),
    targetIdPrefix: targetUserId.slice(0, 8),
    targetEmail: (targetUser.email ?? "").slice(0, 40),
    track,
    lifecycle,
    country,
    timestamp: new Date().toISOString(),
  });

  const state = publicQaStateFromPayload(payload);

  return NextResponse.json({
    ok: true,
    state,
    redirectTo: "/app",
    targetId: targetUserId,
    message: `View-as session started for ${targetUser.email ?? targetUserId}. Redirecting to /app.`,
  });
}

export async function DELETE(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const jar = await cookies();
  jar.delete(ADMIN_LEARNER_QA_COOKIE);

  safeServerLog("admin_view_as", "real_user_session_cleared", {
    adminIdPrefix: gate.admin.userId.slice(0, 8),
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, message: "View-as session cleared." });
}
