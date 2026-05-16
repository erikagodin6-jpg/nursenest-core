/**
 * === MARKETING HEADER UNIFIED NAV CONTRACT ===
 *
 * Asserts that the marketing header renders all main nav items in a single row
 * (the tier rail / Row 2), not split across the Bar A utility band + desktop
 * grid center nav + tier rail.
 *
 * Regression guard: if the nav regresses to 3 rows this test fails.
 *
 * Strategy: static source-text analysis of site-header.tsx (no browser, no DOM).
 *   1. Bar A (nn-marketing-nav-v31-bar-a) must NOT contain a <nav> or nav links.
 *   2. Desktop grid center nav must be absent/spacer for row4.
 *   3. Unified tier rail nav must render BOTH tierHubMenus items AND
 *      marketingMoreLinks items.
 *   4. Tier rail nav must use flex-nowrap (no flex-wrap class).
 *   5. ECG link (/ecg-interpretation) must appear in moreLinks.
 *   6. Server precomputed moreLinks (site-header-server.tsx) must include ECG
 *      and match the desired canonical order.
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

describe("marketing-nav-unified-row contract", () => {
  const src = readSource(HEADER_PATH);
  const serverSrc = readSource(SERVER_PATH);

  // ── 1. Bar A must not contain navigation links ────────────────────────────
  it("Bar A block does not render a <nav> element or tier/more-link items", () => {
    // The nn-marketing-nav-v31-bar-a className must not appear alongside nav item rendering
    const barAIndex = src.indexOf("nn-marketing-nav-v31-bar-a");
    // Bar A may still exist as a comment or removed entirely; it must not render nav links
    if (barAIndex !== -1) {
      // Find the opening block around the Bar A className
      const barABlock = src.slice(Math.max(0, barAIndex - 200), barAIndex + 600);
      assert.ok(
        !barABlock.includes("tierHubMenus.map") && !barABlock.includes("marketingMoreLinks.map"),
        "Bar A block must not render tier hub or more-link items — nav must live in the unified tier rail",
      );
    }
    // If Bar A is completely absent (removed), that's fine too
  });

  // ── 2. Desktop grid center nav is guarded by !marketingRow4Layout ──────────
  it("Desktop grid center <nav> is only rendered for non-row4 dark themes", () => {
    // The marketingMoreLinks.map inside the desktop grid should be guarded
    // The pattern is: spacer div for row4, nav for non-row4
    assert.ok(
      src.includes("marketingRow4Layout ? (") && src.includes("<div aria-hidden"),
      "Desktop grid must render a spacer div for row4 instead of the center nav",
    );
  });

  // ── 3. Unified tier rail renders both tier hub items AND more links ────────
  it("Tier rail nav renders tierHubMenus.map AND marketingMoreLinks.map", () => {
    const tierRailIndex = src.indexOf("nn-marketing-nav-v31-tier-rail");
    assert.ok(tierRailIndex !== -1, "Tier rail element must exist");
    const tierRailBlock = src.slice(tierRailIndex, tierRailIndex + 3000);
    assert.ok(
      tierRailBlock.includes("tierHubMenus.map"),
      "Tier rail must render tier hub pathway chips (RN/RPN/NP/New Grad/Allied)",
    );
    assert.ok(
      tierRailBlock.includes("marketingMoreLinks.map"),
      "Tier rail must also render marketingMoreLinks (Pre-Nursing/ECG/Tools/Pricing/About/Blog/FAQ)",
    );
  });

  // ── 4. Unified nav uses flex-nowrap ───────────────────────────────────────
  it("Unified tier rail nav uses flex-nowrap to prevent wrapping into multiple rows", () => {
    const tierRailIndex = src.indexOf("nn-marketing-nav-v31-tier-rail");
    assert.ok(tierRailIndex !== -1, "Tier rail element must exist");
    const tierRailBlock = src.slice(tierRailIndex, tierRailIndex + 1500);
    assert.ok(
      tierRailBlock.includes("flex-nowrap"),
      "Unified nav must use flex-nowrap — flex-wrap would allow 3rd-row regression",
    );
    // Ensure the outer tier-inner div does NOT have flex-wrap
    const tierInnerMatch = tierRailBlock.match(/nn-marketing-nav-v31-tier-inner[^"]*"/);
    if (tierInnerMatch) {
      assert.ok(
        !tierInnerMatch[0].includes("flex-wrap"),
        "Tier inner container must not use flex-wrap",
      );
    }
  });

  // ── 5. ECG link present in client fallback moreLinks ─────────────────────
  it("Client fallback marketingMoreLinks includes ECG link to /ecg-interpretation", () => {
    assert.ok(
      src.includes('key: "ecg"') && src.includes('href: "/ecg-interpretation"'),
      "Client fallback moreLinks must include ECG item linking to /ecg-interpretation",
    );
  });

  // ── 6. Server precomputed moreLinks includes ECG and correct order ────────
  it("Server precomputed moreLinks includes ECG before Pricing", () => {
    assert.ok(
      serverSrc.includes('key: "ecg"') && serverSrc.includes('"/ecg-interpretation"'),
      "Server precomputed moreLinks must include ECG item linking to /ecg-interpretation",
    );
    const ecgPos = serverSrc.indexOf('"ecg"');
    const pricingPos = serverSrc.indexOf('"pricing"');
    assert.ok(ecgPos !== -1 && pricingPos !== -1, "Both ECG and pricing keys must be present");
    assert.ok(
      ecgPos < pricingPos,
      "ECG must appear before Pricing in server moreLinks (canonical nav order)",
    );
  });

  // ── 7. Pre-Nursing appears before ECG in both client and server ───────────
  it("Pre-Nursing appears before ECG in both client and server moreLinks", () => {
    // Client fallback
    const clientPreNursingPos = src.indexOf('"pre-nursing"');
    const clientEcgPos = src.indexOf('"ecg"');
    assert.ok(
      clientPreNursingPos !== -1 && clientEcgPos !== -1,
      "Both pre-nursing and ecg keys must appear in client fallback",
    );
    assert.ok(
      clientPreNursingPos < clientEcgPos,
      "Pre-Nursing must appear before ECG in client fallback (canonical nav order)",
    );
    // Server precomputed
    const serverPreNursingPos = serverSrc.indexOf('"pre-nursing"');
    const serverEcgPos = serverSrc.indexOf('"ecg"');
    assert.ok(
      serverPreNursingPos < serverEcgPos,
      "Pre-Nursing must appear before ECG in server precomputed moreLinks",
    );
  });

  // ── 8. Utility cluster always rendered in auth cluster ────────────────────
  it("MarketingHeaderUtilityCluster is always rendered in the desktop auth cluster (no !marketingRow4Layout gate)", () => {
    // Old pattern was: {!marketingRow4Layout ? <UtilityCluster> : null}
    // New pattern: always rendered with conditional chromeMode
    assert.ok(
      !src.includes("!marketingRow4Layout ? (\n                <div\n                  data-testid=\"marketing-header-utility-inline\""),
      "Utility cluster must not be gated behind !marketingRow4Layout in the auth cluster",
    );
    // Confirm the chromeMode is now conditional (not hardcoded to dark-marketing)
    assert.ok(
      src.includes('chromeMode={marketingRow4Layout ? "row4" : "dark-marketing"}'),
      "Auth cluster utility chromeMode must be conditional on marketingRow4Layout",
    );
  });

  // ── 9. data-testid for unified nav exists ─────────────────────────────────
  it("Tier rail has data-testid=marketing-header-unified-nav for E2E addressability", () => {
    assert.ok(
      src.includes('data-testid="marketing-header-unified-nav"'),
      "Unified nav rail must have data-testid for E2E test targeting",
    );
  });
});
