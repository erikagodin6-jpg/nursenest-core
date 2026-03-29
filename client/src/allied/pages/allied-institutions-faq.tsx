import { useState } from "react";
import { Link } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import { useI18n } from "@/lib/i18n";
import {
  ChevronDown, ChevronRight, ArrowRight, CheckCircle2, X,
  HelpCircle, Globe, Shield, Users, Lock, BarChart3
} from "lucide-react";

const FAQ_SECTIONS = [
  {
    title: "Licensing Models",
    items: [
      {
        q: "What is the difference between Cohort and Individual licensing?",
        a: "Cohort licensing gives your entire class a shared license that expires at the end of the semester. Every student starts and stops access together, and faculty analytics reflect the cohort as a unit. This is the best fit for traditional semester-based programs with fixed class sizes.\n\nIndividual licensing gives each student an independent license tied to their exam date or a fixed duration (e.g., 90 days). Students can start at different times and their access expires independently. This works best for rolling admissions, continuing education programs, or programs where students test at different times throughout the year."
      },
      {
        q: "Which model is best for my program?",
        a: "If your students start and finish together as a class (e.g., Fall 2026 cohort), the Cohort model is almost always the right choice. It simplifies enrollment, billing, and analytics.\n\nIf your students join at different times or have different exam dates (e.g., a self-paced online program or clinical rotations that end at different times), the Individual model gives you more flexibility.\n\nNot sure? Start with a Cohort pilot. Most programs find it fits their workflow best, and you can always switch later."
      },
      {
        q: "Can we switch models mid-year?",
        a: "Yes, but it requires institution admin permission and should be planned carefully. Switching from Cohort to Individual means each student gets an independent expiration date going forward. Switching from Individual to Cohort means all students will share the new semester end date.\n\nWe recommend switching between semesters rather than mid-semester to avoid confusion. Our licensing team can help you plan the transition."
      },
      {
        q: "How are seats counted?",
        a: "Each active student occupies one seat. Faculty members (Lite or Pro) do not count against the student seat limit. If a student's access expires (semester ends or individual license runs out), that seat is released. If a student drops and you deactivate their seat, it becomes available for reassignment.\n\nYou set the seat limit during onboarding. If you need additional seats mid-semester, contact our licensing team for an expansion at prorated pricing."
      },
      {
        q: "What happens when a student's exam date changes?",
        a: "For Individual licenses, the institution admin can adjust a student's access end date through the admin panel. If the student's exam is postponed, extend the date. If the student tests early, the license remains active until the original end date.\n\nFor Cohort licenses, the entire cohort shares the semester end date. If you need to extend the semester (e.g., snow days), contact our licensing team to adjust the cohort-wide date."
      },
      {
        q: "How does billing work?",
        a: "Cohort licenses are billed as a flat semester fee or per-seat per-semester, depending on your contract. Individual licenses are billed per student per month or as a fixed-duration license. All institutional pricing is customized based on your program size, career track, and tier level.\n\nWe invoice at the start of the term. Multi-semester and multi-year contracts receive volume discounts. Contact our licensing team for a customized proposal."
      },
      {
        q: "What if enrollment changes mid-semester?",
        a: "If you need to add students mid-semester, additional seats are prorated for the remaining term. If a student drops, deactivate their seat through the admin panel and it becomes available for reassignment. We do not charge for inactive seats.\n\nFor significant enrollment changes (more than 20% increase), contact our licensing team to adjust your contract."
      },
    ]
  },
  {
    title: "Faculty Analytics",
    items: [
      {
        q: "What level of analytics do faculty receive?",
        a: "Faculty Lite provides aggregate cohort metrics: domain heatmaps showing which exam areas the class struggles with, cohort readiness averages, mock score distributions, completion percentages, and overall pass probability. Faculty Lite does not show individual student names or scores.\n\nFaculty Pro adds student-level drilldown: individual domain mastery, at-risk flagging for students scoring below 60% in any domain, personalized remediation recommendations, and CSV/PDF export for accreditation documentation. Faculty Pro requires student consent acknowledgment."
      },
      {
        q: "Does NurseNest track student performance?",
        a: "Yes. Every practice question, mock exam, and readiness assessment is tracked by domain. Faculty see aggregated performance data (Faculty Lite) or student-level data (Faculty Pro). Students always see their own performance data on their personal dashboard.\n\nFaculty analytics show domain mastery percentages, improvement trends over time, mock exam pass rates, and weak-area identification. This data powers the at-risk detection and remediation recommendation system."
      },
      {
        q: "What career-specific analytics are available?",
        a: "Each allied career has specialized analytics beyond the standard domain heatmap:\n\nPharmacy Tech: Medication mastery heatmap, law/regulation compliance performance, and calculation competency tracking.\n\nRespiratory Therapy: ABG interpretation accuracy, ventilator scenario scoring, and equipment management metrics.\n\nParamedic: Trauma algorithm accuracy, first-action correctness percentage, and cardiac arrest management scoring.\n\nMedical Lab: Lab abnormality identification accuracy, quality control performance, and critical value reporting metrics.\n\nDiagnostic Imaging: Radiation safety score, contrast reaction recognition accuracy, and positioning fundamentals assessment."
      },
    ]
  },
  {
    title: "Region and Exam Alignment",
    items: [
      {
        q: "How does region-specific exam alignment work?",
        a: "When your institution selects US or Canada during onboarding, the entire platform adapts:\n\nLab values switch between mg/dL (US) and mmol/L (Canada).\nLegal modules switch between DEA/HIPAA/USP (US) and NAPRA/CDSA/PIPEDA (Canada).\nExam blueprint weights match the specific credentialing body (e.g., PTCB for US, PEBC for Canada).\nPass criteria reflect the region-specific scoring model.\nMock exams and question pools are filtered for region-appropriate content.\n\nFaculty analytics reflect the region-specific blueprint, so domain heatmaps show performance against the correct exam structure."
      },
      {
        q: "Can we support students in both US and Canadian tracks?",
        a: "For Enterprise tier institutions, yes. Multi-region support allows students within the same institution to select their target region. Each student's dashboard, mock exams, and analytics reflect their selected track.\n\nFor Cohort and Program Partner tiers, the institution selects one region during onboarding. If you have students targeting both regions, contact our licensing team about Enterprise options."
      },
    ]
  },
  {
    title: "Privacy, Security, and Compliance",
    items: [
      {
        q: "Is student data privacy protected under HIPAA and PIPEDA?",
        a: "NurseNest does not store patient health information (PHI), so HIPAA does not directly apply to our platform. However, we follow HIPAA-aligned data security practices including encryption at rest and in transit, role-based access controls, and audit logging.\n\nFor Canadian institutions, we comply with PIPEDA requirements for personal information protection. Student data is stored securely, access is restricted to authorized faculty and administrators, and all data handling follows privacy-by-design principles.\n\nWe provide a Data Privacy Agreement for institutional contracts upon request."
      },
      {
        q: "How do you prevent students from sharing invite codes?",
        a: "Domain Lock (default): Only verified emails from your institution's domain can redeem the code. A student with a personal Gmail cannot use a code restricted to @myschool.edu.\n\nRoster Allowlist: Only pre-approved emails uploaded by the admin can enroll. Every other email is blocked.\n\nApproval Required: Every enrollment request goes to the faculty/admin queue for manual approval.\n\nAll enrollment events are recorded in the audit log. Repeated failed attempts trigger monitoring alerts. Each student can only hold one seat per institution."
      },
    ]
  },
  {
    title: "Integration and Customization",
    items: [
      {
        q: "Can we integrate with our LMS (Canvas, Blackboard, Moodle)?",
        a: "LMS integration is available as an Enterprise add-on. It supports SSO (single sign-on) and grade passback to Canvas, Blackboard, Moodle, and D2L Brightspace. Students log in through your LMS and scores are automatically synced.\n\nFor Cohort and Program Partner tiers, integration is not included but can be added as an add-on. Contact our licensing team for details."
      },
      {
        q: "Can we customize mock exams to match our curriculum sequence?",
        a: "Custom Mock Alignment is available as an add-on for Program Partner and Enterprise tiers. It allows you to adjust domain weights and question distribution to match your specific course sequence. For example, if your program covers Pharmacology before Compounding, you can create mock exams that emphasize early-semester topics.\n\nStandard mock exams follow the official credentialing body blueprint (e.g., PTCB, NBRC, NREMT)."
      },
      {
        q: "Do you provide accreditation reporting support?",
        a: "Yes. Faculty Pro includes CSV and PDF performance exports suitable for accreditation documentation. The Accreditation Reporting Pack add-on provides additional competency mapping reports, domain mastery summaries aligned to credentialing body competencies, and formatted documentation ready for accreditation reviewers.\n\nOur reports map student performance to the official exam blueprint, making it straightforward to demonstrate that your curriculum prepares students for the specific competencies tested on the certification exam."
      },
      {
        q: "Do you offer custom contracts?",
        a: "Yes. Enterprise tier contracts are fully customizable, including term length, seat counts, multi-career access, add-on bundles, and payment schedules. We also offer multi-year agreements with volume discounts.\n\nFor Cohort and Program Partner tiers, standard terms apply but can be adjusted for specific institutional requirements. Contact our licensing team to discuss your needs."
      },
      {
        q: "Do you offer a pilot program?",
        a: "Yes. We offer a 30-day pilot with Faculty Lite analytics for one cohort. During the pilot, students get full access to the question bank, mock exams, and study tools. Faculty receive aggregate cohort analytics including domain heatmaps and readiness scores.\n\nAfter the pilot, we deliver a performance report showing student engagement, domain mastery, and readiness trends. There is no obligation to continue. If you decide to proceed, pilot pricing applies toward your semester contract."
      },
    ]
  },
];

const COMPARISON_TABLE = [
  { feature: "Enrollment", cohort: "Bulk at semester start", individual: "Rolling, per student" },
  { feature: "Expiration", cohort: "All students share end date", individual: "Each student independent" },
  { feature: "Billing", cohort: "Flat semester or per seat", individual: "Per student per month" },
  { feature: "Best For", cohort: "Fixed cohort programs", individual: "Rolling admissions" },
  { feature: "Analytics", cohort: "Cohort-level heatmaps", individual: "Same, asynchronous progress" },
  { feature: "Seat Reuse", cohort: "Released at semester end", individual: "Released at license expiry" },
];

export default function AlliedInstitutionsFAQPage() {
  const { t } = useI18n();
  return (
    <div data-testid="institutions-faq-page">
      <AlliedSEO
        title={t("allied.alliedInstitutionsFaq.institutionalFaqLicensingAnalyticsAnd")}
        description={t("allied.alliedInstitutionsFaq.answersToCommonQuestionsAbout")}
        keywords="institutional exam prep FAQ, cohort licensing questions, faculty analytics, enrollment security, HIPAA compliance exam prep, institutional pricing"
        canonicalPath="/institutions/faq"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": FAQ_SECTIONS.flatMap(s => s.items).map(item => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": { "@type": "Answer", "text": item.a.replace(/\n/g, " ") }
          }))
        }}
      />

      <section className="py-12 sm:py-16 bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/institutions" className="hover:text-teal-600">{t("allied.alliedInstitutionsFaq.institutions")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-teal-700 font-medium">FAQ</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" data-testid="text-faq-title">{t("allied.alliedInstitutionsFaq.institutionalAccessFaq")}</h1>
          <p className="text-lg text-gray-600 max-w-2xl">{t("allied.alliedInstitutionsFaq.everythingYouNeedToKnow")}</p>
        </div>
      </section>

      {/* Decision Guide */}
      <section className="py-12 bg-white border-b border-gray-100" data-testid="section-decision-guide">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t("allied.alliedInstitutionsFaq.quickDecisionGuideWhichModel")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-teal-50 rounded-xl border border-teal-100 p-6">
              <h3 className="font-bold text-teal-800 mb-3">{t("allied.alliedInstitutionsFaq.chooseCohortIf")}</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />{t("allied.alliedInstitutionsFaq.yourStudentsStartAndFinish")}</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />{t("allied.alliedInstitutionsFaq.youRunFixedSemestersFallwinterspring")}</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />{t("allied.alliedInstitutionsFaq.youWantSimplifiedBillingOne")}</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />{t("allied.alliedInstitutionsFaq.youNeedCohortlevelAnalyticsFor")}</li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
              <h3 className="font-bold text-blue-800 mb-3">{t("allied.alliedInstitutionsFaq.chooseIndividualIf")}</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />{t("allied.alliedInstitutionsFaq.studentsJoinAtDifferentTimes")}</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />{t("allied.alliedInstitutionsFaq.studentsHaveDifferentExamDates")}</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />{t("allied.alliedInstitutionsFaq.youRunAContinuingEducation")}</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />{t("allied.alliedInstitutionsFaq.youWantPerstudentBillingFlexibility")}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-12 bg-gray-50" data-testid="section-comparison-table">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t("allied.alliedInstitutionsFaq.cohortVsIndividualSidebyside")}</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
              <div className="px-5 py-3 text-sm font-semibold text-gray-500" />
              <div className="px-5 py-3 text-sm font-bold text-teal-700 text-center">{t("allied.alliedInstitutionsFaq.cohort")}</div>
              <div className="px-5 py-3 text-sm font-bold text-blue-700 text-center">{t("allied.alliedInstitutionsFaq.individual")}</div>
            </div>
            {COMPARISON_TABLE.map((row, i) => (
              <div key={i} className={`grid grid-cols-3 ${i < COMPARISON_TABLE.length - 1 ? "border-b border-gray-100" : ""}`}>
                <div className="px-5 py-4 text-sm font-medium text-gray-700 bg-gray-50/50">{row.feature}</div>
                <div className="px-5 py-4 text-sm text-gray-600 text-center">{row.cohort}</div>
                <div className="px-5 py-4 text-sm text-gray-600 text-center">{row.individual}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      {FAQ_SECTIONS.map((section, sIdx) => (
        <section key={sIdx} className={`py-12 ${sIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}`} data-testid={`faq-section-${sIdx}`}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{section.title}</h2>
            <div className="space-y-3">
              {section.items.map((item, iIdx) => (
                <FAQAccordion key={iIdx} question={item.q} answer={item.a} testId={`faq-${sIdx}-${iIdx}`} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-br from-teal-600 to-teal-700" data-testid="section-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{t("allied.alliedInstitutionsFaq.stillHaveQuestions")}</h2>
          <p className="text-teal-100 mb-8 text-lg">{t("allied.alliedInstitutionsFaq.ourLicensingTeamIsHere")}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/institutions#contact-form" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-teal-700 rounded-xl font-bold hover:bg-teal-50 transition-colors shadow-lg" data-testid="button-contact-pricing">
              Request Pricing <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="mailto:institutions@nursenest.ca" className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-400 transition-colors border border-teal-400" data-testid="button-email-licensing">
              Email Licensing Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function FAQAccordion({ question, answer, testId }: { question: string; answer: string; testId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors" data-testid={`button-${testId}`}>
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform text-gray-400 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed whitespace-pre-line" data-testid={`text-${testId}`}>
          {answer}
        </div>
      )}
    </div>
  );
}
