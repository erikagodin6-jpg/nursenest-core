/**
 * Gold-standard COPD pathway lesson: shared clinical scaffold + five scoped variants
 * (US PN, CA RPN, US RN, CA RN, US FNP). Injected beside catalog JSON — see
 * {@link getCatalogLessonsRaw} in pathway-lesson-loader.
 */
import type {
  PathwayLessonOmittedPremiumSection,
  PathwayLessonQuizItem,
  PathwayLessonRelatedRef,
  PathwayLessonSection,
} from "@/lib/lessons/pathway-lesson-types";
import {
  PATHWAY_EXAM_LABEL,
  pathwayIdToTierGeo,
  synthesizeGoldPremiumSections,
} from "@/lib/lessons/scoped-lessons/gold-premium-synthesis";

/** Stable slug — use in URLs and DB seeding; do not rename without redirects. */
export const COPD_GOLD_STANDARD_SLUG = "copd-clinical-judgment-gold" as const;

type CopdVariant = "us_pn_nclex_pn" | "ca_rpn_rex_pn" | "us_rn_nclex_rn" | "ca_rn_nclex_rn" | "us_np_fnp";

const PATHWAY_VARIANT: Record<string, CopdVariant> = {
  "us-lpn-nclex-pn": "us_pn_nclex_pn",
  "ca-rpn-rex-pn": "ca_rpn_rex_pn",
  "us-rn-nclex-rn": "us_rn_nclex_rn",
  "ca-rn-nclex-rn": "ca_rn_nclex_rn",
  "us-np-fnp": "us_np_fnp",
};

/** Reusable pathophysiology / monitoring scaffold (variant-specific framing wraps this). */
const SHARED_CORE_BODY = `**Pathophysiology**  
COPD combines **small-airway narrowing**, **air trapping**, and often **mucus-heavy cough** (chronic bronchitis pattern) with **alveolar loss / loss of elastic recoil** (emphysema pattern)—many clients show features of both. Fixed obstruction means the work of breathing rises early with activity; **exacerbations** are sustained worsening beyond usual variation, frequently triggered by infection or irritants.

**What you watch at the bedside**  
Tie **respiratory rate**, **accessory muscle use**, **mental status**, **SpO₂** (and device delivery), **sputum**, and **baseline function** (home oxygen, inhalers, recent steroids/antibiotics) into one story. Rising CO₂ with lethargy suggests **acute ventilatory failure**—a time-sensitive escalation pattern.

**Therapy you will see tested**  
Ordered **bronchodilators**, **corticosteroids**, **antibiotics when infection is suspected**, **oxygen titrated to prescribed targets**, **early mobility when safe**, and **patient teaching** (inhaler technique, pursed-lip breathing, energy conservation, smoking cessation, immunizations, and a clear **when to seek urgent care** plan).`;

const COPD_LABS_DIAGNOSTICS = `**Pulse oximetry and CO₂ retention**  
COPD exacerbations are tracked with **SpO₂** in context of **baseline** and **prescribed oxygen targets**—some clients are managed with **permissive hypercapnia** when the stem references a plan. Nursing items test **delivery device fit**, **reassessment after changes**, and **reporting** acute desaturation or **somnolence** suggesting **CO₂ narcosis**.

**ABG when ordered**  
**Arterial blood gases** may appear when the vignette evaluates **acute ventilatory failure** or **pH changes**. Your role is **specimen handling**, **timely transport to lab** when applicable, **continuous monitoring**, and **communicating** worsening work of breathing or mentation—not independent ventilator changes unless the item defines extended competency.

**Supporting tests**  
**Chest imaging** or **CBC** may accompany infection-driven exacerbations. Tie results to **antibiotic stewardship**, **oxygen therapy**, **bronchodilator response**, and **early mobilization when safe** as described in the stem.`;

function t(
  variant: CopdVariant,
  blocks: {
    clinical_meaning: string;
    exam_relevance: string;
    clinical_scenario: string;
    takeaways: string;
    title: string;
    seoTitle: string;
    seoDescription: string;
  },
  quizzes: { preTest: PathwayLessonQuizItem[]; postTest: PathwayLessonQuizItem[] },
) {
  return { variant, ...blocks, quizzes };
}

const VARIANTS: Record<CopdVariant, ReturnType<typeof t>> = {
  us_pn_nclex_pn: t(
    "us_pn_nclex_pn",
    {
      title: "COPD: clinical judgment (NCLEX-PN, US)",
      seoTitle: "COPD clinical judgment | NCLEX-PN US | NurseNest",
      seoDescription:
        "US practical/vocational nursing scope: COPD assessment, safe delegation, ordered oxygen and bronchodilators, and escalation—without mixing RN-only judgment calls.",
      clinical_meaning: `**NCLEX-PN (LPN/LVN)** items reward **safe, role-appropriate care**: observe and report changes, carry out **orders**, reinforce teaching, protect oxygen delivery **as prescribed**, and escalate promptly when findings exceed stable COPD.

**Scope line**  
PN/LVN practice **varies by state and facility policy**. On the exam, prefer actions that **stay within the order set / RN direction** when the stem is testing delegation—avoid independent titration, new prescriptions, or diagnosing beyond nursing data collection.`,
      exam_relevance: `Expect **prioritization** (who needs attention first), **oxygen safety tied to orders**, **infection/exacerbation cues**, and **patient teaching** you can reinforce. Traps include **doing RN-level triage** as an LPN action, **withholding urgent reporting**, or **routine tasks** ahead of **acute respiratory change**.`,
      clinical_scenario: `**Vignette — medical–surgical floor (US)**  
Your client has COPD with a **2 L/min nasal cannula** order. You notice **RR 32**, **tripod positioning**, and **SpO₂ 84%** on the same flow. The client is anxious but alert.

**PN-appropriate fork**  
Your first moves are **within-order assessment and escalation**: reassess delivery/equipment, coach **pursed-lip breathing**, stay with the client, and **notify the RN or provider immediately** for reassessment and possible order changes. The error pattern is **silently up-titrating oxygen** or **giving sedatives** to “calm” undifferentiated respiratory distress.`,
      takeaways: `• **Report** acute respiratory changes; do not “watch and wait” through critical desaturation.  
• **Oxygen** changes for COPD usually require an **order/protocol**—your job is safe delivery and timely escalation.  
• **Reinforce** ordered teaching (inhalers, pursed-lip breathing, energy conservation, cessation).  
• Pair this lesson with **question-bank** items filtered to **respiratory / COPD** for your pathway.`,
    },
    {
      preTest: [
        {
          question:
            "A PN is caring for a client with COPD on 2 L/min nasal cannula per order. The client’s SpO₂ drops from 92% to 84% and respiratory rate increases. What should the PN do first?",
          options: [
            "Increase oxygen to 6 L/min without contacting anyone.",
            "Assess the client and oxygen delivery, then notify the RN or provider about the acute change.",
            "Tell the client to sleep flat to rest the diaphragm.",
            "Administer a PRN sedative to reduce anxiety.",
          ],
          correct: 1,
          rationale:
            "Assess delivery and the client, then escalate for reassessment/order changes. Independently raising oxygen or sedating can be unsafe and is often outside PN scope; flat positioning can worsen dyspnea.",
        },
        {
          question: "Which statement best describes pursed-lip breathing for COPD?",
          options: [
            "It primarily increases respiratory rate to blow off CO₂.",
            "It creates mild back-pressure to prolong exhalation and reduce air trapping.",
            "It replaces bronchodilator therapy when the client is stable.",
            "It is used only during sleep, not with activity.",
          ],
          correct: 1,
          rationale:
            "Pursed-lip breathing prolongs expiration and can reduce dynamic airway collapse; it does not replace meds or replace oxygen when prescribed.",
        },
        {
          question:
            "During a COPD exacerbation, which finding should the PN report immediately?",
          options: [
            "A request for extra pillows for comfort.",
            "New confusion or increasing somnolence with worsening work of breathing.",
            "A stable SpO₂ at the client’s usual home baseline on prescribed oxygen.",
            "A dry mouth from the cannula.",
          ],
          correct: 1,
          rationale:
            "Altered mental status with respiratory deterioration suggests possible hypercapnic failure or critical illness—report immediately.",
        },
      ],
      postTest: [
        {
          question:
            "Which PN action best supports infection prevention teaching during COPD care?",
          options: [
            "Encourage annual influenza vaccination when included in the plan of care and teach hand hygiene.",
            "Tell the client to stop all physical activity indefinitely.",
            "Recommend stopping all inhalers during a cold.",
            "Advise doubling home oxygen flow whenever they feel tired.",
          ],
          correct: 0,
          rationale:
            "Immunizations and hygiene reduce triggers; activity should be paced, not abolished; inhalers and oxygen changes require provider direction.",
        },
        {
          question:
            "A client with COPD says, “I can smoke just a little; it won’t matter now.” What is the best response?",
          options: [
            "You are right—cutting down is enough.",
            "Even small exposures keep inflammation going; cessation still reduces exacerbations—let’s connect you with supports in the plan.",
            "Only vape; it is safer than cigarettes.",
            "Switch to cigars because they are filtered.",
          ],
          correct: 1,
          rationale:
            "Tobacco smoke worsens COPD progression and exacerbation risk; motivational, factual teaching aligns with nursing scope.",
        },
        {
          question:
            "Which task is most appropriate for the PN when the RN delegates stable COPD teaching reinforcement?",
          options: [
            "Independently ordering a STAT CT to rule out PE.",
            "Observing inhaler technique and reporting incorrect use for RN/provider follow-up.",
            "Prescribing antibiotic changes for purulent sputum.",
            "Discharging the client without RN collaboration.",
          ],
          correct: 1,
          rationale:
            "Reinforcing skills and reporting gaps fits PN scope; prescribing, independent diagnostic ordering, and discharge decisions are not PN-level on NCLEX-PN.",
        },
      ],
    },
  ),

  ca_rpn_rex_pn: t(
    "ca_rpn_rex_pn",
    {
      title: "COPD: clinical judgment (REx-PN, Canada)",
      seoTitle: "COPD clinical judgment | REx-PN Canada | NurseNest",
      seoDescription:
        "Canadian practical nursing: COPD assessment in metric context, college scope, safe delegation, and escalation aligned to REx-PN-style judgment.",
      clinical_meaning: `**REx-PN / Canadian practical nursing**  
Items expect **college-defined scope**, **metric vitals and SI labs when shown**, and clean escalation when findings exceed what a practical nurse may initiate independently.

**Clinical meaning**  
You connect **work of breathing**, **oxygen therapy as ordered**, **infection/exacerbation cues**, and **client education**—while keeping **independent prescribing or unsupervised titration** out of scope unless the stem explicitly includes a standing order/protocol you are allowed to follow.`,
      exam_relevance: `Look for **prioritization**, **therapeutic communication**, **safe administration**, and **when to notify the RN/NP/physician**. Common traps blur **RPN** actions with **RN** primary assessment decisions or imply **silent oxygen changes** without an order.`,
      clinical_scenario: `**Vignette — acute care unit (Canada)**  
An RPN’s client has COPD with **ordered low-flow oxygen**. Over an hour, **RR rises**, **SpO₂ falls** on the same delivery, and the client uses **tripod posture**.

**RPN fork**  
Reassess equipment and client status, apply **comfort positioning**, coach **pursed-lip breathing**, and **notify the RN** for reassessment and possible order changes. Avoid **independent oxygen titration** unless a clear protocol authorizes it.`,
      takeaways: `• **Metric** data and **Canadian care settings** may appear—same judgment pattern: assess → escalate when unstable.  
• **College standards** govern what you may initiate; when unsure, choose **collaboration** over **solo prescription-level changes**.  
• Reinforce **smoking cessation**, **immunization**, and **exacerbation action plans** as teaching within your role.  
• Drill **REx-PN** respiratory items after this block.`,
    },
    {
      preTest: [
        {
          question:
            "An RPN notes a COPD client’s SpO₂ is 86% on ordered oxygen, with increased work of breathing. What is the best initial action?",
          options: [
            "Increase oxygen flow independently to maximize saturation.",
            "Reassess delivery and client status, notify the RN, and follow orders/protocols.",
            "Tell the client to walk the hall to clear secretions.",
            "Document only and reassess in two hours.",
          ],
          correct: 1,
          rationale:
            "Reassess and escalate; unsupervised titration may be inappropriate without order/protocol. Walking may worsen distress; delayed reporting is unsafe.",
        },
        {
          question: "Which finding most urgently warrants immediate reporting in COPD exacerbation?",
          options: [
            "Mild dry cough without vital sign change.",
            "Increasing confusion with CO₂ retention pattern and worsening somnolence.",
            "Request for a second blanket.",
            "Stable appetite with usual oxygen.",
          ],
          correct: 1,
          rationale:
            "Altered LOC with ventilatory failure pattern is an emergency escalation trigger.",
        },
        {
          question:
            "Teaching energy conservation for COPD should emphasize which principle?",
          options: [
            "Cluster activities with planned rest periods.",
            "Complete all care rapidly without breaks.",
            "Avoid all physical activity permanently.",
            "Eliminate bronchodilator use to reduce medication burden.",
          ],
          correct: 0,
          rationale:
            "Pacing reduces dyspnea; abrupt elimination of prescribed meds is unsafe.",
        },
      ],
      postTest: [
        {
          question:
            "Which statement reflects correct practical-nurse scope language in Canada for oxygen changes?",
          options: [
            "I titrate oxygen to my personal target without documenting.",
            "I follow authorized orders/protocols and collaborate when the client destabilizes.",
            "I prescribe antibiotics when sputum changes colour.",
            "I discharge clients when they feel better.",
          ],
          correct: 1,
          rationale:
            "Collaboration and authorized protocols preserve scope; prescribing and discharge are not RPN-independent actions in this framing.",
        },
        {
          question: "Why is pursed-lip breathing useful in COPD?",
          options: [
            "It speeds exhalation to raise CO₂.",
            "It can prolong expiration and reduce dynamic airway collapse.",
            "It replaces oxygen therapy.",
            "It is only for clients with asthma, not COPD.",
          ],
          correct: 1,
          rationale:
            "It addresses air trapping mechanics; it complements—not replaces—ordered therapies.",
        },
        {
          question:
            "A COPD client develops fever, purulent sputum, and increased dyspnea. What should the RPN expect as part of collaborative care?",
          options: [
            "Ignore vitals because COPD clients are always febrile.",
            "Monitor vitals and respiratory status closely and report findings promptly.",
            "Stop all fluids to reduce secretions.",
            "Turn off oxygen to encourage deeper breaths.",
          ],
          correct: 1,
          rationale:
            "Exacerbation may need provider evaluation and treatment changes; monitoring and reporting are core RPN contributions.",
        },
      ],
    },
  ),

  us_rn_nclex_rn: t(
    "us_rn_nclex_rn",
    {
      title: "COPD: clinical judgment (NCLEX-RN, US)",
      seoTitle: "COPD clinical judgment | NCLEX-RN US | NurseNest",
      seoDescription:
        "US RN-level COPD care: oxygen titration targets, exacerbation management, safety with CO₂ retention, prioritization, and patient education.",
      clinical_meaning: `**NCLEX-RN** tests **clinical judgment**: who needs you first, which assessment clarifies risk, and which intervention matches **pathophysiology** and **orders**.

For COPD, expect **oxygenation targets** (often **titrate to prescribed SpO₂ range**, commonly **~88–92%** when that is the plan—not memorized in isolation from the stem), **bronchodilator/steroid/antibiotic timing**, **early mobility when stable**, and **ventilatory failure** cues (somnolence, rising CO₂) that require rapid escalation.`,
      exam_relevance: `High-yield patterns: **prioritization** among multiple clients, **safe oxygen administration**, **infection vs heart failure overlap**, **teaching that demonstrates understanding**, and **avoiding sedation** that masks respiratory failure.`,
      clinical_scenario: `**Vignette — ED holding**  
A 68-year-old with COPD presents with **increased cough**, **purulent sputum**, **T 38.3 °C**, **RR 30**, **SpO₂ 86% on RA**. They are alert but fatigued.

**RN fork**  
Your sequence aligns with orders/protocols: **oxygen to prescribed target**, **establish IV access if ordered**, **labs/ABG as ordered**, **bronchodilator therapy**, **positioning**, and **tight monitoring** for CO₂ narcosis if oxygen needs rise. The trap is **routine paperwork** or **routine meds** before **oxygenation and escalation readiness**.`,
      takeaways: `• Pair **SpO₂** with **work of breathing and mental status**—not a single number in a vacuum.  
• **Exacerbation** care bundles: O₂ per plan, meds, monitoring, infection control, mobilization when safe.  
• **Teach** exacerbation warning signs and correct device use.  
• Run a **timed respiratory block** in your bank after this lesson.`,
    },
    {
      preTest: [
        {
          question:
            "Which intervention is highest priority for a COPD client in acute exacerbation with SpO₂ 86% on room air and moderate distress?",
          options: [
            "Complete discharge teaching about low-sodium diet.",
            "Apply oxygen per order/protocol and assess response, preparing for escalation if inadequate.",
            "Schedule routine wound care on another unit first.",
            "Encourage vigorous exercise to clear secretions.",
          ],
          correct: 1,
          rationale:
            "Address life-threatening hypoxemia and distress first per orders; other tasks are secondary when stability is not established.",
        },
        {
          question:
            "Which assessment finding best suggests acute ventilatory failure in a COPD client receiving oxygen?",
          options: [
            "Requests a favorite meal.",
            "Increasing somnolence, headache, and worsening acidosis/CO₂ retention pattern on ABG.",
            "Stable SpO₂ at prescribed target with easy speech.",
            "Mild anxiety without vital sign changes.",
          ],
          correct: 1,
          rationale:
            "Rising CO₂ with altered mental status is a red flag for respiratory failure and needs urgent intervention.",
        },
        {
          question: "Teaching for home COPD management should include which element?",
          options: [
            "Stopping inhalers once symptoms improve.",
            "Written exacerbation plan: when to call clinic vs 911.",
            "Avoiding all vaccines as they cause COPD flares.",
            "Using sedatives nightly for sleep without assessment.",
          ],
          correct: 1,
          rationale:
            "Action plans and appropriate immunizations reduce harm; PRN sedatives without respiratory assessment are risky.",
        },
      ],
      postTest: [
        {
          question:
            "Why might high-flow oxygen be risky in some COPD clients without careful monitoring?",
          options: [
            "It always cures hypercapnia.",
            "It can worsen CO₂ retention and sedation in susceptible clients—monitor mental status and ABGs per orders.",
            "It is never used in COPD.",
            "It only affects heart rate, not ventilation.",
          ],
          correct: 1,
          rationale:
            "Oxygen drives vary; monitor for CO₂ narcosis and follow titration protocols.",
        },
        {
          question:
            "Which client statement shows understanding of pursed-lip breathing?",
          options: [
            "I blow out fast to get rid of CO₂ quickly.",
            "I breathe in through my nose and out slowly through pursed lips to control exhale.",
            "I hold my breath as long as possible every minute.",
            "I use it instead of my bronchodilator.",
          ],
          correct: 1,
          rationale:
            "Slow controlled exhalation is the teaching point; bronchodilators remain prescribed therapy.",
        },
        {
          question:
            "During shift report, which COPD client should the RN assess first?",
          options: [
            "Client watching TV with stable vitals on 2 L/min.",
            "Client with new confusion, RR 32, and dropping SpO₂ despite oxygen.",
            "Client requesting a pillow adjustment with stable SpO₂.",
            "Client asking for ice chips with normal mentation.",
          ],
          correct: 1,
          rationale:
            "Acute change in oxygenation and mentation outranks comfort requests.",
        },
      ],
    },
  ),

  ca_rn_nclex_rn: t(
    "ca_rn_nclex_rn",
    {
      title: "COPD: clinical judgment (NCLEX-RN, Canada)",
      seoTitle: "COPD clinical judgment | NCLEX-RN Canada | NurseNest",
      seoDescription:
        "Canadian RN context: COPD exacerbation care with SI/metric framing, provincial scope language, oxygen targets, and NCLEX-style prioritization.",
      clinical_meaning: `**Canadian NCLEX-RN** mirrors US judgment with **Canadian acute-care context**: **metric vitals**, **SI labs** when shown (e.g. mmol/L glucose), and **employer/provincial standards** for delegation.

COPD items still hinge on **oxygenation strategy per order**, **exacerbation recognition**, **ventilatory failure cues**, and **teaching** that fits the client’s literacy and home supports.`,
      exam_relevance: `Expect the same **prioritization spine** as US RN items, with occasional **Canadian terminology** (e.g. **healthcare provider**, **unit dosing in metric**). Traps pair **routine tasks** with **unstable airways**.`,
      clinical_scenario: `**Vignette — medical ward (Canada)**  
A client with known COPD has **increasing dyspnea**, **purulent sputum**, **38.1 °C**, **RR 28**, **SpO₂ 88%** on **2 L/min** as ordered.

**RN fork**  
Follow protocol/order set: reassess **oxygen delivery and response**, notify **NP/physician** for likely therapy escalation, obtain **ordered diagnostics**, administer **ordered bronchodilators/steroids/antibiotics**, and monitor for **CO₂ retention** if oxygen needs increase. Avoid teaching **discharge** before **stability**.`,
      takeaways: `• Read **Canadian units** carefully; convert reasoning, not memorized US-only lab cutoffs, when the stem gives SI values.  
• **Stability first**: airway, breathing, circulation, then comfort and teaching.  
• Link **infection management** with **oxygenation and monitoring**.  
• Pair with **Canada RN** respiratory drills in your question bank.`,
    },
    {
      preTest: [
        {
          question:
            "A Canadian RN cares for a COPD client with worsening dyspnea and SpO₂ 88% on current oxygen. What is the best priority?",
          options: [
            "Finish charting a previous shift’s medication error.",
            "Assess respiratory status and oxygen therapy, then collaborate for order changes per protocol.",
            "Begin discharge planning for tomorrow.",
            "Encourage high-intensity interval training in the hallway.",
          ],
          correct: 1,
          rationale:
            "Stabilize and escalate per orders; charting and discharge come after immediate risk is addressed.",
        },
        {
          question: "Which finding should prompt urgent reassessment in COPD exacerbation?",
          options: [
            "Stable mentation with improved SpO₂ after ordered therapy.",
            "New confusion and increasing somnolence with rising work of breathing.",
            "Patient reading a book with 2 L/min NC.",
            "Mild dry cough without vital sign change.",
          ],
          correct: 1,
          rationale:
            "Altered mental status with respiratory deterioration suggests possible hypercapnic failure.",
        },
        {
          question:
            "Teaching a Canadian client about COPD self-management should emphasize:",
          options: [
            "Stopping steroids early whenever they feel better.",
            "Recognizing exacerbation triggers and when to seek urgent care.",
            "Avoiding all activity permanently.",
            "Using someone else’s inhaler if theirs runs out.",
          ],
          correct: 1,
          rationale:
            "Action plans and adherence matter; borrowed meds are unsafe; activity should be paced.",
        },
      ],
      postTest: [
        {
          question:
            "Which statement about oxygen in COPD is most accurate for exam-style reasoning?",
          options: [
            "Always target 100% SpO₂ in every client.",
            "Titrate to prescribed targets; monitor for CO₂ retention in susceptible clients.",
            "Oxygen is contraindicated in all COPD clients.",
            "Nasal cannula never requires humidity or skin checks.",
          ],
          correct: 1,
          rationale:
            "Individualized targets and monitoring reflect safe practice; absolutes are usually wrong.",
        },
        {
          question:
            "A client says, “I stopped my inhaler because I felt fine.” What is the best response?",
          options: [
            "Good—medications are only for sick days.",
            "COPD meds often control inflammation and bronchospasm even when you feel okay; stopping can trigger flares—let’s review your regimen.",
            "Switch to herbal steam only.",
            "Double the dose next week without talking to your clinician.",
          ],
          correct: 1,
          rationale:
            "Maintenance therapy reduces exacerbations; teach adherence without prescribing changes.",
        },
        {
          question:
            "Which task can the RN delegate to competent assistive personnel during stable COPD care?",
          options: [
            "Interpreting ABGs and changing oxygen orders independently.",
            "Measuring and recording vital signs and reporting abnormalities.",
            "Teaching inhaler technique from scratch without verification.",
            "Deciding medical diagnosis for billing purposes.",
          ],
          correct: 1,
          rationale:
            "Data collection with reporting fits delegation; clinical interpretation and order changes do not.",
        },
      ],
    },
  ),

  us_np_fnp: t(
    "us_np_fnp",
    {
      title: "COPD: primary care judgment (FNP, US)",
      seoTitle: "COPD in primary care | FNP US | NurseNest",
      seoDescription:
        "Adult primary-care FNP framing: GOLD-inspired staging concepts, exacerbation triage, differential cues vs CHF/PE, shared decision-making, and safe escalation.",
      clinical_meaning: `**FNP / adult primary care**  
You integrate **history, spirometry context when available**, **comorbidity burden**, **infection risk**, and **functional status** into a plan that matches **evidence-based COPD management** and your **collaborative agreement**.

In item-style reasoning, emphasize **risk stratification** (exacerbation history, hospitalizations), **pharmacologic step-up/step-down concepts**, **non-pharmacologic anchors** (cessation, vaccines, pulmonary rehab referral), and **when ED admission is safer than “phone tweaks.”**`,
      exam_relevance: `Look for **differentiation** (COPD exacerbation vs **acute HF** vs **PE** red flags), **appropriate diagnostics**, **antibiotic/steroid decisions aligned to guidelines**, **oxygen safety**, and **patient-centered counseling** without overstepping into unsafe independent actions outside your role.`,
      clinical_scenario: `**Vignette — outpatient follow-up after ED visit**  
A 62-year-old with COPD returns after **one steroid taper and antibiotics** for exacerbation. They still have **dyspnea walking one block**, **daily sputum**, and **two ED visits this year**.

**FNP fork**  
You address **controller therapy optimization**, **inhaler technique**, **smoking cessation**, **vaccinations**, **pulmonary rehab**, and a written **exacerbation plan**. You **red-flag** syncope, **severe resting hypoxemia**, **rapid mental status change**, or **hemoptysis** for urgent evaluation. The trap is **minimizing frequent exacerbations** as “normal” without intensifying prevention.`,
      takeaways: `• Treat **exacerbations** as outcomes to prevent: vaccines, cessation, rehab, optimized inhaler regimen, and clear rescue instructions.  
• Keep **differential diagnosis** live when dyspnea acutely worsens (PE, ACS, HF, pneumothorax).  
• **Document** shared decisions and follow-up intervals.  
• Use **NP-level** practice questions that test **management synthesis**, not single tricks.`,
    },
    {
      preTest: [
        {
          question:
            "Which history feature most strongly supports intensifying COPD maintenance therapy in primary care?",
          options: [
            "One lifetime exacerbation ten years ago.",
            "Repeated exacerbations or hospitalizations within the past year despite baseline therapy.",
            "Remote history of appendectomy.",
            "Occasional mild headache without respiratory symptoms.",
          ],
          correct: 1,
          rationale:
            "Frequent exacerbations drive guideline-informed escalation of maintenance treatment and non-pharmacologic supports.",
        },
        {
          question:
            "A COPD client develops acute pleuritic chest pain, unilateral leg swelling, and tachypnea. What is the best initial priority?",
          options: [
            "Increase home ICS dose only.",
            "Recognize possible PE/ACS and direct to emergency evaluation.",
            "Recommend doubling home oxygen indefinitely without assessment.",
            "Defer evaluation for two weeks.",
          ],
          correct: 1,
          rationale:
            "Red-flag cardiopulmonary symptoms need urgent evaluation; do not manage as routine COPD tweak.",
        },
        {
          question:
            "Which intervention has the strongest long-term mortality and morbidity benefit in smokers with COPD?",
          options: [
            "Occasional albuterol without smoking cessation.",
            "Sustained tobacco cessation with supportive counseling and pharmacotherapy when appropriate.",
            "Daily sedatives for anxiety.",
            "Avoiding all exercise permanently.",
          ],
          correct: 1,
          rationale:
            "Smoking cessation remains foundational; sedatives and inactivity are harmful patterns.",
        },
      ],
      postTest: [
        {
          question:
            "Which element belongs in a COPD exacerbation action plan for appropriate primary-care patients?",
          options: [
            "Secret doubling of antibiotic stash from a friend.",
            "Clear thresholds for starting rescue oral steroids/antibiotics when prescribed, and when to call 911.",
            "Stopping all inhalers during colds.",
            "Avoiding influenza vaccination due to myth.",
          ],
          correct: 1,
          rationale:
            "Written plans reduce harm; ad hoc borrowing and vaccine refusal increase risk.",
        },
        {
          question:
            "Why refer eligible COPD patients to pulmonary rehabilitation?",
          options: [
            "It replaces all medications.",
            "It improves dyspnea, exercise capacity, and quality of life in many patients.",
            "It is only for post-lung transplant clients.",
            "It cures emphysema.",
          ],
          correct: 1,
          rationale:
            "Pulmonary rehab is an evidence-based adjunct; it does not replace pharmacotherapy.",
        },
        {
          question:
            "Which finding on outpatient visit most warrants same-day escalation or ED referral?",
          options: [
            "Stable walk from parking lot without distress.",
            "Resting SpO₂ in the 70s% despite prescribed oxygen use and acute symptoms.",
            "Mild fatigue after a full day of work with stable vitals.",
            "Request for a work note without respiratory change.",
          ],
          correct: 1,
          rationale:
            "Severe hypoxemia at rest with acute illness is an emergency pattern.",
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
  premiumOmittedSections?: PathwayLessonOmittedPremiumSection[];
  relatedLessonRefs?: PathwayLessonRelatedRef[];
};

export function copdGoldVariantForPathway(pathwayId: string): CopdVariant | undefined {
  return PATHWAY_VARIANT[pathwayId];
}

/** Hub list row (no section bodies) — matches pathway-lesson-loader list selects. */
export function copdGoldHubListInput(pathwayId: string): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getCopdGoldStandardLessonInput(pathwayId);
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

export function getCopdGoldStandardLessonInput(pathwayId: string): LessonInputShape | null {
  const variant = PATHWAY_VARIANT[pathwayId];
  if (!variant) return null;
  const v = VARIANTS[variant];
  const geo = pathwayIdToTierGeo(pathwayId);
  if (!geo) return null;
  const syn = synthesizeGoldPremiumSections({
    sharedCore: SHARED_CORE_BODY,
    clinical_meaning: v.clinical_meaning,
    exam_relevance: v.exam_relevance,
    clinical_scenario: v.clinical_scenario,
    takeaways: v.takeaways,
    tierGeo: geo,
    examLabel: PATHWAY_EXAM_LABEL[pathwayId] ?? "your nursing licensure exam",
    labsDiagnostics: COPD_LABS_DIAGNOSTICS,
    relatedSlugs: [
      "sepsis-early-recognition-gold",
      "fluids-electrolytes-emergencies-gold",
      "clinical-judgment-prioritization-gold",
      "high-alert-medications-safety-gold",
    ],
    relatedTitlesBySlug: {
      "sepsis-early-recognition-gold": "Sepsis early recognition",
      "fluids-electrolytes-emergencies-gold": "Fluids & electrolyte emergencies",
      "clinical-judgment-prioritization-gold": "Clinical judgment & prioritization",
      "high-alert-medications-safety-gold": "High-alert medication safety",
    },
  });
  return {
    slug: COPD_GOLD_STANDARD_SLUG,
    title: v.title,
    topic: "COPD",
    topicSlug: "copd",
    bodySystem: "Respiratory",
    previewSectionCount: 1,
    seoTitle: v.seoTitle,
    seoDescription: v.seoDescription,
    sections: syn.sections,
    premiumOmittedSections: syn.premiumOmittedSections,
    relatedLessonRefs: syn.relatedLessonRefs,
    preTest: v.quizzes.preTest,
    postTest: v.quizzes.postTest,
  };
}
