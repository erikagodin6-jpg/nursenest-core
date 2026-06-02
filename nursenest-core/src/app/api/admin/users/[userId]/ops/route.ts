import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { CountryCode, SubscriptionStatus, TierCode } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { parseAdminJsonMutationIntent, stripAdminMutationControlFields } from "@/lib/admin/admin-mutation-intent";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";

type RouteContext = { params: Promise<{ userId: string }> };

type OpsAction =
  | "force_reauthentication"
  | "open_abuse_review"
  | "cancel_local_subscriptions"
  | "grant_comp_access";

type Body = {
  action?: OpsAction;
  reason?: string;
  note?: string;
  days?: number;
  confirm?: boolean;
  dryRun?: boolean;
};

export const dynamic = "force-dynamic";

function cleanText(value: unknown, fallback: string, max = 500): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim().replace(/\s+/g, " ");
  return trimmed.length > 0 ? trimmed.slice(0, max) : fallback;
}

function clampCompDays(value: unknown): number {
  const n = typeof value === "number" && Number.isFinite(value) ? Math.floor(value) : 30;
  return Math.max(1, Math.min(366, n));
}

function requireSuperAdmin(tier: string) {
  if (tier === "super") return null;
  return NextResponse.json(
    {
      ok: false,
      code: "super_admin_required",
      error: "Account operations that change access, sessions, or abuse records require a super admin.",
    },
    { status: 403 },
  );
}

export async function POST(req: NextRequest, ctx: RouteContext) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const superOnly = requireSuperAdmin(gate.admin.tier);
  if (superOnly) return superOnly;

  if (!isDatabaseUrlConfigured()) {
    return NextResponse.json({ ok: false, error: "Database not configured." }, { status: 503 });
  }

  const raw = (await req.json().catch(() => null)) as Body | null;
  const intent = parseAdminJsonMutationIntent(raw);
  if (intent instanceof NextResponse) return intent;

  const body = stripAdminMutationControlFields((raw ?? {}) as Record<string, unknown>) as Body;
  const action = body.action;
  const { userId } = await ctx.params;
  if (!action) {
    return NextResponse.json({ ok: false, error: "Missing account operation action." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, tier: true, country: true, email: true },
  });
  if (!user) {
    return NextResponse.json({ ok: false, error: "User not found." }, { status: 404 });
  }

  if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
    return NextResponse.json({ ok: false, error: "Refusing account operation on an admin user." }, { status: 400 });
  }

  const reason = cleanText(body.reason, "admin_account_operation", 80);
  const note = cleanText(body.note, `${action} by admin`, 500);

  safeServerLog("admin_account_ops", intent.dryRun ? "dry_run" : "apply", {
    action,
    actorPrefix: gate.admin.userId.slice(0, 8),
    targetPrefix: userId.slice(0, 8),
    reason,
    severity: "warning",
  });

  if (intent.dryRun) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      action,
      targetUserId: user.id,
      preview: previewForAction(action, body),
    });
  }

  const now = new Date();

  if (action === "force_reauthentication") {
    const [sessions, updatedUser] = await prisma.$transaction([
      prisma.learnerSessionActivity.updateMany({
        where: { userId: user.id, revokedAt: null },
        data: { revokedAt: now, suspiciousReason: reason },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { credentialVersion: { increment: 1 } },
        select: { credentialVersion: true },
      }),
    ]);
    return NextResponse.json({
      ok: true,
      action,
      revokedSessionRows: sessions.count,
      credentialVersion: updatedUser.credentialVersion,
    });
  }

  if (action === "open_abuse_review") {
    const review = await prisma.protectionAbuseReview.create({
      data: {
        userId: user.id,
        reason,
        score: 75,
        adminNote: note,
        evidence: {
          source: "admin_user_ops",
          actorPrefix: gate.admin.userId.slice(0, 8),
          note,
          createdAt: now.toISOString(),
        },
      },
      select: { id: true, createdAt: true },
    });
    return NextResponse.json({ ok: true, action, reviewId: review.id, createdAt: review.createdAt.toISOString() });
  }

  if (action === "cancel_local_subscriptions") {
    const updated = await prisma.subscription.updateMany({
      where: { userId: user.id, status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.GRACE, SubscriptionStatus.PAST_DUE] } },
      data: { status: SubscriptionStatus.CANCELLED, cancelAtPeriodEnd: true },
    });
    await prisma.learnerSessionActivity.updateMany({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: now, suspiciousReason: reason },
    });
    await prisma.user.update({ where: { id: user.id }, data: { credentialVersion: { increment: 1 } } });
    return NextResponse.json({
      ok: true,
      action,
      cancelledLocalSubscriptions: updated.count,
      note: "Local access was revoked. Stripe billing cancellation still belongs in Stripe or billing reconciliation workflows.",
    });
  }

  if (action === "grant_comp_access") {
    const days = clampCompDays(body.days);
    const currentPeriodEnd = new Date(now.getTime() + days * 86_400_000);
    const created = await prisma.subscription.create({
      data: {
        userId: user.id,
        status: SubscriptionStatus.ACTIVE,
        stripeSubscriptionId: `admin_comp_${randomUUID()}`,
        planTier: user.tier as TierCode,
        planCountry: user.country as CountryCode,
        planDuration: `${days}_days`,
        planCode: "admin_comp_access",
        currentPeriodEnd,
      },
      select: { id: true, currentPeriodEnd: true },
    });
    await prisma.protectionAbuseReview.create({
      data: {
        userId: user.id,
        reason: "admin_comp_access",
        score: 0,
        adminNote: `Comp access granted for ${days} days. ${note}`,
        dismissedAt: now,
        resolution: "RESOLVED",
        dismissedByUserId: gate.admin.userId,
        evidence: { source: "admin_user_ops", days, subscriptionId: created.id },
      },
    });
    return NextResponse.json({
      ok: true,
      action,
      subscriptionId: created.id,
      currentPeriodEnd: created.currentPeriodEnd?.toISOString() ?? null,
    });
  }

  return NextResponse.json({ ok: false, error: "Unknown action." }, { status: 400 });
}

function previewForAction(action: OpsAction, body: Body) {
  switch (action) {
    case "force_reauthentication":
      return "Revoke active hashed session slots and increment credentialVersion so existing auth sessions must refresh.";
    case "open_abuse_review":
      return "Create an open protection review row with admin note/evidence for the user.";
    case "cancel_local_subscriptions":
      return "Mark local active/grace/past-due subscription rows as CANCELLED, revoke active session slots, and increment credentialVersion. Does not call Stripe.";
    case "grant_comp_access":
      return `Create a local active comp subscription for ${clampCompDays(body.days)} days.`;
  }
}
