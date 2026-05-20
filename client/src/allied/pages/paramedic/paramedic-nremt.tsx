import { AlliedSEO } from "@/allied/allied-seo";
import {
  HeroCTA, FreePreviewBlock, TrustBlock, FinalCTASection,
  FAQSection, TopicCategoryCard, FeatureCard, RegionNotesCallout
} from "./components";
import {
  BookOpen, FileText, Brain, Zap, Target, Shield, Ambulance, TrendingUp
} from "lucide-react";
import { paramedicQuestions } from "@/data/career-questions/paramedic-questions";

import { useI18n } from "@/lib/i18n";
const CATEGORY_COUNTS: Record<string, number> = {};
paramedicQuestions.forEach(q => {
  CATEGORY_COUNTS[q.category] = (CATEGORY_COUNTS[q.category] || 0) + 1;
});

const NREMT_RELEVANT = ["Airway Management", "Cardiology/ECG", "ACLS/PALS Protocols", "Trauma Management", "Medical Emergencies", "OB Emergencies", "Operations/EMS Systems", "Pharmacology"];
const NREMT_TOPICS = NREMT_RELEVANT.filter(c => CATEGORY_COUNTS[c]).map(c => ({
  title: c,
  questionCount: CATEGORY_COUNTS[c],
}));

const NREMT_FAQS = [
  { q: "Is this aligned with the NREMT paramedic cognitive exam?", a: "Yes. All content is mapped to the current NREMT Paramedic cognitive exam blueprint. Question distribution follows the official content area weighting: Airway/Respiration/Ventilation, Cardiology/Resuscitation, Trauma, Medical/OB/GYN, and EMS Operations." },
  { q: "Does the platform simulate the CAT format?", a: "Yes. The NREMT uses Computer Adaptive Testing, and our mock exams replicate this format. Question difficulty adjusts based on your performance, and the exam ends when the algorithm has sufficient confidence in your competency level — just like the real test." },
  { q: "How many NREMT practice questions are available?", a: "We have 500+ paramedic practice questions with NREMT-specific tagging. Questions cover all five NREMT content areas with appropriate difficulty distribution. New questions are added weekly." },
  { q: "Are US protocols and pharmacology used?", a: "Yes. Our NREMT track uses US drug names, US-standard dosing protocols, and references US regulatory frameworks. Use the region toggle to ensure you are studying US-specific content." },
  { q: "Can this help me prepare for the psychomotor exam too?", a: "Our platform focuses on cognitive exam preparation. However, our clinical scenario simulations walk through patient assessment sequences, treatment protocols, and clinical decision-making that build the knowledge foundation tested on psychomotor stations." },
  { q: "Is there a free trial?", a: "Yes. Take a free 15-question diagnostic to see your readiness score and domain breakdown. You also get 5 free practice questions with full rationales and one mock exam." },
];

export default function ParamedicNREMTPage() {
  const { t } = useI18n();
  return (
    <div data-testid="paramedic-nremt-page">
      <AlliedSEO
        title={t("allied.paramedicParamedicNremt.nremtParamedicPracticeQuestionsCognitive")}
        description={t("allied.paramedicParamedicNremt.prepareForTheNremtParamedic")}
        keywords="nremt paramedic practice questions, NREMT paramedic exam prep, national registry paramedic, NREMT practice test, paramedic cognitive exam, NREMT study guide, CAT paramedic exam"
        canonicalPath="/allied-health/paramedic/nremt"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Course",
          "name": "NREMT Paramedic Cognitive Exam Prep",
          "description": "National Registry Paramedic cognitive exam preparation with CAT-style adaptive questions, blueprint-weighted mock exams, and comprehensive clinical rationales.",
          "provider": { "@type": "Organization", "name": "NurseNest Allied", "url": "https://www.nursenest.ca/allied-health" }
        }}
      />

      <HeroCTA
        badge="NREMT Paramedic Exam Prep"
        title={t("allied.paramedicParamedicNremt.crushTheNremt")}
        titleHighlight="Paramedic Cognitive Exam"
        subtitle={t("allied.paramedic_nremt.catadaptivePracticeQuestionsBlueprintwei")}
        primaryCTA={{ label: "Start Free NREMT Diagnostic", href: "/diagnostic?career=paramedic" }}
        secondaryCTA={{ label: "Browse NREMT Questions", href: "/qbank?career=paramedic" }}
      />

      <section className="py-16 sm:py-20 bg-white" data-testid="section-nremt-features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{t("allied.paramedicParamedicNremt.designedForTheNremtFormat")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("allied.paramedicParamedicNremt.theNremtCognitiveExamUses")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={TrendingUp} title={t("allied.paramedicParamedicNremt.catadaptiveSimulation")} description={t("allied.paramedicParamedicNremt.ourEngineAdjustsQuestionDifficulty")} />
            <FeatureCard icon={Shield} title={t("allied.paramedicParamedicNremt.nremtBlueprintAlignment")} description={t("allied.paramedicParamedicNremt.questionsWeightedToTheOfficial")} />
            <FeatureCard icon={BookOpen} title={t("allied.paramedicParamedicNremt.600WordClinicalRationales")} description={t("allied.paramedicParamedicNremt.deepRationalesCoveringThePathophysiology")} />
            <FeatureCard icon={FileText} title={t("allied.paramedicParamedicNremt.fulllengthMockExams")} description={t("allied.paramedicParamedicNremt.timedExamsThatEndAdaptively")} />
            <FeatureCard icon={Target} title={t("allied.paramedicParamedicNremt.weakareaDrills")} description={t("allied.paramedicParamedicNremt.ourAnalyticsIdentifyYourLowestperforming")} />
            <FeatureCard icon={Brain} title={t("allied.paramedicParamedicNremt.usProtocolFocus")} description={t("allied.paramedicParamedicNremt.allContentUsesUsDrug")} />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gradient-to-b from-purple-50/30 to-white" data-testid="section-nremt-topics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{t("allied.paramedicParamedicNremt.nremtContentAreaCoverage")}</h2>
            <p className="text-gray-600 max-w-xl mx-auto">{t("allied.paramedicParamedicNremt.everyNremtContentAreaCovered")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {NREMT_TOPICS.map(t => (
              <TopicCategoryCard key={t.title} title={t.title} questionCount={t.questionCount} href={`/qbank?career=paramedic&category=${encodeURIComponent(t.title)}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 bg-white" data-testid="section-nremt-region-notes">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <RegionNotesCallout
            caNote="The NREMT certification is a US credential. Canadian paramedic students should use the PCP or ACP exam tracks instead. Canadian certifications follow COPR standards and provincial licensing requirements."
            usNote="The NREMT uses Computer Adaptive Testing (CAT) for the cognitive exam. All content uses US drug names, conventional lab units (mg/dL), and protocols consistent with US EMS standards. State-specific requirements may apply for licensure."
          />
        </div>
      </section>

      <FreePreviewBlock
        title={t("allied.paramedicParamedicNremt.tryNremtPrepFree")}
        subtitle={t("allied.paramedic_nremt.takeAFreeDiagnosticTo")}
        previewItems={[
          { label: "15-Question Diagnostic", description: "NREMT content area readiness assessment" },
          { label: "5 Practice Questions", description: "Full 600+ word clinical rationales" },
          { label: "1 CAT Mock Exam", description: "Adaptive exam simulation" },
        ]}
        ctaHref="/diagnostic?career=paramedic"
        ctaLabel="Start Free NREMT Diagnostic"
      />

      <FAQSection title={t("allied.paramedicParamedicNremt.nremtParamedicExamFaq")} faqs={NREMT_FAQS} />

      <TrustBlock />

      <FinalCTASection
        title={t("allied.paramedicParamedicNremt.yourNremtExamIsComing")}
        subtitle={t("allied.paramedic_nremt.startWithAFreeDiagnostic")}
        primaryCTA={{ label: "Start Free Diagnostic", href: "/diagnostic?career=paramedic" }}
        secondaryCTA={{ label: "View Pricing", href: "/allied-health/pricing" }}
      />
    </div>
  );
}
