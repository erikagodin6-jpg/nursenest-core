/**
 * === MARKETING HEADER THREE-ROW CONTRACT ===
 *
 * Guards the 3-row desktop marketing header structure:
 *   Row 0 (utility):      Country + Language + Theme + compact auth CTAs
 *   Row 1 (brand nav):    NurseNest logo + Tools / Pricing / About / Blog / FAQ
 *   Row 2 (class rail):   RN / RPN / NP / New Grad / Allied + Pre-Nursing / ECG / HESI / TEAS
 *
 * Strategy: static source-text analysis of site-header.tsx and site-header-server.tsx.
 * No browser, no DOM — fast and CI-friendly.
 *
 * Run from nursenest-core/:
 *   node --import tsx --test tests/contracts/marketing-nav-unified-row.contract.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import fs from "node:fs";
import path from "node:path";

const HEADER_PATH = path.resolve(process.cwd(), "src/components/layout/site-header.tsx");
const SERVER_PATH = path.resolve(process.cwd(), "src/components/layout/site-header-server.tsx");

function readSource(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

describe("marketing-nav-three-row contract", () => {
  const src = readSource(HEADER_PATH);
  const serverSrc = readSource(SERVER_PATH);

  // ── 1. Utility row exists and contains utility cluster ───────────────────
  it("Utility row (Row 0) has data-testid=marketing-header-utility-row", () => {
    assert.ok(
      src.includes('data-testid="marketing-header-utility-row"'),
      "Header must have a utility row with data-testid for E2E targeting",
    );
  });

  it("Utility row renders MarketingHeaderUtilityCluster with row4 chromeMode", () => {
    const utilityRowIdx = src.indexOf('data-testid="marketing-header-utility-row"');
    assert.ok(utilityRowIdx !== -1, "Utility row must exist");
    const utilityRowBlock = src.slice(utilityRowIdx, utilityRowIdx + 2000);
    assert.ok(
      utilityRowBlock.includes("MarketingHeaderUtilityCluster") && utilityRowBlock.includes('"row4"'),
      "Utility row must contain MarketingHeaderUtilityCluster with row4 chromeMode",
    );
  });

  // ── 2. Brand nav (Row 1) contains Tools/Pricing/About/Blog/FAQ ──────────
  it("Brand nav row (Row 1) has data-testid=marketing-header-brand-nav", () => {
    assert.ok(
      src.includes('data-testid="marketing-header-brand-nav"'),
      "Brand nav row must have data-testid for E2E targeting",
    );
  });

  it("brandNavLinks client fallback contains tools, pricing, about, blog, faq", () => {
    const brandNavStart = src.indexOf("const brandNavLinks");
    assert.ok(brandNavStart !== -1, "brandNavLinks useMemo must exist in site-header.tsx");
    const brandNavBlock = src.slice(brandNavStart, brandNavStart + 800);
    for (const key of ["tools", "pricing", "about", "blog", "faq"]) {
      assert.ok(
        brandNavBlock.includes(`key: "${key}"`),
        `brandNavLinks must include key: "${key}"`,
      );
    }
  });

  it("brandNavLinks client fallback does NOT contain pre-nursing, ecg, hesi, or teas", () => {
    const brandNavStart = src.indexOf("const brandNavLinks");
    assert.ok(brandNavStart !== -1, "brandNavLinks must exist");
    const brandNavBlock = src.slice(brandNavStart, brandNavStart + 800);
    for (const key of ["pre-nursing", "ecg", "hesi", "teas"]) {
      assert.ok(
        !brandNavBlock.includes(`key: "${key}"`),
        `brandNavLinks must NOT include key: "${key}" — class/pathway links belong in pathwayMoreLinks`,
      );
    }
  });

  it("Server brandNavLinks contains tools, pricing, about, blog, faq", () => {
    const brandNavStart = serverSrc.indexOf("brandNavLinks: [");
    assert.ok(brandNavStart !== -1, "Server must precompute brandNavLinks");
    const brandNavBlock = serverSrc.slice(brandNavStart, brandNavStart + 1000);
    for (const key of ["tools", "pricing", "about", "blog", "faq"]) {
      assert.ok(
        brandNavBlock.includes(`key: "${key}"`),
        `Server brandNavLinks must include key: "${key}"`,
      );
    }
  });

  // ── 3. Class/pathway row (Row 2) contains pathway links ──────────────────
  it("Class/pathway row has data-nn-header-row=class-pathway", () => {
    const tierRailIdx = src.indexOf("nn-marketing-nav-v31-tier-rail");
    assert.ok(tierRailIdx !== -1, "Tier rail must exist");
    const tierRailBlock = src.slice(tierRailIdx, tierRailIdx + 200);
    assert.ok(
      tierRailBlock.includes('data-nn-header-row="class-pathway"'),
      "Tier rail must be labelled as the class/pathway row",
    );
  });

  it("Tier rail renders tierHubMenus.map (RN/RPN/NP/New Grad/Allied)", () => {
    const tierRailIndex = src.indexOf("nn-marketing-nav-v31-tier-rail");
    assert.ok(tierRailIndex !== -1, "Tier rail element must exist");
    const tierRailBlock = src.slice(tierRailIndex, tierRailIndex + 3000);
    assert.ok(
      tierRailBlock.includes("tierHubMenus.map"),
      "Tier rail must render tier hub pathway chips (RN/RPN/NP/New Grad/Allied)",
    );
  });

  it("Tier rail renders pathwayMoreLinks.map (Pre-Nursing/ECG/HESI/TEAS)", () => {
    const tierRailIndex = src.indexOf("nn-marketing-nav-v31-tier-rail");
    assert.ok(tierRailIndex !== -1, "Tier rail element must exist");
    const tierRailBlock = src.slice(tierRailIndex, tierRailIndex + 3000);
    assert.ok(
      tierRailBlock.includes("pathwayMoreLinks.map"),
      "Tier rail must also render pathwayMoreLinks (Pre-Nursing/ECG/HESI/TEAS)",
    );
  });

  it("Tier rail does NOT render brandNavLinks (tools/pricing/about/blog/faq must not appear here)", () => {
    const tierRailIndex = src.indexOf("nn-marketing-nav-v31-tier-rail");
    assert.ok(tierRailIndex !== -1, "Tier rail must exist");
    const tierRailBlock = src.slice(tierRailIndex, tierRailIndex + 3000);
    assert.ok(
      !tierRailBlock.includes("brandNavLinks.map"),
      "Tier rail must NOT render brandNavLinks — brand links belong in the Row 1 center nav",
    );
  });

  // ── 4. pathwayMoreLinks contains ECG, Pre-Nursing, HESI, TEAS ───────────
  it("pathwayMoreLinks client fallback contains pre-nursing, ecg, hesi, teas", () => {
    const pathwayStart = src.indexOf("const pathwayMoreLinks");
    assert.ok(pathwayStart !== -1, "pathwayMoreLinks useMemo must exist");
    const pathwayBlock = src.slice(pathwayStart, pathwayStart + 600);
    for (const key of ["pre-nursing", "ecg", "hesi", "teas"]) {
      assert.ok(
        pathwayBlock.includes(`key: "${key}"`),
        `pathwayMoreLinks must include key: "${key}"`,
      );
    }
  });

  it("pathwayMoreLinks does NOT contain tools, pricing, about, blog, or faq", () => {
    const pathwayStart = src.indexOf("const pathwayMoreLinks");
    assert.ok(pathwayStart !== -1, "pathwayMoreLinks must exist");
    const pathwayBlock = src.slice(pathwayStart, pathwayStart + 600);
    for (const key of ["tools", "pricing", "about", "blog", "faq"]) {
      assert.ok(
        !pathwayBlock.includes(`key: "${key}"`),
        `pathwayMoreLinks must NOT include key: "${key}" — brand links belong in brandNavLinks`,
      );
    }
  });

  // ── 5. Server pathwayNavLinks contains ECG and HESI/TEAS ────────────────
  it("Server pathwayNavLinks contains pre-nursing, ecg, hesi, teas", () => {
    const pathwayStart = serverSrc.indexOf("pathwayNavLinks: [");
    assert.ok(pathwayStart !== -1, "Server must precompute pathwayNavLinks");
    const pathwayBlock = serverSrc.slice(pathwayStart, pathwayStart + 600);
    for (const key of ["pre-nursing", "ecg", "hesi", "teas"]) {
      assert.ok(
        pathwayBlock.includes(`key: "${key}"`),
        `Server pathwayNavLinks must include key: "${key}"`,
      );
    }
  });

  // ── 6. Unified nav uses flex-nowrap ─────────────────────────────────────
  it("Unified tier rail nav uses flex-nowrap to prevent wrapping into multiple rows", () => {
    const tierRailIndex = src.indexOf("nn-marketing-nav-v31-tier-rail");
    assert.ok(tierRailIndex !== -1, "Tier rail element must exist");
    const tierRailBlock = src.slice(tierRailIndex, tierRailIndex + 1500);
    assert.ok(
      tierRailBlock.includes("flex-nowrap"),
      "Unified nav must use flex-nowrap — flex-wrap would allow 3rd-row regression",
    );
  });

  // ── 7. Utility row is gated to marketingRow4Layout ──────────────────────
  it("Utility row is only rendered for marketingRow4Layout (Ocean/Blossom/Midnight)", () => {
    const utilityRowIdx = src.indexOf('data-testid="marketing-header-utility-row"');
    assert.ok(utilityRowIdx !== -1, "Utility row must exist");
    const preceding = src.slice(Math.max(0, utilityRowIdx - 300), utilityRowIdx);
    assert.ok(
      preceding.includes("marketingRow4Layout"),
      "Utility row must be conditional on marketingRow4Layout (Ocean/Blossom/Midnight)",
    );
  });

  // ── 8. Mobile drawer section grouping ────────────────────────────────────
  it("Mobile drawer has account section (data-nn-mobile-section=account)", () => {
    assert.ok(
      src.includes('data-nn-mobile-section="account"'),
      "Mobile drawer must have an account/utility section",
    );
  });

  it("Mobile drawer has nursenest brand section (data-nn-mobile-section=nursenest)", () => {
    assert.ok(
      src.includes('data-nn-mobile-section="nursenest"'),
      "Mobile drawer must have a NurseNest brand nav section",
    );
  });

  it("Mobile drawer has classes/pathways section (data-nn-mobile-section=classes-pathways)", () => {
    assert.ok(
      src.includes('data-nn-mobile-section="classes-pathways"'),
      "Mobile drawer must have a classes/pathways section",
    );
  });

  it("Mobile brand links use data-nn-mobile-brand-link attribute", () => {
    assert.ok(
      src.includes("data-nn-mobile-brand-link"),
      "Brand links in mobile drawer must be tagged data-nn-mobile-brand-link",
    );
  });

  it("Mobile pathway links use data-nn-mobile-pathway-link attribute", () => {
    assert.ok(
      src.includes("data-nn-mobile-pathway-link"),
      "Pathway links in mobile drawer must be tagged data-nn-mobile-pathway-link",
    );
  });

  // ── 9. Primary row data-testid for E2E addressability ───────────────────
  it("Primary row has data-testid=marketing-header-primary-row for E2E addressability", () => {
    assert.ok(
      src.includes('data-testid="marketing-header-primary-row"'),
      "Primary (brand nav) row must have data-testid for E2E test targeting",
    );
  });

  it("Tier rail has data-testid=marketing-header-unified-nav for E2E addressability", () => {
    assert.ok(
      src.includes('data-testid="marketing-header-unified-nav"'),
      "Tier (class/pathway) rail must have data-testid for E2E test targeting",
    );
  });
});
