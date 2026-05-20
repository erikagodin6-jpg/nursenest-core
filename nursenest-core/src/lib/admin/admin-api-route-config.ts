/**
 * Route segment defaults for `app/api/admin/**` handlers.
 *
 * - **Isolation:** Admin APIs are only mounted under `/api/admin/*` and must not be imported from public
 *   marketing routes; keep heavy work (AI, bulk DB) here or behind step jobs.
 * - **Node runtime:** Prisma and long AI calls require Node (not Edge).
 * - **maxDuration:** Tune per route — step handlers process one unit per request; sync routes that still
 *   await the model should use a generous cap so the request completes without false timeouts.
 *
 * **Next.js 16 + Turbopack:** `export const runtime` / `maxDuration` in `route.ts` must be **string/number
 * literals** (e.g. `"nodejs"`, `120`) so segment config can be parsed at build time. Do not assign from
 * these constants in route files — keep values in sync with `ADMIN_AI_*` below when tuning caps.
 */

export const ADMIN_API_RUNTIME_NODE = "nodejs" as const;

/** Single-request sync AI routes (legacy / scripts) — prefer queue + `/step` for interactive admin UI. */
export const ADMIN_AI_SYNC_ROUTE_MAX_DURATION_SEC = 120;

/** One batch step (one lesson or one question) per invocation. */
export const ADMIN_AI_STEP_ROUTE_MAX_DURATION_SEC = 180;
