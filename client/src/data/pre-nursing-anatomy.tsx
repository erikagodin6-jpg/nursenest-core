import { useI18n } from "@/lib/i18n";
import {
  MicroLesson,
  CognitiveCard,
  HoverReveal,
  MatchingExercise,
  SelfCheckQuiz,
  ProgressiveReveal,
} from "@/components/interactive-learning";
import { EditableModuleText, useEditableText } from "@/components/module-edit-context";
import {
  Bone,
  Brain,
  Heart,
  Shield,
  Zap,
  Activity,
  Layers,
  CircleDot,
  Droplets,
  Dumbbell,
  Network,
  Sparkles,
  Wind,
  Utensils,
  Droplet,
} from "lucide-react";

const structuralQuiz: import("@/components/interactive-learning").QuizQuestion[] = [
  {
    id: "so1",
    question: "Which level of structural organization involves groups of cells working together to perform a specific function?",
    options: ["Cellular level", "Tissue level", "Organ level", "Organ system level"],
    correctIndex: 1,
    rationale: "Tissues are groups of similar cells that work together to carry out a particular function. For example, epithelial tissue lines body surfaces. Organs are composed of two or more tissue types working together.",
  },
  {
    id: "so2",
    question: "A patient is lying face up with arms at sides and palms facing forward. This describes:",
    options: ["Prone position", "Anatomical position", "Lateral recumbent", "Trendelenburg position"],
    correctIndex: 1,
    rationale: "Anatomical position is the universal reference position: standing upright, facing forward, arms at sides, palms facing anteriorly. All directional terms are based on this standard position to avoid confusion in clinical communication.",
  },
  {
    id: "so3",
    question: "Negative feedback mechanisms work by:",
    options: [
      "Amplifying the initial stimulus",
      "Reversing the direction of change to maintain homeostasis",
      "Creating a positive loop that increases output",
      "Shutting down all body systems temporarily",
    ],
    correctIndex: 1,
    rationale: "Negative feedback opposes the initial change, bringing the variable back toward the set point. Example: when body temperature rises, sweating activates to cool the body back down. Most homeostatic mechanisms use negative feedback.",
    hint: "Think of a thermostat — when it gets too hot, the AC turns on to bring temperature back down.",
  },
  {
    id: "so4",
    question: "Which body plane divides the body into anterior and posterior portions?",
    options: ["Sagittal plane", "Frontal (coronal) plane", "Transverse plane", "Oblique plane"],
    correctIndex: 1,
    rationale: "The frontal (coronal) plane divides the body into front (anterior) and back (posterior) portions. The sagittal plane divides into left and right. The transverse (horizontal) plane divides into superior and inferior.",
  },
];

const cellTissueQuiz: import("@/components/interactive-learning").QuizQuestion[] = [
  {
    id: "ct1",
    question: "A nurse hangs a 0.45% NaCl (hypotonic) IV solution. What will happen to the patient's red blood cells?",
    options: ["Crenate (shrink)", "Swell and potentially lyse", "No change", "Clump together"],
    correctIndex: 1,
    rationale: "Hypotonic solutions have lower solute concentration than inside the cell. Water moves INTO the cell by osmosis, causing it to swell. Excessive swelling can lead to hemolysis (cell bursting). This is why hypotonic solutions must be infused carefully.",
    hint: "Water follows solute — or more precisely, water moves toward higher solute concentration.",
  },
  {
    id: "ct2",
    question: "The Na+/K+ pump moves:",
    options: [
      "3 Na+ out, 2 K+ in per ATP",
      "2 Na+ out, 3 K+ in per ATP",
      "3 Na+ in, 2 K+ out per ATP",
      "Equal amounts of Na+ and K+ in both directions",
    ],
    correctIndex: 0,
    rationale: "The Na+/K+ ATPase pumps 3 sodium ions OUT and 2 potassium ions IN per ATP molecule consumed. This maintains the electrochemical gradient essential for nerve impulses, muscle contraction, and cell volume regulation.",
  },
  {
    id: "ct3",
    question: "Which tissue type lines the respiratory tract and moves mucus via cilia?",
    options: ["Simple squamous epithelium", "Pseudostratified ciliated columnar epithelium", "Stratified squamous epithelium", "Transitional epithelium"],
    correctIndex: 1,
    rationale: "Pseudostratified ciliated columnar epithelium lines the respiratory tract. The cilia beat in coordinated waves (mucociliary escalator) to move mucus and trapped particles toward the throat for elimination. Smoking damages these cilia, increasing infection risk.",
  },
  {
    id: "ct4",
    question: "Active transport differs from passive transport because active transport:",
    options: [
      "Moves solutes down the concentration gradient",
      "Requires ATP energy to move solutes against the concentration gradient",
      "Does not require membrane proteins",
      "Only moves water molecules",
    ],
    correctIndex: 1,
    rationale: "Active transport uses cellular energy (ATP) to move substances against their concentration gradient — from low to high concentration. Passive transport (diffusion, osmosis, facilitated diffusion) requires no energy and moves substances down the gradient.",
  },
  {
    id: "ct5",
    question: "A cell exposed to chronic low-level irritation may undergo:",
    options: ["Immediate necrosis", "Adaptive changes such as metaplasia", "Mitosis arrest", "Immediate apoptosis"],
    correctIndex: 1,
    rationale: "Cells adapt to chronic stress through metaplasia (change in cell type), hypertrophy (increased size), hyperplasia (increased number), or atrophy (decreased size). Metaplasia is reversible if the irritant is removed. Example: smoker's bronchial epithelium changes from columnar to squamous.",
  },
];

const integumentaryQuiz: import("@/components/interactive-learning").QuizQuestion[] = [
  {
    id: "ig1",
    question: "A nurse assesses a patient and finds decreased skin turgor. This finding most likely indicates:",
    options: ["Fluid overload", "Dehydration", "Infection", "Allergic reaction"],
    correctIndex: 1,
    rationale: "Skin turgor is assessed by gently pinching skin (often on the sternum or forearm). Skin that remains tented indicates dehydration — reduced interstitial fluid causes decreased elasticity. Poor turgor in elderly patients may be normal due to loss of collagen.",
    hint: "Turgor reflects the hydration status of the interstitial tissue.",
  },
  {
    id: "ig2",
    question: "During the proliferative phase of wound healing, the primary activity is:",
    options: ["Blood clot formation", "Inflammatory response", "New tissue formation (granulation)", "Scar remodeling"],
    correctIndex: 2,
    rationale: "The proliferative phase (days 3-21) involves granulation tissue formation, angiogenesis (new blood vessels), and epithelialization. Fibroblasts produce collagen to rebuild the wound matrix. This follows the inflammatory phase and precedes the maturation/remodeling phase.",
  },
  {
    id: "ig3",
    question: "The primary mechanism by which the skin helps regulate body temperature is:",
    options: ["Melanin production", "Vasodilation/vasoconstriction of dermal blood vessels and sweating", "Keratin synthesis", "Sebum secretion"],
    correctIndex: 1,
    rationale: "Thermoregulation via the skin involves vasodilation (increases blood flow to surface for heat loss) and vasoconstriction (decreases surface blood flow to conserve heat), along with sweat production for evaporative cooling. This is controlled by the hypothalamus.",
  },
];

const skeletalQuiz: import("@/components/interactive-learning").QuizQuestion[] = [
  {
    id: "sk1",
    question: "Which cells are responsible for bone resorption (breaking down bone)?",
    options: ["Osteoblasts", "Osteocytes", "Osteoclasts", "Chondrocytes"],
    correctIndex: 2,
    rationale: "Osteoclasts break down bone tissue (resorption), releasing calcium into the blood. Osteoblasts build new bone. Osteocytes are mature bone cells that maintain the matrix. The balance between osteoclast and osteoblast activity determines bone density.",
  },
  {
    id: "sk2",
    question: "A patient's serum calcium is critically low. Which hormone would the body release to correct this?",
    options: ["Calcitonin", "Parathyroid hormone (PTH)", "Insulin", "Cortisol"],
    correctIndex: 1,
    rationale: "PTH is released by the parathyroid glands in response to low blood calcium. PTH stimulates osteoclast activity (releasing calcium from bone), increases renal calcium reabsorption, and promotes vitamin D activation. Calcitonin has the opposite effect — it lowers blood calcium.",
    hint: "Think 'PTH = Pushes calcium To High levels.'",
  },
  {
    id: "sk3",
    question: "Synovial joints are characterized by:",
    options: [
      "Lack of a joint cavity",
      "A fluid-filled joint cavity with articular cartilage",
      "Bones fused together",
      "Cartilage connecting bones directly",
    ],
    correctIndex: 1,
    rationale: "Synovial joints have a joint cavity filled with synovial fluid that lubricates and nourishes articular cartilage. They are the most movable joint type. Examples include the knee, shoulder, and hip. The synovial membrane produces the lubricating fluid.",
  },
  {
    id: "sk4",
    question: "The axial skeleton includes:",
    options: [
      "Arms and legs",
      "Skull, vertebral column, and rib cage",
      "Pelvic girdle and lower limbs",
      "Shoulder girdle and upper limbs",
    ],
    correctIndex: 1,
    rationale: "The axial skeleton (80 bones) forms the central axis: skull, vertebral column, ribs, and sternum. It protects the brain, spinal cord, and thoracic organs. The appendicular skeleton (126 bones) includes the limbs and girdles.",
  },
];

const muscularQuiz: import("@/components/interactive-learning").QuizQuestion[] = [
  {
    id: "mu1",
    question: "The sliding filament theory describes muscle contraction as:",
    options: [
      "Muscle fibers shortening by folding in half",
      "Actin and myosin filaments sliding past each other, shortening the sarcomere",
      "Muscle cells dividing to create more force",
      "Calcium leaving the muscle cell",
    ],
    correctIndex: 1,
    rationale: "During contraction, myosin heads bind to actin (forming cross-bridges) and pull the thin filaments toward the center of the sarcomere. The filaments themselves don't shorten — they slide past each other. This requires calcium (to expose binding sites) and ATP (for cross-bridge cycling).",
  },
  {
    id: "mu2",
    question: "At the neuromuscular junction, the neurotransmitter released is:",
    options: ["Norepinephrine", "Dopamine", "Acetylcholine (ACh)", "Serotonin"],
    correctIndex: 2,
    rationale: "Acetylcholine is released from motor neurons at the neuromuscular junction. It binds to nicotinic receptors on the muscle fiber, triggering depolarization and ultimately muscle contraction. Myasthenia gravis involves antibodies that block these ACh receptors.",
  },
  {
    id: "mu3",
    question: "Muscle fatigue during prolonged exercise is primarily caused by:",
    options: [
      "Excess calcium in the blood",
      "Accumulation of metabolic byproducts and ATP depletion",
      "Increased oxygen supply",
      "Excessive protein synthesis",
    ],
    correctIndex: 1,
    rationale: "Muscle fatigue results from depletion of ATP and creatine phosphate stores, accumulation of lactic acid and inorganic phosphate, and electrolyte imbalances. When oxygen supply is insufficient for aerobic metabolism, anaerobic pathways produce lactic acid, contributing to the sensation of fatigue.",
  },
];

const nervousQuiz: import("@/components/interactive-learning").QuizQuestion[] = [
  {
    id: "ns1",
    question: "During an action potential, the rapid depolarization phase is caused by:",
    options: [
      "Potassium rushing out of the cell",
      "Sodium rushing into the cell through voltage-gated channels",
      "Chloride entering the cell",
      "Calcium leaving the cell",
    ],
    correctIndex: 1,
    rationale: "When threshold is reached, voltage-gated sodium channels open rapidly, allowing Na+ to flood into the cell. This causes the membrane potential to spike from -70mV toward +30mV (depolarization). Voltage-gated potassium channels then open for repolarization.",
    hint: "Na+ channels open first and fast (depolarization), K+ channels open later (repolarization).",
  },
  {
    id: "ns2",
    question: "The sympathetic nervous system is often called the 'fight or flight' system because it:",
    options: [
      "Promotes digestion and rest",
      "Increases heart rate, dilates bronchioles, and redirects blood to skeletal muscles",
      "Slows heart rate and constricts pupils",
      "Only activates during sleep",
    ],
    correctIndex: 1,
    rationale: "Sympathetic activation prepares the body for emergency action: increased HR, BP, and respiration; bronchodilation; pupil dilation; blood shunted from GI tract to muscles; glycogen converted to glucose. The parasympathetic system does the opposite ('rest and digest').",
  },
  {
    id: "ns3",
    question: "A synapse transmits signals from one neuron to the next by releasing:",
    options: ["Hormones into the blood", "Electrical current across the gap", "Neurotransmitters into the synaptic cleft", "Red blood cells"],
    correctIndex: 2,
    rationale: "At chemical synapses, the presynaptic neuron releases neurotransmitters (stored in vesicles) into the synaptic cleft. These bind to receptors on the postsynaptic neuron, generating excitatory or inhibitory signals. This is the basis for nearly all neural communication.",
  },
  {
    id: "ns4",
    question: "The resting membrane potential of a neuron is approximately:",
    options: ["+30 mV", "0 mV", "-70 mV", "-90 mV"],
    correctIndex: 2,
    rationale: "At rest, the inside of a neuron is approximately -70mV relative to outside, maintained by the Na+/K+ pump (3 Na+ out, 2 K+ in) and K+ leak channels. This negative resting potential is essential — the neuron must be 'charged' to fire an action potential.",
  },
];

const endocrineQuiz: import("@/components/interactive-learning").QuizQuestion[] = [
  {
    id: "en1",
    question: "The primary mechanism for controlling most hormone levels in the body is:",
    options: ["Positive feedback", "Negative feedback", "Neural stimulation only", "Circadian rhythm only"],
    correctIndex: 1,
    rationale: "Negative feedback is the dominant control mechanism: when hormone levels rise above the set point, signals inhibit further release. Example: rising blood glucose triggers insulin release; as glucose drops, insulin secretion decreases. This prevents dangerous extremes.",
  },
  {
    id: "en2",
    question: "A patient with Type 1 diabetes cannot produce insulin because of:",
    options: [
      "Insulin receptor resistance",
      "Autoimmune destruction of pancreatic beta cells",
      "Excess glucagon production",
      "Liver failure",
    ],
    correctIndex: 1,
    rationale: "Type 1 diabetes is an autoimmune condition where the immune system destroys the insulin-producing beta cells of the pancreatic islets of Langerhans. Without beta cells, the body cannot produce insulin, requiring exogenous insulin administration.",
    hint: "Type 1 = autoimmune destruction; Type 2 = insulin resistance.",
  },
  {
    id: "en3",
    question: "The 'master gland' that regulates many other endocrine glands is the:",
    options: ["Thyroid gland", "Adrenal gland", "Pituitary gland", "Pineal gland"],
    correctIndex: 2,
    rationale: "The pituitary gland (hypophysis), controlled by the hypothalamus, releases hormones that regulate the thyroid (TSH), adrenals (ACTH), gonads (FSH/LH), growth (GH), and more. The hypothalamus-pituitary axis is the central command center of the endocrine system.",
  },
  {
    id: "en4",
    question: "During the stress response, cortisol is released from the:",
    options: ["Anterior pituitary", "Adrenal medulla", "Adrenal cortex", "Thyroid gland"],
    correctIndex: 2,
    rationale: "Cortisol is released from the adrenal cortex in response to ACTH from the anterior pituitary. It raises blood glucose, suppresses immune function, and helps the body cope with stress. Chronic cortisol elevation can cause Cushing syndrome. The adrenal medulla releases epinephrine/norepinephrine.",
  },
];

const bodySystemsQuiz: import("@/components/interactive-learning").QuizQuestion[] = [
  {
    id: "bs1",
    question: "Blood returning from the body enters the heart through the:",
    options: ["Left atrium via pulmonary veins", "Right atrium via superior and inferior venae cavae", "Left ventricle via the aorta", "Right ventricle via the pulmonary trunk"],
    correctIndex: 1,
    rationale: "Deoxygenated blood from systemic circulation returns to the right atrium via the superior vena cava (from the head and upper body) and inferior vena cava (from the lower body). From the right atrium, blood passes through the tricuspid valve into the right ventricle.",
    hint: "Think: 'Right receives returning blood.'",
  },
  {
    id: "bs2",
    question: "Gas exchange in the lungs occurs at the:",
    options: ["Bronchi", "Bronchioles", "Alveoli", "Trachea"],
    correctIndex: 2,
    rationale: "Alveoli are the tiny, thin-walled air sacs at the terminal ends of the respiratory tree. Their single-cell-thick walls (type I pneumocytes) and dense surrounding capillary network provide a massive surface area (~70 m\u00B2) for efficient diffusion of O\u2082 into and CO\u2082 out of the blood.",
  },
  {
    id: "bs3",
    question: "The primary site of nutrient absorption in the gastrointestinal tract is the:",
    options: ["Stomach", "Small intestine", "Large intestine", "Esophagus"],
    correctIndex: 1,
    rationale: "The small intestine (especially the jejunum and ileum) is the primary site of nutrient absorption. Its enormous surface area is created by circular folds (plicae circulares), villi, and microvilli (brush border). The large intestine primarily absorbs water and electrolytes.",
    hint: "Villi and microvilli dramatically increase the absorptive surface area of this organ.",
  },
  {
    id: "bs4",
    question: "The functional unit of the kidney responsible for urine formation is the:",
    options: ["Renal pelvis", "Nephron", "Collecting duct", "Renal cortex"],
    correctIndex: 1,
    rationale: "Each kidney contains approximately 1 million nephrons. Each nephron consists of a glomerulus (filtration), proximal convoluted tubule (reabsorption), loop of Henle (concentration gradient), and distal convoluted tubule (secretion and fine-tuning). The nephron is the structural and functional unit of the kidney.",
  },
  {
    id: "bs5",
    question: "During normal quiet inspiration, the diaphragm:",
    options: ["Relaxes and moves superiorly", "Contracts and moves inferiorly (flattens)", "Remains stationary", "Contracts and moves superiorly"],
    correctIndex: 1,
    rationale: "During inspiration, the diaphragm contracts and flattens (moves inferiorly), increasing the volume of the thoracic cavity. This decreases intrapleural and intrapulmonary pressure, creating a pressure gradient that draws air into the lungs. The external intercostals also assist by elevating the ribs.",
  },
];

export function AnatomyPhysiologyModule() {
  const { t } = useI18n();
  const levelsOrganizationClinical = useEditableText("preanat-levels-clinical", "Disease can originate at any level and cascade upward. A molecular mutation (chemical level) can impair cell function (cellular), damage tissue, compromise an organ, and ultimately affect the whole organism. Understanding this hierarchy helps you trace symptoms back to root causes.");
  const directionalClinical = useEditableText("preanat-directional-clinical", "Precise anatomical language prevents medical errors. 'The wound is on the medial aspect of the right lower leg, 3 cm distal to the knee' is far more useful than 'the wound is on the inside of the leg near the knee.' Always use directional terms in documentation.");
  const homeostasisFeedback = useEditableText("preanat-homeostasis-feedback", "Every feedback loop has three components: (1) Receptor — detects the change (sensor), (2) Control Center — processes information and determines response (often the brain), (3) Effector — carries out the corrective action (muscle, gland). Failure at any component disrupts homeostasis.");
  const cellularComm = useEditableText("preanat-cellular-comm", "Cells communicate via direct contact (gap junctions), chemical signals (hormones, neurotransmitters, paracrines), and electrical signals (neurons). Autocrine signals act on the same cell; paracrine signals act on nearby cells; endocrine signals travel via blood to distant targets. Understanding communication modes explains how drugs, diseases, and therapies work at the cellular level.");
  const transportGradient = useEditableText("preanat-transport-gradient", "The electrochemical gradient combines the concentration gradient (chemical) with the electrical gradient (charge difference across the membrane). The Na+/K+ pump creates both: more Na+ outside (chemical) and net negative charge inside (electrical). This stored energy drives nerve impulses, muscle contraction, and secondary active transport (e.g., glucose co-transport in the intestine).");
  const receptorsDrugs = useEditableText("preanat-receptors-drugs", "Agonists mimic the natural ligand and activate the receptor (e.g., albuterol mimics epinephrine at beta-2 receptors → bronchodilation). Antagonists block the receptor without activating it (e.g., propranolol blocks beta receptors → decreased heart rate). Understanding receptor pharmacology is the foundation of safe medication administration.");
  const tissueAdaptation = useEditableText("preanat-tissue-adaptation", "Cells respond to stress through adaptive changes: Atrophy (decreased size — muscle wasting from disuse), Hypertrophy (increased size — cardiac enlargement from hypertension), Hyperplasia (increased number — endometrial thickening), Metaplasia (change in type — smoker's bronchial cells). If stress exceeds adaptive capacity, irreversible injury leads to necrosis (pathological death) or apoptosis (programmed death).");
  const skinTurgor = useEditableText("preanat-skin-turgor", "Skin turgor assesses hydration status. When skin is gently pinched and released, well-hydrated tissue returns immediately to its normal position. Tenting (skin remains raised) indicates dehydration — decreased interstitial fluid reduces skin elasticity. Assess on the sternum or inner forearm; elderly patients' decreased collagen makes extremity turgor unreliable. Insensible water loss through the skin is approximately 300-400 mL/day and increases dramatically with burns, fever, and low humidity.");
  const boneTypes = useEditableText("preanat-bone-types", "Long bones (femur, humerus) — levers for movement. Short bones (carpals, tarsals) — gliding movements. Flat bones (skull, sternum, pelvis) — protection and hematopoiesis. Irregular bones (vertebrae, facial bones) — complex shapes for specific functions. Sesamoid bones (patella) — develop within tendons to reduce friction.");
  const skeletonAxial = useEditableText("preanat-skeleton-axial", "The axial skeleton (80 bones) forms the central axis: skull (22), hyoid (1), vertebral column (26), thoracic cage (25). It protects the brain, spinal cord, and thoracic organs. The appendicular skeleton (126 bones) includes the pectoral girdle, upper limbs, pelvic girdle, and lower limbs — designed for movement and manipulation. Total: 206 bones in the adult skeleton.");
  const muscleFatigue = useEditableText("preanat-muscle-fatigue", "Isotonic contractions: muscle length changes (concentric = shortening, eccentric = lengthening under tension). Isometric contractions: muscle generates force without length change (holding a heavy object). Muscle fatigue occurs from ATP depletion, lactic acid accumulation, electrolyte imbalances (K+, Ca2+, Na+), and CNS fatigue. Creatine phosphate provides immediate ATP for the first 10-15 seconds of intense activity, then aerobic and anaerobic pathways take over.");
  const synapticTransmission = useEditableText("preanat-synaptic-transmission", "When an action potential reaches the axon terminal: (1) voltage-gated Ca2+ channels open, (2) Ca2+ influx triggers vesicle fusion with the membrane, (3) neurotransmitters are released into the synaptic cleft (exocytosis), (4) neurotransmitters bind postsynaptic receptors, (5) excitatory or inhibitory response generated. The signal is terminated by reuptake, enzymatic breakdown, or diffusion. Most psychiatric and neurological drugs target these synaptic mechanisms.");
  const neurotransmittersText = useEditableText("preanat-neurotransmitters", "Acetylcholine (ACh): muscle contraction, parasympathetic effects, memory. Norepinephrine: sympathetic 'fight or flight,' alertness. Dopamine: reward, movement (Parkinson's = dopamine deficiency). Serotonin: mood, sleep, appetite (many antidepressants target serotonin). GABA: main inhibitory NT (benzodiazepines enhance GABA). Glutamate: main excitatory NT. Endorphins: natural pain relief. Understanding these helps you predict drug effects and side effects.");
  const negativeFeedback = useEditableText("preanat-negative-feedback", "Rising hormone levels inhibit further release. Example: Thyroid axis — Hypothalamus releases TRH → Anterior pituitary releases TSH → Thyroid releases T3/T4 → Rising T3/T4 levels inhibit TRH and TSH release (negative feedback). In hypothyroidism, low T3/T4 means TSH is HIGH (no feedback inhibition). In hyperthyroidism, high T3/T4 means TSH is LOW (strong feedback inhibition). This logic applies to most endocrine axes.");
  const cortisolClinical = useEditableText("preanat-cortisol-clinical", "Chronic cortisol elevation (Cushing syndrome): hyperglycemia, immunosuppression, muscle wasting, central obesity, moon face, thin skin, osteoporosis, poor wound healing. Cortisol deficiency (Addison disease): hypoglycemia, hypotension, hyperkalemia, hyponatremia, hyperpigmentation, fatigue. Exogenous corticosteroids (prednisone) mimic cortisol — never stop abruptly (adrenal suppression → adrenal crisis).");
  const heartAnatomyText = useEditableText("preanat-heart-anatomy", "The left ventricle wall is approximately 3x thicker than the right because it must generate enough pressure to pump blood through the entire systemic circuit. The coronary arteries (right and left) branch from the base of the aorta and supply the myocardium itself with oxygenated blood. The septum separates left and right sides, preventing mixing of oxygenated and deoxygenated blood.");
  const cardiacOutputText = useEditableText("preanat-cardiac-output", "Cardiac output (CO) = Heart Rate (HR) × Stroke Volume (SV). Normal resting CO is approximately 5 L/min. Stroke volume is the amount of blood ejected per beat (~70 mL). CO can increase 4-5x during vigorous exercise through increased HR and SV. Blood pressure = CO × peripheral resistance.");
  const ventilationMechanics = useEditableText("preanat-ventilation", "Inspiration is an ACTIVE process: the diaphragm contracts and flattens, external intercostals elevate the ribs, thoracic volume increases, intrapulmonary pressure drops below atmospheric pressure, and air flows IN (Boyle's law). Quiet expiration is PASSIVE: the diaphragm and intercostals relax, elastic recoil of lungs decreases thoracic volume, intrapulmonary pressure rises above atmospheric pressure, and air flows OUT. Forced expiration recruits internal intercostals and abdominal muscles.");
  const oxygenTransport = useEditableText("preanat-oxygen-transport", "~98.5% of O₂ is transported bound to hemoglobin (as oxyhemoglobin, HbO₂) within red blood cells. ~1.5% is dissolved in plasma. Each hemoglobin molecule can carry up to 4 O₂ molecules. CO₂ transport: ~70% as bicarbonate (HCO₃⁻) in plasma, ~23% bound to hemoglobin (carbaminohemoglobin), ~7% dissolved in plasma.");
  const digestionMechanical = useEditableText("preanat-digestion", "Mechanical digestion physically breaks food into smaller pieces without altering chemical composition — includes mastication (chewing), churning in the stomach, and segmentation in the small intestine. Chemical digestion uses enzymes and other chemicals to break covalent bonds in macromolecules: amylase breaks starch into maltose, pepsin/trypsin break proteins into peptides, lipase breaks triglycerides into fatty acids and monoglycerides, and brush border enzymes complete final digestion at the intestinal wall.");
  const kidneyFunctions = useEditableText("preanat-kidney-functions", "The kidneys do far more than produce urine. They regulate blood volume and pressure (RAAS, ADH), maintain electrolyte balance (Na+, K+, Ca²+, phosphate), regulate acid-base balance (H+ secretion, HCO₃⁻ reabsorption), produce erythropoietin (EPO, stimulates red blood cell production), activate vitamin D (calcitriol, for calcium absorption), and perform gluconeogenesis during prolonged fasting.");

  return (
    <div className="space-y-10" data-testid="module-anatomy-physiology">
      <div>
        <EditableModuleText sectionKey="preanat-title" defaultText="Anatomy & Physiology" as="h2" className="text-2xl font-bold text-gray-900 mb-2" />
        <EditableModuleText sectionKey="preanat-desc" defaultText="Master the structure and function of the human body — from cells and tissues to organ systems — building the foundation for clinical nursing practice." as="p" className="text-gray-600" multiline />
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Layers className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Structural Organization</h3>
        </div>

        <MicroLesson
          title={t("data.pre_nursing_anatomy.levelsOfOrganization")}
          subtitle={t("data.pre_nursing_anatomy.fromAtomsToTheComplete")}
          icon={<Layers className="w-5 h-5" />}
        >
          <EditableModuleText sectionKey="preanat-levels-content" defaultText="The human body is organized in a hierarchy of increasing complexity. Each level of organization builds upon the previous, with emergent properties at each stage that cannot be predicted from the level below alone." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
          <div className="flex flex-col sm:flex-row gap-2 mt-3">
            <div className="flex-1 p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-center">
              <p className="text-[10px] font-bold text-blue-700">Chemical</p>
              <p className="text-[10px] text-blue-600">Atoms & molecules</p>
            </div>
            <div className="flex items-center justify-center text-gray-300">→</div>
            <div className="flex-1 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-center">
              <p className="text-[10px] font-bold text-indigo-700">Cellular</p>
              <p className="text-[10px] text-indigo-600">Basic unit of life</p>
            </div>
            <div className="flex items-center justify-center text-gray-300">→</div>
            <div className="flex-1 p-3 bg-violet-50/60 rounded-xl border border-violet-100 text-center">
              <p className="text-[10px] font-bold text-violet-700">Tissue</p>
              <p className="text-[10px] text-violet-600">Groups of cells</p>
            </div>
            <div className="flex items-center justify-center text-gray-300">→</div>
            <div className="flex-1 p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-center">
              <p className="text-[10px] font-bold text-purple-700">Organ</p>
              <p className="text-[10px] text-purple-600">Multiple tissues</p>
            </div>
            <div className="flex items-center justify-center text-gray-300">→</div>
            <div className="flex-1 p-3 bg-fuchsia-50/60 rounded-xl border border-fuchsia-100 text-center">
              <p className="text-[10px] font-bold text-fuchsia-700">System</p>
              <p className="text-[10px] text-fuchsia-600">Organs working together</p>
            </div>
            <div className="flex items-center justify-center text-gray-300">→</div>
            <div className="flex-1 p-3 bg-pink-50/60 rounded-xl border border-pink-100 text-center">
              <p className="text-[10px] font-bold text-pink-700">Organism</p>
              <p className="text-[10px] text-pink-600">Complete human</p>
            </div>
          </div>
          <CognitiveCard
            type="concept"
            title={t("data.pre_nursing_anatomy.clinicalConnection")}
            content={levelsOrganizationClinical}
          />
        </MicroLesson>

        <MicroLesson
          title={t("data.pre_nursing_anatomy.anatomicalPositionDirectionalTerms")}
          subtitle={t("data.pre_nursing_anatomy.theUniversalLanguageOfAnatomy")}
          icon={<Sparkles className="w-5 h-5" />}
        >
          <EditableModuleText sectionKey="preanat-directional-content" defaultText="All anatomical descriptions reference the anatomical position. Using standardized directional terms ensures clear communication among healthcare providers." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
              <p className="text-xs font-semibold text-blue-700 mb-1">Paired Directional Terms</p>
              <p className="text-xs text-blue-600">Superior/Inferior (above/below) • Anterior/Posterior (front/back) • Medial/Lateral (toward/away from midline) • Proximal/Distal (closer/farther from trunk) • Superficial/Deep (surface/internal)</p>
            </div>
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <p className="text-xs font-semibold text-emerald-700 mb-1">Body Planes & Sections</p>
              <p className="text-xs text-emerald-600">Sagittal (left/right) • Frontal/Coronal (anterior/posterior) • Transverse/Horizontal (superior/inferior). CT scans typically show transverse sections; MRI can show any plane.</p>
            </div>
          </div>
          <CognitiveCard
            type="remember"
            title={t("data.pre_nursing_anatomy.clinicalCommunication")}
            content={directionalClinical}
          />
        </MicroLesson>

        <MicroLesson
          title={t("data.pre_nursing_anatomy.homeostasisFeedbackMechanisms")}
          subtitle={t("data.pre_nursing_anatomy.howTheBodyMaintainsInternal")}
          icon={<Activity className="w-5 h-5" />}
        >
          <EditableModuleText sectionKey="preanat-homeostasis-content" defaultText="Homeostasis is the central organizing principle of physiology. Nearly every disease can be understood as a failure of homeostatic mechanisms." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100">
              <p className="text-xs font-semibold text-teal-700 mb-1">Negative Feedback (Most Common)</p>
              <p className="text-xs text-teal-600">Opposes the initial change, returning the variable toward the set point. Examples: thermoregulation, blood glucose regulation, blood pressure control via baroreceptors.</p>
            </div>
            <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-100">
              <p className="text-xs font-semibold text-rose-700 mb-1">Positive Feedback (Rare)</p>
              <p className="text-xs text-rose-600">Amplifies the initial change until a culminating event occurs. Examples: oxytocin during labor (contractions intensify until delivery), blood clotting cascade, fever in some contexts.</p>
            </div>
          </div>
          <CognitiveCard
            type="warning"
            title={t("data.pre_nursing_anatomy.feedbackComponents")}
            content={homeostasisFeedback}
          />
        </MicroLesson>

        <MicroLesson
          title={t("data.pre_nursing_anatomy.structurefunctionRelationshipsOrganSyste")}
          subtitle={t("data.pre_nursing_anatomy.howAnatomyDictatesPhysiology")}
          icon={<Network className="w-5 h-5" />}
        >
          <EditableModuleText sectionKey="preanat-structure-function-content" defaultText="The principle of complementarity of structure and function is fundamental — you can predict a structure's function by examining its anatomy, and vice versa." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
          <ProgressiveReveal
            title={t("data.pre_nursing_anatomy.11OrganSystemsOverview")}
            cards={[
              {
                id: "os1",
                title: "Integumentary & Skeletal",
                summary: "Protection, support, movement framework",
                detail: "Integumentary: skin, hair, nails — protection, thermoregulation, vitamin D synthesis. Skeletal: 206 bones — support, protection of organs, mineral storage, blood cell production (hematopoiesis).",
              },
              {
                id: "os2",
                title: "Muscular & Nervous",
                summary: "Movement and control/communication",
                detail: "Muscular: skeletal, smooth, cardiac — movement, posture, heat production. Nervous: brain, spinal cord, nerves — rapid electrochemical communication, sensation, integration, motor control.",
              },
              {
                id: "os3",
                title: "Endocrine & Cardiovascular",
                summary: "Hormonal regulation and transport",
                detail: "Endocrine: glands secreting hormones — slow but prolonged chemical regulation. Cardiovascular: heart and blood vessels — transport oxygen, nutrients, wastes, hormones, and immune cells throughout the body.",
              },
              {
                id: "os4",
                title: "Lymphatic, Respiratory & Digestive",
                summary: "Immunity, gas exchange, and nutrient processing",
                detail: "Lymphatic: lymph nodes, vessels, spleen — immunity and fluid recovery. Respiratory: lungs and airways — O2/CO2 exchange, pH regulation. Digestive: GI tract and accessory organs — nutrient breakdown, absorption, elimination.",
              },
              {
                id: "os5",
                title: "Urinary & Reproductive",
                summary: "Waste removal and species continuation",
                detail: "Urinary: kidneys, ureters, bladder — fluid/electrolyte balance, waste excretion, blood pressure regulation. Reproductive: gonads and associated structures — gamete production, hormone secretion, fetal development.",
              },
            ]}
          />
          <CognitiveCard
            type="concept"
            title={t("data.pre_nursing_anatomy.cellularCommunicationBasics")}
            content={cellularComm}
          />
        </MicroLesson>

        <MatchingExercise
          title={t("data.pre_nursing_anatomy.directionalTerms")}
          description={t("data.pre_nursing_anatomy.matchEachDirectionalTermTo")}
          pairs={[
            { id: "dt1", term: "Superior", definition: "Above or toward the head" },
            { id: "dt2", term: "Anterior", definition: "Toward the front of the body" },
            { id: "dt3", term: "Medial", definition: "Toward the midline" },
            { id: "dt4", term: "Proximal", definition: "Closer to the trunk/point of origin" },
            { id: "dt5", term: "Deep", definition: "Away from the body surface" },
            { id: "dt6", term: "Lateral", definition: "Away from the midline" },
          ]}
        />

        <SelfCheckQuiz title={t("data.pre_nursing_anatomy.structuralOrganizationCheck")} questions={structuralQuiz} />
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <CircleDot className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Cell & Tissue Biology</h3>
        </div>

        <MicroLesson
          title={t("data.pre_nursing_anatomy.cellMembraneStructure")}
          subtitle={t("data.pre_nursing_anatomy.thePhospholipidBilayerAndMembrane")}
          icon={<CircleDot className="w-5 h-5" />}
        >
          <EditableModuleText sectionKey="preanat-cell-membrane-content" defaultText="The cell membrane (plasma membrane) is the gatekeeper of every cell, controlling substance movement and enabling cellular communication." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
          <div className="space-y-3 mt-3">
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
              <p className="text-xs font-semibold text-blue-700 mb-1">Phospholipid Bilayer</p>
              <p className="text-xs text-blue-600">Hydrophilic heads face outward (toward water); hydrophobic tails face inward. This arrangement creates a selectively permeable barrier. Small nonpolar molecules (O2, CO2) pass freely; charged ions and large molecules cannot.</p>
            </div>
            <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
              <p className="text-xs font-semibold text-purple-700 mb-1">Membrane Proteins</p>
              <p className="text-xs text-purple-600">Channel proteins (allow specific ions through), carrier proteins (transport molecules via conformational change), receptor proteins (receive chemical signals), and enzymes. These proteins make the membrane functional.</p>
            </div>
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
              <p className="text-xs font-semibold text-amber-700 mb-1">Cholesterol & Glycocalyx</p>
              <p className="text-xs text-amber-600">Cholesterol stabilizes membrane fluidity across temperature changes. The glycocalyx (sugar coat) enables cell recognition, immune function, and protection. Blood type antigens are part of the glycocalyx on red blood cells.</p>
            </div>
          </div>
        </MicroLesson>

        <MicroLesson
          title={t("data.pre_nursing_anatomy.membraneTransport")}
          subtitle={t("data.pre_nursing_anatomy.passiveVsActiveTransportAcross")}
          icon={<Droplets className="w-5 h-5" />}
        >
          <EditableModuleText sectionKey="preanat-membrane-transport-content" defaultText="Understanding membrane transport is critical for understanding IV fluid therapy, medication absorption, renal function, and electrolyte balance." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
          <ProgressiveReveal
            title={t("data.pre_nursing_anatomy.transportMechanisms")}
            cards={[
              {
                id: "mt1",
                title: "Simple Diffusion",
                summary: "Movement of small nonpolar molecules down the concentration gradient",
                detail: "No energy or membrane proteins required. O2 and CO2 cross the membrane this way. The rate depends on concentration gradient, temperature, and molecular size. Gases exchange in the lungs and tissues via simple diffusion.",
              },
              {
                id: "mt2",
                title: "Osmosis",
                summary: "Water movement through a semipermeable membrane",
                detail: "Water moves from areas of LOW solute concentration to HIGH solute concentration. This is why hypertonic IV solutions pull water out of cells (crenation) and hypotonic solutions push water into cells (potential lysis). Isotonic solutions (0.9% NaCl) cause no net water movement.",
              },
              {
                id: "mt3",
                title: "Facilitated Diffusion",
                summary: "Protein-assisted passive transport",
                detail: "Large or charged molecules (glucose, ions) need channel or carrier proteins to cross. Still passive (no ATP), still follows the gradient. GLUT transporters move glucose into cells this way. Aquaporins are channel proteins for water.",
              },
              {
                id: "mt4",
                title: "Active Transport & Na+/K+ Pump",
                summary: "ATP-powered movement against the gradient",
                detail: "The Na+/K+ ATPase pumps 3 Na+ out and 2 K+ in per ATP. This maintains the electrochemical gradient essential for nerve impulses (-70mV resting potential), muscle contraction, and secondary active transport. Digoxin works by inhibiting this pump.",
              },
              {
                id: "mt5",
                title: "Vesicular Transport",
                summary: "Bulk transport via membrane-bound vesicles",
                detail: "Endocytosis brings material INTO the cell (phagocytosis = 'cell eating'; pinocytosis = 'cell drinking'). Exocytosis releases material OUT (neurotransmitter release, hormone secretion). Both require energy and membrane remodeling.",
              },
            ]}
          />
          <CognitiveCard
            type="remember"
            title={t("data.pre_nursing_anatomy.electrochemicalGradients")}
            content={transportGradient}
          />
        </MicroLesson>

        <MicroLesson
          title={t("data.pre_nursing_anatomy.receptorsCellSignaling")}
          subtitle={t("data.pre_nursing_anatomy.howCellsReceiveAndRespond")}
          icon={<Network className="w-5 h-5" />}
        >
          <EditableModuleText sectionKey="preanat-cell-signaling-content" defaultText="Cell signaling underlies pharmacology — drugs work by mimicking or blocking natural signaling molecules." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100">
              <p className="text-xs font-semibold text-indigo-700 mb-1">Receptor Types</p>
              <p className="text-xs text-indigo-600">Membrane receptors: G-protein coupled, ion channels, enzyme-linked. Intracellular receptors: for lipid-soluble hormones (steroids, thyroid hormone) that cross the membrane and bind DNA directly.</p>
            </div>
            <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-100">
              <p className="text-xs font-semibold text-rose-700 mb-1">Signal Transduction</p>
              <p className="text-xs text-rose-600">Ligand binds receptor → intracellular cascade → cellular response. Second messengers (cAMP, Ca2+) amplify the signal. One hormone molecule can trigger thousands of cellular reactions through signal amplification.</p>
            </div>
          </div>
          <CognitiveCard
            type="concept"
            title={t("data.pre_nursing_anatomy.drugreceptorInteractions")}
            content={receptorsDrugs}
          />
        </MicroLesson>

        <MicroLesson
          title={t("data.pre_nursing_anatomy.tissueTypes")}
          subtitle={t("data.pre_nursing_anatomy.epithelialConnectiveMuscleAndNervous")}
          icon={<Layers className="w-5 h-5" />}
        >
          <ProgressiveReveal
            title={t("data.pre_nursing_anatomy.theFourPrimaryTissueTypes")}
            cards={[
              {
                id: "tt1",
                title: "Epithelial Tissue",
                summary: "Covers surfaces, lines cavities, forms glands",
                detail: "Classified by layers (simple = one layer, stratified = multiple) and cell shape (squamous = flat, cuboidal = cube, columnar = column). Simple squamous lines alveoli and blood vessels (thin for diffusion). Stratified squamous covers skin (thick for protection). Pseudostratified ciliated columnar lines airways.",
              },
              {
                id: "tt2",
                title: "Connective Tissue",
                summary: "Supports, binds, and protects structures",
                detail: "Most abundant tissue type. Includes: loose CT (areolar — fills spaces), dense CT (tendons, ligaments), cartilage (hyaline, fibro, elastic), bone, blood, and adipose. All have cells embedded in an extracellular matrix. Connective tissue proper has fibroblasts producing collagen and elastin.",
              },
              {
                id: "tt3",
                title: "Muscle Tissue",
                summary: "Generates force through contraction",
                detail: "Skeletal: voluntary, striated, multinucleated — moves the skeleton. Cardiac: involuntary, striated, branched with intercalated discs — pumps blood. Smooth: involuntary, non-striated, spindle-shaped — found in organ walls (blood vessels, GI tract, airways).",
              },
              {
                id: "tt4",
                title: "Nervous Tissue",
                summary: "Generates and transmits electrical signals",
                detail: "Neurons: excitable cells that transmit electrical impulses via action potentials. Neuroglia (glial cells): support cells — astrocytes (blood-brain barrier), oligodendrocytes (CNS myelin), Schwann cells (PNS myelin), microglia (immune defense). Neurons are generally amitotic (don't divide) — damage is often permanent.",
              },
            ]}
          />
          <CognitiveCard
            type="warning"
            title={t("data.pre_nursing_anatomy.cellularInjuryAdaptation")}
            content={tissueAdaptation}
          />
        </MicroLesson>

        <MatchingExercise
          title={t("data.pre_nursing_anatomy.transportMechanisms")}
          description="Match each transport type to its key characteristic"
          pairs={[
            { id: "tm1", term: "Simple diffusion", definition: "No energy, no proteins needed" },
            { id: "tm2", term: "Osmosis", definition: "Water movement toward higher solute" },
            { id: "tm3", term: "Facilitated diffusion", definition: "Protein-assisted, still passive" },
            { id: "tm4", term: "Na+/K+ pump", definition: "3 Na+ out, 2 K+ in, uses ATP" },
            { id: "tm5", term: "Endocytosis", definition: "Material brought into cell via vesicle" },
            { id: "tm6", term: "Exocytosis", definition: "Material released from cell via vesicle" },
          ]}
        />

        <SelfCheckQuiz title={t("data.pre_nursing_anatomy.cellTissueBiologyCheck")} questions={cellTissueQuiz} />
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <Shield className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Integumentary System</h3>
        </div>

        <MicroLesson
          title={t("data.pre_nursing_anatomy.skinStructureProtectiveFunctions")}
          subtitle={t("data.pre_nursing_anatomy.theBodysLargestOrganAnd")}
          icon={<Shield className="w-5 h-5" />}
        >
          <EditableModuleText sectionKey="preanat-skin-structure-content" defaultText="The skin is the body's largest organ, comprising about 16% of body weight. It has three primary layers: epidermis, dermis, and the hypodermis." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
          <div className="grid sm:grid-cols-3 gap-3 mt-3">
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
              <p className="text-xs font-semibold text-amber-700 mb-1">Protection</p>
              <p className="text-xs text-amber-600">Physical barrier against pathogens, chemicals, UV radiation. Acid mantle (pH 4-6) inhibits bacterial growth.</p>
            </div>
            <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-100">
              <p className="text-xs font-semibold text-orange-700 mb-1">Thermoregulation</p>
              <p className="text-xs text-orange-600">Dermal blood vessel dilation/constriction and sweat gland activation regulate body temperature under hypothalamic control.</p>
            </div>
            <div className="p-4 bg-yellow-50/60 rounded-xl border border-yellow-100">
              <p className="text-xs font-semibold text-yellow-700 mb-1">Sensation & Synthesis</p>
              <p className="text-xs text-yellow-600">Rich nerve endings detect touch, pressure, temperature, pain. Vitamin D synthesis occurs when UV light hits the epidermis.</p>
            </div>
          </div>
        </MicroLesson>

        <MicroLesson
          title={t("data.pre_nursing_anatomy.skinIntegrityWoundHealingFluid")}
          subtitle={t("data.pre_nursing_anatomy.maintainingTheBodysProtectiveBarrier")}
          icon={<Droplets className="w-5 h-5" />}
        >
          <EditableModuleText sectionKey="preanat-skin-integrity-content" defaultText="Skin integrity is a critical nursing assessment. Factors that compromise the skin barrier include age (thinner epidermis, less collagen), nutrition (protein/vitamin C deficiency impairs healing), moisture (incontinence-associated dermatitis), pressure (decubitus ulcers), and disease (diabetes impairs microcirculation)." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
          <ProgressiveReveal
            title={t("data.pre_nursing_anatomy.woundHealingPhases")}
            cards={[
              {
                id: "wh1",
                title: "Hemostasis (Immediate)",
                summary: "Blood vessel spasm and clot formation",
                detail: "Vascular spasm reduces blood flow. Platelets aggregate and form a temporary plug. The coagulation cascade produces fibrin mesh that stabilizes the clot. This stops bleeding and provides a framework for repair.",
              },
              {
                id: "wh2",
                title: "Inflammatory Phase (Days 1-4)",
                summary: "Immune response clears debris and fights infection",
                detail: "Neutrophils arrive first (within hours) to phagocytize bacteria and debris. Macrophages follow (24-48 hours), cleaning the wound and releasing growth factors. Cardinal signs: redness, heat, swelling, pain — these are NORMAL and necessary.",
              },
              {
                id: "wh3",
                title: "Proliferative Phase (Days 4-21)",
                summary: "New tissue formation and wound closure",
                detail: "Fibroblasts produce collagen (granulation tissue — beefy red appearance). Angiogenesis creates new blood vessels. Epithelial cells migrate across the wound surface (epithelialization). The wound contracts as myofibroblasts pull edges together.",
              },
              {
                id: "wh4",
                title: "Maturation/Remodeling (21 days-2 years)",
                summary: "Scar strengthening and reorganization",
                detail: "Collagen is reorganized and cross-linked for strength. The scar gradually strengthens but only reaches about 80% of original tissue strength. Excessive collagen → hypertrophic scar or keloid. This phase can last up to 2 years.",
              },
            ]}
          />
          <CognitiveCard
            type="remember"
            title={t("data.pre_nursing_anatomy.skinTurgorFluidAssessment")}
            content={skinTurgor}
          />
        </MicroLesson>

        <SelfCheckQuiz title={t("data.pre_nursing_anatomy.integumentarySystemCheck")} questions={integumentaryQuiz} />
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Bone className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Skeletal System</h3>
        </div>

        <MicroLesson
          title={t("data.pre_nursing_anatomy.boneStructureFunction")}
          subtitle={t("data.pre_nursing_anatomy.livingTissueThatSupportsProtects")}
          icon={<Bone className="w-5 h-5" />}
        >
          <EditableModuleText sectionKey="preanat-bone-structure-content" defaultText="Bones are dynamic living tissue, not static structures. They are continuously remodeled throughout life, responding to mechanical stress, hormonal signals, and nutritional status." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
          <div className="space-y-3 mt-3">
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
              <p className="text-xs font-semibold text-blue-700 mb-1">Bone Cells</p>
              <p className="text-xs text-blue-600">Osteoblasts BUILD bone (think 'B' for build). Osteoclasts BREAK DOWN bone (think 'C' for consume). Osteocytes are mature bone cells embedded in the matrix that sense mechanical stress and regulate remodeling.</p>
            </div>
            <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100">
              <p className="text-xs font-semibold text-indigo-700 mb-1">Compact vs Spongy Bone</p>
              <p className="text-xs text-indigo-600">Compact (cortical) bone: dense outer layer, organized in osteons (Haversian systems). Spongy (cancellous) bone: inner lattice structure (trabeculae), lighter, contains red bone marrow for hematopoiesis in flat bones and epiphyses.</p>
            </div>
            <div className="p-4 bg-violet-50/60 rounded-xl border border-violet-100">
              <p className="text-xs font-semibold text-violet-700 mb-1">Bone Functions</p>
              <p className="text-xs text-violet-600">Support and shape • Protection (skull protects brain, ribs protect heart/lungs) • Movement (muscle attachment) • Mineral storage (calcium, phosphorus) • Blood cell production (hematopoiesis) • Energy storage (yellow marrow = fat).</p>
            </div>
          </div>
        </MicroLesson>

        <MicroLesson
          title={t("data.pre_nursing_anatomy.calciumHomeostasisBoneTypes")}
          subtitle={t("data.pre_nursing_anatomy.hormonalRegulationAndSkeletalClassificat")}
          icon={<Activity className="w-5 h-5" />}
        >
          <EditableModuleText sectionKey="preanat-calcium-content" defaultText="Calcium homeostasis involves a delicate balance between PTH and calcitonin, with bones serving as the body's calcium reservoir." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <p className="text-xs font-semibold text-emerald-700 mb-1">PTH (Raises Calcium)</p>
              <p className="text-xs text-emerald-600">Low Ca2+ → parathyroid glands release PTH → stimulates osteoclasts (bone resorption), increases renal Ca2+ reabsorption, activates vitamin D → calcium rises. Remember: PTH = 'Pulls calcium To High.'</p>
            </div>
            <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100">
              <p className="text-xs font-semibold text-teal-700 mb-1">Calcitonin (Lowers Calcium)</p>
              <p className="text-xs text-teal-600">High Ca2+ → thyroid C-cells release calcitonin → inhibits osteoclasts, promotes calcium deposition in bone → calcium drops. Calcitonin 'tones down' calcium. Less clinically significant than PTH.</p>
            </div>
          </div>
          <CognitiveCard
            type="concept"
            title={t("data.pre_nursing_anatomy.typesOfBones")}
            content={boneTypes}
          />
        </MicroLesson>

        <MicroLesson
          title={t("data.pre_nursing_anatomy.jointsTheSkeleton")}
          subtitle={t("data.pre_nursing_anatomy.whereBonesMeetAndHow")}
          icon={<Bone className="w-5 h-5" />}
        >
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
              <p className="text-sm font-semibold text-blue-700 mb-1">Joint Classification</p>
              <p className="text-xs text-blue-600">Fibrous joints (synarthroses): immovable (skull sutures). Cartilaginous joints (amphiarthroses): slightly movable (intervertebral discs, pubic symphysis). Synovial joints (diarthroses): freely movable (knee, shoulder, hip) — most clinically significant.</p>
            </div>
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <p className="text-sm font-semibold text-emerald-700 mb-1">Synovial Joint Features</p>
              <p className="text-xs text-emerald-600">Joint cavity with synovial fluid (lubrication, nutrition). Articular cartilage (smooth, shock-absorbing). Joint capsule with ligaments (stability). Menisci and bursae provide additional support. Movements: flexion, extension, abduction, adduction, rotation, circumduction.</p>
            </div>
          </div>
          <CognitiveCard
            type="remember"
            title={t("data.pre_nursing_anatomy.axialVsAppendicularSkeleton")}
            content={skeletonAxial}
          />
        </MicroLesson>

        <MatchingExercise
          title={t("data.pre_nursing_anatomy.boneJointConcepts")}
          description={t("data.pre_nursing_anatomy.matchEachTermToIts")}
          pairs={[
            { id: "bj1", term: "Osteoblasts", definition: "Bone-building cells" },
            { id: "bj2", term: "Osteoclasts", definition: "Bone-resorbing cells" },
            { id: "bj3", term: "PTH", definition: "Raises blood calcium" },
            { id: "bj4", term: "Calcitonin", definition: "Lowers blood calcium" },
            { id: "bj5", term: "Synovial fluid", definition: "Lubricates freely movable joints" },
            { id: "bj6", term: "Red bone marrow", definition: "Site of blood cell production" },
          ]}
        />

        <SelfCheckQuiz title={t("data.pre_nursing_anatomy.skeletalSystemCheck")} questions={skeletalQuiz} />
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-rose-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Muscular System</h3>
        </div>

        <MicroLesson
          title={t("data.pre_nursing_anatomy.muscleTissueCharacteristics")}
          subtitle={t("data.pre_nursing_anatomy.threeTypesOfMuscleAnd")}
          icon={<Dumbbell className="w-5 h-5" />}
        >
          <EditableModuleText sectionKey="preanat-muscle-tissue-content" defaultText="All muscle tissue shares four key properties: excitability, contractility, extensibility, and elasticity. However, the three muscle types differ significantly in structure, control, and location." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
          <div className="grid sm:grid-cols-3 gap-3 mt-3">
            <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-100">
              <p className="text-xs font-semibold text-rose-700 mb-1">Skeletal Muscle</p>
              <p className="text-xs text-rose-600">Voluntary, striated, multinucleated. Attached to bones via tendons. Under conscious (somatic nervous system) control. Fast contraction but fatigues. Makes up ~40% of body weight.</p>
            </div>
            <div className="p-4 bg-red-50/60 rounded-xl border border-red-100">
              <p className="text-xs font-semibold text-red-700 mb-1">Cardiac Muscle</p>
              <p className="text-xs text-red-600">Involuntary, striated, branched. Found ONLY in the heart. Intercalated discs allow synchronized contraction. Autorhythmic — generates its own electrical impulses. Highly resistant to fatigue.</p>
            </div>
            <div className="p-4 bg-pink-50/60 rounded-xl border border-pink-100">
              <p className="text-xs font-semibold text-pink-700 mb-1">Smooth Muscle</p>
              <p className="text-xs text-pink-600">Involuntary, non-striated, spindle-shaped. Found in walls of hollow organs (blood vessels, GI tract, bladder, airways). Slow, sustained contractions. Controlled by ANS, hormones, and local factors.</p>
            </div>
          </div>
        </MicroLesson>

        <MicroLesson
          title={t("data.pre_nursing_anatomy.slidingFilamentTheoryNeuromuscularJuncti")}
          subtitle={t("data.pre_nursing_anatomy.howMusclesContractAtThe")}
          icon={<Zap className="w-5 h-5" />}
        >
          <EditableModuleText sectionKey="preanat-sliding-filament-content" defaultText="Muscle contraction follows the sliding filament theory, which begins with a signal at the neuromuscular junction." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
          <div className="space-y-3 mt-3">
            <div className="p-4 bg-violet-50/60 rounded-xl border border-violet-100">
              <p className="text-xs font-semibold text-violet-700 mb-1">Neuromuscular Junction (NMJ)</p>
              <p className="text-xs text-violet-600">Motor neuron releases ACh → ACh binds nicotinic receptors on muscle fiber → depolarization → action potential propagates along sarcolemma and into T-tubules → Ca2+ released from sarcoplasmic reticulum → contraction begins.</p>
            </div>
            <div className="p-4 bg-fuchsia-50/60 rounded-xl border border-fuchsia-100">
              <p className="text-xs font-semibold text-fuchsia-700 mb-1">Contraction Cycle</p>
              <p className="text-xs text-fuchsia-600">Ca2+ binds troponin → tropomyosin shifts → actin binding sites exposed → myosin cross-bridge forms → power stroke (pulls actin) → ATP binds myosin (detachment) → cycle repeats. Ca2+ removal → relaxation.</p>
            </div>
          </div>
          <CognitiveCard
            type="concept"
            title={t("data.pre_nursing_anatomy.typesOfContractionsMuscleFatigue")}
            content={muscleFatigue}
          />
        </MicroLesson>

        <SelfCheckQuiz title={t("data.pre_nursing_anatomy.muscularSystemCheck")} questions={muscularQuiz} />
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Nervous System</h3>
        </div>

        <MicroLesson
          title={t("data.pre_nursing_anatomy.neuronStructureElectricalSignaling")}
          subtitle={t("data.pre_nursing_anatomy.howNerveCellsGenerateAnd")}
          icon={<Brain className="w-5 h-5" />}
        >
          <EditableModuleText sectionKey="preanat-neuron-content" defaultText="Neurons are the functional units of the nervous system, specialized for rapid electrochemical communication." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
          <div className="space-y-3 mt-3">
            <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
              <p className="text-xs font-semibold text-purple-700 mb-1">Neuron Anatomy</p>
              <p className="text-xs text-purple-600">Cell body (soma): contains nucleus and organelles. Dendrites: receive incoming signals (input). Axon: conducts action potentials away from soma (output). Myelin sheath: insulating lipid layer that speeds conduction (saltatory conduction between nodes of Ranvier).</p>
            </div>
            <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100">
              <p className="text-xs font-semibold text-indigo-700 mb-1">Resting Membrane Potential (-70mV)</p>
              <p className="text-xs text-indigo-600">At rest, the neuron interior is negative relative to outside. Maintained by: Na+/K+ pump (3 Na+ out, 2 K+ in), K+ leak channels (K+ diffuses out), and large intracellular anions. This 'charged' state is the potential energy for signaling.</p>
            </div>
          </div>
        </MicroLesson>

        <MicroLesson
          title={t("data.pre_nursing_anatomy.actionPotentialSynapticTransmission")}
          subtitle={t("data.pre_nursing_anatomy.theNerveImpulseFromGeneration")}
          icon={<Zap className="w-5 h-5" />}
        >
          <ProgressiveReveal
            title={t("data.pre_nursing_anatomy.actionPotentialSteps")}
            cards={[
              {
                id: "ap1",
                title: "1. Resting State",
                summary: "Neuron at -70mV, Na+ channels closed",
                detail: "The membrane is polarized at -70mV. Voltage-gated Na+ and K+ channels are closed. The Na+/K+ pump maintains ion gradients. The neuron is ready to fire but needs sufficient stimulation to reach threshold.",
              },
              {
                id: "ap2",
                title: "2. Depolarization",
                summary: "Na+ rushes in, membrane reaches +30mV",
                detail: "When a stimulus reaches threshold (-55mV), voltage-gated Na+ channels open rapidly. Na+ floods into the cell, driving the membrane potential from -70mV to about +30mV. This is an 'all-or-nothing' event — once threshold is reached, the full action potential fires.",
              },
              {
                id: "ap3",
                title: "3. Repolarization",
                summary: "K+ rushes out, membrane returns toward negative",
                detail: "Na+ channels inactivate. Voltage-gated K+ channels open (they're slower). K+ flows OUT of the cell, restoring the negative interior. The membrane potential drops back toward -70mV.",
              },
              {
                id: "ap4",
                title: "4. Hyperpolarization & Recovery",
                summary: "Brief overshoot below -70mV, then restoration",
                detail: "K+ channels close slowly, so the membrane briefly overshoots to about -80mV (hyperpolarization). The Na+/K+ pump then restores normal ion distribution. The absolute refractory period (during repolarization) prevents backward impulse propagation.",
              },
            ]}
          />
          <CognitiveCard
            type="remember"
            title={t("data.pre_nursing_anatomy.synapticTransmission")}
            content={synapticTransmission}
          />
        </MicroLesson>

        <MicroLesson
          title={t("data.pre_nursing_anatomy.cnsPnsTheAutonomicNervous")}
          subtitle={t("data.pre_nursing_anatomy.structuralAndFunctionalDivisionsOf")}
          icon={<Network className="w-5 h-5" />}
        >
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
              <p className="text-sm font-semibold text-blue-700 mb-1">CNS (Brain & Spinal Cord)</p>
              <p className="text-xs text-blue-600">Integration and command center. Protected by meninges, CSF, and bone. Processes sensory input, initiates motor output, and manages higher functions (thought, memory, emotion). Damage is often permanent due to limited regeneration.</p>
            </div>
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <p className="text-sm font-semibold text-emerald-700 mb-1">PNS (Nerves & Ganglia)</p>
              <p className="text-xs text-emerald-600">Communication lines between CNS and body. Sensory (afferent) division: carries signals TO the CNS. Motor (efferent) division: carries signals FROM the CNS. Includes somatic (voluntary) and autonomic (involuntary) subdivisions.</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-100">
              <p className="text-xs font-semibold text-orange-700 mb-1">Sympathetic NS ('Fight or Flight')</p>
              <p className="text-xs text-orange-600">Thoracolumbar origin. Releases norepinephrine. Effects: ↑HR, ↑BP, bronchodilation, pupil dilation, ↑blood glucose, blood shunted to muscles, ↓GI motility. Prepares body for emergency action.</p>
            </div>
            <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100">
              <p className="text-xs font-semibold text-teal-700 mb-1">Parasympathetic NS ('Rest & Digest')</p>
              <p className="text-xs text-teal-600">Craniosacral origin. Releases acetylcholine. Effects: ↓HR, ↓BP, bronchoconstriction, pupil constriction, ↑GI motility/secretion, promotes digestion. Dominates during rest and recovery.</p>
            </div>
          </div>
          <CognitiveCard
            type="concept"
            title={t("data.pre_nursing_anatomy.keyNeurotransmitters")}
            content={neurotransmittersText}
          />
        </MicroLesson>

        <MatchingExercise
          title={t("data.pre_nursing_anatomy.nervousSystemConcepts")}
          description={t("data.pre_nursing_anatomy.matchEachConceptToIts")}
          pairs={[
            { id: "nc1", term: "Depolarization", definition: "Na+ rushes into the cell" },
            { id: "nc2", term: "Repolarization", definition: "K+ flows out of the cell" },
            { id: "nc3", term: "Sympathetic NS", definition: "Fight or flight response" },
            { id: "nc4", term: "Parasympathetic NS", definition: "Rest and digest response" },
            { id: "nc5", term: "Myelin sheath", definition: "Speeds up nerve conduction" },
            { id: "nc6", term: "Synapse", definition: "Junction between two neurons" },
          ]}
        />

        <SelfCheckQuiz title={t("data.pre_nursing_anatomy.nervousSystemCheck")} questions={nervousQuiz} />
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
            <Heart className="w-5 h-5 text-teal-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Endocrine System</h3>
        </div>

        <MicroLesson
          title={t("data.pre_nursing_anatomy.hormoneSignalingNegativeFeedback")}
          subtitle={t("data.pre_nursing_anatomy.chemicalMessengersAndHowThe")}
          icon={<Heart className="w-5 h-5" />}
        >
          <EditableModuleText sectionKey="preanat-hormone-signaling-content" defaultText="The endocrine system uses hormones for slower but longer-lasting communication compared to the nervous system." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100">
              <p className="text-xs font-semibold text-teal-700 mb-1">Water-Soluble Hormones</p>
              <p className="text-xs text-teal-600">Peptides and proteins (insulin, ADH, oxytocin). Cannot cross cell membranes. Bind surface receptors → second messenger cascade (cAMP). Fast onset, short duration. Cannot be taken orally (digested).</p>
            </div>
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <p className="text-xs font-semibold text-emerald-700 mb-1">Lipid-Soluble Hormones</p>
              <p className="text-xs text-emerald-600">Steroids (cortisol, estrogen, testosterone) and thyroid hormones. Cross membranes freely. Bind intracellular/nuclear receptors → alter gene expression. Slow onset, long duration. Many can be taken orally.</p>
            </div>
          </div>
          <CognitiveCard
            type="warning"
            title={t("data.pre_nursing_anatomy.negativeFeedbackControlsMostHormones")}
            content={negativeFeedback}
          />
        </MicroLesson>

        <MicroLesson
          title={t("data.pre_nursing_anatomy.thePituitaryGland")}
          subtitle={t("data.pre_nursing_anatomy.theMasterGlandControllingOther")}
          icon={<Sparkles className="w-5 h-5" />}
        >
          <EditableModuleText sectionKey="preanat-pituitary-content" defaultText="The pituitary gland is controlled by the hypothalamus and regulates thyroid, adrenals, gonads, growth, and more." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100">
              <p className="text-xs font-semibold text-indigo-700 mb-1">Anterior Pituitary Hormones</p>
              <p className="text-xs text-indigo-600">GH (growth), TSH (thyroid), ACTH (adrenals/cortisol), FSH & LH (gonads), Prolactin (milk production). Mnemonic: FLAT PiG — FSH, LH, ACTH, TSH, Prolactin, GH.</p>
            </div>
            <div className="p-4 bg-violet-50/60 rounded-xl border border-violet-100">
              <p className="text-xs font-semibold text-violet-700 mb-1">Posterior Pituitary Hormones</p>
              <p className="text-xs text-violet-600">ADH (antidiuretic hormone): promotes water reabsorption in kidneys — low ADH → diabetes insipidus (dilute urine). Oxytocin: stimulates uterine contractions and milk let-down. Both made in hypothalamus, stored in posterior pituitary.</p>
            </div>
          </div>
        </MicroLesson>

        <MicroLesson
          title={t("data.pre_nursing_anatomy.insulinGlucoseRegulationStressHormones")}
          subtitle={t("data.pre_nursing_anatomy.criticalMetabolicAndStressResponse")}
          icon={<Activity className="w-5 h-5" />}
        >
          <div className="space-y-3">
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
              <p className="text-xs font-semibold text-blue-700 mb-1">Insulin & Glucagon</p>
              <p className="text-xs text-blue-600">Insulin (beta cells): released when glucose HIGH → moves glucose INTO cells, lowers blood sugar. Glucagon (alpha cells): released when glucose LOW → stimulates glycogenolysis and gluconeogenesis, raises blood sugar. They work as antagonistic partners to maintain glucose 70-100 mg/dL.</p>
            </div>
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
              <p className="text-xs font-semibold text-amber-700 mb-1">Stress Response Hormones</p>
              <p className="text-xs text-amber-600">Acute stress: Adrenal medulla releases epinephrine/norepinephrine (catecholamines) → rapid fight-or-flight response. Chronic stress: HPA axis activates → hypothalamus (CRH) → anterior pituitary (ACTH) → adrenal cortex (cortisol) → elevated glucose, suppressed immunity, protein breakdown.</p>
            </div>
          </div>
          <CognitiveCard
            type="remember"
            title={t("data.pre_nursing_anatomy.clinicalImplicationsOfCortisol")}
            content={cortisolClinical}
          />
        </MicroLesson>

        <MatchingExercise
          title={t("data.pre_nursing_anatomy.endocrineConcepts")}
          description={t("data.pre_nursing_anatomy.matchEachHormoneToIts")}
          pairs={[
            { id: "ec1", term: "Insulin", definition: "Lowers blood glucose" },
            { id: "ec2", term: "Glucagon", definition: "Raises blood glucose" },
            { id: "ec3", term: "ADH", definition: "Promotes water reabsorption in kidneys" },
            { id: "ec4", term: "Cortisol", definition: "Stress hormone from adrenal cortex" },
            { id: "ec5", term: "TSH", definition: "Stimulates thyroid hormone release" },
            { id: "ec6", term: "Oxytocin", definition: "Uterine contractions and milk let-down" },
          ]}
        />

        <SelfCheckQuiz title={t("data.pre_nursing_anatomy.endocrineSystemCheck")} questions={endocrineQuiz} />
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <Heart className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Cardiovascular System</h3>
        </div>

        <MicroLesson
          title={t("data.pre_nursing_anatomy.heartAnatomyBloodFlowPathway")}
          subtitle={t("data.pre_nursing_anatomy.fourChambersFourValvesTwo")}
          icon={<Heart className="w-5 h-5" />}
        >
          <EditableModuleText sectionKey="preanat-heart-content" defaultText="The heart is a muscular pump approximately the size of a fist, located in the mediastinum of the thoracic cavity. It has four chambers that work in coordinated pairs to maintain two distinct circulatory loops." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
              <p className="text-xs font-semibold text-blue-700 mb-1">Right Side (Pulmonary Circuit)</p>
              <p className="text-xs text-blue-600">Right atrium receives deoxygenated blood from the body via the superior and inferior venae cavae. Blood flows through the tricuspid valve into the right ventricle, then is pumped through the pulmonary semilunar valve into the pulmonary trunk and arteries to the lungs for gas exchange.</p>
            </div>
            <div className="p-4 bg-red-50/60 rounded-xl border border-red-100">
              <p className="text-xs font-semibold text-red-700 mb-1">Left Side (Systemic Circuit)</p>
              <p className="text-xs text-red-600">The left atrium receives oxygenated blood from the lungs via four pulmonary veins. Blood flows through the bicuspid (mitral) valve into the left ventricle — the most muscular chamber — then is ejected through the aortic semilunar valve into the aorta to supply the entire body.</p>
            </div>
          </div>
          <ProgressiveReveal
            title={t("data.pre_nursing_anatomy.bloodFlowSequence")}
            cards={[
              { id: "bf1", title: "Step 1: Venous Return", summary: "Venae cavae → Right atrium → Tricuspid valve → Right ventricle", detail: "Deoxygenated blood from the systemic circuit returns to the right atrium via the superior vena cava (upper body) and inferior vena cava (lower body), then passes through the tricuspid (right atrioventricular) valve into the right ventricle." },
              { id: "bf2", title: "Step 2: Pulmonary Circuit", summary: "Right ventricle → Pulmonary valve → Pulmonary arteries → Lungs", detail: "The right ventricle contracts, closing the tricuspid valve and opening the pulmonary semilunar valve. Blood is pumped into the pulmonary trunk, which splits into left and right pulmonary arteries carrying deoxygenated blood to the lungs for gas exchange." },
              { id: "bf3", title: "Step 3: Pulmonary Return", summary: "Pulmonary veins → Left atrium → Mitral valve → Left ventricle", detail: "Oxygenated blood returns from the lungs via four pulmonary veins into the left atrium, then flows through the bicuspid (mitral) valve into the left ventricle — the thickest, most muscular chamber." },
              { id: "bf4", title: "Step 4: Systemic Circuit", summary: "Left ventricle → Aortic valve → Aorta → Body → Venae cavae", detail: "The left ventricle contracts powerfully, ejecting oxygenated blood through the aortic semilunar valve into the aorta for distribution to all body tissues. After gas exchange at tissue capillaries, deoxygenated blood returns via venules and veins to the venae cavae, completing the circuit." },
            ]}
          />
          <CognitiveCard
            type="remember"
            title={t("data.pre_nursing_anatomy.keyAnatomicalFacts")}
            content={heartAnatomyText}
          />
        </MicroLesson>

        <MicroLesson
          title={t("data.pre_nursing_anatomy.cardiacCycleBloodVesselTypes")}
          subtitle={t("data.pre_nursing_anatomy.systoleDiastoleAndTheVascular")}
          icon={<Activity className="w-5 h-5" />}
        >
          <EditableModuleText sectionKey="preanat-cardiac-cycle-content" defaultText="The cardiac cycle includes all events from one heartbeat to the next. The heart's intrinsic conduction system coordinates the rhythmic contractions without requiring external neural input." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
          <div className="grid sm:grid-cols-3 gap-3 mt-3">
            <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-100">
              <p className="text-xs font-semibold text-rose-700 mb-1">Systole (Contraction)</p>
              <p className="text-xs text-rose-600">Atrial systole: atria contract, pushing remaining blood into ventricles. Ventricular systole: ventricles contract, AV valves close (S1 &ldquo;lub&rdquo;), semilunar valves open, blood ejected into pulmonary trunk and aorta.</p>
            </div>
            <div className="p-4 bg-sky-50/60 rounded-xl border border-sky-100">
              <p className="text-xs font-semibold text-sky-700 mb-1">Diastole (Relaxation)</p>
              <p className="text-xs text-sky-600">Ventricles relax, semilunar valves close (S2 &ldquo;dub&rdquo;), AV valves open. Passive ventricular filling occurs (~70% of filling). The heart spends more time in diastole than systole. Coronary perfusion occurs primarily during diastole.</p>
            </div>
            <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
              <p className="text-xs font-semibold text-purple-700 mb-1">Conduction System</p>
              <p className="text-xs text-purple-600">SA node (pacemaker, 60-100 bpm) → AV node (delay) → Bundle of His → right and left bundle branches → Purkinje fibers → ventricular contraction. This intrinsic system allows the heart to beat independently.</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 mt-3">
            <div className="p-4 bg-red-50/60 rounded-xl border border-red-100">
              <p className="text-xs font-semibold text-red-700 mb-1">Arteries</p>
              <p className="text-xs text-red-600">Carry blood AWAY from the heart. Thick, muscular, elastic walls withstand high pressure. Arteries branch into smaller arterioles, which regulate blood flow to capillary beds via vasoconstriction/vasodilation.</p>
            </div>
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <p className="text-xs font-semibold text-emerald-700 mb-1">Capillaries</p>
              <p className="text-xs text-emerald-600">Microscopic vessels with walls only one endothelial cell thick. This is where exchange occurs: O&#8322; and nutrients diffuse to tissues; CO&#8322; and wastes diffuse into blood. Connect arterioles to venules.</p>
            </div>
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
              <p className="text-xs font-semibold text-blue-700 mb-1">Veins</p>
              <p className="text-xs text-blue-600">Carry blood TOWARD the heart. Thinner walls, lower pressure, larger lumens than arteries. Many contain one-way valves to prevent backflow. Venous return aided by skeletal muscle pump and respiratory pump.</p>
            </div>
          </div>
          <CognitiveCard
            type="concept"
            title={t("data.pre_nursing_anatomy.cardiacOutput")}
            content={cardiacOutputText}
          />
        </MicroLesson>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
            <Wind className="w-5 h-5 text-cyan-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Respiratory System</h3>
        </div>

        <MicroLesson
          title={t("data.pre_nursing_anatomy.airwaysAnatomyGasExchange")}
          subtitle={t("data.pre_nursing_anatomy.fromNasalCavityToAlveolar")}
          icon={<Wind className="w-5 h-5" />}
        >
          <EditableModuleText sectionKey="preanat-airways-content" defaultText="The respiratory system is divided into the upper respiratory tract and the lower respiratory tract." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
          <ProgressiveReveal
            title={t("data.pre_nursing_anatomy.airwayBranchingConductingZoneRespiratory")}
            cards={[
              { id: "ab1", title: "Trachea", summary: "C-shaped cartilage rings maintain patency", detail: "The trachea is lined with pseudostratified ciliated columnar epithelium (mucociliary escalator) that traps and propels inhaled particles upward. C-shaped hyaline cartilage rings keep the airway open while the posterior trachealis muscle allows esophageal expansion during swallowing." },
              { id: "ab2", title: "Bronchi", summary: "Progressive branching with decreasing cartilage", detail: "Primary (main) bronchi enter each lung at the hilum. They subdivide into secondary (lobar) bronchi (3 right, 2 left — matching lung lobes), then tertiary (segmental) bronchi. As airways branch, cartilage decreases and smooth muscle increases, allowing autonomic control of airway diameter." },
              { id: "ab3", title: "Bronchioles", summary: "No cartilage; smooth muscle controls diameter", detail: "Bronchioles lack cartilage entirely and rely on smooth muscle for structural support and diameter regulation. Terminal bronchioles are the smallest conducting airways. The conducting zone (nose through terminal bronchioles) warms, humidifies, and filters air but performs no gas exchange — this is anatomical dead space (~150 mL)." },
              { id: "ab4", title: "Respiratory Zone", summary: "Respiratory bronchioles → Alveolar ducts → Alveoli", detail: "The respiratory zone begins at respiratory bronchioles, which have scattered alveoli budding from their walls. These lead to alveolar ducts and alveolar sacs. An estimated 300 million alveoli provide ~70 m² of surface area for gas exchange — roughly the size of a tennis court." },
            ]}
          />
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div className="p-4 bg-cyan-50/60 rounded-xl border border-cyan-100">
              <p className="text-xs font-semibold text-cyan-700 mb-1">Alveolar Structure</p>
              <p className="text-xs text-cyan-600">Type I pneumocytes: thin squamous cells forming the gas exchange surface. Type II pneumocytes: secrete pulmonary surfactant, which reduces surface tension and prevents alveolar collapse (atelectasis). Alveolar macrophages: phagocytize inhaled particles and pathogens.</p>
            </div>
            <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100">
              <p className="text-xs font-semibold text-teal-700 mb-1">Gas Exchange (External Respiration)</p>
              <p className="text-xs text-teal-600">O&#8322; diffuses from alveoli (high PO&#8322;) into pulmonary capillary blood (low PO&#8322;). CO&#8322; diffuses from blood (high PCO&#8322;) into alveoli (low PCO&#8322;). Diffusion occurs across the respiratory membrane: alveolar epithelium + shared basement membrane + capillary endothelium (~0.5 &mu;m total thickness).</p>
            </div>
          </div>
          <CognitiveCard
            type="concept"
            title={t("data.pre_nursing_anatomy.ventilationMechanics")}
            content={ventilationMechanics}
          />
          <CognitiveCard
            type="remember"
            title={t("data.pre_nursing_anatomy.oxygenTransport")}
            content={oxygenTransport}
          />
        </MicroLesson>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <Utensils className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Digestive System</h3>
        </div>

        <MicroLesson
          title={t("data.pre_nursing_anatomy.giTractAnatomyDigestion")}
          subtitle={t("data.pre_nursing_anatomy.fromMouthToAnusMechanical")}
          icon={<Utensils className="w-5 h-5" />}
        >
          <EditableModuleText sectionKey="preanat-gi-tract-content" defaultText="The gastrointestinal (GI) tract is a continuous muscular tube approximately 9 meters long, extending from the mouth to the anus. The wall of the GI tract has four basic layers: mucosa, submucosa, muscularis externa (smooth muscle for peristalsis), and serosa (outermost protective layer)." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
          <ProgressiveReveal
            title={t("data.pre_nursing_anatomy.giTractOrgansInSequence")}
            cards={[
              { id: "gi1", title: "Mouth (Oral Cavity)", summary: "Mechanical and initial chemical digestion begins", detail: "Mastication (chewing) physically breaks food into smaller pieces. Salivary glands secrete saliva containing salivary amylase (begins starch digestion) and lingual lipase (begins fat digestion). The tongue mixes food with saliva to form a bolus for swallowing." },
              { id: "gi2", title: "Pharynx & Esophagus", summary: "Swallowing propels bolus via peristalsis", detail: "The pharynx connects the oral cavity to the esophagus. Swallowing (deglutition) is coordinated by the swallowing center in the medulla. The epiglottis covers the larynx to prevent aspiration. The esophagus uses peristalsis to move the bolus to the stomach. The lower esophageal sphincter (cardiac sphincter) prevents reflux." },
              { id: "gi3", title: "Stomach", summary: "Churning and chemical digestion produce chyme", detail: "The stomach churns food and mixes it with gastric juice. Parietal cells secrete HCl (denatures proteins, activates pepsinogen, kills bacteria) and intrinsic factor (essential for vitamin B12 absorption in the ileum). Chief cells secrete pepsinogen, activated to pepsin by HCl. The resulting acidic mixture is called chyme." },
              { id: "gi4", title: "Small Intestine", summary: "Primary site of chemical digestion and nutrient absorption", detail: "Duodenum: receives bile (from liver/gallbladder via common bile duct) and pancreatic juice (from pancreas via pancreatic duct). Most chemical digestion is completed here. Jejunum: primary site of nutrient absorption. Ileum: absorbs vitamin B12 and bile salts. Villi and microvilli create an enormous absorptive surface area." },
              { id: "gi5", title: "Large Intestine", summary: "Water absorption, microbiota, feces formation", detail: "The large intestine (cecum → ascending colon → transverse colon → descending colon → sigmoid colon → rectum → anal canal) absorbs water and electrolytes from remaining indigestible material. It houses trillions of gut microbiota that synthesize vitamin K and some B vitamins. Feces are formed, stored in the rectum, and eliminated via defecation." },
            ]}
          />
          <div className="grid sm:grid-cols-3 gap-3 mt-3">
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
              <p className="text-xs font-semibold text-amber-700 mb-1">Liver</p>
              <p className="text-xs text-amber-600">Largest internal organ. Produces bile (emulsifies fats for digestion). Metabolizes nutrients absorbed from the GI tract (via hepatic portal vein). Detoxifies substances, synthesizes plasma proteins (albumin, clotting factors), stores glycogen, and produces urea from ammonia.</p>
            </div>
            <div className="p-4 bg-yellow-50/60 rounded-xl border border-yellow-100">
              <p className="text-xs font-semibold text-yellow-700 mb-1">Pancreas</p>
              <p className="text-xs text-yellow-600">Dual function organ. Exocrine: secretes pancreatic juice into the duodenum containing digestive enzymes (pancreatic amylase, lipase, trypsinogen, chymotrypsinogen) and bicarbonate (neutralizes gastric acid). Endocrine: islets of Langerhans produce insulin (beta cells) and glucagon (alpha cells).</p>
            </div>
            <div className="p-4 bg-green-50/60 rounded-xl border border-green-100">
              <p className="text-xs font-semibold text-green-700 mb-1">Gallbladder</p>
              <p className="text-xs text-green-600">Stores and concentrates bile produced by the liver. When fat enters the duodenum, cholecystokinin (CCK) is released, stimulating the gallbladder to contract and release bile through the common bile duct into the duodenum for fat emulsification.</p>
            </div>
          </div>
          <CognitiveCard
            type="concept"
            title={t("data.pre_nursing_anatomy.mechanicalVsChemicalDigestion")}
            content={digestionMechanical}
          />
        </MicroLesson>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <Droplet className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Urinary System</h3>
        </div>

        <MicroLesson
          title={t("data.pre_nursing_anatomy.kidneyStructureUrineFormation")}
          subtitle={t("data.pre_nursing_anatomy.nephronPhysiologyFiltrationReabsorptionS")}
          icon={<Droplet className="w-5 h-5" />}
        >
          <EditableModuleText sectionKey="preanat-kidney-content" defaultText="The urinary system consists of two kidneys, two ureters, the urinary bladder, and the urethra. The kidneys are retroperitoneal organs located against the posterior abdominal wall. Each kidney has an outer renal cortex and an inner renal medulla." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
          <ProgressiveReveal
            title={t("data.pre_nursing_anatomy.threeProcessesOfUrineFormation")}
            cards={[
              { id: "uf1", title: "Glomerular Filtration", summary: "Blood pressure forces plasma components into Bowman's capsule", detail: "Hydrostatic pressure in the glomerular capillaries forces water, electrolytes, glucose, amino acids, and waste products through the filtration membrane (fenestrated endothelium, basement membrane, podocyte filtration slits) into Bowman's capsule. ~180 L of filtrate is produced daily; only ~1-2 L becomes urine. Normal GFR ≈ 125 mL/min. Blood cells and most proteins are too large to be filtered." },
              { id: "uf2", title: "Tubular Reabsorption", summary: "Essential substances reclaimed from filtrate back into blood", detail: "The proximal convoluted tubule (PCT) reclaims ~65% of filtered water, nearly all glucose and amino acids, and most Na+, Cl⁻, K+, and HCO₃⁻ via active transport, cotransport, and osmosis. The descending limb of the loop of Henle is permeable to water (water reabsorbed). The ascending limb actively pumps out Na+/Cl⁻ (creating the medullary concentration gradient). The DCT and collecting duct perform hormonally regulated fine-tuning (ADH, aldosterone)." },
              { id: "uf3", title: "Tubular Secretion", summary: "Unwanted substances moved from blood into tubular fluid", detail: "Substances are actively transported FROM peritubular capillary blood INTO the tubular fluid for elimination. Key substances secreted include H+ ions (critical for acid-base balance), K+ (regulated by aldosterone), NH₄+, certain drugs (penicillin, aspirin metabolites), and creatinine. Secretion is essentially the reverse of reabsorption and provides an additional mechanism for removing wastes and regulating blood composition." },
            ]}
          />
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
              <p className="text-xs font-semibold text-amber-700 mb-1">Nephron Components</p>
              <p className="text-xs text-amber-600">Glomerulus (capillary tuft enclosed by Bowman&apos;s capsule) → Proximal convoluted tubule (PCT) → Descending limb of loop of Henle (permeable to water) → Ascending limb (impermeable to water, actively transports Na+/Cl−) → Distal convoluted tubule (DCT) → Collecting duct → Renal pelvis.</p>
            </div>
            <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100">
              <p className="text-xs font-semibold text-teal-700 mb-1">Hormonal Regulation</p>
              <p className="text-xs text-teal-600">ADH (from posterior pituitary): increases water reabsorption in collecting ducts, concentrating urine. Aldosterone (from adrenal cortex): increases Na+ reabsorption and K+ secretion in DCT/collecting duct. ANP (from heart atria): promotes Na+ and water excretion, lowering blood volume. Renin-angiotensin-aldosterone system (RAAS): activated by low blood pressure to retain Na+ and water.</p>
            </div>
          </div>
          <CognitiveCard
            type="remember"
            title={t("data.pre_nursing_anatomy.kidneyFunctionsBeyondUrineFormation")}
            content={kidneyFunctions}
          />
        </MicroLesson>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Activity className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Body Systems Review</h3>
        </div>

        <SelfCheckQuiz title={t("data.pre_nursing_anatomy.cardiovascularRespiratoryDigestiveUrinar")} questions={bodySystemsQuiz} />

        <MatchingExercise
          title={t("data.pre_nursing_anatomy.organSystemsKeyFunctions")}
          description={t("data.pre_nursing_anatomy.matchEachOrganSystemTo")}
          pairs={[
            { id: "osm1", term: "Cardiovascular System", definition: "Pumps and transports blood, O\u2082, nutrients, and wastes throughout the body" },
            { id: "osm2", term: "Respiratory System", definition: "Gas exchange — delivers O\u2082 to blood and removes CO\u2082 from the body" },
            { id: "osm3", term: "Digestive System", definition: "Breaks down food into absorbable nutrients; eliminates solid waste" },
            { id: "osm4", term: "Urinary System", definition: "Filters blood, regulates fluid/electrolyte balance, and produces urine" },
            { id: "osm5", term: "Nervous System", definition: "Rapid electrochemical signaling for sensation, integration, and motor response" },
            { id: "osm6", term: "Endocrine System", definition: "Hormone-based regulation of metabolism, growth, and reproduction" },
            { id: "osm7", term: "Musculoskeletal System", definition: "Supports the body, enables movement, and protects internal organs" },
            { id: "osm8", term: "Integumentary System", definition: "Protects against external threats, regulates temperature, and prevents water loss" },
          ]}
        />
      </section>
    </div>
  );
}