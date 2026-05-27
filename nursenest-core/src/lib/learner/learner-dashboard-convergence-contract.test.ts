import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const shellPath = join(__dirname, "../../components/student/learner-dashboard-page-shell.tsx");
const reportPath = join(__dirname, "../../app/(app)/app/(learner)/account/_lib/learner-report-card-route.tsx");
const nursingAnalyticsPath = join(__dirname, "../../components/student/dashboard/learner-premium-nursing-analytics.tsx");

describe("Learner dashboard + report card — premium convergence hooks", () => {
  const shellSrc = readFileSync(shellPath, "utf8");
  const reportSrc = readFileSync(reportPath, "utf8");
  const nursingSrc = readFileSync(nursingAnalyticsPath, "utf8");

  it("tags the /app dashboard shell for convergence styling + QA", () => {
    assert.equal(shellSrc.includes("nn-learner-dashboard-convergence"), true);
    assert.equal(shellSrc.includes("data-nn-learner-dashboard-convergence"), true);
  });

  it("tags the account report card shell", () => {
    assert.equal(reportSrc.includes("nn-learner-report-card-convergence"), true);
    assert.equal(reportSrc.includes("data-nn-learner-report-card-convergence"), true);
  });

  it("marks the nursing analytics band for cockpit convergence framing", () => {
    assert.equal(nursingSrc.includes("nn-learner-nursing-analytics-band"), true);
  });
});
