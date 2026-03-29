export const countryLabels = {
  CA: "Canada",
  US: "United States",
} as const;

export const tierLabels = {
  RPN: "RPN",
  LVN_LPN: "LVN/LPN",
  RN: "RN",
  NP: "NP",
  ALLIED: "Allied health",
} as const;

export type CountryCode = keyof typeof countryLabels;
export type TierCode = keyof typeof tierLabels;

export const tiersByCountry: Record<CountryCode, TierCode[]> = {
  CA: ["RPN", "RN", "NP", "ALLIED"],
  US: ["LVN_LPN", "RN", "NP", "ALLIED"],
};
