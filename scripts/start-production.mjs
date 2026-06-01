#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

console.log("[STARTUP_VIS] start-production.mjs: first line after static imports");

const LOG_TIMEZONE = "America/Toronto";

if (!process.env.TZ || !process.env.TZ.trim()) {
  process.env.TZ = LOG_TIMEZONE;
}

function getTorontoIsoTimestamp(date = new Date()) {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: LOG_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const tzName =
    new Intl.DateTimeFormat("en-US", {
      timeZone: LOG_TIMEZONE,
      timeZoneName: "longOffset",
    })
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value ?? "GMT-00:00";
  const offset = tzName.replace("GMT", "");
  const get = (type) => parts.find((part) => part.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}${offset}`;
}

function logWithTimestamp(method, ...args) {
  const local = getTorontoIsoTimestamp();
  const utc = new Date().toISOString();
  console[method](`[ts_local=${local} ts_utc=${utc}]`, ...args);
}

function applyRuntimeHeapLimit() {
  const rawLimit = process.env.NODE_MAX_OLD_SPACE_SIZE_MB?.trim();
  if (!rawLimit) return;
  const limit = Number.parseInt(rawLimit, 10);
  if (!Number.isFinite(limit) || limit < 256) {
    logWithTimestamp("error", `[runtime_env] ignoring invalid NODE_MAX_OLD_SPACE_SIZE_MB=${JSON.stringify(rawLimit)}`);
    return;
  }

  const current = process.env.NODE_OPTIONS ?? "";
  const next = current.match(/--max-old-space-size=\d+/)
    ? current.replace(/--max-old-space-size=\d+/g, `--max-old-space-size=${limit}`)
    : `${current} --max-old-space-size=${limit}`.trim();
  if (next !== current) {
    process.env.NODE_OPTIONS = next;
    logWithTimestamp("log", `[runtime_env] clamped NODE_OPTIONS max-old-space-size to ${limit} MB`);
  }
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const indexAbs = path.join(root, "dist", "index.cjs");
const nestedStandaloneStart = path.join(root, "nursenest-core", "scripts", "start-standalone.mjs");
const nestedStandaloneServer = path.join(root, "nursenest-core", ".next", "standalone", "server.js");

applyRuntimeHeapLimit();

logWithTimestamp("log", "STARTING WEB PROCESS");
logWithTimestamp("log", `NODE_ENV=${process.env.NODE_ENV ?? "(unset)"}`);
logWithTimestamp("log", `PORT=${process.env.PORT ?? "(unset; app defaults to 8080 if still unset)"}`);
logWithTimestamp("log", `TZ=${process.env.TZ}`);
logWithTimestamp("log", `cwd=${process.cwd()}`);
logWithTimestamp("log", `app_root=${root}`);
logWithTimestamp("log", `server_entry=${indexAbs}`);

const hasValue = (value) => typeof value === "string" && value.trim().length > 0;
const runtimePresence = [
  `DATABASE_URL_present=${hasValue(process.env.DATABASE_URL)}`,
  `DIRECT_URL_present=${hasValue(process.env.DIRECT_URL)}`,
  `AUTH_SECRET_present=${hasValue(process.env.AUTH_SECRET)}`,
  `NEXTAUTH_SECRET_present=${hasValue(process.env.NEXTAUTH_SECRET)}`,
];
logWithTimestamp("log", `[runtime_env] ${runtimePresence.join(" ")}`);

if (fs.existsSync(nestedStandaloneServer) && fs.existsSync(nestedStandaloneStart)) {
  logWithTimestamp(
    "log",
    `[STARTUP_VIS] start-production.mjs: delegating to Next standalone server=${nestedStandaloneServer}`,
  );

  const child = spawn(process.execPath, [nestedStandaloneStart], {
    cwd: root,
    env: process.env,
    stdio: "inherit",
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      logWithTimestamp("error", `[FATAL BOOT] Next standalone exited via signal ${signal}`);
      process.kill(process.pid, signal);
      return;
    }
    logWithTimestamp("error", `[FATAL BOOT] Next standalone exited with code ${code ?? 1}`);
    process.exit(code ?? 1);
  });

  child.on("error", (error) => {
    logWithTimestamp("error", `[FATAL BOOT] failed to start Next standalone: ${error.message}`);
    process.exit(1);
  });
} else {
if (!fs.existsSync(indexAbs)) {
  logWithTimestamp(
    "error",
    "[FATAL BOOT] dist/index.cjs is missing. Build must produce dist/index.cjs before start.\n" +
      `  expected: ${indexAbs}`,
  );
  process.exit(1);
}

process.on("unhandledRejection", (reason) => {
  logWithTimestamp("error", "[FATAL BOOT] unhandledRejection:", reason);
  if (reason instanceof Error && reason.stack) logWithTimestamp("error", reason.stack);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  logWithTimestamp("error", "[FATAL BOOT] uncaughtException:", err?.message || err);
  if (err?.stack) logWithTimestamp("error", err.stack);
  process.exit(1);
});

const require = createRequire(import.meta.url);
logWithTimestamp("log", "[STARTUP_VIS] start-production.mjs: immediately BEFORE require(dist/index.cjs)");
try {
  require(indexAbs);
  logWithTimestamp("log", "[STARTUP_VIS] start-production.mjs: require(dist/index.cjs) returned (sync evaluation done)");
} catch (e) {
  logWithTimestamp("error", "[STARTUP_VIS] start-production.mjs: require(dist/index.cjs) threw:", e?.message || e);
  logWithTimestamp("error", "[FATAL BOOT] require(dist/index.cjs) threw:", e?.message || e);
  if (e?.stack) logWithTimestamp("error", e.stack);
  process.exit(1);
}

logWithTimestamp(
  "log",
  "[start] server bundle evaluated; async boot continues until HTTP listen (see STARTING WEB SERVER / BOOT SUCCESS logs).",
);
}
