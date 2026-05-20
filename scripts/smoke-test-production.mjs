#!/usr/bin/env node
import { spawn } from "node:child_process";
import pg from "pg";

const port = String(process.env.PORT || "8080");
const baseUrl = `http://127.0.0.1:${port}`;
const healthUrl = `${baseUrl}/health`;
const bootTimeoutMs = Number(process.env.SMOKE_BOOT_TIMEOUT_MS || 45000);
const healthTimeoutMs = Number(process.env.SMOKE_HEALTH_TIMEOUT_MS || 8000);

function fail(reason) {
  console.error(`SMOKE FAIL: ${reason}`);
  process.exit(1);
}

function timeoutFetch(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { signal: controller.signal })
    .finally(() => clearTimeout(timer));
}

async function optionalDbProbe() {
  const connectionString = process.env.DATABASE_URL || process.env.PROD_DATABASE_URL;
  if (!connectionString) {
    console.log("SMOKE: DB probe skipped (DATABASE_URL/PROD_DATABASE_URL not set).");
    return;
  }

  const pool = new pg.Pool({
    connectionString,
    connectionTimeoutMillis: 5000,
    statement_timeout: 5000,
    ssl: /render\.com|supabase\.co|neon\.tech|railway\.app|amazonaws\.com|azure\.com|ondigitalocean\.com/i.test(
      connectionString,
    )
      ? { rejectUnauthorized: false }
      : false,
  });
  try {
    await pool.query("SELECT 1");
    console.log("SMOKE: DB OK");
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    fail(`database probe failed: ${msg}`);
  } finally {
    try {
      await pool.end();
    } catch {}
  }
}

const child = spawn("node", ["scripts/start-production.mjs"], {
  env: { ...process.env, PORT: port },
  stdio: ["ignore", "pipe", "pipe"],
});

let bootResolved = false;
let stdoutLog = "";
let stderrLog = "";

const bootPromise = new Promise((resolve, reject) => {
  const timer = setTimeout(() => {
    if (!bootResolved) {
      reject(new Error(`timeout waiting for server boot after ${bootTimeoutMs}ms`));
    }
  }, bootTimeoutMs);

  const onData = (chunk) => {
    const text = chunk.toString();
    stdoutLog += text;
    process.stdout.write(text);
    if (
      text.includes("BOOT SUCCESS") ||
      text.includes("SERVER STARTED") ||
      text.includes(`LISTENING ON PORT ${port}`)
    ) {
      bootResolved = true;
      clearTimeout(timer);
      resolve();
    }
  };

  child.stdout.on("data", onData);
  child.stderr.on("data", (chunk) => {
    const text = chunk.toString();
    stderrLog += text;
    process.stderr.write(text);
  });

  child.on("exit", (code, signal) => {
    if (!bootResolved) {
      clearTimeout(timer);
      reject(
        new Error(
          `app exited before ready (code=${code}, signal=${signal})\nstdout:\n${stdoutLog}\nstderr:\n${stderrLog}`,
        ),
      );
    }
  });
});

try {
  console.log(`SMOKE: waiting for boot on PORT=${port} ...`);
  await bootPromise;

  const healthResp = await timeoutFetch(healthUrl, healthTimeoutMs);
  const body = await healthResp.text();
  console.log(`SMOKE: /health status=${healthResp.status} body=${JSON.stringify(body)}`);
  if (healthResp.status !== 200) {
    fail(`/health returned non-200 status ${healthResp.status}`);
  }

  await optionalDbProbe();
  console.log("SMOKE PASS");
  child.kill("SIGTERM");
  process.exit(0);
} catch (e) {
  const msg = e instanceof Error ? e.message : String(e);
  child.kill("SIGTERM");
  fail(msg);
}
