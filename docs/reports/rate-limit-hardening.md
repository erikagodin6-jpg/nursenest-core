# Rate Limit Hardening Report

**Generated:** 2026-06-01  
**File modified:** `src/lib/server/credentials-login-rate-limit.ts`

---

## Problem

`checkRedisFixedWindowLimit` silently bypassed all rate limiting when Redis was unavailable:

```typescript
// BEFORE — silent bypass
if (!redis) {
  return { ok: true, remaining: opts.max };   // ← always allows, no limits
}

// Also on Redis errors:
} catch (error) {
  return { ok: true, remaining: opts.max };   // ← always allows on any failure
}
```

Any Redis outage, misconfiguration, or cold-start race removed all brute-force protection from credential logins. An attacker who triggered a Redis failure (or simply found a deployment without Redis) could attempt unlimited password guesses.

---

## Fix: Process-Local Fallback Limiter

Added a bounded in-process fixed-window limiter that activates whenever Redis is unavailable (missing credentials, connection error, or runtime exception).

### Design

```typescript
// Fallback is MORE conservative than Redis — 60 % of the Redis limit by default
const effectiveMax = Math.max(1, Math.floor(max * fallbackLimitRatio()));
```

The fallback applies **60 % of the configured Redis limit** (`NN_RL_FALLBACK_RATIO=0.6`). This is intentional: a Redis outage should tighten security, not loosen it.

### Memory Bounding

The fallback store is bounded by `FALLBACK_MAX_BUCKETS` (default 2,000). When at capacity, the oldest bucket (by insertion order) is evicted before a new one is inserted. This caps memory at approximately:

```
2,000 buckets × ~100 bytes/bucket = ~200 KB worst case
```

For reference, a brute-force attack hitting 1,000 distinct IP+account pairs per minute would fill the bucket in 2 minutes — at which point the oldest (and likely expired) buckets are evicted.

### Fixed-Window Semantics

The fallback uses the same window parameters as the Redis path:
- Window: `CREDENTIALS_LOGIN_COMBO_WINDOW_MS = 60_000 ms`
- Max: `NN_CREDENTIALS_RL_COMBO_MAX` (default 80 for public, 480 for staff)
- Effective fallback max: `floor(max × ratio)` = 48 public / 288 staff at default ratio

### Observability

Both fallback-active cases now emit a structured log event instead of silently bypassing:

```typescript
safeServerLog("security", "rl_fallback_active", {
  keyPrefix: key.slice(0, 48),
  reason: "redis_unavailable" | "redis_error",
  detail?: string,
});
```

This is observable in PostHog and structured log ingestion. `reason: "redis_unavailable"` indicates credentials were never set; `reason: "redis_error"` indicates a mid-request failure.

---

## Configuration

| Env var | Default | Description |
|---------|---------|-------------|
| `NN_RL_FALLBACK_MAX_BUCKETS` | `2000` | Max in-process rate-limit buckets |
| `NN_RL_FALLBACK_RATIO` | `0.6` | Fallback limit as fraction of Redis limit (0–1.0) |
| `NN_CREDENTIALS_RL_COMBO_MAX` | `80` | Max failed attempts per (IP, account) per 60 s |
| `NN_CREDENTIALS_RL_STAFF_COMBO_MAX` | `480` | Same, for staff accounts |

---

## Before / After Behavior

| Condition | Before | After |
|-----------|--------|-------|
| Redis configured, working | Redis enforces limits | Redis enforces limits (unchanged) |
| Redis not configured | **Silent bypass** — unlimited | Fallback limiter at 60% of Redis limit |
| Redis configured, connection error | **Silent bypass** — unlimited | Fallback limiter at 60% of Redis limit |
| Redis configured, timeout | **Silent bypass** — unlimited | Fallback limiter at 60% of Redis limit |
| Rate limit exceeded | Blocks (Redis) | Blocks (Redis or fallback) |
| Successful login | Resets Redis keys | Resets Redis keys (unchanged; fallback TTL expires naturally) |

---

## Limitations

- The fallback store is process-local. On multi-instance deployments (Railway scale-out), each instance maintains its own bucket store. An attacker who spreads attempts across instances could exceed the effective limit by a factor of N (where N = instance count). This is a known trade-off of in-process rate limiting without Redis.
- The fallback does not survive process restart — buckets reset on deploy. An attacker who monitors deploys and bursts immediately after restart gets one window reset.
- Both limitations are inherent to any process-local rate limiter. The Redis path is the correct long-term solution; the fallback prevents total bypass, not perfect enforcement.

---

## No User-Visible Changes

- Legitimate users with valid credentials: `resetCredentialsLoginRateLimitKeys` clears both Redis and (via TTL expiry) the fallback store
- The fallback limit (48 attempts/min for public) is far above any realistic typo rate
- No new error surfaces exposed to end users
