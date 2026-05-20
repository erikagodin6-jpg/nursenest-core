import { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import { useI18n } from "@/lib/i18n";
import {
  ChevronRight, ChevronLeft, RotateCcw, Eye, Layers, Brain,
  ThumbsUp, ThumbsDown, Minus, BarChart3, Filter, Search
} from "lucide-react";

const IMAGING_FLASHCARD_DECKS = [
  {
    id: "radiation-physics",
    name: "Radiation Physics",
    topic: "physics",
    description: "X-ray production, beam characteristics, interactions with matter, and the inverse square law.",
    cards: [
      { id: 1, front: "What does ALARA stand for?", back: "As Low As Reasonably Achievable — the guiding principle for radiation protection.", difficulty: "easy" },
      { id: 2, front: "What does kVp control?", back: "kVp controls the quality (penetrating power) of the x-ray beam and affects image contrast.", difficulty: "easy" },
      { id: 3, front: "What does mAs control?", back: "mAs (milliampere-seconds) controls the quantity of x-rays produced and affects image density/brightness.", difficulty: "easy" },
      { id: 4, front: "State the Inverse Square Law.", back: "Radiation intensity is inversely proportional to the square of the distance: I₁/I₂ = (D₂/D₁)²", difficulty: "medium" },
      { id: 5, front: "What is the 15% Rule?", back: "Increasing kVp by 15% has the same effect on density as doubling the mAs. Used to reduce patient dose.", difficulty: "medium" },
      { id: 6, front: "What is bremsstrahlung radiation?", back: "\"Braking radiation\" — produced when electrons are slowed/deflected by atomic nuclei. Creates a continuous spectrum of x-ray energies.", difficulty: "medium" },
      { id: 7, front: "What is characteristic radiation?", back: "X-rays produced when an inner-shell electron is ejected and replaced by an outer-shell electron. Produces discrete energy photons.", difficulty: "medium" },
      { id: 8, front: "What is the photoelectric effect?", back: "Complete absorption of an x-ray photon by an inner-shell electron. Produces image contrast. More likely at low kVp and high atomic number.", difficulty: "hard" },
      { id: 9, front: "What is Compton scatter?", back: "X-ray photon ejects an outer-shell electron and continues in a different direction with reduced energy. Main source of scatter fog.", difficulty: "hard" },
      { id: 10, front: "What is Half-Value Layer (HVL)?", back: "The thickness of material needed to reduce beam intensity by 50%. Measures beam quality/penetrating ability.", difficulty: "hard" },
    ]
  },
  {
    id: "image-production",
    name: "Image Production",
    topic: "image-quality",
    description: "Technical factors, image quality characteristics, grids, AEC, and digital imaging concepts.",
    cards: [
      { id: 11, front: "What is SID?", back: "Source-to-Image Distance — the distance from the x-ray tube focal spot to the image receptor. Standard: 40\" (100 cm) or 72\" (183 cm) for chest.", difficulty: "easy" },
      { id: 12, front: "What is OID?", back: "Object-to-Image Distance — the distance from the anatomical part to the image receptor. Increased OID = increased magnification.", difficulty: "easy" },
      { id: 13, front: "What is the magnification formula?", back: "MF = SID/SOD, where SOD = SID - OID. Also: MF = Image Size / Object Size", difficulty: "medium" },
      { id: 14, front: "What do grids do?", back: "Grids absorb scatter radiation before it reaches the image receptor, improving contrast. Made of alternating lead strips and radiolucent spacers.", difficulty: "easy" },
      { id: 15, front: "What is AEC?", back: "Automatic Exposure Control — sensors that terminate the exposure when sufficient radiation has reached the image receptor. Ensures consistent density.", difficulty: "easy" },
      { id: 16, front: "What is spatial resolution?", back: "The ability to distinguish small, closely spaced objects. Measured in line pairs per millimeter (lp/mm). Affected by focal spot size, motion, and geometry.", difficulty: "medium" },
      { id: 17, front: "How does focal spot size affect image quality?", back: "Smaller focal spot = sharper image (less penumbra/geometric unsharpness). Larger focal spot = handles more heat but produces more blur.", difficulty: "medium" },
      { id: 18, front: "What is the anode heel effect?", back: "X-ray intensity is greater on the cathode side and less on the anode side of the beam. Place thicker body parts toward the cathode.", difficulty: "hard" },
      { id: 19, front: "What is grid ratio?", back: "Height of lead strips divided by the distance between them (h/D). Higher ratio = more scatter cleanup but requires more exposure.", difficulty: "medium" },
      { id: 20, front: "What causes quantum mottle?", back: "Insufficient x-ray photons reaching the detector. Appears as grainy noise. Caused by low mAs or high speed receptor systems.", difficulty: "hard" },
    ]
  },
  {
    id: "radiation-protection",
    name: "Radiation Protection",
    topic: "protection",
    description: "Dose limits, shielding, ALARA, personnel monitoring, and regulatory requirements.",
    cards: [
      { id: 21, front: "Annual occupational dose limit for whole body?", back: "50 mSv (5 rem) per year for occupational workers. ALARA goal is to keep doses well below this limit.", difficulty: "easy" },
      { id: 22, front: "Annual dose limit for the public?", back: "1 mSv (0.1 rem) per year for members of the general public.", difficulty: "easy" },
      { id: 23, front: "Embryo/fetus dose limit?", back: "5 mSv (0.5 rem) for the entire gestation period, with no more than 0.5 mSv in any single month.", difficulty: "medium" },
      { id: 24, front: "Three cardinal rules of radiation protection?", back: "Time (minimize), Distance (maximize), Shielding (use appropriate barriers). Together these form the foundation of ALARA.", difficulty: "easy" },
      { id: 25, front: "Minimum lead apron thickness?", back: "0.5 mm lead equivalent for standard use. 0.25 mm is acceptable for wrap-around aprons that overlap.", difficulty: "medium" },
      { id: 26, front: "What does a film badge measure?", back: "Cumulative radiation exposure over a wearing period (typically monthly). Contains film that darkens with radiation exposure.", difficulty: "easy" },
      { id: 27, front: "What is the dose-area product (DAP)?", back: "Total radiation energy delivered to the patient, measured in Gy·cm². Accounts for both dose and field size.", difficulty: "hard" },
      { id: 28, front: "Lens of eye annual dose limit?", back: "150 mSv (15 rem) per year. The lens is particularly radiosensitive.", difficulty: "medium" },
      { id: 29, front: "What is effective dose?", back: "Sum of weighted equivalent doses to all irradiated organs. Accounts for organ radiosensitivity. Unit: Sievert (Sv).", difficulty: "hard" },
      { id: 30, front: "What is the 10-day rule?", back: "Schedule non-urgent abdominal x-rays during the first 10 days of a woman's menstrual cycle to minimize risk to a potential embryo.", difficulty: "medium" },
    ]
  },
  {
    id: "positioning-basics",
    name: "Positioning Essentials",
    topic: "positioning",
    description: "Body positions, projections, centering points, and common positioning errors.",
    cards: [
      { id: 31, front: "What is a PA projection?", back: "Posteroanterior — x-ray beam enters the back (posterior) and exits through the front (anterior). Standard for chest x-ray.", difficulty: "easy" },
      { id: 32, front: "What is a lateral projection?", back: "X-ray beam enters from one side. Left lateral = beam enters right side, exits left side (left side against receptor).", difficulty: "easy" },
      { id: 33, front: "What is an oblique projection?", back: "Patient rotated at an angle (usually 45°) between frontal and lateral positions. RPO, LPO, RAO, LAO.", difficulty: "easy" },
      { id: 34, front: "What does RPO stand for?", back: "Right Posterior Oblique — patient supine, rotated with right side down/closest to receptor.", difficulty: "easy" },
      { id: 35, front: "Why is PA preferred for chest x-ray?", back: "Minimizes heart magnification because the heart is anterior and closest to the image receptor in PA position.", difficulty: "medium" },
      { id: 36, front: "Standard SID for chest x-ray?", back: "72 inches (183 cm) to minimize magnification of mediastinal structures.", difficulty: "medium" },
      { id: 37, front: "What is the central ray?", back: "The center of the x-ray beam, directed to a specific anatomical point for each projection.", difficulty: "easy" },
      { id: 38, front: "What does 'decubitus' mean?", back: "Patient lying down (supine or lateral) with a horizontal x-ray beam. Used to demonstrate air-fluid levels.", difficulty: "medium" },
      { id: 39, front: "What is the Towne projection?", back: "AP axial projection of the skull with 30° caudal tube angle. Demonstrates the occipital bone and foramen magnum.", difficulty: "hard" },
      { id: 40, front: "What is the Waters projection?", back: "PA projection of the facial bones with chin raised (OML at 37° to receptor). Best for maxillary sinuses.", difficulty: "hard" },
    ]
  },
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
  const params = useParams<{ country: string }>();
  const country = params.country === "usa" ? "usa" : "canada";
  const countryLabel = country === "usa" ? "USA (ARRT)" : "Canada (CAMRT)";

  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [showDeckBrowser, setShowDeckBrowser] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [progress, setProgress] = useState<SpacedRepProgress>({});

  useEffect(() => {
    const saved = localStorage.getItem(`imaging-flashcard-progress-${country}`);
    if (saved) setProgress(JSON.parse(saved));
  }, [country]);

  const saveProgress = (newProgress: SpacedRepProgress) => {
    setProgress(newProgress);
    localStorage.setItem(`imaging-flashcard-progress-${country}`, JSON.stringify(newProgress));
  };

  const selectedDeck = selectedDeckId ? IMAGING_FLASHCARD_DECKS.find(d => d.id === selectedDeckId) : null;
  const cards = selectedDeck?.cards || IMAGING_FLASHCARD_DECKS.flatMap(d => d.cards);
  const current = cards[currentIdx];

  const filteredDecks = useMemo(() => {
    if (!searchQuery.trim()) return IMAGING_FLASHCARD_DECKS;
    const q = searchQuery.toLowerCase();
    return IMAGING_FLASHCARD_DECKS.filter(d =>
      d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const selectDeck = (deckId: string | null) => {
    setSelectedDeckId(deckId);
    setShowDeckBrowser(false);
    setCurrentIdx(0);
    setFlipped(false);
  };

  const markDifficulty = (rating: DifficultyRating) => {
    if (!current) return;
    const cardKey = `card-${current.id}`;
    const prev = progress[cardKey] || { difficulty: "medium", nextReview: 0, interval: 1, reviewCount: 0 };
    const intervalMultiplier = rating === "easy" ? 3 : rating === "medium" ? 1.5 : 0.5;
    const newInterval = Math.max(1, Math.round(prev.interval * intervalMultiplier));
    const newProgress = {
      ...progress,
      [cardKey]: {
        difficulty: rating,
        nextReview: Date.now() + newInterval * 24 * 60 * 60 * 1000,
        interval: newInterval,
        reviewCount: prev.reviewCount + 1,
      }
    };
    saveProgress(newProgress);
    next();
  };

  const next = () => {
    setFlipped(false);
    if (currentIdx < cards.length - 1) setCurrentIdx(i => i + 1);
  };

  const prev = () => {
    setFlipped(false);
    if (currentIdx > 0) setCurrentIdx(i => i - 1);
  };

  const reset = () => {
    setCurrentIdx(0);
    setFlipped(false);
  };

  const totalReviewed = Object.keys(progress).length;
  const easyCount = Object.values(progress).filter(p => p.difficulty === "easy").length;
  const hardCount = Object.values(progress).filter(p => p.difficulty === "hard").length;
  const totalCards = IMAGING_FLASHCARD_DECKS.reduce((sum, d) => sum + d.cards.length, 0);

  if (showDeckBrowser) {
    return (
      <>
        <AlliedSEO
          title={`Radiography Flashcards - ${countryLabel} | NurseNest`}
          description={`Master radiography concepts with ${IMAGING_FLASHCARD_DECKS.length} spaced repetition flashcard decks and ${totalCards}+ cards covering radiation physics, image production, radiation protection, and positioning.`}
          keywords={`radiography flashcards, ${country === "usa" ? "ARRT" : "CAMRT"} flashcards, x-ray flashcards, radiology study cards`}
          canonicalPath={`/medical-imaging/${country}/flashcards`}
          structuredData={{
            "@context": "https://schema.org",
            "@type": "EducationalCourse",
            name: `Radiography Flashcards - ${countryLabel}`,
            description: `Spaced repetition flashcard system for ${countryLabel} exam preparation`,
            provider: { "@type": "Organization", name: "NurseNest" }
          }}
        />
        <div className="max-w-5xl mx-auto px-4 py-8" data-testid="imaging-flashcards-page">
          <div className="flex items-center gap-2 text-sm text-foreground/60 mb-6">
            <Link href="/" className="hover:text-primary">{t("allied.imagingFlashcards.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/medical-imaging/${country}`} className="hover:text-primary">{t("allied.imagingFlashcards.medicalImaging")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-primary font-medium">{t("allied.imagingFlashcards.flashcards")}</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-flashcards-title">{t("allied.imagingFlashcards.radiographyFlashcards")}</h1>
            <p className="text-muted-foreground text-sm mt-1">{IMAGING_FLASHCARD_DECKS.length} decks · {totalCards} cards · Spaced repetition learning</p>
          </div>

          <div className="bg-gradient-to-r from-primary/5 to-secondary rounded-2xl p-5 mb-6 border border-border">
            <div className="flex items-center gap-6 text-sm">
              <div><span className="text-foreground/60">{t("allied.imagingFlashcards.reviewed")}</span> <span className="font-bold text-primary" data-testid="text-reviewed-count">{totalReviewed}</span></div>
              <div><span className="text-muted-foreground">{t("allied.imagingFlashcards.mastered")}</span> <span className="font-bold text-green-600">{easyCount}</span></div>
              <div><span className="text-muted-foreground">{t("allied.imagingFlashcards.needsWork")}</span> <span className="font-bold text-red-600">{hardCount}</span></div>
            </div>
          </div>

          <button onClick={() => selectDeck(null)} className="w-full mb-6 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-2xl p-5 text-left hover:from-primary/90 hover:to-primary/70 transition-all" data-testid="button-all-decks">
            <div className="flex items-center gap-3">
              <Layers className="w-6 h-6" />
              <div>
                <div className="font-semibold text-lg">{t("allied.imagingFlashcards.studyAllDecks")}</div>
                <div className="text-primary-foreground/70 text-sm">{totalCards} cards across all topics</div>
              </div>
            </div>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredDecks.map(deck => {
              const deckReviewed = deck.cards.filter(c => progress[`card-${c.id}`]).length;
              return (
                <button key={deck.id} onClick={() => selectDeck(deck.id)} className="bg-card rounded-xl border border-border p-4 text-left hover:border-primary/30 hover:shadow-md transition-all" data-testid={`deck-card-${deck.id}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">{deck.topic}</span>
                    <span className="text-xs text-muted-foreground">{deck.cards.length} cards</span>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{deck.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{deck.description}</p>
                  {deckReviewed > 0 && (
                    <div className="w-full bg-secondary rounded-full h-1">
                      <div className="bg-primary h-1 rounded-full" style={{ width: `${(deckReviewed / deck.cards.length) * 100}%` }} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AlliedSEO
        title={`${selectedDeck?.name || "All"} Flashcards - ${countryLabel} | NurseNest`}
        description={`Study ${selectedDeck?.name || "radiography"} flashcards with spaced repetition for ${countryLabel} exam prep.`}
        canonicalPath={`/medical-imaging/${country}/flashcards`}
      />
      <div className="max-w-3xl mx-auto px-4 py-8" data-testid="imaging-flashcards-study">
        <div className="flex items-center gap-2 text-sm text-foreground/60 mb-6">
          <Link href="/" className="hover:text-primary">{t("allied.imagingFlashcards.home2")}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => setShowDeckBrowser(true)} className="hover:text-primary">{t("allied.imagingFlashcards.flashcards2")}</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-primary font-medium">{selectedDeck?.name || "All Decks"}</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{selectedDeck?.name || "All Flashcards"}</h1>
            <p className="text-muted-foreground text-sm mt-1">{cards.length} cards · Spaced repetition</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowDeckBrowser(true)} className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 rounded-lg text-sm text-primary hover:bg-primary/20" data-testid="button-switch-deck">
              <Layers className="w-3.5 h-3.5" /> Decks
            </button>
            <button onClick={reset} className="flex items-center gap-1 px-3 py-1.5 bg-secondary rounded-lg text-sm text-foreground/60 hover:bg-secondary/80" data-testid="button-reset">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-foreground/60 mb-4">
          <span>Card {currentIdx + 1} of {cards.length}</span>
        </div>

        <div className="w-full bg-secondary rounded-full h-1.5 mb-6">
          <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${((currentIdx + 1) / cards.length) * 100}%` }} />
        </div>

        {current && (
          <div className="mb-6">
            <div
              onClick={() => setFlipped(!flipped)}
              className="bg-card rounded-2xl border border-border p-8 sm:p-12 min-h-[280px] flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all select-none"
              data-testid="flashcard"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-0.5 bg-secondary text-foreground/60 rounded text-xs">{current.difficulty}</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">{flipped ? "Answer" : "Question"}</span>
              </div>
              <p className="text-lg sm:text-xl text-foreground font-medium text-center leading-relaxed" data-testid="text-card-content">
                {flipped ? current.back : current.front}
              </p>
              <div className="flex items-center gap-1 text-muted-foreground text-xs mt-6">
                <Eye className="w-3.5 h-3.5" /> Click to {flipped ? "see question" : "reveal answer"}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <button onClick={prev} disabled={currentIdx === 0} className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-foreground/60 hover:text-foreground disabled:opacity-30" data-testid="button-prev-card">
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <div className="flex gap-2">
            <button onClick={() => markDifficulty("hard")} className="flex items-center gap-1 px-4 py-2.5 bg-red-50 text-red-700 rounded-xl text-sm font-medium hover:bg-red-100" data-testid="button-hard">
              <ThumbsDown className="w-4 h-4" /> Hard
            </button>
            <button onClick={() => markDifficulty("medium")} className="flex items-center gap-1 px-4 py-2.5 bg-amber-50 text-amber-700 rounded-xl text-sm font-medium hover:bg-amber-100" data-testid="button-medium">
              <Minus className="w-4 h-4" /> Medium
            </button>
            <button onClick={() => markDifficulty("easy")} className="flex items-center gap-1 px-4 py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-medium hover:bg-green-100" data-testid="button-easy">
              <ThumbsUp className="w-4 h-4" /> Easy
            </button>
          </div>
          <button onClick={next} disabled={currentIdx === cards.length - 1} className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-foreground/60 hover:text-foreground disabled:opacity-30" data-testid="button-next-card">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
