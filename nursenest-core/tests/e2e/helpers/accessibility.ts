import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, type TestInfo } from "@playwright/test";

type AxeNode = {
  target: string[];
  html?: string;
  failureSummary?: string;
};

type AxeViolation = {
  id: string;
  impact?: string | null;
  help: string;
  helpUrl: string;
  tags: string[];
  nodes: AxeNode[];
};

const BLOCKING_IMPACTS = new Set(["serious", "critical"]);
const ALWAYS_FAIL_RULE_IDS = new Set([
  "aria-input-field-name",
  "button-name",
  "color-contrast",
  "duplicate-id",
  "duplicate-id-aria",
  "input-button-name",
  "label",
  "landmark-one-main",
  "region",
  "select-name",
]);

function asArray(value?: string | readonly string[]): string[] {
  if (!value) return [];
  return Array.isArray(value) ? [...value] : [value];
}

function isBlockingViolation(violation: AxeViolation): boolean {
  return BLOCKING_IMPACTS.has(violation.impact ?? "") || ALWAYS_FAIL_RULE_IDS.has(violation.id);
}

function summarizeViolation(violation: AxeViolation): string {
  const firstNode = violation.nodes[0];
  const target = firstNode?.target?.join(" | ") ?? "(no target)";
  const summary = firstNode?.failureSummary?.replace(/\s+/g, " ").trim() ?? "";
  return `- [${violation.impact ?? "n/a"}] ${violation.id}: ${violation.help} :: ${target}${summary ? ` :: ${summary}` : ""}`;
}

function buildFailureMessage(label: string, violations: AxeViolation[]): string {
  if (violations.length === 0) return `${label}: no blocking accessibility violations`;
  return `${label}: accessibility violations\n${violations.map(summarizeViolation).join("\n")}`;
}

export async function expectNoBlockingA11yViolations(input: {
  page: Page;
  testInfo: TestInfo;
  label: string;
  include?: string | readonly string[];
  exclude?: string | readonly string[];
}): Promise<void> {
  const { page, testInfo, label } = input;

  let builder = new AxeBuilder({ page }).withTags([
    "wcag2a",
    "wcag2aa",
    "wcag21a",
    "wcag21aa",
    "best-practice",
  ]);

  for (const selector of asArray(input.include)) {
    builder = builder.include(selector);
  }
  for (const selector of asArray(input.exclude)) {
    builder = builder.exclude(selector);
  }

  const results = await builder.analyze();
  const blockingViolations = (results.violations as AxeViolation[]).filter(isBlockingViolation);

  await testInfo.attach(`${label}-axe.json`, {
    body: Buffer.from(
      JSON.stringify(
        {
          label,
          url: page.url(),
          timestamp: new Date().toISOString(),
          totalViolations: results.violations.length,
          incompleteCount: results.incomplete.length,
          blockingRuleIds: [...new Set(blockingViolations.map((violation) => violation.id))],
          blockingViolations: blockingViolations.map((violation) => ({
            id: violation.id,
            impact: violation.impact ?? null,
            help: violation.help,
            helpUrl: violation.helpUrl,
            tags: violation.tags,
            nodes: violation.nodes.map((node) => ({
              target: node.target,
              html: node.html?.slice(0, 400) ?? null,
              failureSummary: node.failureSummary ?? null,
            })),
          })),
        },
        null,
        2,
      ),
      "utf-8",
    ),
    contentType: "application/json",
  });

  expect(blockingViolations, buildFailureMessage(label, blockingViolations)).toEqual([]);
}
