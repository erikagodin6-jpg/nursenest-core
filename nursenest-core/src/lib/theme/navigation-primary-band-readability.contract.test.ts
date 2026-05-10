/**
 * Marketing header primary band must stay on neutral paper tokens, not saturated `var(--nav-bg)`
 * from the sticky chrome wrapper (regression guard for premium glass overrides).
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PREMIUM_CSS = path.join(__dirname, "../../app/premium-redesign-2026.css");
const GLOBALS_CSS = path.join(__dirname, "../../app/globals.css");

describe("navigation primary band readability (CSS contracts)", () => {
  it("premium primary band rules do not tint with var(--nav-bg)", () => {
    const css = fs.readFileSync(PREMIUM_CSS, "utf8");
    const marker = "/* Primary marketing band:";
    const idx = css.indexOf(marker);
    assert.ok(idx >= 0, `expected premium CSS section ${marker}`);
    const section = css.slice(idx, idx + 900);
    assert.doesNotMatch(
      section,
      /var\(\s*--nav-bg/,
      "primary band must not reference var(--nav-bg) (saturated theme chrome from sticky wrapper)",
    );
    assert.match(section, /--nn-header-primary-bg/, "primary band must anchor to neutral header paper");
  });

  it("premium phase-3 shell/logo-row primary selectors do not use var(--nav-bg)", () => {
    const css = fs.readFileSync(PREMIUM_CSS, "utf8");
    const phase3 = css.slice(css.indexOf("Phase 3 — Premium global navigation"));
    const shellBlock = phase3.match(
      /\[data-nn-header-layout="marketing-row4"\]\s+\[data-nn-header-band="primary"\]\s*\{[^}]+}/s,
    );
    assert.ok(shellBlock, "expected phase-3 marketing-row4 [data-nn-header-band=primary] block");
    assert.doesNotMatch(shellBlock[0], /var\(\s*--nav-bg/, "phase-3 primary shell must not use var(--nav-bg)");
    assert.match(shellBlock[0], /--nn-header-primary-bg/, "phase-3 primary shell must use neutral header paper");
  });

  it("light logo row binds wordmark ink to primary foreground", () => {
    const css = fs.readFileSync(GLOBALS_CSS, "utf8");
    const logoRow = css.match(/\.nn-header-logo-row\s*\{[^}]+}/s);
    assert.ok(logoRow, "expected .nn-header-logo-row block");
    assert.match(
      logoRow[0],
      /--logo-primary:\s*var\(--nn-header-primary-fg\)/,
      "logo wordmark should use header ink on the light paper band",
    );
  });
});
