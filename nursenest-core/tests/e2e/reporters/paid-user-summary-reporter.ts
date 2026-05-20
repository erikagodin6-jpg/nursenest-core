/**
 * Aggregates failed paid-user E2E tests into `test-results/paid-user-suite-summary.{json,md}`.
 * **Tier 1 buckets** (single primary cause per failure): onboardingBlockingFlow, authFailure,
 * slowEndpointFailure, unknownFailure — see {@link tier1BucketForCategory}.
 *
 * **Primary cause** per test = {@link primaryFailureHeadline} — **first non-empty line only**.
 */
import * as fs from "fs";
import * as path from "path";
import type { FullResult, Reporter, TestCase, TestResult } from "@playwright/test/reporter";
import { classifyPaidFailureMessage, primaryFailureHeadline } from "../helpers/paid-failure-classifier";
import {
  emptyPaidTier1Summary,
  pushTier1ClassifiedEntry,
  type PaidTier1SuiteSummaryArtifact,
} from "../helpers/paid-suite-summary";

const PAID_USER_FILE_RE = /tests\/e2e\/paid-user\/paid-user-.*\.spec\.ts$/;

export default class PaidUserSummaryReporter implements Reporter {
  private summary: PaidTier1SuiteSummaryArtifact = emptyPaidTier1Summary();

  onTestEnd(test: TestCase, result: TestResult): void {
    if (result.status !== "failed" && result.status !== "timedOut") return;
    if (!PAID_USER_FILE_RE.test(test.location.file)) return;
    const err = result.error?.message ?? "(no message)";
    const classified = classifyPaidFailureMessage(err);

    pushTier1ClassifiedEntry(this.summary, {
      specFile: test.location.file,
      testTitle: test.titlePath().join(" › "),
      detailCategory: classified.category,
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
    const bucketKeys: (keyof Omit<PaidTier1SuiteSummaryArtifact, "generatedAt">)[] = [
      "onboardingBlockingFlow",
      "authFailure",
      "slowEndpointFailure",
      "unknownFailure",
    ];
    const bucketsOnly: Omit<PaidTier1SuiteSummaryArtifact, "generatedAt"> = {} as Omit<
      PaidTier1SuiteSummaryArtifact,
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
            "Each entry.reason is the FIRST LINE ONLY of the failure — Tier 1 deploy-blocker headline. detailCategory is granular triage; bucket is Tier 1 rollup.",
          buckets: bucketsOnly,
        },
        null,
        2,
      ),
      "utf8",
    );

    const lines: string[] = [
      "# Paid-user E2E — Tier 1 classified failures",
      "",
      `Generated: ${this.summary.generatedAt}`,
      `Overall run status: **${result.status}**`,
      `Classified failure entries: **${totalFailed}**`,
      "",
      "**Primary cause** for each item is `reason` — **first line only** of the error.",
      "",
    ];

    const sections: Array<[string, keyof PaidTier1SuiteSummaryArtifact]> = [
      ["Onboarding blocking flow (`onboardingBlockingFlow`)", "onboardingBlockingFlow"],
      ["Auth / session — blocking (`authFailure`)", "authFailure"],
      ["Slow core API — blocking (`slowEndpointFailure`)", "slowEndpointFailure"],
      ["Other / rollup (`unknownFailure`)", "unknownFailure"],
    ];

    for (const [title, key] of sections) {
      const items = this.summary[key] as Array<{
        specFile: string;
        testTitle: string;
        reason: string;
        detailCategory?: string;
      }>;
      if (!Array.isArray(items) || items.length === 0) continue;
      lines.push(`## ${title}`, "");
      for (const it of items) {
        lines.push(`- **${it.testTitle.replace(/\|/g, "\\|")}**`);
        lines.push(`  - File: \`${it.specFile}\``);
        if (it.detailCategory) {
          lines.push(`  - Detail category: \`${it.detailCategory}\``);
        }
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
