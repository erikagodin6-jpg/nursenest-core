import type { Metadata } from "next";
import { CnpleSeoHubPage, CNPLE_RELATED_LINKS } from "@/components/cnple/cnple-seo-hub-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";

export const revalidate = 86400;

const PATH = "/cnple-clinical-judgment";
const PAGE_TITLE = "CNPLE Clinical Judgment — Canadian NP Exam Reasoning Practice | NurseNest";
const PAGE_H1 = "CNPLE clinical judgment practice for Canadian nurse practitioners";
const PAGE_DESCRIPTION =
  "CNPLE-aligned clinical judgment practice targeting the advanced diagnostic reasoning, differential diagnosis, and autonomous decision-making that Canadian NP licensure demands. Domain-targeted questions with rationale-rich feedback.";

const FAQ_ITEMS = [
  {
    question: "What does clinical judgment mean on the CNPLE?",
    answer:
      "CNPLE clinical judgment refers to the advanced reasoning process Canadian NPs use to assess, diagnose, prescribe, manage, and evaluate care independently. The exam tests how candidates integrate history, physical findings, diagnostics, and Canadian clinical guidelines into a best-supported decision — not just recalling isolated facts.",
  },
  {
    question: "How is NP clinical judgment different from RN clinical judgment?",
    answer:
      "NP-level judgment includes autonomous diagnosis, initiation and modification of treatment plans, prescribing within legislated scope, and advanced follow-up decision-making. NCLEX-RN tests clinical judgment within delegated RN scope. The CNPLE tests these at the full NP autonomous practice level — a materially different reasoning demand.",
  },
  {
    question: "What clinical judgment question types appear on the CNPLE?",
    answer:
      "CNPLE-aligned clinical judgment items include single-best-answer diagnostic questions, select-all-that-apply management decisions, clinical case clusters with evolving data, and questions requiring integration of labs, history, and examination findings to reach a management plan. NurseNest does not claim to replicate official item types that have not been confirmed by CCRNR.",
  },
  {
    question: "How should I practise clinical judgment for the CNPLE?",
    answer:
      "Work through clinical case clusters rather than isolated recall questions. After answering, read rationales actively: understand why the best answer was chosen and why distractors fail. Use the CNPLE simulation for timed integrated practice, then follow up on weak domains through targeted lessons and flashcards.",
  },
];

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
          "CNPLE clinical judgment",
          "Canadian NP clinical reasoning",
          "Canadian NP exam reasoning",
          "Canadian NP clinical judgment exam",
          "CNPLE decision-making",
          "Canadian NP diagnostic reasoning",
          "NP exam Canada clinical judgment",
        ],
        openGraph: {
          title: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          url: alt.canonical,
          type: "article",
          siteName: "NurseNest",
        },
        twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESCRIPTION },
      };
    },
    { pathname: PATH, locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.cnple_seo_hub" },
  );
}

export default function CnpleClinicalJudgmentPage() {
  return (
    <CnpleSeoHubPage
      path={PATH}
      title={PAGE_TITLE}
      h1={PAGE_H1}
      description={PAGE_DESCRIPTION}
      lead="CNPLE-aligned clinical judgment practice targeting advanced diagnostic reasoning, differential diagnosis, and autonomous decision-making. The CNPLE demands more than RN-scope judgment — it requires the full depth of independent NP practice."
      faq={FAQ_ITEMS}
      primaryCtaHref="/canada/np/cnple"
      primaryCtaLabel="CNPLE Hub"
      secondaryCtaHref="/canada/np/cnple/simulation"
      secondaryCtaLabel="CNPLE Simulation"
      relatedLinks={[
        CNPLE_RELATED_LINKS[0],
        CNPLE_RELATED_LINKS[1],
        CNPLE_RELATED_LINKS[3],
        CNPLE_RELATED_LINKS[5],
        CNPLE_RELATED_LINKS[9],
        CNPLE_RELATED_LINKS[10],
        CNPLE_RELATED_LINKS[11],
        CNPLE_RELATED_LINKS[12],
        CNPLE_RELATED_LINKS[13],
      ]}
      sections={[
        {
          id: "np-vs-rn-judgment",
          heading: "Clinical judgment at NP scope: what the CNPLE actually tests",
          body: (
            <>
              <p>
                The CNPLE assesses clinical judgment at the level of independent NP practice — a
                materially different bar than NCLEX-RN or REx-PN. Canadian NPs hold the authority
                to assess, diagnose, prescribe within legislated scope, order and interpret
                diagnostics, initiate and modify therapeutic plans, and evaluate outcomes without
                physician oversight. Every item on the CNPLE is written to test whether a candidate
                can exercise that authority safely.
              </p>
              <p>
                This means CNPLE clinical judgment questions will not ask what the RN should report
                to the physician. They will ask what the NP should prescribe, how the NP should
                adjust management when the initial plan fails, which differential the NP should
                pursue first, and when the NP must refer rather than manage independently. The shift
                in who holds the decision is the defining difference.
              </p>
              <p>
                Candidates who prepare using only NCLEX-RN materials often under-prepare for this
                autonomy dimension. CNPLE-aligned practice surfaces this gap by presenting questions
                where the decision rests entirely with the NP — not a physician to defer to.
              </p>
            </>
          ),
        },
        {
          id: "how-cnple-tests-reasoning",
          heading: "How the CNPLE tests clinical reasoning",
          body: (
            <>
              <p>
                CNPLE clinical reasoning items use realistic patient presentations — not contrived
                isolated recall. A question may present a 54-year-old with three months of fatigue,
                unexplained weight loss, and new hypertension, and ask the NP to identify the
                highest-priority next step in assessment. The answer requires integrating the
                symptom cluster, ruling out sinister causes, and selecting the appropriate
                diagnostic workup — not memorising a single fact.
              </p>
              <p>
                Clinical case clusters intensify this demand. A cluster presents an evolving
                patient across multiple items: initial presentation, lab results, an unexpected
                finding, and a follow-up decision. Each item builds on the one before, requiring
                the candidate to maintain a coherent mental model of the patient rather than
                approaching each question in isolation.
              </p>
              <p>
                CNPLE-aligned practice on NurseNest targets this integrated reasoning approach.
                Items are tagged to clinical judgment domains — diagnostics, prescribing, follow-up,
                referral — so study sessions can target gaps deliberately rather than rotating
                through broad content passively.
              </p>
            </>
          ),
        },
        {
          id: "deliberate-practice",
          heading: "Developing clinical judgment through deliberate practice",
          body: (
            <>
              <p>
                Clinical judgment improves faster with rationale-rich feedback than with volume
                alone. After answering a question, the high-yield move is to read the rationale for
                every option — not just the correct one. Understanding why the three distractors are
                wrong is often more instructive than confirming why the right answer is right.
              </p>
              <p>
                Weak-domain identification is essential. After a practice session or simulation,
                examine which domains produced the most errors: Was it differential diagnosis? Lab
                interpretation? Prescribing safety? Acute deterioration recognition? Each gap
                points to a different remediation path: targeted lessons for conceptual gaps,
                flashcards for recall, and additional case clusters for integrated application.
              </p>
            </>
          ),
        },
        {
          id: "common-errors",
          heading: "Common clinical judgment errors in NP exam scenarios",
          body: (
            <>
              <p>
                The most common clinical judgment error in NP-level exam preparation is defaulting
                to RN-scope answers — choosing to monitor or report rather than to diagnose and
                initiate. Candidates trained heavily on NCLEX-RN content must actively recalibrate
                their decision threshold upward to NP autonomy.
              </p>
              <p>
                A second common error is over-testing: ordering more diagnostics than the clinical
                picture warrants. High-value NP judgment includes knowing when the presentation is
                sufficiently clear to act without further testing, and when targeted investigation
                changes management more than broad panels do.
              </p>
              <p>
                A third pitfall is ignoring red flags in the stem. CNPLE cases embed must-not-miss
                findings — unexplained weight loss, new neurological symptoms, atypical chest pain
                characteristics — that should trigger a different diagnostic pathway than the
                straightforward presentation initially suggests. Systematic red-flag identification
                is a trained skill, not an automatic reflex, and deliberate practice with
                case-based items builds it.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
