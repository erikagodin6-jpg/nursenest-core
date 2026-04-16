import type { Page, TestInfo } from "@playwright/test";
import type { PageObservers } from "./attach-observers";

/**
 * Waits until the browser leaves the sign-in page (pathname still includes "login" until then).
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
    const alertText = (await page.getByRole("alert").first().innerText().catch(() => "")).trim();
    const stuckJsonName = opts.label + "-login-stuck.json";
    await testInfo.attach(stuckJsonName, {
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
      await testInfo.attach(opts.label + "-login-stuck.png", { body: shot, contentType: "image/png" });
    }
    const msg1 =
      "Login did not leave the sign-in page within " +
      String(timeoutMs) +
      "ms (final URL: " +
      finalUrl +
      ").";
    const msg2 = alertText
      ? "Auth message: " + alertText.slice(0, 800)
      : "No visible alert (see body snippet in attachment).";
    const msg3 =
      "Verify credentials, staff role for admin, and that BASE_URL matches the Auth.js issuer (AUTH_URL and NEXTAUTH_URL on the server).";
    throw new Error([msg1, msg2, msg3].join(" "));
  }
}
