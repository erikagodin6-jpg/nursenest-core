import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { ALLIED, HUB, NP, PN, RN, loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

const PATH = "/exams/canada";

const PAGE_TITLE = "Nursing and Allied Health Licensing Exams in Canada (2026 Complete Guide)";

const PAGE_DESCRIPTION =
  "Authoritative guide to Canadian nursing exams (REx-PN, NCLEX-RN, NP), allied health certification (MLT, MRT, pharmacy technician, OT, RT, paramedicine), NNAS and English tests, plus a clear pathway from education to registration. Links to NurseNest lessons, question banks, and study tools.";

const FAQ_ITEMS = [
  {
    question: "Is NCLEX used in Canada?",
    answer:
      "Yes for registered nurses. Canadian RN regulatory bodies use the NCLEX-RN as the national entry exam for RN registration. Practical nursing uses the national REx-PN (not NCLEX-PN). Always confirm the latest bulletin from your provincial or territorial college.",
  },
  {
    question: "What exam do RPNs write in Ontario?",
    answer:
      "Ontario practical nursing candidates seeking registration write the REx-PN, Canada’s national regulatory exam for practical nurses. Title in Ontario is RPN; in many other provinces the parallel role is LPN, but the national exam pathway aligns to the same practical nurse registration standard.",
  },
  {
    question: "Is REx-PN harder than NCLEX?",
    answer:
      "They target different scopes. REx-PN tests practical nurse scope, clinical judgment, and safety within that scope. NCLEX-RN tests registered nurse scope at a different breadth and depth. Difficulty is personal: compare your weak domains with timed practice and rationales rather than relying on reputation alone.",
  },
  {
    question: "How do I become an NP in Canada?",
    answer:
      "You complete an approved nurse practitioner program, meet your regulator’s eligibility rules, then pass the Canadian Nurse Practitioner Examination (CNPE) stream that matches your program focus (for example primary care or adult care, depending on pathway). Requirements vary by province; start from your college’s NP registration guide.",
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
        robots: { index: true, follow: true },
        keywords: [
          "nursing exams Canada",
          "how to become a nurse in Canada exam",
          "NCLEX Canada requirements",
          "RPN exam Canada",
          "NP exam Canada",
          "allied health exams Canada",
          "REx-PN",
          "CNPLE",
          "CNPE",
          "NNAS",
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
      routeGroup: "marketing.default.examsCanada",
    },
  );
}

function ProseLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className="font-semibold text-[var(--theme-primary)] underline-offset-4 hover:underline" href={href}>
      {children}
    </Link>
  );
}

export default function CanadaLicensingExamsPage() {
  const { crumbs, schemaItems } = simpleMarketingBreadcrumbs("Canada licensing exams", PATH);

  return (
    <>
      <WebPageJsonLd
        {...buildMarketingWebPageJsonLdProps({
          locale: DEFAULT_MARKETING_LOCALE,
          enPath: PATH,
          title: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
        })}
      />
      <BreadcrumbJsonLd items={schemaItems} />
      <FaqJsonLd items={FAQ_ITEMS} />

      <div className="mx-auto max-w-3xl nn-marketing-x pb-[var(--nn-rhythm-tight-y)] pt-[var(--nn-rhythm-page-y)]">
        <BreadcrumbTrail items={crumbs} />

        <article className="nn-marketing-body">
          <p className="nn-marketing-eyebrow text-[var(--semantic-text-muted)]">Updated for 2026</p>
          <h1 className="nn-marketing-h1 mt-2 text-balance">{PAGE_TITLE}</h1>
          <p className="nn-marketing-lead mt-4 text-[var(--theme-muted-text)]">
            If you are planning Canadian registration in nursing or allied health, you need a map: which exam is national,
            which steps are provincial, and where internationally educated applicants fit. This guide gives you that map,
            with direct links into NurseNest pathways for lessons, questions, and practice exams.
          </p>

          <section className="mt-12" aria-labelledby="intro">
            <h2 id="intro" className="nn-marketing-h2">
              How licensure works in Canada
            </h2>
            <p>
              Healthcare regulation in Canada is primarily provincial and territorial. Colleges set entry standards,
              authorize practice, and renew registration. Many nursing roles also depend on a national examination that
              your college recognizes as proof of competence. That mix, national exam plus provincial rules, is why two
              candidates with the same credential can face slightly different paperwork depending on where they apply.
            </p>
            <p>
              <strong>Practical nurse (PN) versus registered nurse (RN) versus nurse practitioner (NP):</strong> PN
              (called RPN in Ontario, LPN in many other provinces) operates within a defined practical scope. RN has broader
              independent nursing judgment across the care continuum. NP adds advanced assessment, diagnosis, prescribing,
              and follow-up within a legislated scope that goes beyond RN practice. Exams match those tiers: REx-PN for
              practical nurses, NCLEX-RN for RNs, and the Canadian Nurse Practitioner Examination for NP candidates who
              meet program and regulator requirements.
            </p>
            <p>
              <strong>Internationally educated nurses (IENs):</strong> Most pathways require credential assessment,
              possible gaps or bridging, language proficiency, and then the same national exams your college specifies for
              domestic graduates. The National Nursing Assessment Service (NNAS) is a common first step for IENs
              applying to Canadian RN, LPN/RPN, or RN prescribing programs, depending on stream. Timelines vary; plan for
              documentation lead time.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="nursing-exams">
            <h2 id="nursing-exams" className="nn-marketing-h2">
              Nursing licensure exams (every tier)
            </h2>

            <h3 className="nn-marketing-h3 mt-8">Practical nurse: REx-PN (RPN in Ontario, LPN elsewhere)</h3>
            <p>
              The <strong>Regulatory Exam - Practical Nurse (REx-PN)</strong> is Canada’s national exam for practical nurse
              registration. It is computer-based and uses a structured measurement design aligned to practical nurse
              competencies: safe, ethical, collaborative care within scope. Expect heavy emphasis on clinical judgment,
              pharmacology within PN scope, therapeutic communication, and clear boundaries when an RN or NP must lead the
              plan of care.
            </p>
            <p>
              Who writes it: candidates seeking registration as a practical nurse in participating jurisdictions, including
              Ontario RPN candidates and LPN candidates in other provinces where the exam applies. Always confirm with your
              college for the current list and eligibility rules.
            </p>
            <p>
              NurseNest aligns PN prep to Canadian practical nurse scope. Start with the{" "}
              <ProseLink href={PN.caHub}>Canada PN hub</ProseLink>, then open{" "}
              <ProseLink href={PN.caLessons}>REx-PN lessons</ProseLink> and{" "}
              <ProseLink href={PN.caQuestions}>practice questions</ProseLink>. Add{" "}
              <ProseLink href={`${PN.caHub}/cat`}>adaptive-style practice</ProseLink> when you are ready for exam pacing.
            </p>

            <h3 className="nn-marketing-h3 mt-8">Registered nurse: NCLEX-RN</h3>
            <p>
              Canadian RN regulators use the <strong>NCLEX-RN</strong> as the national entry-to-practice examination. It is
              a computer adaptive test (CAT): item difficulty shifts based on your performance so the exam can estimate
              competence efficiently. Content emphasizes clinical judgment, safety, pharmacology, reduction of risk, and
              care management across the lifespan.
            </p>
            <p>
              NurseNest filters RN preparation by country so Canadian candidates train in the right context. Use{" "}
              <ProseLink href={RN.caLessons}>NCLEX-RN lessons (Canada)</ProseLink>,{" "}
              <ProseLink href={RN.caQuestions}>NCLEX-RN question bank</ProseLink>, and{" "}
              <ProseLink href={RN.caLessons.replace(/\/lessons$/, "/cat")}>CAT practice exams</ProseLink> to connect
              weak-topic lessons with timed runs.
            </p>

            <h3 className="nn-marketing-h3 mt-8">Nurse practitioner: Canadian Nurse Practitioner Examination</h3>
            <p>
              NP candidates who complete an approved program must pass the <strong>Canadian Nurse Practitioner Examination</strong>{" "}
              in the stream that matches their preparation (streams can include primary care across the lifespan, adult
              care, and other focused populations depending on program and regulator). NP practice includes advanced
              assessment, diagnosis, prescribing where legislated, and ongoing management, so exams sit intentionally above
              RN breadth in those domains.
            </p>
            <p>
              Compared with RN: more autonomous decision-making scenarios, tighter pharmacology and diagnostics expectations,
              and documentation that reflects NP scope. Compared with PN: a different role entirely; do not confuse PN
              scope drills with NP readiness.
            </p>
            <p>
              Explore NurseNest’s <ProseLink href={NP.caNpHub}>Canada NP (CNPLE-track) hub</ProseLink>,{" "}
              <ProseLink href={NP.caNpLessons}>NP lessons</ProseLink>, and{" "}
              <ProseLink href={NP.caNpQuestions}>NP questions</ProseLink> after you confirm your regulator’s exam stream
              and eligibility.
            </p>

            <div
              className="mt-8 rounded-2xl border border-[var(--semantic-border-soft)] p-6"
              style={{ background: "color-mix(in srgb, var(--semantic-info) 6%, var(--semantic-surface))" }}
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                Quick comparison
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--theme-body-text)]">
                <li>
                  <strong>PN (REx-PN):</strong> scope-bound nursing care, collaborative handoffs, safety within PN limits.
                  Exam difficulty reflects that boundary-heavy judgment.
                </li>
                <li>
                  <strong>RN (NCLEX-RN):</strong> broader independent nursing decisions, complex prioritization, broader
                  pharmacology and acute stabilization themes within RN scope.
                </li>
                <li>
                  <strong>NP (CNPE):</strong> advanced practice: assessment, diagnosis, therapeutic management, and
                  prescribing where authorized; expect the steepest scenario depth of the three.
                </li>
              </ul>
            </div>
          </section>

          <section className="mt-12" aria-labelledby="allied">
            <h2 id="allied" className="nn-marketing-h2">
              Allied health exams in Canada
            </h2>
            <p>
              Allied credentials combine national certification or licensing exams with provincial registration. Below are the
              major entry routes candidates encounter. Always verify eligibility, language requirements, and any lab or
              clinical hour prerequisites with your regulator.
            </p>

            <h3 className="nn-marketing-h3 mt-8">Medical laboratory technology: CSMLS certification exam</h3>
            <p>
              The Canadian Society for Medical Laboratory Science offers a national certification exam for medical
              laboratory technologists (MLTs). Format is standardized high-stakes multiple choice reflecting competency
              profiles in clinical chemistry, hematology, microbiology, transfusion science, and related domains.
              Difficulty is high: you must integrate instrumentation principles, quality, and safety. Career pathway:
              hospital and community labs, public health, research support.
            </p>

            <h3 className="nn-marketing-h3 mt-8">Medical radiation technology: CAMRT certification exam</h3>
            <p>
              The Canadian Association of Medical Radiation Technologists oversees national certification for imaging
              disciplines (for example radiography, radiation therapy, nuclear medicine, magnetic resonance imaging,
              depending on specialty). Exams are rigorous and specialty-specific. Pathway: acute diagnostics, cancer
              programs, advanced imaging centres.
            </p>

            <h3 className="nn-marketing-h3 mt-8">Pharmacy technician: PEBC Qualifying Examination</h3>
            <p>
              The Pharmacy Examining Board of Canada runs the Qualifying Examination for pharmacy technicians (and
              separate processes for pharmacists). Expect jurisprudence-aligned scenarios, calculations, product and
              distribution knowledge, and patient safety. Pathway: community and hospital dispensaries, sterile compounding
              environments where licensed.
            </p>

            <h3 className="nn-marketing-h3 mt-8">Occupational therapy: national certification exam</h3>
            <p>
              Occupational therapists in Canada typically complete the national certification examination administered
              under the Alliance of Canadian Occupational Therapy Professional Organizations (ACOTRO), often referenced as
              the NOTCE pathway for entry-level credentialing. Difficulty reflects broad practice across mental health,
              musculoskeletal, neurological, and community rehabilitation. Career pathway: hospitals, schools, home care,
              workplace programs.
            </p>

            <h3 className="nn-marketing-h3 mt-8">Respiratory therapy</h3>
            <p>
              Respiratory therapists align with national standards and provincial registration. Candidates should expect
              rigorous entry exams and competency checks that cover ventilation, airway management, chronic disease,
              emergency care, and ethics. Pathway: acute care, critical care, community respiratory programs.
            </p>

            <h3 className="nn-marketing-h3 mt-8">Paramedicine (provincial)</h3>
            <p>
              Paramedic certification is provincial. Entry exams, practical evaluations, and scope levels (for example
              primary care versus advanced care) differ by jurisdiction. Start from your provincial regulator and the
              licensing cycle for your certification level.
            </p>

            <p className="mt-6">
              NurseNest hosts a consolidated <ProseLink href={ALLIED.caHub}>Canada allied health hub</ProseLink> with{" "}
              <ProseLink href={ALLIED.caQuestions}>allied practice questions</ProseLink> where your profession is
              supported in product. Use it alongside college handbooks for the final word on eligibility.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="ien">
            <h2 id="ien" className="nn-marketing-h2">
              International nurses coming to Canada
            </h2>
            <ul className="list-disc space-y-3 pl-5">
              <li>
                <strong>NNAS:</strong> Many IENs begin with the National Nursing Assessment Service application package so
                Canadian regulators can evaluate nursing education and experience against Canadian expectations. Follow the
                instructions for the designation you are pursuing (RN, LPN, or RN prescriber pathways as applicable).
              </li>
              <li>
                <strong>Bridging:</strong> If assessment identifies gaps, bridging programs build clinical, communication,
                or theory competencies before you attempt the national exam. Treat bridging as an investment in exam
                readiness, not a delay tactic.
              </li>
              <li>
                <strong>English proficiency:</strong> IELTS Academic and OET are widely accepted for healthcare
                registration. Match the test, band scores, and recency window to your college’s published requirement.
              </li>
            </ul>
          </section>

          <section className="mt-12" aria-labelledby="pathway">
            <h2 id="pathway" className="nn-marketing-h2">
              Best pathway from education to registration
            </h2>
            <ol className="list-decimal space-y-4 pl-6">
              <li>
                <strong>Education:</strong> Graduate from an approved program for your intended title and jurisdiction.
              </li>
              <li>
                <strong>Credential assessment:</strong> For IENs, complete NNAS or the pathway your college lists. For
                domestic graduates, move straight to regulator instructions.
              </li>
              <li>
                <strong>Exam:</strong> Register for the national exam your college requires (REx-PN, NCLEX-RN, CNPE stream,
                or allied national exam). Pair content review with timed practice.
              </li>
              <li>
                <strong>Registration:</strong> Submit jurisprudence, criminal record checks, and fees as required. Maintain
                currency for any provisional licenses during the transition.
              </li>
            </ol>
            <p className="mt-6">
              Ready to study with structure? Open the public{" "}
              <ProseLink href={HUB.questionBank}>question bank hub</ProseLink>,{" "}
              <ProseLink href={HUB.practiceExams}>practice exams hub</ProseLink>, and{" "}
              <ProseLink href={loginWithCallback("/app/study-plan")}>start a study plan</ProseLink> after sign-in. Explore{" "}
              <ProseLink href={HUB.examLessons}>clinical lessons</ProseLink> and{" "}
              <ProseLink href={HUB.pricing}>pricing</ProseLink> when you want the full NurseNest workflow.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="faq">
            <h2 id="faq" className="nn-marketing-h2">
              Frequently asked questions
            </h2>
            <dl className="space-y-6">
              {FAQ_ITEMS.map((item) => (
                <div key={item.question}>
                  <dt className="font-semibold text-[var(--theme-heading-text)]">{item.question}</dt>
                  <dd className="mt-2 text-[var(--theme-body-text)]">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <aside
            className="mt-14 rounded-2xl border border-[var(--semantic-border-soft)] p-8"
            style={{ background: "color-mix(in srgb, var(--semantic-brand) 5%, var(--semantic-surface))" }}
          >
            <p className="nn-marketing-h3 !mt-0">Study with NurseNest</p>
            <p className="mt-2 text-[var(--theme-muted-text)]">
              Connect lessons, questions, and CAT-style practice in one place. Pick your Canadian pathway below.
            </p>
            <ul className="mt-4 flex flex-col gap-2 text-sm font-medium sm:flex-row sm:flex-wrap">
              <li>
                <ProseLink href={RN.caLessons}>RN lessons</ProseLink>
              </li>
              <li className="hidden sm:inline">·</li>
              <li>
                <ProseLink href={PN.caLessons}>PN lessons</ProseLink>
              </li>
              <li className="hidden sm:inline">·</li>
              <li>
                <ProseLink href={NP.caNpLessons}>NP lessons</ProseLink>
              </li>
              <li className="hidden sm:inline">·</li>
              <li>
                <ProseLink href={RN.caQuestions}>RN questions</ProseLink>
              </li>
              <li className="hidden sm:inline">·</li>
              <li>
                <ProseLink href={PN.caQuestions}>PN questions</ProseLink>
              </li>
              <li className="hidden sm:inline">·</li>
              <li>
                <ProseLink href={HUB.questionBank}>All question banks</ProseLink>
              </li>
              <li className="hidden sm:inline">·</li>
              <li>
                <ProseLink href={loginWithCallback("/app/study-plan")}>Study plan</ProseLink>
              </li>
            </ul>
          </aside>
        </article>
      </div>
    </>
  );
}
