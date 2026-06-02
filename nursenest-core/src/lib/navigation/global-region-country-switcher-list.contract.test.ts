import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GLOBAL_REGION_SLUGS } from "@/lib/i18n/global-regions";
import { listExpansionHubRegions } from "@/lib/marketing/global-region-exam-hubs";
import { getRegionGroups } from "@/lib/navigation/context-switch-helpers";
import { MARKET_READINESS } from "@/lib/navigation/market-readiness-data";
import {
  isGlobalRegionListedInCountrySwitcher,
  isPublicCountrySwitcherReady,
  listGlobalRegionsListedInCountrySwitcher,
} from "@/lib/navigation/market-readiness";

describe("global region country switcher listing", () => {
  it("includes every shipped expansion hub region (except US, which has no hub row)", () => {
    for (const slug of listExpansionHubRegions()) {
      assert.equal(
        isGlobalRegionListedInCountrySwitcher(slug),
        true,
        `expected ${slug} to be selectable (hub + market row)`,
      );
    }
  });

  it("lists Philippines, China, and Middle East routing regions", () => {
    assert.equal(isGlobalRegionListedInCountrySwitcher("philippines"), true);
    assert.equal(isGlobalRegionListedInCountrySwitcher("china"), true);
    assert.equal(isGlobalRegionListedInCountrySwitcher("uae"), true);
    assert.equal(isGlobalRegionListedInCountrySwitcher("saudi-arabia"), true);
  });

  it("excludes planned or hub-less markets", () => {
    assert.equal(isGlobalRegionListedInCountrySwitcher("pakistan"), false);
    assert.equal(isGlobalRegionListedInCountrySwitcher("bangladesh"), false);
    assert.equal(isGlobalRegionListedInCountrySwitcher("singapore"), false);
  });

  it("keeps strict launch gate for product-only checks (expansion can be listed but not published-ready)", () => {
    if (GLOBAL_REGION_SLUGS.includes("philippines")) {
      assert.equal(isPublicCountrySwitcherReady("philippines"), false);
      assert.equal(isGlobalRegionListedInCountrySwitcher("philippines"), true);
    }
  });

  it("marketing country dropdown exposes more than US/CA (regression: empty HUB_BY_REGION hid all international)", () => {
    const groups = getRegionGroups();
    const intl = groups.find((g) => g.label === "International");
    assert.ok(intl, "expected International group");
    assert.ok(
      intl!.regions.length >= 10,
      `expected many international rows, got ${intl!.regions.length} (check HUB_BY_REGION + MARKET_READINESS)`,
    );
    const listed = listGlobalRegionsListedInCountrySwitcher();
    assert.equal(listed.length, 2 + intl!.regions.length, "list helper should match getRegionGroups counts");
  });

  it("every shipped expansion hub row has market metadata (avoid orphan hubs)", () => {
    for (const slug of listExpansionHubRegions()) {
      const m = MARKET_READINESS[slug];
      assert.ok(m?.seoEnabled, `HUB_BY_REGION includes ${slug} but MARKET_READINESS is missing or seo disabled`);
      assert.notEqual(m.supportTier, "planned", `${slug} hub exists but region is still planned — fix tier or remove hub`);
    }
  });
});
