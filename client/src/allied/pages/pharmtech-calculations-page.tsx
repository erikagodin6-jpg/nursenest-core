import { Link, useRoute } from "wouter";
import { useState } from "react";
import {
  Calculator, ChevronRight, BookOpen, Brain, ArrowRight, HelpCircle,
  CheckCircle2, AlertTriangle, Star, Lightbulb, Pill, Shield, FileText
} from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";
import { PHARMTECH_CALCULATIONS, getCalculationBySlug, type PharmTechCalculation } from "@/allied/data/pharmtech-calculations-data";

function CalculationDetailPage({ calc }: { calc: PharmTechCalculation }) {
  const [revealedQuestions, setRevealedQuestions] = useState<Record<number, number>>({});

  return (
    <>
      <AlliedSEO
        title={calc.metaTitle}
        description={calc.metaDescription}
        keywords={calc.keywords}
        canonicalPath={`/allied-health/pharmacy-technician/calculations/${calc.slug}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          name: calc.metaTitle,
          description: calc.metaDescription,
          provider: { "@type": "Organization", name: "NurseNest Allied" },
        }}
        additionalStructuredData={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Allied Health", item: "https://www.nursenest.ca/allied-health" },
              { "@type": "ListItem", position: 2, name: "Pharmacy Technician", item: "https://www.nursenest.ca/allied-health/pharmacy-technician" },
              { "@type": "ListItem", position: 3, name: "Calculations", item: "https://www.nursenest.ca/allied-health/pharmacy-technician/calculations" },
              { "@type": "ListItem", position: 4, name: calc.title, item: `https://www.nursenest.ca/allied-health/pharmacy-technician/calculations/${calc.slug}` },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: calc.faqs.map(f => ({
              "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />

      <div data-testid={`calculation-detail-${calc.slug}`}>
        <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
              <Link href="/allied-health" className="hover:text-green-600">Allied Health</Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <Link href="/allied-health/pharmacy-technician" className="hover:text-green-600">Pharmacy Tech</Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <Link href="/allied-health/pharmacy-technician/calculations" className="hover:text-green-600">Calculations</Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <span className="text-green-700 font-medium">{calc.title}</span>
            </nav>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
              <Calculator className="w-4 h-4" /> Pharmacy Calculations
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-3" data-testid="text-calc-title">{calc.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{calc.description}</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/allied-health/pharmacy-technician/flashcards" className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-all" data-testid="button-calc-flashcards">
                <Brain className="w-4 h-4" /> Study Flashcards
              </Link>
              <Link href="/allied-health/pharmacy-technician/practice-exam-questions" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-green-700 rounded-xl text-sm font-semibold border border-green-200 hover:bg-green-50 transition-all" data-testid="button-calc-practice">
                <BookOpen className="w-4 h-4" /> Practice Questions
              </Link>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2" data-testid="section-formulas">
              <Calculator className="w-5 h-5 text-green-600" /> Key Formulas
            </h2>
            <div className="space-y-4">
              {calc.formulas.map((f, i) => (
                <div key={i} className="bg-green-50 border border-green-200 rounded-xl p-5">
                  <h3 className="font-bold text-green-800 mb-2">{f.name}</h3>
                  <div className="bg-white rounded-lg p-3 font-mono text-green-900 text-lg mb-2 whitespace-pre-wrap">{f.formula}</div>
                  <p className="text-sm text-green-700">{f.explanation}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2" data-testid="section-examples">
              <Lightbulb className="w-5 h-5 text-amber-500" /> Worked Examples
            </h2>
            <div className="space-y-6">
              {calc.workedExamples.map((ex, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">{ex.problem}</h3>
                  <div className="space-y-2 mb-3">
                    {ex.steps.map((step, si) => (
                      <div key={si} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">{si + 1}</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 font-semibold text-green-800">
                    Answer: {ex.answer}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2" data-testid="section-mistakes">
              <AlertTriangle className="w-5 h-5" /> Common Mistakes
            </h2>
            <ul className="space-y-2">
              {calc.commonMistakes.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-amber-900 text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2" data-testid="section-shortcuts">
              <Star className="w-5 h-5" /> Exam Shortcuts
            </h2>
            <ul className="space-y-2">
              {calc.examShortcuts.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-green-900 text-sm">
                  <Star className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2" data-testid="section-practice">
              <BookOpen className="w-5 h-5 text-green-600" /> Practice Questions
            </h2>
            <div className="space-y-6">
              {calc.practiceQuestions.map((q, qi) => (
                <div key={qi} className="border border-gray-200 rounded-xl p-5" data-testid={`calc-question-${qi}`}>
                  <p className="font-medium text-gray-900 mb-3">{q.stem}</p>
                  <div className="space-y-2 mb-3">
                    {q.options.map((opt, oi) => {
                      const revealed = revealedQuestions[qi] !== undefined;
                      const isCorrect = oi === q.correctIndex;
                      const isSelected = revealedQuestions[qi] === oi;
                      let cls = "w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all ";
                      if (!revealed) cls += "border-gray-200 hover:border-green-300 hover:bg-green-50";
                      else if (isCorrect) cls += "border-green-500 bg-green-50 text-green-800 font-medium";
                      else if (isSelected) cls += "border-red-300 bg-red-50 text-red-700";
                      else cls += "border-gray-200 text-gray-500";
                      return (
                        <button key={oi} onClick={() => !revealed && setRevealedQuestions(p => ({ ...p, [qi]: oi }))} className={cls} disabled={revealed}>
                          <span className="font-medium mr-2">{String.fromCharCode(65 + oi)}.</span> {opt}
                        </button>
                      );
                    })}
                  </div>
                  {revealedQuestions[qi] !== undefined && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                      <span className="font-semibold">Rationale:</span> {q.rationale}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2" data-testid="section-faqs">
              <HelpCircle className="w-5 h-5 text-green-600" /> FAQ
            </h2>
            <div className="space-y-4">
              {calc.faqs.map((f, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-2">{f.q}</h3>
                  <p className="text-gray-600 text-sm">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {calc.relatedCalculations.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Related Calculations</h2>
              <div className="flex flex-wrap gap-3">
                {calc.relatedCalculations.map(slug => {
                  const related = getCalculationBySlug(slug);
                  if (!related) return null;
                  return (
                    <Link key={slug} href={`/allied-health/pharmacy-technician/calculations/${slug}`} className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-green-300 hover:text-green-700 transition-all" data-testid={`link-related-calc-${slug}`}>
                      <Calculator className="w-4 h-4" /> {related.title}
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <section className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3" data-testid="text-calc-bottom-cta">Master pharmacy calculations</h2>
            <p className="text-green-100 mb-6 max-w-lg mx-auto">Practice with hundreds of calculation questions and get instant feedback with detailed step-by-step solutions.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/allied-health/pharmacy-technician/flashcards" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 rounded-xl text-sm font-bold hover:bg-green-50 transition-all" data-testid="button-calc-bottom-flashcards">
                <Brain className="w-4 h-4" /> Start Flashcards
              </Link>
              <Link href="/allied-health/pharmacy-technician/practice-exam-questions" className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-400 border border-green-400 transition-all" data-testid="button-calc-bottom-practice">
                <BookOpen className="w-4 h-4" /> Practice Questions
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export function PharmTechCalculationsHub() {
  return (
    <>
      <AlliedSEO
        title="Pharmacy Calculations Guide | PTCB Exam Prep for Pharmacy Technicians"
        description="Master pharmacy math for the PTCB exam. Dosage calculations, IV flow rates, days supply, concentrations, alligation, BSA, and ratio-proportion with worked examples."
        keywords="pharmacy calculations, pharmacy math, PTCB exam, dosage calculations, IV flow rate, days supply, pharmacy technician"
        canonicalPath="/allied-health/pharmacy-technician/calculations"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Pharmacy Calculations Guide for PTCB Exam",
          description: "8 essential pharmacy calculation types with formulas, worked examples, and practice problems.",
          provider: { "@type": "Organization", name: "NurseNest Allied" },
        }}
        additionalStructuredData={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Allied Health", item: "https://www.nursenest.ca/allied-health" },
              { "@type": "ListItem", position: 2, name: "Pharmacy Technician", item: "https://www.nursenest.ca/allied-health/pharmacy-technician" },
              { "@type": "ListItem", position: 3, name: "Calculations", item: "https://www.nursenest.ca/allied-health/pharmacy-technician/calculations" },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "How many math questions are on the PTCB exam?", acceptedAnswer: { "@type": "Answer", text: "Approximately 10-15% of PTCB questions involve pharmacy calculations, which means roughly 7-12 questions out of 80 scored questions. Common topics include dosage calculations, IV flow rates, days supply, and concentration/dilution." } },
              { "@type": "Question", name: "What calculator is allowed on the PTCB exam?", acceptedAnswer: { "@type": "Answer", text: "A basic on-screen calculator is provided during the computer-based PTCB exam. You cannot bring your own calculator. Practice with basic calculator functions before exam day." } },
            ],
          },
        ]}
      />

      <div data-testid="pharmtech-calculations-hub">
        <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/allied-health" className="hover:text-green-600">Allied Health</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/allied-health/pharmacy-technician" className="hover:text-green-600">Pharmacy Tech</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-green-700 font-medium">Calculations</span>
            </nav>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
              <Calculator className="w-4 h-4" /> Pharmacy Math Cluster
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4" data-testid="text-calc-hub-title">
              Pharmacy <span className="text-green-600">Calculations</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl">Master every calculation type tested on the PTCB exam with step-by-step formulas, worked examples, common mistakes, and practice problems.</p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PHARMTECH_CALCULATIONS.map(calc => (
              <Link key={calc.slug} href={`/allied-health/pharmacy-technician/calculations/${calc.slug}`} className="group block border border-gray-200 rounded-xl p-5 hover:border-green-300 hover:shadow-md transition-all" data-testid={`card-calc-${calc.slug}`}>
                <Calculator className="w-6 h-6 text-green-600 mb-3" />
                <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2">{calc.title}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{calc.description}</p>
                <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                  {calc.formulas.length} formula{calc.formulas.length !== 1 ? "s" : ""} · {calc.practiceQuestions.length} practice questions
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Explore More</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/allied-health/pharmacy-technician/medications" className="block border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-all" data-testid="link-explore-meds">
              <Pill className="w-5 h-5 text-green-600 mb-2" />
              <h3 className="font-semibold text-sm text-gray-900">Medications Guide</h3>
              <p className="text-xs text-gray-500 mt-1">50+ drugs with brand/generic names</p>
            </Link>
            <Link href="/allied-health/pharmacy-technician/sig-codes" className="block border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-all" data-testid="link-explore-sigs">
              <FileText className="w-5 h-5 text-green-600 mb-2" />
              <h3 className="font-semibold text-sm text-gray-900">Sig Codes</h3>
              <p className="text-xs text-gray-500 mt-1">Prescription abbreviations</p>
            </Link>
            <Link href="/allied-health/pharmacy-technician/law" className="block border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-all" data-testid="link-explore-law">
              <Shield className="w-5 h-5 text-green-600 mb-2" />
              <h3 className="font-semibold text-sm text-gray-900">Pharmacy Law</h3>
              <p className="text-xs text-gray-500 mt-1">DEA schedules and HIPAA</p>
            </Link>
            <Link href="/allied-health/pharmacy-technician/guides" className="block border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-all" data-testid="link-explore-guides">
              <BookOpen className="w-5 h-5 text-green-600 mb-2" />
              <h3 className="font-semibold text-sm text-gray-900">Study Guides</h3>
              <p className="text-xs text-gray-500 mt-1">PTCB exam strategies and tips</p>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

export function PharmTechCalculationDetailRoute() {
  const [, params] = useRoute("/allied-health/pharmacy-technician/calculations/:slug");
  const slug = params?.slug;
  if (!slug) return null;
  const calc = getCalculationBySlug(slug);
  if (!calc) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Calculation Guide Not Found</h1>
        <Link href="/allied-health/pharmacy-technician/calculations" className="text-green-600 hover:text-green-700 font-medium" data-testid="link-back-calculations">Browse All Calculations</Link>
      </div>
    );
  }
  return <CalculationDetailPage calc={calc} />;
}
