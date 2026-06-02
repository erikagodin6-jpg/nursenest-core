#!/usr/bin/env node
/**
 * Nightly Production Audit — Phase 5
 *
 * Runs against production (or staging) URL.
 * Validates all critical platform surfaces and generates a health report.
 *
 * Usage:
 *   BASE_URL=https://nursenest.ca npx tsx scripts/nightly-production-audit.ts
 *
 * Optional env:
 *   BASE_URL              Target base URL (default: https://nursenest.ca)
 *   AUDIT_REPORT_PATH     Output path for the markdown report
 *   AUDIT_FAIL_FAST=1     Exit 1 immediately on first failure
 *   AUDIT_TIMEOUT_MS      Per-route timeout (default: 10000)
 *
 * Output:
 *   docs/reports/nightly-health-audit.md
 *   Exit code 1 when any critical surface fails
 */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = (process.env.BASE_URL ?? "https://nursenest.ca").replace(/\/$/, "");
const TIMEOUT_MS = Number(process.env.AUDIT_TIMEOUT_MS ?? "10000");
const FAIL_FAST = process.env.AUDIT_FAIL_FAST === "1";
const REPORT_PATH = process.env.AUDIT_REPORT_PATH
  ?? resolve(__dirname, "../../docs/reports/nightly-health-audit.md");

type AuditEntry = {
  label: string;
  url: string;
  status: number | null;
  loadMs: number;
  contentCheck?: { pattern: RegExp; found: boolean };
  error: string | null;
  critical: boolean;
};

type AuditSection = {
  name: string;
  routes: AuditEntry[];
};

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<{ status: number; body: string; loadMs: number }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const start = Date.now();
  try {
    const res = await fetch(url, { signal: controller.signal, redirect: "follow" });
    const body = await res.text().catch(() => "");
    return { status: res.status, body, loadMs: Date.now() - start };
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : String(e));
  } finally {
    clearTimeout(timer);
  }
}

async function auditRoute(
  label: string,
  path: string,
  opts: { critical?: boolean; contentPattern?: RegExp } = {},
): Promise<AuditEntry> {
  const url = `${BASE_URL}${path}`;
  try {
    const { status, body, loadMs } = await fetchWithTimeout(url, TIMEOUT_MS);
    const contentCheck = opts.contentPattern
      ? { pattern: opts.contentPattern, found: opts.contentPattern.test(body) }
      : undefined;
    return { label, url, status, loadMs, contentCheck, error: null, critical: opts.critical ?? false };
  } catch (e) {
    return {
      label,
      url,
      status: null,
      loadMs: TIMEOUT_MS,
      error: e instanceof Error ? e.message.slice(0, 200) : String(e),
      critical: opts.critical ?? false,
    };
  }
}

async function runAudit(): Promise<{ sections: AuditSection[]; failCount: number }> {
  const sections: AuditSection[] = [];

  // ── Homepage ─────────────────────────────────────────────────────────────
  sections.push({
    name: "Homepage",
    routes: await Promise.all([
      auditRoute("Homepage (EN)", "/", { critical: true, contentPattern: /NurseNest/i }),
      auditRoute("Pricing", "/pricing", { critical: true }),
      auditRoute("Login", "/login", { critical: true }),
      auditRoute("Signup", "/signup", { critical: true }),
    ]),
  });

  // ── Lessons ───────────────────────────────────────────────────────────────
  sections.push({
    name: "Lessons",
    routes: await Promise.all([
      auditRoute("Lessons Hub (marketing)", "/lessons", { critical: true }),
      auditRoute("RN Lessons Hub", "/rn", { critical: true }),
      auditRoute("RPN Hub", "/canada/pn/rex-pn", { critical: true }),
      auditRoute("NP Hub", "/np", { critical: true }),
    ]),
  });

  // ── Blog ─────────────────────────────────────────────────────────────────
  sections.push({
    name: "Blog",
    routes: await Promise.all([
      auditRoute("Blog Hub", "/blog", { critical: true }),
      auditRoute("Blog sitemap", "/sitemap-blog.xml", { contentPattern: /<url>/ }),
    ]),
  });

  // ── Health APIs ───────────────────────────────────────────────────────────
  sections.push({
    name: "Health APIs",
    routes: await Promise.all([
      auditRoute("Readyz", "/readyz", { critical: true, contentPattern: /ok|ready/i }),
      auditRoute("Health ready", "/api/health/ready", { critical: true }),
      auditRoute("Notification health", "/api/subscriptions/notification-health", {
        contentPattern: /"checkedAt"/,
      }),
    ]),
  });

  // ── App surfaces (unauthenticated redirect check) ─────────────────────────
  sections.push({
    name: "App Surfaces (redirect check)",
    routes: await Promise.all([
      auditRoute("App root → login", "/app", { critical: true }),
      auditRoute("Lessons app → login", "/app/lessons", { critical: true }),
      auditRoute("Flashcards app → login", "/app/flashcards", { critical: true }),
      auditRoute("Practice Tests app → login", "/app/practice-tests", { critical: true }),
    ]),
  });

  // ── Stripe checkout availability ──────────────────────────────────────────
  sections.push({
    name: "Stripe Checkout Availability",
    routes: await Promise.all([
      auditRoute("Pricing page (checkout reachable)", "/pricing", {
        contentPattern: /subscribe|get started|checkout/i,
      }),
    ]),
  });

  const failCount = sections.flatMap((s) => s.routes).filter(
    (r) => r.error || (r.status != null && r.status >= 500) || (r.contentCheck && !r.contentCheck.found),
  ).length;

  return { sections, failCount };
}

function buildReport(sections: AuditSection[], failCount: number): string {
  const now = new Date().toISOString();
  const total = sections.flatMap((s) => s.routes).length;
  const critical = sections
    .flatMap((s) => s.routes)
    .filter((r) => r.critical && (r.error || (r.status != null && r.status >= 500)));
  const status = failCount === 0 ? "✅ HEALTHY" : critical.length > 0 ? "🔴 CRITICAL FAILURES" : "⚠️ DEGRADED";

  const sectionBlocks = sections.map((section) => {
    const rows = section.routes
      .map((r) => {
        const statusCell = r.error
          ? "❌ ERROR"
          : r.status != null && r.status >= 500
            ? `❌ ${r.status}`
            : r.status === 404
              ? `⚠️ 404`
              : r.contentCheck && !r.contentCheck.found
                ? "⚠️ content missing"
                : `✅ ${r.status}`;
        return `| ${r.label} | ${r.url.replace(BASE_URL, "")} | ${statusCell} | ${r.loadMs}ms | ${r.error?.slice(0, 80) ?? ""} |`;
      })
      .join("\n");
    return `### ${section.name}\n\n| Surface | Path | Status | Load | Error |\n|---|---|---|---|---|\n${rows}`;
  });

  return `# Nightly Production Health Audit
**Generated:** ${now}
**Target:** ${BASE_URL}
**Overall Status:** ${status}
**Routes Audited:** ${total}
**Failures:** ${failCount}

---

${sectionBlocks.join("\n\n")}

---

${
  critical.length > 0
    ? `## 🔴 Critical Failures\n${critical.map((r) => `- **${r.label}**: ${r.error ?? r.status}`).join("\n")}`
    : failCount === 0
      ? "## ✅ All systems operational"
      : "## ⚠️ Non-critical degradation detected"
}
`;
}

async function main() {
  console.log(`[NurseNest Audit] Starting nightly production audit against ${BASE_URL}`);
  const { sections, failCount } = await runAudit();

  const report = buildReport(sections, failCount);

  const reportDir = dirname(REPORT_PATH);
  if (!existsSync(reportDir)) mkdirSync(reportDir, { recursive: true });
  writeFileSync(REPORT_PATH, report, "utf-8");

  console.log(`\n[NurseNest Audit] Report written to ${REPORT_PATH}`);
  console.log(`[NurseNest Audit] ${failCount === 0 ? "✅ All surfaces healthy" : `❌ ${failCount} failure(s) detected`}`);

  // Log failures
  const allRoutes = sections.flatMap((s) => s.routes);
  const failed = allRoutes.filter(
    (r) => r.error || (r.status != null && r.status >= 500) || (r.contentCheck && !r.contentCheck.found),
  );
  for (const f of failed) {
    console.error(`  [FAIL] ${f.label}: ${f.error ?? `HTTP ${f.status}`}`);
    if (FAIL_FAST) {
      process.exit(1);
    }
  }

  if (failCount > 0) process.exit(1);
}

main().catch((e) => {
  console.error("[NurseNest Audit] Fatal error:", e);
  process.exit(1);
});
