/**
 * Progressive login lockout is stored in-memory (per Node instance), not in Postgres.
 *
 * Options:
 * - Wait for the lock window to expire and retry.
 * - Redeploy / restart clears the map (all users) — use only if coordinated.
 * - Super-admins can call POST /api/debug/clear-login-lock on a running instance with body:
 *     { "identifier": "same string the user types at login (email or username)" }
 *   while authenticated as staff with super tier.
 *
 * This script only prints guidance — it cannot clear another machine's memory.
 */
console.log(`Login lockout is in-memory per app instance (see src/lib/auth/login-lockout.ts).
To clear for one identifier on a live instance, use POST /api/debug/clear-login-lock (super admin).
`);
