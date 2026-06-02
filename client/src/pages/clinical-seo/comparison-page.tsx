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
  ArrowLeftRight,
  CheckCircle,
  XCircle,
  BookOpen,
  Lightbulb,
  Brain,
  ClipboardList,
  Stethoscope,
  Key,
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
      {showRationale && <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900" data-testid={`rationale-${index}`}><p className="font-semibold mb-1">{t("pages.clinicalSeo.comparisonPage.rationale")}</p><p>{q.rationale}</p></div>}
    </div>
  );
}

export default function ClinicalComparisonPage() {
  const params = useParams<{ slug: string }>();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/clinical-seo/comparison/${params.slug}`)
      .then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(setPage)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) return (<><Navigation /><div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div><Footer /></>);
  if (error || !page) return (<><Navigation /><div className="min-h-screen flex items-center justify-center" data-testid="comparison-not-found"><div className="text-center"><h1 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.clinicalSeo.comparisonPage.pageNotFound")}</h1><p className="text-gray-600">{t("pages.clinicalSeo.comparisonPage.theClinicalComparisonPageYou")}</p></div></div><Footer /></>);

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
      <SEO title={page.metaTitle || page.title} description={page.metaDescription || page.summary} canonicalPath={`/clinical-compare/${page.slug}`} keywords={page.seoKeywords?.join(", ")} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {faqStructuredData && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />}
      <Navigation />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumb-nav">
            <LocaleLink href="/" className="hover:text-primary">{t("pages.clinicalSeo.comparisonPage.home")}</LocaleLink>
            <span>/</span>
            <span className="text-gray-500">{t("pages.clinicalSeo.comparisonPage.clinicalComparisons")}</span>
            <span>/</span>
            <span className="text-gray-900">{page.title}</span>
          </nav>

          <header className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-violet-50 text-violet-700 text-xs font-semibold rounded-full">{t("pages.clinicalSeo.comparisonPage.clinicalComparison")}</span>
              {page.bodySystem && <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">{page.bodySystem}</span>}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="page-title">{page.title}: Side-by-Side Nursing Comparison</h1>
            <p className="text-lg text-gray-600 leading-relaxed" data-testid="page-summary">{page.summary}</p>
            <MedicalReviewBadge lastUpdated={page.lastReviewedAt} className="mt-4" />
          </header>

          {data.entityA && data.entityB && (
            <section className="mb-8" data-testid="section-overview">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="font-bold text-blue-900 text-lg mb-2">{data.entityA.name}</h3>
                  <p className="text-sm text-blue-800">{data.entityA.description}</p>
                </div>
                <div className="bg-violet-50 border border-violet-200 rounded-xl p-6">
                  <h3 className="font-bold text-violet-900 text-lg mb-2">{data.entityB.name}</h3>
                  <p className="text-sm text-violet-800">{data.entityB.description}</p>
                </div>
              </div>
            </section>
          )}

          {data.comparisonTable && data.comparisonTable.length > 0 && (
            <section className="mb-8" data-testid="section-comparison-table">
              <div className="flex items-center gap-2 mb-4">
                <ArrowLeftRight className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">{t("pages.clinicalSeo.comparisonPage.featurebyfeatureComparison")}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-1/4">{t("pages.clinicalSeo.comparisonPage.feature")}</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-blue-700 w-[37.5%]">{data.entityA?.name || "A"}</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-violet-700 w-[37.5%]">{data.entityB?.name || "B"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.comparisonTable.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.feature}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{row.entityA}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{row.entityB}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {data.keyDifferentiators && data.keyDifferentiators.length > 0 && (
            <section className="mb-8" data-testid="section-key-differentiators">
              <div className="flex items-center gap-2 mb-4">
                <Key className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">{t("pages.clinicalSeo.comparisonPage.keyDifferentiators")}</h2>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <ul className="space-y-3">
                  {data.keyDifferentiators.map((kd: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-amber-900">
                      <Brain className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                      {kd}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {(data.nursingInterventionsA || data.nursingInterventionsB) && (
            <section className="mb-8" data-testid="section-nursing-interventions">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">{t("pages.clinicalSeo.comparisonPage.nursingInterventions")}</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {data.nursingInterventionsA && (
                  <div className="bg-white border border-blue-200 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2"><Stethoscope className="w-4 h-4" /> {data.entityA?.name || "Entity A"}</h3>
                    <ol className="space-y-2">
                      {data.nursingInterventionsA.map((int: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                          {int}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {data.nursingInterventionsB && (
                  <div className="bg-white border border-violet-200 rounded-xl p-6">
                    <h3 className="font-semibold text-violet-800 mb-3 flex items-center gap-2"><Stethoscope className="w-4 h-4" /> {data.entityB?.name || "Entity B"}</h3>
                    <ol className="space-y-2">
                      {data.nursingInterventionsB.map((int: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                          {int}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </section>
          )}

          {data.examTips && data.examTips.length > 0 && (
            <section className="mb-8" data-testid="section-exam-tips">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h2 className="text-2xl font-bold text-gray-900">{t("pages.clinicalSeo.comparisonPage.nclexExamTips")}</h2>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <ul className="space-y-3">
                  {data.examTips.map((tip: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-amber-900"><Brain className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />{tip}</li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {questions.length > 0 && (
            <section className="mb-8" data-testid="section-practice-questions">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">{t("pages.clinicalSeo.comparisonPage.practiceQuestions")}</h2>
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
            pageUrl={`https://www.nursenest.ca/compare/${page.slug}`}
          />

          <AutoRelatedContent slug={page.slug} contentType="comparison" title={page.title} bodySystem={page.bodySystem} category={page.category} />
          <YouMayAlsoLike slug={page.slug} contentType="comparison" title={page.title} bodySystem={page.bodySystem} category={page.category} />
        </div>
      </main>
      <Footer />
    </>
  );
}
