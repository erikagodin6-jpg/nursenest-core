import { Link } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import { PROFESSION_HUB_DATA } from "@/allied/data/profession-hub-data";
import { getManifest } from "@/data/career-questions/question-counts";
import {
  BookOpen,
  Brain,
  Shield,
  Heart,
  Users,
  FileText,
  Scale,
  Globe,
  Stethoscope,
  GraduationCap,
  HandHeart,
  Building,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Star,
  Target,
  Sparkles,
  ClipboardList,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useI18n } from "@/lib/i18n";
const SW_DATA = PROFESSION_HUB_DATA["social-work"];

interface DomainInfo {
  slug: string;
  label: string;
  description: string;
  manifestCategories: string[];
  icon: typeof BookOpen;
  seoTitle: string;
  seoDescription: string;
}

function getDomainQuestionCount(domain: DomainInfo): number {

  const manifest = getManifest();
  const byCategory = manifest.static.alliedHealth?.socialWorker?.byCategory || {};
  return domain.manifestCategories.reduce(
    (sum, cat) => sum + (byCategory[cat] || 0),
    0
  );
}

const SOCIAL_WORK_DOMAIN_DEFS: DomainInfo[] = [
  { slug: "ethics-professional-boundaries", label: "Ethics & Professional Boundaries", description: "NASW Code of Ethics, dual relationships, confidentiality, duty to warn, informed consent, and professional boundary management.", manifestCategories: ["Ethics & Professional Boundaries", "Ethics & Boundaries", "Ethics and Legal"], icon: Shield, seoTitle: "Ethics & Professional Boundaries — ASWB Practice Questions", seoDescription: "Practice ASWB ethics questions covering NASW Code of Ethics, dual relationships, confidentiality limits, duty to warn, and professional boundaries." },
  { slug: "mental-health-psychopathology", label: "Mental Health & Psychopathology", description: "DSM-5-TR diagnostic criteria, differential diagnosis, psychopharmacology basics, and mental status examination.", manifestCategories: ["Mental Health & Psychopathology", "Mental Health"], icon: Brain, seoTitle: "Mental Health & Psychopathology — ASWB Practice Questions", seoDescription: "Master DSM-5-TR diagnostic criteria, differential diagnosis, and psychopathology concepts for ASWB licensing exams." },
  { slug: "crisis-intervention", label: "Crisis Intervention", description: "Suicide risk assessment, safety planning, crisis stabilization, trauma response, and emergency protocols.", manifestCategories: ["Crisis Intervention"], icon: Heart, seoTitle: "Crisis Intervention — ASWB Practice Questions", seoDescription: "Practice crisis intervention questions including suicide risk assessment, safety planning, and emergency response protocols." },
  { slug: "trauma-informed-care", label: "Trauma-Informed Care", description: "ACEs framework, trauma screening, EMDR, somatic experiencing, complex PTSD, and vicarious trauma management.", manifestCategories: ["Trauma-Informed Care"], icon: HandHeart, seoTitle: "Trauma-Informed Care — ASWB Practice Questions", seoDescription: "Study trauma-informed care for ASWB exams including ACEs, EMDR, complex PTSD, and evidence-based trauma interventions." },
  { slug: "child-family-services", label: "Child & Family Services", description: "Child welfare law, family systems theory, parenting assessments, foster care, adoption, and family therapy modalities.", manifestCategories: ["Child & Family Services"], icon: Users, seoTitle: "Child & Family Services — ASWB Practice Questions", seoDescription: "Practice child welfare, family therapy, and child protection questions for ASWB licensing exam preparation." },
  { slug: "case-management", label: "Case Management", description: "Care coordination, resource brokering, discharge planning, documentation, and service delivery models.", manifestCategories: ["Case Management"], icon: ClipboardList, seoTitle: "Case Management — ASWB Practice Questions", seoDescription: "Study case management concepts for ASWB exams including care coordination, discharge planning, and service delivery." },
  { slug: "community-practice-advocacy", label: "Community Practice & Advocacy", description: "Community organizing, policy advocacy, macro practice, needs assessment, and social action strategies.", manifestCategories: ["Community Practice & Advocacy", "Community Practice"], icon: Globe, seoTitle: "Community Practice & Advocacy — ASWB Practice Questions", seoDescription: "Practice community organizing, policy advocacy, and macro social work questions for ASWB exam preparation." },
  { slug: "addictions-substance-use", label: "Addictions & Substance Use", description: "Motivational interviewing, stages of change, MAT, co-occurring disorders, relapse prevention, and harm reduction.", manifestCategories: ["Addictions & Substance Use"], icon: Stethoscope, seoTitle: "Addictions & Substance Use — ASWB Practice Questions", seoDescription: "Study substance use disorders, motivational interviewing, and addiction treatment for ASWB licensing exams." },
  { slug: "documentation-record-keeping", label: "Documentation & Record Keeping", description: "Clinical documentation standards, progress notes, treatment plans, HIPAA compliance, and record retention.", manifestCategories: ["Documentation & Record Keeping", "Documentation & Record-Keeping"], icon: FileText, seoTitle: "Documentation & Record Keeping — ASWB Practice Questions", seoDescription: "Practice documentation and record keeping questions for ASWB exams including HIPAA, clinical notes, and treatment plans." },
  { slug: "legislation-policy-frameworks", label: "Legislation & Policy Frameworks", description: "Social welfare policy, ADA, Title IX, Tarasoff, mandatory reporting laws, and social work licensing regulations.", manifestCategories: ["Legislation & Policy Frameworks", "Legislation & Consent"], icon: Scale, seoTitle: "Legislation & Policy Frameworks — ASWB Practice Questions", seoDescription: "Study social welfare policy, mandatory reporting laws, and legal frameworks for ASWB licensing exam preparation." },
  { slug: "diversity-equity-inclusion", label: "Diversity, Equity & Inclusion", description: "Cultural competence, anti-oppressive practice, intersectionality, implicit bias, and health equity.", manifestCategories: ["Diversity, Equity & Inclusion", "DEI & Anti-Oppressive Practice", "Diversity and Cultural Competence"], icon: Sparkles, seoTitle: "Diversity, Equity & Inclusion — ASWB Practice Questions", seoDescription: "Practice cultural competence, anti-oppressive practice, and DEI questions for ASWB licensing exams." },
  { slug: "assessment-intervention-planning", label: "Assessment & Intervention Planning", description: "Biopsychosocial assessment, evidence-based interventions, CBT, DBT, solution-focused therapy, and treatment planning.", manifestCategories: ["Assessment & Intervention Planning", "Assessment", "Clinical Practice"], icon: Target, seoTitle: "Assessment & Intervention Planning — ASWB Practice Questions", seoDescription: "Study assessment methods and intervention planning for ASWB exams including CBT, DBT, and evidence-based practice." },
  { slug: "group-work", label: "Group Work", description: "Group dynamics, facilitation techniques, psychoeducation groups, support groups, and group therapy models.", manifestCategories: ["Group Work"], icon: Users, seoTitle: "Group Work — ASWB Practice Questions", seoDescription: "Practice group therapy, group dynamics, and facilitation questions for ASWB licensing exam preparation." },
  { slug: "gerontology", label: "Gerontology", description: "Aging processes, dementia care, elder abuse, Medicare/Medicaid, end-of-life planning, and caregiver support.", manifestCategories: ["Gerontology"], icon: GraduationCap, seoTitle: "Gerontology — ASWB Practice Questions", seoDescription: "Study gerontology and aging-related social work for ASWB exams including dementia care and elder services." },
  { slug: "school-social-work", label: "School Social Work", description: "IEPs, 504 plans, school-based mental health, bullying prevention, truancy intervention, and education policy.", manifestCategories: ["School Social Work", "School & Social Service Systems"], icon: Building, seoTitle: "School Social Work — ASWB Practice Questions", seoDescription: "Practice school social work questions for ASWB exams including IEPs, 504 plans, and school-based interventions." },
  { slug: "safeguarding-vulnerable-populations", label: "Safeguarding & Vulnerable Populations", description: "Adult protective services, domestic violence, human trafficking, disability rights, and advocacy for at-risk populations.", manifestCategories: ["Safeguarding & Vulnerable Populations", "Safeguarding & Risk Management"], icon: Shield, seoTitle: "Safeguarding & Vulnerable Populations — ASWB Practice Questions", seoDescription: "Study safeguarding and vulnerable population protection for ASWB licensing exams." },
  { slug: "social-determinants-of-health", label: "Social Determinants of Health", description: "Housing insecurity, food access, transportation barriers, health literacy, and socioeconomic factors in health outcomes.", manifestCategories: ["Social Determinants of Health"], icon: Globe, seoTitle: "Social Determinants of Health — ASWB Practice Questions", seoDescription: "Practice social determinants of health questions for ASWB exams including housing, food access, and health equity." },
  { slug: "interdisciplinary-collaboration", label: "Interdisciplinary Collaboration", description: "Interprofessional teamwork, role clarification, conflict resolution, care coordination, and collaborative documentation.", manifestCategories: ["Interdisciplinary Collaboration"], icon: Briefcase, seoTitle: "Interdisciplinary Collaboration — ASWB Practice Questions", seoDescription: "Study interprofessional collaboration and teamwork for ASWB licensing exam preparation." },
  { slug: "communication-interviewing", label: "Communication & Interviewing", description: "Therapeutic communication, active listening, motivational interviewing, reflective practice, and interview techniques.", manifestCategories: ["Communication & Interviewing"], icon: MessageCircle, seoTitle: "Communication & Interviewing — ASWB Practice Questions", seoDescription: "Practice therapeutic communication and interviewing skills for ASWB licensing exams." },
  { slug: "exam-style-mixed-practice", label: "Exam-Style Mixed Practice", description: "Mixed-domain questions simulating the actual ASWB exam experience with randomized content areas and difficulty levels.", manifestCategories: ["Exam-Style Mixed Practice", "Human Development"], icon: BookOpen, seoTitle: "Exam-Style Mixed Practice — ASWB Practice Questions", seoDescription: "Take mixed-domain practice tests simulating the real ASWB exam experience across all content areas." },
];

const SOCIAL_WORK_DOMAINS = SOCIAL_WORK_DOMAIN_DEFS.map((d) => ({
  ...d,
  questionCount: getDomainQuestionCount(d),
}));

function SocialWorkHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 border-b" data-testid="social-work-hero">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-100/40 via-transparent to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumb-nav">
          <Link href="/allied-health/home" className="hover:text-teal-600">{t("allied.socialWorkDomains.alliedHealth")}</Link>
          <span>/</span>
          <Link href="/allied-health/social-work" className="hover:text-teal-600">{t("allied.socialWorkDomains.socialWork")}</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">{t("allied.socialWorkDomains.examDomains")}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-sm font-medium mb-4" data-testid="badge-question-count">
              <Sparkles className="w-4 h-4" />
              1,000+ ASWB-Aligned Questions
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight" data-testid="heading-domains">
              Master Every ASWB Exam Domain
            </h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed" data-testid="text-subtitle">
              Comprehensive practice across all 20 content areas tested on the ASWB Clinical, Masters, and Advanced Generalist licensing exams. Each question includes detailed clinical rationales.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {[
                "20 ASWB content domains",
                "Blueprint-weighted distribution",
                "Clinical case vignettes",
                "400+ word rationales",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-700" data-testid={`feature-${item.replace(/\s+/g, "-").toLowerCase()}`}>
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/allied-health/qbank?career=social-worker">
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg" data-testid="button-start-practicing">
                  Start Practicing Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/allied-health/diagnostic?career=social-worker">
                <Button size="lg" variant="outline" className="border-teal-600 text-teal-700 hover:bg-teal-50" data-testid="button-diagnostic">
                  Take Diagnostic Exam
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <Star className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{t("allied.socialWorkDomains.aswbExamReadiness")}</p>
                  <p className="text-sm text-gray-500">{t("allied.socialWorkDomains.trackYourProgressAcrossAll")}</p>
                </div>
              </div>
              <div className="space-y-3">
                {["Ethics & Professional Boundaries", "Mental Health & Psychopathology", "Crisis Intervention", "Trauma-Informed Care"].map((domain, i) => (
                  <div key={domain} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{domain}</span>
                        <span className="text-teal-600 font-medium">{[85, 72, 90, 68][i]}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: `${[85, 72, 90, 68][i]}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-gray-400 text-center pt-2">{t("allied.socialWorkDomains.sampleProgressDashboardPreview")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DomainCard({ domain }: { domain: DomainInfo }) {
  const Icon = domain.icon;
  return (
    <Link href={`/allied-health/social-work/domain/${domain.slug}`}>
      <Card className="h-full hover:shadow-lg hover:border-teal-200 transition-all cursor-pointer group" data-testid={`card-domain-${domain.slug}`}>
        <CardContent className="p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-100 transition-colors">
              <Icon className="w-5 h-5 text-cyan-700" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 group-hover:text-teal-700 transition-colors text-sm leading-tight" data-testid={`text-domain-title-${domain.slug}`}>
                {domain.label}
              </h3>
              <span className="text-xs text-teal-600 font-medium">{domain.questionCount} questions</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{domain.description}</p>
          <div className="flex items-center gap-1 mt-3 text-teal-600 text-sm font-medium group-hover:gap-2 transition-all">
            Practice Now <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ConversionBanner() {
  return (
    <section className="bg-gradient-to-r from-teal-600 to-cyan-700 rounded-2xl p-8 md:p-12 text-white text-center" data-testid="section-conversion-banner">
      <h2 className="text-2xl md:text-3xl font-bold mb-3">{t("allied.socialWorkDomains.readyToPassTheAswb")}</h2>
      <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
        Join thousands of social work students using NurseNest Allied to prepare for ASWB Clinical, Masters, and Advanced Generalist licensing exams.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/allied-health/qbank?career=social-worker">
          <Button size="lg" className="bg-white text-teal-700 hover:bg-teal-50 shadow-lg" data-testid="button-cta-start-free">
            Start Free — No Card Required
          </Button>
        </Link>
        <Link href="/allied-health/social-work/mock-exam">
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" data-testid="button-cta-mock-exam">
            Try a Mock Exam
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default function SocialWorkDomainsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "ASWB Exam Domains — Social Work Practice Questions",
    description: "Browse 1,000+ ASWB-aligned practice questions organized across 20 content domains for Clinical, Masters, and Advanced Generalist licensing exams.",
    url: "https://www.nursenest.ca/allied-health/social-work/domains",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: SOCIAL_WORK_DOMAINS.length,
      itemListElement: SOCIAL_WORK_DOMAINS.map((d, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: d.label,
        url: `https://www.nursenest.ca/allied-health/social-work/domain/${d.slug}`,
      })),
    },
    isPartOf: {
      "@type": "WebSite",
      name: "NurseNest Allied",
      url: "https://www.nursenest.ca",
    },
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Allied Health", item: "https://www.nursenest.ca/allied-health/home" },
      { "@type": "ListItem", position: 2, name: "Social Work", item: "https://www.nursenest.ca/allied-health/social-work" },
      { "@type": "ListItem", position: 3, name: "Exam Domains", item: "https://www.nursenest.ca/allied-health/social-work/domains" },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid="page-social-work-domains">
      <AlliedSEO
        title={t("allied.socialWorkDomains.aswbExamDomains1000Social")}
        description={t("allied.socialWorkDomains.browse1000AswbalignedPracticeQuestions")}
        keywords="ASWB exam domains, social work practice questions, ASWB content areas, LCSW exam prep, social work exam topics, ASWB clinical exam domains"
        canonicalPath="/allied-health/social-work/domains"
        structuredData={structuredData}
        additionalStructuredData={[breadcrumbData]}
      />

      <SocialWorkHero />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3" data-testid="heading-browse-domains">
            Browse by Content Domain
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select a domain to practice targeted questions. Each domain includes scenario-based questions with detailed clinical rationales aligned to ASWB exam blueprints.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-16" data-testid="grid-domains">
          {SOCIAL_WORK_DOMAINS.map((domain) => (
            <DomainCard key={domain.slug} domain={domain} />
          ))}
        </div>

        <ConversionBanner />

        <section className="mt-16" data-testid="section-cross-links">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t("allied.socialWorkDomains.relatedStudyResources")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Test Bank", href: "/allied-health/social-work/test-bank", desc: "Full question bank with filtering by domain, difficulty, and exam level" },
              { label: "Mock Exams", href: "/allied-health/social-work/mock-exam", desc: "Full-length ASWB simulations with domain-level scoring" },
              { label: "Study Guide", href: "/allied-health/social-work/study-guide", desc: "Structured study materials across all ASWB exam domains" },
            ].map((link) => (
              <Link key={link.href} href={link.href}>
                <Card className="h-full hover:shadow-md hover:border-teal-200 transition-all cursor-pointer" data-testid={`link-resource-${link.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-1">{link.label}</h3>
                    <p className="text-sm text-gray-600">{link.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export function SocialWorkDomainDetailPage({ slug }: { slug: string }) {
  const domain = SOCIAL_WORK_DOMAINS.find((d) => d.slug === slug);

  if (!domain) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.socialWorkDomains.domainNotFound")}</h1>
          <p className="text-gray-600 mb-4">{t("allied.socialWorkDomains.theRequestedContentDomainCould")}</p>
          <Link href="/allied-health/social-work/domains">
            <Button variant="outline" data-testid="button-back-domains">{t("allied.socialWorkDomains.backToAllDomains")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = domain.icon;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: domain.seoTitle,
    description: domain.seoDescription,
    url: `https://www.nursenest.ca/allied-health/social-work/domain/${domain.slug}`,
    educationalLevel: "Professional",
    learningResourceType: "Practice Questions",
    teaches: domain.label,
    provider: { "@type": "Organization", name: "NurseNest Allied", url: "https://www.nursenest.ca" },
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Allied Health", item: "https://www.nursenest.ca/allied-health/home" },
      { "@type": "ListItem", position: 2, name: "Social Work", item: "https://www.nursenest.ca/allied-health/social-work" },
      { "@type": "ListItem", position: 3, name: "Exam Domains", item: "https://www.nursenest.ca/allied-health/social-work/domains" },
      { "@type": "ListItem", position: 4, name: domain.label, item: `https://www.nursenest.ca/allied-health/social-work/domain/${domain.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid={`page-domain-${domain.slug}`}>
      <AlliedSEO
        title={domain.seoTitle}
        description={domain.seoDescription}
        keywords={`${domain.label.toLowerCase()}, ASWB practice questions, social work exam prep, ${domain.label.toLowerCase()} questions, LCSW exam`}
        canonicalPath={`/allied-health/social-work/domain/${domain.slug}`}
        structuredData={structuredData}
        additionalStructuredData={[breadcrumbData]}
      />

      <section className="bg-gradient-to-br from-cyan-50 to-teal-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumb-domain-detail">
            <Link href="/allied-health/home" className="hover:text-teal-600">{t("allied.socialWorkDomains.alliedHealth2")}</Link>
            <span>/</span>
            <Link href="/allied-health/social-work" className="hover:text-teal-600">{t("allied.socialWorkDomains.socialWork2")}</Link>
            <span>/</span>
            <Link href="/allied-health/social-work/domains" className="hover:text-teal-600">{t("allied.socialWorkDomains.domains")}</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">{domain.label}</span>
          </nav>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-cyan-100 flex items-center justify-center flex-shrink-0">
              <Icon className="w-7 h-7 text-cyan-700" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2" data-testid="heading-domain-title">{domain.label}</h1>
              <p className="text-gray-600 max-w-2xl mb-4">{domain.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {domain.questionCount} questions</span>
                <span className="flex items-center gap-1"><Target className="w-4 h-4" /> {t("allied.socialWorkDomains.aswbaligned")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Card className="md:col-span-2" data-testid="card-domain-overview">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t("allied.socialWorkDomains.whatYoullPractice")}</h2>
              <p className="text-gray-600 mb-4">
                This domain covers {domain.questionCount} practice questions designed to test your knowledge of {domain.label.toLowerCase()} as it appears on the ASWB licensing exams. Questions include clinical case vignettes, ethical scenarios, and evidence-based practice applications.
              </p>
              <p className="text-gray-600 mb-6">
                Each question includes a detailed rationale (400+ words) explaining the correct answer, why each distractor is incorrect, and the underlying clinical reasoning. Content is aligned to ASWB Clinical, Masters, and Advanced Generalist exam blueprints.
              </p>
              <Link href={`/allied-health/qbank?career=social-worker&domain=${domain.slug}`}>
                <Button className="bg-teal-600 hover:bg-teal-700" data-testid="button-start-domain-practice">
                  Practice {domain.label} Questions
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card data-testid="card-quick-links">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">{t("allied.socialWorkDomains.quickLinks")}</h3>
              <div className="space-y-3">
                <Link href="/allied-health/social-work/domains" className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-800">
                  <ArrowRight className="w-3.5 h-3.5" /> All 20 Domains
                </Link>
                <Link href="/allied-health/social-work/test-bank" className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-800">
                  <ArrowRight className="w-3.5 h-3.5" /> Full Test Bank
                </Link>
                <Link href="/allied-health/social-work/mock-exam" className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-800">
                  <ArrowRight className="w-3.5 h-3.5" /> Mock Exams
                </Link>
                <Link href="/allied-health/diagnostic?career=social-worker" className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-800">
                  <ArrowRight className="w-3.5 h-3.5" /> Diagnostic Assessment
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <ConversionBanner />

        <section className="mt-10" data-testid="section-other-domains">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t("allied.socialWorkDomains.exploreOtherDomains")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SOCIAL_WORK_DOMAINS.filter((d) => d.slug !== domain.slug).slice(0, 8).map((d) => {
              const DIcon = d.icon;
              return (
                <Link key={d.slug} href={`/allied-health/social-work/domain/${d.slug}`}>
                  <div className="p-3 rounded-lg border hover:border-teal-200 hover:bg-teal-50/50 transition-all cursor-pointer" data-testid={`link-other-domain-${d.slug}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <DIcon className="w-4 h-4 text-cyan-600" />
                      <span className="text-sm font-medium text-gray-800 truncate">{d.label}</span>
                    </div>
                    <span className="text-xs text-gray-500">{d.questionCount} questions</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

export function SocialWorkTestBankPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "ASWB Test Bank — 1,000+ Social Work Practice Questions",
    description: "Complete ASWB test bank with 1,000+ practice questions across 20 content domains for Clinical, Masters, and Advanced Generalist licensing exams.",
    url: "https://www.nursenest.ca/allied-health/social-work/test-bank",
    educationalLevel: "Professional",
    learningResourceType: "Test Bank",
    provider: { "@type": "Organization", name: "NurseNest Allied", url: "https://www.nursenest.ca" },
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid="page-social-work-test-bank">
      <AlliedSEO
        title={t("allied.socialWorkDomains.aswbTestBank1000Social")}
        description={t("allied.socialWorkDomains.accessOurComprehensiveAswbTest")}
        keywords="ASWB test bank, social work practice questions, ASWB question bank, LCSW exam prep, social work test prep, ASWB clinical questions"
        canonicalPath="/allied-health/social-work/test-bank"
        structuredData={structuredData}
      />

      <section className="bg-gradient-to-br from-cyan-50 to-teal-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumb-test-bank">
            <Link href="/allied-health/home" className="hover:text-teal-600">{t("allied.socialWorkDomains.alliedHealth3")}</Link>
            <span>/</span>
            <Link href="/allied-health/social-work" className="hover:text-teal-600">{t("allied.socialWorkDomains.socialWork3")}</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">{t("allied.socialWorkDomains.testBank")}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" data-testid="heading-test-bank">{t("allied.socialWorkDomains.aswbTestBank")}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mb-6">
            1,000+ ASWB-aligned practice questions with detailed clinical rationales. Filter by domain, difficulty level, and exam type to create a personalized study experience.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/allied-health/qbank?career=social-worker">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700" data-testid="button-launch-qbank">
                Launch Question Bank
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/allied-health/social-work/domains">
              <Button size="lg" variant="outline" data-testid="button-browse-domains">
                Browse by Domain
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6" data-testid="heading-domain-breakdown">{t("allied.socialWorkDomains.questionsByDomain")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {SOCIAL_WORK_DOMAINS.map((domain) => {
            const Icon = domain.icon;
            return (
              <Link key={domain.slug} href={`/allied-health/social-work/domain/${domain.slug}`}>
                <Card className="h-full hover:shadow-md hover:border-teal-200 transition-all cursor-pointer" data-testid={`card-test-bank-domain-${domain.slug}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-5 h-5 text-cyan-600" />
                      <span className="font-medium text-sm text-gray-900">{domain.label}</span>
                    </div>
                    <span className="text-xs text-teal-600">{domain.questionCount} questions</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <ConversionBanner />
      </main>
    </div>
  );
}

export { SOCIAL_WORK_DOMAINS };
