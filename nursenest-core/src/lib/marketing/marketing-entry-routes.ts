/**
 * Single source of truth for marketing homepage and header entry URLs.
 * Prefer these helpers over ad hoc strings to avoid broken links and duplicate paths.
 *
 * Note: No Unicode em dashes in user-facing copy that references these (use hyphens or colons).
 */

import { CANONICAL_PATHWAY_HUB } from "@/lib/marketing/canonical-pathway-hubs";

export type MarketingRegionToggle = "US" | "CA";

export const HUB = {
  /** Canonical public lessons landing (legacy `/exam-lessons` redirects here). */
  examLessons: "/lessons",
  questionBank: "/question-bank",
  practiceExams: "/practice-exams",
  /** Public flashcards index (pathway-specific decks under `/flashcards/[slug]`). */
  flashcards: "/flashcards",
  tools: "/tools",
  pricing: "/pricing",
  signup: "/signup",
  login: "/login",
} as const;

/** RN / NCLEX-RN */
export const RN = {
  /** Legacy name: canonical public RN entry (retired `/us/rn/nclex-rn` overview). */
  practiceProgrammatic: CANONICAL_PATHWAY_HUB.usRn,
  usLessons: HUB.examLessons,
  caLessons: HUB.examLessons,
  usQuestions: HUB.questionBank,
  caQuestions: HUB.questionBank,
  /** Subscriber app route (timed practice exams, history). Public entry: {@link HUB.practiceExams}. */
  appExams: "/app/exams",
} as const;

/** LPN / RPN / PN */
export const PN = {
  usLessons: "/us/pn/nclex-pn/lessons",
  usQuestions: "/us/pn/nclex-pn/questions",
  caHub: "/canada/pn/rex-pn",
  caLessons: "/canada/pn/rex-pn/lessons",
  caQuestions: "/canada/pn/rex-pn/questions",
  /** Legacy: Canada PN canonical pathway hub (not `/rex-pn-practice-questions`). */
  practiceProgrammatic: CANONICAL_PATHWAY_HUB.caPn,
  /** Legacy: US PN canonical pathway hub (not `/nclex-pn-practice-questions`). */
  practiceProgrammaticUs: CANONICAL_PATHWAY_HUB.usPn,
} as const;

/** NP (US tracks in product) */
export const NP = {
  practiceProgrammatic: CANONICAL_PATHWAY_HUB.usNp,
  /** Strict SEO hubs → same pathways as `fnp` / `pmhnp` / CNPLE (see `np-practice-test-segments.ts`). */
  aanpPracticeTest: "/us/np/aanp-practice-test",
  anccFnpPracticeTest: "/us/np/ancc-fnp-practice-test",
  pmhnpPracticeTest: "/us/np/pmhnp-practice-test",
  cnplePracticeTest: "/canada/np/cnple-practice-test",
  /** Legacy: Canada NP canonical pathway hub (not `/cnple-practice-questions`). */
  practiceProgrammaticCa: CANONICAL_PATHWAY_HUB.caNp,
  fnpLessons: "/us/np/fnp/lessons",
  agpcnpLessons: "/us/np/agpcnp/lessons",
  fnpQuestions: "/us/np/fnp/questions",
  pmhnpHub: "/us/np/pmhnp",
  pmhnpLessons: "/us/np/pmhnp/lessons",
  caNpHub: "/canada/np/cnple",
  caNpLessons: "/canada/np/cnple/lessons",
  caNpQuestions: "/canada/np/cnple/questions",
} as const;

/** Allied (in-app hubs) */
export const ALLIED = {
  /** Core allied marketing index (unchanged from prior `mapLegacyMarketingHref("/allied-health")` — allied paths stay on Core). */
  marketingLanding: () => "/allied-health",
  usHub: "/us/allied/allied-health",
  usQuestions: "/us/allied/allied-health/questions",
  caHub: "/canada/allied/allied-health",
  caQuestions: "/canada/allied/allied-health/questions",
} as const;

export function loginWithCallback(path: string): string {
  const enc = encodeURIComponent(path.startsWith("/") ? path : `/${path}`);
  return `${HUB.login}?callbackUrl=${enc}`;
}

/** Signup with post-auth resume path (same shape as {@link loginWithCallback}). */
export function signupWithCallback(path: string): string {
  const enc = encodeURIComponent(path.startsWith("/") ? path : `/${path}`);
  return `${HUB.signup}?callbackUrl=${enc}`;
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
  return region === "US" ? "/us/pn/nclex-pn" : PN.caHub;
}

/** Programmatic practice hub slug for PN — NCLEX-PN (US) vs REx-PN (Canada). */
export function pnPracticeProgrammatic(region: MarketingRegionToggle): string {
  return region === "US" ? PN.practiceProgrammaticUs : PN.practiceProgrammatic;
}

/** Programmatic practice hub slug for NP — US NP overview vs Canadian CNPLE. */
export function npPracticeProgrammatic(region: MarketingRegionToggle): string {
  return region === "US" ? NP.practiceProgrammatic : NP.practiceProgrammaticCa;
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
