#!/usr/bin/env node
/**
 * Preflight for `npm run visual-qa:*` — fails with actionable messages (not generic exits).
 *
 * Checks:
 * - AUTH_SECRET or NEXTAUTH_SECRET (Auth.js session signing; must match the running app)
 * - NEXTAUTH_URL or AUTH_URL (cookie / callback alignment with PLAYWRIGHT_BASE_URL / BASE_URL)
 * - Optional: --require-paid-creds (paid email+password for auth setup)
 * - Optional: --require-storage-state=path (file must exist)
 * - Optional: --require-learner-visual-storage (default path: playwright/.auth/learner-paid.json or PLAYWRIGHT_VISUAL_QA_AUTH_STATE)
 */
import fs from "node:fs";
import path from "node:path";

function isNonEmpty(name) {
  const v = process.env[name];
  return typeof v === "string" && v.trim().length > 0;
}

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

const args = process.argv.slice(2);
const requirePaid = args.includes("--require-paid-creds");
const requireLearnerVisualStorage = args.includes("--require-learner-visual-storage");
const storageArg = args.find((a) => a.startsWith("--require-storage-state="));
let storagePath = storageArg?.split("=", 2)[1]?.trim();
if (requireLearnerVisualStorage && !storagePath) {
  storagePath = process.env.PLAYWRIGHT_VISUAL_QA_AUTH_STATE?.trim();
  if (!storagePath) {
    storagePath = path.join(process.cwd(), "playwright", ".auth", "learner-paid.json");
  }
}

if (!isNonEmpty("AUTH_SECRET") && !isNonEmpty("NEXTAUTH_SECRET")) {
  fail(
    [
      "[visual-qa] Missing session signing secret for Auth.js.",
      "Set AUTH_SECRET (preferred) or NEXTAUTH_SECRET in nursenest-core/.env.local (or export before Playwright).",
      "Must match the secret used by the Next.js app under test (same value as `npm run dev`).",
      "Generate: openssl rand -base64 32",
    ].join("\n"),
  );
}

if (!isNonEmpty("NEXTAUTH_URL") && !isNonEmpty("AUTH_URL")) {
  fail(
    [
      "[visual-qa] Missing NEXTAUTH_URL or AUTH_URL.",
      "Set to the origin you are testing, e.g. http://127.0.0.1:3000 (must match PLAYWRIGHT_BASE_URL / BASE_URL).",
      "Without this, sign-in cookies and callbacks may not align and screenshots can show the sign-in gate.",
    ].join("\n"),
  );
}

if (requirePaid) {
  const pairs = [
    ["E2E_PAID_EMAIL", "E2E_PAID_PASSWORD"],
    ["QA_PAID_EMAIL", "QA_PAID_PASSWORD"],
    ["PLAYWRIGHT_TEST_EMAIL", "PLAYWRIGHT_TEST_PASSWORD"],
  ];
  const ok = pairs.some(([e, p]) => isNonEmpty(e) && isNonEmpty(p));
  if (!ok) {
    fail(
      [
        "[visual-qa] Paid credentials required for this command.",
        "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD (or QA_PAID_* / PLAYWRIGHT_TEST_EMAIL + PLAYWRIGHT_TEST_PASSWORD).",
        "See docs/visual-qa.md and nursenest-core/tests/e2e/README.md.",
      ].join("\n"),
    );
  }
}

if (storagePath) {
  try {
    if (!fs.existsSync(storagePath)) {
      fail(
        [
          `[visual-qa] Missing Playwright storage state file: ${storagePath}`,
          "Run: npm run visual-qa:auth",
          "(Or set PLAYWRIGHT_VISUAL_QA_AUTH_STATE / PLAYWRIGHT_PAID_AUTH_STATE to an existing JSON path.)",
        ].join("\n"),
      );
    }
  } catch (e) {
    fail(`[visual-qa] Could not check storage state path: ${storagePath} (${e})`);
  }
}

process.exit(0);
