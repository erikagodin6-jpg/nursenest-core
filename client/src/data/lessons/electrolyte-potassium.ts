import { getAssetUrl } from "@/lib/asset-url";
import type { LessonContent } from "./types";

const imgLethalDysrhythmias = getAssetUrl("lethaldysrhythmias_1773517523349.png");

export const electrolytePotassiumLessons: Record<string, LessonContent> = {
  "potassium-imbalance-rpn": {
    title: "Hyperkalemia vs Hypokalemia - ECG Changes",
    image: imgLethalDysrhythmias,
    cellular: {
      title: "Potassium & Electrical Stability",
      content: "Potassium (K⁺) is the dominant intracellular cation, with approximately 98% residing inside cells and only 2% in the extracellular fluid. This steep concentration gradient  -  maintained by the Na⁺/K⁺-ATPase pump  -  is the primary determinant of the resting membrane potential (RMP) of excitable cells, including cardiac myocytes and skeletal muscle fibers. The normal RMP of a cardiac ventricular cell is approximately −90 mV, generated largely by potassium leak channels that allow K⁺ to flow down its concentration gradient from intracellular to extracellular space. When extracellular K⁺ rises (hyperkalemia), the gradient decreases, the RMP becomes less negative (partially depolarized), and the cell becomes hyperexcitable initially but progressively inexcitable as sodium channels inactivate. When extracellular K⁺ falls (hypokalemia), the gradient steepens, the RMP becomes more negative (hyperpolarized), making the cell harder to depolarize  -  but paradoxically more prone to ectopic pacemaker activity and re-entrant circuits due to prolonged repolarization. This is why both extremes of potassium produce life-threatening dysrhythmias: they disrupt the precisely calibrated electrical cycling of the heart. Normal serum potassium: 3.5-5.0 mEq/L. Even small deviations (0.5-1.0 mEq/L) can produce clinically significant cardiac conduction changes."
    },
    riskFactors: [
      "HYPERKALEMIA: Acute kidney injury or chronic kidney disease (impaired renal excretion)",
      "HYPERKALEMIA: Potassium-sparing diuretics (spironolactone, triamterene, amiloride)",
      "HYPERKALEMIA: ACE inhibitors and ARBs (reduce aldosterone-mediated K⁺ secretion)",
      "HYPERKALEMIA: Massive tissue destruction (crush injury, rhabdomyolysis, burns, tumor lysis syndrome)",
      "HYPERKALEMIA: Metabolic acidosis (H⁺ shifts into cells, K⁺ shifts out  -  transcellular shift)",
      "HYPERKALEMIA: Excessive potassium supplementation or salt substitutes (KCl-based)",
      "HYPERKALEMIA: Addison's disease (aldosterone deficiency impairs K⁺ excretion)",
      "HYPERKALEMIA: Hemolyzed blood sample (pseudohyperkalemia  -  always verify before treating)",
      "HYPOKALEMIA: Loop diuretics (furosemide) and thiazide diuretics (hydrochlorothiazide)",
      "HYPOKALEMIA: Prolonged vomiting, nasogastric suction, or diarrhea",
      "HYPOKALEMIA: Metabolic alkalosis (H⁺ shifts out of cells, K⁺ shifts in)",
      "HYPOKALEMIA: Excessive insulin administration (drives K⁺ intracellularly)",
      "HYPOKALEMIA: Cushing syndrome or exogenous corticosteroids (aldosterone effect)",
      "HYPOKALEMIA: Inadequate dietary intake (anorexia, alcoholism, malnutrition)",
      "HYPOKALEMIA: Renal tubular acidosis (types I and II cause potassium wasting)",
      "HYPOKALEMIA: Beta-2 agonist use (albuterol shifts K⁺ into cells)"
    ],
    diagnostics: [
      "Serum potassium level (critical values: <2.5 or >6.5 mEq/L require immediate intervention)",
      "12-lead ECG  -  assess for peaked T waves, widened QRS, absent P waves (hyperkalemia) or flattened T waves, U waves, ST depression (hypokalemia)",
      "Continuous cardiac monitoring on telemetry for any K⁺ outside 3.0-5.5 mEq/L",
      "Basic metabolic panel (BMP) including BUN, creatinine, glucose, magnesium, calcium",
      "Serum magnesium level  -  hypomagnesemia makes hypokalemia refractory to correction",
      "Arterial blood gas if acid-base disturbance suspected (pH affects transcellular K⁺ shifts)",
      "Urine potassium and urine creatinine to differentiate renal vs extrarenal K⁺ losses",
      "Digoxin level if applicable  -  hypokalemia potentiates digoxin toxicity"
    ],
    management: [
      "HYPERKALEMIA: Calcium gluconate IV as ordered  -  stabilizes cardiac membrane (does NOT lower K⁺, buys time)",
      "HYPERKALEMIA: Regular insulin IV + dextrose as ordered  -  shifts K⁺ intracellularly within 15-30 minutes",
      "HYPERKALEMIA: Sodium bicarbonate IV as ordered for concurrent metabolic acidosis  -  shifts K⁺ into cells",
      "HYPERKALEMIA: Nebulized albuterol as ordered  -  beta-2 stimulation shifts K⁺ intracellularly",
      "HYPERKALEMIA: Sodium polystyrene sulfonate (Kayexalate) orally or rectally as ordered  -  exchanges Na⁺ for K⁺ in GI tract (slow onset, hours)",
      "HYPERKALEMIA: Patiromer or sodium zirconium cyclosilicate (Lokelma) as ordered  -  newer oral K⁺ binders with better GI safety profile",
      "HYPERKALEMIA: Emergent hemodialysis for refractory or severe hyperkalemia (K⁺ > 6.5 with ECG changes)",
      "HYPOKALEMIA: Oral potassium chloride (KCl) replacement as ordered  -  preferred route for mild-moderate deficits",
      "HYPOKALEMIA: IV potassium replacement as ordered  -  never exceed 10 mEq/hr via peripheral line or 20 mEq/hr via central line",
      "HYPOKALEMIA: NEVER give IV potassium as bolus push  -  fatal cardiac arrest risk",
      "HYPOKALEMIA: Correct concurrent hypomagnesemia  -  refractory hypokalemia will not correct until magnesium is repleted",
      "HYPOKALEMIA: Potassium-sparing diuretics may be added if ongoing losses from loop/thiazide diuretics"
    ],
    nursingActions: [
      "Place patient on continuous cardiac telemetry monitoring for any critical K⁺ value",
      "Monitor serum potassium levels every 2-4 hours during active correction",
      "Assess ECG rhythm strip for changes: peaked T waves, widened QRS, U waves, ST changes",
      "Monitor urine output hourly  -  adequate renal function is essential for safe K⁺ correction",
      "Verify IV potassium is diluted properly and infusing on a pump  -  NEVER bolus IV KCl",
      "Assess IV site frequently during potassium infusion  -  KCl is a vesicant and causes phlebitis and tissue necrosis if infiltrated",
      "Monitor for signs of hyperkalemia: muscle weakness (ascending pattern), paresthesias, bradycardia, cardiac arrest",
      "Monitor for signs of hypokalemia: skeletal muscle weakness (legs first), leg cramps, diminished deep tendon reflexes, paralytic ileus, cardiac dysrhythmias",
      "Hold potassium supplements and notify provider if urine output < 30 mL/hr (risk of iatrogenic hyperkalemia)",
      "Teach patients to recognize potassium-rich foods: bananas, oranges, potatoes, tomatoes, spinach, avocados, salt substitutes",
      "Administer oral KCl with food and a full glass of water to prevent GI ulceration",
      "Report any new cardiac rhythm changes immediately  -  both hypo and hyperkalemia cause lethal dysrhythmias"
    ],
    signs: {
      left: [
        "HYPERKALEMIA (K⁺ > 5.0 mEq/L):",
        "Muscle weakness (ascending, flaccid  -  starts in legs)",
        "Paresthesias (tingling in fingers, toes, perioral area)",
        "Bradycardia progressing to heart block",
        "ECG: Peaked/tall T waves (earliest sign)",
        "ECG: Prolonged PR interval → loss of P waves",
        "ECG: Widened QRS complex → sine wave pattern",
        "Cardiac arrest (ventricular fibrillation or asystole)"
      ],
      right: [
        "HYPOKALEMIA (K⁺ < 3.5 mEq/L):",
        "Skeletal muscle weakness and fatigue (legs first)",
        "Muscle cramps, especially in calves",
        "Decreased or absent deep tendon reflexes (hyporeflexia)",
        "Paralytic ileus (decreased bowel sounds, abdominal distension)",
        "ECG: Flattened or inverted T waves",
        "ECG: Prominent U wave (pathognomonic)",
        "ECG: ST segment depression",
        "Cardiac dysrhythmias (PVCs, ventricular tachycardia, torsades de pointes)"
      ]
    },
    medications: [
      {
        name: "Calcium Gluconate 10% IV",
        type: "Cardiac Membrane Stabilizer",
        action: "Directly antagonizes the effect of hyperkalemia on cardiac cell membranes by raising the threshold potential, restoring the normal voltage gap between resting and threshold potential. Does NOT reduce serum K⁺  -  it protects the heart while other interventions lower potassium.",
        sideEffects: "Hypotension if given too rapidly, bradycardia, hypercalcemia, tissue necrosis if extravasated",
        contra: "Concurrent digoxin therapy (may precipitate fatal dysrhythmia  -  use calcium chloride with extreme caution and slow infusion if digoxin present)",
        pearl: "Onset: 1-3 minutes. Duration: 30-60 minutes. FIRST intervention in symptomatic hyperkalemia with ECG changes. Buy time while initiating K⁺-lowering strategies."
      },
      {
        name: "Regular Insulin IV + Dextrose 50%",
        type: "Intracellular K⁺ Shift Agent",
        action: "Insulin activates Na⁺/K⁺-ATPase pump, driving K⁺ into cells. D50 is co-administered to prevent hypoglycemia. Lowers serum K⁺ by 0.5-1.5 mEq/L within 15-30 minutes.",
        sideEffects: "Hypoglycemia (monitor blood glucose every 30 min for 4-6 hours), hypokalemia rebound",
        contra: "Use caution in patients already hypoglycemic",
        pearl: "Typical dose: 10 units regular insulin IV + 25g dextrose (1 amp D50). Effect is TEMPORARY  -  K⁺ shifts back out of cells in 4-6 hours. Must pair with definitive removal strategies."
      },
      {
        name: "Potassium Chloride (KCl) IV/Oral",
        type: "Potassium Replacement",
        action: "Directly repletes extracellular and intracellular K⁺ stores. Chloride salt preferred because hypokalemia often coexists with metabolic alkalosis (chloride-responsive).",
        sideEffects: "GI irritation, nausea (oral); phlebitis, pain at IV site; cardiac arrest if given too fast IV",
        contra: "Hyperkalemia, anuria or severe oliguria, untreated Addison's disease",
        pearl: "NEVER IV push KCl  -  always dilute and infuse via pump. Max peripheral IV rate: 10 mEq/hr. Max central line rate: 20 mEq/hr. Always check urine output before administering  -  kidneys must be functioning to excrete excess K⁺."
      },
      {
        name: "Sodium Polystyrene Sulfonate (Kayexalate)",
        type: "Cation Exchange Resin (K⁺ Binder)",
        action: "Exchanges sodium ions for potassium ions in the intestinal lumen, promoting fecal K⁺ excretion. Each gram binds approximately 1 mEq of potassium.",
        sideEffects: "Intestinal necrosis (rare but serious, especially with sorbitol), constipation, sodium loading, hypokalemia",
        contra: "Bowel obstruction, post-operative ileus, neonates (risk of intestinal necrosis)",
        pearl: "Slow onset (hours). Assess bowel sounds before administration. Newer agents (patiromer, sodium zirconium cyclosilicate) have better safety profiles and are increasingly preferred."
      }
    ],
    pearls: [
      "Potassium is the most dangerous electrolyte to replace IV  -  never bolus push, always on a pump, always verify urine output first",
      "Peaked T waves are the EARLIEST ECG change in hyperkalemia  -  if you see them, the K⁺ is already dangerously high",
      "The U wave is pathognomonic for hypokalemia  -  a small positive deflection after the T wave that represents delayed ventricular repolarization",
      "Digoxin + hypokalemia = lethal combination  -  low K⁺ allows digoxin to bind more cardiac Na⁺/K⁺-ATPase sites, increasing toxicity risk even at therapeutic digoxin levels",
      "Calcium gluconate does NOT lower potassium  -  it stabilizes the heart. Always pair with a K⁺-lowering strategy (insulin/dextrose, dialysis, or cation binders)",
      "Hypokalemia will NOT correct until hypomagnesemia is corrected  -  always check and replete magnesium concurrently",
      "Acid-base status directly affects K⁺ distribution: acidosis pushes K⁺ OUT of cells (hyperkalemia), alkalosis pushes K⁺ INTO cells (hypokalemia)",
      "Hemolyzed blood samples cause falsely elevated K⁺ (pseudohyperkalemia)  -  if the level is unexpected, redraw and verify before treating",
      "In hyperkalemia, the ECG progression is: peaked T → prolonged PR → lost P wave → widened QRS → sine wave → V-fib/asystole",
      "Administer oral KCl with food and a full glass of water  -  it can cause esophageal and gastric ulceration if taken on an empty stomach"
    ],
    lifespan: {
      title: "Age-Specific Considerations",
      content: "Neonates and infants have immature renal tubular function and are particularly vulnerable to hyperkalemia, especially premature infants. Normal neonatal K⁺ ranges slightly higher (up to 5.5-6.0 mEq/L in the first 24-72 hours) due to relative aldosterone resistance and redistribution from birth trauma. Older adults are at increased risk for both hypo- and hyperkalemia due to age-related decline in GFR, polypharmacy (ACE inhibitors, ARBs, potassium-sparing diuretics, NSAIDs), and dietary factors. In pediatric patients, diarrheal illness is the leading cause of hypokalemia worldwide. In pregnancy, potassium requirements increase slightly due to expanded plasma volume, and magnesium sulfate therapy for preeclampsia can worsen renal potassium handling."
    },
    preTest: [
      { question: "What is the primary determinant of the resting membrane potential in cardiac cells?", options: ["Sodium concentration gradient", "Potassium concentration gradient", "Calcium influx", "Chloride channels"], correct: 1, rationale: "The resting membrane potential of cardiac myocytes (approximately −90 mV) is primarily determined by the potassium concentration gradient across the cell membrane, maintained by potassium leak channels and the Na⁺/K⁺-ATPase pump." },
      { question: "Which ECG finding is considered pathognomonic for hypokalemia?", options: ["Peaked T waves", "Widened QRS complex", "Prominent U wave", "Shortened QT interval"], correct: 2, rationale: "The U wave  -  a small positive deflection following the T wave  -  is pathognomonic for hypokalemia. It represents delayed repolarization of the Purkinje fibers and mid-myocardial M cells due to the hyperpolarized resting membrane potential." },
      { question: "A patient on furosemide and digoxin has a K⁺ of 3.0 mEq/L. What is the priority concern?", options: ["Risk of metabolic acidosis", "Enhanced digoxin toxicity risk due to hypokalemia", "Development of hypernatremia", "Increased risk of hyperglycemia"], correct: 1, rationale: "Hypokalemia increases the risk of digoxin toxicity because low extracellular potassium allows digoxin to bind more avidly to the Na⁺/K⁺-ATPase pump. This patient is at high risk for fatal dysrhythmias even at therapeutic digoxin levels." }
    ],
    postTest: [
      { question: "A patient with K⁺ of 6.8 mEq/L and peaked T waves on ECG receives calcium gluconate IV. The nurse understands this intervention:", options: ["Will rapidly lower the serum potassium level", "Stabilizes the cardiac membrane without changing serum K⁺", "Permanently corrects the hyperkalemia", "Replaces calcium lost through renal excretion"], correct: 1, rationale: "Calcium gluconate raises the threshold potential of cardiac cells, restoring the normal gap between resting and threshold potentials. This protects against dysrhythmias but does NOT lower serum K⁺. Additional interventions (insulin/dextrose, dialysis) are required to actually reduce potassium." },
      { question: "Why must hypomagnesemia be corrected before hypokalemia can be successfully treated?", options: ["Magnesium is needed to activate the Na⁺/K⁺-ATPase pump that retains intracellular potassium", "Magnesium directly converts to potassium in the body", "Low magnesium blocks potassium absorption from the GI tract", "Magnesium supplements contain potassium"], correct: 0, rationale: "Magnesium is a cofactor for the Na⁺/K⁺-ATPase pump. When magnesium is deficient, the pump functions poorly, allowing potassium to leak out of cells and be excreted renally. Potassium replacement will be ineffective (refractory hypokalemia) until magnesium stores are repleted." },
      { question: "The nurse is preparing to infuse IV KCl 20 mEq via peripheral line. Which action is MOST important?", options: ["Administer it as a rapid IV push for faster correction", "Infuse via pump at a rate not exceeding 10 mEq/hr", "Mix it in a syringe and give it over 5 minutes", "Infuse at 40 mEq/hr to correct the deficit quickly"], correct: 1, rationale: "IV KCl must NEVER be given as a bolus push  -  it causes fatal cardiac arrest. Maximum infusion rate via peripheral IV is 10 mEq/hr (20 mEq/hr via central line). Always use an infusion pump and monitor the patient on telemetry during infusion." }
    ],
    quiz: [
      { question: "Which patient finding requires the nurse to hold the scheduled oral potassium supplement and notify the provider?", options: ["Serum K⁺ of 3.8 mEq/L", "Urine output of 250 mL in the past 8 hours (< 30 mL/hr average)", "Blood pressure of 132/84 mmHg", "Heart rate of 78 bpm, regular"], correct: 1, rationale: "Potassium is excreted by the kidneys. If urine output is inadequate (< 30 mL/hr), administering supplemental potassium risks iatrogenic hyperkalemia. Always verify adequate urine output before giving potassium supplements." },
      { question: "A patient with CKD has a K⁺ of 7.1 mEq/L, wide QRS complexes, and absent P waves on the monitor. The priority nursing action is:", options: ["Administer oral Kayexalate and recheck K⁺ in 2 hours", "Prepare for and administer IV calcium gluconate as ordered", "Start a dietary potassium restriction teaching plan", "Encourage the patient to eat a banana for energy"], correct: 1, rationale: "This patient has life-threatening hyperkalemia with advanced ECG changes (wide QRS, absent P waves  -  approaching sine wave pattern). The immediate priority is IV calcium gluconate to stabilize the cardiac membrane and prevent ventricular fibrillation or asystole. Kayexalate is too slow for this emergency." },
      { question: "Why does metabolic acidosis cause hyperkalemia?", options: ["Acid destroys potassium molecules in the blood", "Hydrogen ions shift into cells in exchange for potassium ions shifting out, raising extracellular K⁺", "Acidosis stimulates the kidneys to reabsorb more potassium", "Acid inhibits the production of aldosterone"], correct: 1, rationale: "In metabolic acidosis, excess hydrogen ions (H⁺) move intracellularly to be buffered. To maintain electrical neutrality, potassium ions (K⁺) shift out of cells into the extracellular fluid. This transcellular shift raises serum K⁺ approximately 0.6 mEq/L for every 0.1 decrease in pH." },
      { question: "A nurse is reviewing an ECG and notes flattened T waves, ST depression, and a small wave after the T wave. This pattern is most consistent with:", options: ["Hyperkalemia", "Hypercalcemia", "Hypokalemia", "Hypermagnesemia"], correct: 2, rationale: "Flattened T waves, ST segment depression, and the presence of a U wave (small positive deflection after the T wave) are the classic ECG triad of hypokalemia. These changes reflect prolonged ventricular repolarization due to the hyperpolarized resting membrane potential." },
      { question: "The nurse administers 10 units of regular insulin IV with D50 for hyperkalemia. The rationale for monitoring blood glucose every 30 minutes for the next 4-6 hours is:", options: ["Insulin permanently removes potassium from the body", "The glucose infusion may cause diabetic ketoacidosis", "Insulin drives both glucose and K⁺ into cells, and hypoglycemia may occur as glucose is consumed intracellularly", "D50 always causes rebound hyperglycemia requiring insulin adjustment"], correct: 2, rationale: "Insulin activates Na⁺/K⁺-ATPase and glucose transporters (GLUT4), driving both K⁺ and glucose into cells. While D50 prevents immediate hypoglycemia, as the glucose is metabolized intracellularly, blood glucose can drop significantly. Monitoring every 30 minutes for 4-6 hours ensures early detection and treatment of hypoglycemia." }
    ]
  },

  "hyperkalemia-emergency-np": {
    title: "Hyperkalemia Emergency: ECG Progression",
    image: imgLethalDysrhythmias,
    cellular: {
      title: "Membrane Depolarization & Conduction Failure",
      content: "In hyperkalemia, elevated extracellular K⁺ reduces the electrochemical gradient across the cardiac cell membrane, decreasing the resting membrane potential from its normal −90 mV toward −70 to −60 mV. At this partially depolarized state, voltage-gated sodium channels transition from their resting (closed, activatable) state to their inactivated (closed, non-activatable) state. This means that when the cell attempts to depolarize, fewer functional sodium channels are available, producing a slower and lower-amplitude Phase 0 upstroke. The clinical result is slowed impulse conduction velocity, which manifests as progressive QRS widening on the ECG. Simultaneously, the reduced gradient accelerates Phase 3 repolarization (K⁺ efflux), producing the characteristic peaked, narrow T waves that are the earliest ECG sign of hyperkalemia. As K⁺ continues to rise, atrial myocytes  -  which are more sensitive to hyperkalemia than ventricular myocytes  -  lose their ability to depolarize, producing P wave flattening and eventual absence (sinoatrial arrest). The final pre-arrest pattern is the sine wave: a smooth, undulating waveform representing extreme QRS widening merging with the T wave, indicating imminent ventricular fibrillation or asystole."
    },
    riskFactors: [
      "End-stage renal disease (most common cause of severe hyperkalemia)",
      "Acute kidney injury (especially oliguric/anuric phase)",
      "Tumor lysis syndrome (massive intracellular K⁺ release from lysed tumor cells)",
      "Rhabdomyolysis and crush syndrome",
      "Massive hemolysis (transfusion reactions, autoimmune hemolytic anemia)",
      "Severe burns (cellular destruction releases K⁺)",
      "Medication combinations: ACE inhibitor + K⁺-sparing diuretic + NSAID (triple whammy)",
      "Succinylcholine administration in susceptible patients (burns, crush, denervation injuries)",
      "Adrenal insufficiency (Addison's disease  -  aldosterone deficiency)",
      "Diabetic ketoacidosis (acidosis-driven transcellular shift despite total body K⁺ depletion)"
    ],
    diagnostics: [
      "STAT serum potassium with repeat to rule out hemolysis artifact",
      "12-lead ECG immediately  -  compare with prior tracings for progression",
      "Continuous cardiac monitoring on telemetry",
      "Point-of-care blood gas with electrolytes for rapid K⁺ and pH assessment",
      "Comprehensive metabolic panel (creatinine, BUN, glucose, calcium, magnesium, phosphorus)",
      "Serum CK and myoglobin if rhabdomyolysis suspected",
      "Uric acid and LDH if tumor lysis syndrome suspected",
      "Digoxin level if applicable (hyperkalemia + digoxin = extreme arrhythmia risk)"
    ],
    management: [
      "STEP 1  -  STABILIZE: Calcium gluconate 10% IV over 2-3 minutes (onset 1-3 min, duration 30-60 min). Repeat in 5 minutes if ECG unchanged",
      "STEP 2  -  SHIFT: Regular insulin 10 units IV + D50W 25g IV (onset 15-30 min, lowers K⁺ by 0.5-1.5 mEq/L)",
      "STEP 2 ALT  -  SHIFT: Sodium bicarbonate 50 mEq IV if concurrent metabolic acidosis (shifts K⁺ intracellularly)",
      "STEP 2 ALT  -  SHIFT: Nebulized albuterol 10-20 mg (onset 15-30 min, lowers K⁺ by 0.5-1.0 mEq/L, additive with insulin)",
      "STEP 3  -  REMOVE: Sodium polystyrene sulfonate 15-30g orally or rectally (onset 1-6 hours), OR patiromer 8.4g orally (onset 4-7 hours)",
      "STEP 3  -  REMOVE: Emergent hemodialysis for K⁺ > 6.5 with ECG changes refractory to medical therapy, or K⁺ > 7.0",
      "STEP 3  -  REMOVE: Loop diuretic (furosemide 40-80mg IV) if renal function preserved  -  promotes renal K⁺ excretion",
      "Identify and treat underlying cause: stop offending medications, treat AKI, manage tumor lysis or rhabdomyolysis"
    ],
    nursingActions: [
      "Recognize ECG progression: peaked T → prolonged PR → absent P → wide QRS → sine wave → arrest",
      "Ensure IV calcium gluconate is immediately available and drawn up when K⁺ > 6.0 mEq/L",
      "Monitor blood glucose every 30 minutes for 4-6 hours after insulin/dextrose administration",
      "Ensure defibrillator is at bedside and functioning for any patient with K⁺ > 6.5 mEq/L with ECG changes",
      "Recheck serum potassium 1 hour after each intervention and then every 2 hours",
      "Monitor strict intake and output  -  document urine output hourly",
      "Assess for neuromuscular symptoms: ascending weakness, paresthesias, respiratory muscle involvement",
      "Discontinue all potassium-containing IV fluids and supplements",
      "Review medication list and hold ACE inhibitors, ARBs, K⁺-sparing diuretics, NSAIDs, and trimethoprim",
      "Prepare for possible emergent dialysis (verify vascular access, contact nephrology)",
      "Notify rapid response team or code team if sine wave pattern or hemodynamic instability develops",
      "Document interventions, timing, K⁺ levels, and ECG changes meticulously for continuity"
    ],
    signs: {
      left: [
        "ECG PROGRESSION (K⁺ 5.5-6.0): Peaked, tall, narrow T waves",
        "ECG PROGRESSION (K⁺ 6.0-6.5): Prolonged PR interval, flattened P waves",
        "ECG PROGRESSION (K⁺ 6.5-7.0): P wave disappearance (atrial standstill)",
        "ECG PROGRESSION (K⁺ 7.0-8.0): Widened QRS complex (>120ms)",
        "ECG PROGRESSION (K⁺ >8.0): Sine wave → ventricular fibrillation → asystole"
      ],
      right: [
        "Ascending muscle weakness (legs → trunk → arms → respiratory muscles)",
        "Paresthesias (tingling/numbness in extremities and perioral area)",
        "Areflexia (absent deep tendon reflexes)",
        "Bradycardia, heart blocks (first-degree → second-degree → third-degree)",
        "Hypotension and cardiovascular collapse"
      ]
    },
    medications: [
      {
        name: "Calcium Gluconate 10% IV",
        type: "Cardiac Membrane Stabilizer",
        action: "Raises the threshold potential of cardiac cells from approximately −65 mV toward −55 mV, restoring the normal voltage gap between resting potential and threshold. This counteracts the excitability changes caused by hyperkalemia without altering serum potassium. Onset: 1-3 minutes.",
        sideEffects: "Hypotension with rapid infusion, bradycardia, vein irritation, tissue necrosis if extravasated",
        contra: "Concurrent digoxin use (calcium + digoxin can precipitate fatal dysrhythmia  -  administer with extreme caution over 20-30 minutes if digoxin present)",
        pearl: "Duration only 30-60 minutes  -  MUST be followed by K⁺-lowering therapies. Can repeat dose in 5 minutes if ECG does not improve. Calcium CHLORIDE has 3x the bioavailable calcium but requires central line access due to tissue necrosis risk."
      },
      {
        name: "Sodium Zirconium Cyclosilicate (Lokelma)",
        type: "Potassium Binder (Newer Generation)",
        action: "Selectively captures K⁺ ions in exchange for hydrogen and sodium in the GI tract. Higher K⁺ selectivity than Kayexalate with faster onset (1-2 hours for initial effect). Does not use sorbitol, reducing risk of intestinal necrosis.",
        sideEffects: "Edema (sodium loading), hypokalemia with prolonged use",
        contra: "None significant",
        pearl: "Increasingly preferred over Kayexalate due to better safety profile. Can be used for both acute management and chronic maintenance in CKD patients. FDA-approved for emergency department use."
      }
    ],
    pearls: [
      "The ECG progression of hyperkalemia follows a predictable sequence: peaked T → prolonged PR → absent P → wide QRS → sine wave → arrest. Each stage correlates with increasing K⁺ and worsening conduction delay.",
      "Calcium gluconate is ALWAYS the first intervention for hyperkalemia with ECG changes  -  it works within minutes to stabilize the heart and buys time for definitive K⁺-lowering therapy",
      "All K⁺-shifting therapies (insulin, bicarb, albuterol) are TEMPORARY  -  potassium eventually shifts back out of cells. Must combine with removal strategies (dialysis, binders, diuretics)",
      "The triple whammy: ACE inhibitor + potassium-sparing diuretic + NSAID is a common medication combination that causes life-threatening hyperkalemia. Always review the medication list.",
      "In DKA, serum K⁺ may appear normal or elevated on admission due to acidosis-driven shift OUT of cells, but total body K⁺ is severely depleted. Once insulin and fluids are started, K⁺ drops rapidly  -  monitor extremely closely.",
      "Atrial tissue is more sensitive to hyperkalemia than ventricular tissue  -  this is why P waves disappear before QRS widening",
      "Never use calcium gluconate as the sole treatment  -  it does not change serum K⁺ and its protective effect wears off in 30-60 minutes"
    ],
    quiz: [
      { question: "An NP is treating a patient in the emergency department with K⁺ 7.2 mEq/L and a sine wave pattern on ECG. After administering calcium gluconate, which combination of interventions should be ordered next?", options: ["Oral Kayexalate alone and recheck K⁺ in 6 hours", "IV insulin 10 units + D50W AND nephrology consult for emergent dialysis", "Oral potassium restriction and follow-up in clinic in 1 week", "IV normal saline bolus and oral magnesium"], correct: 1, rationale: "A sine wave pattern with K⁺ 7.2 represents pre-arrest hyperkalemia. After calcium gluconate stabilizes the heart (temporary, 30-60 minutes), the priority is aggressive K⁺ shifting (insulin + dextrose for rapid onset) combined with definitive removal (emergent hemodialysis for refractory/severe cases). Kayexalate alone is too slow for this clinical emergency." },
      { question: "Why are peaked T waves the earliest ECG change in hyperkalemia?", options: ["Elevated K⁺ slows atrial conduction first", "The reduced K⁺ gradient accelerates Phase 3 repolarization (K⁺ efflux), making the T wave taller and narrower", "Hyperkalemia causes calcium channel blockade", "Excess K⁺ directly stimulates the SA node"], correct: 1, rationale: "When extracellular K⁺ rises, the K⁺ concentration gradient across the membrane decreases, but the electrochemical driving force for K⁺ efflux during Phase 3 repolarization actually increases. This produces faster, more synchronous repolarization of ventricular myocytes, creating taller, peaked, and narrower T waves on ECG." }
    ]
  }
};
