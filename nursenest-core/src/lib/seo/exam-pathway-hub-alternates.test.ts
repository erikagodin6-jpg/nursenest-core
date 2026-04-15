import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { examPathwayRegionalHreflang } from "@/lib/seo/exam-pathway-hub-alternates";

describe("examPathwayRegionalHreflang", () => {
  it("emits en-US, en-CA, and x-default for paired US/Canada NCLEX-RN hubs", () => {
    const usRn = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(usRn);
    const lang = examPathwayRegionalHreflang(usRn);
    assert.ok(lang["en-US"]?.includes("/us/rn/nclex-rn"));
    assert.ok(lang["en-CA"]?.includes("/canada/rn/nclex-rn"));
    assert.equal(lang["x-default"], lang["en-US"]);
  });

  it("uses x-default = en-CA when only Canada pathway exists for that product key", () => {
    const caOnly = getExamPathwayById("ca-rpn-rex-pn");
    assert.ok(caOnly);
    const lang = examPathwayRegionalHreflang(caOnly);
    assert.ok(!lang["en-US"]);
    assert.ok(lang["en-CA"]?.includes("/canada/pn/rex-pn"));
    assert.equal(lang["x-default"], lang["en-CA"]);
  });
});
