import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PremiumUpgradeCTA } from "./premium-cta";
import { useI18n } from "@/lib/i18n";
import {
  SURVIVAL_GUIDE_CATEGORIES,
  CLINICAL_REFERENCE_LESSONS,
  getLessonsByCategory,
  type SurvivalGuideCategory,
} from "@/data/newgrad/clinical-reference-content";
import { NEWGRAD_GUIDES } from "@/data/newgrad/guide-content";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  GraduationCap,
  AlertTriangle,
  Clock,
  MessageSquare,
  TrendingUp,
  Zap,
  Lightbulb,
  CheckCircle2,
  Shield,
  Heart,
  Brain,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  AlertTriangle,
  Clock,
  MessageSquare,
  TrendingUp,
};

const GUIDE_SECTION_CATEGORY_MAP: Record<string, { category: SurvivalGuideCategory; guideSlug: string }> = {
  "transition-to-practice": { category: "professional-growth", guideSlug: "guides" },
  "shift-organization": { category: "shift-survival", guideSlug: "guides" },
  "documentation": { category: "communication-documentation", guideSlug: "guides" },
  "communication": { category: "communication-documentation", guideSlug: "guides" },
  "career-pathways": { category: "professional-growth", guideSlug: "career" },
  "continuing-education": { category: "professional-growth", guideSlug: "career" },
  "leadership-development": { category: "professional-growth", guideSlug: "career" },
  "workplace-dynamics": { category: "professional-growth", guideSlug: "workplace" },
  "professional-boundaries": { category: "professional-growth", guideSlug: "workplace" },
  "behavioral-questions": { category: "shift-survival", guideSlug: "interview" },
  "clinical-scenarios": { category: "shift-survival", guideSlug: "interview" },
  "resume-building": { category: "professional-growth", guideSlug: "resume" },
  "cover-letters": { category: "professional-growth", guideSlug: "resume" },
};

interface GuideSectionItem {
  id: string;
  title: string;
  overview: string;
  guideSlug: string;
}

function getGuideSectionsForCategory(categoryId: SurvivalGuideCategory): GuideSectionItem[] {
  const items: GuideSectionItem[] = [];
  for (const [sectionId, mapping] of Object.entries(GUIDE_SECTION_CATEGORY_MAP)) {
    if (mapping.category === categoryId) {
      const guide = NEWGRAD_GUIDES.find(g => g.slug === mapping.guideSlug);
      const section = guide?.sections.find(s => s.id === sectionId);
      if (section) {
        items.push({ id: section.id, title: section.title, overview: section.overview, guideSlug: mapping.guideSlug });
      }
    }
  }
  return items;
}

const TOTAL_FLASHCARDS = CLINICAL_REFERENCE_LESSONS.reduce((sum, l) => sum + l.flashcards.length, 0);

export default function SurvivalGuideLanding() {
  const { t } = useI18n();

  const BENEFITS = [
    { icon: Shield, titleKey: "newGrad.survivalGuide.benefit1Title", descKey: "newGrad.survivalGuide.benefit1Desc" },
    { icon: Brain, titleKey: "newGrad.survivalGuide.benefit2Title", descKey: "newGrad.survivalGuide.benefit2Desc" },
    { icon: Heart, titleKey: "newGrad.survivalGuide.benefit3Title", descKey: "newGrad.survivalGuide.benefit3Desc" },
    { icon: BookOpen, titleKey: "newGrad.survivalGuide.benefit4Title", descKey: "newGrad.survivalGuide.benefit4Desc" },
  ];

  const heroSubtitle = t("newGrad.survivalGuide.heroSubtitle")
    .replace("{{lessonCount}}", String(CLINICAL_REFERENCE_LESSONS.length))
    .replace("{{flashcardCount}}", String(TOTAL_FLASHCARDS));

  return (
    <div className="min-h-screen bg-gray-50" data-testid="survival-guide-landing">
      <Navigation />
      <SEO
        title={t("newGrad.survivalGuide.seoTitle")}
        description={t("newGrad.survivalGuide.seoDescription")}
        keywords="new grad nurse survival guide, new nurse survival guide, first year nurse tips, clinical reference nursing, new graduate nursing guide"
        canonicalPath="/newgrad/survival-guide"
        breadcrumbs={[
          { name: t("newGrad.common.home"), url: "https://www.nursenest.ca" },
          { name: t("newGrad.common.newGradCareerHub"), url: "https://www.nursenest.ca/newgrad" },
          { name: t("newGrad.common.survivalGuide"), url: "https://www.nursenest.ca/newgrad/survival-guide" },
        ]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-blue-50/50 to-indigo-50/30" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-blue-100/20 rounded-full blur-3xl" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">{t("newGrad.common.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/newgrad" className="hover:text-blue-600">{t("newGrad.common.newGradCareerHub")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-700 font-medium">{t("newGrad.common.survivalGuide")}</span>
          </div>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-emerald-100 text-emerald-700" data-testid="badge-survival-guide">
              <GraduationCap className="w-4 h-4" />
              {t("newGrad.survivalGuide.badge")}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 leading-tight" data-testid="text-hero-title">
              {t("newGrad.survivalGuide.heroTitle1")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">{t("newGrad.survivalGuide.heroTitle2")}</span> {t("newGrad.survivalGuide.heroTitle3")}
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed" data-testid="text-hero-subtitle">
              {heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#categories" onClick={(e) => { e.preventDefault(); document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' }); }} className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200" data-testid="button-explore-categories">
                {t("newGrad.survivalGuide.exploreCategories")} <ArrowRight className="w-4 h-4" />
              </a>
              <Link href="/newgrad/clinical-references" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-colors border border-emerald-200" data-testid="button-clinical-refs">
                {t("newGrad.common.clinicalReferences")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-y border-gray-100" data-testid="section-stats">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div data-testid="stat-lessons">
              <div className="text-2xl font-bold text-gray-900">{CLINICAL_REFERENCE_LESSONS.length}</div>
              <div className="text-sm text-gray-500">{t("newGrad.survivalGuide.statLessons")}</div>
            </div>
            <div data-testid="stat-flashcards">
              <div className="text-2xl font-bold text-gray-900">{TOTAL_FLASHCARDS}+</div>
              <div className="text-sm text-gray-500">{t("newGrad.survivalGuide.statFlashcards")}</div>
            </div>
            <div data-testid="stat-categories">
              <div className="text-2xl font-bold text-gray-900">4</div>
              <div className="text-sm text-gray-500">{t("newGrad.survivalGuide.statCategories")}</div>
            </div>
            <div data-testid="stat-guide-sections">
              <div className="text-2xl font-bold text-gray-900">10+</div>
              <div className="text-sm text-gray-500">{t("newGrad.survivalGuide.statSections")}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-how-it-helps">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-benefits-title">{t("newGrad.survivalGuide.benefitsTitle")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("newGrad.survivalGuide.benefitsDesc")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BENEFITS.map((b, i) => {
              const BIcon = b.icon;
              return (
                <div key={i} className="bg-gray-50 rounded-xl p-5 text-center" data-testid={`card-benefit-${i}`}>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                    <BIcon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t(b.titleKey)}</h3>
                  <p className="text-sm text-gray-500">{t(b.descKey)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" id="categories" data-testid="section-categories">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-categories-title">{t("newGrad.survivalGuide.categoriesTitle")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("newGrad.survivalGuide.categoriesDesc")}</p>
          </div>
          <div className="space-y-8">
            {SURVIVAL_GUIDE_CATEGORIES.map((cat) => {
              const CatIcon = ICON_MAP[cat.icon] || BookOpen;
              const clinicalLessons = getLessonsByCategory(cat.id);
              const guideSections = getGuideSectionsForCategory(cat.id);
              const totalFlashcards = clinicalLessons.reduce((sum, l) => sum + l.flashcards.length, 0);

              return (
                <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm" data-testid={`category-${cat.id}`}>
                  <div className="p-6 sm:p-8" style={{ borderLeft: `4px solid ${cat.color}` }}>
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: cat.colorAccent }}>
                        <CatIcon className="w-6 h-6" style={{ color: cat.color }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1" data-testid={`text-category-title-${cat.id}`}>{cat.title}</h3>
                        <p className="text-gray-600 text-sm">{cat.description}</p>
                        {(clinicalLessons.length > 0 || totalFlashcards > 0) && (
                          <div className="flex gap-3 mt-2">
                            {clinicalLessons.length > 0 && (
                              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: cat.colorAccent, color: cat.color }}>
                                <Lightbulb className="w-3 h-3" /> {clinicalLessons.length} lessons
                              </span>
                            )}
                            {totalFlashcards > 0 && (
                              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: cat.colorAccent, color: cat.color }}>
                                <Zap className="w-3 h-3" /> {totalFlashcards} {t("newGrad.survivalGuide.flashcards")}
                              </span>
                            )}
                            {guideSections.length > 0 && (
                              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: cat.colorAccent, color: cat.color }}>
                                <BookOpen className="w-3 h-3" /> {guideSections.length} guide sections
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {clinicalLessons.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">{t("newGrad.survivalGuide.clinicalLessons")}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {clinicalLessons.map((lesson) => (
                            <Link key={lesson.slug} href={`/newgrad/clinical-references/${lesson.slug}`} className="group" data-testid={`link-lesson-${lesson.slug}`}>
                              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: lesson.color }} />
                                <div className="flex-1 min-w-0">
                                  <span className="text-sm font-medium text-gray-900 group-hover:text-blue-700 block truncate">{lesson.title}</span>
                                  <span className="text-xs text-gray-500">{lesson.flashcards.length} {t("newGrad.survivalGuide.flashcards")}</span>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-500 shrink-0" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {guideSections.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">{t("newGrad.survivalGuide.guideSections")}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {guideSections.map((section) => (
                            <Link key={section.id} href={`/newgrad/${section.guideSlug}`} className="group" data-testid={`link-section-${section.id}`}>
                              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <BookOpen className="w-4 h-4 shrink-0" style={{ color: cat.color }} />
                                <div className="flex-1 min-w-0">
                                  <span className="text-sm font-medium text-gray-900 group-hover:text-blue-700 block truncate">{section.title}</span>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-500 shrink-0" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PremiumUpgradeCTA requiredEntitlement="toolkit" context="Unlock premium brain sheets, shift templates, documentation guides, and the full interview question bank to accelerate your new grad career." />
      </div>

      <section className="py-16 bg-gradient-to-r from-emerald-600 to-blue-600" data-testid="section-bottom-cta">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{t("newGrad.clinicalRef.buildConfidence")}</h2>
          <p className="text-emerald-100 mb-8">{t("newGrad.clinicalRef.buildConfidenceDesc")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/newgrad/clinical-references" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-colors" data-testid="button-bottom-clinical">
              {t("newGrad.common.clinicalReferences")}
            </Link>
            <Link href="/newgrad" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-400 transition-colors border border-emerald-400" data-testid="button-bottom-hub">
              {t("newGrad.common.careerHub")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
