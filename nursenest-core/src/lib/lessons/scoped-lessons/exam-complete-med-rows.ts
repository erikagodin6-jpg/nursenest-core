/**
 * Exam-complete **medication family** scoped gold rows (Wave1 bulk shape).
 * Pathway variants emphasize PN execution vs RN coordination vs NP prescribing/monitoring depth.
 */
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";
import type { BulkRow } from "@/lib/lessons/scoped-lessons/launch-wave-1-bulk-builder";

const qt = (items: PathwayLessonQuizItem[]) => items;

/** Premium builder requires ≥100 words if `labsDiagnostics` is present; omit with reason instead. */
const FAMILY_LABS_OMIT =
  "Labs and diagnostics are integrated across Signs/Symptoms, Pathophysiology, and linked hub lessons (fluids/electrolytes, sepsis, renal, endocrine, cardiac monitoring) so this family lesson stays focused on medication-class actions, monitoring priorities, adverse-effect surveillance, escalation, and scope without duplicating standalone bench-mark drills. Reference this lesson’s stable slug in question rationales for cross-study links.";

export const MED_FAMILY_ROWS: BulkRow[] = [
  {
    slug: "med-family-antibiotics-gold",
    shortTitle: "Antibiotics — nursing implications",
    topic: "Antibiotics",
    topicSlug: "antibiotics",
    bodySystem: "Pharmacology / infection",
    npTitleStem: "Antibiotics — selection themes & safety counseling",
    npSeoDescription:
      "NP-level antibiotic stewardship themes: allergy documentation, renal adjustment concepts, culture timing, and patient counseling—stem-scoped without guessing independent selection outside orders.",
    sharedCore: `**Mechanism & exam framing**  
**Antibiotics** work by **inhibiting bacterial synthesis**, **cell wall disruption**, or **DNA/RNA interference** depending on class. Boards rarely test pure pharmacology trivia; they test **time-sensitive administration**, **allergy cross-reactivity concepts**, **renal/hepatic monitoring**, **culture acquisition before therapy when applicable**, and **adverse effects** (C. diff, rash, nephrotoxicity, QT issues with macrolides/fluoroquinolones in some stems).

**Why nursing exams care**  
Writers pair antibiotics with **hypotension**, **fever trends**, **IV access**, **lab monitoring**, and **patient education** about **finishing the course** when ordered, **probiotics only if approved**, and **when to call** for rash, swelling, or diarrhea.

**Safety spine**  
Verify **identity**, **allergy band**, **right drug/route/dose/time**, and **compatible fluids**. Know **beta-lactam allergy** documentation is a medicolegal and safety anchor—do not “assume” tolerance without an order. Watch **nephrotoxic pairings** (e.g., aminoglycosides + vancomycin themes) when labs trend wrong.`,
    labsOmitReason: FAMILY_LABS_OMIT,
    pn: `**NCLEX-PN scope**  
Emphasize **safe preparation and administration per order**, **monitoring vitals and symptoms**, **reporting adverse reactions early**, and **reinforcing provider/RN teaching**. Avoid **independent antibiotic selection** or **stopping therapy** without an order.`,
    caRpn: `**REx-PN**  
Align with **college standards**: **objective reporting**, **collaboration**, **aseptic technique**, and **documentation** of allergies. Canadian stems may show **metric labs**—translate trends, not memorized US-only reference ranges.`,
    usRn: `**NCLEX-RN**  
Expect **prioritization** with **sepsis bundles**, **reassessment after boluses**, **IV compatibility**, **patient education**, and **interprofessional communication** when cultures or consults are needed.`,
    caRn: `**Canada RN**  
Same clinical judgment with **Canadian interprofessional** language; prioritize **deterioration** over **routine tasks** when infection is suspected or worsening.`,
    np: `**NP (US tracks)**  
Items may include **empiric choice frameworks** when the stem provides options, **renal dose adjustment concepts**, **penicillin allergy clarification**, **STI/respiratory/UTI syndromes** in ambulatory care, and **safety netting** for worsening infection.`,
    examRelevance: `Traps: **finishing charting** before **giving time-sensitive antibiotics**, **minimizing new rash** after a dose, or **teaching** while **hypotension** is unresolved.`,
    scenario: `**Vignette**  
Post-op client with **fever**, **tachycardia**, and **purulent wound drainage**. Orders include **IV antibiotic after blood cultures**—two sets drawn, pharmacy mixing now.

**Fork**  
Prioritize **timely administration**, **monitoring**, and **escalation** if **hypotension** or **mental status** changes.`,
    takeaways: `• **Allergies** + **first dose** = watch closely.  
• **Cultures** timing vs **instability**—follow the stem’s priority.  
• Pair with **sepsis** and **high-alert** lessons.`,
    related: ["sepsis", "cj", "ham", "fluids"],
    preTest: qt([
      {
        question: "Before starting a new IV antibiotic in a stable client, what is a priority safety check?",
        options: [
          "Verify allergies/identifiers and use rights-based checks before administration.",
          "Skip allergies if the client says they are ‘fine’.",
          "Administer without checking the MAR.",
          "Give the dose in a shared unlabeled syringe.",
        ],
        correct: 0,
        rationale: "Allergy verification and the six rights are foundational medication safety checks.",
      },
      {
        question: "Why might cultures be drawn before antibiotics in some sepsis pathways?",
        options: [
          "To identify pathogens and guide therapy when feasible without delaying stabilization.",
          "Cultures are never useful.",
          "Cultures replace antibiotics.",
          "Cultures must always delay all treatment.",
        ],
        correct: 0,
        rationale: "Culture timing is a common teaching theme paired with stabilization priorities.",
      },
      {
        question: "Which finding should prompt urgent reporting during antibiotic therapy?",
        options: [
          "New diffuse rash with lip swelling or airway symptoms after a dose.",
          "Mild dry skin unrelated to timing.",
          "A request for an extra blanket.",
          "Stable chronic joint pain.",
        ],
        correct: 0,
        rationale: "Signs of allergic reaction/anaphylaxis require urgent evaluation.",
      },
    ]),
    postTest: qt([
      {
        question: "A client on IV vancomycin has rising creatinine. What is the best nursing action?",
        options: [
          "Notify provider with objective data and follow monitoring/level protocols per order.",
          "Stop all fluids permanently without orders.",
          "Ignore labs if the client feels fine.",
          "Double the next dose without guidance.",
        ],
        correct: 0,
        rationale: "Nephrotoxicity risk requires communication and protocol-driven monitoring.",
      },
      {
        question: "Which statement reflects safe patient teaching about antibiotics?",
        options: [
          "Take exactly as prescribed; call for severe diarrhea, rash, or swelling.",
          "Stop whenever you feel better without telling anyone.",
          "Share leftover pills with family.",
          "Ignore interactions because antibiotics are always safe.",
        ],
        correct: 0,
        rationale: "Adherence and adverse-effect precautions are central teaching points.",
      },
      {
        question: "Why is C. difficile risk relevant to broad-spectrum antibiotic use?",
        options: [
          "Antibiotics disrupt normal flora and can trigger C. diff colitis—monitor stool and isolate per policy.",
          "C. diff only happens without antibiotics.",
          "Antibiotics cannot affect GI flora.",
          "Diarrhea is always benign.",
        ],
        correct: 0,
        rationale: "Antibiotic-associated diarrhea can represent serious infection requiring escalation.",
      },
    ]),
  },
  {
    slug: "med-family-anticoagulants-gold",
    shortTitle: "Anticoagulants — monitoring & safety",
    topic: "Anticoagulation",
    topicSlug: "anticoagulation",
    bodySystem: "Hematology / cardiovascular",
    npTitleStem: "Anticoagulation — risk, reversal themes, & counseling",
    npSeoDescription:
      "NP-level anticoagulation themes: bleeding vs clot risk, peri-procedure planning concepts, DOAC education, and when ED evaluation is mandatory—without independent dosing games outside the stem.",
    sharedCore: `**Mechanism & exam framing**  
**Anticoagulants** reduce **thrombus formation** through **vitamin K antagonism**, **direct thrombin inhibition**, **factor Xa inhibition**, or **parenteral antithrombin potentiation** (heparins). Exams test **bleeding precautions**, **lab monitoring** when applicable (INR, aPTT, anti-Xa themes), **bridging concepts**, **neuraxial anesthesia cautions**, and **reversal** pathways in emergent bleeding—often as **team coordination**, not guessing drug choice.

**Why it matters**  
Items pair anticoagulation with **falls**, **head injury**, **hematuria**, **melena**, **sudden hypotension**, and **procedural timing**. The trap is **routine tasks** while **active bleeding** is present.

**Nursing integration**  
Protect **falls risk**, verify **renal function relevance** for DOACs in teaching-level items, teach **consistent timing**, **avoid NSAID stacking** unless ordered, and escalate **major bleeding** per protocol.`,
    labsOmitReason: FAMILY_LABS_OMIT,
    pn: `**NCLEX-PN**  
Focus on **bleeding assessments**, **timely reporting**, **safe administration**, and **patient education** within orders. Avoid **independent anticoagulant holds** unless protocol explicitly authorizes you in the stem.`,
    caRpn: `**REx-PN**  
Emphasize **collaboration**, **objective reporting**, and **policy-aligned** administration/monitoring.`,
    usRn: `**NCLEX-RN**  
Expect **post-procedure monitoring**, **transfusion/reversal preparation themes**, **patient education**, and **coordination** with pharmacy/labs.`,
    caRn: `**Canada RN**  
Same prioritization spine; use **metric** values when shown and **clear escalation** for bleeding.`,
    np: `**NP**  
May test **bleeding risk stratification**, **perioperative planning concepts**, **patient selection for DOACs**, **education on missed doses**, and **when ED referral** is required for head trauma on anticoagulation.`,
    examRelevance: `Traps: **delaying notification** with **hemodynamic instability**, **minimizing** **black stools**, or **independent** med changes.`,
    scenario: `**Vignette**  
Client on **warfarin** after valve surgery reports **black stools** and **dizziness**. BP trending down, HR up.

**Fork**  
Treat as **GI bleeding risk** until evaluated—**notify**, **monitor**, **prepare** for orders/labs, **NPO** per protocol.`,
    takeaways: `• **Bleeding + anticoagulation** = escalate early.  
• Pair with **high-alert** and **ACS** lessons.`,
    related: ["ham", "acs", "stroke", "fluids"],
    preTest: qt([
      {
        question: "Which teaching point is essential for clients on anticoagulants?",
        options: [
          "Seek urgent care for head injury, uncontrolled bleeding, black stools, or vomiting blood.",
          "Stop all medications whenever tired.",
          "Use NSAIDs freely unless allergic.",
          "Ignore falls because anticoagulants prevent injury.",
        ],
        correct: 0,
        rationale: "Bleeding precautions and urgent warning signs are high-yield teaching.",
      },
      {
        question: "Why is fall risk especially important for anticoagulated clients?",
        options: [
          "Head trauma can cause intracranial bleeding with higher risk on anticoagulants.",
          "Falls never matter.",
          "Anticoagulants prevent bleeding.",
          "Falls only affect children.",
        ],
        correct: 0,
        rationale: "Anticoagulation increases bleeding severity from trauma.",
      },
      {
        question: "What is the nurse’s priority if major bleeding is suspected on anticoagulation?",
        options: [
          "Assess perfusion, notify provider, prepare for urgent evaluation/interventions per protocol.",
          "Encourage vigorous exercise.",
          "Delay reporting until shift change.",
          "Give another anticoagulant dose.",
        ],
        correct: 0,
        rationale: "Major bleeding requires urgent team activation and protocol-driven care.",
      },
    ]),
    postTest: qt([
      {
        question: "A client on heparin develops new thrombocytopenia. What should the nurse do first?",
        options: [
          "Notify the provider promptly with objective data; follow facility protocol for HIT evaluation.",
          "Ignore platelets if aPTT is stable.",
          "Increase heparin independently.",
          "Discontinue all monitoring.",
        ],
        correct: 0,
        rationale: "Heparin-induced thrombocytopenia is a safety-critical pattern requiring provider involvement.",
      },
      {
        question: "Which action best supports safe warfarin care?",
        options: [
          "Ensure consistent vitamin K intake education and follow INR monitoring per orders.",
          "Encourage random vitamin K mega-doses without guidance.",
          "Skip INR because the client feels fine.",
          "Double warfarin after missed doses without orders.",
        ],
        correct: 0,
        rationale: "INR monitoring and dietary consistency education reduce adverse events.",
      },
      {
        question: "Why might creatinine matter for some oral anticoagulants?",
        options: [
          "Renal clearance affects dosing and bleeding risk for certain agents—follow labs and orders.",
          "Creatinine is unrelated to medications.",
          "Kidneys never affect drug levels.",
          "Creatinine only matters for antibiotics.",
        ],
        correct: 0,
        rationale: "Renal function informs safety for renally cleared anticoagulants in exam vignettes.",
      },
    ]),
  },
  {
    slug: "med-family-insulin-diabetes-gold",
    shortTitle: "Insulin & diabetes medications",
    topic: "Diabetes medications",
    topicSlug: "diabetes-meds",
    bodySystem: "Endocrine",
    npTitleStem: "Diabetes meds — insulin titration & safety",
    npSeoDescription:
      "NP ambulatory diabetes themes: basal-bolus concepts, hypoglycemia rescue, SGLT2 cautions, and sick-day rules—aligned to guidelines referenced in the stem.",
    sharedCore: `**Mechanism & exam framing**  
**Insulin** promotes **glucose uptake** and reduces **hepatic glucose output**; **secretagogues** increase insulin release; **SGLT2 inhibitors** increase urinary glucose excretion; **GLP-1 agents** increase incretin signaling with common GI effects. Exams test **hypoglycemia recognition**, **sick-day management**, **insulin mixing rules** (when applicable), **timing with meals**, and **DKA/HHS** escalation cues.

**Why it matters**  
Mismanagement causes **hypoglycemic seizures** or **hyperglycemic crises**. Boards love **insulin safety**: **never withdraw oral meds** from an unconscious hypoglycemic client without protocol—**glucose first**.

**Nursing integration**  
Teach **symptom recognition**, **15/15 rescue patterns** when appropriate, **foot care**, **sick-day hydration**, and **when to seek urgent care** for persistent vomiting or inability to eat.`,
    labsOmitReason: FAMILY_LABS_OMIT,
    pn: `**NCLEX-PN**  
Emphasize **administration technique**, **rotation sites**, **recognizing hypoglycemia**, **reporting abnormal glucose**, and **reinforcing teaching**—avoid **independent dose changes**.`,
    caRpn: `**REx-PN**  
Focus on **safe administration**, **collaboration**, and **objective reporting** of hypo/hyper patterns.`,
    usRn: `**NCLEX-RN**  
Expect **insulin drips**, **transition protocols**, **DKA monitoring themes**, and **patient education** for technology (pumps/CGM) when shown.`,
    caRn: `**Canada RN**  
Same spine with **metric glucose** units when shown.`,
    np: `**NP**  
May test **titration plans**, **oral agent selection concepts**, **contraindications**, **peri-illness instructions**, and **hypoglycemia unawareness** counseling.`,
    examRelevance: `Traps: **giving insulin** to **unconscious hypoglycemia**, **ignoring** **ketones** when ill, or **routine tasks** during **DKA**.`,
    scenario: `**Vignette**  
Type 1 client with **N/V**, **glucose 380**, **positive ketones**, **K+ borderline**—DKA pathway implied.

**Fork**  
Prioritize **monitoring**, **IV access**, **provider notification**, and **preparing** ordered therapies—not oral diet first.`,
    takeaways: `• **Hypoglycemia** before hyperglycemia workup when altered LOC.  
• Pair with **DKA/HHS** and **fluids/electrolytes**.`,
    related: ["dka", "ham", "fluids", "cj"],
    preTest: qt([
      {
        question: "What is the first priority for an awake, symptomatic hypoglycemic client who can swallow?",
        options: [
          "Give fast-acting carbohydrate per protocol and recheck glucose.",
          "Give insulin immediately.",
          "Ignore if the client is walking.",
          "Delay assessment to finish charting.",
        ],
        correct: 0,
        rationale: "Hypoglycemia treatment follows established rapid carbohydrate protocols when safe to swallow.",
      },
      {
        question: "Why is rotating insulin injection sites important?",
        options: [
          "To reduce lipodystrophy and absorption variability.",
          "Rotation is cosmetic only.",
          "Sites never matter.",
          "Use only one spot forever.",
        ],
        correct: 0,
        rationale: "Lipohypertrophy can alter insulin absorption and glycemic control.",
      },
      {
        question: "Which symptom cluster suggests DKA more than simple hypoglycemia?",
        options: [
          "Hyperglycemia with ketosis, acidosis pattern, polyuria, and Kussmaul breathing when shown.",
          "Glucose 60 with rapid improvement after juice.",
          "Normal A1c without symptoms.",
          "Localized joint pain only.",
        ],
        correct: 0,
        rationale: "DKA is a hyperglycemic ketotic emergency; hypoglycemia presents differently.",
      },
    ]),
    postTest: qt([
      {
        question: "A client on basal insulin reports frequent nocturnal hypoglycemia. What is the best initial nursing action?",
        options: [
          "Report objective trends to the provider; review patterns, meals, and activity per protocol.",
          "Tell the client to skip insulin forever.",
          "Increase insulin without orders.",
          "Ignore nocturnal symptoms.",
        ],
        correct: 0,
        rationale: "Recurrent hypoglycemia requires assessment and likely regimen adjustment by the prescriber.",
      },
      {
        question: "Why might SGLT2 inhibitors require teaching about genital infections and dehydration risk?",
        options: [
          "They increase urinary glucose excretion and can predispose to certain infections/volume issues—follow stem education priorities.",
          "They never have side effects.",
          "They only affect blood pressure.",
          "They replace insulin in type 1 diabetes always.",
        ],
        correct: 0,
        rationale: "Common exam themes include infection and volume status counseling for SGLT2 inhibitors.",
      },
      {
        question: "What is a priority when administering insulin from a multidose vial?",
        options: [
          "Use aseptic technique, correct units, and verify identity; never share pens or needles.",
          "Share pens between clients to save supplies.",
          "Estimate units visually.",
          "Skip hand hygiene.",
        ],
        correct: 0,
        rationale: "Infection control and dosing accuracy are foundational insulin safety practices.",
      },
    ]),
  },
  {
    slug: "med-family-cardiac-gold",
    shortTitle: "Cardiac medications (ischemia & rhythm)",
    topic: "Cardiac medications",
    topicSlug: "cardiovascular",
    bodySystem: "Cardiovascular",
    npTitleStem: "Cardiac meds — rate/rhythm & ischemia themes",
    npSeoDescription:
      "NP-level cardiac medication themes: beta-blocker intolerance, nitrate use, antiarrhythmic risks, and monitoring—without selecting independent titrations outside orders.",
    sharedCore: `**Mechanism & exam framing**  
**Beta-blockers** reduce **heart rate and myocardial oxygen demand**; **nitrates** promote **venodilation** and reduce preload; **calcium channel blockers** affect **vascular tone and conduction**; **digoxin** increases **contractility** with narrow therapeutic windows; **antiarrhythmics** carry **proarrhythmic** risk. Exams test **vitals before/after**, **hold parameters**, **toxicity cues** (bradycardia, heart blocks, digoxin toxicity), and **acute MI** medication sequencing themes.

**Why it matters**  
Cardiac meds interact with **perfusion**, **BP**, and **electrolytes** (especially **K** and **Mg** with digoxin). The trap is **giving rate-control** without noticing **hypotension** or **heart block**.

**Nursing integration**  
Trend **HR/BP**, **rhythm**, **pain**, and **perfusion**; teach **orthostasis**, **nitrate headache** expectations, and **when to call** for chest pain, syncope, or bradycardia symptoms.`,
    labsOmitReason: FAMILY_LABS_OMIT,
    pn: `**NCLEX-PN**  
Emphasize **vitals**, **hold/report parameters**, **administration per order**, and **patient education**—avoid **independent titration**.`,
    caRpn: `**REx-PN**  
Collaboration and **objective reporting** for **new chest pain**, **syncope**, or **bradycardia**.`,
    usRn: `**NCLEX-RN**  
Expect **ACS medication bundles**, **cardioversion preparation themes**, and **multiple-client prioritization** with unstable vitals.`,
    caRn: `**Canada RN**  
Same prioritization; emphasize **clear communication** during acute changes.`,
    np: `**NP**  
May include **rate vs rhythm control decisions** as provider-owned concepts, **drug interaction** counseling, and **renal dosing** themes in stems.`,
    examRelevance: `Traps: **nitroglycerin** with **SBP too low**, **digoxin** with **missed K**, or **routine tasks** during **ischemia**.`,
    scenario: `**Vignette**  
Client with **ACS** reports **crushing pain**; BP **marginal**, **HR 52** after new beta-blocker dose.

**Fork**  
Assess **perfusion and rhythm**; **notify provider** for **symptomatic bradycardia** per protocol.`,
    takeaways: `• **HR/BP** before assuming pain is “only anxiety.”  
• Pair with **ACS** and **dysrhythmia** review.`,
    related: ["acs", "ham", "cj", "stroke"],
    preTest: qt([
      {
        question: "Before giving nitroglycerin for chest pain, what should the nurse check first in many protocols?",
        options: [
          "Blood pressure and contraindications such as recent PDE-5 inhibitor use when relevant.",
          "Only the client’s shoe size.",
          "Ignore BP if pain is severe.",
          "Give double dose if BP is high without assessment.",
        ],
        correct: 0,
        rationale: "Hypotension and drug interactions are classic nitrate safety checks on exams.",
      },
      {
        question: "Why is potassium important for clients on digoxin?",
        options: [
          "Hypokalemia increases digoxin toxicity risk.",
          "Potassium is unrelated.",
          "Digoxin always lowers potassium.",
          "Potassium replaces digoxin.",
        ],
        correct: 0,
        rationale: "Electrolyte shifts modulate digoxin effects and toxicity risk.",
      },
      {
        question: "Which finding should prompt urgent reporting for a client on new beta-blockers?",
        options: [
          "Syncope, heart rate in the 30s-40s with symptoms, or new heart block patterns.",
          "Mild dry skin without vitals change.",
          "A request for a visitor pass.",
          "Stable chronic back pain.",
        ],
        correct: 0,
        rationale: "Symptomatic bradycardia and conduction issues require urgent evaluation.",
      },
    ]),
    postTest: qt([
      {
        question: "A client on nitrates develops severe hypotension. What is the priority?",
        options: [
          "Follow hypotension protocol: positioning, IV access per order, notify provider, monitor perfusion.",
          "Give another nitrate dose immediately.",
          "Ambulate to raise BP.",
          "Ignore if awake.",
        ],
        correct: 0,
        rationale: "Hypotension from vasodilators requires stabilization and provider communication.",
      },
      {
        question: "What education helps clients taking beta-blockers at home?",
        options: [
          "Rise slowly to reduce orthostatic symptoms; report dizziness, fainting, or worsening SOB.",
          "Stop abruptly whenever desired.",
          "Ignore heart rate.",
          "Skip follow-up appointments.",
        ],
        correct: 0,
        rationale: "Orthostatic precautions and adherence are common teaching points.",
      },
      {
        question: "Why might magnesium be checked in clients on antiarrhythmics or with torsades risk?",
        options: [
          "Electrolytes affect QT and arrhythmia risk—follow the stem and orders.",
          "Magnesium is irrelevant to the heart.",
          "Magnesium replaces all antiarrhythmics.",
          "Magnesium is only for bones.",
        ],
        correct: 0,
        rationale: "Electrolyte management is integrated into many cardiac medication scenarios.",
      },
    ]),
  },
  {
    slug: "med-family-antihypertensives-gold",
    shortTitle: "Antihypertensives",
    topic: "Antihypertensives",
    topicSlug: "hypertension",
    bodySystem: "Cardiovascular",
    npTitleStem: "Hypertension meds — titration & follow-up",
    npSeoDescription:
      "NP primary care themes: resistant hypertension workup concepts, orthostasis, ACE-inhibitor cough vs angioedema, and renal monitoring—stem-scoped.",
    sharedCore: `**Mechanism & exam framing**  
**ACE inhibitors/ARBs** affect **RAAS**; **calcium channel blockers** reduce **vascular tone**; **thiazides** reduce **volume**; **beta-blockers** reduce **HR/contractility**. Exams test **orthostatic hypotension**, **hyperkalemia** with RAAS blockers, **angioedema** with ACE inhibitors, **creatinine bumps** after initiation (monitoring themes), and **pregnancy contraindications** for certain classes.

**Why it matters**  
Hypertension management is longitudinal, but boards test **acute hypotension** after changes, **falls**, and **AKI** patterns when **NSAIDs** stack with RAAS drugs.

**Nursing integration**  
Teach **home BP technique**, **slow position changes**, **salt reduction** as appropriate, and **when to call** for dizziness, syncope, or swelling of lips/tongue.`,
    labsOmitReason: FAMILY_LABS_OMIT,
    pn: `**NCLEX-PN**  
Focus on **vitals**, **orthostatic checks when ordered**, **education**, and **reporting abnormal symptoms**—avoid **independent class switches**.`,
    caRpn: `**REx-PN**  
Collaboration and **objective reporting** for **syncope** or **facial swelling**.`,
    usRn: `**NCLEX-RN**  
Expect **med reconciliation**, **patient teaching**, and **prioritization** when **BP is dangerously high** with symptoms (stroke/CVD pathways).`,
    caRn: `**Canada RN**  
Same spine; **metric BP** readings when shown.`,
    np: `**NP**  
May test **combination therapy concepts**, **home monitoring plans**, **workup for secondary causes** when hinted, and **follow-up intervals**.`,
    examRelevance: `Traps: **minimizing** **lip swelling** after ACE inhibitor, **NSAID** use with **RAAS** without monitoring, or **routine tasks** during **hypertensive emergency** symptoms.`,
    scenario: `**Vignette**  
New **lisinopril**; client develops **lip/tongue swelling** and **hoarse voice**.

**Fork**  
**Airway first**—emergency pathway; **stop further doses** per protocol and **activate emergency care**.`,
    takeaways: `• **Angioedema** = emergency until evaluated.  
• Pair with **stroke** and **renal** lessons when applicable.`,
    related: ["stroke", "fluids", "cj", "ham"],
    preTest: qt([
      {
        question: "Which side effect distinguishes ACE inhibitor angioedema from typical ‘dry cough’ teaching?",
        options: [
          "Airway-threatening lip/tongue swelling versus benign cough—treat as urgent.",
          "Cough always means allergy only.",
          "Swelling is always harmless.",
          "ACE inhibitors never cause symptoms.",
        ],
        correct: 0,
        rationale: "Angioedema is an emergency; cough is a common benign side effect requiring follow-up.",
      },
      {
        question: "Why teach orthostatic precautions with antihypertensives?",
        options: [
          "Blood pressure can drop with position changes, increasing fall risk.",
          "Orthostasis never happens.",
          "Antihypertensives always raise BP.",
          "Falls are unrelated to BP meds.",
        ],
        correct: 0,
        rationale: "Orthostatic hypotension is a common exam theme with BP medications.",
      },
      {
        question: "What lab is commonly monitored after starting RAAS-blocking medications?",
        options: [
          "Creatinine and potassium trends per orders.",
          "Only hemoglobin.",
          "Never monitor labs.",
          "Only glucose.",
        ],
        correct: 0,
        rationale: "Renal function and potassium are classic monitoring pairs with ACE/ARB therapy.",
      },
    ]),
    postTest: qt([
      {
        question: "A client feels dizzy after first antihypertensive dose. What is the best nursing response?",
        options: [
          "Assess BP/orthostatic vitals if ordered, fall precautions, notify provider with objective data.",
          "Tell them to drive to the store.",
          "Ignore dizziness.",
          "Double the next dose without orders.",
        ],
        correct: 0,
        rationale: "Orthostatic symptoms require assessment and provider communication.",
      },
      {
        question: "Why might NSAIDs be risky with certain antihypertensives?",
        options: [
          "They can reduce kidney perfusion and worsen renal function—especially with RAAS blockers in some clients.",
          "NSAIDs always improve kidneys.",
          "There is never any interaction.",
          "NSAIDs only affect the liver.",
        ],
        correct: 0,
        rationale: "Drug interaction and renal risk appear in integrated exam vignettes.",
      },
      {
        question: "Which client statement reflects understanding of home BP monitoring?",
        options: [
          "I take readings at the same time daily, seated, arm supported, and log results.",
          "I only measure BP after sprinting.",
          "I use the wrist cuff randomly once a year.",
          "I stop meds when numbers look good once.",
        ],
        correct: 0,
        rationale: "Proper technique improves reliability of outpatient hypertension management.",
      },
    ]),
  },
  {
    slug: "med-family-respiratory-gold",
    shortTitle: "Respiratory medications",
    topic: "Respiratory medications",
    topicSlug: "respiratory",
    bodySystem: "Respiratory / pulmonary",
    npTitleStem: "Respiratory meds — inhaler technique & escalation",
    npSeoDescription:
      "NP ambulatory respiratory themes: inhaler selection, spacer use, biologic referral concepts, and oral steroid burst counseling—stem-scoped.",
    sharedCore: `**Mechanism & exam framing**  
**Short-acting bronchodilators** relax **airway smooth muscle**; **ICS** reduce **airway inflammation**; **LABA/LAMA** combinations appear in COPD/asthma management teaching; **leukotriene modifiers** address **inflammatory pathways**; **systemic steroids** reduce **inflammation** but carry **hyperglycemia**, **infection**, and **GI bleed** risks. Exams test **inhaler sequencing**, **spacer use**, **oxygen safety** with smoking, and **toxicity** from **theophylline** when shown.

**Why it matters**  
Respiratory meds are **high-frequency** and **error-prone**: wrong device, poor technique, or **delaying escalation** during **severe distress**.

**Nursing integration**  
Teach **rinse mouth after ICS**, **shake priming** per device, **rescue vs maintenance** roles, and **when to call EMS** for refractory symptoms.`,
    labsOmitReason: FAMILY_LABS_OMIT,
    pn: `**NCLEX-PN**  
Emphasize **administration per order**, **oxygen delivery**, **recognizing worsening work of breathing**, and **education**—avoid **independent titration** of nebulizer therapies beyond protocol.`,
    caRpn: `**REx-PN**  
Collaboration for **acute distress**; objective reporting of **accessory muscle use** and **SpO₂**.`,
    usRn: `**NCLEX-RN**  
Expect **multiple inhaler teaching**, **prioritization** in exacerbations, and **monitoring after systemic steroids**.`,
    caRn: `**Canada RN**  
Same spine; **metric** peak flow when shown.`,
    np: `**NP**  
May include **step-up/step-down** plans, **biologic referral concepts**, **smoking cessation** pharmacotherapy themes, and **oral steroid risks**.`,
    examRelevance: `Traps: **teaching technique** while **SpO₂** is falling, or **SABA overuse** without escalation.`,
    scenario: `**Vignette**  
Asthma client used **rescue inhaler** 8 times overnight, **SpO₂ 89%**, **silent chest**.

**Fork**  
**Emergency evaluation**—not “just refill” outpatient advice.`,
    takeaways: `• **Maintenance vs rescue** roles are high yield.  
• Pair with **COPD** gold lesson.`,
    related: ["copd", "cj", "sepsis", "ham"],
    preTest: qt([
      {
        question: "Why should clients rinse mouth after using many inhaled corticosteroids?",
        options: [
          "To reduce oral thrush risk.",
          "To improve taste only.",
          "It is never needed.",
          "To replace brushing forever.",
        ],
        correct: 0,
        rationale: "Oropharyngeal candidiasis is a common ICS side effect addressed by rinsing.",
      },
      {
        question: "What is a sign of severe asthma/COPD exacerbation in exam vignettes?",
        options: [
          "Silent chest, inability to speak in sentences, or SpO2 that fails to improve with appropriate therapy.",
          "Stable walking SpO2 99%.",
          "Mild cough only.",
          "Normal RR without distress.",
        ],
        correct: 0,
        rationale: "Danger signs warrant urgent escalation beyond outpatient tweaks.",
      },
      {
        question: "Why use a spacer with some metered-dose inhalers?",
        options: [
          "Improves drug delivery to lungs and coordination—especially for children and some adults.",
          "Spacers reduce all oxygen needs.",
          "Spacers are never helpful.",
          "Spacers replace nebulizers always.",
        ],
        correct: 0,
        rationale: "Spacers are a standard teaching point to improve inhaler effectiveness.",
      },
    ]),
    postTest: qt([
      {
        question: "A client on systemic steroids for an exacerbation reports black stools. What should the nurse do?",
        options: [
          "Notify provider urgently; assess for GI bleeding risk and hemodynamic status per protocol.",
          "Ignore because steroids are safe.",
          "Give NSAIDs for pain.",
          "Stop all fluids.",
        ],
        correct: 0,
        rationale: "Steroids increase GI bleed risk; melena requires urgent evaluation.",
      },
      {
        question: "What is the best teaching about oxygen and open flames/smoking?",
        options: [
          "Oxygen supports combustion—no smoking or open flames near oxygen delivery.",
          "Oxygen is non-flammable so smoking is fine.",
          "Oxygen only burns plastic.",
          "Turn up oxygen to smoke safely.",
        ],
        correct: 0,
        rationale: "Home oxygen safety is a classic NCLEX teaching point.",
      },
      {
        question: "Why monitor glucose during systemic corticosteroid therapy?",
        options: [
          "Steroids can raise blood glucose—especially in diabetes.",
          "Steroids always lower glucose.",
          "Glucose never changes.",
          "Only children need monitoring.",
        ],
        correct: 0,
        rationale: "Hyperglycemia is a common steroid effect requiring monitoring in susceptible clients.",
      },
    ]),
  },
  {
    slug: "med-family-psychotropic-gold",
    shortTitle: "Psychotropic medications",
    topic: "Psychotropic medications",
    topicSlug: "mental-health",
    bodySystem: "Mental health / neurology",
    npTitleStem: "Psychotropics — titration, EPS, & metabolic monitoring",
    npSeoDescription:
      "NP PMHNP-adjacent themes: antidepressant startup effects, lithium levels, clozapine monitoring concepts, and serotonin syndrome cues—stem-scoped.",
    sharedCore: `**Mechanism & exam framing**  
**SSRIs/SNRIs** modulate **serotonin/norepinephrine** reuptake; **antipsychotics** block **dopamine** pathways with **EPS** and **metabolic** risks; **mood stabilizers** (lithium, valproate) have **narrow therapeutic/toxic** windows; **benzodiazepines** cause **respiratory depression**, especially with **opioids/alcohol**. Exams test **suicidal ideation monitoring**, **EPS** (tremor, rigidity, akathisia), **NMS** red flags, **serotonin syndrome** (clonus, hyperthermia, autonomic instability), and **lithium toxicity** (tremor, diarrhea, confusion).

**Why it matters**  
Psych meds intersect with **falls**, **QT prolongation**, **agranulocytosis** monitoring (clozapine themes), and **sudden cardiac risk** with some agents—boards reward **monitoring** and **escalation**.

**Nursing integration**  
Teach **do not stop abruptly** for some agents (seizure risk with benzos/bupropion contexts—stem-dependent), **report** worsening mood or suicidality, and **avoid** alcohol with sedating meds.`,
    labsOmitReason: FAMILY_LABS_OMIT,
    pn: `**NCLEX-PN**  
Emphasize **observation**, **safety**, **administration per order**, **reporting EPS/sedation**, and **therapeutic communication**—avoid **independent dose changes**.`,
    caRpn: `**REx-PN**  
Collaboration and **objective reporting** for **agitation**, **fever**, or **neuro changes**.`,
    usRn: `**NCLEX-RN**  
Expect **restraints alternatives** pairing, **1:1** safety, and **education** for outpatient starts.`,
    caRn: `**Canada RN**  
Same prioritization; clear **documentation** of mental status changes.`,
    np: `**NP**  
May test **titration schedules**, **drug interactions** (MAOIs, linezolid + serotonergic agents), **informed consent themes**, and **follow-up** for metabolic monitoring.`,
    examRelevance: `Traps: **minimizing** **fever + rigidity** on antipsychotics (NMS), or **combining** sedatives without monitoring.`,
    scenario: `**Vignette**  
Client on **haloperidol** develops **fever**, **rigidity**, **autonomic instability**.

**Fork**  
Suspect **NMS** until evaluated—**urgent provider activation** and **monitoring** per protocol.`,
    takeaways: `• **NMS vs serotonin syndrome**—both are emergencies with overlapping cues—follow stem.  
• Pair with **mental health casebook** and **high-alert** lessons.`,
    related: ["ham", "cj", "stroke", "fluids"],
    preTest: qt([
      {
        question: "Which symptoms suggest serotonin syndrome in exam vignettes?",
        options: [
          "Autonomic instability, clonus, agitation, hyperthermia after serotonergic drug interactions.",
          "Isolated mild dry skin only.",
          "Chronic knee pain without meds.",
          "Stable BP without symptoms.",
        ],
        correct: 0,
        rationale: "Serotonin syndrome is a medication emergency with classic hyperadrenergic/serotonergic features.",
      },
      {
        question: "Why is fall risk counseling important for sedating psychotropics?",
        options: [
          "Sedation and orthostasis increase fall and injury risk—especially in older adults.",
          "Sedation prevents falls.",
          "Falls never occur on psych meds.",
          "Only children fall.",
        ],
        correct: 0,
        rationale: "Sedation and orthostatic hypotension are common exam teaching points.",
      },
      {
        question: "What should a client report immediately when starting antidepressants?",
        options: [
          "Worsening depression, suicidal thoughts, agitation, or inability to sleep—per black-box teaching.",
          "Only positive mood changes.",
          "Never call the clinic.",
          "Stop all meds without talking to anyone.",
        ],
        correct: 0,
        rationale: "Suicidality monitoring during SSRI initiation is a board staple.",
      },
    ]),
    postTest: qt([
      {
        question: "A client on lithium has new coarse tremor, vomiting, and confusion. What is the priority?",
        options: [
          "Notify provider urgently; lithium toxicity is life-threatening—follow monitoring protocols.",
          "Give more lithium to fix symptoms.",
          "Ignore if lithium level is pending.",
          "Encourage extra NSAIDs for pain.",
        ],
        correct: 0,
        rationale: "Lithium toxicity requires urgent evaluation; NSAIDs can raise lithium levels in some cases.",
      },
      {
        question: "Why monitor metabolic parameters on long-term atypical antipsychotics?",
        options: [
          "Metabolic syndrome risk includes weight gain, dyslipidemia, and glucose elevation—per protocol.",
          "Metabolism never changes.",
          "Only blood pressure matters.",
          "Psych meds never affect labs.",
        ],
        correct: 0,
        rationale: "Metabolic monitoring is a standard teaching point for many antipsychotics.",
      },
      {
        question: "What is the nurse’s role when a client refuses a scheduled psychotropic?",
        options: [
          "Follow rights, facility policy, therapeutic communication, and provider notification—do not force PO meds outside legal/ethical frameworks in the stem.",
          "Force medications without assessment.",
          "Ignore refusal completely.",
          "Hide medication in food without policy.",
        ],
        correct: 0,
        rationale: "Rights-based care and policy-driven responses are tested alongside safety.",
      },
    ]),
  },
  {
    slug: "med-family-pain-sedation-gold",
    shortTitle: "Pain & sedation medications",
    topic: "Pain & sedation",
    topicSlug: "pain",
    bodySystem: "Pain / perioperative",
    npTitleStem: "Pain & sedation — multimodal & opioid risk",
    npSeoDescription:
      "NP themes: multimodal analgesia, opioid risk tools, naloxone coprescribing concepts, and sedation scales—stem-scoped.",
    sharedCore: `**Mechanism & exam framing**  
**Opioids** activate **mu receptors** (analgesia, sedation, respiratory depression); **acetaminophen** provides **central analgesia** with **hepatotoxicity** at overdose; **NSAIDs** reduce **inflammation** with **GI/renal** risk; **ketamine** (when shown) has **dissociative** effects. Exams test **respiratory depression** recognition, **PCA safety**, **sedation scales**, **naloxone** use in opioid toxicity, and **multimodal** strategies to reduce opioid exposure.

**Why it matters**  
Opioids plus **benzos/alcohol** are a **respiratory depression** classic. Boards punish **ignored RR** or **minimized** **somnolence** after a dose increase.

**Nursing integration**  
Trend **RR**, **sedation**, **oxygenation**; teach **constipation prophylaxis** when appropriate; use **pain reassessment** after interventions per policy.`,
    labsOmitReason: FAMILY_LABS_OMIT,
    pn: `**NCLEX-PN**  
Emphasize **vital signs**, **sedation reporting**, **safe administration**, and **nonpharmacologic comfort** within scope.`,
    caRpn: `**REx-PN**  
Collaboration for **respiratory depression**; objective reporting.`,
    usRn: `**NCLEX-RN**  
Expect **epidural/PCA monitoring**, **overdose response**, and **prioritization** with multiple sedating agents.`,
    caRn: `**Canada RN**  
Same spine; **opioid agonist therapy** harm-reduction themes may appear in Canadian contexts when shown.`,
    np: `**NP**  
May include **opioid risk/benefit counseling**, **buprenorphine** access themes, **multimodal orders**, and **UDS** monitoring concepts when hinted.`,
    examRelevance: `Traps: **snowing** the client with opioids while **RR** falls, or **giving naloxone** without airway support context when tested.`,
    scenario: `**Vignette**  
Post-op PCA: **RR 8**, **difficult to arouse**, **SpO₂ 86%**.

**Fork**  
**Airway and breathing first**—activate emergency response, prepare **naloxone** per protocol, support ventilation.`,
    takeaways: `• **RR + sedation** outrank “pain is 10/10” alone.  
• Pair with **high-alert** meds lesson.`,
    related: ["ham", "cj", "shock", "fluids"],
    preTest: qt([
      {
        question: "What is a priority nursing assessment after administering IV opioids?",
        options: [
          "Respiratory rate, sedation level, and oxygenation on an appropriate interval.",
          "Only pain score without vitals.",
          "Discharge planning immediately.",
          "Ignore sedation if pain improves.",
        ],
        correct: 0,
        rationale: "Respiratory depression is the primary opioid safety risk in acute care.",
      },
      {
        question: "Why combine acetaminophen with opioids in multimodal plans when ordered?",
        options: [
          "To improve analgesia and potentially reduce opioid requirements—per multimodal principles.",
          "To double hepatotoxicity always.",
          "To replace monitoring.",
          "To eliminate opioids always.",
        ],
        correct: 0,
        rationale: "Multimodal analgesia is a standard exam concept to reduce opioid exposure.",
      },
      {
        question: "Which finding should prompt fastest action in a client on opioids?",
        options: [
          "Respiratory rate 6 with pinpoint pupils and inability to arouse.",
          "Mild itch without airway compromise.",
          "Request for ice chips.",
          "Stable RR 16 with normal mentation.",
        ],
        correct: 0,
        rationale: "Opioid toxicity presents with respiratory and neurologic depression.",
      },
    ]),
    postTest: qt([
      {
        question: "After naloxone for opioid overdose, what is essential monitoring?",
        options: [
          "Watch for re-sedation because opioid duration may outlast naloxone; maintain airway support.",
          "Discharge immediately without observation.",
          "Give more opioids to balance.",
          "Ignore oxygen saturation.",
        ],
        correct: 0,
        rationale: "Re-sedation is a critical post-naloxone risk requiring continued monitoring.",
      },
      {
        question: "Why avoid duplicate acetaminophen sources across combination products?",
        options: [
          "To prevent acetaminophen overdose and liver injury.",
          "Duplicate acetaminophen is always safe.",
          "Liver injury cannot occur.",
          "OTC products do not contain acetaminophen.",
        ],
        correct: 0,
        rationale: "Medication reconciliation and duplicate therapy checks are high-yield safety topics.",
      },
      {
        question: "What is a nonpharmacologic adjunct nurses can support for pain when appropriate?",
        options: [
          "Positioning, ice/heat per order, relaxation, and sleep hygiene within the plan of care.",
          "Telling the client pain is imaginary.",
          "Avoiding all movement forever.",
          "Ignoring cultural preferences.",
        ],
        correct: 0,
        rationale: "Holistic comfort measures complement medications in exam scenarios.",
      },
    ]),
  },
  {
    slug: "med-family-emergency-response-gold",
    shortTitle: "Emergency response medications",
    topic: "Emergency medications",
    topicSlug: "shock",
    bodySystem: "Emergency / resuscitation",
    npTitleStem: "Emergency meds — ACLS-adjacent themes & safety",
    npSeoDescription:
      "NP urgent-care themes: anaphylaxis epinephrine, status epilepticus benzodiazepine protocols, and naloxone—always stem-scoped to orders and team roles.",
    sharedCore: `**Mechanism & exam framing**  
**Epinephrine** provides **alpha/beta agonism** for **anaphylaxis** and **cardiac arrest** contexts; **amiodarone/adenosine** appear in **arrhythmia** vignettes; **atropine** for **symptomatic bradycardia** themes; **calcium** for **hyperkalemia with ECG changes**; **bicarbonate** in select **toxicology** contexts; **naloxone** reverses **opioid** toxicity. Exams test **indication**, **contraindications**, **titration under monitoring**, and **team roles**—not memorizing every ACLS algorithm outside the stem.

**Why it matters**  
Emergency meds are **high consequence**: wrong route (epi **IM vs IV** contexts), **underdosing anaphylaxis**, or **delaying** defibrillation when indicated.

**Nursing integration**  
Prepare **drugs**, **monitor continuously**, **document times**, **closed-loop communication**, and **reassess** after every intervention.`,
    labsOmitReason: FAMILY_LABS_OMIT,
    pn: `**NCLEX-PN**  
Emphasize **preparation**, **timely reporting**, **CPR support roles**, and **safe administration per protocol**—avoid **independent advanced ordering**.`,
    caRpn: `**REx-PN**  
Collaboration during **codes**; **clear role** within scope.`,
    usRn: `**NCLEX-RN**  
Expect **code leadership themes**, **medication preparation**, **defibrillation readiness**, and **post-arrest care** priorities.`,
    caRn: `**Canada RN**  
Same resuscitation spine with **interprofessional** clarity.`,
    np: `**NP**  
Urgent-care items may include **anaphylaxis IM epinephrine**, **seizure rescue benzodiazepines**, and **site-of-care** decisions—**always** follow the stem’s setting and orders.`,
    examRelevance: `Traps: **delaying epinephrine** in anaphylaxis, **unsupervised** medication pushes, or **documentation** during **unstable CPR** without a team role.`,
    scenario: `**Vignette**  
**Anaphylaxis** after bee sting: **stridor**, **hypotension**, **wheezing**.

**Fork**  
**Epinephrine** per emergency protocol, **airway**, **oxygen**, **prepare** for second dose and **IV access** as ordered.`,
    takeaways: `• **Anaphylaxis** = epinephrine early—follow route/dose in stem.  
• Pair with **shock** and **clinical judgment** lessons.`,
    related: ["shock", "cj", "acs", "ham"],
    preTest: qt([
      {
        question: "In classic exam teaching for anaphylaxis with airway compromise, what is a priority medication theme?",
        options: [
          "Epinephrine as the first-line treatment for anaphylaxis—route per protocol/stem.",
          "Antihistamines alone as first line always.",
          "Oral steroids only before epinephrine always.",
          "Observation without treatment.",
        ],
        correct: 0,
        rationale: "Epinephrine is the cornerstone therapy for anaphylaxis in exam vignettes.",
      },
      {
        question: "Why is continuous monitoring essential after naloxone administration?",
        options: [
          "Opioids may outlast naloxone, causing recurrent respiratory depression.",
          "Naloxone lasts forever.",
          "Monitoring is unnecessary.",
          "Respiratory depression cannot recur.",
        ],
        correct: 0,
        rationale: "Re-sedation risk requires ongoing observation and readiness to re-dose per protocol.",
      },
      {
        question: "What is the nurse’s role during cardiac arrest medication administration?",
        options: [
          "Prepare correct doses, verify, document times, and communicate with team leader per ACLS-style roles.",
          "Guess doses independently.",
          "Leave the room.",
          "Stop compressions unnecessarily without team coordination.",
        ],
        correct: 0,
        rationale: "Team roles and medication safety during codes are common testing points.",
      },
    ]),
    postTest: qt([
      {
        question: "A client with hyperkalemia shows peaked T waves and wide QRS. What therapy theme is commonly tested alongside monitoring?",
        options: [
          "Calcium stabilization, insulin/glucose shift, and other therapies per protocol—not ignoring ECG progression.",
          "Ignore ECG changes.",
          "Give potassium supplements.",
          "Delay all treatment until rounds tomorrow.",
        ],
        correct: 0,
        rationale: "Hyperkalemia with ECG changes is treated as an emergency with protocol-driven therapy.",
      },
      {
        question: "Why might adenosine be used in stable narrow-complex SVT in exam stems?",
        options: [
          "To terminate certain SVT rhythms when indicated—administer rapidly per protocol with monitoring.",
          "Adenosine treats VF always.",
          "Adenosine is only an antibiotic.",
          "Adenosine never needs monitoring.",
        ],
        correct: 0,
        rationale: "Adenosine administration and monitoring are classic dysrhythmia teaching points.",
      },
      {
        question: "What is essential after giving emergency medications during resuscitation?",
        options: [
          "Reassess rhythm, perfusion, and end-tidal CO2 when available; continue high-quality CPR as indicated.",
          "Stop all efforts after one dose.",
          "Ignore rhythm checks.",
          "Avoid documentation.",
        ],
        correct: 0,
        rationale: "Continuous reassessment guides the next algorithm step in resuscitation scenarios.",
      },
    ]),
  },
];
