/**
 * Direct Redis warming for snapshot export scripts.
 *
 * After generating a manifest payload, call writeManifestToRedis() to push it
 * directly into Upstash Redis. This means the app gets sub-5ms reads immediately
 * after the nightly export run, without needing a persistent filesystem volume.
 *
 * Required env vars (same as the app's Redis client):
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 *
 * If either is missing, all calls are silently no-ops (no throw, no crash).
 * Filesystem and Spaces uploads still proceed independently.
 */

export interface RedisWriteResult {
  ok: boolean;
  key?: string;
  error?: string;
  skipped?: boolean;
}

function getRedisConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  return { url, token };
}

/**
 * Write a manifest payload directly into Redis via Upstash REST API.
 * Key format matches the app's manifest-loader.ts key builders.
 *
 * @param redisKey  — exact key used by the app (from manifest-loader key builders)
 * @param payload   — the manifest payload object (will be JSON-serialized)
 * @param ttlSeconds — TTL (default 3600 — 1 hour; will be refreshed by next nightly run)
 */
export async function writeManifestToRedis(
  redisKey: string,
  payload: unknown,
  ttlSeconds = 3600,
): Promise<RedisWriteResult> {
  const cfg = getRedisConfig();
  if (!cfg) {
    return { ok: true, skipped: true };
  }

  try {
    // Upstash REST API: POST /set/{key}/{value}?ex={ttl}
    const encodedKey = encodeURIComponent(redisKey);
    const body = JSON.stringify(["SET", redisKey, JSON.stringify(payload), "EX", ttlSeconds]);
    const res = await fetch(cfg.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        "Content-Type": "application/json",
      },
      body,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, key: redisKey, error: `HTTP ${res.status}: ${text.slice(0, 100)}` };
    }

    console.log(`[redis] Warmed: ${redisKey} (TTL ${ttlSeconds}s)`);
    return { ok: true, key: redisKey };
  } catch (err: unknown) {
    const msg = String(err instanceof Error ? err.message : err);
    console.warn(`[redis] Write failed for ${redisKey}: ${msg}`);
    return { ok: false, key: redisKey, error: msg };
  }
}

export function redisConfigured(): boolean {
  return getRedisConfig() !== null;
}
