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

const PATH = "/canada/np/cnple/loft-exam";

const PAGE_TITLE =
  "CNPLE LOFT Exam Format — Linear On-the-Fly Testing Explained for Canadian NPs | NurseNest";

const PAGE_H1 = "CNPLE LOFT exam format: what linear on-the-fly testing means for your preparation";

const PAGE_DESCRIPTION =
  "The CNPLE uses LOFT — linear on-the-fly testing — not CAT. Understand how the fixed-length linear format changes your pacing strategy, endurance requirements, and simulation approach for the Canadian NP licensure examination.";

const FAQ_ITEMS = [
  {
    question: "What is LOFT testing?",
    answer:
      "LOFT stands for Linear On-the-Fly Testing. In a LOFT examination, every candidate receives a fixed-length set of items — the exam does not adapt to your performance and does not shut off early. Every question is presented and every question must be answered. The CNPLE uses LOFT rather than CAT (computerized adaptive testing). This is one of the most important format distinctions for candidates preparing for the CNPLE who may have previous experience preparing for the NCLEX, which uses CAT. The implications for pacing, stamina, and preparation strategy are significant. NurseNest is an independent prep platform and is not affiliated with CCRNR — always confirm exam format details at ccrnr.ca.",
  },
  {
    question: "What is the difference between LOFT and CAT on the NCLEX?",
    answer:
      "CAT (computerized adaptive testing) on the NCLEX selects each subsequent question based on your performance on previous questions. The exam shuts off when statistical confidence is reached — some candidates complete 70 to 80 questions, others 150 questions or more. With LOFT on the CNPLE, the examination is a fixed length and every candidate answers the same number of questions, regardless of performance. There is no early shutdown, no adaptive difficulty shift, and no confidence threshold. This means you cannot use a CAT-style strategy of front-loading performance — you must maintain consistent accuracy across the entire item set.",
  },
  {
    question: "How many questions are on the CNPLE?",
    answer:
      "CCRNR has not published confirmed item count details for the CNPLE as of 2026. NurseNest does not have access to confirmed CNPLE examination specifications beyond what is publicly available from CCRNR. For authoritative information about item count, time limit, and examination structure, consult ccrnr.ca and your provincial regulatory college. NurseNest simulation experiences are designed to build pacing discipline and endurance consistent with a full-length linear examination.",
  },
  {
    question: "How does LOFT format change how I should prepare?",
    answer:
      "Preparation for a LOFT examination must include explicit pacing and endurance practice. If you have primarily prepared with short question blocks (20 to 40 questions), you have not built the sustained concentration and consistent decision quality that a full-length linear examination demands. Add full-length timed simulation runs to your preparation — not as a final week activity but as a mid-preparation diagnostic and pressure-phase standard practice. Track where your concentration and pacing degrade across a full-length run, and address those patterns before exam day.",
  },
  {
    question: "Can I skip questions and come back on the CNPLE LOFT?",
    answer:
      "NurseNest does not have confirmed details about the CNPLE's specific item navigation rules (flag-and-return, linear-only, or other configurations). LOFT delivery systems can be configured differently. Confirm the specific navigation rules for the CNPLE examination directly with CCRNR at ccrnr.ca before your exam date, as this affects both your preparation strategy and your time-management approach on examination day.",
  },
];

const SECTIONS = [
  {
    id: "loft-vs-cat",
    heading: "LOFT vs. CAT: why the format distinction matters for CNPLE preparation",
    body: (
      <>
        <p>
          The most consequential misunderstanding among CNPLE candidates coming from NCLEX preparation
          backgrounds is treating LOFT and CAT preparation as interchangeable. They are not. CAT
          preparation is built around the strategic insight that performance in the first third of the
          examination carries the most weight for early shutdown, and that question volume is variable.
          LOFT preparation requires none of that strategic overlay and instead requires the more
          demanding discipline of maintaining consistent accuracy from item one to the final item of a
          fixed-length examination.
        </p>
        <p>
          Candidates who have used adaptive practice platforms that shut off at 75 to 100 questions
          have specifically not trained for the final third of a full-length linear examination. The
          fatigue, concentration degradation, and decision quality erosion that occur in the second half
          of a multi-hour linear examination are preparation targets that short-session and adaptive
          practice cannot address. This is why NurseNest builds full-length LOFT simulation into the
          CNPLE preparation framework — not as a mock experience but as an explicit pacing and endurance
          training mechanism.
        </p>
      </>
    ),
  },
  {
    id: "loft-pacing-strategy",
    heading: "Pacing strategy for the CNPLE LOFT examination",
    body: (
      <>
        <p>
          Pacing for a LOFT examination operates differently than for an adaptive examination. In CAT,
          spending extra time on early questions can influence difficulty calibration. In LOFT, every
          question is weighted equally and the examination delivers your item set regardless of how long
          you spend on any individual question. Your pacing discipline must therefore be managed
          against your total time budget, not against individual question strategy.
        </p>
        <p>
          Calculate your target time per question based on the total time allowed and item count once
          those details are confirmed with CCRNR. Track your pace against that target at regular
          intervals during a full-length simulation — typically at the one-quarter, one-half, and
          three-quarter marks. Most candidates who run short of time on LOFT examinations do not lose
          time uniformly across the examination — they lose it in concentrated bursts on two to five
          difficult questions where they exceed their target time significantly. Recognising when to
          make a decision and move on is a trainable skill, and it requires deliberate practice under
          realistic time pressure.
        </p>
        <p>
          If your simulation data shows consistent pacing deficit, the intervention is usually one of
          two things: you are spending too much time on questions where you genuinely do not know the
          answer (in which case, commit to your best answer and flag the question for return if
          navigation permits), or you are spending too much time re-reading and second-guessing
          questions where you know the answer but don't trust your first response. Both patterns are
          trainable through deliberate simulation practice before exam day.
        </p>
      </>
    ),
  },
  {
    id: "loft-endurance-preparation",
    heading: "Building endurance for the CNPLE LOFT format",
    body: (
      <>
        <p>
          Cognitive endurance for a multi-hour linear examination is not a fixed trait — it is a
          preparation outcome. Candidates who regularly practise in 20-minute blocks have not built
          the concentration and decision consistency that a full-length LOFT examination demands.
          This is not a criticism of short-session practice — domain-focused blocks are the right tool
          for building accuracy in specific areas. But they are not sufficient preparation for the
          format demands of the CNPLE by themselves.
        </p>
        <p>
          Add full-length timed simulation runs progressively through your preparation. The first run,
          typically in the breadth phase (weeks six to eight), should be treated as a diagnostic: note
          where your accuracy drops, where your pacing degrades, and where you start making the kinds
          of errors you would not make in a fresh 30-question block. The second and third runs, in the
          pressure phase, should incorporate your findings from the first: a targeted pacing strategy,
          deliberate attention to the domains where accuracy degrades under fatigue, and realistic
          examination-day conditions including managing nutrition, hydration, and a timed break
          schedule.
        </p>
        <p>
          Simulation runs the week before your examination should be reduced in intensity — two shorter
          mixed-domain sessions rather than full-length runs. The objective of the final week is
          confidence maintenance and pacing recall, not new learning. Arriving at the CNPLE with your
          most recent simulation run producing your highest pacing consistency is the preparation
          outcome to target in the final week.
        </p>
      </>
    ),
  },
  {
    id: "loft-common-errors",
    heading: "Common LOFT preparation errors for CNPLE candidates",
    body: (
      <>
        <p>
          The most common preparation error for CNPLE candidates with NCLEX backgrounds is not running
          a full-length simulation before examination day. Candidates consistently report that their
          first full-length linear simulation under real time pressure revealed pacing gaps and
          concentration degradation in the final third that were completely invisible in their
          domain-block practice sessions. Build your first full-length simulation into the preparation
          timeline early enough that you have weeks, not days, to address what it reveals.
        </p>
        <p>
          The second common error is treating any simulation score as a pass/fail prediction. CNPLE
          preparation simulation scores are training data, not pass probability estimates. Review every
          question in every simulation run — correct answers as well as misses. Look for patterns:
          domain-specific accuracy degradation in the second half of the examination is a different
          problem from global fatigue degradation, and each requires a different intervention.
        </p>
        <p>
          The third common error is calibrating preparation intensity to question count rather than to
          pattern improvement. Doing 1,000 questions with superficial review is categorically less
          valuable than doing 400 questions with full rationale review and deliberate pattern analysis.
          In a LOFT examination, the quality of your reasoning on each item matters more than the
          number of questions you have seen — because the examination has a fixed length and every
          item counts equally.
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
    "/canada/np/cnple/case-based-questions",
    "/canada/np/cnple/provisional-registration",
    "/cnple",
    "/cnple-simulation-exam",
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
          "CNPLE LOFT format",
          "CNPLE linear on-the-fly testing",
          "CNPLE exam format 2026",
          "LOFT vs CAT nursing exam",
          "CNPLE LOFT pacing strategy",
          "Canadian NP licensure exam format",
          "CCRNR LOFT examination",
          "CNPLE endurance preparation",
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
      routeGroup: "marketing.default.cnple.loft_exam",
    },
  );
}

export default function CnpleLoftExamPage() {
  return (
    <ExamClusterHubPage
      path={PATH}
      title={PAGE_TITLE}
      h1={PAGE_H1}
      eyebrow="CNPLE Exam Format 2026"
      lead={PAGE_DESCRIPTION}
      description={PAGE_DESCRIPTION}
      sections={SECTIONS}
      faq={FAQ_ITEMS}
      relatedLinks={RELATED_LINKS}
      breadcrumbs={cnpleHubClusterBreadcrumbs("LOFT Exam Format", PATH)}
      primaryCtaHref="/canada/np/cnple"
      primaryCtaLabel="CNPLE Prep Hub"
      secondaryCtaHref="/canada/np/cnple/study-guide"
      secondaryCtaLabel="Study Guide"
      ctaHeading="Prepare for the CNPLE LOFT format on NurseNest"
      ctaBody="Full-length LOFT simulation, domain-focused question blocks, and pacing diagnostics — designed specifically for the linear fixed-length format of the Canadian NP licensure examination."
      disclaimer={<CnpleProvisionalDisclaimer variant="card" hideWhenConfirmed={false} />}
    />
  );
}
