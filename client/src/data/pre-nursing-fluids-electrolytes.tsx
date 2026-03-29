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
import { Droplets, Beaker, Activity, Waves } from "lucide-react";

export function FluidsElectrolytesModule() {
  const { t } = useI18n();
  const naKGradientContent = useEditableText("fluids-nak-gradient-content", "Na⁺ is concentrated OUTSIDE cells, K⁺ is concentrated INSIDE cells. This gradient is maintained by the Na⁺/K⁺ ATPase pump (3 Na⁺ out, 2 K⁺ in per cycle). This concentration difference is essential for nerve impulse transmission, muscle contraction, and maintaining cell volume. Disrupting this gradient has immediate physiological consequences.");
  const osmoticOncoticContent = useEditableText("fluids-osmotic-oncotic-content", "Osmotic pressure is created by ALL solutes (electrolytes, glucose, urea). Oncotic (colloid osmotic) pressure is the portion of osmotic pressure created specifically by plasma proteins (mainly albumin). Oncotic pressure keeps fluid inside blood vessels. When albumin is low (malnutrition, liver disease, nephrotic syndrome), oncotic pressure drops and fluid leaks into interstitial spaces → edema.");
  const bicarbonateContent = useEditableText("fluids-bicarbonate-content", "CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻. This single equation is the key to understanding acid-base balance. The left side (CO₂) is controlled by the lungs. The right side (HCO₃⁻) is controlled by the kidneys. Normal ratio of HCO₃⁻ to CO₂ is 20:1 — as long as this ratio is maintained, pH stays normal.");

  return (
    <div className="space-y-10" data-testid="module-fluids-electrolytes">
      <div>
        <EditableModuleText sectionKey="fluids-title" defaultText="Fluids & Electrolytes Foundations" as="h2" className="text-2xl font-bold text-gray-900 mb-2" />
        <EditableModuleText sectionKey="fluids-desc" defaultText="Understand body fluid compartments, osmotic principles, electrolyte roles in normal physiology, fluid shifts, and acid-base foundations — all at the conceptual level without disease states." as="p" className="text-gray-600" multiline />
      </div>

      <MicroLesson title="Body Fluid Compartments" subtitle="Where the body's water lives" icon={<Droplets className="w-5 h-5" />}>
        <EditableModuleText sectionKey="fluids-compartments-content" defaultText="Approximately 60% of adult body weight is water, distributed between two main fluid compartments. Intracellular fluid (ICF) is inside cells (~40% body weight, ~2/3 of total body water). Extracellular fluid (ECF) is outside cells (~20% body weight, ~1/3 of total body water). ECF is further divided into intravascular (plasma, ~5%) and interstitial (between cells, ~15%). The distribution matters because each compartment has different electrolyte compositions that must be maintained for normal function." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-3 gap-3 mt-3">
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-1">Intracellular (ICF)</p>
            <p className="text-xs text-blue-600">~2/3 of total body water. Primary cation: K⁺. Primary anion: HPO₄²⁻. Contains most of the body's potassium and phosphate. Cell function depends on this environment being tightly regulated.</p>
          </div>
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <p className="text-xs font-semibold text-emerald-700 mb-1">Interstitial</p>
            <p className="text-xs text-emerald-600">Fluid between cells (~15% body weight). Similar electrolyte composition to plasma but with very little protein. Bathes cells and allows nutrient/waste exchange. Excess accumulation = edema.</p>
          </div>
          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
            <p className="text-xs font-semibold text-purple-700 mb-1">Intravascular (Plasma)</p>
            <p className="text-xs text-purple-600">Fluid within blood vessels (~5% body weight). Primary cation: Na⁺. Contains plasma proteins (albumin) that create oncotic pressure. This is the only compartment directly accessible for IV fluid administration.</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_fluids_electrolytes.theNakGradient")}
          content={naKGradientContent}
        />
      </MicroLesson>

      <MicroLesson title="Osmosis & Tonicity" subtitle="How water moves between compartments" icon={<Waves className="w-5 h-5" />}>
        <EditableModuleText sectionKey="fluids-osmosis-content" defaultText="Water moves by osmosis — the net movement of water across a semipermeable membrane from an area of lower solute concentration to an area of higher solute concentration. Water follows solute. This is a passive process requiring no energy. It always moves toward higher solute concentration. This principle governs fluid distribution between compartments and is the basis for understanding IV fluid therapy." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <ProgressiveReveal
          title={t("data.pre_nursing_fluids_electrolytes.tonicityOfSolutions")}
          cards={[
            {
              id: "fe1",
              title: "Isotonic",
              summary: "Same osmolarity as plasma (~275–295 mOsm/L)",
              detail: "Water does not shift in or out of cells — no change in cell volume. Examples: 0.9% NaCl (Normal Saline), Lactated Ringer's. These solutions expand the intravascular volume without causing osmotic fluid shifts. Used for volume replacement.",
            },
            {
              id: "fe2",
              title: "Hypotonic",
              summary: "Lower osmolarity than plasma",
              detail: "Water moves INTO cells (from lower to higher solute concentration). Cells swell. Example: 0.45% NaCl (Half Normal Saline). Used to provide free water and treat cellular dehydration. Risk: can cause cell lysis if excessive, and cerebral edema.",
            },
            {
              id: "fe3",
              title: "Hypertonic",
              summary: "Higher osmolarity than plasma",
              detail: "Water moves OUT OF cells. Cells shrink (crenation). Example: 3% NaCl (Hypertonic Saline), D10W. Used to draw fluid from swollen cells. Clinical use: reducing cerebral edema. Risk: rapid fluid shifts can cause cardiovascular overload.",
            },
          ]}
        />
        <CognitiveCard
          type="warning"
          title={t("data.pre_nursing_fluids_electrolytes.osmoticVsOncoticPressure")}
          content={osmoticOncoticContent}
        />
      </MicroLesson>

      <MicroLesson title="Electrolyte Roles in Normal Function" subtitle="What each major electrolyte does" icon={<Activity className="w-5 h-5" />}>
        <EditableModuleText sectionKey="fluids-electrolyte-roles-content" defaultText="Each electrolyte has specific physiological roles. Understanding their normal functions helps you appreciate why imbalances cause predictable symptoms." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="space-y-3 mt-3">
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-1">Sodium (Na⁺) — Normal: 135–145 mEq/L</p>
            <p className="text-xs text-blue-600">Primary ECF cation. Regulates water distribution (water follows sodium). Drives nerve impulse conduction. Major determinant of plasma osmolarity. Changes in sodium primarily affect water balance and neurological function.</p>
          </div>
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <p className="text-xs font-semibold text-emerald-700 mb-1">Potassium (K⁺) — Normal: 3.5–5.0 mEq/L</p>
            <p className="text-xs text-emerald-600">Primary ICF cation. Critical for cardiac electrical conduction (resting membrane potential), skeletal muscle contraction, and nerve transmission. Even small changes outside the narrow normal range affect cardiac rhythm. The most dangerous electrolyte to get wrong.</p>
          </div>
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
            <p className="text-xs font-semibold text-amber-700 mb-1">Calcium (Ca²⁺) — Normal: 8.5–10.5 mg/dL</p>
            <p className="text-xs text-amber-600">Muscle contraction (including cardiac), bone structure (99% stored in bone), blood clotting cascade, nerve impulse transmission, enzyme activation. Only the ionized (free) fraction is physiologically active. Albumin level affects total calcium measurement.</p>
          </div>
          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
            <p className="text-xs font-semibold text-purple-700 mb-1">Magnesium (Mg²⁺) — Normal: 1.5–2.5 mEq/L</p>
            <p className="text-xs text-purple-600">Cofactor for over 300 enzyme systems. Involved in energy production (ATP requires Mg²⁺), protein synthesis, neuromuscular function, and cardiac rhythm stability. Works in tandem with calcium and potassium — deficiency of one often accompanies deficiency of others.</p>
          </div>
        </div>
      </MicroLesson>

      <MicroLesson title="Acid-Base Foundations" subtitle="pH regulation at the conceptual level" icon={<Beaker className="w-5 h-5" />}>
        <EditableModuleText sectionKey="fluids-acidbase-content" defaultText="The body maintains blood pH between 7.35 and 7.45. This narrow range is essential for enzyme function, protein structure, and cellular processes. pH below 7.35 = acidosis (excess H⁺). pH above 7.45 = alkalosis (deficit of H⁺). The body uses three systems to maintain this range: buffer systems (immediate), respiratory system (minutes), and renal system (hours to days). Three regulatory systems work together to maintain this balance." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-3 gap-3 mt-3">
          <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-100">
            <p className="text-xs font-semibold text-orange-700 mb-1">Buffer Systems</p>
            <p className="text-xs text-orange-600"><strong>Response: Immediate (seconds).</strong> Chemical buffers (bicarbonate, phosphate, protein) absorb or release H⁺ to resist pH changes. Limited capacity — buffers are consumed and must be regenerated.</p>
          </div>
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-1">Respiratory System</p>
            <p className="text-xs text-blue-600"><strong>Response: Minutes.</strong> Controls CO₂ (which is acidic when dissolved). Hyperventilation blows off CO₂ → raises pH. Hypoventilation retains CO₂ → lowers pH. The lungs are the fast compensator.</p>
          </div>
          <div className="p-4 bg-green-50/60 rounded-xl border border-green-100">
            <p className="text-xs font-semibold text-green-700 mb-1">Renal System</p>
            <p className="text-xs text-green-600"><strong>Response: Hours to days.</strong> Kidneys excrete H⁺ or reabsorb/generate HCO₃⁻ as needed. Most powerful but slowest compensator. Determines long-term acid-base balance.</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_fluids_electrolytes.theBicarbonateEquation")}
          content={bicarbonateContent}
        />
      </MicroLesson>

      <MatchingExercise
        title={t("data.pre_nursing_fluids_electrolytes.matchFluidElectrolyteConcepts")}
        pairs={[
          { term: "Isotonic solution", definition: "Same osmolarity as plasma — no cell volume change" },
          { term: "Hypotonic solution", definition: "Lower osmolarity — water enters cells" },
          { term: "Hypertonic solution", definition: "Higher osmolarity — water leaves cells" },
          { term: "Oncotic pressure", definition: "Osmotic pull created by plasma proteins" },
          { term: "Na⁺/K⁺ ATPase", definition: "Pump maintaining ion gradient across cell membranes" },
          { term: "Bicarbonate", definition: "Primary pH buffer in blood" },
        ]}
      />

      <SelfCheckQuiz
        title={t("data.pre_nursing_fluids_electrolytes.fluidsElectrolytesQuiz")}
        questions={[
          {
            id: "fe1",
            question: "Which fluid compartment contains the most body water?",
            options: ["Intravascular", "Interstitial", "Intracellular", "Transcellular"],
            correctIndex: 2,
            rationale: "Intracellular fluid (ICF) contains approximately 2/3 of total body water (~40% of body weight). It is by far the largest fluid compartment.",
          },
          {
            id: "fe2",
            question: "A patient receives 0.45% NaCl (Half Normal Saline). This solution is:",
            options: ["Isotonic", "Hypertonic", "Hypotonic", "Colloidal"],
            correctIndex: 2,
            rationale: "0.45% NaCl has a lower osmolarity than plasma (isotonic = 0.9% NaCl). Water will move from this solution into cells. It provides free water for cellular hydration.",
          },
          {
            id: "fe3",
            question: "Why is potassium considered the most dangerous electrolyte to administer?",
            options: ["It causes allergic reactions", "Even small deviations from normal range affect cardiac rhythm", "It damages blood vessels", "It causes renal failure"],
            correctIndex: 1,
            rationale: "The normal range for K⁺ is very narrow (3.5–5.0 mEq/L). Both hypokalemia and hyperkalemia directly affect cardiac electrical conduction and can cause life-threatening dysrhythmias.",
          },
          {
            id: "fe4",
            question: "Water moves by osmosis in which direction?",
            options: ["From high solute to low solute concentration", "From low solute to high solute concentration", "From high pressure to low pressure", "Randomly in all directions"],
            correctIndex: 1,
            rationale: "Osmosis moves water from an area of LOWER solute concentration (more water) to HIGHER solute concentration (less water). Water follows solute.",
          },
          {
            id: "fe5",
            question: "Which system provides the FASTEST compensation for pH changes?",
            options: ["Renal system", "Buffer systems", "Respiratory system", "Endocrine system"],
            correctIndex: 1,
            rationale: "Chemical buffer systems respond immediately (within seconds) by absorbing or releasing H⁺ ions. Respiratory compensation takes minutes. Renal compensation takes hours to days.",
          },
          {
            id: "fe6",
            question: "The primary cation in extracellular fluid is:",
            options: ["K⁺", "Ca²⁺", "Mg²⁺", "Na⁺"],
            correctIndex: 3,
            rationale: "Sodium (Na⁺) is the primary cation in extracellular fluid. It is the major determinant of ECF osmolarity and drives water distribution between compartments.",
          },
          {
            id: "fe7",
            question: "Low albumin levels cause edema because:",
            options: ["Albumin is toxic to blood vessels", "Reduced oncotic pressure allows fluid to leak into interstitial spaces", "Albumin prevents red blood cell production", "Low albumin increases blood pressure"],
            correctIndex: 1,
            rationale: "Albumin is the primary plasma protein creating oncotic pressure, which holds fluid inside blood vessels. When albumin is low, oncotic pressure drops and fluid shifts from intravascular to interstitial space → edema.",
          },
          {
            id: "fe8",
            question: "In the bicarbonate buffer system, the lungs regulate:",
            options: ["HCO₃⁻ (bicarbonate)", "Na⁺ (sodium)", "CO₂ (carbon dioxide)", "K⁺ (potassium)"],
            correctIndex: 2,
            rationale: "The lungs regulate CO₂ through ventilation. CO₂ is the acid component of the bicarbonate buffer system. The kidneys regulate the HCO₃⁻ (base) component.",
          },
          {
            id: "fe9",
            question: "What percentage of adult body weight is approximately water?",
            options: ["40%", "50%", "60%", "75%"],
            correctIndex: 2,
            rationale: "Approximately 60% of adult body weight is water. This proportion varies with age, sex, and body fat percentage. Infants have a higher percentage (~70–80%), while older adults have less.",
          },
          {
            id: "fe10",
            question: "The Na⁺/K⁺ ATPase pump moves ions in which pattern per cycle?",
            options: ["2 Na⁺ out, 3 K⁺ in", "3 Na⁺ out, 2 K⁺ in", "3 Na⁺ in, 2 K⁺ out", "Equal amounts of each"],
            correctIndex: 1,
            rationale: "The Na⁺/K⁺ ATPase pump moves 3 Na⁺ out of the cell and 2 K⁺ into the cell per cycle. This active transport maintains the concentration gradients essential for nerve impulse transmission and muscle contraction.",
          },
          {
            id: "fe11",
            question: "A patient with hypoalbuminemia is most at risk for developing:",
            options: ["Hyperkalemia", "Dehydration", "Peripheral edema", "Metabolic alkalosis"],
            correctIndex: 2,
            rationale: "Low albumin reduces oncotic pressure in the blood vessels. Without adequate oncotic pressure to hold fluid intravascularly, fluid leaks into the interstitial spaces causing peripheral edema.",
          },
          {
            id: "fe12",
            question: "Normal blood pH range is:",
            options: ["7.25–7.35", "7.35–7.45", "7.45–7.55", "7.30–7.50"],
            correctIndex: 1,
            rationale: "Normal arterial blood pH is maintained between 7.35 and 7.45. Values below 7.35 indicate acidosis; values above 7.45 indicate alkalosis. This narrow range is critical for enzyme function and cellular processes.",
          },
          {
            id: "fe13",
            question: "Which IV solution would cause water to move OUT of cells?",
            options: ["0.45% NaCl", "0.9% NaCl", "3% NaCl", "D5W after dextrose is metabolized"],
            correctIndex: 2,
            rationale: "3% NaCl is a hypertonic solution with higher osmolarity than plasma. Water moves out of cells toward the higher solute concentration in the intravascular space, causing cells to shrink (crenation).",
          },
          {
            id: "fe14",
            question: "The primary intracellular cation is:",
            options: ["Na⁺", "Ca²⁺", "K⁺", "Mg²⁺"],
            correctIndex: 2,
            rationale: "Potassium (K⁺) is the primary intracellular cation with a normal serum range of 3.5–5.0 mEq/L. Most of the body's potassium is found inside cells, maintained by the Na⁺/K⁺ ATPase pump.",
          },
          {
            id: "fe15",
            question: "Which electrolyte is a cofactor for over 300 enzyme systems?",
            options: ["Sodium", "Potassium", "Calcium", "Magnesium"],
            correctIndex: 3,
            rationale: "Magnesium (Mg²⁺) is a cofactor for over 300 enzyme systems including those involved in energy production (ATP requires Mg²⁺), protein synthesis, and neuromuscular function.",
          },
          {
            id: "fe16",
            question: "The renal system compensates for acid-base imbalances over what time frame?",
            options: ["Seconds", "Minutes", "Hours to days", "Weeks"],
            correctIndex: 2,
            rationale: "The renal system is the slowest but most powerful compensator, taking hours to days to adjust pH by excreting H⁺ or reabsorbing/generating HCO₃⁻. Buffer systems respond in seconds and lungs in minutes.",
          },
          {
            id: "fe17",
            question: "Interstitial fluid differs from plasma primarily because it contains:",
            options: ["More sodium", "Very little protein", "More potassium", "Higher glucose levels"],
            correctIndex: 1,
            rationale: "Interstitial fluid has a similar electrolyte composition to plasma but contains very little protein. Plasma proteins (especially albumin) are too large to easily cross capillary membranes, so they remain in the intravascular space.",
          },
          {
            id: "fe18",
            question: "Which calcium fraction is physiologically active?",
            options: ["Albumin-bound calcium", "Total calcium", "Ionized (free) calcium", "Calcium phosphate"],
            correctIndex: 2,
            rationale: "Only the ionized (free) fraction of calcium is physiologically active. About 40% of total serum calcium is bound to albumin and is inactive. This is why albumin levels must be considered when interpreting calcium levels.",
          },
          {
            id: "fe19",
            question: "Hyperventilation affects pH by:",
            options: ["Retaining CO₂ and lowering pH", "Blowing off CO₂ and raising pH", "Increasing HCO₃⁻ reabsorption", "Releasing H⁺ from buffers"],
            correctIndex: 1,
            rationale: "Hyperventilation increases the elimination of CO₂ (an acid) from the body. Removing CO₂ shifts the bicarbonate equation to the left, reducing H⁺ concentration and raising blood pH (respiratory alkalosis).",
          },
          {
            id: "fe20",
            question: "The normal ratio of HCO₃⁻ to CO₂ that maintains normal pH is:",
            options: ["10:1", "15:1", "20:1", "30:1"],
            correctIndex: 2,
            rationale: "The normal ratio of bicarbonate (HCO₃⁻) to dissolved CO₂ is 20:1. As long as this ratio is maintained, blood pH remains in the normal range of 7.35–7.45, regardless of the absolute values.",
          },
        ]}
      />
    </div>
  );
}
