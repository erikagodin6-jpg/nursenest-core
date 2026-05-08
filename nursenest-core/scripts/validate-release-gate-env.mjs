#!/usr/bin/env node
/**
 * Release-gate preflight.
 *
 * Reports only secret presence, never values. Missing learner/admin credentials are
 * transparent skips; a missing or invalid target URL is a hard failure.
 */
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { loadPlaywrightDotenv } = require("./playwright-dotenv-load.cjs");

loadPlaywrightDotenv();

const BASE_URL_GROUP = {
  label: "release target URL",
  required: true,
  pairs: [["BASE_URL"], ["PLAYWRIGHT_BASE_URL"], ["NURSENEST_PRODUCTION_BASE_URL"]],
  skipProject: null,
};

const OPTIONAL_GROUPS = [
  {
    label: "paid learner",
    pairs: [
      ["E2E_PAID_EMAIL", "E2E_PAID_PASSWORD"],
      ["QA_PAID_EMAIL", "QA_PAID_PASSWORD"],
      ["PLAYWRIGHT_TEST_EMAIL", "PLAYWRIGHT_TEST_PASSWORD"],
    ],
    skipProject: "release-blocking-paid + release-synthetic-paid-smoke",
  },
  {
    label: "free learner",
    pairs: [
      ["E2E_FREE_EMAIL", "E2E_FREE_PASSWORD"],
      ["QA_FREE_EMAIL", "QA_FREE_PASSWORD"],
    ],
    skipProject: "release-free-user",
  },
  {
    label: "admin staff",
    pairs: [["E2E_ADMIN_EMAIL", "E2E_ADMIN_PASSWORD"]],
    skipProject: "release-admin-user",
  },
];

function isSet(name) {
  const value = process.env[name];
  return typeof value === "string" && value.trim().length > 0;
}

function resolveGroup(group) {
  for (const vars of group.pairs) {
    if (vars.every(isSet)) {
      return { ok: true, source: vars.join(" + ") };
    }
  }
  return {
    ok: false,
    missing: group.pairs.map((vars) => vars.join(" + ")),
  };
}

export function resolveReleaseGateBaseUrl() {
  for (const [name] of BASE_URL_GROUP.pairs) {
    const raw = process.env[name]?.trim();
    if (!raw) continue;
    return { name, raw };
  }
  return null;
}

export function getReleaseGateEnvStatus() {
  const base = resolveReleaseGateBaseUrl();
  const optional = OPTIONAL_GROUPS.map((group) => ({
    ...group,
    resolution: resolveGroup(group),
  }));
  return { base, optional };
}

function validateBaseUrl(base) {
  if (!base) {
    return {
      ok: false,
      message:
        "Missing release target URL. Set BASE_URL (preferred), PLAYWRIGHT_BASE_URL, or NURSENEST_PRODUCTION_BASE_URL.",
    };
  }
  try {
    const parsed = new URL(base.raw);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { ok: false, message: `Invalid ${base.name}: URL must use http or https.` };
    }
    return { ok: true, origin: parsed.origin };
  } catch {
    return { ok: false, message: `Invalid ${base.name}: expected a full URL such as http://127.0.0.1:3000.` };
  }
}

export function printReleaseGateEnvReport() {
  const status = getReleaseGateEnvStatus();
  const baseResult = validateBaseUrl(status.base);
  const lines = ["[release-gate-env] preflight"];

  if (baseResult.ok) {
    lines.push(`[release-gate-env] PASS target URL: ${status.base.name} (${baseResult.origin})`);
  } else {
    lines.push(`[release-gate-env] FAIL target URL: ${baseResult.message}`);
  }

  for (const group of status.optional) {
    if (group.resolution.ok) {
      lines.push(`[release-gate-env] PASS ${group.label}: ${group.resolution.source} present`);
    } else {
      lines.push(
        `[release-gate-env] WILL SKIP ${group.label}: missing one complete pair from ${group.resolution.missing.join(" OR ")}; affected project(s): ${group.skipProject}`,
      );
    }
  }

  const stripeJourney = process.env.E2E_STRIPE_CHECKOUT_JOURNEY === "1";
  lines.push(
    `[release-gate-env] INFO Stripe hosted checkout journey: ${
      stripeJourney
        ? "opted in via E2E_STRIPE_CHECKOUT_JOURNEY=1"
        : "not opted in; stripe-subscriber-journey.spec.ts remains skipped outside release gate"
    }`,
  );
  lines.push(
    `[release-gate-env] INFO account/billing smoke skip flag: ${
      process.env.E2E_RELEASE_SKIP_BILLING === "1"
        ? "E2E_RELEASE_SKIP_BILLING=1 set"
        : "not set"
    }`,
  );

  const output = lines.join("\n");
  if (baseResult.ok) {
    console.log(output);
    return { ok: true, status };
  }
  console.error(output);
  return { ok: false, status };
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  const result = printReleaseGateEnvReport();
  process.exit(result.ok ? 0 : 1);
}
