import "server-only";

import { createHash, createHmac, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getAuthSessionJwtFromRequest } from "@/lib/auth/nextauth-request-jwt";
import { buildIncomingRequestForJwtRead } from "@/lib/auth/server-session-jwt-fallback";
import { isLearnerEntitlementStaffBypassRole } from "@/lib/auth/staff-roles";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { UserAccess } from "@/lib/entitlements/user-access-types";
import { getTrustedClientIp } from "@/lib/http/client-ip";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";
import {
  accountSharingMaxActiveDevices,
  accountSharingMaxIps24h,
  isAccountSharingEnforceEnabled,
  isAccountSharingMonitorEnabled,
  isAccountSharingSoftLimitOnly,
} from "@/lib/security/account-sharing-env";

function pepper(): string {
  return (process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "").trim();
}

export function hmacHex(input: string): string {
  const s = pepper();
  if (!s) return createHash("sha256").update(`no-auth-secret:${input}`).digest("hex");
  return createHmac("sha256", s).update(input).digest("hex");
}

function sessionKeyMaterialFromJwt(token: Record<string, unknown> | null): string {
  if (!token) return `anon:${randomUUID()}`;
  const jti = typeof token.jti === "string" && token.jti.length > 0 ? token.jti : "";
  const sub = typeof token.sub === "string" ? token.sub : "";
  const iat = typeof token.iat === "number" ? token.iat : 0;
  return jti ? `jti:${jti}` : `legacy:${sub}:${iat}`;
}

function readRegionHint(headers: Headers): string | null {
  const cf = headers.get("cf-ipcountry")?.trim().toUpperCase();
  if (cf && /^[A-Z]{2}$/.test(cf)) return cf;
  const vercel = headers.get("x-vercel-ip-country")?.trim().toUpperCase();
  if (vercel && /^[A-Z]{2}$/.test(vercel)) return vercel;
  return null;
}

export type AccountSharingEvaluation = {
  distinctIps24h: number;
  activeDeviceSlots7d: number;
  multiRegionShortWindow: boolean;
  reasons: string[];
};

export function evaluateAccountSharingSignals(args: {
  distinctIps24h: number;
  activeDeviceSlots7d: number;
  multiRegionShortWindow: boolean;
  maxIps: number;
  maxDevices: number;
}): AccountSharingEvaluation {
  const reasons: string[] = [];
  if (args.distinctIps24h > args.maxIps) {
    reasons.push("many_distinct_ips_24h");
  }
  if (args.activeDeviceSlots7d > args.maxDevices) {
    reasons.push("many_device_slots_7d");
  }
  if (args.multiRegionShortWindow) {
    reasons.push("multi_region_short_window");
  }
  return {
    distinctIps24h: args.distinctIps24h,
    activeDeviceSlots7d: args.activeDeviceSlots7d,
    multiRegionShortWindow: args.multiRegionShortWindow,
    reasons,
  };
}

export function accountSharingEnforcementResponse(): NextResponse {
  return NextResponse.json(
    {
      code: "session_review_required",
      message:
        "We noticed your account is active on several devices. For your security, please sign in again.",
    },
    { status: 401, headers: mergeSubscriberPrivateCacheHeaders() },
  );
}

/**
 * After a successful subscriber entitlement check: optional telemetry + optional soft enforcement.
 * Never runs for staff/admin learner bypass roles.
 */
export async function maybeBlockOrTouchAccountSharingAfterSubscriberOk(
  userId: string,
  userAccess: UserAccess,
): Promise<NextResponse | null> {
  if (!isAccountSharingMonitorEnabled()) return null;
  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) return null;

  const role = userAccess.sessionJwt?.role;
  if (isLearnerEntitlementStaffBypassRole(role)) return null;

  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret?.trim()) return null;

  let jwt: Record<string, unknown> | null = null;
  let req: Request;
  try {
    const built = await buildIncomingRequestForJwtRead("/api/subscriber-telemetry");
    req = built.req;
    jwt = (await getAuthSessionJwtFromRequest(built.req, secret)) as Record<string, unknown> | null;
  } catch {
    return null;
  }
  const headers = req.headers;
  const ua = headers.get("user-agent") ?? "";
  const ip = getTrustedClientIp(req);
  const regionHint = readRegionHint(headers);

  const sessionMaterial = sessionKeyMaterialFromJwt(jwt);
  const sessionKeyHash = hmacHex(`slot:${sessionMaterial}`).slice(0, 64);
  const userAgentHash = hmacHex(`ua:${ua.slice(0, 512)}`).slice(0, 64);
  const ipHash = hmacHex(`ip:${ip}`).slice(0, 64);

  const now = new Date();
  const ago24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const ago7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const ago2h = new Date(now.getTime() - 2 * 60 * 60 * 1000);

  try {
    await prisma.learnerSessionActivity.upsert({
      where: { userId_sessionKeyHash: { userId, sessionKeyHash } },
      create: {
        id: randomUUID(),
        userId,
        sessionKeyHash,
        userAgentHash,
        ipHash,
        regionHint,
        firstSeenAt: now,
        lastSeenAt: now,
      },
      update: {
        userAgentHash,
        ipHash,
        regionHint,
        lastSeenAt: now,
      },
    });

    await prisma.learnerSessionIpObservation.upsert({
      where: { userId_ipHash: { userId, ipHash } },
      create: {
        id: randomUUID(),
        userId,
        ipHash,
        regionHint,
        lastSeenAt: now,
      },
      update: {
        regionHint,
        lastSeenAt: now,
      },
    });

    const ipRows = await prisma.learnerSessionIpObservation.findMany({
      where: { userId, lastSeenAt: { gte: ago24h } },
      select: { ipHash: true },
      distinct: ["ipHash"],
    });
    const distinctIps24h = ipRows.length;

    const deviceRows = await prisma.learnerSessionActivity.findMany({
      where: { userId, lastSeenAt: { gte: ago7d }, revokedAt: null },
      select: { sessionKeyHash: true },
      distinct: ["sessionKeyHash"],
    });
    const activeDeviceSlots7d = deviceRows.length;

    const regionRows = await prisma.learnerSessionIpObservation.findMany({
      where: { userId, lastSeenAt: { gte: ago2h }, regionHint: { not: null } },
      select: { regionHint: true },
      take: 24,
    });
    const regions = new Set(regionRows.map((r) => r.regionHint).filter(Boolean));
    const multiRegionShortWindow = regions.size >= 2;

    const ev = evaluateAccountSharingSignals({
      distinctIps24h,
      activeDeviceSlots7d,
      multiRegionShortWindow,
      maxIps: accountSharingMaxIps24h(),
      maxDevices: accountSharingMaxActiveDevices(),
    });

    if (ev.reasons.length > 0) {
      safeServerLog("security", "account_sharing_soft_signal", {
        userIdPrefix: userId.slice(0, 8),
        reasons: ev.reasons.join(","),
        distinctIps24h: ev.distinctIps24h,
        activeDeviceSlots7d: ev.activeDeviceSlots7d,
        multiRegionShortWindow,
        severity: "info",
      });

      await prisma.learnerSessionActivity.updateMany({
        where: { userId, sessionKeyHash },
        data: { suspiciousReason: ev.reasons.join(",") },
      });

      if (!isAccountSharingSoftLimitOnly()) {
        const dayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const dayEnd = new Date(dayStart);
        dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);
        const existing = await prisma.protectionAbuseReview.findFirst({
          where: {
            userId,
            reason: "account_sharing_soft",
            dismissedAt: null,
            createdAt: { gte: dayStart, lt: dayEnd },
          },
          select: { id: true },
        });
        if (!existing) {
          await prisma.protectionAbuseReview.create({
            data: {
              userId,
              reason: "account_sharing_soft",
              score: ev.distinctIps24h + ev.activeDeviceSlots7d,
              evidence: {
                reasons: ev.reasons,
                distinctIps24h: ev.distinctIps24h,
                activeDeviceSlots7d: ev.activeDeviceSlots7d,
                multiRegionShortWindow,
              },
            },
          });
        }
      }

      if (isAccountSharingEnforceEnabled()) {
        return accountSharingEnforcementResponse();
      }
    }
  } catch (e) {
    safeServerLog("security", "account_sharing_touch_failed", {
      userIdPrefix: userId.slice(0, 8),
      severity: "warning",
      message: e instanceof Error ? e.message.slice(0, 200) : "unknown",
    });
  }

  return null;
}

export async function loadAccountSharingSessionHealth(userId: string): Promise<{
  suggestReauth: boolean;
  reasons: string[];
}> {
  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) {
    return { suggestReauth: false, reasons: [] };
  }
  const row = await prisma.learnerSessionActivity.findFirst({
    where: { userId, revokedAt: null, suspiciousReason: { not: null } },
    orderBy: { lastSeenAt: "desc" },
    select: { suspiciousReason: true },
  });
  if (!row?.suspiciousReason) return { suggestReauth: false, reasons: [] };
  const reasons = row.suspiciousReason.split(",").filter(Boolean);
  return {
    suggestReauth: reasons.length > 0 && !isAccountSharingEnforceEnabled(),
    reasons,
  };
}
