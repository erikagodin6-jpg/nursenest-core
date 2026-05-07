#!/usr/bin/env node
/**
 * Preflight for local Next.js dev: Auth.js requires a session signing secret.
 * Prefer `npm run dev:next` so this runs before `next dev`.
 *
 * Skips when NN_SKIP_DEV_AUTH_SECRET=1 (compile-only / exotic tooling).
 */

function isSet(name) {
  const value = process.env[name];
  return typeof value === "string" && value.trim().length > 0;
}

if (process.env.NN_SKIP_DEV_AUTH_SECRET === "1") {
  process.exit(0);
}

if (isSet("AUTH_SECRET") || isSet("NEXTAUTH_SECRET")) {
  process.exit(0);
}

console.error(
  [
    "[nursenest-core] Missing Auth.js session signing secret.",
    "Set AUTH_SECRET (preferred) or NEXTAUTH_SECRET (legacy) in nursenest-core/.env.local.",
    "Generate: openssl rand -base64 32",
    "Docs: nursenest-core/docs/environment-reference.md#auth--sessions",
    "Or set NN_SKIP_DEV_AUTH_SECRET=1 to skip this check (not recommended for learner QA).",
  ].join("\n"),
);
process.exit(1);
