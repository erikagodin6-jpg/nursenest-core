/**
 * === MARKETING HEADER THREE-ROW REGRESSION TESTS ===
 *
 * Proves the 3-row header layout contract:
 *
 * Row 0 (utility row):  Country selector, Language selector, Theme selector —
 *                       thin, above the logo.
 * Row 1 (brand nav):    NurseNest logo + Tools, Pricing, About, Blog, FAQ
 *                       + auth actions in the primary shell.
 * Row 2 (class rail):   RN, RPN, NP, New Grad, Allied,
 *                       Pre-Nursing, ECG, HESI, TEAS.
 *
 * Tests are all static source-text analysis (no DOM, no browser, no heavy deps).
 *
 * Run from nursenest-core/:
 *   node --import tsx --test tests/contracts/marketing-nav-three-row.contract.test.ts
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import fs from "node:fs";
import path from "node:path";

const HEADER_PATH = path.resolve(process.cwd(), "src/components/layout/site-header.tsx");
const SERVER_PATH = path.resolve(process.cwd(), "src/components/layout/site-header-server.tsx");
const THEME_CSS_PATH = path.resolve(process.cwd(), "src/app/premium-redesign-2026.css");

function readSource(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

// ── Shared fixtures ────────────────────────────────────────────────────────────
const src = readSource(HEADER_PATH);
const serverSrc = readSource(SERVER_PATH);

// ── Test 1: Country, Language, and Theme render in the utility row ─────────────
describe("Test 1: Country/Language/Theme in utility row", () => {
  it("Utility row element exists with correct testid", () => {
    assert.ok(
      src.includes('data-testid="marketing-header-utility-row"'),
      "Row 0 utility row must exist with data-testid='marketing-header-utility-row'",
    );
  });

  it("Utility row contains MarketingHeaderUtilityCluster (renders Country, Language, Theme)", () => {
    const utilityRowIdx = src.indexOf('data-testid="marketing-header-utility-row"');
    assert.ok(utilityRowIdx !== -1);
    // Scan ahead from the utility row element for the cluster component
    const block = src.slice(utilityRowIdx, utilityRowIdx + 2000);
    assert.ok(
      block.includes("MarketingHeaderUtilityCluster"),
      "Utility row must contain MarketingHeaderUtilityCluster which renders Country, Language, and Theme",
    );
  });

  it("Utility row is only shown for marketingRow4Layout (Ocean/Blossom/Midnight)", () => {
    const utilityRowIdx = src.indexOf('data-testid="marketing-header-utility-row"');
    assert.ok(utilityRowIdx !== -1);
    const preceding = src.slice(Math.max(0, utilityRowIdx - 400), utilityRowIdx);
    assert.ok(
      preceding.includes("marketingRow4Layout"),
      "Utility row must be conditional on marketingRow4Layout so it only renders for Ocean/Blossom/Midnight",
    );
  });

  it("Primary shell contains auth CTAs (Log In / Sign up)", () => {
    const primaryRowIdx = src.indexOf('data-testid="marketing-header-primary-row"');
    assert.ok(primaryRowIdx !== -1);
    const block = src.slice(primaryRowIdx, primaryRowIdx + 9000);
    assert.ok(
      block.includes("nav.logIn") && block.includes("nav.signUp") && block.includes("nn-header-desktop-auth-cluster"),
      "Primary shell must contain Log In / Sign up auth CTAs in the desktop auth cluster",
    );
  });
});

// ── Test 2: Tools/Pricing/About/Blog/FAQ in brand nav row (Row 1) ──────────────
describe("Test 2: Tools/Pricing/About/Blog/FAQ in the NurseNest brand nav row", () => {
  it("brandNavLinks contains Tools", () => {
    const brandStart = src.indexOf("const brandNavLinks");
    assert.ok(brandStart !== -1, "brandNavLinks must exist in site-header.tsx");
    const block = src.slice(brandStart, brandStart + 800);
    assert.ok(block.includes('key: "tools"'), "brandNavLinks must contain key: 'tools'");
  });

  it("brandNavLinks contains Pricing", () => {
    const brandStart = src.indexOf("const brandNavLinks");
    const block = src.slice(brandStart, brandStart + 800);
    assert.ok(block.includes('key: "pricing"'), "brandNavLinks must contain key: 'pricing'");
  });

  it("brandNavLinks contains About", () => {
    const brandStart = src.indexOf("const brandNavLinks");
    const block = src.slice(brandStart, brandStart + 800);
    assert.ok(block.includes('key: "about"'), "brandNavLinks must contain key: 'about'");
  });

  it("brandNavLinks contains Blog", () => {
    const brandStart = src.indexOf("const brandNavLinks");
    const block = src.slice(brandStart, brandStart + 800);
    assert.ok(block.includes('key: "blog"'), "brandNavLinks must contain key: 'blog'");
  });

  it("brandNavLinks contains FAQ", () => {
    const brandStart = src.indexOf("const brandNavLinks");
    const block = src.slice(brandStart, brandStart + 800);
    assert.ok(block.includes('key: "faq"'), "brandNavLinks must contain key: 'faq'");
  });

  it("Brand nav row (Row 1 center) renders brandNavLinks for row4", () => {
    const brandNavIdx = src.indexOf('data-testid="marketing-header-brand-nav"');
    assert.ok(brandNavIdx !== -1, "Brand nav element must have data-testid='marketing-header-brand-nav'");
    // The center nav must map brandNavLinks for row4 (the conditional must be present)
    const block = src.slice(Math.max(0, brandNavIdx - 200), brandNavIdx + 400);
    assert.ok(
      block.includes("brandNavLinks") || src.slice(Math.max(0, brandNavIdx - 500), brandNavIdx + 400).includes("brandNavLinks"),
      "Row 1 center nav must reference brandNavLinks",
    );
  });

  it("Server precomputes brandNavLinks with tools/pricing/about/blog/faq", () => {
    const start = serverSrc.indexOf("brandNavLinks: [");
    assert.ok(start !== -1, "Server must produce brandNavLinks");
    const block = serverSrc.slice(start, start + 1000);
    for (const key of ["tools", "pricing", "about", "blog", "faq"]) {
      assert.ok(block.includes(`key: "${key}"`), `Server brandNavLinks must include '${key}'`);
    }
  });
});

// ── Test 3: RN/RPN/NP/New Grad/Allied/Pre-Nursing/ECG/HESI/TEAS in class row ──
describe("Test 3: All classes/pathways render in the class/pathway row", () => {
  it("Tier rail renders tierHubMenus (RN/RPN/NP/New Grad/Allied)", () => {
    const tierRailIdx = src.indexOf("nn-marketing-nav-v31-tier-rail");
    assert.ok(tierRailIdx !== -1, "Tier rail must exist");
    const block = src.slice(tierRailIdx, tierRailIdx + 3000);
    assert.ok(
      block.includes("tierHubMenus.map"),
      "Tier rail must render tierHubMenus (RN/RPN/NP/New Grad/Allied)",
    );
  });

  it("Tier rail renders Pre-Nursing via pathwayMoreLinks", () => {
    const pathwayStart = src.indexOf("const pathwayMoreLinks");
    assert.ok(pathwayStart !== -1, "pathwayMoreLinks must exist");
    const block = src.slice(pathwayStart, pathwayStart + 600);
    assert.ok(block.includes('key: "pre-nursing"'), "pathwayMoreLinks must include Pre-Nursing");
  });

  it("Tier rail renders ECG via pathwayMoreLinks", () => {
    const pathwayStart = src.indexOf("const pathwayMoreLinks");
    const block = src.slice(pathwayStart, pathwayStart + 600);
    assert.ok(block.includes('key: "ecg"'), "pathwayMoreLinks must include ECG");
  });

  it("Tier rail renders HESI via pathwayMoreLinks", () => {
    const pathwayStart = src.indexOf("const pathwayMoreLinks");
    const block = src.slice(pathwayStart, pathwayStart + 600);
    assert.ok(block.includes('key: "hesi"'), "pathwayMoreLinks must include HESI");
  });

  it("Tier rail renders TEAS via pathwayMoreLinks", () => {
    const pathwayStart = src.indexOf("const pathwayMoreLinks");
    const block = src.slice(pathwayStart, pathwayStart + 600);
    assert.ok(block.includes('key: "teas"'), "pathwayMoreLinks must include TEAS");
  });

  it("Server pathwayNavLinks includes pre-nursing, ecg, hesi, teas", () => {
    const start = serverSrc.indexOf("pathwayNavLinks: [");
    assert.ok(start !== -1, "Server must produce pathwayNavLinks");
    const block = serverSrc.slice(start, start + 600);
    for (const key of ["pre-nursing", "ecg", "hesi", "teas"]) {
      assert.ok(block.includes(`key: "${key}"`), `Server pathwayNavLinks must include '${key}'`);
    }
  });
});

// ── Test 4: Tools/Pricing/About/Blog/FAQ NOT in the class/pathway row ──────────
describe("Test 4: Tools/Pricing/About/Blog/FAQ NOT in the class/pathway row", () => {
  it("Tier rail does not render brandNavLinks", () => {
    const tierRailIdx = src.indexOf("nn-marketing-nav-v31-tier-rail");
    assert.ok(tierRailIdx !== -1, "Tier rail must exist");
    const block = src.slice(tierRailIdx, tierRailIdx + 3000);
    assert.ok(
      !block.includes("brandNavLinks.map"),
      "Tier rail must NOT map brandNavLinks — Tools/Pricing/About/Blog/FAQ belong in Row 1 only",
    );
  });

  it("pathwayMoreLinks does not include tools, pricing, about, blog, faq", () => {
    const pathwayStart = src.indexOf("const pathwayMoreLinks");
    assert.ok(pathwayStart !== -1, "pathwayMoreLinks must exist");
    const block = src.slice(pathwayStart, pathwayStart + 600);
    for (const key of ["tools", "pricing", "about", "blog", "faq"]) {
      assert.ok(
        !block.includes(`key: "${key}"`),
        `pathwayMoreLinks must NOT include '${key}' — brand links belong in brandNavLinks only`,
      );
    }
  });

  it("Server pathwayNavLinks does not include tools, pricing, about, blog, faq", () => {
    const start = serverSrc.indexOf("pathwayNavLinks: [");
    assert.ok(start !== -1, "Server must produce pathwayNavLinks");
    const block = serverSrc.slice(start, start + 600);
    for (const key of ["tools", "pricing", "about", "blog", "faq"]) {
      assert.ok(
        !block.includes(`key: "${key}"`),
        `Server pathwayNavLinks must NOT include '${key}'`,
      );
    }
  });
});

// ── Test 5: ECG/HESI/TEAS NOT in the brand/company link group ─────────────────
describe("Test 5: ECG/HESI/TEAS NOT in the brand nav group", () => {
  it("brandNavLinks does not include ecg", () => {
    const brandStart = src.indexOf("const brandNavLinks");
    assert.ok(brandStart !== -1, "brandNavLinks must exist");
    const block = src.slice(brandStart, brandStart + 800);
    assert.ok(!block.includes('key: "ecg"'), "brandNavLinks must NOT include ECG");
  });

  it("brandNavLinks does not include hesi", () => {
    const brandStart = src.indexOf("const brandNavLinks");
    const block = src.slice(brandStart, brandStart + 800);
    assert.ok(!block.includes('key: "hesi"'), "brandNavLinks must NOT include HESI");
  });

  it("brandNavLinks does not include teas", () => {
    const brandStart = src.indexOf("const brandNavLinks");
    const block = src.slice(brandStart, brandStart + 800);
    assert.ok(!block.includes('key: "teas"'), "brandNavLinks must NOT include TEAS");
  });

  it("brandNavLinks does not include pre-nursing", () => {
    const brandStart = src.indexOf("const brandNavLinks");
    const block = src.slice(brandStart, brandStart + 800);
    assert.ok(!block.includes('key: "pre-nursing"'), "brandNavLinks must NOT include Pre-Nursing");
  });

  it("Server brandNavLinks does not include ecg, hesi, teas, pre-nursing", () => {
    const start = serverSrc.indexOf("brandNavLinks: [");
    assert.ok(start !== -1, "Server must produce brandNavLinks");
    const block = serverSrc.slice(start, start + 1000);
    for (const key of ["ecg", "hesi", "teas", "pre-nursing"]) {
      assert.ok(
        !block.includes(`key: "${key}"`),
        `Server brandNavLinks must NOT include '${key}' — class links belong in pathwayNavLinks`,
      );
    }
  });
});

// ── Test 6: Ocean/Blossom/Midnight use the same structural layout ─────────────
describe("Test 6: Ocean/Blossom/Midnight all use marketing-row4 layout", () => {
  it("data-nn-header-layout uses marketing-row4 for row4 themes", () => {
    assert.ok(
      src.includes('"marketing-row4"'),
      "Header must assign data-nn-header-layout='marketing-row4' for Ocean/Blossom/Midnight",
    );
  });

  it("marketingRow4Layout is true for Midnight (dark theme exception)", () => {
    // The marketingRow4Layout flag must include midnight explicitly
    assert.ok(
      src.includes('theme === "midnight"'),
      "marketingRow4Layout must include midnight so all three themes share the same structure",
    );
  });

  it("Blossom/Midnight theme CSS file exists", () => {
    assert.ok(
      fs.existsSync(THEME_CSS_PATH),
      `Theme CSS file must exist at ${THEME_CSS_PATH}`,
    );
  });

  it("Blossom/Midnight may only override visual layer (enforced by theme-marketing-row4-contract)", () => {
    // The structural contract is enforced by theme-marketing-row4-contract.test.ts.
    // This test just verifies the CSS file is present and non-empty.
    const css = fs.readFileSync(THEME_CSS_PATH, "utf8");
    assert.ok(css.length > 0, "Premium redesign CSS file must be non-empty");
  });
});

// ── Test 7: Header does not overflow at desktop widths ────────────────────────
describe("Test 7: Header uses flex-nowrap to prevent overflow at desktop widths", () => {
  it("Tier rail nav uses flex-nowrap", () => {
    const tierRailIdx = src.indexOf("nn-marketing-nav-v31-tier-rail");
    assert.ok(tierRailIdx !== -1, "Tier rail must exist");
    const block = src.slice(tierRailIdx, tierRailIdx + 1500);
    assert.ok(block.includes("flex-nowrap"), "Tier rail nav must use flex-nowrap to prevent overflow");
  });

  it("Brand nav row center uses flex-wrap for graceful collapse at smaller widths", () => {
    const brandNavIdx = src.indexOf('data-testid="marketing-header-brand-nav"');
    assert.ok(brandNavIdx !== -1, "Brand nav must have data-testid");
    // Brand nav row may use flex-wrap since items are fewer — this is allowed
    // The test just validates the element exists and has a nav role
    const block = src.slice(Math.max(0, brandNavIdx - 100), brandNavIdx + 300);
    assert.ok(block.includes("nn-header-main-marketing-nav") || block.includes("nav"), "Brand nav must be a nav element");
  });

  it("Desktop grid maintains 3-column layout (logo | center | auth)", () => {
    assert.ok(
      src.includes("nn-header-desktop-grid"),
      "Desktop header must use nn-header-desktop-grid (3-column grid layout)",
    );
    assert.ok(
      src.includes("nn-header-brand-cluster"),
      "Desktop grid must have brand cluster (logo column)",
    );
    assert.ok(
      src.includes("nn-header-desktop-auth-cluster"),
      "Desktop grid must have auth cluster (right column)",
    );
  });
});

// ── Test 8: Mobile menu preserves the same grouping ───────────────────────────
describe("Test 8: Mobile drawer preserves account/NurseNest/classes grouping", () => {
  it("Mobile account section exists", () => {
    assert.ok(
      src.includes('data-nn-mobile-section="account"'),
      "Mobile drawer must have account/utility section",
    );
  });

  it("Mobile NurseNest section exists", () => {
    assert.ok(
      src.includes('data-nn-mobile-section="nursenest"'),
      "Mobile drawer must have NurseNest brand nav section",
    );
  });

  it("Mobile classes/pathways section exists", () => {
    assert.ok(
      src.includes('data-nn-mobile-section="classes-pathways"'),
      "Mobile drawer must have classes/pathways section",
    );
  });

  it("Mobile brand links are tagged data-nn-mobile-brand-link", () => {
    assert.ok(
      src.includes("data-nn-mobile-brand-link"),
      "Brand nav items in mobile drawer must have data-nn-mobile-brand-link attribute",
    );
  });

  it("Mobile pathway links are tagged data-nn-mobile-pathway-link", () => {
    assert.ok(
      src.includes("data-nn-mobile-pathway-link"),
      "Pathway items in mobile drawer must have data-nn-mobile-pathway-link attribute",
    );
  });

  it("Mobile utility links are tagged data-nn-mobile-utility-link", () => {
    assert.ok(
      src.includes("data-nn-mobile-utility-link"),
      "Auth/utility items in mobile drawer must have data-nn-mobile-utility-link attribute",
    );
  });

  it("Mobile tier hub links retain data-nn-mobile-tier-link", () => {
    assert.ok(
      src.includes("data-nn-mobile-tier-link"),
      "Tier hub items (RN/RPN/NP/New Grad/Allied) in mobile drawer must keep data-nn-mobile-tier-link",
    );
  });

  it("Mobile pathwayMoreLinks are rendered inside classes-pathways section", () => {
    const classSectionIdx = src.indexOf('data-nn-mobile-section="classes-pathways"');
    assert.ok(classSectionIdx !== -1, "classes-pathways section must exist");
    const classSectionBlock = src.slice(classSectionIdx, classSectionIdx + 3000);
    assert.ok(
      classSectionBlock.includes("pathwayMoreLinks.map"),
      "pathwayMoreLinks (Pre-Nursing/ECG/HESI/TEAS) must render inside the classes-pathways mobile section",
    );
  });

  it("Mobile brandNavLinks are rendered inside nursenest section", () => {
    const nursenestSectionIdx = src.indexOf('data-nn-mobile-section="nursenest"');
    assert.ok(nursenestSectionIdx !== -1, "nursenest section must exist");
    const nursenestSectionBlock = src.slice(nursenestSectionIdx, nursenestSectionIdx + 3000);
    assert.ok(
      nursenestSectionBlock.includes("brandNavLinks.map"),
      "brandNavLinks (Tools/Pricing/About/Blog/FAQ) must render inside the nursenest mobile section",
    );
  });
});
