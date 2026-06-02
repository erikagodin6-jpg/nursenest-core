import { Link, useRoute } from "wouter";
import { useState } from "react";
import {
  FileText, ChevronRight, BookOpen, Brain, HelpCircle, ArrowRight,
  AlertTriangle, Star, Pill, Calculator, Shield, Search
} from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";
import { PHARMTECH_SIG_CODES, getSigCodePageBySlug, type SigCodePage } from "@/allied/data/pharmtech-sig-codes-data";

function SigCodeDetailPage({ page }: { page: SigCodePage }) {
  const [revealedQuestions, setRevealedQuestions] = useState<Record<number, number>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const categories = [...new Set(page.codes.map(c => c.category))];
  const filteredCodes = page.codes.filter(c =>
    searchQuery === "" ||
    c.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.latin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <AlliedSEO
        title={page.metaTitle}
        description={page.metaDescription}
        keywords={page.keywords}
        canonicalPath={`/allied-health/pharmacy-technician/sig-codes/${page.slug}`}
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
              { "@type": "ListItem", position: 3, name: "Sig Codes", item: "https://www.nursenest.ca/allied-health/pharmacy-technician/sig-codes" },
              { "@type": "ListItem", position: 4, name: page.title, item: `https://www.nursenest.ca/allied-health/pharmacy-technician/sig-codes/${page.slug}` },
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

      <div data-testid={`sig-codes-detail-${page.slug}`}>
        <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
              <Link href="/allied-health" className="hover:text-green-600">Allied Health</Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <Link href="/allied-health/pharmacy-technician" className="hover:text-green-600">Pharmacy Tech</Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <Link href="/allied-health/pharmacy-technician/sig-codes" className="hover:text-green-600">Sig Codes</Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <span className="text-green-700 font-medium">{page.title.split(" ").slice(0, 3).join(" ")}...</span>
            </nav>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
              <FileText className="w-4 h-4" /> Sig Code Reference
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-3" data-testid="text-sig-title">{page.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{page.description}</p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
          {page.codes.length > 0 && (
            <section>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search sig codes..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  data-testid="input-search-sig-codes"
                />
              </div>

              {categories.map(cat => {
                const codesInCat = filteredCodes.filter(c => c.category === cat);
                if (codesInCat.length === 0) return null;
                return (
                  <div key={cat} className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2" data-testid={`section-category-${cat.toLowerCase().replace(/\s+/g, "-")}`}>
                      {cat}
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-3 font-semibold text-gray-600 w-24">Code</th>
                            <th className="text-left py-2 px-3 font-semibold text-gray-600">Latin</th>
                            <th className="text-left py-2 px-3 font-semibold text-gray-600">Meaning</th>
                            <th className="text-left py-2 px-3 font-semibold text-gray-600">Example</th>
                          </tr>
                        </thead>
                        <tbody>
                          {codesInCat.map((code, i) => (
                            <tr key={i} className={`border-b border-gray-100 ${code.dangerousAbbreviation ? "bg-red-50" : ""}`}>
                              <td className="py-2.5 px-3 font-mono font-bold text-gray-900">
                                {code.abbreviation}
                                {code.dangerousAbbreviation && (
                                  <span className="ml-1 inline-flex items-center">
                                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-gray-500 italic">{code.latin || "—"}</td>
                              <td className="py-2.5 px-3 text-gray-700">
                                {code.meaning}
                                {code.doNotUseAlternative && (
                                  <span className="block text-xs text-red-600 mt-0.5">Use instead: {code.doNotUseAlternative}</span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-gray-500 text-xs">{code.examples[0]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2" data-testid="section-practice">
              <BookOpen className="w-5 h-5 text-green-600" /> Practice Questions
            </h2>
            <div className="space-y-6">
              {page.practiceQuestions.map((q, qi) => (
                <div key={qi} className="border border-gray-200 rounded-xl p-5" data-testid={`sig-question-${qi}`}>
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

          <section className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Ready to test your knowledge?</h2>
            <p className="text-green-100 mb-6 max-w-lg mx-auto">Practice translating complete prescriptions and master sig codes with our interactive study tools.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/allied-health/pharmacy-technician/flashcards" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 rounded-xl text-sm font-bold hover:bg-green-50 transition-all" data-testid="button-sig-flashcards">
                <Brain className="w-4 h-4" /> Start Flashcards
              </Link>
              <Link href="/allied-health/pharmacy-technician/practice-exam-questions" className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-400 border border-green-400 transition-all" data-testid="button-sig-practice">
                <BookOpen className="w-4 h-4" /> Practice Questions
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export function PharmTechSigCodesHub() {
  return (
    <>
      <AlliedSEO
        title="Pharmacy Sig Codes Reference Guide | PTCB Exam Prep"
        description="Complete sig code reference for pharmacy technicians. Common prescription abbreviations, dangerous abbreviations, ISMP Do-Not-Use list, and translation practice."
        keywords="sig codes, pharmacy abbreviations, prescription abbreviations, PTCB exam, pharmacy technician, ISMP"
        canonicalPath="/allied-health/pharmacy-technician/sig-codes"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Pharmacy Sig Codes Reference",
          provider: { "@type": "Organization", name: "NurseNest Allied" },
        }}
        additionalStructuredData={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Allied Health", item: "https://www.nursenest.ca/allied-health" },
              { "@type": "ListItem", position: 2, name: "Pharmacy Technician", item: "https://www.nursenest.ca/allied-health/pharmacy-technician" },
              { "@type": "ListItem", position: 3, name: "Sig Codes", item: "https://www.nursenest.ca/allied-health/pharmacy-technician/sig-codes" },
            ],
          },
        ]}
      />

      <div data-testid="pharmtech-sig-codes-hub">
        <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/allied-health" className="hover:text-green-600">Allied Health</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/allied-health/pharmacy-technician" className="hover:text-green-600">Pharmacy Tech</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-green-700 font-medium">Sig Codes</span>
            </nav>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
              <FileText className="w-4 h-4" /> Sig Code Reference Cluster
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4" data-testid="text-sig-hub-title">
              Sig Code <span className="text-green-600">Reference</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl">Master prescription abbreviations for the PTCB exam. Learn common sig codes, dangerous abbreviations, and practice translating full prescriptions.</p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PHARMTECH_SIG_CODES.map(page => (
              <Link key={page.slug} href={`/allied-health/pharmacy-technician/sig-codes/${page.slug}`} className="group block border border-gray-200 rounded-xl p-5 hover:border-green-300 hover:shadow-md transition-all" data-testid={`card-sig-${page.slug}`}>
                <FileText className="w-6 h-6 text-green-600 mb-3" />
                <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2">{page.title}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{page.description}</p>
                <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                  {page.codes.length > 0 ? `${page.codes.length} codes` : ""}{page.codes.length > 0 && page.practiceQuestions.length > 0 ? " · " : ""}{page.practiceQuestions.length} practice questions
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
            <Link href="/allied-health/pharmacy-technician/law" className="block border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-all">
              <Shield className="w-5 h-5 text-green-600 mb-2" />
              <h3 className="font-semibold text-sm text-gray-900">Pharmacy Law</h3>
              <p className="text-xs text-gray-500 mt-1">DEA schedules and HIPAA</p>
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

export function PharmTechSigCodeDetailRoute() {
  const [, params] = useRoute("/allied-health/pharmacy-technician/sig-codes/:slug");
  const slug = params?.slug;
  if (!slug) return null;
  const page = getSigCodePageBySlug(slug);
  if (!page) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <Link href="/allied-health/pharmacy-technician/sig-codes" className="text-green-600 hover:text-green-700 font-medium">Browse Sig Codes</Link>
      </div>
    );
  }
  return <SigCodeDetailPage page={page} />;
}
