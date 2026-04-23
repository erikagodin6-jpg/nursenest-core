/**
 * Compatibility shim for server actions using the historical admin action envelope
 * (`useFormState` + feedback triage). Prefer {@link AdminMutationResult} from `./admin-data-result` for new code.
 */
export type { AdminDataResult } from "./admin-data-result";
import { adminMutationFailure } from "./admin-data-result";

export type AdminActionResult =
  | { ok: true }
  | { ok: false; code: string; message: string };

export function adminActionSuccess(): AdminActionResult {
  return { ok: true };
}

export function adminActionFailure(code: string, message: string): AdminActionResult {
  return adminMutationFailure(code, message);
}
