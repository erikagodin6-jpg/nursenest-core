/**
 * Shared JWT session lifetime for Node `auth.ts` and Edge `auth-middleware.ts`.
 * They must match or middleware will reject cookies as expired early/late.
 *
 * `session.maxAge` is the cookie ceiling — per-login TTL is set on the JWT (`exp`) in `auth-callbacks`
 * when the user checks "Stay signed in" (long) vs unchecks (brief).
 */
export const JWT_SESSION_REMEMBER_MAX_AGE_SEC = 30 * 24 * 60 * 60;
/** Shorter session when the user opts out of "stay signed in" (shared/public device). */
export const JWT_SESSION_BRIEF_MAX_AGE_SEC = 2 * 24 * 60 * 60;

export const JWT_SESSION_MAX_AGE_SEC = JWT_SESSION_REMEMBER_MAX_AGE_SEC;
export const JWT_SESSION_UPDATE_AGE_SEC = 24 * 60 * 60;

/**
 * Hard ceiling on calendar span from {@link JWT.loginAtSec} for "stay signed in" sessions when
 * applying sliding `exp` bumps (study/admin realism without unbounded lifetime).
 */
export const JWT_SESSION_REMEMBER_ABSOLUTE_CAP_SEC = 90 * 24 * 60 * 60;

/** Cold Postgres / NextAuth `auth()` on small instances can exceed 1s — bounds `auth()` before JWT cookie fallback. */
export const AUTH_NODE_SESSION_READ_TIMEOUT_MS = 2000;
