import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { prisma } from "@/lib/db";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-pathways-catalog";
import {
  pathwayExamQuestionMarketingHubInventoryWhere,
  pathwayExamQuestionMarketingWhere,
} from "@/lib/exam-pathways/pathway-question-bank-snapshot.server";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { hydratePracticeHubAggregatesFromGroupByRows } from "@/lib/questions/pathway-practice-hub-inventory";
import { resolveQuestionBankLauncherDecision } from "@/lib/questions/question-bank-empty-state-decision";

const REPORT_PATH = join(process.cwd(), "docs/reports/question-bank-false-empty-state-audit.md");

function pathwayGroup(pathway: ExamPathwayDefinition): string | null {
  if (pathway.id === "ca-rn-nclex-rn") return "RN Canada";
  if (pathway.id === "us-rn-nclex-rn") return "RN US";
  if (pathway.id === "ca-rpn-rex-pn") return "RPN Canada";
  if (pathway.id === "us-lpn-nclex-pn") return "PN US";
  if (pathway.roleTrack === "np" && pathway.status === "active") return "NP";
  if (pathway.roleTrack === "allied" && pathway.status === "active") return "Allied";
  if (pathway.id === "us-rn-new-grad-transition") return "New Grad";
  return null;
}

function yesNo(value: boolean): "Yes" | "No" {
  return value ? "Yes" : "No";
}

const pathways = EXAM_PATHWAYS.filter((pathway) => pathwayGroup(pathway) !== null);

const rows = [];
for (const pathway of pathways) {
  const publishedWhere = pathwayExamQuestionMarketingWhere(pathway);
  const visibleWhere = pathwayExamQuestionMarketingHubInventoryWhere(pathway);
  const [publishedQuestionCount, visibleQuestionCount, grouped] = await Promise.all([
    prisma.examQuestion.count({ where: publishedWhere }),
    prisma.examQuestion.count({ where: visibleWhere }),
    prisma.examQuestion.groupBy({
      by: ["bodySystem", "topic", "nclexClientNeedsCategory"],
      where: visibleWhere,
      _count: { _all: true },
    }),
  ]);
  const aggregates = hydratePracticeHubAggregatesFromGroupByRows(grouped);
  const categoryCount = aggregates.filter((row) => row.id !== "uncategorized" && row.questionCount > 0).length;
  const snapshot = {
    status: "ok" as const,
    publishedQuestionCount,
    visibleQuestionCount,
    activeQuestionCount: visibleQuestionCount,
    pathwayScopedCount: visibleQuestionCount,
    adaptiveEligibleCount: 0,
    examKeys: [...new Set(pathway.contentExamKeys)],
  };
  const decision = resolveQuestionBankLauncherDecision(snapshot, visibleQuestionCount > 0);
  const bannerShown = decision.status === "publishing";
  rows.push({
    group: pathwayGroup(pathway)!,
    pathway,
    publishedQuestionCount,
    activeQuestionCount: visibleQuestionCount,
    categoryCount,
    visibleQuestionCount,
    bannerShown,
    expected: publishedQuestionCount === 0 ? "Yes" : "No",
    rootCause:
      publishedQuestionCount === 0
        ? "No published rows in pathway scope."
        : visibleQuestionCount === 0
          ? "Published rows exist, but current hub visibility filters exclude them."
          : "Content available; publishing banner must not render.",
    decisionReason: decision.reason,
  });
}

const generatedAt = new Date().toISOString();
const lines = [
  "# Question Bank False Empty State Audit",
  "",
  `Generated: ${generatedAt}`,
  "",
  "## Rendering Code Paths",
  "",
  "- `src/components/questions/public-questions-study-launcher.tsx` is the only code path containing the exact publishing banner copy.",
  "- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/questions/page.tsx` now logs the resolved launcher decision with pathway slug, published count, visible count, filter count, banner state, and reason.",
  "- The banner is now allowed only when `publishedQuestionCount === 0`; unavailable snapshots, failed counts, and filtered-out visible pools render an error state instead.",
  "",
  "## Pathway Results",
  "",
  "| Group | Pathway | Published Questions | Active Questions | Question Bank Categories | Visible Questions | Banner Shown? | Expected? | Root Cause | Decision Reason |",
  "| --- | --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- |",
  ...rows.map((row) =>
    [
      row.group,
      row.pathway.id,
      String(row.publishedQuestionCount),
      String(row.activeQuestionCount),
      String(row.categoryCount),
      String(row.visibleQuestionCount),
      yesNo(row.bannerShown),
      row.expected,
      row.rootCause,
      row.decisionReason,
    ].join(" | "),
  ).map((line) => `| ${line} |`),
  "",
  "## Summary",
  "",
  `- Audited pathways: ${rows.length}`,
  `- False banners after fix: ${rows.filter((row) => row.bannerShown && row.publishedQuestionCount > 0).length}`,
  `- Pathways with published questions: ${rows.filter((row) => row.publishedQuestionCount > 0).length}`,
  `- Pathways with no published questions: ${rows.filter((row) => row.publishedQuestionCount === 0).length}`,
  "",
];

await mkdir(dirname(REPORT_PATH), { recursive: true });
await writeFile(REPORT_PATH, `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${REPORT_PATH}`);
await prisma.$disconnect();
