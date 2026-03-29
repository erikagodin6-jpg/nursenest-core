import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { LocaleLink } from "@/lib/LocaleLink";
import { buildFaqStructuredData } from "@/lib/structured-data";
import {
  BookOpen, FileText, Brain, Target, ArrowRight, ChevronRight,
  Stethoscope, FlaskConical, Pill, GraduationCap, Layers,
  Wind, Ambulance, Microscope, Radio, Award, Users, Hand,
  type LucideIcon
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AutoRelatedContent } from "@/components/auto-related-content";

import { useI18n } from "@/lib/i18n";
interface ProfessionSection {
  name: string;
  slug: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description: string;
  examNames: string[];
  resources: { title: string; href: string; type: string }[];
}

const PROFESSIONS: ProfessionSection[] = [
  {
    name: "Nursing (RN / RPN / NP)",
    slug: "nursing",
    icon: Stethoscope,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "NCLEX-RN, NCLEX-PN, REx-PN, and NP certification exam preparation with adaptive mock exams, clinical judgment cases, and pharmacology review.",
    examNames: ["NCLEX-RN", "NCLEX-PN", "REx-PN", "CNPLE", "AANP/ANCC"],
    resources: [
      { title: "NCLEX-RN Study Hub", href: "/nclex-rn", type: "Hub" },
      { title: "NCLEX-PN Study Hub", href: "/nclex-pn", type: "Hub" },
      { title: "REx-PN Study Hub", href: "/rex-pn", type: "Hub" },
      { title: "NP Exam Hub", href: "/canada-np", type: "Hub" },
      { title: "Test Bank", href: "/free-practice", type: "Practice" },
      { title: "Mock Exams", href: "/mock-exams", type: "Practice" },
      { title: "Lessons & Study Guides", href: "/lessons", type: "Learn" },
      { title: "Flashcard Decks", href: "/flashcards", type: "Review" },
      { title: "Clinical Judgment Cases", href: "/clinical-clarity", type: "Practice" },
      { title: "Pharmacology Review", href: "/pharmacology", type: "Review" },
      { title: "Lab Values Reference", href: "/lab-values", type: "Reference" },
      { title: "OSCE Simulations", href: "/simulators/osce", type: "Practice" },
    ],
  },
  {
    name: "Paramedic / EMT",
    slug: "paramedic",
    icon: Ambulance,
    color: "text-red-600",
    bgColor: "bg-red-50",
    description: "AEMCA, NREMT, and PCP/ACP certification preparation with scenario-based questions, ECG drills, and trauma simulations.",
    examNames: ["AEMCA", "NREMT", "PCP", "ACP"],
    resources: [
      { title: "Paramedic Hub", href: "/paramedic", type: "Hub" },
      { title: "Test Bank", href: "/allied-health/qbank?career=paramedic", type: "Practice" },
      { title: "Mock Exams", href: "/allied-health/paramedic/mock-exams", type: "Practice" },
      { title: "Flashcards", href: "/paramedic/flashcards", type: "Review" },
      { title: "Practice Questions", href: "/paramedic-practice-questions", type: "Practice" },
    ],
  },
  {
    name: "Medical Laboratory Technology",
    slug: "mlt",
    icon: Microscope,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    description: "CSMLS, ASCP, and AMT exam prep with lab procedure questions, morphology drills, and critical value interpretation.",
    examNames: ["CSMLS", "ASCP MLS/MLT", "AMT"],
    resources: [
      { title: "MLT Hub", href: "/mlt", type: "Hub" },
      { title: "Test Bank", href: "/allied-health/qbank?career=mlt", type: "Practice" },
      { title: "Mock Exams", href: "/allied-health/mlt/mock-exams", type: "Practice" },
      { title: "Flashcards", href: "/mlt/flashcards", type: "Review" },
      { title: "Practice Questions", href: "/mlt-practice-questions", type: "Practice" },
    ],
  },
  {
    name: "Respiratory Therapy",
    slug: "rrt",
    icon: Wind,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    description: "CBRC RRT, NBRC TMC/CSE exam preparation with ABG analysis, ventilator management, and pulmonary function testing.",
    examNames: ["CBRC RRT", "NBRC TMC", "NBRC CSE"],
    resources: [
      { title: "RRT Hub", href: "/respiratory-therapy", type: "Hub" },
      { title: "Test Bank", href: "/allied-health/qbank?career=rrt", type: "Practice" },
      { title: "Mock Exams", href: "/allied-health/rrt/mock-exams", type: "Practice" },
      { title: "Flashcards", href: "/rrt/flashcards", type: "Review" },
      { title: "Practice Questions", href: "/rrt-practice-questions", type: "Practice" },
    ],
  },
  {
    name: "Medical Imaging / Radiography",
    slug: "imaging",
    icon: Radio,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description: "CAMRT, ARRT exam preparation with positioning guides, physics modules, artifact recognition, and image evaluation practice.",
    examNames: ["CAMRT", "ARRT"],
    resources: [
      { title: "Imaging Hub", href: "/medical-imaging", type: "Hub" },
      { title: "Test Bank", href: "/allied-health/qbank?career=imaging", type: "Practice" },
      { title: "Mock Exams", href: "/allied-health/imaging/mock-exams", type: "Practice" },
      { title: "Flashcards", href: "/imaging/flashcards", type: "Review" },
      { title: "Positioning Guide", href: "/radiography-positioning-guide", type: "Reference" },
      { title: "Practice Questions", href: "/imaging-practice-questions", type: "Practice" },
    ],
  },
  {
    name: "Social Work",
    slug: "social-work",
    icon: Users,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    description: "ASWB exam preparation for BSW, MSW, and clinical-level social work licensing with ethics scenarios and DSM-5 review.",
    examNames: ["ASWB Bachelors", "ASWB Masters", "ASWB Clinical"],
    resources: [
      { title: "Social Work Hub", href: "/social-work", type: "Hub" },
      { title: "Practice Questions", href: "/social-work-practice-questions", type: "Practice" },
    ],
  },
  {
    name: "Occupational Therapy",
    slug: "occupational-therapy",
    icon: Hand,
    color: "text-green-600",
    bgColor: "bg-green-50",
    description: "NBCOT OTR/COTA exam preparation with clinical reasoning scenarios, intervention planning, and evidence-based practice review.",
    examNames: ["NBCOT OTR", "NBCOT COTA"],
    resources: [
      { title: "OT Practice Questions", href: "/occupational-therapy-practice-questions", type: "Practice" },
    ],
  },
  {
    name: "Pharmacy Technician",
    slug: "pharmacy-tech",
    icon: Pill,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    description: "PEBC, PTCB, and ExCPT exam preparation with dosage calculations, compounding practice, and pharmacy law review.",
    examNames: ["PEBC", "PTCB", "ExCPT"],
    resources: [
      { title: "Pharmacy Tech Hub", href: "/pharmacy-tech", type: "Hub" },
      { title: "Test Bank", href: "/allied-health/qbank?career=pharmacy-tech", type: "Practice" },
      { title: "Mock Exams", href: "/allied-health/pharmacy-technician/mock-exams", type: "Practice" },
      { title: "Flashcards", href: "/pharmacy-tech/flashcards", type: "Review" },
    ],
  },
];

const FAQ_DATA = [
  { question: "What healthcare exam prep resources does NurseNest offer?", answer: "NurseNest provides comprehensive exam preparation for nursing (NCLEX-RN, NCLEX-PN, REx-PN, NP), paramedic (AEMCA, NREMT), medical laboratory technology (CSMLS, ASCP), respiratory therapy (CBRC, NBRC), medical imaging (CAMRT, ARRT), pharmacy technician (PEBC, PTCB), social work (ASWB), and occupational therapy (NBCOT) certification exams." },
  { question: "Are the practice questions aligned to current exam blueprints?", answer: "Yes. All question banks and mock exams are written and mapped to the most current exam blueprints and competency frameworks published by each profession's regulatory body. Content is reviewed and updated regularly to reflect exam changes." },
  { question: "Can I study for both Canadian and American exams?", answer: "Absolutely. NurseNest covers both Canadian and American certification exams across all professions. Nursing students can prepare for NCLEX-RN (US), REx-PN (Canada), or CNPLE (Canada). Allied health students can prepare for CSMLS or ASCP, CAMRT or ARRT, and more." },
  { question: "What study tools are included beyond practice questions?", answer: "In addition to question banks, NurseNest offers adaptive mock exams, interactive flashcard decks, in-depth lessons and study guides, clinical judgment case studies, pharmacology review, lab value references, OSCE simulations, and AI-powered study tools like ABG analyzers and ECG drills." },
  { question: "Is there a free tier for exam prep?", answer: "Yes. Free users can access sample questions, select flashcard decks, and introductory lessons for every profession. Upgrading unlocks the full question bank, unlimited mock exams, all flashcard decks, and premium study tools." },
  { question: "How do mock exams work?", answer: "Mock exams simulate the real testing experience with computer-adaptive testing (CAT) for nursing exams and fixed-length formats for allied health exams. After completing a mock exam, you receive a detailed performance report showing strengths, weaknesses, and recommended study areas." },
];

const faqStructuredData = buildFaqStructuredData(FAQ_DATA);

const collectionStructuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Exam Prep Hub - Healthcare Certification Exam Resources",
  "description": "Central hub for all healthcare exam preparation resources across nursing, paramedic, respiratory therapy, medical laboratory, medical imaging, pharmacy, social work, and occupational therapy certifications.",
  "url": "https://www.nursenest.ca/exam-prep",
  "isPartOf": {
    "@type": "WebSite",
    "name": "NurseNest",
    "url": "https://www.nursenest.ca",
  },
  "provider": {
    "@type": "EducationalOrganization",
    "name": "NurseNest",
    "url": "https://www.nursenest.ca",
  },
};

const TYPE_COLORS: Record<string, string> = {
  Hub: "bg-blue-100 text-blue-700",
  Practice: "bg-green-100 text-green-700",
  Learn: "bg-amber-100 text-amber-700",
  Review: "bg-purple-100 text-purple-700",
  Reference: "bg-slate-100 text-slate-700",
};

export default function ExamPrepHub() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-background" data-testid="exam-prep-hub-page">
      <Navigation />
      <SEO
        title={t("pages.examPrepHub.examPrepHubHealthcareCertification")}
        description={t("pages.examPrepHub.centralHubForAllHealthcare")}
        keywords="healthcare exam prep, nursing exam prep, NCLEX prep, paramedic exam prep, MLT exam prep, RRT exam prep, medical imaging exam prep, pharmacy tech exam prep, ASWB exam prep, NBCOT exam prep"
        canonicalPath="/exam-prep"
        structuredData={collectionStructuredData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Exam Prep Hub", url: "https://www.nursenest.ca/exam-prep" },
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <LocaleLink href="/" className="hover:text-blue-600">{t("pages.examPrepHub.home")}</LocaleLink>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-blue-700 font-medium">{t("pages.examPrepHub.examPrepHub")}</span>
        </div>

        <section className="mb-12" data-testid="section-exam-prep-hero">
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white rounded-2xl border border-blue-100 p-8 sm:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <BookOpen className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <Badge variant="outline" className="mb-2 text-xs border-blue-200 text-blue-700" data-testid="badge-exam-prep-hub">
                  All Professions
                </Badge>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight" data-testid="text-exam-prep-h1">
                  Exam Prep Hub
                </h1>
              </div>
            </div>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-4xl" data-testid="text-exam-prep-intro">
              Your central starting point for healthcare certification exam preparation. Browse question banks, mock exams, flashcards, lessons, and study guides organized by profession and specialty. Whether you are preparing for nursing, paramedic, respiratory therapy, laboratory, imaging, pharmacy, social work, or occupational therapy exams, find all your resources in one place.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/80 rounded-xl border border-slate-200/60 p-4 text-center" data-testid="stat-professions">
                <p className="text-lg sm:text-xl font-bold text-gray-900">8+</p>
                <p className="text-xs text-slate-500 mt-1">{t("pages.examPrepHub.professions")}</p>
              </div>
              <div className="bg-white/80 rounded-xl border border-slate-200/60 p-4 text-center" data-testid="stat-exams">
                <p className="text-lg sm:text-xl font-bold text-gray-900">20+</p>
                <p className="text-xs text-slate-500 mt-1">{t("pages.examPrepHub.certificationExams")}</p>
              </div>
              <div className="bg-white/80 rounded-xl border border-slate-200/60 p-4 text-center" data-testid="stat-questions">
                <p className="text-lg sm:text-xl font-bold text-gray-900">10,000+</p>
                <p className="text-xs text-slate-500 mt-1">{t("pages.examPrepHub.practiceQuestions")}</p>
              </div>
              <div className="bg-white/80 rounded-xl border border-slate-200/60 p-4 text-center" data-testid="stat-tools">
                <p className="text-lg sm:text-xl font-bold text-gray-900">50+</p>
                <p className="text-xs text-slate-500 mt-1">{t("pages.examPrepHub.studyTools")}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12" data-testid="section-professions">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">{t("pages.examPrepHub.browseByProfession")}</h2>
          <div className="space-y-6">
            {PROFESSIONS.map((prof) => {
              const Icon = prof.icon;
              return (
                <Card key={prof.slug} className="border-slate-200/60 hover:shadow-md transition-shadow" data-testid={`card-profession-${prof.slug}`}>
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row gap-5">
                      <div className="shrink-0">
                        <div className={`w-14 h-14 rounded-xl ${prof.bgColor} flex items-center justify-center`}>
                          <Icon className={`w-7 h-7 ${prof.color}`} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{prof.name}</h3>
                        <p className="text-sm text-slate-600 mb-3">{prof.description}</p>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {prof.examNames.map((exam) => (
                            <Badge key={exam} variant="outline" className="text-xs border-slate-200 text-slate-600">{exam}</Badge>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {prof.resources.map((r, idx) => (
                            <LocaleLink key={idx} href={r.href}>
                              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${TYPE_COLORS[r.type] || "bg-slate-100 text-slate-700"} hover:opacity-80 transition-opacity cursor-pointer`} data-testid={`link-resource-${prof.slug}-${idx}`}>
                                {r.title}
                                <ChevronRight className="w-3 h-3" />
                              </span>
                            </LocaleLink>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="mb-12" data-testid="section-cross-links">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">{t("pages.examPrepHub.relatedResources")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <LocaleLink href="/new-graduate-support">
              <Card className="h-full hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group" data-testid="card-cross-new-grad">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">{t("pages.examPrepHub.newGraduateSupport")}</h3>
                      <p className="text-xs text-slate-500 mt-1">{t("pages.examPrepHub.interviewPrepResumeToolsAnd")}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            </LocaleLink>
            <LocaleLink href="/healthcare-careers">
              <Card className="h-full hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group" data-testid="card-cross-careers">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm group-hover:text-purple-600 transition-colors">{t("pages.examPrepHub.healthcareCareers")}</h3>
                      <p className="text-xs text-slate-500 mt-1">{t("pages.examPrepHub.exploreCareerPathsSalaryGuides")}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            </LocaleLink>
            <LocaleLink href="/encyclopedia">
              <Card className="h-full hover:shadow-md hover:border-teal-200 transition-all cursor-pointer group" data-testid="card-cross-encyclopedia">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                      <Brain className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm group-hover:text-teal-600 transition-colors">{t("pages.examPrepHub.healthcareEncyclopedia")}</h3>
                      <p className="text-xs text-slate-500 mt-1">{t("pages.examPrepHub.browseClinicalReferenceContentOrganized")}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            </LocaleLink>
          </div>
        </section>

        <section className="mb-12" data-testid="section-exam-prep-faq">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">{t("pages.examPrepHub.frequentlyAskedQuestions")}</h2>
          <div className="space-y-4">
            {FAQ_DATA.map((faq, idx) => (
              <Card key={idx} className="border-slate-200/60" data-testid={`card-faq-${idx}`}>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">{faq.question}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <AutoRelatedContent
          slug="exam-prep"
          contentType="exam-prep"
          title={t("pages.examPrepHub.examPreparation")}
          category="exam-prep"
          className="pt-8 border-t border-gray-200"
          sectionTitle="Related Study Resources"
        />

        <section data-testid="section-exam-prep-cta">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 sm:p-10 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Start Preparing for Your Healthcare Certification
            </h2>
            <p className="text-blue-100 text-sm sm:text-base mb-6 max-w-2xl mx-auto">
              Choose your profession above to access targeted practice questions, mock exams, and study resources aligned to your certification exam.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <LocaleLink href="/free-practice">
                <Button className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-2.5 font-semibold" data-testid="button-exam-prep-free">
                  Try Free Practice Questions
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </LocaleLink>
              <LocaleLink href="/pricing">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-6 py-2.5" data-testid="button-exam-prep-pricing">
                  View Plans
                </Button>
              </LocaleLink>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
