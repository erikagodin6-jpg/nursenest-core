import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { useI18n } from "@/lib/i18n";
import {
  ArrowLeft, ArrowRight, MapPin, Target, Eye, EyeOff,
  BookOpen, CheckCircle2, XCircle, ChevronLeft, ChevronRight,
  AlertTriangle, Lightbulb, Activity, Shield, Maximize2,
  RotateCcw, Star, Layers, GraduationCap, Check
} from "lucide-react";

const EXAM_MAP: Record<string, { exam: string; label: string }> = {
  canada: { exam: "CAMRT", label: "Canada" },
  usa: { exam: "ARRT", label: "USA" },
};

const STEP_LABELS = [
  { key: "patient", label: "Patient Orientation", icon: Activity },
  { key: "body", label: "Body Alignment", icon: Target },
  { key: "detector", label: "Detector Placement", icon: Layers },
  { key: "cr", label: "Central Ray", icon: Target },
  { key: "tube", label: "Tube Angle", icon: RotateCcw },
  { key: "collimation", label: "Collimation", icon: Maximize2 },
  { key: "exposure", label: "Exposure Evaluation", icon: Eye },
  { key: "critique", label: "Image Critique", icon: CheckCircle2 },
];

type ViewMode = "overview" | "learn" | "errors" | "quiz" | "compare";

export default function ImagingPositioningDetailPage() {
  const { t } = useI18n();
  const [, params] = useRoute("/medical-imaging/:country/positioning/:projectionSlug");
  const country = params?.country || "canada";
  const slug = params?.projectionSlug || "";
  const examInfo = EXAM_MAP[country] || EXAM_MAP.canada;

  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const [learningStep, setLearningStep] = useState(0);
  const [showLabels, setShowLabels] = useState(true);
  const [isExamMode, setIsExamMode] = useState(false);
  const [errorTrainerIndex, setErrorTrainerIndex] = useState(0);
  const [errorAnswer, setErrorAnswer] = useState<string | null>(null);
  const [errorScore, setErrorScore] = useState({ correct: 0, total: 0 });
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [quizCompleted, setQuizCompleted] = useState(false);

  const { data: entry, isLoading, error } = useQuery({
    queryKey: ["/api/imaging/positioning/by-slug", slug, country],
    queryFn: () => fetch(`/api/imaging/positioning/by-slug/${slug}?country=${country}`).then(r => {
      if (!r.ok) throw new Error("Not found");
      return r.json();
    }),
    enabled: !!slug,
  });

  const learningSteps = useMemo(() => {
    if (!entry) return [];
    const custom = (entry.learningSteps as any[]) || [];
    if (custom.length > 0) return custom;
    return [
      { title: "Patient Orientation", content: entry.patientPosition || "Position the patient as directed." },
      { title: "Body Alignment", content: entry.bodyPartPosition || `Align the ${entry.bodyPart} to the image receptor.` },
      { title: "Detector Placement", content: entry.detectorPlacement || `Place the detector according to the projection requirements. Film/IR size: ${entry.filmSize || "As required"}.` },
      { title: "Central Ray Centering", content: entry.centralRay || "Direct the central ray to the appropriate anatomical landmark." },
      { title: "Tube Angle", content: entry.centralRayDirection || "Perpendicular to the image receptor unless specified." },
      { title: "Collimation", content: entry.collimationGuidance || "Collimate to the area of interest with appropriate borders." },
      { title: "Exposure Evaluation", content: entry.breathingInstructions ? `Breathing: ${entry.breathingInstructions}\n\n${entry.technicalFactors || "Set appropriate technical factors."}` : (entry.technicalFactors || "Evaluate exposure parameters for optimal image quality.") },
      { title: "Image Critique", content: entry.evaluationCriteria || `Anatomy demonstrated: ${entry.anatomyDemonstrated || "Verify all required structures are visible."}` },
    ];
  }, [entry]);

  const positioningErrors = useMemo(() => {
    if (!entry) return [];
    return (entry.positioningErrors as any[]) || [];
  }, [entry]);

  const quizQuestions = useMemo(() => {
    if (!entry) return [];
    return (entry.quizQuestions as any[]) || [];
  }, [entry]);

  const labelOverlays = useMemo(() => {
    if (!entry) return [];
    return (entry.labelOverlays as any[]) || [];
  }, [entry]);

  const commonErrors = useMemo(() => {
    if (!entry) return [];
    return (entry.commonErrors as any[]) || [];
  }, [entry]);

  const handleErrorAnswer = useCallback((answer: string, correct: string) => {
    if (errorAnswer !== null) return;
    setErrorAnswer(answer);
    const isCorrect = answer === correct;
    setErrorScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  }, [errorAnswer]);

  const handleQuizAnswer = useCallback((answerIdx: number, correctIdx: number) => {
    if (quizAnswer !== null) return;
    setQuizAnswer(answerIdx);
    const isCorrect = answerIdx === correctIdx;
    setQuizScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  }, [quizAnswer]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <MapPin className="w-10 h-10 mx-auto mb-3 text-gray-300 animate-pulse" />
        <p className="text-gray-400">{t("pages.imagingPositioningDetail.loadingProjection")}</p>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center" data-testid="positioning-not-found">
        <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <h1 className="text-xl font-bold text-gray-700 mb-2">{t("pages.imagingPositioningDetail.projectionNotFound")}</h1>
        <p className="text-gray-500 mb-6">{t("pages.imagingPositioningDetail.thePositioningProjectionYoureLooking")}</p>
        <Link href={`/medical-imaging/${country}/positioning`} className="text-indigo-600 hover:text-indigo-700 font-medium" data-testid="link-back-to-list">
          ← Back to Positioning Guide
        </Link>
      </div>
    );
  }

  const seoTitle = entry.seoTitle || `${entry.projectionName} — Radiographic Positioning | ${examInfo.exam}`;
  const seoDesc = entry.seoDescription || `Step-by-step ${entry.projectionName} positioning guide for ${examInfo.exam}. Patient position, central ray, anatomy demonstrated, common errors, and exam tips.`;

  return (
    <div data-testid="imaging-positioning-detail-page">
      <SEO
        title={seoTitle}
        description={seoDesc}
        keywords={`${entry.projectionName}, ${entry.bodyPart} positioning, ${examInfo.exam}, radiographic positioning, central ray`}
        canonicalPath={`/medical-imaging/${country}/positioning/${slug}`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BreadcrumbNav items={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: "Medical Imaging", url: "https://www.nursenest.ca/medical-imaging" },
          { name: examInfo.label, url: `https://www.nursenest.ca/medical-imaging/${country}` },
          { name: "Positioning", url: `https://www.nursenest.ca/medical-imaging/${country}/positioning` },
          { name: entry.projectionName, url: `https://www.nursenest.ca/medical-imaging/${country}/positioning/${slug}` },
        ]} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href={`/medical-imaging/${country}/positioning`} className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 mb-4" data-testid="link-back-to-positioning">
          <ArrowLeft className="w-4 h-4" /> All Projections
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900" data-testid="text-projection-name">
                {entry.projectionName}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{entry.bodyPart}</span>
                {entry.examRelevance && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Star className={`w-3.5 h-3.5 ${entry.examRelevance === "high" ? "text-red-500" : entry.examRelevance === "medium" ? "text-amber-500" : "text-gray-400"}`} fill="currentColor" />
                      {entry.examRelevance === "high" ? "High Exam Relevance" : entry.examRelevance === "medium" ? "Medium Relevance" : "Low Relevance"}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isExamMode}
                onChange={() => { setIsExamMode(!isExamMode); setShowLabels(isExamMode); }}
                className="rounded border-gray-300"
                data-testid="toggle-exam-mode"
              />
              <GraduationCap className="w-4 h-4" />
              Exam Mode
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { key: "overview" as ViewMode, label: "Overview", icon: Eye },
            { key: "learn" as ViewMode, label: "Step-by-Step", icon: BookOpen },
            ...(positioningErrors.length > 0 ? [{ key: "errors" as ViewMode, label: "Error Trainer", icon: AlertTriangle }] : []),
            ...(quizQuestions.length > 0 ? [{ key: "quiz" as ViewMode, label: "Quiz", icon: Target }] : []),
            ...((entry.teachingImageUrl && entry.incorrectImageUrl) ? [{ key: "compare" as ViewMode, label: "Compare", icon: Layers }] : []),
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setViewMode(tab.key)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === tab.key
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              data-testid={`tab-${tab.key}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {viewMode === "overview" && (
          <OverviewSection entry={entry} showLabels={showLabels} setShowLabels={setShowLabels} isExamMode={isExamMode} labelOverlays={labelOverlays} commonErrors={commonErrors} />
        )}

        {viewMode === "learn" && (
          <LearningMode
            steps={learningSteps}
            currentStep={learningStep}
            setCurrentStep={setLearningStep}
            entry={entry}
          />
        )}

        {viewMode === "errors" && positioningErrors.length > 0 && (
          <ErrorTrainer
            errors={positioningErrors}
            currentIndex={errorTrainerIndex}
            setCurrentIndex={setErrorTrainerIndex}
            selectedAnswer={errorAnswer}
            setSelectedAnswer={setErrorAnswer}
            onAnswer={handleErrorAnswer}
            score={errorScore}
            isExamMode={isExamMode}
          />
        )}

        {viewMode === "quiz" && quizQuestions.length > 0 && (
          <QuizMode
            questions={quizQuestions}
            currentIndex={quizIndex}
            setCurrentIndex={setQuizIndex}
            selectedAnswer={quizAnswer}
            setSelectedAnswer={setQuizAnswer}
            onAnswer={handleQuizAnswer}
            score={quizScore}
            resetScore={() => setQuizScore({ correct: 0, total: 0 })}
            isExamMode={isExamMode}
            completed={quizCompleted}
            setCompleted={setQuizCompleted}
          />
        )}

        {viewMode === "compare" && entry.teachingImageUrl && entry.incorrectImageUrl && (
          <ImageComparison
            correctUrl={entry.teachingImageUrl}
            incorrectUrl={entry.incorrectImageUrl}
            projectionName={entry.projectionName}
          />
        )}

        {entry.examTips && !isExamMode && viewMode === "overview" && (
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5" data-testid="section-exam-tips">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <h3 className="font-semibold text-amber-800">{t("pages.imagingPositioningDetail.examTips")}</h3>
            </div>
            <p className="text-sm text-amber-800">{entry.examTips}</p>
          </div>
        )}

        {entry.clinicalNotes && !isExamMode && viewMode === "overview" && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-5" data-testid="section-clinical-notes">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">{t("pages.imagingPositioningDetail.clinicalNotes")}</h3>
            </div>
            <p className="text-sm text-blue-800">{entry.clinicalNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function OverviewSection({ entry, showLabels, setShowLabels, isExamMode, labelOverlays, commonErrors }: any) {
  return (
    <div className="space-y-6" data-testid="section-overview">
      {(entry.teachingImageUrl || entry.examImageUrl || entry.positioningDiagramUrl) && (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden" data-testid="section-images">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">{t("pages.imagingPositioningDetail.teachingImages")}</h2>
            {labelOverlays.length > 0 && (
              <button
                onClick={() => setShowLabels(!showLabels)}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                data-testid="button-toggle-labels"
              >
                {showLabels ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showLabels ? "Hide Labels" : "Show Labels"}
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
            {entry.teachingImageUrl && (
              <div className="relative">
                <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">{t("pages.imagingPositioningDetail.teachingImage")}</p>
                <div className="relative rounded-lg overflow-hidden bg-gray-50">
                  <img src={entry.teachingImageUrl} alt={`${entry.projectionName} radiographic teaching image - NurseNest medical imaging`} title={`${entry.projectionName} teaching`} className="w-full h-auto" loading="lazy" data-testid="img-teaching" />
                  {showLabels && !isExamMode && labelOverlays.length > 0 && (
                    <div className="absolute inset-0">
                      {labelOverlays.map((label: any, i: number) => (
                        <div
                          key={i}
                          className={`absolute px-2 py-1 rounded text-[10px] font-bold shadow-sm ${
                            label.type === "cr" ? "bg-red-500/90 text-white" :
                            label.type === "ir" ? "bg-blue-500/90 text-white" :
                            label.type === "landmark" ? "bg-green-500/90 text-white" :
                            label.type === "shielding" ? "bg-yellow-500/90 text-black" :
                            label.type === "collimation" ? "bg-purple-500/90 text-white" :
                            label.type === "rotation" ? "bg-orange-500/90 text-white" :
                            "bg-gray-700/90 text-white"
                          }`}
                          style={{ top: `${label.y || 50}%`, left: `${label.x || 50}%`, transform: "translate(-50%, -50%)" }}
                          data-testid={`label-overlay-${i}`}
                        >
                          {label.text}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            {entry.examImageUrl && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">{t("pages.imagingPositioningDetail.examImage")}</p>
                <div className="rounded-lg overflow-hidden bg-gray-50">
                  <img src={entry.examImageUrl} alt={`${entry.projectionName} radiographic exam image - NurseNest medical imaging`} title={`${entry.projectionName} exam`} className="w-full h-auto" loading="lazy" data-testid="img-exam" />
                </div>
              </div>
            )}
            {entry.positioningDiagramUrl && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">{t("pages.imagingPositioningDetail.positioningDiagram")}</p>
                <div className="rounded-lg overflow-hidden bg-gray-50">
                  <img src={entry.positioningDiagramUrl} alt={`${entry.projectionName} positioning diagram - NurseNest medical imaging`} title={`${entry.projectionName} diagram`} className="w-full h-auto" loading="lazy" data-testid="img-diagram" />
                </div>
              </div>
            )}
          </div>
          {showLabels && !isExamMode && labelOverlays.length > 0 && (
            <div className="px-4 pb-4">
              <div className="flex flex-wrap gap-2">
                {[
                  { type: "cr", label: "Central Ray", color: "bg-red-500" },
                  { type: "ir", label: "IR Placement", color: "bg-blue-500" },
                  { type: "landmark", label: "Landmark", color: "bg-green-500" },
                  { type: "shielding", label: "Shielding", color: "bg-yellow-500" },
                  { type: "collimation", label: "Collimation", color: "bg-purple-500" },
                  { type: "rotation", label: "Rotation", color: "bg-orange-500" },
                ].filter(l => labelOverlays.some((o: any) => o.type === l.type)).map(l => (
                  <span key={l.type} className="flex items-center gap-1.5 text-[10px] text-gray-500">
                    <span className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                    {l.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard title={t("pages.imagingPositioningDetail.patientPosition")} content={entry.patientPosition} testId="info-patient-position" />
        <InfoCard title={t("pages.imagingPositioningDetail.centralRay")} content={entry.centralRay} testId="info-central-ray" />
        {entry.bodyPartPosition && <InfoCard title={t("pages.imagingPositioningDetail.bodyPartPosition")} content={entry.bodyPartPosition} testId="info-body-part-position" />}
        {entry.centralRayDirection && <InfoCard title={t("pages.imagingPositioningDetail.centralRayDirection")} content={entry.centralRayDirection} testId="info-cr-direction" />}
        {entry.sid && <InfoCard title="SID" content={entry.sid} testId="info-sid" />}
        {entry.filmSize && <InfoCard title={t("pages.imagingPositioningDetail.filmirSize")} content={entry.filmSize} testId="info-film-size" />}
        {entry.detectorPlacement && <InfoCard title={t("pages.imagingPositioningDetail.detectorPlacement")} content={entry.detectorPlacement} testId="info-detector" />}
        {entry.collimationGuidance && <InfoCard title={t("pages.imagingPositioningDetail.collimation")} content={entry.collimationGuidance} testId="info-collimation" />}
        {entry.breathingInstructions && <InfoCard title={t("pages.imagingPositioningDetail.breathingInstructions")} content={entry.breathingInstructions} testId="info-breathing" />}
        {entry.technicalFactors && <InfoCard title={t("pages.imagingPositioningDetail.technicalFactors")} content={entry.technicalFactors} testId="info-technical" />}
      </div>

      {entry.anatomyDemonstrated && (
        <div className="bg-white border border-gray-100 rounded-xl p-5" data-testid="section-anatomy">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Eye className="w-4 h-4 text-indigo-500" /> Anatomy Demonstrated
          </h3>
          <p className="text-sm text-gray-700">{entry.anatomyDemonstrated}</p>
        </div>
      )}

      {commonErrors.length > 0 && !isExamMode && (
        <div className="bg-white border border-gray-100 rounded-xl p-5" data-testid="section-common-errors">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Common Errors
          </h3>
          <div className="space-y-2">
            {commonErrors.map((err: any, i: number) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{typeof err === "string" ? err : err.description || err.error || JSON.stringify(err)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {entry.evaluationCriteria && !isExamMode && (
        <div className="bg-white border border-gray-100 rounded-xl p-5" data-testid="section-evaluation">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" /> Evaluation Criteria
          </h3>
          <p className="text-sm text-gray-700">{entry.evaluationCriteria}</p>
        </div>
      )}

      {entry.tips && !isExamMode && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5" data-testid="section-tips">
          <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-green-600" /> Tips
          </h3>
          <p className="text-sm text-green-800">{entry.tips}</p>
        </div>
      )}
    </div>
  );
}

function InfoCard({ title, content, testId }: { title: string; content: string; testId: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4" data-testid={testId}>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{title}</p>
      <p className="text-sm text-gray-800">{content}</p>
    </div>
  );
}

function LearningMode({ steps, currentStep, setCurrentStep, entry }: any) {
  const step = steps[currentStep];
  const total = steps.length;
  const progress = ((currentStep + 1) / total) * 100;

  return (
    <div className="space-y-4" data-testid="section-learning">
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              Step-by-Step Learning
            </h2>
            <span className="text-xs text-gray-500 font-medium">
              Step {currentStep + 1} of {total}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 rounded-full h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
              data-testid="progress-bar"
            />
          </div>
        </div>

        <div className="flex overflow-x-auto border-b border-gray-100">
          {steps.map((_: any, i: number) => {
            const stepInfo = STEP_LABELS[i] || { label: `Step ${i + 1}`, icon: Target };
            const Icon = stepInfo.icon;
            return (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                  i === currentStep
                    ? "border-indigo-600 text-indigo-600 bg-indigo-50/50"
                    : i < currentStep
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
                data-testid={`step-button-${i}`}
              >
                {i < currentStep ? (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">{stepInfo.label}</span>
                <span className="sm:hidden">{i + 1}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6" data-testid="learning-step-content">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {step?.title || `Step ${currentStep + 1}`}
          </h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {step?.content || "No content available for this step."}
          </p>
        </div>

        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40 transition-colors"
            data-testid="button-prev-step"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(total - 1, currentStep + 1))}
            disabled={currentStep === total - 1}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-40 transition-colors"
            data-testid="button-next-step"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ErrorTrainer({ errors, currentIndex, setCurrentIndex, selectedAnswer, setSelectedAnswer, onAnswer, score, isExamMode }: any) {
  const error = errors[currentIndex];
  if (!error) return null;

  const options = error.options || [];
  const correctAnswer = error.correctAnswer || error.correct || "";

  return (
    <div className="space-y-4" data-testid="section-error-trainer">
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Positioning Error Trainer
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">
              {currentIndex + 1} / {errors.length}
            </span>
            <span className="text-xs font-medium px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full">
              Score: {score.correct}/{score.total}
            </span>
          </div>
        </div>

        <div className="p-6">
          {error.imageUrl && (
            <div className="mb-4 rounded-lg overflow-hidden bg-gray-50">
              <img src={error.imageUrl} alt={t("pages.imagingPositioningDetail.radiographicPositioningErrorExampleNursenest")} className="w-full h-auto max-h-64 object-contain" loading="lazy" data-testid="img-error-trainer" />
            </div>
          )}

          <p className="text-gray-900 font-medium mb-4" data-testid="text-error-question">
            {error.question || "Identify the positioning error in this image:"}
          </p>

          <div className="space-y-2">
            {options.map((opt: string, i: number) => {
              const isSelected = selectedAnswer === opt;
              const isCorrect = opt === correctAnswer;
              const showResult = selectedAnswer !== null;

              return (
                <button
                  key={i}
                  onClick={() => { if (!selectedAnswer) onAnswer(opt, correctAnswer); }}
                  disabled={selectedAnswer !== null}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                    showResult && isCorrect
                      ? "border-green-500 bg-green-50 text-green-800"
                      : showResult && isSelected && !isCorrect
                      ? "border-red-500 bg-red-50 text-red-800"
                      : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50"
                  }`}
                  data-testid={`option-error-${i}`}
                >
                  <span className="flex items-center gap-2">
                    {showResult && isCorrect && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500" />}
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedAnswer && !isExamMode && error.rationale && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4" data-testid="text-error-rationale">
              <p className="text-xs font-semibold text-blue-700 uppercase mb-1">{t("pages.imagingPositioningDetail.rationale")}</p>
              <p className="text-sm text-blue-800">{error.rationale}</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={() => { setCurrentIndex(Math.max(0, currentIndex - 1)); setSelectedAnswer(null); }}
            disabled={currentIndex === 0}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40"
            data-testid="button-prev-error"
          >
            Previous
          </button>
          <button
            onClick={() => { setCurrentIndex(Math.min(errors.length - 1, currentIndex + 1)); setSelectedAnswer(null); }}
            disabled={currentIndex === errors.length - 1}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-40"
            data-testid="button-next-error"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function QuizMode({ questions, currentIndex, setCurrentIndex, selectedAnswer, setSelectedAnswer, onAnswer, score, resetScore, isExamMode, completed, setCompleted }: any) {
  if (completed) {
    const pct = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-8 text-center" data-testid="quiz-results">
        <GraduationCap className="w-12 h-12 mx-auto mb-4 text-indigo-500" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.imagingPositioningDetail.quizComplete")}</h2>
        <p className="text-4xl font-bold text-indigo-600 mb-2">{pct}%</p>
        <p className="text-gray-500 mb-6">{score.correct} correct out of {score.total} questions</p>
        <button
          onClick={() => {
            setCurrentIndex(0);
            setSelectedAnswer(null);
            setCompleted(false);
            if (resetScore) resetScore();
          }}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
          data-testid="button-retry-quiz"
        >
          Try Again
        </button>
      </div>
    );
  }

  const q = questions[currentIndex];
  if (!q) return null;

  const options = q.options || [];
  const correctIdx = q.correctIndex ?? 0;

  return (
    <div className="space-y-4" data-testid="section-quiz">
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" />
            Positioning Quiz
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">{currentIndex + 1} / {questions.length}</span>
            <span className="text-xs font-medium px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full">
              Score: {score.correct}/{score.total}
            </span>
          </div>
        </div>

        <div className="p-6">
          {q.type && (
            <span className="inline-block px-2 py-0.5 mb-3 text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-600 rounded-full">
              {q.type.replace(/_/g, " ")}
            </span>
          )}

          {q.imageUrl && (
            <div className="mb-4 rounded-lg overflow-hidden bg-gray-50">
              <img src={q.imageUrl} alt={t("pages.imagingPositioningDetail.radiographicPositioningQuizImageNursenest")} className="w-full h-auto max-h-64 object-contain" loading="lazy" data-testid="img-quiz" />
            </div>
          )}

          <p className="text-gray-900 font-medium mb-4" data-testid="text-quiz-question">{q.question}</p>

          <div className="space-y-2">
            {options.map((opt: string, i: number) => {
              const isSelected = selectedAnswer === i;
              const isCorrect = i === correctIdx;
              const showResult = selectedAnswer !== null;

              return (
                <button
                  key={i}
                  onClick={() => { if (selectedAnswer === null) onAnswer(i, correctIdx); }}
                  disabled={selectedAnswer !== null}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                    showResult && isCorrect
                      ? "border-green-500 bg-green-50 text-green-800"
                      : showResult && isSelected && !isCorrect
                      ? "border-red-500 bg-red-50 text-red-800"
                      : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50"
                  }`}
                  data-testid={`option-quiz-${i}`}
                >
                  <span className="flex items-center gap-2">
                    {showResult && isCorrect && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500" />}
                    <span className="font-medium mr-1">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && !isExamMode && q.rationale && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4" data-testid="text-quiz-rationale">
              <p className="text-xs font-semibold text-blue-700 uppercase mb-1">{t("pages.imagingPositioningDetail.rationale2")}</p>
              <p className="text-sm text-blue-800">{q.rationale}</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={() => { setCurrentIndex(Math.max(0, currentIndex - 1)); setSelectedAnswer(null); }}
            disabled={currentIndex === 0}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40"
            data-testid="button-prev-quiz"
          >
            Previous
          </button>
          {currentIndex === questions.length - 1 && selectedAnswer !== null ? (
            <button
              onClick={() => setCompleted(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              data-testid="button-finish-quiz"
            >
              Finish Quiz
            </button>
          ) : (
            <button
              onClick={() => { setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1)); setSelectedAnswer(null); }}
              disabled={currentIndex === questions.length - 1}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-40"
              data-testid="button-next-quiz"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ImageComparison({ correctUrl, incorrectUrl, projectionName }: { correctUrl: string; incorrectUrl: string; projectionName: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden" data-testid="section-compare">
      <div className="p-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-500" />
          Image Comparison — Correct vs Incorrect
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
        <div className="p-4 border-r border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <p className="text-sm font-semibold text-green-700">{t("pages.imagingPositioningDetail.correctPositioning")}</p>
          </div>
          <div className="rounded-lg overflow-hidden bg-gray-50 border-2 border-green-200">
            <img src={correctUrl} alt={`${projectionName} correct positioning - NurseNest medical imaging`} className="w-full h-auto" loading="lazy" data-testid="img-correct" />
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm font-semibold text-red-700">{t("pages.imagingPositioningDetail.incorrectPositioning")}</p>
          </div>
          <div className="rounded-lg overflow-hidden bg-gray-50 border-2 border-red-200">
            <img src={incorrectUrl} alt={`${projectionName} incorrect positioning - NurseNest medical imaging`} className="w-full h-auto" loading="lazy" data-testid="img-incorrect" />
          </div>
        </div>
      </div>
    </div>
  );
}
