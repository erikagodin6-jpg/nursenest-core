import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { LocaleLink } from "@/lib/LocaleLink";
import { buildFaqStructuredData } from "@/lib/structured-data";
import {
  GraduationCap, ArrowRight, ChevronRight, BookOpen,
  FileText, MessageSquare, ClipboardList, Target, Shield,
  Briefcase, Brain, Award, Users, Stethoscope, Heart,
  type LucideIcon
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useI18n } from "@/lib/i18n";
interface ResourceItem {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

interface ResourceSection {
  category: string;
  badge: string;
  badgeColor: string;
  items: ResourceItem[];
}

const NEW_GRAD_RESOURCES: ResourceSection[] = [
  {
    category: "Career Launch Tools",
    badge: "ApplyNest",
    badgeColor: "bg-purple-100 text-purple-700",
    items: [
      { icon: MessageSquare, title: "Interview Prep Lab", description: "100+ behavioral and clinical interview questions with STAR framework answers sourced from real nurse manager hiring panels.", href: "/new-grad#interview-lab" },
      { icon: FileText, title: "Resume Builder", description: "ATS-optimized nursing resume templates tested against major hospital network applicant tracking systems.", href: "/new-grad#resume-builder" },
      { icon: ClipboardList, title: "Cover Letter Generator", description: "Customizable cover letter frameworks for med-surg, ICU, ER, L&D, pediatrics, and specialty units.", href: "/new-grad#cover-letter" },
    ],
  },
  {
    category: "First-Year Success",
    badge: "NurseNest",
    badgeColor: "bg-blue-100 text-blue-700",
    items: [
      { icon: Target, title: "First 90 Days Roadmap", description: "Week-by-week survival guide from orientation through independent practice with milestone checklists and reflection prompts.", href: "/new-grad#first-90-days" },
      { icon: Shield, title: "Clinical Confidence Builder", description: "Quick-reference clinical decision guides, medication checklists, and shift preparation tools for new graduates.", href: "/new-grad#clinical-confidence" },
      { icon: Brain, title: "Clinical Skills Hub", description: "Interactive clinical skills guides with step-by-step procedures, competency checklists, and video walkthroughs.", href: "/simulators/clinical-skills" },
    ],
  },
  {
    category: "Profession-Specific Hubs",
    badge: "All Professions",
    badgeColor: "bg-green-100 text-green-700",
    items: [
      { icon: Stethoscope, title: "Nursing New Grad Hub", description: "Comprehensive career transition resources specifically for new graduate RNs, RPNs, and LPNs entering clinical practice.", href: "/new-grad/nursing" },
      { icon: Heart, title: "Paramedic New Grad Hub", description: "First-year guide for new paramedics including field preceptorship tips, call management, and career progression.", href: "/new-grad/paramedic" },
      { icon: Users, title: "Allied Health New Grad Hubs", description: "Profession-specific new graduate resources for MLT, respiratory therapy, imaging, pharmacy tech, and more.", href: "/new-grad" },
    ],
  },
];

const EXAM_PREP_CROSS_LINKS = [
  { title: "NCLEX-RN Study Hub", href: "/nclex-rn", description: "Full NCLEX-RN exam prep with mock exams and question banks." },
  { title: "REx-PN Study Hub", href: "/rex-pn", description: "Canadian RPN exam preparation aligned to REx-PN competencies." },
  { title: "Test Bank", href: "/free-practice", description: "Thousands of practice questions organized by body system." },
  { title: "Flashcard Decks", href: "/flashcards", description: "Quick-review flashcards for pharmacology, lab values, and more." },
  { title: "Clinical Judgment Cases", href: "/clinical-clarity", description: "NGN-style clinical judgment scenarios and case studies." },
  { title: "Mock Exams", href: "/mock-exams", description: "Full-length adaptive mock exams that mirror real testing." },
];

const FAQ_DATA = [
  { question: "Who is the New Graduate Support hub for?", answer: "This hub is designed for healthcare students in their final semester and new graduates in their first year of practice. It covers nursing (RN, RPN, LPN), paramedic, respiratory therapy, medical laboratory, medical imaging, pharmacy technician, social work, and occupational therapy professions." },
  { question: "What career tools are included?", answer: "The hub includes an Interview Prep Lab with 100+ behavioral and clinical interview questions, an ATS-optimized Resume Builder, a Cover Letter Generator with unit-specific frameworks, a First 90 Days Roadmap, and a Clinical Confidence Builder with quick-reference guides." },
  { question: "How does the Interview Prep Lab work?", answer: "The Interview Prep Lab provides real interview questions sourced from nurse manager hiring panels. Each question includes a complete STAR framework answer (Situation, Task, Action, Result) so you can practice structuring your responses effectively." },
  { question: "Can I use these tools before I graduate?", answer: "Absolutely. We recommend starting 3-6 months before graduation. Begin with resume building and interview prep during your final semester so you are ready to apply as soon as you pass your licensing exam." },
  { question: "Are there exam prep resources for new graduates too?", answer: "Yes. The New Graduate Support hub cross-links to all exam preparation resources on NurseNest. You can access question banks, mock exams, flashcards, and study guides for your specific certification exam directly from this hub." },
  { question: "Is this for Canadian and American graduates?", answer: "Yes. All career tools, interview prep, and resume templates are designed for healthcare graduates in both Canada and the United States. Region-specific licensing requirements and job search strategies are covered for both countries." },
];

const faqStructuredData = buildFaqStructuredData(FAQ_DATA);

const collectionStructuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "New Graduate Support Hub - Career Transition Resources for Healthcare Professionals",
  "description": "Central hub for new graduate healthcare professionals. Interview prep, resume tools, first-year survival guides, and career transition resources for nursing and allied health graduates.",
  "url": "https://www.nursenest.ca/new-graduate-support",
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

export default function NewGraduateSupportHub() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-background" data-testid="new-graduate-support-hub-page">
      <Navigation />
      <SEO
        title={t("pages.newGraduateSupportHub.newGraduateSupportHubCareer")}
        description={t("pages.newGraduateSupportHub.centralHubForNewGraduate")}
        keywords="new grad nurse, new graduate healthcare, nursing interview prep, healthcare resume builder, first year nurse guide, clinical confidence, career transition healthcare, STAR interview framework, new grad paramedic, new grad respiratory therapist, new grad certification prep"
        canonicalPath="/new-graduate-support"
        structuredData={collectionStructuredData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "New Graduate Support", url: "https://www.nursenest.ca/new-graduate-support" },
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <LocaleLink href="/" className="hover:text-blue-600">{t("pages.newGraduateSupportHub.home")}</LocaleLink>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-indigo-700 font-medium">{t("pages.newGraduateSupportHub.newGraduateSupport")}</span>
        </div>

        <section className="mb-12" data-testid="section-new-grad-hero">
          <div className="bg-gradient-to-br from-indigo-50 via-blue-50/50 to-white rounded-2xl border border-indigo-100 p-8 sm:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                <GraduationCap className="w-7 h-7 text-indigo-600" />
              </div>
              <div>
                <Badge variant="outline" className="mb-2 text-xs border-indigo-200 text-indigo-700" data-testid="badge-new-grad-hub">
                  Career Launch Platform
                </Badge>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight" data-testid="text-new-grad-h1">
                  New Graduate Support Hub
                </h1>
              </div>
            </div>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-4xl" data-testid="text-new-grad-intro">
              Bridge the gap between school and confident clinical practice. Access interview preparation tools, resume builders, cover letter generators, first-year survival guides, and clinical confidence resources — all designed specifically for new healthcare graduates entering the workforce.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/80 rounded-xl border border-slate-200/60 p-4 text-center" data-testid="stat-interview-questions">
                <p className="text-lg sm:text-xl font-bold text-gray-900">100+</p>
                <p className="text-xs text-slate-500 mt-1">{t("pages.newGraduateSupportHub.interviewQuestions")}</p>
              </div>
              <div className="bg-white/80 rounded-xl border border-slate-200/60 p-4 text-center" data-testid="stat-resume-templates">
                <p className="text-lg sm:text-xl font-bold text-gray-900">15+</p>
                <p className="text-xs text-slate-500 mt-1">{t("pages.newGraduateSupportHub.resumeTemplates")}</p>
              </div>
              <div className="bg-white/80 rounded-xl border border-slate-200/60 p-4 text-center" data-testid="stat-career-modules">
                <p className="text-lg sm:text-xl font-bold text-gray-900">5</p>
                <p className="text-xs text-slate-500 mt-1">{t("pages.newGraduateSupportHub.careerModules")}</p>
              </div>
              <div className="bg-white/80 rounded-xl border border-slate-200/60 p-4 text-center" data-testid="stat-professions-supported">
                <p className="text-lg sm:text-xl font-bold text-gray-900">8+</p>
                <p className="text-xs text-slate-500 mt-1">{t("pages.newGraduateSupportHub.professions")}</p>
              </div>
            </div>
          </div>
        </section>

        {NEW_GRAD_RESOURCES.map((section, sIdx) => (
          <section key={sIdx} className="mb-10" data-testid={`section-resources-${sIdx}`}>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{section.category}</h2>
              <Badge className={`text-xs ${section.badgeColor}`}>{section.badge}</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <LocaleLink key={idx} href={item.href}>
                    <Card className="h-full hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group" data-testid={`card-resource-${sIdx}-${idx}`}>
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                            <Icon className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors mb-1">{item.title}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 shrink-0 mt-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </LocaleLink>
                );
              })}
            </div>
          </section>
        ))}

        <section className="mb-12" data-testid="section-exam-prep-links">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{t("pages.newGraduateSupportHub.continueYourExamPreparation")}</h2>
          <p className="text-sm text-slate-600 mb-5">{t("pages.newGraduateSupportHub.stillStudyingForYourLicensing")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {EXAM_PREP_CROSS_LINKS.map((link, idx) => (
              <LocaleLink key={idx} href={link.href}>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200/60 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group" data-testid={`link-exam-prep-${idx}`}>
                  <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{link.title}</p>
                    <p className="text-xs text-slate-500 truncate">{link.description}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 shrink-0" />
                </div>
              </LocaleLink>
            ))}
          </div>
        </section>

        <div className="mb-12">
          <p className="text-sm text-slate-600 leading-relaxed">
            Looking to advance your career with graduate program applications or professional scholarships? <a href="https://applynest.ca" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-medium hover:underline" data-testid="link-applynest-newgrad-support">{t("pages.newGraduateSupportHub.applynestProvidesApplicationPreparationAnd")}</a> designed for healthcare professionals.
          </p>
        </div>

        <section className="mb-12" data-testid="section-cross-links">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">{t("pages.newGraduateSupportHub.exploreMore")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LocaleLink href="/exam-prep">
              <Card className="h-full hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group" data-testid="card-cross-exam-prep">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{t("pages.newGraduateSupportHub.examPrepHub")}</h3>
                      <p className="text-xs text-slate-500 mt-1">{t("pages.newGraduateSupportHub.allExamPreparationResourcesOrganized")}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 shrink-0 mt-1" />
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
                      <h3 className="font-semibold text-gray-900 text-sm group-hover:text-purple-600 transition-colors">{t("pages.newGraduateSupportHub.healthcareCareers")}</h3>
                      <p className="text-xs text-slate-500 mt-1">{t("pages.newGraduateSupportHub.exploreCareerPathsSalaryInformation")}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            </LocaleLink>
          </div>
        </section>

        <section className="mb-12" data-testid="section-new-grad-faq">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t("pages.newGraduateSupportHub.frequentlyAskedQuestions")}</h2>
            <LocaleLink
              href="/new-grad/faq"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
              data-testid="link-new-grad-full-faq"
            >
              View Full FAQ <ArrowRight className="w-3.5 h-3.5" />
            </LocaleLink>
          </div>
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

        <section data-testid="section-new-grad-cta">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 sm:p-10 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Ready to Launch Your Healthcare Career?
            </h2>
            <p className="text-indigo-100 text-sm sm:text-base mb-6 max-w-2xl mx-auto">
              Start with the readiness quiz to identify your strengths and gaps, then use the career tools and exam prep resources to build confidence for your transition.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <LocaleLink href="/newgrad">
                <Button className="bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-2.5 font-semibold" data-testid="button-new-grad-explore">
                  Explore Full New Grad Hub
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </LocaleLink>
              <LocaleLink href="/exam-prep">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-6 py-2.5" data-testid="button-new-grad-exam-prep">
                  Browse Exam Prep
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
