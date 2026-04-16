import type { Page, TestInfo } from "@playwright/test";
import type { PageObservers } from "./attach-observers";

/** Attach JSON diagnostics (final URL, console, network) — call from `catch` before rethrowing. */
export async function attachSmokeProductionFailure(
  testInfo: TestInfo,
  page: Page,
  observers: PageObservers,
  label: string,
): Promise<void> {
  await testInfo.attach(`${label}-failure-diagnostics.json`, {
    body: Buffer.from(
      JSON.stringify(
        {
          finalUrl: page.url(),
          consoleErrors: observers.consoleErrors,
          consoleErrorContext: observers.consoleErrorContext ?? [],
          failedRequests: observers.failedRequests,
        },
        null,
        2,
      ),
      "utf-8",
    ),
    contentType: "application/json",
  });
}
