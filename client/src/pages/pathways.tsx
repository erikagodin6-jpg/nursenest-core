import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminEditButton } from "@/components/admin-edit-button";
import { useI18n } from "@/lib/i18n";
import { useLocation } from "wouter";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Stethoscope,
  Brain,
  Shield,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  Target,
  Beaker,
  Pill,
  Activity,
  AlertTriangle,
  FileText,
  BarChart3,
  ClipboardList,
  Sparkles,
  Layers,
  Heart,
  Clock,
  Lightbulb,
  TrendingUp,
  Calendar,
} from "lucide-react";

interface PathwayModule {
  titleKey: string;
  descKey: string;
  exams: string[];
  questionTarget: number;
}

interface PathwayData {
  id: string;
  titleKey: string;
  subtitleKey: string;
  descKey: string;
  icon: typeof BookOpen;
  color: string;
  bgColor: string;
  borderColor: string;
  skillsKeys: string[];
  linkPath: string;
  curriculumLinkPath: string;
  steps: { titleKey: string; modules: PathwayModule[] }[];
  capstoneKey: string;
  weeklyPlanKey: string;
}

const pathways: PathwayData[] = [
  {
    id: "pre-nursing",
    titleKey: "pathways.card.preNursing.title",
    subtitleKey: "pathways.card.preNursing.subtitle",
    descKey: "pathways.card.preNursing.desc",
    icon: BookOpen,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    skillsKeys: [
      "pathways.skill.medTerminology",
      "pathways.skill.anatomyPhysiology",
      "pathways.skill.basicPathophys",
      "pathways.skill.studyStrategies",
      "pathways.skill.dosageCalc",
    ],
    linkPath: "/pre-nursing",
    curriculumLinkPath: "/lessons",
    steps: [
      {
        titleKey: "pathways.preNursing.step1.title",
        modules: [
          { titleKey: "pathways.preNursing.mod.medTerminology", descKey: "pathways.preNursing.mod.medTerminology.desc", exams: [], questionTarget: 50 },
          { titleKey: "pathways.preNursing.mod.cellBiology", descKey: "pathways.preNursing.mod.cellBiology.desc", exams: [], questionTarget: 40 },
          { titleKey: "pathways.preNursing.mod.bodyOrganization", descKey: "pathways.preNursing.mod.bodyOrganization.desc", exams: [], questionTarget: 30 },
        ],
      },
      {
        titleKey: "pathways.preNursing.step2.title",
        modules: [
          { titleKey: "pathways.preNursing.mod.cardiovascular", descKey: "pathways.preNursing.mod.cardiovascular.desc", exams: [], questionTarget: 60 },
          { titleKey: "pathways.preNursing.mod.respiratory", descKey: "pathways.preNursing.mod.respiratory.desc", exams: [], questionTarget: 60 },
          { titleKey: "pathways.preNursing.mod.neurological", descKey: "pathways.preNursing.mod.neurological.desc", exams: [], questionTarget: 50 },
          { titleKey: "pathways.preNursing.mod.renal", descKey: "pathways.preNursing.mod.renal.desc", exams: [], questionTarget: 50 },
          { titleKey: "pathways.preNursing.mod.gi", descKey: "pathways.preNursing.mod.gi.desc", exams: [], questionTarget: 50 },
          { titleKey: "pathways.preNursing.mod.endocrine", descKey: "pathways.preNursing.mod.endocrine.desc", exams: [], questionTarget: 50 },
          { titleKey: "pathways.preNursing.mod.musculoskeletal", descKey: "pathways.preNursing.mod.musculoskeletal.desc", exams: [], questionTarget: 40 },
          { titleKey: "pathways.preNursing.mod.integumentary", descKey: "pathways.preNursing.mod.integumentary.desc", exams: [], questionTarget: 30 },
        ],
      },
      {
        titleKey: "pathways.preNursing.step3.title",
        modules: [
          { titleKey: "pathways.preNursing.mod.basicPatho", descKey: "pathways.preNursing.mod.basicPatho.desc", exams: [], questionTarget: 40 },
          { titleKey: "pathways.preNursing.mod.studySkills", descKey: "pathways.preNursing.mod.studySkills.desc", exams: [], questionTarget: 20 },
        ],
      },
      {
        titleKey: "pathways.preNursing.step4.title",
        modules: [
          { titleKey: "pathways.preNursing.mod.dosageCalc", descKey: "pathways.preNursing.mod.dosageCalc.desc", exams: [], questionTarget: 50 },
          { titleKey: "pathways.preNursing.mod.mathReview", descKey: "pathways.preNursing.mod.mathReview.desc", exams: [], questionTarget: 30 },
        ],
      },
    ],
    capstoneKey: "pathways.preNursing.capstone",
    weeklyPlanKey: "pathways.preNursing.weeklyPlan",
  },
  {
    id: "rpn",
    titleKey: "pathways.card.rpn.title",
    subtitleKey: "pathways.card.rpn.subtitle",
    descKey: "pathways.card.rpn.desc",
    icon: Shield,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    skillsKeys: [
      "pathways.skill.safety",
      "pathways.skill.systemRecognition",
      "pathways.skill.medSafety",
      "pathways.skill.redFlags",
      "pathways.skill.prioritization",
      "pathways.skill.practiceExams",
    ],
    linkPath: "/lessons",
    curriculumLinkPath: "/lessons",
    steps: [
      {
        titleKey: "pathways.rpn.step1.title",
        modules: [
          { titleKey: "pathways.rpn.mod.safety", descKey: "pathways.rpn.mod.safety.desc", exams: ["REx-PN", "NCLEX-PN"], questionTarget: 60 },
          { titleKey: "pathways.rpn.mod.infectionControl", descKey: "pathways.rpn.mod.infectionControl.desc", exams: ["REx-PN", "NCLEX-PN"], questionTarget: 50 },
          { titleKey: "pathways.rpn.mod.assessment", descKey: "pathways.rpn.mod.assessment.desc", exams: ["REx-PN", "NCLEX-PN"], questionTarget: 60 },
        ],
      },
      {
        titleKey: "pathways.rpn.step2.title",
        modules: [
          { titleKey: "pathways.rpn.mod.cardio", descKey: "pathways.rpn.mod.cardio.desc", exams: ["REx-PN", "NCLEX-PN"], questionTarget: 70 },
          { titleKey: "pathways.rpn.mod.resp", descKey: "pathways.rpn.mod.resp.desc", exams: ["REx-PN", "NCLEX-PN"], questionTarget: 70 },
          { titleKey: "pathways.rpn.mod.neuro", descKey: "pathways.rpn.mod.neuro.desc", exams: ["REx-PN", "NCLEX-PN"], questionTarget: 60 },
          { titleKey: "pathways.rpn.mod.endocrine", descKey: "pathways.rpn.mod.endocrine.desc", exams: ["REx-PN", "NCLEX-PN"], questionTarget: 60 },
          { titleKey: "pathways.rpn.mod.renalGi", descKey: "pathways.rpn.mod.renalGi.desc", exams: ["REx-PN", "NCLEX-PN"], questionTarget: 50 },
        ],
      },
      {
        titleKey: "pathways.rpn.step3.title",
        modules: [
          { titleKey: "pathways.rpn.mod.medSafety", descKey: "pathways.rpn.mod.medSafety.desc", exams: ["REx-PN", "NCLEX-PN"], questionTarget: 80 },
          { titleKey: "pathways.rpn.mod.sideEffects", descKey: "pathways.rpn.mod.sideEffects.desc", exams: ["REx-PN", "NCLEX-PN"], questionTarget: 60 },
        ],
      },
      {
        titleKey: "pathways.rpn.step4.title",
        modules: [
          { titleKey: "pathways.rpn.mod.redFlags", descKey: "pathways.rpn.mod.redFlags.desc", exams: ["REx-PN", "NCLEX-PN"], questionTarget: 70 },
          { titleKey: "pathways.rpn.mod.escalation", descKey: "pathways.rpn.mod.escalation.desc", exams: ["REx-PN", "NCLEX-PN"], questionTarget: 50 },
        ],
      },
      {
        titleKey: "pathways.rpn.step5.title",
        modules: [
          { titleKey: "pathways.rpn.mod.prioritization", descKey: "pathways.rpn.mod.prioritization.desc", exams: ["REx-PN", "NCLEX-PN"], questionTarget: 80 },
          { titleKey: "pathways.rpn.mod.delegation", descKey: "pathways.rpn.mod.delegation.desc", exams: ["REx-PN", "NCLEX-PN"], questionTarget: 50 },
        ],
      },
      {
        titleKey: "pathways.rpn.step6.title",
        modules: [
          { titleKey: "pathways.rpn.mod.practiceExams", descKey: "pathways.rpn.mod.practiceExams.desc", exams: ["REx-PN", "NCLEX-PN"], questionTarget: 150 },
        ],
      },
    ],
    capstoneKey: "pathways.rpn.capstone",
    weeklyPlanKey: "pathways.rpn.weeklyPlan",
  },
  {
    id: "rn",
    titleKey: "pathways.card.rn.title",
    subtitleKey: "pathways.card.rn.subtitle",
    descKey: "pathways.card.rn.desc",
    icon: Stethoscope,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    skillsKeys: [
      "pathways.skill.advPathophys",
      "pathways.skill.labInterpretation",
      "pathways.skill.ivTherapy",
      "pathways.skill.delegationPrioritization",
      "pathways.skill.clinicalDeterioration",
      "pathways.skill.ngnCases",
    ],
    linkPath: "/lessons",
    curriculumLinkPath: "/lessons",
    steps: [
      {
        titleKey: "pathways.rn.step1.title",
        modules: [
          { titleKey: "pathways.rn.mod.advPathoCardio", descKey: "pathways.rn.mod.advPathoCardio.desc", exams: ["NCLEX-RN", "Canadian RN"], questionTarget: 100 },
          { titleKey: "pathways.rn.mod.advPathoResp", descKey: "pathways.rn.mod.advPathoResp.desc", exams: ["NCLEX-RN", "Canadian RN"], questionTarget: 90 },
          { titleKey: "pathways.rn.mod.advPathoNeuro", descKey: "pathways.rn.mod.advPathoNeuro.desc", exams: ["NCLEX-RN", "Canadian RN"], questionTarget: 80 },
          { titleKey: "pathways.rn.mod.advPathoRenal", descKey: "pathways.rn.mod.advPathoRenal.desc", exams: ["NCLEX-RN", "Canadian RN"], questionTarget: 80 },
          { titleKey: "pathways.rn.mod.advPathoEndocrine", descKey: "pathways.rn.mod.advPathoEndocrine.desc", exams: ["NCLEX-RN", "Canadian RN"], questionTarget: 70 },
        ],
      },
      {
        titleKey: "pathways.rn.step2.title",
        modules: [
          { titleKey: "pathways.rn.mod.labValues", descKey: "pathways.rn.mod.labValues.desc", exams: ["NCLEX-RN", "Canadian RN"], questionTarget: 100 },
          { titleKey: "pathways.rn.mod.abgInterpretation", descKey: "pathways.rn.mod.abgInterpretation.desc", exams: ["NCLEX-RN", "Canadian RN"], questionTarget: 80 },
          { titleKey: "pathways.rn.mod.diagnosticTests", descKey: "pathways.rn.mod.diagnosticTests.desc", exams: ["NCLEX-RN", "Canadian RN"], questionTarget: 60 },
        ],
      },
      {
        titleKey: "pathways.rn.step3.title",
        modules: [
          { titleKey: "pathways.rn.mod.ivTherapy", descKey: "pathways.rn.mod.ivTherapy.desc", exams: ["NCLEX-RN", "Canadian RN"], questionTarget: 80 },
          { titleKey: "pathways.rn.mod.complexMeds", descKey: "pathways.rn.mod.complexMeds.desc", exams: ["NCLEX-RN", "Canadian RN"], questionTarget: 90 },
          { titleKey: "pathways.rn.mod.bloodAdmin", descKey: "pathways.rn.mod.bloodAdmin.desc", exams: ["NCLEX-RN", "Canadian RN"], questionTarget: 50 },
        ],
      },
      {
        titleKey: "pathways.rn.step4.title",
        modules: [
          { titleKey: "pathways.rn.mod.delegation", descKey: "pathways.rn.mod.delegation.desc", exams: ["NCLEX-RN", "Canadian RN"], questionTarget: 90 },
          { titleKey: "pathways.rn.mod.prioritization", descKey: "pathways.rn.mod.prioritization.desc", exams: ["NCLEX-RN", "Canadian RN"], questionTarget: 90 },
        ],
      },
      {
        titleKey: "pathways.rn.step5.title",
        modules: [
          { titleKey: "pathways.rn.mod.deterioration", descKey: "pathways.rn.mod.deterioration.desc", exams: ["NCLEX-RN", "Canadian RN"], questionTarget: 80 },
          { titleKey: "pathways.rn.mod.emergencyResponse", descKey: "pathways.rn.mod.emergencyResponse.desc", exams: ["NCLEX-RN", "Canadian RN"], questionTarget: 70 },
        ],
      },
      {
        titleKey: "pathways.rn.step6.title",
        modules: [
          { titleKey: "pathways.rn.mod.ngnCases", descKey: "pathways.rn.mod.ngnCases.desc", exams: ["NCLEX-RN"], questionTarget: 100 },
          { titleKey: "pathways.rn.mod.clinicalJudgment", descKey: "pathways.rn.mod.clinicalJudgment.desc", exams: ["NCLEX-RN", "Canadian RN"], questionTarget: 80 },
        ],
      },
      {
        titleKey: "pathways.rn.step7.title",
        modules: [
          { titleKey: "pathways.rn.mod.catSimulation", descKey: "pathways.rn.mod.catSimulation.desc", exams: ["NCLEX-RN", "Canadian RN"], questionTarget: 200 },
        ],
      },
    ],
    capstoneKey: "pathways.rn.capstone",
    weeklyPlanKey: "pathways.rn.weeklyPlan",
  },
  {
    id: "np",
    titleKey: "pathways.card.np.title",
    subtitleKey: "pathways.card.np.subtitle",
    descKey: "pathways.card.np.desc",
    icon: Brain,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    skillsKeys: [
      "pathways.skill.advDiagnostics",
      "pathways.skill.differentialDx",
      "pathways.skill.prescribing",
      "pathways.skill.referralTiming",
      "pathways.skill.complexCases",
      "pathways.skill.loftExams",
    ],
    linkPath: "/np-exam-guide",
    curriculumLinkPath: "/np-exam-guide",
    steps: [
      {
        titleKey: "pathways.np.step1.title",
        modules: [
          { titleKey: "pathways.np.mod.advPatho", descKey: "pathways.np.mod.advPatho.desc", exams: ["CNPE", "AANP", "ANCC"], questionTarget: 120 },
          { titleKey: "pathways.np.mod.pathMechanisms", descKey: "pathways.np.mod.pathMechanisms.desc", exams: ["CNPE", "AANP", "ANCC"], questionTarget: 80 },
        ],
      },
      {
        titleKey: "pathways.np.step2.title",
        modules: [
          { titleKey: "pathways.np.mod.diagnosticCriteria", descKey: "pathways.np.mod.diagnosticCriteria.desc", exams: ["CNPE", "AANP", "ANCC"], questionTarget: 100 },
          { titleKey: "pathways.np.mod.thresholds", descKey: "pathways.np.mod.thresholds.desc", exams: ["CNPE", "AANP", "ANCC"], questionTarget: 80 },
        ],
      },
      {
        titleKey: "pathways.np.step3.title",
        modules: [
          { titleKey: "pathways.np.mod.differentialDx", descKey: "pathways.np.mod.differentialDx.desc", exams: ["CNPE", "AANP", "ANCC"], questionTarget: 120 },
          { titleKey: "pathways.np.mod.clinicalReasoning", descKey: "pathways.np.mod.clinicalReasoning.desc", exams: ["CNPE", "AANP", "ANCC"], questionTarget: 80 },
        ],
      },
      {
        titleKey: "pathways.np.step4.title",
        modules: [
          { titleKey: "pathways.np.mod.prescribing", descKey: "pathways.np.mod.prescribing.desc", exams: ["CNPE", "AANP", "ANCC"], questionTarget: 100 },
          { titleKey: "pathways.np.mod.monitoring", descKey: "pathways.np.mod.monitoring.desc", exams: ["CNPE", "AANP", "ANCC"], questionTarget: 80 },
        ],
      },
      {
        titleKey: "pathways.np.step5.title",
        modules: [
          { titleKey: "pathways.np.mod.referral", descKey: "pathways.np.mod.referral.desc", exams: ["CNPE", "AANP", "ANCC"], questionTarget: 70 },
          { titleKey: "pathways.np.mod.edTriggers", descKey: "pathways.np.mod.edTriggers.desc", exams: ["CNPE", "AANP", "ANCC"], questionTarget: 60 },
        ],
      },
      {
        titleKey: "pathways.np.step6.title",
        modules: [
          { titleKey: "pathways.np.mod.multiSystem", descKey: "pathways.np.mod.multiSystem.desc", exams: ["CNPE", "AANP", "ANCC"], questionTarget: 100 },
          { titleKey: "pathways.np.mod.comorbidities", descKey: "pathways.np.mod.comorbidities.desc", exams: ["CNPE", "AANP", "ANCC"], questionTarget: 80 },
        ],
      },
      {
        titleKey: "pathways.np.step7.title",
        modules: [
          { titleKey: "pathways.np.mod.loftMock", descKey: "pathways.np.mod.loftMock.desc", exams: ["CNPE", "AANP", "ANCC"], questionTarget: 200 },
        ],
      },
    ],
    capstoneKey: "pathways.np.capstone",
    weeklyPlanKey: "pathways.np.weeklyPlan",
  },
];

function PathwayCard({ pathway, onExpand, isExpanded }: { pathway: PathwayData; onExpand: () => void; isExpanded: boolean }) {
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const Icon = pathway.icon;

  return (
    <Card
      className={`border-2 ${isExpanded ? pathway.borderColor : "border-primary/10"} bg-white hover:shadow-lg transition-all duration-300 overflow-hidden`}
      data-testid={`card-pathway-${pathway.id}`}
    >
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-12 h-12 ${pathway.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${pathway.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900" data-testid={`text-pathway-title-${pathway.id}`}>
                {t(pathway.titleKey)}
              </h3>
              <p className="text-sm text-gray-500 mt-1 italic">
                {t(pathway.subtitleKey)}
              </p>
            </div>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-5">
            {t(pathway.descKey)}
          </p>

          <div className="mb-5">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {t("pathways.skillsYouWillMaster")}
            </h4>
            <div className="flex flex-wrap gap-2">
              {pathway.skillsKeys.map((key) => (
                <Badge key={key} variant="secondary" className={`${pathway.bgColor} ${pathway.color} border-0 text-xs font-medium`}>
                  {t(key)}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className={`flex-1 rounded-full ${pathway.bgColor} ${pathway.color} hover:brightness-95 border ${pathway.borderColor} font-semibold`}
              variant="outline"
              onClick={() => setLocation(pathway.linkPath)}
              data-testid={`button-start-pathway-${pathway.id}`}
            >
              {t("pathways.startHere")}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              className="text-gray-500 hover:text-gray-700"
              onClick={onExpand}
              data-testid={`button-curriculum-${pathway.id}`}
            >
              {isExpanded ? t("pathways.hideCurriculum") : t("pathways.seeCurriculum")}
              <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className={`border-t ${pathway.borderColor} bg-gray-50/50 p-6`} data-testid={`section-curriculum-${pathway.id}`}>
            <h4 className="font-bold text-gray-900 mb-1 text-lg">{t("pathways.learningRoadmap")}</h4>
            <p className="text-sm text-gray-500 mb-6">{t("pathways.recommendedSequence")}</p>

            <div className="space-y-6">
              {pathway.steps.map((step, si) => (
                <div key={si} className="relative">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full ${pathway.bgColor} ${pathway.color} flex items-center justify-center flex-shrink-0 text-sm font-bold border ${pathway.borderColor}`}>
                      {si + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-gray-900 mb-3">{t(step.titleKey)}</h5>
                      <div className="space-y-2">
                        {step.modules.map((mod, mi) => (
                          <div key={mi} className="bg-white rounded-lg p-3 border border-gray-100 hover:border-gray-200 transition-colors">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-800 text-sm">{t(mod.titleKey)}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{t(mod.descKey)}</p>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {mod.exams.map((exam) => (
                                  <Badge key={exam} variant="outline" className="text-[10px] px-1.5 py-0 border-gray-200 text-gray-400">
                                    {exam}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-400">
                              <Target className="w-3 h-3" />
                              <span>{mod.questionTarget} {t("pathways.questionsTarget")}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {si < pathway.steps.length - 1 && (
                    <div className={`absolute left-4 top-10 w-0.5 h-[calc(100%-1rem)] ${pathway.bgColor}`} />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className={`w-4 h-4 ${pathway.color}`} />
                  <h5 className="font-semibold text-gray-900 text-sm">{t("pathways.capstoneExam")}</h5>
                </div>
                <p className="text-xs text-gray-500">{t(pathway.capstoneKey)}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className={`w-4 h-4 ${pathway.color}`} />
                  <h5 className="font-semibold text-gray-900 text-sm">{t("pathways.weeklyStudyPlan")}</h5>
                </div>
                <p className="text-xs text-gray-500">{t(pathway.weeklyPlanKey)}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function PathwaysPage() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans transition-colors duration-500">
      <AdminEditButton />
      <SEO
        title={t("pages.pathways.educationPathwaysNursenestChooseYour")}
        description={t("pages.pathways.structuredNursingEducationPathwaysFor")}
        keywords="nursing pathway, nursing education roadmap, NCLEX study plan, RPN learning path, NP exam preparation, nursing curriculum, clinical nursing education"
        canonicalPath="/pathways"
      />
      <Navigation />

      <main className="flex-grow">
        <section className="relative overflow-hidden py-16 lg:py-24">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-secondary/30 blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary/20 shadow-sm">
              <GraduationCap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-gray-600">{t("pathways.badge")}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1]" data-testid="text-pathways-title">
              {t("pathways.hero.title")}
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed" data-testid="text-pathways-subtitle">
              {t("pathways.hero.subtitle")}
            </p>
          </div>
        </section>

        <section className="pb-20" data-testid="section-pathway-cards">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-6">
              {pathways.map((pathway) => (
                <PathwayCard
                  key={pathway.id}
                  pathway={pathway}
                  isExpanded={expandedId === pathway.id}
                  onExpand={() => setExpandedId(expandedId === pathway.id ? null : pathway.id)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white/50 border-y border-primary/10" data-testid="section-progression">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                {t("pathways.progression.title")}
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                {t("pathways.progression.subtitle")}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Target, key: "pathways.progression.startHere" },
                { icon: BarChart3, key: "pathways.progression.trackProgress" },
                { icon: Lightbulb, key: "pathways.progression.confidenceChecks" },
                { icon: TrendingUp, key: "pathways.progression.examReady" },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-primary/10 text-center hover:shadow-md transition-all">
                  <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">{t(item.key)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-primary/5" data-testid="section-exam-alignment">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                {t("pathways.examAlignment.title")}
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                {t("pathways.examAlignment.subtitle")}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: "NCLEX-PN", color: "bg-blue-50 text-blue-700 border-blue-200" },
                { label: "REx-PN", color: "bg-blue-50 text-blue-700 border-blue-200" },
                { label: "NCLEX-RN", color: "bg-purple-50 text-purple-700 border-purple-200" },
                { label: "Canadian RN", color: "bg-purple-50 text-purple-700 border-purple-200" },
                { label: "CNPE", color: "bg-amber-50 text-amber-700 border-amber-200" },
                { label: "CNPLE", color: "bg-amber-50 text-amber-600 border-amber-200" },
                { label: "AANP", color: "bg-amber-50 text-amber-700 border-amber-200" },
                { label: "ANCC", color: "bg-amber-50 text-amber-700 border-amber-200" },
              ].map((exam) => (
                <Badge
                  key={exam.label}
                  variant="outline"
                  className={`${exam.color} border px-4 py-2 text-sm font-medium`}
                  data-testid={`badge-exam-${exam.label.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {exam.label}
                  {exam.label === "CNPLE" && (
                    <span className="ml-1 text-[10px] opacity-70">({t("pathways.comingSoon")})</span>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16" data-testid="section-pathways-cta">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              {t("pathways.cta.title")}
            </h2>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto">
              {t("pathways.cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="h-14 px-8 text-lg rounded-full bg-primary hover:brightness-110 shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 text-white"
                onClick={() => setLocation("/anatomy")}
                data-testid="button-pathways-start-free"
              >
                {t("pathways.cta.startFree")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg rounded-full border-2 border-primary/20 hover:bg-primary/5 text-gray-700"
                onClick={() => setLocation("/pricing")}
                data-testid="button-pathways-pricing"
              >
                {t("pathways.cta.seePlans")}
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
