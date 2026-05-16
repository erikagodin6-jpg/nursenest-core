/**
 * ECG Navigation Visibility Contract Tests
 *
 * CI-blocking regression guard: fails if ECG disappears from any navigation surface.
 *
 * Surfaces validated:
 *   1. Marketing header moreLinks (desktop nav bar + mobile drawer "More" section)
 *      — SiteHeaderPrecomputedNav.moreLinks from buildPrecomputedNavData()
 *   2. Marketing mega-menu RN Specialties group
 *   3. Marketing mega-menu NP Clinical Modules group
 *   4. Learner Clinical Modules flyout (RN/NP with ecgNavEnabled=true)
 *   5. Learner ECG shell nav item (RN/NP tiers)
 *   6. Learner nav: ECG hidden for RPN/LVN_LPN (ecgNavEnabled=false)
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

// ─── 1. Marketing header moreLinks ────────────────────────────────────────────

describe("Marketing header moreLinks — ECG visible in desktop nav and mobile drawer", () => {
  // Import buildPrecomputedNavData indirectly by reading the server component source.
  // The precomputed moreLinks list is what the header renders server-side.
  test("site-header-server.tsx moreLinks array contains ecg-interpretation key", () => {
    const { readFileSync } = require("node:fs");
    const { join } = require("node:path");
    const src = readFileSync(
      join(process.cwd(), "src/components/layout/site-header-server.tsx"),
      "utf-8",
    );
    // The server precomputed moreLinks must have the ECG entry
    assert.match(
      src,
      /key:\s*["']ecg-interpretation["']/,
      "site-header-server.tsx moreLinks must include key: 'ecg-interpretation' — " +
      "ECG must be visible in the server-rendered nav bar without requiring a dropdown",
    );
    assert.match(
      src,
      /href.*\/ecg-interpretation|\/ecg-interpretation.*href/,
      "site-header-server.tsx moreLinks must link to /ecg-interpretation",
    );
    assert.match(
      src,
      /matchBase.*\/ecg/,
      "site-header-server.tsx ECG nav link must have matchBase '/ecg' to highlight on all ECG pages",
    );
  });

  test("site-header.tsx fallback marketingMoreLinks contains ecg-interpretation", () => {
    const { readFileSync } = require("node:fs");
    const { join } = require("node:path");
    const src = readFileSync(
      join(process.cwd(), "src/components/layout/site-header.tsx"),
      "utf-8",
    );
    assert.match(
      src,
      /key:\s*["']ecg-interpretation["']/,
      "site-header.tsx fallback marketingMoreLinks must include 'ecg-interpretation' — " +
      "ECG must be visible when server precomputation is unavailable",
    );
    assert.match(
      src,
      /\/ecg-interpretation/,
      "site-header.tsx fallback must link to /ecg-interpretation",
    );
  });

  test("ECG nav item appears before pricing in moreLinks (high-visibility position)", () => {
    const { readFileSync } = require("node:fs");
    const { join } = require("node:path");
    const src = readFileSync(
      join(process.cwd(), "src/components/layout/site-header-server.tsx"),
      "utf-8",
    );
    const ecgIdx = src.indexOf("ecg-interpretation");
    const pricingIdx = src.indexOf('"pricing"');
    assert.ok(
      ecgIdx > 0,
      "ECG key must exist in site-header-server.tsx moreLinks",
    );
    assert.ok(
      ecgIdx < pricingIdx,
      "ECG nav item must appear before 'pricing' in moreLinks — it is a primary clinical specialty, not a secondary utility link",
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
      assert.equal(
        ecgLink!.href,
        "/advanced-ecg-nursing",
        "RN ECG Mastery link must point to /advanced-ecg-nursing",
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
      assert.equal(npEcgLink!.href, "/advanced-ecg-nursing");
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

  test("marketing header moreLinks are NOT tier-gated (ECG always appears in public nav)", () => {
    // The marketing header shows the same moreLinks to all visitors — RPN users still
    // see the marketing ECG page link (which has no paywall). Only the learner flyout
    // hides ECG module access for RPN.
    const { readFileSync } = require("node:fs");
    const { join } = require("node:path");
    const src = readFileSync(
      join(process.cwd(), "src/components/layout/site-header-server.tsx"),
      "utf-8",
    );
    // The ECG link in moreLinks must NOT be inside any tier conditional
    // (it should not be wrapped in `ecgNavEnabled &&` or `tier === "RN" &&`)
    const ecgIdx = src.indexOf("ecg-interpretation");
    const nearEcg = src.slice(Math.max(0, ecgIdx - 200), ecgIdx + 200);
    assert.doesNotMatch(
      nearEcg,
      /ecgNavEnabled|isEcgEnabled|tier.*RN|RN.*tier/,
      "ECG entry in moreLinks must not be tier-gated — the marketing ECG page is public for all visitors",
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
      // Must not be a learner module route (would require auth)
      assert.ok(
        !link.href.startsWith("/modules/"),
        `RN mega-menu ECG link "${link.key}" must not use /modules/ route (requires auth — breaks for guests)`,
      );
    }
  });

  test("moreLinks ECG entry points to /ecg-interpretation (canonical Core ECG hub)", () => {
    const { readFileSync } = require("node:fs");
    const { join } = require("node:path");
    const serverSrc = readFileSync(
      join(process.cwd(), "src/components/layout/site-header-server.tsx"),
      "utf-8",
    );
    // The ECG entry in moreLinks should point to /ecg-interpretation, not /modules/* or /app/*
    const ecgIdx = serverSrc.indexOf("ecg-interpretation");
    const nearEntry = serverSrc.slice(ecgIdx, ecgIdx + 300);
    assert.match(
      nearEntry,
      /\/ecg-interpretation/,
      "moreLinks ECG entry must link to /ecg-interpretation (public, always-indexable Core ECG hub)",
    );
    assert.doesNotMatch(
      nearEntry.slice(0, 100),
      /\/modules\//,
      "moreLinks ECG entry must not use /modules/ path (requires auth — breaks crawler and unauthenticated users)",
    );
  });
});
