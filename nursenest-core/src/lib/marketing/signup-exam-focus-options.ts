/** Stored `examFocus` values accepted by `/api/signup` — keep in sync with server validation. */
export type SignupExamFocusValue =
  | "nclex_rn"
  | "nclex_pn"
  | "rex_pn"
  | "np_board"
  | "np_fnp"
  | "np_agpcnp"
  | "np_pmhnp"
  | "np_whnp"
  | "np_pnp_pc"
  | "allied_cert";

export type SignupTierValue = "RPN" | "LVN_LPN" | "RN" | "NP" | "ALLIED";

export type SignupExamFocusOption = { value: SignupExamFocusValue; label: string };

type Translate = (key: string) => string;

/**
 * Country- and role-aware labels for signup “exam focus”.
 * Keeps region-specific choices out of incompatible role tracks (for example, US NP never sees CNPLE/REx-PN).
 */
export function signupExamFocusOptions(
  country: "US" | "CA",
  tier: SignupTierValue,
  t: Translate,
): SignupExamFocusOption[] {
  if (tier === "NP") {
    return country === "US"
      ? [
          { value: "np_fnp", label: "FNP - Family Nurse Practitioner" },
          { value: "np_agpcnp", label: "AGPCNP - Adult-Gerontology Primary Care NP" },
          { value: "np_pmhnp", label: "PMHNP - Psychiatric-Mental Health NP" },
          { value: "np_whnp", label: "WHNP - Women's Health NP" },
          { value: "np_pnp_pc", label: "PNP-PC - Pediatric Primary Care NP" },
        ]
      : [{ value: "np_board", label: t("pages.signup.examFocus.npCa") }];
  }

  if (tier === "RPN" || tier === "LVN_LPN") {
    return [
      country === "US"
        ? { value: "nclex_pn", label: t("pages.signup.examFocus.nclexPnUs") }
        : { value: "rex_pn", label: t("pages.signup.examFocus.rexPnCa") },
    ];
  }

  if (tier === "ALLIED") {
    return [{ value: "allied_cert", label: t("pages.signup.examFocus.allied") }];
  }

  return [
    country === "US"
      ? { value: "nclex_rn", label: t("pages.signup.examFocus.nclexRnUs") }
      : { value: "nclex_rn", label: t("pages.signup.examFocus.nclexRnCa") },
  ];
}

/** When country or role toggles, keep the selected focus inside the available option set. */
export function reconcileExamFocusForCountryAndTier(
  country: "US" | "CA",
  tier: SignupTierValue,
  current: SignupExamFocusValue,
  t: Translate,
): SignupExamFocusValue {
  const options = signupExamFocusOptions(country, tier, t);
  return options.some((option) => option.value === current) ? current : options[0]?.value ?? "nclex_rn";
}
