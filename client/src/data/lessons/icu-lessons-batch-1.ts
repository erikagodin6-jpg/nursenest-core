import type { LessonContent } from "./types";

export const icuLessonsBatch1: Record<string, LessonContent> = {
  "icu-hemodynamic-monitoring": {
    title: "Hemodynamic Monitoring in the ICU",
    cellular: { title: "Hemodynamic Physiology", content: "Hemodynamic monitoring is the cornerstone of ICU management, providing real-time data about cardiovascular function and tissue perfusion. The fundamental hemodynamic parameters include cardiac output (CO), mean arterial pressure (MAP), central venous pressure (CVP), pulmonary artery occlusion pressure (PAOP), systemic vascular resistance (SVR), and mixed venous oxygen saturation (SvO2). Cardiac output is determined by heart rate and stroke volume, which depends on preload, afterload, and contractility. The Frank-Starling mechanism describes how increasing preload stretches myocardial fibers, increasing contraction force up to an optimal point. Invasive monitoring via arterial lines provides continuous blood pressure measurement and waveform analysis, while pulmonary artery catheters measure right heart and pulmonary pressures. Modern non-invasive techniques include pulse contour analysis, bioreactance, and point-of-care echocardiography." },
    riskFactors: ["Shock states requiring vasopressor support", "Post-cardiac surgery patients", "Acute heart failure with hemodynamic instability", "Sepsis with organ dysfunction", "Massive fluid resuscitation requirements", "Multisystem trauma with hemorrhage"],
    diagnostics: ["Arterial line waveform analysis: systolic pressure variation and pulse pressure variation for fluid responsiveness", "Central venous pressure trending: normal 2-6 mmHg", "Pulmonary artery catheter: PAOP normal 6-12 mmHg, CO 4-8 L/min, CI 2.5-4.0 L/min/m2", "Mixed venous oxygen saturation: normal 60-80%", "Cardiac index calculation", "Lactate levels: normal <2 mmol/L"],
    management: ["Titrate vasopressors to maintain MAP >65 mmHg", "Assess fluid responsiveness using dynamic parameters before volume loading", "Optimize preload with crystalloid boluses while monitoring for overload", "Adjust inotropes based on cardiac output and SvO2 goals", "Implement goal-directed therapy protocols", "Consider mechanical circulatory support for refractory cardiogenic shock"],
    nursingActions: ["Zero and level transducers at the phlebostatic axis every shift and after position changes", "Perform square wave test to verify arterial line dynamic response", "Document hemodynamic parameters at prescribed intervals", "Monitor arterial waveform morphology for changes", "Maintain catheter patency with continuous flush system", "Assess insertion sites for infection and compromised distal perfusion"],
    signs: {
      left: ["MAP >65 mmHg with adequate organ perfusion", "CI 2.5-4.0 L/min/m2", "SvO2 60-80%", "Urine output >0.5 mL/kg/hr"],
      right: ["MAP <60 mmHg despite vasopressor support", "CI <2.0 L/min/m2", "SvO2 <50% indicating severe oxygen debt", "Rising lactate >4 mmol/L"]
    },
    medications: [
      { name: "Norepinephrine", type: "Vasopressor", action: "Alpha-1 agonist causing vasoconstriction with mild beta-1 inotropic effect", sideEffects: "Tissue necrosis with extravasation, peripheral ischemia, arrhythmias", contra: "Uncorrected hypovolemia", pearl: "First-line vasopressor for most shock states. Central line preferred." },
      { name: "Dobutamine", type: "Inotrope", action: "Beta-1 agonist increasing cardiac contractility and output", sideEffects: "Tachycardia, hypotension from beta-2 vasodilation", contra: "HOCM, severe aortic stenosis", pearl: "First-line inotrope for cardiogenic shock with adequate BP. Tachyphylaxis after 72 hours." }
    ],
    pearls: ["The phlebostatic axis (4th ICS, mid-axillary line) is the reference point for all pressure transducers", "Pulse pressure variation >13% during controlled ventilation reliably predicts fluid responsiveness", "SvO2 reflects O2 delivery-consumption balance; falling SvO2 is often the earliest sign of hemodynamic compromise", "CVP alone is a poor predictor of fluid responsiveness", "Always assess the patient, not just the numbers"],
    quiz: [
      { question: "A patient on mechanical ventilation has pulse pressure variation of 18%. What does this indicate?", options: ["Fluid overload", "Likely to respond to a fluid bolus", "Ventilator settings need adjustment", "Arterial line malfunction"], correct: 1, rationale: "PPV >13% during controlled ventilation indicates fluid responsiveness, suggesting the heart is on the ascending portion of the Frank-Starling curve." },
      { question: "After repositioning a patient, the arterial line reads MAP 45 mmHg but the patient appears stable. What should the nurse do first?", options: ["Start vasopressors", "Re-level the transducer at the phlebostatic axis", "Obtain a stat echocardiogram", "Administer a fluid bolus"], correct: 1, rationale: "Position changes alter the transducer level relative to the phlebostatic axis causing inaccurate readings. Re-zero and re-level before treating." }
    ]
  },
  "icu-arterial-line-management": {
    title: "Arterial Line Management",
    cellular: { title: "Arterial Catheter Physiology", content: "Arterial lines provide continuous beat-to-beat blood pressure monitoring and arterial access for frequent blood sampling. The radial artery is the most common site due to dual blood supply verified by the Allen test. The arterial waveform consists of a systolic upstroke, a dicrotic notch (aortic valve closure), and a diastolic decline. Waveform analysis provides information beyond blood pressure: narrow pulse pressure suggests low stroke volume, wide pulse pressure suggests aortic regurgitation or sepsis, and respiratory variation indicates potential fluid responsiveness. The transducer converts mechanical pressure waves to electrical signals. Accurate readings require zeroing to atmospheric pressure, leveling to the phlebostatic axis, and verifying dynamic response with the square wave test." },
    riskFactors: ["Hemodynamic instability requiring continuous BP monitoring", "Vasopressor infusions requiring precise titration", "Frequent ABG sampling needs", "Respiratory failure on ventilator", "Post-cardiac surgery", "Coagulopathy increasing bleeding risk"],
    diagnostics: ["Allen test before radial cannulation: confirm ulnar flow within 5-7 seconds", "Continuous waveform analysis for overdamping vs underdamping", "Square wave test: optimal shows 1-2 oscillations before baseline return", "Compare with non-invasive cuff pressures (within 5-10 mmHg)", "Serial ABG sampling for acid-base and oxygenation assessment"],
    management: ["Maintain continuous flush at 3 mL/hr with pressurized bag at 300 mmHg", "Aseptic technique for blood sampling and dressing changes", "Secure catheter to prevent dislodgement", "Replace tubing per protocol (typically every 96 hours)", "Remove when continuous monitoring no longer indicated", "Apply direct pressure minimum 5 minutes after removal"],
    nursingActions: ["Neurovascular checks distal to site every 1-2 hours", "Zero transducer each shift and after position changes", "Level at phlebostatic axis", "Assess insertion site every shift for infection signs", "Perform square wave test every shift", "Ensure all connections are Luer-locked and visible"],
    signs: {
      left: ["Clear waveform with visible dicrotic notch", "Readings correlate with clinical assessment", "Site clean and intact", "Distal extremity warm with palpable pulses"],
      right: ["Dampened waveform: clot, air, or kink", "Loss of dicrotic notch: low cardiac output", "Distal ischemia: pallor, coolness, absent pulse", "Bleeding or hematoma at site"]
    },
    medications: [
      { name: "Heparinized Saline Flush", type: "Anticoagulant flush", action: "Maintains catheter patency by preventing clot formation", sideEffects: "HIT (extremely rare)", contra: "Known HIT", pearl: "1-2 units/mL typical concentration. Some institutions use plain NS." }
    ],
    pearls: ["Always perform Allen test before radial cannulation", "Overdamped waveform falsely LOWERS systolic; underdamped falsely RAISES systolic", "Never administer medications through an arterial line", "If line disconnects, apply firm direct pressure immediately", "The dicrotic notch represents aortic valve closure"],
    quiz: [
      { question: "An arterial line waveform appears flattened with falsely low systolic reading. Most likely cause?", options: ["Air bubbles in tubing", "Flush bag pressure too high", "Cardiogenic shock", "Transducer recalibration needed"], correct: 0, rationale: "Air bubbles, clots, kinks, or loose connections cause overdamping with flattened appearance and falsely low systolic readings." },
      { question: "Square wave test shows 5-6 oscillations before baseline return. This indicates?", options: ["Optimal dynamic response", "Overdamped system", "Underdamped system", "Normal function"], correct: 2, rationale: "Multiple oscillations (>2) indicate underdamping, giving falsely elevated systolic and falsely low diastolic readings." }
    ]
  },
  "icu-shock-management": {
    title: "Shock Management in the ICU",
    cellular: { title: "Shock Pathophysiology", content: "Shock is a state of circulatory failure resulting in inadequate tissue oxygen delivery. At the cellular level, insufficient oxygen forces anaerobic metabolism producing lactic acid and depleting ATP. Without ATP, sodium-potassium pumps fail causing cellular swelling and death. Shock is classified into four categories: hypovolemic (decreased volume from hemorrhage/dehydration), cardiogenic (pump failure from MI/cardiomyopathy), distributive (vasodilation from sepsis/anaphylaxis/neurogenic), and obstructive (mechanical obstruction from PE/tamponade/tension pneumothorax). Each has a characteristic hemodynamic profile. Compensatory mechanisms initially maintain perfusion but eventually fail, leading to decompensated shock and multi-organ dysfunction syndrome." },
    riskFactors: ["Massive hemorrhage", "Acute MI with >40% LV damage", "Sepsis from any source", "Anaphylaxis", "Spinal cord injury above T6", "Massive PE", "Tension pneumothorax", "Cardiac tamponade"],
    diagnostics: ["Serum lactate: >2 mmol/L tissue hypoperfusion, >4 mmol/L severe", "ABG: metabolic acidosis with compensatory respiratory alkalosis", "ScvO2 <70% suggests inadequate O2 delivery", "Hemodynamic profiling to distinguish shock types", "Point-of-care ultrasound for cardiac function and IVC", "Serial hemoglobin for hemorrhagic shock"],
    management: ["Aggressive fluid resuscitation with crystalloid (30 mL/kg for septic shock)", "Start vasopressors when MAP <65 despite adequate volume", "Identify and treat underlying cause", "Lung-protective ventilation for mechanically ventilated patients", "Stress dose hydrocortisone for vasopressor-refractory septic shock", "Target: MAP >65, UO >0.5 mL/kg/hr, lactate clearance >10%/2hr"],
    nursingActions: ["Monitor vital signs every 5-15 minutes during resuscitation", "Maintain two large-bore IVs (18G or larger)", "Titrate vasopressors per protocol to MAP goal", "Monitor urine output hourly", "Assess end-organ perfusion: mental status, skin, capillary refill", "Calculate and document fluid balance"],
    signs: {
      left: ["Compensated: tachycardia, normal BP, narrowed pulse pressure", "Cool/clammy skin (hypovolemic/cardiogenic)", "Warm/flushed skin (distributive)", "Anxiety, restlessness"],
      right: ["Decompensated: hypotension, tachycardia >120, altered mental status", "Oliguria indicating renal hypoperfusion", "Mottled extremities", "Rising lactate despite resuscitation", "Multi-organ dysfunction"]
    },
    medications: [
      { name: "Norepinephrine", type: "Vasopressor", action: "Alpha-1 agonist with mild beta-1 effect increasing MAP", sideEffects: "Tissue necrosis with extravasation, digital ischemia", contra: "Uncorrected hypovolemia", pearl: "First-line for septic, cardiogenic, and most shock states." },
      { name: "Vasopressin", type: "Non-catecholamine vasopressor", action: "V1 receptor agonist causing vasoconstriction independent of catecholamine pathways", sideEffects: "Digital/mesenteric ischemia, hyponatremia", contra: "None absolute in shock", pearl: "Add at 0.03-0.04 U/min when norepinephrine >0.25-0.5 mcg/kg/min." },
      { name: "Epinephrine", type: "Vasopressor/Inotrope", action: "Combined alpha and beta agonist", sideEffects: "Tachyarrhythmias, lactic acidosis", contra: "Narrow-angle glaucoma (relative)", pearl: "Second-line vasopressor or first-line for anaphylaxis." }
    ],
    pearls: ["Shock type determines treatment: GIVE fluids for hypovolemic, RESTRICT for cardiogenic, ANTIBIOTICS + fluids for septic", "Lactate clearance >10%/2hr is better prognostic marker than absolute value", "Cardiogenic: LOW CO, HIGH SVR, HIGH PAOP; Septic: HIGH CO, LOW SVR", "The first hour of septic shock management determines survival"],
    quiz: [
      { question: "A trauma patient has BP 70/40, HR 130, cool/clammy skin, flat neck veins. Shock type?", options: ["Cardiogenic", "Hypovolemic", "Neurogenic", "Obstructive"], correct: 1, rationale: "Cool/clammy skin, tachycardia, hypotension, and flat neck veins are classic for hypovolemic shock." },
      { question: "Septic patient hypotensive despite 30 mL/kg crystalloid and norepinephrine 0.3 mcg/kg/min. Next?", options: ["More norepinephrine only", "Add vasopressin 0.03 U/min", "Switch to phenylephrine", "Another 30 mL/kg crystalloid"], correct: 1, rationale: "Vasopressin should be added as adjunct when norepinephrine exceeds 0.25-0.5 mcg/kg/min per Surviving Sepsis Campaign guidelines." }
    ]
  },
  "icu-vasopressor-titration": {
    title: "Vasopressor and Inotrope Management",
    cellular: { title: "Vasoactive Pharmacology", content: "Vasopressors and inotropes target adrenergic receptors (alpha-1, beta-1, beta-2), dopaminergic receptors, and vasopressin V1 receptors to modulate vascular tone and cardiac function. Alpha-1 stimulation causes vasoconstriction increasing SVR. Beta-1 increases heart rate, contractility, and conduction velocity. Beta-2 causes bronchodilation and vasodilation. Selection depends on hemodynamic profile: vasoconstrictors for distributive shock with low SVR, inotropes for cardiogenic shock with low CO. Catecholamine receptor downregulation with prolonged use explains tachyphylaxis, making non-catecholamine agents like vasopressin valuable alternatives." },
    riskFactors: ["Septic shock requiring hemodynamic support", "Cardiogenic shock from acute MI", "Post-cardiac surgery vasoplegia", "Anaphylactic shock", "Neurogenic shock", "Hepatorenal syndrome", "Refractory hypotension"],
    diagnostics: ["Continuous arterial BP monitoring for real-time titration", "Cardiac output monitoring to guide inotrope therapy", "Serum lactate trending for perfusion adequacy", "SvO2 for O2 delivery vs consumption", "Urine output for renal perfusion", "ECG for drug-induced arrhythmias"],
    management: ["Select vasopressor based on hemodynamic profile", "Norepinephrine first-line targeting MAP >65 mmHg", "Vasopressin as second agent at fixed 0.03-0.04 U/min", "Dobutamine for low CO with adequate BP", "Phenylephrine for pure vasodilatory shock or arrhythmias", "Systematic weaning when targets maintained"],
    nursingActions: ["Administer via central line when possible", "Verify line patency before initiating high-dose infusions", "Use dedicated lumen for vasopressor infusion", "Titrate with changes no more than every 5-10 minutes", "Monitor continuously for extravasation", "Document dose, MAP response, and assessment with every titration"],
    signs: {
      left: ["MAP >65 on stable or decreasing doses", "Improving urine output and decreasing lactate", "Warm extremities with adequate capillary refill", "Stable heart rate"],
      right: ["Escalating requirements suggesting refractory shock", "New arrhythmias from catecholamine stimulation", "Digital ischemia from excessive vasoconstriction", "Extravasation causing tissue necrosis"]
    },
    medications: [
      { name: "Norepinephrine (Levophed)", type: "Vasopressor", action: "Alpha-1 predominant with mild beta-1: increases SVR and MAP", sideEffects: "Tissue necrosis with extravasation, reflex bradycardia at high doses", contra: "Uncorrected hypovolemia", pearl: "FIRST-LINE for septic shock. Dose 0.01-3 mcg/kg/min." },
      { name: "Phenylephrine", type: "Pure alpha-1 vasopressor", action: "Selective alpha-1 causing pure vasoconstriction without cardiac stimulation", sideEffects: "Reflex bradycardia, decreased CO", contra: "Cardiogenic shock", pearl: "Useful for tachyarrhythmic patients. Avoid in low CO states." },
      { name: "Milrinone", type: "PDE-3 inhibitor (Inodilator)", action: "Increases cAMP: positive inotropy and vasodilation", sideEffects: "Hypotension, arrhythmias, thrombocytopenia", contra: "Severe stenotic valvular disease", pearl: "Works independently of beta receptors - effective on beta-blockers." }
    ],
    pearls: ["Norepinephrine is first-line for septic shock. Dopamine is NO LONGER recommended first-line.", "Vasopressin has a FIXED dose in septic shock - it is NOT titrated", "Milrinone preferred over dobutamine in patients on chronic beta-blockers", "When weaning multiple vasopressors, generally wean vasopressin last"],
    quiz: [
      { question: "Septic shock patient on norepinephrine 0.5 mcg/kg/min. What to add next?", options: ["Dopamine", "Phenylephrine", "Vasopressin 0.03 U/min", "Milrinone"], correct: 2, rationale: "Vasopressin 0.03-0.04 U/min as adjunct per SSC guidelines when norepinephrine is escalating." },
      { question: "Blanching and swelling around a peripheral IV infusing norepinephrine. Immediate action?", options: ["Increase infusion rate", "Stop infusion and inject phentolamine locally", "Apply warm compresses", "Continue and monitor"], correct: 1, rationale: "Extravasation requires immediate cessation. Phentolamine is the antidote injected subcutaneously to reverse vasoconstriction." }
    ]
  },
  "icu-sepsis-bundles": {
    title: "Sepsis and Septic Shock: Hour-1 Bundle",
    cellular: { title: "Sepsis Pathophysiology", content: "Sepsis is life-threatening organ dysfunction from dysregulated host response to infection. PAMPs activate innate immune cells through Toll-like receptors, triggering massive cytokine release (TNF-alpha, IL-1, IL-6). Endothelial dysfunction causes capillary permeability, vasodilation from nitric oxide overproduction, and microvascular thrombosis. The result is distributive shock with tissue hypoperfusion despite preserved or elevated cardiac output. Organ dysfunction follows: ARDS, AKI, hepatic dysfunction, encephalopathy, and DIC. The SOFA score quantifies organ dysfunction across six systems." },
    riskFactors: ["Immunocompromised states", "Extremes of age", "Invasive devices: central lines, catheters, ventilators", "Recent surgery", "Chronic diseases: diabetes, CKD, cirrhosis", "Healthcare-associated infections", "Malnutrition", "Prior antibiotic use"],
    diagnostics: ["Blood cultures (2 sets from 2 sites) BEFORE antibiotics", "Serum lactate: >2 tissue hypoperfusion, >4 severe", "Procalcitonin: >0.5 ng/mL supports bacterial infection", "SOFA score: ≥2 point increase indicates organ dysfunction", "qSOFA: ≥2 of altered mentation, RR ≥22, SBP ≤100", "CBC, CMP, coagulation studies, imaging as indicated"],
    management: ["Hour-1 Bundle: lactate, cultures, broad-spectrum antibiotics, 30 mL/kg crystalloid, norepinephrine for MAP <65", "Source control within 6-12 hours", "De-escalate antibiotics within 48-72 hours based on cultures", "Stress-dose hydrocortisone for vasopressor-refractory shock", "Target glucose 144-180 mg/dL", "VTE and stress ulcer prophylaxis"],
    nursingActions: ["Recognize sepsis early using qSOFA and screening tools", "Obtain cultures before antibiotics but do NOT delay >45 minutes", "Initiate 2 large-bore IVs; prepare for central line", "Administer 30 mL/kg crystalloid rapidly", "Monitor lactate every 2-4 hours", "Titrate vasopressors to MAP ≥65 mmHg"],
    signs: {
      left: ["Early: fever/hypothermia, tachycardia, tachypnea, warm flushed skin", "Altered mental status as early sign", "Bounding pulses, widened pulse pressure", "Leukocytosis or leukopenia"],
      right: ["Septic shock: hypotension despite 30 mL/kg fluid", "Cool extremities indicating microcirculatory failure", "Oliguria from AKI", "DIC: petechiae, oozing from sites", "Multi-organ failure"]
    },
    medications: [
      { name: "Broad-Spectrum Antibiotics", type: "Anti-infective", action: "Empiric coverage of likely pathogens pending cultures", sideEffects: "Nephrotoxicity, hepatotoxicity, C. difficile, allergic reactions", contra: "Known allergy", pearl: "Administer within 1 HOUR. Each hour delay increases mortality by 7.6%." },
      { name: "Hydrocortisone", type: "Corticosteroid", action: "Reverses relative adrenal insufficiency, enhances catecholamine sensitivity", sideEffects: "Hyperglycemia, immunosuppression", contra: "Active fungal infections (relative)", pearl: "For vasopressor-refractory shock only. 200 mg/day IV divided or continuous." }
    ],
    pearls: ["Hour-1 Bundle: Lactate, cultures, antibiotics, fluids, vasopressors - ALL within FIRST HOUR", "Each hour of antibiotic delay increases mortality ~7.6%", "qSOFA ≥2 identifies patients at risk for poor outcomes", "Lactate clearance >10%/2hr is a better target than absolute lactate", "Procalcitonin guides antibiotic de-escalation"],
    quiz: [
      { question: "Suspected sepsis with MAP 60 and lactate 5.2. What must be done in the first hour?", options: ["Antibiotics only", "Cultures, antibiotics, 30 mL/kg crystalloid, lactate, vasopressors for MAP <65", "Wait for culture results", "Vasopressors without fluids"], correct: 1, rationale: "The Hour-1 Bundle requires ALL interventions within the first hour." },
      { question: "Septic patient received 30 mL/kg and norepinephrine 0.4 mcg/kg/min but MAP remains 58. What to add?", options: ["Another 30 mL/kg", "Dopamine", "Vasopressin and stress-dose hydrocortisone", "Phenylephrine only"], correct: 2, rationale: "Vasopressor-refractory septic shock requires vasopressin addition and stress-dose hydrocortisone per SSC guidelines." }
    ]
  },
  "icu-mechanical-ventilation": {
    title: "Mechanical Ventilation: Fundamentals",
    cellular: { title: "Respiratory Mechanics", content: "Mechanical ventilation supports or replaces spontaneous breathing by delivering positive pressure to inflate lungs. Key concepts include compliance (ease of lung expansion, normally 60-100 mL/cmH2O), resistance (opposition to airflow, normally 5-10 cmH2O/L/sec), and the equation of motion. Volume-controlled ventilation delivers set tidal volume regardless of pressure; pressure-controlled delivers set pressure regardless of volume. Key settings: tidal volume (6-8 mL/kg IBW for lung-protective ventilation), respiratory rate, FiO2, and PEEP (prevents alveolar collapse). Goals: adequate oxygenation (PaO2 60-100, SpO2 92-96%) and ventilation (PaCO2 35-45, pH 7.35-7.45) while minimizing ventilator-induced lung injury." },
    riskFactors: ["Acute respiratory failure", "ARDS", "GCS <8 requiring airway protection", "Post-operative respiratory support", "Neuromuscular disease", "Status asthmaticus", "Massive PE", "Post-cardiac arrest"],
    diagnostics: ["ABG analysis for ventilator adjustment", "P/F ratio for ARDS severity", "Peak inspiratory pressure: elevated = increased resistance or decreased compliance", "Plateau pressure: keep <30 cmH2O to prevent barotrauma", "Driving pressure (Plateau - PEEP): target <15 cmH2O", "End-tidal CO2 for continuous monitoring"],
    management: ["Lung-protective ventilation: Vt 6-8 mL/kg IBW, plateau <30 cmH2O", "Titrate FiO2 and PEEP to maintain PaO2 60-80, SpO2 92-96%", "PEEP/FiO2 tables for ARDS", "Permissive hypercapnia (pH >7.20)", "Daily SBT assessment", "Ventilator bundle: HOB 30-45°, sedation vacation, SBT, DVT/stress ulcer prophylaxis"],
    nursingActions: ["Verify ETT placement: bilateral breath sounds, ETCO2, chest X-ray", "Secure ETT and document depth", "Monitor alarms: high pressure, low pressure, low volume", "Oral care with chlorhexidine every 4-6 hours", "Assess for patient-ventilator dyssynchrony", "Monitor cuff pressure every 8 hours (20-30 cmH2O)"],
    signs: {
      left: ["Adequate Vt with acceptable pressures", "SpO2 92-96% on minimal FiO2", "Patient synchronous with ventilator", "Clear bilateral breath sounds"],
      right: ["High PIP >40 cmH2O", "Desaturation despite increasing FiO2/PEEP", "Auto-PEEP causing hemodynamic compromise", "Patient-ventilator dyssynchrony", "Absent ETCO2: extubation, obstruction, or arrest"]
    },
    medications: [
      { name: "Propofol", type: "Sedative-hypnotic", action: "GABA-A agonist for rapid-onset sedation", sideEffects: "Hypotension, PRIS with prolonged high-dose use", contra: "Egg/soy allergy, hypertriglyceridemia", pearl: "Monitor triglycerides q48h. PRIS risk >5 mg/kg/hr for >48hr." },
      { name: "Fentanyl", type: "Opioid analgesic", action: "Mu-receptor agonist for analgesia/sedation", sideEffects: "Respiratory depression, chest wall rigidity, constipation", contra: "MAOIs within 14 days", pearl: "Analgesia-first approach. Chest wall rigidity with rapid bolus." },
      { name: "Cisatracurium", type: "Neuromuscular blocking agent", action: "Non-depolarizing NMB causing paralysis", sideEffects: "Prolonged paralysis, ICU-acquired weakness", contra: "Never without concurrent sedation", pearl: "For severe ARDS with refractory dyssynchrony. Train-of-four monitoring." }
    ],
    pearls: ["Lung-protective ventilation: Vt 6 mL/kg IDEAL body weight (from height, not actual weight)", "Driving pressure <15 cmH2O may be best predictor of ARDS survival", "Peak reflects TOTAL pressure; Plateau reflects COMPLIANCE only", "NEVER paralyze without ensuring adequate sedation", "Daily SAT + SBT reduces ventilator days by 3 and ICU LOS by 4 days"],
    quiz: [
      { question: "ARDS patient: Vt 6 mL/kg IBW, plateau 34 cmH2O, PEEP 14. What adjustment?", options: ["Increase Vt", "Decrease Vt to reduce plateau below 30", "Increase PEEP to 20", "No changes"], correct: 1, rationale: "Plateau >30 risks VILI. Reduce Vt even below 6 mL/kg if needed. Permissive hypercapnia is acceptable." },
      { question: "Ventilated patient: sudden high PIP alarm with normal plateau pressure. Most likely cause?", options: ["Tension pneumothorax", "ARDS worsening", "Bronchospasm or mucus plug", "Atelectasis"], correct: 2, rationale: "Elevated peak with normal plateau = increased AIRWAY RESISTANCE. Decreased compliance would elevate BOTH." }
    ]
  },
  "icu-ards-management": {
    title: "ARDS: Acute Respiratory Distress Syndrome",
    cellular: { title: "ARDS Pathophysiology", content: "ARDS is severe inflammatory lung injury with diffuse alveolar damage, protein-rich pulmonary edema, and refractory hypoxemia. Three phases: Exudative (0-7d) with alveolar flooding and surfactant inactivation; Proliferative (7-21d) with type II pneumocyte repair; Fibrotic (>21d) with potential progressive fibrosis. Berlin Criteria classify by P/F ratio: Mild 200-300, Moderate 100-200, Severe <100. Common triggers: pneumonia, aspiration, sepsis, trauma, TRALI. The ventilation-perfusion mismatch and shunting produce hypoxemia refractory to supplemental oxygen alone." },
    riskFactors: ["Pneumonia (most common direct cause)", "Sepsis (most common indirect cause)", "Aspiration", "Major trauma", "Massive transfusion (TRALI)", "Pancreatitis", "Inhalation injury", "Drowning"],
    diagnostics: ["P/F ratio: Mild 200-300, Moderate 100-200, Severe <100", "CXR: bilateral diffuse infiltrates", "CT: ground-glass opacities with dependent distribution", "Echo to exclude cardiogenic edema (PAOP <18)", "BAL if infectious etiology suspected", "Daily plateau and driving pressure measurements"],
    management: ["Lung-protective ventilation: Vt 4-6 mL/kg IBW, plateau <30, driving pressure <15", "PEEP titration using ARDSNet tables", "Prone positioning ≥16 hours/day in moderate-severe ARDS (P/F <150)", "Conservative fluid strategy after resuscitation", "NMB for 48 hours in early severe ARDS", "ECMO referral for refractory severe ARDS (P/F <60)"],
    nursingActions: ["Calculate IBW from height for Vt calculation", "Monitor plateau and driving pressure with each assessment", "Coordinate prone positioning with team", "During proning: monitor ETT, facial pressure points, hemodynamics, eye protection", "Assess for barotrauma, VAP, ICU-acquired weakness", "Monitor fluid balance closely"],
    signs: {
      left: ["Improving P/F ratio", "Decreasing FiO2 requirements", "Improving lung compliance", "Resolving bilateral infiltrates"],
      right: ["Worsening P/F ratio despite optimal management", "Plateau >30 on minimal Vt", "New subcutaneous emphysema or pneumothorax", "Refractory hypoxemia (P/F <60)", "Progressive multi-organ failure"]
    },
    medications: [
      { name: "Cisatracurium", type: "NMB agent", action: "Skeletal muscle paralysis eliminating patient-ventilator dyssynchrony", sideEffects: "ICU-acquired weakness, awareness without sedation", contra: "Must have concurrent sedation", pearl: "ACURASYS trial: early 48hr use in severe ARDS improves oxygenation. Hoffman degradation allows use in renal/hepatic failure." },
      { name: "Dexmedetomidine", type: "Alpha-2 agonist sedative", action: "Sedation without significant respiratory depression", sideEffects: "Bradycardia, hypotension", contra: "Heart block, severe bradycardia", pearl: "Preferred for light sedation targets. Less delirium than benzodiazepines." }
    ],
    pearls: ["ARDS is a syndrome - always identify and treat the underlying cause", "P/F = PaO2 ÷ FiO2. Example: PaO2 80 on 0.60 = P/F 133 (moderate)", "Prone positioning proven mortality benefit in severe ARDS", "Permissive hypercapnia acceptable to maintain lung-protective Vt", "FACTT trial: conservative fluid management improves oxygenation"],
    quiz: [
      { question: "ARDS patient with P/F 90 on FiO2 1.0 and PEEP 16. Most appropriate intervention?", options: ["Increase Vt to 10 mL/kg", "Initiate prone positioning ≥16 hours/day", "Decrease PEEP", "Switch to PSV"], correct: 1, rationale: "P/F <100 = severe ARDS. With P/F <150, prone positioning ≥16 hr/day recommended per PROSEVA trial showing mortality reduction." },
      { question: "Which parameter best predicts ARDS mortality?", options: ["Peak inspiratory pressure", "FiO2 requirement", "Driving pressure (Plateau - PEEP)", "Respiratory rate"], correct: 2, rationale: "Driving pressure <15 cmH2O is the strongest predictor of mortality in ARDS, reflecting cyclical strain on functional lung tissue." }
    ]
  },
  "icu-sedation-analgesia": {
    title: "ICU Sedation and Analgesia: PADIS Guidelines",
    cellular: { title: "Pain and Sedation", content: "Pain management and sedation follow PADIS guidelines (Pain, Agitation/Sedation, Delirium, Immobility, Sleep). The analgesia-first approach prioritizes treating pain before adding sedation, as uncontrolled pain is the most common cause of ICU agitation. Non-verbal pain assessment uses BPS (3-12) or CPOT (0-8). Sedation depth is measured with RASS (-5 to +4), targeting light sedation (0 to -2). The ABCDEF ICU liberation bundle integrates pain assessment, SAT/SBT pairing, sedation choice, delirium monitoring (CAM-ICU), early mobility, and family engagement." },
    riskFactors: ["Mechanical ventilation", "Painful procedures", "Agitation with self-harm risk", "Severe ARDS requiring NMB", "Status epilepticus", "Post-operative pain", "Burns", "Traumatic injuries"],
    diagnostics: ["BPS: facial expression, upper limb movement, ventilator compliance; >5 = pain", "CPOT: facial expression, body movements, muscle tension; >2 = pain", "RASS: +4 combative to -5 unarousable; target 0 to -2", "CAM-ICU: delirium screen (positive/negative)", "BIS: 40-60 target for deep sedation/NMB monitoring"],
    management: ["Analgesia-first: treat pain before adding sedation", "Target light sedation (RASS 0 to -2)", "Daily SAT paired with SBT", "Prefer propofol or dexmedetomidine over benzodiazepines", "Multimodal analgesia: opioids, acetaminophen, gabapentinoids", "CAM-ICU screening every shift"],
    nursingActions: ["Assess pain with BPS/CPOT every 4 hours and before/after interventions", "Assess sedation with RASS every 4 hours and with dose changes", "Screen for delirium with CAM-ICU every shift", "Coordinate daily SAT + SBT", "Implement non-pharmacological comfort measures", "Monitor for sedation adverse effects"],
    signs: {
      left: ["Comfortable at target RASS", "Pain controlled (BPS ≤5, CPOT ≤2)", "CAM-ICU negative", "Good ventilator synchrony"],
      right: ["Oversedation (RASS -4 to -5): prolonged ventilation risk", "Severe agitation (RASS +3 to +4): self-extubation risk", "Delirium (CAM-ICU positive)", "Propofol infusion syndrome", "Opioid complications: ileus, urinary retention"]
    },
    medications: [
      { name: "Fentanyl", type: "Opioid", action: "Mu-receptor agonist; rapid onset, short duration", sideEffects: "Respiratory depression, chest wall rigidity, constipation", contra: "MAOIs within 14 days", pearl: "100x potency of morphine. Preferred in hemodynamically unstable patients." },
      { name: "Propofol", type: "Sedative-hypnotic", action: "GABA-A agonist; rapid onset/offset", sideEffects: "Hypotension, hypertriglyceridemia, PRIS", contra: "Egg/soy allergy", pearl: "Rapid offset ideal for daily sedation breaks. Count calories (1.1 kcal/mL)." },
      { name: "Dexmedetomidine", type: "Alpha-2 agonist", action: "Central alpha-2 activation: sedation without respiratory depression", sideEffects: "Bradycardia, hypotension", contra: "Advanced heart block", pearl: "Cooperative sedation: arousable and follows commands. Less delirium than benzos." },
      { name: "Ketamine", type: "NMDA antagonist", action: "Dissociative anesthetic with analgesic properties and bronchodilation", sideEffects: "Emergence reactions, hypertension, increased secretions", contra: "Severe hypertension, elevated ICP (relative)", pearl: "Opioid-sparing. Maintains hemodynamics. Low-dose (0.1-0.3 mg/kg/hr) adjunct reduces opioid needs." }
    ],
    pearls: ["Analgesia-first, then lightest sedation possible, daily delirium screening, early mobility", "Benzodiazepines cause MORE delirium and longer ventilation - avoid as first-line", "Daily paired SAT + SBT reduces ventilator days by 3 and ICU LOS by 4", "Hypoactive delirium is MORE common than hyperactive but often MISSED"],
    quiz: [
      { question: "Ventilated patient is restless, pulling at ETT. BPS 8, RASS +2. First intervention?", options: ["Increase propofol", "Administer IV fentanyl", "Apply restraints", "Administer midazolam"], correct: 1, rationale: "Analgesia-first: BPS >5 indicates pain, the most common cause of ICU agitation. Treat pain before increasing sedation." },
      { question: "Which sedation medication has the LOWEST ICU delirium incidence?", options: ["Midazolam", "Lorazepam", "Dexmedetomidine", "Diazepam"], correct: 2, rationale: "Dexmedetomidine has lowest delirium incidence through alpha-2 agonism rather than GABA pathways." }
    ]
  },
  "icu-fluid-electrolyte-management": {
    title: "ICU Fluid and Electrolyte Management",
    cellular: { title: "Fluid Physiology in Critical Illness", content: "Fluid management balances adequate resuscitation against fluid overload. Total body water is ~60% of body weight, distributed between intracellular (2/3) and extracellular (1/3) compartments. The Starling equation governs transcapillary fluid movement. In critical illness, inflammatory mediators increase capillary permeability causing third-spacing. Crystalloids distribute across the entire extracellular space (only 25% remains intravascular). Balanced crystalloids (LR, Plasma-Lyte) more closely match plasma and may cause less hyperchloremic acidosis than 0.9% NS." },
    riskFactors: ["Sepsis with capillary leak", "Hemorrhagic shock", "Burns with massive fluid shifts", "AKI with oliguria", "Heart failure", "ARDS with pulmonary edema", "Chronic liver disease", "Post-operative fluid shifts"],
    diagnostics: ["Strict I&O recording", "Daily weight (most reliable indicator)", "Serum electrolytes every 6-12 hours", "Serum/urine osmolality for hyponatremia workup", "BUN/Cr ratio: >20:1 suggests prerenal", "IVC ultrasound for volume status"],
    management: ["Phase-based: Rescue, Optimization, Stabilization, De-escalation", "Balanced crystalloids over NS for large volumes", "Replace electrolytes: K >4.0, Mg >2.0, Phos >3.0, Ca >8.5 for ICU", "Conservative fluid strategy in ARDS", "Diuretics for fluid overload when stable", "CRRT when diuretics ineffective"],
    nursingActions: ["Record all I&O hourly in acute settings", "Daily weight at same time, scale, conditions", "Monitor fluid overload: edema, JVD, crackles, increasing O2 needs", "Monitor dehydration: tachycardia, hypotension, decreased UO", "Replace electrolytes per protocols", "Assess total daily fluid including medication diluents"],
    signs: {
      left: ["Balanced I&O with stable weights", "Electrolytes WNL", "UO >0.5 mL/kg/hr", "Clear lungs, no edema", "Stable hemodynamics"],
      right: ["Fluid overload: weight gain >2 kg/day, pulmonary edema", "Hypovolemia: tachycardia, hypotension, oliguria", "Severe hyponatremia <125: seizures, cerebral edema", "Severe hyperkalemia >6.5: peaked T waves, widened QRS", "Severe hypocalcemia: tetany, Chvostek/Trousseau signs"]
    },
    medications: [
      { name: "Furosemide (Lasix)", type: "Loop diuretic", action: "Inhibits Na-K-2Cl cotransporter in ascending loop causing potent diuresis", sideEffects: "Hypokalemia, hyponatremia, ototoxicity", contra: "Anuria, severe hypovolemia", pearl: "IV onset 5 min. Double dose if inadequate response. Continuous infusion may be more effective in ICU." },
      { name: "3% Hypertonic Saline", type: "Concentrated sodium solution", action: "Raises serum osmolality to draw fluid from intracellular space", sideEffects: "Osmotic demyelination with too-rapid correction", contra: "Hypernatremia", pearl: "For severe symptomatic hyponatremia: 100-150 mL boluses. Max 8-10 mEq/L increase in 24 hours." }
    ],
    pearls: ["Fluid overload independently increases ICU mortality", "Daily weight more reliable than I&O", "Balanced crystalloids cause less hyperchloremic acidosis than NS (SMART trial)", "Correct hyponatremia SLOWLY: max 8-10 mEq/L per 24hr to prevent osmotic demyelination"],
    quiz: [
      { question: "ARDS patient 5L positive with increasing FiO2 needs. Priority intervention?", options: ["Continue maintenance fluids", "Fluid bolus", "Conservative fluid strategy with diuretics", "Increase PEEP only"], correct: 2, rationale: "FACTT trial: conservative fluid strategy in ARDS improves oxygenation and shortens ventilator days." },
      { question: "Sodium 118 with seizures. After 3% saline, max safe correction in 24 hours?", options: ["4-6 mEq/L", "8-10 mEq/L", "12-15 mEq/L", "20 mEq/L"], correct: 1, rationale: "Max 8-10 mEq/L in 24 hours to prevent osmotic demyelination syndrome." }
    ]
  },
  "icu-central-line-care": {
    title: "Central Venous Catheter Management",
    cellular: { title: "Central Venous Access", content: "CVCs provide reliable access for vasoactive medications, hypertonic solutions, TPN, and CVP monitoring. IJ is preferred for most ICU patients (lower pneumothorax risk than subclavian, lower infection risk than femoral). Subclavian has lowest infection rate but highest pneumothorax risk. Femoral has highest infection and DVT risk. Ultrasound guidance is standard of care. CLABSIs are a major preventable complication. The CVC tip should be at the cavoatrial junction, confirmed by CXR." },
    riskFactors: ["Need for vasopressors or inotropes", "TPN requirement", "Frequent blood sampling", "Lack of peripheral access", "CVP monitoring", "Hypertonic or vesicant solutions", "Hemodialysis access", "Large-volume resuscitation"],
    diagnostics: ["Post-insertion CXR for tip position and pneumothorax", "Daily line necessity assessment", "Blood cultures for CLABSI diagnosis", "CVP monitoring: normal 2-6 mmHg", "Catheter function: ability to aspirate and flush", "Ultrasound if thrombosis suspected"],
    management: ["Maximal sterile barrier precautions during insertion", "Chlorhexidine 2% skin preparation", "Ultrasound guidance for insertion", "Daily assessment of continued need", "CLABSI prevention bundle", "Replace tubing per protocol"],
    nursingActions: ["Hand hygiene before and after any CVC manipulation", "Scrub the hub 15 seconds before every access", "Assess insertion site every shift", "Change transparent dressings every 7 days", "Use chlorhexidine-impregnated sponge dressings", "Document lumen use, cap changes, site assessment"],
    signs: {
      left: ["Patent CVC with easy aspiration and flushing", "Site clean, dry, intact", "CVP waveform with appropriate morphology", "Dressing intact"],
      right: ["CLABSI: fever, chills, hypotension, site erythema/purulence", "Catheter occlusion", "Pneumothorax post-insertion", "Air embolism during manipulation", "CVC-related DVT: unilateral swelling"]
    },
    medications: [
      { name: "Chlorhexidine 2%/IPA", type: "Antiseptic", action: "Broad-spectrum antimicrobial with persistent bactericidal activity", sideEffects: "Skin irritation, rare anaphylaxis", contra: "Known allergy", pearl: "Superior to povidone-iodine for CLABSI prevention. Apply 30 seconds, dry 2 minutes." },
      { name: "Alteplase (Cathflo)", type: "Thrombolytic", action: "tPA dissolving fibrin clots causing CVC occlusion", sideEffects: "Bleeding", contra: "Active bleeding, recent surgery", pearl: "Instill 2 mg, dwell 30-120 minutes. May repeat once." }
    ],
    pearls: ["CLABSI bundle reduces infections by up to 70%", "Subclavian = lowest CLABSI, highest pneumothorax. Femoral = highest CLABSI.", "Air embolism: Trendelenburg + left lateral decubitus (Durant maneuver)", "Never advance a partially withdrawn catheter", "Paired cultures with differential time to positivity confirms catheter-related infection"],
    quiz: [
      { question: "During CVC removal, patient becomes suddenly dyspneic with tachycardia and hypotension. Priority action?", options: ["O2 and CXR", "Trendelenburg, left lateral decubitus, occlude site", "Elevate HOB and diuretics", "Pressure to site only"], correct: 1, rationale: "Venous air embolism: Trendelenburg + left lateral decubitus (Durant maneuver) traps air in RV apex." },
      { question: "Which CVC site has the lowest infection rate?", options: ["Internal jugular", "Subclavian", "Femoral", "PICC"], correct: 1, rationale: "Subclavian has lowest CLABSI rate but highest pneumothorax risk." }
    ]
  },
  "icu-abg-interpretation": {
    title: "Arterial Blood Gas Interpretation",
    cellular: { title: "Acid-Base Physiology", content: "ABG interpretation assesses oxygenation, ventilation, and acid-base status. The body maintains pH 7.35-7.45 through buffers (immediate), respiratory system (minutes-hours, adjusting CO2), and renal system (hours-days, adjusting HCO3). Primary disorders: respiratory acidosis (elevated CO2), respiratory alkalosis (decreased CO2), metabolic acidosis (decreased HCO3), metabolic alkalosis (elevated HCO3). The anion gap (Na - Cl - HCO3, normal 8-12) differentiates metabolic acidosis: elevated = acid accumulation (MUDPILES), normal = HCO3 loss." },
    riskFactors: ["Respiratory failure on ventilator", "Sepsis with lactic acidosis", "DKA", "Renal failure", "COPD with chronic respiratory acidosis", "Vomiting/NG suction causing metabolic alkalosis", "Over-diuresis causing contraction alkalosis", "Toxic ingestions"],
    diagnostics: ["Normal: pH 7.35-7.45, PaCO2 35-45, PaO2 80-100, HCO3 22-26, BE ±2", "Anion gap: Na - (Cl + HCO3), normal 8-12", "Delta-delta ratio for mixed disorders", "A-a gradient for hypoxemia workup", "P/F ratio for ARDS classification", "Lactate alongside ABG"],
    management: ["Respiratory acidosis: increase minute ventilation", "Respiratory alkalosis: decrease minute ventilation", "AG metabolic acidosis: treat underlying cause", "Metabolic alkalosis: replace Cl and K, consider acetazolamide", "Mixed disorders: treat each primary disorder", "Avoid rapid pH changes"],
    nursingActions: ["Modified Allen test before radial puncture", "Pre-heparinized syringe, expel air, transport on ice within 15 min", "Correlate ABG with clinical status and ventilator settings", "Adjust ventilator per orders", "Monitor symptoms of acid-base imbalance", "Document ABG results and corresponding settings"],
    signs: {
      left: ["pH 7.35-7.45 with compensated disorder", "PaO2 60-100 on minimal O2", "PaCO2 within target", "Normal or trending down lactate"],
      right: ["Severe acidosis pH <7.20: CV collapse risk", "Severe alkalosis pH >7.55: arrhythmia risk", "Uncompensated metabolic acidosis with rising AG", "Refractory respiratory acidosis despite max ventilator support"]
    },
    medications: [
      { name: "Sodium Bicarbonate", type: "Alkalinizing agent", action: "Directly provides bicarbonate to buffer metabolic acidosis", sideEffects: "Hypernatremia, paradoxical intracellular acidosis", contra: "Respiratory acidosis, metabolic alkalosis", pearl: "Controversial. Generally for pH <7.10 or specific toxicities. Does NOT improve outcomes in DKA or lactic acidosis." },
      { name: "Acetazolamide", type: "Carbonic anhydrase inhibitor", action: "Increases renal HCO3 excretion for metabolic alkalosis", sideEffects: "Metabolic acidosis, hypokalemia", contra: "Severe hyponatremia, sulfonamide allergy", pearl: "Useful for contraction alkalosis from loop diuretics." }
    ],
    pearls: ["Systematic approach: (1) pH, (2) Match CO2 or HCO3, (3) Check compensation, (4) Anion gap if metabolic acidosis", "MUDPILES: Methanol, Uremia, DKA, Propylene glycol, INH/Iron, Lactic acidosis, Ethylene glycol, Salicylates", "Normal A-a gradient = hypoventilation; elevated = V/Q mismatch or shunt", "VBG can screen: venous pH ~0.03-0.05 lower, venous PCO2 ~4-6 higher"],
    quiz: [
      { question: "pH 7.28, PaCO2 55, HCO3 25, PaO2 62. Acid-base disorder?", options: ["Metabolic acidosis", "Uncompensated respiratory acidosis", "Compensated respiratory alkalosis", "Mixed disorder"], correct: 1, rationale: "pH <7.35 = acidosis. CO2 elevated = respiratory cause. Normal HCO3 = no renal compensation yet = acute uncompensated respiratory acidosis." },
      { question: "DKA: pH 7.22, PaCO2 22, HCO3 10, Na 140, Cl 100. Anion gap?", options: ["12 (normal)", "30 (elevated)", "18 (mildly elevated)", "8 (low)"], correct: 1, rationale: "AG = 140 - (100+10) = 30. Significantly elevated from ketoacids." }
    ]
  }
};
