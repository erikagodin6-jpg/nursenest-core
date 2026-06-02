import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { CountryCode, TierCode } from "@prisma/client";

import {
  accountExamPreferenceFromPathwayId,
  contentCountryScopeMatchesPathway,
  currentPathwayLabelForPathway,
  listPrimaryExamPathwayOptions,
  resolvePrimaryExamPathwayId,
} from "./account-exam-preference";

describe("account-level exam preference and country scoping", () => {
  it("resolves signup country + tier + exam focus to one primary exam pathway id", () => {
    assert.equal(resolvePrimaryExamPathwayId({ country: CountryCode.CA, tier: TierCode.RN, examFocus: "nclex_rn" }), "ca-rn-nclex-rn");
    assert.equal(resolvePrimaryExamPathwayId({ country: CountryCode.US, tier: TierCode.RN, examFocus: "nclex_rn" }), "us-rn-nclex-rn");
    assert.equal(resolvePrimaryExamPathwayId({ country: CountryCode.CA, tier: TierCode.RPN, examFocus: "rex_pn" }), "ca-rpn-rex-pn");
    assert.equal(resolvePrimaryExamPathwayId({ country: CountryCode.US, tier: TierCode.LVN_LPN, examFocus: "nclex_pn" }), "us-lpn-nclex-pn");
    assert.equal(resolvePrimaryExamPathwayId({ country: CountryCode.CA, tier: TierCode.NP, examFocus: "np_board" }), "ca-np-cnple");
    assert.equal(resolvePrimaryExamPathwayId({ country: CountryCode.US, tier: TierCode.NP, examFocus: "np_fnp" }), "us-np-fnp");
    assert.equal(resolvePrimaryExamPathwayId({ country: CountryCode.US, tier: TierCode.NP, examFocus: "np_agpcnp" }), "us-np-agpcnp");
    assert.equal(resolvePrimaryExamPathwayId({ country: CountryCode.US, tier: TierCode.NP, examFocus: "np_pmhnp" }), "us-np-pmhnp");
    assert.equal(resolvePrimaryExamPathwayId({ country: CountryCode.US, tier: TierCode.NP, examFocus: "np_whnp" }), "us-np-whnp");
    assert.equal(resolvePrimaryExamPathwayId({ country: CountryCode.US, tier: TierCode.NP, examFocus: "np_pnp_pc" }), "us-np-pnp-pc");
  });

  it("builds current-pathway labels for a smart pathway switcher", () => {
    assert.equal(
      currentPathwayLabelForPathway({ countryCode: CountryCode.CA, shortName: "NCLEX-RN" }),
      "Canada NCLEX-RN",
    );
    assert.equal(
      currentPathwayLabelForPathway({ countryCode: CountryCode.US, shortName: "NCLEX-PN" }),
      "United States NCLEX-PN",
    );
    assert.equal(
      currentPathwayLabelForPathway({ countryCode: CountryCode.GB, shortName: "NMC CBT" }),
      "United Kingdom NMC CBT",
    );
  });

  it("exposes public, hidden, and planned pathway concepts without forcing duplicate navigation", () => {
    const options = listPrimaryExamPathwayOptions();
    const ids = new Set(options.map((option) => option.id));
    assert.ok(ids.has("ca-rn-nclex-rn"));
    assert.ok(ids.has("us-rn-nclex-rn"));
    assert.ok(ids.has("ca-rpn-rex-pn"));
    assert.ok(ids.has("us-lpn-nclex-pn"));
    assert.ok(ids.has("ca-np-cnple"));
    assert.ok(ids.has("us-np-fnp"));
    assert.ok(ids.has("pre-nursing"));
    assert.ok(ids.has("pre-nursing-ca"));
    assert.ok(ids.has("admissions-ati-teas"));
    assert.ok(ids.has("admissions-hesi-a2"));
    assert.ok(ids.has("admissions-casper"));
  });

  it("derives account-level preference shape from stored learnerPath or targetExamPathwayId", () => {
    assert.deepEqual(accountExamPreferenceFromPathwayId("ca-rn-nclex-rn"), {
      country: CountryCode.CA,
      exam: "NCLEX-RN",
      role: "rn",
      pathwayId: "ca-rn-nclex-rn",
    });
    assert.deepEqual(accountExamPreferenceFromPathwayId("us-np-pmhnp"), {
      country: CountryCode.US,
      exam: "PMHNP",
      role: "np",
      pathwayId: "us-np-pmhnp",
    });
  });

  it("allows shared content while preventing country-specific leakage", () => {
    assert.equal(contentCountryScopeMatchesPathway("shared", "ca-rn-nclex-rn"), true);
    assert.equal(contentCountryScopeMatchesPathway("both", "us-rn-nclex-rn"), true);
    assert.equal(contentCountryScopeMatchesPathway("canada", "ca-rn-nclex-rn"), true);
    assert.equal(contentCountryScopeMatchesPathway("united-states", "us-rn-nclex-rn"), true);
    assert.equal(contentCountryScopeMatchesPathway("canada", "us-rn-nclex-rn"), false);
    assert.equal(contentCountryScopeMatchesPathway("united-states", "ca-rn-nclex-rn"), false);
  });
});
