/**
 * Marketing SiteHeader: utility + tier bands share fixed chrome variables; middle band stays neutral.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const globalsCss = path.join(__dirname, "../../app/globals.css");

describe("marketing header band tokens (globals.css)", () => {
  it("defines shared utility/tier surfaces and neutral primary row tokens", () => {
    const css = fs.readFileSync(globalsCss, "utf8");
    assert.match(css, /--nn-header-utility-bg:\s*#[0-9a-fA-F]{6}/);
    assert.match(css, /--nn-header-tier-bg:\s*var\(--nn-header-utility-bg\)/);
    assert.match(css, /--nn-header-primary-bg:\s*#[0-9a-fA-F]{6}/);
    assert.match(css, /--nn-header-primary-fg:\s*#[0-9a-fA-F]{6}/);
    assert.match(css, /--nn-header-on-accent-fg:\s*#[0-9a-fA-F]{6}/);
  });

  it("utility-dark and logo-row tier strip use fixed band tokens (not --theme-header-surface)", () => {
    const css = fs.readFileSync(globalsCss, "utf8");
    assert.match(css, /\.nn-header-utility-dark\s*\{[^}]*background:\s*var\(--nn-header-utility-bg\)/s);
    assert.match(css, /\.nn-header-logo-row\s*\{[^}]*background:\s*var\(--nn-header-primary-bg\)/s);
    assert.match(css, /\.nn-header-logo-row\s*>\s*\.nn-header-nav-row\s*\{[^}]*background:\s*var\(--nn-header-tier-bg\)/s);
    assert.doesNotMatch(
      css,
      /\.nn-header-logo-row\s*>\s*\.nn-header-nav-row\s*\{[^}]*--theme-header-surface/s,
      "tier strip must not use theme-header-surface wash",
    );
  });
});
