#!/usr/bin/env node
/**
 * Minimal legacy check (DATABASE_URL, DIRECT_URL, NEXTAUTH_URL, session signing secret).
 * Session signing: `AUTH_SECRET` (preferred) or `NEXTAUTH_SECRET` (legacy) — at least one required.
 * Prefer full diagnostics: `cd nursenest-core && npm run env:validate` when available.
 */

function isSet(name) {
  const value = process.env[name];
  return typeof value === "string" && value.trim().length > 0;
}

const REQUIRED_VARS = ["DATABASE_URL", "DIRECT_URL", "NEXTAUTH_URL"];

const authSecretSet = isSet("AUTH_SECRET");
const nextAuthSecretSet = isSet("NEXTAUTH_SECRET");
const sessionSigningOk = authSecretSet || nextAuthSecretSet;

console.log(`[env:check] AUTH_SECRET: ${authSecretSet ? "yes" : "no"}`);
console.log(`[env:check] NEXTAUTH_SECRET: ${nextAuthSecretSet ? "yes" : "no"}`);
console.log(`[env:check] session_signing_secret (AUTH_SECRET or NEXTAUTH_SECRET): ${sessionSigningOk ? "yes" : "no"}`);

let missingCount = 0;

for (const name of REQUIRED_VARS) {
  const value = process.env[name];
  const status = typeof value === "string" && value.trim().length > 0 ? "set" : "missing";
  if (status === "missing") {
    missingCount += 1;
  }
  console.log(`[env:check] ${name}: ${status}`);
}

if (!sessionSigningOk) {
  missingCount += 1;
  console.log(
    "[env:check] session signing: set AUTH_SECRET (preferred) or NEXTAUTH_SECRET (legacy); generate: openssl rand -base64 32",
  );
}

if (missingCount === 0) {
  console.log("[env:check] summary: all required variables are set");
} else {
  console.log(`[env:check] summary: ${missingCount} required variable(s) missing`);
  process.exitCode = 1;
}
