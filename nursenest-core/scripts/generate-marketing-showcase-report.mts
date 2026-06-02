import fs from "node:fs/promises";
import path from "node:path";

import {
  MARKETING_DEMO_LEARNERS,
  MARKETING_SHOWCASE_COLLECTION,
  MARKETING_SHOWCASE_MINIMUMS,
  assertMarketingShowcaseMinimums,
  getMarketingShowcaseCoverage,
  selectMarketingShowcaseCandidates,
  type MarketingShowcaseKind,
} from "@/lib/marketing/marketing-showcase-content";

const ROOT = process.cwd();
const OUT_FILE = path.join(ROOT, "docs", "reports", "marketing-showcase-content-system.md");

function titleCaseKind(kind: string): string {
  return kind
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function lineForKind(kind: MarketingShowcaseKind, count: number): string {
  const minimum = MARKETING_SHOWCASE_MINIMUMS[kind as keyof typeof MARKETING_SHOWCASE_MINIMUMS];
  const status = minimum === undefined ? "inventory" : count >= minimum ? "meets minimum" : "below minimum";
  return `| ${titleCaseKind(kind)} | ${count} | ${minimum ?? "-"} | ${status} |`;
}

async function main() {
  assertMarketingShowcaseMinimums();

  const coverage = getMarketingShowcaseCoverage();
  const kinds = Object.keys(coverage).sort() as MarketingShowcaseKind[];
  const topCandidates = selectMarketingShowcaseCandidates({ limit: 24 });

  const lines: string[] = [
    "# Marketing Showcase Content System",
    "",
    "Generated from `src/lib/marketing/marketing-showcase-content.ts`.",
    "",
    "This registry is the dedicated marketing content layer for screenshots, demos, homepage assets, pricing assets, sales pages, institutional presentations, investor materials, onboarding tours, and promotional campaigns.",
    "",
    "## Governance",
    "",
    "- Showcase items are curated metadata references, not production learner content mutations.",
    "- Screenshot automation should select by `showcaseScore` and required metadata flags, not first item, random item, or newest item.",
    "- Every item carries `marketingPriority=true`, `marketingShowcase=true`, and `featuredScreenshotCandidate=true`.",
    "- Every capture should open the deep educational state described in `screenshotInstruction` before capture.",
    "",
    "## Inventory",
    "",
    "| Collection | Items | Required Minimum | Status |",
    "| --- | ---: | ---: | --- |",
    ...kinds.map((kind) => lineForKind(kind, coverage[kind] ?? 0)),
    "",
    `Total showcase items: ${MARKETING_SHOWCASE_COLLECTION.length}`,
    "",
    "## Top Screenshot Candidates",
    "",
    "| Rank | Type | Title | Score | Route | Capture Instruction |",
    "| ---: | --- | --- | ---: | --- | --- |",
    ...topCandidates.map((item, index) =>
      `| ${index + 1} | ${titleCaseKind(item.kind)} | ${item.title} | ${item.showcaseScore} | \`${item.entryRoute}\` | ${item.screenshotInstruction} |`,
    ),
    "",
    "## Demo Readiness Learners",
    "",
    "| Persona | Readiness | Strengths | Weak Areas | Recommendations |",
    "| --- | ---: | --- | --- | --- |",
    ...MARKETING_DEMO_LEARNERS.map(
      (learner) =>
        `| ${learner.label} | ${learner.readinessScore}% | ${learner.strengths.join(", ")} | ${learner.weakAreas.join(", ")} | ${learner.recommendations.join("; ")} |`,
    ),
    "",
    "## Automation Contract",
    "",
    "Screenshot generators should call `selectMarketingShowcaseCandidates({ kind, audience, limit })` or `getTopMarketingShowcaseItem(kind)` and then perform the associated `screenshotInstruction` before capture.",
    "",
  ];

  await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
  await fs.writeFile(OUT_FILE, `${lines.join("\n")}\n`, "utf8");
  console.log(`Wrote ${path.relative(ROOT, OUT_FILE)}`);
}

await main();
