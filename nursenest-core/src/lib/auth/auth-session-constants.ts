/**
 * Shared JWT session lifetime for Node `auth.ts` and Edge `auth-middleware.ts`.
 * They must match or middleware will reject cookies as expired early/late.
 */
export const JWT_SESSION_MAX_AGE_SEC = 30 * 24 * 60 * 60;
export const JWT_SESSION_UPDATE_AGE_SEC = 24 * 60 * 60;
