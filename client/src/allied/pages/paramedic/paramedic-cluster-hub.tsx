import type { ComponentType } from "react";
import { useParams, Link } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import { Breadcrumbs, ConversionCTA, FAQAccordion } from "@/allied/components/paramedic-seo-components";
import { FinalCTASection } from "./components";
import { PARAMEDIC_CLUSTERS, getClusterBySlug } from "@/allied/data/paramedic-cluster-data";
import { useI18n } from "@/lib/i18n";
import {
  AlertTriangle, ClipboardCheck, Pill, Activity, ArrowRight,
  BookOpen, Lock, Target, ChevronRight
} from "lucide-react";

const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  AlertTriangle,
  ClipboardCheck,
  Pill,
  Activity,
};

function getClusterIcon(iconName: string) {
  return ICON_MAP[iconName] || Activity;
}

export function ParamedicClusterIndex() {
  const { t } = useI18n();

  const breadcrumbs = [
    { label: t("paramedic.breadcrumb.home"), href: "/" },
    { label: t("paramedic.breadcrumb.paramedic"), href: "/allied-health/paramedic" },
    { label: t("paramedic.cluster.indexTitle"), href: "#" },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("paramedic.cluster.indexTitle"),
    description: t("paramedic.cluster.indexDescription"),
    publisher: { "@type": "Organization", name: "NurseNest" },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: PARAMEDIC_CLUSTERS.map((cluster, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: cluster.title,
        url: `https://www.nursenest.ca/allied-health/paramedic/cluster/${cluster.slug}`,
      })),
    },
  };

  return (
    <div data-testid="paramedic-cluster-index">
      <AlliedSEO
        title={t("allied.paramedicParamedicClusterHub.paramedicClinicalContentClustersEmergency")}
        description={t("allied.paramedicParamedicClusterHub.exploreParamedicClinicalContentOrganized")}
        keywords="paramedic clinical content, EMS study topics, paramedic exam clusters, emergency conditions paramedic, paramedic ECG"
        canonicalPath="/allied-health/paramedic/clusters"
        structuredData={structuredData}
      />

      <Breadcrumbs items={breadcrumbs} />

      <section className="bg-gradient-to-br from-red-50 via-white to-purple-50 border-b border-gray-100 py-12 px-4" data-testid="section-cluster-hero">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="text-cluster-index-title">
            {t("paramedic.cluster.indexTitle")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" data-testid="text-cluster-index-desc">
            {t("paramedic.cluster.indexDescription")}
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white" data-testid="section-clusters">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PARAMEDIC_CLUSTERS.map(cluster => {
              const Icon = getClusterIcon(cluster.icon);
              return (
                <Link
                  key={cluster.slug}
                  href={`/allied-health/paramedic/cluster/${cluster.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-teal-200 transition-all"
                  data-testid={`card-cluster-${cluster.slug}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: `${cluster.color}15` }}>
                      <Icon className="w-6 h-6" style={{ color: cluster.color }} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 group-hover:text-teal-700 transition-colors mb-2">
                        {cluster.title}
                      </h2>
                      <p className="text-sm text-gray-600 mb-3">{cluster.description.slice(0, 150)}...</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Target className="w-4 h-4" />
                        <span>{cluster.topics.length} topics</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-teal-500 transition-colors flex-shrink-0 mt-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <ConversionCTA
        title={t("paramedic.cta.unlockBank")}
        description={t("paramedic.cta.unlockBankSub")}
        ctaText={t("paramedic.cta.startDiagnostic")}
        ctaHref="/allied-health/diagnostic?career=paramedic"
      />

      <FinalCTASection
        title={t("paramedic.cta.masterExam")}
        subtitle={t("paramedic.cta.masterExamSub")}
        primaryCTA={{ label: t("paramedic.cta.startDiagnostic"), href: "/allied-health/diagnostic?career=paramedic" }}
        secondaryCTA={{ label: t("paramedic.cta.viewPricing"), href: "/allied-health/pricing" }}
      />
    </div>
  );
}

export default function ParamedicClusterHub() {
  const params = useParams<{ clusterSlug: string }>();
  const { t } = useI18n();
  const cluster = getClusterBySlug(params.clusterSlug || "");

  if (!cluster) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.paramedicParamedicClusterHub.clusterNotFound")}</h1>
        <p className="text-gray-600 mb-4">{t("allied.paramedicParamedicClusterHub.theContentClusterYoureLooking")}</p>
        <Link href="/allied-health/paramedic/clusters" className="inline-block px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700" data-testid="link-back-to-clusters">
          Browse All Clusters
        </Link>
      </div>
    );
  }

  const Icon = getClusterIcon(cluster.icon);

  const breadcrumbs = [
    { label: t("paramedic.breadcrumb.home"), href: "/" },
    { label: t("paramedic.breadcrumb.paramedic"), href: "/allied-health/paramedic" },
    { label: t("paramedic.cluster.indexTitle"), href: "/allied-health/paramedic/clusters" },
    { label: cluster.title, href: "#" },
  ];

  const allFaqs = cluster.topics.flatMap(t => t.faq).slice(0, 8);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: cluster.title,
      description: cluster.metaDescription,
      publisher: { "@type": "Organization", name: "NurseNest" },
      about: { "@type": "Thing", name: cluster.title },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.label,
        item: b.href ? `https://www.nursenest.ca${b.href}` : undefined,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "EducationalOccupationalProgram",
      name: `Paramedic ${cluster.title} Study Program`,
      description: cluster.description,
      provider: { "@type": "Organization", name: "NurseNest" },
      occupationalCategory: "29-2043.00",
    },
    ...(allFaqs.length > 0 ? [{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: allFaqs.map(faq => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    }] : []),
  ];

  return (
    <div data-testid="paramedic-cluster-hub">
      <AlliedSEO
        title={cluster.metaTitle}
        description={cluster.metaDescription}
        keywords={cluster.keywords}
        canonicalPath={`/allied-health/paramedic/cluster/${cluster.slug}`}
        structuredData={structuredData[0]}
        additionalStructuredData={structuredData.slice(1)}
      />

      <Breadcrumbs items={breadcrumbs} />

      <section className="bg-gradient-to-br from-purple-50 via-white to-teal-50 border-b border-gray-100 py-12 px-4" data-testid="section-cluster-hero">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: `${cluster.color}15` }}>
              <Icon className="w-7 h-7" style={{ color: cluster.color }} />
            </div>
            <span className="text-sm font-medium text-gray-500">{cluster.topics.length} Topics</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="text-cluster-title">
            {cluster.title}
          </h1>
          <p className="text-lg text-gray-600" data-testid="text-cluster-description">
            {cluster.description}
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14 bg-white" data-testid="section-topics-grid">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("paramedic.cluster.topicsIn")} {cluster.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cluster.topics.map((topic, idx) => (
              <Link
                key={topic.slug}
                href={`/allied-health/paramedic/cluster/${cluster.slug}/${topic.slug}`}
                className="group bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-teal-200 transition-all"
                data-testid={`card-topic-${topic.slug}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">
                    {topic.title}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-teal-500 transition-colors flex-shrink-0 mt-1" />
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{topic.overview.slice(0, 120)}...</p>
                {topic.examTips && topic.examTips.length > 0 && (
                  <div className="mt-3 flex items-center gap-1 text-xs text-amber-600">
                    <BookOpen className="w-3 h-3" />
                    <span>{topic.examTips.length} exam tips</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 bg-gradient-to-b from-teal-50/30 to-white" data-testid="section-free-preview">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Target className="w-5 h-5 text-teal-600" />
              <h2 className="text-xl font-bold text-gray-900">{t("paramedic.cta.freePreview")}</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4 max-w-lg mx-auto">
              {t("paramedic.cta.freePreviewSub")}
            </p>
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              {cluster.topics.slice(0, 3).map(topic => (
                <Link
                  key={topic.slug}
                  href={`/allied-health/paramedic/cluster/${cluster.slug}/${topic.slug}`}
                  className="inline-flex items-center gap-1 px-4 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-100 transition-colors"
                  data-testid={`link-preview-${topic.slug}`}
                >
                  {topic.title} <ArrowRight className="w-3 h-3" />
                </Link>
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Lock className="w-4 h-4" />
              <span>{t("paramedic.cta.premiumLocked")}</span>
            </div>
          </div>
        </div>
      </section>

      <ConversionCTA
        title={t("paramedic.cta.unlockBank")}
        description={t("paramedic.cta.unlockBankSub")}
        ctaText={t("paramedic.cta.startDiagnostic")}
        ctaHref="/allied-health/diagnostic?career=paramedic"
      />

      {allFaqs.length > 0 && (
        <section className="py-10 bg-white" data-testid="section-cluster-faq">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("paramedic.faq.title")}</h2>
            <FAQAccordion items={allFaqs} />
          </div>
        </section>
      )}

      <section className="py-8 border-t border-gray-100" data-testid="section-cross-links">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{t("paramedic.cluster.exploreOther")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PARAMEDIC_CLUSTERS.filter(c => c.slug !== cluster.slug).map(other => {
              const OtherIcon = getClusterIcon(other.icon);
              return (
                <Link
                  key={other.slug}
                  href={`/allied-health/paramedic/cluster/${other.slug}`}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all"
                  data-testid={`link-cluster-${other.slug}`}
                >
                  <OtherIcon className="w-5 h-5" style={{ color: other.color }} />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{other.title}</h3>
                    <p className="text-xs text-gray-500">{other.topics.length} topics</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <FinalCTASection
        title={t("paramedic.cta.masterExam")}
        subtitle={t("paramedic.cta.masterExamSub")}
        primaryCTA={{ label: t("paramedic.cta.startPracticing"), href: "/diagnostic?career=paramedic" }}
        secondaryCTA={{ label: t("paramedic.cta.viewPricing"), href: "/allied-health/pricing" }}
      />
    </div>
  );
}
