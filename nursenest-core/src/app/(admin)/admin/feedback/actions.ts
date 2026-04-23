"use server";

/**
 * Feedback triage actions. For future alerting (Slack/email), enqueue from these mutations
 * when `status` becomes `NEW` or severity is `CRITICAL`, or call a notifications service — keep side effects async and bounded.
 */
import { revalidatePath } from "next/cache";
import { UserFeedbackStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guards";
import type { AdminMutationResult } from "@/lib/admin/admin-data-result";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const STATUSES: UserFeedbackStatus[] = ["NEW", "UNDER_REVIEW", "FIXED", "DISMISSED"];

function isStatus(v: string): v is UserFeedbackStatus {
  return (STATUSES as readonly string[]).includes(v);
}

const INTERNAL_NOTES_MAX = 100_000;

function revalidateFeedbackInbox(): void {
  revalidatePath("/admin/feedback");
}

export async function updateUserFeedbackReportStatus(_prev: AdminMutationResult, formData: FormData): Promise<AdminMutationResult> {
  await requireAdmin();
  const id = String(formData.get("reportId") ?? "").trim();
  const statusRaw = String(formData.get("status") ?? "").trim();
  if (!id || !isStatus(statusRaw)) {
    safeServerLog("admin_feedback", "update_status_invalid", {
      hasId: Boolean(id),
      statusRaw: statusRaw.slice(0, 32),
    });
    return { ok: false, error: "Missing report id or invalid status." };
  }
  try {
    await prisma.userFeedbackReport.update({
      where: { id },
      data: { status: statusRaw },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Database update failed";
    safeServerLog("admin_feedback", "update_status_failed", {
      reportIdPrefix: id.slice(0, 8),
      detail: msg.slice(0, 180),
    });
    return { ok: false, error: msg };
  }
  safeServerLog("admin_feedback", "update_status_ok", { reportIdPrefix: id.slice(0, 8), status: statusRaw });
  revalidateFeedbackInbox();
  return { ok: true };
}

/** Same as form status update — used by quick-action buttons. */
export async function setUserFeedbackReportStatus(reportId: string, status: UserFeedbackStatus): Promise<AdminMutationResult> {
  await requireAdmin();
  if (!isStatus(status)) {
    safeServerLog("admin_feedback", "set_status_invalid", { status });
    return { ok: false, error: "Invalid status." };
  }
  try {
    await prisma.userFeedbackReport.update({
      where: { id: reportId },
      data: { status },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Database update failed";
    safeServerLog("admin_feedback", "set_status_failed", { reportIdPrefix: reportId.slice(0, 8), detail: msg.slice(0, 180) });
    return { ok: false, error: msg };
  }
  safeServerLog("admin_feedback", "set_status_ok", { reportIdPrefix: reportId.slice(0, 8), status });
  revalidateFeedbackInbox();
  return { ok: true };
}

export async function saveUserFeedbackInternalNotes(_prev: AdminMutationResult, formData: FormData): Promise<AdminMutationResult> {
  await requireAdmin();
  const id = String(formData.get("reportId") ?? "").trim();
  const raw = String(formData.get("internalNotes") ?? "");
  if (!id) {
    safeServerLog("admin_feedback", "save_notes_invalid", { reason: "missing_report_id" });
    return { ok: false, error: "Missing report id." };
  }
  const internalNotes = raw.length > INTERNAL_NOTES_MAX ? raw.slice(0, INTERNAL_NOTES_MAX) : raw;
  try {
    await prisma.userFeedbackReport.update({
      where: { id },
      data: { internalNotes: internalNotes.length ? internalNotes : null },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Database update failed";
    safeServerLog("admin_feedback", "save_notes_failed", { reportIdPrefix: id.slice(0, 8), detail: msg.slice(0, 180) });
    return { ok: false, error: msg };
  }
  safeServerLog("admin_feedback", "save_notes_ok", { reportIdPrefix: id.slice(0, 8) });
  revalidateFeedbackInbox();
  return { ok: true };
}

export async function linkUserFeedbackDuplicate(_prev: AdminMutationResult, formData: FormData): Promise<AdminMutationResult> {
  await requireAdmin();
  const id = String(formData.get("reportId") ?? "").trim();
  const primaryId = String(formData.get("primaryReportId") ?? "").trim();
  if (!id || !primaryId || id === primaryId) {
    safeServerLog("admin_feedback", "link_duplicate_invalid", {
      hasId: Boolean(id),
      hasPrimary: Boolean(primaryId),
      same: id === primaryId,
    });
    return { ok: false, error: "Enter a different primary report id." };
  }

  const [row, primary] = await Promise.all([
    prisma.userFeedbackReport.findUnique({ where: { id }, select: { id: true } }),
    prisma.userFeedbackReport.findUnique({ where: { id: primaryId }, select: { id: true, duplicateOfId: true } }),
  ]);
  if (!row || !primary) {
    safeServerLog("admin_feedback", "link_duplicate_not_found", {
      reportIdPrefix: id.slice(0, 8),
      primaryPrefix: primaryId.slice(0, 8),
    });
    return { ok: false, error: "Report or primary id not found." };
  }
  if (primary.duplicateOfId === id) {
    safeServerLog("admin_feedback", "link_duplicate_cycle", { reportIdPrefix: id.slice(0, 8) });
    return { ok: false, error: "Cannot link: would create a duplicate cycle." };
  }

  try {
    await prisma.userFeedbackReport.update({
      where: { id },
      data: { duplicateOfId: primaryId },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Database update failed";
    safeServerLog("admin_feedback", "link_duplicate_failed", { detail: msg.slice(0, 180) });
    return { ok: false, error: msg };
  }
  safeServerLog("admin_feedback", "link_duplicate_ok", { reportIdPrefix: id.slice(0, 8), primaryPrefix: primaryId.slice(0, 8) });
  revalidateFeedbackInbox();
  return { ok: true };
}

export async function clearUserFeedbackDuplicate(_prev: AdminMutationResult, formData: FormData): Promise<AdminMutationResult> {
  await requireAdmin();
  const id = String(formData.get("reportId") ?? "").trim();
  if (!id) {
    safeServerLog("admin_feedback", "clear_duplicate_invalid", { reason: "missing_report_id" });
    return { ok: false, error: "Missing report id." };
  }
  try {
    await prisma.userFeedbackReport.update({
      where: { id },
      data: { duplicateOfId: null },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Database update failed";
    safeServerLog("admin_feedback", "clear_duplicate_failed", { reportIdPrefix: id.slice(0, 8), detail: msg.slice(0, 180) });
    return { ok: false, error: msg };
  }
  safeServerLog("admin_feedback", "clear_duplicate_ok", { reportIdPrefix: id.slice(0, 8) });
  revalidateFeedbackInbox();
  return { ok: true };
}
