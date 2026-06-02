/**
 * Renal failure & dialysis acute complications — access, intradialytic hypotension, disequilibrium, electrolyte crises.
 * Remediation wave 4: renal-gu system + physiological adaptation + pharmacological safety.
 */
import type { PathwayLessonQuizItem, PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";
import {
  ensurePremiumSeoDescription,
  PATHWAY_EXAM_LABEL,
} from "@/lib/lessons/scoped-lessons/gold-premium-synthesis";
import { npExamLabel, npPrimaryCareTitleSuffix } from "@/lib/lessons/scoped-lessons/np-pathway-display";

export const RENAL_DIALYSIS_ACUTE_COMPLICATIONS_GOLD_SLUG = "renal-dialysis-acute-complications-gold-standard" as const;

type RenalVariant = "us_pn" | "ca_rpn" | "us_rn" | "ca_rn" | "us_np";

const PATHWAY_VARIANT: Record<string, RenalVariant> = {
  "us-lpn-nclex-pn": "us_pn",
  "ca-rpn-rex-pn": "ca_rpn",
  "us-rn-nclex-rn": "us_rn",
  "ca-rn-nclex-rn": "ca_rn",
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-pmhnp": "us_np",
};

const SHARED_CORE_BODY = `**Acute kidney injury vs ESRD on dialysis**  
**AKI** items tie **oliguria**, **rising creatinine/BUN**, **electrolyte derangements**, **fluid overload**, and **nephrotoxin** exposure. **ESRD** items add **dialysis schedules**, **interdialytic weight gain**, **chronic anemia**, and **mineral bone** teaching when stems include it.

**Hemodialysis acute complications**  
**Intradialytic hypotension**: cramping, nausea, yawning—**stop or slow ultrafiltration per protocol**, **Trendelenburg** if appropriate, **isotonic fluid** per order, **monitor** **access patency**. **Dialysis disequilibrium**: headache, nausea, **altered mentation**, **seizure** risk with rapid solute shifts—**slow dialysis**, **notify provider**, **neuro checks**.

**Vascular access**  
**AV fistula/graft**: **no BP**, **venipuncture**, or **tight clothing** on access arm; **auscultate bruit** and **palpate thrill** per policy; **bleeding** from needle sites = **direct pressure** + **notify**. **Central dialysis catheter**: **strict sterile technique**, **dressing** per protocol, **signs of infection** (fever, purulence, erythema along tunnel).

**Electrolyte emergencies between treatments**  
**Hyperkalemia** with **ECG changes** → **calcium**, **insulin/glucose**, **albuterol**, **kayexalate** per order and pathway—exams test **sequence** and **monitoring**. **Fluid overload** with **pulmonary edema** may need **urgent ultrafiltration** or **ED**.

**Peritoneal dialysis**  
**Cloudy effluent**, **fever**, **abdominal pain** → **peritonitis** suspicion—**notify**, **culture** per order, **hold exchanges** until directed if stem indicates instability.`;

function pack(
  variant: RenalVariant,
  meta: {
    title: string;
    seoTitle: string;
    seoDescription: string;
    clinical_meaning: string;
    exam_relevance: string;
    clinical_scenario: string;
    takeaways: string;
  },
  quizzes: { preTest: PathwayLessonQuizItem[]; postTest: PathwayLessonQuizItem[] },
) {
  return { variant, ...meta, quizzes };
}

const VARIANTS: Record<RenalVariant, ReturnType<typeof pack>> = {
  us_pn: pack(
    "us_pn",
    {
      title: "Dialysis & renal crisis cues (NCLEX-PN, US)",
      seoTitle: "Dialysis complications | NCLEX-PN US | NurseNest",
      seoDescription:
        "US PN: fistula protection, intradialytic symptoms, fluid restrictions, and reporting hyperkalemia cues.",
      clinical_meaning: `**PN scope**  
You **weigh clients** pre/post HD when assigned, **record I&O**, **observe for cramping and hypotension during treatment**, **protect access arm** from procedures, **report** **fever** with **catheter**, **new chest pain**, or **neuro changes**, and **administer phosphate binders / erythropoietin** per order. You **do not** independently change **dialysis machine** settings.`,
      exam_relevance: `Traps: **BP on fistula arm**, **ignoring** **K+ 6.2 with peaked Ts**, or **continuing UF** during **syncope** without intervention.`,
      clinical_scenario: `**Vignette — outpatient HD**  
Mid-treatment: **BP 82/50**, **nausea**, **leg cramps**, **dizzy**.

**Fork**  
**Place supine**, **notify RN**, **support per protocol** (saline bolus/slower UF per order)—not “finish treatment at all costs.”`,
      takeaways: `• **Hypotension + cramps** = UF-related hypovolemia pattern.  
• **Access arm is lifeline**—protect from compression and sticks.  
• **Hyperkalemia ECG** = emergency pathway regardless of shift busyness.`,
    },
    {
      preTest: [
        {
          question: "Which action is unsafe for a client with left arm AV fistula?",
          options: [
            "Assessing thrill per policy.",
            "Drawing blood from left antecubital vein for routine labs.",
            "Teaching to avoid tight sleeves on left arm.",
            "Reporting absent thrill to RN.",
          ],
          correct: 1,
          rationale: "Venipuncture and BP on the access limb jeopardize fistula patency.",
        },
        {
          question: "Client reports severe headache and confusion first hour of HD. PN should?",
          options: [
            "Ignore as normal always.",
            "Notify RN immediately—disequilibrium syndrome is on the differential.",
            "Increase UF rate.",
            "Send client to car alone.",
          ],
          correct: 1,
          rationale: "Neurologic changes during dialysis require urgent evaluation for disequilibrium and other causes.",
        },
        {
          question: "Why daily weights matter for dialysis clients?",
          options: [
            "They are optional.",
            "Track fluid status and guide ultrafiltration goals between treatments.",
            "Replace lab monitoring.",
            "Only for pediatrics.",
          ],
          correct: 1,
          rationale: "Interdialytic weight gain reflects fluid accumulation needing UF planning.",
        },
      ],
      postTest: [
        {
          question: "Which finding suggests catheter-related bloodstream infection?",
          options: [
            "Afebrile stable client.",
            "Fever, rigors, erythema at exit site during dialysis session.",
            "Mild itching dry skin.",
            "Stable BP.",
          ],
          correct: 1,
          rationale: "Fever with access inflammation signals infection requiring prompt evaluation.",
        },
        {
          question: "PN notes peaked T waves on monitor strip before HD. Action?",
          options: [
            "Start HD faster always without telling anyone.",
            "Notify RN/provider immediately—hyperkalemia emergency evaluation.",
            "Give potassium supplement.",
            "Ignore ECG.",
          ],
          correct: 1,
          rationale: "Peaked T waves suggest hyperkalemia and need urgent treatment before risky procedures.",
        },
        {
          question: "Why rinse mouth with water after dry mouth from fluid restriction?",
          options: [
            "Increases fluid intake always.",
            "Moistens mucosa without significant fluid load when teaching adherence.",
            "Replaces dialysis.",
            "Only cosmetic.",
          ],
          correct: 1,
          rationale: "Comfort strategies help compliance without violating fluid limits.",
        },
      ],
    },
  ),

  ca_rpn: pack(
    "ca_rpn",
    {
      title: "Dialysis & renal crisis cues (REx-PN, Canada)",
      seoTitle: "Dialysis complications | REx-PN Canada | NurseNest",
      seoDescription:
        "Canadian PN: mmol/L potassium, HD unit monitoring, access protection, and collaborative escalation.",
      clinical_meaning: `**RPN**  
Interpret **mmol/L** **K+**, **creatinine**, and **glucose** in stems. You **document** **pre/post weights in kg**, **vital trends**, **intradialytic symptoms**, and **access assessments**, then **communicate** **SBAR** to RN when **unstable**. **Infection prevention** during **catheter care** is high-yield.`,
      exam_relevance: `Canadian items test **same complications** with **metric** labs and **interprofessional** language—wrong answers still **ignore** **hypotension on machine**.`,
      clinical_scenario: `**Vignette**  
HD client **K+ 6.1 mmol/L** in predialysis labs, **tingling**, **widened QRS** on strip in stem.

**Fork**  
**Emergency pathway**—not “start HD without notifying team about ECG changes.”`,
      takeaways: `• **ECG progression** with **hyperkalemia** drives **calcium/insulin** teaching.  
• **Sterile technique** is non-negotiable for **central dialysis lines**.  
• **Scope**: machine changes belong to trained RN/tech per unit policy.`,
    },
    {
      preTest: [
        {
          question: "Which finding should prompt immediate RPN reporting during HD?",
          options: [
            "Stable BP entire treatment.",
            "Sudden chest pain with hypotension during ultrafiltration.",
            "Client watching TV.",
            "Normal temperature.",
          ],
          correct: 1,
          rationale: "Chest pain with hypotension may signal cardiac ischemia or volume-related compromise during HD.",
        },
        {
          question: "RPN observes bleeding around catheter exit site. First action theme?",
          options: [
            "Ignore small ooze always.",
            "Apply sterile pressure per policy, notify RN, assess for infection or mechanical issue.",
            "Remove catheter.",
            "Submerge in bath.",
          ],
          correct: 1,
          rationale: "Access bleeding and infection signs require assessment and RN/provider involvement.",
        },
        {
          question: "Why avoid heparin or lytic discussions casually near confused HD client?",
          options: [
            "No psychosocial impact.",
            "Anxiety can worsen hemodynamic stability; clear calm communication matters.",
            "Confusion means deafness.",
            "Only family hears.",
          ],
          correct: 1,
          rationale: "Renal clients have high anxiety burden; therapeutic communication is tested.",
        },
      ],
      postTest: [
        {
          question: "Which symptom cluster fits uremic pericarditis suspicion?",
          options: [
            "Asymptomatic.",
            "Chest pain worse supine, friction rub if noted, fever, recent missed dialysis in stem.",
            "Only ankle edema.",
            "Clear lungs always.",
          ],
          correct: 1,
          rationale: "Uremia can inflame pericardium—missed treatments raise risk.",
        },
        {
          question: "PD client reports cloudy bag outflow. RPN should?",
          options: [
            "Discard without telling anyone.",
            "Notify RN/provider—peritonitis is top concern until evaluated.",
            "Add extra sugar to fluid.",
            "Stop all PD forever without orders.",
          ],
          correct: 1,
          rationale: "Cloudy effluent signals infection workup per protocol.",
        },
        {
          question: "Why monitor glucose when giving insulin with hyperkalemia treatment?",
          options: [
            "Insulin does not shift potassium.",
            "Insulin drives K+ intracellularly but causes hypoglycemia—glucose prevents that.",
            "Glucose is decorative.",
            "Only type 2 needs checks.",
          ],
          correct: 1,
          rationale: "Insulin-glucose therapy requires frequent glucose monitoring per standard teaching.",
        },
      ],
    },
  ),

  us_rn: pack(
    "us_rn",
    {
      title: "Renal failure & dialysis acute management (NCLEX-RN, US)",
      seoTitle: "Renal dialysis nursing | NCLEX-RN US | NurseNest",
      seoDescription:
        "NCLEX-RN: hyperkalemia sequences, dialysis hypotension, access infection, AKI fluid plans, and drug clearance teaching.",
      clinical_meaning: `**RN**  
You **manage HD/PDF** orders: **medication timing around dialysis**, **antibiotic redosing**, **vascular access care**, **troubleshoot machine alarms** per competency, **titrate** **UF** within parameters, **administer** **emergent hyperkalemia meds**, and **teach** **diet/fluid/meds** for **ESRD**. For **AKI**, you **monitor** **strict I/O**, **daily weights**, **avoid nephrotoxins** when possible, and **prepare** for **CRRT** themes if stem includes ICU.`,
      exam_relevance: `Forks: **which med first in hyperkalemia with ECG changes**, **dialyze vs medicate** when both appear, **contrast-induced AKI** prevention, **rhabdomyolysis** + **dark urine** + **K+**, **digoxin toxicity** with **renal failure**.`,
      clinical_scenario: `**Vignette — ICU step-down**  
ESRD missed HD: **K+ 6.8 mEq/L**, **peaked Ts**, **paresthesias**.

**Fork**  
**Calcium first** for membrane protection, **insulin/glucose**, **albuterol**, **notify nephrology**, **prepare for dialysis**—not “only loop diuretic” if anuric.`,
      takeaways: `• **Calcium stabilizes myocardium** in hyperkalemia with ECG changes.  
• **UF goals** must match **preweight** and **symptoms**—rigid UF can crash BP.  
• **Renally cleared drugs** accumulate—exams love **toxicity** with **GFR drop**.`,
    },
    {
      preTest: [
        {
          question: "Which client should the RN assess first?",
          options: [
            "Stable CKD education appointment.",
            "Anuric HD client with K+ 6.9, widened QRS, and dizziness.",
            "Client requesting extra blanket.",
            "Post-op day 3 stable ambulating.",
          ],
          correct: 1,
          rationale: "Life-threatening hyperkalemia with ECG changes outranks routine tasks.",
        },
        {
          question: "First medication theme for symptomatic hyperkalemia with peaked T waves?",
          options: [
            "Loop diuretic always first in every case.",
            "IV calcium for cardiac membrane stabilization when ECG changes present—alongside other therapies per protocol.",
            "Oral kayexalate only always.",
            "NSAIDs.",
          ],
          correct: 1,
          rationale: "Calcium is prioritized when hyperkalemia threatens conduction on ECG.",
        },
        {
          question: "Why pause certain renally cleared antibiotics in AKI?",
          options: [
            "Antibiotics never need adjustment.",
            "Accumulation increases toxicity risk—dose/frequency per pharmacy or provider orders.",
            "Always double dose in AKI.",
            "Only oral drugs matter.",
          ],
          correct: 1,
          rationale: "Renal impairment requires dosing vigilance for nephrotoxic and renally cleared drugs.",
        },
      ],
      postTest: [
        {
          question: "Intradialytic hypotension refractory to fluid bolus—RN thinks?",
          options: [
            "Continue maximal UF always.",
            "Consider cool dialysate, albumin per order, trend troponin if ischemia suspected, notify nephrologist.",
            "Ignore BP.",
            "Send walking.",
          ],
          correct: 1,
          rationale: "Refractory hypotension during HD needs multifactorial assessment beyond saline alone.",
        },
        {
          question: "Which teaching prevents contrast-induced kidney injury in at-risk client?",
          options: [
            "More contrast is better.",
            "Hydration per protocol, hold nephrotoxins when ordered, monitor creatinine after study.",
            "Avoid all fluids.",
            "Only pediatric risk.",
          ],
          correct: 1,
          rationale: "Periprocedural hydration and avoidance of nephrotoxins reduce CI-AKI risk.",
        },
        {
          question: "RN delegating HD chair vitals to PCT—appropriate when?",
          options: [
            "PCT titrates UF independently without parameters.",
            "PCT measures and reports; RN interprets trends and adjusts therapy per orders and competency.",
            "No vitals on HD.",
            "Family adjusts machine.",
          ],
          correct: 1,
          rationale: "Technicians gather data; RN retains clinical decision-making for ultrafiltration changes.",
        },
      ],
    },
  ),

  ca_rn: pack(
    "ca_rn",
    {
      title: "Renal failure & dialysis complications (NCLEX-RN, Canada)",
      seoTitle: "Renal dialysis nursing | NCLEX-RN Canada | NurseNest",
      seoDescription:
        "Canadian RN: mmol/L electrolytes, HD complications, PD peritonitis, and AKI collaborative care.",
      clinical_meaning: `**Canadian RN**  
Use **mmol/L** **K+**, **creatinine**, **bicarbonate** when shown. **Publicly funded** system language may appear, but **clinical priorities** mirror US: **access first**, **K+ emergencies**, **infection control**, **fluid balance**. **Indigenous** and **rural** access themes occasionally frame **adherence** teaching.`,
      exam_relevance: `Same **hyperkalemia** sequence; watch **Celsius** fever with **catheter infection**.`,
      clinical_scenario: `**Vignette**  
PD: **fever 38.6°C**, **cloudy effluent**, **rebound tenderness**.

**Fork**  
**Peritonitis workup**—culture, notify, antibiotics per protocol—not “viral gastro only.”`,
      takeaways: `• **Cloudy effluent + fever + pain** = PD emergency until proven otherwise.  
• **Missed HD** raises **K+**, **volume**, and **uremic** complications together.  
• **Patient partnerships** improve **fluid** and **phosphate** adherence.`,
    },
    {
      preTest: [
        {
          question: "Which lab best tracks dialysis adequacy context in exam stems?",
          options: [
            "HbA1c only.",
            "Urea reduction ratio or Kt/V when provided—along with clinical symptoms.",
            "Platelet count only.",
            "TSH always.",
          ],
          correct: 1,
          rationale: "Dialysis adequacy metrics appear with symptom correlation in board items.",
        },
        {
          question: "Canadian RN with first-time HD client reporting severe headache and hypertension during treatment?",
          options: [
            "Ignore first treatment symptoms always.",
            "Assess for disequilibrium, notify provider, adjust dialysis parameters per protocol.",
            "Send home immediately.",
            "Give NSAIDs routinely.",
          ],
          correct: 1,
          rationale: "First HD sessions carry disequilibrium and hypertension risk requiring assessment.",
        },
        {
          question: "Why monitor calcium and phosphate in ESRD?",
          options: [
            "They never change.",
            "Mineral bone disorder increases fracture and vascular calcification risk—binders and analogs per plan.",
            "Only for children.",
            "Replace potassium always.",
          ],
          correct: 1,
          rationale: "CKD-MBD management is integrated into renal nursing teaching.",
        },
      ],
      postTest: [
        {
          question: "Which finding suggests inadequate dry weight assessment?",
          options: [
            "Stable midweek BP without symptoms.",
            "Cramping every treatment with hypotension at end despite low UF.",
            "Normal access thrill.",
            "Clear effluent on PD.",
          ],
          correct: 1,
          rationale: "Refractory symptoms may indicate dry weight mismatch needing nephrology review.",
        },
        {
          question: "AKI after major surgery with oliguria—RN priority?",
          options: [
            "Force oral fluids always.",
            "Assess volume status, I&O, meds, notify provider, avoid nephrotoxins, prepare for diagnostics per orders.",
            "Ignore creatinine bump.",
            "Give contrast for fun.",
          ],
          correct: 1,
          rationale: "Postoperative AKI requires systematic assessment and early provider communication.",
        },
        {
          question: "Why teach phosphate binder timing with meals?",
          options: [
            "Timing irrelevant.",
            "Binders chelate dietary phosphate in gut—meal linkage improves effectiveness.",
            "Only bedtime.",
            "Replace dialysis.",
          ],
          correct: 1,
          rationale: "Phosphate binder administration with food is standard teaching.",
        },
      ],
    },
  ),

  us_np: pack(
    "us_np",
    {
      title: "Renal risk & dialysis access in ambulatory care (NP, US)",
      seoTitle: "Renal failure triage | FNP US | NurseNest",
      seoDescription:
        "NP renal and dialysis-access triage: hyperkalemia with ECG changes, missed hemodialysis with volume overload, line infection fever, contrast and triple-whammy AKI patterns, renally cleared medication holds, EMS when perfusion fails, and safety netting for oliguria.",
      clinical_meaning: `**NP**  
Clinic items test **who needs ED today**: **K+ with ECG changes**, **anuria**, **pulmonary edema** with **missed HD**, **febrile** central line, **rhabdomyolysis** cues, and **ACEI/ARB + spironolactone + NSAID** triple whammy hyperkalemia. You **adjust** **renally cleared meds**, **order** **labs**, and **coordinate** **nephrology**—not “increase NSAIDs” in **CKD**.`,
      exam_relevance: `Trap: **continuing metformin** when **eGFR** contraindicates; **ignoring** **BMP** after **contrast**; **oral potassium** with **K-sparing diuretic** without monitoring.`,
      clinical_scenario: `**Vignette — clinic**  
CKD4: **K+ 6.0**, **peaked T waves** on EKG in office.

**Fork**  
**EMS/ED** for stabilization and dialysis—not “recheck next month.”`,
      takeaways: `• **EKG changes + hyperkalemia** = emergency, not outpatient tweak—items love **peaked T waves** with **ACEI/ARB/spironolactone/NSAID** stacks.  
• **Medication reconciliation** prevents iatrogenic renal injury; re-check **metformin**, **diuretics**, and **nephrotoxins** after contrast or acute illness.  
• **Missed dialysis** with **dyspnea, K+ rise, or fluid overload** belongs in **ED** with clear handoff, not “call Monday.”  
• **BP control** slows CKD progression when appropriate to guideline.`,
    },
    {
      preTest: [
        {
          question: "Which patient needs emergency referral?",
          options: [
            "CKD3 stable BMP last month.",
            "Missed two HD sessions with dyspnea, crackles, and K+ 6.8 on BMP.",
            "Stable HTN follow-up.",
            "Mild ankle edema controlled.",
          ],
          correct: 1,
          rationale: "Volume overload and severe hyperkalemia after missed dialysis is an emergency.",
        },
        {
          question: "Elderly on lisinopril, HCTZ, and ibuprofen OTC presents with K+ 5.9. NP thinks?",
          options: [
            "Add potassium supplement.",
            "Review nephrotoxic and K-retaining meds, hold/adjust per protocol, urgent recheck/ED if ECG changes.",
            "Ignore OTC meds.",
            "Increase ibuprofen.",
          ],
          correct: 1,
          rationale: "NSAIDs with RAAS blockade raises hyperkalemia and AKI risk.",
        },
        {
          question: "Why check eGFR before metformin continuation?",
          options: [
            "Metformin has no renal risk.",
            "Lactic acidosis risk rises as GFR falls—guideline-based hold/adjust.",
            "Only inpatient matters.",
            "eGFR is optional always.",
          ],
          correct: 1,
          rationale: "Renal function guides safe metformin use in primary care.",
        },
      ],
      postTest: [
        {
          question: "Which documentation shows appropriate NP escalation?",
          options: [
            "Patient drove home with peaked Ts.",
            "EKG shows peaked T waves, EMS activated, nephrology contacted, interventions logged.",
            "No EKG.",
            "Advised sauna.",
          ],
          correct: 1,
          rationale: "Hyperkalemia with ECG changes requires emergency care and clear documentation.",
        },
        {
          question: "AKI after contrast—NP follow-up?",
          options: [
            "No BMP needed.",
            "Serial creatinine per protocol, hydrate if appropriate, review nephrotoxins.",
            "Repeat contrast tomorrow.",
            "Stop all fluids.",
          ],
          correct: 1,
          rationale: "Post-contrast AKI surveillance is standard ambulatory teaching.",
        },
        {
          question: "When is outpatient diuretic uptitration unsafe in advanced CKD?",
          options: [
            "Never unsafe.",
            "When stem shows acute kidney injury, profound hypotension, or hyperkalemia risk—reassess first.",
            "Always triple dose.",
            "Only heart failure matters.",
          ],
          correct: 1,
          rationale: "Diuretics in renal failure require careful hemodynamic and electrolyte monitoring.",
        },
      ],
    },
  ),
};

type LessonInputShape = {
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  previewSectionCount: number;
  seoTitle: string;
  seoDescription: string;
  sections: PathwayLessonSection[];
  preTest: PathwayLessonQuizItem[];
  postTest: PathwayLessonQuizItem[];
};

function npTitles(pathwayId: string, v: (typeof VARIANTS)["us_np"]) {
  const lab = npExamLabel(pathwayId);
  const suf = npPrimaryCareTitleSuffix(pathwayId);
  return {
    ...v,
    title: `Renal risk & dialysis access in ambulatory care (${suf})`,
    seoTitle: `Renal failure triage | ${lab} US | NurseNest`,
    seoDescription: `NP renal and dialysis-access triage for ${lab}: hyperkalemia with ECG changes, missed dialysis and volume overload, line infection concerns, AKI surveillance after contrast, renally aware prescribing, and documented return precautions.`,
  };
}

export function renalDialysisAcuteComplicationsGoldHubListInput(
  pathwayId: string,
): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getRenalDialysisAcuteComplicationsGoldLessonInput(pathwayId);
  if (!full) return null;
  return {
    slug: full.slug,
    title: full.title,
    topic: full.topic,
    topicSlug: full.topicSlug,
    bodySystem: full.bodySystem,
    previewSectionCount: full.previewSectionCount,
    seoTitle: full.seoTitle,
    seoDescription: full.seoDescription,
  };
}

export function getRenalDialysisAcuteComplicationsGoldLessonInput(pathwayId: string): LessonInputShape | null {
  const key = PATHWAY_VARIANT[pathwayId];
  if (!key) return null;
  let v = VARIANTS[key];
  if (key === "us_np") v = npTitles(pathwayId, v);
  return {
    slug: RENAL_DIALYSIS_ACUTE_COMPLICATIONS_GOLD_SLUG,
    title: v.title,
    topic: "Renal / GU",
    topicSlug: "renal-gu",
    bodySystem: "Renal",
    previewSectionCount: 1,
    seoTitle: v.seoTitle,
    seoDescription: ensurePremiumSeoDescription(v.seoDescription, PATHWAY_EXAM_LABEL[pathwayId] ?? pathwayId),
    sections: [
      { id: "clinical_meaning", heading: "What this means clinically", kind: "clinical_meaning", body: v.clinical_meaning },
      { id: "exam_relevance", heading: "Why this appears on your exam", kind: "exam_relevance", body: v.exam_relevance },
      { id: "core_concept", heading: "Core concept — dialysis & renal crises", kind: "core_concept", body: SHARED_CORE_BODY },
      { id: "clinical_scenario", heading: "Clinical scenario", kind: "clinical_scenario", body: v.clinical_scenario },
      { id: "takeaways", heading: "Key takeaways", kind: "takeaways", body: v.takeaways },
    ],
    preTest: v.quizzes.preTest,
    postTest: v.quizzes.postTest,
  };
}
