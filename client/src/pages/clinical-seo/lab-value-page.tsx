import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { MedicalReviewBadge, MedicalReviewJsonLd } from "@/components/medical-review-badge";
import { MedicalReferences } from "@/components/medical-references";
import { AutoRelatedContent, YouMayAlsoLike } from "@/components/auto-related-content";
import { LocaleLink } from "@/lib/LocaleLink";
import { useI18n } from "@/lib/i18n";
import {
  FlaskConical,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BookOpen,
  Activity,
  Lightbulb,
  Brain,
  Stethoscope,
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
      {showRationale && <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900" data-testid={`rationale-${index}`}><p className="font-semibold mb-1">{t("pages.clinicalSeo.labValuePage.rationale")}</p><p>{q.rationale}</p></div>}
    </div>
  );
}

export default function ClinicalLabValuePage() {
  const params = useParams<{ slug: string }>();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/clinical-seo/lab-value/${params.slug}`)
      .then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(setPage)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) return (<><Navigation /><div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div><Footer /></>);
  if (error || !page) return (<><Navigation /><div className="min-h-screen flex items-center justify-center" data-testid="lab-not-found"><div className="text-center"><h1 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.clinicalSeo.labValuePage.pageNotFound")}</h1><p className="text-gray-600">{t("pages.clinicalSeo.labValuePage.theLabValuePageYou")}</p></div></div><Footer /></>);

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

  return (
    <>
      <SEO title={page.metaTitle || page.title} description={page.metaDescription || page.summary} canonicalPath={`/labs/${page.slug}`} keywords={page.seoKeywords?.join(", ")} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {faqStructuredData && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />}
      <Navigation />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumb-nav">
            <LocaleLink href="/" className="hover:text-primary">{t("pages.clinicalSeo.labValuePage.home")}</LocaleLink>
            <span>/</span>
            <span className="text-gray-500">{t("pages.clinicalSeo.labValuePage.labValues")}</span>
            <span>/</span>
            <span className="text-gray-900">{page.title}</span>
          </nav>

          <header className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full">{t("pages.clinicalSeo.labValuePage.labValueGuide")}</span>
              {page.category && <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">{page.category}</span>}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="page-title">{page.title}: Normal Ranges & Nursing Interpretation</h1>
            <p className="text-lg text-gray-600 leading-relaxed" data-testid="page-summary">{page.summary}</p>
            <MedicalReviewBadge lastUpdated={page.lastReviewedAt} className="mt-4" />
          </header>

          {(data.normalRangeCA || data.normalRangeUS) && (
            <section className="mb-8" data-testid="section-normal-ranges">
              <div className="flex items-center gap-2 mb-4">
                <FlaskConical className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">{t("pages.clinicalSeo.labValuePage.normalRanges")}</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">{t("pages.clinicalSeo.labValuePage.canadaSiUnits")}</p>
                  <p className="text-2xl font-bold text-primary">{data.normalRangeCA}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">{t("pages.clinicalSeo.labValuePage.unitedStatesConventional")}</p>
                  <p className="text-2xl font-bold text-blue-600">{data.normalRangeUS}</p>
                </div>
              </div>
              {(data.criticalLow || data.criticalHigh) && (
                <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-4 justify-center text-sm">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  {data.criticalLow && data.criticalLow !== "N/A" && <span className="text-red-800"><strong>{t("pages.clinicalSeo.labValuePage.criticalLow")}</strong> {data.criticalLow}</span>}
                  {data.criticalHigh && data.criticalHigh !== "N/A" && <span className="text-red-800"><strong>{t("pages.clinicalSeo.labValuePage.criticalHigh")}</strong> {data.criticalHigh}</span>}
                </div>
              )}
            </section>
          )}

          {data.clinicalSignificance && (
            <section className="mb-8" data-testid="section-clinical-significance">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">{t("pages.clinicalSeo.labValuePage.clinicalSignificance")}</h2>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed">{data.clinicalSignificance}</p>
              </div>
            </section>
          )}

          {data.interpretation && (
            <section className="mb-8" data-testid="section-interpretation">
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">{t("pages.clinicalSeo.labValuePage.clinicalInterpretation")}</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {data.interpretation.elevated && (
                  <div className="bg-white border border-red-200 rounded-xl p-6">
                    <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2"><TrendingUp className="w-5 h-5" /> {t("pages.clinicalSeo.labValuePage.elevatedHigh")}</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t("pages.clinicalSeo.labValuePage.commonCauses")}</p>
                        <ul className="space-y-1">{data.interpretation.elevated.causes.map((c: string, i: number) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0" />{c}</li>)}</ul>
                      </div>
                      {data.interpretation.elevated.ecgChanges?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t("pages.clinicalSeo.labValuePage.ecgChanges")}</p>
                          <ul className="space-y-1">{data.interpretation.elevated.ecgChanges.map((c: string, i: number) => <li key={i} className="text-sm text-gray-700">{c}</li>)}</ul>
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t("pages.clinicalSeo.labValuePage.nursingActions")}</p>
                        <ul className="space-y-1">{data.interpretation.elevated.nursingActions.map((a: string, i: number) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />{a}</li>)}</ul>
                      </div>
                    </div>
                  </div>
                )}
                {data.interpretation.decreased && (
                  <div className="bg-white border border-blue-200 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2"><TrendingDown className="w-5 h-5" /> {t("pages.clinicalSeo.labValuePage.decreasedLow")}</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t("pages.clinicalSeo.labValuePage.commonCauses2")}</p>
                        <ul className="space-y-1">{data.interpretation.decreased.causes.map((c: string, i: number) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0" />{c}</li>)}</ul>
                      </div>
                      {data.interpretation.decreased.ecgChanges?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t("pages.clinicalSeo.labValuePage.ecgChanges2")}</p>
                          <ul className="space-y-1">{data.interpretation.decreased.ecgChanges.map((c: string, i: number) => <li key={i} className="text-sm text-gray-700">{c}</li>)}</ul>
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t("pages.clinicalSeo.labValuePage.nursingActions2")}</p>
                        <ul className="space-y-1">{data.interpretation.decreased.nursingActions.map((a: string, i: number) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />{a}</li>)}</ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {data.relatedConditions && data.relatedConditions.length > 0 && (
            <section className="mb-8" data-testid="section-related-conditions">
              <h2 className="text-xl font-bold text-gray-900 mb-3">{t("pages.clinicalSeo.labValuePage.relatedConditions")}</h2>
              <div className="flex flex-wrap gap-2">
                {data.relatedConditions.map((rc: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg">{rc}</span>
                ))}
              </div>
            </section>
          )}

          {questions.length > 0 && (
            <section className="mb-8" data-testid="section-practice-questions">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">{t("pages.clinicalSeo.labValuePage.practiceQuestions")}</h2>
              </div>
              <div className="space-y-4">
                {questions.map((q: any, i: number) => <PracticeQuestion key={i} q={q} index={i} />)}
              </div>
            </section>
          )}

          {refs.length > 0 && (
            <section className="mb-8" data-testid="section-references">
              <MedicalReferences lessonId={`${page.title} ${page.bodySystem || ""}`} pageType="laboratory" />
            </section>
          )}

          <MedicalReviewJsonLd
            title={page.title}
            slug={page.slug}
            lastUpdated={page.lastReviewedAt}
            description={page.metaDescription || page.summary}
            pageUrl={`https://www.nursenest.ca/labs/${page.slug}`}
          />

          <AutoRelatedContent slug={page.slug} contentType="lab-value" title={page.title} bodySystem={page.bodySystem} category={page.category} />
          <YouMayAlsoLike slug={page.slug} contentType="lab-value" title={page.title} bodySystem={page.bodySystem} category={page.category} />
        </div>
      </main>
      <Footer />
    </>
  );
}
