/**
 * Contract: homepage feature visibility pass — scoped CSS, hooks, capability strip.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const ROOT = process.cwd();

const VISIBILITY_CSS = path.join(
  ROOT,
  "src/app/styles/marketing/homepage-feature-visibility-pass.css",
);
const INDEX_CSS = path.join(ROOT, "src/app/styles/marketing/index.css");
const HOME_CLIENT = path.join(ROOT, "src/components/marketing/home-restored-client.tsx");
const CAPABILITY_STRIP = path.join(
  ROOT,
  "src/components/marketing/home/premium-platform-capability-strip.tsx",
);
const CLINICAL_DEPTH = path.join(
  ROOT,
  "src/components/marketing/home/premium-clinical-depth.tsx",
);

const HEX_IN_PRODUCT_UI = /#[0-9a-fA-F]{3,8}\b/;

test("marketing index imports homepage feature visibility pass after polish pass", () => {
  const src = fs.readFileSync(INDEX_CSS, "utf8");
  const polishIdx = src.indexOf("./homepage-premium-polish-pass.css");
  const visibilityIdx = src.indexOf("./homepage-feature-visibility-pass.css");
  assert.ok(visibilityIdx >= 0);
  assert.ok(polishIdx >= 0);
  assert.ok(visibilityIdx > polishIdx);
});

test("HomeRestoredClient exposes feature visibility hook and capability strip", () => {
  const src = fs.readFileSync(HOME_CLIENT, "utf8");
  assert.match(src, /data-nn-homepage-feature-visibility/);
  assert.match(src, /PremiumPlatformCapabilityStrip/);
  assert.match(src, /skeleton-capability-strip/);
});

test("capability strip surfaces core platform differentiators", () => {
  const src = fs.readFileSync(CAPABILITY_STRIP, "utf8");
  assert.match(src, /section-platform-capability-strip/);
  for (const token of ["ecgTelemetry", "ngn", "simulations", "ncjmm", "competency"]) {
    assert.match(src, new RegExp(token));
  }
});

test("clinical depth includes NGN and simulation cards", () => {
  const src = fs.readFileSync(CLINICAL_DEPTH, "utf8");
  assert.match(src, /ngnJudgment/);
  assert.match(src, /simulations/);
});

test("feature visibility CSS uses semantic tokens only", () => {
  const css = fs.readFileSync(VISIBILITY_CSS, "utf8");
  assert.ok(!HEX_IN_PRODUCT_UI.test(css));
  assert.match(
    css,
    /\.nn-home-marketing-root\[data-nn-homepage-branding-revamp\]\[data-nn-homepage-feature-visibility\]/,
  );
});
