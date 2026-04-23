/**
 * Legacy admin server-action envelope used by feedback triage (`useFormState` + `nn_fb_op` dispatcher).
 * Prefer {@link AdminMutationResult} / {@link AdminDataResult} for new surfaces.
 */
export type { AdminDataResult } from "@/lib/admin/admin-data-result";

export type AdminActionResult =
  | { ok: true }
  | { ok: false; code: string; message: string };

export function adminActionSuccess(): AdminActionResult {
  return { ok: true };
}

export function adminActionFailure(code: string, message: string): AdminActionResult {
  return { ok: false, code, message };
}
