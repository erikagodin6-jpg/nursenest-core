/**
 * Compact contract for admin server actions and mutation APIs.
 * Callers must treat `ok: false` as a failed mutation (never as silent success).
 */
export type AdminActionResult =
  | { ok: true; message?: string }
  | { ok: false; code: string; message: string };

export function adminActionSuccess(message?: string): AdminActionResult {
  return message ? { ok: true, message } : { ok: true };
}

export function adminActionFailure(code: string, message: string): AdminActionResult {
  return { ok: false, code, message };
}
