import { Link, useRoute } from "wouter";
import { useState } from "react";
import {
  Shield, ChevronRight, BookOpen, Brain, HelpCircle, ArrowRight,
  CheckCircle2, AlertTriangle, Star, Pill, Calculator, FileText
} from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";
import { PHARMTECH_LAW_PAGES, getLawPageBySlug, type PharmTechLawPage } from "@/allied/data/pharmtech-law-safety-data";

function LawDetailPage({ page }: { page: PharmTechLawPage }) {
  const [revealedQuestions, setRevealedQuestions] = useState<Record<number, number>>({});

  return (
    <>
      <AlliedSEO
        title={page.metaTitle}
        description={page.metaDescription}
        keywords={page.keywords}
        canonicalPath={`/allied-health/pharmacy-technician/law/${page.slug}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          name: page.metaTitle,
          description: page.metaDescription,
          provider: { "@type": "Organization", name: "NurseNest Allied" },
        }}
        additionalStructuredData={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Allied Health", item: "https://www.nursenest.ca/allied-health" },
              { "@type": "ListItem", position: 2, name: "Pharmacy Technician", item: "https://www.nursenest.ca/allied-health/pharmacy-technician" },
              { "@type": "ListItem", position: 3, name: "Law & Safety", item: "https://www.nursenest.ca/allied-health/pharmacy-technician/law" },
              { "@type": "ListItem", position: 4, name: page.title, item: `https://www.nursenest.ca/allied-health/pharmacy-technician/law/${page.slug}` },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: page.faqs.map(f => ({
              "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />

      <div data-testid={`law-detail-${page.slug}`}>
        <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
              <Link href="/allied-health" className="hover:text-green-600">Allied Health</Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <Link href="/allied-health/pharmacy-technician" className="hover:text-green-600">Pharmacy Tech</Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <Link href="/allied-health/pharmacy-technician/law" className="hover:text-green-600">Law & Safety</Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <span className="text-green-700 font-medium">{page.title.split(" ").slice(0, 3).join(" ")}...</span>
            </nav>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
              <Shield className="w-4 h-4" /> Law & Safety
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-3" data-testid="text-law-title">{page.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{page.description}</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/allied-health/pharmacy-technician/flashcards" className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-all" data-testid="button-law-flashcards">
                <Brain className="w-4 h-4" /> Study Flashcards
              </Link>
              <Link href="/allied-health/pharmacy-technician/practice-exam-questions" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-green-700 rounded-xl text-sm font-semibold border border-green-200 hover:bg-green-50 transition-all" data-testid="button-law-practice">
                <BookOpen className="w-4 h-4" /> Practice Questions
              </Link>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
          {page.sections.map((section, si) => (
            <section key={si}>
              <h2 className="text-xl font-bold text-gray-900 mb-4" data-testid={`section-${si}`}>{section.heading}</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">{section.content}</p>
              {section.keyPoints.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Key Points</h3>
                  <ul className="space-y-2">
                    {section.keyPoints.map((kp, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{kp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          ))}

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2" data-testid="section-practice">
              <BookOpen className="w-5 h-5 text-green-600" /> Practice Questions
            </h2>
            <div className="space-y-6">
              {page.practiceQuestions.map((q, qi) => (
                <div key={qi} className="border border-gray-200 rounded-xl p-5" data-testid={`law-question-${qi}`}>
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
              {page.faqs.map((f, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-2">{f.q}</h3>
                  <p className="text-gray-600 text-sm">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {page.relatedPages.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Related Topics</h2>
              <div className="flex flex-wrap gap-3">
                {page.relatedPages.map(slug => {
                  const related = getLawPageBySlug(slug);
                  if (!related) return null;
                  return (
                    <Link key={slug} href={`/allied-health/pharmacy-technician/law/${slug}`} className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-green-300 hover:text-green-700 transition-all" data-testid={`link-related-law-${slug}`}>
                      <Shield className="w-4 h-4" /> {related.title.split("&")[0].trim().split("–")[0].trim()}
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <section className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Master pharmacy law for the PTCB</h2>
            <p className="text-green-100 mb-6 max-w-lg mx-auto">Practice with hundreds of law and regulation questions covering DEA schedules, HIPAA, and patient safety.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/allied-health/pharmacy-technician/flashcards" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 rounded-xl text-sm font-bold hover:bg-green-50 transition-all" data-testid="button-law-bottom-flashcards">
                <Brain className="w-4 h-4" /> Start Flashcards
              </Link>
              <Link href="/allied-health/pharmacy-technician/practice-exam-questions" className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-400 border border-green-400 transition-all" data-testid="button-law-bottom-practice">
                <BookOpen className="w-4 h-4" /> Practice Questions
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export function PharmTechLawHub() {
  return (
    <>
      <AlliedSEO
        title="Pharmacy Law & Safety Guide | PTCB Exam Prep for Pharmacy Technicians"
        description="Master pharmacy law for the PTCB exam. DEA controlled substance schedules, medication safety, HIPAA privacy, pharmacy operations, and practice questions."
        keywords="pharmacy law, DEA schedules, controlled substances, HIPAA, medication safety, PTCB exam, pharmacy technician"
        canonicalPath="/allied-health/pharmacy-technician/law"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Pharmacy Law & Safety Guide",
          provider: { "@type": "Organization", name: "NurseNest Allied" },
        }}
        additionalStructuredData={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Allied Health", item: "https://www.nursenest.ca/allied-health" },
              { "@type": "ListItem", position: 2, name: "Pharmacy Technician", item: "https://www.nursenest.ca/allied-health/pharmacy-technician" },
              { "@type": "ListItem", position: 3, name: "Law & Safety", item: "https://www.nursenest.ca/allied-health/pharmacy-technician/law" },
            ],
          },
        ]}
      />

      <div data-testid="pharmtech-law-hub">
        <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/allied-health" className="hover:text-green-600">Allied Health</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/allied-health/pharmacy-technician" className="hover:text-green-600">Pharmacy Tech</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-green-700 font-medium">Law & Safety</span>
            </nav>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
              <Shield className="w-4 h-4" /> Law & Safety Cluster
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4" data-testid="text-law-hub-title">
              Pharmacy Law & <span className="text-green-600">Safety</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl">Master the legal and safety knowledge tested on the PTCB exam — controlled substances, medication safety, HIPAA, and pharmacy operations.</p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid sm:grid-cols-2 gap-6">
            {PHARMTECH_LAW_PAGES.map(page => (
              <Link key={page.slug} href={`/allied-health/pharmacy-technician/law/${page.slug}`} className="group block border border-gray-200 rounded-xl p-5 hover:border-green-300 hover:shadow-md transition-all" data-testid={`card-law-${page.slug}`}>
                <Shield className="w-6 h-6 text-green-600 mb-3" />
                <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2">{page.title}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{page.description}</p>
                <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                  {page.sections.length} sections · {page.practiceQuestions.length} practice questions
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Explore More</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/allied-health/pharmacy-technician/medications" className="block border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-all">
              <Pill className="w-5 h-5 text-green-600 mb-2" />
              <h3 className="font-semibold text-sm text-gray-900">Medications</h3>
              <p className="text-xs text-gray-500 mt-1">50+ drug study guides</p>
            </Link>
            <Link href="/allied-health/pharmacy-technician/calculations" className="block border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-all">
              <Calculator className="w-5 h-5 text-green-600 mb-2" />
              <h3 className="font-semibold text-sm text-gray-900">Calculations</h3>
              <p className="text-xs text-gray-500 mt-1">Pharmacy math tutorials</p>
            </Link>
            <Link href="/allied-health/pharmacy-technician/sig-codes" className="block border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-all">
              <FileText className="w-5 h-5 text-green-600 mb-2" />
              <h3 className="font-semibold text-sm text-gray-900">Sig Codes</h3>
              <p className="text-xs text-gray-500 mt-1">Prescription abbreviations</p>
            </Link>
            <Link href="/allied-health/pharmacy-technician/guides" className="block border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-all">
              <BookOpen className="w-5 h-5 text-green-600 mb-2" />
              <h3 className="font-semibold text-sm text-gray-900">Study Guides</h3>
              <p className="text-xs text-gray-500 mt-1">PTCB exam strategies</p>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

export function PharmTechLawDetailRoute() {
  const [, params] = useRoute("/allied-health/pharmacy-technician/law/:slug");
  const slug = params?.slug;
  if (!slug) return null;
  const page = getLawPageBySlug(slug);
  if (!page) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <Link href="/allied-health/pharmacy-technician/law" className="text-green-600 hover:text-green-700 font-medium">Browse Law & Safety</Link>
      </div>
    );
  }
  return <LawDetailPage page={page} />;
}
