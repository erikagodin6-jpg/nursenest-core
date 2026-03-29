#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
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

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const indexAbs = path.join(root, "dist", "index.cjs");

logWithTimestamp("log", "STARTING WEB PROCESS");
logWithTimestamp("log", `NODE_ENV=${process.env.NODE_ENV ?? "(unset)"}`);
logWithTimestamp("log", `PORT=${process.env.PORT ?? "(unset; app defaults to 8080 if still unset)"}`);
logWithTimestamp("log", `TZ=${process.env.TZ}`);
logWithTimestamp("log", `cwd=${process.cwd()}`);
logWithTimestamp("log", `app_root=${root}`);
logWithTimestamp("log", `server_entry=${indexAbs}`);

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
