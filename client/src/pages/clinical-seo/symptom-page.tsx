import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { MedicalReviewBadge, MedicalReviewJsonLd } from "@/components/medical-review-badge";
import { MedicalReferences } from "@/components/medical-references";
import { AutoRelatedContent } from "@/components/auto-related-content";
import { LocaleLink } from "@/lib/LocaleLink";
import { useI18n } from "@/lib/i18n";
import {
  ChevronDown,
  AlertTriangle,
  Stethoscope,
  CheckCircle,
  XCircle,
  BookOpen,
  Shield,
  Activity,
  Search,
  Zap,
  Clock,
  AlertCircle,
} from "lucide-react";

function PracticeQuestion({ q, index }: { q: any; index: number }) {
  const { t } = useI18n();
  const [selected, setSelected] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState(false);
  const handleSelect = (optIdx: number) => { if (selected !== null) return; setSelected(optIdx); setShowRationale(true); };
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6" data-testid={`practice-question-${index}`}>
      <p className="font-semibold text-gray-900 mb-4"><span className="text-primary font-bold mr-2">Q{index + 1}.</span>{q.question}</p>
      <div className="space-y-2">
        {q.options.map((opt: string, optIdx: number) => {
          let cls = "border border-gray-200 rounded-lg p-3 text-sm cursor-pointer transition-all hover:border-primary/40";
          if (selected !== null) {
            if (optIdx === q.correct) cls = "border-2 border-emerald-500 rounded-lg p-3 text-sm bg-emerald-50";
            else if (optIdx === selected) cls = "border-2 border-red-400 rounded-lg p-3 text-sm bg-red-50";
            else cls = "border border-gray-200 rounded-lg p-3 text-sm opacity-60";
          }
          return (<button key={optIdx} onClick={() => handleSelect(optIdx)} className={`w-full text-left flex items-start gap-3 ${cls}`} disabled={selected !== null} data-testid={`question-${index}-option-${optIdx}`}><span className="font-medium text-gray-500 shrink-0">{String.fromCharCode(65 + optIdx)}.</span><span>{opt}</span>{selected !== null && optIdx === q.correct && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 ml-auto mt-0.5" />}{selected !== null && optIdx === selected && optIdx !== q.correct && <XCircle className="w-4 h-4 text-red-400 shrink-0 ml-auto mt-0.5" />}</button>);
        })}
      </div>
      {showRationale && <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900" data-testid={`rationale-${index}`}><p className="font-semibold mb-1">{t("pages.clinicalSeo.symptomPage.rationale")}</p><p>{q.rationale}</p></div>}
    </div>
  );
}

export default function ClinicalSymptomPage() {
  const params = useParams<{ slug: string }>();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/clinical-seo/symptom/${params.slug}`)
      .then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(setPage)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) return (<><Navigation /><div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div><Footer /></>);
  if (error || !page) return (<><Navigation /><div className="min-h-screen flex items-center justify-center" data-testid="symptom-not-found"><div className="text-center"><h1 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.clinicalSeo.symptomPage.pageNotFound")}</h1><p className="text-gray-600">{t("pages.clinicalSeo.symptomPage.theSymptomAssessmentPageYou")}</p></div></div><Footer /></>);

  const data = page.data;
  const questions = page.practiceQuestions || [];
  const refs = page.references || [];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: page.metaTitle || page.title,
    description: page.metaDescription || page.summary,
    url: page.canonicalUrl,
    medicalAudience: { "@type": "MedicalAudience", audienceType: "Nurses, Nursing Students" },
    lastReviewed: page.lastReviewedAt || new Date().toISOString(),
    reviewedBy: { "@type": "Person", name: "Erika Godin, RN, BScN" },
  };

  const faqItems = questions.slice(0, 3).map((q: any) => ({ question: q.question, answer: q.rationale }));
  const faqStructuredData = faqItems.length > 0 ? {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqItems.map((f: any) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  } : null;

  const urgencyColors: Record<string, string> = { emergent: "bg-red-100 text-red-800 border-red-200", urgent: "bg-amber-100 text-amber-800 border-amber-200", "non-emergent": "bg-green-100 text-green-800 border-green-200" };
  const urgencyIcons: Record<string, any> = { emergent: Zap, urgent: Clock, "non-emergent": Shield };

  return (
    <>
      <SEO title={page.metaTitle || page.title} description={page.metaDescription || page.summary} canonicalPath={`/symptoms/${page.slug}`} keywords={page.seoKeywords?.join(", ")} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {faqStructuredData && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />}
      <Navigation />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumb-nav">
            <LocaleLink href="/" className="hover:text-primary">{t("pages.clinicalSeo.symptomPage.home")}</LocaleLink>
            <span>/</span>
            <span className="text-gray-500">{t("pages.clinicalSeo.symptomPage.symptoms")}</span>
            <span>/</span>
            <span className="text-gray-900">{page.title}</span>
          </nav>

          <header className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full">{t("pages.clinicalSeo.symptomPage.clinicalAssessment")}</span>
              {page.bodySystem && <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full" data-testid="badge-body-system">{page.bodySystem}</span>}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="page-title">{page.title}: Nursing Assessment Guide</h1>
            <p className="text-lg text-gray-600 leading-relaxed" data-testid="page-summary">{page.summary}</p>
            <MedicalReviewBadge lastUpdated={page.lastReviewedAt} className="mt-4" />
          </header>

          {data.differentialDiagnoses && data.differentialDiagnoses.length > 0 && (
            <section className="mb-8" data-testid="section-differential-diagnoses">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">{t("pages.clinicalSeo.symptomPage.differentialDiagnoses")}</h2>
              </div>
              <div className="space-y-3">
                {data.differentialDiagnoses.map((dx: any, i: number) => {
                  const UrgIcon = urgencyIcons[dx.urgency] || Shield;
                  return (
                    <div key={i} className="bg-white border border-gray-200 rounded-xl p-5" data-testid={`differential-${i}`}>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{dx.condition}</h3>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${urgencyColors[dx.urgency] || "bg-gray-100 text-gray-700"}`}>
                          <UrgIcon className="w-3 h-3 inline mr-1" />{dx.urgency}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{dx.characteristics}</p>
                      <div className="bg-blue-50 rounded-lg px-3 py-2 text-xs text-blue-800">
                        <span className="font-semibold">{t("pages.clinicalSeo.symptomPage.keyDifferentiator")}</span> {dx.keyDifferentiator}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {data.redFlags && data.redFlags.length > 0 && (
            <section className="mb-8" data-testid="section-red-flags">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h2 className="text-2xl font-bold text-gray-900">{t("pages.clinicalSeo.symptomPage.redFlags")}</h2>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <ul className="space-y-2">
                  {data.redFlags.map((flag: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-900">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {data.assessmentSteps && data.assessmentSteps.length > 0 && (
            <section className="mb-8" data-testid="section-assessment-steps">
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">{t("pages.clinicalSeo.symptomPage.systematicAssessment")}</h2>
              </div>
              <div className="space-y-3">
                {data.assessmentSteps.map((step: any, i: number) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{step.step}</h3>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.clinicalDecisionFramework && (
            <section className="mb-8" data-testid="section-clinical-decision">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">{t("pages.clinicalSeo.symptomPage.clinicalDecisionFramework")}</h2>
              </div>
              <div className="space-y-3">
                {data.clinicalDecisionFramework.emergent && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                    <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2"><Zap className="w-4 h-4" /> {t("pages.clinicalSeo.symptomPage.emergent")}</h3>
                    <p className="text-sm text-red-800">{data.clinicalDecisionFramework.emergent}</p>
                  </div>
                )}
                {data.clinicalDecisionFramework.urgent && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                    <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2"><Clock className="w-4 h-4" /> {t("pages.clinicalSeo.symptomPage.urgent")}</h3>
                    <p className="text-sm text-amber-800">{data.clinicalDecisionFramework.urgent}</p>
                  </div>
                )}
                {data.clinicalDecisionFramework.nonEmergent && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                    <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2"><Shield className="w-4 h-4" /> {t("pages.clinicalSeo.symptomPage.nonemergent")}</h3>
                    <p className="text-sm text-green-800">{data.clinicalDecisionFramework.nonEmergent}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {questions.length > 0 && (
            <section className="mb-8" data-testid="section-practice-questions">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">{t("pages.clinicalSeo.symptomPage.practiceQuestions")}</h2>
              </div>
              <div className="space-y-4">
                {questions.map((q: any, i: number) => <PracticeQuestion key={i} q={q} index={i} />)}
              </div>
            </section>
          )}

          {refs.length > 0 && (
            <section className="mb-8" data-testid="section-references">
              <MedicalReferences lessonId={`${page.title} ${page.bodySystem || ""}`} pageType={page.bodySystem?.toLowerCase() || undefined} />
            </section>
          )}

          <MedicalReviewJsonLd
            title={page.title}
            slug={page.slug}
            lastUpdated={page.lastReviewedAt}
            description={page.metaDescription || page.summary}
            pageUrl={`https://www.nursenest.ca/symptoms/${page.slug}`}
          />

          <AutoRelatedContent slug={page.slug} contentType="lesson" title={page.title} bodySystem={page.bodySystem} category={page.category} />
        </div>
      </main>
      <Footer />
    </>
  );
}
