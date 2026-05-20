import { useState } from "react";
import { useRoute } from "wouter";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { LocaleLink } from "@/lib/LocaleLink";
import { useI18n } from "@/lib/i18n";
import { buildFaqStructuredData } from "@/lib/structured-data";
import {
  BookOpen, Zap, Heart, Droplets, FlaskConical, Activity,
  ArrowRight, ChevronDown, ChevronRight, CheckCircle2,
  Lightbulb, Target, FileText, GraduationCap
} from "lucide-react";

interface StudyGuideDef {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: typeof BookOpen;
  color: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

const STUDY_GUIDES: StudyGuideDef[] = [
  {
    slug: "electrolytes-nursing-guide",
    title: "Electrolytes for Nursing Exams — Complete Study Guide",
    shortTitle: "Electrolytes",
    description: "Master sodium, potassium, calcium, magnesium, and phosphorus imbalances. Includes normal ranges, clinical signs, nursing interventions, and exam-style practice scenarios.",
    icon: Zap,
    color: "#F59E0B",
    metaTitle: "Electrolytes for Nursing Exams — Complete Study Guide | NurseNest",
    metaDescription: "Comprehensive electrolyte study guide for nursing students. Normal ranges, clinical signs of imbalances, nursing interventions, and NCLEX-style practice for Na, K, Ca, Mg, and phosphorus.",
    keywords: "electrolytes nursing, sodium potassium calcium magnesium, nursing exam prep, NCLEX electrolytes, fluid and electrolyte imbalances",
  },
  {
    slug: "acid-base-disorders-study-guide",
    title: "Acid-Base Disorders — Nursing Study Guide",
    shortTitle: "Acid-Base Disorders",
    description: "Understand respiratory and metabolic acidosis/alkalosis, ABG interpretation, compensation mechanisms, and clinical management for nursing practice.",
    icon: FlaskConical,
    color: "#8B5CF6",
    metaTitle: "Acid-Base Disorders — Nursing Study Guide | NurseNest",
    metaDescription: "Master acid-base disorders for nursing exams. Step-by-step ABG interpretation, respiratory vs metabolic acidosis and alkalosis, compensation, and NCLEX practice scenarios.",
    keywords: "acid-base disorders nursing, ABG interpretation, metabolic acidosis, respiratory alkalosis, NCLEX acid-base",
  },
  {
    slug: "ecg-interpretation-study-guide",
    title: "Cardiac ECG Interpretation — Nursing Study Guide",
    shortTitle: "ECG Interpretation",
    description: "Learn systematic ECG analysis from basic rhythm strips to 12-lead interpretation. Covers normal sinus rhythm, arrhythmias, heart blocks, and STEMI recognition.",
    icon: Heart,
    color: "#EF4444",
    metaTitle: "ECG Interpretation for Nurses — Complete Study Guide | NurseNest",
    metaDescription: "Learn ECG interpretation for nursing exams. Systematic approach to rhythm analysis, arrhythmia recognition, heart blocks, STEMI identification, and clinical nursing interventions.",
    keywords: "ECG interpretation nursing, EKG reading, cardiac arrhythmias, heart blocks, STEMI recognition, NCLEX cardiac",
  },
  {
    slug: "fluid-electrolyte-balance-guide",
    title: "Fluid and Electrolyte Balance — Nursing Study Guide",
    shortTitle: "Fluid Balance",
    description: "Understand fluid compartments, osmolality, IV fluid types, fluid volume excess and deficit, and nursing assessment of hydration status.",
    icon: Droplets,
    color: "#3B82F6",
    metaTitle: "Fluid and Electrolyte Balance — Nursing Study Guide | NurseNest",
    metaDescription: "Comprehensive fluid balance study guide for nursing students. IV fluid types, fluid volume deficit and excess, osmolality, dehydration assessment, and NCLEX preparation.",
    keywords: "fluid balance nursing, IV fluids, dehydration, fluid volume excess, osmolality, NCLEX fluid electrolyte",
  },
  {
    slug: "critical-lab-values-guide",
    title: "Critical Lab Values — Nursing Study Guide",
    shortTitle: "Critical Lab Values",
    description: "Know the lab values that require immediate nursing action. Covers critical ranges, nursing responsibilities, and when to notify the provider.",
    icon: Activity,
    color: "#DC2626",
    metaTitle: "Critical Lab Values Every Nurse Must Know | NurseNest",
    metaDescription: "Essential critical lab values study guide for nursing students. Learn which lab results require immediate action, normal ranges, panic values, and nursing interventions for NCLEX.",
    keywords: "critical lab values nursing, panic values, normal lab values, nursing lab interpretation, NCLEX lab values",
  },
];

function StudyGuideCard({ guide }: { guide: StudyGuideDef }) {
  const Icon = guide.icon;
  return (
    <LocaleLink href={`/nursing-study-guides/${guide.slug}`} className="block" data-testid={`card-guide-${guide.slug}`}>
      <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-emerald-300 transition-all duration-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${guide.color}15` }}>
            <Icon className="w-6 h-6" style={{ color: guide.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors" data-testid={`text-guide-title-${guide.slug}`}>
              {guide.shortTitle}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{guide.description}</p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 mt-3 group-hover:gap-2 transition-all">
              Read Guide <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </LocaleLink>
  );
}

function FaqAccordion({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg" data-testid={`faq-item-${index}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left" data-testid={`button-faq-toggle-${index}`}>
        <span className="font-medium text-gray-900 dark:text-white">{question}</span>
        {open ? <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" /> : <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />}
      </button>
      {open && <div className="px-4 pb-4 text-gray-600 dark:text-gray-400 text-sm">{answer}</div>}
    </div>
  );
}

function NursingStudyGuidesHub() {
  const { t } = useI18n();

  const hubFaqs = [
    { question: "How should I use these nursing study guides?", answer: "These study guides are designed as comprehensive reference material. Start with the guide that covers your weakest topic, read through the content, then reinforce your learning with our practice questions and flashcards linked within each guide." },
    { question: "Are these study guides aligned with NCLEX content?", answer: "Yes. All study guides cover topics that appear on the NCLEX-RN and NCLEX-PN exam blueprints. The content is organized by the clinical concepts most frequently tested, with exam tips and practice scenarios included." },
    { question: "Can I use these guides for other nursing exams?", answer: "Absolutely. These guides cover fundamental nursing science that applies to NCLEX, REX-PN, HESI, ATI, and nursing school course exams. The underlying clinical concepts are universal across nursing education." },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Nursing Study Guides — Comprehensive Exam Prep Resources",
    "description": "Free nursing study guides covering electrolytes, acid-base disorders, ECG interpretation, fluid balance, and critical lab values for nursing exam preparation.",
    "provider": { "@type": "EducationalOrganization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
    "hasPart": STUDY_GUIDES.map(g => ({
      "@type": "LearningResource",
      "name": g.title,
      "url": `https://www.nursenest.ca/nursing-study-guides/${g.slug}`,
      "educationalLevel": "College",
      "learningResourceType": "Study Guide",
    })),
  };

  return (
    <>
      <SEO
        title={t("pages.nursingStudyGuides.nursingStudyGuidesFreeExam")}
        description={t("pages.nursingStudyGuides.comprehensiveNursingStudyGuidesCovering")}
        keywords="nursing study guides, NCLEX prep, electrolytes nursing, acid-base, ECG interpretation, lab values, nursing exam study material"
        canonicalPath="/nursing-study-guides"
        structuredData={structuredData}
        additionalStructuredData={[buildFaqStructuredData(hubFaqs)]}
      />
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-1.5 rounded-full text-sm font-medium mb-4" data-testid="badge-study-guides">
              <BookOpen className="w-4 h-4" /> Cornerstone Study Resources
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4" data-testid="text-guides-heading">
              {t("nursingStudyGuides.heading", { "default": "Nursing Study Guides" })}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" data-testid="text-guides-subtitle">
              In-depth study guides covering the most tested nursing topics. Each guide includes clinical explanations, normal values, nursing interventions, and links to practice questions.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2" data-testid="grid-study-guides">
            {STUDY_GUIDES.map(guide => (
              <StudyGuideCard key={guide.slug} guide={guide} />
            ))}
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t("pages.nursingStudyGuides.frequentlyAskedQuestions")}</h2>
            <div className="space-y-4">
              {hubFaqs.map((faq, i) => (
                <FaqAccordion key={i} question={faq.question} answer={faq.answer} index={i} />
              ))}
            </div>
          </div>

          <div className="mt-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t("pages.nursingStudyGuides.deepenYourUnderstanding")}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Pair these study guides with our pathophysiology lessons, clinical simulations, and adaptive question banks for comprehensive exam preparation.
            </p>
            <div className="flex flex-wrap gap-3">
              <LocaleLink href="/lessons" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors" data-testid="link-lessons-cta">
                <BookOpen className="w-4 h-4" /> Explore Lessons
              </LocaleLink>
              <LocaleLink href="/clinical-calculators" className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-emerald-600 border border-emerald-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors" data-testid="link-calculators-cta">
                Clinical Calculators <ArrowRight className="w-4 h-4" />
              </LocaleLink>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
      <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

function KeyPoint({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg my-3">
      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-emerald-800 dark:text-emerald-200">{children}</div>
    </div>
  );
}

function ExamTip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg my-3">
      <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-amber-800 dark:text-amber-200">{children}</div>
    </div>
  );
}

function ValueTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <thead><tr className="bg-gray-50 dark:bg-gray-800">{headers.map((h, i) => <th key={i} className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">{h}</th>)}</tr></thead>
        <tbody>{rows.map((row, i) => <tr key={i} className="border-b border-gray-100 dark:border-gray-800">{row.map((cell, j) => <td key={j} className="px-4 py-2 text-gray-700 dark:text-gray-300">{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function StudyGuidePageWrapper({ guide, faqs, children }: { guide: StudyGuideDef; faqs: { question: string; answer: string }[]; children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": guide.title,
    "description": guide.metaDescription,
    "url": `https://www.nursenest.ca/nursing-study-guides/${guide.slug}`,
    "author": { "@type": "EducationalOrganization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
    "publisher": { "@type": "EducationalOrganization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
    "educationalLevel": "College",
    "learningResourceType": "Study Guide",
    "datePublished": "2025-01-15",
    "dateModified": "2026-03-01",
  };

  return (
    <>
      <SEO
        title={guide.metaTitle}
        description={guide.metaDescription}
        keywords={guide.keywords}
        canonicalPath={`/nursing-study-guides/${guide.slug}`}
        structuredData={structuredData}
        additionalStructuredData={[buildFaqStructuredData(faqs)]}
      />
      <Navigation />
      <main className="min-h-screen bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
          <div className="mb-6">
            <LocaleLink href="/nursing-study-guides" className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1" data-testid="link-back-guides">
              <ChevronRight className="w-4 h-4 rotate-180" /> All Study Guides
            </LocaleLink>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${guide.color}15` }}>
              <guide.icon className="w-5 h-5" style={{ color: guide.color }} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white" data-testid="text-guide-page-title">
              {guide.shortTitle}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{guide.description}</p>
          {children}

          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4" data-testid="text-faq-heading">{t("pages.nursingStudyGuides.frequentlyAskedQuestions2")}</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <FaqAccordion key={i} question={faq.question} answer={faq.answer} index={i} />
              ))}
            </div>
          </div>

          <div className="mt-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">{t("pages.nursingStudyGuides.continueYourStudy")}</h3>
            <div className="flex flex-wrap gap-3">
              <LocaleLink href="/question-bank" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700" data-testid="link-practice-questions">
                <Target className="w-4 h-4" /> Practice Questions
              </LocaleLink>
              <LocaleLink href="/nursing-clinical-scenarios" className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-emerald-600 border border-emerald-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-50" data-testid="link-clinical-scenarios">
                <GraduationCap className="w-4 h-4" /> Clinical Scenarios
              </LocaleLink>
              <LocaleLink href="/flashcards" className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-emerald-600 border border-emerald-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-50" data-testid="link-flashcards">
                <FileText className="w-4 h-4" /> Flashcards
              </LocaleLink>
              <LocaleLink href="/lessons" className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-emerald-600 border border-emerald-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-50" data-testid="link-lessons">
                <BookOpen className="w-4 h-4" /> Pathophysiology Lessons
              </LocaleLink>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function ElectrolytesGuide() {
  const guide = STUDY_GUIDES.find(g => g.slug === "electrolytes-nursing-guide")!;
  const faqs = [
    { question: "Which electrolyte is most commonly tested on the NCLEX?", answer: "Potassium is the most commonly tested electrolyte on the NCLEX. You must know the normal range (3.5–5.0 mEq/L), that IV potassium must never be pushed (it causes cardiac arrest), and the ECG changes associated with hypo- and hyperkalemia." },
    { question: "How do I remember the difference between SIADH and diabetes insipidus?", answer: "SIADH = too much ADH = water retention = dilutional hyponatremia (low sodium, concentrated urine). Diabetes insipidus = too little ADH = water loss = hypernatremia (high sodium, dilute urine). Remember: 'Water follows sodium' — sodium problems are often water problems." },
    { question: "What is the relationship between calcium and phosphorus?", answer: "Calcium and phosphorus have an inverse (reciprocal) relationship. When calcium goes up, phosphorus goes down, and vice versa. This is important in renal failure, where phosphorus rises and calcium falls, leading to bone disease and cardiac complications." },
  ];
  return (
    <StudyGuidePageWrapper guide={guide} faqs={faqs}>
      <Section title={t("pages.nursingStudyGuides.overviewOfElectrolytesInNursing")}>
        <p>{t("pages.nursingStudyGuides.electrolyteImbalancesAreAmongThe")}</p>
        <KeyPoint><strong>{t("pages.nursingStudyGuides.keyPrinciple")}</strong> {t("pages.nursingStudyGuides.electrolyteImbalancesRarelyOccurIn")}</KeyPoint>
      </Section>
      <Section title={t("pages.nursingStudyGuides.sodiumNa")}>
        <ValueTable headers={["Parameter", "Value"]} rows={[["Normal Range", "135–145 mEq/L"], ["Critical Low", "< 120 mEq/L"], ["Critical High", "> 160 mEq/L"]]} />
        <p><strong>{t("pages.nursingStudyGuides.hyponatremiaNaLt135")}</strong> {t("pages.nursingStudyGuides.causesIncludeSiadhHeartFailure")}</p>
        <p><strong>{t("pages.nursingStudyGuides.hypernatremiaNaGt145")}</strong> {t("pages.nursingStudyGuides.causesIncludeDehydrationDiabetesInsipidus")}</p>
        <ExamTip><strong>{t("pages.nursingStudyGuides.nclexTip")}</strong> {t("pages.nursingStudyGuides.waterFollowsSodiumRememberThat")}</ExamTip>
      </Section>
      <Section title={t("pages.nursingStudyGuides.potassiumK")}>
        <ValueTable headers={["Parameter", "Value"]} rows={[["Normal Range", "3.5–5.0 mEq/L"], ["Critical Low", "< 2.5 mEq/L"], ["Critical High", "> 6.5 mEq/L"]]} />
        <p><strong>{t("pages.nursingStudyGuides.hypokalemiaKLt35")}</strong> {t("pages.nursingStudyGuides.causesIncludeDiureticsFurosemideVomiting")}</p>
        <p><strong>{t("pages.nursingStudyGuides.hyperkalemiaKGt50")}</strong> {t("pages.nursingStudyGuides.causesIncludeRenalFailureAce")}</p>
        <ExamTip><strong>{t("pages.nursingStudyGuides.nclexTip2")}</strong> {t("pages.nursingStudyGuides.potassiumIsTheMostCommonly")}</ExamTip>
      </Section>
      <Section title={t("pages.nursingStudyGuides.calciumCa")}>
        <ValueTable headers={["Parameter", "Value"]} rows={[["Normal Range", "8.5–10.5 mg/dL (total)"], ["Ionized Calcium", "4.5–5.5 mg/dL"], ["Critical Low", "< 7.0 mg/dL"], ["Critical High", "> 12.0 mg/dL"]]} />
        <p><strong>{t("pages.nursingStudyGuides.hypocalcemiaCaLt85")}</strong> {t("pages.nursingStudyGuides.causesIncludeHypoparathyroidismVitaminD")}</p>
        <p><strong>{t("pages.nursingStudyGuides.hypercalcemiaCaGt105")}</strong> {t("pages.nursingStudyGuides.causesIncludeHyperparathyroidismMalignancyIm")}</p>
        <KeyPoint><strong>{t("pages.nursingStudyGuides.remember")}</strong> {t("pages.nursingStudyGuides.calciumAndPhosphorusHaveAn")}</KeyPoint>
      </Section>
      <Section title={t("pages.nursingStudyGuides.magnesiumMg")}>
        <ValueTable headers={["Parameter", "Value"]} rows={[["Normal Range", "1.5–2.5 mEq/L"], ["Critical Low", "< 1.0 mEq/L"], ["Critical High", "> 4.0 mEq/L"]]} />
        <p><strong>{t("pages.nursingStudyGuides.hypomagnesemiaMgLt15")}</strong> {t("pages.nursingStudyGuides.causesIncludeAlcoholismMalnutritionDiuretics")}</p>
        <p><strong>{t("pages.nursingStudyGuides.hypermagnesemiaMgGt25")}</strong> {t("pages.nursingStudyGuides.causesIncludeRenalFailureExcessive")}</p>
        <ExamTip><strong>{t("pages.nursingStudyGuides.examTip")}</strong> {t("pages.nursingStudyGuides.whenMonitoringIvMagnesiumSulfate")}</ExamTip>
      </Section>
      <Section title={t("pages.nursingStudyGuides.phosphorusPo")}>
        <ValueTable headers={["Parameter", "Value"]} rows={[["Normal Range", "2.5–4.5 mg/dL"], ["Critical Low", "< 1.0 mg/dL"], ["Critical High", "> 8.0 mg/dL"]]} />
        <p><strong>{t("pages.nursingStudyGuides.hypophosphatemiaPoLt25")}</strong> {t("pages.nursingStudyGuides.causesIncludeRefeedingSyndromeAntacid")}</p>
        <p><strong>{t("pages.nursingStudyGuides.hyperphosphatemiaPoGt45")}</strong> {t("pages.nursingStudyGuides.causesIncludeRenalFailureTumor")}</p>
      </Section>
    </StudyGuidePageWrapper>
  );
}

function AcidBaseGuide() {
  const guide = STUDY_GUIDES.find(g => g.slug === "acid-base-disorders-study-guide")!;
  const faqs = [
    { question: "What is the fastest way to interpret ABGs on the NCLEX?", answer: "Use the ROME mnemonic: Respiratory = Opposite (pH and CO₂ move in opposite directions), Metabolic = Equal (pH and HCO₃ move in the same direction). Step 1: Look at pH (acidosis or alkalosis). Step 2: Check which value (CO₂ or HCO₃) explains the pH change — that is the primary disorder. Step 3: Check if the other value is compensating." },
    { question: "What is the difference between compensated and uncompensated acid-base disorders?", answer: "Uncompensated: pH is abnormal, and only one system (respiratory or metabolic) is abnormal. Partially compensated: pH is still abnormal, but both systems are abnormal (the body is trying to correct). Fully compensated: pH is normal, but both CO₂ and HCO₃ are abnormal — look at which side of 7.40 the pH falls to determine the primary disorder." },
    { question: "Why does vomiting cause alkalosis but diarrhea causes acidosis?", answer: "Vomiting removes hydrochloric acid (HCl) from the stomach, causing a loss of acid and resulting in metabolic alkalosis. Diarrhea removes bicarbonate-rich intestinal secretions, causing a loss of base and resulting in metabolic acidosis. This is one of the most commonly tested distinctions on the NCLEX." },
  ];
  return (
    <StudyGuidePageWrapper guide={guide} faqs={faqs}>
      <Section title={t("pages.nursingStudyGuides.understandingAcidbaseBalance")}>
        <p>{t("pages.nursingStudyGuides.theBodyMaintainsBloodPh")}</p>
        <ValueTable headers={["ABG Component", "Normal Range", "Interpretation"]} rows={[
          ["pH", "7.35–7.45", "< 7.35 = Acidosis, > 7.45 = Alkalosis"],
          ["PaCO₂", "35–45 mmHg", "Respiratory component (inverse relationship with pH)"],
          ["HCO₃⁻", "22–26 mEq/L", "Metabolic component (direct relationship with pH)"],
          ["PaO₂", "80–100 mmHg", "Oxygenation status (not acid-base)"],
        ]} />
        <KeyPoint><strong>{t("pages.nursingStudyGuides.keyPrinciple2")}</strong> {t("pages.nursingStudyGuides.theLungsCompensateQuicklyMinutes")}</KeyPoint>
      </Section>
      <Section title={t("pages.nursingStudyGuides.stepbystepAbgInterpretation")}>
        <p><strong>{t("pages.nursingStudyGuides.step1EvaluatePh")}</strong> {t("pages.nursingStudyGuides.below735AcidosisAbove745")}</p>
        <p><strong>{t("pages.nursingStudyGuides.step2EvaluatePaco")}</strong> {t("pages.nursingStudyGuides.ifPacoIsAbnormalAnd")}</p>
        <p><strong>{t("pages.nursingStudyGuides.step3EvaluateHco")}</strong> {t("pages.nursingStudyGuides.ifHcoIsAbnormalAnd")}</p>
        <p><strong>{t("pages.nursingStudyGuides.step4AssessCompensation")}</strong> {t("pages.nursingStudyGuides.ifTheOtherSystemRespiratory")}</p>
        <ExamTip><strong>{t("pages.nursingStudyGuides.nclexTip3")}</strong> {t("pages.nursingStudyGuides.theRomeMnemonicRespiratoryOpposite")}</ExamTip>
      </Section>
      <Section title={t("pages.nursingStudyGuides.respiratoryAcidosis")}>
        <p><strong>{t("pages.nursingStudyGuides.definition")}</strong> {t("pages.nursingStudyGuides.phLt735WithPaco")}</p>
        <p><strong>{t("pages.nursingStudyGuides.commonCauses")}</strong> {t("pages.nursingStudyGuides.copdRespiratoryDepressionOpioidsSedation")}</p>
        <p><strong>{t("pages.nursingStudyGuides.signs")}</strong> {t("pages.nursingStudyGuides.dyspneaConfusionHeadacheDrowsinessProgressi")}</p>
        <p><strong>{t("pages.nursingStudyGuides.nursingInterventions")}</strong> {t("pages.nursingStudyGuides.improveVentilationPositioningBronchodilators")}</p>
      </Section>
      <Section title={t("pages.nursingStudyGuides.respiratoryAlkalosis")}>
        <p><strong>{t("pages.nursingStudyGuides.definition2")}</strong> {t("pages.nursingStudyGuides.phGt745WithPaco")}</p>
        <p><strong>{t("pages.nursingStudyGuides.commonCauses2")}</strong> {t("pages.nursingStudyGuides.anxietypanicAttacksPainFeverEarly")}</p>
        <p><strong>{t("pages.nursingStudyGuides.signs2")}</strong> {t("pages.nursingStudyGuides.lightheadednessNumbnesstinglingCircumoralAnd")}</p>
        <p><strong>{t("pages.nursingStudyGuides.nursingInterventions2")}</strong> {t("pages.nursingStudyGuides.addressUnderlyingCauseCoachSlow")}</p>
      </Section>
      <Section title={t("pages.nursingStudyGuides.metabolicAcidosis")}>
        <p><strong>{t("pages.nursingStudyGuides.definition3")}</strong> {t("pages.nursingStudyGuides.phLt735WithHco")}</p>
        <p><strong>{t("pages.nursingStudyGuides.commonCauses3")}</strong> {t("pages.nursingStudyGuides.dkaLacticAcidosisRenalFailure")}</p>
        <p><strong>{t("pages.nursingStudyGuides.signs3")}</strong> {t("pages.nursingStudyGuides.kussmaulRespirationsDeepRapidBreathing")}</p>
        <p><strong>{t("pages.nursingStudyGuides.nursingInterventions3")}</strong> {t("pages.nursingStudyGuides.treatUnderlyingCauseInsulinFor")}</p>
        <KeyPoint><strong>{t("pages.nursingStudyGuides.calculateTheAnionGap")}</strong> to differentiate between anion gap acidosis (DKA, lactic acidosis — MUDPILES) and non-anion gap acidosis (diarrhea, RTA — HARDUPS). Use our <LocaleLink href="/clinical-calculators/anion-gap" className="text-emerald-600 underline">{t("pages.nursingStudyGuides.anionGapCalculator")}</LocaleLink>.</KeyPoint>
      </Section>
      <Section title={t("pages.nursingStudyGuides.metabolicAlkalosis")}>
        <p><strong>{t("pages.nursingStudyGuides.definition4")}</strong> {t("pages.nursingStudyGuides.phGt745WithHco")}</p>
        <p><strong>{t("pages.nursingStudyGuides.commonCauses4")}</strong> {t("pages.nursingStudyGuides.prolongedVomitingngSuctionLossOf")}</p>
        <p><strong>{t("pages.nursingStudyGuides.signs4")}</strong> {t("pages.nursingStudyGuides.confusionMuscleTwitchingHandTremors")}</p>
        <p><strong>{t("pages.nursingStudyGuides.nursingInterventions4")}</strong> {t("pages.nursingStudyGuides.replaceChlorideAndPotassiumAdminister")}</p>
        <ExamTip><strong>{t("pages.nursingStudyGuides.examTip2")}</strong> {t("pages.nursingStudyGuides.vomitingCausesMetabolicAlkalosisLoss")}</ExamTip>
      </Section>
    </StudyGuidePageWrapper>
  );
}

function ECGGuide() {
  const guide = STUDY_GUIDES.find(g => g.slug === "ecg-interpretation-study-guide")!;
  const faqs = [
    { question: "What cardiac rhythms must I recognize for the NCLEX?", answer: "You must recognize lethal rhythms: ventricular fibrillation (immediate defibrillation), pulseless ventricular tachycardia (defibrillation), asystole (CPR + epinephrine), and PEA (CPR + treat cause). You should also know atrial fibrillation (irregularly irregular, stroke risk), heart blocks (especially Type II and third-degree), and normal sinus rhythm." },
    { question: "How do I quickly calculate heart rate on an ECG strip?", answer: "Use the '300 method': count the number of large boxes between two consecutive R waves, then divide 300 by that number. For example, 4 large boxes between R waves = 300 ÷ 4 = 75 bpm. For irregular rhythms, count the number of R waves in a 6-second strip and multiply by 10." },
    { question: "What is the difference between a shockable and non-shockable rhythm?", answer: "Shockable rhythms (treat with defibrillation): ventricular fibrillation and pulseless ventricular tachycardia. Non-shockable rhythms (treat with CPR and medications): asystole and pulseless electrical activity (PEA). This distinction is critical for ACLS algorithms and is frequently tested on nursing exams." },
  ];
  return (
    <StudyGuidePageWrapper guide={guide} faqs={faqs}>
      <Section title={t("pages.nursingStudyGuides.systematicEcgInterpretationApproach")}>
        <p>{t("pages.nursingStudyGuides.consistentEcgAnalysisRequiresA")}</p>
        <ValueTable headers={["Component", "Normal Value", "What It Represents"]} rows={[
          ["Heart Rate", "60–100 bpm", "Ventricular rate (count R-R intervals)"],
          ["P Wave", "Upright, uniform", "Atrial depolarization"],
          ["PR Interval", "0.12–0.20 sec", "AV conduction time"],
          ["QRS Complex", "< 0.12 sec", "Ventricular depolarization"],
          ["QT Interval", "< 0.44 sec", "Total ventricular activity"],
          ["ST Segment", "Isoelectric (flat)", "Early ventricular repolarization"],
          ["T Wave", "Upright, rounded", "Ventricular repolarization"],
        ]} />
        <ExamTip><strong>{t("pages.nursingStudyGuides.nclexTip4")}</strong> {t("pages.nursingStudyGuides.youDontNeedToBe")}</ExamTip>
      </Section>
      <Section title={t("pages.nursingStudyGuides.normalSinusRhythmNsr")}>
        <p>{t("pages.nursingStudyGuides.normalSinusRhythmIsThe")}</p>
      </Section>
      <Section title={t("pages.nursingStudyGuides.commonArrhythmias")}>
        <p><strong>{t("pages.nursingStudyGuides.sinusBradycardia")}</strong> {t("pages.nursingStudyGuides.rateLt60BpmWith")}</p>
        <p><strong>{t("pages.nursingStudyGuides.sinusTachycardia")}</strong> {t("pages.nursingStudyGuides.rateGt100BpmWith")}</p>
        <p><strong>{t("pages.nursingStudyGuides.atrialFibrillationAfib")}</strong> {t("pages.nursingStudyGuides.irregularlyIrregularRhythmWithNo")}</p>
        <p><strong>{t("pages.nursingStudyGuides.atrialFlutter")}</strong> {t("pages.nursingStudyGuides.sawtoothPatternOfFlutterWaves")}</p>
        <KeyPoint><strong>{t("pages.nursingStudyGuides.keyNursingActionForAfib")}</strong> {t("pages.nursingStudyGuides.assessForSignsOfStroke")}</KeyPoint>
      </Section>
      <Section title={t("pages.nursingStudyGuides.heartBlocks")}>
        <p><strong>{t("pages.nursingStudyGuides.firstdegreeAvBlock")}</strong> {t("pages.nursingStudyGuides.prIntervalGt020Sec")}</p>
        <p><strong>{t("pages.nursingStudyGuides.seconddegreeTypeIWenckebach")}</strong> {t("pages.nursingStudyGuides.progressivePrProlongationUntilA")}</p>
        <p><strong>{t("pages.nursingStudyGuides.seconddegreeTypeIiMobitzIi")}</strong> {t("pages.nursingStudyGuides.consistentPrIntervalsWithSudden")}</p>
        <p><strong>{t("pages.nursingStudyGuides.thirddegreeCompleteHeartBlock")}</strong> {t("pages.nursingStudyGuides.completeAvDissociationPWaves")}</p>
        <ExamTip><strong>{t("pages.nursingStudyGuides.examTip3")}</strong> {t("pages.nursingStudyGuides.wenckebachThinkLongerLongerLonger")}</ExamTip>
      </Section>
      <Section title={t("pages.nursingStudyGuides.ventricularRhythms")}>
        <p><strong>{t("pages.nursingStudyGuides.prematureVentricularContractionsPvcs")}</strong> {t("pages.nursingStudyGuides.wideBizarreQrsComplexesFollowed")}</p>
        <p><strong>{t("pages.nursingStudyGuides.ventricularTachycardiaVtach")}</strong> {t("pages.nursingStudyGuides.threeOrMoreConsecutivePvcs")}</p>
        <p><strong>{t("pages.nursingStudyGuides.ventricularFibrillationVfib")}</strong> {t("pages.nursingStudyGuides.chaoticDisorganizedElectricalActivityNo")}</p>
        <KeyPoint><strong>{t("pages.nursingStudyGuides.lifethreateningRhythms")}</strong> {t("pages.nursingStudyGuides.vfibAndPulselessVtachAre")}</KeyPoint>
      </Section>
      <Section title={t("pages.nursingStudyGuides.stemiRecognition")}>
        <p>{t("pages.nursingStudyGuides.stelevationMyocardialInfarctionStemiRequire")}</p>
        <p><strong>{t("pages.nursingStudyGuides.nursingPrioritiesForStemi")}</strong> {t("pages.nursingStudyGuides.monaMorphineIfNeededOxygen")}</p>
      </Section>
    </StudyGuidePageWrapper>
  );
}

function FluidBalanceGuide() {
  const guide = STUDY_GUIDES.find(g => g.slug === "fluid-electrolyte-balance-guide")!;
  const faqs = [
    { question: "What is the most accurate way to assess fluid status?", answer: "Daily weights are the most accurate indicator of fluid status changes. A gain of 1 kg (2.2 lbs) equals approximately 1 liter of fluid retention. Always weigh the patient at the same time of day, on the same scale, with similar clothing. I&O monitoring is also important but less precise." },
    { question: "When should I use isotonic vs hypotonic vs hypertonic IV fluids?", answer: "Isotonic (0.9% NS, LR): volume resuscitation, dehydration, hemorrhage — stays in ECF. Hypotonic (0.45% NS): cellular dehydration, hypernatremia — shifts water into cells. Hypertonic (3% saline): severe hyponatremia, cerebral edema — pulls water from cells into ECF. Never give hypotonic fluids to patients with increased ICP." },
    { question: "What is third-spacing and why is it clinically significant?", answer: "Third-spacing is the shift of fluid from the intravascular space into non-functional compartments (peritoneal cavity, pleural space, interstitial tissue). It occurs in burns, sepsis, liver failure, and post-surgical states. The patient may be intravascularly depleted (hypotensive, tachycardic) while appearing edematous — this is why assessment is critical." },
  ];
  return (
    <StudyGuidePageWrapper guide={guide} faqs={faqs}>
      <Section title={t("pages.nursingStudyGuides.fluidCompartmentsAndDistribution")}>
        <p>{t("pages.nursingStudyGuides.totalBodyWaterComprisesApproximately")}</p>
        <ValueTable headers={["Compartment", "Percentage of Body Water", "Clinical Significance"]} rows={[
          ["Intracellular (ICF)", "~67%", "Potassium is the primary cation; where cellular metabolism occurs"],
          ["Interstitial", "~25%", "Space between cells; edema occurs here"],
          ["Intravascular (Plasma)", "~8%", "Blood volume; affects blood pressure and perfusion"],
        ]} />
        <KeyPoint><strong>{t("pages.nursingStudyGuides.keyPrinciple3")}</strong> {t("pages.nursingStudyGuides.waterMovesBetweenCompartmentsBy")}</KeyPoint>
      </Section>
      <Section title={t("pages.nursingStudyGuides.typesOfIvFluids")}>
        <p><strong>{t("pages.nursingStudyGuides.isotonicFluidsOsmolality275295Mosml")}</strong> {t("pages.nursingStudyGuides.expandTheEcfWithoutCausing")}</p>
        <p><strong>{t("pages.nursingStudyGuides.hypotonicFluidsOsmolalityLt275")}</strong> {t("pages.nursingStudyGuides.causeWaterToShiftFrom")}</p>
        <p><strong>{t("pages.nursingStudyGuides.hypertonicFluidsOsmolalityGt295")}</strong> {t("pages.nursingStudyGuides.pullWaterFromCellsInto")}</p>
        <ExamTip><strong>{t("pages.nursingStudyGuides.nclexTip5")}</strong> {t("pages.nursingStudyGuides.rememberHypoSwellsCellsHyper")}</ExamTip>
      </Section>
      <Section title={t("pages.nursingStudyGuides.fluidVolumeDeficitDehydrationhypovolemia")}>
        <p><strong>{t("pages.nursingStudyGuides.causes")}</strong> {t("pages.nursingStudyGuides.hemorrhageVomitingDiarrheaExcessiveDiuresis")}</p>
        <p><strong>{t("pages.nursingStudyGuides.assessmentFindings")}</strong> {t("pages.nursingStudyGuides.tachycardiaHypotensionOrthostaticHypotension")}</p>
        <p><strong>{t("pages.nursingStudyGuides.nursingInterventions5")}</strong> {t("pages.nursingStudyGuides.ivFluidReplacementIsotonicFluids")}</p>
      </Section>
      <Section title={t("pages.nursingStudyGuides.fluidVolumeExcessHypervolemiaoverload")}>
        <p><strong>{t("pages.nursingStudyGuides.causes2")}</strong> {t("pages.nursingStudyGuides.heartFailureRenalFailureLiver")}</p>
        <p><strong>{t("pages.nursingStudyGuides.assessmentFindings2")}</strong> {t("pages.nursingStudyGuides.weightGainEdemaPeripheralPeriorbital")}</p>
        <p><strong>{t("pages.nursingStudyGuides.nursingInterventions6")}</strong> {t("pages.nursingStudyGuides.fluidAndSodiumRestrictionAdminister")}</p>
        <KeyPoint><strong>{t("pages.nursingStudyGuides.dailyWeights")}</strong> {t("pages.nursingStudyGuides.areTheMostAccurateIndicator")}</KeyPoint>
      </Section>
      <Section title={t("pages.nursingStudyGuides.osmolalityAndTonicity")}>
        <p><strong>{t("pages.nursingStudyGuides.serumOsmolality")}</strong> {t("pages.nursingStudyGuides.normal275295MosmkgReflectsThe")}</p>
        <p><strong>{t("pages.nursingStudyGuides.urineOsmolalityAndSpecificGravity")}</strong> {t("pages.nursingStudyGuides.helpAssessTheKidneysAbility")}</p>
      </Section>
    </StudyGuidePageWrapper>
  );
}

function CriticalLabValuesGuide() {
  const guide = STUDY_GUIDES.find(g => g.slug === "critical-lab-values-guide")!;
  const faqs = [
    { question: "What are the most important critical lab values for nursing exams?", answer: "The most commonly tested critical values are: potassium (< 2.5 or > 6.5 mEq/L), glucose (< 50 or > 400 mg/dL), hemoglobin (< 7 g/dL), platelets (< 50,000/μL), INR (> 4.5), troponin (> 0.4 ng/mL), and lactate (> 4.0 mmol/L). Know the nursing actions for each." },
    { question: "What should a nurse do immediately when receiving a critical lab value?", answer: "Follow these steps: (1) Verify the result (repeat if questionable), (2) Assess the patient for related symptoms, (3) Notify the provider using SBAR communication, (4) Implement standing orders or provider-directed interventions, (5) Document the time of notification, provider response, and actions taken." },
    { question: "What is the difference between a critical value and an abnormal value?", answer: "An abnormal value falls outside the normal reference range but may not require immediate action. A critical (panic) value is so far outside normal that it poses an immediate threat to patient safety and requires urgent notification and intervention. For example, potassium of 5.2 is abnormal but potassium of 6.8 is critical." },
  ];
  return (
    <StudyGuidePageWrapper guide={guide} faqs={faqs}>
      <Section title={t("pages.nursingStudyGuides.understandingCriticalLabValues")}>
        <p>{t("pages.nursingStudyGuides.criticalOrPanicLabValues")}</p>
        <KeyPoint><strong>{t("pages.nursingStudyGuides.nursingResponsibility")}</strong> {t("pages.nursingStudyGuides.whenYouReceiveACritical")}</KeyPoint>
      </Section>
      <Section title={t("pages.nursingStudyGuides.criticalElectrolyteValues")}>
        <ValueTable headers={["Lab Test", "Normal Range", "Critical Low", "Critical High", "Nursing Action"]} rows={[
          ["Potassium", "3.5–5.0 mEq/L", "< 2.5 mEq/L", "> 6.5 mEq/L", "Cardiac monitor, notify MD, treat per protocol"],
          ["Sodium", "135–145 mEq/L", "< 120 mEq/L", "> 160 mEq/L", "Neuro checks, fluid management, notify MD"],
          ["Calcium (total)", "8.5–10.5 mg/dL", "< 7.0 mg/dL", "> 12.0 mg/dL", "Seizure precautions, cardiac monitoring"],
          ["Magnesium", "1.5–2.5 mEq/L", "< 1.0 mEq/L", "> 4.0 mEq/L", "DTR assessment, respiratory monitoring"],
          ["Phosphorus", "2.5–4.5 mg/dL", "< 1.0 mg/dL", "> 8.0 mg/dL", "Assess muscle strength, respiratory status"],
          ["Glucose", "70–100 mg/dL", "< 50 mg/dL", "> 400 mg/dL", "Treat hypoglycemia immediately; DKA protocol for severe hyperglycemia"],
        ]} />
      </Section>
      <Section title={t("pages.nursingStudyGuides.criticalHematologyValues")}>
        <ValueTable headers={["Lab Test", "Normal Range", "Critical Low", "Critical High", "Nursing Action"]} rows={[
          ["Hemoglobin", "M: 13.5–17.5 g/dL, F: 12.0–16.0 g/dL", "< 7.0 g/dL", "> 20 g/dL", "Type & screen, prepare for transfusion"],
          ["Hematocrit", "M: 40–54%, F: 36–48%", "< 20%", "> 60%", "Assess for bleeding, dehydration"],
          ["Platelets", "150,000–400,000/μL", "< 50,000/μL", "> 1,000,000/μL", "Bleeding precautions, fall risk"],
          ["WBC", "4,500–11,000/μL", "< 2,000/μL", "> 30,000/μL", "Neutropenic precautions if low; assess for sepsis if elevated"],
          ["INR", "0.8–1.2 (therapeutic 2.0–3.0 on warfarin)", "—", "> 4.5", "Hold warfarin, assess for bleeding, vitamin K availability"],
        ]} />
        <ExamTip><strong>{t("pages.nursingStudyGuides.nclexTip6")}</strong> {t("pages.nursingStudyGuides.knowThe77RuleFor")}</ExamTip>
      </Section>
      <Section title={t("pages.nursingStudyGuides.criticalCardiacAndRenalValues")}>
        <ValueTable headers={["Lab Test", "Normal Range", "Critical Value", "Nursing Action"]} rows={[
          ["Troponin I", "< 0.04 ng/mL", "> 0.4 ng/mL", "12-lead ECG, activate chest pain protocol"],
          ["BNP", "< 100 pg/mL", "> 500 pg/mL", "Assess for heart failure, fluid status"],
          ["Lactate", "0.5–2.0 mmol/L", "> 4.0 mmol/L", "Sepsis screening, fluid resuscitation"],
          ["Creatinine", "0.6–1.2 mg/dL", "> 4.0 mg/dL", "Assess renal function, adjust medications"],
          ["BUN", "7–20 mg/dL", "> 100 mg/dL", "Assess for uremic symptoms, prepare for dialysis"],
        ]} />
      </Section>
      <Section title={t("pages.nursingStudyGuides.criticalAbgValues")}>
        <ValueTable headers={["Parameter", "Normal", "Critical", "Clinical Significance"]} rows={[
          ["pH", "7.35–7.45", "< 7.20 or > 7.60", "Severe acidosis or alkalosis — life-threatening"],
          ["PaCO₂", "35–45 mmHg", "< 20 or > 70 mmHg", "Severe respiratory failure"],
          ["PaO₂", "80–100 mmHg", "< 60 mmHg", "Respiratory failure (type 1)"],
          ["HCO₃⁻", "22–26 mEq/L", "< 10 or > 40 mEq/L", "Severe metabolic derangement"],
        ]} />
        <p>Use our <LocaleLink href="/clinical-calculators/abg-interpretation" className="text-emerald-600 underline">{t("pages.nursingStudyGuides.abgInterpretationHelper")}</LocaleLink> {t("pages.nursingStudyGuides.toPracticeStepbystepAcidbaseAnalysis")}</p>
      </Section>
      <Section title={t("pages.nursingStudyGuides.nursingResponseToCriticalValues")}>
        <p><strong>{t("pages.nursingStudyGuides.sbarCommunicationFramework")}</strong> {t("pages.nursingStudyGuides.whenNotifyingTheProviderAbout")}</p>
        <p><strong>{t("pages.nursingStudyGuides.sSituation")}</strong> {t("pages.nursingStudyGuides.imCallingAboutACritical")}</p>
        <p><strong>{t("pages.nursingStudyGuides.bBackground")}</strong> {t("pages.nursingStudyGuides.thePatientWasAdmittedFor")}</p>
        <p><strong>{t("pages.nursingStudyGuides.aAssessment")}</strong> {t("pages.nursingStudyGuides.thePotassiumCameBackAt")}</p>
        <p><strong>{t("pages.nursingStudyGuides.rRecommendation")}</strong> {t("pages.nursingStudyGuides.iWouldLikeToRequest")}</p>
        <KeyPoint><strong>{t("pages.nursingStudyGuides.documentation")}</strong> {t("pages.nursingStudyGuides.alwaysDocumentTheTimeThe")}</KeyPoint>
      </Section>
    </StudyGuidePageWrapper>
  );
}

function StudyGuideRouter() {
  const [, params] = useRoute("/nursing-study-guides/:slug");
  const slug = params?.slug;

  if (!slug) return <NursingStudyGuidesHub />;

  switch (slug) {
    case "electrolytes-nursing-guide": return <ElectrolytesGuide />;
    case "acid-base-disorders-study-guide": return <AcidBaseGuide />;
    case "ecg-interpretation-study-guide": return <ECGGuide />;
    case "fluid-electrolyte-balance-guide": return <FluidBalanceGuide />;
    case "critical-lab-values-guide": return <CriticalLabValuesGuide />;
    default: return <NursingStudyGuidesHub />;
  }
}

export default function NursingStudyGuidesPage() {
  return <StudyGuideRouter />;
}

export { NursingStudyGuidesHub };
