import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  RuntimeEnvFileFallbackError,
  loadRuntimeEnvFileFallback,
  parseRuntimeEnvFile,
} from "./runtime-env-file-fallback.mjs";

const runtimeDatabaseUrl = "postgresql://runtime-user:runtime-password@db.example.com:25060/nursenest";
const fallbackDatabaseUrl = "postgresql://file-user:file-password@file-db.example.com:5432/filedb";

function createTempRuntimeEnvFile(contents) {
  const tempRoot = mkdtempSync(path.join(os.tmpdir(), "nn-runtime-env-file-"));
  const runtimeEnvFile = path.join(tempRoot, "env.production");
  writeFileSync(runtimeEnvFile, contents, "utf8");
  return {
    tempRoot,
    runtimeEnvFile,
    cleanup() {
      rmSync(tempRoot, { recursive: true, force: true });
    },
  };
}

function createLogger() {
  const entries = [];
  return {
    logger: {
      info: (...args) => entries.push(args.join(" ")),
      warn: (...args) => entries.push(args.join(" ")),
      error: (...args) => entries.push(args.join(" ")),
      log: (...args) => entries.push(args.join(" ")),
    },
    entries,
  };
}

test("parseRuntimeEnvFile supports quotes and comments", () => {
  const parsed = parseRuntimeEnvFile(
    [
      "# comment",
      "DATABASE_URL='postgresql://quoted-user:quoted-password@db.example.com:5432/app'",
      'AUTH_SECRET="quoted secret value"',
      "STRIPE_PRICE_RN_MONTHLY=price_123 # inline comment",
      "",
    ].join("\n"),
  );

  assert.equal(
    parsed.values.get("DATABASE_URL"),
    "postgresql://quoted-user:quoted-password@db.example.com:5432/app",
  );
  assert.equal(parsed.values.get("AUTH_SECRET"), "quoted secret value");
  assert.equal(parsed.values.get("STRIPE_PRICE_RN_MONTHLY"), "price_123");
});

test("process.env wins over runtime env file values", () => {
  const fixture = createTempRuntimeEnvFile(
    [
      `DATABASE_URL=${fallbackDatabaseUrl}`,
      "AUTH_SECRET=file-auth-secret",
      "",
    ].join("\n"),
  );
  const { logger, entries } = createLogger();

  try {
    const env = {
      DATABASE_URL: runtimeDatabaseUrl,
      AUTH_SECRET: "process-auth-secret",
    };
    const result = loadRuntimeEnvFileFallback({
      env,
      runtimeEnvFile: fixture.runtimeEnvFile,
      logger,
    });

    assert.equal(env.DATABASE_URL, runtimeDatabaseUrl);
    assert.equal(env.AUTH_SECRET, "process-auth-secret");
    assert.deepEqual(result.loadedKeys, []);
    assert.match(entries.join("\n"), /runtime_env_file_loaded:true/);
    assert.doesNotMatch(entries.join("\n"), /file-password/);
    assert.doesNotMatch(entries.join("\n"), /file-auth-secret/);
  } finally {
    fixture.cleanup();
  }
});

test("runtime env file fills missing DATABASE_URL", () => {
  const fixture = createTempRuntimeEnvFile(
    [
      `DATABASE_URL=${fallbackDatabaseUrl}`,
      "AUTH_SECRET=file-auth-secret",
      "",
    ].join("\n"),
  );
  const { logger } = createLogger();

  try {
    const env = {};
    const result = loadRuntimeEnvFileFallback({
      env,
      runtimeEnvFile: fixture.runtimeEnvFile,
      logger,
    });

    assert.equal(env.DATABASE_URL, fallbackDatabaseUrl);
    assert.equal(env.AUTH_SECRET, "file-auth-secret");
    assert.deepEqual(result.loadedKeys, ["AUTH_SECRET", "DATABASE_URL"]);
  } finally {
    fixture.cleanup();
  }
});

test("disallowed keys are ignored", () => {
  const fixture = createTempRuntimeEnvFile(
    [
      `DATABASE_URL=${fallbackDatabaseUrl}`,
      "MALICIOUS_OVERRIDE=please-no",
      "",
    ].join("\n"),
  );
  const { logger } = createLogger();

  try {
    const env = {};
    const result = loadRuntimeEnvFileFallback({
      env,
      runtimeEnvFile: fixture.runtimeEnvFile,
      logger,
    });

    assert.equal(env.DATABASE_URL, fallbackDatabaseUrl);
    assert.equal(env.MALICIOUS_OVERRIDE, undefined);
    assert.deepEqual(result.loadedKeys, ["DATABASE_URL"]);
    assert.deepEqual(result.ignoredKeys, ["MALICIOUS_OVERRIDE"]);
  } finally {
    fixture.cleanup();
  }
});

test("malformed runtime env file fails safely", () => {
  const fixture = createTempRuntimeEnvFile(
    [
      "DATABASE_URL='postgresql://malformed-user:malformed-secret@db.example.com:5432/app",
      "",
    ].join("\n"),
  );

  try {
    assert.throws(
      () => loadRuntimeEnvFileFallback({ env: {}, runtimeEnvFile: fixture.runtimeEnvFile, logger: createLogger().logger }),
      (error) => {
        assert.ok(error instanceof RuntimeEnvFileFallbackError);
        assert.match(error.message, /line 1/i);
        assert.doesNotMatch(error.message, /malformed-secret/);
        return true;
      },
    );
  } finally {
    fixture.cleanup();
  }
});

test("logs and errors never include secret values", () => {
  const fixture = createTempRuntimeEnvFile(
    [
      "AUTH_SECRET=super-secret-auth-value",
      "STRIPE_SECRET_KEY=sk_live_super_secret_value",
      "",
    ].join("\n"),
  );
  const { logger, entries } = createLogger();

  try {
    loadRuntimeEnvFileFallback({
      env: {},
      runtimeEnvFile: fixture.runtimeEnvFile,
      logger,
    });

    const logs = entries.join("\n");
    assert.match(logs, /loaded_keys:\["AUTH_SECRET","STRIPE_SECRET_KEY"\]/);
    assert.doesNotMatch(logs, /super-secret-auth-value/);
    assert.doesNotMatch(logs, /sk_live_super_secret_value/);
  } finally {
    fixture.cleanup();
  }
});
