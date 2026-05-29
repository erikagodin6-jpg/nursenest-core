"use server";

import { revalidatePath } from "next/cache";
import { BetaFeatureKey, Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import { sendTransactionalEmailHtml, htmlEmailShell } from "@/lib/email/resend-transactional";
import { appOriginForEmail } from "@/lib/email/app-origin";
import {
  betaFeaturesToLabels,
  generateDisplayBetaCode,
  hashBetaCode,
  normalizeBetaCode,
  parseBetaFeatures,
} from "@/lib/beta/beta-access";
import { safeServerLog } from "@/lib/observability/safe-server-log";

function adminUserId(session: Awaited<ReturnType<typeof requireAdmin>>): string | null {
  return (session.user as { id?: string })?.id ?? null;
}

function revalidateBetaAdmin(): void {
  revalidatePath("/admin/beta");
  revalidatePath("/app/account/beta");
}

function optionalDate(value: FormDataEntryValue | null): Date | null {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isFinite(date.getTime()) ? date : null;
}

function optionalPositiveInt(value: FormDataEntryValue | null): number | null {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function createBetaAccessCode(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const requestedCode = String(formData.get("code") ?? "").trim();
  const features = parseBetaFeatures(formData.getAll("features"));
  if (!name || features.length === 0) return;

  const displayCode = normalizeBetaCode(requestedCode || generateDisplayBetaCode(name));
  try {
    await prisma.betaAccessCode.create({
      data: {
        name: name.slice(0, 120),
        displayCode,
        codeHash: hashBetaCode(displayCode),
        description: description ? description.slice(0, 800) : null,
        features,
        expiresAt: optionalDate(formData.get("expiresAt")),
        maxRedemptions: optionalPositiveInt(formData.get("maxRedemptions")),
        createdByUserId: adminUserId(session),
      },
    });
  } catch (error) {
    safeServerLog("beta_access_admin", "create_code_failed", {
      codePrefix: displayCode.slice(0, 12),
      detail: error instanceof Error ? error.message.slice(0, 180) : "unknown",
    });
  }
  revalidateBetaAdmin();
}

export async function disableBetaAccessCode(formData: FormData): Promise<void> {
  await requireAdmin();
  const codeId = String(formData.get("codeId") ?? "").trim();
  if (!codeId) return;
  await prisma.betaAccessCode
    .update({ where: { id: codeId }, data: { enabled: false, disabledAt: new Date() } })
    .catch((error) => {
      safeServerLog("beta_access_admin", "disable_code_failed", {
        codeIdPrefix: codeId.slice(0, 8),
        detail: error instanceof Error ? error.message.slice(0, 180) : "unknown",
      });
    });
  revalidateBetaAdmin();
}

export async function enableBetaAccessCode(formData: FormData): Promise<void> {
  await requireAdmin();
  const codeId = String(formData.get("codeId") ?? "").trim();
  if (!codeId) return;
  await prisma.betaAccessCode
    .update({ where: { id: codeId }, data: { enabled: true, disabledAt: null } })
    .catch((error) => {
      safeServerLog("beta_access_admin", "enable_code_failed", {
        codeIdPrefix: codeId.slice(0, 8),
        detail: error instanceof Error ? error.message.slice(0, 180) : "unknown",
      });
    });
  revalidateBetaAdmin();
}

export async function extendBetaAccessCode(formData: FormData): Promise<void> {
  await requireAdmin();
  const codeId = String(formData.get("codeId") ?? "").trim();
  const expiresAt = optionalDate(formData.get("expiresAt"));
  if (!codeId) return;
  await prisma.betaAccessCode
    .update({ where: { id: codeId }, data: { expiresAt } })
    .catch((error) => {
      safeServerLog("beta_access_admin", "extend_code_failed", {
        codeIdPrefix: codeId.slice(0, 8),
        detail: error instanceof Error ? error.message.slice(0, 180) : "unknown",
      });
    });
  revalidateBetaAdmin();
}

export async function revokeBetaAccessGrant(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const grantId = String(formData.get("grantId") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim();
  if (!grantId) return;
  await prisma.betaAccessGrant
    .update({
      where: { id: grantId },
      data: {
        revokedAt: new Date(),
        revokedByUserId: adminUserId(session),
        revokeReason: reason ? reason.slice(0, 500) : "Revoked by admin",
      },
    })
    .catch((error) => {
      safeServerLog("beta_access_admin", "revoke_grant_failed", {
        grantIdPrefix: grantId.slice(0, 8),
        detail: error instanceof Error ? error.message.slice(0, 180) : "unknown",
      });
    });
  revalidateBetaAdmin();
}

export async function sendBetaInvitationEmail(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const codeId = String(formData.get("codeId") ?? "").trim();
  const targetEmail = String(formData.get("targetEmail") ?? "").trim().toLowerCase();
  const expectations = String(formData.get("expectations") ?? "").trim();
  if (!codeId || !targetEmail.includes("@")) return;

  const code = await prisma.betaAccessCode.findUnique({
    where: { id: codeId },
    select: { id: true, displayCode: true, name: true, description: true, features: true },
  });
  if (!code) return;

  const origin = appOriginForEmail();
  const features = betaFeaturesToLabels(code.features as BetaFeatureKey[]).join(", ");
  const subject = `Your NurseNest beta invitation: ${code.name}`;
  const feedbackUrl = `${origin}/app/account/beta`;
  const html = htmlEmailShell(
    "You're invited to the NurseNest Beta Program",
    `<p>Welcome to the NurseNest Beta Program.</p>
      <p><strong>Beta access code:</strong> ${escapeHtml(code.displayCode)}</p>
      <p><strong>Unlocked features:</strong> ${escapeHtml(features || "Beta previews")}</p>
      ${code.description ? `<p>${escapeHtml(code.description)}</p>` : ""}
      ${expectations ? `<p><strong>Testing expectations:</strong> ${escapeHtml(expectations)}</p>` : ""}
      <p>Redeem your code from Account Settings, then send feedback from the Beta Program page.</p>
      <p><a href="${escapeHtml(feedbackUrl)}">Redeem code and provide feedback</a></p>`,
  );
  const text = `Welcome to the NurseNest Beta Program.\n\nCode: ${code.displayCode}\nFeatures: ${features}\nRedeem and provide feedback: ${feedbackUrl}`;
  const result = await sendTransactionalEmailHtml({ to: targetEmail, subject, html, text });

  await prisma.betaInvitationEmailLog
    .create({
      data: {
        codeId,
        targetEmail,
        sentByUserId: adminUserId(session),
        status: result.ok ? "SENT" : "FAILED",
        failureReason: result.ok ? null : result.skippedReason ?? "send_failed",
      },
    })
    .catch((error) => {
      if (error instanceof Prisma.PrismaClientKnownRequestError) return;
      safeServerLog("beta_access_admin", "invitation_log_failed", {
        detail: error instanceof Error ? error.message.slice(0, 180) : "unknown",
      });
    });
  revalidateBetaAdmin();
}
