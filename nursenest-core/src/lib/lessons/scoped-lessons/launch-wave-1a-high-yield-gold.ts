/**
 * Launch Wave 1a — seven high-yield scoped gold lessons (endocrine, cardio, resp, GI, renal, neuro, pharm).
 * Injected via `scoped-gold-registry.ts` when the slug is absent from catalog.json for that pathway.
 */
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";
import { rel } from "@/lib/lessons/scoped-lessons/launch-wave-1-rel";
import {
  type Wave1LessonSpec,
  wave1ProviderFromSpec,
  type Wave1ScopedGoldProvider,
} from "@/lib/lessons/scoped-lessons/launch-wave-1-shared";

const Q = {
  preDka: [
    {
      question:
        "Before starting insulin infusion for DKA, which assessment is most important when serum potassium is not yet known?",
      options: [
        "Discontinue all fluids until potassium returns.",
        "Obtain potassium level and follow protocol for replacement before or with insulin as indicated; insulin drives K⁺ intracellularly.",
        "Give rapid insulin bolus via IM route to speed recovery.",
        "Hold oxygen until glucose normalizes.",
      ],
      correct: 1,
      rationale:
        "Hypokalemia plus insulin can precipitate life-threatening arrhythmias; protocols prioritize K⁺ assessment and replacement alignment with insulin initiation.",
    },
    {
      question: "Which finding best differentiates DKA from hyperosmolar hyperglycemic state (HHS) in classic teaching vignettes?",
      options: [
        "Profound ketoacidosis with anion gap elevation versus very high osmolality with minimal ketosis in many HHS presentations.",
        "HHS always presents with normal glucose.",
        "DKA occurs only in type 2 diabetes.",
        "HHS never causes altered mental status.",
      ],
      correct: 0,
      rationale:
        "Board vignettes contrast ketotic acidosis patterns with hyperosmolar dehydration; overlap exists, but the stem usually signals one dominant pattern.",
    },
    {
      question: "A client with suspected DKA has K⁺ 5.8 mEq/L on arrival but repeat after fluid resuscitation is 3.2 mEq/L. What does this reflect?",
      options: [
        "Lab error only—ignore the change.",
        "Hemoconcentration initially and intracellular shift with fluid/insulin—requires careful replacement per protocol.",
        "Hyperkalemia that should be treated with calcium first in every case.",
        "Potassium is irrelevant in DKA.",
      ],
      correct: 1,
      rationale:
        "Total body K⁺ is often depleted even when initial serum K⁺ looks normal/high; therapy shifts K⁺ and can unmask hypokalemia.",
    },
  ] satisfies PathwayLessonQuizItem[],
  postDka: [
    {
      question: "Which client statement indicates understanding of sick-day management for insulin-requiring diabetes?",
      options: [
        "I will stop insulin if I cannot eat.",
        "I will monitor glucose/ketones per plan and contact my team if thresholds are crossed—insulin adjustments follow my written plan.",
        "I should skip fluids to lower glucose faster.",
        "I will double long-acting insulin whenever I feel nauseous without measuring glucose.",
      ],
      correct: 1,
      rationale:
        "Sick-day teaching emphasizes monitoring, hydration, and clinician-guided adjustments—not arbitrary insulin cessation.",
    },
    {
      question: "Why is frequent glucose and electrolyte monitoring essential during DKA treatment?",
      options: [
        "It is only for documentation.",
        "Therapy shifts volume, potassium, and acid-base quickly—monitoring guides safe titration and catches complications.",
        "Labs are needed once at admission only.",
        "Monitoring replaces provider assessment.",
      ],
      correct: 1,
      rationale:
        "DKA resolution is dynamic; nursing surveillance closes the loop with the interprofessional team.",
    },
    {
      question: "Which symptom cluster should trigger urgent evaluation for possible hyperglycemic crisis?",
      options: [
        "Mild hunger after skipping breakfast.",
        "Polyuria, polydipsia, vomiting, abdominal pain, Kussmaul respirations, or altered mentation with marked hyperglycemia.",
        "Single reading of 140 mg/dL after lunch.",
        "Localized joint pain without systemic signs.",
      ],
      correct: 1,
      rationale:
        "Hyperglycemic emergencies present with dehydration, acidosis or extreme hyperosmolarity, and systemic symptoms—not isolated mild hyperglycemia.",
    },
  ] satisfies PathwayLessonQuizItem[],
};

export const LAUNCH_WAVE_1A_SPECS: Wave1LessonSpec[] = [
  {
    slug: "dka-hhs-hyperglycemic-emergencies-gold",
    topic: "Diabetic ketoacidosis & HHS",
    topicSlug: "endocrine",
    bodySystem: "Endocrine / metabolic",
    npTitleStem: "DKA & HHS — hyperglycemic emergencies",
    npSeoDescription:
      "NP-level triage of hyperglycemic crises: emergency versus urgent care, fluid and insulin safety concepts, potassium monitoring, and explicit return precautions for type 1 and insulin-deficient states.",
    sharedCore: `**What DKA and HHS are**  
**Diabetic ketoacidosis (DKA)** is an absolute or functional **insulin deficiency** state with **hyperglycemia**, **ketogenesis**, and **metabolic acidosis** (high anion gap pattern when classically taught). **Hyperosmolar hyperglycemic state (HHS)** is extreme **hyperglycemia** and **dehydration** with **hyperosmolality**; ketoacidosis may be absent or mild, but hemodynamic compromise and altered mentation are common.

**Why boards test this**  
Items reward recognizing **volume depletion**, **potassium shifts**, **acid-base patterns**, and **safe sequencing** of **fluids**, **insulin**, and **electrolyte replacement**—not memorizing one number divorced from the stem. They also test **patient education** for **sick-day rules** and **when to seek emergency care**.

**Mechanistic anchors**  
Without insulin, glucose accumulates osmotically while cells remain “starved,” driving lipolysis and ketone formation in DKA. Osmotic diuresis causes **free water and electrolyte losses** even when serum sodium may look misleading. Insulin therapy drives **potassium into cells**, so **hypokalemia** can develop dangerously if not anticipated.`,
    labsDiagnostics: `**Glucose and ketones**  
Expect **markedly elevated glucose** in both crises (HHS often extremely high). **Beta-hydroxybutyrate** or **serum/urine ketones** support ketotic states when the vignette tests DKA recognition.

**Electrolytes and acid-base**  
**Anion gap metabolic acidosis** is central to classic DKA teaching. **Bicarbonate** may be low; **effective osmolality** is emphasized in HHS. **Potassium** may be **normal or high initially** despite **total body depletion**—repeat levels during treatment.

**Renal markers and osmolality**  
**BUN/creatinine** reflect prerenal physiology from dehydration. **Serum osmolality** helps frame HHS severity and mental status changes.

**Nursing integration**  
Your role is **timely sampling**, **trend recognition**, **insulin infusion line safety**, **accurate intake/output**, and **communicating** abnormal electrolytes before they become arrhythmogenic—not independent titration outside protocol or orders.`,
    ...rel("fluids", "cj", "sepsis"),
    variants: {
      us_pn: {
        title: "DKA & HHS: recognition & safety (NCLEX-PN, US)",
        seoTitle: "DKA & HHS nursing priorities | NCLEX-PN US | NurseNest",
        seoDescription:
          "US PN: hyperglycemic crisis recognition, potassium/insulin safety within orders, escalation, and sick-day teaching boundaries without independent prescriptive changes.",
        clinical_meaning: `**NCLEX-PN scope**  
You will be tested on **recognizing instability**, **executing orders**, **monitoring trends**, **reinforcing teaching**, and **escalating** when findings exceed parameters. You are not expected to **independently prescribe insulin rates** or **choose IV fluid type** unless the stem embeds a standing order set you must apply.

**High-yield behaviors**  
Track **vitals**, **mental status**, **I/O**, **glucose checks**, and **electrolyte results**; protect **two-nurse checks** for insulin infusions when policy requires; prevent **hypoglycemia** during recovery; watch **hypokalemia** symptoms (dysrhythmia risk) as insulin takes effect.`,
        exam_relevance: `Traps include **routine tasks** ahead of **unstable vitals**, **withholding escalation** when mentation worsens, or **medication actions** outside PN scope. Correct answers **pair assessment with communication** and **order-driven therapy**.`,
        clinical_scenario: `**Vignette**  
A client arrives with **dry mucosa**, **RR 28**, **HR 118**, **glucose 580 mg/dL**, **positive ketones**, and **K⁺ pending**. They are alert but nauseated.

**PN fork**  
**Continuous assessment**, **notify RN/provider** for protocol-driven therapy, **prepare labs**, **maintain safety** with frequent monitoring, and **avoid improvising** insulin or fluid boluses beyond orders.`,
        takeaways: `• **Insulin + K⁺ dynamics** are exam favorites—never treat numbers without trend and protocol.  
• **Escalate** altered mentation, refractory hypotension, or arrhythmias.  
• **Teach** sick-day monitoring within your role; defer med changes to authorized prescribers.  
• Pair with **fluids/electrolytes** and **clinical judgment** gold lessons.`,
      },
      ca_rpn: {
        title: "DKA & HHS: recognition & safety (REx-PN, Canada)",
        seoTitle: "DKA & HHS nursing priorities | REx-PN Canada | NurseNest",
        seoDescription:
          "Canadian RPN: collaborative care for hyperglycemic emergencies with metric labs, college-aligned scope, and clear RN/NP escalation when status changes.",
        clinical_meaning: `**Canadian practical nursing**  
Items emphasize **assessment**, **timely reporting**, **safe administration within orders**, and **interprofessional collaboration**. Stems may use **mmol/L glucose** and Canadian care settings—convert your reasoning, not memorized US-only cutoffs, when units differ.

**Safety spine**  
Protect clients from **hypokalemia** during insulin therapy, **hypoglycemia** as glucose falls, and **fluid overload** in vulnerable hearts when the vignette signals caution.`,
        exam_relevance: `Watch for **scope errors** (independent insulin adjustments) paired with **reasonable-sounding distractors**. Choose **collaboration**, **objective reporting**, and **policy-aligned actions**.`,
        clinical_scenario: `**Vignette**  
An RPN receives report: client with **known diabetes**, **vomiting**, **Kussmaul breathing**, **glucose per protocol markedly high** on point-of-care testing.

**RPN fork**  
Stay with the client, **repeat vitals**, **notify RN/NP/physician** per unit procedure, **prepare ordered labs**, and **monitor** for dysrhythmia symptoms while **avoiding independent titration**.`,
        takeaways: `• **Metric units** may appear—read carefully.  
• **Escalation** beats silent fixes.  
• **Documentation** of trends supports safe care transitions.  
• Cross-link **fluids** and **clinical judgment** lessons for integrated drills.`,
      },
      us_rn: {
        title: "DKA & HHS: clinical judgment (NCLEX-RN, US)",
        seoTitle: "DKA & HHS clinical judgment | NCLEX-RN US | NurseNest",
        seoDescription:
          "US RN: hyperglycemic emergencies with acidosis/osmolality patterns, safe insulin infusion and potassium monitoring, prioritization, and interprofessional communication.",
        clinical_meaning: `**NCLEX-RN** expects **synthesis**: identify the crisis pattern, **prioritize airway/circulation/neurologic status**, align nursing actions with **order sets/protocols**, and **communicate** critical labs early.

**Clinical operations**  
You coordinate **labs**, **two-provider verification** practices where required, **insulin infusion safety**, **potassium replacement alignment**, and **education** for transition out of ICU/step-down when stable.`,
        exam_relevance: `Common traps: **completing paperwork** before **unstable vitals**, **teaching** while acidosis is uncorrected without addressing immediate risk, or **choosing independent prescriptive changes** outside the stem’s RN authority.`,
        clinical_scenario: `**Vignette — ED**  
Client with **DKA protocol** started: **insulin infusion**, **fluid resuscitation**, **frequent labs**. K⁺ trends **down** into **hypokalemic range**.

**RN fork**  
Follow **protocol and provider communication** for **K⁺ replacement**; **monitor ECG** as indicated; **do not ignore** dysrhythmia symptoms; **reassess** after each intervention.`,
        takeaways: `• **Dynamic** disease—reassess frequently.  
• **Potassium** is the silent arrhythmia switch during treatment.  
• **Team communication** with concise data wins points.  
• Drill **prioritization** cases paired with this topic filter.`,
      },
      ca_rn: {
        title: "DKA & HHS: clinical judgment (NCLEX-RN, Canada)",
        seoTitle: "DKA & HHS clinical judgment | NCLEX-RN Canada | NurseNest",
        seoDescription:
          "Canada RN: hyperglycemic emergencies with SI labs, safe therapy sequencing, and escalation patterns aligned to acute care practice.",
        clinical_meaning: `**Canadian RN items** mirror US judgment with **metric** labs and **interprofessional** language. Your role includes **independent nursing assessment**, **advocacy**, and **care coordination** within standards.

**Integration**  
Link **I/O**, **neuro checks**, **cardiac rhythm monitoring** when indicated, and **clear handoffs** during transport or unit transitions.`,
        exam_relevance: `Prioritize **life threats** first; avoid **delay** when mental status or perfusion deteriorates. Expect **Canadian** labels and units as distractor filters, not separate logic trees.`,
        clinical_scenario: `**Vignette — medical unit**  
Post-ED client with resolving DKA; insulin infusion continues; glucose is falling appropriately; next labs show **K⁺ 3.0**.

**RN fork**  
**Escalate** per protocol, **prepare replacement** as ordered, **monitor** cardiac rhythm, and **prevent** oral intake that conflicts with NPO status unless ordered.`,
        takeaways: `• **Transitions of care** are high-risk—verify orders after handoffs.  
• **Electrolyte safety** continues through recovery.  
• Pair with **fluids/electrolytes** gold for deeper lab integration.`,
      },
      us_np: {
        title: "DKA & HHS — hyperglycemic emergencies (NP placeholder)",
        seoTitle: "placeholder",
        seoDescription:
          "NP-level triage of hyperglycemic crises: emergency versus urgent care, fluid and insulin safety concepts, potassium monitoring, and explicit return precautions for insulin-deficient states.",
        clinical_meaning: `**NP reasoning**  
You are tested on **risk stratification** (ICU vs step-down), **criteria for admission**, **comorbidity interplay** (heart failure with fluids, CKD with potassium), **patient-specific insulin plans**, and **cannot-miss** complications (cerebral edema risk in pediatric contexts when the stem includes peds; adult boards may still reference monitoring themes).

**Outpatient bridge**  
For **primary care** frames, know **sick-day rules**, **when ED evaluation is mandatory**, and **documentation** that supports safe transitions.`,
        exam_relevance: `Look for answers that **avoid premature reassurance**, **specify monitoring intervals**, and **align site-of-care** with severity—rather than vague “follow up sometime.”`,
        clinical_scenario: `**Vignette — phone triage**  
Adult with **T1DM** reports **persistent vomiting**, **large ketones**, **glucose >400**, and **unable to keep fluids down**.

**NP fork**  
Direct **emergency evaluation**; provide **clear safety netting**; avoid advising **aggressive insulin changes** without assessment and labs.`,
        takeaways: `• **Red-flag** vomiting + ketones + inability to hydrate.  
• **Document** decision rationale and follow-up.  
• **Coordinate** with ED when uncertainty remains.`,
      },
    },
    preTest: Q.preDka,
    postTest: Q.postDka,
  },
];

export const LAUNCH_WAVE_1A_PROVIDERS: Wave1ScopedGoldProvider[] = LAUNCH_WAVE_1A_SPECS.map(wave1ProviderFromSpec);
