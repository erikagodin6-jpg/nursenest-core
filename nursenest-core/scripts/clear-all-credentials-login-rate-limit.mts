/**
 * Deletes **all** Redis keys under the credentials-login rate limit prefix (SCAN + DEL).
 *
 * Use after deploying the hotfix that removed the shared-IP burst counter, so stale
 * `ratelimit:auth:credentials_login:*` rows cannot keep blocking users.
 *
 * **Safety:** requires `NN_CONFIRM_CREDENTIALS_RL_CLEAR_ALL=1` plus Upstash env (same as app).
 *
 * Keys matched: `ratelimit:auth:credentials_login:*` (see {@link CREDENTIALS_LOGIN_RATE_LIMIT_KEY_PREFIX}).
 *
 * Usage (from `nursenest-core/`):
 *   NN_CONFIRM_CREDENTIALS_RL_CLEAR_ALL=1 UPSTASH_REDIS_REST_URL=... UPSTASH_REDIS_REST_TOKEN=... npx tsx scripts/clear-all-credentials-login-rate-limit.mts
 */
import { Redis } from "@upstash/redis";
import { CREDENTIALS_LOGIN_RATE_LIMIT_KEY_PREFIX } from "../src/lib/server/credentials-login-rate-limit";

const MATCH = `${CREDENTIALS_LOGIN_RATE_LIMIT_KEY_PREFIX}*` as const;

async function main(): Promise<void> {
  if (process.env.NN_CONFIRM_CREDENTIALS_RL_CLEAR_ALL !== "1") {
    console.error(
      "Refusing to run: set NN_CONFIRM_CREDENTIALS_RL_CLEAR_ALL=1 to confirm SCAN+DEL of all credentials-login RL keys.",
    );
    process.exit(1);
  }

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) {
    console.error("UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required.");
    process.exit(1);
  }

  const redis = new Redis({ url, token });
  let cursor = "0";
  let deleted = 0;
  let iterations = 0;
  const maxIterations = 50_000;

  do {
    iterations += 1;
    if (iterations > maxIterations) {
      console.error("SCAN aborted: exceeded max iterations (safety).");
      process.exit(1);
    }
    const [nextCursor, keys] = await redis.scan(cursor, { match: MATCH, count: 200 });
    if (keys.length > 0) {
      await Promise.all(keys.map((k) => redis.del(k)));
      deleted += keys.length;
    }
    cursor = nextCursor;
  } while (cursor !== "0");

  console.log(`Done. Deleted ${deleted} key(s) matching ${MATCH}`);
}

void main().catch((e) => {
  console.error(e);
  process.exit(1);
});
