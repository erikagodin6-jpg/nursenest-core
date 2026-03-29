import type { LessonContent } from "./types";

export const rrtCardiacCriticalCareLessons: Record<string, LessonContent> = {
  "rrt-acid-base-ventilated": {
    title: "Advanced Acid-Base in Ventilated Patients",
    cellular: `Acid-base disturbances in mechanically ventilated patients are among the most complex clinical challenges respiratory therapists face. Unlike spontaneously breathing patients whose acid-base status reflects intrinsic physiology, ventilated patients have their CO2 elimination directly controlled by ventilator settings, creating a unique interplay between machine parameters and metabolic processes.

The Henderson-Hasselbalch equation (pH = 6.1 + log[HCO3-/(0.03 x PaCO2)]) remains the foundation of acid-base interpretation. In ventilated patients, the RT directly controls the denominator (PaCO2) through minute ventilation adjustments. Increasing respiratory rate or tidal volume lowers PaCO2, shifting pH upward. Decreasing minute ventilation raises PaCO2, shifting pH downward. This mechanical control means iatrogenic acid-base disturbances are common if ventilator settings are not carefully titrated.

Permissive hypercapnia is a deliberate strategy in lung-protective ventilation where PaCO2 is allowed to rise above normal (sometimes to 60-80 mmHg or higher) to avoid ventilator-induced lung injury from excessive tidal volumes or pressures. The resulting respiratory acidosis is generally well-tolerated if pH remains above 7.20-7.25, though some clinicians use sodium bicarbonate infusion for pH below 7.15. Contraindications to permissive hypercapnia include elevated intracranial pressure (CO2 is a potent cerebral vasodilator), severe pulmonary hypertension, and significant cardiac dysfunction.

Mixed acid-base disorders are common in critically ill ventilated patients. A patient with sepsis may have simultaneous metabolic acidosis (from lactic acid production) and respiratory alkalosis (from compensatory hyperventilation or ventilator settings). When mechanical ventilation is initiated, the respiratory compensation may be inadvertently removed if minute ventilation is set too low, unmasking severe metabolic acidosis. The Stewart approach to acid-base physiology uses strong ion difference (SID), total weak acid concentration (ATOT), and PaCO2 as independent variables determining pH. This approach is particularly useful in ICU patients with complex fluid and electrolyte disturbances.

The anion gap (AG = Na+ - Cl- - HCO3-) helps classify metabolic acidosis. An elevated anion gap (>12 mEq/L) suggests accumulation of unmeasured anions such as lactate (sepsis, shock), ketoacids (DKA), uremic toxins (renal failure), or toxic alcohols. Normal anion gap (hyperchloremic) metabolic acidosis occurs with excessive normal saline administration, renal tubular acidosis, or GI bicarbonate losses. The delta-delta ratio (change in AG / change in HCO3-) helps identify mixed metabolic disorders: a ratio >2 suggests concurrent metabolic alkalosis, while <1 suggests concurrent non-anion-gap metabolic acidosis.

Ventilator-induced metabolic alkalosis can occur when aggressive mechanical ventilation rapidly corrects chronic respiratory acidosis. In patients with chronic hypercapnia (COPD), the kidneys have compensated by retaining bicarbonate. If the ventilator rapidly normalizes PaCO2, the elevated bicarbonate persists, creating post-hypercapnic metabolic alkalosis. This can cause seizures, arrhythmias, and hemodynamic instability. The principle is to ventilate to the patient's baseline PaCO2, not to normal values.`,
    riskFactors: [
      "Chronic COPD with baseline CO2 retention and renal bicarbonate compensation",
      "Sepsis with lactic acidosis creating mixed acid-base disturbances",
      "Diabetic ketoacidosis with concurrent respiratory failure requiring ventilation",
      "Aggressive mechanical ventilation causing iatrogenic respiratory alkalosis",
      "Massive crystalloid resuscitation producing hyperchloremic metabolic acidosis",
      "Renal failure with impaired acid excretion and bicarbonate regeneration",
      "Permissive hypercapnia strategies in ARDS lung-protective ventilation",
      "Post-cardiac arrest with combined respiratory and metabolic acidosis"
    ],
    diagnostics: [
      "Serial arterial blood gas analysis every 2-4 hours or after ventilator changes",
      "Basic metabolic panel for electrolytes, bicarbonate, and anion gap calculation",
      "Serum lactate levels to assess tissue perfusion and anaerobic metabolism",
      "Delta-delta ratio to identify mixed metabolic disorders",
      "Strong ion difference calculation for complex ICU acid-base analysis",
      "End-tidal CO2 monitoring for trending PaCO2 between ABG draws",
      "Serum ketones in suspected diabetic or starvation ketoacidosis",
      "Urine electrolytes and pH for renal tubular acidosis evaluation"
    ],
    management: [
      "Adjust minute ventilation (rate x tidal volume) to target appropriate PaCO2 for patient's baseline",
      "Permissive hypercapnia with pH floor of 7.20 in lung-protective ventilation for ARDS",
      "Sodium bicarbonate infusion for severe metabolic acidosis with pH <7.15 refractory to ventilator optimization",
      "Gradual PaCO2 correction in chronic hypercapnia to prevent post-hypercapnic alkalosis",
      "Acetazolamide for metabolic alkalosis to increase renal bicarbonate excretion",
      "Balanced crystalloid (lactated Ringer's) over normal saline to avoid hyperchloremic acidosis",
      "Treat underlying cause: antibiotics for sepsis, insulin for DKA, dialysis for uremia",
      "THAM (tromethamine) as alternative buffer in patients with CO2 retention where bicarbonate is contraindicated"
    ],
    nursingActions: [
      "Calculate anion gap and delta-delta ratio on every metabolic panel to identify mixed disorders",
      "Correlate ETCO2 with PaCO2 to establish gradient and use capnography for continuous trending",
      "Document patient's baseline PaCO2 before initiating mechanical ventilation in COPD patients",
      "Monitor for post-hypercapnic alkalosis when ventilating chronically hypercapnic patients",
      "Assess ventilator settings immediately after any acid-base abnormality is identified on ABG",
      "Track lactate clearance as marker of resuscitation adequacy in sepsis and shock",
      "Communicate pH trends to medical team and recommend ventilator adjustments per protocol",
      "Recognize that respiratory compensation has limits: HCO3- does not rise above ~35 for chronic respiratory acidosis"
    ],
    signs: [
      "Respiratory acidosis: elevated PaCO2, decreased pH, compensatory bicarbonate elevation",
      "Respiratory alkalosis: decreased PaCO2, elevated pH, compensatory bicarbonate reduction",
      "Metabolic acidosis: decreased HCO3-, decreased pH, elevated anion gap if organic acid accumulation",
      "Metabolic alkalosis: elevated HCO3-, elevated pH, hypokalemia often concurrent",
      "Mixed disorder: pH near normal with markedly abnormal PaCO2 and HCO3- in same direction",
      "Post-hypercapnic alkalosis: normal PaCO2 with persistently elevated HCO3- after ventilator correction"
    ],
    medications: [
      { name: "Sodium Bicarbonate", dose: "1-2 mEq/kg IV push or infusion", route: "IV", purpose: "Buffer severe metabolic acidosis with pH <7.15; generates CO2 so ensure adequate ventilation" },
      { name: "Acetazolamide", dose: "250-500 mg IV q8-12h", route: "IV", purpose: "Carbonic anhydrase inhibitor promoting renal bicarbonate excretion for metabolic alkalosis" },
      { name: "THAM (Tromethamine)", dose: "0.3 M solution titrated to pH", route: "IV", purpose: "Non-bicarbonate buffer that does not generate CO2; useful in hypercapnic patients" },
      { name: "Potassium Chloride", dose: "10-40 mEq IV per hour (max)", route: "IV", purpose: "Correct hypokalemia which perpetuates metabolic alkalosis through renal mechanisms" }
    ],
    pearls: [
      "In COPD patients, always ventilate to the patient's baseline PaCO2 (often 50-60 mmHg), not to normal values of 35-45 mmHg",
      "The anion gap must be corrected for albumin: for every 1 g/dL decrease in albumin below 4, the expected AG decreases by 2.5 mEq/L",
      "Sodium bicarbonate generates CO2 as it buffers acid -- if ventilation is inadequate, it can worsen intracellular acidosis",
      "A rising lactate despite resuscitation indicates inadequate oxygen delivery or ongoing tissue ischemia",
      "Post-hypercapnic metabolic alkalosis can take 24-72 hours to resolve as the kidneys excrete excess bicarbonate"
    ],
    quiz: [
      { question: "A COPD patient with baseline PaCO2 of 55 mmHg is intubated. The ventilator is set to normalize PaCO2 to 40 mmHg. What complication is most likely?", options: ["Respiratory acidosis", "Post-hypercapnic metabolic alkalosis with potential seizures", "Hyperchloremic metabolic acidosis", "Worsening hypoxemia"], correct: 1, rationale: "Chronically hypercapnic patients have compensatory elevated bicarbonate. Rapidly lowering PaCO2 to normal unmasks this excess bicarbonate, causing severe metabolic alkalosis. This can trigger seizures, arrhythmias, and hemodynamic instability. Always ventilate to baseline PaCO2." },
      { question: "A ventilated sepsis patient has pH 7.18, PaCO2 28, HCO3- 10, Na 140, Cl 105. What is the anion gap and acid-base disorder?", options: ["AG 25, anion gap metabolic acidosis with appropriate respiratory compensation", "AG 15, normal anion gap metabolic acidosis", "AG 25, mixed respiratory and metabolic alkalosis", "AG 10, pure respiratory acidosis"], correct: 0, rationale: "AG = 140 - 105 - 10 = 25 (elevated). This is an anion gap metabolic acidosis (likely lactic acidosis from sepsis) with respiratory compensation (low PaCO2). Expected PaCO2 by Winter's formula = 1.5(10) + 8 ± 2 = 21-25, so PaCO2 of 28 suggests the respiratory compensation may be slightly inadequate." },
      { question: "What is the primary rationale for permissive hypercapnia in ARDS management?", options: ["To increase oxygen delivery to tissues", "To allow lung-protective tidal volumes (6 mL/kg IBW) while accepting elevated PaCO2", "To correct metabolic alkalosis", "To reduce cardiac output and decrease pulmonary blood flow"], correct: 1, rationale: "Permissive hypercapnia accepts elevated PaCO2 and mild acidosis to enable lung-protective ventilation with low tidal volumes (6 mL/kg IBW) and limited plateau pressures (<30 cmH2O). This strategy reduces ventilator-induced lung injury, which has a greater impact on outcomes than normalizing PaCO2." },
      { question: "A patient receiving large-volume normal saline resuscitation develops pH 7.28, PaCO2 35, HCO3- 16, AG 12. What type of acidosis is present?", options: ["Anion gap metabolic acidosis from lactic acid", "Normal anion gap (hyperchloremic) metabolic acidosis from saline administration", "Respiratory acidosis from hypoventilation", "Mixed anion gap and non-anion gap metabolic acidosis"], correct: 1, rationale: "Normal anion gap (AG 12) with low bicarbonate and low pH indicates non-anion-gap metabolic acidosis. Large-volume normal saline (0.9% NaCl) contains supraphysiologic chloride (154 mEq/L vs plasma 100-106), causing hyperchloremic metabolic acidosis. Balanced crystalloids like lactated Ringer's reduce this risk." }
    ]
  },

  "rrt-hemodynamic-interpretation": {
    title: "Hemodynamic Parameter Interpretation for RTs",
    cellular: `Respiratory therapists working in critical care must understand hemodynamic monitoring to optimize ventilator management and assess the cardiopulmonary interaction. Mechanical ventilation profoundly affects hemodynamics, and hemodynamic status directly influences respiratory function. This bidirectional relationship makes hemodynamic literacy essential for RTs.

The pulmonary artery catheter (Swan-Ganz catheter) provides direct measurement of right atrial pressure (RAP/CVP), pulmonary artery pressure (PAP), pulmonary artery wedge pressure (PAWP), and cardiac output (CO). From these measurements, calculated parameters include cardiac index (CI = CO/BSA), systemic vascular resistance (SVR = [MAP - CVP] x 80 / CO), pulmonary vascular resistance (PVR = [mPAP - PAWP] x 80 / CO), and stroke volume (SV = CO / HR). Normal values: CVP 2-8 mmHg, PAP 20-30/8-15 mmHg (mean 10-20), PAWP 6-12 mmHg, CO 4-8 L/min, CI 2.5-4.0 L/min/m², SVR 800-1200 dynes·sec/cm⁵, PVR 100-250 dynes·sec/cm⁵.

Central venous pressure (CVP) reflects right ventricular preload and is measured at the junction of the superior vena cava and right atrium. While CVP alone is a poor predictor of fluid responsiveness, trends in CVP combined with clinical assessment remain useful. Elevated CVP suggests right heart failure, fluid overload, cardiac tamponade, tension pneumothorax, or excessive PEEP. Low CVP suggests hypovolemia or vasodilation.

The PAWP approximates left atrial pressure and left ventricular end-diastolic pressure when the mitral valve is open and there is no pulmonary vascular obstruction. Elevated PAWP (>18 mmHg) suggests left ventricular failure, mitral stenosis, or fluid overload. The distinction between cardiogenic pulmonary edema (PAWP >18) and ARDS (PAWP <18) is a critical differentiation for RT management. In ARDS, the pulmonary edema is due to increased permeability rather than hydrostatic pressure.

Mixed venous oxygen saturation (SvO2), measured from the distal port of the PA catheter, reflects the balance between oxygen delivery and consumption. Normal SvO2 is 60-80%. Values below 60% indicate either decreased oxygen delivery (low CO, anemia, hypoxemia) or increased oxygen consumption (fever, sepsis, shivering). Values above 80% may indicate sepsis-related mitochondrial dysfunction (inability to extract oxygen), left-to-right cardiac shunt, or wedged catheter artifact.

Pulse pressure variation (PPV) and stroke volume variation (SVV) are dynamic indicators of fluid responsiveness in mechanically ventilated patients. During positive pressure inspiration, intrathoracic pressure increases, transiently increasing LV preload (by squeezing blood from pulmonary vasculature) while decreasing RV preload. This creates cyclical variations in stroke volume and arterial pressure. PPV >13% or SVV >13% suggests the patient is on the ascending limb of the Frank-Starling curve and is likely to respond to fluid administration. These indices are only valid in patients who are fully mechanically ventilated (no spontaneous efforts), in sinus rhythm, and receiving tidal volumes of at least 8 mL/kg.

The oxygen delivery equation (DO2 = CO x CaO2 x 10) connects hemodynamic and respiratory parameters. Normal DO2 is 800-1200 mL/min. Oxygen consumption (VO2) is normally 200-250 mL/min, yielding an extraction ratio of approximately 25%. The RT must understand that oxygen delivery depends not only on respiratory parameters (PaO2, SaO2, FiO2) but also on cardiac output and hemoglobin -- optimizing ventilator settings without addressing a low cardiac output or severe anemia will not improve tissue oxygenation.`,
    riskFactors: [
      "Positive pressure ventilation reducing venous return and cardiac output especially with high PEEP",
      "Right ventricular failure from acute pulmonary hypertension in ARDS",
      "Septic shock with distributive hemodynamic profile and impaired oxygen extraction",
      "Cardiac tamponade from pericardial effusion causing equalization of diastolic pressures",
      "Tension pneumothorax causing acute hemodynamic collapse from mediastinal shift",
      "Auto-PEEP (breath stacking) in obstructive lung disease impeding venous return",
      "Massive pulmonary embolism causing acute right heart failure and hemodynamic instability",
      "Severe anemia reducing oxygen-carrying capacity despite adequate cardiac output"
    ],
    diagnostics: [
      "Pulmonary artery catheter for direct hemodynamic measurements (CVP, PAP, PAWP, CO, SvO2)",
      "Arterial line for continuous blood pressure monitoring and waveform analysis",
      "Pulse pressure variation and stroke volume variation from arterial waveform analysis",
      "Echocardiography for non-invasive assessment of cardiac function and fluid status",
      "Point-of-care ultrasound for IVC diameter and collapsibility index",
      "Lactate levels as surrogate marker of tissue perfusion adequacy",
      "Central venous oxygen saturation (ScvO2) from central line as SvO2 surrogate",
      "Passive leg raise test for non-invasive assessment of fluid responsiveness"
    ],
    management: [
      "Optimize PEEP to balance alveolar recruitment against hemodynamic compromise from reduced venous return",
      "Fluid resuscitation guided by dynamic indicators (PPV, SVV, passive leg raise) rather than static pressures alone",
      "Vasopressor support (norepinephrine first-line) for distributive shock to restore SVR",
      "Inotropic support (dobutamine, milrinone) for cardiogenic shock with reduced contractility",
      "Reduce tidal volume and PEEP if auto-PEEP is contributing to hemodynamic instability",
      "Prone positioning in ARDS improves V/Q matching while often improving hemodynamics",
      "Inhaled pulmonary vasodilators (nitric oxide, epoprostenol) for RV failure from pulmonary hypertension",
      "Blood transfusion to hemoglobin >7 g/dL (>10 g/dL in active cardiac ischemia) to maintain oxygen delivery"
    ],
    nursingActions: [
      "Zero and level transducers at the phlebostatic axis (4th intercostal space, mid-axillary line) every shift",
      "Obtain hemodynamic readings at end-expiration to minimize ventilator-induced pressure artifacts",
      "Calculate SVR and PVR after each cardiac output measurement to assess vascular tone",
      "Monitor SvO2 trends continuously and correlate with changes in ventilator settings or hemodynamic support",
      "Assess the impact of PEEP changes on cardiac output -- PEEP titration should include hemodynamic monitoring",
      "Calculate oxygen delivery (DO2) incorporating both respiratory and hemodynamic parameters",
      "Document pulse pressure variation during volume status assessment in mechanically ventilated patients",
      "Recognize that high PEEP can falsely elevate CVP and PAWP readings requiring clinical correlation"
    ],
    signs: [
      "Cardiogenic shock: elevated PAWP, elevated CVP, decreased CO/CI, elevated SVR, decreased SvO2",
      "Distributive (septic) shock: decreased SVR, increased CO (hyperdynamic phase), low PAWP, decreased SvO2 or paradoxically elevated SvO2",
      "Hypovolemic shock: decreased CVP, decreased PAWP, decreased CO, elevated SVR, decreased SvO2",
      "Obstructive shock (PE/tamponade): elevated CVP, elevated PAP (PE) or equalized diastolic pressures (tamponade), decreased CO",
      "Right ventricular failure: elevated CVP with normal or low PAWP, elevated PVR",
      "Fluid responsiveness indicated by PPV >13% or positive passive leg raise test"
    ],
    medications: [
      { name: "Norepinephrine", dose: "0.01-3 mcg/kg/min", route: "IV continuous infusion", purpose: "First-line vasopressor for distributive shock; alpha-1 agonist increases SVR with mild beta-1 inotropic effect" },
      { name: "Dobutamine", dose: "2-20 mcg/kg/min", route: "IV continuous infusion", purpose: "Beta-1 agonist inotrope for cardiogenic shock; increases contractility and CO but may decrease SVR" },
      { name: "Vasopressin", dose: "0.01-0.04 units/min", route: "IV continuous infusion", purpose: "Non-catecholamine vasopressor added to norepinephrine in refractory septic shock" },
      { name: "Milrinone", dose: "0.375-0.75 mcg/kg/min", route: "IV continuous infusion", purpose: "Phosphodiesterase III inhibitor providing inotropy and vasodilation; useful in RV failure with pulmonary hypertension" }
    ],
    pearls: [
      "Always read hemodynamic pressures at end-expiration -- positive pressure ventilation artificially elevates intrathoracic pressures during inspiration",
      "PEEP directly adds to measured PAWP; subtract approximately 50% of PEEP from measured PAWP for transmural estimate",
      "SvO2 below 60% is a critical warning of inadequate oxygen delivery -- assess CO, hemoglobin, and SaO2 simultaneously",
      "PPV and SVV are only valid in fully controlled mechanical ventilation with no spontaneous breathing efforts and sinus rhythm",
      "Auto-PEEP can mimic cardiac tamponade hemodynamically -- always check for breath stacking in obstructive patients before assuming cardiac pathology"
    ],
    quiz: [
      { question: "A mechanically ventilated patient has CVP 18, PAP 55/30, PAWP 10, CO 3.2 L/min. What is the most likely diagnosis?", options: ["Left ventricular failure", "Acute right ventricular failure with pulmonary hypertension", "Hypovolemic shock", "Septic shock"], correct: 1, rationale: "The hemodynamic profile shows elevated CVP (18) and PAP (55/30) with normal PAWP (10) and decreased CO (3.2). This is classic for right ventricular failure with pulmonary hypertension -- the right ventricle is failing against elevated pulmonary pressures while the left heart is not volume overloaded." },
      { question: "How does positive pressure ventilation affect venous return and cardiac output?", options: ["Increases venous return and cardiac output", "Decreases venous return which may decrease cardiac output, especially with high PEEP", "Has no effect on hemodynamics", "Increases venous return but decreases cardiac output"], correct: 1, rationale: "Positive pressure ventilation increases intrathoracic pressure, which reduces the pressure gradient for venous return to the right heart. This is exacerbated by high PEEP levels. The reduced RV preload can lead to decreased RV stroke volume and subsequently decreased LV output and systemic cardiac output." },
      { question: "A ventilated patient in septic shock has SvO2 of 82%. What does this suggest?", options: ["Adequate oxygen delivery", "Impaired cellular oxygen extraction (mitochondrial dysfunction)", "Left-to-right cardiac shunt", "Hypothermia reducing oxygen demand"], correct: 1, rationale: "In septic shock, SvO2 >80% often reflects impaired mitochondrial oxygen utilization (cytopathic hypoxia). Despite adequate oxygen delivery, the cells cannot extract and use oxygen. This is a concerning finding indicating severe sepsis-related metabolic derangement despite apparently adequate hemodynamics." },
      { question: "A patient has pulse pressure variation of 18% during controlled mechanical ventilation. What does this indicate?", options: ["The patient is fluid overloaded", "The patient is likely fluid responsive and may benefit from volume administration", "The ventilator settings are causing auto-PEEP", "The patient has cardiac tamponade"], correct: 1, rationale: "PPV >13% in a fully mechanically ventilated patient in sinus rhythm suggests the patient is on the steep portion of the Frank-Starling curve and is likely to increase cardiac output with fluid administration. This is a dynamic indicator of fluid responsiveness superior to static pressures like CVP alone." }
    ]
  },

  "rrt-shock-recognition": {
    title: "Shock Recognition & Respiratory Support",
    cellular: `Shock is a state of circulatory failure resulting in inadequate tissue oxygen delivery to meet metabolic demands. For respiratory therapists, understanding the four categories of shock -- distributive, cardiogenic, hypovolemic, and obstructive -- is essential because each type requires different ventilatory strategies and has distinct implications for respiratory management.

Distributive shock, the most common form in ICUs (primarily septic shock), is characterized by pathological vasodilation leading to decreased systemic vascular resistance. In sepsis, bacterial endotoxins and inflammatory mediators (TNF-alpha, IL-1, IL-6, nitric oxide) cause widespread endothelial dysfunction, capillary leak, and vasodilation. The hemodynamic profile shows decreased SVR, initially increased cardiac output (hyperdynamic phase), and decreased oxygen extraction despite adequate delivery (SvO2 often paradoxically elevated). Sepsis frequently causes ARDS through inflammatory-mediated alveolar-capillary membrane damage, creating a dual cardiopulmonary crisis.

Cardiogenic shock results from pump failure, most commonly from acute myocardial infarction affecting >40% of left ventricular myocardium. The hemodynamic profile shows elevated PAWP, decreased CO/CI, elevated SVR (compensatory vasoconstriction), and decreased SvO2. Pulmonary edema develops from elevated left atrial pressures transmitted to the pulmonary vasculature. The RT must recognize that the ventilatory approach differs fundamentally from ARDS: while both present with pulmonary edema and hypoxemia, cardiogenic pulmonary edema responds to preload and afterload reduction rather than lung-protective ventilation alone.

Hypovolemic shock results from decreased circulating volume (hemorrhage, dehydration, third-spacing). Compensatory mechanisms include tachycardia, vasoconstriction, and increased respiratory rate. The hemodynamic profile shows decreased CVP, decreased PAWP, decreased CO, and elevated SVR. Class I hemorrhage (<15% blood volume loss) may have minimal hemodynamic changes. Class IV hemorrhage (>40% loss) presents with profound hypotension, tachycardia, altered mental status, and negligible urine output.

Obstructive shock results from mechanical impedance to cardiac filling or ejection. Causes include tension pneumothorax, cardiac tamponade, massive pulmonary embolism, and severe auto-PEEP. The RT has a critical role in recognizing and managing tension pneumothorax and auto-PEEP. Tension pneumothorax presents with sudden hemodynamic collapse, absent breath sounds on the affected side, tracheal deviation, and jugular venous distension. Auto-PEEP in ventilated patients with obstructive disease can create a physiological equivalent of obstructive shock by impeding venous return.

The respiratory support strategy must be tailored to the shock type. In distributive shock, early intubation may be necessary to reduce oxygen consumption from respiratory muscle work (which can consume 20-30% of CO in respiratory distress). In cardiogenic shock, non-invasive positive pressure ventilation (CPAP/BiPAP) reduces preload and afterload while improving oxygenation, potentially avoiding intubation. Positive pressure ventilation actually benefits the failing left ventricle by reducing transmural pressure and afterload. In hypovolemic shock, aggressive positive pressure ventilation before volume resuscitation can cause cardiovascular collapse by further impeding venous return to an already depleted vascular system.`,
    riskFactors: [
      "Sepsis as the leading cause of distributive shock in ICU patients",
      "Acute myocardial infarction causing cardiogenic shock from pump failure",
      "Massive hemorrhage from trauma, GI bleeding, or surgical complications",
      "Tension pneumothorax from barotrauma in mechanically ventilated patients",
      "Massive pulmonary embolism causing obstructive shock with RV failure",
      "Auto-PEEP from severe bronchospasm or inadequate expiratory time on ventilator",
      "Anaphylaxis causing distributive shock with bronchospasm and airway edema",
      "Cardiac tamponade from pericardial effusion or post-cardiac surgery"
    ],
    diagnostics: [
      "Serum lactate levels: >2 mmol/L indicates tissue hypoperfusion, serial levels track resuscitation adequacy",
      "Arterial blood gas for acid-base status, oxygenation, and ventilation assessment",
      "Point-of-care echocardiography for rapid cardiac function and tamponade assessment",
      "Chest X-ray for pneumothorax, pulmonary edema, or mediastinal shift",
      "Central venous or mixed venous oxygen saturation for oxygen delivery-consumption balance",
      "Hemoglobin and hematocrit for hemorrhagic shock assessment",
      "Blood cultures and procalcitonin for sepsis workup",
      "CT pulmonary angiography for suspected massive pulmonary embolism"
    ],
    management: [
      "Distributive shock: volume resuscitation 30 mL/kg crystalloid, vasopressors (norepinephrine), source control, antibiotics within 1 hour",
      "Cardiogenic shock: inotropes (dobutamine), mechanical circulatory support (IABP, Impella), avoid excessive fluid, consider NIPPV",
      "Hypovolemic shock: aggressive volume resuscitation, blood products for hemorrhage, minimize positive pressure until volume restored",
      "Obstructive shock: immediate cause removal -- needle decompression for tension pneumothorax, disconnecting ventilator for auto-PEEP",
      "Lung-protective ventilation if ARDS develops secondary to shock (Vt 6 mL/kg IBW, Pplat <30 cmH2O)",
      "Prone positioning for refractory hypoxemia in sepsis-related ARDS",
      "ECMO consideration for refractory cardiogenic shock or severe ARDS with hemodynamic instability",
      "Targeted temperature management post-cardiac arrest from shock-related arrhythmia"
    ],
    nursingActions: [
      "Perform rapid cardiopulmonary assessment when shock is suspected: breath sounds, JVD, tracheal position, pulse quality",
      "Immediately disconnect the ventilator and assess for auto-PEEP in obstructive shock presentation",
      "Reduce PEEP cautiously in hemodynamically unstable patients to minimize cardiac output compromise",
      "Calculate oxygen delivery (DO2) incorporating cardiac output, hemoglobin, and oxygen saturation",
      "Monitor peak and plateau pressures for sudden increases suggesting tension pneumothorax",
      "Assess ventilator waveforms for flow not returning to zero baseline (auto-PEEP indicator)",
      "Collaborate with medical team on titrating PEEP to balance oxygenation with hemodynamic stability",
      "Prepare for emergency procedures: needle decompression kit, chest tube tray, intubation equipment"
    ],
    signs: [
      "Hypotension (MAP <65 mmHg) with tachycardia and altered mental status across all shock types",
      "Distributive: warm, flushed skin (warm shock) progressing to cool, mottled skin (cold shock)",
      "Cardiogenic: jugular venous distension, pulmonary crackles, S3 gallop, peripheral edema",
      "Hypovolemic: flat neck veins, dry mucous membranes, poor skin turgor, tachycardia",
      "Obstructive (tension pneumothorax): absent breath sounds, tracheal deviation, JVD, sudden desaturation",
      "Elevated lactate (>4 mmol/L) indicating severe tissue hypoperfusion regardless of shock type"
    ],
    medications: [
      { name: "Norepinephrine", dose: "0.01-3 mcg/kg/min", route: "IV continuous infusion", purpose: "First-line vasopressor for septic shock; restores SVR through alpha-1 agonism" },
      { name: "Epinephrine", dose: "0.01-0.5 mcg/kg/min", route: "IV continuous infusion", purpose: "Combined alpha and beta agonist for anaphylactic shock or refractory septic shock" },
      { name: "Dobutamine", dose: "2-20 mcg/kg/min", route: "IV continuous infusion", purpose: "Beta-1 inotrope for cardiogenic shock; increases contractility and cardiac output" },
      { name: "Hydrocortisone", dose: "200 mg/day IV (50 mg q6h)", route: "IV", purpose: "Stress-dose steroids for vasopressor-refractory septic shock" }
    ],
    pearls: [
      "In tension pneumothorax, do NOT wait for chest X-ray -- perform needle decompression immediately based on clinical findings",
      "Auto-PEEP is the RT's obstructive shock -- disconnect the ventilator briefly and observe for hemodynamic improvement as trapped air escapes",
      "Positive pressure ventilation HELPS cardiogenic shock by reducing LV afterload, but WORSENS hypovolemic shock by reducing venous return",
      "Lactate clearance >10% in the first 6 hours of resuscitation is associated with improved survival in septic shock",
      "The mnemonic for obstructive shock causes: T-TIP (Tension pneumothorax, Tamponade, Intracardiac obstruction, Pulmonary embolism)"
    ],
    quiz: [
      { question: "A ventilated COPD patient suddenly develops hypotension, tachycardia, and elevated peak pressures with absent breath sounds on the right. What should the RT do FIRST?", options: ["Obtain a chest X-ray", "Increase FiO2 to 100%", "Disconnect the patient from the ventilator to assess for auto-PEEP and tension pneumothorax", "Administer a fluid bolus"], correct: 2, rationale: "The presentation suggests either tension pneumothorax or auto-PEEP, both causing obstructive shock. Disconnecting the ventilator allows trapped air to escape if auto-PEEP is the cause and provides immediate clinical differentiation. If hemodynamics don't improve, tension pneumothorax requiring needle decompression is likely. This takes seconds and should precede imaging." },
      { question: "Why does positive pressure ventilation benefit patients in cardiogenic shock but potentially harm patients in hypovolemic shock?", options: ["It increases FiO2 delivery which helps cardiogenic but not hypovolemic shock", "PPV reduces LV afterload (benefits cardiogenic) but reduces venous return (worsens hypovolemic)", "PPV increases hemoglobin oxygen saturation only in cardiogenic shock", "There is no difference; PPV benefits all shock types equally"], correct: 1, rationale: "Positive pressure ventilation increases intrathoracic pressure, which reduces LV transmural pressure and effectively decreases afterload -- beneficial in cardiogenic shock where the failing LV struggles against high afterload. However, the same increased intrathoracic pressure impedes venous return, which is devastating in hypovolemic shock where the vascular system is already underfilled." },
      { question: "A septic shock patient has SvO2 of 78%, lactate of 6.2 mmol/L. How should the RT interpret these findings?", options: ["Adequate oxygen delivery with no intervention needed", "Normal oxygen extraction ratio indicating resolved shock", "Impaired cellular oxygen extraction despite seemingly adequate delivery (cytopathic hypoxia)", "Equipment malfunction requiring recalibration"], correct: 2, rationale: "In sepsis, elevated lactate with normal or high SvO2 indicates cytopathic hypoxia -- mitochondrial dysfunction preventing cells from extracting and utilizing delivered oxygen. This explains why SvO2 remains high (oxygen returns unused to venous circulation) while lactate rises from anaerobic metabolism due to mitochondrial failure." }
    ]
  },

  "rrt-congenital-cardiac-neonatal": {
    title: "Congenital Cardiac Awareness for Neonatal/Peds RT",
    cellular: `Congenital heart defects (CHDs) affect approximately 1% of all live births and are the most common category of birth defects. Respiratory therapists working in neonatal and pediatric intensive care must understand these lesions because they profoundly affect cardiopulmonary physiology, oxygenation, and ventilatory management. The interplay between cardiac anatomy, pulmonary blood flow, and oxygen delivery determines how the RT approaches gas exchange optimization.

CHDs are broadly classified by the effect on pulmonary blood flow and the presence or absence of cyanosis. Acyanotic defects with increased pulmonary blood flow include ventricular septal defect (VSD), atrial septal defect (ASD), patent ductus arteriosus (PDA), and atrioventricular canal defects. These left-to-right shunt lesions allow oxygenated blood to recirculate through the pulmonary vasculature, causing volume overload to the right heart and lungs. Symptoms include tachypnea, poor feeding, failure to thrive, and recurrent respiratory infections from pulmonary overcirculation.

Cyanotic defects with decreased pulmonary blood flow include tetralogy of Fallot (TOF), tricuspid atresia, and pulmonary atresia. In these lesions, blood is shunted right-to-left, bypassing the lungs, resulting in systemic desaturation. Tetralogy of Fallot -- the most common cyanotic CHD -- consists of VSD, overriding aorta, right ventricular outflow tract obstruction, and RV hypertrophy. Tet spells (hypercyanotic episodes) occur when infundibular spasm transiently increases right-to-left shunting, causing profound desaturation.

Cyanotic defects with increased pulmonary blood flow include transposition of the great arteries (TGA), truncus arteriosus, and total anomalous pulmonary venous return (TAPVR). In d-TGA, the aorta arises from the RV and the pulmonary artery from the LV, creating two parallel circuits. Survival depends on mixing of blood through a PDA, ASD, or VSD. These neonates present with severe cyanosis unresponsive to supplemental oxygen (failed hyperoxia test).

The hyperoxia test is a critical diagnostic tool for RTs. The neonate is placed on 100% FiO2 for 10-15 minutes, and a post-ductal ABG is obtained. If PaO2 rises above 150-200 mmHg, the cyanosis is likely pulmonary in origin. If PaO2 remains below 100 mmHg despite 100% FiO2, a cyanotic CHD or persistent pulmonary hypertension of the newborn (PPHN) is suspected. This test helps differentiate cardiac from pulmonary causes of neonatal cyanosis.

Prostaglandin E1 (PGE1/alprostadil) is a life-saving medication for ductal-dependent lesions. Many critical CHDs depend on the patent ductus arteriosus for either pulmonary blood flow (pulmonary atresia, critical pulmonic stenosis, tricuspid atresia) or systemic blood flow (hypoplastic left heart syndrome, critical coarctation, interrupted aortic arch). PGE1 maintains ductal patency until surgical intervention. The RT must be prepared for apnea, a common side effect of PGE1, often requiring intubation and mechanical ventilation.

Ventilatory management in CHDs requires understanding the balance between pulmonary and systemic blood flow (Qp:Qs ratio). In left-to-right shunt lesions, lowering PVR (with supplemental O2 or hyperventilation) will increase pulmonary blood flow and worsen pulmonary overcirculation. Conversely, in right-to-left shunt lesions, lowering PVR improves pulmonary blood flow and reduces cyanosis. For single-ventricle physiology (such as hypoplastic left heart syndrome post-Norwood procedure), the goal is balanced circulation with Qp:Qs approximately 1:1, achieved by targeting SpO2 of 75-85% and accepting mild hypoxemia.`,
    riskFactors: [
      "Maternal diabetes increasing risk of CHDs including TGA and VSD",
      "Maternal rubella infection during first trimester causing PDA and pulmonary stenosis",
      "Fetal alcohol syndrome associated with VSD and ASD",
      "Chromosomal abnormalities: Down syndrome (AVSD), Turner syndrome (coarctation), DiGeorge (truncus arteriosus)",
      "Family history of CHDs increasing recurrence risk to 3-5%",
      "Maternal medications (lithium, isotretinoin, valproic acid, certain SSRIs)",
      "Prematurity increasing risk of PDA from immature ductal smooth muscle",
      "Advanced maternal age associated with increased chromosomal abnormality risk"
    ],
    diagnostics: [
      "Hyperoxia test: PaO2 response to 100% FiO2 differentiating cardiac from pulmonary cyanosis",
      "Pre- and post-ductal SpO2 screening: >3% difference suggests ductal-dependent lesion or coarctation",
      "Echocardiography as definitive non-invasive diagnostic tool for cardiac anatomy",
      "Chest X-ray assessing heart size, pulmonary vascularity (increased or decreased), and rib notching",
      "Electrocardiogram for chamber hypertrophy, axis deviation, and rhythm abnormalities",
      "Cardiac catheterization for hemodynamic assessment and interventional procedures",
      "Fetal echocardiography for prenatal detection enabling delivery planning",
      "CT angiography or cardiac MRI for complex anatomical delineation"
    ],
    management: [
      "Prostaglandin E1 (0.01-0.1 mcg/kg/min) for ductal-dependent lesions to maintain PDA patency",
      "Emergent balloon atrial septostomy (Rashkind procedure) for d-TGA to improve atrial mixing",
      "Inhaled nitric oxide (5-20 ppm) for PPHN to selectively reduce pulmonary vascular resistance",
      "Targeted SpO2 of 75-85% in single-ventricle physiology to balance Qp:Qs",
      "Avoid supplemental oxygen in balanced circulation lesions as it decreases PVR and overcirculates the lungs",
      "Surgical correction: arterial switch operation for TGA, complete repair for TOF, Norwood procedure for HLHS",
      "Mechanical ventilation with controlled FiO2 and mild hypercapnia to balance pulmonary and systemic flow",
      "ECMO as bridge to surgery or recovery in refractory neonatal cardiac failure"
    ],
    nursingActions: [
      "Perform and interpret the hyperoxia test for all neonates with unexplained cyanosis",
      "Monitor pre- and post-ductal SpO2 simultaneously to detect ductal-dependent shunting",
      "Prepare intubation equipment when PGE1 is initiated due to high risk of apnea",
      "Avoid excessive FiO2 in balanced circulation lesions as it increases pulmonary blood flow",
      "Maintain target SpO2 of 75-85% in single-ventricle physiology (resist urge to increase O2 to normalize SpO2)",
      "Assess for tet spells in TOF patients: knee-to-chest positioning, calm environment, oxygen, morphine",
      "Monitor exhaled CO2 and ventilator waveforms for appropriate ventilation in complex cardiac anatomy",
      "Coordinate with cardiology regarding target SpO2 and ventilator parameter goals for each specific lesion"
    ],
    signs: [
      "Central cyanosis unresponsive to supplemental oxygen (cyanotic CHD vs PPHN)",
      "Tachypnea without significant retractions (cardiac tachypnea from increased pulmonary blood flow)",
      "Heart murmur on auscultation varying by lesion type and severity",
      "Differential cyanosis: lower body cyanotic with pink upper body suggesting coarctation with PDA",
      "Poor feeding, diaphoresis with feeding, and failure to thrive from increased metabolic demand",
      "Tet spells: sudden onset of hyperpnea, deepening cyanosis, irritability progressing to syncope"
    ],
    medications: [
      { name: "Prostaglandin E1 (Alprostadil)", dose: "0.01-0.1 mcg/kg/min IV", route: "IV continuous infusion", purpose: "Maintains patent ductus arteriosus in ductal-dependent lesions; causes apnea requiring ventilatory support" },
      { name: "Inhaled Nitric Oxide", dose: "5-20 ppm via ventilator circuit", route: "Inhaled", purpose: "Selective pulmonary vasodilator for PPHN; reduces PVR without systemic hypotension" },
      { name: "Morphine Sulfate", dose: "0.05-0.1 mg/kg IV", route: "IV", purpose: "Management of tet spells by reducing infundibular spasm and decreasing oxygen consumption" },
      { name: "Indomethacin", dose: "0.1-0.25 mg/kg IV q12-24h x 3 doses", route: "IV", purpose: "Prostaglandin inhibitor promoting PDA closure in premature neonates with hemodynamically significant PDA" }
    ],
    pearls: [
      "If a neonate's SpO2 does not improve with 100% FiO2, think cardiac not pulmonary -- perform hyperoxia test and notify cardiology",
      "PGE1 causes apnea in 10-12% of neonates -- always have intubation equipment at bedside when starting this infusion",
      "In single-ventricle physiology, SpO2 of 80% is the TARGET, not a problem to fix -- excessive oxygen disrupts balanced circulation",
      "Pre- and post-ductal SpO2 difference >3% should trigger immediate cardiology evaluation",
      "Knee-to-chest positioning during tet spells increases systemic vascular resistance, reducing right-to-left shunting and improving pulmonary blood flow"
    ],
    quiz: [
      { question: "A term neonate has SpO2 of 65% on room air. After 15 minutes on 100% FiO2, PaO2 is 42 mmHg. What does this indicate?", options: ["Respiratory distress syndrome responding to oxygen", "Cyanotic congenital heart disease or persistent pulmonary hypertension", "Normal transitional physiology", "Equipment malfunction"], correct: 1, rationale: "A PaO2 <100 mmHg despite 100% FiO2 (failed hyperoxia test) indicates cyanosis from a cardiac cause (right-to-left shunt in cyanotic CHD) or persistent pulmonary hypertension. Pulmonary causes of cyanosis typically respond to supplemental oxygen with PaO2 rising above 150-200 mmHg." },
      { question: "A neonate with hypoplastic left heart syndrome post-Norwood has SpO2 of 92%. The RT should:", options: ["Continue current management as this is optimal", "Increase FiO2 to achieve SpO2 >95%", "Alert the team that SpO2 is too high, suggesting excessive pulmonary blood flow", "Administer inhaled nitric oxide to further improve oxygenation"], correct: 2, rationale: "In single-ventricle physiology (post-Norwood HLHS), target SpO2 is 75-85%. SpO2 of 92% indicates excessive pulmonary blood flow (Qp:Qs >1) at the expense of systemic perfusion. This puts the patient at risk for systemic hypoperfusion and metabolic acidosis. FiO2 should be reduced, and mild hypercapnia may be used to increase PVR." },
      { question: "Why does the RT prepare intubation equipment when prostaglandin E1 is initiated?", options: ["PGE1 causes bronchospasm requiring emergency airway management", "PGE1 causes apnea in 10-12% of neonates as a known side effect", "PGE1 causes laryngeal edema", "PGE1 increases oxygen demand requiring mechanical ventilation"], correct: 1, rationale: "Apnea is a well-documented side effect of PGE1, occurring in 10-12% of neonates. This is particularly common at higher doses and in premature neonates. The RT must have intubation equipment immediately available and be prepared to provide mechanical ventilation when PGE1 is initiated for ductal-dependent congenital heart lesions." },
      { question: "An infant with tetralogy of Fallot becomes deeply cyanotic and hyperpneic. What is the RT's immediate action?", options: ["Administer 100% FiO2 via non-rebreather mask", "Place the infant in knee-to-chest position and provide calm environment with oxygen", "Perform emergency intubation", "Administer nebulized albuterol for bronchospasm"], correct: 1, rationale: "This describes a tet spell (hypercyanotic episode). Knee-to-chest positioning increases SVR, reducing right-to-left shunting through the VSD and improving pulmonary blood flow. Combined with a calm environment, supplemental oxygen, and morphine if needed, this is the first-line intervention. Intubation is reserved for spells unresponsive to initial management." }
    ]
  },

  "rrt-ecmo-physiology": {
    title: "Advanced ECMO Physiology & Troubleshooting",
    cellular: `Extracorporeal membrane oxygenation (ECMO) provides temporary cardiopulmonary support by circulating blood through an external gas exchange device (membrane oxygenator), allowing the lungs and/or heart to rest and recover. The respiratory therapist plays a central role in ECMO management, from circuit monitoring to ventilator optimization during ECMO support.

ECMO circuits consist of several essential components: a venous drainage cannula (removing deoxygenated blood), a centrifugal or roller pump (propelling blood through the circuit), a membrane oxygenator (gas exchange device), a heat exchanger (maintaining normothermia), and a return cannula (delivering oxygenated blood). Modern membrane oxygenators use polymethylpentene (PMP) hollow fiber membranes that are highly efficient at gas exchange and have low thrombogenicity compared to older silicone membranes.

There are two primary ECMO configurations. Veno-venous (VV) ECMO provides respiratory support only. Blood is drained from a large central vein (typically femoral or internal jugular), oxygenated and decarboxylated through the membrane oxygenator, and returned to the venous system near the right atrium. Because blood is returned to the venous system, VV ECMO does not provide hemodynamic support -- the patient must maintain adequate cardiac function. VV ECMO is indicated for severe respiratory failure (ARDS, severe pneumonia, bridge to lung transplant) when conventional ventilator management and adjuncts (prone positioning, inhaled nitric oxide, neuromuscular blockade) have failed.

Veno-arterial (VA) ECMO provides both respiratory and hemodynamic support. Blood is drained from a central vein and returned to a major artery (femoral artery for peripheral VA, ascending aorta for central VA). This provides parallel circulation, with the ECMO circuit supplementing both gas exchange and cardiac output. VA ECMO is indicated for cardiogenic shock (post-cardiotomy, massive MI, myocarditis, bridge to heart transplant or ventricular assist device) and cardiac arrest (ECPR -- extracorporeal cardiopulmonary resuscitation).

Gas exchange on ECMO is determined by several factors. Oxygenation depends on blood flow rate through the circuit, the membrane oxygenator's surface area, and the FDO2 (fraction of delivered oxygen to the oxygenator, analogous to FiO2 on a ventilator). CO2 removal is determined by the sweep gas flow rate -- increasing sweep gas flow (fresh gas flow through the oxygenator) increases CO2 clearance, analogous to increasing minute ventilation on a mechanical ventilator. A key principle: oxygenation is flow-dependent, CO2 removal is sweep-dependent.

Ventilator management during ECMO shifts from life-sustaining gas exchange to lung-protective rest settings. Typical rest settings include FiO2 0.21-0.40, PEEP 10-15 cmH2O, pressure control with plateau <25 cmH2O (or Vt 3-4 mL/kg if volume-controlled), and respiratory rate 6-10 breaths/min. The goal is to maintain alveolar recruitment without causing additional barotrauma or volutrauma while allowing the lungs to heal. Some centers advocate for ultra-low tidal volume ventilation or even near-apneic ventilation during ECMO.

ECMO complications include circuit thrombosis (most common), bleeding (from systemic anticoagulation), air embolism, hemolysis (from shear stress on red blood cells), cannula malposition, and membrane oxygenator failure. The RT must monitor circuit pressures (pre-membrane and post-membrane) to detect increasing oxygenator resistance indicating thrombus formation. Plasma-free hemoglobin levels track hemolysis. Recirculation in VV ECMO (drained blood is immediately returned and re-drained rather than passing through the patient's circulation) reduces ECMO effectiveness and is detected by unexpectedly low pre-oxygenator saturation.`,
    riskFactors: [
      "Severe ARDS with PaO2/FiO2 ratio <80 despite optimal ventilator management",
      "Refractory cardiogenic shock unresponsive to vasopressors and inotropes",
      "Massive pulmonary embolism with hemodynamic collapse",
      "Bridge to lung or heart transplant in end-stage organ failure",
      "Post-cardiotomy shock unable to wean from cardiopulmonary bypass",
      "Cardiac arrest (ECPR) with potentially reversible cause",
      "Severe hypothermia with cardiac arrest for extracorporeal rewarming",
      "Status asthmaticus with refractory hypercapnia and acidosis"
    ],
    diagnostics: [
      "Pre- and post-membrane oxygenator blood gases to assess membrane function",
      "Transmembrane pressure gradient (delta-P) monitoring for oxygenator thrombus detection",
      "Plasma-free hemoglobin levels for hemolysis surveillance (target <50 mg/dL)",
      "ACT (activated clotting time) or anti-Xa levels for anticoagulation monitoring",
      "Daily chest X-ray to assess lung recovery, cannula position, and pneumothorax",
      "Serial echocardiography for cardiac function recovery assessment (VA ECMO weaning trials)",
      "Pre-oxygenator venous saturation to detect recirculation in VV ECMO",
      "Fibrinogen, D-dimer, and platelet count for consumptive coagulopathy monitoring"
    ],
    management: [
      "VV ECMO flow rates typically 50-80 mL/kg/min to achieve adequate oxygenation",
      "Sweep gas titrated to maintain PaCO2 35-45 mmHg (or permissive targets depending on clinical scenario)",
      "FDO2 on oxygenator adjusted to maintain patient SpO2 >88% (VV) or mixed circulation targets (VA)",
      "Rest ventilator settings: FiO2 0.3, PEEP 10-15, PIP <25, RR 6-10, Vt approximately 3-4 mL/kg IBW",
      "Systemic anticoagulation with unfractionated heparin targeting ACT 180-220 seconds",
      "Oxygenator exchange when transmembrane pressure gradient exceeds threshold or gas exchange deteriorates",
      "Weaning trials: gradually reduce ECMO flow and sweep gas while monitoring patient hemodynamics and gas exchange",
      "Decannulation when patient can maintain adequate gas exchange and hemodynamics on reasonable ventilator settings"
    ],
    nursingActions: [
      "Monitor ECMO circuit continuously: flow rates, RPM, pre/post-membrane pressures, temperature",
      "Perform circuit checks every hour: inspect for clots in oxygenator and tubing, air bubbles, connection security",
      "Obtain pre- and post-membrane blood gases per protocol to assess oxygenator function",
      "Adjust sweep gas flow to control PaCO2 and FDO2 to control PaO2 per established protocols",
      "Maintain lung-protective rest ventilator settings to prevent further ventilator-induced lung injury",
      "Assess for recirculation in VV ECMO if patient oxygenation does not improve despite adequate flow",
      "Monitor for cannula migration using physical landmarks and imaging confirmation",
      "Participate in daily readiness-to-wean assessments with the multidisciplinary ECMO team"
    ],
    signs: [
      "Successful ECMO support: improving patient SpO2, normalizing lactate, clearing lung opacities on CXR",
      "Oxygenator failure: increasing transmembrane pressure gradient, worsening post-membrane gas exchange, visible clot",
      "Recirculation (VV ECMO): pre-oxygenator saturations >75% with poor patient oxygenation despite adequate flow",
      "Hemolysis: rising plasma-free hemoglobin, dark or reddish urine, declining hematocrit",
      "Cannula malposition: sudden flow changes, volume alarms, poor drainage or return",
      "Air embolism: visible air in circuit, sudden hemodynamic instability, neurological deterioration"
    ],
    medications: [
      { name: "Unfractionated Heparin", dose: "10-30 units/kg/hr IV infusion", route: "IV continuous infusion", purpose: "Systemic anticoagulation to prevent circuit thrombosis; titrated to ACT 180-220 seconds" },
      { name: "Bivalirudin", dose: "0.05-0.2 mg/kg/hr IV", route: "IV continuous infusion", purpose: "Direct thrombin inhibitor alternative for patients with heparin-induced thrombocytopenia (HIT)" },
      { name: "Aminocaproic Acid", dose: "100-200 mg/kg loading, 25-30 mg/kg/hr", route: "IV", purpose: "Antifibrinolytic for significant bleeding complications during ECMO support" },
      { name: "Packed Red Blood Cells", dose: "10-15 mL/kg per transfusion", route: "IV", purpose: "Maintain hemoglobin >10 g/dL during ECMO for optimal oxygen delivery through the circuit" }
    ],
    pearls: [
      "On ECMO: oxygenation is flow-dependent (increase circuit blood flow), CO2 removal is sweep-dependent (increase sweep gas flow)",
      "VV ECMO does NOT provide hemodynamic support -- if the patient is in shock, VA ECMO is needed",
      "The ventilator during ECMO is set to 'rest' the lungs, not to provide gas exchange -- resist the urge to increase vent settings",
      "A rising transmembrane pressure gradient is the earliest sign of oxygenator thrombus -- report immediately",
      "Recirculation is the most common cause of inadequate oxygenation on VV ECMO and is addressed by repositioning cannulas or reducing flow"
    ],
    quiz: [
      { question: "On VV ECMO, the patient's PaCO2 is 55 mmHg. What should the RT adjust?", options: ["Increase ECMO blood flow rate", "Increase sweep gas flow rate", "Increase ventilator respiratory rate", "Increase FDO2 on the oxygenator"], correct: 1, rationale: "CO2 removal on ECMO is sweep-dependent. Increasing the sweep gas flow rate (fresh gas flowing through the oxygenator) enhances CO2 clearance from the blood. Blood flow rate primarily affects oxygenation. During ECMO, the ventilator is on rest settings and should not be adjusted for gas exchange optimization." },
      { question: "What is the primary difference between VV and VA ECMO?", options: ["VV ECMO provides hemodynamic support while VA does not", "VA ECMO provides both respiratory and hemodynamic support; VV provides respiratory support only", "VV ECMO is used for cardiac failure; VA for respiratory failure", "There is no functional difference between VV and VA ECMO"], correct: 1, rationale: "VV ECMO drains and returns blood to the venous system, providing gas exchange support without hemodynamic augmentation -- the patient's heart must maintain adequate cardiac output. VA ECMO drains from the venous system and returns to the arterial system, providing both gas exchange and cardiac output support." },
      { question: "A VV ECMO patient has adequate circuit flow but persistently low SpO2. Pre-oxygenator saturation is 82%. What is the likely problem?", options: ["Oxygenator failure", "Recirculation of already-oxygenated blood", "Inadequate sweep gas flow", "Circuit air embolism"], correct: 1, rationale: "Pre-oxygenator saturation of 82% (normally 65-75%) suggests recirculation -- oxygenated return blood is being immediately re-drained rather than circulating through the patient. This reduces effective oxygen delivery despite adequate flow through the circuit. Cannula repositioning or flow rate adjustment may resolve recirculation." },
      { question: "What are appropriate ventilator rest settings during ECMO support?", options: ["FiO2 1.0, PEEP 5, Vt 8 mL/kg, RR 16", "FiO2 0.3, PEEP 10-15, PIP <25, RR 6-10", "FiO2 0.5, PEEP 0, Vt 6 mL/kg, RR 12", "Ventilator should be discontinued entirely during ECMO"], correct: 1, rationale: "ECMO rest settings aim to maintain alveolar recruitment (PEEP 10-15) without causing additional lung injury (low FiO2, low pressures, low rate). The goal is lung rest and recovery, not gas exchange. Ultra-low tidal volumes (3-4 mL/kg) and low FiO2 minimize oxygen toxicity and ventilator-induced lung injury while ECMO handles oxygenation and ventilation." }
    ]
  },

  "rrt-ventilator-hemodynamic-interactions": {
    title: "Ventilator-Hemodynamic Interactions",
    cellular: `The interaction between mechanical ventilation and cardiovascular function is one of the most important yet underappreciated aspects of critical care respiratory therapy. Every breath delivered by a mechanical ventilator creates pressure changes within the thorax that directly affect cardiac preload, afterload, and contractility. The respiratory therapist must understand these interactions to optimize ventilator settings without causing hemodynamic compromise.

During spontaneous breathing, negative intrathoracic pressure generated by diaphragmatic contraction creates a pressure gradient that facilitates venous return to the right heart. This augments right ventricular preload and promotes cardiac output. Mechanical ventilation reverses this physiology: positive pressure during inspiration increases intrathoracic pressure, which impedes venous return by reducing the pressure gradient between the peripheral veins and the right atrium. This reduction in RV preload can decrease right ventricular stroke volume and, subsequently, left ventricular output.

The effect of positive pressure on the right ventricle is predominantly negative. Increased intrathoracic pressure during inspiration reduces RV preload (decreased venous return) and can increase RV afterload (compression of pulmonary vasculature by inflated alveoli). High tidal volumes and PEEP amplify these effects. In patients with pre-existing RV dysfunction or hypovolemia, even moderate positive pressure ventilation can cause significant hemodynamic compromise.

Conversely, the effect of positive pressure on the left ventricle can be beneficial. By increasing intrathoracic pressure, mechanical ventilation reduces LV transmural pressure, which effectively decreases LV afterload. For patients with left ventricular systolic dysfunction and elevated afterload, positive pressure ventilation can actually improve cardiac output. This explains why patients with acute decompensated heart failure often improve dramatically with CPAP or BiPAP -- the non-invasive positive pressure reduces both preload (decreased venous return) and afterload (decreased transmural pressure), unloading the failing left ventricle.

PEEP has specific hemodynamic effects beyond its respiratory benefits. Optimal PEEP improves oxygenation by recruiting collapsed alveoli and increasing functional residual capacity. However, excessive PEEP can overdistend alveoli, compress pulmonary capillaries (increasing PVR), reduce venous return, and decrease cardiac output. The concept of best PEEP must incorporate both respiratory mechanics (optimal compliance, minimizing driving pressure) and hemodynamic consequences (maintaining adequate cardiac output and oxygen delivery).

Heart-lung interactions during ventilator weaning are clinically significant. When transitioning from positive pressure to spontaneous breathing, the sudden shift from positive to negative intrathoracic pressure increases venous return (preload) and increases LV afterload. In patients with underlying cardiac dysfunction, this can precipitate weaning failure from acute pulmonary edema. Up to 40% of weaning failures in ICU patients have a cardiac etiology. The RT should consider cardiac causes when a patient repeatedly fails spontaneous breathing trials despite adequate respiratory mechanics and gas exchange.

Auto-PEEP (intrinsic PEEP) creates an additional hemodynamic burden. In patients with obstructive lung disease, incomplete exhalation traps air, generating unintentional positive end-expiratory pressure. This auto-PEEP increases intrathoracic pressure, impedes venous return, and can cause significant hemodynamic compromise mimicking obstructive shock. Unlike set PEEP, auto-PEEP is not visible on the ventilator display unless specifically measured using an end-expiratory hold maneuver.`,
    riskFactors: [
      "High PEEP levels (>15 cmH2O) in patients with compromised RV function",
      "Large tidal volumes increasing mean airway pressure and intrathoracic pressure",
      "Hypovolemia amplifying the hemodynamic effects of positive pressure ventilation",
      "Pre-existing right ventricular dysfunction or pulmonary hypertension",
      "Auto-PEEP from obstructive lung disease compounding hemodynamic effects",
      "Left ventricular dysfunction at risk for weaning-induced pulmonary edema",
      "High respiratory rates reducing diastolic filling time and cardiac output",
      "Dyssynchrony increasing intrathoracic pressure swings and hemodynamic variability"
    ],
    diagnostics: [
      "Arterial line monitoring for continuous blood pressure and waveform analysis during ventilator changes",
      "End-expiratory hold maneuver to measure auto-PEEP (intrinsic PEEP) level",
      "Esophageal balloon manometry for transpulmonary pressure and transmural cardiac pressure estimation",
      "Pulse pressure variation assessment for fluid responsiveness during controlled ventilation",
      "Echocardiography to evaluate RV and LV function before and during PEEP titration",
      "Mixed venous oxygen saturation trends correlated with ventilator parameter changes",
      "Cardiac output measurement (thermodilution or non-invasive) during PEEP and tidal volume adjustments",
      "BNP or NT-proBNP levels to evaluate cardiac contribution to weaning failure"
    ],
    management: [
      "Titrate PEEP considering both respiratory compliance and hemodynamic effect (best PEEP = optimal DO2)",
      "Limit mean airway pressure to minimize hemodynamic compromise in hemodynamically unstable patients",
      "Volume loading before or during PEEP increases to offset reduced venous return",
      "Use lower tidal volumes (6 mL/kg IBW) to reduce mean airway pressure and hemodynamic impact",
      "Apply external PEEP equal to 80% of measured auto-PEEP to reduce inspiratory work without worsening hyperinflation",
      "Pre-treat with diuretics before SBT in patients with suspected cardiac-related weaning failure",
      "Consider NIPPV post-extubation in cardiac patients to maintain afterload reduction benefit",
      "Optimize heart rate and rhythm as tachycardia reduces diastolic filling and cardiac output during PPV"
    ],
    nursingActions: [
      "Measure auto-PEEP with end-expiratory hold when obstructive patients develop hemodynamic instability",
      "Assess hemodynamic response within 5-10 minutes of any PEEP or tidal volume change",
      "Calculate oxygen delivery (DO2) incorporating cardiac output to determine true best PEEP",
      "Monitor for weaning-induced pulmonary edema: rising PAWP, new crackles, SpO2 decline during SBT",
      "Communicate hemodynamic changes to medical team when adjusting ventilator settings",
      "Document the relationship between ventilator settings and hemodynamic parameters at each change",
      "Assess for dyssynchrony which increases work of breathing and hemodynamic variability",
      "Evaluate fluid status before PEEP titration as hypovolemia amplifies hemodynamic compromise"
    ],
    signs: [
      "Hypotension immediately following PEEP increase or initiation of mechanical ventilation",
      "Pulsus paradoxus (>10 mmHg systolic BP variation with respiration) from exaggerated heart-lung interaction",
      "Elevated CVP with decreased cardiac output indicating impeded venous return from excessive intrathoracic pressure",
      "Auto-PEEP: expiratory flow not reaching zero baseline on ventilator flow-time waveform",
      "Weaning failure with flash pulmonary edema: sudden dyspnea, tachycardia, hypertension, and desaturation during SBT",
      "RV dilation on echo during PEEP titration indicating excessive RV afterload"
    ],
    medications: [
      { name: "Furosemide", dose: "20-80 mg IV", route: "IV push or infusion", purpose: "Pre-SBT diuresis to reduce preload and prevent weaning-induced pulmonary edema in cardiac patients" },
      { name: "Nitroglycerin", dose: "5-200 mcg/min IV", route: "IV continuous infusion", purpose: "Preload and afterload reduction during cardiac weaning failure to facilitate successful extubation" },
      { name: "Dobutamine", dose: "2-20 mcg/kg/min", route: "IV continuous infusion", purpose: "Inotropic support for patients with reduced cardiac output from ventilator-hemodynamic interaction" },
      { name: "Norepinephrine", dose: "0.01-3 mcg/kg/min", route: "IV continuous infusion", purpose: "Vasopressor support for hypotension related to decreased venous return from positive pressure ventilation" }
    ],
    pearls: [
      "Positive pressure ventilation DECREASES RV preload and afterload increases LV afterload reduction -- net effect depends on cardiac physiology",
      "If a patient becomes hypotensive after intubation, consider three causes: sedation-induced vasodilation, reduced venous return from PPV, or tension pneumothorax",
      "Up to 40% of weaning failures have a cardiac etiology -- if a patient fails SBT with good respiratory mechanics, check BNP and consider cardiac causes",
      "Auto-PEEP acts as hidden hemodynamic saboteur -- always measure it in obstructive patients with unexplained hemodynamic instability",
      "Best PEEP is NOT the PEEP with best oxygenation -- it is the PEEP that maximizes oxygen DELIVERY (DO2 = CO x CaO2 x 10)"
    ],
    quiz: [
      { question: "A patient with ARDS has PEEP increased from 10 to 18 cmH2O. SpO2 improves from 88% to 94%, but blood pressure drops from 110/70 to 85/55. What should the RT recommend?", options: ["Maintain current PEEP as oxygenation improved", "Reduce PEEP back to 10 as hemodynamic compromise outweighs oxygenation benefit", "Administer a fluid bolus and reassess -- if BP improves, the higher PEEP may be tolerable", "Increase PEEP further to 22 to maximize recruitment"], correct: 2, rationale: "The improvement in SpO2 suggests beneficial alveolar recruitment, but the hypotension indicates reduced venous return. Before abandoning the higher PEEP, a fluid challenge can assess whether the hemodynamic compromise is due to preload-responsive hypovolemia. If blood pressure improves with fluid, the patient can tolerate the higher PEEP. The best PEEP maximizes oxygen delivery (DO2), not just SpO2." },
      { question: "Why do patients with left ventricular failure often improve with non-invasive positive pressure ventilation (CPAP/BiPAP)?", options: ["It increases oxygen delivery to the myocardium", "PPV reduces both preload (decreased venous return) and LV afterload (decreased transmural pressure), unloading the failing ventricle", "It corrects the underlying cardiac pathology", "It increases respiratory muscle oxygen consumption"], correct: 1, rationale: "Positive intrathoracic pressure from NIPPV reduces venous return (decreasing preload and pulmonary congestion) and reduces LV transmural pressure (decreasing afterload). Both effects benefit the failing left ventricle by reducing its workload. This is why CPAP/BiPAP can rapidly improve acute cardiogenic pulmonary edema." },
      { question: "A COPD patient on the ventilator develops progressive hypotension. Expiratory flow on the flow waveform does not return to zero baseline. What is the diagnosis and intervention?", options: ["Tension pneumothorax -- needle decompression", "Auto-PEEP causing obstructive hemodynamic compromise -- extend expiratory time or briefly disconnect", "Cardiogenic shock -- start dobutamine", "Ventilator malfunction -- switch to backup ventilator"], correct: 1, rationale: "Flow not returning to zero baseline is the hallmark ventilator waveform finding of auto-PEEP (air trapping). In COPD, air trapping generates intrinsic PEEP that increases intrathoracic pressure and impedes venous return, causing hypotension. Interventions include reducing respiratory rate, prolonging expiratory time (lower I:E ratio), reducing tidal volume, or briefly disconnecting the ventilator to allow complete exhalation." },
      { question: "A patient repeatedly fails spontaneous breathing trials with tachycardia, hypertension, and flash pulmonary edema. BNP is elevated. What is the likely cause and management?", options: ["Respiratory muscle weakness -- continue vent rest", "Cardiac-related weaning failure -- pre-treat with diuretics before next SBT", "Anxiety -- administer anxiolytics before SBT", "Airway obstruction -- perform bronchoscopy"], correct: 1, rationale: "The combination of tachycardia, hypertension, flash pulmonary edema, and elevated BNP during SBT indicates cardiac-related weaning failure. When transitioning from positive pressure to spontaneous breathing, increased venous return (preload) and increased LV afterload overwhelm the compromised left ventricle. Pre-treatment with diuretics to optimize fluid balance before the SBT can improve weaning success." }
    ]
  },

  "rrt-transfusion-respiratory-complications": {
    title: "Transfusion-Related Respiratory Complications (TRALI/TACO)",
    cellular: `Transfusion-related respiratory complications are among the leading causes of transfusion-related mortality. Respiratory therapists must be able to rapidly identify, differentiate, and manage these conditions, as they present with acute respiratory distress requiring immediate intervention. The two most important transfusion-related respiratory conditions are transfusion-related acute lung injury (TRALI) and transfusion-associated circulatory overload (TACO).

TRALI is defined as new acute lung injury occurring within 6 hours of transfusion in the absence of other risk factors for ALI. It is an immunologically mediated condition caused by donor antibodies (anti-HLA or anti-HNA antibodies) reacting with recipient leukocytes, triggering neutrophil activation, endothelial damage, and increased pulmonary capillary permeability. The two-hit model proposes that a primed inflammatory state (first hit: sepsis, surgery, trauma) is required before donor antibodies (second hit) trigger full-blown TRALI. Plasma-containing components (FFP, platelets, whole blood) carry the highest risk.

TRALI presents with acute onset hypoxemia (PaO2/FiO2 <300), bilateral pulmonary infiltrates on chest X-ray, hypotension, fever, and absence of circulatory overload (normal BNP, normal or low CVP/PAWP). The chest X-ray pattern is similar to ARDS with bilateral opacities not fully explained by effusions, atelectasis, or cardiogenic pulmonary edema. TRALI is a diagnosis of exclusion and must be differentiated from TACO, anaphylactic transfusion reaction, and coincidental ARDS.

TACO results from volume overload due to rapid or excessive transfusion, causing hydrostatic pulmonary edema. Unlike TRALI, TACO is a cardiogenic process characterized by elevated BNP (>1.5x baseline or >250 pg/mL), elevated CVP and PAWP, hypertension, positive fluid balance, and signs of volume overload (jugular venous distension, peripheral edema, S3 gallop). TACO is more common in elderly patients, those with pre-existing cardiac dysfunction, renal insufficiency, and when transfusion rates exceed 2-4 mL/kg/hr.

The critical differentiation between TRALI and TACO determines management. TRALI is treated supportively with oxygen therapy, mechanical ventilation if needed (using ARDS-type lung-protective settings), and vasopressor support for hypotension. Diuretics are generally NOT indicated and may worsen hypotension. TACO is treated with diuresis (furosemide), upright positioning, oxygen support, and slowing or stopping the transfusion. TACO responds to diuretics and afterload reduction; TRALI does not.

Other transfusion-related respiratory complications include transfusion-associated dyspnea (TAD) -- respiratory distress temporally related to transfusion that does not meet criteria for TRALI or TACO -- and allergic/anaphylactic transfusion reactions that may include bronchospasm and upper airway edema. Bacterial contamination of blood products (particularly platelet units stored at room temperature) can cause septic transfusion reactions with respiratory distress from sepsis-induced ARDS.

Prevention strategies include using male-only plasma donors (to reduce anti-HLA antibody exposure from multiparous females), leukoreduction of cellular components, limiting unnecessary transfusions (restrictive transfusion threshold of Hb <7 g/dL for most ICU patients), slow transfusion rates in at-risk patients, and pre-medication with furosemide for patients at high risk for TACO. The ISBT hemovigilance reporting system tracks transfusion reactions to improve blood safety.`,
    riskFactors: [
      "TRALI: recipient with pre-existing inflammatory state (sepsis, trauma, surgery) -- first hit of two-hit model",
      "TRALI: plasma-containing products (FFP, platelets) from multiparous female donors with anti-HLA antibodies",
      "TACO: elderly patients with reduced cardiac reserve",
      "TACO: pre-existing heart failure or renal insufficiency",
      "TACO: rapid transfusion rate exceeding 2-4 mL/kg/hr",
      "TACO: multiple sequential transfusions without diuretic coverage",
      "Critically ill patients requiring massive transfusion protocols",
      "History of prior transfusion reactions increasing risk for recurrence"
    ],
    diagnostics: [
      "Chest X-ray showing bilateral infiltrates (TRALI: non-cardiogenic pattern; TACO: cardiogenic with cephalization, Kerley B lines)",
      "BNP levels: elevated in TACO (>250 pg/mL or >1.5x baseline), normal in TRALI",
      "Echocardiography: normal LV function and PAWP in TRALI; elevated filling pressures in TACO",
      "Arterial blood gas for PaO2/FiO2 ratio calculation (TRALI <300 by definition)",
      "Fluid balance calculation: positive balance supports TACO diagnosis",
      "Anti-HLA and anti-HNA antibody testing in donor and recipient for TRALI confirmation",
      "Blood cultures to rule out septic transfusion reaction",
      "CVP measurement: low/normal in TRALI, elevated in TACO"
    ],
    management: [
      "Immediately stop the transfusion and notify blood bank for both TRALI and TACO",
      "TRALI: supportive care with supplemental oxygen, mechanical ventilation with ARDS-protective settings if needed",
      "TRALI: vasopressors for hypotension; diuretics generally NOT indicated and may worsen hemodynamics",
      "TACO: diuresis with furosemide 20-80 mg IV, upright positioning, supplemental oxygen",
      "TACO: slow or stop transfusion, consider smaller volume aliquots for future transfusions",
      "Mechanical ventilation for TRALI using lung-protective strategy (Vt 6 mL/kg IBW, PEEP titration, Pplat <30)",
      "CPAP or BiPAP for TACO if not requiring intubation to reduce preload and improve oxygenation",
      "Report to blood bank: TRALI triggers donor deferral investigation; TACO triggers transfusion rate modification"
    ],
    nursingActions: [
      "Monitor SpO2 continuously during and for 6 hours after transfusion for early detection of respiratory complications",
      "Assess respiratory status including rate, effort, breath sounds, and SpO2 at baseline, 15 min, 1 hr during transfusion",
      "Immediately stop transfusion and maintain IV access if respiratory symptoms develop",
      "Differentiate TRALI from TACO using BNP, fluid balance, blood pressure, and clinical presentation",
      "Prepare for rapid oxygen delivery escalation: nasal cannula to high-flow to NIPPV to intubation",
      "Calculate PaO2/FiO2 ratio on first ABG after symptom onset to grade severity of lung injury",
      "Document timing of symptom onset relative to transfusion initiation for accurate classification",
      "Assist with hemodynamic assessment (CVP, echo) to differentiate permeability from hydrostatic edema"
    ],
    signs: [
      "TRALI: acute dyspnea, hypoxemia, bilateral infiltrates, hypotension, fever within 6 hours of transfusion",
      "TACO: acute dyspnea, hypertension, elevated BNP, JVD, peripheral edema, positive fluid balance",
      "Both: new onset respiratory distress, tachypnea, crackles on auscultation, decreased SpO2",
      "TRALI distinguishing features: low/normal BNP, low/normal PAWP, hypotension, fever",
      "TACO distinguishing features: elevated BNP, elevated PAWP/CVP, hypertension, response to diuretics",
      "Anaphylactic transfusion reaction: bronchospasm, urticaria, angioedema, cardiovascular collapse"
    ],
    medications: [
      { name: "Furosemide", dose: "20-80 mg IV push", route: "IV", purpose: "First-line diuretic for TACO to reduce volume overload; NOT indicated for TRALI" },
      { name: "Norepinephrine", dose: "0.01-3 mcg/kg/min", route: "IV continuous infusion", purpose: "Vasopressor for TRALI-associated hypotension refractory to fluid resuscitation" },
      { name: "Epinephrine", dose: "0.3-0.5 mg IM or 0.01-0.5 mcg/kg/min IV", route: "IM or IV", purpose: "Anaphylactic transfusion reaction with bronchospasm, angioedema, or cardiovascular collapse" },
      { name: "Albuterol", dose: "2.5-5 mg nebulized", route: "Inhaled", purpose: "Bronchodilator for bronchospasm associated with allergic or anaphylactic transfusion reactions" }
    ],
    pearls: [
      "The key differentiation: TRALI = NON-cardiogenic permeability edema (like ARDS); TACO = CARDIOGENIC hydrostatic edema (like heart failure)",
      "BNP is the single most useful lab to differentiate TRALI from TACO -- elevated BNP strongly favors TACO",
      "TRALI is hypotensive; TACO is hypertensive -- blood pressure pattern helps differentiate at the bedside",
      "Do NOT give diuretics for suspected TRALI -- the patient is already vasodilated and often hypotensive",
      "TRALI typically resolves within 48-72 hours with supportive care; TACO responds rapidly to diuresis"
    ],
    quiz: [
      { question: "During a platelet transfusion, a patient develops acute dyspnea, SpO2 78%, bilateral infiltrates on CXR, BP 82/50, BNP 95 pg/mL. What is the most likely diagnosis?", options: ["TACO", "TRALI", "Anaphylactic transfusion reaction", "Bacterial contamination"], correct: 1, rationale: "The clinical picture shows acute respiratory distress with bilateral infiltrates (ALI), hypotension, and normal BNP -- classic TRALI. TACO would present with hypertension and elevated BNP. Anaphylaxis typically presents with urticaria, angioedema, and bronchospasm. The platelet product (plasma-containing) is a known TRALI risk factor." },
      { question: "An elderly patient with heart failure receives 2 units of PRBCs over 2 hours. She develops acute dyspnea, BP 180/100, JVD, and BNP 850 pg/mL. What is the diagnosis and treatment?", options: ["TRALI -- vasopressors and lung-protective ventilation", "TACO -- stop transfusion, furosemide, upright positioning", "Pulmonary embolism -- heparin anticoagulation", "Anaphylaxis -- epinephrine"], correct: 1, rationale: "Elderly patient with heart failure, rapid transfusion, hypertension, JVD, and markedly elevated BNP is classic TACO (transfusion-associated circulatory overload). Management includes stopping the transfusion, diuresis with furosemide to reduce volume overload, upright positioning, and supplemental oxygen." },
      { question: "What is the primary reason diuretics are NOT recommended for TRALI?", options: ["Diuretics worsen pulmonary capillary permeability", "TRALI patients are often hypotensive and diuretics can worsen hemodynamic instability", "Diuretics are nephrotoxic in TRALI", "There is no contraindication; diuretics can be used for both TRALI and TACO"], correct: 1, rationale: "TRALI involves non-cardiogenic pulmonary edema from increased capillary permeability with associated hypotension and vasodilation. Diuretics reduce intravascular volume, which would worsen the already-low blood pressure and could precipitate hemodynamic collapse. Unlike TACO where the problem is excess volume, TRALI is a permeability problem that does not respond to volume removal." },
      { question: "What prevention strategy has significantly reduced TRALI incidence?", options: ["Universal leukoreduction of all blood products", "Using predominantly male plasma donors to avoid anti-HLA antibodies from multiparous females", "Pre-medicating all patients with corticosteroids", "Irradiating all blood products before transfusion"], correct: 1, rationale: "The predominant use of male-only plasma donors has significantly reduced TRALI incidence. Multiparous women develop anti-HLA antibodies from fetal antigen exposure during pregnancy. These antibodies in donated plasma can trigger the immune-mediated neutrophil activation that causes TRALI. This policy change has been one of the most impactful blood safety interventions." }
    ]
  }
};
