/**
 * Aggregates failed paid-user E2E tests into `test-results/paid-user-suite-summary.{json,md}`.
 * **Primary cause** per test = short headline via {@link primaryFailureHeadline}.
 */
import * as fs from "fs";
import * as path from "path";
import type { FullResult, Reporter, TestCase, TestResult } from "@playwright/test/reporter";
import { classifyPaidFailureMessage, primaryFailureHeadline } from "../helpers/paid-failure-classifier";
import {
  emptyPaidSuiteSummary,
  pushClassifiedEntry,
  type PaidSuiteSummaryArtifact,
} from "../helpers/paid-suite-summary";

const PAID_USER_FILE_RE = /tests\/e2e\/paid-user\/paid-user-.*\.spec\.ts$/;

export default class PaidUserSummaryReporter implements Reporter {
  private summary: PaidSuiteSummaryArtifact = emptyPaidSuiteSummary();

  onTestEnd(test: TestCase, result: TestResult): void {
    if (result.status !== "failed" && result.status !== "timedOut") return;
    if (!PAID_USER_FILE_RE.test(test.location.file)) return;
    const err = result.error?.message ?? "(no message)";
    const classified = classifyPaidFailureMessage(err);

    pushClassifiedEntry(this.summary, {
      specFile: test.location.file,
      testTitle: test.titlePath().join(" › "),
      category: classified.category,
      route: classified.route,
      endpoint: classified.endpoint,
      reason: primaryFailureHeadline(err),
    });
  }

  onEnd(result: FullResult): void {
    const outDir = path.join(process.cwd(), "test-results");
    fs.mkdirSync(outDir, { recursive: true });

    this.summary.generatedAt = new Date().toISOString();

    const jsonPath = path.join(outDir, "paid-user-suite-summary.json");
    const bucketKeys: (keyof Omit<PaidSuiteSummaryArtifact, "generatedAt">)[] = [
      "authFailures",
      "onboardingBlockingFlows",
      "entitlementFailures",
      "contentDiscoveryFailures",
      "slowEndpointFailures",
      "networkFailures",
      "i18nCoreFailures",
      "selectorOrRouteDrift",
      "shellFailures",
      "authNoise",
      "unknown",
    ];
    const bucketsOnly: Omit<PaidSuiteSummaryArtifact, "generatedAt"> = {} as Omit<
      PaidSuiteSummaryArtifact,
      "generatedAt"
    >;
    let totalFailed = 0;
    for (const k of bucketKeys) {
      const arr = this.summary[k];
      bucketsOnly[k] = arr;
      totalFailed += arr.length;
    }

    fs.writeFileSync(
      jsonPath,
      JSON.stringify(
        {
          runStatus: result.status,
          generatedAt: this.summary.generatedAt,
          failureCount: totalFailed,
          primaryCauseNote:
            "Each entry.reason is the first line / headline of the failure — use it as the primary deploy-blocker cause.",
          buckets: bucketsOnly,
        },
        null,
        2,
      ),
      "utf8",
    );

    const lines: string[] = [
      "# Paid-user E2E — classified failures",
      "",
      `Generated: ${this.summary.generatedAt}`,
      `Overall run status: **${result.status}**`,
      `Classified failure entries: **${totalFailed}**`,
      "",
      "**Primary cause** for each item is the short `reason` line (first line of the error).",
      "",
    ];

    const sections: Array<[string, keyof PaidSuiteSummaryArtifact]> = [
      ["Auth / session (blocking)", "authFailures"],
      ["Onboarding blocking flow", "onboardingBlockingFlows"],
      ["Entitlement / paywall", "entitlementFailures"],
      ["Content discovery (catalog empty)", "contentDiscoveryFailures"],
      ["Slow endpoint (core API >6s)", "slowEndpointFailures"],
      ["Network / HTTP failures", "networkFailures"],
      ["i18n (core)", "i18nCoreFailures"],
      ["Selector / route drift", "selectorOrRouteDrift"],
      ["Shell / blank / stuck UI", "shellFailures"],
      ["Auth noise (non-blocking)", "authNoise"],
      ["Unknown", "unknown"],
    ];

    for (const [title, key] of sections) {
      const items = this.summary[key] as Array<{ specFile: string; testTitle: string; reason: string }>;
      if (!Array.isArray(items) || items.length === 0) continue;
      lines.push(`## ${title}`, "");
      for (const it of items) {
        lines.push(`- **${it.testTitle.replace(/\|/g, "\\|")}**`);
        lines.push(`  - File: \`${it.specFile}\``);
        lines.push(`  - **Primary cause:** ${it.reason.replace(/\n/g, " ").slice(0, 600)}`);
        lines.push("");
      }
    }

    if (totalFailed === 0) {
      lines.push("_No paid-user spec failures classified in this run._", "");
    }

    fs.writeFileSync(path.join(outDir, "paid-user-suite-summary.md"), lines.join("\n"), "utf8");
  }
}
