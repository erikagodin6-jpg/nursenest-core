/**
 * Single source of truth for marketing homepage and header entry URLs.
 * Prefer these helpers over ad hoc strings to avoid broken links and duplicate paths.
 *
 * Note: No Unicode em dashes in user-facing copy that references these (use hyphens or colons).
 */

import { ALLIED_GLOBAL_HUB_PATH, buildAlliedGlobalHubPath } from "@/lib/allied/allied-global-hub-path";
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
  /** Canonical public RN pathway hub root (same as {@link CANONICAL_PATHWAY_HUB.usRn}). */
  practiceProgrammatic: CANONICAL_PATHWAY_HUB.usRn,
  usLessons: `${CANONICAL_PATHWAY_HUB.usRn}/lessons`,
  caLessons: `${CANONICAL_PATHWAY_HUB.caRn}/lessons`,
  usQuestions: `${CANONICAL_PATHWAY_HUB.usRn}/questions`,
  caQuestions: `${CANONICAL_PATHWAY_HUB.caRn}/questions`,
  /** Subscriber app route (timed practice exams, history). Public entry: {@link HUB.practiceExams}. */
  appExams: "/app/practice-tests",
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
  usDiscoveryLessons: "/np-exam-prep",
  usDiscoveryQuestions: "/np-exam-practice-questions",
  usDiscoveryCat: "/np-clinical-cases",
  caDiscoveryLessons: "/canada-np-exam-prep",
  caDiscoveryQuestions: "/cnple-practice-questions",
  caDiscoveryCat: "/canada-np-exam-prep",
  fnpHub: "/us/np/fnp",
  agpcnpHub: "/us/np/agpcnp",
  pmhnpHub: "/us/np/pmhnp",
  whnpHub: "/us/np/whnp",
  pnpPcHub: "/us/np/pnp-pc",
  fnpLessons: "/us/np/fnp/lessons",
  agpcnpLessons: "/us/np/agpcnp/lessons",
  pmhnpLessons: "/us/np/pmhnp/lessons",
  whnpLessons: "/us/np/whnp/lessons",
  pnpPcLessons: "/us/np/pnp-pc/lessons",
  fnpQuestions: "/us/np/fnp/questions",
  agpcnpQuestions: "/us/np/agpcnp/questions",
  pmhnpQuestions: "/us/np/pmhnp/questions",
  whnpQuestions: "/us/np/whnp/questions",
  pnpPcQuestions: "/us/np/pnp-pc/questions",
  caNpHub: "/canada/np/cnple",
  caNpLessons: "/canada/np/cnple/lessons",
  caNpQuestions: "/canada/np/cnple/questions",
} as const;

/**
 * CNPLE SEO content cluster — secondary pillar + uncertainty-capture + domain + population pages.
 * These are self-canonical discovery surfaces, not redirects to the pathway hub.
 * Internal links between these pages form the CNPLE topical authority knowledge graph.
 */
export const CNPLE = {
  // ── Core hub (pathway-registered) ────────────────────────────────────────
  hub: "/canada/np/cnple",
  lessons: "/canada/np/cnple/lessons",
  questions: "/canada/np/cnple/questions",
  pricing: "/canada/np/cnple/pricing",
  simulation: "/canada/np/cnple/simulation",
  flashcards: "/canada/np/cnple/flashcards",

  // ── Primary discovery cluster ─────────────────────────────────────────────
  practiceQuestions: "/cnple-practice-questions",
  studyGuide: "/cnple-study-guide",
  simulationExam: "/cnple-simulation-exam",
  canadaNpExamPrep: "/canada-np-exam-prep",

  // ── Phase 2: new-exam uncertainty capture ────────────────────────────────
  whatIsCnple: "/what-is-the-cnple",
  cnpleVsCnpe: "/cnple-vs-cnpe",
  loftTesting: "/cnple-loft-testing",
  blueprint: "/cnple-blueprint",

  // ── Domain cluster ────────────────────────────────────────────────────────
  clinicalJudgment: "/cnple-clinical-judgment",
  prescribingQuestions: "/cnple-prescribing-questions",
  pharmacology: "/cnple-pharmacology",
  labInterpretation: "/cnple-lab-interpretation",
  differentialDiagnosis: "/cnple-differential-diagnosis",
  mentalHealth: "/cnple-mental-health",
  caseStudies: "/cnple-case-studies",

  // ── Population cluster ────────────────────────────────────────────────────
  pediatrics: "/cnple-pediatrics",
  geriatrics: "/cnple-geriatrics",
  womensHealth: "/cnple-womens-health",
  primaryCare: "/cnple-primary-care",
} as const;

/** Allied (in-app hubs) */
export const ALLIED = {
  /** Core allied marketing index (unchanged from prior `mapLegacyMarketingHref("/allied-health")` — allied paths stay on Core). */
  marketingLanding: () => "/allied-health",
  /** Global pathway hub (US/CA country-prefixed URLs 301 here). */
  usHub: ALLIED_GLOBAL_HUB_PATH,
  usQuestions: buildAlliedGlobalHubPath("questions"),
  caHub: ALLIED_GLOBAL_HUB_PATH,
  caQuestions: buildAlliedGlobalHubPath("questions"),
} as const;

export function loginWithCallback(path: string, options?: { sessionExpired?: boolean }): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const params = new URLSearchParams();
  params.set("callbackUrl", normalized);
  if (options?.sessionExpired) {
    params.set("session", "expired");
  }
  return `${HUB.login}?${params.toString()}`;
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
  return region === "US" ? NP.usDiscoveryQuestions : NP.caDiscoveryQuestions;
}

export function npDiscoveryLessonsForRegion(region: MarketingRegionToggle): string {
  return region === "US" ? NP.usDiscoveryLessons : NP.caDiscoveryLessons;
}

export function npDiscoveryCatForRegion(region: MarketingRegionToggle): string {
  return region === "US" ? NP.usDiscoveryCat : NP.caDiscoveryCat;
}

export function alliedCareersMarketingUrl(): string {
  return ALLIED.marketingLanding();
}
