import type { UserFeedbackStatus } from "@prisma/client";
import type { AdminActionResult } from "@/lib/admin/admin-action-result";
import { adminActionFailure } from "@/lib/admin/admin-action-result";

const STATUSES: UserFeedbackStatus[] = ["NEW", "UNDER_REVIEW", "FIXED", "DISMISSED"];

function isStatus(v: string): v is UserFeedbackStatus {
  return (STATUSES as readonly string[]).includes(v);
}

export const INTERNAL_NOTES_MAX = 100_000;

export type ParsedFeedbackTriage =
  | { op: "set_status"; reportId: string; status: UserFeedbackStatus }
  | { op: "save_notes"; reportId: string; internalNotes: string }
  | { op: "link_duplicate"; reportId: string; primaryReportId: string }
  | { op: "clear_duplicate"; reportId: string };

/**
 * Pure parser for feedback triage forms — used by the server action and unit tests.
 */
export function parseFeedbackTriageFormData(formData: FormData): AdminActionResult | { ok: true; data: ParsedFeedbackTriage } {
  const op = String(formData.get("nn_fb_op") ?? "").trim();
  const reportId = String(formData.get("reportId") ?? "").trim();

  if (op === "set_status") {
    const statusRaw = String(formData.get("status") ?? "").trim();
    if (!reportId) {
      return adminActionFailure("feedback_missing_report", "Report id is required.");
    }
    if (!isStatus(statusRaw)) {
      return adminActionFailure("feedback_invalid_status", "Choose a valid status.");
    }
    return { ok: true, data: { op: "set_status", reportId, status: statusRaw } };
  }

  if (op === "save_notes") {
    if (!reportId) {
      return adminActionFailure("feedback_missing_report", "Report id is required.");
    }
    const raw = String(formData.get("internalNotes") ?? "");
    const internalNotes = raw.length > INTERNAL_NOTES_MAX ? raw.slice(0, INTERNAL_NOTES_MAX) : raw;
    return { ok: true, data: { op: "save_notes", reportId, internalNotes } };
  }

  if (op === "link_duplicate") {
    const primaryReportId = String(formData.get("primaryReportId") ?? "").trim();
    if (!reportId) {
      return adminActionFailure("feedback_missing_report", "Report id is required.");
    }
    if (!primaryReportId) {
      return adminActionFailure("feedback_missing_primary", "Enter the canonical report id to link.");
    }
    if (reportId === primaryReportId) {
      return adminActionFailure("feedback_duplicate_self", "Cannot link a report to itself.");
    }
    return { ok: true, data: { op: "link_duplicate", reportId, primaryReportId } };
  }

  if (op === "clear_duplicate") {
    if (!reportId) {
      return adminActionFailure("feedback_missing_report", "Report id is required.");
    }
    return { ok: true, data: { op: "clear_duplicate", reportId } };
  }

  if (!op) {
    return adminActionFailure("feedback_missing_op", "Missing triage action.");
  }
  return adminActionFailure("feedback_unknown_op", "Unknown triage action.");
}
