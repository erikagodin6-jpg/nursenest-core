"use server";

/**
 * Feedback triage actions. For future alerting (Slack/email), enqueue from these mutations
 * when `status` becomes `NEW` or severity is `CRITICAL`, or call a notifications service — keep side effects async and bounded.
 */
import { revalidatePath } from "next/cache";
import { UserFeedbackStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guards";

const STATUSES: UserFeedbackStatus[] = ["NEW", "UNDER_REVIEW", "FIXED", "DISMISSED"];

function isStatus(v: string): v is UserFeedbackStatus {
  return (STATUSES as readonly string[]).includes(v);
}

const INTERNAL_NOTES_MAX = 100_000;

function revalidateFeedbackInbox(): void {
  revalidatePath("/admin/feedback");
}

export async function updateUserFeedbackReportStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("reportId") ?? "").trim();
  const statusRaw = String(formData.get("status") ?? "").trim();
  if (!id || !isStatus(statusRaw)) {
    return;
  }
  await prisma.userFeedbackReport.update({
    where: { id },
    data: { status: statusRaw },
  });
  revalidateFeedbackInbox();
}

/** Same as form status update — used by quick-action buttons. */
export async function setUserFeedbackReportStatus(reportId: string, status: UserFeedbackStatus): Promise<void> {
  await requireAdmin();
  if (!isStatus(status)) return;
  await prisma.userFeedbackReport.update({
    where: { id: reportId },
    data: { status },
  });
  revalidateFeedbackInbox();
}

export async function saveUserFeedbackInternalNotes(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("reportId") ?? "").trim();
  const raw = String(formData.get("internalNotes") ?? "");
  if (!id) return;
  const internalNotes = raw.length > INTERNAL_NOTES_MAX ? raw.slice(0, INTERNAL_NOTES_MAX) : raw;
  await prisma.userFeedbackReport.update({
    where: { id },
    data: { internalNotes: internalNotes.length ? internalNotes : null },
  });
  revalidateFeedbackInbox();
}

export async function linkUserFeedbackDuplicate(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("reportId") ?? "").trim();
  const primaryId = String(formData.get("primaryReportId") ?? "").trim();
  if (!id || !primaryId || id === primaryId) return;

  const [row, primary] = await Promise.all([
    prisma.userFeedbackReport.findUnique({ where: { id }, select: { id: true } }),
    prisma.userFeedbackReport.findUnique({ where: { id: primaryId }, select: { id: true, duplicateOfId: true } }),
  ]);
  if (!row || !primary) return;
  /** Avoid immediate 2-cycle (A → B while B → A). */
  if (primary.duplicateOfId === id) return;

  await prisma.userFeedbackReport.update({
    where: { id },
    data: { duplicateOfId: primaryId },
  });
  revalidateFeedbackInbox();
}

export async function clearUserFeedbackDuplicate(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("reportId") ?? "").trim();
  if (!id) return;
  await prisma.userFeedbackReport.update({
    where: { id },
    data: { duplicateOfId: null },
  });
  revalidateFeedbackInbox();
}
