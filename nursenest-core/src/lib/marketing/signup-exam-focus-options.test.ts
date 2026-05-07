import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  reconcileExamFocusForCountryAndTier,
  signupExamFocusOptions,
} from "@/lib/marketing/signup-exam-focus-options";

const t = (key: string) =>
  ({
    "pages.signup.examFocus.nclexRnUs": "NCLEX-RN (United States)",
    "pages.signup.examFocus.nclexRnCa": "NCLEX-RN (Canada)",
    "pages.signup.examFocus.nclexPnUs": "NCLEX-PN (United States)",
    "pages.signup.examFocus.rexPnCa": "REx-PN (Canada)",
    "pages.signup.examFocus.npCa": "CNPLE / NP (Canada)",
    "pages.signup.examFocus.allied": "Allied certification",
  })[key] ?? key;

describe("signupExamFocusOptions", () => {
  it("shows only US NP specialty choices for United States + NP", () => {
    const options = signupExamFocusOptions("US", "NP", t);
    assert.deepEqual(
      options.map((option) => option.value),
      ["np_fnp", "np_agpcnp", "np_pmhnp", "np_whnp", "np_pnp_pc"],
    );
    assert.equal(options.some((option) => /Canada|CNPLE|REx-PN|NCLEX-RN/i.test(option.label)), false);
  });

  it("keeps Canada NP on CNPLE without leaking RN or PN choices", () => {
    const options = signupExamFocusOptions("CA", "NP", t);
    assert.deepEqual(options, [{ value: "np_board", label: "CNPLE / NP (Canada)" }]);
  });

  it("reconciles incompatible focus after changing country or role", () => {
    assert.equal(reconcileExamFocusForCountryAndTier("US", "NP", "rex_pn", t), "np_fnp");
    assert.equal(reconcileExamFocusForCountryAndTier("CA", "RPN", "nclex_pn", t), "rex_pn");
    assert.equal(reconcileExamFocusForCountryAndTier("US", "RN", "np_fnp", t), "nclex_rn");
  });
});
