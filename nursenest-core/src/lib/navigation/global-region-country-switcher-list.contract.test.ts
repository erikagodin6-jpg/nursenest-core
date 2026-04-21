import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GLOBAL_REGION_SLUGS } from "@/lib/i18n/global-regions";
import { listExpansionHubRegions } from "@/lib/marketing/global-region-exam-hubs";
import {
  isGlobalRegionListedInCountrySwitcher,
  isPublicCountrySwitcherReady,
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
});
