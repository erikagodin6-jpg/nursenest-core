import { CountryCode, TierCode } from "@/lib/domain/exam";
import { getMonthlyListLabel } from "@/lib/pricing/display-catalog";

export type PlanCard = {
  slug: string;
  title: string;
  description: string;
  country: CountryCode;
  tier: TierCode;
  monthlyPriceLabel: string;
};

export const publicPlanCards: PlanCard[] = [
  {
    slug: "ca-rpn",
    title: "Canada RPN",
    description: "REx-PN focused lessons, question bank, and practice exams.",
    country: "CA",
    tier: "RPN",
    monthlyPriceLabel: getMonthlyListLabel("CA", "RPN"),
  },
  {
    slug: "us-lvn",
    title: "US LVN/LPN",
    description: "NCLEX-PN style prep with guided practice and rationales.",
    country: "US",
    tier: "LVN_LPN",
    monthlyPriceLabel: getMonthlyListLabel("US", "LVN_LPN"),
  },
  {
    slug: "rn-np",
    title: "RN + NP Tracks",
    description: "Advanced clinical reasoning paths for RN and NP learners.",
    country: "CA",
    tier: "NP",
    monthlyPriceLabel: getMonthlyListLabel("CA", "NP"),
  },
  {
    slug: "allied",
    title: "Allied health",
    description: "Reasoning-heavy prep for RT, paramedic, lab, and imaging pathways.",
    country: "CA",
    tier: "ALLIED",
    monthlyPriceLabel: getMonthlyListLabel("CA", "ALLIED"),
  },
];
