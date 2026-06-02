import "server-only";

/**
 * Redis content cache — optional Layer 2 between API routes and PostgreSQL.
 *
 * Activation: set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN, or REDIS_URL.
 * When neither is set, all operations are no-ops (transparent pass-through).
 *
 * Uses native fetch for Upstash (HTTP, edge-safe) and falls back to the `redis`
 * package TCP client when REDIS_URL is set.
 *
 * Errors from Redis are always swallowed — this layer must never break the primary path.
 */

// ─── Upstash HTTP client (no extra package needed) ────────────────────────────

interface UpstashResponse<T = unknown> {
  result?: T;
  error?: string;
}

async function upstashGet(url: string, token: string, key: string): Promise<string | null> {
  const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const body = await res.json() as UpstashResponse<string | null>;
  return body.result ?? null;
}

async function upstashSet(
  url: string,
  token: string,
  key: string,
  value: string,
  ttlSeconds: number,
): Promise<void> {
  await fetch(`${url}/set/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify([value, "EX", ttlSeconds]),
    cache: "no-store",
  });
}

async function upstashDel(url: string, token: string, key: string): Promise<void> {
  await fetch(`${url}/del/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
}

// ─── Redis TCP client (ioredis/redis package) ─────────────────────────────────

// Lazy singleton — only created when REDIS_URL is set and Upstash is not configured.
let tcpClient: import("redis").RedisClientType | null = null;
let tcpConnecting = false;

async function getTcpClient(): Promise<import("redis").RedisClientType | null> {
  const redisUrl = process.env.REDIS_URL?.trim();
  if (!redisUrl) return null;
  if (tcpClient) return tcpClient;
  if (tcpConnecting) return null;
  tcpConnecting = true;
  try {
    const { createClient } = await import("redis");
    const client = createClient({ url: redisUrl }) as import("redis").RedisClientType;
    client.on("error", () => { /* suppress — cache errors must not surface */ });
    await client.connect();
    tcpClient = client;
    return client;
  } catch {
    tcpConnecting = false;
    return null;
  }
}

// ─── Health state ─────────────────────────────────────────────────────────────

type ContentCacheHealthState = "unchecked" | "unavailable" | "reachable" | "unreachable";
let contentCacheHealth: ContentCacheHealthState = "unchecked";

/** Returns the last-known connectivity state of the content cache layer. */
export function getContentCacheHealthState(): ContentCacheHealthState {
  return contentCacheHealth;
}

// ─── Public interface ─────────────────────────────────────────────────────────

/** True when either Upstash or TCP Redis is configured. */
export function isCacheConfigured(): boolean {
  const hasUpstash = Boolean(process.env.UPSTASH_REDIS_REST_URL?.trim());
  const hasTcp = Boolean(process.env.REDIS_URL?.trim());
  if (!hasUpstash && !hasTcp && contentCacheHealth === "unchecked") {
    contentCacheHealth = "unavailable";
  }
  return hasUpstash || hasTcp;
}

/**
 * Get a cached value. Returns null on miss, error, or when cache is not configured.
 * Deserializes the stored JSON string.
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!isCacheConfigured()) return null;
  try {
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

    let raw: string | null = null;
    if (upstashUrl && upstashToken) {
      raw = await upstashGet(upstashUrl, upstashToken, key);
    } else {
      const client = await getTcpClient();
      if (client) raw = await client.get(key);
    }

    contentCacheHealth = "reachable";
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    contentCacheHealth = "unreachable";
    return null;
  }
}

/**
 * Store a value in the cache with a TTL. Serializes to JSON.
 * Fire-and-forget friendly: never throws.
 */
export async function cacheSet<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  if (!isCacheConfigured()) return;
  try {
    const serialized = JSON.stringify(value);
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

    if (upstashUrl && upstashToken) {
      await upstashSet(upstashUrl, upstashToken, key, serialized, ttlSeconds);
    } else {
      const client = await getTcpClient();
      if (client) await client.setEx(key, ttlSeconds, serialized);
    }
    contentCacheHealth = "reachable";
  } catch {
    contentCacheHealth = "unreachable";
    // Cache errors are silenced — primary path must not be affected.
  }
}

/**
 * Delete a key from the cache (use on content updates to invalidate stale entries).
 * Never throws.
 */
export async function cacheDel(key: string): Promise<void> {
  if (!isCacheConfigured()) return;
  try {
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
    if (upstashUrl && upstashToken) {
      await upstashDel(upstashUrl, upstashToken, key);
    } else {
      const client = await getTcpClient();
      if (client) await client.del(key);
    }
  } catch { /* silent */ }
}
