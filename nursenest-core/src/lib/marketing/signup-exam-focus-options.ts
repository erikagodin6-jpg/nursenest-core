/** Stored `examFocus` values accepted by `/api/signup` — keep in sync with server validation. */
export type SignupExamFocusValue = "nclex_rn" | "nclex_pn" | "rex_pn" | "np_board" | "allied_cert";

export type SignupExamFocusOption = { value: SignupExamFocusValue; label: string };

type Translate = (key: string) => string;

/**
 * Country-aware labels for signup “exam focus” — PN uses NCLEX-PN (US) vs REx-PN (CA); NP wording matches region.
 */
export function signupExamFocusOptions(country: "US" | "CA", t: Translate): SignupExamFocusOption[] {
  const rn: SignupExamFocusOption =
    country === "US"
      ? { value: "nclex_rn", label: t("pages.signup.examFocus.nclexRnUs") }
      : { value: "nclex_rn", label: t("pages.signup.examFocus.nclexRnCa") };

  const pn: SignupExamFocusOption =
    country === "US"
      ? { value: "nclex_pn", label: t("pages.signup.examFocus.nclexPnUs") }
      : { value: "rex_pn", label: t("pages.signup.examFocus.rexPnCa") };

  const np: SignupExamFocusOption =
    country === "US"
      ? { value: "np_board", label: t("pages.signup.examFocus.npUs") }
      : { value: "np_board", label: t("pages.signup.examFocus.npCa") };

  return [rn, pn, np, { value: "allied_cert", label: t("pages.signup.examFocus.allied") }];
}

/** When country toggles, map invalid PN focus to the closest valid value for the new country. */
export function reconcileExamFocusForCountry(
  country: "US" | "CA",
  current: SignupExamFocusValue,
): SignupExamFocusValue {
  if (country === "US" && current === "rex_pn") return "nclex_pn";
  if (country === "CA" && current === "nclex_pn") return "rex_pn";
  return current;
}
