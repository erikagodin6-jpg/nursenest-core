/**
 * Contract: public marketing chrome — theme visibility, no duplicate utility clusters,
 * no hot-pink chart tokens, hero copy strips raw mustache, readable tier rail affordances.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { publicMarketingThemeChoiceCount } from "@/lib/theme/theme-registry";

const ROOT = process.cwd();

function read(rel: string): string {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

test("public marketing exposes multiple theme choices so Theme control can render", () => {
  assert.ok(publicMarketingThemeChoiceCount() >= 2);
});

test("site-header keeps a single desktop MarketingHeaderUtilityCluster (light: Bar A only; dark: auth row only)", () => {
  const header = read("src/components/layout/site-header.tsx");
  assert.match(header, /data-nn-header-band="utility"[\s\S]*MarketingHeaderUtilityCluster/s);
  assert.doesNotMatch(header, /MarketingHeaderUtilityStrip/);
  /** Bar A when `marketingRow4Layout` (light + Midnight); dark unified uses `!marketingRow4Layout` for inline utility. */
  assert.match(header, /\{!marketingRow4Layout \? \(/);
  assert.match(header, /chromeMode="row4"/);
  assert.match(header, /chromeMode="dark-marketing"/);
});

test("semantic-status-tokens.css avoids legacy pink/magenta hexes for semantic-chart-5", () => {
  const css = read("src/app/semantic-status-tokens.css");
  assert.doesNotMatch(css, /#f472b6/i);
  assert.doesNotMatch(css, /#ec8aab/i);
  assert.doesNotMatch(css, /#e887aa/i);
});

test("premium homepage hero strips unresolved {{mustache}} tokens", () => {
  const hero = read("src/components/marketing/home/premium-homepage-hero.tsx");
  assert.match(hero, /function stripMustachePlaceholders/);
  assert.match(hero, /stripMustachePlaceholders\(/);
});

test("marketing homepage bundle avoids obvious debug blog placeholders", () => {
  const client = read("src/components/marketing/home-restored-client.tsx");
  assert.doesNotMatch(client, /\{\{slug\}\}|\{\{title\}\}|DEBUG_BLOG|lorem ipsum draft/i);
});

test("tier hub links use bordered inactive affordance (readable on light nav wash)", () => {
  const header = read("src/components/layout/site-header.tsx");
  assert.match(header, /nn-marketing-tier-chip/);
});
