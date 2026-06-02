#!/usr/bin/env node
/**
 * CI gate: breadcrumb governance unit tests (intent, roots, schema, depth, graph bridge).
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const tests = [
  "src/lib/breadcrumbs/breadcrumb-governance-hardening.test.ts",
  "src/lib/breadcrumbs/breadcrumb-governance.test.ts",
  "src/lib/breadcrumbs/breadcrumb-intent.test.ts",
  "src/lib/breadcrumbs/schema-ownership.test.ts",
  "src/lib/breadcrumbs/layout-fallback-policy.test.ts",
  "src/lib/breadcrumbs/ecg-academy-governance.contract.test.ts",
  "src/lib/breadcrumbs/learner-route-governance.contract.test.ts",
  "src/lib/breadcrumbs/discovery-breadcrumb-governance.test.ts",
  "src/lib/breadcrumbs/canonical-breadcrumb-href-builder.test.ts",
  "src/lib/breadcrumbs/residual-authority-governance.contract.test.ts",
  "src/lib/breadcrumbs/governance/semantic-telemetry-lineage.contract.test.ts",
  "src/lib/breadcrumbs/governance/runtime-semantic-integrity.contract.test.ts",
  "src/lib/breadcrumbs/governance/seo-surface-governance.contract.test.ts",
  "src/lib/breadcrumbs/governance/semantic-route-coverage.contract.test.ts",
  "src/lib/seo/pathway-breadcrumbs.test.ts",
].map((p) => join(root, p));

const result = spawnSync("node", ["--import", "tsx", "--test", ...tests], {
  cwd: root,
  stdio: "inherit",
});

process.exit(result.status ?? 1);
