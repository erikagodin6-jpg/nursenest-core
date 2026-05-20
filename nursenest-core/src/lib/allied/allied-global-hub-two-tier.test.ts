import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ALLIED_GLOBAL_HUB_PATH,
  buildAlliedOccupationMarketingHubPath,
  isMarketingAlliedHealthTopLevelHubPath,
} from "@/lib/allied/allied-global-hub-path";

describe("allied global vs occupation marketing paths", () => {
  it("detects top-level allied marketing hub paths", () => {
    assert.equal(isMarketingAlliedHealthTopLevelHubPath(ALLIED_GLOBAL_HUB_PATH), true);
    assert.equal(isMarketingAlliedHealthTopLevelHubPath("/us/allied/allied-health"), true);
    assert.equal(isMarketingAlliedHealthTopLevelHubPath("/canada/allied/allied-health"), true);
    assert.equal(isMarketingAlliedHealthTopLevelHubPath("/allied/medical-assistant"), false);
    assert.equal(isMarketingAlliedHealthTopLevelHubPath("/allied-health"), false);
  });

  it("builds stable occupation hub hrefs", () => {
    assert.equal(buildAlliedOccupationMarketingHubPath("medical-assistant"), "/allied/medical-assistant");
    assert.equal(buildAlliedOccupationMarketingHubPath("  Phlebotomy "), "/allied/phlebotomy");
  });
});
