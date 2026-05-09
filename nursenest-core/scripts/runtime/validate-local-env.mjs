#!/usr/bin/env node
/**
 * Strict local runtime validation for standalone and Playwright workflows.
 *
 * This is intentionally narrower than production validation: it checks the env
 * needed to boot a diagnosable local server, without weakening app-wide guards.
 */
import { execSync } from "node:child_process";
import net from "node:net";

function hasValue(name) {
  return typeof process.env[name] === "string" && process.env[name].trim().length > 0;
}

function value(name) {
  return process.env[name]?.trim() ?? "";
}

function log(level, message) {
  const stream = level === "ok" ? console.log : level === "warn" ? console.warn : console.error;
  stream(`[runtime-env] ${message}`);
}

function parseArgs(argv) {
  return {
    checkPort: argv.includes("--check-port"),
  };
}

function validateOrigin(name, { requireOriginOnly = false } = {}) {
  const raw = value(name);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return `${name} must use http:// or https://.`;
    }
    if (requireOriginOnly && (url.pathname !== "/" || url.search || url.hash)) {
      return `${name} must be an origin only, with no path/query/hash.`;
    }
    return null;
  } catch {
    return `${name} is not a valid absolute URL.`;
  }
}

function portHasListener(port, host) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host }, () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
    socket.setTimeout(800, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

function describeListeners(port) {
  const lines = [];
  try {
    const out = execSync(`ss -ltnp 'sport = :${port}' 2>/dev/null || true`, {
      encoding: "utf8",
      maxBuffer: 512 * 1024,
    });
    if (out.trim()) lines.push(out.trim());
  } catch {
    // Listener details are diagnostic only.
  }
  try {
    const out = execSync(`command -v lsof >/dev/null 2>&1 && lsof -nP -iTCP:${port} -sTCP:LISTEN 2>/dev/null || true`, {
      encoding: "utf8",
      maxBuffer: 512 * 1024,
    });
    if (out.trim()) lines.push(out.trim());
  } catch {
    // Listener details are diagnostic only.
  }
  return lines.length ? lines.join("\n") : "(no ss/lsof listener details available)";
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const failures = [];
  const warnings = [];

  if (!hasValue("AUTH_SECRET") && !hasValue("NEXTAUTH_SECRET")) {
    failures.push("Missing AUTH_SECRET or NEXTAUTH_SECRET for Auth.js session signing.");
  }

  if (!hasValue("NEXT_PUBLIC_APP_URL")) {
    failures.push("Missing NEXT_PUBLIC_APP_URL; local standalone uses it for canonical and billing callback origins.");
  }

  const authOrigin = value("AUTH_URL") || value("NEXTAUTH_URL") || value("NEXT_PUBLIC_APP_URL") || value("PLAYWRIGHT_BASE_URL");
  if (!authOrigin) {
    failures.push("Missing AUTH_URL/NEXTAUTH_URL or another local origin (NEXT_PUBLIC_APP_URL / PLAYWRIGHT_BASE_URL).");
  }

  for (const issue of [
    validateOrigin("AUTH_URL", { requireOriginOnly: true }),
    validateOrigin("NEXTAUTH_URL", { requireOriginOnly: true }),
    validateOrigin("NEXT_PUBLIC_APP_URL", { requireOriginOnly: true }),
    validateOrigin("PLAYWRIGHT_BASE_URL", { requireOriginOnly: true }),
    validateOrigin("SCREENSHOT_BASE_URL", { requireOriginOnly: true }),
  ]) {
    if (issue) failures.push(issue);
  }

  if (!hasValue("DATABASE_URL")) {
    warnings.push("DATABASE_URL is unset; Prisma-backed routes such as /app may fail readiness.");
  }

  const portRaw = value("PORT") || "3000";
  if (!/^\d+$/.test(portRaw)) {
    failures.push(`PORT="${portRaw}" is not numeric.`);
  }

  const port = Number.parseInt(portRaw, 10);
  if (Number.isFinite(port) && (port <= 0 || port > 65535)) {
    failures.push(`PORT="${portRaw}" is outside the valid TCP range.`);
  }

  if (args.checkPort && failures.length === 0) {
    const host = value("HOSTNAME") || "127.0.0.1";
    const probeHost = host === "0.0.0.0" || host === "::" ? "127.0.0.1" : host;
    const inUse = await portHasListener(port, probeHost);
    if (inUse) {
      failures.push(
        `Port collision: ${probeHost}:${port} already accepts TCP connections.\n${describeListeners(port)}`,
      );
    }
  }

  log("ok", `AUTH_SECRET present=${hasValue("AUTH_SECRET") ? "yes" : "no"}; NEXTAUTH_SECRET present=${hasValue("NEXTAUTH_SECRET") ? "yes" : "no"}`);
  log("ok", `NEXT_PUBLIC_APP_URL present=${hasValue("NEXT_PUBLIC_APP_URL") ? "yes" : "no"}`);
  log("ok", `runtime origin source=${hasValue("AUTH_URL") ? "AUTH_URL" : hasValue("NEXTAUTH_URL") ? "NEXTAUTH_URL" : hasValue("NEXT_PUBLIC_APP_URL") ? "NEXT_PUBLIC_APP_URL" : hasValue("PLAYWRIGHT_BASE_URL") ? "PLAYWRIGHT_BASE_URL" : "missing"}`);
  log("ok", `PORT=${portRaw}; checkPort=${args.checkPort ? "yes" : "no"}`);

  for (const warning of warnings) log("warn", warning);

  if (failures.length > 0) {
    for (const failure of failures) log("error", failure);
    log("error", "Validation failed. See docs/runtime/local-runtime-modes.md for exact local commands.");
    process.exit(1);
  }

  log("ok", "local runtime env validation passed.");
}

main().catch((error) => {
  log("error", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
