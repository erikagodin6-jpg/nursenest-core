/** Stored `examFocus` values accepted by `/api/signup` — keep in sync with server validation. */
export type SignupExamFocusValue = "nclex_rn" | "nclex_pn" | "rex_pn" | "np_board" | "allied_cert";

export type SignupExamFocusOption = { value: SignupExamFocusValue; label: string };

/**
 * Country-aware labels for signup “exam focus” — PN uses NCLEX-PN (US) vs REx-PN (CA); NP wording matches region.
 */
export function signupExamFocusOptions(country: "US" | "CA"): SignupExamFocusOption[] {
  const rn: SignupExamFocusOption =
    country === "US"
      ? { value: "nclex_rn", label: "NCLEX-RN / RN readiness" }
      : { value: "nclex_rn", label: "RN entry-to-practice (Canada)" };

  const pn: SignupExamFocusOption =
    country === "US"
      ? { value: "nclex_pn", label: "NCLEX-PN / LVN-LPN readiness" }
      : { value: "rex_pn", label: "REx-PN / practical nursing (Canada)" };

  const np: SignupExamFocusOption =
    country === "US"
      ? { value: "np_board", label: "NP board exams (US)" }
      : { value: "np_board", label: "CNPLE / NP (Canada)" };

  return [rn, pn, np, { value: "allied_cert", label: "Allied health certification" }];
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
