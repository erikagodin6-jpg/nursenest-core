import { Link, useRoute } from "wouter";
import { useState } from "react";
import {
  Pill, ChevronRight, BookOpen, Brain, AlertTriangle, CheckCircle2,
  ArrowRight, Search, Shield, Beaker, Heart, Info, HelpCircle,
  FileText, Star, Clock, Package
} from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";
import {
  PHARMTECH_MEDICATIONS, getPharmTechMedicationBySlug, getRelatedMedications,
  type PharmTechMedication
} from "@/allied/data/pharmtech-medications-data";

function MedicationDetailPage({ medication }: { medication: PharmTechMedication }) {
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const related = getRelatedMedications(medication.slug, 4);
  const questionsToShow = showAllQuestions ? medication.practiceQuestions : medication.practiceQuestions.slice(0, 2);

  return (
    <>
      <AlliedSEO
        title={medication.metaTitle}
        description={medication.metaDescription}
        keywords={medication.keywords}
        canonicalPath={`/allied-health/pharmacy-technician/medications/${medication.slug}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          name: medication.metaTitle,
          description: medication.metaDescription,
          provider: { "@type": "Organization", name: "NurseNest Allied", url: "https://www.nursenest.ca/allied-health" },
        }}
        additionalStructuredData={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Allied Health", item: "https://www.nursenest.ca/allied-health" },
              { "@type": "ListItem", position: 2, name: "Pharmacy Technician", item: "https://www.nursenest.ca/allied-health/pharmacy-technician" },
              { "@type": "ListItem", position: 3, name: "Medications", item: "https://www.nursenest.ca/allied-health/pharmacy-technician/medications" },
              { "@type": "ListItem", position: 4, name: medication.genericName, item: `https://www.nursenest.ca/allied-health/pharmacy-technician/medications/${medication.slug}` },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: medication.faqs.map(faq => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          },
        ]}
      />

      <div data-testid={`medication-detail-${medication.slug}`}>
        <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap" data-testid="breadcrumb-nav">
              <Link href="/allied-health" className="hover:text-green-600" data-testid="breadcrumb-allied">Allied Health</Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <Link href="/allied-health/pharmacy-technician" className="hover:text-green-600" data-testid="breadcrumb-pharmtech">Pharmacy Tech</Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <Link href="/allied-health/pharmacy-technician/medications" className="hover:text-green-600" data-testid="breadcrumb-medications">Medications</Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <span className="text-green-700 font-medium">{medication.genericName}</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
              <Pill className="w-4 h-4" />
              {medication.drugClass}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-3" data-testid="text-medication-name">
              {medication.genericName} <span className="text-green-600">({medication.brandNames.join(" / ")})</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6">{medication.mechanism}</p>

            <div className="flex flex-wrap gap-3">
              <Link href="/allied-health/pharmacy-technician/flashcards" className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-all" data-testid="button-flashcards-cta">
                <Brain className="w-4 h-4" /> Study with Flashcards
              </Link>
              <Link href="/allied-health/pharmacy-technician/practice-exam-questions" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-green-700 rounded-xl text-sm font-semibold border border-green-200 hover:bg-green-50 transition-all" data-testid="button-practice-cta">
                <BookOpen className="w-4 h-4" /> Practice Questions
              </Link>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-10">
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" data-testid="section-indications">
                  <Heart className="w-5 h-5 text-green-600" /> Indications
                </h2>
                <ul className="space-y-2">
                  {medication.indications.map((ind, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" data-testid="section-side-effects">
                  <AlertTriangle className="w-5 h-5 text-amber-500" /> Side Effects
                </h2>
                <ul className="space-y-2">
                  {medication.sideEffects.map((se, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                      <span>{se}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" data-testid="section-contraindications">
                  <Shield className="w-5 h-5 text-red-500" /> Contraindications
                </h2>
                <ul className="space-y-2">
                  {medication.contraindications.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" data-testid="section-interactions">
                  <Beaker className="w-5 h-5 text-purple-500" /> Drug Interactions
                </h2>
                <ul className="space-y-2">
                  {medication.interactions.map((inter, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0" />
                      <span>{inter}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" data-testid="section-counseling">
                  <Info className="w-5 h-5 text-blue-500" /> Patient Counseling Points
                </h2>
                <ul className="space-y-2">
                  {medication.patientCounselingPoints.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" data-testid="section-dispensing">
                  <Package className="w-5 h-5 text-indigo-500" /> Dispensing Considerations
                </h2>
                <ul className="space-y-2">
                  {medication.dispensingConsiderations.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" data-testid="section-storage">
                  <Clock className="w-5 h-5 text-gray-500" /> Storage Requirements
                </h2>
                <p className="text-gray-700 bg-gray-50 rounded-xl p-4">{medication.storageRequirements}</p>
              </section>

              {medication.lookAlikeSoundAlike.length > 0 && (
                <section className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <h2 className="text-lg font-bold text-amber-800 mb-3 flex items-center gap-2" data-testid="section-lasa">
                    <AlertTriangle className="w-5 h-5" /> Look-Alike / Sound-Alike (LASA)
                  </h2>
                  <ul className="space-y-1">
                    {medication.lookAlikeSoundAlike.map((pair, i) => (
                      <li key={i} className="text-amber-900 font-medium">{pair}</li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h2 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2" data-testid="section-exam-tips">
                  <Star className="w-5 h-5" /> PTCB Exam Tips
                </h2>
                <ul className="space-y-2">
                  {medication.examTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-green-900">
                      <Star className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2" data-testid="section-practice-questions">
                  <BookOpen className="w-5 h-5 text-green-600" /> Practice Questions
                </h2>
                <div className="space-y-6">
                  {questionsToShow.map((q, qi) => (
                    <PracticeQuestion key={qi} question={q} index={qi} />
                  ))}
                </div>
                {!showAllQuestions && medication.practiceQuestions.length > 2 && (
                  <button
                    onClick={() => setShowAllQuestions(true)}
                    className="mt-4 text-green-600 font-medium hover:text-green-700 flex items-center gap-1"
                    data-testid="button-show-more-questions"
                  >
                    Show {medication.practiceQuestions.length - 2} more questions <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2" data-testid="section-faqs">
                  <HelpCircle className="w-5 h-5 text-green-600" /> Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {medication.faqs.map((faq, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-5">
                      <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-5 sticky top-4">
                <h3 className="font-bold text-green-800 mb-3">Quick Facts</h3>
                <dl className="space-y-3 text-sm">
                  <div><dt className="text-gray-500">Generic</dt><dd className="font-medium text-gray-900">{medication.genericName}</dd></div>
                  <div><dt className="text-gray-500">Brand</dt><dd className="font-medium text-gray-900">{medication.brandNames.join(", ")}</dd></div>
                  <div><dt className="text-gray-500">Drug Class</dt><dd className="font-medium text-gray-900">{medication.drugClass}</dd></div>
                </dl>

                <div className="mt-5 pt-4 border-t border-green-200">
                  <Link href="/allied-health/pharmacy-technician/flashcards" className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-all mb-2" data-testid="sidebar-flashcards-cta">
                    <Brain className="w-4 h-4" /> Study Flashcards
                  </Link>
                  <Link href="/allied-health/pharmacy-technician/mock-exams" className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-white text-green-700 rounded-lg text-sm font-semibold border border-green-200 hover:bg-green-50 transition-all" data-testid="sidebar-mock-exam-cta">
                    <FileText className="w-4 h-4" /> Take Mock Exam
                  </Link>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">Related Medications</h3>
                <div className="space-y-2">
                  {related.map(rel => (
                    <Link key={rel.slug} href={`/allied-health/pharmacy-technician/medications/${rel.slug}`} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 group" data-testid={`link-related-${rel.slug}`}>
                      <div>
                        <span className="text-sm font-medium text-gray-900 group-hover:text-green-600">{rel.genericName}</span>
                        <span className="block text-xs text-gray-500">{rel.brandNames[0]}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">Related Content</h3>
                <div className="space-y-2 text-sm">
                  <Link href={`/allied-health/pharmacy-technician/drug-classes/${medication.drugClassSlug}`} className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium" data-testid="link-drug-class">
                    <Pill className="w-4 h-4" /> {medication.drugClass} Guide
                  </Link>
                  {medication.relatedCalculations.map(calc => (
                    <Link key={calc} href={`/allied-health/pharmacy-technician/calculations/${calc}`} className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium" data-testid={`link-calc-${calc}`}>
                      <Beaker className="w-4 h-4" /> {calc.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    </Link>
                  ))}
                  <Link href="/allied-health/pharmacy-technician/sig-codes/common-sig-codes" className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium" data-testid="link-sig-codes">
                    <FileText className="w-4 h-4" /> Sig Code Reference
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          <section className="mt-16 pt-12 border-t border-gray-200">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-3" data-testid="text-bottom-cta">Ready to ace the PTCB exam?</h2>
              <p className="text-green-100 mb-6 max-w-lg mx-auto">Master {medication.genericName} and hundreds more medications with our comprehensive flashcards, practice questions, and mock exams.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/allied-health/pharmacy-technician/flashcards" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 rounded-xl text-sm font-bold hover:bg-green-50 transition-all" data-testid="button-bottom-flashcards">
                  <Brain className="w-4 h-4" /> Start Flashcards
                </Link>
                <Link href="/allied-health/pharmacy-technician/practice-exam-questions" className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-400 border border-green-400 transition-all" data-testid="button-bottom-practice">
                  <BookOpen className="w-4 h-4" /> Practice Questions
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

function PracticeQuestion({ question, index }: { question: PharmTechMedication["practiceQuestions"][0]; index: number }) {
  const [selected, setSelected] = useState<number | null>(null);
  const isRevealed = selected !== null;

  return (
    <div className="border border-gray-200 rounded-xl p-5" data-testid={`practice-question-${index}`}>
      <p className="font-medium text-gray-900 mb-3">{question.stem}</p>
      <div className="space-y-2 mb-3">
        {question.options.map((opt, oi) => {
          const isCorrect = oi === question.correctIndex;
          const isSelected = selected === oi;
          let classes = "w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all ";
          if (!isRevealed) {
            classes += "border-gray-200 hover:border-green-300 hover:bg-green-50";
          } else if (isCorrect) {
            classes += "border-green-500 bg-green-50 text-green-800 font-medium";
          } else if (isSelected && !isCorrect) {
            classes += "border-red-300 bg-red-50 text-red-700";
          } else {
            classes += "border-gray-200 text-gray-500";
          }
          return (
            <button key={oi} onClick={() => !isRevealed && setSelected(oi)} className={classes} data-testid={`option-${index}-${oi}`} disabled={isRevealed}>
              <span className="font-medium mr-2">{String.fromCharCode(65 + oi)}.</span> {opt}
            </button>
          );
        })}
      </div>
      {isRevealed && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800" data-testid={`rationale-${index}`}>
          <span className="font-semibold">Rationale:</span> {question.rationale}
        </div>
      )}
    </div>
  );
}

export function PharmTechMedicationsHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");

  const drugClasses = [...new Set(PHARMTECH_MEDICATIONS.map(m => m.drugClass))].sort();
  const filteredMeds = PHARMTECH_MEDICATIONS.filter(m => {
    const matchesSearch = searchQuery === "" ||
      m.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.brandNames.some(b => b.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.drugClass.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === "all" || m.drugClass === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <>
      <AlliedSEO
        title="Pharmacy Technician Medication Guide | 50+ Drugs for PTCB Exam Prep"
        description="Comprehensive medication study guide for pharmacy technicians. 50+ drugs with brand/generic names, drug classes, side effects, interactions, and PTCB practice questions."
        keywords="pharmacy technician medications, PTCB drug guide, brand generic names, drug study guide, pharmacy tech exam prep"
        canonicalPath="/allied-health/pharmacy-technician/medications"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Pharmacy Technician Medication Guide",
          description: "50+ medication study guides for the PTCB exam.",
          provider: { "@type": "Organization", name: "NurseNest Allied" },
        }}
        additionalStructuredData={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Allied Health", item: "https://www.nursenest.ca/allied-health" },
              { "@type": "ListItem", position: 2, name: "Pharmacy Technician", item: "https://www.nursenest.ca/allied-health/pharmacy-technician" },
              { "@type": "ListItem", position: 3, name: "Medications", item: "https://www.nursenest.ca/allied-health/pharmacy-technician/medications" },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "How many medications should I know for the PTCB exam?", acceptedAnswer: { "@type": "Answer", text: "You should be familiar with at least the top 200 most prescribed medications, focusing on brand/generic names, drug classes, and key side effects. Our guide covers 50+ of the highest-yield drugs." } },
              { "@type": "Question", name: "What is the best way to study medications for the PTCB?", acceptedAnswer: { "@type": "Answer", text: "Learn drugs by class and suffix (-pril, -olol, -statin) rather than alphabetically. Use flashcards with spaced repetition, take practice quizzes, and focus on high-yield LASA pairs." } },
            ],
          },
        ]}
      />

      <div data-testid="pharmtech-medications-hub">
        <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/allied-health" className="hover:text-green-600">Allied Health</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/allied-health/pharmacy-technician" className="hover:text-green-600">Pharmacy Tech</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-green-700 font-medium">Medications</span>
            </nav>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
              <Pill className="w-4 h-4" /> Medication Study Cluster
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4" data-testid="text-medications-hub-title">
              Medication <span className="text-green-600">Study Guide</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl">Master {PHARMTECH_MEDICATIONS.length}+ medications for the PTCB exam with brand/generic names, drug classes, side effects, interactions, and practice questions.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/allied-health/pharmacy-technician/flashcards" className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 shadow-lg shadow-green-200 transition-all" data-testid="button-hub-flashcards">
                <Brain className="w-4 h-4" /> Study Flashcards
              </Link>
              <Link href="/allied-health/pharmacy-technician/drug-classes" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 rounded-xl text-sm font-semibold border border-green-200 hover:bg-green-50 transition-all" data-testid="button-hub-drug-classes">
                <BookOpen className="w-4 h-4" /> Drug Classes
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search medications..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                data-testid="input-search-medications"
              />
            </div>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              data-testid="select-drug-class-filter"
            >
              <option value="all">All Drug Classes</option>
              {drugClasses.map(dc => <option key={dc} value={dc}>{dc}</option>)}
            </select>
          </div>

          <p className="text-sm text-gray-500 mb-4" data-testid="text-results-count">{filteredMeds.length} medication{filteredMeds.length !== 1 ? "s" : ""} found</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMeds.map(med => (
              <Link key={med.slug} href={`/allied-health/pharmacy-technician/medications/${med.slug}`} className="group block border border-gray-200 rounded-xl p-4 hover:border-green-300 hover:shadow-md transition-all" data-testid={`card-medication-${med.slug}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">{med.genericName}</h3>
                    <p className="text-sm text-gray-500">{med.brandNames[0]}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors mt-1" />
                </div>
                <span className="inline-flex px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium">{med.drugClass}</span>
              </Link>
            ))}
          </div>

          {filteredMeds.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No medications match your search. Try a different term.</p>
            </div>
          )}
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Explore More</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/allied-health/pharmacy-technician/drug-classes" className="block border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-all" data-testid="link-explore-drug-classes">
              <Pill className="w-5 h-5 text-green-600 mb-2" />
              <h3 className="font-semibold text-sm text-gray-900">Drug Classes</h3>
              <p className="text-xs text-gray-500 mt-1">Study by drug class with suffix guides</p>
            </Link>
            <Link href="/allied-health/pharmacy-technician/calculations" className="block border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-all" data-testid="link-explore-calculations">
              <Beaker className="w-5 h-5 text-green-600 mb-2" />
              <h3 className="font-semibold text-sm text-gray-900">Pharmacy Calculations</h3>
              <p className="text-xs text-gray-500 mt-1">Master dosage, IV rates, and more</p>
            </Link>
            <Link href="/allied-health/pharmacy-technician/sig-codes" className="block border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-all" data-testid="link-explore-sig-codes">
              <FileText className="w-5 h-5 text-green-600 mb-2" />
              <h3 className="font-semibold text-sm text-gray-900">Sig Codes</h3>
              <p className="text-xs text-gray-500 mt-1">Prescription abbreviation reference</p>
            </Link>
            <Link href="/allied-health/pharmacy-technician/law" className="block border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-all" data-testid="link-explore-law">
              <Shield className="w-5 h-5 text-green-600 mb-2" />
              <h3 className="font-semibold text-sm text-gray-900">Pharmacy Law</h3>
              <p className="text-xs text-gray-500 mt-1">DEA schedules, HIPAA, and regulations</p>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

export function PharmTechMedicationDetailRoute() {
  const [, params] = useRoute("/allied-health/pharmacy-technician/medications/:slug");
  const slug = params?.slug;
  if (!slug) return null;

  const medication = getPharmTechMedicationBySlug(slug);
  if (!medication) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Medication Not Found</h1>
        <p className="text-gray-600 mb-4">The medication page you are looking for does not exist.</p>
        <Link href="/allied-health/pharmacy-technician/medications" className="text-green-600 hover:text-green-700 font-medium" data-testid="link-back-medications">
          Browse All Medications
        </Link>
      </div>
    );
  }

  return <MedicationDetailPage medication={medication} />;
}
