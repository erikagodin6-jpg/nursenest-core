import { EmergencyNursingQuestion } from "./types";

export const neuroEmergency3Questions: EmergencyNursingQuestion[] = [
  {
    stem: "A 72-year-old male presents with sudden onset right arm weakness and expressive aphasia. Symptoms began 90 minutes ago. CT head is negative for hemorrhage. CT angiography reveals a left middle cerebral artery (MCA) occlusion. NIHSS score is 18. What is the optimal treatment approach?",
    options: [
      "IV alteplase alone within the 4.5-hour window",
      "IV alteplase followed by endovascular thrombectomy for large vessel occlusion",
      "Endovascular thrombectomy alone without IV alteplase",
      "Antiplatelet therapy with aspirin 325 mg and clopidogrel 75 mg"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with an acute ischemic stroke with large vessel occlusion (LVO) of the left MCA, high NIHSS score (18, indicating severe stroke), within the IV alteplase treatment window (< 4.5 hours), and with confirmed LVO on CT angiography. The optimal treatment is the 'drip and ship' or 'bridging therapy' approach: IV alteplase (drip) followed by endovascular mechanical thrombectomy (ship). Multiple landmark clinical trials (MR CLEAN, ESCAPE, EXTEND-IA, SWIFT PRIME, REVASCAT) have demonstrated that endovascular thrombectomy for LVO significantly improves functional outcomes compared to IV alteplase alone, with a number needed to treat (NNT) of only 2.6 to achieve functional independence. However, IV alteplase should still be given first (if within the treatment window) because: (1) it can begin dissolving the clot while thrombectomy is being arranged, (2) it may recanalize some vessels before the interventionalist arrives, and (3) it treats any distal thrombi that the thrombectomy device may not reach. The thrombectomy should be performed within 6 hours of symptom onset (extended to 24 hours in selected patients with favorable perfusion imaging per the DAWN and DEFUSE-3 trials). LVO criteria for thrombectomy typically include: occlusion of the internal carotid artery (ICA) or MCA M1 segment, NIHSS ≥ 6, and modified Rankin Scale ≤ 1 at baseline. The emergency nurse's role includes: administering IV alteplase per protocol, performing serial NIHSS assessments, coordinating transfer to a comprehensive stroke center if thrombectomy is not available on-site, and monitoring for hemorrhagic complications.",
    learningObjective: "Apply bridging therapy (IV alteplase + endovascular thrombectomy) for acute ischemic stroke with large vessel occlusion",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Acute Ischemic Stroke",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "IV alteplase should still be given before thrombectomy if within the treatment window - don't skip the 'drip' in 'drip and ship'",
    clinicalPearls: [
      "LVO thrombectomy NNT = 2.6 for functional independence - one of the most effective treatments in medicine",
      "Thrombectomy window: 6 hours standard, up to 24 hours with favorable perfusion imaging",
      "NIHSS ≥ 6 with ICA or MCA M1 occlusion = candidate for thrombectomy",
      "IV alteplase should still be given as bridge to thrombectomy if within the treatment window"
    ],
    safetyNote: "Time is brain: every 15-minute delay in treatment results in measurably worse outcomes - minimize door-to-needle time",
    distractorRationales: [
      "IV alteplase alone is suboptimal for LVO - thrombectomy provides significantly better outcomes",
      "Bridging therapy (IV alteplase + thrombectomy) is the optimal approach for LVO within treatment window",
      "Thrombectomy alone (skipping alteplase) is only appropriate if alteplase is contraindicated",
      "Antiplatelet therapy alone is inadequate for acute LVO stroke"
    ],
    lessonLink: "/emergency/lessons/acute-ischemic-stroke"
  },
  {
    stem: "A 45-year-old female presents with the worst headache of her life that started suddenly while lifting weights. CT head is negative. What is the next diagnostic step the emergency nurse should anticipate?",
    options: [
      "Discharge with migraine medication and neurology follow-up",
      "Lumbar puncture to evaluate for subarachnoid hemorrhage",
      "MRI brain with contrast for detailed brain imaging",
      "CT angiography of the head and neck"
    ],
    correctAnswer: 1,
    rationaleLong: "The clinical scenario describes a 'thunderclap headache' - sudden onset, severe (worst headache of life) headache during exertion (Valsalva maneuver while lifting weights). This presentation is classic for subarachnoid hemorrhage (SAH) until proven otherwise. While CT head is highly sensitive for SAH in the first 6 hours (approximately 98-100%), its sensitivity drops significantly after 6 hours (93% at 12 hours, 85% at 24 hours, 50% at 1 week). Therefore, a negative CT does NOT rule out SAH, and the next step is a lumbar puncture (LP) to evaluate cerebrospinal fluid (CSF) for evidence of blood. The LP should be performed at least 6-12 hours after symptom onset to allow sufficient time for red blood cell lysis and xanthochromia (yellow discoloration of CSF from bilirubin) to develop. CSF findings in SAH include: (1) elevated red blood cell count that does NOT clear in successive tubes (unlike traumatic tap), (2) xanthochromia (present in > 95% of SAH cases after 12 hours), and (3) elevated opening pressure. If the LP is positive, the patient needs emergent CT angiography to identify the source of hemorrhage (most commonly a ruptured cerebral aneurysm) and neurosurgical consultation for aneurysm repair (surgical clipping or endovascular coiling). Discharging a patient with a thunderclap headache after only a negative CT is a well-known medicolegal pitfall - missed SAH has a mortality rate of approximately 50%. MRI can detect SAH but is less immediately available than LP and may miss small hemorrhages. CT angiography may be reasonable as an alternative to LP in some institutions but LP remains the standard next step after negative CT.",
    learningObjective: "Pursue lumbar puncture after negative CT in thunderclap headache to evaluate for subarachnoid hemorrhage",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Subarachnoid Hemorrhage",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Negative CT does NOT rule out SAH - LP is required for definitive exclusion, especially > 6 hours after onset",
    clinicalPearls: [
      "Thunderclap headache = SAH until proven otherwise",
      "CT sensitivity for SAH: 98-100% at < 6 hours, drops significantly thereafter",
      "LP findings of SAH: non-clearing RBCs in successive tubes + xanthochromia",
      "Wait 6-12 hours after onset for LP to allow xanthochromia to develop"
    ],
    safetyNote: "Missed SAH has 50% mortality - NEVER discharge a thunderclap headache patient without CT AND LP evaluation",
    distractorRationales: [
      "Discharging with only a negative CT risks missing SAH with catastrophic consequences",
      "LP is the standard next step to evaluate for SAH when CT is negative",
      "MRI is less immediately available and may miss small hemorrhages",
      "CTA is valuable for identifying the aneurysm source but LP is needed first to confirm SAH"
    ],
    lessonLink: "/emergency/lessons/subarachnoid-hemorrhage"
  },
  {
    stem: "A 58-year-old male with a history of seizure disorder on carbamazepine presents with generalized tonic-clonic seizure activity lasting 8 minutes. The seizure is ongoing. IV lorazepam 4 mg has been administered twice without effect. What is the next medication the emergency nurse should prepare?",
    options: [
      "IV phenobarbital 20 mg/kg loading dose",
      "IV fosphenytoin 20 mg PE/kg loading dose",
      "IV midazolam 0.2 mg/kg continuous infusion",
      "IV levetiracetam 60 mg/kg (max 4,500 mg)"
    ],
    correctAnswer: 3,
    rationaleLong: "This patient is in status epilepticus (SE), defined as a seizure lasting > 5 minutes or recurrent seizures without return to baseline. The seizure has failed first-line benzodiazepine therapy (two doses of lorazepam), which constitutes established status epilepticus. According to the 2016 AES guidelines and current practice, the second-line treatment options for established SE include: IV fosphenytoin (20 mg PE/kg), IV valproate (40 mg/kg), or IV levetiracetam (60 mg/kg, max 4,500 mg). However, in this specific clinical scenario, the patient is already on carbamazepine. Fosphenytoin (phenytoin prodrug) shares a similar mechanism of action with carbamazepine (both are sodium channel blockers), making cross-tolerance a concern and reducing its expected efficacy. Additionally, fosphenytoin has a slower infusion rate requirement and more cardiac side effects (hypotension, arrhythmias). IV levetiracetam has emerged as a preferred second-line agent in many centers because: (1) it has a unique mechanism of action (SV2A protein binding) with no cross-tolerance to sodium channel blockers, (2) it has fewer cardiovascular side effects than fosphenytoin, (3) it requires no cardiac monitoring during infusion, (4) it has fewer drug-drug interactions, and (5) the ESETT trial showed equivalent efficacy among fosphenytoin, valproate, and levetiracetam for established SE. The emergency nurse should prepare the infusion and administer over 15 minutes. If SE continues after second-line therapy, this becomes refractory status epilepticus (RSE), requiring continuous infusion of midazolam, propofol, or pentobarbital with continuous EEG monitoring and ICU admission.",
    learningObjective: "Select appropriate second-line anticonvulsant for established status epilepticus based on patient's current medications",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Status Epilepticus",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Consider cross-tolerance when selecting second-line SE agents - avoid fosphenytoin in patients already on carbamazepine",
    clinicalPearls: [
      "SE algorithm: benzodiazepine → fosphenytoin/valproate/levetiracetam → continuous infusion",
      "ESETT trial: fosphenytoin, valproate, and levetiracetam are equally effective for established SE",
      "Levetiracetam has fewer cardiovascular side effects and drug interactions than fosphenytoin",
      "Refractory SE (fails 2 agents) requires continuous infusion + EEG monitoring in ICU"
    ],
    safetyNote: "Fosphenytoin requires cardiac monitoring during infusion due to risk of hypotension and arrhythmias - not needed with levetiracetam",
    distractorRationales: [
      "Phenobarbital is a third-line option due to respiratory depression and sedation",
      "Fosphenytoin shares mechanism with carbamazepine, creating cross-tolerance concerns",
      "Midazolam continuous infusion is for refractory SE after second-line agents fail",
      "Levetiracetam is appropriate given the unique mechanism and patient's carbamazepine use"
    ],
    lessonLink: "/emergency/lessons/status-epilepticus"
  },
  {
    stem: "A 35-year-old male presents after a seizure. He has a medical alert bracelet indicating epilepsy. He is in the postictal state: confused, drowsy, and answering questions with single words. GCS is 12 (E3V4M5). The emergency nurse should know that postictal confusion typically resolves within what timeframe?",
    options: [
      "1-5 minutes",
      "15-30 minutes",
      "2-4 hours",
      "24-48 hours"
    ],
    correctAnswer: 1,
    rationaleLong: "The postictal state following a generalized tonic-clonic seizure typically lasts 15-30 minutes but can extend up to 1-2 hours in some cases. During this period, patients experience confusion, drowsiness, fatigue, headache, and sometimes focal neurological deficits (Todd's paralysis - transient weakness on one side lasting up to 24-48 hours). Understanding the expected postictal duration is clinically important because: (1) if the patient's mental status does not begin to improve within 30-60 minutes, the emergency nurse should suspect ongoing non-convulsive status epilepticus (NCSE) - seizure activity in the brain without visible convulsions - which requires EEG monitoring and aggressive anticonvulsant therapy. (2) Prolonged confusion or obtundation may indicate an underlying cause that triggered the seizure, such as meningitis, encephalitis, metabolic derangement, intracranial hemorrhage, or tumor. The emergency nurse should: perform serial neurological assessments (GCS every 15 minutes), position the patient in the recovery position, suction the airway as needed, protect the patient from injury, check blood glucose (hypoglycemia is a common seizure trigger), obtain labs (electrolytes, anticonvulsant levels, glucose, toxicology screen), and monitor for repeat seizures. A CT head should be obtained if: first-time seizure, prolonged postictal state, focal deficits, signs of trauma, anticoagulant use, immunocompromised state, or persistent altered mental status. 1-5 minutes is too short for postictal confusion after a generalized seizure. 2-4 hours and 24-48 hours are excessive for typical postictal confusion and should prompt further evaluation.",
    learningObjective: "Recognize normal postictal duration (15-30 minutes) and identify prolonged confusion as indicating possible ongoing NCSE or underlying pathology",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Seizure Management",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Postictal confusion lasting > 30-60 minutes should prompt evaluation for non-convulsive status epilepticus",
    clinicalPearls: [
      "Typical postictal confusion: 15-30 minutes after generalized tonic-clonic seizure",
      "Prolonged postictal state > 30-60 min → consider NCSE, infection, metabolic, or structural causes",
      "Todd's paralysis: transient focal weakness after seizure, lasting up to 24-48 hours",
      "Always check blood glucose in seizure patients - hypoglycemia is a common, treatable trigger"
    ],
    safetyNote: "Place all postictal patients in the recovery position to prevent aspiration - they cannot protect their airway while confused",
    distractorRationales: [
      "1-5 minutes is too short for postictal confusion after a generalized seizure",
      "15-30 minutes is the typical duration for postictal confusion",
      "2-4 hours of confusion should prompt evaluation for underlying pathology or NCSE",
      "24-48 hours of confusion is not typical and requires urgent investigation"
    ],
    lessonLink: "/emergency/lessons/seizure-management"
  },
  {
    stem: "A 60-year-old male presents with acute onset of vertigo, nystagmus, ataxia, dysphagia, and ipsilateral Horner syndrome (ptosis, miosis, anhidrosis). CT head is negative. Which vascular territory stroke should the emergency nurse suspect?",
    options: [
      "Anterior cerebral artery (ACA) stroke",
      "Middle cerebral artery (MCA) stroke",
      "Posterior inferior cerebellar artery (PICA) stroke (lateral medullary syndrome)",
      "Basilar artery occlusion"
    ],
    correctAnswer: 2,
    rationaleLong: "The combination of vertigo, nystagmus, ataxia, dysphagia, and ipsilateral Horner syndrome (ptosis, miosis, anhidrosis) is the classic presentation of lateral medullary syndrome (Wallenberg syndrome), caused by occlusion of the posterior inferior cerebellar artery (PICA) or the vertebral artery. The lateral medulla contains several important structures that, when infarcted, produce this characteristic syndrome: (1) Vestibular nuclei → vertigo, nystagmus, nausea/vomiting; (2) Inferior cerebellar peduncle → ipsilateral ataxia and dysmetria; (3) Nucleus ambiguus → dysphagia, hoarseness, ipsilateral palatal weakness; (4) Descending sympathetic tract → ipsilateral Horner syndrome; (5) Spinothalamic tract → contralateral loss of pain and temperature sensation in the body; (6) Spinal trigeminal nucleus → ipsilateral loss of pain and temperature sensation in the face. The CT being negative is expected because CT has poor sensitivity for posterior fossa strokes (particularly in the brainstem) - MRI with diffusion-weighted imaging (DWI) is far superior for detecting posterior circulation strokes. ACA strokes cause contralateral leg weakness. MCA strokes cause contralateral face and arm weakness with aphasia or neglect. Basilar artery occlusion causes bilateral symptoms including quadriplegia, bilateral cranial nerve palsies, and coma. The emergency nurse should obtain emergent MRI with DWI, assess swallowing function before any oral intake (aspiration risk is high with medullary strokes), and treat within the standard stroke treatment windows if within time criteria.",
    learningObjective: "Recognize lateral medullary (Wallenberg) syndrome as a PICA territory stroke with characteristic clinical findings",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Posterior Circulation Stroke",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "CT has poor sensitivity for posterior fossa strokes - a negative CT does NOT rule out brainstem infarction",
    clinicalPearls: [
      "Wallenberg syndrome: vertigo + ataxia + dysphagia + Horner syndrome + crossed sensory loss",
      "PICA or vertebral artery occlusion causes lateral medullary infarction",
      "CT misses posterior fossa strokes - MRI with DWI is the gold standard",
      "NPO until swallowing assessed - aspiration risk is high with medullary strokes"
    ],
    safetyNote: "NEVER give oral medications or fluids to a patient with suspected brainstem stroke until swallowing function is formally assessed",
    distractorRationales: [
      "ACA strokes cause contralateral leg weakness, not vertigo or Horner syndrome",
      "MCA strokes cause contralateral face/arm weakness with aphasia, not this symptom pattern",
      "PICA stroke (Wallenberg syndrome) produces this classic lateral medullary presentation",
      "Basilar artery occlusion causes bilateral symptoms and coma, not this lateralized pattern"
    ],
    lessonLink: "/emergency/lessons/posterior-circulation-stroke"
  },
  {
    stem: "A 25-year-old male is brought to the ED after being found unconscious at a party. GCS is 7. His right pupil is 6 mm and non-reactive; the left pupil is 3 mm and reactive. CT head shows a right temporal epidural hematoma with 8 mm of midline shift. What is the emergency nurse's priority while preparing for surgery?",
    options: [
      "Elevate the head of bed to 30 degrees and administer IV mannitol 1 g/kg",
      "Start IV dexamethasone 10 mg for cerebral edema reduction",
      "Administer IV phenytoin for seizure prophylaxis",
      "Apply hypothermia protocol to reduce intracranial pressure"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient has a large epidural hematoma with significant midline shift (8 mm) and signs of uncal herniation (unilateral fixed, dilated pupil on the side of the hematoma). This is a neurosurgical emergency requiring emergent craniotomy for hematoma evacuation. While preparing for surgery, the emergency nurse's priority is to implement measures to reduce intracranial pressure (ICP) and prevent further brain herniation. The two immediate ICP-lowering interventions are: (1) Head of bed elevation to 30 degrees: reduces ICP by promoting venous drainage from the brain through the jugular veins. The head should be kept midline (not turned) to avoid kinking the jugular veins. (2) IV mannitol 1 g/kg: an osmotic diuretic that creates an osmotic gradient between the blood and brain tissue, drawing water out of the brain parenchyma and reducing cerebral edema. Onset of action is 15-30 minutes. Alternative osmotherapy includes hypertonic saline (23.4% NaCl 30 mL via central line or 3% NaCl 250 mL bolus). Additional ICP-reducing measures include: maintaining PaCO2 30-35 mmHg through controlled hyperventilation (temporary measure only), ensuring adequate sedation and analgesia, avoiding hyperthermia, and maintaining MAP to ensure cerebral perfusion pressure (CPP = MAP - ICP) > 60 mmHg. Dexamethasone is effective for vasogenic edema from brain tumors but is NOT effective for traumatic cerebral edema. Phenytoin for seizure prophylaxis is appropriate but is not the priority over immediate ICP reduction. Hypothermia has not shown benefit for TBI in large trials.",
    learningObjective: "Implement emergent ICP reduction measures (head elevation and mannitol) for epidural hematoma with herniation signs",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Traumatic Brain Injury",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Dexamethasone works for tumor-related edema but is NOT effective for traumatic brain injury edema",
    clinicalPearls: [
      "Uncal herniation sign: ipsilateral fixed dilated pupil (CN III compression)",
      "Head of bed 30 degrees + midline position promotes jugular venous drainage",
      "Mannitol 1 g/kg onset: 15-30 minutes; creates osmotic gradient to reduce brain edema",
      "CPP = MAP - ICP; target CPP > 60 mmHg in TBI"
    ],
    safetyNote: "Bilateral fixed dilated pupils in TBI is a pre-terminal sign requiring immediate intervention - do not delay for any reason",
    distractorRationales: [
      "Head elevation and mannitol are the correct priority ICP-reduction measures",
      "Dexamethasone is ineffective for traumatic cerebral edema",
      "Phenytoin is appropriate but not the priority over ICP reduction in herniation",
      "Hypothermia has not shown benefit in traumatic brain injury trials"
    ],
    lessonLink: "/emergency/lessons/traumatic-brain-injury"
  },
  {
    stem: "A 68-year-old female with new-onset atrial fibrillation presents with sudden right-sided weakness and global aphasia. Symptom onset was 2 hours ago. CT head is negative for hemorrhage. NIHSS is 22. Before administering IV alteplase, what blood test result must the nurse have?",
    options: [
      "Complete blood count with platelet count",
      "Blood glucose level",
      "Serum creatinine and BUN",
      "Coagulation studies (PT/INR) and troponin"
    ],
    correctAnswer: 1,
    rationaleLong: "According to the AHA/ASA guidelines for acute ischemic stroke, the ONLY laboratory test that must be resulted before administering IV alteplase is blood glucose. This is because hypoglycemia (blood glucose < 50 mg/dL) can mimic stroke symptoms (hemiparesis, aphasia, altered consciousness) and must be excluded before giving thrombolytics. Treating hypoglycemia with dextrose may resolve the 'stroke' symptoms entirely, making thrombolytic therapy unnecessary and potentially harmful. Other laboratory tests (CBC, coagulation studies, metabolic panel, troponin) should be drawn and sent BEFORE alteplase administration, but the results do NOT need to be available before starting the infusion - UNLESS there is clinical suspicion for a specific abnormality that would contraindicate thrombolysis. For example: (1) If the patient is known to be on warfarin, the INR must be checked before alteplase (alteplase is contraindicated if INR > 1.7). (2) If the patient is known to be on heparin, the aPTT must be checked. (3) If clinical suspicion for thrombocytopenia exists (e.g., hematologic malignancy), the platelet count must result first (alteplase is contraindicated if platelets < 100,000). However, in the absence of specific clinical concerns about these conditions, only blood glucose is absolutely required before treatment. This principle reflects the critical importance of minimizing door-to-needle time - every minute of delay in alteplase administration results in approximately 1.9 million neurons lost. The target door-to-needle time is ≤ 60 minutes, with many centers achieving ≤ 30 minutes.",
    learningObjective: "Identify blood glucose as the only mandatory pre-alteplase lab result to avoid treating hypoglycemia with thrombolytics",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Acute Ischemic Stroke",
    difficulty: 3,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Only BLOOD GLUCOSE must result before alteplase - don't delay treatment waiting for other labs unless clinically indicated",
    clinicalPearls: [
      "Only blood glucose must result before alteplase administration",
      "Draw all other labs but don't wait for results unless specific clinical concern",
      "Hypoglycemia < 50 mg/dL can perfectly mimic stroke (stroke mimic)",
      "Every minute of delay = ~1.9 million neurons lost; target door-to-needle ≤ 60 minutes"
    ],
    safetyNote: "If patient is known to be on warfarin, INR must result before alteplase - contraindicated if INR > 1.7",
    distractorRationales: [
      "CBC should be drawn but results are not required before alteplase unless thrombocytopenia is suspected",
      "Blood glucose is the only mandatory pre-alteplase lab result",
      "Renal function is important but does not need to result before alteplase",
      "Coagulation studies should be drawn but only need to result if patient is on anticoagulants"
    ],
    lessonLink: "/emergency/lessons/acute-ischemic-stroke"
  },
  {
    stem: "A 40-year-old female presents with progressive ascending weakness starting in her legs 3 days ago, now involving her arms. She had a respiratory infection 2 weeks prior. Deep tendon reflexes are absent bilaterally. She reports tingling in her feet and hands. Which diagnostic test should the emergency nurse anticipate?",
    options: [
      "CT head to evaluate for intracranial pathology",
      "Lumbar puncture showing albuminocytologic dissociation",
      "MRI spine to evaluate for cord compression",
      "Electromyography and nerve conduction studies"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with classic Guillain-Barré syndrome (GBS): ascending symmetric weakness progressing over days, preceded by a respiratory infection 2-3 weeks earlier, absent deep tendon reflexes (areflexia), and distal paresthesias. GBS is an acute inflammatory demyelinating polyneuropathy caused by an autoimmune attack on peripheral nerve myelin, often triggered by preceding infection (Campylobacter jejuni gastroenteritis, CMV, EBV, or respiratory infections). The hallmark diagnostic finding in GBS is albuminocytologic dissociation on lumbar puncture - elevated CSF protein (> 45 mg/dL) with a normal or near-normal white blood cell count (< 10 cells/μL). This pattern reflects the inflammatory process affecting the nerve roots within the subarachnoid space, causing protein leakage without significant cellular infiltration. It is important to note that CSF protein may be normal in the first week of illness and may need to be repeated. The critical assessment for the emergency nurse is monitoring respiratory function. GBS can rapidly progress to respiratory failure as the ascending paralysis reaches the diaphragm. The emergency nurse should: (1) measure forced vital capacity (FVC) and negative inspiratory force (NIF) every 2-4 hours, (2) intubate if FVC < 20 mL/kg or NIF < -30 cm H2O (the 20/30 rule), (3) monitor for autonomic dysfunction (labile blood pressure, arrhythmias, urinary retention), (4) initiate treatment with IV immunoglobulin (IVIG) or plasmapheresis. CT head would be normal in GBS. MRI spine might show nerve root enhancement but is not the primary diagnostic test. EMG/NCS confirms the diagnosis but takes time to arrange and is not the initial test in the ED.",
    learningObjective: "Diagnose Guillain-Barré syndrome and monitor respiratory function for impending respiratory failure",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Guillain-Barré Syndrome",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Monitor FVC and NIF every 2-4 hours in GBS - intubate when FVC < 20 mL/kg or NIF < -30 (the 20/30 rule)",
    clinicalPearls: [
      "GBS: ascending weakness + areflexia + preceding infection 2-3 weeks prior",
      "Albuminocytologic dissociation: elevated CSF protein with normal WBC count",
      "20/30 rule for intubation: FVC < 20 mL/kg OR NIF < -30 cm H2O",
      "Treatment: IVIG or plasmapheresis (equally effective)"
    ],
    safetyNote: "GBS can cause respiratory failure within hours - serial FVC and NIF measurements are essential for early intubation planning",
    distractorRationales: [
      "CT head would be normal in GBS - the pathology is in peripheral nerves",
      "LP showing albuminocytologic dissociation is the hallmark diagnostic finding",
      "MRI spine might show enhancement but is not the primary diagnostic test",
      "EMG/NCS confirms diagnosis but is not the initial ED diagnostic test"
    ],
    lessonLink: "/emergency/lessons/guillain-barre-syndrome"
  },
  {
    stem: "A 55-year-old male presents with acute onset of the worst headache of his life, vomiting, and neck stiffness. CT head reveals diffuse subarachnoid hemorrhage. Blood pressure is 192/108 mmHg. While awaiting neurosurgical consultation, what blood pressure target should the emergency nurse maintain?",
    options: [
      "SBP < 140 mmHg to minimize rebleeding risk",
      "SBP < 160 mmHg with gradual reduction over 24 hours",
      "SBP < 180 mmHg to maintain cerebral perfusion",
      "No blood pressure reduction until the aneurysm is secured"
    ],
    correctAnswer: 0,
    rationaleLong: "In acute aneurysmal subarachnoid hemorrhage (aSAH), the current AHA/ASA guidelines recommend maintaining systolic blood pressure < 140 mmHg before the aneurysm is secured (clipped or coiled). This aggressive blood pressure target is based on the understanding that rebleeding is the most devastating early complication of aSAH, occurring in approximately 4-14% of patients within the first 24 hours, with a mortality rate of 70-80% when it occurs. Higher systolic blood pressure is a significant modifiable risk factor for rebleeding - each 10 mmHg increase in SBP above 160 mmHg increases rebleeding risk. The blood pressure reduction should be achieved using easily titratable IV antihypertensive agents: (1) IV nicardipine infusion (5-15 mg/hour) is the preferred agent due to smooth, predictable blood pressure reduction, (2) IV labetalol (10-20 mg boluses or infusion) is an alternative, (3) IV clevidipine (1-2 mg/hour, titrate to effect). Nitroprusside should be avoided because it can increase intracranial pressure through cerebral vasodilation. The balance in SAH management is between reducing rebleeding risk (lower BP) and maintaining adequate cerebral perfusion to prevent delayed cerebral ischemia from vasospasm (which typically occurs days 4-14 post-hemorrhage). Before the aneurysm is secured, preventing rebleeding takes priority. Additional SAH management includes: (1) nimodipine 60 mg PO every 4 hours for 21 days (reduces vasospasm-related poor outcomes), (2) seizure prophylaxis, (3) pain management (avoid excessive straining), (4) bed rest with head of bed elevated 30 degrees, and (5) monitoring for hydrocephalus (may require external ventricular drain).",
    learningObjective: "Maintain SBP < 140 mmHg in acute SAH before aneurysm securing to minimize rebleeding risk",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Subarachnoid Hemorrhage",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "In SAH, SBP target < 140 before aneurysm is secured; avoid nitroprusside as it can increase ICP",
    clinicalPearls: [
      "SAH rebleeding risk is 4-14% in first 24 hours with 70-80% mortality",
      "Target SBP < 140 mmHg before aneurysm is secured",
      "Nimodipine 60 mg PO q4h x 21 days for vasospasm prevention",
      "Vasospasm window: days 4-14 post-hemorrhage - monitor for new deficits"
    ],
    safetyNote: "Nimodipine is the ONLY calcium channel blocker proven to improve outcomes in SAH - do not substitute with other CCBs",
    distractorRationales: [
      "SBP < 140 mmHg is the current guideline target to minimize rebleeding risk",
      "SBP < 160 is not aggressive enough based on current evidence",
      "SBP < 180 allows too much rebleeding risk",
      "Allowing uncontrolled hypertension significantly increases rebleeding risk"
    ],
    lessonLink: "/emergency/lessons/subarachnoid-hemorrhage"
  },
  {
    stem: "A 70-year-old male on warfarin (INR 3.4) presents with sudden onset left hemiparesis and headache. CT head shows a 4-cm right basal ganglia intracerebral hemorrhage with intraventricular extension. What is the emergency nurse's priority medication?",
    options: [
      "IV vitamin K 10 mg infused over 20 minutes",
      "IV 4-factor prothrombin complex concentrate (PCC) for immediate INR reversal",
      "Fresh frozen plasma 4 units for coagulation factor replacement",
      "IV tranexamic acid 1 gram for antifibrinolytic effect"
    ],
    correctAnswer: 1,
    rationaleLong: "In warfarin-associated intracerebral hemorrhage (ICH), the immediate priority is rapid and complete reversal of anticoagulation to stop hemorrhage expansion. Hemorrhage expansion occurs in approximately 70% of patients with warfarin-associated ICH if anticoagulation is not rapidly reversed, and it is the strongest predictor of early neurological deterioration and death. The current AHA/ASA guidelines recommend 4-factor prothrombin complex concentrate (4F-PCC) as the preferred reversal agent for warfarin-associated ICH because: (1) it provides immediate INR reversal within 15-30 minutes (compared to hours for FFP or vitamin K), (2) it contains all four vitamin K-dependent clotting factors (II, VII, IX, X) in concentrated form, (3) it requires a small volume (typically 25-50 mL) compared to FFP (typically 4-6 units = 800-1500 mL), reducing the risk of volume overload, (4) it does not require thawing time like FFP (which can take 30-45 minutes). IV vitamin K should be given CONCURRENTLY with PCC, but vitamin K alone takes 6-24 hours to restore clotting factor synthesis and is far too slow for this emergency. Vitamin K is needed because PCC provides temporary factor replacement that will be metabolized, and vitamin K ensures sustained reversal by restoring endogenous factor production. FFP is a second-line option if PCC is unavailable but is inferior due to slower administration, larger volume requirement, and less predictable INR correction. Tranexamic acid is an antifibrinolytic that may have a role in non-anticoagulant ICH but does not reverse warfarin's effect on clotting factors. Target INR < 1.3 should be achieved within 60 minutes of presentation.",
    learningObjective: "Prioritize 4-factor PCC for immediate INR reversal in warfarin-associated intracerebral hemorrhage",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Intracerebral Hemorrhage",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Vitamin K takes 6-24 hours to work - it must be given WITH PCC but cannot replace the need for immediate reversal",
    clinicalPearls: [
      "4F-PCC reverses warfarin INR within 15-30 minutes",
      "Give vitamin K 10 mg IV concurrently with PCC for sustained reversal",
      "Target INR < 1.3 within 60 minutes of presentation",
      "Hemorrhage expansion occurs in 70% of warfarin-associated ICH without rapid reversal"
    ],
    safetyNote: "Recheck INR 30 minutes after PCC administration to confirm adequate reversal - repeat PCC if INR remains > 1.3",
    distractorRationales: [
      "Vitamin K is too slow for emergency reversal (6-24 hours) but should be given concurrently with PCC",
      "4F-PCC provides immediate INR reversal and is first-line for warfarin-associated ICH",
      "FFP is second-line due to slower administration and larger volume requirement",
      "Tranexamic acid does not reverse warfarin's anticoagulant effect"
    ],
    lessonLink: "/emergency/lessons/intracerebral-hemorrhage"
  },
  {
    stem: "A 30-year-old female presents with severe headache, fever (39.5°C), neck stiffness, and photophobia. She has a petechial rash on her trunk and extremities. Kernig's and Brudzinski's signs are positive. Which organism is most likely and what should the nurse prepare?",
    options: [
      "Streptococcus pneumoniae - prepare IV vancomycin only",
      "Neisseria meningitidis - prepare IV ceftriaxone and dexamethasone within 15-20 minutes",
      "Herpes simplex virus - prepare IV acyclovir",
      "Listeria monocytogenes - prepare IV ampicillin"
    ],
    correctAnswer: 1,
    rationaleLong: "The clinical presentation of acute bacterial meningitis with a petechial rash is highly suggestive of Neisseria meningitidis (meningococcal meningitis). The petechial/purpuric rash is the hallmark of meningococcal disease, occurring in 50-80% of cases, and results from meningococcal septicemia (bloodstream infection) causing disseminated intravascular coagulation (DIC) and vasculitis. The rash typically starts as petechiae that can rapidly progress to purpura and ecchymoses. The classic signs of bacterial meningitis are present: headache, fever, neck stiffness (nuchal rigidity), photophobia, and positive meningeal signs (Kernig's sign - pain with knee extension when hip is flexed; Brudzinski's sign - involuntary flexion of knees when neck is flexed). The emergency nurse should prepare for: (1) IV antibiotics administered within 15-20 minutes of arrival - do NOT delay for lumbar puncture or imaging. Empiric coverage for bacterial meningitis includes IV ceftriaxone 2 grams AND IV vancomycin 15-20 mg/kg (to cover resistant S. pneumoniae). (2) IV dexamethasone 0.15 mg/kg should be given 15-30 minutes BEFORE or concurrent with the first dose of antibiotics (shown to reduce mortality and hearing loss in pneumococcal meningitis and may benefit other bacterial causes). (3) Blood cultures should be drawn before antibiotics but should NOT delay antibiotic administration. (4) Lumbar puncture when feasible (CSF findings: elevated WBC with neutrophil predominance, elevated protein, low glucose, positive Gram stain/culture). (5) Droplet precautions should be implemented for suspected meningococcal disease. (6) Close contacts need chemoprophylaxis (ciprofloxacin or rifampin).",
    learningObjective: "Recognize meningococcal meningitis by petechial rash and initiate antibiotics with dexamethasone within 15-20 minutes",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Bacterial Meningitis",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "NEVER delay antibiotics for LP or CT in suspected bacterial meningitis - antibiotics within minutes saves lives",
    clinicalPearls: [
      "Petechial rash + meningitis signs = meningococcal disease until proven otherwise",
      "Antibiotics within 15-20 minutes - do not delay for LP or imaging",
      "Dexamethasone BEFORE or concurrent with first antibiotic dose",
      "Implement droplet precautions and arrange chemoprophylaxis for close contacts"
    ],
    safetyNote: "Meningococcal disease is communicable via respiratory droplets - implement droplet precautions immediately and notify public health",
    distractorRationales: [
      "S. pneumoniae is the most common cause of bacterial meningitis overall but petechial rash points to meningococcus",
      "N. meningitidis with its characteristic petechial rash is most likely; ceftriaxone + dexamethasone is correct",
      "HSV encephalitis presents differently with temporal lobe symptoms, not petechial rash",
      "Listeria typically affects neonates, elderly, and immunocompromised - not young healthy adults"
    ],
    lessonLink: "/emergency/lessons/bacterial-meningitis"
  },
  {
    stem: "A 50-year-old male presents with progressive bilateral leg weakness over 6 hours. He reports urinary retention that started today. On examination, he has a sensory level at T10 with loss of sensation below the umbilicus. Deep tendon reflexes are hyperreflexic in the lower extremities. What is the emergency nurse's priority?",
    options: [
      "Obtain CT lumbar spine for suspected cauda equina syndrome",
      "Obtain emergent MRI of the entire spine for suspected spinal cord compression",
      "Administer IV methylprednisolone 30 mg/kg for acute spinal cord injury",
      "Obtain EMG to differentiate between upper and lower motor neuron disease"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with acute spinal cord compression, evidenced by: bilateral leg weakness (paraparesis), urinary retention (autonomic dysfunction), a definite sensory level at T10 (loss of sensation below the umbilicus), and hyperreflexic lower extremities (upper motor neuron signs). Acute spinal cord compression is a neurological emergency requiring emergent MRI of the entire spine (not just the area of suspected compression) because: (1) multiple levels of compression may exist (especially in metastatic disease), (2) the clinical sensory level may not accurately correspond to the anatomic level of compression, and (3) MRI provides the best detail of the spinal cord, epidural space, and surrounding structures. The most common causes of acute spinal cord compression include: epidural metastatic disease (most common in adults), epidural abscess, disc herniation, vertebral fracture, and epidural hematoma (especially in anticoagulated patients). The distinction from cauda equina syndrome (CES) is important: CES affects the nerve roots below L1-L2 and causes LOWER motor neuron signs (flaccid paralysis, areflexia, saddle anesthesia), while spinal cord compression causes UPPER motor neuron signs (spastic paralysis, hyperreflexia, Babinski sign positive). This patient has upper motor neuron findings (hyperreflexia), confirming cord compression rather than cauda equina syndrome. CT spine can miss epidural soft tissue pathology (abscess, tumor) - MRI is far superior. High-dose methylprednisolone for spinal cord injury is controversial and largely fallen out of favor in traumatic SCI; in malignant cord compression, dexamethasone (not methylprednisolone) is used. Treatment of malignant cord compression includes high-dose dexamethasone (10 mg IV then 4 mg IV every 6 hours) and emergent radiation therapy or surgical decompression.",
    learningObjective: "Recognize acute spinal cord compression and obtain emergent MRI of the entire spine for diagnosis",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Spinal Cord Emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Hyperreflexia = upper motor neuron (cord compression); areflexia = lower motor neuron (cauda equina)",
    clinicalPearls: [
      "Spinal cord compression: bilateral weakness + sensory level + hyperreflexia + urinary retention",
      "MRI entire spine (not just area of suspected compression) to detect all lesion levels",
      "UMN signs (hyperreflexia, Babinski) = cord compression vs LMN signs (areflexia) = cauda equina",
      "Malignant cord compression: dexamethasone 10 mg IV stat, then radiation or surgical decompression"
    ],
    safetyNote: "Spinal cord compression is a time-sensitive emergency - delays in diagnosis and treatment result in permanent paraplegia",
    distractorRationales: [
      "Cauda equina causes LMN signs (areflexia) - this patient has UMN signs (hyperreflexia)",
      "MRI of entire spine is the correct imaging modality for suspected cord compression",
      "High-dose methylprednisolone is controversial for SCI and not the priority over imaging",
      "EMG is for chronic evaluation, not acute spinal cord emergency"
    ],
    lessonLink: "/emergency/lessons/spinal-cord-emergencies"
  },
  {
    stem: "A 65-year-old female presents with acute onset of double vision (diplopia), drooping eyelids (ptosis), difficulty swallowing (dysphagia), and progressive generalized weakness that worsens with activity. She was recently diagnosed with myasthenia gravis. Her FVC is 1.2 L (predicted 2.8 L). What condition is developing?",
    options: [
      "Cholinergic crisis from excessive pyridostigmine",
      "Myasthenic crisis with impending respiratory failure",
      "Lambert-Eaton myasthenic syndrome",
      "Botulism from foodborne toxin exposure"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient is developing myasthenic crisis, defined as worsening of myasthenia gravis (MG) to the point of respiratory failure requiring mechanical ventilation or intensive monitoring. The clinical presentation includes worsening of characteristic MG symptoms: diplopia, ptosis, dysphagia, and generalized weakness that worsens with activity (fatigable weakness is the hallmark of MG). The critical finding is the severely reduced forced vital capacity (FVC) of 1.2 L compared to predicted 2.8 L - a reduction to approximately 43% of predicted. The FVC is the most important bedside measurement for monitoring respiratory function in myasthenic crisis. Intubation should be considered when: (1) FVC < 20 mL/kg or < 1 L, (2) NIF (negative inspiratory force) < -30 cm H2O, or (3) clinical signs of respiratory distress (tachypnea, use of accessory muscles, paradoxical abdominal breathing, inability to count to 20 in one breath). This patient's FVC of 1.2 L is approaching the intubation threshold and is trending toward respiratory failure. Common triggers for myasthenic crisis include: infection, surgery, medication changes (corticosteroid initiation, aminoglycosides, beta-blockers, fluoroquinolones, magnesium), emotional stress, and pregnancy. Treatment includes: (1) ICU admission for close respiratory monitoring, (2) IV immunoglobulin (IVIG) 0.4 g/kg/day for 5 days or plasmapheresis (5-6 exchanges over 10-14 days), (3) avoidance of medications that worsen MG. Cholinergic crisis is the opposite scenario - excessive acetylcholine from too much pyridostigmine, which presents with SLUDGE symptoms (salivation, lacrimation, urination, defecation, GI cramping, emesis) and miosis. An edrophonium (Tensilon) test can differentiate the two.",
    learningObjective: "Recognize myasthenic crisis and monitor FVC for impending respiratory failure requiring intubation",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Myasthenic Crisis",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "FVC < 20 mL/kg or < 1 L = intubate in myasthenic crisis; don't wait for ABG changes or clinical deterioration",
    clinicalPearls: [
      "FVC monitoring every 2-4 hours is the most important assessment in myasthenic crisis",
      "Intubation criteria: FVC < 20 mL/kg OR < 1 L OR NIF < -30 cm H2O",
      "Treatment: IVIG or plasmapheresis (both equally effective)",
      "Avoid: aminoglycosides, beta-blockers, fluoroquinolones, magnesium in MG patients"
    ],
    safetyNote: "Multiple common medications worsen MG (aminoglycosides, magnesium, beta-blockers, fluoroquinolones) - always check drug interactions",
    distractorRationales: [
      "Cholinergic crisis presents with SLUDGE symptoms (excess ACh), not fatigable weakness",
      "Myasthenic crisis with declining FVC indicates impending respiratory failure",
      "Lambert-Eaton causes proximal weakness that IMPROVES with activity (opposite of MG)",
      "Botulism causes descending paralysis starting with cranial nerves, not fatigable weakness"
    ],
    lessonLink: "/emergency/lessons/myasthenic-crisis"
  },
  {
    stem: "A 78-year-old female is brought to the ED by family who noticed she has been increasingly confused over the past 3 days. She is oriented only to person, has visual hallucinations, and her attention fluctuates during the exam. She was recently started on oxybutynin for urinary incontinence. Which condition should the emergency nurse recognize?",
    options: [
      "Acute dementia onset requiring neuropsychiatric evaluation",
      "Delirium likely precipitated by anticholinergic medication",
      "Acute psychotic episode requiring antipsychotic medication",
      "Non-convulsive status epilepticus causing altered mental status"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with classic delirium, characterized by: (1) acute onset (3 days), (2) fluctuating course, (3) inattention, (4) altered level of consciousness (confusion), and (5) visual hallucinations (more common in delirium than in psychiatric disorders, where auditory hallucinations predominate). The likely precipitant is oxybutynin, which is an anticholinergic medication. Anticholinergic medications are one of the most common causes of delirium in elderly patients. Oxybutynin crosses the blood-brain barrier and blocks central muscarinic receptors, disrupting cholinergic neurotransmission that is essential for attention, memory, and consciousness. Other common anticholinergic medications that cause delirium include: diphenhydramine (Benadryl), hydroxyzine, promethazine, tricyclic antidepressants, and first-generation antipsychotics. The Confusion Assessment Method (CAM) is the standard screening tool for delirium: (1) acute onset with fluctuating course, AND (2) inattention, PLUS either (3) disorganized thinking OR (4) altered level of consciousness. Key differences between delirium and dementia: delirium has acute onset and fluctuating course; dementia has gradual onset and progressive course. Delirium has prominent inattention; dementia has prominent memory loss. Delirium is usually reversible; dementia is not. Delirium requires urgent evaluation for precipitating causes. Management includes: (1) identify and treat the precipitating cause (discontinue oxybutynin), (2) non-pharmacological measures (reorientation, adequate lighting, sleep hygiene, family presence), (3) avoid restraints when possible, and (4) use low-dose haloperidol 0.5-1 mg only for severe agitation that threatens safety.",
    learningObjective: "Recognize delirium in elderly patients and identify anticholinergic medications as a common precipitant",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Delirium",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Visual hallucinations suggest delirium (organic cause); auditory hallucinations suggest psychiatric disorder",
    clinicalPearls: [
      "CAM criteria: acute onset + fluctuating course + inattention + (disorganized thinking OR altered consciousness)",
      "Delirium: acute, fluctuating, reversible; Dementia: gradual, progressive, irreversible",
      "Common anticholinergics causing delirium: oxybutynin, diphenhydramine, TCAs, hydroxyzine",
      "Visual hallucinations = organic/medical cause until proven otherwise"
    ],
    safetyNote: "Always review medication lists in elderly patients with altered mental status - anticholinergic burden is a common reversible cause",
    distractorRationales: [
      "Dementia has gradual onset over months/years, not acute onset over 3 days",
      "Delirium precipitated by anticholinergic medication is the correct diagnosis",
      "Psychotic episodes are less likely in an elderly patient without psychiatric history, and visual hallucinations suggest organic cause",
      "NCSE is possible but the temporal correlation with oxybutynin makes anticholinergic delirium more likely"
    ],
    lessonLink: "/emergency/lessons/delirium"
  },
  {
    stem: "A 42-year-old male presents with severe headache and left eye pain. He has a fixed, dilated left pupil with the eye deviated downward and laterally. He has complete ptosis of the left eyelid. Which cranial nerve is affected and what is the most concerning etiology?",
    options: [
      "CN IV (trochlear) palsy from brainstem infarction",
      "CN III (oculomotor) palsy from posterior communicating artery aneurysm compression",
      "CN VI (abducens) palsy from increased intracranial pressure",
      "CN VII (facial) palsy from acoustic neuroma"
    ],
    correctAnswer: 1,
    rationaleLong: "The clinical presentation of a complete CN III (oculomotor nerve) palsy includes: (1) ptosis (drooping eyelid - CN III innervates the levator palpebrae superioris), (2) fixed, dilated pupil (mydriasis - CN III carries parasympathetic fibers to the pupillary sphincter), (3) eye deviated 'down and out' (the eye moves downward from the unopposed action of CN IV/superior oblique muscle and laterally from the unopposed action of CN VI/lateral rectus muscle). The most concerning etiology for an acute, painful CN III palsy with pupil involvement is compression by a posterior communicating artery (PComm) aneurysm. The parasympathetic fibers that control pupillary constriction run on the outside (superficial surface) of CN III, making them the first fibers affected by external compression from an expanding aneurysm. This is why pupil involvement (fixed dilated pupil) in CN III palsy raises immediate concern for aneurysmal compression. A PComm aneurysm can rupture and cause subarachnoid hemorrhage, which carries 50% mortality. This is a neurosurgical emergency requiring: (1) emergent CT angiography (CTA) or conventional cerebral angiography to identify the aneurysm, (2) CT head to evaluate for SAH, (3) neurosurgical consultation for aneurysm repair (surgical clipping or endovascular coiling). In contrast, a CN III palsy that SPARES the pupil (no pupil dilation) is more commonly caused by microvascular ischemia (diabetes, hypertension) rather than compression, because the parasympathetic fibers on the surface are relatively spared while the deeper motor fibers are affected by small vessel ischemia. CN IV palsy would cause difficulty with downward gaze. CN VI palsy causes inability to abduct the eye. CN VII palsy causes facial weakness.",
    learningObjective: "Recognize CN III palsy with pupil involvement as a potential sign of posterior communicating artery aneurysm",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Cranial Nerve Emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "CN III palsy WITH pupil involvement = aneurysm until proven otherwise; WITHOUT pupil involvement = likely microvascular",
    clinicalPearls: [
      "CN III palsy: ptosis + fixed dilated pupil + eye deviated down and out",
      "Pupil-involving CN III palsy = PComm aneurysm until proven otherwise",
      "Pupil-sparing CN III palsy = likely microvascular (diabetes, HTN)",
      "Parasympathetic fibers run on the surface of CN III - first affected by external compression"
    ],
    safetyNote: "Painful CN III palsy with pupil involvement requires emergent CTA - a PComm aneurysm can rupture and cause fatal SAH",
    distractorRationales: [
      "CN IV palsy causes difficulty with downward gaze, not ptosis or pupil dilation",
      "CN III palsy from PComm aneurysm compression is the correct diagnosis based on clinical findings",
      "CN VI palsy causes inability to abduct the eye, not this clinical pattern",
      "CN VII palsy causes facial weakness, not eye movement or pupil abnormalities"
    ],
    lessonLink: "/emergency/lessons/cranial-nerve-emergencies"
  },
  {
    stem: "A 55-year-old male presents with acute onset left facial droop, left arm drift, and slurred speech. His symptoms have been fluctuating over the past 45 minutes - improving and worsening multiple times. Current NIHSS is 4. What is this pattern most suggestive of and what should the emergency nurse anticipate?",
    options: [
      "Completed ischemic stroke with stable deficits",
      "Transient ischemic attack that has fully resolved",
      "Crescendo TIA / stuttering stroke indicating impending large vessel occlusion",
      "Complex migraine with aura mimicking stroke symptoms"
    ],
    correctAnswer: 2,
    rationaleLong: "The pattern of fluctuating neurological deficits that improve and worsen multiple times over a short period is highly concerning for a crescendo TIA or stuttering stroke. This pattern indicates an unstable atherosclerotic plaque or near-occlusive thrombus that is intermittently occluding a major cerebral artery, causing transient ischemia that repeatedly resolves as blood flow is temporarily restored. This is a neurovascular emergency because: (1) the risk of completed stroke within 48 hours is extremely high (up to 20% in crescendo TIA), (2) each episode of ischemia represents further injury to the brain tissue in the affected vascular territory, and (3) complete vessel occlusion can occur at any moment. The emergency nurse should: (1) treat this as an acute stroke - activate the stroke team immediately, (2) obtain emergent CT head and CT angiography to identify the culprit vessel, (3) prepare for possible IV alteplase if symptoms are present at the time of imaging (fluctuating deficits are within the treatment window when currently symptomatic), (4) anticipate dual antiplatelet therapy (aspirin + clopidogrel for 21 days per the CHANCE/POINT trials for minor stroke/TIA), (5) obtain urgent carotid imaging if not included in CTA, (6) monitor neurological status with NIHSS every 15 minutes, and (7) prepare for possible endovascular intervention if large vessel occlusion is identified. A completed stroke would have stable, non-fluctuating deficits. A TIA has fully resolved by definition. Complex migraine typically has gradual onset with spreading symptoms (march) rather than the abrupt onset and fluctuation seen here.",
    learningObjective: "Recognize crescendo TIA/stuttering stroke as a high-risk pattern indicating impending complete vascular occlusion",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Transient Ischemic Attack",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Fluctuating neurological deficits = unstable thrombus at high risk of complete occlusion - treat as stroke emergency",
    clinicalPearls: [
      "Crescendo TIA: multiple episodes of fluctuating deficits = impending stroke emergency",
      "Risk of completed stroke in crescendo TIA: up to 20% within 48 hours",
      "ABCD2 score helps risk-stratify TIA but crescendo pattern is always high-risk",
      "Dual antiplatelet (ASA + clopidogrel x 21 days) reduces stroke risk after TIA/minor stroke"
    ],
    safetyNote: "Never discharge a patient with crescendo/fluctuating neurological symptoms - they need emergent evaluation and monitoring",
    distractorRationales: [
      "Completed stroke has stable, non-fluctuating deficits",
      "TIA has fully resolved - this patient has ongoing fluctuating symptoms",
      "Crescendo TIA/stuttering stroke is the correct diagnosis based on fluctuating deficits",
      "Migraine with aura has gradual onset with spreading symptoms, not abrupt fluctuation"
    ],
    lessonLink: "/emergency/lessons/tia-management"
  },
  {
    stem: "A 22-year-old college student presents with fever, severe headache, altered mental status, and new-onset temporal lobe seizures. MRI shows temporal lobe edema and hemorrhagic changes. What is the most likely diagnosis and what should the emergency nurse prepare?",
    options: [
      "Bacterial meningitis - prepare IV ceftriaxone and vancomycin",
      "Herpes simplex encephalitis - prepare IV acyclovir 10 mg/kg every 8 hours",
      "Autoimmune encephalitis - prepare IV methylprednisolone pulse therapy",
      "Cerebral abscess - prepare for stereotactic drainage"
    ],
    correctAnswer: 1,
    rationaleLong: "The combination of fever, headache, altered mental status, temporal lobe seizures, and MRI showing temporal lobe edema with hemorrhagic changes is the classic presentation of herpes simplex encephalitis (HSE). HSE is caused by herpes simplex virus type 1 (HSV-1) in adults and has a predilection for the temporal lobes due to the virus traveling along the olfactory and trigeminal nerve pathways to the temporal and frontal lobes. Without treatment, HSE has a mortality rate of approximately 70%, making it the most important treatable cause of viral encephalitis. With early acyclovir treatment, mortality decreases to 15-20%. IV acyclovir 10 mg/kg every 8 hours should be initiated immediately upon clinical suspicion - do NOT wait for confirmatory testing. The treatment duration is typically 14-21 days. Confirmatory diagnosis is made by CSF PCR for HSV, which has a sensitivity of 96-98% and specificity of 95-99%. CSF findings in HSE typically show: lymphocytic pleocytosis, elevated protein, normal or slightly decreased glucose, and red blood cells (from the hemorrhagic nature of the infection). The key distinguishing features from bacterial meningitis include: the temporal lobe predilection on imaging, temporal lobe seizures, and CSF showing lymphocytic (not neutrophilic) predominance. However, empiric antibiotic coverage for bacterial meningitis should also be given until CSF analysis results are available. Autoimmune encephalitis (anti-NMDA receptor encephalitis) affects young women and presents with psychiatric symptoms and movement disorders. Cerebral abscess typically shows a ring-enhancing lesion with surrounding edema.",
    learningObjective: "Recognize herpes simplex encephalitis by temporal lobe involvement and initiate IV acyclovir immediately",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Encephalitis",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Start acyclovir on clinical suspicion of HSE - do NOT wait for CSF PCR results; untreated mortality is 70%",
    clinicalPearls: [
      "HSE has temporal lobe predilection: temporal seizures + temporal lobe MRI changes",
      "Untreated HSE mortality: 70%; with early acyclovir: 15-20%",
      "CSF PCR for HSV has 96-98% sensitivity",
      "Acyclovir dose: 10 mg/kg IV every 8 hours for 14-21 days"
    ],
    safetyNote: "Acyclovir can cause nephrotoxicity - ensure adequate hydration and monitor renal function during treatment",
    distractorRationales: [
      "Bacterial meningitis does not typically show temporal lobe hemorrhagic changes on MRI",
      "HSE is the correct diagnosis based on temporal lobe predilection and hemorrhagic changes",
      "Autoimmune encephalitis presents with psychiatric symptoms and movement disorders",
      "Cerebral abscess shows ring-enhancing lesion, not diffuse temporal lobe involvement"
    ],
    lessonLink: "/emergency/lessons/encephalitis"
  },
  {
    stem: "A 48-year-old male presents with sudden onset of complete paralysis of the right side of his face, including the forehead. He cannot close his right eye or raise his right eyebrow. He has no other neurological deficits. How does this presentation differ from a stroke-related facial weakness?",
    options: [
      "It doesn't differ - both stroke and Bell's palsy cause complete facial paralysis",
      "Bell's palsy affects the entire face including forehead; stroke spares the forehead",
      "Stroke affects the entire face including forehead; Bell's palsy spares the forehead",
      "The difference can only be determined by MRI imaging"
    ],
    correctAnswer: 1,
    rationaleLong: "The distinction between peripheral facial nerve palsy (Bell's palsy) and central facial weakness (stroke) is one of the most important neurological assessments in emergency nursing. In Bell's palsy (peripheral CN VII lesion), the ENTIRE ipsilateral face is affected, including the forehead - the patient cannot close the eye, raise the eyebrow, or wrinkle the forehead on the affected side. In stroke-related facial weakness (central/upper motor neuron lesion), the forehead is SPARED on the affected side - the patient CAN still raise the eyebrow and wrinkle the forehead because the upper face receives bilateral cortical innervation. Here's the anatomy: the motor cortex on each side sends fibers to BOTH facial nerve nuclei for the upper face (bilateral innervation), but only to the CONTRALATERAL facial nerve nucleus for the lower face. Therefore, a stroke affecting one motor cortex loses innervation to only the contralateral lower face (the upper face is still innervated by the intact hemisphere). In contrast, a peripheral CN VII lesion (Bell's palsy) affects ALL fibers to the ipsilateral face, causing complete facial paralysis on that side. This patient has complete right facial paralysis including the forehead, consistent with Bell's palsy (peripheral CN VII palsy), not stroke. Bell's palsy treatment includes: (1) prednisone 60-80 mg daily for 7 days (started within 72 hours), (2) eye protection (artificial tears, eye patch, taping the eye shut at night to prevent corneal exposure), and (3) antiviral therapy (valacyclovir) is controversial but often given in combination with steroids. Recovery occurs in 70-85% of cases within 3-6 months.",
    learningObjective: "Differentiate Bell's palsy (entire face including forehead) from stroke-related facial weakness (forehead spared)",
    blueprintCategory: "Neurological Emergencies",
    subtopic: "Cranial Nerve Emergencies",
    difficulty: 2,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Forehead INVOLVED = peripheral (Bell's palsy); Forehead SPARED = central (stroke)",
    clinicalPearls: [
      "Bell's palsy: entire ipsilateral face paralyzed including forehead (peripheral CN VII)",
      "Stroke: forehead spared, lower face affected contralateral to lesion (central/UMN)",
      "Upper face has bilateral cortical innervation; lower face has only contralateral innervation",
      "Bell's palsy treatment: prednisone within 72 hours + eye protection"
    ],
    safetyNote: "Eye protection is critical in Bell's palsy - inability to close the eye causes corneal drying, ulceration, and potential vision loss",
    distractorRationales: [
      "Bell's palsy and stroke cause distinctly different patterns of facial weakness",
      "Bell's palsy affects the entire face; stroke spares the forehead",
      "This answer reverses the correct pattern",
      "Clinical examination reliably differentiates peripheral from central facial weakness without MRI"
    ],
    lessonLink: "/emergency/lessons/cranial-nerve-emergencies"
  }
];
