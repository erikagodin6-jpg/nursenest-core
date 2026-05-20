#!/usr/bin/env node
/**
 * Static governance scan: schema leakage, inline breadcrumbs, ontology drift.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("../", import.meta.url).pathname.replace(/\/$/, "");
const APP_MARKETING = join(ROOT, "src/app/(marketing)");
const APP_STUDENT = join(ROOT, "src/app/(student)/app/(learner)");
const BREADCRUMBS_LIB = join(ROOT, "src/lib/breadcrumbs");

const issues = [];

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (p.endsWith(".tsx") || p.endsWith(".ts")) acc.push(p);
  }
  return acc;
}

function scanFile(path) {
  const rel = relative(ROOT, path);
  const text = readFileSync(path, "utf8");
  const isLearner = rel.includes("(student)/app/(learner)");
  const isEcg =
    rel.includes("/ecg/") ||
    rel.includes("/advanced-ecg-nursing/") ||
    rel.includes("/ecg-interpretation/") ||
    rel.includes("/ecg-telemetry") ||
    rel.includes("/pals-rhythms/") ||
    rel.includes("/acls-rhythms/") ||
    rel.includes("/telemetry-nursing/") ||
    rel.includes("/pediatric-ecg/");

  const criticalSeo = [
    "components/seo/programmatic-seo-page.tsx",
    "components/seo/exam-cluster-hub-page.tsx",
    "components/seo/authority-cluster-page.tsx",
  ];
  if (criticalSeo.includes(rel) && text.includes("<BreadcrumbTrail")) {
    issues.push({ code: "shadow_seo_trail_critical", file: rel });
  }

  if (/\bappShellBreadcrumbs\s*\(/.test(text) && !rel.includes("app-shell-breadcrumb-adapter") && !rel.includes("breadcrumb-resolver.ts")) {
    issues.push({ code: "legacy_app_shell_breadcrumbs", file: rel });
  }

  if (isLearner) {
    if (text.includes('"@type": "BreadcrumbList"') || text.includes('@type": "BreadcrumbList"')) {
      issues.push({ code: "learner_breadcrumb_schema", file: rel });
    }
    if (text.includes("BreadcrumbJsonLd") || text.includes("BreadcrumbsFromResolution")) {
      issues.push({ code: "learner_jsonld_component", file: rel });
    }
    if (text.includes("<BreadcrumbTrail") && !text.includes("LearnerBreadcrumbTrail") && !text.includes("AnalyticsBreadcrumbTrail")) {
      issues.push({ code: "ungoverned_learner_trail", file: rel });
    }
    if (text.includes("buildRnRemediationGraphSteps") && !text.includes("orchestrateEducationalGraph") && rel.includes("remediation")) {
      issues.push({ code: "remediation_traversal_divergence", file: rel });
    }
  }

  if (isEcg || rel.includes("clinical-modules") || rel.includes("labs-interpretation")) {
    if (text.includes('"@type": "BreadcrumbList"') && !text.includes("AcademyBreadcrumbBar")) {
      issues.push({ code: "inline_ecg_breadcrumb_list", file: rel });
    }
    if (text.includes('aria-label="Breadcrumb"') && !text.includes("AcademyBreadcrumbBar") && !text.includes("Breadcrumbs")) {
      issues.push({ code: "adhoc_breadcrumb_nav", file: rel });
    }
    if (text.includes("@graph") && text.includes("BreadcrumbList")) {
      issues.push({ code: "nested_graph_breadcrumb", file: rel });
    }
  }
}

for (const f of [...walk(APP_MARKETING), ...walk(APP_STUDENT)]) {
  scanFile(f);
}

const rootRegistry = readFileSync(join(BREADCRUMBS_LIB, "breadcrumb-root-registry.ts"), "utf8");
const rootIds = [...rootRegistry.matchAll(/rootId:\s*"([^"]+)"/g)].map((m) => m[1]);
const dupRoots = rootIds.filter((id, i) => rootIds.indexOf(id) !== i);
if (dupRoots.length) {
  issues.push({ code: "ontology_root_duplication", file: "breadcrumb-root-registry.ts" });
}

for (const f of walk(APP_MARKETING)) {
  const rel = relative(ROOT, f);
  const text = readFileSync(f, "utf8");
  if (text.includes("AcademyBreadcrumbBar") && text.includes("const PATH =") && !text.includes("pathname={PATH}")) {
    issues.push({ code: "academy_pathname_missing", file: rel });
  }
}

const navAnalytics = readFileSync(join(BREADCRUMBS_LIB, "navigation-analytics.ts"), "utf8");
if (!navAnalytics.includes("ontologyNamespace")) {
  issues.push({ code: "navigation_telemetry_incomplete", file: "navigation-analytics.ts" });
}

if (issues.length > 0) {
  console.error("[breadcrumb-governance-scan] FAILED\n");
  for (const i of issues) {
    console.error(`  ${i.code}: ${i.file}`);
  }
  process.exit(1);
}

console.error("[breadcrumb-governance-scan] OK");
