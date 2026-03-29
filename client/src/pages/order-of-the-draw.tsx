import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Beaker,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  FlaskConical,
  Droplets,
  ShieldAlert,
  Lightbulb,
  ClipboardList,
} from "lucide-react";
import { Link } from "wouter";
import { Footer } from "@/components/footer";

import { useI18n } from "@/lib/i18n";
const TUBES = [
  {
    order: 1,
    name: "Blood Culture Bottles",
    capColor: "#F5C542",
    capLabel: "Yellow / Black",
    additive: "SPS (Sodium Polyanethol Sulfonate)",
    commonTests: ["Blood cultures", "Microbiology", "Sterility testing"],
    why: "Blood cultures must be drawn FIRST to prevent contamination from other tube additives. SPS prevents blood from clotting and inhibits complement and phagocytosis, preserving any bacteria present for accurate culture results. If drawn after other tubes, additives like EDTA or heparin could transfer via needle contamination and either kill bacteria (false negative) or interfere with culture media.",
    clinicalPearl: "Always collect blood cultures before starting antibiotics when possible. If the patient is already on antibiotics, note this on the requisition. Draw from two separate venipuncture sites (or one venipuncture and one from a line) to differentiate true bacteremia from contamination.",
    inversions: "8-10 gentle inversions",
    volume: "8-10 mL per bottle (adult)",
  },
  {
    order: 2,
    name: "Coagulation Tube",
    capColor: "#87CEEB",
    capLabel: "Light Blue",
    additive: "Sodium Citrate (3.2%)",
    commonTests: ["PT/INR", "PTT/aPTT", "Fibrinogen", "D-dimer", "Coagulation factor assays"],
    why: "The light blue tube is drawn second because sodium citrate binds calcium ions, preventing coagulation. It must be drawn before tubes containing clot activators (red/gold) or anticoagulants like EDTA and heparin that could cross-contaminate and falsely alter coagulation results. The tube MUST be filled to the exact fill line -- the 9:1 blood-to-citrate ratio is critical. An underfilled tube gives falsely prolonged PT/PTT results.",
    clinicalPearl: "If only a coagulation tube is ordered (no blood cultures), you must still draw a discard tube first to clear the dead space of tissue thromboplastin from the needle puncture. Use either a plain red top or another light blue as the discard. Tissue factor contamination causes falsely shortened clotting times.",
    inversions: "3-4 gentle inversions",
    volume: "2.7 mL (must fill to line)",
  },
  {
    order: 3,
    name: "Serum Tube (Plain)",
    capColor: "#DC2626",
    capLabel: "Red",
    additive: "None (glass) or Clot Activator (plastic)",
    commonTests: ["Blood bank / crossmatch", "Serology", "Drug levels (some)"],
    why: "Red top tubes contain no anticoagulant and may have a clot activator (silica particles in plastic tubes). They are drawn after the citrate tube to prevent clot activator particles from contaminating the blue top and causing falsely shortened coagulation times. The blood is allowed to clot naturally (30-60 minutes), then centrifuged to separate serum from the clot.",
    clinicalPearl: "For blood bank specimens (type and screen, crossmatch), most facilities require a plain RED top, not a gold/SST tube, because the gel separator can interfere with blood bank testing. Always label blood bank tubes AT THE BEDSIDE with the patient present -- this is a critical patient safety requirement.",
    inversions: "5 gentle inversions (if clot activator present); none if plain glass",
    volume: "7-10 mL",
  },
  {
    order: 4,
    name: "Serum Separator Tube (SST)",
    capColor: "#D4A017",
    capLabel: "Gold / Tiger Top",
    additive: "Gel Separator + Clot Activator",
    commonTests: ["Comprehensive metabolic panel (CMP)", "Basic metabolic panel (BMP)", "Liver function tests (LFTs)", "Thyroid panel (TSH, T3, T4)", "Lipid panel", "Cardiac enzymes (Troponin)"],
    why: "The gold SST tube contains both a clot activator (silica) and a thixotropic gel that, during centrifugation, migrates between the serum and clot to form a barrier. This keeps serum stable for chemistry analysis. It is drawn after the plain red top to prevent gel or clot activator contamination of tubes that cannot tolerate them (especially blood bank specimens and coagulation tubes).",
    clinicalPearl: "After drawing, allow the SST to clot for 30 minutes at room temperature before centrifuging. Do not centrifuge early or the gel barrier will not form properly, and cellular components will leak into the serum, causing hemolysis and inaccurate potassium and LDH results.",
    inversions: "5 gentle inversions",
    volume: "5-8.5 mL",
  },
  {
    order: 5,
    name: "Heparin Tube",
    capColor: "#16A34A",
    capLabel: "Green / Light Green (PST)",
    additive: "Lithium Heparin, Sodium Heparin, or Ammonium Heparin",
    commonTests: ["STAT chemistry panels", "Ammonia", "Lactate", "ABG syringes", "Ionized calcium", "BNP"],
    why: "Green top tubes use heparin as the anticoagulant, which inhibits thrombin and prevents clotting. Heparin tubes are drawn after clot-activator tubes (red/gold) because residual heparin on the needle can contaminate subsequent tubes drawn after it and prevent proper clotting in serum tubes. Plasma from heparin tubes provides faster results than serum tubes because no clotting time is needed.",
    clinicalPearl: "Lithium heparin tubes CANNOT be used for lithium level testing (the additive contaminates the result). For lithium drug levels, use a plain red top or SST. Similarly, sodium heparin tubes will falsely elevate sodium levels. Know which heparin variant your facility stocks.",
    inversions: "8-10 gentle inversions",
    volume: "4-6 mL",
  },
  {
    order: 6,
    name: "EDTA Tube",
    capColor: "#9333EA",
    capLabel: "Lavender / Purple",
    additive: "EDTA (Ethylenediaminetetraacetic Acid)",
    commonTests: ["CBC (Complete Blood Count)", "Blood typing (ABO/Rh)", "Hemoglobin A1C", "ESR", "Reticulocyte count", "Blood smear / differential"],
    why: "EDTA chelates (binds) calcium ions, preventing platelet aggregation and preserving cellular morphology. The lavender tube is drawn near the end of the order because EDTA is a powerful chelator that can contaminate other tubes. EDTA contamination of a green or gold tube would bind calcium and falsely lower calcium results. EDTA contamination in a blue top would alter the calcium-dependent coagulation cascade and give unreliable PT/PTT values.",
    clinicalPearl: "EDTA preserves blood cell shape better than any other anticoagulant, which is why it is the standard for CBC and blood smears. For an accurate platelet count, ensure adequate mixing -- clumped EDTA samples give falsely low platelet counts (pseudothrombocytopenia). In rare cases, EDTA can cause platelet clumping; if this happens, redraw in a sodium citrate tube and report to the lab.",
    inversions: "8-10 gentle inversions",
    volume: "3-4 mL",
  },
  {
    order: 7,
    name: "Glycolytic Inhibitor Tube",
    capColor: "#6B7280",
    capLabel: "Gray",
    additive: "Potassium Oxalate + Sodium Fluoride",
    commonTests: ["Fasting glucose", "Glucose tolerance test (GTT)", "Blood alcohol level", "Lactic acid (some facilities)"],
    why: "The gray tube is drawn LAST because it contains sodium fluoride, which inhibits glycolysis (the enzymatic breakdown of glucose by blood cells). This preserves the glucose concentration at the time of collection for up to 24 hours. However, sodium fluoride also inhibits many other enzymes and would interfere with chemistry and coagulation results if it contaminated other tubes. Potassium oxalate, the anticoagulant, would falsely elevate potassium if it cross-contaminated a chemistry tube.",
    clinicalPearl: "Sodium fluoride does NOT immediately stop glycolysis -- it takes about 1-2 hours to fully inhibit the enzymes. In the first hour, glucose can still drop by approximately 5-7%. For the most accurate fasting glucose, process the specimen promptly. For glucose tolerance tests, note the exact collection time on each tube.",
    inversions: "8-10 gentle inversions",
    volume: "4-6 mL",
  },
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "A nurse is preparing to draw blood for a PT/INR, CBC, and blood cultures. What is the correct order of draw?",
    options: [
      "Light blue, lavender, yellow",
      "Yellow, light blue, lavender",
      "Lavender, light blue, yellow",
      "Light blue, yellow, lavender",
    ],
    correct: 1,
    rationale: "Blood cultures (yellow/black) are ALWAYS drawn first to prevent contamination. The light blue (coagulation) tube comes second, and the lavender (EDTA/CBC) tube is drawn near the end of the sequence. The correct order is: Blood cultures -> Light blue -> Lavender.",
  },
  {
    id: 2,
    question: "Why must the light blue coagulation tube be filled exactly to the fill line?",
    options: [
      "To prevent hemolysis of the sample",
      "To maintain the critical 9:1 blood-to-citrate ratio for accurate results",
      "To ensure there is enough sample for repeat testing",
      "To prevent the tube from breaking in the centrifuge",
    ],
    correct: 1,
    rationale: "The light blue tube contains sodium citrate in a precise 9:1 ratio (9 parts blood to 1 part citrate). Underfilling means excess citrate relative to blood, which binds too much calcium and produces falsely prolonged PT/PTT results. Overfilling dilutes the citrate and can lead to partial clotting.",
  },
  {
    id: 3,
    question: "A patient requires only a PT/INR draw and no other labs. What should the phlebotomist do?",
    options: [
      "Draw only the light blue tube since it is the only test ordered",
      "Draw a discard tube first, then the light blue tube",
      "Draw a lavender tube first, then the light blue tube",
      "Draw a red top tube after the light blue tube",
    ],
    correct: 1,
    rationale: "When a coagulation tube is the first and only tube drawn, a discard tube must be collected first. The initial blood entering the needle contains tissue thromboplastin from the venipuncture, which can activate the coagulation cascade and cause falsely shortened clotting times. The discard tube clears this contaminated blood before the diagnostic specimen is collected.",
  },
  {
    id: 4,
    question: "Which tube additive preserves blood cell morphology for CBC and differential analysis?",
    options: [
      "Sodium citrate",
      "Lithium heparin",
      "EDTA",
      "Sodium fluoride",
    ],
    correct: 2,
    rationale: "EDTA (lavender/purple top) is the standard anticoagulant for hematology studies because it chelates calcium to prevent clotting while preserving the size, shape, and staining characteristics of blood cells. This makes it ideal for CBC, differential counts, and blood smear preparation.",
  },
  {
    id: 5,
    question: "A nurse draws a green top tube before a gold top tube. What is the potential consequence?",
    options: [
      "The gold tube results will be unaffected",
      "Heparin contamination could prevent proper clotting in the gold tube, leading to inaccurate serum chemistry results",
      "The green tube glucose results will be falsely elevated",
      "EDTA will contaminate the gold tube",
    ],
    correct: 1,
    rationale: "If a green (heparin) tube is drawn before a gold (SST) tube, residual heparin on the needle can transfer into the gold tube and prevent proper clotting. This compromises the serum separation process and can lead to hemolyzed or fibrin-contaminated samples with inaccurate chemistry results, particularly potassium and LDH.",
  },
  {
    id: 6,
    question: "Why is the gray top tube drawn last in the order of draw?",
    options: [
      "Because glucose testing is the least urgent",
      "Because sodium fluoride and potassium oxalate would contaminate other tubes if carried over",
      "Because it takes the longest to fill",
      "Because it needs to be refrigerated immediately",
    ],
    correct: 1,
    rationale: "The gray tube contains sodium fluoride (which inhibits many enzymes beyond glycolysis) and potassium oxalate (an anticoagulant). If these additives contaminate other tubes: sodium fluoride would interfere with chemistry enzyme assays, and potassium oxalate would falsely elevate potassium levels in a chemistry panel. Drawing it last minimizes contamination risk.",
  },
  {
    id: 7,
    question: "A lithium level is ordered along with a BMP. Which tube should NOT be used for the lithium level?",
    options: [
      "Red top",
      "Gold/SST top",
      "Green top (lithium heparin)",
      "Any of the above can be used",
    ],
    correct: 2,
    rationale: "A green top tube containing lithium heparin as the anticoagulant will falsely elevate the lithium level because the additive itself contains lithium. For lithium drug level monitoring, use a plain red top or gold/SST tube to obtain serum without lithium contamination.",
  },
  {
    id: 8,
    question: "What is the mnemonic for remembering the order of the draw?",
    options: [
      "Bad Luck Runs Gold, Green Lights Go",
      "Boys Love Red Gold Greens, Lovely Grey",
      "Blood Levels Reflect Good Green Lavender Growth",
      "Blue Leads Red, Gold Goes Last, Grey",
    ],
    correct: 1,
    rationale: "\"Boys Love Red Gold Greens, Lovely Grey\" maps to: Blood cultures (Yellow/Black) - Light Blue - Red - Gold - Green - Lavender - Gray. This mnemonic follows the CLSI (Clinical and Laboratory Standards Institute) recommended order of draw for venipuncture.",
  },
];

function TubeCard({ tube, isExpanded, onToggle }: { tube: typeof TUBES[0]; isExpanded: boolean; onToggle: () => void }) {
  return (
    <Card className="border border-gray-100 shadow-sm overflow-hidden" data-testid={`tube-card-${tube.order}`}>
      <button
        onClick={onToggle}
        className="w-full text-left"
        data-testid={`tube-toggle-${tube.order}`}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex flex-col items-center">
                <span className="text-xs font-semibold text-gray-400 mb-1">STEP</span>
                <span className="text-2xl font-bold text-[#2E3A59]">{tube.order}</span>
              </div>
              <div
                className="w-10 h-16 rounded-md border-2 border-gray-200 relative overflow-hidden"
                title={tube.capLabel}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-5 rounded-t-sm"
                  style={{ backgroundColor: tube.capColor }}
                />
                <div className="absolute bottom-0 left-0 right-0 h-11 bg-red-50" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg text-[#2E3A59] flex items-center gap-2">
                {tube.name}
                <Badge variant="outline" className="text-xs font-normal ml-1" style={{ borderColor: tube.capColor, color: tube.capColor }}>
                  {tube.capLabel}
                </Badge>
              </CardTitle>
              <p className="text-sm text-gray-500 mt-0.5">
                <span className="font-medium">{t("pages.orderOfTheDraw.additive")}</span> {tube.additive}
              </p>
            </div>
            <div className="flex-shrink-0 text-gray-400">
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </CardHeader>
      </button>

      {isExpanded && (
        <CardContent className="pt-0 pb-5 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#AEE3E1]/10 rounded-lg p-4 border border-[#AEE3E1]/20">
              <h4 className="font-semibold text-sm text-[#2E3A59] flex items-center gap-2 mb-2">
                <ClipboardList className="w-4 h-4 text-[#AEE3E1]" /> Common Tests
              </h4>
              <ul className="space-y-1">
                {tube.commonTests.map((test, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#AEE3E1] mt-0.5 flex-shrink-0" />
                    {test}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#BFA6F6]/10 rounded-lg p-4 border border-[#BFA6F6]/20">
              <h4 className="font-semibold text-sm text-[#2E3A59] flex items-center gap-2 mb-2">
                <Beaker className="w-4 h-4 text-[#BFA6F6]" /> Tube Specs
              </h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div><span className="font-medium">{t("pages.orderOfTheDraw.inversions")}</span> {tube.inversions}</div>
                <div><span className="font-medium">{t("pages.orderOfTheDraw.fillVolume")}</span> {tube.volume}</div>
              </div>
            </div>
          </div>

          <div className="bg-[#FFD6A5]/10 rounded-lg p-4 border border-[#FFD6A5]/20">
            <h4 className="font-semibold text-sm text-[#2E3A59] flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-[#FFD6A5]" /> Why This Position in the Order
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">{tube.why}</p>
          </div>

          <div className="bg-[#FFF3B0]/20 rounded-lg p-4 border border-[#FFF3B0]/40">
            <h4 className="font-semibold text-sm text-[#2E3A59] flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" /> Clinical Pearl
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">{tube.clinicalPearl}</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function QuizSection() {
  const { t } = useI18n();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = QUIZ_QUESTIONS[currentQ];

  const handleSelect = (idx: number) => {
    if (showRationale) return;
    setSelected(idx);
    setShowRationale(true);
    setAnswered(a => a + 1);
    if (idx === q.correct) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setShowRationale(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    return (
      <Card className="border-none shadow-sm" data-testid="quiz-results">
        <CardContent className="py-8 text-center space-y-4">
          <GraduationCap className="w-12 h-12 mx-auto text-[#BFA6F6]" />
          <h3 className="text-xl font-bold text-[#2E3A59]">{t("pages.orderOfTheDraw.quizComplete")}</h3>
          <p className="text-lg text-gray-700">
            You scored <span className="font-bold text-[#BFA6F6]">{score}/{QUIZ_QUESTIONS.length}</span> ({pct}%)
          </p>
          <Progress value={pct} className="max-w-xs mx-auto" />
          <p className="text-sm text-gray-500 mt-2">
            {pct >= 80 ? "Excellent work! You have a strong understanding of the order of draw." :
             pct >= 60 ? "Good effort! Review the tubes you missed and try again." :
             "Keep studying! Review each tube's rationale and retake the quiz."}
          </p>
          <Button
            onClick={() => { setCurrentQ(0); setSelected(null); setShowRationale(false); setScore(0); setAnswered(0); setFinished(false); }}
            className="bg-[#BFA6F6] hover:bg-[#A88DE0] text-white"
            data-testid="button-retake-quiz"
          >
            Retake Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4" data-testid="quiz-section">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">Question {currentQ + 1} of {QUIZ_QUESTIONS.length}</span>
        <span className="text-sm text-gray-500">Score: {score}/{answered}</span>
      </div>
      <Progress value={((currentQ + 1) / QUIZ_QUESTIONS.length) * 100} className="mb-4" />

      <Card className="border-none shadow-sm" data-testid={`quiz-question-${q.id}`}>
        <CardContent className="py-5">
          <p className="font-semibold text-[#2E3A59] mb-4">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, idx) => {
              let cls = "w-full text-left p-3 rounded-lg border transition-colors text-sm ";
              if (showRationale) {
                if (idx === q.correct) cls += "border-green-400 bg-green-50 text-green-800";
                else if (idx === selected) cls += "border-red-400 bg-red-50 text-red-800";
                else cls += "border-gray-200 bg-gray-50 text-gray-500";
              } else if (idx === selected) {
                cls += "border-[#BFA6F6] bg-[#BFA6F6]/10";
              } else {
                cls += "border-gray-200 hover:border-[#BFA6F6]/50 hover:bg-[#BFA6F6]/5";
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={cls}
                  disabled={showRationale}
                  data-testid={`quiz-option-${q.id}-${idx}`}
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
                  {opt}
                </button>
              );
            })}
          </div>

          {showRationale && (
            <div className="mt-4 p-4 rounded-lg bg-[#FFF3B0]/20 border border-[#FFF3B0]/40" data-testid="quiz-rationale">
              <h4 className="font-semibold text-sm text-[#2E3A59] mb-1">{t("pages.orderOfTheDraw.rationale")}</h4>
              <p className="text-sm text-gray-700">{q.rationale}</p>
            </div>
          )}

          {showRationale && (
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleNext}
                className="bg-[#BFA6F6] hover:bg-[#A88DE0] text-white"
                data-testid="button-next-question"
              >
                {currentQ < QUIZ_QUESTIONS.length - 1 ? "Next Question" : "See Results"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function OrderOfTheDrawPage() {
  const [expandedTubes, setExpandedTubes] = useState<Set<number>>(new Set([1]));

  const toggleTube = (order: number) => {
    setExpandedTubes(prev => {
      const next = new Set(prev);
      if (next.has(order)) next.delete(order);
      else next.add(order);
      return next;
    });
  };

  const expandAll = () => setExpandedTubes(new Set(TUBES.map(t => t.order)));
  const collapseAll = () => setExpandedTubes(new Set());

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#BFA6F6]/5 to-white">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/lessons">
            <Button variant="ghost" size="sm" className="gap-1" data-testid="button-back">
              <ArrowLeft className="w-4 h-4" /> Back to Lessons
            </Button>
          </Link>
          <div className="h-5 w-px bg-gray-200" />
          <Badge className="bg-[#BFA6F6]/10 text-[#BFA6F6] border-[#BFA6F6]/20">{t("pages.orderOfTheDraw.phlebotomy")}</Badge>
          <Badge className="bg-[#AEE3E1]/10 text-[#2E3A59] border-[#AEE3E1]/20">{t("pages.orderOfTheDraw.clinicalSkills")}</Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <FlaskConical className="w-8 h-8 text-[#BFA6F6]" />
            <Droplets className="w-6 h-6 text-red-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#2E3A59] mb-3" data-testid="page-title">
            Order of the Draw
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg" data-testid="page-subtitle">
            Master the correct venipuncture tube collection sequence. Understanding WHY each tube is drawn
            in a specific order prevents specimen contamination and ensures accurate lab results.
          </p>
        </div>

        <Card className="mb-8 border-none shadow-sm bg-[#FFF3B0]/15" data-testid="card-mnemonic">
          <CardContent className="py-5">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-[#2E3A59] mb-1">{t("pages.orderOfTheDraw.memoryAid")}</h3>
                <p className="text-lg font-semibold text-[#2E3A59]">
                  "<span className="text-[#D4A017]">B</span>oys{" "}
                  <span className="text-[#87CEEB]">L</span>ove{" "}
                  <span className="text-[#DC2626]">R</span>ed{" "}
                  <span className="text-[#D4A017]">G</span>old{" "}
                  <span className="text-[#16A34A]">G</span>reens,{" "}
                  <span className="text-[#9333EA]">L</span>ovely{" "}
                  <span className="text-[#6B7280]">G</span>rey"
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Blood cultures - Light blue - Red - Gold - Green - Lavender - Gray
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="learn" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-50">
            <TabsTrigger value="learn" className="gap-2" data-testid="tab-learn">
              <BookOpen className="w-4 h-4" /> Learn
            </TabsTrigger>
            <TabsTrigger value="reference" className="gap-2" data-testid="tab-reference">
              <ClipboardList className="w-4 h-4" /> Quick Reference
            </TabsTrigger>
            <TabsTrigger value="quiz" className="gap-2" data-testid="tab-quiz">
              <GraduationCap className="w-4 h-4" /> Practice Quiz
            </TabsTrigger>
          </TabsList>

          <TabsContent value="learn" className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-[#2E3A59]">{t("pages.orderOfTheDraw.tubebytubeBreakdown")}</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={expandAll} data-testid="button-expand-all">
                  Expand All
                </Button>
                <Button variant="outline" size="sm" onClick={collapseAll} data-testid="button-collapse-all">
                  Collapse All
                </Button>
              </div>
            </div>

            <Card className="border-none shadow-sm bg-[#AEE3E1]/10 mb-4" data-testid="card-intro">
              <CardContent className="py-4">
                <h3 className="font-semibold text-[#2E3A59] mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#FFD6A5]" /> Why Does Order Matter?
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Each blood collection tube contains a specific additive (anticoagulant, clot activator, preservative, or nothing).
                  When a tube is punctured by the needle, trace amounts of its additive can remain on the needle tip and transfer
                  into the next tube drawn. This is called <strong>{t("pages.orderOfTheDraw.additiveCarryover")}</strong> or <strong>cross-contamination</strong>.
                  Drawing tubes in the wrong order can lead to falsely elevated or decreased lab values, potentially causing
                  misdiagnosis and inappropriate treatment. The standard order of draw is established by the <strong>CLSI
                  (Clinical and Laboratory Standards Institute)</strong> to minimize this risk.
                </p>
              </CardContent>
            </Card>

            {TUBES.map(tube => (
              <TubeCard
                key={tube.order}
                tube={tube}
                isExpanded={expandedTubes.has(tube.order)}
                onToggle={() => toggleTube(tube.order)}
              />
            ))}

            <Card className="border-none shadow-sm bg-[#BFA6F6]/5 mt-6" data-testid="card-special-considerations">
              <CardContent className="py-5">
                <h3 className="font-bold text-[#2E3A59] mb-3 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-[#BFA6F6]" /> Special Considerations
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <strong>{t("pages.orderOfTheDraw.wingedButterflyCollections")}</strong> When using a winged blood collection set, the tubing creates
                    dead space filled with air. If a light blue tube is the first tube drawn, air in the tubing will cause
                    underfilling. Draw a discard tube first (red or another blue) to prime the tubing before collecting the
                    coagulation specimen.
                  </div>
                  <div>
                    <strong>{t("pages.orderOfTheDraw.syringeDraws")}</strong> When using a syringe (e.g., from a difficult draw), transfer blood into tubes
                    following the same order of draw. Blood cultures first, then light blue, then the remaining tubes.
                    Use a transfer device -- never puncture tube stoppers with the syringe needle directly.
                  </div>
                  <div>
                    <strong>{t("pages.orderOfTheDraw.lineDraws")}</strong> When drawing from a central or peripheral IV line, discard the first 5-10 mL
                    (dead volume) to clear IV fluid dilution. Then follow the standard order of draw. Document that the
                    specimen was drawn from a line.
                  </div>
                  <div>
                    <strong>{t("pages.orderOfTheDraw.capillaryFingerstickOrder")}</strong> For capillary collections, the order changes slightly:
                    EDTA (lavender) is drawn FIRST (platelets aggregate quickly in capillary specimens), then other
                    anticoagulant tubes, then serum tubes last.
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reference">
            <Card className="border-none shadow-sm" data-testid="card-quick-reference">
              <CardContent className="py-5">
                <h2 className="text-xl font-bold text-[#2E3A59] mb-4">{t("pages.orderOfTheDraw.quickReferenceTable")}</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" data-testid="table-reference">
                    <thead>
                      <tr>
                        <th className="text-left py-3 px-3 bg-[#BFA6F6]/15 rounded-tl-lg font-semibold text-[#2E3A59]">{t("pages.orderOfTheDraw.order")}</th>
                        <th className="text-left py-3 px-3 bg-[#AEE3E1]/15 font-semibold text-[#2E3A59]">{t("pages.orderOfTheDraw.capColor")}</th>
                        <th className="text-left py-3 px-3 bg-[#FFD6A5]/15 font-semibold text-[#2E3A59]">{t("pages.orderOfTheDraw.tubeName")}</th>
                        <th className="text-left py-3 px-3 bg-[#FFF3B0]/15 font-semibold text-[#2E3A59]">{t("pages.orderOfTheDraw.additive2")}</th>
                        <th className="text-left py-3 px-3 bg-[#BFA6F6]/10 rounded-tr-lg font-semibold text-[#2E3A59]">{t("pages.orderOfTheDraw.keyTests")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TUBES.map((tube, idx) => (
                        <tr key={tube.order} className={idx % 2 === 0 ? "bg-gray-50/50" : ""}>
                          <td className="py-3 px-3 font-bold text-[#2E3A59]">{tube.order}</td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: tube.capColor }} />
                              <span>{tube.capLabel}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-medium">{tube.name}</td>
                          <td className="py-3 px-3 text-gray-600">{tube.additive}</td>
                          <td className="py-3 px-3 text-gray-600">{tube.commonTests.slice(0, 3).join(", ")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm mt-4" data-testid="card-contamination-risks">
              <CardContent className="py-5">
                <h3 className="text-lg font-bold text-[#2E3A59] mb-3">{t("pages.orderOfTheDraw.contaminationRiskMatrix")}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  What happens when the wrong tube is drawn out of order:
                </p>
                <div className="space-y-2 text-sm">
                  {[
                    { from: "EDTA (Lavender)", to: "Chemistry (Gold)", effect: "Falsely LOW calcium, falsely HIGH potassium" },
                    { from: "Heparin (Green)", to: "Coagulation (Blue)", effect: "Falsely PROLONGED PT/PTT" },
                    { from: "Fluoride/Oxalate (Gray)", to: "Chemistry (Gold)", effect: "Falsely HIGH potassium, enzyme inhibition" },
                    { from: "Clot Activator (Red/Gold)", to: "Coagulation (Blue)", effect: "Falsely SHORTENED clotting times" },
                    { from: "Any additive", to: "Blood Cultures", effect: "False negative cultures, missed sepsis" },
                  ].map((risk, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-red-50/50 border border-red-100">
                      <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-[#2E3A59]">{risk.from}</span>
                        <span className="text-gray-400 mx-2">{t("pages.orderOfTheDraw.contaminates")}</span>
                        <span className="font-medium text-[#2E3A59]">{risk.to}</span>
                        <span className="text-gray-400 mx-2">{t("pages.orderOfTheDraw.causes")}</span>
                        <span className="text-red-700 font-medium">{risk.effect}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz">
            <QuizSection />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
