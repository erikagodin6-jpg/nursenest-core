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
  Dna,
  FlaskConical,
  Microscope,
  Shield,
  Atom,
  Calculator,
  BookOpen,
  Beaker,
  Sparkles,
  Activity,
} from "lucide-react";

export function ScienceFoundationsModule() {
  const { t } = useI18n();
  const biosystemsConcept = useEditableText("science-biosystems-concept", "When a patient presents with multi-organ dysfunction, you're seeing the levels of organization failing in reverse — from organism-level symptoms traced back to cellular injury. Understanding this hierarchy helps you prioritize assessments.");
  const biomoleculesRemember = useEditableText("science-biomolecules-remember", "ATP (adenosine triphosphate) is the universal energy currency. Cells generate ATP primarily through aerobic metabolism (oxygen-dependent). When oxygen is unavailable, anaerobic metabolism produces lactic acid — this is why tissue hypoxia leads to metabolic acidosis.");
  const dnaWarning = useEditableText("science-dna-warning", "A single nucleotide mutation can alter the protein produced. Sickle cell disease results from one amino acid change in hemoglobin (Glu→Val), causing red blood cells to deform under low oxygen conditions. This is a powerful example of how molecular changes manifest as clinical disease.");
  const celldivConcept = useEditableText("science-celldiv-concept", "Maintaining accurate DNA replication during division is essential. Checkpoints in the cell cycle catch errors. When these checkpoints fail (e.g., p53 tumor suppressor mutation), cells can proliferate uncontrollably — the basis of cancer development.");
  const microWarning = useEditableText("science-micro-warning", "Antibiotic resistance occurs when bacteria evolve mechanisms to survive antibiotic exposure. Key nursing actions: complete full antibiotic courses, practice meticulous hand hygiene, use contact precautions for resistant organisms (MRSA, VRE, C. diff), and educate patients on proper antibiotic use.");
  const immunityConcept = useEditableText("science-immunity-concept", "Vaccines work by exposing the immune system to a harmless form of a pathogen (inactivated, attenuated, or mRNA-encoded antigen). This triggers adaptive immunity to produce memory B and T cells WITHOUT causing disease. Upon future exposure, the immune system mounts a rapid, targeted response. This is why booster doses enhance the memory response.");
  const chemRemember = useEditableText("science-chem-remember", "When salts dissolve in water, they dissociate into ions (ionization). NaCl → Na+ + Cl⁻. These ions conduct electricity in body fluids, enabling nerve impulses and muscle contractions. Electrolyte imbalances directly affect cardiac rhythm, muscle function, and neurological status.");
  const mathTip = useEditableText("science-math-tip", "Always write out your units and cancel them. Example: Order: 500 mg. Available: 250 mg/tablet. Calculation: 500 mg × (1 tablet / 250 mg) = 2 tablets. The 'mg' units cancel, leaving you with tablets.");
  const literacyConcept = useEditableText("science-literacy-concept", "Not all evidence is equal. A well-designed randomized controlled trial (RCT) provides stronger evidence than an expert opinion. The hierarchy of evidence helps nurses evaluate which findings should most influence clinical practice. Always ask: 'What is the evidence for this intervention?'");
  const organelleConcept = useEditableText("science-organelle-concept", "Lysosomal storage diseases (Tay-Sachs, Gaucher disease) occur when enzyme deficiencies prevent lysosomes from breaking down specific substrates. Mitochondrial dysfunction is implicated in neurodegenerative diseases. Understanding organelle function reveals why these conditions manifest the way they do.");
  const waterRemember = useEditableText("science-water-remember", "Because water is critical for every metabolic process, dehydration impairs cellular function rapidly. Even 2% body water loss affects cognitive function and cardiovascular performance. This is why fluid balance assessment (intake/output, skin turgor, mucous membranes) is a fundamental nursing skill.");
  const metabolismWarning = useEditableText("science-metabolism-warning", "When cells are deprived of oxygen (ischemia), the electron transport chain halts. Cells revert to anaerobic glycolysis, producing only 2 ATP instead of ~36-38 per glucose. Lactic acid accumulates, pH drops, and cellular enzymes denature. Within minutes, irreversible damage occurs in oxygen-dependent tissues like brain and heart. This is the biochemical basis of stroke and myocardial infarction.");
  const homeostasisConcept = useEditableText("science-homeostasis-concept", "Diabetes mellitus is a failure of glucose homeostasis — in Type 1, the receptor/effector (beta cells) is destroyed; in Type 2, cells become resistant to the effector (insulin). Fever represents a temporary resetting of the temperature set point by pyrogens. Understanding feedback loops helps you predict how disruptions at any point in the loop will manifest clinically.");
  const orgchemRemember = useEditableText("science-orgchem-remember", "Large biological molecules are built by dehydration synthesis (removing water to form bonds: amino acids → proteins, monosaccharides → polysaccharides) and broken down by hydrolysis (adding water to break bonds). Digestion is fundamentally hydrolysis — enzymes add water molecules to break food into absorbable units.");

  return (
    <div className="space-y-10" data-testid="module-science-foundations">
      <div>
        <EditableModuleText sectionKey="science-title" defaultText="Science Foundations" as="h2" className="text-2xl font-bold text-gray-900 mb-2" />
        <EditableModuleText sectionKey="science-desc" defaultText="Build the essential science knowledge that underpins every nursing concept — from biomolecules to microbiology, chemistry to scientific reasoning." as="p" className="text-gray-600" multiline />
      </div>

      <MicroLesson title="Biological Systems" subtitle="Characteristics of life and levels of organization" icon={<Sparkles className="w-5 h-5" />}>
        <p className="text-sm text-gray-600 leading-relaxed">
          All living organisms share fundamental{" "}
          <HoverReveal term="characteristics of life" definition="Organization, metabolism, responsiveness, growth, reproduction, and homeostasis — the six hallmarks that distinguish living systems from non-living matter." />.
          Understanding these properties helps nurses recognize when physiological systems deviate from normal.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-1">Levels of Organization</p>
            <p className="text-xs text-blue-600">Chemical → Cellular → Tissue → Organ → Organ System → Organism. Disease can originate at any level and cascade upward.</p>
          </div>
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <p className="text-xs font-semibold text-emerald-700 mb-1">Structure-Function Relationship</p>
            <p className="text-xs text-emerald-600">Structure always dictates function. Red blood cells are biconcave to maximize oxygen-carrying surface area. Alveoli are thin-walled for efficient gas exchange.</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_science.whyThisMattersForNursing")}
          content={biosystemsConcept}
        />
      </MicroLesson>

      <MicroLesson title="Biomolecules & Metabolism" subtitle="Proteins, lipids, carbs, nucleic acids, and energy" icon={<Beaker className="w-5 h-5" />}>
        <p className="text-sm text-gray-600 leading-relaxed">
          The four major{" "}
          <HoverReveal term="biomolecules" definition="Large organic molecules essential for life: proteins (structure/enzymes), lipids (membranes/energy storage), carbohydrates (energy), and nucleic acids (genetic information)." />{" "}
          are the building blocks of all cellular structures and functions. Each plays a distinct role in maintaining health.
        </p>
        <ProgressiveReveal
          title={t("data.pre_nursing_science.theFourBiomolecules")}
          cards={[
            {
              id: "bio1",
              title: "Proteins",
              summary: "Structure, enzymes, transport, immunity",
              detail: "Made of amino acids linked by peptide bonds. Enzymes are biological catalysts that lower activation energy — nearly every metabolic reaction depends on them. Denaturation (by heat, pH change) destroys protein function.",
            },
            {
              id: "bio2",
              title: "Lipids",
              summary: "Cell membranes, energy storage, hormones",
              detail: "Phospholipids form the cell membrane bilayer. Triglycerides store energy. Cholesterol is a precursor for steroid hormones and bile salts. Saturated vs unsaturated affects cardiovascular risk.",
            },
            {
              id: "bio3",
              title: "Carbohydrates",
              summary: "Primary energy source, structural roles",
              detail: "Glucose is the body's preferred fuel. Glycogen is the storage form in liver and muscle. Complex carbs provide sustained energy; simple sugars cause rapid glucose spikes — critical for diabetic patient education.",
            },
            {
              id: "bio4",
              title: "Nucleic Acids",
              summary: "DNA and RNA — genetic information storage and expression",
              detail: "DNA stores the genetic blueprint; RNA translates it into proteins. Mutations in DNA can lead to disease (e.g., sickle cell disease from a single nucleotide change in the hemoglobin gene).",
            },
          ]}
        />
        <CognitiveCard
          type="remember"
          title={t("data.pre_nursing_science.energyTransfer")}
          content={biomoleculesRemember}
        />
      </MicroLesson>

      <MatchingExercise
        title={t("data.pre_nursing_science.biomoleculeFunctionMatching")}
        description={t("data.pre_nursing_science.matchEachBiomoleculeToIts")}
        pairs={[
          { id: "bm1", term: "Enzymes (proteins)", definition: "Catalyze metabolic reactions" },
          { id: "bm2", term: "Phospholipids", definition: "Form cell membrane bilayer" },
          { id: "bm3", term: "Glucose", definition: "Primary cellular energy source" },
          { id: "bm4", term: "DNA", definition: "Stores genetic information" },
          { id: "bm5", term: "Glycogen", definition: "Energy storage in liver and muscle" },
          { id: "bm6", term: "ATP", definition: "Universal energy currency" },
        ]}
      />

      <SelfCheckQuiz
        title={t("data.pre_nursing_science.biomoleculesMetabolismCheck")}
        questions={[
          {
            id: "sf1",
            question: "Which biomolecule forms the basic structure of cell membranes?",
            options: ["Proteins", "Phospholipids", "Carbohydrates", "Nucleic acids"],
            correctIndex: 1,
            rationale: "Phospholipids arrange in a bilayer with hydrophilic heads facing outward and hydrophobic tails facing inward, creating the selectively permeable cell membrane.",
          },
          {
            id: "sf2",
            question: "When cells lack oxygen, anaerobic metabolism produces:",
            options: ["Carbon dioxide only", "Lactic acid", "Bicarbonate", "Glucose"],
            correctIndex: 1,
            rationale: "Without oxygen, cells switch to anaerobic glycolysis, producing lactic acid as a byproduct. Accumulation of lactic acid causes metabolic acidosis — a key indicator of tissue hypoperfusion in shock.",
            hint: "Think about what happens to a patient's pH when tissues aren't getting enough oxygen.",
          },
          {
            id: "sf3",
            question: "Enzymes work by:",
            options: ["Providing energy for reactions", "Lowering activation energy", "Increasing temperature", "Destroying substrates permanently"],
            correctIndex: 1,
            rationale: "Enzymes are biological catalysts that lower the activation energy needed for a reaction. They are not consumed in the process and can be reused. Temperature and pH extremes denature enzymes.",
          },
        ]}
      />

      <MicroLesson title="DNA, Genes & Protein Synthesis" subtitle="Genetic information flow: from DNA to functional proteins" icon={<Dna className="w-5 h-5" />}>
        <p className="text-sm text-gray-600 leading-relaxed">
          The{" "}
          <HoverReveal term="central dogma" definition="The fundamental principle of molecular biology: DNA → RNA → Protein. Genetic information flows from DNA through transcription to mRNA, then through translation to protein." />{" "}
          describes how genetic information flows from DNA to functional proteins that run every process in the body.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-3">
          <div className="flex-1 p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 text-center">
            <p className="text-xs font-bold text-indigo-700 mb-1">Transcription</p>
            <p className="text-xs text-indigo-600">DNA → mRNA</p>
            <p className="text-[10px] text-indigo-500 mt-1">Occurs in the nucleus</p>
          </div>
          <div className="flex items-center justify-center text-gray-300">→</div>
          <div className="flex-1 p-4 bg-violet-50/60 rounded-xl border border-violet-100 text-center">
            <p className="text-xs font-bold text-violet-700 mb-1">Translation</p>
            <p className="text-xs text-violet-600">mRNA → Protein</p>
            <p className="text-[10px] text-violet-500 mt-1">Occurs at ribosomes</p>
          </div>
          <div className="flex items-center justify-center text-gray-300">→</div>
          <div className="flex-1 p-4 bg-purple-50/60 rounded-xl border border-purple-100 text-center">
            <p className="text-xs font-bold text-purple-700 mb-1">Protein Function</p>
            <p className="text-xs text-purple-600">Enzymes, receptors, structures</p>
            <p className="text-[10px] text-purple-500 mt-1">Determines cell behavior</p>
          </div>
        </div>
        <CognitiveCard
          type="warning"
          title={t("data.pre_nursing_science.mutationsDisease")}
          content={dnaWarning}
        />
      </MicroLesson>

      <MicroLesson title="Cell Division" subtitle="Mitosis vs meiosis and clinical relevance" icon={<Dna className="w-5 h-5" />}>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-sm font-semibold text-blue-700 mb-1">Mitosis</p>
            <p className="text-xs text-blue-600">Produces 2 identical diploid (2n) daughter cells. Used for growth, repair, and tissue maintenance. Occurs in somatic cells.</p>
            <p className="text-[10px] text-blue-500 mt-2 italic">Wound healing depends on mitosis. Cancer is uncontrolled mitosis.</p>
          </div>
          <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-100">
            <p className="text-sm font-semibold text-rose-700 mb-1">Meiosis</p>
            <p className="text-xs text-rose-600">Produces 4 genetically unique haploid (n) cells. Used only for gamete (egg/sperm) production. Includes crossing over for genetic diversity.</p>
            <p className="text-[10px] text-rose-500 mt-2 italic">Errors in meiosis → chromosomal abnormalities (e.g., Down syndrome = trisomy 21).</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_science.chromosomalIntegrity")}
          content={celldivConcept}
        />
      </MicroLesson>

      <SelfCheckQuiz
        title={t("data.pre_nursing_science.geneticsCellDivisionCheck")}
        questions={[
          {
            id: "sf4",
            question: "The central dogma of molecular biology describes the flow:",
            options: ["Protein → RNA → DNA", "RNA → DNA → Protein", "DNA → RNA → Protein", "DNA → Protein → RNA"],
            correctIndex: 2,
            rationale: "The central dogma: DNA is transcribed into mRNA (transcription), which is then translated into protein (translation). This one-directional flow governs all gene expression.",
          },
          {
            id: "sf5",
            question: "A patient with cancer has cells that divide uncontrollably. This involves dysregulation of:",
            options: ["Meiosis", "Mitosis", "Osmosis", "Diffusion"],
            correctIndex: 1,
            rationale: "Cancer is fundamentally uncontrolled mitosis. Normal cell cycle checkpoints (like p53) fail, allowing damaged cells to continue dividing. This is why chemotherapy targets rapidly dividing cells.",
            hint: "Which type of cell division is responsible for growth and repair of somatic cells?",
          },
          {
            id: "sf6",
            question: "Down syndrome (trisomy 21) results from an error during:",
            options: ["Mitosis", "Meiosis", "Transcription", "Translation"],
            correctIndex: 1,
            rationale: "Trisomy 21 occurs when chromosome 21 fails to separate during meiosis (nondisjunction), resulting in a gamete with an extra copy. The offspring inherits three copies instead of two.",
          },
        ]}
      />

      <MicroLesson title="Microbiology Essentials" subtitle="Pathogens, host interactions, and antimicrobial resistance" icon={<Microscope className="w-5 h-5" />}>
        <p className="text-sm text-gray-600 leading-relaxed">
          Understanding{" "}
          <HoverReveal term="pathogens" definition="Microorganisms capable of causing disease: bacteria, viruses, fungi, parasites, and prions. Each type requires different treatment approaches." />{" "}
          is essential for infection control, one of the most critical competencies in nursing practice.
        </p>
        <ProgressiveReveal
          title={t("data.pre_nursing_science.pathogenCategories")}
          cards={[
            {
              id: "mic1",
              title: "Bacteria",
              summary: "Single-celled prokaryotes; treated with antibiotics",
              detail: "Classified as Gram-positive (thick cell wall, stains purple) or Gram-negative (thin cell wall + outer membrane, stains pink). This distinction guides antibiotic selection. Example: MRSA is a Gram-positive bacterium resistant to methicillin.",
            },
            {
              id: "mic2",
              title: "Viruses",
              summary: "Obligate intracellular parasites; treated with antivirals",
              detail: "Viruses cannot reproduce outside host cells. They hijack cellular machinery for replication. Antibiotics are ineffective against viruses. Examples: influenza, HIV, SARS-CoV-2.",
            },
            {
              id: "mic3",
              title: "Fungi",
              summary: "Eukaryotic organisms; treated with antifungals",
              detail: "Can cause superficial infections (dermatophytes → ringworm) or systemic infections (Candida, Aspergillus) especially in immunocompromised patients. Antifungals target the ergosterol in fungal cell membranes.",
            },
            {
              id: "mic4",
              title: "Parasites & Prions",
              summary: "Diverse pathogens with unique mechanisms",
              detail: "Parasites include protozoa (malaria) and helminths (tapeworms). Prions are misfolded proteins that cause fatal neurodegenerative diseases (Creutzfeldt-Jakob disease) — no treatment exists because prions contain no DNA/RNA.",
            },
          ]}
        />
        <CognitiveCard
          type="warning"
          title={t("data.pre_nursing_science.antimicrobialResistance")}
          content={microWarning}
        />
      </MicroLesson>

      <MicroLesson title="Immunity" subtitle="Innate vs adaptive immunity, antibodies, and vaccination" icon={<Shield className="w-5 h-5" />}>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-sm font-semibold text-blue-700 mb-1">Innate Immunity</p>
            <p className="text-xs text-blue-600">Non-specific, immediate defense. Present from birth. Includes skin barriers, mucous membranes, phagocytes (neutrophils, macrophages), inflammation, and fever.</p>
            <p className="text-[10px] text-blue-500 mt-1 italic">First responders — same response regardless of pathogen.</p>
          </div>
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <p className="text-sm font-semibold text-emerald-700 mb-1">Adaptive Immunity</p>
            <p className="text-xs text-emerald-600">Specific, slower but creates memory. B cells produce antibodies; T cells directly attack infected cells. Takes days to activate initially but responds faster upon re-exposure.</p>
            <p className="text-[10px] text-emerald-500 mt-1 italic">Targeted response — memory cells provide lasting protection.</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_science.antibodyLogicVaccination")}
          content={immunityConcept}
        />
      </MicroLesson>

      <SelfCheckQuiz
        title={t("data.pre_nursing_science.microbiologyImmunityCheck")}
        questions={[
          {
            id: "sf7",
            question: "Why are antibiotics ineffective against viral infections?",
            options: [
              "Viruses are too small for antibiotics to reach",
              "Viruses lack the cellular structures antibiotics target",
              "Antibiotics only work on fungi",
              "Viruses are killed by the immune system before antibiotics can act",
            ],
            correctIndex: 1,
            rationale: "Antibiotics target bacterial structures (cell walls, ribosomes, DNA replication). Viruses lack these structures because they use the host cell's machinery to replicate. This is why antiviral drugs work differently.",
          },
          {
            id: "sf8",
            question: "A nurse caring for a patient with MRSA should prioritize:",
            options: ["Administering broad-spectrum antibiotics", "Contact precautions and hand hygiene", "Respiratory isolation only", "No special precautions needed"],
            correctIndex: 1,
            rationale: "MRSA (Methicillin-Resistant Staphylococcus aureus) spreads by contact. Contact precautions (gown, gloves) and meticulous hand hygiene are the primary interventions to prevent transmission.",
            hint: "Think about how MRSA is transmitted — contact, droplet, or airborne?",
          },
          {
            id: "sf9",
            question: "Vaccines provide protection by stimulating:",
            options: ["Innate immunity only", "Passive immunity", "Active adaptive immunity with memory cells", "Inflammatory response only"],
            correctIndex: 2,
            rationale: "Vaccines stimulate active adaptive immunity by exposing the immune system to antigens, triggering production of memory B and T cells. This allows a rapid, specific response upon future natural exposure.",
          },
        ]}
      />

      <MicroLesson title="Chemistry for Nursing" subtitle="Atoms, bonds, solutions, pH, and electrolytes" icon={<Atom className="w-5 h-5" />}>
        <p className="text-sm text-gray-600 leading-relaxed">
          Chemistry concepts directly apply to clinical nursing. Understanding{" "}
          <HoverReveal term="pH" definition="A measure of hydrogen ion concentration on a scale of 0-14. Normal blood pH is 7.35-7.45. Below 7.35 = acidosis; above 7.45 = alkalosis. Even small deviations can be life-threatening." />,{" "}
          <HoverReveal term="electrolytes" definition="Charged particles (ions) in body fluids that conduct electrical impulses. Key electrolytes: Na+, K+, Ca2+, Mg2+, Cl⁻, HCO3⁻, PO4³⁻. Essential for nerve conduction, muscle contraction, and fluid balance." />, and solution chemistry is essential for safe medication administration and patient assessment.
        </p>
        <div className="space-y-3 mt-3">
          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
            <p className="text-xs font-semibold text-purple-700 mb-1">Atomic Structure & Chemical Bonds</p>
            <p className="text-xs text-purple-600">Atoms consist of protons, neutrons, and electrons. Ionic bonds (electron transfer) create electrolytes. Covalent bonds (electron sharing) form organic molecules. Hydrogen bonds give water its unique properties.</p>
          </div>
          <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100">
            <p className="text-xs font-semibold text-teal-700 mb-1">Solutions & Concentrations</p>
            <p className="text-xs text-teal-600">IV fluids are solutions with precise concentrations. Isotonic solutions (0.9% NaCl) match plasma osmolarity. Hypertonic solutions pull water out of cells. Hypotonic solutions push water into cells.</p>
          </div>
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
            <p className="text-xs font-semibold text-amber-700 mb-1">Acids, Bases & pH</p>
            <p className="text-xs text-amber-600">Acids donate H+ ions (lower pH). Bases accept H+ ions (raise pH). Buffer systems (bicarbonate, phosphate, protein) resist pH changes. The bicarbonate buffer system is the most clinically relevant: CO2 + H2O ↔ H2CO3 ↔ H+ + HCO3⁻.</p>
          </div>
        </div>
        <CognitiveCard
          type="remember"
          title={t("data.pre_nursing_science.electrolytesIonization")}
          content={chemRemember}
        />
      </MicroLesson>

      <MatchingExercise
        title={t("data.pre_nursing_science.chemistryConceptsMatching")}
        description={t("data.pre_nursing_science.matchEachChemistryConceptTo")}
        pairs={[
          { id: "ch1", term: "pH 7.35-7.45", definition: "Normal arterial blood range" },
          { id: "ch2", term: "Isotonic (0.9% NaCl)", definition: "Same osmolarity as plasma" },
          { id: "ch3", term: "Bicarbonate buffer", definition: "Primary blood pH regulator" },
          { id: "ch4", term: "Ionization", definition: "Salt dissociation into electrolytes" },
          { id: "ch5", term: "Hydrogen bonds", definition: "Give water high specific heat" },
          { id: "ch6", term: "Hypertonic solution", definition: "Pulls water out of cells" },
        ]}
      />

      <SelfCheckQuiz
        title={t("data.pre_nursing_science.chemistryCheck")}
        questions={[
          {
            id: "sf10",
            question: "A patient receives a hypertonic IV solution. What will happen to their red blood cells?",
            options: ["Swell (hemolysis)", "Shrink (crenation)", "No change", "Divide rapidly"],
            correctIndex: 1,
            rationale: "Hypertonic solutions have higher solute concentration than inside the cell. Water moves OUT of the cell by osmosis, causing the cell to shrink (crenate). This is the opposite of what happens in hypotonic solutions.",
          },
          {
            id: "sf11",
            question: "The bicarbonate buffer system equation is CO2 + H2O ↔ H2CO3 ↔ H+ + HCO3⁻. If CO2 increases, blood pH will:",
            options: ["Increase (more alkaline)", "Decrease (more acidic)", "Stay the same", "Become neutral (7.0)"],
            correctIndex: 1,
            rationale: "Increased CO2 drives the equation to the right, producing more H+ ions (acid). This is why hypoventilation (CO2 retention) causes respiratory acidosis. The lungs regulate pH by adjusting CO2 elimination.",
            hint: "More CO2 → more carbonic acid → more H+ ions. What happens to pH when H+ increases?",
          },
          {
            id: "sf12",
            question: "Which type of chemical bond creates electrolytes when dissolved in water?",
            options: ["Covalent bonds", "Hydrogen bonds", "Ionic bonds", "Metallic bonds"],
            correctIndex: 2,
            rationale: "Ionic bonds involve electron transfer between atoms, creating charged ions. When ionic compounds dissolve in water, they dissociate into their component ions (electrolytes). For example, KCl → K+ + Cl⁻.",
          },
        ]}
      />

      <MicroLesson title="Math Skills for Science" subtitle="Scientific notation, ratios, proportions, and unit conversions" icon={<Calculator className="w-5 h-5" />}>
        <EditableModuleText sectionKey="science-math-content" defaultText="Quantitative reasoning is essential in nursing. From calculating medication dosages to interpreting lab values, math skills directly affect patient safety." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <ProgressiveReveal
          title={t("data.pre_nursing_science.essentialMathConcepts")}
          cards={[
            {
              id: "math1",
              title: "Scientific Notation",
              summary: "Expressing very large or very small numbers",
              detail: "Used for lab values and cell counts. Example: WBC count of 8,000 = 8 × 10³/µL. A bacterial colony of 100,000 = 1 × 10⁵ CFU/mL. Moving the decimal right = smaller exponent.",
            },
            {
              id: "math2",
              title: "Ratios & Proportions",
              summary: "Comparing quantities and solving for unknowns",
              detail: "Foundation of dosage calculation. If 250 mg is in 5 mL, how many mL for 100 mg? Set up: 250/5 = 100/x → x = 2 mL. Cross-multiply and divide — the most-used math skill in nursing.",
            },
            {
              id: "math3",
              title: "Unit Conversions",
              summary: "Converting between measurement systems",
              detail: "Key conversions: 1 kg = 2.2 lb, 1 inch = 2.54 cm, 1 L = 1000 mL, 1 g = 1000 mg, 1 mg = 1000 mcg. Always use dimensional analysis to verify units cancel correctly. A weight-based dose requires converting lb to kg first.",
            },
          ]}
        />
        <CognitiveCard
          type="tip"
          title={t("data.pre_nursing_science.dimensionalAnalysis")}
          content={mathTip}
        />
      </MicroLesson>

      <SelfCheckQuiz
        title={t("data.pre_nursing_science.mathSkillsCheck")}
        questions={[
          {
            id: "sf13",
            question: "A patient weighs 176 pounds. What is their weight in kilograms? (1 kg = 2.2 lb)",
            options: ["70 kg", "80 kg", "88 kg", "387 kg"],
            correctIndex: 1,
            rationale: "176 lb ÷ 2.2 lb/kg = 80 kg. Always divide pounds by 2.2 to convert to kilograms. This is essential for weight-based medication dosing.",
            hint: "To convert pounds to kilograms, divide by 2.2.",
          },
          {
            id: "sf14",
            question: "If 500 mg of a drug is in 10 mL, how many mL are needed for a 200 mg dose?",
            options: ["2 mL", "4 mL", "5 mL", "8 mL"],
            correctIndex: 1,
            rationale: "Using proportions: 500 mg/10 mL = 200 mg/x mL. Cross-multiply: 500x = 2000. Solve: x = 4 mL. Always double-check by verifying units and reasonableness.",
          },
        ]}
      />

      <MicroLesson title="Scientific Literacy" subtitle="Terminology, evidence-based thinking, and critical reasoning" icon={<BookOpen className="w-5 h-5" />}>
        <p className="text-sm text-gray-600 leading-relaxed">
          Nurses must evaluate evidence, think critically, and communicate using precise scientific terminology. These skills form the foundation of{" "}
          <HoverReveal term="evidence-based practice" definition="The integration of best available research evidence with clinical expertise and patient values/preferences to guide clinical decision-making. It ensures care is grounded in science, not tradition alone." />.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100">
            <p className="text-xs font-semibold text-indigo-700 mb-1">Scientific Terminology</p>
            <p className="text-xs text-indigo-600">Hypothesis: a testable prediction. Theory: well-supported explanation. Variable: factor that changes. Control: baseline for comparison. Peer review: expert evaluation of research.</p>
          </div>
          <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100">
            <p className="text-xs font-semibold text-teal-700 mb-1">Critical Thinking in Nursing</p>
            <p className="text-xs text-teal-600">Question assumptions. Distinguish correlation from causation. Recognize bias. Evaluate source credibility. Consider alternative explanations. Apply evidence to specific patient contexts.</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_science.evidencebasedThinking")}
          content={literacyConcept}
        />
      </MicroLesson>

      <SelfCheckQuiz
        title={t("data.pre_nursing_science.scientificLiteracyCheck")}
        questions={[
          {
            id: "sf15",
            question: "What is the difference between a hypothesis and a theory?",
            options: [
              "A hypothesis is proven; a theory is a guess",
              "A hypothesis is a testable prediction; a theory is a well-supported explanation",
              "They mean the same thing",
              "A theory is always wrong; a hypothesis is always right",
            ],
            correctIndex: 1,
            rationale: "A hypothesis is a testable prediction (e.g., 'hand hygiene reduces infection rates'). A theory is a broadly supported explanation backed by extensive evidence (e.g., germ theory). Theories are not 'just guesses' — they represent the strongest level of scientific understanding.",
          },
          {
            id: "sf16",
            question: "A study finds that patients who drink more water have fewer headaches. This demonstrates:",
            options: ["Causation", "Correlation", "A controlled experiment", "A theory"],
            correctIndex: 1,
            rationale: "This shows correlation (association) — not causation. There could be confounding variables (e.g., people who drink more water may also have healthier lifestyles). Establishing causation requires controlled experimental studies.",
            hint: "Just because two things happen together doesn't mean one causes the other.",
          },
          {
            id: "sf17",
            question: "In evidence-based practice, which provides the STRONGEST level of evidence?",
            options: ["Expert opinion", "Case study", "Systematic review of RCTs", "Single randomized controlled trial"],
            correctIndex: 2,
            rationale: "Systematic reviews and meta-analyses of multiple RCTs sit at the top of the evidence hierarchy because they synthesize findings across many studies, reducing bias and increasing generalizability. Expert opinion is the weakest level.",
          },
        ]}
      />

      <MicroLesson title="Cell Structure & Organelles" subtitle="The functional compartments within every human cell" icon={<Microscope className="w-5 h-5" />}>
        <p className="text-sm text-gray-600 leading-relaxed">
          Every human cell is a miniature factory with specialized compartments called{" "}
          <HoverReveal term="organelles" definition="Membrane-bound or non-membrane structures within a cell that perform specific functions. Each organelle contributes to cell survival, just as each organ contributes to body function." />.
          Understanding organelle function explains why certain toxins, drugs, and diseases affect cells the way they do.
        </p>
        <ProgressiveReveal
          title={t("data.pre_nursing_science.keyOrganellesAndTheirFunctions")}
          cards={[
            {
              id: "org1",
              title: "Nucleus",
              summary: "Control center housing DNA",
              detail: "Contains chromatin (uncoiled DNA) that condenses into chromosomes during division. The nuclear envelope has pores that regulate mRNA export. The nucleolus within the nucleus produces ribosomal RNA (rRNA), essential for protein synthesis.",
            },
            {
              id: "org2",
              title: "Mitochondria",
              summary: "Powerhouse — generates ATP via aerobic respiration",
              detail: "Double-membraned organelle with its own DNA (maternal inheritance). The inner membrane folds (cristae) maximize surface area for the electron transport chain. Produces ~36 ATP per glucose molecule. Cells with high energy demands (cardiac muscle, hepatocytes) have thousands of mitochondria.",
            },
            {
              id: "org3",
              title: "Endoplasmic Reticulum (ER)",
              summary: "Rough ER synthesizes proteins; Smooth ER processes lipids",
              detail: "Rough ER is studded with ribosomes — it synthesizes secretory proteins and membrane proteins. Smooth ER synthesizes lipids, detoxifies drugs (abundant in liver cells), and stores calcium in muscle cells (sarcoplasmic reticulum).",
            },
            {
              id: "org4",
              title: "Golgi Apparatus",
              summary: "Packaging and shipping center",
              detail: "Receives proteins from the rough ER, modifies them (glycosylation, phosphorylation), sorts them, and packages them into vesicles for secretion, membrane insertion, or lysosomal delivery. Think of it as the post office of the cell.",
            },
            {
              id: "org5",
              title: "Lysosomes & Peroxisomes",
              summary: "Digestive and detoxification compartments",
              detail: "Lysosomes contain hydrolytic enzymes (pH ~5) that break down worn-out organelles, bacteria, and cellular debris — autophagy and phagocytosis depend on them. Peroxisomes neutralize toxic hydrogen peroxide (H2O2) using catalase and break down fatty acids via beta-oxidation.",
            },
          ]}
        />
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_science.organelleDysfunctionDisease")}
          content={organelleConcept}
        />
      </MicroLesson>

      <MatchingExercise
        title={t("data.pre_nursing_science.organelleFunctionMatching")}
        description={t("data.pre_nursing_science.matchEachOrganelleToIts")}
        pairs={[
          { id: "om1", term: "Mitochondria", definition: "ATP production via aerobic respiration" },
          { id: "om2", term: "Rough ER", definition: "Protein synthesis and folding" },
          { id: "om3", term: "Golgi apparatus", definition: "Protein modification and packaging" },
          { id: "om4", term: "Lysosomes", definition: "Intracellular digestion and recycling" },
          { id: "om5", term: "Smooth ER", definition: "Lipid synthesis and drug detoxification" },
          { id: "om6", term: "Nucleus", definition: "Houses DNA and controls gene expression" },
        ]}
      />

      <SelfCheckQuiz
        title={t("data.pre_nursing_science.cellStructureCheck")}
        questions={[
          {
            id: "sf18",
            question: "A patient's liver biopsy shows cells with extensive smooth endoplasmic reticulum. This is most consistent with:",
            options: ["High protein secretion activity", "Active drug metabolism and detoxification", "Rapid cell division", "Impaired energy production"],
            correctIndex: 1,
            rationale: "Smooth ER is abundant in hepatocytes (liver cells) because it houses enzymes for drug detoxification (cytochrome P450 system) and lipid metabolism. Chronic drug use or alcohol exposure can cause smooth ER proliferation in liver cells.",
          },
          {
            id: "sf19",
            question: "Which organelle has its own DNA and is inherited exclusively from the mother?",
            options: ["Nucleus", "Golgi apparatus", "Mitochondria", "Lysosomes"],
            correctIndex: 2,
            rationale: "Mitochondria contain their own circular DNA (mtDNA), inherited maternally because the egg contributes all cytoplasmic organelles. Sperm mitochondria are degraded after fertilization. Mitochondrial DNA mutations cause specific inherited disorders (e.g., MELAS syndrome).",
          },
          {
            id: "sf20",
            question: "In Tay-Sachs disease, a lysosomal enzyme deficiency causes toxic lipid accumulation. This demonstrates the importance of:",
            options: ["Mitochondrial function", "Cell membrane permeability", "Intracellular digestion by lysosomes", "Protein synthesis by ribosomes"],
            correctIndex: 2,
            rationale: "Tay-Sachs results from deficiency of hexosaminidase A, a lysosomal enzyme. Without it, GM2 ganglioside accumulates in neurons, causing progressive neurological deterioration. This illustrates how organelle dysfunction translates to systemic disease.",
          },
        ]}
      />

      <MicroLesson title="Water & Its Unique Properties" subtitle="Why water is the foundation of all biological systems" icon={<Beaker className="w-5 h-5" />}>
        <p className="text-sm text-gray-600 leading-relaxed">
          Water comprises approximately 60% of adult body weight and is the{" "}
          <HoverReveal term="universal solvent" definition="Water dissolves more substances than any other liquid due to its polar nature. This property is essential for nutrient transport, waste removal, and metabolic reactions in the body." />{" "}
          of biology. Its unique molecular properties make life possible.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-cyan-50/60 rounded-xl border border-cyan-100">
            <p className="text-xs font-semibold text-cyan-700 mb-1">Polarity & Hydrogen Bonding</p>
            <p className="text-xs text-cyan-600">Water is a polar molecule — oxygen pulls electrons more strongly than hydrogen, creating partial charges. This polarity allows hydrogen bonding between water molecules, giving water high cohesion, adhesion, and surface tension.</p>
          </div>
          <div className="p-4 bg-sky-50/60 rounded-xl border border-sky-100">
            <p className="text-xs font-semibold text-sky-700 mb-1">High Specific Heat</p>
            <p className="text-xs text-sky-600">Water resists temperature changes due to extensive hydrogen bonding. This stabilizes body temperature — the body can absorb significant heat before temperature rises. Sweating exploits water's high heat of vaporization for cooling.</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-1">Solvent Properties</p>
            <p className="text-xs text-blue-600">Polar and ionic substances dissolve in water (hydrophilic). Nonpolar substances do not (hydrophobic). This governs drug solubility — water-soluble drugs distribute throughout body fluids while fat-soluble drugs accumulate in adipose tissue.</p>
          </div>
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100">
            <p className="text-xs font-semibold text-indigo-700 mb-1">Reactant & Medium</p>
            <p className="text-xs text-indigo-600">Water participates directly in hydrolysis reactions (breaking bonds by adding water) and dehydration synthesis (forming bonds by removing water). Nearly all metabolic reactions occur in aqueous solution.</p>
          </div>
        </div>
        <CognitiveCard
          type="remember"
          title={t("data.pre_nursing_science.dehydrationWaterBalance")}
          content={waterRemember}
        />
      </MicroLesson>

      <MicroLesson title="Cellular Energy Metabolism" subtitle="Glycolysis, Krebs cycle, electron transport chain" icon={<Sparkles className="w-5 h-5" />}>
        <EditableModuleText sectionKey="science-metabolism-content" defaultText="Cells extract energy from nutrients through a series of metabolic pathways. Understanding these pathways explains why oxygen deprivation is so dangerous and how metabolic diseases affect the body." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <ProgressiveReveal
          title={t("data.pre_nursing_science.theThreeStagesOfAerobic")}
          cards={[
            {
              id: "aer1",
              title: "Stage 1: Glycolysis",
              summary: "Glucose → 2 pyruvate (occurs in cytoplasm, no oxygen required)",
              detail: "Glucose (6-carbon) is split into two pyruvate molecules (3-carbon each). Net yield: 2 ATP and 2 NADH. This is the only pathway that functions without oxygen. When oxygen is absent, pyruvate is converted to lactate (anaerobic metabolism) — this produces far less energy and generates acid.",
            },
            {
              id: "aer2",
              title: "Stage 2: Krebs Cycle (Citric Acid Cycle)",
              summary: "Pyruvate → CO₂ + electron carriers (occurs in mitochondrial matrix)",
              detail: "Pyruvate is converted to acetyl-CoA, which enters the Krebs cycle. Each turn produces CO₂ (exhaled by the lungs), NADH, FADH₂ (electron carriers), and 1 ATP. The CO₂ produced here is the carbon dioxide you breathe out — directly linking cellular metabolism to respiratory function.",
            },
            {
              id: "aer3",
              title: "Stage 3: Electron Transport Chain (ETC)",
              summary: "NADH/FADH₂ → ATP (occurs on inner mitochondrial membrane, requires O₂)",
              detail: "NADH and FADH₂ donate electrons to a series of protein complexes. As electrons pass through, protons are pumped across the membrane, creating a gradient. ATP synthase harnesses this gradient to produce ~34 ATP. Oxygen is the final electron acceptor — without it, the entire chain stops. This is why oxygen deprivation kills cells rapidly.",
            },
          ]}
        />
        <CognitiveCard
          type="warning"
          title={t("data.pre_nursing_science.oxygenDeprivationCellDeath")}
          content={metabolismWarning}
        />
        <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100 mt-3">
          <p className="text-xs font-semibold text-amber-700 mb-1">Metabolism Summary</p>
          <p className="text-xs text-amber-600">C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ~36-38 ATP. This single equation connects nutrition (glucose input), respiration (O₂ input, CO₂ output), and cellular energy. Every vital sign you assess reflects this equation in action.</p>
        </div>
      </MicroLesson>

      <SelfCheckQuiz
        title={t("data.pre_nursing_science.metabolismWaterPropertiesCheck")}
        questions={[
          {
            id: "sf21",
            question: "Why does water's high specific heat capacity benefit the human body?",
            options: ["It helps water freeze quickly", "It stabilizes body temperature against rapid changes", "It makes water a poor solvent", "It increases metabolic rate"],
            correctIndex: 1,
            rationale: "Water's high specific heat means it absorbs large amounts of heat before its temperature rises significantly. This prevents rapid body temperature fluctuations during exercise, fever, or environmental exposure — a critical aspect of thermoregulation.",
          },
          {
            id: "sf22",
            question: "During aerobic respiration, which stage produces the MOST ATP?",
            options: ["Glycolysis", "Krebs cycle", "Electron transport chain", "Fermentation"],
            correctIndex: 2,
            rationale: "The electron transport chain produces approximately 34 of the 36-38 total ATP generated per glucose molecule. It requires oxygen as the final electron acceptor, which is why aerobic metabolism is vastly more efficient than anaerobic metabolism.",
            hint: "This is the stage that requires oxygen and occurs on the inner mitochondrial membrane.",
          },
          {
            id: "sf23",
            question: "A patient in shock has elevated blood lactate levels. This indicates:",
            options: ["Adequate oxygen delivery to tissues", "Cells are using anaerobic glycolysis due to insufficient oxygen", "Excess protein metabolism", "Normal exercise response"],
            correctIndex: 1,
            rationale: "Elevated lactate indicates cells have switched to anaerobic metabolism because oxygen delivery is inadequate (hypoperfusion). Without oxygen, pyruvate is converted to lactate instead of entering the Krebs cycle. Serum lactate is a key marker of tissue hypoxia in critical care.",
          },
          {
            id: "sf24",
            question: "Fat-soluble drugs tend to accumulate in adipose tissue because:",
            options: ["Adipose tissue has more blood flow", "Nonpolar substances dissolve in nonpolar environments", "Fat cells actively transport drugs inside", "Adipose tissue has more mitochondria"],
            correctIndex: 1,
            rationale: "The principle 'like dissolves like' applies. Fat-soluble (lipophilic/nonpolar) drugs dissolve in the nonpolar lipid environment of adipose tissue. This is why obese patients may have altered drug distribution and why some fat-soluble toxins persist in the body for extended periods.",
          },
        ]}
      />

      <MicroLesson title="Homeostasis & Feedback Loops" subtitle="How the body maintains internal stability through self-regulation" icon={<Activity className="w-5 h-5" />}>
        <p className="text-sm text-gray-600 leading-relaxed">
          <HoverReveal term="Homeostasis" definition="The maintenance of a relatively stable internal environment despite changes in external conditions. It is the single most important concept in physiology — virtually all disease can be understood as a failure of homeostasis." />{" "}
          is the body's ability to maintain stable internal conditions. Every organ system participates in homeostatic regulation through feedback mechanisms.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-green-50/60 rounded-xl border border-green-100">
            <p className="text-sm font-semibold text-green-700 mb-1">Negative Feedback</p>
            <p className="text-xs text-green-600">The response OPPOSES the stimulus, returning the variable to its set point. This is the most common feedback mechanism. Example: when blood glucose rises after eating, the pancreas releases insulin, which lowers blood glucose back to normal.</p>
            <p className="text-[10px] text-green-500 mt-1 italic">Components: receptor (sensor) → control center (integrator) → effector (response)</p>
          </div>
          <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-100">
            <p className="text-sm font-semibold text-rose-700 mb-1">Positive Feedback</p>
            <p className="text-xs text-rose-600">The response AMPLIFIES the stimulus, driving the variable further from its starting point. Less common but critical in specific situations. Example: during labor, oxytocin causes uterine contractions, which push the baby against the cervix, triggering more oxytocin release.</p>
            <p className="text-[10px] text-rose-500 mt-1 italic">Always requires an external event to terminate the cycle.</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_science.diseaseAsHomeostaticFailure")}
          content={homeostasisConcept}
        />
      </MicroLesson>

      <MicroLesson title="Organic Chemistry Basics" subtitle="Functional groups, isomers, and biological molecules" icon={<FlaskConical className="w-5 h-5" />}>
        <p className="text-sm text-gray-600 leading-relaxed">
          Organic chemistry is the study of carbon-containing compounds. Carbon's ability to form four covalent bonds with diverse atoms creates the molecular complexity needed for life. Key{" "}
          <HoverReveal term="functional groups" definition="Specific groupings of atoms within molecules that determine the molecule's chemical behavior and properties. Examples: hydroxyl (-OH), carboxyl (-COOH), amino (-NH₂), phosphate (-PO₄)." />{" "}
          determine how biological molecules interact.
        </p>
        <div className="space-y-3 mt-3">
          <div className="p-4 bg-violet-50/60 rounded-xl border border-violet-100">
            <p className="text-xs font-semibold text-violet-700 mb-1">Hydroxyl Group (-OH)</p>
            <p className="text-xs text-violet-600">Makes molecules polar and water-soluble. Found in alcohols, sugars, and many drugs. Ethanol (CH₃CH₂OH) is metabolized by alcohol dehydrogenase in the liver.</p>
          </div>
          <div className="p-4 bg-fuchsia-50/60 rounded-xl border border-fuchsia-100">
            <p className="text-xs font-semibold text-fuchsia-700 mb-1">Carboxyl (-COOH) & Amino (-NH₂) Groups</p>
            <p className="text-xs text-fuchsia-600">Amino acids contain both groups. The carboxyl group acts as an acid (donates H+), the amino group acts as a base (accepts H+). Peptide bonds form between these groups during protein synthesis via dehydration reactions.</p>
          </div>
          <div className="p-4 bg-pink-50/60 rounded-xl border border-pink-100">
            <p className="text-xs font-semibold text-pink-700 mb-1">Phosphate Group (-PO₄)</p>
            <p className="text-xs text-pink-600">Found in ATP, DNA, and phospholipids. High-energy phosphate bonds in ATP store and release energy for cellular work. Phosphorylation (adding a phosphate group) activates or deactivates enzymes — a key regulatory mechanism.</p>
          </div>
        </div>
        <CognitiveCard
          type="remember"
          title={t("data.pre_nursing_science.dehydrationSynthesisHydrolysis")}
          content={orgchemRemember}
        />
      </MicroLesson>

      <MatchingExercise
        title={t("data.pre_nursing_science.advancedScienceConceptsMatching")}
        description={t("data.pre_nursing_science.matchEachConceptToIts")}
        pairs={[
          { id: "adv1", term: "Negative feedback", definition: "Response opposes stimulus to restore set point" },
          { id: "adv2", term: "Positive feedback", definition: "Response amplifies stimulus until external termination" },
          { id: "adv3", term: "Electron transport chain", definition: "Produces ~34 ATP using oxygen as final electron acceptor" },
          { id: "adv4", term: "Hydrolysis", definition: "Breaking bonds by adding water" },
          { id: "adv5", term: "Phospholipid bilayer", definition: "Cell membrane structure with polar heads and nonpolar tails" },
          { id: "adv6", term: "Glycolysis", definition: "Glucose splitting that occurs without oxygen in cytoplasm" },
          { id: "adv7", term: "Mitochondrial cristae", definition: "Inner membrane folds that maximize ATP production surface area" },
          { id: "adv8", term: "Hydroxyl group (-OH)", definition: "Functional group that increases water solubility" },
        ]}
      />

      <SelfCheckQuiz
        title={t("data.pre_nursing_science.advancedScienceFoundationsCheck")}
        questions={[
          {
            id: "sf25",
            question: "Blood glucose homeostasis is maintained primarily by:",
            options: ["Positive feedback from the adrenal glands", "Negative feedback involving insulin and glucagon", "Conscious dietary control only", "Positive feedback from the pancreas"],
            correctIndex: 1,
            rationale: "Blood glucose regulation is a classic negative feedback loop. When glucose rises, insulin is released to lower it. When glucose falls, glucagon is released to raise it. Both hormones work in opposition to maintain the set point — this is the mechanism disrupted in diabetes.",
          },
          {
            id: "sf26",
            question: "During digestion, starch is broken down into glucose by:",
            options: ["Dehydration synthesis", "Hydrolysis", "Oxidation", "Phosphorylation"],
            correctIndex: 1,
            rationale: "Hydrolysis (hydro = water, lysis = break) uses water to cleave the glycosidic bonds between glucose units in starch. Amylase in saliva and pancreatic secretions catalyzes this reaction. All digestive breakdown of macromolecules occurs via hydrolysis.",
          },
          {
            id: "sf27",
            question: "A cell with an unusually large number of mitochondria is most likely involved in:",
            options: ["Fat storage", "High energy-demand activity", "Cell division", "Protein secretion"],
            correctIndex: 1,
            rationale: "Cells with high energy demands accumulate more mitochondria to produce more ATP. Cardiac muscle cells, skeletal muscle during exercise, renal tubular cells, and hepatocytes all have abundant mitochondria. A cell's mitochondrial density reflects its metabolic activity.",
            hint: "Think about which cell types need the most ATP to function.",
          },
        ]}
      />
    </div>
  );
}
