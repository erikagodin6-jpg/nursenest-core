/**
 * **Manual / CI diagnostic** — admin dashboard health (login → /admin).
 *
 * Env (see `playwright.env.ts` + `.env.playwright.local`):
 * - `E2E_ADMIN_EMAIL`
 * - `E2E_ADMIN_PASSWORD`
 * - `BASE_URL` (Playwright `baseURL`; defaults in config to http://127.0.0.1:3000)
 *
 * ```
 * npx playwright test tests/e2e/admin/admin-dashboard-diagnostic.spec.ts --project=chromium
 * ```
 *
 * Does **not** use saved `storageState`; performs a fresh credentials login each run.
 */
import { test, type Page } from "@playwright/test";
import { attachPageObservers, type PageObservers } from "../helpers/attach-observers";

const LOGIN_TIMEOUT_MS = 120_000;
const NAV_TIMEOUT_MS = 60_000;

type ApiHit = { url: string; status: number; method: string };

function attachResponseTap(page: Page, baseOrigin: string, out: ApiHit[], errorStatuses: ApiHit[]) {
  const onResponse = (response: import("@playwright/test").Response) => {
    const req = response.request();
    const rt = req.resourceType();
    if (rt !== "xhr" && rt !== "fetch" && rt !== "document") return;
    let u: URL;
    try {
      u = new URL(response.url());
    } catch {
      return;
    }
    if (u.origin !== baseOrigin) return;
    const status = response.status();
    const row: ApiHit = { url: response.url(), status, method: req.method() };
    out.push(row);
    if (status >= 400 || status === 0) errorStatuses.push(row);
  };
  page.on("response", onResponse);
  return () => page.off("response", onResponse);
}

async function screenshotAttach(page: Page, testInfo: import("@playwright/test").TestInfo, name: string) {
  const buf = await page.screenshot({ fullPage: true }).catch(() => null);
  if (buf) {
    await testInfo.attach(name, { body: buf, contentType: "image/png" });
  }
}

test.describe("Admin — dashboard diagnostic", () => {
  test("login, /admin, network + console + headings + clicks", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(180_000);

    const email = process.env.E2E_ADMIN_EMAIL?.trim();
    const password = process.env.E2E_ADMIN_PASSWORD?.trim();
    if (!email || !password) {
      test.skip(true, "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD (and BASE_URL if not default).");
      return;
    }

    const origin = (() => {
      try {
        return new URL(baseURL ?? "http://127.0.0.1:3000").origin;
      } catch {
        return "http://127.0.0.1:3000";
      }
    })();

    const apiHits: ApiHit[] = [];
    const apiErrors: ApiHit[] = [];
    const detachResponse = attachResponseTap(page, origin, apiHits, apiErrors);

    const observers: PageObservers = attachPageObservers(page, {
      profile: "app",
      captureConsoleContext: true,
      probeAuthApi: true,
    });

    try {
      await page.goto("/login", { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
      await page.locator("#login-identifier").fill(email);
      await page.locator("#login-password").fill(password);
      await page.getByRole("button", { name: /^Sign In$/i }).click();

      await page
        .waitForFunction(() => !window.location.pathname.includes("/login"), undefined, {
          timeout: LOGIN_TIMEOUT_MS,
        })
        .catch(() => {});

      const finalUrlAfterLogin = page.url();
      let pathnameAfterLogin = "";
      try {
        pathnameAfterLogin = new URL(finalUrlAfterLogin).pathname;
      } catch {
        pathnameAfterLogin = "";
      }
      const windowPathAfterLogin = await page.evaluate(() => window.location.pathname).catch(() => "");

      await screenshotAttach(page, testInfo, "01-after-login.png");

      await page.goto(`${origin}/admin`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
      await page.waitForLoadState("networkidle", { timeout: 45_000 }).catch(() => {});

      await screenshotAttach(page, testInfo, "02-admin-dashboard.png");

      const adminUrl = page.url();
      const adminPath = await page.evaluate(() => window.location.pathname).catch(() => "");

      const headings = await page
        .locator("h1, h2")
        .allInnerTexts()
        .then((xs) => xs.map((t) => t.trim()).filter(Boolean))
        .catch(() => [] as string[]);

      const bodyLen = (await page.locator("body").innerText().catch(() => "")).length;
      const hasAdminHeading =
        (await page.getByRole("heading", { name: /Admin Dashboard/i }).count().catch(() => 0)) > 0;
      const adminDashboardLoads =
        adminPath.startsWith("/admin") && !adminPath.includes("/login") && hasAdminHeading && bodyLen > 200;

      /** Try a few safe nav links inside admin chrome (in-activity order). */
      const tryLinks = ["/admin/access", "/admin/users", "/admin/system-status"] as const;
      const clickResults: string[] = [];
      for (const href of tryLinks) {
        const link = page.locator(`a[href="${href}"]`).first();
        if ((await link.count()) === 0) {
          clickResults.push(`${href}: no link in DOM`);
          continue;
        }
        await link.click({ timeout: 15_000 }).catch((e) => {
          clickResults.push(`${href}: click failed ${e instanceof Error ? e.message : String(e)}`);
        });
        await page.waitForLoadState("domcontentloaded", { timeout: 20_000 }).catch(() => {});
        clickResults.push(`${href}: ok → ${page.url()}`);
        await page.goBack({ waitUntil: "domcontentloaded" }).catch(() => {});
      }

      /** One generic button probe (menu / UI) — skip if none. */
      const menuBtn = page.getByRole("button", { name: /^Menu$/i }).first();
      if (await menuBtn.isVisible().catch(() => false)) {
        await menuBtn.click().catch(() => {});
        clickResults.push("Menu (mobile nav): toggled");
      }

      await screenshotAttach(page, testInfo, "03-after-clicks.png");

      if (!adminDashboardLoads) {
        await screenshotAttach(page, testInfo, "04-failure-state.png");
      }

      const consoleErrors = observers.consoleErrors;
      const failedNetwork = observers.failedRequests;
      const authHttp = observers.authHttp ?? [];

      let rootCause = "unknown";
      if (finalUrlAfterLogin.includes("/login")) {
        rootCause =
          "still_on_login — credentials rejected, AUTH_URL mismatch, or sign-in did not complete (check server logs).";
      } else if (!adminPath.startsWith("/admin")) {
        rootCause = `post_login_redirect_away_from_admin — landed on ${adminPath} (expected /admin/* for staff).`;
      } else if (adminPath.includes("/login")) {
        rootCause = "admin_route_redirect_to_login — session not accepted for /admin (staff role / cookie).";
      } else if (!hasAdminHeading && bodyLen < 200) {
        rootCause = "admin_shell_empty_or_error — requireAdmin failed, RSC error, or blank document (see screenshots + console).";
      } else if (apiErrors.some((x) => x.url.includes("/api/admin"))) {
        rootCause = "admin_api_4xx_5xx — check failed API rows below (RBAC, handler error).";
      } else if (consoleErrors.some((c) => /requireAdmin|staff|Unauthorized|403/i.test(c))) {
        rootCause = "client_or_rsc_staff_gate — console suggests staff session / RBAC issue.";
      } else if (consoleErrors.length > 0) {
        rootCause = "console_errors_present — see console list (may include hydration or data fetch).";
      } else {
        rootCause = "no_single_obvious_failure — compare screenshots and API rows.";
      }

      const report = {
        finalUrlAfterLogin,
        pathnameAfterLogin,
        windowPathAfterLogin,
        adminUrlAfterGoto: adminUrl,
        adminPath,
        adminDashboardLoads,
        consoleErrors,
        failedNetworkRequests: failedNetwork,
        authSessionProbes: authHttp,
        apiErrorResponses: apiErrors.slice(-40),
        headingsSample: headings.slice(0, 25),
        bodyTextLength: bodyLen,
        clickProbe: clickResults,
        rootCause,
      };

      await testInfo.attach("admin-diagnostic-report.json", {
        body: Buffer.from(JSON.stringify(report, null, 2), "utf-8"),
        contentType: "application/json",
      });

      // Single copy-paste block for operators (requested “return only” fields).
      // eslint-disable-next-line no-console -- diagnostic output
      console.log(
        "\n--- ADMIN DIAGNOSTIC SUMMARY ---\n" +
          `final URL after login: ${finalUrlAfterLogin}\n` +
          `admin dashboard loads (heuristic): ${adminDashboardLoads}\n` +
          `console errors (${consoleErrors.length}):\n${consoleErrors.map((c) => `  - ${c}`).join("\n") || "  (none)"}\n` +
          `failed API / network (${failedNetwork.length}):\n${failedNetwork.map((f) => `  - ${f}`).join("\n") || "  (none)"}\n` +
          `API responses with status >= 400 (sample):\n${apiErrors
            .slice(-15)
            .map((a) => `  - ${a.status} ${a.method} ${a.url}`)
            .join("\n") || "  (none)"}\n` +
          `root cause (inferred): ${rootCause}\n` +
          "--- END ---\n",
      );
    } finally {
      detachResponse();
      observers.dispose();
    }
  });
});
