#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const reportDir = path.join(repoRoot, "reports", "deployment-reliability");
const reportPath = path.join(reportDir, "deployment-smoke-certification.json");
const unhealthyPath = path.join(reportDir, "deployment-unhealthy.json");

const baseUrl = process.env.BASE_URL?.trim() || process.env.DEPLOYMENT_BASE_URL?.trim();
if (!baseUrl) {
  console.error("[deploy:smoke] BASE_URL or DEPLOYMENT_BASE_URL is required.");
  process.exit(2);
}

const normalizedBase = baseUrl.replace(/\/+$/, "");
const timeoutMs = Math.min(60_000, Math.max(1_000, Number(process.env.DEPLOYMENT_SMOKE_TIMEOUT_MS ?? 10_000) || 10_000));
const maxAttempts = Math.min(10, Math.max(1, Number(process.env.DEPLOYMENT_SMOKE_ATTEMPTS ?? 2) || 2));

const smokeRoutes = [
  { path: "/", expected: "html", statusMin: 200, statusMax: 399 },
  { path: "/canada/rn/nclex-rn", expected: "html", statusMin: 200, statusMax: 399 },
  { path: "/canada/pn/rex-pn", expected: "html", statusMin: 200, statusMax: 399 },
  { path: "/canada/np/cnple", expected: "html", statusMin: 200, statusMax: 399 },
  { path: "/flashcards", expected: "html", statusMin: 200, statusMax: 399 },
  { path: "/cat", expected: "html", statusMin: 200, statusMax: 399 },
  { path: "/practice-tests", expected: "html", statusMin: 200, statusMax: 399 },
  { path: "/lessons", expected: "html", statusMin: 200, statusMax: 399 },
  { path: "/readyz", expected: "text", statusMin: 200, statusMax: 299 },
  { path: "/healthz", expected: "text", statusMin: 200, statusMax: 299 },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const started = Date.now();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        accept: "text/html,application/json,text/plain;q=0.8,*/*;q=0.5",
        "user-agent": "NurseNest deployment-certification/1.0",
      },
    });
    const text = await response.text();
    return {
      ok: true,
      status: response.status,
      finalUrl: response.url,
      durationMs: Date.now() - started,
      contentType: response.headers.get("content-type") ?? "",
      bodyPreview: text.slice(0, 240),
      bodyBytes: Buffer.byteLength(text),
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      finalUrl: url,
      durationMs: Date.now() - started,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timer);
  }
}

function evaluate(route, result) {
  if (!result.ok) return { ok: false, reason: result.error ?? "request_failed" };
  if (result.status < route.statusMin || result.status > route.statusMax) {
    return { ok: false, reason: `unexpected_status_${result.status}` };
  }
  const contentType = result.contentType.toLowerCase();
  if (route.expected === "html" && !contentType.includes("text/html")) {
    return { ok: false, reason: `unexpected_content_type_${result.contentType || "missing"}` };
  }
  if (route.expected === "text" && !(contentType.includes("text/plain") || contentType.includes("application/json"))) {
    return { ok: false, reason: `unexpected_content_type_${result.contentType || "missing"}` };
  }
  if (/origin_no_healthy_upstream|no healthy upstream|application error|internal server error/i.test(result.bodyPreview ?? "")) {
    return { ok: false, reason: "body_contains_failure_signature" };
  }
  return { ok: true, reason: "ok" };
}

async function certifyRoute(route) {
  const attempts = [];
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const result = await fetchWithTimeout(`${normalizedBase}${route.path}`);
    const verdict = evaluate(route, result);
    attempts.push({ attempt, ...result, verdict });
    if (verdict.ok) {
      return { route: route.path, ok: true, attempts };
    }
    if (attempt < maxAttempts) await sleep(750 * attempt);
  }
  return { route: route.path, ok: false, attempts };
}

const results = [];
for (const route of smokeRoutes) {
  const result = await certifyRoute(route);
  results.push(result);
  const finalAttempt = result.attempts.at(-1);
  console.log(
    `[deploy:smoke] ${result.ok ? "OK" : "FAIL"} ${route.path} status=${finalAttempt?.status ?? 0} durationMs=${finalAttempt?.durationMs ?? 0}`,
  );
}

const failures = results.filter((result) => !result.ok);
const report = {
  generatedAt: new Date().toISOString(),
  baseUrl: normalizedBase,
  status: failures.length === 0 ? "pass" : "fail",
  failureCount: failures.length,
  promotion: failures.length === 0 ? "allowed" : "blocked",
  rollback: failures.length === 0 ? "not_required" : "required",
  results,
};

fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length > 0) {
  const unhealthy = {
    generatedAt: report.generatedAt,
    status: "unhealthy",
    reason: "deployment_smoke_certification_failed",
    failedRoutes: failures.map((failure) => failure.route),
    rollback: "required",
    report: path.relative(repoRoot, reportPath),
  };
  fs.writeFileSync(unhealthyPath, `${JSON.stringify(unhealthy, null, 2)}\n`);
  console.error(`[deploy:smoke] deployment_unhealthy rollback_required report=${path.relative(repoRoot, unhealthyPath)}`);
  process.exit(1);
}

if (fs.existsSync(unhealthyPath)) fs.rmSync(unhealthyPath);
console.log(`[deploy:smoke] PASS deployment_certified report=${path.relative(repoRoot, reportPath)}`);
