import { useState } from "react";
import { LocaleLink } from "@/lib/LocaleLink";
import { useLocation } from "wouter";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { buildFaqStructuredData } from "@/lib/structured-data";
import {
  nursingSkillChecklists,
  getChecklistsByCategory,
  CHECKLIST_CATEGORIES,
  type ChecklistCategory,
} from "@/data/nursing-skill-checklists";
import {
  BookOpen,
  ChevronRight,
  ArrowRight,
  Clock,
  ClipboardCheck,
  ShieldAlert,
  Stethoscope,
  Activity,
  Droplet,
  Syringe,
  Wind,
} from "lucide-react";

const CATEGORY_ICONS: Record<ChecklistCategory, typeof Syringe> = {
  "Vascular Access": Syringe,
  "Wound Management": ShieldAlert,
  "Respiratory": Wind,
  "Transfusion": Droplet,
};

const DIFFICULTY_COLORS = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced: "bg-red-100 text-red-700",
};

const CATEGORY_COLORS: Record<ChecklistCategory, string> = {
  "Vascular Access": "bg-blue-100 text-blue-700",
  "Wound Management": "bg-orange-100 text-orange-700",
  "Respiratory": "bg-teal-100 text-teal-700",
  "Transfusion": "bg-red-100 text-red-700",
};

export default function NursingSkillChecklistsHub() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<ChecklistCategory | null>(null);

  const filtered = selectedCategory
    ? getChecklistsByCategory(selectedCategory)
    : nursingSkillChecklists;

  const faqData = [
    { question: "What are nursing skill checklists used for?", answer: "Nursing skill checklists provide step-by-step procedural guides that help nurses perform clinical procedures safely and consistently. They serve as reference tools during training, competency verification, and clinical practice. Each checklist includes the procedure steps, nursing rationale, safety alerts, and documentation requirements." },
    { question: "Are these checklists aligned with NCLEX exam content?", answer: "Yes. Each checklist includes exam preparation notes that highlight the key concepts, safety considerations, and clinical decision-making points that are commonly tested on the NCLEX-RN and NCLEX-PN exams. Understanding procedural rationale is critical for NCLEX success." },
    { question: "Can I use these checklists in clinical practice?", answer: "These checklists are educational reference guides designed for nursing students and new graduates. Always follow your facility's specific policies and procedures, as protocols may vary between institutions. These checklists are based on current evidence-based guidelines and standards of practice." },
    { question: "How do I prepare for clinical skills checkoffs?", answer: "Review the step-by-step procedure, understand the rationale for each step, practice the skill in simulation lab, memorize safety considerations and critical steps, and review common mistakes to avoid. Our checklists highlight critical points that are often evaluated during competency assessments." },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Nursing Skill Checklists – Clinical Procedure Guides",
    "description": "Step-by-step nursing skill checklists for IV insertion, central line care, wound dressing, oxygen therapy, and blood transfusion. Includes rationale, safety alerts, and NCLEX exam tips.",
    "url": "https://www.nursenest.ca/nursing-skill-checklists",
    "numberOfItems": nursingSkillChecklists.length,
    "provider": { "@type": "Organization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
  };

  return (
    <>
      <SEO
        title={t("pages.nursingSkillChecklistsHub.nursingSkillChecklistsClinicalProcedure")}
        description={t("pages.nursingSkillChecklistsHub.stepbystepNursingSkillChecklistsFor")}
        keywords="nursing skill checklists, clinical procedures, IV insertion checklist, central line care, wound dressing procedure, oxygen therapy, blood transfusion procedure, nursing skills, NCLEX clinical skills"
        canonicalPath="/nursing-skill-checklists"
        structuredData={structuredData}
        additionalStructuredData={[buildFaqStructuredData(faqData)]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Nursing Skill Checklists", url: "https://www.nursenest.ca/nursing-skill-checklists" },
        ]}
      />
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        <section className="relative py-14 sm:py-18 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50/30 to-white border-b" data-testid="section-hero">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <BreadcrumbNav
              items={[
                { name: "Home", url: "https://www.nursenest.ca/" },
                { name: t("skillChecklists.breadcrumb"), url: "https://www.nursenest.ca/nursing-skill-checklists" },
              ]}
            />
            <div className="mt-6">
              <Badge className="mb-4 bg-blue-100 text-blue-700" data-testid="badge-reference">
                <ClipboardCheck className="w-3 h-3 mr-1" /> {t("skillChecklists.badge")}
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-page-title">
                {t("skillChecklists.title")}
              </h1>
              <p className="text-lg text-gray-600 mb-6 max-w-3xl" data-testid="text-page-description">
                {t("skillChecklists.description")}
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1"><ClipboardCheck className="w-4 h-4 text-blue-500" /> {nursingSkillChecklists.length} Procedures</span>
                <span className="flex items-center gap-1"><ShieldAlert className="w-4 h-4 text-blue-500" /> {t("pages.nursingSkillChecklistsHub.safetyAlerts")}</span>
                <span className="flex items-center gap-1"><Stethoscope className="w-4 h-4 text-blue-500" /> {t("pages.nursingSkillChecklistsHub.evidencebased")}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap gap-2 mb-6" data-testid="filter-categories">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              data-testid="button-category-all"
            >
              All Procedures
            </Button>
            {CHECKLIST_CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat];
              return (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                  data-testid={`button-category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <Icon className="w-3.5 h-3.5 mr-1" />
                  {cat}
                  <span className="ml-1 text-xs opacity-70">({getChecklistsByCategory(cat).length})</span>
                </Button>
              );
            })}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((checklist) => {
              const CatIcon = CATEGORY_ICONS[checklist.category];
              return (
                <Card
                  key={checklist.slug}
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-blue-300"
                  onClick={() => setLocation(`/nursing-skill-checklists/${checklist.slug}`)}
                  data-testid={`card-checklist-${checklist.slug}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                        <CatIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-700 transition-colors" data-testid={`text-title-${checklist.slug}`}>
                          {checklist.shortTitle}
                        </h3>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <Badge className={`text-[10px] px-1.5 py-0 ${CATEGORY_COLORS[checklist.category]}`}>
                            {checklist.category}
                          </Badge>
                          <Badge className={`text-[10px] px-1.5 py-0 ${DIFFICULTY_COLORS[checklist.difficulty]}`}>
                            {checklist.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-3 mb-3">{checklist.overview}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{checklist.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClipboardCheck className="w-3 h-3" />
                        <span>{checklist.steps.length} steps</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <section className="py-12 bg-gray-50 border-t" data-testid="section-faq">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("skillChecklists.faqTitle")}</h2>
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

        <section className="py-12 bg-white" data-testid="section-related">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("skillChecklists.relatedResources")}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <LocaleLink href="/medical-abbreviations-for-nurses" className="block" data-testid="link-abbreviations">
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-4 text-center">
                    <Stethoscope className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                    <h3 className="font-semibold text-sm text-gray-900 mb-1">{t("skillChecklists.linkAbbreviations")}</h3>
                    <p className="text-xs text-gray-500">{t("skillChecklists.linkAbbreviationsDesc")}</p>
                  </CardContent>
                </Card>
              </LocaleLink>
              <LocaleLink href="/clinical-skills" className="block" data-testid="link-clinical-skills">
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-4 text-center">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <h3 className="font-semibold text-sm text-gray-900 mb-1">{t("skillChecklists.linkClinicalSkills")}</h3>
                    <p className="text-xs text-gray-500">{t("skillChecklists.linkClinicalSkillsDesc")}</p>
                  </CardContent>
                </Card>
              </LocaleLink>
              <LocaleLink href="/practice-questions" className="block" data-testid="link-practice">
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-4 text-center">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                    <h3 className="font-semibold text-sm text-gray-900 mb-1">{t("skillChecklists.linkPractice")}</h3>
                    <p className="text-xs text-gray-500">{t("skillChecklists.linkPracticeDesc")}</p>
                  </CardContent>
                </Card>
              </LocaleLink>
              <LocaleLink href="/glossary" className="block" data-testid="link-glossary">
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-4 text-center">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <h3 className="font-semibold text-sm text-gray-900 mb-1">{t("skillChecklists.linkGlossary")}</h3>
                    <p className="text-xs text-gray-500">{t("skillChecklists.linkGlossaryDesc")}</p>
                  </CardContent>
                </Card>
              </LocaleLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
