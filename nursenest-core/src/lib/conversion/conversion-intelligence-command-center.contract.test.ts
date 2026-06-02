import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const repoRoot = process.cwd();

function readRepoFile(relativePath: string): string {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("conversion intelligence command center route uses the server loader and executive CIE report", () => {
  const page = readRepoFile("src/app/(admin)/admin/conversion-intelligence/page.tsx");
  assert.match(page, /loadConversionIntelligenceCommandCenter/);
  assert.match(page, /Conversion Intelligence Engine/);
  assert.match(page, /Cohort funnels/);
  assert.match(page, /Instrumentation contract/);
});

test("conversion intelligence loader composes cohorts, features, pricing, attribution, and recommendations", () => {
  const loader = readRepoFile("src/lib/conversion/load-conversion-intelligence-command-center.server.ts");
  assert.match(loader, /CONVERSION_COHORTS/);
  assert.match(loader, /loadFeatureDiscovery/);
  assert.match(loader, /loadPricingAndAttribution/);
  assert.match(loader, /buildConversionIntelligenceReport/);
  assert.match(loader, /posthogProjectConfigured/);
});

test("conversion intelligence admin route is discoverable and support-allowlisted", () => {
  const adminPage = readRepoFile("src/app/(admin)/admin/page.tsx");
  const policy = readRepoFile("src/lib/auth/admin-path-policy.ts");
  assert.match(adminPage, /\/admin\/conversion-intelligence/);
  assert.match(policy, /\/admin\/conversion-intelligence/);
});
