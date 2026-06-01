/**
 * Phase 3E — ECMO Learning Series
 *
 * 10 ECMO simulations covering: initiation, circuit physiology, complications,
 * weaning, and transport.
 *
 * Clinical references:
 *   - ELSO Guidelines 2021
 *   - Bartlett RH: ECMO: Extracorporeal Cardiopulmonary Support in Critical Care (4th ed)
 *   - Sidebotham D et al: Practical Management of Complex Cardiovascular Problems
 *   - Hamilton Health Sciences ECMO Protocol Library
 *   - SickKids Pediatric ECMO Program
 */

import type { AdvancedSimulation, ConsequenceOfInaction } from "./vent-advanced-simulation-engine";
import { adv, step, makeSimulation } from "./vent-advanced-simulation-engine";
import type { VentWaveformConfig } from "./vent-waveform-generator";

const noAction = (desc: string, events: ConsequenceOfInaction["timeline"], outcome: string, pearl: string): ConsequenceOfInaction =>
  ({ description: desc, timeline: events, finalOutcome: outcome, clinicalPearl: pearl });

// Minimal "rest" vent settings during ECMO — patients on ECMO typically have
// very low conventional vent support ("lung rest" strategy)
const ECMO_REST_VENT: VentWaveformConfig = {
  mode: "pressure_control",
  pip: 20,
  peep: 10,
  rr: 10,
  ti: 1.0,
  compliance: 22,
  resistance: 8,
  condition: "ards",
  asynchrony: "none",
};

// ─── 1. VV-ECMO Initiation ────────────────────────────────────────────────────

export const ecmo_vv_initiation: AdvancedSimulation = makeSimulation(
  "ecmo_vv_initiation",
  {
    category: "ecmo",
    title: "VV-ECMO Initiation for Refractory ARDS",
    summary: "Patient meets ECMO criteria — indications, cannulation strategy, and initial circuit management.",
    patient: "38 M, severe ARDS (influenza). OI 42 on optimal ventilation. P/F 62 on FiO₂ 100%. Hemodynamically stable.",
    difficulty: "advanced",
    estimatedMinutes: 10,
    competencies: ["VV-ECMO indications", "Cannulation strategy", "Initial flow management", "ECMO circuit physiology"],
  },
  [
    step("indication", {
      context: "38-year-old, severe ARDS: OI 42 on optimal lung-protective ventilation for 8 hours. FiO₂ 100%, PEEP 18, Vt 370 mL. Driving pressure 20 cmH₂O. SpO₂ 82%.",
      waveformConfig: { ...ECMO_REST_VENT, peep: 18, pip: 38 },
      vitals: { hr: 122, spo2: 82, rr: 20, bp: "102/62", fio2: 100 },
      labs: { ph: 7.28, paco2: 62, pao2: 41, pf_ratio: 41, lactate: 3.2 },
      question: "Does this patient meet ELSO criteria for VV-ECMO? What is the primary CONTRAINDICATION to check?",
      choices: [
        adv("a", "YES — OI > 40 for > 6 hours on optimal ventilation meets ELSO criteria. Primary contraindication: irreversible underlying condition (malignancy, severe anoxic brain injury). Check for futility before initiating.", true,
          "CORRECT. ELSO criteria for VV-ECMO: (1) PaO₂/FiO₂ < 100 despite optimal care × 6 hours; (2) Murray Score > 3.0; (3) OI > 40 × 6 hours. This patient meets criteria. PRIMARY contraindications: non-recoverable disease, untreatable underlying cause, severe aortic insufficiency (VA-ECMO contraindication). For VV-ECMO: advanced malignancy, chronic end-organ failure without transplant listing, severe COPD without transplant plan."),
        adv("b", "NO — the patient must also fail iNO and prone positioning before ECMO", false,
          "While iNO and prone positioning are used before ECMO in many protocols, ELSO does not REQUIRE failure of these adjuncts — it requires failure of optimal CONVENTIONAL ventilation for > 6 hours. If the patient is deteriorating on optimal therapy, ECMO can be initiated even without iNO or prone if those are judged unlikely to help."),
        adv("c", "YES — but only if the patient is VA-ECMO (cardiac support needed)", false,
          "This patient has no cardiac dysfunction. VV-ECMO provides RESPIRATORY support only. VA-ECMO is for cardiac failure or cardiac arrest. VV is the correct modality."),
        adv("d", "Cannot determine — need echocardiogram before any ECMO decision", false,
          "Echocardiogram is important (rules out cardiac failure needing VA-ECMO, identifies RV strain) but is not required before deciding on ECMO initiation criteria — which are based on oxygenation failure."),
      ],
      nextKey: "cannulation",
      keyLearning: "VV-ECMO criteria: OI > 40 or P/F < 100 for > 6 hours on optimal therapy. Check reversibility before initiating. ECMO is bridge-to-recovery — disease must be potentially reversible.",
      consequenceOfInaction: noAction(
        "ARDS with OI 42 and P/F 41: escalating VILI with each vent breath.",
        [
          { timeframe: "Hours", event: "Continued VILI from high driving pressure. ARDS worsening.", vitalsChange: { spo2: 72 } },
          { timeframe: "12–24 hours", event: "Refractory hypoxemia. pH < 7.20. Cardiac arrhythmia from hypoxia + acidosis.", vitalsChange: { sbp: 78 } },
          { timeframe: "24–48 hours", event: "Multi-organ failure from prolonged shock/hypoxemia. Death.", vitalsChange: { sbp: 0 } },
        ],
        "Multi-organ failure and death from refractory ARDS.",
        "ECMO survival in ARDS: 65–70% in ELSO registry. Early initiation (before multi-organ failure) improves outcomes. The CESAR trial: ECMO center transfer for severe ARDS improved survival (63% vs 47%).",
      ),
    }),
    step("cannulation", {
      context: "ECMO team at bedside. Planning cannulation. Patient has a right femoral vein and right internal jugular vein available.",
      waveformConfig: ECMO_REST_VENT,
      vitals: { hr: 118, spo2: 84, rr: 20, bp: "106/64", fio2: 100 },
      question: "For VV-ECMO: what is the standard adult cannulation strategy?",
      choices: [
        adv("a", "Drainage: RIGHT femoral vein (21–23 Fr) — drain deoxygenated blood from IVC/RA. Return: RIGHT internal jugular (19–21 Fr) — return oxygenated blood toward tricuspid valve for optimal cardiac delivery", true,
          "CORRECT. Standard VV-ECMO dual cannula configuration: DRAINAGE from the femoral vein (21–23 Fr) positioned in the IVC/RA junction; RETURN to the right IJV (19–21 Fr) positioned at the RA/SVC junction directed toward the tricuspid valve. Proper positioning minimizes RECIRCULATION (oxygenated return blood being immediately re-drained). Alternatively: dual-lumen Avalon cannula (27–31 Fr) in the right IJV — drains from SVC and IVC ports, returns to the RA aimed at the tricuspid."),
        adv("b", "Drainage: RIGHT femoral artery. Return: LEFT femoral vein — VA-ECMO configuration", false,
          "That is the VA-ECMO peripheral configuration (veno-arterial). This patient needs VV-ECMO (respiratory support only). VA-ECMO requires arterial cannulation."),
        adv("c", "Drainage: left femoral vein. Return: left femoral vein (same vein, both cannulae) — simplest approach", false,
          "Both cannulas in the same vessel would cause massive recirculation — oxygenated blood returns directly to the drainage cannula without passing through the patient's circulation."),
        adv("d", "Drainage: superior vena cava. Return: inferior vena cava — maximizes venous recruitment", false,
          "IVC-SVC is a valid configuration but draining FROM the SVC and returning TO the IVC means oxygenated blood is returned far from the heart. The standard is SVC drainage (IJV return) and IVC drainage (femoral). Position matters for minimizing recirculation."),
      ],
      nextKey: "initial_mgmt",
      keyLearning: "VV-ECMO: femoral drainage + right IJV return. Position matters for minimizing recirculation. Dual-lumen Avalon catheter (single site) is an alternative. Always confirm cannula positions with echo/fluoroscopy.",
    }),
    step("initial_mgmt", {
      context: "ECMO running: flow 4.5 L/min. Sweep gas 5 L/min, FdO₂ 100%. Pre-membrane SpO₂ 65%. Post-membrane SpO₂ 100%. Patient SpO₂ 82% (not improving as expected).",
      waveformConfig: { ...ECMO_REST_VENT, pip: 18, peep: 12, rr: 8 },
      vitals: { hr: 112, spo2: 82, rr: 8, bp: "108/66", fio2: 60 },
      question: "VV-ECMO running but patient SpO₂ only 82% despite post-membrane saturation of 100%. What is the cause?",
      choices: [
        adv("a", "RECIRCULATION — oxygenated blood returned to the IJV is being immediately drained by the femoral drainage cannula before it reaches the right heart/lungs. Increase flow to 5–6 L/min and reposition cannulae under echo guidance.", true,
          "CORRECT. Recirculation: in VV-ECMO, if the oxygenated return flow is drained back into the drainage cannula before it circulates through the body, the effective ECMO support is lower than the circuit flow suggests. Signs: high post-membrane SaO₂ (oxygenator working) but low patient SaO₂. Confirm with: (1) Pre-drainage blood gas darker than expected; (2) Echo showing jet from return cannula aimed at drainage cannula opening. Fix: increase total flow, reposition cannulae farther apart, consider Avalon dual-lumen cannula."),
        adv("b", "Oxygenator failure — the post-membrane saturation should be higher if working correctly", false,
          "Post-membrane SaO₂ 100% = oxygenator is functioning perfectly. The problem is AFTER the oxygenator — the oxygenated blood is not reaching the patient."),
        adv("c", "The patient's native lungs are shunting — increase FiO₂ on the ventilator", false,
          "Native lung shunting contributes to hypoxemia, but the sudden gap between excellent post-membrane saturation and poor patient saturation points to recirculation. Increasing vent FiO₂ on ECMO provides marginal benefit — the ECMO oxygenation is the primary support."),
        adv("d", "The flow is too low — the patient needs 10 L/min to achieve adequate oxygenation", false,
          "While increasing flow helps with recirculation, 10 L/min is above the capacity of most adult ECMO cannulae. The primary fix is positioning, not simply maximizing flow."),
      ],
      nextKey: "end",
      keyLearning: "VV-ECMO recirculation: oxygenated blood re-drained before systemic circulation. Diagnosed by: excellent post-membrane SaO₂ + poor patient SaO₂. Fix: increase flow, reposition cannulae. Echo guidance is essential.",
    }),
  ],
);

// ─── 2. Oxygenator Failure ────────────────────────────────────────────────────

export const ecmo_oxygenator_failure: AdvancedSimulation = makeSimulation(
  "ecmo_oxygenator_failure",
  {
    category: "ecmo",
    title: "Oxygenator Failure on VV-ECMO",
    summary: "ECMO circuit oxygenator failing — dark post-membrane blood, rising pre/post pressure difference.",
    patient: "Day 6 VV-ECMO for ARDS. Technician notices dark blood coming from the post-membrane limb.",
    difficulty: "advanced",
    estimatedMinutes: 8,
    competencies: ["Oxygenator failure recognition", "Circuit pressure monitoring", "Emergency circuit change", "ACT management"],
  },
  [
    step("recognize", {
      context: "VV-ECMO day 6. Pre-membrane blood: dark red. POST-membrane blood: also dark (should be bright red). Pre-membrane pressure 250 mmHg, post-membrane 310 mmHg. Normal: < 50 mmHg gradient.",
      waveformConfig: ECMO_REST_VENT,
      vitals: { hr: 108, spo2: 86, rr: 8, bp: "104/62", fio2: 60 },
      question: "What has occurred and what does the pressure gradient indicate?",
      choices: [
        adv("a", "Oxygenator failure — clot or fiber mat in the oxygenator is increasing resistance (elevated trans-oxygenator gradient) and preventing effective gas exchange (dark post-membrane blood). Plan for emergency oxygenator/circuit change.", true,
          "CORRECT. Oxygenator failure indicators: (1) Post-membrane blood dark (not oxygenated) = gas transfer failure; (2) Trans-membrane pressure gradient > 50 mmHg = increased resistance (clot/fiber mat obstruction); (3) May also see: falling ECMO flow at same RPM, increasing plasma leakage ('sweating' oxygenator). Oxygenator lifespan typically 2–4 weeks. Emergency: prepare circuit change. Stop anticoagulation temporarily if circuit change is imminent (reduces bleeding during change)."),
        adv("b", "The pump is running too fast — high pressure is damaging the blood", false,
          "High pump speed → high RPM → high pre-membrane pressure. Post-membrane pressure should be LOWER than pre-membrane. A HIGH post-membrane pressure relative to pre-membrane pressure means the oxygenator is obstructed. The pump speed is not the primary issue."),
        adv("c", "The drainage is inadequate — increase pump speed to improve flow", false,
          "Increasing pump speed against an obstructed oxygenator will further increase the trans-oxygenator gradient and risks catastrophic circuit failure. Oxygenator change is required."),
        adv("d", "The sweep gas flow is too low — increase sweep gas to 10 L/min", false,
          "Increasing sweep gas helps with CO₂ elimination but cannot restore gas exchange through a clotted oxygenator. The oxygenator fiber surface is blocked — gas cannot contact the blood."),
      ],
      nextKey: "circuit_change",
      keyLearning: "Oxygenator failure: dark post-membrane blood + high trans-oxygenator pressure gradient. Plan circuit change. Oxygenator lifespan 2–4 weeks. Monitor trans-membrane gradient daily.",
      consequenceOfInaction: noAction(
        "A failing oxygenator means the patient is effectively OFF ECMO support.",
        [
          { timeframe: "30–60 minutes", event: "SpO₂ declining as native lung cannot compensate. CO₂ rising.", vitalsChange: { spo2: 72 } },
          { timeframe: "1–2 hours", event: "Hemodynamic instability from hypoxia + acidosis. Risk of catastrophic circuit rupture at the failed oxygenator.", vitalsChange: { sbp: 80 } },
        ],
        "Circuit rupture or hemodynamic collapse from untreated oxygenator failure.",
        "Trans-oxygenator pressure monitoring is a mandatory daily check on all ECMO circuits. Rising gradient = failing oxygenator. Plan the circuit change before crisis, not during it.",
      ),
    }),
    step("circuit_change", {
      context: "Circuit change planned. ACT (activated clotting time) currently 220 seconds. Team is assembling. Two ECMO-trained perfusionists available.",
      waveformConfig: ECMO_REST_VENT,
      vitals: { hr: 112, spo2: 88, rr: 8, bp: "106/64", fio2: 70 },
      question: "Preparing for emergency circuit change. What anticoagulation change do you make?",
      choices: [
        adv("a", "Reduce heparin infusion 30 minutes before the circuit change — target ACT 150–180 during the procedure to reduce bleeding risk. Resume full anticoagulation immediately after new circuit is primed and running.", true,
          "CORRECT. Circuit change anticoagulation strategy: (1) Reduce heparin 30 minutes before change to lower bleeding risk during the procedure (cannula clamping/unclamping, blood exposure); (2) Target ACT 150–180 during change (below therapeutic 180–200); (3) Give a heparin bolus (50–100 U/kg) and prime the new circuit with blood-prime to prevent clotting during the rapid change; (4) Return to therapeutic ACT immediately after reconnection."),
        adv("b", "Hold heparin for 6 hours to allow complete anticoagulation clearance before circuit change", false,
          "Six-hour heparin hold risks circuit thrombosis, cannula clotting, and catastrophic clot embolism when the circuit is reconnected. A partial reduction for 30 minutes is appropriate — not complete cessation."),
        adv("c", "Give protamine to fully reverse heparin — zero anticoagulation during circuit change", false,
          "Complete heparin reversal during circuit change risks immediate thrombosis in the new circuit and in the patient's own vasculature. Protamine is used for catastrophic bleeding only, not routine circuit changes."),
        adv("d", "Increase heparin to target ACT > 300 during circuit change — prevent any clotting in the new circuit", false,
          "Higher anticoagulation during the physical manipulation of the circuit increases bleeding risk at the cannula sites (which are being clamped/unclamped). ACT 150–180 during the change is the balance."),
      ],
      nextKey: "end",
      keyLearning: "Circuit change anticoagulation: reduce heparin 30 min before → ACT 150–180 during change → resume full anticoagulation immediately after. Never zero-anticoagulate ECMO patients.",
    }),
  ],
);

// ─── 3. ECMO Hemorrhage ───────────────────────────────────────────────────────

export const ecmo_hemorrhage: AdvancedSimulation = makeSimulation(
  "ecmo_hemorrhage",
  {
    category: "ecmo",
    title: "Hemorrhage on ECMO",
    summary: "Major bleeding complication — balancing hemorrhage control vs circuit thrombosis.",
    patient: "ARDS patient, day 4 VV-ECMO. Sudden large-volume bloody output from chest tubes (400 mL in 1 hour).",
    difficulty: "advanced",
    estimatedMinutes: 8,
    competencies: ["ECMO hemorrhage management", "Anticoagulation reversal", "Transfusion on ECMO", "Surgical hemostasis"],
  },
  [
    step("bleeding", {
      context: "VV-ECMO day 4: 400 mL blood from chest tubes in 1 hour. BP 88/52, HR 142. ACT 215 seconds. Hb 76 g/L from 110 g/L. Heparin infusion currently 18 U/kg/hr.",
      waveformConfig: ECMO_REST_VENT,
      vitals: { hr: 142, spo2: 90, rr: 8, bp: "88/52", fio2: 70 },
      labs: { hgb: 7.6, lactate: 3.8, inr: 1.3 },
      question: "400 mL/hr chest tube output on ECMO. Immediate management priority?",
      choices: [
        adv("a", "Reduce heparin to 10 U/kg/hr (target ACT 150–160) + transfuse pRBC 1 unit + call surgery for operative hemostasis evaluation + hold protamine in reserve if ACT does not fall adequately", true,
          "CORRECT. ECMO hemorrhage: (1) Reduce, don't zero, the heparin infusion — complete reversal risks circuit thrombosis which is also life-threatening; (2) Transfuse: target Hb ≥ 100 g/L on ECMO (higher than usual — oxygen delivery depends on ECMO flow × CaO₂); (3) Surgical evaluation for chest tube bleeding — may need re-exploration or embolization; (4) Reversal agents: protamine (full reversal) only if bleeding is life-threatening AND circuit change is ready (cannot leave patient with a clotting circuit)."),
        adv("b", "Full heparin reversal with protamine 1 mg/100 U of heparin administered — stop all bleeding immediately", false,
          "Full reversal risks circuit thrombosis within minutes. The ECMO circuit will clot, the patient will be left off ECMO support, AND massive clot embolism can occur. Protamine is a last resort, not a first response."),
        adv("c", "Increase heparin to prevent cannula clotting — the surgery will be stopped later", false,
          "Increasing anticoagulation during active hemorrhage is contraindicated. This approach worsens bleeding."),
        adv("d", "Transfuse FFP to correct the INR — the underlying cause of bleeding is coagulopathy", false,
          "INR 1.3 is mildly elevated but not the primary driver of 400 mL/hr chest tube bleeding. Surgical source (anastomosis, adhesion bleeding) must be excluded. FFP alone is insufficient."),
      ],
      nextKey: "transfusion_ecmo",
      keyLearning: "ECMO hemorrhage: reduce heparin (don't zero), transfuse, call surgery. Hb target ≥ 100 g/L on ECMO. Never fully reverse heparin without a circuit change ready — thrombosis risk is immediate.",
    }),
    step("transfusion_ecmo", {
      context: "Heparin reduced. Surgical team taking patient to OR for chest tube exploration. 2 units pRBC ordered. What Hb target on ECMO?",
      waveformConfig: ECMO_REST_VENT,
      vitals: { hr: 128, spo2: 88, rr: 8, bp: "96/58", fio2: 70 },
      question: "Why is the hemoglobin target higher on ECMO compared to standard ICU patients?",
      choices: [
        adv("a", "On ECMO, oxygen delivery (DO₂) = ECMO flow × CaO₂ (1.34 × Hb × SaO₂ × ECMO flow). Lower Hb directly reduces DO₂ — must maintain Hb ≥ 100 g/L to compensate for limited ECMO circuit flow", true,
          "CORRECT. DO₂ on VV-ECMO is largely determined by the ECMO circuit — blood is oxygenated by the oxygenator and returned to the patient. The circuit flow is typically 4–6 L/min. DO₂ = ECMO flow × CaO₂. Since we cannot always increase flow (limited by cannula size), maximizing CaO₂ means maintaining Hb ≥ 100 g/L. ECMO patients are genuinely oxygen-delivery limited — anemia directly reduces DO₂ with no compensatory mechanism."),
        adv("b", "ECMO anticoagulation causes hemolysis — higher transfusion threshold compensates for destruction", false,
          "While ECMO causes some hemolysis (shear stress), the primary reason for higher Hb target is oxygen delivery optimization, not hemolysis compensation."),
        adv("c", "The ECMO circuit requires higher viscosity blood to prevent circuit stagnation", false,
          "Viscosity is a concern but the primary Hb target is driven by oxygen delivery optimization, not circuit viscosity. Higher Hb does increase viscosity but this is not the rationale for the target."),
        adv("d", "ECMO patients receive high FiO₂ through the oxygenator — more Hb molecules needed to carry the extra oxygen", false,
          "The oxygenator fully saturates the blood that passes through it (SaO₂ 100% post-membrane). More Hb increases the total O₂ content per unit of blood that flows through the circuit."),
      ],
      nextKey: "end",
      keyLearning: "ECMO Hb target: ≥ 100 g/L. DO₂ on ECMO = ECMO flow × CaO₂. Cannot easily increase flow → maximize CaO₂ with higher Hb target. This is fundamentally different from non-ECMO ICU care.",
    }),
  ],
);

// ─── 4. VA-ECMO — Cardiogenic Shock ──────────────────────────────────────────

export const ecmo_va_cardiogenic: AdvancedSimulation = makeSimulation(
  "ecmo_va_cardiogenic",
  {
    category: "ecmo",
    title: "VA-ECMO for Cardiogenic Shock",
    summary: "Massive anterior STEMI with cardiogenic shock — VA-ECMO initiation, LV distension risk, Harlequin syndrome.",
    patient: "52 M, massive anterior STEMI, post-PCI. Ejection fraction 10%. MAP 48 on norepinephrine + dobutamine. Refractory shock.",
    difficulty: "advanced",
    estimatedMinutes: 10,
    competencies: ["VA-ECMO indications", "LV distension", "Harlequin syndrome", "VA-ECMO weaning strategy"],
  },
  [
    step("indication", {
      context: "Post-PCI, EF 10%, MAP 48, cardiac index 1.1 L/min/m² despite norepinephrine + dobutamine. Lactate 6.8. No LVAD available. Team discussing VA-ECMO.",
      waveformConfig: { mode: "volume_control", flowPattern: "square", peep: 5, tidalVolume: 500, rr: 14, ti: 1.0, compliance: 60, resistance: 6, condition: "normal" },
      vitals: { hr: 132, spo2: 90, rr: 22, bp: "82/52", map_bp: 62, fio2: 60 },
      labs: { lactate: 6.8, ph: 7.22 },
      question: "How does VA-ECMO differ from VV-ECMO physiologically, and what is the key LV risk?",
      choices: [
        adv("a", "VA-ECMO drains deoxygenated venous blood and returns oxygenated blood to the ARTERIAL system — providing both cardiac AND respiratory support. Key LV risk: LV DISTENSION — ECMO afterload increase against a non-functioning LV causes LV dilation and pulmonary edema.", true,
          "CORRECT. VA-ECMO: drains from venous system, returns to arterial system (femoral artery or aorta). Provides 50–70% of cardiac output. LV distension risk: The ECMO pump perfuses the aorta retrogradely, INCREASING LV afterload. A non-contractile LV cannot overcome this afterload → blood stagnates in the LV → LV dilates → pulmonary edema worsens → 'ECMO pulmonary edema.' Must monitor LV size and function daily with echo. Intervention: LV venting (IABP, Impella, or surgical LV decompression)."),
        adv("b", "VA-ECMO is identical to VV-ECMO but with higher flows — both provide cardiac support", false,
          "VV-ECMO provides RESPIRATORY support only (no cardiac output support — blood is returned to the venous system). VA-ECMO provides both cardiac AND respiratory support by returning blood to the arterial side."),
        adv("c", "VA-ECMO prevents LV distension by reducing pulmonary blood flow", false,
          "VA-ECMO INCREASES LV afterload (retrograde aortic flow). This CAUSES LV distension in non-contractile hearts — it does not prevent it."),
        adv("d", "The key risk is PULMONARY EMBOLISM from venous stasis during VA-ECMO", false,
          "PE risk exists in all critically ill patients. The specific, unique risk of VA-ECMO in cardiogenic shock is LV distension from retrograde afterload."),
      ],
      nextKey: "harlequin",
      keyLearning: "VA-ECMO: arterial return → cardiac + respiratory support. LV distension = major risk when LV not ejecting against ECMO afterload. Monitor with daily echo. LV vent (IABP/Impella) if distension occurs.",
    }),
    step("harlequin", {
      context: "Day 3 VA-ECMO: cardiac function partially recovering (EF 22%). Now: RIGHT wrist SpO₂ 88%, LEFT foot SpO₂ 96%. Aortic pulsation now palpable. Upper extremity looks cyanotic.",
      waveformConfig: ECMO_REST_VENT,
      vitals: { hr: 92, spo2: 96, rr: 14, bp: "102/64", fio2: 40 },
      question: "Upper body cyanosis (right SpO₂ 88%) but lower body well-oxygenated (left foot SpO₂ 96%). What is this?",
      choices: [
        adv("a", "HARLEQUIN SYNDROME (North-South Syndrome) — as cardiac function recovers, the native heart pumps deoxygenated blood (lungs still diseased) into the ascending aorta perfusing the coronaries and brain. ECMO oxygenated blood perfuses the descending aorta and lower body.", true,
          "CORRECT. Harlequin syndrome occurs when: (1) Cardiac function recovers enough to push blood out of the LV; (2) Native lungs are still severely diseased (low SpO₂ blood from LV); (3) ECMO return is in the femoral artery (descending aorta). The LV pumps deoxygenated blood to the aortic arch → coronary and cerebral circulation (deoxygenated). ECMO return from below → lower extremities (oxygenated). Result: brain and coronary arteries perfused with deoxygenated blood despite adequate ECMO flow. Fix: (1) Convert to VV-ECMO if respiratory support only now needed; (2) Add VV component (hybrid VAV-ECMO); (3) Move ECMO return to ascending aorta (central cannulation)."),
        adv("b", "Arterial vasospasm in the upper extremities from ECMO anticoagulation", false,
          "Arterial vasospasm would not produce a bilateral pre/post ductal SpO₂ pattern. Harlequin syndrome is the specific, recognized diagnosis for this SpO₂ distribution pattern on VA-ECMO."),
        adv("c", "The ECMO is providing too much support — reduce pump flow to allow more native cardiac output", false,
          "Reducing pump flow in Harlequin syndrome means less ECMO return, which reduces the oxygenated blood available to the upper body (perfused by the LV). This worsens the mismatch."),
        adv("d", "Subclavian artery stenosis from the ECMO — interventional radiology evaluation needed", false,
          "Subclavian stenosis would produce unilateral arm symptoms, not the bilateral upper body pattern of Harlequin syndrome."),
      ],
      nextKey: "end",
      keyLearning: "Harlequin syndrome: right SpO₂ < left foot SpO₂ on VA-ECMO = native deoxygenated blood perfusing the coronaries and brain. Fix: convert to VV-ECMO, add VV component, or central cannulation.",
    }),
  ],
);

// ─── 5. ECMO Weaning ─────────────────────────────────────────────────────────

export const ecmo_weaning: AdvancedSimulation = makeSimulation(
  "ecmo_weaning",
  {
    category: "ecmo",
    title: "ECMO Weaning — VV-ECMO for ARDS",
    summary: "Day 12 VV-ECMO — lung function recovering. Systematic weaning trial and decannulation.",
    patient: "ARDS patient, day 12 VV-ECMO. Pulmonary function improving. Team ready to attempt weaning.",
    difficulty: "intermediate",
    estimatedMinutes: 7,
    competencies: ["VV-ECMO weaning criteria", "Flow reduction trial", "Decannulation protocol", "Post-ECMO vent management"],
  },
  [
    step("criteria", {
      context: "Day 12 VV-ECMO: oxygenator function normal. Ventilator: FiO₂ 50%, PEEP 12, Vt 380 mL. While on ECMO flow 4 L/min: SpO₂ 94%, PaO₂ 82. FiO₂ 50% via the oxygenator.",
      waveformConfig: ECMO_REST_VENT,
      vitals: { hr: 88, spo2: 94, rr: 14, bp: "118/74", fio2: 50 },
      labs: { ph: 7.40, paco2: 42, pao2: 82 },
      question: "What parameters indicate readiness to begin VV-ECMO weaning trial?",
      choices: [
        adv("a", "Readiness: (1) FiO₂ < 60% on the ECMO oxygenator sweep + (2) SpO₂ ≥ 92% at current ECMO support + (3) Improving lung compliance on ventilator + (4) No metabolic acidosis (lactate normal). Begin trial by reducing ECMO flow by 0.5–1 L/min steps while monitoring gas exchange.", true,
          "CORRECT. VV-ECMO weaning criteria: (1) FiO₂ via circuit < 40–60%; (2) Adequate SpO₂ on ECMO support; (3) Improving pulmonary mechanics (rising compliance, falling driving pressure); (4) Normal hemodynamics and lactate. Weaning method: reduce flow in 0.5–1 L/min steps. Native lung takes over progressively. Final test: clamp ECMO for 30–60 minutes on ventilator support — if tolerated, decannulate."),
        adv("b", "Cannot wean until FiO₂ is < 21% on the circuit — patient must be on room air ECMO before weaning", false,
          "FiO₂ < 21% is not a requirement for weaning. FiO₂ < 40–60% on the circuit with adequate SpO₂ indicates sufficient native lung recovery."),
        adv("c", "Weaning is safe only when the original cause of ARDS is fully resolved (e.g., negative cultures)", false,
          "The original infection may not be fully resolved but the LUNGS may have recovered enough to support oxygenation without ECMO. Clinical and physiological readiness is the criterion, not microbiological resolution."),
        adv("d", "Wean when ventilator settings have returned to FiO₂ 21% and PEEP 5 — indicates full lung recovery", false,
          "Waiting for full conventional vent weaning before starting ECMO wean is overly conservative. ECMO flow reduction and conventional vent weaning happen simultaneously."),
      ],
      nextKey: "trial",
      keyLearning: "VV-ECMO weaning: FiO₂ < 60% on circuit + SpO₂ ≥ 92% + improving mechanics + normal lactate. Reduce flow in 0.5–1 L/min steps. Final: clamp trial for 30–60 min. If tolerated → decannulate.",
    }),
    step("trial", {
      context: "Flow reduced from 4.0 → 2.0 L/min over 2 hours. SpO₂ 93%, PaO₂ 76 on FiO₂ 55%. Now attempting 1-hour flow clamp trial.",
      waveformConfig: { ...ECMO_REST_VENT, peep: 14, pip: 24, rr: 14 },
      vitals: { hr: 94, spo2: 92, rr: 14, bp: "116/72", fio2: 58 },
      question: "During the 1-hour clamp trial: what are the failure criteria?",
      choices: [
        adv("a", "Clamp trial failure: SpO₂ < 88%, PaO₂ < 60 mmHg, pH < 7.30, PaCO₂ > 60 mmHg despite vent optimization, hemodynamic deterioration (MAP < 60), or clinical distress — any one criterion → resume ECMO flow immediately", true,
          "CORRECT. VV-ECMO clamp trial failure criteria (ELSO/institutional): SpO₂ < 88%, PaO₂ < 60, pH < 7.30, PaCO₂ > 60 on optimal ventilation, MAP < 60, or significant patient distress. If any criterion is met: unclamp IMMEDIATELY and return to previous flow. Do not decannulate until a clamp trial of ≥ 30–60 minutes is successfully completed. If the patient fails: return to weaning; retry in 24–48 hours."),
        adv("b", "Failure only if SpO₂ < 80% — mild desaturation is expected during clamp trial", false,
          "SpO₂ < 88% is the commonly used failure threshold, not 80%. Accepting SpO₂ 80–88% during a CLAMP TRIAL with potential for 60 minutes of hypoxemia is dangerous."),
        adv("c", "Success requires SpO₂ ≥ 99% during the entire clamp trial", false,
          "SpO₂ ≥ 92% is adequate for clamp trial success. A target of ≥ 99% is unrealistic for recovering ARDS and would prevent most legitimate weaning."),
        adv("d", "The circuit cannot be clamped for VV-ECMO — flow reduction alone is the weaning method", false,
          "Clamping (stopping flow) is the definitive weaning test for VV-ECMO. It confirms that native lung can support gas exchange without any ECMO assistance. Flow reduction down to 1 L/min is not zero flow — clamping is required to truly test decannulation readiness."),
      ],
      nextKey: "end",
      keyLearning: "VV-ECMO clamp trial failure: SpO₂ < 88%, pH < 7.30, PaCO₂ > 60, MAP < 60 → unclamp immediately. 30–60 minute successful trial = decannulate. Failed trial: return to weaning, retry in 24–48 hours.",
    }),
  ],
);

// ─── 6. Cannula Migration ─────────────────────────────────────────────────────

export const ecmo_cannula_migration: AdvancedSimulation = makeSimulation(
  "ecmo_cannula_migration",
  {
    category: "ecmo",
    title: "ECMO Cannula Migration",
    summary: "Sudden drop in ECMO flow — drainage cannula migrated out of optimal position.",
    patient: "Day 2 VV-ECMO. Nurse repositioning patient for care. ECMO flow drops from 4.5 to 2.0 L/min. Alarms activating.",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    competencies: ["Cannula migration recognition", "ECMO flow alarms", "Position correction", "Chatter recognition"],
  },
  [
    step("chatter", {
      context: "After patient repositioning: ECMO flow drops 4.5 → 2.0 L/min. Pump shows 'chatter' — visible tubing vibration/oscillation in the drainage limb. SpO₂ decreasing. ECMO alarm: LOW FLOW.",
      waveformConfig: ECMO_REST_VENT,
      vitals: { hr: 118, spo2: 86, rr: 8, bp: "104/62", fio2: 70 },
      question: "'Chatter' in ECMO drainage tubing means what, and what is the first intervention?",
      choices: [
        adv("a", "Chatter = inadequate venous return (preload) to the drainage cannula — blood flow is intermittently interrupted as the drainage cannula 'sucks' against a wall or collapses the vessel. First: VOLUME CHALLENGE (250–500 mL NS) to improve venous return AND check cannula position.", true,
          "CORRECT. ECMO drainage chatter: the centrifugal pump maintains speed but cannot sustain flow because venous return is inadequate. Causes: (1) Hypovolemia — give volume; (2) Cannula migration — tip is against a vessel wall or out of optimal position; (3) Cardiac tamponade or elevated intrathoracic pressure limiting RV filling. First intervention: volume challenge (immediate) + reposition patient back to original position + Echocardiogram to visualize cannula tip. If chatter persists after volume: stop pump, reposition cannula under echo/fluoroscopy guidance."),
        adv("b", "Chatter means the pump is running too fast — reduce RPM immediately", false,
          "Chatter is caused by INADEQUATE INFLOW to the pump (low preload), not excessive pump speed. Reducing RPM will lower flow further. Increase preload first."),
        adv("c", "Chatter = oxygenator clotting — prepare for circuit change", false,
          "Oxygenator failure appears as dark post-membrane blood and high trans-membrane gradient — not chatter. Chatter is specifically a drainage limb phenomenon from inadequate venous return."),
        adv("d", "Chatter is normal at low flows — no action required", false,
          "Chatter is never normal. It indicates inadequate venous return and puts the pump at risk of hemolysis (cavitation) and low cardiac output from inadequate ECMO support."),
      ],
      nextKey: "reposition",
      keyLearning: "ECMO chatter = inadequate drainage preload. Volume challenge first. Check cannula position. Reduce pump speed if persistent (prevents hemolysis). Echo/fluoroscopy for repositioning.",
    }),
    step("reposition", {
      context: "After 500 mL NS and repositioning the patient supine: chatter improved, flow 3.8 L/min. Echo shows drainage cannula tip in mid-RA (acceptable). Residual flow limitation thought to be positional.",
      waveformConfig: ECMO_REST_VENT,
      vitals: { hr: 108, spo2: 90, rr: 8, bp: "110/68", fio2: 60 },
      question: "How do you prevent future cannula migration with repositioning?",
      choices: [
        adv("a", "Securely suture/anchor all ECMO cannulae at the insertion site, mark external cannula length with permanent marker, and limit patient repositioning changes to those required (with a 2-person ECMO-trained team present)", true,
          "CORRECT. Cannula migration prevention: (1) All ECMO cannulae secured with sutures at insertion sites and to the patient's skin (not just taped); (2) Mark the external length of the cannula with marker at the skin exit point — any movement is immediately visible; (3) Use minimum-marking repositioning protocols; (4) Ensure an ECMO-trained team member observes every significant repositioning; (5) Echo cannula position verification after any repositioning."),
        adv("b", "Never reposition ECMO patients — they must remain perfectly still for the duration of ECMO", false,
          "Immobility causes pressure injuries, DVT, and rehabilitation delays. ECMO patients must be repositioned using careful, structured protocols with trained personnel."),
        adv("c", "Increase pump RPM during repositioning to maintain flow despite movement", false,
          "Higher RPM during repositioning doesn't prevent migration. If the tip migrates, higher RPM worsens chatter and hemolysis risk."),
        adv("d", "Apply elastic bandage around the cannula insertion site to immobilize it", false,
          "Elastic bandage could impair venous flow at the cannula site or mask migration. Proper suturing is the appropriate securement method."),
      ],
      nextKey: "end",
      keyLearning: "ECMO cannula migration prevention: suture securement + skin marking + minimal repositioning + trained observer present + echo verification after repositioning. Mark the external length.",
    }),
  ],
);

// ─── 7–10: Additional ECMO simulations ────────────────────────────────────────

export const ecmo_clot: AdvancedSimulation = makeSimulation(
  "ecmo_clot",
  {
    category: "ecmo",
    title: "Clot Formation in ECMO Circuit",
    summary: "Subtherapeutic anticoagulation leads to visible clot in the circuit — management and monitoring.",
    patient: "Day 8 VV-ECMO. Perfusionist observes dark material in the oxygenator.",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    competencies: ["ECMO anticoagulation monitoring", "ACT vs anti-Xa", "Clot detection", "Heparin adjustment"],
  },
  [
    step("detect", {
      context: "Day 8 VV-ECMO. ACT 148 seconds (target 180–200). Anti-Xa 0.18 IU/mL (target 0.3–0.7). Perfusionist sees dark streaks in oxygenator housing. Circuit pressure gradient increasing.",
      waveformConfig: ECMO_REST_VENT,
      vitals: { hr: 102, spo2: 92, rr: 8, bp: "108/66", fio2: 50 },
      question: "Subtherapeutic anticoagulation + dark streaks in oxygenator. Immediate actions?",
      choices: [
        adv("a", "Heparin bolus 25–50 U/kg IV + increase heparin infusion by 10–20% + recheck ACT and anti-Xa in 30–60 minutes. Increase circuit inspection frequency to q4h.", true,
          "CORRECT. ECMO clot management: (1) Immediate heparin bolus to rapidly raise ACT; (2) Increase infusion rate; (3) Monitor closely — small visible clot may stabilize with improved anticoagulation; (4) If clot visible in oxygenator with worsening gas exchange or pressure gradient: plan circuit change. Anti-Xa is more accurate than ACT alone for heparin monitoring (not affected by hypothermia, hemodilution). Target anti-Xa 0.3–0.7 IU/mL."),
        adv("b", "Full heparin reversal with protamine — if there is clot, reversal is necessary to prevent embolism", false,
          "Reversal in the context of a clotting circuit is catastrophic — circuit thrombosis occurs within minutes. Increase anticoagulation, not reverse it."),
        adv("c", "Reduce pump RPM to avoid dislodging the clot — high shear stress may fragment it", false,
          "Reducing RPM reduces flow and may worsen stagnation — the opposite of what is needed. Adequate anticoagulation and flow are the primary defenses against clot progression."),
        adv("d", "Add aspirin 81 mg daily — platelet inhibition to prevent further clot growth", false,
          "Aspirin is sometimes added in ECMO protocols, but the IMMEDIATE action for acute sub-therapeutic anticoagulation and visible clot is heparin augmentation, not adding aspirin."),
      ],
      nextKey: "end",
      keyLearning: "ECMO clot: heparin bolus + infusion increase + frequent inspection. Use anti-Xa (more accurate than ACT) for monitoring. Target anti-Xa 0.3–0.7. Visible clot + worsening pressure gradient → circuit change planning.",
    }),
  ],
);

export const ecmo_transport: AdvancedSimulation = makeSimulation(
  "ecmo_transport",
  {
    category: "ecmo",
    title: "ECMO Transport",
    summary: "VV-ECMO patient requires interfacility transfer — team requirements, equipment checklist, and in-transit emergencies.",
    patient: "Day 3 VV-ECMO at a community hospital. Transferring to ECMO center 120 km away by ambulance.",
    difficulty: "advanced",
    estimatedMinutes: 8,
    competencies: ["ECMO transport indications", "Mobile ECMO team composition", "Transport circuit checklist", "In-transit emergency management"],
  },
  [
    step("preparation", {
      context: "Community hospital VV-ECMO patient stable: flow 4.5 L/min, sweep 4 L/min, FiO₂ 100% via circuit. SpO₂ 91%. Hemodynamically stable. Transfer accepted by ECMO center. 2-hour ambulance transport.",
      waveformConfig: ECMO_REST_VENT,
      vitals: { hr: 108, spo2: 91, rr: 8, bp: "112/68", fio2: 60 },
      question: "Essential team composition for VV-ECMO transport?",
      choices: [
        adv("a", "Minimum: 1 ECMO-trained perfusionist + 1 ECMO-experienced physician + 1 ECMO-trained RN/RT + 2 ALS-certified paramedics — plus mobile ECMO circuit with transport centrifuge pump, O₂ supply calculated for 3× estimated transport time.", true,
          "CORRECT. ECMO transport minimum team: (1) ECMO-trained perfusionist (manages circuit); (2) ECMO physician (manages clinical decisions, emergency interventions); (3) ECMO-trained nurse/RT (manages patient, medications, vent); (4) Transport crew. Equipment: transport centrifuge pump, hand-crank backup, portable oxygenator, 3× estimated O₂ supply, backup circuit components, emergency medication kit including protamine (circuit clot emergency). Pre-transport stability target: ACT therapeutic, no chatter, flow stable × 2 hours minimum."),
        adv("b", "Two paramedics with the hospital's ECMO team physician on call by phone — reduces transport team size", false,
          "Remote physician consultation is insufficient for managing ECMO emergencies in transport. An ECMO-trained physician and perfusionist MUST be physically present with the patient."),
        adv("c", "One perfusionist is sufficient — the ECMO runs itself during stable transport", false,
          "ECMO does not 'run itself.' The circuit can develop chatter, clot, oxygenator failure, or require anticoagulation adjustment at any time. A full team is required."),
        adv("d", "Send only the RT and ECMO nurse — wait for physician to meet at receiving facility", false,
          "If the ECMO circuit emergency requires intervention (clamp, circuit change, decannulation) during transport, a physician must be physically present."),
      ],
      nextKey: "transit",
      keyLearning: "ECMO transport: full team required (perfusionist + physician + nurse/RT). Triple the O₂ supply. Hand-crank backup pump. Pre-transport stability × 2 hours minimum. ECMO does not transport itself.",
    }),
    step("transit", {
      context: "60 minutes into transport: ECMO flow drops from 4.5 to 3.0 L/min. Chatter in drainage line. Roads are bumpy. Patient position unchanged.",
      waveformConfig: ECMO_REST_VENT,
      vitals: { hr: 122, spo2: 88, rr: 8, bp: "106/62", fio2: 70 },
      question: "ECMO chatter during transport — unique transport-specific consideration?",
      choices: [
        adv("a", "Give 250 mL NS bolus. PULL OVER — vibration from the vehicle may be contributing to chatter and preventing proper assessment. Assess cannula position and patient position before resuming transport.", true,
          "CORRECT. Transport-specific ECMO management: vibration and movement amplify cannula positioning issues. Pulling over stabilizes the vehicle and allows proper assessment of chatter. Volume challenge simultaneously. During a moving vehicle assessment, reliable echo and assessment are difficult — stop the vehicle, stabilize, assess, then determine if transport can resume. Chatter resolution → resume transport. Persistent chatter despite volume + position → consider whether to continue transport or stabilize first."),
        adv("b", "Continue transport at full speed — the receiving ECMO center can manage the chatter on arrival", false,
          "Chatter causes hemolysis and inadequate ECMO support. Arriving at the ECMO center 60 minutes later with ongoing chatter means 60 minutes of preventable hemolysis and decreasing flow."),
        adv("c", "Reduce pump RPM by 500 to decrease the chatter amplitude — safer at lower flow", false,
          "Reducing RPM worsens the underlying problem (insufficient preload for the RPM) and worsens chatter. Volume is the appropriate first intervention."),
        adv("d", "Clamp the circuit and manually bag the patient for the remainder of the transport", false,
          "Manual bag ventilation for 60 minutes in refractory ARDS on ECMO is not feasible and loses all ECMO support. The circuit must be maintained."),
      ],
      nextKey: "end",
      keyLearning: "ECMO transport emergencies: PULL OVER for adequate assessment. Vehicle vibration confounds assessment. Volume for chatter. Do not manage ECMO emergencies in a moving vehicle if avoidable.",
    }),
  ],
);

// ─── Registry ──────────────────────────────────────────────────────────────────

export const ECMO_SIMULATIONS: readonly AdvancedSimulation[] = [
  ecmo_vv_initiation,
  ecmo_oxygenator_failure,
  ecmo_hemorrhage,
  ecmo_va_cardiogenic,
  ecmo_weaning,
  ecmo_cannula_migration,
  ecmo_clot,
  ecmo_transport,
];

export function getEcmoSimulation(id: string): AdvancedSimulation | undefined {
  return ECMO_SIMULATIONS.find((s) => s.id === id);
}
