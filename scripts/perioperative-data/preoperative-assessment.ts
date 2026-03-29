import type { PerioperativeLesson } from "./types";

export const preoperativeAssessmentLessons: PerioperativeLesson[] = [
  {
    title: "Comprehensive Health History in Preoperative Nursing",
    slug: "comprehensive-health-history-preoperative",
    domain: "Preoperative Patient Assessment",
    difficulty: "beginner",
    content: `## Overview
A thorough health history is the cornerstone of preoperative assessment. The perioperative nurse collects subjective data to identify risk factors, plan individualized care, and prevent intraoperative complications. The preoperative health history guides anesthesia selection, surgical positioning, and postoperative management.

## Key Concepts
- **Systematic data collection**: Use a structured approach covering chief complaint, history of present illness, past medical/surgical history, family history, social history, and review of systems.
- **Allergy documentation**: Record all allergies (medications, latex, food, environmental) with specific reaction types (anaphylaxis vs. sensitivity). Latex allergy requires a latex-free environment protocol.
- **Medication reconciliation**: Document all current medications including prescription, OTC, herbal supplements, and recreational substances. Note last dose timing for anticoagulants, antihypertensives, and diabetic medications.
- **Previous surgical/anesthesia history**: Identify prior adverse reactions to anesthesia (malignant hyperthermia, difficult airway, prolonged paralysis from succinylcholine, PONV).
- **NPO status verification**: Confirm compliance with fasting guidelines (ASA guidelines: clear liquids 2 hours, light meal 6 hours, full meal 8 hours).

## Assessment Steps
1. Introduce yourself and verify patient identity using two identifiers.
2. Review the surgical consent for accuracy and patient understanding.
3. Obtain a focused health history using open-ended questions.
4. Document allergies prominently on the chart and apply allergy wristband.
5. Review current medications and verify which were held or taken per surgeon/anesthesia orders.
6. Screen for risk factors: smoking, alcohol use, obstructive sleep apnea, BMI, functional status.
7. Assess psychosocial needs: anxiety level, support system, cultural/spiritual considerations.
8. Verify advance directives and code status.

## Interventions / Management
- Communicate pertinent findings to the surgical and anesthesia teams using SBAR format.
- Initiate latex-free precautions if latex allergy is identified.
- Coordinate medication management (e.g., holding warfarin, continuing beta-blockers).
- Address knowledge deficits with targeted preoperative education.
- Document all findings accurately in the perioperative nursing record.

## Complications
- Unidentified allergies leading to intraoperative anaphylaxis.
- Missed medication interactions (e.g., MAOIs with sympathomimetics, herbal supplements increasing bleeding risk).
- Failure to identify malignant hyperthermia susceptibility (family history of MH).
- Inadequate NPO assessment leading to aspiration risk.

## Clinical Pearls
- Herbal supplements are often unreported: always ask specifically. St. John's Wort, garlic, ginkgo, ginseng, and fish oil can affect bleeding and anesthesia.
- A patient who reports "no allergies" should be asked specifically about latex, iodine, and adhesive tape sensitivities.
- Previous difficult intubation is a critical finding that must be communicated immediately to anesthesia.
- Family history of unexpected death during surgery may indicate malignant hyperthermia susceptibility.

## Common Exam Pitfalls
- Confusing allergy (immune-mediated) with adverse drug reaction (predictable side effect). Nausea from opioids is a side effect, NOT an allergy.
- Failing to recognize that latex allergy requires first-case scheduling for lowest latex particle count.
- Not understanding that herbal supplements should be discontinued 2 weeks before surgery.`,
    checkpointQuestions: [
      {
        question: "A patient reports nausea after receiving codeine. How should this be documented?",
        options: ["Drug allergy to codeine", "Adverse drug reaction/intolerance to codeine", "Anaphylaxis to codeine", "Contraindication to all opioids"],
        correctIndex: 1,
        rationale: "Nausea is a predictable side effect of opioids, not an immune-mediated allergic response. It should be documented as an adverse drug reaction or intolerance, not an allergy."
      },
      {
        question: "Which herbal supplement poses the greatest risk for increased intraoperative bleeding?",
        options: ["Echinacea", "Valerian", "Ginkgo biloba", "Melatonin"],
        correctIndex: 2,
        rationale: "Ginkgo biloba inhibits platelet-activating factor and can increase bleeding risk. It should be discontinued at least 2 weeks before surgery."
      },
      {
        question: "When should a patient with a confirmed latex allergy be scheduled for surgery?",
        options: ["Last case of the day", "First case of the day", "Any time with extra precautions", "Only in a specialized OR suite"],
        correctIndex: 1,
        rationale: "Latex-allergic patients should be scheduled as the first case of the day to minimize airborne latex particles from gloves used in previous cases."
      }
    ],
    commonMistakes: [
      "Documenting medication side effects as allergies",
      "Not asking about herbal supplements and OTC medications",
      "Failing to verify NPO compliance before proceeding",
      "Not communicating previous anesthesia complications to the anesthesia team"
    ],
    examTrapWarning: "The CNOR exam differentiates between true allergies (immune-mediated, IgE response) and adverse drug reactions. Nausea from opioids and GI upset from antibiotics are NOT allergies.",
    clinicalReasoning: "When a patient reports a previous 'bad reaction' to anesthesia, the perioperative nurse must determine the specific nature of the reaction. Was it nausea (common side effect), difficult intubation (airway concern), or malignant hyperthermia (genetic emergency)? Each requires different interventions.",
    relatedFlashcardTopics: ["Preoperative Assessment", "Allergy Documentation", "NPO Guidelines", "Medication Reconciliation"]
  },
  {
    title: "Physical Assessment in Preoperative Nursing",
    slug: "physical-assessment-preoperative",
    domain: "Preoperative Patient Assessment",
    difficulty: "beginner",
    content: `## Overview
The preoperative physical assessment provides objective data to complement the health history. It focuses on systems relevant to the planned surgical procedure, anesthesia administration, and patient positioning. Findings guide the perioperative care plan and alert the team to potential complications.

## Key Concepts
- **Baseline vital signs**: Blood pressure, heart rate, respiratory rate, temperature, oxygen saturation, and pain level establish a reference for intraoperative and postoperative comparison.
- **Airway assessment**: Mallampati classification (I-IV), thyromental distance, neck mobility, and dentition status help predict difficult intubation.
- **Cardiovascular assessment**: Heart sounds, peripheral pulses, capillary refill, presence of edema, and JVD.
- **Respiratory assessment**: Breath sounds, chest expansion, use of accessory muscles, cough effectiveness, and smoking history.
- **Neurological baseline**: Level of consciousness, orientation, pupil reactivity, motor/sensory function (especially important for procedures involving regional anesthesia or positioning).
- **Skin assessment**: Document existing skin integrity issues, rashes, bruising, presence of implanted devices (pacemakers, ports), and tattoos at potential electrode or incision sites.
- **Surgical site verification**: Confirm the surgical site marking is present and correct per hospital protocol.

## Assessment Steps
1. Perform systematic head-to-toe assessment focused on surgical relevance.
2. Obtain and document baseline vital signs.
3. Assess the airway using Mallampati score and note any loose teeth, dentures, or oral piercings.
4. Auscultate heart and lung sounds; note any murmurs, irregular rhythms, or adventitious breath sounds.
5. Inspect the surgical site; verify site marking and skin condition.
6. Assess peripheral vascular status: pulses, capillary refill, skin color and temperature.
7. Document the location of any implanted devices, prosthetics, or metal implants.
8. Assess mobility and range of motion relevant to planned surgical positioning.

## Interventions / Management
- Report abnormal findings to the surgeon and anesthesia provider before proceeding.
- Document Mallampati classification and communicate difficult airway concerns.
- Ensure pressure injury risk assessment (Braden Scale) is completed for prolonged procedures.
- Remove dentures, jewelry, hearing aids, and contact lenses per facility policy.
- Apply sequential compression devices (SCDs) if indicated for DVT prophylaxis.

## Complications
- Undetected cardiac arrhythmia leading to intraoperative hemodynamic instability.
- Missed Mallampati IV classification resulting in unanticipated difficult airway.
- Unidentified skin breakdown at positioning sites leading to pressure injury.
- Failure to note pacemaker/ICD, resulting in electrosurgical interference.

## Clinical Pearls
- Mallampati I (soft palate, fauces, uvula, pillars visible) predicts easy intubation. Mallampati IV (hard palate only) predicts difficult airway.
- Always assess bilateral peripheral pulses before procedures involving extremity positioning or tourniquets.
- A Braden Score of 18 or less indicates pressure injury risk; patients with scores below 14 need aggressive prevention strategies.
- Patients with obstructive sleep apnea (OSA) are at higher risk for airway complications; STOP-BANG score >= 5 indicates high risk.

## Common Exam Pitfalls
- Confusing Mallampati classifications; remember Class I is the best (all structures visible) and Class IV is the worst.
- Forgetting that the preoperative skin assessment establishes baseline documentation to differentiate pre-existing conditions from procedure-related injuries.`,
    checkpointQuestions: [
      {
        question: "A preoperative patient has a Mallampati Class IV airway. What does this indicate?",
        options: ["Easy intubation expected", "Only the hard palate is visible, predicting a difficult airway", "Moderate difficulty with intubation", "The patient requires a tracheostomy for surgery"],
        correctIndex: 1,
        rationale: "Mallampati Class IV means only the hard palate is visible when the patient opens the mouth. This is the most challenging classification and predicts difficult intubation."
      },
      {
        question: "Why is a baseline skin assessment performed before surgery?",
        options: ["To determine the type of skin prep solution to use", "To document pre-existing conditions and differentiate them from procedure-related injuries", "To identify patients who need prophylactic antibiotics", "To determine surgical site marking location"],
        correctIndex: 1,
        rationale: "Baseline skin assessment documents pre-existing skin conditions (bruising, breakdown, rashes) so they are not attributed to positioning or procedural injuries sustained during surgery."
      }
    ],
    commonMistakes: [
      "Not performing or documenting baseline neurological assessment before regional anesthesia",
      "Failing to assess for implanted cardiac devices before using electrosurgery",
      "Omitting range of motion assessment relevant to surgical positioning"
    ],
    examTrapWarning: "Mallampati classification is assessed with the patient sitting upright, mouth open wide, tongue protruding, without phonation. Exam questions may test knowledge of proper assessment technique.",
    clinicalReasoning: "A patient with limited neck extension, receding mandible, short thyromental distance, and Mallampati IV has multiple predictors of difficult intubation. The perioperative nurse must communicate these findings to anesthesia and ensure difficult airway equipment is immediately available.",
    relatedFlashcardTopics: ["Mallampati Classification", "Airway Assessment", "Braden Scale", "Preoperative Vital Signs"]
  },
  {
    title: "Preoperative Laboratory Interpretation",
    slug: "preoperative-lab-interpretation",
    domain: "Preoperative Patient Assessment",
    difficulty: "intermediate",
    content: `## Overview
Preoperative laboratory tests identify conditions that may increase surgical risk. The perioperative nurse must be able to interpret key lab values and understand their implications for anesthesia administration, hemostasis, and wound healing. Lab orders are based on patient age, comorbidities, medication history, and type of procedure.

## Key Concepts
- **CBC**: Hemoglobin/hematocrit (anemia assessment for blood loss risk), WBC (infection screening), platelets (hemostasis capability).
- **Coagulation studies**: PT/INR (extrinsic pathway, warfarin monitoring), aPTT (intrinsic pathway, heparin monitoring). Critical for patients on anticoagulants.
- **Basic Metabolic Panel (BMP)**: Glucose (diabetic management), potassium (cardiac arrhythmia risk, succinylcholine contraindication with hyperkalemia), creatinine/BUN (renal function, drug clearance), sodium (fluid balance).
- **Type and Screen/Crossmatch**: Required for procedures with significant blood loss risk. Type and screen identifies blood type and antibodies; crossmatch ensures compatibility of specific units.
- **Pregnancy test (beta-hCG)**: Required for all women of childbearing age (per facility policy). A positive result requires immediate communication to the surgeon and anesthesiologist.
- **Urinalysis**: Screens for UTI, diabetes, and renal disease. Surgery may be delayed for active UTI.
- **Chest X-ray and ECG**: Not routine but indicated based on patient history and procedure type. ECG for patients over 50 or with cardiac history.

## Assessment Steps
1. Review ordered labs against patient history and planned procedure.
2. Identify and flag critical or abnormal values.
3. Correlate lab findings with patient medications (e.g., elevated INR in warfarin patients).
4. Communicate abnormal findings to the surgical and anesthesia teams.
5. Verify that blood products are available if type and crossmatch was ordered.

## Interventions / Management
- Hold surgery for critical values: K+ > 5.5 mEq/L, INR > 1.5 (for most procedures), Hgb < 7 g/dL (based on clinical context), glucose > 250 mg/dL.
- Notify anesthesia of potassium abnormalities (hyperkalemia increases risk of cardiac arrhythmia, especially with succinylcholine).
- Ensure blood bank has compatible units available for procedures with anticipated blood loss > 500 mL.
- For diabetic patients, communicate glucose level and insulin management plan.

## Complications
- Undetected coagulopathy leading to uncontrolled intraoperative bleeding.
- Hyperkalemia with succinylcholine use causing cardiac arrest.
- Undiagnosed pregnancy exposed to teratogenic anesthesia agents and radiation.
- Unrecognized renal insufficiency affecting drug metabolism and fluid management.

## Clinical Pearls
- Normal INR is 0.8-1.2. Therapeutic INR for warfarin is typically 2.0-3.0. An INR > 1.5 usually requires surgeon clearance before proceeding.
- Potassium > 5.5 mEq/L is a contraindication to succinylcholine use (risk of fatal cardiac arrhythmia).
- Hemoglobin < 7 g/dL generally triggers a transfusion discussion, but the threshold varies by patient and procedure.
- A positive pregnancy test is a surgical emergency notification — not all procedures are canceled, but the team must be informed immediately.

## Common Exam Pitfalls
- Not recognizing that succinylcholine is contraindicated in hyperkalemia.
- Confusing PT/INR (warfarin monitoring) with aPTT (heparin monitoring).
- Assuming all abnormal labs require surgery cancellation — many require notification and clinical judgment.`,
    checkpointQuestions: [
      {
        question: "A patient scheduled for surgery has a potassium level of 5.8 mEq/L. The anesthesiologist plans to use succinylcholine. What should the perioperative nurse do?",
        options: ["Proceed as planned since succinylcholine is safe", "Notify anesthesia immediately — succinylcholine is contraindicated with hyperkalemia", "Hold the potassium result until after induction", "Administer IV potassium to normalize the level"],
        correctIndex: 1,
        rationale: "Succinylcholine causes transient hyperkalemia by releasing potassium from muscle cells. In a patient who is already hyperkalemic, this can cause fatal cardiac arrhythmia. The nurse must notify anesthesia immediately."
      },
      {
        question: "Which coagulation test monitors heparin therapy?",
        options: ["PT (Prothrombin Time)", "INR", "aPTT (Activated Partial Thromboplastin Time)", "Bleeding time"],
        correctIndex: 2,
        rationale: "aPTT monitors the intrinsic pathway and is used to monitor unfractionated heparin therapy. PT/INR monitors the extrinsic pathway and is used for warfarin monitoring."
      }
    ],
    commonMistakes: [
      "Confusing PT/INR with aPTT monitoring parameters",
      "Not recognizing hyperkalemia as a contraindication to succinylcholine",
      "Failing to verify blood availability for high blood loss procedures"
    ],
    examTrapWarning: "The CNOR exam loves questions about succinylcholine and hyperkalemia. Remember: K+ > 5.5 = no succinylcholine. Also know that burns, crush injuries, and spinal cord injuries cause hyperkalemia and are contraindications.",
    clinicalReasoning: "When reviewing preoperative labs, always correlate findings with the patient's medication list. An elevated INR in a patient on warfarin is expected but still needs evaluation. An elevated INR in a patient NOT on anticoagulants suggests liver disease or coagulopathy and requires further workup.",
    relatedFlashcardTopics: ["Preoperative Labs", "Coagulation Studies", "Electrolyte Abnormalities", "Type and Crossmatch"]
  },
  {
    title: "ASA Physical Status Classification System",
    slug: "asa-physical-status-classification",
    domain: "Preoperative Patient Assessment",
    difficulty: "beginner",
    content: `## Overview
The American Society of Anesthesiologists (ASA) Physical Status Classification System is a standardized method for assessing a patient's overall health before surgery. Assigned by the anesthesiologist, the ASA class helps predict perioperative risk and guides anesthesia planning. Perioperative nurses must understand the classifications to anticipate care needs and potential complications.

## Key Concepts
- **ASA I**: Normal healthy patient. No organic, physiologic, or psychiatric disturbance. Example: healthy adult for elective hernia repair.
- **ASA II**: Patient with mild systemic disease. No functional limitations. Example: well-controlled hypertension, mild diabetes, current smoker, social alcohol use, pregnancy, BMI 30-40.
- **ASA III**: Patient with severe systemic disease. Substantive functional limitations. Example: poorly controlled diabetes or hypertension, COPD, morbid obesity (BMI >= 40), active hepatitis, alcohol dependence, implanted pacemaker, moderate reduction in ejection fraction, ESRD on dialysis, history of MI > 3 months ago.
- **ASA IV**: Patient with severe systemic disease that is a constant threat to life. Example: recent MI (< 3 months), ongoing cardiac ischemia, severe valve dysfunction, sepsis, DIC, ARDS, ESRD not on dialysis.
- **ASA V**: Moribund patient not expected to survive without the operation. Example: ruptured abdominal aortic aneurysm, massive trauma, intracranial bleed with mass effect.
- **ASA VI**: Declared brain-dead patient whose organs are being removed for donation.
- **"E" modifier**: Added to any class for emergency surgery (e.g., ASA III-E).

## Assessment Steps
1. Review the anesthesiologist's ASA classification in the preoperative assessment.
2. Correlate the ASA class with the patient's health history and planned procedure.
3. Anticipate equipment and monitoring needs based on ASA class (e.g., arterial line for ASA IV).
4. Prepare for potential complications associated with higher ASA classes.

## Interventions / Management
- ASA I-II: Standard monitoring, routine preparation.
- ASA III: Enhanced monitoring, potential ICU bed reservation, additional IV access.
- ASA IV-V: Invasive monitoring (arterial line, central line, PA catheter), blood products on standby, ICU bed confirmed, rapid response team awareness.
- Emergency modifier: Expedited preparation, abbreviated preoperative workup.

## Clinical Pearls
- The ASA classification is NOT a surgical risk score — it assesses the patient's overall health status independent of the surgical procedure.
- A healthy athlete having emergency appendectomy is ASA I-E (healthy patient, emergency surgery).
- BMI >= 40 alone qualifies a patient as ASA III due to functional limitations associated with morbid obesity.
- The "E" modifier indicates the procedure cannot be delayed without significant risk to the patient.

## Common Exam Pitfalls
- Assuming ASA classification considers the type of surgery. It does NOT — it only considers the patient's systemic health.
- Confusing ASA classification with surgical wound classification or other risk scores.`,
    checkpointQuestions: [
      {
        question: "A healthy 30-year-old patient presents for emergency appendectomy. What is the correct ASA classification?",
        options: ["ASA I", "ASA I-E", "ASA II-E", "ASA III-E"],
        correctIndex: 1,
        rationale: "The patient is healthy (ASA I) but the procedure is emergent (E modifier). The correct classification is ASA I-E."
      },
      {
        question: "Which statement about ASA classification is TRUE?",
        options: ["It considers both patient health and surgical complexity", "It is assigned by the perioperative nurse", "It assesses only the patient's systemic health status", "ASA IV patients cannot undergo surgery"],
        correctIndex: 2,
        rationale: "The ASA Physical Status Classification assesses only the patient's overall systemic health independent of the planned surgical procedure."
      }
    ],
    commonMistakes: [
      "Thinking ASA classification includes surgical risk factors",
      "Confusing ASA class with surgical wound classification",
      "Not recognizing that morbid obesity (BMI >= 40) qualifies as ASA III"
    ],
    examTrapWarning: "ASA classification assesses PATIENT health, not surgical complexity. A healthy patient having high-risk cardiac surgery is still ASA I. An ASA IV patient having minor surgery is still ASA IV.",
    clinicalReasoning: "Understanding ASA classification helps the perioperative nurse anticipate the level of monitoring, equipment, and staffing needed. An ASA IV patient requires more intensive preparation than an ASA I patient regardless of the procedure being performed.",
    relatedFlashcardTopics: ["ASA Classification", "Preoperative Risk Assessment", "Anesthesia Planning"]
  },
  {
    title: "Informed Consent in Perioperative Nursing",
    slug: "informed-consent-perioperative",
    domain: "Preoperative Patient Assessment",
    difficulty: "beginner",
    content: `## Overview
Informed consent is a legal and ethical requirement before any surgical procedure. The surgeon is responsible for obtaining informed consent by explaining the procedure, risks, benefits, and alternatives. The perioperative nurse's role is to verify that consent has been properly obtained, that the patient demonstrates understanding, and that the consent form is complete and accurate.

## Key Concepts
- **Elements of informed consent**: Nature of the procedure, expected benefits, material risks, alternative treatments (including no treatment), and the right to refuse.
- **Capacity to consent**: The patient must be of legal age (or have an authorized representative), mentally competent, and free from undue influence or coercion.
- **Nurse's role**: The nurse is a WITNESS to the patient's signature, not the person who explains the procedure. The nurse verifies the patient can restate the procedure and demonstrates understanding.
- **Special situations**: Minors (parent/guardian consent), emergency surgery (implied consent doctrine), patients under influence of sedative medications, language barriers (qualified interpreter required).
- **Consent for blood products**: Often a separate consent; must be obtained before surgery if blood transfusion is anticipated.

## Assessment Steps
1. Verify the consent form is signed and dated by the patient (or legal representative) and the surgeon.
2. Confirm the consent form accurately reflects the planned procedure, including site and laterality.
3. Ask the patient to describe in their own words what procedure they are having and the expected outcome.
4. Verify the patient was informed of risks, benefits, and alternatives.
5. Assess for signs of confusion, sedation, or coercion that might invalidate consent.
6. If the patient cannot restate the procedure or appears confused, notify the surgeon before proceeding.

## Interventions / Management
- Do NOT administer preoperative sedation before consent is obtained.
- If the patient has questions about the procedure, notify the surgeon to provide further explanation.
- For patients who do not speak the primary language, use a qualified medical interpreter — never use family members for consent discussions.
- Document the consent verification process in the perioperative nursing record.
- If the patient withdraws consent at any time, the procedure must be halted and the surgeon notified.

## Complications
- Performing surgery without valid consent exposes the surgeon and facility to battery charges.
- Consent obtained while patient is sedated or confused is legally invalid.
- Failure to document consent verification can result in legal liability.

## Clinical Pearls
- A patient can withdraw consent at ANY time, even after being wheeled into the OR. The nurse must advocate for the patient.
- Consent obtained under the influence of preoperative medications (benzodiazepines, opioids) is potentially invalid.
- In life-threatening emergencies where the patient is unable to consent and no surrogate is available, the principle of implied consent applies — the surgeon can proceed to save the patient's life.
- A signed consent form is NOT proof of informed consent — it is documentation that the process occurred.

## Common Exam Pitfalls
- Believing the nurse's role is to explain the surgical procedure to the patient. The SURGEON explains; the nurse WITNESSES and VERIFIES.
- Thinking a signed form equals informed consent. The form documents the process, but true informed consent requires patient understanding.`,
    checkpointQuestions: [
      {
        question: "A patient asks the perioperative nurse to explain the risks of their upcoming surgery. What is the appropriate action?",
        options: ["Explain the risks as documented in the consent form", "Notify the surgeon to discuss risks with the patient", "Tell the patient risks were already explained when they signed consent", "Have another nurse explain the risks"],
        correctIndex: 1,
        rationale: "Explaining the procedure, risks, benefits, and alternatives is the surgeon's responsibility. The nurse should notify the surgeon that the patient has additional questions."
      },
      {
        question: "When is implied consent applicable in the perioperative setting?",
        options: ["When the patient signs the consent form", "When the patient is under general anesthesia", "In life-threatening emergencies when the patient cannot consent and no surrogate is available", "When the family agrees to the procedure"],
        correctIndex: 2,
        rationale: "Implied consent applies in life-threatening emergencies when the patient is unable to consent and no authorized surrogate decision-maker is available. The surgeon may proceed to preserve life."
      }
    ],
    commonMistakes: [
      "Explaining surgical risks to the patient instead of notifying the surgeon",
      "Administering sedation before consent is obtained",
      "Using family members as interpreters for consent discussions"
    ],
    examTrapWarning: "The nurse WITNESSES consent and VERIFIES understanding. The nurse does NOT obtain informed consent. If a CNOR question asks who explains the procedure, the answer is always the SURGEON.",
    clinicalReasoning: "If a patient appears anxious and states 'I just signed whatever they put in front of me,' this is a red flag that informed consent may not have been truly obtained. The perioperative nurse must pause and notify the surgeon to re-engage the patient in the consent discussion.",
    relatedFlashcardTopics: ["Informed Consent", "Patient Rights", "Legal Aspects of Perioperative Nursing"]
  },
  {
    title: "Preoperative Patient Education",
    slug: "preoperative-patient-education",
    domain: "Preoperative Patient Assessment",
    difficulty: "beginner",
    content: `## Overview
Preoperative patient education reduces anxiety, improves postoperative outcomes, increases patient satisfaction, and promotes adherence to postoperative instructions. The perioperative nurse assesses learning readiness, identifies barriers to learning, and provides individualized education using appropriate teaching methods.

## Key Concepts
- **Assessment of learning readiness**: Health literacy level, language proficiency, cultural considerations, anxiety level, cognitive function, and physical limitations (hearing, vision).
- **Content areas**: What to expect before, during, and after surgery; pain management options; deep breathing and coughing exercises; early ambulation importance; drain/tube care; dietary restrictions; activity limitations; when to call the surgeon.
- **Teaching methods**: Verbal instruction, written materials, demonstration/return demonstration, video resources, teach-back method.
- **Teach-back method**: Ask the patient to explain in their own words what they have learned. This validates understanding and identifies knowledge gaps.
- **Timing**: Ideally provided at preadmission visit; reinforced on day of surgery. Anxious patients retain less information — focus on essential safety information on the day of surgery.

## Assessment Steps
1. Assess the patient's baseline knowledge about their procedure and recovery.
2. Identify barriers to learning (anxiety, language, health literacy, cultural beliefs, sensory deficits).
3. Determine the patient's preferred learning style (visual, auditory, kinesthetic).
4. Assess the involvement of family/caregivers who will assist with postoperative care.

## Interventions / Management
- Provide information in short, focused segments; avoid information overload.
- Use plain language (6th-grade reading level) for written materials.
- Demonstrate incentive spirometry, coughing and deep breathing, and splinting techniques; have the patient perform return demonstration.
- Provide written discharge instructions before the day of surgery when possible.
- Include caregivers/family members in education sessions.
- Document all education provided and the patient's demonstrated understanding.

## Clinical Pearls
- Patients retain approximately 20% of what they hear but 80% of what they do. Return demonstration is the gold standard for skill-based teaching.
- The teach-back method is the most reliable way to verify patient understanding — a nodding patient does not equal a comprehending patient.
- Preoperative education about pain management expectations (realistic expectations, multimodal approach) improves postoperative pain satisfaction scores.
- Patients with high anxiety benefit from guided imagery, music therapy, or brief relaxation techniques before receiving detailed education.

## Common Exam Pitfalls
- Assuming a signed education acknowledgment form equals understanding. Always use teach-back to verify.
- Providing all education on the day of surgery when the patient is most anxious.`,
    checkpointQuestions: [
      {
        question: "Which method best verifies that a patient understands preoperative instructions?",
        options: ["Having the patient sign an acknowledgment form", "Asking the patient if they have questions", "Using the teach-back method", "Providing written instructions"],
        correctIndex: 2,
        rationale: "The teach-back method asks the patient to explain in their own words what they have learned. This is the most effective way to verify understanding and identify knowledge gaps."
      }
    ],
    commonMistakes: [
      "Relying solely on written materials without verbal reinforcement",
      "Not assessing health literacy before choosing educational materials",
      "Providing excessive information to highly anxious patients on surgery day"
    ],
    examTrapWarning: "The CNOR exam emphasizes the teach-back method as the gold standard for verifying patient understanding. A signed form is NOT sufficient evidence of comprehension.",
    clinicalReasoning: "A patient who can demonstrate proper use of the incentive spirometer and verbalize when to call the surgeon has shown competency through both psychomotor and cognitive domains of learning.",
    relatedFlashcardTopics: ["Patient Education", "Teach-Back Method", "Learning Domains", "Preoperative Teaching"]
  },
  {
    title: "NPO Guidelines and Aspiration Prevention",
    slug: "npo-guidelines-aspiration-prevention",
    domain: "Preoperative Patient Assessment",
    difficulty: "intermediate",
    content: `## Overview
Nothing by mouth (NPO) guidelines minimize the risk of pulmonary aspiration during anesthesia. Aspiration of gastric contents into the lungs can cause chemical pneumonitis, aspiration pneumonia, acute respiratory distress syndrome (ARDS), and death. The perioperative nurse verifies NPO compliance and communicates any deviations to the anesthesia provider.

## Pathophysiology / Mechanism
Aspiration occurs when gastric contents enter the tracheobronchial tree, typically during induction or emergence from anesthesia when protective airway reflexes (cough, gag, laryngospasm) are suppressed. Gastric acid (pH < 2.5) causes chemical burns to alveolar epithelium. Particulate matter obstructs small airways. The inflammatory response leads to pulmonary edema, surfactant destruction, and potentially ARDS.

## Key Concepts
- **ASA Fasting Guidelines**: Clear liquids — 2 hours; breast milk — 4 hours; infant formula/non-human milk — 6 hours; light meal (toast, clear liquids) — 6 hours; full/fatty meal — 8 hours or more.
- **Clear liquids defined**: Water, clear fruit juices without pulp, carbonated beverages, clear tea, black coffee (NO cream or milk). Does NOT include alcohol or dairy.
- **High-risk patients**: Diabetic gastroparesis, GERD, pregnancy, morbid obesity, bowel obstruction, emergency surgery, pediatric patients.
- **Rapid sequence induction (RSI)**: Used for patients at high aspiration risk. Involves preoxygenation, cricoid pressure (Sellick maneuver), and rapid administration of induction agent and neuromuscular blocker with immediate intubation.

## Assessment Steps
1. Ask the patient when they last ate or drank anything, including gum, candy, and medications with water.
2. Document the exact timing and nature of the last oral intake.
3. Verify compliance with surgeon/anesthesia NPO orders.
4. Assess for conditions that increase aspiration risk (GERD, gastroparesis, pregnancy, bowel obstruction).
5. Communicate any NPO violations or concerns to the anesthesia provider immediately.

## Interventions / Management
- Verify NPO status is documented and communicated at handoff.
- If NPO guidelines have been violated, notify anesthesia immediately — do NOT make the decision to proceed or cancel independently.
- For patients at high aspiration risk, anticipate RSI and ensure suction is immediately available.
- Administer prescribed prophylactic medications as ordered: sodium citrate (Bicitra) to raise gastric pH, metoclopramide (Reglan) to promote gastric emptying, famotidine or ranitidine to reduce gastric acid production.

## Complications
- **Aspiration pneumonitis**: Chemical inflammation from gastric acid; presents with acute hypoxemia, tachypnea, bronchospasm, fever.
- **Aspiration pneumonia**: Bacterial infection from aspirated oral/gastric flora; presents later with productive cough, fever, infiltrate on CXR.
- **ARDS**: Severe complication of massive aspiration; diffuse bilateral infiltrates, refractory hypoxemia, requires mechanical ventilation.

## Clinical Pearls
- Chewing gum increases gastric volume and stimulates acid secretion. Most facilities consider gum chewing a violation of NPO status.
- Black coffee (no cream, no sugar) is considered a clear liquid. Coffee with cream is NOT a clear liquid.
- Diabetic patients on insulin require special NPO management — typically half the usual dose of long-acting insulin and hold short-acting insulin.
- Emergency patients are always considered at full stomach risk regardless of reported NPO time.

## Common Exam Pitfalls
- Classifying coffee with cream as a clear liquid. Only BLACK coffee qualifies as a clear liquid.
- Thinking the nurse can decide to proceed with surgery after an NPO violation. This is ALWAYS the anesthesia provider's decision.`,
    checkpointQuestions: [
      {
        question: "A patient reports drinking black coffee 3 hours before scheduled surgery. Is this compliant with ASA fasting guidelines?",
        options: ["No, coffee is not allowed before surgery", "Yes, black coffee is a clear liquid and 2 hours of fasting is sufficient", "No, coffee requires 6 hours of fasting", "It depends on the type of anesthesia"],
        correctIndex: 1,
        rationale: "Black coffee (without cream, milk, or sugar) is classified as a clear liquid under ASA guidelines. Clear liquids require a minimum 2-hour fasting period. Three hours exceeds this minimum."
      },
      {
        question: "What is the primary purpose of cricoid pressure (Sellick maneuver) during rapid sequence induction?",
        options: ["To facilitate visualization of the vocal cords", "To prevent passive regurgitation by compressing the esophagus", "To stimulate the cough reflex", "To maintain head position during intubation"],
        correctIndex: 1,
        rationale: "Cricoid pressure (Sellick maneuver) compresses the esophagus against the cervical vertebrae to prevent passive regurgitation of gastric contents during the period between loss of consciousness and endotracheal tube placement."
      }
    ],
    commonMistakes: [
      "Classifying coffee with cream as a clear liquid",
      "Making independent decisions to proceed after NPO violations",
      "Not asking specifically about gum, candy, and hard candies"
    ],
    examTrapWarning: "Know the ASA fasting guidelines cold: 2-4-6-8 rule (clear liquids 2h, breast milk 4h, light meal 6h, full meal 8h). Black coffee = clear liquid. Coffee with cream = NOT clear liquid.",
    clinicalReasoning: "When a patient with diabetic gastroparesis presents for surgery and reports NPO compliance of 8 hours, the nurse should still communicate the gastroparesis diagnosis to anesthesia. Gastroparesis delays gastric emptying, meaning the standard fasting time may not ensure an empty stomach.",
    relatedFlashcardTopics: ["NPO Guidelines", "Aspiration Risk", "Rapid Sequence Induction", "ASA Fasting Guidelines"]
  },
  {
    title: "Preoperative Medication Management",
    slug: "preoperative-medication-management",
    domain: "Preoperative Patient Assessment",
    difficulty: "intermediate",
    content: `## Overview
Medication management in the preoperative period is critical for patient safety. Certain medications must be continued (beta-blockers, thyroid medications), others must be held (anticoagulants, certain diabetic medications), and specific timing requirements must be followed. The perioperative nurse verifies medication compliance and communicates discrepancies to the surgical and anesthesia teams.

## Key Concepts
- **Continue perioperatively**: Beta-blockers (abrupt discontinuation causes rebound hypertension/tachycardia), thyroid medications, antiseizure medications, cardiac medications (except ACE inhibitors/ARBs per institutional protocol), inhaled bronchodilators, chronic corticosteroids (may need stress-dose supplementation).
- **Hold perioperatively**: Warfarin (hold 5 days, bridge with heparin if high-risk), DOACs (hold 24-72 hours based on renal function), clopidogrel (hold 5-7 days), aspirin (varies by procedure — may continue for cardiac patients), metformin (hold day of surgery, risk of lactic acidosis), SGLT2 inhibitors (hold 3-4 days, risk of euglycemic DKA), herbal supplements (hold 2 weeks), MAOIs (special anesthesia considerations).
- **Special considerations**: Diabetic patients (half long-acting insulin dose, hold short-acting), corticosteroid-dependent patients (stress-dose hydrocortisone), patients on chronic opioids (may need higher analgesic doses).

## Assessment Steps
1. Review the medication reconciliation list against surgeon/anesthesia orders.
2. Verify which medications were taken and which were held on the day of surgery.
3. Confirm timing of last anticoagulant dose and current INR/aPTT if applicable.
4. Assess for medications not disclosed (herbal supplements, recreational drugs, borrowed medications).
5. Check for medication allergies and cross-reactivity risks.

## Interventions / Management
- Administer approved preoperative medications with a sip of water as ordered.
- Hold ACE inhibitors/ARBs on the morning of surgery per institutional protocol (risk of refractory hypotension under anesthesia).
- Verify beta-blocker was taken — do NOT hold beta-blockers on surgery day.
- For insulin-dependent diabetics, verify half-dose of long-acting insulin was administered and monitor glucose.
- Administer stress-dose steroids for patients on chronic corticosteroid therapy (typically hydrocortisone 100 mg IV before induction).

## Complications
- Rebound hypertension and tachycardia from abrupt beta-blocker discontinuation.
- Intraoperative bleeding from inadequate anticoagulant reversal.
- Adrenal crisis in corticosteroid-dependent patients without stress-dose supplementation.
- Metformin-associated lactic acidosis with renal hypoperfusion during surgery.
- Euglycemic diabetic ketoacidosis from SGLT2 inhibitors.

## Clinical Pearls
- Beta-blockers should NEVER be abruptly discontinued — this can cause rebound sympathetic activation, acute MI, or cardiac arrest.
- Metformin does not cause hypoglycemia but carries a risk of lactic acidosis, especially if renal perfusion is compromised during surgery.
- SGLT2 inhibitors (empagliflozin, dapagliflozin) can cause euglycemic DKA — the glucose may be NORMAL but the patient is in ketoacidosis.
- Chronic opioid users require higher doses of analgesics perioperatively and should NOT be expected to respond to standard dosing.

## Common Exam Pitfalls
- Holding beta-blockers on surgery day. NEVER hold beta-blockers — continue them.
- Not recognizing that SGLT2 inhibitors can cause DKA with normal glucose levels (euglycemic DKA).`,
    checkpointQuestions: [
      {
        question: "A patient on chronic atenolol (beta-blocker) asks if they should take it on the morning of surgery. What should the nurse advise?",
        options: ["Hold it since nothing should be taken before surgery", "Take it with a sip of water as prescribed", "Take half the dose", "The surgeon will prescribe an IV alternative"],
        correctIndex: 1,
        rationale: "Beta-blockers should be continued perioperatively. Abrupt discontinuation can cause rebound hypertension, tachycardia, and even myocardial ischemia. The patient should take it with a small sip of water."
      },
      {
        question: "Why are SGLT2 inhibitors held 3-4 days before surgery?",
        options: ["Risk of hypoglycemia", "Risk of euglycemic diabetic ketoacidosis", "Drug interaction with anesthesia agents", "Risk of hypertension"],
        correctIndex: 1,
        rationale: "SGLT2 inhibitors can cause euglycemic DKA — the patient develops ketoacidosis despite normal or near-normal blood glucose levels. This is dangerous because it may be missed due to normal glucose readings."
      }
    ],
    commonMistakes: [
      "Holding beta-blockers on the day of surgery",
      "Not recognizing euglycemic DKA risk with SGLT2 inhibitors",
      "Failing to arrange stress-dose steroids for chronically corticosteroid-dependent patients"
    ],
    examTrapWarning: "NEVER hold beta-blockers on surgery day. The CNOR exam tests this concept frequently. Also know that metformin is held for lactic acidosis risk, not hypoglycemia risk.",
    clinicalReasoning: "A patient on chronic prednisone 20 mg daily presenting for surgery requires stress-dose hydrocortisone because chronic exogenous steroid use suppresses the hypothalamic-pituitary-adrenal (HPA) axis. Without supplementation, the patient cannot mount an adequate cortisol response to surgical stress, leading to potential cardiovascular collapse (adrenal crisis).",
    relatedFlashcardTopics: ["Perioperative Medications", "Beta-Blocker Management", "Anticoagulant Bridging", "Stress-Dose Steroids"]
  },
  {
    title: "Preoperative Risk Stratification and Optimization",
    slug: "preoperative-risk-stratification",
    domain: "Preoperative Patient Assessment",
    difficulty: "advanced",
    content: `## Overview
Preoperative risk stratification identifies patients at elevated risk for perioperative complications and guides optimization strategies. Tools such as the Revised Cardiac Risk Index (RCRI), ACS NSQIP Surgical Risk Calculator, and functional capacity assessment help quantify risk and inform shared decision-making between the patient and surgical team.

## Key Concepts
- **Revised Cardiac Risk Index (RCRI/Lee Index)**: Six independent predictors of major cardiac events: high-risk surgery (intraperitoneal, intrathoracic, suprainguinal vascular), history of ischemic heart disease, history of congestive heart failure, history of cerebrovascular disease, insulin-dependent diabetes, preoperative creatinine > 2.0 mg/dL. Each factor = 1 point; 0 points = ~3.9% risk; >=3 points = ~11% risk.
- **Functional capacity (METs)**: 1 MET = resting; 4 METs = climbing a flight of stairs or walking up a hill; >4 METs generally adequate for most surgeries. Patients unable to achieve 4 METs may need further cardiac evaluation.
- **Pulmonary risk factors**: Smoking, COPD, ASA III+, age >60, functional dependence, emergency surgery. Smoking cessation at least 4-8 weeks before surgery reduces pulmonary complications.
- **Frailty assessment**: Unintentional weight loss, self-reported exhaustion, low physical activity, slow walking speed, weak grip strength. Frailty is an independent predictor of postoperative complications, prolonged hospitalization, and mortality.

## Assessment Steps
1. Calculate RCRI score and document.
2. Assess functional capacity using MET equivalents.
3. Evaluate pulmonary risk factors and document smoking history (pack-years).
4. Screen for frailty using validated tools (e.g., Clinical Frailty Scale, Fried Criteria).
5. Review nutritional status — albumin < 3.0 g/dL indicates nutritional risk.

## Interventions / Management
- Refer patients with RCRI >= 3 or functional capacity < 4 METs for cardiology consultation.
- Implement prehabilitation programs for high-risk patients: exercise training, nutritional optimization, smoking cessation, psychological preparation.
- Optimize hemoglobin preoperatively (iron supplementation, erythropoietin) for patients with anemia.
- Initiate incentive spirometry instruction preoperatively for patients with pulmonary risk factors.
- Discuss realistic expectations and risk/benefit analysis with the patient.

## Complications
- Perioperative myocardial infarction in patients with unrecognized cardiac risk.
- Postoperative pulmonary complications (pneumonia, respiratory failure) in unoptimized patients.
- Increased mortality in frail patients undergoing major surgery without optimization.
- Surgical site infection and wound dehiscence in malnourished patients.

## Clinical Pearls
- A patient who can climb two flights of stairs without stopping has adequate functional capacity (>= 4 METs) for most surgeries.
- Preoperative albumin < 3.0 g/dL is the strongest single predictor of postoperative surgical complications.
- Smoking cessation benefit begins immediately but pulmonary complication reduction is most significant at 4-8 weeks of cessation.
- Prehabilitation (exercise + nutrition + psychological support) for 2-4 weeks before major surgery can significantly reduce complications and shorten hospital stay.

## Common Exam Pitfalls
- Confusing functional capacity (METs) with exercise tolerance testing. MET assessment is a clinical estimate based on daily activities, not a formal stress test.
- Not recognizing albumin as a marker of surgical risk rather than just nutritional status.`,
    checkpointQuestions: [
      {
        question: "A patient scheduled for abdominal surgery cannot walk up a flight of stairs without resting. What does this indicate about their functional capacity?",
        options: ["Functional capacity > 4 METs — adequate for surgery", "Functional capacity < 4 METs — further cardiac evaluation may be warranted", "Normal finding for preoperative patients", "The patient needs a formal cardiac stress test before any decision"],
        correctIndex: 1,
        rationale: "Climbing a flight of stairs represents approximately 4 METs. A patient unable to achieve this level has functional capacity < 4 METs, which may warrant further cardiac evaluation before elective surgery."
      }
    ],
    commonMistakes: [
      "Not calculating RCRI for patients undergoing major surgery",
      "Overlooking frailty as an independent risk factor",
      "Not recognizing albumin < 3.0 as a major predictor of surgical complications"
    ],
    examTrapWarning: "4 METs = climbing one flight of stairs. If a patient cannot do this, they may need further cardiac workup. Know the RCRI criteria — each factor is worth 1 point.",
    clinicalReasoning: "A 72-year-old patient with diabetes, history of MI, and creatinine of 2.3 scheduled for colon resection has an RCRI of 3 (high-risk surgery + ischemic heart disease + diabetes + renal insufficiency = 4 actually). This patient's cardiac risk is elevated and warrants a cardiology consultation and potentially further optimization before proceeding with elective surgery.",
    relatedFlashcardTopics: ["RCRI", "Functional Capacity METs", "Prehabilitation", "Frailty Assessment"]
  },
  {
    title: "Preoperative Anxiety Management",
    slug: "preoperative-anxiety-management",
    domain: "Preoperative Patient Assessment",
    difficulty: "beginner",
    content: `## Overview
Preoperative anxiety is a normal response to the uncertainty and perceived threat of surgery. Excessive anxiety, however, can increase sympathetic nervous system activation, raise blood pressure and heart rate, increase anesthetic requirements, impair wound healing, and worsen postoperative pain. The perioperative nurse plays a key role in identifying anxious patients and implementing both pharmacologic and non-pharmacologic interventions.

## Key Concepts
- **Sources of anxiety**: Fear of the unknown, loss of control, pain, death, disfigurement, anesthesia awareness, separation from family, financial concerns, previous negative surgical experiences.
- **Physiological effects of anxiety**: Increased cortisol and catecholamines, tachycardia, hypertension, hyperventilation, muscle tension, nausea, diaphoresis.
- **Assessment tools**: Visual Analog Scale for Anxiety (VAS-A), State-Trait Anxiety Inventory (STAI), simple 0-10 anxiety rating scale.
- **Non-pharmacologic interventions**: Therapeutic communication, active listening, information provision, relaxation techniques (deep breathing, guided imagery, progressive muscle relaxation), music therapy, aromatherapy (lavender), distraction techniques.
- **Pharmacologic interventions**: Midazolam (Versed) 1-2 mg IV is the most common preoperative anxiolytic; lorazepam for longer procedures; melatonin as a premedication alternative.

## Assessment Steps
1. Observe for verbal and non-verbal cues of anxiety (restlessness, tearfulness, tachycardia, elevated BP, repetitive questions, withdrawal).
2. Ask the patient directly: "On a scale of 0-10, how anxious are you feeling right now?"
3. Identify specific fears and concerns through therapeutic communication.
4. Assess previous surgical experiences and coping mechanisms.
5. Evaluate cultural and spiritual factors that may influence anxiety expression and coping.

## Interventions / Management
- Provide honest, age-appropriate information about what to expect.
- Allow the patient to verbalize fears without judgment.
- Teach simple relaxation techniques (slow deep breathing, 4-7-8 breathing technique).
- Offer music therapy with headphones during preoperative waiting.
- Allow family member presence during the preoperative period when possible.
- Administer prescribed anxiolytics when non-pharmacologic measures are insufficient.
- Minimize unnecessary delays that increase waiting time and anxiety.

## Clinical Pearls
- The most powerful anxiolytic is often the nurse's calm, reassuring presence combined with honest communication.
- Children benefit from preoperative tours, child life specialist involvement, and parental presence during induction.
- Patients with previous traumatic surgical experiences may benefit from a preoperative behavioral health consultation.
- Music therapy has been shown in multiple RCTs to significantly reduce preoperative anxiety and reduce the need for sedative premedication.

## Common Exam Pitfalls
- Dismissing preoperative anxiety as "normal" and not intervening. While some anxiety is expected, excessive anxiety requires intervention.
- Automatically reaching for pharmacologic solutions before trying non-pharmacologic approaches.`,
    checkpointQuestions: [
      {
        question: "Which non-pharmacologic intervention has the strongest evidence for reducing preoperative anxiety?",
        options: ["Reading materials about the surgery", "Music therapy", "Aromatherapy with eucalyptus", "Television distraction"],
        correctIndex: 1,
        rationale: "Music therapy has the strongest evidence base for reducing preoperative anxiety, supported by multiple randomized controlled trials showing significant reductions in anxiety scores and sedative requirements."
      }
    ],
    commonMistakes: [
      "Not assessing anxiety level before and after interventions",
      "Dismissing patient anxiety without addressing specific fears",
      "Relying solely on pharmacologic interventions"
    ],
    examTrapWarning: "Non-pharmacologic interventions should be tried FIRST before pharmacologic approaches. The CNOR exam favors holistic, patient-centered care approaches.",
    clinicalReasoning: "A patient with tachycardia (HR 110) and elevated blood pressure (160/95) in the preoperative area may be experiencing anxiety-related sympathetic activation rather than a cardiovascular emergency. After implementing anxiety-reduction strategies, reassess vital signs. If they normalize, anxiety was likely the cause.",
    relatedFlashcardTopics: ["Preoperative Anxiety", "Non-Pharmacologic Interventions", "Therapeutic Communication", "Midazolam"]
  },
  {
    title: "Preoperative Skin Preparation",
    slug: "preoperative-skin-preparation",
    domain: "Preoperative Patient Assessment",
    difficulty: "intermediate",
    content: `## Overview
Preoperative skin preparation reduces the microbial load on the patient's skin at the surgical site to minimize the risk of surgical site infection (SSI). It includes patient bathing/showering with antiseptic agents, hair removal (if necessary), and the surgical skin prep performed in the OR. Evidence-based guidelines from AORN, CDC, and WHO inform current best practices.

## Key Concepts
- **Preoperative bathing**: Chlorhexidine gluconate (CHG) 2% or 4% wipes or solution the night before and morning of surgery. Two showers are preferred for maximum bacterial reduction.
- **Hair removal**: Hair should NOT be removed unless it interferes with the incision. If removal is necessary, use electric clippers with a disposable head — NEVER use a razor (razors cause micro-abrasions that increase SSI risk by 5-10x).
- **Timing of hair removal**: Performed as close to the time of surgery as possible, preferably in the OR or preoperative holding area.
- **Surgical skin prep agents**: Chlorhexidine-alcohol (ChloraPrep) is the gold standard for most procedures. Povidone-iodine (Betadine) is used near mucous membranes, eyes, or when CHG is contraindicated. Iodine povacrylex-alcohol (DuraPrep) is an alternative.
- **Skin prep application**: Applied in concentric circles moving outward from the incision site, or per manufacturer's instructions. The area must be large enough to accommodate extension of the incision, additional incisions, or drain placement.

## Assessment Steps
1. Verify the patient completed CHG bathing as instructed preoperatively.
2. Inspect the surgical site for cuts, abrasions, rashes, or signs of infection.
3. Determine if hair removal is necessary based on incision location.
4. Verify no known allergies to CHG, iodine, or alcohol.
5. Allow alcohol-based preps to dry completely (minimum 3 minutes) before draping to prevent fire risk.

## Interventions / Management
- Apply skin prep agent per manufacturer's instructions and facility protocol.
- Do NOT use CHG near the eyes, ears, or mucous membranes — use povidone-iodine instead.
- Do NOT use alcohol-based preps near mucous membranes or on neonates under 2 months.
- Allow alcohol-based preps to dry completely and do NOT allow pooling under the patient (fire risk).
- Document the skin prep agent used, lot number, expiration date, area prepped, and skin condition before and after.

## Complications
- Surgical site infection from inadequate skin preparation.
- Chemical skin burn from CHG or alcohol pooling under the patient.
- Surgical fire from ignition of alcohol-based prep that did not fully dry.
- Allergic/contact dermatitis from skin prep agents.

## Clinical Pearls
- CHG-alcohol is superior to povidone-iodine for most surgical sites (per the Darouiche 2010 landmark study). It reduces SSI rates by approximately 40%.
- Alcohol-based preps require a MINIMUM of 3 minutes drying time — longer for hair-bearing areas. Wet prep + electrosurgery = fire risk.
- Never shave surgical sites with a razor. Clipping is the only acceptable method of hair removal.
- For patients with CHG allergy, use povidone-iodine or iodine povacrylex as alternatives.

## Common Exam Pitfalls
- Using a razor for hair removal. The answer is ALWAYS clippers. Razors increase SSI risk.
- Not allowing alcohol-based preps to dry completely. This is a fire safety issue.
- Using CHG near the eyes or ears. CHG is ototoxic and can cause corneal damage.`,
    checkpointQuestions: [
      {
        question: "Which method of hair removal at the surgical site is recommended by evidence-based guidelines?",
        options: ["Depilatory cream", "Disposable razor", "Electric clippers with disposable head", "Straight razor"],
        correctIndex: 2,
        rationale: "Electric clippers with a disposable head are the recommended method of hair removal. Razors (disposable or straight) cause micro-abrasions that significantly increase SSI risk. Hair should only be removed if it interferes with the incision."
      },
      {
        question: "Why must alcohol-based skin prep agents be allowed to dry completely before draping?",
        options: ["To maximize antimicrobial effectiveness", "To prevent chemical burns", "To prevent surgical fire", "To improve adhesion of drapes"],
        correctIndex: 2,
        rationale: "Alcohol-based skin preps are flammable. If not completely dry, they can be ignited by electrosurgical units, lasers, or fiber-optic light sources, causing a surgical fire. Complete drying (minimum 3 minutes) is essential."
      }
    ],
    commonMistakes: [
      "Using a razor instead of clippers for hair removal",
      "Not allowing adequate drying time for alcohol-based preps",
      "Using CHG on mucous membranes, eyes, or ears"
    ],
    examTrapWarning: "Hair removal: ALWAYS clippers, NEVER razors. Skin prep: CHG-alcohol is preferred for most sites. Alcohol-based preps must be DRY before draping (fire risk). CHG is contraindicated near eyes, ears, and mucous membranes.",
    clinicalReasoning: "When preparing a patient for a facial procedure near the eye, the perioperative nurse must select povidone-iodine instead of CHG because chlorhexidine can cause permanent corneal damage if it contacts the eye. This demonstrates the importance of matching the prep agent to the anatomical location.",
    relatedFlashcardTopics: ["Skin Preparation", "CHG vs Povidone-Iodine", "Hair Removal", "SSI Prevention"]
  },
  {
    title: "Surgical Site Marking and Verification",
    slug: "surgical-site-marking-verification",
    domain: "Preoperative Patient Assessment",
    difficulty: "beginner",
    content: `## Overview
Surgical site marking is a critical patient safety initiative to prevent wrong-site, wrong-side, and wrong-procedure surgery. The Joint Commission's Universal Protocol and the WHO Surgical Safety Checklist require site marking, a preprocedure verification process, and a time-out before incision. The perioperative nurse is integral to all three components.

## Key Concepts
- **Universal Protocol components**: (1) Preprocedure verification process, (2) Surgical site marking, (3) Time-out immediately before incision.
- **Site marking requirements**: Must be done by the surgeon or proceduralist performing the operation. Mark must be at or near the incision site. Must be visible after draping. Use indelible marker. Mark the operative side for all laterality procedures (left/right, multiple structures, multiple levels).
- **Preprocedure verification**: Confirms correct patient identity, correct procedure, correct site, availability of correct implants/equipment, correct imaging displayed. Performed at multiple points: scheduling, pre-admission, day of surgery, before leaving the preoperative area, before anesthesia induction.
- **Time-out**: Performed immediately before incision. Active communication among ALL team members. Includes: correct patient, correct procedure, correct site/side, correct position, correct implants, antibiotic administration, anticipated blood loss, and any special considerations.

## Assessment Steps
1. Verify surgical site mark is present, visible, and matches the consent form and operative schedule.
2. Confirm the mark was made by the operating surgeon.
3. If no mark is present for a laterality procedure, do NOT proceed — notify the surgeon.
4. Involve the patient in verifying the surgical site when possible.
5. Ensure site marking is visible after sterile draping.

## Interventions / Management
- Initiate the preprocedure verification at each transition point (admission, preop holding, OR entry).
- Actively participate in the time-out as the patient advocate.
- STOP the procedure if any discrepancy is identified — any team member can call a halt.
- Document the time-out participants, verification elements, and any concerns raised.
- If the patient is awake, involve them in verifying site and procedure during the time-out.

## Complications
- Wrong-site surgery (sentinel event, never event).
- Wrong-side surgery (e.g., right vs. left knee).
- Wrong-procedure performed.
- Wrong-patient surgery.

## Clinical Pearls
- ANY team member can and should stop the procedure if a discrepancy is identified during the time-out. This includes nurses, surgical techs, and anesthesia providers.
- The time-out is an ACTIVE process — it is not a checkbox exercise. All team members must pause their activities and actively participate.
- For spine surgery, intraoperative imaging may be used to verify the correct level before incision.
- The surgical site mark should NOT be placed on non-operative sites. An "X" should never be used (it can be interpreted as "operate here" or "do NOT operate here").

## Common Exam Pitfalls
- Thinking the circulating nurse can mark the surgical site. ONLY the surgeon who is performing the procedure can mark the site.
- Using "X" as a site mark. The mark should be the surgeon's initials or "YES" — never "X" (ambiguous meaning).`,
    checkpointQuestions: [
      {
        question: "Who is responsible for marking the surgical site?",
        options: ["The circulating nurse", "The preoperative nurse", "The surgeon performing the procedure", "Any licensed physician"],
        correctIndex: 2,
        rationale: "The Universal Protocol requires that the surgical site be marked by the surgeon or proceduralist who is performing the operation. The nurse verifies the mark is present and correct but does not place it."
      },
      {
        question: "During the time-out, the surgical tech notices the consent form says 'left knee' but the site mark is on the right knee. What should happen?",
        options: ["Proceed with the right knee since it is marked", "The tech should inform the circulating nurse privately after the time-out", "The procedure must STOP immediately until the discrepancy is resolved", "The surgeon decides which side is correct"],
        correctIndex: 2,
        rationale: "Any discrepancy identified during the time-out requires an immediate halt to the procedure. Any team member can and should stop the process. The discrepancy must be resolved before proceeding."
      }
    ],
    commonMistakes: [
      "Using 'X' to mark the surgical site",
      "Proceeding without site marking for laterality procedures",
      "Treating the time-out as a passive checkbox exercise"
    ],
    examTrapWarning: "Only the SURGEON marks the site. Any team member can STOP the procedure for discrepancies. The time-out is an ACTIVE process requiring the full attention of ALL team members.",
    clinicalReasoning: "The time-out is the last defense against wrong-site surgery. When the circulating nurse initiates the time-out, they must ensure all team members stop what they are doing, face each other, and actively confirm each element. A time-out conducted while the team continues working is not a valid time-out.",
    relatedFlashcardTopics: ["Universal Protocol", "Time-Out Procedure", "Surgical Site Marking", "Patient Safety"]
  },
  {
    title: "Preoperative DVT Risk Assessment and Prophylaxis",
    slug: "preoperative-dvt-risk-assessment",
    domain: "Preoperative Patient Assessment",
    difficulty: "intermediate",
    content: `## Overview
Venous thromboembolism (VTE), including deep vein thrombosis (DVT) and pulmonary embolism (PE), is a significant perioperative complication. Risk assessment begins preoperatively, and prophylactic measures are initiated before or at the time of surgery. The Caprini Risk Assessment Model is widely used to stratify VTE risk in surgical patients.

## Pathophysiology / Mechanism
Virchow's Triad describes the three factors contributing to thrombus formation: (1) Venous stasis (immobility during and after surgery), (2) Endothelial injury (surgical manipulation, positioning), (3) Hypercoagulability (surgical stress response, dehydration, malignancy, hormonal therapy). Surgery activates the coagulation cascade through tissue factor release.

## Key Concepts
- **Caprini Score**: Point-based system incorporating age, BMI, surgical type, immobility duration, history of VTE, malignancy, thrombophilia, oral contraceptive/HRT use.
- **Risk categories**: Score 0-1 (very low risk), 2 (low risk), 3-4 (moderate risk), >=5 (high risk).
- **Mechanical prophylaxis**: Sequential compression devices (SCDs), graduated compression stockings (GCS/TEDs), early ambulation.
- **Pharmacologic prophylaxis**: Low-molecular-weight heparin (enoxaparin 40 mg SC daily), unfractionated heparin (5000 units SC q8-12h), fondaparinux, DOACs (rivaroxaban, apixaban for orthopedic procedures).
- **Combination therapy**: High-risk patients may receive both mechanical and pharmacologic prophylaxis.

## Assessment Steps
1. Calculate the Caprini score preoperatively.
2. Assess for contraindications to pharmacologic prophylaxis (active bleeding, HIT history, recent hemorrhagic stroke, severe thrombocytopenia).
3. Assess leg circumference, skin condition, and peripheral vascular status before applying compression devices.
4. Verify the correct size of compression stockings/SCDs.
5. Assess for history of previous VTE, thrombophilia, or family history of clotting disorders.

## Interventions / Management
- Apply SCDs bilaterally before induction of anesthesia and ensure they remain on throughout the procedure and postoperatively until the patient is fully ambulatory.
- Do NOT place SCDs on a limb with known DVT, severe peripheral artery disease, skin grafts, or open wounds.
- Administer pharmacologic prophylaxis as ordered (timing varies by drug and procedure).
- Encourage early postoperative ambulation as soon as medically safe.
- Elevate legs and encourage ankle pump exercises when in bed.

## Complications
- DVT presenting as unilateral leg swelling, warmth, tenderness, positive Homan's sign (unreliable).
- Pulmonary embolism: sudden dyspnea, chest pain, tachycardia, hypoxemia, hemodynamic collapse.
- Heparin-induced thrombocytopenia (HIT) from heparin-based prophylaxis.
- Skin breakdown from improperly sized compression stockings.

## Clinical Pearls
- SCDs should be applied BEFORE anesthesia induction because venous stasis begins with the loss of the skeletal muscle pump during anesthesia.
- Homan's sign (calf pain with dorsiflexion) is unreliable for DVT diagnosis (poor sensitivity and specificity). Do NOT rely on it.
- The Caprini score is cumulative — a patient with multiple minor risk factors can still be high risk.
- Orthopedic procedures (total hip, total knee, hip fracture surgery) carry the highest VTE risk and often require extended prophylaxis (up to 35 days).

## Common Exam Pitfalls
- Relying on Homan's sign for DVT diagnosis. The CNOR exam emphasizes that it is unreliable.
- Applying SCDs after the patient is anesthetized instead of before induction.
- Not recognizing that SCDs are contraindicated on a limb with existing DVT.`,
    checkpointQuestions: [
      {
        question: "When should sequential compression devices (SCDs) be applied to a surgical patient?",
        options: ["After anesthesia induction", "After the patient is positioned on the OR table", "Before anesthesia induction", "In the PACU after surgery"],
        correctIndex: 2,
        rationale: "SCDs should be applied before anesthesia induction because venous stasis begins when the patient loses the skeletal muscle pump during anesthesia. Applying them after induction misses the period of initial stasis."
      },
      {
        question: "Which finding is the LEAST reliable indicator of DVT?",
        options: ["Unilateral leg edema", "Positive Homan's sign", "Calf warmth and erythema", "Asymmetric calf circumference"],
        correctIndex: 1,
        rationale: "Homan's sign (pain with passive dorsiflexion of the foot) has poor sensitivity and specificity for DVT diagnosis. It is unreliable and should not be used as a definitive diagnostic tool."
      }
    ],
    commonMistakes: [
      "Applying SCDs after anesthesia induction instead of before",
      "Using Homan's sign as a reliable DVT indicator",
      "Placing SCDs on a limb with known DVT"
    ],
    examTrapWarning: "SCDs go on BEFORE induction. Homan's sign is UNRELIABLE. SCDs are contraindicated on limbs with existing DVT or severe PAD.",
    clinicalReasoning: "A patient undergoing total hip arthroplasty with a Caprini score of 8 (high risk) should receive both mechanical prophylaxis (SCDs applied preoperatively) and pharmacologic prophylaxis (enoxaparin or DOAC), with extended prophylaxis for up to 35 days postoperatively. This represents a combined approach addressing all components of Virchow's Triad.",
    relatedFlashcardTopics: ["DVT Prophylaxis", "Caprini Score", "Virchow's Triad", "SCDs", "Pharmacologic VTE Prevention"]
  },
  {
    title: "Preoperative Optimization of the Diabetic Patient",
    slug: "preoperative-optimization-diabetic-patient",
    domain: "Preoperative Patient Assessment",
    difficulty: "advanced",
    content: `## Overview
Diabetic patients face increased perioperative risks including hyperglycemia, hypoglycemia, diabetic ketoacidosis, impaired wound healing, and surgical site infection. Effective preoperative management requires coordination between the perioperative nurse, surgeon, anesthesiologist, and the patient's endocrinologist or primary care provider to achieve optimal glucose control while avoiding dangerous hypoglycemia.

## Pathophysiology / Mechanism
Surgical stress triggers a counter-regulatory hormone response (cortisol, epinephrine, glucagon, growth hormone) that promotes hyperglycemia, insulin resistance, and protein catabolism. In Type 1 diabetics, insulin deficiency can lead to diabetic ketoacidosis (DKA). In Type 2 diabetics on SGLT2 inhibitors, euglycemic DKA may occur. Hyperglycemia impairs neutrophil function, promotes infection, delays wound healing, and increases cardiovascular event risk.

## Key Concepts
- **Target glucose range**: 140-180 mg/dL perioperatively (per ADA and STS guidelines). Tight control (< 110) increases hypoglycemia risk without clear benefit.
- **HbA1c assessment**: Reflects 3-month average glucose control. HbA1c > 8.5% may warrant surgery postponement for optimization (elective cases). HbA1c > 9% significantly increases SSI risk.
- **Insulin management**: Type 1 — NEVER discontinue all insulin (risk of DKA). Give 50-75% of basal (long-acting) insulin. Hold prandial (rapid-acting) insulin. Type 2 — hold oral agents day of surgery, give half-dose basal insulin.
- **Oral medication management**: Hold metformin (lactic acidosis risk), hold SGLT2 inhibitors 3-4 days pre-op (euglycemic DKA risk), hold sulfonylureas day of surgery (hypoglycemia risk), hold TZDs day of surgery.
- **Monitoring**: Fingerstick glucose every 1-2 hours intraoperatively. Continuous glucose monitoring devices may be used per facility policy.

## Assessment Steps
1. Review HbA1c (within 3 months) and fasting glucose.
2. Determine diabetes type (Type 1 vs. Type 2) and current medication regimen.
3. Verify medication adjustments were made per pre-surgical instructions.
4. Check the morning-of-surgery glucose level.
5. Assess for signs of uncontrolled diabetes (polyuria, polydipsia, weight loss, ketonuria).
6. Identify and document insulin pump settings if present.

## Interventions / Management
- Check glucose on arrival to preoperative area and communicate to anesthesia.
- Initiate insulin drip for glucose > 180 mg/dL per institutional protocol.
- Treat hypoglycemia (< 70 mg/dL) with IV dextrose (D50 or D10 drip).
- Continue insulin pump at basal rate if surgeon/anesthesia approves (some institutions disconnect pumps and use IV insulin).
- Ensure glucose monitoring equipment is available in the OR.
- Have insulin and dextrose immediately available in the operating room.

## Complications
- Hyperglycemia (> 200 mg/dL): increased SSI risk, impaired wound healing, osmotic diuresis.
- Hypoglycemia (< 70 mg/dL): altered mental status, seizures, cardiac arrhythmia — difficult to detect under anesthesia.
- DKA (Type 1): metabolic acidosis, dehydration, electrolyte imbalance — surgery should be postponed.
- Euglycemic DKA (SGLT2 inhibitors): ketoacidosis with normal glucose — easily missed.

## Clinical Pearls
- NEVER withhold ALL insulin from a Type 1 diabetic — this leads to DKA. They always need basal insulin.
- Hypoglycemia under general anesthesia is silent — there are no symptoms to observe. Regular glucose monitoring is essential.
- HbA1c is more valuable than a single fasting glucose because it reflects chronic glycemic control and better predicts perioperative risk.
- Insulin pump management requires specific institutional protocols. The electrocautery can interfere with insulin pump function — consider temporary disconnection.

## Common Exam Pitfalls
- Holding ALL insulin for Type 1 diabetic patients before surgery. NEVER do this — they need basal insulin.
- Targeting glucose < 110 mg/dL. This tight control increases hypoglycemia risk. The target is 140-180 mg/dL.`,
    checkpointQuestions: [
      {
        question: "A Type 1 diabetic patient is scheduled for surgery. The preoperative orders state 'hold all insulin.' What should the perioperative nurse do?",
        options: ["Follow the order as written", "Give the full dose of insulin", "Question the order — Type 1 diabetics need basal insulin to prevent DKA", "Hold insulin and start an oral diabetic medication"],
        correctIndex: 2,
        rationale: "Type 1 diabetic patients produce no endogenous insulin. Withholding all insulin will lead to DKA. The nurse should question the order and advocate for continuing basal insulin (typically 50-75% of the normal dose)."
      },
      {
        question: "What is the target blood glucose range during surgery per current guidelines?",
        options: ["80-120 mg/dL", "100-140 mg/dL", "140-180 mg/dL", "180-250 mg/dL"],
        correctIndex: 2,
        rationale: "Current guidelines (ADA, STS) recommend a perioperative glucose target of 140-180 mg/dL. Tighter control (< 110) increases hypoglycemia risk without clear benefit. Glucose > 180 requires intervention."
      }
    ],
    commonMistakes: [
      "Holding all insulin for Type 1 diabetic patients",
      "Targeting glucose below 110 mg/dL",
      "Not monitoring glucose regularly during surgery",
      "Forgetting to hold SGLT2 inhibitors 3-4 days before surgery"
    ],
    examTrapWarning: "Type 1 diabetics ALWAYS need basal insulin. The perioperative glucose target is 140-180 mg/dL, NOT < 110. SGLT2 inhibitors cause euglycemic DKA — glucose may be NORMAL.",
    clinicalReasoning: "When a Type 1 diabetic patient arrives with a glucose of 350 mg/dL and positive ketones, the surgery should be postponed for DKA treatment. Proceeding with surgery in the setting of DKA dramatically increases the risk of cardiac arrhythmia, hemodynamic instability, and death.",
    relatedFlashcardTopics: ["Diabetic Perioperative Management", "Insulin Protocols", "HbA1c", "Euglycemic DKA"]
  },
  {
    title: "Preoperative Assessment of the Geriatric Patient",
    slug: "preoperative-assessment-geriatric",
    domain: "Preoperative Patient Assessment",
    difficulty: "intermediate",
    content: `## Overview
Geriatric patients (age >= 65) represent a growing surgical population with unique physiological vulnerabilities. Age-related organ system changes, polypharmacy, frailty, cognitive decline, and decreased physiological reserve increase perioperative risk. The perioperative nurse must perform a comprehensive geriatric assessment to identify and mitigate these risks.

## Key Concepts
- **Cardiovascular changes**: Decreased cardiac output, increased SVR, reduced beta-receptor sensitivity, atherosclerosis, decreased baroreceptor response (prone to orthostatic hypotension).
- **Respiratory changes**: Decreased lung elasticity, reduced chest wall compliance, decreased vital capacity, impaired cough reflex, increased closing volumes (higher risk of atelectasis and pneumonia).
- **Renal changes**: Decreased GFR (by ~1% per year after age 30), reduced drug clearance, susceptibility to fluid/electrolyte imbalances, increased sensitivity to nephrotoxic agents.
- **Neurological changes**: Decreased neurotransmitter production, slower nerve conduction, increased risk of postoperative delirium and cognitive dysfunction (POCD). Delirium occurs in 15-50% of geriatric surgical patients.
- **Thermoregulation**: Reduced basal metabolic rate, decreased shivering response, thin subcutaneous fat — high risk for perioperative hypothermia.
- **Skin integrity**: Thinner, more fragile skin with reduced elasticity and decreased subcutaneous tissue — high risk for positioning injuries and pressure ulcers.
- **Polypharmacy**: Average geriatric patient takes 5-9 medications, increasing drug interaction risk and adverse drug event potential.

## Assessment Steps
1. Perform comprehensive medication reconciliation (including all OTC and supplements).
2. Assess cognitive function using a validated tool (Mini-Cog, MMSE, or CAM for delirium).
3. Evaluate functional status and mobility (can they transfer, ambulate independently?).
4. Screen for frailty using the Clinical Frailty Scale.
5. Assess nutritional status (albumin, BMI, unintentional weight loss).
6. Evaluate skin integrity and pressure injury risk (Braden Scale).
7. Assess sensory deficits (hearing aids, glasses — document and secure these items).
8. Review advance directives and code status.

## Interventions / Management
- Use forced-air warming devices preoperatively to prevent hypothermia.
- Maintain skin integrity with appropriate padding during transport and positioning.
- Advocate for reduced anesthesia dosing (geriatric patients are more sensitive to all anesthetics).
- Minimize unnecessary NPO time to prevent dehydration.
- Implement delirium prevention protocols: maintain sleep-wake cycle, ensure glasses/hearing aids are returned ASAP postoperatively, minimize anticholinergic medications.
- Use regional anesthesia when appropriate (may reduce delirium risk compared to general anesthesia).

## Clinical Pearls
- Postoperative delirium is the most common complication in geriatric surgical patients. Prevention is easier than treatment.
- Geriatric patients may not mount a fever in response to infection due to blunted immune response. Infection may present as delirium, confusion, or functional decline instead.
- Creatinine may be normal despite significantly reduced renal function because geriatric patients have reduced muscle mass (less creatinine production).
- Beers Criteria medications (inappropriate for geriatric use) should be flagged during preoperative medication reconciliation.

## Common Exam Pitfalls
- Assuming a normal creatinine means normal renal function in elderly patients.
- Not recognizing delirium risk as a major perioperative concern.
- Failing to adjust anesthesia expectations for age-related pharmacokinetic changes.`,
    checkpointQuestions: [
      {
        question: "An 80-year-old patient has a serum creatinine of 1.0 mg/dL. Does this necessarily indicate normal renal function?",
        options: ["Yes, it is within normal range", "No, geriatric patients may have reduced GFR despite normal creatinine due to decreased muscle mass", "Yes, creatinine is the gold standard for renal function", "No, it indicates renal impairment in elderly patients"],
        correctIndex: 1,
        rationale: "In geriatric patients, reduced muscle mass means less creatinine production. A 'normal' creatinine may actually mask significantly reduced GFR. GFR estimation using CKD-EPI equation (accounting for age) is more accurate."
      }
    ],
    commonMistakes: [
      "Assuming normal creatinine equals normal renal function in elderly patients",
      "Not screening for delirium risk preoperatively",
      "Overlooking polypharmacy and potential drug interactions",
      "Not addressing hypothermia risk proactively"
    ],
    examTrapWarning: "Normal creatinine does NOT equal normal renal function in geriatric patients. Delirium is the #1 complication in geriatric surgical patients. Prevention > treatment.",
    clinicalReasoning: "A 78-year-old patient presenting for hip fracture repair who is confused and combative in the preoperative area may already be experiencing delirium from pain, unfamiliar environment, sleep deprivation, or medication effects. This baseline cognitive status must be documented and communicated to guide postoperative comparison.",
    relatedFlashcardTopics: ["Geriatric Assessment", "Postoperative Delirium", "Age-Related Physiological Changes", "Frailty"]
  },
  {
    title: "Preoperative Assessment of the Obese Patient",
    slug: "preoperative-assessment-obese-patient",
    domain: "Preoperative Patient Assessment",
    difficulty: "intermediate",
    content: `## Overview
Obesity (BMI >= 30) and morbid obesity (BMI >= 40) present unique perioperative challenges including difficult airway management, positioning complications, altered drug pharmacokinetics, increased risk of DVT, surgical site infection, and respiratory compromise. The prevalence of obesity in surgical patients continues to rise, making this a critical knowledge area for perioperative nurses.

## Pathophysiology / Mechanism
Excess adipose tissue increases oxygen consumption and CO2 production, reduces functional residual capacity (FRC) and total lung capacity, creates restrictive lung physiology, and contributes to obstructive sleep apnea. Adipose tissue is metabolically active, producing inflammatory cytokines that impair wound healing and immune function. Altered drug distribution occurs because lipophilic drugs accumulate in fat stores, and dosing based on total body weight may lead to overdose.

## Key Concepts
- **Airway considerations**: Higher incidence of difficult intubation, limited neck mobility, redundant pharyngeal tissue, STOP-BANG score for OSA screening.
- **Positioning considerations**: Need for bariatric-rated OR table (weight capacity), extra padding for pressure points, risk of rhabdomyolysis with prolonged positioning, beach chair or ramped position for intubation.
- **Respiratory considerations**: Rapid desaturation during apnea (reduced FRC), higher risk of atelectasis, may need higher PEEP intraoperatively, increased risk of postoperative respiratory failure.
- **Cardiovascular considerations**: Hypertension, coronary artery disease, heart failure, increased blood volume, difficult peripheral IV access.
- **Drug dosing**: Use lean body weight (LBW) or adjusted body weight (ABW) for most drugs, not total body weight. Important for anticoagulants, antibiotics, and anesthetics.
- **VTE risk**: Obesity is an independent risk factor for VTE. Higher Caprini scores warrant aggressive prophylaxis.

## Assessment Steps
1. Calculate BMI and document. Note if bariatric-rated equipment is needed.
2. Perform STOP-BANG OSA screening (Snoring, Tired, Observed apnea, Pressure (HTN), BMI >35, Age >50, Neck circumference >40 cm, Gender male).
3. Assess airway using Mallampati, neck circumference, thyromental distance.
4. Assess for comorbidities: HTN, diabetes, OSA, GERD, coronary artery disease.
5. Verify bariatric-rated equipment availability: OR table, stirrups, transfer devices, blood pressure cuffs.
6. Assess IV access sites — may need longer angiocatheters or ultrasound-guided placement.

## Interventions / Management
- Position the patient in the ramped position (elevating the head and shoulders to align the ear with the sternal notch) for optimal intubation conditions.
- Use appropriately sized blood pressure cuffs (too-small cuffs give falsely high readings).
- Apply extra padding at all pressure points (heels, sacrum, elbows).
- Ensure adequate staffing for patient positioning and transfers.
- Administer weight-based antibiotic prophylaxis (cefazolin 3g for patients >= 120 kg).
- Monitor for compartment syndrome and rhabdomyolysis in prolonged procedures.

## Clinical Pearls
- Using a standard (adult) blood pressure cuff on an obese arm gives falsely ELEVATED readings. Always use the appropriate cuff size.
- The ramped position (head elevated so ear is at sternal notch level) significantly improves intubation success in obese patients.
- Obese patients desaturate rapidly during apnea because their reduced FRC provides minimal oxygen reserve. Preoxygenation is critical.
- Weight-based antibiotic dosing: Cefazolin 2g for patients < 120 kg, 3g for >= 120 kg per SCIP guidelines.

## Common Exam Pitfalls
- Using total body weight for all drug dosing in obese patients.
- Using a standard blood pressure cuff and accepting the (falsely elevated) reading.
- Not recognizing that obese patients desaturate faster during apnea.`,
    checkpointQuestions: [
      {
        question: "A morbidly obese patient (BMI 45, weight 140 kg) is scheduled for surgery. What cefazolin dose should be administered for prophylaxis?",
        options: ["1 gram", "2 grams", "3 grams", "4 grams"],
        correctIndex: 2,
        rationale: "For patients weighing >= 120 kg, the recommended cefazolin prophylaxis dose is 3 grams. Standard dosing (2g) may not achieve adequate tissue levels in morbidly obese patients."
      },
      {
        question: "What position optimizes intubation conditions in morbidly obese patients?",
        options: ["Flat supine position", "Trendelenburg position", "Ramped position (ear at sternal notch)", "Lateral decubitus position"],
        correctIndex: 2,
        rationale: "The ramped position, achieved by elevating the head and shoulders until the ear is at the level of the sternal notch, optimizes upper airway alignment and improves intubation success in obese patients."
      }
    ],
    commonMistakes: [
      "Using standard-sized blood pressure cuffs on obese patients",
      "Not adjusting antibiotic prophylaxis doses for patient weight",
      "Failing to preoxygenate adequately before induction",
      "Not requesting bariatric-rated equipment in advance"
    ],
    examTrapWarning: "BP cuff too small = falsely HIGH reading. Cefazolin 3g for >= 120 kg. Ramped position for intubation. Obese patients desaturate FAST during apnea.",
    clinicalReasoning: "An obese patient (145 kg) receiving enoxaparin for DVT prophylaxis should receive an adjusted dose based on actual body weight rather than fixed dosing, as fixed dosing may be subtherapeutic. Anti-Xa levels may be monitored to verify adequate anticoagulation in morbidly obese patients.",
    relatedFlashcardTopics: ["Obesity Perioperative Considerations", "Bariatric Surgery", "OSA Screening", "Weight-Based Dosing"]
  },
  {
    title: "Preoperative Assessment of the Pediatric Patient",
    slug: "preoperative-assessment-pediatric",
    domain: "Preoperative Patient Assessment",
    difficulty: "intermediate",
    content: `## Overview
Pediatric patients present unique perioperative challenges related to anatomical differences, physiological immaturity, developmental considerations, and the involvement of parents/caregivers in the care plan. Understanding age-specific assessment parameters and developmental needs is essential for safe perioperative nursing care of children.

## Key Concepts
- **Airway differences**: Infants are obligate nasal breathers. Pediatric airway is funnel-shaped (narrowest at cricoid ring vs. adult's vocal cords). Large tongue relative to mouth size. Epiglottis is longer and more omega-shaped. Larynx is higher (C3-C4 vs. C4-C6 in adults). Higher risk of laryngospasm.
- **Respiratory differences**: Higher metabolic rate and oxygen consumption per kg. Smaller FRC relative to tidal volume. Rapid desaturation during apnea. Compliant chest wall with fewer Type I muscle fibers (fatigue easily).
- **Cardiovascular differences**: Heart rate-dependent cardiac output (limited ability to increase stroke volume). Normal heart rate varies by age (newborn 120-160, infant 100-150, toddler 90-130, school-age 70-110).
- **Thermoregulation**: Large body surface area to mass ratio. Limited brown fat stores (except neonates). Rapid heat loss through radiation, convection, and evaporation.
- **Fluid management**: Weight-based fluid calculations (4-2-1 rule for maintenance: 4 mL/kg/hr for first 10 kg, 2 mL/kg/hr for next 10 kg, 1 mL/kg/hr for each kg above 20). Smaller margin for fluid overload or deficit.
- **Consent considerations**: Parent/legal guardian provides consent. Older children should be included in assent discussions. Emancipated minors can consent for themselves.

## Assessment Steps
1. Obtain accurate weight in kilograms (all medication and fluid calculations are weight-based).
2. Assess developmental stage and tailor communication accordingly.
3. Verify NPO status using pediatric-specific guidelines (breast milk 4h, formula 6h).
4. Assess for upper respiratory infection (URI) symptoms — may require surgery postponement.
5. Check immunization status and recent illnesses.
6. Evaluate loose teeth (aspiration risk during airway management).
7. Include parents in the assessment process to obtain accurate history.

## Interventions / Management
- Maintain thermoregulation using forced-air warmers, warm IV fluids, increased OR temperature.
- Use age-appropriate communication and distraction techniques (toys, tablets, stories).
- Allow parental presence during induction if facility policy permits.
- Calculate all medications and fluids based on actual body weight in kilograms.
- Have appropriately sized airway equipment available (Broselow tape for weight estimation in emergencies).
- Minimize preoperative fasting time to reduce dehydration and hypoglycemia risk.

## Clinical Pearls
- Children with a URI in the last 2-4 weeks have increased airway reactivity and bronchospasm risk. Most anesthesiologists will postpone elective surgery for 4-6 weeks after a URI with lower respiratory symptoms.
- The Broselow tape estimates weight based on length and is a critical tool for emergency pediatric dosing.
- Separation anxiety peaks between ages 1-3. These children benefit most from parental presence during induction.
- Loose teeth in school-age children must be documented; if very loose, consider removal before intubation to prevent aspiration.

## Common Exam Pitfalls
- Using adult airway anatomy knowledge for pediatric patients. The narrowest point in a child's airway is the cricoid ring (subglottic), not the vocal cords.
- Not recognizing that infants are obligate nasal breathers. Nasal congestion can cause significant respiratory distress.`,
    checkpointQuestions: [
      {
        question: "What is the narrowest portion of a child's airway?",
        options: ["Vocal cords", "Cricoid ring (subglottic area)", "Pharynx", "Nares"],
        correctIndex: 1,
        rationale: "In children, the airway is funnel-shaped with the narrowest point at the cricoid ring (subglottic area). In adults, the narrowest point is at the vocal cords. This anatomical difference is critical for endotracheal tube sizing."
      },
      {
        question: "Using the 4-2-1 rule, what is the hourly maintenance fluid rate for a 25 kg child?",
        options: ["50 mL/hr", "55 mL/hr", "60 mL/hr", "65 mL/hr"],
        correctIndex: 3,
        rationale: "4-2-1 rule: First 10 kg = 4 mL/kg/hr = 40 mL/hr. Next 10 kg = 2 mL/kg/hr = 20 mL/hr. Remaining 5 kg = 1 mL/kg/hr = 5 mL/hr. Total = 40 + 20 + 5 = 65 mL/hr."
      }
    ],
    commonMistakes: [
      "Using adult airway anatomy references for pediatric patients",
      "Not verifying weight in kilograms for all calculations",
      "Overlooking URI symptoms and proceeding with surgery",
      "Not documenting loose teeth"
    ],
    examTrapWarning: "Pediatric airway narrowest at CRICOID RING (not vocal cords). Infants are OBLIGATE NASAL BREATHERS. Always use weight in KG for ALL calculations. 4-2-1 rule for maintenance fluids.",
    clinicalReasoning: "A 3-year-old child who is clinging to their mother and crying when the nurse approaches is displaying normal separation anxiety for their developmental stage. The perioperative nurse should allow the parent to remain with the child, use play-based communication, and consider facilitating parental presence during induction.",
    relatedFlashcardTopics: ["Pediatric Airway", "4-2-1 Rule", "Developmental Stages", "Pediatric Perioperative Care"]
  }
];
