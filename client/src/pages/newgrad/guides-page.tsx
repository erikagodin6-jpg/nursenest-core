import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PremiumUpgradeCTA } from "./premium-cta";
import { useI18n } from "@/lib/i18n";
import {
  ChevronRight, ArrowRight, BookOpen, GraduationCap, Lock, CheckCircle2
} from "lucide-react";

export default function GuidesPage() {
  const { t } = useI18n();

  const GUIDE_CATEGORIES = [
    { id: "transition-to-practice", titleKey: "newGrad.guides.cat1Title", descKey: "newGrad.guides.cat1Desc" },
    { id: "shift-organization", titleKey: "newGrad.guides.cat2Title", descKey: "newGrad.guides.cat2Desc" },
    { id: "documentation-tips", titleKey: "newGrad.guides.cat3Title", descKey: "newGrad.guides.cat3Desc" },
    { id: "communication", titleKey: "newGrad.guides.cat4Title", descKey: "newGrad.guides.cat4Desc" },
    { id: "workplace-boundaries", titleKey: "newGrad.guides.cat5Title", descKey: "newGrad.guides.cat5Desc" },
    { id: "burnout-prevention", titleKey: "newGrad.guides.cat6Title", descKey: "newGrad.guides.cat6Desc" },
    { id: "professional-growth", titleKey: "newGrad.guides.cat7Title", descKey: "newGrad.guides.cat7Desc" },
    { id: "career-pathways", titleKey: "newGrad.guides.cat8Title", descKey: "newGrad.guides.cat8Desc" },
    { id: "continuing-education", titleKey: "newGrad.guides.cat9Title", descKey: "newGrad.guides.cat9Desc" },
    { id: "leadership-development", titleKey: "newGrad.guides.cat10Title", descKey: "newGrad.guides.cat10Desc" },
  ];

  const { data: guides = [] } = useQuery({
    queryKey: ["/api/new-grad/guides", "all"],
    queryFn: async () => {
      const res = await fetch("/api/new-grad/guides?status=published");
      return res.ok ? res.json() : [];
    },
  });

  return (
    <div data-testid="newgrad-guides-page">
      <Navigation />
      <SEO
        title={t("newGrad.guides.seoTitle")}
        description={t("newGrad.guides.seoDescription")}
        keywords="new grad nurse guides, new nurse survival guide, first year nurse tips, new nurse documentation tips, new grad nurse career guide"
        canonicalPath="/newgrad/guides"
        breadcrumbs={[
          { name: t("newGrad.common.home"), url: "https://www.nursenest.ca" },
          { name: t("newGrad.common.newGradCareerHub"), url: "https://www.nursenest.ca/newgrad" },
          { name: t("newGrad.guides.badge"), url: "https://www.nursenest.ca/newgrad/guides" },
        ]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/30 to-white" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">{t("newGrad.common.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/newgrad" className="hover:text-blue-600">{t("newGrad.common.newGradCareerHub")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-blue-700 font-medium">{t("newGrad.guides.badge")}</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-blue-100 text-blue-700">
            <BookOpen className="w-4 h-4" /> {t("newGrad.guides.badge")}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" data-testid="text-title">
            {t("newGrad.guides.title")}
          </h1>
          <p className="text-lg text-gray-600" data-testid="text-subtitle">
            {t("newGrad.guides.subtitle")}
          </p>
        </div>
      </section>

      <section className="py-16" data-testid="section-guide-categories">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("newGrad.guides.categoriesTitle")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GUIDE_CATEGORIES.map((cat, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition-all" data-testid={`card-guide-category-${i}`}>
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{t(cat.titleKey)}</h3>
                    <p className="text-sm text-gray-500">{t(cat.descKey)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {guides.length > 0 && (
        <section className="py-16 bg-gray-50" data-testid="section-published-guides">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("newGrad.guides.publishedTitle")}</h2>
            <div className="space-y-3">
              {guides.map((guide: any) => (
                <Link key={guide.id} href={`/new-grad/guides/${guide.slug}`} className="block group" data-testid={`link-guide-${guide.id}`}>
                  <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors truncate">{guide.title}</h3>
                          {guide.is_premium && <Lock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
                        </div>
                        <p className="text-sm text-gray-500 truncate">{guide.summary}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{guide.guide_type}</span>
                          {guide.category && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{guide.category}</span>}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 shrink-0 ml-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PremiumUpgradeCTA requiredEntitlement="toolkit" context="Upgrade to access premium guides with advanced career strategies, detailed clinical scenarios, and exclusive professional development content." />
      </div>

      <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50" data-testid="section-bottom-cta">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">{t("newGrad.guides.exploreMore")}</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/newgrad/interview" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors border border-blue-200" data-testid="link-interview">
              {t("newGrad.common.interviewPrep")}
            </Link>
            <Link href="/newgrad/resume" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors border border-blue-200" data-testid="link-resume">
              {t("newGrad.common.resumeTools")}
            </Link>
            <Link href="/newgrad/certifications" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors border border-blue-200" data-testid="link-certifications">
              {t("newGrad.common.certifications")}
            </Link>
            <Link href="/newgrad/clinical-references" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors border border-blue-200" data-testid="link-clinical-refs">
              {t("newGrad.common.clinicalReferences")}
            </Link>
            <Link href="/newgrad" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors" data-testid="link-hub">
              {t("newGrad.common.careerHub")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
