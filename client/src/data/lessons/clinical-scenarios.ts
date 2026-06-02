import type { LessonContent } from "./types";

export const clinicalScenariosLessons: Record<string, LessonContent> = {
  "who-see-first-adult": {
    title: "Who Do You See First: Adult Medical-Surgical",
    cellular: {
      title: "Clinical Prioritization Using Physiological",
      content: "The 'Who Do You See First' question is one of the most commonly tested concepts on nursing licensure examinations. It requires the nurse to rapidly triage multiple patients and determine which one has the highest clinical acuity based on physiological threat. This decision-making process is rooted in the ABCs (Airway, Breathing, Circulation), Maslow's Hierarchy of Needs, and the concept of clinical urgency versus routine care.\n\nThe fundamental principle is: the patient with the greatest physiological instability or the highest risk of rapid deterioration is seen FIRST. This means acute changes always take priority over chronic stable conditions. New-onset symptoms take priority over expected post-procedural findings. Abnormal vital signs take priority over patient requests or scheduled tasks.\n\nKey decision-making framework:\n1. ABCs First: Any patient with airway compromise, respiratory distress, or hemodynamic instability is the priority.\n2. Acute over Chronic: A patient with new-onset chest pain is prioritized over a patient with stable chronic heart failure.\n3. Unexpected over Expected: A post-op patient with sudden oxygen desaturation is prioritized over a post-op patient reporting incisional pain.\n4. Unstable over Stable: A patient with vital signs outside normal parameters is seen before one with normal vitals.\n5. Assessment Before Intervention: Gather data before acting  -  but never delay intervention for a patient in immediate danger.\n\nCommon exam traps include:\n- The patient who 'looks' most dramatic but is actually stable (e.g., a patient with a large wound that is healing well)\n- The patient with subtle signs of deterioration (e.g., new confusion in an elderly patient  -  may indicate sepsis, stroke, or hypoxia)\n- Prioritizing patient satisfaction or scheduled procedures over acute changes\n- Choosing the patient with the most complex diagnosis rather than the one with the most acute presentation"
    },
    riskFactors: [
      "New-onset vital sign changes (tachycardia, hypotension, tachypnea, fever, desaturation)",
      "Altered level of consciousness or new confusion",
      "Acute chest pain, dyspnea, or hemodynamic instability",
      "Post-procedure patients with unexpected symptoms",
      "Patients returning from procedures requiring immediate assessment",
      "Fall risk patients reporting dizziness or near-falls",
      "Patients with new lab critical values requiring action",
      "Diabetic patients with blood glucose extremes (<70 or >400 mg/dL)"
    ],
    diagnostics: [
      "Rapid vital sign assessment: HR, BP, RR, SpO2, temperature  -  look for trends and acute changes",
      "Level of consciousness: Alert, oriented, responsive to verbal/painful stimuli (AVPU scale)",
      "Pain assessment: New-onset, worsening, or uncontrolled pain  -  especially chest, abdominal, or headache",
      "Respiratory assessment: Breath sounds, work of breathing, accessory muscle use, SpO2 trend",
      "Circulatory assessment: Skin color/temperature, capillary refill, pulse quality, urine output",
      "Neurological: Pupil response, grip strength, facial symmetry, speech clarity"
    ],
    management: [
      "Triage all assigned patients at the start of each shift using ABCs and acuity assessment",
      "See the most physiologically unstable patient FIRST  -  do not get distracted by requests or scheduled tasks",
      "After initial triage, reassess based on new information (labs, provider orders, patient changes)",
      "Delegate stable patient tasks (vitals, hygiene, ambulation) to unlicensed assistive personnel",
      "Document rationale for prioritization decisions when they impact care delivery",
      "Use the 'see, treat, re-evaluate' cycle: assess the priority patient, initiate treatment, then move to the next"
    ],
    nursingActions: [
      "ALWAYS see the patient with acute respiratory distress or airway compromise FIRST",
      "Report and act on critical vital signs: systolic BP <90 or >180, HR <50 or >120, RR <10 or >28, SpO2 <92%, temp >38.5°C",
      "New-onset chest pain: apply O2, obtain 12-lead ECG, notify provider STAT",
      "New-onset confusion in elderly: assess blood glucose, oxygen, neurological status  -  may indicate stroke, sepsis, or medication reaction",
      "Post-op bleeding: assess surgical site, vital signs, apply pressure if accessible, notify surgeon",
      "Prioritize assessment over comfort measures when multiple patients need attention simultaneously"
    ],
    signs: {
      left: [
        "SEE FIRST: Patient with acute respiratory distress (SpO2 dropping, accessory muscle use, can't speak in full sentences)",
        "SEE FIRST: Patient with new-onset chest pain and diaphoresis (possible MI)",
        "SEE FIRST: Post-op patient with sudden hypotension and tachycardia (possible hemorrhage)",
        "SEE FIRST: Patient with altered LOC or new confusion (possible stroke, sepsis, hypoglycemia)",
        "SEE FIRST: Patient reporting 'something doesn't feel right' with vital sign changes"
      ],
      right: [
        "CAN WAIT: Patient with chronic stable conditions requesting pain medication refill",
        "CAN WAIT: Patient requesting help with meal tray or ambulation (delegate to UAP)",
        "CAN WAIT: Patient with expected post-op incisional pain controlled by current regimen",
        "CAN WAIT: Patient asking questions about discharge instructions",
        "CAN WAIT: Patient with stable chronic wound needing routine dressing change"
      ]
    },
    medications: [
      {
        name: "Supplemental Oxygen",
        type: "Respiratory Support",
        action: "Increases inspired oxygen concentration to maintain SpO2 >94% (>88-92% for COPD patients)",
        sideEffects: "Oxygen toxicity with prolonged high FiO2, absorption atelectasis, CO2 retention in COPD",
        contra: "Use cautiously in COPD patients (titrate to SpO2 88-92% to avoid suppressing hypoxic drive)",
        pearl: "Oxygen is a medication  -  always titrate to target SpO2 and document flow rate. In emergencies, apply O2 first and titrate down."
      },
      {
        name: "Nitroglycerin (NTG)",
        type: "Vasodilator / Antianginal",
        action: "Relaxes vascular smooth muscle via nitric oxide release, reducing preload and myocardial oxygen demand",
        sideEffects: "Headache (most common), hypotension, dizziness, reflex tachycardia",
        contra: "Systolic BP <90 mmHg, use of PDE5 inhibitors (sildenafil/tadalafil) within 24-48 hours, right ventricular infarction",
        pearl: "Give sublingual every 5 minutes × 3 doses for chest pain. Check BP before EACH dose. If no relief after 3 doses, suspect acute MI  -  activate emergency protocol."
      }
    ],
    pearls: [
      "The word 'NEW' is the most important word in prioritization  -  new symptoms always take priority over chronic stable conditions",
      "Acute changes > Chronic conditions. Unexpected findings > Expected findings. Physiological needs > Psychosocial needs",
      "Never choose an answer that delays assessment of an acutely ill patient for a task that can wait or be delegated",
      "On exams, if a patient is 'pale, diaphoretic, and anxious,' this is describing hemodynamic instability  -  see this patient FIRST",
      "A patient who 'doesn't look right' to an experienced nurse often IS deteriorating  -  trust clinical judgment and assess immediately",
      "Post-surgical patients with sudden onset symptoms (pain, dyspnea, bleeding) are ALWAYS a priority over stable patients"
    ],
    preTest: [
      {
        question: "A nurse is assigned four patients. Which should be seen FIRST?",
        options: [
          "A patient with COPD who has SpO2 of 90% on 2L O2 (their baseline)",
          "A patient 2 hours post-appendectomy reporting 7/10 incisional pain",
          "A patient with type 2 diabetes requesting their morning insulin",
          "A patient with new-onset confusion who was oriented last shift"
        ],
        correct: 3,
        rationale: "New-onset confusion is an acute change that could indicate stroke, sepsis, hypoglycemia, or medication reaction and requires immediate assessment. The COPD patient is at baseline, the post-op patient has expected pain, and the insulin can be given within a reasonable timeframe."
      },
      {
        question: "Which patient finding requires the nurse to intervene FIRST?",
        options: [
          "Blood glucose of 180 mg/dL before lunch in a diabetic patient",
          "Blood pressure of 88/52 mmHg in a post-operative patient",
          "Temperature of 37.8°C on post-op day 1",
          "Heart rate of 92 bpm in a patient with anxiety"
        ],
        correct: 1,
        rationale: "A systolic BP of 88 in a post-op patient suggests possible hemorrhage or hemodynamic instability requiring immediate intervention. The blood glucose is mildly elevated but not critical, the low-grade fever is expected post-op (atelectasis), and the heart rate of 92 is a normal response to anxiety."
      },
      {
        question: "A nurse receives report on four patients. Which should be assessed FIRST?",
        options: [
          "A patient scheduled for discharge awaiting final instructions",
          "A patient with a Stage 2 pressure injury needing a dressing change",
          "A patient reporting sudden onset severe headache with blurred vision",
          "A patient requesting PRN anti-nausea medication"
        ],
        correct: 2,
        rationale: "Sudden onset severe headache with blurred vision could indicate a hypertensive crisis, stroke, or increased intracranial pressure  -  all life-threatening emergencies requiring immediate assessment."
      }
    ],
    postTest: [
      {
        question: "A med-surg nurse has four patients. Which requires PRIORITY assessment?",
        options: [
          "A patient with stable CHF who gained 1 kg overnight",
          "A patient 4 hours post-cardiac catheterization with a weak pedal pulse on the affected leg",
          "A patient with pneumonia whose morning sputum culture results are pending",
          "A patient with a fractured hip awaiting surgery requesting pain medication"
        ],
        correct: 1,
        rationale: "A weak or diminished pedal pulse post-cardiac catheterization indicates possible arterial occlusion or thrombus at the catheter insertion site  -  a time-sensitive vascular emergency. The other patients have conditions that, while requiring attention, are not immediately life-threatening."
      },
      {
        question: "The nurse is prioritizing morning assessments. Which patient is seen FIRST?",
        options: [
          "A patient with a new tracheostomy who is coughing and appears anxious",
          "A patient with a wound vac needing a canister change",
          "A patient requesting morning medications that were due 30 minutes ago",
          "A patient with stable vitals asking about their lab results"
        ],
        correct: 0,
        rationale: "A patient with a new tracheostomy who is coughing and anxious may have a mucus plug, displacement, or airway obstruction  -  this is an ABCs priority. Airway always comes first."
      },
      {
        question: "A nurse receives four phone calls simultaneously. Which call is returned FIRST?",
        options: [
          "The pharmacy asking to clarify a non-urgent medication order",
          "A family member requesting an update on their parent's condition",
          "The lab reporting a critical potassium level of 6.8 mEq/L",
          "Physical therapy wanting to schedule an afternoon session"
        ],
        correct: 2,
        rationale: "A critical potassium of 6.8 mEq/L is life-threatening and can cause fatal cardiac arrhythmias. This requires immediate intervention (cardiac monitoring, calcium gluconate, insulin/glucose, kayexalate) and is the highest priority."
      }
    ],
    quiz: [
      {
        question: "The key principle for 'Who Do You See First' questions is:",
        options: [
          "See the patient who has been waiting the longest",
          "See the patient with the most complex diagnosis",
          "See the patient with the greatest physiological instability or risk of deterioration",
          "See the patient whose family is most concerned"
        ],
        correct: 2,
        rationale: "Clinical prioritization is always based on physiological acuity and risk of deterioration. The patient with the most unstable or acutely changing condition is seen first, regardless of diagnosis complexity, wait time, or family concerns."
      }
    ]
  },

  "who-see-first-pediatric": {
    title: "Who Do You See First: Pediatric Scenarios",
    cellular: {
      title: "Pediatric-Specific Prioritization",
      content: "Pediatric patients present unique prioritization challenges because children have different physiological reserves, communicate symptoms differently, and deteriorate faster than adults. The same ABCs framework applies, but the clinical presentation of emergencies differs significantly in pediatric populations.\n\nKey pediatric-specific considerations:\n\n1. Airway: Children have smaller, more compliant airways that are more easily obstructed. The pediatric airway is funnel-shaped (narrowest at the cricoid ring until age 8), making even small amounts of edema or secretions more dangerous. Infants are obligate nose breathers until approximately 4-6 months  -  nasal congestion alone can cause respiratory distress.\n\n2. Breathing: Children rely more heavily on diaphragmatic breathing. Any abdominal distension (e.g., from paralytic ileus or peritonitis) can compromise ventilation. Normal respiratory rates are significantly higher in infants and toddlers (30-60/min in newborns, 20-30/min in toddlers). Tachypnea is often the FIRST sign of distress in infants.\n\n3. Circulation: Children maintain blood pressure through tachycardia and vasoconstriction longer than adults. Hypotension is a LATE sign of shock in children  -  by the time BP drops, the child has lost 25-30% of blood volume. Tachycardia with poor perfusion (prolonged capillary refill >3 seconds, mottled skin, decreased urine output) is an early sign of shock.\n\n4. Communication: Young children cannot articulate symptoms. The nurse must rely on behavioral cues (irritability, lethargy, inconsolability, poor feeding, decreased play activity) and parental reports ('something is different about my child'). Parental intuition is often clinically significant.\n\n5. Dehydration: Children have higher metabolic rates and proportionally more body water. They dehydrate faster and are at higher risk for fluid and electrolyte imbalances. Signs include decreased urine output (<1 mL/kg/hr), sunken fontanelle (infants), decreased skin turgor, and dry mucous membranes.\n\nPrioritization framework for pediatric patients:\n- Respiratory distress in any child = HIGHEST priority (most common cause of pediatric cardiac arrest is respiratory failure, NOT cardiac causes)\n- Behavioral changes: a previously playful child who is now lethargic and unresponsive to stimulation is critically ill\n- Fever in neonates (<28 days): always an emergency requiring immediate workup for sepsis\n- Inconsolable crying in infants: rule out intussusception, meningitis, incarcerated hernia, hair tourniquet syndrome"
    },
    riskFactors: [
      "Neonates and infants (<12 months)  -  highest vulnerability due to immature immune and physiological systems",
      "Premature infants  -  increased risk of apnea, respiratory failure, and sepsis",
      "Children with congenital heart defects  -  at risk for heart failure, cyanotic spells, and arrhythmias",
      "Immunocompromised children (chemotherapy, transplant)  -  fever may be the only sign of life-threatening infection",
      "Children with recent surgical procedures  -  higher risk of airway and respiratory complications",
      "Toddlers and preschoolers  -  high risk for foreign body aspiration and accidental poisoning",
      "Adolescents  -  risk of self-harm, substance use, and eating disorders presenting as medical complaints"
    ],
    diagnostics: [
      "Pediatric Assessment Triangle (PAT): Appearance (muscle tone, interactiveness, consolability, look/gaze, speech/cry), Work of Breathing (abnormal positioning, retractions, nasal flaring, audible sounds), Circulation to Skin (pallor, mottling, cyanosis)",
      "Vital signs with AGE-APPROPRIATE ranges  -  a 'normal' adult HR of 70 would be bradycardic in an infant",
      "Capillary refill: >3 seconds in children is abnormal and suggests poor perfusion",
      "Fontanelle assessment in infants: bulging (increased ICP, meningitis), sunken (dehydration)",
      "Weight-based medication dosing check: verify all pediatric medication doses are appropriate for weight",
      "Urine output monitoring: <1 mL/kg/hr in children indicates inadequate perfusion or dehydration"
    ],
    management: [
      "ALWAYS assess the child with respiratory distress FIRST  -  respiratory failure is the #1 cause of pediatric cardiac arrest",
      "Use the PAT (Pediatric Assessment Triangle) for rapid visual assessment from the doorway before touching the child",
      "Involve parents in the assessment process  -  they know their child's baseline behavior",
      "For neonatal fever (< 28 days old): full sepsis workup is mandatory regardless of how well the infant appears",
      "Treat dehydration aggressively with weight-based fluid boluses (20 mL/kg NS, may repeat × 3)",
      "Maintain a calm environment  -  agitation can worsen respiratory distress and increase oxygen demand"
    ],
    nursingActions: [
      "SEE FIRST: Any child with signs of respiratory distress (retractions, nasal flaring, grunting, head bobbing, tripod positioning)",
      "SEE FIRST: Febrile neonate (<28 days)  -  always a medical emergency",
      "SEE FIRST: Lethargic child who was previously active and interactive (indicates significant illness)",
      "Report immediately: bulging fontanelle, petechial rash with fever (meningococcemia), barking cough with stridor (croup/epiglottitis), drooling with inability to swallow (epiglottitis)",
      "Never leave a child with respiratory distress unattended  -  keep suction and appropriately-sized airway equipment at bedside",
      "Calculate all medication doses based on weight in kilograms and DOUBLE-CHECK the math before administration"
    ],
    signs: {
      left: [
        "SEE FIRST: Infant with nasal flaring, grunting, and intercostal retractions",
        "SEE FIRST: 3-week-old neonate with fever of 38.2°C (full sepsis workup needed)",
        "SEE FIRST: Previously active toddler who is now limp and unresponsive to parents",
        "SEE FIRST: Child with sudden onset stridor and drooling (suspect epiglottitis  -  do NOT examine throat)",
        "SEE FIRST: Infant with inconsolable crying, drawing legs to abdomen (possible intussusception)"
      ],
      right: [
        "CAN WAIT: Child with chronic asthma on maintenance therapy, stable SpO2 97%",
        "CAN WAIT: Toddler with known ear infection crying during ear drop administration",
        "CAN WAIT: School-age child requesting help with homework during hospitalization",
        "CAN WAIT: Adolescent with stable fracture asking about discharge timeline",
        "CAN WAIT: Infant feeding well with mild nasal congestion and no respiratory distress"
      ]
    },
    medications: [
      {
        name: "Epinephrine (Racemic)",
        type: "Adrenergic Agonist / Bronchodilator",
        action: "Alpha-adrenergic stimulation causes mucosal vasoconstriction and reduces airway edema in croup and post-extubation stridor",
        sideEffects: "Tachycardia, tremor, pallor, rebound edema after 2 hours",
        contra: "Use with caution in children with cardiac anomalies; monitor for rebound worsening",
        pearl: "After racemic epinephrine administration for croup, the child MUST be observed for at least 2-4 hours for rebound edema. Never discharge immediately after treatment."
      },
      {
        name: "Dexamethasone (Decadron)",
        type: "Corticosteroid",
        action: "Reduces inflammation and airway edema; first-line treatment for moderate-to-severe croup",
        sideEffects: "Hyperglycemia, increased appetite, mood changes, immunosuppression with prolonged use",
        contra: "Active untreated infections; use cautiously in immunocompromised children",
        pearl: "A single dose of dexamethasone 0.6 mg/kg (max 10 mg) PO/IM is the standard treatment for croup and significantly reduces return visits and hospitalization."
      }
    ],
    pearls: [
      "In pediatrics, respiratory failure is the #1 cause of cardiac arrest  -  NOT a cardiac event. A child in respiratory distress is ALWAYS your priority",
      "Tachycardia is the FIRST sign of shock in children. Hypotension is a LATE sign indicating decompensated shock and imminent arrest",
      "A quiet, lethargic child who was previously active is MORE concerning than a screaming, crying child  -  crying requires energy and an intact airway",
      "Never examine the throat of a child with suspected epiglottitis  -  this can cause complete airway obstruction. Keep the child calm, in a position of comfort (usually sitting upright on parent's lap)",
      "Fever in a neonate (<28 days) is ALWAYS an emergency  -  assume sepsis until proven otherwise, even if the baby 'looks fine'",
      "Trust parental intuition: 'My child isn't acting right' is a clinically significant finding that warrants thorough assessment"
    ],
    preTest: [
      {
        question: "A pediatric nurse is assigned four patients. Which should be assessed FIRST?",
        options: [
          "A 5-year-old with a fractured arm waiting for casting",
          "A 2-month-old with a temperature of 38.5°C",
          "A 10-year-old with type 1 diabetes and a blood glucose of 200 mg/dL",
          "An 8-year-old with appendicitis awaiting surgery, pain controlled"
        ],
        correct: 1,
        rationale: "Fever in an infant under 3 months old is always a medical emergency requiring immediate evaluation for sepsis. Even if the infant appears well, the immature immune system cannot localize infections, and sepsis can progress rapidly."
      },
      {
        question: "Which pediatric patient presentation is MOST concerning?",
        options: [
          "A 3-year-old crying loudly and clinging to their parent",
          "A 3-year-old who is limp, lethargic, and not responding to their parent's voice",
          "A 3-year-old who refuses to eat lunch but is playing with toys",
          "A 3-year-old with a runny nose and mild cough"
        ],
        correct: 1,
        rationale: "A lethargic child who is not responding to stimulation is critically ill. In pediatrics, a quiet, limp child is far more concerning than a crying child. Crying requires energy, an intact airway, and adequate perfusion  -  lethargy suggests severe illness."
      },
      {
        question: "The MOST common cause of cardiac arrest in children is:",
        options: ["Congenital heart disease", "Cardiac arrhythmia", "Respiratory failure", "Trauma"],
        correct: 2,
        rationale: "Unlike adults where cardiac arrest is usually cardiac in origin, pediatric cardiac arrest is most commonly caused by respiratory failure progressing to hypoxic cardiac arrest. This is why respiratory distress in children is always the highest priority."
      }
    ],
    postTest: [
      {
        question: "A nurse in a pediatric unit must prioritize care. Which child is seen FIRST?",
        options: [
          "A 4-year-old with croup who has developed stridor at rest and is drooling",
          "A 6-year-old with stable asthma due for scheduled nebulizer treatment",
          "A 12-year-old with a newly applied cast reporting tingling in fingers",
          "An 8-year-old with gastroenteritis tolerating oral fluids"
        ],
        correct: 0,
        rationale: "Stridor at rest with drooling in a child with croup suggests severe airway obstruction or possible epiglottitis  -  a life-threatening emergency. The child with tingling requires assessment for compartment syndrome (neurovascular check), but the airway emergency takes priority."
      },
      {
        question: "A child post-tonsillectomy is swallowing frequently. The nurse should:",
        options: [
          "Offer the child ice chips to soothe the throat",
          "Recognize this as a possible sign of post-operative hemorrhage and assess immediately",
          "Document the finding and reassess in 30 minutes",
          "Encourage the child to spit out saliva instead of swallowing"
        ],
        correct: 1,
        rationale: "Frequent swallowing post-tonsillectomy is an early sign of hemorrhage  -  the child is swallowing blood running down the posterior pharynx. This requires immediate assessment including checking the throat with a flashlight, vital signs, and notification of the surgeon."
      },
      {
        question: "Hypotension in a pediatric patient indicates:",
        options: [
          "Early compensated shock  -  begin monitoring",
          "A normal variation that resolves on its own",
          "Late decompensated shock  -  intervene immediately",
          "The need for a repeat blood pressure measurement"
        ],
        correct: 2,
        rationale: "Children compensate for shock through tachycardia and vasoconstriction, maintaining normal blood pressure until 25-30% of blood volume is lost. When hypotension occurs, it indicates decompensated shock  -  the child is in imminent danger of cardiac arrest."
      }
    ],
    quiz: [
      {
        question: "In pediatric prioritization, which physiological difference is MOST important to consider?",
        options: [
          "Children have higher blood pressure than adults",
          "Children maintain blood pressure until late in shock, making tachycardia the first sign",
          "Children rarely develop respiratory distress",
          "Pediatric vital sign ranges are the same as adult ranges"
        ],
        correct: 1,
        rationale: "Children compensate for hypovolemia through tachycardia and vasoconstriction, maintaining a normal blood pressure until they have lost 25-30% of their circulating volume. This makes tachycardia the earliest and most important sign of shock in pediatrics."
      }
    ]
  },

  "delegation-traps-exam": {
    title: "Delegation Traps: Common Exam Pitfalls",
    cellular: {
      title: "Understanding Delegation Errors in Licensure",
      content: "Delegation questions are among the most frequently tested topics On the licensing exam, and nursing licensure examinations. These questions evaluate the nurse's understanding of scope of practice, legal accountability, and clinical judgment in assigning tasks. Common exam traps exploit misunderstandings about what can be delegated, to whom, and under what circumstances.\n\nThe Five Rights of Delegation provide the legal and clinical framework:\n1. Right Task: The task is within the delegate's scope and competency. Not all nursing tasks can be delegated. Assessment, evaluation, nursing judgment, care planning, patient education about disease processes, and administration of medications requiring nursing judgment (IV push, blood products) CANNOT be delegated to unlicensed assistive personnel (UAP).\n\n2. Right Circumstance: The patient's condition is stable and predictable. Patients with unstable vital signs, changing conditions, or complex care needs should NOT have care delegated to UAP. The key word is PREDICTABLE  -  if the outcome of the task is uncertain, the nurse should perform it.\n\n3. Right Person: The delegate has the appropriate training, competency, and licensure. An LPN/LVN can perform tasks within LPN scope (stable patient assessments, routine medication administration, wound care). A UAP can perform ADLs, vital signs, I&O measurement, and basic tasks that do not require nursing judgment.\n\n4. Right Direction/Communication: Clear, specific instructions are given including what to do, when to report, and what to observe. 'Check on the patient' is insufficient  -  'Take vital signs every 15 minutes and report if systolic BP drops below 100 or pulse exceeds 120' is appropriate direction.\n\n5. Right Supervision: The delegating nurse maintains accountability and follows up on delegated tasks. Delegation does NOT transfer accountability  -  the nurse remains responsible for patient outcomes.\n\nCommon exam traps:\n- Delegating ASSESSMENT to UAP (UAP can collect data such as vital signs, but cannot interpret or assess)\n- Confusing LPN/LVN scope with UAP scope (LPNs can perform many more tasks including medication administration)\n- Delegating tasks to the 'most experienced' UAP when the task itself is outside UAP scope regardless of experience\n- Choosing to 'do it yourself' when delegation IS appropriate (this wastes RN time and reduces patient safety)\n- Delegating to a float nurse without considering their competency in the specific unit's patient population"
    },
    riskFactors: [
      "Failure to understand scope of practice boundaries (RN vs LPN vs UAP)",
      "Delegating assessment, evaluation, or nursing judgment to non-licensed personnel",
      "Delegating tasks for unstable or unpredictable patients to UAP",
      "Insufficient communication when delegating (vague instructions, no parameters for reporting)",
      "Failing to supervise or follow up on delegated tasks",
      "Assuming competency without verification (float pool staff, new hires, agency nurses)",
      "Over-delegating: assigning too many tasks to one person, compromising safety",
      "Under-delegating: performing all tasks yourself instead of appropriately using team members"
    ],
    diagnostics: [
      "Identify the task: Is it within the delegate's legal scope of practice?",
      "Assess the patient: Is the condition stable and predictable?",
      "Assess the delegate: Does this person have the training and competency?",
      "Evaluate the environment: Are adequate resources and support available?",
      "Review organizational policies: Does the facility policy support this delegation?",
      "Consider state/provincial regulations: Delegation authority varies by jurisdiction"
    ],
    management: [
      "RN CANNOT delegate: Initial assessment, care planning, patient education about disease/treatment, evaluation of care outcomes, IV medication administration, blood product administration, receiving physician orders",
      "RN CAN delegate to LPN: Stable patient assessments (ongoing, not initial), oral/SubQ/IM medication administration, wound care, catheter care, suctioning, tracheostomy care for stable patients",
      "RN CAN delegate to UAP: Vital signs on stable patients, ADLs (bathing, feeding, toileting), ambulation, I&O measurement, specimen collection, comfort measures, post-mortem care",
      "NEVER delegate: Anything involving nursing judgment or clinical decision-making to unlicensed personnel",
      "Always delegate with clear parameters: what to do, what to report, when to report, expected outcomes",
      "Follow up on ALL delegated tasks  -  delegation does not transfer accountability"
    ],
    nursingActions: [
      "Before delegating, ask: 'Can this task be safely performed by someone other than an RN?'",
      "Provide clear, measurable instructions: 'Report if systolic BP <100 or >180, HR <60 or >110, RR <12 or >24'",
      "Check in with delegates at planned intervals to verify task completion and patient status",
      "Document what was delegated, to whom, what instructions were given, and follow-up findings",
      "If a delegated task was not performed correctly, provide immediate feedback and re-education",
      "Intervene immediately if a delegate is performing a task beyond their scope or competency"
    ],
    signs: {
      left: [
        "EXAM TRAP: 'The experienced UAP can assess the patient'  -  Experience does NOT change scope. UAP cannot assess, only collect data",
        "EXAM TRAP: 'Delegate the newly admitted patient to the LPN'  -  Initial assessments are RN-only responsibilities",
        "EXAM TRAP: 'The UAP can reinforce teaching about medications'  -  UAP can reinforce ONLY pre-established, simple education. Medication teaching requires nursing judgment",
        "EXAM TRAP: 'Delegate the stable tracheostomy suction to the new grad RN'  -  Consider if the new grad has demonstrated competency first"
      ],
      right: [
        "CORRECT: 'Delegate vital signs and ambulation of stable post-op day 2 patient to the UAP'",
        "CORRECT: 'Assign the LPN to administer oral medications to stable patients'",
        "CORRECT: 'The nurse performs the initial assessment on all newly admitted patients'",
        "CORRECT: 'The nurse evaluates the effectiveness of pain medication  -  this cannot be delegated'"
      ]
    },
    medications: [
      {
        name: "Medication Administration Delegation Rules",
        type: "Legal Framework",
        action: "RNs can delegate oral, SubQ, and IM medications to LPNs for stable patients. UAPs generally CANNOT administer medications (exceptions vary by state/province for trained medication aides in long-term care)",
        sideEffects: "Legal liability if medication errors occur due to improper delegation",
        contra: "Never delegate: IV push medications, blood products, chemotherapy, first-time doses of high-alert medications, medications requiring nursing assessment before/after administration",
        pearl: "Even when an LPN administers medications, the nurse is responsible for evaluating the therapeutic and adverse effects. The nurse must follow up on the patient's response."
      }
    ],
    pearls: [
      "UAP can COLLECT data (vital signs, I&O) but cannot INTERPRET or ASSESS data. The distinction is critical for exam questions",
      "The most experienced UAP still cannot perform tasks outside UAP scope  -  experience does not expand legal scope of practice",
      "When in doubt on an exam, choose the answer that keeps assessment, evaluation, and nursing judgment with the RN",
      "Delegation is a TWO-WAY accountability: the nurse is accountable for the delegation decision; the delegate is accountable for performing the task correctly",
      "'Stable and predictable' are the key words for delegation eligibility  -  if either word doesn't apply, the nurse should perform the task",
      "On exams, watch for the answer that says 'do it yourself' when delegation IS appropriate  -  appropriate delegation is part of effective nursing practice"
    ],
    preTest: [
      {
        question: "Which task can the nurse delegate to the UAP?",
        options: [
          "Assess a patient's lung sounds after nebulizer treatment",
          "Measure and record intake and output for a stable patient",
          "Evaluate the effectiveness of a pain medication",
          "Administer a scheduled oral medication"
        ],
        correct: 1,
        rationale: "Measuring and recording I&O is data collection, not assessment or evaluation, and is within UAP scope for stable patients. Lung sound assessment, medication effectiveness evaluation, and medication administration all require nursing judgment or licensure."
      },
      {
        question: "An RN delegates vital signs for a post-operative patient to the UAP. Which instruction demonstrates PROPER delegation?",
        options: [
          "Check vitals when you get a chance",
          "Take vital signs every 2 hours and report systolic BP below 100 or pulse above 110",
          "Just keep an eye on the patient",
          "Do the vitals and let me know if anything seems off"
        ],
        correct: 1,
        rationale: "Proper delegation includes specific instructions: what to do (take vital signs), when (every 2 hours), and clear parameters for reporting (systolic BP <100, pulse >110). Vague instructions like 'when you get a chance' or 'if anything seems off' are insufficient."
      },
      {
        question: "Which statement about delegation is TRUE?",
        options: [
          "Delegation transfers accountability from the nurse to the delegate",
          "The most experienced UAP can perform assessments",
          "The nurse remains accountable for outcomes of delegated tasks",
          "LPNs can independently create nursing care plans"
        ],
        correct: 2,
        rationale: "Delegation NEVER transfers accountability. The nurse remains accountable for the decision to delegate, the appropriateness of the delegation, and the patient outcomes. Experience does not change scope, and care planning is an RN-only function."
      }
    ],
    postTest: [
      {
        question: "A charge nurse is making assignments. Which assignment is INAPPROPRIATE?",
        options: [
          "UAP: Bathe and ambulate a stable patient on post-op day 3",
          "LPN: Administer scheduled PO medications to stable patients",
          "UAP: Perform initial assessment on a newly admitted patient",
          "RN: Receive a patient from the PACU and perform the admission assessment"
        ],
        correct: 2,
        rationale: "Initial assessments are ALWAYS an RN responsibility and cannot be delegated to UAP regardless of experience. The other assignments are within appropriate scope."
      },
      {
        question: "An RN delegates wound care for a stable patient to an LPN. The LPN discovers the wound has significantly deteriorated with new necrotic tissue. The CORRECT action is:",
        options: [
          "The LPN treats the wound according to the current care plan",
          "The LPN informs the RN, who then reassesses the wound and modifies the care plan",
          "The LPN calls the provider directly to change the wound care orders",
          "The LPN documents the finding and continues with the shift"
        ],
        correct: 1,
        rationale: "When a delegated task reveals a change in patient status, the LPN must report to the nurse for reassessment. The nurse evaluates the wound, modifies the care plan as needed, and communicates with the provider. The LPN identified a significant change that requires RN assessment and clinical judgment."
      },
      {
        question: "Which delegation error is MOST commonly tested on licensing exams?",
        options: [
          "Delegating too many tasks to one person",
          "Delegating assessment or evaluation to UAP",
          "Failing to document delegated tasks",
          "Delegating tasks to float pool nurses"
        ],
        correct: 1,
        rationale: "The most common delegation trap on exams is delegating assessment or evaluation to UAP. This is because assessment and evaluation require nursing judgment, which is a core RN/LPN function that cannot be performed by unlicensed personnel regardless of training or experience."
      }
    ],
    quiz: [
      {
        question: "The Five Rights of Delegation include all of the following EXCEPT:",
        options: ["Right Task", "Right Circumstance", "Right Documentation", "Right Supervision"],
        correct: 2,
        rationale: "The Five Rights of Delegation are: Right Task, Right Circumstance, Right Person, Right Direction/Communication, and Right Supervision. Documentation is important but is not one of the Five Rights of Delegation."
      }
    ]
  },

  "unexpected-vs-expected": {
    title: "Unexpected vs Expected Findings: Clinical Red",
    cellular: {
      title: "Differentiating Normal from Abnormal Clinical",
      content: "One of the most critical clinical skills  -  and most frequently tested examination concepts  -  is the ability to distinguish between EXPECTED findings (normal responses to a condition, treatment, or procedure) and UNEXPECTED findings (abnormal responses that indicate complications, deterioration, or the need for immediate intervention).\n\nExpected findings are predictable responses that fall within the anticipated clinical course. They do not require urgent intervention, though they may require routine nursing management. Examples: incisional pain after surgery, mild swelling after a joint replacement, low-grade fever on post-op day 1 (atelectasis), bruising at an IV site after removal.\n\nUnexpected findings are deviations from the anticipated clinical course that may indicate complications requiring immediate assessment and intervention. They represent clinical red flags that should trigger the nurse to gather more data, notify the provider, and potentially initiate emergency protocols. Examples: sudden sharp chest pain in a post-op patient (PE), excessive bright red bleeding through a dressing, temperature >38.5°C with rigors, sudden confusion in a previously oriented patient.\n\nThe clinical reasoning process for differentiating expected vs. unexpected:\n1. Know the BASELINE: What is normal for this patient? What is their medical history? What procedure did they have?\n2. Know the TIMELINE: What findings are typical at this stage of recovery or illness? Post-op day 1 low-grade fever is expected; post-op day 5 high fever is not.\n3. Know the TREND: Is the finding improving, stable, or worsening? A gradual decrease in surgical drain output is expected; a sudden increase is not.\n4. Know the PATTERN: Does this finding fit the expected pattern for the condition? Colostomy output beginning on post-op day 2-3 is expected; absence of output by day 5 is not.\n5. Know the SEVERITY: Is the magnitude of the finding within expected limits? Mild incisional pain (4/10) controlled by prescribed analgesics is expected; severe pain (9/10) unresponsive to medication is not.\n\nExam strategy: When an exam question presents a clinical scenario and asks 'Which finding requires follow-up?' or 'Which finding should the nurse report immediately?'  -  the answer is ALWAYS the unexpected finding that deviates from the anticipated clinical course."
    },
    riskFactors: [
      "Failure to establish baseline assessment data for comparison",
      "Insufficient knowledge of expected post-procedure recovery timelines",
      "Normalizing abnormal findings in patients with chronic conditions",
      "Anchoring bias: focusing on the initial assessment and missing subsequent changes",
      "Handoff communication gaps: not receiving complete information about the patient's trajectory",
      "Alarm fatigue: desensitization to monitor alarms leading to delayed response",
      "Cognitive overload: managing too many patients simultaneously, missing subtle changes"
    ],
    diagnostics: [
      "Trend analysis: compare current findings to baseline and previous assessments",
      "Timeline matching: evaluate findings against expected recovery milestones",
      "Severity assessment: determine if the magnitude of the finding exceeds expected parameters",
      "Pattern recognition: identify clusters of findings that suggest a complication",
      "Lab value comparison: compare to previous results  -  look for trends, not just single values",
      "Physical assessment changes: compare current exam to admission and shift-to-shift assessments"
    ],
    management: [
      "EXPECTED findings: document, continue routine monitoring, provide comfort measures, educate patient",
      "UNEXPECTED findings: gather additional data, increase monitoring frequency, notify provider, prepare for intervention",
      "CRITICAL unexpected findings: initiate emergency protocols, call Rapid Response or Code, stay with patient",
      "Always compare current findings to baseline and expected trajectory before deciding urgency",
      "When uncertain, err on the side of reporting and further assessment",
      "Use SBAR format to communicate unexpected findings to providers clearly and concisely"
    ],
    nursingActions: [
      "Establish a thorough baseline assessment at the start of every shift and after every procedure",
      "Know expected recovery timelines for common surgical procedures and medical conditions",
      "Document ALL assessment findings  -  expected and unexpected  -  to establish a clear clinical trajectory",
      "Report unexpected findings IMMEDIATELY using SBAR communication",
      "Never 'normalize' an abnormal finding by attributing it to anxiety, pain, or a pre-existing condition without assessment",
      "Teach patients and families to report new symptoms or changes  -  they are often the first to notice"
    ],
    signs: {
      left: [
        "EXPECTED: Mild incisional pain (3-5/10) controlled with prescribed analgesics after surgery",
        "EXPECTED: Low-grade fever (37.8-38.0°C) on post-op day 1-2 (atelectasis)",
        "EXPECTED: Serosanguineous drainage from a surgical wound in the first 24-48 hours",
        "EXPECTED: Decreased appetite and mild nausea after general anesthesia",
        "EXPECTED: Bruising and mild swelling at an IV site after removal",
        "EXPECTED: Sore throat and hoarseness after endotracheal intubation"
      ],
      right: [
        "UNEXPECTED: Sudden sharp chest pain with dyspnea in a post-op patient (suspect PE)",
        "UNEXPECTED: Bright red blood soaking through surgical dressing (hemorrhage)",
        "UNEXPECTED: High fever (>38.5°C) with rigors and altered mental status (sepsis)",
        "UNEXPECTED: Absent bowel sounds on post-op day 4-5 (prolonged ileus, possible obstruction)",
        "UNEXPECTED: New-onset confusion in a previously oriented patient (stroke, sepsis, medication reaction)",
        "UNEXPECTED: Sudden increase in surgical drain output or change from serosanguineous to frank blood"
      ]
    },
    medications: [
      {
        name: "Clinical Decision-Making Framework",
        type: "Assessment Tool",
        action: "Expected findings require routine monitoring; unexpected findings require immediate assessment, notification, and potential intervention",
        sideEffects: "Failure to recognize unexpected findings can lead to delayed treatment and patient harm",
        contra: "Never assume a finding is expected without completing a thorough assessment and comparing to baseline",
        pearl: "The question 'Is this EXPECTED at this point in the patient's clinical course?' should guide every assessment decision. If the answer is NO or you're uncertain, report immediately."
      }
    ],
    pearls: [
      "On exams, 'Which finding requires the nurse to notify the provider?' = the UNEXPECTED finding that deviates from normal recovery",
      "The timeline matters: low-grade fever on post-op day 1 is expected (Wind/atelectasis). Fever on day 5-7 is unexpected (Wound infection, DVT)",
      "Any SUDDEN onset of symptoms (pain, dyspnea, confusion, bleeding) is almost always unexpected and requires immediate action",
      "Trust the data: compare current assessment to baseline. If something changed, investigate  -  even if the patient 'looks fine'",
      "Expected does NOT mean unimportant  -  expected findings still require documentation, monitoring, and appropriate nursing interventions",
      "When an exam gives you four findings and asks which one to report, three will be expected and one will be the clinical red flag"
    ],
    preTest: [
      {
        question: "A patient is post-op day 1 after a total knee replacement. Which finding is UNEXPECTED and requires follow-up?",
        options: [
          "Pain of 5/10 at the surgical site",
          "Temperature of 37.9°C",
          "Moderate swelling around the knee",
          "Numbness and tingling in the toes of the affected leg"
        ],
        correct: 3,
        rationale: "Numbness and tingling in the toes indicates possible neurovascular compromise (compartment syndrome, nerve compression, or circulatory impairment) and requires immediate assessment and notification. Post-op pain, low-grade fever, and knee swelling are all expected after knee replacement surgery."
      },
      {
        question: "A patient had a cardiac catheterization 4 hours ago. Which finding should be reported IMMEDIATELY?",
        options: [
          "Mild bruising at the catheter insertion site",
          "Soft, pulsatile mass at the groin insertion site",
          "Patient reports mild back pain from lying flat",
          "Blood pressure of 128/78 mmHg"
        ],
        correct: 1,
        rationale: "A soft, pulsatile mass at the catheter insertion site indicates a pseudoaneurysm  -  a serious vascular complication requiring immediate intervention. Mild bruising, back pain from bed rest, and normal BP are all expected findings."
      },
      {
        question: "Which post-operative finding is EXPECTED on day 1?",
        options: [
          "Absent bowel sounds",
          "Bright red blood soaking through the dressing",
          "Sudden onset severe headache",
          "SpO2 of 99% on room air"
        ],
        correct: 0,
        rationale: "Absent or hypoactive bowel sounds on post-op day 1 are expected due to the effects of anesthesia and surgical manipulation on the GI tract. Normal bowel sounds typically return within 24-72 hours. The other findings are abnormal and require immediate attention."
      }
    ],
    postTest: [
      {
        question: "A patient with a chest tube has fluctuation (tidaling) in the water-seal chamber. This finding is:",
        options: [
          "Unexpected  -  notify the provider immediately",
          "Expected  -  this indicates the system is functioning properly",
          "Expected only if the patient is on mechanical ventilation",
          "Unexpected  -  the chest tube is malfunctioning"
        ],
        correct: 1,
        rationale: "Fluctuation (tidaling) in the water-seal chamber during respiration is an EXPECTED finding indicating the chest tube system is patent and functioning properly. Absence of tidaling would be unexpected and could indicate tube occlusion or lung re-expansion."
      },
      {
        question: "A post-thyroidectomy patient reports a tight sensation in the neck and tingling around the lips. This finding is:",
        options: [
          "Expected  -  normal swelling after neck surgery",
          "Unexpected  -  may indicate hypocalcemia from parathyroid damage and requires immediate assessment",
          "Expected  -  a side effect of anesthesia wearing off",
          "Not significant  -  offer the patient a throat lozenge"
        ],
        correct: 1,
        rationale: "Tingling around the lips (circumoral paresthesia) and a tight neck sensation after thyroidectomy are signs of hypocalcemia from accidental parathyroid gland removal or damage. This is a serious complication  -  check calcium levels, have IV calcium gluconate available, and assess for Chvostek's and Trousseau's signs."
      },
      {
        question: "Which assessment finding after a lumbar puncture requires immediate intervention?",
        options: [
          "Headache that worsens when sitting upright",
          "Mild back discomfort at the puncture site",
          "Clear fluid leaking from the puncture site with fever and neck stiffness",
          "Drowsiness from sedation medication"
        ],
        correct: 2,
        rationale: "Clear fluid leaking from the LP site with fever and neck stiffness suggests CSF leak with possible meningitis  -  a medical emergency. A positional headache is common after LP (expected), as is mild back discomfort and sedation-related drowsiness."
      }
    ],
    quiz: [
      {
        question: "The BEST approach to differentiating expected from unexpected findings is:",
        options: [
          "Rely on the patient's subjective complaints alone",
          "Compare current findings to baseline, expected timeline, and clinical trajectory",
          "Wait for lab results before making any judgment",
          "Ask a more experienced nurse to assess the patient"
        ],
        correct: 1,
        rationale: "Clinical reasoning requires comparing current findings against the patient's baseline, the expected timeline for their condition/procedure, and the overall clinical trajectory. This systematic approach is more reliable than any single data point."
      }
    ]
  },

  "acute-deterioration-recognition": {
    title: "Acute Deterioration Recognition",
    cellular: {
      title: "Clinical Deterioration and Failure-to-Rescue",
      content: "Clinical deterioration refers to an evolving process where a patient's physiological status worsens, progressing from compensated illness to organ dysfunction and potentially to cardiac arrest and death. Research consistently demonstrates that patients exhibit warning signs 6-24 hours BEFORE a cardiac arrest or ICU transfer, and that failure to recognize and act on these signs is a primary cause of preventable in-hospital deaths.\n\nThe concept of 'failure to rescue' describes the inability of healthcare providers to recognize and respond to clinical deterioration before it progresses to a critical event. Studies show that 60-80% of in-hospital cardiac arrests are preceded by identifiable deterioration in vital signs and clinical status within the preceding 8 hours.\n\nPhysiological cascade of deterioration:\n1. Compensatory Phase: The body activates compensatory mechanisms (tachycardia, tachypnea, vasoconstriction) to maintain perfusion. During this phase, blood pressure may remain NORMAL despite significant physiological stress. Subtle signs include mild tachycardia, anxiety, slight confusion, and decreased urine output.\n\n2. Progressive Phase: Compensatory mechanisms begin to fail. Heart rate continues to rise, respiratory effort increases, and end-organ perfusion decreases. Signs become more pronounced: increasing confusion, rising lactate, worsening tachycardia, diaphoresis, and mottled skin.\n\n3. Refractory Phase: Multi-organ dysfunction develops. Profound hypotension, severe metabolic acidosis, respiratory failure, and altered consciousness indicate imminent arrest. Without aggressive intervention, this phase rapidly progresses to cardiac arrest.\n\nEarly Warning Score (EWS) systems quantify deterioration risk by assigning point values to vital sign deviations. Parameters typically include heart rate, blood pressure, respiratory rate, temperature, oxygen saturation, and level of consciousness. A rising EWS score indicates increasing physiological instability and should trigger escalating levels of response.\n\nRapid Response Teams (RRT) / Medical Emergency Teams (MET) are hospital-based teams that respond to bedside nurses' concerns about deteriorating patients BEFORE cardiac arrest occurs. Activation criteria typically include: acute change in heart rate (<40 or >130), systolic BP <90, respiratory rate <8 or >28, SpO2 <90%, acute change in consciousness, or nursing staff concern ('worried about the patient').\n\nCritical concept: the nurse does NOT need to diagnose the problem to activate the Rapid Response Team. The presence of clinical deterioration and nursing concern is sufficient justification for activation."
    },
    riskFactors: [
      "Recent major surgery (within 24-72 hours)",
      "Admission from emergency department with acute illness",
      "Chronic comorbidities (COPD, heart failure, renal disease, diabetes, immunosuppression)",
      "Advanced age with limited physiological reserve",
      "Recent discharge from ICU (within 48 hours)  -  highest risk of re-deterioration",
      "History of previous cardiac arrest or ICU admission during this hospitalization",
      "Sepsis or suspected infection with systemic inflammatory response",
      "Patients receiving opioids or sedatives  -  risk of respiratory depression"
    ],
    diagnostics: [
      "Vital sign trends: Look at the TRAJECTORY, not just the single data point  -  worsening trends over hours are critical",
      "Early Warning Score (EWS/MEWS/NEWS): Calculate and track aggregate score changes over time",
      "Lactate level: >2 mmol/L suggests tissue hypoperfusion; >4 mmol/L indicates severe sepsis/shock",
      "Arterial blood gas: Assess acid-base status, oxygenation, and ventilation",
      "Point-of-care glucose: Rule out hypoglycemia as a cause of altered mental status",
      "Continuous pulse oximetry and cardiac monitoring for at-risk patients"
    ],
    management: [
      "Recognize early warning signs: rising heart rate, increasing respiratory rate, declining SpO2, new confusion, decreasing urine output",
      "Escalate immediately: do NOT wait for the patient to 'get worse' before calling for help",
      "Activate Rapid Response Team when criteria are met or when you are 'worried' about a patient",
      "ABCDE approach: Airway, Breathing, Circulation, Disability (neurological), Exposure (full assessment)",
      "Initiate immediate interventions within nursing scope: supplemental O2, IV access, position change, vital sign frequency increase",
      "Use SBAR to communicate findings: Situation, Background, Assessment, Recommendation"
    ],
    nursingActions: [
      "Monitor vital signs at minimum every 4 hours for stable patients; increase frequency for at-risk patients",
      "Calculate Early Warning Scores at every vital sign assessment  -  escalate based on score thresholds",
      "Trust your clinical intuition: 'I'm worried about this patient' is a VALID reason to activate the Rapid Response Team",
      "Document the TRAJECTORY of findings: 'HR has increased from 88 to 102 to 118 over the past 3 hours'",
      "Ensure IV access is maintained for at-risk patients  -  you'll need it if rapid intervention is required",
      "Brief the oncoming nurse about at-risk patients with specific parameters: 'Watch for HR >110, BP <100 systolic, any change in mental status'"
    ],
    signs: {
      left: [
        "EARLY WARNING: Heart rate gradually increasing (88 → 102 → 118) over hours",
        "EARLY WARNING: Respiratory rate increasing (16 → 22 → 28) without exertion",
        "EARLY WARNING: New onset restlessness, agitation, or subtle confusion",
        "EARLY WARNING: Urine output <0.5 mL/kg/hr for 2 consecutive hours",
        "EARLY WARNING: Patient expressing vague sense of 'something isn't right'"
      ],
      right: [
        "LATE/CRITICAL: Systolic BP <90 mmHg despite fluid resuscitation",
        "LATE/CRITICAL: SpO2 <90% despite supplemental oxygen",
        "LATE/CRITICAL: Unresponsive or only responsive to painful stimuli",
        "LATE/CRITICAL: Mottled, cyanotic, or ashen skin color",
        "LATE/CRITICAL: Agonal breathing or apnea  -  initiate Code Blue immediately"
      ]
    },
    medications: [
      {
        name: "Normal Saline (0.9% NaCl)",
        type: "Isotonic Crystalloid Fluid",
        action: "Volume expansion to restore intravascular volume and improve perfusion in hypotension and shock",
        sideEffects: "Fluid overload (crackles, JVD, peripheral edema), hyperchloremic metabolic acidosis with large volumes",
        contra: "Use cautiously in heart failure patients  -  risk of volume overload. Consider Lactated Ringer's as an alternative for large-volume resuscitation",
        pearl: "For acute deterioration with hypotension: 500-1000 mL bolus for adults, reassess after each bolus. Pediatrics: 20 mL/kg bolus, may repeat × 3."
      },
      {
        name: "Epinephrine",
        type: "Catecholamine / Vasopressor",
        action: "Alpha-1: vasoconstriction (raises BP). Beta-1: increased heart rate and contractility. Beta-2: bronchodilation",
        sideEffects: "Tachycardia, hypertension, arrhythmias, myocardial ischemia, anxiety, tremor",
        contra: "No absolute contraindications in cardiac arrest. In non-arrest situations: use cautiously with coronary artery disease, arrhythmias",
        pearl: "Cardiac arrest dose: 1 mg IV push every 3-5 minutes. Anaphylaxis: 0.3-0.5 mg IM (1:1000) into anterolateral thigh. NEVER give 1:1000 IV  -  this is a lethal dose."
      }
    ],
    pearls: [
      "60-80% of in-hospital cardiac arrests are preceded by identifiable warning signs 6-24 hours before the event",
      "Tachycardia is often the EARLIEST sign of deterioration  -  a rising heart rate trend is more important than any single reading",
      "You do NOT need to diagnose the problem to activate the Rapid Response Team. 'I'm concerned about my patient' is sufficient",
      "Respiratory rate is the most frequently abnormal vital sign before cardiac arrest and the most commonly missed or inaccurately recorded vital sign",
      "Never reassure yourself by a normal blood pressure alone  -  patients compensate until they can't, and then they crash rapidly",
      "If something feels wrong, ACT. The cost of a false alarm is infinitely less than the cost of failing to rescue"
    ],
    preTest: [
      {
        question: "A patient's heart rate has gradually increased from 84 to 108 over the past 4 hours. Blood pressure remains stable. The nurse should:",
        options: [
          "Document the findings and continue monitoring",
          "Recognize this as a possible early sign of deterioration and increase monitoring frequency while notifying the provider",
          "Attribute the tachycardia to anxiety and offer reassurance",
          "Administer a PRN anxiolytic medication"
        ],
        correct: 1,
        rationale: "A progressive increase in heart rate (trending upward over hours) is one of the earliest signs of clinical deterioration, even when blood pressure remains stable. This trend requires increased monitoring, assessment for underlying cause, and provider notification."
      },
      {
        question: "Which vital sign abnormality is most commonly the EARLIEST indicator of clinical deterioration?",
        options: ["Hypotension", "Bradycardia", "Tachycardia", "Hypothermia"],
        correct: 2,
        rationale: "Tachycardia is typically the earliest vital sign change in deterioration, as the heart rate increases to compensate for decreasing cardiac output, hypovolemia, infection, pain, or other physiological stressors. Hypotension is a LATE sign indicating decompensation."
      },
      {
        question: "What percentage of in-hospital cardiac arrests have identifiable warning signs in the preceding hours?",
        options: ["10-20%", "30-40%", "60-80%", "Less than 5%"],
        correct: 2,
        rationale: "Research consistently shows that 60-80% of in-hospital cardiac arrests are preceded by identifiable physiological deterioration within the preceding 6-24 hours. This underscores the critical importance of recognizing and acting on early warning signs."
      }
    ],
    postTest: [
      {
        question: "A post-surgical patient has a NEWS score that has increased from 3 to 7 over the past 6 hours. The nurse should:",
        options: [
          "Continue monitoring and recalculate in 4 hours",
          "Activate the Rapid Response Team and prepare for urgent intervention",
          "Ask the nursing assistant to recheck the vital signs",
          "Wait for the next scheduled provider rounds to discuss"
        ],
        correct: 1,
        rationale: "A rising Early Warning Score (from 3 to 7) indicates progressive clinical deterioration and should trigger escalation to the Rapid Response Team. Waiting for scheduled rounds or rechecking in 4 hours risks missing the window for effective intervention."
      },
      {
        question: "A nurse is 'worried' about a patient but cannot identify a specific clinical finding. The BEST action is:",
        options: [
          "Wait until objective findings appear before escalating",
          "Document concern in the chart and continue monitoring",
          "Activate the Rapid Response Team  -  nursing concern is a valid activation criterion",
          "Ask a colleague if they think the patient looks unwell"
        ],
        correct: 2,
        rationale: "Clinical intuition based on nursing experience is recognized as a valid criterion for Rapid Response Team activation. Most RRT activation protocols include 'staff member worried about the patient' as an explicit trigger. Early escalation saves lives."
      },
      {
        question: "In the physiological cascade of deterioration, what characterizes the COMPENSATORY phase?",
        options: [
          "Multi-organ dysfunction and refractory hypotension",
          "Tachycardia and tachypnea with maintained blood pressure",
          "Cardiac arrest and absence of pulse",
          "Profound metabolic acidosis and altered consciousness"
        ],
        correct: 1,
        rationale: "During the compensatory phase, the body activates mechanisms like tachycardia and tachypnea to maintain perfusion and blood pressure. Blood pressure remains normal despite physiological stress. This is the optimal time for intervention  -  before progression to decompensation."
      }
    ],
    quiz: [
      {
        question: "The Rapid Response Team should be activated when:",
        options: [
          "Only when a patient has a cardiac arrest",
          "When vital signs meet specific criteria OR the nurse is concerned about the patient",
          "Only after the attending physician has been notified",
          "Only during daytime hours when the full team is available"
        ],
        correct: 1,
        rationale: "The RRT should be activated whenever specific vital sign criteria are met (HR <40 or >130, SBP <90, RR <8 or >28, SpO2 <90%, acute mental status change) OR when the nurse has clinical concern about a patient. No physician order is needed."
      }
    ]
  },

  "medication-safety-prioritization": {
    title: "Medication Safety: Prioritization",
    cellular: {
      title: "Pharmacological Safety Systems",
      content: "Medication errors are one of the leading causes of preventable patient harm in healthcare, affecting an estimated 1.5 million patients annually in the United States alone. Understanding the systems, processes, and clinical reasoning behind medication safety is essential for every nurse.\n\nThe Eight Rights of Medication Administration form the foundation of safe practice:\n1. Right Patient: Verify using two patient identifiers (name and DOB or MRN). NEVER use room number as an identifier.\n2. Right Medication: Compare the medication to the order, checking drug name, formulation, and appearance.\n3. Right Dose: Verify the dose is appropriate for the patient's age, weight, and renal/hepatic function.\n4. Right Route: Confirm the route matches the order and is appropriate for the medication and patient.\n5. Right Time: Administer within the facility's time window (typically ±30 minutes of scheduled time).\n6. Right Documentation: Record administration immediately after giving the medication.\n7. Right Reason: Understand WHY the medication is ordered  -  does the indication match the patient's condition?\n8. Right Response: Evaluate the patient's response to the medication  -  is it producing the intended effect? Are there adverse effects?\n\nHigh-Alert Medications require additional safety checks because errors with these drugs can cause significant patient harm or death. The Institute for Safe Medication Practices (ISMP) identifies categories including:\n- Anticoagulants (heparin, warfarin, enoxaparin)\n- Insulin (all types)\n- Opioids (morphine, fentanyl, hydromorphone)\n- Concentrated electrolytes (potassium chloride, hypertonic saline)\n- Chemotherapy agents\n- Neuromuscular blocking agents\n\nSound-alike/Look-alike (SALA) medications are a major source of errors. Examples: metformin/metoprolol, hydromorphone/morphine, prednisone/prednisolone, celebrex/celexa. Strategies include tall-man lettering (hydrOXYzine vs. hydrALAzine), barcode verification, and independent double-checks.\n\nMedication reconciliation is the process of comparing a patient's current medication list with new orders at every transition of care (admission, transfer, discharge). Discrepancies must be resolved before medications are administered."
    },
    riskFactors: [
      "Polypharmacy (5+ medications)  -  increases risk of drug interactions and errors",
      "High-alert medications: insulin, anticoagulants, opioids, concentrated electrolytes",
      "Sound-alike/look-alike drug names (SALA)  -  metformin/metoprolol, hydromorphone/morphine",
      "Pediatric and geriatric patients  -  weight-based dosing errors, altered pharmacokinetics",
      "Renal or hepatic impairment  -  requires dose adjustments that may be overlooked",
      "Transitions of care (admission, transfer, discharge)  -  medication reconciliation gaps",
      "Verbal or telephone orders  -  high risk of miscommunication",
      "Interruptions during medication preparation and administration"
    ],
    diagnostics: [
      "Verify patient identity using TWO identifiers before EVERY medication administration",
      "Check medication against the MAR (Medication Administration Record) and original order",
      "Review allergies and cross-sensitivities before administering any new medication",
      "Check renal function (creatinine, GFR) for renally-cleared medications",
      "Check hepatic function (AST, ALT, bilirubin) for hepatically-metabolized medications",
      "Verify compatibility before mixing IV medications or running through the same line"
    ],
    management: [
      "Perform THREE checks: when retrieving the medication, when preparing it, and when administering it",
      "Use barcode scanning technology to verify the right patient and right medication",
      "Independent double-check for high-alert medications: two nurses independently verify dose, drug, and patient",
      "Use standardized concentrations for high-alert IV infusions to reduce calculation errors",
      "Implement medication reconciliation at every transition of care",
      "If a medication error occurs: assess the patient first, notify the provider, complete an incident report, and do NOT punish  -  foster a culture of reporting"
    ],
    nursingActions: [
      "NEVER administer a medication you are unfamiliar with  -  look it up first",
      "Check allergies before EVERY medication administration  -  ask the patient directly and check the chart",
      "Hold and clarify any order that seems inappropriate: wrong dose, wrong route, wrong frequency, or doesn't match diagnosis",
      "Report medication errors through the facility's incident reporting system  -  do NOT attempt to hide errors",
      "Educate patients about their medications: name, purpose, expected effects, and what to report",
      "When taking verbal or telephone orders: write the order, read it back, and receive confirmation (SBAR + read-back)"
    ],
    signs: {
      left: [
        "RED FLAG: Insulin dose that seems unusually high for the patient's glucose level and meal intake",
        "RED FLAG: Anticoagulant ordered without recent coagulation studies (PT/INR, aPTT)",
        "RED FLAG: Opioid dose that seems excessive for the patient's pain level or history (opioid-naive vs. tolerant)",
        "RED FLAG: Medication order that doesn't match the patient's diagnosis or clinical picture",
        "RED FLAG: Same medication ordered by two different routes or from two different providers (duplication)"
      ],
      right: [
        "SAFE PRACTICE: Independent double-check before administering insulin, heparin, or any high-alert medication",
        "SAFE PRACTICE: Calculate weight-based doses independently and verify with pharmacy for pediatric patients",
        "SAFE PRACTICE: Use tall-man lettering and barcode verification for SALA medications",
        "SAFE PRACTICE: Perform medication reconciliation at admission, transfer, and discharge",
        "SAFE PRACTICE: Document administration immediately after giving the medication, not before"
      ]
    },
    medications: [
      {
        name: "Heparin (Unfractionated)",
        type: "Anticoagulant  -  HIGH ALERT",
        action: "Inhibits thrombin and Factor Xa to prevent clot formation and extension",
        sideEffects: "Bleeding (most serious), heparin-induced thrombocytopenia (HIT), bruising",
        contra: "Active uncontrolled bleeding, severe thrombocytopenia, history of HIT",
        pearl: "ALWAYS verify the concentration (heparin comes in multiple strengths), use an infusion pump for continuous drips, monitor aPTT every 6 hours until therapeutic, and have protamine sulfate (the antidote) available."
      },
      {
        name: "Insulin (all types)",
        type: "Antidiabetic  -  HIGH ALERT",
        action: "Facilitates glucose uptake into cells, reducing blood glucose levels",
        sideEffects: "Hypoglycemia (most dangerous), weight gain, lipodystrophy at injection sites",
        contra: "Hypoglycemia (check glucose BEFORE administration), hypokalemia (insulin shifts potassium intracellularly)",
        pearl: "ALWAYS check blood glucose before administering insulin. Independent double-check required. Know the onset, peak, and duration of each type. Keep rapid-acting glucose (juice, glucose tablets) available. Insulin and potassium have a critical relationship  -  insulin drives K+ into cells."
      }
    ],
    pearls: [
      "The #1 rule of medication safety: If something doesn't seem right, STOP and CLARIFY before administering",
      "NEVER document medication administration before giving the medication  -  always document AFTER",
      "Independent double-checks for high-alert medications mean two nurses INDEPENDENTLY verify  -  not just co-signing",
      "If a patient says 'That doesn't look like my usual pill'  -  STOP and verify. Patients often know their medications better than we expect",
      "Medication errors are SYSTEM failures, not individual failures. Report all errors to improve the system. A culture of punishment leads to underreporting",
      "The most dangerous medication errors involve the 'wrong dose' of the 'right drug'  -  always double-check dosing calculations"
    ],
    preTest: [
      {
        question: "Which action demonstrates proper medication safety practice?",
        options: [
          "Documenting a medication before administering it to save time",
          "Performing an independent double-check before giving insulin",
          "Administering a medication prescribed by a provider even though the dose seems unusually high",
          "Using the patient's room number to verify identity"
        ],
        correct: 1,
        rationale: "Independent double-checks are required for high-alert medications like insulin. Documentation must occur AFTER administration, room numbers are never used for patient identification, and questionable doses must always be clarified before administration."
      },
      {
        question: "A patient tells the nurse, 'This pill looks different from what I usually take.' The nurse should:",
        options: [
          "Reassure the patient that the pharmacy filled it correctly",
          "Tell the patient that generic brands may look different and administer it",
          "Stop, verify the medication against the order and MAR, and investigate the discrepancy",
          "Ask the patient to take it anyway and report the concern later"
        ],
        correct: 2,
        rationale: "Patient concerns about medication appearance should ALWAYS be taken seriously. The nurse must stop, verify the medication against the order and MAR, and investigate any discrepancy before administering. Patients are often correct when they identify changes in their medications."
      },
      {
        question: "The Eight Rights of Medication Administration include all EXCEPT:",
        options: ["Right Patient", "Right Dose", "Right Room", "Right Response"],
        correct: 2,
        rationale: "The Eight Rights are: Right Patient, Right Medication, Right Dose, Right Route, Right Time, Right Documentation, Right Reason, and Right Response. 'Right Room' is NOT one of the rights  -  room numbers should never be used as patient identifiers."
      }
    ],
    postTest: [
      {
        question: "A nurse discovers they administered the wrong dose of heparin to a patient. The FIRST action is:",
        options: [
          "Complete an incident report immediately",
          "Assess the patient for signs of adverse effects",
          "Notify the pharmacy to correct the dose",
          "Wait until the next shift to report the error"
        ],
        correct: 1,
        rationale: "The first priority after any medication error is to ASSESS THE PATIENT for signs of adverse effects. After ensuring patient safety, the nurse then notifies the provider, administers any necessary treatment (e.g., protamine for heparin overdose), and completes an incident report."
      },
      {
        question: "Which medication combination requires the nurse to hold the medication and clarify with the provider?",
        options: [
          "Metformin and lisinopril",
          "Warfarin and aspirin with a new order for ibuprofen",
          "Acetaminophen and famotidine",
          "Levothyroxine and calcium given 4 hours apart"
        ],
        correct: 1,
        rationale: "A patient on warfarin AND aspirin receiving a new order for ibuprofen (NSAID) has a critically high bleeding risk. All three medications affect coagulation/hemostasis, and the combination significantly increases the risk of GI bleeding. This must be clarified with the provider."
      },
      {
        question: "A nurse receives a verbal order for 'hydralazine 25 mg IV.' The CORRECT procedure is:",
        options: [
          "Administer the medication immediately since verbal orders are acceptable in emergencies",
          "Write the order, read it back to the provider including drug name, dose, and route, and receive confirmation",
          "Ask another nurse to verify the order before administering",
          "Wait until the provider can enter the order into the computer system"
        ],
        correct: 1,
        rationale: "The proper procedure for verbal/telephone orders is: write the order, read it back to the provider (including drug name spelled out, dose, and route), and receive verbal confirmation. This read-back process reduces miscommunication errors."
      }
    ],
    quiz: [
      {
        question: "Which category of medications requires an independent double-check before administration?",
        options: ["Vitamins", "High-alert medications (insulin, heparin, opioids)", "Over-the-counter analgesics", "Topical ointments"],
        correct: 1,
        rationale: "High-alert medications (insulin, anticoagulants, opioids, concentrated electrolytes, chemotherapy) require an independent double-check because errors with these drugs can cause significant harm or death."
      }
    ]
  },

  "postop-complication-recognition": {
    title: "Post-Operative Complication Recognition",
    cellular: {
      title: "Systematic Assessment of Post-Surgical",
      content: "Post-operative complication recognition requires a systematic understanding of WHEN specific complications are most likely to occur, HOW they present, and WHAT the nurse must do immediately upon identification. Complications follow a predictable temporal pattern that should guide nursing assessment priorities at every stage of post-operative recovery.\n\nPhase 1: Immediate (0-24 hours)  -  Anesthesia and Surgical Risks\nThe immediate post-operative period is dominated by risks related to anesthesia recovery and the acute surgical insult. Airway compromise from residual neuromuscular blockade, emergence delirium, laryngospasm, and aspiration are the primary threats. Hemorrhage from surgical site bleeding manifests as increasing drain output, expanding hematoma, tachycardia, and falling blood pressure. Hypothermia from prolonged surgery and cold operating rooms can cause coagulopathy, shivering, and delayed metabolism of anesthetic agents.\n\nMalignant hyperthermia is a rare but life-threatening anesthesia complication caused by a genetic susceptibility to volatile anesthetics and succinylcholine. It presents with rapidly rising temperature (>40°C), muscle rigidity (especially masseter/jaw), tachycardia, hypercarbia, and metabolic/respiratory acidosis. Treatment is immediate cessation of triggering agents, administration of dantrolene sodium (2.5 mg/kg IV), active cooling, and supportive care.\n\nPhase 2: Early (24-72 hours)  -  Immobility and Inflammatory Response\nAtelectasis remains the #1 most common post-operative complication, caused by shallow breathing, pain-limited inspiratory effort, and prolonged supine positioning. It presents as low-grade fever (typically post-op day 1-2), diminished breath sounds at the lung bases, and mild tachypnea. Prevention (incentive spirometry, deep breathing, early ambulation) is far more effective than treatment.\n\nDeep vein thrombosis (DVT) begins forming during surgery from venous stasis, vessel injury, and hypercoagulability (Virchow's triad). Signs include unilateral calf pain, warmth, swelling, and positive Homans' sign (though this test has limited sensitivity). DVT can dislodge to cause pulmonary embolism (PE), most commonly on post-op days 5-7.\n\nPhase 3: Late (72 hours to weeks)  -  Healing and Systemic Complications\nWound infection typically presents 5-7 days post-operatively with erythema, warmth, induration, purulent drainage, and fever. Wound dehiscence (separation of wound layers) and evisceration (protrusion of abdominal organs) are emergencies typically occurring on post-op days 5-10, often precipitated by coughing, vomiting, or straining."
    },
    riskFactors: [
      "Prolonged surgical time (>3 hours increases all complication risks)",
      "Abdominal or thoracic surgery (highest risk for respiratory complications)",
      "Emergency surgery (limited pre-operative optimization)",
      "Obesity (BMI >30): increased risk of wound complications, DVT, and respiratory issues",
      "Diabetes mellitus: delayed healing, increased infection risk, glucose instability",
      "Current smoking: impaired wound healing, bronchospasm, atelectasis",
      "Immunosuppression (steroids, chemotherapy, HIV): increased infection susceptibility",
      "Pre-existing coagulopathy or anticoagulant therapy"
    ],
    diagnostics: [
      "Post-Op Fever Mnemonic (5 W's): Wind (atelectasis, day 1-2), Water (UTI, day 3-5), Wound (infection, day 5-7), Walking (DVT/PE, day 5-7), Wonder drugs (drug fever, anytime)",
      "Respiratory: auscultate breath sounds every shift, incentive spirometry volume tracking, SpO2 trending",
      "Circulatory: vital sign trends, surgical site assessment (color, drainage, approximation), drain output (amount, color, consistency)",
      "Gastrointestinal: bowel sound assessment, flatus passage, first bowel movement, tolerance of diet advancement",
      "Neurovascular: For orthopedic/vascular procedures  -  6 P's: Pain, Pallor, Pulselessness, Paresthesia, Paralysis, Poikilothermia",
      "Laboratory: CBC (hemoglobin trend for bleeding, WBC for infection), basic metabolic panel, coagulation studies as indicated"
    ],
    management: [
      "IMMEDIATE: Maintain airway, monitor for hemorrhage (HR, BP trends, drain output), manage pain while preventing respiratory depression",
      "EARLY: Incentive spirometry 10 breaths every 1-2 hours, early ambulation within 4-8 hours, DVT prophylaxis (SCDs, pharmacological)",
      "EARLY: Strict I&O monitoring, assess for urinary retention (bladder scan if no void within 6-8 hours)",
      "LATE: Assess wound healing trajectory, monitor for signs of infection, continue mobilization",
      "COMPLICATION: Hemorrhage  -  apply pressure, vitals every 5 minutes, notify surgeon, prepare for return to OR",
      "COMPLICATION: Evisceration  -  do NOT push organs back in, cover with sterile saline-moistened gauze, supine position with knees bent, NPO, notify surgeon STAT"
    ],
    nursingActions: [
      "Assess ABCs and level of consciousness immediately upon PACU arrival and at every assessment interval",
      "Monitor surgical site and drains: document output color, amount, and consistency every 1-4 hours depending on procedure",
      "Enforce cough, deep breathing, and incentive spirometry  -  educate patient about the importance of pulmonary toilet",
      "Assess pain using a validated scale and manage per protocol while monitoring for respiratory depression",
      "Promote early ambulation: dangle legs first, then stand, then ambulate with assistance  -  assess for orthostatic changes",
      "Report: increasing pain despite adequate analgesia, new tachycardia, fever > 38.5°C, excessive drain output, wound separation, absent pulses distal to surgical site"
    ],
    signs: {
      left: [
        "HEMORRHAGE: Tachycardia, hypotension, increasing drain output, saturated dressings, restlessness, pallor",
        "ATELECTASIS (Day 1-2): Low-grade fever, diminished breath sounds at bases, mild tachypnea",
        "DVT (Day 3-5): Unilateral calf pain, warmth, swelling, redness, positive Homans' sign",
        "WOUND INFECTION (Day 5-7): Erythema, warmth, induration, purulent drainage, elevated WBC, fever"
      ],
      right: [
        "PULMONARY EMBOLISM (Day 5-7): Sudden dyspnea, sharp chest pain, tachycardia, hypoxemia, anxiety",
        "PARALYTIC ILEUS: Absent bowel sounds, abdominal distension, nausea/vomiting, no flatus",
        "DEHISCENCE/EVISCERATION: Wound separation, 'popping' sensation, visible organs (evisceration)",
        "MALIGNANT HYPERTHERMIA: Rapid temp rise >40°C, muscle rigidity, tachycardia, hypercarbia"
      ]
    },
    medications: [
      {
        name: "Dantrolene Sodium (Dantrium)",
        type: "Skeletal Muscle Relaxant",
        action: "Inhibits calcium release from the sarcoplasmic reticulum, reversing the hypermetabolic state of malignant hyperthermia",
        sideEffects: "Muscle weakness, drowsiness, diarrhea, hepatotoxicity with prolonged use",
        contra: "No absolute contraindications when treating malignant hyperthermia (it is the definitive treatment)",
        pearl: "Dantrolene MUST be available in every OR suite. Initial dose: 2.5 mg/kg IV push, repeat every 5-10 minutes until symptoms resolve (max ~10 mg/kg). Reconstitution requires 60 mL sterile water per 20 mg vial  -  it takes time to prepare, so start early."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitively binds opioid receptors, reversing respiratory depression, sedation, and hypotension caused by opioid medications",
        sideEffects: "Acute opioid withdrawal (nausea, vomiting, diaphoresis, tachycardia), return of severe pain, pulmonary edema",
        contra: "Use cautiously in opioid-dependent patients  -  can precipitate severe withdrawal. Titrate to respiratory rate, not consciousness",
        pearl: "Post-op respiratory depression from opioids: give naloxone 0.04-0.4 mg IV, titrate to RR >12. Duration is shorter than most opioids (30-90 min)  -  patient may re-sedate. Monitor closely after administration."
      }
    ],
    pearls: [
      "Post-op fever mnemonic: Wind (Day 1-2), Water (Day 3-5), Wound (Day 5-7), Walking (Day 5-7), Wonder drugs (anytime)",
      "Atelectasis is the #1 most common post-op complication  -  prevention with incentive spirometry and early ambulation is essential",
      "If evisceration occurs: NEVER push organs back in. Cover with sterile saline-moistened gauze, position supine with knees bent, NPO, call surgeon STAT",
      "The 6 P's of neurovascular compromise: Pain (out of proportion), Pallor, Pulselessness, Paresthesia, Paralysis, Poikilothermia (cool extremity)",
      "Sudden dyspnea + chest pain + tachycardia on post-op day 5-7 = PE until proven otherwise",
      "Malignant hyperthermia is a genetic condition  -  always ask about family history of anesthesia complications"
    ],
    preTest: [
      {
        question: "Post-operative fever on day 1-2 is most commonly caused by:",
        options: ["Wound infection", "Pulmonary embolism", "Atelectasis", "Drug reaction"],
        correct: 2,
        rationale: "Atelectasis ('Wind' in the 5 W's mnemonic) is the most common cause of fever in the first 24-48 hours post-operatively. It results from shallow breathing and poor pulmonary expansion under anesthesia."
      },
      {
        question: "A patient's abdominal wound opens and intestine is visible. The nurse's FIRST action is:",
        options: [
          "Attempt to gently push the intestine back into the abdominal cavity",
          "Apply a dry sterile dressing and call the surgeon",
          "Cover the exposed organs with sterile saline-moistened gauze and call the surgeon STAT",
          "Take the patient's vital signs and document the finding"
        ],
        correct: 2,
        rationale: "Evisceration is a surgical emergency. Cover exposed organs with sterile saline-moistened gauze to prevent desiccation and contamination, position the patient supine with knees bent to reduce abdominal tension, ensure NPO status, and notify the surgeon immediately."
      },
      {
        question: "The definitive treatment for malignant hyperthermia is:",
        options: ["Acetaminophen", "Active cooling measures", "Dantrolene sodium IV", "Muscle relaxants"],
        correct: 2,
        rationale: "Dantrolene sodium is the specific antidote for malignant hyperthermia. It inhibits calcium release from the sarcoplasmic reticulum, stopping the hypermetabolic cascade. Cooling and supportive measures are adjunctive but not definitive."
      }
    ],
    postTest: [
      {
        question: "A patient on post-op day 6 develops sudden onset dyspnea and pleuritic chest pain. The nurse suspects:",
        options: ["Atelectasis", "Pneumonia", "Pulmonary embolism", "Anxiety attack"],
        correct: 2,
        rationale: "Sudden onset dyspnea with pleuritic (sharp, worsening with breathing) chest pain on post-op day 5-7 is highly suspicious for pulmonary embolism from DVT dislodgment. Immediate actions: high-flow oxygen, position HOB elevated, cardiac monitoring, and STAT notification."
      },
      {
        question: "On post-op day 3, a patient has absent bowel sounds and abdominal distension. The most likely cause is:",
        options: ["Small bowel obstruction", "Paralytic ileus", "Appendicitis", "Peritonitis"],
        correct: 1,
        rationale: "Paralytic ileus (temporary cessation of peristalsis) is an expected but monitored complication after abdominal surgery. Absent bowel sounds and distension on day 3 are consistent with ileus. Management includes NPO, NG suction if severe, and waiting for return of function."
      },
      {
        question: "What is the MOST reliable early indicator of post-operative hemorrhage?",
        options: [
          "Hypotension",
          "Pallor",
          "Increasing heart rate with restlessness",
          "Decreased hemoglobin"
        ],
        correct: 2,
        rationale: "Tachycardia with restlessness is an early compensatory response to blood loss. The heart rate increases to maintain cardiac output despite decreasing blood volume. Hypotension is a LATE sign indicating decompensation. Hemoglobin may not reflect acute blood loss for hours."
      }
    ],
    quiz: [
      {
        question: "Using the 5 W's mnemonic, a post-op fever on day 5 is most likely caused by:",
        options: ["Wind (atelectasis)", "Water (UTI)", "Wound (infection)", "Walking (DVT)"],
        correct: 2,
        rationale: "In the 5 W's mnemonic, 'Wound' corresponds to post-op days 5-7 and represents surgical site infection. The timeline is: Wind (day 1-2), Water (day 3-5), Wound (day 5-7), Walking (day 5-7), Wonder drugs (anytime)."
      }
    ]
  },

  "pediatric-vs-adult-priorities": {
    title: "Pediatric vs Adult Prioritization Differences",
    cellular: {
      title: "Developmental Physiology",
      content: "Effective clinical prioritization requires understanding the fundamental physiological differences between pediatric and adult patients. Children are NOT simply 'small adults'  -  they have distinct anatomy, physiology, pharmacokinetics, and communication patterns that significantly impact how clinical priorities are established.\n\nAirway Differences:\n- Pediatric airways are smaller, shorter, and more anterior. The larynx is higher (C3-C4 in infants vs C4-C5 in adults).\n- The airway is funnel-shaped in children (narrowest at cricoid) vs cylindrical in adults (narrowest at vocal cords).\n- The large tongue and occiput can cause airway obstruction when supine  -  use the 'sniffing position' for optimal airway alignment.\n- Infants are obligate nose breathers until 4-6 months  -  nasal congestion alone can cause respiratory distress.\n- Even 1 mm of edema in a pediatric airway causes 44% reduction in cross-sectional area (vs 19% in adults).\n\nBreathing Differences:\n- Children depend more on diaphragmatic breathing; abdominal processes can compromise ventilation.\n- Fewer alveoli and less surfactant in young children = less respiratory reserve.\n- Higher metabolic rate = higher oxygen consumption per kg = faster desaturation when compromised.\n- Respiratory failure is the #1 cause of cardiac arrest in children (vs cardiac causes in adults).\n\nCirculation Differences:\n- Higher resting heart rates: newborn 120-160, infant 100-150, toddler 90-130, school-age 70-110.\n- Cardiac output is heart-rate dependent in infants (limited ability to increase stroke volume).\n- Children compensate for shock through tachycardia and vasoconstriction  -  hypotension is a LATE ominous sign.\n- Blood volume is proportionally smaller: 80 mL/kg (vs 70 mL/kg in adults). A 5 kg infant has only 400 mL total blood volume  -  small losses are proportionally significant.\n\nNeurological Differences:\n- Open fontanelles in infants allow early detection of increased ICP (bulging) or dehydration (sunken).\n- Children may not exhibit classic signs of meningitis  -  irritability, poor feeding, and lethargy may be the only symptoms in infants.\n- Pain assessment requires age-appropriate tools (FLACC for infants/toddlers, Wong-Baker FACES for preschool-school age).\n\nFluid and Electrolyte Differences:\n- Higher body water percentage (70-80% in infants vs 60% in adults) = faster dehydration.\n- Higher metabolic rate = higher caloric and fluid requirements per kg.\n- Immature renal function in neonates = limited ability to concentrate urine or handle fluid overload."
    },
    riskFactors: [
      "Failure to use age-appropriate vital sign ranges (applying adult parameters to children)",
      "Underestimating the significance of tachycardia in pediatric patients",
      "Assuming hypotension is required for shock diagnosis in children",
      "Using adult medication doses without weight-based calculations",
      "Missing subtle behavioral cues in pre-verbal children (lethargy, poor feeding, decreased play)",
      "Delayed recognition of respiratory failure as a precursor to cardiac arrest",
      "Inadequate fluid resuscitation (not using weight-based bolus calculations)"
    ],
    diagnostics: [
      "ADULT: Cardiac monitoring and 12-lead ECG for chest pain, troponin levels, cardiac biomarkers",
      "PEDIATRIC: Pediatric Assessment Triangle (PAT) for rapid visual assessment; weight-based vital sign interpretation",
      "ADULT: GCS (Glasgow Coma Scale) for neurological assessment in trauma and altered consciousness",
      "PEDIATRIC: Modified GCS for children; fontanelle assessment in infants; FLACC pain scale for pre-verbal children",
      "ADULT: Standard vital sign ranges applied uniformly regardless of age",
      "PEDIATRIC: Age-specific vital sign ranges  -  a HR of 70 is normal for an adult but bradycardic for an infant"
    ],
    management: [
      "ADULT cardiac arrest: most commonly cardiac origin  -  defibrillation and cardiac drugs are primary interventions",
      "PEDIATRIC cardiac arrest: most commonly respiratory origin  -  restore ventilation and oxygenation FIRST",
      "ADULT shock: hypotension is an early/mid sign; fluid and vasopressor management",
      "PEDIATRIC shock: tachycardia is the first sign; fluid boluses 20 mL/kg (weight-based), repeat up to 3 times",
      "ADULT medication dosing: standard adult doses with renal/hepatic adjustment",
      "PEDIATRIC medication dosing: ALL doses weight-based (mg/kg), calculated individually, and double-checked"
    ],
    nursingActions: [
      "Always use age-appropriate vital sign reference charts when assessing pediatric patients",
      "Weigh ALL pediatric patients in KILOGRAMS upon admission and verify weight before any medication administration",
      "Use the PAT (Pediatric Assessment Triangle) for quick initial assessment: Appearance, Work of Breathing, Circulation to Skin",
      "Involve parents in assessment  -  they know their child's baseline behavior and can identify subtle changes",
      "Use age-appropriate pain assessment tools: FLACC (0-3 years), Wong-Baker FACES (3-8 years), numeric scale (8+ years)",
      "Calculate ALL fluid boluses and medication doses based on weight  -  never estimate or use 'standard' doses"
    ],
    signs: {
      left: [
        "ADULT Priority: Chest pain with ST elevation  -  activate cardiac cath lab",
        "ADULT Priority: Acute stroke symptoms  -  time-critical thrombolytic window",
        "ADULT Priority: Hemodynamic instability with hypotension",
        "ADULT Priority: Severe sepsis with lactate elevation and organ dysfunction"
      ],
      right: [
        "PEDIATRIC Priority: Respiratory distress with retractions and grunting  -  prevent respiratory arrest",
        "PEDIATRIC Priority: Tachycardia with poor perfusion  -  early compensated shock",
        "PEDIATRIC Priority: Behavioral change (active → lethargic)  -  indicates serious illness",
        "PEDIATRIC Priority: Fever in neonate (<28 days)  -  full sepsis workup mandatory"
      ]
    },
    medications: [
      {
        name: "Weight-Based Dosing Principle",
        type: "Pediatric Safety Standard",
        action: "All pediatric medications are dosed in mg/kg (or mcg/kg) based on actual body weight in kilograms",
        sideEffects: "Dosing errors are the #1 medication safety concern in pediatrics  -  overdose can be fatal, underdose can be ineffective",
        contra: "Never use adult standard doses for children. Never estimate weight  -  always weigh the child in kg",
        pearl: "The Broselow Tape is used in emergency situations to estimate weight and provide pre-calculated drug doses based on the child's length when actual weight cannot be obtained."
      }
    ],
    pearls: [
      "Children are NOT small adults  -  their physiology, pharmacology, and clinical presentations are fundamentally different",
      "In adults, cardiac arrest is usually cardiac in origin. In children, it's almost always respiratory  -  AIRWAY and BREATHING are paramount",
      "Tachycardia = first sign of shock in children. Hypotension = LATE sign meaning decompensation has occurred",
      "A quiet, lethargic child is MORE concerning than a screaming child  -  crying requires energy and an intact cardiorespiratory system",
      "1 mm of airway edema reduces a pediatric airway by 44% vs 19% in adults  -  small changes have huge impact",
      "Parental report of 'something is different about my child' is a clinically significant finding that warrants immediate assessment"
    ],
    preTest: [
      {
        question: "The PRIMARY cause of cardiac arrest in pediatric patients is:",
        options: ["Ventricular fibrillation", "Congenital heart defects", "Respiratory failure", "Trauma"],
        correct: 2,
        rationale: "Unlike adults where cardiac arrest is predominantly cardiac in origin (MI, arrhythmia), pediatric cardiac arrest most commonly results from progressive respiratory failure leading to hypoxic arrest. This makes respiratory assessment and intervention the highest priority in pediatrics."
      },
      {
        question: "A pediatric patient has a heart rate of 160 bpm. This finding is:",
        options: [
          "Always abnormal and requires immediate intervention",
          "Dependent on the child's age  -  it could be normal or abnormal",
          "Normal for all pediatric age groups",
          "Indicative of cardiac arrest"
        ],
        correct: 1,
        rationale: "Vital sign interpretation in pediatrics is AGE-DEPENDENT. A heart rate of 160 may be normal for a newborn (normal range 120-160) but tachycardic for a school-age child (normal range 70-110). Always reference age-appropriate vital sign ranges."
      },
      {
        question: "Hypotension in a pediatric patient with signs of shock indicates:",
        options: [
          "Early compensated shock  -  begin monitoring",
          "Decompensated shock  -  the child has lost 25-30% of blood volume",
          "A normal variation in children",
          "The need for repeat blood pressure measurement"
        ],
        correct: 1,
        rationale: "Children compensate for shock through tachycardia and vasoconstriction, maintaining normal blood pressure. When hypotension occurs, compensatory mechanisms have failed, indicating the child has lost approximately 25-30% of blood volume and is in decompensated shock."
      }
    ],
    postTest: [
      {
        question: "An infant has a sunken anterior fontanelle, decreased skin turgor, and dry mucous membranes. These findings indicate:",
        options: ["Meningitis", "Hydrocephalus", "Dehydration", "Normal newborn findings"],
        correct: 2,
        rationale: "Sunken fontanelle, decreased skin turgor, and dry mucous membranes are classic signs of dehydration in infants. The fontanelle provides a unique assessment opportunity in infants that does not exist in older children or adults."
      },
      {
        question: "Which statement about pediatric vs adult airway differences is CORRECT?",
        options: [
          "Pediatric airways are larger and more resistant to obstruction",
          "1 mm of airway edema causes the same reduction in both pediatric and adult airways",
          "1 mm of edema reduces a pediatric airway by approximately 44% vs 19% in adults",
          "Infants can breathe through their mouths as easily as through their noses"
        ],
        correct: 2,
        rationale: "Due to the smaller diameter of pediatric airways, 1 mm of circumferential edema causes a 44% reduction in cross-sectional area in infants vs only 19% in adults. This is why even mild croup can cause significant airway compromise in young children."
      },
      {
        question: "When prioritizing care for adult and pediatric patients simultaneously, the nurse should:",
        options: [
          "Always see adult patients first because they have more serious conditions",
          "Always see pediatric patients first because they deteriorate faster",
          "Prioritize based on clinical acuity and physiological stability regardless of age",
          "See patients in the order they were admitted"
        ],
        correct: 2,
        rationale: "Prioritization is always based on clinical acuity and physiological stability, regardless of the patient's age. The patient with the greatest risk of deterioration  -  whether adult or pediatric  -  is assessed first."
      }
    ],
    quiz: [
      {
        question: "Which assessment finding is available in infants but NOT in older children or adults?",
        options: ["Capillary refill time", "Fontanelle assessment", "Heart rate monitoring", "Respiratory rate counting"],
        correct: 1,
        rationale: "The anterior fontanelle remains open until approximately 12-18 months of age, providing a unique assessment tool. A bulging fontanelle suggests increased ICP (meningitis, hydrocephalus), while a sunken fontanelle indicates dehydration."
      }
    ]
  },

  "first-action-logic": {
    title: "First Action Logic: What to Do Before Calling",
    cellular: {
      title: "Nursing Autonomy",
      content: "One of the most challenging aspects of nursing practice  -  and one of the most frequently tested concepts on licensure examinations  -  is determining which actions the nurse should take INDEPENDENTLY before notifying the healthcare provider. This requires understanding the distinction between independent nursing interventions, collaborative interventions, and dependent interventions.\n\nIndependent nursing interventions are actions within the nurse's scope of practice that do NOT require a physician order. These are based on nursing assessment, knowledge, and clinical judgment. Examples include: positioning the patient (elevate HOB for dyspnea), applying oxygen (in emergencies), performing a focused assessment, initiating CPR, taking vital signs, applying pressure to a bleeding site, and implementing safety measures.\n\nCollaborative interventions require coordination between nursing and medical teams but may be initiated through standing orders or protocols. Examples include: activating a Rapid Response Team, implementing a sepsis bundle per protocol, and administering medications per PRN or protocol orders.\n\nDependent interventions require a specific provider order before the nurse can act. Examples include: starting new medications, performing invasive procedures, changing diet orders, and ordering diagnostic tests.\n\nThe exam logic for 'What should the nurse do FIRST?' follows a predictable pattern:\n1. If the patient is in immediate danger (ABC compromise): ACT FIRST, then notify the provider. Never delay life-saving intervention to make a phone call.\n2. If the patient needs assessment: ASSESS FIRST, then notify the provider with data. Never call a provider saying 'something is wrong' without assessment data.\n3. If the patient is stable but has a new finding: GATHER DATA FIRST (vitals, labs, focused assessment), then call the provider with complete information using SBAR.\n4. If the patient needs a new order: PREPARE first (have relevant data ready), then call the provider with a recommendation.\n\nCommon exam trap: An answer choice says 'Notify the healthcare provider' as the FIRST action. In most scenarios, this is INCORRECT unless the nurse has already assessed the patient and gathered data. The exception is when a life-threatening finding has already been identified and the nurse needs provider intervention beyond nursing scope (e.g., a medication to reverse the situation)."
    },
    riskFactors: [
      "Calling the provider without completing an assessment first (unprepared communication)",
      "Delaying independent nursing actions while waiting for provider callback",
      "Failing to act within nursing scope during emergencies (e.g., waiting for an order to apply O2)",
      "Not knowing which actions require orders vs which are independent nursing interventions",
      "Over-reliance on provider direction for routine nursing decisions",
      "Incomplete data collection before provider notification (missing vital signs, assessment findings)",
      "Calling at inappropriate times or through wrong channels (non-urgent pages for non-urgent findings)"
    ],
    diagnostics: [
      "Step 1: Is the patient in immediate danger (ABCs compromised)? → ACT immediately, then notify",
      "Step 2: Has the nurse completed a focused assessment? → If no, ASSESS first",
      "Step 3: Are vital signs current? → If no, obtain them before calling",
      "Step 4: Are relevant lab values available? → Check recent results to include in SBAR",
      "Step 5: What is the clinical picture? → Synthesize findings before communication",
      "Step 6: Does the nurse have a recommendation? → Formulate what you think is needed"
    ],
    management: [
      "EMERGENCY (ABCs compromised): Act first  -  position, oxygen, initiate CPR if needed, THEN notify provider",
      "ACUTE CHANGE (not immediately life-threatening): Assess, gather data, initiate within-scope interventions, then notify",
      "NEW FINDING (stable patient): Complete assessment, review recent labs, document, then notify with SBAR",
      "EXPECTED FINDING (within parameters): Document, continue monitoring, notify at next scheduled communication",
      "BEFORE calling: Know the patient's current vital signs, recent labs, medications, and allergies",
      "WHEN calling: Use SBAR format  -  be concise, have data ready, state your recommendation"
    ],
    nursingActions: [
      "ASSESS before calling: A provider cannot make decisions without data. 'My patient doesn't look right' is not SBAR",
      "ACT within scope during emergencies: Elevate HOB for dyspnea, apply O2, position patient, initiate CPR  -  these do NOT require orders",
      "PREPARE before calling: Have chart accessible, know recent vital sign trends, review relevant labs, have allergy information",
      "RECOMMEND when calling: State what you think is needed  -  'I recommend a STAT chest X-ray and ABG' is more effective than 'What do you want me to do?'",
      "DOCUMENT everything: assessment findings, interventions performed, provider notification time, orders received, patient response",
      "FOLLOW UP: After receiving orders, implement them promptly and reassess the patient's response"
    ],
    signs: {
      left: [
        "ACT FIRST: Patient not breathing → Position airway, initiate rescue breathing, call Code",
        "ACT FIRST: Patient actively seizing → Protect from injury, time the seizure, maintain airway",
        "ACT FIRST: Acute chest pain → Position of comfort, apply O2, obtain 12-lead ECG, then call provider",
        "ACT FIRST: Active hemorrhage → Apply direct pressure, elevate extremity, then call provider",
        "ACT FIRST: Anaphylaxis → Administer epinephrine (per protocol/standing order), call Code"
      ],
      right: [
        "ASSESS FIRST: New-onset confusion → Check glucose, SpO2, vital signs, medication list, THEN call provider",
        "ASSESS FIRST: Patient reports increased pain → Assess location, quality, severity, timing, THEN call for orders",
        "ASSESS FIRST: Elevated blood pressure reading → Reassess (proper cuff, rested), check medication compliance, THEN call",
        "ASSESS FIRST: Patient reports dizziness → Check orthostatic vitals, assess for falls, review medications, THEN call",
        "ASSESS FIRST: Patient vomited → Assess frequency, characteristics, last meal, bowel sounds, THEN call for antiemetic"
      ]
    },
    medications: [
      {
        name: "Standing Order / Protocol Medications",
        type: "Pre-Authorized Interventions",
        action: "Medications pre-authorized by provider-approved protocols allow nurses to administer without individual patient orders for specific clinical scenarios",
        sideEffects: "Vary by medication  -  nurse must still know indications, contraindications, and adverse effects",
        contra: "Standing orders must match the clinical scenario exactly. If the patient's situation doesn't fit the protocol criteria, an individual order is required",
        pearl: "Common standing orders include: supplemental O2 for SpO2 <92%, acetaminophen for fever >38.5°C, insulin sliding scale for glucose management, epinephrine for anaphylaxis, and naloxone for opioid-induced respiratory depression."
      }
    ],
    pearls: [
      "On exams, 'Notify the healthcare provider' is rarely the FIRST action  -  assess and intervene within scope FIRST",
      "The exception: if the question states the nurse has already assessed and the findings require medical intervention beyond nursing scope",
      "In emergencies, you have standing authority to: maintain airway, apply O2, initiate CPR, apply pressure to bleeding, position for safety",
      "SBAR is the gold standard for provider communication: Situation, Background, Assessment, Recommendation",
      "A nurse who calls a provider and says 'I don't know what's wrong but the patient looks bad' has NOT prepared adequately",
      "Always end your SBAR with a recommendation  -  this demonstrates clinical judgment and often expedites appropriate orders"
    ],
    preTest: [
      {
        question: "A patient with dyspnea and SpO2 of 88% is in acute distress. The nurse's FIRST action is:",
        options: [
          "Notify the healthcare provider immediately",
          "Elevate the head of bed and apply supplemental oxygen",
          "Obtain a chest X-ray order",
          "Administer a PRN bronchodilator"
        ],
        correct: 1,
        rationale: "The first action is an independent nursing intervention: position the patient to optimize breathing (elevate HOB) and apply supplemental oxygen to address the hypoxemia. These actions do not require a provider order and should NOT be delayed while calling."
      },
      {
        question: "A nurse finds a post-surgical patient with a blood-soaked dressing. The FIRST action is:",
        options: [
          "Call the surgeon to report the bleeding",
          "Apply direct pressure to the site and assess vital signs",
          "Document the finding and continue monitoring",
          "Reinforce the dressing and wait for the surgeon's rounds"
        ],
        correct: 1,
        rationale: "The first action is to apply direct pressure (an independent nursing intervention to control bleeding) and assess vital signs. These actions address the immediate threat before notifying the surgeon with complete assessment data."
      },
      {
        question: "Before calling the provider about a patient with a new symptom, the nurse should have:",
        options: [
          "Only the patient's name and room number",
          "Current vital signs, recent labs, assessment findings, allergy information, and a recommendation",
          "Just a description of the patient's complaint",
          "The family's opinion about what is happening"
        ],
        correct: 1,
        rationale: "Effective provider communication requires preparation. The nurse should have current vital signs, relevant lab results, a focused assessment, allergy/medication information, and a recommendation ready before calling. This demonstrates clinical competence and facilitates efficient decision-making."
      }
    ],
    postTest: [
      {
        question: "A patient reports sudden severe headache rated 10/10 with blurred vision. BP is 220/130 mmHg. The nurse's FIRST action is:",
        options: [
          "Administer the patient's scheduled antihypertensive medication",
          "Reassess the blood pressure in 15 minutes",
          "Notify the provider STAT with assessment findings  -  this is a hypertensive emergency requiring medical intervention",
          "Encourage the patient to rest and offer acetaminophen for the headache"
        ],
        correct: 2,
        rationale: "This patient is in a hypertensive emergency (BP >180/120 with end-organ symptoms: headache, visual changes). The nurse has completed the assessment (vital signs, symptoms). This situation requires immediate medical intervention (IV antihypertensives) beyond nursing scope. Calling STAT is appropriate because the data has been gathered."
      },
      {
        question: "A patient is found on the floor after a fall. The FIRST action is:",
        options: [
          "Help the patient back to bed immediately",
          "Notify the provider that the patient fell",
          "Assess the patient for injuries before moving them",
          "Complete a fall incident report"
        ],
        correct: 2,
        rationale: "The first action after finding a fallen patient is ALWAYS to assess for injuries before moving the patient. Moving a patient with a potential spinal injury or fracture can cause further harm. After assessment, provide appropriate intervention, then notify the provider and complete documentation."
      },
      {
        question: "Which scenario requires the nurse to call the provider BEFORE acting?",
        options: [
          "A patient is having a seizure",
          "A patient needs a new antibiotic order for a confirmed infection",
          "A patient is choking and cannot speak",
          "A patient is having an anaphylactic reaction"
        ],
        correct: 1,
        rationale: "Ordering a new antibiotic is a dependent intervention that requires a physician order. The other scenarios (seizure, choking, anaphylaxis) are emergencies where the nurse acts FIRST within scope (protect from injury, Heimlich/back blows, epinephrine per protocol) and then notifies the provider."
      }
    ],
    quiz: [
      {
        question: "The general rule for 'What to do FIRST' on nursing exams is:",
        options: [
          "Always notify the provider first",
          "Always assess first, then act within scope, then notify the provider with data",
          "Always administer medication first",
          "Always document first"
        ],
        correct: 1,
        rationale: "The standard approach is: Assess the patient → Act within nursing scope (position, O2, safety measures) → Notify the provider with complete data (SBAR). The only exception is when the situation is beyond nursing scope and the assessment is already complete."
      }
    ]
  },

  "assignment-making-scenarios": {
    title: "Assignment Making: Matching Patient Acuity to",
    cellular: {
      title: "Principles of Patient Assignment Based on",
      content: "Assignment making is a critical charge nurse and team leader responsibility that requires matching patient needs to staff capabilities while maintaining safe, equitable workloads. Unlike delegation (assigning a specific task), assignment making involves allocating complete patient care responsibility to team members based on their licensure, competency, experience, and the patients' acuity levels.\n\nKey principles of safe assignment making:\n\n1. Match Acuity to Competency: The most complex, unstable patients should be assigned to the most experienced and competent nurses. New graduates, float pool nurses, and agency staff should receive patients with predictable, stable conditions that are within their demonstrated competency.\n\n2. Consider Continuity of Care: When possible, patients should be assigned to the same nurse they had on previous shifts. Continuity improves outcomes because the nurse knows the patient's baseline, trajectory, and family dynamics.\n\n3. Balance Workload: Assignment making is not just about patient numbers  -  it's about the cumulative complexity, acuity, and care demands. A nurse with two ICU patients may have a heavier workload than a nurse with five stable step-down patients.\n\n4. Geographic Considerations: When possible, assign patients in close proximity to reduce travel time and improve surveillance. This is especially important for patients requiring frequent monitoring.\n\n5. Skill Mix: Ensure each team has an appropriate mix of RNs, LPNs, and UAPs to meet patient needs. Consider which team members can handle which tasks based on scope and competency.\n\n6. Special Considerations: New admissions, discharges, and transfers create additional workload. Post-operative patients returning from the OR need immediate assessment. Patients requiring isolation add time for donning/doffing PPE.\n\nCommon assignment-making errors on exams:\n- Assigning an unstable patient to a float nurse unfamiliar with the unit\n- Giving a new graduate the most complex patient because they 'need to learn'\n- Overloading one nurse while another has a lighter assignment without justification\n- Assigning an LPN to a patient requiring initial assessment or care planning\n- Failing to consider pending admissions, discharges, or procedures in the workload"
    },
    riskFactors: [
      "Float or agency nurses unfamiliar with unit-specific patient populations and protocols",
      "New graduate nurses in orientation or early independent practice",
      "High patient-to-nurse ratios compromising safe care delivery",
      "Multiple admissions, discharges, and transfers (ADT) creating unpredictable workload shifts",
      "Patients requiring specialized skills (ventilator management, CRRT, complex wound care) assigned to nurses without demonstrated competency",
      "Inadequate staffing mix (too few RNs for the acuity of patients on the unit)",
      "Failure to account for non-direct care responsibilities (charge duties, precepting, orientation)"
    ],
    diagnostics: [
      "Classify patients by acuity: Critical (unstable, frequent interventions), Acute (active treatment, monitoring), Maintenance (stable, routine care), Discharge (preparing to leave)",
      "Assess staff capabilities: licensure level (RN, LPN, UAP), years of experience, unit-specific competencies, current patient knowledge",
      "Evaluate workload factors beyond patient count: procedures scheduled, pending admissions/discharges, isolation requirements, IV medication complexity",
      "Consider temporal factors: shift time, expected admissions/transfers, scheduled surgeries returning to the floor",
      "Review previous shift assignments for continuity of care opportunities",
      "Identify patients requiring specialized skills and match to qualified staff"
    ],
    management: [
      "MOST EXPERIENCED RN: Assign the most complex, unstable, or rapidly changing patients",
      "COMPETENT RN: Assign acute patients requiring active monitoring and multiple interventions",
      "NEW GRADUATE RN: Assign stable patients with predictable conditions and outcomes; provide access to experienced mentor",
      "FLOAT/AGENCY RN: Assign stable patients within their demonstrated competency; avoid unit-specific specialized patients",
      "LPN: Assign stable patients requiring routine care, medication administration, and ongoing monitoring (NOT initial assessment or care planning)",
      "UAP: Assign ADL care, vital signs, ambulation, and comfort measures for stable patients under RN supervision"
    ],
    nursingActions: [
      "As charge nurse, review ALL patient acuities before making assignments  -  do not assign based solely on room numbers or convenience",
      "Communicate assignment rationale to staff: 'You have Mrs. Johnson because she needs frequent neuro checks and you're our most experienced neuro nurse'",
      "Build flexibility into assignments to accommodate unexpected admissions or patient changes",
      "Check in with staff throughout the shift  -  redistribute if a patient's acuity changes significantly",
      "Pair new graduates or orientees with experienced staff for complex patients (buddy system)",
      "Document assignment decisions when they involve patient safety considerations"
    ],
    signs: {
      left: [
        "CORRECT Assignment: New post-op craniotomy patient → Most experienced neuro-certified RN",
        "CORRECT Assignment: Stable chronic heart failure patient, day 3 of admission → Competent RN or experienced LPN",
        "CORRECT Assignment: Patient awaiting discharge with completed teaching → New graduate RN",
        "CORRECT Assignment: Multiple stable patients needing ADLs, ambulation, vitals → UAP with RN oversight"
      ],
      right: [
        "INCORRECT Assignment: Unstable post-MI patient on heparin drip → Float nurse from psych unit",
        "INCORRECT Assignment: New admission requiring comprehensive assessment → LPN",
        "INCORRECT Assignment: Patient on ventilator in step-down → New graduate nurse on day 3 of orientation",
        "INCORRECT Assignment: Complex diabetic with insulin drip → Agency nurse unfamiliar with the insulin protocol"
      ]
    },
    medications: [
      {
        name: "Assignment Decision Framework",
        type: "Clinical Leadership Tool",
        action: "Systematic approach to matching patients with appropriate caregivers based on acuity, competency, and workload balance",
        sideEffects: "Poor assignments can lead to patient harm, staff burnout, and adverse outcomes",
        contra: "Never assign patients requiring specialized skills to staff without demonstrated competency, regardless of staffing pressures",
        pearl: "The charge nurse is responsible for appropriate assignments. If staffing is inadequate for safe care, this must be escalated to nursing leadership with documentation of the concern and potential impact on patient safety."
      }
    ],
    pearls: [
      "Assignment making is about COMPETENCY, not just convenience. The goal is to match patient needs to staff capabilities",
      "A float nurse should NEVER receive the most complex patients on the unit  -  they lack unit-specific knowledge and familiarity with protocols",
      "New graduates need stable, predictable patients  -  not complex ones 'to learn from.' Learning occurs with appropriate support, not trial by fire",
      "LPNs cannot perform initial assessments, create care plans, or administer IV push medications. Assignment must reflect these scope limitations",
      "Continuity of care improves outcomes  -  assign the same nurse to the same patient across shifts whenever possible",
      "When an exam question asks 'Which patient should be assigned to the float nurse?'  -  the answer is always the most STABLE patient"
    ],
    preTest: [
      {
        question: "The charge nurse is making assignments. Which patient should be assigned to the float nurse from the rehabilitation unit?",
        options: [
          "A patient on a heparin drip requiring frequent aPTT monitoring",
          "A newly admitted patient requiring a comprehensive assessment",
          "A stable post-op day 3 patient preparing for discharge",
          "A patient returning from cardiac catheterization requiring neurovascular checks"
        ],
        correct: 2,
        rationale: "The float nurse should receive the most stable, predictable patient. A post-op day 3 patient preparing for discharge has predictable care needs within any nurse's competency. The other patients require unit-specific expertise or skills the float nurse may not have."
      },
      {
        question: "Which assignment is INAPPROPRIATE for an LPN?",
        options: [
          "Administering oral medications to stable patients",
          "Performing a wound dressing change on a chronic wound",
          "Completing the admission assessment for a new patient",
          "Monitoring vital signs for patients on the unit"
        ],
        correct: 2,
        rationale: "Initial admission assessments are an RN-only responsibility and cannot be assigned to an LPN. The LPN can perform ongoing assessments for stable patients, administer medications (PO, SubQ, IM), and perform wound care within their scope."
      },
      {
        question: "The charge nurse should assign the MOST experienced RN to:",
        options: [
          "The patient scheduled for discharge this afternoon",
          "The patient with a stable chronic condition on day 4 of admission",
          "The newly admitted patient with acute respiratory failure on BiPAP",
          "The patient requesting assistance with ADLs"
        ],
        correct: 2,
        rationale: "The most experienced nurse should care for the most complex, unstable patient. Acute respiratory failure on BiPAP requires expert-level monitoring, rapid intervention capability, and the ability to recognize and respond to subtle changes in the patient's respiratory status."
      }
    ],
    postTest: [
      {
        question: "During the shift, a nurse's patient rapidly deteriorates and requires ICU transfer. The charge nurse should:",
        options: [
          "Tell the nurse to manage the situation until the ICU accepts the patient",
          "Redistribute the nurse's remaining patients to other staff and assist with the deteriorating patient",
          "Call the supervisor and wait for instructions",
          "Ask the deteriorating patient's family to help monitor other patients"
        ],
        correct: 1,
        rationale: "The charge nurse must actively manage the situation by redistributing patients to ensure the deteriorating patient receives focused attention while other patients' care continues safely. Flexible assignment management during crises is a core charge nurse competency."
      },
      {
        question: "A new graduate RN is 2 weeks into independent practice. Which assignment is MOST appropriate?",
        options: [
          "The patient on a ventilator who is being weaned",
          "Two stable patients with chronic conditions receiving routine treatments",
          "The patient returning from emergency surgery with multiple drains",
          "The critically ill patient receiving multiple IV drips"
        ],
        correct: 1,
        rationale: "A new graduate in early independent practice should be assigned stable, predictable patients whose care needs are within their developing competency. This allows them to build confidence and skills while maintaining patient safety. Complex patients should be assigned to more experienced nurses."
      },
      {
        question: "The charge nurse has 4 RNs, 1 LPN, and 2 UAPs for 20 patients. Which factor is MOST important when making assignments?",
        options: [
          "Ensuring each nurse has exactly the same number of patients",
          "Matching patient acuity and care needs to each staff member's scope and competency",
          "Assigning patients by room number for geographic convenience",
          "Giving the most patients to the most experienced nurse"
        ],
        correct: 1,
        rationale: "The most important factor in assignment making is matching patient needs to staff capabilities (scope of practice, competency, experience). Equal patient numbers, geographic convenience, and experience alone are secondary to ensuring each patient's needs can be safely met by their assigned caregiver."
      }
    ],
    quiz: [
      {
        question: "When a charge nurse asks 'Which patient should be assigned to the float nurse?', the answer is:",
        options: [
          "The most complex patient to give the float nurse a challenge",
          "The newest admission requiring initial assessment",
          "The most stable patient with predictable care needs",
          "Whichever patient is closest to the nursing station"
        ],
        correct: 2,
        rationale: "Float nurses should always receive the most stable, predictable patients because they lack unit-specific knowledge, protocols, and familiarity with the patient population. This maximizes patient safety while still utilizing the float nurse's general nursing skills."
      }
    ]
  }
};
