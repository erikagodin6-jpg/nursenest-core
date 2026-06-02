import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PremiumUpgradeCTA } from "./premium-cta";
import { useI18n } from "@/lib/i18n";
import { ChevronRight, ArrowRight, type LucideIcon } from "lucide-react";

const COLOR_GRADIENTS: Record<string, string> = {
  blue: "from-blue-50 via-blue-50/30 to-white",
  emerald: "from-emerald-50 via-emerald-50/30 to-white",
  orange: "from-orange-50 via-orange-50/30 to-white",
  amber: "from-amber-50 via-amber-50/30 to-white",
  purple: "from-purple-50 via-purple-50/30 to-white",
  pink: "from-pink-50 via-pink-50/30 to-white",
  green: "from-green-50 via-green-50/30 to-white",
  indigo: "from-indigo-50 via-indigo-50/30 to-white",
};

interface CategorySection {
  title: string;
  content: string;
  items?: string[];
}

interface CategoryPageProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  canonicalPath: string;
  sections: CategorySection[];
  tips?: { title: string; desc: string }[];
  mistakes?: { title: string; desc: string }[];
  premiumContext?: string;
  children?: React.ReactNode;
}

export function CategoryPageLayout({
  title, subtitle, icon: Icon, color, seoTitle, seoDescription, seoKeywords,
  canonicalPath, sections, tips, mistakes, premiumContext, children,
}: CategoryPageProps) {
  const { t } = useI18n();

  return (
    <div data-testid={`newgrad-category-${canonicalPath.split('/').pop()}`}>
      <Navigation />
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonicalPath={canonicalPath}
        breadcrumbs={[
          { name: t("newGrad.common.home"), url: "https://www.nursenest.ca" },
          { name: t("newGrad.common.newGradCareerHub"), url: "https://www.nursenest.ca/newgrad" },
          { name: title, url: `https://www.nursenest.ca${canonicalPath}` },
        ]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-category-hero">
        <div className={`absolute inset-0 bg-gradient-to-br ${COLOR_GRADIENTS[color] || COLOR_GRADIENTS.blue}`} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">{t("newGrad.common.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/newgrad" className="hover:text-blue-600">{t("newGrad.common.newGradCareerHub")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-blue-700 font-medium">{title}</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-blue-100 text-blue-700">
            <Icon className="w-4 h-4" />
            {title}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" data-testid="text-category-title">{title}</h1>
          <p className="text-lg text-gray-600" data-testid="text-category-subtitle">{subtitle}</p>
        </div>
      </section>

      <section className="py-16" data-testid="section-category-content">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {sections.map((section, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-sm transition-all" data-testid={`section-content-${i}`}>
                <h2 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h2>
                <p className="text-gray-600 leading-relaxed mb-4">{section.content}</p>
                {section.items && section.items.length > 0 && (
                  <ul className="space-y-2">
                    {section.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {tips && tips.length > 0 && (
        <section className="py-16 bg-gray-50" data-testid="section-tips">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("newGrad.common.practicalTips")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tips.map((tip, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-5" data-testid={`tip-${i}`}>
                  <h3 className="font-semibold text-gray-900 mb-2">{tip.title}</h3>
                  <p className="text-sm text-gray-500">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {mistakes && mistakes.length > 0 && (
        <section className="py-16" data-testid="section-mistakes">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("newGrad.common.commonMistakes")}</h2>
            <div className="space-y-3">
              {mistakes.map((m, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-5" data-testid={`mistake-${i}`}>
                  <h3 className="font-semibold text-gray-900 mb-1">{m.title}</h3>
                  <p className="text-sm text-gray-500">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {children}

      <PremiumUpgradeCTA requiredEntitlement="toolkit" context={premiumContext} />

      <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50" data-testid="section-category-bottom-cta">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">{t("newGrad.common.exploreMoreCareerResources")}</h2>
          <p className="text-gray-600 mb-6">{t("newGrad.common.browseLibrary")}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/newgrad/clinical-references" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors border border-blue-200" data-testid="link-clinical-refs">
              {t("newGrad.common.clinicalReferences")}
            </Link>
            <Link href="/newgrad/certifications" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors border border-blue-200" data-testid="link-certifications">
              {t("newGrad.common.certifications")}
            </Link>
            <Link href="/newgrad" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors" data-testid="button-back-to-hub">
              {t("newGrad.common.backToCareerHub")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
