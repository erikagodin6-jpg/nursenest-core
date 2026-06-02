#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const reportDir = path.join(repoRoot, "reports", "deployment-reliability");
const reportPath = path.join(reportDir, "runtime-config-validation.json");

function redact(value) {
  if (!value) return null;
  const s = String(value);
  if (s.length <= 8) return "***";
  return `${s.slice(0, 3)}***${s.slice(-3)}`;
}

function parsePostgresUrl(key, value) {
  if (!value || !String(value).trim()) {
    return { ok: false, key, code: "missing", message: `${key} is required.` };
  }
  const raw = String(value).trim();
  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    return { ok: false, key, code: "unparseable", message: `${key} is not a parseable URL.` };
  }

  const protocol = parsed.protocol.replace(/:$/, "");
  if (protocol !== "postgresql" && protocol !== "postgres") {
    return { ok: false, key, code: "invalid_protocol", message: `${key} must use postgres:// or postgresql://.` };
  }
  if (!parsed.hostname) {
    return { ok: false, key, code: "missing_hostname", message: `${key} is missing a hostname.` };
  }
  if (parsed.port && !/^\d+$/.test(parsed.port)) {
    return { ok: false, key, code: "invalid_port", message: `${key} has a non-numeric port.` };
  }
  if (parsed.port) {
    const port = Number(parsed.port);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      return { ok: false, key, code: "invalid_port", message: `${key} port must be between 1 and 65535.` };
    }
  }
  const database = parsed.pathname.replace(/^\/+/, "").split("/")[0];
  if (!database) {
    return { ok: false, key, code: "missing_database", message: `${key} is missing a database name.` };
  }

  const hostname = parsed.hostname.toLowerCase();
  const allowLocal = /^(1|true|yes)$/i.test(process.env.DEPLOYMENT_CERT_ALLOW_LOCAL_DB ?? "");
  if (!allowLocal && ["localhost", "127.0.0.1", "::1", "0.0.0.0"].includes(hostname)) {
    return {
      ok: false,
      key,
      code: "local_database_host",
      message: `${key} points at a local database host. Set DEPLOYMENT_CERT_ALLOW_LOCAL_DB=1 only for local certification.`,
      parsed: { protocol, hostname, port: parsed.port || "default", database },
    };
  }

  return {
    ok: true,
    key,
    parsed: {
      protocol,
      hostname,
      port: parsed.port || "default",
      database,
      usernamePresent: Boolean(parsed.username),
      passwordPresent: Boolean(parsed.password),
    },
  };
}

function validateSecret(key, value) {
  if (!value || !String(value).trim()) {
    return { ok: false, key, code: "missing", message: `${key} is required.` };
  }
  const raw = String(value).trim();
  if (raw.length < 32) {
    return { ok: false, key, code: "too_short", message: `${key} must be at least 32 characters.` };
  }
  if (/^(changeme|change-me|secret|test|password|placeholder)$/i.test(raw)) {
    return { ok: false, key, code: "placeholder", message: `${key} appears to be a placeholder.` };
  }
  return { ok: true, key, length: raw.length, fingerprint: redact(raw) };
}

function validateSpaces(env) {
  const checks = [];
  const key = env.SPACES_KEY?.trim();
  const secret = env.SPACES_SECRET?.trim();
  const bucket = env.SPACES_BUCKET?.trim() || "nursenest-images";
  const region = env.SPACES_REGION?.trim() || "tor1";
  const endpoint = env.SPACES_ENDPOINT?.trim() || `https://${region}.digitaloceanspaces.com`;

  checks.push(key ? { ok: true, key: "SPACES_KEY", fingerprint: redact(key) } : {
    ok: false,
    key: "SPACES_KEY",
    code: "missing",
    message: "SPACES_KEY is required for deployment certification.",
  });
  checks.push(secret ? { ok: true, key: "SPACES_SECRET", fingerprint: redact(secret) } : {
    ok: false,
    key: "SPACES_SECRET",
    code: "missing",
    message: "SPACES_SECRET is required for deployment certification.",
  });
  checks.push(bucket ? { ok: true, key: "SPACES_BUCKET", value: bucket } : {
    ok: false,
    key: "SPACES_BUCKET",
    code: "missing",
    message: "SPACES_BUCKET must not be empty.",
  });
  checks.push(region ? { ok: true, key: "SPACES_REGION", value: region } : {
    ok: false,
    key: "SPACES_REGION",
    code: "missing",
    message: "SPACES_REGION must not be empty.",
  });

  try {
    const parsed = new URL(endpoint);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      checks.push({ ok: false, key: "SPACES_ENDPOINT", code: "invalid_protocol", message: "SPACES_ENDPOINT must use http(s)." });
    } else {
      checks.push({ ok: true, key: "SPACES_ENDPOINT", origin: parsed.origin });
    }
  } catch {
    checks.push({ ok: false, key: "SPACES_ENDPOINT", code: "unparseable", message: "SPACES_ENDPOINT is not a valid URL." });
  }

  return checks;
}

const checks = [
  parsePostgresUrl("DATABASE_URL", process.env.DATABASE_URL),
  parsePostgresUrl("DIRECT_URL", process.env.DIRECT_URL),
  validateSecret("AUTH_SECRET", process.env.AUTH_SECRET),
  validateSecret("NEXTAUTH_SECRET", process.env.NEXTAUTH_SECRET),
  ...validateSpaces(process.env),
];

const failed = checks.filter((check) => !check.ok);
const report = {
  generatedAt: new Date().toISOString(),
  status: failed.length === 0 ? "pass" : "fail",
  failureCount: failed.length,
  checks,
};

fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

for (const check of checks) {
  const status = check.ok ? "OK" : "FAIL";
  console.log(`[deploy:runtime-config] ${status} ${check.key}${check.message ? ` ${check.message}` : ""}`);
}
console.log(`[deploy:runtime-config] report=${path.relative(repoRoot, reportPath)}`);

if (failed.length > 0) {
  process.exit(1);
}
