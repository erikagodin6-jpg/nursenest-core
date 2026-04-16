/**
 * Prints a structured **release blocker** summary on each failed test (stdout for CI logs).
 */
import type { FullResult, Reporter, TestCase, TestResult } from "@playwright/test/reporter";
import { classifyReleaseDeployFailure } from "../helpers/release-deploy-classifier";

/** Matches release-gate + post-deploy + emergency paid slice (see `playwright.release-gate.config.ts`). */
const RELEASE_FILES =
  /tests\/e2e\/(release\/.*\.spec\.ts|paid-user\/(paid-user-00-fast-sanity|paid-user-entitlements|paid-user-api-health|paid-user-cat-smoke)\.spec\.ts)$/;

export default class ReleaseBlockerConsoleReporter implements Reporter {
  onTestEnd(test: TestCase, result: TestResult): void {
    if (result.status !== "failed" && result.status !== "timedOut") return;
    if (!RELEASE_FILES.test(test.location.file)) return;

    const err = result.error?.message ?? "(no message)";
    const attachmentUrl = result.attachments?.find((a) => a.name === "last-url.txt")?.body;
    const pageUrl =
      attachmentUrl && typeof attachmentUrl === "string"
        ? attachmentUrl
        : result.attachments?.find((a) => a.name === "last-url.txt")?.path
          ? undefined
          : undefined;

    const { likelyClass, pathname, headline } = classifyReleaseDeployFailure(err, pageUrl);

    const lines = [
      "",
      "══════════════════════════════════════════════════════════════════",
      "RELEASE BLOCKER FAILED",
      `  test:     ${test.titlePath().join(" › ")}`,
      `  spec:     ${test.location.file}`,
      `  likelyClass: ${likelyClass}`,
      pathname ? `  pathname: ${pathname}` : "  pathname: (see error or attachments for URL)",
      `  detail:   ${headline}`,
      "══════════════════════════════════════════════════════════════════",
      "",
    ];
    // eslint-disable-next-line no-console
    console.error(lines.join("\n"));
  }

  onEnd(_result: FullResult): void {
    /* no-op */
  }
}
