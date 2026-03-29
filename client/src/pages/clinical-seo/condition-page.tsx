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
  ChevronDown,
  Heart,
  Stethoscope,
  Activity,
  AlertTriangle,
  Pill,
  ClipboardList,
  CheckCircle,
  XCircle,
  BookOpen,
  FlaskConical,
  Shield,
  Brain,
  Lightbulb,
} from "lucide-react";

interface ConditionData {
  pathophysiology: string;
  signsSymptoms: { left: string[]; right: string[] };
  labValues: Record<string, { name: string; normalCA: string; normalUS: string; significance: string }>;
  medications: Array<{ name: string; class: string; mechanism: string; sideEffects: string[]; contraindications: string[]; nursingConsiderations: string }>;
  nursingInterventions: string[];
  complications: Array<{ name: string; description: string }>;
  examInsights: string[];
}

function PracticeQuestion({ q, index }: { q: any; index: number }) {
  const { t } = useI18n();
  const [selected, setSelected] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState(false);

  const handleSelect = (optIndex: number) => {
    if (selected !== null) return;
    setSelected(optIndex);
    setShowRationale(true);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6" data-testid={`practice-question-${index}`}>
      <p className="font-semibold text-gray-900 mb-4">
        <span className="text-primary font-bold mr-2">Q{index + 1}.</span>
        {q.question}
      </p>
      <div className="space-y-2">
        {q.options.map((opt: string, optIdx: number) => {
          let cls = "border border-gray-200 rounded-lg p-3 text-sm cursor-pointer transition-all hover:border-primary/40 hover:bg-primary/5";
          if (selected !== null) {
            if (optIdx === q.correct) cls = "border-2 border-emerald-500 rounded-lg p-3 text-sm bg-emerald-50";
            else if (optIdx === selected) cls = "border-2 border-red-400 rounded-lg p-3 text-sm bg-red-50";
            else cls = "border border-gray-200 rounded-lg p-3 text-sm opacity-60";
          }
          return (
            <button key={optIdx} onClick={() => handleSelect(optIdx)} className={`w-full text-left flex items-start gap-3 ${cls}`} disabled={selected !== null} data-testid={`question-${index}-option-${optIdx}`}>
              <span className="font-medium text-gray-500 shrink-0">{String.fromCharCode(65 + optIdx)}.</span>
              <span>{opt}</span>
              {selected !== null && optIdx === q.correct && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 ml-auto mt-0.5" />}
              {selected !== null && optIdx === selected && optIdx !== q.correct && <XCircle className="w-4 h-4 text-red-400 shrink-0 ml-auto mt-0.5" />}
            </button>
          );
        })}
      </div>
      {showRationale && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900" data-testid={`rationale-${index}`}>
          <p className="font-semibold mb-1">{t("pages.clinicalSeo.conditionPage.rationale")}</p>
          <p>{q.rationale}</p>
        </div>
      )}
    </div>
  );
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden" data-testid={`faq-item-${index}`}>
      <button className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors" onClick={() => setOpen(!open)} data-testid={`faq-toggle-${index}`}>
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-3" data-testid={`faq-answer-${index}`}>{answer}</div>}
    </div>
  );
}

export default function ClinicalConditionPage() {
  const params = useParams<{ system: string; slug: string }>();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/clinical-seo/condition/${params.slug}`)
      .then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(setPage)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) return (<><Navigation /><div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div><Footer /></>);
  if (error || !page) return (<><Navigation /><div className="min-h-screen flex items-center justify-center" data-testid="condition-not-found"><div className="text-center"><h1 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.clinicalSeo.conditionPage.pageNotFound")}</h1><p className="text-gray-600">{t("pages.clinicalSeo.conditionPage.theClinicalConditionPageYou")}</p></div></div><Footer /></>);

  const data: ConditionData = page.data;
  const questions = page.practiceQuestions || [];
  const refs = page.references || [];

  const faqItems = questions.slice(0, 3).map((q: any) => ({
    question: q.question,
    answer: q.rationale,
  }));

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

  const faqStructuredData = faqItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f: any) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  } : null;

  return (
    <>
      <SEO title={page.metaTitle || page.title} description={page.metaDescription || page.summary} canonicalPath={new URL(page.canonicalUrl).pathname} keywords={page.seoKeywords?.join(", ")} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {faqStructuredData && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />}
      <Navigation />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumb-nav">
            <LocaleLink href="/" className="hover:text-primary">{t("pages.clinicalSeo.conditionPage.home")}</LocaleLink>
            <span>/</span>
            <LocaleLink href="/conditions" className="hover:text-primary">{t("pages.clinicalSeo.conditionPage.conditions")}</LocaleLink>
            <span>/</span>
            <span className="text-gray-900">{page.title}</span>
          </nav>

          <header className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              {page.bodySystem && <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full" data-testid="badge-body-system">{page.bodySystem}</span>}
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">{t("pages.clinicalSeo.conditionPage.clinicalGuide")}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="page-title">{page.title}: Nursing Assessment & NCLEX Guide</h1>
            <p className="text-lg text-gray-600 leading-relaxed" data-testid="page-summary">{page.summary}</p>
            <MedicalReviewBadge lastUpdated={page.lastReviewedAt} className="mt-4" />
          </header>

          {data.pathophysiology && (
            <section className="mb-8" data-testid="section-pathophysiology">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">{t("pages.clinicalSeo.conditionPage.pathophysiology")}</h2>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed">{data.pathophysiology}</p>
              </div>
            </section>
          )}

          {data.signsSymptoms && (
            <section className="mb-8" data-testid="section-signs-symptoms">
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">{t("pages.clinicalSeo.conditionPage.signsSymptoms")}</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    {page.bodySystem === "Cardiac" ? "Left-Sided / Pulmonary" : "Primary Manifestations"}
                  </h3>
                  <ul className="space-y-2">
                    {data.signsSymptoms.left.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-blue-500" />
                    {page.bodySystem === "Cardiac" ? "Right-Sided / Systemic" : "Additional Findings"}
                  </h3>
                  <ul className="space-y-2">
                    {data.signsSymptoms.right.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {data.labValues && Object.keys(data.labValues).length > 0 && (
            <section className="mb-8" data-testid="section-lab-values">
              <div className="flex items-center gap-2 mb-4">
                <FlaskConical className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">{t("pages.clinicalSeo.conditionPage.keyLabValues")}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">{t("pages.clinicalSeo.conditionPage.labTest")}</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">{t("pages.clinicalSeo.conditionPage.normalCa")}</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">{t("pages.clinicalSeo.conditionPage.normalUs")}</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">{t("pages.clinicalSeo.conditionPage.clinicalSignificance")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {Object.values(data.labValues).map((lab: any, i: number) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{lab.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{lab.normalCA}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{lab.normalUS}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{lab.significance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {data.medications && data.medications.length > 0 && (
            <section className="mb-8" data-testid="section-medications">
              <div className="flex items-center gap-2 mb-4">
                <Pill className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">{t("pages.clinicalSeo.conditionPage.keyMedications")}</h2>
              </div>
              <div className="space-y-4">
                {data.medications.map((med, i) => (
                  <MedAccordion key={i} med={med} index={i} />
                ))}
              </div>
            </section>
          )}

          {data.nursingInterventions && data.nursingInterventions.length > 0 && (
            <section className="mb-8" data-testid="section-nursing-interventions">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">{t("pages.clinicalSeo.conditionPage.priorityNursingInterventions")}</h2>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <ol className="space-y-3">
                  {data.nursingInterventions.map((int, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      {int}
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          )}

          {data.complications && data.complications.length > 0 && (
            <section className="mb-8" data-testid="section-complications">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h2 className="text-2xl font-bold text-gray-900">{t("pages.clinicalSeo.conditionPage.complications")}</h2>
              </div>
              <div className="space-y-3">
                {data.complications.map((c, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                    <h3 className="font-semibold text-gray-900 mb-1">{c.name}</h3>
                    <p className="text-sm text-gray-600">{c.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.examInsights && data.examInsights.length > 0 && (
            <section className="mb-8" data-testid="section-exam-insights">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h2 className="text-2xl font-bold text-gray-900">{t("pages.clinicalSeo.conditionPage.nclexExamInsights")}</h2>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <ul className="space-y-3">
                  {data.examInsights.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-amber-900">
                      <Brain className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {questions.length > 0 && (
            <section className="mb-8" data-testid="section-practice-questions">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">{t("pages.clinicalSeo.conditionPage.practiceQuestions")}</h2>
              </div>
              <div className="space-y-4">
                {questions.map((q: any, i: number) => (
                  <PracticeQuestion key={i} q={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {faqItems.length > 0 && (
            <section className="mb-8" data-testid="section-faq">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("pages.clinicalSeo.conditionPage.frequentlyAskedQuestions")}</h2>
              <div className="space-y-2">
                {faqItems.map((faq: any, i: number) => (
                  <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
                ))}
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
            pageUrl={`https://www.nursenest.ca/conditions/${page.slug}`}
          />

          <AutoRelatedContent slug={page.slug} contentType="condition" title={page.title} bodySystem={page.bodySystem} category={page.category} />
          <YouMayAlsoLike slug={page.slug} contentType="condition" title={page.title} bodySystem={page.bodySystem} category={page.category} />
        </div>
      </main>
      <Footer />
    </>
  );
}

function MedAccordion({ med, index }: { med: any; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden" data-testid={`medication-${index}`}>
      <button className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50" onClick={() => setOpen(!open)}>
        <div>
          <span className="font-semibold text-gray-900">{med.name}</span>
          <span className="text-sm text-gray-500 ml-2">({med.class})</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3">
          <div><span className="text-xs font-semibold text-gray-500 uppercase">{t("pages.clinicalSeo.conditionPage.mechanism")}</span><p className="text-sm text-gray-700 mt-1">{med.mechanism}</p></div>
          <div><span className="text-xs font-semibold text-gray-500 uppercase">{t("pages.clinicalSeo.conditionPage.sideEffects")}</span><div className="flex flex-wrap gap-1 mt-1">{med.sideEffects.map((s: string, i: number) => <span key={i} className="px-2 py-0.5 bg-red-50 text-red-700 text-xs rounded">{s}</span>)}</div></div>
          <div><span className="text-xs font-semibold text-gray-500 uppercase">{t("pages.clinicalSeo.conditionPage.contraindications")}</span><div className="flex flex-wrap gap-1 mt-1">{med.contraindications.map((c: string, i: number) => <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded">{c}</span>)}</div></div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3"><span className="text-xs font-semibold text-blue-700 uppercase">{t("pages.clinicalSeo.conditionPage.nursingConsiderations")}</span><p className="text-sm text-blue-800 mt-1">{med.nursingConsiderations}</p></div>
        </div>
      )}
    </div>
  );
}
