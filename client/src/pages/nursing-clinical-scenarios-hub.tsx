import { useState } from "react";
import { useRoute } from "wouter";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { LocaleLink } from "@/lib/LocaleLink";
import { useI18n } from "@/lib/i18n";
import { buildFaqStructuredData } from "@/lib/structured-data";
import {
  Stethoscope, HeartPulse, Thermometer, Wind, Brain, Baby,
  ArrowRight, ChevronDown, ChevronRight, CheckCircle2,
  AlertTriangle, Lightbulb, Target, BookOpen, ClipboardList
} from "lucide-react";

interface ScenarioDef {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: typeof Stethoscope;
  color: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

const SCENARIOS: ScenarioDef[] = [
  {
    slug: "chest-pain-emergency",
    title: "Chest Pain Emergency — Clinical Scenario",
    shortTitle: "Chest Pain Emergency",
    description: "A 62-year-old male presents with substernal chest pain radiating to the left arm. Work through the assessment, differential diagnosis, and nursing priorities for acute coronary syndrome.",
    icon: HeartPulse,
    color: "#DC2626",
    metaTitle: "Chest Pain Emergency — Nursing Clinical Scenario | NurseNest",
    metaDescription: "Interactive chest pain clinical scenario for nursing students. Assess a patient with acute chest pain, identify ACS, prioritize nursing interventions, and practice clinical reasoning for NCLEX.",
    keywords: "chest pain nursing scenario, acute coronary syndrome, STEMI nursing, cardiac emergency, NCLEX clinical scenario",
  },
  {
    slug: "sepsis-recognition",
    title: "Sepsis Recognition — Clinical Scenario",
    shortTitle: "Sepsis Recognition",
    description: "A 71-year-old female post-operative patient develops fever, tachycardia, and hypotension. Recognize the signs of sepsis and implement the sepsis bundle.",
    icon: Thermometer,
    color: "#F59E0B",
    metaTitle: "Sepsis Recognition — Nursing Clinical Scenario | NurseNest",
    metaDescription: "Interactive sepsis clinical scenario for nursing students. Recognize early sepsis signs, apply qSOFA and SIRS criteria, implement the sepsis bundle, and practice critical thinking for NCLEX.",
    keywords: "sepsis nursing scenario, sepsis recognition, qSOFA, sepsis bundle, NCLEX clinical scenario",
  },
  {
    slug: "respiratory-distress",
    title: "Respiratory Distress — Clinical Scenario",
    shortTitle: "Respiratory Distress",
    description: "A 55-year-old COPD patient presents with acute dyspnea, accessory muscle use, and declining oxygen saturation. Navigate the assessment and intervention priorities.",
    icon: Wind,
    color: "#3B82F6",
    metaTitle: "Respiratory Distress — Nursing Clinical Scenario | NurseNest",
    metaDescription: "Interactive respiratory distress clinical scenario for nursing students. Assess acute dyspnea in COPD, manage oxygen therapy, recognize respiratory failure, and practice NCLEX clinical reasoning.",
    keywords: "respiratory distress nursing, COPD exacerbation, dyspnea assessment, oxygen therapy nursing, NCLEX respiratory scenario",
  },
  {
    slug: "stroke-assessment",
    title: "Stroke Assessment — Clinical Scenario",
    shortTitle: "Stroke Assessment",
    description: "A 68-year-old male develops sudden right-sided weakness and slurred speech. Perform rapid stroke assessment and initiate time-critical interventions.",
    icon: Brain,
    color: "#8B5CF6",
    metaTitle: "Stroke Assessment — Nursing Clinical Scenario | NurseNest",
    metaDescription: "Interactive stroke assessment clinical scenario for nursing students. Practice FAST assessment, differentiate ischemic vs hemorrhagic stroke, and manage time-critical tPA administration for NCLEX.",
    keywords: "stroke nursing scenario, FAST assessment, tPA administration, ischemic stroke, NCLEX stroke scenario",
  },
  {
    slug: "pediatric-deterioration",
    title: "Pediatric Deterioration — Clinical Scenario",
    shortTitle: "Pediatric Deterioration",
    description: "A 3-year-old child with pneumonia shows signs of clinical deterioration. Recognize the pediatric early warning signs and escalate care appropriately.",
    icon: Baby,
    color: "#EC4899",
    metaTitle: "Pediatric Deterioration — Nursing Clinical Scenario | NurseNest",
    metaDescription: "Interactive pediatric deterioration clinical scenario for nursing students. Recognize early warning signs in children, apply PEWS scoring, and practice pediatric emergency nursing for NCLEX.",
    keywords: "pediatric deterioration nursing, PEWS scoring, pediatric emergency, child assessment nursing, NCLEX pediatric scenario",
  },
];

function ScenarioCard({ scenario }: { scenario: ScenarioDef }) {
  const Icon = scenario.icon;
  return (
    <LocaleLink href={`/nursing-clinical-scenarios/${scenario.slug}`} className="block" data-testid={`card-scenario-${scenario.slug}`}>
      <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-red-300 transition-all duration-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${scenario.color}15` }}>
            <Icon className="w-6 h-6" style={{ color: scenario.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-red-600 transition-colors" data-testid={`text-scenario-title-${scenario.slug}`}>
              {scenario.shortTitle}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{scenario.description}</p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-red-600 mt-3 group-hover:gap-2 transition-all">
              Start Scenario <ArrowRight className="w-4 h-4" />
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

function NursingClinicalScenariosHub() {
  const { t } = useI18n();

  const hubFaqs = [
    { question: "How do clinical scenarios help with nursing exam preparation?", answer: "Clinical scenarios build critical thinking and clinical judgment skills — exactly what NCLEX and other nursing exams test. By working through realistic patient situations, you practice the same reasoning process required on exam day: gathering data, recognizing patterns, prioritizing interventions, and evaluating outcomes." },
    { question: "Are these scenarios based on real clinical situations?", answer: "Yes. Each scenario is based on common clinical presentations that nurses encounter in practice and that appear frequently on licensing exams. The patient data, assessment findings, and clinical trajectories are realistic and educationally validated." },
    { question: "How should I work through each scenario?", answer: "Read the patient presentation carefully, then try to identify the priority assessment findings before scrolling to the analysis. Consider what additional information you'd need, what your priority interventions would be, and why. Then review the clinical reasoning walkthrough to compare your approach." },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Nursing Clinical Scenarios — Interactive Case Studies",
    "description": "Interactive nursing clinical scenarios for exam preparation. Practice clinical reasoning with realistic patient cases covering chest pain, sepsis, respiratory distress, stroke, and pediatric emergencies.",
    "provider": { "@type": "EducationalOrganization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
    "hasPart": SCENARIOS.map(s => ({
      "@type": "LearningResource",
      "name": s.title,
      "url": `https://www.nursenest.ca/nursing-clinical-scenarios/${s.slug}`,
      "educationalLevel": "College",
      "learningResourceType": "Clinical Scenario",
    })),
  };

  return (
    <>
      <SEO
        title={t("pages.nursingClinicalScenariosHub.nursingClinicalScenariosInteractiveCase")}
        description={t("pages.nursingClinicalScenariosHub.practiceClinicalReasoningWithInteractive")}
        keywords="nursing clinical scenarios, case studies nursing, clinical reasoning, NCLEX scenarios, nursing critical thinking, patient assessment"
        canonicalPath="/nursing-clinical-scenarios"
        structuredData={structuredData}
        additionalStructuredData={[buildFaqStructuredData(hubFaqs)]}
      />
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-red-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-1.5 rounded-full text-sm font-medium mb-4" data-testid="badge-scenarios">
              <Stethoscope className="w-4 h-4" /> Clinical Case Studies
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4" data-testid="text-scenarios-heading">
              {t("nursingClinicalScenarios.heading", { "default": "Nursing Clinical Scenarios" })}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" data-testid="text-scenarios-subtitle">
              Interactive clinical case studies that build the critical thinking and clinical judgment skills tested on NCLEX and nursing licensing exams. Each scenario includes patient data, assessment findings, clinical reasoning, and follow-up quiz questions.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2" data-testid="grid-scenarios">
            {SCENARIOS.map(scenario => (
              <ScenarioCard key={scenario.slug} scenario={scenario} />
            ))}
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t("pages.nursingClinicalScenariosHub.frequentlyAskedQuestions")}</h2>
            <div className="space-y-4">
              {hubFaqs.map((faq, i) => (
                <FaqAccordion key={i} question={faq.question} answer={faq.answer} index={i} />
              ))}
            </div>
          </div>

          <div className="mt-12 bg-red-50 dark:bg-red-900/20 rounded-xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t("pages.nursingClinicalScenariosHub.strengthenYourClinicalReasoning")}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Pair these scenarios with our study guides, clinical calculators, and question banks for comprehensive exam preparation.
            </p>
            <div className="flex flex-wrap gap-3">
              <LocaleLink href="/question-bank" className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors" data-testid="link-qbank-cta">
                <Target className="w-4 h-4" /> Question Bank
              </LocaleLink>
              <LocaleLink href="/nursing-study-guides" className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors" data-testid="link-guides-cta">
                <BookOpen className="w-4 h-4" /> Study Guides
              </LocaleLink>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function ScenarioSection({ title, children, color = "gray" }: { title: string; children: React.ReactNode; color?: string }) {
  const bgColors: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800",
    red: "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800",
    green: "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800",
    amber: "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800",
    purple: "bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800",
    gray: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
  };
  return (
    <div className={`rounded-xl border p-5 mb-6 ${bgColors[color] || bgColors.gray}`}>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{title}</h2>
      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

function QuizQuestion({ question, options, correctIndex, rationale, index }: { question: string; options: string[]; correctIndex: number; rationale: string; index: number }) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const correct = selected === correctIndex;
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4" data-testid={`quiz-question-${index}`}>
      <p className="font-medium text-gray-900 dark:text-white mb-3">{index + 1}. {question}</p>
      <div className="space-y-2">
        {options.map((opt, i) => {
          let cls = "w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors ";
          if (!answered) cls += "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800";
          else if (i === correctIndex) cls += "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200";
          else if (i === selected) cls += "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200";
          else cls += "border-gray-200 dark:border-gray-700 opacity-60";
          return (
            <button key={i} onClick={() => !answered && setSelected(i)} className={cls} disabled={answered} data-testid={`button-answer-${index}-${i}`}>
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={`mt-3 p-3 rounded-lg text-sm ${correct ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200" : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200"}`}>
          <p className="font-medium mb-1">{correct ? "✓ Correct!" : `✗ Incorrect. The correct answer is ${String.fromCharCode(65 + correctIndex)}.`}</p>
          <p>{rationale}</p>
        </div>
      )}
    </div>
  );
}

function ScenarioPageWrapper({ scenario, children }: { scenario: ScenarioDef; children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "name": scenario.title,
    "description": scenario.metaDescription,
    "url": `https://www.nursenest.ca/nursing-clinical-scenarios/${scenario.slug}`,
    "educationalLevel": "College",
    "learningResourceType": "Clinical Scenario",
    "provider": { "@type": "EducationalOrganization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
    "datePublished": "2025-02-01",
    "dateModified": "2026-03-01",
  };
  return (
    <>
      <SEO
        title={scenario.metaTitle}
        description={scenario.metaDescription}
        keywords={scenario.keywords}
        canonicalPath={`/nursing-clinical-scenarios/${scenario.slug}`}
        structuredData={structuredData}
      />
      <Navigation />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
          <div className="mb-6">
            <LocaleLink href="/nursing-clinical-scenarios" className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1" data-testid="link-back-scenarios">
              <ChevronRight className="w-4 h-4 rotate-180" /> All Scenarios
            </LocaleLink>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${scenario.color}15` }}>
              <scenario.icon className="w-5 h-5" style={{ color: scenario.color }} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white" data-testid="text-scenario-page-title">
              {scenario.shortTitle}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{scenario.description}</p>
          {children}
          <div className="mt-8 bg-gray-100 dark:bg-gray-800 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">{t("pages.nursingClinicalScenariosHub.continueLearning")}</h3>
            <div className="flex flex-wrap gap-3">
              <LocaleLink href="/question-bank" className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700" data-testid="link-more-questions">
                <Target className="w-4 h-4" /> Practice More Questions
              </LocaleLink>
              <LocaleLink href="/nursing-study-guides" className="inline-flex items-center gap-2 bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-gray-600" data-testid="link-study-guides">
                <BookOpen className="w-4 h-4" /> Study Guides
              </LocaleLink>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function ChestPainScenario() {
  const scenario = SCENARIOS.find(s => s.slug === "chest-pain-emergency")!;
  return (
    <ScenarioPageWrapper scenario={scenario}>
      <ScenarioSection title={t("pages.nursingClinicalScenariosHub.patientPresentation")} color="blue">
        <p><strong>{t("pages.nursingClinicalScenariosHub.patient")}</strong> {t("pages.nursingClinicalScenariosHub.mrJamesRodriguez62yearoldMale")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.chiefComplaint")}</strong> {t("pages.nursingClinicalScenariosHub.iHaveACrushingPain")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.historyOfPresentIllness")}</strong> {t("pages.nursingClinicalScenariosHub.painStarted45MinutesAgo")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.pastMedicalHistory")}</strong> {t("pages.nursingClinicalScenariosHub.hypertension10YearsHyperlipidemiaType")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.currentMedications")}</strong> {t("pages.nursingClinicalScenariosHub.lisinopril20MgDailyAtorvastatin")}</p>
      </ScenarioSection>

      <ScenarioSection title={t("pages.nursingClinicalScenariosHub.assessmentFindings")} color="red">
        <p><strong>{t("pages.nursingClinicalScenariosHub.vitalSigns")}</strong> {t("pages.nursingClinicalScenariosHub.bp15894MmhgHr102")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.general")}</strong> {t("pages.nursingClinicalScenariosHub.anxiousDiaphoreticClutchingChestSkin")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.cardiac")}</strong> {t("pages.nursingClinicalScenariosHub.s1s2HeardNoMurmursRegular")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.respiratory")}</strong> {t("pages.nursingClinicalScenariosHub.bilateralBreathSoundsClearNo")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.12leadEcg")}</strong> {t("pages.nursingClinicalScenariosHub.stElevationInLeadsIi")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.initialLabs")}</strong> {t("pages.nursingClinicalScenariosHub.troponinI08NgmlElevated")}</p>
      </ScenarioSection>

      <ScenarioSection title={t("pages.nursingClinicalScenariosHub.clinicalReasoning")} color="amber">
        <p><strong>{t("pages.nursingClinicalScenariosHub.priorityNursingDiagnosis")}</strong> {t("pages.nursingClinicalScenariosHub.decreasedCardiacOutputRelatedTo")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.analysis")}</strong> {t("pages.nursingClinicalScenariosHub.theStElevationInInferior")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.differentialConsiderations")}</strong> {t("pages.nursingClinicalScenariosHub.acutePericarditisDiffuseStElevation")}</p>
      </ScenarioSection>

      <ScenarioSection title={t("pages.nursingClinicalScenariosHub.nursingPriorities")} color="green">
        <p><strong>{t("pages.nursingClinicalScenariosHub.1ActivateCardiacCatheterizationTeam")}</strong> {t("pages.nursingClinicalScenariosHub.doortoballoonTimeGoalLt90")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.2MonaProtocol")}</strong> {t("pages.nursingClinicalScenariosHub.morphine24MgIvPrn")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.3IvAccess")}</strong> {t("pages.nursingClinicalScenariosHub.twoLargeboreIvs18gOr")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.4AdministerMedications")}</strong> {t("pages.nursingClinicalScenariosHub.heparinBolusDripPerProtocol")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.5ContinuousMonitoring")}</strong> {t("pages.nursingClinicalScenariosHub.cardiacTelemetrySerialEcgsRepeat")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.6PatientEducation")}</strong> {t("pages.nursingClinicalScenariosHub.explainProceduresProvideEmotionalSupport")}</p>
      </ScenarioSection>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t("pages.nursingClinicalScenariosHub.followupQuizQuestions")}</h2>
        <QuizQuestion index={0} question="Which ECG finding in this scenario indicates an inferior STEMI?" options={["ST depression in V1–V4", "ST elevation in leads II, III, aVF", "Peaked T waves in V1–V3", "Prolonged QT interval"]} correctIndex={1} rationale="ST elevation in leads II, III, and aVF indicates inferior wall myocardial infarction. These leads view the inferior surface of the heart supplied by the right coronary artery (RCA)." />
        <QuizQuestion index={1} question="What is the priority nursing intervention for this patient?" options={["Administer morphine for pain control", "Activate the cardiac catheterization team", "Start a nitroglycerin drip", "Obtain a chest X-ray"]} correctIndex={1} rationale="Activating the cath lab for primary PCI is the highest priority for a confirmed STEMI. Door-to-balloon time should be less than 90 minutes. Pain management and other interventions are important but secondary to reperfusion." />
        <QuizQuestion index={2} question="Which finding would contraindicate nitroglycerin administration in this patient?" options={["Heart rate of 102 bpm", "Systolic blood pressure below 90 mmHg", "Blood glucose of 185 mg/dL", "Oxygen saturation of 96%"]} correctIndex={1} rationale="Nitroglycerin causes vasodilation and can cause severe hypotension. It is contraindicated when SBP is below 90 mmHg. It is also contraindicated with right ventricular infarction and recent phosphodiesterase inhibitor use (sildenafil/tadalafil)." />
      </div>
    </ScenarioPageWrapper>
  );
}

function SepsisScenario() {
  const scenario = SCENARIOS.find(s => s.slug === "sepsis-recognition")!;
  return (
    <ScenarioPageWrapper scenario={scenario}>
      <ScenarioSection title={t("pages.nursingClinicalScenariosHub.patientPresentation2")} color="blue">
        <p><strong>{t("pages.nursingClinicalScenariosHub.patient2")}</strong> {t("pages.nursingClinicalScenariosHub.mrsEleanorChen71yearoldFemale")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.chiefComplaint2")}</strong> {t("pages.nursingClinicalScenariosHub.postoperativeDay3FollowingRight")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.historyOfPresentIllness2")}</strong> {t("pages.nursingClinicalScenariosHub.patientWasProgressingNormallyOn")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.pastMedicalHistory2")}</strong> {t("pages.nursingClinicalScenariosHub.osteoarthritisHypertensionType2Diabetes")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.currentMedications2")}</strong> {t("pages.nursingClinicalScenariosHub.cefazolin2gIvQ8hSurgical")}</p>
      </ScenarioSection>

      <ScenarioSection title={t("pages.nursingClinicalScenariosHub.assessmentFindings2")} color="red">
        <p><strong>{t("pages.nursingClinicalScenariosHub.vitalSigns2")}</strong> {t("pages.nursingClinicalScenariosHub.bp8852MmhgBaseline13078")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.qsofaScore23")}</strong> {t("pages.nursingClinicalScenariosHub.alteredMentalStatusSbp100")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.general2")}</strong> {t("pages.nursingClinicalScenariosHub.confusedRestlessAppearsIllSkin")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.wound")}</strong> {t("pages.nursingClinicalScenariosHub.rightHipIncisionWithErythema")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.respiratory2")}</strong> {t("pages.nursingClinicalScenariosHub.tachypneicBilateralBreathSoundsClear")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.urine")}</strong> {t("pages.nursingClinicalScenariosHub.foleyCatheterInPlaceUrine")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.labs")}</strong> {t("pages.nursingClinicalScenariosHub.wbc18200lLactate38Mmoll")}</p>
      </ScenarioSection>

      <ScenarioSection title={t("pages.nursingClinicalScenariosHub.clinicalReasoning2")} color="amber">
        <p><strong>{t("pages.nursingClinicalScenariosHub.sepsisIdentification")}</strong> {t("pages.nursingClinicalScenariosHub.thisPatientMeetsSirsCriteria")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.likelyInfectionSources")}</strong> {t("pages.nursingClinicalScenariosHub.surgicalSiteInfectionSsiWith")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.organDysfunctionMarkers")}</strong> {t("pages.nursingClinicalScenariosHub.acuteKidneyInjuryCreatinine16")}</p>
      </ScenarioSection>

      <ScenarioSection title={t("pages.nursingClinicalScenariosHub.nursingPrioritiesHour1SepsisBundle")} color="green">
        <p><strong>{t("pages.nursingClinicalScenariosHub.1ObtainCulturesBeforeAntibiotics")}</strong> {t("pages.nursingClinicalScenariosHub.bloodCultures2FromDifferent")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.2AdministerBroadspectrumIvAntibiotics")}</strong> {t("pages.nursingClinicalScenariosHub.within1HourOfSepsis")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.3AggressiveIvFluidResuscitation")}</strong> {t("pages.nursingClinicalScenariosHub.30MlkgCrystalloidTypicallyNs")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.4MeasureLactateLevel")}</strong> {t("pages.nursingClinicalScenariosHub.alreadyObtained38MmollRepeat")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.5IfMapRemainsLt")}</strong> {t("pages.nursingClinicalScenariosHub.initiateVasopressorTherapyNorepinephrineFirst")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.6ContinuousMonitoring")}</strong> {t("pages.nursingClinicalScenariosHub.strictIoUrineOutputGoal")}</p>
      </ScenarioSection>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t("pages.nursingClinicalScenariosHub.followupQuizQuestions2")}</h2>
        <QuizQuestion index={0} question="This patient's qSOFA score is 2. What does this indicate?" options={["The patient has a urinary tract infection", "The patient is at high risk for poor outcome from sepsis", "The patient needs surgical wound revision", "The patient's pain is inadequately managed"]} correctIndex={1} rationale="qSOFA (quick Sequential Organ Failure Assessment) uses three criteria: altered mental status, SBP ≤ 100, and RR ≥ 22. A score of ≥ 2 indicates high risk for poor outcomes and should prompt full sepsis workup and aggressive management." />
        <QuizQuestion index={1} question="What is the FIRST nursing action when sepsis is suspected?" options={["Administer IV antibiotics immediately", "Obtain blood cultures from two separate sites", "Start a norepinephrine drip", "Transfer the patient to the ICU"]} correctIndex={1} rationale="Obtaining cultures BEFORE starting antibiotics is critical for identifying the causative organism and guiding targeted therapy. However, do not delay antibiotics more than 45 minutes for cultures. Cultures first, then antibiotics within 1 hour." />
        <QuizQuestion index={2} question="The patient's lactate level is 3.8 mmol/L. What does this indicate?" options={["Normal metabolic function", "Tissue hypoperfusion and anaerobic metabolism", "Adequate fluid resuscitation", "Hyperglycemia from diabetes"]} correctIndex={1} rationale="Lactate > 2.0 mmol/L indicates tissue hypoperfusion — cells are not receiving adequate oxygen and are producing lactate through anaerobic metabolism. Lactate > 4.0 mmol/L is associated with significantly increased mortality. Serial lactate monitoring guides resuscitation adequacy." />
      </div>
    </ScenarioPageWrapper>
  );
}

function RespiratoryDistressScenario() {
  const scenario = SCENARIOS.find(s => s.slug === "respiratory-distress")!;
  return (
    <ScenarioPageWrapper scenario={scenario}>
      <ScenarioSection title={t("pages.nursingClinicalScenariosHub.patientPresentation3")} color="blue">
        <p><strong>{t("pages.nursingClinicalScenariosHub.patient3")}</strong> {t("pages.nursingClinicalScenariosHub.mrRobertWilliams55yearoldMale")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.chiefComplaint3")}</strong> {t("pages.nursingClinicalScenariosHub.iCantCatchMyBreath")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.historyOfPresentIllness3")}</strong> {t("pages.nursingClinicalScenariosHub.patientWithKnownCopdGold")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.pastMedicalHistory3")}</strong> {t("pages.nursingClinicalScenariosHub.copdDiagnosed8YearsAgo")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.currentMedications3")}</strong> {t("pages.nursingClinicalScenariosHub.tiotropiumSpiriva18McgDaily")}</p>
      </ScenarioSection>

      <ScenarioSection title={t("pages.nursingClinicalScenariosHub.assessmentFindings3")} color="red">
        <p><strong>{t("pages.nursingClinicalScenariosHub.vitalSigns3")}</strong> {t("pages.nursingClinicalScenariosHub.bp14888MmhgHr110")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.general3")}</strong> {t("pages.nursingClinicalScenariosHub.sittingUprightTripodPositionUsing")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.respiratory3")}</strong> {t("pages.nursingClinicalScenariosHub.diminishedBreathSoundsBilaterallyWith")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.cardiovascular")}</strong> {t("pages.nursingClinicalScenariosHub.tachycardicRegularNoJvd")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.abgOnRoomAir")}</strong> {t("pages.nursingClinicalScenariosHub.ph731Paco58Mmhg")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.labs2")}</strong> {t("pages.nursingClinicalScenariosHub.wbc13500lCrpElevatedBnp")}</p>
      </ScenarioSection>

      <ScenarioSection title={t("pages.nursingClinicalScenariosHub.clinicalReasoning3")} color="amber">
        <p><strong>{t("pages.nursingClinicalScenariosHub.abgInterpretation")}</strong> {t("pages.nursingClinicalScenariosHub.ph731AcidosisPaco58")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.diagnosis")}</strong> {t("pages.nursingClinicalScenariosHub.acuteExacerbationOfCopdAecopd")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.keyDistinction")}</strong> {t("pages.nursingClinicalScenariosHub.normalBnpRulesOutHeart")}</p>
      </ScenarioSection>

      <ScenarioSection title={t("pages.nursingClinicalScenariosHub.nursingPriorities2")} color="green">
        <p><strong>{t("pages.nursingClinicalScenariosHub.1ControlledOxygenTherapy")}</strong> {t("pages.nursingClinicalScenariosHub.startOViaVenturiMask")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.2BronchodilatorTherapy")}</strong> {t("pages.nursingClinicalScenariosHub.continuousNebulizedAlbuterol25Mg")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.3SystemicCorticosteroids")}</strong> {t("pages.nursingClinicalScenariosHub.methylprednisolone125MgIvOr")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.4Antibiotics")}</strong> {t("pages.nursingClinicalScenariosHub.initiateEmpiricAntibioticsEgAzithromycin")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.5PositionAndBreathing")}</strong> {t("pages.nursingClinicalScenariosHub.highFowlersPositionCoachPursedlip")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.6MonitorForDeterioration")}</strong> {t("pages.nursingClinicalScenariosHub.repeatAbgIn12Hours")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.7SputumCulture")}</strong> {t("pages.nursingClinicalScenariosHub.obtainBeforeStartingAntibioticsIf")}</p>
      </ScenarioSection>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t("pages.nursingClinicalScenariosHub.followupQuizQuestions3")}</h2>
        <QuizQuestion index={0} question="What is the target oxygen saturation for this COPD patient?" options={["95–100%", "92–96%", "88–92%", "85–88%"]} correctIndex={2} rationale="COPD patients with chronic CO₂ retention rely on hypoxic drive for respiratory stimulation. Target SpO₂ of 88–92% provides adequate oxygenation without suppressing the drive to breathe. Aiming for higher saturations can worsen hypercapnia and respiratory failure." />
        <QuizQuestion index={1} question="The ABG shows pH 7.31, PaCO₂ 58, HCO₃ 32, PaO₂ 54. What is the interpretation?" options={["Uncompensated metabolic acidosis", "Fully compensated respiratory acidosis", "Partially compensated respiratory acidosis with hypoxemia", "Respiratory alkalosis with metabolic compensation"]} correctIndex={2} rationale="pH < 7.35 = acidosis. PaCO₂ > 45 = respiratory cause. HCO₃ > 26 = metabolic compensation (kidneys retaining bicarbonate). Since pH is still abnormal, it's partially compensated. PaO₂ 54 < 60 = severe hypoxemia (respiratory failure)." />
        <QuizQuestion index={2} question="The patient's condition worsens despite nebulizers. RR increases to 38, PaCO₂ rises to 68, and the patient becomes drowsy. What is the priority intervention?" options={["Increase oxygen to 100% via non-rebreather mask", "Initiate non-invasive ventilation (BiPAP)", "Administer another albuterol nebulizer treatment", "Position the patient flat to improve ventilation"]} correctIndex={1} rationale="BiPAP (non-invasive positive pressure ventilation) is first-line for acute COPD exacerbation with worsening respiratory acidosis. It supports ventilation, reduces work of breathing, and can prevent intubation. Increasing O₂ to 100% could worsen CO₂ retention. Lying flat worsens dyspnea." />
      </div>
    </ScenarioPageWrapper>
  );
}

function StrokeScenario() {
  const scenario = SCENARIOS.find(s => s.slug === "stroke-assessment")!;
  return (
    <ScenarioPageWrapper scenario={scenario}>
      <ScenarioSection title={t("pages.nursingClinicalScenariosHub.patientPresentation4")} color="blue">
        <p><strong>{t("pages.nursingClinicalScenariosHub.patient4")}</strong> {t("pages.nursingClinicalScenariosHub.mrDavidPark68yearoldMale")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.chiefComplaint4")}</strong> {t("pages.nursingClinicalScenariosHub.wifeCalled911ReportingThat")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.historyOfPresentIllness4")}</strong> {t("pages.nursingClinicalScenariosHub.patientWasAtBaseline30")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.pastMedicalHistory4")}</strong> {t("pages.nursingClinicalScenariosHub.atrialFibrillationOnWarfarinInconsistent")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.currentMedications4")}</strong> {t("pages.nursingClinicalScenariosHub.warfarin5MgDailyMetoprolol")}</p>
      </ScenarioSection>

      <ScenarioSection title={t("pages.nursingClinicalScenariosHub.assessmentFindings4")} color="red">
        <p><strong>{t("pages.nursingClinicalScenariosHub.vitalSigns4")}</strong> {t("pages.nursingClinicalScenariosHub.bp186102MmhgHr88")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.fastAssessment")}</strong> {t("pages.nursingClinicalScenariosHub.faceLeftsidedFacialDroopWhen")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.nihssScore14")}</strong> {t("pages.nursingClinicalScenariosHub.moderatesevereStroke")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.neurological")}</strong> {t("pages.nursingClinicalScenariosHub.alertButConfusedFollowsSimple")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.labs3")}</strong> {t("pages.nursingClinicalScenariosHub.inr16SubtherapeuticTarget2030")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.ctHeadNoncontrastObtainedWithin")}</strong> {t("pages.nursingClinicalScenariosHub.noHemorrhageIdentifiedNoEarly")}</p>
      </ScenarioSection>

      <ScenarioSection title={t("pages.nursingClinicalScenariosHub.clinicalReasoning4")} color="amber">
        <p><strong>{t("pages.nursingClinicalScenariosHub.diagnosis2")}</strong> {t("pages.nursingClinicalScenariosHub.acuteIschemicStrokeLikelyCardioembolic")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.tpaEligibilityAssessment")}</strong> {t("pages.nursingClinicalScenariosHub.lastKnownWellTime30")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.criticalTimeFactor")}</strong> {t("pages.nursingClinicalScenariosHub.timeIsBrainApproximately19")}</p>
      </ScenarioSection>

      <ScenarioSection title={t("pages.nursingClinicalScenariosHub.nursingPriorities3")} color="green">
        <p><strong>{t("pages.nursingClinicalScenariosHub.1RapidAssessmentAndCt")}</strong> {t("pages.nursingClinicalScenariosHub.ctCompletedWithin10Minutes")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.2ActivateStrokeTeam")}</strong> {t("pages.nursingClinicalScenariosHub.notifyNeurologiststrokeTeamImmediatelyPrepar")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.3BloodPressureManagement")}</strong> {t("pages.nursingClinicalScenariosHub.forTpaCandidatesBpMust")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.4IvAlteplaseAdministration")}</strong> {t("pages.nursingClinicalScenariosHub.dose09MgkgMax90")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.5PosttpaMonitoringCritical24")}</strong> {t("pages.nursingClinicalScenariosHub.neuroChecksQ15min2hThen")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.6NpoStatusAndSwallow")}</strong> {t("pages.nursingClinicalScenariosHub.keepNpoUntilBedsideSwallow")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.7PositionHobAt30")}</strong> {t("pages.nursingClinicalScenariosHub.toOptimizeCerebralPerfusionAnd")}</p>
      </ScenarioSection>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t("pages.nursingClinicalScenariosHub.followupQuizQuestions4")}</h2>
        <QuizQuestion index={0} question="The patient's BP is 186/102 mmHg. Before tPA can be administered, the systolic BP must be below:" options={["160 mmHg", "180 mmHg", "185 mmHg", "200 mmHg"]} correctIndex={2} rationale="For IV alteplase (tPA) candidates, blood pressure must be < 185/110 mmHg before administration and maintained < 180/105 mmHg during and for 24 hours after infusion. This reduces the risk of hemorrhagic transformation." />
        <QuizQuestion index={1} question="The patient has atrial fibrillation and an INR of 1.6. Why is this clinically significant?" options={["The INR is too high — hemorrhagic stroke is likely", "The INR is subtherapeutic — inadequate stroke prophylaxis from A-fib", "The INR level is normal for this patient", "Atrial fibrillation does not increase stroke risk"]} correctIndex={1} rationale="A-fib is the most common cause of cardioembolic stroke. Therapeutic INR on warfarin (2.0–3.0) provides prophylaxis. This patient's INR of 1.6 is subtherapeutic, meaning he was not adequately anticoagulated — likely contributing to the stroke event. Inconsistent warfarin compliance is a known risk factor." />
        <QuizQuestion index={2} question="What is the FIRST assessment the nurse should perform before allowing the patient to eat or drink?" options={["Check blood glucose level", "Bedside swallow evaluation/dysphagia screening", "Auscultate bowel sounds", "Review dietary preferences"]} correctIndex={1} rationale="Stroke patients are at high risk for dysphagia and aspiration. A bedside swallow evaluation must be completed BEFORE any oral intake (food, fluids, or oral medications). Aspiration pneumonia is a leading cause of morbidity and mortality following stroke." />
      </div>
    </ScenarioPageWrapper>
  );
}

function PediatricDeteriorationScenario() {
  const scenario = SCENARIOS.find(s => s.slug === "pediatric-deterioration")!;
  return (
    <ScenarioPageWrapper scenario={scenario}>
      <ScenarioSection title={t("pages.nursingClinicalScenariosHub.patientPresentation5")} color="blue">
        <p><strong>{t("pages.nursingClinicalScenariosHub.patient5")}</strong> {t("pages.nursingClinicalScenariosHub.miaThompson3yearoldFemale")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.chiefComplaint5")}</strong> {t("pages.nursingClinicalScenariosHub.admitted18HoursAgoWith")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.historyOfPresentIllness5")}</strong> {t("pages.nursingClinicalScenariosHub.miaWasAdmittedWith3day")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.pastMedicalHistory5")}</strong> {t("pages.nursingClinicalScenariosHub.bornAt35WeeksGestation")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.weight")}</strong> {t("pages.nursingClinicalScenariosHub.14Kg")}</p>
      </ScenarioSection>

      <ScenarioSection title={t("pages.nursingClinicalScenariosHub.assessmentFindings5")} color="red">
        <p><strong>{t("pages.nursingClinicalScenariosHub.vitalSigns5")}</strong> {t("pages.nursingClinicalScenariosHub.hr168BpmNormalFor")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.general4")}</strong> {t("pages.nursingClinicalScenariosHub.listlessNotMakingEyeContact")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.respiratory4")}</strong> {t("pages.nursingClinicalScenariosHub.subcostalAndIntercostalRetractionsNasal")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.cardiovascular2")}</strong> {t("pages.nursingClinicalScenariosHub.tachycardicWeakPeripheralPulsesCool")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.urineOutput")}</strong> {t("pages.nursingClinicalScenariosHub.05MlkghrOverLast4")}</p>
      </ScenarioSection>

      <ScenarioSection title={t("pages.nursingClinicalScenariosHub.clinicalReasoning5")} color="amber">
        <p><strong>{t("pages.nursingClinicalScenariosHub.pediatricEarlyWarningSignsPews")}</strong> {t("pages.nursingClinicalScenariosHub.thisChildIsShowingMultiple")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.analysis2")}</strong> {t("pages.nursingClinicalScenariosHub.theClinicalPictureSuggestsProgression")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.criticalPediatricConcept")}</strong> {t("pages.nursingClinicalScenariosHub.childrenCompensateForShockMuch")}</p>
      </ScenarioSection>

      <ScenarioSection title={t("pages.nursingClinicalScenariosHub.nursingPriorities4")} color="green">
        <p><strong>{t("pages.nursingClinicalScenariosHub.1EscalateImmediately")}</strong> {t("pages.nursingClinicalScenariosHub.activateRapidResponseOrPediatric")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.2OptimizeOxygenation")}</strong> {t("pages.nursingClinicalScenariosHub.increaseToHighflowNasalCannula")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.3IvFluidResuscitation")}</strong> {t("pages.nursingClinicalScenariosHub.20MlkgNsBolus14")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.4ObtainCulturesAndLabs")}</strong> {t("pages.nursingClinicalScenariosHub.bloodCultures2CbcWith")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.5BroadenAntibioticCoverage")}</strong> {t("pages.nursingClinicalScenariosHub.theCurrentRegimenAmpicillinAlone")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.6ContinuousMonitoring2")}</strong> {t("pages.nursingClinicalScenariosHub.cardiacMonitoringContinuousPulseOximetry")}</p>
        <p><strong>{t("pages.nursingClinicalScenariosHub.7FamilycenteredCare")}</strong> {t("pages.nursingClinicalScenariosHub.keepParentsInformedAndAt")}</p>
      </ScenarioSection>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t("pages.nursingClinicalScenariosHub.followupQuizQuestions5")}</h2>
        <QuizQuestion index={0} question="Which assessment finding is the MOST concerning indicator of clinical deterioration in this child?" options={["Temperature of 39.8°C", "Heart rate of 168 bpm", "Mottled skin with prolonged capillary refill (4 seconds)", "Respiratory rate of 42"]} correctIndex={2} rationale="Mottled skin with prolonged capillary refill (> 3 seconds in children) indicates poor peripheral perfusion — a hallmark of shock. While tachycardia and tachypnea are concerning, poor perfusion (mottled skin, cool extremities, weak pulses) indicates the cardiovascular system is failing to deliver adequate oxygen to tissues." />
        <QuizQuestion index={1} question="How much IV fluid should be administered as a bolus for this 14 kg child showing signs of septic shock?" options={["140 mL (10 mL/kg)", "280 mL (20 mL/kg)", "420 mL (30 mL/kg)", "700 mL (50 mL/kg)"]} correctIndex={1} rationale="Initial fluid resuscitation for pediatric septic shock is 20 mL/kg of isotonic crystalloid (NS or LR) given rapidly over 5–10 minutes. For a 14 kg child: 14 × 20 = 280 mL. This can be repeated up to 60 mL/kg in the first hour while reassessing after each bolus." />
        <QuizQuestion index={2} question="A parent tells the nurse, 'Something is wrong — she's not acting like herself.' What is the appropriate nursing response?" options={["Reassure the parent that fever causes children to be less active", "Document the parent's concern and continue current care plan", "Take the concern seriously — perform a comprehensive reassessment immediately", "Ask the parent to leave the room so the child can rest"]} correctIndex={2} rationale="Parents know their child's baseline behavior better than anyone. Parental concern that a child 'doesn't look right' or 'isn't acting like themselves' is a validated early warning sign of clinical deterioration. The nurse should perform an immediate, thorough reassessment and escalate findings to the medical team." />
      </div>
    </ScenarioPageWrapper>
  );
}

function ScenarioRouter() {
  const [, params] = useRoute("/nursing-clinical-scenarios/:slug");
  const slug = params?.slug;

  if (!slug) return <NursingClinicalScenariosHub />;

  switch (slug) {
    case "chest-pain-emergency": return <ChestPainScenario />;
    case "sepsis-recognition": return <SepsisScenario />;
    case "respiratory-distress": return <RespiratoryDistressScenario />;
    case "stroke-assessment": return <StrokeScenario />;
    case "pediatric-deterioration": return <PediatricDeteriorationScenario />;
    default: return <NursingClinicalScenariosHub />;
  }
}

export default function NursingClinicalScenariosPage() {
  return <ScenarioRouter />;
}

export { NursingClinicalScenariosHub };
