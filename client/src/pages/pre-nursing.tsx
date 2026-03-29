import { getAssetUrl } from "@/lib/asset-url";
import { useState, useEffect, useCallback, useRef } from "react";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { AdminEditButton } from "@/components/admin-edit-button";
import { Footer } from "@/components/footer";
import { useI18n } from "@/lib/i18n";
import { LocaleLink } from "@/lib/LocaleLink";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AdminImageOverlay, useSiteImages } from "@/components/admin-image-overlay";
import { RichTextEditor, RichTextDisplay } from "@/components/rich-text-editor";
import { StudyNotes } from "@/components/study-notes";
import { ModuleEditContext, useModuleEdit, EditableModuleText, type SectionOverride, type ModuleEditContextType } from "@/components/module-edit-context";
import {
  AnatomyLabeling,
  MatchingExercise,
  SelfCheckQuiz,
  StepSequencing,
  ProgressiveReveal,
  SpotAbnormality,
  MicroLesson,
  CognitiveCard,
  HoverReveal,
} from "@/components/interactive-learning";
import {
  cellLabels,
  HeartSVG,
  heartLabels,
  LungsSVG,
  lungLabels,
  KidneySVG,
  kidneyLabels,
} from "@/components/anatomy-diagrams";
import {
  Dna,
  Activity,
  BookOpen,
  Pill,
  Stethoscope,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Heart,
  Brain,
  Droplets,
  Wind,
  Sparkles,
  GraduationCap,
  Lightbulb,
  Beaker,
  FlaskConical,
  Target,
  Layers,
  Pencil,
  Save,
  Wand2,
  Loader2,
  Plus,
  Trash2,
  X,
  Upload,
  ImagePlus,
  Camera,
  Flame,
  AlertTriangle,
  Microscope,
  Building2,
  FileText,
  ShieldAlert,
  Zap,
  UtensilsCrossed,
  Users,
} from "lucide-react";
import { useLocation } from "wouter";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { ScienceFoundationsModule } from "@/data/pre-nursing-science";
import { ResearchStatisticsModule } from "@/data/pre-nursing-research";
import { AnatomyPhysiologyModule } from "@/data/pre-nursing-anatomy";
import { MedicalTerminologyModule } from "@/data/pre-nursing-terminology";
import { ChemistryModule } from "@/data/pre-nursing-chemistry";
import { MicrobiologyModule } from "@/data/pre-nursing-microbiology";
import { InfectionControlModule } from "@/data/pre-nursing-infection-control";
import { FluidsElectrolytesModule } from "@/data/pre-nursing-fluids-electrolytes";
import { CommunicationModule } from "@/data/pre-nursing-communication";
import { EthicsLegalModule } from "@/data/pre-nursing-ethics-legal";
import { StudyStrategiesModule } from "@/data/pre-nursing-study-strategies";
import { HealthAssessmentModule } from "@/data/pre-nursing-health-assessment";
import { NutritionFoundationsModule } from "@/data/pre-nursing-nutrition-foundations";
import { CulturalCompetencyModule } from "@/data/pre-nursing-cultural-competency";
import { InflammationModule } from "@/data/pre-nursing-inflammation";
import { CellularInjuryModule } from "@/data/pre-nursing-cellular-injury";
import { OxygenationModule } from "@/data/pre-nursing-oxygenation";
import { DiagnosticsModule } from "@/data/pre-nursing-diagnostics";
import { HealthcareStructureModule } from "@/data/pre-nursing-healthcare-structure";
import { ResearchReadingModule } from "@/data/pre-nursing-research-reading";
import { HumanFactorsModule } from "@/data/pre-nursing-human-factors";
import { ATPPathwayModule } from "@/data/pre-nursing-atp-pathway";

const cellStructureImage = getAssetUrl("cell-structure-diagram.png");
const organelleMitochondria = getAssetUrl("organelle-mitochondria.png");
const organelleNucleus = getAssetUrl("organelle-nucleus.png");
const organelleGolgi = getAssetUrl("organelle-golgi.png");
const organelleRoughER = getAssetUrl("organelle-rough-er.png");
const organelleCellMembrane = getAssetUrl("organelle-cell-membrane.png");
const organelleLysosome = getAssetUrl("organelle-lysosome.png");
const transportPassive = getAssetUrl("transport-passive.png");
const transportActive = getAssetUrl("transport-active.png");
const heartAnatomyImage = getAssetUrl("heart-anatomy.png");
const lungsAnatomyImage = getAssetUrl("lungs-anatomy.png");
const feedbackLoopImage = getAssetUrl("feedback-loop.png");
const fluidCompartmentsImage = getAssetUrl("fluid-compartments.png");
const brainAnatomyImage = getAssetUrl("brain-anatomy.png");
const kidneyAnatomyImage = getAssetUrl("kidney-anatomy.png");
const imgCellBiology = getAssetUrl("prenursing-cell-biology.png");
const imgPhysiology = getAssetUrl("prenursing-physiology.png");
const imgTerminology = getAssetUrl("prenursing-terminology.png");
const imgPharmacology = getAssetUrl("prenursing-pharmacology.png");
const imgPharmAbsorption = getAssetUrl("pharm-absorption-routes.png");
const imgPharmPK = getAssetUrl("pharm-pharmacokinetics.png");
const imgPathophysiology = getAssetUrl("prenursing-pathophysiology.png");
const imgScienceFoundations = getAssetUrl("prenursing-science-foundations.png");
const imgAnatomyPhysiology = getAssetUrl("prenursing-anatomy-physiology.png");
const imgResearchStatistics = getAssetUrl("prenursing-research-statistics.png");
const imgMedicalTerminology = getAssetUrl("prenursing-medical-terminology.png");
const imgChemistry = getAssetUrl("prenursing-chemistry.png");
const imgMicrobiology = getAssetUrl("prenursing-microbiology.png");
const imgInfectionControl = getAssetUrl("prenursing-infection-control.png");
const imgFluidsElectrolytes = getAssetUrl("prenursing-fluids-electrolytes.png");
const imgCommunication = getAssetUrl("prenursing-communication.png");
const imgEthicsLegal = getAssetUrl("prenursing-ethics-legal.png");
const imgStudyStrategies = getAssetUrl("prenursing-study-strategies.png");
const imgHealthAssessment = getAssetUrl("prenursing-health-assessment.png");
const imgNutrition = getAssetUrl("prenursing-nutrition.png");
const imgCulturalCompetency = getAssetUrl("prenursing-cultural-competency.png");
const imgInflammation = getAssetUrl("prenursing-inflammation.png");
const imgCellularInjury = getAssetUrl("prenursing-cellular-injury.png");
const imgOxygenation = getAssetUrl("prenursing-oxygenation.png");
const imgDiagnostics = getAssetUrl("prenursing-diagnostics.png");
const imgHealthcareStructure = getAssetUrl("prenursing-healthcare-structure.png");
const imgResearchReading = getAssetUrl("prenursing-research-reading.png");
const imgHumanFactors = getAssetUrl("prenursing-human-factors.png");
const imgAtpPathway = getAssetUrl("prenursing-atp-pathway.png");


function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

type ModuleId = "cell-biology" | "physiology" | "terminology" | "pharmacology" | "pathophysiology" | "science-foundations" | "anatomy-physiology" | "research-statistics" | "medical-terminology" | "chemistry" | "microbiology" | "infection-control" | "fluids-electrolytes" | "communication" | "ethics-legal" | "study-strategies" | "health-assessment" | "nutrition-foundations" | "cultural-competency" | "inflammation" | "cellular-injury" | "oxygenation" | "diagnostics" | "healthcare-structure" | "research-reading" | "human-factors" | "atp-pathway";

const modules: {
  id: ModuleId;
  titleKey: string;
  subtitleKey: string;
  icon: any;
  color: string;
  bg: string;
  lessons: number;
  image: string;
}[] = [
  {
    id: "study-strategies",
    titleKey: "preNursing.mod.studyStrategies",
    subtitleKey: "preNursing.mod.studyStrategiesDesc",
    icon: Brain,
    color: "text-pink-600",
    bg: "bg-pink-50",
    lessons: 4,
    image: imgStudyStrategies,
  },
  {
    id: "terminology",
    titleKey: "preNursing.mod.terminology",
    subtitleKey: "preNursing.mod.terminologyDesc",
    icon: BookOpen,
    color: "text-purple-600",
    bg: "bg-purple-50",
    lessons: 3,
    image: imgTerminology,
  },
  {
    id: "medical-terminology",
    titleKey: "preNursing.mod.medicalTerminology",
    subtitleKey: "preNursing.mod.medicalTerminologyDesc",
    icon: BookOpen,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    lessons: 4,
    image: imgMedicalTerminology,
  },
  {
    id: "chemistry",
    titleKey: "preNursing.mod.chemistry",
    subtitleKey: "preNursing.mod.chemistryDesc",
    icon: Beaker,
    color: "text-orange-600",
    bg: "bg-orange-50",
    lessons: 4,
    image: imgChemistry,
  },
  {
    id: "cell-biology",
    titleKey: "preNursing.mod.cellBiology",
    subtitleKey: "preNursing.mod.cellBiologyDesc",
    icon: Dna,
    color: "text-blue-600",
    bg: "bg-blue-50",
    lessons: 4,
    image: imgCellBiology,
  },
  {
    id: "science-foundations",
    titleKey: "preNursing.mod.scienceFoundations",
    subtitleKey: "preNursing.mod.scienceFoundationsDesc",
    icon: FlaskConical,
    color: "text-teal-600",
    bg: "bg-teal-50/80",
    lessons: 6,
    image: imgScienceFoundations,
  },
  {
    id: "microbiology",
    titleKey: "preNursing.mod.microbiology",
    subtitleKey: "preNursing.mod.microbiologyDesc",
    icon: Sparkles,
    color: "text-lime-600",
    bg: "bg-lime-50",
    lessons: 4,
    image: imgMicrobiology,
  },
  {
    id: "anatomy-physiology",
    titleKey: "preNursing.mod.anatomyPhysiology",
    subtitleKey: "preNursing.mod.anatomyPhysiologyDesc",
    icon: Heart,
    color: "text-red-600",
    bg: "bg-red-50",
    lessons: 7,
    image: imgAnatomyPhysiology,
  },
  {
    id: "physiology",
    titleKey: "preNursing.mod.physiology",
    subtitleKey: "preNursing.mod.physiologyDesc",
    icon: Activity,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    lessons: 4,
    image: imgPhysiology,
  },
  {
    id: "pathophysiology",
    titleKey: "preNursing.mod.pathophysiology",
    subtitleKey: "preNursing.mod.pathophysiologyDesc",
    icon: Stethoscope,
    color: "text-rose-600",
    bg: "bg-rose-50/80",
    lessons: 3,
    image: imgPathophysiology,
  },
  {
    id: "infection-control",
    titleKey: "preNursing.mod.infectionControl",
    subtitleKey: "preNursing.mod.infectionControlDesc",
    icon: Target,
    color: "text-rose-600",
    bg: "bg-rose-50",
    lessons: 4,
    image: imgInfectionControl,
  },
  {
    id: "fluids-electrolytes",
    titleKey: "preNursing.mod.fluidsElectrolytes",
    subtitleKey: "preNursing.mod.fluidsElectrolytesDesc",
    icon: Droplets,
    color: "text-sky-600",
    bg: "bg-sky-50",
    lessons: 4,
    image: imgFluidsElectrolytes,
  },
  {
    id: "pharmacology",
    titleKey: "preNursing.mod.pharmacology",
    subtitleKey: "preNursing.mod.pharmacologyDesc",
    icon: Pill,
    color: "text-amber-600",
    bg: "bg-amber-50",
    lessons: 3,
    image: imgPharmacology,
  },
  {
    id: "communication",
    titleKey: "preNursing.mod.communication",
    subtitleKey: "preNursing.mod.communicationDesc",
    icon: Layers,
    color: "text-violet-600",
    bg: "bg-violet-50",
    lessons: 4,
    image: imgCommunication,
  },
  {
    id: "ethics-legal",
    titleKey: "preNursing.mod.ethicsLegal",
    subtitleKey: "preNursing.mod.ethicsLegalDesc",
    icon: Lightbulb,
    color: "text-amber-600",
    bg: "bg-amber-50",
    lessons: 4,
    image: imgEthicsLegal,
  },
  {
    id: "research-statistics",
    titleKey: "preNursing.mod.researchStatistics",
    subtitleKey: "preNursing.mod.researchStatisticsDesc",
    icon: GraduationCap,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    lessons: 5,
    image: imgResearchStatistics,
  },
  {
    id: "health-assessment",
    titleKey: "preNursing.mod.healthAssessment",
    subtitleKey: "preNursing.mod.healthAssessmentDesc",
    icon: Stethoscope,
    color: "text-teal-600",
    bg: "bg-teal-50",
    lessons: 4,
    image: imgHealthAssessment,
  },
  {
    id: "nutrition-foundations",
    titleKey: "preNursing.mod.nutritionFoundations",
    subtitleKey: "preNursing.mod.nutritionFoundationsDesc",
    icon: UtensilsCrossed,
    color: "text-green-600",
    bg: "bg-green-50",
    lessons: 4,
    image: imgNutrition,
  },
  {
    id: "cultural-competency",
    titleKey: "preNursing.mod.culturalCompetency",
    subtitleKey: "preNursing.mod.culturalCompetencyDesc",
    icon: Users,
    color: "text-purple-600",
    bg: "bg-purple-50",
    lessons: 4,
    image: imgCulturalCompetency,
  },
  {
    id: "inflammation",
    titleKey: "preNursing.mod.inflammation",
    subtitleKey: "preNursing.mod.inflammationDesc",
    icon: Flame,
    color: "text-orange-600",
    bg: "bg-orange-50",
    lessons: 4,
    image: imgInflammation,
  },
  {
    id: "cellular-injury",
    titleKey: "preNursing.mod.cellularInjury",
    subtitleKey: "preNursing.mod.cellularInjuryDesc",
    icon: AlertTriangle,
    color: "text-red-600",
    bg: "bg-red-50",
    lessons: 5,
    image: imgCellularInjury,
  },
  {
    id: "oxygenation",
    titleKey: "preNursing.mod.oxygenation",
    subtitleKey: "preNursing.mod.oxygenationDesc",
    icon: Wind,
    color: "text-sky-600",
    bg: "bg-sky-50",
    lessons: 5,
    image: imgOxygenation,
  },
  {
    id: "diagnostics",
    titleKey: "preNursing.mod.diagnostics",
    subtitleKey: "preNursing.mod.diagnosticsDesc",
    icon: Microscope,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    lessons: 4,
    image: imgDiagnostics,
  },
  {
    id: "healthcare-structure",
    titleKey: "preNursing.mod.healthcareStructure",
    subtitleKey: "preNursing.mod.healthcareStructureDesc",
    icon: Building2,
    color: "text-slate-600",
    bg: "bg-slate-50",
    lessons: 4,
    image: imgHealthcareStructure,
  },
  {
    id: "research-reading",
    titleKey: "preNursing.mod.researchReading",
    subtitleKey: "preNursing.mod.researchReadingDesc",
    icon: FileText,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    lessons: 4,
    image: imgResearchReading,
  },
  {
    id: "human-factors",
    titleKey: "preNursing.mod.humanFactors",
    subtitleKey: "preNursing.mod.humanFactorsDesc",
    icon: ShieldAlert,
    color: "text-amber-600",
    bg: "bg-amber-50",
    lessons: 4,
    image: imgHumanFactors,
  },
  {
    id: "atp-pathway",
    titleKey: "preNursing.mod.atpPathway",
    subtitleKey: "preNursing.mod.atpPathwayDesc",
    icon: Zap,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    lessons: 5,
    image: imgAtpPathway,
  },
];

const cellBiologyQuiz: import("@/components/interactive-learning").QuizQuestion[] = [
  {
    id: "cb1",
    question: "Which organelle is primarily responsible for ATP production?",
    options: ["Golgi apparatus", "Mitochondria", "Lysosome", "Ribosome"],
    correctIndex: 1,
    rationale: "Mitochondria are the 'powerhouse of the cell': they produce ATP through oxidative phosphorylation and the electron transport chain.",
    hint: "Think about which organelle has its own DNA and a double membrane.",
  },
  {
    id: "cb2",
    question: "A red blood cell placed in a hypotonic solution will:",
    options: ["Shrink (crenation)", "Swell and possibly lyse", "Stay the same size", "Lose its nucleus"],
    correctIndex: 1,
    rationale: "In a hypotonic solution, water moves INTO the cell by osmosis because solute concentration is lower outside. The RBC swells and may burst (hemolysis).",
    hint: "Water follows solute: 'water chases salt.'",
  },
  {
    id: "cb3",
    question: "Which type of transport requires ATP?",
    options: ["Osmosis", "Facilitated diffusion", "Sodium-potassium pump", "Simple diffusion"],
    correctIndex: 2,
    rationale: "The Na+/K+ ATPase is an active transport pump that moves 3 Na+ out and 2 K+ in against their concentration gradients, requiring ATP.",
  },
  {
    id: "cb4",
    question: "The cell membrane is best described as:",
    options: ["Rigid protein wall", "Phospholipid bilayer with embedded proteins", "Single layer of lipids", "Carbohydrate mesh"],
    correctIndex: 1,
    rationale: "The fluid mosaic model describes the cell membrane as a phospholipid bilayer with embedded and peripheral proteins, cholesterol, and glycoproteins.",
  },
  {
    id: "cb5",
    question: "Which organelle is responsible for modifying, sorting, and packaging proteins for secretion?",
    options: ["Rough endoplasmic reticulum", "Smooth endoplasmic reticulum", "Golgi apparatus", "Lysosome"],
    correctIndex: 2,
    rationale: "The Golgi apparatus receives proteins from the ER, performs post-translational modifications (glycosylation, phosphorylation), and sorts them into vesicles for secretion, lysosomal targeting, or membrane insertion.",
    hint: "Think of the 'post office' of the cell.",
  },
  {
    id: "cb6",
    question: "Facilitated diffusion differs from simple diffusion because it:",
    options: ["Requires ATP", "Moves solutes against the concentration gradient", "Uses carrier or channel proteins", "Only transports water"],
    correctIndex: 2,
    rationale: "Facilitated diffusion is passive transport (no ATP needed) that uses integral membrane proteins (channels or carriers) to move molecules down their concentration gradient. Glucose enters cells via GLUT transporters this way.",
  },
  {
    id: "cb7",
    question: "When a cell is placed in a hypertonic solution, it will:",
    options: ["Swell and burst", "Remain unchanged", "Shrink (crenate)", "Divide rapidly"],
    correctIndex: 2,
    rationale: "In a hypertonic solution, the solute concentration outside the cell is higher, so water moves OUT of the cell by osmosis, causing the cell to shrink (crenation in RBCs). Clinically, hypertonic IV solutions draw fluid from cells.",
    hint: "Remember: water always moves toward higher solute concentration.",
  },
  {
    id: "cb8",
    question: "During which phase of the cell cycle does DNA replication occur?",
    options: ["G1 phase", "S phase", "G2 phase", "M phase"],
    correctIndex: 1,
    rationale: "The S (synthesis) phase is when each chromosome is replicated, producing two sister chromatids joined at the centromere. This ensures each daughter cell receives a complete copy of the genome after mitosis.",
  },
  {
    id: "cb9",
    question: "The key difference between mitosis and meiosis is that meiosis:",
    options: ["Produces identical daughter cells", "Results in 4 haploid cells", "Occurs in somatic cells only", "Has only one division"],
    correctIndex: 1,
    rationale: "Meiosis involves two rounds of division (meiosis I and II) and produces 4 genetically unique haploid cells (gametes). Mitosis produces 2 identical diploid cells. Crossing over during meiosis I creates genetic diversity.",
    hint: "Think about what type of cells are needed for reproduction.",
  },
  {
    id: "cb10",
    question: "Which molecule carries the genetic code from the nucleus to the ribosome for protein synthesis?",
    options: ["DNA", "tRNA", "mRNA", "rRNA"],
    correctIndex: 2,
    rationale: "Messenger RNA (mRNA) is transcribed from DNA in the nucleus and carries the genetic code to ribosomes in the cytoplasm. There, tRNA brings amino acids and rRNA forms the ribosomal structure for translation.",
    hint: "The 'm' stands for the role this molecule plays in gene expression.",
  },
];

const physiologySequence: import("@/components/interactive-learning").SequenceStep[] = [
  { id: "s1", text: "Body temperature rises above set point", order: 1 },
  { id: "s2", text: "Thermoreceptors detect the change", order: 2 },
  { id: "s3", text: "Hypothalamus (control center) receives signal", order: 3 },
  { id: "s4", text: "Effectors activated: vasodilation + sweating", order: 4 },
  { id: "s5", text: "Body temperature decreases toward set point", order: 5 },
  { id: "s6", text: "Negative feedback stops the response", order: 6 },
];

const terminologyPairs: import("@/components/interactive-learning").MatchPair[] = [
  { id: "t1", term: "Tachy-", definition: "Fast / rapid" },
  { id: "t2", term: "Brady-", definition: "Slow" },
  { id: "t3", term: "-emia", definition: "Blood condition" },
  { id: "t4", term: "Hyper-", definition: "Above normal / excessive" },
  { id: "t5", term: "-itis", definition: "Inflammation" },
  { id: "t6", term: "Dys-", definition: "Difficult / abnormal" },
  { id: "t7", term: "-ectomy", definition: "Surgical removal" },
  { id: "t8", term: "Hemo-", definition: "Blood" },
];

const pharmQuiz: import("@/components/interactive-learning").QuizQuestion[] = [
  {
    id: "p1",
    question: "An AGONIST drug at a receptor will:",
    options: ["Block the receptor", "Bind and activate the receptor", "Destroy the receptor", "Have no effect"],
    correctIndex: 1,
    rationale: "An agonist binds to and activates a receptor, mimicking the effect of the natural ligand. Example: morphine is an agonist at opioid receptors.",
  },
  {
    id: "p2",
    question: "A drug with a half-life of 6 hours is given at 0800. Approximately what percentage remains at 2000?",
    options: ["75%", "50%", "25%", "12.5%"],
    correctIndex: 2,
    rationale: "From 0800 to 2000 is 12 hours = 2 half-lives. After 1 half-life (6h): 50% remains. After 2 half-lives (12h): 25% remains.",
    hint: "Each half-life reduces the drug by 50%. Count the half-lives.",
  },
  {
    id: "p3",
    question: "Which factor INCREASES the risk of drug toxicity?",
    options: ["High protein binding", "Fast renal clearance", "Decreased liver function", "Large volume of distribution"],
    correctIndex: 2,
    rationale: "The liver metabolizes most drugs. When liver function decreases, drug metabolism slows, causing accumulation and potential toxicity.",
  },
  {
    id: "p4",
    question: "Which route of drug administration has the fastest onset of action?",
    options: ["Oral", "Subcutaneous", "Intravenous", "Intramuscular"],
    correctIndex: 2,
    rationale: "IV administration delivers the drug directly into the bloodstream, bypassing absorption entirely. This provides 100% bioavailability and the fastest onset, which is why it is used in emergencies.",
    hint: "Which route skips the absorption phase entirely?",
  },
  {
    id: "p5",
    question: "A drug that is highly protein-bound will:",
    options: ["Be excreted faster by the kidneys", "Have more free drug available for action", "Have less free drug available for action", "Cross the blood-brain barrier more easily"],
    correctIndex: 2,
    rationale: "When a drug binds to plasma proteins (mainly albumin), only the unbound (free) fraction is pharmacologically active. High protein binding means less free drug is available, creating a reservoir effect and prolonging duration.",
  },
  {
    id: "p6",
    question: "The primary organ responsible for drug metabolism (biotransformation) is the:",
    options: ["Kidneys", "Lungs", "Liver", "Spleen"],
    correctIndex: 2,
    rationale: "The liver is the primary site of drug metabolism, using cytochrome P450 enzymes to convert lipophilic drugs into more water-soluble metabolites for renal excretion. Phase I reactions (oxidation, reduction) and Phase II reactions (conjugation) occur here.",
  },
  {
    id: "p7",
    question: "The primary route of drug excretion for most medications is through the:",
    options: ["Liver via bile", "Lungs via exhalation", "Kidneys via urine", "Skin via sweat"],
    correctIndex: 2,
    rationale: "The kidneys are the primary route of drug excretion. Water-soluble drug metabolites are filtered at the glomerulus and excreted in urine. Impaired renal function requires dose adjustments to prevent accumulation.",
    hint: "This is why renal function (GFR/creatinine) is checked before many medications.",
  },
  {
    id: "p8",
    question: "An ANTAGONIST drug at a receptor will:",
    options: ["Activate the receptor and produce a response", "Block the receptor and prevent activation", "Permanently destroy the receptor", "Increase receptor sensitivity"],
    correctIndex: 1,
    rationale: "An antagonist binds to a receptor but does NOT activate it. Instead, it blocks the natural ligand or agonist from binding. Example: naloxone is an opioid antagonist that reverses opioid effects by blocking opioid receptors.",
  },
  {
    id: "p9",
    question: "A drug with a NARROW therapeutic index means:",
    options: ["It is very safe with a wide dosing range", "The toxic dose is close to the therapeutic dose", "It can only be given intravenously", "It has no side effects"],
    correctIndex: 1,
    rationale: "A narrow therapeutic index means there is a small margin between the dose that produces therapeutic effects and the dose that causes toxicity. Examples include digoxin, lithium, warfarin, and aminoglycosides. These drugs require close monitoring of drug levels.",
    hint: "Think of drugs that require frequent blood level monitoring.",
  },
  {
    id: "p10",
    question: "An adverse drug reaction that is predictable and dose-dependent is classified as:",
    options: ["Type A (augmented)", "Type B (bizarre/idiosyncratic)", "Type C (chronic)", "Type D (delayed)"],
    correctIndex: 0,
    rationale: "Type A reactions are predictable, dose-dependent extensions of a drug's pharmacological action. They are the most common adverse reactions (e.g., hypotension from antihypertensives, bleeding from anticoagulants). Type B reactions are unpredictable and not dose-dependent (e.g., anaphylaxis, idiosyncratic reactions).",
  },
];

const preNursingComprehensiveQuiz: import("@/components/interactive-learning").QuizQuestion[] = [
  {
    id: "pnc1",
    question: "Which organelle contains its own DNA and is inherited exclusively from the mother?",
    options: ["Nucleus", "Golgi apparatus", "Mitochondria", "Ribosome"],
    correctIndex: 2,
    rationale: "Mitochondria have their own circular DNA (mtDNA) that is maternally inherited. Mitochondrial DNA mutations can cause diseases like MELAS syndrome and Leber hereditary optic neuropathy.",
  },
  {
    id: "pnc2",
    question: "Endocytosis is a process by which cells:",
    options: ["Release molecules outside the cell", "Take in substances by engulfing them in membrane vesicles", "Produce ATP", "Replicate DNA"],
    correctIndex: 1,
    rationale: "Endocytosis is active transport where the cell membrane invaginates to engulf extracellular material, forming intracellular vesicles. Types include phagocytosis (cell eating), pinocytosis (cell drinking), and receptor-mediated endocytosis.",
  },
  {
    id: "pnc3",
    question: "Homeostasis is best defined as:",
    options: ["A constant, unchanging internal state", "The body's ability to maintain a stable internal environment despite external changes", "The process of cell division", "The breakdown of nutrients for energy"],
    correctIndex: 1,
    rationale: "Homeostasis is the dynamic process of maintaining relatively stable internal conditions (temperature, pH, blood glucose, etc.) through feedback mechanisms, despite constantly changing external environments.",
    hint: "It's about balance and regulation, not rigidity.",
  },
  {
    id: "pnc4",
    question: "A negative feedback loop functions by:",
    options: ["Amplifying the original stimulus", "Reversing the direction of the stimulus to restore balance", "Maintaining the stimulus indefinitely", "Shutting down all body systems"],
    correctIndex: 1,
    rationale: "Negative feedback opposes the initial change to restore homeostasis. Example: when body temperature rises, sweating and vasodilation cool the body back toward the set point. Most physiological processes use negative feedback.",
  },
  {
    id: "pnc5",
    question: "An example of a positive feedback loop in the body is:",
    options: ["Blood glucose regulation by insulin", "Thermoregulation during fever", "Oxytocin release during labor contractions", "Blood pressure regulation by baroreceptors"],
    correctIndex: 2,
    rationale: "Oxytocin during labor is a classic positive feedback example: contractions stimulate oxytocin release, which intensifies contractions, releasing more oxytocin, until delivery occurs. Positive feedback amplifies the stimulus.",
  },
  {
    id: "pnc6",
    question: "The prefix 'hypo-' means:",
    options: ["Above normal", "Below normal", "Around", "Within"],
    correctIndex: 1,
    rationale: "The prefix 'hypo-' means below normal, under, or deficient. Examples: hypothermia (low body temperature), hypoglycemia (low blood glucose), hypothyroidism (underactive thyroid).",
  },
  {
    id: "pnc7",
    question: "The suffix '-osis' typically indicates:",
    options: ["Inflammation", "An abnormal condition or disease", "Surgical removal", "Pain"],
    correctIndex: 1,
    rationale: "The suffix '-osis' indicates an abnormal condition, disease state, or increase. Examples: cyanosis (blue discoloration), stenosis (narrowing), nephrosis (kidney disease), fibrosis (excessive fibrous tissue).",
  },
  {
    id: "pnc8",
    question: "The term 'tachypnea' means:",
    options: ["Slow heart rate", "Rapid breathing", "Difficulty breathing", "Absence of breathing"],
    correctIndex: 1,
    rationale: "Tachypnea breaks down as: tachy- (rapid/fast) + -pnea (breathing). Normal adult respiratory rate is 12-20 breaths/min. Tachypnea (>20/min) can indicate respiratory distress, fever, pain, or metabolic acidosis.",
    hint: "Break the word into its prefix and suffix.",
  },
  {
    id: "pnc9",
    question: "The root word 'cardi-' refers to which organ?",
    options: ["Brain", "Liver", "Heart", "Lung"],
    correctIndex: 2,
    rationale: "The root 'cardi-' or 'cardio-' refers to the heart. Examples: cardiology (study of the heart), cardiomegaly (enlarged heart), cardiomyopathy (disease of heart muscle), tachycardia (fast heart rate).",
  },
  {
    id: "pnc10",
    question: "The term 'bioavailability' in pharmacology refers to:",
    options: ["How quickly a drug is metabolized", "The fraction of administered drug that reaches systemic circulation unchanged", "The total amount of drug in a tablet", "How long a drug stays in the body"],
    correctIndex: 1,
    rationale: "Bioavailability is the percentage of an administered drug dose that reaches systemic circulation in its active form. IV drugs have 100% bioavailability. Oral drugs have lower bioavailability due to first-pass metabolism in the liver.",
  },
  {
    id: "pnc11",
    question: "First-pass metabolism occurs primarily in the:",
    options: ["Kidneys", "Lungs", "Liver", "Stomach"],
    correctIndex: 2,
    rationale: "First-pass (presystemic) metabolism occurs when orally administered drugs are absorbed from the GI tract and pass through the portal vein to the liver before reaching systemic circulation. The liver metabolizes a significant portion, reducing bioavailability.",
    hint: "Oral drugs must pass through this organ before reaching the rest of the body.",
  },
  {
    id: "pnc12",
    question: "A patient with a pH of 7.30 and a PaCO2 of 55 mmHg is likely experiencing:",
    options: ["Respiratory alkalosis", "Metabolic acidosis", "Respiratory acidosis", "Metabolic alkalosis"],
    correctIndex: 2,
    rationale: "pH < 7.35 = acidosis. Elevated PaCO2 (>45 mmHg) indicates CO2 retention, meaning the respiratory system is the cause. This is respiratory acidosis, seen in conditions like COPD exacerbation, respiratory depression, or airway obstruction.",
    hint: "Look at which value (CO2 or HCO3) explains the pH change.",
  },
  {
    id: "pnc13",
    question: "Inflammation is characterized by which five cardinal signs?",
    options: ["Fever, chills, fatigue, malaise, weight loss", "Redness, heat, swelling, pain, loss of function", "Cough, sputum, dyspnea, tachycardia, cyanosis", "Nausea, vomiting, diarrhea, anorexia, abdominal pain"],
    correctIndex: 1,
    rationale: "The five cardinal signs of inflammation are: rubor (redness), calor (heat), tumor (swelling), dolor (pain), and functio laesa (loss of function). These result from increased blood flow, vascular permeability, and chemical mediator release.",
  },
  {
    id: "pnc14",
    question: "Apoptosis differs from necrosis in that apoptosis is:",
    options: ["Uncontrolled cell death from injury", "Programmed, orderly cell death", "Caused exclusively by infection", "Always pathological"],
    correctIndex: 1,
    rationale: "Apoptosis is programmed cell death — an orderly, energy-dependent process where cells shrink, fragment, and are phagocytosed without triggering inflammation. Necrosis is uncontrolled cell death from injury, causing cell swelling, membrane rupture, and inflammatory response.",
  },
  {
    id: "pnc15",
    question: "Which type of immunity develops after receiving a vaccine?",
    options: ["Natural passive immunity", "Artificial active immunity", "Natural active immunity", "Artificial passive immunity"],
    correctIndex: 1,
    rationale: "Vaccines provide artificial active immunity by exposing the immune system to an antigen (weakened, killed, or component of a pathogen), stimulating the body to produce its own antibodies and memory cells for long-term protection.",
  },
  {
    id: "pnc16",
    question: "The suffix '-ectomy' means:",
    options: ["Inflammation of", "Surgical removal of", "Examination of", "Disease of"],
    correctIndex: 1,
    rationale: "The suffix '-ectomy' means surgical removal or excision. Examples: appendectomy (removal of appendix), cholecystectomy (removal of gallbladder), mastectomy (removal of breast), nephrectomy (removal of kidney).",
  },
  {
    id: "pnc17",
    question: "Osmosis is the movement of:",
    options: ["Solute from high to low concentration", "Water across a semipermeable membrane toward higher solute concentration", "Gases from high to low pressure", "Ions through protein channels"],
    correctIndex: 1,
    rationale: "Osmosis is the passive movement of water (solvent) across a semipermeable membrane from an area of lower solute concentration to an area of higher solute concentration, equalizing concentrations on both sides.",
    hint: "Remember: 'water follows salt.'",
  },
  {
    id: "pnc18",
    question: "Which compensatory mechanism is activated FIRST when cardiac output drops?",
    options: ["Renal compensation (fluid retention)", "Sympathetic nervous system activation", "Hormonal response (RAAS)", "Cellular adaptation"],
    correctIndex: 1,
    rationale: "The sympathetic nervous system is the fastest compensatory response (seconds). Baroreceptors detect decreased blood pressure and trigger release of norepinephrine and epinephrine, causing tachycardia and vasoconstriction to maintain perfusion.",
  },
  {
    id: "pnc19",
    question: "A drug's 'volume of distribution' (Vd) describes:",
    options: ["How much drug is in each tablet", "The theoretical volume needed to contain the total drug at plasma concentration", "The rate of drug elimination", "The organ that metabolizes the drug"],
    correctIndex: 1,
    rationale: "Volume of distribution (Vd) is a pharmacokinetic parameter that relates the total amount of drug in the body to its plasma concentration. A large Vd means the drug distributes extensively into tissues; a small Vd means it stays mostly in the plasma.",
  },
  {
    id: "pnc20",
    question: "Hypoxia at the cellular level primarily impairs which organelle's function?",
    options: ["Golgi apparatus", "Nucleus", "Mitochondria", "Ribosomes"],
    correctIndex: 2,
    rationale: "Cellular hypoxia directly impairs mitochondrial function because oxidative phosphorylation requires oxygen as the final electron acceptor. Without oxygen, ATP production drops dramatically, forcing cells to rely on anaerobic glycolysis, which produces lactic acid and far less ATP.",
    hint: "Which organelle requires oxygen to produce ATP?",
  },
];

const pathoFindings = [
  { id: "f1", text: "Heart rate 110 bpm", isAbnormal: true, explanation: "Tachycardia: a compensatory response to maintain cardiac output when stroke volume falls." },
  { id: "f2", text: "Blood pressure 120/80 mmHg", isAbnormal: false, explanation: "" },
  { id: "f3", text: "Respiratory rate 28/min", isAbnormal: true, explanation: "Tachypnea: the body is attempting to increase oxygen delivery or compensate for metabolic acidosis." },
  { id: "f4", text: "Temperature 37.0°C", isAbnormal: false, explanation: "" },
  { id: "f5", text: "Oxygen saturation 88%", isAbnormal: true, explanation: "Hypoxemia: indicates inadequate oxygenation. Normal SpO2 is 94-100%." },
  { id: "f6", text: "Urine output 15 mL/hr", isAbnormal: true, explanation: "Oliguria: suggests decreased renal perfusion. Normal is >30 mL/hr." },
  { id: "f7", text: "Capillary refill 2 seconds", isAbnormal: false, explanation: "" },
  { id: "f8", text: "Mental status: confused", isAbnormal: true, explanation: "Altered LOC: indicates decreased cerebral perfusion, a late sign of decompensation." },
];

type ModuleOverride = {
  title?: string;
  description?: string;
  supplementalContent?: string[];
  sections?: Record<string, SectionOverride>;
};

function PreNursingModuleEditor({
  moduleId,
  moduleName,
  overrides,
  onSave,
  sectionOverrides,
}: {
  moduleId: string;
  moduleName: string;
  overrides: ModuleOverride;
  onSave: (data: ModuleOverride) => Promise<void>;
  sectionOverrides?: Record<string, SectionOverride>;
}) {
  const [editTitle, setEditTitle] = useState(overrides.title || "");
  const [editDesc, setEditDesc] = useState(overrides.description || "");
  const [editContent, setEditContent] = useState<string[]>(overrides.supplementalContent || []);
  const [saving, setSaving] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    try {
      const data: ModuleOverride = {};
      if (editTitle.trim()) data.title = editTitle;
      if (editDesc.trim()) data.description = editDesc;
      if (editContent.length > 0 && editContent.some((c) => c.trim())) data.supplementalContent = editContent.filter((c) => c.trim());
      if (sectionOverrides && Object.keys(sectionOverrides).length > 0) data.sections = sectionOverrides;
      await onSave(data);
      toast({ title: "Saved", description: `${moduleName} content updated` });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast({ title: "Enter a prompt", description: "Describe what to generate", variant: "destructive" });
      return;
    }
    const creds = JSON.parse(localStorage.getItem("nursenest-credentials") || "{}");
    if (!creds.username) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: creds.username,
          password: creds.password,
          prompt: `For the pre-nursing module "${moduleName}", ${aiPrompt}. Return as JSON: {"paragraphs":["paragraph 1","paragraph 2","paragraph 3"]}. Each paragraph should be educational, detailed, and appropriate for pre-nursing students.`,
          mode: "generate",
        }),
      });
      if (!res.ok) throw new Error("AI generation failed");
      const data = await res.json();
      const blocks = data.blocks || [];
      let found = false;
      const jsonBlock = blocks.find((b: any) => b.content && b.content.includes('"paragraphs"'));
      if (jsonBlock) {
        try {
          const jsonMatch = jsonBlock.content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.paragraphs) {
              setEditContent(parsed.paragraphs);
              found = true;
            }
          }
        } catch {}
      }
      if (!found && blocks.length > 0) {
        const paragraphs = blocks.filter((b: any) => b.type === "paragraph" && b.content).map((b: any) => b.content);
        if (paragraphs.length > 0) {
          setEditContent(paragraphs);
          found = true;
        }
      }
      if (found) {
        toast({ title: "Content Ready", description: "Content generated. Review and save." });
      } else {
        toast({ title: "No content", description: "AI did not return usable content. Try a different prompt.", variant: "destructive" });
      }
      setAiPrompt("");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6 mb-8" data-testid={`editor-prenursing-${moduleId}`}>
      <div className="sticky top-0 z-20 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 text-amber-800 font-medium text-sm">
          <Pencil className="w-4 h-4" />
          Editing: {moduleName}
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1 bg-emerald-600 hover:bg-emerald-700 text-white" data-testid={`button-save-prenursing-${moduleId}`}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-3 text-xl font-bold text-gray-900">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <h2>{t("pages.preNursing.moduleDetails")}</h2>
        </div>
        <Card className="border-none shadow-sm bg-blue-50/40">
          <CardContent className="p-6 space-y-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{t("pages.preNursing.titleOverride")}</p>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder={moduleName}
                className="bg-white"
                data-testid={`input-prenursing-title-${moduleId}`}
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{t("pages.preNursing.descriptionOverride")}</p>
              <Input
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder={t("pages.preNursing.customModuleDescription")}
                className="bg-white"
                data-testid={`input-prenursing-desc-${moduleId}`}
              />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xl font-bold text-gray-900">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-emerald-600" />
            </div>
            <h2>{t("pages.preNursing.supplementalContent")}</h2>
          </div>
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={() => setEditContent([...editContent, ""])} data-testid={`button-add-content-${moduleId}`}>
            <Plus className="w-3 h-3" /> Add Paragraph
          </Button>
        </div>
        <p className="text-sm text-gray-500">{t("pages.preNursing.additionalEducationalContentParagraphsDisplaye")}</p>
        <div className="space-y-4">
          {editContent.map((p, idx) => (
            <div key={idx} className="relative group">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <RichTextEditor
                  value={p}
                  onChange={(v) => {
                    const updated = [...editContent];
                    updated[idx] = v;
                    setEditContent(updated);
                  }}
                  minHeight="100px"
                  placeholder={t("pages.preNursing.educationalContentParagraph")}
                />
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 h-7 w-7 p-0 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setEditContent(editContent.filter((_, i) => i !== idx))}
                data-testid={`button-remove-content-${moduleId}-${idx}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
          {editContent.length === 0 && (
            <div className="bg-white rounded-xl border border-dashed border-gray-200 p-8 text-center">
              <p className="text-sm text-gray-400">{t("pages.preNursing.noSupplementalContentYetClick")}</p>
            </div>
          )}
        </div>
      </section>

      <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-purple-700">
          <Sparkles className="w-4 h-4" />
          AI Content Generation
        </div>
        <div className="flex gap-2">
          <Input
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="e.g. Generate comprehensive content about cell biology for pre-nursing..."
            className="text-sm bg-white"
            onKeyDown={(e) => { if (e.key === "Enter") generateWithAI(); }}
            data-testid={`input-ai-prompt-prenursing-${moduleId}`}
          />
          <Button size="sm" className="gap-1 bg-purple-600 hover:bg-purple-700 shrink-0" onClick={generateWithAI} disabled={aiLoading} data-testid={`button-ai-generate-prenursing-${moduleId}`}>
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            Generate
          </Button>
        </div>
      </div>
    </div>
  );
}

function SupplementalContent({ moduleId }: { moduleId: string }) {
  const [content, setContent] = useState<string[]>([]);

  useEffect(() => {
    fetch(`/api/lesson-overrides/prenursing-${moduleId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.supplementalContent?.length) setContent(data.supplementalContent);
      })
      .catch(() => {});
  }, [moduleId]);

  if (content.length === 0) return null;

  return (
    <div className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-white to-accent-foreground/5 p-5 shadow-sm mb-6" data-testid={`supplemental-${moduleId}`}>
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-primary">{t("pages.preNursing.supplementalContent2")}</span>
      </div>
      <div className="space-y-3">
        {content.map((p, idx) => {
          const isHtml = /<[a-z][\s\S]*>/i.test(p);
          return isHtml ? (
            <div key={idx} className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: p }} />
          ) : (
            <p key={idx} className="text-sm text-gray-700 leading-relaxed">{p}</p>
          );
        })}
      </div>
    </div>
  );
}

export default function PreNursingPage() {
  const [, setLocation] = useLocation();
  const [activeModule, setActiveModule] = useState<ModuleId | null>(null);
  const [isContentEditing, setIsContentEditing] = useState(false);
  const [moduleOverrides, setModuleOverrides] = useState<Record<string, ModuleOverride>>({});
  const [customModules, setCustomModules] = useState<any[]>([]);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [editingModule, setEditingModule] = useState<any>(null);
  const [activeCustomModule, setActiveCustomModule] = useState<any>(null);
  const { t } = useI18n();
  const { user } = useAuth();
  const { toast } = useToast();
  const { getImageUrl } = useSiteImages();
  const isAdmin = user?.tier === "admin";

  useEffect(() => {
    fetch("/api/custom-modules?page=pre-nursing")
      .then((r) => r.json())
      .then(setCustomModules)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mod = params.get("module");
    if (mod && modules.some((m) => m.id === mod)) {
      setActiveModule(mod as ModuleId);
    }
  }, []);

  useEffect(() => {
    if (activeModule) {
      fetch(`/api/lesson-overrides/prenursing-${activeModule}`)
        .then((r) => r.json())
        .then((data) => {
          if (data && Object.keys(data).length > 0) {
            setModuleOverrides((prev) => ({ ...prev, [activeModule]: data }));
          }
        })
        .catch(() => {});
    }
  }, [activeModule]);

  const saveModuleOverride = useCallback(async (moduleId: string, data: ModuleOverride) => {
    const creds = JSON.parse(localStorage.getItem("nursenest-credentials") || "{}");
    const res = await fetch(`/api/lesson-overrides/prenursing-${moduleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-user-tier": user?.tier || "" },
      body: JSON.stringify({ ...data, username: creds.username, password: creds.password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Save failed");
    }
    setModuleOverrides((prev) => ({ ...prev, [moduleId]: { ...prev[moduleId], ...data } }));
  }, [user]);

  const moduleComponents: Record<string, { component: React.ReactNode; name: string }> = {
    "cell-biology": { component: <CellBiologyModule />, name: "Cell Biology" },
    "physiology": { component: <PhysiologyModule />, name: "Physiology Principles" },
    "terminology": { component: <TerminologyModule />, name: "Medical Terminology" },
    "pharmacology": { component: <PharmacologyModule />, name: "Intro Pharmacology" },
    "pathophysiology": { component: <PathophysiologyModule />, name: "Intro Pathophysiology" },
    "science-foundations": { component: <ScienceFoundationsModule />, name: "Science Foundations" },
    "anatomy-physiology": { component: <AnatomyPhysiologyModule />, name: "Anatomy & Physiology" },
    "research-statistics": { component: <ResearchStatisticsModule />, name: "Research & Statistics" },
    "medical-terminology": { component: <MedicalTerminologyModule />, name: "Medical Terminology Extended" },
    "chemistry": { component: <ChemistryModule />, name: "Chemistry" },
    "microbiology": { component: <MicrobiologyModule />, name: "Microbiology" },
    "infection-control": { component: <InfectionControlModule />, name: "Infection Control" },
    "fluids-electrolytes": { component: <FluidsElectrolytesModule />, name: "Fluids & Electrolytes" },
    "communication": { component: <CommunicationModule />, name: "Communication" },
    "ethics-legal": { component: <EthicsLegalModule />, name: "Ethics & Legal" },
    "study-strategies": { component: <StudyStrategiesModule />, name: "Study Strategies" },
    "health-assessment": { component: <HealthAssessmentModule />, name: "Health Assessment" },
    "nutrition-foundations": { component: <NutritionFoundationsModule />, name: "Nutrition Foundations" },
    "cultural-competency": { component: <CulturalCompetencyModule />, name: "Cultural Competency" },
    "inflammation": { component: <InflammationModule />, name: "Inflammation" },
    "cellular-injury": { component: <CellularInjuryModule />, name: "Cellular Injury" },
    "oxygenation": { component: <OxygenationModule />, name: "Oxygenation" },
    "diagnostics": { component: <DiagnosticsModule />, name: "Diagnostics" },
    "healthcare-structure": { component: <HealthcareStructureModule />, name: "Healthcare Structure" },
    "research-reading": { component: <ResearchReadingModule />, name: "Research Reading" },
    "human-factors": { component: <HumanFactorsModule />, name: "Human Factors" },
    "atp-pathway": { component: <ATPPathwayModule />, name: "ATP Pathway" },
  };

  const deleteCustomModule = async (id: string) => {
    const creds = JSON.parse(localStorage.getItem("nursenest-credentials") || "{}");
    try {
      const res = await fetch(`/api/custom-modules/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: creds.username, password: creds.password }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setCustomModules((prev) => prev.filter((m) => m.id !== id));
      toast({ title: "Module deleted" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const iconMap: Record<string, any> = {
    BookOpen, Heart, Brain, Dna, Activity, Pill, Stethoscope, Beaker, FlaskConical, Lightbulb,
    Droplets, Wind, Sparkles, GraduationCap, Target, Layers, Flame, AlertTriangle, Microscope,
    Building2, FileText, ShieldAlert, Zap, UtensilsCrossed, Users,
  };

  if (activeCustomModule) {
    const cMod = activeCustomModule;
    const cLessons = (cMod.lessons || []) as { id: string; name: string; status?: string }[];
    const cContent = (cMod.content || {}) as { paragraphs?: string[] };
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
        <SEO title={`Pre-Nursing: ${cMod.title} | NurseNest`} description={cMod.description || "Custom pre-nursing module"} canonicalPath="/pre-nursing" />
        <Navigation />
        <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setActiveCustomModule(null)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
              data-testid="button-back-custom-modules"
            >
              <ArrowLeft className="w-4 h-4" /> {t("preNursing.backToModules")}
            </button>
            {isAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingModule(cMod); setShowModuleModal(true); }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  data-testid="button-edit-custom-module"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit Module
                </button>
              </div>
            )}
          </div>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {cMod.imageUrl && (
                <AdminImageOverlay imageKey={`custom-module-${cMod.id}`} src={cMod.imageUrl} isAdmin={isAdmin} className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0" imgClassName="w-full h-full object-contain p-1" />
              )}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800" data-testid="text-custom-module-title">{cMod.title}</h1>
                {cMod.description && <p className="text-slate-500 mt-1">{cMod.description}</p>}
              </div>
            </div>
          </div>
          {cContent.paragraphs && cContent.paragraphs.length > 0 && (
            <div className="mb-8 space-y-4">
              {cContent.paragraphs.map((p: string, i: number) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 text-gray-700 leading-relaxed shadow-sm">{p}</div>
              ))}
            </div>
          )}
          {cLessons.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">{t("pages.preNursing.lessons")}</h2>
              {cLessons.map((lesson, idx) => (
                <button
                  key={lesson.id || idx}
                  onClick={() => lesson.id && setLocation(`/lessons/${lesson.id}`)}
                  className="w-full text-left p-4 bg-white rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-sm transition-all flex items-center justify-between group"
                  data-testid={`custom-lesson-${lesson.id || idx}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", cMod.bgColor || "bg-primary/10", cMod.color || "text-primary")}>
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-gray-900">{lesson.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  if (activeModule) {
    const activeModuleData = modules.find((m) => m.id === activeModule);
    const mc = moduleComponents[activeModule];
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
        <SEO title={`Pre-Nursing: ${activeModuleData ? t(activeModuleData.titleKey) : ''} | NurseNest`} description={t("pages.preNursing.freePrenursingFoundationsModules")} canonicalPath="/pre-nursing" />
        <Navigation />
        <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setActiveModule(null)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
              data-testid="button-back-modules"
            >
              <ArrowLeft className="w-4 h-4" /> {t("preNursing.backToModules")}
            </button>
            <div className="flex items-center gap-4">
              {(() => {
                const currentIdx = modules.findIndex((m) => m.id === activeModule);
                const prevMod = currentIdx > 0 ? modules[currentIdx - 1] : null;
                const nextMod = currentIdx < modules.length - 1 ? modules[currentIdx + 1] : null;
                return (
                  <>
                    {prevMod && (
                      <button
                        onClick={() => { setActiveModule(prevMod.id); window.scrollTo(0, 0); }}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors"
                        data-testid="button-prev-module-top"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{t(prevMod.titleKey)}</span><span className="sm:hidden">{t("pages.preNursing.prev")}</span>
                      </button>
                    )}
                    {nextMod && (
                      <button
                        onClick={() => { setActiveModule(nextMod.id); window.scrollTo(0, 0); }}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors"
                        data-testid="button-next-module-top"
                      >
                        <span className="hidden sm:inline">{t(nextMod.titleKey)}</span><span className="sm:hidden">{t("pages.preNursing.next")}</span> <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </>
                );
              })()}
              <StudyNotes noteId={`prenursing-${activeModule}`} title={activeModuleData ? t(activeModuleData.titleKey) : ''} />
            </div>
            {isAdmin && (
              <button
                onClick={() => setIsContentEditing(!isContentEditing)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isContentEditing
                    ? "bg-purple-100 text-purple-800 border border-purple-300"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                data-testid="button-toggle-prenursing-edit"
              >
                <Pencil className="w-3.5 h-3.5" />
                {isContentEditing ? "Exit Editing" : "Edit Content"}
              </button>
            )}
          </div>

          {isContentEditing && isAdmin && mc && (
            <PreNursingModuleEditor
              moduleId={activeModule}
              moduleName={mc.name}
              overrides={moduleOverrides[activeModule] || {}}
              onSave={(data) => saveModuleOverride(activeModule, data)}
              sectionOverrides={(moduleOverrides[activeModule] || {}).sections}
            />
          )}

          <SupplementalContent moduleId={activeModule} />
          <ModuleEditContext.Provider
            value={{
              isEditing: isContentEditing && isAdmin,
              sections: (moduleOverrides[activeModule] || {}).sections || {},
              updateSection: (key, data) => {
                setModuleOverrides((prev) => {
                  const current = prev[activeModule] || {};
                  return {
                    ...prev,
                    [activeModule]: {
                      ...current,
                      sections: { ...(current.sections || {}), [key]: data },
                    },
                  };
                });
              },
            }}
          >
            {mc?.component}
          </ModuleEditContext.Provider>
          <SelfCheckQuiz title={t("pages.preNursing.prenursingComprehensiveReview")} questions={preNursingComprehensiveQuiz} />

          {(() => {
            const currentIdx = modules.findIndex((m) => m.id === activeModule);
            const prevMod = currentIdx > 0 ? modules[currentIdx - 1] : null;
            const nextMod = currentIdx < modules.length - 1 ? modules[currentIdx + 1] : null;
            return (
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-200 gap-4">
                {prevMod ? (
                  <button
                    onClick={() => { setActiveModule(prevMod.id); window.scrollTo(0, 0); }}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
                    data-testid="button-prev-module"
                  >
                    <ArrowLeft className="w-4 h-4" /> {t(prevMod.titleKey)}
                  </button>
                ) : <div />}
                {nextMod ? (
                  <button
                    onClick={() => { setActiveModule(nextMod.id); window.scrollTo(0, 0); }}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
                    data-testid="button-next-module"
                  >
                    {t(nextMod.titleKey)} <ChevronRight className="w-4 h-4" />
                  </button>
                ) : <div />}
              </div>
            );
          })()}
        </main>
        <AdminEditButton pageName="pre-nursing" defaultTier="prenursing" defaultCategory="pre-nursing" />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
      <SEO
        title={t("pages.preNursing.prenursingFoundationsFreeInteractiveLearning")}
        description={t("pages.preNursing.masterEssentialNursingFoundationsBefore")}
        keywords="pre-nursing, nursing foundations, cell biology nursing, medical terminology, pharmacology basics, pathophysiology intro, free nursing study"
        canonicalPath="/pre-nursing"
      />
      <Navigation />
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
          <BreadcrumbNav />
        </div>
        <section className="py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/20 blur-3xl" />
          </div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary/20 shadow-sm mb-6">
              <GraduationCap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-gray-600">{t("preNursing.badge")}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-4 leading-tight" data-testid="text-pre-nursing-heading">
              {t("preNursing.pageTitle")}
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-2 leading-relaxed">
              {t("preNursing.pageSubtitle")}
            </p>
            <p className="text-sm text-primary font-medium">
              {t("preNursing.byNurses")}
            </p>
          </div>
        </section>

        <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {modules.map((mod) => (
              <Card
                key={mod.id}
                className="border border-primary/10 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden bg-white group"
                onClick={() => setActiveModule(mod.id)}
                data-testid={`module-card-${mod.id}`}
              >
                <AdminImageOverlay
                  imageKey={`prenursing-module-${mod.id}`}
                  src={mod.image}
                  alt={t(mod.titleKey)}
                  isAdmin={isAdmin}
                  className="h-40 overflow-hidden bg-gray-50"
                  imgClassName="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                />
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", mod.bg, mod.color)}>
                      <mod.icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">{t(mod.titleKey)}</h3>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">{t(mod.subtitleKey)}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{mod.lessons} {t("preNursing.interactiveLessons")}</span>
                    <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            ))}

            {customModules.map((cMod) => {
              const IconComp = iconMap[cMod.icon] || BookOpen;
              const cLessons = (cMod.lessons || []) as any[];
              return (
                <Card
                  key={cMod.id}
                  className="border border-primary/10 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden bg-white group relative"
                  onClick={() => setActiveCustomModule(cMod)}
                  data-testid={`module-card-custom-${cMod.id}`}
                >
                  {cMod.imageUrl ? (
                    <AdminImageOverlay
                      imageKey={`custom-module-${cMod.id}`}
                      src={cMod.imageUrl}
                      alt={cMod.title}
                      isAdmin={isAdmin}
                      className="h-40 overflow-hidden bg-gray-50"
                      imgClassName="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className={cn("h-40 flex items-center justify-center", cMod.bgColor || "bg-primary/10")}>
                      <IconComp className={cn("w-16 h-16 opacity-30", cMod.color || "text-primary")} />
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", cMod.bgColor || "bg-primary/10", cMod.color || "text-primary")}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{cMod.title}</h3>
                    </div>
                    {cMod.description && <p className="text-sm text-gray-500 mb-3">{cMod.description}</p>}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{cLessons.length} lessons</span>
                      <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardContent>
                  {isAdmin && (
                    <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingModule(cMod); setShowModuleModal(true); }}
                        className="w-7 h-7 rounded-full bg-white/90 shadow-md border border-gray-200 flex items-center justify-center hover:bg-blue-50"
                        data-testid={`button-edit-module-${cMod.id}`}
                      >
                        <Pencil className="w-3 h-3 text-blue-600" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); if (confirm("Delete this module?")) deleteCustomModule(cMod.id); }}
                        className="w-7 h-7 rounded-full bg-white/90 shadow-md border border-gray-200 flex items-center justify-center hover:bg-red-50"
                        data-testid={`button-delete-module-${cMod.id}`}
                      >
                        <Trash2 className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                  )}
                </Card>
              );
            })}

            {isAdmin && (
              <Card
                className="border-2 border-dashed border-primary/30 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden bg-white/50 group flex items-center justify-center min-h-[280px]"
                onClick={() => { setEditingModule(null); setShowModuleModal(true); }}
                data-testid="button-add-module"
              >
                <div className="text-center space-y-3 p-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                    <Plus className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t("pages.preNursing.addModule")}</p>
                    <p className="text-xs text-gray-500 mt-1">{t("pages.preNursing.createANewLearningModule")}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          <section className="mt-16 pt-10 border-t border-gray-100" data-testid="section-competitor-comparison">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-4">
                <Target className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">{t("preNursing.compare.badge")}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3" data-testid="text-comparison-heading">
                {t("preNursing.compare.heading")}
              </h2>
              <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
                {t("preNursing.compare.subtitle")}
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-sm" data-testid="table-competitor-comparison">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">{t("preNursing.compare.feature")}</th>
                    <th className="text-center px-4 py-3 font-semibold text-primary">{t("preNursing.compare.nursenest")}</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-500">{t("preNursing.compare.uworld")}</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-500">{t("preNursing.compare.archer")}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { key: "preNursing.compare.row.freeFoundations", nn: "✅", uw: "❌", ar: "❌" },
                    { key: "preNursing.compare.row.interactiveAnatomy", nn: "✅", uw: "❌", ar: "❌" },
                    { key: "preNursing.compare.row.deepPatho", nn: "✅", uw: "✅", ar: t("preNursing.compare.limited") },
                    { key: "preNursing.compare.row.clinicalSims", nn: "✅", uw: "❌", ar: "❌" },
                    { key: "preNursing.compare.row.multiLang", nn: "✅", uw: "❌", ar: "❌" },
                    { key: "preNursing.compare.row.flashcards", nn: "✅", uw: "❌", ar: t("preNursing.compare.limited") },
                    { key: "preNursing.compare.row.price", nn: t("preNursing.compare.priceNN"), uw: t("preNursing.compare.priceUW"), ar: t("preNursing.compare.priceAR") },
                  ].map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                      <td className="px-4 py-3 text-gray-700 font-medium">{t(row.key)}</td>
                      <td className="px-4 py-3 text-center">{row.nn}</td>
                      <td className="px-4 py-3 text-center">{row.uw}</td>
                      <td className="px-4 py-3 text-center">{row.ar}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <LocaleLink
                href="/compare/nursenest-vs-uworld"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/5 border border-primary/15 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                data-testid="link-compare-uworld"
              >
                {t("preNursing.compare.linkUworld")} <ChevronRight className="w-3.5 h-3.5" />
              </LocaleLink>
              <LocaleLink
                href="/compare/nursenest-vs-archer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/5 border border-primary/15 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                data-testid="link-compare-archer"
              >
                {t("preNursing.compare.linkArcher")} <ChevronRight className="w-3.5 h-3.5" />
              </LocaleLink>
              <LocaleLink
                href="/compare/uworld-vs-archer-vs-nursenest"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/5 border border-primary/15 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                data-testid="link-compare-all"
              >
                {t("preNursing.compare.linkFullComparison")} <ChevronRight className="w-3.5 h-3.5" />
              </LocaleLink>
            </div>
          </section>

          <div className="mt-12 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-600 leading-relaxed">
              Planning to apply to a nursing or healthcare program? <a href="https://applynest.ca" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline" data-testid="link-applynest-prenursing">{t("pages.preNursing.applynestOffersAdmissionsPreparationTools")}</a> to help you take the next step in your healthcare education journey.
            </p>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-100" data-testid="section-continue-journey">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">{t("pages.preNursing.continueYourJourney")}</p>
            <div className="flex flex-wrap gap-2">
              <LocaleLink href="/anatomy" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all text-xs font-medium text-gray-600 hover:text-primary" data-testid="link-journey-anatomy">{t("pages.preNursing.anatomyExplorer")}</LocaleLink>
              <LocaleLink href="/lessons" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all text-xs font-medium text-gray-600 hover:text-primary" data-testid="link-journey-lessons">{t("pages.preNursing.clinicalLessons")}</LocaleLink>
              <LocaleLink href="/flashcards" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all text-xs font-medium text-gray-600 hover:text-primary" data-testid="link-journey-flashcards">{t("pages.preNursing.studyFlashcards")}</LocaleLink>
              <LocaleLink href="/free-practice" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all text-xs font-medium text-gray-600 hover:text-primary" data-testid="link-journey-questions">{t("pages.preNursing.testBank")}</LocaleLink>
              <LocaleLink href="/med-math" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all text-xs font-medium text-gray-600 hover:text-primary" data-testid="link-journey-med-math">{t("pages.preNursing.medMath")}</LocaleLink>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/5 rounded-2xl border border-primary/10">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-sm text-gray-700">
                {t("preNursing.readyForDeeper")}{" "}
                <button onClick={() => setLocation("/pricing")} className="text-primary font-semibold hover:underline" data-testid="link-upgrade-pre-nursing">
                  {t("preNursing.explorePlans")}
                </button>
              </span>
            </div>
          </div>
        </section>
      </main>

      {showModuleModal && (
        <CustomModuleModal
          module={editingModule}
          page="pre-nursing"
          onClose={() => { setShowModuleModal(false); setEditingModule(null); }}
          onSaved={(mod) => {
            if (editingModule) {
              setCustomModules((prev) => prev.map((m) => m.id === mod.id ? mod : m));
              if (activeCustomModule?.id === mod.id) setActiveCustomModule(mod);
            } else {
              setCustomModules((prev) => [...prev, mod]);
            }
            setShowModuleModal(false);
            setEditingModule(null);
          }}
        />
      )}

      <section className="py-12 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30 border-t border-gray-100" data-testid="section-new-grad-cta">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3" data-testid="text-prenursing-new-grad-cta">{t("pages.preNursing.planningAheadExploreCareerReadiness")}</h2>
          <p className="text-gray-600 mb-5 max-w-2xl mx-auto text-sm">
            Once you graduate, our New Grad Career Hub will help you land your first nursing job with interview prep, resume templates, salary negotiation tools, and first-year survival guides.
          </p>
          <LocaleLink href="/newgrad">
            <Button className="gap-2" data-testid="link-prenursing-new-grad">
              Preview New Grad Career Hub <ArrowRight className="w-4 h-4" />
            </Button>
          </LocaleLink>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-r from-teal-50 to-cyan-50" data-testid="section-applynest-prenursing">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 mb-4">
            Exploring healthcare programs or preparing applications? <a href="https://applynest.ca" target="_blank" rel="noopener noreferrer" className="text-teal-700 font-semibold hover:underline" data-testid="link-applynest-prenursing">{t("pages.preNursing.applynest")}</a> offers tools for program applications, personal statement writing, and scholarship searches to help you find the right path.
          </p>
        </div>
      </section>

      <AdminEditButton pageName="pre-nursing" defaultTier="prenursing" defaultCategory="pre-nursing" />
      <Footer />
    </div>
  );
}

const ICON_OPTIONS = [
  { name: "BookOpen", icon: BookOpen },
  { name: "Heart", icon: Heart },
  { name: "Brain", icon: Brain },
  { name: "Dna", icon: Dna },
  { name: "Activity", icon: Activity },
  { name: "Pill", icon: Pill },
  { name: "Stethoscope", icon: Stethoscope },
  { name: "Beaker", icon: Beaker },
  { name: "FlaskConical", icon: FlaskConical },
  { name: "Lightbulb", icon: Lightbulb },
  { name: "Droplets", icon: Droplets },
  { name: "Wind", icon: Wind },
  { name: "Sparkles", icon: Sparkles },
  { name: "GraduationCap", icon: GraduationCap },
  { name: "Target", icon: Target },
  { name: "Layers", icon: Layers },
];

const COLOR_OPTIONS = [
  { label: "Blue", color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Emerald", color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Purple", color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Rose", color: "text-rose-600", bg: "bg-rose-50" },
  { label: "Amber", color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Teal", color: "text-teal-600", bg: "bg-teal-50" },
  { label: "Indigo", color: "text-indigo-600", bg: "bg-indigo-50" },
  { label: "Pink", color: "text-pink-600", bg: "bg-pink-50" },
];

function CustomModuleModal({ module, page, onClose, onSaved }: {
  module: any;
  page: string;
  onClose: () => void;
  onSaved: (mod: any) => void;
}) {
  const [title, setTitle] = useState(module?.title || "");
  const [description, setDescription] = useState(module?.description || "");
  const [icon, setIcon] = useState(module?.icon || "BookOpen");
  const [colorIdx, setColorIdx] = useState(() => {
    const idx = COLOR_OPTIONS.findIndex((c) => c.color === module?.color);
    return idx >= 0 ? idx : 0;
  });
  const [imageUrl, setImageUrl] = useState(module?.imageUrl || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lessons, setLessons] = useState<{ id: string; name: string }[]>(
    module?.lessons ? (module.lessons as any[]) : []
  );
  const [paragraphs, setParagraphs] = useState<string[]>(
    module?.content?.paragraphs || []
  );
  const [newLessonName, setNewLessonName] = useState("");
  const [newLessonId, setNewLessonId] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const res = await fetch("/api/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type || "image/png" }),
      });
      if (!res.ok) throw new Error("Failed to get upload URL");
      const { uploadURL, objectPath } = await res.json();
      const uploadRes = await fetch(uploadURL, { method: "PUT", body: file, headers: { "Content-Type": file.type || "image/png" } });
      if (!uploadRes.ok) throw new Error("Upload failed");
      setImageUrl(objectPath);
    } catch (e: any) {
      toast({ title: "Upload error", description: e.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) { toast({ title: "Title is required", variant: "destructive" }); return; }
    setSaving(true);
    const creds = JSON.parse(localStorage.getItem("nursenest-credentials") || "{}");
    const selectedColor = COLOR_OPTIONS[colorIdx];
    const body = {
      page,
      title: title.trim(),
      description: description.trim() || null,
      icon,
      color: selectedColor.color,
      bgColor: selectedColor.bg,
      imageUrl: imageUrl || null,
      lessons,
      content: { paragraphs: paragraphs.filter((p) => p.trim()) },
      username: creds.username,
      password: creds.password,
    };
    try {
      const url = module ? `/api/custom-modules/${module.id}` : "/api/custom-modules";
      const method = module ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error("Save failed");
      const saved = await res.json();
      toast({ title: module ? "Module updated" : "Module created" });
      onSaved(saved);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 my-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} data-testid="modal-custom-module">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{module ? "Edit Module" : "Add New Module"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">{t("pages.preNursing.title")}</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("pages.preNursing.moduleTitle")} data-testid="input-module-title" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">{t("pages.preNursing.description")}</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t("pages.preNursing.briefDescriptionOfTheModule")} rows={2} data-testid="input-module-description" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">{t("pages.preNursing.icon")}</label>
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map((opt) => (
                <button
                  key={opt.name}
                  onClick={() => setIcon(opt.name)}
                  className={cn("w-9 h-9 rounded-lg flex items-center justify-center border-2 transition-all", icon === opt.name ? "border-primary bg-primary/10" : "border-gray-200 hover:border-gray-300")}
                  title={opt.name}
                >
                  <opt.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">{t("pages.preNursing.colorTheme")}</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((opt, idx) => (
                <button
                  key={opt.label}
                  onClick={() => setColorIdx(idx)}
                  className={cn("px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all", opt.bg, opt.color, colorIdx === idx ? "border-current ring-1 ring-current" : "border-transparent")}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">{t("pages.preNursing.moduleImage")}</label>
            {imageUrl && (
              <div className="mb-2 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                <img src={imageUrl} alt={`${mod.title} pre-nursing module illustration - NurseNest education`} title={`${mod.title} pre-nursing module`} loading="lazy" className="w-full h-32 object-contain p-2" />
              </div>
            )}
            <div className="flex gap-2">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading} className="gap-2" data-testid="button-upload-module-image">
                {uploading ? <><Loader2 className="w-3 h-3 animate-spin" /> {t("pages.preNursing.uploading")}</> : <><Upload className="w-3 h-3" /> {t("pages.preNursing.upload")}</>}
              </Button>
              <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder={t("pages.preNursing.orPasteImageUrl")} className="flex-1 text-sm h-9" data-testid="input-module-image-url" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">{t("pages.preNursing.contentParagraphs")}</label>
            <div className="space-y-2">
              {paragraphs.map((p, idx) => (
                <div key={idx} className="flex gap-2">
                  <Textarea value={p} onChange={(e) => { const updated = [...paragraphs]; updated[idx] = e.target.value; setParagraphs(updated); }} rows={2} className="flex-1 text-sm" />
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-red-500" onClick={() => setParagraphs(paragraphs.filter((_, i) => i !== idx))}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setParagraphs([...paragraphs, ""])} className="gap-1">
                <Plus className="w-3 h-3" /> Add Paragraph
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">{t("pages.preNursing.lessons2")}</label>
            <div className="space-y-2">
              {lessons.map((l, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <BookOpen className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 flex-1">{l.name}</span>
                  <span className="text-xs text-gray-400">{l.id}</span>
                  <button onClick={() => setLessons(lessons.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input value={newLessonName} onChange={(e) => setNewLessonName(e.target.value)} placeholder={t("pages.preNursing.lessonName")} className="flex-1 text-sm h-9" data-testid="input-lesson-name" />
                <Input value={newLessonId} onChange={(e) => setNewLessonId(e.target.value)} placeholder="lesson-slug" className="w-32 text-sm h-9" data-testid="input-lesson-id" />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9"
                  disabled={!newLessonName.trim()}
                  onClick={() => {
                    if (newLessonName.trim()) {
                      const slug = newLessonId.trim() || newLessonName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
                      setLessons([...lessons, { id: slug, name: newLessonName.trim() }]);
                      setNewLessonName("");
                      setNewLessonId("");
                    }
                  }}
                  data-testid="button-add-lesson"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handleSave} disabled={saving || !title.trim()} className="flex-1 gap-2" data-testid="button-save-module">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {module ? "Save Changes" : "Create Module"}
          </Button>
          <Button variant="outline" onClick={onClose}>{t("pages.preNursing.cancel")}</Button>
        </div>
      </div>
    </div>
  );
}

function useResolvedSection(sectionKey: string, defaultText: string) {
  const { sections } = useModuleEdit();
  const { t, language } = useI18n();
  if (sections[sectionKey]?.content) return sections[sectionKey].content!;
  if (language !== "en") {
    const i18nKey = `prenursing.${sectionKey}`;
    const translated = t(i18nKey);
    if (translated !== i18nKey) return translated;
  }
  return defaultText;
}

function CellBiologyModule() {
  const { isEditing, sections, updateSection } = useModuleEdit();
  const { t, language } = useI18n();
  const rs = (key: string, def: string) => {
    if (sections[key]?.content) return sections[key].content!;
    if (language !== "en") { const k = `prenursing.${key}`; const v = t(k); if (v !== k) return v; }
    return def;
  };
  return (
    <div className="space-y-8" data-testid="module-cell-biology">
      <div>
        <EditableModuleText sectionKey="cell-bio-title" defaultText="Cell Biology" as="h2" className="text-2xl font-bold text-slate-800 mb-2" />
        <EditableModuleText sectionKey="cell-bio-desc" defaultText="Explore the building blocks of the human body through interactive diagrams and concept checks." as="p" className="text-slate-500" multiline />
      </div>

      <MicroLesson title={rs("cell-bio-human-cell-title", "The Human Cell")} subtitle={rs("cell-bio-human-cell-subtitle", "Identify key organelles and their functions")} icon={<Dna className="w-5 h-5" />}>
        {isEditing ? (
          <>
            <div className="flex gap-2 mb-2">
              <input value={sections["cell-bio-human-cell-title"]?.content || "The Human Cell"} onChange={(e) => updateSection("cell-bio-human-cell-title", { content: e.target.value })} className="flex-1 bg-white/80 border border-purple-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-purple-300 focus:outline-none" placeholder={t("pages.preNursing.sectionTitle")} />
              <input value={sections["cell-bio-human-cell-subtitle"]?.content || "Identify key organelles and their functions"} onChange={(e) => updateSection("cell-bio-human-cell-subtitle", { content: e.target.value })} className="flex-1 bg-white/80 border border-purple-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-purple-300 focus:outline-none" placeholder={t("pages.preNursing.subtitle")} />
            </div>
          </>
        ) : null}
        <EditableModuleText sectionKey="cell-bio-human-cell-content" defaultText="Every cell contains specialized structures called organelles that work together to maintain life. Understanding cell structure is the foundation for understanding how diseases affect the body at the cellular level." as="p" className="text-sm text-slate-600 leading-relaxed" multiline />
        <CognitiveCard
          type="concept"
          title={rs("whyMattersNursing", "Why This Matters for Nursing")}
          content={rs("cell-bio-nursing-concept", "When you learn pathophysiology, you'll trace disease mechanisms back to cellular dysfunction. For example, MI (heart attack) starts with ischemia → cellular hypoxia → mitochondrial failure → cell death.")}
        />
        {isEditing && (
          <RichTextEditor value={sections["cell-bio-nursing-concept"]?.content || "When you learn pathophysiology, you'll trace disease mechanisms back to cellular dysfunction. For example, MI (heart attack) starts with ischemia → cellular hypoxia → mitochondrial failure → cell death."} onChange={(v) => updateSection("cell-bio-nursing-concept", { content: v })} className="mt-2" minHeight="60px" placeholder={t("pages.preNursing.cognitiveCardContent")} />
        )}
      </MicroLesson>

      <AnatomyLabeling
        title={t("prenursing.cellStructureLabel")}
        description={t("prenursing.cellStructureDesc")}
        backgroundImage={cellStructureImage}
        labels={cellLabels}
        width={600}
        height={450}
      />

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm" data-testid="organelle-gallery">
        <h3 className="text-lg font-bold text-slate-800 mb-1">{t("prenursing.organelleDeepDive")}</h3>
        <p className="text-sm text-slate-500 mb-5">{t("prenursing.organelleExplore")}</p>
        <div className="grid sm:grid-cols-2 gap-5">
          {[
            { img: organelleCellMembrane, name: "Cell Membrane", color: "teal", desc: "The phospholipid bilayer forms a selectively permeable barrier with embedded integral proteins, channel proteins, and cholesterol. It controls ion and molecule transport through passive diffusion, facilitated diffusion, and active transport (Na⁺/K⁺ ATPase). Glycoprotein receptors on the surface mediate cell signaling and immune recognition.", clinical: "Defects in membrane transport proteins cause cystic fibrosis (CFTR channel) and familial hypercholesterolemia (LDL receptor)." },
            { img: organelleNucleus, name: "Nucleus", color: "purple", desc: "The command center of the cell, enclosed by a double nuclear envelope with nuclear pores that regulate macromolecule transport. Contains chromatin (DNA wound around histone proteins) that condenses into chromosomes during division. The nucleolus inside assembles ribosomal subunits from rRNA.", clinical: "Cancer often involves mutations in nuclear DNA repair mechanisms (BRCA1/2, p53). The nucleolus enlarges in rapidly dividing cancer cells." },
            { img: organelleMitochondria, name: "Mitochondria", color: "green", desc: "The powerhouse of the cell with a double membrane — the inner membrane folds into cristae to maximize surface area for the electron transport chain. Produces ~36 ATP per glucose molecule through oxidative phosphorylation. Contains its own circular mtDNA inherited exclusively from the mother.", clinical: "Mitochondrial dysfunction contributes to heart failure, neurodegenerative diseases, and aging. Cyanide poisoning works by blocking Complex IV of the electron transport chain." },
            { img: organelleRoughER, name: "Rough Endoplasmic Reticulum", color: "blue", desc: "An extensive folded membrane network studded with ribosomes, continuous with the nuclear envelope. Responsible for co-translational protein folding, N-linked glycosylation, and quality control of newly synthesized proteins. Especially prominent in cells with high secretory output like plasma cells and pancreatic acinar cells.", clinical: "ER stress from misfolded proteins triggers the unfolded protein response (UPR), implicated in diabetes, Alzheimer's, and Parkinson's disease." },
            { img: organelleGolgi, name: "Golgi Apparatus", color: "amber", desc: "Stacked flattened membrane cisternae that receive proteins from the ER at the cis face and process them through post-translational modifications including glycosylation, phosphorylation, and sulfation. The trans face sorts and packages proteins into vesicles for secretion, lysosomal targeting, or membrane insertion.", clinical: "I-cell disease (mucolipidosis II) results from failure to add mannose-6-phosphate tags in the Golgi, causing enzymes to be secreted instead of delivered to lysosomes." },
            { img: organelleLysosome, name: "Lysosomes", color: "red", desc: "Membrane-bound vesicles maintaining an acidic interior (pH ~5) filled with over 50 types of acid hydrolase enzymes. They digest materials from autophagy (recycling old organelles), phagocytosis (destroying pathogens), and endocytosis. Essential for cellular housekeeping and programmed cell death.", clinical: "Lysosomal storage diseases (Tay-Sachs, Gaucher, Pompe) result from deficiency of specific hydrolases, causing toxic accumulation of undigested substrates." },
          ].map((organelle, idx) => {
            const colorMap: Record<string, { bg: string; border: string; title: string; badge: string }> = {
              teal: { bg: "bg-teal-50/60", border: "border-teal-200", title: "text-teal-800", badge: "bg-teal-100 text-teal-700" },
              purple: { bg: "bg-purple-50/60", border: "border-purple-200", title: "text-purple-800", badge: "bg-purple-100 text-purple-700" },
              green: { bg: "bg-green-50/60", border: "border-green-200", title: "text-green-800", badge: "bg-green-100 text-green-700" },
              blue: { bg: "bg-blue-50/60", border: "border-blue-200", title: "text-blue-800", badge: "bg-blue-100 text-blue-700" },
              amber: { bg: "bg-amber-50/60", border: "border-amber-200", title: "text-amber-800", badge: "bg-amber-100 text-amber-700" },
              red: { bg: "bg-red-50/60", border: "border-red-200", title: "text-red-800", badge: "bg-red-100 text-red-700" },
            };
            const c = colorMap[organelle.color];
            return (
              <div key={idx} className={`rounded-xl ${c.bg} ${c.border} border p-4`} data-testid={`organelle-card-${idx}`}>
                <div className="flex justify-center mb-3">
                  <img src={organelle.img} alt={`${organelle.name} cell organelle illustration - NurseNest pre-nursing education`} title={organelle.name} className="w-40 h-40 object-contain rounded-lg" loading="lazy" />
                </div>
                <h4 className={`font-semibold text-sm ${c.title} mb-1`}>{organelle.name}</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">{organelle.desc}</p>
                <div className={`text-xs ${c.badge} rounded-lg px-2.5 py-1.5 inline-block`}>
                  <span className="font-semibold">{t("pages.preNursing.clinical")}</span> {organelle.clinical}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <MatchingExercise
        title={t("pages.preNursing.organelleFunctionMatching")}
        description={t("pages.preNursing.matchEachOrganelleToIts")}
        pairs={[
          { id: "m1", term: "Mitochondria", definition: "Oxidative phosphorylation — ATP production via electron transport chain" },
          { id: "m2", term: "Nucleus", definition: "Houses chromatin (DNA); controls transcription & mRNA processing" },
          { id: "m3", term: "Ribosomes", definition: "Translate mRNA into polypeptide chains (protein synthesis)" },
          { id: "m4", term: "Golgi Apparatus", definition: "Post-translational modification, protein sorting & vesicle packaging" },
          { id: "m5", term: "Lysosomes", definition: "Acid hydrolase vesicles — autophagy & intracellular digestion" },
          { id: "m6", term: "Cell Membrane", definition: "Phospholipid bilayer — selective permeability & signal transduction" },
          { id: "m7", term: "Rough ER", definition: "Ribosome-studded — co-translational protein folding & glycosylation" },
          { id: "m8", term: "Smooth ER", definition: "Lipid/steroid synthesis, Ca²⁺ storage, drug detoxification" },
          { id: "m9", term: "Peroxisomes", definition: "Fatty acid β-oxidation & H₂O₂ detoxification via catalase" },
          { id: "m10", term: "Centrioles", definition: "Organize mitotic spindle; form basal bodies of cilia" },
        ]}
      />

      <MicroLesson title={rs("cell-bio-transport-title", "Membrane Transport")} subtitle={rs("cell-bio-transport-subtitle", "How substances move in and out of cells")} icon={<Layers className="w-5 h-5" />}>
        {isEditing ? (
          <div className="flex gap-2 mb-2">
            <input value={sections["cell-bio-transport-title"]?.content || "Membrane Transport"} onChange={(e) => updateSection("cell-bio-transport-title", { content: e.target.value })} className="flex-1 bg-white/80 border border-purple-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-purple-300 focus:outline-none" placeholder={t("pages.preNursing.sectionTitle2")} />
            <input value={sections["cell-bio-transport-subtitle"]?.content || "How substances move in and out of cells"} onChange={(e) => updateSection("cell-bio-transport-subtitle", { content: e.target.value })} className="flex-1 bg-white/80 border border-purple-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-purple-300 focus:outline-none" placeholder={t("pages.preNursing.subtitle2")} />
          </div>
        ) : null}
        <CognitiveCard
          type="remember"
          title={t("pages.preNursing.keyPrinciple")}
          content={rs("cell-bio-transport-principle", "'Water chases salt': water moves toward areas of higher solute concentration through osmosis. This explains why IV normal saline stays in the vasculature while free water distributes across compartments.")}
        />
        {isEditing && (
          <RichTextEditor value={sections["cell-bio-transport-principle"]?.content || "'Water chases salt': water moves toward areas of higher solute concentration through osmosis. This explains why IV normal saline stays in the vasculature while free water distributes across compartments."} onChange={(v) => updateSection("cell-bio-transport-principle", { content: v })} className="mt-2" minHeight="60px" placeholder={t("pages.preNursing.keyPrincipleContent")} />
        )}
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <div className="flex justify-center mb-3">
              <img src={transportPassive} alt={t("pages.preNursing.passiveTransportAcrossCellMembrane")} className="w-full max-w-xs h-auto rounded-lg" loading="lazy" data-testid="img-passive-transport" />
            </div>
            <p className="text-xs font-semibold text-blue-700 mb-1">{t("pages.preNursing.passiveTransport")}</p>
            <EditableModuleText sectionKey="cell-bio-passive-transport" defaultText="No energy needed. Moves DOWN concentration gradient. Examples: diffusion, osmosis, facilitated diffusion." as="p" className="text-xs text-blue-600" multiline />
          </div>
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
            <div className="flex justify-center mb-3">
              <img src={transportActive} alt={t("pages.preNursing.activeTransportAcrossCellMembrane")} className="w-full max-w-xs h-auto rounded-lg" loading="lazy" data-testid="img-active-transport" />
            </div>
            <p className="text-xs font-semibold text-amber-700 mb-1">{t("pages.preNursing.activeTransport")}</p>
            <EditableModuleText sectionKey="cell-bio-active-transport" defaultText="Requires ATP energy. Moves AGAINST concentration gradient. Example: Na+/K+ pump (3 Na+ out, 2 K+ in)." as="p" className="text-xs text-amber-600" multiline />
          </div>
        </div>
      </MicroLesson>

      <SelfCheckQuiz title={t("pages.preNursing.cellBiologyCheck")} questions={cellBiologyQuiz} />
    </div>
  );
}

function PhysiologyModule() {
  const { isEditing, sections, updateSection } = useModuleEdit();
  const { t, language } = useI18n();
  const rs = (key: string, def: string) => {
    if (sections[key]?.content) return sections[key].content!;
    if (language !== "en") { const k = `prenursing.${key}`; const v = t(k); if (v !== k) return v; }
    return def;
  };
  return (
    <div className="space-y-8" data-testid="module-physiology">
      <div>
        <EditableModuleText sectionKey="phys-title" defaultText="Physiology Principles" as="h2" className="text-2xl font-bold text-slate-800 mb-2" />
        <EditableModuleText sectionKey="phys-desc" defaultText="Understand how the body maintains balance through feedback loops, fluid management, and acid-base regulation." as="p" className="text-slate-500" multiline />
      </div>

      <MicroLesson title={rs("phys-feedback-title", "Negative Feedback Loops")} subtitle={rs("phys-feedback-subtitle", "The body's primary regulatory mechanism")} icon={<Activity className="w-5 h-5" />}>
        {isEditing && (
          <div className="flex gap-2 mb-2">
            <input value={sections["phys-feedback-title"]?.content || "Negative Feedback Loops"} onChange={(e) => updateSection("phys-feedback-title", { content: e.target.value })} className="flex-1 bg-white/80 border border-purple-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-purple-300 focus:outline-none" placeholder={t("pages.preNursing.sectionTitle3")} />
            <input value={sections["phys-feedback-subtitle"]?.content || "The body's primary regulatory mechanism"} onChange={(e) => updateSection("phys-feedback-subtitle", { content: e.target.value })} className="flex-1 bg-white/80 border border-purple-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-purple-300 focus:outline-none" placeholder={t("pages.preNursing.subtitle3")} />
          </div>
        )}
        <EditableModuleText sectionKey="phys-feedback-content" defaultText="Most physiological regulation uses negative feedback. The body detects a change, activates a response, and reverses the change to restore balance." as="p" className="text-sm text-slate-600 leading-relaxed" multiline />
        <div className="flex justify-center my-4">
          <img src={feedbackLoopImage} alt={t("pages.preNursing.negativeFeedbackLoopForThermoregulation")} className="w-full max-w-sm h-auto rounded-xl border border-slate-200 shadow-sm" loading="lazy" data-testid="img-feedback-loop" />
        </div>
        <CognitiveCard
          type="concept"
          title={t("pages.preNursing.clinicalConnection")}
          content={rs("phys-feedback-concept", "When you see a compensatory vital sign change in a patient (e.g., tachycardia in response to bleeding), you're witnessing negative feedback trying to maintain cardiac output.")}
        />
        {isEditing && (
          <RichTextEditor value={sections["phys-feedback-concept"]?.content || "When you see a compensatory vital sign change in a patient (e.g., tachycardia in response to bleeding), you're witnessing negative feedback trying to maintain cardiac output."} onChange={(v) => updateSection("phys-feedback-concept", { content: v })} className="mt-2" minHeight="60px" placeholder={t("pages.preNursing.cognitiveCardContent2")} />
        )}
      </MicroLesson>

      <StepSequencing
        title={t("pages.preNursing.thermoregulationSequence")}
        description={t("pages.preNursing.arrangeTheStepsOfThe")}
        steps={physiologySequence}
      />

      <MicroLesson title={rs("phys-fluid-title", "Fluid Compartments")} subtitle={rs("phys-fluid-subtitle", "Where body water is distributed")} icon={<Droplets className="w-5 h-5" />}>
        {isEditing && (
          <div className="flex gap-2 mb-2">
            <input value={sections["phys-fluid-title"]?.content || "Fluid Compartments"} onChange={(e) => updateSection("phys-fluid-title", { content: e.target.value })} className="flex-1 bg-white/80 border border-purple-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-purple-300 focus:outline-none" placeholder={t("pages.preNursing.sectionTitle4")} />
            <input value={sections["phys-fluid-subtitle"]?.content || "Where body water is distributed"} onChange={(e) => updateSection("phys-fluid-subtitle", { content: e.target.value })} className="flex-1 bg-white/80 border border-purple-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-purple-300 focus:outline-none" placeholder={t("pages.preNursing.subtitle4")} />
          </div>
        )}
        <div className="flex justify-center my-4">
          <img src={fluidCompartmentsImage} alt={t("pages.preNursing.bodyFluidCompartmentsShowingIntracellular")} className="w-full max-w-sm h-auto rounded-xl border border-slate-200 shadow-sm" loading="lazy" data-testid="img-fluid-compartments" />
        </div>
        <div className="space-y-3">
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-blue-700">{t("pages.preNursing.intracellularFluidIcf")}</p>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">~67%</span>
            </div>
            <EditableModuleText sectionKey="phys-icf" defaultText="Inside cells. Contains K+, Mg2+, PO4³⁻. The largest fluid compartment." as="p" className="text-xs text-blue-600" multiline />
          </div>
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-emerald-700">{t("pages.preNursing.extracellularFluidEcf")}</p>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">~33%</span>
            </div>
            <EditableModuleText sectionKey="phys-ecf" defaultText="Outside cells. Includes intravascular (plasma) and interstitial (between cells). Contains Na+, Cl⁻, HCO3⁻." as="p" className="text-xs text-emerald-600" multiline />
          </div>
        </div>
        <CognitiveCard
          type="remember"
          title={t("pages.preNursing.memoryAid")}
          content={rs("phys-fluid-memory", "'K+ stays IN the cell, Na+ stays OUT.' This is maintained by the Na+/K+ ATPase pump. When cells are damaged (trauma, burns), K+ leaks out → hyperkalemia risk.")}
        />
        {isEditing && (
          <RichTextEditor value={sections["phys-fluid-memory"]?.content || "'K+ stays IN the cell, Na+ stays OUT.' This is maintained by the Na+/K+ ATPase pump. When cells are damaged (trauma, burns), K+ leaks out → hyperkalemia risk."} onChange={(v) => updateSection("phys-fluid-memory", { content: v })} className="mt-2" minHeight="60px" placeholder={t("pages.preNursing.memoryAidContent")} />
        )}
      </MicroLesson>

      <SelfCheckQuiz
        title={t("pages.preNursing.physiologyCheck")}
        questions={[
          {
            id: "ph1",
            question: "Which electrolyte is the MOST abundant intracellular cation?",
            options: ["Sodium (Na+)", "Potassium (K+)", "Calcium (Ca2+)", "Chloride (Cl⁻)"],
            correctIndex: 1,
            rationale: "Potassium is the primary intracellular cation (150 mEq/L inside vs 3.5-5.0 mEq/L outside). This gradient is critical for nerve impulse conduction and muscle contraction.",
          },
          {
            id: "ph2",
            question: "A patient's pH is 7.30 with a low HCO3⁻. This suggests:",
            options: ["Respiratory acidosis", "Metabolic acidosis", "Respiratory alkalosis", "Metabolic alkalosis"],
            correctIndex: 1,
            rationale: "pH < 7.35 = acidosis. Low HCO3⁻ (metabolic component) is the primary disturbance. The kidneys are either losing too much bicarbonate or the body is producing excess acid.",
            hint: "Low pH = acidosis. Then determine if the cause is respiratory (CO2) or metabolic (HCO3⁻).",
          },
        ]}
      />
    </div>
  );
}

function TerminologyModule() {
  const { isEditing, sections, updateSection } = useModuleEdit();
  const { t, language } = useI18n();
  const rs = (key: string, def: string) => {
    if (sections[key]?.content) return sections[key].content!;
    if (language !== "en") { const k = `prenursing.${key}`; const v = t(k); if (v !== k) return v; }
    return def;
  };
  return (
    <div className="space-y-8" data-testid="module-terminology">
      <div>
        <EditableModuleText sectionKey="term-title" defaultText="Medical Terminology" as="h2" className="text-2xl font-bold text-slate-800 mb-2" />
        <EditableModuleText sectionKey="term-desc" defaultText="Decode clinical language by mastering the building blocks: prefixes, suffixes, and root words." as="p" className="text-slate-500" multiline />
      </div>

      <MicroLesson title={rs("term-how-title", "How Medical Terms Work")} subtitle={rs("term-how-subtitle", "Breaking down clinical vocabulary")} icon={<BookOpen className="w-5 h-5" />}>
        {isEditing && (
          <div className="flex gap-2 mb-2">
            <input value={sections["term-how-title"]?.content || "How Medical Terms Work"} onChange={(e) => updateSection("term-how-title", { content: e.target.value })} className="flex-1 bg-white/80 border border-purple-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-purple-300 focus:outline-none" placeholder={t("pages.preNursing.sectionTitle5")} />
            <input value={sections["term-how-subtitle"]?.content || "Breaking down clinical vocabulary"} onChange={(e) => updateSection("term-how-subtitle", { content: e.target.value })} className="flex-1 bg-white/80 border border-purple-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-purple-300 focus:outline-none" placeholder={t("pages.preNursing.subtitle5")} />
          </div>
        )}
        <EditableModuleText sectionKey="term-how-content" defaultText="Most medical terms are combinations of prefixes (word parts added to the beginning), root words (the core identifying the body part), and suffixes (word endings indicating a condition or procedure)." as="p" className="text-sm text-slate-600 leading-relaxed" multiline />
        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 mt-3">
          <p className="text-sm font-semibold text-gray-800 mb-2">{t("pages.preNursing.exampleBreakdown")}</p>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">{t("pages.preNursing.tachy")}</span>
            <span className="text-gray-400">+</span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">{t("pages.preNursing.card")}</span>
            <span className="text-gray-400">+</span>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">{t("pages.preNursing.ia")}</span>
            <span className="text-gray-400">=</span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-semibold">{t("pages.preNursing.tachycardia")}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">{t("pages.preNursing.fastHeartConditionRapidHeart")}</p>
        </div>
      </MicroLesson>

      <MatchingExercise
        title={t("pages.preNursing.prefixSuffixMatching")}
        description={t("pages.preNursing.matchEachMedicalPrefixOr")}
        pairs={terminologyPairs}
      />

      <ProgressiveReveal
        title={t("pages.preNursing.commonRootWords")}
        cards={[
          { id: "r1", title: "Cardi/o", summary: "Heart", detail: "Used in terms like cardiology, tachycardia, cardiomyopathy. The root 'cardi' always refers to the heart.", icon: <Heart className="w-4 h-4" /> },
          { id: "r2", title: "Hepat/o", summary: "Liver", detail: "Used in terms like hepatitis (liver inflammation), hepatomegaly (enlarged liver), hepatotoxic (toxic to the liver)." },
          { id: "r3", title: "Nephr/o", summary: "Kidney", detail: "Used in terms like nephritis (kidney inflammation), nephrectomy (kidney removal), nephropathy (kidney disease).", icon: <Droplets className="w-4 h-4" /> },
          { id: "r4", title: "Pneum/o", summary: "Lung / Air", detail: "Used in terms like pneumonia (lung infection), pneumothorax (air in pleural space), pneumonectomy (lung removal).", icon: <Wind className="w-4 h-4" /> },
          { id: "r5", title: "Neur/o", summary: "Nerve", detail: "Used in terms like neurology, neuropathy (nerve damage), neurogenic (originating from nerves).", icon: <Brain className="w-4 h-4" /> },
        ]}
      />

      <SelfCheckQuiz
        title={t("pages.preNursing.terminologyCheck")}
        questions={[
          {
            id: "tm1",
            question: "What does 'hepatomegaly' mean?",
            options: ["Liver inflammation", "Enlarged liver", "Liver removal", "Liver pain"],
            correctIndex: 1,
            rationale: "Hepat/o = liver, -megaly = enlargement. Hepatomegaly = enlarged liver. This is different from hepatitis (-itis = inflammation).",
          },
          {
            id: "tm2",
            question: "The term 'dyspnea' means:",
            options: ["Fast breathing", "No breathing", "Difficult breathing", "Slow breathing"],
            correctIndex: 2,
            rationale: "Dys- = difficult/abnormal, -pnea = breathing. Dyspnea = difficulty breathing. Compare: tachypnea (fast), apnea (absent), bradypnea (slow).",
          },
          {
            id: "tm3",
            question: "Which suffix means 'surgical removal'?",
            options: ["-otomy", "-ectomy", "-ostomy", "-ology"],
            correctIndex: 1,
            rationale: "-ectomy = surgical removal (appendectomy). -otomy = cutting into (tracheotomy). -ostomy = creating an opening (colostomy). -ology = study of.",
          },
        ]}
      />
    </div>
  );
}

function PharmacologyModule() {
  const { isEditing, sections, updateSection } = useModuleEdit();
  const { t, language } = useI18n();
  const rs = (key: string, def: string) => {
    if (sections[key]?.content) return sections[key].content!;
    if (language !== "en") { const k = `prenursing.${key}`; const v = t(k); if (v !== k) return v; }
    return def;
  };
  return (
    <div className="space-y-8" data-testid="module-pharmacology">
      <div>
        <EditableModuleText sectionKey="pharm-title" defaultText="Intro Pharmacology" as="h2" className="text-2xl font-bold text-slate-800 mb-2" />
        <EditableModuleText sectionKey="pharm-desc" defaultText="Understand how drugs interact with the body at the receptor level: the foundation for medication safety." as="p" className="text-slate-500" multiline />
      </div>

      <MicroLesson title={rs("pharm-receptor-title", "Drug-Receptor Basics")} subtitle={rs("pharm-receptor-subtitle", "How medications produce their effects")} icon={<Pill className="w-5 h-5" />}>
        {isEditing && (
          <div className="flex gap-2 mb-2">
            <input value={sections["pharm-receptor-title"]?.content || "Drug-Receptor Basics"} onChange={(e) => updateSection("pharm-receptor-title", { content: e.target.value })} className="flex-1 bg-white/80 border border-purple-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-purple-300 focus:outline-none" placeholder={t("pages.preNursing.sectionTitle6")} />
            <input value={sections["pharm-receptor-subtitle"]?.content || "How medications produce their effects"} onChange={(e) => updateSection("pharm-receptor-subtitle", { content: e.target.value })} className="flex-1 bg-white/80 border border-purple-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-purple-300 focus:outline-none" placeholder={t("pages.preNursing.subtitle6")} />
          </div>
        )}
        <EditableModuleText sectionKey="pharm-receptor-content" defaultText="Most drugs work by binding to receptors on cells. The drug-receptor interaction determines whether the drug activates or blocks a cellular response." as="p" className="text-sm text-slate-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <p className="text-sm font-semibold text-emerald-700 mb-1">{t("pages.preNursing.agonist")}</p>
            <EditableModuleText sectionKey="pharm-agonist" defaultText="Binds to receptor and ACTIVATES it. Mimics the natural ligand. Example: Morphine (opioid agonist)" as="p" className="text-xs text-emerald-600" multiline />
          </div>
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-100">
            <p className="text-sm font-semibold text-red-700 mb-1">{t("pages.preNursing.antagonist")}</p>
            <EditableModuleText sectionKey="pharm-antagonist" defaultText="Binds to receptor and BLOCKS it. Prevents the natural ligand from activating. Example: Naloxone (opioid antagonist)" as="p" className="text-xs text-red-600" multiline />
          </div>
        </div>
        <CognitiveCard
          type="tip"
          title={t("pages.preNursing.clinicalConnection2")}
          content={rs("pharm-receptor-clinical", "Naloxone reverses opioid overdose by competing for the same receptors. It's an antagonist that displaces the agonist (morphine/fentanyl) from opioid receptors.")}
        />
        {isEditing && (
          <RichTextEditor value={sections["pharm-receptor-clinical"]?.content || "Naloxone reverses opioid overdose by competing for the same receptors. It's an antagonist that displaces the agonist (morphine/fentanyl) from opioid receptors."} onChange={(v) => updateSection("pharm-receptor-clinical", { content: v })} className="mt-2" minHeight="60px" placeholder={t("pages.preNursing.clinicalConnection3")} />
        )}
      </MicroLesson>

      <div className="my-6 rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
        <img src={imgPharmAbsorption} alt={t("pages.preNursing.drugAbsorptionRoutesOralIntravenous")} className="w-full h-auto object-contain p-2 md:p-4 max-h-[400px]" loading="lazy" data-testid="img-pharm-absorption" />
        <p className="text-xs text-gray-500 text-center pb-3 px-4 italic">{t("pages.preNursing.drugAbsorptionRoutesShowingHow")}</p>
      </div>

      <MicroLesson title={rs("pharmacokineticsTitle", "Pharmacokinetics Overview")} subtitle={rs("pharmacokineticsSubtitle", "What the body does to the drug")} icon={<FlaskConical className="w-5 h-5" />}>
        <ProgressiveReveal
          title=""
          cards={[
            { id: "pk1", title: "Absorption", summary: "Drug enters the bloodstream", detail: "Route of administration affects speed: IV = immediate, IM = moderate, PO = slowest. Bioavailability measures how much drug reaches systemic circulation." },
            { id: "pk2", title: "Distribution", summary: "Drug travels to target tissues", detail: "Protein binding (albumin) affects free drug levels. Only unbound drug is pharmacologically active. Highly protein-bound drugs have drug interaction risks." },
            { id: "pk3", title: "Metabolism", summary: "Drug is broken down (primarily liver)", detail: "Cytochrome P450 enzymes in the liver metabolize most drugs. Liver disease, age, and drug interactions can alter metabolism speed." },
            { id: "pk4", title: "Excretion", summary: "Drug is eliminated (primarily kidneys)", detail: "Renal clearance is the main excretion route. Monitor creatinine/GFR. Dose adjustments needed for renal impairment to prevent toxicity." },
          ]}
        />
      </MicroLesson>

      <div className="my-6 rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
        <img src={imgPharmPK} alt={t("pages.preNursing.pharmacokineticsPathwayDrugJourneyThrough")} className="w-full h-auto object-contain p-2 md:p-4 max-h-[400px]" loading="lazy" data-testid="img-pharm-pk" />
        <p className="text-xs text-gray-500 text-center pb-3 px-4 italic">{t("pages.preNursing.pharmacokineticsTheFourstepJourneyOf")}</p>
      </div>

      <SelfCheckQuiz title={t("pages.preNursing.pharmacologyCheck")} questions={pharmQuiz} />
    </div>
  );
}

function PathophysiologyModule() {
  const { isEditing, sections, updateSection } = useModuleEdit();
  const { t, language } = useI18n();
  const rs = (key: string, def: string) => {
    if (sections[key]?.content) return sections[key].content!;
    if (language !== "en") { const k = `prenursing.${key}`; const v = t(k); if (v !== k) return v; }
    return def;
  };
  return (
    <div className="space-y-8" data-testid="module-pathophysiology">
      <div>
        <EditableModuleText sectionKey="patho-title" defaultText="Intro Pathophysiology" as="h2" className="text-2xl font-bold text-slate-800 mb-2" />
        <EditableModuleText sectionKey="patho-desc" defaultText="Learn to think like a clinician: trace disease mechanisms, recognize compensation, and differentiate early from late signs." as="p" className="text-slate-500" multiline />
      </div>

      <MicroLesson title={rs("patho-disease-title", "Disease = Disrupted Homeostasis")} subtitle={rs("patho-disease-subtitle", "Understanding why symptoms happen")} icon={<Stethoscope className="w-5 h-5" />}>
        {isEditing && (
          <div className="flex gap-2 mb-2">
            <input value={sections["patho-disease-title"]?.content || "Disease = Disrupted Homeostasis"} onChange={(e) => updateSection("patho-disease-title", { content: e.target.value })} className="flex-1 bg-white/80 border border-purple-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-purple-300 focus:outline-none" placeholder={t("pages.preNursing.sectionTitle7")} />
            <input value={sections["patho-disease-subtitle"]?.content || "Understanding why symptoms happen"} onChange={(e) => updateSection("patho-disease-subtitle", { content: e.target.value })} className="flex-1 bg-white/80 border border-purple-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-purple-300 focus:outline-none" placeholder={t("pages.preNursing.subtitle7")} />
          </div>
        )}
        <EditableModuleText sectionKey="patho-disease-content" defaultText="Every disease is a story of homeostasis being disrupted. The body compensates to maintain function, but eventually those mechanisms fail. Understanding this progression is the key to clinical reasoning." as="p" className="text-sm text-slate-600 leading-relaxed" multiline />
        <div className="flex flex-col sm:flex-row gap-3 mt-3">
          <div className="flex-1 p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 text-center">
            <p className="text-xs font-bold text-emerald-700 mb-1">{t("pages.preNursing.earlySigns")}</p>
            <p className="text-xs text-emerald-600">{t("pages.preNursing.compensatoryResponses")}</p>
            <p className="text-[10px] text-emerald-500 mt-1">{t("pages.preNursing.tachycardiaMildAnxietySlightBp")}</p>
          </div>
          <div className="flex items-center justify-center text-gray-300">→</div>
          <div className="flex-1 p-4 bg-amber-50/60 rounded-xl border border-amber-100 text-center">
            <p className="text-xs font-bold text-amber-700 mb-1">{t("pages.preNursing.progressive")}</p>
            <p className="text-xs text-amber-600">{t("pages.preNursing.compensationStraining")}</p>
            <p className="text-[10px] text-amber-500 mt-1">{t("pages.preNursing.wideningPulsePressureConfusionOliguria")}</p>
          </div>
          <div className="flex items-center justify-center text-gray-300">→</div>
          <div className="flex-1 p-4 bg-red-50/60 rounded-xl border border-red-100 text-center">
            <p className="text-xs font-bold text-red-700 mb-1">{t("pages.preNursing.lateDecompensation")}</p>
            <p className="text-xs text-red-600">{t("pages.preNursing.mechanismsFailing")}</p>
            <p className="text-[10px] text-red-500 mt-1">{t("pages.preNursing.hypotensionUnresponsiveOrganFailure")}</p>
          </div>
        </div>
        <CognitiveCard
          type="warning"
          title={t("pages.preNursing.examTrap")}
          content={rs("patho-exam-trap", "Exams test whether you can recognize EARLY signs (when intervention matters most), not late signs (when it may be too late). Tachycardia is often the first sign of deterioration.")}
        />
        {isEditing && (
          <RichTextEditor value={sections["patho-exam-trap"]?.content || "Exams test whether you can recognize EARLY signs (when intervention matters most), not late signs (when it may be too late). Tachycardia is often the first sign of deterioration."} onChange={(v) => updateSection("patho-exam-trap", { content: v })} className="mt-2" minHeight="60px" placeholder={t("pages.preNursing.examTrapContent")} />
        )}
      </MicroLesson>

      <SpotAbnormality
        title={t("pages.preNursing.spotTheAbnormalFindings")}
        scenario="A 68-year-old patient was admitted 2 hours ago with complaints of increasing shortness of breath and chest tightness. The nurse obtains the following assessment findings:"
        findings={pathoFindings}
      />

      <AnatomyLabeling
        title={t("pages.preNursing.respiratoryAnatomyClickToIdentify")}
        description={t("pages.preNursing.identifyTheMajorRespiratoryStructures")}
        backgroundImage={lungsAnatomyImage}
        labels={lungLabels}
        width={600}
        height={450}
      />

      <MicroLesson title={rs("compensationTitle", "Compensation Mechanisms")} subtitle={rs("compensationSubtitle", "How the body buys time")} icon={<Lightbulb className="w-5 h-5" />}>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-purple-50/60 rounded-xl border border-purple-200 p-4">
            <div className="flex justify-center mb-3">
              <img src={brainAnatomyImage} alt={t("pages.preNursing.brainSagittalCrosssectionShowingCerebrum")} className="w-full max-w-[200px] h-auto rounded-lg" loading="lazy" data-testid="img-brain-anatomy" />
            </div>
            <h4 className="font-semibold text-sm text-purple-800 mb-1">{t("pages.preNursing.brainMedullaOblongata")}</h4>
            <p className="text-xs text-slate-600">{t("pages.preNursing.theBrainstemControlsAutonomicCardiovascular")}</p>
          </div>
          <div className="bg-amber-50/60 rounded-xl border border-amber-200 p-4">
            <div className="flex justify-center mb-3">
              <img src={kidneyAnatomyImage} alt={t("pages.preNursing.kidneyCrosssectionShowingCortexMedulla")} className="w-full max-w-[200px] h-auto rounded-lg" loading="lazy" data-testid="img-kidney-anatomy" />
            </div>
            <h4 className="font-semibold text-sm text-amber-800 mb-1">{t("pages.preNursing.kidney")}</h4>
            <p className="text-xs text-slate-600">{t("pages.preNursing.theKidneysRegulateFluidBalance")}</p>
          </div>
        </div>
        <ProgressiveReveal
          title=""
          cards={[
            { id: "c1", title: "Cardiovascular Compensation", summary: "Heart rate and vessel tone adjust", detail: "When cardiac output drops, the sympathetic nervous system increases heart rate (tachycardia) and causes vasoconstriction to maintain blood pressure. This is why tachycardia is an early warning sign." },
            { id: "c2", title: "Respiratory Compensation", summary: "Breathing rate and depth adjust", detail: "In metabolic acidosis, the lungs blow off CO2 faster (Kussmaul breathing) to raise pH. In respiratory failure, increased rate is an early compensatory sign." },
            { id: "c3", title: "Renal Compensation", summary: "Kidneys adjust fluid and acid-base balance", detail: "The kidneys can retain or excrete HCO3⁻ and H+ to correct pH, and adjust sodium/water retention to maintain blood volume. This process takes 24-48 hours." },
          ]}
        />
      </MicroLesson>

      <SelfCheckQuiz
        title={t("pages.preNursing.pathophysiologyCheck")}
        questions={[
          {
            id: "pp1",
            question: "Which is typically an EARLY sign of patient deterioration?",
            options: ["Hypotension", "Tachycardia", "Unresponsiveness", "Cardiac arrest"],
            correctIndex: 1,
            rationale: "Tachycardia is usually the FIRST compensatory sign. The heart speeds up to maintain cardiac output before blood pressure drops. By the time hypotension occurs, compensation is already failing.",
            hint: "Think about what happens first when the body tries to maintain perfusion.",
          },
          {
            id: "pp2",
            question: "A patient is breathing rapidly (RR 28) with a pH of 7.48. The body is likely:",
            options: ["Compensating for metabolic acidosis", "In respiratory alkalosis", "Compensating for metabolic alkalosis", "In respiratory acidosis"],
            correctIndex: 1,
            rationale: "pH > 7.45 = alkalosis. Rapid breathing blows off CO2 → less carbonic acid → higher pH. This is primary respiratory alkalosis (e.g., from hyperventilation, anxiety, or pain).",
          },
        ]}
      />
    </div>
  );
}
