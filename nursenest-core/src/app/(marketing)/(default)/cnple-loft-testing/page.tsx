import type { Metadata } from "next";
import { CnpleSeoHubPage, CNPLE_RELATED_LINKS } from "@/components/cnple/cnple-seo-hub-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const revalidate = 86400;

const PATH = "/cnple-loft-testing";
const PAGE_TITLE = "LOFT Testing Explained — How the CNPLE Exam Format Works | NurseNest";
const PAGE_H1 = "LOFT testing explained: how the CNPLE exam format works";
const PAGE_DESCRIPTION =
  "The CNPLE uses LOFT (linear on-the-fly testing), not adaptive CAT. Understand how fixed-length linear testing differs from NCLEX, why it changes your simulation strategy, and what pacing discipline it demands.";

const FAQ_ITEMS = [
  {
    question: "What does LOFT stand for?",
    answer:
      "LOFT stands for linear on-the-fly testing. It is an exam delivery model in which candidates receive a pre-selected fixed set of items in a sequential linear order. Unlike CAT (computerized adaptive testing), the item set does not change based on the candidate's performance during the exam.",
  },
  {
    question: "Is the CNPLE adaptive like NCLEX?",
    answer:
      "No. The CNPLE uses LOFT, not CAT. NCLEX-RN and REx-PN use computerized adaptive testing where item difficulty shifts based on your responses and the exam can terminate early. The CNPLE delivers a fixed number of items to every candidate regardless of performance — there is no early termination and no real-time adaptation.",
  },
  {
    question: "Does LOFT mean the exam is harder than NCLEX?",
    answer:
      "LOFT versus CAT is a format distinction, not a difficulty distinction. The CNPLE tests advanced practice NP scope, which is clinically broader and deeper than NCLEX-RN registered nurse scope. The format itself — fixed length, no adaptation — adds a pacing and endurance challenge that adaptive tests do not impose in the same way.",
  },
  {
    question: "How should I pace myself in a LOFT exam?",
    answer:
      "Divide your total time budget evenly across all items. Unlike CAT, where early items are algorithmically weighted and strategic early-item focus makes sense, LOFT demands consistent pacing throughout. Reserve time-flagging only for items where you need to return — do not allow any section of the exam to consume a disproportionate time budget.",
  },
  {
    question: "How do I practice for the LOFT format?",
    answer:
      "Practice with full-length timed simulation runs that match the fixed item count and time limit. Avoid using short adaptive-style drills as your primary simulation tool — they do not build the endurance and even pacing that LOFT demands. NurseNest CNPLE simulation sessions are designed as fixed-length timed runs.",
  },
];

const SECTIONS = [
  {
    id: "loft-vs-cat",
    heading: "LOFT vs CAT: the core difference",
    body: (
      <>
        <p>
          Most Canadian nursing candidates encounter computerized adaptive testing (CAT) first — through NCLEX-RN or
          REx-PN. In a CAT exam, a psychometric algorithm selects each subsequent item based on your performance on
          previous items. If you answer correctly, the next item is harder; if incorrectly, easier. The exam can
          terminate as few as 70–85 items (NCLEX-RN) once the algorithm reaches a reliable competence estimate.
        </p>
        <p>
          The CNPLE uses LOFT — linear on-the-fly testing. The exam engine pre-assembles a complete item set before
          the test begins. Every candidate receives a fixed number of items regardless of how they perform. There is
          no real-time adaptation, no algorithmic item selection mid-exam, and no early termination. You answer every
          item in the pre-selected sequence.
        </p>
        <p>
          This distinction has direct preparation implications. In CAT, your early performance has outsized
          algorithmic importance. In LOFT, every item carries equal weight — your score reflects consistent
          performance across the full test, not peak performance in a strategic early window.
        </p>
      </>
    ),
  },
  {
    id: "loft-pacing-strategy",
    heading: "Pacing strategy for a LOFT exam",
    body: (
      <>
        <p>
          The CNPLE delivers a fixed number of items within a defined time limit. Assume an even time budget per
          item as your default pacing anchor. In the absence of official item-count disclosure from CCRNR, NurseNest
          models CNPLE simulation as a 150-item, 240-minute exam — approximately 96 seconds per item on average.
          Adjust if CCRNR publishes updated specifications.
        </p>
        <p>
          Unlike CAT pacing, where strategic slowing on early high-stakes items can be rational, LOFT pacing must
          be even. Allow yourself to flag uncertain items and return within the remaining time — but do not allow
          any cluster of difficult items to consume more than its proportional time share. Candidates who slow
          significantly in the first third of a LOFT exam routinely run out of time in the final third.
        </p>
        <p>
          Build pacing discipline through full-length simulation runs. Short domain practice blocks are excellent
          for knowledge and reasoning development but do not train pacing endurance. Only full-length timed runs
          expose the specific pacing failures that LOFT format punishes.
        </p>
      </>
    ),
  },
  {
    id: "loft-endurance",
    heading: "Endurance: the LOFT challenge CAT candidates underestimate",
    body: (
      <>
        <p>
          Candidates who have only written CAT exams frequently underestimate the cognitive endurance required for
          a fixed-length LOFT examination. CAT exams can terminate after 70 items for a proficient candidate.
          LOFT exams run to the full item count regardless of performance. The final third of a long fixed-length
          exam is where cognitive fatigue creates the highest miss density — for most candidates, accuracy
          measurably degrades between item 100 and item 150 when preparation has not included full-length runs.
        </p>
        <p>
          To build endurance: complete at least three full-length timed simulation runs before your exam date. Do
          not truncate runs at item 85 or 100 because you feel your score is "good enough." Practice completing
          the full item sequence under realistic time pressure. Your clinical judgment at item 140 is the thing
          being trained, not your clinical judgment at item 40.
        </p>
        <p>
          Recovery strategies matter too. After a slow or difficult cluster mid-exam, return to your average pace
          rather than attempting to compensate with faster answering — rushed decisions in the back half of a
          LOFT exam compound errors rather than recover them.
        </p>
      </>
    ),
  },
  {
    id: "loft-simulation-approach",
    heading: "How to use CNPLE simulation correctly for LOFT preparation",
    body: (
      <>
        <p>
          NurseNest CNPLE simulation sessions are designed as fixed-length timed runs to match the LOFT format.
          When you run a simulation session:
        </p>
        <p>
          Use the time display to track pacing at item 50, 100, and 125 checkpoints. At each checkpoint, calculate
          your remaining time per remaining item and compare it to your target pace. If you are behind, identify
          whether you are spending disproportionate time on a specific question type — clinical vignettes,
          prescribing safety stems, or multi-part cases — and adjust your reading strategy for the remaining items.
        </p>
        <p>
          After each simulation run, tag every miss by error type: knowledge gap, clinical reasoning error,
          reading error, or pacing-driven rushed selection. Track these tags across successive runs. A narrowing
          distribution of pacing errors specifically indicates that your LOFT pacing discipline is improving,
          independent of knowledge gains. That narrowing is your readiness signal.
        </p>
      </>
    ),
  },
];

const RELATED = CNPLE_RELATED_LINKS.filter((l) =>
  [
    "/cnple",
    "/cnple-simulation-exam",
    "/cnple-study-guide",
    "/cnple-practice-questions",
    "/canada/np/cnple",
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
        keywords: [
          "LOFT testing CNPLE",
          "linear on the fly testing nursing",
          "CNPLE exam format",
          "CNPLE vs NCLEX format",
          "CNPLE adaptive testing",
          "CNPLE fixed length exam",
          "CNPLE simulation strategy",
        ],
        openGraph: { title: PAGE_TITLE, description: PAGE_DESCRIPTION, url: alt.canonical, type: "article", siteName: "NurseNest" },
        twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESCRIPTION },
      };
    },
    { pathname: PATH, locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.cnpleLoftTesting" },
  );
}

export default function CnpleLoftTestingPage() {
  return (
    <CnpleSeoHubPage
      path={PATH}
      title={PAGE_TITLE}
      h1={PAGE_H1}
      description={PAGE_DESCRIPTION}
      lead="The CNPLE uses LOFT — linear on-the-fly testing — not the adaptive CAT format familiar from NCLEX. This distinction fundamentally changes how you should simulate, pace, and build endurance for the Canadian NP licensure exam."
      sections={SECTIONS}
      faq={FAQ_ITEMS}
      relatedLinks={RELATED}
      primaryCtaHref="/canada/np/cnple/simulation"
      primaryCtaLabel="Start CNPLE Simulation"
      secondaryCtaHref="/cnple-simulation-exam"
      secondaryCtaLabel="Simulation Strategy Guide"
    />
  );
}
