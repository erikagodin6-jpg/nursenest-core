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
