import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const css = readFileSync(join(root, "src/app/styles/marketing/hub-tiers.css"), "utf8");
const component = readFileSync(join(root, "src/components/marketing/nursing-tier-hub-page.tsx"), "utf8");
const polishStart = css.indexOf("Nursing hub clinical polish pass");
const polishEnd = css.indexOf("End nursing hub clinical polish pass.", polishStart);
const polishBlock = polishStart >= 0 && polishEnd > polishStart ? css.slice(polishStart, polishEnd) : "";

test("nursing hub premium polish remains an additive scoped pass", () => {
  assert.ok(polishStart >= 0, "missing nursing hub clinical polish pass");
  assert.ok(polishEnd > polishStart, "missing nursing hub clinical polish end marker");
  assert.match(polishBlock, /\[data-nn-nursing-tier-hub="surface"\]/);
  assert.match(component, /data-nn-nursing-tier-hub="surface"/);
  assert.match(component, /data-nn-hub-section="quick-actions"/);
  assert.match(component, /MarketingPathwayHubHeroBand/);
  assert.match(component, /StudyCard/);
});

test("nursing hub polish uses semantic tokens rather than hardcoded colors", () => {
  assert.doesNotMatch(polishBlock, /#[0-9a-fA-F]{3,8}\b/);
  assert.doesNotMatch(polishBlock, /rgba?\(/);
  assert.match(polishBlock, /var\(--semantic-/);
  assert.match(polishBlock, /color-mix/);
});

test("nursing hub polish preserves dense clinical card grid while improving scanability", () => {
  assert.match(polishBlock, /max-width: min\(100%, 78rem\)/);
  assert.match(polishBlock, /grid-auto-rows: 1fr/);
  assert.match(polishBlock, /height: 100%/);
  assert.match(polishBlock, /justify-content: space-between/);
  assert.match(polishBlock, /min-height: 12\.75rem/);
  assert.match(polishBlock, /line-height: 1\.55/);
  assert.match(polishBlock, /min-height: 2\.75rem/);
  assert.match(polishBlock, /align-self: center/);
});

test("nursing hub polish includes focus, motion, and mobile safeguards", () => {
  assert.match(polishBlock, /:focus-visible/);
  assert.match(polishBlock, /prefers-reduced-motion: reduce/);
  assert.match(polishBlock, /@media \(max-width: 640px\)/);
  assert.match(polishBlock, /text-align: left/);
  assert.match(polishBlock, /align-self: stretch/);
});
