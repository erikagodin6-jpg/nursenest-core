/**
 * Aggregates **failed** paid-user E2E tests into `test-results/paid-user-suite-summary.{json,md}`.
 * Uses {@link classifyPaidFailureMessage} for category buckets (auth, onboarding, entitlements, etc.).
 *
 * Registered in `playwright.config.ts` alongside the `list` reporter.
 */
import * as fs from "fs";
import * as path from "path";
import type { FullResult, Reporter, Suite, TestCase, TestResult } from "@playwright/test/reporter";
import { classifyPaidFailureMessage } from "../helpers/paid-failure-classifier";
import {
  emptyPaidSuiteSummary,
  pushClassifiedEntry,
  type PaidSuiteSummaryArtifact,
} from "../helpers/paid-suite-summary";

const PAID_USER_FILE_RE = /tests\/e2e\/paid-user\/paid-user-.*\.spec\.ts$/;

function projectName(test: TestCase): string {
  let s: Suite | undefined = test.parent;
  while (s) {
    const p = s.project();
    if (p?.name) return p.name;
    s = s.parent;
  }
  return "";
}

export default class PaidUserSummaryReporter implements Reporter {
  private summary: PaidSuiteSummaryArtifact = emptyPaidSuiteSummary();

  onTestEnd(test: TestCase, result: TestResult): void {
    if (result.status !== "failed" && result.status !== "timedOut") return;
    if (!PAID_USER_FILE_RE.test(test.location.file)) return;
    const err = result.error?.message ?? "(no message)";
    const classified = classifyPaidFailureMessage(err, result.error?.stack?.split("\n")[0]);

    pushClassifiedEntry(this.summary, {
      specFile: test.location.file,
      testTitle: test.titlePath().join(" › "),
      category: classified.category,
      route: classified.route,
      endpoint: classified.endpoint,
      reason: classified.reason,
    });
  }

  onEnd(result: FullResult): void {
    const outDir = path.join(process.cwd(), "test-results");
    fs.mkdirSync(outDir, { recursive: true });

    this.summary.generatedAt = new Date().toISOString();

    const jsonPath = path.join(outDir, "paid-user-suite-summary.json");
    const bucketKeys: (keyof Omit<PaidSuiteSummaryArtifact, "generatedAt">)[] = [
      "failedRoutes",
      "onboardingRedirects",
      "authFailures",
      "entitlementFailures",
      "slowEndpoints",
      "networkFailures",
      "missingTranslations",
      "consoleRuntimeErrors",
      "selectorOrRouteDrift",
      "nonBlockingAuthNoise",
      "contentDiscovery",
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
      "See buckets below. Fix auth/onboarding first, then entitlements, then selectors.",
      "",
    ];

    const buckets: Array<[string, keyof typeof this.summary]> = [
      ["Auth failures", "authFailures"],
      ["Onboarding redirects", "onboardingRedirects"],
      ["Entitlement / paywall", "entitlementFailures"],
      ["Content discovery (empty catalog)", "contentDiscovery"],
      ["Network / API", "networkFailures"],
      ["Slow endpoints", "slowEndpoints"],
      ["Missing translations", "missingTranslations"],
      ["Console / runtime", "consoleRuntimeErrors"],
      ["Selector / route drift", "selectorOrRouteDrift"],
      ["Non-blocking auth noise", "nonBlockingAuthNoise"],
      ["Unknown", "unknown"],
    ];

    for (const [title, key] of buckets) {
      const items = this.summary[key] as Array<{ specFile: string; testTitle: string; reason: string }>;
      if (!Array.isArray(items) || items.length === 0) continue;
      lines.push(`## ${title}`, "");
      for (const it of items) {
        lines.push(`- **${it.testTitle.replace(/\|/g, "\\|")}**`);
        lines.push(`  - File: \`${it.specFile}\``);
        lines.push(`  - ${it.reason.replace(/\n/g, " ").slice(0, 500)}`);
        lines.push("");
      }
    }

    if (totalFailed === 0) {
      lines.push("_No paid-user spec failures classified in this run._", "");
    }

    fs.writeFileSync(path.join(outDir, "paid-user-suite-summary.md"), lines.join("\n"), "utf8");
  }
}
