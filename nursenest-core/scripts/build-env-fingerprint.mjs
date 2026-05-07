#!/usr/bin/env node
/**
 * Print a **secret-safe** fingerprint of build-relevant process environment.
 * For CI logs and deploy triage — never prints DATABASE_URL, tokens, or keys.
 */
import os from "node:os";

/** Avoid broad `SESSION` matches (e.g. `DBUS_SESSION_BUS_ADDRESS`). */
function isSensitiveEnvKey(name) {
  const u = String(name).toUpperCase();
  if (u === "DATABASE_URL" || u === "DIRECT_URL") return true;
  if (u === "AUTH_SECRET" || u === "NEXTAUTH_SECRET" || u === "CRON_SECRET") return true;
  if (u === "OPENAI_API_KEY" || u === "AI_INTEGRATIONS_OPENAI_API_KEY" || u === "OPENROUTER_API_KEY")
    return true;
  if (/_SECRET$|_TOKEN$|_PASSWORD$|_API_KEY$/i.test(name)) return true;
  if (/^STRIPE_/i.test(name) && /SECRET|KEY|WEBHOOK/i.test(name)) return true;
  return false;
}

function redactEnvKey(name) {
  const v = process.env[name];
  if (v === undefined) return { present: false };
  if (isSensitiveEnvKey(name)) return { present: true, value: "(redacted)" };
  return { present: true, value: v };
}

function pick(name) {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return null;
  return raw;
}

const fingerprint = {
  event: "build_env_fingerprint",
  node: process.version,
  platform: process.platform,
  arch: process.arch,
  totalRamMb: Math.max(0, Math.floor(os.totalmem() / 1024 / 1024)),
  npm_lifecycle_event: pick("npm_lifecycle_event"),
  NODE_OPTIONS: pick("NODE_OPTIONS"),
  NEXT_TELEMETRY_DISABLED: pick("NEXT_TELEMETRY_DISABLED"),
  BUILD_NODE_MAX_OLD_SPACE_SIZE_MB: pick("BUILD_NODE_MAX_OLD_SPACE_SIZE_MB"),
  NODE_MAX_OLD_SPACE_SIZE_MB: pick("NODE_MAX_OLD_SPACE_SIZE_MB"),
  NN_LOW_MEMORY_BUILD: pick("NN_LOW_MEMORY_BUILD"),
  NN_APP_PLATFORM_BUILD: pick("NN_APP_PLATFORM_BUILD"),
  NN_FORCE_SINGLE_BUILD_WORKER: pick("NN_FORCE_SINGLE_BUILD_WORKER"),
  NN_SKIP_LESSON_INDEX_BUILD: pick("NN_SKIP_LESSON_INDEX_BUILD"),
  BUILD_WEBPACK_PARALLELISM: pick("BUILD_WEBPACK_PARALLELISM"),
  CI: pick("CI"),
  GITHUB_ACTIONS: pick("GITHUB_ACTIONS"),
  DIGITALOCEAN_APP_ID: process.env.DIGITALOCEAN_APP_ID ? "(set)" : null,
  VERCEL: pick("VERCEL"),
  NEXT_PHASE: pick("NEXT_PHASE"),
};

const secretPresence = {};
for (const key of Object.keys(process.env).sort()) {
  if (!isSensitiveEnvKey(key)) continue;
  const { present, value } = redactEnvKey(key);
  if (present) secretPresence[key] = value;
}

console.log(JSON.stringify({ ...fingerprint, secretKeys: secretPresence }, null, 2));
