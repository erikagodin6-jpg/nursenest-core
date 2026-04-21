import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildMarketingMegaMenus } from "@/lib/navigation/marketing-mega-menu";
import { buildMarketingTierHubStrip } from "@/lib/navigation/marketing-tier-hub-strip";

/** Identity translator — keys only; compares structural parity with mega-menu hub row. */
function tKey(k: string): string {
  return k;
}

describe("buildMarketingTierHubStrip", () => {
  it("hub hrefs and labels match buildMarketingMegaMenus tier row (US + CA)", () => {
    for (const region of ["US", "CA"] as const) {
      const strip = buildMarketingTierHubStrip(region, tKey);
      const mega = buildMarketingMegaMenus(region, tKey);
      for (const row of strip) {
        const m = mega.find((x) => x.key === row.key);
        assert.ok(m, `missing mega menu for ${row.key}`);
        assert.equal(row.hubHref, m.hubHref, `${region} ${row.key} hubHref`);
        assert.equal(row.label, m.label, `${region} ${row.key} label`);
      }
    }
  });
});
