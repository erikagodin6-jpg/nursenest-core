import type { PerioperativeQuestion } from "./types";

export const patientSafetyBatch2Questions: PerioperativeQuestion[] = [
  {
    stem: "During a laparoscopic sigmoid colectomy, the final surgical count reveals a discrepancy — one lap sponge is missing. The surgical team performs a thorough wound and field search but cannot locate the sponge. What is the REQUIRED next step?",
    options: [
      "Document the discrepancy and close the wound — the sponge was probably discarded accidentally",
      "Perform an intraoperative X-ray before wound closure to locate the retained sponge — a retained surgical item is a 'never event' that must be resolved before the patient leaves the OR",
      "Ask the scrub nurse to recount from memory since the count is probably a counting error",
      "Close the wound and order a postoperative CT scan the next day"
    ],
    correctAnswer: 1,
    rationaleLong: "A discrepant surgical count is a critical safety event that must be resolved BEFORE wound closure. Retained surgical items (RSI), also known as retained foreign bodies, are classified as 'never events' (serious reportable events that should never occur) by the National Quality Forum. The consequences of a retained lap sponge include: bowel obstruction, abscess formation, sepsis, bowel perforation, fistula formation, reoperation, and potential patient death. When a count discrepancy is identified, the AORN Guideline for Prevention of Retained Surgical Items requires: (1) The surgical team performs a methodical wound exploration — inspect the wound cavity, drapes, floor, waste containers, and under/around the patient; (2) If the sponge is not found, perform an intraoperative X-ray BEFORE wound closure — all surgical sponges contain a radiopaque marker (barium sulfate strip) that is detectable on X-ray; (3) If the X-ray shows a retained sponge, retrieve it before closure; (4) If the X-ray is negative and the sponge cannot be located, document the actions taken and close the wound; (5) Document the entire event including the count discrepancy, search performed, X-ray result, and resolution. The count must be performed at defined intervals: (a) before the procedure begins (baseline), (b) before closure of any body cavity within a cavity, (c) before wound closure begins, (d) at the time of permanent relief of the scrub person or circulating nurse, and (e) at any time the count integrity is in question.",
    learningObjective: "Respond to a surgical count discrepancy with intraoperative X-ray and systematic search to prevent retained surgical items",
    blueprintCategory: "Patient Safety",
    subtopic: "surgical count procedures",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Discrepant count = ALWAYS X-ray before closure. All sponges have radiopaque markers. Retained surgical items are 'never events' per NQF.",
    clinicalPearls: [
      "Discrepant count → methodical search → intraoperative X-ray BEFORE closure",
      "All surgical sponges contain radiopaque markers for X-ray detection",
      "Count at: start, before cavity closure, before wound closure, scrub/circulator relief, any concern"
    ],
    safetyNote: "Never close a wound with an unresolved count discrepancy — an intraoperative X-ray is required before proceeding",
    distractorRationales: [
      "Assuming the sponge was discarded is dangerous and violates the standard of care",
      "Recounting from memory does not replace a systematic search and X-ray",
      "Delaying to a postoperative CT is unacceptable when an intraoperative X-ray can resolve the issue immediately"
    ]
  },
  {
    stem: "The perioperative nurse is positioning a patient for a robotic-assisted prostatectomy in steep Trendelenburg position (30-40 degrees head down). What is the MOST significant patient safety concern specific to steep Trendelenburg positioning?",
    options: [
      "Risk of the patient sliding off the table toward the head end",
      "Increased intracranial and intraocular pressure, facial and laryngeal edema, corneal abrasion, and brachial plexus injury from shoulder braces — comprehensive padding, eye protection, and avoiding shoulder braces are essential",
      "Hypothermia from the tilted position",
      "Risk of surgical site contamination"
    ],
    correctAnswer: 1,
    rationaleLong: "Steep Trendelenburg positioning (30-40 degrees head down), used primarily for robotic pelvic surgery, creates multiple physiological challenges related to the gravitational shift of abdominal contents cephalad and increased hydrostatic pressure in the head and upper body. Key complications include: (1) Increased intracranial pressure (ICP) — venous congestion in the head from gravity-dependent blood pooling increases ICP and may cause cerebral edema in prolonged procedures; (2) Increased intraocular pressure (IOP) — elevated IOP combined with decreased ocular perfusion pressure can cause postoperative visual loss (POVL) including ischemic optic neuropathy; (3) Facial and conjunctival edema — significant swelling that can be alarming but is usually temporary; (4) Laryngeal and airway edema — can cause stridor and airway obstruction after extubation, potentially requiring reintubation; (5) Brachial plexus injury — historically caused by shoulder braces/bolts used to prevent the patient from sliding. AORN recommends NON-SLIDING positioning aids (bean bags, gel pads, anti-skid materials) instead of shoulder braces; (6) Corneal abrasion/injury — the dependent position of the face and potential for surgical drapes or equipment to contact the eyes requires eye protection (taping, eye shields); (7) Compartment syndrome of the lower extremities if legs are in lithotomy simultaneously for prolonged periods.",
    learningObjective: "Identify and prevent the major positioning complications associated with steep Trendelenburg during robotic pelvic surgery",
    blueprintCategory: "Patient Safety",
    subtopic: "surgical positioning",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Steep Trendelenburg: increased ICP, increased IOP (visual loss risk), facial/laryngeal edema, brachial plexus injury. AVOID shoulder braces — use non-sliding aids instead.",
    clinicalPearls: [
      "Steep Trendelenburg increases ICP, IOP, and causes facial/laryngeal edema",
      "Use non-sliding positioning aids instead of shoulder braces to prevent brachial plexus injury",
      "Protect eyes with tape and shields — corneal injury risk is increased"
    ],
    safetyNote: "After prolonged steep Trendelenburg, assess for airway edema before extubation — perform a cuff leak test to assess for laryngeal edema",
    distractorRationales: [
      "The patient slides toward the HEAD in Trendelenburg, not off the foot end",
      "Hypothermia is not specifically worsened by Trendelenburg position",
      "Contamination risk is not the primary concern with steep Trendelenburg"
    ]
  },
  {
    stem: "A perioperative nurse is completing the surgical safety checklist (WHO Safe Surgery Checklist) before a left inguinal hernia repair. During the 'time out' (before skin incision), which elements MUST be verified?",
    options: [
      "Only the patient's name and surgical procedure",
      "All team members confirm: correct patient identity, correct procedure, correct surgical site (marked), patient positioning, antibiotic prophylaxis given, VTE prophylaxis, essential imaging available, and any anticipated critical events",
      "Only the surgeon needs to participate in the time-out",
      "The time-out is optional if the patient was verified during the sign-in phase"
    ],
    correctAnswer: 1,
    rationaleLong: "The WHO Surgical Safety Checklist is an evidence-based tool implemented in three phases: Sign-In (before anesthesia induction), Time-Out (before skin incision), and Sign-Out (before the patient leaves the OR). The Time-Out is the most critical phase and requires ACTIVE participation and verbal confirmation from ALL team members (surgeon, anesthesiologist, circulating nurse, scrub person, and any other essential team members). The Time-Out elements include: (1) Confirm all team members have introduced themselves by name and role; (2) Confirm the correct patient (using two patient identifiers); (3) Confirm the correct procedure; (4) Confirm the correct surgical site is marked and visible; (5) Confirm patient positioning is appropriate; (6) Review anticipated critical events — the surgeon reviews critical or unexpected steps, estimated operative time, and anticipated blood loss; the anesthesiologist reviews any patient-specific concerns; the nursing team reviews sterility, equipment availability, and any concerns; (7) Confirm antibiotic prophylaxis has been administered within the correct time window; (8) Confirm essential imaging is displayed in the OR; (9) Confirm VTE prophylaxis measures are in place. The landmark Haynes et al. (2009) NEJM study demonstrated that implementation of the WHO checklist reduced surgical mortality by 47% and major complications by 36%. The Time-Out is NEVER optional and requires the active participation of ALL team members, not just the surgeon.",
    learningObjective: "Implement the WHO Surgical Safety Checklist Time-Out with comprehensive verification of all required elements by the entire surgical team",
    blueprintCategory: "Patient Safety",
    subtopic: "surgical safety checklist",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "WHO Checklist: Sign-In → Time-Out → Sign-Out. Time-Out requires ALL team members' active participation. Haynes NEJM 2009: 47% mortality reduction, 36% complication reduction.",
    clinicalPearls: [
      "WHO Checklist reduced mortality by 47% and complications by 36% (Haynes NEJM 2009)",
      "Time-Out: ALL team members participate — surgeon, anesthesiologist, nurses, scrub person",
      "Verify: identity, procedure, site marking, positioning, antibiotics, imaging, VTE prophylaxis"
    ],
    safetyNote: "Never skip or rush the Time-Out — it is the last opportunity to prevent wrong-site, wrong-procedure, or wrong-patient surgery",
    distractorRationales: [
      "Name and procedure alone are insufficient — site marking, antibiotics, and critical events must also be verified",
      "All team members must participate — the surgeon alone cannot verify all elements",
      "The Time-Out is NEVER optional — it is a mandatory safety step regardless of prior verifications"
    ]
  },
  {
    stem: "A perioperative nurse notices that the surgical consent form lists 'right knee arthroscopy' but the surgeon's posted schedule lists 'left knee arthroscopy.' The patient's left knee has a surgical site marking. What should the nurse do?",
    options: [
      "Proceed with the left knee since it is marked and probably correct",
      "STOP — do not proceed until the discrepancy is resolved. Notify the surgeon, review the medical record (history, physical, imaging), verify with the patient, and ensure ALL documents, the surgical site marking, and the patient's verbal confirmation are concordant before proceeding",
      "Change the consent form to match the schedule",
      "Defer to the surgical site marking as the definitive indicator and proceed with left knee"
    ],
    correctAnswer: 1,
    rationaleLong: "A discrepancy between the surgical consent form, the posted schedule, and/or the surgical site marking is a CRITICAL safety concern that requires an immediate STOP in the process. Wrong-site surgery is a sentinel event that is entirely preventable through proper verification. The Universal Protocol (established by The Joint Commission) requires: (1) A pre-procedure verification process — confirming the correct patient, procedure, and site using at least two sources; (2) Marking the operative site — the person performing the procedure marks the site with their initials while the patient is awake and able to confirm; (3) A Time-Out — performed immediately before the procedure with the entire team. When a discrepancy is identified at ANY point in this process, the procedure MUST be stopped until the discrepancy is fully resolved. The nurse should: (1) Immediately halt all preparation; (2) Notify the surgeon of the specific discrepancy; (3) Review ALL source documents: the H&P, imaging studies, the patient's verbal confirmation, the surgical consent, and the posted schedule; (4) Correct the erroneous document(s) through proper channels — a new consent may need to be obtained; (5) Document the discrepancy and its resolution. No single document or marking should be assumed to be correct — concordance among ALL sources is required before proceeding.",
    learningObjective: "Identify and resolve surgical consent/site discrepancies before proceeding to prevent wrong-site surgery",
    blueprintCategory: "Patient Safety",
    subtopic: "wrong-site prevention",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "ANY discrepancy in patient, procedure, or site documentation = STOP EVERYTHING. Resolve before proceeding. Wrong-site surgery is a sentinel event.",
    clinicalPearls: [
      "Universal Protocol: pre-procedure verification + site marking + Time-Out",
      "ANY discrepancy in documentation, marking, or verbal confirmation = STOP and resolve",
      "No single document is definitive — concordance among ALL sources is required"
    ],
    safetyNote: "Never assume one document is correct over another — all documents, markings, and the patient's verbal confirmation must agree",
    distractorRationales: [
      "Proceeding without resolving the discrepancy risks wrong-site surgery",
      "The nurse should never independently change a consent form — a new consent must be obtained through proper channels",
      "Site marking alone is not sufficient when other documents conflict — all sources must agree"
    ]
  },
  {
    stem: "A perioperative nurse is caring for a patient undergoing a total hip arthroplasty. The patient has a latex allergy documented as 'anaphylaxis to latex.' What perioperative precautions are required?",
    options: [
      "Use powder-free latex gloves since only the powder causes the allergic reaction",
      "Implement a complete latex-free environment — use non-latex gloves, non-latex surgical supplies, schedule the patient as the FIRST case of the day, remove all latex-containing items from the OR, and ensure all team members are aware of the allergy",
      "Apply a small amount of latex to the patient's skin to test the severity of the allergy",
      "Administer prophylactic diphenhydramine and proceed with standard latex-containing supplies"
    ],
    correctAnswer: 1,
    rationaleLong: "A documented anaphylactic reaction to latex represents a Type I (IgE-mediated) immediate hypersensitivity that can be life-threatening upon re-exposure. The perioperative management of a latex-allergic patient requires a comprehensive, facility-wide approach: (1) Schedule as the FIRST CASE of the day — this minimizes airborne latex allergen exposure from prior cases (latex proteins can become aerosolized, particularly from powdered gloves, and persist in the air for hours); (2) Remove ALL latex-containing items from the OR — this includes gloves, catheters (Foley, IV tubing connectors), tourniquets, medication vial stoppers (draw medications through non-latex ports or remove stoppers), adhesive tape, blood pressure cuff tubing, anesthesia circuit components, and drains; (3) Use latex-free alternatives for all supplies — non-latex gloves (nitrile, neoprene, vinyl), silicone catheters, non-latex tourniquets; (4) Post 'LATEX ALLERGY' signs on the OR doors, patient's bed, and chart; (5) Ensure ALL team members (surgical, anesthesia, nursing, transport) are aware of the allergy; (6) Have emergency anaphylaxis treatment immediately available (epinephrine, antihistamines, corticosteroids, IV fluids). Pre-medication with antihistamines and steroids does NOT reliably prevent latex anaphylaxis and should not be relied upon as a substitute for a latex-free environment.",
    learningObjective: "Implement a comprehensive latex-free perioperative environment for patients with documented latex anaphylaxis",
    blueprintCategory: "Patient Safety",
    subtopic: "latex allergy management",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Latex anaphylaxis = complete latex-free environment + FIRST case of the day. Pre-medication does NOT reliably prevent anaphylaxis.",
    clinicalPearls: [
      "First case of the day minimizes aerosolized latex protein from prior cases",
      "Common latex sources: gloves, catheters, med vial stoppers, tourniquets, tape, BP cuff tubing",
      "Pre-medication with antihistamines/steroids does NOT replace a latex-free environment"
    ],
    safetyNote: "Post latex allergy signs on the OR door and ensure ALL team members (including transport and PACU) are aware of the allergy",
    distractorRationales: [
      "Powder-free latex gloves still contain latex proteins that cause Type I anaphylaxis",
      "Latex skin testing on a known anaphylactic patient could trigger a dangerous reaction",
      "Prophylactic diphenhydramine does not reliably prevent latex anaphylaxis — a latex-free environment is required"
    ]
  }
];
