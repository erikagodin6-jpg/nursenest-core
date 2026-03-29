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
import { Wind, Heart, Activity, Gauge, Brain } from "lucide-react";

export function OxygenationModule() {
  const { t } = useI18n();
  const dissociationContent = useEditableText("oxy-dissociation-content", "The oxyhemoglobin dissociation curve describes hemoglobin's affinity for oxygen at different partial pressures. A RIGHT shift (decreased affinity — hemoglobin releases oxygen more readily to tissues) is caused by increased temperature, increased CO2 (Bohr effect), increased 2,3-DPG, and decreased pH (acidosis). A LEFT shift (increased affinity — hemoglobin holds onto oxygen more tightly) is caused by decreased temperature, decreased CO2, decreased 2,3-DPG, increased pH (alkalosis), carbon monoxide, and fetal hemoglobin. Mnemonic for right shift: 'Right = Release' — conditions that increase tissue metabolic demand shift the curve right to deliver more oxygen.");
  const cardiacOutputContent = useEditableText("oxy-cardiac-output-content", "Cardiac output (CO) = Heart Rate (HR) × Stroke Volume (SV). Normal CO is approximately 4-8 L/min. Stroke volume is determined by three factors: Preload (volume of blood filling the ventricle — Frank-Starling mechanism), Afterload (resistance the ventricle must pump against — primarily systemic vascular resistance), and Contractility (strength of ventricular contraction — inotropic state). Increasing preload or contractility increases CO; increasing afterload decreases CO. Medications target these factors: fluids increase preload, vasodilators decrease afterload, and inotropes increase contractility.");
  const abgContent = useEditableText("oxy-abg-content", "Arterial blood gas (ABG) interpretation is a critical nursing skill. Normal values: pH 7.35-7.45, PaCO2 35-45 mmHg, HCO3 22-26 mEq/L, PaO2 80-100 mmHg. Step 1: Look at pH — acidosis (<7.35) or alkalosis (>7.45). Step 2: Check PaCO2 — if it explains the pH change, the primary disorder is respiratory. Step 3: Check HCO3 — if it explains the pH change, the primary disorder is metabolic. Step 4: Check for compensation — the body tries to normalize pH using the opposite system (respiratory compensates for metabolic and vice versa). Step 5: Check PaO2 — is the patient hypoxemic?");

  return (
    <div className="space-y-10" data-testid="module-oxygenation">
      <div>
        <EditableModuleText sectionKey="oxy-title" defaultText="Oxygenation & Oxygen Delivery" as="h2" className="text-2xl font-bold text-gray-900 mb-2" />
        <EditableModuleText sectionKey="oxy-desc" defaultText="Master the principles of oxygen transport, hemoglobin binding, the oxyhemoglobin dissociation curve, cardiac output, tissue perfusion, and ABG interpretation — foundational concepts for all nursing practice." as="p" className="text-gray-600" multiline />
      </div>

      <MicroLesson title="Hemoglobin & Oxygen Binding" subtitle="How oxygen travels in the blood" icon={<Heart className="w-5 h-5" />}>
        <EditableModuleText sectionKey="oxy-hgb-content" defaultText="Oxygen is transported in the blood in two forms: dissolved in plasma (measured as PaO2, only about 1.5% of total oxygen) and bound to hemoglobin (measured as SaO2/SpO2, about 98.5% of total oxygen). Each hemoglobin molecule can carry up to 4 oxygen molecules. Understanding this distinction is critical because pulse oximetry measures oxygen saturation (how much hemoglobin is loaded), not the total oxygen content of the blood." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-100">
            <p className="text-xs font-semibold text-red-700 mb-1">Hemoglobin Structure & Function</p>
            <p className="text-xs text-red-600"><strong>Structure:</strong> 4 globin chains (2 alpha, 2 beta in adult HgbA), each containing a heme group with an iron atom (Fe2+). Oxygen binds reversibly to the iron. <strong>Cooperative binding:</strong> Once the first O2 binds, the hemoglobin molecule changes shape, making it easier for subsequent O2 molecules to bind (this creates the S-shaped dissociation curve). <strong>Normal values:</strong> Hemoglobin 12-16 g/dL (female), 14-18 g/dL (male). Each gram of Hgb carries 1.34 mL O2 when fully saturated.</p>
          </div>
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-1">Oxygen Saturation (SpO2/SaO2)</p>
            <p className="text-xs text-blue-600"><strong>SaO2:</strong> Arterial oxygen saturation measured from ABG (gold standard). <strong>SpO2:</strong> Peripheral oxygen saturation measured by pulse oximetry (non-invasive estimate). <strong>Normal:</strong> 95-100%. <strong>Critical insight:</strong> Due to the S-shaped curve, SpO2 stays high until PaO2 drops significantly. A SpO2 of 90% corresponds to a PaO2 of only ~60 mmHg — below the 'steep part' of the curve, small PaO2 drops cause large SpO2 drops. This is why SpO2 below 90% is considered critical.</p>
          </div>
        </div>
        <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100 mt-3">
          <p className="text-xs font-semibold text-amber-700 mb-1">Oxygen Content Equation</p>
          <p className="text-xs text-amber-600"><strong>CaO2 = (Hgb × 1.34 × SaO2) + (0.003 × PaO2)</strong>. The first term (hemoglobin-bound O2) contributes ~98.5% of total oxygen content. The second term (dissolved O2) is minimal. This equation explains why a patient can have a normal SpO2 but still be hypoxic if severely anemic — there isn't enough hemoglobin to carry adequate oxygen, even if what hemoglobin exists is fully saturated.</p>
        </div>
      </MicroLesson>

      <MicroLesson title="Oxyhemoglobin Dissociation Curve" subtitle="Right and left shifts explained" icon={<Activity className="w-5 h-5" />}>
        <EditableModuleText sectionKey="oxy-curve-content" defaultText="The oxyhemoglobin dissociation curve is an S-shaped curve that shows the relationship between PaO2 (x-axis) and hemoglobin saturation (y-axis). The curve's position can shift right or left depending on physiologic conditions, affecting how readily hemoglobin binds and releases oxygen." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-100">
            <p className="text-xs font-semibold text-orange-700 mb-2">RIGHT Shift — O2 Released to Tissues</p>
            <p className="text-xs text-orange-600"><strong>Hemoglobin affinity DECREASES</strong> — oxygen is unloaded more readily at the tissues. This makes physiologic sense: conditions that increase metabolic demand also shift the curve right to deliver more O2. <strong>Causes (mnemonic — CADET face Right):</strong> CO2 increased, Acidosis (decreased pH), 2,3-DPG increased, Exercise/Fever (increased temperature). <strong>Clinical relevance:</strong> A febrile, acidotic patient delivers oxygen to tissues more efficiently but may desaturate faster.</p>
          </div>
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-2">LEFT Shift — O2 Held by Hemoglobin</p>
            <p className="text-xs text-blue-600"><strong>Hemoglobin affinity INCREASES</strong> — oxygen binds more tightly and is not released as easily at the tissues. <strong>Causes:</strong> Decreased CO2, Alkalosis (increased pH), Decreased 2,3-DPG, Hypothermia, Carbon monoxide (CO binds 200x tighter than O2), Fetal hemoglobin (HgbF has higher O2 affinity to extract O2 from maternal blood). <strong>Clinical relevance:</strong> SpO2 may look normal, but tissues may still be hypoxic because hemoglobin won't release its oxygen.</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_oxygenation.theOxyhemoglobinDissociationCurve")}
          content={dissociationContent}
        />
      </MicroLesson>

      <MicroLesson title="Cardiac Output & O2 Delivery" subtitle="CO = HR × SV and the O2 delivery equation" icon={<Gauge className="w-5 h-5" />}>
        <EditableModuleText sectionKey="oxy-co-content" defaultText="Oxygen delivery to tissues depends on two factors: the oxygen content of the blood (CaO2) and the cardiac output (CO). Even if blood is well-oxygenated, tissues will become hypoxic if cardiac output is insufficient to deliver it. The oxygen delivery equation integrates both components: DO2 = CO × CaO2 × 10." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="space-y-3 mt-3">
          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
            <p className="text-xs font-semibold text-purple-700 mb-2">Cardiac Output Components</p>
            <p className="text-xs text-purple-600"><strong>Heart Rate (HR):</strong> Normal 60-100 bpm. Too fast (tachycardia) reduces ventricular filling time → decreased stroke volume. Too slow (bradycardia) may not provide adequate output. <strong>Stroke Volume (SV):</strong> Volume ejected per beat, normally ~70 mL. Determined by: <strong>Preload</strong> (venous return/end-diastolic volume — Frank-Starling: more stretch = more force up to a point), <strong>Afterload</strong> (resistance to ejection — primarily SVR; high afterload = decreased SV), <strong>Contractility</strong> (intrinsic muscle force independent of preload/afterload).</p>
          </div>
          <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100">
            <p className="text-xs font-semibold text-teal-700 mb-2">O2 Delivery Equation</p>
            <p className="text-xs text-teal-600"><strong>DO2 = CO × CaO2 × 10</strong> (normal ~1000 mL O2/min). Tissues extract about 250 mL O2/min at rest (25% extraction ratio). This reserve means the body can compensate for moderate reductions in delivery. <strong>Clinical application:</strong> Improving O2 delivery can target any component — give O2 (increases PaO2/SaO2), transfuse blood (increases Hgb), give fluids (increases preload → increases SV → increases CO), give inotropes (increases contractility → increases SV).</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_oxygenation.cardiacOutputHrSv")}
          content={cardiacOutputContent}
        />
      </MicroLesson>

      <MicroLesson title="Perfusion vs Oxygenation & Organ Hypoxia" subtitle="Why tissues fail without adequate oxygen" icon={<Brain className="w-5 h-5" />}>
        <EditableModuleText sectionKey="oxy-perfusion-content" defaultText="Oxygenation and perfusion are related but distinct concepts. A patient can have excellent oxygenation (high SpO2) but poor perfusion (low cardiac output, shock). Conversely, a patient can have adequate perfusion but poor oxygenation (respiratory failure). Both must be adequate for tissue survival." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-1">Oxygenation</p>
            <p className="text-xs text-blue-600">Refers to how well oxygen gets into the blood from the lungs. Assessed by PaO2 and SpO2. Problems include: ventilation failure (COPD, pneumonia), diffusion impairment (pulmonary fibrosis, ARDS), V/Q mismatch (PE, atelectasis), shunt (blood bypassing ventilated alveoli). Treated with supplemental O2, mechanical ventilation, treating the underlying lung pathology.</p>
          </div>
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-100">
            <p className="text-xs font-semibold text-red-700 mb-1">Perfusion</p>
            <p className="text-xs text-red-600">Refers to how well oxygenated blood is delivered to tissues. Assessed by blood pressure, cardiac output, capillary refill, urine output, mental status, lactate levels. Problems include: cardiogenic shock (pump failure), hypovolemic shock (volume loss), distributive shock (vasodilation in sepsis/anaphylaxis). Treated with fluids, vasopressors, inotropes, treating the underlying cause.</p>
          </div>
        </div>
        <ProgressiveReveal
          title={t("data.pre_nursing_oxygenation.organspecificHypoxiaEffects")}
          cards={[
            {
              id: "oxy-brain",
              title: "Brain (Most Sensitive)",
              summary: "Irreversible damage in 4-6 minutes without oxygen",
              detail: "The brain consumes 20% of the body's oxygen despite being only 2% of body weight. It has virtually no oxygen or glucose reserves. Neurons begin to die after 4-6 minutes of anoxia. Early signs of cerebral hypoxia: restlessness, confusion, anxiety, headache. Late signs: decreased LOC, seizures, coma. The brainstem (which controls breathing and heart rate) is the last area to fail — when it does, death follows.",
            },
            {
              id: "oxy-heart",
              title: "Heart (High O2 Demand)",
              summary: "Myocardium extracts 70-80% of delivered oxygen at rest",
              detail: "Unlike skeletal muscle (which extracts only 25% at rest), cardiac muscle extracts 70-80% of delivered oxygen even at rest, leaving little reserve. The only way to increase myocardial oxygen supply is to increase coronary blood flow (not extraction). When oxygen demand exceeds supply, ischemia occurs — manifesting as angina (reversible) or infarction (irreversible). This is why tachycardia is dangerous in coronary artery disease: it increases demand while decreasing diastolic filling time (when coronaries are perfused).",
            },
            {
              id: "oxy-kidney",
              title: "Kidneys (Flow-Dependent)",
              summary: "Receive 25% of cardiac output — highly sensitive to hypoperfusion",
              detail: "Kidneys receive ~25% of cardiac output (1.2 L/min) to perform filtration. The renal medulla operates in a relatively hypoxic environment normally. Acute kidney injury (AKI) commonly results from hypoperfusion (prerenal causes account for 60-70% of AKI). Early sign of inadequate renal perfusion: decreased urine output (<0.5 mL/kg/hr). This is why urine output is a key indicator of perfusion status in critically ill patients.",
            },
            {
              id: "oxy-gut",
              title: "GI Tract (Vulnerable in Shock)",
              summary: "Blood flow diverted away during shock states",
              detail: "During shock, blood is shunted away from the splanchnic (gut) circulation to preserve flow to the brain and heart. Gut ischemia damages the intestinal mucosal barrier, allowing bacterial translocation — gut bacteria enter the bloodstream, potentially causing sepsis. This is one reason why shock can cascade into multi-organ dysfunction syndrome (MODS). Ischemic bowel produces lactic acid, worsening systemic acidosis.",
            },
          ]}
        />
      </MicroLesson>

      <MicroLesson title="Pulse Oximetry & ABG Basics" subtitle="Monitoring oxygenation at the bedside" icon={<Wind className="w-5 h-5" />}>
        <EditableModuleText sectionKey="oxy-monitoring-content" defaultText="Pulse oximetry and arterial blood gases are the two primary tools for assessing oxygenation. Understanding their principles, normal values, and limitations is essential for safe nursing practice." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="space-y-3 mt-3">
          <div className="p-4 bg-green-50/60 rounded-xl border border-green-100">
            <p className="text-xs font-semibold text-green-700 mb-2">Pulse Oximetry (SpO2)</p>
            <p className="text-xs text-green-600"><strong>Principle:</strong> Uses two wavelengths of light (red and infrared) passed through a pulsatile vascular bed. Oxyhemoglobin and deoxyhemoglobin absorb these wavelengths differently, allowing calculation of saturation percentage. <strong>Normal:</strong> 95-100%. <strong>Limitations:</strong> Inaccurate with poor perfusion (shock, cold extremities, vasoconstriction), nail polish (especially dark colors), carbon monoxide poisoning (reads falsely high — CO-Hgb absorbs like O2-Hgb), severe anemia (can show normal SpO2 with critically low O2 content), methemoglobinemia (reads ~85% regardless of true saturation), motion artifact, ambient light.</p>
          </div>
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-2">ABG Normal Values</p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-blue-600">
                <span><strong>pH:</strong> 7.35 – 7.45</span>
                <span>{t("data.pre_nursing_oxygenation.acidosisAlkalosis")}</span>
              </div>
              <div className="flex justify-between text-xs text-blue-600">
                <span><strong>{t("data.pre_nursing_oxygenation.paco2")}</strong> 35 – 45 mmHg</span>
                <span>{t("data.pre_nursing_oxygenation.respiratoryComponent")}</span>
              </div>
              <div className="flex justify-between text-xs text-blue-600">
                <span><strong>HCO3:</strong> 22 – 26 mEq/L</span>
                <span>{t("data.pre_nursing_oxygenation.metabolicComponent")}</span>
              </div>
              <div className="flex justify-between text-xs text-blue-600">
                <span><strong>{t("data.pre_nursing_oxygenation.pao2")}</strong> 80 – 100 mmHg</span>
                <span>{t("data.pre_nursing_oxygenation.oxygenInPlasma")}</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
            <p className="text-xs font-semibold text-purple-700 mb-2">ABG Interpretation Steps (ROME Method)</p>
            <p className="text-xs text-purple-600"><strong>R</strong>espiratory = <strong>O</strong>pposite: When pH and PaCO2 move in opposite directions, the primary disorder is respiratory. <strong>M</strong>etabolic = <strong>E</strong>qual: When pH and HCO3 move in the same direction, the primary disorder is metabolic. <strong>Example:</strong> pH 7.30 (acidosis), PaCO2 55 (high = acidic) → pH down, CO2 up = opposite directions → Respiratory acidosis. <strong>Example:</strong> pH 7.50 (alkalosis), HCO3 32 (high = alkaline) → pH up, HCO3 up = same direction → Metabolic alkalosis.</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_oxygenation.abgInterpretationFramework")}
          content={abgContent}
        />
      </MicroLesson>

      <MatchingExercise
        title={t("data.pre_nursing_oxygenation.matchTheOxygenationConcept")}
        pairs={[
          { id: "right-shift", term: "Right shift", definition: "Hemoglobin releases oxygen more readily (fever, acidosis)" },
          { id: "left-shift", term: "Left shift", definition: "Hemoglobin holds oxygen more tightly (alkalosis, hypothermia)" },
          { id: "cardiac-output", term: "Cardiac output", definition: "Heart rate × stroke volume (L/min)" },
          { id: "preload", term: "Preload", definition: "Volume of blood filling the ventricle before contraction" },
          { id: "afterload", term: "Afterload", definition: "Resistance the ventricle pumps against" },
          { id: "pao2", term: "PaO2", definition: "Partial pressure of oxygen dissolved in arterial plasma" },
        ]}
      />

      <SelfCheckQuiz
        title={t("data.pre_nursing_oxygenation.oxygenationO2DeliveryQuiz")}
        questions={[
          {
            id: "oxy1",
            question: "Approximately what percentage of oxygen in the blood is carried by hemoglobin?",
            options: ["50%", "75%", "90%", "98.5%"],
            correctIndex: 3,
            rationale: "About 98.5% of oxygen is carried bound to hemoglobin (measured as SaO2/SpO2). Only about 1.5% is dissolved in plasma (measured as PaO2). This is why hemoglobin level is critical for oxygen delivery — even with perfect lung function, severe anemia means inadequate oxygen transport.",
          },
          {
            id: "oxy2",
            question: "A patient with fever, acidosis, and elevated CO2 will have their oxyhemoglobin dissociation curve shifted:",
            options: ["To the left", "To the right", "No change", "The curve inverts"],
            correctIndex: 1,
            rationale: "Fever (increased temperature), acidosis (decreased pH), and elevated CO2 all shift the curve to the RIGHT — hemoglobin releases oxygen more readily to tissues. This is physiologically appropriate: tissues with high metabolic demand (producing heat, CO2, and acid) need more oxygen.",
          },
          {
            id: "oxy3",
            question: "The formula for cardiac output is:",
            options: ["CO = BP × SVR", "CO = HR × SV", "CO = PaO2 × Hgb", "CO = MAP / CVP"],
            correctIndex: 1,
            rationale: "Cardiac Output (CO) = Heart Rate (HR) × Stroke Volume (SV). Normal cardiac output is approximately 4-8 L/min. This can be increased by raising heart rate or stroke volume, or decreased when either component falls.",
          },
          {
            id: "oxy4",
            question: "A SpO2 of 90% corresponds to a PaO2 of approximately:",
            options: ["90 mmHg", "80 mmHg", "60 mmHg", "40 mmHg"],
            correctIndex: 2,
            rationale: "Due to the S-shaped oxyhemoglobin dissociation curve, an SpO2 of 90% corresponds to a PaO2 of approximately 60 mmHg. Below this point, the curve becomes steep — small decreases in PaO2 cause large drops in SpO2. This is why SpO2 <90% is considered critical.",
          },
          {
            id: "oxy5",
            question: "Which organ is MOST sensitive to hypoxia?",
            options: ["Heart", "Kidneys", "Brain", "Liver"],
            correctIndex: 2,
            rationale: "The brain is the most sensitive organ to hypoxia. It consumes 20% of the body's oxygen, has virtually no oxygen reserves, and neurons begin irreversible damage after only 4-6 minutes without oxygen. This is why airway and breathing are always the first priorities.",
          },
          {
            id: "oxy6",
            question: "Pulse oximetry reads falsely HIGH in which condition?",
            options: ["Severe anemia", "Carbon monoxide poisoning", "Hypothermia", "Dark nail polish"],
            correctIndex: 1,
            rationale: "Carbon monoxide poisoning causes falsely high SpO2 readings because carboxyhemoglobin (CO-Hgb) absorbs light similarly to oxyhemoglobin (O2-Hgb). The pulse oximeter cannot distinguish between them, so it reads CO-Hgb as if it were carrying oxygen. ABG with co-oximetry is needed for accurate assessment.",
          },
          {
            id: "oxy7",
            question: "The three determinants of stroke volume are:",
            options: ["Heart rate, rhythm, and axis", "Preload, afterload, and contractility", "Systolic, diastolic, and mean pressures", "PaO2, PaCO2, and pH"],
            correctIndex: 1,
            rationale: "Stroke volume is determined by preload (ventricular filling/stretch before contraction), afterload (resistance the ventricle must pump against), and contractility (intrinsic strength of myocardial contraction). Medications target each: fluids increase preload, vasodilators decrease afterload, inotropes increase contractility.",
          },
          {
            id: "oxy8",
            question: "A patient has a normal SpO2 of 99% but hemoglobin of 5 g/dL. This patient is:",
            options: ["Well oxygenated with adequate O2 delivery", "Well saturated but has critically low oxygen content", "In respiratory failure", "Experiencing a left shift"],
            correctIndex: 1,
            rationale: "SpO2 measures the percentage of hemoglobin that is saturated — not the total amount of oxygen. With severe anemia (Hgb 5), even 99% saturation means very little total oxygen is being carried. Using the oxygen content equation: CaO2 = 5 × 1.34 × 0.99 = 6.6 mL O2/dL (normal ~20). This patient needs transfusion, not just supplemental O2.",
          },
          {
            id: "oxy9",
            question: "In the ROME method of ABG interpretation, 'Respiratory = Opposite' means:",
            options: ["pH and HCO3 move in opposite directions", "pH and PaCO2 move in opposite directions in respiratory disorders", "Respiratory rate and pH are always opposite", "PaCO2 and HCO3 move in opposite directions"],
            correctIndex: 1,
            rationale: "In respiratory acid-base disorders, pH and PaCO2 move in OPPOSITE directions. In respiratory acidosis: pH goes DOWN, PaCO2 goes UP (opposite). In respiratory alkalosis: pH goes UP, PaCO2 goes DOWN (opposite). This contrasts with metabolic disorders where pH and HCO3 move in the SAME direction (Equal).",
          },
          {
            id: "oxy10",
            question: "The Frank-Starling mechanism states that:",
            options: ["Heart rate always equals stroke volume", "Increased ventricular stretch (preload) increases the force of contraction up to a point", "Afterload is the primary determinant of cardiac output", "The heart can only contract at one fixed strength"],
            correctIndex: 1,
            rationale: "The Frank-Starling mechanism describes how increased ventricular filling (preload) stretches myocardial fibers, which increases the force of contraction and stroke volume — up to a physiologic limit. Beyond that limit (over-distension), the heart fails to generate adequate force, which is what happens in heart failure.",
          },
          {
            id: "oxy11",
            question: "An ABG shows: pH 7.28, PaCO2 60 mmHg, HCO3 24 mEq/L. This represents:",
            options: ["Metabolic acidosis", "Respiratory acidosis", "Metabolic alkalosis", "Respiratory alkalosis"],
            correctIndex: 1,
            rationale: "pH 7.28 = acidosis. PaCO2 60 = elevated (respiratory acid). HCO3 24 = normal (no metabolic component yet). pH and PaCO2 move in opposite directions (pH down, CO2 up) = Respiratory. Therefore: uncompensated respiratory acidosis. Causes include COPD exacerbation, respiratory depression, and hypoventilation.",
          },
          {
            id: "oxy12",
            question: "Why is urine output a key indicator of perfusion in critically ill patients?",
            options: ["The kidneys produce urine regardless of blood flow", "Kidneys receive 25% of cardiac output and are sensitive to hypoperfusion", "Urine output only reflects hydration status", "Urine output has no relationship to cardiac output"],
            correctIndex: 1,
            rationale: "The kidneys receive approximately 25% of cardiac output. When perfusion decreases (shock, heart failure), renal blood flow drops, and urine output falls (<0.5 mL/kg/hr indicates inadequate perfusion). This makes hourly urine output one of the most practical bedside indicators of hemodynamic status.",
          },
          {
            id: "oxy13",
            question: "Fetal hemoglobin (HgbF) has a higher oxygen affinity than adult hemoglobin because:",
            options: ["Fetuses don't need as much oxygen", "It shifts the dissociation curve LEFT to extract O2 from maternal blood", "It shifts the dissociation curve RIGHT", "It has no clinical significance"],
            correctIndex: 1,
            rationale: "Fetal hemoglobin (HgbF) has a LEFT-shifted dissociation curve, meaning it binds oxygen more tightly than adult hemoglobin. This is essential for survival: it allows the fetus to extract oxygen from maternal blood across the placenta, even at the relatively low PaO2 in the placental circulation.",
          },
          {
            id: "oxy14",
            question: "The myocardium extracts approximately what percentage of delivered oxygen at rest?",
            options: ["25%", "50%", "70-80%", "100%"],
            correctIndex: 2,
            rationale: "The heart extracts 70-80% of delivered oxygen at rest, leaving very little reserve. Unlike skeletal muscle (25% extraction at rest), the heart cannot significantly increase extraction. The only way to increase myocardial oxygen supply is to increase coronary blood flow, which is why coronary artery disease is so dangerous.",
          },
          {
            id: "oxy15",
            question: "Which pulse oximetry limitation is MOST important for the nurse to understand?",
            options: ["It requires the patient to be still", "It cannot differentiate between oxyhemoglobin and carboxyhemoglobin", "It doesn't work with nail polish", "It is affected by ambient light"],
            correctIndex: 1,
            rationale: "The most clinically significant limitation is that pulse oximetry cannot distinguish oxyhemoglobin from carboxyhemoglobin (or methemoglobin). In carbon monoxide poisoning, SpO2 reads falsely normal/high while the patient is severely hypoxic. Always consider CO poisoning in patients with fire exposure or gas leaks who have 'normal' SpO2 but altered mental status.",
          },
          {
            id: "oxy16",
            question: "The difference between oxygenation and perfusion is:",
            options: ["They are the same thing", "Oxygenation is how O2 enters the blood; perfusion is how blood delivers O2 to tissues", "Perfusion only refers to the lungs", "Oxygenation only matters in cardiac patients"],
            correctIndex: 1,
            rationale: "Oxygenation refers to getting oxygen into the blood (lung function — assessed by PaO2, SpO2). Perfusion refers to delivering oxygenated blood to tissues (cardiac function — assessed by BP, CO, capillary refill, urine output). A patient can have excellent oxygenation but poor perfusion (cardiogenic shock) or adequate perfusion but poor oxygenation (respiratory failure).",
          },
          {
            id: "oxy17",
            question: "During shock, blood is shunted away from the GI tract, which can lead to:",
            options: ["Improved digestion", "Bacterial translocation and sepsis risk", "Increased nutrient absorption", "Decreased gastric acid production only"],
            correctIndex: 1,
            rationale: "During shock, sympathetic activation diverts blood from the splanchnic (gut) circulation to vital organs. Gut ischemia damages the mucosal barrier, allowing intestinal bacteria to cross into the bloodstream (translocation), potentially causing sepsis and contributing to multi-organ dysfunction syndrome (MODS).",
          },
          {
            id: "oxy18",
            question: "An ABG shows: pH 7.48, PaCO2 30 mmHg, HCO3 24 mEq/L, PaO2 95 mmHg. This represents:",
            options: ["Respiratory acidosis", "Metabolic alkalosis", "Respiratory alkalosis", "Normal ABG"],
            correctIndex: 2,
            rationale: "pH 7.48 = alkalosis. PaCO2 30 = low (respiratory). HCO3 24 = normal. pH and PaCO2 move in opposite directions (pH up, CO2 down) = Respiratory. This is uncompensated respiratory alkalosis, commonly caused by hyperventilation (anxiety, pain, early sepsis, PE).",
          },
          {
            id: "oxy19",
            question: "Increasing afterload (systemic vascular resistance) will:",
            options: ["Increase stroke volume", "Decrease stroke volume", "Have no effect on cardiac function", "Increase preload"],
            correctIndex: 1,
            rationale: "Afterload is the resistance the left ventricle must overcome to eject blood. Higher afterload (vasoconstriction, aortic stenosis) means the ventricle must work harder, which decreases stroke volume. This is why vasodilators (reducing afterload) improve cardiac output in heart failure.",
          },
          {
            id: "oxy20",
            question: "Early signs of cerebral hypoxia include:",
            options: ["Seizures and coma", "Restlessness, confusion, and anxiety", "Bradycardia and hypotension", "Decreased urine output"],
            correctIndex: 1,
            rationale: "Early signs of cerebral hypoxia are restlessness, confusion, anxiety, irritability, and headache — these reflect the brain's sensitivity to even mild oxygen deprivation. Late signs include decreased level of consciousness, seizures, and coma. Recognizing early signs allows intervention before irreversible damage occurs.",
            hint: "Think about subtle behavioral changes that occur before the brain 'shuts down' more dramatically.",
          },
        ]}
      />
    </div>
  );
}