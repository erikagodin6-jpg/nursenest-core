/**
 * Contract: homepage premium polish pass — scoped CSS, semantic tokens, hook present.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const ROOT = process.cwd();

const POLISH_CSS = path.join(
  ROOT,
  "src/app/styles/marketing/homepage-premium-polish-pass.css",
);
const INDEX_CSS = path.join(ROOT, "src/app/styles/marketing/index.css");
const HOME_CLIENT = path.join(ROOT, "src/components/marketing/home-restored-client.tsx");

const HEX_IN_PRODUCT_UI = /#[0-9a-fA-F]{3,8}\b/;
const RGB_RAW = /\brgb\s*\(/;

test("marketing index imports homepage premium polish pass after branding revamp", () => {
  const src = fs.readFileSync(INDEX_CSS, "utf8");
  const brandingIdx = src.indexOf("./homepage-branding-revamp.css");
  const polishIdx = src.indexOf("./homepage-premium-polish-pass.css");
  assert.ok(brandingIdx >= 0, "homepage-branding-revamp.css must be imported");
  assert.ok(polishIdx >= 0, "homepage-premium-polish-pass.css must be imported");
  assert.ok(polishIdx > brandingIdx, "polish pass must load after branding revamp");
});

test("HomeRestoredClient exposes premium polish data hook", () => {
  const src = fs.readFileSync(HOME_CLIENT, "utf8");
  assert.match(src, /data-nn-homepage-branding-revamp/);
  assert.match(src, /data-nn-homepage-premium-polish/);
});

test("homepage premium polish CSS uses semantic tokens only (no raw hex/rgb)", () => {
  const css = fs.readFileSync(POLISH_CSS, "utf8");
  assert.ok(!HEX_IN_PRODUCT_UI.test(css), "polish pass must not contain hardcoded hex");
  assert.ok(!RGB_RAW.test(css), "polish pass must not contain raw rgb()");
});

test("homepage premium polish CSS is scoped to homepage root hooks", () => {
  const css = fs.readFileSync(POLISH_CSS, "utf8");
  assert.match(
    css,
    /\.nn-home-marketing-root\[data-nn-homepage-branding-revamp\]\[data-nn-homepage-premium-polish\]/,
  );
  assert.ok(
    !css.includes("!important"),
    "polish pass must not use !important overrides",
  );
});

test("homepage premium polish CSS defines motion and reduced-motion guards", () => {
  const css = fs.readFileSync(POLISH_CSS, "utf8");
  assert.match(css, /--nn-home-motion-interact:\s*160ms/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test("homepage premium polish CSS includes theme parity selectors", () => {
  const css = fs.readFileSync(POLISH_CSS, "utf8");
  assert.match(css, /html\[data-theme="midnight"\]/);
  assert.match(css, /html\[data-theme="ocean"\]/);
  assert.match(css, /html\[data-theme="blossom"\]/);
});
