import "server-only";

import { createHash, randomUUID } from "node:crypto";
import { prisma } from "@/lib/db";
import { CHECKOUT_POLICY_ACCEPTANCE_WORDING } from "@/lib/business-protection/policy-wording";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { getTrustedClientIp } from "@/lib/http/client-ip";
import { safeServerLog } from "@/lib/observability/safe-server-log";

function jsonHash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function headerValue(req: Request | undefined, name: string): string | null {
  return req?.headers.get(name)?.trim() || null;
}

function inferBrowser(userAgent: string): string | null {
  if (!userAgent) return null;
  if (/Edg\//.test(userAgent)) return "Edge";
  if (/Chrome\//.test(userAgent) && !/Chromium\//.test(userAgent)) return "Chrome";
  if (/Safari\//.test(userAgent) && !/Chrome\//.test(userAgent)) return "Safari";
  if (/Firefox\//.test(userAgent)) return "Firefox";
  return "Other";
}

function inferDevice(userAgent: string): string | null {
  if (!userAgent) return null;
  if (/iPad|Tablet|Android(?!.*Mobile)/i.test(userAgent)) return "tablet";
  if (/Mobile|iPhone|Android/i.test(userAgent)) return "mobile";
  return "desktop";
}

function requestContext(req?: Request): {
  ipAddress: string | null;
  country: string | null;
  userAgent: string | null;
  browser: string | null;
  device: string | null;
} {
  const userAgent = headerValue(req, "user-agent");
  return {
    ipAddress: req ? getTrustedClientIp(req) : null,
    country:
      headerValue(req, "cf-ipcountry") ??
      headerValue(req, "x-vercel-ip-country") ??
      headerValue(req, "x-country-code"),
    userAgent,
    browser: inferBrowser(userAgent ?? ""),
    device: inferDevice(userAgent ?? ""),
  };
}

export async function recordCheckoutPolicyAcceptance(args: {
  userId: string;
  scope: string;
  policyBundleVersion: string;
  acceptedAt: Date;
  req?: Request;
  stripeCheckoutSessionId?: string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  planCode?: string | null;
  amountTotal?: number | null;
  currency?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  if (!isDatabaseUrlConfigured()) return;
  const ctx = requestContext(args.req);
  const wording = [...CHECKOUT_POLICY_ACCEPTANCE_WORDING];
  const metadata = JSON.stringify(args.metadata ?? {});
  const wordingJson = JSON.stringify(wording);
  try {
    await prisma.$executeRaw`
      INSERT INTO "policy_acceptance_records" (
        "id",
        "user_id",
        "scope",
        "policy_bundle_version",
        "accepted_at",
        "ip_address",
        "country",
        "user_agent",
        "browser",
        "device",
        "wording",
        "wording_sha256",
        "stripe_checkout_session_id",
        "stripe_customer_id",
        "stripe_subscription_id",
        "plan_code",
        "amount_total",
        "currency",
        "metadata"
      )
      VALUES (
        ${randomUUID()},
        ${args.userId},
        ${args.scope},
        ${args.policyBundleVersion},
        ${args.acceptedAt},
        ${ctx.ipAddress},
        ${ctx.country},
        ${ctx.userAgent},
        ${ctx.browser},
        ${ctx.device},
        ${wordingJson}::jsonb,
        ${jsonHash(wording)},
        ${args.stripeCheckoutSessionId ?? null},
        ${args.stripeCustomerId ?? null},
        ${args.stripeSubscriptionId ?? null},
        ${args.planCode ?? null},
        ${args.amountTotal ?? null},
        ${args.currency ?? null},
        ${metadata}::jsonb
      )
    `;
  } catch (error) {
    safeServerLog("business_protection", "policy_acceptance_record_failed", {
      userIdPrefix: args.userId.slice(0, 8),
      scope: args.scope,
      severity: "warning",
      detail: error instanceof Error ? error.message.slice(0, 180) : "unknown",
    });
  }
}

export async function recordAdminAuditEvent(args: {
  actorUserId?: string | null;
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  req?: Request;
  result?: "allowed" | "denied" | "failed";
  oldValue?: unknown;
  newValue?: unknown;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  if (!isDatabaseUrlConfigured()) return;
  const ctx = requestContext(args.req);
  const oldValue = args.oldValue == null ? null : JSON.stringify(args.oldValue);
  const newValue = args.newValue == null ? null : JSON.stringify(args.newValue);
  const metadata = JSON.stringify(args.metadata ?? {});
  let path: string | null = null;
  try {
    path = args.req ? new URL(args.req.url).pathname : null;
  } catch {
    path = null;
  }
  try {
    await prisma.$executeRaw`
      INSERT INTO "admin_audit_events" (
        "id",
        "actor_user_id",
        "action",
        "target_type",
        "target_id",
        "method",
        "path",
        "result",
        "ip_address",
        "country",
        "user_agent",
        "old_value",
        "new_value",
        "metadata"
      )
      VALUES (
        ${randomUUID()},
        ${args.actorUserId ?? null},
        ${args.action},
        ${args.targetType ?? null},
        ${args.targetId ?? null},
        ${args.req?.method ?? null},
        ${path},
        ${args.result ?? "allowed"},
        ${ctx.ipAddress},
        ${ctx.country},
        ${ctx.userAgent},
        ${oldValue}::jsonb,
        ${newValue}::jsonb,
        ${metadata}::jsonb
      )
    `;
  } catch (error) {
    safeServerLog("business_protection", "admin_audit_event_failed", {
      actorPrefix: args.actorUserId?.slice(0, 8) ?? "",
      action: args.action,
      severity: "warning",
      detail: error instanceof Error ? error.message.slice(0, 180) : "unknown",
    });
  }
}

export async function recordChargebackEvidenceExport(args: {
  userId: string;
  generatedByUserId?: string | null;
  format: "json" | "txt" | "html";
  summary: Record<string, unknown>;
}): Promise<void> {
  if (!isDatabaseUrlConfigured()) return;
  try {
    await prisma.$executeRaw`
      INSERT INTO "chargeback_evidence_exports" (
        "id",
        "user_id",
        "generated_by_user_id",
        "format",
        "summary"
      )
      VALUES (
        ${randomUUID()},
        ${args.userId},
        ${args.generatedByUserId ?? null},
        ${args.format},
        ${JSON.stringify(args.summary)}::jsonb
      )
    `;
  } catch (error) {
    safeServerLog("business_protection", "chargeback_export_record_failed", {
      userIdPrefix: args.userId.slice(0, 8),
      adminPrefix: args.generatedByUserId?.slice(0, 8) ?? "",
      severity: "warning",
      detail: error instanceof Error ? error.message.slice(0, 180) : "unknown",
    });
  }
}

export type PolicyAcceptanceEvidenceRow = {
  scope: string;
  policyBundleVersion: string;
  acceptedAt: string;
  country: string | null;
  browser: string | null;
  device: string | null;
  stripeCheckoutSessionId: string | null;
  planCode: string | null;
  amountTotal: number | null;
  currency: string | null;
  wordingSha256: string;
};

export async function loadPolicyAcceptanceEvidenceRows(userId: string): Promise<PolicyAcceptanceEvidenceRow[]> {
  if (!isDatabaseUrlConfigured()) return [];
  try {
    const rows = await prisma.$queryRaw<
      Array<{
        scope: string;
        policy_bundle_version: string;
        accepted_at: Date;
        country: string | null;
        browser: string | null;
        device: string | null;
        stripe_checkout_session_id: string | null;
        plan_code: string | null;
        amount_total: number | null;
        currency: string | null;
        wording_sha256: string;
      }>
    >`
      SELECT
        "scope",
        "policy_bundle_version",
        "accepted_at",
        "country",
        "browser",
        "device",
        "stripe_checkout_session_id",
        "plan_code",
        "amount_total",
        "currency",
        "wording_sha256"
      FROM "policy_acceptance_records"
      WHERE "user_id" = ${userId}
      ORDER BY "accepted_at" DESC
      LIMIT 20
    `;
    return rows.map((row) => ({
      scope: row.scope,
      policyBundleVersion: row.policy_bundle_version,
      acceptedAt: row.accepted_at.toISOString(),
      country: row.country,
      browser: row.browser,
      device: row.device,
      stripeCheckoutSessionId: row.stripe_checkout_session_id,
      planCode: row.plan_code,
      amountTotal: row.amount_total,
      currency: row.currency,
      wordingSha256: row.wording_sha256,
    }));
  } catch {
    return [];
  }
}
