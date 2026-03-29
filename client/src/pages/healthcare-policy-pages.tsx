import { useState } from "react";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { LocaleLink } from "@/lib/LocaleLink";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight, Shield, Globe, BookOpen, ChevronRight, HelpCircle,
  Scale, ClipboardList, Award, Briefcase, GraduationCap,
  Stethoscope, FileText, Users, CheckCircle2,
  MapPin, Building, Heart
} from "lucide-react";

function PolicyBreadcrumbs({ title }: { title: string }) {
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
      <LocaleLink href="/" className="hover:text-primary" data-testid="link-policy-bc-home">{t("pages.healthcarePolicyPages.home")}</LocaleLink>
      <ChevronRight className="w-4 h-4" />
      <LocaleLink href="/healthcare-policy-and-updates" className="hover:text-primary" data-testid="link-policy-bc-hub">{t("pages.healthcarePolicyPages.healthcarePolicyUpdates")}</LocaleLink>
      <ChevronRight className="w-4 h-4" />
      <span className="text-gray-900 font-medium">{title}</span>
    </div>
  );
}

function FAQSection({ faqs, prefix }: { faqs: { question: string; answer: string }[]; prefix: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-${prefix}-${i}`}>
          <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors" data-testid={`button-${prefix}-faq-${i}`}>
            <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
            <HelpCircle className={`w-5 h-5 flex-shrink-0 transition-colors ${openIndex === i ? 'text-blue-500' : 'text-gray-400'}`} />
          </button>
          {openIndex === i && <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed" data-testid={`text-${prefix}-faq-${i}`}>{faq.answer}</div>}
        </div>
      ))}
    </div>
  );
}

function CrossLinkSection({ links }: { links: { title: string; href: string; desc: string; icon: typeof Shield }[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {links.map((link, i) => {
        const Icon = link.icon;
        return (
          <LocaleLink key={i} href={link.href} className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all group" data-testid={`link-policy-crosslink-${i}`}>
            <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
              <Icon className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 text-sm group-hover:text-blue-700 transition-colors">{link.title}</div>
              <div className="text-xs text-gray-500">{link.desc}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
          </LocaleLink>
        );
      })}
    </div>
  );
}

function PolicyCTA() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{t("pages.healthcarePolicyPages.prepareWithConfidence")}</h2>
        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
          Stay ahead of policy changes with exam prep resources that reflect the latest requirements. Practice questions, clinical simulations, and study tools built for today's nursing exams.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <LocaleLink href="/free-practice" className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors" data-testid="button-policy-cta-free">{t("pages.healthcarePolicyPages.startFreePractice")}</LocaleLink>
          <LocaleLink href="/pricing" className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors border border-blue-400" data-testid="button-policy-cta-pricing">{t("pages.healthcarePolicyPages.viewPlans")}</LocaleLink>
        </div>
      </div>
    </section>
  );
}

const LICENSING_FAQ = [
  { question: "What is the Nurse Licensure Compact (NLC)?", answer: "The Nurse Licensure Compact allows registered nurses and licensed practical/vocational nurses to practice in any compact member state with one multistate license. As of 2024, over 40 US states participate in the NLC, significantly easing cross-state mobility for nurses." },
  { question: "How do scope of practice laws differ between jurisdictions?", answer: "Scope of practice laws vary significantly. Some jurisdictions grant nurse practitioners full practice authority (independent prescribing and practice), while others require physician supervision. LPN/LVN scope also varies — some states allow IV medication administration while others restrict it." },
  { question: "What happens when my license state changes its requirements?", answer: "Existing licensees are typically grandfathered under previous requirements, though they must comply with new continuing education mandates by the next renewal cycle. Major changes usually include transition periods of 1-3 years for compliance." },
  { question: "How do I transfer my nursing license to another state or province?", answer: "In the US, you apply for licensure by endorsement in the new state. For Compact states, you must establish residency. In Canada, you apply to the regulatory body in the destination province. Processing times range from 2-12 weeks depending on the jurisdiction." },
  { question: "What continuing education is required to maintain my license?", answer: "Requirements vary by jurisdiction, typically ranging from 20-40 contact hours per renewal cycle (every 1-2 years). Some jurisdictions mandate specific topics like opioid education, implicit bias training, or infection control. Check your state or provincial regulatory body for exact requirements." },
];

export function LicensingPolicyChanges() {
  const faqStructuredData = buildFaqStructuredData(LICENSING_FAQ);

  return (
    <div data-testid="page-licensing-policy">
      <Navigation />
      <SEO
        title={t("pages.healthcarePolicyPages.nursingLicensingPolicyChangesCompact")}
        description={t("pages.healthcarePolicyPages.comprehensiveGuideToNursingLicensure")}
        keywords="nursing license policy, nurse licensure compact, scope of practice nursing, nursing license transfer, NLC compact states, nurse license endorsement, nursing continuing education requirements"
        canonicalPath="/healthcare-policy-and-updates/licensing-policy-changes"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          "name": "Nursing Licensing Policy Changes Guide",
          "description": "Comprehensive guide to nursing licensure policy changes across jurisdictions.",
          "url": "https://www.nursenest.ca/healthcare-policy-and-updates/licensing-policy-changes",
          "publisher": { "@type": "EducationalOrganization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
          "datePublished": "2025-01-01",
          "dateModified": "2025-01-01",
        }}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Healthcare Policy & Updates", url: "https://www.nursenest.ca/healthcare-policy-and-updates" },
          { name: "Licensing Policy Changes", url: "https://www.nursenest.ca/healthcare-policy-and-updates/licensing-policy-changes" },
        ]}
      />

      <section className="bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <PolicyBreadcrumbs title={t("pages.healthcarePolicyPages.licensingPolicyChanges")} />
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">{t("pages.healthcarePolicyPages.licensing")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" data-testid="heading-licensing-policy">{t("pages.healthcarePolicyPages.nursingLicensingPolicyChanges")}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{t("pages.healthcarePolicyPages.understandingHowLicensurePoliciesEvolve")}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("pages.healthcarePolicyPages.nurseLicensureCompactNlc")}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">{t("pages.healthcarePolicyPages.theNurseLicensureCompactIs")}</p>
          <div className="grid sm:grid-cols-2 gap-4 my-8 not-prose">
            {[
              { icon: MapPin, title: "40+ Member States", desc: "The majority of US states now participate in the compact, with more states introducing legislation regularly." },
              { icon: Shield, title: "Single License", desc: "One multistate license allows practice across all member states, reducing administrative burden." },
              { icon: Users, title: "Workforce Mobility", desc: "Nurses can respond to staffing needs across state lines without additional licensure delays." },
              { icon: Building, title: "Telehealth Enabled", desc: "Compact licensure supports cross-state telehealth nursing without separate state licenses." },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-12">{t("pages.healthcarePolicyPages.scopeOfPracticeDevelopments")}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">{t("pages.healthcarePolicyPages.scopeOfPracticeLawsDetermine")}</p>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 my-6 not-prose">
            <h3 className="font-semibold text-gray-900 mb-4">{t("pages.healthcarePolicyPages.keyScopeOfPracticeTrends")}</h3>
            <ul className="space-y-3">
              {[
                "Full practice authority for NPs expanding to more states and provinces",
                "LPN/LVN scope expansions for IV therapy and medication administration",
                "Telehealth practice standards defining virtual care boundaries",
                "Prescriptive authority changes for advanced practice nurses",
                "Emergency scope expansions during public health emergencies",
                "Interstate practice provisions through compact licensing",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-12">{t("pages.healthcarePolicyPages.licenseRenewalContinuingEducation")}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">{t("pages.healthcarePolicyPages.continuingEducationRequirementsAreIntegral")}</p>
          <p className="text-gray-700 leading-relaxed mb-4">{t("pages.healthcarePolicyPages.recentTrendsIncludeMandatoryEducation")}</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t("pages.healthcarePolicyPages.frequentlyAskedQuestions")}</h2>
          <FAQSection faqs={LICENSING_FAQ} prefix="licensing" />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t("pages.healthcarePolicyPages.relatedResources")}</h2>
          <CrossLinkSection links={[
            { title: "Nursing Regulatory Bodies", href: "/nursing-regulatory-bodies", desc: "Directory of nursing regulators", icon: Shield },
            { title: "Exam Prep Hub", href: "/exam-prep", desc: "Exam preparation resources", icon: BookOpen },
            { title: "Healthcare Careers", href: "/healthcare-careers", desc: "Explore career pathways", icon: Briefcase },
            { title: "International Nurses", href: "/international-nurses", desc: "Cross-border nursing resources", icon: Globe },
            { title: "Healthcare Certifications", href: "/healthcare-certifications", desc: "Certification guides", icon: Award },
            { title: "Study Pathways", href: "/study-pathways", desc: "Structured study plans", icon: GraduationCap },
          ]} />
        </div>
      </section>

      <PolicyCTA />
      <Footer />
    </div>
  );
}

const INTL_RECRUITMENT_FAQ = [
  { question: "What is the typical timeline for international nursing recruitment?", answer: "The process typically takes 6-18 months from initial application to starting work in the destination country. This includes credential evaluation (2-4 months), language proficiency testing (1-2 months), visa processing (2-6 months), and bridging/orientation programs (1-3 months)." },
  { question: "Which countries are actively recruiting international nurses?", answer: "The United States, Canada, United Kingdom, Australia, New Zealand, and several Gulf states are major recruiters. Each has different pathways, requirements, and credential evaluation processes. Demand is driven by nursing shortages and aging populations." },
  { question: "What credential evaluation organizations are recognized?", answer: "In the US, CGFNS (Commission on Graduates of Foreign Nursing Schools) is the primary evaluator. In Canada, NNAS (National Nursing Assessment Service) handles credential evaluation. The UK uses NMC (Nursing and Midwifery Council) evaluation, and Australia uses ANMAC (Australian Nursing and Midwifery Accreditation Council)." },
  { question: "Are bridging programs required for international nurses?", answer: "Requirements vary by jurisdiction. Some require formal bridging programs, while others accept credential evaluation and exam passage. Canada typically requires bridging programs for internationally educated nurses, while the US process focuses on CGFNS certification and NCLEX examination." },
  { question: "What language proficiency tests are accepted?", answer: "IELTS Academic (International English Language Testing System) and OET (Occupational English Test) are the most widely accepted. Some jurisdictions also accept TOEFL iBT or PTE Academic. Required scores vary: IELTS typically requires 6.5-7.0 overall, while OET requires B grade in all four components." },
];

export function InternationalNursingRecruitment() {
  const faqStructuredData = buildFaqStructuredData(INTL_RECRUITMENT_FAQ);

  return (
    <div data-testid="page-intl-recruitment-policy">
      <Navigation />
      <SEO
        title={t("pages.healthcarePolicyPages.internationalNursingRecruitmentPoliciesCreden")}
        description={t("pages.healthcarePolicyPages.guideToInternationalNursingRecruitment")}
        keywords="international nursing recruitment, nursing credential evaluation, CGFNS, NNAS, nursing visa pathway, international nurse bridging program, nursing immigration, IEN policy, internationally educated nurse"
        canonicalPath="/healthcare-policy-and-updates/international-nursing-recruitment"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          "name": "International Nursing Recruitment Policies Guide",
          "description": "Comprehensive guide to international nursing recruitment policies and pathways.",
          "url": "https://www.nursenest.ca/healthcare-policy-and-updates/international-nursing-recruitment",
          "publisher": { "@type": "EducationalOrganization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
          "datePublished": "2025-01-01",
          "dateModified": "2025-01-01",
        }}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Healthcare Policy & Updates", url: "https://www.nursenest.ca/healthcare-policy-and-updates" },
          { name: "International Nursing Recruitment", url: "https://www.nursenest.ca/healthcare-policy-and-updates/international-nursing-recruitment" },
        ]}
      />

      <section className="bg-gradient-to-br from-emerald-50 via-slate-50 to-teal-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <PolicyBreadcrumbs title={t("pages.healthcarePolicyPages.internationalNursingRecruitment")} />
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">{t("pages.healthcarePolicyPages.international")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" data-testid="heading-intl-recruitment">{t("pages.healthcarePolicyPages.internationalNursingRecruitmentPolicies")}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{t("pages.healthcarePolicyPages.navigateThePoliciesAndPathways")}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("pages.healthcarePolicyPages.credentialEvaluationFrameworks")}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">{t("pages.healthcarePolicyPages.eachDestinationCountryHasEstablished")}</p>
          <div className="grid sm:grid-cols-2 gap-4 my-8 not-prose">
            {[
              { country: "United States", org: "CGFNS", desc: "Commission on Graduates of Foreign Nursing Schools evaluates international nursing credentials for US licensure.", icon: "🇺🇸" },
              { country: "Canada", org: "NNAS", desc: "National Nursing Assessment Service provides standardized credential evaluation across Canadian provinces.", icon: "🇨🇦" },
              { country: "United Kingdom", org: "NMC", desc: "Nursing and Midwifery Council manages registration and credential evaluation for the UK.", icon: "🇬🇧" },
              { country: "Australia", org: "ANMAC", desc: "Australian Nursing and Midwifery Accreditation Council evaluates international qualifications.", icon: "🇦🇺" },
            ].map((item, i) => (
              <div key={i} className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.country}</h3>
                    <span className="text-xs text-emerald-700 font-medium">{item.org}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-12">{t("pages.healthcarePolicyPages.visaImmigrationPathways")}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">{t("pages.healthcarePolicyPages.internationalNursingRecruitmentInvolvesNavigat")}</p>
          <p className="text-gray-700 leading-relaxed mb-4">{t("pages.healthcarePolicyPages.commonPathwaysIncludeEmployersponsoredWork")}</p>

          <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-12">{t("pages.healthcarePolicyPages.bridgingProgramsCompetencyAssessment")}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">{t("pages.healthcarePolicyPages.manyJurisdictionsRequireInternationallyEducate")}</p>

          <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-12">{t("pages.healthcarePolicyPages.ethicalRecruitmentStandards")}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">{t("pages.healthcarePolicyPages.theWhoGlobalCodeOf")}</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t("pages.healthcarePolicyPages.frequentlyAskedQuestions2")}</h2>
          <FAQSection faqs={INTL_RECRUITMENT_FAQ} prefix="intl" />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t("pages.healthcarePolicyPages.relatedResources2")}</h2>
          <CrossLinkSection links={[
            { title: "International Nurses Hub", href: "/international-nurses", desc: "Complete international nursing guide", icon: Globe },
            { title: "NCLEX for International Nurses", href: "/nclex-for-international-nurses", desc: "NCLEX exam preparation", icon: ClipboardList },
            { title: "Nursing Regulatory Bodies", href: "/nursing-regulatory-bodies", desc: "Regulatory directory", icon: Shield },
            { title: "Healthcare Careers", href: "/healthcare-careers", desc: "Career exploration", icon: Briefcase },
            { title: "Licensing Policy Changes", href: "/healthcare-policy-and-updates/licensing-policy-changes", desc: "Licensure updates", icon: FileText },
            { title: "ApplyNest Career Tools", href: "/applynest", desc: "Resume & interview tools", icon: Award },
          ]} />
        </div>
      </section>

      <PolicyCTA />
      <Footer />
    </div>
  );
}

const EXAM_FORMAT_FAQ = [
  { question: "What is Next Generation NCLEX (NGN)?", answer: "Next Generation NCLEX introduced new item types including case studies, extended multiple response, drag-and-drop, cloze (fill-in-the-blank) matrices, and highlighting. These items assess clinical judgment using the NCSBN Clinical Judgment Measurement Model (NCJMM) and require candidates to demonstrate higher-order thinking skills." },
  { question: "How does Computerized Adaptive Testing (CAT) work?", answer: "CAT adjusts question difficulty based on your performance. When you answer correctly, the next question is harder; when you answer incorrectly, it's easier. The algorithm continuously estimates your ability until it can determine with 95% confidence whether you pass or fail. This makes each exam unique and tailored to the individual test-taker." },
  { question: "Has the REX-PN exam format changed?", answer: "The REX-PN (Regulatory Exam - Practical Nurse) in Canada uses a computer-adaptive format with multiple-choice and multiple-response questions. The exam assesses competencies across foundations of practice, collaborative care, and professional practice domains. Format updates are managed by NCSBN in coordination with Canadian regulatory bodies." },
  { question: "How should I prepare for new exam formats?", answer: "Focus on clinical judgment and critical thinking rather than memorizing content. Practice with NGN-style questions including case studies and matrix items. Use adaptive practice tests that simulate the CAT algorithm. NurseNest's question bank includes all current item types and adapts to your performance level." },
  { question: "Do exam format changes affect pass rates?", answer: "New formats may initially impact pass rates as candidates adjust to unfamiliar question types. However, passing standards are set through rigorous psychometric processes that account for item difficulty. The key is preparing with practice materials that reflect current formats." },
];

export function ExamFormatUpdates() {
  const faqStructuredData = buildFaqStructuredData(EXAM_FORMAT_FAQ);

  return (
    <div data-testid="page-exam-format-updates">
      <Navigation />
      <SEO
        title={t("pages.healthcarePolicyPages.nursingExamFormatUpdatesNgn")}
        description={t("pages.healthcarePolicyPages.stayCurrentWithNursingExam")}
        keywords="NCLEX format changes, next generation NCLEX, NGN exam, CAT nursing exam, REX-PN format, nursing exam scoring, NCSBN exam updates, clinical judgment measurement model, nursing exam preparation"
        canonicalPath="/healthcare-policy-and-updates/exam-format-updates"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          "name": "Nursing Exam Format Updates Guide",
          "description": "Comprehensive guide to nursing examination format changes and scoring updates.",
          "url": "https://www.nursenest.ca/healthcare-policy-and-updates/exam-format-updates",
          "publisher": { "@type": "EducationalOrganization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
          "datePublished": "2025-01-01",
          "dateModified": "2025-01-01",
        }}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Healthcare Policy & Updates", url: "https://www.nursenest.ca/healthcare-policy-and-updates" },
          { name: "Exam Format Updates", url: "https://www.nursenest.ca/healthcare-policy-and-updates/exam-format-updates" },
        ]}
      />

      <section className="bg-gradient-to-br from-violet-50 via-slate-50 to-purple-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <PolicyBreadcrumbs title={t("pages.healthcarePolicyPages.examFormatUpdates")} />
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full">{t("pages.healthcarePolicyPages.examUpdates")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" data-testid="heading-exam-format-updates">{t("pages.healthcarePolicyPages.nursingExamFormatUpdates")}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{t("pages.healthcarePolicyPages.nursingExaminationsEvolveToBetter")}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("pages.healthcarePolicyPages.nextGenerationNclexNgn")}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">{t("pages.healthcarePolicyPages.theNextGenerationNclexRepresents")}</p>
          <div className="grid sm:grid-cols-2 gap-4 my-8 not-prose">
            {[
              { title: "Case Studies", desc: "Multi-part scenarios following a patient through assessment, intervention, and evaluation phases.", icon: FileText },
              { title: "Extended Multiple Response", desc: "Select all correct responses from options — no partial credit, requiring thorough knowledge.", icon: ClipboardList },
              { title: "Matrix/Grid Items", desc: "Table-format questions testing ability to match assessments with appropriate interventions.", icon: Scale },
              { title: "Highlighting", desc: "Identify relevant information within passages of clinical documentation.", icon: BookOpen },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-violet-50 rounded-xl p-5 border border-violet-100">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5 text-violet-600" />
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-12">{t("pages.healthcarePolicyPages.computerizedAdaptiveTestingCat")}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">{t("pages.healthcarePolicyPages.catTechnologyEnsuresEachCandidate")}</p>
          <p className="text-gray-700 leading-relaxed mb-4">{t("pages.healthcarePolicyPages.theMinimumNumberOfQuestions")}</p>

          <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-12">{t("pages.healthcarePolicyPages.scoreReportingResults")}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">{t("pages.healthcarePolicyPages.scoreReportingProcessesHaveBeen")}</p>

          <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-12">{t("pages.healthcarePolicyPages.canadianExamConsiderations")}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">{t("pages.healthcarePolicyPages.canadianNursingExamsIncludingThe")}</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t("pages.healthcarePolicyPages.frequentlyAskedQuestions3")}</h2>
          <FAQSection faqs={EXAM_FORMAT_FAQ} prefix="exam" />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t("pages.healthcarePolicyPages.relatedResources3")}</h2>
          <CrossLinkSection links={[
            { title: "Free Practice Questions", href: "/free-practice", desc: "Practice with current formats", icon: BookOpen },
            { title: "Mock Exams", href: "/mock-exams", desc: "Simulated CAT experience", icon: ClipboardList },
            { title: "NCLEX-RN Prep", href: "/nclex-rn-practice-questions", desc: "RN exam preparation", icon: Stethoscope },
            { title: "REX-PN Prep", href: "/rex-pn-practice-questions", desc: "PN exam preparation", icon: Award },
            { title: "Clinical Simulations", href: "/case-simulations", desc: "Practice clinical judgment", icon: Heart },
            { title: "Study Pathways", href: "/study-pathways", desc: "Structured study plans", icon: GraduationCap },
          ]} />
        </div>
      </section>

      <PolicyCTA />
      <Footer />
    </div>
  );
}

const REGULATORY_FAQ = [
  { question: "What are nurse staffing ratio laws?", answer: "Nurse staffing ratio laws mandate minimum nurse-to-patient ratios in healthcare facilities. California was the first US state to implement mandatory ratios (e.g., 1:2 in ICU, 1:5 in medical-surgical). Other states have enacted or are considering similar legislation, though approaches vary from mandatory ratios to staffing committees." },
  { question: "How do telehealth regulations affect nursing practice?", answer: "Telehealth regulations define how nurses can provide care remotely, including prescribing authority, consent requirements, and cross-state practice rules. The COVID-19 pandemic accelerated telehealth adoption and prompted many jurisdictions to update their regulatory frameworks. Nurse Licensure Compact membership facilitates cross-state telehealth nursing." },
  { question: "What patient safety regulations should nurses know about?", answer: "Key regulations include The Joint Commission standards, CMS Conditions of Participation, state health department requirements, mandatory reporting laws for adverse events and abuse, medication administration safety protocols, and infection prevention standards. These regulations directly impact daily nursing practice and documentation requirements." },
  { question: "How do workplace violence prevention laws affect nurses?", answer: "Several jurisdictions have enacted or strengthened workplace violence prevention laws specific to healthcare settings. These typically require facilities to implement violence prevention programs, conduct risk assessments, provide staff training, and report incidents. Some laws also increase penalties for violence against healthcare workers." },
  { question: "What are the implications of mandatory overtime regulations?", answer: "Many states and provinces have enacted laws restricting mandatory overtime for nurses, recognizing the link between fatigue and patient safety. These laws typically prohibit employers from requiring nurses to work beyond their scheduled shift except in declared emergencies, and some include penalties for violations." },
];

export function RegulatoryChanges() {
  const faqStructuredData = buildFaqStructuredData(REGULATORY_FAQ);

  return (
    <div data-testid="page-regulatory-changes">
      <Navigation />
      <SEO
        title={t("pages.healthcarePolicyPages.regulatoryChangesAffectingNursesStaffing")}
        description={t("pages.healthcarePolicyPages.comprehensiveGuideToHealthcareRegulatory")}
        keywords="nursing regulations, nurse staffing ratios, healthcare regulatory changes, patient safety regulations, telehealth nursing regulations, nursing workplace safety, mandatory overtime nursing, nurse practice requirements"
        canonicalPath="/healthcare-policy-and-updates/regulatory-changes-affecting-nurses"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          "name": "Regulatory Changes Affecting Nurses",
          "description": "Comprehensive guide to healthcare regulatory changes impacting nursing practice.",
          "url": "https://www.nursenest.ca/healthcare-policy-and-updates/regulatory-changes-affecting-nurses",
          "publisher": { "@type": "EducationalOrganization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
          "datePublished": "2025-01-01",
          "dateModified": "2025-01-01",
        }}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Healthcare Policy & Updates", url: "https://www.nursenest.ca/healthcare-policy-and-updates" },
          { name: "Regulatory Changes", url: "https://www.nursenest.ca/healthcare-policy-and-updates/regulatory-changes-affecting-nurses" },
        ]}
      />

      <section className="bg-gradient-to-br from-amber-50 via-slate-50 to-orange-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <PolicyBreadcrumbs title={t("pages.healthcarePolicyPages.regulatoryChanges")} />
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">{t("pages.healthcarePolicyPages.regulatory")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" data-testid="heading-regulatory-changes">{t("pages.healthcarePolicyPages.regulatoryChangesAffectingNurses")}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{t("pages.healthcarePolicyPages.healthcareRegulationsShapeEveryAspect")}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("pages.healthcarePolicyPages.staffingRegulations")}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">{t("pages.healthcarePolicyPages.nurseStaffingRegulationsAreAmong")}</p>
          <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 my-6 not-prose">
            <h3 className="font-semibold text-gray-900 mb-4">{t("pages.healthcarePolicyPages.commonStaffingRatioStandards")}</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { unit: "ICU / Critical Care", ratio: "1:1 to 1:2" },
                { unit: "Medical-Surgical", ratio: "1:4 to 1:6" },
                { unit: "Emergency Department", ratio: "1:3 to 1:4" },
                { unit: "Labor & Delivery", ratio: "1:1 to 1:2" },
                { unit: "Pediatrics", ratio: "1:3 to 1:4" },
                { unit: "Psychiatric/Mental Health", ratio: "1:4 to 1:6" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center bg-white rounded-lg p-3 border border-amber-100">
                  <span className="text-sm font-medium text-gray-900">{item.unit}</span>
                  <span className="text-sm text-amber-700 font-semibold">{item.ratio}</span>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-12">{t("pages.healthcarePolicyPages.telehealthPracticeStandards")}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">{t("pages.healthcarePolicyPages.telehealthRegulationsHaveEvolvedRapidly")}</p>

          <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-12">{t("pages.healthcarePolicyPages.patientSafetyQualityStandards")}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">{t("pages.healthcarePolicyPages.regulatoryBodiesContinuouslyUpdateSafety")}</p>

          <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-12">{t("pages.healthcarePolicyPages.workplaceSafetyRegulations")}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">{t("pages.healthcarePolicyPages.healthcareWorkplaceSafetyRegulationsAddress")}</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t("pages.healthcarePolicyPages.frequentlyAskedQuestions4")}</h2>
          <FAQSection faqs={REGULATORY_FAQ} prefix="regulatory" />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t("pages.healthcarePolicyPages.relatedResources4")}</h2>
          <CrossLinkSection links={[
            { title: "Healthcare Certifications", href: "/healthcare-certifications", desc: "Safety certifications", icon: Award },
            { title: "Clinical Skills Guides", href: "/clinical-skills", desc: "Practice skills guides", icon: Stethoscope },
            { title: "Nursing Regulatory Bodies", href: "/nursing-regulatory-bodies", desc: "Regulatory directory", icon: Shield },
            { title: "New Graduate Support", href: "/new-graduate-support", desc: "New grad resources", icon: GraduationCap },
            { title: "Clinical Simulations", href: "/case-simulations", desc: "Safety scenario practice", icon: Heart },
            { title: "Licensing Policy", href: "/healthcare-policy-and-updates/licensing-policy-changes", desc: "Licensure updates", icon: FileText },
          ]} />
        </div>
      </section>

      <PolicyCTA />
      <Footer />
    </div>
  );
}
