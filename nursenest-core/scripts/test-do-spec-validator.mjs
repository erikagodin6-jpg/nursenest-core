#!/usr/bin/env node
/**
 * Unit tests for the DigitalOcean spec validator (scripts/do-spec-guard.mjs).
 *
 * Tests:
 *   - Validator catches missing required keys
 *   - Validator catches partial spec
 *   - Validator catches wrong source_dir / run_command
 *   - Validator allows redacted backup placeholders (type: SECRET, no value)
 *   - Runtime env forwarding passes full process.env to child
 *   - BUILD_TIME-only vars are not included in runtime env map
 *
 * Run: node nursenest-core/scripts/test-do-spec-validator.mjs
 */
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  validateSpec,
  validateSpecFile,
  collectRuntimeEnvMap,
  REQUIRED_RUNTIME_ENV_KEYS,
  CANONICAL_SPEC_PATH,
} from "../../scripts/do-spec-guard.mjs";
import { buildForwardedRuntimeEnv } from "../scripts/lib/runtime-env-contract.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  PASS  ${name}`);
    passed++;
  } catch (err) {
    console.error(`  FAIL  ${name}`);
    console.error(`        ${err.message}`);
    failed++;
  }
}

/** Build a minimal valid spec. overrideEnvs replaces/adds entries by key. */
function makeSpec(overrideEnvs = []) {
  const defaultEnvs = [
    { key: "DATABASE_URL", scope: "RUN_AND_BUILD_TIME", type: "SECRET" },
    { key: "AUTH_SECRET", scope: "RUN_AND_BUILD_TIME", type: "SECRET" },
    { key: "NEXTAUTH_URL", scope: "RUN_TIME", value: "https://example.com" },
    { key: "AUTH_URL", scope: "RUN_TIME", value: "https://example.com" },
    { key: "STRIPE_SECRET_KEY", scope: "RUN_TIME", type: "SECRET" },
    { key: "STRIPE_WEBHOOK_SECRET", scope: "RUN_TIME", type: "SECRET" },
    { key: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", scope: "RUN_AND_BUILD_TIME", type: "SECRET" },
    { key: "OPENAI_API_KEY", scope: "RUN_TIME", type: "SECRET" },
    // ECG publish flags
    { key: "ENABLE_ECG_MODULE", scope: "RUN_TIME", value: "true" },
    { key: "NEXT_PUBLIC_ENABLE_ECG_MODULE", scope: "RUN_AND_BUILD_TIME", value: "true" },
    { key: "ENABLE_ADVANCED_ECG_MODULE", scope: "RUN_TIME", value: "true" },
    { key: "ALLOW_ECG_EARLY_ACCESS_CHECKOUT", scope: "RUN_TIME", value: "false" },
    // NP subscription prices
    { key: "STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION", scope: "RUN_TIME", value: "price_test_np_1m" },
    { key: "STRIPE_PRICE_NURSENEST_NP_3_MONTH_SUBSCRIPTION", scope: "RUN_TIME", value: "price_test_np_3m" },
    { key: "STRIPE_PRICE_NURSENEST_NP_6_MONTH_SUBSCRIPTION", scope: "RUN_TIME", value: "price_test_np_6m" },
    { key: "STRIPE_PRICE_NURSENEST_NP_1_YEAR_SUBSCRIPTION", scope: "RUN_TIME", value: "price_test_np_1y" },
    // Advanced ECG add-on price
    { key: "STRIPE_PRICE_ADVANCED_ECG", scope: "RUN_TIME", value: "price_test_advanced_ecg" },
  ];
  const envMap = new Map(defaultEnvs.map((e) => [e.key, e]));
  for (const e of overrideEnvs) {
    envMap.set(e.key, e);
  }
  return {
    name: "nursenest-core-next",
    services: [
      {
        name: "web",
        source_dir: ".",
        run_command: "node scripts/start-standalone.mjs",
        envs: [...envMap.values()],
      },
    ],
  };
}

function makeSpecWithout(...keys) {
  const spec = makeSpec();
  spec.services[0].envs = spec.services[0].envs.filter((e) => !keys.includes(e.key));
  return spec;
}

console.log("\nDigitalOcean Spec Validator Tests");
console.log("==================================\n");

// --- Positive cases ---

test("valid spec passes", () => {
  const { ok, failures } = validateSpec(makeSpec());
  assert.equal(ok, true, `Expected ok but got failures: ${failures.join("; ")}`);
  assert.equal(failures.length, 0);
});

test("redacted backup placeholder (type: SECRET, no value) passes", () => {
  const spec = makeSpec([{ key: "DATABASE_URL", scope: "RUN_AND_BUILD_TIME", type: "SECRET" }]);
  const { ok, failures } = validateSpec(spec);
  assert.equal(ok, true, `Placeholder secret should pass: ${failures.join("; ")}`);
});

test("all REQUIRED_RUNTIME_ENV_KEYS are covered by the valid spec", () => {
  const envMap = collectRuntimeEnvMap(makeSpec());
  for (const key of REQUIRED_RUNTIME_ENV_KEYS) {
    assert.ok(envMap.has(key), `Expected "${key}" in env map`);
  }
});

test("canonical spec file can be parsed and validated without crash", () => {
  const { ok, failures, warnings, spec } = validateSpecFile(CANONICAL_SPEC_PATH);
  assert.ok(typeof ok === "boolean", "ok must be boolean");
  assert.ok(Array.isArray(failures), "failures must be array");
  assert.ok(Array.isArray(warnings), "warnings must be array");
  assert.ok(spec !== null && typeof spec === "object", "spec must be an object");
});

test("canonical spec now includes STRIPE_SECRET_KEY", () => {
  const { spec } = validateSpecFile(CANONICAL_SPEC_PATH);
  const envMap = collectRuntimeEnvMap(spec);
  assert.ok(envMap.has("STRIPE_SECRET_KEY"), "STRIPE_SECRET_KEY must be in canonical spec after patch");
  assert.ok(envMap.has("STRIPE_WEBHOOK_SECRET"), "STRIPE_WEBHOOK_SECRET must be in canonical spec");
  assert.ok(
    envMap.has("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"),
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must be in canonical spec",
  );
});

test("canonical spec passes full validation after Stripe patch", () => {
  const { ok, failures } = validateSpecFile(CANONICAL_SPEC_PATH);
  assert.equal(ok, true, `Canonical spec should pass. Failures: ${failures.join("; ")}`);
});

// --- Missing required keys ---

test("missing DATABASE_URL fails with descriptive message", () => {
  const { ok, failures } = validateSpec(makeSpecWithout("DATABASE_URL"));
  assert.equal(ok, false);
  assert.ok(
    failures.some((f) => f.includes("DATABASE_URL")),
    `Expected DATABASE_URL in failures: ${failures}`,
  );
});

test("missing AUTH_SECRET fails", () => {
  const { ok, failures } = validateSpec(makeSpecWithout("AUTH_SECRET"));
  assert.equal(ok, false);
  assert.ok(failures.some((f) => f.includes("AUTH_SECRET")));
});

test("missing STRIPE_SECRET_KEY fails", () => {
  const { ok, failures } = validateSpec(makeSpecWithout("STRIPE_SECRET_KEY"));
  assert.equal(ok, false);
  assert.ok(failures.some((f) => f.includes("STRIPE_SECRET_KEY")));
});

test("missing STRIPE_WEBHOOK_SECRET fails", () => {
  const { ok, failures } = validateSpec(makeSpecWithout("STRIPE_WEBHOOK_SECRET"));
  assert.equal(ok, false);
  assert.ok(failures.some((f) => f.includes("STRIPE_WEBHOOK_SECRET")));
});

test("missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY fails", () => {
  const { ok, failures } = validateSpec(makeSpecWithout("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"));
  assert.equal(ok, false);
  assert.ok(failures.some((f) => f.includes("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")));
});

test("missing NEXTAUTH_URL fails", () => {
  const { ok, failures } = validateSpec(makeSpecWithout("NEXTAUTH_URL"));
  assert.equal(ok, false);
  assert.ok(failures.some((f) => f.includes("NEXTAUTH_URL")));
});

test("missing AUTH_URL fails", () => {
  const { ok, failures } = validateSpec(makeSpecWithout("AUTH_URL"));
  assert.equal(ok, false);
  assert.ok(failures.some((f) => f.includes("AUTH_URL")));
});

test("missing ENABLE_ECG_MODULE fails", () => {
  const { ok, failures } = validateSpec(makeSpecWithout("ENABLE_ECG_MODULE"));
  assert.equal(ok, false);
  assert.ok(failures.some((f) => f.includes("ENABLE_ECG_MODULE")));
});

test("missing NEXT_PUBLIC_ENABLE_ECG_MODULE fails", () => {
  const { ok, failures } = validateSpec(makeSpecWithout("NEXT_PUBLIC_ENABLE_ECG_MODULE"));
  assert.equal(ok, false);
  assert.ok(failures.some((f) => f.includes("NEXT_PUBLIC_ENABLE_ECG_MODULE")));
});

test("missing STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION fails", () => {
  const { ok, failures } = validateSpec(makeSpecWithout("STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION"));
  assert.equal(ok, false);
  assert.ok(failures.some((f) => f.includes("STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION")));
});

test("missing STRIPE_PRICE_ADVANCED_ECG fails", () => {
  const { ok, failures } = validateSpec(makeSpecWithout("STRIPE_PRICE_ADVANCED_ECG"));
  assert.equal(ok, false);
  assert.ok(failures.some((f) => f.includes("STRIPE_PRICE_ADVANCED_ECG")));
});

// --- Structural checks ---

test("partial spec (no services) fails", () => {
  const { ok, failures } = validateSpec({ name: "test" });
  assert.equal(ok, false);
  assert.ok(failures.some((f) => f.includes("web")));
});

test("wrong source_dir fails", () => {
  const spec = makeSpec();
  spec.services[0].source_dir = "nursenest-core";
  const { ok, failures } = validateSpec(spec);
  assert.equal(ok, false);
  assert.ok(failures.some((f) => f.includes("source_dir")));
});

test("wrong run_command fails", () => {
  const spec = makeSpec();
  spec.services[0].run_command = "npm start";
  const { ok, failures } = validateSpec(spec);
  assert.equal(ok, false);
  assert.ok(failures.some((f) => f.includes("run_command")));
});

test("empty services array fails", () => {
  const { ok, failures } = validateSpec({ name: "test", services: [] });
  assert.equal(ok, false);
  assert.ok(failures.length > 0);
});

// --- Scope handling ---

test("BUILD_TIME-only env is not included in runtime env map", () => {
  const spec = makeSpec([{ key: "BUILD_ONLY_VAR", scope: "BUILD_TIME", value: "yes" }]);
  const envMap = collectRuntimeEnvMap(spec);
  assert.ok(!envMap.has("BUILD_ONLY_VAR"), "BUILD_TIME vars must not appear in runtime env map");
});

test("RUN_AND_BUILD_TIME env is included in runtime env map", () => {
  const spec = makeSpec([{ key: "SHARED_VAR", scope: "RUN_AND_BUILD_TIME", value: "x" }]);
  const envMap = collectRuntimeEnvMap(spec);
  assert.ok(envMap.has("SHARED_VAR"), "RUN_AND_BUILD_TIME vars must appear in runtime env map");
});

// --- Standalone env forwarding ---

test("buildForwardedRuntimeEnv passes all process.env keys to child (not filtered)", () => {
  const testEnv = {
    DATABASE_URL: "postgres://test:test@host/db",
    AUTH_SECRET: "supersecret",
    STRIPE_SECRET_KEY: "sk_test_xxx",
    CUSTOM_VAR: "custom_value",
    NODE_ENV: "production",
  };
  const forwarded = buildForwardedRuntimeEnv(testEnv);
  assert.equal(forwarded.DATABASE_URL, testEnv.DATABASE_URL, "DATABASE_URL must pass through");
  assert.equal(forwarded.AUTH_SECRET, testEnv.AUTH_SECRET, "AUTH_SECRET must pass through");
  assert.equal(forwarded.STRIPE_SECRET_KEY, testEnv.STRIPE_SECRET_KEY, "STRIPE_SECRET_KEY must pass through");
  assert.equal(forwarded.CUSTOM_VAR, testEnv.CUSTOM_VAR, "Custom vars must pass through");
});

test("buildForwardedRuntimeEnv applies overrides without dropping base env", () => {
  const base = { DATABASE_URL: "postgres://host/db", AUTH_SECRET: "sec" };
  const forwarded = buildForwardedRuntimeEnv(base, { PORT: "9000", HOSTNAME: "127.0.0.1" });
  assert.equal(forwarded.DATABASE_URL, base.DATABASE_URL, "DATABASE_URL must survive override");
  assert.equal(forwarded.PORT, "9000", "PORT override must be applied");
  assert.equal(forwarded.HOSTNAME, "127.0.0.1", "HOSTNAME override must be applied");
});

// --- Runtime health endpoint contract ---

const HEALTH_ROUTE_PATH = path.join(
  ROOT,
  "nursenest-core",
  "src",
  "app",
  "api",
  "internal",
  "runtime-env-health",
  "route.ts",
);

test("runtime-env-health route file exists", () => {
  assert.ok(existsSync(HEALTH_ROUTE_PATH), `runtime-env-health route must exist at ${HEALTH_ROUTE_PATH}`);
});

test("runtime-env-health route never leaks secret values", () => {
  const content = readFileSync(HEALTH_ROUTE_PATH, "utf8");
  assert.ok(!content.includes("process.env.DATABASE_URL,"), "Must not return DATABASE_URL value directly");
  assert.ok(!content.includes("process.env.AUTH_SECRET,"), "Must not return AUTH_SECRET value directly");
  assert.ok(!content.includes("process.env.STRIPE_SECRET_KEY,"), "Must not return STRIPE_SECRET_KEY value directly");
  assert.ok(content.includes("_present"), "Must return _present boolean fields");
});

// Final summary
console.log(`\n${"─".repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log(`${"─".repeat(40)}\n`);

if (failed > 0) process.exit(1);
