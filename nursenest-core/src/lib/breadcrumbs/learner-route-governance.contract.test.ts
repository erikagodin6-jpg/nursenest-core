/**
 * Contract: learner /app routes must not bypass governed breadcrumb authority.
 */
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const LEARNER_APP_ROOT = join(process.cwd(), "src/app/(student)/app/(learner)");

function walkTsx(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walkTsx(full, out);
    else if (name.endsWith(".tsx") || name.endsWith(".ts")) out.push(full);
  }
  return out;
}

const FORBIDDEN_PATTERNS: Array<{ re: RegExp; label: string }> = [
  { re: /\bintent:\s*["'](?:learner|education|discovery|seo)["']/g, label: "manual breadcrumb intent" },
  { re: /appShellBreadcrumbs\s*\(/g, label: "legacy appShellBreadcrumbs" },
  { re: /<BreadcrumbTrail\b/g, label: "raw BreadcrumbTrail in learner app" },
];

const ALLOWED_BREADCRUMB_TRAIL = /LearnerBreadcrumbTrail|AnalyticsBreadcrumbTrail|BreadcrumbsFromResolution/;

test("learner app routes avoid breadcrumb governance bypasses", () => {
  const files = walkTsx(LEARNER_APP_ROOT);
  const violations: string[] = [];

  for (const file of files) {
    const src = readFileSync(file, "utf8");
    for (const { re, label } of FORBIDDEN_PATTERNS) {
      re.lastIndex = 0;
      if (re.test(src)) {
        violations.push(`${file}: ${label}`);
      }
    }
    if (src.includes("<BreadcrumbTrail") && !ALLOWED_BREADCRUMB_TRAIL.test(src)) {
      violations.push(`${file}: BreadcrumbTrail without governed wrapper`);
    }
  }

  assert.equal(violations.length, 0, violations.join("\n"));
});
