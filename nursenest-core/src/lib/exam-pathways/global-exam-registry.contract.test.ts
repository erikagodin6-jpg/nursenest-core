import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getExamPathwayByRoute, resolveExamPathwayFromMarketingHubSegment } from "@/lib/exam-pathways/exam-product-registry";
import {
  findGlobalExamRegistryEntryByAdminRoute,
  listHiddenGlobalExamRegistryEntries,
  validateGlobalExamRegistry,
} from "./global-exam-registry";
import {
  hiddenInternationalHubMetadata,
  resolveHiddenInternationalHub,
} from "./hidden-international-hubs";

describe("global exam registry hidden foundation program", () => {
  it("keeps future international entries admin-only, noindex, out of navigation, and out of sitemap", () => {
    const hidden = listHiddenGlobalExamRegistryEntries();
    assert.ok(hidden.length >= 8);
    for (const entry of hidden) {
      assert.equal(entry.visibilityStatus, "admin_only_hidden");
      assert.equal(entry.noindex, true);
      assert.equal(entry.navigationEligible, false);
      assert.equal(entry.sitemapEligible, false);
      assert.notEqual(entry.launchStatus, "current_market");
    }
  });

  it("reserves requested future hub paths without exposing them through public marketing resolution", () => {
    const cases = [
      ["uk", "rn", "nmc-test-of-competence"],
      ["australia", "rn", "iqnm-pathway"],
      ["philippines", "rn", "prc-pnle"],
      ["india", "rn", "state-nursing-council-registration"],
      ["saudi-arabia", "rn", "scfhs-licensure"],
    ] as const;

    for (const [country, profession, examCode] of cases) {
      const direct = getExamPathwayByRoute(country, profession, examCode);
      assert.ok(direct, `expected hidden catalog row for ${country}/${profession}/${examCode}`);
      assert.equal(direct?.status, "hidden");
      assert.equal(resolveExamPathwayFromMarketingHubSegment(country, profession, examCode), undefined);
    }
  });

  it("resolves admin-only hidden hub models for draft paths", () => {
    const hub = resolveHiddenInternationalHub("uk", "rn");
    assert.ok(hub);
    assert.equal(hub.entry.exam, "NMC CBT / OSCE");
    assert.equal(hub.routePolicy.adminOnly, true);
    assert.equal(hub.routePolicy.noindex, true);
    assert.equal(hub.routePolicy.navigationEligible, false);
    assert.equal(hub.routePolicy.sitemapEligible, false);

    const metadata = hiddenInternationalHubMetadata(hub);
    assert.deepEqual(metadata.robots, {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    });
  });

  it("finds entries by country code or reserved public path country segment", () => {
    assert.equal(findGlobalExamRegistryEntryByAdminRoute("GB", "rn")?.id, "global-uk-rn-nmc-cbt");
    assert.equal(findGlobalExamRegistryEntryByAdminRoute("uk", "rn")?.id, "global-uk-rn-nmc-cbt");
    assert.equal(findGlobalExamRegistryEntryByAdminRoute("AE", "rn")?.id, "global-ae-rn-licensure");
  });

  it("validates registry integrity", () => {
    assert.deepEqual(validateGlobalExamRegistry(), []);
  });
});
