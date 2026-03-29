import { useState } from "react";
import { Link } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight, CheckCircle2, ChevronRight, Shield, BarChart3, Users,
  Target, TrendingUp, Clock, Award, FileText, BookOpen, Lock,
  HelpCircle, ChevronDown, Globe, Zap, AlertTriangle, GraduationCap
} from "lucide-react";

const PAIN_POINTS = [
  {
    stat: "38%",
    label: "of allied health programs report declining first-attempt pass rates over the last 3 years",
  },
  {
    stat: "12+ hrs",
    label: "per week faculty spend grading, tracking, and manually identifying struggling students",
  },
  {
    stat: "1 in 4",
    label: "students who fail their certification exam never reattempt, leaving the profession permanently",
  },
  {
    stat: "$15,000+",
    label: "average cost to a student who must repeat coursework and retest after failing a certification exam",
  },
];

const WHY_PARTNER = [
  {
    icon: Target,
    title: "Predict Exam Readiness Before Test Day",
    description: "Our readiness engine tracks every student across all exam domains. Faculty see which students are on track and which need intervention -- weeks before the exam, not after a failing score arrives.",
  },
  {
    icon: AlertTriangle,
    title: "Catch At-Risk Students Early",
    description: "Students scoring below 60% in any exam domain are automatically flagged. Faculty receive domain-level heatmaps showing exactly where each student struggles, so remediation is targeted, not guesswork.",
  },
  {
    icon: Clock,
    title: "Reduce Faculty Workload by Hours Per Week",
    description: "Automated scoring, domain analytics, and readiness reports replace hours of manual grading and spreadsheet tracking. Faculty spend less time on admin and more time teaching.",
  },
  {
    icon: Shield,
    title: "Align to the Exact Exam Blueprint",
    description: "Mock exams are weighted to the official exam blueprint (PTCB, NBRC, NREMT, ASCP, ARRT, CAMRT, CSMLS, and more). Students practice exactly what they will be tested on -- not generic questions.",
  },
  {
    icon: Globe,
    title: "US and Canada Exam Tracks Built In",
    description: "One platform supports both US and Canadian credentialing exams. Lab values switch between mg/dL and mmol/L. Legal modules switch between DEA/HIPAA and NAPRA/PIPEDA. No separate purchase needed.",
  },
  {
    icon: FileText,
    title: "Support Accreditation Documentation",
    description: "Export cohort performance data, domain mastery reports, and competency mapping documentation. When accreditation reviewers ask for student outcome data, you have it ready.",
  },
];

const CAREER_PROGRAMS = [
  { name: "Pharmacy Technician", slug: "pharmacy-tech", exams: "PTCB / PEBC", color: "#9333EA" },
  { name: "Respiratory Therapist", slug: "rrt", exams: "NBRC TMC / CBRC", color: "#2196F3" },
  { name: "Paramedic", slug: "paramedic", exams: "NREMT / Provincial", color: "#F44336" },
  { name: "Medical Lab Technologist", slug: "mlt", exams: "ASCP / CSMLS", color: "#FF9800" },
  { name: "Diagnostic Imaging", slug: "imaging", exams: "ARRT / CAMRT", color: "#4CAF50" },
];

const MODEL_COMPARISON = [
  { feature: "Best For", cohort: "Semester-based programs with fixed cohorts", individual: "Rolling admissions, continuing education, or self-paced programs" },
  { feature: "Seat Structure", cohort: "All students share one pool of seats with a common end date", individual: "Each student gets an independent license tied to their exam date" },
  { feature: "Expiration", cohort: "All access ends on the semester end date", individual: "Each student's access expires independently (exam date or fixed duration)" },
  { feature: "Enrollment", cohort: "Bulk enrollment via CSV or invite code at semester start", individual: "Rolling enrollment as students join the program" },
  { feature: "Billing", cohort: "Flat semester fee or per-seat per-semester", individual: "Per student per month or fixed-duration license" },
  { feature: "Faculty Analytics", cohort: "Cohort-level heatmaps, readiness averages, at-risk flags", individual: "Same analytics, but students may be at different stages" },
];

const TIERS = [
  {
    name: "Cohort Access",
    price: "From $18/seat/semester",
    description: "For programs that need exam-aligned practice and basic cohort analytics.",
    features: [
      "Blueprint-weighted mock exams",
      "Full question bank access",
      "Readiness exams (always free for students)",
      "Faculty Lite analytics (aggregate only)",
      "Domain-lock enrollment security",
      "US and Canada exam track support",
      "Bulk CSV enrollment",
    ],
    cta: "Request Cohort Pricing",
    highlight: false,
  },
  {
    name: "Program Partner",
    price: "From $28/seat/semester",
    description: "For programs that want student-level analytics, at-risk detection, and accreditation support.",
    features: [
      "Everything in Cohort Access",
      "Faculty Pro analytics (student-level drilldown)",
      "At-risk student flagging (below 60%)",
      "Remediation recommendations",
      "CSV and PDF performance exports",
      "Accreditation documentation support",
      "Dedicated onboarding support",
    ],
    cta: "Request Partner Pricing",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom pricing",
    description: "For multi-program institutions, custom integrations, and white-label options.",
    features: [
      "Everything in Program Partner",
      "Multi-career access (all allied + nursing)",
      "Custom mock exam alignment",
      "LMS integration options",
      "White-label branding available",
      "Accreditation Reporting Pack",
      "Priority support and SLA",
      "Custom contract terms",
    ],
    cta: "Contact Enterprise Sales",
    highlight: false,
  },
];

const ADDONS = [
  { name: "Accreditation Reporting Pack", description: "Competency mapping, domain mastery exports, and audit-ready documentation" },
  { name: "Custom Mock Alignment", description: "Align mock exam domains and weights to your specific curriculum sequence" },
  { name: "White-Label Branding", description: "Your institution's logo, colors, and domain on the student-facing platform" },
  { name: "LMS Integration", description: "Grade passback and SSO integration with Canvas, Blackboard, Moodle, and D2L" },
  { name: "Faculty Pro Upgrade", description: "Student-level analytics, at-risk flags, and remediation recommendations" },
];

const FAQS = [
  {
    q: "How is institutional access different from individual student subscriptions?",
    a: "Institutional access gives your program centralized enrollment, faculty analytics, cohort tracking, and domain-lock security. Students get the same high-quality exam prep content, but faculty gain visibility into performance across the entire cohort. Individual subscriptions do not include faculty oversight or cohort analytics."
  },
  {
    q: "Do you support both US and Canadian certification exams?",
    a: "Yes. Every career track supports both US and Canadian exam boards. The platform automatically adjusts lab values (mg/dL vs mmol/L), legal modules (DEA/HIPAA vs NAPRA/PIPEDA), and exam blueprint weights based on your selected region. Faculty analytics reflect the region-specific blueprint."
  },
  {
    q: "How do you prevent students from sharing invite codes?",
    a: "Domain Lock is the default enrollment mode. Students must register with a verified email from your institution's domain (e.g., @myschool.edu). We also support Roster Allowlist (only pre-approved emails can enroll) and Approval Required (faculty must approve each enrollment request). All enrollment events are logged in the audit trail."
  },
  {
    q: "Can students still access free readiness exams?",
    a: "Yes. Readiness exams are always free for all authenticated users, whether or not they have an institutional license. Institutional access adds full question bank access, unlimited mock exams, study tools, and faculty analytics on top of the free readiness tier."
  },
  {
    q: "What analytics do faculty receive?",
    a: "Faculty Lite provides aggregate cohort metrics: domain heatmaps, readiness averages, mock score distributions, and completion rates. Faculty Pro adds student-level drilldown, at-risk flagging for students below 60% in any domain, remediation recommendations, and CSV/PDF exports for accreditation."
  },
  {
    q: "Do you offer a pilot program?",
    a: "Yes. We offer a 30-day pilot with Faculty Lite analytics for one cohort. After the pilot, you receive a performance report showing domain mastery, readiness scores, and at-risk identification. There is no obligation to continue, and pilot pricing applies toward a semester contract if you proceed."
  },
];

export default function AlliedInstitutionsPage() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    institutionName: "", programType: "", estimatedStudentCount: "",
    country: "", contactName: "", email: "", phone: "", message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    try {
      const res = await fetch("/api/institutions/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          institutionName: formData.institutionName,
          programType: formData.programType,
          estimatedStudentCount: parseInt(formData.estimatedStudentCount) || 0,
          country: formData.country,
          contactName: formData.contactName,
          email: formData.email,
          phone: formData.phone || null,
          message: formData.message || null,
        }),
      });
      if (res.ok) {
        setFormSubmitted(true);
      } else {
        setFormError("Something went wrong. Please try again or email us directly.");
      }
    } catch {
      setFormError("Connection error. Please try again.");
    }
  }

  return (
    <div data-testid="institutions-page">
      <AlliedSEO
        title={t("allied.alliedInstitutions.institutionalExamPrepForAllied")}
        description={t("allied.alliedInstitutions.improveCertificationPassRatesWith")}
        keywords="institutional exam prep, allied health program, certification pass rates, faculty analytics, cohort licensing, PTCB prep for schools, NBRC prep for programs, nursing exam prep institutional"
        canonicalPath="/institutions"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "NurseNest Institutional Access",
          "description": "Exam readiness and performance analytics platform for allied health and nursing programs.",
          "provider": { "@type": "Organization", "name": "NurseNest Allied", "url": "https://www.nursenest.ca/allied-health" },
        }}
        additionalStructuredData={[
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": FAQS.map(faq => ({
              "@type": "Question",
              "name": faq.q,
              "acceptedAnswer": { "@type": "Answer", "text": faq.a },
            })),
          },
        ]}
      />

      {/* Hero */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%)" }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/20 text-teal-300 text-sm font-medium mb-6">
            <GraduationCap className="w-4 h-4" />
            For Program Directors, Faculty, and Academic Coordinators
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight" data-testid="text-hero-title">
            Your Students Deserve Better Than<br className="hidden sm:block" /> Generic Test Banks
          </h1>
          <p className="text-lg sm:text-xl text-teal-100 mb-4 max-w-3xl mx-auto leading-relaxed">
            NurseNest gives allied health programs what no other platform does: blueprint-weighted exams that match the real test, faculty analytics that identify struggling students before they fail, and the only platform with built-in US and Canadian exam track switching.
          </p>
          <p className="text-base text-teal-200/80 mb-10 max-w-2xl mx-auto">
            Used by pharmacy tech, respiratory therapy, paramedic, medical lab, and diagnostic imaging programs across North America.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#contact-form" className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/30" data-testid="button-hero-pricing">
              Request Institutional Pricing <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#contact-form" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20" data-testid="button-hero-demo">
              Book a Demo
            </a>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16 bg-white border-b border-gray-100" data-testid="section-pain-points">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t("allied.alliedInstitutions.theProblemsYourProgramIs")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("allied.alliedInstitutions.theseAreNotHypotheticalsPrograms")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PAIN_POINTS.map((p, i) => (
              <div key={i} className="text-center px-4 py-6 bg-red-50/50 rounded-2xl border border-red-100" data-testid={`pain-point-${i}`}>
                <div className="text-3xl font-bold text-red-600 mb-2">{p.stat}</div>
                <div className="text-sm text-gray-700 leading-relaxed">{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How NurseNest Solves This */}
      <section className="py-20 bg-gray-50" data-testid="section-why-partner">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t("allied.alliedInstitutions.howNursenestSolvesTheseProblems")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("allied.alliedInstitutions.weBuiltNursenestSpecificallyFor")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_PARTNER.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow" data-testid={`why-partner-${i}`}>
                <item.icon className="w-8 h-8 text-teal-500 mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 bg-white" data-testid="section-differentiators">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t("allied.alliedInstitutions.whatMakesNursenestDifferentFrom")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-teal-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{t("allied.alliedInstitutions.blueprintweightedNotRandom")}</h4>
                  <p className="text-sm text-gray-600">{t("allied.alliedInstitutions.everyMockExamIsWeighted")}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-teal-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{t("allied.alliedInstitutions.realExamModeSimulation")}</h4>
                  <p className="text-sm text-gray-600">{t("allied.alliedInstitutions.ourMockExamsUseAdaptive")}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-teal-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{t("allied.alliedInstitutions.600WordRationales")}</h4>
                  <p className="text-sm text-gray-600">{t("allied.alliedInstitutions.mostPlatformsGiveAOnesentence")}</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-teal-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{t("allied.alliedInstitutions.usCanadaInOnePlatform")}</h4>
                  <p className="text-sm text-gray-600">{t("allied.alliedInstitutions.toggleBetweenUsAndCanadian")}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-teal-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{t("allied.alliedInstitutions.facultySeeWhatStudentsCannot")}</h4>
                  <p className="text-sm text-gray-600">{t("allied.alliedInstitutions.domainHeatmapsRevealExactlyWhich")}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-teal-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{t("allied.alliedInstitutions.securityThatProtectsYourInvestment")}</h4>
                  <p className="text-sm text-gray-600">{t("allied.alliedInstitutions.domainLockEnsuresOnlyStudents")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Programs */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white" data-testid="section-programs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("allied.alliedInstitutions.supportedAlliedHealthPrograms")}</h2>
            <p className="text-gray-600">{t("allied.alliedInstitutions.onePlatformFiveCareerTracks")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {CAREER_PROGRAMS.map(career => (
              <Link key={career.slug} href={`/${career.slug}`} className="group" data-testid={`program-card-${career.slug}`}>
                <div className="bg-white rounded-xl border border-gray-100 p-5 text-center hover:shadow-md hover:border-teal-200 transition-all">
                  <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: career.color + "15", color: career.color }}>
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-teal-700 transition-colors">{career.name}</div>
                  <div className="text-xs text-gray-500">{career.exams}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Dashboard Preview */}
      <section className="py-20 bg-white" data-testid="section-faculty-preview">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t("allied.alliedInstitutions.facultyAnalyticsThatActuallyChange")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("allied.alliedInstitutions.mostPlatformsGiveYouA")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-100 p-6">
              <BarChart3 className="w-7 h-7 text-teal-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">{t("allied.alliedInstitutions.domainWeaknessHeatmap")}</h3>
              <p className="text-sm text-gray-600 mb-4">{t("allied.alliedInstitutions.seeWhichExamDomainsYour")}</p>
              <div className="space-y-2">
                {["Medications", "Patient Safety", "Federal Requirements", "Order Processing"].map((d, i) => {
                  const vals = [82, 45, 61, 73];
                  const colors = ["#059669", "#dc2626", "#d97706", "#059669"];
                  return (
                    <div key={d}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-gray-600">{d}</span>
                        <span className="font-medium" style={{ color: colors[i] }}>{vals[i]}%</span>
                      </div>
                      <div className="w-full bg-white/60 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full" style={{ width: `${vals[i]}%`, backgroundColor: colors[i] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100 p-6">
              <AlertTriangle className="w-7 h-7 text-red-500 mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">{t("allied.alliedInstitutions.atriskStudentDetection")}</h3>
              <p className="text-sm text-gray-600 mb-4">{t("allied.alliedInstitutions.studentsScoringBelow60In")}</p>
              <div className="space-y-2 text-sm">
                {[
                  { name: "Student A", domain: "Federal Requirements", score: 42 },
                  { name: "Student B", domain: "Patient Safety", score: 51 },
                  { name: "Student C", domain: "Pharmacology", score: 38 },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/60 rounded-lg px-3 py-2">
                    <div>
                      <span className="font-medium text-gray-800">{s.name}</span>
                      <span className="text-gray-400 mx-1">--</span>
                      <span className="text-gray-600">{s.domain}</span>
                    </div>
                    <span className="text-red-600 font-bold">{s.score}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
              <TrendingUp className="w-7 h-7 text-blue-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">{t("allied.alliedInstitutions.mockExamPerformanceDistribution")}</h3>
              <p className="text-sm text-gray-600 mb-4">{t("allied.alliedInstitutions.visualizeHowYourCohortPerforms")}</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white/60 rounded-lg py-3">
                  <div className="text-xl font-bold text-blue-700">72%</div>
                  <div className="text-xs text-gray-500">{t("allied.alliedInstitutions.avgScore")}</div>
                </div>
                <div className="bg-white/60 rounded-lg py-3">
                  <div className="text-xl font-bold text-green-600">84%</div>
                  <div className="text-xs text-gray-500">{t("allied.alliedInstitutions.passRate")}</div>
                </div>
                <div className="bg-white/60 rounded-lg py-3">
                  <div className="text-xl font-bold text-teal-600">+11%</div>
                  <div className="text-xs text-gray-500">{t("allied.alliedInstitutions.improvement")}</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 p-6">
              <FileText className="w-7 h-7 text-purple-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">{t("allied.alliedInstitutions.accreditationreadyExports")}</h3>
              <p className="text-sm text-gray-600 mb-4">{t("allied.alliedInstitutions.downloadCohortPerformanceReportsIn")}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700"><CheckCircle2 className="w-4 h-4 text-purple-500" /> {t("allied.alliedInstitutions.competencyMappingByExamBlueprint")}</div>
                <div className="flex items-center gap-2 text-gray-700"><CheckCircle2 className="w-4 h-4 text-purple-500" /> {t("allied.alliedInstitutions.domainMasteryPercentagesPerStudent")}</div>
                <div className="flex items-center gap-2 text-gray-700"><CheckCircle2 className="w-4 h-4 text-purple-500" /> {t("allied.alliedInstitutions.passProbabilityAndReadinessTrends")}</div>
                <div className="flex items-center gap-2 text-gray-700"><CheckCircle2 className="w-4 h-4 text-purple-500" /> {t("allied.alliedInstitutions.exportableToCsvPdfAnd")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cohort vs Individual Model */}
      <section className="py-20 bg-gray-50" data-testid="section-model-comparison">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t("allied.alliedInstitutions.twoLicensingModelsChooseWhat")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("allied.alliedInstitutions.whetherYouRunFixedSemesters")}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
              <div className="px-5 py-3 text-sm font-semibold text-gray-500" />
              <div className="px-5 py-3 text-sm font-bold text-teal-700 text-center">{t("allied.alliedInstitutions.cohortModel")}</div>
              <div className="px-5 py-3 text-sm font-bold text-blue-700 text-center">{t("allied.alliedInstitutions.individualModel")}</div>
            </div>
            {MODEL_COMPARISON.map((row, i) => (
              <div key={i} className={`grid grid-cols-3 ${i < MODEL_COMPARISON.length - 1 ? "border-b border-gray-100" : ""}`}>
                <div className="px-5 py-4 text-sm font-medium text-gray-700 bg-gray-50/50">{row.feature}</div>
                <div className="px-5 py-4 text-sm text-gray-600 text-center">{row.cohort}</div>
                <div className="px-5 py-4 text-sm text-gray-600 text-center">{row.individual}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20 bg-white" data-testid="section-pricing-tiers">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t("allied.alliedInstitutions.institutionalPricing")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("allied.alliedInstitutions.everyTierIncludesUsAnd")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map((tier, i) => (
              <div key={i} className={`rounded-2xl p-6 ${tier.highlight ? "bg-white border-2 border-teal-500 shadow-lg shadow-teal-100 relative" : "bg-white border border-gray-200"}`} data-testid={`tier-card-${i}`}>
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 bg-teal-600 text-white text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-lg font-bold text-gray-900 mb-1">{tier.name}</h3>
                <div className="text-2xl font-bold text-teal-700 mb-1">{tier.price}</div>
                <p className="text-sm text-gray-500 mb-5">{tier.description}</p>
                <ul className="space-y-2.5 mb-6">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href="#contact-form" className={`block w-full text-center px-4 py-2.5 rounded-xl font-semibold transition-colors ${tier.highlight ? "bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-200" : "bg-teal-50 text-teal-700 hover:bg-teal-100"}`} data-testid={`button-tier-${i}`}>
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-16 bg-gray-50" data-testid="section-addons">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("allied.alliedInstitutions.optionalAddons")}</h2>
            <p className="text-gray-600">{t("allied.alliedInstitutions.customizeYourInstitutionalPackageWith")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ADDONS.map((addon, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5" data-testid={`addon-${i}`}>
                <Zap className="w-5 h-5 text-teal-500 mb-2" />
                <div className="font-semibold text-gray-900 text-sm mb-1">{addon.name}</div>
                <div className="text-xs text-gray-500">{addon.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enrollment Security */}
      <section className="py-20 bg-white" data-testid="section-security">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t("allied.alliedInstitutions.enrollmentSecurityThatProtectsYour")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("allied.alliedInstitutions.sharedCodesAreTheNumber")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <Lock className="w-7 h-7 text-teal-500 mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">{t("allied.alliedInstitutions.domainLockDefault")}</h3>
              <p className="text-sm text-gray-600 mb-3">{t("allied.alliedInstitutions.onlyStudentsWithAVerified")}</p>
              <div className="px-3 py-2 bg-teal-50 rounded-lg text-xs text-teal-700 font-medium">{t("allied.alliedInstitutions.recommendedForMostPrograms")}</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <Users className="w-7 h-7 text-blue-500 mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">{t("allied.alliedInstitutions.rosterAllowlist")}</h3>
              <p className="text-sm text-gray-600 mb-3">{t("allied.alliedInstitutions.uploadAListOfApproved")}</p>
              <div className="px-3 py-2 bg-blue-50 rounded-lg text-xs text-blue-700 font-medium">{t("allied.alliedInstitutions.forControlledEnrollment")}</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <Shield className="w-7 h-7 text-purple-500 mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">{t("allied.alliedInstitutions.approvalRequired")}</h3>
              <p className="text-sm text-gray-600 mb-3">{t("allied.alliedInstitutions.studentsRequestAccessAndFaculty")}</p>
              <div className="px-3 py-2 bg-purple-50 rounded-lg text-xs text-purple-700 font-medium">{t("allied.alliedInstitutions.maximumControl")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pilot Program */}
      <section className="py-16 bg-gradient-to-br from-teal-600 to-teal-700" data-testid="section-pilot">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="w-10 h-10 text-teal-200 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{t("allied.alliedInstitutions.startWithA30dayPilot")}</h2>
          <p className="text-teal-100 mb-3 text-lg max-w-2xl mx-auto">
            Not ready to commit? Run a risk-free pilot with one cohort. You get Faculty Lite analytics, full student access, and a post-pilot performance report.
          </p>
          <p className="text-teal-200/80 mb-8 max-w-xl mx-auto text-sm">
            No obligation to continue. If you decide to proceed, pilot pricing applies toward your semester contract.
          </p>
          <a href="#contact-form" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-teal-700 rounded-xl font-bold hover:bg-teal-50 transition-colors shadow-lg" data-testid="button-pilot-cta">
            Request a Pilot <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("allied.alliedInstitutions.frequentlyAskedQuestions")}</h2>
            <p className="text-gray-600">Have more questions? <Link href="/institutions/faq" className="text-teal-600 font-medium hover:underline" data-testid="link-full-faq">{t("allied.alliedInstitutions.viewFullInstitutionalFaq")}</Link></p>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gray-50" id="contact-form" data-testid="section-contact">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t("allied.alliedInstitutions.getInstitutionalPricing")}</h2>
            <p className="text-gray-600">{t("allied.alliedInstitutions.tellUsAboutYourProgram")}</p>
          </div>
          {formSubmitted ? (
            <div className="bg-white rounded-2xl border border-teal-200 p-8 text-center" data-testid="form-success">
              <CheckCircle2 className="w-12 h-12 text-teal-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t("allied.alliedInstitutions.thankYou")}</h3>
              <p className="text-gray-600 mb-4">{t("allied.alliedInstitutions.weReceivedYourRequestAnd")}</p>
              <p className="text-sm text-gray-500">{t("allied.alliedInstitutions.needImmediateAssistanceEmailUs")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.alliedInstitutions.institutionName")}</label>
                  <input type="text" required value={formData.institutionName} onChange={e => setFormData(p => ({ ...p, institutionName: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm" placeholder="e.g., Mohawk College" data-testid="input-institution-name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.alliedInstitutions.programType")}</label>
                  <select required value={formData.programType} onChange={e => setFormData(p => ({ ...p, programType: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm" data-testid="input-program-type">
                    <option value="">{t("allied.alliedInstitutions.selectProgram")}</option>
                    <option value="Pharmacy Technician">{t("allied.alliedInstitutions.pharmacyTechnician")}</option>
                    <option value="Respiratory Therapy">{t("allied.alliedInstitutions.respiratoryTherapy")}</option>
                    <option value="Paramedic">{t("allied.alliedInstitutions.paramedicEms")}</option>
                    <option value="Medical Laboratory">{t("allied.alliedInstitutions.medicalLaboratory")}</option>
                    <option value="Diagnostic Imaging">{t("allied.alliedInstitutions.diagnosticImaging")}</option>
                    <option value="Nursing">{t("allied.alliedInstitutions.nursingRpnRnNp")}</option>
                    <option value="Multiple Programs">{t("allied.alliedInstitutions.multiplePrograms")}</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.alliedInstitutions.estimatedStudentCount")}</label>
                  <input type="number" required value={formData.estimatedStudentCount} onChange={e => setFormData(p => ({ ...p, estimatedStudentCount: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm" placeholder="e.g., 120" min="1" data-testid="input-student-count" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.alliedInstitutions.country")}</label>
                  <select required value={formData.country} onChange={e => setFormData(p => ({ ...p, country: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm" data-testid="input-country">
                    <option value="">{t("allied.alliedInstitutions.selectCountry")}</option>
                    <option value="United States">{t("allied.alliedInstitutions.unitedStates")}</option>
                    <option value="Canada">{t("allied.alliedInstitutions.canada")}</option>
                    <option value="Other">{t("allied.alliedInstitutions.other")}</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.alliedInstitutions.contactName")}</label>
                  <input type="text" required value={formData.contactName} onChange={e => setFormData(p => ({ ...p, contactName: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm" placeholder={t("allied.alliedInstitutions.yourName")} data-testid="input-contact-name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.alliedInstitutions.email")}</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm" placeholder={t("allied.alliedInstitutions.nameschooledu")} data-testid="input-email" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.alliedInstitutions.phoneOptional")}</label>
                <input type="tel" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm" placeholder="(555) 123-4567" data-testid="input-phone" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.alliedInstitutions.tellUsAboutYourProgram2")}</label>
                <textarea value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} rows={4} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none" placeholder={t("allied.alliedInstitutions.numberOfCohortsPerYear")} data-testid="input-message" />
              </div>
              {formError && <p className="text-sm text-red-600" data-testid="text-form-error">{formError}</p>}
              <button type="submit" className="w-full px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200" data-testid="button-submit-form">
                Request Pricing Proposal
              </button>
              <p className="text-xs text-gray-400 text-center">{t("allied.alliedInstitutions.weRespondWithin24Hours")}</p>
            </form>
          )}
        </div>
      </section>

      {/* Contact Licensing Team */}
      <section className="py-12 bg-white border-t border-gray-100" data-testid="section-contact-licensing">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-gray-600 mb-2">{t("allied.alliedInstitutions.haveASpecificQuestionAbout")}</p>
          <p className="text-gray-900 font-medium">Contact our Licensing Team: <a href="mailto:institutions@nursenest.ca" className="text-teal-600 hover:underline">{t("allied.alliedInstitutions.institutionsnursenestca")}</a></p>
        </div>
      </section>
    </div>
  );
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-item-${index}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors" data-testid={`button-faq-${index}`}>
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform text-gray-400 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed" data-testid={`text-faq-${index}`}>
          {answer}
        </div>
      )}
    </div>
  );
}
