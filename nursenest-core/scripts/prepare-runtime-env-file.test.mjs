import assert from "node:assert/strict";
import { chmodSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const appRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const prepareScript = path.join(appRoot, "scripts", "prepare-runtime-env-file.mjs");

function createRuntimeEnvFixture(contents, mode = 0o600) {
  const tempRoot = mkdtempSync(path.join(os.tmpdir(), "nn-prepare-runtime-env-"));
  const runtimeEnvFile = path.join(tempRoot, "env.production");
  writeFileSync(runtimeEnvFile, contents, "utf8");
  chmodSync(runtimeEnvFile, mode);
  return {
    runtimeEnvFile,
    cleanup() {
      rmSync(tempRoot, { recursive: true, force: true });
    },
  };
}

function runPrepare(runtimeEnvFile) {
  return spawnSync(process.execPath, [prepareScript], {
    cwd: appRoot,
    env: {
      ...process.env,
      NN_RUNTIME_ENV_FILE: runtimeEnvFile,
    },
    encoding: "utf8",
  });
}

test("prepare-runtime-env-file accepts owner-only allowlisted files with required keys", () => {
  const fixture = createRuntimeEnvFixture(
    [
      "DATABASE_URL=postgresql://runtime-user:runtime-secret@db.example.com:5432/app",
      "AUTH_SECRET=super-secret-auth",
      "NEXTAUTH_URL=https://www.nursenest.ca",
      "AUTH_URL=https://www.nursenest.ca",
      "STRIPE_SECRET_KEY=sk_live_super_secret",
      "STRIPE_WEBHOOK_SECRET=whsec_super_secret",
      "",
    ].join("\n"),
  );

  try {
    const result = runPrepare(fixture.runtimeEnvFile);
    const logs = result.stdout + result.stderr;
    assert.equal(result.status, 0, logs);
    assert.match(logs, /prepare_runtime_env_file_ok:true/);
    assert.doesNotMatch(logs, /runtime-secret/);
    assert.doesNotMatch(logs, /super-secret-auth/);
    assert.doesNotMatch(logs, /sk_live_super_secret/);
  } finally {
    fixture.cleanup();
  }
});

test("prepare-runtime-env-file rejects open permissions", () => {
  const fixture = createRuntimeEnvFixture(
    [
      "DATABASE_URL=postgresql://runtime-user:runtime-secret@db.example.com:5432/app",
      "AUTH_SECRET=super-secret-auth",
      "AUTH_URL=https://www.nursenest.ca",
      "STRIPE_SECRET_KEY=sk_live_super_secret",
      "STRIPE_WEBHOOK_SECRET=whsec_super_secret",
      "",
    ].join("\n"),
    0o644,
  );

  try {
    const result = runPrepare(fixture.runtimeEnvFile);
    const logs = result.stdout + result.stderr;
    assert.notEqual(result.status, 0);
    assert.match(logs, /RUNTIME_ENV_FILE_PERMISSIONS/);
    assert.doesNotMatch(logs, /runtime-secret/);
  } finally {
    fixture.cleanup();
  }
});
