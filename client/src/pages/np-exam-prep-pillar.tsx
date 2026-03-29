import { SEO } from "@/components/seo";
import { LocaleLink } from "@/lib/LocaleLink";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ComparisonTable, DifferentiatorCTA } from "@/components/competitive-differentiation";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { EndOfContentLeadCapture } from "@/components/lead-capture";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { NP_EXAM_HUB_CARDS } from "@/lib/np-exam-ecosystem";
import { useState } from "react";
import {
  BookOpen, Target, ArrowRight,
  Award, Brain, GraduationCap, BarChart, Shield, Clock,
  CheckCircle, ChevronDown, Lightbulb,
  Globe, Users, Star, HelpCircle, Sparkles, Flag, Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useI18n } from "@/lib/i18n";
const PILLAR_FAQS = [
  {
    q: "What is the difference between AANP and ANCC certification?",
    a: "The AANP (American Academy of Nurse Practitioners) and ANCC (American Nurses Credentialing Center) are two separate certifying bodies in the United States. The AANP exam has 150 questions over 4 hours and focuses more heavily on clinical management scenarios. The ANCC exam has 175 questions over 3.5 hours and includes additional questions on professional role, research methodology, and healthcare policy. Both certifications are accepted nationwide for NP licensure and prescriptive authority. Your choice may depend on employer preference, your program's recommendation, or which exam format aligns better with your study strengths."
  },
  {
    q: "How long should I study for a nurse practitioner certification exam?",
    a: "Most NP candidates benefit from a structured 10–12 week study plan. The first 3 weeks should focus on foundational content review across all exam domains. Weeks 4–6 should emphasize daily practice questions with detailed rationale review. Weeks 7–9 are best spent targeting weak domains identified through practice analytics. The final weeks should involve full-length mock exams under timed conditions. Factors like your clinical experience, time since graduation, and chosen exam (AANP, ANCC, or CNPLE) may adjust this timeline."
  },
  {
    q: "Do I need NP certification to practice as a nurse practitioner?",
    a: "Yes. In the United States, NP certification from a recognized body (AANP or ANCC) is required for state licensure and prescriptive authority. In Canada, the Canadian Nurse Practitioner Licensing Examination (CNPLE) is required for NP registration. Without certification, you cannot legally practice as an NP, prescribe medications, or use the NP title. Certification must be maintained through continuing education and periodic renewal."
  },
  {
    q: "Can I take the NP certification exam before finishing my program?",
    a: "Generally, no. You must complete your accredited graduate-level NP program (Master's or Doctoral) before sitting for the certification exam. In the US, both AANP and ANCC require proof of program completion, including all required clinical hours. In Canada, you must graduate from an approved NP program before registering for the CNPLE. Some programs allow you to apply for the exam in your final semester, but you cannot test until all requirements are met."
  },
  {
    q: "What happens if I fail the NP certification exam?",
    a: "If you fail, you can retake the exam. For the AANP, you may retake up to 3 times within a 365-day period. For the ANCC, you can reapply after a 60-day waiting period. The CNPLE allows retakes according to provincial regulatory body policies. Use your score report to identify weak domains, then focus your study plan on those areas before retesting. NurseNest provides domain-specific analytics to help pinpoint exactly where to improve."
  },
  {
    q: "Is the Canadian NP exam (CNPLE) different from US NP exams?",
    a: "Yes, significantly. The CNPLE is a national licensing exam administered in English and French, covering Canadian healthcare context exclusively. It uses SI units (mmol/L, umol/L), references Health Canada formulary and provincial drug schedules, follows Canadian clinical practice guidelines, and reflects the Canadian healthcare system. US NP exams (AANP and ANCC) use US-specific guidelines, FDA-approved medications, and imperial/US clinical standards. NurseNest never mixes US and Canadian NP exam content."
  },
  {
    q: "What are the main domains tested on NP certification exams?",
    a: "Most NP certification exams cover five core domains: Health Assessment (physical examination, history taking, clinical findings), Diagnosis (differential diagnosis, diagnostic test interpretation, clinical reasoning), Therapeutics (pharmacological and non-pharmacological management), Health Promotion & Disease Prevention (screening, immunizations, risk factor modification), and Professional Role & Responsibility (scope of practice, ethics, quality improvement). The exact weight of each domain varies by exam — for example, the AANP allocates 25% to both Health Assessment and Therapeutics, while the ANCC places more emphasis on professional role competencies."
  },
];

const VALUE_PROPS = [
  {
    icon: Target,
    title: "Exam-Specific Question Banks",
    description: "AANP, ANCC, and Canadian NP questions are separated and never mixed. Each question is tagged to the correct exam blueprint, domain, and difficulty level.",
  },
  {
    icon: BarChart,
    title: "Domain-Level Performance Analytics",
    description: "Track your readiness across all five NP exam domains. Identify weak areas instantly and get targeted recommendations for improvement.",
  },
  {
    icon: Clock,
    title: "Realistic Mock Exams",
    description: "Full-length timed practice exams that mirror the actual AANP (150 questions, 4 hours), ANCC (175 questions, 3.5 hours), and CNPLE (~180 questions, 5 hours) formats.",
  },
  {
    icon: Brain,
    title: "Clinical Reasoning Focus",
    description: "Questions emphasize advanced clinical decision-making, differential diagnosis, and treatment selection — the skills that separate NP-level from RN-level practice.",
  },
  {
    icon: BookOpen,
    title: "Domain-Mapped Study Guides",
    description: "NurseNest lessons are mapped directly to NP exam domains, so you can study Health Assessment, Diagnosis, Therapeutics, and more in a structured way.",
  },
  {
    icon: Shield,
    title: "Evidence-Based Content",
    description: "All content is developed by NP educators and aligned to current clinical practice guidelines, including both US (FDA, USPSTF) and Canadian (Health Canada, NACI) standards.",
  },
];

const EXAM_COMPARISON = [
  { feature: "Certifying Body", aanp: "AANPCB", ancc: "ANCC", cnple: "CCRNR" },
  { feature: "Total Questions", aanp: "150 (135 scored)", ancc: "175 (150 scored)", cnple: "~180" },
  { feature: "Time Limit", aanp: "4 hours", ancc: "3.5 hours", cnple: "5 hours" },
  { feature: "Passing Score", aanp: "500/800", ancc: "350/500", cnple: "Criterion-referenced" },
  { feature: "Format", aanp: "Linear, fixed-length", ancc: "Linear, fixed-length", cnple: "Linear, fixed-length" },
  { feature: "Clinical Focus", aanp: "High — clinical management emphasis", ancc: "Moderate — includes professional role", cnple: "High — Canadian clinical context" },
  { feature: "Professional Role Questions", aanp: "15%", ancc: "20–25%", cnple: "~15%" },
  { feature: "Language", aanp: "English", ancc: "English", cnple: "English & French" },
  { feature: "Country", aanp: "United States", ancc: "United States", cnple: "Canada" },
];

function PillarFAQAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-pillar-item-${i}`}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
            data-testid={`button-pillar-faq-${i}`}
          >
            <span className="font-semibold text-[#2E3A59] pr-4">{faq.q}</span>
            <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && (
            <div className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4" data-testid={`text-pillar-faq-answer-${i}`}>
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; badge: string; gradient: string }> = {
  blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", badge: "bg-blue-100 text-blue-700", gradient: "from-blue-500 to-blue-600" },
  indigo: { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700", badge: "bg-indigo-100 text-indigo-700", gradient: "from-indigo-500 to-indigo-600" },
  red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", badge: "bg-red-100 text-red-700", gradient: "from-red-500 to-red-600" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-700", gradient: "from-amber-500 to-amber-600" },
};

export default function NpExamPrepPillarPage() {
  const faqStructuredData = buildFaqStructuredData(
    PILLAR_FAQS.map(f => ({ question: f.q, answer: f.a }))
  );

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "NP Exam Prep: Complete Nurse Practitioner Certification Guide",
    description: "Comprehensive nurse practitioner exam preparation hub covering AANP, ANCC, and Canadian CNPLE certification exams with practice questions, mock exams, and study guides.",
    provider: { "@type": "EducationalOrganization", name: "NurseNest", url: "https://www.nursenest.ca" },
    hasPart: NP_EXAM_HUB_CARDS.map(card => ({
      "@type": "Course",
      name: card.title,
      description: card.description,
      url: `https://www.nursenest.ca${card.href}`,
    })),
  };

  return (
    <>
      <SEO
        title={t("pages.npExamPrepPillar.npExamPrepAanpAncc")}
        description={t("pages.npExamPrepPillar.prepareForYourNursePractitioner")}
        keywords="NP exam prep, nurse practitioner certification, AANP exam, ANCC exam, CNPLE exam, NP practice questions, NP mock exam, NP study guide, nurse practitioner exam review"
        canonicalPath="/np-exam-prep"
        ogType="website"
        structuredData={collectionSchema}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "NP Exam Prep", url: "https://www.nursenest.ca/np-exam-prep" },
        ]}
      />
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-b from-[#2E3A59] via-[#3d4d73] to-[#4a5a85] text-white py-20 md:py-28 relative overflow-hidden" data-testid="np-exam-prep-pillar-hero">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="max-w-5xl mx-auto px-4 relative">
            <BreadcrumbNav
              items={[
                { name: "Home", url: "/" },
                { name: "NP Exam Prep", url: "/np-exam-prep" },
              ]}
              className="mb-8 text-white/60"
            />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#BFA6F6]/20 flex items-center justify-center backdrop-blur-sm">
                <GraduationCap className="w-7 h-7 text-[#BFA6F6]" />
              </div>
              <Badge className="bg-[#BFA6F6]/20 text-[#BFA6F6] border-0 text-sm px-3 py-1">{t("pages.npExamPrepPillar.npCertification")}</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight" data-testid="text-np-exam-prep-pillar-title">
              Nurse Practitioner Exam Prep
            </h1>
            <p className="text-xl text-white/85 leading-relaxed max-w-3xl mb-10" data-testid="text-np-exam-prep-pillar-intro">
              Everything you need to pass your NP certification exam on the first attempt. Compare AANP, ANCC, and Canadian CNPLE pathways, then dive into exam-specific practice questions, mock exams, and study guides built by NP educators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <LocaleLink href="#choose-exam" data-testid="link-hero-choose-exam">
                <Button size="lg" className="bg-[#BFA6F6] hover:bg-[#a88de8] text-white gap-2 text-base px-8 h-12 shadow-lg shadow-[#BFA6F6]/25">
                  Choose Your Exam <ArrowRight className="w-5 h-5" />
                </Button>
              </LocaleLink>
              <LocaleLink href="/free-practice" data-testid="link-hero-free-practice">
                <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 gap-2 text-base px-8 h-12 backdrop-blur-sm">
                  Try Free Practice Questions
                </Button>
              </LocaleLink>
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-16">
          <section id="choose-exam" className="mb-20 scroll-mt-24" data-testid="section-choose-exam">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[#2E3A59] mb-3" data-testid="text-choose-exam-heading">{t("pages.npExamPrepPillar.chooseYourNpCertificationExam")}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.npExamPrepPillar.selectYourExamPathwayBelow")}</p>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Flag className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-[#2E3A59]" data-testid="text-us-exams-heading">{t("pages.npExamPrepPillar.unitedStatesNpCertification")}</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                {NP_EXAM_HUB_CARDS.filter(c => c.region === "US").map(card => {
                  const colors = COLOR_MAP[card.color] || COLOR_MAP.blue;
                  return (
                    <LocaleLink key={card.examCode} href={card.href} data-testid={`card-pillar-exam-${card.examCode.toLowerCase()}`}>
                      <Card className={`h-full hover:shadow-xl transition-all duration-300 border-2 ${colors.border} hover:border-[#BFA6F6] group cursor-pointer hover:-translate-y-1`}>
                        <CardContent className="p-7">
                          <div className="flex items-center justify-between mb-4">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${colors.badge}`}>{card.badge}</span>
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
                              <Award className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <h4 className="text-xl font-bold text-[#2E3A59] group-hover:text-[#BFA6F6] transition-colors mb-1">
                            {card.title}
                          </h4>
                          <p className="text-xs text-gray-500 mb-3">{card.subtitle}</p>
                          <p className="text-sm text-gray-600 leading-relaxed mb-5">{card.description}</p>
                          <div className="flex items-center gap-2 text-[#BFA6F6] font-semibold group-hover:gap-3 transition-all">
                            Start Preparation <ArrowRight className="w-4 h-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </LocaleLink>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-bold text-[#2E3A59]" data-testid="text-ca-exams-heading">{t("pages.npExamPrepPillar.canadianNpLicensing")}</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                {NP_EXAM_HUB_CARDS.filter(c => c.region === "CA").map(card => {
                  const colors = COLOR_MAP[card.color] || COLOR_MAP.red;
                  return (
                    <LocaleLink key={card.examCode} href={card.href} data-testid={`card-pillar-exam-${card.examCode.toLowerCase().replace("_", "-")}`}>
                      <Card className={`h-full hover:shadow-xl transition-all duration-300 border-2 ${colors.border} hover:border-[#BFA6F6] group cursor-pointer hover:-translate-y-1`}>
                        <CardContent className="p-7">
                          <div className="flex items-center justify-between mb-4">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${colors.badge}`}>{card.badge}</span>
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
                              <Globe className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <h4 className="text-xl font-bold text-[#2E3A59] group-hover:text-[#BFA6F6] transition-colors mb-1">
                            {card.title}
                          </h4>
                          <p className="text-xs text-gray-500 mb-3">{card.subtitle}</p>
                          <p className="text-sm text-gray-600 leading-relaxed mb-5">{card.description}</p>
                          <div className="flex items-center gap-2 text-[#BFA6F6] font-semibold group-hover:gap-3 transition-all">
                            {card.examCode === "UPCOMING_CANADA_NP" ? "Learn More" : "Start Preparation"} <ArrowRight className="w-4 h-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </LocaleLink>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="mb-20" data-testid="section-why-nursenest">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[#2E3A59] mb-3">{t("pages.npExamPrepPillar.whyNursenestForNpExam")}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.npExamPrepPillar.purposebuiltToolsDesignedSpecificallyFor")}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {VALUE_PROPS.map((prop, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-[#BFA6F6]/30 transition-all duration-300" data-testid={`value-prop-${i}`}>
                  <div className="w-12 h-12 rounded-xl bg-[#BFA6F6]/10 flex items-center justify-center mb-4">
                    <prop.icon className="w-6 h-6 text-[#BFA6F6]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#2E3A59] mb-2">{prop.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{prop.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-20" data-testid="section-exam-comparison">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[#2E3A59] mb-3">{t("pages.npExamPrepPillar.npExamComparisonAanpVs")}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.npExamPrepPillar.notSureWhichExamTo")}</p>
            </div>

            <div className="hidden md:block bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#2E3A59]">
                    <th className="text-left p-4 text-white font-semibold text-sm">{t("pages.npExamPrepPillar.feature")}</th>
                    <th className="text-left p-4 text-white font-semibold text-sm">
                      <LocaleLink href="/np/aanp-exam" className="hover:text-[#BFA6F6] transition-colors">AANP</LocaleLink>
                    </th>
                    <th className="text-left p-4 text-white font-semibold text-sm">
                      <LocaleLink href="/np/ancc-exam" className="hover:text-[#BFA6F6] transition-colors">ANCC</LocaleLink>
                    </th>
                    <th className="text-left p-4 text-white font-semibold text-sm">
                      <LocaleLink href="/canada-np" className="hover:text-[#BFA6F6] transition-colors">CNPLE</LocaleLink>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {EXAM_COMPARISON.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"} data-testid={`comparison-row-${i}`}>
                      <td className="p-4 font-semibold text-[#2E3A59] text-sm">{row.feature}</td>
                      <td className="p-4 text-sm text-gray-700">{row.aanp}</td>
                      <td className="p-4 text-sm text-gray-700">{row.ancc}</td>
                      <td className="p-4 text-sm text-gray-700">{row.cnple}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-4">
              {[
                { code: "AANP", title: "AANP Certification", href: "/np/aanp-exam", color: "blue" },
                { code: "ANCC", title: "ANCC Certification", href: "/np/ancc-exam", color: "indigo" },
                { code: "CNPLE", title: "CNPLE (Canada)", href: "/canada-np", color: "red" },
              ].map(exam => {
                const colors = COLOR_MAP[exam.color];
                return (
                  <div key={exam.code} className={`bg-white border-2 ${colors.border} rounded-2xl p-5`} data-testid={`comparison-card-${exam.code.toLowerCase()}`}>
                    <h4 className={`font-bold ${colors.text} mb-3`}>{exam.title}</h4>
                    <div className="space-y-2">
                      {EXAM_COMPARISON.map((row, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-500">{row.feature}</span>
                          <span className="font-medium text-[#2E3A59] text-right">
                            {exam.code === "AANP" ? row.aanp : exam.code === "ANCC" ? row.ancc : row.cnple}
                          </span>
                        </div>
                      ))}
                    </div>
                    <LocaleLink href={exam.href} className="mt-4 block">
                      <Button variant="outline" className={`w-full ${colors.border} ${colors.text} gap-2`}>
                        View {exam.code} Details <ArrowRight className="w-4 h-4" />
                      </Button>
                    </LocaleLink>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 bg-[#BFA6F6]/5 border border-[#BFA6F6]/20 rounded-2xl p-6" data-testid="section-study-strategy">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#BFA6F6]/10 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-6 h-6 text-[#BFA6F6]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2E3A59] mb-2">{t("pages.npExamPrepPillar.studyStrategyTip")}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    If you are a clinically strong test-taker who prefers scenario-based questions, the <strong>AANP</strong> may suit you best. If you excel at evidence-based practice, research, and healthcare systems questions, consider the <strong>ANCC</strong>. Canadian NP candidates must take the <strong>CNPLE</strong> — there is no US alternative for Canadian licensure.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <LocaleLink href="/np/aanp-exam" data-testid="link-strategy-aanp">
                      <span className="text-sm font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2">{t("pages.npExamPrepPillar.aanpExamDetails")}</span>
                    </LocaleLink>
                    <LocaleLink href="/np/ancc-exam" data-testid="link-strategy-ancc">
                      <span className="text-sm font-medium text-indigo-600 hover:text-indigo-800 underline underline-offset-2">{t("pages.npExamPrepPillar.anccExamDetails")}</span>
                    </LocaleLink>
                    <LocaleLink href="/canada-np" data-testid="link-strategy-cnple">
                      <span className="text-sm font-medium text-red-600 hover:text-red-800 underline underline-offset-2">{t("pages.npExamPrepPillar.cnpleExamDetails")}</span>
                    </LocaleLink>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-20" data-testid="section-aanp-vs-ancc">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[#2E3A59] mb-3">{t("pages.npExamPrepPillar.aanpVsAnccWhichNp")}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.npExamPrepPillar.bothCertificationsAreAcceptedNationwide")}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border-2 border-blue-200 rounded-2xl p-6" data-testid="aanp-comparison-detail">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-700">{t("pages.npExamPrepPillar.aanpCertification")}</h3>
                </div>
                <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                  <p><strong>{t("pages.npExamPrepPillar.bestFor")}</strong> {t("pages.npExamPrepPillar.clinicallyStrongTesttakersWhoPrefer")}</p>
                  <p><strong>{t("pages.npExamPrepPillar.examFocus")}</strong> {t("pages.npExamPrepPillar.theAanpPlacesHeavyEmphasis")}</p>
                  <p><strong>{t("pages.npExamPrepPillar.format")}</strong> {t("pages.npExamPrepPillar.150Questions135Scored4")}</p>
                  <p><strong>{t("pages.npExamPrepPillar.idealIf")}</strong> {t("pages.npExamPrepPillar.yourNpProgramEmphasizedHandson")}</p>
                </div>
                <LocaleLink href="/np/aanp-exam" className="mt-4 block">
                  <Button variant="outline" className="w-full border-blue-200 text-blue-700 gap-2 hover:bg-blue-50">
                    Full AANP Exam Guide <ArrowRight className="w-4 h-4" />
                  </Button>
                </LocaleLink>
              </div>

              <div className="bg-white border-2 border-indigo-200 rounded-2xl p-6" data-testid="ancc-comparison-detail">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <Award className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold text-indigo-700">{t("pages.npExamPrepPillar.anccCertification")}</h3>
                </div>
                <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                  <p><strong>{t("pages.npExamPrepPillar.bestFor2")}</strong> {t("pages.npExamPrepPillar.npsWhoAreStrongIn")}</p>
                  <p><strong>{t("pages.npExamPrepPillar.examFocus2")}</strong> {t("pages.npExamPrepPillar.theAnccAllocates2025Of")}</p>
                  <p><strong>{t("pages.npExamPrepPillar.format2")}</strong> {t("pages.npExamPrepPillar.175Questions150Scored35")}</p>
                  <p><strong>{t("pages.npExamPrepPillar.idealIf2")}</strong> {t("pages.npExamPrepPillar.youPlanToWorkAt")}</p>
                </div>
                <LocaleLink href="/np/ancc-exam" className="mt-4 block">
                  <Button variant="outline" className="w-full border-indigo-200 text-indigo-700 gap-2 hover:bg-indigo-50">
                    Full ANCC Exam Guide <ArrowRight className="w-4 h-4" />
                  </Button>
                </LocaleLink>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6" data-testid="section-bottom-line">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2E3A59] mb-2">{t("pages.npExamPrepPillar.theBottomLine")}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Both AANP and ANCC certifications carry equal weight for NP licensure and prescriptive authority across all 50 states. Neither is objectively harder — the best choice depends on your personal strengths, program emphasis, and employer preference. Many NPs hold both certifications. If you are unsure, check with your program advisor and potential employers before deciding.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-20" data-testid="section-np-study-tools">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[#2E3A59] mb-3">{t("pages.npExamPrepPillar.npExamPrepStudyTools")}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.npExamPrepPillar.everythingYouNeedForA")}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Target, label: "NP Practice Questions", href: "/np-exam-practice-questions", desc: "Exam-specific question banks with rationales" },
                { icon: Clock, label: "NP Mock Exams", href: "/mock-exams", desc: "Full-length timed practice exams" },
                { icon: BookOpen, label: "NP Clinical Lessons", href: "/lessons?tier=np", desc: "179+ body-system study guides" },
                { icon: Brain, label: "NP Flashcards", href: "/flashcards", desc: "High-yield review cards" },
                { icon: Shield, label: "Pharmacology Review", href: "/medication-mastery", desc: "NP prescribing and drug review" },
                { icon: BarChart, label: "Performance Analytics", href: "/reports", desc: "Domain-specific readiness tracking" },
              ].map((tool, i) => (
                <LocaleLink key={i} href={tool.href} data-testid={`link-study-tool-${i}`}>
                  <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[#BFA6F6]/40 hover:shadow-md transition-all group h-full">
                    <div className="w-10 h-10 rounded-xl bg-[#BFA6F6]/10 flex items-center justify-center mb-3">
                      <tool.icon className="w-5 h-5 text-[#BFA6F6]" />
                    </div>
                    <p className="font-semibold text-[#2E3A59] group-hover:text-[#BFA6F6] transition-colors mb-1">{tool.label}</p>
                    <p className="text-xs text-gray-500">{tool.desc}</p>
                  </div>
                </LocaleLink>
              ))}
            </div>
          </section>

          <section className="mb-20" data-testid="section-pillar-faq">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[#2E3A59] mb-3">{t("pages.npExamPrepPillar.npExamPrepFrequentlyAsked")}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.npExamPrepPillar.answersToTheMostCommon")}</p>
            </div>
            <div className="max-w-3xl mx-auto">
              <PillarFAQAccordion faqs={PILLAR_FAQS} />
            </div>
          </section>

          <section className="bg-gradient-to-r from-[#2E3A59] to-[#3d4d73] rounded-3xl p-10 md:p-14 text-center text-white relative overflow-hidden" data-testid="section-final-cta">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <div className="relative">
              <Sparkles className="w-10 h-10 text-[#BFA6F6] mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("pages.npExamPrepPillar.readyToStartYourNp")}</h2>
              <p className="text-white/80 mb-8 max-w-xl mx-auto text-lg">
                Join thousands of NP candidates using NurseNest to prepare for AANP, ANCC, and CNPLE certification exams.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <LocaleLink href="/free-practice" data-testid="link-cta-free-practice">
                  <Button size="lg" className="bg-[#BFA6F6] hover:bg-[#a88de8] text-white gap-2 text-base px-8 h-12 shadow-lg shadow-[#BFA6F6]/25">
                    Start Free Practice <Zap className="w-5 h-5" />
                  </Button>
                </LocaleLink>
                <LocaleLink href="/mock-exams" data-testid="link-cta-mock-exams">
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 gap-2 text-base px-8 h-12">
                    Take a Mock Exam <Target className="w-5 h-5" />
                  </Button>
                </LocaleLink>
              </div>
            </div>
          </section>

          <ComparisonTable
            headline="How NurseNest Compares for NP Exam Prep"
            subtitle="See how a modern clinical learning system stacks up against typical study platforms for nurse practitioner exam preparation."
          />
          <DifferentiatorCTA
            headline="Start Your NP Exam Prep Today"
            subtitle="Join thousands of nurse practitioner students using NurseNest to study smarter with adaptive practice exams, clinical lessons, and readiness analytics."
            primaryHref="/register"
            primaryLabel="Start Free"
            secondaryHref="/pricing"
            secondaryLabel="View Plans"
          />

          <div className="mt-16">
            <EndOfContentLeadCapture
              leadMagnetType="study_guide"
              professionContext="np"
              source="np_exam_prep_pillar"
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
