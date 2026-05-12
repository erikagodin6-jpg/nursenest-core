/**
 * Regression guard: blossom theme header brand lockup.
 *
 * Guards two bugs that were fixed:
 * 1. Leaf logo was invisible — the component used a CSS mask-image approach
 *    (`useMonochromeLeaf`) for blossom only; CDN mask-image silently fails on
 *    CORS/opacity issues leaving an invisible box.  The fix renders the leaf as
 *    a plain <img> for all themes, including blossom.
 * 2. "NurseNest" wordmark was near-black — the blossom CSS rule was reading
 *    `var(--logo-primary)` which .nn-header-logo-row overrides to
 *    `--nn-header-primary-fg` (#1F2536, dark navy).  The fix uses
 *    `var(--theme-primary)` (blossom pink #d948a8) instead.
 *
 * Run from nursenest-core/:
 *   node --import tsx --test tests/contracts/blossom-header-brand.contract.test.ts
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();

const MARKETING_CSS = readFileSync(
  join(ROOT, "src/app/premium-redesign-2026.css"),
  "utf-8",
);
const GLOBALS_CSS = readFileSync(
  join(ROOT, "src/app/globals.css"),
  "utf-8",
);
const HEADER_LOCKUP_SRC = readFileSync(
  join(ROOT, "src/components/brand/header-brand-lockup.tsx"),
  "utf-8",
);
const PALETTES_CSS = readFileSync(
  join(ROOT, "src/app/theme-palettes.css"),
  "utf-8",
);

// ─── WCAG helpers ────────────────────────────────────────────────────────────

function hexToLinear(c: number): number {
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string): number {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  return 0.2126 * hexToLinear(r) + 0.7152 * hexToLinear(g) + 0.0722 * hexToLinear(b);
}

function contrastRatio(fg: string, bg: string): number {
  const L1 = relativeLuminance(fg);
  const L2 = relativeLuminance(bg);
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Extract the body of the first matching rule block from a CSS string. */
function extractCssRuleBody(css: string, selectorPattern: RegExp): string | null {
  const re = new RegExp(selectorPattern.source + "\\s*\\{([^}]+)\\}");
  return css.match(re)?.[1] ?? null;
}

/** Pull a single hex value for a CSS prop out of the midnight or blossom block. */
function themeTokenHex(css: string, themeId: string, prop: string): string | null {
  const blockRe = new RegExp(
    `(?:html\\[data-theme="${themeId}"\\]|\\[data-theme="${themeId}"\\])\\s*\\{([\\s\\S]*?)\\n\\}`,
    "m",
  );
  const block = css.match(blockRe)?.[1] ?? "";
  const tokenRe = new RegExp(
    `${prop.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*:\\s*(#[0-9a-fA-F]{3,8})`,
    "i",
  );
  return block.match(tokenRe)?.[1] ?? null;
}

// ─── Blossom brand lockup CSS ────────────────────────────────────────────────

describe("blossom brand lockup CSS — uses theme-primary not logo-primary", () => {
  it("blossom .nn-header-brand-lockup rule exists in premium-redesign-2026.css", () => {
    assert.match(
      MARKETING_CSS,
      /html\[data-theme="blossom"\]\s*\.nn-header-brand-lockup/,
      "blossom brand lockup override must exist in premium-redesign-2026.css",
    );
  });

  it("blossom brand lockup color is var(--theme-primary)", () => {
    const body = extractCssRuleBody(
      MARKETING_CSS,
      /html\[data-theme="blossom"\]\s*\.nn-header-brand-lockup/,
    );
    assert.ok(body, "blossom .nn-header-brand-lockup rule body must be extractable");
    assert.match(
      body,
      /color\s*:\s*var\(--theme-primary\)/i,
      "blossom brand lockup must use var(--theme-primary) so the leaf and wordmark render in blossom pink",
    );
  });

  it("blossom brand lockup does NOT use var(--logo-primary)", () => {
    const body = extractCssRuleBody(
      MARKETING_CSS,
      /html\[data-theme="blossom"\]\s*\.nn-header-brand-lockup/,
    );
    assert.ok(body);
    assert.doesNotMatch(
      body,
      /color\s*:\s*var\(--logo-primary\)/i,
      "var(--logo-primary) resolves to --nn-header-primary-fg (near-black) inside .nn-header-logo-row — must not be used for blossom brand color",
    );
  });
});

// ─── HeaderBrandLockup component — no mask-image path ────────────────────────

describe("HeaderBrandLockup component — leaf renders as plain <img>", () => {
  it("useMonochromeLeaf is removed from HeaderBrandLockup", () => {
    assert.doesNotMatch(
      HEADER_LOCKUP_SRC,
      /useMonochromeLeaf/,
      "useMonochromeLeaf variable must be removed — blossom leaf must render as <img> not CSS mask",
    );
  });

  it("no CSS mask-image is used for the leaf", () => {
    assert.doesNotMatch(
      HEADER_LOCKUP_SRC,
      /maskImage|mask-image/i,
      "CSS mask-image approach must not be used — it silently fails on CDN CORS and leaves an invisible box",
    );
  });

  it("no WebkitMaskImage is used for the leaf", () => {
    assert.doesNotMatch(
      HEADER_LOCKUP_SRC,
      /WebkitMaskImage/,
      "WebkitMaskImage must not be used in HeaderBrandLockup",
    );
  });

  it("leaf slot renders an <img> element", () => {
    assert.match(
      HEADER_LOCKUP_SRC,
      /<img/,
      "HeaderBrandLockup must render a plain <img> for the leaf raster",
    );
  });

  it("leaf <img> has an onError handler for load failures", () => {
    assert.match(
      HEADER_LOCKUP_SRC,
      /onError/,
      "leaf <img> must have onError so a broken CDN URL falls back to Lucide Leaf",
    );
  });

  it("Lucide Leaf is still imported as the SVG fallback", () => {
    assert.match(
      HEADER_LOCKUP_SRC,
      /import.*Leaf.*from "lucide-react"/,
      "Lucide Leaf must remain imported as the raster-failure fallback",
    );
  });
});

// ─── Blossom heading readability (visual contract) ───────────────────────────

describe("blossom marketing heading readability", () => {
  it(".nn-marketing-h1 uses var(--palette-heading) — inherits readable ink on blossom light bg", () => {
    assert.match(
      GLOBALS_CSS,
      /\.nn-marketing-h1\s*\{[^}]*color\s*:\s*var\(--palette-heading\)/s,
      ".nn-marketing-h1 must use var(--palette-heading) so dark ink (#111827 default) is readable on blossom's near-white background",
    );
  });

  it(".nn-marketing-h2 uses var(--palette-heading)", () => {
    assert.match(
      GLOBALS_CSS,
      /\.nn-marketing-h2\s*\{[^}]*color\s*:\s*var\(--palette-heading\)/s,
      ".nn-marketing-h2 must use var(--palette-heading)",
    );
  });

  it("blossom CSS block defines a light page background confirming dark text is readable", () => {
    const pageBg = themeTokenHex(PALETTES_CSS, "blossom", "--theme-page-bg");
    // Blossom uses color-mix for page-bg; if it's a plain hex it must be light.
    // If it's a color-mix expression we skip the exact check (non-trivial to parse).
    const blockRe = /html\[data-theme="blossom"\]\s*\{[\s\S]*?--theme-page-bg\s*:[^;]+;/m;
    assert.match(
      PALETTES_CSS,
      blockRe,
      "blossom must define --theme-page-bg in its CSS identity block",
    );
    if (pageBg) {
      const lum = relativeLuminance(pageBg);
      assert.ok(
        lum > 0.5,
        `blossom --theme-page-bg "${pageBg}" (luminance ${lum.toFixed(3)}) must be light so dark text is readable`,
      );
    }
  });
});

// ─── Blossom footer / nav foreground readability ──────────────────────────────

describe("blossom nav/footer foreground readability", () => {
  it("blossom CSS block defines --theme-nav-foreground (ensures footer text is themed)", () => {
    assert.match(
      PALETTES_CSS,
      /html\[data-theme="blossom"\]\s*\{[\s\S]*?--theme-nav-foreground\s*:[^;]+;/m,
      "blossom CSS block must define --theme-nav-foreground so footer/nav text is themed, not invisible",
    );
  });

  it("logo-row CSS overrides --logo-primary to nn-header-primary-fg (documents the cascade root cause)", () => {
    assert.match(
      GLOBALS_CSS,
      /\.nn-header-logo-row\s*\{[\s\S]*?--logo-primary\s*:\s*var\(--nn-header-primary-fg\)/s,
      ".nn-header-logo-row must override --logo-primary to --nn-header-primary-fg — this is why blossom cannot use var(--logo-primary) in its brand lockup rule",
    );
  });
});
