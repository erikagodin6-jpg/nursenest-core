import { Link } from "wouter";
import {
  ChevronRight, ArrowRight, BookOpen, GraduationCap, DollarSign,
  TrendingUp, Briefcase, Award, CheckCircle2
} from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";
import { CAREER_SUBPAGE_DATA } from "@/allied/data/career-subpage-data";
import { PROFESSION_HUB_DATA } from "@/allied/data/profession-hub-data";

import { useI18n } from "@/lib/i18n";
interface CareerGuideSubpageProps {
  careerSlug: string;
}

export default function CareerGuideSubpage({ careerSlug }: CareerGuideSubpageProps) {
  const { t } = useI18n();
  const subpageData = CAREER_SUBPAGE_DATA[careerSlug];
  const hubData = PROFESSION_HUB_DATA[careerSlug];
  if (!subpageData || !hubData) return null;

  const guide = subpageData.careerGuide;
  const basePath = `/allied-health/${careerSlug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `How to Become a ${hubData.name} — Career Guide`,
    description: guide.overview,
    author: { "@type": "Organization", name: "NurseNest Allied" },
    publisher: { "@type": "Organization", name: "NurseNest Allied", url: "https://www.nursenest.ca/allied-health" },
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Allied Health", item: "https://www.nursenest.ca/allied-health" },
      { "@type": "ListItem", position: 2, name: hubData.shortName, item: `https://www.nursenest.ca${basePath}` },
      { "@type": "ListItem", position: 3, name: "Career Guide", item: `https://www.nursenest.ca${basePath}/career-guide` },
    ],
  };

  return (
    <div data-testid={`career-guide-page-${careerSlug}`}>
      <AlliedSEO
        title={`${hubData.name} Career Guide — Education, Certification & Salary | NurseNest Allied`}
        description={`Complete career guide for ${hubData.name}. Learn about education requirements, ${hubData.examInfo.examNames.join(", ")} certification, salary range (${hubData.salaryRange}), job outlook, and career advancement.`}
        keywords={`${hubData.shortName} career guide, how to become a ${hubData.name.toLowerCase()}, ${hubData.shortName} salary, ${hubData.shortName} certification, ${hubData.shortName} education requirements`}
        canonicalPath={`${basePath}/career-guide`}
        structuredData={structuredData}
        additionalStructuredData={[breadcrumbData]}
      />

      <section className="bg-gradient-to-br from-gray-50 via-white to-gray-50/30 py-12 sm:py-16" style={{ background: `linear-gradient(135deg, ${hubData.colorAccent}40, white, ${hubData.colorAccent}20)` }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumbs">
            <Link href="/allied-health" className="hover:text-gray-700">{t("allied.careerGuideSubpage.alliedHealth")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={basePath} className="hover:text-gray-700">{hubData.shortName}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-medium" style={{ color: hubData.color }}>{t("allied.careerGuideSubpage.careerGuide")}</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: hubData.colorAccent, color: hubData.color }}>
            <GraduationCap className="w-4 h-4" />
            Career Guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" data-testid="text-page-title">
            {hubData.name} Career Guide
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">{guide.overview}</p>
        </div>
      </section>

      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <DollarSign className="w-5 h-5 flex-shrink-0" style={{ color: hubData.color }} />
              <div>
                <div className="text-xs text-gray-500 font-medium">{t("allied.careerGuideSubpage.salaryRange")}</div>
                <div className="text-sm font-semibold text-gray-900">{hubData.salaryRange}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <TrendingUp className="w-5 h-5 flex-shrink-0" style={{ color: hubData.color }} />
              <div>
                <div className="text-xs text-gray-500 font-medium">{t("allied.careerGuideSubpage.jobOutlook")}</div>
                <div className="text-sm font-semibold text-gray-900">{hubData.jobOutlook}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <Award className="w-5 h-5 flex-shrink-0" style={{ color: hubData.color }} />
              <div>
                <div className="text-xs text-gray-500 font-medium">{t("allied.careerGuideSubpage.certifications")}</div>
                <div className="text-sm font-semibold text-gray-900">{hubData.examInfo.examNames.join(", ")}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <Briefcase className="w-5 h-5 flex-shrink-0" style={{ color: hubData.color }} />
              <div>
                <div className="text-xs text-gray-500 font-medium">{t("allied.careerGuideSubpage.examDomains")}</div>
                <div className="text-sm font-semibold text-gray-900">{hubData.domains.length} areas</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-10">
          {guide.sections.map((section, i) => (
            <div key={i} className="scroll-mt-20" data-testid={`section-guide-${i}`}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: hubData.colorAccent }}>
                  <span className="text-sm font-bold" style={{ color: hubData.color }}>{i + 1}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
              </div>
              <div className="pl-11">
                <p className="text-gray-600 leading-relaxed">{section.content}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Explore {hubData.shortName} Study Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Study Topics", href: `${basePath}/study`, icon: BookOpen },
              { label: "Flashcards", href: `${basePath}/flashcards`, icon: BookOpen },
              { label: "Practice Exams", href: `${basePath}/exams`, icon: BookOpen },
              { label: "Hub Overview", href: basePath, icon: GraduationCap },
            ].map(item => (
              <Link key={item.label} href={item.href} className="group flex items-center gap-3 bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all" data-testid={`link-resource-${item.label.toLowerCase().replace(/\s+/g, "-")}`}>
                <item.icon className="w-5 h-5" style={{ color: hubData.color }} />
                <span className="text-sm font-medium text-gray-900 group-hover:text-gray-700">{item.label}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-auto text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12" style={{ background: `linear-gradient(to bottom, ${hubData.colorAccent}40, white)` }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your {hubData.shortName} Journey?</h2>
          <p className="text-gray-600 mb-6">{t("allied.careerGuideSubpage.takeAFreeDiagnosticTo")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={`/diagnostic?career=${hubData.careerSlug}`} className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold hover:opacity-90 transition-colors shadow-lg" style={{ backgroundColor: hubData.color }} data-testid="button-cta-diagnostic">
              Start Free Diagnostic <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/allied-health/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl font-semibold hover:bg-gray-50 transition-colors border border-gray-200 text-gray-700" data-testid="button-cta-pricing">
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
