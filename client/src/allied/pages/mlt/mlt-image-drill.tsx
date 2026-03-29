import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Microscope, ArrowLeft, ArrowRight, Check, X, RotateCcw, Trophy, Clock, Target } from "lucide-react";
import { LabImageViewer } from "../../components/lab-image-viewer";

import { useI18n } from "@/lib/i18n";
const DRILL_TYPE_LABELS: Record<string, { label: string; description: string; discipline: string }> = {
  identify_cell: { label: "Identify the Cell", description: "Identify blood cells from peripheral smear images", discipline: "hematology" },
  identify_organism: { label: "Identify the Organism", description: "Identify microorganisms from Gram stain images", discipline: "microbiology" },
  identify_crystal: { label: "Identify the Crystal", description: "Identify crystals from urinalysis sediment", discipline: "urinalysis" },
  identify_cast: { label: "Identify the Cast", description: "Identify casts from urinalysis sediment images", discipline: "urinalysis" },
  identify_artifact: { label: "Identify the Artifact", description: "Identify artifacts in microscopy images", discipline: "urinalysis" },
  identify_stain: { label: "Identify the Stain", description: "Identify staining characteristics of organisms", discipline: "microbiology" },
  identify_colony: { label: "Identify Colony Morphology", description: "Identify organisms by colony appearance", discipline: "microbiology" },
  identify_reaction: { label: "Identify the Reaction", description: "Identify blood bank reaction patterns", discipline: "blood_banking" },
  qc_issue: { label: "QC Issue Detection", description: "Spot quality control issues in lab data", discipline: "clinical_chemistry" },
  specimen_rejection: { label: "Specimen Rejection", description: "Determine if a specimen should be rejected", discipline: "specimen_processing" },
};

function getCredentials() {

  try {
    const raw = localStorage.getItem("nursenest-credentials");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function MltImageDrill() {
  const [selectedDrill, setSelectedDrill] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [answers, setAnswers] = useState<Array<{ imageId: string; correct: boolean; userAnswer: string }>>([]);
  const [drillComplete, setDrillComplete] = useState(false);
  const [startTime] = useState(Date.now());

  const drillInfo = selectedDrill ? DRILL_TYPE_LABELS[selectedDrill] : null;

  const { data: images = [], isLoading: loadingImages } = useQuery({
    queryKey: ["mlt-drill-images", selectedDrill],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedDrill) params.set("drillType", selectedDrill);
      if (drillInfo) params.set("discipline", drillInfo.discipline);
      const res = await fetch(`/api/mlt/image-drill/images?${params}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!selectedDrill,
  });

  const saveDrillMutation = useMutation({
    mutationFn: async (data: any) => {
      const creds = getCredentials();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (creds) headers["x-admin-id"] = creds.userId || "";
      const res = await fetch("/api/mlt/image-drill/attempt", { method: "POST", headers, body: JSON.stringify(data), credentials: "include" });
      if (!res.ok) throw new Error("Failed to save attempt");
      return res.json();
    },
  });

  const currentImage = useMemo(() => images[currentIndex], [images, currentIndex]);

  const getCorrectAnswer = useCallback((img: any) => {
    if (!img || !selectedDrill) return "Unknown";
    const map: Record<string, string> = {
      identify_cell: img.cellType || "Unknown cell type",
      identify_organism: img.organism || "Unknown organism",
      identify_crystal: img.crystalType || "Unknown crystal",
      identify_cast: img.castType || "Unknown cast",
      identify_artifact: img.artifactType || "Unknown artifact",
      identify_stain: img.stainType || "Unknown stain",
      identify_colony: img.organism || "Unknown colony",
      identify_reaction: img.caption || "Unknown reaction",
      qc_issue: img.clinicalSignificance || "Unknown issue",
      specimen_rejection: img.clinicalSignificance || "Unknown reason",
    };
    return map[selectedDrill] || "Unknown";
  }, [selectedDrill]);

  const handleSubmit = useCallback(() => {
    if (!currentImage) return;
    const correctAnswer = getCorrectAnswer(currentImage);
    const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    setAnswers((prev) => [...prev, { imageId: currentImage.id, correct: isCorrect, userAnswer }]);
    setShowAnswer(true);
  }, [currentImage, userAnswer, getCorrectAnswer]);

  const handleNext = useCallback(() => {
    if (currentIndex >= images.length - 1 || currentIndex >= 9) {
      setDrillComplete(true);
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const correctCount = answers.filter((a) => a.correct).length + (showAnswer ? 0 : 0);
      saveDrillMutation.mutate({
        drillType: selectedDrill,
        discipline: drillInfo?.discipline || "hematology",
        totalQuestions: answers.length,
        correctCount,
        timeSpent,
        answers,
      });
      return;
    }
    setCurrentIndex((i) => i + 1);
    setUserAnswer("");
    setShowAnswer(false);
  }, [currentIndex, images.length, answers, selectedDrill, drillInfo, startTime, saveDrillMutation, showAnswer]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setUserAnswer("");
    setShowAnswer(false);
    setAnswers([]);
    setDrillComplete(false);
  }, []);

  if (!selectedDrill) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-8">
            <a href="/allied-health/mlt" className="p-2 hover:bg-gray-200 rounded-lg" data-testid="link-back">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2" data-testid="text-drill-title">
                <Microscope className="w-6 h-6 text-teal-600" /> Image Recognition Drills
              </h1>
              <p className="text-sm text-gray-500">{t("allied.mltMltImageDrill.practiceIdentifyingCellsOrganismsCrystals")}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(DRILL_TYPE_LABELS).map(([key, info]) => (
              <button key={key} onClick={() => setSelectedDrill(key)} className="text-left bg-white rounded-xl border p-5 hover:shadow-md hover:border-teal-300 transition-all group" data-testid={`button-drill-${key}`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100">
                    <Target className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{info.label}</h3>
                    <p className="text-xs text-gray-500 mt-1">{info.description}</p>
                    <span className="inline-block mt-2 text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                      {info.discipline.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (drillComplete) {
    const correctCount = answers.filter((a) => a.correct).length;
    const total = answers.length;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border shadow-sm max-w-md w-full p-8 text-center" data-testid="drill-results">
          <Trophy className={`w-16 h-16 mx-auto mb-4 ${percentage >= 80 ? "text-yellow-500" : percentage >= 60 ? "text-teal-500" : "text-gray-400"}`} />
          <h2 className="text-2xl font-bold text-gray-900">{drillInfo?.label} Complete!</h2>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-teal-600" data-testid="text-score">{percentage}%</p>
              <p className="text-xs text-gray-500">{t("allied.mltMltImageDrill.score")}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-gray-800" data-testid="text-correct">{correctCount}/{total}</p>
              <p className="text-xs text-gray-500">{t("allied.mltMltImageDrill.correct")}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-gray-800" data-testid="text-time">{timeSpent}s</p>
              <p className="text-xs text-gray-500">{t("allied.mltMltImageDrill.time")}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <button onClick={handleRestart} className="flex items-center justify-center gap-2 bg-teal-600 text-white px-6 py-2.5 rounded-lg hover:bg-teal-700 font-medium" data-testid="button-retry">
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
            <button onClick={() => { setSelectedDrill(null); handleRestart(); }} className="text-sm text-gray-500 hover:text-gray-700" data-testid="button-back-drills">
              Choose Different Drill
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loadingImages) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500">{t("allied.mltMltImageDrill.loadingDrillImages")}</p>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border shadow-sm max-w-md w-full p-8 text-center" data-testid="drill-no-images">
          <Microscope className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-900">{t("allied.mltMltImageDrill.noImagesAvailable")}</h2>
          <p className="text-sm text-gray-500 mt-2">{t("allied.mltMltImageDrill.thisDrillTypeDoesntHave")}</p>
          <button onClick={() => setSelectedDrill(null)} className="mt-4 text-teal-600 hover:text-teal-700 text-sm font-medium" data-testid="button-back-to-drills">
            Back to Drills
          </button>
        </div>
      </div>
    );
  }

  const maxQuestions = Math.min(images.length, 10);
  const correctAnswer = currentImage ? getCorrectAnswer(currentImage) : "";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => { setSelectedDrill(null); handleRestart(); }} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700" data-testid="button-exit-drill">
            <ArrowLeft className="w-4 h-4" /> Exit
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700" data-testid="text-progress">{currentIndex + 1} / {maxQuestions}</span>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div className="bg-teal-500 rounded-full h-2 transition-all" style={{ width: `${((currentIndex + 1) / maxQuestions) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
            <h2 className="font-semibold" data-testid="text-drill-question">{drillInfo?.label}</h2>
            <p className="text-sm text-teal-100 mt-1">{t("allied.mltMltImageDrill.examineTheImageCarefullyAnd")}</p>
          </div>

          <div className="p-6">
            {currentImage && (
              <div className="mb-6">
                <LabImageViewer
                  src={currentImage.imageUrl}
                  alt={t("allied.mltMltImageDrill.microscopyImageForIdentification")}
                  allowZoom={true}
                  className="max-h-[400px]"
                />
                {currentImage.magnification && (
                  <p className="text-xs text-gray-400 text-center mt-2">Magnification: {currentImage.magnification}</p>
                )}
              </div>
            )}

            {!showAnswer ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltImageDrill.yourIdentification")}</label>
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && userAnswer.trim() && handleSubmit()}
                    placeholder={`Type your answer...`}
                    className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    autoFocus
                    data-testid="input-drill-answer"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleSubmit} disabled={!userAnswer.trim()} className="flex-1 bg-teal-600 text-white py-2.5 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed" data-testid="button-submit-answer">
                    Submit Answer
                  </button>
                  <button onClick={() => { setShowAnswer(true); setAnswers((prev) => [...prev, { imageId: currentImage?.id, correct: false, userAnswer: "(skipped)" }]); }} className="px-4 py-2.5 border rounded-lg text-sm text-gray-500 hover:bg-gray-50" data-testid="button-skip">
                    Skip
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-xl ${answers[answers.length - 1]?.correct ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`} data-testid="drill-feedback">
                  <div className="flex items-center gap-2 mb-2">
                    {answers[answers.length - 1]?.correct ? (
                      <><Check className="w-5 h-5 text-green-600" /><span className="font-semibold text-green-800">{t("allied.mltMltImageDrill.correct2")}</span></>
                    ) : (
                      <><X className="w-5 h-5 text-red-600" /><span className="font-semibold text-red-800">{t("allied.mltMltImageDrill.incorrect")}</span></>
                    )}
                  </div>
                  <p className="text-sm text-gray-700"><span className="font-medium">{t("allied.mltMltImageDrill.correctAnswer")}</span> {correctAnswer}</p>
                  {currentImage?.clinicalSignificance && (
                    <p className="text-sm text-gray-600 mt-2"><span className="font-medium">{t("allied.mltMltImageDrill.clinicalSignificance")}</span> {currentImage.clinicalSignificance}</p>
                  )}
                </div>
                <button onClick={handleNext} className="w-full bg-teal-600 text-white py-2.5 rounded-lg font-medium hover:bg-teal-700 flex items-center justify-center gap-2" data-testid="button-next-question">
                  {currentIndex >= maxQuestions - 1 ? "View Results" : "Next Image"} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-1.5">
          {Array.from({ length: maxQuestions }).map((_, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < answers.length ? (answers[i]?.correct ? "bg-green-500" : "bg-red-400") : i === currentIndex ? "bg-teal-500" : "bg-gray-200"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MltImageDrill;
