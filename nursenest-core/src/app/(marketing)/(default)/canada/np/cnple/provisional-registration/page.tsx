import type { Metadata } from "next";
import { ExamClusterHubPage } from "@/components/seo/exam-cluster-hub-page";
import { CnpleProvisionalDisclaimer } from "@/components/cnple/cnple-provisional-disclaimer";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";
import { cnpleHubClusterBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { CNPLE_HUB_RELATED_LINKS } from "@/lib/seo/cnple-seo-cluster";

export const revalidate = 86400;

const PATH = "/canada/np/cnple/provisional-registration";

const PAGE_TITLE =
  "CNPLE Provisional Registration — Pathway, Eligibility, and Timeline for Canadian NPs | NurseNest";

const PAGE_H1 = "CNPLE provisional registration: eligibility, provincial rules, and next steps";

const PAGE_DESCRIPTION =
  "Understanding the provisional registration pathway for Canadian nurse practitioners preparing for the CNPLE — jurisdiction-specific eligibility, permitted practice during registration, and CCRNR examination timelines.";

const DISCLAIMER_NOTICE = (
  <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
    <strong>Regulatory information disclaimer:</strong> Provisional registration rules and CNPLE eligibility
    requirements are set by each provincial and territorial regulatory college, not by NurseNest. Requirements
    vary by jurisdiction and change over time. Always confirm current eligibility, application processes, and
    provisional practice rights directly with your provincial college and CCRNR (ccrnr.ca).
    NurseNest is an independent exam prep platform and is not affiliated with CCRNR or any provincial regulatory body.
  </p>
);

const FAQ_ITEMS = [
  {
    question: "What is provisional registration for NPs in Canada?",
    answer:
      "Provisional registration is a temporary registration status granted by provincial and territorial regulatory colleges that allows NP graduates to begin practising while they complete the requirements for full registration — including passing the CNPLE. The specific terms of provisional registration, including what practice is permitted, under what supervision if any, and for how long, vary by province and territory. Some jurisdictions require supervised practice during the provisional period; others permit independent practice within defined parameters. Confirm the specific rules for your province directly with your regulatory college.",
  },
  {
    question: "Can I practise as an NP in Canada before passing the CNPLE?",
    answer:
      "This depends on your province or territory. Many jurisdictions offer provisional or conditional registration that allows graduates of approved NP programmes to practise — often with restrictions — while awaiting the CNPLE. The exact scope of permitted practice, any supervision requirements, and the duration of provisional status differ across jurisdictions. Because the CNPLE is a relatively new national examination with a target 2026 live date, some provincial colleges are in transition periods. Confirm current rules directly with your provincial regulatory college.",
  },
  {
    question: "What are the eligibility requirements for the CNPLE?",
    answer:
      "Eligibility requirements are set by CCRNR and by individual provincial and territorial regulatory colleges. Generally, candidates must have completed an approved NP educational programme in Canada and meet their jurisdiction's registration requirements. Because the CNPLE is a new national examination replacing previous provincial examinations, eligibility details are subject to change as participating jurisdictions finalise their adoption timelines. Always verify current eligibility requirements directly with CCRNR at ccrnr.ca and with your provincial college.",
  },
  {
    question: "Which provinces and territories use the CNPLE?",
    answer:
      "CCRNR (Canadian Council of Registered Nurse Regulators) is coordinating the CNPLE as a national examination for NP entry to practice across Canada. Adoption timelines and participation vary by provincial and territorial regulatory college. The CNPLE is designed to replace separate provincial NP examinations across participating jurisdictions. The specific adoption timeline for your province or territory should be confirmed directly with your regulatory college and CCRNR.",
  },
  {
    question: "How long does provisional registration typically last?",
    answer:
      "The duration of provisional registration varies by jurisdiction and is typically tied to completion of remaining registration requirements, including the CNPLE. Some provinces set a specific time limit (such as 12 to 24 months); others tie the provisional period to the next available examination sitting or to successful completion of examination. Check with your provincial college for the current rules in your jurisdiction.",
  },
];

const SECTIONS = [
  {
    id: "provisional-registration-overview",
    heading: "Understanding the provisional registration pathway",
    body: (
      <>
        <p>
          The transition from NP student to registered nurse practitioner in Canada involves a regulatory
          pathway that most programmes explain in general terms but that candidates often need to navigate
          in detail as graduation approaches. Provisional registration is the mechanism that many provinces
          use to allow NP graduates to begin practising — or to practise with defined restrictions — while
          they complete the remaining requirements for full registration, with the CNPLE being the primary
          examination requirement that the provisional period bridges.
        </p>
        <p>
          Because the CNPLE is a new national examination, the provisional registration landscape is
          actively evolving as provincial colleges align their registration pathways with the new national
          standard. Some jurisdictions that previously used provincial NP examinations are in transition
          periods, and the specific rules for provisional registration, examination scheduling, and
          registration completion timelines may differ from what candidates who graduated one or two years
          earlier experienced. NurseNest provides this page as educational context only — the authoritative
          source for your jurisdiction's current rules is your provincial regulatory college.
        </p>
      </>
    ),
  },
  {
    id: "provisional-by-province",
    heading: "Provincial variation in provisional NP registration",
    body: (
      <>
        <p>
          Provincial regulatory colleges set their own provisional registration requirements within the
          framework of their enabling legislation. Common dimensions along which provinces differ include:
          whether provisional registration permits full NP scope of practice or a restricted scope;
          whether collaborative practice or physician supervision is required during the provisional
          period; what documentation of practice setting or employer confirmation is required at
          registration; and how long the provisional period extends before a re-application or lapse
          consequence is triggered.
        </p>
        <p>
          Ontario's College of Nurses of Ontario, British Columbia's BCCNM, Alberta's CARNA, and other
          provincial colleges each publish their own registration requirements and provisional practice
          rules. These documents are updated as examination timelines are confirmed and as the CNPLE
          replaces legacy provincial examinations. Because NurseNest is not a regulatory body and is not
          affiliated with CCRNR or any provincial college, we strongly recommend reviewing your specific
          jurisdiction's published registration requirements directly rather than relying on any
          third-party summary.
        </p>
        <p>
          If you are a recent NP graduate who completed your programme outside the province where you
          intend to register, the registration pathway includes a mutual recognition or endorsement
          process. Canadian NP registration is not automatically transferable across provincial lines,
          and the CNPLE is intended in part to create a unified national standard that simplifies
          interprovincial mobility — but the specific endorsement requirements of your destination
          province still apply. Confirm these requirements before relocating or beginning an employment
          process in a new province.
        </p>
      </>
    ),
  },
  {
    id: "cnple-eligibility-and-scheduling",
    heading: "CNPLE eligibility, application, and examination scheduling",
    body: (
      <>
        <p>
          CCRNR administers the CNPLE examination process. Eligibility is typically confirmed through
          your provincial regulatory college, which submits verification to CCRNR as part of the
          examination registration process. The specific application timeline — when you can apply, when
          results are available, and how quickly registration status is updated after passing — is
          confirmed through your provincial college and CCRNR directly.
        </p>
        <p>
          Examination scheduling operates through the LOFT (linear on-the-fly testing) delivery system.
          Testing locations and scheduling windows are confirmed through CCRNR and its examination
          delivery partners. Unlike the NCLEX, which is delivered through Pearson VUE and widely
          available through a large national network of test centres, the CNPLE's delivery infrastructure
          is being confirmed as the examination reaches its 2026 live date. Check ccrnr.ca for current
          scheduling information and test centre availability in your region.
        </p>
        <p>
          Candidates who do not pass the CNPLE on their first attempt should confirm re-examination
          eligibility and waiting period requirements with their provincial college. Provincial rules
          about how many attempts are permitted, whether additional education or supervised practice is
          required before re-examination, and whether provisional registration status is affected by an
          unsuccessful attempt vary by jurisdiction.
        </p>
      </>
    ),
  },
  {
    id: "preparing-during-provisional",
    heading: "Preparing for the CNPLE during a provisional registration period",
    body: (
      <>
        <p>
          One of the most common preparation challenges for CNPLE candidates is managing examination
          preparation alongside clinical practice during the provisional period. Working full-time as a
          practitioner while preparing for a high-stakes licensure examination is demanding, and the
          cognitive load of NP-level clinical decision-making does not easily substitute for structured
          examination preparation. Clinical experience builds depth in your daily patient population but
          does not automatically address the breadth of domains, the Canadian guideline calibration, or
          the LOFT format pacing that the CNPLE demands.
        </p>
        <p>
          Candidates in provisional practice typically prepare more effectively with a structured weekly
          study commitment of six to ten hours over a 16 to 20 week timeline than with an unstructured
          approach that relies on clinical immersion. Use your diagnostic baseline session early to
          identify which domains your clinical practice is not covering, and prioritise those gaps in
          your study blocks rather than spending preparation time in the domains where daily practice
          already provides reinforcement.
        </p>
        <p>
          Inform your employer of your examination timeline if you anticipate needing protected study
          time or a modified schedule in the final preparation weeks. Many health organisations that
          employ provisionally registered NPs are aware of the examination requirement and are prepared
          to accommodate reasonable preparation needs. Candidates who attempt to maintain full clinical
          hours while compressing their final preparation phase consistently report inadequate pacing
          preparation and inadequate simulation exposure as the primary gaps they wish they had addressed.
        </p>
      </>
    ),
  },
];

const RELATED_LINKS = CNPLE_HUB_RELATED_LINKS.filter((l) =>
  [
    "/canada/np/cnple",
    "/canada/np/cnple/questions",
    "/canada/np/cnple/study-guide",
    "/canada/np/cnple/loft-exam",
    "/canada/np/cnple/case-based-questions",
    "/cnple",
    "/cnple-practice-questions",
  ].includes(l.href),
);

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, PATH);
      return {
        title: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: robotsForRegionalMarketingHub("canada"),
        keywords: [
          "CNPLE provisional registration",
          "Canadian NP provisional registration",
          "NP registration Canada CNPLE",
          "CCRNR provisional NP",
          "Canadian nurse practitioner registration pathway",
          "CNPLE eligibility requirements",
          "NP provisional practice Canada",
        ],
        openGraph: {
          title: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          url: alt.canonical,
          type: "article",
          siteName: "NurseNest",
        },
        twitter: {
          card: "summary_large_image",
          title: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
        },
      };
    },
    {
      pathname: PATH,
      locale: DEFAULT_MARKETING_LOCALE,
      routeGroup: "marketing.default.cnple.provisional_registration",
    },
  );
}

export default function CnpleProvisionalRegistrationPage() {
  return (
    <ExamClusterHubPage
      path={PATH}
      title={PAGE_TITLE}
      h1={PAGE_H1}
      eyebrow="CNPLE Registration Pathway 2026"
      lead={PAGE_DESCRIPTION}
      description={PAGE_DESCRIPTION}
      sections={SECTIONS}
      faq={FAQ_ITEMS}
      relatedLinks={RELATED_LINKS}
      breadcrumbs={cnpleHubClusterBreadcrumbs("Provisional Registration", PATH)}
      primaryCtaHref="/canada/np/cnple"
      primaryCtaLabel="CNPLE Prep Hub"
      secondaryCtaHref="/canada/np/cnple/study-guide"
      secondaryCtaLabel="Study Guide"
      ctaHeading="Prepare for the CNPLE during your provisional period"
      ctaBody="Structured CNPLE preparation designed for working NPs — domain-focused question blocks, Canadian guideline content, and full LOFT simulation — built to fit alongside clinical practice."
      disclaimer={DISCLAIMER_NOTICE}
    />
  );
}
