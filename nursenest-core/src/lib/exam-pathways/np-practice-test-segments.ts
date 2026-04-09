/**
 * SEO landing segments under `/{country}/np/{segment}` that are not canonical `examCode` keys
 * (e.g. `aanp-practice-test` → FNP pathway). Keeps strict public URLs without forking product rows.
 *
 * ## Canonical URL policy (marketing, no duplicate trees)
 *
 * - **Alias hub overview** (`/us/np/aanp-practice-test`, …): **self-canonical** — `generateMetadata` on the overview
 *   page points `rel=canonical` at the alias URL and uses alias-specific title/description.
 * - **All deeper routes** (lessons hub, lesson detail, topic clusters, questions, pricing): **consolidate to the core
 *   pathway URL** — `rel=canonical` is always `buildExamPathwayPath(pathway, …)` (e.g. `/us/np/fnp/lessons/...`).
 *   Users may still browse under an alias path; search engines consolidate rank to the canonical examCode URL.
 * - **Breadcrumb JSON-LD**: on the **alias overview only**, pass `hubBasePath` so crumbs match the keyword URL.
 *   On **subpages** (lessons, topics, questions, pricing), omit `hubBasePath` so crumbs and schema use the same URLs as
 *   `rel=canonical` (core pathway tree). See `np-seo-alias-canonical-policy.ts`.
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

register("us", "np", "agpcnp-practice-test", {
  pathwayId: "us-np-agpcnp",
  title: "AGPCNP Practice Test | Adult-Gerontology Primary Care NP | NurseNest",
  description:
    "AGPCNP-oriented prep: adult and gerontology primary care depth with pathway-scoped questions, lessons, and adaptive practice tests.",
  heroTitle: "AGPCNP practice test & primary care prep",
  heroLead:
    "Adult–gerontology primary care NP candidates use the AGPCNP pathway—items and lessons are not shared with FNP, WHNP, PNP-PC, or PMHNP hubs.",
  supportSectionHeading: "Dedicated AGPCNP product track",
  supportSectionBody:
    "This keyword entry resolves to `/us/np/agpcnp`—one pathway row, one entitlement scope. Deeper routes canonicalize to the core examCode URL per NP SEO policy.",
  conversionSectionHeading: "AGPCNP bank, lessons, and CAT practice",
  conversionSectionLead:
    "Open questions for reps, lessons for systems depth, then adaptive tests in the app on a matching NP subscription.",
});

register("us", "np", "whnp-practice-test", {
  pathwayId: "us-np-whnp",
  title: "WHNP Practice Test | Women’s Health NP Prep | NurseNest",
  description:
    "Women’s Health NP preparation with pathway-scoped lessons, questions, and adaptive sessions aligned to WHNP boards.",
  heroTitle: "WHNP practice test & women’s health NP prep",
  heroLead:
    "WHNP candidates get a dedicated hub—reproductive health, pregnancy-related primary care, and gynecology stay scoped to this pathway (not FNP or PMHNP).",
  supportSectionHeading: "Women’s Health NP, pathway-scoped",
  supportSectionBody:
    "Board names differ; NurseNest keeps WHNP on `/us/np/whnp`. This URL is for search and sharing; subpages consolidate canonical URLs like other NP tracks.",
  conversionSectionHeading: "WHNP lessons, bank, and adaptive tests",
  conversionSectionLead:
    "Use the links below for pathway-scoped study modes, then sign in for full adaptive depth on an NP plan.",
});

register("us", "np", "pnp-pc-practice-test", {
  pathwayId: "us-np-pnp-pc",
  title: "PNP-PC Practice Test | Pediatric Primary Care NP | NurseNest",
  description:
    "Pediatric primary care NP prep: growth, development, immunizations, and common outpatient conditions with pathway-scoped content.",
  heroTitle: "PNP-PC practice test & pediatric primary care prep",
  heroLead:
    "PNP-PC uses its own hub—pediatric primary care depth without mixing adult AGPCNP framing or WHNP women’s health lanes.",
  supportSectionHeading: "Pediatric primary care NP track",
  supportSectionBody:
    "This page maps to `/us/np/pnp-pc`. Content, lessons, and the question bank filter to the PNP-PC pathway id for entitlements and analytics.",
  conversionSectionHeading: "PNP-PC bank, lessons, and CAT practice",
  conversionSectionLead:
    "Start with lessons and pathway questions; unlock full adaptive sessions after sign-in on a matching NP tier.",
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
    { countrySlug: "us", roleTrack: "np", segment: "agpcnp-practice-test" },
    { countrySlug: "us", roleTrack: "np", segment: "whnp-practice-test" },
    { countrySlug: "us", roleTrack: "np", segment: "pnp-pc-practice-test" },
    { countrySlug: "us", roleTrack: "np", segment: "pmhnp-practice-test" },
    { countrySlug: "canada", roleTrack: "np", segment: "cnple-practice-test" },
  ];
}
