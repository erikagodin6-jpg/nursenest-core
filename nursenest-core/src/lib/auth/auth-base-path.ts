/**
 * **Single source of truth** for Auth.js / NextAuth `basePath` (App Router catch-all at
 * `src/app/api/auth/[...nextauth]/route.ts`).
 *
 * Must remain **`/api/auth`**. Do **not** derive this from `AUTH_URL` / `NEXTAUTH_URL` — those env vars
 * must be **origin-only** (e.g. `https://www.nursenest.ca`). If they include a path, NextAuth can infer
 * a wrong `basePath` and break `/api/auth/callback/credentials` (credentials sign-in 400 / silent failure).
 *
 * Import {@link PINNED_AUTH_BASE_PATH} in **every** NextAuth instance (`auth.ts`, `auth-middleware.ts`)
 * so Node and Edge configs cannot drift.
 */
export const PINNED_AUTH_BASE_PATH = "/api/auth" as const;

/**
 * Runtime guard: if the pinned constant is ever edited incorrectly, fail fast at startup (Node
 * instrumentation) instead of serving a broken login surface.
 */
export function assertPinnedAuthBasePath(): void {
  if (PINNED_AUTH_BASE_PATH !== "/api/auth") {
    const msg = `[nursenest-core] auth: PINNED_AUTH_BASE_PATH must be "/api/auth" (got "${String(PINNED_AUTH_BASE_PATH)}") — credentials routes will break.`;
    console.error(msg);
    if (process.env.NODE_ENV === "production") {
      throw new Error(msg);
    }
  }
}
