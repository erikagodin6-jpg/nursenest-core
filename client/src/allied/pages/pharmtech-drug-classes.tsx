import { Link, useRoute } from "wouter";
import { useState } from "react";
import {
  Pill, ChevronRight, BookOpen, Brain, FileText, HelpCircle,
  ArrowRight, GraduationCap, Sparkles, CheckCircle2, AlertTriangle,
  Beaker, Heart, Stethoscope, Shield, Syringe
} from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";
import { DRUG_CLASSES, type DrugClassInfo } from "./pharmtech-drug-classes-data";

import { useI18n } from "@/lib/i18n";
function getDrugClassIcon(slug: string) {

  switch (slug) {
    case "ace-inhibitors": return Heart;
    case "beta-blockers": return Shield;
    case "statins": return Beaker;
    case "antibiotics": return Syringe;
    case "antidiabetic-drugs": return Stethoscope;
    case "antidepressants": return Brain;
    case "antihistamines": return Sparkles;
    default: return Pill;
  }
}

function getDrugClassColor(slug: string) {
  switch (slug) {
    case "ace-inhibitors": return { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200", hoverBorder: "hover:border-rose-300", gradient: "from-rose-500 to-pink-600" };
    case "beta-blockers": return { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", hoverBorder: "hover:border-blue-300", gradient: "from-blue-500 to-indigo-600" };
    case "statins": return { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", hoverBorder: "hover:border-amber-300", gradient: "from-amber-500 to-orange-600" };
    case "antibiotics": return { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", hoverBorder: "hover:border-emerald-300", gradient: "from-emerald-500 to-teal-600" };
    case "antidiabetic-drugs": return { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200", hoverBorder: "hover:border-purple-300", gradient: "from-purple-500 to-violet-600" };
    case "antidepressants": return { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-200", hoverBorder: "hover:border-cyan-300", gradient: "from-cyan-500 to-sky-600" };
    case "antihistamines": return { bg: "bg-green-50", text: "text-green-600", border: "border-green-200", hoverBorder: "hover:border-green-300", gradient: "from-green-500 to-emerald-600" };
    default: return { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200", hoverBorder: "hover:border-gray-300", gradient: "from-gray-500 to-gray-600" };
  }
}

export default function PharmtechDrugClassesHub() {
  return (
    <>
      <AlliedSEO
        title={t("allied.pharmtechDrugClasses.drugClassesStudyGuideFor")}
        description={t("allied.pharmtechDrugClasses.masterTheMostCommonlyTested")}
        keywords="pharmacy technician drug classes, PTCB drug classification, pharmacy tech pharmacology, drug class study guide, medication categories, brand generic names"
        canonicalPath="/allied-health/pharmacy-technician/drug-classes"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Drug Classes Study Guide for Pharmacy Technicians",
          description: "Comprehensive study guides for 7 major drug classes tested on the PTCB and ExCPT pharmacy technician certification exams.",
          provider: { "@type": "Organization", name: "NurseNest Allied", url: "https://www.nursenest.ca/allied-health" },
          hasPart: DRUG_CLASSES.map(dc => ({
            "@type": "Article",
            name: dc.name,
            url: `https://www.nursenest.ca/allied-health/pharmacy-technician/drug-classes/${dc.slug}`,
            description: dc.description,
          })),
        }}
        additionalStructuredData={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "NurseNest Allied", item: "https://www.nursenest.ca/allied-health" },
              { "@type": "ListItem", position: 2, name: "Pharmacy Technician", item: "https://www.nursenest.ca/allied-health/pharmacy-technician" },
              { "@type": "ListItem", position: 3, name: "Drug Classes", item: "https://www.nursenest.ca/allied-health/pharmacy-technician/drug-classes" },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "What drug classes are tested on the PTCB exam?", acceptedAnswer: { "@type": "Answer", text: "The PTCB exam tests knowledge of multiple drug classes including ACE inhibitors, beta blockers, statins, antibiotics, antidiabetic medications, antidepressants, antihistamines, and many more. Understanding drug classification by suffix, mechanism, and therapeutic use is essential." } },
              { "@type": "Question", name: "How should I study drug classes for the pharmacy tech exam?", acceptedAnswer: { "@type": "Answer", text: "Focus on learning drug class suffixes (e.g., -pril for ACE inhibitors, -olol for beta blockers, -statin for statins), common brand and generic name pairs, key side effects, contraindications, and drug interactions. Use flashcards and practice questions to reinforce your knowledge." } },
              { "@type": "Question", name: "What is the best way to memorize brand and generic drug names?", acceptedAnswer: { "@type": "Answer", text: "Start by learning the drug class stems/suffixes, then associate each generic name with its brand name. Use spaced-repetition flashcards, group drugs by class, and practice with mock exams. Understanding the class helps you recognize unfamiliar drugs on the exam." } },
            ],
          },
        ]}
      />

      <div data-testid="pharmtech-drug-classes-hub">
        <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-teal-600" data-testid="breadcrumb-home">{t("allied.pharmtechDrugClasses.allied")}</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/allied-health/pharmacy-technician" className="hover:text-teal-600" data-testid="breadcrumb-pharmtech">{t("allied.pharmtechDrugClasses.pharmacyTechnician")}</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-green-700 font-medium">{t("allied.pharmtechDrugClasses.drugClasses")}</span>
            </div>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
                <Pill className="w-4 h-4" />
                Pharmacology Study Cluster
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4" data-testid="text-hub-title">
                Drug Classes<br />
                <span className="text-green-600">{t("allied.pharmtechDrugClasses.studyGuide")}</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed" data-testid="text-hub-subtitle">
                Master the most commonly tested medication classes for the PTCB and ExCPT exams. Each drug class guide includes generic and brand names, mechanisms of action, key side effects, clinical pearls, and practice questions with detailed rationales.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/allied-health/pharmacy-technician/flashcards" className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 shadow-lg shadow-green-200 transition-all" data-testid="button-study-flashcards">
                  <Brain className="w-4 h-4" /> Study Flashcards
                </Link>
                <Link href="/allied-health/pharmacy-technician/practice-questions" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 rounded-xl text-sm font-semibold border border-green-200 hover:bg-green-50 transition-all" data-testid="button-practice-questions">
                  <BookOpen className="w-4 h-4" /> Practice Questions
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-study-by-class">{t("allied.pharmtechDrugClasses.studyByDrugClass")}</h2>
          <p className="text-gray-500 mb-8">{t("allied.pharmtechDrugClasses.selectADrugClassBelow")}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DRUG_CLASSES.map(dc => {
              const Icon = getDrugClassIcon(dc.slug);
              const colors = getDrugClassColor(dc.slug);
              return (
                <Link
                  key={dc.slug}
                  href={`/allied-health/pharmacy-technician/drug-classes/${dc.slug}`}
                  className={`group bg-white rounded-2xl border ${colors.border} p-6 hover:shadow-lg ${colors.hoverBorder} transition-all`}
                  data-testid={`card-drug-class-${dc.slug}`}
                >
                  <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{dc.shortName}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-3 line-clamp-2">{dc.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{dc.genericDrugs.length} drugs · {dc.sampleQuestions.length} questions</span>
                    <ArrowRight className={`w-4 h-4 ${colors.text} group-hover:translate-x-1 transition-transform`} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">{t("allied.pharmtechDrugClasses.howToStudyDrugClasses")}</h2>
            <p className="text-gray-500 mb-10 text-center max-w-2xl mx-auto">{t("allied.pharmtechDrugClasses.followThisApproachToMaster")}</p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                  <span className="text-green-700 font-bold text-lg">1</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t("allied.pharmtechDrugClasses.learnTheStems")}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{t("allied.pharmtechDrugClasses.startByMemorizingDrugClass")}</p>
              </div>
              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                  <span className="text-green-700 font-bold text-lg">2</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t("allied.pharmtechDrugClasses.brandgenericPairs")}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{t("allied.pharmtechDrugClasses.useFlashcardsToMatchBrand")}</p>
              </div>
              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                  <span className="text-green-700 font-bold text-lg">3</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t("allied.pharmtechDrugClasses.practiceQuestions")}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{t("allied.pharmtechDrugClasses.testYourKnowledgeWithDrug")}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">{t("allied.pharmtechDrugClasses.quickReferenceDrugClassSuffixes")}</h2>
          <p className="text-gray-500 mb-8 text-center">{t("allied.pharmtechDrugClasses.memorizeTheseStemsToInstantly")}</p>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full" data-testid="table-suffixes">
              <thead>
                <tr className="bg-green-50 border-b border-green-100">
                  <th className="text-left px-6 py-3 text-sm font-semibold text-green-800">{t("allied.pharmtechDrugClasses.suffix")}</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-green-800">{t("allied.pharmtechDrugClasses.drugClass")}</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-green-800 hidden sm:table-cell">{t("allied.pharmtechDrugClasses.example")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { suffix: "-pril", cls: "ACE Inhibitors", example: "Lisinopril (Zestril)" },
                  { suffix: "-olol", cls: "Beta Blockers", example: "Metoprolol (Lopressor)" },
                  { suffix: "-statin", cls: "Statins", example: "Atorvastatin (Lipitor)" },
                  { suffix: "-cillin", cls: "Penicillin Antibiotics", example: "Amoxicillin (Amoxil)" },
                  { suffix: "-floxacin", cls: "Fluoroquinolone Antibiotics", example: "Ciprofloxacin (Cipro)" },
                  { suffix: "-thromycin", cls: "Macrolide Antibiotics", example: "Azithromycin (Zithromax)" },
                  { suffix: "-gliptin", cls: "DPP-4 Inhibitors", example: "Sitagliptin (Januvia)" },
                  { suffix: "-gliflozin", cls: "SGLT2 Inhibitors", example: "Empagliflozin (Jardiance)" },
                  { suffix: "-glutide", cls: "GLP-1 Agonists", example: "Semaglutide (Ozempic)" },
                  { suffix: "-sartan", cls: "ARBs", example: "Losartan (Cozaar)" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-mono font-bold text-green-700">{row.suffix}</td>
                    <td className="px-6 py-3 text-sm text-gray-900">{row.cls}</td>
                    <td className="px-6 py-3 text-sm text-gray-500 hidden sm:table-cell">{row.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">{t("allied.pharmtechDrugClasses.frequentlyAskedQuestions")}</h2>
          <p className="text-gray-500 mb-8 text-center">{t("allied.pharmtechDrugClasses.commonQuestionsAboutStudyingDrug")}</p>
          <HubFAQ />
        </section>

        <section className="bg-gradient-to-r from-green-600 to-emerald-600 py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{t("allied.pharmtechDrugClasses.readyToMasterDrugClasses")}</h2>
            <p className="text-green-100 mb-8">{t("allied.pharmtechDrugClasses.startWithOurFlashcardDecks")}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/allied-health/pharmacy-technician/flashcards" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 rounded-xl text-sm font-semibold hover:bg-green-50 transition-all" data-testid="button-cta-flashcards">
                <Brain className="w-4 h-4" /> Study Flashcards
              </Link>
              <Link href="/allied-health/pharmacy-technician/exams" className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 border border-green-500 transition-all" data-testid="button-cta-exams">
                <FileText className="w-4 h-4" /> Take Practice Exam
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function HubFAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqs = [
    { q: "What drug classes are tested on the PTCB exam?", a: "The PTCB exam tests knowledge of multiple drug classes including ACE inhibitors, beta blockers, statins, antibiotics, antidiabetic medications, antidepressants, antihistamines, proton pump inhibitors, benzodiazepines, opioids, NSAIDs, and more. Understanding drug classification by suffix, mechanism of action, and therapeutic use is essential for passing the Medications domain (40% of the exam)." },
    { q: "How should I study drug classes for the pharmacy tech exam?", a: "Focus on learning drug class suffixes (e.g., -pril for ACE inhibitors, -olol for beta blockers, -statin for statins), then study common brand and generic name pairs. Learn key side effects, contraindications, and drug interactions for each class. Use spaced-repetition flashcards and practice questions to reinforce your knowledge over time." },
    { q: "What is the best way to memorize brand and generic drug names?", a: "Start by learning the drug class stems/suffixes — this gives you a framework. Then associate each generic name with its brand name using flashcards. Group drugs by class (all statins together, all ACE inhibitors together) rather than studying random drug lists. Our Top 200 Drugs flashcard deck is designed specifically for this purpose." },
    { q: "How many drug classes should I know for the PTCB?", a: "You should be familiar with at least 15-20 major drug classes for the PTCB exam. Our study guides cover the 7 most commonly tested classes in depth, but you should also study drug classes like proton pump inhibitors, benzodiazepines, opioids, NSAIDs, ARBs, calcium channel blockers, and diuretics." },
    { q: "Do I need to know mechanisms of action for the PTCB?", a: "While the PTCB does not test detailed biochemistry, understanding basic mechanisms helps you predict side effects, drug interactions, and contraindications. For example, knowing that ACE inhibitors affect bradykinin explains the dry cough side effect. Focus on practical, clinically relevant mechanisms rather than molecular details." },
  ];

  return (
    <div className="space-y-3" data-testid="hub-faq-section">
      {faqs.map((faq, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <button
            onClick={() => setOpenFaq(openFaq === i ? null : i)}
            className="w-full text-left px-6 py-4 flex items-center justify-between"
            aria-expanded={openFaq === i}
            aria-controls={`hub-faq-panel-${i}`}
            data-testid={`hub-faq-toggle-${i}`}
          >
            <span className="font-medium text-gray-900 text-sm">{faq.q}</span>
            <HelpCircle className={`w-4 h-4 flex-shrink-0 ml-2 transition-transform ${openFaq === i ? "text-green-600 rotate-180" : "text-gray-400"}`} />
          </button>
          {openFaq === i && (
            <div id={`hub-faq-panel-${i}`} className="px-6 pb-4" role="region">
              <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function PharmtechDrugClassDetail() {
  const [, params] = useRoute("/allied-health/pharmacy-technician/drug-classes/:slug");
  const slug = params?.slug;
  const drugClass = DRUG_CLASSES.find(dc => dc.slug === slug);

  if (!drugClass) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.pharmtechDrugClasses.drugClassNotFound")}</h1>
        <p className="text-gray-600 mb-4">{t("allied.pharmtechDrugClasses.theDrugClassYoureLooking")}</p>
        <Link href="/allied-health/pharmacy-technician/drug-classes" className="inline-block px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700" data-testid="link-back-drug-classes">
          Back to Drug Classes
        </Link>
      </div>
    );
  }

  return <DrugClassPage drugClass={drugClass} />;
}

function DrugClassPage({ drugClass }: { drugClass: DrugClassInfo }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, number | null>>({});
  const colors = getDrugClassColor(drugClass.slug);
  const Icon = getDrugClassIcon(drugClass.slug);

  const otherClasses = DRUG_CLASSES.filter(dc => dc.slug !== drugClass.slug);

  return (
    <>
      <AlliedSEO
        title={drugClass.metaTitle}
        description={drugClass.metaDescription}
        keywords={drugClass.keywords}
        canonicalPath={`/allied-health/pharmacy-technician/drug-classes/${drugClass.slug}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: drugClass.metaTitle,
          description: drugClass.metaDescription,
          author: { "@type": "Organization", name: "NurseNest Allied" },
          publisher: { "@type": "Organization", name: "NurseNest Allied", url: "https://www.nursenest.ca/allied-health" },
          mainEntityOfPage: `https://www.nursenest.ca/allied-health/pharmacy-technician/drug-classes/${drugClass.slug}`,
        }}
        additionalStructuredData={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "NurseNest Allied", item: "https://www.nursenest.ca/allied-health" },
              { "@type": "ListItem", position: 2, name: "Pharmacy Technician", item: "https://www.nursenest.ca/allied-health/pharmacy-technician" },
              { "@type": "ListItem", position: 3, name: "Drug Classes", item: "https://www.nursenest.ca/allied-health/pharmacy-technician/drug-classes" },
              { "@type": "ListItem", position: 4, name: drugClass.shortName, item: `https://www.nursenest.ca/allied-health/pharmacy-technician/drug-classes/${drugClass.slug}` },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: drugClass.faqs.map(f => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />

      <div data-testid={`pharmtech-drug-class-${drugClass.slug}`}>
        <section className={`relative overflow-hidden bg-gradient-to-br ${colors.bg} py-14 sm:py-20`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
              <Link href="/" className="hover:text-teal-600" data-testid="breadcrumb-home">{t("allied.pharmtechDrugClasses.allied2")}</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/allied-health/pharmacy-technician" className="hover:text-teal-600" data-testid="breadcrumb-pharmtech">{t("allied.pharmtechDrugClasses.pharmacyTechnician2")}</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/allied-health/pharmacy-technician/drug-classes" className="hover:text-teal-600" data-testid="breadcrumb-drug-classes">{t("allied.pharmtechDrugClasses.drugClasses2")}</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className={`${colors.text} font-medium`}>{drugClass.shortName}</span>
            </div>
            <div className="max-w-3xl">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${colors.bg} ${colors.text} rounded-full text-sm font-medium mb-4 border ${colors.border}`}>
                <Icon className="w-4 h-4" />
                Drug Class Study Guide
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4" data-testid="text-drug-class-title">
                {drugClass.name}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed" data-testid="text-drug-class-description">
                {drugClass.overview}
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" data-testid="heading-generic-drugs">
                  <Pill className={`w-5 h-5 ${colors.text}`} />
                  Common Generic & Brand Names
                </h2>
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <table className="w-full" data-testid="table-drugs">
                    <thead>
                      <tr className={`${colors.bg} border-b ${colors.border}`}>
                        <th className={`text-left px-5 py-3 text-sm font-semibold ${colors.text}`}>{t("allied.pharmtechDrugClasses.genericName")}</th>
                        <th className={`text-left px-5 py-3 text-sm font-semibold ${colors.text}`}>{t("allied.pharmtechDrugClasses.brandName")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {drugClass.genericDrugs.map((drug, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-5 py-3 text-sm font-medium text-gray-900">{drug.name}</td>
                          <td className="px-5 py-3 text-sm text-gray-600">{drug.brandName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" data-testid="heading-common-uses">
                  <Stethoscope className={`w-5 h-5 ${colors.text}`} />
                  Common Uses & Indications
                </h2>
                <ul className="space-y-2">
                  {drugClass.commonUses.map((use, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 ${colors.text} flex-shrink-0`} />
                      <span className="text-sm text-gray-700">{use}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" data-testid="heading-key-points">
                  <AlertTriangle className={`w-5 h-5 ${colors.text}`} />
                  Key Points for Pharmacy Technicians
                </h2>
                <div className="space-y-3">
                  {drugClass.keyPoints.map((point, i) => (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${colors.bg} border ${colors.border}`}>
                      <span className={`text-xs font-bold ${colors.text} mt-0.5 bg-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0`}>{i + 1}</span>
                      <span className="text-sm text-gray-700 leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" data-testid="heading-practice-questions">
                  <BookOpen className={`w-5 h-5 ${colors.text}`} />
                  Sample Practice Questions
                </h2>
                <div className="space-y-4">
                  {drugClass.sampleQuestions.map((q, qi) => (
                    <div key={qi} className="bg-white rounded-2xl border border-gray-100 p-5" data-testid={`practice-question-${qi}`}>
                      <p className="text-sm font-medium text-gray-900 mb-3">Q{qi + 1}: {q.stem}</p>
                      <div className="space-y-2 mb-3">
                        {q.options.map((opt, oi) => {
                          const isRevealed = revealedAnswers[qi] !== undefined;
                          const isCorrect = oi === q.correctIndex;
                          const isSelected = revealedAnswers[qi] === oi;
                          return (
                            <button
                              key={oi}
                              onClick={() => {
                                if (!isRevealed) {
                                  setRevealedAnswers(prev => ({ ...prev, [qi]: oi }));
                                }
                              }}
                              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm border transition-all ${
                                isRevealed
                                  ? isCorrect
                                    ? "bg-green-50 border-green-300 text-green-800"
                                    : isSelected
                                      ? "bg-red-50 border-red-300 text-red-800"
                                      : "bg-gray-50 border-gray-100 text-gray-500"
                                  : "bg-white border-gray-200 hover:border-green-300 hover:bg-green-50/50 text-gray-700 cursor-pointer"
                              }`}
                              data-testid={`question-${qi}-option-${oi}`}
                            >
                              <span className="font-medium mr-2">{String.fromCharCode(65 + oi)}.</span>
                              {opt}
                              {isRevealed && isCorrect && <CheckCircle2 className="w-4 h-4 inline ml-2 text-green-600" />}
                            </button>
                          );
                        })}
                      </div>
                      {revealedAnswers[qi] !== undefined && (
                        <div className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-100" data-testid={`rationale-${qi}`}>
                          <p className="text-xs font-semibold text-blue-800 mb-1">{t("allied.pharmtechDrugClasses.rationale")}</p>
                          <p className="text-sm text-blue-900 leading-relaxed">{q.rationale}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Link href="/allied-health/pharmacy-technician/practice-questions" className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${colors.gradient} text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all`} data-testid="button-more-questions">
                    <BookOpen className="w-4 h-4" /> More Practice Questions <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" data-testid="heading-faq">
                  <HelpCircle className={`w-5 h-5 ${colors.text}`} />
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3" data-testid="detail-faq-section">
                  {drugClass.faqs.map((faq, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full text-left px-5 py-4 flex items-center justify-between"
                        aria-expanded={openFaq === i}
                        aria-controls={`detail-faq-panel-${i}`}
                        data-testid={`detail-faq-toggle-${i}`}
                      >
                        <span className="font-medium text-gray-900 text-sm">{faq.q}</span>
                        <HelpCircle className={`w-4 h-4 flex-shrink-0 ml-2 transition-transform ${openFaq === i ? `${colors.text} rotate-180` : "text-gray-400"}`} />
                      </button>
                      {openFaq === i && (
                        <div id={`detail-faq-panel-${i}`} className="px-5 pb-4" role="region">
                          <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                <div className={`bg-gradient-to-br ${colors.bg} rounded-2xl border ${colors.border} p-6`}>
                  <h3 className="font-bold text-gray-900 mb-4">{t("allied.pharmtechDrugClasses.studyThisDrugClass")}</h3>
                  <div className="space-y-3">
                    <Link href="/allied-health/pharmacy-technician/flashcards" className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all" data-testid="sidebar-flashcards">
                      <Brain className={`w-5 h-5 ${colors.text}`} />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{t("allied.pharmtechDrugClasses.flashcards")}</p>
                        <p className="text-xs text-gray-500">{t("allied.pharmtechDrugClasses.reviewWithSpacedRepetition")}</p>
                      </div>
                    </Link>
                    <Link href="/allied-health/pharmacy-technician/practice-questions" className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all" data-testid="sidebar-questions">
                      <BookOpen className={`w-5 h-5 ${colors.text}`} />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{t("allied.pharmtechDrugClasses.practiceQuestions2")}</p>
                        <p className="text-xs text-gray-500">{t("allied.pharmtechDrugClasses.testYourKnowledge")}</p>
                      </div>
                    </Link>
                    <Link href="/allied-health/pharmacy-technician/exams" className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all" data-testid="sidebar-exams">
                      <FileText className={`w-5 h-5 ${colors.text}`} />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{t("allied.pharmtechDrugClasses.practiceExams")}</p>
                        <p className="text-xs text-gray-500">{t("allied.pharmtechDrugClasses.fulllengthMockTests")}</p>
                      </div>
                    </Link>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">{t("allied.pharmtechDrugClasses.otherDrugClasses")}</h3>
                  <div className="space-y-2">
                    {otherClasses.map(dc => {
                      const OtherIcon = getDrugClassIcon(dc.slug);
                      const otherColors = getDrugClassColor(dc.slug);
                      return (
                        <Link
                          key={dc.slug}
                          href={`/allied-health/pharmacy-technician/drug-classes/${dc.slug}`}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                          data-testid={`sidebar-class-${dc.slug}`}
                        >
                          <OtherIcon className={`w-4 h-4 ${otherColors.text}`} />
                          <span className="text-sm text-gray-700 font-medium">{dc.shortName}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{t("allied.pharmtechDrugClasses.internalLinks")}</h3>
                  <div className="space-y-2">
                    <Link href="/allied-health/pharmacy-technician" className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium" data-testid="sidebar-link-hub">
                      <GraduationCap className="w-4 h-4" /> Pharmacy Tech Hub
                    </Link>
                    <Link href="/allied-health/pharmacy-technician/study-guide" className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium" data-testid="sidebar-link-guide">
                      <BookOpen className="w-4 h-4" /> Study Guide
                    </Link>
                    <Link href="/allied-health/pharmacy-technician/lessons" className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium" data-testid="sidebar-link-lessons">
                      <FileText className="w-4 h-4" /> Lessons
                    </Link>
                    <Link href="/allied-health/pharmacy-technician/drug-classes" className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium" data-testid="sidebar-link-all-classes">
                      <Pill className="w-4 h-4" /> All Drug Classes
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-green-600 to-emerald-600 py-14">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Master {drugClass.shortName} and More</h2>
            <p className="text-green-100 mb-8">{t("allied.pharmtechDrugClasses.continueYourPharmacyTechnicianExam")}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/allied-health/pharmacy-technician/flashcards" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 rounded-xl text-sm font-semibold hover:bg-green-50 transition-all" data-testid="button-bottom-cta-flashcards">
                <Brain className="w-4 h-4" /> Study Flashcards
              </Link>
              <Link href="/allied-health/pharmacy-technician/practice-questions" className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 border border-green-500 transition-all" data-testid="button-bottom-cta-questions">
                <BookOpen className="w-4 h-4" /> Practice Questions
              </Link>
              <Link href="/allied-health/pharmacy-technician/exams" className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 border border-green-500 transition-all" data-testid="button-bottom-cta-exams">
                <FileText className="w-4 h-4" /> Take Exam
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
