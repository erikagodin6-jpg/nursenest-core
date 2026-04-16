import type { Page, TestInfo } from "@playwright/test";
import type { PageObservers } from "./attach-observers";

/**
 * Waits until the browser leaves any `*/login*` path (same heuristic as legacy smoke).
 * On timeout: attaches URL, alert text, body snippet, observers, screenshot — then throws a precise error.
 */
export async function waitForLoginToCompleteOrAttachFailure(
  page: Page,
  testInfo: TestInfo,
  observers: PageObservers,
  opts: { label: string; timeoutMs?: number },
): Promise<void> {
  const timeoutMs = opts.timeoutMs ?? 120_000;
  const start = Date.now();
  try {
    await page.waitForFunction(
      () => {
        const p = window.location.pathname;
        return !p.includes("/login");
      },
      null,
      { timeout: timeoutMs },
    );
  } catch {
    const finalUrl = page.url();
    const bodySnippet = (await page.locator("body").innerText().catch(() => "")).slice(0, 6000);
    const alertText = (await page.locator('[role="alert"]').innerText().catch(() => "")).trim();
    await testInfo.attach(`${opts.label}-login-stuck.json`, {
      body: Buffer.from(
        JSON.stringify(
          {
            finalUrl,
            alertText: alertText || null,
            bodySnippet: bodySnippet.slice(0, 4000),
            consoleErrors: observers.consoleErrors,
            consoleErrorContext: observers.consoleErrorContext ?? [],
            failedRequests: observers.failedRequests,
            authHttp: observers.authHttp ?? [],
            elapsedMs: Date.now() - start,
          },
          null,
          2,
        ),
        "utf-8",
      ),
      contentType: "application/json",
    });
    const shot = await page.screenshot({ fullPage: true }).catch(() => null);
    if (shot) {
      await testInfo.attach(`${opts.label}-login-stuck.png`, { body: shot, contentType: "image/png" });
    }
    throw new Error(
      [
        `Login did not leave a /login URL within ${timeoutMs}ms (final URL: ${finalUrl}).`,
        alertText ? `Visible [role=alert]: ${alertText.slice(0, 800)}` : "No visible [role=alert] (check body snippet in attachment).",
        "Verify credentials, staff role for admin, and that BASE_URL matches the app’s Auth.js issuer (AUTH_URL / NEXTAUTH_URL on the server).",
      ].join(" "),
    );
  }
}
