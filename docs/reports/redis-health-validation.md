# Redis Health Validation Report

**Generated:** 2026-06-01  
**Files modified:**
- `src/lib/server/redis.ts`
- `src/lib/cache/redis-content-cache.ts`

---

## Problem

Before this sprint, both Redis client implementations had no startup validation and no persistent health state:

### `redis.ts` (primary — `@upstash/redis` SDK)
- `createRedisClient()` returned a client object without testing connectivity
- No distinction between "not configured", "misconfigured URL", or "configured but unreachable"
- First Redis failure only appeared as a silent `null` return from `cacheGet`
- `isRedisConfigured()` returned `true` even for a malformed URL that would fail every call

### `redis-content-cache.ts` (secondary — fetch-based)
- `isCacheConfigured()` checked env vars but never verified connectivity
- Every call swallowed errors silently with no state tracking
- No way to distinguish "never tried" from "tried and failed"

---

## Fix: `redis.ts` — Three-State Detection + Non-Blocking Ping

### Health State Type

```typescript
export type RedisHealthState =
  | "unchecked"     // client not yet created
  | "misconfigured" // env vars present but URL/token shape is wrong
  | "unavailable"   // env vars absent — Redis explicitly not configured
  | "reachable"     // ping succeeded
  | "unreachable";  // env vars present but connection / ping failed
```

### Detection Logic at Client Creation

```typescript
function createRedisClient(): RedisJsonClient | null {
  const url   = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!url && !token) {
    healthState = "unavailable";   // expected — Redis not provisioned
    console.log("[nursenest-core] redis: unavailable — ...");
    return null;
  }

  if (!url || !token) {
    healthState = "misconfigured"; // operator error — partial credentials
    console.error("[nursenest-core] redis: misconfigured — one of ... is missing");
    return null;
  }

  if (!validateRedisUrl(url)) {
    healthState = "misconfigured"; // copied wrong value
    console.error("[nursenest-core] redis: misconfigured — URL shape invalid");
    return null;
  }

  // Client created — schedule non-blocking ping
  Promise.resolve().then(async () => {
    try {
      await r.ping();
      healthState = "reachable";
      console.log("[nursenest-core] redis: reachable — ping OK");
    } catch (err) {
      healthState = "unreachable";
      console.error(`[nursenest-core] redis: unreachable — ping failed: ...`);
    }
  });

  return client;
}
```

### Non-Blocking Requirement

The ping is scheduled via `Promise.resolve().then(...)` — it does not block client creation, module initialization, or the first request. If the ping succeeds before the first real Redis call, subsequent callers see `"reachable"`. If the ping fails before the first real Redis call, callers see `"unreachable"` and can log accordingly.

Startup is never blocked regardless of network latency or Redis unavailability.

### Public API

```typescript
export function getRedisHealthState(): RedisHealthState

export function getRedisHealthSnapshot(): {
  state: RedisHealthState;
  checkedAt: number | null;   // Unix ms of last ping, or null if unchecked
}
```

---

## Fix: `redis-content-cache.ts` — Reactive Health State

The secondary client (used by `manifest-loader.ts`) cannot perform a proactive ping (it's stateless fetch-based). Instead it tracks health reactively from actual call outcomes:

```typescript
export function getContentCacheHealthState(): ContentCacheHealthState
// Returns: "unchecked" | "unavailable" | "reachable" | "unreachable"
```

State transitions:
- `"unavailable"` — set immediately when `isCacheConfigured()` is called with no env vars
- `"reachable"` — set on first successful `cacheGet` or `cacheSet`
- `"unreachable"` — set on first failed `cacheGet` or `cacheSet`

This means the content cache health is unknown until the first real use, then accurate from that point forward.

---

## Log Output Matrix

| Condition | Log level | Message |
|-----------|-----------|---------|
| Both env vars absent | `console.log` | `redis: unavailable — UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are not set` |
| One env var missing | `console.error` | `redis: misconfigured — one of ... is missing` |
| URL format invalid | `console.error` | `redis: misconfigured — UPSTASH_REDIS_REST_URL does not look like a valid URL` |
| Ping succeeds | `console.log` | `redis: reachable — ping OK` |
| Ping fails | `console.error` | `redis: unreachable — ping failed: {error detail}` |

`"unavailable"` is `console.log` (informational — expected when Redis is not provisioned).  
All other non-reachable states are `console.error` (operator action required).

---

## Distinguishing the Three Non-OK States

| State | Meaning | Operator action |
|-------|---------|-----------------|
| `"unavailable"` | Neither env var set | Set `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` in deployment env |
| `"misconfigured"` | Env vars set but malformed | Fix the credential value — wrong URL format or one key missing |
| `"unreachable"` | Credentials look valid but ping failed | Check Upstash dashboard — service down, IP allowlist, token expired |

---

## Integration Points for Health Visibility

The health state functions can be consumed by:

**Admin startup diagnostics** (`src/lib/ops/operational-startup-diagnostics.ts`):
```typescript
import { getRedisHealthSnapshot } from "@/lib/server/redis";
// Add to the diagnostics payload alongside databaseUrlConfigured
```

**Admin health API** (`/api/admin/reliability-metrics`):
```typescript
import { getRedisHealthState } from "@/lib/server/redis";
import { getContentCacheHealthState } from "@/lib/cache/redis-content-cache";
// Include in metrics response
```

**CAT health endpoint** (`/api/cat-health`):
```typescript
// Already checks CAT pool readiness — add Redis health state alongside
```

These integrations are not wired in this sprint (scope: implement the health state machinery; integration is a follow-on task).

---

## What Was Not Changed

- No startup blocking — the application starts and serves requests regardless of Redis state
- No error surfaces exposed to end users — all Redis paths still silently degrade
- `getRedisClient()` behavior is unchanged — returns `null` when unconfigured/misconfigured, returns the client when credentials are valid (reachability check is async)
- The `@upstash/redis` SDK handles retries and timeouts internally; the ping is a single best-effort check
