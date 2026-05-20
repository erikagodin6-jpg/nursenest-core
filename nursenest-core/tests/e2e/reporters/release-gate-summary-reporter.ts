/**
 * End-of-run summary for `playwright.release-gate.config.ts`: guest / paid / mobile rows,
 * credential-gated skips, failure artifact hints, and a JSON line for log grep.
 */
import * as fs from "fs";
import * as path from "path";
import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from "@playwright/test/reporter";
import { inferFailureClassificationFromSkipReason } from "../helpers/failure-classification-tags";

type Row = {
  project: string;
  spec: string;
  testTitle: string;
  status: TestResult["status"];
  skipReason?: string;
  inferredTag?: string;
  failureClassification?: string;
  attachments?: string[];
};

function projectTitle(test: TestCase): string {
  for (let p = test.parent; p; p = p.parent) {
    if (p.type === "project") return p.title;
  }
  return "(unknown-project)";
}

function bucketForProject(project: string): "guest" | "paid" | "mobile" | "health" | "other" {
  if (project === "release-phase-1-guest") return "guest";
  if (project === "release-mobile") return "mobile";
  if (project === "release-health") return "health";
  if (project === "release-blocking-paid" || project === "release-synthetic-paid-smoke") {
    return "paid";
  }
  return "other";
}

function collectArtifactPaths(result: TestResult): string[] {
  const out: string[] = [];
  for (const a of result.attachments ?? []) {
    if (a.path) out.push(path.resolve(a.path));
  }
  return [...new Set(out)];
}

export default class ReleaseGateSummaryReporter implements Reporter {
  private outputDir = "test-results";
  private rows: Row[] = [];

  onBegin(config: FullConfig, _suite: Suite): void {
    const rel = (config as { outputDir?: string }).outputDir ?? "test-results";
    this.outputDir = config.rootDir ? path.resolve(config.rootDir, rel) : path.resolve(rel);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const project = projectTitle(test);
    if (project === "setup-paid-auth") return;
    const fc = test.annotations.find((a) => a.type === "failure_classification")?.description;
    const skipReason =
      result.status === "skipped"
        ? (result.error?.message ?? test.annotations.find((a) => a.type === "skip")?.description ?? "(skipped)")
        : undefined;

    const titlePath = test.titlePath().filter((x) => x && String(x).trim().length > 0);
    const row: Row = {
      project,
      spec: test.location.file,
      testTitle: titlePath.join(" › "),
      status: result.status,
      ...(skipReason ? { skipReason } : {}),
      ...(skipReason ? { inferredTag: inferFailureClassificationFromSkipReason(skipReason) } : {}),
      ...(fc ? { failureClassification: fc } : {}),
    };

    if (result.status === "failed" || result.status === "timedOut") {
      row.attachments = collectArtifactPaths(result);
    }

    this.rows.push(row);
  }

  onEnd(result: FullResult): void {
    if (this.rows.length === 0) {
      return;
    }

    const byBucket = {
      health: [] as Row[],
      guest: [] as Row[],
      paid: [] as Row[],
      mobile: [] as Row[],
      other: [] as Row[],
    };

    for (const r of this.rows) {
      const b = bucketForProject(r.project);
      if (b === "health") byBucket.health.push(r);
      else if (b === "guest") byBucket.guest.push(r);
      else if (b === "paid") byBucket.paid.push(r);
      else if (b === "mobile") byBucket.mobile.push(r);
      else byBucket.other.push(r);
    }

    const credentialSkips = this.rows.filter(
      (x) =>
        x.status === "skipped" &&
        /Credential-gated|missing\s+E2E_PAID|missing\s+QA_PAID|PLAYWRIGHT_TEST_EMAIL|PLAYWRIGHT_TEST_PASSWORD|requires\s+env/i.test(
          x.skipReason ?? "",
        ),
    );
    const otherExplicitSkips = this.rows.filter(
      (x) => x.status === "skipped" && !credentialSkips.includes(x),
    );

    const failures = this.rows.filter((x) => x.status === "failed" || x.status === "timedOut");

    const summarize = (label: string, list: Row[]) => {
      const lines: string[] = [`## ${label}`];
      if (list.length === 0) {
        lines.push("(no tests in this bucket for this config)", "");
        return lines;
      }
      for (const x of list) {
        if (x.project === "setup-paid-auth") continue;
        lines.push(`- **${x.status.toUpperCase()}** ${x.spec}`);
        lines.push(`  - test: ${x.testTitle}`);
        if (x.skipReason) lines.push(`  - skip: ${x.skipReason.replace(/\n/g, " ").slice(0, 500)}`);
        if (x.failureClassification) lines.push(`  - failure_classification: ${x.failureClassification}`);
        if (x.attachments?.length) {
          lines.push(`  - artifacts:`);
          for (const p of x.attachments) lines.push(`    - ${p}`);
        }
      }
      lines.push("");
      return lines;
    };

    const mdLines = [
      "# Release gate — run summary",
      "",
      `Generated: ${new Date().toISOString()}`,
      `Playwright overall status: **${result.status}**`,
      "",
      "> Credential-gated skips are **explicit** and do **not** count as failures.",
      "",
      ...summarize("Health APIs (`release-health`)", byBucket.health),
      ...summarize("Guest / marketing entry (`release-phase-1-guest`)", byBucket.guest),
      ...summarize("Paid learner + synthetic (`release-blocking-paid`, `release-synthetic-paid-smoke`)", byBucket.paid),
      ...summarize("Mobile (`release-mobile`)", byBucket.mobile),
    ];

    if (byBucket.other.length) {
      mdLines.push(...summarize("Other projects", byBucket.other));
    }

    mdLines.push("## Credential-gated skips (explicit)", "");
    if (credentialSkips.length === 0) {
      mdLines.push("_None in this run._", "");
    } else {
      for (const x of credentialSkips) {
        mdLines.push(`- \`${x.spec}\` — ${x.testTitle}`);
        mdLines.push(`  - reason: ${(x.skipReason ?? "").replace(/\n/g, " ").slice(0, 600)}`);
        mdLines.push("");
      }
    }

    mdLines.push("## Other explicit skips (harness / empty pool — not failures)", "");
    if (otherExplicitSkips.length === 0) {
      mdLines.push("_None._", "");
    } else {
      for (const x of otherExplicitSkips) {
        mdLines.push(`- \`${x.spec}\` — ${x.testTitle}`);
        mdLines.push(`  - reason: ${(x.skipReason ?? "").replace(/\n/g, " ").slice(0, 600)}`);
        mdLines.push("");
      }
    }

    if (failures.length) {
      mdLines.push("## Failures — artifact paths", "");
      for (const x of failures) {
        mdLines.push(`- ${x.spec} :: ${x.testTitle}`);
        if (x.attachments?.length) {
          for (const p of x.attachments) mdLines.push(`  - ${p}`);
        } else {
          mdLines.push(`  - (no file attachments; see Playwright HTML report under test-results/)`);
        }
        mdLines.push("");
      }
      mdLines.push(
        `Default report dir: \`${path.join(this.outputDir, "..", "playwright-report")}\` (if HTML reporter enabled elsewhere).`,
        "",
      );
    }

    const outDir = this.outputDir;
    fs.mkdirSync(outDir, { recursive: true });
    const mdPath = path.join(outDir, "release-gate-summary.md");
    fs.writeFileSync(mdPath, mdLines.join("\n"), "utf8");

    const payload = {
      kind: "release_gate_summary",
      playwrightStatus: result.status,
      generatedAt: new Date().toISOString(),
      summaryPath: mdPath,
      buckets: {
        health: byBucket.health.filter((x) => x.project !== "setup-paid-auth").map((x) => ({ status: x.status, spec: x.spec, title: x.testTitle })),
        guest: byBucket.guest.map((x) => ({ status: x.status, spec: x.spec, title: x.testTitle })),
        paid: byBucket.paid.filter((x) => x.project !== "setup-paid-auth").map((x) => ({ status: x.status, spec: x.spec, title: x.testTitle, project: x.project })),
        mobile: byBucket.mobile.map((x) => ({ status: x.status, spec: x.spec, title: x.testTitle })),
      },
      credentialGatedSkips: credentialSkips.map((x) => ({
        spec: x.spec,
        title: x.testTitle,
        reason: x.skipReason ?? "",
        inferredTag: x.inferredTag,
      })),
      otherExplicitSkips: otherExplicitSkips.map((x) => ({
        spec: x.spec,
        title: x.testTitle,
        reason: x.skipReason ?? "",
      })),
      failures: failures.map((x) => ({
        spec: x.spec,
        title: x.testTitle,
        status: x.status,
        artifacts: x.attachments ?? [],
      })),
    };

    fs.writeFileSync(path.join(outDir, "release-gate-summary.json"), JSON.stringify(payload, null, 2), "utf8");
    // eslint-disable-next-line no-console
    console.log(`[release-gate-summary] ${JSON.stringify(payload)}`);
  }
}
