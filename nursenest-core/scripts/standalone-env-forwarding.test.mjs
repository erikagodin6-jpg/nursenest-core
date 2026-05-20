import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildForwardedRuntimeEnv } from "./lib/standalone-env-forwarding.mjs";

const appRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const runtimeDatabaseUrl = "postgresql://runtime-user:super-secret-password@db.example.com:25060/nursenest";
const runtimeAuthSecret = "test-auth-secret";

test("buildForwardedRuntimeEnv preserves runtime secrets while applying child overrides", () => {
  const childEnv = buildForwardedRuntimeEnv(
    {
      DATABASE_URL: runtimeDatabaseUrl,
      AUTH_SECRET: runtimeAuthSecret,
      PORT: "8080",
      HOSTNAME: "0.0.0.0",
    },
    {
      PORT: "38291",
      HOSTNAME: "127.0.0.1",
    },
  );

  assert.equal(childEnv.DATABASE_URL, runtimeDatabaseUrl);
  assert.equal(childEnv.AUTH_SECRET, runtimeAuthSecret);
  assert.equal(childEnv.PORT, "38291");
  assert.equal(childEnv.HOSTNAME, "127.0.0.1");
});

test("child process receives DATABASE_URL through forwarded env", () => {
  const result = spawnSync(
    process.execPath,
    [
      "-e",
      "process.stdout.write(JSON.stringify({DATABASE_URL:process.env.DATABASE_URL,AUTH_SECRET:process.env.AUTH_SECRET,NN_CHILD_MARKER:process.env.NN_CHILD_MARKER}))",
    ],
    {
      cwd: appRoot,
      env: buildForwardedRuntimeEnv(
        {
          PATH: process.env.PATH,
          HOME: process.env.HOME,
          DATABASE_URL: runtimeDatabaseUrl,
          AUTH_SECRET: runtimeAuthSecret,
        },
        { NN_CHILD_MARKER: "preserved" },
      ),
      encoding: "utf8",
    },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    DATABASE_URL: runtimeDatabaseUrl,
    AUTH_SECRET: runtimeAuthSecret,
    NN_CHILD_MARKER: "preserved",
  });
});

test("runtime wrappers pass process.env or buildForwardedRuntimeEnv", async () => {
  const files = await Promise.all([
    readFile(path.join(appRoot, "scripts", "start-standalone.mjs"), "utf8"),
    readFile(path.join(appRoot, "scripts", "runtime", "start-standalone.mjs"), "utf8"),
    readFile(path.join(appRoot, "scripts", "runtime", "build-standalone.mjs"), "utf8"),
    readFile(path.join(appRoot, "scripts", "run-node-test-filter.mjs"), "utf8"),
  ]);

  assert.match(files[0], /spawnSync\(process\.execPath,[\s\S]*env:\s*buildForwardedRuntimeEnv\(process\.env\)/);
  assert.match(files[0], /spawn\(process\.execPath,[\s\S]*env:\s*buildForwardedRuntimeEnv\(process\.env,\s*\{/);
  assert.match(files[1], /spawnSync\(process\.execPath,[\s\S]*env:\s*process\.env/);
  assert.match(files[1], /env\s*=\s*buildForwardedRuntimeEnv\(process\.env,\s*\{/);
  assert.match(files[2], /env:\s*buildForwardedRuntimeEnv\(process\.env\)/);
  assert.match(files[3], /env:\s*process\.env/);
});
