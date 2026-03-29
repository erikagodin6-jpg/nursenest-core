import type { PerioperativeQuestion } from "./types";

export const emergencyBatch2Questions: PerioperativeQuestion[] = [
  {
    stem: "During a laparoscopic appendectomy, the patient suddenly develops severe bronchospasm with audible wheezing, elevated peak airway pressures, and declining SpO2. The circulating nurse suspects anaphylaxis. What is the FIRST-LINE pharmacologic treatment for intraoperative anaphylaxis?",
    options: [
      "Diphenhydramine (Benadryl) 50 mg IV",
      "Epinephrine — the first-line drug for anaphylaxis in any setting. Intraoperatively, IV epinephrine is given in bolus doses of 10-100 mcg, titrated to response",
      "Methylprednisolone (Solu-Medrol) 125 mg IV",
      "Albuterol nebulizer via the endotracheal tube"
    ],
    correctAnswer: 1,
    rationaleLong: "Epinephrine is the FIRST-LINE and MOST IMPORTANT drug for the treatment of anaphylaxis in ANY setting, including the operating room. There is no substitute for epinephrine in the acute management of anaphylaxis. Epinephrine works through multiple mechanisms that directly address the pathophysiology of anaphylaxis: (1) Alpha-1 agonism: causes vasoconstriction, which reverses vasodilation and hypotension, reduces mucosal edema (including laryngeal edema), and increases coronary perfusion pressure; (2) Beta-1 agonism: increases heart rate and cardiac contractility, improving cardiac output; (3) Beta-2 agonism: causes bronchodilation (reverses bronchospasm), and inhibits further mast cell and basophil degranulation (reducing the release of additional inflammatory mediators). In the intraoperative setting where the patient has IV access and continuous hemodynamic monitoring, epinephrine is administered IV in titrated doses of 10-100 mcg (0.01-0.1 mg) as boluses, repeated as needed. This is different from the pre-hospital/outpatient setting where IM epinephrine 0.3-0.5 mg (EpiPen) is the standard route. Other medications are adjunctive but NOT first-line: antihistamines (diphenhydramine for H1, ranitidine/famotidine for H2) help with cutaneous symptoms but do not reverse bronchospasm or hypotension; corticosteroids help prevent biphasic reactions but have a delayed onset of 4-6 hours; bronchodilators may help with persistent bronchospasm but do not address the systemic cardiovascular collapse.",
    learningObjective: "Identify epinephrine as the first-line treatment for intraoperative anaphylaxis and understand its multi-receptor mechanism of action",
    blueprintCategory: "Emergency Situations",
    subtopic: "anaphylaxis management",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Epinephrine is ALWAYS first-line for anaphylaxis — no substitute. IV dose: 10-100 mcg bolus (not the IM 0.3-0.5 mg used outside the OR).",
    clinicalPearls: [
      "Epinephrine first-line for anaphylaxis: alpha-1 (vasoconstriction), beta-1 (cardiac output), beta-2 (bronchodilation + mast cell stabilization)",
      "Intraoperative IV dose: 10-100 mcg bolus titrated to response",
      "Antihistamines and steroids are adjunctive only — they do NOT replace epinephrine"
    ],
    safetyNote: "Never delay epinephrine for anaphylaxis — delayed administration is the most common cause of anaphylaxis-related death",
    distractorRationales: [
      "Antihistamines are adjunctive only — they do not reverse bronchospasm or cardiovascular collapse",
      "Corticosteroids have a 4-6 hour onset delay — they are not effective as acute first-line treatment",
      "Albuterol may help bronchospasm but does not address the systemic cardiovascular effects of anaphylaxis"
    ]
  },
  {
    stem: "A circulating nurse is present when a surgeon sustains a scalpel laceration to the forearm during a procedure on a patient known to be hepatitis C (HCV) positive. After the wound is cleansed and dressed, what is the NEXT priority action?",
    options: [
      "Continue the surgery without interruption since the wound has been dressed",
      "Initiate the facility's bloodborne pathogen exposure protocol — document the exposure, report to employee health/occupational health immediately, draw baseline labs on the source patient and the exposed person, and consult infectious disease for post-exposure management",
      "Send the surgeon home for the day",
      "Test the scalpel blade for HCV contamination"
    ],
    correctAnswer: 1,
    rationaleLong: "A percutaneous exposure (needlestick, scalpel laceration) to blood from a patient known to be hepatitis C positive is a significant occupational exposure that requires immediate initiation of the facility's bloodborne pathogen exposure protocol. The exposure management follows these steps: (1) Immediate wound care — wash the wound thoroughly with soap and water (already done); (2) Report the exposure — notify the charge nurse or supervisor and occupational/employee health; (3) Document the exposure — including the type of exposure, body fluid involved, severity, and source patient information; (4) Source patient testing — verify the patient's HCV status (HCV antibody and HCV RNA/viral load if available); (5) Exposed person baseline testing — draw baseline labs including HCV antibody, liver function tests, and HIV antibody (because co-exposure risk must be assessed); (6) Post-exposure follow-up — HCV has no effective post-exposure prophylaxis (unlike HIV, for which PEP with antiretroviral drugs is available). However, early detection of seroconversion (HCV antibody testing at 4-6 weeks and 4-6 months) allows for early treatment with direct-acting antivirals (DAAs), which have cure rates exceeding 95%. The risk of HCV transmission from a single percutaneous exposure to HCV-positive blood is approximately 1.8% (range 0-7%). For comparison, the risk of HIV transmission from a percutaneous exposure is approximately 0.3%, and hepatitis B is 6-30% (if the source is HBeAg positive and the exposed person is unvaccinated).",
    learningObjective: "Initiate the bloodborne pathogen exposure protocol for percutaneous HCV exposure including documentation, baseline testing, and follow-up planning",
    blueprintCategory: "Emergency Situations",
    subtopic: "occupational exposure",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "HCV percutaneous exposure risk: ~1.8%. No PEP available for HCV (unlike HIV). Early detection allows treatment with DAAs (>95% cure rate).",
    clinicalPearls: [
      "HCV percutaneous transmission risk: ~1.8%. HIV: ~0.3%. HBV (HBeAg+, unvaccinated): 6-30%",
      "No post-exposure prophylaxis exists for HCV — follow-up testing at 4-6 weeks and 4-6 months",
      "DAA therapy for early HCV seroconversion has >95% cure rate"
    ],
    safetyNote: "All occupational exposures must be documented and reported immediately — delayed reporting can compromise post-exposure management options",
    distractorRationales: [
      "Wound dressing is immediate first aid but does not complete the exposure protocol",
      "Sending the surgeon home is not the priority — exposure protocol initiation is",
      "Testing the scalpel blade is not standard practice — the source patient's status is known"
    ]
  },
  {
    stem: "During a shoulder arthroscopy in the beach chair position, the patient's blood pressure suddenly drops to 68/40 mmHg and the heart rate decreases to 42 bpm. The patient becomes unresponsive. What should the circulating nurse suspect?",
    options: [
      "Hypovolemic shock from surgical blood loss",
      "Beach chair position-related cerebral hypoperfusion and potential vasovagal (Bezold-Jarisch) reflex — immediately lower the head of the operative table toward flat/Trendelenburg, administer IV fluids, and prepare vasopressors and atropine",
      "Malignant hyperthermia crisis",
      "Pulmonary embolism"
    ],
    correctAnswer: 1,
    rationaleLong: "The beach chair (sitting) position used for shoulder arthroscopy creates a unique hemodynamic challenge: the patient's head is elevated significantly above the heart, creating a hydrostatic gradient that reduces cerebral perfusion pressure. When combined with the vasodilatory effects of general anesthesia, this position can precipitate severe cerebral hypoperfusion. The Bezold-Jarisch reflex (BJR) is a particularly dangerous complication: vigorous cardiac contractions against a poorly filled left ventricle (from reduced venous return in the upright position) can trigger mechanoreceptors in the left ventricle, causing a paradoxical reflex bradycardia and vasodilation through vagal activation — the opposite of the expected compensatory tachycardia. This creates a lethal combination: already reduced cerebral perfusion from the upright position + sudden hypotension and bradycardia = critical cerebral ischemia. Reported complications include stroke, brain death, and cardiac arrest. Immediate management: (1) Flatten the table or place in Trendelenburg to restore cerebral perfusion; (2) Administer IV fluid bolus to increase preload; (3) Atropine 0.5-1 mg IV for bradycardia; (4) Vasopressors (phenylephrine or ephedrine) for hypotension; (5) Epinephrine if hemodynamic collapse is severe. Prevention includes maintaining adequate intravascular volume, gradual position changes, and using invasive blood pressure monitoring with the transducer zeroed at the level of the external auditory meatus (brain level).",
    learningObjective: "Recognize beach chair position-related hemodynamic compromise and Bezold-Jarisch reflex as a perioperative emergency requiring immediate positioning change and resuscitation",
    blueprintCategory: "Emergency Situations",
    subtopic: "positioning emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Beach chair position: Bezold-Jarisch reflex = paradoxical bradycardia + hypotension. Immediate treatment: flatten table, fluids, atropine, vasopressors.",
    clinicalPearls: [
      "Bezold-Jarisch reflex: vigorous contractions of empty ventricle → vagal activation → bradycardia + hypotension",
      "Beach chair position: zero BP transducer at external auditory meatus (brain level), not the heart",
      "Complications include stroke and brain death from cerebral hypoperfusion"
    ],
    safetyNote: "In the beach chair position, arterial blood pressure measured at the heart overestimates cerebral perfusion — always correct for hydrostatic gradient",
    distractorRationales: [
      "Hypovolemic shock presents with tachycardia, not bradycardia",
      "MH presents with rising temperature, hypercarbia, and tachycardia — not bradycardia and hypotension",
      "PE typically presents with tachycardia, hypoxia, and increased PVR — bradycardia is uncommon"
    ]
  },
  {
    stem: "A patient in the operating room develops pulseless ventricular tachycardia (VT) during a laparoscopic hysterectomy. The anesthesiologist begins chest compressions. The circulating nurse should IMMEDIATELY prepare which intervention?",
    options: [
      "Administer amiodarone 300 mg IV push",
      "Defibrillation — pulseless VT is a shockable rhythm. Retrieve the defibrillator and prepare for immediate defibrillation at 120-200 J biphasic (or 360 J monophasic) while CPR continues",
      "Administer atropine 1 mg IV push",
      "Prepare for immediate intubation"
    ],
    correctAnswer: 1,
    rationaleLong: "Pulseless ventricular tachycardia (pulseless VT) is one of two shockable cardiac arrest rhythms (the other being ventricular fibrillation/VF). The definitive treatment for pulseless VT/VF is electrical defibrillation — the sooner defibrillation is performed, the higher the likelihood of restoring a perfusing rhythm. According to ACLS (Advanced Cardiovascular Life Support) guidelines, the priority interventions for pulseless VT/VF are: (1) Immediate high-quality CPR with minimal interruptions; (2) Defibrillation AS SOON AS the defibrillator is available — every minute of delay reduces the probability of successful defibrillation by approximately 7-10%; (3) Energy levels: 120-200 joules for biphasic defibrillators (device-specific, use the manufacturer's recommendation; if unknown, use the maximum available), 360 joules for monophasic; (4) After defibrillation, immediately resume CPR for 2 minutes before reassessing rhythm; (5) Epinephrine 1 mg IV/IO every 3-5 minutes; (6) Amiodarone 300 mg IV/IO for refractory VF/VT (after unsuccessful defibrillation), followed by 150 mg if needed. The circulating nurse's role during intraoperative cardiac arrest includes: retrieve/prepare the defibrillator, call a code/activate the emergency response team, ensure crash cart availability, document the event (code recorder), and prepare medications as called for. Atropine is NOT indicated for pulseless VT — it is used for symptomatic bradycardia.",
    learningObjective: "Identify pulseless VT as a shockable rhythm requiring immediate defibrillation and implement the correct ACLS protocol",
    blueprintCategory: "Emergency Situations",
    subtopic: "cardiac arrest management",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Pulseless VT/VF = SHOCKABLE. Defibrillate ASAP. Biphasic 120-200 J, Monophasic 360 J. Each minute of delay reduces success by 7-10%.",
    clinicalPearls: [
      "Shockable rhythms: pulseless VT and VF. Non-shockable: asystole and PEA",
      "Defibrillation energy: 120-200 J biphasic (use max if unsure), 360 J monophasic",
      "Amiodarone 300 mg IV for refractory VF/VT (after unsuccessful defibrillation attempts)"
    ],
    safetyNote: "Minimize interruptions to CPR — pause compressions ONLY for defibrillation and briefly for rhythm checks every 2 minutes",
    distractorRationales: [
      "Amiodarone is used for refractory VF/VT AFTER defibrillation attempts — defibrillation comes first",
      "Atropine is used for symptomatic bradycardia, NOT for pulseless VT",
      "The patient is already intubated under general anesthesia — intubation is not the priority intervention"
    ]
  },
  {
    stem: "The circulating nurse smells an unusual chemical odor during a procedure and suspects a gas leak from the anesthetic vaporizer. Several team members report feeling dizzy and nauseated. What is the MOST important immediate action?",
    options: [
      "Continue the procedure while ventilating the room — surgery should not be interrupted",
      "Evacuate all non-essential personnel from the operating room, switch the patient to an alternative anesthetic delivery system (IV anesthesia/TIVA), isolate the suspected source, activate the OR ventilation system to maximum, and report the exposure per facility protocols",
      "Spray air freshener to mask the odor",
      "Have the affected team members sit down in the OR until they feel better"
    ],
    correctAnswer: 1,
    rationaleLong: "An anesthetic gas leak in the operating room represents both an immediate hazard to OR personnel (chronic exposure to waste anesthetic gases is associated with reproductive harm, hepatotoxicity, neurotoxicity, and increased cancer risk) and a potential hazard to the patient (uncontrolled anesthetic delivery). The NIOSH recommended exposure limits (RELs) for waste anesthetic gases are: 2 ppm for halogenated agents (sevoflurane, isoflurane, desflurane) when used in combination with nitrous oxide, 25 ppm for nitrous oxide as a time-weighted average. Team members experiencing symptoms (dizziness, nausea) indicates the exposure level significantly exceeds these limits. Immediate actions include: (1) Protect personnel — evacuate non-essential staff from the room; (2) Protect the patient — switch to total intravenous anesthesia (TIVA) using propofol and remifentanil to maintain anesthesia while the inhalational agent is discontinued; (3) Isolate the source — turn off the vaporizer and disconnect it if possible; (4) Ventilate — activate the OR scavenging system and HVAC to maximum to clear the room; (5) Report — notify facilities management, the safety officer, and occupational health; (6) Document the exposure for all affected personnel. Operating rooms should have 15-20 air exchanges per hour and a functioning waste anesthetic gas scavenging system (WAGSS) to prevent ambient gas accumulation.",
    learningObjective: "Respond to an anesthetic gas leak by protecting personnel, maintaining patient anesthesia via alternative methods, and activating safety protocols",
    blueprintCategory: "Emergency Situations",
    subtopic: "environmental hazards",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Anesthetic gas leak with symptomatic staff: evacuate non-essential personnel, switch to TIVA, isolate source, maximize ventilation. NIOSH REL: 2 ppm halogenated agents.",
    clinicalPearls: [
      "NIOSH RELs: 2 ppm halogenated agents (with N2O), 25 ppm N2O time-weighted average",
      "Switch to TIVA (propofol/remifentanil) to maintain anesthesia while addressing the gas leak",
      "OR air exchange: 15-20 per hour with functioning waste anesthetic gas scavenging system (WAGSS)"
    ],
    safetyNote: "Chronic exposure to waste anesthetic gases is associated with reproductive harm, hepatotoxicity, and increased cancer risk — take all leaks seriously",
    distractorRationales: [
      "Continuing without addressing the exposure violates OSHA standards and endangers staff health",
      "Air freshener does not reduce the concentration of toxic anesthetic gases — it only masks the odor",
      "Keeping symptomatic personnel in the contaminated environment worsens their exposure"
    ]
  },
  {
    stem: "During a total abdominal hysterectomy, the surgeon inadvertently nicks the ureter. The circulating nurse should anticipate which immediate surgical response?",
    options: [
      "No intervention is needed — ureteral injuries heal on their own",
      "The surgeon will likely request a urology consultation for intraoperative repair, and the nurse should prepare for possible ureteral stent placement, cystoscopy, or ureteral reimplantation depending on the extent of the injury",
      "The surgical procedure should be immediately terminated and the patient transferred to the ICU",
      "Apply a hemostatic agent to the ureter and continue the procedure"
    ],
    correctAnswer: 1,
    rationaleLong: "Inadvertent ureteral injury is a recognized complication of pelvic surgery, occurring in approximately 0.5-2% of hysterectomies. The ureter is at risk during pelvic surgery because of its proximity to the uterine artery (where the ureter passes under the artery — 'water under the bridge'), the cardinal and uterosacral ligaments, and the ovarian vessels. Ureteral injuries include ligation (tying off), transection (cutting), crush injury, thermal injury (from electrosurgery), and devascularization. Immediate intraoperative recognition and repair is associated with significantly better outcomes than delayed diagnosis. The response includes: (1) Urology consultation — a urologist should be called to the OR to assess the injury and perform the repair if the gynecologic surgeon is not experienced in ureteral reconstruction; (2) Based on the injury type and location, repair options include: primary repair over a ureteral stent (for minor injuries), ureteral reimplantation (ureteroneocystostomy — for distal ureteral injuries), uretero-ureterostomy (end-to-end anastomosis for mid-ureteral injuries), or psoas hitch/Boari flap for longer defects; (3) Cystoscopy may be performed to assess ureteral patency and confirm bilateral ureteral jet (urine flow from each ureteral orifice); (4) The circulating nurse should prepare ureteral stents, a cystoscopy setup, and additional supplies as needed.",
    learningObjective: "Anticipate and support the surgical team's response to inadvertent ureteral injury during pelvic surgery",
    blueprintCategory: "Emergency Situations",
    subtopic: "intraoperative complications",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Ureteral injury during hysterectomy: 0.5-2% incidence. The ureter passes under the uterine artery ('water under the bridge'). Intraoperative repair has better outcomes than delayed diagnosis.",
    clinicalPearls: [
      "Ureteral injury incidence during hysterectomy: 0.5-2%",
      "Mnemonic: ureter passes under the uterine artery — 'water under the bridge'",
      "Intraoperative recognition and repair has significantly better outcomes than delayed diagnosis"
    ],
    safetyNote: "Routine cystoscopy at the end of hysterectomy to verify bilateral ureteral jets can detect otherwise unrecognized ureteral injuries",
    distractorRationales: [
      "Ureteral injuries do not heal on their own — unrepaired injuries lead to urinoma, hydronephrosis, and renal damage",
      "Terminating the procedure without repair would leave the patient with an unaddressed ureteral injury",
      "Hemostatic agents are for bleeding control, not ureteral repair"
    ]
  }
];
