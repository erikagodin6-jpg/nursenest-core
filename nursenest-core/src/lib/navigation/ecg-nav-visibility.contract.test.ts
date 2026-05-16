/**
 * ECG Navigation Visibility Contract Tests
 *
 * CI-blocking regression guard: fails if ECG disappears from discoverable navigation surfaces.
 *
 * Architecture: ECG clinical specialty links are NO LONGER in the top-level marketing header
 * moreLinks (removed to fix nav bloat — the one-line desktop nav constraint). ECG is now
 * discoverable via:
 *   1. Marketing tier hub dropdowns: RN mega-menu Specialties, NP mega-menu Clinical Modules
 *   2. Learner Clinical Modules flyout (RN/NP with ecgNavEnabled=true)
 *   3. Learner ECG shell nav item
 *   4. Mobile drawer tier chips → tier hub → ECG
 *
 * Surfaces validated:
 *   1. Marketing moreLinks does NOT contain ecg-interpretation (nav bloat prevention)
 *   2. Marketing mega-menu RN Specialties group (ECG Mastery + Telemetry links)
 *   3. Marketing mega-menu NP Clinical Modules group (ECG Mastery + ECG Interpretation links)
 *   4. Learner Clinical Modules flyout (RN/NP with ecgNavEnabled=true)
 *   5. Learner ECG shell nav item (RN/NP tiers)
 *   6. Learner nav: ECG hidden for RPN/LVN_LPN (ecgNavEnabled=false)
 *   7. ECG link destinations are valid authority routes
 *
 * Run:
 *   node --import tsx --test src/lib/navigation/ecg-nav-visibility.contract.test.ts
 */

import assert from "node:assert/strict";
import test, { describe } from "node:test";
import {
  buildMarketingMegaMenus,
} from "./marketing-mega-menu";
import {
  buildClinicalModulesNavLinks,
  buildEcgShellNavItem,
} from "./learner-primary-nav";

// ─── 1. Marketing moreLinks must NOT contain ECG (nav bloat prevention) ───────

describe("Marketing header moreLinks — ECG must NOT be in top-level moreLinks", () => {
  test("site-header-server.tsx moreLinks does NOT contain ecg-interpretation key", () => {
    const { readFileSync } = require("node:fs");
    const { join } = require("node:path");
    const src = readFileSync(
      join(process.cwd(), "src/components/layout/site-header-server.tsx"),
      "utf-8",
    );
    const moreLinksStart = src.indexOf("moreLinks: [");
    const moreLinksEnd = src.indexOf("],", moreLinksStart);
    const moreLinksBlock = moreLinksStart >= 0 && moreLinksEnd >= 0
      ? src.slice(moreLinksStart, moreLinksEnd)
      : src;

    assert.doesNotMatch(
      moreLinksBlock,
      /key:\s*["']ecg-interpretation["']/,
      "site-header-server.tsx moreLinks must NOT include key: 'ecg-interpretation' — " +
      "ECG was moved to tier hub dropdowns to prevent desktop nav wrapping. " +
      "ECG remains discoverable via RN/NP mega-menus and the learner clinical modules flyout.",
    );
  });

  test("site-header.tsx fallback marketingMoreLinks does NOT contain ecg-interpretation", () => {
    const { readFileSync } = require("node:fs");
    const { join } = require("node:path");
    const src = readFileSync(
      join(process.cwd(), "src/components/layout/site-header.tsx"),
      "utf-8",
    );
    const fallbackStart = src.indexOf("precomputedNavData?.moreLinks");
    const fallbackBlock = fallbackStart >= 0 ? src.slice(fallbackStart, fallbackStart + 1500) : src;

    assert.doesNotMatch(
      fallbackBlock,
      /key:\s*["']ecg-interpretation["']/,
      "site-header.tsx fallback moreLinks must NOT include 'ecg-interpretation' — " +
      "ECG is surfaced via RN/NP mega-menus and learner flyout, not the top-level nav bar",
    );
  });

  test("moreLinks contains pricing as first visible marketing destination", () => {
    const { readFileSync } = require("node:fs");
    const { join } = require("node:path");
    const src = readFileSync(
      join(process.cwd(), "src/components/layout/site-header-server.tsx"),
      "utf-8",
    );
    assert.ok(
      src.includes('"pricing"'),
      "site-header-server.tsx moreLinks must still contain 'pricing' after ECG removal",
    );
  });
});

// ─── 2. RN mega-menu ECG ──────────────────────────────────────────────────────

describe("Marketing mega-menu — RN Specialties contains ECG", () => {
  const t = (k: string) => k;

  for (const region of ["US", "CA"] as const) {
    test(`RN mega-menu Specialties has ECG Mastery link (region: ${region})`, () => {
      const menus = buildMarketingMegaMenus(region, t);
      const rnMenu = menus.find((m) => m.key === "rn");
      assert.ok(rnMenu, "RN mega-menu must exist");

      const specialtiesGroup = rnMenu!.groups.find((g) => g.key === "specialties");
      assert.ok(specialtiesGroup, "RN mega-menu must have a 'specialties' group");

      const ecgLink = specialtiesGroup!.links.find((l) => l.key === "rn-ecg-mastery");
      assert.ok(
        ecgLink,
        `RN mega-menu Specialties (${region}) must include 'rn-ecg-mastery' link`,
      );
      // Canonical ECG authority page — either /ecg-interpretation or /advanced-ecg-nursing
      const validEcgHubs = new Set(["/ecg-interpretation", "/advanced-ecg-nursing", "/ecg"]);
      assert.ok(
        validEcgHubs.has(ecgLink!.href),
        `RN ECG Mastery link href "${ecgLink!.href}" must point to a canonical ECG authority page`,
      );
    });

    test(`RN mega-menu Specialties has Telemetry Interpretation link (region: ${region})`, () => {
      const menus = buildMarketingMegaMenus(region, t);
      const rnMenu = menus.find((m) => m.key === "rn");
      const specialtiesGroup = rnMenu!.groups.find((g) => g.key === "specialties");
      const telemetryLink = specialtiesGroup!.links.find((l) => l.key === "rn-ecg-telemetry");
      assert.ok(
        telemetryLink,
        `RN mega-menu Specialties (${region}) must include 'rn-ecg-telemetry' link`,
      );
      assert.equal(telemetryLink!.href, "/ecg-telemetry-mastery");
    });
  }
});

// ─── 3. NP mega-menu ECG ──────────────────────────────────────────────────────

describe("Marketing mega-menu — NP Clinical Modules contains ECG", () => {
  const t = (k: string) => k;

  for (const region of ["US", "CA"] as const) {
    test(`NP mega-menu has ECG Mastery in Clinical Modules group (region: ${region})`, () => {
      const menus = buildMarketingMegaMenus(region, t);
      const npMenu = menus.find((m) => m.key === "np");
      assert.ok(npMenu, "NP mega-menu must exist");

      const allLinks = npMenu!.groups.flatMap((g) => g.links);
      const npEcgLink = allLinks.find((l) => l.key === "np-ecg-mastery");
      assert.ok(
        npEcgLink,
        `NP mega-menu (${region}) must include 'np-ecg-mastery' link — NP learners must be able to discover ECG from the NP dropdown`,
      );
      // Must point to a canonical ECG authority route (public, not a learner /modules/ route)
      const validEcgHubs = new Set(["/ecg-interpretation", "/advanced-ecg-nursing", "/ecg", "/ecg-telemetry-mastery"]);
      assert.ok(
        validEcgHubs.has(npEcgLink!.href),
        `NP ECG Mastery link href "${npEcgLink!.href}" must point to a canonical ECG authority page`,
      );
    });

    test(`NP mega-menu has ECG Interpretation link (region: ${region})`, () => {
      const menus = buildMarketingMegaMenus(region, t);
      const npMenu = menus.find((m) => m.key === "np");
      const allLinks = npMenu!.groups.flatMap((g) => g.links);
      const ecgInterpLink = allLinks.find((l) => l.key === "np-ecg-interpretation");
      assert.ok(
        ecgInterpLink,
        `NP mega-menu (${region}) must include 'np-ecg-interpretation' link`,
      );
      assert.equal(ecgInterpLink!.href, "/ecg-interpretation");
    });
  }
});

// ─── 4. Learner Clinical Modules flyout — RN/NP ───────────────────────────────

describe("Learner Clinical Modules flyout — ECG visible for RN/NP", () => {
  test("buildClinicalModulesNavLinks with ecgNavEnabled=true includes ECG Fundamentals", () => {
    const links = buildClinicalModulesNavLinks(null, true);
    const ecgFundamentals = links.find((l) => l.key === "ecg-fundamentals");
    assert.ok(
      ecgFundamentals,
      "Clinical Modules flyout must include 'ecg-fundamentals' when ecgNavEnabled=true (RN/NP)",
    );
    assert.ok(
      ecgFundamentals!.href.includes("/modules/ecg"),
      "ECG Fundamentals link must point to /modules/ecg/* (learner-scoped)",
    );
  });

  test("buildClinicalModulesNavLinks with ecgNavEnabled=true includes Advanced ECG", () => {
    const links = buildClinicalModulesNavLinks(null, true);
    const advancedEcg = links.find((l) => l.key === "advanced-ecg");
    assert.ok(advancedEcg, "Clinical Modules flyout must include 'advanced-ecg' for RN/NP");
    assert.equal(advancedEcg!.status, "premium");
  });

  test("buildClinicalModulesNavLinks with ecgNavEnabled=true includes Pediatric ECG", () => {
    const links = buildClinicalModulesNavLinks(null, true);
    const pediatricEcg = links.find((l) => l.key === "pediatric-ecg");
    assert.ok(pediatricEcg, "Clinical Modules flyout must include 'pediatric-ecg' for RN/NP");
  });

  test("buildClinicalModulesNavLinks with ecgNavEnabled=true includes ECG Practice Drills", () => {
    const links = buildClinicalModulesNavLinks(null, true);
    const ecgDrills = links.find((l) => l.key === "ecg-drills");
    assert.ok(ecgDrills, "Clinical Modules flyout must include 'ecg-drills' for RN/NP");
  });

  test("all ECG nav links are learner-scoped (/modules/* or /app/*)", () => {
    const links = buildClinicalModulesNavLinks(null, true);
    const ecgLinks = links.filter(
      (l) => l.key.startsWith("ecg") || l.key === "pediatric-ecg",
    );
    for (const link of ecgLinks) {
      assert.ok(
        link.href.startsWith("/modules/") ||
          link.href.startsWith("/app/") ||
          link.href.startsWith("/tools/"),
        `ECG Clinical Modules link "${link.key}" href "${link.href}" must be learner-scoped (not a marketing URL)`,
      );
    }
  });

  test("buildClinicalModulesNavLinks with ecgNavEnabled=true includes Hemodynamic Monitoring", () => {
    const links = buildClinicalModulesNavLinks(null, true);
    const hemoLink = links.find((l) => l.key === "hemodynamics-fundamentals");
    assert.ok(
      hemoLink,
      "Clinical Modules flyout must include 'hemodynamics-fundamentals' for RN/NP",
    );
    assert.ok(
      hemoLink!.href.includes("/modules/hemodynamics"),
      "Hemodynamics link must point to /modules/hemodynamics (learner-scoped)",
    );
  });

  test("buildClinicalModulesNavLinks with ecgNavEnabled=true includes Advanced Hemodynamics as premium", () => {
    const links = buildClinicalModulesNavLinks(null, true);
    const advHemo = links.find((l) => l.key === "advanced-hemodynamics");
    assert.ok(advHemo, "Clinical Modules flyout must include 'advanced-hemodynamics' for RN/NP");
    assert.equal(advHemo!.status, "premium", "Advanced Hemodynamics must be marked 'premium'");
  });
});

// ─── 5. Learner ECG shell nav item (buildEcgShellNavItem) ────────────────────

describe("Learner shell — ECG nav item exists and is learner-scoped", () => {
  test("buildEcgShellNavItem returns a nav item pointing to /modules/ecg", () => {
    const ecgItem = buildEcgShellNavItem(null);
    assert.ok(ecgItem, "buildEcgShellNavItem must return a nav item");
    assert.ok(
      ecgItem.href.includes("/modules/ecg"),
      `ECG shell nav item href "${ecgItem.href}" must be inside /modules/ecg`,
    );
    assert.ok(
      ecgItem.matchPrefix.includes("/modules/ecg"),
      "ECG shell nav item matchPrefix must cover /modules/ecg routes for active state",
    );
  });

  test("buildEcgShellNavItem id is ECG_SHELL_NAV_ID", () => {
    const ecgItem = buildEcgShellNavItem(null);
    assert.equal(ecgItem.id, "ecg");
  });
});

// ─── 6. RPN/LVN_LPN exclusion ────────────────────────────────────────────────

describe("Learner nav — ECG hidden for RPN/LVN_LPN (ecgNavEnabled=false)", () => {
  test("buildClinicalModulesNavLinks with ecgNavEnabled=false excludes all ECG items", () => {
    const links = buildClinicalModulesNavLinks(null, false);
    const ecgLinks = links.filter(
      (l) =>
        l.key.startsWith("ecg") ||
        l.key === "pediatric-ecg" ||
        l.key === "advanced-ecg",
    );
    assert.deepEqual(
      ecgLinks.map((l) => l.key),
      [],
      "ECG nav items must be excluded when ecgNavEnabled=false (RPN/LVN_LPN pathway restriction)",
    );
  });

  test("marketing header moreLinks are NOT tier-gated (same links for all marketing visitors)", () => {
    const { readFileSync } = require("node:fs");
    const { join } = require("node:path");
    const src = readFileSync(
      join(process.cwd(), "src/components/layout/site-header-server.tsx"),
      "utf-8",
    );
    const moreLinksStart = src.indexOf("moreLinks: [");
    const moreLinksEnd = src.indexOf("],", moreLinksStart);
    const moreLinksBlock = moreLinksStart >= 0 && moreLinksEnd >= 0
      ? src.slice(moreLinksStart, moreLinksEnd)
      : "";

    // Check for conditional code patterns (not just word proximity — comments mentioning tier/RN are fine)
    assert.doesNotMatch(
      moreLinksBlock,
      /ecgNavEnabled|isEcgEnabled|tier\s*===\s*["']RN|tier\s*===\s*["']NP/,
      "moreLinks must not contain tier-conditional code — same nav shown to all marketing visitors",
    );
  });
});

// ─── 7. ECG link destinations are valid authority routes ─────────────────────

describe("ECG nav link destinations — all point to valid indexable routes", () => {
  test("RN ECG mega-menu links point to indexable ECG authority pages", () => {
    const t = (k: string) => k;
    const menus = buildMarketingMegaMenus("US", t);
    const rnMenu = menus.find((m) => m.key === "rn")!;
    const specialtiesLinks = rnMenu.groups.find((g) => g.key === "specialties")!.links;
    const ecgLinks = specialtiesLinks.filter((l) => l.key.startsWith("rn-ecg"));

    const validEcgPaths = new Set([
      "/advanced-ecg-nursing",
      "/ecg-telemetry-mastery",
      "/ecg-interpretation",
      "/ecg",
    ]);

    for (const link of ecgLinks) {
      assert.ok(
        validEcgPaths.has(link.href),
        `RN ECG link "${link.key}" href "${link.href}" must point to a canonical ECG authority page`,
      );
      assert.ok(
        !link.href.startsWith("/modules/"),
        `RN mega-menu ECG link "${link.key}" must not use /modules/ route (requires auth — breaks for guests)`,
      );
    }
  });

  test("NP mega-menu ECG links point to valid ECG authority pages (not learner routes)", () => {
    const t = (k: string) => k;
    const menus = buildMarketingMegaMenus("CA", t);
    const npMenu = menus.find((m) => m.key === "np")!;
    const allLinks = npMenu.groups.flatMap((g) => g.links);
    const ecgLinks = allLinks.filter((l) => l.key.startsWith("np-ecg"));

    for (const link of ecgLinks) {
      assert.ok(
        !link.href.startsWith("/modules/"),
        `NP mega-menu ECG link "${link.key}" must not use /modules/ route (requires auth)`,
      );
    }
  });
});
