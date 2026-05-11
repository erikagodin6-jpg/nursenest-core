import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildRepoEcgDepthAuditSnapshot } from "@/lib/ecg-module/ecg-depth-audit-repo";

function renderList(values: string[]): string {
  if (values.length === 0) return "- None";
  return values.map((value) => `- \`${value}\``).join("\n");
}

function renderDepthAuditMarkdown(snapshot: ReturnType<typeof buildRepoEcgDepthAuditSnapshot>): string {
  const matrixRows = snapshot.audit.coveredKeys
    .map((key) => {
      const counts = snapshot.audit.questionCountsByKey[key];
      const rationale = snapshot.audit.rationaleCompleteness[key];
      return `| \`${key}\` | ${snapshot.audit.lessonWordCounts[key] ?? 0} | ${counts?.total ?? 0} | ${counts?.families.strip_identification ?? 0} | ${counts?.families.priority_action ?? 0} | ${counts?.families.complication_escalation ?? 0} | ${counts?.families.comparison ?? 0} | ${counts?.families.clinical_causes ?? 0} | ${rationale?.fullRationaleCount ?? 0} | ${rationale?.distractorRationaleCount ?? 0} |`;
    })
    .join("\n");

  return `# ECG Depth Audit

## Summary
- Covered keys: ${snapshot.audit.coveredKeys.length}
- Missing keys: ${snapshot.audit.missingKeys.length}
- Publish-safe assets: ${snapshot.audit.assetReviewCounts.publish_safe}
- Generated review required assets: ${snapshot.audit.assetReviewCounts.generated_review_required}
- Internal-only assets: ${snapshot.audit.assetReviewCounts.internal_only}
- Draft units/items: ${snapshot.audit.reviewStatusCounts.draft}
- Review-ready units/items: ${snapshot.audit.reviewStatusCounts.review_ready}
- Published units/items: ${snapshot.audit.reviewStatusCounts.published}

## Missing Keys
${renderList(snapshot.audit.missingKeys)}

## Affected Learner Routes
${renderList(snapshot.affectedRoutes)}

## Admin Preview Routes
${renderList(snapshot.adminPreviewRoutes)}

## Coverage Matrix
| Key | Lesson words | Questions | Strip | Priority | Escalation | Comparison | Clinical causes | Full rationale | Distractor rationale |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${matrixRows}
`;
}

function renderAdvancedCoverageMarkdown(snapshot: ReturnType<typeof buildRepoEcgDepthAuditSnapshot>): string {
  const topicRows = snapshot.advancedCoverage.topics
    .map(
      (topic) =>
        `| \`${topic.key}\` | ${topic.status} | ${topic.wordCount} | ${topic.questionVolume.total} | ${topic.questionVolume.strip_identification} | ${topic.questionVolume.priority_action} | ${topic.questionVolume.complication_escalation} | ${topic.questionVolume.comparison} | ${topic.questionVolume.clinical_causes} | ${topic.questionVolume.minimumsMet ? "Yes" : "No"} | ${topic.clinicalReviewRequired ? "Yes" : "No"} |`,
    )
    .join("\n");

  return `# Advanced ECG Coverage Report

## Entitlement And Gating
- Eligible tiers: ${snapshot.advancedCoverage.entitlementSummary.advancedEcgEligible.join(", ")}
- Blocked tiers: ${snapshot.advancedCoverage.entitlementSummary.advancedEcgBlocked.join(", ")}
- Learner routes audited: ${snapshot.affectedRoutes.filter((route) => route.startsWith("/modules/ecg-advanced")).length}
- Admin previews audited: ${snapshot.adminPreviewRoutes.length}

## Topics Below Specialty Minimums
${renderList(
  snapshot.advancedCoverage.topics
    .filter((topic) => !topic.questionVolume.minimumsMet)
    .map((topic) => topic.key),
)}

## Topic Coverage
| Topic | Status | Lesson words | Questions | Strip | Priority | Escalation | Comparison | Clinical causes | Minimums met | Clinical review required |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
${topicRows}
`;
}

async function main() {
  const snapshot = buildRepoEcgDepthAuditSnapshot();
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const repoRoot = path.resolve(currentDir, "../..");
  const reportsDir = path.join(repoRoot, "docs", "reports");

  await fs.mkdir(reportsDir, { recursive: true });
  await fs.writeFile(path.join(reportsDir, "advanced-ecg-depth-audit.md"), renderDepthAuditMarkdown(snapshot));
  await fs.writeFile(path.join(reportsDir, "advanced-ecg-coverage-report.md"), renderAdvancedCoverageMarkdown(snapshot));

  console.log("Wrote docs/reports/advanced-ecg-depth-audit.md");
  console.log("Wrote docs/reports/advanced-ecg-coverage-report.md");
}

void main();
