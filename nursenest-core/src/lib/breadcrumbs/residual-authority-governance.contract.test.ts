/**
 * Residual alternate breadcrumb authority — CI must fail on new bypasses.
 */
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import test from "node:test";

const REPO = process.cwd();
const SRC = join(REPO, "src");

const GRANDFATHER_APP_SHELL = new Set([
  "src/lib/seo/breadcrumb-resolver.ts",
  "src/lib/breadcrumbs/app-shell-breadcrumb-adapter.ts",
]);

const ALLOWED_TRAIL_WRAPPERS =
  /LearnerBreadcrumbTrail|AnalyticsBreadcrumbTrail|BreadcrumbsFromResolution|AcademyBreadcrumbBar|Breadcrumbs\b/;

function walk(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (p.endsWith(".ts") || p.endsWith(".tsx")) acc.push(p);
  }
  return acc;
}

test("appShellBreadcrumbs only in grandfathered adapter files", () => {
  const violations: string[] = [];
  for (const file of walk(SRC)) {
    const rel = relative(REPO, file);
    const text = readFileSync(file, "utf8");
    if (!/\bappShellBreadcrumbs\s*\(/.test(text)) continue;
    if (GRANDFATHER_APP_SHELL.has(rel)) continue;
    if (rel.endsWith(".test.ts") || rel.endsWith(".contract.test.ts")) continue;
    violations.push(rel);
  }
  assert.equal(violations.length, 0, violations.join("\n"));
});

const CRITICAL_GOVERNED_MARKETING = [
  "src/components/seo/programmatic-seo-page.tsx",
  "src/components/seo/exam-cluster-hub-page.tsx",
  "src/components/exam-pathways/exam-pathway-hub.tsx",
  "src/components/seo/authority-cluster-page.tsx",
] as const;

test("critical SEO surfaces use governed breadcrumb adapters", () => {
  const violations: string[] = [];
  for (const rel of CRITICAL_GOVERNED_MARKETING) {
    const text = readFileSync(join(REPO, rel), "utf8");
    if (!ALLOWED_TRAIL_WRAPPERS.test(text) || text.includes("<BreadcrumbTrail")) {
      violations.push(`${rel}: must use BreadcrumbsFromResolution or AcademyBreadcrumbBar only`);
    }
  }
  assert.equal(violations.length, 0, violations.join("\n"));
});

test("manual breadcrumb intent forbidden outside tests", () => {
  const violations: string[] = [];
  const re = /\bintent:\s*["'](?:learner|education|discovery|seo)["']/g;
  for (const file of walk(SRC)) {
    const rel = relative(REPO, file);
    if (rel.includes("/lib/breadcrumbs/") && rel.endsWith(".test.ts")) continue;
    if (rel.endsWith(".contract.test.ts")) continue;
    if (rel.includes("navigation-ontology")) continue;
    if (rel.includes("topic-cluster-governance")) continue;
    if (rel.includes("healthcare-exam-authority")) continue;
    const text = readFileSync(file, "utf8");
    re.lastIndex = 0;
    if (re.test(text)) violations.push(rel);
  }
  assert.equal(violations.length, 0, violations.join("\n"));
});
