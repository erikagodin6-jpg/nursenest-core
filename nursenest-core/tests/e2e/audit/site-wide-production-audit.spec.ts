/**
 * Site-wide production audit — collects PASS / FAIL / DEGRADED / BLOCKED with evidence.
 * Does not modify application code. Writes:
 *   - test-results/site-wide-production-audit-report.md
 *   - test-results/site-wide-production-audit-report.json
 *
 * @see playwright.site-wide-audit.config.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { expect, test, type Page, type TestInfo } from "@playwright/test";
import { dismissMarketingScrims } from "../helpers/marketing-navigation-audit";
import {
  getAdminE2eCredentials,
  getQaFreeCredentials,
  getQaPaidCredentials,
  hasAdminE2eCredentials,
} from "../helpers/smoke-credentials";
import {
  attachPageEvidence,
  scanBodyForPlaceholders,
  screenshotFailure,
  type AuditStatus,
  type RouteAuditRow,
} from "./site-wide-audit-evidence";

const AUDIT_ROWS: RouteAuditRow[] = [];

function originFromEnv(): string {
  const raw = (process.env.BASE_URL ?? "https://www.nursenest.ca").replace(/\/$/, "");
  return new URL(raw).origin;
}

const ORIGIN = originFromEnv();

/** Prevents ExamSelector full-page scrim from blocking marketing clicks (matches homepage-first-paint). */
const SELECTOR_DISMISSED_LS = "nn_selector_dismissed";

test.beforeEach(async ({ context }) => {
  await context.addInitScript((key: string) => {
    try {
      localStorage.setItem(key, "1");
    } catch {
      /* ignore */
    }
  }, SELECTOR_DISMISSED_LS);
});

function record(row: RouteAuditRow) {
  AUDIT_ROWS.push(row);
}

async function auditStaticPage(
  page: Page,
  testInfo: TestInfo,
  phase: string,
  pathname: string,
  opts: { requireMarketingHeader?: boolean; minBodyChars?: number } = {},
): Promise<RouteAuditRow> {
  const requireMarketingHeader = opts.requireMarketingHeader ?? true;
  const minBodyChars = opts.minBodyChars ?? 200;
  const ev = attachPageEvidence(page, ORIGIN);
  const artifactPaths: string[] = [];
  let status: AuditStatus = "PASS";
  let summary = "OK";
  let assertion: string | undefined;
  const url = `${ORIGIN}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;

  try {
    const resp = await page.goto(pathname, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await page.waitForLoadState("networkidle", { timeout: 35_000 }).catch(() => {});
    const finalUrl = page.url();
    if (resp && resp.status() >= 500) {
      status = "FAIL";
      summary = `HTTP ${resp.status()} from navigation`;
      assertion = `response.status === ${resp.status()}`;
      artifactPaths.push(await screenshotFailure(page, testInfo, pathname));
    }
    const body = (await page.locator("body").innerText().catch(() => "")) ?? "";
    if (body.length < minBodyChars) {
      status = status === "PASS" ? "DEGRADED" : status;
      summary = `Very little visible text (${body.length} chars)`;
    }
    const bad = scanBodyForPlaceholders(body);
    if (bad) {
      status = "FAIL";
      summary = bad;
      assertion = bad;
      artifactPaths.push(await screenshotFailure(page, testInfo, pathname));
    }
    if (requireMarketingHeader) {
      const h = await page.locator("header.nn-header-animate-in").count();
      if (h === 0) {
        status = status === "PASS" ? "DEGRADED" : status;
        summary = "No header.nn-header-animate-in (may be auth-only shell)";
      } else if (h > 1) {
        status = "FAIL";
        summary = `Duplicate marketing headers (${h})`;
        assertion = "header.nn-header-animate-in count <= 1";
        artifactPaths.push(await screenshotFailure(page, testInfo, pathname));
      }
    }
    const footers = await page.locator("footer").count();
    if (footers > 1) {
      status = "FAIL";
      summary = `Multiple <footer> nodes (${footers})`;
      assertion = "footer count === 1";
    }
    if (ev.consoleErrors.length > 8) {
      status = status === "PASS" ? "DEGRADED" : status;
      summary = `Many console errors (${ev.consoleErrors.length})`;
    }
    if (ev.networkFailures.length > 6) {
      status = status === "PASS" ? "DEGRADED" : status;
      summary = `Many same-origin HTTP errors (${ev.networkFailures.length})`;
    }
    return {
      phase,
      url: finalUrl,
      status,
      summary,
      assertion,
      consoleErrors: [...ev.consoleErrors],
      networkFailures: [...ev.networkFailures],
      artifactPaths,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    artifactPaths.push(await screenshotFailure(page, testInfo, pathname));
    return {
      phase,
      url,
      status: "FAIL",
      summary: msg,
      assertion: "navigation / load",
      consoleErrors: [...ev.consoleErrors],
      networkFailures: [...ev.networkFailures],
      artifactPaths,
    };
  } finally {
    ev.detach();
  }
}

function writeReports() {
  const outDir = path.join(process.cwd(), "test-results");
  mkdirSync(outDir, { recursive: true });
  const jsonPath = path.join(outDir, "site-wide-production-audit-report.json");
  const mdPath = path.join(outDir, "site-wide-production-audit-report.md");
  writeFileSync(jsonPath, JSON.stringify(AUDIT_ROWS, null, 2), "utf8");

  const pass = AUDIT_ROWS.filter((r) => r.status === "PASS").length;
  const fail = AUDIT_ROWS.filter((r) => r.status === "FAIL").length;
  const deg = AUDIT_ROWS.filter((r) => r.status === "DEGRADED").length;
  const blocked = AUDIT_ROWS.filter((r) => r.status === "BLOCKED").length;

  const critical = AUDIT_ROWS.filter(
    (r) =>
      r.status === "FAIL" &&
      (r.url.includes("/login") || r.url.endsWith(ORIGIN + "/") || r.url === `${ORIGIN}/` || r.phase.startsWith("P3")),
  );

  const lines: string[] = [
    "# Site-wide production audit report",
    "",
    `**Origin:** ${ORIGIN}`,
    `**Generated:** ${new Date().toISOString()}`,
    "",
    "## A. Executive summary",
    `- Total checks: ${AUDIT_ROWS.length}`,
    `- PASS: ${pass}`,
    `- FAIL: ${fail}`,
    `- DEGRADED: ${deg}`,
    `- BLOCKED: ${blocked}`,
    "",
    "## B. Critical failures",
    ...(critical.length
      ? critical.map((r) => `- **${r.status}** ${r.url} — ${r.summary}${r.assertion ? ` (${r.assertion})` : ""}`)
      : ["- (none in this run)"]),
    "",
    "## C–E. Grouped notes",
    "See JSON for full console/network arrays. Failures with duplicate chrome or placeholder substrings cluster as **layout/i18n**.",
    "",
    "## F. Route-by-route",
    "",
    "| Phase | URL | Status | Summary | Artifacts |",
    "|---|---|---|---|---|",
    ...AUDIT_ROWS.map((r) => {
      const art = r.artifactPaths.map((p) => path.basename(p)).join("; ") || "—";
      const esc = (s: string) => String(s).replace(/\|/g, "\\|").replace(/\n/g, " ");
      return `| ${esc(r.phase)} | ${esc(r.url)} | ${r.status} | ${esc(r.summary)} | ${esc(art)} |`;
    }),
    "",
    "## G. Recommended fix order",
    "1. System: static asset / CDN HTML-for-JS (network 5xx, chunk errors).",
    "2. Auth/admin gates and redirect loops.",
    "3. Learner paywall / session.",
    "4. Marketing placeholder / duplicate shell.",
    "5. Polish / DEGRADED console noise.",
    "",
  ];
  writeFileSync(mdPath, lines.join("\n"), "utf8");
}

test.describe.configure({ mode: "serial" });

test.afterAll(() => {
  writeReports();
});

test.describe("Phase 1 — Global shell / public nav", () => {
  test("P1: homepage", async ({ page }, testInfo) => {
    const row = await auditStaticPage(page, testInfo, "P1-home", "/", {});
    record(row);
  });

  test("P1: nav durability (Pricing, Blog, FAQ)", async ({ page }, testInfo) => {
    /** Direct GET avoids scrims/overlays intercepting header clicks; link presence checked on `/`. */
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 90_000 });
    await dismissMarketingScrims(page);
    const checks: RouteAuditRow[] = [];
    for (const { name, path } of [
      { name: "Pricing", path: "/pricing" },
      { name: "Blog", path: "/blog" },
      { name: "FAQ", path: "/faq" },
    ]) {
      const link = page.getByRole("link", { name: new RegExp(`^${name}$`, "i") }).first();
      const vis = await link.isVisible().catch(() => false);
      if (!vis) {
        record({
          phase: "P1-nav",
          url: page.url(),
          status: "FAIL",
          summary: `Missing primary nav link on home: ${name}`,
          assertion: `getByRole('link', { name: /^${name}$/i })`,
          consoleErrors: [],
          networkFailures: [],
          artifactPaths: [await screenshotFailure(page, testInfo, `nav-${name}`)],
        });
      }
      const row = await auditStaticPage(page, testInfo, "P1-nav", path, { requireMarketingHeader: true });
      row.phase = `P1-nav→${name}`;
      checks.push(row);
      record(row);
    }
  });

  test("P1: Login + Start free links resolve", async ({ page }, testInfo) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissMarketingScrims(page);
    const login = page.getByRole("link", { name: /log in/i }).first();
    if (await login.isVisible().catch(() => false)) {
      await login.click();
      await page.waitForLoadState("domcontentloaded");
      const row = await auditStaticPage(page, testInfo, "P1-login-link", "/login", { requireMarketingHeader: true });
      record({ ...row, phase: "P1-login-nav" });
    } else {
      record({
        phase: "P1-login-nav",
        url: page.url(),
        status: "DEGRADED",
        summary: "Log in link not found with role/name pattern",
        consoleErrors: [],
        networkFailures: [],
        artifactPaths: [],
      });
    }
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissMarketingScrims(page);
    const signup = page.getByRole("link", { name: /sign up|start free/i }).first();
    if (await signup.isVisible().catch(() => false)) {
      await signup.click();
      await page.waitForLoadState("domcontentloaded");
      const row = await auditStaticPage(page, testInfo, "P1-signup", page.url().replace(ORIGIN, "") || "/", {
        requireMarketingHeader: true,
        minBodyChars: 80,
      });
      record({ ...row, phase: "P1-signup-nav" });
    }
  });
});

test.describe("Phase 2 — Marketing surfaces", () => {
  const paths = [
    "/pricing",
    "/login",
    "/signup",
    "/blog",
    "/faq",
    "/lessons",
    "/canada",
    "/us",
    "/philippines",
    "/canada/rn/nclex-rn",
    "/canada/pn",
    "/canada/np",
    "/allied",
  ];
  for (const p of paths) {
    test(`P2: ${p}`, async ({ page }, testInfo) => {
      const row = await auditStaticPage(page, testInfo, "P2-marketing", p, { requireMarketingHeader: !p.startsWith("/app") });
      record(row);
    });
  }
});

test.describe("Phase 3 — Auth surfaces", () => {
  test("P3: forgot password page", async ({ page }, testInfo) => {
    const row = await auditStaticPage(page, testInfo, "P3-auth", "/forgot-password", { requireMarketingHeader: true });
    record(row);
  });

  test("P3: invalid login shows error (no redirect loop)", async ({ page }, testInfo) => {
    const ev = attachPageEvidence(page, ORIGIN);
    try {
      await page.goto("/login", { waitUntil: "domcontentloaded", timeout: 60_000 });
      const id = page.locator("#login-identifier");
      const pw = page.locator("#login-password");
      if (!(await id.count()) || !(await pw.count())) {
        record({
          phase: "P3-login-form",
          url: page.url(),
          status: "DEGRADED",
          summary: "Login form selectors #login-identifier / #login-password not found",
          consoleErrors: [...ev.consoleErrors],
          networkFailures: [...ev.networkFailures],
          artifactPaths: [await screenshotFailure(page, testInfo, "login-form")],
        });
        return;
      }
      await id.fill("audit-invalid@nursenest.invalid");
      await pw.fill("wrong-password-audit");
      await page.getByRole("button", { name: /sign in/i }).click();
      await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
      const stillLogin = page.url().includes("/login");
      const errVisible = await page.getByText(/invalid|incorrect|wrong/i).first().isVisible().catch(() => false);
      record({
        phase: "P3-invalid-login",
        url: page.url(),
        status: stillLogin && errVisible ? "PASS" : stillLogin ? "DEGRADED" : "FAIL",
        summary: stillLogin ? (errVisible ? "Stayed on login with error copy" : "Stayed on login without obvious error text") : "Redirected away from /login after bad creds",
        consoleErrors: [...ev.consoleErrors],
        networkFailures: [...ev.networkFailures],
        artifactPaths: [],
      });
    } finally {
      ev.detach();
    }
  });

  test("P3: successful login (paid creds)", async ({ page }, testInfo) => {
    const paid = getQaPaidCredentials();
    if (!paid) {
      record({
        phase: "P3-login-paid",
        url: `${ORIGIN}/login`,
        status: "BLOCKED",
        summary: "No QA_PAID_* / E2E_PAID_* / PLAYWRIGHT_TEST_* credentials in env",
        consoleErrors: [],
        networkFailures: [],
        artifactPaths: [],
      });
      return;
    }
    const ev = attachPageEvidence(page, ORIGIN);
    try {
      await page.goto("/login", { waitUntil: "domcontentloaded" });
      await page.locator("#login-identifier").fill(paid.email);
      await page.locator("#login-password").fill(paid.password);
      await page.getByRole("button", { name: /sign in/i }).click();
      await page.waitForURL(/\/app|\/$|\/canada|\/us/, { timeout: 90_000 }).catch(() => {});
      const u = page.url();
      const ok = !u.includes("/login");
      record({
        phase: "P3-login-paid",
        url: u,
        status: ok ? "PASS" : "FAIL",
        summary: ok ? "Left login after submit" : "Still on login after submit",
        consoleErrors: [...ev.consoleErrors],
        networkFailures: [...ev.networkFailures],
        artifactPaths: ok ? [] : [await screenshotFailure(page, testInfo, "paid-login-fail")],
      });
    } finally {
      ev.detach();
    }
  });
});

test.describe("Phase 4 — Learner (credential-gated)", () => {
  test("P4: /app dashboard (paid)", async ({ page }, testInfo) => {
    const paid = getQaPaidCredentials();
    if (!paid) {
      record({
        phase: "P4-app",
        url: `${ORIGIN}/app`,
        status: "BLOCKED",
        summary: "Paid credentials missing — skipped learner shell audit",
        consoleErrors: [],
        networkFailures: [],
        artifactPaths: [],
      });
      return;
    }
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await page.locator("#login-identifier").fill(paid.email);
    await page.locator("#login-password").fill(paid.password);
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL(/\/app/, { timeout: 90_000 }).catch(() => {});
    const row = await auditStaticPage(page, testInfo, "P4-learner", "/app", { requireMarketingHeader: false, minBodyChars: 80 });
    row.phase = "P4-app";
    record(row);
  });

  test("P4: lessons hub + sample lesson links", async ({ page }, testInfo) => {
    const paid = getQaPaidCredentials();
    if (!paid) {
      record({
        phase: "P4-lessons",
        url: `${ORIGIN}/app/lessons`,
        status: "BLOCKED",
        summary: "Paid credentials missing",
        consoleErrors: [],
        networkFailures: [],
        artifactPaths: [],
      });
      return;
    }
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await page.locator("#login-identifier").fill(paid.email);
    await page.locator("#login-password").fill(paid.password);
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL(/\/app/, { timeout: 90_000 }).catch(() => {});
    await page.goto("/app/lessons", { waitUntil: "domcontentloaded", timeout: 60_000 });
    const hrefs = await page
      .locator('a[href*="/app/lessons/"]')
      .evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).href).slice(0, 10));
    let opened = 0;
    for (const href of hrefs.slice(0, 5)) {
      const ev = attachPageEvidence(page, ORIGIN);
      try {
        await page.goto(href, { waitUntil: "domcontentloaded", timeout: 45_000 });
        const body = await page.locator("body").innerText();
        const st = scanBodyForPlaceholders(body) ? "FAIL" : body.length > 400 ? "PASS" : "DEGRADED";
        record({
          phase: "P4-lesson-detail",
          url: href,
          status: st as AuditStatus,
          summary: st === "PASS" ? "Substantive body" : st === "DEGRADED" ? "Thin body" : "Placeholder hit",
          consoleErrors: [...ev.consoleErrors],
          networkFailures: [...ev.networkFailures],
          artifactPaths: [],
        });
        opened++;
      } catch (e) {
        record({
          phase: "P4-lesson-detail",
          url: href,
          status: "FAIL",
          summary: e instanceof Error ? e.message : String(e),
          consoleErrors: [...ev.consoleErrors],
          networkFailures: [...ev.networkFailures],
          artifactPaths: [await screenshotFailure(page, testInfo, "lesson")],
        });
      } finally {
        ev.detach();
      }
    }
    if (opened === 0) {
      record({
        phase: "P4-lesson-detail",
        url: page.url(),
        status: "DEGRADED",
        summary: "No /app/lessons/* detail links discovered",
        consoleErrors: [],
        networkFailures: [],
        artifactPaths: [],
      });
    }
  });

  test("P4: question bank + flashcards entry", async ({ page }, testInfo) => {
    const paid = getQaPaidCredentials();
    if (!paid) {
      record({ phase: "P4-bank", url: ORIGIN, status: "BLOCKED", summary: "No paid creds", consoleErrors: [], networkFailures: [], artifactPaths: [] });
      return;
    }
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await page.locator("#login-identifier").fill(paid.email);
    await page.locator("#login-password").fill(paid.password);
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL(/\/app/, { timeout: 90_000 }).catch(() => {});
    for (const p of ["/app/questions", "/app/flashcards"]) {
      const row = await auditStaticPage(page, testInfo, "P4-bank", p, { requireMarketingHeader: false, minBodyChars: 60 });
      record(row);
    }
  });

  test("P4: CAT entry", async ({ page }, testInfo) => {
    const paid = getQaPaidCredentials();
    if (!paid) {
      record({ phase: "P4-cat", url: ORIGIN, status: "BLOCKED", summary: "No paid creds", consoleErrors: [], networkFailures: [], artifactPaths: [] });
      return;
    }
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await page.locator("#login-identifier").fill(paid.email);
    await page.locator("#login-password").fill(paid.password);
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL(/\/app/, { timeout: 90_000 }).catch(() => {});
    const catPaths = ["/canada/rn/nclex-rn/cat", "/us/rn/nclex-rn/cat", "/app/practice-tests"];
    let row: RouteAuditRow | null = null;
    for (const p of catPaths) {
      const r = await auditStaticPage(page, testInfo, "P4-cat", p, { requireMarketingHeader: false, minBodyChars: 40 });
      if (r.status !== "FAIL" || !r.summary.includes("500")) {
        row = { ...r, phase: "P4-cat" };
        break;
      }
      row = r;
    }
    if (row) record(row);
  });
});

test.describe("Phase 5 — Admin access", () => {
  test("P5: guest /admin blocked", async ({ page }, testInfo) => {
    const ev = attachPageEvidence(page, ORIGIN);
    try {
      const resp = await page.goto("/admin", { waitUntil: "domcontentloaded" });
      const u = page.url();
      const blocked = u.includes("/login") || (resp && (resp.status() === 307 || resp.status() === 302));
      record({
        phase: "P5-admin-guest",
        url: u,
        status: blocked ? "PASS" : "FAIL",
        summary: blocked ? "Redirected or login for unauthenticated /admin" : "Did not redirect to login",
        consoleErrors: [...ev.consoleErrors],
        networkFailures: [...ev.networkFailures],
        artifactPaths: blocked ? [] : [await screenshotFailure(page, testInfo, "admin-guest")],
      });
    } finally {
      ev.detach();
    }
  });

  test("P5: admin dashboard (staff creds)", async ({ page }, testInfo) => {
    if (!hasAdminE2eCredentials()) {
      record({
        phase: "P5-admin-auth",
        url: `${ORIGIN}/admin`,
        status: "BLOCKED",
        summary: "E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set",
        consoleErrors: [],
        networkFailures: [],
        artifactPaths: [],
      });
      return;
    }
    const a = getAdminE2eCredentials()!;
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await page.locator("#login-identifier").fill(a.email);
    await page.locator("#login-password").fill(a.password);
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL(/\/app|\/admin/, { timeout: 120_000 }).catch(() => {});
    await page.goto("/admin", { waitUntil: "domcontentloaded", timeout: 60_000 });
    const body = await page.locator("body").innerText().catch(() => "");
    const ok = body.length > 100 && !scanBodyForPlaceholders(body);
    record({
      phase: "P5-admin-auth",
      url: page.url(),
      status: ok ? "PASS" : "DEGRADED",
      summary: ok ? "Admin area rendered text" : "Thin or placeholder admin body",
      consoleErrors: [],
      networkFailures: [],
      artifactPaths: ok ? [] : [await screenshotFailure(page, testInfo, "admin-body")],
    });
  });

  test("P5: free user must not reach admin UI", async ({ page }, testInfo) => {
    const free = getQaFreeCredentials();
    if (!free) {
      record({
        phase: "P5-admin-free",
        url: `${ORIGIN}/admin`,
        status: "BLOCKED",
        summary: "No free-tier QA credentials",
        consoleErrors: [],
        networkFailures: [],
        artifactPaths: [],
      });
      return;
    }
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await page.locator("#login-identifier").fill(free.email);
    await page.locator("#login-password").fill(free.password);
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL(/\/app/, { timeout: 90_000 }).catch(() => {});
    await page.goto("/admin", { waitUntil: "domcontentloaded" });
    const u = page.url();
    const blocked = u.includes("/login") || u.includes("callbackUrl");
    record({
      phase: "P5-admin-free",
      url: u,
      status: blocked ? "PASS" : "FAIL",
      summary: blocked ? "Free user blocked from admin" : "Free user may have reached admin surface",
      consoleErrors: [],
      networkFailures: [],
      artifactPaths: blocked ? [] : [await screenshotFailure(page, testInfo, "free-admin")],
    });
  });
});

test.describe("Phase 6 — Region / language smoke", () => {
  test("P6: Canada + US hub links from homepage", async ({ page }, testInfo) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissMarketingScrims(page);
    for (const label of ["Canada hub", "US hub"]) {
      const link = page.getByRole("link", { name: new RegExp(label.replace(" hub", ""), "i") }).first();
      if (await link.isVisible().catch(() => false)) {
        await link.click();
        await page.waitForLoadState("domcontentloaded");
        const row = await auditStaticPage(page, testInfo, "P6-region", page.url().replace(ORIGIN, "") || "/", {});
        row.phase = `P6-${label}`;
        record(row);
      }
    }
  });
});

test.describe("Phase 7 — Summary assertion", () => {
  test("Z: emit counts (always passes; see test-results report)", async () => {
    const fail = AUDIT_ROWS.filter((r) => r.status === "FAIL").length;
    // Keep green in CI for informational audit unless STRICT_AUDIT_FAIL=1
    if (process.env.STRICT_AUDIT_FAIL === "1") {
      expect(fail, `${fail} FAIL rows — see test-results/site-wide-production-audit-report.md`).toBe(0);
    }
  });
});
