/**
 * Standard admin read contract — prefer this for new loaders and APIs over ad-hoc shapes.
 * Server actions that use `useFormState` may still use {@link AdminActionResult} in `@/lib/admin/admin-action-result`.
 */
export type AdminDataResult<T> =
  | { status: "ok"; data: T }
  | { status: "error"; message: string }
  | { status: "degraded"; partial: Partial<T>; message?: string };

/** Server actions + JSON mutations: always return this instead of void / silent no-ops. */
export type AdminMutationResult =
  | { ok: true; message?: string }
  | { ok: false; code: string; message: string };

export function adminMutationFailure(code: string, message: string): AdminMutationResult {
  return { ok: false, code, message };
}
