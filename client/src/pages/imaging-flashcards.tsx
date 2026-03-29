import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Zap, ArrowLeft, RotateCcw, ChevronLeft, ChevronRight, CheckCircle2, ThumbsUp, ThumbsDown, Minus, Eye, Layers } from "lucide-react";

import { useI18n } from "@/lib/i18n";
const EXAM_MAP: Record<string, { exam: string }> = {
  canada: { exam: "CAMRT" },
  usa: { exam: "ARRT" },
};

const SEED_FLASHCARDS = [
  { id: "s1", front: "What does ALARA stand for?", back: "As Low As Reasonably Achievable — the guiding principle for radiation protection.", category: "Radiation Protection", difficulty: 1 },
  { id: "s2", front: "What does kVp control?", back: "kVp controls the quality (penetrating power) of the x-ray beam and affects image contrast.", category: "Radiation Physics", difficulty: 1 },
  { id: "s3", front: "What does mAs control?", back: "mAs (milliampere-seconds) controls the quantity of x-rays produced and affects image density/brightness.", category: "Radiation Physics", difficulty: 1 },
  { id: "s4", front: "State the Inverse Square Law.", back: "Radiation intensity is inversely proportional to the square of the distance: I₁/I₂ = (D₂/D₁)²", category: "Radiation Physics", difficulty: 2 },
  { id: "s5", front: "What is the 15% Rule?", back: "Increasing kVp by 15% has the same effect on density as doubling the mAs. Used to reduce patient dose.", category: "Radiation Physics", difficulty: 2 },
  { id: "s6", front: "What is bremsstrahlung radiation?", back: "\"Braking radiation\" — produced when electrons are slowed/deflected by atomic nuclei. Creates a continuous spectrum of x-ray energies.", category: "Radiation Physics", difficulty: 2 },
  { id: "s7", front: "What is characteristic radiation?", back: "X-rays produced when an inner-shell electron is ejected and replaced by an outer-shell electron. Produces discrete energy photons.", category: "Radiation Physics", difficulty: 2 },
  { id: "s8", front: "What is the photoelectric effect?", back: "Complete absorption of an x-ray photon by an inner-shell electron. Produces image contrast. More likely at low kVp and high atomic number.", category: "Beam Interactions", difficulty: 3 },
  { id: "s9", front: "What is Compton scatter?", back: "X-ray photon ejects an outer-shell electron and continues in a different direction with reduced energy. Main source of scatter fog.", category: "Beam Interactions", difficulty: 3 },
  { id: "s10", front: "What is Half-Value Layer (HVL)?", back: "The thickness of material needed to reduce beam intensity by 50%. Measures beam quality/penetrating ability.", category: "Radiation Physics", difficulty: 3 },
  { id: "s11", front: "What is SID?", back: "Source-to-Image Distance — the distance from the x-ray tube focal spot to the image receptor. Standard: 40\" (100 cm) or 72\" (183 cm) for chest.", category: "Image Production", difficulty: 1 },
  { id: "s12", front: "What is the magnification formula?", back: "MF = SID/SOD, where SOD = SID - OID. Also: MF = Image Size / Object Size", category: "Image Production", difficulty: 2 },
  { id: "s13", front: "What do grids do?", back: "Grids absorb scatter radiation before it reaches the image receptor, improving contrast. Made of alternating lead strips and radiolucent spacers.", category: "Image Production", difficulty: 1 },
  { id: "s14", front: "What is AEC?", back: "Automatic Exposure Control — sensors that terminate the exposure when sufficient radiation has reached the image receptor.", category: "Equipment", difficulty: 1 },
  { id: "s15", front: "Annual occupational dose limit for whole body?", back: "50 mSv (5 rem) per year for occupational workers. ALARA goal is to keep doses well below this limit.", category: "Radiation Protection", difficulty: 1 },
  { id: "s16", front: "Three cardinal rules of radiation protection?", back: "Time (minimize), Distance (maximize), Shielding (use appropriate barriers). Together these form the foundation of ALARA.", category: "Radiation Protection", difficulty: 1 },
  { id: "s17", front: "What is a PA projection?", back: "Posteroanterior — x-ray beam enters the back (posterior) and exits through the front (anterior). Standard for chest x-ray.", category: "Positioning", difficulty: 1 },
  { id: "s18", front: "Why is PA preferred for chest x-ray?", back: "Minimizes heart magnification because the heart is anterior and closest to the image receptor in PA position.", category: "Positioning", difficulty: 2 },
  { id: "s19", front: "Standard SID for chest x-ray?", back: "72 inches (183 cm) to minimize magnification of mediastinal structures.", category: "Positioning", difficulty: 2 },
  { id: "s20", front: "What is the anode heel effect?", back: "X-ray intensity is greater on the cathode side and less on the anode side of the beam. Place thicker body parts toward the cathode.", category: "Image Production", difficulty: 3 },
];

type DifficultyRating = "easy" | "medium" | "hard";

interface SpacedRepProgress {
  [cardId: string]: {
    difficulty: DifficultyRating;
    nextReview: number;
    interval: number;
    reviewCount: number;
  };
}

export default function ImagingFlashcardsPage() {
  const { t } = useI18n();
  const [, params] = useRoute("/medical-imaging/:country/flashcards");
  const country = params?.country || "canada";
  const examInfo = EXAM_MAP[country] || EXAM_MAP.canada;
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [progress, setProgress] = useState<SpacedRepProgress>({});

  const { data: apiFlashcards = [], isLoading } = useQuery({
    queryKey: ["/api/imaging/flashcards", country],
    queryFn: () => fetch(`/api/imaging/flashcards`).then(r => r.json()),
  });

  const flashcards = useMemo(() => {
    const published = (apiFlashcards as any[]).filter(f => f.status === "published");
    return published.length > 0 ? published : SEED_FLASHCARDS;
  }, [apiFlashcards]);

  useEffect(() => {
    const saved = localStorage.getItem(`imaging-flashcard-progress-${country}`);
    if (saved) setProgress(JSON.parse(saved));
  }, [country]);

  const saveProgress = (newProgress: SpacedRepProgress) => {
    setProgress(newProgress);
    localStorage.setItem(`imaging-flashcard-progress-${country}`, JSON.stringify(newProgress));
  };

  const categories = useMemo(() => {
    const t = new Set(flashcards.map((f: any) => f.category).filter(Boolean));
    return Array.from(t).sort();
  }, [flashcards]);

  const filtered = useMemo(() => {
    let cards = categoryFilter === "all" ? flashcards : flashcards.filter((f: any) => f.category === categoryFilter);
    const now = Date.now();
    cards = [...cards].sort((a: any, b: any) => {
      const progressA = progress[`card-${a.id}`];
      const progressB = progress[`card-${b.id}`];
      const dueA = progressA ? progressA.nextReview : 0;
      const dueB = progressB ? progressB.nextReview : 0;
      const isDueA = !progressA || dueA <= now;
      const isDueB = !progressB || dueB <= now;
      if (isDueA && !isDueB) return -1;
      if (!isDueA && isDueB) return 1;
      return 0;
    });
    return cards;
  }, [flashcards, categoryFilter, progress]);

  const current = filtered[currentIndex];
  const total = filtered.length;

  const next = useCallback(() => {
    setFlipped(false);
    setCurrentIndex(prev => Math.min(prev + 1, total - 1));
  }, [total]);

  const prev = useCallback(() => {
    setFlipped(false);
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const markDifficulty = (rating: DifficultyRating) => {
    if (!current) return;
    const cardKey = `card-${current.id}`;
    const prevData = progress[cardKey] || { difficulty: "medium" as DifficultyRating, nextReview: 0, interval: 1, reviewCount: 0 };
    const intervalMultiplier = rating === "easy" ? 3 : rating === "medium" ? 1.5 : 0.5;
    const newInterval = Math.max(1, Math.round(prevData.interval * intervalMultiplier));
    const newProgress = {
      ...progress,
      [cardKey]: {
        difficulty: rating,
        nextReview: Date.now() + newInterval * 24 * 60 * 60 * 1000,
        interval: newInterval,
        reviewCount: prevData.reviewCount + 1,
      }
    };
    saveProgress(newProgress);
    if (currentIndex < total - 1) next();
  };

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setFlipped(false);
  }, []);

  const reviewedCount = Object.keys(progress).length;
  const easyCount = Object.values(progress).filter(p => p.difficulty === "easy").length;
  const hardCount = Object.values(progress).filter(p => p.difficulty === "hard").length;

  return (
    <div data-testid="imaging-flashcards-page">
      <SEO
        title={`${examInfo.exam} Flashcards | Spaced Repetition | NurseNest`}
        description={`Master radiography with ${total}+ spaced repetition flashcards for ${examInfo.exam} exam preparation. Rate Easy/Medium/Hard to optimize your review schedule.`}
        canonicalPath={`/medical-imaging/${country}/flashcards`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BreadcrumbNav items={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: "Medical Imaging", url: "https://www.nursenest.ca/medical-imaging" },
          { name: country === "canada" ? "Canada" : "USA", url: `https://www.nursenest.ca/medical-imaging/${country}` },
          { name: "Flashcards", url: `https://www.nursenest.ca/medical-imaging/${country}/flashcards` },
        ]} />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href={`/medical-imaging/${country}`} className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 mb-6" data-testid="link-back">
          <ArrowLeft className="w-4 h-4" /> Back to {examInfo.exam} Prep
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <Zap className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900" data-testid="text-flashcards-title">
                {examInfo.exam} Flashcards
              </h1>
              <p className="text-sm text-gray-500">{total} cards · Spaced repetition</p>
            </div>
          </div>
          <button onClick={reset} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700" data-testid="button-reset">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 mb-6 border border-amber-100">
          <div className="flex items-center gap-6 text-sm">
            <div><span className="text-gray-500">{t("pages.imagingFlashcards.reviewed")}</span> <span className="font-bold text-amber-700" data-testid="text-reviewed-count">{reviewedCount}</span></div>
            <div><span className="text-gray-500">{t("pages.imagingFlashcards.mastered")}</span> <span className="font-bold text-green-600">{easyCount}</span></div>
            <div><span className="text-gray-500">{t("pages.imagingFlashcards.needsWork")}</span> <span className="font-bold text-red-600">{hardCount}</span></div>
          </div>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => { setCategoryFilter("all"); setCurrentIndex(0); setFlipped(false); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${categoryFilter === "all" ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              data-testid="button-topic-all"
            >
              All
            </button>
            {categories.map(t => (
              <button
                key={t}
                onClick={() => { setCategoryFilter(t); setCurrentIndex(0); setFlipped(false); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${categoryFilter === t ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                data-testid={`button-topic-${t}`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12 text-gray-400">{t("pages.imagingFlashcards.loadingFlashcards")}</div>
        ) : total === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Zap className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium text-gray-500">{t("pages.imagingFlashcards.noFlashcardsAvailable")}</p>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>{t("pages.imagingFlashcards.progress")}</span>
                <span>{currentIndex + 1}/{total}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / total) * 100}%` }} />
              </div>
            </div>

            <div
              onClick={() => setFlipped(!flipped)}
              className={`relative min-h-[280px] bg-white border-2 rounded-2xl p-8 cursor-pointer transition-all ${
                flipped ? "border-amber-300 bg-amber-50/30" : "border-gray-200 hover:border-indigo-200"
              }`}
              data-testid="flashcard"
            >
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <span className="text-xs text-gray-400">{currentIndex + 1} / {total}</span>
              </div>
              <div className="absolute top-3 left-3 flex items-center gap-2">
                {current?.category && <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">{current.category}</span>}
                {current?.difficulty && <span className={`px-2 py-0.5 text-xs rounded ${current.difficulty <= 1 ? "bg-green-100 text-green-700" : current.difficulty <= 2 ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>{current.difficulty <= 1 ? "Easy" : current.difficulty <= 2 ? "Medium" : "Hard"}</span>}
              </div>
              <div className="flex items-center justify-center h-full pt-6">
                <div className="text-center">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                    {flipped ? "Answer" : "Question"}
                  </p>
                  <p className={`text-lg ${flipped ? "text-amber-800" : "text-gray-900"} font-medium leading-relaxed`} data-testid="text-card-content">
                    {flipped ? current?.back : current?.front}
                  </p>
                  {!flipped && (
                    <p className="text-xs text-gray-400 mt-6 flex items-center justify-center gap-1"><Eye className="w-3.5 h-3.5" /> {t("pages.imagingFlashcards.clickToRevealAnswer")}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <button
                onClick={prev}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                data-testid="button-prev"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <div className="flex gap-2">
                <button onClick={() => markDifficulty("hard")} className="flex items-center gap-1 px-4 py-2 bg-red-50 text-red-700 rounded-xl text-sm font-medium hover:bg-red-100" data-testid="button-hard">
                  <ThumbsDown className="w-4 h-4" /> Hard
                </button>
                <button onClick={() => markDifficulty("medium")} className="flex items-center gap-1 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl text-sm font-medium hover:bg-amber-100" data-testid="button-medium">
                  <Minus className="w-4 h-4" /> Medium
                </button>
                <button onClick={() => markDifficulty("easy")} className="flex items-center gap-1 px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-medium hover:bg-green-100" data-testid="button-easy">
                  <ThumbsUp className="w-4 h-4" /> Easy
                </button>
              </div>
              <button
                onClick={next}
                disabled={currentIndex >= total - 1}
                className="inline-flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                data-testid="button-next"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
