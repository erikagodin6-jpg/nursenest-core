/**
 * @import test from "node:test";
 */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import test from "node:test";

const script = resolve(dirname(fileURLToPath(import.meta.url)), "audit-production-stability.mjs");

test("strict + missing DATABASE_URL exits 1 and never prints secret", () => {
  const secret = "super-secret-do-not-echo-32chars-min";
  const r = spawnSync(process.execPath, [script], {
    encoding: "utf8",
    env: {
      ...process.env,
      AUDIT_PRODUCTION_STABILITY_STRICT: "1",
      DATABASE_URL: "",
      AUTH_SECRET: secret,
      NEXTAUTH_SECRET: "",
      NODE_ENV: "development",
      DIRECT_URL: "postgresql://a:b@localhost:5432/x",
    },
  });
  assert.equal(r.status, 1);
  assert.match(r.stdout, /DATABASE_URL: missing/);
  assert.equal(r.stdout.includes(secret), false, "stdout must not contain raw AUTH_SECRET");
});

test("non-strict missing DATABASE_URL exits 0", () => {
  const r = spawnSync(process.execPath, [script], {
    encoding: "utf8",
    env: {
      ...process.env,
      AUDIT_PRODUCTION_STABILITY_STRICT: "",
      DATABASE_URL: "",
      AUTH_SECRET: "x".repeat(32),
      NODE_ENV: "development",
    },
  });
  assert.equal(r.status, 0);
});

test("--self-check exits 0", () => {
  const r = spawnSync(process.execPath, [script, "--self-check"], {
    encoding: "utf8",
    env: { ...process.env },
  });
  assert.equal(r.status, 0);
  assert.match(r.stdout, /--self-check ok/);
});
