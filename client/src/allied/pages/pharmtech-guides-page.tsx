import { Link, useRoute } from "wouter";
import { useState } from "react";
import {
  BookOpen, ChevronRight, Brain, HelpCircle, ArrowRight, CheckCircle2,
  Star, Pill, Calculator, FileText, Shield, Clock, User
} from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";
import { PHARMTECH_GUIDES, getGuideBySlug, type PharmTechGuide } from "@/allied/data/pharmtech-guides-data";

function GuideDetailPage({ guide }: { guide: PharmTechGuide }) {
  const [revealedQuestions, setRevealedQuestions] = useState<Record<number, number>>({});

  return (
    <>
      <AlliedSEO
        title={guide.metaTitle}
        description={guide.metaDescription}
        keywords={guide.keywords}
        canonicalPath={`/allied-health/pharmacy-technician/guides/${guide.slug}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          name: guide.metaTitle,
          description: guide.metaDescription,
          author: { "@type": "Organization", name: guide.author },
          datePublished: guide.publishDate,
          provider: { "@type": "Organization", name: "NurseNest Allied" },
        }}
        additionalStructuredData={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Allied Health", item: "https://www.nursenest.ca/allied-health" },
              { "@type": "ListItem", position: 2, name: "Pharmacy Technician", item: "https://www.nursenest.ca/allied-health/pharmacy-technician" },
              { "@type": "ListItem", position: 3, name: "Guides", item: "https://www.nursenest.ca/allied-health/pharmacy-technician/guides" },
              { "@type": "ListItem", position: 4, name: guide.title, item: `https://www.nursenest.ca/allied-health/pharmacy-technician/guides/${guide.slug}` },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: guide.faqs.map(f => ({
              "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />

      <div data-testid={`guide-detail-${guide.slug}`}>
        <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
              <Link href="/allied-health" className="hover:text-green-600">Allied Health</Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <Link href="/allied-health/pharmacy-technician" className="hover:text-green-600">Pharmacy Tech</Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <Link href="/allied-health/pharmacy-technician/guides" className="hover:text-green-600">Guides</Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <span className="text-green-700 font-medium">{guide.title.split(":")[0]}</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-3" data-testid="text-guide-title">{guide.title}</h1>
            <p className="text-lg text-gray-600 mb-4">{guide.heroSubtitle}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><User className="w-4 h-4" /> {guide.author}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {guide.readTime}</span>
              <span>{guide.publishDate}</span>
            </div>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-10">
            <h2 className="font-bold text-green-800 mb-3 flex items-center gap-2">
              <Star className="w-5 h-5" /> Key Takeaways
            </h2>
            <ul className="space-y-2">
              {guide.keyTakeaways.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-green-900">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-green-200 rounded-xl p-5 mb-10">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-green-600" />
              <span className="font-bold text-gray-900">Study smarter, not harder</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">Pair this guide with our interactive flashcards and practice questions for maximum retention.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/allied-health/pharmacy-technician/flashcards" className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-all" data-testid="button-guide-flashcards">
                <Brain className="w-4 h-4" /> Study Flashcards
              </Link>
              <Link href="/allied-health/pharmacy-technician/practice-exam-questions" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-green-700 rounded-xl text-sm font-semibold border border-green-200 hover:bg-green-50 transition-all" data-testid="button-guide-practice">
                <BookOpen className="w-4 h-4" /> Practice Questions
              </Link>
            </div>
          </div>

          <article className="prose prose-gray max-w-none space-y-10">
            {guide.sections.map((section, si) => (
              <section key={si}>
                <h2 className="text-xl font-bold text-gray-900 mb-3" data-testid={`guide-section-${si}`}>{section.heading}</h2>
                <p className="text-gray-700 leading-relaxed mb-4">{section.content}</p>
                {section.tips && section.tips.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-5 not-prose">
                    <ul className="space-y-2">
                      {section.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}
          </article>

          {guide.practiceQuestions.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2" data-testid="section-practice">
                <BookOpen className="w-5 h-5 text-green-600" /> Practice Questions
              </h2>
              <div className="space-y-6">
                {guide.practiceQuestions.map((q, qi) => (
                  <div key={qi} className="border border-gray-200 rounded-xl p-5" data-testid={`guide-question-${qi}`}>
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
          )}

          <section className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2" data-testid="section-faqs">
              <HelpCircle className="w-5 h-5 text-green-600" /> FAQ
            </h2>
            <div className="space-y-4">
              {guide.faqs.map((f, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-2">{f.q}</h3>
                  <p className="text-gray-600 text-sm">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {guide.relatedGuides.length > 0 && (
            <section className="mt-12">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Related Guides</h2>
              <div className="space-y-3">
                {guide.relatedGuides.map(slug => {
                  const related = getGuideBySlug(slug);
                  if (!related) return null;
                  return (
                    <Link key={slug} href={`/allied-health/pharmacy-technician/guides/${slug}`} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-green-300 transition-all group" data-testid={`link-related-guide-${slug}`}>
                      <div>
                        <h3 className="font-medium text-gray-900 group-hover:text-green-600">{related.title}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">{related.readTime}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-500" />
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {(guide.relatedMedications.length > 0 || guide.relatedCalculations.length > 0) && (
            <section className="mt-12">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Related Content</h2>
              <div className="flex flex-wrap gap-2">
                {guide.relatedMedications.map(slug => (
                  <Link key={slug} href={`/allied-health/pharmacy-technician/medications/${slug}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-green-300 hover:text-green-700 transition-all" data-testid={`link-med-${slug}`}>
                    <Pill className="w-3.5 h-3.5" /> {slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                  </Link>
                ))}
                {guide.relatedCalculations.map(slug => (
                  <Link key={slug} href={`/allied-health/pharmacy-technician/calculations/${slug}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-green-300 hover:text-green-700 transition-all" data-testid={`link-calc-${slug}`}>
                    <Calculator className="w-3.5 h-3.5" /> {slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="mt-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Start studying for the PTCB exam today</h2>
            <p className="text-green-100 mb-6 max-w-lg mx-auto">Join thousands of pharmacy technician students using our flashcards, practice questions, and mock exams.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/allied-health/pharmacy-technician/flashcards" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 rounded-xl text-sm font-bold hover:bg-green-50 transition-all" data-testid="button-guide-bottom-flashcards">
                <Brain className="w-4 h-4" /> Start Flashcards
              </Link>
              <Link href="/allied-health/pharmacy-technician/mock-exams" className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-400 border border-green-400 transition-all" data-testid="button-guide-bottom-mock">
                <FileText className="w-4 h-4" /> Take Mock Exam
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export function PharmTechGuidesHub() {
  return (
    <>
      <AlliedSEO
        title="Pharmacy Technician Study Guides | PTCB Exam Prep Articles"
        description="Expert study guides for pharmacy technician certification. PTCB exam strategy, top 200 drugs memorization, pharmacy math cheat sheet, and more."
        keywords="pharmacy technician guides, PTCB study guide, pharmacy tech articles, exam prep, pharmacy technician blog"
        canonicalPath="/allied-health/pharmacy-technician/guides"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Pharmacy Technician Study Guides",
          provider: { "@type": "Organization", name: "NurseNest Allied" },
        }}
        additionalStructuredData={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Allied Health", item: "https://www.nursenest.ca/allied-health" },
              { "@type": "ListItem", position: 2, name: "Pharmacy Technician", item: "https://www.nursenest.ca/allied-health/pharmacy-technician" },
              { "@type": "ListItem", position: 3, name: "Guides", item: "https://www.nursenest.ca/allied-health/pharmacy-technician/guides" },
            ],
          },
        ]}
      />

      <div data-testid="pharmtech-guides-hub">
        <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/allied-health" className="hover:text-green-600">Allied Health</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/allied-health/pharmacy-technician" className="hover:text-green-600">Pharmacy Tech</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-green-700 font-medium">Guides</span>
            </nav>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" /> Study Guides
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4" data-testid="text-guides-hub-title">
              Study <span className="text-green-600">Guides</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl">Expert articles to help you prepare for the PTCB exam — study strategies, drug memorization techniques, and pharmacy math cheat sheets.</p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PHARMTECH_GUIDES.map(guide => (
              <Link key={guide.slug} href={`/allied-health/pharmacy-technician/guides/${guide.slug}`} className="group block border border-gray-200 rounded-xl overflow-hidden hover:border-green-300 hover:shadow-md transition-all" data-testid={`card-guide-${guide.slug}`}>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Clock className="w-3.5 h-3.5" /> {guide.readTime}
                    <span>·</span>
                    <span>{guide.publishDate}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2">{guide.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-3">{guide.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm text-green-600 font-medium">
                    Read guide <ArrowRight className="w-4 h-4" />
                  </div>
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
            <Link href="/allied-health/pharmacy-technician/law" className="block border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-all">
              <Shield className="w-5 h-5 text-green-600 mb-2" />
              <h3 className="font-semibold text-sm text-gray-900">Pharmacy Law</h3>
              <p className="text-xs text-gray-500 mt-1">DEA schedules and HIPAA</p>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

export function PharmTechGuideDetailRoute() {
  const [, params] = useRoute("/allied-health/pharmacy-technician/guides/:slug");
  const slug = params?.slug;
  if (!slug) return null;
  const guide = getGuideBySlug(slug);
  if (!guide) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Guide Not Found</h1>
        <Link href="/allied-health/pharmacy-technician/guides" className="text-green-600 hover:text-green-700 font-medium">Browse All Guides</Link>
      </div>
    );
  }
  return <GuideDetailPage guide={guide} />;
}
