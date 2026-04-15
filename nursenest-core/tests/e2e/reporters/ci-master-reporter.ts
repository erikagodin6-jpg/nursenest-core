/**
 * Aggregates chromium-ci-master run into test-results/ci-master-summary.md (+ .json).
 * Pulls slow-endpoints / i18n attachments from individual specs when present.
 */
import * as fs from "fs";
import * as path from "path";
import type { FullResult, Reporter, Suite, TestCase, TestResult } from "@playwright/test/reporter";

const MASTER = "chromium-ci-master";

function projectName(test: TestCase): string {
  let s: Suite | undefined = test.parent;
  while (s) {
    const p = s.project();
    if (p?.name) return p.name;
    s = s.parent;
  }
  return "";
}

function readAttachmentBody(a: TestResult["attachments"][0]): string | null {
  try {
    if (a.body) return a.body.toString("utf8");
    if (a.path && fs.existsSync(a.path)) return fs.readFileSync(a.path, "utf8");
  } catch {
    /* ignore */
  }
  return null;
}

export default class CiMasterReporter implements Reporter {
  private readonly cases: Array<{
    title: string;
    file: string;
    status: TestResult["status"];
    error?: string;
  }> = [];

  private slowBlocks: string[] = [];
  private i18nBlocks: string[] = [];
  private consoleHints: string[] = [];

  onTestEnd(test: TestCase, result: TestResult): void {
    if (projectName(test) !== MASTER) return;

    const title = test.titlePath().join(" › ");
    this.cases.push({
      title,
      file: test.location.file,
      status: result.status,
      error: result.error?.message,
    });

    if (result.error?.message) {
      const m = result.error.message;
      if (/console|Console/i.test(m)) this.consoleHints.push(`${title}: ${m.slice(0, 400)}`);
      if (/network|fetch|failed request/i.test(m)) this.consoleHints.push(`${title}: ${m.slice(0, 400)}`);
    }

    for (const a of result.attachments) {
      const name = a.name ?? "";
      const body = readAttachmentBody(a);
      if (!body) continue;
      if (/slow-endpoints/i.test(name)) {
        this.slowBlocks.push(`### ${title}\n${body.trim()}`);
      }
      if (name === "ci-i18n-status.txt") {
        this.i18nBlocks.push(`### ${title}\n${body.trim()}`);
      }
    }
  }

  onEnd(result: FullResult): void {
    const outDir = path.join(process.cwd(), "test-results");
    fs.mkdirSync(outDir, { recursive: true });

    const failed = this.cases.filter((c) => c.status === "failed" || c.status === "timedOut");
    const lines: string[] = [
      "# CI master E2E summary",
      "",
      `Overall status: **${result.status}**`,
      "",
      "## Tests",
      "",
      "| Status | Test |",
      "| --- | --- |",
      ...this.cases.map((c) => `| ${c.status} | ${c.title.replace(/\|/g, "\\|")} |`),
      "",
    ];

    lines.push("## Failed routes / errors", "");
    if (failed.length === 0) {
      lines.push("_None (all master tests passed)._", "");
    } else {
      for (const f of failed) {
        lines.push(`- **${f.title}**`);
        lines.push(`  - File: \`${f.file}\``);
        if (f.error) {
          lines.push("  ```");
          lines.push(f.error.split("\n").slice(0, 40).join("\n"));
          lines.push("  ```");
        }
        lines.push("");
      }
    }

    lines.push("## Slow endpoints (from API monitoring spec attachments)", "");
    if (this.slowBlocks.length === 0) {
      lines.push("_No slow-endpoints attachments (or none over threshold)._", "");
    } else {
      lines.push(...this.slowBlocks.flatMap((b) => ["", b, ""]));
    }

    lines.push("## Missing translations (i18n audit attachment / failures)", "");
    if (this.i18nBlocks.length > 0) {
      lines.push(...this.i18nBlocks.flatMap((b) => ["", b, ""]));
    } else if (failed.some((f) => f.title.includes("i18n"))) {
      lines.push("_See failed test output above._", "");
    } else {
      lines.push("_No i18n attachment text (check `ci-i18n-status.txt` when i18n spec runs)._", "");
    }

    lines.push("## Console / network hints (from failure messages)", "");
    if (this.consoleHints.length === 0) {
      lines.push("_None extracted._", "");
    } else {
      for (const h of this.consoleHints) {
        lines.push(`- ${h.split("\n").join(" ")}`);
      }
      lines.push("");
    }

    lines.push(
      "---",
      "",
      "CI master slice: fast-sanity → journey → entitlements → navigation → API health (see `playwright.ci-master.config.ts`).",
      "Extended paid suite adds i18n, session persistence, mobile, CAT smoke, etc.",
      "Classified failures: `test-results/paid-user-suite-summary.md` (from `paid-user-summary-reporter.ts`).",
      "Exit code non-zero if any test failed (fails deploy step when used with `set -e`).",
      "",
    );

    const mdPath = path.join(outDir, "ci-master-summary.md");
    fs.writeFileSync(mdPath, lines.join("\n"), "utf8");

    const jsonPath = path.join(outDir, "ci-master-summary.json");
    fs.writeFileSync(
      jsonPath,
      JSON.stringify(
        {
          status: result.status,
          tests: this.cases,
          slowEndpointSections: this.slowBlocks.length,
          i18nSections: this.i18nBlocks.length,
        },
        null,
        2,
      ),
      "utf8",
    );
  }
}
