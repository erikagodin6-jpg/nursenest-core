/**
 * Single source of truth for marketing homepage and header entry URLs.
 * Prefer these helpers over ad hoc strings to avoid broken links and duplicate paths.
 *
 * Note: No Unicode em dashes in user-facing copy that references these (use hyphens or colons).
 */

import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";

export type MarketingRegionToggle = "US" | "CA";

/** RN / NCLEX-RN */
export const RN = {
  practiceProgrammatic: "/nclex-rn-practice-questions",
  usLessons: "/us/rn/nclex-rn/lessons",
  caLessons: "/canada/rn/nclex-rn/lessons",
  usQuestions: "/us/rn/nclex-rn/questions",
  caQuestions: "/canada/rn/nclex-rn/questions",
  appExams: "/app/exams",
} as const;

/** LPN / RPN / PN */
export const PN = {
  usLessons: "/us/lpn/nclex-pn/lessons",
  usQuestions: "/us/lpn/nclex-pn/questions",
  caHub: "/canada/rpn/rex-pn",
  caLessons: "/canada/rpn/rex-pn/lessons",
  caQuestions: "/canada/rpn/rex-pn/questions",
  practiceProgrammatic: "/rex-pn-practice-questions",
} as const;

/** NP (US tracks in product) */
export const NP = {
  practiceProgrammatic: "/np-exam-practice-questions",
  fnpLessons: "/us/np/fnp/lessons",
  agpcnpLessons: "/us/np/agpcnp/lessons",
  fnpQuestions: "/us/np/fnp/questions",
  pmhnpHub: "/us/np/pmhnp",
  pmhnpLessons: "/us/np/pmhnp/lessons",
  caNpHub: "/canada/np/cnple",
  caNpQuestions: "/canada/np/cnple/questions",
} as const;

/** Allied (in-app hubs) */
export const ALLIED = {
  /** Legacy marketing URL (often off Core; use for “brochure” context). */
  marketingLanding: () => mapLegacyMarketingHref("/allied-health"),
  usHub: "/us/allied/allied-health",
  usQuestions: "/us/allied/allied-health/questions",
  caHub: "/canada/allied/allied-health",
  caQuestions: "/canada/allied/allied-health/questions",
} as const;

export const HUB = {
  examLessons: "/exam-lessons",
  tools: "/tools",
  pricing: "/pricing",
  signup: "/signup",
  login: "/login",
} as const;

export function loginWithCallback(path: string): string {
  const enc = encodeURIComponent(path.startsWith("/") ? path : `/${path}`);
  return `${HUB.login}?callbackUrl=${enc}`;
}

export function rnLessons(region: MarketingRegionToggle): string {
  return region === "US" ? RN.usLessons : RN.caLessons;
}

export function rnQuestions(region: MarketingRegionToggle): string {
  return region === "US" ? RN.usQuestions : RN.caQuestions;
}

export function pnLessons(region: MarketingRegionToggle): string {
  return region === "US" ? PN.usLessons : PN.caLessons;
}

export function pnQuestions(region: MarketingRegionToggle): string {
  return region === "US" ? PN.usQuestions : PN.caQuestions;
}

export function pnPrimaryHub(region: MarketingRegionToggle): string {
  return region === "US" ? "/us/lpn/nclex-pn" : PN.caHub;
}

export function alliedHub(region: MarketingRegionToggle): string {
  return region === "US" ? ALLIED.usHub : ALLIED.caHub;
}

export function alliedQuestions(region: MarketingRegionToggle): string {
  return region === "US" ? ALLIED.usQuestions : ALLIED.caQuestions;
}

export function npNpQuestionsForRegion(region: MarketingRegionToggle): string {
  return region === "US" ? NP.fnpQuestions : NP.caNpQuestions;
}

export function alliedCareersMarketingUrl(): string {
  return ALLIED.marketingLanding();
}
