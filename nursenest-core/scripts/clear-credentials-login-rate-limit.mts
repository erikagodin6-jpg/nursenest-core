/**
 * Clears Redis fixed-window keys used by credentials-login-rate-limit (same keys as successful login reset).
 *
 * **Safety:** set `NN_CONFIRM_CREDENTIALS_RL_CLEAR=1` in the environment for this script to perform deletes.
 *
 * Keys (after interpolation):
 *   ratelimit:auth:credentials_login:burst:ip:<ipKey>
 *   ratelimit:auth:credentials_login:combo:ip:<ipKey>:acct:<acctHash>
 *
 * `<ipKey>` is {@link rateLimitClientPartition}'s output (usually the trusted client IP; for `unknown` it is `unknown:<partition>`).
 * `<acctHash>` is the first 12 hex chars of SHA-256 of the **normalized** login identifier (email or username), matching `authorize()`.
 *
 * Usage (from `nursenest-core/`, Redis env required):
 *   NN_CONFIRM_CREDENTIALS_RL_CLEAR=1 UPSTASH_REDIS_REST_URL=... UPSTASH_REDIS_REST_TOKEN=... npx tsx scripts/clear-credentials-login-rate-limit.mts --ip=203.0.113.5 --login=user@example.com
 *   NN_CONFIRM_CREDENTIALS_RL_CLEAR=1 npx tsx scripts/clear-credentials-login-rate-limit.mts --ip-key=203.0.113.5 --id-hash=abc123def456
 *   NN_CONFIRM_CREDENTIALS_RL_CLEAR=1 npx tsx scripts/clear-credentials-login-rate-limit.mts --ip-key=203.0.113.5 --burst-only
 */
import { hashLoginIdentifierForLog } from "../src/lib/auth/log-auth-identifier";
import {
  normalizeLoginIdentifier,
  sanitizeRawLoginIdentifier,
} from "../src/lib/auth/normalize-login-identifier";
import { getRedisClient } from "../src/lib/server/redis";
import {
  resetCredentialsLoginBurstKeyOnly,
  resetCredentialsLoginRateLimitKeys,
} from "../src/lib/server/credentials-login-rate-limit";

function argValue(flag: string): string | undefined {
  const prefix = `${flag}=`;
  for (const a of process.argv.slice(2)) {
    if (a.startsWith(prefix)) return a.slice(prefix.length).trim() || undefined;
  }
  return undefined;
}

function hasFlag(flag: string): boolean {
  return process.argv.slice(2).includes(flag);
}

async function main(): Promise<void> {
  if (process.env.NN_CONFIRM_CREDENTIALS_RL_CLEAR !== "1") {
    console.error(
      "Refusing to run: set NN_CONFIRM_CREDENTIALS_RL_CLEAR=1 to confirm intentional deletion of rate-limit keys.",
    );
    process.exit(1);
  }

  const ipKey = argValue("--ip-key") ?? argValue("--ip");
  const loginRaw = argValue("--login");
  const idHashArg = argValue("--id-hash");
  const burstOnly = hasFlag("--burst-only");

  if (!ipKey) {
    console.error(
      "Usage: NN_CONFIRM_CREDENTIALS_RL_CLEAR=1 npx tsx scripts/clear-credentials-login-rate-limit.mts --ip=<trusted-ip> (--login=<id> | --id-hash=<12hex>) [--burst-only]",
    );
    console.error("   or: --ip-key=<partition> ...");
    process.exit(1);
  }

  const redis = getRedisClient();
  if (!redis) {
    console.error("Redis is not configured (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN).");
    process.exit(1);
  }

  if (burstOnly) {
    await resetCredentialsLoginBurstKeyOnly(ipKey);
    console.log("Deleted credentials login RL burst key only (NAT-wide bucket).");
    console.log(`  burst:  ratelimit:auth:credentials_login:burst:ip:${ipKey}`);
    return;
  }

  let acctHash = (idHashArg ?? "").trim().toLowerCase();
  if (acctHash && !/^[0-9a-f]{12}$/.test(acctHash)) {
    console.error("--id-hash must be exactly 12 lowercase hex characters (same as authorize idHash / logs).");
    process.exit(1);
  }
  if (!acctHash && loginRaw) {
    const enteredLower = normalizeLoginIdentifier(sanitizeRawLoginIdentifier(loginRaw));
    acctHash = enteredLower ? hashLoginIdentifierForLog(enteredLower) : "";
  }
  if (!acctHash) {
    console.error("Provide --login=<email-or-username> or --id-hash=<12hex> (and omit --burst-only for combo clear).");
    process.exit(1);
  }

  await resetCredentialsLoginRateLimitKeys(ipKey, acctHash);
  console.log("Deleted credentials login RL keys for given ipKey + account fingerprint.");
  console.log(`  burst:  ratelimit:auth:credentials_login:burst:ip:${ipKey}`);
  console.log(`  combo:  ratelimit:auth:credentials_login:combo:ip:${ipKey}:acct:${acctHash}`);
}

void main().catch((e) => {
  console.error(e);
  process.exit(1);
});
