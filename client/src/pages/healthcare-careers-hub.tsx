import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { LocaleLink } from "@/lib/LocaleLink";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { useI18n } from "@/lib/i18n";
import {
  Award, ArrowRight, ChevronRight, BookOpen, GraduationCap,
  Stethoscope, Wind, Ambulance, Pill, Microscope, Radio,
  Users, Hand, Brain, Briefcase, Heart, TrendingUp,
  DollarSign, FileText, Activity, Syringe, Scan,
  type LucideIcon
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CareerPath {
  name: string;
  slug: string;
  detailSlug: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description: string;
  salaryRange: string;
  growthOutlook: string;
  links: { title: string; href: string }[];
}

const CAREER_PATHS: CareerPath[] = [
  {
    name: "Registered Nurse (RN)",
    slug: "nursing-rn",
    detailSlug: "registered-nurse",
    icon: Stethoscope,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "Provide and coordinate patient care in hospitals, clinics, and community settings. RNs assess patients, administer medications, create care plans, and educate patients and families.",
    salaryRange: "$65,000 – $120,000",
    growthOutlook: "6% growth (faster than average)",
    links: [
      { title: "NCLEX-RN Exam Prep", href: "/nclex-rn" },
      { title: "RN Career Guide", href: "/how-to-become-a-nurse/rn" },
      { title: "New Grad RN Hub", href: "/new-grad/nursing" },
      { title: "Nursing Specialties", href: "/nursing-specialties" },
    ],
  },
  {
    name: "Practical Nurse (RPN / LPN)",
    slug: "nursing-rpn",
    detailSlug: "licensed-practical-nurse",
    icon: Heart,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    description: "Provide basic nursing care under the direction of RNs and physicians. RPNs/LPNs monitor patient vitals, administer medications, assist with daily living activities, and document care.",
    salaryRange: "$45,000 – $65,000",
    growthOutlook: "5% growth (average)",
    links: [
      { title: "REx-PN Exam Prep", href: "/rex-pn" },
      { title: "NCLEX-PN Exam Prep", href: "/nclex-pn" },
      { title: "RPN Career Guide", href: "/how-to-become-a-nurse/rpn" },
    ],
  },
  {
    name: "Nurse Practitioner (NP)",
    slug: "nursing-np",
    detailSlug: "nurse-practitioner",
    icon: Stethoscope,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    description: "Advanced practice nurses who diagnose conditions, prescribe medications, order diagnostic tests, and manage patient care independently or in collaboration with physicians.",
    salaryRange: "$95,000 – $150,000",
    growthOutlook: "40% growth (much faster than average)",
    links: [
      { title: "Canadian NP Exam Prep", href: "/canada-np" },
      { title: "US NP Certification Prep", href: "/us-np" },
      { title: "NP Career Guide", href: "/how-to-become-a-nurse/np" },
    ],
  },
  {
    name: "Paramedic / EMT",
    slug: "paramedic",
    detailSlug: "paramedic",
    icon: Ambulance,
    color: "text-red-600",
    bgColor: "bg-red-50",
    description: "Respond to emergency calls, assess patients in the field, provide pre-hospital emergency care, and transport patients to medical facilities.",
    salaryRange: "$40,000 – $75,000",
    growthOutlook: "7% growth (faster than average)",
    links: [
      { title: "Paramedic Exam Prep", href: "/paramedic" },
      { title: "How to Become a Paramedic", href: "/how-to-become-a-paramedic" },
      { title: "New Grad Paramedic Hub", href: "/new-grad/paramedic" },
    ],
  },
  {
    name: "Respiratory Therapist (RRT)",
    slug: "rrt",
    detailSlug: "respiratory-therapist",
    icon: Wind,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    description: "Evaluate, treat, and care for patients with breathing disorders. RRTs manage ventilators, perform ABG analysis, administer respiratory medications, and conduct pulmonary function tests.",
    salaryRange: "$55,000 – $95,000",
    growthOutlook: "13% growth (much faster than average)",
    links: [
      { title: "RRT Exam Prep", href: "/respiratory-therapy" },
      { title: "How to Become an RRT", href: "/how-to-become-a-respiratory-therapist" },
      { title: "New Grad RRT Hub", href: "/new-grad/respiratory-therapy" },
    ],
  },
  {
    name: "Medical Laboratory Technologist (MLT)",
    slug: "mlt",
    detailSlug: "medical-laboratory-technologist",
    icon: Microscope,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    description: "Perform complex laboratory tests on blood, tissue, and body fluid samples to help physicians diagnose, treat, and prevent disease.",
    salaryRange: "$50,000 – $85,000",
    growthOutlook: "7% growth (faster than average)",
    links: [
      { title: "MLT Exam Prep", href: "/mlt" },
      { title: "How to Become an MLT", href: "/how-to-become-a-medical-lab-technologist" },
      { title: "New Grad MLT Hub", href: "/new-grad/mlt" },
    ],
  },
  {
    name: "Radiologic Technologist",
    slug: "imaging",
    detailSlug: "radiologic-technologist",
    icon: Radio,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description: "Operate diagnostic imaging equipment including X-ray, CT, MRI, and ultrasound to produce images that help physicians diagnose injuries and diseases.",
    salaryRange: "$55,000 – $90,000",
    growthOutlook: "6% growth (faster than average)",
    links: [
      { title: "Imaging Exam Prep", href: "/medical-imaging" },
      { title: "How to Become a Rad Tech", href: "/how-to-become-a-radiologic-technologist" },
      { title: "New Grad Imaging Hub", href: "/new-grad/diagnostic-imaging" },
    ],
  },
  {
    name: "Pharmacy Technician",
    slug: "pharmacy-tech",
    detailSlug: "pharmacy-technician",
    icon: Pill,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    description: "Assist pharmacists in preparing and dispensing medications, managing inventory, processing insurance claims, and providing customer service in pharmacy settings.",
    salaryRange: "$35,000 – $55,000",
    growthOutlook: "5% growth (average)",
    links: [
      { title: "Pharmacy Tech Exam Prep", href: "/pharmacy-tech" },
      { title: "How to Become a Pharm Tech", href: "/how-to-become-a-pharmacy-technician" },
    ],
  },
  {
    name: "Social Worker",
    slug: "social-work",
    detailSlug: "",
    icon: Users,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    description: "Help individuals, families, and communities cope with challenges, access resources, and improve well-being across healthcare, school, and community settings.",
    salaryRange: "$45,000 – $80,000",
    growthOutlook: "7% growth (faster than average)",
    links: [
      { title: "ASWB Exam Prep", href: "/social-work" },
      { title: "How to Become a Social Worker", href: "/how-to-become-a-social-worker" },
    ],
  },
  {
    name: "Occupational Therapist",
    slug: "occupational-therapy",
    detailSlug: "",
    icon: Hand,
    color: "text-green-600",
    bgColor: "bg-green-50",
    description: "Help patients develop, recover, and improve skills needed for daily living and working through therapeutic activities and adaptive equipment.",
    salaryRange: "$70,000 – $110,000",
    growthOutlook: "12% growth (much faster than average)",
    links: [
      { title: "NBCOT Exam Prep", href: "/occupational-therapy-practice-questions" },
      { title: "How to Become an OT", href: "/how-to-become-an-occupational-therapist" },
    ],
  },
  {
    name: "Diagnostic Medical Sonographer",
    slug: "sonographer",
    detailSlug: "sonographer",
    icon: Scan,
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    description: "Use ultrasound equipment to create images of internal body structures. Sonographers specialize in areas like obstetric, cardiac, vascular, and abdominal sonography.",
    salaryRange: "$60,000 – $100,000",
    growthOutlook: "10% growth (much faster than average)",
    links: [
      { title: "Imaging Exam Prep", href: "/medical-imaging" },
      { title: "New Grad Imaging Hub", href: "/new-grad/diagnostic-imaging" },
    ],
  },
  {
    name: "Physical Therapist Assistant (PTA)",
    slug: "pta",
    detailSlug: "physical-therapist-assistant",
    icon: Activity,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    description: "Work under the direction of physical therapists to help patients recover from injuries, surgeries, and chronic conditions through therapeutic exercises and interventions.",
    salaryRange: "$48,000 – $72,000",
    growthOutlook: "14% growth (much faster than average)",
    links: [
      { title: "Allied Health Study Resources", href: "/allied-health" },
      { title: "New Graduate Support", href: "/new-graduate-support" },
    ],
  },
  {
    name: "Occupational Therapy Assistant (OTA)",
    slug: "ota",
    detailSlug: "occupational-therapy-assistant",
    icon: Hand,
    color: "text-lime-600",
    bgColor: "bg-lime-50",
    description: "Help patients develop, recover, and improve skills needed for daily living and working through therapeutic activities under the supervision of occupational therapists.",
    salaryRange: "$50,000 – $75,000",
    growthOutlook: "24% growth (much faster than average)",
    links: [
      { title: "NBCOT Exam Prep", href: "/occupational-therapy-practice-questions" },
      { title: "How to Become an OT", href: "/how-to-become-an-occupational-therapist" },
    ],
  },
  {
    name: "Surgical Technologist",
    slug: "surgical-tech",
    detailSlug: "surgical-technologist",
    icon: Syringe,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    description: "Assist in surgical operations by preparing operating rooms, arranging equipment, helping surgeons during procedures, and maintaining sterile environments.",
    salaryRange: "$45,000 – $72,000",
    growthOutlook: "5% growth (average)",
    links: [
      { title: "Allied Health Study Resources", href: "/allied-health" },
      { title: "New Graduate Support", href: "/new-graduate-support" },
    ],
  },
];

const FAQ_DATA = [
  { question: "What healthcare careers does NurseNest support?", answer: "NurseNest provides exam preparation and career resources for nursing (RN, RPN/LPN, NP), paramedic/EMT, respiratory therapy, medical laboratory technology, radiologic technology/medical imaging, pharmacy technician, social work, psychotherapy, addictions counselling, and occupational therapy." },
  { question: "How do I choose the right healthcare career?", answer: "Consider your interests, preferred work environment, education timeline, and salary expectations. Use our career directory to explore each profession's requirements, job outlook, and day-to-day responsibilities. Many students also benefit from job shadowing or informational interviews with practicing professionals." },
  { question: "What certifications do I need for healthcare careers?", answer: "Each healthcare profession has its own licensing or certification exams. Nurses need NCLEX or REx-PN, paramedics need AEMCA or NREMT, respiratory therapists need CBRC or NBRC certification, and so on. Our Exam Prep Hub has preparation resources for all major healthcare certification exams." },
  { question: "What is the job outlook for healthcare careers?", answer: "Healthcare careers consistently show strong job growth. Nurse practitioners lead with 40% projected growth, followed by respiratory therapists at 13% and occupational therapists at 12%. Most healthcare professions show faster-than-average growth due to aging populations and expanding healthcare access." },
  { question: "Does NurseNest help with job applications?", answer: "Yes. Through our New Graduate Support hub and ApplyNest career tools, we provide interview prep with STAR framework answers, ATS-optimized resume templates, cover letter generators, and first-year career transition guides for healthcare professionals." },
  { question: "Can I explore careers and study for exams at the same time?", answer: "Absolutely. NurseNest is designed as an integrated platform. You can explore career options in the Healthcare Careers hub, prepare for your certification exam in the Exam Prep hub, and access career transition tools in the New Graduate Support hub — all from one account." },
];

const faqStructuredData = buildFaqStructuredData(FAQ_DATA);

const collectionStructuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Healthcare Careers Hub - Career Exploration and Certification Paths",
  "description": "Explore healthcare career paths including nursing, paramedic, respiratory therapy, medical laboratory, medical imaging, pharmacy, social work, and occupational therapy. Salary guides, certification requirements, and career resources.",
  "url": "https://www.nursenest.ca/healthcare-careers",
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

export default function HealthcareCareersHub() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-background" data-testid="healthcare-careers-hub-page">
      <Navigation />
      <SEO
        title={t("pages.healthcareCareersHub.healthcareCareersHubExploreCareer")}
        description={t("pages.healthcareCareersHub.exploreHealthcareCareerPathsAcross")}
        keywords="healthcare careers, nursing career, paramedic career, respiratory therapist career, MLT career, radiologic technologist career, pharmacy tech career, social work career, occupational therapy career, healthcare salary, healthcare job outlook"
        canonicalPath="/healthcare-careers"
        structuredData={collectionStructuredData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Healthcare Careers", url: "https://www.nursenest.ca/healthcare-careers" },
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <LocaleLink href="/" className="hover:text-blue-600">{t("pages.healthcareCareersHub.home")}</LocaleLink>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-700 font-medium">{t("pages.healthcareCareersHub.healthcareCareers")}</span>
        </div>

        <section className="mb-12" data-testid="section-careers-hero">
          <div className="bg-gradient-to-br from-purple-50 via-indigo-50/50 to-white rounded-2xl border border-purple-100 p-8 sm:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                <Award className="w-7 h-7 text-purple-600" />
              </div>
              <div>
                <Badge variant="outline" className="mb-2 text-xs border-purple-200 text-purple-700" data-testid="badge-careers-hub">
                  Career Exploration
                </Badge>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight" data-testid="text-careers-h1">
                  Healthcare Careers Hub
                </h1>
              </div>
            </div>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-4xl" data-testid="text-careers-intro">
              Explore healthcare career paths and find the right profession for you. Compare roles, salary ranges, job outlook, and certification requirements across nursing, allied health, and mental health professions. Each career links directly to exam preparation resources and career transition tools.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/80 rounded-xl border border-slate-200/60 p-4 text-center" data-testid="stat-career-paths">
                <p className="text-lg sm:text-xl font-bold text-gray-900">14</p>
                <p className="text-xs text-slate-500 mt-1">{t("pages.healthcareCareersHub.careerPaths")}</p>
              </div>
              <div className="bg-white/80 rounded-xl border border-slate-200/60 p-4 text-center" data-testid="stat-salary-range">
                <p className="text-lg sm:text-xl font-bold text-gray-900">$35K–$150K</p>
                <p className="text-xs text-slate-500 mt-1">{t("pages.healthcareCareersHub.salaryRange")}</p>
              </div>
              <div className="bg-white/80 rounded-xl border border-slate-200/60 p-4 text-center" data-testid="stat-career-guides">
                <p className="text-lg sm:text-xl font-bold text-gray-900">12</p>
                <p className="text-xs text-slate-500 mt-1">{t("pages.healthcareCareersHub.careerGuides")}</p>
              </div>
              <div className="bg-white/80 rounded-xl border border-slate-200/60 p-4 text-center" data-testid="stat-job-growth">
                <p className="text-lg sm:text-xl font-bold text-gray-900">5–40%</p>
                <p className="text-xs text-slate-500 mt-1">{t("pages.healthcareCareersHub.jobGrowth")}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12" data-testid="section-quick-links">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5">{t("pages.healthcareCareersHub.careerToolsAndResources")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="/allied-health/careers" data-testid="card-career-directory-link">
              <Card className="h-full hover:shadow-md hover:border-teal-200 transition-all cursor-pointer group" data-testid="card-career-directory">
                <CardContent className="p-5">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center mb-3 group-hover:bg-teal-100 transition-colors">
                    <FileText className="w-5 h-5 text-teal-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-teal-600 transition-colors mb-1">{t("pages.healthcareCareersHub.careerDirectory")}</h3>
                  <p className="text-xs text-slate-500">{t("pages.healthcareCareersHub.browseAllAlliedHealthCareer")}</p>
                </CardContent>
              </Card>
            </a>
            <LocaleLink href="/new-grad#career-tools">
              <Card className="h-full hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group" data-testid="card-applynest-tools">
                <CardContent className="p-5">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mb-3 group-hover:bg-purple-100 transition-colors">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-purple-600 transition-colors mb-1">{t("pages.healthcareCareersHub.applynestJobTools")}</h3>
                  <p className="text-xs text-slate-500">{t("pages.healthcareCareersHub.interviewPrepResumeBuilderAnd")}</p>
                </CardContent>
              </Card>
            </LocaleLink>
            <LocaleLink href="/new-graduate-support">
              <Card className="h-full hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group" data-testid="card-new-grad-tools">
                <CardContent className="p-5">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-3 group-hover:bg-indigo-100 transition-colors">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors mb-1">{t("pages.healthcareCareersHub.newGraduateSupport")}</h3>
                  <p className="text-xs text-slate-500">{t("pages.healthcareCareersHub.first90DaysRoadmapClinical")}</p>
                </CardContent>
              </Card>
            </LocaleLink>
            <LocaleLink href="/exam-prep">
              <Card className="h-full hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group" data-testid="card-exam-prep-tools">
                <CardContent className="p-5">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors mb-1">{t("pages.healthcareCareersHub.examPrepHub")}</h3>
                  <p className="text-xs text-slate-500">{t("pages.healthcareCareersHub.practiceQuestionsMockExamsAnd")}</p>
                </CardContent>
              </Card>
            </LocaleLink>
          </div>
        </section>

        <section className="mb-12" data-testid="section-career-paths">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">{t("pages.healthcareCareersHub.exploreCareerPaths")}</h2>
          <div className="space-y-5">
            {CAREER_PATHS.map((career) => {
              const Icon = career.icon;
              return (
                <Card key={career.slug} className="border-slate-200/60 hover:shadow-md transition-shadow" data-testid={`card-career-${career.slug}`}>
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row gap-5">
                      <div className="shrink-0">
                        <div className={`w-14 h-14 rounded-xl ${career.bgColor} flex items-center justify-center`}>
                          <Icon className={`w-7 h-7 ${career.color}`} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{career.name}</h3>
                        <p className="text-sm text-slate-600 mb-3">{career.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
                          <span className="flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            {career.salaryRange}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                            {career.growthOutlook}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {career.detailSlug && (
                            <LocaleLink href={`/healthcare-careers/${career.detailSlug}`}>
                              <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors cursor-pointer" data-testid={`link-career-guide-${career.slug}`}>
                                {t("careerGuide.viewFullGuide")}
                                <ArrowRight className="w-3 h-3" />
                              </span>
                            </LocaleLink>
                          )}
                          {career.links.map((link, idx) => (
                            <LocaleLink key={idx} href={link.href}>
                              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-purple-100 hover:text-purple-700 transition-colors cursor-pointer" data-testid={`link-career-${career.slug}-${idx}`}>
                                {link.title}
                                <ChevronRight className="w-3 h-3" />
                              </span>
                            </LocaleLink>
                          ))}
                          {career.detailSlug && (
                            <LocaleLink href={`/healthcare-careers/${career.detailSlug}`}>
                              <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors cursor-pointer" data-testid={`link-career-detail-${career.slug}`}>
                                View Full Guide
                                <ArrowRight className="w-3 h-3" />
                              </span>
                            </LocaleLink>
                          )}
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
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">{t("pages.healthcareCareersHub.relatedResources")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <LocaleLink href="/exam-prep">
              <Card className="h-full hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group" data-testid="card-cross-exam-prep">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{t("pages.healthcareCareersHub.examPrepHub2")}</h3>
                      <p className="text-xs text-slate-500 mt-1">{t("pages.healthcareCareersHub.practiceQuestionsMockExamsAnd2")}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            </LocaleLink>
            <LocaleLink href="/new-graduate-support">
              <Card className="h-full hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group" data-testid="card-cross-new-grad">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">{t("pages.healthcareCareersHub.newGraduateSupport2")}</h3>
                      <p className="text-xs text-slate-500 mt-1">{t("pages.healthcareCareersHub.interviewPrepResumeToolsAnd")}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            </LocaleLink>
            <LocaleLink href="/healthcare-certifications">
              <Card className="h-full hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group" data-testid="card-cross-certifications">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm group-hover:text-emerald-600 transition-colors">{t("pages.healthcareCareersHub.healthcareCertifications")}</h3>
                      <p className="text-xs text-slate-500 mt-1">{t("pages.healthcareCareersHub.blsAclsPalsNrpCcrn")}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 shrink-0 mt-1" />
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
                      <h3 className="font-semibold text-gray-900 text-sm group-hover:text-teal-600 transition-colors">{t("pages.healthcareCareersHub.healthcareEncyclopedia")}</h3>
                      <p className="text-xs text-slate-500 mt-1">{t("pages.healthcareCareersHub.clinicalReferenceContentOrganizedBy")}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            </LocaleLink>
          </div>
        </section>

        <div className="mb-12">
          <p className="text-sm text-slate-600 leading-relaxed">
            If you're exploring healthcare career options and need help with program applications or scholarship searches, <a href="https://applynest.ca" target="_blank" rel="noopener noreferrer" className="text-purple-600 font-medium hover:underline" data-testid="link-applynest-careers">{t("pages.healthcareCareersHub.visitApplynestForHealthcareApplication")}</a>.
          </p>
        </div>

        <section className="mb-12" data-testid="section-careers-faq">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">{t("pages.healthcareCareersHub.frequentlyAskedQuestions")}</h2>
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

        <section data-testid="section-careers-cta">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 sm:p-10 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Find Your Path in Healthcare
            </h2>
            <p className="text-purple-100 text-sm sm:text-base mb-6 max-w-2xl mx-auto">
              Choose a career path above, then access exam preparation resources and career transition tools to start your journey.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <LocaleLink href="/exam-prep">
                <Button className="bg-white text-purple-700 hover:bg-purple-50 px-6 py-2.5 font-semibold" data-testid="button-careers-exam-prep">
                  Start Exam Prep
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </LocaleLink>
              <LocaleLink href="/new-graduate-support">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-6 py-2.5" data-testid="button-careers-new-grad">
                  New Grad Resources
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
