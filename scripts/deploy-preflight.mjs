#!/usr/bin/env node
/**
 * deploy-preflight — pre-push gate for DigitalOcean App Platform deploys.
 *
 * Checks that the local repo is in a safe state before a push to main triggers
 * the Build → GHCR → Deploy CI job.  All checks are read-only; no secrets printed.
 *
 * Usage:
 *   node scripts/deploy-preflight.mjs        # exit 0 = safe, exit 1 = blocked
 *   npm run deploy:preflight
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const __dir = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dir, "..");

const CANONICAL_SPEC = path.join(ROOT, ".do", "app-nursenest-core-next.yaml");

const FORBIDDEN_DO_SPECS = [
  ".do/app.yaml",
  "nursenest-core/.do/app.yaml",
  "nursenest-core/live-app-spec.yaml",
];

const REQUIRED_ENV_KEYS = [
  "DATABASE_URL", "DIRECT_URL", "AUTH_SECRET", "NEXTAUTH_URL", "AUTH_URL",
  "NEXT_PUBLIC_APP_URL",
  "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "ENABLE_ECG_MODULE", "NEXT_PUBLIC_ENABLE_ECG_MODULE", "ENABLE_ADVANCED_ECG_MODULE",
  "STRIPE_PRICE_ADVANCED_ECG",
  "ENABLE_HEMODYNAMICS_MODULE", "NEXT_PUBLIC_ENABLE_HEMODYNAMICS_MODULE",
  "ENABLE_ADVANCED_HEMODYNAMICS_MODULE", "NEXT_PUBLIC_ENABLE_ADVANCED_HEMODYNAMICS_MODULE",
  "STRIPE_PRICE_ADVANCED_HEMODYNAMICS", "STRIPE_PRICE_CRITICAL_CARE_BUNDLE",
  "STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION", "STRIPE_PRICE_NURSENEST_NP_3_MONTH_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_NP_6_MONTH_SUBSCRIPTION", "STRIPE_PRICE_NURSENEST_NP_1_YEAR_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_RN_1_MONTH_SUBSCRIPTION", "STRIPE_PRICE_NURSENEST_RN_3_MONTH_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_RN_6_MONTH_SUBSCRIPTION", "STRIPE_PRICE_NURSENEST_RN_1_YEAR_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_RPN_1_MONTH_SUBSCRIPTION", "STRIPE_PRICE_NURSENEST_RPN_3_MONTH_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_RPN_6_MONTH_SUBSCRIPTION", "STRIPE_PRICE_NURSENEST_RPN_YEARLY_SUBSCRIPTION",
  "STRIPE_PRICE_NEW_GRAD_MONTHLY", "STRIPE_PRICE_NEW_GRAD_6MONTH", "STRIPE_PRICE_NEW_GRAD_YEARLY",
  "STRIPE_PRICE_NURSENEST_ALLIED_HEALTH_EXAM_PREP_MONTHLY",
  "STRIPE_PRICE_NURSENEST_ALLIED_HEALTH_EXAM_PREP_3_MONTHS",
  "STRIPE_PRICE_NURSENEST_ALLIED_HEALTH_6_MONTH_SUBSCRIPTION",
  "STRIPE_PRICE_NURSENEST_ALLIED_HEALTH_EXAM_PREP_YEARLY",
  "STRIPE_PRICE_LVN_LPN_MONTHLY", "STRIPE_PRICE_LVN_LPN_3MONTH",
  "STRIPE_PRICE_LVN_LPN_6MONTH", "STRIPE_PRICE_LVN_LPN_YEARLY",
  "CRON_SECRET", "SPACES_KEY", "SPACES_SECRET",
  "BASE_URL", "NURSENEST_PRODUCTION_BASE_URL", "NURSENEST_RELIABILITY_SECRET",
  "PRODUCTION_CRON_BASE_URL", "QA_PAID_EMAIL", "QA_PAID_PASSWORD",
];

const EXPECTED_RUN_COMMAND = "node scripts/start-standalone.mjs";

let failures = 0;
let warnings = 0;

function pass(msg) { console.log(`  PASS  ${msg}`); }
function fail(msg) { console.error(`  FAIL  ${msg}`); failures++; }
function warn(msg) { console.warn(`  WARN  ${msg}`); warnings++; }

function git(args) {
  try {
    return execSync(`git ${args}`, { cwd: ROOT, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
  } catch { return null; }
}

// ── Check 1: current branch is main ──────────────────────────────────────────
console.log("\n[deploy-preflight] 1/9  Branch check");
const branch = git("branch --show-current");
if (branch === "main") {
  pass("On branch: main");
} else {
  fail(`Current branch is "${branch}", expected "main". Push to main triggers the GHCR build + DO deploy.`);
}

// ── Check 2: local main is not behind origin/main ─────────────────────────────
console.log("\n[deploy-preflight] 2/9  Remote sync check");
git("fetch origin main --quiet 2>/dev/null") ?? git("fetch origin main");
const behind = git("rev-list --count main..origin/main 2>/dev/null");
if (behind === null) {
  warn("Could not compare main against origin/main (no remote or no network). Skipping.");
} else if (behind === "0") {
  pass("main is up-to-date with origin/main");
} else {
  fail(`main is ${behind} commit(s) behind origin/main. Run "git pull origin main" first.`);
}

// ── Check 3: working tree is clean ───────────────────────────────────────────
console.log("\n[deploy-preflight] 3/9  Working tree check");
const dirty = git("status --porcelain");
if (dirty === "" || dirty === null) {
  pass("Working tree is clean");
} else {
  const n = (dirty ?? "").split("\n").filter(Boolean).length;
  fail(`Working tree has ${n} uncommitted change(s). Commit or stash before deploying.`);
}

// ── Check 4: canonical DO spec exists ────────────────────────────────────────
console.log("\n[deploy-preflight] 4/9  Canonical spec existence");
if (existsSync(CANONICAL_SPEC)) {
  pass(`Canonical spec present: ${path.relative(ROOT, CANONICAL_SPEC)}`);
} else {
  fail(`Canonical spec NOT found: ${path.relative(ROOT, CANONICAL_SPEC)}`);
}

// ── Check 5: forbidden DO spec paths are documentation-only ──────────────────
console.log("\n[deploy-preflight] 5/9  Forbidden spec paths");
for (const rel of FORBIDDEN_DO_SPECS) {
  const abs = path.join(ROOT, rel);
  if (!existsSync(abs)) { pass(`Not present (safe): ${rel}`); continue; }
  const lines = readFileSync(abs, "utf8").split("\n")
    .filter((l) => l.trim() && !l.trim().startsWith("#") && !/^[╔╚║│]/.test(l.trim()));
  if (lines.length === 0) {
    pass(`Documentation-only (no deployable YAML): ${rel}`);
  } else {
    fail(`FORBIDDEN spec "${rel}" has ${lines.length} deployable line(s). Remove or sanitize to comments-only.`);
  }
}

// ── Check 6: spec uses image source, NOT github source ───────────────────────
console.log("\n[deploy-preflight] 6/9  Image-based source (no github: clone)");
if (existsSync(CANONICAL_SPEC)) {
  let web = null;
  try {
    const yaml = require("js-yaml");
    const spec = yaml.load(readFileSync(CANONICAL_SPEC, "utf8"));
    web = (spec?.services ?? []).find((s) => s.name === "web") ?? null;
  } catch (err) {
    fail(`Could not parse canonical spec: ${err.message}`);
  }
  if (web !== null) {
    if (web.github) {
      fail(
        'Web service has github: source — DO will clone GitHub and hang at "Selecting branch". ' +
        'Remove github:, dockerfile_path:, source_dir: and replace with image: block.'
      );
    } else {
      pass("Web service has no github: source (no GitHub clone on deploy)");
    }
    if (!web.image) {
      fail("Web service is missing image: block — must deploy from a pre-built GHCR/DOCR image.");
    } else {
      const { registry_type, repository, tag, digest } = web.image;
      if (!["GHCR", "DOCR", "DOCKER_HUB"].includes(registry_type)) {
        fail(`image.registry_type "${registry_type}" is not valid (expected GHCR, DOCR, or DOCKER_HUB).`);
      } else {
        pass(`image.registry_type: ${registry_type}`);
      }
      if (!repository) {
        fail("image.repository is missing.");
      } else {
        pass(`image.repository: ${repository}`);
      }
      if (!tag && !digest) {
        fail("image must have tag or digest.");
      } else {
        pass(`image reference: ${tag ? `tag=${tag}` : `digest=${digest}`}`);
      }
    }
  }
} else {
  warn("Skipping image-source check — canonical spec not found (see check 4).");
}

// ── Check 7: all required env keys present in spec ───────────────────────────
console.log("\n[deploy-preflight] 7/9  Canonical spec env key coverage");
if (existsSync(CANONICAL_SPEC)) {
  let specKeys = new Set();
  try {
    const yaml = require("js-yaml");
    const spec = yaml.load(readFileSync(CANONICAL_SPEC, "utf8"));
    const RUNTIME_SCOPES = new Set(["RUN_TIME", "RUN_AND_BUILD_TIME"]);
    for (const svc of spec?.services ?? []) {
      for (const entry of svc?.envs ?? []) {
        const key = typeof entry?.key === "string" ? entry.key.trim() : "";
        if (key && RUNTIME_SCOPES.has(entry.scope ?? "RUN_TIME")) specKeys.add(key);
      }
    }
  } catch (err) {
    fail(`Could not parse canonical spec: ${err.message}`);
  }
  const missing = REQUIRED_ENV_KEYS.filter((k) => !specKeys.has(k));
  if (missing.length === 0) {
    pass(`All ${REQUIRED_ENV_KEYS.length} required env key names present (values not printed)`);
  } else {
    for (const k of missing) {
      fail(`Missing required env key: "${k}" — a doctl update without it WILL DELETE it from live app`);
    }
  }
} else {
  warn("Skipping env key check — canonical spec not found.");
}

// ── Check 8: package lockfile exists ─────────────────────────────────────────
console.log("\n[deploy-preflight] 8/9  Package lockfile");
const lock = ["package-lock.json", "yarn.lock", "pnpm-lock.yaml"].find((f) => existsSync(path.join(ROOT, f)));
if (lock) {
  pass(`Lockfile present: ${lock}`);
} else {
  fail("No package lockfile found. Docker build will produce non-reproducible dependencies.");
}

// ── Check 9: build command and start command ──────────────────────────────────
console.log("\n[deploy-preflight] 9/9  Build + start command");
let specRunCommand = null;
let specDockerfilePath = null;
if (existsSync(CANONICAL_SPEC)) {
  try {
    const yaml = require("js-yaml");
    const spec = yaml.load(readFileSync(CANONICAL_SPEC, "utf8"));
    const web = (spec?.services ?? []).find((s) => s.name === "web");
    specRunCommand = web?.run_command ?? null;
    specDockerfilePath = web?.dockerfile_path ?? null;
  } catch { /* already handled above */ }
}

if (specRunCommand === EXPECTED_RUN_COMMAND) {
  pass(`Spec run_command: "${specRunCommand}"`);
} else if (specRunCommand === null) {
  fail("Spec run_command missing from web service");
} else {
  fail(`Spec run_command is "${specRunCommand}", expected "${EXPECTED_RUN_COMMAND}"`);
}

const dockerfilePath = path.join(ROOT, specDockerfilePath ?? "Dockerfile");
if (existsSync(dockerfilePath)) {
  const df = readFileSync(dockerfilePath, "utf8");
  pass(`Dockerfile present: ${specDockerfilePath ?? "Dockerfile"}`);
  if (/^CMD\s+/m.test(df)) {
    pass("Dockerfile CMD present");
  } else {
    fail("Dockerfile has no CMD instruction");
  }
} else {
  fail(`Dockerfile not found at "${specDockerfilePath ?? "Dockerfile"}"`);
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log("\n" + "─".repeat(72));
if (failures === 0 && warnings === 0) {
  console.log("[deploy-preflight] ALL CHECKS PASSED — repo is safe to deploy.");
  process.exit(0);
} else if (failures === 0) {
  console.log(`[deploy-preflight] PASSED with ${warnings} warning(s).`);
  process.exit(0);
} else {
  console.error(`[deploy-preflight] BLOCKED — ${failures} failure(s), ${warnings} warning(s).`);
  process.exit(1);
}
