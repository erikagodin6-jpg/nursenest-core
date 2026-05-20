import { useParams, Link } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import { Breadcrumbs, FAQAccordion, ClinicalPearlCard, ExamTipCard, ConversionCTA, PracticeQuestionsLink } from "@/allied/components/paramedic-seo-components";
import { FinalCTASection } from "./components";
import { getTopicBySlug, getRelatedTopics, PARAMEDIC_CLUSTERS } from "@/allied/data/paramedic-cluster-data";
import { useI18n } from "@/lib/i18n";
import {
  AlertTriangle, Shield, Stethoscope, Syringe, Clock,
  ArrowRight, Lock, CheckCircle, BookOpen, Target, ChevronRight
} from "lucide-react";

export default function ParamedicClusterTopic() {
  const params = useParams<{ clusterSlug: string; topicSlug: string }>();
  const { t } = useI18n();
  const result = getTopicBySlug(params.clusterSlug || "", params.topicSlug || "");

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("paramedic.topic.notFound")}</h1>
        <p className="text-gray-600 mb-4">{t("paramedic.topic.notFoundDesc")}</p>
        <Link href="/allied-health/paramedic/clusters" className="inline-block px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700" data-testid="link-back-to-clusters">
          {t("paramedic.topic.browseAll")}
        </Link>
      </div>
    );
  }

  const { cluster, topic } = result;
  const relatedTopics = getRelatedTopics(topic.slug, 4);

  const breadcrumbs = [
    { label: t("paramedic.breadcrumb.home"), href: "/" },
    { label: t("paramedic.breadcrumb.paramedic"), href: "/allied-health/paramedic" },
    { label: cluster.title, href: `/allied-health/paramedic/cluster/${cluster.slug}` },
    { label: topic.title, href: "#" },
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: topic.title,
      description: topic.metaDescription,
      publisher: { "@type": "Organization", name: "NurseNest" },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://www.nursenest.ca/allied-health/paramedic/cluster/${cluster.slug}/${topic.slug}`,
      },
      about: [
        { "@type": "Thing", name: topic.title },
        { "@type": "Thing", name: "Paramedic Certification" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.label,
        item: b.href !== "#" ? `https://www.nursenest.ca${b.href}` : undefined,
      })),
    },
    ...(topic.faq.length > 0 ? [{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: topic.faq.map(faq => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    }] : []),
  ];

  const FREE_ITEMS_COUNT = 3;

  return (
    <div data-testid="paramedic-cluster-topic">
      <AlliedSEO
        title={topic.metaTitle}
        description={topic.metaDescription}
        keywords={topic.keywords}
        canonicalPath={`/allied-health/paramedic/cluster/${cluster.slug}/${topic.slug}`}
        structuredData={structuredData[0]}
        additionalStructuredData={structuredData.slice(1)}
      />

      <Breadcrumbs items={breadcrumbs} />

      <section className="bg-gradient-to-br from-slate-50 via-white to-teal-50 border-b border-gray-100 py-10 px-4" data-testid="section-topic-hero">
        <div className="max-w-4xl mx-auto">
          <Link href={`/allied-health/paramedic/cluster/${cluster.slug}`} className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 mb-3" data-testid="link-back-to-cluster">
            <ChevronRight className="w-3 h-3 rotate-180" />
            {cluster.title}
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="text-topic-title">
            {topic.title}
          </h1>
          <p className="text-lg text-gray-600" data-testid="text-topic-overview">
            {topic.overview}
          </p>
        </div>
      </section>

      <article className="py-10 bg-white" data-testid="section-topic-content">
        <div className="max-w-4xl mx-auto px-4">
          {topic.sections.map(section => (
            <div key={section.id} className="mb-8" data-testid={`section-${section.id}`}>
              {section.level === 2 ? (
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{section.title}</h2>
              ) : (
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{section.title}</h3>
              )}
              <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-3">{section.content}</p>
              {section.bullets && section.bullets.length > 0 && (
                <ul className="space-y-1.5 ml-1">
                  {section.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </article>

      {topic.signsSymptoms && topic.signsSymptoms.length > 0 && (
        <section className="py-8 bg-red-50/30" data-testid="section-signs-symptoms">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              {t("paramedic.topic.signsSymptoms")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {topic.signsSymptoms.slice(0, FREE_ITEMS_COUNT).map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-white rounded-lg p-3 border border-red-100">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
              {topic.signsSymptoms.length > FREE_ITEMS_COUNT && (
                <LockedContentOverlay count={topic.signsSymptoms.length - FREE_ITEMS_COUNT} label={t("paramedic.topic.moreItems")} />
              )}
            </div>
          </div>
        </section>
      )}

      {topic.assessmentSteps && topic.assessmentSteps.length > 0 && (
        <section className="py-8 bg-white" data-testid="section-assessment-steps">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-500" />
              {t("paramedic.topic.assessmentSteps")}
            </h2>
            <ol className="space-y-2">
              {topic.assessmentSteps.slice(0, FREE_ITEMS_COUNT + 1).map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700 bg-blue-50/50 rounded-lg p-3 border border-blue-100">
                  <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
              {topic.assessmentSteps.length > FREE_ITEMS_COUNT + 1 && (
                <LockedContentOverlay count={topic.assessmentSteps.length - FREE_ITEMS_COUNT - 1} label={t("paramedic.topic.moreSteps")} />
              )}
            </ol>
          </div>
        </section>
      )}

      {topic.blsInterventions && topic.blsInterventions.length > 0 && (
        <section className="py-8 bg-green-50/30" data-testid="section-bls-interventions">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              {t("paramedic.topic.blsInterventions")}
            </h2>
            <div className="space-y-2">
              {topic.blsInterventions.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-white rounded-lg p-3 border border-green-100">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {topic.alsInterventions && topic.alsInterventions.length > 0 && (
        <section className="py-8 bg-white" data-testid="section-als-interventions">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Syringe className="w-5 h-5 text-purple-600" />
              {t("paramedic.topic.alsInterventions")}
            </h2>
            <div className="space-y-2">
              {topic.alsInterventions.slice(0, FREE_ITEMS_COUNT).map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-purple-50/50 rounded-lg p-3 border border-purple-100">
                  <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
              {topic.alsInterventions.length > FREE_ITEMS_COUNT && (
                <LockedContentOverlay count={topic.alsInterventions.length - FREE_ITEMS_COUNT} label={t("paramedic.topic.moreInterventions")} />
              )}
            </div>
          </div>
        </section>
      )}

      {(topic.indications || topic.contraindications) && (
        <section className="py-8 bg-amber-50/30" data-testid="section-indications">
          <div className="max-w-4xl mx-auto px-4">
            {topic.indications && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">{t("paramedic.topic.indications")}</h2>
                <div className="space-y-2">
                  {topic.indications.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-white rounded-lg p-3 border border-green-100">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {topic.contraindications && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">{t("paramedic.topic.contraindications")}</h2>
                <div className="space-y-2">
                  {topic.contraindications.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-white rounded-lg p-3 border border-red-100">
                      <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {(topic.dosageAdult || topic.dosagePediatric) && (
        <section className="py-8 bg-white" data-testid="section-dosage">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("paramedic.topic.dosage")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topic.dosageAdult && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h3 className="text-sm font-semibold text-blue-800 mb-2">{t("paramedic.topic.adultDose")}</h3>
                  <p className="text-sm text-blue-700">{topic.dosageAdult}</p>
                </div>
              )}
              {topic.dosagePediatric && (
                <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
                  <h3 className="text-sm font-semibold text-pink-800 mb-2">{t("paramedic.topic.pediatricDose")}</h3>
                  <p className="text-sm text-pink-700">{topic.dosagePediatric}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {topic.redFlags && topic.redFlags.length > 0 && (
        <section className="py-8 bg-red-50/50" data-testid="section-red-flags">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              {t("paramedic.topic.redFlags")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {topic.redFlags.map((flag, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-red-800 bg-white rounded-lg p-3 border border-red-200">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>{flag}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {topic.transportDecisions && topic.transportDecisions.length > 0 && (
        <section className="py-8 bg-white" data-testid="section-transport">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              {t("paramedic.topic.transportDecisions")}
            </h2>
            <div className="space-y-2">
              {topic.transportDecisions.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-orange-50/50 rounded-lg p-3 border border-orange-100">
                  <ArrowRight className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {topic.examTips && topic.examTips.length > 0 && (
        <section className="py-8 bg-teal-50/30" data-testid="section-exam-tips">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-600" />
              {t("paramedic.topic.examTips")}
            </h2>
            <div className="space-y-2">
              {topic.examTips.slice(0, FREE_ITEMS_COUNT).map((tip, i) => (
                <ExamTipCard key={i} tip={{ content: tip }} />
              ))}
              {topic.examTips.length > FREE_ITEMS_COUNT && (
                <LockedContentOverlay count={topic.examTips.length - FREE_ITEMS_COUNT} label={t("paramedic.topic.moreExamTips")} />
              )}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-4xl mx-auto px-4 py-6">
        <PracticeQuestionsLink />
      </div>

      <ConversionCTA
        title={t("paramedic.cta.unlockBank")}
        description={t("paramedic.cta.unlockBankSub")}
        ctaText={t("paramedic.cta.startDiagnostic")}
        ctaHref="/allied-health/diagnostic?career=paramedic"
      />

      {topic.faq.length > 0 && (
        <section className="py-10 bg-white" data-testid="section-topic-faq">
          <div className="max-w-4xl mx-auto px-4">
            <FAQAccordion items={topic.faq} />
          </div>
        </section>
      )}

      {relatedTopics.length > 0 && (
        <section className="py-8 border-t border-gray-100" data-testid="section-related-topics">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{t("paramedic.topic.relatedTopics")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedTopics.map(({ cluster: rc, topic: rt }) => (
                <Link
                  key={rt.slug}
                  href={`/allied-health/paramedic/cluster/${rc.slug}/${rt.slug}`}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all"
                  data-testid={`link-related-${rt.slug}`}
                >
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">{rt.title}</h3>
                    <p className="text-xs text-gray-500">{rc.title}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-6 border-t border-gray-100" data-testid="section-cluster-nav">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{t("paramedic.cluster.exploreOther")}</h2>
          <div className="flex flex-wrap gap-3">
            {PARAMEDIC_CLUSTERS.map(c => (
              <Link
                key={c.slug}
                href={`/allied-health/paramedic/cluster/${c.slug}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  c.slug === cluster.slug
                    ? "bg-teal-50 border-teal-200 text-teal-700"
                    : "bg-white border-gray-200 text-gray-600 hover:border-teal-200 hover:text-teal-600"
                }`}
                data-testid={`link-cluster-nav-${c.slug}`}
              >
                {c.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FinalCTASection
        title={t("paramedic.cta.masterExam")}
        subtitle={t("paramedic.cta.masterExamSub")}
        primaryCTA={{ label: t("paramedic.cta.startPracticing"), href: "/allied-health/diagnostic?career=paramedic" }}
        secondaryCTA={{ label: t("paramedic.cta.viewPricing"), href: "/allied-health/pricing" }}
      />
    </div>
  );
}

function LockedContentOverlay({ count, label }: { count: number; label: string }) {
  const { t } = useI18n();
  return (
    <div className="relative" data-testid="locked-content">
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 blur-[2px] select-none pointer-events-none">
        <div className="flex items-start gap-2 text-sm text-gray-400">
          <CheckCircle className="w-4 h-4 mt-0.5" />
          <span>{t("paramedic.topic.premiumLocked")}</span>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-lg">
        <Link
          href="/allied-health/pricing"
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm"
          data-testid="button-unlock-premium"
        >
          <Lock className="w-3.5 h-3.5" />
          {count}+ {label} — {t("paramedic.topic.unlockLabel")}
        </Link>
      </div>
    </div>
  );
}
