/**
 * SEO landing segments under `/{country}/np/{segment}` that are not canonical `examCode` keys
 * (e.g. `aanp-practice-test` → FNP pathway). Keeps strict public URLs without forking product rows.
 */
export type NpPracticeTestLandingCopy = {
  pathwayId: string;
  title: string;
  description: string;
  /** Replaces hub H1 when set */
  heroTitle: string;
  /** Replaces hub lead paragraph when set */
  heroLead: string;
  /** Visible H2 + paragraph under hero (keyword intent without duplicating a second page tree). */
  supportSectionHeading: string;
  supportSectionBody: string;
  /** Replaces “Everything for this exam…” heading on the hub body. */
  conversionSectionHeading: string;
  conversionSectionLead: string;
};

const byRouteKey = new Map<string, NpPracticeTestLandingCopy>();

function register(country: string, role: string, segment: string, copy: NpPracticeTestLandingCopy) {
  byRouteKey.set(`${country}/${role}/${segment}`, copy);
}

register("us", "np", "aanp-practice-test", {
  pathwayId: "us-np-fnp",
  title: "AANP Practice Test | Adaptive FNP Prep | NurseNest",
  description:
    "AANP-style FNP prep with pathway-scoped questions, lessons, and CAT practice tests. Start free, then unlock full adaptive sessions with a matching NP plan.",
  heroTitle: "AANP practice test & FNP adaptive prep",
  heroLead:
    "Train for the AANP FNP exam with the same NurseNest pathway as our Family NP hub: advanced practice items, structured lessons, flashcards, and computerized adaptive practice aligned to US NP preparation.",
  supportSectionHeading: "Same FNP pathway you use on the Family NP hub",
  supportSectionBody:
    "There is no separate question pool here—content, lessons, and CAT practice tests are the Family NP (`/us/np/fnp`) product track. This page is an AANP-oriented entry for search and sharing.",
  conversionSectionHeading: "Practice, lessons, and adaptive tests for US Family NP",
  conversionSectionLead:
    "Use the links below for pathway-scoped questions, structured lessons, pricing, timed mocks, and computerized adaptive sessions after you sign in.",
});

register("us", "np", "ancc-fnp-practice-test", {
  pathwayId: "us-np-fnp",
  title: "ANCC FNP Practice Test | Adaptive Exam Prep | NurseNest",
  description:
    "ANCC FNP-focused practice with adaptive test sessions, clinical management depth, and a full question bank scoped to the Family NP track.",
  heroTitle: "ANCC FNP practice test & adaptive prep",
  heroLead:
    "Prepare for the ANCC Family Nurse Practitioner exam using NurseNest’s FNP pathway—lessons, flashcards, and CAT-style practice tests built for US candidates.",
  supportSectionHeading: "ANCC FNP candidates use the Family NP track",
  supportSectionBody:
    "Board names differ; the underlying NurseNest pathway is Family NP. You get the same lessons, bank, and CAT practice as `/us/np/fnp`—this URL is tailored for ANCC search intent.",
  conversionSectionHeading: "ANCC-aligned prep in one NurseNest workflow",
  conversionSectionLead:
    "Questions, lessons, flashcards, and adaptive practice tests stay scoped to US Family NP. Subscribe on the NP tier that matches your profile country.",
});

register("us", "np", "pmhnp-practice-test", {
  pathwayId: "us-np-pmhnp",
  title: "PMHNP Practice Test | Adaptive Psych NP Prep | NurseNest",
  description:
    "Psychiatric-Mental Health NP practice: assessment, psychopharmacology, and therapeutic standards with adaptive sessions and pathway-scoped content.",
  heroTitle: "PMHNP practice test & adaptive prep",
  heroLead:
    "PMHNP candidates get a dedicated hub—questions, lessons, and computerized adaptive practice scoped to psychiatric-mental health NP preparation (not shared with FNP or AGPCNP tracks).",
  supportSectionHeading: "Psychiatric–mental health NP, not mixed with FNP",
  supportSectionBody:
    "Items and lessons map to the PMHNP pathway (`/us/np/pmhnp`). Use this page when you want a PMHNP keyword entry; everything below still routes through that single product track.",
  conversionSectionHeading: "PMHNP question bank, lessons, and CAT practice",
  conversionSectionLead:
    "Open the bank for reps, lessons for systems depth, then adaptive practice tests in the app when you are on a matching NP plan.",
});

register("canada", "np", "cnple-practice-test", {
  pathwayId: "ca-np-cnple",
  title: "CNPLE Practice Test | Canadian NP Prep | NurseNest",
  description:
    "Canadian NP preparation hub: pathway-scoped content and practice as national CNPLE integration evolves. Join waitlist or study active tracks in parallel.",
  heroTitle: "CNPLE practice test & Canadian NP prep",
  heroLead:
    "NurseNest’s Canadian NP pathway keeps copy and content scoped for CNPLE-oriented candidates. Exam branding and registration rules can change—this hub stays current as requirements finalize.",
  supportSectionHeading: "Canadian NP / CNPLE context in one pathway",
  supportSectionBody:
    "This URL mirrors the Canadian NP hub (`/canada/np/cnple`)—one pathway row, one entitlement scope. Use it when readers search for CNPLE by name.",
  conversionSectionHeading: "Questions, lessons, and plans for Canadian NP",
  conversionSectionLead:
    "Explore pathway-scoped content from here; checkout still uses your NP tier for Canada when the pathway is active.",
});

export function getNpPracticeTestLandingCopy(
  countrySlug: string,
  roleTrack: string,
  segment: string,
): NpPracticeTestLandingCopy | undefined {
  return byRouteKey.get(`${countrySlug}/${roleTrack}/${segment}`);
}

/** Stable list for sitemaps (US + Canada NP SEO entries). */
export function listNpPracticeTestSegmentPaths(): { countrySlug: string; roleTrack: string; segment: string }[] {
  return [
    { countrySlug: "us", roleTrack: "np", segment: "aanp-practice-test" },
    { countrySlug: "us", roleTrack: "np", segment: "ancc-fnp-practice-test" },
    { countrySlug: "us", roleTrack: "np", segment: "pmhnp-practice-test" },
    { countrySlug: "canada", roleTrack: "np", segment: "cnple-practice-test" },
  ];
}
