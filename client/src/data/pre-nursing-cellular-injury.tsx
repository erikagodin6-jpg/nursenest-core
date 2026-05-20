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
import { AlertTriangle, Shield, Skull, RefreshCw, Activity } from "lucide-react";

export function CellularInjuryModule() {
  const { t } = useI18n();
  const freeRadicalContent = useEditableText("ci-free-radical-content", "Free radicals are highly reactive molecules with unpaired electrons that damage cellular components — lipids (cell membrane destruction via lipid peroxidation), proteins (enzyme dysfunction), and DNA (mutations, impaired replication). The body uses antioxidant enzymes (superoxide dismutase, catalase, glutathione peroxidase) and dietary antioxidants (vitamins C, E, selenium) to neutralize free radicals. When production exceeds neutralization capacity, oxidative stress occurs, contributing to aging, cancer, atherosclerosis, and neurodegenerative diseases.");
  const compensationContent = useEditableText("ci-compensation-content", "Compensation is the body's ability to maintain homeostasis despite injury or disease through adaptive mechanisms. For example, the heart compensates for increased workload through hypertrophy, or the kidneys compensate for metabolic acidosis by excreting more hydrogen ions. Decompensation occurs when adaptive mechanisms are overwhelmed and can no longer maintain normal function — this is when clinical symptoms appear and organ failure begins. Recognizing the transition from compensation to decompensation is a critical nursing skill.");
  const reversibleContent = useEditableText("ci-reversible-content", "Reversible injury is characterized by cellular swelling (due to failure of sodium-potassium pump), fatty change (lipid accumulation), and decreased ATP production. The cell can recover if the injurious stimulus is removed. Irreversible injury occurs when membrane damage is severe, mitochondrial function is permanently lost, and calcium floods the cell activating destructive enzymes. Key markers of irreversible injury include: massive calcium influx, lysosomal enzyme release, nuclear changes (pyknosis, karyorrhexis, karyolysis), and release of intracellular enzymes into the blood (troponin, CK, LDH, AST/ALT).");

  return (
    <div className="space-y-10" data-testid="module-cellular-injury">
      <div>
        <EditableModuleText sectionKey="ci-title" defaultText="Cellular Injury & Adaptation" as="h2" className="text-2xl font-bold text-gray-900 mb-2" />
        <EditableModuleText sectionKey="ci-desc" defaultText="Understand the mechanisms of cellular injury, the distinction between apoptosis and necrosis, cellular adaptive responses, oxidative stress, and the critical difference between reversible and irreversible injury." as="p" className="text-gray-600" multiline />
      </div>

      <MicroLesson title="Causes of Cellular Injury" subtitle="Why cells become damaged" icon={<AlertTriangle className="w-5 h-5" />}>
        <EditableModuleText sectionKey="ci-causes-content" defaultText="Cellular injury occurs when stressors exceed the cell's ability to adapt. Understanding the major categories of cellular injury is essential for recognizing pathological processes and anticipating clinical consequences." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-100">
            <p className="text-xs font-semibold text-red-700 mb-1">Hypoxia (Most Common Cause)</p>
            <p className="text-xs text-red-600">Reduced oxygen delivery to cells is the single most common cause of cellular injury. Causes include ischemia (reduced blood flow from thrombus/embolus), hypoxemia (low blood oxygen from respiratory failure), anemia (reduced oxygen-carrying capacity), and carbon monoxide poisoning (CO binds hemoglobin 200x more avidly than O2). Without oxygen, mitochondria cannot produce ATP, and cellular functions fail.</p>
          </div>
          <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-100">
            <p className="text-xs font-semibold text-orange-700 mb-1">Toxins & Chemical Agents</p>
            <p className="text-xs text-orange-600">Includes drugs (acetaminophen hepatotoxicity, chemotherapy), environmental toxins (lead, mercury, carbon tetrachloride), alcohol (direct hepatocyte damage), and endogenous toxins (urea in renal failure, bilirubin in liver failure). Toxins injure cells by directly damaging membranes, inhibiting enzymes, generating free radicals, or interfering with DNA replication.</p>
          </div>
          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
            <p className="text-xs font-semibold text-purple-700 mb-1">Infectious Agents</p>
            <p className="text-xs text-purple-600">Bacteria damage cells through direct invasion, exotoxin release, or triggering inflammatory responses. Viruses hijack cellular machinery for replication, killing the host cell or transforming it (oncogenic viruses). Fungi, parasites, and prions each have unique mechanisms of cellular damage. The immune response to infection can itself cause significant collateral tissue injury.</p>
          </div>
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-1">Immune-Mediated Injury</p>
            <p className="text-xs text-blue-600">The immune system can attack the body's own cells in autoimmune diseases (lupus, rheumatoid arthritis, type 1 diabetes). Hypersensitivity reactions (allergic responses, anaphylaxis) cause tissue damage through excessive immune activation. Transplant rejection occurs when the immune system recognizes donor tissue as foreign. Even normal immune responses cause some collateral damage to surrounding healthy tissue.</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-yellow-50/60 rounded-xl border border-yellow-100">
            <p className="text-xs font-semibold text-yellow-700 mb-1">Physical Agents</p>
            <p className="text-xs text-yellow-600">Mechanical trauma (fractures, lacerations), temperature extremes (burns, frostbite), radiation (UV damage, ionizing radiation causing DNA breaks), electrical injury (thermal and electrolyte disruption), and pressure changes (barotrauma, decompression sickness).</p>
          </div>
          <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100">
            <p className="text-xs font-semibold text-teal-700 mb-1">Nutritional Imbalances</p>
            <p className="text-xs text-teal-600">Deficiencies (protein-calorie malnutrition, vitamin deficiencies like scurvy from vitamin C deficiency) and excesses (obesity leading to fatty liver, iron overload in hemochromatosis, vitamin A toxicity) both cause cellular injury through distinct mechanisms.</p>
          </div>
        </div>
      </MicroLesson>

      <MicroLesson title="Free Radicals & Oxidative Stress" subtitle="Reactive oxygen species and cellular damage" icon={<Activity className="w-5 h-5" />}>
        <EditableModuleText sectionKey="ci-oxidative-content" defaultText="Oxidative stress is a critical mechanism of cellular injury that underlies many disease processes. Understanding free radical biology helps explain why antioxidants matter and how reperfusion injury occurs after restoring blood flow to ischemic tissue." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="space-y-3 mt-3">
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-100">
            <p className="text-xs font-semibold text-red-700 mb-2">Sources of Free Radicals</p>
            <p className="text-xs text-red-600"><strong>Normal metabolism:</strong> Mitochondrial electron transport chain naturally produces small amounts of superoxide. <strong>Inflammation:</strong> Neutrophils and macrophages generate reactive oxygen species (ROS) as part of the respiratory burst to kill pathogens. <strong>Radiation:</strong> Ionizing radiation splits water molecules into hydroxyl radicals. <strong>Chemicals:</strong> Carbon tetrachloride, acetaminophen metabolism, and cigarette smoke generate free radicals. <strong>Reperfusion injury:</strong> Restoring blood flow to ischemic tissue paradoxically generates a burst of free radicals.</p>
          </div>
          <div className="p-4 bg-green-50/60 rounded-xl border border-green-100">
            <p className="text-xs font-semibold text-green-700 mb-2">Antioxidant Defense Systems</p>
            <p className="text-xs text-green-600"><strong>Enzymatic:</strong> Superoxide dismutase (converts superoxide to H2O2), catalase (converts H2O2 to water), glutathione peroxidase (neutralizes peroxides using selenium). <strong>Non-enzymatic:</strong> Vitamin E (lipid-soluble, protects membranes), Vitamin C (water-soluble, regenerates vitamin E), glutathione (intracellular free radical scavenger), beta-carotene. When free radical production exceeds antioxidant capacity, oxidative stress and cellular damage result.</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_cellular_injury.freeRadicalsOxidativeStress")}
          content={freeRadicalContent}
        />
      </MicroLesson>

      <MicroLesson title="Apoptosis vs Necrosis" subtitle="Programmed death vs uncontrolled death" icon={<Skull className="w-5 h-5" />}>
        <EditableModuleText sectionKey="ci-death-content" defaultText="Cell death occurs through two fundamentally different mechanisms: apoptosis (programmed, controlled, energy-requiring) and necrosis (uncontrolled, passive, inflammatory). Understanding the distinction is crucial because they have different causes, mechanisms, and clinical consequences." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-1">Apoptosis (Programmed Cell Death)</p>
            <p className="text-xs text-blue-600"><strong>Mechanism:</strong> Organized, energy-dependent process involving caspase enzymes. Cell shrinks, chromatin condenses, DNA fragments in orderly fashion, cell breaks into apoptotic bodies that are phagocytosed. <strong>Key feature:</strong> No inflammation — contents are contained and cleaned up. <strong>Normal functions:</strong> Embryonic development (removing webbing between fingers), immune system regulation (eliminating self-reactive lymphocytes), tissue homeostasis (replacing old intestinal epithelium every 3-5 days). <strong>Pathological:</strong> Viral infections (HIV killing CD4 cells), radiation damage, neurodegenerative diseases.</p>
          </div>
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-100">
            <p className="text-xs font-semibold text-red-700 mb-1">Necrosis (Uncontrolled Cell Death)</p>
            <p className="text-xs text-red-600"><strong>Mechanism:</strong> Cell swells, membrane ruptures, contents spill into surrounding tissue. <strong>Key feature:</strong> Always causes inflammation — released contents activate immune response. <strong>Types:</strong> Coagulative (most organs, preserves tissue architecture — seen in MI), liquefactive (brain, abscesses — tissue becomes liquid), caseous (tuberculosis — cheese-like appearance), fat necrosis (pancreas — lipase digests fat), fibrinoid (blood vessel walls in autoimmune disease), gangrenous (limbs — dry or wet gangrene). <strong>Clinical markers:</strong> Elevated enzymes in blood (troponin, CK, LDH).</p>
          </div>
        </div>
        <ProgressiveReveal
          title={t("data.pre_nursing_cellular_injury.typesOfNecrosis")}
          cards={[
            {
              id: "ci-nec1",
              title: "Coagulative Necrosis",
              summary: "Most common type — preserves tissue architecture",
              detail: "Occurs in most solid organs (heart, kidney, liver) after ischemia. Protein denaturation preserves the 'ghost outline' of cells for days. Classic example: myocardial infarction — dead cardiac tissue maintains its structure initially. Eventually replaced by scar tissue through fibrosis.",
            },
            {
              id: "ci-nec2",
              title: "Liquefactive Necrosis",
              summary: "Tissue becomes liquid — brain and abscesses",
              detail: "Occurs when enzymatic digestion dominates, turning tissue into liquid. Brain infarcts undergo liquefactive necrosis because the brain has high lipid content and abundant hydrolytic enzymes. Bacterial infections produce abscesses — localized collections of liquefied necrotic tissue and neutrophils (pus).",
            },
            {
              id: "ci-nec3",
              title: "Caseous Necrosis",
              summary: "Cheese-like appearance — hallmark of tuberculosis",
              detail: "A distinctive form where necrotic tissue has a white, cheese-like (caseous) appearance. The hallmark of granulomatous inflammation, most classically seen in tuberculosis. Granulomas form when macrophages surround and wall off the organism they cannot destroy, with caseous necrosis at the center.",
            },
            {
              id: "ci-nec4",
              title: "Fat Necrosis",
              summary: "Lipase digests adipose tissue — acute pancreatitis",
              detail: "Occurs when lipase enzymes are released and digest surrounding adipose tissue. Most commonly seen in acute pancreatitis, where pancreatic lipase leaks from damaged pancreatic acinar cells. Also occurs in breast tissue after trauma. Produces chalky white areas (calcium soap formation — saponification).",
            },
          ]}
        />
      </MicroLesson>

      <MicroLesson title="Cellular Adaptations" subtitle="How cells respond to stress" icon={<RefreshCw className="w-5 h-5" />}>
        <EditableModuleText sectionKey="ci-adaptations-content" defaultText="When cells face persistent sublethal stress, they adapt to survive. These adaptations are reversible if the stimulus is removed but can progress to injury if the stress continues or exceeds the cell's adaptive capacity. Understanding adaptations helps nurses recognize pathological changes and anticipate disease progression." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="space-y-3 mt-3">
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100">
            <p className="text-xs font-semibold text-indigo-700 mb-2">Hypertrophy — Increase in Cell SIZE</p>
            <p className="text-xs text-indigo-600">Individual cells grow larger (not more numerous). Occurs in cells that cannot divide (cardiac myocytes, skeletal muscle). <strong>Physiologic example:</strong> Uterine smooth muscle growth during pregnancy (hormonal), skeletal muscle enlargement from weightlifting (increased workload). <strong>Pathologic example:</strong> Left ventricular hypertrophy from chronic hypertension — the heart muscle thickens to pump against increased resistance. Initially compensatory, but eventually leads to heart failure when oxygen demand exceeds supply.</p>
          </div>
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <p className="text-xs font-semibold text-emerald-700 mb-2">Hyperplasia — Increase in Cell NUMBER</p>
            <p className="text-xs text-emerald-600">More cells are produced through increased cell division. Only occurs in cells capable of division. <strong>Physiologic example:</strong> Endometrial proliferation during menstrual cycle (hormonal), liver regeneration after partial hepatectomy (compensatory). <strong>Pathologic example:</strong> Benign prostatic hyperplasia (BPH) — prostate gland enlarges from increased cell number due to hormonal stimulation. Endometrial hyperplasia from excess estrogen (risk factor for endometrial cancer).</p>
          </div>
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
            <p className="text-xs font-semibold text-amber-700 mb-2">Atrophy — Decrease in Cell Size</p>
            <p className="text-xs text-amber-600">Cells shrink due to reduced use, nutrition, blood supply, hormonal stimulation, or innervation. <strong>Physiologic example:</strong> Thymus involution after puberty, uterine shrinkage after delivery. <strong>Pathologic example:</strong> Muscle atrophy from immobilization or denervation (cast, spinal cord injury), brain atrophy in Alzheimer's disease, adrenal atrophy from chronic corticosteroid therapy (exogenous steroids suppress ACTH).</p>
          </div>
          <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-100">
            <p className="text-xs font-semibold text-rose-700 mb-2">Metaplasia — Change in Cell TYPE</p>
            <p className="text-xs text-rose-600">One mature cell type is replaced by another mature cell type better suited to withstand the stress. <strong>Reversible if stimulus removed.</strong> Classic example: Respiratory epithelium (ciliated columnar) changes to squamous epithelium in chronic smokers — squamous cells are more resistant to smoke irritation but lose the ability to secrete mucus and move particles (lost ciliary function). Barrett's esophagus: squamous epithelium replaced by columnar epithelium from chronic GERD — a precancerous condition.</p>
          </div>
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-100">
            <p className="text-xs font-semibold text-red-700 mb-2">Dysplasia — Disordered Cell Growth</p>
            <p className="text-xs text-red-600">Abnormal changes in cell size, shape, and organization. Cells look atypical under the microscope. <strong>Considered pre-cancerous</strong> — not cancer itself, but may progress to cancer if the stimulus persists. Classic example: Cervical dysplasia detected on Pap smear (from HPV infection) — classified as mild, moderate, or severe (CIN I, II, III). May regress if HPV is cleared, or progress to cervical carcinoma in situ and invasive cancer.</p>
          </div>
        </div>
      </MicroLesson>

      <MicroLesson title="Reversible vs Irreversible Injury" subtitle="The point of no return" icon={<Shield className="w-5 h-5" />}>
        <EditableModuleText sectionKey="ci-reversible-intro" defaultText="The distinction between reversible and irreversible cellular injury is clinically critical — it determines whether tissue can recover or will die. Understanding injury markers helps nurses interpret lab values and anticipate patient outcomes." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-yellow-50/60 rounded-xl border border-yellow-100">
            <p className="text-xs font-semibold text-yellow-700 mb-1">Reversible Injury (Cell Can Recover)</p>
            <p className="text-xs text-yellow-600"><strong>Cellular swelling:</strong> Na+/K+ ATPase pump fails → sodium and water enter cell. <strong>Fatty change:</strong> Lipid accumulation in hepatocytes (commonly from alcohol). <strong>Decreased ATP:</strong> Reduced oxidative phosphorylation but still functional. <strong>ER swelling:</strong> Ribosomes detach, protein synthesis decreases. <strong>Key point:</strong> Membrane integrity is maintained — cell contents stay inside. If the injurious stimulus is removed, the cell returns to normal.</p>
          </div>
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-100">
            <p className="text-xs font-semibold text-red-700 mb-1">Irreversible Injury (Cell Will Die)</p>
            <p className="text-xs text-red-600"><strong>Membrane damage:</strong> Plasma membrane and organelle membranes lose integrity. <strong>Calcium influx:</strong> Massive Ca2+ entry activates destructive enzymes (phospholipases, proteases, endonucleases). <strong>Mitochondrial failure:</strong> Permanent loss of oxidative phosphorylation. <strong>Nuclear changes:</strong> Pyknosis (nucleus shrinks), karyorrhexis (nucleus fragments), karyolysis (nucleus dissolves). <strong>Enzyme release:</strong> Intracellular enzymes leak into blood (troponin, CK-MB, LDH, AST/ALT) — this is why we measure these lab values.</p>
          </div>
        </div>
        <CognitiveCard
          type="warning"
          title={t("data.pre_nursing_cellular_injury.reversibleVsIrreversibleInjuryMarkers")}
          content={reversibleContent}
        />
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_cellular_injury.compensationVsDecompensation")}
          content={compensationContent}
        />
      </MicroLesson>

      <MatchingExercise
        title={t("data.pre_nursing_cellular_injury.matchTheCellularAdaptation")}
        pairs={[
          { id: "hypertrophy", term: "Hypertrophy", definition: "Increase in cell size (e.g., cardiac muscle in hypertension)" },
          { id: "hyperplasia", term: "Hyperplasia", definition: "Increase in cell number (e.g., BPH, endometrial growth)" },
          { id: "atrophy", term: "Atrophy", definition: "Decrease in cell size (e.g., muscle wasting from disuse)" },
          { id: "metaplasia", term: "Metaplasia", definition: "Change from one cell type to another (e.g., Barrett's esophagus)" },
          { id: "dysplasia", term: "Dysplasia", definition: "Disordered, pre-cancerous cell growth (e.g., cervical CIN)" },
          { id: "apoptosis", term: "Apoptosis", definition: "Programmed cell death without inflammation" },
        ]}
      />

      <SelfCheckQuiz
        title={t("data.pre_nursing_cellular_injury.cellularInjuryAdaptationQuiz")}
        questions={[
          {
            id: "ci1",
            question: "What is the MOST common cause of cellular injury?",
            options: ["Toxin exposure", "Hypoxia", "Immune-mediated damage", "Nutritional deficiency"],
            correctIndex: 1,
            rationale: "Hypoxia (reduced oxygen delivery to cells) is the most common cause of cellular injury. Without oxygen, mitochondria cannot produce ATP, leading to failure of energy-dependent cellular processes.",
          },
          {
            id: "ci2",
            question: "A patient with chronic hypertension develops left ventricular thickening. This is an example of:",
            options: ["Hyperplasia", "Hypertrophy", "Metaplasia", "Dysplasia"],
            correctIndex: 1,
            rationale: "Left ventricular hypertrophy is an increase in cell SIZE (not number) because cardiac myocytes cannot divide. The heart muscle cells grow larger to pump against increased resistance from hypertension.",
          },
          {
            id: "ci3",
            question: "Which type of cell death does NOT cause inflammation?",
            options: ["Coagulative necrosis", "Liquefactive necrosis", "Apoptosis", "Caseous necrosis"],
            correctIndex: 2,
            rationale: "Apoptosis is programmed cell death where cell contents are contained within apoptotic bodies and phagocytosed — no contents leak out, so no inflammatory response is triggered. All forms of necrosis cause inflammation because cell contents spill into surrounding tissue.",
          },
          {
            id: "ci4",
            question: "A chronic smoker's respiratory epithelium changes from ciliated columnar to squamous type. This adaptation is called:",
            options: ["Dysplasia", "Hyperplasia", "Metaplasia", "Atrophy"],
            correctIndex: 2,
            rationale: "Metaplasia is the replacement of one mature cell type with another. In smokers, the respiratory epithelium changes from ciliated columnar to squamous to better withstand the irritation of smoke, but this adaptation sacrifices protective ciliary function.",
          },
          {
            id: "ci5",
            question: "Which cellular adaptation is considered pre-cancerous?",
            options: ["Hypertrophy", "Hyperplasia", "Metaplasia", "Dysplasia"],
            correctIndex: 3,
            rationale: "Dysplasia involves disordered cell growth with atypical changes in cell size, shape, and organization. It is considered pre-cancerous and may progress to carcinoma if the stimulus persists (e.g., cervical dysplasia from HPV).",
          },
          {
            id: "ci6",
            question: "What is the key marker distinguishing irreversible from reversible cellular injury?",
            options: ["Cellular swelling", "Fatty change", "Membrane integrity loss", "Decreased ATP production"],
            correctIndex: 2,
            rationale: "Loss of membrane integrity is the critical point of no return. When the plasma membrane is breached, calcium floods in, destructive enzymes are activated, and intracellular contents leak out — the cell cannot recover.",
          },
          {
            id: "ci7",
            question: "Free radicals cause cellular damage primarily by:",
            options: ["Increasing ATP production", "Damaging lipids, proteins, and DNA through oxidation", "Activating the immune system", "Promoting cellular division"],
            correctIndex: 1,
            rationale: "Free radicals have unpaired electrons that damage cellular components through oxidation: lipid peroxidation (membrane damage), protein oxidation (enzyme dysfunction), and DNA damage (mutations). This is called oxidative stress.",
          },
          {
            id: "ci8",
            question: "Reperfusion injury occurs because:",
            options: ["Blood flow cannot be restored after ischemia", "Restoring blood flow to ischemic tissue generates a burst of free radicals", "The tissue is already dead and cannot recover", "White blood cells are depleted during ischemia"],
            correctIndex: 1,
            rationale: "Paradoxically, restoring blood flow (reperfusion) to ischemic tissue generates a burst of reactive oxygen species (free radicals), which cause additional damage beyond the original ischemic injury. This is clinically significant in MI treatment and organ transplantation.",
          },
          {
            id: "ci9",
            question: "A patient in a cast for 6 weeks develops noticeable muscle wasting in the immobilized limb. This is an example of:",
            options: ["Necrosis", "Atrophy", "Metaplasia", "Apoptosis"],
            correctIndex: 1,
            rationale: "Disuse atrophy occurs when muscles are not used — cells shrink in size due to decreased workload and reduced protein synthesis. This is reversible with rehabilitation and physical therapy after the cast is removed.",
          },
          {
            id: "ci10",
            question: "Which type of necrosis is characteristic of tuberculosis?",
            options: ["Coagulative", "Liquefactive", "Caseous", "Fat necrosis"],
            correctIndex: 2,
            rationale: "Caseous necrosis has a distinctive white, cheese-like (caseous) appearance and is the hallmark of granulomatous inflammation, most classically seen in tuberculosis. Granulomas form when macrophages wall off organisms they cannot destroy.",
          },
          {
            id: "ci11",
            question: "Elevated troponin levels in the blood indicate:",
            options: ["Reversible myocardial injury", "Normal cardiac function", "Irreversible cardiac cell death with membrane rupture", "Pulmonary infection"],
            correctIndex: 2,
            rationale: "Troponin is an intracellular protein found in cardiac myocytes. Its presence in the blood indicates that cardiac cell membranes have ruptured (irreversible injury), releasing intracellular contents — this is why troponin is the gold standard marker for myocardial infarction.",
          },
          {
            id: "ci12",
            question: "Which antioxidant enzyme converts superoxide to hydrogen peroxide?",
            options: ["Catalase", "Glutathione peroxidase", "Superoxide dismutase", "Vitamin E"],
            correctIndex: 2,
            rationale: "Superoxide dismutase (SOD) converts the highly reactive superoxide radical to the less reactive hydrogen peroxide (H2O2). Catalase and glutathione peroxidase then convert H2O2 to water, completing the detoxification pathway.",
          },
          {
            id: "ci13",
            question: "Barrett's esophagus is an example of metaplasia caused by:",
            options: ["Smoking", "Chronic GERD (acid reflux)", "Alcohol abuse", "HPV infection"],
            correctIndex: 1,
            rationale: "Barrett's esophagus occurs when chronic gastroesophageal reflux disease (GERD) causes the normal squamous epithelium of the lower esophagus to be replaced by columnar epithelium (intestinal-type). This is a precancerous condition that increases risk of esophageal adenocarcinoma.",
          },
          {
            id: "ci14",
            question: "During reversible cellular injury, the sodium-potassium pump fails, causing:",
            options: ["Cell shrinkage", "Cellular swelling from sodium and water influx", "Immediate membrane rupture", "DNA fragmentation"],
            correctIndex: 1,
            rationale: "When ATP is depleted, the Na+/K+ ATPase pump fails. Sodium accumulates inside the cell, drawing water in by osmosis, causing the cell to swell. This is an early, reversible sign of injury — if ATP is restored, the pump resumes and the cell recovers.",
          },
          {
            id: "ci15",
            question: "Liquefactive necrosis is most commonly seen in the:",
            options: ["Heart", "Kidney", "Brain", "Liver"],
            correctIndex: 2,
            rationale: "The brain undergoes liquefactive necrosis after infarction because it has high lipid content and abundant hydrolytic enzymes. Rather than maintaining tissue architecture (coagulative necrosis), brain tissue literally liquefies, forming a cystic cavity.",
          },
          {
            id: "ci16",
            question: "A nursing student asks why carbon monoxide poisoning is so dangerous. The best explanation is:",
            options: ["CO destroys red blood cells", "CO binds hemoglobin 200 times more strongly than oxygen, preventing oxygen transport", "CO causes direct liver damage", "CO increases metabolic rate"],
            correctIndex: 1,
            rationale: "Carbon monoxide (CO) has approximately 200 times greater affinity for hemoglobin than oxygen. It displaces oxygen from hemoglobin, forming carboxyhemoglobin, which cannot carry oxygen. This causes severe cellular hypoxia even when PaO2 may appear normal.",
          },
          {
            id: "ci17",
            question: "Apoptosis differs from necrosis in that apoptosis:",
            options: ["Always involves infection", "Is energy-dependent and does not cause inflammation", "Only occurs in the liver", "Causes more tissue damage than necrosis"],
            correctIndex: 1,
            rationale: "Apoptosis is an active, energy-requiring process (requires ATP and caspase enzyme activation). Cell contents are neatly packaged into apoptotic bodies and phagocytosed without spillage, so no inflammatory response occurs — unlike necrosis, which always triggers inflammation.",
          },
          {
            id: "ci18",
            question: "The nuclear change where the nucleus shrinks and becomes a dense, dark mass is called:",
            options: ["Karyolysis", "Karyorrhexis", "Pyknosis", "Apoptosis"],
            correctIndex: 2,
            rationale: "Pyknosis is nuclear shrinkage with condensation of chromatin into a dense, basophilic mass. It is one of three nuclear changes in necrosis: pyknosis (shrinkage) → karyorrhexis (fragmentation) → karyolysis (dissolution/disappearance).",
          },
          {
            id: "ci19",
            question: "Physiologic hyperplasia of the endometrium occurs due to:",
            options: ["Chronic infection", "Estrogen stimulation during the menstrual cycle", "Mechanical trauma", "Vitamin deficiency"],
            correctIndex: 1,
            rationale: "During the proliferative phase of the menstrual cycle, estrogen stimulates endometrial cells to divide (hyperplasia), thickening the uterine lining in preparation for potential implantation. This is a normal, hormone-driven physiologic response.",
          },
          {
            id: "ci20",
            question: "Decompensation in organ function refers to:",
            options: ["The body's successful adaptation to increased demand", "The point where adaptive mechanisms are overwhelmed and symptoms appear", "Normal aging processes", "Reduced drug metabolism"],
            correctIndex: 1,
            rationale: "Decompensation occurs when the body's compensatory mechanisms can no longer maintain normal function despite injury or disease. This is the transition point where clinical symptoms manifest and organ failure begins — a critical concept for nursing assessment and early intervention.",
            hint: "Think about what happens when the body can no longer 'keep up' with the demands placed on it.",
          },
        ]}
      />
    </div>
  );
}