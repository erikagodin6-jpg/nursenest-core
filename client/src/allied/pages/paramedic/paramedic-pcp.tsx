import { AlliedSEO } from "@/allied/allied-seo";
import {
  HeroCTA, FreePreviewBlock, TrustBlock, FinalCTASection,
  FAQSection, TopicCategoryCard, FeatureCard, RegionNotesCallout
} from "./components";
import {
  BookOpen, FileText, Brain, Zap, Target, Shield, Ambulance, Heart
} from "lucide-react";
import { paramedicQuestions } from "@/data/career-questions/paramedic-questions";

import { useI18n } from "@/lib/i18n";
const CATEGORY_COUNTS: Record<string, number> = {};
paramedicQuestions.forEach(q => {
  CATEGORY_COUNTS[q.category] = (CATEGORY_COUNTS[q.category] || 0) + 1;
});

const PCP_RELEVANT = ["Trauma Management", "Medical Emergencies", "Airway Management", "Pharmacology", "Pediatric Emergencies", "OB Emergencies", "Operations/EMS Systems", "Environmental Emergencies"];
const PCP_TOPICS = PCP_RELEVANT.filter(c => CATEGORY_COUNTS[c]).map(c => ({
  title: c,
  questionCount: CATEGORY_COUNTS[c],
}));

const PCP_FAQS = [
  { q: "What exam does PCP prep cover?", a: "Our PCP track is aligned with the Canadian COPR (Committee on Paramedic Registration) standards and provincial licensing exams across Canadian provinces. Content covers all PCP-level competencies including patient assessment, BLS, airway management, trauma, medical emergencies, and pharmacology within PCP scope of practice." },
  { q: "How many PCP practice questions are available?", a: "We currently have 500+ paramedic practice questions, with PCP-specific filtering available. Questions are tagged by difficulty and scope level so you can focus exclusively on PCP-level content. New questions are added weekly." },
  { q: "Are the rationales different from other paramedic question banks?", a: "Yes. Every question includes a 600+ word clinical rationale that explains the pathophysiology, assessment findings, and management reasoning — not just 'the answer is A.' This depth helps you build the clinical judgment tested on certification exams." },
  { q: "Can I use this for provincial licensing exams?", a: "Absolutely. While our content is aligned with national COPR competencies, the clinical knowledge and protocols covered are consistent with provincial licensing requirements across Canada. Use the region toggle to ensure Canadian protocols and drug names are prioritized." },
  { q: "Is there a free trial for PCP students?", a: "Yes. Start with a free 15-question diagnostic assessment to identify your strengths and gaps. You also get 5 free practice questions and one mock exam to experience the platform before subscribing." },
  { q: "How is PCP content different from ACP content?", a: "PCP content focuses on primary care paramedic scope: BLS, basic airway management, limited pharmacology, and fundamental patient assessment. ACP content adds advanced cardiac, 12-lead interpretation, expanded pharmacology, and advanced airway procedures. Our filtering ensures you only see content appropriate to your certification level." },
];

export default function ParamedicPCPPage() {
  const { t } = useI18n();
  return (
    <div data-testid="paramedic-pcp-page">
      <AlliedSEO
        title={t("allied.paramedicParamedicPcp.pcpExamPrepPrimaryCare")}
        description={t("allied.paramedicParamedicPcp.prepareForYourPcpExam")}
        keywords="pcp exam canada, primary care paramedic exam prep, COPR exam, PCP practice questions, paramedic exam canada, PCP certification, paramedic study guide canada"
        canonicalPath="/allied-health/paramedic/pcp"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Course",
          "name": "Primary Care Paramedic (PCP) Exam Prep",
          "description": "Comprehensive PCP exam preparation aligned with Canadian COPR standards. Adaptive question bank, mock exams, and clinical scenarios for primary care paramedic certification.",
          "provider": { "@type": "Organization", "name": "NurseNest Allied", "url": "https://www.nursenest.ca/allied-health" }
        }}
      />

      <HeroCTA
        badge="PCP Exam Prep — Canada"
        title={t("allied.paramedicParamedicPcp.passYourPcpExam")}
        titleHighlight="on the First Attempt"
        subtitle={t("allied.paramedic_pcp.copralignedPracticeQuestionsProvincialPr")}
        primaryCTA={{ label: "Start Free PCP Diagnostic", href: "/diagnostic?career=paramedic" }}
        secondaryCTA={{ label: "Browse PCP Questions", href: "/qbank?career=paramedic" }}
      />

      <section className="py-16 sm:py-20 bg-white" data-testid="section-pcp-overview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{t("allied.paramedicParamedicPcp.whatMakesOurPcpPrep")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("allied.paramedicParamedicPcp.builtSpecificallyForCanadianPcp")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={Shield} title={t("allied.paramedicParamedicPcp.copralignedContent")} description={t("allied.paramedicParamedicPcp.everyQuestionMapsToThe")} />
            <FeatureCard icon={BookOpen} title={t("allied.paramedicParamedicPcp.600WordRationales")} description={t("allied.paramedicParamedicPcp.clinicalRationalesThatExplainThe")} />
            <FeatureCard icon={Ambulance} title={t("allied.paramedicParamedicPcp.pcpScopespecific")} description={t("allied.paramedicParamedicPcp.contentFilteredToPcpScope")} />
            <FeatureCard icon={FileText} title={t("allied.paramedicParamedicPcp.blueprintweightedMocks")} description={t("allied.paramedicParamedicPcp.timedMockExamsWeightedTo")} />
            <FeatureCard icon={Brain} title={t("allied.paramedicParamedicPcp.spacedRepetitionFlashcards")} description={t("allied.paramedicParamedicPcp.masterBlsProtocolsDrugDosages")} />
            <FeatureCard icon={Zap} title={t("allied.paramedicParamedicPcp.clinicalScenarios")} description={t("allied.paramedicParamedicPcp.dispatchtodispositionScenariosWithinPcpScope")} />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gradient-to-b from-purple-50/30 to-white" data-testid="section-pcp-topics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{t("allied.paramedicParamedicPcp.highyieldPcpTopicCategories")}</h2>
            <p className="text-gray-600 max-w-xl mx-auto">{t("allied.paramedicParamedicPcp.focusYourStudyTimeOn")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PCP_TOPICS.map(t => (
              <TopicCategoryCard key={t.title} title={t.title} questionCount={t.questionCount} href={`/qbank?career=paramedic&category=${encodeURIComponent(t.title)}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 bg-white" data-testid="section-pcp-region-notes">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <RegionNotesCallout
            caNote="In Canada, paramedics follow COPR scope of practice standards. PCP certification is governed by provincial regulatory bodies, and drug formularies use Canadian generic names and SI units (mmol/L for glucose, µmol/L for creatinine)."
            usNote="In the US, EMT scope of practice varies by state EMS protocols. The NREMT certification provides national standardization, but individual state requirements may differ. Lab values use conventional units (mg/dL for glucose)."
          />
        </div>
      </section>

      <FreePreviewBlock
        title={t("allied.paramedicParamedicPcp.tryPcpPrepFree")}
        subtitle={t("allied.paramedic_pcp.seeWhereYouStandWith")}
        previewItems={[
          { label: "15-Question Diagnostic", description: "Identify your PCP strengths and gaps" },
          { label: "5 Practice Questions", description: "Full 600+ word rationales included" },
          { label: "1 Mock Exam", description: "Experience the timed exam format" },
        ]}
        ctaHref="/diagnostic?career=paramedic"
        ctaLabel="Start Free PCP Diagnostic"
      />

      <FAQSection title={t("allied.paramedicParamedicPcp.pcpExamPrepFaq")} faqs={PCP_FAQS} />

      <TrustBlock />

      <FinalCTASection
        title={t("allied.paramedicParamedicPcp.readyToStartStudyingFor")}
        subtitle={t("allied.paramedic_pcp.takeTheFreeDiagnosticToday")}
        primaryCTA={{ label: "Start Free Diagnostic", href: "/diagnostic?career=paramedic" }}
        secondaryCTA={{ label: "View Pricing", href: "/allied-health/pricing" }}
      />
    </div>
  );
}
