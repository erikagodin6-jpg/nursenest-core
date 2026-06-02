import { Link } from "wouter";
import {
  Ambulance, BookOpen, Brain, FileText, Zap, Target, Clock,
  ArrowRight, CheckCircle2, AlertTriangle, Search, Shuffle,
  Calendar, GraduationCap, TrendingUp, Shield, Layers, Heart
} from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";
import {
  HeroCTA, StudyPathSteps, TrackCard, PainPointCard, FeatureCard,
  TopicCategoryCard, FreePreviewBlock, ExamPathCard, TrustBlock,
  FinalCTASection, RegionSelector
} from "./components";
import { paramedicQuestions } from "@/data/career-questions/paramedic-questions";
import { useParamedicRegion } from "@/allied/contexts/paramedic-region-context";

import { useI18n } from "@/lib/i18n";
const CATEGORY_COUNTS: Record<string, number> = {};
paramedicQuestions.forEach(q => {
  CATEGORY_COUNTS[q.category] = (CATEGORY_COUNTS[q.category] || 0) + 1;
});

const ACTUAL_CATEGORIES = Object.keys(CATEGORY_COUNTS).sort((a, b) => (CATEGORY_COUNTS[b] || 0) - (CATEGORY_COUNTS[a] || 0));

const TOPIC_CATEGORIES = ACTUAL_CATEGORIES.slice(0, 8).map(name => ({
  title: name,
  questionCount: CATEGORY_COUNTS[name],
}));

const STUDY_STEPS = [
  { step: 1, title: "Take the Diagnostic", description: "A free 15-question assessment identifies your strengths and gaps across all paramedic domains.", icon: Target },
  { step: 2, title: "Follow Your Study Plan", description: "Get a personalized daily schedule targeting your weakest areas first, calibrated to your exam date.", icon: Calendar },
  { step: 3, title: "Practice & Review", description: "Work through adaptive questions, flashcards, and clinical scenarios with 600+ word rationales.", icon: BookOpen },
  { step: 4, title: "Simulate Exam Day", description: "Take timed, blueprint-weighted mock exams and track your readiness score over time.", icon: GraduationCap },
];

function slugify(text: string): string {
  const { t } = useI18n();
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function ParamedicLandingPage() {
  const { region, isCanada, isUS } = useParamedicRegion();

  const caExamTracks = [
    { title: "PCP Students", description: "Primary Care Paramedic learners preparing for COPR or provincial exams in Canada.", examNames: ["COPR", "Provincial PCP"], href: "/allied-health/paramedic/pcp", color: "#7C3AED", icon: Ambulance },
    { title: "ACP Candidates", description: "Advanced Care Paramedics studying ACLS, PALS, pharmacology, and 12-lead interpretation.", examNames: ["ACP Provincial", "COPR ACP"], href: "/allied-health/paramedic/acp", color: "#0D9488", icon: Heart },
  ];

  const usExamTracks = [
    { title: "EMT-Basic", description: "Entry-level emergency medical technicians preparing for the NREMT EMT cognitive exam.", examNames: ["NREMT EMT"], href: "/allied-health/paramedic/nremt", color: "#2563EB", icon: Shield },
    { title: "EMT-Advanced", description: "Advanced EMTs bridging to paramedic level with expanded scope of practice.", examNames: ["NREMT AEMT"], href: "/allied-health/paramedic/nremt", color: "#D97706", icon: TrendingUp },
    { title: "NREMT Paramedic", description: "US-based paramedic students preparing for the National Registry cognitive and psychomotor exams.", examNames: ["NREMT Paramedic"], href: "/allied-health/paramedic/nremt", color: "#2563EB", icon: Shield },
  ];

  const examTracks = isCanada ? caExamTracks : usExamTracks;

  return (
    <div data-testid="paramedic-landing-page">
      <AlliedSEO
        title={t("allied.paramedicParamedicLanding.paramedicExamPrepPcpAcp")}
        description={t("allied.paramedicParamedicLanding.prepareForYourParamedicCertification")}
        keywords="paramedic exam prep, NREMT practice questions, PCP exam canada, ACP exam, paramedic practice test, paramedic flashcards, paramedic study guide, EMS certification"
        canonicalPath="/allied-health/paramedic"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Course",
          "name": "Paramedic Certification Exam Prep",
          "description": "Comprehensive paramedic exam preparation with adaptive question banks, clinical scenarios, and blueprint-weighted mock exams for NREMT, COPR, PCP, and ACP certifications.",
          "provider": { "@type": "Organization", "name": "NurseNest Allied", "url": "https://www.nursenest.ca/allied-health" }
        }}
      />

      <HeroCTA
        badge="Paramedic Exam Academy"
        title={t("allied.paramedicParamedicLanding.passYourParamedicCertificationExam")}
        titleHighlight="With Confidence"
        subtitle={isCanada
          ? "500+ adaptive practice questions, clinical scenarios, ACLS/PALS drills, and blueprint-weighted mock exams — built for PCP and ACP learners preparing for COPR and provincial certification exams. Don't risk failing your paramedic exam — start building confidence today."
          : "500+ adaptive practice questions, clinical scenarios, ACLS/PALS drills, and blueprint-weighted mock exams — built for EMT, AEMT, and NREMT Paramedic learners. Don't risk failing your certification exam — start building confidence today."
        }
        primaryCTA={{ label: "Start Free Diagnostic", href: "/diagnostic?career=paramedic" }}
        secondaryCTA={{ label: "Try Free Questions", href: "/allied-health/paramedic/questions" }}
      />

      <section className="py-6 bg-white border-b border-gray-100" data-testid="section-region-selector">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-4">
          <span className="text-sm text-gray-500 font-medium">{t("allied.paramedicParamedicLanding.selectYourRegion")}</span>
          <RegionSelector />
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white" data-testid="section-who-this-is-for">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {isCanada ? "Canadian Paramedic Exam Tracks" : "US EMS Certification Tracks"}
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              {isCanada
                ? "Whether you are starting your PCP program or preparing for an advanced care paramedic exam, NurseNest meets you where you are."
                : "From EMT-Basic through NREMT Paramedic, NurseNest has the study tools matched to your certification level."
              }
            </p>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${examTracks.length > 2 ? "lg:grid-cols-3" : "lg:grid-cols-2 max-w-3xl mx-auto"} gap-6`}>
            {examTracks.map(track => (
              <TrackCard key={track.title} {...track} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gradient-to-b from-purple-50/30 to-white" data-testid="section-pain-points">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{t("allied.paramedicParamedicLanding.weKnowWhatsHoldingYou")}</h2>
            <p className="text-gray-600 max-w-xl mx-auto">{t("allied.paramedicParamedicLanding.paramedicExamPrepIsFragmented")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <PainPointCard icon={AlertTriangle} title={t("allied.paramedicParamedicLanding.shallowRationales")} description={t("allied.paramedicParamedicLanding.mostQuestionBanksGiveYou")} />
            <PainPointCard icon={Search} title={t("allied.paramedicParamedicLanding.noWeakareaTargeting")} description={t("allied.paramedicParamedicLanding.studyingRandomQuestionsWastesTime")} />
            <PainPointCard icon={Shuffle} title={t("allied.paramedicParamedicLanding.contentThatDoesntMatchYour")} description={isCanada ? "Generic EMS prep doesn't distinguish PCP from ACP scope. Your study material should match your specific certification track and Canadian protocols." : "Generic EMS prep doesn't match your specific NREMT certification level. Your study material should align with US protocols and exam blueprints."} />
            <PainPointCard icon={Clock} title={t("allied.paramedicParamedicLanding.noStructuredStudyPlan")} description={t("allied.paramedicParamedicLanding.youKnowYouNeedTo")} />
            <PainPointCard icon={Layers} title={t("allied.paramedicParamedicLanding.scatteredResources")} description={t("allied.paramedicParamedicLanding.textbooksYoutubeRandomAppsJuggling")} />
            <PainPointCard icon={FileText} title={t("allied.paramedicParamedicLanding.noRealisticExamSimulation")} description={t("allied.paramedicParamedicLanding.youveNeverExperiencedATimed")} />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white" data-testid="section-how-nursenest-helps">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{t("allied.paramedicParamedicLanding.howNursenestHelpsYouPass")}</h2>
            <p className="text-gray-600 max-w-xl mx-auto">{t("allied.paramedicParamedicLanding.sixIntegratedStudyToolsOne")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={BookOpen} title={t("allied.paramedicParamedicLanding.adaptiveTestBank")} description={t("allied.paramedicParamedicLanding.500ParamedicspecificQuestionsWith600")} />
            <FeatureCard icon={FileText} title={t("allied.paramedicParamedicLanding.blueprintweightedMocks")} description={isCanada ? "Timed mock exams weighted to COPR or provincial blueprints. Get a readiness score and domain-level breakdown." : "Timed mock exams weighted to the NREMT blueprint. Get a readiness score and domain-level breakdown."} />
            <FeatureCard icon={Brain} title={t("allied.paramedicParamedicLanding.spacedRepetitionFlashcards")} description={t("allied.paramedicParamedicLanding.masterDrugDosagesProtocolsAnd")} />
            <FeatureCard icon={Zap} title={t("allied.paramedicParamedicLanding.clinicalScenarios")} description={t("allied.paramedicParamedicLanding.unfoldingDispatchtodispositionScenariosWithB")} />
            <FeatureCard icon={Target} title={t("allied.paramedicParamedicLanding.weakareaTargeting")} description={t("allied.paramedicParamedicLanding.ourAnalyticsEngineIdentifiesYour")} />
            <FeatureCard icon={GraduationCap} title={t("allied.paramedicParamedicLanding.personalizedStudyPlan")} description={t("allied.paramedicParamedicLanding.enterYourExamDateAvailable")} />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gradient-to-b from-teal-50/30 to-white" data-testid="section-topic-categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{t("allied.paramedicParamedicLanding.topicCategories")}</h2>
            <p className="text-gray-600 max-w-xl mx-auto">{t("allied.paramedicParamedicLanding.questionsAndLessonsOrganizedBy")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TOPIC_CATEGORIES.map(tc => (
              <TopicCategoryCard
                key={tc.title}
                title={tc.title}
                questionCount={tc.questionCount}
                href={`/allied-health/paramedic/questions?category=${encodeURIComponent(tc.title)}`}
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/allied-health/paramedic/questions" className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700 text-sm" data-testid="link-browse-all-topics">
              Browse all question topics <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <StudyPathSteps steps={STUDY_STEPS} />

      <FreePreviewBlock
        title={t("allied.paramedicParamedicLanding.tryItFreeNoAccount")}
        subtitle={t("allied.paramedic_landing.experienceTheDepthOfNursenest")}
        previewItems={[
          { label: "15-Question Diagnostic", description: "See your readiness score across all paramedic domains" },
          { label: "5 Practice Questions", description: "Experience our 600+ word clinical rationales" },
          { label: "1 Mock Exam", description: "Take a full-length timed mock to feel the exam format" },
        ]}
        ctaHref="/diagnostic?career=paramedic"
        ctaLabel="Start Free Diagnostic"
      />

      <section className="py-16 sm:py-20 bg-white" data-testid="section-exam-pathways">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{t("allied.paramedicParamedicLanding.chooseYourExamPathway")}</h2>
            <p className="text-gray-600 max-w-xl mx-auto">{t("allied.paramedicParamedicLanding.eachPathwayIsTailoredWith")}</p>
          </div>
          <div className={`grid grid-cols-1 ${isCanada ? "md:grid-cols-2 max-w-4xl mx-auto" : "md:grid-cols-3"} gap-6`}>
            {isCanada ? (
              <>
                <ExamPathCard
                  title={t("allied.paramedicParamedicLanding.pcpExamPrepCanada")}
                  description={t("allied.paramedicParamedicLanding.primaryCareParamedicCertificationPrep")}
                  features={["COPR blueprint alignment", "Canadian pharmacology & protocols", "Provincial scope-of-practice focus", "BLS and primary care scenarios"]}
                  href="/allied-health/paramedic/pcp"
                  badge="Canada"
                />
                <ExamPathCard
                  title={t("allied.paramedicParamedicLanding.acpExamPrepCanada")}
                  description={t("allied.paramedicParamedicLanding.advancedCareParamedicStudyMaterials")}
                  features={["Advanced cardiac & pharmacology", "12-lead ECG interpretation drills", "ACLS/PALS algorithm mastery", "Critical care transport scenarios"]}
                  href="/allied-health/paramedic/acp"
                  badge="Advanced"
                />
              </>
            ) : (
              <>
                <ExamPathCard
                  title={t("allied.paramedicParamedicLanding.emtbasicExam")}
                  description={t("allied.paramedicParamedicLanding.entrylevelEmtCertificationPrepWith")}
                  features={["NREMT EMT blueprint alignment", "BLS protocols & patient assessment", "Foundational pharmacology", "Trauma & medical scenarios"]}
                  href="/allied-health/paramedic/nremt"
                  badge="Entry Level"
                />
                <ExamPathCard
                  title={t("allied.paramedicParamedicLanding.emtadvancedAemt")}
                  description={t("allied.paramedicParamedicLanding.advancedEmtCertificationPrepBridging")}
                  features={["Expanded scope of practice", "IV access & fluid therapy", "Advanced airway management", "Medication administration"]}
                  href="/allied-health/paramedic/nremt"
                  badge="Intermediate"
                />
                <ExamPathCard
                  title={t("allied.paramedicParamedicLanding.nremtParamedic")}
                  description={t("allied.paramedicParamedicLanding.nationalRegistryParamedicCognitiveExam")}
                  features={["NREMT cognitive exam blueprint", "CAT-style adaptive simulation", "US pharmacology & protocols", "Psychomotor skills reference"]}
                  href="/allied-health/paramedic/nremt"
                  badge="Advanced"
                />
              </>
            )}
          </div>
        </div>
      </section>

      <TrustBlock />

      <FinalCTASection
        title={t("allied.paramedicParamedicLanding.yourParamedicExamIsComing")}
        subtitle={t("allied.paramedic_landing.startWithAFreeDiagnostic")}
        primaryCTA={{ label: "Start Free Diagnostic", href: "/diagnostic?career=paramedic" }}
        secondaryCTA={{ label: "View Pricing", href: "/allied-health/pricing" }}
      />
    </div>
  );
}
