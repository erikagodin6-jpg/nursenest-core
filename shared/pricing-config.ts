export type TierKey = "rpn" | "rn" | "np" | "allied" | "newgrad";
export type DurationKey = "monthly" | "3-month" | "6-month" | "yearly";

export interface TierPricing {
  monthly: number;
  "3-month": number;
  "6-month": number;
  yearly: number;
}

export const pricingConfig: Record<TierKey, { cad: TierPricing; usd: TierPricing }> = {
  rpn: {
    cad: { monthly: 2499, "3-month": 5999, "6-month": 9999, yearly: 14999 },
    usd: { monthly: 1849, "3-month": 4449, "6-month": 7399, yearly: 11099 },
  },
  rn: {
    cad: { monthly: 2999, "3-month": 6999, "6-month": 10999, yearly: 15999 },
    usd: { monthly: 2199, "3-month": 5549, "6-month": 8899, yearly: 13299 },
  },
  np: {
    cad: { monthly: 3499, "3-month": 7999, "6-month": 11999, yearly: 16999 },
    usd: { monthly: 2949, "3-month": 7399, "6-month": 11849, yearly: 17749 },
  },
  allied: {
    cad: { monthly: 2499, "3-month": 5999, "6-month": 9999, yearly: 14999 },
    usd: { monthly: 1849, "3-month": 4449, "6-month": 7399, yearly: 11099 },
  },
  newgrad: {
    cad: { monthly: 1999, "3-month": 4799, "6-month": 7999, yearly: 11999 },
    usd: { monthly: 1499, "3-month": 3599, "6-month": 5999, yearly: 8999 },
  },
};

export const durationLabels: Record<DurationKey, string> = {
  monthly: "1 Month",
  "3-month": "3 Months",
  "6-month": "6 Months",
  yearly: "1 Year",
};

export const durationMonths: Record<DurationKey, number> = {
  monthly: 1,
  "3-month": 3,
  "6-month": 6,
  yearly: 12,
};

export const tierMeta: Record<TierKey, {
  nameCA: string;
  nameUS: string;
  tagline: string;
  description: string;
}> = {
  rpn: {
    nameCA: "RPN",
    nameUS: "LVN",
    tagline: "Master core nursing fundamentals and prepare for the REx-PN exam.",
    description: "Practical nursing exam preparation",
  },
  rn: {
    nameCA: "RN",
    nameUS: "RN/NCLEX",
    tagline: "Train with realistic NCLEX-style questions and adaptive mock exams.",
    description: "Registered nursing exam preparation",
  },
  np: {
    nameCA: "NP",
    nameUS: "NP",
    tagline: "Advanced clinical reasoning practice designed for nurse practitioner certification.",
    description: "Nurse practitioner board preparation",
  },
  allied: {
    nameCA: "Allied Health",
    nameUS: "Allied Health",
    tagline: "Comprehensive exam prep for RRT, Paramedic, Pharmacy Tech, MLT, and more.",
    description: "Allied health certification exam preparation",
  },
  newgrad: {
    nameCA: "New Grad",
    nameUS: "New Grad",
    tagline: "Career toolkit for new graduate nurses: interview prep, resume builder, salary guides, and professional development.",
    description: "New graduate nurse career development",
  },
};

export const studyTimelines: Record<TierKey, string> = {
  rpn: "6-8 weeks recommended",
  rn: "8-12 weeks recommended",
  np: "12-16 weeks recommended",
  allied: "8-12 weeks recommended",
  newgrad: "First year of practice",
};

export const socialProofStats = [
  { value: "40,000+", label: "Practice Questions" },
  { value: "13,000+", label: "Flashcards" },
  { value: "7,900+", label: "Clinical Lessons" },
  { value: "94%", label: "First-Attempt Pass Rate" },
];

export const featureComparisonRows = [
  { feature: "Practice questions", free: "Limited", rpn: "Full access", rn: "Full access", np: "Full access", allied: "Full access" },
  { feature: "Flashcards", free: "Limited", rpn: "Full access", rn: "Full access", np: "Full access", allied: "Full access" },
  { feature: "Clinical lessons", free: "Limited", rpn: "Full access", rn: "Full access", np: "Full access", allied: "Full access" },
  { feature: "Adaptive mock exams", free: "No", rpn: "Full access", rn: "Full access", np: "Full access", allied: "Full access" },
  { feature: "Performance analytics", free: "No", rpn: "Full access", rn: "Full access", np: "Full access", allied: "Full access" },
  { feature: "Exam simulations", free: "No", rpn: "Full access", rn: "Full access", np: "Full access", allied: "Full access" },
];
