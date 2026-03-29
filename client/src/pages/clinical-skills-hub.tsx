import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import {
  CLINICAL_SKILLS_GUIDES,
  CLINICAL_SKILLS_GUIDE_CATEGORIES,
  getClinicalSkillGuidesByCategory,
  type ClinicalSkillGuide,
} from "@/data/clinical-skills-guides";
import {
  Search,
  BookOpen,
  ArrowRight,
  Clock,
  Users,
  ChevronRight,
  Pill,
  MessageCircle,
  Activity,
  Shield,
  HeartPulse,
  ShieldAlert,
  ShieldCheck,
  Droplet,
  Syringe,
  ClipboardCheck,
  FileText,
  AlertTriangle,
  Scale,
  LayoutGrid,
  Zap,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Pill, MessageCircle, Activity, Shield, HeartPulse, ShieldAlert, ShieldCheck,
  Droplet, Syringe, ClipboardCheck, FileText, AlertTriangle, Scale,
  LayoutGrid, Zap, Users, Clock, MessageSquare: MessageCircle, Bandage: ShieldCheck,
};

function getIcon(iconName: string): LucideIcon {

  return ICON_MAP[iconName] || BookOpen;
}

const DIFFICULTY_COLORS = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced: "bg-red-100 text-red-700",
};

const CATEGORY_COLORS = {
  core: "bg-blue-100 text-blue-700",
  safety: "bg-red-100 text-red-700",
  communication: "bg-purple-100 text-purple-700",
  assessment: "bg-teal-100 text-teal-700",
  specialized: "bg-orange-100 text-orange-700",
};

function SkillCard({ guide }: { guide: ClinicalSkillGuide }) {
  const [, setLocation] = useLocation();
  const Icon = getIcon(guide.icon);

  return (
    <Card
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-blue-300"
      onClick={() => setLocation(`/clinical-skills/${guide.slug}`)}
      data-testid={`card-skill-${guide.slug}`}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-700 transition-colors" data-testid={`text-title-${guide.slug}`}>
              {guide.title}
            </h3>
            <div className="flex flex-wrap gap-1.5 mb-2">
              <Badge className={`text-[10px] px-1.5 py-0 ${CATEGORY_COLORS[guide.category]}`}>
                {guide.category}
              </Badge>
              <Badge className={`text-[10px] px-1.5 py-0 ${DIFFICULTY_COLORS[guide.difficulty]}`}>
                {guide.difficulty}
              </Badge>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{guide.overview}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{guide.readTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{guide.applicableProfessions.length} professions</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function ClinicalSkillsHub() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = getClinicalSkillGuidesByCategory(selectedCategory).filter(guide => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      guide.title.toLowerCase().includes(term) ||
      guide.overview.toLowerCase().includes(term) ||
      guide.keywords.some(k => k.toLowerCase().includes(term)) ||
      guide.applicableProfessions.some(p => p.toLowerCase().includes(term))
    );
  });

  const faqData = [
    { question: "What clinical skills are most important for new healthcare graduates?", answer: "The most critical skills include medication administration safety, patient communication, vital signs assessment and interpretation, SBAR shift report communication, managing multiple patients, and handling emergencies. These foundational skills apply across nursing, paramedicine, respiratory therapy, and other healthcare professions." },
    { question: "How can I improve my clinical skills after graduation?", answer: "Practice deliberately during every shift, seek feedback from experienced colleagues, use structured frameworks and checklists, participate in simulation training, and study evidence-based guidelines. Our clinical skills guides provide practical tips and practice scenarios to help you develop confidence." },
    { question: "Are these clinical skills guides applicable to all healthcare professions?", answer: "Many clinical skills are universal across healthcare professions, including patient communication, documentation, infection control, and ethical decision-making. Some guides are more specific to certain professions, and each guide indicates which professions it applies to." },
    { question: "How do I handle my first emergency as a new graduate?", answer: "Preparation is key. Know your facility's rapid response and code blue activation criteria, familiarize yourself with emergency equipment locations, maintain current BLS/ACLS certification, and practice mental rehearsal. Our Handling Emergencies guide walks you through step-by-step responses for common emergency scenarios." },
  ];

  return (
    <div className="min-h-screen flex flex-col" data-testid="clinical-skills-hub">
      <Navigation />
      <SEO
        title={t("pages.clinicalSkillsHub.clinicalSkillsGuidesForHealthcare")}
        description={t("pages.clinicalSkillsHub.comprehensiveClinicalSkillsGuidesCovering")}
        keywords="clinical skills, nursing skills, healthcare skills guide, medication administration, patient communication, vital signs, infection control, new grad clinical skills"
        canonicalPath="/clinical-skills"
        additionalStructuredData={[
          buildFaqStructuredData(faqData),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Clinical Skills Guides",
            "description": "Comprehensive clinical skills guides for healthcare professionals and students",
            "url": "https://www.nursenest.ca/clinical-skills",
            "numberOfItems": CLINICAL_SKILLS_GUIDES.length,
            "provider": {
              "@type": "Organization",
              "name": "NurseNest",
              "url": "https://www.nursenest.ca"
            }
          }
        ]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Clinical Skills Guides", url: "https://www.nursenest.ca/clinical-skills" },
        ]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white border-b" data-testid="section-hero">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">{t("pages.clinicalSkillsHub.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-blue-700 font-medium">{t("pages.clinicalSkillsHub.clinicalSkillsGuides")}</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-blue-100 text-blue-700">
            <BookOpen className="w-4 h-4" />
            Practical Clinical Reference
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="page-title">
            Clinical Skills Guides
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-3xl">
            Comprehensive, evidence-based guides covering essential clinical skills for healthcare students and new graduates.
            From medication safety to emergency response, build confidence in your clinical practice.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1"><BookOpen className="w-4 h-4 text-blue-500" /> {CLINICAL_SKILLS_GUIDES.length} Guides</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4 text-blue-500" /> {t("pages.clinicalSkillsHub.multiprofession")}</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-blue-500" /> {t("pages.clinicalSkillsHub.evidencebased")}</span>
          </div>

          <div className="mt-8 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={t("pages.clinicalSkillsHub.searchSkillsEgMedicationSbar")}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
              data-testid="input-search"
            />
          </div>
        </div>
      </section>

      <section className="py-10" data-testid="section-guides">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {CLINICAL_SKILLS_GUIDE_CATEGORIES.map(cat => (
              <Button
                key={cat.key}
                variant={selectedCategory === cat.key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.key)}
                className={selectedCategory === cat.key ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
                data-testid={`button-category-${cat.key}`}
              >
                {cat.label}
                {cat.key !== "all" && (
                  <span className="ml-1 text-xs opacity-70">
                    ({getClinicalSkillGuidesByCategory(cat.key).length})
                  </span>
                )}
              </Button>
            ))}
          </div>

          <p className="text-sm text-gray-500 mb-4" data-testid="text-result-count">
            {filtered.length} guide{filtered.length !== 1 ? "s" : ""}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">{t("pages.clinicalSkillsHub.noGuidesFoundMatchingYour")}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(guide => (
                <SkillCard key={guide.slug} guide={guide} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("pages.clinicalSkillsHub.frequentlyAskedQuestions")}</h2>
          <div className="space-y-4">
            {faqData.map((faq, i) => (
              <details key={i} className="bg-white rounded-xl p-4 border border-gray-200 group" data-testid={`faq-${i}`}>
                <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  {faq.question}
                  <ChevronRight className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-90 flex-shrink-0" />
                </summary>
                <p className="text-gray-600 mt-3 text-sm leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-related-resources">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("pages.clinicalSkillsHub.relatedResources")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/new-grad" className="block" data-testid="link-new-grad-hub">
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">{t("pages.clinicalSkillsHub.newGradHub")}</h3>
                  <p className="text-xs text-gray-500">{t("pages.clinicalSkillsHub.professionspecificGuidesForNewGraduates")}</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/lessons" className="block" data-testid="link-lessons">
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="p-4 text-center">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">{t("pages.clinicalSkillsHub.studyLessons")}</h3>
                  <p className="text-xs text-gray-500">{t("pages.clinicalSkillsHub.indepthClinicalEducationContent")}</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/practice-questions" className="block" data-testid="link-practice">
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="p-4 text-center">
                  <ClipboardCheck className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">{t("pages.clinicalSkillsHub.practiceQuestions")}</h3>
                  <p className="text-xs text-gray-500">{t("pages.clinicalSkillsHub.testYourClinicalKnowledge")}</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/flashcards" className="block" data-testid="link-flashcards">
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="p-4 text-center">
                  <Activity className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">{t("pages.clinicalSkillsHub.flashcards")}</h3>
                  <p className="text-xs text-gray-500">{t("pages.clinicalSkillsHub.quickReviewOfClinicalConcepts")}</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
