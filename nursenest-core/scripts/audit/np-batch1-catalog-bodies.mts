/**
 * Legacy five-block bodies for NP batch 1 (FNP catalog + integrated PAD reviews + geriatric).
 * Consumed by apply-np-lesson-batch1-catalog-patches.mts — not imported by the Next app.
 */
import type { PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";

type LessonMeta = {
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  seoDescription: string;
};

const HUB = "[FNP lesson hub](/us/np/fnp/lessons)";

/** Appended to deepen legacy buckets for certification scoring without changing slugs or routes. */
const NP_EXAM_DEPTH_PAD_CORE = `

**NP certification execution**  
Before you lock an answer, articulate **one unstable feature** you refuse to ignore, **one objective measurement** you would recheck after an intervention, and **one escalation trigger** you would not postpone. Items often pair **two partially correct plans**—pick the one that **closes risk** with **monitoring** and **follow-up** appropriate to **primary-care NP** scope.`;

const NP_EXAM_DEPTH_PAD_TAKE = `

**Summary for boards**  
Before you submit, re-scan for **urgent** findings, **contraindications** to the tempting option, and **red flags** that demand escalation rather than reassurance. **Monitoring** after medication changes is part of the correct answer whenever the stem implies renal, electrolyte, perfusion, or bleeding risk—items punish “treat and forget.” Tie **follow-up interval** to objective severity and document **what would trigger emergency care**.

**Exam habit:** rehearse **if–then** rules aloud (“if new hypoxia after this therapy, then…”) so **compassionate distractors** do not override **objective trends**.`;

function extractPadFocus(meta: LessonMeta): string {
  const m = meta.seoDescription.match(/Extended practice:\s*([^—.]+)/i);
  if (m?.[1]) return m[1].trim();
  return `${meta.topic} × integrated safety/clinical judgment`;
}

/** Three rotating internal links (LESSON:), deterministic by slug. */
function lessonLinks(slug: string): string {
  const pool: [string, string][] = [
    ["Differential reasoning in primary care", "fnp-differential-primary-care"],
    ["Adult hypertension intensification", "fnp-adult-hypertension-intensification"],
    ["Prenatal anemia interpretation", "fnp-womens-prenatal-anemia-workup"],
    ["Pediatric fever urgency", "fnp-pediatric-fever-urgency"],
    ["Geriatric falls & syncope", "fnp-geriatric-falls-syncope"],
  ];
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h + slug.charCodeAt(i) * (i + 1)) % 1_000_007;
  const a = pool[h % pool.length]!;
  const b = pool[(h + 3) % pool.length]!;
  const c = pool[(h + 7) % pool.length]!;
  return `[${a[0]}](LESSON:${a[1]}), [${b[0]}](LESSON:${b[1]}), and [${c[0]}](LESSON:${c[1]})`;
}

export function buildPadIntegratedReviewSections(meta: LessonMeta): PathwayLessonSection[] {
  const focus = extractPadFocus(meta);
  const links = lessonLinks(meta.slug);
  return [
    {
      id: "clinical_meaning",
      heading: "Clinical meaning",
      kind: "clinical_meaning",
      body: `**${meta.title.replace(/\s+/g, " ")}** situates your study session at the intersection of **${meta.topic}** knowledge and the planning domain emphasized in this integrated review (${focus}). In **family nurse practitioner** certification preparation, “disease × client need × safety” questions rarely isolate a single fact—they reward whether you can **interpret abnormal findings**, **sequence actions** that match severity, and **document** decisions that another clinician could continue.

For **FNP** items, expect **ambulatory and urgent episodic** framing more than ICU granularity: you are choosing **next-assessment**, **initial therapy**, **referral timing**, and **follow-up intervals** that respect **comorbidity**, **pregnancy**, **older-adult physiology**, and **health literacy**. When the vignette mentions **infection control**, **medication safety**, or **prioritization**, treat those cues as **constraints on your best answer**, not as decorative labels.

Pair this page’s focus with your pathway context (${HUB}) and cross-link related concepts when the stem blurs organ systems: ${links}.

**Depth:** translate textbook knowledge into **decision rules** you can defend under time pressure—what you would **not** do, what you would **repeat**, and what would **trigger escalation** even when the client looks “stable enough” on one dimension alone.`,
    },
    {
      id: "exam_relevance",
      heading: "Exam relevance",
      kind: "exam_relevance",
      body: `Examiners use **${meta.bodySystem}** integrated items to test **risk stratification**: abnormal vitals or labs should change your priority even when a tempting answer offers **education** or **routine tasks** first. Watch for **“first”**, **“priority”**, and **“most important”** stems paired with subtle instability—your job is to **close the safety loop** before optimizing convenience.

**Trap family 1:** choosing **broad testing** without anchoring indication and pre-test probability. **Trap family 2:** **delaying escalation** when criteria for urgent evaluation are already met. **Trap family 3:** answers that **silently expand APRN scope** relative to what the stem authorizes.

**Synthesis:** two answers can sound partly right—pick the one that matches **severity implied by data**, **time course**, and **site-of-care** (home, clinic, ED) without skipping monitoring when you intervene.`,
    },
    {
      id: "core_concept",
      heading: "Core concept",
      kind: "core_concept",
      body: `**Integrated objective:** ${focus}.

- **Assessment spine:** trend-focused vitals, targeted history for **red flags**, focused exam aligned to the chief concern, and **interpretation** of provided labs/imaging—not exhaustive fishing when stability is plausible.
- **Safety & infection framing:** when isolation, device bundles, or sterile technique appear, treat them as **non-negotiable** when the client or setting demands them—boards punish **“efficiency”** that violates basic safety rules.
- **Medication & therapeutic planning:** select **first-line** approaches where appropriate; choose **renal/hepatic adjustments** when the stem names organ dysfunction; plan **monitoring** after initiation or dose changes.
- **Care coordination:** know **who** owns hospitalization decisions, **when** cardiology/pulm/nephrology input is standard, and how to **close the loop** on referrals and follow-up.
- **Teaching & coaching:** use **teach-back** themes when health literacy is low; tailor counseling to **measurable targets** (symptom thresholds, weight gain in HF, peak flow in asthma when relevant).
- **Pediatrics / pregnancy / geriatrics modifiers:** age is not decorative—**physiologic reserve**, **pharmacokinetics**, and **falls risk** change acceptable answers.

**NP reasoning:** choose options that show you can **name the primary risk**, **justify the next step**, and **anticipate what could worsen overnight** if unmanaged.${NP_EXAM_DEPTH_PAD_CORE}`,
    },
    {
      id: "clinical_scenario",
      heading: "Clinical scenario",
      kind: "clinical_scenario",
      body: `**Patient vignette.** A 52-year-old client with **${meta.topic}**-related concerns **reports** a symptom change that worries them—your assessment reveals **discordance**: they describe stability, but the stem offers **new tachycardia**, **hypotension**, **hypoxia**, or **acute mental status change** you cannot explain away.

**Fork:** prioritize **life threats** first—secure **airway/oxygenation/perfusion** thinking, repeat **focused vitals**, obtain **time-sensitive diagnostics** aligned to presentation, and **activate higher-level care** when thresholds are crossed for **${meta.bodySystem}** emergencies suggested by the stem. Do not stall on long counseling when objective data demand escalation.

**Clinical application:** document **objective trends**, **medication timing**, and **caregiver reliability** when follow-up hinges on monitoring at home; choose **short-interval follow-up** when diagnosis remains **working** and **risk** is nonzero.

**Assessment** should include explicit **return precautions** and **what would make the patient call 911**—NP items reward **safety netting**, not vague reassurance.`,
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: `- **Read integrated stems twice:** first for **role and setting**, second for **hidden instability** in vitals, age, pregnancy, or comorbidity.
- **Match actions to risk:** escalation beats “watchful waiting” when the stem crosses explicit dangerous thresholds.
- **Keep scope crisp:** prescribing, referral, and follow-up intervals must align with **FNP primary-care** framing and the vignette’s **licensure cues**.

**Study loop:** connect this review to ${links} and return through ${HUB} to reinforce **topic adjacency**—certification items often stack **common outpatient problems** with **silent acute** complications.

**NP drill:** before selecting an answer, name **one worst-case** you must rule out given the data—if your chosen option ignores that possibility, re-read the stem.${NP_EXAM_DEPTH_PAD_TAKE}`,
    },
  ];
}

function hfOverlay(): PathwayLessonSection[] {
  const links = lessonLinks("fnp-overlay-heart-failure");
  return [
    {
      id: "clinical_meaning",
      heading: "Clinical meaning",
      kind: "clinical_meaning",
      body: `**Heart failure (HF)** in **FNP** practice is a syndrome of **inadequate cardiac output** or **elevated filling pressures** at rest or exertion—HFpEF and HFrEF distinctions matter for **mechanism language**, but exam stems usually force **phenotype + acuity + comorbidity** decisions (IHD, hypertension, valvular disease, toxic-metabolic drivers). Your NP job is **risk stratification**: who can be optimized in primary care today versus who needs **same-day evaluation** or **ED** for **decompensation**.

Think in **congestion** (orthopnea, edema, JVP) and **perfusion** (fatigue, narrow pulse pressure, cool extremities, acute kidney injury, lactate trends when shown)—boards exploit **low cardiac output** versus **volume overload** mismanagement. Connect symptoms to **objective** volume status clues when provided, and avoid anchoring on **ejection fraction alone** when the vignette screams HFpEF with **preserved EF** and **comorbidity-heavy** phenotypes.

Use guideline-consistent vocabulary: **GDMT** themes for HFrEF (RAAS/ARNI, evidence-based beta blockade where appropriate, SGLT2 class benefits in many candidates, mineralocorticoid antagonists where renal/potassium allow), **blood pressure and rhythm control** lenses for HFpEF-heavy scenarios, and **anticoagulation decisions** when **AF** coexists—always pair pharmacology with **monitoring** and **contraindication** traps the stem encodes.

Clinical cross-connections: ${links}; organize longitudinal HF plans with explicit **self-monitoring anchors** (daily weights when appropriate, symptom thresholds) and **medication titration schedules** coordinated with cardiology when required.

**Closing frame:** treat HF as a **trajectory diagnosis**—your answer should match **improvement versus deterioration** implied by vitals, labs, and symptoms, not a static snapshot.${NP_EXAM_DEPTH_PAD_CORE}`,
    },
    {
      id: "exam_relevance",
      heading: "Exam relevance",
      kind: "exam_relevance",
      body: `HF items reward **next-step** judgment: **who needs diuresis**, **who needs urgent imaging or biomarkers**, **who needs device/ specialty referral**, and **who needs med initiation or uptitration** versus **hold** due to **hypotension**, **acute kidney injury**, or **hyperkalemia**. Traps include **NSAIDs**, **nondihydropyridine rate control** in vulnerable profiles when the stem hides conduction disease, **premature GDMT uptitration** without monitoring cadence, and **ignoring ischemia** as a precipitant.

Expect **BNP/NT-proBNP** interpretation when provided—false negatives with obesity, false positives with AF or kidney dysfunction—choose **contextual** application, not “always obtain” or “never trust.” When **renal function** shifts, exam writers test whether you **hold or adjust** RAAS pathway drugs and **recheck labs**.

**Synthesis:** prioritize **oxygenation/perfusion** threats, **arrhythmia** with instability, **acute coronary syndrome** masquerading as “just HF,” and **medication toxicity** (digoxin, antiarrhythmics) when clues appear—then layer **education** only after acute risk is addressed.`,
    },
    {
      id: "core_concept",
      heading: "Core concept",
      kind: "core_concept",
      body: `- **Classify acuity:** **warm/wet** profiles scream volume removal; **cold/wet** implies **poor perfusion plus congestion**—escalation pathways differ; **cold/dry** raises **cardiogenic shock** themes when shock data exist.
- **Volume status & congestion:** align **diuretic strategy** with renal function, electrolytes, and **functional class** clues—watch **hypokalemia/magnesium** with diuresis when stems track labs.
- **Comorbidity lenses:** **CKD** changes RAAS/MRA tolerance; **COPD** influences beta-blocker titration prudence; **diabetes** pairs with **SGLT2** benefits and glycemic monitoring; **sleep apnea** worsens cardiometabolic risk.
- **Device & referral thresholds:** **ICDCRT** considerations are specialty-led but NP items may test **recognition** of recurrent **ventricular arrhythmia**, **ischemia**, or **refractory class IV** symptoms prompting referral.
- **Patient education:** sodium fluency, alcohol moderation where relevant, **immunizations** in chronic HF, **activity pacing**, and **when to call** for rapid weight gain or rest symptoms.

**NP prescribing mindset:** every titration needs **follow-up interval**, **labs**, and **symptom targets**—pick answers that show **closed-loop** care.`,
    },
    {
      id: "clinical_scenario",
      heading: "Clinical scenario",
      kind: "clinical_scenario",
      body: `**Patient vignette.** A 68-year-old **reports** increasing **orthopnea**, **3-pound overnight weight gain**, and **new exertional hypoxia**; vitals show **BP 88/58**, **HR 118**, **SpO₂ 89%** on room air, lungs with **bibasilar crackles**, and **cool, mottled** extremities.

**Fork:** treat as **acute decompensated HF with hypoperfusion and congestion**—prioritize **EMS/ED pathway** when instability criteria are met in the stem; in milder ambulatory decompensation, choose **timely diuresis**, **oxygen**, **ECG**, **labs**, and **cardiology coordination** over **“recheck in months.”**

**Clinical application:** if the stem gives **nitroglycerin** or **ACEi** choices in acute hypoperfusion, avoid **routine afterload reduction** without **perfusion** context—match therapy to **blood pressure** and **acute coronary** concerns.

**Assessment documentation** should capture **volume trends**, **renal function**, and **K⁺** when RAAS-active drugs are in play—NP answers should **mitigate predictable harms**.`,
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: `- **Stability is data-dependent:** repeat vitals and objective congestion signs before reassuring.
- **GDMT is iterative:** titrate with **labs**, **symptoms**, and **BP/HR** guardrails—never “set and forget.”
- **Escalate** for **hypoperfusion**, **ischemic equivalents**, **arrhythmia with instability**, or **AKI** with RAAS therapy—HF is a **team sport**.

**Related:** ${links} · ${HUB}

**NP exam tip:** If two plans sound guideline-aligned, choose the one with **tighter follow-up**, **explicit monitoring**, and **patient-appropriate safety netting** for the acuity implied.${NP_EXAM_DEPTH_PAD_TAKE}`,
    },
  ];
}

/** Minimal exporter: additional overlays reuse structurally similar high-yield blocks in patch script. */
export const NP_BATCH1_SIMPLE_OVERLAYS: Record<
  string,
  () => { disease: string; focusLine: string; pearl: string }
> = {
  "fnp-overlay-myocardial-infarction": () => ({
    disease: "acute coronary syndrome / myocardial infarction",
    focusLine:
      "time-sensitive ECG recognition, anti-ischemic and antithrombotic themes as the stem authorizes, and **facility decision** (ED cath lab activation) vs **outpatient workup** when presentations are low-risk and guidelines support it.",
    pearl:
      "**Women, older adults, and people with diabetes** may have atypical ischemic equivalents—maintain a low threshold for **objective risk stratification**.",
  }),
  "fnp-overlay-shock": () => ({
    disease: "shock states (distributive, hypovolemic, cardiogenic, obstructive)",
    focusLine:
      "**perfusion first:** source control thinking for sepsis, **fluid responsiveness** nuance, **vasopressor** authorization patterns, and **immediate escalation** when end-organ hypoperfusion is evident.",
    pearl:
      "Do not let **normal blood pressure** reassure you when the stem offers **tachycardia, confusion, oliguria, or rising lactate**—shock can be **cryptic** early.",
  }),
  "fnp-overlay-abg-acid-base": () => ({
    disease: "ABG interpretation and acid–base derangements",
    focusLine:
      "**compensation expectations**, **mixed** disorders, **anion gap** metabolic acidosis forks (ketoalcoholic, toxic alcohols, lactic, renal), and **oxygenation** failure patterns that change site-of-care.",
    pearl:
      "When ABG and chemistry **disagree**, trust **clinical context** and repeat sampling pre-analytics—exam traps hide **timing** and **line issues**.",
  }),
  "fnp-overlay-electrolytes-volume": () => ({
    disease: "electrolyte emergencies and volume disorders",
    focusLine:
      "**hyperK** with ECG changes, **symptomatic hyponatremia**, **refeeding** risk, and **calcium/phosphate/magnesium** interplay in critical symptoms.",
    pearl:
      "Therapy priorities follow **cardiac membrane stabilization** and **causative reversal** more than memorizing a single number in isolation.",
  }),
  "fnp-overlay-respiratory-acute": () => ({
    disease: "acute respiratory failure and severe pulmonary pathology in ambulatory-to-ED transitions",
    focusLine:
      "**oxygen titration**, **ventilation decision support** where your scope implies recognition not independent settings, **PE vs ACS vs pneumonia** forks when the vignette supplies risk factors.",
    pearl:
      "**Silent hypoxia** can occur without distress—pulse oximetry and **work of breathing** together frame severity.",
  }),
  "fnp-overlay-sepsis-infection": () => ({
    disease: "serious infection and sepsis physiology",
    focusLine:
      "**source identification**, **time-to-antibiotics** themes within role, **culture-before-antibiotics** when stable enough, and **de-escalation** thinking for stewardship.",
    pearl:
      "Fever is **absent** in many vulnerable hosts—anchor decisions to **perfusion and mental status**, not a thermometer alone.",
  }),
  "fnp-overlay-np-differential-prescribing-chronic": () => ({
    disease: "chronic disease prescribing and de-prescribing in primary care",
    focusLine:
      "**start low/go slow** where geriatric sensitivity matters, **drug–drug** and **drug–disease** interactions, **renal dosing**, and **shared decision-making** for long-term preventive meds.",
    pearl:
      "When stems add **acute illness**, many chronic agents need **temporary holds**—read the kidney and hemodynamic story before refilling defaults.",
  }),
};

export function buildSimpleOverlaySections(slug: string, links: string): PathwayLessonSection[] {
  const fn = NP_BATCH1_SIMPLE_OVERLAYS[slug];
  if (!fn) throw new Error(`NP_BATCH1_SIMPLE_OVERLAYS missing ${slug}`);
  const b = fn();
  return [
    {
      id: "clinical_meaning",
      heading: "Clinical meaning",
      kind: "clinical_meaning",
      body: `This **FNP overlay** concentrates on **APRN-level** reasoning for **${b.disease}**—not duplicate RN pathophys drills. In certification-style items, you operationalize **problem representation**, **risk stratification**, **safe prescribing**, and **timely escalation** when ambulatory management is insufficient.

${b.focusLine}

Pair longitudinal depth with adjacent FNP topics (${links}) and route larger theory through ${HUB}; when an RN sibling lesson exists for the same disease family, treat this page as the **decision-making layer** on top of foundational mechanism review.

**Patient-centered nuance:** respect **values**, **adherence barriers**, and **social determinants** when “right on paper” therapy fails in vignettes—still, **acute stability** overrides optimization fantasies when data turn dangerous.`,
    },
    {
      id: "exam_relevance",
      heading: "Exam relevance",
      kind: "exam_relevance",
      body: `Expect **time-pressured** forks where **assessment completeness** competes with **rapid treatment**—the correct pathway honors **miss-not** diagnoses while respecting scope. Boards punish options that **delay oxygen, fluids, antibiotics, or activation** when criteria are met, and punish answers that **expand prescriptive authority** beyond the stem.

${b.pearl}

**Cross-cutting NP trap:** mixing **US acute-care** urgency logic with **stable clinic** follow-up language—read the **setting** line literally.`,
    },
    {
      id: "core_concept",
      heading: "Core concept",
      kind: "core_concept",
      body: `- **Data triage:** vitals, relevant exam, focused labs/imaging—avoid shotgun testing that delays stabilization when the vignette implies urgency.
- **Therapy alignment:** match **class effects** to phenotype; mind AKI/electrolyte constraints; plan **reassessment** after interventions.
- **Consult & disposition:** know classic **ED/hospital** triggers; **same-day specialty** triggers; and **outpatient safety-net** when low risk is justified.
- **Education:** teach **red flags**, **med side effects to monitor**, and **when to seek emergency care**—after stability.
- **Transitions:** medication reconciliation at discharge and **follow-up interval** tied to objective risk.

**NP synthesis:** justify **why** your chosen action matches **severity** + **comorbidity** + **patient capacity** simultaneously.${NP_EXAM_DEPTH_PAD_CORE}`,
    },
    {
      id: "clinical_scenario",
      heading: "Clinical scenario",
      kind: "clinical_scenario",
      body: `**Patient vignette.** A middle-aged client **reports** abrupt worsening of symptoms consistent with **${b.disease}**—the stem embeds **vitals**, **risk factors**, and often a **time window** that determines permissible pathways.

**Fork:** choose **assessment-first** moves that secure **airway/perfusion**, **time-sensitive diagnostics**, or **definitive escalation**—not paperwork, not teaching-first, when instability is present.

**Clinical application:** articulate **what you monitor next** and **what threshold** triggers **911, ED, or cardiology/pulm**—NP items grade **closed-loop** reasoning.

**Safety overlay:** when the stem offers **multiple abnormal domains** (e.g., perfusion + mentation + labs), prioritize the pathway that **stabilizes the fastest-worsening threat** while arranging **definitive care**.

**Clinical application depth:** spell out **serial reassessment** after any intervention (vitals, focused exam, repeat labs when ordered), **criteria for stopping** a therapy trial, and **who to notify** when trajectory worsens—NP stems reward **closed-loop** plans, not one-step guesses.`,
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: `- Match **acuity** to **disposition**; do not outpatient-manage **hard** instability signals when the stem provides them.
- Pair every **medication change** with **monitoring** and **follow-up**.
- Build networks: ${links} · ${HUB}

**NP drill:** name the **single time-sensitive harm** your answer prevents—if you cannot, reconsider.${NP_EXAM_DEPTH_PAD_TAKE}`,
    },
  ];
}

export function buildDiabetesMetabolicOverlay(links: string): PathwayLessonSection[] {
  return [
    {
      id: "clinical_meaning",
      heading: "Clinical meaning",
      kind: "clinical_meaning",
      body: `**Type 2 diabetes and metabolic syndrome** in FNP practice require **cardiovascular risk framing**, not glucose alone—hypertension, dyslipidemia, obesity, NAFLD risk, and **renal preservation** often appear as bundled stems. NP items test whether you **layer lifestyle, pharmacotherapy, and monitoring** into a coherent longitudinal plan while catching **hyperglycemic crises** (HHS/DKA thresholds) when acuity appears.

Interpret labs in context: **A1c trend** versus Point-of-care glucose, **eGFR/UACR** for nephroprotection decisions, **ASCVD history** for glucocentric class selection (**SGLT2/GLP-1** benefits beyond glycemia when indicated), and **hypoglycemia risk** when tightening therapy in elders or those with erratic meals.

**Cross-links:** connect insulin initiation/education, CGM/SMBG themes when available, and primary prevention teaching (${links}; ${HUB}).`,
    },
    {
      id: "exam_relevance",
      heading: "Exam relevance",
      kind: "exam_relevance",
      body: `Metabolic items punish **insulin without education/monitoring** when complexity demands structure; **SGLT2** choices without **volume/UTI** counseling when appropriate; and **tight fasting goals** in frail elders without **hypoglycemia** consideration. Reward **stepwise intensification**, **renal-aware** choices, and **pregnancy** red flags that change class safety.

**Sick-day rules** and **perioperative** planning appear as hidden modifiers—recognize when glucocorticoids, infections, or fasting shift insulin needs.`,
    },
    {
      id: "core_concept",
      heading: "Core concept",
      kind: "core_concept",
      body: `- **Diagnosis & targets:** personalize A1c/blood pressure/lipid targets by age, comorbidity, hypoglycemia risk, and ASCVD features.
- **Lifestyle:** nutrition patterns that are **sustainable**; physical activity counseling within constraints.
- **Pharmacology map:** metformin first-line themes when tolerated; **SGLT2/GLP-1** when cardiorenal benefit aligns; insulin when catabolic/hyperglycemic emergency risk or oral failures per context.
- **Complications:** neuropathy foot care, retinopathy surveillance, nephropathy monitoring.
- **Acute flags:** DKA/HHS suspicion with obtundation, polyuria, profound hyperglycemia—choose **ED** when instability is implied.${NP_EXAM_DEPTH_PAD_CORE}`,
    },
    {
      id: "clinical_scenario",
      heading: "Clinical scenario",
      kind: "clinical_scenario",
      body: `**Patient vignette.** A 59-year-old with **T2D** **reports** polyuria, **10% body weight loss**, and **ketones** on home testing—vitals show **tachycardia** and **hypotension**.

**Fork:** prioritize **volume resuscitation**, **insulin therapy** pathways per acute presentation, **electrolyte monitoring** (especially **K⁺** with insulin), and **ED referral** when shock physiology exists—do not titrate **only** oral agents when ketotic emergency features predominate.

**Assessment:** screen **infection** as precipitant; review **new SGLT2** use with euglycemic DKA risk contexts when the stem whispers it.

**Escalation:** if mentation, perfusion, or **anion-gap** dynamics imply **critical illness**, favor **higher-acuity disposition** over clinic optimization.

**Clinical application depth:** when intensifying glucose-lowering therapy, pair changes with **hypoglycemia education**, **sick-day rules**, and **follow-up labs**—boards punish silent titration without monitoring.`,
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: `- **Glycemia is a marker**, not the only outcome—treat **cardiorenal** risk holistically.
- **Hypoglycemia** can be lethal—align targets to the person.
- **Ketoacidosis** is not only Type 1—watch atypical triggers.

**Related:** ${links} · ${HUB}${NP_EXAM_DEPTH_PAD_TAKE}`,
    },
  ];
}

export function buildAdolescentMentalHealthSections(links: string): PathwayLessonSection[] {
  return [
    {
      id: "clinical_meaning",
      heading: "Clinical meaning",
      kind: "clinical_meaning",
      body: `**Adolescent mental health** in primary care blends **evidence-based screening**, **developmentally appropriate communication**, **confidentiality rules** that still protect **imminent safety**, and **care coordination** with schools, parents/guardians, and behavioral health. FNP certification expects you to **risk-stratify** mood symptoms, **screen** where guidelines support it, and **act** when suicidality or self-harm is suspected—not only document.

Validated tools (e.g., PHQ-A/PHQ-9 variants where appropriate) help **quantify** severity; they **never** replace an explicit **safety inquiry** when the client expresses hopelessness, passive suicidal ideation, self-injury, or substance use escalation. Frame visits to reduce shame, normalize help-seeking, and build **shared decision-making** with safety as the non-negotiable backbone.

**Context cues:** bullying, identity stressors, sleep disruption, ADHD/learning burden, and trauma histories change follow-up intensity; know when **same-week** behavioral health access or **crisis resources** belong in the plan.

**Cross-links:** ${links}; primary care integration via ${HUB}.${NP_EXAM_DEPTH_PAD_CORE}`,
    },
    {
      id: "exam_relevance",
      heading: "Exam relevance",
      kind: "exam_relevance",
      body: `Items pit **confidentiality** against **parental involvement** against **imminent harm**—choose pathways that protect life while respecting adolescent rights **as the jurisdiction and stem allow**. Expect traps where “more privacy” delays **safety activation**, or where “tell parents first” ignores **acute risk**.

**Medication management** items may test SSRI initiation themes, **black box** counseling for young adults with monitoring cadence, and **buprenorphine/integrated care** is generally outside generic PCP stems—stay humble to the **licensure frame** of the item.

**Synthesis:** prioritize **safety**, **follow-up interval**, and **documentation** that another clinician can continue.`,
    },
    {
      id: "core_concept",
      heading: "Core concept",
      kind: "core_concept",
      body: `- **Screening & triage:** structured depression/anxiety screening schedules per age-risk guidance in the stem; escalate when positive screens + red flags align.
- **Safety assessment:** ask directly about ideation, plan, intent, means, self-harm, substance use, and **protective factors**; know **crisis line** and **ED** thresholds for **active intent** or **psychosis/mania**.
- **Care coordination:** therapy referrals, school accommodations when relevant, and **family engagement** when safety allows—and when law/policy permits.
- **Medicolegal prudence:** document objective mental status, decisions, and communications—without turning notes into stigma.

**NP scope:** know when **psychiatry** co-management is standard for moderate/severe disease or diagnostic uncertainty.

**Safety lexicon:** use **risk stratification** language—**passive ideation** without plan still requires **structured follow-up** and **means reduction** counseling when feasible; **active plan/intent** shifts disposition toward **immediate safety** pathways.${NP_EXAM_DEPTH_PAD_CORE}`,
    },
    {
      id: "clinical_scenario",
      heading: "Clinical scenario",
      kind: "clinical_scenario",
      body: `**Patient vignette.** A 16-year-old **reports** worsening sadness, **school avoidance**, and **passive thoughts** that “life would be easier if I disappeared”—they **deny plan** but admit **cutting** superficially to “feel something else.”

**Fork:** complete a **focused safety assessment**, involve **crisis resources** or **ED** per acuity if intent or lethality rises, **remove means** when feasible, arrange **close follow-up**, and **coordinate** with trusted adults only in ways consistent with **minor consent/safety statutes** described or implied in the stem.

**Clinical application:** choose **therapy + monitoring** intensity that matches risk—**not** reassurance alone when non-suicidal self-injury and hopelessness cluster.

**Clinical application depth:** document **safety plan elements** (means reduction, crisis numbers, trusted adult involvement when appropriate), **interval for reassessment**, and **specific return precautions** if ideation escalates, sleep collapses, or substance use surges.`,
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: `- **Screen → stratify → plan safety**; ideation without plan still needs **structured follow-up**.
- **Tools supplement, never replace**, a compassionate direct inquiry.
- **Document like handoff matters**—because it does.

**Related:** ${links} · ${HUB}${NP_EXAM_DEPTH_PAD_TAKE}`,
    },
  ];
}

export function buildGeriatricFallsSections(links: string): PathwayLessonSection[] {
  return [
    {
      id: "clinical_meaning",
      heading: "Clinical meaning",
      kind: "clinical_meaning",
      body: `**Falls and syncope** in older adults are **sentinel events** for **cardiac**, **orthostatic**, **neurologic**, **visual**, **medication-related**, and **environmental** contributors—FNP certification rewards **multicomponent** assessment rather than a single “orthostatics only” reflex. Your job is to **risk-stratify** fracture and intracranial bleed risk after a fall, evaluate for **dysrhythmia** or **structural heart disease** when syncope is unexplained, and address **polypharmacy** (sedatives, anticholinergics, hypoglycemics).

Integrate guideline-inspired thinking: **orthostatic vitals**, **medication reconciliation**, **vision/footwear/home hazards**, **vitamin D/calcium** themes where applicable, and **conditional referral** to **PT/cardiology/neurology** based on cues. Tie geriatric reasoning to adjacent FNP topics (${links}; ${HUB}).

**Safety:** atrial fibrillation with rapid ventricular rates, aortic stenosis exertional syncope, and **GI bleed** from occult anticoagulation remain **cannot-miss** patterns hidden inside “weakness” or “dizziness.”${NP_EXAM_DEPTH_PAD_CORE}`,
    },
    {
      id: "exam_relevance",
      heading: "Exam relevance",
      kind: "exam_relevance",
      body: `Items test **prioritization**: **head imaging** when red neuro signs exist, **orthostatics** when volume or autonomic failure is plausible, **ECG/monitoring** when arrhythmia is suspected, **hold/improve** high fall-risk meds when the vignette allows—versus low-yield **routine CT** without deficits when the stem points elsewhere.

**Traps:** blaming **normal sodium** when the client is still orthostatic; **walking** an unstable patient before **perfusion** is clear; **education-first** when the data demand **escalation**.`,
    },
    {
      id: "core_concept",
      heading: "Core concept",
      kind: "core_concept",
      body: `- **Triage after trauma:** neuro checks, anticoagulation status, focal deficits, **head strike** risk—match **disposition** to guideline-based clues in the stem.
- **Orthostatic measurement technique:** lying → standing timing matters; interpret with **hydration**, **autonomic**, and **med** context.
- **Cardiac syncope:** exertional symptoms, **structural murmur**, **family history** of sudden death—early cardiology referral themes.
- **Multifactorial prevention:** strength/balance training, vitamin D when deficient, **home safety**, **vision correction**, **footwear**.

**NP role:** orchestrate **multidisciplinary** plans the patient can sustain.${NP_EXAM_DEPTH_PAD_CORE}`,
    },
    {
      id: "clinical_scenario",
      heading: "Clinical scenario",
      kind: "clinical_scenario",
      body: `**Patient vignette.** A 78-year-old **reports** **exertional syncope** with **clean neuro exam**—they are on **tamsulosin**, **amlodipine**, and **metoprolol**, BP **98/64**, new **systolic murmur** radiating to carotids, **brisk carotid upstrokes** implied by the stem.

**Fork:** favor **urgent cardiology/ED evaluation** over **“increase fluid intake” alone** when **hemodynamic** or **valvular** concern exists—syncope with **flow murmur** and **hypotension** is not a benign aging story pending routine follow-up.

**Assessment:** document orthostatics **off** sedating agents when safe, check **ECG**, and pursue **risk scoring** appropriate to presentation.

**Clinical application depth:** after any medication change that could affect **BP**, **orthostasis**, or **mentation**, specify **follow-up timing**, **symptom thresholds** for urgent return, and **fall precautions** for the days when instability risk is highest.`,
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: `- **One fall** deserves systems thinking—assume contributors stack until proven otherwise.
- **Syncope with exertion or structural murmur** escalates cardiology pathways.
- **Polypharmacy** lowering BP/alertness is a fixable hazard.

**Related:** ${links} · ${HUB}${NP_EXAM_DEPTH_PAD_TAKE}`,
    },
  ];
}

export function buildNpBatch1CatalogSections(meta: LessonMeta): PathwayLessonSection[] | null {
  const links = lessonLinks(meta.slug);
  switch (meta.slug) {
    case "fnp-overlay-heart-failure":
      return hfOverlay();
    case "fnp-overlay-myocardial-infarction":
    case "fnp-overlay-shock":
    case "fnp-overlay-abg-acid-base":
    case "fnp-overlay-electrolytes-volume":
    case "fnp-overlay-respiratory-acute":
    case "fnp-overlay-sepsis-infection":
    case "fnp-overlay-np-differential-prescribing-chronic":
      return buildSimpleOverlaySections(meta.slug, links);
    case "fnp-overlay-diabetes-metabolic":
      return buildDiabetesMetabolicOverlay(links);
    case "fnp-adolescent-mental-health-screening":
      return buildAdolescentMentalHealthSections(links);
    case "fnp-geriatric-falls-syncope":
      return buildGeriatricFallsSections(links);
    default:
      if (meta.slug.startsWith("bp26-usnp-")) return buildPadIntegratedReviewSections(meta);
      return null;
  }
}
