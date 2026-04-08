/**
 * Launch Wave 1 bulk rows (part B) — pharm, safety, delegation, endocrine, respiratory, neuro.
 */
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";
import type { BulkRow } from "@/lib/lessons/scoped-lessons/launch-wave-1-bulk-builder";

const qt = (items: PathwayLessonQuizItem[]) => items;

export const ROWS_B: BulkRow[] = [
  {
    slug: "opioid-toxicity-naloxone-gold",
    shortTitle: "Opioid toxicity & naloxone safety",
    topic: "Opioid toxicity",
    topicSlug: "pharmacology",
    bodySystem: "Pharmacology / neuro",
    npTitleStem: "Opioid risk — monitoring & reversal themes",
    npSeoDescription:
      "NP-level opioid risk counseling, PDMP themes where tested, naloxone co-prescribing concepts, and buprenorphine initiation framing without replacing DEA workflows.",
    sharedCore: `**What opioid toxicity is (exam framing)**  
**Opioid toxicity** depresses **respiratory drive** and **mentation**, and can progress to **respiratory arrest**. Boards reward recognizing **miosis** (not universal), **somnolence**, **bradypnea**, **hypoxemia**, and **hypotension** as escalating risk—and choosing **assessment first**, **airway protection**, **naloxone when indicated per protocol**, and **monitoring for renarcotization**.

**Why it matters**  
Items test **PCA safety**, **sedation scales**, **avoiding co-administered CNS depressants** when risky, **timely escalation**, and **nonjudgmental education** about **naloxone** access where appropriate.

**Nursing spine**  
Assess **RR**, **SpO₂**, **ETCO₂** when available, **arousal**, and **circulation**; prepare **bag-mask** readiness; give **naloxone** per orders/protocol; **monitor** after reversal for **recurrent sedation**; support **SBIRT-adjacent** teaching themes when the stem includes substance use.`,
    labsDiagnostics: `**Labs**  
**ABG/VBG** may appear in severe cases; **lactate** in perfusion failure. Nursing focuses on **continuous monitoring** and **repeat assessment** after interventions—not guessing ABG interpretation beyond the stem.`,
    pn: `**NCLEX-PN**  
Emphasize **frequent vitals**, **staying with the client**, **notifying RN/provider**, and **supporting airway** per training. Avoid **independent naloxone dosing decisions** outside protocol.`,
    caRpn: `**REx-PN**  
Collaborate urgently; follow **employer policy** for emergency medications.`,
    usRn: `**NCLEX-RN**  
Expect **RRT/code** activation themes, **reversal agent sequencing**, and **patient education** on safe storage/disposal of opioids.`,
    caRn: `**Canada RN**  
Same prioritization; **metric** vitals may appear.`,
    np: `**NP**  
May test **naloxone education**, **risk screening**, and **referral** to treatment resources in primary-care frames.`,
    examRelevance: `Traps include **minimizing bradypnea**, **leaving unstable clients alone**, or **giving stimulants** instead of airway-focused care.`,
    scenario: `**Vignette**  
Post-op client on **PCA** with **RR 8**, **SpO₂ 88%**, **difficult to arouse**.

**Fork**  
**Airway and breathing first**—stimulate, **call for help**, **prepare reversal per protocol**, continuous monitoring for **renarcotization**.`,
    takeaways: `• **Opioids + sedation** → think respiratory drive first.  
• **Naloxone** is not “optional teaching”—it’s exam-relevant when toxicity is present.  
• Pair with **high-alert medications** gold lesson.`,
    related: ["ham", "cj", "shock", "stroke"],
    preTest: qt([
      {
        question: "Which finding most strongly suggests opioid-induced respiratory depression?",
        options: [
          "RR 8/min with rising CO₂ pattern and difficult arousal.",
          "RR 18/min while walking in the hallway.",
          "Mild itch without sedation.",
          "Stable SpO₂ 98% on RA with normal mentation.",
        ],
        correct: 0,
        rationale:
          "Bradypnea with altered arousal suggests opioid toxicity until evaluated; stable activity-level vitals are reassuring.",
      },
      {
        question: "Why must clients be monitored after naloxone administration?",
        options: [
          "Renarcotization can occur as opioids outlast naloxone duration.",
          "Naloxone permanently removes all opioids from the body.",
          "Monitoring is unnecessary if the client wakes up once.",
          "Naloxone only affects blood pressure.",
        ],
        correct: 0,
        rationale:
          "Short-acting reversal can wear off while long-acting opioids remain—monitor for recurrent sedation and respiratory depression.",
      },
      {
        question: "Which action is highest priority before leaving a sedated client on opioids?",
        options: [
          "Complete non-urgent paperwork in another room.",
          "Ensure monitoring frequency matches risk—RR, SpO₂, sedation level—and escalate when thresholds are crossed.",
          "Turn off alarms to let the client sleep.",
          "Encourage family to administer extra opioids for comfort.",
        ],
        correct: 1,
        rationale:
          "Opioid safety hinges on monitoring and escalation—not unsupervised deep sedation.",
      },
    ]),
    postTest: qt([
      {
        question: "A client becomes acutely somnolent after receiving additional opioid for pain. What is the best first nursing action?",
        options: [
          "Administer another opioid to deepen sleep.",
          "Assess airway, breathing, circulation, and notify provider/activate emergency response per protocol.",
          "Ignore until the next scheduled round.",
          "Give stimulant caffeine without assessment.",
        ],
        correct: 1,
        rationale:
          "ABC assessment and escalation precede further sedation; stimulants mask respiratory failure.",
      },
      {
        question: "Which teaching point supports safe opioid use at home when prescribed?",
        options: [
          "Store medications securely; avoid alcohol and sedatives unless your clinician says otherwise; know overdose warning signs.",
          "Share unused opioids with family members if they have pain.",
          "Crush extended-release tablets for faster relief.",
          "Stop breathing exercises because opioids help automatically.",
        ],
        correct: 0,
        rationale:
          "Secure storage, avoiding additive sedatives, and warning signs reduce harm; altering ER formulations is unsafe.",
      },
      {
        question: "Why might a nurse hold the next PCA bolus dose?",
        options: [
          "Because the client asked politely.",
          "Because sedation, bradypnea, or hypotension suggests toxicity—per protocol and provider notification.",
          "Never—PCAs are always safe without assessment.",
          "To save medication costs only.",
        ],
        correct: 1,
        rationale:
          "Assessment-driven holds protect clients from respiratory depression—follow orders and policy.",
      },
    ]),
  },
  {
    slug: "falls-injury-prevention-gold",
    shortTitle: "Falls & injury prevention",
    topic: "Falls prevention",
    topicSlug: "safety",
    bodySystem: "Safety / mobility",
    npTitleStem: "Fall risk — screening & safety planning",
    npSeoDescription:
      "NP-level gait and balance screening themes, medication review for fall risk, vitamin D/calcium counseling when appropriate, and home safety referrals.",
    sharedCore: `**Why falls dominate safety items**  
**Falls** cause **injury**, **loss of independence**, **fear of falling**, and sometimes **fatal complications** (intracranial bleeding on anticoagulation). Exams reward **risk identification**, **environmental modifications**, **mobility aids**, **orthostatic assessment when relevant**, and **education**—not vague reassurance.

**Nursing spine**  
Use **fall risk tools** when ordered, **non-slip footwear**, **clear pathways**, **bed alarms** as adjuncts (not substitutes for rounding), **toileting schedules**, **adequate lighting**, and **slow position changes** for orthostasis. Escalate **new neuro deficits** after a fall as possible **intracranial injury**—especially on **anticoagulation**.`,
    labsDiagnostics: `**Labs**  
May include **Hgb** after bleeding, **glucose** if hypoglycemia suspected, or **electrolytes** if arrhythmia risk—follow the stem.`,
    pn: `**NCLEX-PN**  
Emphasize **ambulation assistance**, **clutter removal**, **reporting hazards**, and **reinforcing teaching**.`,
    caRpn: `**REx-PN**  
Collaborate for **unsafe home situations**; document objectively.`,
    usRn: `**NCLEX-RN**  
Expect **prioritization** (who is highest fall risk), **post-fall assessment**, and **root-cause analysis themes**.`,
    caRn: `**Canada RN**  
Same safety spine with **Canadian** context when shown.`,
    np: `**NP**  
May test **multifactorial fall prevention** in older adults and **medication deprescribing** themes when appropriate.`,
    examRelevance: `Traps include **restraints first** instead of **prevention**, or **minimizing** acute neuro change after a fall.`,
    scenario: `**Vignette**  
Older adult on **warfarin** falls, hits head, **GCS changes**, **headache**.

**Fork**  
**Emergency neuro evaluation**—not “observe overnight” without assessment; follow **head injury** pathways on anticoagulation.`,
    takeaways: `• **Anticoagulation + head strike** = high risk.  
• **Alarms** supplement—not replace—assessment.  
• Pair with **clinical judgment** gold lesson.`,
    related: ["cj", "ham", "stroke", "fluids"],
    preTest: qt([
      {
        question: "Which factor most increases urgency after a fall in an anticoagulated client?",
        options: [
          "Head strike with neuro change or persistent headache.",
          "Request for extra blankets without injury.",
          "Stable gait with normal mentation.",
          "Mild hunger.",
        ],
        correct: 0,
        rationale:
          "Intracranial bleeding risk rises with anticoagulation and trauma—neuro changes are red flags.",
      },
      {
        question: "Why are bed/chair alarms not a standalone fall strategy?",
        options: [
          "They replace nursing assessment entirely.",
          "They are adjuncts—rounding, mobility plans, and environment fixes still matter.",
          "They never work.",
          "They are only for pediatric clients.",
        ],
        correct: 1,
        rationale:
          "Alarms help signal movement but do not replace prevention and supervision strategies.",
      },
      {
        question: "Which intervention reduces fall risk in orthostatic hypotension?",
        options: [
          "Rapid position changes without pausing.",
          "Rise slowly, sit on edge of bed, use support, and follow orthostatic vital protocols when ordered.",
          "Stop all fluids.",
          "Avoid all walking permanently.",
        ],
        correct: 1,
        rationale:
          "Orthostatic precautions reduce syncope-related falls; fluid plans follow clinician guidance.",
      },
    ]),
    postTest: qt([
      {
        question: "After a fall, what is the nurse’s priority assessment?",
        options: [
          "Finish charting first.",
          "Assess for injury, neuro status, and hemodynamic stability before ambulation.",
          "Immediately stand the client up alone to prove strength.",
          "Ignore complaints to avoid encouraging lawsuits.",
        ],
        correct: 1,
        rationale:
          "Injury and neuro assessment precede mobilization; documentation follows stabilization.",
      },
      {
        question: "Which environmental change is most effective for night falls?",
        options: [
          "Dark hallways to encourage sleep.",
          "Adequate lighting, clear pathways, and reachable call light.",
          "Loose rugs for cushioning.",
          "Removing all mobility aids to encourage independence.",
        ],
        correct: 1,
        rationale:
          "Lighting and clear paths reduce trips; loose rugs increase risk.",
      },
      {
        question: "Why review medications for fall risk?",
        options: [
          "Medications never contribute to falls.",
          "Sedatives, anticholinergics, antihypertensives, and hypoglycemics can increase fall risk—reconciliation matters.",
          "Only antibiotics matter.",
          "Only vitamins matter.",
        ],
        correct: 1,
        rationale:
          "Polypharmacy and high-risk drug classes contribute to sedation, hypotension, and confusion.",
      },
    ]),
  },
  {
    slug: "nurse-patient-assignment-acuity-gold",
    shortTitle: "Patient assignment & acuity",
    topic: "Prioritization & staffing",
    topicSlug: "prioritization-delegation",
    bodySystem: "Leadership / safety",
    npTitleStem: "Acuity — supervision & handoff themes",
    npSeoDescription:
      "NP-level supervision of RNs in some leadership items; continuity-of-care handoffs; not a substitute for facility staffing law.",
    sharedCore: `**What assignment items test**  
Exams reward **matching nurse competence** to **patient acuity**, **balanced workloads**, **safe delegation**, and **escalation** when staffing is unsafe—not “heroics” that stretch scope.

**Principles**  
Cluster **unstable** patients where experience and resources align; avoid giving the **newest** nurse the **highest acuity** without support when the stem implies risk; **float** staff need **orientation** to unit norms; **handoff** must surface **allergies**, **falls risk**, **isolation**, and **pending critical results**.`,
    labsOmitReason:
      "Assignment lessons emphasize acuity, staffing judgment, and delegation; labs appear in disease-specific lessons.",
    pn: `**NCLEX-PN**  
Focus on **accepting only assignments within competency**, **asking for help**, and **reporting unsafe situations**.`,
    caRpn: `**REx-PN**  
Emphasize **college standards** and **employer policy** for scope and supervision.`,
    usRn: `**NCLEX-RN**  
Expect **charge nurse** style questions: who should get the **resource nurse**, which patient needs **first assessment**, and how to **delegate** appropriately.`,
    caRn: `**Canada RN**  
Same prioritization spine; **interprofessional** language may appear.`,
    np: `**NP**  
Leadership items may appear on **admin** tracks—focus on **supervision** and **quality/safety** communication.`,
    examRelevance: `Traps include **silent acceptance** of unsafe assignments or **delegating assessment** that must remain RN-level.`,
    scenario: `**Vignette**  
Unit short-staffed: **one** new grad, **one** unstable ventilated patient, **one** walkie-talkie patient.

**Fork**  
**Match support** to instability—escalate staffing concerns through **chain of command** when policy allows; do not **abandon** unstable clients.`,
    takeaways: `• **Acuity + competency** alignment is the moral of most assignment stems.  
• **Unsafe staffing** is a professional escalation issue—document and notify per policy.  
• Pair with **clinical judgment** and **Canadian RPN scope** gold lessons.`,
    related: ["cj", "sepsis", "shock"],
    preTest: qt([
      {
        question: "Which patient should the experienced RN assess first after shift report?",
        options: [
          "Stable pre-op client scheduled tomorrow.",
          "New-onset hypotension with altered mentation and rising lactate.",
          "Client requesting a toothbrush.",
          "Client watching television with stable vitals.",
        ],
        correct: 1,
        rationale:
          "Hemodynamic instability and sepsis patterns outrank routine comfort requests.",
      },
      {
        question: "What is the best action if an assignment feels unsafe for your competency?",
        options: [
          "Stay silent to avoid conflict.",
          "Use chain of command: discuss with charge nurse/manager and seek appropriate support per policy.",
          "Leave the unit without handoff.",
          "Delegate all tasks to assistive personnel regardless of rules.",
        ],
        correct: 1,
        rationale:
          "Professional practice requires advocating for safe staffing and appropriate supervision.",
      },
      {
        question: "Which task is least appropriate to delegate to an unlicensed assistive personnel?",
        options: [
          "Recording intake and output.",
          "Interpreting new-onset chest pain and deciding independent interventions without reporting.",
          "Ambulating a stable client with a gait belt per plan.",
          "Vital signs on a stable client.",
        ],
        correct: 1,
        rationale:
          "Assessment synthesis and clinical decision-making remain licensed roles; UAP collect data and report.",
      },
    ]),
    postTest: qt([
      {
        question: "Why is handoff communication critical during staffing strain?",
        options: [
          "It replaces all charting.",
          "It transfers critical risks (falls, isolation, pending labs) so the next caregiver can prioritize safely.",
          "It is optional if everyone is busy.",
          "It only includes first names.",
        ],
        correct: 1,
        rationale:
          "SBAR-style handoffs reduce harm during transitions—especially when acuity is high.",
      },
      {
        question: "Which factor increases patient acuity most in classic stems?",
        options: [
          "Hemodynamic instability requiring frequent titration and monitoring.",
          "Stable chronic back pain controlled with scheduled meds.",
          "Upcoming discharge tomorrow with normal vitals.",
          "Reading a book quietly.",
        ],
        correct: 0,
        rationale:
          "Unstable physiology and high-intervention needs define higher acuity.",
      },
      {
        question: "What should a nurse do when floated to an unfamiliar unit?",
        options: [
          "Refuse all tasks.",
          "Identify unit resources, ask for orientation to equipment/policies, and clarify scope with the charge nurse.",
          "Work independently without asking questions.",
          "Ignore alarms as “not my patient.”",
        ],
        correct: 1,
        rationale:
          "Floating requires proactive safety seeking—alarms and policies still apply.",
      },
    ]),
  },
  {
    slug: "adrenal-crisis-addisonian-gold",
    shortTitle: "Adrenal crisis (Addisonian)",
    topic: "Adrenal crisis",
    topicSlug: "endocrine",
    bodySystem: "Endocrine",
    npTitleStem: "Adrenal insufficiency — stress dosing themes",
    npSeoDescription:
      "NP-level steroid sick-day rules, parenteral hydrocortisone in crisis themes, and endocrine follow-up—without replacing inpatient protocols.",
    sharedCore: `**What adrenal crisis is**  
**Acute adrenal insufficiency (Addisonian crisis)** is **cortisol deficiency** under stress—often in **known adrenal insufficiency** or after **abrupt steroid cessation**. Exams reward recognizing **refractory hypotension**, **hyponatremia**, **hyperkalemia**, **hypoglycemia**, **GI symptoms**, and **hyperpigmentation** clues in primary insufficiency—then **urgent escalation** and **stress-dose steroid themes** as provider-driven.

**Nursing spine**  
Monitor **BP**, **glucose**, **electrolytes**, **I/O**; avoid **medication omissions**; prepare for **IV access** and **ordered stress steroids**; teach **sick-day rules** and **medical alert** identification.`,
    labsDiagnostics: `**Labs**  
**Hyponatremia**, **hyperkalemia**, **hypoglycemia**, **cosyntropin testing** in non-acute workups—follow the stem. **Eosinophilia** may appear in teaching.`,
    pn: `**NCLEX-PN**  
Emphasize **vitals**, **reporting shock**, **supporting ordered steroids**, and **never stopping** prescribed steroids abruptly without orders.`,
    caRpn: `**REx-PN**  
Collaborate urgently; **metric** electrolytes may appear.`,
    usRn: `**NCLEX-RN**  
Expect **sepsis overlap**, **fluid resuscitation themes**, and **patient education** for chronic steroid management.`,
    caRn: `**Canada RN**  
Same prioritization with **Canadian** context when shown.`,
    np: `**NP**  
May test **steroid taper plans**, **stress dosing education**, and **differential** from sepsis.`,
    examRelevance: `Traps include **treating as “just dehydration”** without considering **steroid** needs, or **routine tasks** during shock.`,
    scenario: `**Vignette**  
Known **Addison’s**, **N/V**, **hypotension refractory to fluids**, **Na⁺ 124**, **K⁺ 5.8**.

**Fork**  
**Emergency endocrine pathway**—notify provider, **prepare stress-dose therapy per orders**, monitor **ECG** for hyperkalemia.`,
    takeaways: `• **Refractory hypotension + steroid history** → think adrenal crisis until evaluated.  
• **Hyperkalemia** can be rhythm-lethal.  
• Pair with **fluids/electrolytes** gold lesson.`,
    related: ["fluids", "shock", "sepsis", "cj"],
    preTest: qt([
      {
        question: "Which lab pattern fits classic teaching for primary adrenal insufficiency?",
        options: [
          "Hyponatremia and hyperkalemia (when the stem frames primary insufficiency).",
          "Hypernatremia always.",
          "Hypokalemia always.",
          "Normal electrolytes always.",
        ],
        correct: 0,
        rationale:
          "Classic teaching highlights hyponatremia and hyperkalemia in primary disease—follow the stem for secondary patterns.",
      },
      {
        question: "Why is abrupt steroid cessation dangerous for chronic steroid users?",
        options: [
          "It has no physiologic effect.",
          "It can precipitate adrenal crisis due to HPA suppression and inadequate cortisol under stress.",
          "It only affects the skin.",
          "It increases insulin always.",
        ],
        correct: 1,
        rationale:
          "Chronic exogenous steroids suppress the HPA axis; abrupt stops risk crisis—taper per provider guidance.",
      },
      {
        question: "Which assessment finding should prompt urgent escalation in suspected adrenal crisis?",
        options: [
          "Stable BP after fluids with normal mentation.",
          "Refractory hypotension with confusion despite initial resuscitation.",
          "Mild dry mouth without vitals change.",
          "Normal glucose without symptoms.",
        ],
        correct: 1,
        rationale:
          "Shock with altered mentation suggests life-threatening instability requiring urgent intervention.",
      },
    ]),
    postTest: qt([
      {
        question: "Which patient education point is essential for clients on chronic steroids?",
        options: [
          "Never tell providers you take steroids.",
          "Wear medical alert identification and follow sick-day/stress dosing instructions from your clinician.",
          "Stop steroids whenever you travel.",
          "Double steroids whenever you feel anxious without guidance.",
        ],
        correct: 1,
        rationale:
          "Identification and clinician-directed stress dosing reduce crisis risk.",
      },
      {
        question: "Why monitor glucose in adrenal crisis?",
        options: [
          "Cortisol deficiency can contribute to hypoglycemia—glucose may need correction per orders.",
          "Glucose is never relevant.",
          "Everyone is hyperglycemic only.",
          "Glucose replaces electrolytes.",
        ],
        correct: 0,
        rationale:
          "Hypoglycemia can accompany adrenal crisis; monitor and treat per orders.",
      },
      {
        question: "Which intervention matches shock management while awaiting definitive therapy?",
        options: [
          "Delay IV access to save time.",
          "Establish/maintain access, monitor vitals, follow fluid and steroid orders per protocol, and escalate ongoing instability.",
          "Send the client home to rest.",
          "Withhold all fluids in hypotension.",
        ],
        correct: 1,
        rationale:
          "Resuscitation and protocol-driven therapy stabilize while diagnosis is confirmed.",
      },
    ]),
  },
  {
    slug: "ards-acute-respiratory-failure-gold",
    shortTitle: "ARDS & acute respiratory failure",
    topic: "ARDS",
    topicSlug: "respiratory",
    bodySystem: "Respiratory",
    npTitleStem: "ARDS — oxygenation & escalation themes",
    npSeoDescription:
      "NP-level ICU referral criteria themes, prone positioning as team decisions, and lung-protective ventilation concepts without managing ventilator settings on RN exams unless the stem defines extended training.",
    sharedCore: `**What ARDS is (exam framing)**  
**Acute respiratory distress syndrome (ARDS)** is **inflammatory lung injury** causing **severe hypoxemia** and **bilateral infiltrates** (when imaging is in play) without isolated **left heart failure** explaining findings—per Berlin-style teaching. Nursing items reward **oxygenation monitoring**, **lung-protective care collaboration**, **proning** as a **team intervention**, **sedation minimization** themes, and **VAP prevention** bundles—not improvising ventilator changes.

**Nursing spine**  
Frequent **SpO₂**, **ABG** trends, **lung sounds**, **suction** as indicated, **oral care**, **DVT prophylaxis** when ordered, **GI stress ulcer prophylaxis** when ordered, and **clear escalation** for **worsening oxygenation**.`,
    labsDiagnostics: `**ABG** shows **hypoxemia** often with **widened A-a gradient** teaching; **PaO₂/FiO₂** ratios appear in ICU-style items. Nursing integrates **timely labs** and **reporting**.`,
    pn: `**NCLEX-PN**  
Emphasize **supportive care**, **reporting desaturation**, and **never adjusting vent settings** outside role.`,
    caRpn: `**REx-PN**  
Collaborate in ICU; follow **policy** for high-acuity tasks.`,
    usRn: `**NCLEX-RN**  
Expect **proning teamwork**, **ARDS vs cardiogenic pulmonary edema** overlap cues, and **patient safety** during sedation.`,
    caRn: `**Canada RN**  
Same prioritization with **Canadian** ICU context when shown.`,
    np: `**NP**  
May test **referral** to ICU and **underlying cause** search (sepsis, aspiration, trauma).`,
    examRelevance: `Traps include **routine bathing** during **life-threatening hypoxemia** or **ignoring ventilator alarms**.`,
    scenario: `**Vignette**  
Intubated client with **FiO₂ rising**, **SpO₂ falling**, **blood pressure dropping**.

**Fork**  
**Emergency response**—call for help, optimize **oxygenation per protocol**, prepare for **adjunct therapies** as ordered.`,
    takeaways: `• **Refractory hypoxemia** = escalate early.  
• **ARDS** often links to **sepsis/aspiration**—pair lessons.  
• Pair with **COPD**/**sepsis** gold lessons.`,
    related: ["sepsis", "shock", "copd", "fluids"],
    preTest: qt([
      {
        question: "Which finding best matches severe hypoxemic respiratory failure in teaching vignettes?",
        options: [
          "Refractory hypoxemia despite increasing oxygen requirements with bilateral infiltrates on imaging when shown.",
          "Normal SpO₂ on room air with clear lungs.",
          "Isolated ankle swelling without respiratory symptoms.",
          "Mild cough without vitals change.",
        ],
        correct: 0,
        rationale:
          "ARDS patterns emphasize severe oxygenation failure with supportive imaging/clinical context—follow the stem.",
      },
      {
        question: "Why is oral care emphasized in intubated clients?",
        options: [
          "It is cosmetic only.",
          "It supports VAP prevention bundles alongside other nursing interventions.",
          "It replaces suctioning.",
          "It removes the need for sedation breaks.",
        ],
        correct: 1,
        rationale:
          "Ventilator-associated pneumonia prevention includes oral hygiene as part of bundled care.",
      },
      {
        question: "Which action is appropriate when oxygenation suddenly worsens on a ventilator?",
        options: [
          "Ignore alarms briefly to finish charting.",
          "Assess the client, check circuit connections, suction if indicated, and notify RT/provider per protocol.",
          "Disconnect the ventilator without support.",
          "Turn off alarms permanently.",
        ],
        correct: 1,
        rationale:
          "Sudden desaturation requires systematic assessment and escalation—not alarm silencing.",
      },
    ]),
    postTest: qt([
      {
        question: "Why might proning be used in severe ARDS?",
        options: [
          "It improves ventilation-perfusion matching in select clients as a team intervention per protocol.",
          "It is only for comfort positioning.",
          "It replaces all ventilation.",
          "It cures ARDS instantly in every case.",
        ],
        correct: 0,
        rationale:
          "Prone positioning is an evidence-based adjunct for refractory hypoxemia in selected patients—team-driven.",
      },
      {
        question: "Which assessment supports identifying a mucus plug in an intubated client?",
        options: [
          "Sudden rise in peak airway pressures with desaturation and decreased breath sounds on one side.",
          "Stable peak pressures with symmetric breath sounds.",
          "Normal SpO₂ without change.",
          "Client denies all symptoms.",
        ],
        correct: 0,
        rationale:
          "Obstruction can cause asymmetric breath sounds and ventilator changes—assess and escalate.",
      },
      {
        question: "What is the nurse’s role in lung-protective ventilation themes on exams?",
        options: [
          "Arbitrarily set tidal volumes without orders.",
          "Monitor compliance with ordered settings, assess synchrony, and communicate issues to RT/provider.",
          "Ignore ABG trends.",
          "Remove PEEP without assessment.",
        ],
        correct: 1,
        rationale:
          "Collaborative monitoring and communication support safe ventilation—settings follow orders and protocols.",
      },
    ]),
  },
  {
    slug: "thyroid-storm-emergency-gold",
    shortTitle: "Thyroid storm: emergency recognition",
    topic: "Thyroid storm",
    topicSlug: "endocrine",
    bodySystem: "Endocrine",
    npTitleStem: "Thyroid storm — stabilization themes",
    npSeoDescription:
      "NP-level hyperthyroid crisis triage, beta-blockade and antithyroid drug themes as team decisions, and ICU referral—without independent dosing games.",
    sharedCore: `**What thyroid storm is**  
**Thyroid storm** is **life-threatening thyrotoxicosis** with **hyperthermia**, **tachycardia**, **agitation**, **GI symptoms**, and sometimes **heart failure** or **arrhythmia**. Exams reward **early recognition**, **cooling**, **treating triggers** (infection, surgery), and **urgent escalation**—not “watchful waiting.”

**Nursing spine**  
Continuous **cardiac monitoring**, **temperature** control per orders, **IV access**, **strict I/O**, **beta-blockade** as ordered, **antithyroid drugs** as ordered, **glucose** monitoring, and **sedation** only as appropriate with airway vigilance.`,
    labsDiagnostics: `**TFTs** confirm hyperthyroidism but may lag—clinical severity drives emergency care. **Liver enzymes**, **glucose**, **electrolytes** may be monitored.`,
    pn: `**NCLEX-PN**  
Emphasize **frequent vitals**, **staying with agitated clients**, **reporting tachyarrhythmias**, and **supporting cooling** per orders.`,
    caRpn: `**REx-PN**  
Collaborate urgently; **metric** values may appear.`,
    usRn: `**NCLEX-RN**  
Expect **ICU-level monitoring themes**, **heart failure overlap**, and **infection** as precipitant.`,
    caRn: `**Canada RN**  
Same prioritization with **Canadian** context when shown.`,
    np: `**NP**  
May test **precipitant search** (iodine load, infection, nonadherence) and **referral** thresholds.`,
    examRelevance: `Traps include **antipyretics alone** without addressing **thyrotoxicosis** or **missing tachyarrhythmia** as urgent.`,
    scenario: `**Vignette**  
Known **Graves**, **fever 40 °C**, **AFib with RVR**, **agitation**, **vomiting**.

**Fork**  
**ICU-level stabilization**—cooling per orders, **continuous monitoring**, **prepare antithyroid/beta-blockade per orders**, treat **precipitants**.`,
    takeaways: `• **Hyperthermia + severe tachycardia + agitation** in hyperthyroid client → storm until proven otherwise.  
• Pair with **AFib** and **sepsis** lessons for overlap.`,
    related: ["fluids", "cj", "sepsis", "acs"],
    preTest: qt([
      {
        question: "Which symptom cluster should raise suspicion for thyroid storm?",
        options: [
          "High fever, marked tachycardia, altered mentation, GI symptoms in a hyperthyroid client.",
          "Mild cold without tachycardia.",
          "Chronic fatigue stable for years.",
          "Localized knee pain only.",
        ],
        correct: 0,
        rationale:
          "Storm is a systemic crisis with hypermetabolic and cardiovascular instability—follow the stem.",
      },
      {
        question: "Why is infection considered a precipitant?",
        options: [
          "Infection increases metabolic demand and can worsen thyrotoxicosis—search and treat per orders.",
          "Infection never matters.",
          "Infection only affects the skin.",
          "Infection lowers heart rate always.",
        ],
        correct: 0,
        rationale:
          "Common exam teaching links infection/surgery/iodine loads as precipitants—follow the vignette.",
      },
      {
        question: "Which nursing action supports cooling in thyroid storm?",
        options: [
          "Ice packs per protocol, monitor shivering, frequent temperature checks, and avoid oversedation that masks airway compromise.",
          "Ignore fever as anxiety.",
          "Use alcohol baths in all cases.",
          "Stop all monitoring to let the client rest.",
        ],
        correct: 0,
        rationale:
          "Cooling is protocol-driven; shivering can worsen metabolic demand—team management matters.",
      },
    ]),
    postTest: qt([
      {
        question: "Why monitor glucose in thyroid storm?",
        options: [
          "Hypermetabolism can alter glucose; monitor and treat per orders.",
          "Glucose is irrelevant.",
          "Everyone is hypoglycemic only.",
          "Glucose replaces thyroid labs.",
        ],
        correct: 0,
        rationale:
          "Glycemic variability can occur; follow orders and monitoring plans.",
      },
      {
        question: "Which finding requires urgent escalation?",
        options: [
          "New chest pain with hypotension and dysrhythmia.",
          "Stable HR 78 after beta-blockade per order.",
          "Normal mentation with resolved fever.",
          "Eating lunch with stable vitals.",
        ],
        correct: 0,
        rationale:
          "Cardiovascular collapse patterns require urgent intervention and team activation.",
      },
      {
        question: "What is the nurse’s role regarding antithyroid medications?",
        options: [
          "Hold all medications without reason.",
          "Administer on time per orders, monitor for adverse effects, and communicate ineffectiveness or deterioration.",
          "Change doses independently.",
          "Stop beta-blockers because HR is fast.",
        ],
        correct: 1,
        rationale:
          "Medication administration and monitoring follow orders; dose changes belong to authorized prescribers.",
      },
    ]),
  },
  {
    slug: "delirium-acute-confusion-gold",
    shortTitle: "Delirium: acute confusion & safety",
    topic: "Delirium",
    topicSlug: "neurological",
    bodySystem: "Neurological / geriatrics",
    npTitleStem: "Delirium — causes & safety planning",
    npSeoDescription:
      "NP-level medication review for anticholinergics, infection workup themes, and caregiver education—without replacing psychiatry for primary psychosis.",
    sharedCore: `**What delirium is**  
**Delirium** is an **acute fluctuating disturbance** in **attention** and **awareness** with a **medical cause** (infection, drugs, withdrawal, metabolic, hypoxia, pain, sleep deprivation). It is **not** the same as chronic dementia—though they coexist. Exams reward **identifying triggers**, **reorienting**, **sleep-wake optimization**, **mobility when safe**, **medication review**, and **fall precautions**.

**Nursing spine**  
Frequent **orientation**, **glasses/hearing aids** when available, **hydration**, **pain control**, **avoiding unnecessary tethers**, **family involvement**, and **monitoring for safety** without **restraints first**.`,
    labsDiagnostics: `**Labs**  
**Infection**, **electrolytes**, **glucose**, **oxygenation**, **drug levels** when relevant—follow the stem for the “search for cause.”`,
    pn: `**NCLEX-PN**  
Emphasize **safety**, **reporting acute change**, **reorientation**, and **fall precautions**.`,
    caRpn: `**REx-PN**  
Collaborate for **unsafe wandering**; document behaviors objectively.`,
    usRn: `**NCLEX-RN**  
Expect **CAM**-style assessment themes, **restraint alternatives**, and **ICU delirium** bundles (sleep, mobility, family).`,
    caRn: `**Canada RN**  
Same spine with **Canadian** context when shown.`,
    np: `**NP**  
May test **differentiating delirium from dementia** in ambulatory frames and **medication deprescribing**.`,
    examRelevance: `Traps include **attributing delirium to “old age”** without workup, or **restraints** before **cause removal**.`,
    scenario: `**Vignette**  
Post-op older adult **pulling lines**, **hallucinating at night**, **hypoxic** briefly.

**Fork**  
**Treat causes first**—oxygen, infection search, medication review, pain control—use **least restrictive** safety measures.`,
    takeaways: `• **Acute confusion** = find the cause, protect the patient.  
• **Restraints** are last resort with orders and monitoring.  
• Pair with **infection** and **opioid** lessons when applicable.`,
    related: ["cj", "sepsis", "ham", "stroke"],
    preTest: qt([
      {
        question: "Which feature best distinguishes delirium from dementia in teaching comparisons?",
        options: [
          "Acute onset with fluctuating attention versus more chronic progressive cognitive baseline.",
          "Delirium never occurs in older adults.",
          "Dementia always has fever.",
          "They are identical on exams.",
        ],
        correct: 0,
        rationale:
          "Delirium is acute and fluctuating with medical triggers; dementia is typically chronic—overlap exists.",
      },
      {
        question: "Which intervention is first-line for delirium prevention in ICU teaching bundles?",
        options: [
          "Sleep promotion, early mobility when safe, orientation, minimizing unnecessary sedation.",
          "Permanent restraints for everyone.",
          "Isolation without assessment.",
          "Stopping all fluids.",
        ],
        correct: 0,
        rationale:
          "ABCDEF bundles emphasize non-pharmacologic prevention; restraints are not first-line.",
      },
      {
        question: "Why review medications in new-onset delirium?",
        options: [
          "Medications never cause delirium.",
          "Anticholinergics, sedatives, polypharmacy, and alcohol withdrawal are common contributors.",
          "Only antibiotics matter.",
          "Only vitamins matter.",
        ],
        correct: 1,
        rationale:
          "Drug-induced delirium is a high-yield exam theme—reconciliation matters.",
      },
    ]),
    postTest: qt([
      {
        question: "When are restraints most appropriate?",
        options: [
          "As a convenience when short-staffed.",
          "When less restrictive measures fail and imminent harm exists, with orders, policy, and frequent monitoring.",
          "For every confused older adult automatically.",
          "Never, under any circumstance.",
        ],
        correct: 1,
        rationale:
          "Restraints require indication, order, and monitoring—least restrictive first.",
      },
      {
        question: "Which finding should prompt infection workup in delirium?",
        options: [
          "New fever, dysuria, cough with infiltrate, or positive urinalysis when clinically indicated.",
          "Stable chronic joint pain.",
          "Reading a novel quietly.",
          "Normal temperature always rules out infection.",
        ],
        correct: 0,
        rationale:
          "Infection is a common delirium trigger—follow objective data and orders.",
      },
      {
        question: "Why involve family in care when appropriate?",
        options: [
          "Family can support reorientation and provide baseline behavior history.",
          "Family should replace all nursing assessments.",
          "Family is never helpful.",
          "Family should administer sedatives independently.",
        ],
        correct: 0,
        rationale:
          "Family partnership supports orientation and safety when privacy allows.",
      },
    ]),
  },
];
