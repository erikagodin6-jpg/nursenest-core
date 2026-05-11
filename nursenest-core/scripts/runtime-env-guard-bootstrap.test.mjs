import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { loadRuntimeEnv } from "./lib/load-runtime-env.mjs";
import { buildForwardedRuntimeEnv } from "./lib/standalone-env-forwarding.mjs";

const appRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const bootstrapScript = path.join(appRoot, "scripts", "runtime-env-guard-bootstrap.mjs");
const standaloneStartScript = path.join(appRoot, "scripts", "start-standalone.mjs");
const runtimeDatabaseUrl = "postgresql://runtime-user:super-secret-password@db.example.com:25060/nursenest";

function runBootstrap(env) {
  return spawnSync(process.execPath, [bootstrapScript], {
    cwd: appRoot,
    env: {
      PATH: process.env.PATH,
      HOME: process.env.HOME,
      NODE_ENV: "production",
      AI_ADMIN_GENERATION_ENABLED: "false",
      AUTH_SECRET: "test-auth-secret",
      ...env,
    },
    encoding: "utf8",
  });
}

test("process.env.DATABASE_URL survives runtime env guard bootstrap", () => {
  const result = runBootstrap({ DATABASE_URL: runtimeDatabaseUrl });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stderr, /DATABASE_URL_present:\s*true/);
  assert.doesNotMatch(result.stderr + result.stdout, /super-secret-password/);
});

test("runtime env file fallback hydrates missing DATABASE_URL before validation", () => {
  const tempRoot = mkdtempSync(path.join(os.tmpdir(), "nn-runtime-env-file-bootstrap-"));
  const runtimeEnvFile = path.join(tempRoot, "env.production");
  try {
    writeFileSync(
      runtimeEnvFile,
      [
        "DATABASE_URL=postgresql://file-user:file-secret@file-db.example.com:5432/filedb",
        "",
      ].join("\n"),
    );

    const result = runBootstrap({
      NN_RUNTIME_ENV_FILE: runtimeEnvFile,
      DATABASE_URL: undefined,
    });

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stderr, /runtime_env_file_loaded:true/);
    assert.match(result.stderr, /loaded_keys:\["DATABASE_URL"\]/);
    assert.match(result.stderr, /DATABASE_URL_present:\s*true/);
    assert.doesNotMatch(result.stderr + result.stdout, /file-secret/);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("dotenv hydration cannot erase an existing DATABASE_URL", () => {
  const tempRoot = mkdtempSync(path.join(os.tmpdir(), "nn-runtime-env-"));
  const previousDatabaseUrl = process.env.DATABASE_URL;
  const previousDirectUrl = process.env.DIRECT_URL;
  try {
    writeFileSync(
      path.join(tempRoot, ".env"),
      [
        "DATABASE_URL=postgresql://file-user:file-secret@file-db.example.com:5432/filedb",
        "DIRECT_URL=postgresql://direct-user:direct-secret@direct-db.example.com:5432/directdb",
        "",
      ].join("\n"),
    );
    process.env.DATABASE_URL = runtimeDatabaseUrl;
    delete process.env.DIRECT_URL;

    const telemetry = loadRuntimeEnv({
      envRoot: tempRoot,
      validate: false,
      quiet: true,
      purpose: "test-dotenv-preserve-runtime",
    });

    assert.equal(process.env.DATABASE_URL, runtimeDatabaseUrl);
    assert.equal(process.env.DIRECT_URL, "postgresql://direct-user:direct-secret@direct-db.example.com:5432/directdb");
    assert.equal(telemetry.databaseUrlSource, "process.env");
    assert.equal(telemetry.directUrlSource, ".env");
  } finally {
    if (previousDatabaseUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previousDatabaseUrl;
    if (previousDirectUrl === undefined) delete process.env.DIRECT_URL;
    else process.env.DIRECT_URL = previousDirectUrl;
    rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("standalone child env forwarding preserves parent env and applies only child overrides", () => {
  const childEnv = buildForwardedRuntimeEnv(
    {
      DATABASE_URL: runtimeDatabaseUrl,
      AUTH_SECRET: "test-auth-secret",
      PORT: "8080",
      HOSTNAME: "0.0.0.0",
    },
    {
      PORT: "38291",
      HOSTNAME: "127.0.0.1",
    },
  );

  assert.equal(childEnv.DATABASE_URL, runtimeDatabaseUrl);
  assert.equal(childEnv.AUTH_SECRET, "test-auth-secret");
  assert.equal(childEnv.PORT, "38291");
  assert.equal(childEnv.HOSTNAME, "127.0.0.1");
});

test("start-standalone spawn wrappers use forwarded process.env", async () => {
  const source = await import("node:fs/promises").then((fs) => fs.readFile(standaloneStartScript, "utf8"));
  assert.match(source, /spawnSync\(process\.execPath,[\s\S]*env:\s*buildForwardedRuntimeEnv\(process\.env\)/);
  assert.match(source, /spawn\(process\.execPath,[\s\S]*env:\s*buildForwardedRuntimeEnv\(process\.env,\s*\{/);
  assert.doesNotMatch(source, /env:\s*\{\s*PORT:/);
});

test("missing DATABASE_URL throws a clear runtime forwarding error", () => {
  const result = runBootstrap({ DATABASE_URL: "" });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /DATABASE_URL is missing in the first runtime Node process/);
  assert.match(result.stderr, /env attachment, source_dir, run_command, deployment freshness, rollback state, dotenv precedence, and wrapper env forwarding/);
});

test("runtime env diagnostics do not log secret values", () => {
  const result = runBootstrap({
    DATABASE_URL: runtimeDatabaseUrl,
    OPENAI_API_KEY: "sk-test-secret-value",
    AI_INTEGRATIONS_OPENAI_API_KEY: "sk-integrations-secret-value",
    NN_RUNTIME_ENV_PROBE: "1",
  });
  const logs = result.stdout + result.stderr;
  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(logs, /super-secret-password/);
  assert.doesNotMatch(logs, /runtime-user/);
  assert.doesNotMatch(logs, /sk-test-secret-value/);
  assert.doesNotMatch(logs, /sk-integrations-secret-value/);
  assert.match(logs, /runtime_env_probe_keys/);
  assert.match(logs, /DATABASE_URL/);
  assert.match(logs, /NODE_ENV/);
});

test("invalid AUTH_URL still fails validation when explicitly set", () => {
  const result = runBootstrap({
    DATABASE_URL: runtimeDatabaseUrl,
    AUTH_URL: "https://www.nursenest.test/api/auth",
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /AUTH_URL must be origin-only/);
});
