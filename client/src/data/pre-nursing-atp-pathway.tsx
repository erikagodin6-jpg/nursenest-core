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
import { Zap, Flame, Wind, AlertTriangle, Beaker } from "lucide-react";

export function ATPPathwayModule() {
  const { t } = useI18n();
  const atpCurrencyContent = useEditableText("atp-currency-content", "Adenosine triphosphate (ATP) is the universal energy currency of all living cells. Every cellular process — muscle contraction, nerve impulse transmission, active transport across membranes, biosynthesis of molecules — requires ATP. When ATP is hydrolyzed (broken down) to ADP + inorganic phosphate (Pi), it releases energy that powers these processes. The cell maintains a constant cycle of ATP production and consumption, producing and using approximately its own body weight in ATP every single day.");
  const anaerobicWarningContent = useEditableText("atp-anaerobic-warning", "When oxygen is unavailable, cells can only produce 2 ATP per glucose molecule through glycolysis alone — compared to approximately 36-38 ATP with full aerobic metabolism. This is a 95% reduction in energy output. Cells cannot sustain normal function on anaerobic metabolism alone for extended periods. Tissues with high metabolic demands (brain, heart, kidneys) are the first to suffer damage during oxygen deprivation because they cannot meet their energy needs through glycolysis alone.");
  const dkaContent = useEditableText("atp-dka-content", "In diabetic ketoacidosis (DKA), cells cannot use glucose for energy due to insulin deficiency (Type 1 diabetes) or severe insulin resistance. Without insulin, glucose cannot enter most cells despite being abundant in the blood (hyperglycemia). Starving cells switch to fat metabolism as an alternative fuel source. Fat breakdown produces acetyl-CoA faster than the Krebs cycle can process it. Excess acetyl-CoA is converted to ketone bodies (acetoacetate, beta-hydroxybutyrate, acetone). Ketone bodies are acids — their accumulation causes metabolic acidosis (low pH, low HCO3). The body attempts respiratory compensation by increasing the rate and depth of breathing (Kussmaul respirations) to blow off CO2 and raise pH.");

  return (
    <div className="space-y-10" data-testid="module-atp-pathway">
      <div>
        <EditableModuleText sectionKey="atp-title" defaultText="ATP & Cellular Energy Pathways" as="h2" className="text-2xl font-bold text-gray-900 mb-2" />
        <EditableModuleText sectionKey="atp-desc" defaultText="Understand how cells produce energy through glycolysis, the Krebs cycle, and the electron transport chain. Learn why oxygen is critical for ATP production, what happens during anaerobic metabolism, and how metabolic disruptions like DKA connect to acid-base imbalances." as="p" className="text-gray-600" multiline />
      </div>

      <MicroLesson title="ATP: The Energy Currency of Life" subtitle="Why every cell depends on adenosine triphosphate" icon={<Zap className="w-5 h-5" />}>
        <EditableModuleText sectionKey="atp-intro-content" defaultText="ATP (adenosine triphosphate) consists of an adenine base, a ribose sugar, and three phosphate groups. The bond between the second and third phosphate group is a high-energy bond. When this bond is broken by hydrolysis, energy is released for cellular work, and ATP becomes ADP (adenosine diphosphate). Cells must continuously regenerate ATP from ADP to sustain life." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-yellow-50/60 rounded-xl border border-yellow-100">
            <p className="text-xs font-semibold text-yellow-700 mb-1">ATP Structure</p>
            <p className="text-xs text-yellow-600">Adenine + Ribose + 3 Phosphate groups. The terminal phosphate bond stores the most usable energy. ATP → ADP + Pi + Energy. ADP can be recharged back to ATP using energy from food molecules (glucose, fatty acids, amino acids).</p>
          </div>
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-1">Where ATP Is Used</p>
            <p className="text-xs text-blue-600">Muscle contraction (actin-myosin interaction). Active transport (Na+/K+ pump uses 1 ATP per cycle). Nerve impulse transmission. DNA/RNA synthesis. Protein synthesis at ribosomes. Cell division. Body temperature maintenance.</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_atp_pathway.atpAsUniversalEnergyCurrency")}
          content={atpCurrencyContent}
        />
      </MicroLesson>

      <MicroLesson title="Glycolysis: The First Step" subtitle="Glucose splitting in the cytoplasm" icon={<Beaker className="w-5 h-5" />}>
        <EditableModuleText sectionKey="atp-glycolysis-content" defaultText="Glycolysis is the first stage of cellular respiration and occurs in the cytoplasm of every cell — it does not require mitochondria or oxygen. One 6-carbon glucose molecule is split into two 3-carbon pyruvate molecules. The process uses 2 ATP to get started (energy investment phase) but produces 4 ATP total, yielding a net gain of 2 ATP per glucose molecule. Glycolysis also produces 2 NADH electron carriers that will be used later in the electron transport chain if oxygen is available." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <ProgressiveReveal
          title={t("data.pre_nursing_atp_pathway.glycolysisStepByStep")}
          cards={[
            {
              id: "gly1",
              title: "Energy Investment Phase",
              summary: "2 ATP are consumed to activate glucose",
              detail: "Glucose (6 carbons) is phosphorylated twice using 2 ATP molecules. This destabilizes the molecule and prepares it for splitting. The enzyme hexokinase catalyzes the first phosphorylation, trapping glucose inside the cell.",
            },
            {
              id: "gly2",
              title: "Glucose Splitting",
              summary: "6-carbon molecule splits into two 3-carbon molecules",
              detail: "The 6-carbon fructose-1,6-bisphosphate is cleaved into two 3-carbon molecules called glyceraldehyde-3-phosphate (G3P). From this point forward, every reaction happens twice — once for each G3P molecule.",
            },
            {
              id: "gly3",
              title: "Energy Payoff Phase",
              summary: "4 ATP and 2 NADH are produced",
              detail: "Each G3P is oxidized, transferring electrons to NAD+ to form NADH (2 total). Substrate-level phosphorylation produces 4 ATP total (2 per G3P). Net gain: 2 ATP (4 produced minus 2 invested). Two pyruvate molecules are the final products.",
            },
            {
              id: "gly4",
              title: "Pyruvate at the Crossroads",
              summary: "Oxygen determines what happens next",
              detail: "If oxygen is available (aerobic conditions): pyruvate enters the mitochondria, is converted to acetyl-CoA, and enters the Krebs cycle for maximum ATP production. If oxygen is absent (anaerobic conditions): pyruvate is converted to lactate (lactic acid) in the cytoplasm, regenerating NAD+ so glycolysis can continue — but no additional ATP is produced.",
            },
          ]}
        />
        <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 mt-3">
          <p className="text-xs font-semibold text-emerald-700 mb-1">Glycolysis Summary</p>
          <p className="text-xs text-emerald-600"><strong>Location:</strong> Cytoplasm. <strong>Input:</strong> 1 Glucose (6C) + 2 ATP + 2 NAD+. <strong>Output:</strong> 2 Pyruvate (3C) + 4 ATP (net 2) + 2 NADH. <strong>Oxygen required:</strong> No — glycolysis is anaerobic. <strong>Clinical relevance:</strong> Red blood cells lack mitochondria and rely entirely on glycolysis for ATP.</p>
        </div>
      </MicroLesson>

      <MicroLesson title="Aerobic vs Anaerobic Metabolism" subtitle="The critical role of oxygen in energy production" icon={<Wind className="w-5 h-5" />}>
        <EditableModuleText sectionKey="atp-aerobic-anaerobic-content" defaultText="The presence or absence of oxygen determines which metabolic pathway cells use after glycolysis. Aerobic metabolism (with oxygen) produces approximately 36-38 ATP per glucose molecule through the Krebs cycle and electron transport chain in the mitochondria. Anaerobic metabolism (without oxygen) produces only 2 ATP per glucose through glycolysis alone and converts pyruvate to lactate." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-green-50/60 rounded-xl border border-green-100">
            <p className="text-xs font-semibold text-green-700 mb-1">Aerobic Metabolism (With O₂)</p>
            <p className="text-xs text-green-600"><strong>Location:</strong> Mitochondria. <strong>Pathway:</strong> Glycolysis → Pyruvate → Acetyl-CoA → Krebs Cycle → Electron Transport Chain. <strong>Total ATP:</strong> ~36-38 per glucose. <strong>Byproducts:</strong> CO₂ + H₂O. <strong>Sustainable:</strong> Yes — can run continuously as long as O₂ and fuel are available.</p>
          </div>
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-100">
            <p className="text-xs font-semibold text-red-700 mb-1">Anaerobic Metabolism (Without O₂)</p>
            <p className="text-xs text-red-600"><strong>Location:</strong> Cytoplasm only. <strong>Pathway:</strong> Glycolysis → Pyruvate → Lactate. <strong>Total ATP:</strong> 2 per glucose (only glycolysis). <strong>Byproduct:</strong> Lactic acid (lactate + H+). <strong>Sustainable:</strong> No — lactic acid accumulates, causing acidosis and cellular dysfunction.</p>
          </div>
        </div>
        <CognitiveCard
          type="warning"
          title={t("data.pre_nursing_atp_pathway.whyAnaerobicMetabolismIsDangerous")}
          content={anaerobicWarningContent}
        />
      </MicroLesson>

      <MicroLesson title="Krebs Cycle & Electron Transport Chain" subtitle="The powerhouse reactions inside mitochondria" icon={<Flame className="w-5 h-5" />}>
        <EditableModuleText sectionKey="atp-krebs-etc-content" defaultText="The Krebs cycle (also called the citric acid cycle or TCA cycle) and the electron transport chain (ETC) are the two final stages of aerobic cellular respiration. Together, they occur inside the mitochondria and produce the vast majority of ATP — approximately 34 of the 36-38 total ATP molecules generated from one glucose molecule." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="space-y-3 mt-3">
          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
            <p className="text-xs font-semibold text-purple-700 mb-1">Krebs Cycle (Citric Acid Cycle)</p>
            <p className="text-xs text-purple-600"><strong>Location:</strong> Mitochondrial matrix. <strong>Input:</strong> Acetyl-CoA (2-carbon) combines with oxaloacetate (4-carbon) to form citrate (6-carbon). <strong>Process:</strong> Through a series of 8 reactions, citrate is progressively oxidized back to oxaloacetate, releasing 2 CO₂ molecules per turn. <strong>Output per turn:</strong> 3 NADH + 1 FADH₂ + 1 GTP (equivalent to 1 ATP). <strong>The cycle turns twice per glucose</strong> (because one glucose produces 2 acetyl-CoA). Total per glucose: 6 NADH + 2 FADH₂ + 2 ATP.</p>
          </div>
          <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-100">
            <p className="text-xs font-semibold text-orange-700 mb-1">Electron Transport Chain (ETC)</p>
            <p className="text-xs text-orange-600"><strong>Location:</strong> Inner mitochondrial membrane. <strong>Process:</strong> NADH and FADH₂ donate electrons to a series of protein complexes (I, II, III, IV). As electrons pass through these complexes, energy is released and used to pump H+ ions across the membrane, creating a concentration gradient. <strong>ATP synthase</strong> uses this H+ gradient (chemiosmosis) to produce ATP — like a dam generating hydroelectric power. <strong>Oxygen is the final electron acceptor</strong> — it combines with electrons and H+ to form water. <strong>Output:</strong> ~34 ATP from all NADH and FADH₂ combined.</p>
          </div>
          <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100">
            <p className="text-xs font-semibold text-teal-700 mb-1">Why Oxygen Is the Final Electron Acceptor</p>
            <p className="text-xs text-teal-600">Without oxygen at the end of the ETC, electrons have nowhere to go. The entire chain backs up — NADH and FADH₂ cannot be recycled, the Krebs cycle stops, and the cell is forced into anaerobic glycolysis. This is why oxygen deprivation (hypoxia) is so dangerous: it doesn't just reduce oxygen supply — it shuts down the entire aerobic energy production system, reducing ATP output by ~95%.</p>
          </div>
        </div>
      </MicroLesson>

      <MicroLesson title="Lactic Acid, DKA & Acid-Base Connections" subtitle="When energy pathways go wrong" icon={<AlertTriangle className="w-5 h-5" />}>
        <EditableModuleText sectionKey="atp-clinical-content" defaultText="Understanding cellular energy pathways is directly relevant to clinical nursing. Lactic acidosis occurs when tissues are forced into anaerobic metabolism, and diabetic ketoacidosis (DKA) occurs when cells cannot access glucose and switch to fat metabolism. Both conditions produce metabolic acidosis — a decrease in blood pH caused by accumulation of metabolic acids." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="space-y-3 mt-3">
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-100">
            <p className="text-xs font-semibold text-red-700 mb-1">Lactic Acidosis</p>
            <p className="text-xs text-red-600"><strong>Cause:</strong> Tissue hypoxia forces anaerobic metabolism → pyruvate is converted to lactate + H+. <strong>Common triggers:</strong> Shock (any type), cardiac arrest, severe anemia, carbon monoxide poisoning, intense exercise. <strong>Lab finding:</strong> Elevated serum lactate (&gt;2 mmol/L). <strong>ABG pattern:</strong> Metabolic acidosis — low pH, low HCO₃⁻, normal or low PaCO₂ (respiratory compensation). <strong>Treatment:</strong> Correct the underlying cause of hypoxia — restore perfusion and oxygenation.</p>
          </div>
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
            <p className="text-xs font-semibold text-amber-700 mb-1">Diabetic Ketoacidosis (DKA)</p>
            <p className="text-xs text-amber-600"><strong>Cause:</strong> Insulin deficiency → glucose cannot enter cells → cells metabolize fat → excess acetyl-CoA → ketone body production. <strong>Key signs:</strong> Hyperglycemia (&gt;250 mg/dL), ketonuria, Kussmaul respirations (deep/rapid breathing), fruity breath odor (acetone), dehydration. <strong>ABG pattern:</strong> Metabolic acidosis — low pH, low HCO₃⁻, low PaCO₂ (respiratory compensation). <strong>Treatment:</strong> IV insulin, IV fluids, electrolyte replacement (especially potassium).</p>
          </div>
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-1">Metabolic vs Respiratory Acidosis</p>
            <p className="text-xs text-blue-600"><strong>Metabolic acidosis:</strong> Caused by accumulation of metabolic acids (lactic acid, ketoacids) OR loss of bicarbonate. pH low, HCO₃⁻ low. Body compensates by hyperventilation (blowing off CO₂). <strong>Respiratory acidosis:</strong> Caused by CO₂ retention due to hypoventilation (COPD, respiratory depression, airway obstruction). pH low, PaCO₂ high. Body compensates by retaining HCO₃⁻ via kidneys. <strong>Key distinction:</strong> Look at the PaCO₂ — if it matches the pH direction, the problem is respiratory; if HCO₃⁻ matches, the problem is metabolic.</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_atp_pathway.dkaFatMetabolismWhenGlucose")}
          content={dkaContent}
        />
      </MicroLesson>

      <MatchingExercise
        title={t("data.pre_nursing_atp_pathway.matchTheEnergyPathwayConcepts")}
        pairs={[
          { id: "glycolysis", term: "Glycolysis", definition: "Splits glucose into 2 pyruvate in the cytoplasm (net 2 ATP)" },
          { id: "krebs", term: "Krebs cycle", definition: "Oxidizes acetyl-CoA in the mitochondrial matrix, producing CO₂ and electron carriers" },
          { id: "etc", term: "Electron transport chain", definition: "Uses NADH/FADH₂ to pump H+ and generate ~34 ATP with O₂ as final acceptor" },
          { id: "anaerobic", term: "Anaerobic metabolism", definition: "Converts pyruvate to lactate when oxygen is absent (only 2 ATP)" },
          { id: "ketogenesis", term: "Ketogenesis", definition: "Fat breakdown producing ketone bodies when glucose is unavailable to cells" },
          { id: "chemiosmosis", term: "Chemiosmosis", definition: "H+ gradient across inner mitochondrial membrane drives ATP synthase" },
        ]}
      />

      <SelfCheckQuiz
        title={t("data.pre_nursing_atp_pathway.atpCellularEnergyPathwaysQuiz")}
        questions={[
          {
            id: "atp1",
            question: "How many net ATP molecules are produced during glycolysis from one glucose molecule?",
            options: ["0", "2", "4", "36"],
            correctIndex: 1,
            rationale: "Glycolysis uses 2 ATP in the investment phase and produces 4 ATP in the payoff phase, yielding a net gain of 2 ATP per glucose molecule.",
          },
          {
            id: "atp2",
            question: "Where does glycolysis occur within the cell?",
            options: ["Mitochondrial matrix", "Inner mitochondrial membrane", "Cytoplasm", "Nucleus"],
            correctIndex: 2,
            rationale: "Glycolysis occurs in the cytoplasm of the cell. It does not require mitochondria, which is why even red blood cells (which lack mitochondria) can perform glycolysis.",
          },
          {
            id: "atp3",
            question: "What is the final electron acceptor in the electron transport chain?",
            options: ["Carbon dioxide (CO₂)", "NADH", "Oxygen (O₂)", "Water (H₂O)"],
            correctIndex: 2,
            rationale: "Oxygen is the final electron acceptor in the ETC. It combines with electrons and hydrogen ions to form water. Without oxygen, the entire chain backs up and aerobic ATP production stops.",
          },
          {
            id: "atp4",
            question: "A patient in hypovolemic shock has an elevated serum lactate level. This is because:",
            options: ["The liver is producing excess glucose", "Tissue hypoxia forces anaerobic metabolism, producing lactic acid", "The kidneys are retaining too much bicarbonate", "Oxygen is being consumed too slowly"],
            correctIndex: 1,
            rationale: "In shock, inadequate tissue perfusion causes hypoxia. Cells switch to anaerobic metabolism, converting pyruvate to lactate instead of sending it to the Krebs cycle. Elevated lactate is a marker of tissue hypoxia.",
          },
          {
            id: "atp5",
            question: "Approximately how many total ATP molecules are produced from one glucose molecule through complete aerobic respiration?",
            options: ["2", "4", "12", "36-38"],
            correctIndex: 3,
            rationale: "Complete aerobic respiration (glycolysis + Krebs cycle + ETC) produces approximately 36-38 ATP per glucose. Glycolysis contributes 2, the Krebs cycle contributes 2, and the ETC contributes approximately 34.",
          },
          {
            id: "atp6",
            question: "In DKA, why do cells switch to fat metabolism?",
            options: ["Fat produces more ATP than glucose", "Insulin deficiency prevents glucose from entering cells", "The mitochondria prefer fatty acids", "Blood glucose levels are too low"],
            correctIndex: 1,
            rationale: "In DKA (typically Type 1 diabetes), insulin deficiency prevents glucose from entering cells via GLUT4 transporters. Despite high blood glucose (hyperglycemia), cells are essentially starving and switch to fat metabolism as an alternative fuel source.",
          },
          {
            id: "atp7",
            question: "The Krebs cycle occurs in which cellular compartment?",
            options: ["Cytoplasm", "Nucleus", "Mitochondrial matrix", "Cell membrane"],
            correctIndex: 2,
            rationale: "The Krebs cycle takes place in the mitochondrial matrix, where acetyl-CoA is oxidized through a series of reactions that produce NADH, FADH₂, GTP, and CO₂.",
          },
          {
            id: "atp8",
            question: "What is the primary byproduct of anaerobic metabolism that causes tissue acidosis?",
            options: ["Carbon dioxide", "Ketone bodies", "Lactic acid (lactate + H+)", "Ammonia"],
            correctIndex: 2,
            rationale: "During anaerobic metabolism, pyruvate is converted to lactate, and hydrogen ions (H+) are released. The accumulation of H+ ions lowers tissue pH, causing lactic acidosis.",
          },
          {
            id: "atp9",
            question: "Kussmaul respirations in a patient with DKA represent:",
            options: ["Respiratory acidosis due to CO₂ retention", "Respiratory compensation for metabolic acidosis", "Primary respiratory alkalosis", "A sign of airway obstruction"],
            correctIndex: 1,
            rationale: "Kussmaul respirations (deep, rapid breathing) are the body's respiratory compensation for metabolic acidosis in DKA. By increasing ventilation, the body blows off more CO₂, which helps raise the blood pH toward normal.",
          },
          {
            id: "atp10",
            question: "Which molecule carries electrons from glycolysis and the Krebs cycle to the electron transport chain?",
            options: ["ATP", "Glucose", "NADH and FADH₂", "Oxygen"],
            correctIndex: 2,
            rationale: "NADH and FADH₂ are electron carriers that accept electrons during glycolysis and the Krebs cycle, then donate them to the electron transport chain, where the energy is used to produce ATP.",
          },
          {
            id: "atp11",
            question: "What happens to pyruvate when oxygen IS available?",
            options: ["It is converted to lactate", "It is excreted by the kidneys", "It is converted to acetyl-CoA and enters the Krebs cycle", "It is stored as glycogen"],
            correctIndex: 2,
            rationale: "When oxygen is available, pyruvate enters the mitochondria and is converted to acetyl-CoA by pyruvate dehydrogenase. Acetyl-CoA then enters the Krebs cycle for further energy extraction.",
          },
          {
            id: "atp12",
            question: "Red blood cells rely exclusively on glycolysis for ATP because they:",
            options: ["Have extra-large mitochondria", "Lack mitochondria entirely", "Prefer anaerobic metabolism", "Cannot absorb glucose"],
            correctIndex: 1,
            rationale: "Mature red blood cells lack mitochondria (and a nucleus), so they cannot perform the Krebs cycle or electron transport chain. They depend entirely on glycolysis, producing only 2 ATP per glucose molecule.",
          },
          {
            id: "atp13",
            question: "Chemiosmosis in the ETC refers to:",
            options: ["The breakdown of glucose in the cytoplasm", "The H+ gradient driving ATP synthase to produce ATP", "The conversion of pyruvate to acetyl-CoA", "The release of CO₂ from the Krebs cycle"],
            correctIndex: 1,
            rationale: "Chemiosmosis is the process by which the H+ (proton) gradient across the inner mitochondrial membrane drives hydrogen ions through ATP synthase, powering the production of ATP — similar to water flowing through a dam to generate electricity.",
          },
          {
            id: "atp14",
            question: "A patient's ABG shows: pH 7.28, PaCO₂ 24 mmHg, HCO₃⁻ 14 mEq/L. This pattern indicates:",
            options: ["Respiratory acidosis with metabolic compensation", "Metabolic acidosis with respiratory compensation", "Respiratory alkalosis", "Normal ABG values"],
            correctIndex: 1,
            rationale: "Low pH (acidosis) + low HCO₃⁻ (metabolic cause) + low PaCO₂ (respiratory compensation — hyperventilation to blow off CO₂). This pattern is consistent with metabolic acidosis, as seen in lactic acidosis or DKA.",
          },
          {
            id: "atp15",
            question: "Which ketone body is responsible for the fruity breath odor in DKA?",
            options: ["Beta-hydroxybutyrate", "Acetoacetate", "Acetone", "Pyruvate"],
            correctIndex: 2,
            rationale: "Acetone is a volatile ketone body that is exhaled through the lungs, producing the characteristic fruity or nail-polish-remover odor on the breath of patients with DKA.",
          },
          {
            id: "atp16",
            question: "The energy investment phase of glycolysis requires how many ATP molecules?",
            options: ["0", "1", "2", "4"],
            correctIndex: 2,
            rationale: "The energy investment phase of glycolysis consumes 2 ATP to phosphorylate glucose, activating it for subsequent splitting. This is why the net ATP gain from glycolysis is 2 (4 produced minus 2 invested).",
          },
          {
            id: "atp17",
            question: "Carbon dioxide (CO₂) is produced as a waste product during which stage(s) of aerobic respiration?",
            options: ["Glycolysis only", "Electron transport chain only", "Krebs cycle and pyruvate oxidation", "All three stages equally"],
            correctIndex: 2,
            rationale: "CO₂ is produced when pyruvate is converted to acetyl-CoA (1 CO₂ per pyruvate) and during the Krebs cycle (2 CO₂ per turn). Glycolysis does not produce CO₂, and the ETC produces water, not CO₂.",
          },
          {
            id: "atp18",
            question: "Why is potassium replacement critical during DKA treatment with insulin?",
            options: ["Insulin destroys potassium molecules", "Insulin drives potassium into cells, which can cause dangerous hypokalemia", "Potassium is needed to produce ketone bodies", "DKA patients always have excess potassium"],
            correctIndex: 1,
            rationale: "Insulin promotes cellular uptake of potassium along with glucose. In DKA, total body potassium is usually depleted despite potentially normal or high serum levels. When insulin is administered, potassium shifts rapidly into cells, which can cause life-threatening hypokalemia if not replaced.",
          },
          {
            id: "atp19",
            question: "The primary difference between metabolic acidosis and respiratory acidosis is:",
            options: ["Metabolic acidosis has a high pH; respiratory acidosis has a low pH", "In metabolic acidosis, HCO₃⁻ is low; in respiratory acidosis, PaCO₂ is high", "They are identical conditions with different names", "Metabolic acidosis only occurs in diabetic patients"],
            correctIndex: 1,
            rationale: "In metabolic acidosis, the primary problem is low bicarbonate (HCO₃⁻) due to acid accumulation or bicarbonate loss. In respiratory acidosis, the primary problem is elevated PaCO₂ due to hypoventilation. Both cause low pH, but the underlying mechanism differs.",
          },
          {
            id: "atp20",
            question: "If the electron transport chain is inhibited (such as by cyanide poisoning), what immediate effect occurs?",
            options: ["Glycolysis speeds up and compensates fully", "The Krebs cycle and ETC both stop, and cells rely on anaerobic glycolysis only", "ATP production increases due to backup pathways", "Oxygen consumption increases dramatically"],
            correctIndex: 1,
            rationale: "Cyanide blocks Complex IV of the ETC, preventing oxygen from accepting electrons. NADH/FADH₂ cannot be recycled, halting the Krebs cycle. Cells are forced into anaerobic glycolysis, producing only 2 ATP per glucose. This rapid energy failure causes lactic acidosis and can be fatal without treatment.",
            hint: "Think about what happens when electrons cannot be passed to the final acceptor.",
          },
        ]}
      />
    </div>
  );
}
