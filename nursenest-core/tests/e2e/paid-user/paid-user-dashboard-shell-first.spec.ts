/**
 * Dashboard shell-first: authenticated layout + route chrome render before heavy data finishes.
 *
 * Uses `storageState` from `setup-paid-auth` (paid subscriber) — no UI login in this file.
 *
 * ```
 * npx playwright test --project=chromium-paid tests/e2e/paid-user/paid-user-dashboard-shell-first.spec.ts
 * ```
 */
import { expect, test, type Page } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import { seriousConsoleLines } from "../helpers/paid-user-suite";

const SHELL_FIRST_MS = 2_000;

function attachShellFirstInstrumentation(page: Page, appOrigin: string) {
  const consoleLines: string[] = [];
  const pageErrors: string[] = [];
  const failedRequests: string[] = [];
  const http500: string[] = [];

  const onConsole = (msg: { type: () => string; text: () => string }) => {
    consoleLines.push(`[${msg.type()}] ${msg.text()}`);
  };
  const onPageError = (err: Error) => {
    pageErrors.push(err.stack ?? err.message);
  };
  const onRequestFailed = (req: import("@playwright/test").Request) => {
    const fail = req.failure();
    if (fail?.errorText === "net::ERR_ABORTED") return;
    failedRequests.push(`${fail?.errorText ?? "failed"} ${req.url()}`);
  };
  const onResponse = (res: import("@playwright/test").Response) => {
    let u: URL;
    try {
      u = new URL(res.url());
    } catch {
      return;
    }
    if (u.origin !== appOrigin) return;
    if (res.status() === 500) http500.push(`${res.status()} ${res.url()}`);
  };

  page.on("console", onConsole);
  page.on("pageerror", onPageError);
  page.on("requestfailed", onRequestFailed);
  page.on("response", onResponse);

  return {
    consoleLines,
    pageErrors,
    failedRequests,
    http500,
    dispose: () => {
      page.off("console", onConsole);
      page.off("pageerror", onPageError);
      page.off("requestfailed", onRequestFailed);
      page.off("response", onResponse);
    },
  };
}

test.describe("Paid user — dashboard shell-first", () => {
  test("shell + Dashboard label in 2s; then network idle + no errors / 500s", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(120_000);
    const appOrigin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;

    const instrumentation = attachShellFirstInstrumentation(page, appOrigin);
    const observers = attachPageObservers(page, { profile: "app", captureConsoleContext: true });

    try {
      await page.goto("/app", { waitUntil: "domcontentloaded" });

      const shell = page.getByTestId("learner-shell");
      await expect(shell).toBeVisible({ timeout: SHELL_FIRST_MS });

      /** Breadcrumb current-page label is always the English section title "Dashboard" on /app (see `appShellBreadcrumbs("dashboard")`). */
      const dashboardLabel = page
        .locator('[data-testid="learner-shell"] #nn-learner-main')
        .getByText("Dashboard", { exact: true });
      await expect(dashboardLabel.first()).toBeVisible({ timeout: SHELL_FIRST_MS });

      /** Primary page title (h1) — may be "Dashboard" or "…'s Study Hub" depending on display name. */
      const primaryHeading = page.locator("#nn-learner-main").getByRole("heading", { level: 1 }).first();
      await expect(primaryHeading).toBeVisible({ timeout: SHELL_FIRST_MS });

      await page.waitForLoadState("networkidle");

      expect(instrumentation.pageErrors, instrumentation.pageErrors.join("\n---\n")).toEqual([]);
      expect(instrumentation.http500, instrumentation.http500.join("\n")).toEqual([]);

      const serious = seriousConsoleLines(observers.consoleErrors);
      expect(serious, serious.slice(0, 8).join("\n")).toEqual([]);
      expect(observers.failedRequests, observers.failedRequests.slice(0, 8).join("\n")).toEqual([]);

      await testInfo.attach("console-log.txt", {
        body: instrumentation.consoleLines.join("\n"),
        contentType: "text/plain",
      });
      await testInfo.attach("console-errors-filtered.txt", {
        body: observers.consoleErrors.join("\n") || "(none)",
        contentType: "text/plain",
      });
      if (observers.consoleErrorContext && observers.consoleErrorContext.length > 0) {
        await testInfo.attach("console-error-context.json", {
          body: JSON.stringify(observers.consoleErrorContext, null, 2),
          contentType: "application/json",
        });
      }
      const failedNetBody = [
        "--- requestfailed (non-aborted) ---",
        ...instrumentation.failedRequests,
        "---",
        "--- HTTP 500 (same-origin) ---",
        ...instrumentation.http500,
      ].join("\n");
      await testInfo.attach("failed-network-requests.txt", { body: failedNetBody, contentType: "text/plain" });
    } finally {
      instrumentation.dispose();
      observers.dispose();
    }
  });
});
