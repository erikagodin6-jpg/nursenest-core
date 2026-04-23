/**
 * Standard admin read contract — prefer this for new loaders and APIs over ad-hoc shapes.
 */
export type AdminDataResult<T> =
  | { status: "ok"; data: T }
  | { status: "error"; message: string }
  | { status: "degraded"; partial: Partial<T>; message?: string };

/** Server actions + JSON mutations: always return this instead of void / silent no-ops. */
export type AdminMutationResult = { ok: true } | { ok: false; error: string };
