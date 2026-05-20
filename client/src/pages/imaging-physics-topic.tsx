import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import {
  ChevronDown, ChevronUp, Atom, BookOpen, AlertTriangle,
  Lightbulb, Stethoscope, CheckCircle2, XCircle, Eye, EyeOff, Zap, Brain, ArrowLeft
} from "lucide-react";
import { KvpVisualizer, MasSimulator, InverseSquareLawDiagram, AttenuationLayers, SidMagnificationVisual } from "@/allied/components/physics-visuals";

import { useI18n } from "@/lib/i18n";
const VISUAL_MAP: Record<string, React.FC> = {
  "kvp": KvpVisualizer,
  "tube-current-ma": MasSimulator,
  "mas": MasSimulator,
  "exposure-time": MasSimulator,
  "inverse-square-law": InverseSquareLawDiagram,
  "attenuation": AttenuationLayers,
  "scatter-radiation": AttenuationLayers,
  "photoelectric-effect": AttenuationLayers,
  "compton-scatter": AttenuationLayers,
  "distance-effects-sid": SidMagnificationVisual,
  "magnification-distortion": SidMagnificationVisual,
};

const SEED_TOPIC_DETAILS: Record<string, any> = {
  "x-ray-production": {
    title: "X-ray Production",
    slug: "x-ray-production",
    category: "X-ray Production",
    difficulty: 2,
    content: "X-rays are produced when high-speed electrons interact with a target material in the x-ray tube.",
    explanation: "X-ray production occurs through two main mechanisms:\n\n**Bremsstrahlung Radiation** — When a high-speed electron passes near a tungsten nucleus, it is slowed and deflected, losing kinetic energy as x-ray photons. This produces a continuous spectrum of x-ray energies up to the peak kilovoltage.\n\n**Characteristic Radiation** — When an incoming electron ejects an inner-shell electron from a tungsten atom, an outer-shell electron fills the vacancy, releasing energy as a characteristic x-ray photon. These photons have discrete energies determined by the binding energies of the shells involved.\n\nThe x-ray tube contains a cathode (negative electrode) with a tungsten filament and an anode (positive electrode) with a tungsten target. Thermionic emission releases electrons from the heated filament, and the potential difference (kVp) accelerates them toward the target.\n\nOnly about 1% of kinetic energy is converted to x-rays; 99% becomes heat. This is why tube cooling is essential.",
    clinicalRelevance: "Understanding x-ray production helps radiographers optimize technique factors, minimize patient dose, and troubleshoot equipment issues. Proper tube warm-up procedures prevent anode cracking.",
    formulas: [
      { name: "Maximum photon energy", formula: "E_max = kVp × 1 keV", description: "The maximum energy of any photon equals the peak kilovoltage" },
      { name: "Heat Units (single phase)", formula: "HU = kVp × mA × time", description: "Heat generated per exposure in single-phase equipment" }
    ],
    examTraps: [
      "Don't confuse bremsstrahlung (continuous spectrum) with characteristic (discrete energies)",
      "Remember: the CATHODE has the filament (negative), the ANODE has the target (positive)",
      "Only ~1% of energy becomes x-rays — 99% becomes heat",
      "Characteristic radiation only occurs above the K-shell binding energy (69.5 keV for tungsten)"
    ],
    memoryAid: "Think 'CAT' — Cathode = source of electrons (C for Current), Anode = Target (T for Target). Electrons flow from C to A (like a cat chasing something).",
    factorRelationships: [
      { factor1: "kVp", factor2: "Photon Energy", relationship: "Direct — Higher kVp = higher max photon energy" },
      { factor1: "mA", factor2: "Number of photons", relationship: "Direct — Higher mA = more electrons = more x-rays" },
      { factor1: "Filament current", factor2: "Thermionic emission", relationship: "Direct — More current = more heat = more electrons boiled off" }
    ],
    quizItems: [
      { question: "What percentage of electron kinetic energy is converted to x-rays?", options: ["About 1%", "About 10%", "About 50%", "About 99%"], correctIndex: 0, rationale: "Only about 1% of electron kinetic energy converts to x-ray photons. The remaining 99% is converted to heat, which is why x-ray tubes require efficient cooling systems." },
      { question: "Which type of radiation produces a continuous spectrum?", options: ["Characteristic", "Bremsstrahlung", "Compton", "Photoelectric"], correctIndex: 1, rationale: "Bremsstrahlung ('braking radiation') produces a continuous spectrum because electrons can lose varying amounts of energy depending on how close they pass to the nucleus." },
      { question: "The cathode of an x-ray tube contains the:", options: ["Tungsten target", "Rotating anode", "Filament", "Focal spot"], correctIndex: 2, rationale: "The cathode contains the tungsten filament, which is heated to release electrons via thermionic emission. The electrons are then accelerated toward the anode target." },
    ]
  },
  "kvp": {
    title: "kVp (Kilovoltage Peak)",
    slug: "kvp",
    category: "Beam Characteristics",
    difficulty: 2,
    content: "kVp controls the quality (penetrating power) of the x-ray beam.",
    explanation: "Kilovoltage peak (kVp) is the maximum voltage applied across the x-ray tube during an exposure. It determines:\n\n**Beam Quality** — Higher kVp produces higher-energy photons that penetrate more tissue. This is measured by the half-value layer (HVL).\n\n**Image Contrast** — Lower kVp produces higher contrast (more black and white). Higher kVp produces lower contrast (more gray shades) because more Compton scatter occurs.\n\n**Patient Dose** — While individual photons at higher kVp carry more energy, the 15% Rule allows a significant mAs reduction. Using higher kVp with lower mAs generally results in LESS patient dose.\n\n**The 15% Rule** — Increasing kVp by 15% has the same effect on density as doubling the mAs. Conversely, decreasing kVp by 15% requires doubling the mAs to maintain density.",
    clinicalRelevance: "Selecting optimal kVp is crucial for each body part. Chest radiography uses high kVp (110-125) to penetrate the mediastinum while showing lung detail. Extremity radiography uses low kVp (50-70) for high bone-soft tissue contrast.",
    formulas: [
      { name: "15% Rule", formula: "15% ↑ kVp = 2× density effect", description: "Increasing kVp by 15% doubles the apparent exposure" },
      { name: "Beam quality indicator", formula: "HVL = thickness to reduce intensity by 50%", description: "Half-value layer measures beam penetrating ability" }
    ],
    examTraps: [
      "kVp controls QUALITY (penetration), not QUANTITY — that's mAs",
      "Higher kVp = LOWER contrast (more gray scale), not higher contrast",
      "The 15% rule: 15% increase in kVp ≈ doubling mAs for density, but NOT for contrast",
      "kVp affects scatter: higher kVp = MORE scatter = MORE fog on the image"
    ],
    memoryAid: "kVp = Quality and Contrast. Think 'K for Kontrast' (German spelling). Higher kVp = Lower contrast = Longer gray scale.",
    factorRelationships: [
      { factor1: "kVp", factor2: "Penetration", relationship: "Direct — Higher kVp = more penetrating beam" },
      { factor1: "kVp", factor2: "Contrast", relationship: "Inverse — Higher kVp = lower contrast (longer gray scale)" },
      { factor1: "kVp", factor2: "Patient dose", relationship: "Complex — Higher kVp with 15% rule reduces dose" },
      { factor1: "kVp", factor2: "Scatter", relationship: "Direct — Higher kVp = more Compton scatter" }
    ],
    quizItems: [
      { question: "What does kVp primarily control?", options: ["Quantity of x-rays", "Quality (penetration) of x-rays", "Exposure time", "Focal spot size"], correctIndex: 1, rationale: "kVp controls the quality or penetrating power of the x-ray beam. Higher kVp accelerates electrons to greater speeds, producing higher-energy photons that can penetrate more tissue." },
      { question: "According to the 15% rule, increasing kVp by 15% has what effect on image density?", options: ["No change", "Halves density", "Approximately doubles density", "Quadruples density"], correctIndex: 2, rationale: "The 15% rule states that increasing kVp by 15% approximately doubles the exposure reaching the image receptor, equivalent to doubling the mAs." },
      { question: "What happens to radiographic contrast when kVp is increased?", options: ["Contrast increases", "Contrast decreases", "No change in contrast", "Contrast doubles"], correctIndex: 1, rationale: "Higher kVp produces more Compton scatter and a wider range of photon energies, resulting in more shades of gray (lower contrast / longer gray scale)." },
    ]
  },
  "inverse-square-law": {
    title: "Inverse Square Law",
    slug: "inverse-square-law",
    category: "Beam Characteristics",
    difficulty: 2,
    content: "The intensity of radiation is inversely proportional to the square of the distance from the source.",
    explanation: "The Inverse Square Law states that radiation intensity decreases proportionally to the square of the distance from the source:\n\n**I₁/I₂ = (D₂/D₁)²**\n\nThis means:\n- Double the distance → intensity reduced to 1/4\n- Triple the distance → intensity reduced to 1/9\n- Halve the distance → intensity increases 4×\n\nThis law applies because x-rays diverge from a point source, spreading over an increasingly larger area as distance increases. The area covered increases as the square of the distance.",
    clinicalRelevance: "The inverse square law is critical for radiation protection. Standing 2 meters from a source instead of 1 meter reduces your exposure to 25%. It also affects technique: changing SID requires mAs compensation using the density maintenance formula.",
    formulas: [
      { name: "Inverse Square Law", formula: "I₁/I₂ = (D₂)²/(D₁)²", description: "Relates intensity change to distance change" },
      { name: "Density Maintenance", formula: "mAs₁/mAs₂ = (D₁)²/(D₂)²", description: "mAs adjustment when SID changes" }
    ],
    examTraps: [
      "Remember to SQUARE the distance ratio — don't just divide",
      "When distance doubles, intensity is 1/4 (not 1/2)",
      "The density maintenance formula uses the SAME relationship but for mAs compensation",
      "This law assumes a point source — it's approximate for large focal spots at short distances"
    ],
    memoryAid: "Think of a flashlight: move it twice as far from a wall and the light covers 4× the area but is only 1/4 as bright at any spot.",
    factorRelationships: [
      { factor1: "Distance", factor2: "Intensity", relationship: "Inverse square — Double distance = 1/4 intensity" },
      { factor1: "SID increase", factor2: "mAs needed", relationship: "Direct square — Must increase mAs proportionally to maintain density" }
    ],
    quizItems: [
      { question: "If distance is doubled, radiation intensity becomes:", options: ["1/2 of original", "1/4 of original", "1/8 of original", "2× original"], correctIndex: 1, rationale: "According to the inverse square law, I₁/I₂ = (D₂/D₁)². When distance doubles, the ratio is 4, so new intensity is 1/4 of original." },
      { question: "A radiograph is taken at 40\" SID with 10 mAs. What mAs is needed at 72\" SID?", options: ["18 mAs", "24 mAs", "32.4 mAs", "40 mAs"], correctIndex: 2, rationale: "Using the density maintenance formula: mAs₂ = mAs₁ × (D₂/D₁)² = 10 × (72/40)² = 10 × 3.24 = 32.4 mAs." },
      { question: "The inverse square law is based on which principle?", options: ["Linear proportionality", "Area increases as the square of distance", "Volume increases as the cube", "Circumference increases linearly"], correctIndex: 1, rationale: "X-rays diverge from a point source. The area they cover increases as the square of the distance, so intensity per unit area decreases as 1/distance²." },
    ]
  }
};

function toSlug(title: string): string {
  const { t } = useI18n();
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

interface QuizItemType {
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
}

function MicroQuiz({ quizItems, topicSlug, country }: { quizItems: QuizItemType[]; topicSlug: string; country: string }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  if (!quizItems || quizItems.length === 0) return null;
  const q = quizItems[currentQ];

  const handleSelect = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowRationale(true);
    if (idx === q.correctIndex) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (currentQ < quizItems.length - 1) {
      setCurrentQ(c => c + 1);
      setSelectedAnswer(null);
      setShowRationale(false);
    } else {
      setCompleted(true);
      const progressKey = `physics-progress-${country}`;
      const saved = JSON.parse(localStorage.getItem(progressKey) || "{}");
      saved[topicSlug] = true;
      localStorage.setItem(progressKey, JSON.stringify(saved));
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowRationale(false);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    const percentage = Math.round((score / quizItems.length) * 100);
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center space-y-4" data-testid="quiz-results">
        <Brain className="w-12 h-12 text-purple-500 mx-auto" />
        <h3 className="text-xl font-bold text-gray-900">{t("pages.imagingPhysicsTopic.quizComplete")}</h3>
        <div className="text-3xl font-bold" data-testid="text-quiz-score">
          <span className={percentage >= 70 ? "text-green-600" : "text-amber-600"}>{score}/{quizItems.length}</span>
          <span className="text-lg text-gray-400 ml-2">({percentage}%)</span>
        </div>
        <p className="text-sm text-gray-600">
          {percentage >= 90 ? "Excellent! You've mastered this topic." :
           percentage >= 70 ? "Good job! Review the missed concepts." :
           "Keep studying! Review this topic and try again."}
        </p>
        <button onClick={handleRestart} className="px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700" data-testid="button-restart-quiz">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4" data-testid="micro-quiz">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" /> Micro-Quiz
        </h3>
        <span className="text-sm text-gray-500" data-testid="text-quiz-progress">{currentQ + 1} / {quizItems.length}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div className="bg-purple-500 h-1.5 rounded-full transition-all" style={{ width: `${((currentQ + 1) / quizItems.length) * 100}%` }} />
      </div>
      <p className="text-sm text-gray-800 font-medium" data-testid="text-quiz-question">{q.question}</p>
      <div className="space-y-2">
        {q.options.map((opt, idx) => {
          let bg = "bg-gray-50 hover:bg-gray-100 border-gray-200";
          if (selectedAnswer !== null) {
            if (idx === q.correctIndex) bg = "bg-green-50 border-green-400";
            else if (idx === selectedAnswer) bg = "bg-red-50 border-red-400";
            else bg = "bg-gray-50 border-gray-200 opacity-60";
          }
          return (
            <button key={idx} onClick={() => handleSelect(idx)} disabled={selectedAnswer !== null} className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${bg}`} data-testid={`button-quiz-option-${idx}`}>
              <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>{opt}
              {selectedAnswer !== null && idx === q.correctIndex && <CheckCircle2 className="w-4 h-4 text-green-500 inline ml-2" />}
              {selectedAnswer === idx && idx !== q.correctIndex && <XCircle className="w-4 h-4 text-red-500 inline ml-2" />}
            </button>
          );
        })}
      </div>
      {showRationale && (
        <div className={`rounded-xl p-4 text-sm ${selectedAnswer === q.correctIndex ? "bg-green-50 border border-green-200 text-green-800" : "bg-amber-50 border border-amber-200 text-amber-800"}`} data-testid="text-quiz-rationale">
          <strong>{selectedAnswer === q.correctIndex ? "Correct!" : "Incorrect."}</strong> {q.rationale}
        </div>
      )}
      {showRationale && (
        <button onClick={handleNext} className="px-5 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700" data-testid="button-quiz-next">
          {currentQ < quizItems.length - 1 ? "Next Question" : "See Results"}
        </button>
      )}
    </div>
  );
}

const EXAM_MAP: Record<string, { exam: string }> = {
  canada: { exam: "CAMRT" },
  usa: { exam: "ARRT" },
};

export default function ImagingPhysicsTopicPage() {
  const [, params] = useRoute("/medical-imaging/:country/physics/:topicSlug");
  const country = params?.country || "canada";
  const topicSlug = params?.topicSlug || "";
  const examInfo = EXAM_MAP[country] || EXAM_MAP.canada;
  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFormulas, setShowFormulas] = useState(false);
  const [showRelationships, setShowRelationships] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/imaging/physics`)
      .then(r => r.ok ? r.json() : [])
      .then((data: any[]) => {
        const withSlugs = data.map(t => ({
          ...t,
          slug: t.slug || toSlug(t.title),
        }));
        const found = withSlugs.find((t: any) => t.slug === topicSlug);
        if (found) {
          setTopic(found);
        } else {
          setTopic(SEED_TOPIC_DETAILS[topicSlug] || null);
        }
      })
      .catch(() => setTopic(SEED_TOPIC_DETAILS[topicSlug] || null))
      .finally(() => setLoading(false));
  }, [country, topicSlug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-not-found-title">{t("pages.imagingPhysicsTopic.topicNotFound")}</h1>
        <p className="text-gray-600 mb-4">{t("pages.imagingPhysicsTopic.thisPhysicsTopicDoesntExist")}</p>
        <Link href={`/medical-imaging/${country}/physics`} className="text-purple-600 hover:underline">{t("pages.imagingPhysicsTopic.backToPhysicsTopics")}</Link>
      </div>
    );
  }

  const VisualComponent = VISUAL_MAP[topicSlug];
  const explanation = topic.explanation || topic.content || "";
  const formulas = topic.formulas || [];
  const examTraps = topic.examTraps || topic.exam_traps || [];
  const factorRelationships = topic.factorRelationships || topic.factor_relationships || [];
  const quizItems = topic.quizItems || topic.quiz_items || [];
  const keyConcepts = topic.keyConcepts || topic.key_concepts || [];

  return (
    <div data-testid="physics-topic-page">
      <SEO
        title={`${topic.title} - Physics | ${examInfo.exam} | NurseNest`}
        description={topic.seoDescription || topic.seo_description || `Learn ${topic.title} for the ${examInfo.exam} exam. Interactive visuals, micro-quiz, exam traps, and memory aids.`}
        canonicalPath={`/medical-imaging/${country}/physics/${topicSlug}`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BreadcrumbNav items={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: "Medical Imaging", url: "https://www.nursenest.ca/medical-imaging" },
          { name: country === "canada" ? "Canada" : "USA", url: `https://www.nursenest.ca/medical-imaging/${country}` },
          { name: "Physics", url: `https://www.nursenest.ca/medical-imaging/${country}/physics` },
          { name: topic.title, url: `https://www.nursenest.ca/medical-imaging/${country}/physics/${topicSlug}` },
        ]} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href={`/medical-imaging/${country}/physics`} className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 mb-6" data-testid="link-back-to-physics">
          <ArrowLeft className="w-4 h-4" /> Back to Physics Topics
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">{topic.category}</span>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{examInfo.exam}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-2" data-testid="text-topic-title">{topic.title}</h1>
        </div>

        <div className="space-y-6">
          {explanation && (
            <section className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-500" /> Explanation
              </h2>
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line" data-testid="text-explanation">
                {explanation}
              </div>
              {keyConcepts.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{t("pages.imagingPhysicsTopic.keyConcepts")}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {keyConcepts.map((c: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-full">{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {formulas.length > 0 && (
            <section className="bg-white rounded-2xl border border-gray-100 p-6">
              <button onClick={() => setShowFormulas(!showFormulas)} className="w-full flex items-center justify-between" data-testid="button-toggle-formulas">
                <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" /> Key Equations
                </h2>
                {showFormulas ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
              {showFormulas && (
                <div className="mt-4 space-y-3">
                  {formulas.map((f: any, i: number) => (
                    <div key={i} className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                      <div className="font-semibold text-amber-800 text-sm mb-1">{f.name}</div>
                      <div className="font-mono text-lg text-amber-900 mb-1" data-testid={`text-formula-${i}`}>{f.formula}</div>
                      <div className="text-xs text-amber-700">{f.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {factorRelationships.length > 0 && (
            <section className="bg-white rounded-2xl border border-gray-100 p-6">
              <button onClick={() => setShowRelationships(!showRelationships)} className="w-full flex items-center justify-between" data-testid="button-toggle-relationships">
                <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">{t("pages.imagingPhysicsTopic.factorRelationships")}</h2>
                {showRelationships ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {showRelationships && (
                <div className="mt-4 space-y-2">
                  {factorRelationships.map((r: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 text-sm">
                      <span className="font-medium text-purple-700 min-w-[80px]">{r.factor1}</span>
                      <span className="text-gray-400">↔</span>
                      <span className="font-medium text-indigo-700 min-w-[80px]">{r.factor2}</span>
                      <span className="text-gray-600 flex-1">{r.relationship}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {(topic.clinicalRelevance || topic.clinical_relevance) && (
            <section className="bg-teal-50 rounded-2xl border border-teal-100 p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-teal-600" /> Clinical Relevance
              </h2>
              <p className="text-sm text-teal-800 leading-relaxed" data-testid="text-clinical-relevance">{topic.clinicalRelevance || topic.clinical_relevance}</p>
            </section>
          )}

          {examTraps.length > 0 && (
            <section className="bg-red-50 rounded-2xl border border-red-100 p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" /> Common Exam Traps
              </h2>
              <ul className="space-y-2">
                {examTraps.map((trap: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-red-800">
                    <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span data-testid={`text-exam-trap-${i}`}>{trap}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(topic.memoryAid || topic.memory_aid) && (
            <section className="bg-purple-50 rounded-2xl border border-purple-100 p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-purple-500" /> Memory Aid
              </h2>
              <p className="text-sm text-purple-800 leading-relaxed" data-testid="text-memory-aid">{topic.memoryAid || topic.memory_aid}</p>
            </section>
          )}

          {VisualComponent && (
            <section>
              <h2 className="font-bold text-gray-900 text-lg mb-3">{t("pages.imagingPhysicsTopic.interactiveVisual")}</h2>
              <VisualComponent />
            </section>
          )}

          {quizItems.length > 0 && (
            <section>
              <MicroQuiz quizItems={quizItems} topicSlug={topicSlug} country={country} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
